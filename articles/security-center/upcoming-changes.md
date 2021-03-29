---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 03/18/2021
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
| [Two recommendations from "Apply system updates" security control being deprecated](#two-recommendations-from-apply-system-updates-security-control-being-deprecated) | March 2021                |
| [Deprecation of 11 Azure Defender alerts](#deprecation-of-11-azure-defender-alerts)                                                                                   | March 2021                |
| [21 recommendations moving between security controls](#21-recommendations-moving-between-security-controls)                                                           | April 2021                |
| [Two further recommendations from "Apply system updates" security control being deprecated](#two-further-recommendations-from-apply-system-updates-security-control-being-deprecated)                                                                                         | April 2021                |
| [Recommendations from AWS will be released for general availability (GA)](#recommendations-from-aws-will-be-released-for-general-availability-ga)                     | April 2021                |
| [Enhancements to SQL data classification recommendation](#enhancements-to-sql-data-classification-recommendation)                                                     | Q2 2021                   |
|                                                                                                                                                                       |                           |


### Two recommendations from "Apply system updates" security control being deprecated 

**Estimated date for change:** March 2021

The following two recommendations are scheduled to be deprecated in February 2021:

- **Your machines should be restarted to apply system updates**. This might result in a slight impact on your secure score.
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**. This might result in a slight impact on your secure score.

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).

### Deprecation of 11 Azure Defender alerts

**Estimated date for change:** March 2021

Next month, the eleven Azure Defender alerts listed below will be deprecated.

- New alerts will replace these two alerts and provide better coverage:

    | AlertType                | AlertDisplayName                                                         |
    |--------------------------|--------------------------------------------------------------------------|
    | ARM_MicroBurstDomainInfo | PREVIEW - MicroBurst toolkit "Get-AzureDomainInfo" function run detected |
    | ARM_MicroBurstRunbook    | PREVIEW - MicroBurst toolkit "Get-AzurePasswords" function run detected  |
    |                          |                                                                          |

- These nine alerts relate to an Azure Active Directory Identity Protection connector that has already been deprecated:

    | AlertType           | AlertDisplayName              |
    |---------------------|-------------------------------|
    | UnfamiliarLocation  | Unfamiliar sign-in properties |
    | AnonymousLogin      | Anonymous IP address          |
    | InfectedDeviceLogin | Malware linked IP address     |
    | ImpossibleTravel    | Atypical travel               |
    | MaliciousIP         | Malicious IP address          |
    | LeakedCredentials   | Leaked credentials            |
    | PasswordSpray       | Password Spray                |
    | LeakedCredentials   | Azure AD threat intelligence  |
    | AADAI               | Azure AD AI                   |
    |                     |                               |
 




### 21 recommendations moving between security controls 

**Estimated date for change:** April 2021

The following recommendations are being moved to a different security control. Security controls are logical groups of related security recommendations, and reflects your vulnerable attack surfaces. This move ensures that each of these recommendations is in the most appropriate control to meet its objective. 

Learn which recommendations are in each security control in Security controls and their recommendations.

|Recommendation |Change and impact  |
|---------|---------|
|Vulnerability assessment should be enabled on your SQL servers<br>Vulnerability assessment should be enabled on your SQL managed instances<br>Vulnerabilities on your SQL databases should be remediated new<br>Vulnerabilities on your SQL databases in VMs should be remediated     |Moving from Remediate vulnerabilities (worth 6 points)<br>to Remediate security configurations (worth 4 points).<br>Depending on your environment, these recommendations will have a reduced impact on your score.|
|There should be more than one owner assigned to your subscription<br>Automation account variables should be encrypted<br>IoT Devices - Auditd process stopped sending events<br>IoT Devices - Operating system baseline validation failure<br>IoT Devices - TLS cipher suite upgrade needed<br>IoT Devices - Open Ports On Device<br>IoT Devices - Permissive firewall policy in one of the chains was found<br>IoT Devices - Permissive firewall rule in the input chain was found<br>IoT Devices - Permissive firewall rule in the output chain was found<br>Diagnostic logs in IoT Hub should be enabled<br>IoT Devices - Agent sending underutilized messages<br>IoT Devices - Default IP Filter Policy should be Deny<br>IoT Devices - IP Filter rule large IP range<br>IoT Devices - Agent message intervals and size should be adjusted<br>IoT Devices - Identical Authentication Credentials<br>IoT Devices - Audited process stopped sending events<br>IoT Devices - Operating system (OS) baseline configuration should be fixed|Moving to **Implement security best practices**.<br>When a recommendation moves to the Implement security best practices security control, which is worth no points, the recommendation no longer affects your secure score.|
|||


### Two further recommendations from "Apply system updates" security control being deprecated

**Estimated date for change:** April 2021

The following two recommendations are being deprecated:

- **OS version should be updated for your cloud service roles** - By default, Azure periodically updates your guest OS to the latest supported image within the OS family that you've specified in your service configuration (.cscfg), such as Windows Server 2016.
- **Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version** - This recommendation's evaluations aren't as wide-ranging as we'd like them to be. The current version of this recommendation will eventually be replaced with an enhanced version that's better aligned with our customer's security needs.


### Recommendations from AWS will be released for general availability (GA)

**Estimated date for change:** April 2021

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