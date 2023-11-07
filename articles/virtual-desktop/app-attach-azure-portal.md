---
title: Azure Virtual Desktop MSIX app attach portal - Azure
description: How to set up MSIX app attach for Azure Virtual Desktop using the Azure portal.
author: Heidilohr
ms.topic: how-to
ms.date: 01/12/2023
ms.author: helohr
manager: femila
---
# Set up MSIX app attach with the Azure portal

MSIX app attach is an application layering solution that allows you to dynamically attach apps from an MSIX package to a user session. The MSIX package system separates apps from the operating system, making it easier to build images for virtual machines. MSIX packages also give you greater control over which apps your users can access in their virtual machines. You can even separate apps from the custom image and make them available them to users later.

This article will walk you through how to set up MSIX app attach in an Azure Virtual Desktop environment.

Learn more about MSIX app attach at [What is MSIX app attach?](what-is-app-attach.md)

## Requirements

Here's what you need to configure MSIX app attach:

- A functioning Azure Virtual Desktop deployment. To learn how to deploy Azure Virtual Desktop (classic), see [Create a tenant in Azure Virtual Desktop](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md). To learn how to deploy Azure Virtual Desktop with Azure Resource Manager integration, see [Create a host pool with the Azure portal](./create-host-pools-azure-marketplace.md).
- An Azure Virtual Desktop host pool with at least one active session host.
- The MSIX packaging tool.
- An MSIX-packaged application expanded into an MSIX image that's uploaded into a file share.
- A file share in your Azure Virtual Desktop deployment where the MSIX package will be stored.
- [The file share where you uploaded the MSIX image](app-attach-file-share.md) must also be accessible to all virtual machines (VMs) in the host pool. Users will need read-only permissions to access the image.
- All MSIX application packages include a certificate. You're responsible for making sure the certificates for MSIX applications are trusted in your environment.

## Turn off automatic updates for MSIX app attach applications

Before you get started, it is a best practice to disable automatic updates for MSIX app attach applications. To disable automatic updates, you'll need to run the following commands in an elevated command prompt, or you can also deploy the code to the session hosts through Group Policy:

```cmd
rem Disable Store auto update:

reg add HKLM\Software\Policies\Microsoft\WindowsStore /v AutoDownload /t REG_DWORD /d 2 /f
Schtasks /Change /Tn "\Microsoft\Windows\WindowsUpdate\Scheduled Start" /Disable

rem Disable Content Delivery auto download apps that they want to promote to users:

reg add HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager /v PreInstalledAppsEnabled /t REG_DWORD /d 0 /f

reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug /v ContentDeliveryAllowedOverride /t REG_DWORD /d 0x2 /f

```

## Add an MSIX image to the host pool

Next you'll need to add the MSIX image to your host pool.

To add the MSIX image:

1. Open the Azure portal.

2. Enter **Azure Virtual Desktop** into the search bar, then select the service name.

3. Select the host pool where you plan to put the MSIX apps.

4. Select **MSIX packages** to open the data grid with all **MSIX packages** currently added to the
host pool.

5. Select **+ Add** to open the **Add MSIX package** tab.

6. In the **Add MSIX package** tab, enter the following values:

      - For **MSIX image path**, enter a valid UNC path pointing to the MSIX image on the file share. (For example, `\\storageaccount.file.core.windows.net\msixshare\appfolder\MSIXimage.vhd`.) When you're done, select **Add** to interrogate the MSIX container to check if the path is valid.

      - For **MSIX package**, select the relevant MSIX package name from the drop-down menu. This menu will only be populated if you've entered a valid image path in **MSIX image path**.

      - For **Package applications**, make sure the list contains all MSIX applications you want to be available to users in your MSIX package.

      - Optionally, enter a **Display name** if you want your package to have a more user-friendly in your user deployments.

      - Make sure the **Version** has the correct version number.

      - Select the **Registration type** you want to use. Which one you use depends on your needs:

    - **On-demand registration** postpones the full registration of the MSIX application until the user starts the application. This is the registration type we recommend you use.

    - **Log on blocking** only registers while the user is signing in. We don't recommend this type because it can lead to longer sign-in times for users.

