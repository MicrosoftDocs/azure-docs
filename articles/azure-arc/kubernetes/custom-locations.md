---
title: "Create and manage custom locations on Azure Arc-enabled Kubernetes"
ms.date: 11/01/2022
ms.topic: how-to
ms.custom: references_regions, devx-track-azurecli
description: "Use custom locations to deploy Azure PaaS services on Azure Arc-enabled Kubernetes clusters"
---

# Create and manage custom locations on Azure Arc-enabled Kubernetes

 The *custom locations* feature provides a way for tenant or cluster administrators to configure their Azure Arc-enabled Kubernetes clusters as target locations for deploying instances of Azure offerings. Examples of Azure offerings that can be deployed on top of custom locations include databases, such as SQL Managed Instance enabled by Azure Arc and Azure Arc-enabled PostgreSQL server, or application instances, such as App Services, Functions, Event Grid, Logic Apps, and API Management.

A custom location has a one-to-one mapping to a namespace within the Azure Arc-enabled Kubernetes cluster. The custom location Azure resource combined with Azure role-based access control (Azure RBAC) can be used to grant granular permissions to application developers or database admins, enabling them to deploy resources such as databases or application instances on top of Arc-enabled Kubernetes clusters in a multi-tenant manner.

A conceptual overview of this feature is available in [Custom locations - Azure Arc-enabled Kubernetes](conceptual-custom-locations.md).

In this article, you learn how to:
> [!div class="checklist"]
> - Enable custom locations on your Azure Arc-enabled Kubernetes cluster.
> - Create a custom location.

## Prerequisites

- [Install or upgrade Azure CLI](/cli/azure/install-azure-cli) to the latest version.

- Install the latest versions of the following Azure CLI extensions:
  - `connectedk8s`
  - `k8s-extension`
  - `customlocation`
  
    ```azurecli
    az extension add --name connectedk8s
    az extension add --name k8s-extension
    az extension add --name customlocation
    ```

    If you have already installed the `connectedk8s`, `k8s-extension`, and `customlocation` extensions, update to the **latest version** by using the following command:

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

        Once registered, the `RegistrationState` state will have the `Registered` value.

