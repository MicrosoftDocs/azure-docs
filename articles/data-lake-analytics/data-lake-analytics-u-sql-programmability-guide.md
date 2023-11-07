---
title: U-SQL programmability guide for Azure Data Lake
description: Learn about the U-SQL overview and UDF programmability in Azure Data Lake Analytics to enable you to create good USQL scripts.
ms.service: data-lake-analytics
ms.custom: devx-track-dotnet
ms.reviewer: whhender
ms.topic: how-to
ms.date: 01/20/2023
---

# U-SQL programmability guide overview

[!INCLUDE [retirement-flag](includes/retirement-flag.md)]

U-SQL is a query language that's designed for big data type of workloads. One of the unique features of U-SQL is the combination of the SQL-like declarative language with the extensibility and programmability that's provided by C#. In this guide, we concentrate on the extensibility and programmability of the U-SQL language that's enabled by C#.

## Requirements

Download and install [Azure Data Lake Tools for Visual Studio](https://www.microsoft.com/download/details.aspx?id=49504).

## Get started with U-SQL

Look at the following U-SQL script:

```usql
@a  =
  SELECT * FROM
    (VALUES
       ("Contoso",   1500.0, "2017-03-39"),
       ("Woodgrove", 2700.0, "2017-04-10")
    ) AS D( customer, amount, date );

@results =
  SELECT
    customer,
    amount,
    date
  FROM @a;
```

This script defines two RowSets: `@a` and `@results`. RowSet `@results` is defined from `@a`.

## C# types and expressions in U-SQL script

A U-SQL Expression is a C# expression combined with U-SQL logical operations such `AND`, `OR`, and `NOT`. U-SQL Expressions can be used with SELECT, EXTRACT, WHERE, HAVING, GROUP BY and DECLARE. For example, the following script parses a string as a DateTime value.

```usql
@results =
  SELECT
    customer,
    amount,
    DateTime.Parse(date) AS date
  FROM @a;
```

The following snippet parses a string as DateTime value in a DECLARE statement.

```usql
DECLARE @d = DateTime.Parse("2016/01/01");
```

### Use C# expressions for data type conversions

The following example demonstrates how you can do a datetime data conversion by using C# expressions. In this particular scenario, string datetime data is converted to standard datetime with midnight 00:00:00 time notation.

```usql
DECLARE @dt = "2016-07-06 10:23:15";

@rs1 =
  SELECT
    Convert.ToDateTime(Convert.ToDateTime(@dt).ToString("yyyy-MM-dd")) AS dt,
    dt AS olddt
  FROM @rs0;

OUTPUT @rs1
  TO @output_file
  USING Outputters.Text();
```

### Use C# expressions for today’s date

To pull today's date, we can use the following C# expression: `DateTime.Now.ToString("M/d/yyyy")`

Here's an example of how to use this expression in a script:

```usql
@rs1 =
  SELECT
    MAX(guid) AS start_id,
    MIN(dt) AS start_time,
    MIN(Convert.ToDateTime(Convert.ToDateTime(dt<@default_dt?@default_dt:dt).ToString("yyyy-MM-dd"))) AS start_zero_time,
    MIN(USQL_Programmability.CustomFunctions.GetFiscalPeriod(dt)) AS start_fiscalperiod,
    DateTime.Now.ToString("M/d/yyyy") AS Nowdate,
    user,
    des
  FROM @rs0
  GROUP BY user, des;
```
## Using .NET assemblies

U-SQL’s extensibility model relies heavily on the ability to add custom code from .NET assemblies.

### Register a .NET assembly

Use the `CREATE ASSEMBLY` statement to place a .NET assembly into a U-SQL Database. Afterwards, U-SQL scripts can use those assemblies by using the `REFERENCE ASSEMBLY` statement.

The following code shows how to register an assembly:

```usql
CREATE ASSEMBLY MyDB.[MyAssembly]
   FROM "/myassembly.dll";
```

The following code shows how to reference an assembly:

```usql
REFERENCE ASSEMBLY MyDB.[MyAssembly];
```

Consult the [assembly registration instructions](/archive/blogs/azuredatalake/how-to-register-u-sql-assemblies-in-your-u-sql-catalog) that covers this topic in greater detail.


### Use assembly versioning
Currently, U-SQL uses the .NET Framework version 4.7.2. So ensure that your own assemblies are compatible with that version of the runtime.

As mentioned earlier, U-SQL runs code in a 64-bit (x64) format. So make sure that your code is compiled to run on x64. Otherwise you get the incorrect format error shown earlier.

Each uploaded assembly DLL and resource file, such as a different runtime, a native assembly, or a config file, can be at most 400 MB. The total size of deployed resources, either via DEPLOY RESOURCE or via references to assemblies and their other files, can't exceed 3 GB.

Finally, each U-SQL database can only contain one version of any given assembly. For example, if you need both version 7 and version 8 of the NewtonSoft Json.NET library, you need to register them in two different databases. Furthermore, each script can only refer to one version of a given assembly DLL. In this respect, U-SQL follows the C# assembly management and versioning semantics.

## Use user-defined functions: UDF
U-SQL user-defined functions, or UDF, are programming routines that accept parameters, perform an action (such as a complex calculation), and return the result of that action as a value. The return value of UDF can only be a single scalar. U-SQL UDF can be called in U-SQL base script like any other C# scalar function.

We recommend that you initialize U-SQL user-defined functions as **public** and **static**.

```usql
public static string MyFunction(string param1)
{
    return "my result";
}
```

First let’s look at the simple example of creating a UDF.

In this use-case scenario, we need to determine the fiscal period, including the fiscal quarter and fiscal month of the first sign-in for the specific user. The first fiscal month of the year in our scenario is June.

To calculate fiscal period, we introduce the following C# function:

```usql
public static string GetFiscalPeriod(DateTime dt)
{
    int FiscalMonth=0;
    if (dt.Month < 7)
    {
        FiscalMonth = dt.Month + 6;
    }
    else
    {
        FiscalMonth = dt.Month - 6;
    }

    int FiscalQuarter=0;
    if (FiscalMonth >=1 && FiscalMonth<=3)
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

    return "Q" + FiscalQuarter.ToString() + ":P" + FiscalMonth.ToString();
}
```

It simply calculates fiscal month and quarter and returns a string value. For June, the first month of the first fiscal quarter, we use "Q1:P1". For July, we use "Q1:P2", and so on.

This is a regular C# function that we're going to use in our U-SQL project.

Here's how the code-behind section looks in this scenario:

```usql
using Microsoft.Analytics.Interfaces;
using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace USQL_Programmability
{
    public class CustomFunctions
    {
        public static string GetFiscalPeriod(DateTime dt)
        {
            int FiscalMonth=0;
            if (dt.Month < 7)
            {
                FiscalMonth = dt.Month + 6;
            }
            else
            {
                FiscalMonth = dt.Month - 6;
            }

            int FiscalQuarter=0;
            if (FiscalMonth >=1 && FiscalMonth<=3)
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

            return "Q" + FiscalQuarter.ToString() + ":" + FiscalMonth.ToString();
        }
    }
}
```

Now we're going to call this function from the base U-SQL script. To do this, we have to provide a fully qualified name for the function, including the namespace, which in this case is NameSpace.Class.Function(parameter).
```usql
USQL_Programmability.CustomFunctions.GetFiscalPeriod(dt)
```

Following is the actual U-SQL base script:
```usql
DECLARE @input_file string = @"\usql-programmability\input_file.tsv";
DECLARE @output_file string = @"\usql-programmability\output_file.tsv";

@rs0 =
    EXTRACT
        guid Guid,
        dt DateTime,
        user String,
        des String
    FROM @input_file USING Extractors.Tsv();

DECLARE @default_dt DateTime = Convert.ToDateTime("06/01/2016");

@rs1 =
    SELECT
        MAX(guid) AS start_id,
        MIN(dt) AS start_time,
        MIN(Convert.ToDateTime(Convert.ToDateTime(dt<@default_dt?@default_dt:dt).ToString("yyyy-MM-dd"))) AS start_zero_time,
        MIN(USQL_Programmability.CustomFunctions.GetFiscalPeriod(dt)) AS start_fiscalperiod,
        user,
        des
    FROM @rs0
    GROUP BY user, des;

OUTPUT @rs1
    TO @output_file
    USING Outputters.Text();
```

Following is the output file of the script execution:

```output
0d8b9630-d5ca-11e5-8329-251efa3a2941,2016-02-11T07:04:17.2630000-08:00,2016-06-01T00:00:00.0000000,"Q3:8","User1",""

20843640-d771-11e5-b87b-8b7265c75a44,2016-02-11T07:04:17.2630000-08:00,2016-06-01T00:00:00.0000000,"Q3:8","User2",""

301f23d2-d690-11e5-9a98-4b4f60a1836f,2016-02-11T09:01:33.9720000-08:00,2016-06-01T00:00:00.0000000,"Q3:8","User3",""
```

This example demonstrates a simple usage of inline UDF in U-SQL.

### Keep state between UDF invocations
U-SQL C# programmability objects can be more sophisticated, utilizing interactivity through the code-behind global variables. Let’s look at the following business use-case scenario.

In large organizations, users can switch between varieties of internal applications. These can include Microsoft Dynamics CRM, Power BI, and so on. Customers might want to apply a telemetry analysis of how users switch between different applications, what the usage trends are, and so on. The goal for the business is to optimize application usage. They also might want to combine different applications or specific sign-on routines.

To achieve this goal, we have to determine session IDs and lag time between the last session that occurred.

We need to find a previous sign-in and then assign this sign-in to all sessions that are being generated to the same application. The first challenge is that U-SQL base script doesn't allow us to apply calculations over already-calculated columns with LAG function. The second challenge is that we have to keep the specific session for all sessions within the same time period.

To solve this problem, we use a global variable inside a code-behind section: `static public string globalSession;`.

This global variable is applied to the entire rowset during our script execution.

Here's the code-behind section of our U-SQL program:

```csharp
using Microsoft.Analytics.Interfaces;
using Microsoft.Analytics.Types.Sql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace USQLApplication21
{
    public class UserSession
    {
        static public string globalSession;
        static public string StampUserSession(string eventTime, string PreviousRow, string Session)
        {

            if (!string.IsNullOrEmpty(PreviousRow))
            {
                double timeGap = Convert.ToDateTime(eventTime).Subtract(Convert.ToDateTime(PreviousRow)).TotalMinutes;
                if (timeGap <= 60) {return Session;}
                else {return Guid.NewGuid().ToString();}
            }
            else {return Guid.NewGuid().ToString();}

        }

        static public string getStampUserSession(string Session)
        {
            if (Session != globalSession && !string.IsNullOrEmpty(Session)) { globalSession = Session; }
            return globalSession;
        }

    }
}
```

This example shows the global variable `static public string globalSession;` used inside the `getStampUserSession` function and getting reinitialized each time the Session parameter is changed.

The U-SQL base script is as follows:

```usql
DECLARE @in string = @"\UserSession\test1.tsv";
DECLARE @out1 string = @"\UserSession\Out1.csv";
DECLARE @out2 string = @"\UserSession\Out2.csv";
DECLARE @out3 string = @"\UserSession\Out3.csv";

@records =
    EXTRACT DataId string,
            EventDateTime string,
            UserName string,
            UserSessionTimestamp string

    FROM @in
    USING Extractors.Tsv();

@rs1 =
    SELECT
        EventDateTime,
        UserName,
        LAG(EventDateTime, 1)
            OVER(PARTITION BY UserName ORDER BY EventDateTime ASC) AS prevDateTime,
        string.IsNullOrEmpty(LAG(EventDateTime, 1)
            OVER(PARTITION BY UserName ORDER BY EventDateTime ASC)) AS Flag,
        USQLApplication21.UserSession.StampUserSession
           (
                EventDateTime,
                LAG(EventDateTime, 1) OVER(PARTITION BY UserName ORDER BY EventDateTime ASC),
                LAG(UserSessionTimestamp, 1) OVER(PARTITION BY UserName ORDER BY EventDateTime ASC)
           ) AS UserSessionTimestamp
    FROM @records;

@rs2 =
    SELECT
        EventDateTime,
        UserName,
        LAG(EventDateTime, 1)
        OVER(PARTITION BY UserName ORDER BY EventDateTime ASC) AS prevDateTime,
        string.IsNullOrEmpty( LAG(EventDateTime, 1) OVER(PARTITION BY UserName ORDER BY EventDateTime ASC)) AS Flag,
        USQLApplication21.UserSession.getStampUserSession(UserSessionTimestamp) AS UserSessionTimestamp
    FROM @rs1
    WHERE UserName != "UserName";

OUTPUT @rs2
    TO @out2
    ORDER BY UserName, EventDateTime ASC
    USING Outputters.Csv();
```

Function `USQLApplication21.UserSession.getStampUserSession(UserSessionTimestamp)` is called here during the second memory rowset calculation. It passes the `UserSessionTimestamp` column and returns the value until `UserSessionTimestamp` has changed.

The output file is as follows:

```output
"2016-02-19T07:32:36.8420000-08:00","User1",,True,"72a0660e-22df-428e-b672-e0977007177f"
"2016-02-17T11:52:43.6350000-08:00","User2",,True,"4a0cd19a-6e67-4d95-a119-4eda590226ba"
"2016-02-17T11:59:08.8320000-08:00","User2","2016-02-17T11:52:43.6350000-08:00",False,"4a0cd19a-6e67-4d95-a119-4eda590226ba"
"2016-02-11T07:04:17.2630000-08:00","User3",,True,"51860a7a-1610-4f74-a9ea-69d5eef7cd9c"
"2016-02-11T07:10:33.9720000-08:00","User3","2016-02-11T07:04:17.2630000-08:00",False,"51860a7a-1610-4f74-a9ea-69d5eef7cd9c"
"2016-02-15T21:27:41.8210000-08:00","User3","2016-02-11T07:10:33.9720000-08:00",False,"4d2bc48d-bdf3-4591-a9c1-7b15ceb8e074"
"2016-02-16T05:48:49.6360000-08:00","User3","2016-02-15T21:27:41.8210000-08:00",False,"dd3006d0-2dcd-42d0-b3a2-bc03dd77c8b9"
"2016-02-16T06:22:43.6390000-08:00","User3","2016-02-16T05:48:49.6360000-08:00",False,"dd3006d0-2dcd-42d0-b3a2-bc03dd77c8b9"
"2016-02-17T16:29:53.2280000-08:00","User3","2016-02-16T06:22:43.6390000-08:00",False,"2fa899c7-eecf-4b1b-a8cd-30c5357b4f3a"
"2016-02-17T16:39:07.2430000-08:00","User3","2016-02-17T16:29:53.2280000-08:00",False,"2fa899c7-eecf-4b1b-a8cd-30c5357b4f3a"
"2016-02-17T17:20:39.3220000-08:00","User3","2016-02-17T16:39:07.2430000-08:00",False,"2fa899c7-eecf-4b1b-a8cd-30c5357b4f3a"
"2016-02-19T05:23:54.5710000-08:00","User3","2016-02-17T17:20:39.3220000-08:00",False,"6ca7ed80-c149-4c22-b24b-94ff5b0d824d"
"2016-02-19T05:48:37.7510000-08:00","User3","2016-02-19T05:23:54.5710000-08:00",False,"6ca7ed80-c149-4c22-b24b-94ff5b0d824d"
"2016-02-19T06:40:27.4830000-08:00","User3","2016-02-19T05:48:37.7510000-08:00",False,"6ca7ed80-c149-4c22-b24b-94ff5b0d824d"
"2016-02-19T07:27:37.7550000-08:00","User3","2016-02-19T06:40:27.4830000-08:00",False,"6ca7ed80-c149-4c22-b24b-94ff5b0d824d"
"2016-02-19T19:35:40.9450000-08:00","User3","2016-02-19T07:27:37.7550000-08:00",False,"3f385f0b-3e68-4456-ac74-ff6cef093674"
"2016-02-20T00:07:37.8250000-08:00","User3","2016-02-19T19:35:40.9450000-08:00",False,"685f76d5-ca48-4c58-b77d-bd3a9ddb33da"
"2016-02-11T09:01:33.9720000-08:00","User4",,True,"9f0cf696-c8ba-449a-8d5f-1ca6ed8f2ee8"
"2016-02-17T06:30:38.6210000-08:00","User4","2016-02-11T09:01:33.9720000-08:00",False,"8b11fd2a-01bf-4a5e-a9af-3c92c4e4382a"
"2016-02-17T22:15:26.4020000-08:00","User4","2016-02-17T06:30:38.6210000-08:00",False,"4e1cb707-3b5f-49c1-90c7-9b33b86ca1f4"
"2016-02-18T14:37:27.6560000-08:00","User4","2016-02-17T22:15:26.4020000-08:00",False,"f4e44400-e837-40ed-8dfd-2ea264d4e338"
"2016-02-19T01:20:31.4800000-08:00","User4","2016-02-18T14:37:27.6560000-08:00",False,"2136f4cf-7c7d-43c1-8ae2-08f4ad6a6e08"
```

This example demonstrates a more complicated use-case scenario in which we use a global variable inside a code-behind section that's applied to the entire memory rowset.

## Next steps
* [U-SQL programmability guide - UDT and UDAGG](data-lake-analytics-u-sql-programmability-guide-UDT-AGG.md)
* [U-SQL programmability guide - UDO](data-lake-analytics-u-sql-programmability-guide-UDO.md)
