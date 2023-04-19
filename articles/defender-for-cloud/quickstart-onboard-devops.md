---
title: 'Quickstart: Connect your Azure DevOps repositories to Microsoft Defender for Cloud'
description: Learn how to connect your Azure DevOps repositories to Defender for Cloud.
ms.date: 01/24/2023
ms.topic: quickstart
ms.custom: ignite-2022
---

# Quickstart: Connect your Azure DevOps repositories to Microsoft Defender for Cloud

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same. Microsoft Defender for Cloud protects workloads in Azure, Amazon Web Services (AWS), Google Cloud Platform (GCP), GitHub, and Azure DevOps (ADO).

To protect your ADO-based resources, you can connect your ADO organizations on the environment settings page in Microsoft Defender for Cloud. This page provides a simple onboarding experience (including auto discovery). 

By connecting your Azure DevOps repositories to Defender for Cloud, you'll extend Defender for Cloud's enhanced security features to your ADO resources. These features include:

- **Defender for Cloud's Cloud Security Posture Management (CSPM) features** - Assesses your Azure DevOps resources according to ADO-specific security recommendations. You can also learn about all the [recommendations for DevOps](recommendations-reference.md) resources. Resources are assessed for compliance with built-in standards that are specific to DevOps. Defender for Cloud's [asset inventory page](asset-inventory.md) is a multicloud enabled feature that helps you manage your Azure DevOps resources alongside your Azure resources.

- **Defender for Cloud's Workload Protection features** - Extends Defender for Cloud's threat detection capabilities and advanced defenses to your Azure DevOps resources.

API calls performed by Defender for Cloud count against the [Azure DevOps Global consumption limit](/azure/devops/integrate/concepts/rate-limits?view=azure-devops). For more information, see the [FAQ section](#faq).

## Prerequisites

- An Azure account with Defender for Cloud onboarded. If you don't already have an Azure account [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- You must [configure the Microsoft Security DevOps Azure DevOps extension](azure-devops-extension.md).


## Availability

| Aspect | Details |
|--|--|
| Release state: | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. |
| Pricing: | For pricing, see the Defender for Cloud [pricing page](https://azure.microsoft.com/pricing/details/defender-for-cloud/?v=17.23h#pricing). |
| Required permissions: | **- Azure account:** with permissions to sign into Azure portal <br> **- Contributor:** on the Azure subscription where the connector will be created <br> **- Security Admin Role:** in Defender for Cloud <br> **- Organization Administrator:** in Azure DevOps <br> **- Basic or Basic + Test Plans Access Level:** in Azure DevOps. <br> - In Azure DevOps, configure: Third-party applications gain access via OAuth, which must be set to `On` . [Learn more about OAuth](/azure/devops/organizations/accounts/change-application-access-policies?view=azure-devops)|
| Regions: | Central US, West Europe, Australia East |
| Clouds: | :::image type="icon" source="media/quickstart-onboard-github/check-yes.png" border="false"::: Commercial clouds <br> :::image type="icon" source="media/quickstart-onboard-github/x-no.png" border="false"::: National (Azure Government, Azure China 21Vianet) |

## Connect your Azure DevOps organization

**To connect your Azure DevOps organization**:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment Settings**.

1. Select **Add environment**.

1. Select **Azure DevOps**.

    :::image type="content" source="media/quickstart-onboard-ado/devop-connector.png" alt-text="Screenshot that shows you where to navigate to select the DevOps connector." lightbox="media/quickstart-onboard-ado/devop-connector.png":::

1. Enter a name, select a subscription, resource group, and region.

    > [!NOTE] 
    > The subscription will be the location where Defender for DevOps will create and store the Azure DevOps connection.

1. Select **Next: Select plans**.

1. Select **Next: Authorize connection**.

1. Select **Authorize**.
    
    > [!NOTE]
    > The authorization will automatically login using the session from your browser's tab. After you select **Authorize**, if you don't see the Azure DevOps organizations you expect to see, check whether you are logged in to Microsoft Defender for Cloud in one browser tab and logged in to Azure DevOps in another browser tab.

1. In the popup screen, read the list of permission requests, and select **Accept**.

    :::image type="content" source="media/quickstart-onboard-ado/accept.png" alt-text="Screenshot that shows you the accept button, to accept the permissions.":::

1. Select your relevant organization(s) from the drop-down menu.

1. For projects

    - Select **Auto discover projects** to discover all projects automatically and apply auto discover to all current and future projects.
    
      or

    - Select your relevant project(s) from the drop-down menu.
    
    > [!NOTE]
    > If you select your relevant project(s) from the drop down menu, you will also need to select auto discover repositories or select individual repositories.

1. Select **Next: Review and create**.

1. Review the information and select **Create**.

The Defender for DevOps service automatically discovers the organizations, projects, and repositories you select and analyzes them for any security issues. 

When auto-discovery is selected during the onboarding process, it can take up to 4 hours for repositories to appear. 

The Inventory page populates with your selected repositories, and the Recommendations page shows any security issues related to a selected repository.

## Learn more

- Learn more about [Azure DevOps](https://learn.microsoft.com/azure/devops/?view=azure-devops).

- Learn how to [create your first pipeline](https://learn.microsoft.com/azure/devops/pipelines/create-first-pipeline?view=azure-devops&tabs=java%2Ctfs-2018-2%2Cbrowser).

## FAQ

### Do API calls made by Defender for Cloud count against my consumption limit?

Yes, API calls made by Defender for Cloud count against the [Azure DevOps Global consumption limit](/azure/devops/integrate/concepts/rate-limits?view=azure-devops). Defender for Cloud makes calls on-behalf of the user who onboards the connector.

### Why is my organization list empty in the UI?

If your organization list is empty in the UI after you onboarded an Azure DevOps connector, you need to ensure that the organization in Azure DevOps is connected to the Azure tenant that has the user who authenticated the connector.

For information on how to correct this issue, check out the [DevOps trouble shooting guide](troubleshooting-guide.md#troubleshoot-azure-devops-organization-connector-issues).

### I have a large Azure DevOps organization with many repositories.  Can I still onboard?

Yes, there is no limit to how many Azure DevOps repositories you can onboard to Defender for DevOps.  

However, there are two main implications when onboarding large organizations – speed and throttling. The speed of discovery for your DevOps repositories is determined by the number of projects for each connector (approximately 100 projects per hour). Throttling can happen because Azure DevOps API calls have a [global rate limit](https://learn.microsoft.com/azure/devops/integrate/concepts/rate-limits?view=azure-devops) and we limit the calls for project discovery to use a small portion of overall quota limits.

Consider using an alternative Azure DevOps identity (i.e., an Organization Administrator account used as a service account) to avoid individual accounts from being throttled when onboarding large organizations. Below are some scenarios of when to use an alternate identity to onboard a Defender for DevOps connector:
- Large number of Azure DevOps Organizations and Projects (~500 Projects or more).
- Large number of concurrent builds which peak during work hours.
- Authorized user is a [Power Platform](https://learn.microsoft.com/power-platform/) user making additional Azure DevOps API calls, using up the global rate limit quotas.

Once you have onboarded the Azure DevOps repositories using this account and [configured and ran the Microsoft Security DevOps Azure DevOps extension](https://learn.microsoft.com/azure/defender-for-cloud/azure-devops-extension) in your CI/CD pipeline, then the scanning results will appear near instantaneously in Microsoft Defender for Cloud.

## Next steps
Learn more about [Defender for DevOps](defender-for-devops-introduction.md).

Learn how to [configure pull request annotations](enable-pull-request-annotations.md) in Defender for Cloud.
