---
title: What is Azure Virtual Desktop? - Azure
description: An overview of Azure Virtual Desktop.
author: dknappettmsft
ms.topic: overview
ms.date: 08/04/2023
ms.author: daknappe
---

# What is Azure Virtual Desktop?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud.

Here's what you can do when you run Azure Virtual Desktop on Azure:

- Set up a multi-session Windows 11 or Windows 10 deployment that delivers a full Windows experience with scalability
- Present Microsoft 365 Apps for enterprise and optimize it to run in multi-user virtual scenarios
- Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
- Virtualize both desktops and apps
- Manage desktops and apps from different Windows and Windows Server operating systems with a unified management experience

## Introductory video

Learn about Azure Virtual Desktop (formerly Windows Virtual Desktop), why it's unique, and what's new in this video:

> [!VIDEO https://www.youtube.com/embed/aPEibGMvxZw]

You can find more videos about Azure Virtual Desktop from [Microsoft Mechanics](https://www.youtube.com/@MSFTMechanics/search?query=azure%20virtual%20desktop).

## Key capabilities

With Azure Virtual Desktop, you can set up a scalable and flexible environment:

- Create a full desktop virtualization environment in your Azure subscription without running any gateway servers.
- Publish host pools as you need to accommodate your diverse workloads.
- Bring your own image for production workloads or test from the Azure Gallery.
- Reduce costs with pooled, multi-session resources. With the new Windows 11 and Windows 10 Enterprise multi-session capability, exclusive to Azure Virtual Desktop, or Windows Server, you can greatly reduce the number of virtual machines and operating system overhead while still providing the same resources to your users.
- Provide individual ownership through personal (persistent) desktops.
- Use autoscale to automatically increase or decrease capacity based on time of day, specific days of the week, or as demand changes, helping to manage cost.

You can deploy and manage virtual desktops and applications:

- Use the Azure portal, Azure CLI, PowerShell and REST API to configure the host pools, create application groups, assign users, and publish resources.
- Publish a full desktop or individual applications from a single host pool, create individual application groups for different sets of users, or even assign users to multiple application groups to reduce the number of images.
- As you manage your environment, use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.
- Use the new diagnostics service to troubleshoot errors.
- Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.

Connect users:

- Once assigned, users can launch any Azure Virtual Desktop client to connect to their published Windows desktops and applications. Connect from any device through either a native application on your device or the Azure Virtual Desktop HTML5 web client.
- Securely establish users through reverse connections to the service, so you don't need to open any inbound ports.

## Next steps

Here are some other articles to learn about Azure Virtual Desktop:

- Learn about [terminology used for Azure Virtual Desktop](terminology.md).
- You can see a typical architectural setup of Azure Virtual Desktop for the enterprise in our [architecture documentation](/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=/azure/virtual-desktop/context/context).
- Understand the [prerequisites](prerequisites.md) before you deploy Azure Virtual Desktop.
- When you're ready to try Azure Virtual Desktop, follow our tutorial to [Create and connect to a Windows 11 desktop with Azure Virtual Desktop](tutorial-create-connect-personal-desktop.md), where you can deploy a sample infrastructure.
