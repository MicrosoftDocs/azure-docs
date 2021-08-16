---
title: Important changes coming to Azure Security Center
description: Upcoming changes to Azure Security Center that you might need to be aware of and for which you might need to plan 
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: overview
ms.date: 08/10/2021
ms.author: memildin

---

# Important upcoming changes to Azure Security Center

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Security Center. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Azure Security Center](release-notes.md).


## Planned changes

| Planned change                                                                                                                                                                                          | Estimated date for change |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013)                                            | August 2021               |
| [CSV exports to be limited to 20 MB](#csv-exports-to-be-limited-to-20-mb)                                                                                                                               | August 2021               |
| [Enable Azure Defender security control to be included in secure score](#enable-azure-defender-security-control-to-be-included-in-secure-score)                                                         | Q3 2021                   |
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions)                                                         | Q4 2021                   |
| [Enhancements to recommendation to classify sensitive data in SQL databases](#enhancements-to-recommendation-to-classify-sensitive-data-in-sql-databases)                                               | Q1 2022                   ||                                                                                                                                                                                                         |                           |


### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

**Estimated date for change:** August 2021

The legacy implementation of ISO 27001 will be removed from Security Center's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Security Center, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Security Center's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::

### CSV exports to be limited to 20 MB

**Estimated date for change:** August 2021

When exporting Security Center recommendations data, there's currently no limit on the amount of data that you can download.

:::image type="content" source="media/upcoming-changes/download-csv-report.png" alt-text="Security Center's 'download CSV report' button to export recommendation data.":::

With this change, we're instituting a limit of 20 MB.

If you need to export larger amounts of data, use the available filters before selecting, or select subsets of your subscriptions and download the data in batches.

:::image type="content" source="media/upcoming-changes/filter-subscriptions.png" alt-text="Filtering subscriptions in the Azure portal.":::

Learn more about [performing a CSV export of your security recommendations](continuous-export.md#manual-one-time-export-of-alerts-and-recommendations).

### Enable Azure Defender security control to be included in secure score

**Estimated date for change:** Q3 2021

Security Center's hardening recommendations are grouped into security controls. Each control is a logical group of related security recommendations, and reflects a vulnerable attack surface. The contribution of each security control towards the overall secure score is shown clearly on the recommendations page as well as in the list of controls in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).

Since its introduction, the **Enable Azure Defender** control has had a maximum possible score of 0 points. **With this change, the control will contribute towards your secure score**.

When you enable Azure Defender you'll extend the capabilities of Security Center's free mode to your workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. Some of the major features of Azure Defender are: integrated Microsoft Defender for Endpoint licenses for your servers, vulnerability scanning for virtual machines and container registries, security alerts based on advanced behavioral analytics and machine learning, and container security features. For a full list, see [Azure Security Center free vs Azure Defender enabled](security-center-pricing.md).

With this change, there will be an impact on the secure score of any subscriptions that aren't protected by Azure Defender. We suggest you enable Azure Defender before this change occurs to ensure there is no impact on your scores. 

Learn more in [Quickstart: Enable Azure Defender](enable-azure-defender.md).

### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** Q4 2021

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, see [the release note](release-notes.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee) 

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