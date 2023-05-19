---
title: SAP artifact schemas
description: Sample SAP artifacts for workflows in Azure Logic Apps
services: logic-apps
ms.suite: integration
author: daviburg
ms.author: daviburg
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 05/23/2023
---

# Generate SAP schemas for workflows in Azure Logic Apps


## Generate schemas for artifacts in SAP

The following example uses a logic app workflow that you can trigger with an HTTP request. To generate the schemas for the specified IDoc and BAPI, the SAP action **Generate schema** sends a request to an SAP system.

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

   1. Continue providing information about the connection. For the **Logon Type** parameter, follow the step based on whether the property is set to **Application Server** or **Group**:

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

This reference guide provides more information about schemas for SAP artifacts 

If you're learning how to generate an XML schema to use 

If you're learning how to generate an XML schema to use when creating a sample document, review the following samples. These examples show how you can work with many types of payloads, including:

## Sample XML schemas

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

### XML samples for RFC requests

The following example is a basic RFC call. The RFC name is `STFC_CONNECTION`. This request uses the default namespace `xmlns=`, however, you can assign and use namespace aliases such as `xmmlns:exampleAlias=`. The namespace value is the namespace for all RFCs in SAP for Microsoft services. There's a simple input parameter in the request, `<REQUTEXT>`.

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
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc/">
         <LINE>exampleFieldInput1</LINE>
      </ABAPTEXT>
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc/">
         <LINE>exampleFieldInput2</LINE>
      </ABAPTEXT>
      <ABAPTEXT xmlns="http://Microsoft.LobServices.Sap/2007/03/Types/Rfc/">
         <LINE>exampleFieldInput3</LINE>
      </ABAPTEXT>
   </TCPICDAT>
</STFC_WRITE_TO_TCPIC>
```

> [!NOTE]
> Observe the result of RFC **STFC_WRITE_TO_TCPIC** with the SAP Logon's Data Browser (T-Code SE16.) Use the table name **TCPIC**.

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
> which Azure Logic Apps issues with no input filter. Logic Apps inspects the output table `BOR_TREE`. The `SHORT_TEXT` field 
> is used for names of business objects. Business objects not returned by SAP in the output table aren't accessible to 
> Azure Logic Apps.
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

### XML samples for IDoc requests

To generate a plain SAP IDoc XML schema, use the **SAP Logon** application and the `WE-60` T-Code. Access the SAP documentation through the GUI and generate XML schemas in XSD format for your IDoc types and extensions. For an explanation of generic SAP formats and payloads, and their built-in dialogs, review the [SAP documentation](https://help.sap.com/viewer/index).

This example declares the root node and namespaces. The URI in the sample code, `http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700/Send`, declares the following configuration:

* `/IDoc` is the root note for all IDocs.

* `/3` is the record types version for common segment definitions.

* `/ORDERS05` is the IDoc type.

* `//` is an empty segment because there's no IDoc extension.

* `/700` is the SAP version.

* `/Send` is the action to send the information to SAP.

```xml
<ns0:Send xmlns:ns0="http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700/Send" xmlns:ns3="http://schemas.microsoft.com/2003/10/Serialization" xmlns:ns1="http://Microsoft.LobServices.Sap/2007/03/Types/Idoc/Common/" xmlns:ns2="http://Microsoft.LobServices.Sap/2007/03/Idoc/3/ORDERS05//700">
   <ns0:idocData>
```

You can repeat the `idocData` node to send a batch of IDocs in a single call. In the example below, there's one control record, `EDI_DC40`, and multiple data records.

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

## Next steps

* [Create SAP common scenario workflows](sap-create-example-scenario-workflows.md)