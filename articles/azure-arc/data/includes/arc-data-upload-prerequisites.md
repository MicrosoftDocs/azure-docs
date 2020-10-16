---
author: MikeRayMSFT
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.topic: include
ms.date: 10/15/2018
ms.author: mikeray
---

You will need the Azure CLI (az) and the Azure Data CLI (azdata) installed. [Install client tools](../install-client-tools.md).

Prior to uploading data to Azure, you need to ensure that your Azure subscription has the `Microsoft.AzureData` resource provider registered.

To verify the resource provider, run the following command:

```console
az provider show -n Microsoft.AzureData -o table
```

If the resource provider is not currently registered in your subscription, you can register it. To register it, run the following command.  This command may take a minute or two to complete.

```console
az provider register -n Microsoft.AzureData --wait
```
