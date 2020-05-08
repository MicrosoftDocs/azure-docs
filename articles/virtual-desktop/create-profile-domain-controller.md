---
title: Create FSLogix profile container Azure Files domain controller - Azure
description: How to set up an FSLogix profile container for Windows Virtual Desktop with an Azure Files domain controler.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/11/2020
ms.author: helohr
manager: lizross
---
# Create a profile container with a domain controller

This article shows how to configure an existing Windows Virtual Desktop host pool with profiles stored on an Azure Files storage account. Authentication is done by a domain controller.

The full guide for setting up Active Directory (AD) authentication over SMB for Azure file shares (AFS) is available [here](../storage/files/storage-files-active-directory-domain-services-enable.md#regional-availability).

## Set up a storage account 

1.  Sign in to the Azure portal.

2.  Search for **storage account**.

3.  Select **+Add**.

4.  Enter the following information into the  **Create storage account** page:

    1.  Create a new resource group

    2.  Enter unique storage account name

    3.  Location, must be the same location as the Windows Virtual Desktop host pool

    4.  Performance standard (as this is a test deployment with less than 200
        users)

    5.  For **Account type**, select **StorageV2**.

    6.  For **Replication**, select **Read-access geo-redundant (RA-GRS)**.

5.  When you're done, select **Review + create**, then select **Create**.

## Create an Azure file share

1.  Once the storage account is deployed, select **Go to resource**.

2.  On the Overview screen select **File shares**.

3.  Select **+File shares** and create a new named **profiles** and enter quota
    of 30 GB.

4.  Select **Create**.

       ![A screenshot of a cell phone Description automatically generated](media/be3b2fb3fba193f6d26117ffe0b48a1a.png)

## Enable Azure Acitve Directory authentication for your SA

Next, you'll need to enable Azure Active Directory authentication. To enable this policy, you'll need to follow this section's instructions on a machine that's already domain-joined. For this guide, this means you should follow these instructions on the VM running the domain controller.

1.  RDP into the domain controller VM.

2.  Download the **AzFilesHybrid** module [here](https://github.com/Azure-Samples/azure-files-samples/releases).

3.  Unzip the module file to a local folder.

4.  Open **PowerShell** and navigate to the folder from step 3.

5.  Optionally, you can run the following cmdlet to set the execution policy to **Unrestricted**: 
    
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
    ```

6.  Install NuGet via

    Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force

7.  Import the downloaded PS module AzFilesHybrid
    
    ```powershell
    Import-Module -Name .\\AzFilesHybrid.psd1
    ```

8.  Connect to our Azure via PowerShell

    ```powershell
    Connect-AzAccount
    ```

9.  Sign in when prompted

10. (optional) If there are multiple Azure subscription select the correct one
    via
    
    ```powershell
    Select-AzSubscription -SubscriptionId \<subscription name\>
    ```

11. Connect the SA with active directory via command below. Replace \<rg-name\>
    and \<sa-name\> with values from section Setup storage account.

>[!IMPORTANT]
>the below command supports capability for adding new account to an organization unit via the switches -OrganizationalUnitName and -OrganizationalUnitDistinguishedName. For mode details, [visit](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-active-directory-enable#12-domain-join-your-storage-account)*.*

```powershell
Join-AzStorageAccountForAuth -ResourceGroupName "\<rg-name\>" \`

\-Name "\<sa-name\>" -DomainAccountType "ComputerAccount" \`

\-DomainAccountType "ComputerAccount"
```

1.  Navigate to the Azure portal open the storage account that was created,
    select on **Configuration** and confirm **Azure Directory (AD)** is enabled

![](media/a140f4cd5050bfdaf97e58a7af3a1065.png)

>   A screenshot of a cell phone Description automatically generated

## Assign Azure RBAC permission to storage account

At least one user, likely and administrator will need to be assigned **Storage File Data SMB Share Elevated Contributor.** The administrator will be used to assign NTFS permissions on the files share.

For all users that need to have FSLogix profiles stored on the SA assign **Storage File Data SMB Share Contributor**. It is a best practice to create an AD group for all users that need to have FSLogix profiles.

To assign RBAC permissions:

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  Select **Access Control (IAM)**

4.  Select **Add a role assignment**

5.  In the **Add role assignment blade,** select **Storage File Data SMB Share
    Elevated Contributor** for the administrator account.

6.  Select **Save**

Repeat the above steps for all users that need to have FSLogix profiles but change the role to **Storage File Data SMB Share Contributor.**

>[!NOTES]
>the accounts being used here must be create in the domain controller and synched to Azure AD. Accounts sourced from Azure AD are not appropriate.

![A screenshot of a cell phone Description automatically generated](media/be76c7798e58d4ef9349ad72ee419070.png)

## Configure NTFS permissions over SMB

Once RBAC permission have been assigned the next step is to configure the NTFS permission. There are two pieces of information we need from Azure portal to complete the NTFS permission:

-   UNC path
-   SA key

### Obtaining the UNC path

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  From under **Settings** select **Properties**

4.  In the following screen locate the **Primary File Service Endpoint** and
    copy it to a text editor

5.  Modify the URI to become UNC by:

    -  Remove https://

    -  Replace forward slash / with a back slash \\

    -  Append name of the file share created in the Create an Azure file share
        section

        For example:
        [\\\\customdomain.file.core.windows.net\\\<fileshare-name](file:///\\customdomain.file.core.windows.net\%3cfileshare-name)\>

### Obtaining SA key

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  From the storage account blade select **Access keys**

4.  Copy **key1** or **key2** to a local file

### Configure NTFS permissions

From the VM running the domain controller open the command prompt.

Run command below to mount the Azure files share and assign it a drive letter

```powershell
net use <desired-drive-letter>: <UNC-path> <SA-key>
/user:Azure\\<SA-name>
```

Use Windows File Explorer to grant full permission to all directories and files under the file share, including the root directory.

1.  Open **Windows File Explorer** and right select on the file/directory and select Properties

2.  Select the **Security** tab

3.  Select **Edit...** button to change permissions

4.  You can change the permission of existing users, or select on **Add...** to grant permissions to new users

5.  In the prompt window for adding new users, enter the target user name you want to grant permission to in the **Enter the object names to select** box, and select on **Check Names** to find the full UPN name of the target user.

6.  Select **OK**

7.  In the **Security** tab, select all permissions you want to grant to the newly add user. Details on what permissions are optimal for FSLogix is available [here](/fslogix/fslogix-storage-config-ht).

8.  Select **Apply**

## Configure FSLogix on session host VMs

In this section we cover the steps needed to configure a VM with FSLogix. These steps need to be completed on all VMs. There are multiple ways to deploy in bulk and configure FSLogix that do not require work on each individual VM. More information on those available [here](/fslogix/install-ht).

1.  RDP to the session host VM part of the WVD Hostpool

2.  Download FSLogix agent from here

3.  Unzip and execute and run **FSlogixAppsSetup.exe**

4.  Agree with the conditions and select **Install**

5.  Configure profile container registry settings, more details [here](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings):

    -  Navigate to **Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\FSLogix**

    -  Create key **Profiles**

    -  Create **Enabled, DWORD** with value of 1

    -  Create **VHDLocations, MULTI_SZ**

    -  Set the value of **VHDLocations** to the UNC path generated in the section **Obtaining the UNC path**

6.  Restart the VM.

# Testing

Once the VM has been restarted sign in with a user that has permission on the session host and on the file share.

When the session has been established and start menu is visible:

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  Select on the share create in the Create an Azure file share

4.  Confirm that a folder containing the user profile has been created

>[!NOTE]
>For troubleshooting FSLogix please follow the guide [here](/fslogix/fslogix-trouble-shooting-ht).

![A screenshot of a cell phone Description automatically generated](media/70bf3b78244f426a1e4091f2f3a69f9e.png)