7.  For **State**, select your preferred state.
    -  The **Active** status lets users interact with the package.
    -  The **Inactive** status causes Azure Virtual Desktop to ignore the package and not deliver it to users.

8. When you're done, select **Add**.

## Publish MSIX apps to an application group

Next, you'll need to publish the apps to an application group. You'll need to do this for both desktop and RemoteApp application groups.

To publish the apps:

1. In the Azure Virtual Desktop resource provider, select the **Application groups** tab.

2. Select the application group you want to publish the apps to.

   >[!NOTE]
   >MSIX applications can be delivered with MSIX app attach to both RemoteApp and desktop application groups. When a MSIX package is assigned to a RemoteApp application group and Desktop application group from the same host pool the Desktop application group will be displayed in the feed.

3. Once you're in the application group, select the **Applications** tab. The **Applications** grid will display all existing apps within the application group.

4. Select **+ Add** to open the **Add application** tab.

      > [!div class="mx-imgBorder"]
      > ![A screenshot of the user selecting + Add to open the add application tab](media/select-add.png)

5. For **Application source**, choose the source for your application.
    - If you're using a Desktop application group, choose **MSIX package**.
      
      > [!div class="mx-imgBorder"]
      > ![A screenshot of a customer selecting MSIX package from the application source drop-down menu. MSIX package is highlighted in red.](media/select-source.png)
    
    - If you're using a RemoteApp application group, choose one of the following options:
        
        - Start menu
        - App path
        - MSIX package

    - For **Application name**, enter a descriptive name for the application.

    You can also configure the following optional features:
   
    - For **Display name**, enter a new name for the package that your users will see.

    - For **Description**, enter a short description of the app package.

    - If you're using a RemoteApp application group, you can also configure these options:

        - **Icon path**
        - **Icon index**

6. When you're done, select **Save**.

## Assign a user to an application group

After assigning MSIX apps to an application group, you'll need to grant users access to them. You can assign access by adding users or user groups to an application group with published MSIX applications. Follow the instructions in [Manage application groups with the Azure portal](manage-app-groups.md) to assign your users to an application group.

## Change MSIX package state

Next, you'll need to change the MSIX package state to either **Active** or **Inactive**, depending on what you want to do with the package. Active packages are packages your users can interact with once they're published. Inactive packages are ignored by Azure Virtual Desktop, so your users can't interact with the apps inside.

### Change state with the Applications list

To change the package state with the Applications list:

1. Go to your host pool and select **MSIX packages**. You should see a list of all existing MSIX packages within the host pool.

2. Select the MSIX packages whose states you need to change, then select **Change state**.

### Change state with update package

To change the package state with an update package:

1. Go to your host pool and select **MSIX packages**. You should see a list of all existing MSIX packages within the host pool.

2. Select the name of the package whose state you want to change from the MSIX package list. This will open the **Update package** tab.

3. Toggle the **State** switch to either **Inactive** or **Active**, then select **Save.**

## Change MSIX package registration type

To change the package's registration type:

1. Select **MSIX packages**. You should see a list of all existing MSIX packages within the host pool.

2. Select **Package name in** the **MSIX packages grid** this will open the blade to update the package.

3. Toggle the **Registration type** via the **On-demand/Log on blocking** button as desired and select **Save.**

## Remove an MSIX package

To remove an MSIX package from your host pool:

1. Select **MSIX packages**.  You should see a list of all existing MSIX packages within the host pool.

2. Select the ellipsis on the right side the name of the package you want to delete, then select **Remove**.

## Remove MSIX apps

To remove individual MSIX apps from your package:

1. Go to the host pool and select **Application groups**.

2. Select the application group you want to remove MSIX apps from.

3. Open the **Applications** tab.

4. Select the app you want to remove, then select **Remove**.

## Next steps

Ask our community questions about this feature at the [Azure Virtual Desktop TechCommunity](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop).

You can also leave feedback for Azure Virtual Desktop at the [Azure Virtual Desktop feedback hub](https://support.microsoft.com/help/4021566/windows-10-send-feedback-to-microsoft-with-feedback-hub-app).

Here are some other articles you might find helpful:

- [What is MSIX app attach?](what-is-app-attach.md)
- [MSIX app attach FAQ](app-attach-faq.yml)
