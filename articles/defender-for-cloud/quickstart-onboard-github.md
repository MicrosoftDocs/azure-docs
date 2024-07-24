---
title: Connect your GitHub organizations
description: Learn how to connect your GitHub Environment to Defender for Cloud and enhance the security of your GitHub resources.
ms.date: 05/30/2024
ms.topic: quickstart
ms.custom: ignite-2023
#customer intent: As a user, I want to learn how to connect my GitHub Environment to Defender for Cloud so that I can enhance the security of my GitHub resources.
---

# Quick Start: Connect your GitHub Environment to Microsoft Defender for Cloud

In this quick start, you connect your GitHub organizations on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience to autodiscover your GitHub repositories.

By connecting your GitHub environments to Defender for Cloud, you extend the security capabilities of Defender for Cloud to your GitHub resources and improve security posture. [Learn more](defender-for-devops-introduction.md).



## Prerequisites

To complete this quick start, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

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

## Connect your GitHub environment

To connect your GitHub environment to Microsoft Defender for Cloud:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **GitHub**.

    :::image type="content" source="media/quickstart-onboard-github/select-github.png" alt-text="Screenshot that shows selections for adding GitHub as a connector." lightbox="media/quickstart-onboard-github/select-github.png":::

1. Enter a name (limit of 20 characters), and then select your subscription, resource group, and region.

   The subscription is the location where Defender for Cloud creates and stores the GitHub connection.
   
1. Select **Next: Configure access**.

1. Select **Authorize** to grant your Azure subscription access to your GitHub repositories. Sign in, if necessary, with an account that has permissions to the repositories that you want to protect.

    After authorization, if you wait too long to install the DevOps security GitHub application, the session will time out and you'll get an error message.

1. Select **Install**.

1. Select the organizations to install the Defender for Cloud GitHub application. It's recommended to grant access to **all repositories** to ensure Defender for Cloud can secure your entire GitHub environment.

    This step grants Defender for Cloud access to organizations that you wish to onboard. 
   
1. All organizations with the Defender for Cloud GitHub application installed will be onboarded to Defender for Cloud. To change the behavior going forward, select one of the following: 

   - Select **all existing organizations** to automatically discover all repositories in GitHub organizations where the DevOps security GitHub application is installed.
      
   - Select **all existing and future organizations** to automatically discover all repositories in GitHub organizations where the DevOps security GitHub application is installed and future organizations where the DevOps security GitHub application is installed.
     > [!NOTE] 
     > Organizations can be removed from your connector after the connector creation is complete. See the [editing your DevOps connector](edit-devops-connector.md) page for more information.
     
1. Select **Next: Review and generate**.

1. Select **Create**.

When the process finishes, the GitHub connector appears on your **Environment settings** page.

:::image type="content" source="media/quickstart-onboard-github/github-connector.png" alt-text="Screenshot that shows the environment settings page with the GitHub connector now connected." lightbox="media/quickstart-onboard-github/github-connector.png":::

The Defender for Cloud service automatically discovers the organizations where you installed the DevOps security GitHub application.

> [!NOTE]
> To ensure proper functionality of advanced DevOps posture capabilities in Defender for Cloud, only one instance of a GitHub organization can be onboarded to the Azure Tenant you are creating a connector in.

Upon successful onboarding, DevOps resources (e.g., repositories, builds) will be present within the Inventory and DevOps security pages. It might take up to 8 hours for resources to appear. Security scanning recommendations might require [an additional step to configure your workflows](github-action.md). Refresh intervals for security findings vary by recommendation and details can be found on the Recommendations page.

## Next steps

- Learn about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
- Learn how to [configure the Microsoft Security DevOps GitHub action](github-action.md).
