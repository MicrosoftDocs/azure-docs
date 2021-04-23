---
title: Automate threat response with playbooks in Azure Sentinel | Microsoft Docs
description: This article explains automation in Azure Sentinel, and shows how to use playbooks to automate threat prevention and response.
services: sentinel
cloud: na
documentationcenter: na
author: yelevin
manager: rkarlin

ms.assetid:
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/17/2021
ms.author: yelevin

---

# Automate threat response with playbooks in Azure Sentinel

This article explains what Azure Sentinel playbooks are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations, achieving better results while saving time and resources.

## What is a playbook?

SIEM/SOC teams are typically inundated with security alerts and incidents on a regular basis, at volumes so large that available personnel are overwhelmed. This results all too often in situations where many alerts are ignored and many incidents aren't investigated, leaving the organization vulnerable to attacks that go unnoticed.

Many, if not most, of these alerts and incidents conform to recurring patterns that can be addressed by specific and defined sets of remediation actions.

A playbook is a collection of these remediation actions that can be run from Azure Sentinel as a routine. A playbook can help automate and orchestrate your threat response; it can be run manually or set to run automatically in response to specific alerts or incidents, when triggered by an analytics rule or an automation rule, respectively.

Playbooks are created and applied at the subscription level, but the **Playbooks** tab (in the new **Automation** blade) displays all the playbooks available across any selected subscriptions.

### Azure Logic Apps basic concepts

Playbooks in Azure Sentinel are based on workflows built in [Azure Logic Apps](../logic-apps/logic-apps-overview.md), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise. This means that playbooks can take advantage of all the power and customizability of Logic Apps' built-in templates.

