---
title: "Custom locations on Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
description: "Use custom locations to deploy Azure PaaS services on Azure Arc enabled Kubernetes clusters"
---

# Custom locations on Azure Arc enabled Kubernetes

The Custom Locations is an extension of Azure location. It provides a way for tenant administrators to utilize their Azure Arc enabled Kubernetes clusters as target locations to deploy instances of Azure services such as Azure Arc enabled SQL Managed Instance and Azure Arc enabled PostgreSQL Hyperscale. Similar to locations, end users within the tenant who have access to Custom Locations can deploy resources there utilizing their company's private compute.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- [Install or upgrade Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli) to version >= 2.16.0

- Provider registration is complete for `Microsoft.ExtendedLocations`
    1. Enter the following commands:
    
    ```azurecli
    az provider register --namespace Microsoft.ExtendedLocations
    ```

    2. Monitor the registration process. Registration may take up to 10 minutes.
    
    ```azurecli
    az provider show -n Microsoft.ExtendedLocations -o table
    ```

- `connectedk8s` (version >= 1.1.0), `k8s-extension` (version >= 0.2.0) and `customlocation` (version >= 0.1.0) Azure CLI extensions. Install these Azure CLI extensions by running the following commands:
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
    
    If the `connectedk8s`, `k8s-extension` and `custsomlocation` extensions are already installed, you can update them to the latest version using the following command:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    az extension update --name customlocation
    ```

>[!NOTE]
>**Supported regions for custom locations:**
>* East US
>* West Europe

## Enable custom locations on cluster

All Arc enabled Kubernetes clusters created using `connectedk8s` Azure CLI extension of version >= 1.1.0 have custom locations feature already enabled on those clusters. To enable this feature on clusters created using `connectedk8s` Azure CLI extension of version < 1.1.0 or on clusters where this feature was manually disabled, run the following command:

```console
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features cluster-connect,custom-locations
```

> [!NOTE]
> 1. Custom Locations feature is dependent on the Cluster Connect feature. So both features have to be enabled for custom locations to work.
> 2. `az connectedk8s enable-features` needs to be run on a machine where the `kubeconfig` file is pointing to the cluster on which the features are to be enabled.

## Create custom location

1. Create an Azure Arc enabled Kubernetes cluster.
    - If you haven't connected a cluster yet, walk through our [Connect an Azure Arc enabled Kubernetes cluster quickstart](quickstart-connect-cluster.md).
    - If you had already created an Azure Arc enabled Kubernetes cluster but had disabled auto upgrade of agents, then you need to [upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

1. Deploy the cluster extension of the Azure service whose instance you want to eventually on top of the custom location:

    ```azurecli
    az k8s-extension create --name <extensionInstanceName> --extension-type microsoft.arcdataservices --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName> --scope cluster --release-namespace arc --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper
    ```

1. Fetch the Azure Resource Manager identifier of the Azure Arc enabled Kubernetes cluster, which is referenced in later steps as `connectedClusterId`:

    ```azurecli
    az connectedk8s show -n <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Fetch the Azure Resource Manager identifier of the cluster extension deployed on top of Azure Arc enabled Kubernetes cluster, which is referenced in later steps as `extensionId`:

    ```azurecli
    az k8s-extension show --name <extensionInstanceName> --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Create custom location by referencing the Azure Arc enabled Kubernetes cluster and the extension:

    ```azurecli
    az customlocation create -n <customLocationName> -g <resourceGroupName> --namespace arc --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionId>
    ```