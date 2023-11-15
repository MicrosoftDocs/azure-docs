---
title: Connect your GitLab groups
description: Learn how to connect your GitLab Environment to Defender for Cloud.
ms.date: 01/24/2023
ms.topic: quickstart
ms.custom: ignite-2023
---

# Quickstart: Connect your GitLab Environment to Microsoft Defender for Cloud

In this quickstart, you connect your GitLab groups on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience to autodiscover your GitLab resources.

By connecting your GitLab groups to Defender for Cloud, you extend the security capabilities of Defender for Cloud to your GitLab resources. These features include:

- **Foundational Cloud Security Posture Management (CSPM) features**: You can assess your GitLab security posture through GitLab-specific security recommendations. You can also learn about all the [recommendations for DevOps](recommendations-reference.md) resources.

- **Defender CSPM features**: Defender CSPM customers receive code to cloud contextualized attack paths, risk assessments, and insights to identify the most critical weaknesses that attackers can use to breach their environment. Connecting your GitLab projects will allow you to contextualize DevOps security findings with your cloud workloads and identify the origin and developer for timely remediation. For more information, learn how to [identify and analyze risks across your environment](concept-attack-path.md)

## Prerequisites

To complete this quickstart, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- GitLab Ultimate license for your GitLab Group.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). |
| Required permissions: | **Account Administrator** with permissions to sign in to the Azure portal. <br> **Contributor** to create a connector on the Azure subscription. <br> **Group Owner** on the GitLab Group. 
| Regions and availability: | Refer to the [support and prerequisites](devops-support.md) section for region support and feature availability.  |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

> [!NOTE]
> **Security Reader** role can be applied on the Resource Group/GitLab connector scope to avoid setting highly privileged permissions on a Subscription level for read access of DevOps security posture assessments.

## Connect your GitLab Group

To connect your GitLab Group to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **GitLab**.

    :::image type="content" source="media/quickstart-onboard-gitlab/gitlab-connector.png" alt-text="Screenshot that shows selections for adding GitLab as a connector." lightbox="media/quickstart-onboard-gitlab/gitlab-connector.png":::

1. Enter a name, subscription, resource group, and region.

    The subscription is the location where Microsoft Defender for Cloud creates and stores the GitLab connection.

1. Select **Next: select plans**. Configure the Defender CSPM plan status for your GitLab connector. Advanced DevOps posture capabilities under Defender CSPM are free for all Defender for Cloud users until March 1, 2024.

    :::image type="content" source="media/quickstart-onboard-ado/select-plans.png" alt-text="Screenshot that shows plan selection for DevOps connectors." lightbox="media/quickstart-onboard-ado/select-plans.png":::

1. Select **Next: Configure access**.

1. Select **Authorize**. 

1. In the popup dialog, read the list of permission requests, and then select **Accept**.

1. For Groups, select one of the following:

    - Select **all existing groups** to autodiscover all subgroups and projects in groups you are currently an Owner in.
    - Select **all existing and future groups** to autodiscover all subgroups and projects in all current and future groups you are an Owner in.

Since GitLab projects are onboarded at no additional cost, autodiscover is applied across the group to ensure Defender for Cloud can comprehensively assess the security posture and respond to security threats across your entire DevOps ecosystem. Groups can later be manually added and removed through **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Next: Review and generate**.

1. Review the information, and then select **Create**.

> [!NOTE]
> To ensure proper functionality of advanced DevOps posture capabilities in Defender for Cloud, only one instance of a GitLab group can be onboarded to the Azure Tenant you are creating a connector in.

The **DevOps security** blade shows your onboarded repositories by GitLab group. The **Recommendations** blade shows all security assessments related to GitLab projects.

## Next steps

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
