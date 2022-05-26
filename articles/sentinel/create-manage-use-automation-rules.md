---
title: Create and use Microsoft Sentinel automation rules to manage incidents | Microsoft Docs
description: This article explains how to create and use automation rules in Microsoft Sentinel to manage and handle incidents, in order to maximize your SOC's efficiency and effectiveness in response to security threats.
author: yelevin
ms.topic: how-to
ms.date: 05/23/2022
ms.author: yelevin
---

# Create and use Microsoft Sentinel automation rules to manage incidents

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article explains how to create and use automation rules in Microsoft Sentinel to manage and handle incidents, in order to maximize your SOC's efficiency and effectiveness in response to security threats.

In this article you'll learn how to define the triggers and conditions that will determine when your automation rule will run, the various actions that you can have the rule perform, and the remaining features and functionalities.

## Design your automation rule

### Determine the scope

The first step in designing and defining your automation rule is figuring out which incidents you want it to apply to. This determination will directly impact how you create the rule.

You also want to determine your use case. What are you trying to accomplish with this automation? Consider the following options:

- Suppress noisy incidents (see [this article on handling false positives](false-positives.md#add-exceptions-by-using-automation-rules) instead)
- Triage new incidents by changing their status from New to Active and assigning an owner.
- Tag incidents to classify them.
- Escalate an incident by assigning a new owner.
- Close resolved incidents, specifying a reason and adding comments.
- Analyze the incident's contents (alerts, entities, and other properties) and take further action by calling a playbook.

### Determine the trigger

Do you want this automation to be activated when new incidents are created? Or any time an incident gets updated?

Automation rules are triggered **when an incident is created or updated** (the update trigger is now in **Preview**). To review – incidents are created from alerts by analytics rules, of which there are several types, as explained in [Detect threats with built-in analytics rules in Microsoft Sentinel](detect-threats-built-in.md).

The following table shows the different possible ways that incidents can be created or updated that will cause an automation rule to run.

| Trigger type | Events that cause the rule to run |
| --------- | ------------ |
| **When incident is created** | - A new incident is created by an analytics rule.<br>- An incident is ingested from Microsoft 365 Defender.<br>- A new incident is created manually. |
| **When incident is updated**<br>(Preview) | - An incident's status is changed (closed/reopened/triaged).<br>- An incident's owner is assigned or changed.<br>- An incident's severity is raised or lowered.<br>- Alerts are added to an incident.<br>- Comments, tags, or tactics are added to an incident. |

## Create your automation rule

Most of the following instructions apply to any and all use cases for which you'll create automation rules.

- For the use case of suppressing noisy incidents, see [this article on handling false positives](false-positives.md#add-exceptions-by-using-automation-rules).
- For creating an automation rule that will apply to a single specific analytics rule, see [this article on configuring automated response in analytics rules](detect-threats-custom.md#set-automated-responses-and-create-the-rule).

<!--Depending on your choice of scope and use case, choose a location from which to begin creating your rule:

| Use case | Goal of automation rule | Start from here |
| - | - | - |
| **Suppression** | - Ignore and close noisy incidents | **Incidents** blade |
| **Detection-based triage** | - Handle incidents based on the rules that created them<br>- Create an automation rule that will apply only to one analytics rule | **Analytics** blade |
| **Entity-based triage**<br>or anything else | - Handle incidents based on criteria in the incident<br>- Create a single automation rule that will apply to detections made by many or all analytics rules | **Automation** blade |

### Choose a starting point

# [Incidents](#tab/incidents)

1. From the **Incidents** blade in the Microsoft Sentinel navigation menu, select an example of the incident you want to suppress.

    :::image type="content" source="media/create-manage-use-automation-rules/create-automation-rule-on-incident.png" alt-text="Screenshot of creating an automation rule from the incidents blade." lightbox="media/create-manage-use-automation-rules/create-automation-rule-on-incident.png":::

1. Select **Actions** at the bottom of the incident details pane, and then **Create automation rule**.

    :::image type="content" source="media/create-manage-use-automation-rules/select-create-automation-rule.png" alt-text="Screenshot of pop up menu to select automation rule.":::

    - The identifying fields in the **Create new automation rule** panel are automatically populated with values from the incident:

        - **Automation rule name:** the incident name
        - **Analytics rule condition:** the analytics rule that generated the incident
        - **Other conditions:** all the entities identified in the incident

    - The prescriptive fields are populated with default values:

        - **Trigger:** When incident is created
        - **Actions:** Change status to **Closed**, with the reason **Benign Positive - suspicious but expected**.
        - **Rule expiration:** 24 hours from when the rule creation wizard was opened.

    Depending on your needs for this rule, you can select the **When incident is updated** trigger instead, add or remove conditions and actions, or change any of the other values, as necessary.

    :::image type="content" source="media/create-manage-use-automation-rules/incident-automation-rule-populated.png" alt-text="Screenshot of automation rule wizard launched from incident panel.":::

# [Analytics](#tab/analytics)

1. From the **Analytics** blade in the Microsoft Sentinel navigation menu:
    - Select an analytics rule for which you want to automate a response, and select **Edit** on the rule details pane,  
    **- OR -**
    - Select **Create** from the top menu bar and choose a rule type to create a new rule.

1. In the **Automated response** tab of the **Analytics rule wizard**, under **Incident automation**, select **+ Add new**.

    In the **Create new automation rule** panel, the **Analytics rule condition** is set to the analytics rule being edited, and the **Trigger** is set to **When incident is created**. These settings are locked and can't be changed. 

    The only other field populated is **Order**, set to a number higher than any automation rule already defined in this analytics rule. This ensures that the current automation rule will be the last to run. You can change this number if necessary.

    All the other fields in the panel are open and unpopulated, and you can add conditions and actions as you wish.

# [Automation](#tab/automation)-->


1. From the **Automation** blade in the Microsoft Sentinel navigation menu, select **Create** from the top menu and choose **Automation rule**.

   :::image type="content" source="./media/create-manage-use-automation-rules/add-rule-automation.png" alt-text="Screenshot of creating a new automation rule in the Automation blade." lightbox="./media/create-manage-use-automation-rules/add-rule-automation.png":::

1. The **Create new automation rule** panel opens. Enter a name for your rule.

    :::image type="content" source="media/create-manage-use-automation-rules/create-automation-rule.png" alt-text="Screenshot of Create new automation rule wizard.":::

1. If you want the automation rule to take effect only on certain analytics rules, specify which ones by modifying the **If Analytics rule name** condition.

### Choose your trigger

From the **Trigger** drop-down, select **When incident is created** or **When incident is updated (Preview)** according to what you decided when designing your rule.

:::image type="content" source="media/create-manage-use-automation-rules/select-trigger.png" alt-text="Screenshot of selecting the incident create or incident update trigger.":::

### Add conditions

Add any other conditions you want this automation rule's activation to depend on. Select **+ Add condition** and choose conditions from the drop-down list. The list of conditions is populated by incident property and entity identifier fields.

1. Select a property from the first drop-down box on the left. You can begin typing any part of a property name in the search box to dynamically filter the list, so you can find what you're looking for quickly.
    :::image type="content" source="media/create-manage-use-automation-rules/filter-list.png" alt-text="Screenshot of typing in a search box to filter the list of choices.":::

1. Select an operator from the next drop-down box to the right.
    :::image type="content" source="media/create-manage-use-automation-rules/select-operator.png" alt-text="Screenshot of selecting a condition operator for automation rules.":::

1. Enter a value in the text box on the right. Depending on the property you chose, this might be a drop-down list from which you would select the values you choose. You might also be able to add several values by selecting the icon to the right of the text box (highlighted by the red arrow below).
    :::image type="content" source="media/create-manage-use-automation-rules/add-values-to-condition.png" alt-text="Screenshot of adding values to your condition in automation rules.":::


### Add actions

1. Choose the actions you want this automation rule to take. Available actions include **Assign owner**, **Change status**, **Change severity**, **Add tags**, and **Run playbook**. You can add as many actions as you like.

1. If you add a **Run playbook** action, you will be prompted to choose from the drop-down list of available playbooks. Only playbooks that start with the **incident trigger** can be run from automation rules, so only they will appear in the list.<a name="permissions-to-run-playbooks"></a>

    <a name="explicit-permissions"></a>

    > [!IMPORTANT]
    >
    > **Microsoft Sentinel must be granted explicit permissions in order to run playbooks based on the incident trigger**, whether manually or from automation rules. If a playbook appears "grayed out" in the drop-down list, it means Sentinel does not have permission to that playbook's resource group. Click the **Manage playbook permissions** link to assign permissions.
    >
    > In the **Manage permissions** panel that opens up, mark the check boxes of the resource groups containing the playbooks you want to run, and click **Apply**.
    >  
    > :::image type="content" source="./media/tutorial-respond-threats-playbook/manage-permissions.png" alt-text="Manage permissions":::
    >
    > - You yourself must have **owner** permissions on any resource group to which you want to grant Microsoft Sentinel permissions, and you must have the **Logic App Contributor** role on any resource group containing playbooks you want to run.
    >
    > - In a multi-tenant deployment, if the playbook you want to run is in a different tenant, you must grant Microsoft Sentinel permission to run the playbook in the playbook's tenant.
    >    1. From the Microsoft Sentinel navigation menu in the playbooks' tenant, select **Settings**.
    >    1. In the **Settings** blade, select the **Settings** tab, then the **Playbook permissions** expander.
    >    1. Click the **Configure permissions** button to open the **Manage permissions** panel mentioned above, and continue as described there.
    >
    > - If, in an **MSSP** scenario, you want to [run a playbook in a customer tenant](automate-incident-handling-with-automation-rules.md#permissions-in-a-multi-tenant-architecture) from an automation rule created while signed into the service provider tenant, you must grant Microsoft Sentinel permission to run the playbook in ***both tenants***. In the **customer** tenant, follow the instructions for the multi-tenant deployment in the preceding bullet point. In the **service provider** tenant, you must add the Azure Security Insights app in your Azure Lighthouse onboarding template:
    >    1. From the Azure Portal go to **Azure Active Directory**.
    >    1. Click on **Enterprise Applications**.
    >    1. Select **Application Type**  and filter on **Microsoft Applications**.
    >    1. In the search box type **Azure Security Insights**.
    >    1. Copy the **Object ID** field. You will need to add this additional authorization to your existing Azure Lighthouse delegation.
    >
    >    The **Microsoft Sentinel Automation Contributor** role has a fixed GUID which is `f4c81013-99ee-4d62-a7ee-b3f1f648599a`. A sample Azure Lighthouse authorization would look like this in your parameters template:
    >    
    >    ```json
    >    {
    >        "principalId": "<Enter the Azure Security Insights app Object ID>", 
    >        "roleDefinitionId": "f4c81013-99ee-4d62-a7ee-b3f1f648599a",
    >        "principalIdDisplayName": "Microsoft Sentinel Automation Contributors" 
    >    }
    >    ```

1. Set an expiration date for your automation rule if you want it to have one.

1. Enter a number under **Order** to determine where in the sequence of automation rules this rule will run.

1. Click **Apply**. You're done!

## Components

Automation rules are made up of several components:

### Trigger

Automation rules are triggered by the creation of an incident. They can also be triggered when an incident is updated (now in **Preview**).

To review – incidents are created from alerts by analytics rules, of which there are several types, as explained in the tutorial [Detect threats with built-in analytics rules in Microsoft Sentinel](detect-threats-built-in.md).

### Conditions

Complex sets of conditions can be defined to govern when actions (see below) should run. These conditions are typically based on the states or values of attributes of incidents and their entities, and they can include `AND`/`OR`/`NOT`/`CONTAINS` operators.

### Actions

Actions can be defined to run when the conditions (see above) are met. You can define many actions in a rule, and you can choose the order in which they’ll run (see below). The following actions can be defined using automation rules, without the need for the [advanced functionality of a playbook](automate-responses-with-playbooks.md):

- Changing the status of an incident, keeping your workflow up to date.

  - When changing to “closed,” specifying the [closing reason](investigate-cases.md#closing-an-incident) and adding a comment. This helps you keep track of your performance and effectiveness, and fine-tune to reduce [false positives](false-positives.md).

- Changing the severity of an incident – you can reevaluate and reprioritize based on the presence, absence, values, or attributes of entities involved in the incident.

- Assigning an incident to an owner – this helps you direct types of incidents to the personnel best suited to deal with them, or to the most available personnel.

- Adding a tag to an incident – this is useful for classifying incidents by subject, by attacker, or by any other common denominator.

Also, you can define an action to [**run a playbook**](tutorial-respond-threats-playbook.md), in order to take more complex response actions, including any that involve external systems. **Only** playbooks activated by the [**incident trigger**](automate-responses-with-playbooks.md#azure-logic-apps-basic-concepts) are available to be used in automation rules. You can define an action to include multiple playbooks, or combinations of playbooks and other actions, and the order in which they will run.

Playbooks using [either version of Logic Apps (Standard or Consumption)](automate-responses-with-playbooks.md#two-types-of-logic-apps) will be available to run from automation rules.

### Expiration date

You can define an expiration date on an automation rule. The rule will be disabled after that date. This is useful for handling (that is, closing) "noise" incidents caused by planned, time-limited activities such as penetration testing.

### Order

You can define the order in which automation rules will run. Later automation rules will evaluate the conditions of the incident according to its state after being acted on by previous automation rules.

For example, if "First Automation Rule" changed an incident's severity from Medium to Low, and "Second Automation Rule" is defined to run only on incidents with Medium or higher severity, it won't run on that incident.

## Auditing automation rule activity

You may be interested in knowing what happened to a given incident, and what a certain automation rule may or may not have done to it. You have a full record of incident chronicles available to you in the *SecurityIncident* table in the **Logs** blade. Use the following query to see all your automation rule activity:

```kusto
SecurityIncident
| where ModifiedBy contains "Automation"
```

## Common use cases and scenarios

### Incident-triggered automation

Before automation rules existed, only alerts could trigger an automated response, through the use of playbooks. With automation rules, incidents can now trigger automated response chains, which can include new incident-triggered playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)), when an incident is created. 

### Trigger playbooks for Microsoft providers

Automation rules provide a way to automate the handling of Microsoft security alerts by applying these rules to incidents created from the alerts. The automation rules can call playbooks ([special permissions are required](#permissions-for-automation-rules-to-run-playbooks)) and pass the incidents to them with all their details, including alerts and entities. In general, Microsoft Sentinel best practices dictate using the incidents queue as the focal point of security operations.

Microsoft security alerts include the following:

- Microsoft Defender for Cloud Apps
- Azure AD Identity Protection
- Microsoft Defender for Cloud (formerly Azure Defender or Azure Security Center)
- Defender for IoT (formerly Azure Security Center for IoT)
- Microsoft Defender for Office 365 (formerly Office 365 ATP)
- Microsoft Defender for Endpoint (formerly MDATP)
- Microsoft Defender for Identity (formerly Azure ATP)

### Multiple sequenced playbooks/actions in a single rule

You can now have near-complete control over the order of execution of actions and playbooks in a single automation rule. You also control the order of execution of the automation rules themselves. This allows you to greatly simplify your playbooks, reducing them to a single task or a small, straightforward sequence of tasks, and combine these small playbooks in different combinations in different automation rules.

### Assign one playbook to multiple analytics rules at once

If you have a task you want to automate on all your analytics rules – say, the creation of a support ticket in an external ticketing system – you can apply a single playbook to any or all of your analytics rules – including any future rules – in one shot. This makes simple but repetitive maintenance and housekeeping tasks a lot less of a chore.

### Automatic assignment of incidents

You can assign incidents to the right owner automatically. If your SOC has an analyst who specializes in a particular platform, any incidents relating to that platform can be automatically assigned to that analyst.

### Incident suppression

You can use rules to automatically resolve incidents that are known false/benign positives without the use of playbooks. For example, when running penetration tests, doing scheduled maintenance or upgrades, or testing automation procedures, many false-positive incidents may be created that the SOC wants to ignore. A time-limited automation rule can automatically close these incidents as they are created, while tagging them with a descriptor of the cause of their generation.

### Time-limited automation

You can add expiration dates for your automation rules. There may be cases other than incident suppression that warrant time-limited automation. You may want to assign a particular type of incident to a particular user (say, an intern or a consultant) for a specific time frame. If the time frame is known in advance, you can effectively cause the rule to be disabled at the end of its relevancy, without having to remember to do so.

### Automatically tag incidents

You can automatically add free-text tags to incidents to group or classify them according to any criteria of your choosing.

## Automation rules execution

Automation rules are run sequentially, according to the order you determine. Each automation rule is executed after the previous one has finished its run. Within an automation rule, all actions are run sequentially in the order in which they are defined.

Playbook actions within an automation rule may be treated differently under some circumstances, according to the following criteria:

| Playbook run time | Automation rule advances to the next action... |
| ----------------- | --------------------------------------------------- |
| Less than a second | Immediately after playbook is completed |
| Less than two minutes | Up to two minutes after playbook began running,<br>but no more than 10 seconds after the playbook is completed |
| More than two minutes | Two minutes after playbook began running,<br>regardless of whether or not it was completed |
|

### Permissions for automation rules to run playbooks

When a Microsoft Sentinel automation rule runs a playbook, it uses a special Microsoft Sentinel service account specifically authorized for this action. The use of this account (as opposed to your user account) increases the security level of the service.

In order for an automation rule to run a playbook, this account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule will be able to run any playbook in that resource group.

When you're configuring an automation rule and adding a **run playbook** action, a drop-down list of playbooks will appear. Playbooks to which Microsoft Sentinel does not have permissions will show as unavailable ("grayed out"). You can grant Microsoft Sentinel permission to the playbooks' resource groups on the spot by selecting the **Manage playbook permissions** link. To grant those permissions, you'll need **Owner** permissions on those resource groups. [See the full permissions requirements](tutorial-respond-threats-playbook.md#respond-to-incidents).

#### Permissions in a multi-tenant architecture

Automation rules fully support cross-workspace and [multi-tenant deployments](extend-sentinel-across-workspaces-tenants.md#managing-workspaces-across-tenants-using-azure-lighthouse) (in the case of multi-tenant, using [Azure Lighthouse](../lighthouse/index.yml)).

Therefore, if your Microsoft Sentinel deployment uses a multi-tenant architecture, you can have an automation rule in one tenant run a playbook that lives in a different tenant, but permissions for Sentinel to run the playbooks must be defined in the tenant where the playbooks reside, not in the tenant where the automation rules are defined.

In the specific case of a Managed Security Service Provider (MSSP), where a service provider tenant manages a Microsoft Sentinel workspace in a customer tenant, there are two particular scenarios that warrant your attention:

- **An automation rule created in the customer tenant is configured to run a playbook located in the service provider tenant.** 

    This approach is normally used to protect intellectual property in the playbook. Nothing special is required for this scenario to work. When defining a playbook action in your automation rule, and you get to the stage where you grant Microsoft Sentinel permissions on the relevant resource group where the playbook is located (using the **Manage playbook permissions** panel), you'll see the resource groups belonging to the service provider tenant among those you can choose from. [See the whole process outlined here](tutorial-respond-threats-playbook.md#respond-to-incidents).

- **An automation rule created in the customer workspace (while signed into the service provider tenant) is configured to run a playbook located in the customer tenant**.

    This configuration is used when there is no need to protect intellectual property. For this scenario to work, permissions to execute the playbook need to be granted to Microsoft Sentinel in ***both tenants***. In the customer tenant, you grant them in the **Manage playbook permissions** panel, just like in the scenario above. To grant the relevant permissions in the service provider tenant, you need to add an additional Azure Lighthouse delegation that grants access rights to the **Azure Security Insights** app, with the **Microsoft Sentinel Automation Contributor** role, on the resource group where the playbook resides.

    The scenario looks like this:

    :::image type="content" source="./media/automate-incident-handling-with-automation-rules/automation-rule-multi-tenant.png" alt-text="Multi-tenant automation rule architecture":::

    See [our instructions](tutorial-respond-threats-playbook.md#permissions-to-run-playbooks) for setting this up.

## Next steps

In this document, you learned how to use automation rules to manage your Microsoft Sentinel incidents queue and implement some basic incident-handling automation.

- To learn more about advanced automation options, see [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md).
- For help in implementing automation rules and playbooks, see [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md).
