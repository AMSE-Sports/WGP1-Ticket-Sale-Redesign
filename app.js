"use strict";

const APP_CONFIG = {
  eventYear: 2026,
  dataMode: "local-development",
  privacyNoticeVersion: "JWC26-DRAFT-04",
  ticketTypes: [
    { id: "weekday-day", nameKey: "ticketWeekdayDay", price: 250 },
    { id: "weekend-day", nameKey: "ticketWeekendDay", price: 350 },
    { id: "weekday-pass", nameKey: "ticketWeekdayPass", price: 400 },
    { id: "pro-weekend", nameKey: "ticketProWeekend", price: 500 },
    { id: "all-event", nameKey: "ticketAllEvent", price: 750 },
    { id: "complimentary", nameKey: "ticketComplimentary", price: 0 }
  ]
};

const localeCodes = { th: "th-TH", en: "en-US", zh: "zh-CN", ja: "ja-JP", ko: "ko-KR", fr: "fr-FR", es: "es-ES", de: "de-DE", ru: "ru-RU", pt: "pt-BR", ar: "ar-SA", it: "it-IT" };
const translations = {
  th: {
    welcomeTitle:"ยินดีต้อนรับสู่ WGP#1", welcomeSubtitle:"กรุณาเลือกภาษาที่ต้องการใช้ในการลงทะเบียน", languageLabel:"ภาษา", devVersion:"เวอร์ชันพัฒนาปี 2026", heroSubtitle:"ลงทะเบียนผู้เข้าชมและจำหน่ายตั๋ว", devNoticeTitle:"เวอร์ชันทดสอบปี 2026", devNoticeBody:"วันแข่งขันและราคาตั๋วเป็นค่าร่าง ข้อมูลจะเก็บในอุปกรณ์นี้เท่านั้นและยังไม่ส่งเข้าฐานข้อมูลจริง",
    partVisitor:"ส่วนที่ 1 · ผู้เข้าชม", visitorTitle:"ลงทะเบียนผู้เข้าชมรายบุคคล", visitorIntro:"ผู้เข้าชมทุกคนต้องกรอกข้อมูลของตนเองทีละคนก่อนเข้าสู่ขั้นตอนจำหน่ายตั๋ว", registered:"ลงทะเบียนแล้ว", progressVisitor:"1 ข้อมูลผู้ชม", progressConsent:"2 ยืนยันสิทธิ", progressHandover:"3 ส่งคืนให้เจ้าหน้าที่",
    identityTitle:"ข้อมูลประจำตัว", identitySubtitle:"ข้อมูลส่วนบุคคล", firstName:"ชื่อจริง *", lastName:"นามสกุล *", ageGroup:"ช่วงอายุ *", selectOption:"— กรุณาเลือก —", ageUnder10:"ต่ำกว่า 10 ปี", age60Plus:"60 ปีขึ้นไป", gender:"เพศ *", male:"ชาย", female:"หญิง", nonBinary:"นอนไบนารี", preferNot:"ไม่ประสงค์ระบุ",
    profileTitle:"ที่อยู่อาศัยและข้อมูลผู้ชม", profileSubtitle:"ข้อมูลผู้ชม", country:"ประเทศที่อาศัย *", countrySelect:"— เลือกประเทศ —", city:"จังหวัดหรือเมือง *", cityPlaceholder:"เช่น ชลบุรี / พัทยา", previousAttendance:"เคยเข้าชม WGP#1 หรือไม่ *", firstTime:"มาครั้งแรก", returning:"เคยเข้าชมแล้ว", discovery:"ช่องทางที่ทำให้รู้จักงาน *", sourceMultiHint:"เลือกได้มากกว่า 1 ช่องทาง", influencer:"อินฟลูเอนเซอร์ / ครีเอเตอร์", pattayaPromotion:"ป้ายหรือสื่อในพัทยา", hotelTour:"โรงแรมหรือบริษัททัวร์", friendFamily:"เพื่อนหรือครอบครัว", previousEvent:"งาน WGP#1 ครั้งก่อน", other:"อื่น ๆ",
    guardianTitle:"ข้อมูลผู้ปกครอง", guardianSubtitle:"จำเป็นสำหรับผู้เข้าชมอายุต่ำกว่า 20 ปี", guardianName:"ชื่อ–นามสกุลผู้ปกครอง *", relationship:"ความสัมพันธ์ *", parent:"บิดา/มารดา", legalGuardian:"ผู้ปกครองตามกฎหมาย", authorizedAdult:"ผู้ใหญ่ที่ได้รับมอบหมาย", guardianPhone:"เบอร์โทรศัพท์ผู้ปกครอง *", guardianConfirm:"ข้าพเจ้าเป็นผู้ปกครองหรือผู้มีอำนาจดำเนินการแทนผู้เยาว์ และยืนยันข้อมูลข้างต้น",
    privacyTitle:"ประกาศความเป็นส่วนตัวและสื่อภายในงาน", privacySubtitle:"ความเป็นส่วนตัวและสื่อภายในงาน", privacyRegistration:"<strong>การลงทะเบียนและจำหน่ายตั๋ว:</strong> WGP#1 เก็บข้อมูลที่จำเป็นเพื่อยืนยันตัวผู้เข้าชม บริหารตั๋ว วิเคราะห์จำนวนผู้ชม และรักษาความปลอดภัยภายในงาน โดยจัดเก็บตามระยะเวลาที่องค์กรกำหนดและให้สิทธิเจ้าของข้อมูลตามกฎหมาย", privacyMedia:"<strong>การบันทึกภาพ วิดีโอ และเสียง:</strong> ข้าพเจ้าอนุญาตและยินยอมให้ผู้จัดงาน WGP#1 รวมถึงช่างภาพ ผู้ผลิตสื่อ และผู้ได้รับมอบหมาย บันทึกภาพนิ่ง ภาพเคลื่อนไหว และเสียงของข้าพเจ้าภายในงาน และนำไปใช้หรือเผยแพร่ผ่านสื่อต่าง ๆ เพื่อรายงานและประชาสัมพันธ์กิจกรรมของ WGP#1", privacyAck:"ข้าพเจ้ายินยอมตามประกาศความเป็นส่วนตัวและสื่อภายในงาน", marketingConsent:"ฉันยินยอมรับข่าวสารการแข่งขันและกิจกรรมในอนาคตจาก WGP#1 (ไม่บังคับ)", marketingEmail:"อีเมลสำหรับรับข่าวสาร (ไม่บังคับ)", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"กรอกอีเมลหากต้องการให้ WGP#1 ส่งข่าวสารถึงคุณ โดยสามารถเว้นว่างได้", confirmVisitor:"ยืนยันข้อมูลผู้เข้าชมคนนี้",
    visitorConfirmed:"ยืนยันผู้เข้าชมแล้ว", visitorSaved:"บันทึกผู้เข้าชมเรียบร้อยแล้ว", viewRegistered:"ดูผู้ชมที่ลงทะเบียนแล้ว", addVisitor:"ลงทะเบียนผู้ชมคนถัดไป", addVisitorHint:"เพิ่มผู้เข้าชมอีกหนึ่งคน", finishVisitors:"กรอกข้อมูลผู้ชมครบแล้ว", finishVisitorsHint:"ส่งคืนให้เจ้าหน้าที่เพื่อออกตั๋ว", removeLast:"ลบผู้ชมคนล่าสุด", staffNext:"ขั้นตอนถัดไปสำหรับเจ้าหน้าที่", handoverTitle:"การลงทะเบียนผู้ชมเสร็จสมบูรณ์", visitors:"ผู้เข้าชม", handoverBody:"กรุณาส่งคืนอุปกรณ์ให้เจ้าหน้าที่ เพื่อดำเนินการออกตั๋วเข้าชมงาน", staffContinue:"เจ้าหน้าที่ดำเนินการต่อ",
    partStaff:"ส่วนที่ 2 · สำหรับเจ้าหน้าที่", staffTitle:"สรุปรายการจำหน่ายตั๋ว", staffIntro:"เลือกประเภทตั๋วให้ครบตามจำนวนผู้ชมที่ลงทะเบียน", visitorsInSale:"ผู้ชมในรายการ", staff:"เจ้าหน้าที่ *", selectStaff:"— เลือกเจ้าหน้าที่ —", payment:"ช่องทางการชำระ *", cash:"เงินสด", qrTransfer:"QR / โอนผ่านธนาคาร", complimentary:"บัตรเชิญ", ticketTypes:"ประเภทและจำนวนตั๋ว", ticketTypesSubtitle:"เลือกประเภทและจำนวน", mustAllocate:"ต้องจัดสรร", totalTickets:"จำนวนตั๋วรวม", calculatedTotal:"ยอดคำนวณ", amountPaid:"ยอดรับจริง (THB) *", staffNote:"หมายเหตุ", staffNotePlaceholder:"ส่วนลด บัตรเชิญ หรือกรณีพิเศษ", back:"ย้อนกลับ", finalize:"ยืนยันและบันทึกรายการ",
    registrationComplete:"ลงทะเบียนเสร็จสมบูรณ์", completeTitle:"ดำเนินการเสร็จสมบูรณ์", transactionNumber:"หมายเลขรายการ", localDataNotice:"ข้อมูลทดสอบถูกเก็บเฉพาะในอุปกรณ์นี้ และยังไม่ส่งเข้าฐานข้อมูลจริง", nextGroup:"เริ่มรายการผู้ชมชุดถัดไป", footer:"© 2026 WGP#1 · สำเนาสำหรับพัฒนา",
    peopleUnit:"คน", ticketUnit:"ใบ", confirmedCount:"ลงทะเบียนแล้ว {count} คน", requiredError:"กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", mismatchError:"จำนวนตั๋วต้องเท่ากับจำนวนผู้ชมที่ลงทะเบียน ({count} ใบ)", perTicket:"ต่อใบ", noCharge:"ไม่มีค่าใช้จ่าย", quantityFor:"จำนวนสำหรับ {name}", ticketWeekdayDay:"บัตรวันเดียว — วันธรรมดา", ticketWeekendDay:"บัตรวันเดียว — วันสุดสัปดาห์", ticketWeekdayPass:"แพ็กเกจวันธรรมดา", ticketProWeekend:"โปรวีคเอนด์", ticketAllEvent:"บัตรเข้าชมตลอดงาน", ticketComplimentary:"บัตรเชิญ"
  },
  en: {
    welcomeTitle:"Welcome to WGP#1", welcomeSubtitle:"Please select your registration language", languageLabel:"Language", devVersion:"2026 DEVELOPMENT VERSION", heroSubtitle:"Visitor Registration & Ticket Sale", devNoticeTitle:"2026 test version", devNoticeBody:"Event dates and ticket prices are drafts. Data is stored only on this device and is not sent to the production database.",
    partVisitor:"PART 1 · VISITOR", visitorTitle:"Individual visitor registration", visitorIntro:"Every visitor must complete their own registration before staff can issue tickets.", registered:"Registered", progressVisitor:"1 Visitor details", progressConsent:"2 Consent", progressHandover:"3 Return to staff",
    identityTitle:"Identity details", identitySubtitle:"Personal information", firstName:"First name *", lastName:"Last name *", ageGroup:"Age group *", selectOption:"— Please select —", ageUnder10:"Under 10", age60Plus:"60 or older", gender:"Gender *", male:"Male", female:"Female", nonBinary:"Non-binary", preferNot:"Prefer not to say",
    profileTitle:"Residence and visitor profile", profileSubtitle:"Audience profile", country:"Country of residence *", countrySelect:"— Select a country —", city:"Province / City *", cityPlaceholder:"e.g. Chonburi / Pattaya", previousAttendance:"Previous WGP#1 attendance *", firstTime:"First time", returning:"Returning visitor", discovery:"How did you hear about the event? *", sourceMultiHint:"Select all that apply", influencer:"Influencer / Creator", pattayaPromotion:"Pattaya advertising", hotelTour:"Hotel or tour company", friendFamily:"Friend or family", previousEvent:"Previous WGP#1 event", other:"Other",
    guardianTitle:"Guardian details", guardianSubtitle:"Required for visitors under 20", guardianName:"Guardian full name *", relationship:"Relationship *", parent:"Parent", legalGuardian:"Legal guardian", authorizedAdult:"Authorized adult", guardianPhone:"Guardian phone *", guardianConfirm:"I am authorized to act for this minor and confirm the information above.",
    privacyTitle:"Privacy notice and event media", privacySubtitle:"Privacy & event media", privacyRegistration:"<strong>Registration and ticketing:</strong> WGP#1 processes necessary information to verify visitors, administer tickets, analyze attendance and maintain event safety. Data is retained under organizational policy and data subjects may exercise their legal rights.", privacyMedia:"<strong>Photography, video and audio recording:</strong> I authorize and consent to WGP#1, its photographers, media producers and authorized representatives recording my photograph, video and audio at the event and using or publishing them across media channels for WGP#1 event reporting and promotion.", privacyAck:"I consent to the Privacy Notice and Event Media terms.", marketingConsent:"I agree to receive future WGP#1 news and offers (optional).", marketingEmail:"Email for updates (optional)", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"Enter your email if you would like WGP#1 updates. You may leave this blank.", confirmVisitor:"Confirm this visitor",
    visitorConfirmed:"VISITOR CONFIRMED", visitorSaved:"Visitor saved successfully", viewRegistered:"View registered visitors", addVisitor:"Register the next visitor", addVisitorHint:"Add another visitor", finishVisitors:"All visitors are registered", finishVisitorsHint:"Return to staff for ticket issuance", removeLast:"Remove last visitor", staffNext:"STAFF NEXT", handoverTitle:"Visitor registration is complete", visitors:"visitors", handoverBody:"Please return this device to staff so they can issue your admission ticket(s).", staffContinue:"Staff continue",
    partStaff:"PART 2 · STAFF ONLY", staffTitle:"Ticket sale summary", staffIntro:"Allocate tickets to match the number of registered visitors.", visitorsInSale:"Visitors in sale", staff:"Staff *", selectStaff:"— Select staff —", payment:"Payment method *", cash:"Cash", qrTransfer:"QR / Bank transfer", complimentary:"Complimentary", ticketTypes:"Ticket types and quantities", ticketTypesSubtitle:"Select type and quantity", mustAllocate:"Required", totalTickets:"Total tickets", calculatedTotal:"Calculated total", amountPaid:"Amount paid (THB) *", staffNote:"Staff note", staffNotePlaceholder:"Discount, complimentary ticket or special case", back:"Back", finalize:"Confirm and save",
    registrationComplete:"REGISTRATION COMPLETE", completeTitle:"Transaction complete", transactionNumber:"Transaction number", localDataNotice:"Test data is stored only on this device and is not sent to the production database.", nextGroup:"Start next visitor group", footer:"© 2026 WGP#1 · Development Copy",
    peopleUnit:"people", ticketUnit:"tickets", confirmedCount:"{count} visitor(s) confirmed", requiredError:"Please complete all required fields.", mismatchError:"Ticket quantity must match the registered visitors ({count}).", perTicket:"per ticket", noCharge:"No charge", quantityFor:"Quantity for {name}", ticketWeekdayDay:"Single Day — Weekday", ticketWeekendDay:"Single Day — Weekend", ticketWeekdayPass:"Weekday Package", ticketProWeekend:"Pro Weekend", ticketAllEvent:"All Event Pass", ticketComplimentary:"Complimentary"
  },
  zh: {
    welcomeTitle:"欢迎来到 WGP#1", welcomeSubtitle:"请选择登记时使用的语言", languageLabel:"语言", devVersion:"2026 开发版本", heroSubtitle:"观众登记与售票", devNoticeTitle:"2026 测试版本", devNoticeBody:"比赛日期和票价为草案。数据仅保存在本设备上，尚未发送至正式数据库。",
    partVisitor:"第 1 部分 · 观众", visitorTitle:"观众个人登记", visitorIntro:"每位观众必须逐一完成登记，之后工作人员才能办理售票。", registered:"已登记", progressVisitor:"1 观众资料", progressConsent:"2 同意确认", progressHandover:"3 交还工作人员",
    identityTitle:"身份资料", identitySubtitle:"个人信息", firstName:"名 *", lastName:"姓 *", ageGroup:"年龄组 *", selectOption:"— 请选择 —", ageUnder10:"10 岁以下", age60Plus:"60 岁及以上", gender:"性别 *", male:"男", female:"女", nonBinary:"非二元性别", preferNot:"不愿透露",
    profileTitle:"居住地与观众资料", profileSubtitle:"观众概况", country:"居住国家/地区 *", countrySelect:"— 选择国家/地区 —", city:"省份 / 城市 *", cityPlaceholder:"例如：春武里 / 芭堤雅", previousAttendance:"是否参加过 WGP#1 *", firstTime:"首次参加", returning:"曾经参加", discovery:"您通过哪些渠道得知活动？*", sourceMultiHint:"可多选", influencer:"网红 / 创作者", pattayaPromotion:"芭堤雅广告", hotelTour:"酒店或旅行社", friendFamily:"朋友或家人", previousEvent:"以往 WGP#1 活动", other:"其他",
    guardianTitle:"监护人资料", guardianSubtitle:"未满 20 岁观众必填", guardianName:"监护人姓名 *", relationship:"关系 *", parent:"父母", legalGuardian:"法定监护人", authorizedAdult:"获授权成年人", guardianPhone:"监护人电话 *", guardianConfirm:"本人有权代表该未成年人，并确认以上资料属实。",
    privacyTitle:"隐私声明与现场媒体", privacySubtitle:"隐私与现场媒体", privacyRegistration:"<strong>登记与售票：</strong> WGP#1 处理核实观众身份、管理门票、分析到场人数及保障活动安全所需的信息。数据依组织政策保留，数据主体可依法行使权利。", privacyMedia:"<strong>照片、视频和音频记录：</strong> 本人授权并同意 WGP#1 主办方、摄影人员、媒体制作人员及其授权代表在活动现场拍摄和录制本人的照片、视频及音频，并通过各类媒体用于 WGP#1 赛事报道和活动宣传。", privacyAck:"本人同意隐私声明与现场媒体条款。", marketingConsent:"我同意接收 WGP#1 未来赛事和活动资讯（可选）。", marketingEmail:"接收资讯的电子邮箱（选填）", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"如需接收 WGP#1 资讯，请填写电子邮箱；也可以留空。", confirmVisitor:"确认此观众资料",
    visitorConfirmed:"观众已确认", visitorSaved:"观众资料已保存", viewRegistered:"查看已登记观众", addVisitor:"登记下一位观众", addVisitorHint:"添加另一位观众", finishVisitors:"所有观众已登记", finishVisitorsHint:"交还工作人员出票", removeLast:"删除最后一位观众", staffNext:"下一步：工作人员", handoverTitle:"观众登记已完成", visitors:"位观众", handoverBody:"请将设备交还工作人员，以便为您发放入场票。", staffContinue:"工作人员继续",
    partStaff:"第 2 部分 · 仅限工作人员", staffTitle:"售票汇总", staffIntro:"分配的门票数量必须与已登记观众人数一致。", visitorsInSale:"本单观众", staff:"工作人员 *", selectStaff:"— 选择工作人员 —", payment:"付款方式 *", cash:"现金", qrTransfer:"二维码 / 银行转账", complimentary:"赠票", ticketTypes:"票种与数量", ticketTypesSubtitle:"选择票种和数量", mustAllocate:"需分配", totalTickets:"门票总数", calculatedTotal:"计算金额", amountPaid:"实收金额 (THB) *", staffNote:"工作人员备注", staffNotePlaceholder:"折扣、赠票或特殊情况", back:"返回", finalize:"确认并保存",
    registrationComplete:"登记完成", completeTitle:"交易已完成", transactionNumber:"交易编号", localDataNotice:"测试数据仅保存在本设备上，尚未发送至正式数据库。", nextGroup:"开始下一组观众", footer:"© 2026 WGP#1 · 开发副本",
    peopleUnit:"人", ticketUnit:"张", confirmedCount:"已确认 {count} 位观众", requiredError:"请填写所有必填项目。", mismatchError:"门票数量必须与已登记观众人数一致（{count} 张）。", perTicket:"每张", noCharge:"免费", quantityFor:"{name} 数量", ticketWeekdayDay:"单日票 — 工作日", ticketWeekendDay:"单日票 — 周末", ticketWeekdayPass:"工作日套票", ticketProWeekend:"专业赛周末票", ticketAllEvent:"全程通票", ticketComplimentary:"赠票"
  },
  ja: {
    welcomeTitle:"WGP#1へようこそ", welcomeSubtitle:"登録に使用する言語を選択してください", languageLabel:"言語", devVersion:"2026 開発版", heroSubtitle:"来場者登録・チケット販売", devNoticeTitle:"2026 テスト版", devNoticeBody:"開催日とチケット価格は暫定です。データはこの端末にのみ保存され、本番データベースには送信されません。",
    partVisitor:"パート1 · 来場者", visitorTitle:"来場者個別登録", visitorIntro:"チケット手続きの前に、来場者全員が一人ずつ登録してください。", registered:"登録済み", progressVisitor:"1 来場者情報", progressConsent:"2 同意確認", progressHandover:"3 スタッフへ返却",
    identityTitle:"本人情報", identitySubtitle:"個人情報", firstName:"名 *", lastName:"姓 *", ageGroup:"年齢層 *", selectOption:"— 選択してください —", ageUnder10:"10歳未満", age60Plus:"60歳以上", gender:"性別 *", male:"男性", female:"女性", nonBinary:"ノンバイナリー", preferNot:"回答しない",
    profileTitle:"居住地・来場者プロフィール", profileSubtitle:"来場者プロフィール", country:"居住国・地域 *", countrySelect:"— 国・地域を選択 —", city:"都道府県 / 市区町村 *", cityPlaceholder:"例：チョンブリー / パタヤ", previousAttendance:"WGP#1 来場経験 *", firstTime:"初めて", returning:"来場経験あり", discovery:"イベントを知ったきっかけ *", sourceMultiHint:"複数選択できます", influencer:"インフルエンサー / クリエイター", pattayaPromotion:"パタヤの広告", hotelTour:"ホテルまたは旅行会社", friendFamily:"友人または家族", previousEvent:"過去の WGP#1", other:"その他",
    guardianTitle:"保護者情報", guardianSubtitle:"20歳未満の来場者は必須", guardianName:"保護者氏名 *", relationship:"続柄 *", parent:"親", legalGuardian:"法定保護者", authorizedAdult:"委任された成人", guardianPhone:"保護者電話番号 *", guardianConfirm:"私はこの未成年者を代理する権限があり、上記情報を確認します。",
    privacyTitle:"プライバシー通知・会場メディア", privacySubtitle:"プライバシーと会場メディア", privacyRegistration:"<strong>登録・発券：</strong> WGP#1 は本人確認、チケット管理、来場分析、会場の安全確保に必要な情報を取り扱います。データは組織の方針に従って保管され、本人は法的権利を行使できます。", privacyMedia:"<strong>写真・映像・音声の記録：</strong> 私は、WGP#1、撮影スタッフ、メディア制作担当者および正当に委任された者が、会場内で私の写真、映像および音声を記録し、WGP#1の大会報道および広報を目的として各種媒体で使用・公開することを許可し、同意します。", privacyAck:"プライバシー通知および会場メディアに同意します。", marketingConsent:"今後の WGP#1 ニュースや案内の受信に同意します（任意）。", marketingEmail:"ニュース受信用メール（任意）", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"WGP#1からの案内を希望する場合は入力してください。空欄でも登録できます。", confirmVisitor:"この来場者を確認",
    visitorConfirmed:"来場者確認済み", visitorSaved:"来場者情報を保存しました", viewRegistered:"登録済み来場者を見る", addVisitor:"次の来場者を登録", addVisitorHint:"別の来場者を追加", finishVisitors:"全員の登録が完了", finishVisitorsHint:"発券のためスタッフへ返却", removeLast:"最後の来場者を削除", staffNext:"次はスタッフ", handoverTitle:"来場者登録が完了しました", visitors:"名", handoverBody:"入場チケットを発券するため、端末をスタッフにお返しください。", staffContinue:"スタッフが続ける",
    partStaff:"パート2 · スタッフ専用", staffTitle:"チケット販売まとめ", staffIntro:"登録済み来場者数と同じ枚数のチケットを割り当ててください。", visitorsInSale:"この取引の来場者", staff:"スタッフ *", selectStaff:"— スタッフを選択 —", payment:"支払方法 *", cash:"現金", qrTransfer:"QR / 銀行振込", complimentary:"招待券", ticketTypes:"チケット種別・枚数", ticketTypesSubtitle:"種別と枚数を選択", mustAllocate:"必要枚数", totalTickets:"合計枚数", calculatedTotal:"計算金額", amountPaid:"受領金額 (THB) *", staffNote:"スタッフメモ", staffNotePlaceholder:"割引、招待券、特記事項", back:"戻る", finalize:"確認して保存",
    registrationComplete:"登録完了", completeTitle:"取引が完了しました", transactionNumber:"取引番号", localDataNotice:"テストデータはこの端末にのみ保存され、本番データベースには送信されません。", nextGroup:"次のグループを開始", footer:"© 2026 WGP#1 · 開発用コピー",
    peopleUnit:"名", ticketUnit:"枚", confirmedCount:"{count}名の来場者を確認しました", requiredError:"必須項目をすべて入力してください。", mismatchError:"チケット枚数を登録済み来場者数（{count}枚）に合わせてください。", perTicket:"1枚", noCharge:"無料", quantityFor:"{name}の枚数", ticketWeekdayDay:"1日券 — 平日", ticketWeekendDay:"1日券 — 週末", ticketWeekdayPass:"平日パッケージ", ticketProWeekend:"プロ・ウィークエンド", ticketAllEvent:"全日程パス", ticketComplimentary:"招待券"
  },
  ko: {
    welcomeTitle:"WGP#1에 오신 것을 환영합니다", welcomeSubtitle:"등록에 사용할 언어를 선택해 주세요", languageLabel:"언어", devVersion:"2026 개발 버전", heroSubtitle:"관람객 등록 및 티켓 판매", devNoticeTitle:"2026 테스트 버전", devNoticeBody:"행사 일정과 티켓 가격은 초안입니다. 데이터는 이 기기에만 저장되며 운영 데이터베이스로 전송되지 않습니다.",
    partVisitor:"파트 1 · 관람객", visitorTitle:"관람객 개별 등록", visitorIntro:"티켓 발권 전에 모든 관람객이 한 명씩 직접 등록해야 합니다.", registered:"등록 완료", progressVisitor:"1 관람객 정보", progressConsent:"2 동의 확인", progressHandover:"3 직원에게 반환",
    identityTitle:"신원 정보", identitySubtitle:"개인 정보", firstName:"이름 *", lastName:"성 *", ageGroup:"연령대 *", selectOption:"— 선택해 주세요 —", ageUnder10:"10세 미만", age60Plus:"60세 이상", gender:"성별 *", male:"남성", female:"여성", nonBinary:"논바이너리", preferNot:"응답하지 않음",
    profileTitle:"거주지 및 관람객 정보", profileSubtitle:"관람객 프로필", country:"거주 국가/지역 *", countrySelect:"— 국가/지역 선택 —", city:"주 / 도시 *", cityPlaceholder:"예: 촌부리 / 파타야", previousAttendance:"WGP#1 관람 경험 *", firstTime:"처음 방문", returning:"방문 경험 있음", discovery:"행사를 알게 된 경로 *", sourceMultiHint:"복수 선택 가능", influencer:"인플루언서 / 크리에이터", pattayaPromotion:"파타야 광고", hotelTour:"호텔 또는 여행사", friendFamily:"친구 또는 가족", previousEvent:"이전 WGP#1 행사", other:"기타",
    guardianTitle:"보호자 정보", guardianSubtitle:"20세 미만 관람객 필수", guardianName:"보호자 성명 *", relationship:"관계 *", parent:"부모", legalGuardian:"법적 보호자", authorizedAdult:"위임받은 성인", guardianPhone:"보호자 전화번호 *", guardianConfirm:"본인은 이 미성년자를 대리할 권한이 있으며 위 정보를 확인합니다.",
    privacyTitle:"개인정보 안내 및 현장 미디어", privacySubtitle:"개인정보 및 현장 미디어", privacyRegistration:"<strong>등록 및 발권:</strong> WGP#1은 관람객 확인, 티켓 관리, 관람 분석 및 행사 안전에 필요한 정보를 처리합니다. 데이터는 조직 정책에 따라 보관되며 정보주체는 법적 권리를 행사할 수 있습니다.", privacyMedia:"<strong>사진·영상·음성 기록:</strong> 본인은 WGP#1 주최자, 촬영 담당자, 미디어 제작자 및 위임받은 관계자가 행사 현장에서 본인의 사진, 영상 및 음성을 기록하고 WGP#1 행사 보도와 홍보를 위해 여러 매체에 사용하거나 공개하는 것을 허용하고 이에 동의합니다.", privacyAck:"개인정보 안내 및 현장 미디어에 동의합니다.", marketingConsent:"향후 WGP#1 소식과 행사 안내 수신에 동의합니다(선택).", marketingEmail:"소식 수신 이메일(선택)", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"WGP#1 소식을 받고 싶다면 이메일을 입력하세요. 비워 두어도 됩니다.", confirmVisitor:"이 관람객 확인",
    visitorConfirmed:"관람객 확인 완료", visitorSaved:"관람객 정보가 저장되었습니다", viewRegistered:"등록된 관람객 보기", addVisitor:"다음 관람객 등록", addVisitorHint:"관람객 한 명 더 추가", finishVisitors:"모든 관람객 등록 완료", finishVisitorsHint:"티켓 발권을 위해 직원에게 반환", removeLast:"마지막 관람객 삭제", staffNext:"다음 단계: 직원", handoverTitle:"관람객 등록이 완료되었습니다", visitors:"명", handoverBody:"입장 티켓 발권을 위해 기기를 직원에게 돌려주세요.", staffContinue:"직원 계속",
    partStaff:"파트 2 · 직원 전용", staffTitle:"티켓 판매 요약", staffIntro:"등록된 관람객 수에 맞게 티켓을 배정하세요.", visitorsInSale:"거래 관람객", staff:"직원 *", selectStaff:"— 직원 선택 —", payment:"결제 방법 *", cash:"현금", qrTransfer:"QR / 은행 송금", complimentary:"초대권", ticketTypes:"티켓 종류 및 수량", ticketTypesSubtitle:"종류와 수량 선택", mustAllocate:"필요 수량", totalTickets:"총 티켓", calculatedTotal:"계산 금액", amountPaid:"수령 금액 (THB) *", staffNote:"직원 메모", staffNotePlaceholder:"할인, 초대권 또는 특이사항", back:"뒤로", finalize:"확인 및 저장",
    registrationComplete:"등록 완료", completeTitle:"거래가 완료되었습니다", transactionNumber:"거래 번호", localDataNotice:"테스트 데이터는 이 기기에만 저장되며 운영 데이터베이스로 전송되지 않습니다.", nextGroup:"다음 관람객 그룹 시작", footer:"© 2026 WGP#1 · 개발용 사본",
    peopleUnit:"명", ticketUnit:"장", confirmedCount:"관람객 {count}명 확인 완료", requiredError:"필수 항목을 모두 입력해 주세요.", mismatchError:"티켓 수량은 등록 관람객 수({count}장)와 같아야 합니다.", perTicket:"장당", noCharge:"무료", quantityFor:"{name} 수량", ticketWeekdayDay:"1일권 — 평일", ticketWeekendDay:"1일권 — 주말", ticketWeekdayPass:"평일 패키지", ticketProWeekend:"프로 주말권", ticketAllEvent:"전 일정 패스", ticketComplimentary:"초대권"
  },
  fr: {
    welcomeTitle:"Bienvenue au WGP#1", welcomeSubtitle:"Choisissez la langue de votre inscription", languageLabel:"Langue", devVersion:"VERSION DE DÉVELOPPEMENT 2026", heroSubtitle:"Inscription des visiteurs et vente de billets", devNoticeTitle:"Version de test 2026", devNoticeBody:"Les dates et tarifs sont provisoires. Les données restent sur cet appareil et ne sont pas envoyées à la base de production.",
    partVisitor:"PARTIE 1 · VISITEUR", visitorTitle:"Inscription individuelle", visitorIntro:"Chaque visiteur doit s’inscrire séparément avant l’émission des billets par le personnel.", registered:"Inscrits", progressVisitor:"1 Informations", progressConsent:"2 Consentement", progressHandover:"3 Retour au personnel",
    identityTitle:"Identité", identitySubtitle:"Informations personnelles", firstName:"Prénom *", lastName:"Nom *", ageGroup:"Tranche d’âge *", selectOption:"— Veuillez sélectionner —", ageUnder10:"Moins de 10 ans", age60Plus:"60 ans ou plus", gender:"Genre *", male:"Homme", female:"Femme", nonBinary:"Non binaire", preferNot:"Préfère ne pas répondre",
    profileTitle:"Résidence et profil visiteur", profileSubtitle:"Profil du public", country:"Pays de résidence *", countrySelect:"— Choisir un pays —", city:"Province / Ville *", cityPlaceholder:"ex. Chonburi / Pattaya", previousAttendance:"Déjà venu au WGP#1 *", firstTime:"Première visite", returning:"Déjà venu", discovery:"Comment avez-vous connu l’événement ? *", sourceMultiHint:"Plusieurs réponses possibles", influencer:"Influenceur / Créateur", pattayaPromotion:"Publicité à Pattaya", hotelTour:"Hôtel ou voyagiste", friendFamily:"Ami ou famille", previousEvent:"Événement WGP#1 précédent", other:"Autre",
    guardianTitle:"Informations du responsable", guardianSubtitle:"Obligatoire pour les visiteurs de moins de 20 ans", guardianName:"Nom complet du responsable *", relationship:"Lien *", parent:"Parent", legalGuardian:"Tuteur légal", authorizedAdult:"Adulte autorisé", guardianPhone:"Téléphone du responsable *", guardianConfirm:"Je suis autorisé(e) à représenter ce mineur et je confirme les informations ci-dessus.",
    privacyTitle:"Avis de confidentialité et médias", privacySubtitle:"Confidentialité et médias de l’événement", privacyRegistration:"<strong>Inscription et billetterie :</strong> WGP#1 traite les informations nécessaires à la vérification des visiteurs, à la gestion des billets, à l’analyse de fréquentation et à la sécurité. Les données sont conservées selon la politique de l’organisation et les personnes peuvent exercer leurs droits légaux.", privacyMedia:"<strong>Enregistrement photo, vidéo et audio :</strong> J’autorise et j’accepte que WGP#1, ses photographes, producteurs de médias et représentants autorisés enregistrent mon image, mes vidéos et ma voix pendant l’événement, puis les utilisent ou les diffusent sur différents médias pour informer et promouvoir les événements WGP#1.", privacyAck:"J’accepte l’avis de confidentialité et les conditions relatives aux médias de l’événement.", marketingConsent:"J’accepte de recevoir les futures actualités et offres WGP#1 (facultatif).", marketingEmail:"E-mail pour les actualités (facultatif)", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"Saisissez votre e-mail pour recevoir les actualités WGP#1. Ce champ peut rester vide.", confirmVisitor:"Confirmer ce visiteur",
    visitorConfirmed:"VISITEUR CONFIRMÉ", visitorSaved:"Visiteur enregistré", viewRegistered:"Voir les visiteurs inscrits", addVisitor:"Inscrire le visiteur suivant", addVisitorHint:"Ajouter un autre visiteur", finishVisitors:"Tous les visiteurs sont inscrits", finishVisitorsHint:"Remettre au personnel pour émettre les billets", removeLast:"Supprimer le dernier visiteur", staffNext:"AU PERSONNEL", handoverTitle:"L’inscription des visiteurs est terminée", visitors:"visiteurs", handoverBody:"Veuillez rendre cet appareil au personnel afin qu’il puisse émettre vos billets d’entrée.", staffContinue:"Continuer — personnel",
    partStaff:"PARTIE 2 · PERSONNEL", staffTitle:"Récapitulatif de vente", staffIntro:"Attribuez autant de billets que de visiteurs inscrits.", visitorsInSale:"Visiteurs de la vente", staff:"Personnel *", selectStaff:"— Choisir un membre —", payment:"Mode de paiement *", cash:"Espèces", qrTransfer:"QR / Virement bancaire", complimentary:"Invitation", ticketTypes:"Types et quantités de billets", ticketTypesSubtitle:"Choisir le type et la quantité", mustAllocate:"À attribuer", totalTickets:"Total des billets", calculatedTotal:"Total calculé", amountPaid:"Montant reçu (THB) *", staffNote:"Note du personnel", staffNotePlaceholder:"Réduction, invitation ou cas particulier", back:"Retour", finalize:"Confirmer et enregistrer",
    registrationComplete:"INSCRIPTION TERMINÉE", completeTitle:"Transaction terminée", transactionNumber:"Numéro de transaction", localDataNotice:"Les données de test restent sur cet appareil et ne sont pas envoyées à la base de production.", nextGroup:"Commencer le groupe suivant", footer:"© 2026 WGP#1 · Copie de développement",
    peopleUnit:"personnes", ticketUnit:"billets", confirmedCount:"{count} visiteur(s) confirmé(s)", requiredError:"Veuillez remplir tous les champs obligatoires.", mismatchError:"Le nombre de billets doit correspondre aux visiteurs inscrits ({count}).", perTicket:"par billet", noCharge:"Gratuit", quantityFor:"Quantité pour {name}", ticketWeekdayDay:"Journée — Semaine", ticketWeekendDay:"Journée — Week-end", ticketWeekdayPass:"Forfait semaine", ticketProWeekend:"Week-end Pro", ticketAllEvent:"Pass événement complet", ticketComplimentary:"Invitation"
  },
  es: {
    welcomeTitle:"Bienvenido a WGP#1", welcomeSubtitle:"Selecciona el idioma para tu registro", languageLabel:"Idioma", devVersion:"VERSIÓN DE DESARROLLO 2026", heroSubtitle:"Registro de visitantes y venta de entradas", devNoticeTitle:"Versión de prueba 2026", devNoticeBody:"Las fechas y los precios son provisionales. Los datos se guardan solo en este dispositivo y no se envían a la base de producción.",
    partVisitor:"PARTE 1 · VISITANTE", visitorTitle:"Registro individual de visitantes", visitorIntro:"Cada visitante debe registrarse por separado antes de que el personal emita las entradas.", registered:"Registrados", progressVisitor:"1 Datos", progressConsent:"2 Consentimiento", progressHandover:"3 Devolver al personal",
    identityTitle:"Identidad", identitySubtitle:"Información personal", firstName:"Nombre *", lastName:"Apellidos *", ageGroup:"Grupo de edad *", selectOption:"— Selecciona —", ageUnder10:"Menos de 10 años", age60Plus:"60 años o más", gender:"Género *", male:"Hombre", female:"Mujer", nonBinary:"No binario", preferNot:"Prefiero no decirlo",
    profileTitle:"Residencia y perfil del visitante", profileSubtitle:"Perfil del público", country:"País de residencia *", countrySelect:"— Selecciona un país —", city:"Provincia / Ciudad *", cityPlaceholder:"p. ej., Chonburi / Pattaya", previousAttendance:"Asistencia previa a WGP#1 *", firstTime:"Primera vez", returning:"Ya ha asistido", discovery:"¿Cómo conociste el evento? *", sourceMultiHint:"Puedes seleccionar varias opciones", influencer:"Influencer / Creador", pattayaPromotion:"Publicidad en Pattaya", hotelTour:"Hotel o agencia de viajes", friendFamily:"Amigo o familiar", previousEvent:"Evento WGP#1 anterior", other:"Otro",
    guardianTitle:"Datos del tutor", guardianSubtitle:"Obligatorio para visitantes menores de 20 años", guardianName:"Nombre completo del tutor *", relationship:"Relación *", parent:"Padre o madre", legalGuardian:"Tutor legal", authorizedAdult:"Adulto autorizado", guardianPhone:"Teléfono del tutor *", guardianConfirm:"Estoy autorizado para representar a este menor y confirmo la información anterior.",
    privacyTitle:"Aviso de privacidad y medios", privacySubtitle:"Privacidad y medios del evento", privacyRegistration:"<strong>Registro y entradas:</strong> WGP#1 trata la información necesaria para verificar visitantes, administrar entradas, analizar la asistencia y mantener la seguridad. Los datos se conservan según la política de la organización y las personas pueden ejercer sus derechos legales.", privacyMedia:"<strong>Grabación de fotografías, vídeo y audio:</strong> Autorizo y acepto que WGP#1, sus fotógrafos, productores de medios y representantes autorizados graben mi imagen, vídeo y audio durante el evento y los utilicen o publiquen en distintos medios para informar y promocionar las actividades de WGP#1.", privacyAck:"Acepto el Aviso de privacidad y las condiciones sobre medios del evento.", marketingConsent:"Acepto recibir futuras noticias y ofertas de WGP#1 (opcional).", marketingEmail:"Correo para recibir noticias (opcional)", marketingEmailPlaceholder:"name@example.com", marketingEmailHint:"Introduce tu correo si quieres recibir noticias de WGP#1. Puedes dejarlo en blanco.", confirmVisitor:"Confirmar este visitante",
    visitorConfirmed:"VISITANTE CONFIRMADO", visitorSaved:"Visitante guardado correctamente", viewRegistered:"Ver visitantes registrados", addVisitor:"Registrar al siguiente visitante", addVisitorHint:"Añadir otro visitante", finishVisitors:"Todos los visitantes están registrados", finishVisitorsHint:"Entregar al personal para emitir las entradas", removeLast:"Eliminar último visitante", staffNext:"SIGUE EL PERSONAL", handoverTitle:"El registro de visitantes ha terminado", visitors:"visitantes", handoverBody:"Devuelve este dispositivo al personal para que emita tus entradas de acceso.", staffContinue:"Continuar — personal",
    partStaff:"PARTE 2 · SOLO PERSONAL", staffTitle:"Resumen de venta de entradas", staffIntro:"Asigna tantas entradas como visitantes registrados.", visitorsInSale:"Visitantes de la venta", staff:"Personal *", selectStaff:"— Seleccionar personal —", payment:"Método de pago *", cash:"Efectivo", qrTransfer:"QR / Transferencia bancaria", complimentary:"Invitación", ticketTypes:"Tipos y cantidades de entradas", ticketTypesSubtitle:"Selecciona tipo y cantidad", mustAllocate:"Por asignar", totalTickets:"Total de entradas", calculatedTotal:"Total calculado", amountPaid:"Importe recibido (THB) *", staffNote:"Nota del personal", staffNotePlaceholder:"Descuento, invitación o caso especial", back:"Atrás", finalize:"Confirmar y guardar",
    registrationComplete:"REGISTRO COMPLETADO", completeTitle:"Transacción completada", transactionNumber:"Número de transacción", localDataNotice:"Los datos de prueba se guardan solo en este dispositivo y no se envían a la base de producción.", nextGroup:"Iniciar siguiente grupo", footer:"© 2026 WGP#1 · Copia de desarrollo",
    peopleUnit:"personas", ticketUnit:"entradas", confirmedCount:"{count} visitante(s) confirmado(s)", requiredError:"Completa todos los campos obligatorios.", mismatchError:"La cantidad de entradas debe coincidir con los visitantes registrados ({count}).", perTicket:"por entrada", noCharge:"Sin cargo", quantityFor:"Cantidad de {name}", ticketWeekdayDay:"Un día — Laborable", ticketWeekendDay:"Un día — Fin de semana", ticketWeekdayPass:"Paquete laborables", ticketProWeekend:"Fin de semana Pro", ticketAllEvent:"Pase completo", ticketComplimentary:"Invitación"
  }
};

