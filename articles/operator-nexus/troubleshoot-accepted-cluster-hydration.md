---
title: "Azure Operator Nexus: Accepted Cluster"
description: Troubleshoot accepted Cluster resource.
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 10/30/2024
# ms.custom: template-include
---

# Troubleshoot accepted Cluster resources

Operator Nexus relies on mirroring, or hydrating, resources from the on-premises cluster to Azure. When this process is interrupted, the Cluster resource can move to `Accepted`state. 

## Diagnosis

The Cluster status is viewed via the Azure portal or via Azure CLI.

```bash
az networkcloud cluster show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME>
```

## Mitigation steps

### Triggering the resource sync


1. From the Cluster resource page in the Azure portal, add a tag to the Cluster resource.
2. The resource moves out of the `Accepted` state.

```bash
az login
az account set --subscription <SUBSCRIPTION>
az resource tag --tags exampleTag=exampleValue --name <CLUSTER> --resource-group <CLUSTER_RG> --resource-type "Microsoft.ContainerService/managedClusters"
```

## Verification

After the tag is applied, the Cluster moves to `Running` state.

```bash
az networkcloud cluster show --resource-group <RESOURCE_GROUP> --name <CLUSTER_NAME>
```

If the Cluster resource maintains the state after a period of time, less than 5 minutes, contact Microsoft support. 

## Further information

 Learn more about how resources are hydrated with [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview).
