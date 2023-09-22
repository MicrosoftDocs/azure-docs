---
title: Connect your GitHub repositories
description: Learn how to connect your GitHub repositories to Defender for Cloud.
ms.date: 01/24/2023
ms.topic: quickstart
ms.custom: ignite-2022
---

# Quickstart: Connect your GitHub repositories to Microsoft Defender for Cloud

Cloud workloads commonly span multiple cloud platforms. Cloud security services must do the same. Microsoft Defender for Cloud helps protect workloads in Azure, Amazon Web Services, Google Cloud Platform, GitHub, and Azure DevOps.

In this quickstart, you connect your GitHub organizations on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience (including auto-discovery).

By connecting your GitHub repositories to Defender for Cloud, you extend the enhanced security features of Defender for Cloud to your GitHub resources. These features include:

- **Cloud Security Posture Management features**: You can assess your GitHub resources according to GitHub-specific security recommendations. You can also learn about all of the [recommendations for DevOps](recommendations-reference.md) resources. Resources are assessed for compliance with built-in standards that are specific to DevOps. The Defender for Cloud [asset inventory page](asset-inventory.md) is a multicloud-enabled feature that helps you manage your GitHub resources alongside your Azure resources.

- **Workload protection features**: You can extend Defender for Cloud threat detection capabilities and advanced defenses to your GitHub resources.

## Prerequisites

To complete this quickstart, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- GitHub Enterprise with GitHub Advanced Security enabled, so you can use all advanced security capabilities that the GitHub connector provides in Defender for Cloud.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing).
| Required permissions: | **Account Administrator** with permissions to sign in to the Azure portal. <br> **Contributor** on the Azure subscription where the connector will be created.  <br> **Security Admin** in Defender for Cloud. <br> **Organization Administrator** in GitHub. |
| GitHub supported versions: | GitHub Free, Pro, Team, and Enterprise Cloud |
| Regions: | Australia East, Central US, West Europe |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |


## Connect your GitHub account

To connect your GitHub account to Microsoft Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **GitHub**.

    :::image type="content" source="media/quickstart-onboard-github/select-github.png" alt-text="Screenshot that shows selections for adding GitHub as a connector." lightbox="media/quickstart-onboard-github/select-github.png":::

1. Enter a name (limit of 20 characters), and then select your subscription, resource group, and region.

   The subscription is the location where Defender for Cloud creates and stores the GitHub connection.

1. Select **Next: Select plans**.

1. Select **Next: Authorize connection**.

1. Select **Authorize** to grant your Azure subscription access to your GitHub repositories. Sign in, if necessary, with an account that has permissions to the repositories that you want to protect.

   The authorization automatically signs in by using the session from your browser's tab. After you select **Authorize**, if you don't see the GitHub organizations that you expect, check whether you're signed in to Microsoft Defender for Cloud on one browser tab and signed in to GitHub on another browser tab.

    After authorization, if you wait too long to install the DevOps application, the session will time out and you'll get an error message.

1. Select **Install**.

1. Select the repositories to install the GitHub application.

    This step grants Defender for Cloud access to the selected repositories.

1. Select **Next: Review and create**.

1. Select **Create**.

When the process finishes, the GitHub connector appears on your **Environment settings** page.

:::image type="content" source="media/quickstart-onboard-github/github-connector.png" alt-text="Screenshot that shows the environment settings page with the GitHub connector now connected." lightbox="media/quickstart-onboard-github/github-connector.png":::

The Defender for Cloud service automatically discovers the repositories that you selected and analyzes them for any security problems. Initial repository discovery can take up to 10 minutes during the onboarding process.

When you select auto-discovery during the onboarding process, repositories can take up to 4 hours to appear after onboarding is completed. The auto-discovery process detects any new repositories and connects them to Defender for Cloud.

The **Inventory** page shows your selected repositories. The **Recommendations** page shows any security problems related to a selected repository. This information can take 3 hours or more to appear.

## Learn more

- [Azure and GitHub integration](/azure/developer/github/)
- [Security hardening for GitHub Actions](https://docs.github.com/actions/security-guides/security-hardening-for-github-actions)

## Next steps

- Learn about [Defender for DevOps](defender-for-devops-introduction.md).
- Learn how to [configure the Microsoft Security DevOps GitHub action](github-action.md).
- Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud.
