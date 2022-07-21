---
title: SSH authentication with Azure Active Directory
description: Architectural guidance on achieving SSH integration with Azure Active Directory   
services: active-directory
author: janicericketts
manager: martinco

ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 06/22/2022
ms.author: jricketts
ms.reviewer: ajburnle
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---
# SSH  

Secure Shell (SSH) is a network protocol that provides encryption for operating network services securely over an unsecured network. SSH also provides a command-line sign-in, executes remote commands, and securely transfer files. It's commonly used in Unix-based systems such as Linux®. SSH replaces the Telnet protocol, which doesn't provide encryption in an unsecured network. 

Azure Active Directory (Azure AD) provides a Virtual Machine (VM) extension for Linux®-based systems running on Azure, and a client extension that integrates with [Azure CLI](/cli/azure/) and the OpenSSH client.

## Use when 

* Working with Linux®-based VMs that require remote sign-in

* Executing remote commands in Linux®-based systems

* Securely transfer files in an unsecured network

![diagram of Azure AD with SSH protocol](./media/authentication-patterns/ssh-auth.png)

## Components of system 

* **User**: Starts Azure CLI and SSH client to set up a connection with the Linux® VMs and provides credentials for authentication.

* **Azure CLI**: The component that the user interacts with to initiate their session with Azure AD, request short-lived OpenSSH user certificates from Azure AD, and initiate the SSH session.

* **Web browser**: The component that the user interacts with to authenticate their Azure CLI session. It communicates with the Identity Provider (Azure AD) to securely authenticate and authorize the user.

* **OpenSSH Client**: This client is used by Azure CLI, or (optionally) directly by the end user, to initiate a connection to the Linux VM.

* **Azure AD**: Authenticates the identity of the user and issues short-lived OpenSSH user certificates to their Azure CLI client.

* **Linux VM**: Accepts OpenSSH user certificate and provides successful connection.

## Implement SSH with Azure AD 

* [Log in to a Linux® VM with Azure Active Directory credentials - Azure Virtual Machines ](../devices/howto-vm-sign-in-azure-ad-linux.md) 
