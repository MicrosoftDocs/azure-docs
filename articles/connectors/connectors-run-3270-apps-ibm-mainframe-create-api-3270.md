---
title: Connect to 3270 apps on IBM mainframes with Azure - Azure Logic Apps
description: Integrate, automate, and run 3270 screen-driven apps on IBM mainframes with Azure by using Azure Logic Apps and HIS 3270 connector
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ChristopherHouser
ms.author: chrishou
ms.reviewer: estfan, valthom
ms.topic: article
ms.date: 02/21/2019
tags: connectors
---

# Integrate 3270 apps on IBM mainframes with Azure by using Azure Logic Apps and HIS 3270 connector

> [!NOTE]
> This connector is in *public preview*.

With Azure Logic Apps and the HIS 3270 connector, you can access and run 
apps that are driven by naviging through 3270 screens on IBM mainframes. 
That way, you can integrate Azure apps and services with 3270 screen-based 
apps. This connector communicates with IBM mainframes by using the TN3270 
protocol. You can create metadata that lets the HIS 3270 connector drive 
your custom mainframe apps. If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md) 

This connector is available in all Azure Logic Apps 
regions except for Azure Government and Azure China.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* Access to a TN3270 Server

* Basic knowledge about 
[how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* Recommended: An [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment.md), 
which you use as the location for creating and running your 
logic app. An ISE provides access from your logic app to 
resources that are protected inside Azure virtual networks.

* A logic app to use for automating and running your 3270 app. 
The 3270 connector doesn't have triggers, so use another 
trigger to start your logic app, such as the **Recurrence** 
trigger. You can then add 3270 actions. To get started, 
[create a blank logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
If you use an ISE, select that ISE as your logic app's location.

* A Host Integration Designer XML (HIDX) file, 
which defines the methods you use for creating and 
running a 3270 action. You can create this file by 
using the 3270 design tool.

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
where you add and store your HIDX files so your logic 
app can access those files. Make sure your integration 
account is linked to the logic app you're using. Also, 
if you use an ISE, make sure your integration account's 
location is the same ISE that your logic app uses.

## Run HIS 3270 actions

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com), 
and open your logic app in Logic App Designer, if not open already.

1. Under the last step where you want to add an action, 
choose **New step**, and select **Add an action**. 

1. Under the search box, choose **Enterprise**. 
In the search box, enter "3270" as your filter. 
From the actions list, select this action: 
**Runs a mainframe program over a TN3270 connection**

   ![Select 3270 action](./media/connectors-create-api-3270/select-3270-action.png)

   To add an action between steps, 
   move your pointer over the arrow between steps. 
   Choose the plus sign (**+**) that appears, 
   and then select **Add an action**.

1. If no connection exists yet, provide the 
necessary information for your connection, 
and choose **Create**.

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection Name** | Yes | <*connection-name*> | The name for your connection |
   | **Integration Account ID** | Yes | <*integration-account-name*> | Your integration account's name |
   | **Integration Account SAS URL** | Yes | <*integration-account-SAS-URL*> | Your integration account's Shared Access Signature (SAS) URL |
   | **Server** | Yes | <*TN3270-server-name*> | The host name for your TN3270 server |
   | **Port** | No | <*TN3270-server-port*> | The port used by your TN3270 server |
   | **Device Type** | No | <*IBM-terminal-model*> | The model name or number for the IBM terminal to emulate |
   | **Code Page** | No | <*code-page-number*> | The code page number for the host |
   | **Logical Unit Name** | No | <*logical-unit-name*> | The specific logical unit name to request from the host |
   | **Enable SSL?** | No | On or off | Turn on or turn off SSL encryption. |
   | **Validate host ssl certificate?** | No | On or off | Turn on or turn off validation for the server's certificate. |
   ||||

   For example:

   ![Connection properties](./media/connectors-create-api-3270/connection-properties.png)

1. Provide the necessary information for the action:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Hidx Name** | Yes | <*HIDX-file-name*> | Select the 3270 HIDX file you want to use. |
   | **Method Name** | Yes | <*method-name*> | Select the method in the HIDX file to use. After you select a method, the **Add new parameter** list appears so you can select parameters to use with that method. |
   ||||

   For example:

   **Select HIDX file**  

   ![Select HIDX file](./media/connectors-create-api-3270/select-hidx-file.png)

   **Select method**  

   ![Select method](./media/connectors-create-api-3270/select-method.png)

   **Select parameters**  

   ![Select parameters](./media/connectors-create-api-3270/add-parameters.png)

1. When you're done, save and run your logic app.

   After your logic app finishes running, the steps from the run appear. 
   Successful steps show checkmarks, while unsuccessful steps show the letter "X".

1. To review the inputs and outputs for each step, expand that step.

1. To review the outputs, choose **See raw outputs**.

# Connector reference

For technical details about triggers, actions, and limit, which are described
by the connector's OpenAPI (formerly Swagger) description, review the
connector's [reference page](/connectors/<*replace-with-api-topic-file-name*>).

# Get support

* For questions, visit the 
[Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](https://aka.ms/logicapps-wish).

# Next steps

* Learn about other [Logic Apps connectors](../connectors/apis-list.md)