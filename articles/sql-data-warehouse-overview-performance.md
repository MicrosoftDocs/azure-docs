<properties
   pageTitle="article-title"
   description="Article description that will be displayed on landing pages and in some search results"
   services="service-name"
   documentationCenter="dev-center-name"
   authors="GitHub-alias-of-author"
   manager="manager-alias"
   editor=""/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="Your MSFT alias or your full email address"/>

# Azure SQL Data Warehouse Performance Guidance
For guidance on how many DWUs to use and how to monitor resource utilization, please refer to Understanding the Data Warehouse Unit(DWU). This article will outline a few principles on database design and query tuning. These principles will guide you to achieve better performance with the SQL DW service. 

## Design Principles
Here are a few principles on database design for better performance. 
### Minimize Data Skew When Choosing a Distribution Column
The following best practices facilitate storing a similar number of rows in each distribution, which minimizes data skew.
#### Choose a column with high cardinality that does not have data that is heavily “skewed” – where a disproportionately large number of rows are associated with one or a very few column values

No distribution key value should have a disproportionate number of duplicates in comparison to the other distribution key values. For example, a common scenario in data warehousing is storing the clickstream data for a web site. In clickstream data, a disproportionate number of clicks can occur on only a few of the web site pages such as the Home page. If you use the web page URL as the distribution key, the table rows for each page will all be stored in the same distribution. If 30% of the clicks occur on the Home page, then 30% of the rows will all be stored in one distribution.

Conversely, a distribution column can contain values with a large number of duplicates provided there are a lot of values with a large number of duplicates. Hence, high cardinality is important. For example, if you have 10,000 values with high counts and 100,000 values with low counts, all of the values can be distributed evenly across all of the distributions.

Here's another example for why high cardinality is important. Suppose you have 80 distributions and are storing sales receipts for only 100 stores. If you use the store ID number for the distribution key, it is likely that there are not enough stores to spread the table rows evenly among the distributions. Even in the best case, where each distribution stores sales receipts for either  1 or  2 stores, some distributions would have twice as many table rows than other distributions. More likely, with only 100 different key values for 80 distributions, many distributions will end up being completely empty.

#### Choose a column that does not allow NULL, or where NULL values are as rare as any other column value
If a distribution key can be NULL, all rows with the NULL value will be stored in the same distribution. This is potentially a huge portion of rows that are skewed to the same distribution. For example, if 40% of the tables rows have NULL for the distribution key, then 40% of the table rows will be stored in the same distribution.

#### Choose an Integer column when possible
Integer columns are preferable for the distribution column rather than varchar, decimal and datetime columns. 

#### Avoid using datetime columns unless time is accurate to at least the minute
A datetime column might or might not be a good choice for the distribution column. For example, if a datetime column is accurate to the day, and typical queries access a single day or small number of days, most of the work for such queries will be restricted to a single distribution or small number of distributions, defeating the benefits of the MPP architecture.  However, if the datetime column is accurate to the minute or fraction of a second, data for even a single day query will be evenly spread across all distributions, and the column can therefore be a good choice for the distribution column.

#### Avoid choosing a key that is used as a single value in a WHERE clause
Some of the most popular queries in a sales data warehouse are queries on yesterday’s data. For example, if your query has WHERE DATE = ‘20100809’ and the table is distributed on the DATE key, the entire query will be run within one distribution. This is because all rows in the table that have the same date will be stored in the same distribution. As a result, you won’t get the benefits of parallelism.

###  Minimize Data Movement When Choosing a Distribution Column
The following best practices describe how to choose a distribution column that minimizes data movement for your workloads. 

#### Choose distribution keys that will be join keys
Choose a distribution column that is one of the join keys when queries will be joining multiple large distributed tables. This improves query performance by keeping the processing local to each distribution instead of shuffling rows amongst the distributions before processing the query. If possible, use sample queries to determine which join keys they contain. 

If you have a workload that is joining multiple large historical tables together (e.g. fact table to fact table joins), you will avoid data movement if you can join the distributed tables on their distribution keys. 

#### If possible, change an incompatible join to a compatible join by adding a predicate that uses the distribution key
In some cases, the results of a query are not altered by adding another predicate that uses the distribution key. Although this predicate is not necessary logically, it is necessary for performance. If the distribution key is in the join condition, data shuffling is not needed and each distribution can perform its portion of the join locally.

For example, imagine two tables, A and B, distributed on Postal Code, but joined together on a unique key, Address_ID. Adding the additional predicate A.Postal_Code = B.Postal_Code will not change the meaning of the query because postal code depends on the Address_ID. In other words, the following two predicates return the same results:
WHERE ( A.Address_ID = B.Address_ID )
WHERE ( A.Address_ID = B.Address_ID_ID AND A.Postal_Code = B.Postal_Code ) 
However, the second predicate will perform more efficiently because it does not require data shuffling.

