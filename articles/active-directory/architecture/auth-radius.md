---
title: RADIUS authentication with Microsoft Entra ID
description: Architectural guidance on achieving RADIUS authentication with Microsoft Entra ID.
services: active-directory
author: janicericketts
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 01/10/2023
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# RADIUS authentication with Microsoft Entra ID

Remote Authentication Dial-In User Service (RADIUS) is a network protocol that secures a network by enabling centralized authentication and authorization of dial-in users. Many applications still rely on the RADIUS protocol to authenticate users.

Microsoft Windows Server has a role called the Network Policy Server (NPS), which can act as a RADIUS server and support RADIUS authentication.

Microsoft Entra ID enables multifactor authentication with RADIUS-based systems. If a customer wants to apply Microsoft Entra multifactor authentication to any of the previously mentioned RADIUS workloads, they can install the Microsoft Entra multifactor authentication NPS extension on their Windows NPS server. 

The Windows NPS server authenticates a user’s credentials against Active Directory, and then sends the multifactor authentication request to Azure. The user then receives a challenge on their mobile authenticator. Once successful, the client application is allowed to connect to the service. 

## Use when: 

You need to add multifactor authentication to applications like
* a Virtual Private Network (VPN)
* WiFi access
* Remote Desktop Gateway (RDG)
* Virtual Desktop Infrastructure (VDI)
* Any others that depend on the RADIUS protocol to authenticate users into the service. 

> [!NOTE]
> Rather than relying on RADIUS and the Microsoft Entra multifactor authentication NPS extension to apply Microsoft Entra multifactor authentication to VPN workloads, we recommend that you upgrade your VPN’s to SAML and directly federate your VPN with Microsoft Entra ID. This gives your VPN the full breadth of Microsoft Entra ID Protection, including Conditional Access, multifactor authentication, device compliance, and Identity Protection.

![architectural diagram](./media/authentication-patterns/radius-auth.png)


## Components of the system 

* **Client application (VPN client)**: Sends authentication request to the RADIUS client.

* **RADIUS client**: Converts requests from client application and sends them to RADIUS server that has the NPS extension installed.

* **RADIUS server**: Connects with Active Directory to perform the primary authentication for the RADIUS request. Upon success, passes the request to Microsoft Entra multifactor authentication NPS extension.

* **NPS extension**: Triggers a request to Microsoft Entra multifactor authentication for a secondary authentication. If successful, NPS extension completes the authentication request by providing the RADIUS server with security tokens that include multifactor authentication claim, issued by Azure’s Security Token Service.

* **Microsoft Entra multifactor authentication**: Communicates with Microsoft Entra ID to retrieve the user’s details and performs a secondary authentication using a verification method configured by the user.

<a name='implementradiuswith-azure-ad'></a>

## Implement RADIUS with Microsoft Entra ID 

* [Provide Microsoft Entra multifactor authentication capabilities using NPS](../authentication/howto-mfa-nps-extension.md) 

* [Configure the Microsoft Entra multifactor authentication NPS extension](../authentication/howto-mfa-nps-extension-advanced.md) 

* [VPN with Microsoft Entra multifactor authentication using the NPS extension](../authentication/howto-mfa-nps-extension-vpn.md) 

  
‎ 
