---
title: What is Azure Virtual Desktop? - Azure
description: An overview of Azure Virtual Desktop.
author: Heidilohr
ms.topic: overview
ms.date: 08/08/2022
ms.author: helohr
manager: femila
---
# What is Azure Virtual Desktop?

Azure Virtual Desktop is a desktop and app virtualization service that runs on the cloud.

Here's what you can do when you run Azure Virtual Desktop on Azure:

- Set up a multi-session Windows 11 or Windows 10 deployment that delivers a full Windows experience with scalability
- Present Microsoft 365 Apps for enterprise and optimize it to run in multi-user virtual scenarios
- Provide Windows 7 virtual desktops with free Extended Security Updates
- Bring your existing Remote Desktop Services (RDS) and Windows Server desktops and apps to any computer
- Virtualize both desktops and apps
- Manage desktops and apps from different Windows and Windows Server operating systems with a unified management experience

> [!IMPORTANT]
> Azure Virtual Desktop extended support for Windows 7 session host VMs ends on January 10, 2023. To see which operating systems are supported, review [Operating systems and licenses](prerequisites.md#operating-systems-and-licenses).

## Introductory video

Learn about Azure Virtual Desktop (formerly Windows Virtual Desktop), why it's unique, and what's new in this video:

> [!VIDEO https://www.youtube.com/embed/NQFtI3JLtaU]

For more videos about Azure Virtual Desktop, see [our playlist](https://www.youtube.com/watch?v=NQFtI3JLtaU&list=PLXtHYVsvn_b8KAKw44YUpghpD6lg-EHev).

## Key capabilities

With Azure Virtual Desktop, you can set up a scalable and flexible environment:

- Create a full desktop virtualization environment in your Azure subscription without running any gateway servers.
- Publish host pools as you need to accommodate your diverse workloads.
- Bring your own image for production workloads or test from the Azure Gallery.
- Reduce costs with pooled, multi-session resources. With the new Windows 11 and Windows 10 Enterprise multi-session capability, exclusive to Azure Virtual Desktop and Remote Desktop Session Host (RDSH) role on Windows Server, you can greatly reduce the number of virtual machines and operating system overhead while still providing the same resources to your users.
- Provide individual ownership through personal (persistent) desktops.
- Use autoscale to automatically increase or decrease capacity based on time of day, specific days of the week, or as demand changes, helping to manage cost.

You can deploy and manage virtual desktops:

- Use the Azure portal, Azure CLI, PowerShell and REST API to configure the host pools, create app groups, assign users, and publish resources.
- Publish full desktop or individual remote apps from a single host pool, create individual app groups for different sets of users, or even assign users to multiple app groups to reduce the number of images.
- As you manage your environment, use built-in delegated access to assign roles and collect diagnostics to understand various configuration or user errors.
- Use the new Diagnostics service to troubleshoot errors.
- Only manage the image and virtual machines, not the infrastructure. You don't need to personally manage the Remote Desktop roles like you do with Remote Desktop Services, just the virtual machines in your Azure subscription.

You can also assign and connect users to your virtual desktops:

- Once assigned, users can launch any Azure Virtual Desktop client to connect to their published Windows desktops and applications. Connect from any device through either a native application on your device or the Azure Virtual Desktop HTML5 web client.
- Securely establish users through reverse connections to the service, so you don't need to open any inbound ports.

You can see a typical architectural setup of Azure Virtual Desktop for the enterprise in our [architecture documentation](/azure/architecture/example-scenario/wvd/windows-virtual-desktop?context=/azure/virtual-desktop/context/context).

## Next steps

Read through the prerequisites for Azure Virtual Desktop before getting started creating a host pool.

> [!div class="nextstepaction"]
> [Prerequisites](prerequisites.md)
