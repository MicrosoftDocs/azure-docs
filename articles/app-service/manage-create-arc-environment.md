---
title: 'Set up Azure Arc for App Service, Functions, and Logic Apps'
description: For your Azure Arc enabled Kubernetes clusters, learn how to enable App Service apps, function apps, and logic apps.
ms.date: 05/03/2021
---
# Set up an Azure Arc enabled Kubernetes cluster to run App Service, Functions, and Logic Apps (Preview)

If you have a Kubernetes cluster that's connected to Azure Arc, you can use it to create an App Service Kubernetes environment and deploy App Service apps, function apps, and logic apps to it.

Azure Arc with Kubernetes lets you make your on-premises or cloud Kubernetes cluster visible to App Service, Functions, and Logic Apps in Azure. You can create an app and deploy to it just like another Azure region.

## Prerequisites

- Create a Kubernetes cluster in a supported Kubernetes distribution and connect it to Azure Arc in a supported region. See [Public preview limitations](overview-arc-integration.md#public-preview-limitations).
- To optionally ship logs from apps to Log Analytics, create [a Log Analytics workspace](../azure-monitor/logs/quick-create-workspace.md).
- [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli), or use the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview).
- [Install kubectl](https://kubernetes.io/docs/tasks/tools/). It's also preinstalled in the Azure Cloud Shell.

## Obtain cluster information

Set the following environment variables based on your Kubernetes cluster deployment:

<!-- TODO: check if all parameters are still needed at the end -->

```bash
staticIp="<public-ip-address-of-the-kubernetes-cluster>"
aksClusterGroupName="<name-resource-group-with-aks-cluster>"
groupName="<name-of-resource-group-with-the-arc-connected-cluster>"
clusterName="<name-of-arc-connected-cluster>"
```

To optionally enable shipping logs to Log Analytics, run the following commands to get the encoded workspace ID and shared key for an existing Log Analytics workspace.

```azurecli-interactive
logAnalyticsWorkspaceId=$(az monitor log-analytics workspace show --resource-group <group-name> --name <workspace-name> --query customerId --output tsv)
logAnalyticsWorkspaceIdEnc=$(printf %s $logAnalyticsWorkspaceId | base64)
logAnalyticsKey=$(az monitor log-analytics workspace get-shared-keys --resource-group <group-name> --name <workspace-name> --query primarySharedKey --output tsv)
logAnalyticsKeyEncWithSpace=$(printf %s $logAnalyticsKey | base64)
logAnalyticsKeyEnc=$(echo -n "${logAnalyticsKeyEncWithSpace//[[:space:]]/}")
```

## Install the App Service extension

Set the following environment variable for the desired name of the App Service extension.

```bash
extensionName="app-service-ext"
```

Your Azure Arc connected cluster needs the App Service extension. To enable Log Analytics for your apps, do it when you enable the extension. Currently, this option can't be updated later.

To install the App Service extension without Log Analytics:

```azurecli-interactive
az k8s-extension create -g $groupName --name $extensionName --cluster-type connectedClusters -c $clusterName --extension-type 'Microsoft.Web.Appservice' --version "0.4.0" --auto-upgrade-minor-version false --scope cluster --release-namespace 'appservice-ns' --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" --configuration-settings "appsNamespace=appservice-ns" --configuration-settings "clusterName=${kubeEnvironmentName}" --configuration-settings "loadBalancerIp=${staticIp}" --configuration-settings "buildService.storageClassName=default" --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${aksClusterGroupName}"  --configuration-settings "customConfigMap=appservice-ns/kube-environment-config"
```

To install the App Service extension with Log Analytics:

```azurecli-interactive
az k8s-extension create -g $groupName --name $extensionName --cluster-type connectedClusters -c $clusterName --extension-type 'Microsoft.Web.Appservice' --version "0.4.0" --auto-upgrade-minor-version false --scope cluster --release-namespace 'appservice-ns' --configuration-settings "Microsoft.CustomLocation.ServiceAccount=default" --configuration-settings "appsNamespace=appservice-ns" --configuration-settings "clusterName=${kubeEnvironmentName}" --configuration-settings "loadBalancerIp=${staticIp}" --configuration-settings "buildService.storageClassName=default" --configuration-settings "buildService.storageAccessMode=ReadWriteOnce" --configuration-settings "envoy.annotations.service.beta.kubernetes.io/azure-load-balancer-resource-group=${aksClusterGroupName}" --configuration-settings "logProcessor.appLogs.destination=log-analytics" --configuration-settings "logProcessor.appLogs.logAnalyticsConfig.customerId=${logAnalyticsWorkspaceIdEnc}" --configuration-settings "logProcessor.appLogs.logAnalyticsConfig.sharedKey=${logAnalyticsKeyEnc}"  --configuration-settings "customConfigMap=appservice-ns/kube-environment-config"
```

Validate the App Service extension with the following command. It should show the `installState` property as `Installed`. If not, run the command again after a minute.

```azurecli-interactive
az k8s-extension show --cluster-type connectedClusters -c $clusterName -g $groupName --name $extensionName
```

Save the "id" property of the App Service extension for later.

```azurecli-interactive
extensionId=$(az k8s-extension show --cluster-type connectedClusters -c $clusterName -g $groupName --name $extensionName --query id -o tsv)
```

## Create a custom location

The custom location in Azure is used to assign the App Service Kubernetes environment.

Set the following environment variable for the desired name of the custom location.

```bash
customLocationName="my-custom-location"
```

Run the following to create the custom location:

```azurecli-interactive
az customlocation create -g $groupName -n $customLocationName -hr $connectedClusterId -ns appservice-ns -c $extensionId
```

Validate that the custom location is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, run it again after a minute.

```azurecli-interactive
az customlocation show -g $groupName -n $customLocationName
```

Save the custom location ID for the next step.

```azurecli-interactive
customLocationId=$(az customlocation show -g $groupName -n $customLocationName --query id -o tsv)
```

## Create the App Service Kubernetes environment

Set the following environment variable for the desired name of the App Service Kubernetes environment. With the example, you will specify `my-aske` when creating an app in the App Service Kubernetes environment.

```bash
kubeEnvironmentName="my-aske"
```

Run the following command:

```azurecli-interactive
TODO-CLI
```

Validate that the App Service Kubernetes environment is successfully created with the following command. The output should show the `provisioningState` property as `Succeeded`. If not, run it again after a minute.

```azurecli-interactive
az appservice kube show -g $groupName -n $kubeEnvironmentName
```

Use `kubectl` to see the resources that are created in your Kubernetes cluster:

```bash
kubectl get pods -n appservice-ns
```

> [!NOTE]
> Currently, in order to enable HTTPS endpoints for apps and build automation after Git or ZIP deployment, run the following `kubectl` command:
>
> ```bash
> kubectl delete pods -n appservice-ns -l control-plane=app-controller
> ```