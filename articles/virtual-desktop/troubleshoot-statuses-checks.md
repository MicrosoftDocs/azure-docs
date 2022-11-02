---
title: Azure Virtual Desktop session host statuses and health checks
description: How to troubleshoot the failed session host statuses and failed health checks
author: jakejohnson-21
ms.topic: troubleshooting
ms.date: 10/18/2022
ms.author: jakejohnson
manager: rkiran
---
# Azure Virtual Desktop session host statuses and health checks

The Azure Virtual Desktop Agent regularly runs health checks on the session host. The agent assigns these health checks various statuses that include descriptions of how to fix common issues. This article will tell you what each status means and how to act on them during a health check.

## Session host statuses

The following table lists all statuses for session hosts in the Azure portal each potential status. *Available* is considered the ideal default status. Any other statuses represent potential issues that you need to take care of to ensure the service works properly.

>[!NOTE]
>If an issue is listed as "non-fatal," the service can still run with the issue active. However, we recommend you resolve the issue as soon as possible to prevent future issues. If an issue is listed as "fatal," then it will prevent the service from running. You must resolve all fatal issues to make sure your users can access the session host.

| Session host status | Description | How to resolve related issues |
|---------------------|:------:|:------:|  
|Available| This status means that the session host passed all health checks and is available to accept user connections. If a session host has reached its maximum session limit but has passed health checks, it will still be listed as “Available." |N/A| 
|Needs Assistance|The session host didn't pass one or more of the following non-fatal health checks: the Geneva Monitoring Agent health check, the Azure Instance Metadata Service (IMDS) health check, or the URL health check. You can find which health checks have failed in the session hosts detailed view in the Azure portal. |Follow the directions in [Error: VMs are stuck in "Needs Assistance" state](#error-vms-are-stuck-in-the-needs-assistance-state) to resolve the issue.|  
|Shutdown| The session host has been shut down. If the agent enters a shutdown state before connecting to the broker, its status will change to *Unavailable*. If you've shut down your session host and see an *Unavailable* status, that means the session host shut down before it could update the status, and doesn't indicate an issue. You should use this status with the [VM instance view API](/rest/api/compute/virtual-machines/instance-view?tabs=HTTP#virtualmachineinstanceview) to determine the power state of the VM. |Turn on the session host. | 
|Unavailable| The session host is either turned off or hasn't passed fatal health checks, which prevents user sessions from connecting to this session host. |If the session host is off, turn it back on. If the session host didn't pass the domain join check or side-by-side stack listener health checks, refer to the table in [Health check](#health-check) for ways to resolve the issue. If the status is still "Unavailable" after following those directions, open a support case.|
|Upgrade Failed| This status means that the Azure Virtual Desktop Agent couldn't update or upgrade. This doesn't affect new nor existing user sessions. |Follow the instructions in the [Azure Virtual Desktop Agent troubleshooting article](troubleshoot-agent.md).| 
|Upgrading| This status means that the agent upgrade is in progress. This status will be updated to “Available” once the upgrade is done and the session host can accept connections again.|If your session host has been stuck in the "Upgrading" state, then [reinstall the agent](troubleshoot-agent.md#error-session-host-vms-are-stuck-in-unavailable-or-upgrading-state).|

## Health check

The health check is a test run by the agent on the session host. The following table lists each type of health check and describes what it does.

| Health check name | Description | What happens if the session host doesn't pass the check |
|---------------------|:------:|:------:|  
| Domain joined | Verifies that the session host is joined to a domain controller. | If this check fails, users won't be able to connect to the session host. To solve this issue, join your session host to a domain. | 
| Geneva Monitoring Agent | Verifies that the session host has a healthy monitoring agent by checking if the monitoring agent is installed and running in the expected registry location. | If this check fails, it's semi-fatal. There may be successful connections, but they'll contain no logging information. To resolve this, make sure a monitoring agent is installed. If it's already installed, contact Microsoft support. | 
| Integrated Maintenance Data System (IMDS) reachable | Verifies that the service can't access the IMDS endpoint. | If this check fails, it's semi-fatal. There may be successful connections, but they won't contain logging information. To resolve this issue, you'll need to reconfigure your networking, firewall, or proxy settings. |
| Side-by-side (SxS) Stack Listener | Verifies that the side-by-side stack is up and running, listening, and ready to receive connections. | If this check fails, it's fatal, and users won't be able to connect to the session host. Try restarting your virtual machine (VM). If this doesn’t work, contact Microsoft support. |
| UrlsAccessibleCheck | Verifies that the required Azure Virtual Desktop service and Geneva URLs are reachable from the session host, including the RdTokenUri, RdBrokerURI, RdDiagnosticsUri, and storage blob URLs for Geneva agent monitoring. | If this check fails, it isn't always fatal. Connections may succeed, but if certain URLs are inaccessible, the agent can't apply updates or log diagnostic information. To resolve this, follow the directions in [Error: VMs are stuck in the Needs Assistance state](#error-vms-are-stuck-in-the-needs-assistance-state). |

## Error: VMs are stuck in the "Needs Assistance" state

If the session host doesn't pass the *UrlsAccessibleCheck* health check, you'll need to identify which [required URL](safe-url-list.md) your deployment is currently blocking. Once you know which URL is blocked, identify which setting is blocking that URL and remove it.

There are two reasons why the service is blocking a required URL:

- You have an active firewall that's blocking most outbound traffic and access to the required URLs.
- Your local hosts file is blocking the required websites.

To resolve a firewall-related issue, add a rule that allows outbound connections to the TCP port 80/443 associated with the blocked URLs.

If your local hosts file is blocking the required URLs, make sure none of the required URLs are in the **Hosts** file on your device. You can find the Hosts file location at the following registry key and value:

**Key:** HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters

**Type:** REG_EXPAND_SZ

**Name:** DataBasePath

If the session host doesn't pass the *MetaDataServiceCheck* health check, then the service can't access the IMDS endpoint. To resolve this issue, you'll need to do the following things:

- Reconfigure your networking, firewall, or proxy settings to unblock the IP address 169.254.169.254.
- Make sure your HTTP clients bypass web proxies within the VM when querying IMDS. We recommend that you allow the required IP address in any firewall policies within the VM that deal with outbound network traffic direction.

If your issue is caused by a web proxy, add an exception for 169.254.169.254 in the web proxy's configuration. To add this exception, open an elevated Command Prompt or PowerShell session and run the following command:

```cmd
netsh winhttp set proxy proxy-server="http=<customerwebproxyhere>" bypass-list="169.254.169.254"
```

## Next steps

- For an overview on troubleshooting Azure Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating an Azure Virtual Desktop environment and host pool in an Azure Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Azure Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues related to the Azure Virtual Desktop agent or session connectivity, see [Troubleshoot common Azure Virtual Desktop Agent issues](troubleshoot-agent.md).
- To troubleshoot issues when using PowerShell with Azure Virtual Desktop, see [Azure Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
