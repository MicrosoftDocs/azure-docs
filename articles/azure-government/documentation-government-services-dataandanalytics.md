---
title: Azure Government Data + Analytics
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
author: jglixon
ms.author: jglixon
manager: zakramer
ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: azure-government
ms.topic: article
ms.workload: azure-government
ms.date: 07/30/2018
---
# Azure Government Data + Analytics
This article outlines the data and analytics services, variations, and considerations for the Azure Government environment.

## HDInsight
HDInsight on Linux Standard is generally available in Azure Government. You can see a demo on how to build data-centric solutions on Azure Government using [HDInsight](https://channel9.msdn.com/Blogs/Azure/Cognitive-Services-HDInsight-and-Power-BI-on-Azure-Government).

### Variations
The following HDInsight features are not currently available in Azure Government.

* HDInsight is not available on Windows.
* Azure Data Lake Store is not currently available in Azure Government. Azure Blob Storage is the only available storage option currently.

The URLs for Log Analytics are different in Azure Government:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| HDInsight Cluster | \*.azurehdinsight.net | \*.azurehdinsight.us |

For secured virtual networks, you will want to allow Network Security Groups (NSGs) access to certain IP addresses and ports. For Azure Government, you should allow the follow IP addresses (all with an Allowed port of 443):

| Region | Allowed IP addresses | Allowed port |
| ---- | ---- | ---- | ---- |
| USGov Iowa | 13.72.184.124</br>13.72.190.110 | 443 |
| USGov Virginia | 13.72.49.126</br>13.72.55.55 | 443 |

For more information, see [HDInsight public documentation](../hdinsight/hadoop/apache-hadoop-introduction.md).

## Power BI
Power BI US Government is generally available as part of the Office 365 US Government Community subscriptions. You can learn about [Power BI US Government here](https://powerbi.microsoft.com/en-us/documentation/powerbi-service-govus-overview/).

You can see a demo on [how to build data-centric solutions on Azure Government using Power BI](https://channel9.msdn.com/Blogs/Azure/Cognitive-Services-HDInsight-and-Power-BI-on-Azure-Government/)

### Variations

Power BI does not yet have Portal support in the Azure Government Portal. 

The URLs for Power BI are different in US Government:

| Service Type | Power BI Commercial | Power BI US Government |
| --- | --- | --- |
| Power BI URL | app.powerbi.com | app.powerbigov.us |

## Power BI Embedded 
For details on this service and how to use it, see [Azure Power BI Embedded Documentation](../power-bi-embedded/index.md).

### Variations
Power BI Embedded does not yet have Portal support in the Azure Government Portal. 

## Azure Analysis Services

For information on this service and how to use it, see [Azure Analysis Services Documentation](../analysis-services/index.md).

## Next Steps
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
