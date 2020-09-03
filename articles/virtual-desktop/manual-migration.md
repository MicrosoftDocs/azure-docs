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

However, because Windows Virtual Desktop (classic) isn't automatically Azure integrated, objects you create with the classic release aren't automatically managed by the Azure portal and  aren't connected to your Azure subscription.

The recent updates mark a shift in the Windows Virtual Desktop service towards full Azure integration. Objects created with the latest update are automatically managed by the Azure portal. In the future, all service objects will be integrated with the Azure service and the customer's Azure account.

This article explains benefits and process to migrate to the latest update of Windows Virtual Desktop.

Why migrate?
Major updates can be inconvenient, especially ones you have to do manually, so let’s see why migration couldn’t be done automatically:
•	Existing service objects made with the classic release don't have any representation in Azure. Their scope does not extend beyond the Windows Virtual Desktop service.
•	When the service became a first-party Azure service, the application ID changed. New Azure objects with Windows Virtual Desktop cannot be created, unless authenticated with the new application ID.
Let’s go through why migration from classic is important. Here are some benefits of the latest update to the service:
•	Manage Windows Virtual Desktop through the Azure Portal.
•	Assign Azure Active Directory (AD) user groups to application groups.
•	Use the improved Log Analytics feature to troubleshoot your deployment.
•	Use Azure native Role Based Access Control to manage administrative access.
When to manually migrate?
There are a few scenarios we recommend migrating manually as the migration steps are simple and the upcoming tool is targeted at large scale deployment.
Migrate manually when following applies:

•	You have a test hostpool setup with a small number of users
•	You have a production hostpool setup with a low #users and planning on ramping up to 100s
•	You have a simple setup that can easily be replicated – e.g. VMs use a gallery image, etc.

Note: If you have performed advanced configuration that has taken a long time to stabilize Or if you have lots of users, you can benefit from the automation tool.

Prepare for migration
Before you start the migration, make sure you have the following prepared:
1.	An Azure subscription where you’ll create new Azure service objects
2.	You need to be assigned the Contributor role to create Azure objects on your subscription, and the User Access Administrator role to assign users to application groups.

Migrate manually from classic to the current update of the service
1.	Create all high-level objects using the Azure portal by following the instructions in Create a host pool with the Azure portal.
2.	If you want to repurpose the virtual machines you currently use, you can manually register them to the newly created host pool by following the instructions in Register the virtual machines to the Windows Virtual Desktop host pool.
3.	Create new RemoteApp app groups.
4.	Publish users or user groups to the new desktop and RemoteApp app groups.
To avoid or minimize downtime, register existing session hosts in small increments to the ARM-integrated host pools and slowly migrate users over to the new ARM-integrated app groups.
