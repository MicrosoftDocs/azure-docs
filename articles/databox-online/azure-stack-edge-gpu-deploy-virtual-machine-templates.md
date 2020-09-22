---
title: Deploy VMs on your Azure Stack Edge Pro device via templates
description: Describes how to create and manage virtual machines (VMs) on a Azure Stack Edge Pro device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/04/2020
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro device using APIs so that I can efficiently manage my VMs.
---

# Deploy VMs on your Azure Stack Edge Pro GPU device via templates

This tutorial describes how to create and manage a VM on your Azure Stack Edge Pro device using templates. These templates are JavaScript Object Notation (JSON) files that define the infrastructure and configuration for your VM. In these templates, you specify the resources to deploy and the properties for those resources.

Templates are flexible in different environments as they can take parameters as input at runtime from a file. The standard naming structure is `TemplateName.json` for the template and `TemplateName.parameters.json` for the parameters file. For more information on ARM templates, go to [What are Azure Resource Manager templates?](../azure-resource-manager/templates/overview.md).

In this tutorial, we’ll use pre-written sample templates for creating resources. You won’t need to edit the template file and you can modify just the `.parameters.json` files to customize the deployment to your machine. 

## VM deployment workflow

To deploy Azure Stack Edge Pro VMs across many device, you can use a single sysprepped VHD for your full fleet, the same template for deployment, and just make minor changes to the parameters to that template for each deployment location (these changes could be by hand as we’re doing here, or programmatic.) 

The high level summary of the deployment workflow using templates is as follows:

