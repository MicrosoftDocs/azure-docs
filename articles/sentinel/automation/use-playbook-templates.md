---
title: Create and customize Microsoft Sentinel playbooks from templates | Microsoft Docs
description: This article shows how to create playbooks from and work with playbook templates, to customize them to fit your needs.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 03/14/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security

---

# Create and customize Microsoft Sentinel playbooks from content templates

A playbook template is a prebuilt, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates aren't active playbooks themselves, and you must create an editable copy for your needs.

Many playbook templates are developed by the Microsoft Sentinel community, independent software vendors (ISVs), and Microsoft's own experts, based on popular automation scenarios used by security operations centers around the world.

> [!IMPORTANT]
>
> **Playbook templates** are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]
<!--what abt prerequisites?-->

## Access playbook templates

Get playbook templates from the following sources:

|Location  |Description  |
|---------|---------|
|**Microsoft Sentinel Automation page**     |  The **Playbook templates** tab lists all installed playbooks. Create one or more active playbooks using the same templates. <br><br>When we publish a new version of a template, any active playbooks created from that template show up in the **Active playbooks** tab with a label that indicates that an update is available.       |
|**Microsoft Sentinel Content hub page**     |  Playbook templates are available as part of product solutions or standalone content installed from the **Content hub**.  <br><br>For more information, see [About Microsoft Sentinel content and solutions](../sentinel-solutions.md) and [Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md). |
|**GitHub**     |  The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) contains many playbook templates. They can be deployed to an Azure subscription by selecting the **Deploy to Azure** button.       |

Technically, a playbook template is an [Azure Resource Manager (ARM) template](../../azure-resource-manager/templates/index.yml) which consists of several resources: an Azure Logic Apps workflow and API connections for each connection involved.

This article focuses on deploying a playbook template from the **Playbook templates** tab under **Automation**.

