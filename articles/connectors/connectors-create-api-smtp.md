---
title: Connect to SMTP from Workflows
description: Connect to SMTP (Simple Mail Transfer Protocol) accounts from integration workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.update-cycle: 1095-days
ms.date: 03/11/2026
# Customer intent: As an integration developer who works with Azure Logic Apps, I want to connect my logic app workflows to 
---

# Connect to your SMTP account from workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](../logic-apps/includes/logic-apps-sku-consumption.md)]

With Azure Logic Apps and the Simple Mail Transfer Protocol (SMTP) connector, 
you can create automated tasks and workflows that send email from your SMTP account. 
You can also have other actions use the output from SMTP actions. For example, 
after your SMTP sends an email, you can notify your team in Slack with the Slack connector.

## Prerequisites

* An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

* Your SMTP account and user credentials

  Your credentials authorize your logic app workflow to create 
  a connection and access your SMTP account.

* Basic knowledge about how to create logic app workflows

* The logic app where you want to access your SMTP account. 
To use an SMTP action, start your logic app workflow with any trigger, 
such as a Salesforce trigger, if you have a Salesforce account.

  For example, you can start your logic app workflow with the 
  **When a record is created** Salesforce trigger. 
  This trigger fires each time that a new record, 
  such as a lead, is created in Salesforce. 
  You can then follow this trigger with the SMTP 
  **Send Email** action. That way, when the new 
  record is created, your logic app workflow sends an email 
  from your SMTP account about the new record.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/smtpconnector/).

## Connect to SMTP

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. In the [Azure portal](https://portal.azure.com), open your logic app resource and workflow in the designer.

1. [Follow these general steps to add the **SMTP** action that you want](/azure/logic-apps/create-workflow-with-trigger-or-action#add-action). 

1. When prompted, provide this connection information:

   | Property | Required | Description |
   |----------|----------|-------------|
   | **Connection Name** | Yes | A name for the connection to your SMTP server | 
   | **SMTP Server Address** | Yes | The address for your SMTP server | 
   | **User Name** | Yes | Your username for your SMTP account | 
   | **Password** | Yes | Your password for your SMTP account | 
   | **SMTP Server Port** | No | A specific port on your SMTP server you want to use | 
   | **Enable SSL?** | No | Turn on or turn off TLS/SSL encryption. | 

1. Provide the necessary details for your selected action. 

1. Save your logic app or continue building your logic app's workflow.

## Related content

- [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
- [Built-in connectors for Azure Logic Apps](built-in.md)
- [What are connectors in Azure Logic Apps](introduction.md)
