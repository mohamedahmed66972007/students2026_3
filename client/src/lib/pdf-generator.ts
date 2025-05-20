
import { jsPDF } from "jspdf";
import { Questions } from "@shared/schema";
import { getSubjectName } from "@/components/SubjectIcons";

export function generateQuizPDF(
  title: string,
  subject: string,
  creator: string,
  questions: Questions
): Blob {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // تحميل وإعداد الخط العربي
    doc.addFont("/assets/fonts/NotoNaskhArabic-Regular.ttf", "NotoNaskh", "normal");
    doc.setFont("NotoNaskh");
    doc.setR2L(true);

    // إضافة العنوان
    doc.setFontSize(24);
    doc.text(title, doc.internal.pageSize.width - 20, 20, { align: "right" });

    // إضافة معلومات الاختبار
    doc.setFontSize(14);
    doc.text(`المادة: ${subject}`, doc.internal.pageSize.width - 20, 35, { align: "right" });
    doc.text(`المنشئ: ${creator}`, doc.internal.pageSize.width - 20, 45, { align: "right" });
    doc.text(`عدد الأسئلة: ${questions.length}`, doc.internal.pageSize.width - 20, 55, { align: "right" });

    // خط فاصل
    doc.line(20, 65, doc.internal.pageSize.width - 20, 65);

    let yPosition = 80;

    // إضافة الأسئلة
    questions.forEach((question, index) => {
      // التحقق من الحاجة لصفحة جديدة
      if (yPosition > doc.internal.pageSize.height - 40) {
        doc.addPage();
        yPosition = 20;
      }

      // كتابة السؤال
      doc.setFontSize(16);
      doc.text(`السؤال ${index + 1}: ${question.question}`, doc.internal.pageSize.width - 20, yPosition, { align: "right" });
      yPosition += 15;

      // كتابة الخيارات
      doc.setFontSize(12);
      question.options.forEach((option, optIndex) => {
        const marker = optIndex === question.correctAnswer ? "★" : "○";
        doc.text(`${marker} ${option}`, doc.internal.pageSize.width - 25, yPosition, { align: "right" });
        yPosition += 10;
      });

      yPosition += 10;
    });

    // ترقيم الصفحات
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`الصفحة ${i} من ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
    }

    return doc.output("blob");
  } catch (error) {
    console.error("خطأ في إنشاء PDF:", error);
    throw new Error("حدث خطأ أثناء إنشاء ملف PDF");
  }
}