translations.de = { ...translations.en,
  welcomeTitle:"Willkommen bei WGP#1", welcomeSubtitle:"Bitte wählen Sie Ihre Sprache für die Registrierung", languageLabel:"Sprache", devVersion:"ENTWICKLUNGSVERSION 2026", heroSubtitle:"Besucherregistrierung & Ticketverkauf", devNoticeTitle:"Testversion 2026", devNoticeBody:"Veranstaltungstermine und Ticketpreise sind Entwürfe. Die Daten werden nur auf diesem Gerät gespeichert und nicht an die Produktionsdatenbank gesendet.",
  partVisitor:"TEIL 1 · BESUCHER", visitorTitle:"Individuelle Besucherregistrierung", visitorIntro:"Jeder Besucher muss sich einzeln registrieren, bevor das Personal Tickets ausstellen kann.", registered:"Registriert", identityTitle:"Persönliche Angaben", identitySubtitle:"Personenbezogene Daten", firstName:"Vorname *", lastName:"Nachname *", ageGroup:"Altersgruppe *", selectOption:"— Bitte auswählen —", ageUnder10:"Unter 10 Jahren", age60Plus:"60 Jahre oder älter", gender:"Geschlecht *", male:"Männlich", female:"Weiblich", preferNot:"Keine Angabe",
  profileTitle:"Wohnort und Besucherprofil", profileSubtitle:"Besucherprofil", country:"Wohnsitzland *", countrySelect:"— Land suchen —", city:"Bundesland / Stadt *", cityPlaceholder:"z. B. Chonburi / Pattaya", previousAttendance:"Frühere Teilnahme an WGP#1 *", firstTime:"Zum ersten Mal", returning:"Bereits teilgenommen", discovery:"Wie haben Sie von der Veranstaltung erfahren? *", sourceMultiHint:"Mehrfachauswahl möglich", influencer:"Influencer / Creator", pattayaPromotion:"Werbung in Pattaya", hotelTour:"Hotel oder Reiseveranstalter", friendFamily:"Freunde oder Familie", previousEvent:"Frühere WGP#1-Veranstaltung", other:"Sonstiges",
  guardianTitle:"Angaben zum Erziehungsberechtigten", guardianSubtitle:"Erforderlich für Besucher unter 20 Jahren", guardianName:"Vollständiger Name des Erziehungsberechtigten *", relationship:"Beziehung *", parent:"Elternteil", legalGuardian:"Gesetzlicher Vormund", authorizedAdult:"Bevollmächtigter Erwachsener", guardianPhone:"Telefonnummer des Erziehungsberechtigten *", guardianConfirm:"Ich bin berechtigt, für diese minderjährige Person zu handeln, und bestätige die obigen Angaben.",
  privacyTitle:"Datenschutzhinweis und Veranstaltungsmedien", privacySubtitle:"Datenschutz & Veranstaltungsmedien", privacyRegistration:"<strong>Registrierung und Ticketing:</strong> WGP#1 verarbeitet die erforderlichen Daten zur Überprüfung der Besucher, Verwaltung der Tickets, Analyse der Besucherzahlen und Gewährleistung der Veranstaltungssicherheit. Die Daten werden gemäß den Richtlinien der Organisation gespeichert; betroffene Personen können ihre gesetzlichen Rechte ausüben.", privacyMedia:"<strong>Foto-, Video- und Audioaufnahmen:</strong> Ich gestatte WGP#1, seinen Fotografen, Medienproduzenten und Beauftragten, während der Veranstaltung Foto-, Video- und Audioaufnahmen von mir anzufertigen und diese zur Berichterstattung und Bewerbung von WGP#1 zu verwenden oder zu veröffentlichen.", privacyAck:"Ich stimme dem Datenschutzhinweis und den Bedingungen zu Veranstaltungsmedien zu.", marketingConsent:"Ich möchte künftig Nachrichten und Angebote von WGP#1 erhalten (optional).", marketingEmail:"E-Mail für Neuigkeiten (optional)", marketingEmailHint:"Geben Sie Ihre E-Mail-Adresse ein, wenn Sie Neuigkeiten von WGP#1 erhalten möchten. Das Feld kann leer bleiben.", confirmVisitor:"Diesen Besucher bestätigen",
  visitorConfirmed:"BESUCHER BESTÄTIGT", visitorSaved:"Besucher erfolgreich gespeichert", viewRegistered:"Registrierte Besucher anzeigen", addVisitor:"Nächsten Besucher registrieren", addVisitorHint:"Weiteren Besucher hinzufügen", finishVisitors:"Alle Besucher sind registriert", finishVisitorsHint:"Gerät zur Ticketausgabe an das Personal zurückgeben", removeLast:"Letzten Besucher entfernen", staffNext:"ALS NÄCHSTES: PERSONAL", handoverTitle:"Die Besucherregistrierung ist abgeschlossen", visitors:"Besucher", handoverBody:"Bitte geben Sie dieses Gerät an das Personal zurück, damit die Eintrittskarten ausgestellt werden können.", staffContinue:"Personal fortfahren", footer:"© 2026 WGP#1 · Entwicklungskopie", peopleUnit:"Personen", confirmedCount:"{count} Besucher bestätigt", requiredError:"Bitte füllen Sie alle Pflichtfelder aus."
};

