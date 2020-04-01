---
title: Prepare Azure Files for an FSLogix profile container - Azure
description: This article describes FSLogix profile containers within Windows Virtual Desktop and Azure files.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/31/2020
ms.author: helohr
manager: lizross
---

# Prepare Azure Files for an FSLogix profile container

This article will show you how to prepare Azure Files to create an FSLogix profile container.

## Configure Azure AD Domain Services

First, you'll need to log in to the Microsoft Azure Portal with an account that has contributor or administrator permissions.

From the sidebar, select **All services**, type "domain services" in the search box, select **Azure AD Domain Services**, and hit **Enter.**

![](media/478d16bc1600fe769cad1d9a3bb017c1.png)

In the Azure AD Domain Services window, select **Create**.

![](media/507548184ca23994234b29c7db2d8686.png)

This will start the wizard for configuring an Azure AD Domain Services deployment.

For step 1, **Basics**:

-   Enter the DNS domain name.
-   Select an active Azure subscription (if multiple are available).
-   Select an empty resource group or create a new one by selecting **Create new**.
-   Select a location.

![](media/4e47d1d1a0e569721bee200910f5b6cd.png)

For step 2, **Network**, configure a virtual network or select an existing one.
We recommend you create a new one by selecting **Create new**

and entering the following information:

-   Name
-   Address space
-   Subnet name
-   Subnet address range

![](media/d957973cb13652f934c5b5bacfcc4363.png)

For step 3, **Administrator group**, select the Azure AD users that are going to be managing the Azure AD Domain Services configuration.

For most deployments, there is no need to change any of the information in step 4, **Synchronization**. The default values should suffice.

In step 5, **Summary**, you will see a summary of your configuration, similar to that shown below.

![](media/393b1487bc118ee4d12de59791a2127c.png)

Click **OK** to continue. This will start the deployment in Azure. If it is not automatically shown, you can click on the **Notifications** icon in the global controls bar to view deployment progress, as shown here:

![](media/5cd09e02a34b21f21656367ea32dce85.png)

Once the deployment has completed, navigate to **Azure AD Domain Services** and confirm that Azure AD Domain Services is running.

![](media/cbce39e15dee1384cbae1ada8d1a9adc.png)

## Add Azure AD Domain Services admins

To add additional administrators, we are first going to create a new user and then grant permissions to that user. To do this:

1.  Select **Azure Active Directory** from the sidebar, select **All users**, and select **New user**.

    ![Machine generated alternative text: ](media/912553500ef21136f6bbff3be7e2b294.png)

2.  Enter user details.

![](media/bb4b8c92fc2e8272e07f815d0dd2da12.png)

1.  Back in the Azure Active Directory left pane, select **Groups**.

![](media/3cee7401d5371eabfd3fbaeab7d6f148.png)

1.  Select the **AAD DC Administrators** group.

![](media/dcd092f8a2ad0f9524fa991abcaad415.png)

1.  In the left pane, select **Members**, then select **Add members** in the main pane. This will show a list of all users available in Azure AD. Select the user that was just created.

![](media/cec6475075caab014dd1d1e56efbfed3.png)

## Create and configure an Azure Files storage account

Now it's time to enable Azure AD Domain Services authentication over Server Message Block (SMB). For more details on this process, see the Azure Storage Documentation.

First, navigate to the Microsoft Azure Portal, select **All services**, and select **Storage accounts**.

![](media/d2ac5865c3363ee5b947477deeacdc3e.png)

Next, click **Add** to start the **Create storage account** wizard. Enter the following details:

-   Select **Subscription** (if applicable).
-   Select an existing **Resource group** or select **Create new** to create a
    new one.
-   Enter the **Storage account name**.
-   Select the **Location.** (We recommend using the same location as the
    session host VMs.)
-   Select the **Performance** type.
-   Select a StorageV2 (general purpose V2) **Account kind**.

Select **Review + create**.

![A screenshot of a social media post Description automatically generated](media/458382dcfd202668cd05f385defeabe7.png)

This will trigger validation of the input, as shown below.

