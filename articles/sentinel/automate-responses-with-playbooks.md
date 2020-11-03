---
title: Security Playbooks in Azure Sentinel | Microsoft Docs
description: This article explains what is a security playbooks in Azure Sentinel and the related concepts.
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
ms.date: 11/02/2020
ms.author: yelevin

---

# Security playbooks in Azure Sentinel

This article explains what Azure Sentinel Security Playbooks are, and how to use them to implement your Security Orchestration, Automation and Response (SOAR) operations, achieving better results while saving time and resources.

## What is a security playbook?

SIEM/SOC teams are typically inundated with security alerts and incidents on a regular basis, at volumes so large that available personnel are overwhelmed. This results all too often in situations where many alerts aren't investigated, leaving the organization vulnerable to attacks that go unnoticed.

Many, if not most, of these alerts and incidents conform to recurring patterns that can be addressed by specific and defined sets of remediation actions.

A security playbook (or just a "playbook" for short) is a collection of these remediation actions that can be run from Azure Sentinel as a routine. A playbook can help automate and orchestrate your threat response, and can be run manually or set to run automatically when triggered by an analytics rule. 

Playbooks in Azure Sentinel are based on [Azure Logic Apps](../logic-apps/logic-apps-overview.md), which means that you get all the power and customizability of Logic Apps' built-in templates. Playbooks are created and run at the subscription level, but the Playbooks gallery displays all the playbooks available across any selected subscriptions.

Azure Sentinel already enables you to define your remediation in playbooks. It is also possible to set real-time automation as part of your playbook definition to enable you to fully automate a defined response to particular security alerts. Using real-time automation, response teams can significantly reduce their workload by fully automating the routine responses to recurring types of alerts, allowing you to concentrate more on unique alerts, analyzing patterns, threat hunting, and more. <!-- This needs more explanation. Is this talking about automation rules, or something else? -->

## Prerequisites

### Permissions required

Playbooks are built on Azure Logic Apps, and are a separate Azure resource. You can assign Azure roles to specific members of your security operations team, to give them the ability to use Logic Apps for Security Orchestration, Automation, and Response (SOAR) operations.

#### Azure Logic Apps roles

- **Logic App Contributor** lets you manage logic apps, but you can't change access to them.
- **Logic App Operator**  lets you read, enable, and disable logic apps, but you can't edit or update them.

#### Azure Sentinel roles

- **Azure Sentinel Contributor** role lets you attach a playbook to an analytic rule.
- **Azure Sentinel Responder** role lets you run a playbook manually.

### Learn more

