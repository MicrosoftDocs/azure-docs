---
title: Configuration and remote access
description: Configuration and remote access for Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Configuration and remote access

This article describes the basics of Azure Machine Configuration, a compliance reporting and configuration tool that can check and optionally remediate security and other settings on machines at scale. This article also describes the Azure Arc connectivity platform, used for communication between the Azure Connected Machine agent and Azure.

## Machine configuration basics

Azure Machine Configuration is a PowerShell Desired State Configuration-based compliance reporting and configuration tool. It can help you check security and other settings on your machines at-scale and optionally remediate them if they drift from the approved state. Microsoft provides its own built-in Machine Configuration policies for your use, or you can author your own policies to check any condition on your machine.

Machine Configuration policies run in the Local System context on Windows or root on Linux, and therefore can access any system settings or resources. You should review which accounts in your organization have permission to assign Azure Policies or Azure Guest Assignments (the Azure resource representing a machine configuration) and ensure all those accounts are trusted.

### Disabling the machine configuration agent

If you don’t intend to use machine configuration policies, you can disable the machine configuration agent with the following command (run locally on each machine):

`azcmagent config set guestconfiguration.enabled false`

## Agent modes

The Azure Connected Machine agent has two possible modes:

- **Full mode**, the default mode which allows all use of agent functionality.

- **Monitor mode**, which applies a Microsoft-managed extension allowlist, disables remote connectivity, and disables the machine configuration agent.

If you’re using Arc solely for monitoring purposes, setting the agent to Monitor mode makes it easy to restrict the agent to just the functionality required to use Azure Monitor. You can configure the agent mode with the following command (run locally on each machine):

`azcmagent config set config.mode monitor`

## Azure Arc connectivity platform

The Azure Arc connectivity platform is a web sockets-based experience to allow real-time communication between the Azure Connected Machine agent and Azure. This enables interactive remote access scenarios to your server without requiring direct line of sight from the management client to the server.

The connectivity platform supports two scenarios:

- SSH access to Azure Arc-enabled servers
- Windows Admin Center for Azure Arc-enabled servers

For both scenarios, the management client (SSH client or web browser) talks to the Azure Arc connectivity service that then relays the information to and from the Azure Connected Machine agent.

Connectivity access is disabled by default and is enabled using a three step process:

1. Create a connectivity endpoint in Azure for the Azure Arc-enabled server. The connectivity endpoint isn’t a real endpoint with an IP address. It’s just a way of saying that access to this server via Azure is allowed and provides an API to retrieve the connection details for management clients.

1. Configure the connectivity endpoint to allow your specific intended scenarios. Having an endpoint created doesn’t allow any traffic through. Instead, you need to configure it to say, “we allow traffic to this local port on the target server.” For SSH, that’s commonly TCP port 22. For WAC, TCP port 6516.

1. Assign the appropriate RBAC roles to the accounts that will use this feature. Remote access to servers requires other role assignments. Common roles like Azure Connected Machine Resource Administrator, Contributor, and Owner don't grant access to use SSH or WAC via the Azure Arc Connectivity Platform. Roles that allow remote access include:

    - Virtual Machine Local User Login (SSH with local credentials)
    - Virtual Machine User Login (SSH with Microsoft Entra ID, standard user access)
    - Virtual Machine Administrator Login (SSH with Microsoft Entra ID, full admin access)
    - Windows Admin Center Administrator Login (WAC with Microsoft Entra ID authentication)

> [!TIP]
> Consider using Microsoft Entra Privileged Identity Management to provide your IT operators with just-in-time access to these roles. This enables a least privilege approach to remote access.
> 

There's a local agent configuration control as well to block remote access, regardless of the configuration in Azure.

## Disabling remote access

To disable all remote access to your machine, run the following command on each machine:

`azcmagent config set incomingconnections.enabled false`

## SSH access to Azure Arc-enabled servers

SSH access via the Azure Arc connectivity platform can help you avoid opening SSH ports directly through a firewall or requiring your IT operators to use a VPN. It also allows you to grant access to Linux servers using Entra IDs and Azure RBAC, reducing the management overhead of distributing and protecting SSH keys.

When a user connects using SSH and Microsoft Entra ID authentication, a temporary account is created on the server to manage it on their behalf. The account is named after the user’s UPN in Azure to help you audit actions taken on the machine. If the user has the "Virtual Machine Administrator Login" role, the temporary account is created as a member of the sudoers group so that it can elevate to perform administrative tasks on the server. Otherwise, the account is just a standard user on the machine. If you change the role assignment from user to administrator or vice versa, it can take up to 10 minutes for the change to take effect. Users must disconnect any active SSH sessions and reconnect to see the changes reflected on the local user account.

When a user connects using local credentials (SSH key or password), they get the permissions and group memberships of the account information they provided.

## Windows Admin Center

WAC in the Azure portal allows Windows users to see and manage their Windows Server without connecting over Remote Desktop Connection. The “Windows Admin Center Administrator Login” role is required  to use the WAC experience in the Azure portal. When the user opens the WAC experience, a virtual account is created on the Windows Server using the UPN of the Azure user to identify them. This virtual account is a member of the administrators group and can make changes to the system. Actions the user takes in WAC are then executed locally on the server using this virtual account.

Interactive access to the machine with the PowerShell or Remote Desktop experiences in WAC don't currently support Microsoft Entra ID authentication and will prompt the user to provide local user credentials. These credentials aren't stored in Azure and are only used to establish the PowerShell or Remote Desktop session.