translations.ru = { ...translations.en,
  welcomeTitle:"Добро пожаловать на WGP#1", welcomeSubtitle:"Выберите язык регистрации", languageLabel:"Язык", devVersion:"ТЕСТОВАЯ ВЕРСИЯ 2026", heroSubtitle:"Регистрация посетителей и продажа билетов", devNoticeTitle:"Тестовая версия 2026", devNoticeBody:"Даты мероприятия и цены на билеты являются предварительными. Данные хранятся только на этом устройстве и не отправляются в рабочую базу данных.",
  partVisitor:"ЧАСТЬ 1 · ПОСЕТИТЕЛЬ", visitorTitle:"Индивидуальная регистрация посетителя", visitorIntro:"Каждый посетитель должен зарегистрироваться отдельно до выдачи билетов сотрудником.", registered:"Зарегистрировано", identityTitle:"Личные данные", identitySubtitle:"Персональная информация", firstName:"Имя *", lastName:"Фамилия *", ageGroup:"Возрастная группа *", selectOption:"— Выберите —", ageUnder10:"Младше 10 лет", age60Plus:"60 лет и старше", gender:"Пол *", male:"Мужской", female:"Женский", preferNot:"Не указывать",
  profileTitle:"Место проживания и профиль посетителя", profileSubtitle:"Профиль аудитории", country:"Страна проживания *", countrySelect:"— Найти страну —", city:"Регион / Город *", cityPlaceholder:"например, Чонбури / Паттайя", previousAttendance:"Посещали WGP#1 ранее? *", firstTime:"Впервые", returning:"Уже посещал(а)", discovery:"Как вы узнали о мероприятии? *", sourceMultiHint:"Можно выбрать несколько вариантов", influencer:"Инфлюенсер / Автор контента", pattayaPromotion:"Реклама в Паттайе", hotelTour:"Отель или туристическая компания", friendFamily:"Друзья или семья", previousEvent:"Предыдущее мероприятие WGP#1", other:"Другое",
  guardianTitle:"Данные опекуна", guardianSubtitle:"Обязательно для посетителей младше 20 лет", guardianName:"Полное имя опекуна *", relationship:"Отношение к посетителю *", parent:"Родитель", legalGuardian:"Законный опекун", authorizedAdult:"Уполномоченный взрослый", guardianPhone:"Телефон опекуна *", guardianConfirm:"Я уполномочен(а) действовать от имени несовершеннолетнего и подтверждаю указанную информацию.",
  privacyTitle:"Уведомление о конфиденциальности и медиасъёмке", privacySubtitle:"Конфиденциальность и медиасъёмка", privacyRegistration:"<strong>Регистрация и билеты:</strong> WGP#1 обрабатывает необходимые данные для проверки посетителей, управления билетами, анализа посещаемости и обеспечения безопасности мероприятия. Данные хранятся согласно политике организации; субъекты данных могут пользоваться своими законными правами.", privacyMedia:"<strong>Фото-, видео- и аудиозапись:</strong> Я разрешаю WGP#1, фотографам, медиапроизводителям и уполномоченным представителям снимать меня на фото и видео и записывать мой голос на мероприятии, а также использовать или публиковать эти материалы для освещения и продвижения WGP#1.", privacyAck:"Я принимаю уведомление о конфиденциальности и условия медиасъёмки.", marketingConsent:"Я согласен(на) получать новости и предложения WGP#1 (необязательно).", marketingEmail:"Электронная почта для новостей (необязательно)", marketingEmailHint:"Укажите адрес, если хотите получать новости WGP#1. Поле можно оставить пустым.", confirmVisitor:"Подтвердить посетителя",
  visitorConfirmed:"ПОСЕТИТЕЛЬ ПОДТВЕРЖДЁН", visitorSaved:"Данные посетителя сохранены", viewRegistered:"Посмотреть зарегистрированных", addVisitor:"Зарегистрировать следующего посетителя", addVisitorHint:"Добавить ещё одного посетителя", finishVisitors:"Все посетители зарегистрированы", finishVisitorsHint:"Вернуть устройство сотруднику для выдачи билетов", removeLast:"Удалить последнего посетителя", staffNext:"ДАЛЕЕ — СОТРУДНИК", handoverTitle:"Регистрация посетителей завершена", visitors:"посетителей", handoverBody:"Передайте устройство сотруднику, чтобы он выдал входные билеты.", staffContinue:"Продолжить — сотрудник", footer:"© 2026 WGP#1 · Версия для разработки", peopleUnit:"чел.", confirmedCount:"Подтверждено посетителей: {count}", requiredError:"Заполните все обязательные поля."
};

