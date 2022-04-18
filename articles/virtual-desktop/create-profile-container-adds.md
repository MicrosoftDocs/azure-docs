---
title: Create FSLogix profile container Azure Files Active Directory Domain Services - Azure
description: This article describes how to create an FSLogix profile container with Azure Files and Azure Active Directory Domain Services.
author: Heidilohr
ms.topic: how-to
ms.date: 12/08/2021
ms.author: helohr
manager: femila
ms.custom: subject-rbac-steps
---

# Create a profile container with Azure Files and Azure AD DS

This article will show you how to create an FSLogix profile container with Azure Files and Azure Active Directory Domain Services (AD DS).

## Prerequisites

This article assumes you've already set up an Azure AD DS instance. If you don't have one yet, follow the instructions in [Create a basic managed domain](../active-directory-domain-services/tutorial-create-instance.md) first, then return here.

## Add Azure AD DS admins

To add more admins, you must create a new user and grant them the necessary permissions.

To add an admin:

1. Select **Azure Active Directory** from the sidebar, then select **All users**, and then select **New user**.

2. Enter the user details into the fields.

3. In the Azure Active Directory pane on the left side of the screen, select **Groups**.

4. Select the **AAD DC Administrators** group.

5. In the pane on the left side of the window, select **Members**, then select **Add members** in the main pane. You will see a list of all available users in Azure AD. Select the name of the user profile you just created.

## Set up an Azure Storage account

Now it's time to enable Azure AD DS authentication over Server Message Block (SMB).

To enable authentication:

1. If you haven't already, set up and deploy a general-purpose v2 Azure Storage account by following the instructions in [Create an Azure Storage account](../storage/common/storage-account-create.md).

2. Once you've finished setting up your account, select **Go to resource**.

3. Select **Configuration** from the pane on the left side of the screen, then enable **Azure Active Directory authentication for Azure Files** in the main pane. When you're done, select **Save**.

4. Select **Overview** in the pane on the left side of the screen, then select **Files** in the main pane.

5. Select **File share** and enter the **Name** and **Quota** into the fields that appear on the right side of the screen.

## Assign access permissions to an identity

Other users will need access permissions to access your file share. To do this, you'll need to assign each user a role with the appropriate access permissions.

To assign users access permissions:

1. From the Azure portal, open the file share you created in [Set up an Azure Storage account](#set-up-an-azure-storage-account).

1. Select **Access control (IAM)**.

1. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

1. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

    | Setting | Value |
    | --- | --- |
    | Role | Storage File Data SMB Share Contributor |
    | Assign access to | User, group, or service principal |
    | Members | \<Name or email address for the target Azure Active Directory identity> |

    ![Screenshot showing Add role assignment page in Azure portal.](../../includes/role-based-access-control/media/add-role-assignment-page.png)

## Get the Storage Account access key

Next, you'll need to get the access key for your Storage Account.

To get the Storage Account access key:

1. From the Azure portal sidebar, select **Storage accounts**.

2. From the list of storage accounts, select the account that you enabled Azure AD DS and created the custom roles for in the previous sections.

3. Under **Settings**, select **Access keys** and copy the key from **key1**.

4. Go to the **Virtual Machines** tab and locate any VM that will become part of your host pool.

5. Select the name of the virtual machine (VM) under **Virtual Machines (adVM)** and select **Connect**. Connecting will download an RDP file that will let you sign in to the VM with its own credentials.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the RDP tab of the Connect to virtual machine window.](media/rdp-tab.png)

6. When you've signed in to the VM, open a command prompt as an administrator.

7. Run the following command:

     ```cmd
     net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> /user:Azure\<storage-account-name> <storage-account-key>
     ```

    - Replace `<desired-drive-letter>` with a drive letter of your choice (for example, `y:`).
    - Replace all instances of `<storage-account-name>` with the name of the storage account you specified earlier.
    - Replace `<share-name>` with the name of the share you created earlier.
    - Replace `<storage-account-key>` with the storage account key from Azure.

    For example:

     ```cmd
     net use y: \\fsprofile.file.core.windows.net\share HDZQRoFP2BBmoYQ=(truncated)= /user:Azure\fsprofile
     ```

8. Run the following commands to allow your Azure Virtual Desktop users to create their own profile container while blocking access to the profile containers from other users.

     ```cmd
     icacls <mounted-drive-letter>: /grant <user-email>:(M)
     icacls <mounted-drive-letter>: /grant "Creator Owner":(OI)(CI)(IO)(M)
     icacls <mounted-drive-letter>: /remove "Authenticated Users"
     icacls <mounted-drive-letter>: /remove "Builtin\Users"
     ```

    - Replace `<mounted-drive-letter>` with the letter of the drive you used to map the drive.
    - Replace `<user-email>` with the UPN of the user or Active Directory group that contains the users that will require access to the share.

    For example:

     ```cmd
     icacls <mounted-drive-letter>: /grant john.doe@contoso.com:(M)
     icacls <mounted-drive-letter>: /grant "Creator Owner":(OI)(CI)(IO)(M)
     icacls <mounted-drive-letter>: /remove "Authenticated Users"
     icacls <mounted-drive-letter>: /remove "Builtin\Users"
     ```

## Create a profile container with FSLogix

In order to use profile containers, you'll need to configure FSLogix on your session host VMs. If you're using a custom image that doesn't have the FSLogix Agent already installed, follow the instructions in [Download and install FSLogix](/fslogix/install-ht). You can set options for setting registry keys on session hosts in images or on a group policy. You'll need to follow these instructions every time you configure a session host, as long as you don't use group policies to apply these settings at scale to multiple session hosts.

To configure FSLogix on your session host VM:

1. RDP to the session host VM of the Azure Virtual Desktop host pool.

2. [Download and install FSLogix](/fslogix/install-ht).

3. Follow the instructions in [Configure profile container registry settings](/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings):

    - Go to **Computer** > **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **FSLogix**.

    - Create a **Profiles** key.

    - Create **Enabled, DWORD** with a value of 1.

    - Create **VHDLocations, MULTI_SZ**.

    - [Get the UNC path](create-file-share.md#get-the-unc-path), then set the value of **VHDLocations** to that UNC path.

4. Restart the VM.

## Make sure your profile works

Once you've installed and configured FSLogix, you can test your deployment by signing in with a user account that's been assigned an app group or desktop on the host pool. Make sure the user account you sign in with has permission on the file share.

If the user has signed in before, they'll have an existing local profile that they'll use during this session. To avoid creating a local profile, either create a new user account to use for tests or use the configuration methods described in [Tutorial: Configure Profile Container to redirect User Profiles](/fslogix/configure-profile-container-tutorial/).

To check your permissions on your session:

1. Start a session on Azure Virtual Desktop.

2. Open the Azure portal.

3. Open the storage account you created in [Set up a storage account](#set-up-an-azure-storage-account).

4. Go to **Data storage** in your storage account, then select **File shares**.

5. Open your file share and make sure the user profile folder you've created is in there.

For extra testing, follow the instructions in [Make sure your profile works](create-profile-container-adds.md#make-sure-your-profile-works).

## Next steps

If you're looking for alternate ways to create FSLogix profile containers, check out the following articles:

- [Create a profile container for a host pool using a file share](create-host-pools-user-profile.md).
- [Create an FSLogix profile container for a host pool using Azure NetApp Files](create-fslogix-profile-container.md)

You can find more detailed information about concepts related to FSlogix containers for Azure files in [FSLogix profile containers and Azure files](fslogix-containers-azure-files.md).