> [!NOTE]
> Because Azure Logic Apps are a separate resource, additional charges may apply. Visit the [Azure Logic Apps](https://azure.microsoft.com/pricing/details/logic-apps/) pricing page for more details.

Azure Logic Apps communicates with other systems and services using connectors. The following is a brief explanation of connectors and some of their important attributes:

- **Managed Connector:** A set of actions and triggers that wrap around API calls to a particular product or service. Azure Logic Apps offers hundreds of connectors to communicate with both Microsoft and non-Microsoft services.
  - [List of all Logic Apps connectors and their documentation](/connectors/connector-reference/)

- **Custom connector:** You may want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector and define its own triggers and actions.
  - [Create your own custom Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector)

- **Azure Sentinel Connector:** To create playbooks that interact with Azure Sentinel, use the Azure Sentinel connector.
  - [Azure Sentinel connector documentation](/connectors/azuresentinel/)

- **Trigger:** A connector component that starts a playbook. It defines the schema that the playbook expects to receive when triggered. The Azure Sentinel connector currently has two triggers:
  - [Alert trigger](/connectors/azuresentinel/#triggers): the playbook receives the alert as its input.
  - [Incident trigger](/connectors/azuresentinel/#triggers): the playbook receives the incident as its input, along with all its included alerts and entities.

    > [!IMPORTANT]
    >
    > - The **incident trigger** feature for playbooks is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

- **Actions:** Actions are all the steps that happen after the trigger. They can be arranged sequentially, in parallel, or in a matrix of complex conditions.

- **Dynamic fields:** Temporary fields, determined by the output schema of triggers and actions and populated by their actual output, that can be used in the actions that follow.

### Permissions required

 To give your SecOps team the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations - that is, to create and run playbooks - in Azure Sentinel, you can assign Azure roles, either to specific members of your security operations team or to the whole team. The following describes the different available roles, and the tasks for which they should be assigned:

#### Azure roles for Logic Apps

- **Logic App Contributor** lets you manage logic apps and run playbooks, but you can't change access to them (for that you need the **Owner** role).
- **Logic App Operator**  lets you read, enable, and disable logic apps, but you can't edit or update them.

#### Azure roles for Sentinel

- **Azure Sentinel Contributor** role lets you attach a playbook to an analytics rule.
- **Azure Sentinel Responder** role lets you run a playbook manually.
- **Azure Sentinel Automation Contributor** allows automation rules to run playbooks. It is not used for any other purpose.

#### Learn more

- [Learn more about Azure roles in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md#access-to-logic-app-operations).
- [Learn more about Azure roles in Azure Sentinel](roles.md).

## Steps for creating a playbook

- [Define the automation scenario](#use-cases-for-playbooks).

- [Build the Azure Logic App](tutorial-respond-threats-playbook.md).

- [Test your Logic App](#run-a-playbook-manually-on-an-alert).

- Attach the playbook to an [automation rule](#incident-creation-automated-response) or an [analytics rule](#alert-creation-automated-response), or [run manually when required](#run-a-playbook-manually-on-an-alert).

### Use cases for playbooks

The Azure Logic Apps platform offers hundreds of actions and triggers, so almost any automation scenario can be created. Azure Sentinel recommends starting with the following SOC scenarios:

#### Enrichment

**Collect data and attach it to the incident in order to make smarter decisions.**

For example:

An Azure Sentinel incident was created from an alert by an analytics rule that generates IP address entities.

The incident triggers an automation rule which runs a playbook with the following steps:

- Start when a [new Azure Sentinel incident is created](/connectors/azuresentinel/#triggers). The entities represented in the incident are stored in the incident trigger's dynamic fields.

- For each IP address, query an external Threat Intelligence provider, such as [Virus Total](https://www.virustotal.com/), to retrieve more data.

- Add the returned data and insights as comments of the incident.

#### Bi-directional sync

**Playbooks can be used to sync your Azure Sentinel incidents with other ticketing systems.**

For example:

Create an automation rule for all incident creation, and attach a playbook that opens a ticket in ServiceNow:

- Start when a [new Azure Sentinel incident is created](/connectors/azuresentinel/#triggers).

- Create a new ticket in [ServiceNow](/connectors/service-now/).

- Include in the ticket the incident name, important fields, and a URL to the Azure Sentinel incident for easy pivoting.

#### Orchestration

**Use the SOC chat platform to better control the incidents queue.**

For example:

An Azure Sentinel incident was created from an alert by an analytics rule that generates username and IP address entities.

The incident triggers an automation rule which runs a playbook with the following steps:

- Start when a [new Azure Sentinel incident is created](/connectors/azuresentinel/#triggers).

- Send a message to your security operations channel in [Microsoft Teams](/connectors/teams/) or [Slack](/connectors/slack/) to make sure your security analysts are aware of the incident.

- Send all the information in the alert by email to your senior network admin and security admin. The email message will include **Block** and **Ignore** user option buttons.

- Wait until a response is received from the admins, then continue to run.

- If the admins have chosen **Block**, send a command to the firewall to block the IP address in the alert, and another to Azure AD to disable the user.

#### Response

**Immediately respond to threats, with minimal human dependencies.**

Two examples:

**Example 1:** Respond to an analytics rule that indicates a compromised user, as discovered by [Azure AD Identity Protection](../active-directory/identity-protection/overview-identity-protection.md):

   - Start when a [new Azure Sentinel incident is created](/connectors/azuresentinel/#triggers).

   - For each user entity in the incident suspected as compromised:

     - Send a Teams message to the user, requesting confirmation that the user took the suspicious action.

     - Check with Azure AD Identity Protection to [confirm the user's status as compromised](/connectors/azureadip/#confirm-a-risky-user-as-compromised). Azure AD Identity Protection will label the user as **risky**, and apply any enforcement policy already configured - for example, to require the user to use MFA when next signing in.

        > [!NOTE]
        > The playbook does not initiate any enforcement action on the user, nor does it initiate any configuration of enforcement policy. It only tells Azure AD Identity Protection to apply any already defined policies as appropriate. Any enforcement depends entirely on the appropriate policies being defined in Azure AD Identity Protection.

**Example 2:** Respond to an analytics rule that indicates a compromised machine, as discovered by [Microsoft Defender for Endpoint](/windows/security/threat-protection/):

   - Start when a [new Azure Sentinel incident is created](/connectors/azuresentinel/#triggers).

   - Use the **Entities - Get Hosts** action in Azure Sentinel to parse the suspicious machines that are included in the incident entities.

   - Issue a command to Microsoft Defender for Endpoint to [isolate the machines](/connectors/wdatp/#actions---isolate-machine) in the alert.

## How to run a playbook

Playbooks can be run either **manually** or **automatically**.

Running them manually means that when you get an alert, you can choose to run a playbook on-demand as a response to the selected alert. Currently this feature is supported only for alerts, not for incidents.

Running them automatically means to set them as an automated response in an analytics rule (for alerts), or as an action in an automation rule (for incidents). [Learn more about automation rules](automate-incident-handling-with-automation-rules.md).

### Set an automated response

Security operations teams can significantly reduce their workload by fully automating the routine responses to recurring types of incidents and alerts, allowing you to concentrate more on unique incidents and alerts, analyzing patterns, threat hunting, and more.

Setting automated response means that every time an analytics rule is triggered, in addition to creating an alert, the rule will run a playbook, which will receive as an input the alert created by the rule.

If the alert creates an incident, the incident will trigger an automation rule which may in turn run a playbook, which will receive as an input the incident created by the alert.

#### Alert creation automated response

For playbooks that are triggered by alert creation and receive alerts as their inputs (their first step is “When an Azure Sentinel Alert is triggered”), attach the playbook to an analytics rule:

1. Edit the [analytics rule](tutorial-detect-threats-custom.md) that generates the alert you want to define an automated response for.

1. Under **Alert automation** in the **Automated response** tab, select the playbook or playbooks that this analytics rule will trigger when an alert is created.

#### Incident creation automated response

For playbooks that are triggered by incident creation and receive incidents as their inputs (their first step is “When an Azure Sentinel Incident is triggered”), create an automation rule and define a **Run playbook** action in it. This can be done in 2 ways:

- Edit the analytics rule that generates the incident you want to define an automated response for. Under **Incident automation** in the **Automated response** tab, create an automation rule. This will create a automated response only for this analytics rule.

- From the **Automation rules** tab in the **Automation** blade, create a new automation rule and specify the appropriate conditions and desired actions. This automation rule will be applied to any analytics rule that fulfills the specified conditions.

    > [!NOTE]
    > To run a playbook from an automation rule, Azure Sentinel uses a service account specifically authorized to do so. The use of this account (as opposed to your user account) increases the security level of the service and enables the automation rules API to support CI/CD use cases.
    >
    > This account must be granted explicit permissions to the resource group where the playbook resides. At that point, any automation rule will be able to run any playbook in that resource group.
    >
    > When you add the **run playbook** action to an automation rule, a drop-down list of playbooks will appear. Playbooks to which Azure Sentinel does not have permissions will show as unavailable ("grayed out"). You can grant permission to Azure Sentinel on the spot by selecting the **Manage playbook permissions** link.
    >
    > In a multi-tenant ([Lighthouse](extend-sentinel-across-workspaces-tenants.md#managing-workspaces-across-tenants-using-azure-lighthouse)) scenario, you must define the permissions on the tenant where the playbook lives, even if the automation rule calling the playbook is in a different tenant. To do that, you must have **Owner** permissions on the playbook's resource group.

See the [complete instructions for creating automation rules](tutorial-respond-threats-playbook.md#respond-to-incidents).

### Run a playbook manually on an alert

Manual triggering is available from the Azure Sentinel portal in the following blades:

- In **Incidents** view, choose a specific incident, open its **Alerts** tab, and choose an alert.

- In **Investigation**, choose a specific alert.

1. Click on **View playbooks** for the chosen alert. You will get a list of all playbooks that start with an **When an Azure Sentinel Alert is triggered** and that you have access to.

1. Click on **Run** on the line of a specific playbook to trigger it.

1. Select the **Runs** tab to view a list of all the times any playbook has been run on this alert. It might take a few seconds for any just-completed run to appear in this list.

1. Clicking on a specific run will open the full run log in Logic Apps.

### Run a playbook manually on an incident

Not supported yet. <!--make this a note instead? -->

## Manage your playbooks

In the **Playbooks** tab, there appears a list of all the playbooks which you have access to, filtered by the subscriptions which are currently displayed in Azure. The subscriptions filter is available from the **Directory + subscription** menu in the global page header.

Clicking on a playbook name directs you to the playbook's main page in Logic Apps. The **Status** column indicates if it is enabled or disabled.

**Trigger kind** represents the Logic Apps trigger that starts this playbook.

| Trigger kind | Indicates component types in playbook |
|-|-|
| **Azure Sentinel Incident/Alert** | The playbook is started with one of the Sentinel triggers (alert, incident) |
| **Using Azure Sentinel Action** | The playbook is started with a non-Sentinel trigger but uses an Azure Sentinel action |
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

## Next steps

- [Tutorial: Use playbooks to automate threat responses in Azure Sentinel](tutorial-respond-threats-playbook.md)
