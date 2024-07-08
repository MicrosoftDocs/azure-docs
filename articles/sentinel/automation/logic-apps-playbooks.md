---
title: Azure Logic Apps for Microsoft Sentinel playbooks
description: Learn about Azure Logic Apps concepts and how they work with Microsoft Sentinel playbooks.
author: batamig
ms.author: bagol
ms.topic: concept-article
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

Within the Microsoft Sentinel connector, use triggers, actions, and dynamic fields to define your playbook's workflow:

|Component  |Description  |
|---------|---------|
|**Trigger**     |   A trigger is the connector component that starts a workflow, in this case, a playbook. A Microsoft Sentinel trigger defines the schema that the playbook expects to receive when triggered. <br><br>The Microsoft Sentinel connector supports the following types of triggers: <br><br>- [Alert trigger](/connectors/azuresentinel/#triggers): The playbook receives an alert as input.<br>  - [Entity trigger (Preview)](/connectors/azuresentinel/#triggers): The playbook receives an entity as input.<br>  - [Incident trigger](/connectors/azuresentinel/#triggers): The playbook receives an incident as input, along with all the included alerts and entities.      |
|**Actions**     |   Actions are all the steps that happen after the trigger. Actions can be arranged sequentially, in parallel, or in a matrix of complex conditions. |
|**Dynamic fields**     |    Dynamic fields are temporary fields that can be used in the actions that follow your trigger. Dynamic fields are determined by the output schema of triggers and actions, and are populated by their actual output.  |

Azure Logic Apps also supports other types of connectors, such as managed connectors, which wrap around API calls, or custom connectors. For more information, see [Azure Logic Apps connectors and their documentation](/connectors/connector-reference/connector-reference-logicapps-connectors) and [Create your own custom Azure Logic Apps connectors](/connectors/custom-connectors/create-logic-apps-connector).

## Supported logic app types

Microsoft Sentinel supports both *consumption* and *standard* Azure Logic Apps resource types:

- **Consumption** resources run in multitenant Azure Logic Apps and use the classic, original Azure Logic Apps engine.

- **Standard** resources run in single-tenant Azure Logic Apps and use a more recently designed Azure Logic Apps engine.

    Standard resources offer higher performance, fixed pricing, multiple workflow capability, easier API connections management, built-in network capabilities and CI/CD features, and more. However, the following playbook functionality differs for Standard resources in Microsoft Sentinel:

    |Feature  |Description  |
    |---------|---------|
    |**Creating playbooks**  | Playbook templates aren't currently supported for Standard workflows, which means that you can't use a template to create your playbook directly in Microsoft Sentinel. <br><br>Instead, create your workflow manually in Azure Logic Apps to use it as a playbook in Microsoft Sentinel.       |
    |**Private endpoints**    |   If you're using Standard workflows with private endpoints, Microsoft Sentinel requires you to [define an access restriction policy in Logic apps](../define-playbook-access-restrictions.md) to support those private endpoints in any playbooks based on Standard workflows. <br><br> Without an access restriction policy, workflows with private endpoints might still be visible and selectable in Microsoft Sentinel, but running them will fail. |
    |**Stateless workflows**    | While Standard workflows support both *stateful* and *stateless* in Azure Logic Apps, Microsoft Sentinel doesn't support stateless workflows. <br><br>For more information, see [Stateful and stateless workflows](/azure/logic-apps/single-tenant-overview-compare#stateful-and-stateless-workflows).

## Playbook authentications to Microsoft Sentinel

Azure Logic Apps must connect separately and authenticate independently to each resource, of each type, that it interacts with, including to Microsoft Sentinel itself. Logic Apps uses [specialized connectors](/connectors/connector-reference/) for this purpose, with each resource type having its own connector.

For more information, see [Authenticate playbooks to Microsoft Sentinel](../authenticate-playbooks-to-sentinel.md).

## Related content

- [Resource type and host environment differences](/azure/logic-apps/logic-apps-overview#resource-environment-differences) in the Azure Logic Apps documentation
- [Microsoft Sentinel Logic Apps connector](/connectors/azuresentinel/) in the Azure Logic Apps documentation
- [Create and manage Microsoft Sentinel playbooks](create-playbooks.md)
