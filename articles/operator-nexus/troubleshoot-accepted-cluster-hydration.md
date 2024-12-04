---
title: "Azure Operator Nexus: Accepted Cluster"
description: Learn how to troubleshoot accepted Cluster resources.
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 10/30/2024
# ms.custom: template-include
---

# Troubleshoot accepted Cluster resources

Operator Nexus relies on mirroring, or hydrating, resources from the on-premises cluster to Azure. When this process is interrupted, the Cluster resource can move to the `Accepted` state.

## Diagnosis

The Cluster status is viewed via the Azure portal or the Azure CLI.

```bash
az networkcloud cluster show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME>
```

## Mitigation steps

Follow these steps for mitigation.

### Trigger the resource sync

1. From the Cluster resource page in the Azure portal, add a tag to the Cluster resource.
1. The resource moves out of the `Accepted` state.

```bash
az login
az account set --subscription <SUBSCRIPTION>
az resource tag --tags exampleTag=exampleValue --name <CLUSTER> --resource-group <CLUSTER_RG> --resource-type "Microsoft.ContainerService/managedClusters"
```

## Verification

After the tag is applied, the Cluster moves to the `Running` state.

```bash
az networkcloud cluster show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME>
```

If the Cluster resource maintains the state after more than five minutes, contact Microsoft support.

## Related content

- For more information about how resources are hydrated, see [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview).
- If you still have questions, [contact Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
