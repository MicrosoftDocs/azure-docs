---
title: 'Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes'
description: 'Tutorial: learn how to set up Azure Container Apps in your Azure Arc-enabled Kubernetes clusters.'
services: container-apps
author: v-jaswel
ms.service: container-apps
ms.custom: devx-track-azurecli, devx-track-linux
ms.topic: tutorial
ms.date: 3/24/2023
ms.author: v-wellsjason
---
---
# Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes (Preview)

With [Azure Arc-enabled Kubernetes clusters](../azure-arc/kubernetes/overview.md), you can create a [Container Apps enabled custom location](azure-arc-create-container-app.md) in your on-premises or cloud Kubernetes cluster to deploy your Azure Container Apps applications as you would any other region.

This tutorial will show you how to enable Azure Container Apps on your Arc-enabled Kubernetes cluster.  In this tutorial you will:

> [!div class="checklist"]
> * Create a connected cluster.
> * Create a Log Analytics workspace.
> * Install the Container Apps extension.
> * Create a custom location.
> * Create the Azure Container Apps connected environment.

> [!NOTE]
> During the preview, Azure Container Apps on Arc are not supported in production configurations. This article provides an example configuration for evaluation purposes only.
>
> This tutorial uses [Azure Kubernetes Service (AKS)](../aks/index.yml) to provide concrete instructions for setting up an environment from scratch. However, for a production workload, you may not want to enable Azure Arc on an AKS cluster as it is already managed in Azure. 



## Prerequisites

- An Azure account with an active subscription.
  - If you don't have one, you [can create one for free](https://azure.microsoft.com/free/).
- Install the [Azure CLI](/cli/azure/install-azure-cli).
- Access to a public or private container registry, such as the [Azure Container Registry](../container-registry/index.yml).

## Setup

Install the following Azure CLI extensions.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az extension add --name connectedk8s  --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
az extension add --name customlocation --upgrade --yes
az extension remove --name containerapp
az extension add --source https://aka.ms/acaarccli/containerapp-latest-py2.py3-none-any.whl --yes
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
az extension add --name connectedk8s  --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
az extension add --name customlocation --upgrade --yes
az extension remove --name containerapp
az extension add --source https://aka.ms/acaarccli/containerapp-latest-py2.py3-none-any.whl --yes
```

---

Register the required namespaces.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.OperationalInsights --wait
```

---

Set environment variables based on your Kubernetes cluster deployment.

# [Azure CLI](#tab/azure-cli)

```bash
GROUP_NAME="my-arc-cluster-group"
AKS_CLUSTER_GROUP_NAME="my-aks-cluster-group"
AKS_NAME="my-aks-cluster" 
LOCATION="eastus" 
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$GROUP_NAME="my-arc-cluster-group"
$AKS_CLUSTER_GROUP_NAME="my-aks-cluster-group"
$AKS_NAME="my-aks-cluster" 
$LOCATION="eastus" 
```

---

## Create a connected cluster

The following steps help you get started understanding the service, but for production deployments, they should be viewed as illustrative, not prescriptive. See [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md) for general instructions on creating an Azure Arc-enabled Kubernetes cluster.

1. Create a cluster in Azure Kubernetes Service.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az group create --name $AKS_CLUSTER_GROUP_NAME --location $LOCATION
    az aks create \
       --resource-group $AKS_CLUSTER_GROUP_NAME \
       --name $AKS_NAME \
       --enable-aad \
       --generate-ssh-keys
    ```

    # [PowerShell](#tab/azure-powershell)
    
    ```azurepowershell-interactive
    az group create --name $AKS_CLUSTER_GROUP_NAME --location $LOCATION
    az aks create `
       --resource-group $AKS_CLUSTER_GROUP_NAME `
       --name $AKS_NAME `
       --enable-aad `
       --generate-ssh-keys
    ```

    ---

1. Get the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file and test your connection to the cluster. By default, the kubeconfig file is saved to `~/.kube/config`.

    ```azurecli-interactive
    az aks get-credentials --resource-group $AKS_CLUSTER_GROUP_NAME --name $AKS_NAME --admin
    
    kubectl get ns
    ```

1. Create a resource group to contain your Azure Arc resources. 

    # [Azure CLI](#tab/azure-cli)

     ```azurecli-interactive
        az group create --name $GROUP_NAME --location $LOCATION
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    az group create --name $GROUP_NAME --location $LOCATION
    ```

    ---

1. Connect the cluster you created to Azure Arc.

    # [Azure CLI](#tab/azure-cli)

     ```azurecli-interactive
    CLUSTER_NAME="${GROUP_NAME}-cluster" # Name of the connected cluster resource
    
    az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $CLUSTER_NAME="${GROUP_NAME}-cluster" # Name of the connected cluster resource
    
    az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```

    ---

1. Validate the connection with the following command. It should show the `provisioningState` property as `Succeeded`. If not, run the command again after a minute.

    ```azurecli-interactive
    az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```

## Create a Log Analytics workspace

A [Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md) provides access to logs for Container Apps applications running in the Azure Arc-enabled Kubernetes cluster.  A Log Analytics workspace is optional, but recommended.

1. Create a Log Analytics workspace.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    WORKSPACE_NAME="$GROUP_NAME-workspace" # Name of the Log Analytics workspace
    
    az monitor log-analytics workspace create \
        --resource-group $GROUP_NAME \
        --workspace-name $WORKSPACE_NAME
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $WORKSPACE_NAME="$GROUP_NAME-workspace"

    az monitor log-analytics workspace create `
        --resource-group $GROUP_NAME `
        --workspace-name $WORKSPACE_NAME
    ```

    ---

