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
ms.date: 07/13/2017
ms.author: ryanwi
ms.custom: mvc

---

# Create a secure cluster on Azure using PowerShell
This tutorial shows you how to create a Service Fabric cluster (Windows or Linux) running in Azure. When you're finished, you have a cluster running in the cloud that you can deploy applications to.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a secure Service Fabric cluster in Azure using PowerShell
> * Secure the cluster with an X.509 certificate
> * Connect to the cluster using PowerShell
> * Remove a cluster

## Prerequisites
Before you begin this tutorial:
- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
- Install the [Service Fabric SDK and PowerShell module](service-fabric-get-started.md)
- Install the [Azure Powershell module version 4.1 or higher](https://docs.microsoft.com/powershell/azure/install-azurerm-ps)

The following procedure creates a single-node (single virtual machine) preview Service Fabric cluster. The cluster is secured by a self-signed certificate that gets created along with the cluster and then placed in a key vault. Single-node clusters cannot be scaled beyond one virtual machine and preview clusters cannot be upgraded to newer versions.

To calculate cost incurred by running a Service Fabric cluster in Azure use the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).
For more information on creating Service Fabric clusters, see [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

## Create the cluster using Azure PowerShell
1. Download a local copy of the Azure Resource Manager template and the parameter file from the [Azure Resource Manager template for Service Fabric](https://aka.ms/securepreviewonelineclustertemplate) GitHub repository.  *azuredeploy.json* is the Azure Resource Manager template that defines a Service Fabric cluster. *azuredeploy.parameters.json* is a parameters file for you to customize the cluster deployment.

2. Customize the following parameters in the *azuredeploy.parameters.json* parameters file:

   | Parameter       | Description | Suggested Value |
   | --------------- | ----------- | --------------- |
   | clusterLocation | The Azure region to which to deploy the cluster. | *for example, westeurope, eastasia, eastus* |
   | clusterName     | Name of the cluster you want to create. | *for example, bobs-sfpreviewcluster* |
   | adminUserName   | The local admin account on the cluster virtual machines. | *Any valid Windows Server username* |
   | adminPassword   | Password of the local admin account on the cluster virtual machines. | *Any valid Windows Server password* |
   | clusterCodeVersion | The Service Fabric version to run. (255.255.X.255 are preview versions). | **255.255.5718.255** |
   | vmInstanceCount | The number of virtual machines in your cluster (can be 1 or 3-99). | **1** | *For a preview cluster specify only one virtual machine* |

3. Open a PowerShell console, login to Azure, and select the subscription you want to deploy the cluster in:

   ```powershell
   Login-AzureRmAccount
   Select-AzureRmSubscription -SubscriptionId <subscription-id>
   ```
4. Create and encrypt a password for the certificate to be used by Service Fabric.

   ```powershell
   $pwd = "<your password>" | ConvertTo-SecureString -AsPlainText -Force
   ```
5. Create the cluster and its certificate by running the following command:

   ```powershell
      New-AzureRmServiceFabricCluster `
          -TemplateFile C:\Users\me\Desktop\azuredeploy.json `
          -ParameterFile C:\Users\me\Desktop\azuredeploy.parameters.json `
          -CertificateOutputFolder C:\Users\me\Desktop\ `
          -CertificatePassword $pwd `
          -CertificateSubjectName "mycluster.westeurope.cloudapp.azure.com" `
          -ResourceGroupName myclusterRG
   ```

   >[!NOTE]
   >The `-CertificateSubjectName` parameter should align with the clusterName parameter specified in the parameters file, as well as the domain tied to the Azure region you chose, such as: `clustername.eastus.cloudapp.azure.com`.

Once the configuration finishes, it outputs information about the cluster created in Azure. It also copies the cluster certificate to the -CertificateOutputFolder directory on the path you specified for this parameter. You need this certificate to access Service Fabric Explorer and view the health of your cluster.

Take note of the URL for your cluster, which may be similar to the following URL: *https://mycluster.westeurope.cloudapp.azure.com:19080*

## Modify the certificate & access Service Fabric Explorer ##

1. Double-click the certificate to open the Certificate Import Wizard.

2. Use default settings, but make sure to check the **Mark this key as exportable.** check box, in the **private key protection** step. Visual Studio needs to export the certificate when configuring Azure Container Registry to Service Fabric Cluster authentication later in this tutorial.

3. You can now open Service Fabric Explorer in a browser. To do so, navigate to the **ManagementEndpoint** URL for your cluster using a web browser, and select the certificate that was saved on your machine.

>[!NOTE]
>When opening Service Fabric Explorer, you see a certificate error, as you are using a self-signed certificate. In Edge, you have to click *Details* and then the *Go on to the webpage* link. In Chrome, you have to click *Advanced* and then the *proceed* link.

>[!NOTE]
>If the cluster creation fails, you can always rerun the command, which updates the resources already deployed. If a certificate was created as part of the failed deployment, a new one is generated. To troubleshoot cluster creation, see [Create a Service Fabric cluster by using Azure Resource Manager](service-fabric-cluster-creation-via-arm.md).

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
