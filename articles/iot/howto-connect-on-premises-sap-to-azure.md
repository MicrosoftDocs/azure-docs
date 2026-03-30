---
title: "Connect an on-premises SAP system to Azure"
description: "Step by step guide that shows how to connect an on-premises SAP Enterprise Resource Planning system to Azure."
author: barnstee
ms.author: erichb
ms.service: azure-iot
ms.topic: how-to #Don't change.
ms.date: 12/10/2024

#customer intent: As an owner of on-premises SAP systems, I want connect them to Azure so that I can add data from these SAP systems to my cloud analytics.

---

# Connect on-premises SAP systems to Azure

Many manufacturers use on-premises SAP Enterprise Resource Planning (ERP) systems. Often, manufacturers connect SAP systems to Industrial IoT solutions, and use the connected system to retrieve data for manufacturing processes, customer orders, and inventory status. This article describes how to connect these SAP-based ERP systems.

This solution uses [IEC 62541. Open Platform Communications (OPC) Unified Architecture (UA)](https://opcfoundation.org) for all operational technology data.

The following diagram shows an overview of the solution:

:::image type="content" source="media/howto-connect-on-premises-sap-to-azure/architecture-iiot-sap.png" alt-text="Diagram of a simple IIoT architecture that shows all components." lightbox="media/howto-connect-on-premises-sap-to-azure/architecture-iiot-sap.png" border="false" :::

To learn more about the components in the solution, see the [Azure Industrial IoT reference architecture](tutorial-iot-industrial-solution-architecture.md) tutorial.

## Prerequisites

To complete the SAP connection as described in this article, you need an Azure Industrial IoT solution deployed in an Azure subscription as described in [Azure Industrial IoT reference architecture](tutorial-iot-industrial-solution-architecture.md)

## Connect the reference solution to on-premises SAP systems

The Azure Logic Apps service handles connectivity to your on-premises SAP systems. Azure Logic Apps is a no-code Azure service that orchestrates workflows that can trigger actions.

> [!NOTE]
> If you want to try out SAP connectivity before connecting your real SAP system, you can deploy and use an [SAP S/4 HANA Fully-Activated Appliance](https://cal.sap.com/catalog#/applianceTemplates) in your Azure subscription.

### Configure Azure Logic Apps

The Azure Logic Apps workflow moves data from your on-premises SAP system to Azure Logic Apps. The workflow also stores the data the SAP system sends to your Azure Storage account. To create a new Azure Logic Apps workflow, follow these steps:

1. In the Azure portal, create a new Azure Storage account. Make a note of the name of your account, you use it later when you configure the workflow.

1. In your storage account, select **Storage browser**, select **File shares > Add file share**. Enter *sap* as the name and select **Create**.

1. Deploy an instance of Azure Logic Apps in the same region as your reference solution deployment. Select the consumption-based hosting option.

1. Navigate to the **Logic app designer**, select **Add trigger**, and then select the **When a HTTP request is received** trigger template.

1. To add a new step, select **+ > Add an action**, select **Azure File Storage**, and then select **Create file**. Enter a name for the connection, the name of the storage account you created previously, and the storage account key.

1. On the next page, for **Folder path** enter *sap*, for **File name** enter *IDoc.xml*, and for **File content** select **Body** from the dynamic content.

1. Save your workflow.

1. Select **Run** and wait for the run to complete. Verify that there are green check marks on both components of your workflow. If you see any red exclamation marks, select the component for more information about the error.

Copy the **HTTP URL** from the HTTP trigger in your workflow. You need it when you configure your SAP system in the next step.

### Create a table in Azure Data Explorer

To store the data from your SAP system, create a table in your Azure Data Explorer database. To create the table, follow these steps:

1. In the Azure portal, navigate to your Azure Data Explorer database. You can use the **ontologies** database that's part of the Azure Industrial IoT reference solution.

1. Run the following Azure Data Explorer query:

    ```kusto
    .create table SAP (name:string, label:string)
    ```

    This query creates a table named **SAP** with two columns: **name** and **label**.

### Configure an on-premises SAP system

To configure an on-premises SAP system to send data to your Logic Apps workflow, follow these steps:

1. Sign in to the SAP Windows virtual machine.

1. On the virtual machine desktop, select **SAP Logon**.

1. Select **Log On** and sign in with your username and password:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/log-on.png" alt-text="Screenshot that shows an SAP sign-in form." lightbox="media/howto-connect-on-premises-sap-to-azure/log-on.png" border="false" :::

1. In the search box, enter **SM59**. This displays the **Configuration of RFC Connections** screen:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/sm95-search.png" alt-text="Screenshot that shows configuration of RFC connections and search for SM95." lightbox="media/howto-connect-on-premises-sap-to-azure/sm95-search.png" border="false" :::

1. Select **Edit > Create** in the application menu.

1. Enter *LOGICAPP* in the **Destination** field.

1. In the **Connection Type** dropdown, select **HTTP Connection to external server**. To save your changes, select the green check mark:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/connection-logic-app.png" alt-text="Screenshot that shows the details of a connection logic app." lightbox="media/howto-connect-on-premises-sap-to-azure/connection-logic-app.png" border="false" :::

1. Enter *LOGICAPP* in **Description 1**.

1. Select the **Technical Settings** tab and enter the first part of **HTTP GET URL** from your Logic app workflow in the **Host** field. For example: `https://example-18.westeurope.logic.azure.com`. Enter *41* as the **Port**. In **Path Prefix** enter the rest of the **HTTP GET URL** starting with */workflows/...*:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/add-get-url.png" alt-text="Screenshot that shows how to add a get url." lightbox="media/howto-connect-on-premises-sap-to-azure/add-get-url.png" border="false" :::

1. Select the **Login & Security** tab.

1. Scroll down to **Security Options** and set **SSL** to **Active**.

1. Select **Save**.

1. In the search box, enter **WE21**. The **Ports in IDoc processing** screen displays.

1. Select the **XML HTTP** folder and select **Create**.

1. In the **Port** field, enter *LOGICAPP*.

1. In the **RFC destination**, select **LOGICAPP**.

1. To save your changes, select the green check mark:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/port-select-logic-app.png" alt-text="Screenshot that shows port selection for a Logic App." lightbox="media/howto-connect-on-premises-sap-to-azure/port-select-logic-app.png" border="false" :::

1. In the search box, enter **WE20**. The **Partner profiles** screen displays.

1. Expand the **Partner Profiles** folder and select the **Partner Type LS** folder.

1. In the **Partner No.** field, select the **S4HCLNT100** partner profile.

1. Select the **Create Outbound Parameter** button:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/outbound.png" alt-text="Screenshot that shows creation of an outbound parameter." lightbox="media/howto-connect-on-premises-sap-to-azure/outbound.png" border="false":::

1. In the **Partner Profiles: Outbound Parameters** dialog, enter *INTERNAL_ORDER* as the **Message Type**. In the **Outbound Options** tab, enter **LOGICAPP** in the **Receiver port** field. Select the **Pass IDoc Immediately** radio button. For the **Basic type**, enter *INTERNAL_ORDER01*. Select the **Save** button:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/outbound-parameters.png" alt-text="Screenshot that shows outbound parameters." lightbox="media/howto-connect-on-premises-sap-to-azure/outbound-parameters.png" border="false" :::

### Test your SAP to Azure Logic App Workflow

To test your SAP to Azure Logic App workflow, follow these steps:

1. In the search box, enter **WE19**. This displays the **Test Tool for IDoc Processing** screen.

1. Select **Using message type** and enter *INTERNAL_ORDER*.

1. Select **Create**.

1. Select the **EDICC** field to open the **Edit Control Record Fields** screen.

1. In the **Receiver** section, enter *LOGICAPP* as the  **PORT**, enter *S4HCLNT100* as the **Partner No.** , and enter *LS* as the **Part. Type**.

1. In the **Sender** section, enter *SAPS4H* as the  **PORT**, enter *S4HCLNT100* as the **Partner No.** , and enter *LS* as the **Part. Type**.

1. To save your changes, select the green check mark:

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/test-tool-idoc-processing.png" alt-text="Screenshot that shows the test tool for IDoc processing." lightbox="media/howto-connect-on-premises-sap-to-azure/test-tool-idoc-processing.png" border="false" :::

1. Select **Standard Outbound Processing** tab at the top of the screen.

1. In the **Outbound Processing of IDoc** dialog, select the green check button to start the IDoc message processing.

1. Open the storage browser in your Azure Storage account, select **File shares**, and check that there's a new **IDoc.xml** file in the **sap** folder.

    > [!NOTE]
    > To check for IDoc message processing errors, enter **WE09** in the SAP application search box, select a time range, and then select the **execute** button. The **IDoc Search for Business Content** screen opens and you can select each IDoc for processing errors in the table displayed.

### Microsoft on-premises data gateway

To send data to on-premises SAP systems from Azure Logic Apps, Microsoft provides an on-premises data gateway.

> [!NOTE]
> The SAP connector and on-premises data gateway aren't required to receive data from on-premises SAP systems into Azure Logic Apps in the cloud.

To install the on-premises data gateway:

1. Follow the steps [Install on-premises data gateway for Azure Logic Apps](/azure/logic-apps/logic-apps-gateway-install).

1. Follow the steps in [SAP Connector for Microsoft .NET](https://support.sap.com/en/product/connectors/msnet.html) to install the SAP Connector for Microsoft .NET 3.0 for Windows x64. SAP download access for the SAP portal is required. Contact SAP support if you don't have access.

1. Copy the four libraries *libicudecnumber.dll*, *rscp4n.dll*, *sapnco.dll*, and *sapnco_utils.dll* from the SAP Connector installation location (typically **C:\Program Files\SAP\SAP_DotNetConnector3_Net40_x64**) to the installation location of the data gateway (typically **C:\Program Files\On-premises data gateway**).

1. Restart the data gateway through the **On-premises data gateway** configuration tool included with the on-premises data gateway installer package you installed previously.

1. Create the on-premises data gateway Azure resource in the same Azure region as selected during the data gateway installation in the previous step. Select the name of your data gateway under **Installation Name**.

    To learn more, see [Connect to SAP from workflows in Azure Logic Apps](/azure/logic-apps/logic-apps-using-sap-connector).

    > [!NOTE]
    > If you encounter errors with the data gateway or the SAP connector, [enable debug tracing](/archive/blogs/david_burgs_blog/enable-sap-nco-library-loggingtracing-for-azure-on-premises-data-gateway-and-the-sap-connector).
