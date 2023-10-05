---
title: U-SQL user defined outputter programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide user defined outputter.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined outputter

## U-SQL UDO: user-defined outputter

User-defined outputter is another U-SQL UDO that allows you to extend built-in U-SQL functionality. Similar to the extractor, there are several built-in outputters.

* *Outputters.Text()*: Writes data to delimited text files of different encodings.
* *Outputters.Csv()*: Writes data to comma-separated value (CSV) files of
different encodings.
* *Outputters.Tsv()*: Writes data to tab-separated value (TSV) files of different encodings.

Custom outputter allows you to write data in a custom defined format. This can be useful for the following tasks:

* Writing data to semi-structured or unstructured files.
* Writing data not supported encodings.
* Modifying output data or adding custom attributes.

## How to define and use user-defined outputter

To define user-defined outputter, we need to create the `IOutputter` interface.

Following is the base `IOutputter` class implementation:

```csharp
public abstract class IOutputter : IUserDefinedOperator
{
	protected IOutputter();

	public virtual void Close();
	public abstract void Output(IRow input, IUnstructuredWriter output);
}
```

All input parameters to the outputter, such as column/row delimiters, encoding, and so on, need to be defined in the constructor of the class. The `IOutputter` interface should also contain a definition for `void Output` override. The attribute `[SqlUserDefinedOutputter(AtomicFileProcessing = true)` can optionally be set for atomic file processing. For more information, see the following details.

```csharp
[SqlUserDefinedOutputter(AtomicFileProcessing = true)]
public class MyOutputter : IOutputter
{

    public MyOutputter(myparam1, myparam2)
    {
      …
    }

    public override void Close()
    {
      …
    }

    public override void Output(IRow row, IUnstructuredWriter output)
    {
      …
    }
}
```

* `Output` is called for each input row. It returns the `IUnstructuredWriter output` rowset.
* The Constructor class is used to pass parameters to the user-defined outputter.
* `Close` is used to optionally override to release expensive state or determine when the last row was written.

**SqlUserDefinedOutputter** attribute indicates that the type should be registered as a user-defined outputter. This class can't be inherited.

SqlUserDefinedOutputter is an optional attribute for a user-defined outputter definition. It's used to define the AtomicFileProcessing property.

* bool     AtomicFileProcessing   

* **true** = Indicates that this outputter requires atomic output files (JSON, XML, ...)
* **false** = Indicates that this outputter can deal with split / distributed files (CSV, SEQ, ...)

The main programmability objects are **row** and **output**. The **row** object is used to enumerate output data as `IRow` interface. **Output** is used to set output data to the target file.

The output data is accessed through the `IRow` interface. Output data is passed a row at a time.

The individual values are enumerated by calling the Get method of the IRow interface:

```csharp
row.Get<string>("column_name")
```

Individual column names can be determined by calling `row.Schema`:

```csharp
ISchema schema = row.Schema;
var col = schema[i];
string val = row.Get<string>(col.Name)
```

This approach enables you to build a flexible outputter for any metadata schema.

The output data is written to file by using `System.IO.StreamWriter`. The stream parameter is set to `output.BaseStream` as part of `IUnstructuredWriter output`.

It's important to flush the data buffer to the file after each row iteration. In addition, the `StreamWriter` object must be used with the Disposable attribute enabled (default) and with the **using** keyword:

```csharp
using (StreamWriter streamWriter = new StreamWriter(output.BaseStream, this._encoding))
{
…
}
```

Otherwise, call Flush() method explicitly after each iteration. We show this in the following example.

### Set headers and footers for user-defined outputter
To set a header, use single iteration execution flow.

```csharp
public override void Output(IRow row, IUnstructuredWriter output)
{
 …
if (isHeaderRow)
{
    …                
}

 …
if (isHeaderRow)
{
    isHeaderRow = false;
}
 …
}
}
```

The code in the first `if (isHeaderRow)` block is executed only once.

For the footer, use the reference to the instance of `System.IO.Stream` object (`output.BaseStream`). Write the footer in the Close() method of the `IOutputter` interface.  (For more information, see the following example.)

Following is an example of a user-defined outputter:

