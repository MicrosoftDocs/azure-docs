<properties
	pageTitle="Select rows to migrate by using a filter function (Stretch Database) | Microsoft Azure"
	description="Learn how to select rows to migrate by using a filter function."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/28/2016"
	ms.author="douglasl"/>

# Select rows to migrate by using a filter function (Stretch Database)

If you store cold data in a separate table, you can configure Stretch Database to migrate the entire table. If your table contains both hot and cold data, on the other hand, you can specify a filter function to select the rows to migrate. The filter predicate is an inline table\-valued function. This topic describes how to write an inline table\-valued function to select rows to migrate.

>   [AZURE.NOTE] If you provide a filter function that performs poorly, data migration also performs poorly. Stretch Database applies the filter function to the table by using the CROSS APPLY operator.

If you don't specify a filter function, the entire table is migrated.

When you run the Enable Database for Stretch Wizard, you can migrate an entire table or you can specify a simple filter function in the wizard. If you want to use a different type of filter function to select rows to migrate, do one of the following things.

-   Exit the wizard and run the ALTER TABLE statement to enable Stretch for the table and to specify a filter function.

-   Run the ALTER TABLE statement to specify a filter function after you exit the wizard.

The ALTER TABLE syntax for adding a function is described later in this topic.

## Basic requirements for the filter function
The inline table\-valued function required for a Stretch Database filter predicate looks like the following example.

```tsql
CREATE FUNCTION dbo.fn_stretchpredicate(@column1 datatype1, @column2 datatype2 [, ...n])
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE <predicate>
```
The parameters for the function have to be identifiers for columns from the table.

Schema binding is required to prevent columns that are used by the filter function from being dropped or altered.

### Return value
If the function returns a non\-empty result, the row is eligible to be migrated. Otherwise \- that is, if the function doesn't return a result \- the row is not eligible to be migrated.

### Conditions
The &lt;*predicate*&gt; can consist of one condition, or of multiple conditions joined with the AND logical operator.

```
<predicate> ::= <condition> [ AND <condition> ] [ ...n ]
```
Each condition in turn can consist of one primitive condition, or of multiple primitive conditions joined with the OR logical operator.

```
<condition> ::= <primitive_condition> [ OR <primitive_condition> ] [ ...n ]
```

### Primitive conditions
A primitive condition can do one of the following comparisons.

```
<primitive_condition> ::=
{
<function_parameter> <comparison_operator> constant
| <function_parameter> { IS NULL | IS NOT NULL }
| <function_parameter> IN ( constant [ ,...n ] )
}
```

-   Compare a function parameter to a constant expression. For example, `@column1 < 1000`.

    Here's an example that checks whether the value of a *date* column is &lt; 1/1/2016.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate(@column1 datetime)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 < CONVERT(datetime, '1/1/2016', 101)
    GO

    ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
    	FILTER_PREDICATE = dbo.fn_stretchpredicate(date),
    	MIGRATION_STATE = OUTBOUND
    ) )
    ```

-   Apply the IS NULL or IS NOT NULL operator to a function parameter.

-   Use the IN operator to compare a function parameter to a list of constant values.

    Here's an example that checks whether the value of a *shipment\_status*  column is `IN (N'Completed', N'Returned', N'Cancelled')`.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate(@column1 nvarchar(15))
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 IN (N'Completed', N'Returned', N'Cancelled')
    GO

    ALTER TABLE table1 SET ( REMOTE_DATA_ARCHIVE = ON (
    	FILTER_PREDICATE = dbo.fn_stretchpredicate(shipment_status),
    	MIGRATION_STATE = OUTBOUND
    ) )
    ```

### Comparison operators
The following comparison operators are supported.

`<, <=, >, >=, =, <>, !=, !<, !>`

```
<comparison_operator> ::= { < | <= | > | >= | = | <> | != | !< | !> }
```

### Constant expressions
The constants that you use in a filter function can be any deterministic expression that can be evaluated when you define the function. Constant expressions can contain the following things.

-   Literals. For example, `N’abc’, 123`.

-   Algebraic expressions. For example, `123 + 456`.

-   Deterministic functions. For example, `SQRT(900)`.

-   Deterministic conversions that use CAST or CONVERT. For example, `CONVERT(datetime, '1/1/2016', 101)`.

### Other expressions
You can use the BETWEEN and NOT BETWEEN operators if the resulting function conforms to the rules described here after you replace the BETWEEN and NOT BETWEEN operators with the equivalent AND and OR expressions.

You can't use subqueries or non\-deterministic functions such as RAND() or GETDATE().