translations.pt = { ...translations.en,
  welcomeTitle:"Bem-vindo ao WGP#1", welcomeSubtitle:"Selecione o idioma do seu cadastro", languageLabel:"Idioma", devVersion:"VERSÃO DE DESENVOLVIMENTO 2026", heroSubtitle:"Cadastro de visitantes e venda de ingressos", devNoticeTitle:"Versão de teste 2026", devNoticeBody:"As datas do evento e os preços dos ingressos são provisórios. Os dados ficam armazenados somente neste dispositivo e não são enviados ao banco de dados de produção.",
  partVisitor:"PARTE 1 · VISITANTE", visitorTitle:"Cadastro individual de visitante", visitorIntro:"Cada visitante deve concluir seu próprio cadastro antes que a equipe possa emitir os ingressos.", registered:"Cadastrados", identityTitle:"Dados de identificação", identitySubtitle:"Informações pessoais", firstName:"Nome *", lastName:"Sobrenome *", ageGroup:"Faixa etária *", selectOption:"— Selecione —", ageUnder10:"Menos de 10 anos", age60Plus:"60 anos ou mais", gender:"Gênero *", male:"Masculino", female:"Feminino", preferNot:"Prefiro não informar",
  profileTitle:"Residência e perfil do visitante", profileSubtitle:"Perfil do público", country:"País de residência *", countrySelect:"— Pesquise um país —", city:"Estado / Cidade *", cityPlaceholder:"ex.: Chonburi / Pattaya", previousAttendance:"Já participou do WGP#1? *", firstTime:"Primeira vez", returning:"Já participou", discovery:"Como soube do evento? *", sourceMultiHint:"Selecione todas as opções aplicáveis", influencer:"Influenciador / Criador", pattayaPromotion:"Publicidade em Pattaya", hotelTour:"Hotel ou agência de turismo", friendFamily:"Amigo ou familiar", previousEvent:"Evento WGP#1 anterior", other:"Outro",
  guardianTitle:"Dados do responsável", guardianSubtitle:"Obrigatório para visitantes menores de 20 anos", guardianName:"Nome completo do responsável *", relationship:"Relação *", parent:"Pai ou mãe", legalGuardian:"Responsável legal", authorizedAdult:"Adulto autorizado", guardianPhone:"Telefone do responsável *", guardianConfirm:"Estou autorizado a representar este menor e confirmo as informações acima.",
  privacyTitle:"Aviso de privacidade e mídia do evento", privacySubtitle:"Privacidade e mídia do evento", privacyRegistration:"<strong>Cadastro e ingressos:</strong> O WGP#1 processa as informações necessárias para verificar visitantes, administrar ingressos, analisar a participação e manter a segurança do evento. Os dados são mantidos conforme a política da organização e os titulares podem exercer seus direitos legais.", privacyMedia:"<strong>Gravação de fotos, vídeos e áudio:</strong> Autorizo o WGP#1, seus fotógrafos, produtores de mídia e representantes autorizados a registrar minha imagem, vídeo e áudio no evento e a usar ou publicar esse material para cobertura e promoção do WGP#1.", privacyAck:"Concordo com o Aviso de Privacidade e os termos de mídia do evento.", marketingConsent:"Concordo em receber futuras notícias e ofertas do WGP#1 (opcional).", marketingEmail:"E-mail para novidades (opcional)", marketingEmailHint:"Informe seu e-mail se quiser receber novidades do WGP#1. Você pode deixar este campo em branco.", confirmVisitor:"Confirmar este visitante",
  visitorConfirmed:"VISITANTE CONFIRMADO", visitorSaved:"Visitante salvo com sucesso", viewRegistered:"Ver visitantes cadastrados", addVisitor:"Cadastrar o próximo visitante", addVisitorHint:"Adicionar outro visitante", finishVisitors:"Todos os visitantes estão cadastrados", finishVisitorsHint:"Devolver à equipe para emissão dos ingressos", removeLast:"Remover o último visitante", staffNext:"PRÓXIMO: EQUIPE", handoverTitle:"O cadastro dos visitantes foi concluído", visitors:"visitantes", handoverBody:"Devolva este dispositivo à equipe para que os ingressos de entrada sejam emitidos.", staffContinue:"Continuar — equipe", footer:"© 2026 WGP#1 · Cópia de desenvolvimento", peopleUnit:"pessoas", confirmedCount:"{count} visitante(s) confirmado(s)", requiredError:"Preencha todos os campos obrigatórios."
};

