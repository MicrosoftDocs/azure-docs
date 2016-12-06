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
| Data entered, stored, and processed within Azure App Service can contain export controlled data. Binaries running within Azure App Service. Static authenticators, such as passwords and smartcard PINs for access to Azure platform components. Private keys of certificates used to manage Azure platform components. SQL connection strings. Other security information/secrets, such as certificates, encryption keys, master keys, and storage keys stored in Azure services. |Metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Azure App Service. Do not enter Regulated/controlled data into the following fields: Resource groups, Resource names, Resource tags|

## Next Steps
For supplemental information and updates subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
