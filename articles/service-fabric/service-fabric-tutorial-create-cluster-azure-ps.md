---
title: Create a Service Fabric cluster in Azure | Microsoft Docs
description: Learn how to create a Windows or Linux Service Fabric cluster in Azure by using PowerShell
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
ms.date: 10/03/2017
ms.author: cristyg
ms.custom: mvc

---

# Create a secure cluster in Azure by using PowerShell
This article is the first in a series of tutorials that show you how to move a .NET application to the cloud by using Azure Service Fabric clusters and containers. In the following steps, you learn how to create a Service Fabric cluster (Windows or Linux) that runs in Azure. When you're finished, you have a secure cluster that runs in the cloud to which you can deploy applications.

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Install the [Service Fabric SDK](service-fabric-get-started.md).
- Install [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps). (If needed,  [install Azure PowerShell](/powershell/azure/overview) or [update to a newer version](https://docs.microsoft.com/en-us/powershell/azure/install-azurerm-ps?view=azurermps-4.4.0#update-azps).)


## Create a Service Fabric cluster

This script creates a single-node, preview Service Fabric cluster. A self-signed certificate secures the cluster. The script creates the certificate along with the cluster, and then places the certificate in a key vault. You can't scale single-node clusters beyond one virtual machine, and you can't upgrade preview clusters to newer versions.

To calculate the cost incurred by running a Service Fabric cluster in Azure, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).
For more information on how to create Service Fabric clusters, see [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

## Log in to Azure
Open a PowerShell console, log in to Azure, and select the subscription you want to deploy the cluster in:

   ```PowerShell
   Login-AzureRmAccount
   Select-AzureRmSubscription -SubscriptionId <subscription-id>
   ```

## Cluster parameters

   This script uses the following parameters and concepts. Customize the parameters to fit your requirements.

   | Parameter       | Description | Suggested Value |
   | --------------- | ----------- | --------------- |
   | Location | The Azure region where you deployed the cluster. | For example, *westeurope*, *eastasia*, or *eastus* |
   | Name     | The name of the cluster you want to create. The name must be 4-23 characters and can only have lowercase letters, numbers, and hyphens. | For example, *bobs-sfpreviewcluster* |
   | ResourceGroupName   | The name of the resource group in which to create the cluster. | For example, *myresourcegroup* |
   | VmSku  | The virtual machine SKU to use for the nodes. | Any valid virtual machine SKU |
   | OS  | The virtual machine OS to use for the nodes. | Any valid virtual machine OS |
   | KeyVaultName | The name of the new key vault to associate with the cluster. | For example, *mykeyvault* |
   | ClusterSize | The number of virtual machines in your cluster (can be *1* or *3-99*).| Specify only one virtual machine for a preview cluster |
   | CertificateSubjectName | The subject name of the certificate to be created. | Follows the format: *<name>*.*<location>*.cloudapp.azure.com |

### Default parameter values
**Virtual Machine**: Optional settings. If you don't specify them, the admin username defaults to *vmadmin* and PowerShell prompts you for a virtual machine password before it creates the cluster.

**Ports**: Default to ports 80 and 8081. You can specify additional ports by following the guidance for [ports in Service Fabric clusters](https://docs.microsoft.com/en-us/azure/service-fabric/create-load-balancer-rule).

**Diagnostics**: Enabled by default.

**DNS service**: Not enabled by default.

**Reverse proxy**: Not enabled by default.

## Create the cluster with your parameters

After you decide on the parameters that fit your requirements, run the following command to generate a secure Service Fabric cluster and its certificate.

You can modify this script to include additional parameters. For more information on parameters for cluster creation, see the [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/new-azurermservicefabriccluster.md) cmdlet.

>[!NOTE]
>Before you run this command, you must create a folder where you can store the cluster certificate.

```PowerShell

# Set the certificate variables. This creates and encrypts a password that Service Fabric will use.
$certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force

# You must create the folder where you want to store the certificate on your machine before you start this step.
$certfolder="c:\mycertificates\"

# Set the variables for common values. Change the values to fit your needs.
$clusterloc="WestUS"
$clustername = "mysfcluster"
$groupname="mysfclustergroup"       
$vmsku = "Standard_D2_v2"
$vaultname = "mykeyvault"
$subname="$clustername.$clusterloc.cloudapp.azure.com"

# Set the number of cluster nodes. The possible values are 1 and 3-99.
$clustersize=1

# Create the Service Fabric cluster and its self-signed certificate. The OS you specify here lets you use this cluster with any applications that are also using containers.
New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname -Location $clusterloc `
-ClusterSize $clustersize -CertificateSubjectName $subname `
-CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
-OS WindowsServer2016DatacenterwithContainers -VmSku $vmsku -KeyVaultName $vaultname
```

The creation process can take several minutes. After the configuration finishes, it outputs information about the cluster created in Azure. It also copies the cluster certificate to the -CertificateOutputFolder directory on the path you specified for this parameter.

Take note of the **ManagementEndpoint** URL for your cluster, which might be like the following URL: https://mycluster.westeurope.cloudapp.azure.com:19080.

## Import the certificate

When the cluster is successfully created, run the following command to ensure that you can use the self-signed certificate:

```PowerShell

# To connect to the cluster, install the certificate into the Personal (My) store of the current user on your computer.
Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
-FilePath C:\mycertificates\mysfclustergroup20170531104310.pfx `
-Password $certpwd
```

This command installs the certificate on the current user of your machine. You need this certificate to access Service Fabric Explorer and view the health of your cluster.


## View your cluster (Optional)

After you have both the cluster and the imported certificate, you can connect to the cluster and view its health. There are multiple ways to connect, via either Service Fabric Explorer or PowerShell.

### Service Fabric Explorer
You can view the health of your cluster through Service Fabric Explorer. To do so, browse to the **ManagementEndpoint** URL for your cluster, and then select the certificate you saved on your machine.

>[!NOTE]
>When you open Service Fabric Explorer, you see a certificate error, as you're using a self-signed certificate. In Edge, you have to click **Details**, and then click the **Go on to the webpage** link. In Chrome, you have to click **Advanced**, and then click the **proceed** link.

### PowerShell

The Service Fabric PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services. Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate thumbprint and connection endpoint details can be found in the output from a previous step.

```PowerShell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster.southcentralus.cloudapp.azure.com:19000 `
-KeepAliveIntervalInSec 10 `
-X509Credential -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10 `
-FindType FindByThumbprint -FindValue C4C1E541AD512B8065280292A8BA6079C3F26F10 `
-StoreLocation CurrentUser -StoreName My
```

You can also check that you're connected and that the cluster is healthy by using the [Get-ServiceFabricClusterHealth](/powershell/module/servicefabric/get-servicefabricclusterhealth) cmdlet.

```PowerShell
Get-ServiceFabricClusterHealth
```

## Next steps
In this tutorial, you learned how to create a secure Service Fabric cluster in Azure by using PowerShell.

Next, advance to the following tutorial to learn how to deploy an existing application:
> [!div class="nextstepaction"]
> [Deploy an existing .NET application with Docker Compose](service-fabric-host-app-in-a-container.md)

 
