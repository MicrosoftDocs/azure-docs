---
title: Add the default VM image to the Azure Stack marketplace | Microsoft Docs
description: Add the Windows Server 2016 VM default image to the Azure Stack marketplace.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 04/04/2017
ms.author: erikje

---
# Add the Windows Server 2016 VM image to the Azure Stack marketplace

Before you can provision virtual machines, you must add the Windows Server VM image to the Azure Stack marketplace.

1. After deploying Azure Stack, sign in to the MAS-CON01 virtual machine.
2. Go to https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016 and download the Windows Server 2016 evaluation. When prompted, select the **ISO** version of the download. Record the path to the download location to use later in these steps.
3. Open PowerShell ISE as an administrator.
4. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md).
5. [Download the Azure Stack tools from GitHub](azure-stack-powershell-download.md).  
   
   > [!NOTE]
   > Make sure that you download and extract the Azure Stack tool repository to a folder that is NOT under the C:\Windows\System32 directory.  
   
6. [Configure PowerShell for use with Azure Stack](azure-stack-powershell-configure.md)  
7. Import the Azure Stack ComputeAdmin Module by using the following cmdlet:
   ```powershell
   Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1
   ```

8. Add the Windows Server 2016 image to the Azure Stack marketplace by running the following script. Replace *Path_to_ISO* with the path to the WS2016 ISO you downloaded. See the [Parameters](#parameters) section below for the allowed parameters.

   ```powershell
   $ISOPath = "<Path_to_ISO>"
   
   # Store the AAD service administrator account credentials in a variable 
   $UserName='<Username of the service administrator account>'
   $Password='<Admin password provided when deploying Azure Stack>'|ConvertTo-SecureString -Force -AsPlainText
   $Credential=New-Object PSCredential($UserName,$Password)

   # Add a Windows Server 2016 Evaluation VM Image. Make sure to configure the $AadTenant and AzureStackAdmin environment values as described in Step 6
   New-Server2016VMImage -ISOPath $ISOPath -TenantId $AadTenant -EnvironmentName "AzureStackAdmin" -AzureStackCredentials $Credential
    ```

## Parameters

|New-Server2016VMImage parameters|Required?|Description|
|-----|-----|------|
|ArmEndpoint|No|The Azure Resource Manager endpoint for your Azure Stack environment. The default is the one used by the Proof of Concept (PoC) environment.|
|AzureStackCredentials|Yes|The credentials provided during deployment that are used to login to the Azure Stack Administrator portal. |
|IncludeLatestCU|No|Set this switch to apply the latest Windows Server 2016 cumulative update to the new VHD.|
|ISOPath|Yes|The full path to the downloaded Windows Server 2016 ISO.|
|Net35|No|Set this switch to install .NET framework 3.5 into the image. Note that to use this image for installing additional Azure Stack services, you must use the -Net35 parameter to install .NET Framework 3.5 into the image.|
|TenantID|Yes|The GUID value of your Azure Stack Tenant ID.|
|Version|No|This parameter allows you to choose whether to add a Core or Full (or both) Windows Server 2016 images. Valid values include Full (the default this parameter is not provided), Core, and Both.|
|VHDSizeInMB|No|Sets the size (in MB) of the VHD image to be added to your Azure Stack environment. Default value is 40960 MB.|
|CreateGalleryItem|No|Specifies if a Marketplace item should be created for the Windows Server 2016 image. By default, this value is set to true.|
|location |No |Specifies the location to which the Windows Server 2016 image should be published.|
|CUUri |No |Set this value to choose the Windows Server 2016 cumulative update from a specific URI. |
|CUPath |No |Set this value to choose the Windows Server 2016 cumulative update from a local path. This option is helpful if you have deployed Azure Stack in a disconnected environment.|

## Next Steps

[Provision a virtual machine](azure-stack-provision-vm.md)
