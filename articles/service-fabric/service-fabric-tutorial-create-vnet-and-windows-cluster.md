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
ms.date: 09/26/2017
ms.author: ryanwi

---

# Deploy a Service Fabric Windows cluster into an Azure virtual network
This tutorial is part one of a series. You will learn how to deploy a Windows Service Fabric cluster into an existing Azure virtual network (VNET) and sub-net using PowerShell. When you're finished, you have a cluster running in the cloud that you can deploy applications to.  To create a Linux cluster using Azure CLI, see [Create a secure Linux cluster on Azure](service-fabric-tutorial-create-vnet-and-linux-cluster.md).

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
> * [Deploy API Management with Service Fabric](service-fabric-tutorial-deploy-api-management.md)

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps)

The following procedures create a five-node Service Fabric cluster. To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).

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
Next, set up the network topology to which API Management and the Service Fabric cluster will be deployed. The [network.json][network-arm] Resource Manager template is configured to create a virtual network (VNET) and also a subnet and network security group (NSG) for Service Fabric and a subnet and NSG for API Management. Learn more about VNETs, subnets, and NSGs [here](../virtual-network/virtual-networks-overview.md).

The [network.parameters.json][network-parameters-arm] parameters file contains the names of the subnets and NSGs that Service Fabric and API Management deploy to.  API Management is deployed in the [following tutorial](service-fabric-tutorial-deploy-api-management.md). For this guide, the parameter values do not need to be changed. The Service Fabric Resource Manager templates use these values.  If the values are modified here, you must modify them in the other Resource Manager templates used in this tutorial and the [Deploy API Management tutorial](service-fabric-tutorial-deploy-api-management.md). 

Download the following Resource Manager template and parameters file:
- [network.json][network-arm]
- [network.parameters.json][network-parameters-arm]

Use the following PowerShell command to deploy the Resource Manager template and parameter files for the network setup:

```powershell
New-AzureRmResourceGroupDeployment -ResourceGroupName $groupname -TemplateFile .\network.json -TemplateParameterFile .\network.parameters.json -Verbose
```

<a id="createvaultandcert" name="createvaultandcert_anchor"></a>
## Deploy the Service Fabric cluster
Once the network resources have finished deploying, the next step is to deploy a Service Fabric cluster to the VNET in the subnet and NSG designated for the Service Fabric cluster. Deploying a cluster to an existing VNET and subnet (deployed previously in this article) requires a Resource Manager template.  For more information, see [Create a cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md). For this tutorial series, the template is pre-configured to use the names of the VNET, subnet, and NSG that you set up in a previous step.  Download the following Resource Manager template and parameters file:
- [cluster.json][cluster-arm]
- [cluster.parameters.json][cluster-parameters-arm]

A certificate is used to secure node-to-node communication for your cluster and to manage user access to your Service Fabric cluster. API Management also uses this certificate to access the Service Fabric Naming Service for service discovery. 

The following script uses the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet to deploy a new cluster in Azure. The cmdlet also creates a key vault in Azure, creates a self-signed certificate and key vault, and downloads the certificate file locally.   

```powershell
# Certificate variables.
$certpwd="q6D7nN%6ck@6" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"

# Variables for VM admin.
$adminuser="vmadmin"
$adminpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force 

# Variables for common values
$clustername = "mysfcluster"
$vmsku = "Standard_D2_v2"
$vaultname = "clusterkeyvault"
$vaultgroupname="clusterkeyvaultgroup"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# Set the number of cluster nodes. Possible values: 1, 3-99
$clustersize=5 

# Create the Service Fabric cluster.
New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname -Location $clusterloc `
-ClusterSize $clustersize -VmUserName $adminuser -VmPassword $adminpwd -CertificateSubjectName $subname `
-CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
-OS WindowsServer2016DatacenterwithContainers -VmSku $vmsku -KeyVaultName $vaultname -KeyVaultResouceGroupName $vaultgroupname
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

Next, advance to the following tutorial to learn how to deploy API Management with Service Fabric.
> [!div class="nextstepaction"]
> [Deploy API Managment](service-fabric-tutorial-deploy-api-management.md)


[network-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.json
[network-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/network.parameters.json

[cluster-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.json
[cluster-parameters-arm]:https://github.com/Azure-Samples/service-fabric-api-management/blob/master/cluster.parameters.json
