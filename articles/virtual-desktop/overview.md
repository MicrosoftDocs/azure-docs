---
title: What is Windows Virtual Desktop? - Azure
description: An overview of Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 10/25/2018
ms.author: helohr
---
# What is Windows Virtual Desktop? (Preview)

Windows Virtual Desktop is a multi-tenant service hosted by Microsoft that manages connections between Remote Desktop clients and isolated Windows Virtual Desktop tenant environments. This service lets users securely access a virtual machine set up by their admin anytime, anywhere, from any computer.

## Key capabilties

As a Remote Desktop service, Windows Virtual Desktop makes it easy for users to access company resources while keeping company hardware secure.

* Easy to access
    * Once a user has access credentials, all they have to do to access Windows Virtual Desktop is sign in at the Windows Virtual Desktop service or the Remote Desktop web client
* App groups allow for flexible remoting solutions based on your needs
    * Use a desktop app group to publish the full desktop and give users access to all apps in the sesion host, or use a RemoteApp app group to let users access specific apps
* Reduce resource requirements and save costs by building a Windows Virtual Desktop environment that requires fewer virtual machines to run
    * Only pay for the resources you actually use; everything else is provided by the Azure service
* Customizable settings and scaling tools let you adjust load balancing across host pools
    * Adjust load based on user demand by setting thresholds where new virtual machines are created after the current virtual machine reaches the specified number of users
    * Reduce costs through Depth mode, where you can assign the maximum number of users to one virtual machine before moving to the next
* Users get a consistent experience across their personal desktops
    * Access to universal and modern apps in a multi-session environment
    * Customize which apps your users can use on their virtual desktop by offering a full desktop experience through a desktop app group or choosing individual apps to display on the client with a RemoteApp group
* Remote Desktop roles are now offered as a complete service on Azure
* Outbound connection from your environment to the Azure service keeps your virtual network secure
* Windows Virtual Desktop environments can be built with a variety of tools that make it easy to integrate into preexisting IT systems
    * These tools include REST APIs, PowerShell cmdlets, the Azure Marketplace tool, and an Azure portal experience for management and deployment

## Prerequisites

You'll need one of the following things to deploy Windows Virtual Desktop:

* An Office 365 and Windows E3 or E6 license
* An Office 365 Business F1 license
* The Azure portal for Windows Virtual Desktop

## How does Windows Virtual Desktop work?

Windows Virtual Desktop is a multi-tenant environment where infrastructure roles are deployed as PaaS services. The infrastructure consists of the following roles:

* **Remote Desktop Broker** is the centerpiece of Remote Desktop Services deployment, as it communicates with the database where all deployment-related configurations take place, including role configurations, user assignments, and session host health.
* **Remote Desktop Diagnostics** is an event-based aggregator that marks each user action on the RDS deployment (end-user or administrator) as a success or failure. Later on, administrators can query the aggregation of events to identify failing components.
* **Remote Desktop Gateway** securely connects users to their sessions over the Internet. Besides the session hosts themselves, Remote Desktop Gateway is the only other role used throughout the lifespan of a session.
* **Remote Desktop Web** lists the apps and resources assigned to users. Remote Desktop clients query the Remote Desktop Web to find which apps users have been assigned and then launch those apps in the client itself. Remote Desktop Web has built-in caching capabilities to reduce the chance of throttling the Remote Desktop Broker and the database.

### Tenants

The Remote Desktop Services modern infrastructure enables a multi-tenant infrastructure to be deployed as Azure App Services that manage connections from Remote Desktop clients to multiple isolated Remote Desktop tenant environments. Each Remote Desktop tenant environment consists of one or more host pools, which in turn contain one or more identical session hosts. The session hosts are virtual machines running one of the following operating systems: Windows Server 2012 R2, Windows Server 2016, or Windows 10 RS4.

Each session host must have an Windows Virtual Desktop host agent installed and registered with Windows Virtual Desktop. A protocol stack must also be installed on the session host to support connections from the session host to the Windows Virtual Desktop deployment. This is referred to as “reverse-connect” and eliminates the need for inbound ports to be opened to the Remote Desktop tenant environment. (The opposite of this is referred to as “forward-connect” and requires an inbound 3389 port to be opened to the Remote Desktop tenant environment.)

Each host pool may have one or more app groups. An app group is a logical grouping of the applications that are installed on the session hosts in the host pool. There are two types of app groups, desktop and RemoteApp. A desktop app group is used to publish the full desktop and provide access to all the apps installed on the session hosts in the host pool. A RemoteApp app group is used to publish one or more RemoteApps which display on the Remote Desktop client as the application window on the local Remote Desktop client desktop.

### End-users

Once their Windows Virtual Desktop accounts are set up, users can connect to a Windows Virtual Desktop deployment with either a Windows client or the Remote Desktop web client.

## Solutions that benefit from Windows Virtual Desktop

* Enterprises already using Microsoft Office 365 ProPlus or plan to drive adoption of Office 365 ProPlus
* Enterprise customers looking for a multi-user solution that gives them the most value for the lowest cost

## Next steps

To learn how to set up a tenant, see either [Set up Windows Virutal Desktop tenants in Active Directory](tenant-setup-azure-active-directory.md) or [Connect Windows Virtual Desktop to a Remote Desktop environment](connect.md).