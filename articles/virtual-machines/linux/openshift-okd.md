---
title: Deploy OKD in Azure 
description: Deploy OKD in Azure.
author: haroldwongms
manager: joraio
ms.service: virtual-machines-linux
ms.subservice: workloads
ms.topic: article
ms.workload: infrastructure
ms.date: 10/15/2019
ms.author: haroldw
---

# Deploy OKD in Azure

You can use one of two ways to deploy OKD (formerly OpenShift Origin) in Azure:

- You can manually deploy all the necessary Azure infrastructure components, and then follow the [OKD documentation](https://docs.okd.io).
- You can also use an existing [Resource Manager template](https://github.com/Microsoft/openshift-origin) that simplifies the deployment of the OKD cluster.

## Deploy using the OKD template

To deploy using the Resource Manager template, you use a parameters file to supply the input parameters. To further customize the deployment, fork the GitHub repo and change the appropriate items.

Some common customization options include, but aren't limited to:

- Bastion VM size (variable in azuredeploy.json)
- Naming conventions (variables in azuredeploy.json)
- OpenShift cluster specifics, modified via hosts file (deployOpenShift.sh)

The [OKD template](https://github.com/Microsoft/openshift-origin) has multiple branches available for different versions of OKD.  Based on your needs, you can deploy directly from the repo or you can fork the repo and make custom changes before deploying.

Use the `appId` value from the service principal that you created earlier for the `aadClientId` parameter.

The following is an example of a parameters file named azuredeploy.parameters.json with all the required inputs.

```json
{
	"$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
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
		"sshPublicKey": {
			"value": "{SSH Public Key}"
		},
		"enableMetrics": {
			"value": "true"
		},
		"enableLogging": {
			"value": "false"
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

Replace the parameters with your specific information.

Different releases may have different parameters so please verify the necessary parameters for the branch you use.

### Deploy using Azure CLI


> [!NOTE] 
> The following command requires Azure CLI 2.0.8 or later. You can verify the CLI version with the `az --version` command. To update the CLI version, see [Install Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

The following example deploys the OKD cluster and all related resources into a resource group named openshiftrg, with a deployment name of myOpenShiftCluster. The template is referenced directly from the GitHub repo while using a local parameters file named azuredeploy.parameters.json.

```azurecli 
az group deployment create -g openshiftrg --name myOpenShiftCluster \
      --template-uri https://raw.githubusercontent.com/Microsoft/openshift-origin/master/azuredeploy.json \
      --parameters @./azuredeploy.parameters.json
```

The deployment takes at least 30 minutes to finish, based on the total number of nodes deployed. The URL of the OpenShift console and the DNS name of the OpenShift master prints to the terminal when the deployment finishes. Alternatively, you can view the outputs section of the deployment from the Azure portal.

```json
{
  "OpenShift Console Url": "http://openshiftlb.cloudapp.azure.com/console",
  "OpenShift Master SSH": "ssh -p 2200 clusteradmin@myopenshiftmaster.cloudapp.azure.com"
}
```

If you don't want to tie up the command line waiting for the deployment to complete, add `--no-wait` as one of the options for the group deployment. The output from the deployment can be retrieved from the Azure portal in the deployment section for the resource group.

## Connect to the OKD cluster

When the deployment finishes, connect to the OpenShift console with your browser using the `OpenShift Console Url`. Alternatively, you can SSH to the OKD master. Following is an example that uses the output from the deployment:

```bash
$ ssh -p 2200 clusteradmin@myopenshiftmaster.cloudapp.azure.com
```

## Clean up resources

Use the [az group delete](/cli/azure/group) command to remove the resource group, OpenShift cluster, and all related resources when they're no longer needed.

```azurecli 
az group delete --name openshiftrg
```

## Next steps

- [Post-deployment tasks](./openshift-container-platform-3x-post-deployment.md)
- [Troubleshoot OpenShift deployment](./openshift-container-platform-3x-troubleshooting.md)
- [Getting started with OKD](https://docs.okd.io)
