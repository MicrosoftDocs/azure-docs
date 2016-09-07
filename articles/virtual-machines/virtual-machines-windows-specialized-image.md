<properties
	pageTitle="Create a copy of your Windows VM | Microsoft Azure"
	description="Learn how to create a copy of your specialized Azure VM running Windows, in the Resource Manager deployment model."
	services="virtual-machines-windows"
	documentationCenter=""
	authors="cynthn"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/26/2016"
	ms.author="cynthn"/>

# Create a copy of a specialized Windows Azure VM in the Azure Resource Manager deployment model


This article shows you how to create a copy of your **specialized** Azure virtual machine (VM) running Windows. A ***specialized** VM maintains the user accounts and other state data from your original VM. We will use the AzCopy tool to copy the VHD and then we will create a new VM and attach the copy of the VHD.

If you need to create mass deployments of similar Windows VMs, you should use an image that has been ***generalized** using Sysprep. To create generalized image and use that image to create a VM, see [How to capture a Windows virtual machine](virtual-machines-windows-capture-image.md).


## Before you begin

Make sure that you:

- Have information about the **source and destination storage accounts**. For the source VM, you need to storage account and container names. Usually, the container name will be **vhds**. You also need to have a destination storage account. If you don't already have one, you can create one using either the portal (**More Services** > Storage accounts > Add or using the [New-AzureRmStorageAccount](https://msdn.microsoft.com/library/mt607148.aspx) cmdlet. 

- Have Azure [PowerShell 1.0](../powershell-install-configure.md) (or later) installed.

- Have downloaded and installed the [AzCopy tool](../storage/storage-use-azcopy.md). 

## Deallocate the VM

Deallocate the VM, which frees up the VHD to be copied.

- **Portal**: Click **Virtual machines** > <vmName> > Stop
- **Powershell**: Stop-AzureRmVM -ResourceGroupName <resourceGroup> -Name <vmName>

The *Status* for the VM in the Azure portal changes from **Stopped** to **Stopped (deallocated)**.

## Download the source VM template

