---
title: Possible data-skew solutions for Azure Data Lake | Microsoft Docs
description: 'Possible data skew solutions for data skew issues troubleshooting in Azure Data Lake.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai
manager:
editor:

ms.assetid:
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/16/2016
ms.author: yanacai

---

# Possible data-skew solutions for Azure Data Lake

## What is data skew problem?

In one word, data skew is the over represented value. Think about that if you assigned 50 tax examiners to audit tax returns – one person to each state. Then the Wyoming auditor is going home early since there are fewer populations in Wyoming State, while the California examiners are going to be working very late since there is a large population in those states.
    ![Data Skew Problem Example](./media/data-lake-analytics-data-lake-tools-data-skew-solutions/data-skew-problem.png) 

In the case above, the data is not evenly distributed across workers which makes some workers run longer than others. During your job execution, there are usually similar cases like the example above -- one vertex get much more data compared with its peers, which makes the vertex run longer than others and slow down the whole job eventually. Worse, it may fail the job since vertices have 5-hours runtime limitation and 6 GB memory limitation.

## How to troubleshoot?

The tool helps to detect if your job has skew problem, to solve the problem, you can try solutions below.

### Solution 1: Improve table partition

#### Option 1: Filter the skewed key value in advance

If it does not impact your business logic, you can filter the more frequency value in advance. For example, there are a lot of 000-000-000 in column GUID, but you don’t want to do aggregate on that value actually. In this case, you can write “WHERE GUID != “000-000-000”” to filter the high frequency value before aggregating.

#### Option 2: Pick a different partition/distribution key

In the example above, if all you want is to check the tax all over the country, then you can select ID number as your key to improve data distribution. Sometimes picking a different partition/distribution key can distribute the data more evenly, but you need make sure this doesn’t affect your business logic. For instance, you want to calculate tax sum for each State, then you’d better choose State as a partition key. If this is something you are suffering, you can check Option 3.

#### Option 3: Add more partition/distribution key

Besides of using State as a partition key, you can use more than one key for partitioning, such as adding ZIP code as an additional partition key to reduce data partition sizes so that data distribution can be evener.

#### Option 4: ROUND ROBIN distribution

