// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison
// https://www.newtonsoft.com/json/help/html/SerializingJSON.htm
// https://github.com/commandlineparser/commandline
// https://dotnetdevaddict.co.za/2020/09/25/getting-started-with-system-commandline/

using CommandLine;
using System;
using System.Linq;
using Outlook = Microsoft.Office.Interop.Outlook;


namespace OutlookEmailToParquet
{
    partial class Program
    {
        // .\OutlookEmailToParquet --inboxfolder "Community/Azure Synapse Discussion" --outputpath "c:\Scratch" --outputprefix "SynapseDiscussion"  --datestart 2020/06/1 --dateend today --overwrite

        public static ExSMTPcache smtp_cache = new ExSMTPcache();


        static void Main(string[] args)
        {
            var exp_params = new ExportParameters();
            var trimmed_args = args.Select(x => x.Trim()).ToArray();
            var parseresult = CommandLine.Parser.Default.ParseArguments<ProgramCmdLineOptions>(trimmed_args);

            parseresult.WithParsed<ProgramCmdLineOptions>(o => {
                exp_params.Verbose = o.Verbose;
                exp_params.InboxFolderPath = o.OutlookInbox;
                exp_params.OutputFilePath = o.OutputPath;
                exp_params.DateStart = System.DateTime.Parse(o.DateStart);
                exp_params.OutputPrefix = o.OutputPrefix ?? "Email";
                
                if (o.DateEnd.ToLower() == "today")
                {
                    exp_params.DateEnd = System.DateTime.Now.Date;
                }
                else
                {
                    exp_params.DateEnd = System.DateTime.Parse(o.DateEnd);
                }

                exp_params.OverWrite = o.Overwrite;
            });


            if (parseresult.Tag == ParserResultType.Parsed)
            {
                ArchiveEmail(exp_params);
            }
        }

        public static void ArchiveEmail(ExportParameters exp_params)
        {
            Console.WriteLine(" DateStart    :{0}", exp_params.DateStart);
            Console.WriteLine(" DateEnd      :{0}", exp_params.DateEnd);
            Console.WriteLine(" Inbox folder :{0}", exp_params.InboxFolderPath);
            Console.WriteLine(" Output path  :{0}", exp_params.OutputFilePath);

            string output_ex_smtp_addr_cache = System.IO.Path.Combine(exp_params.OutputFilePath, "exaddressinfocache" + ".json");
            smtp_cache.LoadSMTPCache(output_ex_smtp_addr_cache);

            var months = Helpers.GetMonthsInRange(exp_params.DateStart, exp_params.DateEnd).ToList();
            var outlook_app = new Outlook.Application();
            var target_folder = Helpers.NavigateToFolder(outlook_app, exp_params.InboxFolderPath);

            foreach (var cur_month in months)
            {
                Console.WriteLine("Month");
                Create_Parquet_for_Month(target_folder, cur_month, exp_params);
            }

            smtp_cache.SaveSMTPCache(output_ex_smtp_addr_cache);
        }

