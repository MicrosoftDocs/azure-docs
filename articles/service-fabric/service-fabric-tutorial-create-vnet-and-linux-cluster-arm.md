---
title: Create a Service Fabric cluster in Azure | Microsoft Docs
description: Learn how to create a Linux cluster in Azure using a template.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/06/2017
ms.author: ryanwi

---

# Create a secure Linux cluster on Azure using a template
This tutorial is part one of a series. You will learn how to create a Service Fabric cluster (Linux) running in Azure. When you're finished, you have a cluster running in the cloud that you can deploy applications to. To create a Windows cluster, see [Create a secure Windows cluster on Azure using a template](service-fabric-tutorial-create-vnet-and-windows-cluster-arm.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VNET in Azure using a template
> * Create a key vault and upload a certificate
> * Create a secure Service Fabric cluster in Azure using a template
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using Service Fabric CLI
> * Remove a cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure cluster on Azure using a template
> * [Deploy API Management with Service Fabric](service-fabric-tutorial-deploy-api-management.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK and CLI](service-fabric-get-started-linux.md)
- Install the [Azure CLI 2.0](/cli/azure/install-azure-cli?view=azure-cli-latest)

The following procedures create a five-node Service Fabric cluster. The cluster is secured by a self-signed certificate placed in a key vault. 

