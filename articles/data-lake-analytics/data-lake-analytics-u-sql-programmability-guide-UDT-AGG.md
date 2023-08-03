---
title: U-SQL UDT and UDAGG programmability guide for Azure Data Lake
description: Learn about the U-SQL UDT and UDAGG programmability in Azure Data Lake Analytics to enable you to create good USQL scripts.
ms.service: data-lake-analytics
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/27/2023
---

# U-SQL programmability guide - UDT and UDAGG

## Use user-defined types: UDT

User-defined types, or UDT, is another programmability feature of U-SQL. U-SQL UDT acts like a regular C# user-defined type. C# is a strongly typed language that allows the use of built-in and custom user-defined types.

U-SQL can't implicitly serialize or de-serialize arbitrary UDTs when the UDT is passed between vertices in rowsets. This means that the user has to provide an explicit formatter by using the IFormatter interface. This provides U-SQL with the serialize and de-serialize methods for the UDT.

> [!NOTE]
> U-SQL’s built-in extractors and outputters currently cannot serialize or de-serialize UDT data to or from files even with the IFormatter set. So when you're writing UDT data to a file with the OUTPUT statement, or reading it with an extractor, you have to pass it as a string or byte array. Then you call the serialization and deserialization code (that is, the UDT’s ToString() method) explicitly. User-defined extractors and outputters, on the other hand, can read and write UDTs.

If we try to use UDT in EXTRACTOR or OUTPUTTER (out of previous SELECT), as shown here:

```usql
@rs1 =
    SELECT
        MyNameSpace.Myfunction_Returning_UDT(filed1) AS myfield
    FROM @rs0;

OUTPUT @rs1
    TO @output_file
    USING Outputters.Text();
```

We receive the following error:

```output
Error	1	E_CSC_USER_INVALIDTYPEINOUTPUTTER: Outputters.Text was used to output column myfield of type
MyNameSpace.Myfunction_Returning_UDT.

Description:

Outputters.Text only supports built-in types.

Resolution:

Implement a custom outputter that knows how to serialize this type, or call a serialization method on the type in
the preceding SELECT.	C:\Users\sergeypu\Documents\Visual Studio 2013\Projects\USQL-Programmability\
USQL-Programmability\Types.usql	52	1	USQL-Programmability
```

To work with UDT in outputter, we either have to serialize it to string with the ToString() method or create a custom outputter.

UDTs currently can't be used in GROUP BY. If UDT is used in GROUP BY, the following error is thrown:

```output
Error	1	E_CSC_USER_INVALIDTYPEINCLAUSE: GROUP BY doesn't support type MyNameSpace.Myfunction_Returning_UDT
for column myfield

Description:

GROUP BY doesn't support UDT or Complex types.

Resolution:

Add a SELECT statement where you can project a scalar column that you want to use with GROUP BY.
C:\Users\sergeypu\Documents\Visual Studio 2013\Projects\USQL-Programmability\USQL-Programmability\Types.usql
62	5	USQL-Programmability
```

To define a UDT, we must:

1. Add the following namespaces:

```csharp
using Microsoft.Analytics.Interfaces
using System.IO;
```

2. Add `Microsoft.Analytics.Interfaces`, which is required for the UDT interfaces. In addition, `System.IO` might be needed to define the IFormatter interface.

3. Define a used-defined type with SqlUserDefinedType attribute.

**SqlUserDefinedType** is used to mark a type definition in an assembly as a user-defined type (UDT) in U-SQL. The properties on the attribute reflect the physical characteristics of the UDT. This class can't be inherited.

SqlUserDefinedType is a required attribute for UDT definition.

The constructor of the class:

* SqlUserDefinedTypeAttribute (type formatter)

* Type formatter: Required parameter to define an UDT formatter--specifically, the type of the `IFormatter` interface must be passed here.

```csharp
[SqlUserDefinedType(typeof(MyTypeFormatter))]
public class MyType
{ … }
```

