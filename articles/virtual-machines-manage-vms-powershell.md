<properties
   pageTitle="manage-vms-azure-powershell"
   description="Manage your VMs using Azure PowerShell"
   services="virtual-machines"
   documentationCenter="windows"
   authors="singhkay"
   manager="timlt"
   editor=""/>

   <tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="infrastructure-services"
   ms.date="02/20/2015"
   ms.author="kasing"/>

# Manage your VMs using Azure PowerShell

Before getting started you'll need to make sure you have Azure PowerShell installed. To do this, visit [How to install and configure Azure PowerShell](http://azure.microsoft.com/en-us/documentation/articles/install-configure-powershell/)

## Get an Image

Before creating a VM, you will need to decide **what image to use**. You can get a list of images using the following cmdlet

      Get-AzureVMImage

This cmdlet will return a list of all the images available in Azure. This is a very long list and it can be hard to find the exact image you want to use. In the example below I'm using other PowerShell cmdlets to reduce the list of returned images to just those containing based on **Windows Server 2012 R2 Datacenter**. Additionally, I'm choosing to only get the latest image by specifying [-1] for the returned array of images

    $img = (Get-AzureVMImage | Select -Property ImageName, Label | where {$_.Label -like '*Windows Server 2012 R2 Datacenter*'})[-1]

## Create a VM

Creation of a VM begins with the **New-AzureVMConfig** cmdlet. Here you'll specify the **name** of your VM, **size** of your VM and the **image** to be used for the VM. This cmdlet creates a local VM object **$myVM** that is later modified using other Azure PowerShell cmdlets in this guide.

      $myVM = New-AzureVMConfig -Name "testvm" -InstanceSize "Small" -ImageName $img.ImageName

Next you'll need to choose the **username** and **password** for your VM. You can do that using the **Add-AzureProvisioningConfig** cmdlet. This is where you tell Azure what OS for the VM is. Not that you are still making changes to the local **$myVM** object.

    $user = "azureuser"
    $pass = "&Azure1^Pass@"
    $myVM = Add-AzureProvisioningConfig -Windows -AdminUsername $user -Password $pass

Finally, you are ready to spin up your VM on Azure. To do this you'll need to use the **New-AzureVM** cmdlet

> AZURE.NOTE You'll need to configure the cloud service before you create your VM. There are two ways to do this.
* Create the cloud service using the New-AzureService cmdlet. If you choose this method, then you'll need to make sure that the location specified in the New-AzureVM cmdlet below matches the location of your cloud service, otherwise New-AzureVM cmdlet execution cmdlet will fail.
* Let the New-AzureVM cmdlet do this for you. You'll need to make sure that the name of the service is unique otherwise New-AzureVM cmdlet execution will fail.

    New-AzureVM -ServiceName "mytestserv" -VMs $myVM -Location "West US"

**OPTIONAL**

You can use other cmdlets such as **Add-AzureDataDisk**, **Add-AzureEndpoint** to configure additional options for your VM

## Get a VM
Now that you have created a VM on Azure, you'll definitely want to see how it's doing. You can do this using the **Get-AzureVM** cmdlet as shown below

    Get-AzureVM -ServiceName "mytestserv" -Name "testvm"


## Next Steps
[Connect to an Azure virtual machine with RDP or SSH](https://msdn.microsoft.com/library/azure/dn535788.aspx)<br>
[Azure Virtual Machines FAQ](https://msdn.microsoft.com/library/azure/dn683781.aspx)
