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
- Install the [Azure CLI 2.0](/cli/azure/install-azure-cli)

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
ResourceGroupName="sflinuxclustergroup"
az group create --name $ResourceGroupName --location "South Central US"
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

To make the process easier, we have provided a [helper script](http://github.com/ChackDan/Service-Fabric/tree/master/Scripts/CertUpload4Linux). Before you use this helper script, ensure that you already have Azure command-line interface (CLI) installed, and it is in your path. Make sure that the script has permissions to execute by running `chmod +x cert_helper.py` after downloading it. The first step is to sign in to your Azure account by using CLI with the `azure login` command. After signing in to your Azure account, use the helper script with your CA signed certificate, as the following command shows:

```sh
./cert_helper.py [-h] CERT_TYPE [-ifile INPUT_CERT_FILE] [-sub SUBSCRIPTION_ID] [-rgname RESOURCE_GROUP_NAME] [-kv KEY_VAULT_NAME] [-sname CERTIFICATE_NAME] [-l LOCATION] [-p PASSWORD]
```

The -ifile parameter can take a .pfx file or a .pem file as input, with the certificate type (pfx or pem, or ss if it is a self-signed certificate).
The parameter -h prints out the help text.


This command returns the following three strings as the output:

* SourceVaultID, which is the ID for the new KeyVault ResourceGroup it created for you
* CertificateUrl for accessing the certificate
* CertificateThumbprint, which is used for authentication

The following example shows how to use the command:

```sh
./cert_helper.py pfx -sub "fffffff-ffff-ffff-ffff-ffffffffffff"  -rgname "mykvrg" -kv "mykevname" -ifile "/home/test/cert.pfx" -sname "mycert" -l "East US" -p "pfxtest"
```
Executing the preceding command gives you the three strings as follows:

```sh
SourceVault: /subscriptions/fffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/mykvrg/providers/Microsoft.KeyVault/vaults/mykvname
CertificateUrl: https://myvault.vault.azure.net/secrets/mycert/00000000000000000000000000000000
CertificateThumbprint: 0xfffffffffffffffffffffffffffffffffffffffff
```

The certificate's subject name must match the domain that you use to access the Service Fabric cluster. This match is required to provide an SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a CA for the `.cloudapp.azure.com` domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

These subject names are the entries you need to create a secure Service Fabric cluster (without Azure AD), as described at [Configure Resource Manager template parameters](#configure-arm). You can connect to the secure cluster by following the instructions for [authenticating client access to a cluster](service-fabric-connect-to-secure-cluster.md). Linux preview clusters do not support Azure AD authentication. You can assign admin and client roles as described in the [Assign roles to users](#assign-roles) section. When you specify admin and client roles for a Linux preview cluster, you have to provide certificate thumbprints for authentication. (You do not provide the subject name, because no chain validation or revocation is being performed in this preview release.)

If you want to use a self-signed certificate for testing, you can use the same script to generate one. You can then upload the certificate to your key vault by providing the flag `ss` instead of providing the certificate path and certificate name. For example, see the following command for creating and uploading a self-signed certificate:

```sh
./cert_helper.py ss -rgname "mykvrg" -sub "fffffff-ffff-ffff-ffff-ffffffffffff" -kv "mykevname"   -sname "mycert" -l "East US" -p "selftest" -subj "mytest.eastus.cloudapp.net"
```
This command returns the same three strings: SourceVault, CertificateUrl, and CertificateThumbprint. You can then use the strings to create both a secure Linux cluster and a location where the self-signed certificate is placed. You need the self-signed certificate to connect to the cluster. You can connect to the secure cluster by following the instructions for [authenticating client access to a cluster](service-fabric-connect-to-secure-cluster.md).

The certificate's subject name must match the domain that you use to access the Service Fabric cluster. This match is required to provide an SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a CA for the `.cloudapp.azure.com` domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

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
