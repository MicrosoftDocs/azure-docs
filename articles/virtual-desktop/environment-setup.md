---
title: Windows Virtual Desktop environment - Azure
description: The basic elements of a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Windows Virtual Desktop environment (Preview)

Windows Virtual Desktop is a multi-tenant environment where infrastructure roles are deployed as PaaS services. The infrastructure consists of the following roles:

* **RD Broker** is the centerpiece of Remote Desktop Services deployment, as it communicates with the database where all deployment-related configurations take place, including role configurations, user assignments, and session host health.
* **RD Diagnostics** is an event-based aggregator that marks each user action on the RDS deployment (end-user or administrator) as a success or failure. Later on, administrators can query the aggregation of events to identify failing components.
* **RD Gateway** securely connects users to their sessions over the Internet. Besides the session hosts themselves, RD Gateway is the only other role used throughout the lifespan of a session.
* **RD Web** lists the apps and resources assigned to users. RD clients query the RD Web to find which apps users have been assigned and then launch those apps in the client itself. RD Web has built-in caching capabilities to reduce the chance of throttling the RD Broker and the database.

When deploying Windows Virtual Desktop, take note of the URLs for each role and the admin UPN as they are outputted to you, as you'll need that information for when you start deploying tenants.

## Tenants

The Remote Desktop Services modern infrastructure enables a multi-tenant infrastructure to be deployed as Azure App Services that manage connections from RD clients to multiple isolated RD tenant environments. Each RD tenant environment consists of one or more host pools, which in turn contain one or more identical session hosts. The session hosts are virtual machines running one of the following operating systems: Windows Server 2012 R2, Windows Server 2016, or Windows 10 RS4.

Each session host must have an Windows Virtual Desktop host agent installed and registered with Windows Virtual Desktop. A protocol stack must also be installed on the session host to support connections from the session host to the Windows Virtual Desktop deployment. This is referred to as “reverse-connect” and eliminates the need for inbound ports to be opened to the RD tenant environment. (The opposite of this is referred to as “forward-connect” and requires an inbound 3389 port to be opened to the RD tenant environment.)

Each host pool may have one or more app groups. An app group is a logical grouping of the applications that are installed on the session hosts in the host pool. There are two types of app groups, desktop and RemoteApp. A desktop app group is used to publish the full desktop and provide access to all the apps installed on the session hosts in the host pool. A RemoteApp app group is used to publish one or more RemoteApps which display on the RD client as the application window on the local RD client desktop.

In case of connection issues, your tenant admin can use the newly introduced [diagnostics role service](diagnostics-role-service.md) to identify the root cause.

## End users

Once their accounts are set up, users can connect to a Windows Virtual Desktop deployment with either a Windows Virtual Desktop client or the [web client](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).

## Next steps

Learn more about infrastructure roles and how to assign roles to users at [Delegated Access in Windows Virtual Desktop](delegated-access-virtual-desktop.md).

To learn how to set up a tenant environment, see one of the following tutorials:

* [Set up Windows Virtual Desktop tenants in Azure Active Directory](tenant-setup-azure-active-directory.md)
* [Connect to an existing Remote Desktop environment](tenant-setup-remote-desktop.md)

To learn how to connect to Windows Virtual Desktop, see the [Connect to Windows Virtual Desktop](connect.md) tutorial.