* Typical UDT also requires definition of the IFormatter interface, as shown in the following example:

```csharp
public class MyTypeFormatter : IFormatter<MyType>
{
    public void Serialize(MyType instance, IColumnWriter writer, ISerializationContext context)
    { … }

    public MyType Deserialize(IColumnReader reader, ISerializationContext context)
    { … }
}
```

The `IFormatter` interface serializes and de-serializes an object graph with the root type of \<typeparamref name="T">.

\<typeparam name="T">The root type for the object graph to serialize and de-serialize.

* **Deserialize**: De-serializes the data on the provided stream and reconstitutes the graph of objects.

* **Serialize**: Serializes an object, or graph of objects, with the given root to the provided stream.

`MyType` instance: Instance of the type.
`IColumnWriter` writer / `IColumnReader` reader: The underlying column stream.
`ISerializationContext` context: Enum that defines a set of flags that specifies the source or destination context for the stream during serialization.

* **Intermediate**: Specifies that the source or destination context isn't a persisted store.

* **Persistence**: Specifies that the source or destination context is a persisted store.

As a regular C# type, a U-SQL UDT definition can include overrides for operators such as +/==/!=. It can also include static methods. For example, if we're going to use this UDT as a parameter to a U-SQL MIN aggregate function, we have to define < operator override.

Earlier in this guide, we demonstrated an example for fiscal period identification from the specific date in the format `Qn:Pn (Q1:P10)`. The following example shows how to define a custom type for fiscal period values.

Following is an example of a code-behind section with custom UDT and IFormatter interface:

```csharp
[SqlUserDefinedType(typeof(FiscalPeriodFormatter))]
public struct FiscalPeriod
{
    public int Quarter { get; private set; }

    public int Month { get; private set; }

    public FiscalPeriod(int quarter, int month):this()
    {
        this.Quarter = quarter;
        this.Month = month;
    }

    public override bool Equals(object obj)
    {
        if (ReferenceEquals(null, obj))
        {
            return false;
        }

        return obj is FiscalPeriod && Equals((FiscalPeriod)obj);
    }

    public bool Equals(FiscalPeriod other)
    {
return this.Quarter.Equals(other.Quarter) && this.Month.Equals(other.Month);
    }

    public bool GreaterThan(FiscalPeriod other)
    {
return this.Quarter.CompareTo(other.Quarter) > 0 || this.Month.CompareTo(other.Month) > 0;
    }

    public bool LessThan(FiscalPeriod other)
    {
return this.Quarter.CompareTo(other.Quarter) < 0 || this.Month.CompareTo(other.Month) < 0;
    }

    public override int GetHashCode()
    {
        unchecked
        {
            return (this.Quarter.GetHashCode() * 397) ^ this.Month.GetHashCode();
        }
    }

    public static FiscalPeriod operator +(FiscalPeriod c1, FiscalPeriod c2)
    {
return new FiscalPeriod((c1.Quarter + c2.Quarter) > 4 ? (c1.Quarter + c2.Quarter)-4 : (c1.Quarter + c2.Quarter), (c1.Month + c2.Month) > 12 ? (c1.Month + c2.Month) - 12 : (c1.Month + c2.Month));
    }

    public static bool operator ==(FiscalPeriod c1, FiscalPeriod c2)
    {
        return c1.Equals(c2);
    }

    public static bool operator !=(FiscalPeriod c1, FiscalPeriod c2)
    {
        return !c1.Equals(c2);
    }
    public static bool operator >(FiscalPeriod c1, FiscalPeriod c2)
    {
        return c1.GreaterThan(c2);
    }
    public static bool operator <(FiscalPeriod c1, FiscalPeriod c2)
    {
        return c1.LessThan(c2);
    }
    public override string ToString()
    {
        return (String.Format("Q{0}:P{1}", this.Quarter, this.Month));
    }

}

public class FiscalPeriodFormatter : IFormatter<FiscalPeriod>
{
    public void Serialize(FiscalPeriod instance, IColumnWriter writer, ISerializationContext context)
    {
        using (var binaryWriter = new BinaryWriter(writer.BaseStream))
        {
            binaryWriter.Write(instance.Quarter);
            binaryWriter.Write(instance.Month);
            binaryWriter.Flush();
        }
    }

    public FiscalPeriod Deserialize(IColumnReader reader, ISerializationContext context)
    {
        using (var binaryReader = new BinaryReader(reader.BaseStream))
        {
var result = new FiscalPeriod(binaryReader.ReadInt16(), binaryReader.ReadInt16());
            return result;
        }
    }
}
```

