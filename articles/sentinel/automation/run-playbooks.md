---
title: Automate and run Microsoft Sentinel playbooks
description: Learn how to automate incident response with Microsoft Sentinel playbooks, or run playbooks manually to remediate immediate security threats.
author: batamig
ms.author: bagol
ms.topic: how-to
ms.date: 04/17/2024
#customer-intent: As a SOC engineer, I want to understand how to automate and run playbooks in Microsoft Sentinel so that my team can remediate security threats in our environment more efficiently.
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
---

# Automate and run Microsoft Sentinel playbooks

Playbooks are collections of procedures that can be run from Microsoft Sentinel in response to an entire incident, to an individual alert, or to a specific entity. A playbook can help automate and orchestrate your response, and can be set to run automatically when specific alerts are generated or when incidents are created or updated, by being attached to an automation rule. It can also be run manually on-demand on specific incidents, alerts, or entities.

This article describes how to attach playbooks to analytics rules or automation rules, or run playbooks manually on specific incidents, alerts, or entities.

> [!NOTE]
> Playbooks in Microsoft Sentinel are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), which means that you get all the power, customizability, and built-in templates of Logic Apps. Additional charges might apply. Visit the [Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/) pricing page for more details.

[!INCLUDE [unified-soc-preview](../includes/unified-soc-preview.md)]

## Prerequisites

Before you start, make sure that you have a playbook available to automate or run, with a trigger, conditions, and actions defined. For more information, see [Create and manage Microsoft Sentinel playbooks](create-playbooks.md).

### Required Azure roles to run playbooks

To run playbooks, you need the following Azure roles:


|Role  |Description  |
|---------|---------|
| **Owner** | Lets you grant access to playbooks in the resource group. |
|**Microsoft Sentinel Contributor**     |    Attach a playbook to an analytics rule or automation rule     |
|**Microsoft Sentinel Responder**     |  Access an incident in order to run a playbook manually. To actually run the playbook, you also need the following roles:  <br><br>- **Microsoft Sentinel Playbook Operator**, to run a playbook manually<br>    - **Microsoft Sentinel Automation Contributor** role, to allow automation rules to run playbooks.     |

