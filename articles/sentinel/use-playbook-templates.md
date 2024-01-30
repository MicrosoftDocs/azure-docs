---
title: Create and customize Microsoft Sentinel playbooks from templates | Microsoft Docs
description: This article shows how to create playbooks from and work with playbook templates, to customize them to fit your needs.
author: yelevin
ms.topic: how-to
ms.date: 06/21/2023
ms.author: yelevin
---

# Create and customize Microsoft Sentinel playbooks from content templates

A playbook template is a prebuilt, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates aren't active playbooks themselves, until you create a playbook (an editable copy of the template) from them.

Many playbook templates are developed by the Microsoft Sentinel community, independent software vendors (ISVs), and Microsoft's own experts, based on popular automation scenarios used by security operations centers around the world.

Get playbook templates from the following sources:

- On the **Automation** page, the **Playbook templates** tab lists the playbook templates installed. Multiple active playbooks can be created from the same template.

    When a new version of the template is published, the active playbooks created from that template show in the **Active playbooks** tab that an update is available.

- Playbook templates are available as part of product solutions or standalone content that you install from the content hub in Microsoft Sentinel. For more information, see [Microsoft Sentinel content and solutions](sentinel-solutions.md) and [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

- The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) contains many playbook templates. They can be deployed to an Azure subscription by selecting the **Deploy to Azure** button.

Technically, a playbook template is an [Azure Resource Manager (ARM) template](../azure-resource-manager/templates/index.yml) which consists of several resources: an Azure Logic Apps workflow and API connections for each connection involved.

This article focuses on deploying a playbook template from the **Playbook templates** tab under **Automation**.

This article helps you understand how to:

> [!div class="checklist"]
> - Explore out-of-the-box playbook templates
> - Deploy a playbook template

> [!IMPORTANT]
>
> **Playbook templates** are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Explore playbook templates

In Microsoft Sentinel, select **Content hub** and then select **Content type** to filter for **Playbook**. This filtered view lists all the solutions and standalone content that include one or more playbook templates. Install the solution or standalone content to get the template.

Then, in Microsoft Sentinel, select **Automation** and then the **Playbook templates** tab to view the installed templates.

:::image type="content" source="media/use-playbook-templates/gallery.png" alt-text="Screenshot of the playbooks gallery." lightbox="media/use-playbook-templates/gallery.png":::

To find a playbook template that fits your requirements, you can filter the list by the following criteria:

- **Trigger** indicates whether the playbook is triggered by incident creation, by incident update, or by alert creation. [Learn more](playbook-triggers-actions.md#microsoft-sentinel-triggers-summary)

- **Logic Apps connectors** shows the external services this playbook interacts with. During the deployment process, each connector needs to assume an identity to authenticate to the external service.

- **Entities** shows the entity types explicitly filtered and parsed by a playbook that expects to find those entity types in the incident. For example, a playbook that tells a firewall to block an IP address expects to operate on incidents created by analytics rules that generate alerts containing IP addresses, such as a Brute Force attack detection rule.

- **Tags** show labels applied to the playbook to relate it to a specific scenario, or to indicate a special characteristic.

  Examples:

  - **Enrichment** - The playbook fetches information from another service to add information to an incident. This information is usually added as a comment to the incident or sent to the SOC.

  - **Remediation** - The playbook takes an action on the affected entities to eliminate a potential threat.

  - **Sync** - The playbook helps to keep an external service, such as an incident management service, updated with the incident's properties.

  - **Notification** - The playbook sends an email or message.

  - **Response from Teams** - The playbook allows the analysts to take a manual action from Teams using interactive cards.

:::image type="content" source="media/use-playbook-templates/filters.png" alt-text="Filter the list of playbook templates":::

## Customize a playbook from a template

This procedure describes how to deploy playbook templates.

You can repeat this process to create multiple playbooks on the same template.

1. Select a playbook name from the **Playbook templates** tab.

1. If the playbook has any prerequisites, make sure to follow the instructions.

    - Some playbooks call other playbooks as actions. This second playbook is referred to as a **nested playbook**. In such a case, one of the prerequisites is to first deploy the nested playbook.

    - Some playbooks require deploying a custom Logic Apps connector or an Azure Function. In such cases, there is a **Deploy to Azure** link that takes you to the general ARM template deployment process.

1. Select **Create playbook** to open the playbook creation wizard based on the selected template. The wizard has four tabs:

    - **Basics:** Locate your new playbook (Logic Apps resource) and give it a name (can use default).
        :::image type="content" source="media/use-playbook-templates/basics.png" alt-text="Playbook creation wizard, basics tab":::

    - **Parameters:** Enter customer-specific values that the playbook uses. For example, if this playbook sends an email to the SOC, you can define the recipient address here. This tab is shown only if the playbook has parameters.

        > [!NOTE]
        > If this playbook has a custom connector in use, it should be deployed in the same resource group, and you will be able to insert its name in this tab.

        :::image type="content" source="media/use-playbook-templates/parameters.png" alt-text="Playbook creation wizard, parameters tab":::

    - **Connections:** Expand each action to see the existing connections you created for previous playbooks. Learn more about [creating connections for playbooks](authenticate-playbooks-to-sentinel.md).

        > [!NOTE]
        > For custom connectors, connections will be displayed by the name of the custom connector entered in the **Parameters** tab.

        :::image type="content" source="media/use-playbook-templates/connections.png" alt-text="Playbook creation wizard. connections tab":::

        If there aren't any, or if you want to create new ones, choose **Create new connection after deployment**. This option takes you to the Logic Apps designer after the deployment process is completed.

        For connectors that support [connecting with managed identity](authenticate-playbooks-to-sentinel.md#authenticate-with-managed-identity), such as **Microsoft Sentinel**, this is the connection method selected by default.

    - **Review and Create:** View a summary of the process and await validation of your input before creating the playbook.

1. After following the steps in the playbook creation wizard to the end, you're taken to the new playbook's workflow design in the Logic Apps designer.

    :::image type="content" source="media/use-playbook-templates/designer.png" alt-text="See playbook in Logic Apps designer":::

1. For each connector you chose to create a new connection for after deployment:
    1. From the navigation menu, select **API connections**.

    1. Select the connection name.
        :::image type="content" source="media/use-playbook-templates/view-api-connections.png" alt-text="Screenshot showing how to view A P I connections.":::
    1. Select **Edit API connection** from the navigation menu.

    1. Fill in the required parameters and select **Save**.
        :::image type="content" source="media/use-playbook-templates/edit-api-connection.png" alt-text="Screenshot showing how to edit A P I connections.":::

    Alternatively, you can create a new connection from within the relevant steps in the Logic Apps designer:
    
    1. For each step that appears with an error sign, select it to expand.

    1. Select **Add new**.

    1. Authenticate according to the relevant instructions.

    1. If there are other steps using this same connector, expand their boxes. From the list of connections that appears, select the connection you just created.

1. If you have chosen to use a managed identity connection for Microsoft Sentinel (or for other supported connections), grant permissions to the new playbook on the Microsoft Sentinel workspace (or on the relevant target resources for other connectors).

1. Save the playbook. You'll now be able to see it in the **Active Playbooks** tab.

1. To run this playbook,  [set an automated response](automate-responses-with-playbooks.md#set-an-automated-response) or [run manually](automate-responses-with-playbooks.md#run-a-playbook-manually).

1. Most of the templates can be used as is, but we recommend making any adjustments required to fit the new playbook to your SOC needs.

## Troubleshooting

### Issue: Found a bug in the playbook

To report a bug or request an improvement for a playbook, select the **Supported by** link in the playbook's details pane. If this is a community-supported playbook, the link takes you to open a GitHub issue. Otherwise, you're directed to the supporter's page.

## Next steps

In this article, you learned how to work with playbook templates, creating and customizing playbooks to fit your needs. Learn more about playbooks and automation in Microsoft Sentinel:

- [Security Orchestration, Automation, and Response (SOAR) in Microsoft Sentinel](automation.md)
- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Tutorial: Use playbooks with automation rules in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Use triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md)