- [Learn more about permissions in Azure Logic Apps](../logic-apps/logic-apps-securing-a-logic-app.md#access-to-logic-app-operations).
- [Learn more about permissions in Azure Sentinel](roles.md).

### Steps for creating a security playbook

- [Define the automation scenario](#When-to-use-playbooks?)

- Build the Azure Logic App

- [Test your Logic App](link)

- Attach the playbook to an automation rule or an analytics rule, or run manually when required

### Azure Logic Apps basic concepts

- **Managed Connector:** A set of actions and triggers, which wrap API calls to a certain product. Azure Logic Apps offers hundreds of connectors to connect to both Microsoft and non-Microsoft services.
  - [List of all Logic Apps connectors and their documentation](https://docs.microsoft.com/connectors/connector-reference/)

- **Custom connector:** You may want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector with its own triggers and actions.
  - [Create your own custom Logic Apps connectors](https://docs.microsoft.com/connectors/custom-connectors/create-logic-apps-connector)

- **Azure Sentinel Connector:** To create security playbooks that interact with Azure Sentinel, use the Azure Sentinel connector.
  - [Azure Sentinel connector documentation](https://docs.microsoft.com/connectors/azuresentinel/)

- **Trigger:** A connector component that starts a playbook. It defines the schema that the playbook expects to receive when triggered. The Azure Sentinel connector currently has two triggers:
  - [Incident trigger](link)
  - [Alert trigger](link)

- **Actions:** Actions are all the steps that happen after the trigger. They can be arranged sequentially, in parallel, or in a matrix of complex conditions.

- **Dynamic fields:** The output schema of trigger/action is parsed to dynamic fields that can be used in the actions that follow.

### When to use playbooks?

The Azure Logic Apps platform offers hundreds of actions and triggers, so almost any automation scenario can be created. Azure Sentinel recommends starting with the following SOC scenarios:

#### Enrichment

Collect data and attach it to the incident in order to make smarter decisions.

For example:

An Azure Sentinel incident was created from an alert by an analytics rule that generates IP entities.
The analytic rule triggers a playbook with the following steps:

- Starts with [Azure Sentinel incident trigger](link). <!--Why the incident trigger? The playbook is triggered by an alert, not an incident! What am I missing?--> The entities list of the incident arrives as part of the trigger dynamic fields.

- For each ip address, use an external Threat Intelligence provider, such as [Virus Total](https://www.virustotal.com/), to retrieve more data.

- Add the interesting insights as comments of the incident.

#### Bi-directional sync

Playbooks can be used to sync your Azure Sentinel incidents with other ticketing systems.

For example:

Create an automation rule for all incident creation, and attach a playbook that opens a ticket in ServiceNow:

- When a new Azure Sentinel incident is created

- Create a new ticket in ServiceNow

- Include in the ticket the incident name, important fields and a URL to the Sentinel incident for easy pivoting.

#### Orchestration

Better control the incidents queue leveraging the SOC chat platform.

For example:

- When a new Azure Sentinel incident is created.

- Send a message to your security operations channel in [Microsoft Teams](link) or [Slack](link) to make sure your security analysts are aware of the incident.

- Send all the information in the alert to your senior network admin and security admin. The email message also includes two user option buttons Block or Ignore.

- The playbook continues to run after a response is received from the admins.

- If the admins choose Block, the IP address is blocked in the firewall and the user is disabled in Azure AD.

#### Response

Immediately respond to threats with minimal human dependencies.

For example:

Respond to an analytics rule that indicates a compromised user with [Azure AD Identity Protection](link) capabilities:

- When a new Azure Sentinel incident is created

- For each user suspected as compromised in the incident entities:

  - Send a Teams message to the user, confirming if they did the suspicious action.

  - [Confirm user as compromised](link)

  - [Require MFA for next log in](link)

Respond to an analytics rule that indicates a compromised machine with [Microsoft Defender for Endpoint](link) capabilities:

- When a new Azure Sentinel incident is created

- Entities - Get Hosts to parse the suspicious machines that are included in the incident entities.

- For each machine

  - Isolate the machine

## How to run a Security Playbook

Security playbooks can be run either **manually** or **automatically**.

Running them manually means that when you get an alert, you can choose to run a playbook on-demand as a response to the selected alert. Currently this feature is not supported for incidents.

Running them automatically means to set them as an action of an automation rule.

### Setting automated response

Using real-time automation, response teams can significantly reduce their workload by fully automating the routine responses to recurring types of alerts, allowing you to concentrate more on unique alerts, analyzing patterns, threat hunting, and more.

Setting automated response means that every time an analytics rule is triggered, in addition to creating an alert and possibly an incident, the rule will run a playbook, which will receive as an input the alert or incident created by the rule.

To attach a playbook to an analytics rule:

1. Go to **Analytics**.

1. Select the Analytics Rule you want to define an automated response for.

1. Click **Edit**.

1. Select the **Automated Response** tab.

1. Select the playbooks that this analytics rule will trigger when an alert or an incident is created.

    Note: The input for the playbook will fit the [playbook trigger kind](connectordocumentation):
    - When an Azure Sentinel incident is triggered
    - When an Azure Sentinel alert is triggered 

Special configurations:

- For **Microsoft incident creation** rules, you can attach only playbooks that start with **When an Azure Sentinel incident is triggered**.

- For **scheduled query** rules, behavior depends on the rule setting:

  - Triggering a playbook on incident creation is relevant only if incident creation was enabled in **Incident Settings**.

  - If **Event Grouping** was enabled on this analytics rule (such that any event creates an alert):
    Any attached playbook that start with **When an Azure Sentinel alert is triggered** will be triggered for each alert that this rule creates.

  - If incident creation is enabled, any attached playbook that start with **When an Azure Sentinel Incident is triggered** will be triggered for each incident that this rule creates.

    In order to run a playbook on the incident that gathers all the alerts from this analytics rule, use **Alert Grouping** in **Incident settings** tab.  <!--The playbook will run immediately upon the creation of the incident, which will include only the single alert that generated the incident, and not any of the subsequent alerts that were grouped into this incident. -->

    <!-- How each configuration option in analytics rule creation affects running of playbooks-->

### Run a playbook manually on an alert

Manual trigger is available from Sentinel portal in the following blades:

- In Incidents view, choose a specific incident, and open the alerts tab.

- In Investigation, choose a specific alert.

1. Click on **View Playbooks**. You will get a list of all playbooks that start with an **When an Azure Sentinel Alert is triggered** and that you have access to.

1. Click on **Run Playbook** to trigger the related playbook.

1. View run log: A list of all the runs of this playbook on this alert will be available in **Runs** tab. It might take a few seconds for the last run to appear in this list.

1. Clicking on a specific run will open the full run log in Logic Apps.

### Run a playbook manually on an incident

Not supported yet. <!--make this a note instead? -->

## Manage your playbooks

In the Playbooks blade, there appears a list of all the playbooks which you have access to, filtered by the subscriptions which are currently displayed in Azure. The subscriptions filter is available from the **Directory + subscription** menu in the global page header.

Each item in the list indicates a playbook. Clicking on a playbook name directs you to the playbook's main page in Logic Apps. The **Status** column indicates if it is enabled or disabled. The **Runs** column enumerates the number of times this playbook has run.

**Trigger kind** represents the Logic Apps trigger that starts this playbook.

| Trigger kind | Indicates component types in playbook |
|-|-|
| **Azure Sentinel Incident/Alert** | The playbook is started with one of the Sentinel triggers (alert, incident) |
| **Using Azure Sentinel Action** | The playbook is started with a non-Sentinel trigger but uses an Azure Sentinel action |
| **Other** | The playbook does not include any Sentinel components |
| **Not initialized** | The playbook has been created, but contains no components (triggers or actions). |
|

### API connections

API connections are used to connect Logic Apps to other services. Every time a new authentication to a Logic Apps connector is made, a new resource of type **API connection** is created, and contains the information provided when configuring access to the service.

To see all the API connections, enter *API connections* in the header search box of the Azure Portal. Note the interesting columns:

- Display name - every time a new connection is created, you are offered to choose the display name of the connection. 
- Status - indicates the connection status: Error, connected.
- Resource group - API connections are created in the resource group of the playbook (Logic Apps) resource.

Another way to view API connections would be to go to the Resources blade and filter it by type *API connection*. This way allows the selection and deletion of multiple connections.

In order to change the authorization of an existing connection, enter the connection resource, and select **Edit API connection**.

## Next steps

- [Tutorial: Create a security playbook](link)
