---
title: U-SQL user defined combiner programmability guide for Azure Data Lake
description: Learn about the U-SQL UDO programmability guide - user defined combiner.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# Use user-defined combiner

## U-SQL UDO: user-defined combiner

User-defined combiner, or UDC, enables you to combine rows from left and right rowsets, based on custom logic. User-defined combiner is used with COMBINE expression.

## How to define and use user-defined combiner

A combiner is being invoked with the COMBINE expression that provides the necessary information about both the input rowsets, the grouping columns, the expected result schema, and additional information.

To call a combiner in a base U-SQL script, we use the following syntax:

```usql
Combine_Expression :=
	'COMBINE' Combine_Input
	'WITH' Combine_Input
	Join_On_Clause
	Produce_Clause
	[Readonly_Clause]
	[Required_Clause]
	USING_Clause.
```

For more information, see [COMBINE Expression (U-SQL)](/u-sql/statements-and-expressions/combine-expression).

To define a user-defined combiner, we need to create the `ICombiner` interface with the [`SqlUserDefinedCombiner`] attribute, which is optional for a user-defined Combiner definition.

Base `ICombiner` class definition:

```csharp
public abstract class ICombiner : IUserDefinedOperator
{
protected ICombiner();
public virtual IEnumerable<IRow> Combine(List<IRowset> inputs,
       IUpdatableRow output);
public abstract IEnumerable<IRow> Combine(IRowset left, IRowset right,
       IUpdatableRow output);
}
```

The custom implementation of an `ICombiner` interface should contain the definition for an `IEnumerable<IRow>` Combine override.

```csharp
[SqlUserDefinedCombiner]
public class MyCombiner : ICombiner
{

public override IEnumerable<IRow> Combine(IRowset left, IRowset right,
	IUpdatableRow output)
{
    …
}
}
```

The **SqlUserDefinedCombiner** attribute indicates that the type should be registered as a user-defined combiner. This class can't be inherited.

**SqlUserDefinedCombiner** is used to define the Combiner mode property. It's an optional attribute for a user-defined combiner definition.

CombinerMode     Mode

CombinerMode enum can take the following values:

* Full  (0)	Every output row potentially depends on all the input rows from left and right
		with the same key value.

* Left  (1)	Every output row depends on a single input row from the left (and potentially all rows
		from the right with the same key value).

* Right (2)     Every output row depends on a single input row from the right (and potentially all rows
		from the left with the same key value).

* Inner (3)	Every output row depends on a single input row from left and right with the same value.

Example: 	[`SqlUserDefinedCombiner(Mode=CombinerMode.Left)`]


The main programmability objects are:

```csharp
	public override IEnumerable<IRow> Combine(IRowset left, IRowset right,
		IUpdatableRow output
```

Input rowsets are passed as **left** and **right** `IRowset` type of interface. Both rowsets must be enumerated for processing. You can only enumerate each interface once, so we have to enumerate and cache it if necessary.

For caching purposes, we can create a List\<T\> type of memory structure as a result of a LINQ query execution, specifically List<`IRow`>. The anonymous data type can be used during enumeration as well.