#### Design your schema to encourage compatible aggregations
The best performance for aggregations occurs when the distribution column is used in the GROUP BY clause (compatible aggregation). The GROUP BY operation is performed locally on all the distributions, without requiring a shuffle move among the distributions or a partition move so the Control node can perform aggregations.

In contrast, the worst aggregation performance occurs when the distribution column is not used in the GROUP BY clause (incompatible aggregation). Each distribution moves all the rows that are part of the GROUP BY operation to the Control node. This leads to a bottleneck because the Control node must perform all the GROUP BY operations.

#### Optimize for a key frequently used in Distinct Count
For example, if SELECT COUNT (DISTINCT Customer_ID) FROM T WHERE ... is used frequently, there will be performance benefits if Customer_ID is the distribution key. 

#### Choose a column with static values
Remember, that you cannot update values in the distribution column. If you need to update a value, you can delete the row and insert a new row with the updated value.

###  None of the Existing Columns Are a Good Choice for the Distribution Column
Sometimes none of the columns in the table seem to be a good choice for the distribution columns. That’s okay. These are recommendations for choosing the distribution column when that happens.

#### Look for less obvious columns, like those with a timestamp
If you cannot find an “obvious” uniform column to distribute on, then look for less obvious columns like those with a timestamp. While it is true that we want to be careful about distributing on a chronological column (such as DATE), timestamps that go down to the millisecond have proven to be excellent candidates for distribution because in the business/scientific world data arrive in a continuous flow. They already exist in the table and can easily be tested with no change to ETL/ELT. However, remember that this strategy will probably result in distribution-incompatible joins.

#### Consider creating a new column that combines two columns
If there are no obvious columns and you don’t have a good timestamp column, then consider introducing a new column that combines two columns together to provide a uniform distribution (a composite distribution). This will require loading a sample amount of data into the “original table” and then performing data analysis, but it won’t take you very long to determine if you can merge two columns into a distribution column. Be careful not to make your composite column too large since distributed tables are the largest in the system, you don’t want to take up too much space. Also be sure to choose columns that cannot be updated since you won’t be able to easily redistribute the rows that change (you cannot update a distribution column). Obviously, this strategy will affect your ETL/ELT processing, but the changes need not be very intrusive and are easily implemented.

#### Consider using a unique key or increasing integer
If no other effective distribution keys are present in a table that provide an even distribution of data, consider using a unique key (if one exists) or even an increasing integer value associated with each row, generated during data loading operations. 

You can introduce an integer column in the ETL/ELT process or by using a ROW_NUMBER function.  This guarantees a uniform distribution, but remember all queries will result in distribution-incompatible joins. You can test your hypothesis by using CTAS and the ROW_NUMBER function to create a sample table, run a representative sampling of the customer’s queries and see what the DSQL plans look like (i.e. look at the number of shufflemove steps and drill into them to see the number of rows re-distributed per distribution).

#### As a final resort, consider redesigning the schema
As a final resort, consider redesigning the schema entirely to make it more MPP friendly. I can honestly say that, in all my travels in the last 7 years, I’ve only had to do this once, but the client had an impossibly bad design to begin with.

## Tuning Queries
To view the query plan, use the EXPLAIN command. This will allow you to see what steps the query will process without running the query. For more information, see the following: 

### Understanding Query Plans
User-submitted SQL queries are processed by the Control node. The Control node engine parses the query and creates a query plan that defines the sequence of operations it will use to run the query on the appliance. The Control node distributed query plan operations run serially. When a query plan operation uses multiple parallel operations, the SQL Server PDW engine waits for all parallel operations to complete before starting the next distributed query plan operation. 
(This is where we show the Query Execution Sequence diagram in CHM file.)
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Query Execution Sequence")
### EXPLAIN
The command EXPLAIN returns the query plan for a SQL statement without running the statement. Use EXPLAIN to preview which operations will require data movement and to view the estimated costs of the query operations. 
#### Examples
``` SQL
USE AdventureWorksPDW2012;
EXPLAIN 
    SELECT CAST (AVG(YearlyIncome) AS int) AS AverageIncome, 
        CAST(AVG(FIS.SalesAmount) AS int) AS AverageSales, 
        G.StateProvinceName, T.SalesTerritoryGroup
    FROM dbo.DimGeography AS G
    JOIN dbo.DimSalesTerritory AS T
        ON G.SalesTerritoryKey = T.SalesTerritoryKey
    JOIN dbo.DimCustomer AS C
        ON G.GeographyKey = C.GeographyKey
    JOIN dbo.FactInternetSales AS FIS
        ON C.CustomerKey = FIS.CustomerKey
    WHERE T.SalesTerritoryGroup IN ('North America', 'Pacific')
        AND Gender = 'F'
    GROUP BY G.StateProvinceName, T.SalesTerritoryGroup
    ORDER BY AVG(YearlyIncome) DESC;
GO
```
After executing the statement using the EXPLAIN option, the message tab presents a single line titled explain, and starting with the XML text <?xml version="1.0" encoding="utf-8"?> Click on the XML to open the entire text in an XML window. To better understand the following comments, you should turn on the display of line numbers in SSDT.

