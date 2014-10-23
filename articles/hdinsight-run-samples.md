<properties urlDisplayName="Run Hadoop Samples in HDInsight" pageTitle="Run the Hadoop samples in HDInsight | Azure" metaKeywords="hdinsight, hdinsight sample,  hadoop, mapreduce" description="Get started using the Azure HDInsight service with the samples provided. Use PowerShell scripts that run MapReduce programs on data clusters." metaCanonical="" services="hdinsight" documentationCenter="" title="Run the Hadoop samples in HDInsight" authors="bradsev" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="bradsev" />




#Run the Hadoop samples in HDInsight

A set of samples are provided to help you get started running MapReduce jobs on Hadoop clusters using Azure HDInsight. These samples are made available on each of the HDInsight managed clusters that you create. Running these samples will familiarize you using Azure PowerShell HDInsight cmdlets to run jobs on Hadoop clusters.

MapReduce programs can also be run programmatically from an application using the Microsoft .NET API for HDInsight. For more information on using the HDInsight APIs for job submission, see [Submit Hadoop Jobs Programmatically][hdinsight-submit-jobs].

Much additional documentation exists on the web for Hadoop-related technologies such as Java-based MapReduce programming and streaming, as well as documentation on the cmdlets using in PowerShell scripting. For more information on these resources, see the final **Resources for HDInsight** section of the [Introduction to Azure HDInsight][hdinsight-introduction] topic.

**What these samples are**

<p>These samples are intended to get you up to speed quickly on how to deploy Hadoop jobs and to provide you an extensible testing bed to work with the concepts and scripting procedures used by the service. They provide you with examples of common tasks such as creating and importing data sets of various sizes, running jobs and composing jobs sequentially, and examining the results of your jobs. The data sets used can be varied in size, allowing you to observe the effects that data sets of various size has on job performance.</p>


**Prerequisites**:	

- You must have an Azure Account. For options on signing up for an account see [Try Azure out for free](http://azure.microsoft.com/en-us/pricing/free-trial/) page.

- You must have provisioned an HDInsight cluster. For instructions on the various ways in which such clusters can be created, see [Provision HDInsight Clusters](../hdinsight-provision-clusters/)

- You must have installed Azure PowerShell, and have configured them for use with your account. For instructions on how to do this, see [Install and configure Azure PowerShell][powershell-install-configure].

## The samples ##

HDInsight ships with the following samples.

- [**The Pi Estimator Sample**][hdinsight-sample-pi-estimator] This tutorial shows how to run a MapReduce program with HDInsight that uses a statistical (quasi-Monte Carlo) method to estimate the value of Pi.
- [**The WordCount Sample**][hdinsight-sample-wordcount] This tutorial shows how to use an HDInsight cluster to run a MapReduce program that counts word occurrences in a text file.
- [**The 10-GB Graysort Sample**][hdinsight-sample-10gb-graysort] This tutorial shows how to run a general purpose GraySort on a 10 GB file using HDInsight. There are three jobs to run: Teragen to generate the data, Terasort to sort the data, and Teravalidate to confirm the data has been properly sorted.
- [**The C# Streaming Sample**][hdinsight-sample-csharp-streaming] This tutorial shows how to use C# to write a MapReduce program that uses the Hadoop streaming interface. 


## How to run the samples ##

The samples can be run using Azure PowerShell. Instructions on how to do this are provided for each of the samples on the pages linked above.

##Next steps ##

From this article and the articles on each of the samples, you learned how to run the samples included with the HDInsight clusters using Azure PowerShell. For tutorials on using Pig, Hive, and MapReduce with HDInsight, see the following topics:

* [Get started with Azure HDInsigth Service][hdinsight-get-started]
* [Use Pig with HDInsight][hdinsight-use-pig]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Submit Hadoop Jobs Programmatically][hdinsight-submit-jobs]
* [Azure HDInsight SDK documentation][hdinsight-sdk-documentation]
* [Debug HDInsight: Error Messages][hdinsight-errors]


[hdinsight-errors]: ../hdinsight-debug-jobs/

[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx

[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-introduction]: ../hdinsight-hadoop-introduction/



[Powershell-install-configure]: ../install-configure-powershell/

[hdinsight-get-started]: ../hdinsight-get-started/

[hdinsight-samples]: ../hdinsight-run-samples/
[hdinsight-sample-10gb-graysort]: ../hdinsight-sample-10gb-graysort/
[hdinsight-sample-csharp-streaming]: ../hdinsight-sample-csharp-streaming/
[hdinsight-sample-pi-estimator]: ../hdinsight-sample-pi-estimator/
[hdinsight-sample-wordcount]: ../hdinsight-sample-wordcount/

[hdinsight-use-hive]: ../hdinsight-use-hive/
[hdinsight-use-pig]: ../hdinsight-use-pig/

