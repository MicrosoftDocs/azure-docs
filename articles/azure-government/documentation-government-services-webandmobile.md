title: Azure Government Web and Mobile | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: brendalee
manager: zakramer
editor: ''

ms.assetid: a1e173a9-996a-4091-a2e3-6b1e36da9ae1
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 12/5/2016
ms.author: brendalee

# Azure Government Web + Mobile
## App Services

### Variations
Azure App Services is generally available in Azure Government.

The Address for Azure App Services in Azure Government is different:

| Service Type | Azure Public | Azure Government |
| --- | --- | --- |
| SQL Database |*.database.windows.net |*.database.usgovcloudapi.net |

### Considerations
The following information identifies the Azure Government boundary for Azure SQL:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data stored and processed in Microsoft Azure App Services can contain Azure Government-regulated data. You must use database tools for data transfer of Azure Government-regulated data. |Azure App Services metadata is not permitted to contain export controlled data. Do not enter regulated/controlled data into the following fields:  |

## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
