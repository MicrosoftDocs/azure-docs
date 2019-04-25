---
title: Create a Linux Service Fabric cluster in Azure | Microsoft Docs
description: Learn how to deploy a Linux Service Fabric cluster into an existing Azure virtual network using Azure CLI.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/14/2019
ms.author: aljo
ms.custom: mvc

---
# Deploy a Linux Service Fabric cluster into an Azure virtual network

In this article you learn how to deploy a Linux Service Fabric cluster into an [Azure virtual network (VNET)](../virtual-network/virtual-networks-overview.md) using Azure CLI and a template. When you're finished, you have a cluster running in the cloud that you can deploy applications to. To create a Windows cluster using PowerShell, see [Create a secure Windows cluster on Azure](service-fabric-tutorial-create-vnet-and-windows-cluster.md).

## Prerequisites

Before you begin:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Install the [Service Fabric CLI](service-fabric-cli.md)
* Install the [Azure CLI](/cli/azure/install-azure-cli)
* To learn the key concepts of clusters, read [Overview of Azure clusters](service-fabric-azure-clusters-overview.md)
* [Plan and prepare](service-fabric-cluster-azure-deployment-preparation.md) for a production cluster deployment.

The following procedures create a seven-node Service Fabric cluster. To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

## Download and explore the template

Download the following Resource Manager template files:

* [AzureDeploy.json][template]
* [AzureDeploy.Parameters.json][parameters]

This template deploys a secure cluster of seven virtual machines and three node types into a virtual network.  Other sample templates can be found on [GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates). The [AzureDeploy.json][template] deploys a number resources, including the following.

### Service Fabric cluster

In the **Microsoft.ServiceFabric/clusters** resource, a Linux cluster is deployed with the following characteristics:

* three node types
* five nodes in the primary node type (configurable in the template parameters), one node in each of the other node types
* OS: Ubuntu 16.04 LTS (configurable in the template parameters)
* certificate secured (configurable in the template parameters)
* [DNS service](service-fabric-dnsservice.md) is enabled
* [Durability level](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) of Bronze (configurable in the template parameters)
* [Reliability level](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) of Silver (configurable in the template parameters)
* client connection endpoint: 19000 (configurable in the template parameters)
* HTTP gateway endpoint: 19080 (configurable in the template parameters)

### Azure load balancer

In the **Microsoft.Network/loadBalancers** resource, a load balancer is configured and probes and rules setup for the following ports:

* client connection endpoint: 19000
* HTTP gateway endpoint: 19080
* application port: 80
* application port: 443

### Virtual network and subnet

The names of the virtual network and subnet are declared in the template parameters.  Address spaces of the virtual network and subnet are also declared in the template parameters and configured in the **Microsoft.Network/virtualNetworks** resource:

* virtual network address space: 10.0.0.0/16
* Service Fabric subnet address space: 10.0.2.0/24

If any other application ports are needed, then you will need to adjust the Microsoft.Network/loadBalancers resource to allow the traffic in.

## Set template parameters

The [AzureDeploy.Parameters][parameters] parameters file declares many values used to deploy the cluster and associated resources. Some of the parameters that you might need to modify for your deployment:

|Parameter|Example value|Notes|
|---|---||
|adminUserName|vmadmin| Admin username for the cluster VMs. |
|adminPassword|Password#1234| Admin password for the cluster VMs.|
|clusterName|mysfcluster123| Name of the cluster. |
|location|southcentralus| Location of the cluster. |
|certificateThumbprint|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate SHA1 thumbprint value. For example, "6190390162C988701DB5676EB81083EA608DCCF3". </p>|
|certificateUrlValue|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate URL. For example, "https:\//mykeyvault.vault.azure.net:443/secrets/mycertificate/02bea722c9ef4009a76c5052bcbf8346".</p>|
|sourceVaultValue||<p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the source vault value. For example, "/subscriptions/333cc2c84-12fa-5778-bd71-c71c07bf873f/resourceGroups/MyTestRG/providers/Microsoft.KeyVault/vaults/MYKEYVAULT".</p>|

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>

## Deploy the virtual network and cluster

