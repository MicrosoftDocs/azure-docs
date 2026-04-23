---
title: Secure your Azure Network Watcher deployment
description: Learn how to secure Azure Network Watcher, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-network-watcher
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/17/2025
ai-usage: ai-assisted
---

# Secure your Azure Network Watcher deployment

Azure Network Watcher provides monitoring, diagnostics, and traffic logging tools for Azure IaaS resources. It enables you to capture packets, analyze flow logs, diagnose connectivity issues, and inspect network security group rules. Because Network Watcher has broad visibility into your network traffic and configuration, securing its deployment, its data outputs, and the identities that access it is critical. This article provides security recommendations for Azure Network Watcher.

For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Service-specific security

Network Watcher operates as a read-only observer of your network infrastructure. It doesn't modify network resources, but it requires broad read access to virtual networks, network interfaces, network security groups, and associated resources in order to function. Because it collects sensitive data—including packet payloads, flow records, and topology information—treat Network Watcher and its data stores as security-sensitive components:

- **Restrict which regions have Network Watcher enabled**: Network Watcher is automatically enabled in each region where you have virtual network resources. If you don't need diagnostics in a particular region, disable Network Watcher there to reduce your attack surface. See [Enable or disable Azure Network Watcher](network-watcher-create.md).

- **Treat flow log storage accounts as security-sensitive**: Flow logs and packet captures contain detailed network traffic data. Restrict access to the storage accounts that hold this data with the same rigor you apply to other security-sensitive data stores.

- **Understand Network Watcher's scope**: Network Watcher is scoped per subscription and per region. Each subscription can have one Network Watcher instance per region. Plan your identity and access controls accordingly when operating across multiple subscriptions. See [What is Azure Network Watcher?](network-watcher-overview.md).

## Network security

Network Watcher is primarily a tool for *analyzing* network security. The following recommendations focus on securing the network paths and storage resources that Network Watcher depends on. For recommendations on securing your virtual networks themselves, see [Secure your Azure Virtual Network deployment](../virtual-network/secure-virtual-network.md).

- **Use virtual network flow logs instead of NSG flow logs**: Virtual network flow logs operate at the virtual network scope, which eliminates duplicate logging from nested NSG evaluations and provides encryption status tracking. Disable NSG flow logs before enabling virtual network flow logs to avoid redundant data and cost. See [Virtual network flow logs overview](vnet-flow-logs-overview.md).

- **Restrict network access to flow log storage accounts**: Configure firewalls and virtual network rules on the storage accounts that receive flow logs. Allow access only from the networks and identities that need it. See [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md).

- **Use private endpoints for flow log storage accounts**: If your flow logs contain sensitive traffic metadata, use private endpoints on the storage account to keep data transfer on the Microsoft backbone network and off the public internet. See [Use private endpoints for Azure Storage](../storage/common/storage-private-endpoints.md).

- **Secure packet capture storage**: Packet captures can contain full payload data and are stored either on the VM's local disk or in a storage blob. Apply the same network access restrictions to packet capture storage accounts that you apply to flow log storage. See [Packet capture overview](packet-capture-overview.md).

## Identity and access management

- **Assign least-privilege roles for Network Watcher operations**: The Network Contributor built-in role grants access to Network Watcher features but intentionally excludes `Microsoft.Storage/*`, `Microsoft.Compute/*`, and `Microsoft.OperationalInsights/workspaces/*` actions. Assign additional permissions only to identities that need to configure flow logs, packet captures, or traffic analytics. See [RBAC permissions required to use Network Watcher](required-rbac-permissions.md).

- **Create custom RBAC roles for specialized tasks**: Rather than granting Contributor or Owner at the subscription level, create custom roles that include only the Network Watcher actions needed for each team. For example, a monitoring team might need read access to flow logs but not the ability to create packet captures. See [Azure custom roles](../role-based-access-control/custom-roles.md).

- **Use managed identities for virtual network flow logs**: Configure a user-assigned managed identity to authorize flow log writes to storage accounts. This approach eliminates the need for storage account keys or SAS tokens and aligns with Zero Trust principles. Assign the Storage Blob Data Contributor role to the managed identity on the target storage account. See [Managed identity for virtual network flow logs](vnet-flow-logs-managed-identity.md).

- **Limit who can initiate packet captures**: Packet capture creates a VM extension and can access raw network traffic. Restrict the `Microsoft.Network/networkWatchers/packetCaptures/write` permission to security and operations teams that have a legitimate need for payload-level inspection. See [RBAC permissions required to use Network Watcher](required-rbac-permissions.md).

- **Scope traffic analytics permissions carefully**: Traffic analytics requires permissions on Log Analytics workspaces, data collection rules, and data collection endpoints in addition to Network Watcher. Permissions inherited from management groups aren't supported for traffic analytics—assign them at the subscription or resource group level. See [RBAC permissions required to use Network Watcher](required-rbac-permissions.md).

## Data protection

- **Enable encryption on flow log storage accounts**: Use Azure Storage encryption with either Microsoft-managed keys or customer-managed keys for flow log data at rest. If you use customer-managed keys, be aware that rotating the key causes virtual network flow logs to stop—you must disable and then re-enable flow logs after key rotation. See [Azure Storage encryption for data at rest](../storage/common/storage-service-encryption.md).

