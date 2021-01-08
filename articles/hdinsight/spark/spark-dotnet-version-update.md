---
title: Updating .NET for Apache Spark to version v1.0 in HDI
description: Learn about updating .NET for Apache Spark version to 1.0 in HDI and how that affects your existing code and clusters.
ms.author: nidutta
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,hdiseo17may2017
ms.date: 01/05/2020
---

# Updating .NET for Apache Spark to version v1.0  in HDInsight

This document talks about the first major version of [.NET for Apache Spark](https://github.com/dotnet/spark), and how it might impact your current production pipelines in HDInsight clusters.

## About .NET for Apache Spark version 1.0.0

This is the first [major official release](https://github.com/dotnet/spark/releases/tag/v1.0.0) of .NET for Apache Spark and provides DataFrame API completeness for Spark 2.4.x as well as Spark 3.0.x along with other features. For a complete list of all features, improvements and bug fixes, please check out the official [v1.0.0 release notes](https://github.com/dotnet/spark/blob/master/docs/release-notes/1.0.0/release-1.0.0.md).
Another important thing to note is that this version is **not** compatible with prior versions of `Microsoft.Spark` and `Microsoft.Spark.Worker`. Please check out the [migration guide](https://github.com/dotnet/spark/blob/master/docs/migration-guide.md#upgrading-from-microsoftspark-0x-to-10) if you are planning to upgrade your .NET for Apache Spark application to be compatible with v1.0.0.

## Using .NET for Apache Spark v1.0 in HDInsight

While current HDI clusters will not be affected (i.e. they will still have the same version as before), newly created HDI clusters will carry this latest v1.0.0 version of .NET for Apache Spark. What this means if:

1. **You have an older HDI cluster**: If you want to upgrade your Spark .NET application to v1.0.0 (recommended), you will have to update the `Microsoft.Spark.Worker` version on your HDI cluster. Refer to the [following section](#changing-version-of-.net-for-apache-spark-on-hdinsight-cluster) to learn how to change the version of .NET for Apache Spark on an HDI cluster.
If you don't want to update the current version of .NET for Apache Spark in your application, no further steps are necessary.  

2. **You have a new HDI cluster**: If you want to upgrade your Spark .NET application to v1.0.0 (recommended), no steps are needed to change the worker on HDI, however you will have to refer to the [migration guide](https://github.com/dotnet/spark/blob/master/docs/migration-guide.md#upgrading-from-microsoftspark-0x-to-10) to understand the steps needed to update your code and pipelines.
If you don't want to change the current version of .NET for Apache Spark in your application, you would have to change the version on your HDI cluster from v1.0 (default on new clusters) to whichever version you are using. Refer to the [changing versions of .NET for Apache Spark on HDI cluster section](#changing-version-of-.net-for-apache-spark-on-hdinsight-cluster) to learn how to do that.  

## Changing version of .NET for Apache Spark on HDInsight cluster

### Deploy Microsoft.Spark.Worker

`Microsoft.Spark.Worker` is a backend component that lives on the individual worker nodes of your Spark cluster. When you want to execute a C# UDF (user-defined function), Spark needs to understand how to launch the .NET CLR to execute this UDF. `Microsoft.Spark.Worker` provides a collection of classes to Spark that enable this functionality. Select the worker version depending on the version of .NET for Apache Spark you want to deploy on the HDI cluster.

1. Download the Microsoft.Spark.Worker Linux release of your particular version. For example, if you want `.NET for Apache Spark v1.0.0`, you'd download [Microsoft.Spark.Worker.netcoreapp3.1.linux-x64-1.0.0.tar.gz](https://github.com/dotnet/spark/releases/tag/v1.0.0).  

2. Download [install-worker.sh](https://github.com/dotnet/spark/blob/master/deployment/install-worker.sh) script to install the worker binaries downloaded in Step 1 to all the worker nodes of your HDI cluster.  

3. Upload the above mentioned files to the Azure Storage account your cluster has access to. You can refer to [the .NET for Apache Spark HDI deployment article](https://docs.microsoft.com/en-us/dotnet/spark/tutorials/hdinsight-deployment#upload-files-to-azure) for more details.

4. Run the `install-worker.sh` script on all worker nodes of your cluster, using Script actions. Refer to [this section](https://docs.microsoft.com/en-us/dotnet/spark/tutorials/hdinsight-deployment#run-the-hdinsight-script-action) of the above article to understand how to do that.

### Update your application to use specific version

You can update your .NET for Apache Spark application to use a specific version by choosing the required version of the [Microsoft.Spark nuget package](https://www.nuget.org/packages/Microsoft.Spark/) in your project. Be sure to check out the release notes of the particular version as well as the [migration guide]((https://github.com/dotnet/spark/blob/master/docs/migration-guide.md#upgrading-from-microsoftspark-0x-to-10)) as mentioned above, if choosing to update your application to v1.0.0.

## FAQs

1. **Will my existing HDI cluster with version < 1.0.0 start failing with the new release?**  
Existing HDI clusters will continue to have the same previous version for .NET for Apache Spark and your existing application (having previous version of Spark .NET) will not be affected.