To turn on line numbers
1. With the output appearing in the explain tab SSDT, on the TOOLS menu, select Options.
2. Expand the Text Editor section, expand XML, and then click General.
3. In the Display area, check Line numbers.
4. Click OK.
Example EXPLAIN output
The XML result of the EXPLAIN command with row numbers turned on is:
``` XML
1  <?xml version="1.0" encoding="utf-8"?>
2  <dsql_query>
3    <sql>SELECT CAST (AVG(YearlyIncome) AS int) AS AverageIncome, 
4          CAST(AVG(FIS.SalesAmount) AS int) AS AverageSales, 
5          G.StateProvinceName, T.SalesTerritoryGroup
6      FROM dbo.DimGeography AS G
7      JOIN dbo.DimSalesTerritory AS T
8          ON G.SalesTerritoryKey = T.SalesTerritoryKey
9      JOIN dbo.DimCustomer AS C
10          ON G.GeographyKey = C.GeographyKey
11      JOIN dbo.FactInternetSales AS FIS
12          ON C.CustomerKey = FIS.CustomerKey
13      WHERE T.SalesTerritoryGroup IN ('North America', 'Pacific')
14          AND Gender = 'F'
15      GROUP BY G.StateProvinceName, T.SalesTerritoryGroup
16      ORDER BY AVG(YearlyIncome) DESC</sql>
17    <dsql_operations total_cost="0.926237696" total_number_operations="9">
18      <dsql_operation operation_type="RND_ID">
19        <identifier>TEMP_ID_16893</identifier>
20      </dsql_operation>
21      <dsql_operation operation_type="ON">
22        <location permanent="false" distribution="AllComputeNodes" />
23        <sql_operations>
24          <sql_operation type="statement">CREATE TABLE [tempdb].[dbo].[TEMP_ID_16893] ([CustomerKey] INT NOT NULL, [GeographyKey] INT, [YearlyIncome] MONEY ) WITH(DATA_COMPRESSION=PAGE);</sql_operation>
25        </sql_operations>
26      </dsql_operation>
27      <dsql_operation operation_type="BROADCAST_MOVE">
28        <operation_cost cost="0.121431552" accumulative_cost="0.121431552" average_rowsize="16" output_rows="31.6228" />
29        <source_statement>SELECT [T1_1].[CustomerKey] AS [CustomerKey],
30         [T1_1].[GeographyKey] AS [GeographyKey],
31         [T1_1].[YearlyIncome] AS [YearlyIncome]
32  FROM   (SELECT [T2_1].[CustomerKey] AS [CustomerKey],
33                 [T2_1].[GeographyKey] AS [GeographyKey],
34                 [T2_1].[YearlyIncome] AS [YearlyIncome]
35          FROM   [AdventureWorksPDW2012].[dbo].[DimCustomer] AS T2_1
36          WHERE  ([T2_1].[Gender] = CAST (N'F' COLLATE Latin1_General_100_CI_AS_KS_WS AS NVARCHAR (1)) COLLATE Latin1_General_100_CI_AS_KS_WS)) AS T1_1</source_statement>
37        <destination_table>[TEMP_ID_16893]</destination_table>
38      </dsql_operation>
39      <dsql_operation operation_type="RND_ID">
40        <identifier>TEMP_ID_16894</identifier>
41      </dsql_operation>
42      <dsql_operation operation_type="ON">
43        <location permanent="false" distribution="AllDistributions" />
44        <sql_operations>
45          <sql_operation type="statement">CREATE TABLE [tempdb].[dbo].[TEMP_ID_16894] ([StateProvinceName] NVARCHAR(50) COLLATE Latin1_General_100_CI_AS_KS_WS, [SalesTerritoryGroup] NVARCHAR(50) COLLATE Latin1_General_100_CI_AS_KS_WS NOT NULL, [col] BIGINT, [col1] MONEY NOT NULL, [col2] BIGINT, [col3] MONEY NOT NULL ) WITH(DATA_COMPRESSION=PAGE);</sql_operation>
46        </sql_operations>
47      </dsql_operation>
48      <dsql_operation operation_type="SHUFFLE_MOVE">
49        <operation_cost cost="0.804806144" accumulative_cost="0.926237696" average_rowsize="232" output_rows="108.406" />
50        <source_statement>SELECT [T1_1].[StateProvinceName] AS [StateProvinceName],
51         [T1_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup],
52         [T1_1].[col2] AS [col],
53         [T1_1].[col] AS [col1],
54         [T1_1].[col3] AS [col2],
55         [T1_1].[col1] AS [col3]
56  FROM   (SELECT ISNULL([T2_1].[col1], CONVERT (MONEY, 0.00, 0)) AS [col],
57                 ISNULL([T2_1].[col3], CONVERT (MONEY, 0.00, 0)) AS [col1],
58                 [T2_1].[StateProvinceName] AS [StateProvinceName],
59                 [T2_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup],
60                 [T2_1].[col] AS [col2],
61                 [T2_1].[col2] AS [col3]
62          FROM   (SELECT   COUNT_BIG([T3_2].[YearlyIncome]) AS [col],
63                           SUM([T3_2].[YearlyIncome]) AS [col1],
64                           COUNT_BIG(CAST ((0) AS INT)) AS [col2],
65                           SUM([T3_2].[SalesAmount]) AS [col3],
66                           [T3_2].[StateProvinceName] AS [StateProvinceName],
67                           [T3_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup]
68                  FROM     (SELECT [T4_1].[SalesTerritoryKey] AS [SalesTerritoryKey],
69                                   [T4_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup]
70                            FROM   [AdventureWorksPDW2012].[dbo].[DimSalesTerritory] AS T4_1
71                            WHERE  (([T4_1].[SalesTerritoryGroup] = CAST (N'North America' COLLATE Latin1_General_100_CI_AS_KS_WS AS NVARCHAR (13)) COLLATE Latin1_General_100_CI_AS_KS_WS)
72                                    OR ([T4_1].[SalesTerritoryGroup] = CAST (N'Pacific' COLLATE Latin1_General_100_CI_AS_KS_WS AS NVARCHAR (7)) COLLATE Latin1_General_100_CI_AS_KS_WS))) AS T3_1
73                           INNER JOIN
74                           (SELECT [T4_1].[SalesTerritoryKey] AS [SalesTerritoryKey],
75                                   [T4_2].[YearlyIncome] AS [YearlyIncome],
76                                   [T4_2].[SalesAmount] AS [SalesAmount],
77                                   [T4_1].[StateProvinceName] AS [StateProvinceName]
78                            FROM   [AdventureWorksPDW2012].[dbo].[DimGeography] AS T4_1
79                                   INNER JOIN
80                                   (SELECT [T5_2].[GeographyKey] AS [GeographyKey],
81                                           [T5_2].[YearlyIncome] AS [YearlyIncome],
82                                           [T5_1].[SalesAmount] AS [SalesAmount]
83                                    FROM   [AdventureWorksPDW2012].[dbo].[FactInternetSales] AS T5_1
84                                           INNER JOIN
85                                           [tempdb].[dbo].[TEMP_ID_16893] AS T5_2
86                                           ON ([T5_1].[CustomerKey] = [T5_2].[CustomerKey])) AS T4_2
87                                   ON ([T4_2].[GeographyKey] = [T4_1].[GeographyKey])) AS T3_2
88                           ON ([T3_1].[SalesTerritoryKey] = [T3_2].[SalesTerritoryKey])
89                  GROUP BY [T3_2].[StateProvinceName], [T3_1].[SalesTerritoryGroup]) AS T2_1) AS T1_1</source_statement>
90        <destination_table>[TEMP_ID_16894]</destination_table>
91        <shuffle_columns>StateProvinceName;</shuffle_columns>
92      </dsql_operation>
93      <dsql_operation operation_type="ON">
94        <location permanent="false" distribution="AllComputeNodes" />
95        <sql_operations>
96          <sql_operation type="statement">DROP TABLE [tempdb].[dbo].[TEMP_ID_16893]</sql_operation>
97        </sql_operations>
98      </dsql_operation>
99      <dsql_operation operation_type="RETURN">
100        <location distribution="AllDistributions" />
101        <select>SELECT   [T1_1].[col] AS [col],
102           [T1_1].[col1] AS [col1],
103           [T1_1].[StateProvinceName] AS [StateProvinceName],
104           [T1_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup],
105           [T1_1].[col2] AS [col2]
106  FROM     (SELECT CONVERT (INT, [T2_1].[col], 0) AS [col],
107                   CONVERT (INT, [T2_1].[col1], 0) AS [col1],
108                   [T2_1].[StateProvinceName] AS [StateProvinceName],
109                   [T2_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup],
110                   [T2_1].[col] AS [col2]
111            FROM   (SELECT CASE
112                            WHEN ([T3_1].[col] = CAST ((0) AS BIGINT)) THEN CAST (NULL AS MONEY)
113                            ELSE ([T3_1].[col1] / CONVERT (MONEY, [T3_1].[col], 0))
114                           END AS [col],
115                           CASE
116                            WHEN ([T3_1].[col2] = CAST ((0) AS BIGINT)) THEN CAST (NULL AS MONEY)
117                            ELSE ([T3_1].[col3] / CONVERT (MONEY, [T3_1].[col2], 0))
118                           END AS [col1],
119                           [T3_1].[StateProvinceName] AS [StateProvinceName],
120                           [T3_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup]
121                    FROM   (SELECT ISNULL([T4_1].[col], CONVERT (BIGINT, 0, 0)) AS [col],
122                                   ISNULL([T4_1].[col1], CONVERT (MONEY, 0.00, 0)) AS [col1],
123                                   ISNULL([T4_1].[col2], CONVERT (BIGINT, 0, 0)) AS [col2],
124                                   ISNULL([T4_1].[col3], CONVERT (MONEY, 0.00, 0)) AS [col3],
125                                   [T4_1].[StateProvinceName] AS [StateProvinceName],
126                                   [T4_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup]
127                            FROM   (SELECT   SUM([T5_1].[col]) AS [col],
128                                             SUM([T5_1].[col1]) AS [col1],
129                                             SUM([T5_1].[col2]) AS [col2],
130                                             SUM([T5_1].[col3]) AS [col3],
131                                             [T5_1].[StateProvinceName] AS [StateProvinceName],
132                                             [T5_1].[SalesTerritoryGroup] AS [SalesTerritoryGroup]
133                                    FROM     [tempdb].[dbo].[TEMP_ID_16894] AS T5_1
134                                    GROUP BY [T5_1].[StateProvinceName], [T5_1].[SalesTerritoryGroup]) AS T4_1) AS T3_1) AS T2_1) AS T1_1
135  ORDER BY [T1_1].[col2] DESC</select>
136      </dsql_operation>
137      <dsql_operation operation_type="ON">
138        <location permanent="false" distribution="AllDistributions" />
139        <sql_operations>
140          <sql_operation type="statement">DROP TABLE [tempdb].[dbo].[TEMP_ID_16894]</sql_operation>
141        </sql_operations>
142      </dsql_operation>
143    </dsql_operations>
144  </dsql_query>
```
#### Meaning of the EXPLAIN output
The output above contains 144 numbered lines. Your output from this query may differ slightly. The following list describes significant sections.
Lines 3 through 16 provide a description of the query that is being analyzed.