![A screenshot of a cell phone Description automatically generated](media/b30a031f9a3c40f2d684fba9987fe123.png)

Once the account has passed validation, select **Create**. This will start the deployment.

![](media/c0d1853578fe454fbf3997a9c7fd3e1f.png)

Once the deployment has completed, proceed to the next step by selecting **Go to resource.**

![](media/9a9affb45722e16e7879837d6dc54b30.png)

Select **Configuration** from the left pane, then enable **Azure Active Directory authentication for Azure Files** in the main pane. Confirm this change by selecting **Save**.

![](media/fe680e01ad82add2ca84950dc064b331.png)

Once saved, select **Overview** in the left pane, then **Files** in the main
pane.

![](media/ce6d28323fcde3473a29cacf76fd1012.png)

Select **File share** and enter the **Name** and **Quota**.

![](media/16bca81b9121c1715881b377d5446be7.png)

## Assign access permissions to an identity

From Microsoft Azure portal navigate to the **Files share** created in the previous section.

1.  Select **Access Control (IAM).**
2.  Select **Add a role assignment.**

![A screenshot of a cell phone Description automatically generated](media/8c110f20826e4a927683d7459a16bb8f.png)

1.  In the **Add role assignment blade**, select the appropriate built-in role (at least **Storage File Data SMB Share Contributor)** from the **Role** list.
2.  Set **Assign access to** to **Azure AD user, group, or service principal**
3.  Select the target Azure AD identity by name or email address.
4.  Select **Save**.

![A screenshot of a cell phone Description automatically generated](media/6e6d62920f860fd95ee6a7b9d819b524.png)

## Obtain storage account access key

From the Microsoft Azure Portal sidebar, select **Storage accounts**.

From the list of storage accounts, select the account for which you enabled Azure AD Domain Services and created the custom roles in steps above.

Under **Settings**, select **Access keys** and copy the key from **key1**.

![C:\\Users\\stgeorgi\\AppData\\Local\\Temp\\SNAGHTML2d3da703.PNG](media/b1a8fc08f35c18a7c25dfdf7132cb1e2.png)

>[!NOTE]
>If the key contains the "/" symbol, hit the **Refresh** icon to generate a new key.

Navigate to the **Virtual Machines** tab and locate any VM that is going to be part of your hostpool.

Click on the name of the VM under **Virtual Machines** (adVM) and select **Connect**

![](media/3ecf7213be33271184a8ef6010a4c77a.png)

This will download an RDP file that allows you to connect to the VM via the credentials specified during VM creation.

![](media/548eb9df3d6cd1128f1f026a26410289.png)

One remoted into the VM run **Command Prompt** as an administrator.

![](media/873cd3a11b4a612a3d57cff4d380068f.png)

Execute the following command, making the modifications noted below:

net use **\<desired-drive-letter\>:**
\\\\**\<storage-account-name\>**.file.core.windows.net\\**\<share-name\>
\<storage-account-key\>** /user:Azure\\**\<storage-account-name\>**

Modifications to this command should be as follows:

-   Replace **\<desired-drive-letter\>** with a drive letter of choice (e.g. y:).
-   Replace all instances of **\<storage-account-name\>** with the name of the storage account specified earlier.
-   Replace **\<share-name\>** with the name of the share created earlier.
-   Replace **\<storage-account-key\>** with the storage account key from Azure.

Here's an example of what the command will look like:  
  
net use y: \\\\fsprofile.file.core.windows.net\\share
HDZQRoFP2BBmoYQ=(truncated)= /user:Azure\\fsprofile)

![](media/16f2eca3af730178883973eeddfa8646.png)

Execute the following command to grant full access to the Azure Files share.

icacls \<mounted-drive-letter\>: /grant \<user-email\>:(f)

Modifications to this command should be as follows

-   Replace **\<mounted-drive-letter\>** with a drive letter of choice.
-   Replace **\<user-email\>** with the UPN of the user who will be accessing the session host VMs and needs a profile.

Here's an example of what the command will look like:

icacls y: /grant alexwilber\@airlift2020outlook.onmicrosoft.com:(f)

![](media/860469f98baa48ecffd16adb9d096046.png)