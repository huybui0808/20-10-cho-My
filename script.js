/* =====================================================================
   WEB 20-10 — script.js (bản 3)
   Mọi thứ cần chỉnh (mật khẩu, tên file, danh sách ảnh, lời chúc) nằm ở khối CONFIG / PHOTOS / WISHES.
   Hiệu năng: chỉ animate transform + opacity; cảnh vũ trụ chạy bằng MỘT vòng requestAnimationFrame chung.
   ===================================================================== */
(() => {
  "use strict";
  const CONFIG = {
    password: "27112008", // 27/11/2008
    toName: "Vũ Đặng Thảo My",
    fromName: "Bùi Trung Huy",
    qrImage: "anhMy/Anhqrcholap.png",
    music: ["Nhacrieng.mp3", "anhMy/Nhacrieng.mp3"], // file nhạc cảnh vũ trụ + phong bì (thử lần lượt từng đường dẫn)
    volume: 1, // ÂM LƯỢNG GỐC: 0 (tắt) -> 1 (to nhất của trình duyệt). Không vượt quá 1 được.
    boost: 1.8, // KHUẾCH ĐẠI THÊM: 1 = giữ nguyên, 1.5-2.5 = to hơn nữa. Quá cao có thể rè -> hạ xuống nếu nghe bị vỡ tiếng.
    fadeIn: 3000, // ms nhạc từ nhỏ lên to (tăng = lên chậm và êm hơn)
    video: ["VideoMy.mp4", "anhMy/VideoMy.mp4"],
    imgDir: "anhMy/",
    // ----- CẢNH VŨ TRỤ -----
    spawnEvery: 0.65, // giây giữa 2 vật thể bay lên. TĂNG = ít vật thể cùng lúc, thưa và nhẹ hơn. GIẢM = dày hơn
    flyFor: 27000, // ms từ lúc ảnh bắt đầu bay đến khi hiện nút "Xem tiếp"
    wishWordMs: 70, // ms giữa 2 chữ khi hiện lời chúc trên lá thư (tăng = hiện chậm hơn). Nhớ chỉnh cùng số trong style.css (--wd)
  };
  const ZOOM_MIN = 0.5,
    ZOOM_MAX = 3.5; // giới hạn phóng to/thu nhỏ toàn cảnh (nhỏ nhất, lớn nhất)
  const rng = (n, p) => Array.from({ length: n }, (_, i) => p + (i + 1));
  // Danh sách ảnh bay (chỉ ghi tên, không cần .png). Thêm ảnh mới: thêm tên vào đây.
  const PHOTOS = [
    ...rng(22, "Anhtiktok"),
    ...rng(4, "Anhaodai").map((n, i) => "Anhaodai" + (i + 2)),
    "Anhcanhan1",
    "Anhcanhan2",
    ...rng(5, "Anhchandung"),
    ...rng(5, "Anhhocsinh"),
  ];
  // 6 ảnh bay ra từ phong bì: [tên, x%, y%, độ nghiêng]
  const FLY = [
    ["Anhhocsinh3", 0.18, 0.085, -8],
    ["Anhchandung1", 0.5, 0.085, 3],
    ["Anhaodai2", 0.82, 0.085, 8],
    ["Anhchandung3", 0.17, 0.83, -7],
    ["Anhtiktok15", 0.5, 0.83, 4],
    ["Anhtiktok5", 0.83, 0.83, 7],
  ];
  // Câu chúc về ngành, ghép vào cuối lời chúc (để lời chúc đủ ~120 chữ)
  const CHEM = [
    "Chúc bạn học thật tốt ngành Kỹ thuật hóa học tại Đại học Mỏ - Địa chất, để mỗi phản ứng trong phòng thí nghiệm đều thành công và mỗi bài thực hành đều đạt kết quả như mong đợi.",
    "Mong bạn luôn đủ đam mê để chinh phục những bài toán hóa học khó, và mái trường Mỏ - Địa chất sẽ cho bạn thật nhiều kỷ niệm đẹp.",
    "Chúc cô sinh viên Kỹ thuật hóa học của Đại học Mỏ - Địa chất luôn thông minh, cẩn thận và tỏa sáng như một chất xúc tác tuyệt vời cho mọi điều tốt đẹp.",
    "Chúc bạn có những buổi thí nghiệm an toàn, những bài kiểm tra điểm cao và một tương lai rực rỡ trên con đường kỹ sư hóa học tại Đại học Mỏ - Địa chất.",
    "Mong mọi công thức trong cuộc sống của bạn đều cân bằng: học tập tiến bộ, tình bạn bền chặt, sức khỏe dồi dào và hạnh phúc ngập tràn.",
    "Chúc bạn như một phản ứng hoàn hảo của tuổi trẻ: nhiều năng lượng, ít tạp chất và thật nhiều niềm vui khi học Kỹ thuật hóa học ở Đại học Mỏ - Địa chất.",
  ];

  // 20 lời chúc dài (~100 chữ) cho thiệp — mỗi lần mở sẽ chọn ngẫu nhiên 1 lời
  const WISHES = [
    "Nhân ngày Quốc tế Phụ nữ Việt Nam 20-10, mình chúc bạn luôn là cô gái rạng rỡ như đóa hoa đầu mùa. Mong mỗi sáng thức dậy bạn đều thấy lòng nhẹ nhàng, mỗi ngày trôi qua đều có một niềm vui nhỏ gõ cửa. Chúc bạn học tập thật tốt, gặp nhiều may mắn và luôn tự tin theo đuổi những ước mơ của mình. Dù sau này bận rộn đến đâu, hãy nhớ dành thời gian yêu thương bản thân, vì bạn xứng đáng với tất cả những điều dịu dàng và tốt đẹp nhất trên đời. Chúc bạn một ngày 20-10 thật ngọt ngào nhé!",
    "Hôm nay là ngày của những cô gái tuyệt vời, và bạn chính là một trong số đó. Mình chúc bạn luôn giữ được nụ cười tươi như nắng sớm, giữ được trái tim ấm áp và sự mạnh mẽ dịu dàng vốn có. Mong rằng mọi áp lực rồi sẽ nhẹ đi, mọi nỗ lực của bạn sẽ có ngày nở hoa thật rực rỡ. Chúc bạn có thật nhiều sức khỏe, bạn bè tốt bên cạnh và những kỷ niệm đẹp để mỗi lần nhớ lại đều thấy mỉm cười. Chúc bạn một ngày 20-10 trọn vẹn và đáng nhớ nhất!",
    "Chúc bạn một mùa 20-10 thật xinh, thật vui và thật nhiều quà nhé! Mong bạn sẽ luôn được yêu thương bởi gia đình, bạn bè và cả những người chỉ lặng lẽ quan tâm bạn từ xa. Chúc bạn lúc nào cũng tự tin là chính mình, không cần phải giống ai vẫn tỏa sáng theo cách riêng. Hy vọng những ngày tháng phía trước sẽ là chuỗi ngày bình yên, điểm cao, nụ cười nhiều và muộn phiền ít. Cảm ơn vì bạn đã xuất hiện và làm cho thế giới này đáng yêu hơn một chút. Chúc mừng ngày 20-10!",
    "Gửi đến bạn một bó hoa thật lớn làm từ những lời chúc chân thành nhất. Chúc bạn luôn khỏe mạnh để theo đuổi mọi điều mình thích, luôn đủ dũng cảm để bước tiếp khi gặp khó khăn và luôn đủ dịu dàng để thấy cuộc sống đẹp hơn mỗi ngày. Mong bạn sớm đạt được những mục tiêu đang ấp ủ, gặt hái thật nhiều thành công trên con đường học tập phía trước. Dù ở đâu, bạn cũng sẽ luôn là cô gái đáng yêu và đáng quý trong mắt mọi người. Chúc bạn 20-10 vui vẻ, hạnh phúc nhé!",
    "Ngày 20-10 đến rồi, mình xin gửi bạn những lời chúc nhẹ nhàng như cánh hoa đầu xuân. Chúc bạn luôn xinh đẹp từ trong tâm hồn, luôn vui vẻ dù ngoài kia trời nắng hay mưa. Chúc bạn có đôi chân đủ vững để đi qua mọi thử thách, đôi tay đủ ấm để nắm lấy hạnh phúc và một trái tim đủ rộng để thương mình nhiều hơn. Mong những điều tốt đẹp nhất sẽ tìm đến bạn đúng lúc bạn cần nhất. Hãy cứ cười thật tươi nhé, vì nụ cười của bạn thật sự rất đẹp. Chúc bạn một ngày thật ngọt ngào!",
    "Chúc bạn ngày Phụ nữ Việt Nam thật ý nghĩa! Mong bạn luôn là phiên bản rạng ngời và hạnh phúc nhất của chính mình. Chúc bạn mỗi buổi sáng đều có tâm trạng đẹp, mỗi buổi tối đều đi ngủ với một trái tim thanh thản và những giấc mơ ngọt ngào. Chúc mọi dự định của bạn đều suôn sẻ, mọi cố gắng đều được đền đáp xứng đáng, mọi ước mơ dù lớn hay nhỏ đều từng bước trở thành hiện thực. Và nếu có lúc mệt mỏi, hãy nhớ rằng luôn có những người sẵn sàng ở bên cạnh bạn. Chúc bạn 20-10 thật tuyệt!",
    "Có một cô gái tên My luôn khiến mọi thứ xung quanh trở nên dễ thương hơn, và hôm nay mình muốn nói rằng: cảm ơn bạn vì điều đó. Chúc bạn luôn giữ được sự trong sáng, tinh nghịch và cả sự kiên cường của tuổi trẻ. Chúc bạn học giỏi, điểm cao, gặp thật nhiều điều may mắn trên mọi chặng đường. Mong rằng mỗi ngày của bạn đều như một trang sách đẹp, có hoa, có nắng và có thật nhiều người thương yêu. Chúc bạn 20-10 vui vẻ, rạng rỡ và hạnh phúc nhé!",
    "Mình chúc bạn có một ngày 20-10 thật nhẹ nhàng như làn gió và ngọt ngào như một viên kẹo. Mong bạn luôn biết trân trọng bản thân mình, biết nghỉ ngơi khi mệt và biết mỉm cười khi mọi thứ chưa như ý. Chúc bạn có thật nhiều sức khỏe, nhiều niềm vui bất ngờ và nhiều người bạn tốt đồng hành. Hy vọng mỗi bước chân của bạn đều mang theo hoa thơm và may mắn, để rồi một ngày nào đó nhìn lại, bạn sẽ thấy mình đã đi được thật xa và thật đẹp. Chúc mừng ngày của bạn nhé!",
    "Nhân dịp 20-10, chúc bạn luôn là một đóa hoa kiêu hãnh, không cần chờ ai khen mới biết mình xinh đẹp. Chúc bạn có đủ bản lĩnh để chọn con đường mình yêu thích, đủ kiên trì để đi đến cùng và đủ may mắn để gặp những người tử tế trên đường đi. Mong thời gian sẽ thật dịu dàng với bạn, mang đến những điều bình yên và hạnh phúc đúng như bạn mong đợi. Cảm ơn bạn vì luôn là một cô gái đáng yêu. Chúc bạn một ngày 20-10 ngập tràn hoa và tiếng cười!",
    "Chúc bạn ngày 20-10 tràn đầy niềm vui! Mong rằng hôm nay bạn sẽ nhận được thật nhiều lời chúc, nhiều nụ cười và nhiều cái ôm ấm áp. Chúc bạn luôn học tập thật hiệu quả, giữ vững tinh thần lạc quan và không bao giờ đánh mất niềm tin vào bản thân. Dù có khó khăn thế nào, hãy nhớ bạn mạnh mẽ hơn bạn nghĩ rất nhiều. Mình tin rằng tương lai đang chờ bạn với những điều tuyệt vời, và bạn hoàn toàn xứng đáng với tất cả. Chúc bạn xinh đẹp, thành công và hạnh phúc mỗi ngày nhé!",
    "Một lời chúc nhỏ gửi đến cô gái đáng yêu trong ngày 20-10: mong bạn luôn bình an giữa những bộn bề, luôn vui giữa những áp lực và luôn ấm áp giữa những ngày giá lạnh. Chúc bạn có một trái tim biết yêu thương và cũng luôn được yêu thương lại thật nhiều. Chúc bạn không bao giờ cảm thấy cô đơn, vì bên cạnh bạn luôn có gia đình và những người bạn quý mến. Mong những ước mơ của bạn như hạt giống gặp nắng và mưa, rồi sẽ nảy mầm và nở thành những đóa hoa thật đẹp. Chúc bạn 20-10 vui vẻ!",
    "Hôm nay cả thế giới cùng tôn vinh những người phụ nữ và những cô gái tuyệt vời, trong đó có bạn. Mình chúc bạn luôn tỏa sáng theo cách riêng của mình, luôn tự tin với từng bước đi và luôn mỉm cười với những điều nhỏ bé xung quanh. Chúc bạn gặp nhiều thuận lợi trong học tập, nhiều may mắn trong cuộc sống và nhiều niềm vui trong từng khoảnh khắc. Mong bạn mãi giữ được nét hồn nhiên, trong trẻo này. Cảm ơn vì bạn đã là một người bạn đáng quý. Chúc bạn một ngày 20-10 thật xinh tươi!",
    "Chúc bạn có một ngày 20-10 đẹp như một bức tranh nhiều màu. Mong mọi buồn phiền hôm nay đều theo gió bay đi, chỉ còn lại nụ cười và niềm vui ở lại với bạn. Chúc bạn thật nhiều sức khỏe để chạm đến những điều mình mong muốn, thật nhiều bình yên để mỗi ngày trôi qua đều nhẹ nhàng, thật nhiều may mắn để những điều tốt đẹp luôn tìm đến. Hãy cứ sống thật vui, thật xinh và thật là chính mình nhé. Vì bạn đã đủ tuyệt vời rồi, và mình tin bạn sẽ còn tỏa sáng hơn nữa trong tương lai!",
    "Gửi bạn một lời chúc từ tận đáy lòng nhân ngày Phụ nữ Việt Nam. Chúc bạn lớn lên thật khỏe mạnh, xinh đẹp và hạnh phúc. Chúc bạn luôn có những người bạn tốt, những người thầy cô tận tâm và một gia đình luôn yêu thương hết lòng. Mong rằng bạn sẽ không bao giờ ngại thử những điều mới, không sợ vấp ngã, vì mỗi lần đứng dậy bạn lại mạnh mẽ hơn một chút. Mong những trang đẹp nhất của cuộc đời sẽ đến với bạn thật sớm và ở lại thật lâu. Chúc bạn 20-10 vui vẻ, ngọt ngào và đầy ý nghĩa!",
    "Mình chúc bạn có một ngày 20-10 thật rực rỡ và nhiều niềm vui. Chúc bạn mỗi ngày đều thức dậy với nụ cười, đến trường với tâm trạng háo hức và trở về nhà với những kỷ niệm đáng yêu. Chúc bạn luôn giữ vững ngọn lửa đam mê, không ngừng cố gắng để trở thành phiên bản tuyệt vời nhất. Mong rằng mọi cánh cửa đều rộng mở với bạn, mọi con đường đều có hoa và ánh nắng. Dù mai này có bận rộn đến đâu, mình cũng mong bạn luôn nhớ yêu thương bản thân thật nhiều. Chúc bạn xinh đẹp và hạnh phúc!",
    "Chúc cô gái dễ thương của chúng ta một ngày 20-10 thật trọn vẹn! Chúc bạn có thật nhiều điều để mong chờ, thật nhiều lý do để cười và thật nhiều người để thương. Mong bạn luôn nhớ rằng bạn quý giá hơn mình nghĩ, đáng yêu hơn mình tưởng và có thể làm được nhiều điều hơn mình dám mơ. Chúc bạn học hành tiến bộ, sức khỏe dồi dào, mọi chuyện suôn sẻ như ý. Nếu có ngày chưa vui, hãy tự nhủ rằng ngày mai sẽ là một ngày rạng rỡ hơn. Chúc bạn luôn bình yên và hạnh phúc nhé!",
    "Nhân ngày đặc biệt này, mình xin chúc bạn mọi điều tốt đẹp nhất. Chúc bạn luôn là cô gái duyên dáng, thông minh và giàu nghị lực, sống chan hòa và được mọi người yêu quý. Chúc bạn có đủ điểm số cao để vững vàng trên con đường mình chọn, đủ tự tin để nói lên điều mình nghĩ và đủ ấm áp để lan tỏa niềm vui cho người khác. Mong hạnh phúc sẽ đến với bạn nhẹ nhàng như làn gió xuân, bình dị mà bền lâu. Chúc bạn 20-10 vui vẻ, nhiều quà và thật nhiều nụ cười tỏa nắng!",
    "Một ngày thật xinh dành cho bạn đây! Chúc bạn luôn đáng yêu như một đóa hoa nhỏ, luôn lạc quan như tia nắng đầu ngày và luôn bình tĩnh như mặt hồ buổi sớm. Chúc bạn khỏe mạnh để làm mọi điều bạn muốn, bình an để không bao giờ phải lo lắng quá nhiều và vui vẻ để cuộc sống lúc nào cũng có màu hồng. Mong rằng những người đến bên bạn đều chân thành, những điều đến với bạn đều tử tế. Hãy cứ tỏa sáng thật rực rỡ nhé, vì bạn thật sự rất đặc biệt. Chúc mừng ngày 20-10!",
    "Chúc bạn 20-10 vui vẻ như chưa từng được vui! Mong rằng hôm nay có một điều bất ngờ nhỏ xinh đang chờ bạn ở đâu đó, như một bông hoa nở giữa ngày bận rộn. Chúc bạn lúc nào cũng được là chính mình, được yêu thương đúng như mình xứng đáng và được thực hiện những điều mình hằng mơ ước. Chúc bạn học tập thuận lợi, bạn bè luôn kề bên, gia đình luôn đầm ấm. Cảm ơn bạn vì đã là một cô gái đáng yêu và đáng nhớ. Chúc bạn thật nhiều niềm vui, thật nhiều thành công và thật nhiều hạnh phúc!",
    "Cuối cùng, mình muốn gửi bạn lời chúc dịu dàng nhất trong ngày 20-10. Chúc bạn mãi xinh tươi, mãi trẻ trung và mãi giữ được nụ cười trong trẻo ấy. Chúc bạn đi qua tuổi học trò thật đẹp, có nhiều kỷ niệm để nhớ, nhiều người để thương và nhiều điều để tự hào về bản thân. Mong rằng mọi cố gắng của bạn đều được ghi nhận, mọi giọt mồ hôi đều nở thành hoa. Hãy luôn tin rằng những điều đẹp đẽ nhất vẫn đang ở phía trước chờ bạn. Chúc bạn một ngày 20-10 thật hạnh phúc và ngập tràn yêu thương!",
  ];

  // Lời chúc ngắn rơi nhẹ nhàng ở phần huyền ảo
  const SHORT_WISHES = [
    "Luôn xinh đẹp và rạng rỡ",
    "Mỗi ngày đều là một ngày vui",
    "Thật nhiều sức khỏe",
    "Học giỏi, điểm cao",
    "Nụ cười luôn nở trên môi",
    "Hạnh phúc và bình yên",
    "Mọi điều ước đều thành sự thật",
    "Được yêu thương thật nhiều",
    "Tự tin tỏa sáng nhé",
    "Vạn sự như ý",
    "Ngày 20-10 thật ngọt ngào",
    "Bình an và may mắn",
    "Dịu dàng mà mạnh mẽ",
    "Mãi xinh, mãi trẻ, mãi vui",
    "Gặp toàn điều tốt đẹp",
    "Thành công ở mọi điều bạn chọn",
    "Mỗi ngày là một món quà",
    "Bạn bè luôn bên cạnh",
    "Tươi như hoa đầu xuân",
    "Thật nhiều niềm vui",
    "Chúc My luôn hạnh phúc",
    "Happy 20-10",
    "Mãi là cô gái đáng yêu",
    "Ngày nào cũng rạng ngời",
    "Trái tim luôn ấm áp",
    "Mọi dự định đều suôn sẻ",
  ];

  /* ---------------------------------------------------------------
   Tiện ích
   --------------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const frame = () =>
    new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const IMG = (n) => `${CONFIG.imgDir}${n}.png`;
  const reflow = (el) => void el.offsetWidth;

  const params = new URLSearchParams(location.search);
  const force = params.get("force");
  const mqDesktop = window.matchMedia(
    "(min-width:1025px) and (hover:hover) and (pointer:fine)",
  );
  const isDesktop = () =>
    force === "desktop" ? true : force === "mobile" ? false : mqDesktop.matches;

  // Máy yếu -> giảm số lượng hạt/hiệu ứng nền
  const LITE =
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 4) <= 3 ||
    window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  const preloaded = new Map();
  function preload(src) {
    if (preloaded.has(src)) return preloaded.get(src);
    const im = new Image();
    im.decoding = "async";
    im.src = src;
    const p = (im.decode ? im.decode() : Promise.resolve()).catch(() => {});
    preloaded.set(src, p);
    return p;
  }

  /* ---------------------------------------------------------------
   Sprites SVG (hoa, tim, cánh hoa...) — vẽ bo tròn, mềm mại
   --------------------------------------------------------------- */
  function buildSprites() {
    const rot = (n, f) =>
      Array.from({ length: n }, (_, i) => f((i * 360) / n)).join("");
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="gEnvIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ee7aa3"/><stop offset="1" stop-color="#d94d82"/></linearGradient>
  <linearGradient id="gFlapOut" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc3d8"/><stop offset="1" stop-color="#ff9dc0"/></linearGradient>
  <linearGradient id="gFlapIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f08bb0"/><stop offset="1" stop-color="#df5a8b"/></linearGradient>
  <linearGradient id="gFront" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffcfe0"/><stop offset="1" stop-color="#ffa6c6"/></linearGradient>
</defs>
<symbol id="heart" viewBox="0 0 32 29.6"><path fill="currentColor" d="M23.6 0c-3.4 0-6.3 2.7-7.6 5.6C14.7 2.7 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.4 9.5 11.9 16 21.2 6.1-9.3 16-12.1 16-21.2C32 3.8 28.2 0 23.6 0z"/></symbol>
<symbol id="sparkle" viewBox="0 0 100 100"><path fill="currentColor" d="M50 0Q54 46 100 50Q54 54 50 100Q46 54 0 50Q46 46 50 0Z"/></symbol>
<symbol id="petal" viewBox="0 0 40 50"><path fill="currentColor" d="M20 0C40 12 42 40 20 50 -2 40 0 12 20 0z"/></symbol>
<symbol id="f-rose" viewBox="0 0 100 100">
  <g fill="#ff9bbd">${rot(5, (a) => `<ellipse cx="50" cy="21" rx="19" ry="21" transform="rotate(${a} 50 50)"/>`)}</g>
  <g fill="#ff6f9f">${rot(5, (a) => `<ellipse cx="50" cy="31" rx="14" ry="16" transform="rotate(${a + 36} 50 50)"/>`)}</g>
  <circle cx="50" cy="50" r="17" fill="#ee4a86"/>
  <path d="M50 38q13 2 11 14-2 10-13 8-10-3-7-12 3-9 11-7" fill="none" stroke="#ffd2e2" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
</symbol>
<symbol id="f-daisy" viewBox="0 0 100 100">
  <g fill="#fff" stroke="#ffd3e3" stroke-width="1.6">${rot(12, (a) => `<ellipse cx="50" cy="19" rx="8.5" ry="18" transform="rotate(${a} 50 50)"/>`)}</g>
  <circle cx="50" cy="50" r="13" fill="#ffc83d"/><circle cx="50" cy="50" r="13" fill="none" stroke="#f5a623" stroke-width="3"/>
  <circle cx="46" cy="46" r="2.4" fill="#fff3b0"/>
</symbol>
<symbol id="f-blossom" viewBox="0 0 100 100">
  <g fill="#ffb4d0" stroke="#ff8fb8" stroke-width="1.5">${rot(5, (a) => `<circle cx="50" cy="26" r="18" transform="rotate(${a} 50 50)"/>`)}</g>
  <circle cx="50" cy="50" r="10" fill="#ffd45e"/>
  <g fill="#ff7aa6">${rot(5, (a) => `<circle cx="50" cy="40" r="2.2" transform="rotate(${a} 50 50)"/>`)}</g>
</symbol>
<symbol id="f-tulip" viewBox="0 0 100 140">
  <path d="M50 66C50 96 47 118 50 140" fill="none" stroke="#5fb36e" stroke-width="5" stroke-linecap="round"/>
  <path d="M49 120C30 116 22 98 20 84 38 88 48 102 49 120z" fill="#77c785"/>
  <path d="M51 112C68 108 78 94 80 80 62 84 52 96 51 112z" fill="#5fb36e"/>
  <path d="M28 20Q50-8 72 20 80 50 50 72 20 50 28 20z" fill="#ff5f90"/>
  <path d="M28 22Q14 32 21 56 31 69 50 72 28 50 28 22z" fill="#ff8cb2"/>
  <path d="M72 22Q86 32 79 56 69 69 50 72 72 50 72 22z" fill="#ff7aa4"/>
</symbol>
<symbol id="balloon" viewBox="0 0 60 100">
  <path d="M30 2C12 2 4 18 6 32c2 16 14 28 24 32 10-4 22-16 24-32C56 18 48 2 30 2z" fill="currentColor"/><path d="M30 63l-6 9h12z" fill="currentColor"/>
  <path d="M30 72q-9 10 0 18t0 10" fill="none" stroke="rgba(255,255,255,.65)" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="20" cy="22" rx="5" ry="10" fill="#fff" opacity=".38" transform="rotate(20 20 22)"/>
</symbol>
<symbol id="bouquet" viewBox="0 0 100 110">
  <g stroke="#5fb36e" stroke-width="4" stroke-linecap="round" fill="none"><path d="M50 108V62M50 108L30 56M50 108L72 54"/></g>
  <g fill="#79c887"><ellipse cx="36" cy="88" rx="14" ry="6" transform="rotate(-35 36 88)"/><ellipse cx="64" cy="86" rx="14" ry="6" transform="rotate(35 64 86)"/></g>
  <use href="#f-blossom" x="10" y="22" width="40" height="40"/><use href="#f-daisy" x="52" y="18" width="38" height="38"/><use href="#f-rose" x="28" y="0" width="46" height="46"/>
  <path d="M50 98Q36 90 33 106Q44 103 50 100Q56 103 67 106Q64 90 50 98Z" fill="#ff7fae"/>
</symbol>
<symbol id="sprig" viewBox="0 0 160 100">
  <path d="M6 92C42 82 76 62 148 22" fill="none" stroke="#5fb36e" stroke-width="4" stroke-linecap="round"/>
  <g fill="#79c887"><ellipse cx="34" cy="80" rx="15" ry="6.5" transform="rotate(-28 34 80)"/><ellipse cx="62" cy="64" rx="15" ry="6.5" transform="rotate(-38 62 64)"/>
  <ellipse cx="90" cy="46" rx="14" ry="6" transform="rotate(-30 90 46)"/><ellipse cx="46" cy="64" rx="13" ry="5.5" transform="rotate(30 46 64)"/>
  <ellipse cx="76" cy="46" rx="12" ry="5.2" transform="rotate(34 76 46)"/></g>
  <use href="#f-blossom" x="14" y="62" width="30" height="30"/>
  <use href="#f-daisy" x="60" y="26" width="30" height="30"/>
  <use href="#f-rose" x="112" y="0" width="42" height="42"/>
</symbol>
</svg>`;
    document.body.insertAdjacentHTML("afterbegin", svg);
  }

  /* Đặt hoa trang trí: t = loại hoa, x/y = vị trí (%), s = cỡ (px), a = kiểu động */
  function placeFlowers(container, list) {
    container.innerHTML = list
      .map((f) => {
        const vb = {
          rose: "f-rose",
          daisy: "f-daisy",
          blossom: "f-blossom",
          tulip: "f-tulip",
        }[f.t];
        return `<div class="fl" style="--x:${f.x};--y:${f.y};--s:${f.s}px;--d:${f.d || 0}s;--d2:${-(f.d || 0) * 2}s;--r:${f.r || 0}deg">
      <i class="${f.a || "sway"}"><svg><use href="#${vb}"/></svg></i></div>`;
      })
      .join("");
  }

  /* =====================================================================
   BẢN LAPTOP / PC — chỉ hiện thông báo + QR
   ===================================================================== */
  function initDesktop() {
    $("#desktop").hidden = false;
    placeFlowers($("#dkDecor"), [
      { t: "rose", x: "9%", y: "17%", s: 150, a: "sway", r: -10, d: 0.1 },
      { t: "daisy", x: "91%", y: "15%", s: 130, a: "pulse", d: 0.3 },
      { t: "tulip", x: "6%", y: "78%", s: 170, a: "sway", d: 0.5 },
      { t: "blossom", x: "93%", y: "80%", s: 150, a: "pulse", d: 0.2 },
      { t: "daisy", x: "24%", y: "92%", s: 90, a: "pulse", d: 0.6 },
      { t: "rose", x: "78%", y: "93%", s: 100, a: "sway", d: 0.4 },
      { t: "blossom", x: "22%", y: "8%", s: 80, a: "pulse", d: 0.7 },
      { t: "tulip", x: "80%", y: "9%", s: 110, a: "sway", d: 0.35 },
    ]);
    $("#dkDecor").classList.add("on");

    const img = $("#qrImg"),
      box = img.closest(".qr-box");
    img.addEventListener("error", () => box.classList.add("err"));
    const light = $("#qrLight"),
      big = $("#qrBig");
    $("#qrBtn").addEventListener("click", () => {
      if (box.classList.contains("err")) return;
      big.src = img.currentSrc || img.src;
      light.classList.add("open");
      light.setAttribute("aria-hidden", "false");
    });
    light.addEventListener("click", () => {
      light.classList.remove("open");
      light.setAttribute("aria-hidden", "true");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") light.click();
    });
  }

  /* =====================================================================
   BẢN ĐIỆN THOẠI / TABLET
   ===================================================================== */
  function initApp() {
    $("#app").hidden = false;
    if (LITE) document.body.classList.add("lite");
    const S = {
      gate: $("#gate"),
      s1: $("#s1"),
      space: $("#space"),
      vs: $("#vs"),
    };
    const show = (id) => {
      for (const k in S) S[k].classList.toggle("is-active", k === id);
      S.space.classList.toggle("on", id === "space");
      document.body.dataset.stage = id;
    };
    document.body.dataset.stage = "gate";
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    /* -------------------- NHẠC (nhỏ -> to êm) -------------------- */
    const au = $("#bgm");
    let mRaf = 0,
      mk = 0;
    const fade = (to, ms, cb) => {
      cancelAnimationFrame(mRaf);
      const f = au.volume,
        t0 = performance.now();
      const st = (t) => {
        const p = Math.min(1, (t - t0) / ms);
        try {
          au.volume = f + (to - f) * p;
        } catch (e) {}
        p < 1 ? (mRaf = requestAnimationFrame(st)) : cb && cb();
      };
      mRaf = requestAnimationFrame(st);
    };
    const Music = {
      start() {},
      ensure() {},
      play() {
        au.loop = true;
        try {
          au.volume = 0;
        } catch (e) {}
        const t = () => {
          if (mk >= CONFIG.music.length) return;
          au.src = CONFIG.music[mk++];
          const p = au.play();
          p && p.then(() => fade(CONFIG.volume, CONFIG.fadeIn)).catch(() => {});
        };
        au.onerror = t;
        try {
          // khuếch đại âm lượng bằng Web Audio (nếu trình duyệt cho phép)
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC && CONFIG.boost > 1 && !au._boost) {
            const ctx = new AC(),
              g = ctx.createGain();
            g.gain.value = CONFIG.boost;
            ctx
              .createMediaElementSource(au)
              .connect(g)
              .connect(ctx.destination);
            ctx.resume();
            au._boost = 1;
          }
        } catch (e) {}
        t();
      },
      stop(ms = 1000) {
        fade(0, ms, () => au.pause());
      },
    };

    /* -------------------- hiệu ứng hạt (chỉ transform + opacity) -------------------- */
    const COLS = [
      "#ff8fb8",
      "#ffb3cf",
      "#ffd1e1",
      "#ff6f9f",
      "#ffd980",
      "#ffffff",
    ];
    function burst(layer, cx, cy, n, type, min, max, drop, dur) {
      for (let i = 0; i < n; i++) {
        const p = document.createElement("i");
        p.className = "pt " + type;
        p.style.color = pick(COLS);
        if (type !== "dot") p.innerHTML = `<svg><use href="#${type}"/></svg>`;
        else p.style.setProperty("--z", rand(4, 7) + "px");
        layer.appendChild(p);
        const g = (i / n) * 6.283 + rand(-0.2, 0.2),
          d = rand(min, max);
        const a = p.animate(
          [
            { transform: `translate(${cx}px,${cy}px) scale(.3)`, opacity: 1 },
            { opacity: 1, offset: 0.6 },
            {
              transform: `translate(${cx + Math.cos(g) * d}px,${cy + Math.sin(g) * d + drop}px) rotate(${rand(-220, 220)}deg) scale(1)`,
              opacity: 0,
            },
          ],
          {
            duration: dur * rand(0.8, 1.15),
            easing: "cubic-bezier(.12,.75,.3,1)",
            fill: "forwards",
          },
        );
        a.onfinish = () => p.remove();
      }
    }

    /* -------------------- PHONG BÌ (dùng cho cảnh 1 và cảnh 2) -------------------- */
    const envHTML = (inner, seal) => `<div class="env">
<div class="e-back"><svg viewBox="0 0 100 64" preserveAspectRatio="none"><rect width="100" height="64" rx="7" fill="url(#gEnvIn)"/></svg></div>
<div class="e-flap"><div class="fc"><svg viewBox="0 0 100 40"><polygon points="4,00 96,00 50,36" fill="url(#gFlapOut)" stroke="url(#gFlapOut)" stroke-width="6" stroke-linejoin="round"/></svg></div>
<div class="fc fi"><svg viewBox="0 0 100 40"><polygon points="4,36 96,36 50,00" fill="url(#gFlapIn)" stroke="url(#gFlapIn)" stroke-width="6" stroke-linejoin="round"/></svg></div></div>
<div class="e-letter"><div class="pc">${inner}</div></div>
<div class="e-front"><svg viewBox="0 0 100 64" preserveAspectRatio="none"><path d="M3 3L50 35 97 3V57Q97 61 93 61H7Q3 61 3 57Z" fill="url(#gFront)" stroke="url(#gFront)" stroke-width="5" stroke-linejoin="round"/><path d="M5 59L50 35 95 59" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.2" stroke-linecap="round"/></svg></div>
<svg class="bq l"><use href="#bouquet"/></svg><svg class="bq r"><use href="#bouquet"/></svg>
<div class="e-seal">${seal}</div></div>`;

    /* -------------------- 0. mật khẩu (giữ nguyên) -------------------- */
    const gate = (() => {
      const slotsEl = $("#slots"),
        msg = $("#gateMsg"),
        pad = $("#keypad"),
        card = $("#gateCard");
      let buf = "",
        locked = false;
      [2, 2, 4].forEach((n, g) => {
        for (let i = 0; i < n; i++)
          slotsEl.insertAdjacentHTML(
            "beforeend",
            `<span class="slot${i === 0 && g ? " gap" : ""}"></span>`,
          );
      });
      const slots = $$(".slot", slotsEl);
      const keys = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "clr",
        "0",
        "del",
      ];
      pad.innerHTML = keys
        .map((k) =>
          k === "del"
            ? '<button class="key fn" type="button" data-k="del" aria-label="Xóa số"><svg viewBox="0 0 24 24"><path d="M9 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-6-7 6-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M13 10l4 4m0-4l-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>'
            : k === "clr"
              ? '<button class="key fn" type="button" data-k="clr">Xóa</button>'
              : `<button class="key" type="button" data-k="${k}">${k}</button>`,
        )
        .join("");
      const render = () =>
        slots.forEach((s, i) => {
          s.textContent = buf[i] || "";
          s.classList.toggle("on", i < buf.length);
        });
      function say(t) {
        msg.textContent = t;
        msg.classList.toggle("show", !!t);
      }
      async function check() {
        locked = true;
        if (buf === CONFIG.password) {
          slotsEl.classList.add("ok");
          say("");
          await wait(380);
          locked = false;
          done();
        } else {
          say("Nhập sai rồi, thử lại nhé");
          slotsEl.classList.remove("shake");
          reflow(slotsEl);
          slotsEl.classList.add("shake");
          if (navigator.vibrate) navigator.vibrate(60);
          await wait(650);
          buf = "";
          render();
          slotsEl.classList.remove("shake");
          await wait(900);
          say("");
          locked = false;
        }
      }
      function press(k) {
        if (locked) return;
        Music.start(); // chạm đầu tiên -> mở khóa & phát nhạc nền mặc định
        if (k === "del") buf = buf.slice(0, -1);
        else if (k === "clr") buf = "";
        else if (buf.length < 8) buf += k;
        if (k !== "del" && k !== "clr" && msg.classList.contains("show"))
          say("");
        render();
        if (buf.length === 8) check();
      }
      pad.addEventListener("pointerdown", (e) => {
        const b = e.target.closest(".key");
        if (b) {
          e.preventDefault();
          press(b.dataset.k);
        }
      });
      document.addEventListener("keydown", (e) => {
        if (document.body.dataset.stage !== "gate") return;
        if (/^[0-9]$/.test(e.key)) press(e.key);
        else if (e.key === "Backspace") press("del");
      });
      async function done() {
        buildSeq();
        seq.slice(0, 6).forEach((q) => q.n && preload(IMG(q.n)));
        FLY.forEach((f) => preload(IMG(f[0])));
        preload(IMG("Anhcanhan2"));
        $("#gateCard").classList.add("is-leaving");
        await wait(300);
        playIntro();
      }
    })();

    /* -------------------- 1. PHONG BÌ MỞ ĐẦU -------------------- */
    const wrap1 = $("#envWrap1"),
      btnStart = $("#btnStart"),
      s1D = $("#s1Decor");
    wrap1.innerHTML = envHTML(
      `<p class="tl l-1" style="--i:0">Chúc mừng ngày<br>phụ nữ Việt Nam</p><p class="tl l-big" style="--i:1">20-10</p><p class="tl l-from" style="--i:2">${CONFIG.fromName} gửi tặng</p>`,
      '<svg><use href="#heart"/></svg>',
    );
    const env1 = $(".env", wrap1);
    placeFlowers(s1D, [
      { t: "rose", x: "14%", y: "9%", s: 78, a: "sway", r: -10, d: 0.15 },
      { t: "daisy", x: "50%", y: "5%", s: 54, a: "pulse", d: 0.3 },
      { t: "blossom", x: "87%", y: "10%", s: 72, a: "sway", d: 0.45 },
      { t: "blossom", x: "5%", y: "33%", s: 50, a: "pulse", d: 0.55 },
      { t: "rose", x: "96%", y: "37%", s: 56, a: "pulse", d: 0.65 },
      { t: "daisy", x: "9%", y: "90%", s: 74, a: "pulse", d: 0.75 },
      { t: "tulip", x: "90%", y: "89%", s: 92, a: "sway", d: 0.85 },
      { t: "blossom", x: "50%", y: "95%", s: 44, a: "pulse", d: 0.95 },
    ]);
    async function playIntro() {
      show("s1");
      await frame();
      s1D.classList.add("on");
      wrap1.classList.add("is-in"); // 1) phong bì hiện lên
      await wait(1100);
      env1.classList.add("open"); // 2) mở nắp
      await wait(950);
      env1.classList.add("up"); // 3) lá thư trượt lên, đè lên nắp
      await wait(1100);
      env1.classList.add("t-show"); // 4) chữ hiện lần lượt
      await wait(1900);
      btnStart.classList.add("show");
    }
    let b1 = false;
    btnStart.addEventListener("click", async () => {
      if (b1) return;
      b1 = true;
      Music.play(); // chạm của người dùng -> được phép phát nhạc
      loadVideo();
      btnStart.classList.remove("show");
      env1.classList.remove("up"); // thư trượt vào (~1s)
      await wait(1050);
      env1.classList.remove("open"); // nắp đóng lại (~0.9s)
      s1D.classList.remove("on");
      s1D.classList.add("out");
      await wait(1000);
      const r = env1.getBoundingClientRect();
      burst(
        $("#app"),
        r.left + r.width / 2,
        r.top + r.height / 2,
        LITE ? 12 : 20,
        "petal",
        110,
        240,
        50,
        1100,
      );
      await wait(700);
      veil.className = "veil on"; // màn tối loang ra che hết cảnh phong bì
      await wait(1150);
      startSpace(); // vào vũ trụ (ảnh chỉ bắt đầu bay sau khi cảnh đã hiện hẳn)
      await wait(600);
      veil.className = "veil off";
      await wait(1000);
      veil.className = "veil";
    });

    /* -------------------- 2. VŨ TRỤ: ảnh bay -> thu lại -> nổ -> phong bì lời chúc -------------------- */
    const lay = $("#spLayer"),
      core = $("#core"),
      fx = $("#fx"),
      nextB = $("#spNext"),
      hint = $("#spHint");
    const view = $("#spaceView"),
      wrap2 = $("#envWrap2"),
      flash = $("#flash");
    let env2,
      world,
      seq = [],
      items = [],
      W = 0,
      H = 0,
      Z = 1,
      zTop = 10,
      mode = "idle",
      nextSp = 0,
      last = 0,
      gatherDone = null,
      fxT = [],
      laneQ = [],
      lastLane = -1,
      gx = 0,
      gy = 0,
      PX = 0, // vị trí lướt (kéo qua lại) của toàn cảnh
      PY = 0,
      EX = 0, // phần "thế giới" rộng thêm ở mỗi bên màn hình để lướt sang xem
      vx = 0, // vận tốc lướt (để trượt êm có quán tính)
      vy = 0;
    const LANES = 8,
      DECO = ["balloon", "balloon", "f-rose", "f-daisy", "f-blossom", "heart"];
    // Một vòng: ảnh xáo trộn, cứ 5 ảnh có 1 câu chúc, cứ 4 ảnh có 1 bóng bay/hoa/tim. Hết vòng thì tự xáo lại -> bay mãi.
    function buildSeq() {
      const ph = shuffle(PHOTOS),
        ws = shuffle(SHORT_WISHES);
      seq = [];
      ph.forEach((n, i) => {
        seq.push({ n });
        if (i % 2 === 1) seq.push({ w: ws[Math.floor(i / 5) % ws.length] });
        if (i % 2 === 1) seq.push({ d: pick(DECO) });
      });
    }
    // chia làn: các vật thể liên tiếp luôn ở làn khác nhau -> bay đều, không dính nhau
    function lane() {
      if (!laneQ.length)
        do laneQ = shuffle([...Array(LANES).keys()]);
        while (laneQ[0] === lastLane);
      return (lastLane = laneQ.shift());
    }
    function spawn() {
      if (!seq.length) buildSeq();
      const q = seq.shift(),
        el = document.createElement("div"),
        dp = rand(0.7, 1.05),
        plain = q.w || q.d;
      el.className =
        "sp-item " + (q.w ? "sp-wish" : q.d ? "sp-deco" : "sp-photo");
      if (q.w) el.textContent = q.w;
      else if (q.d) {
        const z = rand(28, 40),
          bl = q.d === "balloon";
        el.innerHTML = `<svg style="width:${z}px;height:${bl ? z * 1.65 : z}px;color:${pick(COLS)}"><use href="#${q.d}"/></svg>`;
      } else
        el.innerHTML = `<img src="${IMG(q.n)}" alt="" decoding="async" draggable="false">`;
      world.appendChild(el);
      const b = plain ? 1 : dp;
      const it = {
        el,
        x: -EX + ((lane() + 0.5) / LANES + rand(-0.04, 0.04)) * (W + 2 * EX),
        y: H + 120,
        s: b,
        b,
        r: rand(-8, 8),
        vy: -rand(40, 56) * (plain ? 0.95 : dp + 0.2),
        ph: rand(0, 6.28),
        sw: rand(8, 22),
        held: false,
        g: 0,
        gp: 0,
      };
      if (q.w) it.x = clamp(it.x, 100 - EX, W - 100 + EX); // câu chúc ngắn không bị tràn mép màn hình
      items.push(it);
      return it;
    }
    // MỘT vòng lặp duy nhất điều khiển mọi vật thể (chỉ transform)
    function tick(now) {
      if (mode !== "fly" && mode !== "gather") return;
      requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (
        mode === "fly" &&
        !pts.size &&
        (Math.abs(vx) > 3 || Math.abs(vy) > 3)
      ) {
        PX += vx * dt;
        PY += vy * dt;
        const k = Math.exp(-3.2 * dt);
        vx *= k;
        vy *= k;
        clampPan();
        applyWorld();
      }
      if (mode === "fly" && now >= nextSp) {
        spawn();
        nextSp = now + CONFIG.spawnEvery * (LITE ? 1.1 : 0.75) * 1000;
      }
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (mode === "gather") {
          if (!it.g) {
            it.g = 1;
            it.gp = -Math.random() * 0.45;
            it.x0 = it.x;
            it.y0 = it.y;
            it.s0 = it.s;
            it.held = false;
          }
          it.gp += dt / 1.5;
          const p = clamp(it.gp, 0, 1),
            e = p * p * (3 - 2 * p);
          it.x = it.x0 + (gx - it.x0) * e;
          it.y = it.y0 + (gy - it.y0) * e;
          it.s = it.s0 * (1 - 0.95 * e);
          it.el.style.opacity = 1 - p * p * p;
          if (p >= 1) {
            it.el.remove();
            items.splice(i, 1);
            continue;
          }
        } else if (!it.held) {
          it.y += it.vy * dt;
          it.ph += dt * 0.6;
          it.x += Math.sin(it.ph) * it.sw * dt;
          if (it.y < -190) {
            it.el.remove();
            items.splice(i, 1);
            continue;
          }
        }
        it.el.style.transform = `translate3d(${it.x.toFixed(1)}px,${it.y.toFixed(1)}px,0) translate(-50%,-50%) rotate(${it.r.toFixed(1)}deg) scale(${it.s.toFixed(3)})`;
      }
      if (mode === "gather" && !items.length && gatherDone) {
        const f = gatherDone;
        gatherDone = null;
        f();
      }
    }
    // Chạm vào ẢNH + kéo  -> kéo riêng ảnh đó.
    // Chạm vào KHOẢNG TRỐNG + vuốt -> lướt cả cảnh qua lại (có quán tính). Zoom rồi thì lướt cả lên xuống.
    // 2 ngón: phóng to / thu nhỏ TOÀN BỘ vật thể (zoom quanh chỗ 2 ngón) và lướt luôn bằng 2 ngón.
    const pts = new Map();
    let held = null,
      d0 = 0,
      z0 = 1,
      lt = 0,
      lmx = 0,
      lmy = 0;
    function applyWorld() {
      world.style.transform = `translate3d(${PX.toFixed(1)}px,${PY.toFixed(1)}px,0) scale(${Z.toFixed(3)})`;
    }
    // giới hạn lướt: không kéo quá mép "thế giới" (rộng hơn màn hình EX ở mỗi bên)
    function clampPan() {
      const mx = Math.max(0, (W / 2 + EX) * Z - W / 2),
        my = Math.max(0, (H * (Z - 1)) / 2);
      const cx = clamp(PX, -mx, mx),
        cy = clamp(PY, -my, my);
      if (cx !== PX) vx = 0;
      if (cy !== PY) vy = 0;
      PX = cx;
      PY = cy;
    }
    function midRel() {
      const [a, b] = [...pts.values()],
        r = lay.getBoundingClientRect();
      return {
        x: (a.x + b.x) / 2 - r.left - W / 2,
        y: (a.y + b.y) / 2 - r.top - H / 2,
        d: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      };
    }
    lay.addEventListener("pointerdown", (e) => {
      if (mode !== "fly") return;
      lay.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        vx = vy = 0;
        lt = e.timeStamp;
        const el = e.target.closest(".sp-photo"),
          it = el && items.find((i) => i.el === el);
        if (it) {
          held = it;
          it.held = true;
          el.style.zIndex = ++zTop;
        }
      } else if (pts.size === 2) {
        if (held) {
          held.held = false;
          held = null;
        }
        vx = vy = 0;
        const m = midRel();
        d0 = m.d;
        lmx = m.x;
        lmy = m.y;
        z0 = Z;
        world.style.transition = "none";
      }
    });
    lay.addEventListener("pointermove", (e) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x,
        dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (pts.size >= 2) {
        const m = midRel(),
          zn = clamp((z0 * m.d) / d0, ZOOM_MIN, ZOOM_MAX),
          k = zn / Z;
        // giữ nguyên điểm đang nằm dưới 2 ngón tay (vừa zoom vừa lướt)
        PX = m.x - (lmx - PX) * k;
        PY = m.y - (lmy - PY) * k;
        lmx = m.x;
        lmy = m.y;
        Z = zn;
        clampPan();
        applyWorld();
      } else if (held) {
        held.x = clamp(held.x + dx / Z, 24 - EX, W + EX - 24);
        held.y = clamp(held.y + dy / Z, 24, H - 24);
      } else {
        // một ngón vuốt vào khoảng trống -> lướt cả cảnh
        const dt = Math.max(0.001, (e.timeStamp - lt) / 1000);
        lt = e.timeStamp;
        PX += dx;
        PY += dy;
        vx = vx * 0.6 + (dx / dt) * 0.4;
        vy = vy * 0.6 + (dy / dt) * 0.4;
        clampPan();
        applyWorld();
      }
    });
    const release = (e) => {
      if (!pts.delete(e.pointerId)) return;
      if (pts.size < 2) d0 = 0;
      if (pts.size === 1) {
        // còn 1 ngón sau khi nhả 1 ngón: tiếp tục lướt mượt, không giật
        vx = vy = 0;
        lt = e.timeStamp;
      }
      if (held && !pts.size) {
        held.held = false;
        held = null;
        vx = vy = 0;
      }
      if (!pts.size && e.timeStamp - lt > 90) vx = vy = 0; // giữ yên rồi mới nhả -> không trượt tiếp
    };
    lay.addEventListener("pointerup", release);
    lay.addEventListener("pointercancel", release);

    function sky(n) {
      return Array.from(
        { length: n },
        () =>
          `${rand(0, 100).toFixed(1)}vw ${rand(0, 100).toFixed(1)}vh 0 ${rand(0, 0.6).toFixed(1)}px rgba(255,${Math.floor(rand(215, 255))},255,${rand(0.55, 1).toFixed(2)})`,
      ).join(",");
    }
    function firework() {
      const x = rand(0.15, 0.85) * W,
        y = rand(0.08, 0.3) * H;
      if (Math.random() < 0.5) {
        burst(fx, x, y, LITE ? 12 : 18, "dot", 55, 105, 34, 1500);
        burst(fx, x, y, 4, "sparkle", 10, 30, 0, 900);
      } else burst(fx, x, y, LITE ? 8 : 12, "petal", 50, 95, 40, 1700); // hoa nổ
    }
    function heart() {
      const h = document.createElement("i"),
        x = rand(0.08, 0.92) * W,
        y = H + 20;
      h.className = "pt heart";
      h.style.cssText = `color:${pick(COLS)};--z:${rand(10, 17).toFixed(0)}px`;
      h.innerHTML = '<svg><use href="#heart"/></svg>';
      fx.appendChild(h);
      const a = h.animate(
        [
          { transform: `translate(${x}px,${y}px) scale(.6)`, opacity: 0 },
          { opacity: 0.9, offset: 0.15 },
          {
            transform: `translate(${x + rand(-40, 40)}px,${y - rand(0.4, 0.75) * H}px) scale(1)`,
            opacity: 0,
          },
        ],
        { duration: rand(4500, 6800), easing: "ease-out" },
      );
      a.onfinish = () => h.remove();
    }
    const stopFx = () => {
      fxT.forEach(clearInterval);
      fxT = [];
    };

    async function startSpace() {
      show("space");
      await frame();
      W = lay.clientWidth;
      H = lay.clientHeight;
      EX = W * 0.45;
      PX = PY = vx = vy = 0;
      world = document.createElement("div");
      world.className = "sp-world";
      lay.appendChild(world);
      $("#k1").style.boxShadow = sky(LITE ? 30 : 48);
      $("#k2").style.boxShadow = sky(LITE ? 24 : 40);
      $("#k3").style.boxShadow = sky(LITE ? 18 : 30);
      const dec = document.createElement("div");
      dec.className = "decor";
      view.insertBefore(dec, view.firstChild);
      placeFlowers(dec, [
        { t: "rose", x: "9%", y: "6%", s: 62, a: "sway", d: 0.2 },
        { t: "daisy", x: "91%", y: "5%", s: 56, a: "pulse", d: 0.4 },
        { t: "blossom", x: "6%", y: "95%", s: 58, a: "pulse", d: 0.6 },
        { t: "tulip", x: "93%", y: "94%", s: 78, a: "sway", d: 0.3 },
      ]);
      wrap2.classList.add("big");
      const wish = pick(WISHES) + " " + pick(CHEM);
      const words = wish
        .split(" ")
        .map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`)
        .join(" ");
      wrap2.innerHTML = envHTML(
        `<p class="tl w-to" style="--i:0">Chúc bạn ${CONFIG.toName}</p><div class="wish-scroll"><p class="wish">${words}</p></div><p class="scroll-hint" id="scrHint"><i></i>Cuộn lên để đọc tiếp</p>`,
        `<div class="avatar"><img src="${IMG("Anhcanhan2")}" alt=""></div>`,
      );
      env2 = $(".env", wrap2);
      const rc = wrap2.getBoundingClientRect();
      gx = rc.left + rc.width / 2;
      gy = rc.top + rc.height / 2;
      core.style.left = gx + "px";
      core.style.top = gy + "px";
      await wait(1800); // đợi vũ trụ hiện hẳn rồi ảnh mới bắt đầu bay lên từ dưới
      mode = "fly";
      last = nextSp = performance.now();
      requestAnimationFrame(tick);
      await wait(1500);
      hint.classList.add("show");
      await wait(5500);
      hint.classList.remove("show");
      await wait(Math.max(0, CONFIG.flyFor - 7000));
      nextB.classList.add("show");
      nextB.onclick = gather;
    }

    async function gather() {
      nextB.onclick = null;
      nextB.classList.remove("show");
      hint.classList.remove("show");
      seq.length = 0;
      pts.clear();
      if (held) {
        held.held = false;
        held = null;
      }
      world.style.transition = "transform .7s cubic-bezier(.22,.8,.26,1)"; // trả zoom về 100% trước khi thu lại
      Z = 1;
      PX = PY = vx = vy = 0;
      world.style.transform = "translate3d(0px,0px,0) scale(1)";
      mode = "gather";
      await new Promise((res) => {
        gatherDone = res;
        setTimeout(() => gatherDone && gatherDone(), 4200);
      });
      items.forEach((i) => i.el.remove());
      items = [];
      mode = "idle";
      lay.remove();
      // lõi năng lượng rung rồi nổ
      core.classList.add("on");
      await wait(450);
      core.classList.add("quake");
      await wait(1350);
      core.classList.add("boom");
      flash.classList.add("go");
      burst(fx, gx, gy, LITE ? 16 : 26, "petal", 90, 260, 50, 1500);
      burst(fx, gx, gy, LITE ? 16 : 26, "dot", 80, 280, 30, 1400);
      await wait(380);
      openLetter();
    }

    async function openLetter() {
      wrap2.classList.add("is-in"); // phong bì phóng ra từ tâm vụ nổ
      core.remove();
      await wait(2200);
      env2.classList.add("open"); // mở phong bì
      fxT.push(
        setInterval(heart, LITE ? 1400 : 900),
        setInterval(firework, LITE ? 2600 : 1900),
      );
      await wait(850);
      const r = env2.getBoundingClientRect(),
        ex = r.left + r.width / 2,
        ey = r.top + r.height * 0.25;
      const fl = document.createElement("div");
      fl.className = "fly";
      view.appendChild(fl);
      FLY.forEach((f, i) =>
        setTimeout(() => {
          const e = document.createElement("div");
          e.className = "fp";
          e.innerHTML = `<i style="animation-delay:${-rand(0, 3).toFixed(1)}s"><img src="${IMG(f[0])}" alt="" decoding="async"></i>`;
          fl.appendChild(e);
          e.animate(
            [
              {
                transform: `translate(${ex}px,${ey}px) translate(-50%,-50%) scale(.15) rotate(0deg)`,
                opacity: 0,
              },
              { opacity: 1, offset: 0.25 },
              {
                transform: `translate(${f[1] * W}px,${f[2] * H}px) translate(-50%,-50%) scale(1) rotate(${f[3]}deg)`,
                opacity: 1,
              },
            ],
            {
              duration: 1000,
              easing: "cubic-bezier(.2,1,.3,1)",
              fill: "forwards",
            },
          );
        }, i * 170),
      );
      await wait(5 * 170 + 500);
      env2.classList.add("up"); // tờ thư hiện lên khi gần hết ảnh
      await wait(1150);
      env2.classList.add("t-show"); // lời chúc hiện từng chữ
      const scr = $(".wish-scroll", wrap2),
        sh = $("#scrHint");
      scr.addEventListener("scroll", () => sh.classList.remove("show"), {
        passive: true,
      });
      await wait(6500);
      sh.classList.add("show"); // nhắc người xem cuộn
      await wait(3800);
      nextB.classList.add("show");
      nextB.onclick = toVideo;
    }

    /* -------------------- 3. VIDEO + chữ kết -------------------- */
    const vid = $("#vid"),
      dim = $("#vsDim"),
      veil = $("#veil");
    let vk = 0,
      vLoaded = false,
      vDone = false,
      vStarted = false;
    function loadVideo() {
      if (vLoaded) return;
      vLoaded = true;
      const t = () => {
        if (vk >= CONFIG.video.length) {
          if (vStarted) after();
          return;
        }
        vid.src = CONFIG.video[vk++];
        vid.preload = "auto";
        vid.load();
      };
      vid.addEventListener("error", () => (vStarted ? after() : t()));
      vid.addEventListener("ended", () => after());
      vid.addEventListener("pause", () => {
        if (!vid.ended && !vDone && document.body.dataset.stage === "vs")
          vid.play().catch(() => {});
      });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden && vStarted && !vDone && !vid.ended)
          vid.play().catch(() => {});
      });
      vid.addEventListener("contextmenu", (e) => e.preventDefault());
      t();
    }
    async function toVideo() {
      nextB.onclick = null;
      nextB.classList.remove("show");
      stopFx();
      Music.stop(1100);
      veil.className = "veil on"; // chuyển cảnh: màn tối loang ra
      await wait(1100);
      show("vs");
      await frame();
      S.vs.classList.add("on");
      veil.className = "veil off";
      vStarted = true;
      vid.currentTime = 0;
      vid.muted = false;
      vid.play().catch(() => {
        vid.muted = true;
        vid.play().catch(() => {});
      });
      if (vk >= CONFIG.video.length && vid.error) after();
      await wait(1000);
      veil.className = "veil";
    }
    async function type(el, txt) {
      el.innerHTML = [...txt]
        .map((c) => `<span class="ch">${c}</span>`)
        .join("");
      el.classList.add("show", "typing");
      for (const s of $$(".ch", el)) {
        s.classList.add("on");
        await wait(62);
      }
      el.classList.remove("typing");
    }
    async function after() {
      if (vDone) return;
      vDone = true;
      dim.classList.add("on"); // video mờ đi để đọc chữ
      await wait(1000 + 1000);
      const t1 = $("#vsT1"),
        t2 = $("#vsT2"),
        t3 = $("#vsT3");
      await type(t1, "Tôi chúc bạn 20-10 vui vẻ ý nghĩa nha");
      await wait(1800);
      t1.classList.remove("show");
      await wait(1100);
      t2.classList.add("show"); // sau đó cảm ơn
      await wait(4000);
      t2.classList.remove("show");
      await wait(1100);
      t3.classList.add("show"); // câu cuối ở lại
    }
  }

  /* =====================================================================
   KHỞI ĐỘNG
   ===================================================================== */
  function boot() {
    buildSprites();
    if (isDesktop()) initDesktop();
    else initApp();
    if (!force && mqDesktop.addEventListener)
      mqDesktop.addEventListener("change", () => location.reload());
    if (!CSS.supports("height", "1svh")) {
      const setSv = () =>
        document.documentElement.style.setProperty(
          "--sv",
          innerHeight / 100 + "px",
        );
      setSv();
      addEventListener("resize", setSv);
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
