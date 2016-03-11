<properties
	pageTitle="Use a Filter Predicate to Select Rows to Migrate (Stretch Database) | Microsoft Azure"
	description="Learn how to use a filter predicate to select the rows to migrate."
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
	ms.date="02/26/2016"
	ms.author="douglasl"/>

# Use a Filter Predicate to Select Rows to Migrate (Stretch Database)

If you store historical data in a separate table, you can configure Stretch Database to migrate the entire table. If your table contains both historical and current data, on the other hand, you can specify a filter predicate to select the rows to migrate. The filter predicate must call an inline table\-valued function. This topic describes how to write an inline table\-valued function to select rows to migrate.

In CTP 3.1 through RC0, the option to specify a predicate isn't available in the Enable Database for Stretch wizard. You have to use the ALTER TABLE statement to configure Stretch Database with this option. For more info, see [ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx).

If you don't specify a filter predicate, the entire table is migrated.

> [!IMPORTANT]
> If you provide a filter predicate that performs poorly, data migration also performs poorly. Stretch Database applies the filter predicate to the table by using the CROSS APPLY operator.

## Basic requirements for the inline table\-valued function
The inline table\-valued function required for a Stretch Database filter function looks like the following example.

```tsql
CREATE FUNCTION dbo.fn_stretchpredicate(@column1 datatype1, @column2 datatype2 [, ...n])
RETURNS TABLE
WITH SCHEMABINDING
AS
RETURN	SELECT 1 AS is_eligible
		WHERE <predicate>
```
The parameters for the function have to be identifiers for columns from the table.

Schema binding is required to prevent columns that are used by the filter predicate from being dropped or altered.

### Return value
If the function returns a non\-empty result, the row is eligible to be migrated; otherwise \- that is, if the function doesn't return any rows \- the row is not eligible to be migrated.

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

    Here's an example that checks whether the value of a *date* column is &lt; 1\/1\/2016.

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
The constants that you use in a filter predicate can be any deterministic expression that can be evaluated when you define the function. Constant expressions can contain the following things.

-   Literals. For example, `N’abc’, 123`.

-   Algebraic expressions. For example, `123 + 456`.

-   Deterministic functions. For example, `SQRT(900)`.

-   Deterministic conversions that use CAST or CONVERT. For example, `CONVERT(datetime, '1/1/2016', 101)`.

### Other expressions
You can use the BETWEEN and NOT BETWEEN operators if the resulting predicate conforms to the rules described here after you replace the BETWEEN and NOT BETWEEN operators with the equivalent AND and OR expressions.

You can't use subqueries or non\-deterministic functions such as RAND() or GETDATE().

## Examples of valid functions

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

-   The following example uses the the BETWEEN and NOT BETWEEN operators. This usage is valid because the resulting predicate conforms to the rules described here after you replace the BETWEEN and NOT BETWEEN operators with the equivalent AND and OR expressions.

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

## Examples of functions that aren't valid

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

## How Stretch Database applies the filter predicate
Stretch Database applies the filter predicate to the table and determines eligible rows by using the CROSS APPLY operator. For example:

```tsql
SELECT * FROM stretch_table_name CROSS APPLY fn_stretchpredicate(column1, column2)
```
If the function returns a non\-empty result for the row, the row is eligible to be migrated.

## Add a filter predicate to a table
Add a filter predicate to a table by running the ALTER TABLE statement and specifying an existing inline table\-valued function as the value of the FILTER\_PREDICATE parameter. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = dbo.fn_stretchpredicate(column1, column2),
	MIGRATION_STATE = <desired_migration_state>
) )
```
After you bind the function to the table as a predicate, the following things are true.

-   The next time data migration occurs, only the rows for which the function returns a non\-empty value are migrated.

-   The columns used by the function are schema bound. You can't alter these columns as long as a table is using the function as its filter predicate.

## Remove a filter predicate from a table
To migrate the entire table instead of selected rows, remove the existing FILTER\_PREDICATE by setting it to null. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = NULL,
	MIGRATION_STATE = <desired_migration_state>
) )
```
After you remove the filter predicate,  all rows in the table are eligible for migration.

## Replace an existing filter predicate
You can replace a previously specified filter predicate by running the ALTER TABLE statement again and specifying a new value for the FILTER\_PREDICATE parameter. For example:

```tsql
ALTER TABLE stretch_table_name SET ( REMOTE_DATA_ARCHIVE = ON (
	FILTER_PREDICATE = dbo.fn_stretchpredicate2(column1, column2),
	MIGRATION_STATE = <desired_migration_state>
```
The new inline table\-valued function has the following requirements.

-   The new function has to be less restrictive than the previous function.

-   All the operators that existed in the old function must exist in the new function.

-   The new function can't contain operators that don’t exist in the old function.

-   The order of operator arguments can't change.

-   Only constant values that are part of a `<, <=, >, >=`  comparison can be changed in a way that makes the predicate less restrictive.

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
The following function is a valid replacement because the new date constant (which specifies a later cutoff date) makes the predicate less restrictive.

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
The following function isn't a valid replacement because the new date constant (which specifies an earlier cutoff date) doesn't make the predicate less restrictive.

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

## Drop a filter predicate
You can't drop the inline table\-valued function as long as a table is using the function as its filter predicate.

## Check the filter predicate applied to a table
To check the filter predicate applied to a table, open the catalog view **sys.remote\_data\_archive\_tables** and check the value of the **filter\_predicate** column. If the value is null, the entire table is eligible for archiving. For more info, see [sys.remote_data_archive_tables (Transact-SQL)](https://msdn.microsoft.com/library/dn935003.aspx).

## See also

[ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx)