## Add a filter function to a table
Add a filter function to a table by running the **ALTER TABLE** statement and specifying an existing inline table\-valued function as the value of the **FILTER\_PREDICATE** parameter. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = dbo.fn_stretchpredicate(column1, column2),
	MIGRATION_STATE = <desired_migration_state>
) )
```
After you bind the function to the table as a predicate, the following things are true.

-   The next time data migration occurs, only the rows for which the function returns a non\-empty value are migrated.

-   The columns used by the function are schema bound. You can't alter these columns as long as a table is using the function as its filter predicate.

You can't drop the inline table\-valued function as long as a table is using the function as its filter predicate.

>   [AZURE.NOTE] To improve the performance of the filter function, create an index on the columns used by the function.

### Passing column names to the filter function
When you assign a filter function to a table, specify the column names passed to the filter function with a one-part name. If you specify a three-part name when you pass the column names, subsequent queries against the Stretch\-enabled table will fail.

For example, if you specify a three-part column name as shown in the following example, the statement will run successfully, but subsequent queries against the table will fail.

```tsql
ALTER TABLE SensorTelemetry
  SET ( REMOTE_DATA_ARCHIVE = ON (
    FILTER_PREDICATE=dbo.fn_stretchpredicate(dbo.SensorTelemetry.ScanDate),
    MIGRATION_STATE = OUTBOUND )
  )
```

Instead, specify the filter function with a one-part column name as shown in the following example.

```tsql
ALTER TABLE SensorTelemetry
  SET ( REMOTE_DATA_ARCHIVE = ON  (
    FILTER_PREDICATE=dbo.fn_stretchpredicate(ScanDate),
    MIGRATION_STATE = OUTBOUND )
  )
```

## <a name="addafterwiz"></a>Add a filter function after running the Wizard  

If you want use a function that you can't create in the **Enable Database for Stretch** Wizard, you can run the ALTER TABLE statement to specify a function after you exit the wizard. Before you can apply a function, however, you have to stop the data migration that's already in progress and bring back migrated data. (For more info about why this is necessary, see [Replace an existing filter function](#replacePredicate).  

1. Reverse the direction of migration and bring back the data already migrated. You can't cancel this operation after it starts. You also incur costs on Azure for outbound data transfers \(egress\). For more info, see [How Azure pricing works](https://azure.microsoft.com/pricing/details/data-transfers/).  

    ```tsql  
    ALTER TABLE <table name>  
         SET ( REMOTE_DATA_ARCHIVE ( MIGRATION_STATE = INBOUND ) ) ;   
    ```  

2. Wait for migration to finish. You can check the status in **Stretch Database Monitor** from SQL Server Management Studio, or you can query the **sys.dm_db_rda_migration_status** view. For more info, see [Monitor and troubleshoot data migration](sql-server-stretch-database-monitor.md) or [sys.dm_db_rda_migration_status](https://msdn.microsoft.com/library/dn935017.aspx).  

3. Create the filter function that you want to apply to the table.  

4. Add the function to the table and restart data migration to Azure.  

    ```tsql  
    ALTER TABLE <table name>  
        SET ( REMOTE_DATA_ARCHIVE  
            (           
                FILTER_PREDICATE = <predicate>,  
                MIGRATION_STATE = OUTBOUND  
            )  
        );   
    ```  

## Filter rows by date
The following example migrates rows where the **date** column contains a value earlier than January 1, 2016.

```tsql
-- Filter by date
--
CREATE FUNCTION dbo.fn_stretch_by_date(@date datetime2)
RETURNS TABLE
WITH SCHEMABINDING
AS
       RETURN SELECT 1 AS is_eligible WHERE @date < CONVERT(datetime2, '1/1/2016', 101)
GO
```

## Filter rows by the value in a status column
The following example migrates rows where the **status** column contains one of the specified values.

```tsql
-- Filter by status column
--
CREATE FUNCTION dbo.fn_stretch_by_status(@status nvarchar(128))
RETURNS TABLE
WITH SCHEMABINDING
AS
       RETURN SELECT 1 AS is_eligible WHERE @status IN (N'Completed', N'Returned', N'Cancelled')
GO
```

## Filter rows by using a sliding window
To filter rows by using a sliding window, keep in mind the following requirements for the filter function.

-   The function has to be deterministic. Therefore you can't create a function that automatically recalculates the sliding window as time passes.

-   The function uses schema binding. Therefore you can't simply update the function "in place" every day by calling **ALTER FUNCTION** to move the sliding window.

Start with a filter function like the following example, which migrates rows where the **systemEndTime** column contains a value earlier than January 1, 2016.

```tsql
CREATE FUNCTION dbo.fn_StretchBySystemEndTime20160101(@systemEndTime datetime2)
RETURNS TABLE
WITH SCHEMABINDING  
AS  
RETURN SELECT 1 AS is_eligible
  WHERE @systemEndTime < CONVERT(datetime2, '2016-01-01T00:00:00', 101) ;
