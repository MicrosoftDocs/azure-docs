---
title: Automate threat response with playbooks in Microsoft Sentinel | Microsoft Docs
description: This article explains automation in Microsoft Sentinel, and shows how to use playbooks to automate threat prevention and response.
author: yelevin
ms.topic: conceptual
ms.date: 04/10/2022
ms.author: yelevin
ms.custom: ignite-fall-2021
---

# Automate threat response with playbooks in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

This article explains what Microsoft Sentinel playbooks are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations, achieving better results while saving time and resources.

## What is a playbook?

SIEM/SOC teams are typically inundated with security alerts and incidents on a regular basis, at volumes so large that available personnel are overwhelmed. This results all too often in situations where many alerts are ignored and many incidents aren't investigated, leaving the organization vulnerable to attacks that go unnoticed.

Many, if not most, of these alerts and incidents conform to recurring patterns that can be addressed by specific and defined sets of remediation actions.

A playbook is a collection of these remediation actions that can be run from Microsoft Sentinel as a routine. A playbook can help [**automate and orchestrate your threat response**](tutorial-respond-threats-playbook.md); it can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an [automation rule](automate-incident-handling-with-automation-rules.md), respectively.

For example, if an account and machine are compromised, a playbook can isolate the machine from the network and block the account by the time the SOC team is notified of the incident.

Playbooks can be used within the subscription to which they belong, but the **Playbooks** tab (in the **Automation** blade) displays all the playbooks available across any selected subscriptions.

### Playbook templates

> [!IMPORTANT]
>
> **Playbook templates** are currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

A playbook template is a pre-built, tested, and ready-to-use workflow that can be customized to meet your needs. Templates can also serve as a reference for best practices when developing playbooks from scratch, or as inspiration for new automation scenarios.

Playbook templates are not active playbooks themselves, until you create a playbook (an editable copy of the template) from them.

You can get playbook templates from the following sources:

- The **Playbook templates** tab (under **Automation**) presents the leading scenarios contributed by the Microsoft Sentinel community. Multiple active playbooks can be created from the same template.

    When a new version of the template is published, the active playbooks created from that template (in the **Playbooks** tab) will be labeled with a notification that an update is available.

- Playbook templates can also be obtained as part of a [Microsoft Sentinel solution](sentinel-solutions.md) in the context of a specific product. The deployment of the solution produces active playbooks.

- The [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks) contains many playbook templates. They can be deployed to an Azure subscription by selecting the **Deploy to Azure** button.

Technically, a playbook template is an [ARM template](../azure-resource-manager/templates/index.yml) which consists of several resources: an Azure Logic Apps workflow and API connections for each connection involved.

### Azure Logic Apps basic concepts

Playbooks in Microsoft Sentinel are based on workflows built in [Azure Logic Apps](../logic-apps/logic-apps-overview.md), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise. This means that playbooks can take advantage of all the power and customizability of Logic Apps' built-in templates.

> [!NOTE]
> Because Azure Logic Apps are a separate resource, additional charges may apply. Visit the [Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/) pricing page for more details.

Azure Logic Apps communicates with other systems and services using connectors. The following is a brief explanation of connectors and some of their important attributes:

- **Managed Connector:** A set of actions and triggers that wrap around API calls to a particular product or service. Azure Logic Apps offers hundreds of connectors to communicate with both Microsoft and non-Microsoft services.
  - [List of all Logic Apps connectors and their documentation](/connectors/connector-reference/)

- **Custom connector:** You may want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector and define its own triggers and actions.
  - [Create your own custom Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector)

- **Microsoft Sentinel Connector:** To create playbooks that interact with Microsoft Sentinel, use the Microsoft Sentinel connector.
  - [Microsoft Sentinel connector documentation](/connectors/azuresentinel/)

