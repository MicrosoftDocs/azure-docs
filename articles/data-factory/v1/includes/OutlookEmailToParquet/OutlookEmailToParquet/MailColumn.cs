using System;

// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison


namespace OutlookEmailToParquet
{
    public class MailColumn
    {
        public string Name;
        public Type Datatype;

        public virtual System.Array ToSystemArray()
        {
            throw new NotImplementedException();
        }

        public virtual Parquet.Data.DataColumn ToParquetColumn()
        {
            throw new NotImplementedException();
        }

        public virtual int Count()
        {
            throw new NotImplementedException();
        }

    }
}
