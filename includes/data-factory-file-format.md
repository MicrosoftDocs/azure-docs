## Specifying formats
Azure Data Factory supports the following format types:

* [Text Format](#specifying-textformat)
* [JSON Format](#specifying-jsonformat)
* [Avro Format](#specifying-avroformat)
* [ORC Format](#specifying-orcformat)
* [Parquet Format](#specifying-parquetformat)

### Specifying TextFormat
If you want to parse the text files or write the data in text format, set the `format` `type` property to **TextFormat**. You can also specify the following **optional** properties in the `format` section. See [TextFormat example](#textformat-example) section on how to configure.

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| columnDelimiter |The character used to separate columns in a file. You can consider to use a rare unprintable char which not likely exist in your data: e.g. specify "\u0001" which represents Start of Heading (SOH). |Only one character is allowed. The default value is comma (','). <br/><br/>To use an Unicode character, refer to [Unicode Characters](https://en.wikipedia.org/wiki/List_of_Unicode_characters) to get the corresponding code for it.  |No |
| rowDelimiter |The character used to separate rows in a file. |Only one character is allowed. The default value is any of the following values on read: ["\r\n", "\r", "\n"] and "\r\n" on write. |No |
| escapeChar |The special character used to escape a column delimiter in the content of input file. <br/><br/>You cannot specify both escapeChar and quoteChar for a table. |Only one character is allowed. No default value. <br/><br/>Example: if you have comma (',') as the column delimiter but you want to have the comma character in the text (example: "Hello, world"), you can define ‘$’ as the escape character and use string "Hello$, world" in the source. |No |
| quoteChar |The character used to quote a string value. The column and row delimiters inside the quote characters would be treated as part of the string value. This property is applicable to both input and output datasets.<br/><br/>You cannot specify both escapeChar and quoteChar for a table. |Only one character is allowed. No default value. <br/><br/>For example, if you have comma (',') as the column delimiter but you want to have comma character in the text (example: <Hello, world>), you can define " (double quote) as the quote character and use the string "Hello, world" in the source. |No |
| nullValue |One or more characters used to represent a null value. |One or more characters. The default values are "\N" and "NULL" on read and "\N" on write. |No |
| encodingName |Specify the encoding name. |A valid encoding name. see [Encoding.EncodingName Property](https://msdn.microsoft.com/library/system.text.encoding.aspx). Example: windows-1250 or shift_jis. The default value is UTF-8. |No |
| firstRowAsHeader |Specifies whether to consider the first row as a header. For an input dataset, Data Factory reads first row as a header. For an output dataset, Data Factory writes first row as a header. <br/><br/>See [Scenarios for using `firstRowAsHeader` and `skipLineCount`](#scenarios-for-using-firstrowasheader-and-skiplinecount) for sample scenarios. |True<br/>False (default) |No |
| skipLineCount |Indicates the number of rows to skip when reading data from input files. If both skipLineCount and firstRowAsHeader are specified, the lines are skipped first and then the header information is read from the input file. <br/><br/>See [Scenarios for using `firstRowAsHeader` and `skipLineCount`](#scenarios-for-using-firstrowasheader-and-skiplinecount) for sample scenarios. |Integer |No |
| treatEmptyAsNull |Specifies whether to treat null or empty string as a null value when reading data from an input file. |True (default)<br/>False |No |

#### TextFormat example
The following sample shows some of the format properties for TextFormat.

```json
"typeProperties":
{
    "folderPath": "mycontainer/myfolder",
    "fileName": "myblobname",
    "format":
    {
        "type": "TextFormat",
        "columnDelimiter": ",",
        "rowDelimiter": ";",
        "quoteChar": "\"",
        "NullValue": "NaN",
        "firstRowAsHeader": true,
        "skipLineCount": 0,
        "treatEmptyAsNull": true
    }
},
```

To use an `escapeChar` instead of `quoteChar`, replace the line with `quoteChar` with the following escapeChar:

```json
"escapeChar": "$",
```

#### Scenarios for using firstRowAsHeader and skipLineCount
* You are copying from a non-file source to a text file and would like to add a header line containing the schema metadata (for example: SQL schema). Specify `firstRowAsHeader` as true in the output dataset for this scenario.
* You are copying from a text file containing a header line to a non-file sink and would like to drop that line. Specify `firstRowAsHeader` as true in the input dataset.
* You are copying from a text file and want to skip a few lines at the beginning that contain no data or header information. Specify `skipLineCount` to indicate the number of lines to be skipped. If the rest of the file contains a header line, you can also specify `firstRowAsHeader`. If both `skipLineCount` and `firstRowAsHeader` are specified, the lines are skipped first and then the header information is read from the input file

### Specifying JsonFormat
To **import/export JSON files as-is into/from DocumentDB**, see [Import/export JSON documents](../articles/data-factory/data-factory-azure-documentdb-connector.md#importexport-json-documents) section in DocumentDB connector with details.

If you want to parse the JSON files or write the data in JSON format, set the `format` `type` property to **JsonFormat**. You can also specify the following **optional** properties in the `format` section. See [JsonFormat example](#jsonformat-example) section on how to configure.

| Property | Description | Required |
| --- | --- | --- |
| filePattern |Indicate the pattern of data stored in each JSON file. Allowed values are: **setOfObjects** and **arrayOfObjects**. The **default** value is **setOfObjects**. See [JSON file patterns](#json-file-patterns) section for details about these patterns. |No |
| jsonNodeReference | If you want to iterate and extract data from the objects inside an array field, specify the JSON path of that array. By default, if the JSON input has an array, the Copy Activity converts the entire array value into a string. | No |
| jsonPathDefinition | Specify the JSON path expression for each column mapping with a customized column name. For fields belong to root object, start with root $; for fields inside the array chosen by `jsonNodeReference` property, start from the array element. See [JsonFormat example](#jsonformat-example) section on how to configure. | No |
| encodingName |Specify the encoding name. For the list of valid encoding names, see: [Encoding.EncodingName](https://msdn.microsoft.com/library/system.text.encoding.aspx) Property. For example: windows-1250 or shift_jis. The **default** value is: **UTF-8**. |No |
| nestingSeparator |Character that is used to separate nesting levels. The default value is '.' (dot). |No |

#### JSON file patterns

Copy activity can parse below patterns of JSON files:

- **Type I: setOfObjects**

    Each file contains single object, or line-delimited/concatenated multiple objects. When this option is chosen in an output dataset, copy activity produces a single JSON file with each object per line (line-delimited).

    * **single object JSON example**

        ```json
        {
            "time": "2015-04-29T07:12:20.9100000Z",
            "callingimsi": "466920403025604",
            "callingnum1": "678948008",
            "callingnum2": "567834760",
            "switch1": "China",
            "switch2": "Germany"
        }
        ```

    * **line-delimited JSON example**

        ```json
        {"time":"2015-04-29T07:12:20.9100000Z","callingimsi":"466920403025604","callingnum1":"678948008","callingnum2":"567834760","switch1":"China","switch2":"Germany"}
        {"time":"2015-04-29T07:13:21.0220000Z","callingimsi":"466922202613463","callingnum1":"123436380","callingnum2":"789037573","switch1":"US","switch2":"UK"}
        {"time":"2015-04-29T07:13:21.4370000Z","callingimsi":"466923101048691","callingnum1":"678901578","callingnum2":"345626404","switch1":"Germany","switch2":"UK"}
        ```

    * **concatenated JSON example**

        ```json
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
        ```

- **Type II: arrayOfObjects**

    Each file contains an array of objects.

    ```json
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
        }
    ]
    ```

### JsonFormat example
If you have a JSON file with the following content:  

```json
{
    "ordernumber": "01",
    "orderdate": "20131122",
    "orderlines": [
        {
            "prod": "p1",
            "price": "23"
        },
        {
            "prod": "p2",
            "price": "13"
        },
        {
            "prod": "p3",
            "price": "231"
        }
    ],
    "city": [ { "sanmateo": "No 1" } ]
}
```
and you want to copy it into an Azure SQL table in the following format, by flattening the data inside the array and cross join with the common root info:

| ordernumber | orderdate | order_pd | order_price | city |
| --- | --- | --- | --- | --- |
| 01 | 20131122 | P1 | 23 | No 1 |
| 01 | 20131122 | P2 | 13 | No 1 |
| 01 | 20131122 | P3 | 231 | No 1 |

The input dataset with **JsonFormat** type is defined as follows: (partial definition with only the relevant parts). More specifically:

- `structure` section defines the customized column names and the corresponding data type while converting to tabular data. See [Specifying structure definition for rectangular datasets](#specifying-structure-definition-for-rectangular-datasets) section for more details.
- `jsonNodeReference` indicates to iterate and extract the objects under **array** orderlines.
- `jsonPathDefinition` specifies the JSON path for each column indicating where to extract the data from. In this example, "ordernumber", "orderdate" and "city" are under root object with JSON path starting with "$.", while "order_pd" and "order_price" are defined with path derived from the array element without "$.".

```json
"properties": {
    "structure": [
        {
            "name": "ordernumber",
            "type": "String"
        },
        {
            "name": "orderdate",
            "type": "String"
        },
        {
            "name": "order_pd",
            "type": "Int64"
        },
        {
            "name": "order_price",
            "type": "Int64"
        },
        {
            "name": "city",
            "type": "String"
        }
    ],
    "typeProperties": {
        "folderPath": "mycontainer/myfolder",
        "format": {
            "type": "JsonFormat",
            "jsonNodeReference": "$.orderlines",
            "jsonPathDefinition": {"ordernumber": "$.ordernumber", "orderdate": "$.orderdate", "order_pd": "prod", "order_price": "price", "city": " $.city[0].sanmateo"}         
        }
    }
}
```

#### Supported JSON structure
Note the following points:

* If the `structure` and `jsonPathDefinition` are not defined in the Data Factory dataset, the Copy Activity detects the schema from the first object and flatten the whole object.
* If the JSON input has an array, by default the Copy Activity converts the entire array value into a string. You can choose to extract data from it using `jsonNodeReference` and/or `jsonPathDefinition`, or skip it by using [column mapping or filtering](#column-mapping-with-translator-rules).
* If there are duplicate names at the same level, the Copy Activity picks the last one.
* Property names are case-sensitive. Two properties with same name but different casings are treated as two separate properties.

### Specifying AvroFormat
If you want to parse the Avro files or write the data in Avro format, set the `format` `type` property to **AvroFormat**. You do not need to specify any properties in the Format section within the typeProperties section. Example:

```json
"format":
{
    "type": "AvroFormat",
}
```

To use Avro format in a Hive table, you can refer to [Apache Hive’s tutorial](https://cwiki.apache.org/confluence/display/Hive/AvroSerDe).

Note the following points:  

* [Complex data types](http://avro.apache.org/docs/current/spec.html#schema_complex) are not supported (records, enums, arrays, maps, unions and fixed).

### Specifying OrcFormat
If you want to parse the ORC files or write the data in ORC format, set the `format` `type` property to **OrcFormat**. You do not need to specify any properties in the Format section within the typeProperties section. Example:

```json
"format":
{
    "type": "OrcFormat"
}
```

> [!IMPORTANT]
> If you are not copying ORC files **as-is** between on-premises and cloud data stores, you need to install the JRE 8 (Java Runtime Environment) on your gateway machine. A 64-bit gateway requires 64-bit JRE and 32-bit gateway requires 32-bit JRE. You can find both versions from [here](http://go.microsoft.com/fwlink/?LinkId=808605). Choose the appropriate one.
>
>

Note the following points:

* Complex data types are not supported (STRUCT, MAP, LIST, UNION)
* ORC file has three [compression-related options](http://hortonworks.com/blog/orcfile-in-hdp-2-better-compression-better-performance/): NONE, ZLIB, SNAPPY. Data Factory supports reading data from ORC file in any of these compressed formats. It uses the compression codec is in the metadata to read the data. However, when writing to an ORC file, Data Factory chooses ZLIB, which is the default for ORC. Currently, there is no option to override this behavior.

### Specifying ParquetFormat
If you want to parse the Parquet files or write the data in Parquet format, set the `format` `type` property to **ParquetFormat**. You do not need to specify any properties in the Format section within the typeProperties section. Example:

```json
"format":
{
    "type": "ParquetFormat"
}
```
> [!IMPORTANT]
> If you are not copying Parquet files **as-is** between on-premises and cloud data stores, you need to install the JRE 8 (Java Runtime Environment) on your gateway machine. A 64-bit gateway requires 64-bit JRE and 32-bit gateway requires 32-bit JRE. You can find both versions from [here](http://go.microsoft.com/fwlink/?LinkId=808605). Choose the appropriate one.
>
>

Note the following points:

* Complex data types are not supported (MAP, LIST)
* Parquet file has the following compression-related options: NONE, SNAPPY, GZIP, and LZO. Data Factory supports reading data from ORC file in any of these compressed formats. It uses the compression codec in the metadata to read the data. However, when writing to a Parquet file, Data Factory chooses SNAPPY, which is the default for Parquet format. Currently, there is no option to override this behavior.
