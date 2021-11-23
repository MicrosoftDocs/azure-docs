---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: defender-for-cloud
ms.topic: overview
ms.date: 11/21/2021
ms.author: memildin
---
# Important upcoming changes to Microsoft Defender for Cloud

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).


## Planned changes

| Planned change                                                                                                                                                                      | Estimated date for change |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| [Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses](#deprecating-a-preview-alert-armmcas_activityfromanonymousipaddresses)                                     | November 2021             |
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013)                        | November 2021             |
| [Changes to a security alert from Microsoft Defender for Storage](#changes-to-a-security-alert-from-microsoft-defender-for-storage)                                                 | November 2021             |
| [Container security features to be grouped under Defender for Containers](#container-security-features-to-be-grouped-under-defender-for-containers)                                 | December 2021             |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations)                                                                                       | December 2021             |
| [Enhancements to recommendation to classify sensitive data in SQL databases](#enhancements-to-recommendation-to-classify-sensitive-data-in-sql-databases)                           | Q1 2022                   |
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions)                                     | March 2022             |
|                                                                                                                                                                                     |                           |

### Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses

**Estimated date for change:** November 2021

We'll be deprecating the following preview alert:

|Alert name| Description|
|----------------------|---------------------------|
|**PREVIEW - Activity from a risky IP address**<br>(ARM.MCAS_ActivityFromAnonymousIPAddresses)|Users activity from an IP address that has been identified as an anonymous proxy IP address has been detected.<br>These proxies are used by people who want to hide their device's IP address, and can be used for malicious intent. This detection uses a machine learning algorithm that reduces false positives, such as mis-tagged IP addresses that are widely used by users in the organization.<br>Requires an active Microsoft Defender for Cloud Apps license.|
|||

We've created new alerts that provide this information and add to it. In addition, the newer alerts (ARM_OperationFromSuspiciousIP, ARM_OperationFromSuspiciousProxyIP) don't require a license for Microsoft Defender for Cloud Apps (formerly known as Microsoft Cloud App Security).

### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

**Estimated date for change:** November 2021

The legacy implementation of ISO 27001 will be removed from Defender for Cloud's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Defender for Cloud, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Defender for Cloud's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::


### Changes to a security alert from Microsoft Defender for Storage

**Estimated date for change:** November 2021

One of the preview alerts provided by Microsoft Defender for Storage is being divided into two new recommendations to provide greater clarity about the suspicious events discovered. This alert is relevant to Azure Blob Storage only.

**The alert type is changing too.**

- Before the change, the alert was:<br>
    "Preview - Anonymous scan of public storage containers"<br>(Storage.Blob_ContainerAnonymousScan)

- From this change, there'll be two recommendations:

    - "Open storage containers discovered by external scanning tool or script"<br>(Storage.Blob_OpenContainersScanning.FailedAttempt)
    - "Successful discovery of open storage containers by external scanning script or tool"<br>(Storage.Blob_OpenContainersScanning.SuccessfulDiscovery)

More details of these alerts will be published when the change is released.


### Multiple changes to identity recommendations

**Estimated date for change:** December 2021

Defender for Cloud includes multiple recommendations for improving the management of users and accounts. In December, we'll be making the changes outlined below.

- **Improved freshness interval** - Currently, the identity recommendations have a freshness interval of 24 hours. This update will reduce that interval to 12 hours.

- **Account exemption capability** - Defender for Cloud has many features for customizing the experience and making sure your secure score reflects your organization's security priorities. The exempt option on security recommendations is one such feature. For a full overview and instructions, see [Exempting resources and recommendations from your secure score](exempt-resource.md). With this update, you'll be able to exempt specific accounts from evaluation by the eight recommendations listed in the following table.

    Typically, you'd exempt emergency “break glass” accounts from MFA recommendations, because such accounts are often deliberately excluded from an organization's MFA requirements. Alternatively, you might have external accounts that you'd like to permit access to but which don't have MFA enabled.

    > [!TIP]
    > When you exempt an account, it won't be shown as unhealthy and also won't cause a subscription to appear  unhealthy.

    |Recommendation| Assessment key|
    |-|-|
    |[MFA should be enabled on accounts with owner permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/94290b00-4d0c-d7b4-7cea-064a9554e681)|94290b00-4d0c-d7b4-7cea-064a9554e681|
    |[MFA should be enabled on accounts with read permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/151e82c5-5341-a74b-1eb0-bc38d2c84bb5)|151e82c5-5341-a74b-1eb0-bc38d2c84bb5|
    |[MFA should be enabled on accounts with write permissions on your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/57e98606-6b1e-6193-0e3d-fe621387c16b)|57e98606-6b1e-6193-0e3d-fe621387c16b|
    |[External accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/c3b6ae71-f1f0-31b4-e6c1-d5951285d03d)|c3b6ae71-f1f0-31b4-e6c1-d5951285d03d|
    |[External accounts with read permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b)|a8c6a4ad-d51e-88fe-2979-d3ee3c864f8b|
    |[External accounts with write permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/04e7147b-0deb-9796-2e5c-0336343ceb3d)|04e7147b-0deb-9796-2e5c-0336343ceb3d|
    |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e52064aa-6853-e252-a11e-dffc675689c2)|e52064aa-6853-e252-a11e-dffc675689c2|
    |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00c6d40b-e990-6acf-d4f3-471e747a27c4)|00c6d40b-e990-6acf-d4f3-471e747a27c4|
    |||
 
