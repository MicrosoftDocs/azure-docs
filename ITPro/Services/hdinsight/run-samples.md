<properties linkid="manage-services-hdinsight-howto-run-samples" urlDisplayName="Run HDInsight Samples" pageTitle="Run the HDInsight Samples | Windows Azure" metaKeywords="" description="Get started using the Windows Azure HDInsight service with the samples provided. Use PowerShell scripts that run MapReduce programs on data clusters." metaCanonical="" services="" documentationCenter="" title="Run the HDInsight samples" authors=""  solutions="" writer="sburgess" manager="paulettm" editor="mollybos"  />




#Run the HDInsight samples

A set of samples are provided to help you get started with Windows Azure HDInsight. These samples are made available on each of the HDInsight clusters that you create. Running these samples will familiarize you with Windows Azure PowerShell HDInsight cmdlets.

MapReduce programs can also be run programmatically from an application using the Microsoft .NET API for HDInsight. For more information on using the HDInsight APIs for job submission, see [Submit Hadoop Jobs Programmatically][submit-jobs-programmatically].

Much additional documentation exists on the web for Hadoop-related technologies such as Java-based MapReduce programming and streaming, as well as documentation on the cmdlets using in PowerShell scripting. For more information on these resources, see the final **Resources for HDInsight** section of the [Introduction to Windows Azure HDInsight][hdinsight-resources] topic.

**What these samples are**

<p>These samples are intended to get you up to speed quickly on how to deploy Hadoop jobs and to provide you an extensible testing bed to work with the concepts and scripting procedures used by the service. They provide you with examples of common tasks such as creating and importing data sets of various sizes, running jobs and composing jobs sequentially, and examining the results of your jobs. The data sets used can be varied in size, allowing you to observe the effects that data sets of various size has on job performance.</p>


**Prerequisites**:	

- You must have a Windows Azure Account. For options on signing up for an account see [Try Windows Azure out for free](http://www.windowsazure.com/en-us/pricing/free-trial/) page.

- You must have provisioned an HDInsight cluster. For instructions on the various ways in which such clusters can be created, see [Provision HDInsight Clusters](/en-us/manage/services/hdinsight/provision-hdinsight-clusters/)

- You must have installed Windows Azure PowerShell, and have configured them for use with your account. For instructions on how to do this, see [Install and configure PowerShell for HDInsight](/en-us/manage/services/hdinsight/install-and-configure-powershell-for-hdinsight/)

## The samples ##

HDInsight ships with the following samples.

- [**The Pi Estimator Sample**][pi-estimator]: This tutorial shows how to run a MapReduce program with HDInsight that uses a statistical (quasi-Monte Carlo) method to estimate the value of Pi.
- [**The WordCount Sample**][wordcount]: This tutorial shows how to use an HDInsight cluster to run a MapReduce program that counts word occurrences in a text file.
- [**The 10-GB Graysort Sample**][10gb-graysort]: This tutorial shows how to run a general purpose GraySort on a 10 GB file using HDInsight. There are three jobs to run: Teragen to generate the data, Terasort to sort the data, and Teravalidate to confirm the data has been properly sorted.
- [**The C# Streaming Sample**][cs-streaming]:This tutorial shows how to use C# to write a MapReduce program that uses the Hadoop streaming interface. 


## How to run the samples ##

The samples can be run using Windows Azure PowerShell. Instructions on how to do this are provided for each of the samples on the pages linked above.

##Next steps ##

From this article and the articles on each of the samples, you learned how to run the samples included with the HDInsight clusters using Windows Azure PowerShell. For tutorials on using Pig, Hive, and MapReduce with HDInsight, see the following topics:

* [Get started with Windows Azure HDInsigth Service][getting-started]
* [Use Pig with HDInsight][pig]
* [Use Hive with HDInsight][hive]
* [Submit Hadoop Jobs Programmatically][submit-jobs-programmatically]
* [Windows Azure HDInsight SDK documentation][hdinsight-sdk-documentation]
* [Debug HDInsight: Error Messages][hdinsight-debug-error-messages]

[hdinsight-debug-error-messages]: /en-us/manage/services/hdinsight/debug-error-messages/
[hdinsight-sdk-documentation]: http://msdnstage.redmond.corp.microsoft.com/en-us/library/dn479185.aspx
[getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[mapreduce]: /en-us/manage/services/hdinsight/using-mapreduce-with-hdinsight/
[hive]: /en-us/manage/services/hdinsight/using-hive-with-hdinsight/
[pig]: /en-us/manage/services/hdinsight/using-pig-with-hdinsight/
[pi-estimator]: /en-us/manage/services/hdinsight/howto-run-samples/sample-pi-estimator/
[10gb-graysort]: /en-us/manage/services/hdinsight/howto-run-samples/sample-10gb-graysort/
[wordcount]: /en-us/manage/services/hdinsight/howto-run-samples/sample-wordcount/
[cs-streaming]: /en-us/manage/services/hdinsight/howto-run-samples/sample-csharp-streaming/
[scoop]: /en-us/manage/services/hdinsight/howto-run-samples/sample-sqoop-import-export/
[submit-jobs-programmatically]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-resources]: /en-us/manage/services/hdinsight/introduction-hdinsight/