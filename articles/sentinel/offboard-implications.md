---
title: Implications - remove Microsoft Sentinel from workspace 
description: Learn about the impact of removing a Microsoft Sentinel instance from a Log Analytics workspace in the Azure or Defender portal.
author: cwatson-cat
ms.topic: concept-article
ms.date: 02/06/2025
ms.author: cwatson
appliesto:
    - Microsoft Sentinel in the Microsoft Defender portal
    - Microsoft Sentinel in the Azure portal

#Customer intent: As an IT admin, I want to understand the implications of removing Microsoft Sentinel from my Log Analytics workspace so that I can make an informed choice about discontining its use and managing associated costs and configurations.

---

# Implications of removing Microsoft Sentinel from your workspace

If you decide that you no longer want to use your Microsoft Sentinel instance associated with a Log Analytics workspace, remove Microsoft Sentinel from the workspace. But before you do, consider the implications described in this article.

It can take up to 48 hours for Microsoft Sentinel to be removed from the Log Analytics workspace. Data connector configuration and Microsoft Sentinel tables are deleted. Other resources and data are retained for a limited time.

Your subscription continues to be registered with the Microsoft Sentinel resource provider. But, you can remove it manually.

If you don't want to keep the workspace and the data collected for Microsoft Sentinel, delete the resources associated with the workspace in the Azure portal.

## Pricing changes

When Microsoft Sentinel is removed from a workspace, there might still be costs associated with the data in Azure Monitor Log Analytics. For more information on the effect to commitment tier costs, see [Simplified billing offboarding behavior](enroll-simplified-pricing-tier.md#offboarding-behavior).

## Data connector configurations removed

The configurations for the following data connector are removed when you remove Microsoft Sentinel from your workspace.

- Microsoft 365

- Amazon Web Services

- Microsoft services security alerts:

  - Microsoft Defender for Identity 
  - Microsoft Defender for Cloud Apps including Cloud Discovery Shadow IT reporting
  - Microsoft Entra ID Protection
  - Microsoft Defender for Endpoint
  - Microsoft Defender for Cloud

- Threat Intelligence

- Common security logs including CEF-based logs, Barracuda, and Syslog. If you get security alerts from Microsoft Defender for Cloud, these logs continue to be collected.

- Windows Security Events. If you get security alerts from Microsoft Defender for Cloud, these logs continue to be collected.

Within the first 48 hours, the data and analytics rules, which include real-time automation configuration, are no longer accessible or queryable in Microsoft Sentinel.

## Resources removed

The following resources are removed after 30 days: 

- Incidents (including investigation metadata)

- Analytics rules

- Bookmarks

Your playbooks, saved workbooks, saved hunting queries, and notebooks aren't removed. Some of these resources might break due to the removed data. Remove those resources manually.

After you remove the service, there's a grace period of 30 days to re-enable Microsoft Sentinel. Your data and analytics rules are restored, but the configured connectors that were disconnected must be reconnected.

## Microsoft Sentinel tables deleted

When you remove Microsoft Sentinel from your workspace, all Microsoft Sentinel tables are deleted. The data in these tables aren't accessible or queryable. But, the data retention policy set for those tables applies to the data in the deleted tables. So, if you re-enable Microsoft Sentinel on the workspace within the data retention time period, the retained data is restored to those tables.

The tables and related data that are inaccessible when you remove Microsoft Sentinel include but aren't limited to the following tables:

- `AlertEvidence`
- `AlertInfo`
- `Anomalies`
- `ASimAuditEventLogs`
- `ASimAuthenticationEventLogs`
- `ASimDhcpEventLogs`
- `ASimDnsActivityLogs`
- `ASimFileEventLogs`
- `ASimNetworkSessionLogs`
- `ASimProcessEventLogs`
- `ASimRegistryEventLogs`
- `ASimUserManagementActivityLogs`
- `ASimWebSessionLogs`
- `AWSCloudTrail`
- `AWSCloudWatch`
- `AWSGuardDuty`
- `AWSVPCFlow`
- `CloudAppEvents`
- `CommonSecurityLog`
- `ConfidentialWatchlist`
- `DataverseActivity`
- `DeviceEvents`
- `DeviceFileCertificateInfo`
- `DeviceFileEvents`
- `DeviceImageLoadEvents`
- `DeviceInfo`
- `DeviceLogonEvents`
- `DeviceNetworkEvents`
- `DeviceNetworkInfo`
- `DeviceProcessEvents`
- `DeviceRegistryEvents`
- `DeviceTvmSecureConfigurationAssessment`
- `DeviceTvmSecureConfigurationAssessmentKB`
- `DeviceTvmSoftwareInventory`
- `DeviceTvmSoftwareVulnerabilities`
- `DeviceTvmSoftwareVulnerabilitiesKB`
- `DnsEvents`
- `DnsInventory`
- `Dynamics365Activity`
- `DynamicSummary`
- `EmailAttachmentInfo`
- `EmailEvents`
- `EmailPostDeliveryEvents`
- `EmailUrlInfo`
- `GCPAuditLogs`
- `GoogleCloudSCC`
- `HuntingBookmark`
- `IdentityDirectoryEvents`
- `IdentityLogonEvents`
- `IdentityQueryEvents`
- `LinuxAuditLog`
- `McasShadowItReporting`
- `MicrosoftPurviewInformationProtection`
- `NetworkSessions`
- `OfficeActivity`
- `PowerAppsActivity`
- `PowerAutomateActivity`
- `PowerBIActivity`
- `PowerPlatformAdminActivity`
- `PowerPlatformConnectorActivity`
- `PowerPlatformDlpActivity`
- `ProjectActivity`
- `SecurityAlert`
- `SecurityEvent`
- `SecurityIncident`
- `SentinelAudit`
- `SentinelHealth`
- `ThreatIntelligenceIndicator`
- `UrlClickEvents`
- `Watchlist`
- `WindowsEvent`

## Related resources

- [Remove Microsoft Sentinel from your Log Analytics workspace](offboard.md)
- [Offboard Microsoft Sentinel from the Defender portal](/defender-xdr/microsoft-sentinel-onboard?#offboard-microsoft-sentinel).