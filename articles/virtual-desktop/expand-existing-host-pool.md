---
title: Expand existing host pool with new session hosts - Azure
description: How to expand an existing host pool with new session hosts in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 10/09/2020
ms.author: helohr
manager: lizross
---
# Expand an existing host pool with new session hosts

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/expand-existing-host-pool-2019.md).

As you ramp up usage within your host pool, you may need to expand your existing host pool with new session hosts to handle the new load.

This article will tell you how you can expand an existing host pool with new session hosts.

## What you need to expand the host pool

Before you start, make sure you've created a host pool and session host virtual machines (VMs) using one of the following methods:

- [Azure portal](./create-host-pools-azure-marketplace.md)
- [Create a host pool with PowerShell](./create-host-pools-powershell.md)

You'll also need the following information from when you first created the host pool and session host VMs:

- VM size, image, and name prefix
- Domain join administrator credentials
- Virtual network name and subnet name

## Add virtual machines with the Azure portal

To expand your host pool by adding virtual machines:

1. Sign in to the Azure portal.

2. Search for and select **Windows Virtual Desktop**.

3. In the menu on the left side of the screen, select **Host pools**, then select the name of the host pool you want to add virtual machines to.

4. Select **Session hosts** from the menu on the left side of the screen.

5. Select **+Add** to start creating your host pool.

6. Ignore the the Basics tab and instead select the **VM details** tab. Here you can view and edit the details of the virtual machine (VM) you want to add to the host pool.

7. Select the resource group you want to create the VMs under, then select the region. You can choose the current region you're using or a new region.

8. Enter the number of session hosts you want to add to your host pool into **Number of VMs**. For example, if you're expanding your host pool by five hosts, enter **5**.

    >[!NOTE]
    >Although it's possible to edit the image and prefix of the VMs, we don't recommended editing them if you have VMs with different images in the same host pool. Edit the image and prefix only if you plan on removing VMs with older images from the affected host pool.

9. For the **virtual network information**, select the virtual network and subnet to which you want the virtual machines to be joined to. You can select the same virtual network your existing machines currently use or choose a different one that's more suitable to the region you selected in step 7.

10. For the **Administrator account**, enter the Active Directory domain username and password associated with the virtual network you selected. These credentials will be used to join the virtual machines to the virtual network.

      >[!NOTE]
      >Ensure your admin names comply with info given here. And that there is no MFA enabled on the account.

11. Select the **Tag** tab if you have any tags that you want to group the virtual machines with. Otherwise, skip this tab.

12. Select the **Review + Create** tab. Review your choices, and if everything looks fine, select **Create**.

## Next steps

Now that you've expanded your existing host pool, you can sign in to a Windows Virtual Desktop client to test them as part of a user session. You can connect to a session with any of the following clients:

- [Connect with the Windows Desktop client](./connect-windows-7-10.md)
- [Connect with the web client](./connect-web.md)
- [Connect with the Android client](./connect-android.md)
- [Connect with the macOS client](./connect-macos.md)
- [Connect with the iOS client](./connect-ios.md)
