---
title: Create and manage Microsoft Sentinel playbooks
description: Learn how to create and manage Microsoft Sentinel playbooks to automate your incident response and remediate security threats.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 05/30/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customer-intent: As a SOC engineer, I want to understand how to create playbooks in Microsoft Sentinel so that my team can automate threat responses in our environment.
---

# Create and manage Microsoft Sentinel playbooks 

Playbooks are collections of procedures that can be run from Microsoft Sentinel in response to an entire incident, to an individual alert, or to a specific entity. A playbook can help automate and orchestrate your response, and can be attached to an automation rule to run automatically when specific alerts are generated or when incidents are created or updated. Playbooks can also be run manually on-demand on specific incidents, alerts, or entities.

This article describes how to create and manage Microsoft Sentinel playbooks. You can later attach these playbooks to analytics rules or automation rules, or run them manually on specific incidents, alerts, or entities.

> [!NOTE]
> Playbooks in Microsoft Sentinel are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), which means that you get all the power, customizability, and built-in templates of Logic Apps. Additional charges may apply. Visit the [Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/) pricing page for more details.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

To create and manage playbooks, you need access to Microsoft Sentinel with one of the following Azure roles:

- **Logic App Contributor**, to edit and manage logic apps
- **Logic App operator**, to read, enable, and disable logic apps

For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

We recommend that you read [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md) before creating your playbook.

## Create a playbook

Follow these steps to create a new playbook in Microsoft Sentinel:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Configuration** > **Automation** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Automation**.

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="../media/tutorial-respond-threats-playbook/add-new-playbook.png" alt-text="Screenshot of the menu selection for adding a new playbook in the Automation screen." lightbox="../media/tutorial-respond-threats-playbook/add-new-playbook.png":::

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="../media/tutorial-respond-threats-playbook/add-new-playbook-defender.png" alt-text="Screenshot of the menu selection for adding a new playbook in the Automation screen." lightbox="../media/tutorial-respond-threats-playbook/add-new-playbook-defender.png":::

    ---

