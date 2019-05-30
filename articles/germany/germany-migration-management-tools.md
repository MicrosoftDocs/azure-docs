---
title: Migrate Azure management tools from Azure Germany to global Azure
description: This article provides information about migrating your Azure management tools from Azure Germany to global Azure.
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 08/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migrate management tool resources to global Azure

This article has information that can help you migrate Azure management tools from Azure Germany to global Azure.

## Traffic Manager

Azure Traffic Manager can help you complete a smooth migration. However, you can't migrate Traffic Manager profiles that you create in Azure Germany to global Azure. (During a migration, you migrate Traffic Manager endpoints to the target environment, so you need to update the Traffic Manager profile anyway.)

You can define additional endpoints in the target environment by using Traffic Manager while it's still running in the source environment. When Traffic Manager is running in the new environment, you can still define endpoints that you haven't yet migrated in the source environment. This scenario is known as the [Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/). The scenario involves the following steps:

1. Create a new Traffic Manager profile in global Azure.
1. Define the endpoints in Azure Germany.
1. Change your DNS CNAME record to the new Traffic Manager profile.
1. Turn off the old Traffic Manager profile.
1. Migrate and configure endpoints. For each endpoint in Azure Germany:
   1. Migrate the endpoint to global Azure.
   1. Change the Traffic Manager profile to use the new endpoint.

For more information:

- Refresh your knowledge by completing the [Traffic Manager tutorials](https://docs.microsoft.com/azure/traffic-manager/#step-by-step-tutorials).
- Review the [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md).
- Learn how to [create a Traffic Manager profile](../traffic-manager/traffic-manager-create-profile.md).
- Read about the [Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/).

## Backup

You can't migrate Azure Backup jobs and snapshots from Azure Germany to global Azure.

For more information: 

- Refresh your knowledge by completing the [Backup tutorials](https://docs.microsoft.com/azure/backup/#step-by-step-tutorials).
- Review the [Azure Backup overview](../backup/backup-introduction-to-azure-backup.md).

## Scheduler

Azure Scheduler is being deprecated. Use Azure Logic Apps to create scheduling jobs.

For more information:

- Become familiar with features in Azure Logic Apps by completing the [Logic Apps tutorials](https://docs.microsoft.com/azure/logic-apps/#step-by-step-tutorials).
- Review the [Logic Apps overview](../logic-apps/logic-apps-overview.md).

## Network Watcher

Migrating an Azure Network Watcher instance from Azure Germany to global Azure isn't supported at this time. We recommend that you create and configure a new Network Watcher instance in global Azure. Then, compare the results between the old and new environments. 

For more information:

- Refresh your knowledge by completing the [Network Watcher tutorials](https://docs.microsoft.com/azure/network-watcher/#step-by-step-tutorials).
- Review the [Network Watcher overview](../network-watcher/network-watcher-monitoring-overview.md).
- Learn about [Network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md).
- Read about [Connection Monitor](../network-watcher/connection-monitor.md).

## Site Recovery

You can't migrate your current Azure Site Recovery setup to global Azure. You must set up a new Site Recovery solution in global Azure.

For more information about Site Recovery and to learn how to migrate VMs from Azure Germany to global Azure, see [How to use Site Recovery](./germany-migration-compute.md#compute-iaas).

Refresh your knowledge by completing these step-by-step tutorials:

- [Azure-to-Azure disaster recovery](https://docs.microsoft.com/azure/site-recovery/#azure-to-azure)
- [VMware-to-Azure disaster recovery](https://docs.microsoft.com/azure/site-recovery/#vmware)
- [Hyper-V-to-Azure disaster recovery](https://docs.microsoft.com/azure/site-recovery/#hyper-v)

## Azure policies

You can't directly migrate policies from Azure Germany to global Azure. During a migration, the scope of assigned policies usually changes. It's especially true when the subscription is different in the target environment, as it is in this scenario. However, you can preserve policy definitions and reuse them in global Azure.

In the Azure CLI, run the following command to list all policies in your current environment.

> [!NOTE]
> Be sure to switch to the AzureGermanCloud environment in the Azure CLI before you run the following commands.


```azurecli
az policy definition list --query '[].{Type:policyType,Name:name}' --output table
```

Export only policies that have the **PolicyType** value **Custom**. Export **policyRule** to a file. The following example exports the custom policy "Allow Germany Central Only" (short version: `allowgconly`) to a file in the current folder: 

```azurecli
az policy definition show --name allowgconly --output json --query policyRule > policy.json
```

Your export file will look similar to the following example:

```json
{
  "if": {
    "not": {
      "equals": "germanycentral",
      "field": "location"
    }
  },
  "then": {
    "effect": "Deny"
  }
}
```

Next, switch to the global Azure environment. Modify the policy rule by editing the file. For example, change `germanycentral` to `westeurope`.

```json
{
  "if": {
    "not": {
      "equals": "westeurope",
      "field": "location"
    }
  },
  "then": {
    "effect": "Deny"
  }
}
```

Create the new policy:

```azurecli
cat policy.json |az policy definition create --name "allowweonly" --rules @-
```

You now have a new policy named `allowweonly`. The policy allows only West Europe as the region.

Assign the policy to the scopes in your new environment as appropriate. You can document the old assignments in Azure Germany by running the following command:

```azurecli
az policy assignment list
```

For more information:

- Refresh your knowledge by completing the [Azure policies tutorial](../governance/policy/tutorials/create-and-manage.md).
- Learn how to [view policies by using the Azure CLI](../governance/policy/tutorials/create-and-manage.md#view-policy-definitions-with-azure-cli) or [view policies by using PowerShell](../governance/policy/tutorials/create-and-manage.md#view-policy-definitions-with-powershell).
- Learn how to [create a policy definition by using the Azure CLI](../governance/policy/tutorials/create-and-manage.md#create-a-policy-definition-with-azure-cli) or [create a policy definition by using PowerShell](../governance/policy/tutorials/create-and-manage.md#create-a-policy-definition-with-powershell).

## Next steps

Learn about tools, techniques, and recommendations for migrating resources in the following service categories:

- [Compute](./germany-migration-compute.md)
- [Networking](./germany-migration-networking.md)
- [Storage](./germany-migration-storage.md)
- [Web](./germany-migration-web.md)
- [Databases](./germany-migration-databases.md)
- [Analytics](./germany-migration-analytics.md)
- [IoT](./germany-migration-iot.md)
- [Integration](./germany-migration-integration.md)
- [Identity](./germany-migration-identity.md)
- [Security](./germany-migration-security.md)
- [Media](./germany-migration-media.md)
