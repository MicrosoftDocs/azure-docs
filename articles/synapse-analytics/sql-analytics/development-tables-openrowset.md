---
title: Using OPENROWSET in SQL Analytics #Required; update as needed page title displayed in search results. Include the brand.
description: #Required; Add article description that is displayed in search results.
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: filippopovic #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/21/2019 #Update with current date; mm/dd/yyyy format.
ms.author: fipopovi #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Using OPENROWSET in SQL Analytics
The OPENROWSET bulk rowset provider is accessed by calling the OPENROWSET function and specifying the BULK option. The OPENROWSET(BULK...) function allows you to access files in Azure Storage. 

The `OPENROWSET` function can be referenced in the FROM clause of a query as if it were a table name. `OPENROWSET`. It supports bulk operations through a built-in BULK provider that enables data from a file to be read and returned as a rowset.

OPENROWSET is currently not supported in SQL Analytics pool.

## Syntax

```
--OPENROWSET syntax for reading Parquet files
OPENROWSET  
( { BULK 'unstructured_data_path' , 
    FORMAT=’PARQUET’ }  
)  
[WITH ( {'column_name' 'column_type' [ 'column_ordinal'] }) ]
[AS] table_alias(column_alias,...n)

--OPENROWSET syntax for reading delimited text files
OPENROWSET  
( { BULK 'unstructured_data_path' , 
    FORMAT = ‘CSV’
    [ <bulk_options> ] }  
)  
WITH ( {'column_name' 'column_type' [ 'column_ordinal'] })  
[AS] table_alias(column_alias,...n)
 
<bulk_options> ::=  
[ , FIELDTERMINATOR = 'char' ]    
[ , ROWTERMINATOR = 'char’ ] 
[ , ESCAPE_CHAR = 'char' ] 
[ , FIRSTROW = first_row  ]     
[ , FIELDQUOTE = 'quote_characters']
```

**Arguments** 

unstructured_data_path 

Fully qualified or relative path to ADLS or Azure Blob location in form of string literal, e.g. “/rootfolder/2017/10/daily_feed.csv” 

 

column_name 

Name for the output column. If provided, this name overrides the column name in the source file. 

 

column_type 

Data type for the output column. The implicit data type conversion will take place here. 

 

column_ordinal 

Ordinal number of the column in the source file(s). 

 

FORMAT 

Format of the input files containing data to be queried. Valid values are: 

‘CSV’ 

Covers any delimited text file with row/column separators. Any character can be used as a field separator (i.e. TSV: FIELDTERMINATOR = tab) 

 ‘PARQUET’ 

Binary file in Parquet format 

 ‘ORC’ 

Binary file in Parquet format 

 

ESCAPE_CHAR = 'char' 

Specifies the character in the file that is used to escape itself and all delimiter values in the file. If the escape character is followed by a value other than itself or any of the delimiter values, the escape character is dropped when reading the value. 

The ESCAPE_CHAR parameter will be applied regarding of whether FIELDQUOTE is enabled or not. It however will not be used to escape the quoting character. The quoting character will get escaped with double-quotes in alignment with the Excel CSV behavior. 

 

FIELDTERMINATOR **='***field_terminator***'** 
 Specifies the field terminator to be used. The default field terminator is “,” (comma character). 

 

ROWTERMINATOR **='***row_terminator***'** 
 Specifies the row terminator to be used. The default row terminator is **\r\n** (newline character). 

## Next steps

<!---Some context for the following links goes here--->
<!--- [link to next logical step for the customer](quickstart-view-occupancy.md)--->

<!--- Required:
In Overview articles, provide at least one next step and no more than three.
Next steps in overview articles will often link to a quickstart.
Use regular links; do not use a blue box link. What you link to will depend on what is really a next step for the customer.
Do not use a "More info section" or a "Resources section" or a "See also section".


--->