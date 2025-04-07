---
title: Connect to SMTP from Azure Logic Apps
description: Automate tasks and workflows that send email through your SMTP (Simple Mail Transfer Protocol) account using Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/19/2025
---

# Connect to your SMTP account from Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

With Azure Logic Apps and the Simple Mail Transfer Protocol (SMTP) connector, 
you can create automated tasks and workflows that send email from your SMTP account. 
You can also have other actions use the output from SMTP actions. For example, 
after your SMTP sends an email, you can notify your team in Slack with the Slack connector. 
If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Your SMTP account and user credentials

  Your credentials authorize your logic app to create 
  a connection and access your SMTP account.

* Basic knowledge about how to create logic apps

* The logic app where you want to access your SMTP account. 
To use an SMTP action, start your logic app with a trigger, 
such as a Salesforce trigger, if you have a Salesforce account.

  For example, you can start your logic app with the 
  **When a record is created** Salesforce trigger. 
  This trigger fires each time that a new record, 
  such as a lead, is created in Salesforce. 
  You can then follow this trigger with the SMTP 
  **Send Email** action. That way, when the new 
  record is created, your logic app sends an email 
  from your SMTP account about the new record.

## Connector reference

For more technical details about this connector, such as triggers, actions, and limits as described by the connector's Swagger file, see the [connector's reference page](/connectors/smtpconnector/).

## Connect to SMTP

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app resource and workflow in the designer, if not open already.

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

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
* [What are connectors in Azure Logic Apps](introduction.md)
