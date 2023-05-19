---
title: Azure Virtual Desktop session host statuses and health checks
description: How to troubleshoot the failed session host statuses and failed health checks
author: jakejohnson-21
ms.topic: troubleshooting
ms.date: 05/03/2023
ms.author: jakejohnson
manager: rkiran
---
# Azure Virtual Desktop session host statuses and health checks

The Azure Virtual Desktop Agent regularly runs health checks on the session host. The agent assigns these health checks various statuses that include descriptions of how to fix common issues. This article tells you what each status means and how to act on them during a health check.

## Session host statuses

The following table lists all statuses for session hosts in the Azure portal each potential status. *Available* is considered the ideal default status. Any other statuses represent potential issues that you need to take care of to ensure the service works properly.

>[!NOTE]
>If an issue is listed as "non-fatal," the service can still run with the issue active. However, we recommend you resolve the issue as soon as possible to prevent future issues. If an issue is listed as "fatal," then it prevents the service from running. You must resolve all fatal issues to make sure your users can access the session host.

| Session host status | Description | How to resolve related issues |
|---------------------|------|------|  
|Available| This status means that the session host passed all health checks and is available to accept user connections. If a session host has reached its maximum session limit but has passed health checks, it's still listed as “Available." |N/A| 
|Needs Assistance|The session host didn't pass one or more of the following non-fatal health checks: the Geneva Monitoring Agent health check, the Azure Instance Metadata Service (IMDS) health check, or the URL health check. In this state, users can connect to VMs, but their user experience may degrade. You can find which health checks failed in the Azure portal by going to the **Session hosts** tab and selecting the name of your session host. |Follow the directions in [Error: VMs are stuck in "Needs Assistance" state](troubleshoot-agent.md#error-vms-are-stuck-in-the-needs-assistance-state) to resolve the issue.|  
|Shutdown| The session host has been shut down. If the agent enters a shutdown state before connecting to the broker, its status changes to *Unavailable*. If you've shut down your session host and see an *Unavailable* status, that means the session host shut down before it could update the status, and doesn't indicate an issue. You should use this status with the [VM instance view API](/rest/api/compute/virtual-machines/instance-view?tabs=HTTP#virtualmachineinstanceview) to determine the power state of the VM. |Turn on the session host. | 
|Unavailable| The session host is either turned off or hasn't passed fatal health checks, which prevents user sessions from connecting to this session host. |If the session host is off, turn it back on. If the session host didn't pass the domain join check or side-by-side stack listener health checks, refer to the table in [Health check](#health-check) for ways to resolve the issue. If the status is still "Unavailable" after following those directions, open a support case.|
|Upgrade Failed| This status means that the Azure Virtual Desktop Agent couldn't update or upgrade. This status doesn't affect new nor existing user sessions. |Follow the instructions in the [Azure Virtual Desktop Agent troubleshooting article](troubleshoot-agent.md).| 
|Upgrading| This status means that the agent upgrade is in progress. This status updates to “Available” once the upgrade is done and the session host can accept connections again.|If your session host is stuck in the "Upgrading" state, then [reinstall the agent](troubleshoot-agent.md#error-session-host-vms-are-stuck-in-upgrading-state).|

## Health check

The health check is a test run by the agent on the session host. The following table lists each type of health check and describes what it does.

| Health check name | Description | What happens if the session host doesn't pass the check |
|---------------------|------|------|  
| Domain joined | Verifies that the session host is joined to a domain controller. | If this check fails, users won't be able to connect to the session host. To solve this issue, join your session host to a domain. | 
| Geneva Monitoring Agent | Verifies that the session host has a healthy monitoring agent by checking if the monitoring agent is installed and running in the expected registry location. | If this check fails, it's semi-fatal. There may be successful connections, but they'll contain no logging information. To resolve this issue, make sure a monitoring agent is installed. If it's already installed, contact Microsoft support. | 
| Integrated Maintenance Data System (IMDS) reachable | Verifies that the service can't access the IMDS endpoint. | If this check fails, it's semi-fatal. There may be successful connections, but they won't contain logging information. To resolve this issue, you'll need to reconfigure your networking, firewall, or proxy settings. |
| Side-by-side (SxS) Stack Listener | Verifies that the side-by-side stack is up and running, listening, and ready to receive connections. | If this check fails, it's fatal, and users won't be able to connect to the session host. Try restarting your virtual machine (VM). If restarting doesn't work, contact Microsoft support. |
| UrlsAccessibleCheck | Verifies that the required Azure Virtual Desktop service and Geneva URLs are reachable from the session host, including the RdTokenUri, RdBrokerURI, RdDiagnosticsUri, and storage blob URLs for Geneva agent monitoring. | If this check fails, it isn't always fatal. Connections may succeed, but if certain URLs are inaccessible, the agent can't apply updates or log diagnostic information. To resolve this issue, follow the directions in [Error: VMs are stuck in the Needs Assistance state](troubleshoot-agent.md#error-vms-are-stuck-in-the-needs-assistance-state). |
| TURN (Traversal Using Relay NAT) Relay Access Health Check | When using [RDP Shortpath for public networks](rdp-shortpath.md?tabs=public-networks#how-rdp-shortpath-works) with an indirect connection, TURN uses User Datagram Protocol (UDP) to relay traffic between the client and session host through an intermediate server when direct connection isn't possible. | If this check fails, it's not fatal. Connections revert to the websocket TCP and the session host enters the "Needs assistance" state. To resolve the issue, follow the instructions in [Disable RDP Shortpath on managed and unmanaged windows clients using group policy](configure-rdp-shortpath.md?tabs=public-networks#disable-rdp-shortpath-on-managed-and-unmanaged-windows-clients-using-group-policy). |
| App attach health check | Verifies that the [MSIX app attach](what-is-app-attach.md) service is working as intended during package staging or destaging. | If this check fails, it isn't fatal. However, certain apps stop working for end-users. |
| Domain reachable | Verifies the domain the session host is joined to is still reachable. | If this check fails, it's fatal. The service won't be able to connect if it can't reach the domain. |
| Domain trust check | Verifies the session host isn't experiencing domain trust issues that could prevent authentication when a user connects to a session. | If this check fails, it's fatal. The service won't be able to connect if it can't reach the authentication domain for the session host. |
| FSLogix health check | Verifies the FSLogix service is up and running to make sure user profiles are loading properly in the session. | If this check fails, it's fatal. Even if the connection succeeds, the profile won't load, forcing the user to use a temporary profile instead. |
| Metadata service check | Verifies the metadata service is accessible and returns compute properties. | If this check fails, it isn't fatal. |
| Monitoring agent check | Verifies that the required monitoring agent is running. | If this check fails, it isn't fatal. Connections still work, but the monitoring agent is either missing or running an earlier version. |
| Supported encryption check | Checks the value of the SecurityLayer registration key. | If the key's value is 0, the check fails and is fatal. If the value is 1, the check fails but is non-fatal. |
| Agent provisioning service health check | Verifies the provisioning status of the Azure Virtual Desktop agent installation. | If this check fails, it's fatal. |
| Stack provisioning service health check | Verifies the provisioning status of the Azure Virtual Desktop Stack installation. | If this check fails, it's fatal. |
| Monitoring agent provisioning service health check | Verifies the provisioning status of the Monitoring agent installation | If this check fails, it's fatal. |
| Remote Interactive Logon Right check | Verifies if the Remote Desktop Users user group has permission to sign in through Remote Desktop Services and generates a corresponding health check report. | If this check fails, it's fatal. |

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