Next, set up the network topology and deploy the Service Fabric cluster. The [AzureDeploy.json][template] Resource Manager template creates a virtual network (VNET) and a subnet for Service Fabric. The template also deploys a cluster with certificate security enabled.  For production clusters, use a certificate from a certificate authority (CA) as the cluster certificate. A self-signed certificate can be used to secure test clusters.

The template in this article deploy a cluster that uses the certificate thumbprint to identify the cluster certificate.  No two certificates can have the same thumbprint, which makes certificate management more difficult. Switching a deployed cluster from using certificate thumbprints to using certificate common names makes certificate management much simpler.  To learn how to update the cluster to use certificate common names for certificate management, read [change cluster to certificate common name management](service-fabric-cluster-change-cert-thumbprint-to-cn.md).

### Create a cluster using an existing certificate

The following script uses the [az sf cluster create](/cli/azure/sf/cluster?view=azure-cli-latest) command and template to deploy a new cluster secured with an existing certificate. The command also creates a new key vault in Azure and uploads your certificate.

```azurecli
ResourceGroupName="sflinuxclustergroup"
Location="southcentralus"
Password="q6D7nN%6ck@6"
VaultName="linuxclusterkeyvault"
VaultGroupName="linuxclusterkeyvaultgroup"
CertPath="C:\MyCertificates\MyCertificate.pem"

# sign in to your Azure account and select your subscription
az login
az account set --subscription <guid>

# Create a new resource group for your deployment and give it a name and a location.
az group create --name $ResourceGroupName --location $Location

# Create the Service Fabric cluster.
az sf cluster create --resource-group $ResourceGroupName --location $Location \
   --certificate-password $Password --certificate-file $CertPath \
   --vault-name $VaultName --vault-resource-group $ResourceGroupName  \
   --template-file AzureDeploy.json --parameter-file AzureDeploy.Parameters.json
```

### Create a cluster using a new, self-signed certificate

The following script uses the [az sf cluster create](/cli/azure/sf/cluster?view=azure-cli-latest) command and a template to deploy a new cluster in Azure. The command also creates a new key vault in Azure, adds a new self-signed certificate to the key vault, and downloads the certificate file locally.

```azurecli
ResourceGroupName="sflinuxclustergroup"
ClusterName="sflinuxcluster"
Location="southcentralus"
Password="q6D7nN%6ck@6"
VaultName="linuxclusterkeyvault"
VaultGroupName="linuxclusterkeyvaultgroup"
CertPath="C:\MyCertificates"

az sf cluster create --resource-group $ResourceGroupName --location $Location --cluster-name $ClusterName --template-file C:\temp\cluster\AzureDeploy.json --parameter-file C:\temp\cluster\AzureDeploy.Parameters.json --certificate-password $Password --certificate-output-folder $CertPath --certificate-subject-name $ClusterName.$Location.cloudapp.azure.com --vault-name $VaultName --vault-resource-group $ResourceGroupName
```

## Connect to the secure cluster

Connect to the cluster using the Service Fabric CLI command `sfctl cluster select` with your key.  Note, only use the **--no-verify** option for a self-signed certificate.

```azurecli
sfctl cluster select --endpoint https://aztestcluster.southcentralus.cloudapp.azure.com:19080 \
--pem ./aztestcluster201709151446.pem --no-verify
```

Check that you are connected and the cluster is healthy using the `sfctl cluster health` command.

```azurecli
sfctl cluster health
```

## Clean up resources

If you're not immediately moving on to the next article, you might want to [delete the cluster](service-fabric-cluster-delete.md) to avoid incurring charges.

## Next steps

Learn how to [scale a Cluster](service-fabric-tutorial-scale-cluster.md).

The template in this article deploy a cluster that uses the certificate thumbprint to identify the cluster certificate.  No two certificates can have the same thumbprint, which makes certificate management more difficult. Switching a deployed cluster from using certificate thumbprints to using certificate common names makes certificate management much simpler.  To learn how to update the cluster to use certificate common names for certificate management, read [change cluster to certificate common name management](service-fabric-cluster-change-cert-thumbprint-to-cn.md).

[template]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-3-NodeTypes-Secure/AzureDeploy.json
[parameters]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/7-VM-Ubuntu-3-NodeTypes-Secure/AzureDeploy.Parameters.json
