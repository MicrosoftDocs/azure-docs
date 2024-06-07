---
title: Tier 0 security considerations
description: Tier 0 security considerations.
ms.topic: conceptual
ms.date: 06/06/2024
---

# Security considerations for Tier 0 assets

Tier 0 assets such as an Active Directory Domain Controller, Certificate Authority server, or highly sensitive business application server can be connected to Azure Arc with extra care to ensure only the desired management functions and authorized users can manage the servers. These recommendations are not required but are strongly recommended to maintain the security posture of your Tier 0 assets.

## Dedicated Azure subscription

Access to Azure Arc-enabled servers is often determined by the organizational hierarchy to which it belongs in Azure. You should treat any subscription or management group admin as equivalent to a local administrator on Tier 0 assets because they could use their permissions to add new role assignments to the Azure Arc resource. Additionally, policies applied at the subscription or management group level may also have permission to make changes to the server.

To minimize the number of accounts and policies with access to your Tier 0 assets, consider using a dedicated Azure subscription that can be closely monitored and configured with as few persistent administrators as possible. Review Azure policies in any parent management groups to ensure they are aligned with your intent for these servers.

## Disable unnecessary management features

For a Tier 0 asset, you should use the local agent security controls to disable any unused functionality in the agent to prevent any intentional—or accidental—use of those features to make changes to the server. This includes:

- Disabling remote access capabilities
- Setting an extension allowlist for the extensions you intend to use, or disabling the extension manager if you are not using extensions
- Disabling the machine configuration agent if you don’t intend to use machine configuration policies

The following example shows how to lock down the Azure Connected Machine agent for a domain controller that needs to use the Azure Monitor Agent to collect security logs for Microsoft Sentinel and Microsoft Defender for Servers to protect against malware threats:

```
azcmagent config set incomingconnections.enabled false

azcmagent config set guestconfiguration.enabled false

azcmagent config set extensions.allowlist “Microsoft.Azure.Monitor/AzureMonitorWindowsAgent,Microsoft.Azure.AzureDefenderForServers/MDE.Windows”
```

