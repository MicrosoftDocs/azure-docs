using System;

// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison


namespace OutlookEmailToParquet
{
    public class MailColumnDateTimeOffsetColumn : MailColumnTyped<DateTimeOffset>
    {
        public MailColumnDateTimeOffsetColumn(string name) : base(name)
        {
        }


        public override Parquet.Data.DataColumn ToParquetColumn()
        {
            var col_x = new Parquet.Data.DataColumn(new Parquet.Data.DataField<DateTimeOffset>(this.Name), this.ToSystemArray());
            return col_x;
        }
    }
}