The defined type includes two numbers: quarter and month. Operators `==/!=/>/<` and static method `ToString()` are defined here.

As mentioned earlier, UDT can be used in SELECT expressions, but can't be used in OUTPUTTER/EXTRACTOR without custom serialization. It either has to be serialized as a string with `ToString()` or used with a custom OUTPUTTER/EXTRACTOR.

Now let’s discuss usage of UDT. In a code-behind section, we changed our GetFiscalPeriod function to the following:

```csharp
public static FiscalPeriod GetFiscalPeriodWithCustomType(DateTime dt)
{
    int FiscalMonth = 0;
    if (dt.Month < 7)
    {
        FiscalMonth = dt.Month + 6;
    }
    else
    {
        FiscalMonth = dt.Month - 6;
    }

    int FiscalQuarter = 0;
    if (FiscalMonth >= 1 && FiscalMonth <= 3)
    {
        FiscalQuarter = 1;
    }
    if (FiscalMonth >= 4 && FiscalMonth <= 6)
    {
        FiscalQuarter = 2;
    }
    if (FiscalMonth >= 7 && FiscalMonth <= 9)
    {
        FiscalQuarter = 3;
    }
    if (FiscalMonth >= 10 && FiscalMonth <= 12)
    {
        FiscalQuarter = 4;
    }

    return new FiscalPeriod(FiscalQuarter, FiscalMonth);
}
```

As you can see, it returns the value of our FiscalPeriod type.

Here we provide an example of how to use it further in U-SQL base script. This example demonstrates different forms of UDT invocation from U-SQL script.

```usql
DECLARE @input_file string = @"c:\work\cosmos\usql-programmability\input_file.tsv";
DECLARE @output_file string = @"c:\work\cosmos\usql-programmability\output_file.tsv";

@rs0 =
    EXTRACT
        guid string,
        dt DateTime,
        user String,
        des String
    FROM @input_file USING Extractors.Tsv();

@rs1 =
    SELECT
        guid AS start_id,
        dt,
        DateTime.Now.ToString("M/d/yyyy") AS Nowdate,
        USQL_Programmability.CustomFunctions.GetFiscalPeriodWithCustomType(dt).Quarter AS fiscalquarter,
        USQL_Programmability.CustomFunctions.GetFiscalPeriodWithCustomType(dt).Month AS fiscalmonth,
        USQL_Programmability.CustomFunctions.GetFiscalPeriodWithCustomType(dt) + new USQL_Programmability.CustomFunctions.FiscalPeriod(1,7) AS fiscalperiod_adjusted,
        user,
        des
    FROM @rs0;

@rs2 =
    SELECT
        start_id,
        dt,
        DateTime.Now.ToString("M/d/yyyy") AS Nowdate,
        fiscalquarter,
        fiscalmonth,
        USQL_Programmability.CustomFunctions.GetFiscalPeriodWithCustomType(dt).ToString() AS fiscalperiod,

           // This user-defined type was created in the prior SELECT.  Passing the UDT to this subsequent SELECT would have failed if the UDT was not annotated with an IFormatter.
           fiscalperiod_adjusted.ToString() AS fiscalperiod_adjusted,
           user,
           des
    FROM @rs1;

OUTPUT @rs2
    TO @output_file
    USING Outputters.Text();
```