- **Protect packet capture data at rest and in transit**: Packet captures stored in Azure Blob Storage are encrypted at rest by Azure Storage encryption. When storing captures on a VM's local disk, encrypt the disk by using Azure Disk Encryption or encryption at host. See [Packet capture overview](packet-capture-overview.md).

- **Rotate SAS tokens for packet capture storage**: Packet capture uses SAS tokens to authorize writes to storage accounts. Generate short-lived SAS tokens with the minimum permissions needed, and rotate them regularly. Ensure that key access is enabled on the storage account because it's required for SAS token authorization. See [Grant limited access to data with shared access signatures](../storage/common/storage-sas-overview.md).

- **Restrict Log Analytics workspace access for traffic analytics**: Traffic analytics sends aggregated and enriched flow data to a Log Analytics workspace. Use workspace-level access control or resource-level RBAC to restrict who can query this data. See [Manage access to Log Analytics workspaces](/azure/azure-monitor/logs/manage-access).

## Logging and monitoring

- **Enable activity log collection for Network Watcher operations**: Route the Azure Activity Log to a Log Analytics workspace or storage account so you can audit who created, modified, or deleted Network Watcher resources, flow logs, and packet captures. See [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

- **Integrate traffic analytics with Microsoft Sentinel**: Connect traffic analytics data to Microsoft Sentinel for threat detection, investigation, and correlation with other security data sources. Sentinel provides built-in detection rules for port scans, anomalous connection rates, geographic anomalies, and suspicious traffic volumes. See [Integrate Microsoft Sentinel with traffic analytics](traffic-analytics-sentinel.md).

- **Use traffic analytics to detect network anomalies**: Enable traffic analytics on your flow logs to identify open ports to the internet, VMs communicating with known-bad IP addresses, and unexpected cross-region traffic. Use the traffic analytics dashboard in the Azure portal for ongoing security visibility. See [Traffic analytics](traffic-analytics.md).

- **Apply Zero Trust segmentation through traffic analytics**: Use traffic analytics data to move from a default-allow to a default-deny network posture. Analyze observed traffic patterns to create selective allow rules, detect traffic from high-risk regions, and identify network segmentation gaps. See [Apply Zero Trust principles with traffic analytics](traffic-analytics-zero-trust.md).

## Compliance and governance

- **Enforce flow log enablement with Azure Policy**: Use built-in Azure policies to audit and auto-deploy virtual network flow logs across your subscriptions. This approach ensures that new virtual networks automatically have flow logging enabled and flags noncompliant resources. See [Manage virtual network flow logs using Azure Policy](vnet-flow-logs-policy.md).

- **Enforce traffic analytics with Azure Policy**: Use built-in policies to audit whether traffic analytics is enabled on your flow logs and to auto-enable it where it's missing. This ensures continuous network visibility for compliance and security auditing. See [Manage traffic analytics using Azure Policy](traffic-analytics-policy-portal.md).

- **Use NSG diagnostics and effective security rules for compliance audits**: Before and after making network changes, use NSG diagnostics to verify that specific traffic flows are correctly allowed or denied. Use effective security rules to export a downloadable CSV of all inbound and outbound rules for audit documentation. See [NSG diagnostics overview](nsg-diagnostics-overview.md) and [Effective security rules overview](effective-security-rules-overview.md).

- **Validate IP flow rules before and after changes**: Use IP flow verify to confirm that intended allow and deny rules are applied to specific VMs before deploying changes to production. This prevents unintended exposure from misconfigured NSG or Azure Virtual Network Manager rules. See [IP flow verify overview](ip-flow-verify-overview.md).

## Backup and recovery

- **Configure flow log retention policies**: Set retention policies on flow log storage accounts to automatically delete old data after a defined period (up to 365 days). Use general-purpose v2 storage accounts, which support lifecycle management rules for automated tiering and deletion. See [Virtual network flow logs overview](vnet-flow-logs-overview.md) and [NSG flow logs overview](nsg-flow-logs-overview.md).

- **Use geo-redundant storage for flow log data**: If flow logs are critical to your compliance or forensic investigations, store them in a geo-redundant storage (GRS) or read-access geo-redundant storage (RA-GRS) account to protect against regional outages. See [Azure Storage redundancy](../storage/common/storage-redundancy.md).

- **Back up traffic analytics configurations**: Document or export your traffic analytics configurations, including the associated Log Analytics workspaces, data collection rules, and flow log settings. If you need to recreate your environment, having a configuration record reduces recovery time.

- **Plan for customer-managed key rotation impact**: If you use customer-managed keys on your flow log storage accounts, document the process for disabling and re-enabling flow logs after key rotation. Include this procedure in your operational runbooks to avoid gaps in logging. See [Virtual network flow logs overview](vnet-flow-logs-overview.md).

## Next steps

- [What is Azure Network Watcher?](network-watcher-overview.md)
- [RBAC permissions required to use Network Watcher](required-rbac-permissions.md)
- [Virtual network flow logs overview](vnet-flow-logs-overview.md)
- [Traffic analytics](traffic-analytics.md)
- [Apply Zero Trust principles with traffic analytics](traffic-analytics-zero-trust.md)
- [Integrate Microsoft Sentinel with traffic analytics](traffic-analytics-sentinel.md)
- [Azure security baseline for Network Watcher](/security/benchmark/azure/baselines/network-watcher-security-baseline)