1. Run the following commands to get the encoded workspace ID and shared key for an existing Log Analytics workspace. You need them in the next step.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    LOG_ANALYTICS_WORKSPACE_ID=$(az monitor log-analytics workspace show \
        --resource-group $GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --query customerId \
        --output tsv)
    LOG_ANALYTICS_WORKSPACE_ID_ENC=$(printf %s $LOG_ANALYTICS_WORKSPACE_ID | base64 -w0) # Needed for the next step
    LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys \
        --resource-group $GROUP_NAME \
        --workspace-name $WORKSPACE_NAME \
        --query primarySharedKey \
        --output tsv)
    LOG_ANALYTICS_KEY_ENC=$(printf %s $LOG_ANALYTICS_KEY | base64 -w0) # Needed for the next step
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $LOG_ANALYTICS_WORKSPACE_ID=$(az monitor log-analytics workspace show `
        --resource-group $GROUP_NAME `
        --workspace-name $WORKSPACE_NAME `
        --query customerId `
        --output tsv)
    $LOG_ANALYTICS_WORKSPACE_ID_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_WORKSPACE_ID))# Needed for the next step
    $LOG_ANALYTICS_KEY=$(az monitor log-analytics workspace get-shared-keys `
        --resource-group $GROUP_NAME `
        --workspace-name $WORKSPACE_NAME `
        --query primarySharedKey `
        --output tsv)
    $LOG_ANALYTICS_KEY_ENC=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($LOG_ANALYTICS_KEY))
    ```

    ---

## Install the Container Apps extension

1. Set the following environment variables to the desired name of the [Container Apps extension](azure-arc-create-container-app.md), the cluster namespace in which resources should be provisioned, and the name for the Azure Container Apps connected environment. Choose a unique name for `<connected-environment-name>`.  The connected environment name will be part of the domain name for app you'll create in the Azure Container Apps connected environment.

    # [Azure CLI](#tab/azure-cli)

    ```bash
    EXTENSION_NAME="appenv-ext" 
    NAMESPACE="appplat-ns"
    CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>"
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $EXTENSION_NAME="appenv-ext"
    $NAMESPACE="appplat-ns" 
    $CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>" 
    ```

    ---

1. Install the Container Apps extension to your Azure Arc-connected cluster with Log Analytics enabled. Log Analytics can't be added to the extension later.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az k8s-extension create \
        --resource-group $GROUP_NAME \
        --name $EXTENSION_NAME \
        --cluster-type connectedClusters \
        --cluster-name $CLUSTER_NAME \
        --extension-type 'Microsoft.App.Environment' \
        --release-train stable \
        --auto-upgrade-minor-version true \
        --scope cluster \
        --release-namespace $NAMESPACE \
        --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" \
        --configuration-settings "appsNamespace=${NAMESPACE}" \
        --configuration-settings "clusterName=${CONNECTED_ENVIRONMENT_NAME}" \
        --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${AKS_CLUSTER_GROUP_NAME}" \
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" \
        --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" \
        --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    az k8s-extension create `
        --resource-group $GROUP_NAME `
        --name $EXTENSION_NAME `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --extension-type 'Microsoft.App.Environment' `
        --release-train stable `
        --auto-upgrade-minor-version true `
        --scope cluster `
        --release-namespace $NAMESPACE `
        --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" `
        --configuration-settings "appsNamespace=${NAMESPACE}" `
        --configuration-settings "clusterName=${CONNECTED_ENVIRONMENT_NAME}" `
        --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${AKS_CLUSTER_GROUP_NAME}" `
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" `
        --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" `
        --configuration-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
    ```

    ---

    > [!NOTE]
    > To install the extension without Log Analytics integration, remove the last three `--configuration-settings` parameters from the command.
    >

    The following table describes the various `--configuration-settings` parameters when running the command:

    | Parameter | Description |
    |---|---|
    | `Microsoft.CustomLocation.ServiceAccount` | The service account created for the custom location. It's recommended that it 's set to the value `default`. |
    | `appsNamespace` | The namespace used to create the app definitions and revisions. It **must** match that of the extension release namespace. |
    | `clusterName` | The name of the Container Apps extension Kubernetes environment that will be created against this extension. |
    | `logProcessor.appLogs.destination` | Optional. Destination for application logs. Accepts `log-analytics` or `none`, choosing none disables platform logs. |
    | `logProcessor.appLogs.logAnalyticsConfig.customerId` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log analytics workspace ID. This parameter should be configured as a protected setting. |
    | `logProcessor.appLogs.logAnalyticsConfig.sharedKey` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log analytics workspace shared key. This parameter should be configured as a protected setting. |
    | `envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group` | The name of the resource group in which the Azure Kubernetes Service cluster resides. Valid and required only when the underlying cluster is Azure Kubernetes Service. |

1. Save the `id` property of the Container Apps extension for later.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    EXTENSION_ID=$(az k8s-extension show \
        --cluster-type connectedClusters \
        --cluster-name $CLUSTER_NAME \
        --resource-group $GROUP_NAME \
        --name $EXTENSION_NAME \
        --query id \
        --output tsv)
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $EXTENSION_ID=$(az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --resource-group $GROUP_NAME `
        --name $EXTENSION_NAME `
        --query id `
        --output tsv)
    ```

    ---

1. Wait for the extension to fully install before proceeding. You can have your terminal session wait until it completes by running the following command:

    ```azurecli-interactive
    az resource wait --ids $EXTENSION_ID --custom "properties.provisioningState!='Pending'" --api-version "2020-07-01-preview"
    ```

You can use `kubectl` to see the pods that have been created in your Kubernetes cluster:

```bash
kubectl get pods -n $NAMESPACE
```

To learn more about these pods and their role in the system, see [Azure Arc overview](azure-arc-overview.md#resources-created-by-the-container-apps-extension).

## Create a custom location

The [custom location](../azure-arc/kubernetes/custom-locations.md) is an Azure location that you assign to the Azure Container Apps connected environment.

1. Set the following environment variables to the desired name of the custom location and for the ID of the Azure Arc-connected cluster.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    CUSTOM_LOCATION_NAME="my-custom-location" # Name of the custom location
    CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME --query id --output tsv)
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    $CUSTOM_LOCATION_NAME="my-custom-location" # Name of the custom location
    $CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME --query id --output tsv)
    ```

    ---

