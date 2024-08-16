---
title: Create and manage Microsoft Sentinel playbooks
description: Learn how to create and manage Microsoft Sentinel playbooks to automate your incident response and remediate security threats.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 08/15/2024
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
>
> Playbooks in Microsoft Sentinel are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), which means that you get all the power, customizability, and built-in templates of logic apps. Additional charges may apply. For pricing information, visit the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/).

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- To create and manage playbooks, you need access to Microsoft Sentinel with one of the following Azure roles:

  | Logic app | Azure roles | Description |
  |-----------|-------------|-------------|
  | Consumption | **Logic App Contributor** | Edit and manage logic apps. |
  | Consumption | **Logic App Operator** | Read, enable, and disable logic apps. |
  | Standard | **Logic Apps Standard Operator** | Enable, resubmit, and disable workflows. |
  | Standard | **Logic Apps Standard Developer** | Create and edit workflows. |
  | Standard | **Logic Apps Standard Contributor** | Manage all aspects of a workflow. |

  For more information, see the following documentation:

  - [Access to logic app operations](/azure/logic-apps/logic-apps-securing-a-logic-app#access-to-logic-app-operations)
  - [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

- Before you create your playbook, we recommend that you read [Azure Logic Apps for Microsoft Sentinel playbooks](../automation/logic-apps-playbooks.md).

## Create a playbook

Follow these steps to create a new playbook in Microsoft Sentinel:

1. Choose your starting point:

   - In the [Azure portal](https://portal.azure.com), go to your Microsoft Sentinel workspace. On the workspace menu, under **Configuration**, select **Automation**.

   - In the [Defender portal](https://security.microsoft.com/), go to your Microsoft Sentinel workspace. Select **Microsoft Sentinel** > **Configuration** > **Automation**.

   #### [Azure portal](#tab/azure-portal)
   :::image type="content" source="../media/create-playbooks/add-new-playbook.png" alt-text="Screenshot shows Azure portal and Microsoft Sentinel Automation page with Create selected." lightbox="../media/create-playbooks/add-new-playbook.png":::

   #### [Defender portal](#tab/defender-portal)
   :::image type="content" source="../media/create-playbooks/add-new-playbook-defender.png" alt-text="Screenshot shows Defender portal and Microsoft Sentinel Automation page with Create selected." lightbox="../media/create-playbooks/add-new-playbook-defender.png":::

   ---

1. From the top menu, select **Create**, and then select one of the following options:

   - If you're creating a **Consumption** playbook, select one of the following options, depending on the trigger you want to use, and then follow the [steps for a **Consumption** logic app](create-playbooks.md?tabs=consumption#prepare-playbook-logic-app):

     - **Playbook with incident trigger**
     - **Playbook with alert trigger**
     - **Playbook with entity trigger**

     This guide continues with the **Playbook with entity trigger**.

   - If you're creating a **Standard** playbook, select **Blank playbook** and then [follow the steps for the **Standard** logic app type](create-playbooks.md?tabs=standard#prepare-playbook-logic-app).

   For more information, see [Supported logic app types](../automation/logic-apps-playbooks.md#supported-logic-app-types) and [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

<a name="prepare-playbook-logic-app"></a>

## Prepare your playbook's logic app

Select one of the following tabs for details about how to create a logic app for your playbook, depending on whether you're using a Consumption or Standard logic app. For more information, see [Supported logic app types](../automation/logic-apps-playbooks.md#supported-logic-app-types).

> [!TIP]
>
> If your playbooks need access to protected resources that are inside or connected to an Azure virtual network, 
> [create a Standard logic app workflow](/azure/logic-apps/create-single-tenant-workflows-azure-portal).
>
> Standard workflows run in single-tenant Azure Logic Apps and support using private endpoints for inbound 
> traffic so that your workflows can communicate privately and securely with virtual networks. Standard 
> workflows also support virtual network integration for outbound traffic. For more information, see 
> [Secure traffic between virtual networks and single-tenant Azure Logic Apps using private endpoints](/azure/logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint).

### Authentication prompts

When you add a trigger or subsequent action that requires authentication, you might be prompted to choose from the available authentication types supported by the corresponding resource provider. In this example, a Microsoft Sentinel trigger is the first operation that you add to your workflow. So, the resource provider is Microsoft Sentinel, which supports several authentication options. For more information, see the following documentation:

- [**Authenticate playbooks to Microsoft Sentinel**](authenticate-playbooks-to-sentinel.md)
- [**Supported triggers and actions in Microsoft Sentinel playbooks**](playbook-triggers-actions.md)

### [Consumption](#tab/consumption)

After you select the trigger, which includes an incident, alert, or entity trigger, the **Create playbook** wizard appears, for example:

:::image type="content" source="../media/create-playbooks/create-playbook-basics-consumption.png" alt-text="Screenshot shows Create playbook wizard and Basics tab for a Consumption workflow-based playbook." lightbox="../media/create-playbooks/create-playbook-basics-consumption.png":::

Follow these steps to create your playbook:

1. On the **Basics** tab, provide the following information:

   1. For **Subscription** and **Resource group**, select the values you want from their respective lists.

      The **Region** value is set to the same region as the associated Log Analytics workspace.

   1. For **Playbook name**, enter a name for your playbook.

   1. To monitor this playbook's activity for diagnostic purposes, select **Enable diagnostics logs in Log Analytics**, and then select a **Log Analytics workspace** unless you already selected a workspace.

1. Select **Next : Connections >**.

1. On the **Connections** tab, we recommend leaving the default values, which configure a logic app to connect to Microsoft Sentinel with a managed identity.

   For more information, see [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md).

1. To continue, select **Next : Review and create >**.

1. On the **Review and create** tab, review your configuration choices, and select **Create playbook**.

   Azure takes a few minutes to create and deploy your playbook. After deployment completes, your playbook opens in the Consumption workflow designer for [Azure Logic Apps](/azure/logic-apps/logic-apps-overview). The trigger that you selected earlier automatically appears as the first step in your workflow, so now you can continue building the workflow from here.

   :::image type="content" source="../media/create-playbooks/logic-app-blank.png" alt-text="Screenshot shows Consumption workflow designer with selected trigger." lightbox="../media/create-playbooks/designer-consumption.png":::

1. If you previously chose **Playbook with entity trigger**, select the type of entity you want this playbook to receive as an input.

   :::image type="content" source="../media/create-playbooks/entity-trigger-types.png" alt-text="Screenshot shows Consumption workflow playbook with entity trigger, and available entity types to select for setting the playbook schema." lightbox="../media/create-playbooks/entity-trigger-types.png":::

### [Standard](#tab/standard)

Playbooks based on a Standard workflow don't support playbook templates, so you need to first create a Standard logic app, then create your playbook, and finally choose the trigger for your playbook.

After you select **Blank playbook**, a new browser tab opens, and **Create Logic App** wizard appears. The wizard shows the available hosting options where **Standard - Workflow Service Plan** is already selected, for example:

:::image type="content" source="../media/create-playbooks/logic-apps-hosting-options.png" alt-text="Screenshot shows hosting options page for creating a logic app." lightbox="../media/create-playbooks/logic-apps-hosting-options.png":::

Follow these steps to create your Standard logic app:

#### Create Standard logic app

1. On the **Create Logic App** page, confirm your hosting plan selection, and then select **Select**.

1. On the **Basics** tab, provide the following information:

   1. For **Subscription** and **Resource Group**, select the values you want from their respective lists.

   1. For **Logic App name**, enter a name for your logic app.

   1. For **Region**, select the Azure region for your logic app.

   1. For **Windows Plan (*selected-region*)**, create or select an existing plan.

   1. For **Pricing plan**, select the compute resources and their pricing for your logic app.

   1. Under **Zone redundancy**, you can enable this capability if you selected an Azure region that supports availability zone redundancy.

      For this example, leave the option disabled. For more information, see [Protect logic apps from region failures with zone redundancy and availability zones](/azure/logic-apps/set-up-zone-redundancy-availability-zones).

   1. Select **Next : Storage >**.

   :::image type="content" source="../media/create-playbooks/create-logic-app-basics-standard.png" alt-text="Screenshot shows Create Logic App wizard and Basics tab for a Standard logic app." lightbox="../media/create-playbooks/create-logic-app-basics-standard.png":::

1. On the **Storage** tab, provide the following information:

   1. For **Storage type**, select **Azure Storage**, and create or select a storage account.

   1. For **Blob service diagnostic settings**, leave the default setting.

1. On the **Networking** tab, you can leave the default options for this example.

   For your specific, real-world, production scenarios, make sure to review and select the appropriate options. You can also change this configuration after you deploy your logic app resource. For more information, see the following documentation:

   - [Create example Standard workflow - Azure portal](/azure/logic-apps/create-single-tenant-workflows-azure-portal)

   - [Secure traffic between Standard logic apps and Azure virtual networks using private endpoints](/azure/logic-apps/secure-single-tenant-workflow-virtual-network-private-endpoint).

1. On the **Monitoring** tab, follow these steps:

   1. Under **Application Insights**, set **Enable Application Insights** to **No**.

      This setting disables or enables performance monitoring with Application Insights in Azure Monitor. However, for Microsoft Sentinel, this capability isn't required and costs extra.

   1. To apply tags to this logic app for resource categorization and billing purposes, select **Next : Tags >**. Otherwise, select **Review + create**.

1. On the **Review + create** tab, review your configuration choices, and select **Create**.

   Azure takes a few minutes to create and deploy your logic app.

1. After deployment completes, select **Go to resource**, which opens your logic app resource.

   Unlike with classic Consumption playbooks, you're not done yet. Now you must create a workflow.

#### Create a workflow for your playbook

1. On your logic app menu, under **Workflows**, select **Workflows**.

1. On the **Workflows** page toolbar, select **Add**.

1. In the **New workflow** pane, provide the following information:

   | Property | Description |
   |----------|-------------|
   | **Workflow Name** | A meaningful name for your workflow. |
   | **State type** | Select **Stateful**. Microsoft Sentinel doesn't support the use of stateless workflows as playbooks. |

1. When you finish, select **Create**.

   After Azure saves your workflow, the **Workflows** page shows your workflow.

1. Select the workflow to open the workflow **Overview** page.

   This page shows all the information about your workflow, including the history of all the times that the workflow runs.

1. On the workflow menu, under **Developer**, select **Designer**.

   The workflow designer opens for you to start building your workflow by adding a trigger.

#### Add the workflow trigger

1. On the designer, select **Add a trigger** to open the **Add a trigger** pane, for example:

   :::image type="content" source="../media/create-playbooks/designer-standard.png" alt-text="Screenshot shows designer in Standard logic app workflow." lightbox="../media/create-playbooks/designer-standard.png":::

1. [Follow these general steps to find the **Microsoft Sentinel** triggers](../../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger), which include these triggers:

   - **Microsoft Sentinel entity**
   - **Microsoft Sentinel alert**
   - **Microsoft Sentinel incident**

   :::image type="content" source="../media/create-playbooks/sentinel-triggers.png" alt-text="Screenshot shows how to select a trigger for your playbook." lightbox="../media/create-playbooks/sentinel-triggers.png":::

1. Select the trigger that you want to use for your playbook. 

   This example continues with the **Microsoft Sentinel entity** trigger. 

1. On the **Create connection** pane, provide the required information to connect to Microsoft Sentinel.

   1. For **Authentication**, select from the following methods, which affect subsequent connection parameters:

      | Method | Description |
      |--------|-------------|
      | **OAuth** | Open Authorization (OAuth) is a technology standard that lets you authorize an app or service to sign in to another without exposing private information, such as passwords. OAuth 2.0 is the industry protocol for authorization and grants limited access to protected resources. For more information, see the following resources: <br><br>- [What is OAuth](https://www.microsoft.com/security/business/security-101/what-is-oauth)? <br>- [OAuth 2.0 authorization with Microsoft Entra ID](/entra/architecture/auth-oauth2) |
      | **Service principal** | A service principal represents an entity that requires access to resources that are secured by a Microsoft Entra tenant. For more information, see [Service principal object](/entra/identity-platform/app-objects-and-service-principals). |
      | **Managed identity** | An identity that is automatically managed in Microsoft Entra ID. Apps can use this identity to access resources that support Microsoft Entra authentication and to obtain Microsoft Entra tokens without having to manage any credentials. <br><br>For optimal security, Microsoft recommends using a managed identity for authentication when possible. This option provides superior security and helps keep authentication information secure so that you don't have to manage this sensitive information. For more information, see the following resources: <br><br>- [What are managed identities for Azure resources](/entra/identity/managed-identities-azure-resources/overview)? <br>- [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity). | 

   1. Based on your selected authentication option, provide the necessary parameter values for the corresponding option.

      For more information about these parameters, see [Microsoft Sentinel connector reference](/connectors/azuresentinel/).

   1. When you finish, select **Create new**.

1. If you chose **Playbook with entity trigger**, select the type of entity you want this playbook to receive as an input.

   :::image type="content" source="../media/create-playbooks/entity-trigger-types.png" alt-text="Screenshot shows Standard workflow playbook with entity trigger, and available entity types to select for setting the playbook schema." lightbox="../media/create-playbooks/entity-trigger-types.png":::

For more information, see [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

---

### Add actions to your playbook

Now that you have a workflow for your playbook, define what happens when you call the playbook. Add actions, logical conditions, loops, or switch case conditions, all by selecting the plus sign (**+**) on the designer. For more information, see [Create a workflow with a trigger or action](../../logic-apps/create-workflow-with-trigger-or-action.md).

This selection opens the **Add an action** pane where you can browse or search for services, applications, systems, control flow actions, and more. After you enter your search terms or select the resource that you want, the results list shows you the available actions.

In each action, when you select inside a field, you get the following options:

- **Dynamic content** (lightning icon): Choose from a list of available outputs from the preceding actions in the workflow, including the Microsoft Sentinel trigger. For example, these outputs can include the attributes of an alert or incident that was passed to the playbook, including the values and attributes of all the [mapped entities](../map-data-fields-to-entities.md) and [custom details](../surface-custom-details-in-alerts.md) in the alert or incident. You can add references to the current action by selecting these outputs.

  For examples that show using dynamic content, see the following sections:

  - [Use entity playbooks with no incident ID](#dynamic-content-entity-playbooks-with-no-incident-id)
  - [Work with custom details](#dynamic-content-work-with-custom-details)

- **Expression editor** (function icon): Choose from a large library of functions to add more logic to your workflow.

For more information, see [Supported triggers and actions in Microsoft Sentinel playbooks](playbook-triggers-actions.md).

### Dynamic content: Entity playbooks with no incident ID

Playbooks created with the **Microsoft Sentinel entity** trigger often use the **Incident ARM ID** field, for example, to update an incident after taking action on the entity. If such a playbook is triggered in a scenario that's unconnected to an incident, such as when threat hunting, there's no incident ID to populate this field. Instead, the field is populated with a null value. As a result, the playbook might fail to run to completion. 

To prevent this failure, we recommend that you create a condition that checks for a value in the incident ID field before the workflow takes any other actions. You can prescribe a different set of actions to take if the field has a null value, due to the playbook not being run from an incident.

1. In your workflow, preceding the first action that refers to the **Incident ARM ID** field, [follow these general steps to add a **Condition** action](../../logic-apps/create-workflow-with-trigger-or-action.md).

1. In the **Condition** pane, on the condition row, select the left **Choose a value** field, and then select the dynamic content option (lightning icon).

1. From the dynamic content list, under **Microsoft Sentinel incident**, use the search box to find and select **Incident ARM ID**.

   > [!TIP]
   >
   > If the output doesn't appear in the list, next to the trigger name, select **See more**.

1. In the middle field, from the operator list, select **is not equal to**.

1. In the right **Choose a value** field, and select the expression editor option (function icon).

1. In the editor, enter **null**, and select **Add**.

When you finish, your condition looks similar to the following example:

:::image type="content" source="../media/create-playbooks/no-incident-id.png" alt-text="Screenshot shows extra condition to add before the Incident ARM ID field." lightbox="../media/create-playbooks/no-incident-id.png":::

### Dynamic content: Work with custom details

In the **Microsoft Sentinel incident** trigger, the **Alert custom details** output is an array of JSON objects where each represents a [custom detail from an alert](../surface-custom-details-in-alerts.md). Custom details are key-value pairs that let you surface information from events in the alert so they can be represented, tracked, and analyzed as part of the incident.

This field in the alert is customizable, so its schema depends on the type of event that is surfaced. To generate the schema that determines how to parse the custom details output, provide the data from an instance of this event:

1. On the Microsoft Sentinel workspace menu, under **Configuration**, select **Analytics**.

1. Follow the steps to create or open an existing [scheduled query rule](../create-analytics-rules.md?tabs=azure-portal) or [NRT query rule](../create-nrt-rules.md?tabs=azure-portal).

1. On the **Set rule logic** tab, [expand the **Custom details** section](../surface-custom-details-in-alerts.md?tabs=azure), for example:

   :::image type="content" source="../media/create-playbooks/custom-details-values.png" alt-text="Screenshot shows custom details defined in an analytics rule." lightbox="../media/create-playbooks/custom-details-values.png":::

   The following table provides more information about these key-value pairs:

   | Item | Location | Description |
   |------|----------|-------------|
   | **Key** | Left column | Represents the custom fields that you create. |
   | **Value** | Right column | Represents the fields from the event data that populate the custom fields. |

1. To generate the schema, provide the following example JSON code:

   ```json
   { "FirstCustomField": [ "1", "2" ], "SecondCustomField": [ "a", "b" ] }
   ```

    The code shows the key names as arrays, and the values as items in the arrays. Values are shown as the actual values, not the column that contains the values.

To use custom fields for incident triggers, follow these steps for your workflow:

1. In the workflow designer, under the **Microsoft Sentinel incident** trigger, add the built-in action named **Parse JSON**.

1. Select inside the action's **Content** parameter, and select the dynamic content list option (lightning icon).

1. From the list, in the incident trigger section, find and select **Alert Custom Details**, for example:

   :::image type="content" source="../media/create-playbooks/custom-details-dynamic-field.png" alt-text="Screenshot shows selected Alert Custom Details in dynamic content list." lightbox="../media/create-playbooks/custom-details-dynamic-field.png":::

   This selection automatically adds a **For each** loop around **Parse JSON** because an incident contains an array of alerts.

1. In the **Parse JSON** information pane, select **Use sample payload to generate schema**, for example:

   :::image type="content" source="../media/create-playbooks/generate-schema-link.png" alt-text="Screenshot shows selection for Use sample payload to generate schema link." lightbox="../media/create-playbooks/generate-schema-link.png":::

1. In the **Enter or paste a sample JSON payload** box, provide a sample payload, and select **Done**.

   For example, you can find a sample payload by looking in Log Analytics for another instance of this alert, and then copying the custom details object, which you can find under **Extended Properties**. To access Log Analytics data, go either to the **Logs** page in the Azure portal or the **Advanced hunting** page in the Defender portal.

   The following example shows the earlier sample JSON code:

   :::image type="content" source="../media/create-playbooks/sample-payload.png" alt-text="Screenshot shows sample JSON payload." lightbox="../media/create-playbooks/sample-payload.png":::

   When you finish, the **Schema** box now contains the generated schema based on the sample that you provided. The **Parse JSON** action creates custom fields that you can now use as dynamic fields with **Array** type in your workflow's subsequent actions.

   The following example shows an array and its items, both in the schema and in the dynamic content list for a subsequent action named **Compose**:

   :::image type="content" source="../media/create-playbooks/custom-fields-ready-to-use.png" alt-text="Screenshot shows ready to use dynamic fields from the schema." lightbox="../media/create-playbooks/custom-fields-ready-to-use.png":::

## Manage your playbooks

Select the **Automation > Active playbooks** tab to view all the playbooks you have access to, filtered by your subscription view.

After you onboard to the unified security operations platform, by default the **Active playbooks** tab shows a predefined filter with onboarded workspace's subscription. **In the Azure portal**, edit the subscriptions you're showing from the **Directory + subscription** menu in the global Azure page header.

While the **Active playbooks** tab displays all the active playbooks available across any selected subscriptions, by default a playbook can be used only within the subscription to which it belongs, unless you specifically grant Microsoft Sentinel permissions to the playbook's resource group.

The **Active playbooks** tab shows your playbooks with the following details:

|Column name  |Description  |
|---------|---------|
|**Status**     |  Indicates if the playbook is enabled or disabled.       |
|**Plan**     |   Indicates whether the playbook uses the *Standard* or *Consumption* Azure Logic Apps resource type.   <br><br>Playbooks of the *Standard* type use the `LogicApp/Workflow` naming convention, which reflects how a Standard playbook represents a workflow that exists alongside other workflows in a single logic app. <br><br>For more information, see [Azure Logic Apps for Microsoft Sentinel playbooks](../automation/logic-apps-playbooks.md).  |
|**Trigger kind**     |  Indicates the trigger in Azure Logic Apps that starts this playbook: <br><br>- **Microsoft Sentinel Incident/Alert/Entity**: The playbook is started with one of the Sentinel triggers, including incident, alert, or entity <br>- **Using Microsoft Sentinel Action**: The playbook is started with a non-Microsoft Sentinel trigger but uses a Microsoft Sentinel action <br>- **Other**: The playbook doesn't include any Microsoft Sentinel components     <br>- **Not initialized**: The playbook was created, but contains no components, neither triggers no actions. |

Select a playbook to open its Azure Logic Apps page, which shows more details about the playbook. On the Azure Logic Apps page:

- View a log of all times the playbook ran
- View run results, including successes and failures and other details
- If you have the relevant permissions, open the workflow designer in Azure Logic Apps to edit the playbook directly

## Related content

After you create your playbook, attach it to rules to be triggered by events in your environment, or run your playbooks manually on specific incidents, alerts, or entities.

For more information, see:

- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)
- [Authenticate playbooks to Microsoft Sentinel](authenticate-playbooks-to-sentinel.md)
- [Use a Microsoft Sentinel playbook to stop potentially compromised users](tutorial-respond-threats-playbook.md)