1. **Configure prerequisites** - There are 3 types of prerequisites; device, client, and for the VM.

    1. **Device prerequisites**

        1. Connect to Azure Resource Manager on device.
        2. Enable compute via the local UI.

    2. **Client prerequisites**

        1. Download the VM templates and associated files on client.
        1. Optionally configure TLS 1.2 on client.
        1. [Download and install Microsoft Azure Storage Explorer](https://go.microsoft.com/fwlink/?LinkId=708343&clcid=0x409) on your client.

    3. **VM prerequisites**

        1. Create a resource group in the device location that will contain all the VM resources.
        1. Create a storage account to upload the VHD used to create VM image.
        1. Add local storage account URI to DNS or hosts file on the client accessing your device.
        1. Install the blob storage certificate on the device as well as on the local client accessing your device. Optionally install the blob storage certificate on the Storage Explorer.
        1. Create and upload a VHD to the storage account created earlier.

2. **Create VM from templates**

    1. Create a VM image and a VNet using `CreateImageAndVnet.parameters.json` parameters file and `CreateImageAndVnet.json` deployment template.
    1. Create a VM with previously created resources using `CreateVM.parameters.json` parameters file and  `CreateVM.json` deployment template.

## Device prerequisites

Configure these prerequisites on your Azure Stack Edge Pro device.

[!INCLUDE [azure-stack-edge-gateway-deploy-virtual-machine-prerequisites](../../includes/azure-stack-edge-gateway-deploy-virtual-machine-prerequisites.md)]

## Client prerequisites

Configure these prerequisites on your client that will be used to access the Azure Stack Edge Pro device.

1. [Download Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) if you are using it to upload a VHD. Alternatively, you can download AzCopy to upload a VHD. You may need to configure TLS 1.2 on your client machine if running older versions of AzCopy. 
1. [Download the VM templates and parameters files](https://aka.ms/ase-vm-templates) to your client machine. Unzip it into a directory you’ll use as a working directory.


## VM prerequisites

Configure these prerequisites to create resources which will be needed for VM creation. 

    
### Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which the Azure resources such as storage account, disk, managed disk are deployed and managed.

> [!IMPORTANT]
> All the resources are created in the same location as that of the device and the location is set to **DBELocal**.

```powershell
New-AzureRmResourceGroup -Name <Resource group name> -Location DBELocal
```

A sample output is shown below.

```powershell
PS C:\windows\system32> New-AzureRmResourceGroup -Name myasegpurgvm -Location DBELocal

ResourceGroupName : myasegpurgvm
Location          : dbelocal
ProvisioningState : Succeeded
Tags              :
ResourceId        : /subscriptions/DDF9FC44-E990-42F8-9A91-5A6A5CC472DB/resourceGroups/myasegpurgvm

PS C:\windows\system32>
```

### Create a storage account

Create a new storage account using the resource group created in the previous step. This is a **local storage account** that will be used to upload the virtual disk image for the VM.

```powershell
New-AzureRmStorageAccount -Name <Storage account name> -ResourceGroupName <Resource group name> -Location DBELocal -SkuName Standard_LRS
```

> [!NOTE]
> Only the local storage accounts such as Locally redundant storage (Standard_LRS or Premium_LRS) can be created via Azure Resource Manager. To create tiered storage accounts, see the steps in [Add, connect to storage accounts on your Azure Stack Edge Pro](azure-stack-edge-j-series-deploy-add-storage-accounts.md).

A sample output is shown below.

```powershell
PS C:\windows\system32> New-AzureRmStorageAccount -Name myasegpusavm -ResourceGroupName myasegpurgvm -Location DBELocal -SkuName Standard_LRS

StorageAccountName ResourceGroupName Location SkuName     Kind    AccessTier CreationTime
------------------ ----------------- -------- -------     ----    ---------- ------------
myasegpusavm       myasegpurgvm      DBELocal StandardLRS Storage            7/29/2020 10:11:16 PM

PS C:\windows\system32>
```

To get the storage account key, run the `Get-AzureRmStorageAccountKey` command. A sample output of this command is shown here.

```powershell
PS C:\windows\system32> Get-AzureRmStorageAccountKey

cmdlet Get-AzureRmStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: myasegpurgvm
Name: myasegpusavm

KeyName    Value                                                  Permissions   
-------     -----                                                   --
key1 GsCm7QriXurqfqx211oKdfQ1C9Hyu5ZutP6Xl0dqlNNhxLxDesDej591M8y7ykSPN4fY9vmVpgc4ftkwAO7KQ== 11 
key2 7vnVMJUwJXlxkXXOyVO4NfqbW5e/5hZ+VOs+C/h/ReeoszeV+qoyuBitgnWjiDPNdH4+lSm1/ZjvoBWsQ1klqQ== ll
```

### Add blob URI to hosts file

Make sure that you have already added the blob URI in hosts file for the client that you are using to connect to Blob storage. **Run Notepad as administrator** and add the following entry for the blob URI in the `C:\windows\system32\drivers\etc\hosts`:

`<Device IP> <storage account name>.blob.<Device name>.<DNS domain>`

In a typical environment, you would have your DNS configured so that all storage accounts would point to the Azure Stack Edge Pro device with a `*.blob.devicename.domainname.com` entry.

### (Optional) Install certificates

Skip this step if you will connect via Storage Explorer using *http*. If you are using *https*, then you need to install appropriate certificates in Storage Explorer. In this case, install the blob endpoint certificate. For more information, see how to create and upload certificates in [Manage certificates](azure-stack-edge-j-series-manage-certificates.md). 

### Create and upload a VHD

Make sure that you have a virtual disk image that you can use to upload in the later step. Follow the steps in [Create a VM image](azure-stack-edge-j-series-create-virtual-machine-image.md). 

Copy any disk images to be used into page blobs in the local storage account that you created in the earlier steps. You can use a tool such as [Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) or [AzCopy to upload the VHD to the storage account](azure-stack-edge-j-series-deploy-virtual-machine-powershell.md#upload-a-vhd) that you created in earlier steps. 

### Use Storage Explorer for upload

1. Open Storage Explorer. Go to **Edit** and make sure that the application is set to **Target Azure Stack APIs**.

    ![Set target to Azure Stack APIs](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/set-target-apis-1.png)

2. Install the client certificate in PEM format. Go to **Edit > SSL Certificates > Import certificates**. Point to the client certificate.

    ![Import blob storage endpoint certificate](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/import-blob-storage-endpoint-certificate-1.png)

    - If you are using device generated certificates, download and convert the blob storage endpoint `.cer` certificate to a `.pem` format. Run the following command. 
    
        ```powershell
        PS C:\windows\system32> Certutil -encode 'C:\myasegpu1_Blob storage (1).cer' .\blobstoragecert.pem
        Input Length = 1380
        Output Length = 1954
        CertUtil: -encode command completed successfully.
        ```
    - If you are bringing your own certificate, use the signing chain root certificate in `.pem` format.

3. After you have imported the certificate, restart Storage Explorer for the changes to take effect.

    ![Restart Storage Explorer](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/restart-storage-explorer-1.png)

4. In the left pane, right-click **Storage accounts** and select **Connect to Azure Storage**. 

    ![Connect to Azure Storage 1](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/connect-azure-storage-1.png)

5. Select **Use a storage account name and key**. Select **Next**.

    ![Connect to Azure Storage 2](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/connect-azure-storage-2.png)

6. In the **Connect with Name and Key**, provide the **Display name**, **Storage account name**, Azure Storage **Account key**. Select **Other** Storage domain and then provide the `<device name>.<DNS domain>` connection string. If you didn’t install a certificate in Storage Explorer, check the **Use HTTP** option. Select **Next**.

    ![Connect with Name and Key](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/connect-name-key-1.png)

7. Review the **Connection summary** and select **Connect**.

8. The storage account appears in the left-pane. Select and expand the storage account. Select **Blob containers**, right-click and select **Create Blob Container**. Provide a name for your blob container.

9. Select the container you just created and in the right-pane, select **Upload > Upload files**. 

    ![Upload VHD file 1](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/upload-vhd-file-1.png)

10. Browse and point to the VHD that you want to upload in the **Selected files**. Select **Blob type** as **Page blob** and select **Upload**.

    ![Upload VHD file 2](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/upload-vhd-file-2.png)

11. Once the VHD is loaded to the blob container, select the VHD, right-click, and then select **Properties**. 

    ![Upload VHD file 3](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/upload-vhd-file-3.png)

12. Copy and save the **Uri** as you will use this in the later steps.

    ![Copy URI](media/azure-stack-edge-gpu-deploy-virtual-machine-templates/copy-uri-1.png)

<!--### Use AzCopy for upload

Before you use AzCopy, make sure that the [AzCopy is configured correctly](#configure-azcopy) for use with the blob storage REST API version that you are using with your Azure Stack Edge Pro device.


```powershell
AzCopy /Source:<sourceDirectoryForVHD> /Dest:<blobContainerUri> /DestKey:<storageAccountKey> /Y /S /V /NC:32  /BlobType:page /destType:blob 
```

> ![NOTE]
> Set `BlobType` to page for creating a managed disk out of VHD. Set `BlobType` to block when writing to tiered storage accounts using AzCopy.

You can download the disk images from the marketplace. For detailed steps, go to [Get the virtual disk image from Azure marketplace](azure-stack-edge-j-series-create-virtual-machine-image.md).

A sample output using AzCopy 7.3 is shown below. For more information on this command, go to [Upload VHD file to storage account using AzCopy](../devtest-labs/devtest-lab-upload-vhd-using-azcopy.md).


```powershell
AzCopy /Source:\\hcsfs\scratch\vm_vhds\linux\ /Dest:http://sa191113014333.blob.dbe-1dcmhq2.microsoftdatabox.com/vmimages /DestKey:gJKoyX2Amg0Zytd1ogA1kQ2xqudMHn7ljcDtkJRHwMZbMK== /Y /S /V /NC:32 /BlobType:page /destType:blob /z:2e7d7d27-c983-410c-b4aa-b0aa668af0c6
```-->

## Create image and VNet for your VM

To create image and a virtual network for your VM, you will need to edit the `CreateImageAndVnet.parameters.json` parameters file and then deploy the template `CreateImageAndVnet.json` that uses this parameter file.


### Edit parameters file

The file `CreateImageAndVnet.parameters.json` takes the following parameters: 

```json
"parameters": {
	    "osType": {
	          "value": "<Operating system corresponding to the VHD you upload can be Windows or Linux>"
        },
        "imageName": {
            "value": "<Name for the VM iamge>"
        },
        "imageUri": {
              "value": "<Path to the VHD that you uploaded in the Storage account>"
        },
        "vnetName": {
            "value": "<Name for the virtual network where you will deploy the VM>"
        },
        "subnetName": {
            "value": "<Name for the subnet for the VNet>"
        },
        "addressPrefix": {
            "value": "<Address prefix for the virtual network>"
        },
        "subnetPrefix": {
            "value": "<Subnet prefix for the subnet for the Vnet>"
        }
    }
```

Edit the file `CreateImageAndVnet.parameters.json` to include the following for your Azure Stack Edge Pro device:

1. Provide the OS type corresponding to the VHD you will upload. The OS type can be Windows or Linux.

    ```json
    "parameters": {
            "osType": {
              "value": "Windows"
            },
    ```

2. Change the image URI to the URI of the image you uploaded in the earlier step:

    ```json
    "imageUri": {
        "value": "https://myasegpusavm.blob.myasegpu1.wdshcsso.com/windows/WindowsServer2016Datacenter.vhd"
        },
    ```
    If you’re using *http* with Storage Explorer, change this to an *https* URI.

3. Change the `addressPrefix` and `subnetPrefix`. In the local UI of your device, go to the **Network** page. Find the port you enabled for compute. Get the IP address of the base network and add the subnet mask to create the CIDR notation. If you have a standard 255.255.255.0 subnet, do this by replacing the last number of the IP address with 0 and adding /24 to the end. So, 10.126.68.0 with a 255.255.255.0 subnet mask becomes 10.126.68.0/24. 
    
    ```json
    "addressPrefix": {
                "value": "10.126.68.0/24"
            },
            "subnetPrefix": {
                "value": "10.126.68.0/24"
            }
    ```  

4. Provide the unique image name, VNet name, and subnet name for the parameters.

    Here is a sample json that is used in this article.

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
      "parameters": {
        "osType": {
          "value": "Windows"
        },
        "imageName": {
          "value": "image1"
        },
        "imageUri": {
          "value": "https://myasegpusavm.blob.myasegpu1.wdshcsso.com/windows/WindowsServer2016Datacenter.vhd"
        },
        "vnetName": {
          "value": "vnet1"
        },
        "subnetName": {
          "value": "subnet1"
        },
        "addressPrefix": {
          "value": "10.126.68.0/24"
        },
        "subnetPrefix": {
          "value": "10.126.68.0/24"
        }
      }
    }
    ```
5. Save the parameters file.


### Deploy template 

Deploy the template `CreateImageAndVnet.json`. This template deploys the VNet and image resources that will be used to create VMs in the later step.

> [!NOTE]
> When you deploy the template if you get an authentication error, your Azure credentials for this session may have expired. Rerun the `login-AzureRM` command to connect to Azure Resource Manager on your Azure Stack Edge Pro device again.

1. Run the following command: 
    
    ```powershell
    $templateFile = "Path to CreateImageAndVnet.json"
    $templateParameterFile = "Path to CreateImageAndVnet.parameters.json"
    $RGName = "<Name of your resource group>"
    New-AzureRmResourceGroupDeployment `
        -ResourceGroupName $RGName `
        -TemplateFile $templateFile `
        -TemplateParameterFile $templateParameterFile `
        -Name "<Name for your deployment>"
    ```

2. Check if the image and the VNet resources are successfully provisioned. Here is a sample output of a successfully created image and VNet.
    
    ```powershell
    PS C:\07-30-2020> login-AzureRMAccount -EnvironmentName aztest1 -TenantId c0257de7-538f-415c-993a-1b87a031879d
    
    Account               SubscriptionName              TenantId                             Environment
    -------               ----------------              --------                             -----------
    EdgeArmUser@localhost Default Provider Subscription c0257de7-538f-415c-993a-1b87a031879d aztest1
    
    PS C:\07-30-2020> $templateFile = "C:\07-30-2020\CreateImageAndVnet.json"
    PS C:\07-30-2020> $templateParameterFile = "C:\07-30-2020\CreateImageAndVnet.parameters.json"
    PS C:\07-30-2020> $RGName = "myasegpurgvm"
    PS C:\07-30-2020> New-AzureRmResourceGroupDeployment `
    >>     -ResourceGroupName $RGName `
    >>     -TemplateFile $templateFile `
    >>     -TemplateParameterFile $templateParameterFile `
    >>     -Name "Deployment1"
    
    DeploymentName          : Deployment1
    ResourceGroupName       : myasegpurgvm
    ProvisioningState       : Succeeded
    Timestamp               : 7/30/2020 5:53:32 PM
    Mode                    : Incremental
    TemplateLink            :
    Parameters              :
                              Name             Type                       Value
                              ===============  =========================  ==========
                              osType           String                     Windows
                              imageName        String                     image1
                              imageUri         String
                              https://myasegpusavm.blob.myasegpu1.wdshcsso.com/windows/WindowsServer2016Datacenter.vhd
                              vnetName         String                     vnet1
                              subnetName       String                     subnet1
                              addressPrefix    String                     10.126.68.0/24
                              subnetPrefix     String                     10.126.68.0/24
    
    Outputs                 :
    DeploymentDebugLogLevel :
    
    PS C:\07-30-2020>
    ```
    
## Create VM

### Edit parameters file to create VM
 
To create a VM, use the `CreateVM.parameters.json` parameter file. It takes the following parameters.
    
```json
"vmName": {
            "value": "<Name for your VM>"
        },
        "adminUsername": {
            "value": "<Username to log into the VM>"
        },
        "Password": {
            "value": "<Password to log into the VM>"
        },
        "imageName": {
            "value": "<Name for your image>"
        },
        "vmSize": {
            "value": "<A supported size for your VM>"
        },
        "vnetName": {
            "value": "<Name for the virtual network you created earlier>"
        },
        "subnetName": {
            "value": "<Name for the subnet you created earlier>"
        },
        "nicName": {
            "value": "<Name for the network interface>"
        },
        "privateIPAddress": {
            "value": "<Private IP address, enter a static IP in the subnet created earlier or leave empty to assign DHCP>"
        },
        "IPConfigName": {
            "value": "<Name for the ipconfig associated with the network interface>"
        }
```    

Assign appropriate parameters in `CreateVM.parameters.json` for your Azure Stack Edge Pro device.

1. Provide a unique name, network interface name, and ipconfig name. 
1. Enter a username, password, and a supported VM size.
1. Give the same name for **VnetName**, **subnetName**, and **ImageName** as given in the parameters for `CreateImageAndVnet.parameters.json`. For example, if you have given VnetName, subnetName and ImageName as **vnet1**, **subnet1**, and **image1**, keep those values same for the parameters in this template as well.
1. Now you’ll need a static IP address to assign to the VM that is in the subnet network defined above. Replace **PrivateIPAddress** with this address in the parameter file. To have the VM get an IP address from your local DCHP server, leave the `privateIPAddress` value blank.  
    
    ```json
    "privateIPAddress": {
                "value": "5.5.153.200"
            },
    ```
    
4. Save the parameters file.

    Here is a sample json that is used in this article.
    
    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "vmName": {
                "value": "mywindowsvm"
            },
            "adminUsername": {
                "value": "Administrator"
            },
            "Password": {
                "value": "Password1"
            },
            "imageName": {
                "value": "image1"
            },
            "vmSize": {
                "value": "Standard_D1_v2"
            },
            "vnetName": {
                "value": "vnet1"
            },
            "subnetName": {
                "value": "subnet1"
            },
            "nicName": {
                "value": "nic1"
            },
            "privateIPAddress": {
                "value": "10.126.68.186"
            },
            "IPConfigName": {
                "value": "ipconfig1"
            }
        }
    }
    ```      

### Deploy template to create VM

Deploy the VM creation template `CreateVM.json`. This template creates a network interface from the existing VNet and creates VM from the deployed image.

1. Run the following command: 
    
    ```powershell
    Command:
        
        $templateFile = "<Path to CreateVM.json>"
        $templateParameterFile = "<Path to CreateVM.parameters.json>"
        $RGName = "<Resource group name>"
             
        New-AzureRmResourceGroupDeployment `
            -ResourceGroupName $RGName `
            -TemplateFile $templateFile `
            -TemplateParameterFile $templateParameterFile `
            -Name "<DeploymentName>"
    ```   

    The VM creation will take 15-20 minutes. Here is a sample output of a successfully created VM.
    
    ```powershell
    PS C:\07-30-2020> $templateFile = "C:\07-30-2020\CreateWindowsVM.json"
        PS C:\07-30-2020> $templateParameterFile = "C:\07-30-2020\CreateWindowsVM.parameters.json"
        PS C:\07-30-2020> $RGName = "myasegpurgvm"
        PS C:\07-30-2020> New-AzureRmResourceGroupDeployment `
        >>     -ResourceGroupName $RGName `
        >>     -TemplateFile $templateFile `
        >>     -TemplateParameterFile $templateParameterFile `
        >>     -Name "Deployment2"    
        
        DeploymentName          : Deployment2
        ResourceGroupName       : myasegpurgvm
        ProvisioningState       : Succeeded
        Timestamp               : 7/30/2020 6:21:09 PM
        Mode                    : Incremental
        TemplateLink            :
        Parameters              :
                                  Name             Type                       Value
                                  ===============  =========================  ==========
                                  vmName           String                     MyWindowsVM
                                  adminUsername    String                     Administrator
                                  password         String                     Password1
                                  imageName        String                     image1
                                  vmSize           String                     Standard_D1_v2
                                  vnetName         String                     vnet1
                                  subnetName       String                     subnet1
                                  nicName          String                     Nic1
                                  ipConfigName     String                     ipconfig1
                                  privateIPAddress  String                    10.126.68.186
        
        Outputs                 :
        DeploymentDebugLogLevel :    
        
        PS C:\07-30-2020>
    ```   
You can also run the `New-AzureRmResourceGroupDeployment` command asynchronously with `–AsJob` parameter. Here is a sample output when the cmdlet runs in the background. You can then query the status of job that is created using the `Get-Job` cmdlet.

    ```powershell	
    PS C:\WINDOWS\system32> New-AzureRmResourceGroupDeployment `
	>>     -ResourceGroupName $RGName `
	>>     -TemplateFile $templateFile `
	>>     -TemplateParameterFile $templateParameterFile `
	>>     -Name "Deployment2" `
	>>     -AsJob
	 
	Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
	--     ----            -------------   -----         -----------     --------             -------
	2      Long Running... AzureLongRun... Running       True            localhost            New-AzureRmResourceGro...
	 
	PS C:\WINDOWS\system32> Get-Job -Id 2
	 
	Id     Name            PSJobTypeName   State         HasMoreData     Location             Command
	--     ----            -------------   -----         -----------     --------             -------
	2      Long Running... AzureLongRun... Completed     True            localhost            New-AzureRmResourceGro...
    ```

7. Check if the VM is successfully provisioned. Run the following command:

    `Get-AzureRmVm`


## Connect to a VM

Depending on whether you created a Windows or a Linux VM, the steps to connect can be different.

### Connect to Windows VM

Follow these steps to connect to a Windows VM.

[!INCLUDE [azure-stack-edge-gateway-connect-vm](../../includes/azure-stack-edge-gateway-connect-virtual-machine-windows.md)]

### Connect to Linux VM

Follow these steps to connect to a Linux VM.

[!INCLUDE [azure-stack-edge-gateway-connect-vm](../../includes/azure-stack-edge-gateway-connect-virtual-machine-linux.md)]

<!--## Manage VM

The following section describes some of the common operations around the VM that you will create on your Azure Stack Edge Pro device.

[!INCLUDE [azure-stack-edge-gateway-manage-vm](../../includes/azure-stack-edge-gateway-manage-vm.md)]-->


## Supported VM sizes

[!INCLUDE [azure-stack-edge-gateway-supported-vm-sizes](../../includes/azure-stack-edge-gateway-supported-vm-sizes.md)]

## Unsupported VM operations and cmdlets

Extensions, scale sets, availability sets, snapshots are not supported.

<!--## Configure AzCopy

When you install the latest version of AzCopy, you will need to configure AzCopy to ensure that it matches the blob storage REST API version of your Azure Stack Edge Pro device.

On the client used to access your Azure Stack Edge Pro device, set up a global variable to match the blob storage REST API version.

### On Windows client 

`$Env:AZCOPY_DEFAULT_SERVICE_API_VERSION = "2017-11-09"`

### On Linux client

`export AZCOPY_DEFAULT_SERVICE_API_VERSION=2017-11-09`

To verify if the environment variable for AzCopy was set correctly, take the following steps:

1. Run "azcopy env".
2. Find `AZCOPY_DEFAULT_SERVICE_API_VERSION` parameter. This should have the value you set in the preceding steps.-->


## Next steps

[Azure Resource Manager cmdlets](https://docs.microsoft.com/powershell/module/azurerm.resources/?view=azurermps-6.13.0)