- Verify you have an existing [Azure Arc-enabled Kubernetes connected cluster](quickstart-connect-cluster.md).
  - [Upgrade your agents](agent-upgrade.md#manually-upgrade-agents) to the latest version.

## Enable custom locations on your cluster

If you are signed in to Azure CLI as a Microsoft Entra user, to enable this feature on your cluster, execute the following command:

```azurecli
az connectedk8s enable-features -n <clusterName> -g <resourceGroupName> --features cluster-connect custom-locations
```

If you run the above command while signed in to Azure CLI using a service principal, you may observe the following warning:

```console
Unable to fetch oid of 'custom-locations' app. Proceeding without enabling the feature. Insufficient privileges to complete the operation.
```

This is because a service principal doesn't have permissions to get information about the application used by the Azure Arc service. To avoid this error, complete the following steps:

1. Sign in to Azure CLI using your user account. Fetch the `objectId` or `id` of the Microsoft Entra application used by Azure Arc service. The command you use depends on your version of Azure CLI.

   If you're using an Azure CLI version lower than 2.37.0, use the following command:

   ```azurecli
   az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query objectId -o tsv
   ```

   If you're using Azure CLI version 2.37.0 or higher, use the following command instead:

   ```azurecli
   az ad sp show --id bc313c14-388c-4e7d-a58e-70017303ee3b --query id -o tsv
   ```

1. Sign in to Azure CLI using the service principal. Use the `<objectId>` or `id` value from the previous step to enable custom locations on the cluster:

    ```azurecli
    az connectedk8s enable-features -n <cluster-name> -g <resource-group-name> --custom-locations-oid <objectId/id> --features cluster-connect custom-locations
    ```

> [!NOTE]
> The custom locations feature is dependent on the [Cluster Connect](cluster-connect.md) feature. Both features have to be enabled for custom locations to work.
>
> `az connectedk8s enable-features` must be run on a machine where the `kubeconfig` file is pointing to the cluster on which the features are to be enabled.

## Create custom location

1. Deploy the Azure service cluster extension of the Azure service instance you want to install on your cluster:

   - [Azure Arc-enabled Data Services](../data/create-data-controller-direct-prerequisites.md)

     > [!NOTE]
     > Outbound proxy without authentication and outbound proxy with basic authentication are supported by the Azure Arc-enabled Data Services cluster extension. Outbound proxy that expects trusted certificates is currently not supported.

   - [Azure App Service on Azure Arc](../../app-service/manage-create-arc-environment.md#install-the-app-service-extension)

   - [Event Grid on Kubernetes](../../event-grid/kubernetes/install-k8s-extension.md)

1. Get the Azure Resource Manager identifier of the Azure Arc-enabled Kubernetes cluster, referenced in later steps as `connectedClusterId`:

    ```azurecli
    az connectedk8s show -n <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Get the Azure Resource Manager identifier of the cluster extension deployed on top of Azure Arc-enabled Kubernetes cluster, referenced in later steps as `extensionId`:

    ```azurecli
    az k8s-extension show --name <extensionInstanceName> --cluster-type connectedClusters -c <clusterName> -g <resourceGroupName>  --query id -o tsv
    ```

1. Create the custom location by referencing the Azure Arc-enabled Kubernetes cluster and the extension:

    ```azurecli
    az customlocation create -n <customLocationName> -g <resourceGroupName> --namespace <name of namespace> --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionIds> 
    ```

   - Required parameters:

     | Parameter name | Description |
     |----------------|------------|
     | `--name, --n` | Name of the custom location |
     | `--resource-group, --g` | Resource group of the custom location  |
     | `--namespace` | Namespace in the cluster bound to the custom location being created |
     | `--host-resource-id` | Azure Resource Manager identifier of the Azure Arc-enabled Kubernetes cluster (connected cluster) |
     | `--cluster-extension-ids` | Azure Resource Manager identifiers of the cluster extension instances installed on the connected cluster. Provide a space-separated list of the cluster extension IDs  |

   - Optional parameters:

     | Parameter name | Description |
     |--------------|------------|
     | `--location, --l` | Location of the custom location Azure Resource Manager resource in Azure. By default it will be set to the location of the connected cluster |
     | `--tags` | Space-separated list of tags: key[=value] [key[=value] ...]. Use '' to clear existing tags |
     | `--kubeconfig` | Admin `kubeconfig` of cluster |

## Show details of a custom location

To show the details of a custom location, use the following command:

```azurecli
az customlocation show -n <customLocationName> -g <resourceGroupName> 
```

Required parameters:

| Parameter name | Description |
|----------------|------------|
| `--name, --n` | Name of the custom location |
| `--resource-group, --g` | Resource group of the custom location  |

## List custom locations

To list all custom locations in a resource group, use the following command:

```azurecli
az customlocation list -g <resourceGroupName> 
```

Required parameters:

| Parameter name | Description |
|----------------|------------|
| `--resource-group, --g` | Resource group of the custom location  |

## Update a custom location

Use the `update` command to add new tags or associate new cluster extension IDs to the custom location while retaining existing tags and associated cluster extensions. `--cluster-extension-ids`, `--tags`,  `assign-identity` can be updated.

```azurecli
az customlocation update -n <customLocationName> -g <resourceGroupName> --namespace <name of namespace> --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionIds> 
```

Required parameters:

| Parameter name | Description |
|----------------|------------|
| `--name, --n` | Name of the custom location |
| `--resource-group, --g` | Resource group of the custom location  |
| `--namespace` | Namespace in the cluster bound to the custom location being created |
| `--host-resource-id` | Azure Resource Manager identifier of the Azure Arc-enabled Kubernetes cluster (connected cluster) |

Optional parameters:

| Parameter name | Description |
|--------------|------------|
| `--cluster-extension-ids` | Associate new cluster extensions to this custom location by providing Azure Resource Manager identifiers of the cluster extension instances installed on the connected cluster. Provide a space-separated list of the cluster extension IDs |
| `--tags` | Add new tags in addition to existing tags. Space-separated list of tags: key[=value] [key[=value] ...]. |

## Patch a custom location

Use the `patch` command to replace existing tags, cluster extension IDs with new tags, and cluster extension IDs. `--cluster-extension-ids`, `assign-identity`, `--tags` can be patched.

```azurecli
az customlocation patch -n <customLocationName> -g <resourceGroupName> --namespace <name of namespace> --host-resource-id <connectedClusterId> --cluster-extension-ids <extensionIds> 
```

Required parameters:

| Parameter name | Description |
|----------------|------------|
| `--name, --n` | Name of the custom location |
| `--resource-group, --g` | Resource group of the custom location  |

Optional parameters:

| Parameter name | Description |
|--------------|------------|
| `--cluster-extension-ids` | Associate new cluster extensions to this custom location by providing Azure Resource Manager identifiers of the cluster extension instances installed on the connected cluster. Provide a space-separated list of the cluster extension IDs |
| `--tags` | Add new tags in addition to existing tags. Space-separated list of tags: key[=value] [key[=value] ...]. |

## Delete a custom location

To delete a custom location, use the following command:

```azurecli
az customlocation delete -n <customLocationName> -g <resourceGroupName> 
```

Required parameters:

| Parameter name | Description |
|----------------|------------|
| `--name, --n` | Name of the custom location |
| `--resource-group, --g` | Resource group of the custom location  |

## Troubleshooting

If custom location creation fails with the error 'Unknown proxy error occurred', it may be due to network policies configured to disallow pod-to-pod internal communication.

To resolve this issue, modify your network policy to allow pod-to-pod internal communication within the `azure-arc` namespace. Be sure to also add the `azure-arc` namespace as part of the no-proxy exclusion list for your configured policy.

## Next steps

- Securely connect to the cluster using [Cluster Connect](cluster-connect.md).
- Continue with [Azure App Service on Azure Arc](../../app-service/overview-arc-integration.md) for end-to-end instructions on installing extensions, creating custom locations, and creating the App Service Kubernetes environment.
- Create an Event Grid topic and an event subscription for [Event Grid on Kubernetes](../../event-grid/kubernetes/overview.md).
- Learn more about currently available [Azure Arc-enabled Kubernetes extensions](extensions-release.md).
