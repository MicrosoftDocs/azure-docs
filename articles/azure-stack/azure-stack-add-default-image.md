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
ms.date: 3/1/2017
ms.author: erikje

---
# Add the Windows Server 2016 VM image to the Azure Stack marketplace

Before you can provision virtual machines, you must add the Windows Server VM image to the Azure Stack marketplace.

1. After deploying Azure Stack, sign in to the MAS-CON01 virtual machine.
2. Go to https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2016 and download the Windows Server 2016 evaluation. When prompted, select the **ISO** version of the download. Record the path to the download location to use later in these steps.
3. Open PowerShell ISE as an administrator.
4. Install the following PowerShell modules:

    ```powershell
    Install-Module -Name AzureRM -RequiredVersion 1.2.8 -Scope CurrentUser
    Install-Module -Name AzureStack
    ```
5. Download the Azure Stack Tools archive, expand the downloaded files, and changes to the tools directory by running the following script:    

    ```powershell
    #Download the tools archive
    invoke-webrequest https://github.com/Azure/AzureStack-Tools/archive/master.zip -OutFile master.zip 
    #Expand the downloaded files. 
    expand-archive master.zip -DestinationPath . -Force
    #Change to the tools directory
    cd AzureStack-Tools-master 
    ```
6. Import the Azure Stack Connect and Compute Modules by using the following script:

    ```powershell
    Import-Module .\Connect\AzureStack.Connect.psm1 
    Import-Module .\ComputeAdmin\AzureStack.ComputeAdmin.psm1
    ```
7. Get the GUID of the Azure Active Directory Tenant that was used to deploy Azure Stack by running one of the following scripts (depending on if you are using AAD or AD FS):

    For AAD deployments, use the following:

    ```powershell
    $aadTenant = Get-AADTenantGUID -AADTenantName "<myaadtenant>.onmicrosoft.com" 
    ```

    For AD FS deployments, use the following script. Be sure to use your actual information for the placeholders Your_Azure_Stack_host_address and Your_Admin_Password (the password you used when you deployed Azure Stack).

    ```powershell
    Set-Item wsman:\localhost\Client\TrustedHosts -Value "Your_Azure_Stack_host_address" -Concatenate
    $Password = ConvertTo-SecureString "Your_Admin_Password" -AsPlainText -Force
    $AadTenant = Get-AzureStackAadTenant  -HostComputer <Host IP Address> -Password $Password
    ```

8. Add the Windows Server 2016 image to the Azure Stack marketplace by running the following script. Replace *Path_to_ISO* with the path to the WS2016 ISO you downloaded. See the Parameters section below for script parameter descriptions.

    ```powershell
    $ISOPath = "Path_to_ISO"
    New-Server2016VMImage -ISOPath $ISOPath -TenantId $aadTenant
    ```

9. When prompted, supply the credentials of the AAD service administrator account used to deploy Azure Stack.

## Parameters

|New-Server2016VMImage parameters|Required?|Description|
|-----|-----|------|
|ARMEndpoint|No|The Azure Resource Manager endpoint for your Azure Stack environment. The default is the one used by the Proof of Concept (PoC) environment.|
|AzureStackCredentials|Yes|The credentials provided during deployment that are used to login to the Azure Stack Administrator portal. |
|IncludeLatestCU|No|Set this switch to apply the latest Windows Server 2016 cumulative update to the new VHD.|
|ISOPath|Yes|The full path to the downloaded Windows Server 2016 ISO.|
|Net35|No|Set this switch to install .NET framework 3.5 into the image. Note that to use this image for installing additional Azure Stack services, you must use the -Net35 parameter to install .NET Framework 3.5 into the image.|
|TenantID|Yes|The GUID value of your Azure Stack Tenant ID.|
|Version|No|This parameter allows you to choose whether to add a Core or Full (or both) Windows Server 2016 images. Valid values include Full (the default this parameter is not provided), Core, and Both.|
|VHDSizeInMB|No|Sets the size (in MB) of the VHD image to be added to your Azure Stack environment. Default value is 40960 MB.|

## Next Steps

[Provision a virtual machine](azure-stack-provision-vm.md)
