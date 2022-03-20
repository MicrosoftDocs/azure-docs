---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 03/20/2022
---

# Important upcoming changes to Microsoft Defender for Cloud

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).


## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013](#legacy-implementation-of-iso-27001-is-being-replaced-with-new-iso-270012013) | January 2022 |
| [Changes to recommendations for managing endpoint protection solutions](#changes-to-recommendations-for-managing-endpoint-protection-solutions) | March 2022 |
| [AWS and GCP recommendations to GA](#aws-and-gcp-recommendations-to-ga) | March 2022 |
| [Relocation of custom recommendations](#relocation-of-custom-recommendations) | March 2022 |
| [Deprecating Microsoft Defender for IoT device recommendations](#deprecating-microsoft-defender-for-iot-device-recommendations)| March 2022 |
| [Deprecating Microsoft Defender for IoT device alerts](#deprecating-microsoft-defender-for-iot-device-alerts) | March 2022 |
| [Multiple changes to identity recommendations](#multiple-changes-to-identity-recommendations) | May 2022 |

### Legacy implementation of ISO 27001 is being replaced with new ISO 27001:2013

**Estimated date for change:** January 2022 

The legacy implementation of ISO 27001 will be removed from Defender for Cloud's regulatory compliance dashboard. If you're tracking your ISO 27001 compliance with Defender for Cloud, onboard the new ISO 27001:2013 standard for all relevant management groups or subscriptions, and the current legacy ISO 27001 will soon be removed from the dashboard.

:::image type="content" source="media/upcoming-changes/removing-iso-27001-legacy-implementation.png" alt-text="Defender for Cloud's regulatory compliance dashboard showing the message about the removal of the legacy implementation of ISO 27001." lightbox="media/upcoming-changes/removing-iso-27001-legacy-implementation.png":::

### Changes to recommendations for managing endpoint protection solutions

**Estimated date for change:** March 2022

In August 2021, we added two new **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. For full details, [see the release note](release-notes-archive.md#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview).

When the recommendations are released to general availability, they will replace the following existing recommendations:

- **Endpoint protection should be installed on your machines** will replace:
    - [Install endpoint protection solution on virtual machines (key: 83f577bd-a1b6-b7e1-0891-12ca19d1e6df)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/83f577bd-a1b6-b7e1-0891-12ca19d1e6df)
    - [Install endpoint protection solution on your machines (key: 383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/383cf3bc-fdf9-4a02-120a-3e7e36c6bfee)

- **Endpoint protection health issues should be resolved on your machines** will replace the existing recommendation that has the same name. The two recommendations have different assessment keys:
    - Assessment key for the **preview** recommendation: 37a3689a-818e-4a0e-82ac-b1392b9bb000
    - Assessment key for the **GA** recommendation: 3bcd234d-c9c7-c2a2-89e0-c01f419c1a8a

Learn more:
- [Defender for Cloud's supported endpoint protection solutions](supported-machines-endpoint-solutions-clouds-servers.md#endpoint-supported)
- [How these recommendations assess the status of your deployed solutions](endpoint-protection-recommendations-technical.md)

### AWS and GCP recommendations to GA

**Estimated date for change:** March 2022

There are currently AWS and GCP recommendations in the preview stage. These recommendations come from the AWS Foundational Security Best Practices and GCP default standards which are assigned by default. All of the recommendations will become Generally Available (GA) in March 2022.

When these recommendations go live, their impact will be included in the calculations of your secure score. Expect changes to your secure score.

#### AWS recommendations

**To find these recommendations**:

1. Navigate to **Environment settings** > **`AWS connector`** > **Standards (preview)**.
1. Right click on **AWS Foundational Security Best Practices (preview)**, and select **view assessments**.

:::image type="content" source="media/release-notes/aws-foundational.png" alt-text="Screenshot showing the location of the AWS Foundational Security Best Practices (preview).":::

#### GCP recommendations

**To find these recommendations**:

1. Navigate to **Environment settings** > **`GCP connector`** > **Standards (preview)**.
1. Right click on **GCP Default (preview)**, and select **view assessments**.

:::image type="content" source="media/release-notes/gcp-foundational.png" alt-text="Screenshot showing the location of the GCP Default (preview).":::

### Relocation of custom recommendations

**Estimated date for change:** March 2022

Custom recommendations are those created by a user, and have no impact on the secure score. Therefore, the custom recommendations are being relocated from the Secure score recommendations tab to the All recommendations tab.

When the move occurs, the custom recommendations will be found via a new "recommendation type" filter.

Learn more in [Create custom security initiatives and policies](custom-security-policies.md).

### Deprecating Microsoft Defender for IoT device recommendations

**Estimated date for change:** March 2022 

Microsoft Defender for IoT device recommendations will no longer be visible in Microsoft Defender for Cloud. These recommendations will still be available on Microsoft Defender for IoT's Recommendations page, and in Microsoft Sentinel.

The following recommendations will be deprecated:

| Assessment key | Recommendations |
|--|--|
| 1a36f14a-8bd8-45f5-abe5-eef88d76ab5b: IoT Devices | Open Ports On Device |
| ba975338-f956-41e7-a9f2-7614832d382d: IoT Devices | Permissive firewall rule in the input chain was found |
| beb62be3-5e78-49bd-ac5f-099250ef3c7c: IoT Devices | Permissive firewall policy in one of the chains was found |
| d5a8d84a-9ad0-42e2-80e0-d38e3d46028a: IoT Devices | Permissive firewall rule in the output chain was found |
| 5f65e47f-7a00-4bf3-acae-90ee441ee876: IoT Devices | Operating system baseline validation failure |
|a9a59ebb-5d6f-42f5-92a1-036fd0fd1879: IoT Devices | Agent sending underutilized messages |
| 2acc27c6-5fdb-405e-9080-cb66b850c8f5: IoT Devices | TLS cipher suite upgrade needed |
|d74d2738-2485-4103-9919-69c7e63776ec: IoT Devices | Auditd process stopped sending events |

### Deprecating Microsoft Defender for IoT device alerts

**Estimated date for change:** March 2022 

All Microsoft Defender for IoT device alerts will no longer be visible in Microsoft Defender for Cloud. These alerts will still be available on Microsoft Defender for IoT's Alert page, and in Microsoft Sentinel.

### Multiple changes to identity recommendations

**Estimated date for change:** May 2022

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

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md)
