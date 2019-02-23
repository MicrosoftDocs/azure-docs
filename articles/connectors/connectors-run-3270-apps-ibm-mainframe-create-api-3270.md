---
title: Connect to 3270 apps on IBM mainframes with Azure - Azure Logic Apps
description: Integrate and automate 3270 screen-driven apps with Azure by using Azure Logic Apps and HIS 3270 connector
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ChristopherHouser
ms.author: chrishou
ms.reviewer: estfan, valthom
ms.topic: article
ms.date: 03/06/2019
tags: connectors
---

# Integrate apps driven by 3270 screens on IBM mainframes with Azure using Azure Logic Apps and HIS 3270 connector

> [!NOTE]
> This connector is in *public preview*.

With Azure Logic Apps and the HIS 3270 connector, you can 
access and run IBM mainframe apps that are usually driven 
by navigating through 3270 emulator screens. That way, 
you can integrate your IBM mainframe apps with Azure, 
Microsoft, and many other apps, services, and systems 
that Azure Logic Apps supports. The connector communicates 
with IBM mainframes by using the TN3270 protocol and is 
available in all Azure Logic Apps regions except for Azure 
Government and Azure China. If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md)

This article describes how the HIS 3270 connector helps you 
run 3270 screen-driven apps on IBM mainframes, what you need 
for the connector to work, and the steps for using the connector 
actions so you can run your mainframe apps from automated logic 
app workflows.

## Why use the HIS connector?

To access apps on IBM mainframes, you typically use a 3270 
terminal through a 3270 emulator, often called a "green screen". 
This method is a time-hardened way but has many limitations. 
Host Integration Server (HIS) lets you work directly with 
these apps, but sometimes, separating the screen and business 
logic isn't possible. Or maybe you no longer have information 
about how the host applications work. 

For these scenarios, you can create .NET apps that programmatically 
drive the 3270 screens without making changes to the host. To create 
these apps, you can use the Session Integrator tool, which is a .NET 
library for writing custom apps that can access 3270 screen-driven data, 
also known as "screen scraping".

To extend these scenarios, the HIS 3270 connector in Azure Logic Apps 
works with the standalone 3270 Design tool, which lets you capture the 
host screens for a specific task and define methods that have input and 
output parameters. This tool converts that information into metadata 
that the connector uses when an action is called. This capability lets 
you integrate legacy apps with Azure. 

that 
generates a metadata file that defines the navigation 
through the 3270 screens, exposing input and output parameters. 
You can create metadata that lets the HIS 3270 connector drive 
your custom mainframe apps. 

The connector lets you add actions that can drive apps hosted on IBM 
mainframes to logic app workflows 
by adding actions that drive apps hosted on your IBM mainframe. 
By handling navigation through the 320 screens and entering 
data into the host application, returning the results to your logic app.

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
using the standalone 3270 Design Tool.

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
where you can later add and store your HIDX file as a map so your 
logic app can access the metadata and method definitions in that file. 
Make sure your integration account is linked to the logic app you're using. 
Also, if you use an ISE, make sure your integration account's 
location is the same ISE that your logic app uses.

## Create app metadata for the connector

In a 3270-driven app, the screens and data fields are unique to your scenarios, 
so the HIS 3270 connector must have metadata about your app. This metadata 
describes information that helps identify and recognize screens, describes how 
to navigate between screens, where to input data, and where to expect results. 
This metadata is generated by the standalone 3270 Design Tool, which moves you 
through these stages or *modes*, in this order:

1. **Capture**: In this mode, you identify the screens required for completing 
a specific task with your app, for example, getting a bank balance. 

   On each screen, you mark an item that uniquely identifies that screen. 
   For example, you might specify a line of text or a more complex set of 
   conditions, such as when specific text and a field aren't empty.

1. **Navigation plan**: In this mode, you specify the plan for how 
your logic app navigates through the screens.

   Sometimes, you might have more than one path that your app can take, 
   for example, one path produces the correct result, while the other 
   path produces an error. For each screen you specify the keystrokes 
   necessary for moving to the next screen, for example, `CICSPROD <enter>`. 
   After you finish your navigation plan, you can define methods in the next mode.

1. **Method**: In this mode, you define a method, for example, `GetBalance`, 
by choosing the fields on each screen to use as the method's input 
parameters and the output parameters.

   For each parameter, you specify the data type, such as a string, integer, 
   date or time, and so on. When you're done, you can test your method on the 
   live host and confirm that the method works as expected. You then generate 
   the metadata file, or Host Integration Designer XML (HIDX) file, which now 
   has the method definitions to use for creating and running an action for 
   the HIS 3270 connector.

   When you're done, 
   [add your HIDX file as a map to your integration account](../logic-apps/logic-apps-enterprise-integration-maps.md) by using the Azure portal. 

In a later section on this page, you learn how to add an HIS 3270 
action to your logic app. When you add this action for the first time, 
you're prompted to create a connection and provide connection 
information, such as your integration account and host server. 
After you create the connection, you can select your previously 
added HIDX file, the method to run, and the parameters to use. 

After you finish all these steps, the action you created is 
ready for connecting to your IBM mainframe, drive screens 
for your app, enter data, return results, and so on. 
You can also continue adding other actions to your logic 
app for integrating with other apps, services, and systems.

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