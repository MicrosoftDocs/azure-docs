---
title: SSH authentication with Azure Active Directory
description: Get architectural guidance on achieving SSH integration with Azure Active Directory.   
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
# SSH authentication with Azure Active Directory  

Secure Shell (SSH) is a network protocol that provides encryption for operating network services securely over an unsecured network. It's commonly used in systems like Unix and Linux. SSH replaces the Telnet protocol, which doesn't provide encryption in an unsecured network. 

Azure Active Directory (Azure AD) provides a virtual machine (VM) extension for Linux-based systems that run on Azure. It also provides a client extension that integrates with the [Azure CLI](/cli/azure/) and the OpenSSH client.

You can use SSH authentication with Active Directory when you're:

* Working with Linux-based VMs that require remote command-line sign-in.

* Running remote commands in Linux-based systems.

* Securely transferring files in an unsecured network.

## Components of the system 

The following diagram shows the process of SSH authentication with Azure AD: 

![Diagram of Azure AD with the SSH protocol.](./media/authentication-patterns/ssh-auth.png)

The system includes the following components:

* **User**: The user starts the Azure CLI and the SSH client to set up a connection with the Linux VMs. The user also provides credentials for authentication.

* **Azure CLI**: The user interacts with the Azure CLI to start a session with Azure AD, request short-lived OpenSSH user certificates from Azure AD, and start the SSH session.

* **Web browser**: The user opens a browser to authenticate the Azure CLI session. The browser communicates with the identity provider (Azure AD) to securely authenticate and authorize the user.

* **OpenSSH client**: The Azure CLI (or the user) uses the OpenSSH client to start a connection to the Linux VM.

* **Azure AD**: Azure AD authenticates the identity of the user and issues short-lived OpenSSH user certificates to the Azure CLI client.

* **Linux VM**: The Linux VM accepts the OpenSSH user certificate and provides a successful connection.

## Next steps

* To implement SSH with Azure AD, see [Log in to a Linux VM by using Azure AD credentials](../devices/howto-vm-sign-in-azure-ad-linux.md). 