translations.ar = { ...translations.en,
  welcomeTitle:"مرحبًا بكم في WGP#1", welcomeSubtitle:"يرجى اختيار لغة التسجيل", languageLabel:"اللغة", devVersion:"نسخة التطوير 2026", heroSubtitle:"تسجيل الزوار وبيع التذاكر", devNoticeTitle:"النسخة التجريبية 2026", devNoticeBody:"تواريخ الفعالية وأسعار التذاكر أولية. تُحفظ البيانات على هذا الجهاز فقط ولا تُرسل إلى قاعدة بيانات الإنتاج.",
  partVisitor:"القسم 1 · الزائر", visitorTitle:"تسجيل الزائر الفردي", visitorIntro:"يجب على كل زائر إكمال تسجيله قبل أن يتمكن الموظفون من إصدار التذاكر.", registered:"المسجلون", identityTitle:"بيانات الهوية", identitySubtitle:"المعلومات الشخصية", firstName:"الاسم الأول *", lastName:"اسم العائلة *", ageGroup:"الفئة العمرية *", selectOption:"— يرجى الاختيار —", ageUnder10:"أقل من 10 سنوات", age60Plus:"60 سنة أو أكثر", gender:"الجنس *", male:"ذكر", female:"أنثى", preferNot:"أفضل عدم الإفصاح",
  profileTitle:"الإقامة وملف الزائر", profileSubtitle:"ملف الجمهور", country:"بلد الإقامة *", countrySelect:"— ابحث عن بلد —", city:"المنطقة / المدينة *", cityPlaceholder:"مثال: تشونبوري / باتايا", previousAttendance:"هل سبق لك حضور WGP#1؟ *", firstTime:"المرة الأولى", returning:"سبق له الحضور", discovery:"كيف عرفت عن الفعالية؟ *", sourceMultiHint:"يمكن اختيار أكثر من خيار", influencer:"مؤثر / منشئ محتوى", pattayaPromotion:"إعلانات باتايا", hotelTour:"فندق أو شركة سياحية", friendFamily:"صديق أو أحد أفراد العائلة", previousEvent:"فعالية WGP#1 سابقة", other:"أخرى",
  guardianTitle:"بيانات ولي الأمر", guardianSubtitle:"مطلوب للزوار دون سن 20 عامًا", guardianName:"الاسم الكامل لولي الأمر *", relationship:"صلة القرابة *", parent:"والد / والدة", legalGuardian:"وصي قانوني", authorizedAdult:"شخص بالغ مفوض", guardianPhone:"هاتف ولي الأمر *", guardianConfirm:"أنا مخول بالتصرف نيابة عن هذا القاصر وأؤكد صحة المعلومات أعلاه.",
  privacyTitle:"إشعار الخصوصية ووسائط الفعالية", privacySubtitle:"الخصوصية ووسائط الفعالية", privacyRegistration:"<strong>التسجيل والتذاكر:</strong> تعالج WGP#1 المعلومات اللازمة للتحقق من الزوار وإدارة التذاكر وتحليل الحضور والحفاظ على سلامة الفعالية. تُحتفظ البيانات وفق سياسة المؤسسة ويمكن لأصحاب البيانات ممارسة حقوقهم القانونية.", privacyMedia:"<strong>التصوير وتسجيل الفيديو والصوت:</strong> أصرّح لـ WGP#1 ومصوريها ومنتجي الوسائط وممثليها المفوضين بتصويري وتسجيل الفيديو والصوت خلال الفعالية، واستخدام هذه المواد أو نشرها لتغطية فعاليات WGP#1 والترويج لها.", privacyAck:"أوافق على إشعار الخصوصية وشروط وسائط الفعالية.", marketingConsent:"أوافق على تلقي أخبار وعروض WGP#1 مستقبلًا (اختياري).", marketingEmail:"البريد الإلكتروني لتلقي الأخبار (اختياري)", marketingEmailHint:"أدخل بريدك الإلكتروني إذا رغبت في تلقي أخبار WGP#1، ويمكن تركه فارغًا.", confirmVisitor:"تأكيد هذا الزائر",
  visitorConfirmed:"تم تأكيد الزائر", visitorSaved:"تم حفظ بيانات الزائر بنجاح", viewRegistered:"عرض الزوار المسجلين", addVisitor:"تسجيل الزائر التالي", addVisitorHint:"إضافة زائر آخر", finishVisitors:"اكتمل تسجيل جميع الزوار", finishVisitorsHint:"أعد الجهاز للموظف لإصدار التذاكر", removeLast:"حذف آخر زائر", staffNext:"الخطوة التالية للموظف", handoverTitle:"اكتمل تسجيل الزوار", visitors:"زوار", handoverBody:"يرجى إعادة هذا الجهاز إلى الموظف ليتمكن من إصدار تذاكر الدخول.", staffContinue:"متابعة الموظف", footer:"© 2026 WGP#1 · نسخة التطوير", peopleUnit:"أشخاص", confirmedCount:"تم تأكيد {count} زائر", requiredError:"يرجى إكمال جميع الحقول المطلوبة."
};

