/* =====================================================================
   WEB 20-10 — script.js (bản 3)
   Mọi thứ cần chỉnh (địa chỉ kiểm tra mật khẩu, tên file, danh sách ảnh, lời chúc) nằm ở khối CONFIG / PHOTOS / WISHES.
   Hiệu năng: chỉ animate transform + opacity; cảnh vũ trụ chạy bằng MỘT vòng requestAnimationFrame chung.
   ===================================================================== */
(() => {
  "use strict";
  const CONFIG = {
    // Mật khẩu KHÔNG còn nằm trong code: được kiểm tra ở Cloudflare Worker (xem worker.js).
    // Dán địa chỉ Worker của bạn vào đây, ví dụ "https://check-mat-khau.ten-ban.workers.dev"
    passApi: "https://check-mat-khau.buitrunghuy20082.workers.dev",
    toName: "Vũ Đặng Thảo My",
    fromName: "Bùi Trung Huy",
    qrImage: "anhMy/Anhqrcholap.png",
    music: ["Nhacrieng.mp3", "anhMy/Nhacrieng.mp3"], // file nhạc cảnh vũ trụ + phong bì (thử lần lượt từng đường dẫn)
    volume: 1, // ÂM LƯỢNG GỐC: 0 (tắt) -> 1 (to nhất của trình duyệt). Không vượt quá 1 được.
    boost: 2.3, // KHUẾCH ĐẠI THÊM: 1 = giữ nguyên, 1.5-2.5 = to hơn nữa. Quá cao có thể rè -> hạ xuống nếu nghe bị vỡ tiếng.
    fadeIn: 1000, // ms nhạc từ nhỏ lên to (tăng = lên chậm và êm hơn)
    video: ["VideoMy.mp4", "anhMy/VideoMy.mp4"],
    musicLove: ["Nhaclangmang.mp3", "anhMy/Nhaclangmang.mp3"], // nhạc lãng mạn: ưu tiên file ở thư mục gốc, nếu không có thì thử anhMy/
    // ===== NHẠC CẢNH QUÉT VÂN TAY (nhacdaodau.mp3): phát từ lúc hiện vòng quét vân tay, lặp lại cho tới khi mờ dần =====
    musicIntro: ["Nhacdaodau.mp3", "anhMy/Nhacdaodau.mp3"], // thử lần lượt từng đường dẫn
    introFadeIn: 1500, // ms nhạc dạo đầu từ nhỏ lên to
    introFadeOut: 3000, // ms nhạc dạo đầu mờ dần tới tắt (chỉnh cho khớp lúc nối với nhaclangmang.mp3)
    // >>> ĐỔI THỨ TỰ TẮT NHẠC Ở ĐÂY <<<
    // Nhạc dạo đầu bắt đầu MỜ DẦN ngay khi câu chữ RƠI thứ N tính từ cuối danh sách fallTexts (ngay lúc chữ bắt đầu hiện).
    // 3 = câu thứ 3 từ cuối đếm lên | 2 = câu áp chót | 1 = câu cuối cùng | 4 = câu thứ 4 từ cuối ...
    introFadeFromEnd: 3,
    // Nhạc lãng mạn (nhaclangmang.mp3) + chữ mưa bắt đầu khi câu chữ rơi thứ N từ cuối XUẤT HIỆN XONG (mặc định 3 như cũ)
    loveFromEnd: 3,
    introText: "Mong rằng bạn sẽ xem đến hết", // chữ hiện đầu cảnh vũ trụ rồi bay cùng ảnh
    // ===== CHỮ RƠI Ở CẢNH CUỐI (THỨ TỰ các câu ở dưới chính là thứ tự rơi; đếm "thứ N từ cuối" cho introFadeFromEnd/loveFromEnd phía trên dựa theo danh sách này): sửa/thêm các câu ở đây (rơi lần lượt, hết thì lặp lại, mỗi lần một màu) =====
    fallTexts: [
      "..........",
      "tôi mong rằng dù ntn",
      "tôi và bạn vẫn nói chuyện với nhau",
      "Vẫn là bạn nhau",
      "Tôi muốn nói là",
      "Tôi thích bạn",
      "I really like you",
    ],
    // ===== CHỮ MƯA: sau khi câu CUỐI của fallTexts hiện ra và ĐỨNG YÊN mãi, các chữ dưới đây rơi chậm như mưa (lần lượt, hết thì lặp lại) =====
    rainTexts: [
      "   .",
      "Dù cho mai về sau",
      "mình không bên cạnh nhau",
      "Làm tim anh quặn đau",
      "Anh trông ngóng bao nhiêu lâu",
      "Dù vương vấn u sầu",
      "Mùa thu có phai màu",
      "Anh vẫn muốn yêu em",
      " ",
      "Bầu trời đêm không mây không sao",

      "Trăng treo trên cao khi",
      "lòng anh vẫn nhớ nhung em nhiều",
      "Anh làm sao có thể",
      "ngừng suy nghĩ đến đôi môi em",
      "dù chỉ một giây",
      " ",
      " ", // mới đổi
      "Mặc cho ta đi bên nhau bao lâu",
      "Em đâu hay anh cần bao câu",
      " nói anh yêu em",
      "Chỉ để em sẽ một lần",
      " nhìn thấy trái tim",
      "anh đang rung động biết bao",
      " ",
      " ", //ms thêm
      "Dù lời nói có là gió bay",
      "Anh vẫn mong sau này",
      "chúng ta trở thành của nhau",
      " ",
      "Mệt thì cứ ngoái lại phía sau",
      "anh vẫn luôn đây mà",
      " ",
      ".",
      "Dù thời gian không chịu đứng yên",
      "Để cho chính anh không còn ngẩn ngơ",
      "cũng thôi mơ mộng",
      "Thì anh vẫn luôn dành những câu ca",
      "trong lòng anh cho người mãi thôi",
      " .", // mới thêm
      " .",
      "Dù cho mai về sau",
      "mình không bên cạnh nhau",
      "Làm tim anh quặn đau",
      "Anh trông ngóng bao nhiêu lâu",
      "Dù vương vấn u sầu",
      "Mùa thu có phai màu",
      "anh vẫn muốn yêu em",
      "",
      "Dù cho muôn trùng phương",
      "Còn bao nhiêu lời thương",
      "Dù mênh mông đại dương",
      "Phai đi sắc hương mơ màng",
      "Anh vẫn yêu mình em thôi đấy",
      "Em ơi!",
      "Đừng để tình anh dở dang",
      " ",
      "       ",
      ".",
      "       ",
      "       ",
      ".",
      "       ",
      ".",
      "       ",
      ".",
      "       ",
      "..",
      "       ",
      ".",

      "       ",
      "Rất nhiều câu trả lời ",
      "chỉ để em nhớ được điều này nữa thôi",
      "Anh vẫn luôn muốn ở cạnh em ",
      "bất kể dù cho nhiều ngày nữa trôi",
      "Hồi đầu giả vờ ngơ ngẩn một mình",
      "dưới tán lá cây mà ngắm trời",
      "Ai biết quen được mấy tháng mới phát hiện",
      "em cũng khá nhây và lắm lời",
      "Em thì vẫn đáng yêu trừ những lúc dở chứng",
      "cáu gắt mắng đủ điều",
      "Đáng yêu từ cái dáng điệu",
      "dựa vào anh mỗi khi trời tắt nắng buổi chiều,",
      "Biết là làm dược sĩ nên khó tính hay nhắc nhắn nhủ nhiều",
      "Như là ôm quả bom nổ chậm",
      "vì anh mà yêu em thì phải chắc chắn đủ liều",
      "Cho thời gian đưa lối",
      "Anh không mong điều gì xa xôi",
      "Yêu chỉ mình em thôi",
      "khiến anh thức thao cứ mỗi đêm về",
      "Em lại xinh như thế",
      "Sao mà không làm cho anh mê đắm như trong giấc mơ",
      "Khi lắng nghe tiếng yêu",
      "Em nhẹ ngân câu hát",
      "Theo điệu đàn anh feel",
      "Ta đi bên cạnh nhau bao nhiêu",
      "thế nhưng vẫn luôn nhớ em hơn nhiều",
      "Anh mong dù mai này có giận",
      "thì mình cũng đừng có cãi lời nhau",
      "Khi người anh thương chỉ luôn có một",
      "dù cho mãi về sau",
      "mình không bên cạnh nhau",
      "Làm tim anh quặn đau",
      "Anh trông ngóng bao nhiêu lâu",
      "Dù vương vấn u sầu",
      "Mùa thu có phai màu",
      "Anh vẫn muốn yêu em",
      " ",
      "Dù cho muôn trùng phương",
      "Còn bao nhiêu lời thương",
      "Dù mênh mông đại dương",
      "Phai đi sắc hương mơ màng",
      "Anh vẫn yêu mình em thôi đấy",
      "Em ơi! Đừng để tình anh dở dang",
      " ",
      " ",
      "Dù lời nói có là gió bay",
      "Dù ngày tháng có còn đổi thay",
      "Thì anh vẫn mãi muốn nắm đôi bàn tay",
      "dắt theo những hy vọng đong đầy",
      "Dù cho mai về sau",
      "mình không bên cạnh nhau",
      "Làm tim anh quặn đau",
      "Anh trông ngóng bao nhiêu lâu",
      "Dù vương vấn u sầu",
      "Mùa thu có phai màu anh vẫn muốn yêu em",
      "",
      "Dù cho muôn trùng phương",
      "Còn bao nhiêu lời thương",
      "Dù mênh mông đại dương",
      "Phai đi sắc hương mơ màng",
      "Anh vẫn yêu mình em thôi đấy",
      "Anh vẫn yêu mình em thôi đấy",
      "Yêu em mà chẳng một lời thở than",
      ".",
      ".",
      ".",
      ".",
    ],

    fallHold: 1800,
    // ===== MẬT ĐỘ ĐỐM SÁNG Ở CẢNH CUỐI: tăng số = dày/đẹp hơn nhưng nặng hơn; "Lite" là số dùng cho điện thoại yếu =====
    density: {
      heartDots: 2600, // số đốm li ti tạo nên trái tim 3D (tăng = trái tim đặc, lấp lánh hơn nhưng nặng hơn)
      heartDotsLite: 1100,
      heartFill: 0.4, // tỉ lệ đốm nằm BÊN TRONG trái tim (0 = chỉ có lớp vỏ, 0.5 = đặc ruột)
      heartDepth: 0.6, // độ PHỒNG của trái tim theo chiều sâu (0.3 dẹt ... 0.7 rất phồng)
      heartDotSize: 1, // nhân kích thước đốm của trái tim (1 = mặc định, 1.3 = đốm to hơn)
      shardCount: 48, // vụ nổ ở cảnh vũ trụ: số mảnh vỡ pha lê (giảm = nhẹ hơn)
      shardCountLite: 26,
      rayCount: 22, // số tia sáng bắn ra
      rayCountLite: 12,
      sparkCount: 30, // số tia lửa nhỏ
      sparkCountLite: 14,
      sparkAfter: 0.35, // ĐỐM SÁNG BAY LÊN SAU KHI TRÁI TIM ĐÃ HÌNH THÀNH: giữ lại bao nhiêu phần (1 = giữ nguyên, 0.35 = còn 35%, 0 = tắt hết)
      sparkPool: 1200, // số đốm sáng hồng nhỏ bay lên ở nền (vẽ trên canvas nên rất nhẹ)
      sparkPoolLite: 480,
      fireGlow: 0.6, // BÁN KÍNH QUẦNG SÁNG của pháo hoa (nhân với bán kính nổ; nhỏ hơn = quầng hẹp hơn)
      fireDensity: 0.9, // số hạt mỗi quả pháo hoa (giảm = nhẹ hơn, tăng = rực hơn)
      iconPool: 20, // tổng số tim/hoa bay lên
      iconPoolLite: 22,
      iconWave: 7, // số tim/hoa mỗi đợt (cứ ~1,8 giây một đợt)
      iconWaveLite: 4,
      rainCount: 10, // số chữ mưa rơi cùng lúc (rơi liên tục, không ngắt quãng)
      rainCountLite: 8,
      rainFall: 12000, // TỐC ĐỘ RƠI: ms để một chữ đi hết màn hình (tăng = rơi chậm hơn)
      rainGap: 1700, // NHỊP CHỮ MƯA MỚI: ms giữa 2 chữ mưa bắt đầu rơi (giảm = chữ tiếp theo xuất hiện nhanh hơn)
    }, // ms mỗi câu đứng yên trước khi rơi đi
    scanHold: 2000, // ms phải giữ ngón tay ở vòng quét vân tay
    imgDir: "anhMy/",
    // ----- CẢNH VŨ TRỤ -----
    spawnEvery: 0.65, // giây giữa 2 vật thể bay lên. TĂNG = ít vật thể cùng lúc, thưa và nhẹ hơn. GIẢM = dày hơn
    flyFor: 25000, // ms từ lúc ảnh bắt đầu bay đến khi hiện nút "Xem tiếp"
    wishWordMs: 70, // ms giữa 2 chữ khi hiện lời chúc trên lá thư (tăng = hiện chậm hơn). Nhớ chỉnh cùng số trong style.css (--wd)
  };
  const ZOOM_MIN = 0.65,
    ZOOM_MAX = 4.0; // giới hạn phóng to/thu nhỏ toàn cảnh (nhỏ nhất, lớn nhất)
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
    let mRaf = 0;
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
      play(list = CONFIG.music) {
        let mk = 0;
        au.loop = true;
        try {
          au.volume = 0;
        } catch (e) {}
        const t = () => {
          if (mk >= list.length) return;
          au.src = list[mk++];
          const p = au.play();
          p &&
            p
              .then(() => fade(CONFIG.volume, CONFIG.fadeIn))
              .catch(() => {
                // trình duyệt chặn tự phát -> chỉ cần chạm một lần là nhạc vào
                document.addEventListener(
                  "pointerdown",
                  () =>
                    au
                      .play()
                      .then(() => fade(CONFIG.volume, CONFIG.fadeIn))
                      .catch(() => {}),
                  { once: true },
                );
              });
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

    /* -------------------- NHẠC DẠO ĐẦU Ở CẢNH QUÉT VÂN TAY (kênh riêng, không đụng nhạc chính) -------------------- */
    const au2 = $("#bgm2");
    let iRaf = 0;
    const fade2 = (to, ms, cb) => {
      cancelAnimationFrame(iRaf);
      const f = au2.volume,
        t0 = performance.now();
      const st = (t) => {
        const p = Math.min(1, (t - t0) / ms);
        try {
          au2.volume = f + (to - f) * p;
        } catch (e) {}
        p < 1 ? (iRaf = requestAnimationFrame(st)) : cb && cb();
      };
      iRaf = requestAnimationFrame(st);
    };
    const Intro = {
      // gọi ngay trong lúc người dùng chạm (nút "Bắt đầu") để trình duyệt cho phép phát nhạc ở cảnh sau
      unlock() {
        if (!au2) return;
        try {
          au2.muted = true;
          au2.src = CONFIG.musicIntro[0];
          const p = au2.play();
          const back = () => {
            au2.muted = false;
          };
          p
            ? p
                .then(() => {
                  au2.pause();
                  au2.currentTime = 0;
                  back();
                })
                .catch(back)
            : back();
        } catch (e) {}
      },
      play() {
        if (!au2) return;
        const list = CONFIG.musicIntro;
        let k = 0;
        au2.loop = true;
        au2.muted = false;
        try {
          au2.volume = 0;
        } catch (e) {}
        const t = () => {
          if (k >= list.length) return;
          au2.src = list[k++];
          const p = au2.play();
          p &&
            p
              .then(() => fade2(CONFIG.volume, CONFIG.introFadeIn))
              .catch(() => {
                document.addEventListener(
                  "pointerdown",
                  () =>
                    au2
                      .play()
                      .then(() => fade2(CONFIG.volume, CONFIG.introFadeIn))
                      .catch(() => {}),
                  { once: true },
                );
              });
        };
        au2.onerror = t;
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC && CONFIG.boost > 1 && !au2._boost) {
            const ctx = new AC(),
              g = ctx.createGain();
            g.gain.value = CONFIG.boost;
            ctx
              .createMediaElementSource(au2)
              .connect(g)
              .connect(ctx.destination);
            ctx.resume();
            au2._boost = 1;
          }
        } catch (e) {}
        t();
      },
      fadeOut(ms = CONFIG.introFadeOut) {
        if (au2) fade2(0, ms, () => au2.pause());
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
        let ok = false,
          netErr = false;
        try {
          // gửi dạng text/plain để trình duyệt KHÔNG phải "hỏi trước" (preflight) -> ít chỗ có thể lỗi hơn; Worker vẫn đọc được JSON
          const r = await fetch(CONFIG.passApi, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ p: buf }),
          });
          if (!r.ok) throw new Error("Worker trả về HTTP " + r.status);
          ok = (await r.json()).ok === true;
        } catch (e) {
          netErr = true;
          // mở F12 -> Console để biết lý do thật (sai địa chỉ / chưa deploy / bị chặn CORS...)
          console.error("[Mật khẩu] Không gọi được Worker:", CONFIG.passApi, e);
        }
        if (ok) {
          slotsEl.classList.add("ok");
          say("");
          await wait(380);
          locked = false;
          done();
        } else {
          say(
            netErr ? "Mạng đang lỗi, thử lại nhé" : "Nhập sai rồi, thử lại nhé",
          );
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
      Intro.unlock(); // mở khóa sẵn kênh nhạc dạo đầu (nhacdaodau.mp3) cho cảnh quét vân tay
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
        plain = q.w || q.d || q.intro;
      el.className = q.intro
        ? "sp-item sp-wish sp-big"
        : "sp-item " + (q.w ? "sp-wish" : q.d ? "sp-deco" : "sp-photo");
      if (q.intro || q.w) el.textContent = q.intro || q.w;
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
        hold: 0, // giây đứng yên trước khi bay (chữ mở đầu)
        k: 1, // hệ số tốc độ (0 -> 1: bắt đầu bay từ từ)
      };
      if (q.w) it.x = clamp(it.x, 100 - EX, W - 100 + EX); // câu chúc ngắn không bị tràn mép màn hình
      if (q.intro) {
        // hiện giữa màn hình, đứng ~2.8s cho đọc kịp rồi trôi lên cùng ảnh
        it.x = W / 2;
        it.y = H * 0.46;
        it.r = -2;
        it.vy = -46;
        it.sw = 6;
        it.hold = 2.8;
        it.k = 0;
      }
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
          if (it.hold > 0) it.hold -= dt;
          else {
            if (it.k < 1) it.k = Math.min(1, it.k + dt * 0.6);
            it.y += it.vy * it.k * dt;
          }
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
      seq = [{ intro: CONFIG.introText }]; // món đầu tiên bay lên là dòng chữ chào
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

    /* VỤ NỔ MẢNH VỠ (bản tối ưu): toàn bộ vụ nổ vẽ trên MỘT canvas duy nhất, dùng lại các mảng hạt cố định
       (không tạo/xoá phần tử DOM, không animate từng mảnh bằng clip-path 3D như trước) => hết giật.
       Chỉnh số lượng ở CONFIG.density: shardCount (mảnh vỡ), rayCount (tia sáng), sparkCount (tia lửa). */
    const BX = (() => {
      const D = CONFIG.density,
        NS = LITE ? D.shardCountLite : D.shardCount,
        NR = LITE ? D.rayCountLite : D.rayCount,
        NK = LITE ? D.sparkCountLite : D.sparkCount,
        SH = ["#ff8fb8", "#ffb3cf", "#ff6f9f", "#ffd1e1", "#ffd980", "#ffffff"],
        DK = ["#d94f86", "#c23c78", "#a455c9", "#e07a9f"],
        // mảng dùng lại cho mọi lần nổ
        sg = new Float32Array(NS), // góc bay
        sd = new Float32Array(NS), // quãng bay
        sz = new Float32Array(NS), // kích thước
        sax = new Float32Array(NS), // tốc độ lật
        saz = new Float32Array(NS), // tốc độ xoay
        sdr = new Float32Array(NS), // độ rơi
        sdu = new Float32Array(NS), // thời lượng (ms)
        sv = new Float32Array(NS * 6), // 3 đỉnh tam giác (x,y)
        sc1 = new Array(NS),
        sc2 = new Array(NS),
        sc3 = new Array(NS),
        rg = new Float32Array(NR),
        rl = new Float32Array(NR),
        rd = new Float32Array(NR),
        ru = new Float32Array(NR),
        rc = new Array(NR),
        kg = new Float32Array(NK),
        kv = new Float32Array(NK),
        ks = new Float32Array(NK),
        ku = new Float32Array(NK);
      let cv = null,
        c = null,
        raf = 0,
        t0 = 0,
        cx = 0,
        cy = 0,
        dpr = 1;
      const TOT = 2400,
        eo = (x) => 1 - Math.pow(1 - x, 3),
        draw = (now) => {
          const t = now - t0,
            w = cv.width / dpr,
            h = cv.height / dpr;
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
          c.clearRect(0, 0, w, h);
          // 1) hai vòng sóng xung kích
          c.globalCompositeOperation = "lighter";
          for (let i = 0; i < 2; i++) {
            const f = (t - i * 130) / (850 + i * 300);
            if (f <= 0 || f >= 1) continue;
            const e = 1 - Math.pow(1 - f, 3);
            c.globalAlpha = (1 - f) * 0.9;
            c.lineWidth = i ? 1.5 : 2.5;
            c.strokeStyle = i ? "#ffbedc" : "#fff";
            c.beginPath();
            c.arc(cx, cy, 6 + e * (i ? 300 : 390), 0, 6.2832);
            c.stroke();
          }
          // 2) tia sáng
          c.lineWidth = 2.5;
          c.lineCap = "round";
          for (let i = 0; i < NR; i++) {
            const f = t / ru[i];
            if (f >= 1) continue;
            const e = 1 - Math.pow(1 - f, 3),
              r1 = 24 + e * rd[i],
              r0 = Math.max(24, r1 - rl[i] * (0.2 + 0.8 * e)),
              ca = Math.cos(rg[i]),
              sa = Math.sin(rg[i]);
            c.globalAlpha = 1 - f;
            c.strokeStyle = rc[i];
            c.beginPath();
            c.moveTo(cx + ca * r0, cy + sa * r0);
            c.lineTo(cx + ca * r1, cy + sa * r1);
            c.stroke();
          }
          // 3) mảnh vỡ pha lê (tam giác xoay + lật giả 3D, tô 2 mảng sáng/màu)
          c.globalCompositeOperation = "source-over";
          for (let i = 0; i < NS; i++) {
            const f = t / sdu[i];
            if (f >= 1) continue;
            const g = sg[i],
              d = sd[i];
            let x, y, s, a;
            if (f < 0.5) {
              const e = eo(f / 0.5);
              x = cx + Math.cos(g) * d * e;
              y = cy + Math.sin(g) * d * e;
              s = 0.25 + 0.75 * e;
              a = 1;
            } else {
              const e = (f - 0.5) / 0.5;
              x = cx + Math.cos(g) * d * (1 + 0.1 * e);
              y = cy + Math.sin(g) * d * (1 + 0.1 * e) + sdr[i] * e * e;
              s = 1 - 0.2 * e;
              a = 1 - e;
            }
            const flip = Math.cos(sax[i] * f * 3.1416),
              k = i * 6,
              S = sz[i] * s;
            c.globalAlpha = a;
            c.save();
            c.translate(x, y);
            c.rotate(saz[i] * f);
            c.scale(flip, 1);
            c.fillStyle = sc2[i];
            c.beginPath();
            c.moveTo((sv[k] - 0.5) * S, (sv[k + 1] - 0.5) * S);
            c.lineTo((sv[k + 2] - 0.5) * S, (sv[k + 3] - 0.5) * S);
            c.lineTo((sv[k + 4] - 0.5) * S, (sv[k + 5] - 0.5) * S);
            c.closePath();
            c.fill();
            c.fillStyle = flip > 0 ? sc1[i] : sc3[i]; // mặt sáng / mặt tối khi lật
            c.beginPath();
            c.moveTo((sv[k] - 0.5) * S, (sv[k + 1] - 0.5) * S);
            c.lineTo((sv[k + 2] - 0.5) * S, (sv[k + 3] - 0.5) * S);
            c.lineTo(
              ((sv[k + 4] + sv[k]) / 2 - 0.5) * S,
              ((sv[k + 5] + sv[k + 1]) / 2 - 0.5) * S,
            );
            c.closePath();
            c.fill();
            c.restore();
          }
          // 4) tia lửa nhỏ
          c.globalCompositeOperation = "lighter";
          c.fillStyle = "#ffd6e8";
          for (let i = 0; i < NK; i++) {
            const f = t / ku[i];
            if (f >= 1) continue;
            const e = 1 - Math.pow(1 - f, 2.2),
              r = kv[i] * e;
            c.globalAlpha = (1 - f) * 0.9;
            c.beginPath();
            c.arc(
              cx + Math.cos(kg[i]) * r,
              cy + Math.sin(kg[i]) * r + 40 * f * f,
              ks[i] * (1 - 0.5 * f),
              0,
              6.2832,
            );
            c.fill();
          }
          c.globalAlpha = 1;
          if (t < TOT) raf = requestAnimationFrame(draw);
          else {
            cv.style.display = "none";
            raf = 0;
          }
        };
      return (x, y) => {
        if (!cv) {
          cv = document.createElement("canvas");
          cv.style.cssText =
            "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none";
          fx.appendChild(cv);
          c = cv.getContext("2d");
        }
        dpr = Math.min(window.devicePixelRatio || 1, LITE ? 1 : 1.5);
        const w = view.clientWidth || W,
          h = view.clientHeight || H;
        cv.width = Math.round(w * dpr);
        cv.height = Math.round(h * dpr);
        cv.style.display = "block";
        cx = x;
        cy = y;
        for (let i = 0; i < NS; i++) {
          const size =
              i < 7 ? rand(38, 56) : i % 3 ? rand(16, 30) : rand(9, 16),
            big = size / 56,
            spin = 1 - 0.5 * big;
          sg[i] = (i / NS) * 6.283 + rand(-0.25, 0.25);
          sd[i] = rand(0.55, 1) * (300 - 170 * big);
          sz[i] = size;
          sax[i] = rand(-3, 3) * spin;
          saz[i] = rand(-4, 4) * spin;
          sdr[i] = rand(60, 150);
          sdu[i] = rand(1500, 2300) * (0.85 + 0.3 * big);
          sv[i * 6] = rand(0, 0.25);
          sv[i * 6 + 1] = rand(0, 0.3);
          sv[i * 6 + 2] = rand(0.72, 1);
          sv[i * 6 + 3] = rand(0.05, 0.45);
          sv[i * 6 + 4] = rand(0.25, 0.75);
          sv[i * 6 + 5] = rand(0.78, 1);
          sc1[i] = "#fff";
          sc2[i] = pick(SH);
          sc3[i] = pick(DK);
        }
        for (let i = 0; i < NR; i++) {
          rg[i] = (i / NR) * 6.283 + rand(-0.1, 0.1);
          rl[i] = rand(38, 80);
          rd[i] = rand(130, 300);
          ru[i] = rand(650, 1000);
          rc[i] = pick(SH);
        }
        for (let i = 0; i < NK; i++) {
          kg[i] = rand(0, 6.283);
          kv[i] = rand(120, 330);
          ks[i] = rand(1.2, 2.6);
          ku[i] = rand(900, 1300);
        }
        t0 = performance.now();
        if (!raf) raf = requestAnimationFrame(draw);
        // rung nhẹ cả cảnh
        view.animate(
          [
            { transform: "translate(0,0)" },
            { transform: "translate(-5px,3px)" },
            { transform: "translate(4px,-3px)" },
            { transform: "translate(-3px,-2px)" },
            { transform: "translate(2px,2px)" },
            { transform: "translate(0,0)" },
          ],
          { duration: 420, composite: "add", easing: "ease-out" },
        );
      };
    })();
    const shatter = (cx, cy) => BX(cx, cy);

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
      shatter(gx, gy); // nổ ra mảnh vỡ (thay cho cánh hoa + chấm cũ)
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
      vidWrap = $("#vidWrap"),
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
          if (vStarted) finale();
          return;
        }
        vid.src = CONFIG.video[vk++];
        vid.preload = "auto";
        vid.load();
      };
      vid.addEventListener("error", () => (vStarted ? finale() : t()));
      vid.addEventListener("ended", () => finale());
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
      if (vk >= CONFIG.video.length && vid.error) finale();
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
    /* -------------------- 4. CẢNH CUỐI --------------------
       video hết -> mờ & ẩn -> đốm sáng bé + tim/hoa bay lên theo từng đợt (3 giây)
       -> đốm sáng tụ lại thành trái tim 3D căng phồng, xoay nhẹ -> pháo hoa nổ quanh -> chữ.
       Hiệu năng: vật thể DOM chỉ animate transform + opacity và được TÁI SỬ DỤNG (pool cố định);
       trái tim + pháo hoa vẽ trên MỘT canvas bằng sprite dựng sẵn (không blur, không tạo phần tử mới);
       dừng toàn bộ khi tab bị ẩn. */
    let finOn = false,
      finPaused = false,
      finEng = null;
    const ICONS = [
      "heart",
      "heart",
      "f-rose",
      "heart",
      "f-blossom",
      "heart",
      "f-daisy",
      "bouquet",
      "petal",
      "sparkle",
      "heart",
      "f-rose",
    ];
    const riseAnims = new Set();
    // bay 1 phần tử từ dưới lên rồi mờ dần; xong thì trả về pool (không tạo thêm phần tử)
    function launch(item, Wv, Hv, spark, delay) {
      item.busy = true;
      const el = item.el,
        x = rand(0.04, 0.96) * Wv,
        y0 = Hv + 40,
        dy = rand(0.55, 1) * Hv + 90,
        dx = rand(-45, 45),
        sc = spark ? rand(0.5, 1.15) : rand(0.65, 1.3),
        op = spark ? rand(0.85, 1) : rand(0.8, 1),
        rot = spark ? 0 : rand(-50, 50);
      const a = el.animate(
        [
          {
            transform: `translate3d(${x.toFixed(1)}px,${y0}px,0) scale(${(sc * 0.5).toFixed(2)}) rotate(0deg)`,
            opacity: 0,
          },
          { opacity: op, offset: 0.12 },
          { opacity: op, offset: 0.7 },
          {
            transform: `translate3d(${(x + dx).toFixed(1)}px,${(y0 - dy).toFixed(1)}px,0) scale(${sc.toFixed(2)}) rotate(${rot.toFixed(0)}deg)`,
            opacity: 0,
          },
        ],
        {
          duration: rand(5200, 8800) * (spark ? 0.85 : 1),
          delay: delay || 0,
          easing: "ease-out",
        },
      );
      riseAnims.add(a);
      if (finPaused) a.pause();
      a.onfinish = () => {
        a.cancel();
        riseAnims.delete(a);
        item.busy = false;
      };
    }
    // một ĐỢT: đánh thức tối đa n phần tử đang rảnh (xuất hiện lệch nhau trong ~0.7s)
    function wave(pool, n, Wv, Hv, spark) {
      let k = 0;
      for (const it of pool) {
        if (k >= n) break;
        if (!it.busy) {
          launch(it, Wv, Hv, spark, rand(0, 700));
          k++;
        }
      }
    }
    const DEN = CONFIG.density;
    function startRise(Wv, Hv) {
      const iconW = LITE ? DEN.iconWaveLite : DEN.iconWave;
      const layer = $("#finRise"),
        fr = document.createDocumentFragment(),
        hearts = [],
        nI = LITE ? DEN.iconPoolLite : DEN.iconPool; // pool tim/hoa (đốm sáng nhỏ giờ vẽ trên canvas)
      for (let i = 0; i < nI; i++) {
        const e = document.createElement("i");
        e.className = "lv";
        e.style.color = pick(COLS);
        e.innerHTML = `<svg><use href="#${ICONS[i % ICONS.length]}"/></svg>`;
        fr.appendChild(e);
        hearts.push({ el: e, busy: false });
      }
      layer.appendChild(fr);
      finOn = true;
      wave(hearts, Math.round(iconW * 1.3), Wv, Hv, false);
      let n = 0;
      const timer = setInterval(() => {
        if (document.hidden || finPaused) return;
        n++;
        if (n % 2 === 0) wave(hearts, iconW, Wv, Hv, false);
      }, 900);
      // dừng mọi thứ khi tab bị ẩn, chạy tiếp khi quay lại
      // document.addEventListener("visibilitychange", () => {
      //   finPaused = document.hidden;
      //   riseAnims.forEach((a) => (finPaused ? a.pause() : a.play()));
      //   if (finEng) finPaused ? finEng.pause() : finEng.resume();
      // });
      // return timer;
    }

    /* Canvas: đốm sáng -> trái tim rỗng + pháo hoa + sao băng */
    const hexRGB = (h) => [
      parseInt(h.slice(1, 3), 16),
      parseInt(h.slice(3, 5), 16),
      parseInt(h.slice(5, 7), 16),
    ];
    function sprite(hex, size, hard) {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d"),
        r = size / 2,
        [R, G, B] = hexRGB(hex),
        col = (a) => `rgba(${R},${G},${B},${a})`,
        gr = g.createRadialGradient(r, r, 0, r, r, r);
      if (hard) {
        // pháo hoa: lõi sáng nhỏ, rõ nét
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.26, "rgba(255,255,255,.95)");
        gr.addColorStop(0.46, col(0.9));
        gr.addColorStop(0.75, col(0.25));
        gr.addColorStop(1, col(0));
      } else {
        // đốm trái tim: ánh sáng MỀM, tâm hơi trắng nhưng không thành chấm gắt
        gr.addColorStop(0, "rgba(255,196,222,.8)"); // lõi hồng nhạt (không còn trắng chói)
        gr.addColorStop(0.2, col(0.95));
        gr.addColorStop(0.5, col(0.34));
        gr.addColorStop(1, col(0));
      }
      g.fillStyle = gr;
      g.fillRect(0, 0, size, size);
      return c;
    }
    function startFinCanvas(Wv, Hv) {
      const cv = $("#finCv"),
        ctx = cv && cv.getContext("2d");
      if (!ctx) return null;
      const dpr = Math.min(window.devicePixelRatio || 1, LITE ? 1.15 : 1.5),
        RISE = 3000, // ms: đốm sáng bay lên 3 giây (sau đó lơ lửng chờ quét vân tay)
        clamp = (v, a, b) => (v < a ? a : v > b ? b : v),
        ease = (q) => 1 - Math.pow(1 - q, 3),
        TAU = Math.PI * 2;
      let W = Wv,
        H = Hv,
        cx = 0,
        cy = 0,
        hw = 0,
        cam = 0;
      const layout = () => {
        W = S.vs.clientWidth || Wv;
        H = S.vs.clientHeight || Hv;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        cx = W / 2;
        cy = H * 0.38;
        hw = Math.min(W * 0.3, H * 0.175, 125); // nửa bề ngang trái tim (chừa chỗ cho pháo hoa)
        cam = hw * 6.5; // khoảng cách camera -> độ phối cảnh khi xoay
      };
      layout();
      addEventListener("resize", layout);

      // ----- sprite dựng sẵn -----
      const HC = ["#ff3f86", "#ff5c9a", "#ff7db0", "#ff9ec6", "#ffbfd8"], // trái tim: các sắc HỒNG (tối -> sáng), không dùng trắng
        FC = [
          "#ff5f9f",
          "#ffd166",
          "#ff9ec4",
          "#c98bff",
          "#7de3ff",
          "#fff1a8",
          "#ff7a59",
        ],
        hs = HC.map((c) => sprite(c, 48, false)),
        fs = FC.map((c) => sprite(c, 16, true)), // sprite pháo hoa nhỏ 16px: nhẹ + sắc nét
        glow = sprite("#ff9ec4", 64, false),
        meteorSp = sprite("#cfe6ff", 32, true);

      // ----- trái tim 3D ĐẦY ĐẶN như ảnh mẫu: hàng nghìn đốm li ti phủ kín thể tích "chiếc gối" hình tim -----
      // mỗi hạt: (x, z) nằm trong hình trái tim; chiều sâu d = ±heartDepth·√(1-s²) (s = 0 ở tâm, 1 ở mép)
      // => giữa dày nhất, mép mỏng dần; nhìn ngang (xoay 90°) ra hình elip dẹt giống ảnh.
      const SAMP = 720,
        cx0 = [],
        cz0 = [],
        cum = [0];
      for (let i = 0; i <= SAMP; i++) {
        const t = (i / SAMP) * TAU;
        const cz =
          (13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t) +
            2.85) /
          16;
        // trái tim đầy đặn, mềm mại: nở rộng phần thân dưới một chút (đường cong liền mạch, không gấp khúc)
        cx0.push(
          Math.pow(Math.sin(t), 3) *
            (1 + 0.17 * clamp((0.35 - cz) / 1.2, 0, 1)) *
            0.95,
        );
        cz0.push(cz);
        if (i)
          cum.push(
            cum[i - 1] + Math.hypot(cx0[i] - cx0[i - 1], cz0[i] - cz0[i - 1]),
          );
      }
      const PER = cum[SAMP],
        N = LITE ? DEN.heartDotsLite : DEN.heartDots,
        pts = [];
      for (let i = 0; i < N; i++) {
        const u = Math.random() * PER;
        let a = 0,
          b = SAMP;
        while (b - a > 1) {
          const m = (a + b) >> 1;
          if (cum[m] < u) a = m;
          else b = m;
        }
        const inner = Math.random() < DEN.heartFill, // hạt nằm bên trong thể tích hay nằm trên vỏ
          s = inner ? Math.sqrt(Math.random()) : Math.pow(Math.random(), 0.42), // vỏ: dồn nhiều hạt về phía mép cho nét tim đầy
          dome = Math.sqrt(Math.max(0, 1 - s * s)),
          sign = Math.random() < 0.5 ? -1 : 1,
          x = cx0[b] * s,
          z = cz0[b] * s,
          dd = inner ? rand(-1, 1) * dome : sign * dome + rand(-0.03, 0.03),
          nl = Math.hypot(x * 0.9, z * 0.9, 0.35 + 0.65 * dome) || 1,
          sx0 = rand(0.02, 0.98);
        pts.push({
          x,
          z,
          d: dd * DEN.heartDepth, // độ sâu của hạt khi là trái tim
          rd: rand(-1, 1), // độ sâu của hạt khi còn bay lơ lửng
          nx: (x * 0.9) / nl, // pháp tuyến xấp xỉ (để đổ bóng sáng-tối khi xoay)
          nz: (z * 0.9) / nl,
          nd: inner ? 0 : (sign * (0.35 + 0.65 * dome)) / nl,
          r:
            (Math.random() < 0.08 ? rand(8, 11) : rand(4.5, 7.5)) *
            DEN.heartDotSize,
          sp: Math.random() < 0.12, // hạt lấp lánh mạnh hơn
          ts: rand(1.6, 3.6),
          ph: rand(0, TAU),
          ci: 1 + ((Math.random() * 3) | 0),
          cj: Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? -1 : 1,
          dly: rand(0, 800),
          dur: rand(2200, 3100),
          ad: rand(0, 1400), // lúc bắt đầu hiện ra khi bay lên
          sx: sx0,
          sy: rand(1.03, 1.16),
          ex: clamp(sx0 + rand(-0.08, 0.08), 0.03, 0.97),
          ey: rand(0.05, 0.93), // đám đốm trải dài theo chiều dọc màn hình (hình chữ nhật đứng)
          wob: rand(2, 8),
          qx: 0,
          qy: 0,
          qs: 0,
          qa: 0,
          qi: 0,
        });
      }
      const listBack = new Int16Array(N),
        listFront = new Int16Array(N);

      // ----- bụi sao hồng bay lên (nền, vẽ trên canvas: rẻ hơn rất nhiều so với phần tử DOM) -----
      const DN = LITE ? DEN.sparkPoolLite : DEN.sparkPool,
        dX = new Float32Array(DN),
        dY = new Float32Array(DN),
        dV = new Float32Array(DN),
        dP = new Float32Array(DN),
        dS = new Float32Array(DN),
        dA = new Float32Array(DN),
        dC = new Uint8Array(DN),
        dsp = ["#ff5c9a", "#ff7db0", "#ff9ec6", "#ffb3d0"].map((c) =>
          sprite(c, 16, false),
        );
      for (let i = 0; i < DN; i++) {
        dX[i] = Math.random() * W;
        dY[i] = rand(0.1, 1.08) * H;
        dV[i] = rand(35, 95);
        dP[i] = rand(0, TAU);
        dS[i] = rand(3.5, 8);
        dA[i] = rand(0, 2600); // ms: lúc bắt đầu hiện ra (rải đều để không bị "bật" cùng lúc)
        dC[i] = (Math.random() * dsp.length) | 0;
      }

      // ----- pháo hoa: pool hạt cố định (typed array), tái sử dụng -----
      const M = LITE ? 200 : 360,
        qx = new Float32Array(M),
        qy = new Float32Array(M),
        qvx = new Float32Array(M),
        qvy = new Float32Array(M),
        qa = new Float32Array(M),
        ql = new Float32Array(M),
        qs = new Float32Array(M),
        qsp = new Uint8Array(M),
        qon = new Uint8Array(M);
      let qcur = 0;
      const spawn = (x, y, vx, vy, life, sz, sp) => {
        for (let k = 0; k < M; k++) {
          const i = (qcur + k) % M;
          if (!qon[i]) {
            qcur = (i + 1) % M;
            qx[i] = x;
            qy[i] = y;
            qvx[i] = vx;
            qvy[i] = vy;
            qa[i] = 0;
            ql[i] = life;
            qs[i] = sz;
            qsp[i] = sp;
            qon[i] = 1;
            return;
          }
        }
      };
      const shells = [];
      const burst = (sh) => {
        const v = sh.R * 2.3,
          n = (LITE ? 0.62 : 1) * DEN.fireDensity,
          c1 = sh.c,
          c2 = (sh.c + 1 + ((Math.random() * 5) | 0)) % FC.length,
          rot = rand(0, TAU);
        spawn(sh.tx, sh.ty, 0, 0, 0.35, sh.R * DEN.fireGlow, 7); // quầng sáng lóe (CONFIG.density.fireGlow: nhỏ hơn = quầng hẹp hơn)
        if (sh.type === 0) {
          // pháo cầu
          for (let i = 0, m = (48 * n) | 0; i < m; i++) {
            const a = rand(0, TAU),
              s = v * (0.3 + 0.7 * Math.sqrt(Math.random()));
            spawn(
              sh.tx,
              sh.ty,
              Math.cos(a) * s,
              Math.sin(a) * s,
              rand(1.5, 2.1),
              rand(8, 11),
              i % 5 ? c1 : c2,
            );
          }
        } else if (sh.type === 1) {
          // pháo vòng 2 lớp
          for (let i = 0, m = (34 * n) | 0; i < m; i++) {
            const a = (i / m) * TAU + rot;
            spawn(sh.tx, sh.ty, Math.cos(a) * v, Math.sin(a) * v, 1.8, 9, c1);
            if (i % 2 === 0)
              spawn(
                sh.tx,
                sh.ty,
                Math.cos(a) * v * 0.55,
                Math.sin(a) * v * 0.55,
                1.6,
                8,
                c2,
              );
          }
        } else if (sh.type === 2) {
          // HOA NỔ: 5 cánh theo đường hoa hồng r = |cos(2.5θ)| + nhụy
          for (let i = 0, m = (62 * n) | 0; i < m; i++) {
            const a = (i / m) * TAU,
              r = Math.abs(Math.cos(2.5 * a)),
              s = v * (0.2 + 0.8 * r) * (i % 2 ? 1 : 0.8);
            spawn(
              sh.tx,
              sh.ty,
              Math.cos(a + rot) * s,
              Math.sin(a + rot) * s,
              1.9,
              9,
              c1,
            );
          }
          for (let i = 0, m = (8 * n) | 0; i < m; i++) {
            const a = rand(0, TAU);
            spawn(
              sh.tx,
              sh.ty,
              Math.cos(a) * v * 0.12,
              Math.sin(a) * v * 0.12,
              1.5,
              8,
              1,
            );
          }
        } else {
          // pháo hình trái tim nhỏ
          for (let i = 0, m = (40 * n) | 0; i < m; i++) {
            const t = (i / m) * TAU,
              hx = 16 * Math.pow(Math.sin(t), 3),
              hy = -(
                13 * Math.cos(t) -
                5 * Math.cos(2 * t) -
                2 * Math.cos(3 * t) -
                Math.cos(4 * t)
              );
            spawn(
              sh.tx,
              sh.ty,
              (hx / 16) * v * 0.9,
              (hy / 16) * v * 0.9,
              1.9,
              9,
              c1,
            );
          }
        }
      };
      // chọn vị trí nổ XUNG QUANH trái tim: bán kính tự co lại để không phủ lên trái tim và không đè chữ phía dưới
      const planShell = () => {
        for (let k = 0; k < 14; k++) {
          const tx = rand(0.1, 0.9) * W,
            ty = rand(0.07, 0.6) * H,
            dist = Math.hypot(tx - cx, ty - (cy + hw * 0.05)),
            R = Math.min(W * 0.24, 96, dist - hw * 1.22);
          if (R < 42 || ty + R > H * 0.64) continue;
          return { tx, ty, R };
        }
        return null;
      };
      const queue = [];
      let nextWave = Infinity; // đặt lại khi trái tim bắt đầu tụ lại
      const sendWave = (t) => {
        const cnt = LITE ? 2 : 3;
        for (let i = 0; i < cnt; i++) queue.push(t + i * 280);
        nextWave = t + rand(LITE ? 3200 : 2300, LITE ? 4200 : 3300);
      };

      // ----- sao băng: 3 vệt tái sử dụng, vẽ bằng chuỗi sprite -----
      const mt = [0, 1, 2].map(() => ({
        on: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        a: 0,
        life: 1,
      }));
      let nextMeteor = 500;
      const spawnMeteor = () => {
        const m = mt.find((q) => !q.on);
        if (!m) return;
        const ang = rand(0.35, 0.7),
          sp = rand(650, 950);
        m.on = 1;
        m.x = rand(0.35, 1.15) * W;
        m.y = rand(-0.06, 0.3) * H;
        m.vx = -Math.cos(ang) * sp;
        m.vy = Math.sin(ang) * sp;
        m.a = 0;
        m.life = rand(0.8, 1.2);
        nextMeteor = t + rand(LITE ? 2600 : 1500, LITE ? 4600 : 3400);
      };

      // ----- vòng lặp duy nhất -----
      let t = 0,
        last = 0,
        raf = 0,
        run = false,
        gatherT = -1; // -1 = chưa tụ lại (đang chờ người xem quét vân tay)
      // ----- XOAY: kéo ngang bằng ngón tay (không chạm vòng quét vân tay) -> xoay quanh trục dọc, thả ra có quán tính -----
      let yaw = 0,
        yawV = 0,
        dragging = false,
        dragId = -1,
        YMAX = 5, // tốc độ xoay tối đa (rad/giây) - chỉnh nhỏ hơn nếu muốn xoay chậm hơn
        lx = 0,
        lt = 0,
        hinted = false;
      const stage = S.vs, // khung cảnh cuối đặt pointer-events:none nên lắng nghe ở cấp tài liệu và chỉ nhận khi đang ở cảnh cuối
        inVs = () => document.body.dataset.stage === "vs";
      $("#app").style.touchAction = "none"; // kéo ngang không bị trình duyệt giành cử chỉ
      document.addEventListener("pointerdown", (e) => {
        if (
          !run ||
          !inVs() ||
          (e.target.closest && e.target.closest("#fpScan"))
        )
          return;
        if (gatherT >= 0 && t - gatherT < 3900) return; // đang tụ lại thành tim: chưa cho xoay
        if (dragging) return; // đã có 1 ngón đang kéo: bỏ qua ngón thứ 2 (tránh xoay tít khi dùng 2 ngón)
        dragging = true;
        dragId = e.pointerId;
        lx = e.clientX;
        lt = e.timeStamp;
        yawV = 0;
      });
      document.addEventListener("pointermove", (e) => {
        if (!dragging || e.pointerId !== dragId) return; // chỉ theo đúng ngón đầu tiên
        const dx = clamp(e.clientX - lx, -40, 40), // giới hạn mỗi nhịp kéo
          dt = Math.max(12, e.timeStamp - lt); // dt tối thiểu 12ms: không bao giờ chia cho số quá nhỏ
        lx = e.clientX;
        lt = e.timeStamp;
        yaw += dx * 0.011;
        yawV = clamp(
          yawV * 0.6 + ((dx * 0.011) / (dt / 1000)) * 0.4,
          -YMAX,
          YMAX,
        );
      });
      const endDrag = (e) => {
        if (!dragging || e.pointerId !== dragId) return;
        dragging = false;
        if (e.timeStamp - lt > 90) yawV = 0; // dừng tay rồi mới nhả -> không trượt tiếp
      };
      document.addEventListener("pointerup", endDrag);
      document.addEventListener("pointercancel", endDrag);
      // gợi ý một lần khi trái tim đã thành hình
      const showHint = () => {
        const h = document.createElement("p");
        h.textContent = "Kéo ngang để xoay trái tim";
        h.style.cssText =
          "position:absolute;left:0;right:0;top:9%;margin:0;text-align:center;font:600 13px/1.3 system-ui,sans-serif;letter-spacing:.04em;color:rgba(255,255,255,.8);pointer-events:none;opacity:0";
        stage.appendChild(h);
        const a = h.animate(
          [
            { opacity: 0 },
            { opacity: 1, offset: 0.12 },
            { opacity: 1, offset: 0.8 },
            { opacity: 0 },
          ],
          {
            duration: 5200,
          },
        );
        a.onfinish = () => h.remove();
      };
      const waiters = [];
      const step = (now) => {
        if (!run) return;
        raf = requestAnimationFrame(step);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt * 1000;
        const gt = gatherT < 0 ? -1 : t - gatherT;

        if (t >= nextMeteor) spawnMeteor();
        // lịch pháo hoa (chỉ sau khi trái tim bắt đầu tụ lại)
        if (gatherT >= 0 && t >= nextWave) sendWave(t);
        while (queue.length && queue[0] <= t) {
          queue.shift();
          const p = planShell();
          if (p)
            shells.push({
              tx: p.tx,
              ty: p.ty,
              R: p.R,
              sx: p.tx + rand(-30, 30),
              p: 0,
              dur: rand(0.7, 0.95),
              c: (Math.random() * FC.length) | 0,
              type: (Math.random() * 4) | 0,
            });
        }
        // vật lý hạt pháo hoa
        const drag = Math.exp(-2.2 * dt);
        for (let i = 0; i < M; i++) {
          if (!qon[i]) continue;
          qa[i] += dt;
          if (qa[i] >= ql[i]) {
            qon[i] = 0;
            continue;
          }
          qvx[i] *= drag;
          qvy[i] = qvy[i] * drag + 34 * dt;
          qx[i] += qvx[i] * dt;
          qy[i] += qvy[i] * dt;
        }

        ctx.clearRect(0, 0, W, H);

        // -1) bụi sao hồng bay lên liên tục (nền)
        const dustOff = gt < 0 ? 0 : clamp((gt - 3000) / 1500, 0, 1);
        ctx.globalCompositeOperation = "source-over";
        for (let i = 0; i < DN; i++) {
          const ap = (t - dA[i]) / 900;
          if (ap <= 0) continue;
          // sau khi tim thành hình: các đốm vượt quá tỉ lệ sparkAfter mờ dần rồi tắt hẳn
          const keep = i < DN * DEN.sparkAfter ? 1 : 1 - dustOff;
          if (keep <= 0) continue;
          dY[i] -= dV[i] * dt;
          if (dY[i] < -10) {
            dY[i] = H + 10;
            dX[i] = Math.random() * W;
          }
          const tw = 0.5 + 0.5 * Math.sin(t * 0.002 + dP[i]),
            top = clamp(dY[i] / (H * 0.12), 0, 1);
          ctx.globalAlpha = (ap > 1 ? 1 : ap) * (0.5 + 0.5 * tw) * top * keep;
          const sz = dS[i],
            x = dX[i] + Math.sin(t * 0.0012 + dP[i]) * 6;
          ctx.drawImage(dsp[dC[i]], x - sz / 2, dY[i] - sz / 2, sz, sz);
        }
        ctx.globalCompositeOperation = "lighter";

        // 0) sao băng vũ trụ
        for (let k = 0; k < mt.length; k++) {
          const m = mt[k];
          if (!m.on) continue;
          m.a += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const f = m.a / m.life;
          if (f >= 1 || m.y > H || m.x < -80) {
            m.on = 0;
            continue;
          }
          const fade = Math.min(1, f * 6) * Math.min(1, (1 - f) * 3),
            nx = m.vx / Math.hypot(m.vx, m.vy),
            ny = m.vy / Math.hypot(m.vx, m.vy);
          for (let j = 0; j < 16; j++) {
            const s = 12 - j * 0.62,
              d = j * 9;
            ctx.globalAlpha = fade * (1 - j / 16) * 0.9;
            ctx.drawImage(
              meteorSp,
              m.x - nx * d - s / 2,
              m.y - ny * d - s / 2,
              s,
              s,
            );
          }
        }

        // 1) pháo hoa (vẽ TRƯỚC để trái tim luôn nằm trên)
        for (let i = shells.length - 1; i >= 0; i--) {
          const sh = shells[i];
          sh.p += dt / sh.dur;
          if (sh.p >= 1) {
            burst(sh);
            shells.splice(i, 1);
            continue;
          }
          for (let k = 0; k < 5; k++) {
            const q = Math.max(0, sh.p - k * 0.035),
              e = 1 - Math.pow(1 - q, 2),
              px = sh.sx + (sh.tx - sh.sx) * e,
              py = H + 12 + (sh.ty - H - 12) * e,
              s = 12 - k * 1.8;
            ctx.globalAlpha = 0.95 - k * 0.17;
            ctx.drawImage(fs[sh.c], px - s / 2, py - s / 2, s, s);
          }
        }
        for (let i = 0; i < M; i++) {
          if (!qon[i]) continue;
          const f = qa[i] / ql[i];
          let s;
          if (qsp[i] === 7) {
            s = qs[i] * (1 + f * 0.5);
            ctx.globalAlpha = (1 - f) * 0.4;
            ctx.drawImage(glow, qx[i] - s / 2, qy[i] - s / 2, s, s);
          } else {
            s = qs[i] * (1.1 - 0.45 * f);
            ctx.globalAlpha =
              (1 - f) * ((qa[i] * 9 + i * 0.37) % 1 < 0.5 ? 1 : 0.8); // nhấp nháy rẻ (không dùng sin)
            ctx.drawImage(fs[qsp[i]], qx[i] - s / 2, qy[i] - s / 2, s, s);
          }
        }

        // 2) đốm sáng: bay lên -> (chờ quét vân tay) -> tụ lại thành trái tim 3D (hướng chính diện) -> xoay
        ctx.globalCompositeOperation = "source-over";
        const formed = clamp((gt - 3000) / 900, 0, 1),
          beat =
            1 + 0.045 * formed * Math.pow(Math.max(0, Math.sin(t * 0.0048)), 3);
        if (gatherT >= 0 && formed < 1) {
          // đang tụ lại: bỏ qua kéo/xoay, từ từ trả trái tim về GÓC BAN ĐẦU (nhìn thẳng chính diện) rồi mới cho xoay
          dragging = false;
          yawV = 0;
          yaw += (Math.round(yaw / TAU) * TAU - yaw) * (1 - Math.exp(-5 * dt));
        } else if (!dragging) {
          // xoay: đang kéo thì theo tay; thả ra thì quán tính giảm dần về tốc độ xoay nhẹ (chỉ khi trái tim đã thành hình)
          yaw += yawV * dt;
          yawV = clamp(
            yawV + (0.26 * formed - yawV) * (1 - Math.exp(-2.2 * dt)),
            -YMAX,
            YMAX,
          );
        }
        if (formed >= 1 && !hinted) {
          hinted = true;
          showHint();
        }
        const cw = Math.cos(yaw),
          sw = Math.sin(yaw);
        let nb = 0,
          nf = 0;
        for (let k = 0; k < pts.length; k++) {
          const p = pts[k],
            appear = clamp((t - p.ad) / 500, 0, 1);
          if (appear <= 0) continue;
          const q = clamp((t - p.ad) / (RISE - p.ad), 0, 1),
            e = 1 - (1 - q) * (1 - q),
            g = gt < 0 ? 0 : ease(clamp((gt - p.dly) / p.dur, 0, 1)),
            rx =
              (p.sx + (p.ex - p.sx) * e) * W +
              Math.sin(t * 0.0021 + p.ph) * p.wob * (1 - g),
            ry =
              (p.sy + (p.ey - p.sy) * e) * H +
              Math.sin(t * 0.0013 + p.ph) * 4 * (1 - g),
            hx = cx + p.x * hw * beat,
            hy = cy - p.z * hw * beat,
            // vị trí 3D tương đối so với trục xoay giữa màn hình: x ngang, Y dọc, Dp chiều sâu (dương = xa)
            X = rx - cx + (hx - rx) * g,
            Y = ry + (hy - ry) * g,
            Dp = p.rd * W * 0.3 * (1 - g) + p.d * hw * beat * g,
            // xoay quanh trục dọc rồi chiếu phối cảnh: hạt gần to + sáng hơn, hạt xa nhỏ + mờ hơn
            Dr = Dp * cw - X * sw,
            sc = cam / (cam + Dr),
            // đổ bóng: pháp tuyến xoay cùng trái tim, ánh sáng chiếu từ trên-trái-phía trước
            nxr = p.nx * cw + p.nd * sw,
            ndr = p.nd * cw - p.nx * sw,
            lit =
              0.5 +
              (clamp(
                0.5 + 0.5 * (nxr * -0.35 + p.nz * 0.55 - ndr * 0.76),
                0,
                1,
              ) -
                0.5) *
                g,
            tw = 0.82 + 0.18 * Math.sin(t * 0.001 * p.ts + p.ph),
            spk =
              p.sp && g > 0.8
                ? 1 +
                  0.9 *
                    Math.pow(Math.max(0, Math.sin(t * 0.004 * p.ts + p.ph)), 10)
                : 1;
          p.qx = cx + (X * cw + Dp * sw) * sc;
          p.qy = cy + (Y - cy) * sc;
          p.qs = p.r * (0.75 + 0.25 * g) * sc * spk;
          p.qa = Math.min(
            0.95,
            appear *
              tw *
              (0.8 + 0.2 * g) *
              (0.7 + 0.3 * clamp((sc - 0.8) / 0.4, 0, 1)) *
              (0.7 + 0.5 * lit),
          );
          p.qi =
            g > 0.5
              ? clamp(Math.round(lit * 3.2) + p.cj + (spk > 1.3 ? 1 : 0), 0, 4)
              : Math.max(0, p.ci - 1);
          // hai lượt vẽ (xa -> gần) thay cho sắp xếp, rẻ hơn nhiều
          if (Dr > 0) listBack[nb++] = k;
          else listFront[nf++] = k;
        }
        for (let j = 0; j < nb; j++) {
          const p = pts[listBack[j]];
          ctx.globalAlpha = p.qa;
          ctx.drawImage(hs[p.qi], p.qx - p.qs / 2, p.qy - p.qs / 2, p.qs, p.qs);
        }
        for (let j = 0; j < nf; j++) {
          const p = pts[listFront[j]];
          ctx.globalAlpha = p.qa;
          ctx.drawImage(hs[p.qi], p.qx - p.qs / 2, p.qy - p.qs / 2, p.qs, p.qs);
        }
        ctx.globalAlpha = 1;

        // 3) giải phóng các lời hẹn theo thời gian của engine (tự dừng khi tab ẩn)
        for (let i = waiters.length - 1; i >= 0; i--)
          if (t >= waiters[i][0]) {
            const r = waiters[i][1];
            waiters.splice(i, 1);
            r();
          }
      };
      const eng = {
        at: (ms) => new Promise((r) => waiters.push([ms, r])),
        after: (ms) => new Promise((r) => waiters.push([t + ms, r])),
        gather() {
          if (gatherT >= 0) return;
          gatherT = t;
          nextWave = t + 1100; // pháo hoa bắt đầu khi trái tim đang thành hình
        },
        get gatherAt() {
          return gatherT;
        },
        get yaw() {
          return yaw;
        },
        now: () => t,
        resume() {
          if (run) return;
          run = true;
          last = performance.now();
          raf = requestAnimationFrame(step);
        },
        pause() {
          run = false;
          cancelAnimationFrame(raf);
        },
      };
      eng.resume();
      return eng;
    }

    /* Quét vân tay: đặt ngón tay vào giữ ~2 giây -> các đốm sáng mới tụ lại thành trái tim */
    function waitScan() {
      return new Promise((res) => {
        const el = $("#fpScan");
        if (!el) return res();
        let tm = 0,
          hold = false;
        const vib = (p) => {
          try {
            navigator.vibrate && navigator.vibrate(p);
          } catch (e) {}
        };
        const start = (e) => {
          if (hold) return;
          e.preventDefault();
          hold = true;
          el.classList.add("hold");
          try {
            el.setPointerCapture(e.pointerId);
          } catch (er) {}
          vib(12);
          tm = setTimeout(done, CONFIG.scanHold);
        };
        const stop = () => {
          if (!hold) return;
          hold = false;
          clearTimeout(tm);
          el.classList.remove("hold");
        };
        const done = () => {
          hold = false;
          el.classList.remove("hold");
          el.classList.add("full", "done");
          el.removeEventListener("pointerdown", start);
          el.removeEventListener("pointerup", stop);
          el.removeEventListener("pointercancel", stop);
          vib([20, 40, 30]);
          res();
        };
        el.addEventListener("pointerdown", start);
        el.addEventListener("pointerup", stop);
        el.addEventListener("pointercancel", stop);
        el.addEventListener("contextmenu", (e) => e.preventDefault());
        el.classList.add("show");
      });
    }

    /* Chữ RƠI: mỗi lần một câu trong CONFIG.fallTexts, mỗi lần một màu khác; hết danh sách thì lặp lại */
    const FALL_COLS = [
      "#ff7eb6",
      "#ffd166",
      "#7de3ff",
      "#c98bff",
      "#8affc1",
      "#ff9a76",
      "#fff1a8",
      "#ff9ec4",
    ];
    async function fallLoop(Wv, Hv) {
      const el = $("#vsT1"),
        list =
          CONFIG.fallTexts && CONFIG.fallTexts.length
            ? CONFIG.fallTexts
            : ["20-10"],
        sleep = (ms) => (finEng ? finEng.after(ms) : wait(ms));
      // Font chữ rơi: rõ nét, dễ đọc và nổi bật trên nền tối.
      el.style.fontFamily = '"Segoe UI", Arial, "Noto Sans", sans-serif';
      el.style.fontWeight = "700";
      el.style.textShadow =
        "0 0 2px rgba(255,255,255,.45), 0 0 6px currentColor, 0 1px 3px rgba(0,0,0,.65)";
      let prev = -1;
      let rainStarted = false,
        introFaded = false;
      for (let i = 0; i < list.length; i++) {
        let ci;
        do ci = (Math.random() * FALL_COLS.length) | 0;
        while (ci === prev && FALL_COLS.length > 1);
        prev = ci;
        let n = 0;
        // Dựng từng ký tự bằng DOM/textContent để dấu tiếng Việt luôn được giữ nguyên.
        el.replaceChildren();
        const words = list[i].split(" ");
        words.forEach((word, wi) => {
          const wordEl = document.createElement("span");
          wordEl.className = "fw";
          Array.from(word).forEach((ch) => {
            const charEl = document.createElement("span");
            charEl.className = "fch";
            charEl.style.setProperty("--i", n++);
            charEl.style.setProperty(
              "--r",
              `${((Math.random() - 0.5) * 50).toFixed(0)}deg`,
            );
            charEl.textContent = ch;
            wordEl.appendChild(charEl);
          });
          el.appendChild(wordEl);
          if (wi < words.length - 1)
            el.appendChild(document.createTextNode(" "));
        });
        el.style.color = FALL_COLS[ci];
        el.className = "vs-text show fall in";
        // Nhạc dạo đầu mờ dần NGAY KHI câu chữ rơi thứ CONFIG.introFadeFromEnd (tính từ cuối) bắt đầu hiện.
        if (
          !introFaded &&
          i === Math.max(0, list.length - CONFIG.introFadeFromEnd)
        ) {
          introFaded = true;
          Intro.fadeOut();
        }
        await sleep(n * 55 + 900);
        // Khi câu thứ CONFIG.loveFromEnd (tính từ cuối) xuất hiện xong: bật nhạc lãng mạn và chữ mưa cùng lúc.
        if (
          !rainStarted &&
          i === Math.max(0, list.length - CONFIG.loveFromEnd)
        ) {
          rainStarted = true;
          Music.play(CONFIG.musicLove);
          startRain(Wv, Hv);
        }
        if (i === list.length - 1) return; // câu cuối: giữ lại mãi, không lặp
        await sleep(CONFIG.fallHold);
        el.className = "vs-text show fall out";
        await sleep(n * 30 + 750 + 250);
      }
    }

    /* Chữ MƯA: chạy theo MỘT hàng đợi chung để lời bài hát xuất hiện đúng thứ tự. */
    function startRain(Wv, Hv) {
      const layer = $("#finRain");
      if (!layer) return;
      const list =
          CONFIG.rainTexts && CONFIG.rainTexts.length
            ? CONFIG.rainTexts
            : CONFIG.fallTexts,
        count = LITE ? DEN.rainCountLite : DEN.rainCount,
        D = DEN.rainFall;
      let nextText = 0,
        prev = -1,
        nextEl = 0;
      const els = [];
      const fr = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const e = document.createElement("i");
        e.className = "rain-t";
        e.dataset.rainBusy = "0";
        fr.appendChild(e);
        els.push(e);
      }
      layer.appendChild(fr);

      const spawnNext = () => {
        // Chọn phần tử rảnh; nếu tất cả vẫn đang rơi thì đợi, không bỏ qua câu nào.
        let el = null;
        for (let n = 0; n < els.length; n++) {
          const idx = (nextEl + n) % els.length;
          if (els[idx].dataset.rainBusy !== "1") {
            el = els[idx];
            nextEl = (idx + 1) % els.length;
            break;
          }
        }
        if (!el) {
          setTimeout(spawnNext, 200);
          return;
        }

        const txt = list[nextText % list.length];
        nextText++;
        const size = rand(12, 18);
        let ci;
        do ci = (Math.random() * FALL_COLS.length) | 0;
        while (ci === prev && FALL_COLS.length > 1);
        prev = ci;
        el.dataset.rainBusy = "1";
        el.textContent = txt;
        el.style.color = FALL_COLS[ci];
        el.style.fontFamily = '"Segoe UI", Arial, "Noto Sans", sans-serif';
        el.style.fontWeight = "700";
        el.style.letterSpacing = "0.2px";
        el.style.webkitTextStroke = "0.15px rgba(255,255,255,.16)";
        el.style.textShadow =
          "0 0 2px rgba(255,255,255,.35), 0 0 5px currentColor, 0 1px 3px rgba(0,0,0,.7)";
        el.style.fontSize = size.toFixed(0) + "px";
        el.style.left =
          rand(8, Math.max(9, Wv - txt.length * size * 0.6 - 8)).toFixed(0) +
          "px";
        const r = rand(-10, 10);
        const a = el.animate(
          [
            {
              transform: `translate3d(0,-50px,0) rotate(${r.toFixed(1)}deg)`,
              opacity: 0,
            },
            { opacity: 0.62, offset: 0.1 },
            { opacity: 0.62, offset: 0.86 },
            {
              transform: `translate3d(${rand(-30, 30).toFixed(0)}px,${Hv + 70}px,0) rotate(${(-r).toFixed(1)}deg)`,
              opacity: 0,
            },
          ],
          { duration: D, easing: "linear" },
        );
        riseAnims.add(a);
        if (finPaused) a.pause();
        a.onfinish = () => {
          a.cancel();
          riseAnims.delete(a);
          el.dataset.rainBusy = "0";
        };
        // Chỉ một bộ hẹn giờ cấp lời tiếp theo: không còn mỗi chữ tự lấy câu riêng.
        setTimeout(spawnNext, DEN.rainGap);
      };
      spawnNext();
    }

    async function finale() {
      if (vDone) return;
      vDone = true;
      S.vs.classList.add("out"); // video mờ dần
      await wait(1250);
      try {
        vid.pause();
        vid.removeAttribute("src"); // ẩn hẳn + nhả bộ nhớ video
        vid.load();
      } catch (e) {}
      vidWrap.style.visibility = "hidden";
      const Wv = S.vs.clientWidth,
        Hv = S.vs.clientHeight;
      S.vs.classList.add("fin");
      // Music.play(CONFIG.musicLove); // nhạc lãng mạn
      startRise(Wv, Hv); // đốm sáng bé + tim/hoa bay lên theo đợt
      finEng = startFinCanvas(Wv, Hv); // đốm sáng + sao băng; chờ quét vân tay rồi mới tụ lại
      if (finEng) {
        await finEng.at(1500); // đốm sáng bay lên một lúc rồi mới hiện vòng quét
        Intro.play(); // nhạc dạo đầu (nhacdaodau.mp3) bắt đầu cùng lúc hiện vòng quét vân tay
        await waitScan();
        finEng.gather();
        await finEng.after(800);
        $("#hbGlow").classList.add("beat");
        await finEng.after(3300); // trái tim đã thành hình
      } else {
        await wait(2000);
      }
      await fallLoop(Wv, Hv); // nhạc và chữ mưa cùng khởi động khi câu áp chót xuất hiện xong
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
