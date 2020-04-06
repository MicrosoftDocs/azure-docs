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

## Configure Azure Active Directory Domain Services

To configure your Azure Active Directory (AD) Domain Services account for FSLogix profile containers:

1. Sign in to the Microsoft Azure Portal with an account that has contributor or administrator permissions.

2. From the sidebar, select **All services**, then enter "domain services" into the search field, and then select **Azure AD Domain Services**.

    ![](media/478d16bc1600fe769cad1d9a3bb017c1.png)

3. When the Azure AD Domain Services window opens, select **Create**.

    ![](media/507548184ca23994234b29c7db2d8686.png)

    From there, follow the instructions that appear in the window to complete your Azure AD Domain Services deployment.

4. In the **Basics** tab:

   - Enter the DNS domain name.
   - Select an active Azure subscription (if multiple subscriptions are available).
   - Select an empty resource group or create a new one by selecting **Create new**.
   - Select a location.

   ![](media/4e47d1d1a0e569721bee200910f5b6cd.png)

5. For the **Network** tab, configure a virtual network or select an existing one. We recommend you create a new one by selecting **Create new** and entering the following information:

   - Visual network name
   - Address space
   - Subnet name
   - Subnet address range

   ![](media/d957973cb13652f934c5b5bacfcc4363.png)

6. For the **Administrator group** tab, select the Azure AD users that will manage the Azure AD Domain Services configuration.

7. For most deployments, you won't need to change any information in the **Synchronization** tab. Keep the default values unless told otherwise.

8. Finally, you'll see the **Summary** tab. Review the information to make sure you've selected the right settings. When you're done, select **OK** to start the deployment.

   ![](media/393b1487bc118ee4d12de59791a2127c.png)

   To check your deployment's progress, select the **Notifications** icon in the global controls bar.

   ![](media/5cd09e02a34b21f21656367ea32dce85.png)

9. When the deployment is done, go to **Azure AD Domain Services** and confirm that Azure AD Domain Services is running.

    ![](media/cbce39e15dee1384cbae1ada8d1a9adc.png)

## Add Azure AD Domain Services admins

To add additional admins, you'll to create a new user and then grant permissions to that user.

To add an admin:

1. Select **Azure Active Directory** from the sidebar, then select **All users**, and then select **New user**.

    ![Machine generated alternative text: ](media/912553500ef21136f6bbff3be7e2b294.png)

2.  Enter user details.

    ![](media/bb4b8c92fc2e8272e07f815d0dd2da12.png)

3. In the Azure Active Directory pane on the left side of the screen, select **Groups**.

    ![](media/3cee7401d5371eabfd3fbaeab7d6f148.png)

4. Select the **AAD DC Administrators** group.

    ![](media/dcd092f8a2ad0f9524fa991abcaad415.png)

5. In the left pane, select **Members**, then select **Add members** in the main pane. This will show a list of all users available in Azure AD. Select the user that was just created.

    ![](media/cec6475075caab014dd1d1e56efbfed3.png)

## Create and configure an Azure Files storage account

Now it's time to enable Azure AD Domain Services authentication over Server Message Block (SMB). For more details on this process, see the Azure Storage Documentation.

<!-->This needs a link<-->

To enable authentication:

1. Go to the Microsoft Azure Portal, then select **All services**, and then select **Storage accounts**.

![](media/d2ac5865c3363ee5b947477deeacdc3e.png)

2. Select **Add** to create a storage account.
3. In the window that appears:

    - Select **Subscription** (if applicable).
    - Select an existing **Resource group** or select **Create new** to create a new one.
    - Enter the **Storage account name**.
    - Select the **Location**. (We recommend using the same location as the session host VMs.)
    - Select the **Performance type**.
    - For **Account type**, select a **StorageV2 (general purpose V2) account**.

4. Select **Review + create**.

    ![A screenshot of a social media post Description automatically generated](media/458382dcfd202668cd05f385defeabe7.png)

    This will start the validation process for the information you entered for your new storage account.

    ![A screenshot of a cell phone Description automatically generated](media/b30a031f9a3c40f2d684fba9987fe123.png)

