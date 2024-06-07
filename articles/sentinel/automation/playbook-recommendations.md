---
title: Recommended Microsoft Sentinel playbook use cases, templates, and examples
description: Learn about sample use cases for Microsoft Sentinel playbooks, as well as example playbooks and recommended playbook templates.
author: batamig
ms.topic: reference
ms.date: 04/18/2024
ms.author: bagol
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customerIntent: As a SOC engineer, I want to understand the sorts of use cases where playbooks are recommended, as well as recommended templates, and samples.
---

# Recommended playbook use cases, templates, and examples

This article lists sample use cases for Microsoft Sentinel playbooks, as well as sample playbooks and recommended playbook templates.

## Recommended playbook use cases

We recommend starting with Microsoft Sentinel playbooks for the following SOC scenarios, for which we provide ready-made [playbook templates](../use-playbook-templates.md) out-of-the-box.

### Enrichment: Collect and attach data to an incident to make smarter decisions

If your Microsoft Sentinel incident is created from an alert and analytics rule that generates IP address entities, configure the incident to trigger an automation rule to run a playbook and gather more information.

Configure your playbook with the following steps:

1. Start the playbook when the incident is created. The entities represented in the incident are stored in the incident trigger's dynamic fields.

1. For each IP address, configure the playbook to query an external Threat Intelligence provider, such as [Virus Total](https://www.virustotal.com/), to retrieve more data.

1. Add the returned data and insights as comments of the incident to enrich your investigation.

### Bi-directional sync for Microsoft Sentinel incidents with other ticketing systems

To sync your Microsoft Sentinel incident data with a ticketing system, such as ServiceNow:

1. Create an automation rule for all incident creation.
1. Attach a playbook that's triggered when a new incident is created.
1. Configure the playbook to create a new ticket in ServiceNow using the [ServiceNow connector](/connectors/service-now/).

    Make sure that your teams can easily jump from the ServiceNow ticket back to your Microsoft Sentinel incident by configuring the playbook to include the incident name, important fields, and a URL to the Microsoft Sentinel incident in the ServiceNow ticket.

### Orchestration: Control the incidents queue from your SOC chat platform

If your Microsoft Sentinel incident is created from an alert and analytics rule that generates username and IP address entities, configure the incident to trigger an automation rule to run a playbook and contact your team over your standard communications channels.

Configure your playbook with the following steps:

1. Start the playbook when the incident is created. The entities represented in the incident are stored in the incident trigger's dynamic fields.

1. Configure the playbook to send a message to your security operations communications channel, such as in [Microsoft Teams](/connectors/teams/) or [Slack](/connectors/slack/) to make sure your security analysts are aware of the incident.

1. Configure the playbook to send all the information in the alert by email to your senior network admin and security admin. The email message includes **Block** and **Ignore** user option buttons.

1. Configure the playbook to wait until a response is received from the admins, then continue to run.

1. If the admins select **Block**, configure the playbook to send a command to the firewall to block the IP address in the alert, and another to Microsoft Entra ID to disable the user.

### Response to threats immediately with minimal human dependencies

This section provides two examples, responding to threats of a compromised user and a compromised machine.

**In case of a compromised user**, such as discovered by [Microsoft Entra ID Protection](/azure/active-directory/identity-protection/overview-identity-protection):

1. Start your playbook when a new Microsoft Sentinel incident is created.

1. For each user entity in the incident that's suspected as compromised, configure the playbook to:

    1. Send a Teams message to the user, requesting confirmation that the user took the suspicious action.

    1. Check with Microsoft Entra ID Protection to [confirm the user's status as compromised](/connectors/azureadip/#confirm-a-risky-user-as-compromised). Microsoft Entra ID Protection labels the user as **risky**, and apply any enforcement policy already configured - for example, to require the user to use MFA when next signing in.

    > [!NOTE]
    > This particular Microsoft Entra action does not initiate any enforcement activity on the user, nor does it initiate any configuration of enforcement policy. It only tells Microsoft Entra ID Protection to apply any already defined policies as appropriate. Any enforcement depends entirely on the appropriate policies being defined in Microsoft Entra ID Protection.

**In case of a compromised machine**, such as discovered by [Microsoft Defender for Endpoint](/windows/security/threat-protection/):

1. Start your playbook when a [new Microsoft Sentinel incident is created](/connectors/azuresentinel/#triggers).

1. Configure your playbook with the **Entities - Get Hosts** action to parse the suspicious machines that are included in the incident entities.

1. Configure your playbook to issue a command to Microsoft Defender for Endpoint to [isolate the machines](/connectors/wdatp/#actions---isolate-machine) in the alert.

### Respond manually during an investigation or while hunting without leaving context

Use the entity trigger to take immediate action on individual threat actors you discover during an investigation, one at a time, right from within your investigation. This option is also available in the threat hunting context, unconnected to any particular incident. 

Select an entity in context and perform actions on it right there, saving time and reducing complexity.

Playbooks with entity triggers support actions such as:

- Blocking a compromised user.
- Blocking traffic from a malicious IP address in your firewall.
- Isolating a compromised host on your network.
- Adding an IP address to a safe/unsafe address watchlist, or to your external configuration management database (CMDB).
- Getting a file hash report from an external threat intelligence source and adding it to an incident as a comment.


## Recommended playbook templates

This section lists recommended playbooks, and other similar playbooks are available to you in the [Content hub](../sentinel-solutions-deploy.md), or in the [Microsoft Sentinel GitHub repository](https://github.com/Azure/Azure-Sentinel/tree/master/Playbooks).

### Notification playbook templates

**Notification playbooks** are triggered when an alert or incident is created and send a notification to a configured destination:

| Playbook | Folder in<br>GitHub&nbsp;repository |Solution in Content hub/<br>Azure Marketplace |
| -------- | ----------------------------------- |--------------------------------------------- |
| **Post a message in a Microsoft Teamschannel** | [Post-Message-Teams](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SentinelSOARessentials/Playbooks/Post-Message-Teams) | [Sentinel SOAR Essentialssolution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |
| **Send an Outlook email notification** |[Send-basic-email](https://github.com/AzureAzure-Sentinel/tree/master/SolutionsSentinelSOARessentials/PlaybooksSend-basic-email) | [Sentinel SOAR Essentialssolution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |
| **Post a message in a Slack channel** |[Post-Message-Slack](https://github.com/AzureAzure-Sentinel/tree/master/SolutionsSentinelSOARessentials/PlaybooksPost-Message-Slack) | [Sentinel SOAR Essentialssolution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |
| **Send Microsoft Teams adaptive card on incident creation** |[Send-Teams-adaptive-card-on-incident-creation(https://github.com/Azure/Azure-Sentinel/treemaster/Solutions/SentinelSOARessentials/PlaybooksSend-Teams-adaptive-card-on-incident-creation) |[Sentinel SOAR Essentials solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |

### Blocking playbook templates

**Blocking playbooks** are triggered when an alert or incident is created, gather entity information like the account, IP address, and host, and blocks them from further actions:

| Playbook | Folder in<br>GitHub&nbsp;repository | Solution in Content&nbsp;hub/<br>Azure Marketplace |
| -------- | ----------------------------------- | ----------------------------------------- |
| **Block an IP address in Azure Firewall** | [AzureFirewall-BlockIP-addNewRule](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Azure%20Firewall/Playbooks/AzureFirewall-BlockIP-addNewRule) | [Azure Firewall Solution for Sentinel](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/sentinel4azurefirewall.sentinel4azurefirewall?tab=Overview) |
| **Block a Microsoft Entra user** | Block-AADUser | [Microsoft Entra solution](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/azuresentinel.azure-sentinel-solution-azureactivedirectory?tab=Overview) |
| **Reset a Microsoft Entra user password** | Reset-AADUserPassword | [Microsoft Entra solution](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/azuresentinel.azure-sentinel-solution-azureactivedirectory?tab=Overview) |
| **Isolate or unisolate device using<br>Microsoft Defender for Endpoint** | [Isolate-MDEMachine](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/MicrosoftDefenderForEndpoint/Playbooks/Isolate-MDEMachine)<br>[Unisolate-MDEMachine](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/MicrosoftDefenderForEndpoint/Playbooks/Unisolate-MDEMachine) | [Microsoft Defender for Endpoint solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-microsoftdefenderendpoint?tab=Overview) |

### Create, update, or close playbook templates

**Create, update, or close playbooks** can create, update, or close incidents in Microsoft Sentinel, Microsoft 365 security services, or other ticketing systems:

| Playbook | Folder in<br>GitHub&nbsp;repository | Solution in Content hub/<br>Azure Marketplace |
| -------- | ----------------------------------- | --------------------------------------------- |
| **Create an incident using Microsoft Forms** | [CreateIncident-MicrosoftForms](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SentinelSOARessentials/Playbooks/CreateIncident-MicrosoftForms) | [Sentinel SOAR Essentials solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |
| **Relate alerts to incidents** | [relateAlertsToIncident-basedOnIP](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/SentinelSOARessentials/Playbooks/relateAlertsToIncident-basedOnIP) | [Sentinel SOAR Essentials solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-sentinelsoaressentials?tab=Overview) |
| **Create a ServiceNow incident** | [Create-SNOW-record](https://github.com/Azure/Azure-Sentinel/tree/master/Solutions/Servicenow/Playbooks/Create-SNOW-record) | [ServiceNow solution](https://azuremarketplace.microsoft.com/en-US/marketplace/apps/azuresentinel.azure-sentinel-solution-servicenow?tab=Overview) |

## Commonly used playbook configurations

This section provides sample screenshots for commonly used playbook configurations, including updating an incident, using incident details, adding comments to an incident, or disabling a user.

### Update an incident

This section provides sample screenshots of how you might use a playbook to update an incident based on a new incident or alert.

**Update an incident based on a new incident** (incident trigger):

![Screenshot of an incident trigger simple update flow example.](../media/playbook-triggers-actions/incident-simple-flow.png)

**Update an incident based on a new alert** (alert trigger):

![Screenshot of an alert trigger simple update incident flow example.](../media/playbook-triggers-actions/alert-update-flow.png)

### Use incident details in your flow

This section provides sample screenshots of how you might use your playbook to use incident details elsewhere in your flow:

**Send incident details by mail, using a playbook triggered by a new incident**: 

![Screenshot of an incident trigger simple get flow example.](../media/playbook-triggers-actions/incident-simple-mail-flow.png)

**Send incident details by mail, using a playbook triggered by a new alert**:

![Screenshot of an alert trigger simple get incident flow example.](../media/playbook-triggers-actions/alert-simple-mail-flow.png)

### Add a comment to an incident

This section provides sample screenshots of how you might use your playbook to add comments to an incident:

**Add a comment to an incident, using a playbook triggered by a new incident**:

![Screenshot of an incident trigger simple add comment example.](../media/playbook-triggers-actions/incident-comment.png)

**Add a comment to an incident, using a playbook triggered by a new alert**:

![Screenshot of an alert trigger simple add comment example.](../media/playbook-triggers-actions/alert-comment.png)

### Disable a user

The following screenshot shows an example of how you might use your playbook to disable a user account, based on a Microsoft Sentinel entity trigger:

:::image type="content" source="../media/playbook-triggers-actions/entity-trigger-actions.png" alt-text="Screenshot showing actions to take in an entity-trigger playbook to disable a user.":::

## Related content

- [Automate threat response with playbooks in Microsoft Sentinel](automate-responses-with-playbooks.md)
- [Create and customize Microsoft Sentinel playbooks from content templates](use-playbook-templates.md)
- [Automate and run Microsoft Sentinel playbooks](run-playbooks.md)