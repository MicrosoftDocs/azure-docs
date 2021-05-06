using Outlook = Microsoft.Office.Interop.Outlook;

namespace OutlookEmailToParquet
{
    public class ResolvedOutlookItem
    {
       public Outlook.MailItem MailItem;
       public Outlook.DocumentItem DocumentItem;
       public Outlook.NoteItem NoteItem;
       public Outlook.ContactItem ContactItem;
       public Outlook.PostItem PostItem;
       public Outlook.MeetingItem MeetingItem;
       public Outlook.ReportItem ReportItem;
       public Outlook.TaskItem TaskItem;
    }
}
