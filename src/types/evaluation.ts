export interface EvidenceImage {
  id: string;
  url: string;
  caption: string;
  date?: string;
}

export interface IndicatorItem {
  id: string; // e.g. "1.1", "1.2", "2.1"
  code: string; // e.g. "๑.๑"
  title: string; // e.g. "การปฏิบัติงานในหน้าที่"
  description?: string;
  weight: number; // น้ำหนัก (ข)
  targetScore: number; // ระดับเป้าหมาย (ก) 1-5 (ค่าเริ่มต้น เช่น 3 หรือ 4)
  actualResultDescription: string; // รายละเอียดผลงานจริง / เนื้อหาที่ผู้ใช้จะนำมาใส่
  evidenceImages: EvidenceImage[]; // รูปภาพหลักฐานผลงาน
  documentUrl?: string; // ลิงก์เอกสารอ้างอิง
  documentTitle?: string;
}

export interface DimensionGroup {
  id: string;
  code: string; // e.g. "๑", "๒"
  title: string; // e.g. "ด้านปริมาณผลงาน", "การมุ่งผลสัมฤทธิ์"
  weightTotal: number; // น้ำหนักรวมของด้านนี้
  items: IndicatorItem[];
}

export interface EvaluationProfile {
  // หัวเว็บไซต์ & องค์กร
  agencyName: string; // e.g. "สำนักงานคณะกรรมการการอาชีวศึกษา"
  organizationName: string; // e.g. "วิทยาลัยเกษตรและเทคโนโลยีฉะเชิงเทรา"
  logoUrl: string; // URL หรือ Base64 รูปโลโก้/ตราสัญลักษณ์
  bannerBgColor: string; // ธีมสีแบนเนอร์
  bannerImageUrl?: string; // ภาพพื้นหลังส่วนหัว (ถ้ามี)
  
  // ข้อมูลผู้รับการประเมิน (ส่วนที่ ๑)
  fullName: string; // e.g. "นายสมชาย ตัวอย่างดี"
  avatarUrl: string; // URL หรือ Base64 รูปถ่ายหน้าตรง
  position: string; // e.g. "พนักงานบริหารทั่วไป"
  workGroup: string; // e.g. "กลุ่มงานบริหารทั่วไป"
  department: string; // e.g. "ฝ่ายบริหารทรัพยากร / แผนกงาน..."
  affiliation: string; // e.g. "วิทยาลัยเกษตรและเทคโนโลยีฉะเชิงเทรา"
  
  // รอบและสัญญาจ้าง
  evaluationRound: string; // e.g. "ครั้งที่ ๑ (๑ ตุลาคม ๒๕๖๘ ถึง ๓๑ มีนาคม ๒๕๖๙)"
  startDate: string; // e.g. "๑ ตุลาคม ๒๕๖๘"
  endDate: string; // e.g. "๓๑ มีนาคม ๒๕๖๙"
  contractStartDate: string; // e.g. "๑ ตุลาคม ๒๕๖๗"
  contractEndDate: string; // e.g. "๓๐ กันยายน ๒๕๗๑"
  projectName: string; // e.g. "โครงการพัฒนาและสนับสนุนระบบบริหารงานสารสนเทศวิทยาลัย"
  bioSummary?: string; // ข้อมูลสรุปภาพรวมการปฏิบัติงาน
}

export interface EvaluationSummaryInfo {
  evaluatorComments: string; // ความคิดเห็นเพิ่มเติมของผู้ประเมิน
  evaluatorName: string; // ชื่อผู้ประเมิน
  evaluatorPosition: string; // ตำแหน่งผู้ประเมิน
  evaluationDate: string; // วันที่ประเมิน
  
  acknowledgeDate: string; // วันที่ผู้รับการประเมินรับทราบ
  
  superiorName?: string; // ผู้บังคับบัญชาเหนือขึ้นไป
  superiorPosition?: string;
  superiorAgree: boolean;
  superiorComments?: string;
  superiorDate?: string;
  
  highSuperiorName?: string; // ผู้บังคับบัญชาเหนือขึ้นไปอีกชั้นหนึ่ง (ถ้ามี)
  highSuperiorPosition?: string;
  highSuperiorAgree: boolean;
  highSuperiorComments?: string;
  highSuperiorDate?: string;

  // สำหรับรอบที่ 2 (ถ้าประเมินทั้งปี)
  round2TotalScore?: number; // คะแนนรอบที่ 2 เพื่อคำนวณเฉลี่ยทั้งปี
}

export interface EvaluationData {
  profile: EvaluationProfile;
  form11: {
    title: string;
    description: string;
    dimensions: DimensionGroup[];
  };
  form12: {
    title: string;
    description: string;
    competencies: DimensionGroup[];
  };
  summary: EvaluationSummaryInfo;
}

export type ActiveTab = 'topics' | 'overview' | 'form11' | 'form12' | 'form13' | 'gallery' | 'print';
