---
title: Check access to required FQDNs and endpoints for Azure Virtual Desktop
description: The Azure Virtual Desktop Agent URL Tool enables you to check that your session host virtual machines can access the required FQDNs and endpoints to ensure Azure Virtual Desktop works as intended.
author: dknappettmsft
ms.topic: how-to
ms.date: 11/21/2023
ms.author: daknappe
---

# Check access to required FQDNs and endpoints for Azure Virtual Desktop

In order to deploy and make Azure Virtual Desktop available to your users, you must allow specific FQDNs and endpoints that your session host virtual machines (VMs) can access them anytime. You can find the list of FQDNs and endpoints in [Required FQDNs and endpoints](required-fqdn-endpoint.md).

Available as part of the Azure Virtual Desktop Agent (*RDAgent*) that is on each session host, the *Azure Virtual Desktop Agent URL Tool* enables you to quickly and easily validate whether your session hosts can access each FQDN and endpoint. If not it can't, the tool lists any required FQDNs and endpoints it can't access so you can unblock them and retest, if needed.

> [!NOTE]
> The Azure Virtual Desktop Agent URL Tool doesn't verify that you've allowed access to wildcard entries we specify for FQDNs, only specific entries within those wildcards that depend on the session host location, so make sure the wildcard entries are allowed before you run the tool.

## Prerequisites

You need the following things to use the Azure Virtual Desktop Agent URL Tool:

- A session host VM.

- Your session host must have .NET 4.6.2 framework installed.

- RDAgent version 1.0.2944.400 or higher on your session host. The executable for the Azure Virtual Desktop Agent URL Tool is `WVDAgentUrlTool.exe` and is included in the same installation folder as the RDAgent, for example `C:\Program Files\Microsoft RDInfra\RDAgent_1.0.2944.1200`.

- The `WVDAgentUrlTool.exe` file must be in the same folder as the `WVDAgentUrlTool.config` file.

## Use the Azure Virtual Desktop Agent URL Tool

To use the Azure Virtual Desktop Agent URL Tool:

1. Open PowerShell as an administrator on a session host.

1. Run the following commands to change the directory to the same folder as the latest RDAgent installed on your session host:

   ```powershell
   $RDAgent = Get-WmiObject -Class Win32_Product | ? Name -eq "Remote Desktop Services Infrastructure Agent" | Sort-Object Version -Descending
   $path = ($RDAgent[0]).InstallSource + "RDAgent_" + ($RDAgent[0]).Version
   
   cd $path
   ```

1. Run the following command to run the Azure Virtual Desktop Agent URL Tool:

   ```powershell
   .\WVDAgentUrlTool.exe
   ```
 
1. Once you run the file, you'll see a list of accessible and inaccessible FQDNs and endpoints.

   For example, the following screenshot shows a scenario where you'd need to unblock two required non-wildcard FQDNs:

   :::image type="content" source="media/check-access-validate-required-fqdn-endpoint/agent-url-tool-inaccessible.png" alt-text="A screenshot of the Azure Virtual Desktop Agent URL Tool showing that some FQDNs are inaccessible.":::

   Here's what the output should look like once you've unblocked all required non-wildcard FQDNs and endpoints:

   :::image type="content" source="media/check-access-validate-required-fqdn-endpoint/agent-url-tool-accessible.png" alt-text="A screenshot of the Azure Virtual Desktop Agent URL Tool showing that all FQDNs and endpoints are accessible.":::

1. You can repeat these steps on your other session host, particularly if they are in a different Azure region or use a different virtual network.

## Next steps

- Review the list of the [Required FQDNs and endpoints for Azure Virtual Desktop](required-fqdn-endpoint.md).

- To learn how to unblock these FQDNs and endpoints in Azure Firewall, see [Use Azure Firewall to protect Azure Virtual Desktop](../firewall/protect-azure-virtual-desktop.md).

- For more information about network connectivity, see [Understanding Azure Virtual Desktop network connectivity](network-connectivity.md)
