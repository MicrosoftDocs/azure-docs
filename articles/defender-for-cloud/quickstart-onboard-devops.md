---
title: Connect your Azure DevOps repositories
description: Learn how to connect your Azure DevOps repositories to Defender for Cloud.
ms.date: 01/24/2023
ms.topic: quickstart
ms.custom: ignite-2022
---

# Quickstart: Connect your Azure DevOps repositories to Microsoft Defender for Cloud

Cloud workloads commonly span multiple cloud platforms. Cloud security services must do the same. Microsoft Defender for Cloud helps protect workloads in Azure, Amazon Web Services, Google Cloud Platform, GitHub, and Azure DevOps.

In this quickstart, you connect your Azure DevOps organizations on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience (including auto-discovery).

By connecting your Azure DevOps repositories to Defender for Cloud, you extend the security features of Defender for Cloud to your Azure DevOps resources. These features include:

- **Microsoft Defender Cloud Security Posture Management features**: You can assess your Azure DevOps resources for compliance with Azure DevOps-specific security recommendations. You can also learn about all the [recommendations for DevOps](recommendations-reference.md) resources. The Defender for Cloud [asset inventory page](asset-inventory.md) is a multicloud-enabled feature that helps you manage your Azure DevOps resources alongside your Azure resources.

- **Workload protection features**: You can extend the threat detection capabilities and advanced defenses in Defender for Cloud to your Azure DevOps resources.

API calls that Defender for Cloud performs count against the [Azure DevOps global consumption limit](/azure/devops/integrate/concepts/rate-limits). For more information, see the [common questions about Microsoft Defender for DevOps](faq-defender-for-devops.yml).

## Prerequisites

To complete this quickstart, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- The [Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md) configured.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). |
| Required permissions: | **Account Administrator** with permissions to sign in to the Azure portal. <br> **Contributor** on the Azure subscription where the connector will be created. <br> **Security Admin** in Defender for Cloud. <br> **Organization Administrator** in Azure DevOps. <br> **Basic or Basic + Test Plans Access Level** in Azure DevOps. Third-party applications gain access via OAuth, which must be set to `On`. [Learn more about OAuth](/azure/devops/organizations/accounts/change-application-access-policies).|
| Regions: | Central US, West Europe, Australia East |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

## Connect your Azure DevOps organization

To connect your Azure DevOps organization to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **Azure DevOps**.

    :::image type="content" source="media/quickstart-onboard-ado/devop-connector.png" alt-text="Screenshot that shows selections for adding Azure DevOps as a connector." lightbox="media/quickstart-onboard-ado/devop-connector.png":::

1. Enter a name, subscription, resource group, and region.

    The subscription is the location where Microsoft Defender for DevOps creates and stores the Azure DevOps connection.

1. Select **Next: Select plans**.

1. Select **Next: Authorize connection**.

1. Select **Authorize**.

   The authorization automatically signs in by using the session from your browser's tab. After you select **Authorize**, if you don't see the Azure DevOps organizations that you expect, check whether you're signed in to Microsoft Defender for Cloud on one browser tab and signed in to Azure DevOps on another browser tab.

1. In the popup dialog, read the list of permission requests, and then select **Accept**.

    :::image type="content" source="media/quickstart-onboard-ado/accept.png" alt-text="Screenshot that shows the button for accepting permissions.":::

1. Select your relevant organizations from the drop-down menu.

1. For projects, do one of the following:

    - Select **Auto discover projects** to discover all projects automatically and apply auto-discovery to all current and future projects.

    - Select your relevant projects from the drop-down menu. Then, select **Auto-discover repositories** or select individual repositories.

1. Select **Next: Review and create**.

1. Review the information, and then select **Create**.

The Defender for DevOps service automatically discovers the organizations, projects, and repositories that you selected and analyzes them for any security problems.

When you select auto-discovery during the onboarding process, repositories can take up to 4 hours to appear.

The **Inventory** page shows your selected repositories. The **Recommendations** page shows any security problems related to a selected repository.

## Next steps

- Learn more about [Defender for DevOps](defender-for-devops-introduction.md).
- Learn more about [Azure DevOps](/azure/devops/).
- Learn how to [create your first pipeline](/azure/devops/pipelines/create-first-pipeline).
- Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud.
