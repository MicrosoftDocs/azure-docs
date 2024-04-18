---
title: Azure Logic Apps for Microsoft Sentinel playbooks
description: Learn about Azure Logic Apps concepts and how they work with Microsoft Sentinel playbooks.
author: batamig
ms.author: bagol
ms.topic: concept
ms.date: 04/18/2024
appliesto:
    - Microsoft Sentinel in the Azure portal
    - Microsoft Sentinel in the Microsoft Defender portal
ms.collection: usx-security
#customer intent: As a SOC engineer, I want to understand more about how Azure Logic Apps works with Microsoft Sentinel playbooks to help me automate threat prevention and response.

---

# Azure Logic Apps for Microsoft Sentinel playbooks

Microsoft Sentinel playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise. Microsoft Sentinel playbooks can take advantage of all the power and capabilities of the built-in templates in Azure Logic Apps.

Azure Logic Apps communicates with other systems and services using various types of [connectors](/connectors/). Use the [Microsoft Sentinel connector](/connectors/azuresentinel/) to create playbooks that interact with Microsoft Sentinel.

> [!NOTE]
> Azure Logic Apps creates separate resources, so additional charges might apply. For more information, visit the [Azure Logic Apps pricing page](https://azure.microsoft.com/pricing/details/logic-apps/).

## Microsoft Sentinel connector components

Within the Microsoft Sentinel connector, use triggers, actions, and dynamic fields to define the workflow of your playbook:

|Component  |Description  |
|---------|---------|
|**Trigger**     |   A trigger is the connector component that starts a workflow, in this case, a playbook. A Microsoft Sentinel trigger defines the schema that the playbook expects to receive when triggered. <br><br>The Microsoft Sentinel connector supports the following triggers: <br>- [Alert trigger](/connectors/azuresentinel/#triggers): The playbook receives the alert as input.<br>  - [Entity trigger (Preview)](/connectors/azuresentinel/#triggers): The playbook receives an entity as input.<br>  - [Incident trigger](/connectors/azuresentinel/#triggers): The playbook receives the incident as input, along with all the included alerts and entities.      |
|**Actions**     |   Actions are all the steps that happen after the trigger. They can be arranged sequentially, in parallel, or in a matrix of complex conditions. |
|**Dynamic fields**     |    Dynamic fields are temporary fields that can be used in the actions that follow. Dynamic fields are determined by the output schema of triggers and actions, and are populated by their actual output.  |

<!--do we need the info here about managed and custom connectors?

- **Managed connector:** A set of actions and triggers that wrap around API calls to a particular product or service. Azure Logic Apps offers hundreds of connectors to communicate with both Microsoft and non-Microsoft services. For more information, see [Azure Logic Apps connectors and their documentation](/connectors/connector-reference/connector-reference-logicapps-connectors)

- **Custom connector:** You might want to communicate with services that aren't available as prebuilt connectors. Custom connectors address this need by allowing you to create (and even share) a connector and define its own triggers and actions. For more information, see [Create your own custom Azure Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector).-->

## Supported logic app types

Microsoft Sentinel supports both *consumption* and *standard* Azure Logic Apps resource types:

- **Consumption** resources run in multitenant Azure Logic Apps and use the classic, original Azure Logic Apps engine.

- **Standard** resources run in single-tenant Azure Logic Apps and use a redesigned Azure Logic Apps engine.

The **Standard** logic app type offers higher performance, fixed pricing, multiple workflow capability, easier API connections management, native network capabilities such as support for virtual networks and private endpoints, built-in CI/CD features, better Visual Studio Code integration, an updated workflow designer, and more.

However, there are many differences between these two resource types, some of which affect some of the ways they can be used in playbooks in Microsoft Sentinel.

Playbooks based on Standard resources support the same uses in Microsoft Sentinel as Consumption resources, including:

- Attach them to automation rules and/or analytics rules.
- Run them on demand, from both incidents and alerts.
- Manage them in the Microsoft Sentinel > Automation > **Active playbooks** tab.

### Creating playbooks based on Standard resources

Standard workflows currently don't support playbook templates, which means you can't create a Standard workflow-based playbook directly in Microsoft Sentinel. Instead, you must first create the workflow in Azure Logic Apps, after which it appears as a playbook in Microsoft Sentinel.

### Standard workflows and private endpoints

While logic apps' Standard workflows support private endpoints, Microsoft Sentinel also requires you to [define an access restriction policy in Logic apps](../define-playbook-access-restrictions.md) to support private endpoints in playbooks based on Standard workflows.  

Without an access restriction policy, workflows with private endpoints might still be visible and selectable in Microsoft Sentinel, but running them will fail.

<!--not sure we need these extra details-- when you're choosing a playbook from a list in Microsoft Sentinel (whether to run manually, to add to an automation rule, or in the playbooks gallery), and you'll be able to select them, but their execution will fail.-->

###  Stateful and stateless Standard workflows

An indicator identifies Standard workflows as either *stateful* or *stateless*. Microsoft Sentinel doesn't currently support stateless workflows.

For more information, see [Stateful and stateless workflows](../../logic-apps/single-tenant-overview-compare.md#stateful-and-stateless-workflows).

## Playbook authentications to Microsoft Sentinel

Microsoft Sentinel playbooks are based on workflows built in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), a cloud service that helps you schedule, automate, and orchestrate tasks and workflows across systems throughout the enterprise.

Azure Logic Apps must connect separately and authenticate independently to each resource, of each type, that it interacts with, including to Microsoft Sentinel itself. Logic Apps uses [specialized connectors](/connectors/connector-reference/) for this purpose, with each resource type having its own connector.

For more information, see [Authenticate playbooks to Microsoft Sentinel](../authenticate-playbooks-to-sentinel.md).

## Related content


- [Automate threat response with Microsoft Sentinel playbooks](../automate-responses-with-playbooks.md)
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
- [Respond to threats with Microsoft Sentinel playbooks](run-playbooks.md)
- [Resource type and host environment differences](/azure/logic-apps/logic-apps-overview#resource-environment-differences) in the Azure Logic Apps documentation
- [Microsoft Sentinel Logic Apps connector](/connectors/azuresentinel/) in the Azure Logic Apps documentation
