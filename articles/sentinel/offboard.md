---
title: Remove Microsoft Sentinel from your workspace 
description: Learn how to delete your Microsoft Sentinel instance.
author: cwatson-cat
ms.topic: how-to
ms.date: 03/06/2024
ms.author: cwatson
---

# Remove Microsoft Sentinel from your workspace

If you no longer want to use Microsoft Sentinel, this article explains how to remove it from your Log Analytics workspace. Review the implications of removing Microsoft Sentinel before you complete these steps.

## Remove Microsoft Sentinel

Complete the following steps to remove Microsoft Sentinel from your Log Analytics workspace.

1. For Microsoft Sentinel in the [Azure portal](https://portal.microsoft.com), under **Configuration**, select **Settings**.

1. On the **Settings** page, select the **Settings** tab.

1. At the bottom of the list, select **Remove Microsoft Sentinel**.

    :::image type="content" source="media/offboard/locate-remove-sentinel.png" alt-text="Screenshot to find the setting to remove Microsoft Sentinel from your workspace.":::

1. Review the **Know before you go...** section and the rest of this document carefully. Take all the necessary actions before proceeding.

1. Select the appropriate checkboxes to let us know why you're removing Microsoft Sentinel. Enter any other details in the space provided, and indicate whether you want Microsoft to email you in response to your feedback.

1. Select **Remove Microsoft Sentinel from your workspace**.
    
    :::image type="content" source="media/offboard/remove-sentinel-reasons.png" alt-text="Screenshot that shows the section to remove the Microsoft Sentinel solution from your workspace.":::

## Consider pricing changes
When Microsoft Sentinel is removed from a workspace, there might still be costs associated with the data in Azure Monitor Log Analytics. For more information on the effect to commitment tier costs, see [Simplified billing offboarding behavior](enroll-simplified-pricing-tier.md#offboarding-behavior).

## Review implications

It can take up to 48 hours for Microsoft Sentinel to be removed from the Log Analytics workspace. Data connector configuration and Microsoft Sentinel tables are deleted. Other resources and data are retained for a limited time.

Your subscription continues to be registered with the Microsoft Sentinel resource provider. But, you can remove it manually.

### Data connector configurations removed

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

### Resources removed

The following resources are removed after 30 days: 

- Incidents (including investigation metadata)

- Analytics rules

- Bookmarks

Your playbooks, saved workbooks, saved hunting queries, and notebooks aren't removed. Some of these resources might break due to the removed data. Remove those resources manually.

After you remove the service, there's a grace period of 30 days to re-enable Microsoft Sentinel. Your data and analytics rules are restored, but the configured connectors that were disconnected must be reconnected.

### Microsoft Sentinel tables deleted

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

## Next steps

In this document, you learned how to remove the Microsoft Sentinel service. If you change your mind and want to install it again, see [Quickstart: Onboard Microsoft Sentinel](quickstart-onboard.md).

