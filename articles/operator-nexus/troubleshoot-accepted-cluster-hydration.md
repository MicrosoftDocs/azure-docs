---
title: "Azure Operator Nexus: Accepted Cluster"
description: Troubleshoot accepted Cluster resource.
author: matternst7258
ms.author: matthewernst
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshoot
ms.date: 10/30/2024
# ms.custom: template-include
---

# Troubleshoot accepted Cluster resources

Operator Nexus relies on mirroring, or hydrating, resources from the on-premises cluster to Azure. When this process is interrupted, the Cluster resource can move to `Accepted`state. 

## Prerequisites

1. Install the latest version of the [appropriate CLI extensions](howto-install-cli-extensions.md)
2. Collect the following information:
   - Subscription ID (SUBSCRIPTION)
   - Cluster name (CLUSTER)
   - Resource group (CLUSTER_RG)
   - Managed resource group (CLUSTER_MRG)
3. Request subscription access to run Azure Operator Nexus network fabric (NF) and network cloud (NC) CLI extension commands.
4. Sign In to Azure CLI and select the subscription where the cluster is deployed.

## Mitigation steps

### Triggering the resource sync


1. From the Cluster resource page in the Azure portal, add a tag to the Cluster resource.
2. In most cases, the resource moves out of the `Accepted` state.

```bash
az login
az account set --subscription <SUBSCRIPTION>
az resource tag --tags exampleTag=exampleValue --name <CLUSTER> --resource-group <CLUSTER_RG> --resource-type "Microsoft.ContainerService/managedClusters"
```

If the Cluster resource maintains the state after a period of time, less than 5 minutes, contact Microsoft support. 

## Further information

 Learn more about [Azure Arc-enabled Kubernetes](/azure/azure-arc/kubernetes/overview).
