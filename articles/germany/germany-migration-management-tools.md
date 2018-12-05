---
title: Migration of managemtn tools resources from Azure Germany to global Azure
description: This article provides help for migrating management tools resources from Azure Germany to global Azure
author: gitralf
services: germany
cloud: Azure Germany
ms.author: ralfwi 
ms.service: germany
ms.date: 8/15/2018
ms.topic: article
ms.custom: bfmigrate
---

# Migration of management tools resources from Azure Germany to global Azure

This article will provide you some help for the migration of Azure Management Tool resources from Azure Germany to global Azure.

## Traffic Manager

Traffic Manager profiles created in Azure Germany can't be migrated to global Azure. Since you also migrate all the Traffic Manager endpoints to the target environment, you need to update the Traffic Manager profile anyway.

Traffic Manager can help you with a smooth migration. With Traffic Manager still running in the old environment, you can already define additional endpoints in the target environment. Once Target Manager runs in the new environment, you can still define endpoints in the old environment that you didn't migrate so far. This is known as [the Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/). In short:

- Create a new Traffic Manager in Azure global
- Define the endpoints (still in Azure Germany)
- Change your DNS CNAME to the new Traffic Manager
- Turn off the old Traffic Manager
- for each endpoint in Azure Germany:
  - Migrate the endpoint to global Azure
  - change the Traffic Manager profile to use the new endpoint

### Next steps

- Refresh your knowledge about Traffic Manager by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/traffic-manager/#step-by-step-tutorials).

### References

- [Traffic Manager overview](../traffic-manager/traffic-manager-overview.md)
- [Create a Traffic Manager profile](../traffic-manager/traffic-manager-create-profile.md)
- [Blue-Green scenario](https://azure.microsoft.com/blog/blue-green-deployments-using-azure-traffic-manager/)








## Backup

Unfortunately, Azure Backup jobs and snapshots can't be migrated from Azure Germany to global Azure.

### Next Steps

- Refresh your knowledge about Azure Backup by following [these Step-by-Step tutorials](https://docs.microsoft.com/azure/backup/#step-by-step-tutorials).

### References

- [Azure Backup overview](../backup/backup-introduction-to-azure-backup.md)










## Scheduler

Azure Scheduler is being deprecated. Use Azure Logic apps instead to create scheduling jobs.

### Next Steps

- Make yourself familiar with the features that [Azure Logic Apps provides by following the [Step-by-Step tutorials](https://docs.microsoft.com/azure/logic-apps/#step-by-step-tutorials).

### Reference

- [Azure Logic Apps overview](../logic-apps/logic-apps-overview.md)











## Network Watcher

Migration of Network Watcher between Azure Germany and global Azure isn't supported at this time. The recommended approach is to create and configure a new Network Watcher. Afterwards, compare the results between old and new environment:

- [NSG Flow Logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md)
- [Connection Monitor](../network-watcher/connection-monitor.md)

### Next steps

- Refresh your knowledge about Network Watcher by following these [Step-by-Step tutorials](https://docs.microsoft.com/azure/network-watcher/#step-by-step-tutorials).

### References

- [Network Watcher Overview](../network-watcher/network-watcher-monitoring-overview.md)













## Site Recovery

It's not possible to migrate your current Site Recovery setup to global Azure. Set up your solution again in global Azure.

### Next steps

Refresh your knowledge by following these Step-by-Step tutorials for setting up a disaster recovery for
- [Azure to Azure](https://docs.microsoft.com/azure/site-recovery/#azure-to-azure)
- [Vmware to Azure](https://docs.microsoft.com/azure/site-recovery/#vmware)
- [Hyper-V to Azure](https://docs.microsoft.com/azure/site-recovery/#hyper-v)

### References

See also [how to use Site Recovery](./germany-migration-compute.md#compute-iaas) to migrate VMs from Azure Germany to global Azure.













## Azure Policy

There's no direct way to migrate policies. The scope of assigned policies will change in the most cases, especially since the subscription ID will change. But here's a way to preserve policy definitions and reuse them in global Azure.

By using Azure CLI, use this command to list all policies in your current environment.
> [!NOTE]
> Don't forget to switch to the AzureGermanCloud environment in CLI first.

```azurecli
az policy definition list --query '[].{Type:policyType,Name:name}' --output table
```

Only export policies with the PolicyType *Custom*. Export the *policyRule* into a file. The following example exports a custom policy "Allow Germany Central Only" (short *allowgconly*) to a file in the current folder. 

```azurecli
az policy definition show --name allowgconly --output json --query policyRule > policy.json
```

The export file looks something like the following example:

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

Now switch to the global Azure environment and modify the policy rule by editing the file, for example change *germanycentral* to *westeurope*:

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

You now have a new policy named "allowweonly" to allow only West Europe as location.

Assign the policy to the scopes in your new environment as appropriate. You can document the old assignments in Azure Germany by running the following command:

```azurecli
az policy assignment list
```

## Next Steps

- Refresh your knowledge about Azure Policy with [this Step-by-Step tutorial](../governance/policy/tutorials/create-and-manage.md).

## References

- [View policies with CLI](../governance/policy/tutorials/create-and-manage.md#view-policy-definitions-with-azure-cli)
- [Create policy definition with CLI](../governance/policy/tutorials/create-and-manage.md#create-a-policy-definition-with-azure-cli)
- [View policies with PowerShell](../governance/policy/tutorials/create-and-manage.md#view-policy-definitions-with-powershell)
- [Create policy definition with PowerShell](../governance/policy/tutorials/create-and-manage.md#create-a-policy-definition-with-powershell)
