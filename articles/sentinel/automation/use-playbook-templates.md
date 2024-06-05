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

# Create and customize Microsoft Sentinel playbooks from templates

A playbook template is a prebuilt, tested, and ready-to-use automation workflow for Microsoft Sentinel that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates aren't active playbooks themselves, and you must create an editable copy for your needs.

Many playbook templates are developed by the Microsoft Sentinel community, independent software vendors (ISVs), and Microsoft's own experts, based on popular automation scenarios used by security operations centers around the world.

> [!IMPORTANT]
>
> **Playbook templates** are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](../includes/unified-soc-preview-without-alert.md)]

## Prerequisites

To create and manage playbooks, you need access to Microsoft Sentinel with one of the following Azure roles:

- **Logic App Contributor**, to edit and manage logic apps
- **Logic App operator**, to read, enable, and disable logic apps

For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

We recommend that you read [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md) before creating your playbook.

## Access playbook templates

Access playbook templates from the following sources:

|Location  |Description  |
|---------|---------|
|**Microsoft Sentinel Automation page**     |  The **Playbook templates** tab lists all installed playbooks. Create one or more active playbooks using the same template.  <br><br>When we publish a new version of a template, any active playbooks created from that template have an extra label added in the **Active playbooks** tab to indicate that an update is available.    |
|**Microsoft Sentinel Content hub page**     |   Playbook templates are available as part of product solutions or standalone content installed from the **Content hub**.  <br><br>For more information, see: <br> [About Microsoft Sentinel content and solutions](../sentinel-solutions.md) <br>[Discover and manage Microsoft Sentinel out-of-the-box content](../sentinel-solutions-deploy.md)|
|**GitHub**     |    The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) contains many other playbook templates. Select **Deploy to Azure** to deploy a template to your Azure subscription.|

Technically, a playbook template is an [Azure Resource Manager (ARM) template](/azure/azure-resource-manager/templates/), which consists of several resources: an Azure Logic Apps workflow and API connections for each connection involved.

This article focuses on deploying a playbook template from the **Playbook templates** tab under **Automation**.

## Explore playbook templates

For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Content management** > **Content hub** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Content management** > **Content hub**.

On the **Content hub** page, select **Content type** to filter for **Playbook**. This filtered view lists all the solutions and standalone content that include one or more playbook templates. Install the solution or standalone content to get the template.

Then, select **Configuration** > **Automation** > **Playbook templates** tab to view the installed templates. For example:

:::image type="content" source="../media/use-playbook-templates/gallery.png" alt-text="Screenshot of the playbook templates gallery." lightbox="../media/use-playbook-templates/gallery.png":::

To find a playbook template that fits your requirements, filter the list by the following criteria:

|Filter  |Description  |
|---------|---------|
|**Trigger**     |    Filter by how the playbook is triggered, including incidents, alerts, or entities. For more information, see [Supported Microsoft Sentinel triggers](playbook-triggers-actions.md#supported-microsoft-sentinel-triggers).|
|**Logic Apps connectors**     |   Filter by the external services the playbooks interact with. During the deployment process, each connector needs to assume an identity to authenticate to the external service.      |
|**Entities**     |  Filter by the entity types that the playbook expects to find in the incident. <br><br>For example, a playbook that tells a firewall to block an IP address expects to to find IP addresses in the incident. Such incidents might be created by a Brute Force attack analytics rule.       |
|**Tags**     |  Filter by the labels applied to the playbook, relating the playbook to a specific scenario, or indicating special characteristic.   For example: <br><br>- **Enrichment** - Playbooks that fetch information from another service to add context to an incident. This information is typically added as a comment to the incident or sent to the SOC.<br> - **Remediation** - Playbooks that take an action on the affected entities to eliminate a potential threat.<br>  - **Sync** - Playbook that help to keep an external service, such as an incident management service, updated with the incident's properties.<br>  - **Notification** - Playbooks that send an email or message.<br>  - **Response from Teams** - Playbooks that allow analysts to take a manual action from Teams using interactive cards.    |

For example:

:::image type="content" source="../media/use-playbook-templates/filters.png" alt-text="Screenshot of how to filter the list of playbook templates.":::

## Customize a playbook from a template

This procedure describes how to deploy playbook templates, and can be repeated to create multiple playbooks from the same template.

While most playbook templates can be used as they are, we recommend that you adjust them as needed to fit your playbook to your SOC needs.

1. On the **Playbook templates** tab, select a playbook to start from.

1. If the playbook has any prerequisites, make sure to follow the instructions. For example:

    - Some playbooks call other playbooks as actions. This second playbook is referred to as a **nested playbook**. In such a case, one of the prerequisites is to first deploy the nested playbook.

    - Some playbooks require deploying a custom Logic Apps connector or an Azure Function. In such cases, there's a **Deploy to Azure** link that takes you to the general ARM template deployment process.

1. Select **Create playbook** to open the playbook creation wizard based on the selected template. The wizard has four tabs:

    - **Basics:** Locate your new playbook, which is a Logic Apps resource, and give it a name. You can use the default. For example:

        :::image type="content" source="../media/use-playbook-templates/basics.png" alt-text="Screenshot of the Playbook creation wizard, basics tab.":::

    - **Parameters:** Enter customer-specific values that the playbook uses. For example, if the playbook sends an email to the SOC, define the recipient address. If the playbook has a custom connector in use, it must be deployed in the same resource group, and you're prompted to enter its name in the **Parameters** tab.
    
        The **Parameters** tab shows only if the playbook has parameters. For example:

        :::image type="content" source="../media/use-playbook-templates/parameters.png" alt-text="Screenshot of the Playbook creation wizard, parameters tab.":::

    - **Connections:** Expand each action to see the existing connections you created for previous playbooks. You can choose to use existing connections, or create a new one. For example:

        :::image type="content" source="../media/use-playbook-templates/connections.png" alt-text="Screenshot of the Playbook creation wizard, connections tab.":::

        - To create a new connection, select **Create new connection after deployment**. This option takes you to the Logic Apps designer after the deployment process is completed.

        - Custom connectors are listed by the custom connector name entered in the **Parameters** tab.

        - For connectors that support [connecting with managed identity](authenticate-playbooks-to-sentinel.md#authenticate-with-a-managed-identity), such as **Microsoft Sentinel**, managed identity is the default connection method.

        For more information, see [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md).

    - **Review and Create:** View a summary of the process and await validation of your input before creating the playbook.

1. After following the steps in the playbook creation wizard to the end, you're taken to the new playbook's workflow design in the Logic Apps designer. For example:

    :::image type="content" source="../media/use-playbook-templates/designer.png" alt-text="Screenshot of the playbook in Logic Apps designer." lightbox="../media/use-playbook-templates/designer.png":::

1. For each connector you chose, create a new connection for after deployment:

    1. From the navigation menu, select **API connections** and then select the connection name. For example:

        :::image type="content" source="../media/use-playbook-templates/view-api-connections.png" alt-text="Screenshot showing how to view A P I connections.":::

    1. Select **Edit API connection** from the navigation menu.

    1. Fill in the required parameters and select **Save**. For example:

        :::image type="content" source="../media/use-playbook-templates/edit-api-connection.png" alt-text="Screenshot showing how to edit A P I connections.":::

    Alternatively, create a new connection from within the relevant steps in the Logic Apps designer:

    1. For each step that appears with an error sign, select it to expand and then select **Add new**.

    1. Authenticate according to the relevant instructions. For more information, see [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md).

    1. If there are other steps using this same connector, expand their boxes. From the list of connections that appears, select the connection you just created.

1. If you have chosen to use a managed identity connection for Microsoft Sentinel, or for other supported connections, make sure to grant permissions to the new playbook on the Microsoft Sentinel workspace or on the relevant target resources for other connectors.

1. Save the playbook. The playbook appears in the **Active Playbooks** tab.

To run your playbook, set an automated response or run it manually. For more information, see [Respond to threats with Microsoft Sentinel playbooks](run-playbooks.md).

## Report an issue in a playbook template

To report a bug or request an improvement for a playbook, select the **Supported by** link in the playbook's details pane. If this is a community-supported playbook, the link takes you to open a GitHub issue. Otherwise, you're directed to the supporter's page, with information about how to send your feedback.

## Related content

- [Automate threat response with Microsoft Sentinel playbooks](automate-responses-with-playbooks.md)
- [Recommended playbook templates](playbook-recommendations.md#recommended-playbook-templates)
- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)