To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).
For more information on creating Service Fabric clusters, see [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

## Sign-in to Azure and select your subscription
This guide uses Azure CLI. When you start a new session, sign in to your Azure account and select your subscription before you execute Azure commands.
 
Run the following script to sign in to your Azure account select your subscription:

```azurecli
az login
az account set --subscription <guid>
```

## Create a resource group
Create a new resource group for your deployment and give it a name and a location.

```azurecli
ResourceGroupName = "sfclustertutorialgroup"
az group create --name $ResourceGroupName --location "Central US"
```

## Deploy the network topology
Next, set up the network topology to which API Management and the Service Fabric cluster will be deployed. The [network.json][network-arm] Resource Manager template is configured to create a virtual network (VNET) and also a subnet and network security group (NSG) for Service Fabric and a subnet and NSG for API Management. Learn more about VNETs, subnets, and NSGs [here](../virtual-network/virtual-networks-overview.md).

The [network.parameters.json][network-parameters-arm] parameters file contains the names of the subnets and NSGs that Service Fabric and API Management deploy to.  API Management is deployed in the [following tutorial](service-fabric-tutorial-deploy-api-management.md). For this guide, the parameter values do not need to be changed. The Service Fabric Resource Manager templates use these values.  If the values are modified here, you must modify them in the other Resource Manager templates used in this tutorial and the [Deploy API Management tutorial](service-fabric-tutorial-deploy-api-management.md). 

Download the following Resource Manager template and parameters file:
- [network.json][network-arm]
- [network.parameters.json][network-parameters-arm]

Use the following script to deploy the Resource Manager template and parameter files for the network setup:

```azurecli
az group deployment create \
    --name VnetDeployment \
    --resource-group $ResourceGroupName \
    --template-file network.json \
    --parameters @network.parameters.json
```

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>
## Create a key vault and upload a certificate
The Service Fabric cluster Resource Manager template in the next step is configured to create a secure cluster with certificate security. The certificate is used to secure node-to-node communication for your cluster and to manage user access to your Service Fabric cluster. API Management also uses this certificate to access the Service Fabric Naming Service for service discovery. This requires having a certificate in Key Vault for cluster security.

The following script creates a self-signed certificate.  Skip this step if you want to use an existing certificate.   If you want to use an existing certificate, set **$CreateSelfSignedCertificate** to "$false" and specify the location in **$ExistingPfxFilePath**.

```bash
#!/bin/bash

password="$(openssl rand -base64 32)"
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout clusterCert.key -out clusterCert.crt -subj "/CN=examplecluster.centralus.cloudapp.azure.com"
openssl pkcs12 -export -out clusterCert.pfx -inkey clusterCert.key -in clusterCert.crt -passout pass:"cat10dog"
```

To upload the certificate to keyvault we must first format the certificate and add additional data to it so that Service Fabric knows how to use it. The format is a base64 encoded json blob containing the following keys: 'data', 'dataType' and 'password'. Data should be the base64 encoded byte array of the PFX file. The following Python script properly encodes the PFX file to be uploaded to Keyvault, save it as *servicefabric.py*.

```python
#!/usr/bin/env python
from __future__ import print_function

import argparse
import base64
import json

def formatCertificateToKeyvaultSecret(args):
	f = open(args.cert_file, 'rb')
	try:
		ba = bytearray(f.read())
		cert_base64 = base64.b64encode(ba)
		json_blob = {
			'data': cert_base64,
			'dataType': 'pfx',
			'password': args.password
		}
		blob_data = json.dumps(json_blob)
		content_bytes = bytearray(blob_data)
		content = base64.b64encode(content_bytes)
		return content
	finally:
		f.close()

def main():
	parser = argparse.ArgumentParser()
	
	subparsers = parser.add_subparsers()
	
	formatCertSecretParser = subparsers.add_parser('format-secret', help='Formats the certificate into the expected format for service fabric, normally followed by uploading this to keyvault')
	formatCertSecretParser.add_argument('-c', '--pkcs12-cert', dest='cert_file', required=True, help='The pkcs12 cert that you want to format as a secret for Service Fabric Keyvault')
	formatCertSecretParser.add_argument('-p', '--password', dest='password', required=True, help='The password for the certificate')
	formatCertSecretParser.set_defaults(func=formatCertificateToKeyvaultSecret)
	
	args = parser.parse_args()
	print(args.func(args))

if __name__ == "__main__":
	main()
```

The following script creates a key vault in Azure and uploads the cluster certificate to the key vault.
```azurecli
#!/bin/bash

VaultResourceGroupName="ryanwikekeyvaultgroup"
VaultName="ryanwikeyvault2"
Location="centralus"
PfxPath="./clusterCert.pfx"
CertPwd="cat10dog"
SecretName="ClusterCert"

az group create --name $VaultResourceGroupName --location $Location

az keyvault create --name $VaultName --resource-group $VaultResourceGroupName --enabled-for-deployment true --enabled-for-template-deployment true

formatted_secret=$(./servicefabric.py format-secret --pkcs12-cert $PfxPath --password $CertPwd)
az keyvault secret set --vault-name $VaultName --name $SecretName --value $formatted_secret

CERT_THUMB=$(openssl x509 -in clusterCert.crt -noout -fingerprint | awk -F= '{print $NF}' | sed -e 's/://g')
SECRET_URL=$(az keyvault secret show --vault-name $VaultName --name $SecretName | python -c 'import json,sys;print json.load(sys.stdin)["id"]')
KEYVAULTID=$(az keyvault show --name $VaultName | python -c 'import json,sys;print json.load(sys.stdin)["id"]')

echo "Thumbprint: $CERT_THUMB"
echo "Secret URL: $SECRET_URL"
echo "Vault ID: $KEYVAULTID"
```

## Deploy the Service Fabric cluster
Once the network resources have finished deploying and you've uploaded a certificate to a key vault, the next step is to deploy a Service Fabric cluster to the VNET in the subnet and NSG designated for the Service Fabric cluster. For this tutorial, the Service Fabric Resource Manager template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in a previous step.

Download the following Resource Manager template and parameters file:
- [cluster.json][cluster-arm]
- [cluster.parameters.json][cluster-parameters-arm]

Fill in the empty parameters in the `cluster.parameters.json` file for your deployment, including the [Key Vault information](service-fabric-cluster-creation-via-arm.md#set-up-a-key-vault) for your cluster certificate.

Use the following script to deploy the Resource Manager template and parameter files to create the Service Fabric cluster:

```azurecli
az group deployment create \
    --name ClusterDeployment \
    --resource-group $ResourceGroupName \
    --template-file cluster.json \
    --parameters @cluster.parameters.json
```

## Connect to the secure cluster
Connect to the cluster using the Service Fabric CLI, which provides many cmdlets for managing Service Fabric clusters, applications, and services.  Connect to the secure cluster using the key created previously.

```azurecli
sfctl cluster select --endpoint https://mysfcluster.southcentralus.cloudapp.azure.com:19080 \
--cert ./client.crt --key ./keyfile.key
```

Check that you are connected and the cluster is healthy using the [Get-ServiceFabricClusterHealth](/powershell/module/servicefabric/get-servicefabricclusterhealth) cmdlet.

```powershell
sfctl cluster health
```

## Clean up resources

A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group.

Log in to Azure and select the subscription ID with which you want to remove the cluster.  You can find your subscription ID by logging in to the [Azure portal](http://portal.azure.com). Delete the resource group and all the cluster resources using the [az group delete](/cli/azure/group?view=azure-cli-latest#az_group_delete) command.

```azurecli
az login
az account set --subscription <guid>

ResourceGroupName = "sfclustertutorialgroup"
az group delete --name $ResourceGroupName
```

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a VNET in Azure using a template
> * Create a key vault and upload a certificate
> * Create a secure Service Fabric cluster in Azure using a template
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using Service Fabric CLI
> * Remove a cluster

Next, advance to the following tutorial to learn how to deploy an existing application.
> [!div class="nextstepaction"]
> [Deploy API Managment](service-fabric-tutorial-deploy-api-management.md)


[network-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.json
[network-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.parameters.json

[cluster-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.json
[cluster-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.parameters.json