        public static ResolvedOutlookItem ResolvItem(object raw_item)
        {
            var o = new ResolvedOutlookItem();
            o.MailItem = raw_item as Outlook.MailItem;
            o.DocumentItem = raw_item as Outlook.DocumentItem;
            o.NoteItem = raw_item as Outlook.NoteItem;
            o.ContactItem = raw_item as Outlook.ContactItem;
            o.PostItem = raw_item as Outlook.PostItem;
            o.MeetingItem = raw_item as Outlook.MeetingItem;
            o.ReportItem = raw_item as Outlook.ReportItem;
            o.TaskItem = raw_item as Outlook.TaskItem;

            return o;
        }
        private static void Create_Parquet_for_Month(Outlook.MAPIFolder folder, System.DateTime dt_month, ExportParameters exp_params)
        {
            string month_str = Helpers.GetFirstDayInMonth(dt_month).ToString("yyyy-MM");

            Console.WriteLine("Processing {0}", month_str);

            string output_parquet_filename = System.IO.Path.Combine(exp_params.OutputFilePath, exp_params.OutputPrefix + "_" + month_str + ".parquet");

            Console.WriteLine("Parquet file {0}", output_parquet_filename);
            bool output_parquet_exists = System.IO.File.Exists(output_parquet_filename);
            if (output_parquet_exists)
            {
                Console.WriteLine("Parquet file exists {0}", output_parquet_exists);
            }

            if (output_parquet_exists)
            {
                var dt_today = System.DateTime.Now;

                if (dt_month.Year == dt_today.Year && dt_month.Month == dt_today.Month)
                {
                    //don't skip writing the file - because it is the active month
                }
                else
                {
                    if (exp_params.OverWrite)
                    {
                        // do nothing
                    }
                    else
                    {
                        Console.WriteLine("Skipping writing Parquet file");
                        return;

                    }
                }
            }
            var dt_month_start = Helpers.GetFirstDayInMonth(dt_month);
            var dt_next_month_start = Helpers.GetFirstDayInMonth(dt_month.AddMonths(1));
            string dt_month_start_str = dt_month_start.ToString("g");
            string dt_next_month_start_str = dt_next_month_start.ToString("g");
            string filter_senton_str = $"[SentOn] >= '{dt_month_start_str}' AND [SentOn] < '{dt_next_month_start_str}' ";
            var items = folder.Items;
            var items_restricted = items.Restrict(filter_senton_str);
            Console.WriteLine("DASL Filter {0}", filter_senton_str);


            var mailcols = new MailColumnsBuilder();
            var etl_date = System.DateTime.Now.Date;
            var col_etldate = mailcols.AddMailColumnDateTimeOffset("EtlDate");
            var col_etlmonth = mailcols.AddMailColumnDateTimeOffset("EtlMonth");
            var col_etlmonthdisplay = mailcols.AddMailColumnString("EtlMonthDisplay");

            var col_senton = mailcols.AddMailColumnDateTimeOffset("SentOn");
            var col_received = mailcols.AddMailColumnDateTimeOffset("ReceivedTime");

            var col_sendername = mailcols.AddMailColumnString("SenderName");
            var col_senderemailaddress = mailcols.AddMailColumnString("SenderEmailAddress");
            var col_senderemailaddresssmtp = mailcols.AddMailColumnString("SenderEmailAddressSMTP");
            var col_senderemailtype = mailcols.AddMailColumnString("SenderEmailType");
            var col_to = mailcols.AddMailColumnString("To");
            var col_toarray = mailcols.AddMailColumnStringArray("ToArray");

            var col_cc = mailcols.AddMailColumnString("CC");
            var col_ccarray = mailcols.AddMailColumnStringArray("CCArray");

            var col_subject = mailcols.AddMailColumnString("Subject");
            var col_convid = mailcols.AddMailColumnString("ConversationId");
            var col_entryid = mailcols.AddMailColumnString("EntryId");
            var col_messageclass = mailcols.AddMailColumnString("MessageClass");
            var col_body = mailcols.AddMailColumnString("Body");
            var col_htmlbody = mailcols.AddMailColumnString("HTMLBody");
            var col_attachmentscount = mailcols.AddMailColumnInt("AttachmentsCount");
            var col_importance = mailcols.AddMailColumnInt("Importance");

            int n = items_restricted.Count;

            Console.WriteLine("Number of items in this month: {0}", n);

            var month_stopwatch = new System.Diagnostics.Stopwatch();
            month_stopwatch.Start();
            for (int i = 0; i < n; i++)
            {
                int index = i + 1; // Indexes to Office collections are 1-based
                var raw_item = items_restricted[index];

                var resolved_item = ResolvItem(raw_item);
                
                if (resolved_item.MailItem == null)
                {
                    Console.WriteLine("Skipping email that is not a MailItem {0}");
                    continue;
                }
                var mail_item = resolved_item.MailItem;

                col_etldate.Add(etl_date);
                col_etlmonth.Add(dt_month_start);
                col_etlmonthdisplay.Add(dt_month_start.ToString("yyyy-MM"));

                col_senton.Add(mail_item.SentOn);
                col_received.Add(mail_item.ReceivedTime);


                col_sendername.Add(mail_item.SenderName);
                col_senderemailtype.Add(mail_item.SenderEmailType);
                col_senderemailaddress.Add(mail_item.SenderEmailAddress);
                col_senderemailaddresssmtp.Add(GetSenderSMTPAddress(mail_item.Sender, mail_item.SenderEmailAddress));

                col_subject.Add(mail_item.Subject);

                col_convid.Add(mail_item.ConversationID);

                col_to.Add(mail_item.To);
                col_toarray.Add(SplitSemicoonAddressed(mail_item.To));

                col_cc.Add(mail_item.CC);
                col_ccarray.Add(SplitSemicoonAddressed(mail_item.CC));

                col_entryid.Add(mail_item.EntryID);
                col_messageclass.Add(mail_item.MessageClass);
                col_body.Add(mail_item.Body);
                col_htmlbody.Add(mail_item.HTMLBody);
                col_attachmentscount.Add(mail_item.Attachments.Count);
                col_importance.Add((int)mail_item.Importance);

                if (i % 100 == 0)
                {
                    Console.WriteLine("Read {0} emails", col_entryid.Values.Count);
                }
            }
            Console.WriteLine("Final: Read {0} emails", col_entryid.Values.Count);

            Console.WriteLine("Creating Parquet file");

            WriteParquetFile(output_parquet_filename, mailcols);
            Console.WriteLine("Finished writing Parquet file");

            month_stopwatch.Stop();
            Console.WriteLine("Processing month toolk: {0} seconds", month_stopwatch.Elapsed.TotalSeconds);

        }

