---
title: U-SQL user defined applier programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide - user defined applier.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined applier 

## U-SQL UDO: user-defined applier
A U-SQL user-defined applier enables you to invoke a custom C# function for each row that's returned by the outer table expression of a query. The right input is evaluated for each row from the left input, and the rows that are produced are combined for the final output. The list of columns that are produced by the APPLY operator are the combination of the set of columns in the left and the right input.


## How to define and use user-defined applier
User-defined applier is being invoked as part of the USQL SELECT expression.

The typical call to the user-defined applier looks like the following:

```usql
SELECT …
FROM …
CROSS APPLYis used to pass parameters
new MyScript.MyApplier(param1, param2) AS alias(output_param1 string, …);
```

For more information about using appliers in a SELECT expression, see [U-SQL SELECT Selecting from CROSS APPLY and OUTER APPLY](/u-sql/statements-and-expressions/select/from/select-selecting-from-cross-apply-and-outer-apply).

The user-defined applier base class definition is as follows:

```csharp
public abstract class IApplier : IUserDefinedOperator
{
protected IApplier();

public abstract IEnumerable<IRow> Apply(IRow input, IUpdatableRow output);
}
```

To define a user-defined applier, we need to create the `IApplier` interface with the [`SqlUserDefinedApplier`] attribute, which is optional for a user-defined applier definition.

```csharp
[SqlUserDefinedApplier]
public class ParserApplier : IApplier
{
	public ParserApplier()
	{
		…
	}

	public override IEnumerable<IRow> Apply(IRow input, IUpdatableRow output)
	{
		…
	}
}
```

* Apply is called for each row of the outer table. It returns the `IUpdatableRow` output rowset.
* The Constructor class is used to pass parameters to the user-defined applier.

**SqlUserDefinedApplier** indicates that the type should be registered as a user-defined applier. This class can't be inherited.

**SqlUserDefinedApplier** is **optional** for a user-defined applier definition.


The main programmability objects are as follows:

```csharp
public override IEnumerable<IRow> Apply(IRow input, IUpdatableRow output)
```

Input rowsets are passed as `IRow` input. The output rows are generated as `IUpdatableRow` output interface.

Individual column names can be determined by calling the `IRow` Schema method.

```csharp
ISchema schema = row.Schema;
var col = schema[i];
string val = row.Get<string>(col.Name)
```

To get the actual data values from the incoming `IRow`, we use the Get() method of `IRow` interface.

```csharp
mycolumn = row.Get<int>("mycolumn")
```

Or we use the schema column name:

```csharp
row.Get<int>(row.Schema[0].Name)
```

The output values must be set with `IUpdatableRow` output:

```csharp
output.Set<int>("mycolumn", mycolumn)
```

It's important to understand that custom appliers only output columns and values that are defined with `output.Set` method call.

The actual output is triggered by calling `yield return output.AsReadOnly();`.

The user-defined applier parameters can be passed to the constructor. Applier can return a variable number of columns that need to be defined during the applier call in base U-SQL Script.

```csharp
new USQL_Programmability.ParserApplier ("all") AS properties(make string, model string, year string, type string, millage int);
```

Here's the user-defined applier example:

```csharp
[SqlUserDefinedApplier]
public class ParserApplier : IApplier
{
private string parsingPart;

public ParserApplier(string parsingPart)
{
    if (parsingPart.ToUpper().Contains("ALL")
	|| parsingPart.ToUpper().Contains("MAKE")
	|| parsingPart.ToUpper().Contains("MODEL")
	|| parsingPart.ToUpper().Contains("YEAR")
	|| parsingPart.ToUpper().Contains("TYPE")
	|| parsingPart.ToUpper().Contains("MILLAGE")
	)
    {
	this.parsingPart = parsingPart;
    }
    else
    {
	throw new ArgumentException("Incorrect parameter. Please use: 'ALL[MAKE|MODEL|TYPE|MILLAGE]'");
    }
}

public override IEnumerable<IRow> Apply(IRow input, IUpdatableRow output)
{

    string[] properties = input.Get<string>("properties").Split(',');

    //  only process with correct number of properties
    if (properties.Count() == 5)
    {

	string make = properties[0];
	string model = properties[1];
	string year = properties[2];
	string type = properties[3];
	int millage = -1;

	// Only return millage if it is number, otherwise, -1
	if (!int.TryParse(properties[4], out millage))
	{
	    millage = -1;
	}

	if (parsingPart.ToUpper().Contains("MAKE") || parsingPart.ToUpper().Contains("ALL")) output.Set<string>("make", make);
	if (parsingPart.ToUpper().Contains("MODEL") || parsingPart.ToUpper().Contains("ALL")) output.Set<string>("model", model);
	if (parsingPart.ToUpper().Contains("YEAR") || parsingPart.ToUpper().Contains("ALL")) output.Set<string>("year", year);
	if (parsingPart.ToUpper().Contains("TYPE") || parsingPart.ToUpper().Contains("ALL")) output.Set<string>("type", type);
	if (parsingPart.ToUpper().Contains("MILLAGE") || parsingPart.ToUpper().Contains("ALL")) output.Set<int>("millage", millage);
    }
    yield return output.AsReadOnly();            
}
}
```

Following is the base U-SQL script for this user-defined applier:

```usql
DECLARE @input_file string = @"c:\usql-programmability\car_fleet.tsv";
DECLARE @output_file string = @"c:\usql-programmability\output_file.tsv";

@rs0 =
	EXTRACT
        stocknumber int,
	    vin String,
        properties String
	FROM @input_file USING Extractors.Tsv();

@rs1 =
    SELECT
        r.stocknumber,
	    r.vin,
        properties.make,
        properties.model,
        properties.year,
        properties.type,
        properties.millage
	FROM @rs0 AS r
    CROSS APPLY
    new USQL_Programmability.ParserApplier ("all") AS properties(make string, model string, year string, type string, millage int);

OUTPUT @rs1 TO @output_file USING Outputters.Text();
```

In this use case scenario, user-defined applier acts as a comma-delimited value parser for the car fleet properties. The input file rows look like the following:

```text
103	Z1AB2CD123XY45889	Ford,Explorer,2005,SUV,152345
303	Y0AB2CD34XY458890	Chevrolet,Cruise,2010,4Dr,32455
210	X5AB2CD45XY458893	Nissan,Altima,2011,4Dr,74000
```

It's a typical tab-delimited TSV file with a properties column that contains car properties such as make and model. Those properties must be parsed to the table columns. The applier that's provided also enables you to generate a dynamic number of properties in the result rowset, based on the parameter that's passed. You can generate either all properties or a specific set of properties only.

```text
...USQL_Programmability.ParserApplier ("all")
...USQL_Programmability.ParserApplier ("make")
...USQL_Programmability.ParserApplier ("make&model")
```

The user-defined applier can be called as a new instance of applier object:

```usql
CROSS APPLY new MyNameSpace.MyApplier (parameter: "value") AS alias([columns types]…);
```

Or with the invocation of a wrapper factory method:

```csharp
	CROSS APPLY MyNameSpace.MyApplier (parameter: "value") AS alias([columns types]…);
```


## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)