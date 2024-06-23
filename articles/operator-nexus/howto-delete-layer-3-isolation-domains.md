---
title: How to Delete L3 Isolation Domains in Azure Nexus Network Fabric
description: Learn how to effectively delete L3 Isolation Domains in the Azure Nexus Network Fabric.
ms.service: azure-operator-nexus
ms.custom: template-how-to, devx-track-azurecli
ms.topic: how-to
ms.date: 02/07/2024
author: sushantjrao
ms.author: sushrao
---

# How to delete L3 isolation domains in Azure Nexus Network Fabric

In managing network infrastructure, deleting Layer 3 (L3) Isolation Domains (ISDs) needs careful consideration and precise execution to maintain the network's integrity and functionality. This step-by-step guide outlines the process of safely deleting L3 ISDs.

Below are the steps involved:

 [!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

1. **Set subscription (if necessary):**
 
If you have multiple subscriptions and need to set one as the default, you can do so with:
 
```Azure CLI
az account set --subscription <subscription-id>
```

2. **Disable L3 isolation domains**

Before deleting an L3 ISD, it's crucial to disable it to prevent any disruption to the network using the following command.

```Azure CLI
az nf l3domain update-admin-state --resource-group "ResourceGroupName" --resource-name "example-l3domain" --state Disable
```

| Parameter            | Description                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------|
| --resource-group     | The name of the resource group containing the L3 isolation domain to update.                   |
| --resource-name      | The name of the L3 isolation domain to update.                                                 |
| --state              | The desired state of the L3 isolation domain. Possible values: "Enable" or "Disable".         |

>!**Note:**
>Disabling the L3 isolation domain will disassociate all attached resources, including route policies, IP prefixes, IP communities, and both internal and external networks.

3. **Delete L3 isolation domains**

After disabling the L3 isolation domain and disassociating its associated resources, you can safely delete it using the following command. 

```Azure CLI
az nf l3domain delete --resource-group "ResourceGroupName" --resource-name "example-l3domain"
```

| Parameter            | Description                                                                                     |
|----------------------|-------------------------------------------------------------------------------------------------|
| --resource-group     | The name of the resource group containing the L3 isolation domain to delete.                   |
| --resource-name      | The name of the L3 isolation domain to delete.                                                 |

This table outlines the parameters required for executing the `az nf l3domain delete` command, facilitating users in understanding the necessary inputs for deleting an L3 isolation domain.

3. Validation:

After executing the deletion command, use either the `show` or `list` commands to validate that the isolation domain has been successfully deleted.