- **Trigger:** A connector component that starts a playbook. It defines the schema that the playbook expects to receive when triggered. The Microsoft Sentinel connector currently has two triggers:
  - [Alert trigger](/connectors/azuresentinel/#triggers): the playbook receives the alert as its input.
  - [Incident trigger](/connectors/azuresentinel/#triggers): the playbook receives the incident as its input, along with all its included alerts and entities.

- **Actions:** Actions are all the steps that happen after the trigger. They can be arranged sequentially, in parallel, or in a matrix of complex conditions.

- **Dynamic fields:** Temporary fields, determined by the output schema of triggers and actions and populated by their actual output, that can be used in the actions that follow.

#### Two types of Logic Apps

Microsoft Sentinel now supports two Logic Apps resource types:

- **Logic App (Consumption)**, based on the classic, original Logic Apps engine, and
- **Logic App (Standard)**, based on the new Logic Apps engine.

**Logic Apps Standard** features a single-tenant, containerized environment that provides higher performance, fixed pricing, single apps containing multiple workflows, easier API connections management, native network capabilities such as virtual networking (VNet) and private endpoints support, built-in CI/CD features, better Visual Studio integration, a new version of the Logic Apps Designer, and more.

You can leverage this powerful new version of Logic Apps by creating new Standard playbooks in Microsoft Sentinel, and you can use them the same ways you use the classic Logic App Consumption playbooks:
- Attach them to automation rules and/or analytics rules.
- Run them on demand, from both incidents and alerts.
- Manage them in the Active Playbooks tab.

There are many differences between these two resource types, some of which affect some of the ways they can be used in playbooks in Microsoft Sentinel. In such cases, the documentation will point out what you need to know.

See [Resource type and host environment differences](../logic-apps/logic-apps-overview.md#resource-type-and-host-environment-differences) in the Logic Apps documentation for a detailed summary of the two resource types.

> [!NOTE]
> - You'll notice an indicator in Standard workflows that presents as either *stateful* or *stateless*. Microsoft Sentinel does not support stateless workflows at this time. Learn about the differences between [**stateful and stateless workflows**](../logic-apps/single-tenant-overview-compare.md#stateful-and-stateless-workflows).
> - Logic Apps Standard does not currently support Playbook templates. This means that you can't create a Standard workflow from within Microsoft Sentinel. Rather, you must create it in Logic Apps, and once it's created, you'll see it in Microsoft Sentinel.

### Permissions required

 To give your SecOps team the ability to use Logic Apps to create and run playbooks in Microsoft Sentinel, assign Azure roles to your security operations team or to specific users on the team. The following describes the different available roles, and the tasks for which they should be assigned:

#### Azure roles for Logic Apps

- **Logic App Contributor** lets you manage logic apps and run playbooks, but you can't change access to them (for that you need the **Owner** role).
- **Logic App Operator**  lets you read, enable, and disable logic apps, but you can't edit or update them.

#### Azure roles for Sentinel

- **Microsoft Sentinel Contributor** role lets you attach a playbook to an analytics rule.
- **Microsoft Sentinel Responder** role lets you run a playbook manually.
- **Microsoft Sentinel Automation Contributor** allows automation rules to run playbooks. It is not used for any other purpose.

#### Learn more

- [Learn more about Azure roles in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md#access-to-logic-app-operations).
- [Learn more about Azure roles in Microsoft Sentinel](roles.md).

## Steps for creating a playbook

- [Define the automation scenario](#use-cases-for-playbooks).

- [Build the Azure Logic App](tutorial-respond-threats-playbook.md).

- [Test your Logic App](#run-a-playbook-manually).

- Attach the playbook to an [automation rule](#incident-creation-automated-response) or an [analytics rule](#alert-creation-automated-response), or [run manually when required](#run-a-playbook-manually).

### Use cases for playbooks

The Azure Logic Apps platform offers hundreds of actions and triggers, so almost any automation scenario can be created. Microsoft Sentinel recommends starting with the following SOC scenarios:

#### Enrichment

**Collect data and attach it to the incident in order to make smarter decisions.**

For example:

A Microsoft Sentinel incident was created from an alert by an analytics rule that generates IP address entities.

The incident triggers an automation rule which runs a playbook with the following steps:

- Start when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers). The entities represented in the incident are stored in the incident trigger's dynamic fields.

- For each IP address, query an external Threat Intelligence provider, such as [Virus Total](https://www.virustotal.com/), to retrieve more data.

- Add the returned data and insights as comments of the incident.

#### Bi-directional sync

**Playbooks can be used to sync your Microsoft Sentinel incidents with other ticketing systems.**

For example:

Create an automation rule for all incident creation, and attach a playbook that opens a ticket in ServiceNow:

- Start when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers).

- Create a new ticket in [ServiceNow](/connectors/service-now/).

- Include in the ticket the incident name, important fields, and a URL to the Microsoft Sentinel incident for easy pivoting.

#### Orchestration

**Use the SOC chat platform to better control the incidents queue.**

For example:

A Microsoft Sentinel incident was created from an alert by an analytics rule that generates username and IP address entities.

The incident triggers an automation rule which runs a playbook with the following steps:

- Start when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers).

- Send a message to your security operations channel in [Microsoft Teams](/connectors/teams/) or [Slack](/connectors/slack/) to make sure your security analysts are aware of the incident.

- Send all the information in the alert by email to your senior network admin and security admin. The email message will include **Block** and **Ignore** user option buttons.

- Wait until a response is received from the admins, then continue to run.

- If the admins have chosen **Block**, send a command to the firewall to block the IP address in the alert, and another to Azure AD to disable the user.

#### Response

**Immediately respond to threats, with minimal human dependencies.**

Two examples:

**Example 1:** Respond to an analytics rule that indicates a compromised user, as discovered by [Azure AD Identity Protection](../active-directory/identity-protection/overview-identity-protection.md):

   - Start when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers).

   - For each user entity in the incident suspected as compromised:

     - Send a Teams message to the user, requesting confirmation that the user took the suspicious action.

     - Check with Azure AD Identity Protection to [confirm the user's status as compromised](/connectors/azureadip/#confirm-a-risky-user-as-compromised). Azure AD Identity Protection will label the user as **risky**, and apply any enforcement policy already configured - for example, to require the user to use MFA when next signing in.

        > [!NOTE]
        > The playbook does not initiate any enforcement action on the user, nor does it initiate any configuration of enforcement policy. It only tells Azure AD Identity Protection to apply any already defined policies as appropriate. Any enforcement depends entirely on the appropriate policies being defined in Azure AD Identity Protection.

**Example 2:** Respond to an analytics rule that indicates a compromised machine, as discovered by [Microsoft Defender for Endpoint](/windows/security/threat-protection/):

   - Start when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers).

   - Use the **Entities - Get Hosts** action in Microsoft Sentinel to parse the suspicious machines that are included in the incident entities.

   - Issue a command to Microsoft Defender for Endpoint to [isolate the machines](/connectors/wdatp/#actions---isolate-machine) in the alert.

## How to run a playbook

Playbooks can be run either **manually** or **automatically**.

They are designed to be run automatically, and ideally that is how they should be run in the normal course of operations. You [run a playbook automatically](tutorial-respond-threats-playbook.md#automate-threat-responses) by defining it as an [automated response in an analytics rule](detect-threats-custom.md#set-automated-responses-and-create-the-rule) (for alerts), or as an [action in an automation rule](automate-incident-handling-with-automation-rules.md) (for incidents).

There are circumstances, though, that call for running playbooks manually. For example, when creating a new playbook, you'll want to test it before putting it in production. Or, there may be situations where you'll want to have more control and human input into when and whether a certain playbook runs. You [run a playbook manually](tutorial-respond-threats-playbook.md#run-a-playbook-on-demand) by opening an incident or alert and selecting and running the associated playbook displayed there. Currently this feature is generally available for alerts, and in preview for incidents.


### Set an automated response

Security operations teams can significantly reduce their workload by fully automating the routine responses to recurring types of incidents and alerts, allowing you to concentrate more on unique incidents and alerts, analyzing patterns, threat hunting, and more.

Setting automated response means that every time an analytics rule is triggered, in addition to creating an alert, the rule will run a playbook, which will receive as an input the alert created by the rule.

If the alert creates an incident, the incident will trigger an automation rule which may in turn run a playbook, which will receive as an input the incident created by the alert.

#### Alert creation automated response

For playbooks that are triggered by alert creation and receive alerts as their inputs (their first step is “Microsoft Sentinel alert"), attach the playbook to an analytics rule:

1. Edit the [analytics rule](detect-threats-custom.md) that generates the alert you want to define an automated response for.

1. Under **Alert automation** in the **Automated response** tab, select the playbook or playbooks that this analytics rule will trigger when an alert is created.

#### Incident creation automated response

For playbooks that are triggered by incident creation and receive incidents as their inputs (their first step is “Microsoft Sentinel incident"), create an automation rule and define a **Run playbook** action in it. This can be done in 2 ways:

- Edit the analytics rule that generates the incident you want to define an automated response for. Under **Incident automation** in the **Automated response** tab, create an automation rule. This will create an automated response only for this analytics rule.

- From the **Automation rules** tab in the **Automation** blade, create a new automation rule and specify the appropriate conditions and desired actions. This automation rule will be applied to any analytics rule that fulfills the specified conditions.

    > [!NOTE]
    > **Microsoft Sentinel requires permissions to run incident-trigger playbooks.**
    >
    > To run a playbook based on the incident trigger, whether manually or from an automation rule, Microsoft Sentinel uses a service account specifically authorized to do so. The use of this account (as opposed to your user account) increases the security level of the service and enables the automation rules API to support CI/CD use cases.
    >
    > This account must be granted explicit permissions (taking the form of the **Microsoft Sentinel Automation Contributor** role) on the resource group where the playbook resides. At that point, you will be able to run any playbook in that resource group, either manually or from any automation rule.
    >
    > When you add the **run playbook** action to an automation rule, a drop-down list of playbooks will appear for your selection. Playbooks to which Microsoft Sentinel does not have permissions will show as unavailable ("grayed out"). You can grant permission to Microsoft Sentinel on the spot by selecting the **Manage playbook permissions** link.
    >
    > In a multi-tenant ([Lighthouse](extend-sentinel-across-workspaces-tenants.md#manage-workspaces-across-tenants-using-azure-lighthouse)) scenario, you must define the permissions on the tenant where the playbook lives, even if the automation rule calling the playbook is in a different tenant. To do that, you must have **Owner** permissions on the playbook's resource group.
    >
    > There's a unique scenario facing a **Managed Security Service Provider (MSSP)**, where a service provider, while signed into its own tenant, creates an automation rule on a customer's workspace using [Azure Lighthouse](../lighthouse/index.yml). This automation rule then calls a playbook belonging to the customer's tenant. In this case, Microsoft Sentinel must be granted permissions on ***both tenants***. In the customer tenant, you grant them in the **Manage playbook permissions** panel, just like in the regular multi-tenant scenario. To grant the relevant permissions in the service provider tenant, you need to add an additional Azure Lighthouse delegation that grants access rights to the **Azure Security Insights** app, with the **Microsoft Sentinel Automation Contributor** role, on the resource group where the playbook resides. [Learn how to add this delegation](tutorial-respond-threats-playbook.md#permissions-to-run-playbooks).

See the [complete instructions for creating automation rules](tutorial-respond-threats-playbook.md#respond-to-incidents).

### Run a playbook manually

While full automation is the best solution for many incident-handling, investigation, and mitigation tasks, there may often be cases where you would prefer your analysts have more human input and control over the situation. Also, you may want your SOC engineers to be able to test the playbooks they write before fully deploying them in automation rules.

For these and other reasons, Microsoft Sentinel allows you to **run playbooks manually** on-demand for both incidents (now in Preview) and alerts. 

- **To run a playbook on a specific incident,** select the incident from the grid in the **Incidents** blade. Select **Actions** from the incident details pane, and choose **Run playbook (Preview)** from the context menu. This opens the **Run playbook on incident** panel.

- **To run a playbook on an alert,** select an incident, enter the incident details, and from the **Alerts** tab, choose an alert and select **View playbooks**. This opens the **Alert playbooks** panel.

In either of these panels, you'll see two tabs: **Playbooks** and **Runs**.

- In the **Playbooks** tab, you'll see a list of all the playbooks that you have access to and that use the appropriate trigger - the **Microsoft Sentinel Incident** trigger for incident playbooks and the **Microsoft Sentinel Alert** trigger for alert playbooks. Each playbook in the list has a **Run** button which you select to run the playbook immediately.  
If you want to run an incident-trigger playbook that you don't see in the list, [see the note about Microsoft Sentinel permissions above](#incident-creation-automated-response).

- In the **Runs** tab, you'll see a list of all the times any playbook has been run on the incident or alert you selected. It might take a few seconds for any just-completed run to appear in this list. Selecting a specific run will open the full run log in Logic Apps.

## Manage your playbooks

In the **Active playbooks** tab, there appears a list of all the playbooks which you have access to, filtered by the subscriptions which are currently displayed in Azure. The subscriptions filter is available from the **Directory + subscription** menu in the global page header.

Clicking on a playbook name directs you to the playbook's main page in Logic Apps. The **Status** column indicates if it is enabled or disabled.

The **Plan** column indicates whether the playbook uses the **Standard** or **Consumption** resource type in Azure Logic Apps. You can filter the list by plan type to see only one type of playbook. You'll notice that playbooks of the Standard type use the `LogicApp/Workflow` naming convention. This convention reflects the fact that a Standard playbook represents a workflow that exists *alongside other workflows* in a single Logic App.

**Trigger kind** represents the Logic Apps trigger that starts this playbook.

| Trigger kind | Indicates component types in playbook |
|-|-|
| **Microsoft Sentinel Incident/Alert** | The playbook is started with one of the Sentinel triggers (alert, incident) |
| **Using Microsoft Sentinel Action** | The playbook is started with a non-Sentinel trigger but uses a Microsoft Sentinel action |
| **Other** | The playbook does not include any Sentinel components |
| **Not initialized** | The playbook has been created, but contains no components (triggers or actions). |
|

In the playbook's Logic App page, you can see more information about the playbook, including a log of all the times it has run, and the result (success or failure, and other details). You can also enter the Logic Apps Designer and edit the playbook directly, if you have the appropriate permissions.

### API connections

API connections are used to connect Logic Apps to other services. Every time a new authentication to a Logic Apps connector is made, a new resource of type **API connection** is created, and contains the information provided when configuring access to the service.

To see all the API connections, enter *API connections* in the header search box of the Azure portal. Note the columns of interest:

- Display name - the "friendly" name you give to the connection every time you create one.
- Status - indicates the connection status: error, connected.
- Resource group - API connections are created in the resource group of the playbook (Logic Apps) resource.

Another way to view API connections would be to go to the **All Resources** blade and filter it by type *API connection*. This way allows the selection, tagging, and deletion of multiple connections at once.

In order to change the authorization of an existing connection, enter the connection resource, and select **Edit API connection**.

## Recommended playbooks

The following recommended playbooks, and other similar playbooks are available to you in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks):

- **Notification playbooks** are triggered when an alert or incident is created and send a notification to a configured destination:

    - [Post a message in a Microsoft Teams channel](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Teams/Playbooks/Post-Message-Teams)
    - [Send an Outlook email notification](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Incident-Email-Notification)
    - [Post a message in a Slack channel](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Post-Message-Slack)

- **Blocking playbooks** are triggered when an alert or incident is created, gather entity information like the account, IP address, and host, and blocks them from further actions:

    - [Prompt to block an IP address](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Block-IPs-on-MDATP-Using-GraphSecurity).
    - [Block an Azure AD user](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Block-AADUserOrAdmin)
    - [Reset an Azure AD user password](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Azure%20Active%20Directory/Playbooks/Reset-AADUserPassword)
    - [Prompt to isolate a machine](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Isolate-AzureVMtoNSG)

- **Create, update, or close playbooks** can create, update, or close incidents in Microsoft Sentinel, Microsoft 365 security services, or other ticketing systems:

    - [Change an incident's severity](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks/Change-Incident-Severity)
    - [Create a ServiceNow incident](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Servicenow/Playbooks/Create-SNOW-record)


## Next steps

- [Tutorial: Use playbooks to automate threat responses in Microsoft Sentinel](tutorial-respond-threats-playbook.md)
