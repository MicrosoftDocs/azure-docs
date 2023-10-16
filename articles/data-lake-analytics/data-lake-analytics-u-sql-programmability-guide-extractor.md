---
title: U-SQL user defined extractor programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide - user defined extractor.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined extractor

## U-SQL UDO: user-defined extractor

U-SQL allows you to import external data by using an EXTRACT statement. An EXTRACT statement can use built-in UDO extractors:  

* *Extractors.Text()*: Provides extraction from delimited text files of different encodings.

* *Extractors.Csv()*: Provides extraction from comma-separated value (CSV) files of
different encodings.

* *Extractors.Tsv()*: Provides extraction from tab-separated value (TSV) files of different encodings.

It can be useful to develop a custom extractor. This can be helpful during data import if we want to do any of the following tasks:

* Modify input data by splitting columns and modifying individual values. The PROCESSOR functionality is better for combining columns.
* Parse unstructured data such as Web pages and emails, or semi-unstructured data such as XML/JSON.
* Parse data in unsupported encoding.

## How to define and use user-defined extractor

To define a user-defined extractor, or UDE, we need to create an `IExtractor` interface. All input parameters to the extractor, such as column/row delimiters, and encoding, need to be defined in the constructor of the class. The `IExtractor`  interface should also contain a definition for the `IEnumerable<IRow>` override as follows:

```csharp
[SqlUserDefinedExtractor]
public class SampleExtractor : IExtractor
{
	 public SampleExtractor(string row_delimiter, char col_delimiter)
	 { … }

	 public override IEnumerable<IRow> Extract(IUnstructuredReader input, IUpdatableRow output)
	 { … }
}
```

The **SqlUserDefinedExtractor** attribute indicates that the type should be registered as a user-defined extractor. This class can't be inherited.

SqlUserDefinedExtractor is an optional attribute for UDE definition. It used to define AtomicFileProcessing property for the UDE object.

* bool     AtomicFileProcessing   

* **true** = Indicates that this extractor requires atomic input files (JSON, XML, ...)
* **false** = Indicates that this extractor can deal with split / distributed files (CSV, SEQ, ...)

The main UDE programmability objects are **input** and **output**. The input object is used to enumerate input data as `IUnstructuredReader`. The output object is used to set output data as a result of the extractor activity.

The input data is accessed through `System.IO.Stream` and `System.IO.StreamReader`.

For input columns enumeration, we first split the input stream by using a row delimiter.

```csharp
foreach (Stream current in input.Split(my_row_delimiter))
{
…
}
```

Then, further split input row into column parts.

```csharp
foreach (Stream current in input.Split(my_row_delimiter))
{
…
	string[] parts = line.Split(my_column_delimiter);
	foreach (string part in parts)
	{ … }
}
```

To set output data, we use the `output.Set` method.

It's important to understand that the custom extractor only outputs columns and values that are defined with the output. Set method call.

```csharp
output.Set<string>(count, part);
```

The actual extractor output is triggered by calling `yield return output.AsReadOnly();`.

Following is the extractor example:

```csharp
[SqlUserDefinedExtractor(AtomicFileProcessing = true)]
public class FullDescriptionExtractor : IExtractor
{
	 private Encoding _encoding;
	 private byte[] _row_delim;
	 private char _col_delim;

	public FullDescriptionExtractor(Encoding encoding, string row_delim = "\r\n", char col_delim = '\t')
	{
	     this._encoding = ((encoding == null) ? Encoding.UTF8 : encoding);
	     this._row_delim = this._encoding.GetBytes(row_delim);
	     this._col_delim = col_delim;

	}

	public override IEnumerable<IRow> Extract(IUnstructuredReader input, IUpdatableRow output)
	{
	     string line;
	     //Read the input line by line
	     foreach (Stream current in input.Split(_encoding.GetBytes("\r\n")))
	     {
		using (System.IO.StreamReader streamReader = new StreamReader(current, this._encoding))
		 {
		     line = streamReader.ReadToEnd().Trim();
		     //Split the input by the column delimiter
		     string[] parts = line.Split(this._col_delim);
		     int count = 0; // start with first column
		     foreach (string part in parts)
		     {
	if (count == 0)
			 {  // for column “guid”, re-generated guid
			     Guid new_guid = Guid.NewGuid();
			     output.Set<Guid>(count, new_guid);
			 }
			 else if (count == 2)
			 {
			     // for column “user”, convert to UPPER case
			     output.Set<string>(count, part.ToUpper());

			 }
			 else
			 {
			     // keep the rest of the columns as-is
			     output.Set<string>(count, part);
			 }
			 count += 1;
		     }

		 }
		 yield return output.AsReadOnly();
	     }
	     yield break;
	 }
}
```

In this use-case scenario, the extractor regenerates the GUID for “guid” column and converts the values of “user” column to upper case. Custom extractors can produce more complicated results by parsing input data and manipulating it.

Following is base U-SQL script that uses a custom extractor:

```usql
DECLARE @input_file string = @"\usql-programmability\input_file.tsv";
DECLARE @output_file string = @"\usql-programmability\output_file.tsv";

@rs0 =
	EXTRACT
        guid Guid,
        dt String,
        user String,
        des String
	FROM @input_file
        USING new USQL_Programmability.FullDescriptionExtractor(Encoding.UTF8);

OUTPUT @rs0 TO @output_file USING Outputters.Text();
```


## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)