translations.it = { ...translations.en,
  welcomeTitle:"Benvenuto a WGP#1", welcomeSubtitle:"Seleziona la lingua per la registrazione", languageLabel:"Lingua", devVersion:"VERSIONE DI SVILUPPO 2026", heroSubtitle:"Registrazione visitatori e vendita biglietti", devNoticeTitle:"Versione di prova 2026", devNoticeBody:"Le date dell'evento e i prezzi dei biglietti sono provvisori. I dati vengono salvati solo su questo dispositivo e non vengono inviati al database di produzione.",
  partVisitor:"PARTE 1 · VISITATORE", visitorTitle:"Registrazione individuale del visitatore", visitorIntro:"Ogni visitatore deve completare la propria registrazione prima che il personale possa emettere i biglietti.", registered:"Registrati", identityTitle:"Dati identificativi", identitySubtitle:"Informazioni personali", firstName:"Nome *", lastName:"Cognome *", ageGroup:"Fascia d'età *", selectOption:"— Seleziona —", ageUnder10:"Meno di 10 anni", age60Plus:"60 anni o più", gender:"Genere *", male:"Maschile", female:"Femminile", preferNot:"Preferisco non specificare",
  profileTitle:"Residenza e profilo del visitatore", profileSubtitle:"Profilo del pubblico", country:"Paese di residenza *", countrySelect:"— Cerca un Paese —", city:"Provincia / Città *", cityPlaceholder:"es. Chonburi / Pattaya", previousAttendance:"Hai già partecipato a WGP#1? *", firstTime:"Prima volta", returning:"Già partecipato", discovery:"Come hai saputo dell'evento? *", sourceMultiHint:"Seleziona tutte le opzioni applicabili", influencer:"Influencer / Creator", pattayaPromotion:"Pubblicità a Pattaya", hotelTour:"Hotel o tour operator", friendFamily:"Amico o familiare", previousEvent:"Precedente evento WGP#1", other:"Altro",
  guardianTitle:"Dati del tutore", guardianSubtitle:"Obbligatorio per i visitatori sotto i 20 anni", guardianName:"Nome completo del tutore *", relationship:"Relazione *", parent:"Genitore", legalGuardian:"Tutore legale", authorizedAdult:"Adulto autorizzato", guardianPhone:"Telefono del tutore *", guardianConfirm:"Sono autorizzato ad agire per questo minore e confermo le informazioni sopra indicate.",
  privacyTitle:"Informativa sulla privacy e media dell'evento", privacySubtitle:"Privacy e media dell'evento", privacyRegistration:"<strong>Registrazione e biglietteria:</strong> WGP#1 tratta le informazioni necessarie per verificare i visitatori, gestire i biglietti, analizzare le presenze e mantenere la sicurezza dell'evento. I dati sono conservati secondo le politiche dell'organizzazione e gli interessati possono esercitare i propri diritti legali.", privacyMedia:"<strong>Registrazione di foto, video e audio:</strong> Autorizzo WGP#1, i suoi fotografi, produttori multimediali e rappresentanti autorizzati a registrare immagini, video e audio che mi riguardano durante l'evento e a utilizzarli o pubblicarli per la cronaca e la promozione di WGP#1.", privacyAck:"Accetto l'Informativa sulla privacy e i termini relativi ai media dell'evento.", marketingConsent:"Accetto di ricevere future notizie e offerte WGP#1 (facoltativo).", marketingEmail:"E-mail per gli aggiornamenti (facoltativa)", marketingEmailHint:"Inserisci la tua e-mail se desideri ricevere aggiornamenti WGP#1. Puoi lasciare il campo vuoto.", confirmVisitor:"Conferma questo visitatore",
  visitorConfirmed:"VISITATORE CONFERMATO", visitorSaved:"Visitatore salvato correttamente", viewRegistered:"Visualizza i visitatori registrati", addVisitor:"Registra il visitatore successivo", addVisitorHint:"Aggiungi un altro visitatore", finishVisitors:"Tutti i visitatori sono registrati", finishVisitorsHint:"Restituisci il dispositivo al personale per l'emissione dei biglietti", removeLast:"Rimuovi l'ultimo visitatore", staffNext:"PROSSIMO PASSAGGIO: PERSONALE", handoverTitle:"La registrazione dei visitatori è completata", visitors:"visitatori", handoverBody:"Restituisci questo dispositivo al personale affinché possa emettere i biglietti d'ingresso.", staffContinue:"Continua — personale", footer:"© 2026 WGP#1 · Copia di sviluppo", peopleUnit:"persone", confirmedCount:"{count} visitatore/i confermato/i", requiredError:"Completa tutti i campi obbligatori."
};

