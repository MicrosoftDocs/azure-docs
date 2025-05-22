---
author: omarrivera
ms.author: omarrivera
ms.date: 03/26/2025
ms.topic: include
ms.service: azure-operator-nexus
---

## Prerequisites

1. Install the latest version of the [appropriate CLI extensions](../../howto-install-cli-extensions.md).
1. Request access to run the Azure Operator Nexus network fabric (NF) and network cloud CLI extension commands.
1. Sign in to the Azure CLI and select the subscription where the cluster is deployed.
1. Collect the following information:
    - Subscription ID (`SUBSCRIPTION`)
    - Cluster name (`CLUSTER`)
    - Resource group (`CLUSTER_RG`)
    - Managed resource group (`CLUSTER_MRG`) - BareMetal Machines (BMM) resources are present in the managed resource group
    - BareMetal Machine Name (`BMM_NAME`) that requires lifecycle management operations
