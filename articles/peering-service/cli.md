---
title: Register a Peering Service Preview connection by using the Azure CLI 
description: Learn how to register a Peering Service connection by using the Azure CLI
services: peering-service
author: derekolo
ms.service: peering-service
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: Infrastructure-services
ms.date: 05/2/2020
ms.author: derekol
---

# Register a Peering Service connection by using the Azure CLI

Azure Peering Service is a networking service that enhances customer connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. In this article, you'll learn how to register a Peering Service connection by using the Azure CLI.

- This article requires version 2.0.28 or later of the Azure CLI. Run [az version](/cli/azure/reference-index#az_version) to find the version and dependent libraries that are installed. To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index#az_upgrade).

## Prerequisites 

You must have the following:

### Azure account

You must have a valid and active Microsoft Azure account. This account is required to set up the Peering Service connection. Peering Service is a resource within Azure subscriptions.

### Connectivity provider

You can work with an internet service provider or internet exchange partner to obtain Peering Service to connect your network with the Microsoft network.

Make sure that the connectivity providers are partnered with Microsoft.

[!INCLUDE [azure-cli-prepare-your-environment-h3.md](../../includes/azure-cli-prepare-your-environment-h3.md)]

- This article requires version 2.0.28 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

### 1. Select your subscription

Select the subscription for which you want to register the Peering Service connection.

```azurecli-interactive
az account set --subscription "<subscription ID>"
```

If you don't already have a resource group, you must create one before you register your Peering Service connection. You can create a resource group by running the following command:

```azurecli-interactive
az group create -n MyResourceGroup -l "West US"
```

### 2. Register your subscription with the resource provider and feature flag

Before you proceed to the steps of registering the Peering Service connection by using the Azure CLI, register your subscription with the resource provider and feature flag by using the Azure CLI. The Azure CLI commands are specified here:

```azurecli-interactive

az feature register --namespace Microsoft.Peering --name AllowPeeringService

```

### 3. Register the Peering Service connection

Register the Peering Service connection by using the following set of commands via the Azure CLI. This example registers the Peering Service connection named myPeeringService.

```azurecli-interactive
az peering service create : Create peering service\
  --location -l \
  --name myPeeringService\
  --resource-group -g MyResourceGroup\
  --peering-service-location\
  --peering-service-provider\
  --tags
```

### 4. Register the prefix

Register the prefix that's provided by the connectivity provider by executing the following commands via the Azure CLI. This example registers the prefix named myPrefix.

```azurecli-interactive
az peering service prefix create \
  --name  myPrefix\
  --peering-service-name myPeeringService\
  --resource-group  -g myResourceGroup\
```

## Next steps

- To learn more about Peering Service connection, see [Peering Service connection](connection.md).
- To learn about Peering Service connection telemetry, see [Peering Service connection telemetry](connection-telemetry.md).
- To measure telemetry, see [Measure connection telemetry](measure-connection-telemetry.md).
- To register the connection by using Azure PowerShell, see [Register a Peering Service connection - Azure PowerShell](powershell.md).
- To register the connection by using the Azure portal, see [Register a Peering Service connection - Azure portal](azure-portal.md).