const otherLanguageLabels = {
  th:"ภาษาอื่น ๆ", en:"Other languages", zh:"其他语言", ja:"その他の言語", ko:"기타 언어", fr:"Autres langues", es:"Otros idiomas",
  de:"Weitere Sprachen", ru:"Другие языки", pt:"Outros idiomas", ar:"لغات أخرى", it:"Altre lingue"
};
Object.entries(otherLanguageLabels).forEach(([language, label]) => { translations[language].otherLanguages = label; });

const countryCodes = "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" ");
const state = { attendees: [], ticketQuantities: {} };
const screens = ["screen-welcome","screen-visitor","screen-handover","screen-staff","screen-complete"];
const $ = id => document.getElementById(id);
let currentLanguage = localStorage.getItem("wgp1-language") || "th";
if (!translations[currentLanguage]) currentLanguage = "th";

function t(key, variables = {}) {
  return translate(currentLanguage, key, variables);
}

function translate(language, key, variables = {}) {
  let value = translations[language]?.[key] ?? translations.en[key] ?? key;
  Object.entries(variables).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, replacement); });
  return value;
}

function localizedNumber(value) { return Number(value).toLocaleString(localeCodes[currentLanguage]); }
function staffNumber(value) { return Number(value).toLocaleString(localeCodes.en); }

