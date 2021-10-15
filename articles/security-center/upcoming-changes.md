---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 10/06/2021
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

| Planned change       | Estimated date for change |
|----------------------|---------------------------|
| [Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses](#deprecating-a-preview-alert-armmcas_activityfromanonymousipaddresses)             | October 2021|
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013)| October 2021|
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions)             | October 2021    |
| [Enhancements to recommendation to classify sensitive data in SQL databases](#enhancements-to-recommendation-to-classify-sensitive-data-in-sql-databases)   | Q1 2022    |
|||

### Deprecating a preview alert: ARM.MCAS_ActivityFromAnonymousIPAddresses

**Estimated date for change:** October 2021

We'll be deprecating the following preview alert:

|Alert name| Description|
|----------------------|---------------------------|
|**PREVIEW - Activity from a risky IP address**<br>(ARM.MCAS_ActivityFromAnonymousIPAddresses)|Users activity from an IP address that has been identified as an anonymous proxy IP address has been detected.<br>These proxies are used by people who want to hide their device's IP address, and can be used for malicious intent. This detection uses a machine learning algorithm that reduces false positives, such as mis-tagged IP addresses that are widely used by users in the organization.<br>Requires an active Microsoft Cloud App Security license.|
|||

We've created new alerts that provide this information and add to it. In addition, the newer alerts (ARM_OperationFromSuspiciousIP, ARM_OperationFromSuspiciousProxyIP) don't require a license for Microsoft Cloud App Security.

### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

**Estimated date for change:** October 2021

The legacy implementation of ISO 27001 will be removed from Security Center's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Security Center, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Security Center's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::

### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** October 2021

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, see [the release note](release-notes.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines (key: 83f577bd-a1b6-b7e1-0891-12ca19d1e6df)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines (key: 383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)

- **Endpoint protection health issues should be resolved on your machines** will replace the existing recommendation that has the same name. The two recommendations have different assessment keys:
    - Assessment key for the **preview** recommendation: 37a3689a-818e-4a0e-82ac-b1392b9bb000
    - Assessment key for the **GA** recommendation: 3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a

Learn more:
- [Security Center's supported endpoint protection solutions](security-center-services.md#endpoint-supported)
- [How these recommendations assess the status of your deployed solutions](security-center-endpoint-protection.md)

### Enhancements to recommendation to classify sensitive data in SQL databases

**Estimated date for change:** Q1 2022

The recommendation **Sensitive data in your SQL databases should be classified** in the **Apply data classification** security control will be replaced with a new version that's better aligned with Microsoft's data classification strategy. As a result the recommendation's ID will also change (currently, it's b0df6f56-862d-4730-8597-38c0fd4ebd59).


## Next steps

For all recent changes to Security Center, see [What's new in Azure Security Center?](release-notes.md)