## FileShare dataset type properties
For a full list of sections & properties available for defining datasets, see the [Creating datasets](../articles/data-factory/data-factory-create-datasets.md) article. Sections such as structure, availability, and policy of a dataset JSON are similar for all dataset types.

The **typeProperties** section is different for each type of dataset. It provides information that is specific to the dataset type. The typeProperties section for a dataset of type **FileShare** dataset has the following properties:

| Property | Description | Required |
| --- | --- | --- |
| folderPath |Sub path to the folder. Use escape character ‘ \ ’ for special characters in the string. See [Sample linked service and dataset definitions](#sample-linked-service-and-dataset-definitions) for examples.<br/><br/>You can combine this property with **partitionBy** to have folder paths based on slice start/end date-times. |Yes |
| fileName |Specify the name of the file in the **folderPath** if you want the table to refer to a specific file in the folder. If you do not specify any value for this property, the table points to all files in the folder.<br/><br/>When fileName is not specified for an output dataset, the name of the generated file would be in the following this format: <br/><br/>Data.<Guid>.txt (Example: Data.0a405f8a-93ff-4c6f-b3be-f69616f1df7a.txt |No |
| fileFilter |Specify a filter to be used to select a subset of files in the folderPath rather than all files.<br/><br/>Allowed values are: `*` (multiple characters) and `?` (single character).<br/><br/>Examples 1: `"fileFilter": "*.log"`<br/>Example 2: `"fileFilter": 2014-1-?.txt"`<br/><br/> fileFilter is applicable for an input FileShare dataset. This property is not supported with HDFS. |No |
| partitionedBy |partitionedBy can be used to specify a dynamic folderPath, filename for time series data. For example, folderPath parameterized for every hour of data. |No |
| format | The following format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Text Format](#specifying-textformat), [Json Format](#specifying-jsonformat), [Avro Format](#specifying-avroformat), [Orc Format](#specifying-orcformat), and [Parquet Format](#specifying-parquetformat) sections. <br><br> If you want to **copy files as-is** between file-based stores (binary copy), skip the format section in both input and output dataset definitions. |No |
| compression | Specify the type and level of compression for the data. Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**; and supported levels are: **Optimal** and **Fastest**. For more information, see [Specifying compression](#specifying-compression) section. |No |
| useBinaryTransfer |Specify whether use Binary transfer mode. True for binary mode and false ASCII. Default value: True. This property can only be used when associated linked service type is of type: FtpServer. |No |

> [!NOTE]
> filename and fileFilter cannot be used simultaneously.
>
>

### Using partionedBy property
As mentioned in the previous section, you can specify a dynamic folderPath, filename for time series data with partitionedBy. You can do so with the Data Factory macros and the system variable SliceStart, SliceEnd that indicate the logical time period for a given data slice.

To learn about time series datasets, scheduling, and slices, See [Creating Datasets](../articles/data-factory/data-factory-create-datasets.md), [Scheduling & Execution](../articles/data-factory/data-factory-scheduling-and-execution.md), and [Creating Pipelines](../articles/data-factory/data-factory-create-pipelines.md) articles.

#### Sample 1:

```json
"folderPath": "wikidatagateway/wikisampledataout/{Slice}",
"partitionedBy":
[
    { "name": "Slice", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyyMMddHH" } },
],
```
In this example {Slice} is replaced with the value of Data Factory system variable SliceStart in the format (YYYYMMDDHH) specified. The SliceStart refers to start time of the slice. The folderPath is different for each slice. Example: wikidatagateway/wikisampledataout/2014100103 or wikidatagateway/wikisampledataout/2014100104.

#### Sample 2:

```json
"folderPath": "wikidatagateway/wikisampledataout/{Year}/{Month}/{Day}",
"fileName": "{Hour}.csv",
"partitionedBy":
 [
    { "name": "Year", "value": { "type": "DateTime", "date": "SliceStart", "format": "yyyy" } },
    { "name": "Month", "value": { "type": "DateTime", "date": "SliceStart", "format": "MM" } },
    { "name": "Day", "value": { "type": "DateTime", "date": "SliceStart", "format": "dd" } },
    { "name": "Hour", "value": { "type": "DateTime", "date": "SliceStart", "format": "hh" } }
],
```
In this example, year, month, day, and time of SliceStart are extracted into separate variables that are used by folderPath and fileName properties.