Here's an example of a full code-behind section:

```csharp
using Microsoft.Analytics.Interfaces;
using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace USQL_Programmability
{
    public class CustomFunctions
    {
        static public DateTime? ToDateTime(string dt)
        {
            DateTime dtValue;

            if (!DateTime.TryParse(dt, out dtValue))
                return Convert.ToDateTime(dt);
            else
                return null;
        }

        public static FiscalPeriod GetFiscalPeriodWithCustomType(DateTime dt)
        {
            int FiscalMonth = 0;
            if (dt.Month < 7)
            {
                FiscalMonth = dt.Month + 6;
            }
            else
            {
                FiscalMonth = dt.Month - 6;
            }

            int FiscalQuarter = 0;
            if (FiscalMonth >= 1 && FiscalMonth <= 3)
            {
                FiscalQuarter = 1;
            }
            if (FiscalMonth >= 4 && FiscalMonth <= 6)
            {
                FiscalQuarter = 2;
            }
            if (FiscalMonth >= 7 && FiscalMonth <= 9)
            {
                FiscalQuarter = 3;
            }
            if (FiscalMonth >= 10 && FiscalMonth <= 12)
            {
                FiscalQuarter = 4;
            }

            return new FiscalPeriod(FiscalQuarter, FiscalMonth);
        }        [SqlUserDefinedType(typeof(FiscalPeriodFormatter))]
        public struct FiscalPeriod
        {
            public int Quarter { get; private set; }

            public int Month { get; private set; }

            public FiscalPeriod(int quarter, int month):this()
            {
                this.Quarter = quarter;
                this.Month = month;
            }

            public override bool Equals(object obj)
            {
                if (ReferenceEquals(null, obj))
                {
                    return false;
                }

                return obj is FiscalPeriod && Equals((FiscalPeriod)obj);
            }

            public bool Equals(FiscalPeriod other)
            {
return this.Quarter.Equals(other.Quarter) &&    this.Month.Equals(other.Month);
            }

            public bool GreaterThan(FiscalPeriod other)
            {
return this.Quarter.CompareTo(other.Quarter) > 0 || this.Month.CompareTo(other.Month) > 0;
            }

            public bool LessThan(FiscalPeriod other)
            {
return this.Quarter.CompareTo(other.Quarter) < 0 || this.Month.CompareTo(other.Month) < 0;
            }

            public override int GetHashCode()
            {
                unchecked
                {
                    return (this.Quarter.GetHashCode() * 397) ^ this.Month.GetHashCode();
                }
            }

            public static FiscalPeriod operator +(FiscalPeriod c1, FiscalPeriod c2)
            {
return new FiscalPeriod((c1.Quarter + c2.Quarter) > 4 ? (c1.Quarter + c2.Quarter)-4 : (c1.Quarter + c2.Quarter), (c1.Month + c2.Month) > 12 ? (c1.Month + c2.Month) - 12 : (c1.Month + c2.Month));
            }

            public static bool operator ==(FiscalPeriod c1, FiscalPeriod c2)
            {
                return c1.Equals(c2);
            }

            public static bool operator !=(FiscalPeriod c1, FiscalPeriod c2)
            {
                return !c1.Equals(c2);
            }
            public static bool operator >(FiscalPeriod c1, FiscalPeriod c2)
            {
                return c1.GreaterThan(c2);
            }
            public static bool operator <(FiscalPeriod c1, FiscalPeriod c2)
            {
                return c1.LessThan(c2);
            }
            public override string ToString()
            {
                return (String.Format("Q{0}:P{1}", this.Quarter, this.Month));
            }

        }

        public class FiscalPeriodFormatter : IFormatter<FiscalPeriod>
        {
public void Serialize(FiscalPeriod instance, IColumnWriter writer, ISerializationContext context)
            {
                using (var binaryWriter = new BinaryWriter(writer.BaseStream))
                {
                    binaryWriter.Write(instance.Quarter);
                    binaryWriter.Write(instance.Month);
                    binaryWriter.Flush();
                }
            }

public FiscalPeriod Deserialize(IColumnReader reader, ISerializationContext context)
            {
                using (var binaryReader = new BinaryReader(reader.BaseStream))
                {
var result = new FiscalPeriod(binaryReader.ReadInt16(), binaryReader.ReadInt16());
                    return result;
                }
            }
        }
    }
}
```

