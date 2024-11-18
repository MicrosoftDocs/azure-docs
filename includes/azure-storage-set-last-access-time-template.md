---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 05/02/2024
 ms.author: normesta
---

To enable last access time tracking for a new or existing storage account with an Azure Resource Manager template, include the **lastAccessTimeTrackingPolicy** object in the template definition. For details, see the [Microsoft.Storage/storageAccounts/blobServices 2021-02-01 - Bicep & ARM template reference](/azure/templates/microsoft.storage/2021-02-01/storageaccounts/blobservices?tabs=json). The **lastAccessTimeTrackingPolicy** object is available in the Azure Storage Resource Provider REST API for versions 2019-06-01 and later.