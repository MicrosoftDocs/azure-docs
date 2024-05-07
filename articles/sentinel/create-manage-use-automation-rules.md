---
title: Create and use Microsoft Sentinel automation rules to manage response
description: This article explains how to create and use automation rules in Microsoft Sentinel to manage and handle incidents, in order to maximize your SOC's efficiency and effectiveness in response to security threats.
ms.topic: how-to
author: batamig
ms.author: bagol
ms.date: 04/03/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Create and use Microsoft Sentinel automation rules to manage response

This article explains how to create and use automation rules in Microsoft Sentinel to manage and orchestrate threat response, in order to maximize your SOC's efficiency and effectiveness.

In this article you'll learn how to define the triggers and conditions that will determine when your automation rule will run, the various actions that you can have the rule perform, and the remaining features and functionalities.

> [!IMPORTANT]
>
> Noted features of automation rules are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>
> [!INCLUDE [unified-soc-preview-without-alert](includes/unified-soc-preview-without-alert.md)]

## Design your automation rule

Before you create your automation rule, we recommend that you determine its scope and design, including the trigger, conditions, and actions that will make up your rule.

### Determine the scope

The first step in designing and defining your automation rule is figuring out which incidents or alerts you want it to apply to. This determination will directly impact how you create the rule.

You also want to determine your use case. What are you trying to accomplish with this automation? Consider the following options:

- Create tasks for your analysts to follow in triaging, investigating, and remediating incidents.
- Suppress noisy incidents. (Alternatively, use other methods to [handle false positives in Microsoft Sentinel](false-positives.md).)
- Triage new incidents by changing their status from New to Active and assigning an owner.
- Tag incidents to classify them.
- Escalate an incident by assigning a new owner.
- Close resolved incidents, specifying a reason and adding comments.
- Analyze the incident's contents (alerts, entities, and other properties) and take further action by calling a playbook.
- Handle or respond to an alert without an associated incident.

### Determine the trigger

Do you want this automation to be activated when new incidents or alerts are created? Or anytime an incident gets updated?

Automation rules are triggered **when an incident is created or updated** or **when an alert is created**. Recall that incidents include alerts, and that both alerts and incidents can be created by analytics rules, of which there are several types, as explained in [Detect threats with built-in analytics rules in Microsoft Sentinel](detect-threats-built-in.md).

The following table shows the different possible scenarios that will cause an automation rule to run.

| Trigger type | Events that cause the rule to run |
| --------- | ------------ |
| **When incident is created** | **Unified security operations platform in Microsoft Defender:**<li>A new incident is created in the Microsoft Defender portal.<br><br>**Microsoft Sentinel not onboarded to unified platform:**<li>A new incident is created by an analytics rule.<li>An incident is ingested from Microsoft Defender XDR.<li>A new incident is created manually. |
| **When incident is updated** | <li>An incident's status is changed (closed/reopened/triaged).<li>An incident's owner is assigned or changed.<li>An incident's severity is raised or lowered.<li>Alerts are added to an incident.<li>Comments, tags, or tactics are added to an incident. |
| **When alert is created** | <li>An alert is created by a Microsoft Sentinel **Scheduled** or **NRT** analytics rule. |

## Create your automation rule

Most of the following instructions apply to any and all use cases for which you'll create automation rules.

If you're looking to suppress noisy incidents, try [handling false positives](false-positives.md#add-exceptions-by-using-automation-rules).