If you cannot find an appropriate key for partition and distribution, you can try to use ROUND ROBIN distribution. ROUND ROBIN distribution equally treats every row and randomly put it into corresponding bucket. In this case, the data is evenly distributed but lose locality information which will also reduce job performance for some operations. Furthermore, if you are doing aggregation for the skewed key anyway, the skew problem will still be there. You can check how to use ROUND ROBIN [here](https://msdn.microsoft.com/en-us/library/mt706196.aspx#dis_sch).

### Case 2: Improve query plan

#### Option 1: CREATE STATISTICS for column

U-SQL provides the CREATE STATISTICS statement on tables to give more information to the query optimizer about the data characteristics stored inside a table, such as the value distribution, etc. For most queries, the query optimizer already generates the necessary statistics for a high-quality query plan; in a few cases, you need to create additional statistics with CREATE STATISTICS or modify the query design to improve query performance. Find more info [here](https://msdn.microsoft.com/en-us/library/azure/mt771898.aspx).

**Code example:**

    CREATE STATISTICS IF NOT EXISTS stats_SampleTable_date ON SampleDB.dbo.SampleTable(date) WITH FULLSCAN;

>[!NOTE]
>Note that statistics information will not be updated automatically, which means if you update the data in table but forget to re-create statistics, it may result worse query performance.
>
>

#### Option 2: Use SKEWFACTOR

In the tax checking example above, if you want to sum the tax for each state, then you have no choice but to GROUP BY state, which will suffer from data skew issue. However, you can provide a Data Hint in your query to identify skew in keys so that the optimizer can optimize execution plan for you.

Usually, you can set the parameter as 0.5 and 1, 0.5 means skew but not much skew while 1 means heavy skew. The hint affects the optimizing for execution plan for current statement and all downstream statements, so please make sure that you add the hint before possible skewed key-wise aggregation.

    SKEWFACTOR (columns) = x

    Provides hint that given columns have a skew factor x between 0 (no skew) and 1 (very heavy skew).

**Code example:**

    //Adding SKEWFACTOR hint
    @Impressions =
        SELECT * FROM
        searchDM.SML.PageView(@start, @end) AS PageView
        OPTION(SKEWFACTOR(Query)=0.5)
        ;

    //Query 1 for key: Query, ClientId
    @Sessions =
        SELECT
            ClientId,
            Query,
            SUM(PageClicks) AS Clicks
        FROM
            @Impressions
        GROUP BY
            Query, ClientId
        ;

    // Query 2 for Key: Query
    @Display =
        SELECT * FROM @Sessions
            INNER JOIN @Campaigns
                ON @Sessions.Query == @Campaigns.Query
        ;   

In addition to SKEWFACTOR, for specific skewed key join cases, if you know that the other joined row set is quite small, you can add ROWCOUNT hint in U-SQL statement before JOIN to tell optimizer one of your row set is small so that optimizer can choose broadcast join strategy to improve performance. But please note that ROWCOUNT will not resolve the skew issue but only can offer some help in addition.

    OPTION(ROWCOUNT = n)

    Identify small row set before join by giving an estimated integer row count.

**Code example:**

    // Unstructured (24 hours daily log impressions)
    @Huge   = EXTRACT ClientId int, ...
                FROM @"wasb://ads@wcentralus/2015/10/30/{*}.nif"
                ;

    // Small subset (ie: ForgetMe opt out)
    @Small  = SELECT * FROM @Huge
                WHERE Bing.ForgetMe(x,y,z)
                OPTION(ROWCOUNT=500)
                ;

    // Result (not enough info to determine simple Broadcast join)
    @Remove = SELECT * FROM Bing.Sessions
                INNER JOIN @Small ON Sessions.Client == @Small.Client
                ;

### Case 3: Improve user defined reducer and combiner

Sometimes you write user defined operator to deal with complicated process logic, and well written reducer and combiner may mitigate data skew issue in some cases.

#### Option 1: Use recursive reducer if possible

By default, user defined reducer will run as non-recursive mode which means reduce work for a key will be distributed into a single vertex. But one problem is that if your data is skewed, the huge data sets may be processed in single vertex and run quite long time.

To improve performance, you can add an attribute in your code to define reducer as recursive mode, then the huge data sets can be distributed in to multiple vertices and run in parallelism which speeds up your job.

One thing to note is that, to change a non-recursive reducer to recursive, you need to make sure your algorithm is associativity. For example, sum is associativity while median is not. Also, you need to make sure the input and output for reducer keep the same schema.

**Attribute for recursive reducer:**

    [SqlUserDefinedReducer(IsRecursive = true)]

**Code example:**

    [SqlUserDefinedReducer(IsRecursive = true)]
    public class TopNReducer : IReducer
    {
        public override IEnumerable<IRow>
            Reduce(IRowset input, IUpdatableRow output)
        {
            // your reducer code here
        }
    }

#### Option 2: Use row-level combiner mode if possible

Similar with ROWCOUNT hint for specific skewed key join cases, combiner mode tries to distributed huge skewed key value set to multiple vertices so that the work can be executed concurrently. It can’t resolve data skew issue but can offer some help in addition for huge skewed key value set.

By default, the combiner mode if Full which means both left row set and right row set cannot be separated. Setting the mode as Left/Right/Inner enables row level join and the system will separate corresponding row set and distributed them into multiple vertices and run in parallelism. However, before configure the combiner mode, you need to take care and make sure the corresponding row set can be separated.

Here is an example for separated left row set below. In this case, ever output row depends on a single input row from the left, and potentially depends on all rows from the right with the same key value. In this case, if you set combiner mode as left, then the system will separate huge left row set to small ones and assign them to multiple vertices.
![Combiner Mode Illustration](./media/data-lake-analytics-data-lake-tools-data-skew-solutions/combiner-mode-illustration.png)

>[!NOTE]
>PLEASE NOTE THAT if you set wrong combiner mode, the combine will be less efficient, and the results may be wrong even worse!
>
>

**Attributes for combiner：**

- [SqlUserDefinedCombiner(Mode=CombinerMode.Full)]: Every output row potentially depends on all the input rows from left and right with the same key value.

- SqlUserDefinedCombiner(Mode=CombinerMode.Left): Every output row depends on a single input row from the left (and potentially all rows from the right with the same key value).

- qlUserDefinedCombiner(Mode=CombinerMode.Right): Every output row depends on a single input row from the right (and potentially all rows from the left with the same key value).

- SqlUserDefinedCombiner(Mode=CombinerMode.Inner): Every output row depends on a single input row from left and right with the same value.

**Code example:**

    [SqlUserDefinedCombiner(Mode = CombinerMode.Right)]
    public class WatsonDedupCombiner : ICombiner
    {
        public override IEnumerable<IRow>
            Combine(IRowset left, IRowset right, IUpdatableRow output)
        {
        // your combiner code here
        }
    }
