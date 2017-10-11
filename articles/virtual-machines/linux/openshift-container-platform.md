---
title: Deploy OpenShift Container Platform in Azure | Microsoft Docs
description: Learn to deploy OpenShift Container Platform to Azure virtual machines.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldw
manager: najoshi
editor: 
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 
ms.author: haroldw
---

# Deploy OpenShift Container Platform in Azure

There are multiple ways to deploy OpenShift Container Platform in Azure. You can manually deploy all the necessary Azure infrastructure components and then follow the OpenShift Container Platform [documentation](https://docs.openshift.com/container-platform/3.6/welcome/index.html).
You can also use an existing ARM Template that simplifies the deployment of the OpenShift Container Platform cluster. Once such template is located [here](https://github.com/Microsoft/openshift-container-platform/).

Another option is to use the [Azure Marketplace Offer](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/redhat.openshift-container-platform?tab=Overview).

## Deploy using the OpenShift Container Platform template

> [!NOTE] 
> The following command requires Azure CLI 2.0.8 or later. You can verify the az CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

Use the `appId` value from the service principal you created earlier for the `aadClientId` parameter. Create a parameters file with all the inputs.

```json
{
	"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"masterVmSize": {
			"value": "Standard_E2s_v3"
		},
		"infraVmSize": {
			"value": "Standard_E2s_v3"
		},
		"nodeVmSize": {
			"value": "Standard_E2s_v3"
		},
		"openshiftClusterPrefix": {
			"value": "mycluster"
		},
		"masterInstanceCount": {
			"value": 3
		},
		"infraInstanceCount": {
			"value": 2
		},
		"nodeInstanceCount": {
			"value": 2
		},
		"dataDiskSize": {
			"value": 128
		},
		"adminUsername": {
			"value": "clusteradmin"
		},
		"openshiftPassword": {
			"value": "{Strong Password}"
		},
		"enableMetrics": {
			"value": "true"
		},
		"enableLogging": {
			"value": "true"
		},
		"enableCockpit": {
			"value": "false"
		},
		"rhsmUsernamePasswordOrActivationKey": {
			"value": "usernamepassword"
		},
		"rhsmUsernameOrOrgId": {
			"value": "{RHSM Username}"
		},
		"rhsmPasswordOrActivationKey": {
			"value": "{RHSM Password}"
		},
		"rhsmPoolId": {
			"value": "{Pool ID}"
		},
		"sshPublicKey": {
			"value": "{SSH Public Key}"
		},
		"keyVaultResourceGroup": {
			"value": "openshiftkeyvaultrg"
		},
		"keyVaultName": {
			"value": "openshiftkeyvault"
		},
		"keyVaultSecret": {
			"value": "secret"
		},
		"enableAzure": {
			"value": "true"
		},
		"aadClientId": {
			"value": "11111111-abcd-1234-efgh-111111111111"
		},
		"aadClientSecret": {
			"value": "{Strong Password}"
		},
		"defaultSubDomainType": {
			"value": "nipio"
		}
	}
}

```

## Deploy using Azure CLI

```azurecli 
az group deployment create -g MyResourceGroup --name myOpenShiftCluster \
      --template-uri https://raw.githubusercontent.com/Microsoft/openshift-container-platform/master/azuredeploy.json \
      --parameters @./azuredeploy.parameters.json

```
The deployment will take at least 30 minutes to complete depending on the total number of nodes deployed. The URL of the OpenShift console and DNS name of the OpenShift master is printed to the terminal when the deployment completes.

```json
{
  "OpenShift Console Uri": "http://openshiftlb.cloudapp.azure.com:8443/console",
  "OpenShift Master SSH": "ssh clusteradmin@myopenshiftmaster.cloudapp.azure.com -p 2200"
}
```
## Connect to the OpenShift cluster
When the deployment completes, connect to the OpenShift console using the browser using the `OpenShift Console Uri`. Alternatively, you can connect to the OpenShift master using the following command.

```bash
$ ssh clusteradmin@myopenshiftmaster.cloudapp.azure.com -p 2200
```

## Clean up resources
When no longer needed, you can use the [az group delete](/cli/azure/group#delete) command to remove the resource group, OpenShift cluster, and all related resources.

```azurecli 
az group delete --name myResourceGroup
```

## Next steps

- [Monitor OpenShift with OMS](./openshift-oms.md)
- [Troubleshooting OpenShift Deployment](./openshift-troubleshooting.md)
- [Getting Started with OpenShift Container Platform](https://docs.openshift.com/container-platform/3.6/getting_started/index.html)
