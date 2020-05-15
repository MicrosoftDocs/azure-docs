---
title: Explore data in Hive tables with Hive queries - Team Data Science Process
description: Use sample Hive scripts that are used to explore data in Hive tables in an HDInsight Hadoop cluster.
services: machine-learning
author: marktab
manager: marktab
editor: marktab
ms.service: machine-learning
ms.subservice: team-data-science-process
ms.topic: article
ms.date: 01/10/2020
ms.author: tdsp
ms.custom: seodec18, previous-author=deguhath, previous-ms.author=deguhath
---
# Explore data in Hive tables with Hive queries

This article provides sample Hive scripts that are used to explore data in Hive tables in an HDInsight Hadoop cluster.

This task is a step in the [Team Data Science Process](overview.md).

## Prerequisites
This article assumes that you have:

* Created an Azure storage account. If you need instructions, see [Create an Azure Storage account](../../storage/common/storage-account-create.md)
* Provisioned a customized Hadoop cluster with the HDInsight service. If you need instructions, see [Customize Azure HDInsight Hadoop Clusters for Advanced Analytics](customize-hadoop-cluster.md).
* The data has been uploaded to Hive tables in Azure HDInsight Hadoop clusters. If it has not, follow the instructions in [Create and load data to Hive tables](move-hive-tables.md) to upload data to Hive tables first.
* Enabled remote access to the cluster. If you need instructions, see [Access the Head Node of Hadoop Cluster](customize-hadoop-cluster.md).
* If you need instructions on how to submit Hive queries, see [How to Submit Hive Queries](move-hive-tables.md#submit)

## Example Hive query scripts for data exploration
1. Get the count of observations per partition
    `SELECT <partitionfieldname>, count(*) from <databasename>.<tablename> group by <partitionfieldname>;`
2. Get the count of observations per day
    `SELECT to_date(<date_columnname>), count(*) from <databasename>.<tablename> group by to_date(<date_columnname>);`
3. Get the levels in a categorical column  
    `SELECT  distinct <column_name> from <databasename>.<tablename>`
4. Get the number of levels in combination of two categorical columns
    `SELECT <column_a>, <column_b>, count(*) from <databasename>.<tablename> group by <column_a>, <column_b>`
5. Get the distribution for numerical columns  
    `SELECT <column_name>, count(*) from <databasename>.<tablename> group by <column_name>`
6. Extract records from joining two tables
   
        SELECT
            a.<common_columnname1> as <new_name1>,
            a.<common_columnname2> as <new_name2>,
            a.<a_column_name1> as <new_name3>,
            a.<a_column_name2> as <new_name4>,
            b.<b_column_name1> as <new_name5>,
            b.<b_column_name2> as <new_name6>
        FROM
            (
            SELECT <common_columnname1>,
                <common_columnname2>,
                <a_column_name1>,
                <a_column_name2>,
            FROM <databasename>.<tablename1>
            ) a
            join
            (
            SELECT <common_columnname1>,
                <common_columnname2>,
                <b_column_name1>,
                <b_column_name2>,
            FROM <databasename>.<tablename2>
            ) b
            ON a.<common_columnname1>=b.<common_columnname1> and a.<common_columnname2>=b.<common_columnname2>

## Additional query scripts for taxi trip data scenarios
Examples of queries that are specific to [NYC Taxi Trip Data](https://chriswhong.com/open-data/foil_nyc_taxi/) scenarios are also provided in [GitHub repository](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/DataScienceScripts). These queries already have data schema specified and are ready to be submitted to run.

