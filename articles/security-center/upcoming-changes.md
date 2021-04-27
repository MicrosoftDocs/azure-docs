---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 04/20/2021
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

| Planned change                                                                                                                                                        | Estimated date for change |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| [21 recommendations moving between security controls](#21-recommendations-moving-between-security-controls)                                                           | April 2021                |
| [Two recommendations from "Apply system updates" security control being deprecated](#two-recommendations-from-apply-system-updates-security-control-being-deprecated) | April 2021                |
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013)          | June 2021                 |
| [Recommendations from AWS will be released for general availability (GA)](#recommendations-from-aws-will-be-released-for-general-availability-ga)                     | **August** 2021           |
| [Enhancements to SQL data classification recommendation](#enhancements-to-sql-data-classification-recommendation)                                                     | Q2 2021                   |
|                                                                                                                                                                       |                           |


### 21 recommendations moving between security controls 

**Estimated date for change:** April 2021

The following recommendations are being moved to a different security control. Security controls are logical groups of related security recommendations, and reflects your vulnerable attack surfaces. This move ensures that each of these recommendations is in the most appropriate control to meet its objective. 

Learn which recommendations are in each security control in Security controls and their recommendations.

|Recommendation |Change and impact  |
|---------|---------|
|Vulnerability assessment should be enabled on your SQL servers<br>Vulnerability assessment should be enabled on your SQL managed instances<br>Vulnerabilities on your SQL databases should be remediated new<br>Vulnerabilities on your SQL databases in VMs should be remediated     |Moving from Remediate vulnerabilities (worth 6 points)<br>to Remediate security configurations (worth 4 points).<br>Depending on your environment, these recommendations will have a reduced impact on your score.|
|There should be more than one owner assigned to your subscription<br>Automation account variables should be encrypted<br>IoT Devices - Auditd process stopped sending events<br>IoT Devices - Operating system baseline validation failure<br>IoT Devices - TLS cipher suite upgrade needed<br>IoT Devices - Open Ports On Device<br>IoT Devices - Permissive firewall policy in one of the chains was found<br>IoT Devices - Permissive firewall rule in the input chain was found<br>IoT Devices - Permissive firewall rule in the output chain was found<br>Diagnostic logs in IoT Hub should be enabled<br>IoT Devices - Agent sending underutilized messages<br>IoT Devices - Default IP Filter Policy should be Deny<br>IoT Devices - IP Filter rule large IP range<br>IoT Devices - Agent message intervals and size should be adjusted<br>IoT Devices - Identical Authentication Credentials<br>IoT Devices - Audited process stopped sending events<br>IoT Devices - Operating system (OS) baseline configuration should be fixed|Moving to **Implement security best practices**.<br>When a recommendation moves to the Implement security best practices security control, which is worth no points, the recommendation no longer affects your secure score.|
|||


### Two recommendations from "Apply system updates" security control being deprecated

**Estimated date for change:** April 2021

The following two recommendations are being deprecated:

- **OS version should be updated for your cloud service roles** - By default, Azure periodically updates your guest OS to the latest supported image within the OS family that you've specified in your service configuration (.cscfg), such as Windows Server 2016.
- **Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version** - This recommendation's evaluations aren't as wide-ranging as we'd like them to be. The current version of this recommendation will eventually be replaced with an enhanced version that's better aligned with our customer's security needs.


### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

The legacy implementation of ISO 27001 will be removed from Security Center's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Security Center, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Security Center's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::

### Recommendations from AWS will be released for general availability (GA)

**Estimated date for change:** August 2021

Azure Security Center protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

The recommendations coming from AWS Security Hub have been in preview since the cloud connectors were introduced. Recommendations flagged as **Preview** aren't included in the calculations of your secure score, but should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

With this change, two sets of AWS recommendations will move to GA:

- [Security Hub's PCI DSS controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-pci-controls.html)
- [Security Hub's CIS AWS Foundations Benchmark controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html)

When these are GA and the assessments run on your AWS resources, the results will impact your combined secure score for all your multi and hybrid cloud resources.



### Enhancements to SQL data classification recommendation

**Estimated date for change:** Q2 2021

The recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result the recommendation's ID will also change (currently, it's b0df6f56-862d-4730-8597-38c0fd4ebd59).



## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).