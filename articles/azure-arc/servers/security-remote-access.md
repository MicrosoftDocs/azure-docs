---
title: Remote access
description: Remote access for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Remote access

This article describes the Azure Arc connectivity platform, used for real-time communication between the Azure Connected Machine agent and Azure. It explains the steps to enable connectivity access, including creating and configuring a connectivity endpoint and assigning appropriate RBAC roles and details how to disable remote access.

## Azure Arc connectivity platform

The Azure Arc connectivity platform is a web sockets-based experience to allow real-time communication between the Azure Connected Machine agent and Azure. This enables interactive remote access scenarios to your server without requiring direct line of sight from the management client to the server.

The connectivity platform supports two scenarios:

- SSH access to Azure Arc-enabled servers
- Windows Admin Center for Azure Arc-enabled servers

For both scenarios, the management client (SSH client or web browser) talks to the Azure Arc connectivity service which then relays the information to and from the Azure Connected Machine agent.

Connectivity access is disabled by default. Enabling it is a 3-step process:

1. A connectivity endpoint needs to be created in Azure for the Azure Arc-enabled server. The connectivity endpoint isn’t a real endpoint with an IP address. It’s just a way of saying “Access to this server via Azure is allowed” and provides an API to retrieve the connection details for management clients.

1. Configuration of the connectivity endpoint to allow the specific scenario(s) you intend to use. Having an endpoint created doesn’t allow any traffic through. Instead, you need to configure it to say, “we allow traffic to this local port on the target server.” For SSH, that’s commonly TCP port 22. For WAC, TCP port 6516.

1. Finally, you need to assign the appropriate RBAC roles to the accounts that will use this feature. Remote access to servers requires additional role assignments. Common roles like Azure Connected Machine Resource Administrator, Contributor and Owner do not grant access to use SSH or WAC via the Azure Arc Connectivity Platform. Roles that allow remote access include:

    - Virtual Machine Local User Login (SSH with local credentials)
    - Virtual Machine User Login (SSH with Entra ID, standard user access)
    - Virtual Machine Administrator Login (SSH with Entra ID, full admin access)
    - Windows Admin Center Administrator Login (WAC with Entra ID authentication)

> [!TIP]
> Consider using Microsoft Entra Privileged Identity Management to provide your IT operators with just-in-time access to these roles. This enables a least privilege approach to remote access.
> 

There is a local agent configuration control as well to block remote access, regardless of the configuration in Azure.

## Disabling remote access

To disable all remote access to your machine, run the following command on each machine:

`azcmagent config set incomingconnections.enabled false`

## SSH access to Azure Arc-enabled servers

SSH access via the Azure Arc connectivity platform can help you avoid opening SSH ports directly through a firewall or requiring your IT operators to use a VPN. It also allows you to grant access to Linux servers using Entra IDs and Azure RBAC, reducing the management overhead of distributing and protecting SSH keys.

When a user connects using SSH and Entra ID authentication, a temporary account is created on the server to manage it on their behalf. The account is named after the user’s UPN in Azure to help you audit actions taken on the machine. If the user has the “Virtual Machine Administrator Login” role, the temporary account will be created as a member of the sudoers group so that it can elevate to perform administrative tasks on the server. Otherwise, the account is just a standard user on the machine. If you change the role assignment from user to administrator or vice versa, it can take up to 10 minutes for the change to take effect. Users will need to disconnect any active SSH sessions and reconnect to see the changes reflected on the local user account.

When a user connects using local credentials (SSH key or password), they get the permissions and group memberships of the account information they provided.

## Windows Admin Center

WAC in the Azure Portal allows Windows users to see and manage their Windows Server without connecting over Remote Desktop Connection. The “Windows Admin Center Administrator Login” role is required  to use the WAC experience in the Azure Portal. When the user opens the WAC experience, a virtual account is created on the Windows Server using the UPN of the Azure user to identify them. This virtual account is a member of the administrators group and can make changes to the system. Actions the user takes in WAC are then executed locally on the server using this virtual account.

Interactive access to the machine with the PowerShell or Remote Desktop experiences in WAC do not currently support Entra ID authentication and will prompt the user to provide local user credentials. These credentials are not stored in Azure and are only used to establish the PowerShell or Remote Desktop session.

