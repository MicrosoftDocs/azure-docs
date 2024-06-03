---
title: Connect your GitHub organizations
description: Learn how to connect your GitHub Environment to Defender for Cloud and enhance the security of your GitHub resources.
ms.date: 05/30/2024
ms.topic: quickstart
ms.custom: ignite-2023
#customer intent: As a user, I want to learn how to connect my GitHub Environment to Defender for Cloud so that I can enhance the security of my GitHub resources.
---

# Quickstart: Connect your GitHub Environment to Microsoft Defender for Cloud

In this quickstart, you connect your GitHub organizations on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience to autodiscover your GitHub repositories.

By connecting your GitHub organizations to Defender for Cloud, you extend the security capabilities of Defender for Cloud to your GitHub resources. These features include:

- **Foundational Cloud Security Posture Management (CSPM) features**: You can assess your GitHub security posture through GitHub-specific security recommendations. You can also learn about all the [recommendations for GitHub](recommendations-reference.md) resources.

- **Defender CSPM features**: Defender CSPM customers receive code to cloud contextualized attack paths, risk assessments, and insights to identify the most critical weaknesses that attackers can use to breach their environment. Connecting your GitHub repositories allows you to contextualize DevOps security findings with your cloud workloads and identify the origin and developer for timely remediation. For more information, learn how to [identify and analyze risks across your environment](concept-attack-path.md).

## Prerequisites

To complete this quickstart, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- GitHub Enterprise with GitHub Advanced Security enabled for posture assessments of secrets, dependencies, IaC misconfigurations, and code quality analysis within GitHub repositories.

## Availability

| Aspect | Details |
|--|--|
| Release state: | General Availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing) |
| Required permissions: | **Account Administrator** with permissions to sign in to the Azure portal. <br> **Contributor** to create the connector on the Azure subscription.  <br> **Organization Owner** in GitHub. |
| GitHub supported versions: | GitHub Free, Pro, Team, and Enterprise Cloud |
| Regions and availability: | Refer to the [support and prerequisites](devops-support.md) section for region support and feature availability.|
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

> [!NOTE]
> **Security Reader** role can be applied on the Resource Group/GitHub connector scope to avoid setting highly privileged permissions on a Subscription level for read access of DevOps security posture assessments.

## Connect your GitHub account

To connect your GitHub account to Microsoft Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **GitHub**.

    :::image type="content" source="media/quickstart-onboard-github/select-github.png" alt-text="Screenshot that shows selections for adding GitHub as a connector." lightbox="media/quickstart-onboard-github/select-github.png":::

1. Enter a name (limit of 20 characters), and then select your subscription, resource group, and region.

   The subscription is the location where Defender for Cloud creates and stores the GitHub connection.

1. Select **Next: select plans**. Configure the Defender CSPM plan status for your GitHub connector. Learn more about [Defender CSPM](concept-cloud-security-posture-management.md) and see [Support and prerequisites](devops-support.md) for premium DevOps security features.

    :::image type="content" source="media/quickstart-onboard-ado/select-plans.png" alt-text="Screenshot that shows plan selection for DevOps connectors." lightbox="media/quickstart-onboard-ado/select-plans.png":::

1. Select **Next: Configure access**.

1. Select **Authorize** to grant your Azure subscription access to your GitHub repositories. Sign in, if necessary, with an account that has permissions to the repositories that you want to protect.

    After authorization, if you wait too long to install the DevOps security GitHub application, the session will time out and you'll get an error message.

1. Select **Install**.

1. Select the organizations to install the GitHub application. It's recommended to grant access to **all repositories** to ensure Defender for Cloud can secure your entire GitHub environment.

    This step grants Defender for Cloud access to the selected organizations.

1. For Organizations, select one of the following:

    - Select **all existing organizations** to autodiscover all repositories in GitHub organizations where the DevOps security GitHub application is installed.
    - Select **all existing and future organizations** to autodiscover all repositories in GitHub organizations where the DevOps security GitHub application is installed and future organizations where the DevOps security GitHub application is installed.

1. Select **Next: Review and generate**.

1. Select **Create**.

When the process finishes, the GitHub connector appears on your **Environment settings** page.

:::image type="content" source="media/quickstart-onboard-github/github-connector.png" alt-text="Screenshot that shows the environment settings page with the GitHub connector now connected." lightbox="media/quickstart-onboard-github/github-connector.png":::

The Defender for Cloud service automatically discovers the organizations where you installed the DevOps security GitHub application.

> [!NOTE]
> To ensure proper functionality of advanced DevOps posture capabilities in Defender for Cloud, only one instance of a GitHub organization can be onboarded to the Azure Tenant you are creating a connector in.

Upon successful onboarding, DevOps resources (e.g., repositories, builds) will be present within the Inventory and DevOps security pages. It might take up to 8 hours for resources to appear. Security scanning recommendations might require [an additional step to configure your pipelines](azure-devops-extension.yml). Refresh intervals for security findings vary by recommendation and details can be found on the Recommendations page.

## Next steps

- Learn about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
- Learn how to [configure the Microsoft Security DevOps GitHub action](github-action.md).
