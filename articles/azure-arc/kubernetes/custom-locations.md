---
title: "Custom locations on Azure Arc enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 04/05/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
ms.custom: references_regions, devx-track-azurecli
description: "Use custom locations to deploy Azure PaaS services on Azure Arc enabled Kubernetes clusters"
---

# Custom locations on Azure Arc enabled Kubernetes

As an Azure location extension, *Custom Locations* provides a way for tenant administrators to use their Azure Arc enabled Kubernetes clusters as target locations for deploying Azure services instances. Azure resources examples include Azure Arc enabled SQL Managed Instance and Azure Arc enabled PostgreSQL Hyperscale.

Similar to Azure locations, end users within the tenant with access to Custom Locations can deploy resources there using their company's private compute.

A conceptual overview of this feature is available in [Custom locations - Azure Arc enabled Kubernetes](conceptual-custom-locations.md) article.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0.

- `connectedk8s` (version >= 1.1.0), `k8s-extension` (version >= 0.2.0), and `customlocation` (version >= 0.1.0) Azure CLI extensions. Install these Azure CLI extensions by running the following commands:
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
    
    If the `connectedk8s`, `k8s-extension` and `customlocation` extensions are already installed, you can update them to the latest version using the following command:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    az extension update --name customlocation
    ```

- Provider registration is complete for `Microsoft.ExtendedLocation`.
    1. Enter the following commands:
    
    ```azurecli
    az provider register --namespace Microsoft.ExtendedLocation
    ```

    2. Monitor the registration process. Registration may take up to 10 minutes.
    
    ```azurecli
    az provider show -n Microsoft.ExtendedLocation -o table
    ```

>[!NOTE]
>**Supported regions for custom locations:**
>* East US
>* West Europe

## Enable custom locations on cluster

To enable this feature on your cluster, execute the following command:

```console
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features cluster-connect custom-locations
```

> [!NOTE]
> 1. Custom Locations feature is dependent on the Cluster Connect feature. So both features have to be enabled for custom locations to work.
> 2. `az connectedk8s enable-features` needs to be run on a machine where the `kubeconfig` file is pointing to the cluster on which the features are to be enabled.
> 3. If you are logged into Azure CLI using a service principal, [additional permissions](troubleshooting.md#enable-custom-locations-using-service-principal) have to be granted to the service principal before enabling the custom location feature.

## Create custom location

1. Create an Azure Arc enabled Kubernetes cluster.
    - If you haven't connected a cluster yet, use our [quickstart](quickstart-connect-cluster.md).
    - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version >= 1.1.0.

1. Deploy the cluster extension of the Azure service whose instance you eventually want on top of the custom location:

    ```azurecli
    az k8s-extension create --name <extensionInstanceName> --extension-type microsoft.arcdataservices --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName> --scope cluster --release-namespace arc --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper
    ```

    > [!NOTE]
    > Outbound proxy without authentication and outbound proxy with basic authentication are supported by the Arc enabled Data Services cluster extension. Outbound proxy that expects trusted certificates is currently not supported.

1. Get the Azure Resource Manager identifier of the Azure Arc enabled Kubernetes cluster, referenced in later steps as `connectedClusterId`:

    ```azurecli
    az connectedk8s show -n <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Get the Azure Resource Manager identifier of the cluster extension deployed on top of Azure Arc enabled Kubernetes cluster, referenced in later steps as `extensionId`:

    ```azurecli
    az k8s-extension show --name <extensionInstanceName> --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Create custom location by referencing the Azure Arc enabled Kubernetes cluster and the extension:

    ```azurecli
    az customlocation create -n <customLocationName> -g <resourceGroupName> --namespace arc --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionId>
    ```

## Next steps

> [!div class="nextstepaction"]
> Securely connect to the cluster using [Cluster Connect](cluster-connect.md)