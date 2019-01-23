---
title: Deploy OpenShift Container Platform in Azure | Microsoft Docs
description: Deploy OpenShift Container Platform in Azure.
services: virtual-machines-linux
documentationcenter: virtual-machines
author: haroldwongms
manager: joraio
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

You can use one of several methods to deploy OpenShift Container Platform in Azure:

- You can manually deploy the necessary Azure infrastructure components and then follow the [OpenShift Container Platform documentation](https://docs.openshift.com/container-platform).
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.
- Another option is to use the [Azure Marketplace offer](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.openshift-container-platform?tab=Overview).

For all options, a Red Hat subscription is required. During the deployment, the Red Hat Enterprise Linux instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Make sure you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. You can use an Activation Key, Org ID, and Pool ID. You can verify this information by signing in to https://access.redhat.com.

## Deploy using the OpenShift Container Platform Resource Manager template

To deploy using the Resource Manager template, you use a parameters file to supply the input parameters. To further customize the deployment, fork the GitHub repo and change the appropriate items.

Some common customization options include, but aren't limited to:

- Bastion VM size (variable in azuredeploy.json)
- Naming conventions (variables in azuredeploy.json)
- OpenShift cluster specifics, modified via hosts file (deployOpenShift.sh)

### Configure the parameters file

The [OpenShift Container Platform template](https://github.com/Microsoft/openshift-container-platform) has multiple branches available for different versions of OpenShift Container Platform.  Based on your needs, you can deploy directly from the repo or you can fork the repo and make custom changes to the templates or scripts before deploying.

Use the `appId` value from the service principal you created earlier for the `aadClientId` parameter.

The following example shows a parameters file named azuredeploy.parameters.json with all the required inputs.

```json
{
	"$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"masterVmSize": {
			"value": "Standard_E2s_v3"
		},
		"infraVmSize": {
			"value": "Standard_D4s_v3"
		},
		"nodeVmSize": {
			"value": "Standard_D4s_v3"
		},
		"cnsVmSize": {
			"value": "Standard_E4s_v3"
		},
		"osImageType": {
			"value": "defaultgallery"
		},
		"marketplaceOsImage": {
			"value": {
				"publisher": "RedHat",
				"offer": "RHEL",
				"sku": "7-RAW",
				"version": "latest"
			}
		},
		"storageKind": {
			"value": "managed"
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
			"value": "false"
		},
		"enableCNS": {
			"value": "false"
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
		"rhsmBrokerPoolId": {
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
		"masterClusterDnsType": {
			"value": "default"
		},
		"masterClusterDns": {
			"value": "console.contoso.com"
		},
		"routingSubDomainType": {
			"value": "nipio"
		},
		"routingSubDomain": {
			"value": "routing.contoso.com"
		},
		"virtualNetworkNewOrExisting": {
			"value": "new"
		},
		"virtualNetworkName": {
			"value": "openshiftvnet"
		},
		"addressPrefixes": {
			"value": "10.0.0.0/14"
		},
		"masterSubnetName": {
			"value": "mastersubnet"
		},
		"masterSubnetPrefix": {
			"value": "10.1.0.0/16"
		},
		"infraSubnetName": {
			"value": "infrasubnet"
		},
		"infraSubnetPrefix": {
			"value": "10.2.0.0/16"
		},
		"nodeSubnetName": {
			"value": "nodesubnet"
		},
		"nodeSubnetPrefix": {
			"value": "10.3.0.0/16"
		},
		"existingMasterSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/mastersubnet"
		},
		"existingInfraSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/masterinfrasubnet"
		},
		"existingCnsSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/cnssubnet"
		},
		"existingNodeSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/nodesubnet"
		},
		"masterClusterType": {
			"value": "public"
		},
		"masterPrivateClusterIp": {
			"value": "10.1.0.200"
		},
		"routerClusterType": {
			"value": "public"
		},
		"routerPrivateClusterIp": {
			"value": "10.2.0.201"
		},
		"routingCertType": {
			"value": "selfsigned"
		},
		"masterCertType": {
			"value": "selfsigned"
		},
		"proxySettings": {
			"value": "none"
		},
		"httpProxyEntry": {
			"value": "none"
		},
		"httpsProxyEntry": {
			"value": "none"
		},
		"noProxyEntry": {
			"value": "none"
		}
	}
}
```

Replace the parameters with your specific information.

Different releases may have different parameters so verify the necessary parameters for the branch you use.

### Deploy using Azure CLI

> [!NOTE] 
> The following command requires Azure CLI 2.0.8 or later. You can verify the CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latesti).

The following example deploys the OpenShift cluster and all related resources into a resource group named openshiftrg, with a deployment name of myOpenShiftCluster. The template is referenced directly from the GitHub repo, and a local parameters file named azuredeploy.parameters.json file is used.

```azurecli 
az group deployment create -g openshiftrg --name myOpenShiftCluster \
      --template-uri https://raw.githubusercontent.com/Microsoft/openshift-container-platform/master/azuredeploy.json \
      --parameters @./azuredeploy.parameters.json
```

The deployment takes at least 30 minutes to complete, based on the total number of nodes deployed and options configured. The Bastion DNS FQDN and URL of the OpenShift console prints to the terminal when the deployment finishes.

```json
{
  "Bastion DNS FQDN": "bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com",
  "OpenShift Console URL": "http://openshiftlb.eastus.cloudapp.azure.com/console"
}
```

If you don't want to tie up the command line waiting for the deployment to complete, add `--no-wait` as one of the options for the group deployment. The output from the deployment can be retrieved from the Azure portal in the deployment section for the resource group.
 
## Deploy using the OpenShift Container Platform Azure Marketplace offer

The simplest way to deploy OpenShift Container Platform into Azure is to use the [Azure Marketplace offer](https://azuremarketplace.microsoft.com/marketplace/apps/redhat.openshift-container-platform?tab=Overview).

This is the simplest option, but it also has limited customization capabilities. The Marketplace offer includes the following configuration options:

- **Master Nodes**: Three (3) Master Nodes with configurable instance type.
- **Infra Nodes**: Three (3) Infra Nodes with configurable instance type.
- **Nodes**: The number of Nodes is configurable (between 2 and 9) as well as the instance type.
- **Disk Type**: Managed Disks are used.
- **Networking**: Support for new or existing Network as well as custom CIDR range.
- **CNS**: CNS can be enabled.
- **Metrics**: Metrics can be enabled.
- **Logging**: Logging can be enabled.
- **Azure Cloud Provider**: Can be enabled.

## Connect to the OpenShift cluster

When the deployment finishes, retrieve the connection from the output section of the deployment. Connect to the OpenShift console with your browser by using the `OpenShift Console URL`. Alternatively, you can SSH to the Bastion host. Following is an example where the admin username is clusteradmin and the bastion public IP DNS FQDN is bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com:

```bash
$ ssh clusteradmin@bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com
```

## Clean up resources

Use the [az group delete](/cli/azure/group#az_group_delete) command to remove the resource group, OpenShift cluster, and all related resources when they're no longer needed.

```azurecli 
az group delete --name openshiftrg
```

## Next steps

- [Post-deployment tasks](./openshift-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-troubleshooting.md)
- [Getting started with OpenShift Container Platform](https://docs.openshift.com/container-platform)

### Documentation contributors

Thank you to Vincent Power (vincepower) and Alfred Sin (asinn826) for their contributions to keeping this documentation up-to-date!