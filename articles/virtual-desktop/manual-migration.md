---
title: Migrate manually from Windows Virtual Desktop (classic) - Azure
description: How to migrate manually from Windows Virtual Desktop (classic) to Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 09/04/2020
ms.author: helohr
manager: lizross
---
# Migrate manually from Windows Virtual Desktop (classic)

Windows Virtual Desktop (classic) creates its service environment with PowerShell cmdlets, REST APIs, and service objects. An "object" in a Windows Virtual Desktop service environment is a thing that Windows Virtual Desktop creates. Service objects include tenants, host pools, application groups, and session hosts.

However, Windows Virtual Desktop (classic) isn't integrated with Azure. Without Azure integration, any objects you create aren't automatically managed by the Azure portal because they're not connected to your Azure subscription.

The later version of Windows Virtual Desktop marks a shift in the service towards full Azure integration. Objects you create in Windows Virtual Desktop are automatically managed by the Azure portal.

In this article, we'll explain why you should consider migrating to the latest version of Windows Virtual Desktop. We'll also give you a brief walkthrough of how to migrate from Windows Virtual Desktop (classic) to the later version.

## Why migrate?

Major updates can be inconvenient, especially ones you have to do manually. However, there are some reasons why you can't automatically migrate:

- Existing service objects made with the classic release don't have any representation in Azure. Their scope doesn't extend beyond the Windows Virtual Desktop service.
- When Windows Virtual Desktop became a first-party Azure service, the application ID changed. You won't be able to create new Azure objects with Windows Virtual Desktop unless they're authenticated with the new application ID.

Despite the hassle, migrating away from the classic version is still important. Here's what you'll be able to do after you migrate:

- Manage Windows Virtual Desktop through the Azure Portal.
- Assign Azure Active Directory (AD) user groups to application groups.
- Use the improved Log Analytics feature to troubleshoot your deployment.
- Use Azure-native Role-Based Access Controls to manage administrative access.

## When should I migrate?

There are a few scenarios in particular where we recommend you migrate:

- You have a test host pool setup with a small number of users.
- You have a production host pool setup with a small number of users, but plan to eventually ramp up to hundreds of users.
- You have a simple setup that can be easily replicated. For example, if your VMs use a gallery image.

> [!NOTE]
> If you're using an advanced configuration that took a long time to stabilize or have a lot of users, you would benefit from the automation tool.

## Prepare for migration

Before you start the migration, make sure you have the following prepared:

- An Azure subscription where you’ll create new Azure service objects
- You need to be assigned the Contributor role to create Azure objects on your subscription, and the User Access Administrator role to assign users to application groups.

## Migrate manually from classic to the current update of the service

1.	Create all high-level objects using the Azure portal by following the instructions in [Create a host pool with the Azure portal](create-host-pools-azure-marketplace.md).
2.	If you want to repurpose the virtual machines you currently use, you can manually register them to the newly created host pool by following the instructions in [Register the virtual machines to the Windows Virtual Desktop host pool](create-host-pools-powershell.md#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool).
3.	Create new RemoteApp app groups.
4.	Publish users or user groups to the new desktop and RemoteApp app groups.
To avoid or minimize downtime, register existing session hosts in small increments to the ARM-integrated host pools and slowly migrate users over to the new ARM-integrated app groups.
