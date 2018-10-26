---
title: Set up Windows Virtual Desktop tenants
description: Describes how to set up Windows Virtual Desktop on the tenant level.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Set up Windows Virtual Desktop tenants

>No longer needed due to TOC reshuffle

Windows Virtual Desktop enables a multi-tenant infrastructure to be deployed as Azure App Services that manage connections from RD clients to multiple isolated RD tenant environments. Each RD tenant environment consists of one or more host pools, which in turn contain one or more identical session hosts. The session hosts are virtual machines that run one of the following operating systems:

* Windows Server 2012 R2
* Windows Server 2016
* Windows 10 RS4

Each session host must have a Windows Virtual Desktop host agent installed and registered with Windows Virtual Desktop. You should also install a protocol stack on the session host to support connections from the session host to the Windows Virtual Desktop deployment. This process is called a “reverse-connect” and eliminates the need for inbound ports to be opened to the RD tenant environment. (The opposite of this is called a “forward-connect” and requires an inbound 3389 port that's open to the RD tenant environment.)

Each host pool has one or more app groups. An app group is a logical grouping of apps currently installed on the session hosts in the host pool. There are two types of app groups: desktop and RemoteApp. A desktop app group publishes the full desktop and provides access to all apps installed on the session hosts in the host pool. A RemoteApp app group publishes one or more RemoteApps that display on the RD client as the application window on the local RD client desktop.

Use the following guides to set up a tenant environment that lets end-users connect to published apps and desktops through Remote Desktop clients. If there are connection issues, your tenant admin can use the newly introduced diagnostics role service to identify what's causing the problem.

To learn how to set up a Windows Virtual Desktop tenant on Azure Active Directory, see [Set up Windows Virtual Desktop tenants in Azure Active Directory](set-up-wvd-tenants-in-ad.md).

To learn how to connect an existing Remote Desktop tenant to Windows Virtual Desktop, see [Connect an existing Remote Desktop tenant environment to a new Windows Virtual Desktop deployment](set-up-wvd-tenants-in-rd.md).