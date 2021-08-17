---
title: Create Azure Arc data controller | Direct connect mode
description: Explains how to create the data controller in direct connect mode. 
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 07/30/2021
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

Set the following environment variables which will be then used in next step.

#### Linux

``` terminal
# where you want the connected cluster resource to be created in Azure 
export subscription=<Your subscription ID>
export resourceGroup=<Your resource group>
export resourceName=<name of your connected kubernetes cluster>
export location=<Azure location>
```

#### Windows PowerShell
``` PowerShell
# where you want the connected cluster resource to be created in Azure 
$ENV:subscription="<Your subscription ID>"
$ENV:resourceGroup="<Your resource group>"
$ENV:resourceName="<name of your connected kubernetes cluster>"
$ENV:location="<Azure location>"
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

You can verify if  the Arc enabled data services extension is created either from the portal or by connecting directly to the Arc enabled Kubernetes cluster. 

#### Azure portal
1. Login to the Azure portal and browse to the resource group where the Kubernetes connected cluster resource is located.
1. Select the Arc enabled kubernetes cluster (Type = "Kubernetes - Azure Arc") where the extension was deployed.
1. In the navigation on the left side, under **Settings**, select "Extensions".
1. You should see the extension that was just created earlier in an "Installed" state.

:::image type="content" source="media/deploy-data-controller-direct-mode-prerequisites/dc-extensions-dashboard.png" alt-text="Extensions dashboard":::

#### kubectl CLI

1. Connect to your Kubernetes cluster via a Terminal window.
1. Run the below command and ensure the (1) namespace mentioned above is created and (2) the `bootstrapper` pod is in 'running' state before proceeding to the next step.

``` console
kubectl get pods -n <name of namespace used in the json template file above>
```

For example, the following gets the pods from `arc` namespace.

```console
#Example:
kubectl get pods -n arc
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

After the extension and custom location are created, proceed to Azure portal to deploy the Azure Arc data controller.

1. Log into the Azure portal.
1. Search for "Azure Arc data controller" in the Azure Marketplace and initiate the Create flow.
1. In the **Prerequisites** section, ensure that the Azure Arc-enabled Kubernetes cluster (direct mode) is selected and proceed to the next step.
1. In the **Data controller details** section, choose a subscription and resource group.
1. Enter a name for the data controller.
1. Choose a configuration profile based on the Kubernetes distribution provider you are deploying to.
1. Choose the Custom Location that you created in the previous step.
1. Provide details for the data controller administrator login and password.
1. Provide details for ClientId, TenantId, and Client Secret for the Service Principal that would be used to create the Azure objects. See [Upload metrics](upload-metrics-and-logs-to-azure-monitor.md) for detailed instructions on creating a Service Principal account and the roles that needed to be granted for the account.
1. Click **Next**, review the summary page for all the details and click on **Create**.

## Monitor the creation

When the Azure portal deployment status shows the deployment was successful, you can check the status of the Arc data controller deployment on the cluster as follows:

```console
kubectl get datacontrollers -n arc
```

## Next steps

[Create an Azure Arc-enabled PostgreSQL Hyperscale server group](create-postgresql-hyperscale-server-group.md)

[Create an Azure SQL managed instance on Azure Arc](create-sql-managed-instance.md)
