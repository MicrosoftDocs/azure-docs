---
title: Create a Windows Service Fabric cluster in Azure | Microsoft Docs
description: Learn how to deploy a Windows Service Fabric cluster into an existing Azure virtual network using PowerShell.
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
ms.date: 11/02/2017
ms.author: ryanwi

---

# Deploy a Service Fabric Windows cluster into an Azure virtual network
This tutorial is part one of a series. You will learn how to deploy a Service Fabric cluster running Windows into an existing Azure virtual network (VNET) and sub-net using PowerShell. When you're finished, you have a cluster running in the cloud that you can deploy applications to.  To create a Linux cluster using Azure CLI, see [Create a secure Linux cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

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
> * [Scale a cluster in or out](/service-fabric-tutorial-scale-cluster.md)
> * [Deploy API Management with Service Fabric](service-fabric-tutorial-deploy-api-management.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps)

The following procedures create a five-node Service Fabric cluster. To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

## Introduction
This tutorial deploys a cluster of five nodes in a single node type into a virtual network in Azure.

A [Service Fabric cluster](service-fabric-deploy-anywhere.md) is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. Clusters can scale to thousands of machines. A machine or VM that is part of a cluster is called a node. Each node is assigned a node name (a string). Nodes have characteristics such as placement properties.

