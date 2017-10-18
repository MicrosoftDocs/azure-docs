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

For both options, a Red Hat Subscription is required. During the deployment, the RHEL instance will be registered to the Red Hat Subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Ensure you have a valid Red Hat Subscription Manager Username, Password and Pool ID (RHSM Username, RHSM Password, and Pool ID). You can verify the information by logging into https://access.redhat.com.

## Deploy using the OpenShift Container Platform ARM Template

To deploy using the ARM Template, a parameters file will be used to supply all the input parameters. If you wish to customize any of the deployment items that are not covered using input parameters, the github repo will need to be forked and the appropriate items modified.

Some common customization options include (but not limited to):

- VNet CIDR [variable in azuredeploy.json]
- Bastion VM Size [variable in azuredeploy.json]
- Naming conventions [variables in azuredeploy.json]
- OpenShift cluster specifics - modified via hosts file [deployOpenShift.sh]

### Configure Parameters File

Use the `appId` value from the service principal you created earlier for the `aadClientId` parameter. 

The following example creates a parameters file named **azuredeploy.parameters.json** with all the required inputs.

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
			"value": "keyvaultrg"
		},
		"keyVaultName": {
			"value": "keyvault"
		},
		"keyVaultSecret": {
			"value": "keysecret"
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

Replace items enlcosed in {} with your pertinent information.

### Deploy using Azure CLI

> [!NOTE] 
> The following command requires Azure CLI 2.0.8 or later. You can verify the az CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

The following example deploys the OpenShift cluster and all related resources into a resource group named myResourceGroup with a deployment name of myOpenShiftCluster. The template is referenced directly from the github repo and a local parameters file named **azuredeploy.parameters.json** file is used.

```azurecli 
az group deployment create -g myResourceGroup --name myOpenShiftCluster \
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

## Deploy using OpenShift Container Platform Marketplace Offer

The simpliest way to deploy OpenShift Container Platform into Azure is to use the [Azure Marketplace Offer](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/redhat.openshift-container-platform?tab=Overview).

This is the simpliest way, but also has limited customization capabilities. The offer includes three configuration options:

- Small: Deploys a non-HA cluster with one Master Node, one Infrastructure Node, two Application Nodes, and one Bastion Node. All Nodes are Standard DS2v2 VM sizes. This cluster requires 10 total cores and is ideal for small scale testing.
- Medium: Deploys an HA cluster with 3 Master Nodes, two Infrastructure Nodes, 4 Application Nodes, and one Bastion Node. All Nodes except the Bastion are Standard DS3v2 VM sizes. The Bastion Node is a Standard DS2v2. This cluster requires 38 cores.
- Large: Deploys an HA Cluster with 3 Master Nodes, two Infrastructure Nodes, 6 Application Nodes, and one Bastion Node. The Master and Infrastructure Nodes are Standard DS3v2 VM sizes, the Application Nodes are Standard DS4v2 VM sizes and the Bastion Node is a Standard DS2v2. This cluster requires 70 cores.

Configuration of Azure Cloud Provider is optional for Medium and Large cluster sizes. The Small cluster size does not give an option for configuring Azure Cloud Provider.

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
