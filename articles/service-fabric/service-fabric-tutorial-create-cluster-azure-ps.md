---
title: Create a Service Fabric cluster in Azure | Microsoft Docs
description: Learn how to create a Windows or Linux Service Fabric cluster in Azure using PowerShell.
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
ms.date: 07/13/2017
ms.author: ryanwi

---

# Create a secure cluster on Azure using PowerShell
This tutorial shows you how to create a Service Fabric cluster (Windows or Linux) running in Azure. When you're finished, you have a cluster running in the cloud that you can deploy applications to.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Service Fabric cluster in Azure
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) 

## Create the cluster using Azure PowerShell
You can create a Windows Service Fabric cluster in Azure using Azure PowerShell.

Log in to Azure and select the subscription ID to which you want to create the cluster.  You can find your subscription ID by logging in to the [Azure portal](http://portal.azure.com).

```powershell

Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId "Subcription ID" 
```

Run the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/New-AzureRmServiceFabricCluster) cmdlet to create a three-node development cluster secured with an X.509 certificate. Customize the parameters as needed. Set the *-OS* parameter to choose the version of Windows or Linux that runs on the cluster nodes.

```powershell
$clusterloc="SouthCentralUS"
$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
$certfolder="c:\mycertificates\"
$RDPuser="vmadmin"
$RDPpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force 
$clustername = "mysfcluster"
$groupname="mysfclustergroup"     
$subname="$clustername.$clusterloc.cloudapp.azure.com"    
$clustersize=3 # can take values 1, 3-99
$vmsku = "Standard_D2_v2"
$vaultname = "mykeyvault"

New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname `
    -Location $clusterloc -ClusterSize $clustersize -VmUserName $RDPuser -VmPassword $RDPpwd `
    -CertificateSubjectName $subname -CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
    -OS WindowsServer2016DatacenterwithContainers -VmSku $vmsku -KeyVaultName $vaultname

```
| | |
|-|-|
|**Variable**|**Description**|
| *$clustername*, *$clusterloc* | The name and region of the cluster. |
| *$certpwd* | The password for the self-signed cert. |
| *$vaultname* | The new key vault which the cert is uploaded. |
| *$certfolder* | The local directory where the cert is copied.|
| *$RDPuser*, *$RDPpwd* | The username and password for remote connecting to the VMs in the cluster. |
| *$groupname* | The resource group name for the cluster resources and also the cluster and key vault names. |
| *$clustersize* | The number of nodes in the cluster.  One and three node clusters are useful for development and testing but cannot be used for production workloads. |

The command can take anywhere from 10 minutes to 30 minutes to complete.  When completed, you see output containing information about the certificate, the key vault where it was uploaded to, and the local folder where the certificate is copied. 

Copy the entire output and save to a text file. Make a note of the following information from the output, which is needed later in this tutorial.
 
- **CertificateSavedLocalPath** : c:\mycertificates\mysfcluster20170504141137.pfx
- **CertificateThumbprint** : C4C1E541AD512B8065280292A8BA6079C3F26F10
- **ManagementEndpoint** : https://mysfcluster.southcentralus.cloudapp.azure.com:19080
- **ClientConnectionEndpointPort** : 19000

## Connect to the secure cluster 
Connect to the cluster using the Service Fabric PowerShell module installed with the Service Fabric SDK.  First, install the certificate into the Personal (My) store of the current user on your computer.  Run the following PowerShell command:

```powershell
$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
        -FilePath C:\mycertificates\mysfcluster20170531104310.pfx `
        -Password $certpwd
```

You are now ready to connect to your secure cluster.

The **Service Fabric** PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services.  Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate thumbprint and connection endpoint details are found in the output from a previous step. 

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

A cluster is made up of other Azure resources in addition to the cluster resource itself. The simplest way to delete the cluster and all the resources it consumes is to delete the resource group. 

Log in to Azure and select the subscription ID with which you want to remove the cluster.  You can find your subscription ID by logging in to the [Azure portal](http://portal.azure.com). Delete the resource group and all the cluster resources using the [Remove-AzureRMResourceGroup cmdlet](/en-us/powershell/module/azurerm.resources/remove-azurermresourcegroup).

```powershell
Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionId "Subcription ID"

$groupname="mysfclustergroup"
Remove-AzureRmResourceGroup -Name $groupname -Force
```

## Next steps
In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a Service Fabric cluster in Azure
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

Next, advance to the following tutorial to learn how to deploy an existing application.
> [!div class="nextstepaction"]
> [Deploy an existing .NET application with Docker Compose](service-fabric-host-app-in-a-container.md)