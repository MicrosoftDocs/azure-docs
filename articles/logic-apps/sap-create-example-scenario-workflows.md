---
title: Create common SAP workflows
description: Build workflows for common SAP scenarios in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, daviburg, azla
ms.topic: how-to
ms.date: 05/23/2023
---

# Create workflows for common SAP integration scenarios in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to create example logic app workflows for some common SAP integration scenarios using Azure Logic Apps and the SAP connector.

Both Standard and Consumption logic app workflows offer the SAP *managed* connector that's hosted and run in multi-tenant Azure. Standard workflows also offer the SAP *built-in* connector that's hosted and run in single-tenant Azure Logic Apps, but is also currently in preview and subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). If you create and host a Consumption workflow in an integration service environment (ISE), you can also use the SAP connector's ISE-native version. For more information, see [Connector technical reference](logic-apps-using-sap-connector.md#connector-technical-reference).

## Prerequisites

Before you start, make sure to [review and meet the SAP connector requirements](logic-apps-using-sap-connector.md#prerequisites) for your specific scenario.

<a name="receive-message-sap"></a>

## Receive message from SAP

The following example logic app workflow triggers when the workflow's SAP trigger receives a message from an SAP server.

<a name="add-sap-trigger"></a>

### Add an SAP trigger

### [Multi-tenant](#tab/multi-tenant)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and blank workflow in the designer.

1. [Follow these general steps](create-workflow-with-trigger-or-action.md?tabs=consumption#add-a-trigger-to-start-your-workflow) to add the SAP managed connector trigger named **When a message is received** to your workflow.

1. If prompted. provide the following [connection information](/connectors/sap/#default-connection) for your on-premises SAP server. When you're done, select **Create**. Otherwise, continue with the next step to set up your SAP trigger.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection name** | Yes | Enter a name for the connection. |
   | **Data Gateway** | Yes | 1. For **Subscription**, select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation. <br><br>2. For **Connection Gateway**, select your data gateway resource in Azure. |
   | **Client** | Yes | The SAP client ID to use for connecting to your SAP server |
   | **Authentication Type** | Yes | The authentication type to use for your connection, which must be **Basic** (username and password). To create an SNC connection, see [Enable Secure Network Communications (SNC)](logic-apps-using-sap-connector.md?tabs=single-tenant#enable-secure-network-communications). |
   | **SAP Username** | Yes | The username for your SAP server |
   | **SAP Password** | Yes | The password for your SAP server |
   | **Logon Type** | Yes | Select either **Application Server** or **Group** (Message Server), and then configure the corresponding required parameters, even though they appear optional: <br><br>**Application Server**: <br>- **AS Host**: The host name for your SAP Application Server <br>- **AS Service**: The service name or port number for your SAP Application Server <br>- **AS System Number**: Your SAP server's system number, which ranges from 00 to 99 <br><br>**Group**: <br>- **MS Server Host**: The host name for your SAP Message Server <br>- **MS Service Name or Port Number**: The service name or port number for your SAP Message Server <br>- **MS System ID**: The system ID for your SAP server <br>- **MS Logon Group**: The logon group for your SAP server |
   | **Safe Typing** | No | This option available for backward compatibility and only checks the string length. By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. Learn more about the [Safe Typing option](logic-apps-using-sap-connector.md#safe-typing). |
   | **Use SNC** | No | To create an SNC connection, see [Enable Secure Network Communications (SNC)](logic-apps-using-sap-connector.md?tabs=single-tenant#enable-secure-network-communications). |

   For other optional available connection parameters, see [Default connection information](/connectors/sap/#default-connection).

   After Azure Logic Apps sets up and tests your connection, the trigger information box appears.

1. Based on your SAP server configuration and scenario, provide the necessary parameter values for the [**When a message is received** trigger](/connectors/sap/#when-a-message-is-received), and add any other available trigger parameters that you want to use in your scenario.

   > [!NOTE]
   >
   > This SAP trigger is a webhook-based trigger, not a polling trigger, and doesn't include options to specify 
   > a polling schedule. For example, when you use the managed SAP connector with the on-premises data gateway, 
   > the trigger is called from the data gateway only when a message arrives, so no polling is necessary.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **GatewayHost** | Yes | The registration gateway host for the SAP RFC server |
   | **GatewayService** | Yes | The registration gateway service for the SAP RFC server |
   | **ProgramId** | Yes | The registration gateway program ID for the SAP RFC server |
   | **DegreeOfParallelism** | No | The number of calls to process in parallel. To add this parameter and change the value, in the trigger, from the **Add new parameter** list, select **DegreeOfParallelism**, and enter the new value. |
   | **SapActions** | No | Filter the messages that you receive from your SAP server based on a [list of SAP actions](#filter-with-sap-actions). To add this parameter, from the **Add new parameter** list, select **SapActions**. In the new **SapActions** section, for the **SapActions - 1** parameter, use the file picker to select an SAP action or manually specify an action. For more information about the SAP action, see [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations). |
   | **IDoc Format** | No | The format to use for receiving IDocs. To add this parameter, in the trigger, from the **Add new parameter** list, select **IDoc Format**. <br><br>- To receive IDocs as SAP plain XML, from the **IDoc Format** list, select **SapPlainXml**. <br><br>- To receive IDocs as a flat file, from the **IDoc Format** list, select **FlatFile**. <br><br>- **Note**: If you also use the [Flat File Decode action](logic-apps-enterprise-integration-flatfile.md) in your workflow, in your flat file schema, you have to use the **early_terminate_optional_fields** property and set the value to **true**. This requirement is necessary because the flat file IDoc data record that's sent by SAP on the tRFC call named `IDOC_INBOUND_ASYNCHRONOUS` isn't padded to the full SDATA field length. Azure Logic Apps provides the flat file IDoc original data without padding as received from SAP. Also, when you combine this SAP trigger with the Flat File Decode action, the schema that's provided to the action must match. |
   | **Receive IDOCS with unreleased segments** | No | Receive IDocs with or without unreleased segments. To add this parameter and change the value, in the trigger, from the **Add new parameter** list, select **Receive IDOCS with unreleased segements**, and select **Yes** or **No**. |
   | **SncPartnerNames** | No | Filter the messages that your receive from your SAP server based on a list of SNC partner names. To add this parameter, in the trigger, from the **Add new parameter** list, select **SncPartnerNames**, and enter each name separated by a vertical bar (**\|**). |

   > [!NOTE]
   >
   > The SAP managed connector parameters don't specify or save the language used for sending data to your SAP server. 
   > Instead, at both design time and run time, the connector uses your web browser's local language from each request 
   > that's sent to your server. 
   >
   > For example, if your browser is set to Portuguese, Azure Logic Apps creates and tests the SAP connection with 
   > Portuguese, but doesn't save the connection with that language. At run time, if no accept header is passed, 
   > by default, English is used.

   The following example shows a basically configured SAP managed trigger in a Consumption workflow:

   ![Screenshot shows basically configured SAP managed connector trigger in Consumption workflow.](./media/logic-apps-using-sap-connector/trigger-sap-consumption.png)

   The following example shows an SAP managed trigger where you can filter messages by selecting SAP actions:

   ![Screenshot shows selecting an SAP action to filter messages in a Consumption workflow.](./media/logic-apps-using-sap-connector/trigger-sap-select-action-consumption.png)

   Or, by manually specifying an action:

   ![Screenshot shows manually entering the SAP action to filter messages in a Consumption workflow.](./media/logic-apps-using-sap-connector/trigger-sap-manual-enter-action-consumption.png)

   The following example shows how the action appears when you set up the trigger to receive more than one message:

   ![Screenshot shows example trigger that receives multiple messages in a Consumption workflow.](./media/logic-apps-using-sap-connector/trigger-sap-multiple-message-consumption.png)

1. Save your workflow so you can start receiving messages from your SAP server. On the designer toolbar, select **Save**.

   Your workflow is now ready to receive messages from your SAP server.

1. After the trigger fires and your workflow runs, review the workflow's trigger history to confirm that trigger registration succeeded.

#### 500 Bad Gateway or 400 Bad Request error

If you receive a **500 Bad Gateway** or **400 Bad Request** error with a message similar to **service 'sapgw00' unknown**, the network service name resolution to port number is failing, for example:

```json
{
   "body": {
      "error": {
         "code": 500,
         "source": "EXAMPLE-FLOW-NAME.eastus.environments.microsoftazurelogicapps.net",
         "clientRequestId": "00000000-0000-0000-0000-000000000000",
         "message": "BadGateway",
         "innerError": {
            "error": {
               "code": "UnhandledException",
               "message": "\nERROR service 'sapgw00' unknown\nTIME Wed Nov 11 19:37:50 2020\nRELEASE 721\nCOMPONENT NI (network interface)\nVERSION 40\nRC -3\nMODULE ninti.c\nLINE 933\nDETAIL NiPGetServByName: 'sapgw00' not found\nSYSTEM CALL getaddrinfo\nCOUNTER 1\n\nRETURN CODE: 20"
            }
         }
      }
   }
}
```

* **Option 1:** In your API connection and trigger configuration, replace your gateway service name with its port number. In the example error, `sapgw00` needs to be replaced with a real port number, for example, `3300`. This is the only available option for ISE.

* **Option 2:** If you're using the on-premises data gateway, you can add the gateway service name to the port mapping in `%windir%\System32\drivers\etc\services` and then restart the on-premises data gateway service, for example:

  ```text
  sapgw00  3300/tcp
  ```

You might get a similar error when SAP Application server or Message server name resolves to the IP address. For ISE, you must specify the IP address for your SAP Application server or Message server. For the on-premises data gateway, you can instead add the name to the IP address mapping in `%windir%\System32\drivers\etc\hosts`, for example:

```text
10.0.1.9 SAPDBSERVER01 # SAP System Server VPN IP by computer name
10.0.1.9 SAPDBSERVER01.someguid.xx.xxxxxxx.cloudapp.net # SAP System Server VPN IP by fully qualified computer name
```

### [Single-tenant](#tab/single-tenant)

> [!NOTE]
>
> The preview SAP built-in trigger is available in the Azure portal, but currently, 
> the trigger can't receive calls from SAP when deployed in Azure. To fire the trigger, 
> you can run the workflow locally in Visual Studio Code. For more information, see 
> [Create a Standard logic app workflow in single-tenant Azure Logic Apps using Visual Studio Code](create-single-tenant-workflows-visual-studio-code.md).

1. In Visual Studio Code, open your Standard logic app and a blank workflow in the designer.

1. In the designer, [follow these general steps to find and add the SAP built-in trigger named **Register SAP RFC server for trigger**](create-workflow-with-trigger-or-action.md?tabs=standard#add-a-trigger-to-start-your-workflow).

   The SAP built-in trigger, **Register SAP RFC server for trigger**, is a webhook-based trigger, not a polling trigger, and doesn't include options to specify a polling schedule. The trigger is called only when a message arrives, so no polling is necessary.

1. If prompted, provide the following connection information for your on-premises SAP server. Otherwise, continue with the next step to set up your SAP trigger.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **Connection name** | Yes | Enter a name for the connection. |
   | **Client** | Yes | The SAP client ID to use for connecting to your SAP server |
   | **Authentication Type** | Yes | The authentication type to use for your connection. To create an SNC connection, see [Enable Secure Network Communications (SNC)](logic-apps-using-sap-connector.md?tabs=single-tenant#enable-secure-network-communications). |
   | **SAP Username** | Yes | The username for your SAP server |
   | **SAP Password** | Yes | The password for your SAP server |
   | **Logon Type** | Yes | Select either **Application Server** or **Group**, and then configure the corresponding required parameters, even though they appear optional: <br><br>**Application Server**: <br>- **Server Host**: The host name for your SAP Application Server <br>- **Service**: The service name or port number for your SAP Application Server <br>- **System Number**: Your SAP server's system number, which ranges from 00 to 99 <br><br>**Group**: <br>- **Server Host**: The host name for your SAP Message Server <br>- **Service Name or Port Number**: The service name or port number for your SAP Message Server <br>- **System ID**: The system ID for your SAP server <br>- **Logon Group**: The logon group for your SAP server |
   | **Language** | Yes | The language to use for sending data to your SAP server. The value is either **Default** (English) or one of the [permitted values](/azure/logic-apps/connectors/built-in/reference/sap/#parameters-21). **Note**: The SAP built-in connector saves this parameter value s part of the SAP connection parameters. |

1. When you're done, select **Create**.

   After Azure Logic Apps sets up and tests your connection, the SAP trigger information box appears.

1. Based on your SAP server configuration and scenario, provide the following trigger information, and add any available trigger parameters that you want to use in your scenario.

   | Parameter | Required | Description |
   |-----------|----------|-------------|
   | **IDoc Format** | Yes | The format to use for receiving IDocs. <br><br>- To receive IDocs as SAP plain XML, from the **IDoc Format** list, select **SapPlainXml**. <br><br>- To receive IDocs as a flat file, from the **IDoc Format** list, select **FlatFile**. <br><br>- **Note**: If you also use the [Flat File Decode action](logic-apps-enterprise-integration-flatfile.md) in your workflow, in your flat file schema, you have to use the **early_terminate_optional_fields** property and set the value to **true**. This requirement is necessary because the flat file IDoc data record that's sent by SAP on the tRFC call named `IDOC_INBOUND_ASYNCHRONOUS` isn't padded to the full SDATA field length. Azure Logic Apps provides the flat file IDoc original data without padding as received from SAP. Also, when you combine this SAP trigger with the Flat File Decode action, the schema that's provided to the action must match. |
   | **SAP RFC Server Degree of Parallelism** | Yes | The number of calls to process in parallel |
   | **Allow Unreleased Segment** | Yes | Receive IDocs with or without unreleased segments. From the list, select **Yes** or **No**. |
   | **SAP Gateway Host** | Yes | The registration gateway host for the SAP RFC server |
   | **SAP Gateway Service** | Yes | The registration gateway service for the SAP RFC server |
   | **SAP RFC Server Program ID** | Yes | The registration gateway program ID for the SAP RFC server |
   | **SAP SNC Partner Names** | No | Filter the messages that your receive from your SAP server based on a list of SNC partner names. To add this parameter, from the **Add new parameter** list, select **SncPartnerNames**, and enter each name separated by a vertical bar (**\|**). |

1. Save your workflow so you can start receiving messages from your SAP server. On the designer toolbar, select **Save**.

   Your workflow is now ready to receive messages from your SAP server.

1. In your workflow's trigger history, check that the trigger registration succeeds.

---

## Receive IDoc packets from SAP

To receive IDoc packets, which are batches or groups of IDocs, the SAP trigger doesn't need extra configuration. However, to process each item in an IDoc packet after the trigger receives the packet, you have to implement a few more steps to split the packet into individual IDocs by setting up SAP to [send IDocs in packets](https://help.sap.com/viewer/8f3819b0c24149b5959ab31070b64058/7.4.16/4ab38886549a6d8ce10000000a42189c.html). 

The following example workflow shows how to extract individual IDocs from a packet by using the [`xpath()` function](./workflow-definition-language-functions-reference.md#xpath):

1. Before you start, you need a Consumption or Standard logic app workflow with an SAP trigger. If your workflow doesn't already start with this trigger, follow the previous steps in this guide to [set up a logic app workflow with an SAP trigger](#receive-message-sap).

   > [!IMPORTANT]
   >
   > The SAP **Program ID** is case-sensitive. Make sure you consistently use the same case format for your **Program ID** 
   > when you configure your logic app workflow and SAP server. Otherwise, you might receive the following errors in the 
   > tRFC Monitor (T-Code SM58) when you attempt to send an IDoc to SAP:
   >
   > * **Function IDOC_INBOUND_ASYNCHRONOUS not found**
   > * **Non-ABAP RFC client (partner type) not supported**
   >
   > For more information from SAP, review the following notes (login required) 
   > [https://launchpad.support.sap.com/#/notes/2399329](https://launchpad.support.sap.com/#/notes/2399329) 
   > and [https://launchpad.support.sap.com/#/notes/353597](https://launchpad.support.sap.com/#/notes/353597).

1. To immediately reply with the status of your SAP request, [add a Response action to your logic app workflow](../connectors/connectors-native-reqres.md#add-a-response-action).

   As a best practice, add this action immediately after your trigger to free up the communication channel with your SAP server. In Response action, use one of the following status codes (`statusCode`):

   | Status code | Description |
   |-------------|-------------|
   | **200 OK** | This status code always contains a payload, even if the server generates a payload body of zero length. |
   | **202 Accepted** | The request was accepted for processing, but processing isn't complete yet. |
   | **204 No Content** | The server successfully fulfilled the request, and there's no additional content to send in the response payload body. |

1. Get the root namespace from the XML IDoc that your logic app workflow receives from SAP. To extract this namespace from the XML document, add a step that creates a local string variable and stores that namespace by using an `xpath()` expression:

   `xpath(xml(triggerBody()?['Content']), 'namespace-uri(/*)')`

   ![Screenshot that shows getting the root namespace from IDoc.](./media/logic-apps-using-sap-connector/get-namespace.png)

1. To extract an individual IDoc, add a step that creates an array variable and stores the IDoc collection by using another `xpath()` expression:

   `xpath(xml(triggerBody()?['Content']), '/*[local-name()="Receive"]/*[local-name()="idocData"]')`

   ![Screenshot that shows getting an array of items.](./media/logic-apps-using-sap-connector/get-array.png)

   The array variable makes each IDoc available for your logic app workflow to process individually by enumerating over the collection. In this example, the logic app workflow transfers each IDoc to an SFTP server by using a loop:

   ![Screenshot that shows sending an IDoc to an SFTP server.](./media/logic-apps-using-sap-connector/loop-batch.png)

   Each IDoc must include the root namespace, which is the reason why the file content is wrapped inside a `<Receive></Receive>` element along with the root namespace before sending the IDoc to the downstream app, or SFTP server in this case.

You can use the quickstart template for this pattern by selecting this template in the workflow designer when you create a new logic app workflow.

![Screenshot that shows selecting a batch logic app template.](./media/logic-apps-using-sap-connector/select-batch-logic-app-template.png)

---

## Send IDoc messages to SAP server

To create a logic app workflow that sends an IDoc message to an SAP server and returns a response, follow these examples:

1. [Create a logic app workflow that's triggered by an HTTP request.](#add-request-trigger)
1. [Add an SAP action to your workflow that sends a message to SAP.](#add-sap-action-send-message)
1. [Add a Response action to your workflow.](#add-response-action)
1. [Create a remote function call (RFC) request-response pattern, if you're using an RFC to receive replies from SAP ABAP.](#create-rfc-request-response)
1. [Test your workflow.](#test-your-workflow)

<a name="add-request-trigger"></a>

### Add the Request trigger

To have your workflow receive IDocs from SAP over XML HTTP, you can use the [Request trigger](../connectors/connectors-native-reqres.md). To receive IDocs over Common Programming Interface Communication (CPIC) as plain XML or as a flat file, review the section, [Receive message from SAP](#receive-message-sap).

This section continues with the Request trigger, so first, create a workflow with an endpoint where your SAP server can send HTTP *POST* requests to your workflow. When your workflow receives these requests, the trigger fires and runs the next step in your workflow.

1. In the [Azure portal](https://portal.azure.com), create a logic app resource and a blank workflow, which opens the designer.

1. On the designer, under the search box, select **Built-in**. In the search box, enter **http request**. 

1. From the triggers list, select the Request trigger named **When a HTTP request is received**.

   ![Screenshot that shows the Consumption workflow designer and selected Request trigger.](./media/logic-apps-using-sap-connector/add-request-trigger-consumption.png)

1. Save your workflow. On the designer toolbar, select **Save**.

   This step generates an endpoint URL, which hat can receive requests that now appears in your trigger.

   ![Screenshot that shows the workflow designer with the Request trigger with generated POST URL being copied.](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

<a name="add-sap-action-send-message"></a>

### Add an SAP action to send message

Next, create an action to send your IDoc message to SAP when your Request trigger fires. By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](logic-apps-using-sap-connector.md#safe-typing).

Based on your logic app type, follow the corresponding steps:

### [Multi-tenant](#tab/multi-tenant)

1. In the workflow designer, under the trigger, select **New step**.

1. Under the **Choose an operation** search box, select **Enterprise**. In the search box, enter **send message sap**. From the actions list, select the SAP action named **Send message to SAP**.

   ![Screenshot that shows the workflow designer with the selected "Send message to SAP" action under Enterprise tab.](./media/logic-apps-using-sap-connector/sap-send-message-consumption.png)

1. If your connection already exists, continue to the next step. Otherwise, provide the following connection information for your on-premises SAP server:

   1. Provide a name for the connection.

   1. If you're using the data gateway, follow these steps:

      1. In the **Data Gateway** section, under **Subscription**, first select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation.

      1. Under **Connection Gateway**, select your data gateway resource in Azure.

   1. For the **Logon Type** property, follow the step based on whether the property is set to **Application Server** or **Group**.

      * For **Application Server**, these properties, which usually appear optional, are required:

        ![Screenshot that shows how to create SAP Application server connection.](./media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png)

      * For **Group**, these properties, which usually appear optional, are required:

        ![Screenshot that shows how to create SAP Message server connection.](./media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)

        In the SAP server, the Logon Group is maintained by opening the **CCMS: Maintain Logon Groups** (T-Code SMLG) dialog box. For more information, review [SAP Note 26317 - Set up for LOGON group for automatic load balancing](https://service.sap.com/sap/support/notes/26317).

      By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](logic-apps-using-sap-connector.md#safe-typing).

   1. When you're finished, select **Create**.

      Azure Logic Apps sets up and tests your connection to make sure that the connection works properly.

      > [!NOTE]
      > If you receive the following error, there is a problem with your installation of the SAP NCo client library: 
      >
      > **Test connection failed. Error 'Failed to process request. Error details: 'could not load file or assembly 'sapnco, Version=3.0.0.42, Culture=neutral, PublicKeyToken 50436dca5c7f7d23' or one of its dependencies. The system cannot find the file specified.'.'**
      >
      > Make sure to [install the required version of the SAP NCo client library and meet all other prerequisites](logic-apps-using-sap-connector.md#sap-client-library-prerequisites).

1. Now find and select an action from your SAP server.

   1. In the **SAP Action** box, select the folder icon. From the file list, find and select the SAP Message you want to use. To navigate the list, use the arrows.

      This example selects an IDoc with the **Orders** type.

      ![Screenshot that shows finding and selecting an IDoc action.](./media/logic-apps-using-sap-connector/SAP-app-server-find-action.png)

      If you can't find the action you want, you can manually enter a path, for example:

      ![Screenshot that shows manually providing a path to an IDoc action.](./media/logic-apps-using-sap-connector/SAP-app-server-manually-enter-action.png)

      > [!TIP]
      > Provide the value for **SAP Action** through the expression editor. 
      > That way, you can use the same action for different message types.

      For more information about IDoc operations, review [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

   1. Click inside the **Input Message** box so that the dynamic content list appears. From that list, under **When a HTTP request is received**, select the **Body** field.

      This step includes the body content from your Request trigger and sends that output to your SAP server.

      ![Screenshot that shows selecting the "Body" property in the Request trigger.](./media/logic-apps-using-sap-connector/SAP-app-server-action-select-body.png)

      When you're finished, your SAP action looks like this example:

      ![Screenshot that shows completing the SAP action.](./media/logic-apps-using-sap-connector/SAP-app-server-complete-action.png)

1. Save your workflow. On the designer toolbar, select **Save**.

---

### Send flat file IDocs

You can use IDocs with a flat file schema if you wrap them in an XML envelope. To send a flat file IDoc, use the generic instructions to [add an SAP action to send your IDoc message](#add-an-sap-action-to-send-message), but with the following changes:

1. In the **Send message to SAP** action, use the following URI:

   **`http://Microsoft.LobServices.Sap/2007/03/Idoc/SendIdoc`**

1. Format your input message with an XML envelope.

For example, review the following example XML payload:

```xml
<SendIdoc xmlns="http://Microsoft.LobServices.Sap/2007/03/Idoc/">
  <idocData>EDI_DC 3000000001017945375750 30INVOIC011BTSVLINV30KUABCABCFPPC LDCA X004010810 4 SAPMSX LSEDI ABCABCFPPC 000d3ae4-723e-1edb-9ca4-cc017365c9fd 20210217054521INVOICINVOIC01ZINVOIC2RE 20210217054520
E2EDK010013000000001017945375000001E2EDK01001000000010 ABCABC1.00000 0060 INVO9988298128 298.000 298.000 LB Z4LR EN 0005065828 L
E2EDKA1 3000000001017945375000002E2EDKA1 000000020 RS ABCABCFPPC 0005065828 ABCABCABC ABCABC Inc. Limited Risk Distributor ABCABC 1950 ABCABCABCA Blvd ABCABAABCAB L5N8L9 CA ABCABC E ON V-ABCABC LDCA
E2EDKA1 3000000001017945375000003E2EDKA1 000000020 AG 0005065828 ABCABCFPPC ABCABC ABCABC ABCABC - FPP ONLY 88 ABCABC Crescent ABCABAABCAB L5R 4A2 CA ABCABC 111 111 1111 E ON ABCABCFPPC EN
E2EDKA1 3000000001017945375000004E2EDKA1 000000020 RE 0005065828 ABCABCFPPC ABCABC ABCABC ABCABC - FPP ONLY 88 ABCABC Crescent ABCABAABCAB L5R 4A2 CA ABCABC 111 111 1111 E ON ABCABCFPPC EN
E2EDKA1 3000000001017945375000005E2EDKA1 000000020 RG 0005065828 ABCABCFPPC ABCABC ABCABC ABCABC - FPP ONLY 88 ABCABC Crescent ABCABAABCAB L5R 4A2 CA ABCABC 111 111 1111 E ON ABCABCFPPC EN
E2EDKA1 3000000001017945375000006E2EDKA1 000000020 WE 0005001847 41 ABCABC ABCABC INC (ABCABC) DC A. ABCABCAB 88 ABCABC CRESCENT ABCABAABCAB L5R 4A2 CA ABCABC 111-111-1111 E ON ABCABCFPPC EN
E2EDKA1 3000000001017945375000007E2EDKA1 000000020 Z3 0005533050 ABCABCABC ABCABC Inc. ABCA Bank Swift Code -ABCABCABCAB Sort Code - 1950 ABCABCABCA Blvd. Acc No -1111111111 ABCABAABCAB L5N8L9 CA ABCABC E ON ABCABCFPPC EN
E2EDKA1 3000000001017945375000008E2EDKA1 000000020 BK 1075 ABCABCABC ABCABC Inc 1950 ABCABCABCA Blvd ABCABAABCAB ON L5N 8L9 CA ABCABC (111) 111-1111 (111) 111-1111 ON
E2EDKA1 3000000001017945375000009E2EDKA1 000000020 CR 1075 CONTACT ABCABCABC 1950 ABCABCABCA Blvd ABCABAABCAB ON L5N 8L9 CA ABCABC (111) 111-1111 (111) 111-1111 ON
E2EDK02 3000000001017945375000010E2EDK02 000000020 0099988298128 20210217
E2EDK02 3000000001017945375000011E2EDK02 000000020 00140-N6260-S 20210205
E2EDK02 3000000001017945375000012E2EDK02 000000020 0026336270425 20210217
E2EDK02 3000000001017945375000013E2EDK02 000000020 0128026580537 20210224
E2EDK02 3000000001017945375000014E2EDK02 000000020 01740-N6260-S
E2EDK02 3000000001017945375000015E2EDK02 000000020 900IAC
E2EDK02 3000000001017945375000016E2EDK02 000000020 901ZSH
E2EDK02 3000000001017945375000017E2EDK02 000000020 9078026580537 20210217
E2EDK03 3000000001017945375000018E2EDK03 000000020 02620210217
E2EDK03 3000000001017945375000019E2EDK03 000000020 00120210224
E2EDK03 3000000001017945375000020E2EDK03 000000020 02220210205
E2EDK03 3000000001017945375000021E2EDK03 000000020 01220210217
E2EDK03 3000000001017945375000022E2EDK03 000000020 01120210217
E2EDK03 3000000001017945375000023E2EDK03 000000020 02420210217
E2EDK03 3000000001017945375000024E2EDK03 000000020 02820210418
E2EDK03 3000000001017945375000025E2EDK03 000000020 04820210217
E2EDK17 3000000001017945375000026E2EDK17 000000020 001DDPDelivered Duty Paid
E2EDK17 3000000001017945375000027E2EDK17 000000020 002DDPdestination
E2EDK18 3000000001017945375000028E2EDK18 000000020 00160 0 Up to 04/18/2021 without deduction
E2EDK28 3000000001017945375000029E2EDK28 000000020 CA BOFACATT Bank of ABCABAB ABCABC ABCABAB 50127217 ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000030E2EDK28 000000020 CA 026000082 ABCAbank ABCABC ABCABAB 201456700OLD ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000031E2EDK28 000000020 GB ABCAGB2L ABCAbank N.A ABCABA E14, 5LB GB63ABCA18500803115593 ABCABCABC ABCABC Inc. GB63ABCA18500803115593
E2EDK28 3000000001017945375000032E2EDK28 000000020 CA 020012328 ABCABANK ABCABC ABCABAB ON M5J 2M3 2014567007 ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000033E2EDK28 000000020 CA 03722010 ABCABABC ABCABABC Bank of Commerce ABCABAABCAB 64-04812 ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000034E2EDK28 000000020 IE IHCC In-House Cash Center IHCC1075 ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000035E2EDK28 000000020 CA 000300002 ABCAB Bank of ABCABC ABCABAB 0021520584OLD ABCABCABC ABCABC Inc.
E2EDK28 3000000001017945375000036E2EDK28 000000020 US USCC US Cash Center (IHC) city USCC1075 ABCABCABC ABCABC Inc.
E2EDK29 3000000001017945375000037E2EDK29 000000020 0064848944US A CAD CA ABCABC CA United States US CA A Air Air
E2EDKT1 3000000001017945375000038E2EDKT1 000000020 ZJ32E EN
E2EDKT2 3000000001017945375000039E2EDKT2 000038030 GST/HST877845941RT0001 *
E2EDKT2 3000000001017945375000040E2EDKT2 000038030 QST1021036966TQ0001 *
E2EDKT1 3000000001017945375000041E2EDKT1 000000020 Z4VL
E2EDKT2 3000000001017945375000042E2EDKT2 000041030 0.000 *
E2EDKT1 3000000001017945375000043E2EDKT1 000000020 Z4VH
E2EDKT2 3000000001017945375000044E2EDKT2 000043030 *
E2EDK14 3000000001017945375000045E2EDK14 000000020 008LDCA
E2EDK14 3000000001017945375000046E2EDK14 000000020 00710
E2EDK14 3000000001017945375000047E2EDK14 000000020 00610
E2EDK14 3000000001017945375000048E2EDK14 000000020 015Z4F2
E2EDK14 3000000001017945375000049E2EDK14 000000020 0031075
E2EDK14 3000000001017945375000050E2EDK14 000000020 021M
E2EDK14 3000000001017945375000051E2EDK14 000000020 0161075
E2EDK14 3000000001017945375000052E2EDK14 000000020 962M
E2EDP010013000000001017945375000053E2EDP01001000000020 000011 2980.000 EA 298.000 LB MOUSE 298.000 Z4TN 4260
E2EDP02 3000000001017945375000054E2EDP02 000053030 00140-N6260-S 00000120210205 DFUE
E2EDP02 3000000001017945375000055E2EDP02 000053030 0026336270425 00001120210217
E2EDP02 3000000001017945375000056E2EDP02 000053030 0168026580537 00001020210224
E2EDP02 3000000001017945375000057E2EDP02 000053030 9100000 00000120210205 DFUE
E2EDP02 3000000001017945375000058E2EDP02 000053030 911A 00000120210205 DFUE
E2EDP02 3000000001017945375000059E2EDP02 000053030 912PP 00000120210205 DFUE
E2EDP02 3000000001017945375000060E2EDP02 000053030 91300 00000120210205 DFUE
E2EDP02 3000000001017945375000061E2EDP02 000053030 914CONTACT ABCABCABC 00000120210205 DFUE
E2EDP02 3000000001017945375000062E2EDP02 000053030 963 00000120210205 DFUE
E2EDP02 3000000001017945375000063E2EDP02 000053030 965 00000120210205 DFUE
E2EDP02 3000000001017945375000064E2EDP02 000053030 9666336270425 00000120210205 DFUE
E2EDP02 3000000001017945375000065E2EDP02 000053030 9078026580537 00001020210205 DFUE
E2EDP03 3000000001017945375000066E2EDP03 000053030 02920210217
E2EDP03 3000000001017945375000067E2EDP03 000053030 00120210224
E2EDP03 3000000001017945375000068E2EDP03 000053030 01120210217
E2EDP03 3000000001017945375000069E2EDP03 000053030 02520210217
E2EDP03 3000000001017945375000070E2EDP03 000053030 02720210217
E2EDP03 3000000001017945375000071E2EDP03 000053030 02320210217
E2EDP03 3000000001017945375000072E2EDP03 000053030 02220210205
E2EDP19 3000000001017945375000073E2EDP19 000053030 001418VVZ
E2EDP19 3000000001017945375000074E2EDP19 000053030 002RJR-00001 AB ABCABCABC Mouse FORBUS BLUETOOTH
E2EDP19 3000000001017945375000075E2EDP19 000053030 0078471609000
E2EDP19 3000000001017945375000076E2EDP19 000053030 003889842532685
E2EDP19 3000000001017945375000077E2EDP19 000053030 011CN
E2EDP26 3000000001017945375000078E2EDP26 000053030 00459064.20
E2EDP26 3000000001017945375000079E2EDP26 000053030 00352269.20
E2EDP26 3000000001017945375000080E2EDP26 000053030 01052269.20
E2EDP26 3000000001017945375000081E2EDP26 000053030 01152269.20
E2EDP26 3000000001017945375000082E2EDP26 000053030 0126795.00
E2EDP26 3000000001017945375000083E2EDP26 000053030 01552269.20
E2EDP26 3000000001017945375000084E2EDP26 000053030 00117.54
E2EDP26 3000000001017945375000085E2EDP26 000053030 00252269.20
E2EDP26 3000000001017945375000086E2EDP26 000053030 940 2980.000
E2EDP26 3000000001017945375000087E2EDP26 000053030 939 2980.000
E2EDP05 3000000001017945375000088E2EDP05 000053030 + Z400MS List Price 52269.20 17.54 1 EA CAD 2980
E2EDP05 3000000001017945375000089E2EDP05 000053030 + XR1 Tax Jur Code Level 6795.00 13.000 52269.20
E2EDP05 3000000001017945375000090E2EDP05 000053030 + Tax Subtotal1 6795.00 2.28 1 EA CAD 2980
E2EDP05 3000000001017945375000091E2EDP05 000053030 + Taxable Amount + TaxSubtotal1 59064.20 19.82 1 EA CAD 2980
E2EDP04 3000000001017945375000092E2EDP04 000053030 CX 13.000 6795.00 7000000000
E2EDP04 3000000001017945375000093E2EDP04 000053030 CX 0 0 7001500000
E2EDP04 3000000001017945375000094E2EDP04 000053030 CX 0 0 7001505690
E2EDP28 3000000001017945375000095E2EDP28 000053030 00648489440000108471609000 CN CN ABCAB ZZ 298.000 298.000 LB US 400 United Stat KY
E2EDPT1 3000000001017945375000096E2EDPT1 000053030 0001E EN
E2EDPT2 3000000001017945375000097E2EDPT2 000096040 AB ABCABCABC Mouse forBus Bluetooth EN/XC/XD/XX Hdwr Black For Bsnss *
E2EDS01 3000000001017945375000098E2EDS01 000000020 0011
E2EDS01 3000000001017945375000099E2EDS01 000000020 01259064.20 CAD
E2EDS01 3000000001017945375000100E2EDS01 000000020 0056795.00 CAD
E2EDS01 3000000001017945375000101E2EDS01 000000020 01159064.20 CAD
E2EDS01 3000000001017945375000102E2EDS01 000000020 01052269.20 CAD
E2EDS01 3000000001017945375000103E2EDS01 000000020 94200000 CAD
E2EDS01 3000000001017945375000104E2EDS01 000000020 9440.00 CAD
E2EDS01 3000000001017945375000105E2EDS01 000000020 9450.00 CAD
E2EDS01 3000000001017945375000106E2EDS01 000000020 94659064.20 CAD
E2EDS01 3000000001017945375000107E2EDS01 000000020 94752269.20 CAD
E2EDS01 3000000001017945375000108E2EDS01 000000020 EXT
Z2XSK010003000000001017945375000109Z2XSK01000000108030 Z400 52269.20
Z2XSK010003000000001017945375000110Z2XSK01000000108030 XR1 13.000 6795.00 CX
</idocData>
</SendIdoc>
```

<a name="add-response-action"></a>

### Add a Response action

Now, add the Response action to your workflow and include the output from the SAP action. That way, your workflow returns the results from your SAP server to the original requestor.

### [Multi-tenant](#tab/multi-tenant)

1. In the workflow designer, under the SAP action, select **New step**.

1. Under the **Choose an operation** search box, select **Built-in**. In the search box, enter **response**.

1. From the actions list, select the action named **Response**.

1. In the **Response** action, select inside the **Body** box so that the dynamic content list appears. From that list, under **Send message to SAP**, select the **Body** field.

   ![Screenshot showing finishing the SAP action for Consumption or ISE workflow.](./media/logic-apps-using-sap-connector/response-action-select-sap-body-consumption.png)

1. Save your workflow.

### [Single-tenant](#tab/single-tenant)

1. In the workflow designer, under the SAP action, select the plus sign (**+**) > **Add an action**.

1. Under the **Choose an operation** search box, select **Built-in**. In the search box, enter **response**.

1. In the **Add an action** pane, from the actions list, select the action named **Response**.

1. In the **Response** action pane, select inside the **Body** box so that the dynamic content list appears. From that list, under **Send message to SAP**, select the **Body** field.

   ![Screenshot showing finishing the SAP action for Standard workflow.](./media/logic-apps-using-sap-connector/response-action-select-sap-body-standard.png)

1. Save your workflow.

#### Create RFC request-response

You must create a request and response pattern if you need to receive replies by using a remote function call (RFC) to Azure Logic Apps from SAP ABAP. To receive IDocs in your logic app workflow, you should make the workflow's first action a [Response action](../connectors/connectors-native-reqres.md#add-a-response-action) with a status code of `200 OK` and no content. This recommended step completes the SAP Logical Unit of Work (LUW) asynchronous transfer over tRFC immediately, which leaves the SAP CPIC conversation available again. You can then add further actions in your logic app workflow to process the received IDoc without blocking further transfers.

> [!NOTE]
> The SAP trigger receives IDocs over tRFC, which doesn't have a response parameter by design.

To implement a request and response pattern, you must first discover the RFC schema using the [`generate schema` command](#generate-schemas-for-artifacts-in-sap). The generated schema has two possible root nodes: 

* The request node, which is the call that you receive from SAP.
* The response node, which is your reply back to SAP.

In the following example, a request and response pattern is generated from the `STFC_CONNECTION` RFC module. The request XML is parsed to extract a node value in which SAP requests `<ECHOTEXT>`. The response inserts the current timestamp as a dynamic value. You receive a similar response when you send a `STFC_CONNECTION` RFC from a logic app workflow to SAP.

```xml
<STFC_CONNECTIONResponse xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
  <ECHOTEXT>@{first(xpath(xml(triggerBody()?['Content']), '/*[local-name()="STFC_CONNECTION"]/*[local-name()="REQUTEXT"]/text()'))}</ECHOTEXT>
  <RESPTEXT>Azure Logic Apps @{utcNow()}</RESPTEXT>
</STFC_CONNECTIONResponse>
```

### Test your workflow

1. If your logic app resource isn't already enabled, on your logic app menu, select **Overview**. On the toolbar, select **Enable**.

1. On the designer toolbar, select **Run Trigger** > **Run**. This step manually starts your workflow.

1. Trigger your workflow by sending an HTTP POST request to the URL in your Request trigger. Include your message content with your request. To the send the request, you can use a tool such as [Postman](https://www.getpostman.com/apps).

   For this article, the request sends an IDoc file, which must be in XML format and include the namespace for the SAP action you're using, for example:

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <Send xmlns="http://Microsoft.LobServices.Sap/2007/03/Idoc/2/ORDERS05//720/Send">
     <idocData>
       <...>
     </idocData>
   </Send>
   ```

1. After you send your HTTP request, wait for the response from your workflow.

   > [!NOTE]
   >
   > Your workflow might time out if all the steps required for the response don't finish within the [request timeout limit](logic-apps-limits-and-config.md). 
   > If this condition happens, requests might get blocked. To help you diagnose problems, learn how you can [check and monitor your logic apps](monitor-logic-apps.md).

You've now created a workflow that can communicate with your SAP server. Now that you've set up an SAP connection for your workflow, you can explore other available SAP actions, such as BAPI and RFC.

### [Standard](#tab/standard)

On the designer, make sure that **Choose an operation** is selected. Under the search box, select **Built-in**. In the search box, enter **http request**. From the triggers list, select the Request trigger named **When a HTTP request is received**.

![Screenshot that shows the Standard workflow designer and selected Request trigger.](./media/logic-apps-using-sap-connector/add-request-trigger-standard.png)

---

<a name="filter-with-sap-actions"></a>

## Filter messages with SAP actions

You can optionally filter the messages that your logic app workflow receives from your SAP server by providing a list, or array, with a single or multiple SAP actions. By default, this array is empty, which means that your logic app receives all the messages from your SAP server without filtering.

When you set up the array filter, the trigger only receives messages from the specified SAP action types and rejects all other messages from your SAP server. However, this filter doesn't affect whether the typing of the received payload is weak or strong.

Any SAP action filtering happens at the level of the SAP Adapter for your on-premises data gateway. For more information, review [how to send test IDocs to Azure Logic Apps from SAP](#test-sending-idocs-from-sap).

If you can't send IDoc packets from SAP to your logic app workflow's trigger, review the Transactional RFC (tRFC) call rejection message in the SAP tRFC (T-Code SM58) dialog box. In the SAP interface, you might get the following error messages, which are clipped due to the substring limits on the **Status Text** field.

#### The RequestContext on the IReplyChannel was closed without a reply being sent

This error message means unexpected failures happen when the catch-all handler for the channel terminates the channel due to an error, and rebuilds the channel to process other messages.

To acknowledge that your logic app workflow received the IDoc, [add a Response action](../connectors/connectors-native-reqres.md#add-a-response-action) that returns a `200 OK` status code. Leave the body empty and don't change or add to the headers. The IDoc is transported through tRFC, which doesn't allow for a response payload.

To reject the IDoc instead, respond with any HTTP status code other than `200 OK`. The SAP Adapter then returns an exception back to SAP on your behalf. You should only reject the IDoc to signal transport errors back to SAP, such as a misrouted IDoc that your application can't process. You shouldn't reject an IDoc for application-level errors, such as issues with the data contained in the IDoc. If you delay transport acceptance for application-level validation, you might experience negative performance due to blocking your connection from transporting other IDocs.

If you're receiving this error message and experience systemic failures calling Azure Logic Apps, check that you've configured the network settings for your on-premises data gateway service for your specific environment. For example, if your network environment requires the use of a proxy to call Azure endpoints, you need to configure your on-premises data gateway service to use your proxy. For more information, review [Proxy Configuration](/dotnet/framework/network-programming/proxy-configuration).

If you're receiving this error message and experience intermittent failures calling Azure Logic Apps, you might need to increase your retry count or also retry interval.

1. Check SAP settings in your on-premises data gateway service configuration file, `Microsoft.PowerBI.EnterpriseGateway.exe.config`.

   1. Under the `configuration` root node, add a `configSections` element, if none exists.
   1. Under the `configSections` node, add a `section` element with the following attributes, if none exist: `name="SapAdapterSection" type="Microsoft.Adapters.SAP.Common.SapAdapterSection, Microsoft.Adapters.SAP.Common"`

      > [!IMPORTANT]
      > Don't change the attributes in existing `section` elements, if such elements already exist.

      Your `configSections` element looks like the following version, if no other section or section group is declared in the gateway service configuration:

      ```xml
      <configSections>
        <section name="SapAdapterSection" type="Microsoft.Adapters.SAP.Common.SapAdapterSection, Microsoft.Adapters.SAP.Common"/>
      </configSections>
      ```

   1. Under the `configuration` root node, add an `SapAdapterSection` element, if none exists.
   1. Under the `SapAdapterSection` node, add a `Broker` element with the following attributes, if none exist: `WebhookRetryDefaultDelay="00:00:00.10" WebhookRetryMaximumCount="2"`

      > [!IMPORTANT]
      > Change the attributes for the `Broker` element, even if the element already exists.

      The `SapAdapterSection` element looks like the following version, if no other element or attribute is declared in the SAP adapter configuration:

      ```xml
      <SapAdapterSection>
        <Broker WebhookRetryDefaultDelay="00:00:00.10" WebhookRetryMaximumCount="2" />
      </SapAdapterSection>
      ```

      The retry count setting looks like `WebhookRetryMaximumCount="2"`. The retry interval setting looks like `WebhookRetryDefaultDelay="00:00:00.10"` where the timespan format is `HH:mm:ss.ff`.

   > [!NOTE]
   > For more information about the configuration file,
   > review [Configuration file schema for .NET Framework](/dotnet/framework/configure-apps/file-schema/).

1. Save your changes. Restart your on-premises data gateway.

#### The segment or group definition E2EDK36001 was not found in the IDoc meta

This error message means expected failures happen with other errors. For example, the failure to generate an IDoc XML payload because its segments aren't released by SAP. As a result, the segment type metadata required for conversion is missing.

To have these segments released by SAP, contact the ABAP engineer for your SAP system.

## Set up asynchronous request-reply pattern for triggers

The SAP connector supports Azure's [asynchronous request-reply pattern](/azure/architecture/patterns/async-request-reply) for Azure Logic Apps triggers. You can use this pattern to create successful requests that would have otherwise failed with the default synchronous request-reply pattern.

> [!TIP]
> In logic app workflows that have multiple response actions, all response actions must use the same request-reply pattern. 
> For example, if your logic app workflow uses a switch control with multiple possible response actions, you must configure 
> all the response actions to use the same request-reply pattern, either synchronous or asynchronous.

If you enable asynchronous response for your response action, your logic app workflow can respond with a `202 Accepted` reply after accepting a request for processing. The reply contains a location header that you can use to retrieve the final state of your request.

To configure an asynchronous request-reply pattern for your logic app workflow using the SAP connector, follow these steps:

1. Open your logic app in the workflow designer.

1. Confirm that the SAP connector is the trigger for your logic app workflow.

1. Open your logic app workflow's **Response** action. In the action's title bar, select the menu (**...**) &gt; **Settings**.

1. In the **Settings** for your response action, turn on the toggle under **Asynchronous Response**. Select done.

1. Save the changes to your logic app workflow.

## Find extended error logs

For full error messages, check your SAP Adapter's extended logs. You can also [enable an extended log file for the SAP connector](#extended-sap-logging-in-on-premises-data-gateway).

* For on-premises data gateway releases from April 2020 and earlier, logs are disabled by default.

* For on-premises data gateway releases from June 2020 and later, you can [enable gateway logs in the app settings](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app).

  * The default logging level is **Warning**.

  * If you enable  **Additional logging** in the **Diagnostics** settings of the on-premises data gateway app, the logging level is increased to **Informational**.

  * To increase the logging level to **Verbose**, update the following setting in your configuration file. Typically, the configuration file is located at `C:\Program Files\On-premises data gateway\Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config`.

    ```xml
    <setting name="SapTraceLevel" serializeAs="String">
       <value>Verbose</value>
    </setting>
    ```

### Extended SAP logging in on-premises data gateway

If you use an [on-premises data gateway for Azure Logic Apps](logic-apps-gateway-install.md), you can configure an extended log file for the SAP connector. You can use your on-premises data gateway to redirect Event Tracing for Windows (ETW) events into rotating log files that are included in your gateway's logging .zip files.

You can [export all of your gateway's configuration and service logs](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app) to a .zip file in from the gateway app's settings.

> [!NOTE]
> Extended logging might affect your logic app workflow's performance when always enabled. As a best practice, 
> turn off extended log files after you're finished with analyzing and troubleshooting an issue.

#### Capture ETW events

Optionally, advanced users can capture ETW events directly. You can then [consume your data in Azure Diagnostics in Event Hubs](../azure-monitor/agents/diagnostics-extension-stream-event-hubs.md) or [collect your data to Azure Monitor Logs](../azure-monitor/agents/diagnostics-extension-logs.md). For more information, review the [best practices for collecting and storing data](/azure/architecture/best-practices/monitoring#collecting-and-storing-data). You can use [PerfView](https://github.com/Microsoft/perfview/blob/master/README.md) to work with the resulting ETL files, or you can write your own program. This walkthrough uses PerfView:

1. In the PerfView menu, select **Collect** &gt; **Collect** to capture the events.

1. In the **Additional Provider** field, enter `*Microsoft-LobAdapter` to specify the SAP provider to capture SAP Adapter events. If you don't specify this information, your trace only includes general ETW events.

1. Keep the other default settings. If you want, you can change the file name or location in the **Data File** field.

1. Select **Start Collection** to begin your trace.

1. After you've reproduced your issue or collected enough analysis data, select **Stop Collection**.

1. To share your data with another party, such as Azure support engineers, compress the ETL file.

1. To view the content of your trace:

   1. In PerfView, select **File** &gt; **Open** and select the ETL file you just generated.

   1. In the PerfView sidebar, the **Events** section under your ETL file.

   1. Under **Filter**, filter by `Microsoft-LobAdapter` to only view relevant events and gateway processes.

### Test your workflow

1. To trigger your logic app workflow, send a message from your SAP system.

1. On the logic app menu, select **Overview**. Review the **Runs history** for any new runs for your logic app workflow.

1. Open the most recent run, which shows the message sent from your SAP system in the trigger outputs section.

### Test sending IDocs from SAP

To send IDocs from SAP to your logic app workflow, you need the following minimum configuration:

> [!IMPORTANT]
> Use these steps only when you test your SAP configuration with your logic app workflow. Production environments require additional configuration.

1. [Create an RFC destination.](#create-rfc-destination)
1. [Create an ABAP connection.](#create-abap-connection)
1. [Create a receiver port.](#create-receiver-port)
1. [Create a sender port.](#create-sender-port)
1. [Create a logical system partner.](#create-logical-system-partner)
1. [Create a partner profile.](#create-partner-profiles)
1. [Test sending messages.](#test-sending-messages)

#### Create RFC destination

This destination will identify your logic app workflow for the receiver port.

1. To open the **Configuration of RFC Connections** settings, in your SAP interface, use the **sm59** transaction code (T-Code) with the **/n** prefix.

1. Select **TCP/IP Connections** > **Create**.

1. Create a new RFC destination with the following settings:

    1. For your **RFC Destination**, enter a name.

    1. On the **Technical Settings** tab, for **Activation Type**, select **Registered Server Program**.

    1. For your **Program ID**, enter a value. In the SAP server, your logic app workflow's trigger is registered by using this identifier.

       > [!IMPORTANT]
       > The SAP **Program ID** is case-sensitive. Make sure you consistently use the same case format for your **Program ID** 
       > when you configure your logic app workflow and SAP server. Otherwise, you might receive the following errors in the 
       > tRFC Monitor (T-Code SM58) when you attempt to send an IDoc to SAP:
       >
       > * **Function IDOC_INBOUND_ASYNCHRONOUS not found**
       > * **Non-ABAP RFC client (partner type ) not supported**
       >
       > For more information from SAP, review the following notes (login required):
       >
       > * [https://launchpad.support.sap.com/#/notes/2399329](https://launchpad.support.sap.com/#/notes/2399329)
       > * [https://launchpad.support.sap.com/#/notes/353597](https://launchpad.support.sap.com/#/notes/353597)

    1. On the **Unicode** tab, for **Communication Type with Target System**, select **Unicode**.

       > [!NOTE]
       > SAP .NET Client libraries support only Unicode character encoding. If you get the error 
       > `Non-ABAP RFC client (partner type ) not supported` when sending IDoc from SAP to 
       > Azure Logic Apps, check that the **Communication Type with Target System** value is set to **Unicode**.

1. Save your changes.

1. Register your new **Program ID** with Azure Logic Apps by creating a logic app workflow that starts with the SAP trigger named **When a message is received**.

   This way, when you save your workflow, Azure Logic Apps registers the **Program ID** on the SAP Gateway.

1. In your workflow's trigger history, the on-premises data gateway SAP Adapter logs, and the SAP Gateway trace logs, check the registration status. In the SAP Gateway monitor dialog box (T-Code SMGW), under **Logged-On Clients**, the new registration should appear as **Registered Server**.

1. To test your connection, in the SAP interface, under your new **RFC Destination**, select **Connection Test**.

#### Create ABAP connection

This destination will identify your SAP system for the sender port.

1. To open the **Configuration of RFC Connections** settings, in your SAP interface, use the **sm59*** transaction code (T-Code) with the **/n** prefix.

1. Select **ABAP Connections** > **Create**.

1. For **RFC Destination**, enter the identifier for your test SAP system.

1. By leaving the target host empty in the Technical Settings, you are creating a local connection to the SAP system itself.

1. Save your changes.

1. To test your connection, select **Connection Test**.

#### Create receiver port

1. To open the **Ports In IDOC processing** settings, in your SAP interface, use the **we21** transaction code (T-Code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**. For your test port, enter a **Name**. Save your changes.

1. In the settings for your new receiver port, for **RFC destination**, enter the identifier for [your test RFC destination](#create-rfc-destination).

1. Save your changes.

#### Create sender port

1. To open the **Ports In IDOC processing** settings, in your SAP interface, use the **we21** transaction code (T-Code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**. For your test port, enter a **Name** that starts with **SAP**. All sender port names must start with the letters **SAP**, for example, **SAPTEST**. Save your changes.

1. In the settings for your new sender port, for **RFC destination**, enter the identifier for [your ABAP connection](#create-abap-connection).

1. Save your changes.

#### Create logical system partner

1. To open the **Change View "Logical Systems": Overview** settings, in your SAP interface, use the **bd54** transaction code (T-Code).

1. Accept the warning message that appears: **Caution: The table is cross-client**

1. Above the list that shows your existing logical systems, select **New Entries**.

1. For your new logical system, enter a **Log.System** identifier and a short **Name** description. Save your changes.

1. When the **Prompt for Workbench** appears, create a new request by providing a description, or if you already created a request, skip this step.

1. After you create the workbench request, link that request to the table update request. To confirm that your table was updated, save your changes.

#### Create partner profiles

For production environments, you must create two partner profiles. The first profile is for the sender, which is your organization and SAP system. The second profile is for the receiver, which is your logic app.

1. To open the **Partner profiles** settings, in your SAP interface, use the **we20** transaction code (T-Code) with the **/n** prefix.

1. Under **Partner Profiles**, select **Partner Type LS** > **Create**.

1. Create a new partner profile with the following settings:

    * For **Partner No.**, enter [your logical system partner's identifier](#create-logical-system-partner).

    * For **Partn. Type**, enter **LS**.

    * For **Agent**, enter the identifier for the SAP user account to use when you register program identifiers for Azure Logic Apps or other non-SAP systems.

1. Save your changes. If you haven't [created the logical system partner](#create-logical-system-partner), you get the error, **Enter a valid partner number**.

1. In your partner profile's settings, under **Outbound parmtrs.**, select **Create outbound parameter**.

1. Create a new outbound parameter with the following settings:

    * Enter your **Message Type**, for example, **CREMAS**.

    * Enter your [receiver port's identifier](#create-receiver-port).

    * Enter an IDoc size for **Pack. Size**. Or, to [send IDocs one at a time from SAP](#receive-idoc-packets-from-sap), select **Pass IDoc Immediately**.

1. Save your changes.

#### Test sending messages

1. To open the **Test Tool for IDoc Processing** settings, in your SAP interface, use the **we19** transaction code (T-Code) with the **/n** prefix.

1. Under **Template for test**, select **Via message type**, and enter your message type, for example, **CREMAS**. Select **Create**.

1. Confirm the **Which IDoc type?** message by selecting **Continue**.

1. Select the **EDIDC** node. Enter the appropriate values for your receiver and sender ports. Select **Continue**.

1. Select **Standard Outbound Processing**.

1. To start outbound IDoc processing, select **Continue**. When the tool finishes processing, the **IDoc sent to SAP system or external program** message appears.

1. To check for processing errors, use the **sm58** transaction code (T-Code) with the **/n** prefix.

## Generate schemas for artifacts in SAP

This example uses a logic app workflow that you can trigger with an HTTP request. To generate the schemas for the specified IDoc and BAPI, the SAP action **Generate schema** sends a request to an SAP system.

This SAP action returns an [XML schema](#sample-xml-schemas), not the contents or data of the XML document itself. Schemas returned in the response are uploaded to an integration account by using the Azure Resource Manager connector. Schemas contain the following parts:

* The request message's structure. Use this information to form your BAPI `get` list.

* The response message's structure. Use this information to parse the response.

To send the request message, use the generic SAP action **Send message to SAP**, or the targeted **\[BAPI] Call method in SAP** actions.

### Add the Request trigger

1. In the Azure portal, create a blank logic app, which opens the workflow designer.

1. In the search box, enter `http request` as your filter. From the **Triggers** list, select **When a HTTP request is received**.

   ![Screenshot that shows adding the Request trigger.](./media/logic-apps-using-sap-connector/add-http-trigger-logic-app.png)

1. Now save your logic app so you can generate an endpoint URL for your logic app workflow. On the designer toolbar, select **Save**.

   The endpoint URL now appears in your trigger, for example:

   ![Screenshot that shows generating the endpoint URL.](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

### Add an SAP action to generate schemas

1. In the workflow designer, under the trigger, select **New step**.

   ![Screenshot that shows adding a new step to logic app workflow.](./media/logic-apps-using-sap-connector/add-sap-action-logic-app.png)

1. In the search box, enter `generate schemas sap` as your filter. From the **Actions** list, select **Generate schemas**.
  
   ![Screenshot that shows adding the "Generate schemas" action to workflow.](./media/logic-apps-using-sap-connector/select-sap-schema-generator-action.png)

   Or, you can select the **Enterprise** tab, and select the SAP action.

   ![Screenshot that shows selecting the "Generate schemas" action from the Enterprise tab.](./media/logic-apps-using-sap-connector/select-sap-schema-generator-ent-tab.png)

1. If your connection already exists, continue with the next step so you can set up your SAP action. However, if you're prompted for connection details, provide the information so that you can create a connection to your on-premises SAP server now.

   1. Provide a name for the connection.

   1. In the **Data Gateway** section, under **Subscription**, first select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation. 

   1. Under **Connection Gateway**, select your data gateway resource in Azure.

   1. Continue providing information about the connection. For the **Logon Type** property, follow the step based on whether the property is set to **Application Server** or **Group**:

      * For **Application Server**, these properties, which usually appear optional, are required:

        ![Screenshot that shows creating a connection for SAP Application server](./media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png)

      * For **Group**, these properties, which usually appear optional, are required:

        ![Screenshot that shows creating a connection for SAP Message server](./media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)

   1. When you're finished, select **Create**.

      Azure Logic Apps sets up and tests your connection to make sure that the connection works properly.

1. Provide the path to the artifact for which you want to generate the schema.

   You can select the SAP action from the file picker:

   ![Screenshot that shows selecting an SAP action.](./media/logic-apps-using-sap-connector/select-SAP-action-schema-generator.png)  

   Or, you can manually enter the action:

   ![Screenshot that shows manually entering an SAP action.](./media/logic-apps-using-sap-connector/manual-enter-SAP-action-schema-generator.png)

   To generate schemas for more than one artifact, provide the SAP action details for each artifact, for example:

   ![Screenshot that shows selecting "Add new item".](./media/logic-apps-using-sap-connector/schema-generator-array-pick.png)

   ![Screenshot that shows two items.](./media/logic-apps-using-sap-connector/schema-generator-example.png)

   For more information about the SAP action, review [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

1. Save your workflow. On the designer toolbar, select **Save**.

By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](#safe-typing).

### Test your workflow

1. On the designer toolbar, select **Run** to trigger a run for your logic app workflow.

1. Open the run, and check the outputs for the **Generate schemas** action.

   The outputs show the generated schemas for the specified list of messages.

### Upload schemas to an integration account

Optionally, you can download or store the generated schemas in repositories, such as a blob, storage, or integration account. Integration accounts provide a first-class experience with other XML actions, so this example shows how to upload schemas to an integration account for the same logic app workflow by using the Azure Resource Manager connector.

> [!NOTE]
>
> Schemas use base64-encoded format. To upload schemas to an integration account, you must decode them first 
> by using the `base64ToString()` function. The following example shows the code for the `properties` element:
>
> ```json
> "properties": {
>    "Content": "@base64ToString(items('For_each')?['Content'])",
>    "ContentType": "application/xml",
>    "SchemaType": "Xml"
> }
> ```

1. In the workflow designer, under the trigger, select **New step**.

1. In the search box, enter `resource manager` as your filter. Select **Create or update a resource**.

   ![Screenshot that shows selecting an Azure Resource Manager action.](./media/logic-apps-using-sap-connector/select-azure-resource-manager-action.png)

1. Enter the details for the action, including your Azure subscription, Azure resource group, and integration account. To add SAP tokens to the fields, click inside the boxes for those fields, and select from the dynamic content list that appears.

   1. Open the **Add new parameter** list, and select the **Location** and **Properties** fields.

   1. Provide details for these new fields as shown in this example.

      ![Screenshot that shows entering details for the Azure Resource Manager action.](./media/logic-apps-using-sap-connector/azure-resource-manager-action.png)

   The SAP **Generate schemas** action generates schemas as a collection, so the designer automatically adds a **For each** loop to the action. Here's an example that shows how this action appears:

   ![Screenshot that shows the Azure Resource Manager action with a "for each" loop.](./media/logic-apps-using-sap-connector/azure-resource-manager-action-foreach.png)

1. Save your workflow. On the designer toolbar, select **Save**.

### Test your workflow

1. On the designer toolbar, select **Run** to manually trigger your logic app workflow.

1. After a successful run, go to the integration account, and check that the generated schemas exist.

## Advanced scenarios

### Change language headers

When you connect to SAP from Logic Apps, the default language for the connection is English. You can set the language for your connection by using the [standard HTTP header `Accept-Language`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4) with your inbound requests.

> [!TIP]
> Most web browsers add an `Accept-Language` header based on the user's settings. The web browser applies this header when you create a new SAP connection in the workflow designer, either update your web browser's settings to use your preferred language, or create your SAP connection using Azure Resource Manager instead of the workflow designer.

For example, you can send a request with the `Accept-Language` header to your logic app workflow by using the **Request** trigger. All the actions in your logic app workflow receive the header. Then, SAP uses the specified languages in its system messages, such as BAPI error messages.

The SAP connection parameters for a logic app workflow don't have a language property. So, if you use the `Accept-Language` header, you might get the following error: **Please check your account info and/or permissions and try again.** In this case, check the SAP component's error logs instead. The error actually happens in the SAP component that uses the header, so you might get one of these error messages:

* `"SAP.Middleware.Connector.RfcLogonException: Select one of the installed languages"`

* `"SAP.Middleware.Connector.RfcAbapMessageException: Select one of the installed languages"`

### Confirm transaction explicitly

When you send transactions to SAP from Azure Logic Apps, this exchange happens in two steps as described in the SAP document, [Transactional RFC Server Programs](https://help.sap.com/doc/saphelp_nwpi71/7.1/22/042ad7488911d189490000e829fbbd/content.htm?no_cache=true). By default, the **Send to SAP** action handles both the steps for the function transfer and for the transaction confirmation in a single call. The SAP connector gives you the option to decouple these steps. You can send an IDoc and rather than automatically confirm the transaction, you can use the explicit **\[IDOC] Confirm transaction ID** action.

This capability to decouple the transaction ID confirmation is useful when you don't want to duplicate transactions in SAP, for example, in scenarios where failures might happen due to causes such as network issues. When the **Send to SAP** action separately confirms the transaction ID, the SAP system completes the transaction only once.

Here's an example that shows this pattern:

1. Create a blank logic app workflow, and add the Request trigger.

1. From the SAP connector, add the **\[IDOC] Send document to SAP** action. Provide the details for the IDoc that you send to your SAP system.

1. To explicitly confirm the transaction ID in a separate step, in the **Confirm TID** field, select **No**. For the optional **Transaction ID GUID** field, you can either manually specify the value or have the connector automatically generate and return this GUID in the response from the **\[IDOC] Send document to SAP** action.

   ![Screenshot that shows the "[IDOC] Send document to SAP" action properties](./media/logic-apps-using-sap-connector/send-idoc-action-details.png)

1. To explicitly confirm the transaction ID, add the **\[IDOC] Confirm transaction ID** action, making sure to [avoid sending duplicate IDocs to SAP](#avoid-sending-duplicate-idocs). Click inside the **Transaction ID** box so that the dynamic content list appears. From that list, select the **Transaction ID** value that's returned from the **\[IDOC] Send document to SAP** action.

   ![Screenshot that shows the "Confirm transaction ID" action](./media/logic-apps-using-sap-connector/explicit-transaction-id.png)

   After this step runs, the current transaction is marked complete at both ends, on the SAP connector side and on SAP system side.

#### Avoid sending duplicate IDocs

If you experience an issue with duplicate IDocs being sent to SAP from your logic app workflow, follow these steps to create a string variable to serve as your IDoc transaction identifier. Creating this transaction identifier helps prevent duplicate network transmissions when there are issues such as temporary outages, network issues, or lost acknowledgments.

> [!NOTE]
> SAP systems forget a transaction identifier after a specified time, or 24 hours by default. 
> As a result, SAP never fails to confirm a transaction identifier if the ID or GUID is unknown.
> If confirmation for a transaction identifier fails, this failure indicates that communcation 
> with the SAP system failed before SAP was able to acknowledge the confirmation.

1. In the workflow designer, add the action **Initialize variable** to your logic app workflow.

1. In the editor for the action **Initialize variable**, configure the following settings. Then, save your changes.

   1. For **Name**, enter a name for your variable. For example, `IDOCtransferID`.

   1. For **Type**, select **String** as the variable type.

   1. For **Value**, select the text box **Enter initial value** to open the dynamic content menu.

   1. Select the **Expressions** tab. In the list of functions, enter the function `guid()`.

   1. Select **OK** to save your changes. The **Value** field is now set to the `guid()` function, which generates a GUID.

1. After the **Initialize variable** action, add the action **\[IDOC] Send document to SAP**.

1. In the editor for the action **\[IDOC] Send document to SAP**, configure the following settings. Then, save your changes.

   1. For **IDOC type** select your message type, and for **Input IDOC message**, specify your message.

   1. For **SAP release version**, select your SAP configuration's values.

   1. For **Record types version**, select your SAP configuration's values.

   1. For **Confirm TID**, select **No**.

   1. Select **Add new parameter list** > **Transaction ID GUID**.

   1. Select the text box to open the dynamic content menu. Under the **Variables** tab, select the name of the variable that you created, for example, `IDOCtransferID`.

1. On the title bar of the action **\[IDOC] Send document to SAP**, select **...** > **Settings**.

   For **Retry Policy**, it's recommended to select **Default** &gt; **Done**. However, you can instead configure a custom policy for your specific needs. For custom policies, it's recommended to configure at least one retry to overcome temporary network outages.

1. After the action **\[IDOC] Send document to SAP**, add the action **\[IDOC] Confirm transaction ID**.

1. In the editor for the action **\[IDOC] Confirm transaction ID**, configure the following settings. Then, save your changes.

1. For **Transaction ID**, enter the name of your variable again. For example, `IDOCtransferID`.

1. Optionally, validate the deduplication in your test environment.

    1. Repeat the **\[IDOC] Send document to SAP** action with the same **Transaction ID** GUID that you used in the previous step.
    
    1. To validate which IDoc number got assigned after each call to the **\[IDOC] Send document to SAP** action, use the **\[IDOC] Get IDOC list for transaction** action with the same **Transaction ID** and the **Receive** direction.

       If the same, single IDoc number is returned for both calls, the IDoc was deduplicated.

   When you send the same IDoc twice, you can validate that SAP is able to identify the duplication of the tRFC call and resolve the two calls to a single inbound IDoc message.

## Next steps

- [SAP managed connector reference](/connectors/sap/)
- [SAP built-in connector reference](/azure/logic-apps/connectors/built-in/reference/sap/)