---
title: Prerequisites | Direct connect mode
description: Prerequisites to deploy the data controller in direct connect mode. 
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
ms.date: 03/31/2021
ms.topic: overview
---

# Deploy data controller - direct connected mode - prerequisites

This article describes how to prepare to deploy a data controller for Azure Arc enabled data services in direct connected mode.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Summary steps

1. Connect a Kubernetes cluster to Azure using Azure Arc enabled Kubernetes
1. Create an Azure Arc enabled data services extension
1. Create a custom location
1. Deploy the data controller to the custom location

## Install tools

- Helm version 3.3+ ([install](https://helm.sh/docs/intro/install/))
- Azure CLI ([install](https://docs.microsoft.com/en-us/sql/azdata/install/deploy-install-azdata?view=sql-server-ver15))

## Add extensions for Azure CLI

Additionally, the following az extensions are also required:
- Azure CLI k8s-extension extension (0.2.0)
- Azure CLI customlocation (0.1.0)

Sample ```az``` and its CLI extentions would be:

```console
$ az version
{
  "azure-cli": "2.19.1",
  "azure-cli-core": "2.19.1",
  "azure-cli-telemetry": "1.0.6",
  "extensions": {
    "connectedk8s": "1.1.0",
    "customlocation": "0.1.0",
    "k8s-configuration": "1.0.0",
    "k8s-extension": "0.2.0"
  }
}
```

## Create service principal and configure roles for metrics

Follow the steps detailed in the [Upload metrics](upload-metrics-and-logs-to-azure-monitor.md) article and create a Service Principal and grant the roles as described the article. The SPN ClientID, TenantID, and Client Secret information will be required in Step 4. 

## Connect Kubernetes cluster to Azure using Azure Arc enabled Kubernetes

First, [Connect an existing Kubernetes cluster to Azure arc](../kubernetes/quickstart-connect-cluster.md) following the steps described in this article.

## Create an Azure Arc enabled data services extension

Use the k8s-extension CLI to create a data services extension.

### Set environment variables

Set the following environment variables which will be then used in next step.

#### Linux

``` terminal
# where you want the connected cluster resource to be created in Azure 
export subscription=<Your subscription ID>
export resourceGroup=<Your resource group>
export resourceName=<name of your connected kubernetes cluster>
export location=eastus2euap
```

#### Windows PowerShell
``` PowerShell
# where you want the connected cluster resource to be created in Azure 
$ENV:subscription="<Your subscription ID>"
$ENV:resourceGroup="<Your resource group>"
$ENV:resourceName="<name of your connected kubernetes cluster>"
$ENV:location="eastus2euap"
```

### Create the Arc data services extension

#### Linux
```bash
export ADSExtensionName=ads-extension
export CustomLocationsRpOid=$(az ad sp list --filter "displayname eq 'Custom Locations RP'" --query '[].objectId' -o tsv)


az k8s-extension create -c ${resourceName} -g ${resourceGroup} --name ${ADSExtensionName} --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace arc \
  --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper \
  --config aad.customLocationObjectId=${CustomLocationsRpOid}

az k8s-extension show -g ${resourceGroup} -c ${resourceName} --name ${ADSExtensionName} --cluster-type connectedclusters
```

#### Windows PowerShell
```PowerShell
$ENV:ADSExtensionName="ads-extension"
$CustomLocationsRpOid = az ad sp list --filter "displayname eq 'Custom Locations RP'" --query [].objectId -o tsv

az k8s-extension create -c "$ENV:resourceName" -g "$ENV:resourceGroup" --name "$ENV:ADSExtensionName" --cluster-type connectedClusters --extension-type microsoft.arcdataservices --auto-upgrade false --scope cluster --release-namespace arc --config Microsoft.CustomLocation.ServiceAccount=sa-bootstrapper --config aad.customLocationObjectId="$ENV:CustomLocationsRpOid"

az k8s-extension show -g "$ENV:resourceGroup" -c "$ENV:resourceName" --name "$ENV:ADSExtensionName" --cluster-type connectedclusters
```

> [!NOTE]
> The Arc data services extension install can take a couple of minutes to finish.

### Verify the Arc data services extension is created

You can verify if  the Arc enabled data services extension is created either from portal or by connecting directly to the Arc enabled kubernetes cluster. 

**Azure portal**
- Login to the Azure portal and browse to the resource group where the Kubernetes connected cluster resource is located.
- Select the Arc enabled kubernetes cluster (Type = "Kubernetes - Azure Arc") where the extension was deployed.
- In the navigation on the left side, under **Settings**, select "Extensions (preview)".
- You should see the extension that was just created earlier in an "Installed" state.

![Arc data services extension](Extensions.jpg)

**kubectl CLI**

Connect to your Kubernetes cluster via a Terminal window.

Run the below command and ensure the (1) namespace mentioned above is created and (2) the bootstrapper pod is in 'running' state before proceeding to the next step.

``` terminal
kubectl get pods -n <name of namespace used in the json template file above>

#Example:
kubectl get pods -n arc
```

## Create a Custom Location using customlocation CLI extension

A custom location is an Azure resource that is equivalent to a namespace in a kubernetes cluster.  Custom locations are used as a target to deploy resources to from Azure. Learn more about [Custom locations](../kubernetes/custom-locations.md).

### Set environment variables

#### Linux

```bash
export clName=mycustomlocation
export clNamespace=arc
export hostClusterId=$(az connectedk8s show -g ${resourceGroup} -n ${resourceName} --query id -o tsv)
export extensionId=$(az k8s-extension show -g ${resourceGroup} -c ${resourceName} --cluster-type connectedClusters --name ${ADSExtensionName} --query id -o tsv)

az customlocation create -g ${resourceGroup} -n ${clName} --namespace ${clNamespace} \
  --host-resource-id ${hostClusterId} \
  --cluster-extension-ids ${extensionId} --location eastus2euap

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

```
az customlocation list -o table
```
