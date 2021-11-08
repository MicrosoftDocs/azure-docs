---
title: Create Azure Arc data controller | Direct connect mode
description: Explains how to create the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 11/03/2021
ms.topic: overview
---

#  Create Azure Arc data controller in Direct connectivity mode using CLI

This article describes how to create the Azure Arc data controller in **direct** connectivity mode using CLI, during the current preview of this feature. 


## Complete prerequisites

Before you begin, verify that you have completed the prerequisites in [Deploy data controller - direct connect mode - prerequisites](create-data-controller-direct-prerequisites.md).

Creating an Azure Arc data controller in **direct** connectivity mode involves the following steps:

1. Create an Azure Arc-enabled data services extension. 
1. Create a custom location.
1. Create the data controller.

> [!NOTE]
> Currently, this step can only be performed from the portal. For details, see [Release notes](release-notes.md). 

## Create an Azure Arc-enabled data services extension

Use the k8s-extension CLI to create a data services extension.

### Set environment variables

Set the following environment variables, which will be then used in next step.

#### Linux

``` terminal
# where you want the connected cluster resource to be created in Azure 
export subscription=<Your subscription ID>
export resourceGroup=<Your resource group>
export resourceName=<name of your connected kubernetes cluster>
export location=<Azure location>
export AZDATA_LOGSUI_USERNAME=<username for Kibana dashboard>
export AZDATA_LOGSUI_PASSWORD=<password for Kibana dashboard>
export AZDATA_METRICSUI_USERNAME=<username for Grafana dashboard>
export AZDATA_METRICSUI_PASSWORD=<password for Grafana dashboard>
```

#### Windows PowerShell
``` PowerShell
# where you want the connected cluster resource to be created in Azure 
$ENV:subscription="<Your subscription ID>"
$ENV:resourceGroup="<Your resource group>"
$ENV:resourceName="<name of your connected kubernetes cluster>"
$ENV:location="<Azure location>"
$ENV:AZDATA_LOGSUI_USERNAME="<username for Kibana dashboard>"
$ENV:AZDATA_LOGSUI_PASSWORD="<password for Kibana dashboard>"
$ENV:AZDATA_METRICSUI_USERNAME="<username for Grafana dashboard>"
$ENV:AZDATA_METRICSUI_PASSWORD="<password for Grafana dashboard>"
```

### Create the Arc data services extension

#### Linux

```bash
az k8s-extension create -c ${resourceName} -g ${resourceGroup} --name ${ADSExtensionName} --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace arc --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper

az k8s-extension show -g ${resourceGroup} -c ${resourceName} --name ${ADSExtensionName} --cluster-type connectedclusters
```

#### Windows PowerShell
```PowerShell
$ENV:ADSExtensionName="ads-extension"

az k8s-extension create -c "$ENV:resourceName" -g "$ENV:resourceGroup" --name "$ENV:ADSExtensionName" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace arc --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper

az k8s-extension show -g "$ENV:resourceGroup" -c "$ENV:resourceName" --name "$ENV:ADSExtensionName" --cluster-type connectedclusters
```

#### Deploy Azure Arc data services extension using private container registry and credentials

Use the below command if you are deploying from your private repository:

```azurecli
az k8s-extension create -c "<connected cluster name>" -g "<resource group>" --name "<extension name>" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --scope cluster --release-namespace "<namespace>" --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper --config imageCredentials.registry=<registry info> --config imageCredentials.username=<username> --config systemDefaultValues.image=<registry/repo/arc-bootstrapper:<imagetag>> --config-protected imageCredentials.password=$ENV:DOCKER_PASSWORD --debug
```

 For example
```azurecli
az k8s-extension create -c "my-connected-cluster" -g "my-resource-group" --name "arc-data-services" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --scope cluster --release-namespace "arc" --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper --config imageCredentials.registry=mcr.microsoft.com --config imageCredentials.username=arcuser --config systemDefaultValues.image=mcr.microsoft.com/arcdata/arc-bootstrapper:latest --config-protected imageCredentials.password=$ENV:DOCKER_PASSWORD --debug
```


> [!NOTE]
> The Arc data services extension install can take a couple of minutes to finish.

### Verify the Arc data services extension is created

You can verify if  the Azure Arc-enabled data services extension is created either from the portal or by connecting directly to the Azure Arc-enabled Kubernetes cluster. 

#### Azure portal
1. Log in to the Azure portal and browse to the resource group where the Kubernetes connected cluster resource is located.
1. Select the Azure Arc-enabled kubernetes cluster (Type = "Kubernetes - Azure Arc") where the extension was deployed.
1. In the navigation on the left side, under **Settings**, select **Extensions**.
1. You should see the extension that was created earlier in an installed state.

