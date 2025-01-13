---
title: "Quickstart: Deploy the Azure Health Data Services de-identification service with Azure CLI"
description: "Quickstart: Deploy the Azure Health Data Services de-identification service with Azure CLI."
author: jovinson-ms
ms.author: jovinson
ms.service: azure-health-data-services
ms.subservice: deidentification-service
ms.topic: quickstart
ms.custom: devx-track-azurecli
ms.date: 11/11/2024
---

# Quickstart: Deploy the Azure Health Data Services de-identification service (preview) with Azure CLI

In this quickstart, you use the Azure CLI to deploy a de-identification service (preview).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [include](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

## Install the deidservice extension

Install the **deidservice** extension:

```azurecli
az extension add --name deidservice
```

## Deploy a de-identification service (preview)
> [!NOTE]
> This command requires Azure CLI version 2.6 or later. You can check the currently installed version by running `az --version`.

Replace `<deid-service-name>` with a name for your de-identification service.

```azurecli
az group create --name exampleRG --location eastus
az deidservice create --resource-group exampleRG --name=<deid-service-name>
```

The command returns the following output, with some fields omitted for brevity.

```output
{
    "id": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/exampleRG/providers/Microsoft.HealthDataAIServices/DeidServices/<deid-service-name>",
    "location": "eastus",
    "name": "<deid-service-name>",
    "properties": {
        "provisioningState": "Succeeded",
        "publicNetworkAccess": "Enabled",
        "serviceUrl": "https://example.api.eus001.deid.azure.com"
    },
    "resourceGroup": "exampleRG",
    "tags": {},
    "type": "microsoft.healthdataaiservices/deidservices"
}
```

## Clean up resources

When you no longer need the resources, use the Azure CLI to delete the resource group.

```azurecli
az group delete --name exampleRG
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Azure Health De-identification client library for .NET](quickstart-sdk-net.md)