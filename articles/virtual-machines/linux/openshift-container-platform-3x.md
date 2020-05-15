---
title: Deploy OpenShift Container Platform 3.11 in Azure 
description: Deploy OpenShift Container Platform 3.11 in Azure.
author: haroldwongms
manager: mdotson
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 04/05/2020
ms.author: haroldw
---

# Deploy OpenShift Container Platform 3.11 in Azure

You can use one of several methods to deploy OpenShift Container Platform 3.11 in Azure:

- You can manually deploy the necessary Azure infrastructure components and then follow the [OpenShift Container Platform documentation](https://docs.openshift.com/container-platform).
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-container-platform/) that simplifies the deployment of the OpenShift Container Platform cluster.
- Another option is to use the [Azure Marketplace offer](https://azuremarketplace.microsoft.com/marketplace/apps/osatesting.open-shift-azure-proxy).

For all options, a Red Hat subscription is required. During the deployment, the Red Hat Enterprise Linux instance is registered to the Red Hat subscription and attached to the Pool ID that contains the entitlements for OpenShift Container Platform.
Make sure you have a valid Red Hat Subscription Manager (RHSM) username, password, and Pool ID. You can use an Activation Key, Org ID, and Pool ID. You can verify this information by signing in to https://access.redhat.com.


## Deploy using the OpenShift Container Platform Resource Manager 3.11 template

### Private Clusters

Deploying private OpenShift clusters requires more than just not having a public IP associated to the master load balancer (web console) or to the infra load balancer (router).  A private cluster generally uses a custom DNS server (not the default Azure DNS), a custom domain name (such as contoso.com), and pre-defined virtual network(s).  For private clusters, you need to configure your virtual network with all the appropriate subnets and DNS server settings in advance.  Then use **existingMasterSubnetReference**, **existingInfraSubnetReference**, **existingCnsSubnetReference**, and **existingNodeSubnetReference** to specify the existing subnet for use by the cluster.

If private master is selected (**masterClusterType**=private), a static private IP needs to be specified for **masterPrivateClusterIp**.  This IP will be assigned to the front end of the master load balancer.  The IP must be within the CIDR for the master subnet and not in use.  **masterClusterDnsType** must be set to "custom" and the master DNS name must be provided for **masterClusterDns**.  The DNS name must map to the static Private IP and will be used to access the console on the master nodes.

If private router is selected (**routerClusterType**=private), a static private IP needs to be specified for **routerPrivateClusterIp**.  This IP will be assigned to the front end of the infra load balancer.  The IP must be within the CIDR for the infra subnet and not in use.  **routingSubDomainType** must be set to "custom" and the wildcard DNS name for routing must be provided for **routingSubDomain**.  

If private masters and private router are selected, the custom domain name must also be entered for **domainName**

After successful deployment, the Bastion Node is the only node with a public IP that you can ssh into.  Even if the master nodes are configured for public access, they aren't exposed for ssh access.

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
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"_artifactsLocation": {
			"value": "https://raw.githubusercontent.com/Microsoft/openshift-container-platform/master"
		},
		"location": {
			"value": "eastus"
		},
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
			"value": "changeme"
		},
		"openshiftClusterPrefix": {
			"value": "changeme"
		},
		"minorVersion": {
			"value": "69"
		},
		"masterInstanceCount": {
			"value": 3
		},
		"infraInstanceCount": {
			"value": 3
		},
		"nodeInstanceCount": {
			"value": 3
		},
		"cnsInstanceCount": {
			"value": 3
		},
		"osDiskSize": {
			"value": 64
		},
		"dataDiskSize": {
			"value": 64
		},
		"cnsGlusterDiskSize": {
			"value": 128
		},
		"adminUsername": {
			"value": "changeme"
		},
		"enableMetrics": {
			"value": "false"
		},
		"enableLogging": {
			"value": "false"
		},
		"enableCNS": {
			"value": "false"
		},
		"rhsmUsernameOrOrgId": {
			"value": "changeme"
		},
		"rhsmPoolId": {
			"value": "changeme"
		},
		"rhsmBrokerPoolId": {
			"value": "changeme"
		},
		"sshPublicKey": {
			"value": "GEN-SSH-PUB-KEY"
		},
		"keyVaultSubscriptionId": {
			"value": "255a325e-8276-4ada-af8f-33af5658eb34"
		},
		"keyVaultResourceGroup": {
			"value": "changeme"
		},
		"keyVaultName": {
			"value": "changeme"
		},
		"enableAzure": {
			"value": "true"
		},
		"aadClientId": {
			"value": "changeme"
		},
		"domainName": {
			"value": "contoso.com"
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
			"value": "apps.contoso.com"
		},
		"virtualNetworkNewOrExisting": {
			"value": "new"
		},
		"virtualNetworkName": {
			"value": "changeme"
		},
		"addressPrefixes": {
			"value": "10.0.0.0/14"
		},
		"masterSubnetName": {
			"value": "changeme"
		},
		"masterSubnetPrefix": {
			"value": "10.1.0.0/16"
		},
		"infraSubnetName": {
			"value": "changeme"
		},
		"infraSubnetPrefix": {
			"value": "10.2.0.0/16"
		},
		"nodeSubnetName": {
			"value": "changeme"
		},
		"nodeSubnetPrefix": {
			"value": "10.3.0.0/16"
		},
		"existingMasterSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/mastersubnet"
		},
		"existingInfraSubnetReference": {
			"value": "/subscriptions/abc686f6-963b-4e64-bff4-99dc369ab1cd/resourceGroups/vnetresourcegroup/providers/Microsoft.Network/virtualNetworks/openshiftvnet/subnets/infrasubnet"
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
			"value": "10.2.0.200"
		},
		"routingCertType": {
			"value": "selfsigned"
		},
		"masterCertType": {
			"value": "selfsigned"
		}
	}
}
```

Replace the parameters with your specific information.

Different releases may have different parameters so verify the necessary parameters for the branch you use.

### azuredeploy.Parameters.json file explained

| Property | Description | Valid Options | Default Value |
|----------|-------------|---------------|---------------|
| `_artifactsLocation`  | URL for artifacts (json, scripts, etc.) |  |  https:\//raw.githubusercontent.com/Microsoft/openshift-container-platform/master  |
| `location` | Azure region to deploy resources to |  |  |
| `masterVmSize` | Size of the Master VM. Select from one of the allowed VM sizes listed in the azuredeploy.json file |  | Standard_E2s_v3 |
| `infraVmSize` | Size of the Infra VM. Select from one of the allowed VM sizes listed in the azuredeploy.json file |  | Standard_D4s_v3 |
| `nodeVmSize` | Size of the App Node VM. Select from one of the allowed VM sizes listed in the azuredeploy.json file |  | Standard_D4s_v3 |
| `cnsVmSize` | Size of the Container Native Storage (CNS) Node VM. Select from one of the allowed VM sizes listed in the azuredeploy.json file |  | Standard_E4s_v3 |
| `osImageType` | The RHEL image to use. defaultgallery: On-Demand; marketplace: third-party image | defaultgallery <br> marketplace | defaultgallery |
| `marketplaceOsImage` | If `osImageType` is marketplace, then enter the appropriate values for 'publisher', 'offer', 'sku', 'version' of the marketplace offer. This parameter is an object type |  |  |
| `storageKind` | The type of storage to be used  | managed<br> unmanaged | managed |
| `openshiftClusterPrefix` | Cluster Prefix used to configure hostnames for all nodes.  Between 1 and 20 characters |  | mycluster |
| `minoVersion` | The minor version of OpenShift Container Platform 3.11 to deploy |  | 69 |
| `masterInstanceCount` | Number of Masters nodes to deploy | 1, 3, 5 | 3 |
| `infraInstanceCount` | Number of infra nodes to deploy | 1, 2, 3 | 3 |
| `nodeInstanceCount` | Number of Nodes to deploy | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30 | 2 |
| `cnsInstanceCount` | Number of CNS nodes to deploy | 3, 4 | 3 |
| `osDiskSize` | Size of OS disk for the VM (in GB) | 64, 128, 256, 512, 1024, 2048 | 64 |
| `dataDiskSize` | Size of data disk to attach to nodes for Docker volume (in GB) | 32, 64, 128, 256, 512, 1024, 2048 | 64 |
| `cnsGlusterDiskSize` | Size of data disk to attach to CNS nodes for use by glusterfs (in GB | 32, 64, 128, 256, 512, 1024, 2048 | 128 |
| `adminUsername` | Admin username for both OS (VM) login and initial OpenShift user |  | ocpadmin |
| `enableMetrics` | Enable Metrics. Metrics require more resources so select proper size for Infra VM | true <br> false | false |
| `enableLogging` | Enable Logging. elasticsearch pod requires 8 GB RAM so select proper size for Infra VM | true <br> false | false |
| `enableCNS` | Enable Container Native Storage | true <br> false | false |
| `rhsmUsernameOrOrgId` | Red Hat Subscription Manager Username or Organization ID |  |  |
| `rhsmPoolId` | The Red Hat Subscription Manager Pool ID that contains your OpenShift entitlements for compute nodes |  |  |
| `rhsmBrokerPoolId` | The Red Hat Subscription Manager Pool ID that contains your OpenShift entitlements for masters and infra nodes. If you don't have different pool IDs, enter same pool ID as 'rhsmPoolId' |  |
| `sshPublicKey` | Copy your SSH Public Key here |  |  |
| `keyVaultSubscriptionId` | The Subscription ID of the subscription that contains the Key Vault |  |  |
| `keyVaultResourceGroup` | The name of the Resource Group that contains the Key Vault |  |  |
| `keyVaultName` | The name of the Key Vault you created |  |  |
| `enableAzure` | Enable Azure Cloud Provider | true <br> false | true |
| `aadClientId` | Azure Active Directory Client ID also known as Application ID for Service Principal |  |  |
| `domainName` | Name of the custom domain name to use (if applicable). Set to "none" if not deploying fully private cluster |  | none |
| `masterClusterDnsType` | Domain type for OpenShift web console. 'default' will use DNS label of master infra public IP. 'custom' allows you to define your own name | default <br> custom | default |
| `masterClusterDns` | The custom DNS name to use to access the OpenShift web console if you selected 'custom' for `masterClusterDnsType` |  | console.contoso.com |
| `routingSubDomainType` | If set to 'nipio', `routingSubDomain` will use nip.io.  Use 'custom' if you have your own domain that you want to use for routing | nipio <br> custom | nipio |
| `routingSubDomain` | The wildcard DNS name you want to use for routing if you selected 'custom' for `routingSubDomainType` |  | apps.contoso.com |
| `virtualNetworkNewOrExisting` | Select whether to use an existing Virtual Network or create a new Virtual Network | existing <br> new | new |
| `virtualNetworkResourceGroupName` | Name of the Resource Group for the new Virtual Network if you selected 'new' for `virtualNetworkNewOrExisting` |  | resourceGroup().name |
| `virtualNetworkName` | The name of the new Virtual Network to create if you selected 'new' for `virtualNetworkNewOrExisting` |  | openshiftvnet |
| `addressPrefixes` | Address prefix of the new virtual network |  | 10.0.0.0/14 |
| `masterSubnetName` | The name of the master subnet |  | mastersubnet |
| `masterSubnetPrefix` | CIDR used for the master subnet - needs to be a subset of the addressPrefix |  | 10.1.0.0/16 |
| `infraSubnetName` | The name of the infra subnet |  | infrasubnet |
| `infraSubnetPrefix` | CIDR used for the infra subnet - needs to be a subset of the addressPrefix |  | 10.2.0.0/16 |
| `nodeSubnetName` | The name of the node subnet |  | nodesubnet |
| `nodeSubnetPrefix` | CIDR used for the node subnet - needs to be a subset of the addressPrefix |  | 10.3.0.0/16 |
| `existingMasterSubnetReference` | Full reference to existing subnet for master nodes. Not needed if creating new vNet / Subnet |  |  |
| `existingInfraSubnetReference` | Full reference to existing subnet for infra nodes. Not needed if creating new vNet / Subnet |  |  |
| `existingCnsSubnetReference` | Full reference to existing subnet for CNS nodes. Not needed if creating new vNet / Subnet |  |  |
| `existingNodeSubnetReference` | Full reference to existing subnet for compute nodes. Not needed if creating new vNet / Subnet |  |  |
| `masterClusterType` | Specify whether the cluster uses private or public master nodes. If private is chosen, the master nodes won't be exposed to the Internet via a public IP. Instead, it will use the private IP specified in the `masterPrivateClusterIp` | public <br> private | public |
| `masterPrivateClusterIp` | If private master nodes are selected, then a private IP address must be specified for use by the internal load balancer for master nodes. This static IP must be within the CIDR block for the master subnet and not already in use. If public master nodes are selected, this value won't be used but must still be specified |  | 10.1.0.200 |
| `routerClusterType` | Specify whether the cluster uses private or public infra nodes. If private is chosen, the infra nodes won't be exposed to the Internet via a public IP. Instead, it will use the private IP specified in the `routerPrivateClusterIp` | public <br> private | public |
| `routerPrivateClusterIp` | If private infra nodes are selected, then a private IP address must be specified for use by the internal load balancer for infra nodes. This static IP must be within the CIDR block for the infra subnet and not already in use. If public infra nodes are selected, this value won't be used but must still be specified |  | 10.2.0.200 |
| `routingCertType` | Use custom certificate for routing domain or the default self-signed certificate - follow instructions in **Custom Certificates** section | selfsigned <br> custom | selfsigned |
| `masterCertType` | Use custom certificate for master domain or the default self-signed certificate - follow instructions in **Custom Certificates** section | selfsigned <br> custom | selfsigned |

<br>

### Deploy using Azure CLI

> [!NOTE] 
> The following command requires Azure CLI 2.0.8 or later. You can verify the CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latesti).

The following example deploys the OpenShift cluster and all related resources into a resource group named openshiftrg, with a deployment name of myOpenShiftCluster. The template is referenced directly from the GitHub repo, and a local parameters file named azuredeploy.parameters.json file is used.

```azurecli 
az group deployment create -g openshiftrg --name myOpenShiftCluster \
      --template-uri https://raw.githubusercontent.com/Microsoft/openshift-container-platform/master/azuredeploy.json \
      --parameters @./azuredeploy.parameters.json
