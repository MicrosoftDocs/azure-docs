---
title: Configure FSLogix profile containers Windows Virtual Desktop - Azure
description: This article describes how to configure an FSLogix profile container in a Windows Virtual Desktop virtual machine.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/31/2020
ms.author: helohr
manager: lizross
---
# Configure an FSLogix profile container

Now it's time to configure the FSLogix profile container. For more details on this process, see [Set up a user profile share for a host pool]().

<!-->This needs a link<--->

## Prerequisites

This article assumes you've followed the instructions in [Prepare Azure Files for an FSLogix profile containers](fslogix-azure-files-setup.md). If you haven't, go to that article and prepare your Azure Files for an FSLogix profile container. If you don't complete that process first, the instructions in this article won't work correctly.

## Configure your profile container

1. Sign in to the session host VM you configured in [Prepare Azure Files for an FSLogix profile containers](fslogix-azure-files-setup.md), then download and install the FSLogix agent.

<!-->This needs a download link<-->

2. Unzip the FSLogix agent file you downloaded and go to **x64** > **Releases**, then open **FSLogixAppsSetup.exe**.

     >[!NOTE]
     > If there are multiple VMs in the host pool the below configuration must be done for each VM.

3. Once the installer launches, select **I agree to the license terms and conditions.** If applicable, provide a new key.

4. Select **Install**.

5. Open **Drive C**, then go to **Program Files** > **FSLogix** > **Apps** to make sure the FSLogix agent was properly installed.

6. Run **Registry Editor** (RegEdit) as an administrator.

7. Navigate to **Computer** > **HKEY_LOCAL_MACHINE** > **software** > **FSLogix**, right-click on **FSLogix**, select **New**, then select **Key**.

8. Create a new key named **Profiles**.

9. Right-click on **Profiles**, select **New**, and select **DWORD (32-bit) Value.** Name the value **Enabled** and set the **Data** value to **1**.

   ![A screenshot of the Profiles key. The REG_DWORD file is highlighted and its Data value is set to 1.](media/dword-value.png)

10. Right-click on **Profiles**, select **New**, and then select **Multi-String Value**. Name the value **VHDLocations** and set enter the URI for the Azure Files share `\\fsprofile.file.core.windows.net\share` as the Data value.

    ![A screenshot of the Profiles key showing the VHDLocations file. Its Data value shows the URI for the Azure Files share.](media/multi-string-value.png)

## Assign users to session host

1. Run Windows PowerShell as an administrator, then run the following cmdlet to sign in to Windows Virtual Desktop with PowerShell:

   ```powershell
   Import-Module Microsoft.RdInfra.RdPowershell

   #Optional
   Install-Module Microsoft.RdInfra.RdPowershell

   \$brokerurl = "https://rdbroker.wvd.microsoft.com"

   Add-RdsAccount -DeploymentUrl \$brokerurl
   ```

   When prompted for credentials, enter the same user that was granted the Tenant Creator role or RDS Owner/RDS Contributor role on the Windows Virtual Desktop tenant.

2. Run the following cmdlets to assign the user to the remote desktop group:

     ```powershell
     $tenant = "<your-wvd-tenant>"

     $pool1 = "<wvd-pool>"

     $appgroup = "Desktop Application Group"

     $user1 = "<user-principal>"

     Add-RdsAppGroupUser $tenant $pool1 $appgroup $user1
     ```

    Here's an example of what the command will look like:

     ```powershell
     $pool1 = "airlift2020"
     
     $tenant = "airlift2020"
     
     $appgroup = "Desktop Application Group"
     
     $user1 = "debra.berger@airlift2020outlook.onmicrosoft.com"
     
     Add-RdsAppGroupUser $tenant $pool1 $appgroup $user1
     ```

## Verify the profile

Now all you have to do is verify the profile you created exists.

To verify your profile:

1. Open a browser and go to [https://aka.ms/wvdweb](https://aka.ms/wvdweb).

2. Sign in with the user account assigned to the Remote Desktop group.

3. Once the user session has been established, open the Microsoft Azure Portal and sign in with an administrative account.

4. From the sidebar, select **Storage accounts**.

5. Select the storage account you configured as the file share for your session host pool and enabled with Azure AD Domain Services.

6. Select the **Files** icon, then expand your share.

    If everything's set up correctly, you should see a **Directory** named `<user SID>-<username>`.