1. Create the custom location:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az customlocation create \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --host-resource-id $CONNECTED_CLUSTER_ID \
        --namespace $NAMESPACE \
        --cluster-extension-ids $EXTENSION_ID
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurecli
    az customlocation create `
        --resource-group $GROUP_NAME `
        --name $CUSTOM_LOCATION_NAME `
        --host-resource-id $CONNECTED_CLUSTER_ID `
        --namespace $NAMESPACE `
        --cluster-extension-ids $EXTENSION_ID
    ```

    ---

    > [!NOTE]
    > If you experience issues creating a custom location on your cluster, you may need to [enable the custom location feature on your cluster](../azure-arc/kubernetes/custom-locations.md#enable-custom-locations-on-your-cluster).  This is required if logged into the CLI using a Service Principal or if you are logged in with an Azure Active Directory user with restricted permissions on the cluster resource.
    >

1. Validate that the custom location is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, rerun the command after a minute.

    ```azurecli-interactive
    az customlocation show --resource-group $GROUP_NAME --name $CUSTOM_LOCATION_NAME
    ```

1. Save the custom location ID for the next step.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    CUSTOM_LOCATION_ID=$(az customlocation show \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --query id \
        --output tsv)
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurecli-interactive
    $CUSTOM_LOCATION_ID=$(az customlocation show `
        --resource-group $GROUP_NAME `
        --name $CUSTOM_LOCATION_NAME `
        --query id `
        --output tsv)
    ```

    ---

## Create the Azure Container Apps connected environment

Before you can start creating apps in the custom location, you need an [Azure Container Apps connected environment](azure-arc-create-container-app.md).

1. Create the Container Apps connected environment:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az containerapp connected-env create \
        --resource-group $GROUP_NAME \
        --name $CONNECTED_ENVIRONMENT_NAME \
        --custom-location $CUSTOM_LOCATION_ID \
        --location $LOCATION
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurecli-interactive
    az containerapp connected-env create `
        --resource-group $GROUP_NAME `
        --name $CONNECTED_ENVIRONMENT_NAME `
        --custom-location $CUSTOM_LOCATION_ID `
        --location $LOCATION
    ```

    ---

1. Validate that the Container Apps connected environment is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, run it again after a minute.

    ```azurecli-interactive
    az containerapp connected-env show --resource-group $GROUP_NAME --name $CONNECTED_ENVIRONMENT_NAME
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a container app on Azure Arc](azure-arc-create-container-app.md)