```csharp
[SqlUserDefinedOutputter(AtomicFileProcessing = true)]
public class HTMLOutputter : IOutputter
{
    // Local variables initialization
    private string row_delimiter;
    private char col_delimiter;
    private bool isHeaderRow;
    private Encoding encoding;
    private bool IsTableHeader = true;
    private Stream g_writer;

    // Parameters definition            
    public HTMLOutputter(bool isHeader = false, Encoding encoding = null)
    {
	this.isHeaderRow = isHeader;
	this.encoding = ((encoding == null) ? Encoding.UTF8 : encoding);
    }

    // The Close method is used to write the footer to the file. It's executed only once, after all rows
    public override void Close()
    {
	//Reference to IO.Stream object - g_writer
	StreamWriter streamWriter = new StreamWriter(g_writer, this.encoding);
	streamWriter.Write("</table>");
	streamWriter.Flush();
	streamWriter.Close();
    }

    public override void Output(IRow row, IUnstructuredWriter output)
    {
	System.IO.StreamWriter streamWriter = new StreamWriter(output.BaseStream, this.encoding);

	// Metadata schema initialization to enumerate column names
	ISchema schema = row.Schema;

	// This is a data-independent header--HTML table definition
	if (IsTableHeader)
	{
	    streamWriter.Write("<table border=1>");
	    IsTableHeader = false;
	}

	// HTML table attributes
	string header_wrapper_on = "<th>";
	string header_wrapper_off = "</th>";
	string data_wrapper_on = "<td>";
	string data_wrapper_off = "</td>";

	// Header row output--runs only once
	if (isHeaderRow)
	{
	    streamWriter.Write("<tr>");
	    for (int i = 0; i < schema.Count(); i++)
	    {
		var col = schema[i];
		streamWriter.Write(header_wrapper_on + col.Name + header_wrapper_off);
	    }
	    streamWriter.Write("</tr>");
	}

	// Data row output
	streamWriter.Write("<tr>");                
	for (int i = 0; i < schema.Count(); i++)
	{
	    var col = schema[i];
	    string val = "";
	    try
	    {
		// Data type enumeration--required to match the distinct list of types from OUTPUT statement
		switch (col.Type.Name.ToString().ToLower())
		{
		    case "string": val = row.Get<string>(col.Name).ToString(); break;
		    case "guid": val = row.Get<Guid>(col.Name).ToString(); break;
		    default: break;
		}
	    }
	    // Handling NULL values--keeping them empty
	    catch (System.NullReferenceException)
	    {
	    }
	    streamWriter.Write(data_wrapper_on + val + data_wrapper_off);
	}
	streamWriter.Write("</tr>");

	if (isHeaderRow)
	{
	    isHeaderRow = false;
	}
	// Reference to the instance of the IO.Stream object for footer generation
	g_writer = output.BaseStream;
	streamWriter.Flush();
    }
}

// Define the factory classes
public static class Factory
{
    public static HTMLOutputter HTMLOutputter(bool isHeader = false, Encoding encoding = null)
    {
	return new HTMLOutputter(isHeader, encoding);
    }
}
```

And U-SQL base script:

```usql
DECLARE @input_file string = @"\usql-programmability\input_file.tsv";
DECLARE @output_file string = @"\usql-programmability\output_file.html";

@rs0 =
	EXTRACT
            guid Guid,
	    dt String,
            user String,
            des String
         FROM @input_file
         USING new USQL_Programmability.FullDescriptionExtractor(Encoding.UTF8);

OUTPUT @rs0 
	TO @output_file 
	USING new USQL_Programmability.HTMLOutputter(isHeader: true);
```

This is an HTML outputter, which creates an HTML file with table data.

### Call outputter from U-SQL base script
To call a custom outputter from the base U-SQL script, the new instance of the outputter object has to be created.

```sql
OUTPUT @rs0 TO @output_file USING new USQL_Programmability.HTMLOutputter(isHeader: true);
```

To avoid creating an instance of the object in base script, we can create a function wrapper, as shown in our earlier example:

```csharp
        // Define the factory classes
        public static class Factory
        {
            public static HTMLOutputter HTMLOutputter(bool isHeader = false, Encoding encoding = null)
            {
                return new HTMLOutputter(isHeader, encoding);
            }
        }
```

In this case, the original call looks like the following:

```usql
OUTPUT @rs0 
TO @output_file 
USING USQL_Programmability.Factory.HTMLOutputter(isHeader: true);
```

## Next steps

* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)