```

The deployment takes at least 60 minutes to complete, based on the total number of nodes deployed and options configured. The Bastion DNS FQDN and URL of the OpenShift console prints to the terminal when the deployment finishes.

```json
{
  "Bastion DNS FQDN": "bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com",
  "OpenShift Console URL": "http://openshiftlb.eastus.cloudapp.azure.com/console"
}
```

If you don't want to tie up the command line waiting for the deployment to complete, add `--no-wait` as one of the options for the group deployment. The output from the deployment can be retrieved from the Azure portal in the deployment section for the resource group.

## Connect to the OpenShift cluster

When the deployment finishes, retrieve the connection from the output section of the deployment. Connect to the OpenShift console with your browser by using the **OpenShift Console URL**. You can also SSH to the Bastion host. Following is an example where the admin username is clusteradmin and the bastion public IP DNS FQDN is bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com:

```bash
$ ssh clusteradmin@bastiondns4hawllzaavu6g.eastus.cloudapp.azure.com
```

## Clean up resources

Use the [az group delete](/cli/azure/group) command to remove the resource group, OpenShift cluster, and all related resources when they're no longer needed.

```azurecli 
az group delete --name openshiftrg
```

## Next steps

- [Post-deployment tasks](./openshift-container-platform-3x-post-deployment.md)
- [Troubleshoot OpenShift deployment in Azure](./openshift-container-platform-3x-troubleshooting.md)
- [Getting started with OpenShift Container Platform](https://docs.openshift.com)
