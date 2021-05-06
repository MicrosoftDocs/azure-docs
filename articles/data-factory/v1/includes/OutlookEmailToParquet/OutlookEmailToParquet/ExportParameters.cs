// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison

// https://www.newtonsoft.com/json/help/html/SerializingJSON.htm

// https://devblogs.microsoft.com/ifdef-windows/command-line-parser-on-net5/

// https://github.com/commandlineparser/commandline

namespace OutlookEmailToParquet
{
    public class ExportParameters
    {
        public string InboxFolderPath;
        public string OutputFilePath;
        public string OutputPrefix;

        public System.DateTime DateStart ;
        public System.DateTime DateEnd ;

        public bool Verbose;
        public bool OverWrite;
    }
}
