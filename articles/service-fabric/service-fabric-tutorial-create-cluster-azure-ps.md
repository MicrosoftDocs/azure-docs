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
ms.topic: tutorial
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 09/18/2017
ms.author: cristyg
ms.custom: mvc

---

# Create a secure cluster on Azure using PowerShell
This tutorial shows you how to create a Service Fabric cluster (Windows or Linux) running in Azure. It uses Azure PowerShell to execute the commands. When you're finished, you will have a secure cluster running in the cloud to which you can deploy applications.

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK](service-fabric-get-started.md)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) (if needed, install Azure PowerShell using the instruction found in the [Azure PowerShell guide](/powershell/azure/overview) )


# Create a Service Fabric cluster

This script creates a single-node preview Service Fabric cluster. The cluster is secured by a self-signed certificate that gets created along with the cluster and then placed in a key vault. Single-node clusters cannot be scaled beyond one virtual machine and preview clusters cannot be upgraded to newer versions.

To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).
For more information on creating Service Fabric clusters, see [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

## Login to Azure
Open a PowerShell console, login to Azure, and select the subscription you want to deploy the cluster in:

   ```powershell
   Login-AzureRmAccount
   Select-AzureRmSubscription -SubscriptionId <subscription-id>
   ```

## Verify your parameters

   This script uses the following parameters and concepts. Customize the parameters to fit your requirements.

   | Parameter       | Description | Suggested Value |
   | --------------- | ----------- | --------------- |
   | Location | The Azure region to which to deploy the cluster. | *for example, westeurope, eastasia, eastus* |
   | Name     | Name of the cluster you want to create. | *for example, bobs-sfpreviewcluster* |
   | ResourceGroupName   | Name of the resource group in which to create the cluster. | *for example, myresourcegroup* |
   | VmSku  | Virtual Machine SKU to use for the nodes. | *Any valid Virtual Machine SKU* |
   | KeyVaultName | Name of the KeyVault to associate with the cluster. | *for example, mykeyvault* |
   | ClusterSize | The number of virtual machines in your cluster (can be 1 or 3-99). | **1** | *For a preview cluster specify only one virtual machine* |
   | CertificateSubjectName | The subject name of the certificate to be created. | *Follows the format <name>.<location>.cloudapp.azure.com* |


## Create the cluster with your parameters

Once you have decided on the parameters that fit your requirements, execute the following command to generate a secure Service Fabric Cluster and its certificate.

You can modify this script to include additional parameters. For more information on parameters for cluster creation, see the  [New-AzureRmServiceFabricCluster](/powershell/module/azurerm.servicefabric/new-azurermservicefabriccluster) cmdlet.

>[!NOTE]
>Before executing this command you must create a folder in which to output the cluster certificate.

>[!NOTE]
>Virtual Machine settings are optional. If you don't specify them, the admin username defaults to "vmadmin" and you will be prompted for a Virtual Machine password before the cluster is created.

```powershell

    # Certificate variables. This will create and encrypt a password to be used by Service Fabric.
    # You must create the folder on your machine before executing this step.
    $certpwd="Password#1234" | ConvertTo-SecureString -AsPlainText -Force
    $certfolder="c:\mycertificates\"

    # Variables for common values. Change the values to fit your needs.
    $clusterloc="WestUS"
    $clustername = "mysfcluster"
    $groupname="mysfclustergroup"       
    $vmsku = "Standard_D2_v2"
    $vaultname = "mykeyvault"
    $subname="$clustername.$clusterloc.cloudapp.azure.com"

    # Set the number of cluster nodes. Possible values: 1, 3-99
    $clustersize=1

    # Create the Service Fabric cluster and its self-signed certificate.
    New-AzureRmServiceFabricCluster -Name $clustername -ResourceGroupName $groupname -Location $clusterloc `
    -ClusterSize $clustersize -CertificateSubjectName $subname `
    -CertificatePassword $certpwd -CertificateOutputFolder $certfolder `
    -OS WindowsServer2016DatacenterwithContainers -VmSku $vmsku -KeyVaultName $vaultname

    # Connect to the cluster using by installing the certificate into the Personal (My) store of the current user on your computer.
    Import-PfxCertificate -Exportable -CertStoreLocation Cert:\CurrentUser\My `
            -FilePath C:\mycertificates\mysfcluster20170531104310.pfx `
            -Password $certpwd
```

Once the configuration finishes, it outputs information about the cluster created in Azure. It also copies the cluster certificate to the -CertificateOutputFolder directory on the path you specified for this parameter. Then it installs the certificate on the current user of your machine.  You need this certificate to access Service Fabric Explorer and view the health of your cluster.

Take note of the **ManagementEndpoint** URL for your cluster, which may be similar to the following URL: *https://mycluster.westeurope.cloudapp.azure.com:19080*


## View your cluster (Optional)

The creation process can take several minutes. Once the cluster is fully created, you can connect to it and view its health. There's multiple ways to connect, via Service Fabric Explorer or PowerShell.

### Service Fabric Explorer
You can view the health of your cluster by opening Service Fabric Explorer. To do so, navigate to the **ManagementEndpoint** URL for your cluster using a web browser, and select the certificate that was saved on your machine.

>[!NOTE]
>When opening Service Fabric Explorer, you see a certificate error, as you are using a self-signed certificate. In Edge, you have to click *Details* and then the *Go on to the webpage* link. In Chrome, you have to click *Advanced* and then the *proceed* link.

### PowerShell

The **Service Fabric** PowerShell module provides many cmdlets for managing Service Fabric clusters, applications, and services.  Use the [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster) cmdlet to connect to the secure cluster. The certificate thumbprint and connection endpoint details are found in the output from a previous step.

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint mysfcluster.southcentralus.cloudapp.azure.com:19000 `
          -KeepAliveIntervalInSec 10 `
          -X509Credential -ServerCertThumbprint C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -FindType FindByThumbprint -FindValue C4C1E541AD512B8065280292A8BA6079C3F26F10 `
          -StoreLocation CurrentUser -StoreName My
```

You can also check that you are connected and the cluster is healthy using the [Get-ServiceFabricClusterHealth](/powershell/module/servicefabric/get-servicefabricclusterhealth) cmdlet.

```powershell
Get-ServiceFabricClusterHealth
```

## Next steps
In this tutorial, you learned how to create a secure Service Fabric cluster in Azure using PowerShell

Next, advance to the following tutorial to learn how to deploy an existing application.
> [!div class="nextstepaction"]
> [Deploy an existing .NET application with Docker Compose](service-fabric-host-app-in-a-container.md)

---