function applyTranslations(root, language) {
  root.querySelectorAll("[data-i18n]").forEach(element => { element.textContent = translate(language, element.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach(element => { element.innerHTML = translate(language, element.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-placeholder]").forEach(element => { element.placeholder = translate(language, element.dataset.i18nPlaceholder); });
}

function applyStaffEnglish() {
  applyTranslations($("screen-staff"), "en");
  applyTranslations($("screen-complete"), "en");
  $("screen-staff").dir = "ltr";
  $("screen-complete").dir = "ltr";
}

let localizedCountries = [];
let activeCountryIndex = -1;

function closeCountrySuggestions() {
  $("country-suggestions").classList.add("hidden");
  $("v-country").setAttribute("aria-expanded", "false");
  $("v-country").removeAttribute("aria-activedescendant");
  activeCountryIndex = -1;
}

function selectCountry(country) {
  const input = $("v-country");
  input.value = country.name;
  input.dataset.countryCode = country.code;
  input.setCustomValidity("");
  input.removeAttribute("aria-invalid");
  closeCountrySuggestions();
}

function countrySearchText(value) {
  return String(value || "").trim().toLocaleLowerCase(localeCodes[currentLanguage]);
}

function renderCountrySuggestions(query = "") {
  const suggestions = $("country-suggestions");
  const search = countrySearchText(query);
  const matches = localizedCountries.filter(country => {
    return !search || countrySearchText(country.name).includes(search) || countrySearchText(country.englishName).includes(search) || country.code.toLowerCase().includes(search);
  }).slice(0, 12);

  suggestions.textContent = "";
  matches.forEach((country, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.id = `country-option-${index}`;
    option.className = "country-suggestion";
    option.setAttribute("role", "option");
    const name = document.createElement("span"); name.textContent = country.name;
    const code = document.createElement("small"); code.textContent = country.code;
    option.append(name, code);
    option.addEventListener("mousedown", event => event.preventDefault());
    option.addEventListener("click", () => selectCountry(country));
    suggestions.appendChild(option);
  });

  suggestions.classList.toggle("hidden", matches.length === 0);
  $("v-country").setAttribute("aria-expanded", String(matches.length > 0));
  activeCountryIndex = -1;
}

function populateCountries() {
  const input = $("v-country");
  const selectedCode = input.dataset.countryCode || "";
  const displayNames = new Intl.DisplayNames([localeCodes[currentLanguage]], { type: "region" });
  const englishDisplayNames = new Intl.DisplayNames([localeCodes.en], { type: "region" });
  const collator = new Intl.Collator(localeCodes[currentLanguage]);
  localizedCountries = countryCodes.map(code => ({ code, name: displayNames.of(code) || code, englishName: englishDisplayNames.of(code) || code })).sort((a, b) => collator.compare(a.name, b.name));
  if (selectedCode) {
    const selectedCountry = localizedCountries.find(country => country.code === selectedCode);
    input.value = selectedCountry?.name || "";
    if (!selectedCountry) input.dataset.countryCode = "";
  } else {
    input.value = "";
  }
  input.setCustomValidity("");
  closeCountrySuggestions();
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "th";
  localStorage.setItem("wgp1-language", currentLanguage);
  document.documentElement.lang = localeCodes[currentLanguage];
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.title = `WGP#1 2026 — ${t("heroSubtitle")}`;
  $("language-select").value = currentLanguage;
  document.querySelectorAll(".language-card").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage)));
  applyTranslations(document, currentLanguage);
  applyStaffEnglish();
  populateCountries(); renderTickets(); updateCounts();
}

function showScreen(id) {
  screens.forEach(screenId => $(screenId).classList.toggle("hidden", screenId !== id));
  document.body.classList.toggle("welcome-mode", id === "screen-welcome");
  document.body.classList.toggle("flow-active", id !== "screen-welcome");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function setError(id, message) { const box = $(id); box.textContent = message; box.classList.toggle("hidden", !message); }
function updateCounts() {
  const count = localizedNumber(state.attendees.length);
  $("visitor-count").textContent = `${count} ${t("peopleUnit")}`;
  $("inline-saved-count").textContent = t("confirmedCount", { count });
  $("remove-last-inline").classList.toggle("hidden", state.attendees.length === 0);
  $("view-attendees").classList.toggle("hidden", state.attendees.length === 0);
  $("view-attendees-count").textContent = count;
  $("handover-count").textContent = count;
  const staffCount = staffNumber(state.attendees.length);
  $("staff-attendee-count").textContent = `${staffCount} ${translate("en", "peopleUnit")}`;
  $("tickets-required").textContent = `${staffCount} ${translate("en", "ticketUnit")}`;
  if (!$("attendee-modal").classList.contains("hidden")) renderAttendeeList();
}
function attendeeAgeLabel(value) {
  if (value === "under-10") return t("ageUnder10");
  if (value === "60-plus") return t("age60Plus");
  return value;
}
function renderAttendeeList() {
  const count = localizedNumber(state.attendees.length);
  $("attendee-modal-count").textContent = t("confirmedCount", { count });
  const list = $("attendee-list");
  list.textContent = "";
  state.attendees.forEach((attendee, index) => {
    const item = document.createElement("div"); item.className = "attendee-list-item";
    const number = document.createElement("span"); number.className = "attendee-list-number"; number.textContent = localizedNumber(index + 1);
    const details = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = `${attendee.firstName} ${attendee.lastName}`.trim();
    const meta = document.createElement("small"); meta.textContent = [attendeeAgeLabel(attendee.ageGroup), attendee.city, attendee.countryName].filter(Boolean).join(" · ");
    details.append(name, meta); item.append(number, details); list.appendChild(item);
  });
}
function openAttendeeModal() {
  renderAttendeeList();
  $("attendee-modal").classList.remove("hidden");
  document.body.classList.add("modal-open");
  $("close-attendee-modal").focus();
}
function closeAttendeeModal() {
  $("attendee-modal").classList.add("hidden");
  document.body.classList.remove("modal-open");
}
function isMinorAgeGroup(value) { return value === "under-10" || value === "10-19"; }
function updateGuardianPanel() { const required = isMinorAgeGroup($("v-age").value); $("guardian-panel").classList.toggle("hidden", !required); ["g-name","g-relation","g-phone","g-confirm"].forEach(id => $(id).required = required); }

function readVisitor() {
  const ageGroup = $("v-age").value;
  const minor = isMinorAgeGroup(ageGroup);
  const code = $("v-country").dataset.countryCode || "";
  return {
    attendeeId: crypto.randomUUID ? crypto.randomUUID() : `ATT-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    firstName: $("v-first").value.trim(), lastName: $("v-last").value.trim(), ageGroup, gender: $("v-gender").value,
    countryCode: code, countryName: $("v-country").value.trim(), city: $("v-city").value.trim(),
    previousAttendance: document.querySelector('input[name="v-previous"]:checked')?.value || "",
    marketingSources: [...document.querySelectorAll('input[name="v-source"]:checked')].map(input => input.value),
    contactEmail: $("v-marketing").checked && $("v-email").value.trim() ? $("v-email").value.trim() : null,
    guardian: minor ? { name: $("g-name").value.trim(), relationship: $("g-relation").value, phone: $("g-phone").value.trim(), confirmed: $("g-confirm").checked } : null,
    privacy: { acknowledged: $("v-privacy").checked, mediaConsent: $("v-privacy").checked, marketingConsent: $("v-marketing").checked, noticeVersion: APP_CONFIG.privacyNoticeVersion, recordedAt: new Date().toISOString(), language: currentLanguage }
  };
}

function validateForm(form, errorId, language = currentLanguage) {
  const valid = form.checkValidity();
  form.querySelectorAll("input,select").forEach(field => field.setAttribute("aria-invalid", !field.checkValidity() ? "true" : "false"));
  if (!valid) { setError(errorId, translate(language, "requiredError")); const firstInvalid = form.querySelector(":invalid"); if (firstInvalid) firstInvalid.focus(); } else setError(errorId, "");
  return valid;
}
function validateSourceSelection() {
  const options = [...document.querySelectorAll('input[name="v-source"]')];
  const hasSelection = options.some(input => input.checked);
  if (options[0]) options[0].setCustomValidity(hasSelection ? "" : t("requiredError"));
  return hasSelection;
}
function validateCountrySelection() {
  const input = $("v-country");
  if (!input.dataset.countryCode && input.value.trim()) {
    const search = countrySearchText(input.value);
    const exactMatch = localizedCountries.find(country => countrySearchText(country.name) === search || countrySearchText(country.englishName) === search || country.code.toLowerCase() === search);
    if (exactMatch) selectCountry(exactMatch);
  }
  const valid = Boolean(input.dataset.countryCode);
  input.setCustomValidity(valid ? "" : t("requiredError"));
  return valid;
}
function updateMarketingEmailPanel() {
  const enabled = $("v-marketing").checked;
  $("marketing-email-panel").classList.toggle("hidden", !enabled);
  $("v-email").disabled = !enabled;
  $("v-marketing").setAttribute("aria-expanded", String(enabled));
  if (!enabled) $("v-email").value = "";
}
function hasVisitorDraft() {
  const textOrSelectValues = ["v-first","v-last","v-age","v-gender","v-country","v-city","v-email","g-name","g-relation","g-phone"];
  const hasEnteredValue = textOrSelectValues.some(id => String($(id).value || "").trim());
  const hasCheckedOption = Boolean(document.querySelector('input[name="v-previous"]:checked, input[name="v-source"]:checked'));
  return hasEnteredValue || hasCheckedOption || $("v-privacy").checked || $("v-marketing").checked || $("g-confirm").checked;
}
function resetVisitorForm(hideSavedNotice = true) {
  $("visitor-form").reset();
  $("v-country").value = "";
  $("v-country").dataset.countryCode = "";
  $("v-country").setCustomValidity("");
  closeCountrySuggestions();
  updateGuardianPanel();
  updateMarketingEmailPanel();
  setError("visitor-error", "");
  $("visitor-form").querySelectorAll("[aria-invalid]").forEach(element => element.removeAttribute("aria-invalid"));
  if (hideSavedNotice) $("visitor-saved-notice").classList.add("hidden");
}

function renderTickets() {
  const container = $("ticket-lines"); if (!container) return; container.textContent = "";
  APP_CONFIG.ticketTypes.forEach(ticket => {
    const name = translate("en", ticket.nameKey); const row = document.createElement("div"); row.className = "ticket-line";
    const description = document.createElement("div"); const title = document.createElement("strong"); title.textContent = name;
    const note = document.createElement("p"); note.textContent = ticket.price ? `${staffNumber(ticket.price)} THB ${translate("en", "perTicket")}` : translate("en", "noCharge"); description.append(title, note);
    const qty = document.createElement("input"); qty.type = "number"; qty.min = "0"; qty.step = "1"; qty.value = state.ticketQuantities[ticket.id] || 0; qty.dataset.ticketId = ticket.id; qty.setAttribute("aria-label", translate("en", "quantityFor", { name }));
    qty.addEventListener("input", () => {
      const otherTickets = APP_CONFIG.ticketTypes.reduce((total, item) => item.id === ticket.id ? total : total + Math.max(0, Number(state.ticketQuantities[item.id] || 0)), 0);
      const maximumForThisType = Math.max(0, state.attendees.length - otherTickets);
      const requested = Math.max(0, Math.floor(Number(qty.value || 0)));
      state.ticketQuantities[ticket.id] = Math.min(requested, maximumForThisType);
      qty.value = state.ticketQuantities[ticket.id];
      updateTicketSummary();
    });
    const price = document.createElement("strong"); price.className = "ticket-price"; price.textContent = `${staffNumber(ticket.price)} THB`;
    row.append(description, qty, price); container.appendChild(row);
  }); updateTicketSummary();
}
function calculateTickets() {
  return APP_CONFIG.ticketTypes.reduce((summary, ticket) => { const quantity = Math.max(0, Number(state.ticketQuantities[ticket.id] || 0)); if (quantity) summary.items.push({ ticketType: ticket.id, ticketName: translate("en", ticket.nameKey), unitPrice: ticket.price, quantity, lineTotal: ticket.price * quantity }); summary.quantity += quantity; summary.total += ticket.price * quantity; return summary; }, { items: [], quantity: 0, total: 0 });
}
function updateTicketSummary() {
  const summary = calculateTickets();
  const remaining = Math.max(0, state.attendees.length - summary.quantity);
  document.querySelectorAll("#ticket-lines input[data-ticket-id]").forEach(input => {
    const currentQuantity = Math.max(0, Number(state.ticketQuantities[input.dataset.ticketId] || 0));
    input.max = String(currentQuantity + remaining);
    input.disabled = state.attendees.length === 0;
  });
  $("ticket-total-qty").textContent = `${staffNumber(summary.quantity)} ${translate("en", "ticketUnit")}`;
  $("calculated-total").textContent = `${staffNumber(summary.total)} THB`;
  if (document.activeElement !== $("s-amount")) $("s-amount").value = summary.total;
}
function resetAll() { state.attendees = []; state.ticketQuantities = {}; $("staff-form").reset(); resetVisitorForm(); closeAttendeeModal(); $("other-languages").open = false; applyLanguage("en"); renderTickets(); updateCounts(); showScreen("screen-welcome"); }
function buildTransaction() {
  const ticketSummary = calculateTickets(); const transactionId = `JWC26-${new Date().toISOString().replace(/\D/g, "").slice(2,14)}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
  return { transactionId, eventYear: APP_CONFIG.eventYear, dataMode: APP_CONFIG.dataMode, interfaceLanguage: currentLanguage, submittedAt: new Date().toISOString(), attendeeCount: state.attendees.length, attendees: state.attendees, sale: { staff: $("s-staff").value, paymentMethod: $("s-payment").value, ticketItems: ticketSummary.items, ticketQuantity: ticketSummary.quantity, calculatedTotal: ticketSummary.total, amountPaid: Number($("s-amount").value || 0), note: $("s-note").value.trim() } };
}
function saveDevelopmentTransaction(transaction) { const key = "wgp1-jwc26-development-transactions"; const current = JSON.parse(localStorage.getItem(key) || "[]"); current.push(transaction); localStorage.setItem(key, JSON.stringify(current.slice(-200))); }

$("language-select").addEventListener("change", event => applyLanguage(event.target.value));
document.querySelectorAll(".language-card").forEach(button => button.addEventListener("click", () => {
  applyLanguage(button.dataset.language);
  showScreen("screen-visitor");
}));
$("v-age").addEventListener("change", updateGuardianPanel);
$("v-marketing").addEventListener("change", updateMarketingEmailPanel);
$("v-country").addEventListener("focus", event => renderCountrySuggestions(event.currentTarget.value));
$("v-country").addEventListener("input", event => {
  event.currentTarget.dataset.countryCode = "";
  event.currentTarget.setCustomValidity("");
  renderCountrySuggestions(event.currentTarget.value);
});
$("v-country").addEventListener("keydown", event => {
  let options = [...document.querySelectorAll(".country-suggestion")];
  if (!options.length && event.key === "ArrowDown") {
    renderCountrySuggestions(event.currentTarget.value);
    options = [...document.querySelectorAll(".country-suggestion")];
  }
  if ((event.key === "ArrowDown" || event.key === "ArrowUp") && options.length) {
    event.preventDefault();
    const direction = event.key === "ArrowDown" ? 1 : -1;
    activeCountryIndex = (activeCountryIndex + direction + options.length) % options.length;
    options.forEach((option, index) => option.classList.toggle("active", index === activeCountryIndex));
    const activeOption = options[activeCountryIndex];
    event.currentTarget.setAttribute("aria-activedescendant", activeOption.id);
    activeOption.scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter" && activeCountryIndex >= 0 && options[activeCountryIndex]) {
    event.preventDefault();
    options[activeCountryIndex].click();
  } else if (event.key === "Escape") {
    closeCountrySuggestions();
  }
});
document.addEventListener("click", event => { if (!event.target.closest(".country-combobox")) closeCountrySuggestions(); });
document.querySelectorAll('input[name="v-source"]').forEach(input => input.addEventListener("change", validateSourceSelection));
$("visitor-form").addEventListener("submit", event => {
  event.preventDefault();
  const action = event.submitter?.value || "next";

  if (action === "finish" && state.attendees.length > 0 && !hasVisitorDraft()) {
    setError("visitor-error", "");
    $("visitor-saved-notice").classList.add("hidden");
    updateCounts();
    showScreen("screen-handover");
    return;
  }

  validateCountrySelection();
  validateSourceSelection();
  if (!validateForm(event.currentTarget, "visitor-error")) return;

  state.attendees.push(readVisitor());
  updateCounts();

  if (action === "finish") {
    $("visitor-saved-notice").classList.add("hidden");
    showScreen("screen-handover");
    return;
  }

  resetVisitorForm(false);
  updateCounts();
  $("visitor-saved-notice").classList.remove("hidden");
  $("visitor-form").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("remove-last-inline").addEventListener("click", () => {
  if (!state.attendees.length) return;
  state.attendees.pop();
  updateCounts();
  if (!state.attendees.length) $("visitor-saved-notice").classList.add("hidden");
});
$("view-attendees").addEventListener("click", openAttendeeModal);
$("close-attendee-modal").addEventListener("click", closeAttendeeModal);
document.querySelector(".attendee-modal-backdrop").addEventListener("click", closeAttendeeModal);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !$("attendee-modal").classList.contains("hidden")) closeAttendeeModal(); });
$("to-staff").addEventListener("click", () => { renderTickets(); updateCounts(); showScreen("screen-staff"); });
$("back-handover").addEventListener("click", () => showScreen("screen-handover"));
$("staff-form").addEventListener("submit", event => { event.preventDefault(); if (!validateForm(event.currentTarget, "staff-error", "en")) return; const summary = calculateTickets(); if (summary.quantity !== state.attendees.length) { setError("staff-error", translate("en", "mismatchError", { count: staffNumber(state.attendees.length) })); return; } const transaction = buildTransaction(); saveDevelopmentTransaction(transaction); $("transaction-id").textContent = transaction.transactionId; setError("staff-error", ""); showScreen("screen-complete"); });
$("next-customer").addEventListener("click", resetAll);

applyLanguage(currentLanguage);
resetAll();
