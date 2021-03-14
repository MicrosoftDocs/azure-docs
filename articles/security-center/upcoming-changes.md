---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 03/10/2021
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

- [Recommendations from AWS will be released for general availability (GA)](#recommendations-from-aws-will-be-released-for-general-availability-ga)
- [Two recommendations from "Apply system updates" security control being deprecated](#two-recommendations-from-apply-system-updates-security-control-being-deprecated)
- [Enhancements to SQL data classification recommendation](#enhancements-to-sql-data-classification-recommendation)
- [Deprecation of 11 Azure Defender alerts](#deprecation-of-11-azure-defender-alerts)


### Recommendations from AWS will be released for general availability (GA)

**Estimated date for change:** April 2021

Azure Security Center protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

The recommendations coming from AWS Security Hub have been in preview since the cloud connectors were introduced. Recommendations flagged as **Preview** aren't included in the calculations of your secure score, but should still be remediated wherever possible, so that when the preview period ends they'll contribute towards your score.

With this change, two sets of AWS recommendations will move to GA:

- [Security Hub's PCI DSS controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-pci-controls.html)
- [Security Hub's CIS AWS Foundations Benchmark controls](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-cis-controls.html)

When these are GA and the assessments run on your AWS resources, the results will impact your combined secure score for all your multi and hybrid cloud resources. 


### Two recommendations from "Apply system updates" security control being deprecated 

**Estimated date for change:** March 2021

The following two recommendations are scheduled to be deprecated in February 2021:

- **Your machines should be restarted to apply system updates**. This might result in a slight impact on your secure score.
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**. This might result in a slight impact on your secure score.

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).


### Enhancements to SQL data classification recommendation

**Estimated date for change:** Q2 2021

The recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result the recommendation's ID will also change (currently, it's b0df6f56-862d-4730-8597-38c0fd4ebd59).


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
 



## Next steps

For all recent changes to the product, see [What's new in Azure Security Center?](release-notes.md).
