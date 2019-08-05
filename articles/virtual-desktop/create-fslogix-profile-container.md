---
title: Create an FSLogix profile container in Windows Virtual Desktop - Azure
description: How to create an FSLogix profile container in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 08/05/2019
ms.author: helohr
---
# Create an FSLogix profile container in Windows Virtual Desktop

We recommend using FSLogix profile containers as a user profile solution for the [Windows Virtual Desktop Preview service](https://aka.ms/wvdpreview). FSLogix profile containers store a complete user profile in a single container and are designed to roam profiles in non-persistent remote computing environments like Windows Virtual Desktop. When you sign in, the container dynamically attaches to the computing environment using a locally supported virtual hard disk (VHD) and Hyper-V virtual hard disk (VHDX). These advanced filter-driver technologies allow the user profile to be immediately available and appear in the system exactly like a local user profile. To learn more about FSLogix profile containers, see [FSLogix profile containers and Azure files](fslogix-containers-azure-files.md).

You can create FSLogix profile containers using Azure NetApp Files, an easy-to-use Azure native platform service that helps customers quickly and reliably provision enterprise-grade SMB volumes for their Windows Virtual Desktop environments. To learn more about Azure NetApp Files, see [What is Azure NetApp Files?](../azure-netapp-files/azure-netapp-files-introduction.md)

This guide will show you how to set up an Azure NetApp Files account and create FSLogix profile containers in Windows Virtual Desktop.

This article assumes you already have a set of virtual machines (VMs) that are part of a Windows Virtual Desktop environment. To learn how to set up tenants, see [the tenant creation tutorial](tenant-setup-azure-active-directory.md) and [our Tech Community blog post](https://techcommunity.microsoft.com/t5/Windows-IT-Pro-Blog/Getting-started-with-Windows-Virtual-Desktop/ba-p/391054).

The instructions in this guide are specifically for Windows Virtual Desktop users. If you're looking for more general guidance for how to set up Azure NetApp Files and create FSLogix profile containers outside of Windows Virtual Desktop, see the [Set up Azure NetApp Files and create an NFS volume quickstart](../azure-netapp-files/azure-netapp-files-quickstart-set-up-account-create-volumes.md).

>[!NOTE]
>This article doesn't cover best practices for securing access to the Azure NetApp Files share.

## Prerequisites 

-   Windows Virtual Desktop set up and configured
-   [Subscription is enabled for Azure NetApp Files](https://docs.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-register)

## Set up your Azure NetApp Files account

To get started, you need to set up an Azure NetApp Files account.

1. Sign in to the [Azure portal](https://portal.azure.com). Make sure your account has contributor or administrator permissions.

2. Select the **Azure Cloud Shell icon** to the right of the search bar to open Azure Cloud Shell.

   ![A screenshot of the Microsoft Azure toolbar with a red arrow pointing to the Azure Cloud Shell icon to the right of the search bar.](media/42d96dccad38b43b71e915c4300aa8ca.png)

3. Once Azure Cloud Shell is open, select **PowerShell**.

   ![A screenshot of the Azure Cloud Shell welcome page. A red arrow is pointing to the option for opening Azure Cloud Shell with PowerShell.](media/b60565d35de4bcee50820769836d1ee8.png)

4. If this is your first time using Azure Cloud Shell, create a storage account in the same subscription you keep your Azure NetApp Files and Windows Virtual Desktop. <!--Ask for clarification for step 4-->

   ![The storage age with a red arrow pointing at the create storage button.](media/0058ca9f19a387c86319f51d5b4b9562.png)

5. Once Azure Cloud Shell loads, run the following two cmdlets.

   ```powershell
   az account set --subscription <subscriptionID>
   ```

   ```powershell
   az provider register --namespace Microsoft.NetApp --wait
   ```

   ![An image of an Azure Cloud Shell window running the two cmdlets from step 5.](media/3be21e3963ae3ebd7ae051b3d9fa727a.png)

6. In the left side of the window, select **All services**. Enter **Azure NetApp Files** into the search box that appears at the top of the menu.

   ![A screenshot of a user entering "Azure NetApp Files" into the All services search box. The search results show the Azure NetApp Files resource.](media/6546f1ab07c5c0ef0e04b68b5f426472.png)

7. Select **Azure NetApp Files** in the search results, then select **Create**.

8. Select the **Add** button.
9. When the **New NetApp account** blade opens, enter the following values:

    - For **Name**, enter your NetApp account name.
    - For **Subscription**, select the subscription for the storage account you set up in step 4 from the drop-down menu.
    - For **Resource group**, either select an existing resource group from the drop-down menu or create a new one by selecting **Create new**.
    - For **Location**, select the region for your NetApp account from the drop-down menu. This region must be the same region as your session host VMs.

   >[!NOTE]
   >Azure NetApp Files currently doesn't support mounting of a volume across regions.

10. When you're finished, select **Create** to create your NetApp account.

   ![A screenshot of the new NetApp account menu showing the text boxes, drop-down menus, and Create button.](media/55dca1c987220ce419042bd1dfb88b56.png)

   ![A screenshot of the successful deployment screen.](media/516368c855c833539e9b0ee2c8868207.png)

## Create a capacity pool

Next, create a new capacity pool: 

1. Go to the Azure NetApp Files menu and select your new account.
2. In your account menu, select **Capacity pools** under Storage service.
3. Select **Add pool**.
4. When the **New capacity pool** blade opens, enter the following values:

    - For **Name**, enter a name for the new capacity pool.
    - For **Service level**, select your desired value from the drop-down menu. We recommend **Premium** for most environments.
       >[!NOTE]
       >The Premium setting provides the minimum throughput available for a Premium Service level, which is 256 MBps. You may need to adjust this throughput for a production environment. Final throughput is based on the relationship described in [Throughput limits](..\azure-netapp-files\azure-netapp-files-service-levels.md).
    - For **Size (TiB)**, enter the capacity pool size that best fits your needs. The minimum size is 4 TiB.

5. When you're finished, select **OK**.

<!--Break here-->

## Join an Active Directory connection

After that, you need to join an Active Directory connection.

1. Select **Active Directory connections** in the menu on the left side of the page, then select the **Join** button to open the **Join Active Directory** page.

![A screenshot of the Join Active Directory connections menu.](media/03f68f9f13b185c0521d694b1e9e225e.png)

2. Enter the following values in the **Join Active Directory** page to join a connection:

    - For **Primary DNS**, enter the IP address of the DNS server in your environment that can resolve the domain name.
    - For **Domain**, enter your fully qualified domain name (FQDN).
    - For **SMB Server (Computer Account) Prefix**, enter the string you want to append to the computer account name.
    - For **Username**, enter the name of the account with permissions to perform domain join.
    - For **Password**, enter the account's password.

  >[!NOTE]
  >It's best practice to confirm that the computer account you created in [Join an Active Directory connection](create-fslogix-profile-container.md#join-an-active-directory-connection) has appeared in your domain controller under **Computers.**
    ![A screenshot of the Active Directory Users and Computers window with a red arrow pointing at an example account that's appeared in the Computers folder after successful configuration.](media/53e367f2c72d5902bbfa82a1a7dd77ea.png)

<!--Break here-->

## Create a new volume

Next, you'll need to create a new volume.

1. Select **Volumes**, then select **Add volume**.

   ![A screenshot of the capacity pools menu with a red arrow pointing to Volumes under the storage service tab.](media/39f0c687e1cf89fb2448c0470e745418.png)

   ![A screenshot of the volumes menu with a red arrow pointing at the add volume button.](media/3aa9d3d9cd06f12c925e7d3d3dcd9c34.png)

2. When the **Create a volume** blade opens, enter the following values:

    - For **Volume name**, enter a name for the new volume.
    - For **Capacity pool**, select the capacity pool you just created from the drop-down menu.
    - For **Quota (GiB)**, enter the volume size appropriate for your environment.
    - For **Virtual network**, select an existing virtual network that has connectivity to the domain controller from the drop-down menu.
    - Under **Subnet**, select **Create new**. Keep in mind that this subnet will be delegated to Azure NetApp Files.

   ![A screenshot of the Azure NetApp files volume creation menu.](media/b1235bd64cfa165cabfa37a315fcb810.png)

3.  Select **Next: Protocol \>\>** to open the Protocol tab and configure your volume access parameters.

<!--break here-->

## Configure volume access parameters

After you create the volume, configure the volume access parameters.

1.  Select **SMB** as the protocol type.
2.  Under Configuration in the **Active Directory** drop-down menu, select the same directory that you originally connected in [Join an Active Directory connection](create-fslogix-profile-container.md#join-an-active-directory-connection). <!--make a link here--> Keep in mind that there's a limit of one Active Directory per subscription.
3.  In the **Share name** text box, enter the name of the share used by the session host pool and its users.

   ![A screenshot of the Protocol tab. The various parameter settings are labeled one through three based on their corresponding steps.](media/e36a9f45702b4047dbc3f167f7562313.png)

<!--Where should these pictures go to make their relationship with the instructions as clear as possible?-->

4.  Select **Review + create** at the bottom of the page. This opens the validation page. After your volume is validated successfully, select **Create**.

   ![A screenshot of the successful validation screen in the Review + create tab. A red arrow points to the Create button at the bottom left of the screen.](media/32c86e33f19308de496233240fd3c784.png)

5.  At this point, a the new volume will start to deploy. Once deployment is complete, you can use the Azure NetApp Files share.

   ![A screenshot of the deployment complete screen.](media/aeeb1c1d87f00537df93756ab74d181f.png)

6.  To see the mount path, select **Go to resource** and look for it in the Overview tab.

   ![A screenshot of the Overview screen with a red arrow pointing at the mount path.](media/3538527bfdd0d8a76b2ec3ce74f10890.png)

## Configure FSLogix on session host virtual machines (VMs)

This section is based on [Set up a user profile share for a host pool](create-host-pools-user-profile.md).

1. [Download the FSLogix agent .zip file](https://go.microsoft.com/fwlink/?linkid=2084562) while you're still remoted in the session host VM.

2. Unzip the downloaded file.

3. In the file, go to **x64** > **Releases** and run **FSLogixAppsSetup.exe**. The installation menu will open.

   ![A screenshot of the Releases folder. The FSLogixAppSetup.exe file is highlighted.](media/fdb02247f8a528be7f7d63a550f8a10e.png)

4.  If you have a product key, enter it in the Product Key text box. If not, leave the box blank to start a 30 day trial.

5. Select the check box next to **I agree to the license terms and conditions**.

6. Select **Install**.

7. Navigate to **C:\\Program Files\\FSLogix\\Apps** to confirm the agent installed.

   ![A screenshot of the Apps folder with the installed FSLogix files inside of it.](media/32f561f6e923afc899019cc9657732f9.png)

8. From the Start menu, run **RegEdit** as administrator.

9. Navigate to **Computer\\HKEY_LOCAL_MACHINE\\software\\FSLogix**.

   ![A screenshot of the FSLogix folder in the Registry Editor](media/07dcb4497a96f1b8c111a88071ecf34d.png)

10. Create a key named **Profiles**.

   ![The user right-clicks the FSLogix folder in the Registry Editor file directory, then selects New in the drop-down menu, and then selects Key.](media/56af5129fe452d55356d6c1817c29f07.png)

11.  Create a value named **Enabled** with a **REG_DWORD** type set to a data value of **1**.

![A screenshot of the Profiles folder with the (Default) and Enabled values inside of it. The Enabled value is selected.](media/bf055352db16c62a97abf335c45861ee.png)

1.  Create a value named **VHDLocations** with a **Multi-String** type and set its data value to the URI for the Azure Files share.

   ![A screenshot of the Profiles folder with the VHDLocations value inside of it. The VHDLocations value is selected.](media/a420934cc18803242679cb8de863d767.png)

## Assign users to session host

1. Open **PowerShell ISE** as administrator and sign in to Windows Virtual Desktop.

2. Run the following cmdlets:

   ```powershell
   Import-Module Microsoft.RdInfra.RdPowershell
   # (Optional) Install-Module Microsoft.RdInfra.RdPowershell
   $brokerurl = "https://rdbroker.wvd.microsoft.com"
   Add-RdsAccount -DeploymentUrl $brokerurl
   ```

3. When prompted for credentials, enter the credentials for the user with the Tenant Creator or RDS Owner/RDS Contributor roles on the Windows Virtual Desktop tenant.

4. Run the following cmdlets to assign a user to a Remote Desktop group:

   ```powershell
   $tenant = "<your-wvd-tenant>"
   $pool1 = "<wvd-pool>"
   $appgroup = "Desktop Application Group"
   $user1 = "<user-principal>"
   Add-RdsAppGroupUser $tenant $pool1 $appgroup $user1
   ```

## Verify profile user connectivity and access to Azure NetApp File share

1. Open your internet browser of choice.

2. Navigate to <https://rdweb.wvd.microsoft.com/webclient/index.html>.

3. Sign in with the credentials of a user assigned to the Remote Desktop group.

4. Once you've established the user session, sign in to the Azure portal with an administrative account.

5. Open **Azure NetApp Files**, select your Azure NetApp Files account, and then select **Volumes**. Once the Volumes menu opens, select the corresponding volume.

<!--The corresponding volume for your user session?-->

   ![A screenshot of the NetApp account you set up earlier in the Azure portal with the Volumes button selected.](media/225c51fda15dbbd937616e1f1c302b1e.png)

   ![A screenshot of the Volumes screen in the Azure portal. A red arrow is pointing to the volume you created.](media/85f68f2d847e5238700214d5f33c976a.png)

6. Confirm that the FSLogix profile container is taking up space in the chart under Usage.

   ![A screenshot of the resource group's overview page. A red arrow is pointing to the current volume logical size indicator under usage, which says that the volume is using 0.3% of 268.79 MIB of space.](media/3a10923cb3b8ae93381c88daf1965a0f.png)

7. Connect directly to any VM part of the host pool using Remote Desktop and open the **File Explorer.** Then navigate to the **Mount path**
(in the following example, the mount path is \\\\anf-SMB-3863.gt1107.onmicrosoft.com\\anf-VOL).

   Inside that path there will be a folder named `<user SID>-<username>` (replace the bracketed values with the relevant values from your Azure NetApp Files account info). <!--Is this the right profile to use?-->

   ![A screenshot of the folder in the mount path.](media/9b7470e05e517e9bd60c8d6e4d0b08d0.png)

   Within this folder, there should be a profile VHD like the one in the following example.

   ![A screenshot of the contents of the folder in the mount path. Inside is a single VHD file named "Profile_ssbb."](media/a2462ee25312ddfd310b625673360c4e.png)