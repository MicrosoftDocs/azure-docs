---
title: Create a Windows Service Fabric cluster in Azure | Microsoft Docs
description: In this tutorial, you learn how to deploy a Windows Service Fabric cluster into an Azure virtual network and network security group using PowerShell.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid:
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/27/2018
ms.author: ryanwi
ms.custom: mvc
---
# Tutorial: Deploy a Service Fabric Windows cluster into an Azure virtual network

This tutorial is part one of a series. You learn how to deploy a Service Fabric cluster running Windows into an [Azure virtual network (VNET)](../virtual-network/virtual-networks-overview.md) and [network security group](../virtual-network/virtual-networks-nsg.md) using PowerShell and a template. When you're finished, you have a cluster running in the cloud that you can deploy applications to.  To create a Linux cluster using Azure CLI, see [Create a secure Linux cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

This tutorial describes a production scenario.  If you want to quickly create a small cluster for testing purposes, see [Create a three node test cluster](./scripts/service-fabric-powershell-create-test-cluster.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a VNET in Azure using PowerShell
> * Create a key vault and upload a certificate
> * Create a secure Service Fabric cluster in Azure PowerShell
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure cluster on Azure
> * [Scale a cluster in or out](service-fabric-tutorial-scale-cluster.md)
> * [Upgrade the runtime of a cluster](service-fabric-tutorial-upgrade-cluster.md)
> * [Delete a cluster](service-fabric-tutorial-delete-cluster.md)

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md)
* Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps)

The following procedures create a five-node Service Fabric cluster. To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

## Key concepts

