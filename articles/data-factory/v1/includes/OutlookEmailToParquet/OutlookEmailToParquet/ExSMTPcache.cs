using System;
using System.Collections.Generic;

// https://docs.microsoft.com/en-us/office/client-developer/outlook/pia/how-to-get-a-default-folder-and-enumerate-its-subfolders
// https://docs.microsoft.com/en-us/visualstudio/vsto/working-with-folders?view=vs-2019
// https://github.com/aloneguid/parquet-dotnet
// https://github.com/dougmsft/microsoft-avro


//https://docs.microsoft.com/en-us/office/vba/outlook/How-to/Search-and-Filter/filtering-items-using-a-date-time-comparison

// https://www.newtonsoft.com/json/help/html/SerializingJSON.htm

namespace OutlookEmailToParquet
{
    public class ExSMTPcache
    {
        public Dictionary<string, AddressInfo> dic;

        public ExSMTPcache()
        {
        }
        public void SaveSMTPCache(string filename)
        {
            var serializer = new Newtonsoft.Json.JsonSerializer();
            using (var sw = new System.IO.StreamWriter(filename))
            using (var writer = new Newtonsoft.Json.JsonTextWriter(sw))
            {
                serializer.Serialize(writer, this.dic);
            }


        }

        public void LoadSMTPCache(string filename)
        {
            if (System.IO.File.Exists(filename))
            {
                Console.WriteLine("Loading Address cache");
                string jsonString2 = System.IO.File.ReadAllText(filename);

                    this.dic = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, AddressInfo>>(jsonString2);
                Console.WriteLine("Address cache contains {0} items", this.dic.Count);
            }
            else
            {
                this.dic = new Dictionary<string, AddressInfo>();
            }
        }

    }
}
