title: Azure Government Intelligence + Analytics | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: meyoun
manager: zakramer
editor: ''

ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/06/2016
ms.author: meyoun
---
# Azure Government Intelligence + Analytics
This article outlines the intelligence and analytics services, variations, and considerations for the Azure Government environment.

## Azure HDInsight
HDInsight is generally available in Azure Government.

### Variations
The following HDInsight features are not currently available in Azure Government.

* Azure Data Lake Store is not currently available in Azure Government. Azure Blob Storage is the only available storage option at this time.
* HDInsight is not available on Windows.

The URLs for Log Analytics are different in Azure Government:
| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| HDInsight Cluster |*.azurehdinsight.net |*.azurehdinsight.us |

For more information, see [Azure HDInsight public documentation](../hdinsight/hdinsight-hadoop-introduction.md).


## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
