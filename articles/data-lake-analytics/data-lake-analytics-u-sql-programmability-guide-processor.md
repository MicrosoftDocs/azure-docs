---
title: U-SQL user defined processor programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide - user defined processor.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined processor

## U-SQL UDO: user-defined processor

User-defined processor, or UDP, is a type of U-SQL UDO that enables you to process the incoming rows by applying programmability features. UDP enables you to combine columns, modify values, and add new columns if necessary. Basically, it helps to process a rowset to produce required data elements.

## How to define and use user-defined processor

To define a UDP, we need to create an `IProcessor` interface with the `SqlUserDefinedProcessor` attribute, which is optional for UDP.

This interface should contain the definition for the `IRow` interface rowset override, as shown in the following example:

```csharp
[SqlUserDefinedProcessor]
public class MyProcessor: IProcessor
{
public override IRow Process(IRow input, IUpdatableRow output)
 {
		…
 }
}
```

**SqlUserDefinedProcessor** indicates that the type should be registered as a user-defined processor. This class can't be inherited.

The SqlUserDefinedProcessor attribute is **optional** for UDP definition.

The main programmability objects are **input** and **output**. The input object is used to enumerate input columns and output, and to set output data as a result of the processor activity.

For input columns enumeration, we use the `input.Get` method.

```csharp
string column_name = input.Get<string>("column_name");
```

The parameter for `input.Get` method is a column that's passed as part of the `PRODUCE` clause of the `PROCESS` statement of the U-SQL base script. We need to use the correct data type here.

For output, use the `output.Set` method.

It's important to note that custom producer only outputs columns and values that are defined with the `output.Set` method call.

```csharp
output.Set<string>("mycolumn", mycolumn);
```

The actual processor output is triggered by calling `return output.AsReadOnly();`.

Following is a processor example:

```csharp
[SqlUserDefinedProcessor]
public class FullDescriptionProcessor : IProcessor
{
public override IRow Process(IRow input, IUpdatableRow output)
 {
     string user = input.Get<string>("user");
     string des = input.Get<string>("des");
     string full_description = user.ToUpper() + "=>" + des;
     output.Set<string>("dt", input.Get<string>("dt"));
     output.Set<string>("full_description", full_description);
     output.Set<Guid>("new_guid", Guid.NewGuid());
     output.Set<Guid>("guid", input.Get<Guid>("guid"));
     return output.AsReadOnly();
 }
}
```

In this use-case scenario, the processor is generating a new column called “full_description” by combining the existing columns--in this case, “user” in upper case, and “des”. It also regenerates a GUID and returns the original and new GUID values.

As you can see from the previous example, you can call C# methods during `output.Set` method call.

Following is an example of base U-SQL script that uses a custom processor:

```usql
DECLARE @input_file string = @"\usql-programmability\input_file.tsv";
DECLARE @output_file string = @"\usql-programmability\output_file.tsv";

@rs0 =
	EXTRACT
            guid Guid,
	    dt String,
            user String,
            des String
	FROM @input_file USING Extractors.Tsv();

@rs1 =
     PROCESS @rs0
     PRODUCE dt String,
             full_description String,
             guid Guid,
             new_guid Guid
     USING new USQL_Programmability.FullDescriptionProcessor();

OUTPUT @rs1 TO @output_file USING Outputters.Text();
```


## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)