        public static string[] SplitSemicoonAddressed(string s)
        {
            if (s==null)
            {
                return null;
            }
            return s.Split(new[] { ';' }).Select(x => x.Trim()).ToArray();
        }

        private static void WriteParquetFile(
            string output_parquet_filename,
            MailColumnsBuilder mailcols)
        {
            mailcols.Validate();
            var parquet_columns = mailcols.Columns.Select(c => c.ToParquetColumn()).ToList();
            var parquet_fields = parquet_columns.Select(i => i.Field).ToArray();
            var schema = new Parquet.Data.Schema(parquet_fields);
            using (var fs = System.IO.File.OpenWrite(output_parquet_filename))
            using (var pw = new Parquet.ParquetWriter(schema, fs))
            using (var groupWriter = pw.CreateRowGroup())
            {
                foreach (var c in parquet_columns)
                {
                    groupWriter.WriteColumn(c);
                }
            }
        }

        private static string GetSenderSMTPAddress(Outlook.AddressEntry addrentry, string mailitem_email_address)
        {
            // https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-the-smtp-address-of-the-sender-of-a-mail-item

            if (!mailitem_email_address.StartsWith("/O"))
            {
                // if it doesn't start with /O we assume it is an SMTP address already
                return mailitem_email_address;
            }

            bool cache_enabled = true;
            string x500_address = mailitem_email_address.ToUpper();

            if (cache_enabled &&  smtp_cache.dic.ContainsKey(x500_address))
            {
                var new_addrinfo = smtp_cache.dic[x500_address];
                return new_addrinfo.SMTPAddress;
            }

            if (cache_enabled) 
            { 
                // Console.WriteLine("Cache miss"); 
            }

            var exchange_user = addrentry.GetExchangeUser();
            string smtp_addr = exchange_user != null ? exchange_user.PrimarySmtpAddress : null;

            var addrinfo = new AddressInfo();
            addrinfo.SMTPAddress = smtp_addr;
            addrinfo.padding = "123";


            smtp_cache.dic[x500_address] = addrinfo;
            return smtp_addr;
        }
    }
}
