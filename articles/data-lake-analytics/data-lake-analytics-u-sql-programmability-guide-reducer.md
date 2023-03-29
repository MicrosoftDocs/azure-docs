---
title: U-SQL user defined reducer programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide - user defined reducer.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined reducer

## U-SQL UDO: user-defined reducer

U-SQL enables you to write custom rowset reducers in C# by using the user-defined operator extensibility framework and implementing an IReducer interface.

User-defined reducer, or UDR, can be used to eliminate unnecessary rows during data extraction (import). It also can be used to manipulate and evaluate rows and columns. Based on programmability logic, it can also define which rows need to be extracted.

## How to define and use user-defined reducer

To define a UDR class, we need to create an `IReducer` interface with an optional `SqlUserDefinedReducer` attribute.

This class interface should contain a definition for the `IEnumerable` interface rowset override.

```csharp
[SqlUserDefinedReducer]
public class EmptyUserReducer : IReducer
{

    public override IEnumerable<IRow> Reduce(IRowset input, IUpdatableRow output)
    {
	    …
    }

}
```

The **SqlUserDefinedReducer** attribute indicates that the type should be registered as a user-defined reducer. This class can't be inherited.
**SqlUserDefinedReducer** is an optional attribute for a user-defined reducer definition. It's used to define IsRecursive property.

* bool     IsRecursive    
* **true**  = Indicates whether this Reducer is associative and commutative

The main programmability objects are **input** and **output**. The input object is used to enumerate input rows. Output is used to set output rows as a result of reducing activity.

For input rows enumeration, we use the `Row.Get` method.

```csharp
foreach (IRow row in input.Rows)
{
	row.Get<string>("mycolumn");
}
```

The parameter for the `Row.Get` method is a column that's passed as part of the `PRODUCE` class of the `REDUCE` statement of the U-SQL base script. We need to use the correct data type here as well.

For output, use the `output.Set` method.

It's important to understand that custom reducer only outputs values that are defined with the `output.Set` method call.

```csharp
output.Set<string>("mycolumn", guid);
```

The actual reducer output is triggered by calling `yield return output.AsReadOnly();`.

Following is a reducer example:

```csharp
[SqlUserDefinedReducer]
public class EmptyUserReducer : IReducer
{

    public override IEnumerable<IRow> Reduce(IRowset input, IUpdatableRow output)
    {
	string guid;
	DateTime dt;
	string user;
	string des;

	foreach (IRow row in input.Rows)
	{
	    guid = row.Get<string>("guid");
	    dt = row.Get<DateTime>("dt");
	    user = row.Get<string>("user");
	    des = row.Get<string>("des");

	    if (user.Length > 0)
	    {
		output.Set<string>("guid", guid);
		output.Set<DateTime>("dt", dt);
		output.Set<string>("user", user);
		output.Set<string>("des", des);

		yield return output.AsReadOnly();
	    }
	}
    }

}
```

In this use-case scenario, the reducer is skipping rows with an empty user name. For each row in rowset, it reads each required column, then evaluates the length of the user name. It outputs the actual row only if user name value length is more than 0.

Following is base U-SQL script that uses a custom reducer:

```usql
DECLARE @input_file string = @"\usql-programmability\input_file_reducer.tsv";
DECLARE @output_file string = @"\usql-programmability\output_file.tsv";

@rs0 =
	EXTRACT
            guid string,
	    dt DateTime,
            user String,
            des String
	FROM @input_file 
	USING Extractors.Tsv();

@rs1 =
    REDUCE @rs0 PRESORT guid
    ON guid  
    PRODUCE guid string, dt DateTime, user String, des String
    USING new USQL_Programmability.EmptyUserReducer();

@rs2 =
    SELECT guid AS start_id,
           dt AS start_time,
           DateTime.Now.ToString("M/d/yyyy") AS Nowdate,
           USQL_Programmability.CustomFunctions.GetFiscalPeriodWithCustomType(dt).ToString() AS start_fiscalperiod,
           user,
           des
    FROM @rs1;

OUTPUT @rs2 
	TO @output_file 
	USING Outputters.Text();
```

## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)