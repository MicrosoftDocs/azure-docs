---
title: Connect to SAP systems
description: Access and manage SAP resources by automating workflows with Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, daviburg, azla
ms.topic: conceptual
ms.date: 08/10/2021
tags: connectors
---

# Connect to SAP systems from Azure Logic Apps

This article explains how you can access your SAP resources from Azure Logic Apps using the [SAP connector](/connectors/sap/).

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription yet, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* A logic app from which you want to access your SAP resources. If you're new to Logic Apps, review the [Azure Logic Apps overview](logic-apps-overview.md) and the [quickstart for creating your first logic app in the Azure portal](quickstart-create-first-logic-app-workflow.md).

  * If you've used a previous version of the SAP connector that has been deprecated, you must [migrate to the current connector](#migrate-to-current-connector) before you can connect to your SAP server.

  * If you're running your logic app in multi-tenant Azure, review the [multi-tenant prerequisites](#multi-tenant-azure-prerequisites).

  * If you're running your logic app in a Premium-level [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), review the [ISE prerequisites](#ise-prerequisites).

* An [SAP application server](https://wiki.scn.sap.com/wiki/display/ABAP/ABAP+Application+Server) or [SAP message server](https://help.sap.com/saphelp_nw70/helpdata/en/40/c235c15ab7468bb31599cc759179ef/frameset.htm) that you want to access from Azure Logic Apps. For information about the SAP servers that support this connector, review [SAP compatibility](#sap-compatibility).

  > [!IMPORTANT]
  > Make sure that you set up your SAP server and user account to allow using RFC. For more information, which includes the supported 
  > user account types and the minimum required authorization for each action type (RFC, BAPI, IDOC), review the following SAP note: 
  > [460089 - Minimum authorization profiles for external RFC programs](https://launchpad.support.sap.com/#/notes/460089). 
  >
  > * For RFC actions, the user account additionally needs access to function modules `RFC_GROUP_SEARCH` and `DD_LANGU_TO_ISOLA`.
  > * For BAPI actions, the user account also needs access to the following function modules: `BAPI_TRANSACTION_COMMIT`, 
  >   `BAPI_TRANSACTION_ROLLBACK`, `RPY_BOR_TREE_INIT`, `SWO_QUERY_METHODS` and `SWO_QUERY_API_METHODS`.
  > * For IDOC actions, the user account also needs access to the following function modules: `IDOCTYPES_LIST_WITH_MESSAGES`, 
  >   `IDOCTYPES_FOR_MESTYPE_READ`, `INBOUND_IDOCS_FOR_TID`, `OUTBOUND_IDOCS_FOR_TID`, `GET_STATUS_FROM_IDOCNR`, and `IDOC_RECORD_READ`.
  > * For the **Read Table** action, the user account also needs access to *either* following function module: 
  >   `RFC BBP_RFC_READ_TABLE` or `RFC_READ_TABLE`.

* Message content to send to your SAP server, such as a sample IDoc file. This content must be in XML format and include the namespace of the [SAP action](#actions) you want to use. You can [send IDocs with a flat file schema by wrapping them in an XML envelope](#send-flat-file-idocs).

* If you want to use the **When a message is received from SAP** trigger, you must also do the following:

  * Set up your SAP gateway security permissions with this setting: 

    `"TP=Microsoft.PowerBI.EnterpriseGateway HOST=<gateway-server-IP-address> ACCESS=*"`

  * Set up your SAP gateway security logging to help find Access Control List (ACL). For more information, review the [SAP help topic for setting up gateway logging](https://help.sap.com/erp_hcm_ias2_2015_02/helpdata/en/48/b2a710ca1c3079e10000000a42189b/frameset.htm). Otherwise, you might receive this error:

    `"Registration of tp Microsoft.PowerBI.EnterpriseGateway from host <host-name> not allowed"`

  > [!NOTE]
  > This trigger uses the same URI location to both renew and unsubscribe from a webhook subscription. The renewal 
  > operation uses the HTTP `PATCH` method, while the unsubscribe operation uses the HTTP `DELETE` method. This behavior 
  > might make a renewal operation appear as an unsubscribe operation in your trigger's history, but the operation is 
  > still a renewal because the trigger uses `PATCH` as the HTTP method, not `DELETE`.

### SAP compatibility

The SAP connector is compatible with the following types of SAP systems:

* On-premises and cloud-based HANA-based SAP systems, such as S/4 HANA.

* Classic on-premises SAP systems, such as R/3 and ECC.

The SAP connector supports the following message and data integration types from SAP NetWeaver-based systems:

* Intermediate Document (IDoc)

* Business Application Programming Interface (BAPI)

* Remote Function Call (RFC) and Transactional RFC (tRFC)

The SAP connector uses the [SAP .NET Connector (NCo) library](https://support.sap.com/en/product/connectors/msnet.html).

To use the available [SAP trigger](#triggers) and [SAP actions](#actions), you need to first authenticate your connection. You can authenticate your connection with a username and password. The SAP connector also supports [SAP Secure Network Communications (SNC)](https://help.sap.com/doc/saphelp_nw70/7.0.31/e6/56f466e99a11d1a5b00000e835363f/content.htm?no_cache=true) for authentication. You can use SNC for SAP NetWeaver single sign-on (SSO), or for additional security capabilities from external products. If you use SNC, review the [SNC prerequisites](#snc-prerequisites) and the [SNC prerequisites for the ISE connector](#snc-prerequisites-ise).

### Migrate to current connector

The previous SAP Application Server and SAP Message server connectors were deprecated February 29, 2020. To migrate to the current SAP connector, follow these steps:

1. Update your [on-premises data gateway](https://www.microsoft.com/download/details.aspx?id=53127) to the current version. For more information, review [Install an on-premises data gateway for Azure Logic Apps](logic-apps-gateway-install.md).

1. In your logic app that uses the deprecated SAP connector, delete the **Send to SAP** action.

1. Add the **Send message to SAP** action from the current SAP connector.

1. Reconnect to your SAP system in the new action.

1. Save your logic app.

## Multi-tenant Azure prerequisites

These prerequisites apply if your logic app runs in multi-tenant Azure. The managed SAP connector doesn't run natively in an [ISE](connect-virtual-network-vnet-isolated-environment-overview.md).

> [!TIP]
> If you're using a Premium-level ISE, you can use the SAP ISE connector instead of the managed SAP connector. 
> For more information, review the [ISE prerequisites](#ise-prerequisites).

The managed SAP connector integrates with SAP systems through your [on-premises data gateway](logic-apps/logic-apps-gateway-connection.md). For example, in send message scenarios, when a message is sent from a logic app to an SAP system, the data gateway acts as an RFC client and forwards the requests received from the logic app to SAP. Likewise, in receive message scenarios, the data gateway acts as an RFC server that receives requests from SAP and forwards them to the logic app.

* [Download and install the on-premises data gateway](logic-apps-gateway-install.md) on a host computer or virtual machine that exists in the same virtual network as the SAP system to which you're connecting.

* [Create an Azure gateway resource](logic-apps-gateway-connection.md#create-azure-gateway-resource) for your on-premises data gateway in the Azure portal. This gateway helps you securely access on-premises data and resources. Make sure to use a supported version of the gateway.

  > [!TIP]
  > If you experience an issue with your gateway, try [upgrading to the latest version](https://aka.ms/on-premises-data-gateway-installer), 
  > which might include updates to resolve your problem.

* [Download and install the latest SAP client library](#sap-client-library-prerequisites) on the same local computer as your on-premises data gateway.

## ISE prerequisites

These prerequisites apply if you're running your logic app in a Premium-level ISE. However, they don't apply to logic apps running in a Developer-level ISE. An ISE provides access to resources that are protected by an Azure virtual network and offers other ISE-native connectors that let logic apps directly access on-premises resources without using on-premises data gateway.

1. If you don't already have an Azure Storage account with a blob container, create a container using either the [Azure portal](../storage/blobs/storage-quickstart-blobs-portal.md) or [Azure Storage Explorer](../storage/blobs/storage-quickstart-blobs-storage-explorer.md).

1. [Download and install the latest SAP client library](#sap-client-library-prerequisites) on your local computer. You should have the following assembly files:

   * libicudecnumber.dll

   * rscp4n.dll

   * sapnco.dll

   * sapnco_utils.dll

1. Create a .zip file that includes these assembly files. Upload the package to your blob container in Azure Storage.

1. In either the Azure portal or Azure Storage Explorer, browse to the container location where you uploaded the .zip file.

1. Copy the URL of the container location. Make sure to include the Shared Access Signature (SAS) token, so the SAS token is authorized. Otherwise, deployment for the SAP ISE connector fails.

1. Install and deploy the SAP connector in your ISE. For more information, review [Add ISE connectors](add-artifacts-integration-service-environment-ise.md#add-ise-connectors-environment).

   1. In the [Azure portal](https://portal.azure.com), find and open your ISE.

   1. On the ISE menu, select **Managed connectors** &gt; **Add**. From the connectors list, find and select **SAP**.

   1. On the **Add a new managed connector** pane, in the **SAP package** box, paste the URL for the .zip file that has the SAP assemblies. Again, make sure to include the SAS token.
 
   1. Select **Create** to finish creating your ISE connector.

1. If your SAP instance and ISE are in different virtual networks, you also need to [peer those networks](../virtual-network/tutorial-connect-virtual-networks-portal.md) so they are connected. Also review the [SNC prerequisites for the ISE connector](#snc-prerequisites-ise).

### SAP client library prerequisites

These are the prerequisites for the SAP client library that you're using with the connector.

* Make sure that you install the latest version, [SAP Connector (NCo 3.0) for Microsoft .NET 3.0.24.0 compiled with .NET Framework 4.0  - Windows 64-bit (x64)](https://support.sap.com/en/product/connectors/msnet.html). Earlier versions of SAP NCo might experience the following issues:

  * When more than one IDoc message is sent at the same time, this condition blocks all later messages that are sent to the SAP destination, causing messages to time out.

  * Session activation might fail due to a leaked session. This condition might block calls sent by SAP to the logic app workflow trigger.

  * The on-premises data gateway (June 2021 release) depends on the `SAP.Middleware.Connector.RfcConfigParameters.Dispose()` method in SAP NCo to free up resources.

* You must have the 64-bit version of the SAP client library installed, because the data gateway only runs on 64-bit systems. Installing the unsupported 32-bit version results in a "bad image" error.

* Copy the assembly files from the default installation folder to another location, based on your scenario as follows.

  * For logic apps running in an ISE, follow the [ISE prerequisites](#ise-prerequisites) instead.

  * For logic apps running in multi-tenant Azure and using your on-premises data gateway, copy the assembly files to the data gateway installation folder. 

    > [!NOTE]
    > If your SAP connection fails with the error message, **Please check your account info and/or permissions and try again**, 
    > make sure you copied the assembly files to the data gateway installation folder.
    > 
    > You can troubleshoot further issues using the [.NET assembly binding log viewer](/dotnet/framework/tools/fuslogvw-exe-assembly-binding-log-viewer). 
    > This tool lets you check that your assembly files are in the correct location. 
  
  * Optionally, when you install the SAP client library, select the **Global Assembly Cache registration** option.

Note the following relationships between the SAP client library, the .NET Framework, the .NET runtime, and the gateway:

* Both the Microsoft SAP Adapter and the gateway host service use .NET Framework 4.7.2.

* The SAP NCo for .NET Framework 4.0 works with processes that use .NET runtime 4.0 to 4.8.

* The SAP NCo for .NET Framework 2.0 works with processes that use .NET runtime 2.0 to 3.5, but no longer works with the latest gateway.

### SNC prerequisites

If you use an on-premises data gateway with optional SNC, which is only supported in multi-tenant Azure, you must configure these additional settings. If you're using an ISE, review the [SNC prerequisites for the ISE connector](#snc-prerequisites-ise)

If you're using SNC with SSO, make sure the data gateway service is running as a user who is mapped against the SAP user. To change the default account, select **Change account**, and enter the user credentials.

![Screenshot of on-premises data gateway settings in the Azure portal, showing Service Settings page with button to change the gateway service account selected.](./media/logic-apps-using-sap-connector/gateway-account.png)

If you're enabling SNC through an external security product, copy the SNC library or files on the same computer where your data gateway is installed. Some examples of SNC products include [sapseculib](https://help.sap.com/saphelp_nw74/helpdata/en/7a/0755dc6ef84f76890a77ad6eb13b13/frameset.htm), Kerberos, and NTLM. For more information about enabling SNC for the data gateway, review [Enable Secure Network Communications](#enable-secure-network-communications).

> [!TIP]
> The version of your SNC library and its dependencies must be compatible with your SAP environment.
>
> * You must use `sapgenpse.exe` specifically as the SAPGENPSE utility.
> * If you use an on-premises data gateway, also copy these same binary files to the installation folder there.
> * If PSE is provided in your connection, you don't need to copy and set up PSE and SECUDIR for your on-premises data gateway.
> * You can also use your on-premises data gateway to troubleshoot any library compatibility issues.

#### SNC prerequisites (ISE)

The ISE version of the SAP connector supports SNC X.509. You can enable SNC for your SAP ISE connections as follows.

> [!IMPORTANT]
> Before you redeploy an existing SAP connector to use SNC, you must delete all connections to the old connector. 
> Multiple logic apps can use the same connection to SAP. As such, you must delete any SAP connections from all 
> your logic apps in the ISE. Then, you must delete the old connector.
>
> When you delete an old connector, you can still keep logic apps that use this connector. After you redeploy 
> the connector, you can then authenticate the new connection in your SAP triggers and actions in these logic apps.

First, if you have already deployed the SAP connector without the SNC or SAPGENPSE libraries, delete all the connections and the connector.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Delete all connections to your SAP connector from your logic apps.

   1. Open your logic app resource in the Azure portal.
   1. In your logic app's menu, under **Development Tools**, select **API connections**.
   1. On the **API connections** page, select your SAP connection.
   1. On the connection's page menu, select **Delete**.
   1. Accept the confirmation prompt to delete the connection.
   1. Wait for the portal notification that the connection has been deleted.

1. Or, delete connections to your SAP connector from your ISE's API connections.

   1. Open your ISE resource in the Azure portal.
   1. In your ISE's menu, under **Settings**, select **API connections**.
   1. On the **API connections** page, select your SAP connection.
   1. On the connection's page menu, select **Delete**.
   1. Accept the confirmation prompt to delete the connection.
   1. Wait for the portal notification that the connection has been deleted.

Next, delete the SAP connector from your ISE. You must delete all connections to this connector in all your logic apps before you can delete the connector. If you haven't already deleted all connections, review the previous set of steps.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your ISE resource in the Azure portal again.
1. In your ISE's menu, under **Settings**, select **Managed connectors**.
1. On the **Managed connectors** page, select the checkbox for your SAP connector.
1. In the toolbar, select **Delete**.
1. Accept the confirmation prompt to delete the connector.
1. Wait for the portal notification that the connector has been deleted.

Next, deploy or redeploy the SAP connector in your ISE:

1. Prepare a new zip archive file to use in your SAP connector deployment. You must include the SNC library and the SAPGENPSE utility.

   1. Copy all SNC, SAPGENPSE, and NCo libraries to the root folder of your zip archive. Don't put these binaries in subfolders.
   1. You must use the 64-bit SNC library. There is no support for 32-bit.
   1. Your SNC library and its dependencies must be compatible with your SAP environment. For how to check compatibility, the [ISE prerequisites](#ise-prerequisites).

1. Follow the deployment steps in [ISE prerequisites](#ise-prerequisites) with your new zip archive.

Last, create new connections that use SNC in all your logic apps that use the SAP connector. For each connection, follow these steps:

1. Open your workflow in the workflow designer again.
1. Create or edit a step that uses the SAP connector.
1. Enter required information about your SAP connection.

   :::image type="content" source=".\media\logic-apps-using-sap-connector\ise-connector-settings.png" alt-text="Screenshot of the workflow designer, showing SAP connection settings." lightbox=".\media\logic-apps-using-sap-connector\ise-connector-settings.png":::

   > [!NOTE]
   > The fields **SAP Username** and **SAP Password** are optional. If you don't provide a username and password, 
   > the connector uses the client certificate provided in a later step for authentication.

1. Enable SNC.

   1. For **Use SNC**, select the checkbox.
   1. For **SNC Library**, enter the name of your SNC library. For example, `sapcrypto.dll`.
   1. For **SNC Partner Name**, enter the backend's SNC name. For example, `p:CN=DV3, OU=LA, O=MS, C=US`.
   1. For **SNC Certificate**, enter your SNC client's public certificate in base64-encoded format. Don't include the PEM header or footer.
   1. Optionally, enter SNC settings for **SNC My Name**, **SNC Quality of Protection** as needed.

   :::image type="content" source=".\media\logic-apps-using-sap-connector\ise-connector-settings-snc.png" alt-text="Screenshot of the workflow designer, showing SNC configuration settings for a new SAP connection." lightbox=".\media\logic-apps-using-sap-connector\ise-connector-settings-snc.png":::

1. Configure PSE settings. For **PSE**, enter your SNC PSE as a base64-encoded binary.

   * The PSE must contain the private client certificate, which thumbprint matches the public client certificate that you provided in the previous step.
   * The PSE may contain additional client certificates. 
   * The PSE must have no PIN. If needed, set the PIN to empty using the SAPGENPSE utility. 

   For certificate rotation, follow these steps:

   1. Update the base64-encoded binary PSE for all connections that use SAP ISE X.509 in your ISE.

   1. Import the new certificates into your copy of the PSE.

   1. Encode the PSE file as a base64-encoded binary.

   1. Edit the API connection for your SAP connector and save the new PSE file there.

   The connector detects the PSE change and updates its own copy during the next connection request.

   > [!NOTE]
   > If you're using more than one SNC client certificate for your ISE, you must provide the same PSE for all connections. 
   > You can set the client public certificate parameter to specific the certificate for each connection used in your ISE.

1. Select **Create** to create your connection. If the parameters are correct, the connection is created. If there's a problem with the parameters, the connection creation dialog displays an error message.

   > [!TIP]
   > To troubleshoot connection parameter issues, you can use an on-premises data gateway and the gateway's local logs.

1. On the workflow designer toolbar, select **Save** to save your changes.

## Send IDoc messages to SAP server

Follow these examples to create a logic app that sends an IDoc message to an SAP server and returns a response:

1. [Create a logic app that is triggered by an HTTP request.](#create-http-request-trigger)

1. [Create an action in your workflow to send a message to SAP.](#create-sap-action-to-send-message)

1. [Create an HTTP response action in your workflow.](#create-http-response-action)

1. [Create a remote function call (RFC) request-response pattern, if you're using an RFC to receive replies from SAP ABAP.](#create-rfc-request-response)

1. [Test your logic app.](#test-logic-app)

### Create HTTP request trigger

To have your workflow start by receiving IDocs from SAP, you can use the [Request trigger](../connectors/connectors-native-reqres.md), which now supports the SAP plain XML format. So first, create a logic app workflow that has an endpoint in Azure where you can send *HTTP POST* requests. When your logic app workflow receives these HTTP requests, the trigger fires and runs the next step in your workflow.

> [!TIP]
> To receive IDocs as plain XML, use the SAP trigger named **When a message is received from SAP** instead, 
> and set the **IDOC Format** parameter to **SapPlainXml**.
>
> To receive IDocs as a flat file, use the same SAP trigger, but set the **IDOC Format** parameter to **FlatFile**. 
> In this case, also use the [Flat File Decode action](logic-apps-enterprise-integration-flatfile.md). However, 
> in your flat file schema, you have to use the `early_terminate_optional_fields` property by setting the value 
> to `true`. The requirement is necessary because the flat file IDOC data record is padded to the full SDATA 
> field length. However, the data sent by SAP on the tRFC call `IDOC_INBOUND_ASYNCHRONOUS` isn't padded. 
> Azure Logic Apps provides the flat file IDOC original data without padding as received from SAP.

1. In the [Azure portal](https://portal.azure.com), create a blank logic app, which opens the workflow designer.

1. In the search box, enter `http request` as your filter. From the **Triggers** list, select **When a HTTP request is received**.

   ![Screenshot showing the workflow designer with a new HTTP request trigger being added to the logic app.](./media/logic-apps-using-sap-connector/add-http-trigger-logic-app.png)

1. Save your logic app so that you can generate an endpoint URL for your logic app. On the designer toolbar, select **Save**. The endpoint URL now appears in your trigger. 

   ![Screenshot showing the workflow designer with the HTTP request trigger with generated POST URL being copied.](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

### Create SAP action to send message

Next, create an action to send your IDoc message to SAP when your [HTTP request trigger](#create-http-request-trigger) fires. By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](#safe-typing).

1. In the workflow designer, under the trigger, select **New step**.

   ![Screenshot showing the workflow designer with the workflow being edited to add a new step.](./media/logic-apps-using-sap-connector/add-sap-action-logic-app.png)

1. In the search box, enter `send message sap` as your filter. From the **Actions** list, select **Send message to SAP**.

   ![Screenshot showing the workflow designer with the selected "Send message to SAP" action.](media/logic-apps-using-sap-connector/select-sap-send-action.png)

   Or, you can select the **Enterprise** tab, and select the SAP action.

   ![Screenshot showing the workflow designer with the selected "Send message to SAP" action under Enterprise tab.](media/logic-apps-using-sap-connector/select-sap-send-action-ent-tab.png)

1. If your connection already exists, continue to the next step. If you're prompted to create a new connection, provide the following information to connect to your on-premises SAP server.

   1. Provide a name for the connection.

   1. If you're using the data gateway, follow these steps:

      1. In the **Data Gateway** section, under **Subscription**, first select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation.

      1. Under **Connection Gateway**, select your data gateway resource in Azure.

   1. For the **Logon Type** property, follow the step based on whether the property is set to **Application Server** or **Group**.

      * For **Application Server**, these properties, which usually appear optional, are required:

        ![Create SAP application server connection](./media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png)

      * For **Group**, these properties, which usually appear optional, are required:

        ![Create SAP message server connection](./media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)

   1. When you're finished, select **Create**.

      Logic Apps sets up and tests your connection to make sure that the connection works properly.

      > [!NOTE]
      > If you receive the following error, there is a problem with your installation of the SAP NCo client library: 
      >
      > **Test connection failed. Error 'Failed to process request. Error details: 'could not load file or assembly 'sapnco, Version=3.0.0.42, Culture=neutral, PublicKeyToken 50436dca5c7f7d23' or one of its dependencies. The system cannot find the file specified.'.'**
      >
      > Make sure to [install the required version of the SAP NCo client library and meet all other prerequisites](#sap-client-library-prerequisites).

1. Now find and select an action from your SAP server.

   1. In the **SAP Action** box, select the folder icon. From the file list, find and select the SAP message you want to use. To navigate the list, use the arrows.

      This example selects an IDoc with the **Orders** type.

      ![Find and select IDoc action](./media/logic-apps-using-sap-connector/SAP-app-server-find-action.png)

      If you can't find the action you want, you can manually enter a path, for example:

      ![Manually provide path to IDoc action](./media/logic-apps-using-sap-connector/SAP-app-server-manually-enter-action.png)

      > [!TIP]
      > Provide the value for **SAP Action** through the expression editor. 
      > That way, you can use the same action for different message types.

      For more information about IDoc operations, review [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

   1. Click inside the **Input Message** box so that the dynamic content list appears. From that list, under **When a HTTP request is received**, select the **Body** field.

      This step includes the body content from your HTTP Request trigger and sends that output to your SAP server.

      ![Select the "Body" property from trigger](./media/logic-apps-using-sap-connector/SAP-app-server-action-select-body.png)

      When you're finished, your SAP action looks like this example:

      ![Complete the SAP action](./media/logic-apps-using-sap-connector/SAP-app-server-complete-action.png)

1. Save your logic app. On the designer toolbar, select **Save**.

#### Send flat file IDocs

You can use IDocs with a flat file schema if you wrap them in an XML envelope. To send a flat file IDoc, use the generic instructions to [create an SAP action to send your IDoc message](#create-sap-action-to-send-message) with the following changes.

1. For the **Send message to SAP** action, use SAP action URI `http://microsoft.lobservices.sap/2007/03/Idoc/SendIdoc`.

1. Format your input message with an XML envelope.

For example, review the following example XML payload:

```xml
<ReceiveIdoc xmlns="http://Microsoft.LobServices.Sap/2007/03/Idoc/">
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
</ReceiveIdoc>
```

### Create HTTP response action

Now add a response action to your logic app's workflow and include the output from the SAP action. That way, your logic app returns the results from your SAP server to the original requestor.

1. In the workflow designer, under the SAP action, select **New step**.

1. In the search box, enter `response` as your filter. From the **Actions** list, select **Response**.

1. Click inside the **Body** box so that the dynamic content list appears. From that list, under **Send message to SAP**, select the **Body** field.

   ![Complete SAP action](./media/logic-apps-using-sap-connector/select-sap-body-for-response-action.png)

1. Save your logic app.

#### Create RFC request-response

> [!NOTE]
> The SAP trigger receives IDocs over tRFC, which doesn't have a response parameter by design. 

You must create a request and response pattern if you need to receive replies by using a remote function call (RFC) to Logic Apps from SAP ABAP. To receive IDocs in your logic app, you should make its first action an [HTTP request](../connectors/connectors-native-reqres.md#add-a-response-action) with a status code of `200 OK` and no content. This recommended step completes the SAP LUW asynchronous transfer over tRFC immediately, which leaves the SAP CPIC conversation available again. You can then add further actions in your logic app to process the received IDoc without blocking further transfers.

To implement a request and response pattern, you must first discover the RFC schema using the [`generate schema` command](#generate-schemas-for-artifacts-in-sap). The generated schema has two possible root nodes: 

1. The request node, which is the call that you receive from SAP.

1. The response node, which is your reply back to SAP.

In the following example, a request and response pattern is generated from the `STFC_CONNECTION` RFC module. The request XML is parsed to extract a node value in which SAP requests `<ECHOTEXT>`. The response inserts the current timestamp as a dynamic value. You receive a similar response when you send a `STFC_CONNECTION` RFC from a logic app to SAP.

```xml
<STFC_CONNECTIONResponse xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
  <ECHOTEXT>@{first(xpath(xml(triggerBody()?['Content']), '/*[local-name()="STFC_CONNECTION"]/*[local-name()="REQUTEXT"]/text()'))}</ECHOTEXT>
  <RESPTEXT>Azure Logic Apps @{utcNow()}</RESPTEXT>
```

### Test logic app

1. If your logic app isn't already enabled, on your logic app menu, select **Overview**. On the toolbar, select **Enable**.

1. On the designer toolbar, select **Run**. This step manually starts your logic app.

1. Trigger your logic app by sending an HTTP POST request to the URL in your HTTP Request trigger.
Include your message content with your request. To the send the request, you can use a tool such as [Postman](https://www.getpostman.com/apps).

   For this article, the request sends an IDoc file, which must be in XML format and include the namespace for the SAP action you're using, for example:

   ```xml
   <?xml version="1.0" encoding="UTF-8" ?>
   <Send xmlns="http://Microsoft.LobServices.Sap/2007/03/Idoc/2/ORDERS05//720/Send">
   <idocData>
   <...>
   </idocData>
   </Send>
   ```

1. After you send your HTTP request, wait for the response from your logic app.

   > [!NOTE]
   > Your logic app might time out if all the steps required for the response don't 
   > finish within the [request timeout limit](logic-apps-limits-and-config.md). 
   > If this condition happens, requests might get blocked. To help you diagnose problems, 
   > learn how you can [check and monitor your logic apps](monitor-logic-apps.md).

You've now created a logic app that can communicate with your SAP server. Now that you've set up an SAP connection for your logic app, you can explore other available SAP actions, such as BAPI and RFC.

## Receive message from SAP

This example uses a logic app that triggers when the app receives a message from an SAP system.

### Add an SAP trigger

1. In the Azure portal, create a blank logic app, which opens the workflow designer.

1. In the search box, enter `when message received sap` as your filter. From the **Triggers** list, select **When a message is received from SAP**.

   ![Add SAP trigger](./media/logic-apps-using-sap-connector/add-sap-trigger-logic-app.png)

   Or, you can select the **Enterprise** tab, and then select the trigger:

   ![Add SAP trigger from Enterprise tab](./media/logic-apps-using-sap-connector/add-sap-trigger-ent-tab.png)

1. If your connection already exists, continue with the next step so you can set up your SAP action. However, if you're prompted for connection details, provide the information so that you can create a connection to your on-premises SAP server now.

   1. Provide a name for the connection.

   1. If you're using the data gateway, follow these steps:

      1. In the **Data Gateway** section, under **Subscription**, first select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation.

      1. Under **Connection Gateway**, select your data gateway resource in Azure.

   1. Continue providing information about the connection. For the **Logon Type** property, follow the step based on whether the property is set to **Application Server** or **Group**:

      * For **Application Server**, these properties, which usually appear optional, are required:

        ![Create connection - SAP application server](media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png)

      * For **Group**, these properties, which usually appear optional, are required:

        ![Create connection - SAP message server](media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)

      By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](#safe-typing).

   1. When you're finished, select **Create**.

      Logic Apps sets up and tests your connection to make sure that the connection works properly.

1. Provide the [required parameters](#parameters) based on your SAP system configuration. 

   You can [filter the messages that you receive from your SAP server by specifying a list of SAP actions](#filter-with-sap-actions).

   You can select an SAP action from the file picker:

   ![Add SAP action to logic app](media/logic-apps-using-sap-connector/select-SAP-action-trigger.png)  

   Or, you can manually specify an action:

   ![Manually enter SAP action that you want to use](media/logic-apps-using-sap-connector/manual-enter-SAP-action-trigger.png)

   Here's an example that shows how the action appears when you set up the trigger to receive more than one message.

   ![Trigger example that receives multiple messages](media/logic-apps-using-sap-connector/example-trigger.png)

   For more information about the SAP action, review [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations)

1. Now save your logic app so you can start receiving messages from your SAP system. On the designer toolbar, select **Save**.

   Your logic app is now ready to receive messages from your SAP system.

   > [!NOTE]
   > The SAP trigger is a webhook-based trigger, not a polling trigger. If you're using the data gateway, 
   > the trigger is called from the data gateway only when a message exists, so no polling is necessary.

1. In your logic app's trigger history, check that the trigger registration succeeds.

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

  ```output
  sapgw00  3300/tcp
  ```

You might get a similar error when SAP application server or message server name resolves to the IP address. For ISE, you must specify the IP address for your SAP application server or message server. For the on-premises data gateway, you can instead add the name to the IP address mapping in `%windir%\System32\drivers\etc\hosts`, for example:

```output
10.0.1.9 SAPDBSERVER01 # SAP System Server VPN IP by computer name
10.0.1.9 SAPDBSERVER01.someguid.xx.xxxxxxx.cloudapp.net # SAP System Server VPN IP by fully qualified computer name
```

#### Parameters

Along with simple string and number inputs, the SAP connector accepts the following table parameters (`Type=ITAB` inputs):

* Table direction parameters, both input and output, for older SAP releases.

* Changing parameters, which replace the table direction parameters for newer SAP releases.

* Hierarchical table parameters

#### Filter with SAP actions

You can optionally filter the messages that your logic app receives from your SAP server by providing a list, or array, with a single or multiple SAP actions. By default, this array is empty, which means that your logic app receives all the messages from your SAP server without filtering. 

When you set up the array filter, the trigger only receives messages from the specified SAP action types and rejects all other messages from your SAP server. However, this filter doesn't affect whether the typing of the received payload is weak or strong.

Any SAP action filtering happens at the level of the SAP adapter for your on-premises data gateway. For more information, review [how to send test IDocs to Logic Apps from SAP](#test-sending-idocs-from-sap).

If you can't send IDoc packets from SAP to your logic app's trigger, review the Transactional RFC (tRFC) call rejection message in the SAP tRFC dialog box (T-code SM58). In the SAP interface, you might get the following error messages, which are clipped due to the substring limits on the **Status Text** field.

##### The RequestContext on the IReplyChannel was closed without a reply being sent

This error message means unexpected failures happen when the catch-all handler for the channel terminates the channel due to an error, and rebuilds the channel to process other messages.

To acknowledge that your logic app received the IDoc, [add a Response action](../connectors/connectors-native-reqres.md#add-a-response-action) that returns a `200 OK` status code. Leave the body empty and don't change or add to the headers. The IDoc is transported through tRFC, which doesn't allow for a response payload.

To reject the IDoc instead, respond with any HTTP status code other than `200 OK`. The SAP Adapter then returns an exception back to SAP on your behalf. You should only reject the IDoc to signal transport errors back to SAP, such as a misrouted IDoc that your application can't process. You shouldn't reject an IDoc for application-level errors, such as issues with the data contained in the IDoc. If you delay transport acceptance for application-level validation, you might experience negative performance due to blocking your connection from transporting other IDocs.

If you're receiving this error message and experience systemic failures calling Logic Apps, check that you've configured the network settings for your on-premises data gateway service for your specific environment. For example, if your network environment requires the use of a proxy to call Azure endpoints, you need to configure your on-premises data gateway service to use your proxy. For more information, review [Proxy Configuration](/dotnet/framework/network-programming/proxy-configuration).

If you're receiving this error message and experience intermittent failures calling Logic Apps, you might need to increase your retry count and/or retry interval. 

1. Check SAP settings in your on-premises data gateway service configuration file, `Microsoft.PowerBI.EnterpriseGateway.exe.config`. The retry count setting looks like `WebhookRetryMaximumCount="2"`. The retry interval setting looks like `WebhookRetryDefaultDelay="00:00:00.10"` and the timespan format is `HH:mm:ss.ff`. 
    
1. Save your changes and restart your on-premises data gateway.

##### The segment or group definition E2EDK36001 was not found in the IDoc meta

This error message means expected failures happen with other errors. For example, the failure to generate an IDoc XML payload because its segments are not released by SAP. As a result, the segment type metadata required for conversion is missing.

To have these segments released by SAP, contact the ABAP engineer for your SAP system.
### Asynchronous request-reply for triggers

The SAP connector supports Azure's [asynchronous request-reply pattern](/azure/architecture/patterns/async-request-reply) for Logic Apps triggers. You can use this pattern to create successful requests that would have otherwise failed with the default synchronous request-reply pattern. 

> [!TIP]
> In logic apps with multiple response actions, all response actions must use the same request-reply pattern. For example, if your logic app uses a switch control with multiple possible response actions, you must configure all the response actions to use the same request-reply pattern, either synchronous or asynchronous. 

Enabling asynchronous response for your response action allows your logic app to respond with a `202 Accepted` reply when a request has been accepted for processing. The reply contains a location header that you can use to retrieve the final state of your request.

To configure an asynchronous request-reply pattern for your logic app using the SAP connector:

1. Open your logic app in the workflow designer.

1. Confirm that the SAP connector is the trigger for your logic app.

1. Open your logic app's **Response** action. In the action's title bar, select the menu (**...**) &gt; **Settings**.

1. In the **Settings** for your response action, turn on the toggle under **Asynchronous Response**. Select done.

1. Save the changes to your logic app.

## Find extended error logs

For full error messages, check your SAP adapter's extended logs. You can also [enable an extended log file for the SAP connector](#extended-sap-logging-in-on-premises-data-gateway).

For on-premises data gateway releases from June 2020 and later, you can [enable gateway logs in the app settings](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app). 

* The default logging level is **Warning**.

* If you enable  **Additional logging** in the **Diagnostics** settings of the on-premises data gateway app, the logging level is increased to **Informational**.

* To increase the logging level to **Verbose**, update the following setting in your configuration file. Typically, the configuration file is located at `C:\Program Files\On-premises data gateway\Microsoft.PowerBI.DataMovement.Pipeline.GatewayCore.dll.config`.

```xml
<setting name="SapTraceLevel" serializeAs="String">
   <value>Verbose</value>
</setting>
```

For on-premises data gateway releases from April 2020 and earlier, logs are disabled by default.

### Extended SAP logging in on-premises data gateway

If you use an [on-premises data gateway for Logic Apps](../logic-apps/logic-apps-gateway-install.md), you can configure an extended log file for the SAP connector. You can use your on-premises data gateway to redirect Event Tracing for Windows (ETW) events into rotating log files that are included in your gateway's logging .zip files. 

You can [export all of your gateway's configuration and service logs](/data-integration/gateway/service-gateway-tshoot#collect-logs-from-the-on-premises-data-gateway-app) to a .zip file in from the gateway app's settings.

> [!NOTE]
> Extended logging might affect your logic apps' performance when always enabled. It's a best practice to turn off extended log files after you're finished with analyzing and troubleshooting an issue.

#### Capture ETW events

Optionally, advanced users can capture ETW events directly. You can then [consume your data in Azure Diagnostics in Event Hubs](../azure-monitor/agents/diagnostics-extension-stream-event-hubs.md) or [collect your data to Azure Monitor Logs](../azure-monitor/agents/diagnostics-extension-logs.md). For more information, review the [best practices for collecting and storing data](/azure/architecture/best-practices/monitoring#collecting-and-storing-data). You can use [PerfView](https://github.com/Microsoft/perfview/blob/master/README.md) to work with the resulting ETL files, or you can write your own program. This walkthrough uses PerfView:

1. In the PerfView menu, select **Collect** &gt; **Collect** to capture the events.

1. In the **Additional Provider** field, enter `*Microsoft-LobAdapter` to specify the SAP provider to capture SAP adapter events. If you don't specify this information, your trace only includes general ETW events.

1. Keep the other default settings. If you want, you can change the file name or location in the **Data File** field.

1. Select **Start Collection** to begin your trace.

1. After you've reproduced your issue or collected enough analysis data, select **Stop Collection**.

To share your data with another party, such as Azure support engineers, compress the ETL file.

To view the content of your trace:

1. In PerfView, select **File** &gt; **Open** and select the ETL file you just generated.

1. In the PerfView sidebar, the **Events** section under your ETL file.

1. Under **Filter**, filter by `Microsoft-LobAdapter` to only view relevant events and gateway processes.

### Test your logic app

1. To trigger your logic app, send a message from your SAP system.

1. On the logic app menu, select **Overview**. Review the **Runs history** for any new runs for your logic app.

1. Open the most recent run, which shows the message sent from your SAP system in the trigger outputs section.

### Test sending IDocs from SAP

To send IDocs from SAP to your logic app, you need the following minimum configuration:

> [!IMPORTANT]
> Use these steps only when you test your SAP configuration with your logic app. Production environments require additional configuration.

1. [Configure an RFC destination in SAP](#create-rfc-destination)

1. [Create an ABAP connection to your RFC destination](#create-abap-connection)

1. [Create a receiver port](#create-receiver-port)

1. [Create a sender port](#create-sender-port)

1. [Create a logical system partner](#create-logical-system-partner)

1. [Create a partner profile](#create-partner-profiles)

1. [Test sending messages](#test-sending-messages)

#### Create RFC destination

1. To open the **Configuration of RFC Connections** settings, in your SAP interface, use the **sm59** transaction code (T-code) with the **/n** prefix.

1. Select **TCP/IP Connections** > **Create**.

1. Create a new RFC destination with the following settings:
    
    * For your **RFC Destination**, enter a name.
    
    * On the **Technical Settings** tab, for **Activation Type**, select **Registered Server Program**. For your **Program ID**, enter a value. In SAP, your logic app's trigger is registered by using this identifier.

    > [!IMPORTANT]
    > The SAP **Program ID** is case-sensitive. Make sure you consistently use the same case format for your **Program ID** when you configure your logic app and SAP server. Otherwise, you might receive the following errors in the tRFC Monitor (T-Code SM58) when you attempt to send an IDoc to SAP:
    >
    > * **Function IDOC_INBOUND_ASYNCHRONOUS not found**
    > * **Non-ABAP RFC client (partner type) not supported**
    >
    > For more information from SAP, review the following notes (login required) <https://launchpad.support.sap.com/#/notes/2399329> and <https://launchpad.support.sap.com/#/notes/353597>.
    
    * On the **Unicode** tab, for **Communication Type with Target System**, select **Unicode**.

1. Save your changes.

1. Register your new **Program ID** with Azure Logic Apps.

1. To test your connection, in the SAP interface, under your new **RFC Destination**, select **Connection Test**.

#### Create ABAP connection

1. To open the **Configuration of RFC Connections** settings, in your SAP interface, use the **sm59*** transaction code (T-code) with the **/n** prefix.

1. Select **ABAP Connections** > **Create**.

1. For **RFC Destination**, enter the identifier for [your test SAP system](#create-rfc-destination).

1. Save your changes.

1. To test your connection, select **Connection Test**.

#### Create receiver port

1. To open the **Ports In IDOC processing** settings, in your SAP interface, use the **we21** transaction code (T-code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**. For your test port, enter a **Name**. Save your changes.

1. In the settings for your new receiver port, for **RFC destination**, enter the identifier for [your test RFC destination](#create-rfc-destination).

1. Save your changes.

#### Create sender port

1.  To open the **Ports In IDOC processing** settings, in your SAP interface, use the **we21** transaction code (T-code) with the **/n** prefix.

1. Select **Ports** > **Transactional RFC** > **Create**.

1. In the settings box that opens, select **own port name**. For your test port, enter a **Name** that starts with **SAP**. All sender port names must start with the letters **SAP**, for example, **SAPTEST**. Save your changes.

1. In the settings for your new sender port, for **RFC destination**, enter the identifier for [your ABAP connection](#create-abap-connection).

1. Save your changes.

#### Create logical system partner

1. To open the **Change View "Logical Systems": Overview** settings, in your SAP interface, use the **bd54** transaction code (T-code).

1. Accept the warning message that appears: **Caution: The table is cross-client**

1. Above the list that shows your existing logical systems, select **New Entries**.

1. For your new logical system, enter a **Log.System** identifier and a short **Name** description. Save your changes.

1. When the **Prompt for Workbench** appears, create a new request by providing a description, or if you already created a request, skip this step.

1. After you create the workbench request, link that request to the table update request. To confirm that your table was updated, save your changes.

#### Create partner profiles

For production environments, you must create two partner profiles. The first profile is for the sender, which is your organization and SAP system. The second profile is for the receiver, which is your logic app.

1. To open the **Partner profiles** settings, in your SAP interface, use the **we20** transaction code (T-code) with the **/n** prefix.

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

1. To open the **Test Tool for IDoc Processing** settings, in your SAP interface, use the **we19** transaction code (T-code) with the **/n** prefix.

1. Under **Template for test**, select **Via message type**, and enter your message type, for example, **CREMAS**. Select **Create**.

1. Confirm the **Which IDoc type?** message by selecting **Continue**.

1. Select the **EDIDC** node. Enter the appropriate values for your receiver and sender ports. Select **Continue**.

1. Select **Standard Outbound Processing**.

1. To start outbound IDoc processing, select **Continue**. When processing finishes, the **IDoc sent to SAP system or external program** message appears.

1.  To check for processing errors, use the **sm58** transaction code (T-code) with the **/n** prefix.

## Receive IDoc packets from SAP

You can set up SAP to [send IDocs in packets](https://help.sap.com/viewer/8f3819b0c24149b5959ab31070b64058/7.4.16/4ab38886549a6d8ce10000000a42189c.html), which are batches or groups of IDocs. To receive IDoc packets, the SAP connector, and specifically the trigger, doesn't need extra configuration. However, to process each item in an IDoc packet after the trigger receives the packet, some additional steps are required to split the packet into individual IDocs.

Here's an example that shows how to extract individual IDocs from a packet by using the [`xpath()` function](./workflow-definition-language-functions-reference.md#xpath):

1. Before you start, you need a logic app with an SAP trigger. If you don't already have this in your logic app, follow the previous steps in this topic to [set up a logic app with an SAP trigger](#receive-message-from-sap).

   > [!IMPORTANT]
   > The SAP **Program ID** is case-sensitive. Make sure you consistently use the same case format for your **Program ID** when you configure your logic app and SAP server. Otherwise, you might receive the following errors in the tRFC Monitor (T-Code SM58) when you attempt to send an IDoc to SAP:
   >
   > * **Function IDOC_INBOUND_ASYNCHRONOUS not found**
   > * **Non-ABAP RFC client (partner type) not supported**
   >
   > For more information from SAP, review the following notes (login required) <https://launchpad.support.sap.com/#/notes/2399329> and <https://launchpad.support.sap.com/#/notes/353597>.

   For example:

   ![Add SAP trigger to logic app](./media/logic-apps-using-sap-connector/first-step-trigger.png)

1. [Add a response action to your logic app](../connectors/connectors-native-reqres.md#add-a-response-action) to reply immediately with the status of your SAP request. It's a best practice to add this action immediately after your trigger, to free up the communication channel with your SAP server. Choose one of the following status codes (`statusCode`) to use in your response action:

    * **202 Accepted**, which means the request has been accepted for processing but the processing isn't complete yet.

    * **204 No Content**, which means the server has successfully fulfilled the request and there is no additional content to send in the response payload body. 

    * **200 OK**. This status code always contains a payload, even if the server generates a payload body of zero length. 

1. Get the root namespace from the XML IDoc that your logic app receives from SAP. To extract this namespace from the XML document, add a step that creates a local string variable and stores that namespace by using an `xpath()` expression:

   `xpath(xml(triggerBody()?['Content']), 'namespace-uri(/*)')`

   ![Get root namespace from IDoc](./media/logic-apps-using-sap-connector/get-namespace.png)

1. To extract an individual IDoc, add a step that creates an array variable and stores the IDoc collection by using another `xpath()` expression:

   `xpath(xml(triggerBody()?['Content']), '/*[local-name()="Receive"]/*[local-name()="idocData"]')`

   ![Get array of items](./media/logic-apps-using-sap-connector/get-array.png)

   The array variable makes each IDoc available for your logic app to process individually by enumerating over the collection. In this example, the logic app transfers each IDoc to an SFTP server by using a loop:

   ![Send IDoc to SFTP server](./media/logic-apps-using-sap-connector/loop-batch.png)

   Each IDoc must include the root namespace, which is the reason why the file content is wrapped inside a `<Receive></Receive` element along with the root namespace before sending the IDoc to the downstream app, or SFTP server in this case.

You can use the quickstart template for this pattern by selecting this template in the workflow designer when you create a new logic app.

![Select batch logic app template](./media/logic-apps-using-sap-connector/select-batch-logic-app-template.png)

## Generate schemas for artifacts in SAP

This example uses a logic app that you can trigger with an HTTP request. To generate the schemas for the specified IDoc and BAPI, the SAP action **Generate schema** sends a request to an SAP system.

This SAP action returns an [XML schema](#sample-xml-schemas), not the contents or data of the XML document itself. Schemas returned in the response are uploaded to an integration account by using the Azure Resource Manager connector. Schemas contain the following parts:

* The request message's structure. Use this information to form your BAPI `get` list.

* The response message's structure. Use this information to parse the response.

To send the request message, use the generic SAP action **Send message to SAP**, or the targeted **\[BAPI] Call method in SAP** actions.

### Sample XML schemas

If you're learning how to generate an XML schema for use in creating a sample document, review the following samples. These examples show how you can work with many types of payloads, including:

* [RFC requests](#xml-samples-for-rfc-requests)

* [BAPI requests](#xml-samples-for-bapi-requests)

* [IDoc requests](#xml-samples-for-idoc-requests)

* Simple or complex XML schema data types

* Table parameters

* Optional XML behaviors

You can begin your XML schema with an optional XML prolog. The SAP connector works with or without the XML prolog.

```xml
<?xml version="1.0" encoding="utf-8">
```

#### XML samples for RFC requests

The following example is a basic RFC call. The RFC name is `STFC_CONNECTION`. This request uses the default namespace `xmlns=`, however, you can assign and use namespace aliases such as `xmmlns:exampleAlias=`. The namespace value is the namespace for all RFCs in SAP for Microsoft services. There is a simple input parameter in the request, `<REQUTEXT>`.

```xml
<STFC_CONNECTION xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
   <REQUTEXT>exampleInput</REQUTEXT>
</STFC_CONNECTION>
```

The following example is an RFC call with a table parameter. This example call and its group of test RFCs are available as part of all SAP systems. The table parameter's name is `TCPICDAT`. The table line type is `ABAPTEXT`, and this element repeats for each row in the table. This example contains a single line, called `LINE`. Requests with a table parameter can contain any number of fields, where the number is a positive integer (*n*). 

```xml
<STFC_WRITE_TO_TCPIC xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
   <RESTART_QNAME>exampleQName</RESTART_QNAME>
   <TCPICDAT>
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
         <LINE>exampleFieldInput1</LINE>
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
         <LINE>exampleFieldInput2</LINE>
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
         <LINE>exampleFieldInput3</LINE>
      </ABAPTEXT>
   </TCPICDAT>
</STFC_WRITE_TO_TCPIC>
```

The following example is an RFC call with a table parameter that has an anonymous field. An anonymous field is when the field has no name assigned. Complex types are declared under a separate namespace, in which the declaration sets a new default for the current node and all its child elements. The example uses the hex code`x002F` as an escape character for the symbol */*, because this symbol is reserved in the SAP field name.

```xml
<RFC_XML_TEST_1 xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
   <IM_XML_TABLE>
      <RFC_XMLCNT xmlns="http://Microsoft.LobServices.Sap/2007/03/Rfc/">
         <_x002F_AnonymousField>exampleFieldInput</_x002F_AnonymousField>
      </RFC_XMLCNT>
   </IM_XML_TABLE>
</RFC_XML_TEST_1>
```

The following example includes prefixes for the namespaces. You can declare all prefixes at once, or you can declare any number of prefixes as attributes of a node. The RFC namespace alias `ns0` is used as the root and parameters for the basic type.

> [!NOTE]
> Complex types are declared under a different namespace for RFC types with 
> the alias `ns3` instead of the regular RFC namespace with the alias `ns0`.

```xml
<ns0:BBP_RFC_READ_TABLE xmlns:ns0="http://Microsoft.LobServices.Sap/2007/03/Rfc/" xmlns:ns3="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc/">
   <ns0:DELIMITER>0</ns0:DELIMITER>
   <ns0:QUERY_TABLE>KNA1</ns0:QUERY_TABLE>
   <ns0:ROWCOUNT>250</ns0:ROWCOUNT>
   <ns0:ROWSKIPS>0</ns0:ROWSKIPS>
   <ns0:FIELDS>
      <ns3:RFC_DB_FLD>
         <ns3:FIELDNAME>KUNNR</ns3:FIELDNAME>
      </ns3:RFC_DB_FLD>
   </ns0:FIELDS>
</ns0:BBP_RFC_READ_TABLE>
```

#### XML samples for BAPI requests

The following XML samples are example requests to [call the BAPI method](#actions).

> [!NOTE]
> SAP makes business objects available to external systems by describing them in response to RFC `RPY_BOR_TREE_INIT`, 
> which Logic Apps issues with no input filter. Logic Apps inspects the output table `BOR_TREE`. The `SHORT_TEXT` field 
> is used for names of business objects. Business objects not returned by SAP in the output table aren't accessible to 
> Logic Apps.
> 
> If you use custom business objects, you must make sure to publish and release these business objects in SAP. Otherwise, 
> SAP doesn't list your custom business objects in the output table `BOR_TREE`. You can't access your custom business 
> objects in Logic Apps until you expose the business objects from SAP. 

The following example gets a list of banks using the BAPI method `GETLIST`. This sample contains the business object for a bank, `BUS1011`.

```xml
<GETLIST xmlns="http://Microsoft.LobServices.Sap/2007/03/Bapi/BUS1011">
   <BANK_CTRY>US</BANK_CTRY>
   <MAX_ROWS>10</MAX_ROWS>
</GETLIST>
```

The following example creates a bank object using the `CREATE` method. This example uses the same business object as the previous example, `BUS1011`. When you use the `CREATE` method to create a bank, be sure to commit your changes because this method isn't committed by default.

> [!TIP]
> Be sure that your XML document follows any validation rules configured in your SAP system. For example, in this sample document, the bank key (`<BANK_KEY>`) needs to be a bank routing number, also known as an ABA number, in the USA.

```xml
<CREATE xmlns="http://Microsoft.LobServices.Sap/2007/03/Bapi/BUS1011">
  <BANK_ADDRESS>
    <BANK_NAME xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc">ExampleBankName</BANK_NAME>
    <REGION xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc">ExampleRegionName</REGION>
    <STREET xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc">ExampleStreetAddress</STREET>
    <CITY xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc">Redmond</CITY>
  </BANK_ADDRESS>
  <BANK_COUNTRY>US</BANK_COUNTRY>
  <BANK_KEY>123456789</BANK_KEY>
</CREATE>
```

The following example gets details for a bank using the bank routing number, the value for`<BANK_KEY>`. 

```xml
<GETDETAIL xmlns="http://Microsoft.LobServices.Sap/2007/03/Bapi/BUS1011">
  <BANK_COUNTRY>US</BANK_COUNTRY>
  <BANK_KEY>123456789</BANK_KEY>
</GETDETAIL>
```

#### XML samples for IDoc requests

To generate a plain SAP IDoc XML schema, use the **SAP Logon** application and the T-code `WE-60`. Access the SAP documentation through the GUI and generate XML schemas in XSD format for your IDoc types and extensions. For an explanation of generic SAP formats and payloads, and their built-in dialogs, review the [SAP documentation](https://help.sap.com/viewer/index).

This example declares the root node and namespaces. The URI in the sample code, `http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700/Send`, declares the following configuration:

* `/IDoc` is the root note for all IDocs
* `/3` is the record types version for common segment definitions
* `/ORDERS05` is the IDoc type
* `//` is an empty segment, because there's no IDoc extension
* `/700` is the SAP version
* `/Send` is the action to send the information to SAP

```xml
<ns0:Send xmlns:ns0="http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700/Send" xmlns:ns3="http://schemas.microsoft.com/2003/10/Serialization" xmlns:ns1="http://Microsoft.LobServices.Sap/2007/03/Types/Idoc/Common/" xmlns:ns2="http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700">
   <ns0:idocData>
```

You can repeat the `idocData` node to send a batch of IDocs in a single call. In the example below, there is one control record, `EDI_DC40`, and multiple data records.

```xml
<...>
  <ns0:idocData>
    <ns2:EDI_DC40>
      <ns1:TABNAM>EDI_DC40</ns1:TABNAM>
<...>
      <ns1:ARCKEY>Cor1908207-5</ns1:ARCKEY>
    </ns2:EDI_DC40>
    <ns2:E2EDK01005>
      <ns2:DATAHEADERCOLUMN_SEGNAM>E23DK01005</ns2:DATAHEADERCOLUMN_SEGNAM>
      <ns2:CURCY>USD</ns2:CURCY>
    </ns2:E2EDK01005>
    <ns2:E2EDK03>
<...>
  </ns0:idocData>
```

The following example is a sample IDoc control record, which uses the prefix `EDI_DC`. You must update the values to match your SAP installation and IDoc type. For example, your IDoc client code may not be `800`. Contact your SAP team to make sure you're using the correct values for your SAP installation.

```xml
<ns2:EDI_DC40>
  <ns:TABNAM>EDI_DC40</ns1:TABNAM>
  <ns:MANDT>800</ns1:MANDT>
  <ns:DIRECT>2</ns1:DIRECT>
  <ns:IDOCTYP>ORDERS05</ns1:IDOCTYP>
  <ns:CIMTYP></ns1:CIMTYP>
  <ns:MESTYP>ORDERS</ns1:MESTYP>
  <ns:STD>X</ns1:STD>
  <ns:STDVRS>004010</ns1:STDVRS>
  <ns:STDMES></ns1:STDMES>
  <ns:SNDPOR>SAPENI</ns1:SNDPOR>
  <ns:SNDPRT>LS</ns1:SNDPRT>
  <ns:SNDPFC>AG</ns1:SNDPFC>
  <ns:SNDPRN>ABAP1PXP1</ns1:SNDPRN>
  <ns:SNDLAD></ns1:SNDLAD>
  <ns:RCVPOR>BTSFILE</ns1:RCVPOR>
  <ns:RCVPRT>LI</ns1:RCVPRT>
```

The following example is a sample data record with plain segments. This example uses the SAP date format. Strong-typed documents can use native XML date formats, such as `2020-12-31 23:59:59`.

```xml
<ns2:E2EDK01005>
  <ns2:DATAHEADERCOLUMN_SEGNAM>E2EDK01005</ns2:DATAHEADERCOLUMN_SEGNAM>
    <ns2:CURCY>USD</ns2:CURCY>
    <ns2:BSART>OR</ns2:BSART>
    <ns2:BELNR>1908207-5</ns2:BELNR>
    <ns2:ABLAD>CC</ns2:ABLAD>
  </ns2>
  <ns2:E2EDK03>
    <ns2:DATAHEADERCOLUMN_SEGNAM>E2EDK03</ns2:DATAHEADERCOLUMN_SEGNAM>
      <ns2:IDDAT>002</ns2:IDDAT>
      <ns2:DATUM>20160611</ns2:DATUM>
  </ns2:E2EDK03>
```

The following example is a data record with grouped segments. The record includes a group parent node, `E2EDKT1002GRP`, and multiple child nodes, including `E2EDKT1002` and `E2EDKT2001`. 

```xml
<ns2:E2EDKT1002GRP>
  <ns2:E2EDKT1002>
    <ns2:DATAHEADERCOLUMN_SEGNAM>E2EDKT1002</ns2:DATAHEADERCOLUMN_SEGNAM>
      <ns2:TDID>ZONE</ns2:TDID>
  </ns2:E2EDKT1002>
  <ns2:E2EDKT2001>
    <ns2:DATAHEADERCOLUMN_SEGNAM>E2EDKT2001</ns2:DATAHEADERCOLUMN_SEGNAM>
      <ns2:TDLINE>CRSD</ns2:TDLINE>
  </ns2:E2EDKT2001>
</ns2:E2EDKT1002GRP>
```

The recommended method is to create an IDoc identifier for use with tRFC. You can set this transaction identifier, `tid`, using the [Send IDoc operation](/connectors/sap/#send-idoc) in the SAP connector API.

The following example is an alternative method to set the transaction identifier, or `tid`. In this example, the last data record segment node and the IDoc data node are closed. Then, the GUID, `guid`, is used as the tRFC identifier to detect duplicates.

```xml
     </E2STZUM002GRP>
  </idocData>
  <guid>8820ea40-5825-4b2f-ac3c-b83adc34321c</guid>
</Send>
```

### Add an HTTP Request trigger

1. In the Azure portal, create a blank logic app, which opens the workflow designer.

1. In the search box, enter `http request` as your filter. From the **Triggers** list, select **When a HTTP request is received**.

   ![Add HTTP Request trigger](./media/logic-apps-using-sap-connector/add-http-trigger-logic-app.png)

1. Now save your logic app so you can generate an endpoint URL for your logic app.
On the designer toolbar, select **Save**.

   The endpoint URL now appears in your trigger, for example:

   ![Generate URL for endpoint](./media/logic-apps-using-sap-connector/generate-http-endpoint-url.png)

### Add an SAP action to generate schemas

1. In the workflow designer, under the trigger, select **New step**.

   ![Add new step to logic app](./media/logic-apps-using-sap-connector/add-sap-action-logic-app.png)

1. In the search box, enter `generate schemas sap` as your filter. From the **Actions** list, select **Generate schemas**.
  
   ![Add "Generate schemas" action to workflow](media/logic-apps-using-sap-connector/select-sap-schema-generator-action.png)

   Or, you can select the **Enterprise** tab, and select the SAP action.

   ![Select "Generate schemas" action from Enterprise tab](media/logic-apps-using-sap-connector/select-sap-schema-generator-ent-tab.png)

1. If your connection already exists, continue with the next step so you can set up your SAP action. However, if you're prompted for connection details, provide the information so that you can create a connection to your on-premises SAP server now.

   1. Provide a name for the connection.

   1. In the **Data Gateway** section, under **Subscription**, first select the Azure subscription for the data gateway resource that you created in the Azure portal for your data gateway installation. 

   1. Under **Connection Gateway**, select your data gateway resource in Azure.

   1. Continue providing information about the connection. For the **Logon Type** property, follow the step based on whether the property is set to **Application Server** or **Group**:

      * For **Application Server**, these properties, which usually appear optional, are required:

        ![Create connection for SAP application server](./media/logic-apps-using-sap-connector/create-SAP-application-server-connection.png)

      * For **Group**, these properties, which usually appear optional, are required:

        ![Create connection for SAP message server](./media/logic-apps-using-sap-connector/create-SAP-message-server-connection.png)

   1. When you're finished, select **Create**.

      Logic Apps sets up and tests your connection to make sure that the connection works properly.

1. Provide the path to the artifact for which you want to generate the schema.

   You can select the SAP action from the file picker:

   ![Select SAP action](./media/logic-apps-using-sap-connector/select-SAP-action-schema-generator.png)  

   Or, you can manually enter the action:

   ![Manually enter SAP action](./media/logic-apps-using-sap-connector/manual-enter-SAP-action-schema-generator.png)

   To generate schemas for more than one artifact, provide the SAP action details for each artifact, for example:

   ![Select Add new item](./media/logic-apps-using-sap-connector/schema-generator-array-pick.png)

   ![Show two items](./media/logic-apps-using-sap-connector/schema-generator-example.png)

   For more information about the SAP action, review [Message schemas for IDoc operations](/biztalk/adapters-and-accelerators/adapter-sap/message-schemas-for-idoc-operations).

1. Save your logic app. On the designer toolbar, select **Save**.

By default, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. Learn more about the [Safe Typing option](#safe-typing).

### Test your logic app

1. On the designer toolbar, select **Run** to trigger a run for your logic app.

1. Open the run, and check the outputs for the **Generate schemas** action.

   The outputs show the generated schemas for the specified list of messages.

### Upload schemas to an integration account

Optionally, you can download or store the generated schemas in repositories, such as a blob, storage, or integration account. Integration accounts provide a first-class experience with other XML actions, so this example shows how to upload schemas to an integration account for the same logic app by using the Azure Resource Manager connector.

1. In the workflow designer, under the trigger, select **New step**.

1. In the search box, enter `resource manager` as your filter. Select **Create or update a resource**.

   ![Select Azure Resource Manager action](media/logic-apps-using-sap-connector/select-azure-resource-manager-action.png)

1. Enter the details for the action, including your Azure subscription, Azure resource group, and integration account. To add SAP tokens to the fields, click inside the boxes for those fields, and select from the dynamic content list that appears.

   1. Open the **Add new parameter** list, and select the **Location** and **Properties** fields.

   1. Provide details for these new fields as shown in this example.

      ![Enter details for Azure Resource Manager action](media/logic-apps-using-sap-connector/azure-resource-manager-action.png)

   The SAP **Generate schemas** action generates schemas as a collection, so the designer automatically adds a **For each** loop to the action. Here's an example that shows how this action appears:

   ![Azure Resource Manager action with "for each" loop](media/logic-apps-using-sap-connector/azure-resource-manager-action-foreach.png)

   > [!NOTE]
   > The schemas use base64-encoded format. To upload the schemas to an integration account, they must be decoded 
   > by using the `base64ToString()` function. Here's an example that shows the code for the `"properties"` element:
   >
   > ```json
   > "properties": {
   >    "Content": "@base64ToString(items('For_each')?['Content'])",
   >    "ContentType": "application/xml",
   >    "SchemaType": "Xml"
   > }
   > ```

1. Save your logic app. On the designer toolbar, select **Save**.

### Test your logic app

1. On the designer toolbar, select **Run** to manually trigger your logic app.

1. After a successful run, go to the integration account, and check that the generated schemas exist.

## Enable Secure Network Communications

Before you start, make sure that you met the previously listed [prerequisites](#prerequisites), which apply only when you use the data gateway and your logic apps run in multi-tenant Azure:

* Make sure the on-premises data gateway is installed on a computer that's in the same network as your SAP system.

* For SSO, the data gateway is running as a user that's mapped to an SAP user.

* The SNC library that provides the additional security functions is installed on the same machine as the data gateway. Some examples include [sapseculib](https://help.sap.com/saphelp_nw74/helpdata/en/7a/0755dc6ef84f76890a77ad6eb13b13/frameset.htm), Kerberos, and NTLM.

   To enable SNC for your requests to or from the SAP system, select the **Use SNC** check box in the SAP connection and provide these properties:

   ![Configure SAP SNC in connection](media/logic-apps-using-sap-connector/configure-sapsnc.png)

   | Property | Description |
   |----------| ------------|
   | **SNC Library Path** | The SNC library name or path relative to NCo installation location or absolute path. Examples are `sapsnc.dll` or `.\security\sapsnc.dll` or `c:\security\sapsnc.dll`. |
   | **SNC SSO** | When you connect through SNC, the SNC identity is typically used for authenticating the caller. Another option is to override so that user and password information can be used for authenticating the caller, but the line is still encrypted. |
   | **SNC My Name** | In most cases, this property can be omitted. The installed SNC solution usually knows its own SNC name. Only for solutions that support multiple identities, you might need to specify the identity to be used for this particular destination or server. |
   | **SNC Partner Name** | The name for the back-end SNC. |
   | **SNC Quality of Protection** | The quality of service to be used for SNC communication of this particular destination or server. The default value is defined by the back-end system. The maximum value is defined by the security product used for SNC. |
   |||

   > [!NOTE]
   > Don't set the environment variables SNC_LIB and SNC_LIB_64 on the machine where you have the data gateway 
   > and the SNC library. If set, they take precedence over the SNC library value passed through the connector.

## Safe typing

By default, when you create your SAP connection, strong typing is used to check for invalid values by performing XML validation against the schema. This behavior can help you detect issues earlier. The **Safe Typing** option is available for backward compatibility and only checks the string length. If you choose **Safe Typing**, the DATS type and TIMS type in SAP are treated as strings rather than as their XML equivalents, `xs:date` and `xs:time`, where `xmlns:xs="http://www.w3.org/2001/XMLSchema"`. Safe typing affects the behavior for all schema generation, the send message for both the "been sent" payload and the "been received" response, and the trigger.

When strong typing is used (**Safe Typing** isn't enabled), the schema maps the DATS and TIMS types to more straightforward XML types:

```xml
<xs:element minOccurs="0" maxOccurs="1" name="UPDDAT" nillable="true" type="xs:date"/>
<xs:element minOccurs="0" maxOccurs="1" name="UPDTIM" nillable="true" type="xs:time"/>
```

When you send messages using strong typing, the DATS and TIMS response complies with the matching XML type format:

```xml
<DATE>9999-12-31</DATE>
<TIME>23:59:59</TIME>
```

When **Safe Typing** is enabled, the schema maps the DATS and TIMS types to XML string fields with length restrictions only, for example:

```xml
<xs:element minOccurs="0" maxOccurs="1" name="UPDDAT" nillable="true">
  <xs:simpleType>
    <xs:restriction base="xs:string">
      <xs:maxLength value="8" />
    </xs:restriction>
  </xs:simpleType>
</xs:element>
<xs:element minOccurs="0" maxOccurs="1" name="UPDTIM" nillable="true">
  <xs:simpleType>
    <xs:restriction base="xs:string">
      <xs:maxLength value="6" />
    </xs:restriction>
  </xs:simpleType>
</xs:element>
```

When messages are sent with **Safe Typing** enabled, the DATS and TIMS response looks like this example:

```xml
<DATE>99991231</DATE>
<TIME>235959</TIME>
```

## Advanced scenarios

### Change language headers

When you connect to SAP from Logic Apps, the default language for the connection is English. You can set the language for your connection by using [the standard HTTP header `Accept-Language`](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4) with your inbound requests.

> [!TIP]
> Most web browsers add an `Accept-Language` header based on the user's settings. The web browser applies this header when you create a new SAP connection in the workflow designer, either update your web browser's settings to use your preferred language, or create your SAP connection using Azure Resource Manager instead of the workflow designer.

For example, you can send a request with the `Accept-Language` header to your logic app by using the **HTTP Request** trigger. All the actions in your logic app receive the header. Then, SAP uses the specified languages in its system messages, such as BAPI error messages.

The SAP connection parameters for a logic app don't have a language property. So, if you use the `Accept-Language` header, you might get the following error: **Please check your account info and/or permissions and try again.** In this case, check the SAP component's error logs instead. The error actually happens in the SAP component that uses the header, so you might get one of these error messages:

* `"SAP.Middleware.Connector.RfcLogonException: Select one of the installed languages"`
* `"SAP.Middleware.Connector.RfcAbapMessageException: Select one of the installed languages"`

### Confirm transaction explicitly

When you send transactions to SAP from Logic Apps, this exchange happens in two steps as described in the SAP document, [Transactional RFC Server Programs](https://help.sap.com/doc/saphelp_nwpi71/7.1/22/042ad7488911d189490000e829fbbd/content.htm?no_cache=true). By default, the **Send to SAP** action handles both the steps for the function transfer and for the transaction confirmation in a single call. The SAP connector gives you the option to decouple these steps. You can send an IDoc and rather than automatically confirm the transaction, you can use the explicit **\[IDOC] Confirm transaction ID** action.

This capability to decouple the transaction ID confirmation is useful when you don't want to duplicate transactions in SAP, for example, in scenarios where failures might happen due to causes such as network issues. By confirming the transaction ID separately, the transaction is only completed one time in your SAP system.

Here is an example that shows this pattern:

1. Create a blank logic app and add an HTTP trigger.

1. From the SAP connector, add the **\[IDOC] Send document to SAP** action. Provide the details for the IDoc that you send to your SAP system.

1. To explicitly confirm the transaction ID in a separate step, in the **Confirm TID** field, select **No**. For the optional **Transaction ID GUID** field, you can either manually specify the value or have the connector automatically generate and return this GUID in the response from the Send IDOC action.

   ![Send IDOC action properties](./media/logic-apps-using-sap-connector/send-idoc-action-details.png)

1. To explicitly confirm the transaction ID, add the **\[IDOC] Confirm transaction ID** action, making sure to [avoid sending duplicate IDocs to SAP](#avoid-sending-duplicate-idocs). Click inside the **Transaction ID** box so that the dynamic content list appears. From that list, select the **Transaction ID** value that's returned from the **\[IDOC] Send document to SAP** action.

   ![Confirm transaction ID action](./media/logic-apps-using-sap-connector/explicit-transaction-id.png)

   After this step runs, the current transaction is marked complete at both ends, on the SAP connector side and on SAP system side.

#### Avoid sending duplicate IDocs

If you experience an issue with duplicate IDocs being sent to SAP from your logic app, follow these steps to create a string variable to serve as your IDoc transaction identifier. Creating this transaction identifier helps prevent duplicate network transmissions when there are issues such as temporary outages, network issues, or lost acknowledgments.

> [!NOTE]
> SAP systems forget a transaction identifier after a specified time, or 24 hours by default. 
> As a result, SAP never fails to confirm a transaction identifier if the ID or GUID is unknown.
> If confirmation for a transaction identifier fails, this failure indicates that communcation 
> with the SAP system failed before SAP was able to acknowledge the confirmation.

1. In the workflow designer, add the action **Initialize variable** to your logic app. 

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

1. Optionally, validate the deduplication in your test environment. Repeat the **\[IDOC] Send document to SAP** action with the same **Transaction ID** GUID that you used in the previous step.

   When you send the same IDoc twice, you can validate that SAP is able to identify the duplication of the tRFC call and resolve the two calls to a single inbound IDoc message.

## Known issues and limitations

Here are the currently known issues and limitations for the managed (non-ISE) SAP connector: 

* In general, the SAP trigger doesn't support data gateway clusters. In some failover cases, the data gateway node that communicates with the SAP system might differ from the active node, which results in unexpected behavior.

  * For send scenarios, data gateway clusters in failover mode are supported. 

  * Data gateway clusters in load-balancing mode aren't supported by stateful [SAP actions](#actions). These actions include **\[BAPI - RFC] Create stateful session**, **\[BAPI] commit transaction**, **\[BAPI] Rollback transaction**, **\[BAPI - RFC] Close stateful session**, and all actions that specify a **Session ID** value. Stateful communications must remain on the same data gateway cluster node. 

  * For stateful SAP actions, use the data gateway either in non-cluster mode or in a cluster that's set up for failover only.

* The SAP connector currently doesn't support SAP router strings. The on-premises data gateway must exist on the same LAN as the SAP system you want to connect.

* For [logic apps in an ISE](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), this connector's ISE-labeled version uses the [ISE message limits](../logic-apps/logic-apps-limits-and-config.md#message-size-limits) instead.

## Connector reference 

For more information about the SAP connector, review the [connector reference](/connectors/sap/). You can find details about limits, parameters, and returns for the SAP connector, triggers, and actions.

### Triggers

:::row:::
    :::column span="1":::
        [**When a message is received from SAP**](/connectors/sap/#when-a-message-is-received)
    :::column-end:::
    :::column span="3":::
        When a message is received from SAP, do something. 
    :::column-end:::
:::row-end:::

### Actions

:::row:::
    :::column span="1":::
        [**[BAPI - RFC] Close stateful session**](/connectors/sap/#[bapi---rfc]-close-stateful-session-(preview))
    :::column-end:::
    :::column span="3":::
        Close an existing stateful connection session to your SAP system.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[BAPI - RFC] Create stateful session**](/connectors/sap/#[bapi---rfc]-create-stateful-session-(preview))
    :::column-end:::
    :::column span="3":::
        Create a stateful connection session to your SAP system.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[BAPI] Call method in SAP**](/connectors/sap/#[bapi]-call-method-in-sap-(preview))
    :::column-end:::
    :::column span="3":::
        Call the BAPI method in your SAP system.
        \
        \
        You must use the following parameters with your call:
        \
        \
        **Business Object** (`businessObject`), which is a searchable drop-down menu.
        \
        \
        **Method** (`method`), which populates the available methods after you've selected a **Business Object**. The available methods vary depending on the selected **Business Object**.
        \
        \
        **Input BAPI parameters** (`body`), in which you call the XML document that contains the BAPI method input parameter values for the call, or the URI of the storage blob that contains your BAPI parameters.
        \
        \
        For detailed examples of how to use the **[BAPI] Call method in SAP** action, review the [XML samples of BAPI requests](#xml-samples-for-bapi-requests). 
        \
        If you're using the workflow designer to edit your BAPI request, you can use the following search functions: 
        \
        \
        Select an object in the designer to view a drop-down menu of available methods.
        \
        \
        Filter business object types by keyword using the searchable list provided by the BAPI API call.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[BAPI] Commit transaction**](/connectors/sap/#[bapi]-commit-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Commit the BAPI transaction for the session.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[BAPI] Rollback transaction**](/connectors/sap/#[bapi]-roll-back-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Rollback the BAPI transaction for the session.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[IDOC - RFC] Confirm transaction Id**](/connectors/sap/#[idoc---rfc]-confirm-transaction-id-(preview))
    :::column-end:::
    :::column span="3":::
        Send the transaction identifier confirmation to SAP.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[IDOC] Get IDOC list for transaction**](/connectors/sap/#[idoc]-get-idoc-list-for-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Get a list of IDocs for the transaction by session identifier or transaction identifier.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[IDOC] Get IDOC status**](/connectors/sap/#[idoc]-get-idoc-status-(preview))
    :::column-end:::
    :::column span="3":::
        Get the status of an IDoc.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[IDOC] Send document to SAP**](/connectors/sap/#[idoc]-send-document-to-sap-(preview))
    :::column-end:::
    :::column span="3":::
        Sends the IDoc message to your SAP server.
        \
        \
        You must use the following parameters with your call: 
        \
        \
        **IDOC type with optional extension** (`idocType`), which is a searchable drop-down menu.
        \
        \
        **Input IDOC message** (`body`), in which you call the XML document containing the IDoc payload, or the URI of the storage blob that contains your IDoc XML document. This document must comply with either the SAP IDOC XML schema according to the WE60 IDoc Documentation, or the generated schema for the matching SAP IDoc action URI.
        \
        \
        The optional parameter **SAP release version** (`releaseVersion`) populates values after you select the IDoc type, and depends on the selected IDoc type.
        \
        \
        For detailed examples of how to use the Send IDoc action, review the [walkthrough for sending IDoc messages to your SAP server](#send-idoc-messages-to-sap-server).
        \
        \
        For how to use optional parameter **Confirm TID** (`confirmTid`), review the [walkthrough for confirming the transaction explicitly](#confirm-transaction-explicitly).
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[RFC] Add RFC to transaction**](/connectors/sap/#[rfc]-add-rfc-to-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Add an RFC call to your transaction. 
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[RFC] Call function in SAP**](/connectors/sap/#[rfc]-call-function-in-sap-(preview))
    :::column-end:::
    :::column span="3":::
        Call an RFC operation (sRFC, tRFC, or qRFC) on your SAP system.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[RFC] Commit transaction**](/connectors/sap/#[rfc]-commit-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Commit the RFC transaction for the session and/or queue.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[RFC] Create transaction**](/connectors/sap/#[rfc]-create-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Create a new transaction by identifier and/or queue name. If the transaction exists, get the details. 
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**[RFC] Get transaction**](/connectors/sap/#[rfc]-get-transaction-(preview))
    :::column-end:::
    :::column span="3":::
        Get the details of a transaction by identifier and/or queue name. Create a new transaction if none exists.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**Generate schemas**](/connectors/sap/#generate-schemas)
    :::column-end:::
    :::column span="3":::
        Generate schemas for the SAP artifacts for IDoc, BAPI, or RFC.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**Read SAP table**](/connectors/sap/#read-sap-table-(preview))
    :::column-end:::
    :::column span="3":::
        Read an SAP table.
    :::column-end:::
:::row-end:::
:::row:::
    :::column span="1":::
        [**Send message to SAP**](/connectors/sap/#send-message-to-sap)
    :::column-end:::
    :::column span="3":::
        Send any message type (RFC, BAPI, IDoc) to SAP.
    :::column-end:::
:::row-end:::

## Next steps

* [Connect to on-premises systems](../logic-apps/logic-apps-gateway-connection.md) from Azure Logic Apps.

* Learn how to validate, transform, and use other message operations with the [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md).

* Learn about other [Logic Apps connectors](../connectors/apis-list.md).
