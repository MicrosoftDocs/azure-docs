---
title: Create FSLogix profile container Azure Files domain controller - Azure
description: How to set up an FSLogix profile container for Windows Virtual Desktop with an Azure Files domain controler.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/20/2019
ms.author: helohr
manager: lizross
---
# Create a profile container with a domain controller

This article shows how to configure an existing Windows Virtual Desktop host pool with profiles stored on an Azure Files storage account. Authentication is done by a domain controller.

The full guide for setting up Active Directory (AD) authentication over SMB for
Azure file shares (AFS) is available
[here](../storage/files/storage-files-active-directory-domain-services-enable.md#regional-availability).

## Set up a storage account 

1.  Sign into Azure portal

2.  In the search box enter Storage account

3.  Click **+Add** and in the **Create storage account** enter

    1.  Create a new resource group

    2.  Enter unique storage account name

    3.  Location, must be the same location as the WVD Hostpool

    4.  Performance standard (as this is a test deployment with less than 200
        users)

    5.  Account kind – StorageV2

    6.  Replication – Read-access geo-redundant (RA-GRS)

4.  Click **Review + create** and the **Create** once validation has passed

## Create an Azure file share

1.  Once the storage account is deployed, click **Go to resource**

2.  On the Overview screen click **File shares**

3.  Click **+File shares** and create a new named **profiles** and enter quota
    of 30 GB

4.  Click **Create**

![A screenshot of a cell phone Description automatically generated](media/be3b2fb3fba193f6d26117ffe0b48a1a.png)

## Enable AD authentication for your SA

These steps need to be ran from a machine that is already domain joined. In our
environment this will be done from the VM running the domain controller.

1.  RDP into the domain controller VM

2.  Download the **AzFilesHybrid** module from
    [here](https://github.com/Azure-Samples/azure-files-samples/releases)

3.  Unzip to a local folder

4.  Open **PowerShell** and navigate to the folder from step \#3

5.  (optional) Set execution policy to Unrestricted via

    Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser

6.  Install NuGet via

    Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force

7.  Import the downloaded PS module AzFilesHybrid

    Import-Module -Name .\\AzFilesHybrid.psd1

8.  Connect to our Azure via PowerShell

    Connect-AzAccount

9.  Sign in when prompted

10. (optional) If there are multiple Azure subscription select the correct one
    via

    Select-AzSubscription -SubscriptionId \<subscription name\>

11. Connect the SA with active directory via command below. Replace \<rg-name\>
    and \<sa-name\> with values from section Setup storage account.

>   *Important: the below command supports capability for adding new account to
>   an organization unit via the switches -OrganizationalUnitName and
>   -OrganizationalUnitDistinguishedName. For mode details, please*
>   [visit](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-active-directory-enable#12-domain-join-your-storage-account)*.*

Join-AzStorageAccountForAuth -ResourceGroupName "\<rg-name\>" \`

\-Name "\<sa-name\>" -DomainAccountType "ComputerAccount" \`

\-DomainAccountType "ComputerAccount"

1.  Navigate to the Azure portal open the storage account that was created,
    click on **Configuration** and confirm **Azure Directory (AD)** is enabled

![](media/a140f4cd5050bfdaf97e58a7af3a1065.png)

>   A screenshot of a cell phone Description automatically generated

## Assign Azure RBAC permission to storage account

At least one user, likely and administrator will need to be assigned **Storage
File Data SMB Share Elevated Contributor.** The administrator will be used to
assign NTFS permissions on the files share.

For all users that need to have FSLogix profiles stored on the SA assign
**Storage File Data SMB Share Contributor**. It is a best practice to create an
AD group for all users that need to have FSLogix profiles.

To assign RBAC permissions:

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  Click **Access Control (IAM)**

4.  Click **Add a role assignment**

5.  In the **Add role assignment blade,** select **Storage File Data SMB Share
    Elevated Contributor** for the administrator account.

6.  Click **Save**

Repeat the above steps for all users that need to have FSLogix profiles but
change the role to **Storage File Data SMB Share Contributor.**

**Note:** the accounts being used here must be create in the domain controller
and synched to Azure AD. Accounts sourced from Azure AD are not appropriate.

![A screenshot of a cell phone Description automatically generated](media/be76c7798e58d4ef9349ad72ee419070.png)

## Configure NTFS permissions over SMB

Once RBAC permission have been assigned the next step is to configure the NTFS
permission. There are two pieces of information we need from Azure portal to
complete the NTFS permission:

-   UNC path

-   SA key

### Obtaining the UNC path

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  From under **Settings** select **Properties**

4.  In the following screen locate the **Primary File Service Endpoint** and
    copy it to a text editor

5.  Modify the URI to become UNC by:

    1.  Remove https://

    2.  Replace forward slash / with a back slash \\

    3.  Append name of the file share created in the Create an Azure file share
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

Run command below to mountthe Azure files share and assign it a drive letter

>   net use \<desired-drive-letter\>: \<UNC-pat\> \<SA-key\>
>   /user:Azure\\\<SA-name\>

Use Windows File Explorer to grant full permission to all directories and files
under the file share, including the root directory.

1.  Open **Windows File Explorer** and right click on the file/directory and
    select Properties

2.  Click on the **Security** tab

3.  Click on **Edit...** button to change permissions

4.  You can change the permission of existing users, or click on **Add...** to
    grant permissions to new users

5.  In the prompt window for adding new users, enter the target user name you
    want to grant permission to in the **Enter the object names to select** box,
    and click on **Check Names** to find the full UPN name of the target user.

6.  Click on **OK**

7.  In the **Security** tab, select all permissions you want to grant to the
    newly add user. Details on what permissions are optimal for FSLogix is
    available
    [here](https://docs.microsoft.com/en-us/fslogix/fslogix-storage-config-ht).

8.  Click on **Apply**

## Configure FSLogix on session host VMs

In this section we cover the steps needed to configure a VM with FSLogix. These
steps need to be completed on all VMs. There are multiple ways to deploy in bulk
and configure FSLogix that do not require work on each individual VM. More
information on those available
[here](https://docs.microsoft.com/en-us/fslogix/install-ht).

1.  RDP to the session host VM part of the WVD Hostpool

2.  Download FSLogix agent from here

3.  Unzip and execute and run **FSlogixAppsSetup.exe**

4.  Agree with the conditions and click **Install**

5.  Configure profile container registry settings, more details
    [here](https://docs.microsoft.com/en-us/fslogix/configure-profile-container-tutorial#configure-profile-container-registry-settings):

    1.  Navigate to **Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\FSLogix**

    2.  Create key **Profiles**

    3.  Create **Enabled, DWORD** with value of 1

    4.  Create **VHDLocations, MULTI_SZ**

    5.  Set the value of **VHDLocations** to the UNC path generated in the
        section **Obtaining the UNC path**

6.  Restart the VM

# Testing

Once the VM has been restarted sign in with a user that has permission on the
session host and on the file share.

When the session has been established and start menu is visible:

1.  Navigate to the Azure portal

2.  Open the storage account created in the Setup storage account section

3.  Click on the share create in the Create an Azure file share

4.  Confirm that a folder containing the user profile has been created

Note: For troubleshooting FSLogix please follow the guide
[here](https://docs.microsoft.com/en-us/fslogix/fslogix-trouble-shooting-ht).

![A screenshot of a cell phone Description automatically generated](media/70bf3b78244f426a1e4091f2f3a69f9e.png)

Appendix A – Process summary
============================

**WVD Requirements**

WVD certain are requirements listed
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/overview#requirements).
WVD tenant must be
[created](https://docs.microsoft.com/en-us/azure/virtual-desktop/tenant-setup-azure-active-directory),
and host VMs should be provisioned to and register to create a
[hostpool](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace).

 

**Active Directory (AD) authentication over SMB for Azure file shares (AFS)
requirements**

Detailed requirements are listed
[here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-domain-services-enable#prerequisites).

 

**Enable AD authentication for your account**

Detailed steps
[here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-domain-services-enable#enable-ad-authentication-for-your-account).

 

1. Check prerequisites

The most important from Azure Files perspective is selecting a region that
supports authentication over SMB. From WVD point it is mandatory to have the
session host VMs be able to join the DC which may require a VPN peering between
region where DC is and region where AFS is located.

 

2. Execute AD enablement script

In WVD context I ran this on the same machine that a domain controller.

 

In WVD environments this can be step \#2 can be executed from any VM that has
been domain joined.

 

**Assign access permissions to an identity**

Every user that needs to have a profile needs to be able to access that share
hence we need to define RBAC role for those users. Steps to assign permissions
are available
[here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-domain-services-enable#azure-portal).
The role used in this document is **Storage File Data SMB Share Contributor.**

>    

**Configure NTFS permissions over SMB**

Follow the detailed steps
[here](https://docs.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-domain-services-enable#configure-ntfs-permissions-over-smb).
[This](https://docs.microsoft.com/en-us/fslogix/fslogix-storage-config-ht)
document outlines common approach for setting up permission on a share that
stores profiles.

 

**FSLogix configuration**

Next FSLogix agent must be installed on all VMs that are part of the hostpool.
Configure FSLogix as outlined in our documentation available
[here](https://docs.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-user-profile).
The difference is that the path specified will be the path for the AFS.

 

Alternatively, there is a CSE extension that can install FSLogix on a set of VMs
that are in a resource group. This sample is available
[here](https://github.com/madsamuel/wvd/tree/master/fslogix%20dsc).