A node type defines the size, number, and properties for a set of virtual machines in the cluster. Every defined node type is set up as a [virtual machine scale set](/azure/virtual-machine-scale-sets/), an Azure compute resource you use to deploy and manage a collection of virtual machines as a set. Each node type can then be scaled up or down independently, have different sets of ports open, and can have different capacity metrics. Node types are used to define roles for a set of cluster nodes, such as "front end" or "back end".  Your cluster can have more than one node type, but the primary node type must have at least five VMs for production clusters (or at least three VMs for test clusters).  [Service Fabric system services](service-fabric-technical-overview.md#system-services) are placed on the nodes of the primary node type.

## Cluster capacity planning
This tutorial deploys a cluster of five nodes in a single node type.  For any production cluster deployment, capacity planning is an important step. Here are some things to consider as a part of that process.

- The number of node types your cluster needs 
- The properties of each of node type (for example size, primary, internet facing, and number of VMs)
- The reliability and durability characteristics of the cluster

For more information, see [Cluster capacity planning considerations](service-fabric-cluster-capacity.md).

## Sign-in to Azure and select your subscription
This guide uses Azure PowerShell. When you start a new PowerShell session, sign in to your Azure account and select your subscription before you execute Azure commands.
 
Run the following script to sign in to your Azure account select your subscription:

```powershell
Login-AzureRmAccount
Get-AzureRmSubscription
Set-AzureRmContext -SubscriptionId <guid>
```

## Create a resource group
Create a new resource group for your deployment and give it a name and a location.

```powershell
$groupname = "sfclustertutorialgroup"
$clusterloc="southcentralus"
New-AzureRmResourceGroup -Name $groupname -Location $clusterloc
```

## Deploy the network topology
Next, set up the network topology to which API Management and the Service Fabric cluster will be deployed. The [network.json][network-arm] Resource Manager template is configured to create a virtual network (VNET) and also a subnet and network security group (NSG) for Service Fabric and a subnet and NSG for API Management. API Management is deployed later in this tutorial. Learn more about VNETs, subnets, and NSGs [here](../virtual-network/virtual-networks-overview.md).

The [network.parameters.json][network-parameters-arm] parameters file contains the names of the subnets and NSGs that Service Fabric and API Management deploy to.  API Management is deployed in the [following tutorial](service-fabric-tutorial-deploy-api-management.md). For this guide, the parameter values do not need to be changed. The Service Fabric Resource Manager templates use these values.  If the values are modified here, you must modify them in the other Resource Manager templates used in this tutorial and the [Deploy API Management tutorial](service-fabric-tutorial-deploy-api-management.md). 

Download the following Resource Manager template and parameters file:
- [network.json][network-arm]
- [network.parameters.json][network-parameters-arm]

Use the following PowerShell command to deploy the Resource Manager template and parameter files for the network setup:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateFile C:\winclustertutorial\network.json -TemplateParameterFile C:\winclustertutorial\network.parameters.json -Verbose
```

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>
## Deploy the Service Fabric cluster
Once the network resources have finished deploying, the next step is to deploy a Service Fabric cluster to the VNET in the subnet and NSG designated for the Service Fabric cluster. Deploying a cluster to an existing VNET and subnet (deployed previously in this article) requires a Resource Manager template.  For this tutorial series, the template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in a previous step.  

Download the following Resource Manager template and parameters file:
- [cluster.json][cluster-arm]
- [cluster.parameters.json][cluster-parameters-arm]

Use this template to create a secure cluster.  A cluster certificate is an X.509 certificate used to secure node-to-node communication and authenticate the cluster management endpoints to a management client.  The cluster certificate also provides an SSL for the HTTPS management API and for Service Fabric Explorer over HTTPS. Azure Key Vault is used to manage certificates for Service Fabric clusters in Azure.  When a cluster is deployed in Azure, the Azure resource provider responsible for creating Service Fabric clusters pulls certificates from Key Vault and installs them on the cluster VMs. 

You can use a certificate from a certificate authority (CA) as the cluster certificate or, for testing purposes, create a self-signed certificate. The cluster certificate must:

- contain a private key.
- be created for key exchange, which is exportable to a Personal Information Exchange (.pfx) file.
- have a subject name that matches the domain that you use to access the Service Fabric cluster. This matching is required to provide SSL for the cluster's HTTPS management endpoints and Service Fabric Explorer. You cannot obtain an SSL certificate from a certificate authority (CA) for the .cloudapp.azure.com domain. You must obtain a custom domain name for your cluster. When you request a certificate from a CA, the certificate's subject name must match the custom domain name that you use for your cluster.

Fill in these empty parameters in the *cluster.parameters.json* file for your deployment:

|Parameter|Value|
|---|---|
|adminPassword|Password#1234|
|adminUserName|vmadmin|
|clusterName|mysfcluster|
|location|southcentralus|

Leave the *certificateThumbprint*, *certificateUrlValue*, and *sourceVaultValue* parameters blank to create a self-signed certificate.  If you want to use an existing certificate previously uploaded to a key vault, fill in those parameter values.

The following script uses the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet and template to deploy a new cluster in Azure. The cmdlet also creates a new key vault in Azure, adds a new self-signed certificate to the key vault, and downloads the certificate file locally. You can specify an existing certificate and/or key vault by using other parameters of the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet.

```powershell
# Variables.
$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"
$clustername = "mysfcluster"
$vaultname = "clusterkeyvault111"
$vaultgroupname="clusterkeyvaultgroup111"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# Create the Service Fabric cluster.
New-AzureRmServiceFabricCluster  -ResourceGroupName $groupname -TemplateFile 'C:\winclustertutorial\cluster.json' `
-ParameterFile 'C:\winclustertutorial\cluster.parameters.json' -CertificatePassword $certpwd `
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

The **Service Fabric** PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services.  Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate thumbprint and connection endpoint details are found in the output from the previous step.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster.southcentralus.cloudapp.azure.com:19000 `
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
The other articles in this tutorial series use the cluster you just created. If you're not immediately moving on to the next article, you might want to delete the cluster and key vault to avoid incurring charges. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group.

Delete the resource group and all the cluster resources using the [Remove-AzureRMResourceGroup cmdlet](/en-us/powershell/module/azurerm.resources/remove-azurermresourcegroup).  Also delete the resource group containing the key vault.

```powershell
Remove-AzureRmResourceGroup -Name $groupname -Force
Remove-AzureRmResourceGroup -Name $vaultgroupname -Force
```

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


[network-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.json
[network-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.parameters.json

[cluster-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.json
[cluster-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.parameters.json
