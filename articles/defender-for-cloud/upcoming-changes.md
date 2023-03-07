---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 12/27/2022
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Recommendation to find vulnerabilities in running container images to be released for General Availability (GA)](#recommendation-to-find-vulnerabilities-in-running-container-images-to-be-released-for-general-availability-ga) | January 2023 |
| [Recommendation to enable diagnostic logs for Virtual Machine Scale Sets to be deprecated](#recommendation-to-enable-diagnostic-logs-for-virtual-machine-scale-sets-to-be-deprecated) | January 2023 |
| [The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports is set to be deprecated](#the-policy-vulnerability-assessment-settings-for-sql-server-should-contain-an-email-address-to-receive-scan-reports-is-set-to-be-deprecated) | January 2023 |
| [The name of the Secure score control Protect your applications with Azure advanced networking solutions will be changed](#the-name-of-the-secure-score-control-protect-your-applications-with-azure-advanced-networking-solutions-will-be-changed) | January 2023 |

### Recommendation to find vulnerabilities in running container images to be released for General Availability (GA)

**Estimated date for change: January 2023**

The [Running container images should have vulnerability findings resolved](defender-for-containers-vulnerability-assessment-azure.md#view-vulnerabilities-for-images-running-on-your-aks-clusters) recommendation is currently in preview. While a recommendation is in preview, it doesn't render a resource unhealthy and isn't included in the calculations of your secure score.

We recommend that you use the recommendation to remediate vulnerabilities in your containers so that the recommendation won't impact your secure score when the recommendation is released as GA. Learn about [recommendation remediation](implement-security-recommendations.md).

### Recommendation to enable diagnostic logs for Virtual Machine Scale Sets to be deprecated

**Estimated date for change: January 2023**

The recommendation [`Diagnostic logs in Virtual Machine Scale Sets should be enabled`](https://portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/961eb649-3ea9-f8c2-6595-88e9a3aeedeb/showSecurityCenterCommandBar~/false) is set to be deprecated. 

The related [policy definition](https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c1b1214-f927-48bf-8882-84f0af6588b1) will also be deprecated from any standards displayed in the regulatory compliance dashboard. 

| Recommendation | Description | Severity |
|--|--|--|
| Diagnostic logs in Virtual Machine Scale Sets should be enabled | Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. | Low |

### The policy Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports is set to be deprecated 

**Estimated date for change: January 2023**

The policy [`Vulnerability Assessment settings for SQL server should contain an email address to receive scan reports`](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F057d6cfe-9c4f-4a6d-bc60-14420ea1f1a9) is set to be deprecated. 

The Defender for SQL vulnerability assessment email report will still be available and existing email configurations won't change after the policy is deprecated.

### The name of the Secure score control Protect your applications with Azure advanced networking solutions will be changed

**Estimated date for change: January 2023**

The secure score control `Protect your applications with Azure advanced networking solutions` will change to `Protect applications against DDoS attacks`.

The updated name will be reflected on Azure Resource Graph (ARG), Secure Score Controls API and the `Download CSV report`.

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