## Use user-defined aggregates: UDAGG
User-defined aggregates are any aggregation-related functions that aren't shipped out-of-the-box with U-SQL. The example can be an aggregate to perform custom math calculations, string concatenations, manipulations with strings, and so on.

The user-defined aggregate base class definition is as follows:

```csharp
    [SqlUserDefinedAggregate]
    public abstract class IAggregate<T1, T2, TResult> : IAggregate
    {
        protected IAggregate();

        public abstract void Accumulate(T1 t1, T2 t2);
        public abstract void Init();
        public abstract TResult Terminate();
    }
```

**SqlUserDefinedAggregate** indicates that the type should be registered as a user-defined aggregate. This class can't be inherited.

SqlUserDefinedType attribute is **optional** for UDAGG definition.


The base class allows you to pass three abstract parameters: two as input parameters and one as the result. The data types are variable and should be defined during class inheritance.

```csharp
public class GuidAggregate : IAggregate<string, string, string>
{
    string guid_agg;

    public override void Init()
    { … }

    public override void Accumulate(string guid, string user)
    { … }

    public override string Terminate()
    { … }
}
```

* **Init** invokes once for each group during computation. It provides an initialization routine for each aggregation group.
* **Accumulate** is executed once for each value. It provides the main functionality for the aggregation algorithm. It can be used to aggregate values with various data types that are defined during class inheritance. It can accept two parameters of variable data types.
* **Terminate** is executed once per aggregation group at the end of processing to output the result for each group.

To declare correct input and output data types, use the class definition as follows:

```csharp
public abstract class IAggregate<T1, T2, TResult> : IAggregate
```

* T1: First parameter to accumulate
* T2: Second parameter to accumulate
* TResult: Return type of terminate

For example:

```csharp
public class GuidAggregate : IAggregate<string, int, int>
```

or

```csharp
public class GuidAggregate : IAggregate<string, string, string>
```

### Use UDAGG in U-SQL
To use UDAGG, first define it in code-behind or reference it from the existent programmability DLL as discussed earlier.

Then use the following syntax:

```csharp
AGG<UDAGG_functionname>(param1,param2)
```

Here's an example of UDAGG:

```csharp
public class GuidAggregate : IAggregate<string, string, string>
{
    string guid_agg;

    public override void Init()
    {
        guid_agg = "";
    }

    public override void Accumulate(string guid, string user)
    {
        if (user.ToUpper()== "USER1")
        {
            guid_agg += "{" + guid + "}";
        }
    }

    public override string Terminate()
    {
        return guid_agg;
    }

}
```

And base U-SQL script:

```usql
DECLARE @input_file string = @"\usql-programmability\input_file.tsv";
DECLARE @output_file string = @" \usql-programmability\output_file.tsv";

@rs0 =
    EXTRACT
            guid string,
            dt DateTime,
            user String,
            des String
    FROM @input_file
    USING Extractors.Tsv();

@rs1 =
    SELECT
        user,
        AGG<USQL_Programmability.GuidAggregate>(guid,user) AS guid_list
    FROM @rs0
    GROUP BY user;

OUTPUT @rs1 TO @output_file USING Outputters.Text();
```

In this use-case scenario, we concatenate class GUIDs for the specific users.

## Next steps
* [U-SQL programmability guide - overview](data-lake-analytics-u-sql-programmability-guide.md)
* [U-SQL programmability guide - UDO](data-lake-analytics-u-sql-programmability-guide-UDO.md)
