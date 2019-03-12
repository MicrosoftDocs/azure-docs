---
title: Windows Virtual Desktop environment (preview)  - Azure
description: The basic elements of a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/21/2019
ms.author: helohr
---
# Windows Virtual Desktop environment (Preview)

Windows Virtual Desktop (preview) is a multi-tenant environment where infrastructure roles are deployed as PaaS services. The infrastructure consists of the following roles:

* **Remote Desktop Broker** is the centerpiece of Remote Desktop Services deployment, as it communicates with the database where all deployment-related configurations take place, including role configurations, user assignments, and session host health.
* **Remote Desktop Diagnostics** is an event-based aggregator that marks each user action on the RDS deployment (end-user or administrator) as a success or failure. Later on, administrators can query the aggregation of events to identify failing components.
* **Remote Desktop Gateway** securely connects users to their sessions over the Internet. Besides the session hosts themselves, Remote Desktop Gateway is the only other role used throughout the lifespan of a session.
* **Remote Desktop Web** lists the apps and resources assigned to users. Remote Desktop clients query the Remote Desktop Web to find which apps users have been assigned and then launch those apps in the client itself. Remote Desktop Web has built-in caching capabilities to reduce the chance of throttling the Remote Desktop Broker and the database.

When deploying Windows Virtual Desktop, take note of the URLs for each role and the admin UPN as they are outputted to you, as you'll need that information for when you start deploying tenants.

## Tenants

Windows Virtual Desktop enables a multi-tenant infrastructure to be deployed as Azure App Services that manage connections from Remote Desktop clients to multiple isolated Remote Desktop tenant environments. Each Remote Desktop tenant environment consists of one or more host pools, which in turn contain one or more identical session hosts. The session hosts are virtual machines running one of the following operating systems: Windows Server 2012 R2, Windows Server 2016, or Windows 10 RS4.

Each session host must have a Windows Virtual Desktop host agent installed and registered with Windows Virtual Desktop. You must also install a protocol stack on the session host to support connections from the session host to the Windows Virtual Desktop deployment. This practice is referred to as “reverse-connect” and eliminates the need for inbound ports to be opened to the Remote Desktop tenant environment. (The opposite is referred to as “forward-connect” and requires an inbound 3389 port to be opened to the Remote Desktop tenant environment.)

Each host pool may have one or more app groups. An app group is a logical grouping of the applications that are installed on the session hosts in the host pool. There are two types of app groups, desktop and RemoteApp. A desktop app group is used to publish the full desktop and provide access to all the apps installed on the session hosts in the host pool. A RemoteApp app group is used to publish one or more RemoteApps that display on the Remote Desktop client as the application window on the local Remote Desktop client desktop.

If Windows Virtual Desktop experiences connection issues, your tenant admin can use the [diagnostics role service](diagnostics-role-service.md) to identify the root cause.

## End users

Once their accounts are set up, users can connect to a Windows Virtual Desktop deployment with either a Windows Virtual Desktop client or the [web client](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/clients/remote-desktop-web-client).

## Next steps

Learn more about infrastructure roles and how to assign roles to users at [Delegated Access in Windows Virtual Desktop](delegated-access-virtual-desktop.md).

To learn how to set up a tenant environment, see [Set up Windows Virtual Desktop tenants in Azure Active Directory](tenant-setup-azure-active-directory.md).

To learn how to connect to Windows Virtual Desktop, see one of the following articles:

* [Connect to the Remote Desktop client on Windows 7 and Windows 10](connect-windows-7-and-10.md)
* [Connect to Microsoft Remote Desktop on macOS](connect-macos.md)
* [Connect to the Windows Virtual Desktop web client](connect-web.md)