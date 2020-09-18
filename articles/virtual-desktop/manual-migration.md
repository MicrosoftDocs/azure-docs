---
title: Migrate manually from Windows Virtual Desktop (classic) - Azure
description: How to migrate manually from Windows Virtual Desktop (classic) to Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 09/11/2020
ms.author: helohr
manager: lizross
---
# Migrate manually from Windows Virtual Desktop (classic)

Windows Virtual Desktop (classic) creates its service environment with PowerShell cmdlets, REST APIs, and service objects. An "object" in a Windows Virtual Desktop service environment is a thing that Windows Virtual Desktop creates. Service objects include tenants, host pools, application groups, and session hosts.

However, Windows Virtual Desktop (classic) isn't integrated with Azure. Without Azure integration, any objects you create aren't automatically managed by the Azure portal because they're not connected to your Azure subscription.

The recent major update of Windows Virtual Desktop marks a shift in the service towards full Azure integration. Objects you create in Windows Virtual Desktop are automatically managed by the Azure portal.

In this article, we'll explain why you should consider migrating to the latest version of Windows Virtual Desktop. After that, we'll tell you how to manually migrate from Windows Virtual Desktop (classic) to the latest update of Windows Virtual Desktop.

## Why migrate?

Major updates can be inconvenient, especially ones you have to do manually. However, there are some reasons why you can't automatically migrate:

- Existing service objects made with the classic release don't have any representation in Azure. Their scope doesn't extend beyond the Windows Virtual Desktop service.
- With the latest update, the service's application ID was changed to remove consent for apps the way it did for Windows Virtual Desktop (classic). You won't be able to create new Azure objects with Windows Virtual Desktop unless they're authenticated with the new application ID.

Despite the hassle, migrating away from the classic version is still important. Here's what you can do after you migrate:

- Manage Windows Virtual Desktop through the Azure portal.
- Assign Azure Active Directory (AD) user groups to application groups.
- Use the improved Log Analytics feature to troubleshoot your deployment.
- Use Azure-native Role-Based Access Controls to manage administrative access.

## When should I migrate?

When asking yourself if you should migrate, you should also take into account your deployment's current and future situation.

There are a few scenarios in particular where we recommend you manually migrate:

- You have a test host pool setup with a small number of users.
- You have a production host pool setup with a small number of users, but plan to eventually ramp up to hundreds of users.
- You have a simple setup that can be easily replicated. For example, if your VMs use a gallery image.

> [!IMPORTANT]
> If you're using an advanced configuration that took a long time to stabilize or has a lot of users, we don't recommend manually migrating.

## Prepare for migration

Before you get started, you'll need to make sure your environment is ready to migrate.

Here's what you need to start the migration process:

- An Azure subscription where you’ll create new Azure service objects.
- Make sure you're assigned to the following roles:
    
    - Contributor
    - User Access Administrator
    
    The Contributor role lets you create Azure objects on your subscription, and the User Access Administrator role lets you assign users to application groups.

## How to migrate manually

Now that you've prepared for the migration process, it's time to actually migrate.

To migrate manually from Windows Virtual Desktop (classic) to Windows Virtual Desktop:

1. Follow the instructions in [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md) to create all high-level objects with the Azure portal.
2. If you want to bring over the virtual machines you're already using, follow the instructions in [Register the virtual machines to the Windows Virtual Desktop host pool](create-host-pools-powershell.md#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool) to manually register them to the new host pool you created in step 1.
3. Create new RemoteApp app groups.
4. Publish users or user groups to the new desktop and RemoteApp app groups.
5. Update your Conditional Access policy to allow the new objects by following the instructions in [Set up multi-factor authentication](set-up-mfa.md).

To prevent downtime, you should first register your existing session hosts to the Azure Resource Manager-integrated host pools in small groups at a time. After that, slowly bring your users over to the new Azure Resource Manager-integrated app groups.

## Next steps

Once you've migrated, get to know how Windows Virtual Desktop works by checking out [our tutorials](create-host-pools-azure-marketplace.md). Learn about advanced management capabilities at [Expand an existing host pool](expand-existing-host-pool.md) and [Customize RDP properties](customize-rdp-properties.md).

To learn more about service objects, check out [Windows Virtual Desktop environment](environment-setup.md).
