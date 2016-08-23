### Specifying TextFormat

If the format is set to **TextFormat**, you can specify the following **optional** properties in the **Format** section.

| Property | Description | Required |
| -------- | ----------- | -------- |
| columnDelimiter | The character used as a column separator in a file. Only one character is allowed at this time. This tag is optional. The default value is comma (,). | No |
| rowDelimiter | The character used as a raw separator in file. Only one character is allowed at this time. This tag is optional. The default value is any of the following: [“\r\n”, “\r”,” \n”]. | No |
| escapeChar | The special character used to escape column delimiter shown in content. This tag is optional. No default value. You must specify no more than one character for this property.<br/><br/>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: “Hello, world”), you can define ‘$’ as the escape character and use string “Hello$, world” in the source.<br/><br/>Note that you cannot specify both escapeChar and quoteChar for a table. | No | 
| quoteChar | The special character is used to quote the string value. The column and row delimiters inside of the quote characters would be treated as part of the string value. This tag is optional. No default value. You must specify no more than one character for this property.<br/><br/>For example, if you have comma (,) as the column delimiter but you want have comma character in the text (example: <Hello, world>), you can define ‘"’ as the quote character and use string <"Hello, world"> in the source. This property is applicable to both input and output tables.<br/><br/>Note that you cannot specify both escapeChar and quoteChar for a table. | No |
| nullValue | The character(s) used to represent null value in blob file content. This tag is optional. The default value is “\N” and “NULL”.<br/><br/>For example, based on below sample, “NaN” in blob will be translated as null value while copied into e.g. SQL Server. | No |
| encodingName | Specify the encoding name. For the list of valid encoding names, see: [Encoding.EncodingName Property](https://msdn.microsoft.com/library/system.text.encoding.aspx). For example: windows-1250 or shift_jis. The default value is: UTF-8. | No | 

#### TextFormat example
The following sample shows some of the format properties for TextFormat.

	"typeProperties":
	{
	    "folderPath": "mycontainer/myfolder",
	    "fileName": "myblobname"
	    "format":
	    {
	        "type": "TextFormat",
	        "columnDelimiter": ",",
	        "rowDelimiter": ";",
	        "quoteChar": "\"",
	        "NullValue": "NaN"
	    }
	},

To use an escapeChar instead of quoteChar, replace the line with quoteChar with the following:

	"escapeChar": "$",

### Specifying AvroFormat
If the format is set to AvroFormat, you do not need to specify any properties in the Format section within the typeProperties section. Example:

	"format":
	{
	    "type": "AvroFormat",
	}

To use Avro format in a Hive table, you can refer to [Apache Hive’s tutorial](https://cwiki.apache.org/confluence/display/Hive/AvroSerDe).

### Specifying JsonFormat

If the format is set to **JsonFormat**, you can specify the following **optional** properties in the **Format** section.

| Property | Description | Required |
| -------- | ----------- | -------- |
| filePattern | Indicate the pattern of data stored in each JSON file. Allowed values are: **setOfObjects** and **arrayOfObjects**. The **default** value is: **setOfObjects**. See sections below for details about these patterns.| No |
| encodingName | Specify the encoding name. For the list of valid encoding names, see: [Encoding.EncodingName](https://msdn.microsoft.com/library/system.text.encoding.aspx) Property. For example: windows-1250 or shift_jis. The **default** value is: **UTF-8**. | No | 
| nestingSeparator | Character that is used to separate nesting levels. The **default** value is **. (dot)**. | No | 


#### setOfObjects file pattern

Each file contains single object, or line-delimited/concatenated multiple objects. When this option is chosen in an output dataset, copy will produce a single JSON file with each object per line (line-delimited).

**single object** 

	{
		"time": "2015-04-29T07:12:20.9100000Z",
		"callingimsi": "466920403025604",
		"callingnum1": "678948008",
		"callingnum2": "567834760",
		"switch1": "China",
		"switch2": "Germany"
	}

**line-delimited JSON** 

	{"time":"2015-04-29T07:12:20.9100000Z","callingimsi":"466920403025604","callingnum1":"678948008","callingnum2":"567834760","switch1":"China","switch2":"Germany"}
	{"time":"2015-04-29T07:13:21.0220000Z","callingimsi":"466922202613463","callingnum1":"123436380","callingnum2":"789037573","switch1":"US","switch2":"UK"}
	{"time":"2015-04-29T07:13:21.4370000Z","callingimsi":"466923101048691","callingnum1":"678901578","callingnum2":"345626404","switch1":"Germany","switch2":"UK"}
	{"time":"2015-04-29T07:13:22.0960000Z","callingimsi":"466922202613463","callingnum1":"789037573","callingnum2":"789044691","switch1":"UK","switch2":"Australia"}
	{"time":"2015-04-29T07:13:22.0960000Z","callingimsi":"466922202613463","callingnum1":"123436380","callingnum2":"789044691","switch1":"US","switch2":"Australia"}

**concatenated JSON**

	{
		"time": "2015-04-29T07:12:20.9100000Z",
		"callingimsi": "466920403025604",
		"callingnum1": "678948008",
		"callingnum2": "567834760",
		"switch1": "China",
		"switch2": "Germany"
	}
	{
		"time": "2015-04-29T07:13:21.0220000Z",
		"callingimsi": "466922202613463",
		"callingnum1": "123436380",
		"callingnum2": "789037573",
		"switch1": "US",
		"switch2": "UK"
	}
	{
		"time": "2015-04-29T07:13:21.4370000Z",
		"callingimsi": "466923101048691",
		"callingnum1": "678901578",
		"callingnum2": "345626404",
		"switch1": "Germany",
		"switch2": "UK"
	}


#### arrayOfObjects file pattern. 

Each file contains an array of objects. 

	[
	    {
	        "time": "2015-04-29T07:12:20.9100000Z",
	        "callingimsi": "466920403025604",
	        "callingnum1": "678948008",
	        "callingnum2": "567834760",
	        "switch1": "China",
	        "switch2": "Germany"
	    },
	    {
	        "time": "2015-04-29T07:13:21.0220000Z",
	        "callingimsi": "466922202613463",
	        "callingnum1": "123436380",
	        "callingnum2": "789037573",
	        "switch1": "US",
	        "switch2": "UK"
	    },
	    {
	        "time": "2015-04-29T07:13:21.4370000Z",
	        "callingimsi": "466923101048691",
	        "callingnum1": "678901578",
	        "callingnum2": "345626404",
	        "switch1": "Germany",
	        "switch2": "UK"
	    },
	    {
	        "time": "2015-04-29T07:13:22.0960000Z",
	        "callingimsi": "466922202613463",
	        "callingnum1": "789037573",
	        "callingnum2": "789044691",
	        "switch1": "UK",
	        "switch2": "Australia"
	    },
	    {
	        "time": "2015-04-29T07:13:22.0960000Z",
	        "callingimsi": "466922202613463",
	        "callingnum1": "123436380",
	        "callingnum2": "789044691",
	        "switch1": "US",
	        "switch2": "Australia"
	    },
	    {
	        "time": "2015-04-29T07:13:24.2120000Z",
	        "callingimsi": "466922201102759",
	        "callingnum1": "345698602",
	        "callingnum2": "789097900",
	        "switch1": "UK",
	        "switch2": "Australia"
	    },
	    {
	        "time": "2015-04-29T07:13:25.6320000Z",
	        "callingimsi": "466923300236137",
	        "callingnum1": "567850552",
	        "callingnum2": "789086133",
	        "switch1": "China",
	        "switch2": "Germany"
	    }
	]

### JsonFormat example

If you have a JSON file with the following content:  

	{
		"Id": 1,
		"Name": {
			"First": "John",
			"Last": "Doe"
		},
		"Tags": ["Data Factory”, "Azure"]
	}

and you want to copy it into a an Azure SQL table in the following format: 

Id	| Name.First | Name.Middle | Name.Last | Tags
--- | ---------- | ----------- | --------- | ----
1 | John | null | Doe | ["Data Factory”, "Azure"]

The input dataset with JsonFormat type is defined as follows: (partial definition with only the relevant parts)

	"properties": {
		"structure": [
			{"name": "Id", "type": "Int"},
			{"name": "Name.First", "type": "String"},
			{"name": "Name.Middle", "type": "String"},
			{"name": "Name.Last", "type": "String"},
			{"name": "Tags", "type": "string"}
		],
		"typeProperties":
		{
			"folderPath": "mycontainer/myfolder",
			"format":
			{
				"type": "JsonFormat",
				"filePattern": "setOfObjects",
				"encodingName": "UTF-8",
				"nestingSeparator": "."
			}
		}
	}

If the structure is not defined, the Copy Activity flattens the structure by default and copy every thing. 

#### Supported JSON structure
Note the following: 

- Each object with a collection of name/value pairs will be mapped to one row of data in a tabular format. Objects can be nested and you can define how to flatten the structure in a dataset with the  nesting separator (.) by default. See the [JsonFormat example](#jsonformat-example) section above for an example.  
- If the structure is not defined in the Data Factory dataset, the Copy Activity detects the schema from the first object and flatten the whole object. 
- If the JSON input has an array, the Copy Activity converts the entire array value into a string. You can choose to skip it by using [column mapping or filtering](#column-mapping-with-translator-rules).
- If there are duplicate name at the same level, the Copy Activity will pick the last one.
- Property names are case sensitive. Two properties with same name but different casing will be treated as two separate properties. 

### Specifying OrcFormat
If the format is set to OrcFormat, you do not need to specify any properties in the Format section within the typeProperties section. Example:

	"format":
	{
	    "type": "OrcFormat",
	}

> [AZURE.IMPORTANT] If you are copying data between on-premises and cloud data stores with ORC format involved, and not copying ORC files as-is from source to sink, you need to install the JRE 8 (Java Runtime Environment) on your gateway machine which will be used to transform your data into proper format. Note 64-bit gateway requires 64-bit JRE and 32-bit gateway requires 32-bit JRE. You can find both versions from [here](http://go.microsoft.com/fwlink/?LinkId=808605), please choose properly.

Note the following:

-	Complex data types are not supported (STRUCT, MAP, LIST, UNION)
-	ORC file has 3 [compression-related options](http://hortonworks.com/blog/orcfile-in-hdp-2-better-compression-better-performance/): NONE, ZLIB, SNAPPY. Data Factory supports reading data from ORC file in any of the above compressed formats. It uses the compression codec is in the metadata to read the data. However, when writing to an ORC file, Data Factory chooses ZLIB which is the default for ORC. There is no option to override this behavior at this time. 
