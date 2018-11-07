---
title: Windows Virtual Desktop environment guidelines
description: How to set up a Windows Virtual Desktop environment.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: overview
ms.date: 10/25/2018
ms.author: helohr
---
# Windows Virtual Desktop environment guidelines

Windows Virtual Desktop is a multi-tenant environment where infrastructure roles are deployed as PaaS services. The infrastructure consists of the following roles:

* **RD Broker** is the centerpiece of Remote Desktop Services deployment, as it communicates with the database where all deployment-related configurations take place, including role configurations, user assignments, and session host health.
* **RD Diagnostics** is an event-based aggregator that marks each user action on the RDS deployment (end-user or administrator) as a success or failure. Later on, administrators can query the aggregation of events to identify failing components.
* **RD Gateway** securely connects users to their sessions over the Internet. Besides the session hosts themselves, RD Gateway is the only other role used throughout the lifespan of a session.
* **RD Web** lists the apps and resources assigned to users. RD clients query the RD Web to find which apps users have been assigned and then launch those apps in the client itself. RD Web has built-in caching capabilities to reduce the chance of throttling the RD Broker and the database.

Following these guidelines will lead to successful Windows Virtual Desktop deployment. Take note of the following items as they are outputted to you, as you will need these for Remote Desktop tenant deployment:

* RD Broker URL
* RD Diagnostics URL
* RD Gateway URL
* RD Web URL
* Admin UPN

For a visual outline of how to set up and run a Windows Virtual Desktop environment, download the [Windows Virtual Desktop planning poster](https://docs.microsoft.com/windows-server/remote/remote-desktop-services/rds-poster).

## Tenants

The Remote Desktop Services modern infrastructure enables a multi-tenant infrastructure to be deployed as Azure App Services that manage connections from RD clients to multiple isolated RD tenant environments. Each RD tenant environment consists of one or more host pools, which in turn contain one or more identical session hosts. The session hosts are virtual machines running one of the following operating systems: Windows Server 2012 R2, Windows Server 2016, or Windows 10 RS4.

Each session host must have an Windows Virtual Desktop host agent installed and registered with Windows Virtual Desktop. A protocol stack must also be installed on the session host to support connections from the session host to the Windows Virtual Desktop deployment. This is referred to as “reverse-connect” and eliminates the need for inbound ports to be opened to the RD tenant environment. (The opposite of this is referred to as “forward-connect” and requires an inbound 3389 port to be opened to the RD tenant environment.)

Each host pool may have one or more app groups. An app group is a logical grouping of the applications that are installed on the session hosts in the host pool. There are two types of app groups, desktop and RemoteApp. A desktop app group is used to publish the full desktop and provide access to all the apps installed on the session hosts in the host pool. A RemoteApp app group is used to publish one or more RemoteApps which display on the RD client as the application window on the local RD client desktop.

Use the guide in this section to set up a tenant environment that lets end users connect to published apps and desktops using Remote Desktop clients. In case of connection issues, your tenant admin can use the newly introduced diagnostics role service to identify the root cause.

## End-users

You can connect to a Windows Virtual Desktop deployment using either a Windows client or the new web client. This document covers the details of these two clients and the validations steps for each.

Before starting, confirm with the administrator of the deployment that your user account is set up and has access to some published apps or desktops. Some of the validation steps below expect Microsoft Office to be available.