For more information, see [playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

### Extra permissions required to run playbooks on incidents

<a name="permissions-to-run-playbooks"></a><a name="explicit-permissions"></a>
[!INCLUDE [playbooks-service-account-permissions](../includes/playbooks-service-account-permissions.md)]

### Configure playbook permissions for incidents in a multitenant deployment

In a multitenant deployment, if the playbook you want to run is in a different tenant, you must grant the Microsoft Sentinel service account with permission to run the playbook in the playbook's tenant.

1. From the Microsoft Sentinel navigation menu in the playbooks' tenant, select **Settings**.
1. In the **Settings** page, select the **Settings** tab, then the **Playbook permissions** expander.
1. Select the **Configure permissions** button to open the **Manage permissions** panel.
1. Mark the check boxes of the resource groups containing the playbooks you want to run, and select **Apply**. For example:

    :::image type="content" source="../media/tutorial-respond-threats-playbook/manage-permissions.png" alt-text="Screenshot that shows the actions section with run playbook selected.":::

You yourself must have **Owner** permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Microsoft Sentinel Playbook Operator** role on any resource group containing playbooks you want to run.

If, in an MSSP scenario, you want to [run a playbook in a customer tenant](../automate-incident-handling-with-automation-rules.md#permissions-in-a-multitenant-architecture) from an automation rule created while signed into the service provider tenant, you must grant Microsoft Sentinel permission to run the playbook in both tenants:

- **In the customer tenant**, follow the standard instructions for the multitenant deployment.
- **In the service provider tenant**, add the Azure Security Insights app in your Azure Lighthouse onboarding template as follows:

    1. From the Azure portal go to Microsoft Entra ID and select **Enterprise applications**.
    1. Select **Application type** and filter on **Microsoft Applications**.
    1. In the search box, enter **Azure Security Insights**.
    1. Copy the **Object ID** field. You need to add this extra authorization to your existing Azure Lighthouse delegation.

The **Microsoft Sentinel Automation Contributor** role has a fixed GUID of `f4c81013-99ee-4d62-a7ee-b3f1f648599a`. A sample Azure Lighthouse authorization would look like this in your parameters template:

```json
{
"principalId": "<Enter the Azure Security Insights app Object ID>", 
"roleDefinitionId": "f4c81013-99ee-4d62-a7ee-b3f1f648599a",
"principalIdDisplayName": "Microsoft Sentinel Automation Contributors" 
}
```

## Automate responses to incidents and alerts

<a name="respond-to-incidents"></a><a name="respond-to-alerts"></a> <a name="respond-to-incidents-and-alerts"></a><!-- Anchor links included here for backward compatibility with, and redirection of, old headings -->

To respond automatically to entire incidents or individual alerts with a playbook, create an automation rule that runs when the incident is created or updated, or when the alert is generated. This automation rule includes a step that calls the playbook you want to use.

**To create an automation rule**:

1. From the **Automation** page in the Microsoft Sentinel navigation menu, select **Create** from the top menu and then **Automation rule**. For example:

   :::image type="content" source="../media/tutorial-respond-threats-playbook/add-new-rule.png" alt-text="Screenshot showing how to add a new automation rule.":::

1. The **Create new automation rule** panel opens. Enter a name for your rule. Your options differ depending on whether your workspace is onboarded to the unified security operations platform. For example:

    ### [Onboarded workspaces](#tab/after-onboarding)

    :::image type="content" source="../media/tutorial-respond-threats-playbook/create-automation-rule-onboarded.png" alt-text="Screenshot showing the automation rule creation wizard.":::

    ### [Workspaces that aren't onboarded](#tab/before-onboarding)

   :::image type="content" source="../media/tutorial-respond-threats-playbook/create-automation-rule.png" alt-text="Screenshot showing the automation rule creation wizard.":::

    ---

1. **Trigger:** Select the appropriate trigger according to the circumstance for which you're creating the automation rule &mdash; **When incident is created**, **When incident is updated**, or **When alert is created**.

1. **Conditions:**

    1. If your workspace isn't yet onboarded to the unified security operations platform, incidents can have two possible sources:

        - Incidents can be created inside Microsoft Sentinel
        - Incidents can be [imported from &mdash; and synchronized with &mdash; Microsoft Defender XDR](../microsoft-365-defender-sentinel-integration.md). 

        If you selected one of the incident triggers and you want the automation rule to take effect only on incidents sourced in Microsoft Sentinel, or alternatively in Microsoft Defender XDR, specify the source in the **If Incident provider equals** condition.

        This condition is displayed only if an incident trigger is selected and your workspace isn't onboarded to the unified security operations platform.

    1. For all trigger types, if you want the automation rule to take effect only on certain analytics rules, specify which ones by modifying the **If Analytics rule name contains** condition.

    1. Add any other conditions you want to determine whether this automation rule runs. Select **+ Add** and select [conditions or condition groups](../add-advanced-conditions-to-automation-rules.md) from the drop-down list. The list of conditions is populated by alert detail and entity identifier fields.

1. **Actions:**

    1. Since you're using this automation rule to run a playbook, select the **Run playbook** action from the drop-down list. You'll then be prompted to select from a second drop-down list that shows the available playbooks. An automation rule can run only those playbooks that start with the same trigger (incident or alert) as the trigger defined in the rule, so only those playbooks appear in the list. 

       If a playbook appears grayed out in the drop-down list, it means that Microsoft Sentinel doesn't have permission to that playbook's resource group. Select the **Manage playbook permissions** link to assign permissions.

       In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and select **Apply**. For example:

       :::image type="content" source="../media/tutorial-respond-threats-playbook/manage-permissions.png" alt-text="Screenshot that shows the actions section with run playbook selected.":::

        You yourself must have **Owner** permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Microsoft Sentinel Playbook Operator** role on any resource group containing playbooks you want to run.

        For more information, see [Extra permissions required to run playbooks on incidents](#extra-permissions-required-to-run-playbooks-on-incidents).

    1. Add any other actions you want for this rule. You can change the order of execution of actions by selecting the up or down arrows to the right of any action.

1. Set an expiration date for your automation rule if you want it to have one.

1. Enter a number under **Order** to determine where in the sequence of automation rules this rule runs.

1. Select **Apply** to complete your automation.

For more information, see [Create and manage Microsoft Sentinel playbooks](create-playbooks.md).

### Respond to alerts&mdash;legacy method

Another way to run playbooks automatically in response to **alerts** is to call them from an **analytics rule**. When the rule generates an alert, the playbook runs.

**This method will be deprecated as of March 2026.**

Beginning **June 2023**, you can no longer add playbooks to analytics rules in this way. However, you can still see the existing playbooks called from analytics rules, and these playbooks will still run until March 2026. We strongly encourage you to [create automation rules to call these playbooks instead](migrate-playbooks-to-automation-rules.md) before then.

## Run a playbook manually, on demand

You can also manually run a playbook on demand, whether in response to alerts, incidents (in preview), or entities (also in preview). This can be useful in situations where you want more human input into and control over orchestration and response processes.

### Run a playbook manually on an alert

This procedure isn't supported in the unified security operations platform.

In the Azure portal, select one of the following tabs as needed for your environment:

#### [Incident details page](#tab/incidents)

1. In the **Incidents** page, select an incident, and then select **View full details** to open the incident details page.

1. In the incident details page, in the **Incident timeline** widget, select the alert you want to run the playbook on. Select the three dots at the end of the alert's line and select **Run playbook** from the pop-up menu.

    :::image type="content" source="../media/investigate-incidents/remove-alert.png" alt-text="Screenshot of running a playbook on an alert on-demand.":::

1. The **Alert playbooks** pane opens. You see a list of all playbooks configured with the **Microsoft Sentinel Alert** Logic Apps trigger that you have access to.

1. Select **Run** on the line of a specific playbook to run it immediately.

#### [Investigation graph](#tab/cases)

1. In the **Incidents** page, select an incident, and then select **View full details** to open the incident details page.

1. In the incident details page, select the **Alerts** tab, select the alert you want to run the playbook on, and select the **View playbooks** link at the end of the line of that alert.

1. The **Alert playbooks** pane opens. You see a list of all playbooks configured with the **Microsoft Sentinel Alert** Logic Apps trigger that you have access to.

1. Select **Run** on the line of a specific playbook to run it immediately.

---

You can see the run history for playbooks on an alert by selecting the **Runs** tab on the **Alert playbooks** pane. It might take a few seconds for any just-completed run to appear in the list. Selecting a specific run opens the full run log in Logic Apps.

### Run a playbook manually on an incident (preview)

This procedure differs, depending on if you're working in Microsoft Sentinel or in the unified security operations platform. Select the relevant tab for your environment:


#### [Azure portal](#tab/azure)

1. In the **Incidents** page, select an incident.

1. From the incident details pane that appears on the side, select **Actions > Run playbook (Preview)**. 

    Selecting the three dots at the end of the incident's line on the grid or right-clicking the incident displays the same list as the **Action** button.

1. The **Run playbook on incident** panel opens on the side. You see a list of all playbooks configured with the **Microsoft Sentinel Incident** Logic Apps trigger that you have access to.

   If you don't see the playbook you want to run in the list, it means Microsoft Sentinel doesn't have permissions to run playbooks in that resource group.

    To grant those permissions, select **Settings** > **Settings** > **Playbook permissions** > **Configure permissions**. In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and select **Apply**.

    For information, see [Extra permissions required to run playbooks on incidents](#extra-permissions-required-to-run-playbooks-on-incidents).

1. Select **Run** on the line of a specific playbook to run it immediately.

    You must have the **Microsoft Sentinel playbook operator** role on any resource group containing playbooks you want to run. If you're unable to run the playbook due to missing permissions, we recommend you contact an admin to grant you with the relevant permissions. For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).

#### [Microsoft Defender portal](#tab/microsoft-defender)

1. In the **Incidents** page, select an incident.

1. From the incident details pane that appears on the side, select **Run Playbook (Preview)**.

1. The **Run playbook on incident** panel opens on the side, with all related playbooks for the selected incident. In the **Action** column, select **Run playbook** for the playbook you want to run immediately.

The **Actions** column might also show one of the following statuses:

|Status  |Description and action required |
|---------|---------|
|<a name="missing-perms"></a>**Missing permissions**      | You must have the **Microsoft Sentinel Playbook Operator** role on any resource group containing playbooks you want to run. If you're missing permissions, we recommend you contact an admin to grant you with the relevant permissions. <br><br>For more information, see [Microsoft Sentinel playbook prerequisites](automate-responses-with-playbooks.md#prerequisites).|
|<a name="grant-perms"></a>**Grant permission**     | Microsoft Sentinel is missing the **Microsoft Sentinel Automation Contributor** role, which is required to run playbooks on incidents. In such cases, select **Grant permission** to open the **Manage permissions** pane. The **Manage permissions** pane is filtered by default to the selected playbook's resource group. Select the resource group and then select **Apply** to grant the required permissions. <br><br>You must be an **Owner** or a **User access administrator** on the resource group to which you want to grant Microsoft Sentinel permissions. If you're missing permissions, the resource group is greyed out and you can't select it. In such cases, we recommend you contact an admin to grant you with the relevant permissions. <br><br>For more information, see [Extra permissions required to run playbooks on incidents](#extra-permissions-required-to-run-playbooks-on-incidents).  |

---

View the run history for playbooks on an incident by selecting the **Runs** tab on the **Run playbook on incident** panel. It might take a few seconds for any just-completed run to appear in the list. Selecting a specific run opens the full run log in Logic Apps.

### Run a playbook manually on an entity (preview)

This procedure isn't supported in the unified security operations platform.

Select an entity in one of the following ways, depending on your originating context:

#### [Incident details page (new)](#tab/incident-details-new)

**If you're in an incident's details page (new version):**

In the **Entities** widget in the **Overview** tab, locate your entity, and do one of the following: 

- Don't select the entity. Instead, select the three dots to the right of the entity, and then select **Run playbook (Preview)**. Locate the playbook you want to run, and select **Run** in that playbook's row.

- Select the entity to open the **Entities tab** of the incident details page. Locate your entity on the list, and select the three dots to the right. Locate the playbook you want to run, and select **Run** in that playbook's row.

- Select an entity and drill down to the entity details page. Then, select the **Run playbook (Preview)** button in the left-hand panel. Locate the playbook you want to run, and select **Run** in that playbook's row.

#### [Incident details page (legacy)](#tab/incident-details-legacy)

**If you're in an incident's details page (legacy version):**

1. Select the incident's **Entities** tab and locate your entity on the list.

1. Do one of the following:

    - Select the **Run playbook (Preview)** link at the end of the entity line in the list.  
    - Select the entity to drill down to the entity details page and select the **Run playbook (Preview)** button in the left-hand panel.

1. Locate the playbook you want to run, and select **Run** in that playbook's row.

#### [Investigation graph](#tab/investigation-graph)

**If you're in the Investigation graph:**

1. Select an entity in the graph and then select the **Run playbook (Preview)** button in the entity side panel.  

    For some entity types, you might have to select the **Entity actions** button and from the resulting menu select **Run playbook (Preview)**.

1. Locate the playbook you want to run, and select **Run** in that playbook's row.
    
#### [Pro-active hunting](#tab/hunting)

**If you're proactively hunting for threats:**

1. From the **Entity behavior** screen, select an entity from the lists on the page, or search for and select another entity.
1. In the [entity page](../entity-pages.md), select the **Run playbook (Preview)** button in the left-hand panel.
1. Locate the playbook you want to run, and select **Run** in that playbook's row.
---

Regardless of the context you came from, the last step in this procedure is from the **Run playbook on *\<entity type>*** panel. This panel shows list of all playbooks that you have access to that were configured with the **Microsoft Sentinel Entity** Logic Apps trigger for the selected entity type.

On the **Run playbook on *\<entity type>** pane, select the **Runs** tab to see the playbook run history for a given entity. It might take a few seconds for any just-completed run to appear in the list. Selecting a specific run opens the full run log in Logic Apps.

## Related content

For more information, see:

- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Automate threat response in Microsoft Sentinel with automation rules](../automate-incident-handling-with-automation-rules.md)