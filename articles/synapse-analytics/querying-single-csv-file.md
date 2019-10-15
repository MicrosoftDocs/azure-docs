---
title: Querying single CSV file #Required; update as needed page title displayed in search results. Include the brand.
description: CSV files may have different formats. In this section, we will show how to query single CSV file with different file formats. #Required; Add article description that is displayed in search results.
services: sql-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Querying single CSV file 

CSV files may have different formats. In this section, we will show how to query single CSV file with different file formats: with and without header row, comma and tab delimited values, Windows and Unix style line endings, non-quoted and quoted values, and escaping characters.
<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

In this quickstart, you will query a single CSV file.

If you don’t have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because quickstarts are intended to help new customers use a subscription to quickly try out a specific product/service, include a link to a free trial before the first H2, if one exists. You can find listed examples in [Write quickstarts](contribute-how-to-mvc-quickstart.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

## Prerequisites

Before reading rest of the article make sure to check following articles:
- [First time setup](query-data-in-storage.md#First-time-setup)
- [Prerequisites](query-data-in-storage.md#Prerequisites)


## Before you begin
> Please note that all URIs in sample queries are using storage account located in North Europe Azure region. **If your endpoint is located in West US region, please change URI** to point to *partystoragewestus* storage account.
>
> Please make sure that you created appropriate credential for your region. Run this query and make sure storage account in your region is listed:

```sql
SELECT name
FROM sys.credentials 
WHERE 
	name = 'https://sqlondemandstorage.blob.core.windows.net/csv'
```

If you can't find appropriate credential, please check [First time setup](query-data-in-storage.md#First-Time-Setup).

## Read CSV file - no header row, Windows style new line

Following query shows how to read CSV file without header row, with Windows-style new line and comma delimited columns.

File preview:

![First ten rows of the CSV file without header, Windows style new line.](./media/querying-single-csv-file/population.png)


```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/population.csv',
 		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '\n'
	)
WITH (
	[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
	[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
	[year] smallint,
	[population] bigint
) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```

## Read CSV file - no header row, Unix-style new line

Following query shows how to read file without header row, with Unix-style new line and comma delimited columns. Note different location of file comparing to other examples.

File preview:

![First ten rows of the CSV file without header row and with Unix-Style new line.](./media/querying-single-csv-file/population-unix.png)

```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population-unix/population.csv', 
		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '0x0a'
	)
WITH (
	[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
	[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
	[year] smallint,
	[population] bigint
) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```



## Read CSV file - header row, Unix-style new line

Following query shows how to read file with header row, with Unix-style new line and comma delimited columns. Note different location of file comparing to other examples.

File preview:

![First ten rows of the CSV file with header row and with Unix-Style new line.](./media/querying-single-csv-file/population-unix-hdr.png)


```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population-unix-hdr/population.csv',
		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '0x0a', 
		FIRSTROW = 2
	)
    WITH (
        [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
        [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
        [year] smallint,
        [population] bigint
    ) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```



## Read CSV file - header row, Unix-style new line, quoted

Following query shows how to read file with header row, with Unix-style new line, comma delimited columns and quoted values. Note different location of file comparing to other examples.

File preview:

![First ten rows of the CSV file with header row and with Unix-Style new line and quoted values.](./media/querying-single-csv-file/population-unix-hdr-quoted.png)

```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population-unix-hdr-quoted/population.csv',
		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '0x0a', 
		FIRSTROW = 2,
		FIELDQUOTE = '"'
	)
    WITH (
        [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
        [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
        [year] smallint,
        [population] bigint
    ) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```

> Note that this query would return same results if we omit FIELDQUOTE parameter since default value for FIELDQUOTE is double-quote.



## Read CSV file - header row, Unix-style new line, escape

Following query shows how to read file with header row, with Unix-style new line, comma delimited columns and escape char used for field delimiter (comma) within values. Note different location of file comparing to other examples.

File preview:

![First ten rows of the CSV file with header row and with Unix-Style new line and escape char used for field delimiter.](./media/querying-single-csv-file/population-unix-hdr-escape.png)

```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population-unix-hdr-escape/population.csv',
		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '0x0a', 
		FIRSTROW = 2,
		ESCAPECHAR = '\\'
	)
    WITH (
        [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
        [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
        [year] smallint,
        [population] bigint
    ) AS [r]
WHERE 
	country_name = 'Slov,enia' 
```

> Note that this query would fail if ESCAPECHAR is not specified, since comma in "Slov,enia" would be treated as field delimiter instead of part of country name. "Slov,enia" would be treated as two columns, therefore particular row would have one column more than other rows and one column more than we defined in WITH clause.



## Read CSV file - header row, Unix-style new line, tab-delimited

Following query shows how to read file with header row, with Unix-style new line and tab delimited columns. Note different location of file comparing to other examples.

File preview:

![First ten rows of the CSV file with header row and with Unix-Style new line and tab delimiter.](./media/querying-single-csv-file/population-unix-hdr-tsv.png)

```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population-unix-hdr-tsv/population.csv',
		FORMAT = 'CSV', 
		FIELDTERMINATOR ='\t', 
		ROWTERMINATOR = '0x0a', 
		FIRSTROW = 2
	)
	WITH (
		[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
		[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
		[year] smallint,
		[population] bigint
	) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```



## Read CSV file - without specifying all columns

So far, we specified CSV file schema using WITH and listing all columns. You can specify only columns you actually need in your query by specifying ordinal number for each column you are interested in while omitting columns of no interest.

Following query returns number of distinct country names in file, specifying only columns that are actually needed:

> Please take a look at WITH clause in query below and note that there is "2" (without quotes) at the end of row where we define *[country_name]* column. It means that *[country_name]* column is second column in the file. Query will ignore all columns in file except the second one.

```sql
SELECT 
	COUNT(DISTINCT country_name) AS countries
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/population.csv',
 		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '\n'
	)
WITH (
	--[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
	[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2 2
	--[year] smallint,
	--[population] bigint
) AS [r]
```



## Next steps

You can see more in [Querying folders and multiple CSV files](querying-folders-and-multiple-csv-files.md).


Advance to the next article to learn how query folders and multiple CSV files.
> [!div class="nextstepaction"]
> [Querying folders and multiple CSV files](querying-folders-and-multiple-csv-files.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->