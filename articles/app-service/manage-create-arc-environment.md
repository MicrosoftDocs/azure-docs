---
title: 'Set up Azure Arc for App Service, Functions, and Logic Apps'
description: For your Azure Arc-enabled Kubernetes clusters, learn how to enable App Service apps, function apps, and logic apps.
author: msangapu-msft
ms.author: msangapu
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 03/24/2023
---
# Set up an Azure Arc-enabled Kubernetes cluster to run App Service, Functions, and Logic Apps (Preview)

If you have an [Azure Arc-enabled Kubernetes cluster](../azure-arc/kubernetes/overview.md), you can use it to create an [App Service enabled custom location](overview-arc-integration.md) and deploy web apps, function apps, and logic apps to it.

Azure Arc-enabled Kubernetes lets you make your on-premises or cloud Kubernetes cluster visible to App Service, Functions, and Logic Apps in Azure. You can create an app and deploy to it just like another Azure region.

## Prerequisites

If you don't have an Azure account, [sign up today](https://azure.microsoft.com/free/?utm_source=campaign&utm_campaign=vscode-tutorial-app-service-extension&mktingSource=vscode-tutorial-app-service-extension) for a free account.

<!-- ## Prerequisites

- Create a Kubernetes cluster in a supported Kubernetes distribution and connect it to Azure Arc in a supported region. See [Public preview limitations](overview-arc-integration.md#public-preview-limitations).
- [Install Azure CLI](/cli/azure/install-azure-cli), or use the [Azure Cloud Shell](../cloud-shell/overview.md).
- [Install kubectl](https://kubernetes.io/docs/tasks/tools/). It's also preinstalled in the Azure Cloud Shell.

## Obtain cluster information

Set the following environment variables based on your Kubernetes cluster deployment:

```bash
AKS_CLUSTER_GROUP_NAME="<name-resource-group-with-aks-cluster>"
GROUP_NAME="<name-of-resource-group-with-the-arc-connected-cluster>"
CLUSTER_NAME="<name-of-arc-connected-cluster>"
GEOMASTER_LOCATION="TODO: Why so many different locations for different resources? Shouldn't we just say create everything in the connected cluster's resource group and location?"
``` -->

## Add Azure CLI extensions

Launch the Bash environment in [Azure Cloud Shell](../cloud-shell/quickstart.md).

:::image type="icon" source="~/reusable-content/ce-skilling/azure/media/cloud-shell/launch-cloud-shell-button.png" alt-text="Button to launch the Azure Cloud Shell." border="false" link="https://shell.azure.com":::

Because these CLI commands are not yet part of the core CLI set, add them with the following commands.

```azurecli-interactive
az extension add --upgrade --yes --name connectedk8s
az extension add --upgrade --yes --name k8s-extension
az extension add --upgrade --yes --name customlocation
az provider register --namespace Microsoft.ExtendedLocation --wait
az provider register --namespace Microsoft.Web --wait
az provider register --namespace Microsoft.KubernetesConfiguration --wait
az extension remove --name appservice-kube
az extension add --upgrade --yes --name appservice-kube
```

## Create a connected cluster

> [!NOTE]
> This tutorial uses [Azure Kubernetes Service (AKS)](../aks/index.yml) to provide concrete instructions for setting up an environment from scratch. However, for a production workload, you will likely not want to enable Azure Arc on an AKS cluster as it is already managed in Azure. The steps below will help you get started understanding the service, but for production deployments, they should be viewed as illustrative, not prescriptive. See [Quickstart: Connect an existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md) for general instructions on creating an Azure Arc-enabled Kubernetes cluster.

1. Create a cluster in Azure Kubernetes Service with a public IP address. Replace `<group-name>` with the resource group name you want.

    # [bash](#tab/bash)

    ```azurecli-interactive
    AKS_CLUSTER_GROUP_NAME="<group-name>" # Name of resource group for the AKS cluster
    AKS_NAME="${aksClusterGroupName}-aks" # Name of the AKS cluster
    RESOURCE_LOCATION="eastus" # "eastus" or "westeurope"

    az group create -g $AKS_CLUSTER_GROUP_NAME -l $RESOURCE_LOCATION
    az aks create --resource-group $AKS_CLUSTER_GROUP_NAME --name $AKS_NAME --enable-aad --generate-ssh-keys
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $aksClusterGroupName="<group-name>" # Name of resource group for the AKS cluster
    $aksName="${aksClusterGroupName}-aks" # Name of the AKS cluster
    $resourceLocation="eastus" # "eastus" or "westeurope"

    az group create -g $aksClusterGroupName -l $resourceLocation
    az aks create --resource-group $aksClusterGroupName --name $aksName --enable-aad --generate-ssh-keys
    ```

    ---
    
2. Get the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file and test your connection to the cluster. By default, the kubeconfig file is saved to `~/.kube/config`.

    ```azurecli-interactive
    az aks get-credentials --resource-group $AKS_CLUSTER_GROUP_NAME --name $AKS_NAME --admin
    
    kubectl get ns
    ```
    
3. Create a resource group to contain your Azure Arc resources. Replace `<group-name>` with the resource group name you want.

    # [bash](#tab/bash)

    ```azurecli-interactive
    GROUP_NAME="<group-name>" # Name of resource group for the connected cluster

    az group create -g $GROUP_NAME -l $RESOURCE_LOCATION
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $groupName="<group-name>" # Name of resource group for the connected cluster

    az group create -g $groupName -l $resourceLocation
    ```

    ---
    
4. Connect the cluster you created to Azure Arc.

    # [bash](#tab/bash)

    ```azurecli-interactive
    CLUSTER_NAME="${GROUP_NAME}-cluster" # Name of the connected cluster resource

    az connectedk8s connect --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```
    
    # [PowerShell](#tab/powershell)


    ```powershell
    $clusterName="${groupName}-cluster" # Name of the connected cluster resource

    az connectedk8s connect --resource-group $groupName --name $clusterName
    ```

    ---
    
5. Validate the connection with the following command. It should show the `provisioningState` property as `Succeeded`. If not, run the command again after a minute.

    ```azurecli-interactive
    az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME
    ```
    
## Create a Log Analytics workspace

While a [Log Analytic workspace](../azure-monitor/logs/quick-create-workspace.md) is not required to run App Service in Azure Arc, it's how developers can get application logs for their apps that are running in the Azure Arc-enabled Kubernetes cluster. 

1. For simplicity, create the workspace now.

    # [bash](#tab/bash)

    ```azurecli-interactive
    WORKSPACE_NAME="$GROUP_NAME-workspace" # Name of the Log Analytics workspace
    
    az monitor log-analytics workspace create \
        --resource-group $GROUP_NAME \
        --workspace-name $WORKSPACE_NAME
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $workspaceName="$groupName-workspace"

    az monitor log-analytics workspace create `
        --resource-group $groupName `
        --workspace-name $workspaceName
    ```

    ---
    
2. Run the following commands to get the encoded workspace ID and shared key for an existing Log Analytics workspace. You need them in the next step.

    # [bash](#tab/bash)

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

    # [PowerShell](#tab/powershell)

    ```powershell
    $logAnalyticsWorkspaceId=$(az monitor log-analytics workspace show `
        --resource-group $groupName `
        --workspace-name $workspaceName `
        --query customerId `
        --output tsv)
    $logAnalyticsWorkspaceIdEnc=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($logAnalyticsWorkspaceId))# Needed for the next step
    $logAnalyticsKey=$(az monitor log-analytics workspace get-shared-keys `
        --resource-group $groupName `
        --workspace-name $workspaceName `
        --query primarySharedKey `
        --output tsv)
    $logAnalyticsKeyEnc=[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($logAnalyticsKey))
    ```
    
    ---

## Install the App Service extension

1. Set the following environment variables for the desired name of the [App Service extension](overview-arc-integration.md), the cluster namespace in which resources should be provisioned, and the name for the App Service Kubernetes environment. Choose a unique name for `<kube-environment-name>`, because it will be part of the domain name for app created in the App Service Kubernetes environment.

    # [bash](#tab/bash)

    ```bash
    EXTENSION_NAME="appservice-ext" # Name of the App Service extension
    NAMESPACE="appservice-ns" # Namespace in your cluster to install the extension and provision resources
    KUBE_ENVIRONMENT_NAME="<kube-environment-name>" # Name of the App Service Kubernetes environment resource
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $extensionName="appservice-ext" # Name of the App Service extension
    $namespace="appservice-ns" # Namespace in your cluster to install the extension and provision resources
    $kubeEnvironmentName="<kube-environment-name>" # Name of the App Service Kubernetes environment resource
    ```

    ---
    
2. Install the App Service extension to your Azure Arc-connected cluster, with Log Analytics enabled. Again, while Log Analytics is not required, you can't add it to the extension later, so it's easier to do it now.

    # [bash](#tab/bash)

    ```azurecli-interactive
    az k8s-extension create \
        --resource-group $GROUP_NAME \
        --name $EXTENSION_NAME \
        --cluster-type connectedClusters \
        --cluster-name $CLUSTER_NAME \
        --extension-type 'Microsoft.Web.Appservice' \
        --release-train stable \
        --auto-upgrade-minor-version true \
        --scope cluster \
        --release-namespace $NAMESPACE \
        --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" \
        --configuration-settings "appsNamespace=${NAMESPACE}" \
        --configuration-settings "clusterName=${KUBE_ENVIRONMENT_NAME}" \
        --configuration-settings "keda.enabled=true" \
        --configuration-settings "buildService.storageClassName=default" \
        --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" \
        --configuration-settings "customConfigMap=${NAMESPACE}/kube-environment-config" \
        --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${aksClusterGroupName}" \
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" \
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${LOG_ANALYTICS_WORKSPACE_ID_ENC}" \
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${LOG_ANALYTICS_KEY_ENC}"
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    az k8s-extension create `
        --resource-group $groupName `
        --name $extensionName `
        --cluster-type connectedClusters `
        --cluster-name $clusterName `
        --extension-type 'Microsoft.Web.Appservice' `
        --release-train stable `
        --auto-upgrade-minor-version true `
        --scope cluster `
        --release-namespace $namespace `
        --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" `
        --configuration-settings "appsNamespace=${namespace}" `
        --configuration-settings "clusterName=${kubeEnvironmentName}" `
        --configuration-settings "keda.enabled=true" `
        --configuration-settings "buildService.storageClassName=default" `
        --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" `
        --configuration-settings "customConfigMap=${namespace}/kube-environment-config" `
        --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${aksClusterGroupName}" `
        --configuration-settings "logProcessor.appLogs.destination=log-analytics" `
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${logAnalyticsWorkspaceIdEnc}" `
        --config-protected-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${logAnalyticsKeyEnc}"
    ```

    ---

    > [!NOTE]
    > To install the extension without Log Analytics integration, remove the last three `--configuration-settings` parameters from the command.
    >

    The following table describes the various `--configuration-settings` parameters when running the command:
    
    | Parameter | Description |
    | - | - |
    | `Microsoft.CustomLocation.ServiceAccount` | The service account that should be created for the custom location that will be created. It is recommended that this be set to the value `default`. |
    | `appsNamespace` | The namespace to provision the app definitions and pods. **Must** match that of the extension release namespace. |
    | `clusterName` | The name of the App Service Kubernetes environment that will be created against this extension. |
    | `keda.enabled` | Whether [KEDA](https://keda.sh/) should be installed on the Kubernetes cluster. Accepts `true` or `false`. |
    | `buildService.storageClassName` | The [name of the storage class](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#class) for the build service to store build artifacts. A value like `default` specifies a class named `default`, and not [any class that is marked as default](https://kubernetes.io/docs/tasks/administer-cluster/change-default-storage-class/).  Default is a valid storage class for AKS and AKS HCI but it may not be for other distrubtions/platforms. |
    | `buildService.storageAccessMode` | The [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes) to use with the named storage class above. Accepts `ReadWriteOnce` or `ReadWriteMany`. |
    | `customConfigMap` | The name of the config map that will be set by the App Service Kubernetes environment. Currently, it must be `<namespace>/kube-environment-config`, replacing `<namespace>` with the value of `appsNamespace` above. |
    | `envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group` | The name of the resource group in which the Azure Kubernetes Service cluster resides. Valid and required only when the underlying cluster is Azure Kubernetes Service.  |
    | `logProcessor.appLogs.destination` | Optional. Accepts `log-analytics` or `none`, choosing none disables platform logs. |
    | `logProcessor.appLogs.logAnalyticsConfig.customerId` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log analytics workspace ID. This parameter should be configured as a protected setting. |
    | `logProcessor.appLogs.logAnalyticsConfig.sharedKey` | Required only when `logProcessor.appLogs.destination` is set to `log-analytics`. The base64-encoded Log analytics workspace shared key. This parameter should be configured as a protected setting. |
    | | |
        
3. Save the `id` property of the App Service extension for later.

    # [bash](#tab/bash)

    ```azurecli-interactive
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
    $extensionId=$(az k8s-extension show `
        --cluster-type connectedClusters `
        --cluster-name $clusterName `
        --resource-group $groupName `
        --name $extensionName `
        --query id `
        --output tsv)
    ```

    ---

4. Wait for the extension to fully install before proceeding. You can have your terminal session wait until this complete by running the following command:

    ```azurecli-interactive
    az resource wait --ids $EXTENSION_ID --custom "properties.installState!='Pending'" --api-version "2020-07-01-preview"
    ```

You can use `kubectl` to see the pods that have been created in your Kubernetes cluster:

```bash
kubectl get pods -n $NAMESPACE
```

You can learn more about these pods and their role in the system from [Pods created by the App Service extension](overview-arc-integration.md#pods-created-by-the-app-service-extension).

## Create a custom location

The [custom location](../azure-arc/kubernetes/custom-locations.md) in Azure is used to assign the App Service Kubernetes environment.

<!-- https://github.com/MicrosoftDocs/azure-docs-pr/pull/156618 -->

1. Set the following environment variables for the desired name of the custom location and for the ID of the Azure Arc-connected cluster.

    # [bash](#tab/bash)

    ```bash
    CUSTOM_LOCATION_NAME="my-custom-location" # Name of the custom location
    
    CONNECTED_CLUSTER_ID=$(az connectedk8s show --resource-group $GROUP_NAME --name $CLUSTER_NAME --query id --output tsv)
    ```

    # [PowerShell](#tab/powershell)

    ```powershell
    $customLocationName="my-custom-location" # Name of the custom location
    
    $connectedClusterId=$(az connectedk8s show --resource-group $groupName --name $clusterName --query id --output tsv)
    ```

    ---
    
2. Create the custom location:

    # [bash](#tab/bash)

    ```azurecli-interactive
    az customlocation create \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --host-resource-id $CONNECTED_CLUSTER_ID \
        --namespace $NAMESPACE \ 
        --cluster-extension-ids $EXTENSION_ID
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli-interactive
    az customlocation create `
        --resource-group $groupName `
        --name $customLocationName `
        --host-resource-id $connectedClusterId `
        --namespace $namespace `
        --cluster-extension-ids $extensionId
    ```

    ---
    
    <!-- --kubeconfig ~/.kube/config # needed for non-Azure -->
    > [!NOTE]
    > If you experience issues creating a custom location on your cluster, you may need to [enable the custom location feature on your cluster](../azure-arc/kubernetes/custom-locations.md#enable-custom-locations-on-your-cluster).  This is required if logged into the CLI using a Service Principal or if you are logged in with a Microsoft Entra user with restricted permissions on the cluster resource.
    >

3. Validate that the custom location is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, run it again after a minute.

    ```azurecli-interactive
    az customlocation show --resource-group $GROUP_NAME --name $CUSTOM_LOCATION_NAME
    ```
    
4. Save the custom location ID for the next step.

    # [bash](#tab/bash)

    ```azurecli-interactive
    CUSTOM_LOCATION_ID=$(az customlocation show \
        --resource-group $GROUP_NAME \
        --name $CUSTOM_LOCATION_NAME \
        --query id \
        --output tsv)
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli-interactive
    $customLocationId=$(az customlocation show `
        --resource-group $groupName `
        --name $customLocationName `
        --query id `
        --output tsv)
    ```

    ---
    
## Create the App Service Kubernetes environment

Before you can start creating apps on the custom location, you need an [App Service Kubernetes environment](overview-arc-integration.md#app-service-kubernetes-environment).

1. Create the App Service Kubernetes environment:
    
    # [bash](#tab/bash)

    ```azurecli-interactive
    az appservice kube create \
        --resource-group $GROUP_NAME \
        --name $KUBE_ENVIRONMENT_NAME \
        --custom-location $CUSTOM_LOCATION_ID 
    ```

    # [PowerShell](#tab/powershell)

    ```azurecli-interactive
    az appservice kube create `
        --resource-group $groupName `
        --name $kubeEnvironmentName `
        --custom-location $customLocationId       
    ```

    ---
    
2. Validate that the App Service Kubernetes environment is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, run it again after a minute.

    ```azurecli-interactive
    az appservice kube show --resource-group $GROUP_NAME --name $KUBE_ENVIRONMENT_NAME
    ```
    

## Next steps

- [Quickstart: Create a web app on Azure Arc](quickstart-arc.md)
- [Create your first function on Azure Arc](../azure-functions/create-first-function-arc-cli.md)
- [Create your first logic app on Azure Arc](../logic-apps/azure-arc-enabled-logic-apps-create-deploy-workflows.md)