- **Recommendations rename** - From this update, we're renaming two recommendations. We're also revising their descriptions. The assessment keys will remain unchanged. 


    |Property  |Current value  | From the update|
    |---------|---------|---------|
    |Assessment key     | e52064aa-6853-e252-a11e-dffc675689c2        | Unchanged|
    |Name     |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/e52064aa-6853-e252-a11e-dffc675689c2)         |Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions        |
    |Description     |User accounts that have been blocked from signing in, should be removed from your subscriptions.<br>These accounts can be targets for attackers looking to find ways to access your data without being noticed.|User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed.<br>Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md).|
    |Related policy     |[Deprecated accounts with owner permissions should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2febb62a0c-3560-49e1-89ed-27e074e9f8ad)         |Subscriptions should be purged of accounts that are blocked in Active Directory and have owner permissions |
    |||

    |Property  |Current value  | From the update|
    |---------|---------|---------|
    |Assessment key     | 00c6d40b-e990-6acf-d4f3-471e747a27c4        | Unchanged|
    |Name     |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/00c6d40b-e990-6acf-d4f3-471e747a27c4)|Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions|
    |Description     |User accounts that have been blocked from signing in, should be removed from your subscriptions.<br>These accounts can be targets for attackers looking to find ways to access your data without being noticed.|User accounts that have been blocked from signing into Active Directory, should be removed from your subscriptions. These accounts can be targets for attackers looking to find ways to access your data without being noticed.<br>Learn more about securing the identity perimeter in [Azure Identity Management and access control security best practices](../security/fundamentals/identity-management-best-practices.md).|
    |Related policy     |[Deprecated accounts should be removed from your subscription](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f6b1cbf55-e8b6-442f-ba4c-7246b6381474)|Subscriptions should be purged of accounts that are blocked in Active Directory and have read and write permissions|
    |||
 

### Container security features to be grouped under Defender for Containers

**Estimated date for change:** December 2021

Microsoft Defender for Cloud's container security features are currently available through two Microsoft Defender plans: [Microsoft Defender for Kubernetes](defender-for-kubernetes-introduction.md) and [Microsoft Defender for container registries](defender-for-container-registries-introduction.md).

With this change:

- These two plans will be deprecated.
- The two existing recommendations to enable the current plans will also be deprecated: **Azure Defender for Kubernetes should be enabled** and **Azure Defender for container registries should be enabled**.
- A new, combined plan, **Microsoft Defender for Containers**, will include all their features as well as a more streamlined and feature-rich experience to help you protect your container solutions. 

There'll be no change to subscriptions that already have Defender for Kubernetes or Defender for container registries enabled. You'll have the option to upgrade your existing subscriptions to Microsoft Defender for Containers.

When we release Microsoft Defender for Containers for general availability, new subscriptions won't have the option to use the deprecated plans.

Learn more about [Container security in Microsoft Defender for Cloud](container-security.md).


### Enhancements to recommendation to classify sensitive data in SQL databases

**Estimated date for change:** Q1 2022

The recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result the recommendation's ID will also change (currently, it's b0df6f56-862d-4730-8597-38c0fd4ebd59).


### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** March 2022

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, see [the release note](release-notes.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines (key: 83f577bd-a1b6-b7e1-0891-12ca19d1e6df)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines (key: 383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)

- **Endpoint protection health issues should be resolved on your machines** will replace the existing recommendation that has the same name. The two recommendations have different assessment keys:
    - Assessment key for the **preview** recommendation: 37a3689a-818e-4a0e-82ac-b1392b9bb000
    - Assessment key for the **GA** recommendation: 3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a

Learn more:
- [Defender for Cloud's supported endpoint protection solutions](supported-machines-endpoint-solutions-clouds.md#endpoint-supported)
- [How these recommendations assess the status of your deployed solutions](endpoint-protection-recommendations-technical.md)



## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md)