1. Log in to the [Azure portal](https://portal.azure.com/).
2. One the hub menu, select **Virtual Machines**.
3. Select the original virtual machine in the list.
4. If the VM is running, click the **Stop** button to stop\deallocate the VM.
5. In the Settings blade for the VM, select **Export template**.
6. Select **Download** and save the .zip file to your local computer.
7. Open the .zip file and extract the files to a folder. The .zip file should contain:
	
	- deploy.ps1
	- deploy.sh 
	- DeploymentHelper.cs
	- parameters.json
	- template.json

You can also download the template using [Azure PowerShell](https://msdn.microsoft.com/library/mt715427.aspx):

	Export-AzureRmResourceGroup -ResourceGroupName "<resourceGroupName"


## Get the storage account URLs

You need the URLs of the source and destination storage accounts. The URLs look like: https://<storageaccount>.blob.core.windows.net/<containerName>. If you already know the storage account and container name, you can just replace the information between the brackets to create your URL. 

You can also use the Azure portal or Azure Powershell to get the URL:

- **Portal**: Click **More services** > **Storage accounts** > <storage account> **Blobs** and your source VHD file is probably in the **vhds** container. Click **Properties** for the container, and copy the text labeled **URL**. You'll need the URLs of both the source and destination containers. 

- **Powershell**: Get-AzureRmVM -ResourceGroupName "resource_group_name" -Name "vm_name". In the results, look in the **Storage profile** section for the **Vhd Uri**. The first part of the Uri is the URL to the container and the last part is the OS VHD name for the VM.

## Get the storage access keys

Find the access keys for the source and destination storage accounts. For more information about access keys, see [About Azure storage accounts](../storage/storage-create-storage-account.md).

- **Portal**: Click **More services** > **Storage accounts** > <storage account> **All Settings** > **Access keys**. Copy the key labeled as **key1**.
- **Powershell**: Get-AzureRmStorageAccountKey -Name <storageAccount> -ResourceGroupName <resourceGroupName>. Copy the key labeled as **key1**.


## Copy the VHD 

You can copy files between storage accounts using AzCopy. For the destination container, if the specified container doesn't exist, it will be created for you. 

To use AzCopy, open a command prompt on your local machine and navigate to the folder where AzCopy is installed. It will be similar to *C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy*. 

To copy all of the files within a container, you use the **/S** switch. This can be used to copy the VMs OS VHD and all of the data disks if they are in the same container.

	AzCopy /Source:https://<sourceStorageAccountName>.blob.core.windows.net/<sourceContainerName> /Dest:https://<destinationStorageAccount>.blob.core.windows.net/<destinationContainerName> /SourceKey:<sourceStorageAccountKey1> /DestKey:<destinationStorageAccountKey1> /S

If you only want to copy a specific VHD in a container with multiple files, you can also specify the file name using the /Pattern switch.

 	AzCopy /Source:<URL_of_the_source_blob_container> /Dest:<URL_of_the_destination_blob_container> /SourceKey:<Access_key_for_the_source_storage> /DestKey:<Access_key_for_the_destination_storage> /Pattern:<File_name_of_the_VHD_you_are_copying.vhd>


## Update the azuredeploy.json template file 

Now we need to edit the azuredeploy.json file to use copied VHD in the destination storage account. To edit the .json file, it is really easy to make the updates using Visual Studio and the Azure SDK and Tools. But, you can also edit the .json file using your favorite .json editor and a lint tool to validate the changes.

Change default value of the storage account and the diagnostic storage account parameters. Append **diag** or some other identifier to the `<destinationStorageAccountName>`  as the name to use for the storage diagnostics account and replace the storage account name entirely. 

```none
"storageAccounts_demomigrate2320diagnostics_name": {
    "defaultValue": "<destinationStorageAccount>diagnostics",
    "type": "String"
        },
"storageAccounts_demomigrate2320_name": {
    "defaultValue": "<destinationStorageAccount>",
    "type": "String"
},
```

> [AZURE.NOTE] The parameter name is inherited from the source VM, this is ok. Do not change it or you will have to update parameter name throughout the rest of the template.

Since we already have a storage account, we need to remove the storage account resource. Remove the section that looks something like this:

```none
{
    "comments": "Generalized from resource: '/subscriptions/d5b9d4b7-6fc1-46c5-bajy-38effaed19b2/resourceGroups/demomigrate/providers/Microsoft.Storage/storageAccounts/demomigrate2320'.",
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[parameters('storageAccounts_demomigrate2320_name')]",
    "apiVersion": "2015-06-15",
    "location": "westus",
    "tags": { },
    "properties": {
    "accountType": "Standard_LRS"
    },
    "dependsOn": [ ]
}
```

Because we are using an existing VHD to create the VM, we need to remove the Image reference from the virtual machine resource. Remove the section that looks something like this: 

```none
"imageReference": {
    "publisher": "MicrosoftWindowsServer",
    "offer": "WindowsServer",
    "sku": "Windows-Server-Technical-Preview",
    "version": "latest"
 },
```

Change the operating system disk option in the VM resource from **FromImage** to **Attach**. Also, make sure that there is a line for `"osType": "Windows",`.

```none
"osDisk": {
    "osType": "Windows",
    "name": "[parameters('virtualMachines_demomigrate_name')]",
    "createOption": "Attach",
    "vhd": {
        "uri": "[concat('https', '://', parameters('storageAccounts_demomigrate2320_name'), '.blob.core.windows.net', concat('/vhds/', parameters('virtualMachines_demomigrate_name'),'201651414373.vhd'))]"
    },
    "caching": "ReadWrite"
},
```

Because we are using an existing .vhd with a working operating system, we need to remove the OS profile from the VM resource.

```none
"osProfile": {
    "computerName": "[parameters('virtualMachines_demomigrate_name')]",
    "adminUsername": "neillocal",
    "windowsConfiguration": {
        "provisionVMAgent": true,
        "enableAutomaticUpdates": true
    },
    "secrets": [ ]
},
```

We also need to remove the dependency on the storage account from the VM resource, because we already have a storage account created. It should look something like this:

```none
"[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccounts_demomigrate2320_name'))]",
```


## Portal: Create the VM from the template using the Azure portal

1. Copy the entire contents of the edited azuredeploy.json file to your clipboard (CRTL + A and then CTRL + C).
3. Go to the [Azure portal](https://portal.azure.com/).
4. On the hub menu, select **New** and then type **template deployment**. Select **Template deployment** from the list.
5. In the **Custom Deployment** blade, click **Edit template**.
6. Select the existing content in the template and delete it to empty the file.
7. Paste the contents of the azuredeploy.json file from your clipboard into the window (CTRL+V) and then click **Save**.
8. In the**Custom deployment** blade, select **Edit parameters**.
9. In the **Parameters** blade, enter the password for the administrator account that you used when you created the original VM into the **VIRTUALMACHINES_IISVM_ADMINPASSWORD** field and then click **OK**.
10. In the **Custom deployments** blade, make sure the subscription name is the name of the destination subscription.
11. In **Resource group** select **Existing** and select the name of the resource group. This should have the same name as the resource group that the original VM was in.
12. Click **Review legal terms** and if everything looks okay, select **Purchase**.
13. When you are finished, click **Create** and the deployment will start.



## PowerShell: Deploy the VM using the template

1. Replace the value of **$deployName** with the name of the deployment. Replace the value of **$templatePath** with the path and name of the template file. Replace the value of **$parameterFile** with the path and name of the parameters file. Create the variables. 

	$location = "<locationName>"
	$destRG="<destinationResourceGroupName>"
	$deployName="<deploymentName>"
	$templatePath = "<localPathtotheTemplateFile"
	$parameterFile = "<localPathtotheParamerterFile>"

2. Deploy the template. 

	New-AzureRmResourceGroupDeployment -ResourceGroupName $destRG -TemplateFile $templatePath -TemplateParameterFile $parameterFile

## Troubleshooting

- When you use AZCopy, if you see the error "Server failed to authenticate the request. Make sure the value of Authorization header is formed correctly including the signature." and you are using Key 2 or the secondary storage key, try using the primary or 1st storage key.


## Next steps

- If there were issues with the deployment, a next step would be to look at [Troubleshooting resource group deployments with Azure portal](../resource-manager-troubleshoot-deployments-portal.md)

- To manage your new virtual machine with Azure PowerShell, see [Manage virtual machines using Azure Resource Manager and PowerShell](virtual-machines-windows-ps-manage.md).
