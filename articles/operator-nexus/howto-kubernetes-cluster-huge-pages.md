---
title: Customize huge-page for Azure Operator Nexus Kubernetes service node pools #Required; page title is displayed in search results. Include the brand.
description: Customize huge-page for Azure Operator Nexus Kubernetes service node pools #Required; article description that is displayed in search results. 
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure-operator-nexus #Required; service per approved list. slug assigned by ACOM.
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 06/27/2023 #Required; mm/dd/yyyy format.
ms.custom: template-how-to-pattern #Required; leave this attribute/value as-is.
---

# Create a Nexus Kubernetes cluster with a customized huge-page configuration

In this article, you learn how to enable huge-page settings during the creation of your Nexus Kubernetes cluster. Enabling huge pages allows for larger memory allocations, reducing memory fragmentation and improving overall memory utilization.

This configuration is especially advantageous for data plane applications, as it enables the applications to efficiently handle larger datasets and perform memory-intensive operations. As a result, you can experience improved performance and optimize resource utilization for your data plane workloads.

> [!NOTE]
> Huge-page configuration does not apply to Kubernetes control plane nodes.

## Prerequisites

Before proceeding with this how-to guide, it's recommended that you:

   * Refer to the Nexus Kubernetes cluster [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md) for a comprehensive overview and steps involved.
   * Ensure that you meet the outlined prerequisites to ensure smooth implementation of the guide.

## Huge-page settings in Nexus Kubernetes cluster
When configuring huge-pages for a Nexus Kubernetes cluster, you need to provide the following arguments:
   * HugepageSize: Choose a huge-page size of either ```2M``` or ```1G```.
   * HugepageCount: Specify the number of huge-pages you want to allocate.

## Limitations
Nexus Kubernetes cluster enforces the following constraints to ensure proper configuration:
   * The total size of huge-pages (HugepageSize multiplied by HugepageCount) must not exceed 80% of the VM's memory.
   * At least 2 GB of memory must be left for the host kernel after allocating huge-pages.
   * If the huge-page size is ```2M```, the huge-page count must be a power of 2 (for example, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, etc.).
   * Huge-page configurations must be done during agent pool creation, it can't be added or modified after.


## Example: Create a Nexus Kubernetes cluster with huge-page settings

Refer to the Nexus Kubernetes cluster [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md#deploy-the-bicep-file) for detailed instructions on creating your cluster. Additionally, remember to include the huge-page configurations in the `kubernetes-deploy-parameters.json` file that you created during the quickstart process. This configuration enables huge pages in your agent pool.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "kubernetesClusterName":{
      "value": "hugepage-test"
    },
    "adminGroupObjectIds": {
      "value": [
        "00000000-0000-0000-0000-000000000000"
      ]
    },
    "cniNetworkId": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
    },
    "cloudServicesNetworkId": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
    },
    "extendedLocation": {
      "value": "/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
    },
    "location": {
      "value": "eastus"
    },
    "sshPublicKey": {
      "value": "ssh-rsa AAAAB...."
    },
    "initialPoolAgentOptions": {
      "value": {"hugepagesCount": 512,"hugepagesSize": "2M"}
    }
  }
}
```

## Example: Add an agent pool to Nexus Kubernetes cluster with huge-page settings.

Refer to the Nexus Kubernetes cluster [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md#add-an-agent-pool) for instructions on adding an agent pool to your cluster. Additionally, remember to include the huge-page configurations in the `kubernetes-nodepool-parameters.json` file that you created during the quickstart process. This configuration enables huge pages in your agent pool.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "kubernetesClusterName":{
        "value": "hugepage-test"
      },
      "extendedLocation": {
        "value": "/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
      },
      "agentOptions": {
        "value": {"hugepagesCount": 512,"hugepagesSize": "2M"}
      }
    }
}
```

## Next steps
 Refer to the [quickStart guide](./quickstarts-kubernetes-cluster-deployment-bicep.md#add-an-agent-pool) to add new agent pools and experiment with configurations in your Nexus Kubernetes cluster.