A [Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. Clusters can scale to thousands of machines. A machine or VM that is part of a cluster is called a node. Each node is assigned a node name (a string). Nodes have characteristics such as placement properties.

A node type defines the size, number, and properties for a set of virtual machines in the cluster. Every defined node type is set up as a [virtual machine scale set](/azure/virtual-machine-scale-sets/), an Azure compute resource you use to deploy and manage a collection of virtual machines as a set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Node types are used to define roles for a set of cluster nodes, such as "front end" or "back end".  Your cluster can have more than one node type, but the primary node type must have at least five VMs for production clusters (or at least three VMs for test clusters).  [Service Fabric system services](service-fabric-technical-overview.md#system-services) are placed on the nodes of the primary node type.

The cluster is secured with a cluster certificate. A cluster certificate is an X.509 certificate used to secure node-to-node communication and authenticate the cluster management endpoints to a management client.  The cluster certificate also provides an SSL for the HTTPS management API and for Service Fabric Explorer over HTTPS. Self signed certificates are useful for test clusters.  For production clusters, use a certificate from a certificate authority (CA) as the cluster certificate.

The cluster certificate must:

* contain a private key.
* be created for key exchange, which is exportable to a Personal Information Exchange (.pfx) file.
* have a subject name that matches the domain that you use to access the Service Fabric cluster. This matching is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the .cloudapp.azure.com domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

Azure Key Vault is used to manage certificates for Service Fabric clusters in Azure.  When a cluster is deployed in Azure, the Azure resource provider responsible for creating Service Fabric clusters pulls certificates from Key Vault and installs them on the cluster VMs.

This tutorial displays a cluster with five nodes in a single node type. For any production cluster deployment, however, [capacity planning](service-fabric-cluster-capacity.md) is an important step. Here are some things to consider as a part of that process.

* The number of nodes and node types that your cluster needs
* The properties of each of node type (for example size, primary, internet facing, and number of VMs)
* The reliability and durability characteristics of the cluster

## Download and explore the template

Download the following Resource Manager template files:

* [azuredeploy.json][template]
* [azuredeploy.parameters.json][parameters]

This template deploys a secure cluster of five virtual machines and a single node type into a virtual network and a network security group.  Other sample templates can be found on [GitHub](https://github.com/Azure-Samples/service-fabric-cluster-templates).  The [azuredeploy.json][template] deploys a number resources, including the following.

### Service Fabric cluster

In the **Microsoft.ServiceFabric/clusters** resource, a Windows cluster is configured with the following characteristics:

* a single node type
* five nodes in the primary node type (configurable in the template parameters)
* OS: Windows Server 2016 Datacenter with Containers (configurable in the template parameters)
* certificate secured (configurable in the template parameters)
* [reverse proxy](service-fabric-reverseproxy.md) is enabled
* [DNS service](service-fabric-dnsservice.md) is enabled
* [Durability level](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) of Bronze (configurable in the template parameters)
* [Reliability level](service-fabric-cluster-capacity.md#the-reliability-characteristics-of-the-cluster) of Silver (configurable in the template parameters)
* client connection endpoint: 19000 (configurable in the template parameters)
* HTTP gateway endpoint: 19080 (configurable in the template parameters)

### Azure load balancer

In the **Microsoft.Network/loadBalancers** resource, a load balancer is configured and probes and rules are setup for the following ports:

* client connection endpoint: 19000
* HTTP gateway endpoint: 19080
* application port: 80
* application port: 443
* Service Fabric reverse proxy: 19081

If any other application ports are needed, then you will need to adjust the **Microsoft.Network/loadBalancers** resource and the **Microsoft.Network/networkSecurityGroups** resource to allow the traffic in.

### Virtual network, subnet, and network security group

The names of the virtual network, subnet, and network security group are declared in the template parameters.  Address spaces of the virtual network and subnet are also declared in the template parameters and configured in the **Microsoft.Network/virtualNetworks** resource:

* virtual network address space: 172.16.0.0/20
* Service Fabric subnet address space: 172.16.2.0/23

The following inbound traffic rules are enabled in the **Microsoft.Network/networkSecurityGroups** resource. You can change the port values by changing the template variables.

* ClientConnectionEndpoint (TCP): 19000
* HttpGatewayEndpoint (HTTP/TCP): 19080
* SMB : 445
* Internodecommunication - 1025, 1026, 1027
* Ephemeral port range – 49152 to 65534 (need a min of 256 ports )
* Ports for application use: 80 and 443
* Application port range – 49152 to 65534 (used for service to service communication and unlike are not opened on the Load balancer )
* Block all other ports

If any other application ports are needed, then you will need to adjust the **Microsoft.Network/loadBalancers** resource and the **Microsoft.Network/networkSecurityGroups** resource to allow the traffic in.

## Set template parameters

The [azuredeploy.parameters.json][parameters] parameters file declares many values used to deploy the cluster and associated resources. Some of the parameters that you might need to modify for your deployment:

|Parameter|Example value|Notes|
|---|---||
|adminUserName|vmadmin| Admin username for the cluster VMs.[Username requirements for VM](https://docs.microsoft.com/azure/virtual-machines/windows/faq#what-are-the-username-requirements-when-creating-a-vm) |
|adminPassword|Password#1234| Admin password for the cluster VMs. [Password requirements for VM](https://docs.microsoft.com/azure/virtual-machines/windows/faq#what-are-the-password-requirements-when-creating-a-vm)|
|clusterName|mysfcluster123| Name of the cluster. Can contain letters and numbers only. Length can be between 3 and 23 characters.|
|location|southcentralus| Location of the cluster. |
|certificateThumbprint|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate SHA1 thumbprint value. For example, "6190390162C988701DB5676EB81083EA608DCCF3"</p>. |
|certificateUrlValue|| <p>Value should be empty if creating a self-signed certificate or providing a certificate file. </p><p>To use an existing certificate previously uploaded to a key vault, fill in the certificate URL. For example, "https://mykeyvault.vault.azure.net:443/secrets/mycertificate/02bea722c9ef4009a76c5052bcbf8346".</p>|
|sourceVaultValue||<p>Value should be empty if creating a self-signed certificate or providing a certificate file.</p><p>To use an existing certificate previously uploaded to a key vault, fill in the source vault value. For example, "/subscriptions/333cc2c84-12fa-5778-bd71-c71c07bf873f/resourceGroups/MyTestRG/providers/Microsoft.KeyVault/vaults/MYKEYVAULT".</p>|

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>

## Deploy the virtual network and cluster

Next, set up the network topology and deploy the Service Fabric cluster. The [azuredeploy.json][template] Resource Manager template creates a virtual network (VNET) and also a subnet and network security group (NSG) for Service Fabric. The template also deploys a cluster with certificate security enabled.  For production clusters, use a certificate from a certificate authority (CA) as the cluster certificate. A self-signed certificate can be used to secure test clusters.

### Create a cluster using an existing certificate

The following script uses the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet and a template to deploy a new cluster in Azure. The cmdlet also creates a new key vault in Azure and uploads your certificate.

```powershell
# Variables.
$groupname = "sfclustertutorialgroup"
$clusterloc="southcentralus"  # must match the location parameter in the template
$templatepath="C:\temp\cluster"

$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$clustername = "mysfcluster123"  # must match the clusterName parameter in the template
$vaultname = "clusterkeyvault123"
$vaultgroupname="clusterkeyvaultgroup123"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# sign in to your Azure account and select your subscription
Connect-AzureRmAccount
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>

# Create a new resource group for your deployment and give it a name and a location.
New-AzureRmResourceGroup -Name $groupname -Location $clusterloc

# Create the Service Fabric cluster.
New-AzureRmServiceFabricCluster  -ResourceGroupName $groupname -TemplateFile "$templatepath\azuredeploy.json" `
-ParameterFile "$templatepath\azuredeploy.parameters.json" -CertificatePassword $certpwd `
-KeyVaultName $vaultname -KeyVaultResouceGroupName $vaultgroupname -CertificateFile $certpath
```

### Create a cluster using a new, self-signed certificate

The following script uses the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet and a template to deploy a new cluster in Azure. The cmdlet also creates a new key vault in Azure, adds a new self-signed certificate to the key vault, and downloads the certificate file locally.

```powershell
# Variables.
$groupname = "sfclustertutorialgroup"
$clusterloc="southcentralus"  # must match the location parameter in the template
$templatepath="C:\temp\cluster"

$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"
$clustername = "mysfcluster123"
$vaultname = "clusterkeyvault123"
$vaultgroupname="clusterkeyvaultgroup123"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# sign in to your Azure account and select your subscription
Connect-AzureRmAccount
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>

# Create a new resource group for your deployment and give it a name and a location.
New-AzureRmResourceGroup -Name $groupname -Location $clusterloc

# Create the Service Fabric cluster.
New-AzureRmServiceFabricCluster  -ResourceGroupName $groupname -TemplateFile "$templatepath\azuredeploy.json" `
-ParameterFile "$templatepath\azuredeploy.parameters.json" -CertificatePassword $certpwd `
-CertificateOutputFolder $certfolder -KeyVaultName $vaultname -KeyVaultResouceGroupName $vaultgroupname -CertificateSubjectName $subname

```

## Connect to the secure cluster

Connect to the cluster using the Service Fabric PowerShell module installed with the Service Fabric SDK.  First, install the certificate into the Personal (My) store of the current user on your computer.  Run the following PowerShell command:

```powershell
$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\mycertificates\mysfcluster20170531104310.pfx `
        -Password $certpwd
```

You are now ready to connect to your secure cluster.

The **Service Fabric** PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services.  Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate SHA1 thumbprint and connection endpoint details are found in the output from the previous step.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster123.southcentralus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -FindType FindByThumbprint -FindValue C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -StoreLocation CurrentUser -StoreName My
```

Check that you are connected and the cluster is healthy using the [Get-ServiceFabricClusterHealth](/powershell/module/servicefabric/get-servicefabricclusterhealth) cmdlet.

```powershell
Get-ServiceFabricClusterHealth
```

## Clean up resources

The other articles in this tutorial series use the cluster you just created. If you're not immediately moving on to the next article, you might want to [delete the cluster](service-fabric-cluster-delete.md) to avoid incurring charges.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a VNET in Azure using PowerShell
> * Create a key vault and upload a certificate
> * Create a secure Service Fabric cluster in Azure using PowerShell
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

Next, advance to the following tutorial to learn how to scale your cluster.
> [!div class="nextstepaction"]
> [Scale a Cluster](service-fabric-tutorial-scale-cluster.md)

[template]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/5-VM-Windows-1-NodeTypes-Secure-NSG/azuredeploy.json
[parameters]:https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/5-VM-Windows-1-NodeTypes-Secure-NSG/azuredeploy.parameters.json
