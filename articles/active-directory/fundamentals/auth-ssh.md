---
title: SSH authentication with Azure Active Directory
description: Architectural guidance on achieving SSH integration with Azure Active Directory   
services: active-directory
author: BarbaraSelden
manager: daveba

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 10/19/2020
ms.author: baselden
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# SSH  

Secure Shell (SSH) is a network protocol that provides encryption for operating network services securely over an unsecured network. SSH also provides a command-line sign in, executes remote commands, and securely transfer files. It is commonly used in UNIX-based systems such as Linux®. SSH replaces the Telnet protocol, which does not provide encryption in an unsecured network. 

Azure Active Directory (Azure AD) provides a Virtual Machine (VM) extension for Linux®-based systems running on Azure. 

## Use when 

* Working with Linux®-based VMs that require remote sign in

* Executing remote commands in Linux®-based systems

* Securely transfer files in an unsecured network

![diagram of Azure AD with SSH protocol](./media/authentication-patterns/ssh-auth.png)

SSH with Azure AD

## Components of system 

* **User**: Starts SSH client to set up a connection with the Linux® VMs and provides credentials for authentication.

* **Web browser**: The component that the user interacts with. It communicates with the Identity Provider (Azure AD) to securely authenticate and authorize the user.

* **SSH Client**: Drives the connection setup process.

* **Azure AD**: Authenticates the identity of the user using device flow, and issues token to the Linux VMs.

* **Linux VM**: Accepts token and provides successful connection.

## Implement SSH with Azure AD 

* [Log in to a Linux® VM with Azure Active Directory credentials - Azure Virtual Machines ](../../virtual-machines/linux/login-using-aad.md) 

* [OAuth 2.0 device code flow - Microsoft identity platform ](../develop/v2-oauth2-device-code.md)

* [Integrate with Azure Active Directory (akamai.com)](https://learn.akamai.com/en-us/webhelp/enterprise-application-access/enterprise-application-access/GUID-6B16172C-86CC-48E8-B30D-8E678BF3325F.html)

