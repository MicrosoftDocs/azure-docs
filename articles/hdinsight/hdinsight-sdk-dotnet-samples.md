---
title: 'Azure HDInsight: .NET samples for the SDK'
description: Find C# .NET examples on GitHub for common tasks using the HDInsight SDK.
author: hrasheed-msft
ms.service: hdinsight
ms.topic: sample
ms.date: 03/10/2018
ms.author: hrasheed

---
# Azure HDInsight: .NET samples for the SDK
> [!div class="op_single_selector"]
> * [.NET Examples](hdinsight-management-api-dotnet-samples.md)
> * [Go Examples](hdinsight-management-api-dotnet-samples.md)
> * [Java Examples](hdinsight-management-api-dotnet-samples.md)
> * [Python Examples](hdinsight-management-api-dotnet-samples.md)

This article provides:

* Links to samples for cluster creation tasks.
* Links to API reference content for other management tasks.

For code samples for the .NET SDK Version 3.0 (Preview), see the latest samples in the [hdinsight-dotnet-sdk-samples](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples) GitHub repository. 

**Prerequisites**

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
  
You can [activate Visual Studio subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio): Your Visual Studio subscription gives you credits every month that you can use for paid Azure services.

## Cluster management - creation

* [Kafka](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples/blob/master/Management/Microsoft.Azure.Management.HDInsight.Samples/Microsoft.Azure.Management.HDInsight.Samples/CreateKafkaClusterSample.cs)
* [Spark](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples/blob/master/Management/Microsoft.Azure.Management.HDInsight.Samples/Microsoft.Azure.Management.HDInsight.Samples/CreateSparkClusterSample.cs)
* [Spark with Enterprise Security Package (ESP)](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples/blob/master/Management/Microsoft.Azure.Management.HDInsight.Samples/Microsoft.Azure.Management.HDInsight.Samples/CreateEspClusterSample.cs)
* [Spark with Azure Data Lake Storage Gen2](https://github.com/Azure-Samples/hdinsight-dotnet-sdk-samples/blob/master/Management/Microsoft.Azure.Management.HDInsight.Samples/Microsoft.Azure.Management.HDInsight.Samples/CreateHadoopClusterWithAdlsGen2Sample.cs)

## Other API Functions

Code snippets for the following API functions can be found in the [HDInsight .NET API reference documentation](https://docs.microsoft.com/en-us/dotnet/api/overview/azure/hdinsight?view=azure-dotnet):

* List clusters
* Delete clusters
* Resize clusters
* Monitoring
* Script Actions