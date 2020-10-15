---
author: MikeRayMSFT
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: include
ms.date: 10/15/2018
ms.author: mikeray
---

You will need the Azure CLI (az) and the Azure Data CLI (azdata) installed. [Install tools](./install-client-tools.md).

Prior to uploading data to Azure, you need to ensure that your Azure subscription has the `Microsoft.AzureData` resource provider registered.

You can verify this by running the following command:

```console
az provider show -n Microsoft.AzureData -o table
```

If the resource provider is not currently registered in your subscription, you can register it by running the following command. This command make take a minute or two to complete.

```console
az pro