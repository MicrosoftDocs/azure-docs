---
title: 'Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes'
description: 'Tutorial: learn how to set up Azure Container Apps in your Azure Arc-enabled Kubernetes clusters.'
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom:
  - devx-track-azurecli
  - build-2025
ms.topic: tutorial
ms.date: 09/15/2026
ms.author: cshoe
---

# Tutorial: Enable Azure Container Apps on Azure Arc-enabled Kubernetes

This tutorial prepares a supported Kubernetes cluster to run Azure Container Apps. It creates an [Azure Arc-enabled Kubernetes cluster](/azure/azure-arc/kubernetes/overview), installs the Container Apps extension, creates a [custom location](/azure/azure-arc/kubernetes/custom-locations), and creates a Container Apps connected environment.

Completing this tutorial changes both your Azure subscription and your Kubernetes cluster. You need Azure permissions to create the listed resources and cluster-admin access to the Kubernetes cluster.

This tutorial shows how to enable Azure Container Apps on an Azure Arc-enabled Kubernetes cluster. In this tutorial, you:

> [!div class="checklist"]
>
> * Connect a Kubernetes cluster to Azure Arc, if it isn't already connected.
> * Optionally create a Log Analytics workspace.
> * Install and validate the Container Apps extension.
> * Create and validate a custom location.
> * Create and validate a Container Apps connected environment.

Before you begin, review [Azure Container Apps on Azure Arc](azure-arc-overview.md). If a resource or in-cluster component doesn't become ready, see [Troubleshoot Azure Container Apps on Azure Arc-enabled Kubernetes](azure-arc-troubleshoot.md).

## Prerequisites

Before you begin, verify the following requirements:

* An Azure account with an active subscription. If you don't have one, [create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* Permission to register resource providers and create resource groups, an Azure Arc-enabled Kubernetes resource, a cluster extension, a custom location, a Container Apps connected environment, and optionally a Log Analytics workspace.
* The [Azure CLI](/cli/azure/install-azure-cli) and its prerequisites.
* A `kubectl` version compatible with your Kubernetes cluster and network access from your workstation to the Kubernetes API server.
* A supported Kubernetes cluster with Linux `amd64` worker nodes and cluster-admin access through the active `kubectl` context.
* A working Kubernetes `LoadBalancer` service implementation.
* Outbound connectivity to the endpoints required by Azure Arc and Container Apps.
* Sufficient allocatable CPU and memory for the extension and application workloads.

Before changing a production cluster, review [Plan a Container Apps deployment on Azure Arc-enabled Kubernetes](azure-arc-plan.md).

## Setup

Install the following Azure CLI extensions.

# [Azure CLI](#tab/azure-cli)

```azurecli
az extension add --name connectedk8s --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
az extension add --name customlocation --upgrade --yes
az extension add --name containerapp --upgrade --yes
```

# [PowerShell](#tab/powershell)

```powershell
az extension add --name connectedk8s --upgrade --yes
az extension add --name k8s-extension --upgrade --yes
az extension add --name customlocation --upgrade --yes
az extension add --name containerapp --upgrade --yes
```

---

Register the required namespaces.

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.Web --wait
az provider register --namespace Microsoft.OperationalInsights --wait
```

# [PowerShell](#tab/powershell)

```powershell
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az provider register --namespace Microsoft.App --wait
az provider register --namespace Microsoft.Web --wait
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

# [PowerShell](#tab/powershell)

```powershell
$GROUP_NAME="my-arc-cluster-group"
$AKS_CLUSTER_GROUP_NAME="my-aks-cluster-group"
$AKS_NAME="my-aks-cluster"
$LOCATION="eastus"
```

---

## Create a connected cluster

If you already have a supported Azure Arc-enabled Kubernetes cluster in `$GROUP_NAME`, don't create another cluster. Set `CLUSTER_NAME` to the existing connected-cluster resource name, verify access with `kubectl get nodes`, and continue to [Create a Log Analytics workspace](#create-a-log-analytics-workspace).

The following steps create an AKS cluster and connect it to Azure Arc. This path is intended only as an Azure-hosted evaluation environment for the tutorial. For an existing on-premises or multicloud cluster, follow [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](/azure/azure-arc/kubernetes/quickstart-connect-cluster), and then return to this tutorial.