For more information, see [Recommended playbook templates](playbooks-recommendations.md#recommended-playbook-templates).

## Explore playbook templates

For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Content management** > **Content hub** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

On the **Content hub** page, select **Content type** to filter for **Playbook**. This filtered view lists all the solutions and standalone content that include one or more playbook templates. Install the solution or standalone content to get the template.

Then, select **Configuration** > **Automation** > **Playbook templates** tab to view the installed templates. For example:

:::image type="content" source="media/use-playbook-templates/gallery.png" alt-text="Screenshot of the playbook templates gallery." lightbox="media/use-playbook-templates/gallery.png":::

To find a playbook template that fits your requirements, filter the list by the following criteria:

|Filter  |Description  |
|---------|---------|
|**Trigger**     |    indicates whether the playbook is triggered by incident creation, by incident update, or by alert creation. For more information, see [Supported Microsoft Sentinel triggers](playbook-triggers-actions.md#supported-microsoft-sentinel-triggers).|
|**Logic Apps connectors**     |   Shows the external services this playbook interacts with. During the deployment process, each connector needs to assume an identity to authenticate to the external service.      |
|**Entities**     |  Shows the entity types explicitly filtered and parsed by a playbook that expects to find those entity types in the incident. <br><br>For example, a playbook that tells a firewall to block an IP address expects to operate on incidents created by analytics rules that generate alerts containing IP addresses, such as a Brute Force attack detection rule.       |
|**Tags**     |  Show labels applied to the playbook to relate it to a specific scenario, or to indicate a special characteristic.   For example: <br><br>- **Enrichment** - The playbook fetches information from another service to add information to an incident. This information is typically added as a comment to the incident or sent to the SOC.<br> - **Remediation** - The playbook takes an action on the affected entities to eliminate a potential threat.<br>  - **Sync** - The playbook helps to keep an external service, such as an incident management service, updated with the incident's properties.<br>  - **Notification** - The playbook sends an email or message.<br>  - **Response from Teams** - The playbook allows the analysts to take a manual action from Teams using interactive cards.    |

For example:

:::image type="content" source="media/use-playbook-templates/filters.png" alt-text="Filter the list of playbook templates":::

## Customize a playbook from a template

This procedure describes how to deploy playbook templates. Repeat this process to create multiple playbooks on the same template.

1. Select a playbook name from the **Playbook templates** tab.

1. If the playbook has any prerequisites, make sure to follow the instructions. For example:

    - Some playbooks call other playbooks as actions. This second playbook is referred to as a **nested playbook**. In such a case, one of the prerequisites is to first deploy the nested playbook.

    - Some playbooks require deploying a custom Logic Apps connector or an Azure Function. In such cases, there's a **Deploy to Azure** link that takes you to the general ARM template deployment process.

1. Select **Create playbook** to open the playbook creation wizard based on the selected template. The wizard has four tabs:

    - **Basics:** Locate your new playbook, which is a Logic Apps resource, and give it a name. You can use the default. For example:

        :::image type="content" source="media/use-playbook-templates/basics.png" alt-text="Playbook creation wizard, basics tab":::

    - **Parameters:** Enter customer-specific values that the playbook uses. For example, if this playbook sends an email to the SOC, you can define the recipient address here. This tab is shown only if the playbook has parameters. For example:

        :::image type="content" source="media/use-playbook-templates/parameters.png" alt-text="Playbook creation wizard, parameters tab":::

        > [!NOTE]
        > If this playbook has a custom connector in use, it should be deployed in the same resource group, and you will be able to insert its name in this tab.

    - **Connections:** Expand each action to see the existing connections you created for previous playbooks. For example:

        :::image type="content" source="media/use-playbook-templates/connections.png" alt-text="Playbook creation wizard. connections tab":::

        If there aren't any connections, or if you want to create new ones, choose **Create new connection after deployment**. This option takes you to the Logic Apps designer after the deployment process is completed.

        > [!NOTE]
        > For custom connectors, connections are displayed by the name of the custom connector entered in the **Parameters** tab.

        For connectors that support [connecting with managed identity](authenticate-playbooks-to-sentinel.md#authenticate-with-a-managed-identity), such as **Microsoft Sentinel**, this is the connection method selected by default.

        For more information, see [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md).

    - **Review and Create:** View a summary of the process and await validation of your input before creating the playbook.

1. After following the steps in the playbook creation wizard to the end, you're taken to the new playbook's workflow design in the Logic Apps designer. For example:

    :::image type="content" source="media/use-playbook-templates/designer.png" alt-text="See playbook in Logic Apps designer":::

1. For each connector you chose, create a new connection for after deployment:

    1. From the navigation menu, select **API connections**.

    1. Select the connection name. For example:

        :::image type="content" source="media/use-playbook-templates/view-api-connections.png" alt-text="Screenshot showing how to view A P I connections.":::

    1. Select **Edit API connection** from the navigation menu.

    1. Fill in the required parameters and select **Save**. For example:

        :::image type="content" source="media/use-playbook-templates/edit-api-connection.png" alt-text="Screenshot showing how to edit A P I connections.":::

    Alternatively, create a new connection from within the relevant steps in the Logic Apps designer:

    1. For each step that appears with an error sign, select it to expand.

    1. Select **Add new**.

    1. Authenticate according to the relevant instructions.

    1. If there are other steps using this same connector, expand their boxes. From the list of connections that appears, select the connection you just created.

1. If you have chosen to use a managed identity connection for Microsoft Sentinel, or for other supported connections, grant permissions to the new playbook on the Microsoft Sentinel workspace or on the relevant target resources for other connectors.

1. Save the playbook. You'll now be able to see it in the **Active Playbooks** tab.

1. To run this playbook, set an automated response or run it manually. For more information, see [Respond to threats with Microsoft Sentinel playbooks](run-playbooks.md).

> [!NOTE]
> Most of the templates can be used as is, but we recommend making any adjustments required to fit the new playbook to your SOC needs.
>

## Report an issue in a playbook template

To report a bug or request an improvement for a playbook, select the **Supported by** link in the playbook's details pane. If this is a community-supported playbook, the link takes you to open a GitHub issue. Otherwise, you're directed to the supporter's page.

## Related content

In this article, you learned how to work with playbook templates, creating and customizing playbooks to fit your needs. Learn more about playbooks and automation in Microsoft Sentinel:

- [Security Orchestration, Automation, and Response (SOAR) in Microsoft Sentinel](automation.md)
- [Automate threat response with Microsoft Sentinel playbooks](automate-responses-with-playbooks.md)
- [Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Use triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md)