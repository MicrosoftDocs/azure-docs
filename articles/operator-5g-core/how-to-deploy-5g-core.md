---
title: How to Deploy Azure Operator 5G Core
description: Learn how to deploy Azure Operator 5G core using Bicep Scripts, PowerShell, and Azure CLI.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: how-to #Required; leave this attribute/value as-is
ms.date: 02/21/2024
#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Deploy Azure Operator 5G Core

Azure Operator 5G Core is deployed using the Azure Operator 5G Core Resource Provider (RP). Bicep scripts are bundled along with empty parameter files for each Mobile Packet Core resource. These resources are:

- Microsoft.MobilePacketCore/clusterServices - per cluster PaaS services
- Microsoft.MobilePacketCore/amfDeployments - AMF/MME network function
- Microsoft.MobilePacketCore/smfDeployments - SMF network function
- Microsoft.MobilePacketCore/nrfDeployments - NRF network function
- Microsoft.MobilePacketCore/nssfDeployments - NSSF network function
- Microsoft.MobilePacketCore/upfDeployments - UPF network function
- Microsoft.MobilePacketCore/observabilityServices - per cluster observability PaaS services (elastic/elastalert/kargo/kafka/etc)

## Prerequisites

Before you can successfully deploy Azure Operator 5G Core, you must:
- [Register your resource provider](../azure-resource-manager/management/resource-providers-and-types.md) for the HybridNetwork and MobilePacketCore namespaces.

Based on your deployment environments, complete one of the following:
- [Prerequisites to deploy Azure Operator 5G Core on Azure Kubernetes Service](how-to-complete-prerequisites-deploy-azure-kubernetes-service.md).
- [Prerequisites to deploy Azure Operator 5G Core on Nexus Azure Kubernetes Service](how-to-complete-prerequisites-deploy-nexus-azure-kubernetes-service.md)


## Post cluster creation 

After you complete the prerequisite steps and create a cluster, you must enable resources used to deploy Azure Operator 5G Core. The Azure Operator 5G Core resource provider manages the remote cluster through line-of-sight communications via Azure ARC. Azure Operator 5G Core workload is deployed through helm operator services provided by the Network Function Manager (NFM). To enable these services, the cluster must be ARC enabled, the NFM Kubernetes extension  must be installed, and an Azure custom location must be created. The following Azure CLI commands describe how to enable these services. Run the commands from any command prompt displayed when you sign in using the `az-login` command.


## ARC-enable the cluster

ARC is used to enable communication from the Azure Operator 5G Core resource provider to Kubernetes. You must have access to the cluster's kubeconfig file, or to Kubernetes API server to run the connectedK8s command. Refer to [Use Azure role-based access control to define access to the Kubernetes configuration file in Azure Kubernetes Service (AKS)](../aks/control-kubeconfig-access.md) for information.

### ARC-enable the cluster for Azure Kubernetes Services 

Use the following Azure CLI command:

`$ az connectedk8s connect --name <ARC NAME> --resource-group <RESOURCE GROUP> --custom-locations-oid <LOCATION> --kube-config <KUBECONFIG FILE>`

### ARC-enable the cluster for Nexus Azure Kubernetes Services

Retrieve the Nexus AKS connected cluster ID with the following command. You need this cluster ID to create the custom location.

 `$ az connectedk8s show -n <NAKS-CLUSTER-NAME> -g <NAKS-RESOURCE-GRUP>  --query id -o tsv` 

## Install the Network Function Manager Kubernetes extension

Execute the following Azure CLI command to install the Network Function Manager (NFM) Kubernetes extension:

`$ az k8s-extension create --name networkfunction-operator --cluster-name <ARC NAME> --resource-group <RESOURCE GROUP> --cluster-type connectedClusters --extension-type Microsoft.Azure.HybridNetwork --auto-upgrade-minor-version true --scope cluster --release-namespace azurehybridnetwork --release-train preview --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator`

## Create an Azure custom location

Enter the following Azure CLI command to create an Azure custom location:

`$ az customlocation create -g <RESOURCE GROUP> -n <CUSTOM LOCATION NAME> --namespace azurehybridnetwork --host-resource-id /subscriptions/<SUBSCRIPTION>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Kubernetes/connectedClusters/<ARC NAME> --cluster-extension-ids /subscriptions/<SUBSCRIPTION>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.Kubernetes/connectedClusters/<ARC NAME>/providers/Microsoft.KubernetesConfiguration/extensions/networkfunction-operator`

 ## Populate the parameter files

The empty parameter files that were bundled with the Bicep scripts must be populated with values suitable for the cluster being deployed. Open each parameter file and add IP addresses, subnets, and storage account information. 

You can also modify the parameterized values yaml file to change tuning parameters such as cpu, memory limits, and requests. You can also add new parameters manually.

The Bicep scripts read these parameter files to produce a JSON object. The object is passed to Azure Resource Manager and used to deploy the Azure Operator 5G Core resource.

> [!IMPORTANT]
> Any new parameters must be added to both the parameters file and the Bicep script file. 

## Deploy Azure Operator 5G Core via Azure Resource Manager

You can deploy Azure Operator 5G Core resources by using either Azure CLI or PowerShell.

### Deploy using Azure CLI

```azurecli
az deployment group create \
--name $deploymentName \
--resource-group $resourceGroupName \
--template-file $templateFile \
--parameters $templateParamsFile
```

### Deploy using PowerShell

```powershell
New-AzResourceGroupDeployment `
-Name $deploymentName `
-ResourceGroupName $resourceGroupName `
-TemplateFile $templateFile `
-TemplateParameterFile $templateParamsFile `
-resourceName $resourceName
```
## Next step

- [Monitor the  status of your Azure Operator 5G Core deployment](how-to-monitor-deployment-status.md)