```

Apply the filter function to the table.

```tsql
ALTER TABLE <table name>
SET (
        REMOTE_DATA_ARCHIVE = ON
                (
                        FILTER_PREDICATE = dbo.fn_StretchBySystemEndTime20160101 (SysEndTime)
                                , MIGRATION_STATE = OUTBOUND
                )
        )
;
```

When you want to update the sliding window, do the following things.

1.  Create a new function that specifies the new sliding window. The following example selects dates earlier than January 2, 2016, instead of January 1, 2016.

2.  Replace the previous filter function with the new one by calling **ALTER TABLE**, as shown in the following example.

3. Optionally, drop the previous filter function that you're no longer using by calling **DROP FUNCTION**. (This step is not shown in the example.)

```tsql
BEGIN TRAN
GO
        /*(1) Create new predicate function definition */
        CREATE FUNCTION dbo.fn_StretchBySystemEndTime20160102(@systemEndTime datetime2)
        RETURNS TABLE
        WITH SCHEMABINDING
        AS
        RETURN SELECT 1 AS is_eligible
               WHERE @systemEndTime < CONVERT(datetime2,'2016-01-02T00:00:00', 101)
        GO

        /*(2) Set the new function as the filter predicate */
        ALTER TABLE <table name>
        SET
        (
               REMOTE_DATA_ARCHIVE = ON
               (
                       FILTER_PREDICATE = dbo.fn_StretchBySystemEndTime20160102(SysEndTime),
                       MIGRATION_STATE = OUTBOUND
               )
        )
COMMIT ;
```

## More examples of valid filter functions

-   The following example combines two primitive conditions by using the AND logical operator.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate((@column1 datetime, @column2 nvarchar(15))
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
      WHERE @column1 < N'20150101' AND @column2 IN (N'Completed', N'Returned', N'Cancelled')
    GO

    ALTER TABLE table1 SET ( REMOTE_DATA_ARCHIVE = ON (
    	FILTER_PREDICATE = dbo.fn_stretchpredicate(date, shipment_status),
    	MIGRATION_STATE = OUTBOUND
    ) )
    ```

-   The following example uses several conditions and a deterministic conversion with CONVERT.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate_example1(@column1 datetime, @column2 int, @column3 nvarchar)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
        WHERE @column1 < CONVERT(datetime, '1/1/2015', 101)AND (@column2 < -100 OR @column2 > 100 OR @column2 IS NULL)AND @column3 IN (N'Completed', N'Returned', N'Cancelled')
    GO
    ```

-   The following example uses mathematical operators and functions.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate_example2(@column1 float)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 < SQRT(400) + 10
    GO
    ```