Line 17, specifies that the total number of operations will be 9. You can find the start of each operation, by looking for the words dsql_operation.

Line 18 starts operation 1. Lines 18 and 19 indicate that a RND_ID operation will create a random ID number that will be used for an object description. The object described in the output above is TEMP_ID_16893. Your number will be different.

Line 20 starts operation 2. Lines 21 through 25: On all compute nodes, create a temporary table named TEMP_ID_16893.

Line 26 starts operation 3. Lines 27 through 37: Move data to TEMP_ID_16893 by using a broadcast move. The query sent to each compute node is provided. Line 37 specifies the destination table is TEMP_ID_16893.

Line 38 starts operation 4. Lines 39 through 40: Create a random ID for a table. TEMP_ID_16894 is the ID number in the example above. Your number will be different.

Line 41 starts operation 5. Lines 42 through 46: On all nodes, create a temporary table named TEMP_ID_16894.

Line 47 starts operation 6. Lines 48 through 91: Move data from various tables (including TEMP_ID_16893) to table TEMP_ID_16894, by using a shuffle move operation. The query sent to each compute node is provided. Line 90 specifies the destination table as TEMP_ID_16894. Line 91 specifies the columns.

Line 92 starts operation 7. Lines 93 through 97: On all compute nodes, drop temporary table TEMP_ID_16893.

Line 98 starts operation 8. Lines 99 through 135: Return results to the client. Uses the query provided to get the results.

Line 136 starts operation 9. Lines 137 through 140: On all nodes, drop temporary table TEMP_ID_16894.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.>
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
