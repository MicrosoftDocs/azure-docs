---
title: Set up FSLogix Profile Container with Azure Files and AD DS or Azure AD DS - Azure Virtual Desktop
description: This article describes how to create a FSLogix Profile Container with Azure Files and Active Directory Domain Services or Azure Active Directory Domain Services.
author: dknappettmsft
ms.topic: how-to
ms.date: 07/29/2022
ms.author: daknappe
manager: femila
ms.custom: subject-rbac-steps
---

# Set up FSLogix Profile Container with Azure Files and Active Directory Domain Services or Azure Active Directory Domain Services

This article will show you how to set up FSLogix Profile Container with Azure Files when your session host virtual machines (VMs) are joined to an Active Directory Domain Services (AD DS) domain or Azure Active Directory Domain Services (Azure AD DS) managed domain.

## Prerequisites

You'll need the following:

- A host pool where the session hosts are joined to an AD DS domain or Azure AD DS managed domain and users are assigned.
- A security group in your domain that contains the users who will use Profile Container. If you're using AD DS, this must be synchronized to Azure AD.
- Permission on your Azure subscription to create a storage account and add role assignments.
- A domain account to join computers to the domain and open an elevated PowerShell prompt.
- The subscription ID of your Azure subscription where your storage account will be.
- A computer joined to your domain for installing and running PowerShell modules that will join a storage account to your domain. This device will need to be running a [Supported version of Windows](/powershell/scripting/install/installing-powershell-on-windows#supported-versions-of-windows). Alternatively, you can use a session host.

> [!IMPORTANT]
> If users have previously signed in to the session hosts you want to use, local profiles will have been created for them and must be deleted first by an administrator for their profile to be stored in a Profile Container.

## Set up a storage account for Profile Container

To set up a storage account:

1. Sign in to the Azure portal.

1. Search for **Storage accounts** in the search bar.

1. Select **+ Create**.

1. Enter the following information into the **Basics** tab on the **Create storage account** page:

    - Create a new resource group or select an existing one to store the storage account in.
    - Enter a unique name for your storage account. This storage account name needs to be between 3 and 24 characters.
    - For **Region**, we recommend you choose the same location as the Azure Virtual Desktop host pool.
    - For **Performance**, select **Standard** as a minimum.
    - If you select Premium performance, set the **Premium account type** to **File shares**.
    - For **Redundancy**, select **Locally-redundant storage (LRS)** as a minimum.
    - The defaults on the remaining tabs don't need to be changed.

   > [!TIP]
   > Your organization may have requirements to change these defaults:
   >
   > - Whether you should select **Premium** depends on your IOPS and latency requirements. For more information, see [Storage options for FSLogix Profile Containers in Azure Virtual Desktop](store-fslogix-profile.md).
   > - On the **Advanced** tab, **Enable storage account key access** must be left enabled.
   > - For more information on the remaining configuration options, see [Planning for an Azure Files deployment](../storage/files/storage-files-planning.md).

1. Select **Review + create**. Review the parameters and the values that will be used, then select **Create**.

1. Once the storage account has been created, select **Go to resource**.

1. In the **Data storage** section, select **File shares**.

1. Select **+ File share**.

1. Enter a **Name**, such as *profiles*, then for the tier select **Transaction optimized**.

## Join your storage account to Active Directory

To use Active Directory accounts for the share permissions of your file share, you need to enable AD DS or Azure AD DS as a source. This process joins your storage account to a domain, representing it as a computer account. Select the relevant tab below for your scenario and follow the steps.

# [AD DS](#tab/adds)

1. Sign in to a computer that is joined to your AD DS domain. Alternatively, sign in to one of your session hosts.

1. Download and extract [the latest version of AzFilesHybrid](https://github.com/Azure-Samples/azure-files-samples/releases) from the Azure Files samples GitHub repo. Make a note of the folder you extract the files to.

1. Open an elevated PowerShell prompt and change to the directory where you extracted the files.

1. Run the following command to add the `AzFilesHybrid` module to your user's PowerShell modules directory:

   ```powershell
   .\CopyToPSPath.ps1
   ```

1. Import the `AzFilesHybrid` module by running the following command:

   ```powershell
   Import-Module -Name AzFilesHybrid
   ```

   > [!IMPORTANT]
   > This module requires requires the [PowerShell Gallery](/powershell/gallery/overview) and [Azure PowerShell](/powershell/azure/what-is-azure-powershell). You may be prompted to install these if they are not already installed or they need updating. If you are prompted for these, install them, then close all instances of PowerShell. Re-open an elevated PowerShell prompt and import the `AzFilesHybrid` module again before continuing.

1. Sign in to Azure by running the command below. You will need to use an account that has one of the following role-based access control (RBAC) roles:

   - Storage account owner
   - Owner
   - Contributor

   ```powershell
   Connect-AzAccount
   ```

   > [!TIP]
   > If your Azure account has access to multiple tenants and/or subscriptions, you will need to select the correct subscription by setting your context. For more information, see [Azure PowerShell context objects](/powershell/azure/context-persistence)

1. Join the storage account to your domain by running the commands below, replacing the values for `$subscriptionId`, `$resourceGroupName`, and `$storageAccountName` with your values. You can also add the parameter `-OrganizationalUnitDistinguishedName` to specify an Organizational Unit (OU) in which to place the computer account.

   ```powershell
   $subscriptionId = "subscription-id"
   $resourceGroupName = "resource-group-name"
   $storageAccountName = "storage-account-name"

   Join-AzStorageAccount `
       -ResourceGroupName $ResourceGroupName `
       -StorageAccountName $StorageAccountName `
       -DomainAccountType "ComputerAccount" `
       -EncryptionType "AES256"
   ```

   You can also specify the encryption algorithm used for Kerberos authentication in the previous command to `RC4` if you need to. Using AES256 is recommended.

1. To verify the storage account has joined your domain, run the commands below and review the output, replacing the values for `$resourceGroupName` and `$storageAccountName` with your values:

   ```powershell
   $resourceGroupName = "resource-group-name"
   $storageAccountName = "storage-account-name"

   (Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName).AzureFilesIdentityBasedAuth.DirectoryServiceOptions; (Get-AzStorageAccount -ResourceGroupName $resourceGroupName -Name $storageAccountName).AzureFilesIdentityBasedAuth.ActiveDirectoryProperties
   ```

> [!IMPORTANT]
> If your domain enforces password expiration, you must update the password before it expires to prevent authentication failures when accessing Azure file shares. For more information, see [Update the password of your storage account identity in AD DS](../storage/files/storage-files-identity-ad-ds-update-password.md) for details.

# [Azure AD DS](#tab/aadds)

1. From the Azure portal, open the storage account you created previously.

1. In the **Data storage** section, select **File shares**.

1. In the main section of the page, next to **Active Directory**, select **Not configured**.

1. In the box for **Azure Active Directory Domain Services**, select **Set up**.

1. Tick the box to **Enable Azure Active Directory Domain Services (Azure AD DS) for this file share**, then select **Save**. An Organizational Unit (OU) called **AzureFilesConfig** will be created at the root of your domain and a user account named the same as the storage account will be created in that OU. This account will be used as the Azure Files service account.

---

## Assign RBAC role to users

Users needing to store profiles in your file share will need permission to access it. To do this, you'll need to assign each user the *Storage File Data SMB Share Contributor* role.

To assign users the role:

1. From the Azure portal, browse to the storage account, then to the file share you created previously.

1. Select **Access control (IAM)**.

1. Select **+ Add**, then select **Add role assignment** from the drop-down menu.

1. Select the role **Storage File Data SMB Share Contributor** and select **Next**.

1. On the **Members** tab, select **User, group, or service principal**, then select **+Select members**. In the search bar, search for and select the security group that contains the users who will use Profile Container.

1. Select **Review + assign** to complete the assignment.

## Set NTFS permissions

Next, you'll need to set NTFS permissions on the folder, which requires you to get the access key for your Storage account.

To get the Storage account access key:

1. From the Azure portal, search for and select **storage account** in the search bar.

1. From the list of storage accounts, select the account that you enabled Azure AD DS and assigned the RBAC role for in the previous sections.

1. Under **Security + networking**, select **Access keys**, then show and copy the key from **key1**.

To set the correct NTFS permissions on the folder:

1. Sign in to a session host that is part of your host pool.

1. Open an elevated PowerShell prompt and run the command below to map the storage account as a drive on your session host. The mapped drive will not show in File Explorer, but can be viewed with the `net use` command. This is so you can set permissions on the share.

     ```cmd
     net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
     ```

    - Replace `<desired-drive-letter>` with a drive letter of your choice (for example, `y:`).
    - Replace all instances of `<storage-account-name>` with the name of the storage account you specified earlier.
    - Replace `<share-name>` with the name of the share you created earlier.
    - Replace `<storage-account-key>` with the storage account key from Azure.

    For example:

     ```cmd
     net use y: \\fsprofile.file.core.windows.net\share HDZQRoFP2BBmoYQ(truncated)== /user:Azure\fsprofile
     ```

1. Run the following commands to set permissions on the share that allow your Azure Virtual Desktop users to create their own profile while blocking access to the profiles of other users. You should use an Active Directory security group that contains the users you want to use Profile Container. In the commands below, replace `<mounted-drive-letter>` with the letter of the drive you used to map the drive and `<DOMAIN\GroupName>` with the domain and sAMAccountName of the Active Directory group that will require access to the share. You can also specify the user principal name (UPN) of a user.

   ```cmd
   icacls <mounted-drive-letter>: /grant "<DOMAIN\GroupName>:(M)"
   icacls <mounted-drive-letter>: /grant "Creator Owner:(OI)(CI)(IO)(M)"
   icacls <mounted-drive-letter>: /remove "Authenticated Users"
   icacls <mounted-drive-letter>: /remove "Builtin\Users"
   ```

   For example:

   ```cmd
   icacls y: /grant "CONTOSO\AVDUsers:(M)"
   icacls y: /grant "Creator Owner:(OI)(CI)(IO)(M)"
   icacls y: /remove "Authenticated Users"
   icacls y: /remove "Builtin\Users"
   ```

## Configure session hosts to use Profile Container

In order to use Profile Container, you'll need to make sure FSLogix Apps is installed on your session host VMs. FSLogix Apps is preinstalled in Windows 10 Enterprise multi-session and Windows 11 Enterprise multi-session operating systems, but you should still follow the steps below as it might not have the latest version installed. If you're using a [custom image](set-up-golden-image.md), you can install FSLogix Apps in your image.

To configure Profile Container, we recommend you use Group Policy Preferences to set registry keys and values at scale across all your session hosts. You can also set these in your custom image.

To configure Profile Container on your session host VMs:

1. Sign in to the VM used to create your custom image or a session host VM from your host pool.

1. If you need to install or update FSLogix Apps, download the latest version of [FSLogix](https://aka.ms/fslogix-latest) and install it by running `FSLogixAppsSetup.exe`, then following the instructions in the setup wizard. For more details about the installation process, including customizations and unattended installation, see [Download and Install FSLogix](/fslogix/install-ht).

1. Open an elevated PowerShell prompt and run the following commands, replacing `\\<storage-account-name>.file.core.windows.net\<share-name>` with the UNC path to your storage account you created earlier. These commands enable Profile Container and configure the location of the share.

   ```powershell
   $regPath = "HKLM:\SOFTWARE\FSLogix\profiles"
   New-ItemProperty -Path $regPath -Name Enabled -PropertyType DWORD -Value 1 -Force
   New-ItemProperty -Path $regPath -Name VHDLocations -PropertyType MultiString -Value \\<storage-account-name>.file.core.windows.net\<share-name> -Force
   ```

1. Restart the VM used to create your custom image or a session host VM. You will need to repeat these steps for any remaining session host VMs.

You have now finished the setting up Profile Container. If you are installing Profile Container in your custom image, you will need to finish creating the custom image. For more information, follow the steps in [Create a custom image in Azure](set-up-golden-image.md) from the section [Take the final snapshot](set-up-golden-image.md#take-the-final-snapshot) onwards.

## Validate profile creation

Once you've installed and configured Profile Container, you can test your deployment by signing in with a user account that's been assigned an application group or desktop on the host pool.

If the user has signed in before, they'll have an existing local profile that they'll use during this session. Either delete the local profile first, or create a new user account to use for tests.

Users can check that Profile Container is set up by following the steps below:

1. Sign in to Azure Virtual Desktop as the test user.

1. When the user signs in, the message "Please wait for the FSLogix Apps Services" should appear as part of the sign-in process, before reaching the desktop.

Administrators can check the profile folder has been created by following the steps below:

1. Open the Azure portal.

1. Open the storage account you created in previously.

1. Go to **Data storage** in your storage account, then select **File shares**.

1. Open your file share and make sure the user profile folder you've created is in there.

## Next steps

You can find more detailed information about concepts related to FSlogix Profile Container for Azure Files in [FSLogix Profile Container for Azure Files](fslogix-containers-azure-files.md).
