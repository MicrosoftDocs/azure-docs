---
title: Query acceleration SQL language reference (preview)
titleSuffix: Azure Storage
description: Learn how to use query acceleration sql syntax.
services: storage
author: normesta
ms.service: storage
ms.topic: conceptual
ms.date: 04/21/2020
ms.author: normesta
ms.subservice: data-lake-storage-gen2
ms.reviewer: ereilebr
---

# Query acceleration SQL language reference (preview)

Query acceleration supports an ANSI SQL-like language for expressing queries over blob contents.  The query acceleration SQL dialect is a subset of ANSI SQL, with a limited set of supported data types, operators, etc., but it also expands on ANSI SQL to support queries over hierarchical semi-structured data formats such as JSON. 

> [!NOTE]
> The query acceleration feature is in public preview, and is available in the Canada Central and France Central regions. To review limitations, see the [Known issues](data-lake-storage-known-issues.md) article. To enroll in the preview, see [this form](https://aka.ms/adls/qa-preview-signup). 

## SELECT Syntax

The only SQL statement supported by query acceleration is the SELECT statement. This example returns every row for which expression returns true.

```sql
SELECT * FROM table [WHERE expression] [LIMIT limit]
```

For CSV-formatted data, *table* must be `BlobStorage`.  This means that the query will run against whichever blob was specified in the REST call.
For JSON-formatted data, *table* is a "table descriptor."   See the [Table Descriptors](#table-descriptors) section of this article.

In the following example, for each row for which the WHERE *expression* returns true, this statement will return a new row that is made from evaluating each of the projection expressions.


```sql
SELECT expression [, expression …] FROM table [WHERE expression] [LIMIT limit]
```

The following example returns an aggregate computation (For example: the average value of a particular column) over each of the rows for which *expression* returns true. 

```sql
SELECT aggregate_expression FROM table [WHERE expression] [LIMIT limit]
```

The following example returns suitable offsets for splitting a CSV-formatted blob.  See the [Sys.Split](#sys-split) section of this article.

```sql
SELECT sys.split(split_size)FROM BlobStorage
```

<a id="data-types"></a>

## Data Types

|Data Type|Description|
|---------|-------------------------------------------|
|INT      |64-bit signed integer.                     |
|FLOAT    |64-bit ("double-precision") floating point.|
|STRING   |Variable-length Unicode string.            |
|TIMESTAMP|A point in time.                           |
|BOOLEAN  |True or false.                             |

When reading values from CSV-formatted data, all values are read as strings.  String values may be converted to other types using CAST expressions.  Values may be implicitly cast to other types depending on context. for more info, see [Data type precedence (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/data-types/data-type-precedence-transact-sql?view=sql-server-2017).

## Expressions

### Referencing fields

For JSON-formatted data, or CSV-formatted data with a header row, fields may be referenced by name.  Field names can be quoted or unquoted. Quoted field names are enclosed in double-quote characters ("), may contain spaces, and are case-sensitive.  Unquoted field names are case-insensitive, and may not contain any special characters.

In CSV-formatted data, fields may also be referenced by ordinal, prefixed with an underscore (_) character.  For example, the first field may be referenced as _1, or the eleventh field may be referenced as _11.  Referencing fields by ordinal is useful for CSV-formatted data that does not contain a header row, in which case the only way to reference a particular field is by ordinal.

### Operators

The following standard SQL operators are supported:

``=``, ``!=``, ``<>``, ``<``, ``<=``, ``>``, ``>=``, ``+``, ``-``, ``/``, ``*``, ``%``, ``AND``, ``OR``, ``NOT``, ``CAST``, ``BETWEEN``, ``IN``, ``NULLIF``, ``COALESCE``

If data types on the left and right of an operator are different, then automatic conversion will be performed according to the rules specified here: [Data type precedence (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/data-types/data-type-precedence-transact-sql?view=sql-server-2017).

The query acceleration SQL language supports only a very small subset of the data types discussed in that article.  See the [Data Types](#data-types) section of this article.

### Casts

The query acceleration SQL language supports the CAST operator, according to the rules here: [Data type conversion (Database Engine)](https://docs.microsoft.com/sql/t-sql/data-types/data-type-conversion-database-engine?view=sql-server-2017).  

The query acceleration SQL language supports only a tiny subset of the data types discussed in that article.  See the [Data Types](#data-types) section of this article.

### String functions

The query acceleration SQL language supports the following standard SQL string functions:

``LIKE``, ``CHAR_LENGTH``, ``CHARACTER_LENGTH``, ``LOWER``, ``UPPER``, ``SUBSTRING``, ``TRIM``, ``LEADING``, ``TRAILING``.

Here's a few examples:

|Function|Example|Result|
|---|---|---|
|CHARACTER_LENGTH|``SELECT CHARACTER_LENGTH('abcdefg') from BlobStorage`` |``7``|
|CHAR_LENGTH|``SELECT CHAR_LENGTH(_1) from BlobStorage``|``1``|
|LOWER|``SELECT LOWER('AbCdEfG') from BlobStorage``|``abcdefg``|
|UPPER|``SELECT UPPER('AbCdEfG') from BlobStorage``|``ABCDEFG``|
|SUBSTRING|``SUBSTRING('123456789', 1, 5)``|``23456``|
|TRIM|``TRIM(BOTH '123' FROM '1112211Microsoft22211122')``|``Microsoft``|

The [LIKE](https://docs.microsoft.com/sql/t-sql/language-elements/like-transact-sql?view=sql-server-ver15) function helps you to search for a pattern. Here's a few examples that use the [LIKE](https://docs.microsoft.com/sql/t-sql/language-elements/like-transact-sql?view=sql-server-ver15) function to search the data string ``abc,abd,cd\ntest,test2,test3\na_bc,xc%d^e,gh[i ``.

|Query|Example|
|--|--|
|``SELECT _1, _2, _3 from BlobStorage where _2 LIKE 'a%'``|``abc,abd,cd\n``|
|``SELECT * from BlobStorage where _1 LIKE 'a[bcd]c``|``abc,abd,cd\n``|
|``SELECT _1 from BlobStorage where _2 LIKE '[^xyz]%'``|``abc\ntest\n``|
|``SELECT * from BlobStorage where _1 LIKE 'a_``|``abc,abd,cd\n``|
|``SELECT _2,_3 from BlobStorage where _3 LIKE '[g-h]_![[a-j]' Escape '!'``|``xc%d^e,gh[i\n``|

### Date functions

The following standard SQL date functions are supported:

``DATE_ADD``, ``DATE_DIFF``, ``EXTRACT``, ``TO_STRING``, ``TO_TIMESTAMP``.

Currently we convert all the [date formats of standard IS08601](https://www.w3.org/TR/NOTE-datetime). 

#### DATE_ADD function

The query acceleration SQL language supports year, month, day, hour, minute, second for the ``DATE_ADD`` function.

Examples:

```sql
DATE_ADD(datepart, quantity, timestamp)
DATE_ADD('minute', 1, CAST('2017-01-02T03:04:05.006Z' AS TIMESTAMP)
```

#### DATE_DIFF function

The query acceleration SQL language supports year, month, day, hour, minute, second for the ``DATE_DIFF`` function.

```sql
DATE_DIFF(datepart, timestamp, timestamp)
DATE_DIFF('hour','2018-11-09T00:00+05:30','2018-11-09T01:00:23-08:00') 
```

#### EXTRACT function

For EXTRACT other than date part supported for the ``DATE_ADD`` function, the query acceleration SQL language supports timezone_hour and timezone_minute as date part.

Examples:

```sql
EXTRACT(datepart FROM timestampstring)
EXTRACT(YEAR FROM '2010-01-01T')
```

#### TO_STRING function

Examples:

```sql
TO_STRING(TimeStamp , format)
TO_STRING(CAST('1969-07-20T20:18Z' AS TIMESTAMP),  'MMMM d, y')
```

This table describes strings that you can use to specify the output format of the ``TO_STRING`` function.

|Format string    |Output                               |
|-----------------|-------------------------------------|
|yy               |Year in 2 digit format – 1999 as '99'|
|y                |Year in 4 digit format               |
|yyyy             |Year in 4 digit format               |
|M                |Month of year – 1                    |
|MM               |Zero padded Month – 01               |
|MMM              |Abbr. month of Year  -JAN            |
|MMMM             |Full month – May                      |
|d                |Day of month (1-31)                  |
|dd               |Zero padded day of Month (01-31)     |
|a                |AM or PM                             |
|h                |Hour of day (1-12)                   |
|hh               |Zero padded Hours od day (01-12)     |
|H                |Hour of day (0-23)                   |
|HH               |Zero Padded hour of Day (00-23)      |
|m                |Minute of hour (0-59)                |
|mm               |Zero padded minute (00-59)           |
|s                |Second of Minutes (0-59)             |
|ss               |Zero padded Seconds (00-59)          |
|S                |Fraction of Seconds (0.1-0.9)        |
|SS               |Fraction of Seconds (0.01-0.99)      |
|SSS              |Fraction of Seconds (0.001-0.999)    |
|X                |Offset in Hours                      |
|XX or XXXX       |Offset in hours and minutes (+0430)  |
|XXX or XXXXX     |Offset in hours and minutes (-07:00) |
|x                |Offset in hours (7)                  |
|xx or xxxx       |Offset in hour and minute (+0530)    |
|Xxx or xxxxx     |Offset in hour and minute (+05:30)   |

#### TO_TIMESTAMP function

Only IS08601 formats are supported.

Examples:

```sql
TO_TIMESTAMP(string)
TO_TIMESTAMP('2007T')
```

> [!NOTE]
> You can also use the ``UTCNOW`` function to get the system time.


## Aggregate Expressions

A SELECT statement may contain either one or more projection expressions or a single aggregate expression.  The following aggregate expressions are supported:

|Expression|Description|
|--|--|
|[COUNT(\*)](https://docs.microsoft.com/sql/t-sql/functions/count-transact-sql?view=sql-server-ver15)    |Returns the number of records which matched the predicate expression.|
|[COUNT(expression)](https://docs.microsoft.com/sql/t-sql/functions/count-transact-sql?view=sql-server-ver15)    |Returns the number of records for which expression is non-null.|
|[AVERAGE(expression)](https://docs.microsoft.com/sql/t-sql/functions/avg-transact-sql?view=sql-server-ver15)    |Returns the average of the non-null values of expression.|
|[MIN(expression)](https://docs.microsoft.com/sql/t-sql/functions/min-transact-sql?view=sql-server-ver15)    |Returns the minimum non-null value of expression.|
|[MAX(expression](https://docs.microsoft.com/sql/t-sql/functions/max-transact-sql?view=sql-server-ver15))    |Returns the maximum non-null value of expression.|
|[SUM(expression)](https://docs.microsoft.com/sql/t-sql/functions/sum-transact-sql?view=sql-server-ver15)    |Returns the sum of all non-null values of expression.|

### MISSING

The ``IS MISSING`` operator is the only non-standard that the query acceleration SQL language supports.  For JSON data, if a field is missing from a particular input record, the expression field ``IS MISSING`` will evaluate to the Boolean value true.

<a id="table-descriptors"></a>

## Table Descriptors

For CSV data, the table name is always `BlobStorage`.  For example:

```sql
SELECT * FROM BlobStorage
```

For JSON data, additional options are available:

```sql
SELECT * FROM BlobStorage[*].path
```

This allows queries over subsets of the JSON data.

For JSON queries, you can mention the path in part of the FROM clause. These paths will help to parse the subset of JSON data. These paths can reference to JSON Array and Object values.

Let's take an example to understand this in more detail.

This is our sample data:

```json
{
  "id": 1,
  "name": "mouse",
  "price": 12.5,
  "tags": [
    "wireless",
    "accessory"
  ],
  "dimensions": {
    "length": 3,
    "width": 2,
    "height": 2
  },
  "weight": 0.2,
  "warehouses": [
    {
      "latitude": 41.8,
      "longitude": -87.6
    }
  ]
}
```

You might be interested only in the `warehouses` JSON object from the above data. The `warehouses` object is a JSON array type, so you can mention this in the FROM clause. Your sample query can look something like this.

```sql
SELECT latitude FROM BlobStorage[*].warehouses[*]
```

The query gets all fields but selects only the latitude.

If you wanted to access only the `dimensions` JSON object value, you could use refer to that object in your query. For example:

```sql
SELECT length FROM BlobStorage[*].dimensions
```

This also limits your access to members of the `dimensions` object. If you want to access other members of JSON fields and inner values of JSON objects, then you might use a queries such as shown in the following example:

```sql
SELECT weight,warehouses[0].longitude,id,tags[1] FROM BlobStorage[*]
```

> [!NOTE]
> BlobStorage and BlobStorage[\*] both refer to the whole object. However, if you have a path in the FROM clause, then you'll need to use BlobStorage[\*].path

<a id="sys-split"></a>

## Sys.Split

This is a special form of the SELECT statement, which is available only for CSV-formatted data.

```sql
SELECT sys.split(split_size)FROM BlobStorage
```

Use this statement in cases where you want to download and then process CSV data records in batches. That way you can process records in parallel instead of having to download all records at one time. This statement doesn't return records from the CSV file. Instead, it returns a collection of batch sizes. You can then use each batch size to retrieve a batch of data records. 

Use the *split_size* parameter to specify the number of bytes that you want each batch to contain. For example, if you want to process only 10 MB of data at a time, you're statement would look like this: `SELECT sys.split(10485760)FROM BlobStorage` because 10 MB is equal to 10,485,760 bytes. Each batch will contain as many records as can fit into those 10 MB. 

In most cases, the size of each batch will be slightly higher than the number that you specify. That's because a batch cannot contain a partial record. If the last record in a batch starts before the end of your threshold, the batch will be larger so that it can contain the complete record. The size of the last batch will likely be smaller than the size that you specify.

>[!NOTE]
> The split_size must be at least 10 MB (10485760).

## See also

- [Azure Data Lake Storage query acceleration (preview)](data-lake-storage-query-acceleration.md)
- [Filter data by using Azure Data Lake Storage query acceleration (preview)](data-lake-storage-query-acceleration-how-to.md)

