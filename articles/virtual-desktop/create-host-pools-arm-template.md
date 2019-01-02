---
title: Create a Windows Virtual Desktop host pool with an ARM template - Azure
description: How to create a host pool in Windows Virtual Desktop with an ARM template.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/21/2018
ms.author: helohr
---
# Create a host pool with an ARM template (Preview)

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow this section's instructions to create a host pool for a Windows Virtual Desktop tenant with an Azure Resource Manager (ARM) template provided by Microsoft. You will create a host pool in Windows Virtual Desktop and a resource group with VMs in an Azure subscription, join those VMs to the AD domain, and register the VMs with Windows Virtual Desktop.

## Create a VM image

See Copy Windows 10 Enterprise multi-session images to your storage account to use a Windows 10 Enterprise multi-session image or see Create a VM image for automated deployment to create your own custom image.

## Run the ARM template for provisioning a new host pool

This section is the same as [Create a host pool with Azure Marketplace](create-host-pools-azure-marketplace.md), only this time you’ll find the template in GitHub.

1. Go to [this GitHub URL](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/Create%20and%20provision%20WVD%20host%20pool).
2. If deploying in an Enterprise subscription, follow these steps to deploy to Azure:
    1. Scroll down and select **Deploy to Azure**.
    2. Skip ahead to step 4.
3. If you're deploying in a CSP subscription, follow these steps to deploy to Azure:
    1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
    2. Open a text editor like Notepad and paste the link there.
    3. Right after “https://portal.azure.com/” and before the hashtag (#) enter an at sign (@) followed by the tenant domain name. For example: https://portal.azure.com/@Contoso.onmicrosoft.com#create/...
    4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the CSP subscription.
    5. Paste the link you copied to the text editor into the address bar.
4.	Fill out the following parameters based on the source of the image you want to use for the host pool's virtual machines:
    1.	For Azure Gallery:
        1.  For **Rdsh Image Source**, select **Gallery**.
        2. For **Rdsh Gallery Image SKU**, select the appropriate image.
        3.    For **Rdsh is Windows Server**, select the appropriate value based on the image. Windows 10 Enterprise multi-session is considered Windows client.
        4.	For **Rdsh is 1809 or Later**, select the appropriate value based on the image. Windows Server 2019 is an 1809 release.
        5.	You can then leave the following parameters empty:
            1.	**Vm Image Vhd Uri**
            2.	**Rdsh Custom Image Source Name**
            3.	**Rdsh Custom Image Source Resource Group**
            4.	**Rdsh Use Managed Disks**
            5.	**Storage Account Resource Group Name**
    2.	For VHD from blob storage:
        1.	For **Rdsh Image Source**, select **CustomVHD**.
        2.	For **Vm Image Vhd Uri**, enter the full URL to the vhd in blob storage.
        3.	For **Rdsh Is Windows Server**, select the appropriate value based on the image. Windows 10 Enterprise multi-session is considered Windows client.
        4.	For **Rdsh is 1809 or Later**, select the appropriate value based on the image. Windows Server 2019 is an 1809 release.
        5.	For **Rdsh Use Managed Disks**, select the desired value. If you select **false**, the VHD files for each virtual machine will be stored in the same storage account as the image you provided in the **Vm Image Vhd Uri** parameter.
            1.	If you selected **false** for **Rdsh Use Managed Disks**, enter the name of the resource group containing the storage account and image for the **Storage Account Resource Group Name** parameter. Otherwise, leave this parameter empty.
        6.	You can then leave the following parameters empty or unchanged:
            1.	**Rdsh Gallery Image SKU**
            2.	**Rdsh Custom Image Source Name**
            3.	**Rdsh Custom Image Source Resource Group**
    3.	Azure Image resource you have created from a VHD file or captured from a virtual machine:
        1.	For **Rdsh Image Source**, select **CustomImage**.
        2.	For **Rdsh Custom Image Source Name**, enter the name of the Azure Image resource you want to use as the image source.
        3.	For **Rdsh Custom Image Source Resource Group**, enter the name of the resource group containing the Azure Image resource.
        4.	For **Rdsh is Windows Server**, select the appropriate value based on the image. Windows 10 Enterprise multi-session is considered Windows client.
        5.	For **Rdsh is 1809 or Later**, select the appropriate value based on the image. Windows Server 2019 is an 1809 release.
        6.	You can then leave the following parameters empty or unchanged:
            1.	**Vm Image Vhd Uri**
            2.	**Rdsh Gallery Image SKU**
            3.	**Rdsh Use Managed Disks**
            4.	**Storage Account Resource Group Name**
