---
title: Connect to SAP systems - Azure Logic Apps | Microsoft Docs
description: How to access and manage SAP resources by automating workflows with Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: divswa, LADocs
ms.topic: article
ms.date: 09/14/2018
tags: connectors
---

# Connect to SAP systems from Azure Logic Apps

This article shows how you can access your on-premises SAP resources from 
inside a logic app by using the SAP ERP Central Component (ECC) connector. 
The SAP ECC connector supports message or data integration to and from 
SAP Netweaver-based systems through Intermediate Document (IDoc) or 
Business Application Programming Interface (BAPI) or Remote Function Call (RFC).

The SAP ECC connector uses the 
<a href="https://help.sap.com/saphelp_nwpi71/helpdata/en/e9/23c80d66d08c4c8c044a3ea11ca90f/frameset.htm">SAP .Net Connector (NCo) library</a> and provides these operations or actions:

- **Send to SAP**: Send IDoc or call BAPI functions over tRFC in SAP systems.
- **Receive from SAP**: Receive IDoc or BAPI function calls over tRFC from SAP systems.
- **Generate schemas**: Generate schemas for the SAP artifacts for IDoc or BAPI or RFC.

The SAP connector integrates with on-premises SAP systems through the 
[on-premises data gateway](https://www.microsoft.com/download/details.aspx?id=53127). 
In Send scenarios, for example, when sending a message from Logic Apps to an SAP system, 
the data gateway acts as an RFC client and forwards the requests received from Logic Apps to SAP.
Likewise, in Receive scenarios, the data gateway acts as an RFC server 
that receives requests from SAP and forwards to the Logic App. 

This article shows how to create example logic apps that integrate 
with SAP while covering the previously described integration scenarios.

## Prerequisites

To follow along with this article, you need these items:

* An Azure subscription. If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* The logic app from where you want to access your SAP 
system and a trigger that starts your logic app's workflow. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) and 
[Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

* Your <a href="https://wiki.scn.sap.com/wiki/display/ABAP/ABAP+Application+Server" target="_blank">SAP Application Server</a> 
or <a href="https://help.sap.com/saphelp_nw70/helpdata/en/40/c235c15ab7468bb31599cc759179ef/frameset.htm" target="_blank">SAP Message Server</a>

* Download and install the latest 
[on-premises data gateway](https://www.microsoft.com/download/details.aspx?id=53127) 
on any on-premises computer. Make sure you set up 
your gateway in the Azure portal before you continue. 
The gateway helps you securely access data and 
resources are on premises. For more information, see 
[Install on-premises data gateway for Azure Logic Apps](../logic-apps/logic-apps-gateway-install.md).

* Download and install the latest SAP client library, which is currently 
<a href="https://softwaredownloads.sap.com/file/0020000000086282018" target="_blank">SAP Connector (NCo) 3.0.20.0 for Microsoft .NET Framework 4.0 and Windows 64bit (x64)</a>, 
on the same computer as the on-premises data gateway. Install this version or later 
for these reasons:

  * Earlier SAP NCo versions might become deadlocked when 
  more than one IDoc messages are sent at the same time. 
  This condition blocks all later messages that are sent 
  to the SAP destination, causing the messages to time out.

  * The on-premises data gateway runs only on 64-bit systems. 
  Otherwise, you get a "bad image" error because the data 
  gateway host service doesn't support 32-bit assemblies.

  * Both the data gateway host service and the Microsoft SAP Adapter 
  use .NET Framework 4.5. The SAP NCo for .NET Framework 4.0 
  works with processes that use .NET runtime 4.0 to 4.7.1. 
  The SAP NCo for .NET Framework 2.0 works with processes 
  that use .NET runtime 2.0 to 3.5 and no longer works 
  with the latest on-premises data gateway.

* Message content you can send to your SAP server, such as a sample IDoc file. 
This content must be in XML format and include the namespace 
for the SAP action you want to use.

<a name="add-trigger"></a>

## Send to SAP

This example uses a logic app that you can trigger with an HTTP request. 
The logic app sends an Intermediate Document (IDoc) to an SAP server, 
and returns a response to the requestor that called the logic app. 

### Add HTTP request trigger

In Azure Logic Apps, every logic app must start with a 
[trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), 
which fires when a specific event happens or when a 
specific condition is met. Each time the trigger fires, 
the Logic Apps engine creates a logic app instance 
and starts running your app's workflow.

In this example, you create a logic app with an endpoint in 
Azure so that you can send *HTTP POST requests* to your logic app. 
When your logic app receives these HTTP requests, 
the trigger fires and runs the next step in your workflow.

1. In the [Azure portal](https://portal.azure.com), 
create a blank logic app, 
which opens the Logic App Designer. 

2. In the search box, enter "http request" as your filter. 
From the triggers list, select this trigger: 
**Request - When a HTTP request is received**

   ![Add HTTP Request trigger](./media/logic-apps-using-sap-connector/add-trigger.png)

3. Now save your logic app so you can 
generate an endpoint URL for your logic app.
On the designer toolbar, choose **Save**. 

   The endpoint URL now appears in your trigger, 
   for example:

   ![Generate URL for endpoint](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

<a name="add-action"></a>

### Add SAP action

In Azure Logic Apps, an [action](../logic-apps/logic-apps-overview.md#logic-app-concepts) 
is a step in your workflow that follows a trigger or another action. 
If you haven't added a trigger to your logic app yet and want to follow 
this example, [add the trigger described in this section](#add-trigger).

1. In the Logic App Designer, under the trigger, 
choose **New step** > **Add an action**.

   ![Add an action](./media/logic-apps-using-sap-connector/add-action.png) 

2. In the search box, enter "sap" as your filter. 
From the actions list, select this action: **Send message to SAP**
  
   ![Select SAP send action](media/logic-apps-using-sap-connector/select-sap-send-action.png)

   Alternately, instead of searching, choose the **Enterprise** tab, 
   and select the SAP action.

   ![Select SAP send action from Enterprise tab](media/logic-apps-using-sap-connector/select-sap-send-action-ent-tab.png)

3. If you're prompted for connection details, create your SAP connection now. 
Otherwise, if your connection already exists, continue with the next step 
so you can set up your SAP action. 

   **Create on-premises SAP connection**

   1. Provide the connection information for your SAP server. 
   For the **Data Gateway** property, select the data gateway you created 
   in the Azure portal for your gateway installation.

      If the **Logon Type** property is set to **Application Server**, 
      these properties, which usually appear optional, are required:

      ![Create SAP application server connection](media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png) 

      If the **Logon Type** property is set to **Group**, 
      these properties, which usually appear optional, are required: 

      ![Create SAP message server connection](media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png) 

   2. When you're done, choose **Create**. 
   
      Logic Apps sets up and tests your connection, 
      making sure that the connection works properly.

4. Now find and select an action from your SAP server. 

   1. In the **SAP action** box, choose the folder icon. 
   From the file list, find and select the SAP message you want to use. 
   To navigate the list, use the arrows.

      This example selects an IDoc with **Order** type. 

      ![Find and select IDoc action](./media/logic-apps-using-sap-connector/SAP-app-server-find-action.png)

      If you can't find the action you want, you can manually enter a path, for example:

      ![Manually provide path to IDoc action](./media/logic-apps-using-sap-connector/SAP-app-server-manually-enter-action.png)

      > [!TIP]
      > Provide the value for SAP Action through the expression editor. 
      > That way, you can use same action for different message types.

      For more information about IDoc operations, see 
      [Message schemas for IDOC operations](https://docs.microsoft.com/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

   2. Click inside the **Input Message** box so that the dynamic content list appears. 
   From that list, under **When a HTTP request is received**, select the **Body** field. 

      This step includes the body content from your HTTP request 
      trigger and sends that output to your SAP server.

      ![Select "Body" field](./media/logic-apps-using-sap-connector/SAP-app-server-action-select-body.png)

      When you're done, your SAP action looks like this example:

      ![Complete SAP action](./media/logic-apps-using-sap-connector/SAP-app-server-complete-action.png)

5. Save your logic app. On the designer toolbar, choose **Save**.

<a name="add-response"></a>

### Add HTTP response action

Now add a response action to your logic app's 
workflow and include the output from the SAP action. 
That way, your logic app returns the results 
from your SAP server to the original requestor. 

1. In the Logic App Designer, under the SAP action, 
choose **New step** > **Add an action**.

2. In the search box, enter "response" as your filter. 
From the actions list, select this action: **Request - Response**

3. Click inside the **Body** box so that the dynamic content list appears. 
From that list, under **Send to SAP**, select the **Body** field. 

   ![Complete SAP action](./media/logic-apps-using-sap-connector/select-sap-body-for-response-action.png)

4. Save your logic app. 

### Test your logic app

1. If your logic app isn't already enabled, 
on your logic app menu, choose **Overview**. 
On the toolbar, choose **Enable**. 

2. On the Logic App Designer toolbar, 
choose **Run**. This step manually starts your logic app.

3. Trigger your logic app by sending an HTTP POST 
request to the URL in your HTTP request trigger, 
and include your message content with your request. 
To the send the request, you can use a tool such as 
[Postman](https://www.getpostman.com/apps). 

   For this article, the request sends an IDoc file, which must be in XML 
   format and include the namespace for the SAP action you're using, for example: 

   ``` xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <Send xmlns="http://Microsoft.LobServices.Sap/2007/03/Idoc/2/ORDERS05//720/Send">
      <idocData>
         <...>
      </idocData>
   </Send>
   ```

4. After you send your HTTP request, wait for the response from your logic app.

   > [!NOTE]
   > Your logic app might time out if all the steps 
   > required for the response don't finish within the 
   > [request timeout limit](./logic-apps-limits-and-config.md). 
   > If this condition happens, requests might get blocked. 
   > To help you diagnose problems, learn how you can 
   > [check and monitor your logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md).

Congratulations, you've now created a logic app that can 
communicate with your SAP server. Now that you've set up 
an SAP connection for your logic app, you can explore other 
available SAP actions, such as BAPI and RFC.

## Receive from SAP

This example uses a logic app that triggers 
when receiving a message from an SAP system. 

### Add SAP trigger

1. In the Azure portal, create a blank logic app, 
which opens the Logic App Designer. 

2. In the search box, enter "sap" as your filter. 
From the triggers list, select this trigger: 
**When a message is received from SAP**

   ![Add SAP trigger](./media/logic-apps-using-sap-connector/add-sap-trigger.png)

   Alternately, you can go to the Enterprise tab and select the trigger

   ![Add SAP trigger from ent tab](./media/logic-apps-using-sap-connector/add-sap-trigger-ent-tab.png)

3. If you're prompted for connection details, create your SAP connection now. 
Otherwise, if your connection already exists, continue with the next step 
so you can set up your SAP action. 

   **Create on-premises SAP connection**

   1. Provide the connection information for your SAP server. 
   For the **Data Gateway** property, select the data gateway you 
   created in the Azure portal for your gateway installation.

      If the **Logon Type** property is set to **Application Server**, 
      these properties, which usually appear optional, are required:

      ![Create SAP application server connection](media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png) 

      If the **Logon Type** property is set to **Group**, 
      these properties, which usually appear optional, are required:

      ![Create SAP message server connection](media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)  

4. Provide the required parameters based on your SAP system configuration. 

   You can optionally provide one or more SAP actions. 
   This list of actions specifies the messages that the trigger 
   receives from your SAP server through the data gateway. 
   An empty list specifies that the trigger receives all messages. 
   If the list has more than one message, the trigger receives only 
   the messages specified in the list. Any other messages sent from 
   your SAP server are rejected by the gateway.

   You can select an SAP action from the file picker:

   ![Select SAP action](media/logic-apps-using-sap-connector/select-SAP-action-trigger.png)  

   Or you can manually specify an action:

   ![Manually enter SAP action](media/logic-apps-using-sap-connector/manual-enter-SAP-action-trigger.png) 

   Here's an example that shows how the action appears 
   when you set up the trigger to receive more than one message.

   ![Trigger example](media/logic-apps-using-sap-connector/example-trigger.png)  

   For more information about the SAP action, see 
   [Message schemas for IDOC operations](https://docs.microsoft.com/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations)

5. Now save your logic app so you can start receiving messages from your SAP system.
On the designer toolbar, choose **Save**. 

Your logic app is now ready to receive messages from your SAP system. 

> [!NOTE]
> The SAP trigger is not a polling trigger, 
> but a webhook-based trigger instead. 
> The trigger is called from the gateway 
> only when a message exists, so no polling is necessary. 

### Test your logic app

1. To trigger your logic app, send a message from your SAP system.

2. On the logic app menu, choose **Overview**, and review the 
**Runs history** for any new runs for your logic app. 

3. Open the most recent run, which shows the message 
sent from your SAP system in the trigger outputs section.

## Generate schemas for artifacts in SAP

This example uses a logic app that you can trigger with an HTTP request. 
The SAP action sends a request to an SAP system to generate the schemas 
for specified Intermediate Document (IDoc) and BAPI. Schemas that return 
in the response are uploaded to an Integration Account 
by using the Azure Resource Manager connector.

### Add HTTP request trigger

1. In the Azure portal, create a blank logic app, 
which opens the Logic App Designer. 

2. In the search box, enter "http request" as your filter. 
From the triggers list, select this trigger: 
**Request - When a HTTP request is received**

   ![Add HTTP Request trigger](./media/logic-apps-using-sap-connector/add-trigger.png)

3. Now save your logic app so you can 
generate an endpoint URL for your logic app.
On the designer toolbar, choose **Save**. 

   The endpoint URL now appears in your trigger, 
   for example:

   ![Generate URL for endpoint](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

### Add SAP action to generate schemas

1. In the Logic App Designer, under the trigger, 
choose **New step** > **Add an action**.

   ![Add an action](./media/logic-apps-using-sap-connector/add-action.png) 

2. In the search box, enter "sap" as your filter. 
From the actions list, select this action: **Generate schemas**
  
   ![Select SAP send action](media/logic-apps-using-sap-connector/select-sap-schema-generator-action.png)

   Alternately, you can also choose the **Enterprise** tab, 
   and select the SAP action.

   ![Select SAP send action from Enterprise tab](media/logic-apps-using-sap-connector/select-sap-schema-generator-ent-tab.png)

3. If you're prompted for connection details, create your SAP connection now. 
Otherwise, if your connection already exists, continue with the next step 
so you can set up your SAP action. 

   **Create on-premises SAP connection**

   1. Provide the connection information for your SAP server. 
   For the **Data Gateway** property, select the data gateway you 
   created in the Azure portal for your gateway installation.

      If the **Logon Type** property is set to **Application Server**, 
      these properties, which usually appear optional, are required:

      ![Create SAP application server connection](media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png) 

      If the **Logon Type** property is set to **Group**, 
      these properties, which usually appear optional, are required:
   
      ![Create SAP message server connection](media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png) 

   2. When you're done, choose **Create**. Logic Apps sets up and tests your connection, making sure that the connection works properly.

4. Provide the path to the artifact for which you want to generate the schema.

   You can select the SAP action from the file picker:

   ![Select SAP action](media/logic-apps-using-sap-connector/select-SAP-action-schema-generator.png)  

   Or, you can manually enter the action:

   ![Manually enter SAP action](media/logic-apps-using-sap-connector/manual-enter-SAP-action-schema-generator.png) 

   To generate schemas for more than one artifact, 
   provide the SAP action details for each artifact, 
   for example:

   ![Select Add new item](media/logic-apps-using-sap-connector/schema-generator-array-pick.png) 

   ![Show two items](media/logic-apps-using-sap-connector/schema-generator-example.png) 

   For more information about the SAP Action, see 
   [Message schemas for IDOC operations](https://docs.microsoft.com/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

5. Save your logic app. On the designer toolbar, choose **Save**.

### Test your logic app

1. On the designer toolbar, choose **Run** to trigger a run for your logic app.

2. Open the run, and check the outputs for the **Generate schema** action. 

   The outputs show the generated schemas for the specified list of messages.

### Upload schemas to integration account

Optionally, you can download or store the generated schemas in repositories, 
such as a blob, storage, or integration account. Integration accounts provide 
a first-class experience with other XML actions, so this example shows how to 
upload schemas to an integration account for the same logic app by using the 
Azure Resource Manager connector.

1. In Logic App Designer, under the trigger, choose **New step** > **Add an action**. 
In the search box, enter "resource manager" as your filter. 
Select this action: **Create or update a resource**

   ![Select Azure Resource Manager action](media/logic-apps-using-sap-connector/select-arm-action.png) 

2. Enter the details, including your Azure subscription, 
Azure resource group, and integration account. 
For other fields, follow the example below.

   ![Enter details for Azure Resource Manager action](media/logic-apps-using-sap-connector/arm-action.png)

   The SAP **Generate schemas** action generates schemas as a collection, 
   so the designer automatically adds a **For each** loop to the action. 
   Here's an example that shows how this action appears:

   ![Azure Resource Manager action with "for each" loop](media/logic-apps-using-sap-connector/arm-action-foreach.png)  

   > [!NOTE]
   > The schemas use base64-encoded format. 
   > To upload the schemas to an integration account, 
   > they must be decoded by using the `base64ToString()` function. 
   > Here's an example that shows the code for the `"properties"` element:
   >
   > ```json
   > "properties": {
   >    "Content": "@base64ToString(items('For_each')?['Content'])",
   >    "ContentType": "application/xml",
   >    "SchemaType": "Xml"
   > }
   > ```

3. Save your logic app. On the designer toolbar, choose **Save**.

### Test your logic app

1. On the designer toolbar, choose **Run** to manually trigger your logic app.

2. After a successful run, go to the integration account, 
and check that the generated schemas generated exist.

## Known issues and limitations

Here are the currently known issues and limitations for the SAP connector:

* The SAP trigger does't support receiving batch IDOCs from SAP. 
This action might result in RFC connection failure between your SAP system and the data gateway.

* The SAP trigger doesn't support data gateway clusters. 
In some failover cases, the data gateway node that communicates 
with the SAP system might differ from the active node, resulting 
in unexpected behavior. For Send scenarios, data gateway clusters are supported.

* In Receive scenarios, returning a non-null response isn't supported. 
A logic app with a trigger and a response action results in unexpected behavior. 

* Only a single Send to SAP call or message works with tRFC. 
The Business Application Programming Interface (BAPI) commit pattern, 
such as making multiple tRFC calls in the same session, isn't supported.

* RFCs with attachments aren't supported for both the Send to SAP 
and Generate schemas actions.

* The SAP connector currently doesn't support SAP router strings. 
The on-premises data gateway must exist on the same LAN as the SAP 
system you want to connect.

* The conversion for absent (null), empty, minimum, and maximum values 
for DATS and TIMS SAP fields is subject to change in later updates for 
the on-premises data gateway.

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the 
[Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

* [Connect to on-premises systems](../logic-apps/logic-apps-gateway-connection.md) from logic apps
* Learn how to validate, transform, and other message operations with the 
[Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)
* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
