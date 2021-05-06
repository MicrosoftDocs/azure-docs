using System.Collections.Generic;
using System.Linq;

// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison


namespace OutlookEmailToParquet
{
    class MailColumnsBuilder
    {
        public readonly List<MailColumn> Columns;
        public MailColumnsBuilder()
        {
            this.Columns = new List<MailColumn>();
        }

        public MailColumnString AddMailColumnString(string colname)
        {
            var col = new MailColumnString(colname);
            this.Columns.Add(col);
            return col;
        }

        public MailColumnStringArray AddMailColumnStringArray(string colname)
        {
            var col = new MailColumnStringArray(colname);
            this.Columns.Add(col);
            return col;
        }

        public MailColumnInt AddMailColumnInt(string colname)
        {
            var col = new MailColumnInt(colname);
            this.Columns.Add(col);
            return col;
        }

        public MailColumnDateTimeOffsetColumn AddMailColumnDateTimeOffset(string colname)
        {
            var col = new MailColumnDateTimeOffsetColumn(colname);
            this.Columns.Add(col);
            return col;
        }

        public void Validate()
        {
            var counts = new List<int>(this.Columns.Count);
            foreach (var c in this.Columns)
            {
                counts.Add(c.Count());
            }

            int num_distinct_counts = counts.Distinct().Count();

            if (num_distinct_counts !=1)
            {
                string msg = "Differing numbers of column sizes";
                throw new System.ArgumentOutOfRangeException(msg);
            }

        }
    }
}