5.	Enter or change additional information regarding the virtual machines:
    1.	For **Rdsh Name Prefix**, you can enter your own prefix into the text box. Otherwise, the virtual machine names will begin with the first 10 characters of the resource group name.
    2.	For **Rdsh Number of Instances**, enter the number of virtual machines you would like to create.
    3.	For **Rdsh VM Disk Type**, select the disk type you would like to use for the virtual machines. If you selected **CustomVHD** as the **Rdsh Image Source** and **false** for **Rdsh Use Managed Disks**, make sure this parameter matches the storage account type where the image is located.
6.	Enter the appropriate domain and network properties:
    1.	For **Domain to Join**, enter the name of the domain you'd like the virtual machines to join (for example, “contoso.com”).
    2.	For **Existing Domain UPN**, enter the UPN of a user with permission join the virtual machines to the domain and organization unit (for example, “vmadmin@contoso.com”).
    3.	For **Existing Domain Password**, enter the defined Existing Domain UPN's domain password.
    4.	For **Ou Path**, enter the name of the organizational unit to place the virtual machines during the domain join process. If you do not have a pre-defined organizational unit for these virtual machines, you can leave this parameter empty.
    5.	For **Existing Vnet Name**, enter the name of the virtual network Azure resource you would like to use for the virtual machines.
    6.	For **Existing Subnet Name**, enter the name of the subnet of the virtual network you would like to use for the virtual machines.
    7.	For **Virtual Network Resource Group Name**, enter the name of the resource group containing the virtual network Azure resource.
7.	Enter the appropriate information to connect and authenticate to Windows Virtual Desktop:
    1.	For **Rd Broker URL**, leave this value as “https://rdbroker.wvd.microsoft.com” unless provided a different URL.
    2.	For **Existing Tenant Group Name**, enter the name of the tenant group that contains your Windows Virtual Desktop tenant. If you were not given a specific tenant group name, leave this value as “Default Tenant Group”.
    3.	For **Existing Tenant Name**, enter the name of your Windows Virtual Desktop tenant.
    4.	For **Host Pool Name**, enter the name of the Windows Virtual Desktop host pool you want to register your newly created virtual machines to. You can enter the name of an existing host pool or a new host pool you're creating with this template.
    5.	For **Tenant Admin Upn or Application Id**, enter the appropriate UPN or Application ID that will authenticate to Windows Virtual Desktop. When you're creating a new host pool, this principal must be assigned either the **RDS Owner** or **RDS Contributor** role at the Windows Virtual Desktop tenant scope. If you're adding these virtual machines to an existing host pool, this principal must be assigned either the **RDS Owner** or **RDS Contributor** role at the Windows Virtual Desktop host pool scope. Don't enter a UPN that requries multi-factor authentication. If you do, the virtual machines this template creates won't be able to connect to a Windows Virtual Desktop host pool.
    6.	For **Tenant Admin Password**, enter the password corresponding to the UPN or service principal (identified by the Application ID).
    7.	For **Is Service Principal**, select the appropriate value for the **Tenant Admin Upn or Application Id** principal.
        i.	If you selected **true** for **Is Service Principal**, enter your Azure AD Tenant ID for the **Aad Tenant Id** parameter to successfully authenticate to Windows Virtual Desktop as a service principal. Otherwise, leave this parameter empty.

## Assign users to the desktop application group

After the GitHub ARM template completes, assign user access before you start testing the full session desktops on your virtual machines.

To assign users to the desktop application group:
1.	Copy the RDPowerShell.zip file and extract it to a folder on your local computer.
2.	Unzip RDPowerShell.zip.
3.	Open a PowerShell prompt as Administrator.
4.	At the PowerShell command shell prompt, enter the following cmdlet:

    ```powershell
    cd <path-to-folder-where-RDPowerShell.zip-was-extracted>
    Import-module .\Microsoft.RdInfra.RdPowershell.dll
    ```

5.	Run the following cmdlet to sign in to the Windows Virtual Desktop environment.

    ```powershell
    Add-RdsAccount -DeploymentUrl “https://rdbroker.wvd.microsoft.com”
    ```

6.	Run the following cmdlet to set the context to the tenant group specified in the ARM template.

    ```powershell
    Set-RdsContext -TenantGroupName <Tenant Group name>
    ```

7.	Run the following cmdlet to add users to the desktop application group.

    ```powershell
    Add-RdsAppGroupUser <tenantname> <hostpoolname> “Desktop Application Group” -UserPrincipalName <userupn>
    ```

The user’s UPN should match the user’s identity in Azure AD, such as user1@contoso.com. If you would like to add multiple users, you must run this cmdlet for each user.

Users added to the desktop application group can now sign in to Windows Virtual Desktop using the supported Remote Desktop clients and see a resource for a session desktop.

