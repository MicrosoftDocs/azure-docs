---
title: "Create and manage custom locations on Azure Arc-enabled Kubernetes"
services: azure-arc
ms.service: azure-arc
ms.date: 05/25/2021
ms.topic: article
author: shashankbarsin
ms.author: shasb
ms.custom: references_regions, devx-track-azurecli
description: "Use custom locations to deploy Azure PaaS services on Azure Arc-enabled Kubernetes clusters"
---

# Create and manage custom locations on Azure Arc-enabled Kubernetes

As an Azure location extension, *Custom Locations* provides a way for tenant administrators to use their Azure Arc-enabled Kubernetes clusters as target locations for deploying Azure services instances. Azure resources examples include Azure Arc-enabled SQL Managed Instance and Azure Arc-enabled PostgreSQL Hyperscale.

Similar to Azure locations, end users within the tenant with access to Custom Locations can deploy resources there using their company's private compute.

In this article, you learn how to:
> [!div class="checklist"]
> * Enable custom locations on your Azure Arc-enabled Kubernetes cluster.
> * Deploy the Azure service cluster extension of the Azure service instance on your cluster.
> * Create a custom location on your Azure Arc-enabled Kubernetes cluster.

A conceptual overview of this feature is available in [Custom locations - Azure Arc-enabled Kubernetes](conceptual-custom-locations.md) article.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Prerequisites

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to version >= 2.16.0.

- Install the following Azure CLI extensions:
    - `connectedk8s` (version 1.1.0 or later)
    - `k8s-extension` (version 0.2.0 or later)
    - `customlocation` (version 0.1.0 or later) 
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```
    
    If you've previously installed the `connectedk8s`, `k8s-extension`, and `customlocation` extensions, update to the latest version using the following command:

    ```azurecli
    az extension update --name connectedk8s
    az extension update --name k8s-extension
    az extension update --name customlocation
    ```

- Verify completed provider registration for `Microsoft.ExtendedLocation`.
    1. Enter the following commands:
    
    ```azurecli
    az provider register --namespace Microsoft.ExtendedLocation
    ```

    2. Monitor the registration process. Registration may take up to 10 minutes.
    
    ```azurecli
    az provider show -n Microsoft.ExtendedLocation -o table
    ```

- Verify you have an existing [Azure Arc-enabled Kubernetes connected cluster](quickstart-connect-cluster.md).
    - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to version 1.1.0 or later.

>[!NOTE]
>**Supported regions for custom locations:**
>* East US
>* West Europe

## Enable custom locations on cluster

If you are logged into Azure CLI as a Azure AD user, to enable this feature on your cluster, execute the following command:

```console
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features cluster-connect custom-locations
```

If you are logged into Azure CLI using a service principal, to enable this feature on your cluster, execute the following steps:

1. Fetch the Object ID of the Azure AD application used by Azure Arc service:

    ```console
    az ad sp show --id 'bc313c14-388c-4e7d-a58e-70017303ee3b' --query objectId -o tsv
    ```

1. Use the `<objectId>` value from above step to enable custom locations feature on the cluster:

    ```console
    az connectedk8s enable-features -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId> --features cluster-connect custom-locations
    ```

> [!NOTE]
> 1. Custom Locations feature is dependent on the Cluster Connect feature. So both features have to be enabled for custom locations to work.
> 2. `az connectedk8s enable-features` needs to be run on a machine where the `kubeconfig` file is pointing to the cluster on which the features are to be enabled.

## Create custom location

1. Deploy the Azure service cluster extension of the Azure service instance you eventually want on your cluster:

    * [Azure Arc-enabled Data Services](../data/create-data-controller-direct-cli.md#create-the-arc-data-services-extension)

        > [!NOTE]
        > Outbound proxy without authentication and outbound proxy with basic authentication are supported by the Azure Arc-enabled Data Services cluster extension. Outbound proxy that expects trusted certificates is currently not supported.


    * [Azure App Service on Azure Arc](../../app-service/manage-create-arc-environment.md#install-the-app-service-extension)

    * [Event Grid on Kubernetes](../../event-grid/kubernetes/install-k8s-extension.md)

1. Get the Azure Resource Manager identifier of the Azure Arc-enabled Kubernetes cluster, referenced in later steps as `connectedClusterId`:

    ```azurecli
    az connectedk8s show -n <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Get the Azure Resource Manager identifier of the cluster extension deployed on top of Azure Arc-enabled Kubernetes cluster, referenced in later steps as `extensionId`:

    ```azurecli
    az k8s-extension show --name <extensionInstanceName> --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Create custom location by referencing the Azure Arc-enabled Kubernetes cluster and the extension:

    ```azurecli
    az customlocation create -n <customLocationName> -g <resourceGroupName> --namespace arc --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionId>
    ```

## Next steps

- Securely connect to the cluster using [Cluster Connect](cluster-connect.md).
- Continue with [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md) for end-to-end instructions on installing extensions, creating custom locations, and creating the App Service Kubernetes environment. 
- Create an Event Grid topic and an event subscription for [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md).
- Learn more about currently available [Azure Arc-enabled Kubernetes extensions](extensions.md#currently-available-extensions).