:::image type="content" source="media/deploy-data-controller-direct-mode-prerequisites/dc-extensions-dashboard.png" alt-text="Extensions dashboard":::

#### kubectl CLI

1. Connect to your Kubernetes cluster via a Terminal window.
1. Run the below command and ensure the (1) namespace mentioned above is created and (2) the `bootstrapper` pod is in 'running' state before proceeding to the next step.

``` console
kubectl get pods -n <name of namespace used in the json template file above>
```

For example, the following example gets the pods from `arc` namespace.

```console
#Example:
kubectl get pods -n arc
```

## Retrieve the managed identity and grant roles

The managed identity that gets created during Arc data services extension create needs to be assigned certain roles for usage and/or metrics to be uploaded automatically.

### (1) Retrieve managed identity of the Arc data controller extension

```powershell
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group <resource group>  --cluster-name <connectedclustername> --cluster-type connectedClusters --name <name of extension> | convertFrom-json).identity.principalId
#Example
$Env:MSI_OBJECT_ID = (az k8s-extension show --resource-group myresourcegroup  --cluster-name myconnectedcluster --cluster-type connectedClusters --name ads-extension | convertFrom-json).identity.principalId
```

### (2) Assign role to the managed identity

Run the below command to assign the **Monitoring Metrics Publisher** role:
```powershell
az role assignment create --assignee $Env:MSI_OBJECT_ID --role 'Monitoring Metrics Publisher' --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP_NAME"

```

## Create a custom location using custom location CLI extension

A custom location is an Azure resource that is equivalent to a namespace in a Kubernetes cluster.  Custom locations are used as a target to deploy resources to or from Azure. Learn more about custom locations in the [Custom locations on top of Azure Arc-enabled Kubernetes documentation](../kubernetes/conceptual-custom-locations.md).

### Set environment variables

#### Linux

```bash
export clName=mycustomlocation
export clNamespace=arc
export hostClusterId=$(az connectedk8s show -g ${resourceGroup} -n ${resourceName} --query id -o tsv)
export extensionId=$(az k8s-extension show -g ${resourceGroup} -c ${resourceName} --cluster-type connectedClusters --name ${ADSExtensionName} --query id -o tsv)

az customlocation create -g ${resourceGroup} -n ${clName} --namespace ${clNamespace} \
  --host-resource-id ${hostClusterId} \
  --cluster-extension-ids ${extensionId} --location eastus
```

#### Windows PowerShell
```PowerShell
$ENV:clName="mycustomlocation"
$ENV:clNamespace="arc"
$ENV:hostClusterId = az connectedk8s show -g "$ENV:resourceGroup" -n "$ENV:resourceName" --query id -o tsv
$ENV:extensionId = az k8s-extension show -g "$ENV:resourceGroup" -c "$ENV:resourceName" --cluster-type connectedClusters --name "$ENV:ADSExtensionName" --query id -o tsv

az customlocation create -g "$ENV:resourceGroup" -n "$ENV:clName" --namespace "$ENV:clNamespace" --host-resource-id "$ENV:hostClusterId" --cluster-extension-ids "$ENV:extensionId"
```

## Validate  the custom location is created

From the terminal, run the below command to list the custom locations, and validate that the **Provisioning State** shows Succeeded:

```azurecli
az customlocation list -o table
```

## Create the Azure Arc data controller

After the extension and custom location are created, proceed to deploy the Azure Arc data controller as follows.

```
az arcdata dc create --name <name> --resource-group <resourcegroup> --location <location> --connectivity-mode direct --profile-name <profile name>  --auto-upload-logs true --custom-location <name of custom location>
# Example
az arcdata dc create -n arc-dc1 --resource-group my-resource-group --location eastasia --connectivity-mode direct --profile-name azure-arc-aks-premium-storage  --auto-upload-logs true --custom-location mycustomlocation
```

If you want to create the Azure Arc data controller using a custom configuration template, follow the steps described in [Create custom configuration profile](create-custom-configuration-template.md) and provide the path to the file as follows:

```
az arcdata dc create --name <name> --resource-group <resourcegroup> --location <location> --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-logs true --custom-location <name of custom location>
# Example
az arcdata dc create --name arc-dc1 --resource-group my-resource-group --location eastasia --connectivity-mode direct --path ./azure-arc-custom  --auto-upload-logs true --custom-location mycustomlocation
```


## Monitor the creation

When the Azure portal deployment status shows the deployment was successful, you can check the status of the Arc data controller deployment on the cluster as follows:

```console
kubectl get datacontrollers -n arc
```

## Next steps

[Create an Azure Arc-enabled PostgreSQL Hyperscale server group](create-postgresql-hyperscale-server-group.md)

[Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md)