See [Introduction to LINQ Queries (C#)](/dotnet/csharp/programming-guide/concepts/linq/introduction-to-linq-queries) for more information about LINQ queries, and [IEnumerable\<T\> Interface](/dotnet/api/system.collections.generic.ienumerable-1) for more information about IEnumerable\<T\> interface.

To get the actual data values from the incoming `IRowset`, we use the Get() method of `IRow` interface.

```csharp
mycolumn = row.Get<int>("mycolumn")
```

Individual column names can be determined by calling the `IRow` Schema method.

```csharp
ISchema schema = row.Schema;
var col = schema[i];
string val = row.Get<string>(col.Name)
```

Or by using the schema column name:

```csharp
c# row.Get<int>(row.Schema[0].Name)
```

The general enumeration with LINQ looks like the following:

```csharp
var myRowset =
            (from row in left.Rows
                          select new
                          {
                              Mycolumn = row.Get<int>("mycolumn"),
                          }).ToList();
```

After enumerating both rowsets, we're going to loop through all rows. For each row in the left rowset, we're going to find all rows that satisfy the condition of our combiner.

The output values must be set with `IUpdatableRow` output.

```csharp
output.Set<int>("mycolumn", mycolumn)
```

The actual output is triggered by calling to `yield return output.AsReadOnly();`.

Following is a combiner example:

```csharp
[SqlUserDefinedCombiner]
public class CombineSales : ICombiner
{

public override IEnumerable<IRow> Combine(IRowset left, IRowset right,
	IUpdatableRow output)
{
    var internetSales =
    (from row in left.Rows
		  select new
		  {
		      ProductKey = row.Get<int>("ProductKey"),
		      OrderDateKey = row.Get<int>("OrderDateKey"),
		      SalesAmount = row.Get<decimal>("SalesAmount"),
		      TaxAmt = row.Get<decimal>("TaxAmt")
		  }).ToList();

    var resellerSales =
    (from row in right.Rows
     select new
     {
	 ProductKey = row.Get<int>("ProductKey"),
	 OrderDateKey = row.Get<int>("OrderDateKey"),
	 SalesAmount = row.Get<decimal>("SalesAmount"),
	 TaxAmt = row.Get<decimal>("TaxAmt")
     }).ToList();

    foreach (var row_i in internetSales)
    {
	foreach (var row_r in resellerSales)
	{

	    if (
		row_i.OrderDateKey > 0
		&& row_i.OrderDateKey < row_r.OrderDateKey
		&& row_i.OrderDateKey == 20010701
		&& (row_r.SalesAmount + row_r.TaxAmt) > 20000)
	    {
		output.Set<int>("OrderDateKey", row_i.OrderDateKey);
		output.Set<int>("ProductKey", row_i.ProductKey);
		output.Set<decimal>("Internet_Sales_Amount", row_i.SalesAmount + row_i.TaxAmt);
		output.Set<decimal>("Reseller_Sales_Amount", row_r.SalesAmount + row_r.TaxAmt);
	    }

	}
    }
    yield return output.AsReadOnly();
}
}
```

In this use-case scenario, we're building an analytics report for the retailer. The goal is to find all products that cost more than $20,000 and that sell through the website faster than through the regular retailer within a certain time frame.

Here's the base U-SQL script. You can compare the logic between a regular JOIN and a combiner:

```sql
DECLARE @LocalURI string = @"\usql-programmability\";

DECLARE @input_file_internet_sales string = @LocalURI+"FactInternetSales.txt";
DECLARE @input_file_reseller_sales string = @LocalURI+"FactResellerSales.txt";
DECLARE @output_file1 string = @LocalURI+"output_file1.tsv";
DECLARE @output_file2 string = @LocalURI+"output_file2.tsv";

@fact_internet_sales =
EXTRACT
	ProductKey int ,
	OrderDateKey int ,
	DueDateKey int ,
	ShipDateKey int ,
	CustomerKey int ,
	PromotionKey int ,
	CurrencyKey int ,
	SalesTerritoryKey int ,
	SalesOrderNumber String ,
	SalesOrderLineNumber  int ,
	RevisionNumber int ,
	OrderQuantity int ,
	UnitPrice decimal ,
	ExtendedAmount decimal,
	UnitPriceDiscountPct float ,
	DiscountAmount float ,
	ProductStandardCost decimal ,
	TotalProductCost decimal ,
	SalesAmount decimal ,
	TaxAmt decimal ,
	Freight decimal ,
	CarrierTrackingNumber String,
	CustomerPONumber String
FROM @input_file_internet_sales
USING Extractors.Text(delimiter:'|', encoding: Encoding.Unicode);

@fact_reseller_sales =
EXTRACT
	ProductKey int ,
	OrderDateKey int ,
	DueDateKey int ,
	ShipDateKey int ,
	ResellerKey int ,
    EmployeeKey int ,
	PromotionKey int ,
	CurrencyKey int ,
	SalesTerritoryKey int ,
	SalesOrderNumber String ,
	SalesOrderLineNumber  int ,
	RevisionNumber int ,
	OrderQuantity int ,
	UnitPrice decimal ,
	ExtendedAmount decimal,
	UnitPriceDiscountPct float ,
	DiscountAmount float ,
	ProductStandardCost decimal ,
	TotalProductCost decimal ,
	SalesAmount decimal ,
	TaxAmt decimal ,
	Freight decimal ,
	CarrierTrackingNumber String,
	CustomerPONumber String
FROM @input_file_reseller_sales
USING Extractors.Text(delimiter:'|', encoding: Encoding.Unicode);

@rs1 =
SELECT
    fis.OrderDateKey,
    fis.ProductKey,
    fis.SalesAmount+fis.TaxAmt AS Internet_Sales_Amount,
    frs.SalesAmount+frs.TaxAmt AS Reseller_Sales_Amount
FROM @fact_internet_sales AS fis
     INNER JOIN @fact_reseller_sales AS frs
     ON fis.ProductKey == frs.ProductKey
WHERE
    fis.OrderDateKey < frs.OrderDateKey
    AND fis.OrderDateKey == 20010701
    AND frs.SalesAmount+frs.TaxAmt > 20000;

@rs2 =
COMBINE @fact_internet_sales AS fis
WITH @fact_reseller_sales AS frs
ON fis.ProductKey == frs.ProductKey
PRODUCE OrderDateKey int,
        ProductKey int,
        Internet_Sales_Amount decimal,
        Reseller_Sales_Amount decimal
USING new USQL_Programmability.CombineSales();

OUTPUT @rs1 TO @output_file1 USING Outputters.Tsv();
OUTPUT @rs2 TO @output_file2 USING Outputters.Tsv();
```

A user-defined combiner can be called as a new instance of the applier object:

```csharp
USING new MyNameSpace.MyCombiner();
```


Or with the invocation of a wrapper factory method:

```csharp
USING MyNameSpace.MyCombiner();
```

## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)