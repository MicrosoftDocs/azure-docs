---
title: 'Quickstart: Connect your Azure DevOps to Microsoft Defender for Cloud'
description: Learn how to connect your Azure DevOps to Defender for Cloud.
ms.date: 09/06/2022
ms.topic: quickstart
---

# Quickstart: Connect your Azure DevOps to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. Microsoft Defender for Cloud protects workloads in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), GitHub and Azure DevOps (ADO).

To protect your ADO-based resources, you can connect your ADO organizations on the environment settings page. This page provides a simple onboarding experience (including auto discovery). 

When you connect your ADO to Defender for Cloud, you're extending Defender for Cloud's enhanced security features and CSPM features to your Azure DevOps resources. This feature assesses your ADO resources with ADO-specific security recommendations that are included in your secure score. Your resources will also be assessed for compliance with built-in standards specific to DevOps. Defender for Cloud's [asset inventory page](asset-inventory.md) is a multicloud enabled feature helping you manage your Azure DevOps resources alongside your Azure resources. 


You can view all of the [recommendations for DevOps](recommendations-reference.md) resources.

## Prerequisites


- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Download and install the [Microsoft Security DevOps for Azure DevOps](https://marketplace.visualstudio.com/items?itemName=ms-securitydevops.microsoft-security-devops-azdevops) extension for Visual Studio Code.

## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Pricing: | The Defender for DevOps plan is free during the Preview. <br><br> After which it will be billed. Pricing to be determined at a later date. |
| Required roles and permissions: | **Contributor** on the relevant Azure subscription <br> **Security Admin Role** in Defender for Cloud <br> **Azure DevOps Organization Administrator**  <br> Third-party applications can gain access using an OAuth which must be set to `On` . [Learn more about Oath](/azure/devops/organizations/accounts/change-application-access-policies?view=azure-devops)|
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial clouds <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Azure China 21Vianet) |

## Connect your Azure DevOps organization

**To connect your Azure DevOps organization**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment Settings**.

1. Select **Add environment**.

1. Select **Azure DevOps**.

    :::image type="content" source="media/quickstart-onboard-ado/devop-connector.png" alt-text="Screenshot that shows you where to navigate to select the DevOps connector.":::

1. Enter a name, select a subscription, resource group, and region.

    > [!NOTE] 
    > The subscription will be the location where Defender for DevOps will create and store the Azure DevOps connection.


1. Select **Next: Select plans >**.

1. Select **Next: Authorize connection >**

1. Select **Authorize**.

1. In the popup screen, read the list of permission requests, and select **Accept**.

    :::image type="content" source="media/quickstart-onboard-ado/accept.png" alt-text="Screenshot that shows you the accept button, to accept the permissions.":::

1. Select your relevant organization(s) from the drop-down menu.

1. For projects

    - Select **Auto discover projects** to discover all projects automatically and apply auto discover to all current and future projects.
    
      or

    - Select your relevant project(s) from the drop-down menu.
    
    > [!NOTE]
    > If you select your relevant project(s) rom the drop down menu, you will also need select to auto discover repositories or select individual repositories.

1. Select **Next: Review and create >**

1. Review the information and select **Create**

Defender for DevOps will discover your organizations, projects, and repositories and analyzes any security issues. Once security issues are discovered, the Inventory page populates with the associated repositories, and the Recommendations page populates with any security issues related to a repository.

## Learn more

- Learn how to [create your first pipeline](/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).
- Learn more about [Azure DevOps](/azure/devops/?view=azure-devops).

## Next steps
Learn more about [Defender for DevOps](defender-for-devops-introduction.md)