1. From the top menu, select **Create**, and then select one of the following options:

    1. If you're creating a **Standard** playbook, select **Blank playbook** and then [follow the steps for the **Standard** logic app type](#prepare-your-playbooks-logic-app).

    1. If you're creating a **Consumption** playbook, select one of the following options, depending on the trigger you want to use, and then follow the steps in the **Logic Apps Consumption** tab below:

        - **Playbook with incident trigger**
        - **Playbook with alert trigger**
        - **Playbook with entity trigger**

    For more information, see [Supported logic app types](logic-apps-playbooks.md#supported-logic-app-types) and [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

## Prepare your playbook's Logic App

Select one of the following tabs for details about how to create a logic app for your playbook, depending on whether you're using a *Consumption* or *Standard* workflow. For more information, see [Supported logic app types](logic-apps-playbooks.md#supported-logic-app-types).

### [Consumption](#tab/consumption)

The **Create playbook** wizard appears after selecting the trigger you want to use, including an incident, alert, or entity trigger. For example:

:::image type="content" source="../media/tutorial-respond-threats-playbook/create-playbook-basics.png" alt-text="Screenshot of Create a logic app.":::

Do the following to create your playbook:

1. In the **Basics** tab:

    1. Select the **Subscription**, **Resource group**, and **Region** of your choosing from their respective drop-down lists. The selected region is where your Logic App information is stored.

    1. Enter a name for your playbook under **Playbook name**.

    1. If you want to monitor this playbook's activity for diagnostic purposes, select the **Enable diagnostics logs in Log Analytics** check box, and select your **Log Analytics workspace** from the drop-down list.

    1. If your playbooks need access to protected resources that are inside or connected to an Azure virtual network, [you might need to use an integration service environment (ISE)](/azure/logic-apps/connect-virtual-network-vnet-isolated-environment-overview). If so, select the **Associate with integration service environment** check box, and select the relevant ISE from the drop-down list.

    1. Select **Next : Connections >**.

1. In the **Connections** tab, we recommend leaving the default values, configuring Logic Apps to connect to Microsoft Sentinel with managed identity. For more information, see [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md).

    Select **Next : Review and create >** to continue.

1. In the **Review and create** tab, review the configuration choices you made, and select **Create and continue to designer**.

    Your playbook will take a few minutes to be created and deployed, after which you see the message "Your deployment is complete" and you're taken to your new playbook's [Logic App Designer](/azure/logic-apps/logic-apps-overview). The trigger you chose at the beginning is automatically added as the first step, and you can continue designing the workflow from there.

    :::image type="content" source="../media/tutorial-respond-threats-playbook/logic-app-blank.png" alt-text="Screenshot of logic app designer screen with opening trigger." lightbox="../media/tutorial-respond-threats-playbook/logic-app-blank.png":::

1. If you chose the **Microsoft Sentinel entity** trigger, select the type of entity you want this playbook to receive as an input.

    :::image type="content" source="../media/tutorial-respond-threats-playbook/entity-trigger-types.png" alt-text="Screenshot of drop-down list of entity types to choose from to set playbook schema.":::

### [Standard](#tab/standard)

Since playbooks based on the Standard workflow don't support playbook templates, you need to first create your logic app, then create your playbook, and finally choose the trigger for your playbook.

After selecting the **Blank playbook** option, a new browser tab opens with the **Create Logic App** wizard. For example:

:::image type="content" source="../media/tutorial-respond-threats-playbook/create-logic-app-basics.png" alt-text="Screenshot of Create a Standard logic app.":::

#### Create a logic app

1. In the **Basics** tab, enter the following details:

    1. Select the **Subscription** and **Resource Group** of your choosing from their respective drop-down lists.
    1. Enter a name for your Logic App. For **Publish**, select **Workflow**. Select the **Region** where you wish to deploy the logic app.
    1. For **Plan type**, select **Standard**.
    1. Select **Next : Hosting >**.

1. In the **Hosting** tab:

    1. For **Storage type**, select **Azure Storage**, and select or create a **Storage account**.
    1. Select a **Windows Plan**.

1. In the **Monitoring** tab:

    1. If you want to enable performance monitoring in Azure Monitor for this application, leave the toggle on **Yes**. Otherwise, toggle it to **No**.

        > [!NOTE]
        > This monitoring is **not required for Microsoft Sentinel** and **will cost you extra**.

    1. Optionally, select **Next : Tags >**  to apply tags to this Logic App for resource categorization and billing purposes. Otherwise, select **Review + create**.

1. In the **Review + create** tab, review the configuration choices you made, and select **Create**.

    Your playbook takes a few minutes to be created and deployed, during which you see some deployment messages. At the end of the process you're taken to the final deployment screen, where you see the message: "Your deployment is complete."

1. Select **Go to resource**. You're taken to the main page of your new Logic App.

    Unlike with classic Consumption playbooks, you're not done yet. Now you must create a workflow.

#### Create a workflow for your playbook

1. From your Logic App's details page, select **Workflows > + Add**. It might take a few moments for the **+ Add** button to become active.

1. In the **New workflow** pane that appears:

    1. Enter a meaningful name for your workflow.
    1. Under **State type**, select **Stateful**. Microsoft Sentinel doesn't support the use of stateless workflows as playbooks.
    1. Select **Create**.

    Your workflow is saved and appears in the list of workflows in your Logic App.

1. Select the new workflow to proceed and access your workflow details page. Here you can see all the information about your workflow, including a record of all the times it runs.

1. From the workflow details page, select **Designer**.

1. The **Designer** page opens and you're prompted to add a trigger and continue designing the workflow.  For example:

    :::image type="content" source="../media/tutorial-respond-threats-playbook/logic-app-standard-designer.png" alt-text="Screenshot of Logic App Standard designer." lightbox="../media/tutorial-respond-threats-playbook/logic-app-standard-designer.png":::

#### Add your trigger

1. In the **Designer** page, select the **Azure** tab and enter *Sentinel* in the Search box. The **Triggers** tab shows the triggers supported by Microsoft Sentinel, including:

    - **Microsoft Sentinel alert**
    - **Microsoft Sentinel entity**
    - **Microsoft Sentinel incident**

    For example:

    :::image type="content" source="../media/tutorial-respond-threats-playbook/sentinel-triggers.png" alt-text="Screenshot of how to choose a trigger for your playbook.":::

1. If you choose the **Microsoft Sentinel entity** trigger, select the type of entity you want this playbook to receive as an input. For example:

    :::image type="content" source="../media/tutorial-respond-threats-playbook/entity-trigger-types-standard.png" alt-text="Screenshot of drop-down list of entity types to choose from to set playbook schema.":::

For more information, see [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

---

### Add actions to your playbook

Now that you have a logic app, define what happens when you call the playbook. Add actions, logical conditions, loops, or switch case conditions, all by selecting **New step**. This selection opens a new frame in the designer, where you can choose a system or an application to interact with or a condition to set. Enter the name of the system or application in the search bar at the top of the frame, and then choose from the available results.

In every one of these steps, clicking on any field displays a panel with the following menus:

- **Dynamic content**: Add references to the attributes of the alert or incident that was passed to the playbook, including the values and attributes of all the [mapped entities](../map-data-fields-to-entities.md) and [custom details](../surface-custom-details-in-alerts.md) contained in the alert or incident. For examples of using dynamic content, see:

    - [Use entity playbooks with no incident ID](#dynamic-content-use-entity-playbooks-with-no-incident-id)
    - [Work with custom details](#dynamic-content-work-with-custom-details)

- **Expression**: Choose from a large library of functions to add more logic to your steps.

For more information, see [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

### Authentication prompts

When you choose a trigger, or any subsequent action, you're prompted to authenticate to whichever resource provider you are interacting with. In this case, the provider is Microsoft Sentinel, and there are a few authentication options. For more information, see:

- [**Authenticate playbooks to Microsoft Sentinel**](authenticate-playbooks-to-sentinel.md)
- [**Supported triggers and actions in Microsoft Sentinel playbooks**](playbook-triggers-actions.md)

### Dynamic content: Use entity playbooks with no incident ID

Playbooks created with the entity trigger often use the **Incident ARM ID** field, such as to update an incident after taking action on the entity.

If such a playbook is triggered in a context unconnected to an incident, such as when threat hunting, there's no incident whose ID can populate this field. In this case, the field is populated with a null value.

As a result, the playbook might fail to run to completion. To prevent this failure, we recommend that you create a condition that checks for a value in the incident ID field before taking any actions on it, and prescribe a different set of actions if the field has a null value - that is, if the playbook isn't being run from an incident.

Do the following steps:

1. Before the first action that refers to the **Incident ARM ID** field, add a **Condition** step.

1. On the side, select the **Choose a value** field to enter the **Add dynamic content** dialog.

1. Select **Incident ARM ID (Optional)**, and the **is not equal to** operator.

1. Select **Choose a value** again to enter the **Add dynamic content** dialog.

1. Select the **Expression** tab and **null** function.

For example:

:::image type="content" source="../media/create-playbooks/no-incident-id.png" alt-text="Screenshot of the extra condition to add before the Incident ARM ID field.":::

### Dynamic content: Work with custom details

The **Alert custom details** dynamic field, available in the **incident trigger**, is an array of JSON objects, each of which represents a custom detail of an alert. [Custom details](../surface-custom-details-in-alerts.md) are key-value pairs that allow you to surface information from events in the alert so they can be represented, tracked, and analyzed as part of the incident.

Since this field in the alert is customizable, its schema depends on the type of event being surfaced. Supply data from an instance of this event to generate the schema that determines how the custom details field is parsed.

For example:

:::image type="content" source="../media/playbook-triggers-actions/custom-details-values.png" alt-text="Screenshot of custom details defined in an analytics rule.":::

In these key-value pairs:

- The key, in the left column, represents the custom fields you create.
- The value, in the right column, represents the fields from the event data that populate the custom fields.

Supply the following JSON code to generate the schema. The code shows the key names as arrays, and the values as items in the arrays. Values are shown as the actual values, not the column that contains the values.

```json
{ "FirstCustomField": [ "1", "2" ], "SecondCustomField": [ "a", "b" ] }
```

To use custom fields for incident triggers:

1. Add a new step using the **Parse JSON** built-in action. Enter 'parse json' in the **Search** field to find it if you need to.

1. Find and select **Alert Custom Details** in the **Dynamic content** list, under the incident trigger. For example:

    :::image type="content" source="../media/playbook-triggers-actions/custom-details-dynamic-field.png" alt-text="Screenshot of selecting Alert custom details from Dynamic content.":::

    This creates a **For each** loop, since an incident contains an array of alerts.

1. Select the **Use sample payload to generate schema** link. For example:

    :::image type="content" source="../media/playbook-triggers-actions/generate-schema-link.png" alt-text="Screenshot of selecting the use sample payload to generate schema link from Dynamic content option.":::

1. Supply a sample payload. For example, you can find a sample payload by looking in Log Analytics for another instance of this alert and copying the custom details object, found under **Extended Properties**. Access Log Analytics data either in the **Logs** page in the Azure portal or the **Advanced hunting** page in the Defender portal. In the screenshot below, we used the JSON code shown above.

    :::image type="content" source="../media/playbook-triggers-actions/sample-payload.png" alt-text="Screenshot of entering a sample JSON payload.":::

The custom fields are ready to be used as dynamic fields of type **Array**. For example, the following screenshot shows an array and its items, both in the schema and in the list that appears under **Dynamic content**, that we described in this section:

:::image type="content" source="../media/playbook-triggers-actions/fields-ready-to-use.png" alt-text="Screenshot of fields from the schema ready to use.":::

## Manage your playbooks

Select the **Automation > Active playbooks** tab to view all the playbooks you have access to, filtered by your subscription view.

After onboarding to the unified security operations platform, by default the **Active playbooks** tab shows a predefined filter with onboarded workspace's subscription. **In the Azure portal**, edit the subscriptions you're showing from the **Directory + subscription** menu in the global Azure page header.

While the **Active playbooks** tab displays all the active playbooks available across any selected subscriptions, by default a playbook can be used only within the subscription to which it belongs, unless you specifically grant Microsoft Sentinel permissions to the playbook's resource group.

The **Active playbooks** tab shows your playbooks with the following details:

|Column name  |Description  |
|---------|---------|
|**Status**     |  Indicates if the playbook is enabled or disabled.       |
|**Plan**     |   Indicates whether the playbook uses the *Standard* or *Consumption* Azure Logic Apps resource type.   <br><br>Playbooks of the *Standard* type use the `LogicApp/Workflow` naming convention, which reflects how a Standard playbook represents a workflow that exists alongside other workflows in a single Logic App. <br><br>For more information, see [Azure Logic Apps for Microsoft Sentinel playbooks](logic-apps-playbooks.md).  |
|**Trigger kind**     |  Indicates the Azure Logic Apps trigger that starts this playbook: <br><br>- **Microsoft Sentinel Incident/Alert/Entity**: The playbook is started with one of the Sentinel triggers, including incident, alert, or entity <br>- **Using Microsoft Sentinel Action**: The playbook is started with a non-Microsoft Sentinel trigger but uses a Microsoft Sentinel action <br>- **Other**: The playbook doesn't include any Microsoft Sentinel components     <br>- **Not initialized**: The playbook was created, but contains no components, neither triggers no actions. |

Select a playbook to open its Azure Logic Apps page, which shows more details about the playbook. On the Azure Logic Apps page:

- View a log of all times the playbook ran
- View run results, including successes and failures and other details
- If you have the relevant permissions, open the workflow designer in Azure Logic Apps to edit the playbook directly

## Related content

Once you created your playbook, attach it to rules to be triggered by events in your environment, or run your playbooks manually on specific incidents, alerts, or entities.

For more information, see:

- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Use a Microsoft Sentinel playbook to stop potentially compromised users](tutorial-respond-threats-playbook.md)