1. Create a cluster in Azure Kubernetes Service.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name $AKS_CLUSTER_GROUP_NAME --location $LOCATION
    az aks create \
       --resource-group $AKS_CLUSTER_GROUP_NAME \
       --name $AKS_NAME \
       --enable-aad \
       --generate-ssh-keys
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az group create --name $AKS_CLUSTER_GROUP_NAME --location $LOCATION
    az aks create `
       --resource-group $AKS_CLUSTER_GROUP_NAME `
       --name $AKS_NAME `
       --enable-aad `
       --generate-ssh-keys
    ```

    ---

1. Get the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file and test your connection to the cluster. By default, the kubeconfig file is saved to `~/.kube/config`.

    ```azurecli
    az aks get-credentials --resource-group $AKS_CLUSTER_GROUP_NAME --name $AKS_NAME --admin

    kubectl get ns
    ```

1. Create a resource group to contain your Azure Arc resources.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az group create --name $GROUP_NAME --location $LOCATION
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az group create --name $GROUP_NAME --location $LOCATION
    ```

    ---

1. Connect the cluster you created to Azure Arc.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    CLUSTER_NAME="${GROUP_NAME}-cluster" # Name of the connected cluster resource

    az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CLUSTER_NAME="${GROUP_NAME}-cluster" # Name of the connected cluster resource

    az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```

    ---

1. Wait for the connected cluster to finish provisioning.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    CONNECTED_CLUSTER_ID=$(az connectedk8s show \
        --resource-group $GROUP_NAME \
        --name $CLUSTER_NAME \
        --query id \
        --output tsv)

    az resource wait --ids $CONNECTED_CLUSTER_ID --created --timeout 600

    az connectedk8s show \
        --resource-group $GROUP_NAME \
        --name $CLUSTER_NAME \
        --query "{State:provisioningState,Connectivity:connectivityStatus}" \
        --output table
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CONNECTED_CLUSTER_ID=$(az connectedk8s show `
        --resource-group $GROUP_NAME `
        --name $CLUSTER_NAME `
        --query id `
        --output tsv)

    az resource wait --ids $CONNECTED_CLUSTER_ID --created --timeout 600

    az connectedk8s show `
        --resource-group $GROUP_NAME `
        --name $CLUSTER_NAME `
        --query "{State:provisioningState,Connectivity:connectivityStatus}" `
        --output table
    ```

    ---

    Continue only when `State` is `Succeeded` and `Connectivity` is `Connected`. If the command times out, see [Connected cluster isn't ready](azure-arc-troubleshoot.md#connected-cluster-isnt-ready).

## Create a Log Analytics workspace

A [Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace) provides access to application logs for Container Apps running in the Azure Arc-enabled Kubernetes cluster. A Log Analytics workspace is optional but recommended for application diagnostics.

> [!IMPORTANT]
> Decide whether to use Log Analytics before installing the Container Apps extension. Supply the Log Analytics configuration during extension installation. You can't add Log Analytics configuration to that extension instance later.

1. Create a Log Analytics workspace.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    WORKSPACE_NAME="$GROUP_NAME-workspace" # Name of the Log Analytics workspace

    az monitor log-analytics workspace create \
        --resource-group $GROUP_NAME \
        --workspace-name $WORKSPACE_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $WORKSPACE_NAME="$GROUP_NAME-workspace"

    az monitor log-analytics workspace create `
        --resource-group $GROUP_NAME `
        --workspace-name $WORKSPACE_NAME
    ```

    ---

1. Run the following commands to get the encoded workspace ID and shared key for an existing Log Analytics workspace. You need them in the next step.

    > [!CAUTION]
    > The workspace shared key is a credential. Don't print it, commit it to source control, store it in shell history, or include it in support bundles. The following commands keep it in a shell variable and pass it to Azure as a protected extension setting.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
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

    # [PowerShell](#tab/powershell)

    ```powershell
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

## Check for an existing KEDA installation

The Container Apps extension installs KEDA. Before installing the extension, check the cluster for existing KEDA components:

```bash
kubectl get deployments -A -o custom-columns="NAMESPACE:.metadata.namespace,NAME:.metadata.name"
kubectl get crd scaledobjects.keda.sh
```

Inspect the deployment list for KEDA components. If either command identifies an existing KEDA installation, stop and confirm the supported coexistence configuration before continuing. Don't remove the existing KEDA installation or apply undocumented extension settings because other workloads might depend on it.

## Install the Container Apps extension

> [!IMPORTANT]
> If you're deploying onto **AKS on Azure Local**, ensure that you [set up HAProxy or a custom load balancer](/azure/aks/aksarc/configure-load-balancer) before attempting to install the extension. You can also use `az containerapp arc setup-core-dns --distro AksAzureLocal` to set up CoreDNS for local contexts.

1. Set names for the [Container Apps extension](/azure/azure-arc/kubernetes/conceptual-extensions), its Kubernetes namespace, and the connected environment.

    * `EXTENSION_NAME` identifies the Azure cluster-extension resource.
    * `NAMESPACE` is created in the Kubernetes cluster and contains extension components and Container Apps-managed resources. The `appsNamespace` setting must exactly match the extension release namespace.
    * `CONNECTED_ENVIRONMENT_NAME` becomes part of the default application domain. Use a DNS-compatible name that's unique within the resource group.

    Don't install unrelated workloads in the extension namespace.

    # [Azure CLI](#tab/azure-cli)

    ```bash
    EXTENSION_NAME="appenv-ext"
    NAMESPACE="appplat-ns"
    CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $EXTENSION_NAME="appenv-ext"
    $NAMESPACE="appplat-ns"
    $CONNECTED_ENVIRONMENT_NAME="<connected-environment-name>"
    ```

    ---

1. Install the Container Apps extension to your Azure Arc-connected cluster with Log Analytics enabled. Log Analytics can't be added to the extension later.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
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
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" \
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" \
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
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
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" `
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" `
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
    ```

    ---

    > [!NOTE]
    > To install the extension without Log Analytics integration, remove the three logging-related parameters from the command.
    >
    > For a cluster that uses a custom load balancer, set `loadBalancerIp` to an address reserved for Container Apps ingress:
    > ```azurecli
    > --configuration-settings "loadBalancerIp=<LOAD_BALANCER_INGRESS_IP>"
    > ```
    > The address must be reachable by application clients and must not be assigned to another service. After installation, use `kubectl get service -n $NAMESPACE -o wide` to verify that the extension ingress service reports this address. Configure wildcard DNS only after the address is assigned. See [DNS requirements](azure-arc-plan.md#dns-requirements).

    The following table describes the various `--configuration-settings` parameters when running the command:

    | Parameter | Description |
    | --- | --- |
    | `Microsoft.CustomLocation.ServiceAccount` | The service account created for the custom location. Set the value to `default`. |
    | `appsNamespace` | The namespace used to create the app definitions and revisions. It **must** match that of the extension release namespace. |
    | `clusterName` | The name of the Container Apps extension Kubernetes environment created against this extension. |
    | `logProcessor.appLogs.destination` | Optional. Destination for application logs. Accepts `log-analytics` or `none`, choosing none disables platform logs. |
    | `logProcessor.appLogs.logAnalyticsConfig.customerId` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log Analytics workspace ID. This parameter should be configured as a protected setting. |
    | `logProcessor.appLogs.logAnalyticsConfig.sharedKey` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log Analytics workspace shared key. This parameter should be configured as a protected setting. |
    | `loadBalancerIp` | The ingress IP of the load balancer. |

1. Save the `id` property of the Container Apps extension for later.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    EXTENSION_ID=$(az k8s-extension show \
        --cluster-type connectedClusters \
        --cluster-name $CLUSTER_NAME \
        --resource-group $GROUP_NAME \
        --name $EXTENSION_NAME \
        --query id \
        --output tsv)
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $EXTENSION_ID=$(az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --resource-group $GROUP_NAME `
        --name $EXTENSION_NAME `
        --query id `
        --output tsv)
    ```

    ---

1. Wait for the extension to fully install before proceeding.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az resource wait --ids $EXTENSION_ID --created --timeout 1200

    az k8s-extension show \
        --cluster-type connectedClusters \
        --cluster-name $CLUSTER_NAME \
        --resource-group $GROUP_NAME \
        --name $EXTENSION_NAME \
        --query "{State:provisioningState,Version:currentVersion}" \
        --output table
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az resource wait --ids $EXTENSION_ID --created --timeout 1200

    az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $CLUSTER_NAME `
        --resource-group $GROUP_NAME `
        --name $EXTENSION_NAME `
        --query "{State:provisioningState,Version:currentVersion}" `
        --output table
    ```

    ---

    Continue only when `State` is `Succeeded`. If the command times out or reports a failure, see [Extension installation fails or times out](azure-arc-troubleshoot.md#extension-installation-fails-or-times-out).

1. Inspect the extension workloads, services, and recent events:

    ```bash
    kubectl get pods -n $NAMESPACE
    kubectl get services -n $NAMESPACE -o wide
    kubectl get events -n $NAMESPACE --sort-by=.lastTimestamp
    ```

    Don't create the custom location while an extension pod is pending, repeatedly restarting, or unexpectedly not ready. To learn more about these pods and their role in the system, see [Azure Arc overview](azure-arc-overview.md#resources-created-by-the-container-apps-extension).

1. If you configured Log Analytics, clear the local variables that contain the workspace key.

    # [Azure CLI](#tab/azure-cli)

    ```bash
    unset LOG_ANALYTICS_KEY LOG_ANALYTICS_KEY_ENC
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    Remove-Variable LOG_ANALYTICS_KEY, LOG_ANALYTICS_KEY_ENC -ErrorAction SilentlyContinue
    ```

    ---

## Create a custom location

The [custom location](/azure/azure-arc/kubernetes/custom-locations) is an Azure location that you assign to the Azure Container Apps connected environment.

1. Set the following environment variables to the desired name of the custom location and for the ID of the Azure Arc-connected cluster.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    CUSTOM_LOCATION_NAME="my-custom-location" # Name of the custom location
    CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME --query id --output tsv)
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CUSTOM_LOCATION_NAME="my-custom-location" # Name of the custom location
    $CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME --query id --output tsv)
    ```

    ---

1. Create the custom location:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az customlocation create \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --host-resource-id $CONNECTED_CLUSTER_ID \
        --namespace $NAMESPACE \
        --cluster-extension-ids $EXTENSION_ID
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az customlocation create `
        --resource-group $GROUP_NAME `
        --name $CUSTOM_LOCATION_NAME `
        --host-resource-id $CONNECTED_CLUSTER_ID `
        --namespace $NAMESPACE `
        --cluster-extension-ids $EXTENSION_ID
    ```

    ---

    > [!NOTE]
    > If you have trouble creating a custom location on your cluster, you might need to [enable the custom location feature on your cluster](/azure/azure-arc/kubernetes/custom-locations#enable-custom-locations-on-your-cluster). Enable this feature when you sign in to the CLI by using a service principal or a Microsoft Entra user with restricted permissions on the cluster resource.

1. Wait for the custom location to finish provisioning and save its resource ID.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    CUSTOM_LOCATION_ID=$(az customlocation show \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --query id \
        --output tsv)

    az resource wait --ids $CUSTOM_LOCATION_ID --created --timeout 600

    az customlocation show \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --query "{State:provisioningState,Host:hostResourceId,Namespace:namespace}" \
        --output table
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CUSTOM_LOCATION_ID=$(az customlocation show `
        --resource-group $GROUP_NAME `
        --name $CUSTOM_LOCATION_NAME `
        --query id `
        --output tsv)

    az resource wait --ids $CUSTOM_LOCATION_ID --created --timeout 600

    az customlocation show `
        --resource-group $GROUP_NAME `
        --name $CUSTOM_LOCATION_NAME `
        --query "{State:provisioningState,Host:hostResourceId,Namespace:namespace}" `
        --output table
    ```

    ---

    Check that `State` is `Succeeded`, `Host` identifies the connected cluster you want, and `Namespace` matches `$NAMESPACE`. If provisioning fails, see [Custom location creation fails](azure-arc-troubleshoot.md#custom-location-creation-fails).

## Create the Azure Container Apps connected environment

Before you can start creating apps in the custom location, you need an [Azure Container Apps connected environment](azure-arc-create-container-app.md).

1. Create the Container Apps connected environment:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    az containerapp connected-env create \
        --resource-group $GROUP_NAME \
        --name $CONNECTED_ENVIRONMENT_NAME \
        --custom-location $CUSTOM_LOCATION_ID \
        --location $LOCATION
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az containerapp connected-env create `
        --resource-group $GROUP_NAME `
        --name $CONNECTED_ENVIRONMENT_NAME `
        --custom-location $CUSTOM_LOCATION_ID `
        --location $LOCATION
    ```

    ---

1. Wait for the connected environment to finish provisioning.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    CONNECTED_ENVIRONMENT_ID=$(az containerapp connected-env show \
        --resource-group $GROUP_NAME \
        --name $CONNECTED_ENVIRONMENT_NAME \
        --query id \
        --output tsv)

    az resource wait --ids $CONNECTED_ENVIRONMENT_ID --created --timeout 900

    az containerapp connected-env show \
        --resource-group $GROUP_NAME \
        --name $CONNECTED_ENVIRONMENT_NAME \
        --query "{State:properties.provisioningState,Location:location,CustomLocation:extendedLocation.name,Domain:properties.defaultDomain}" \
        --output yaml
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $CONNECTED_ENVIRONMENT_ID=$(az containerapp connected-env show `
        --resource-group $GROUP_NAME `
        --name $CONNECTED_ENVIRONMENT_NAME `
        --query id `
        --output tsv)

    az resource wait --ids $CONNECTED_ENVIRONMENT_ID --created --timeout 900

    az containerapp connected-env show `
        --resource-group $GROUP_NAME `
        --name $CONNECTED_ENVIRONMENT_NAME `
        --query "{State:properties.provisioningState,Location:location,CustomLocation:extendedLocation.name,Domain:properties.defaultDomain}" `
        --output yaml
    ```

    ---

    Continue only when `State` is `Succeeded` and `CustomLocation` matches the custom location you created in this tutorial. Save the displayed `Domain` for application DNS configuration. If provisioning fails, see [Connected environment creation fails](azure-arc-troubleshoot.md#connected-environment-creation-fails).

## Next steps

> [!div class="nextstepaction"]
> [Create a container app on Azure Arc](azure-arc-create-container-app.md)
