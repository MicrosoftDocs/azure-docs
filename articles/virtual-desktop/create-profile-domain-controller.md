---
title: Create FSLogix profile container Azure Files domain controller - Azure
description: How to set up an FSLogix profile container in an existing Windows Virtual Desktop host pool.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/19/2020
ms.author: helohr
manager: lizross
---
# Create an FSLogix profile container in a host pool

In this article, you'll learn how to set up an Azure Files storage profile authenticated by a domain controller on an existing Windows Virtual Desktop host pool.

## Prerequisite

Before you start, make sure you've set up Azure Active Directory (AD) authentication over SMB for Azure file shares. If you haven't already, follow the instructions in [Regional availability](../storage/files/storage-files-identity-auth-active-directory-enable.md#regional-availability).

## Set up a storage account 

First, you'll need to set up an Azure Files storage account.

To set up a storage account:

1. Sign in to the Azure portal.

2. Search for **storage account** in the search bar.

3. Select **+Add**.

4. Enter the following information into the  **Create storage account** page:

    - Create a new resource group.
    - Enter a unique name for your storage account.
    - For **Location**, the location you choose must be the same as the Windows Virtual Desktop host pool.
    - For **Performance**, select **Standard** (for deployments with fewer than 200 users).
    - For **Account type**, select **StorageV2**.
    - For **Replication**, select **Read-access geo-redundant (RA-GRS)**.

5. When you're done, select **Review + create**, then select **Create**.

## Create an Azure file share

Next, you'll need to create an Azure Files share.

To create a file share:

1. Select **Go to resource**.

2. On the Overview page, select **File shares**.

3. Select **+File shares**, create a new file share named **profiles**, then enter a quota of **30 GB**.

4. Select **Create**.

## Enable Azure AD authentication for your storage account

Next, you'll need to enable Azure AD authentication. To enable this policy, you'll need to follow this section's instructions on a machine that's already domain-joined. To enable authentication, follow these instructions on the VM running the domain controller:

1. Remote Desktop Protocol into the domain controller VM.

2. [Download the AzFilesHybrid module](https://github.com/Azure-Samples/azure-files-samples/releases).

3. Unzip the module file to a local folder.

4. Open **PowerShell** and go to the folder from step 3.

5. Optionally, you can run the following cmdlet to set the execution policy to **Unrestricted**: 
    
    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
    ```

6. Run the following cmdlet to install NuGet.
    
    ```powershell
    Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
    ```

7. Run the following cmdlet to import the AzFilesHybrid module:
    
    ```powershell
    Import-Module -Name .\\AzFilesHybrid.psd1
    ```

8. Connect to the Azure portal with your account with the following cmdlet:

    ```powershell
    Connect-AzAccount
    ```

9. Sign in to your Azure account when prompted.

10. Optionally, if you have multiple Azure subscriptions, you can run the following cmdlet to select the one you want to use:
    
    ```powershell
    Select-AzSubscription -SubscriptionId <subscription name>
    ```

11. Run the following cmdlet to connect your storage account with Azure Active Directory. Replace `<rg-name>` and `<sa-name>` with the resource group and storage account you used in [Set up a storage account](#set-up-a-storage-account) respectively.

     >[!IMPORTANT]
     >The following cmdlet lets you add new accounts to your organization with the *-OrganizationalUnitName* and *-OrganizationalUnitDistinguishedName* parameters. For mode details, see [Enable on-premises Active Directory Domain Services authentication](../storage/files/storage-files-identity-auth-active-directory-enable.md#12-domain-join-your-storage-account).
     >
     > ```powershell
     > Join-AzStorageAccountForAuth -ResourceGroupName "<rg-name>" `
     >
     >-Name "<sa-name>" -DomainAccountType "ComputerAccount" `
     >
     >-DomainAccountType "ComputerAccount"
     >```

12. Open Azure portal, open your storage account, select **Configuration**, then confirm **Azure Active Directory (AD)** is set to **Enabled**.

     ![A screenshot of the Configuration page with the Active Directory enabled.](media/active-directory-enabled.png)


## Assign Azure RBAC permission to storage account

At least one admin needs to be assigned the Storage File Data SMB Share Elevated Contributor role. This admin will then assign other users NTFS permissions on the file share.

All users that need to have FSLogix profiles stored on the SA must be assigned the Storage File Data SMB Share Contributor role. You'll also need to create an Azure AD group for all users with FSLogix profiles.

To assign role-based access control (RBAC) permissions:

1. Open the Azure portal.

2. Open the storage account you created in [Set up a storage account](#set-up-a-storage-account).

3. Select **Access Control (IAM)**.

4. Select **Add a role assignment**.

5. In the **Add role assignment** tab, select **Storage File Data SMB Share Elevated Contributor** for the administrator account.

6. Select **Save**.

To assign users permissions for their FSLogix profiles, follow these same instructions. However, when you get to step 5, select **Storage File Data SMB Share Contributor** instead.

>[!NOTE]
>The accounts you use here should have been created in the domain controller and synced to Azure AD. Accounts sourced from Azure AD won't work.

## Configure NTFS permissions over SMB

Once you've assigned RBAC permissions to your users, next you'll need to configure the NTFS permissions.

You'll need to know two things from the Azure portal to get started:

- The UNC path.
- The storage account key.

### Get the UNC path

Here's how to get the UNC path:

1. Open the Azure portal.

2. Open the storage account you created in [Set up a storage account](#set-up-a-storage-account).

3. Select **Settings**, then select **Properties**.

4. Copy the **Primary File Service Endpoint** URI to the text editor of your choice.

5. After copying the URI, do the following things to change it into the UNC:

    - Remove `https://`
    - Replace the forward slash `/` with a back slash `\`.
    - Add the name of the file share you created in [Create an Azure file share](#create-an-azure-file-share) to the end of the UNC.

        For example: `\\customdomain.file.core.windows.net\<fileshare-name>`

### Get the storage account key

To get the storage account key:

1. Open the Azure portal.

2. Open the storage account you created in [Set up a storage account](#set-up-a-storage-account).

3. On the **Storage account** tab, select **Access keys**.

4. Copy **key1** or **key2** to a file on your local machine.

### Configure NTFS permissions

To configure your NTFS permissions:

1. Open a command prompt on the VM running the domain controller.

2. Run the following cmdlet to mount the Azure files share and assign it a drive letter:

     ```powershell
     net use <desired-drive-letter>: <UNC-pat> <SA-key> /user:Azure\<SA-name>
     ```

3. Use Windows File Explorer to grant full permissions to all directories and files under the file share, including the root directory. To do this, open **Windows File Explorer**, right-click on the file or directory, then select **Properties**.

4. Select the **Security** tab.
    
    - Select **Edit...** to change permissions for existing users.
    - Select **Add...** to grant permissions to new users.

5. If you select **Add...**, enter the user name you want to grant permission to in the **Enter the object names to select** field. Next, select **Check names** to find the full UPN name of that user.

6. Select **OK**.

7. In the **Security** tab, select all permissions you want to grant to the newly added user. For more information about which permissions you should grant users in FSLogix, see [Configure storage permissions for use with Profile Containers and Office Containers](/fslogix/fslogix-storage-config-ht).

8. Select **Apply**.

## Configure FSLogix on session host VMs

This section will show you how to configure a VM with FSLogix. You'll need to follow these instructions to configure every VM you plan to use. There's a method to deploy VMs in bulk without having to configure each VM one at a time, which you can find in [Download and install FSLogix](/fslogix/install-ht).

1. RDP to the session host VM part of the Windows Virtual Desktop host pool.

2. [Download the FSLogix agent](https://aka.ms/fslogix_download).

3. Unzip and run **FSlogixAppsSetup.exe**.

4. Agree with the conditions and select **Install**.

5. Follow the instructions in [Configure profile container registry settings](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings):

    - Navigate to **Computer** > **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **FSLogix**.

    - Create a **Profiles** key.

    - Create **Enabled, DWORD** with a value of 1.

    - Create **VHDLocations, MULTI_SZ**.

    - Set the value of **VHDLocations** to the UNC path you generated in [Get the UNC path](#get-the-unc-path).

6. Restart the VM.

## Testing

Once the VM has been restarted sign in with a user that has permission on the session host and on the file share.

To check your permissions on your session:

1. Start a session on Windows Virtual Desktop.

2. Open the Azure portal.

3. Open the storage account you created in [Set up a storage account](#set-up-a-storage-account).

4. Select **Create a share** on the Create an Azure file share page.

5. Make sure a folder containing the user profile now exists in your files.

## Next steps

To troubleshoot FSLogix, see [this troubleshooting guide](/fslogix/fslogix-trouble-shooting-ht).