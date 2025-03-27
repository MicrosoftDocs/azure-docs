---
title: Common Issues - Credentials Resource
description: Azure CycleCloud common issue - Credential Resources
author: adriankjohnson
ms.date: 05/28/2024
ms.author: adjohnso
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---
# Common Issues: Azure Credentials Resources

## Possible Error Messages
- `Staging resources (Azure account credentials are not valid)`
- `Staging resources (No JSON object could be decoded)`

## Resolution
Verify that the service principal configured for Azure CycleCloud is valid. This error can occur if the secret for the service principal has expired. To resolve this issue, update the expired secret for the service principal in the Azure portal and then update the secret for the credential in CycleCloud by selecting the "gear" icon at the bottom of the Clusters page and editing the appropriate credential.

To reset the service principal's secret:
```azurecli-interactive
az ad sp credential reset --name "0000000000-0000-0000-0000-00000000" --years 2  --password {Application Secret} --credential-description "My New Credential"
```

## More Information

For more information on Azure CLI operations with service principals, see [Service Principals](/cli/azure/ad/sp?view=azure-cli-latest&preserve-view=true)
