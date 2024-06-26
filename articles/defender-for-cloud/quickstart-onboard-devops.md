---
title: Connect your Azure DevOps organizations
description: Learn how to connect your Azure DevOps environment to Defender for Cloud.
ms.date: 03/12/2024
ms.topic: quickstart
ms.custom: ignite-2023
---

# Quickstart: Connect your Azure DevOps Environment to Microsoft Defender for Cloud

This quickstart shows you how to connect your Azure DevOps organizations on the **Environment settings** page in Microsoft Defender for Cloud. This page provides a simple onboarding experience to autodiscover your Azure DevOps repositories.

By connecting your Azure DevOps organizations to Defender for Cloud, you extend the security capabilities of Defender for Cloud to your Azure DevOps resources. These features include:

- **Foundational Cloud Security Posture Management (CSPM) features**: You can assess your Azure DevOps security posture through Azure DevOps-specific security recommendations. You can also learn about all the [recommendations for DevOps](recommendations-reference.md) resources.

- **Defender CSPM features**: Defender CSPM customers receive code to cloud contextualized attack paths, risk assessments, and insights to identify the most critical weaknesses that attackers can use to breach their environment. Connecting your Azure DevOps repositories allows you to contextualize DevOps security findings with your cloud workloads and identify the origin and developer for timely remediation. For more information, learn how to [identify and analyze risks across your environment](concept-attack-path.md).

API calls that Defender for Cloud performs count against the [Azure DevOps global consumption limit](/azure/devops/integrate/concepts/rate-limits). For more information, see the [common questions about DevOps security in Defender for Cloud](faq-defender-for-devops.yml).

## Prerequisites

To complete this quickstart, you need:

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Availability

| Aspect | Details |
|--|--|
| Release state: | General Availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). |
| Required permissions: | **Account Administrator** with permissions to sign in to the Azure portal. <br> **Contributor** to create a connector on the Azure subscription. <br> **Project Collection Administrator** on the Azure DevOps Organization. <br> **Basic or Basic + Test Plans Access Level** on the Azure DevOps Organization. <br> _Make sure you have BOTH Project Collection Administrator permissions and Basic Access Level for all Azure DevOps organizations you wish to onboard. Stakeholder Access Level is not sufficient._ <br> **Third-party application access via OAuth**, which must be set to `On` on the Azure DevOps Organization. [Learn more about OAuth and how to enable it in your organizations](/azure/devops/organizations/accounts/change-application-access-policies).|
| Regions and availability: | Refer to the [support and prerequisites](devops-support.md) section for region support and feature availability.  |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Microsoft Azure operated by 21Vianet) |

> [!NOTE]
> **Security Reader** role can be applied on the Resource Group/Azure DevOps connector scope to avoid setting highly privileged permissions on a Subscription level for read access of DevOps security posture assessments.

## Connect your Azure DevOps organization

> [!NOTE]
> After connecting Azure DevOps to Defender for Cloud, the Microsoft Defender for DevOps Container Mapping extension will be automatically shared and installed on all connected Azure DevOps organizations. This extension allows Defender for Cloud to extract metadata from pipelines, such as a container's digest ID and name. This metadata is used to connect DevOps entities with their related cloud resources. [Learn more about container mapping](container-image-mapping.md).

To connect your Azure DevOps organization to Defender for Cloud by using a native connector:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Add environment**.

1. Select **Azure DevOps**.

    :::image type="content" source="media/quickstart-onboard-ado/devop-connector.png" alt-text="Screenshot that shows selections for adding Azure DevOps as a connector." lightbox="media/quickstart-onboard-ado/devop-connector.png":::

1. Enter a name, subscription, resource group, and region.

    The subscription is the location where Microsoft Defender for Cloud creates and stores the Azure DevOps connection.

1. Select **Next: Configure access**.

1. Select **Authorize**. Ensure you're authorizing the correct Azure Tenant using the drop-down menu in [Azure DevOps](https://aex.dev.azure.com/me?mkt) and by verifying you're in the correct Azure Tenant in Defender for Cloud.

1. In the popup dialog, read the list of permission requests, and then select **Accept**.

    :::image type="content" source="media/quickstart-onboard-ado/accept.png" alt-text="Screenshot that shows the button for accepting permissions."  lightbox="media/quickstart-onboard-ado/accept.png":::

1. For Organizations, select one of the following options:

    - Select **all existing organizations** to auto-discover all projects and repositories in organizations you're currently a Project Collection Administrator in.
    - Select **all existing and future organizations** to auto-discover all projects and repositories in all current and future organizations you're a Project Collection Administrator in.

    > [!NOTE]
    > **Third-party application access via OAuth** must be set to `On` on for each Azure DevOps Organization. [Learn more about OAuth and how to enable it in your organizations](/azure/devops/organizations/accounts/change-application-access-policies).

    Since Azure DevOps repositories are onboarded at no extra cost, autodiscover is applied across the organization to ensure Defender for Cloud can comprehensively assess the security posture and respond to security threats across your entire DevOps ecosystem. Organizations can later be manually added and removed through **Microsoft Defender for Cloud** > **Environment settings**.

1. Select **Next: Review and generate**.

1. Review the information, and then select **Create**.

> [!NOTE]
> To ensure proper functionality of advanced DevOps posture capabilities in Defender for Cloud, only one instance of an Azure DevOps organization can be onboarded to the Azure Tenant you're creating a connector in.

Upon successful onboarding, DevOps resources (e.g., repositories, builds) will be present within the Inventory and DevOps security pages. It might take up to 8 hours for resources to appear. Security scanning recommendations might require [an additional step to configure your pipelines](azure-devops-extension.yml). Refresh intervals for security findings vary by recommendation and details can be found on the Recommendations page.

## Next steps

- Learn more about [DevOps security in Defender for Cloud](defender-for-devops-introduction.md).
- Configure the [Microsoft Security DevOps task in your Azure Pipelines](azure-devops-extension.yml).
- [Troubleshoot your Azure DevOps connector](troubleshooting-guide.md#troubleshoot-connector-problems-for-the-azure-devops-organization)
