---
title: Release notes for Hadoop components on Azure HDInsight | Microsoft Docs
description: Latest release notes and versions of Hadoop components for Azure HDInsight. Get development tips and details for Hadoop, Apache Storm, and HBase.
services: hdinsight
documentationcenter: ''
editor: cgronlun
manager: jhubbard
author: nitinme
tags: azure-portal

ms.assetid: a363e5f6-dd75-476a-87fa-46beb480c1fe
ms.service: hdinsight
ms.custom: hdinsightactive
ms.workload: big-data
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/06/2017
ms.author: nitinme

---
# Release notes for Hadoop components on Azure HDInsight

This article provides information about the **most recent** Azure HDInsight release updates. For information on releases prior to that, see [HDInsight Release Notes Archive](hdinsight-release-notes-archive.md).

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight versioning article](hdinsight-component-versioning.md#hdi-version-32-and-33-nearing-deprecation-date).

##Notes for 02/28/2017 release of Spark 2.1 on HDInsight 3.6 (Preview)
* [Spark 2.1](http://spark.apache.org/releases/spark-release-2-1-0.html) improves many stability and usability issues with previous versions. It also brings new features across all Spark workloads, such as Spark Core, SQL, ML, and Streaming.
* Structured Streaming gets improved scalability with support for event time watermarks and Kafka 0.10 connector.
* Spark SQL partitioning is now handled using new Scalable Partition Handling mechanism. See more details [here](http://spark.apache.org/releases/spark-release-2-1-0.html) on how to upgrade.
* Spark 2.1 on Azure HDInsight 3.6 Preview currently does not support BI Tool connectivity using ODBC driver.
* Azure Data Lake Store access from Spark 2.1 clusters is not supported in this Preview.


##Notes for 11/18/2016 release of Spark 2.0.1 on HDInsight 3.5
Spark 2.0.1 is now available on Spark clusters (HDInsight version 3.5).

## Notes for 11/16/2016 release of R Server 9.0 on HDInsight 3.5 (Spark 2.0)
*	R Server clusters now include the option for two versions: R Server 9.0 on HDI 3.5 (Spark 2.0) and R Server 8.0 on HDI 3.4 (Spark 1.6).
*	R Server 9.0 on HDI 3.5 (Spark 2.0) is built on R 3.3.2 and includes new ScaleR data source functions called RxHiveData and RxParquetData for loading data from Hive and Parquet directly to Spark DataFrames for analysis by ScaleR. For more information see the inline help on these functions in R through use of the ?RxHiveData and ?RxParquetData commands.
*	RStudio Server community edition is now installed by default (with an opt-out option) on the Cluster Configuration blade as part of the provisioning flow.

## Notes for 11/09/2016 release of Spark 2.0 on HDInsight
* Spark 2.0 clusters on HDInsight 3.5 now support Livy and Jupyter services.

## Notes for 10/26/2016 release of R Server on HDInsight
* The URI for edge node access has changed to **clustername**-ed-ssh.azurehdinsight.net
* R Server on HDInsight cluster provisioning has been streamlined.
* R Server on HDInsight is now available as regular HDInsight "R Server" cluster type and no longer installed as a separate HDInsight application. The edge node and R Server binaries are now provisioned as part of the R Server cluster deployment. This improves speed and reliability of provisioning. Pricing model for R Server is updated accordingly.
* R Server cluster type price is now based on Standard tier price plus R Server surcharge price. Premium tier will now be reserved for Premium features available across different cluster types and will not be used for R Server cluster type. This change doesn't affect effective pricing of R Server, it only changes how the charges are presented in the bill. All existing R Server clusters will continue to work and ARM templates will continue to function until deprecation notice. **It is recommended though to update your scripted deployments to use new ARM template.**

## Notes for 08/30/2016 release of R Server on HDInsight
The full version numbers for Linux-based HDInsight clusters deployed with this release:

| HDI | HDI cluster version | HDP | HDP Build | Ambari Build |
| --- | --- | --- | --- | --- |
| 3.2 |3.2.1000.0.8268980 |2.2 |2.2.9.1-19 |2.2.1.12-4 |
| 3.3 |3.3.1000.0.8268980 |2.3 |2.3.3.1-25 |2.2.1.12-4 |
| 3.4 |3.4.1000.0.8269383 |2.4 |2.4.2.4-5 |2.2.1.12-4 |

The full version numbers for Windows-based HDInsight clusters deployed with this release:

| HDI | HDI cluster version | HDP | HDP Build |
| --- | --- | --- | --- |
| 2.1 |2.1.10.1033.2559206 |1.3 |1.3.12.0-01795 |
| 3.0 |3.0.6.1033.2559206 |2.0 |2.0.13.0-2117 |
| 3.1 |3.1.4.1033.2559206 |2.1 |2.1.16.0-2374 |
| 3.2 |3.2.7.1033.2559206 |2.2 |2.2.9.1-11 |
| 3.3 |3.3.0.1033.2559206 |2.3 |2.3.3.1-25 |


## Notes for 08/17/2016 release of R Server on HDInsight
* R Server 8.0.5 - mainly a bug fix release. See the [R Server Release Notes](https://msdn.microsoft.com/microsoft-r/notes/r-server-notes) for more info.
* AzureML package on the edge node - [this R package](https://cran.r-project.org/web/packages/AzureML/vignettes/getting_started.html) enables R models to be published and consumed as an Azure ML web service.  See the ["Operationalize a Model"](hdinsight-hadoop-r-server-overview.md#operationalize-a-model) section of our ["Overview of R Server on HDInsight"](hdinsight-hadoop-r-server-overview.md) article for more info.
* Linux dependencies of the [top 100 most popular R packages](https://github.com/metacran/cranlogs) - these Linux package dependencies are now pre-installed.
* Option to use the CRAN repo when adding R packages to the data nodes. See ["Get started using R Server on HDInsight"](hdinsight-hadoop-r-server-get-started.md) article for more information.
* Improved the reliability of R Server provisioning when clusters are created.