-   The following example uses the BETWEEN and NOT BETWEEN operators. This usage is valid because the resulting function conforms to the rules described here after you replace the BETWEEN and NOT BETWEEN operators with the equivalent AND and OR expressions.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate_example3(@column1 int, @column2 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 BETWEEN 0 AND 100
    			AND (@column2 NOT BETWEEN 200 AND 300 OR @column1 = 50)
    GO
    ```
    The preceding function is equivalent to the following function after you replace the BETWEEN and NOT BETWEEN operators with the equivalent AND and OR expressions.

    ```tsql
    CREATE FUNCTION dbo.fn_stretchpredicate_example4(@column1 int, @column2 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 >= 0 AND @column1 <= 100AND (@column2 < 200 OR @column2 > 300 OR @column1 = 50)
    GO
    ```

## Examples of filter functions that aren't valid

-   The following function isn't valid because it contains a non\-deterministic conversion.

    ```tsql
    CREATE FUNCTION dbo.fn_example5(@column1 datetime)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 < CONVERT(datetime, '1/1/2016')
    GO
    ```

-   The following function isn't valid because it contains a non\-deterministic function call.

    ```tsql
    CREATE FUNCTION dbo.fn_example6(@column1 datetime)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 < DATEADD(day, -60, GETDATE())
    GO
    ```

-   The following function isn't valid because it contains a subquery.

    ```tsql
    CREATE FUNCTION dbo.fn_example7(@column1 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 IN (SELECT SupplierID FROM Supplier WHERE Status = 'Defunct'))
    GO
    ```

-   The following functions aren't valid because expressions that use algebraic operators or built\-in functions must evaluate to a constant when you define the function. You can't include column references in algebraic expressions or function calls.

    ```tsql
    CREATE FUNCTION dbo.fn_example8(@column1 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE @column1 % 2 =  0
    GO

    CREATE FUNCTION dbo.fn_example9(@column1 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE SQRT(@column1) = 30
    GO
    ```

-   The following function isn't valid because it violates the rules described here  after you replace the BETWEEN operator with the equivalent AND expression.

    ```tsql
    CREATE FUNCTION dbo.fn_example10(@column1 int, @column2 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE (@column1 BETWEEN 1 AND 200 OR @column1 = 300) AND @column2 > 1000
    GO
    ```
    The preceding function is equivalent to the following function after you replace the BETWEEN operator with the equivalent AND expression. This function isn't valid because primitive conditions can only use the OR logical operator.

    ```tsql
    CREATE FUNCTION dbo.fn_example11(@column1 int, @column2 int)
    RETURNS TABLE
    WITH SCHEMABINDING
    AS
    RETURN	SELECT 1 AS is_eligible
    		WHERE (@column1 >= 1 AND @column1 <= 200 OR @column1 = 300) AND @column2 > 1000
    GO
    ```

## How Stretch Database applies the filter function
Stretch Database applies the filter function to the table and determines eligible rows by using the CROSS APPLY operator. For example:

```tsql
SELECT * FROM stretch_table_name CROSS APPLY fn_stretchpredicate(column1, column2)
```
If the function returns a non\-empty result for the row, the row is eligible to be migrated.

## <a name="replacePredicate"></a>Replace an existing filter function
You can replace a previously specified filter function by running the **ALTER TABLE** statement again and specifying a new value for the **FILTER\_PREDICATE** parameter. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = dbo.fn_stretchpredicate2(column1, column2),
	MIGRATION_STATE = <desired_migration_state>
```
The new inline table\-valued function has the following requirements.

-   The new function has to be less restrictive than the previous function.

-   All the operators that existed in the old function must exist in the new function.

-   The new function can't contain operators that don't exist in the old function.

-   The order of operator arguments can't change.

-   Only constant values that are part of a `<, <=, >, >=`  comparison can be changed in a way that makes the function less restrictive.

### Example of a valid replacement
Assume that the following function is the current filter predicate.

```tsql
CREATE FUNCTION dbo.fn_stretchpredicate_old (@column1 datetime, @column2 int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE @column1 < CONVERT(datetime, '1/1/2016', 101)
			AND (@column2 < -100 OR @column2 > 100)
GO
```
The following function is a valid replacement because the new date constant (which specifies a later cutoff date) makes the function less restrictive.

```tsql
CREATE FUNCTION dbo.fn_stretchpredicate_new (@column1 datetime, @column2 int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE @column1 < CONVERT(datetime, '2/1/2016', 101)
			AND (@column2 < -50 OR @column2 > 50)
GO
```

### Examples of replacements that aren't valid
The following function isn't a valid replacement because the new date constant (which specifies an earlier cutoff date) doesn't make the function less restrictive.

```tsql
CREATE FUNCTION dbo.fn_notvalidreplacement_1 (@column1 datetime, @column2 int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE @column1 < CONVERT(datetime, '1/1/2015', 101)
			AND (@column2 < -100 OR @column2 > 100)
GO
```
The following function isn't a valid replacement because one of the comparison operators has been removed.

```tsql
CREATE FUNCTION dbo.fn_notvalidreplacement_2 (@column1 datetime, @column2 int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE @column1 < CONVERT(datetime, '1/1/2016', 101)
			AND (@column2 < -50)
GO
```
The following function isn't a valid replacement because a new condition has been added with the AND logical operator.

```tsql
CREATE FUNCTION dbo.fn_notvalidreplacement_3 (@column1 datetime, @column2 int)
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE @column1 < CONVERT(datetime, '1/1/2016', 101)
			AND (@column2 < -100 OR @column2 > 100)
			AND (@column2 <> 0)
GO
```

## Remove a filter function from a table
To migrate the entire table instead of selected rows, remove the existing function by setting **FILTER\_PREDICATE** to null. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = NULL,
	MIGRATION_STATE = <desired_migration_state>
) )
```
After you remove the filter function, all rows in the table are eligible for migration. As a result, you cannot specify a filter function for the same table later unless you bring back all the remote data for the table from Azure first. This restriction exists to avoid the situation where rows that are not eligible for migration when you provide a new filter function have already been migrated to Azure.

## Check the filter function applied to a table
To check the filter function applied to a table, open the catalog view **sys.remote\_data\_archive\_tables** and check the value of the **filter\_predicate** column. If the value is null, the entire table is eligible for archiving. For more info, see [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx).

## Security notes for filter functions  
A compromised account with db_owner privileges can do the following things.  

-   Create and apply a table-valued function that consumes large amounts of server resources or waits for an extended period resulting in a denial of service.  

-   Create and apply a table-valued function that makes it possible to infer the content of a table for which the user has been explicitly denied read access.  

## See also

[ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx)