If you want to create an automation rule to apply to a specific analytics rule, see [Set automated responses and create the rule](detect-threats-custom.md#set-automated-responses-and-create-the-rule).

**To create your automation rule**:

1. For Microsoft Sentinel in the [Azure portal](https://portal.azure.com), select the **Configuration** > **Automation** page. For Microsoft Sentinel in the [Defender portal](https://security.microsoft.com/), select **Microsoft Sentinel** > **Configuration** > **Automation**.

1. From the **Automation** page in the Microsoft Sentinel navigation menu, select **Create** from the top menu and choose **Automation rule**.

    #### [Azure portal](#tab/azure-portal)
    :::image type="content" source="./media/create-manage-use-automation-rules/add-rule-automation.png" alt-text="Screenshot of creating a new automation rule in the Automation page." lightbox="./media/create-manage-use-automation-rules/add-rule-automation.png":::

    #### [Defender portal](#tab/defender-portal)
    :::image type="content" source="./media/create-manage-use-automation-rules/add-rule-automation-defender.png" alt-text="Screenshot of creating a new automation rule in the Automation page." lightbox="./media/create-manage-use-automation-rules/add-rule-automation-defender.png":::

    ---

1. The **Create new automation rule** panel opens. In the **Automation rule name** field, enter a name for your rule.

### Choose your trigger

From the **Trigger** drop-down, select the appropriate trigger according to the circumstance for which you're creating the automation rule&mdash;**When incident is created**, **When incident is updated**, or **When alert is created**.

:::image type="content" source="media/create-manage-use-automation-rules/select-trigger.png" alt-text="Screenshot of selecting the incident create or incident update trigger.":::

### Define conditions

Use the options in the **Conditions** area to define conditions for your automation rule.

- Rules you create for when an alert is created support only the **If Analytic rule name** property in your condition. Select whether you want the rule to be inclusive (*Contains*) or exclusive (*Does not contain*), and then select the analytic rule name from the drop-down list.

    Analytic rule name values include only analytics rules, and don't include other types of rules, such as threat intelligence or anomaly rules.

- Rules you create for when an incident is created or updated support a large variety of conditions, depending on your environment. These options start with whether your workspace is onboarded to the unified security operations platform:

    #### [Onboarded workspaces](#tab/onboarded)

    If your workspace is onboarded to the unified security operations platform, start by selecting one of the following operators, in either the Azure or the Defender portal:

    - **AND**: individual conditions that are evaluated as a group. The rule executes if *all* the conditions of this type are met.

        To work with the **AND** operator, select the **+ Add** expander and choose **Condition (And)** from the drop-down list. The list of conditions is populated by incident property and [entity property](entities-reference.md) fields.

    - **OR** (also known as *condition groups*): groups of conditions, each of which are evaluated independently. The rule executes if one or more groups of conditions are true. To learn how to work with these complex types of conditions, see [Add advanced conditions to automation rules](add-advanced-conditions-to-automation-rules.md).

    For example:

    :::image type="content" source="media/create-manage-use-automation-rules/conditions-onboarded.png" alt-text="Screenshot of automation rule conditions when your workspace is onboarded to the unified security operations platform.":::

    #### [Workspaces not onboarded](#tab/not-onboarded)

    If your workspace isn't onboarded to the unified security operations platform, start by defining the following condition properties:
    
    - **Incident provider**: Incidents can have two possible sources: they can be created inside Microsoft Sentinel, and they can also be [imported from&mdash;and synchronized with&mdash;Microsoft Defender XDR](microsoft-365-defender-sentinel-integration.md).

        If you selected one of the incident triggers and you want the automation rule to take effect only on incidents created in Microsoft Sentinel, or alternatively, only on those imported from Microsoft Defender XDR, specify the source in the **If Incident provider equals** condition. (This condition will be displayed only if an incident trigger is selected.)

    - **Analytic rule name**: For all trigger types, if you want the automation rule to take effect only on certain analytics rules, specify which ones by modifying the **If Analytics rule name contains** condition. (This condition will *not* be displayed if Microsoft Defender XDR is selected as the incident provider.)

    Then, continue by selecting one of the following operators:

    - **AND**: individual conditions that are evaluated as a group. The rule executes if *all* the conditions of this type are met.

        To work with the **AND** operator, select the **+ Add** expander and choose **Condition (And)** from the drop-down list. The list of conditions is populated by incident property and [entity property](entities-reference.md) fields.

    - **OR** (also known as *condition groups*): groups of conditions, each of which are evaluated independently. The rule executes if one or more groups of conditions are true. To learn how to work with these complex types of conditions, see [Add advanced conditions to automation rules](add-advanced-conditions-to-automation-rules.md).

    For example:

    :::image type="content" source="media/create-manage-use-automation-rules/conditions-not-onboarded.png" alt-text="Screenshot of automation rule conditions when the workspace isn't onboarded to the unified security operations platform.":::

    ---

    If you selected **When an incident is updated** as the trigger, start by defining your conditions, and then adding extra operators and values as needed.

**To define your conditions**:

1. Select a property from the first drop-down box on the left. You can begin typing any part of a property name in the search box to dynamically filter the list, so you can find what you're looking for quickly.

    :::image type="content" source="media/create-manage-use-automation-rules/filter-list.png" alt-text="Screenshot of typing in a search box to filter the list of choices.":::

1. Select an operator from the next drop-down box to the right.
    :::image type="content" source="media/create-manage-use-automation-rules/select-operator.png" alt-text="Screenshot of selecting a condition operator for automation rules.":::

    The list of operators you can choose from varies according to the selected trigger and property. 

    #### Conditions available with the create trigger

    | Property | Operator set |
    | -------- | -------- |
    | - **Title**<br>- **Description**<br>- All listed **entity properties** | - Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with |
    | - **Tag** (See [individual vs. collection](automate-incident-handling-with-automation-rules.md#tag-property-individual-vs-collection)) | **Any individual tag:**<br>- Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with<br><br>**Collection of all tags:**<br>- Contains/Does not contain |
    | - **Severity**<br>- **Status**<br>- **Custom details key** | - Equals/Does not equal |
    | - **Tactics**<br>- **Alert product names**<br>- **Custom details value**<br>- **Analytic rule name** | - Contains/Does not contain |

    #### Conditions available with the update trigger

    | Property | Operator set |
    | -------- | -------- |
    | - **Title**<br>- **Description**<br>- All listed **entity properties** | - Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with |
    | - **Tag** (See [individual vs. collection](automate-incident-handling-with-automation-rules.md#tag-property-individual-vs-collection)) | **Any individual tag:**<br>- Equals/Does not equal<br>- Contains/Does not contain<br>- Starts with/Does not start with<br>- Ends with/Does not end with<br><br>**Collection of all tags:**<br>- Contains/Does not contain |
    | - **Tag** (in addition to above)<br>- **Alerts**<br>- **Comments** | - Added |
    | - **Severity**<br>- **Status** | - Equals/Does not equal<br>- Changed<br>- Changed from<br>- Changed to |
    | - **Owner** | - Changed |
    | - **Updated by**<br>- **Custom details key** | - Equals/Does not equal |
    | - **Tactics** | - Contains/Does not contain<br>- Added |
    | - **Alert product names**<br>- **Custom details value**<br>- **Analytic rule name** | - Contains/Does not contain |

    #### Conditions available with the alert trigger

    The only condition that can be evaluated by rules based on the alert creation trigger is which Microsoft Sentinel analytics rule created the alert.

    Automation rules based on the alert trigger will therefore only run on alerts created by Microsoft Sentinel.

1. Enter a value in the field on the right. Depending on the property you chose, this might be either a text box or a drop-down in which you select from a closed list of values. You might also be able to add several values by selecting the dice icon to the right of the text box.

    :::image type="content" source="media/create-manage-use-automation-rules/add-values-to-condition.png" alt-text="Screenshot of adding values to your condition in automation rules.":::

Again, for setting complex **Or** conditions with different fields, see [Add advanced conditions to automation rules](add-advanced-conditions-to-automation-rules.md).

#### Conditions based on tags

You can create two kinds of conditions based on tags:

- Conditions with **Any individual tag** operators evaluate the specified value against every tag in the collection. The evaluation is *true* when *at least one tag* satisfies the condition.
- Conditions with **Collection of all tags** operators evaluate the specified value against the collection of tags as a single unit. The evaluation is *true* only if *the collection as a whole* satisfies the condition.

To add one of these conditions based on an incident's tags, take the following steps:

1. Create a new automation rule as described above.

1. Add a condition or a condition group.

1. Select **Tag** from the properties drop-down list.

1. Select the operators drop-down list to reveal the available operators to choose from.

    ##### [Onboarded workspaces](#tab/onboarded)

    :::image type="content" source="media/create-manage-use-automation-rules/tag-create-condition-defender.png" alt-text="Screenshot of list of operators for tag condition in create trigger rule--for onboarded workspaces." lightbox="media/create-manage-use-automation-rules/tag-create-condition-defender.png":::

    ##### [Workspaces not onboarded](#tab/not-onboarded)

    :::image type="content" source="media/create-manage-use-automation-rules/tag-create-condition-azure.png" alt-text="Screenshot of list of operators for tag condition in create trigger rule--for non-onboarded workspaces." lightbox="media/create-manage-use-automation-rules/tag-create-condition-azure.png":::

    ---

    See how the operators are divided in two categories as described before. Choose your operator carefully based on how you want the tags to be evaluated.

    For more information, see [*Tag* property: individual vs. collection](automate-incident-handling-with-automation-rules.md#tag-property-individual-vs-collection).

#### Conditions based on custom details

You can set the value of a [custom detail surfaced in an incident](surface-custom-details-in-alerts.md) as a condition of an automation rule. Recall that custom details are data points in raw event log records that can be surfaced and displayed in alerts and the incidents generated from them. Use custom details to get to the actual relevant content in your alerts without having to dig through query results.

**To add a condition based on a custom detail**:

1. Create a new automation rule as described [earlier](#create-your-automation-rule).

1. Add a condition or a condition group.

1. Select **Custom details key** from the properties drop-down list. Select **Equals** or **Does not equal** from the operators drop-down list.

    For the custom details condition, the values in the last drop-down list come from the custom details that were surfaced in all the analytics rules listed in the first condition. Select the custom detail you want to use as a condition.

    :::image type="content" source="media/create-manage-use-automation-rules/custom-detail-key-condition.png" alt-text="Screenshot of adding a custom detail key as a condition.":::

1. You chose the field you want to evaluate for this condition. Now specify the value appearing in that field that makes this condition evaluate to *true*.  
Select **+ Add item condition**.

    :::image type="content" source="media/create-manage-use-automation-rules/add-item-condition.png" alt-text="Screenshot of selecting add item condition for automation rules.":::

    The value condition line appears below.

    :::image type="content" source="media/create-manage-use-automation-rules/custom-details-value.png" alt-text="Screenshot of the custom detail value field appearing.":::

1. Select **Contains** or **Does not contain** from the operators drop-down list. In the text box to the right, enter the value for which you want the condition to evaluate to *true*.

    :::image type="content" source="media/create-manage-use-automation-rules/custom-details-value-filled.png" alt-text="Screenshot of the custom detail value field filled in.":::

In this example, if the incident has the custom detail *DestinationEmail*, and if the value of that detail is `pwned@bad-botnet.com`, the actions defined in the automation rule will run.

### Add actions

Choose the actions you want this automation rule to take. Available actions include **Assign owner**, **Change status**, **Change severity**, **Add tags**, and **Run playbook**. You can add as many actions as you like.

> [!NOTE]
> Only the **Run playbook** action is available in automation rules using the **alert trigger**.

:::image type="content" source="media/create-manage-use-automation-rules/select-action.png" alt-text="Screenshot of list of actions to select in automation rule.":::

For whichever action you choose, fill out the fields that appear for that action according to what you want done.

If you add a **Run playbook** action, you will be prompted to choose from the drop-down list of available playbooks. 

- Only playbooks that start with the **incident trigger** can be run from automation rules using one of the incident triggers, so only they will appear in the list. Likewise, only playbooks that start with the **alert trigger** are available in automation rules using the alert trigger.

- <a name="explicit-permissions"></a>Microsoft Sentinel must be granted explicit permissions in order to run playbooks. If a playbook appears "grayed out" in the drop-down list, it means Sentinel does not have permission to that playbook's resource group. Select the **Manage playbook permissions** link to assign permissions.

    In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and select **Apply**.
        :::image type="content" source="./media/tutorial-respond-threats-playbook/manage-permissions.png" alt-text="Manage permissions":::

    You yourself must have **owner** permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Microsoft Sentinel Automation Contributor** role on any resource group containing playbooks you want to run.

- If you don't yet have a playbook that will take the action you have in mind, [create a new playbook](tutorial-respond-threats-playbook.md). You will have to exit the automation rule creation process and restart it after you have created your playbook.

#### Move actions around

You can change the order of actions in your rule even after you've added them. Select the blue up or down arrows next to each action to move it up or down one step.

:::image type="content" source="media/create-manage-use-automation-rules/change-actions-order.png" alt-text="Screenshot showing how to move actions up or down.":::

### Finish creating your rule

1. Under **Rule expiration**, if you want your automation rule to expire, set an expiration date (and optionally, a time). Otherwise, leave it as *Indefinite*.

1. The **Order** field is prepopulated with the next available number for your rule's trigger type. This number determines where in the sequence of automation rules (of the same trigger type) this rule will run. You can change the number if you want this rule to run before an existing rule.

    See [Notes on execution order and priority](automate-incident-handling-with-automation-rules.md#notes-on-execution-order-and-priority) for more information.

1. Select **Apply**. You're done!

:::image type="content" source="media/create-manage-use-automation-rules/finish-creating-rule.png" alt-text="Screenshot of final steps of creating automation rule.":::

## Audit automation rule activity

Find out what automation rules might have done to a given incident. You have a full record of incident chronicles available to you in the *SecurityIncident* table in the **Logs** page in the Azure portal, or the **Advanced hunting** page in the Defender portal. Use the following query to see all your automation rule activity:

```kusto
SecurityIncident
| where ModifiedBy contains "Automation"
```

## Automation rules execution

Automation rules are run sequentially, according to the order you determine. Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined. See [Notes on execution order and priority](automate-incident-handling-with-automation-rules.md#notes-on-execution-order-and-priority) for more information.

Playbook actions within an automation rule might be treated differently under some circumstances, according to the following criteria:

| Playbook run time | Automation rule advances to the next action... |
| ----------------- | --------------------------------------------------- |
| Less than a second | Immediately after playbook is completed |
| Less than two minutes | Up to two minutes after playbook began running,<br>but no more than 10 seconds after the playbook is completed |
| More than two minutes | Two minutes after playbook began running,<br>regardless of whether or not it was completed |

## Next steps

In this document, you learned how to use automation rules to centrally manage response automation for Microsoft Sentinel incidents and alerts.

- To learn how to add advanced conditions with `OR` operators to automation rules, see [Add advanced conditions to Microsoft Sentinel automation rules](add-advanced-conditions-to-automation-rules.md).
- To learn more about automation rules, see [Automate incident handling in Microsoft Sentinel with automation rules](automate-incident-handling-with-automation-rules.md)
- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- To learn how to use automation rules to add tasks to incidents, see [Create incident tasks in Microsoft Sentinel using automation rules](create-tasks-automation-rule.md).
- To migrate alert-trigger playbooks to be invoked by automation rules, see [Migrate your Microsoft Sentinel alert-trigger playbooks to automation rules](migrate-playbooks-to-automation-rules.md)
- For help with implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