5. Once the validation process is done, select **Create**. This will start the deployment process.

    ![](media/c0d1853578fe454fbf3997a9c7fd3e1f.png)

6. Once the deployment is done, select **Go to resource**.

    ![](media/9a9affb45722e16e7879837d6dc54b30.png)

7. Select **Configuration** from the pane on the left side of the screen, then enable **Azure Active Directory authentication for Azure Files** in the main pane. Confirm this change by selecting **Save**.

    ![](media/fe680e01ad82add2ca84950dc064b331.png)

8. Select **Overview** in the pane on the left side of the screen, then select **Files** in the main pane.

    ![](media/ce6d28323fcde3473a29cacf76fd1012.png)

9. Select **File share** and enter the **Name** and **Quota**.

    ![](media/16bca81b9121c1715881b377d5446be7.png)

## Assign access permissions to an identity

From Microsoft Azure portal navigate to the **Files share** created in the previous section.

1. Select **Access Control (IAM)**.
2. Select **Add a role assignment**.

    ![A screenshot of a cell phone Description automatically generated](media/8c110f20826e4a927683d7459a16bb8f.png)

3. In the **Add role assignment** tab, select the appropriate built-in role from the role list. You'll need to at least select **Storage File Data SMB Share Contributor** for the account to get proper permissions.
4. For **Assign access to**, select **Azure AD user, group, or service principal**.
5. Select a name or email address for the target Azure AD identity.
6. Select **Save**.

    ![A screenshot of a cell phone Description automatically generated](media/6e6d62920f860fd95ee6a7b9d819b524.png)

## Obtain storage account access key

1. From the Microsoft Azure Portal sidebar, select **Storage accounts**.

2. From the list of storage accounts, select the account for which you enabled Azure AD Domain Services and created the custom roles in steps above.

3. Under **Settings**, select **Access keys** and copy the key from **key1**.

   ![C:\\Users\\stgeorgi\\AppData\\Local\\Temp\\SNAGHTML2d3da703.PNG](media/b1a8fc08f35c18a7c25dfdf7132cb1e2.png)

   >[!NOTE]
   >If the key contains the "/" symbol, hit the **Refresh** icon to generate a new key.

4. Go to the **Virtual Machines** tab and locate any VM that is going to be part of your host pool.

5. Select the name of the virtual machine (VM) under **Virtual Machines (adVM)** and select **Connect**

    ![](media/3ecf7213be33271184a8ef6010a4c77a.png)

    This will download an RDP file that allows you to connect to the VM with the VM's credentials.

    ![](media/548eb9df3d6cd1128f1f026a26410289.png)

6. When you've remoted into the VM, run a command prompt as an administrator.

    ![](media/873cd3a11b4a612a3d57cff4d380068f.png)

7. Run the following command, making the modifications noted below:

     ```cmd
     net use <desired-drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> <storage-account-key> /user:Azure\<storage-account-name>
     ```

    - Replace **<desired-drive-letter>** with a drive letter of choice (for example, y:).
    - Replace all instances of **<storage-account-name>** with the name of the storage account specified earlier.
    - Replace **<share-name>** with the name of the share created earlier.
    - Replace **<storage-account-key>** with the storage account key from Azure.

Here's an example of what the command will look like:  
  
     ```cmd
     net use y: \\fsprofile.file.core.windows.net\share HDZQRoFP2BBmoYQ=(truncated)= /user:Azure\fsprofile)
     ```

![](media/16f2eca3af730178883973eeddfa8646.png)

Execute the following command to grant full access to the Azure Files share.

icacls \<mounted-drive-letter\>: /grant \<user-email\>:(f)

Modifications to this command should be as follows

-   Replace **\<mounted-drive-letter\>** with a drive letter of choice.
-   Replace **\<user-email\>** with the UPN of the user who will be accessing the session host VMs and needs a profile.

Here's an example of what the command will look like:

icacls y: /grant alexwilber\@airlift2020outlook.onmicrosoft.com:(f)

![](media/860469f98baa48ecffd16adb9d096046.png)