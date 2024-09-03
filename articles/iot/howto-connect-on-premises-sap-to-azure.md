---
title: "Connecting on-premises SAP systems to Azure"
description: "Step by step guide about that shows how to connect an on-premises SAP Enterprise Resource Planning system to Azure."
author: barnstee
ms.author: erichb
ms.service: iot
ms.topic: how-to #Don't change.
ms.date: 4/14/2024

#customer intent: As an ower of on-prem SAP systems, I want connect them to Azure so that I can add data from these SAP systems to my cloud analytics.

---

# Connect on-premises SAP systems to Azure 

Many manufacturers use on-premises SAP Enterprise Resource Planning (ERP) systems. Often, manufacturers connect SAP systems to Industrial IoT solutions, and use the connected system to retrieve data for manufacturing processes, customer orders, and inventory status. This article describes how to connect these SAP-based ERP systems.


## Prerequisites

The following prerequisites are required to complete the SAP connection as described in this article.

- An Azure Industrial IoT solution deployed in an Azure subscription as described in [Azure Industrial IoT reference architecture](tutorial-iot-industrial-solution-architecture.md)

 
## IEC 62541 Open Platform Communications Unified Architecture (OPC UA)

This solution uses IEC 62541 Open Platform Communications (OPC) Unified Architecture (UA) for all Operational Technology (OT) data. This standard is described [here](https://opcfoundation.org). 


## Reference Solution Architecture

:::image type="content" source="media/howto-connect-on-premises-sap-to-azure/architecture-iiot-sap.png" alt-text="Diagram of a simple IIoT architecture that shows all components." lightbox="media/howto-connect-on-premises-sap-to-azure/architecture-iiot-sap.png" border="false" :::


## Components

For a list of components, refer to [Azure Industrial IoT reference architecture](tutorial-iot-industrial-solution-architecture.md).


## Connect the reference solution to on-premises SAP Systems

The Azure services handling connectivity to your on-premises SAP systems is called Azure Logic Apps. Azure Logic Apps is a no-code Azure service to orchestrate workflows that can trigger actions.

> [!NOTE]
> If you want to try out SAP connectivity before connecting your real SAP system, you can deploy an `SAP S/4 HANA Fully-Activated Appliance` to Azure from [here](https://cal.sap.com/catalog#/applianceTemplates) and use that instead.

### Configure Azure Logic Apps to receive data from on-premises SAP systems

The Azure Logic Apps workflow is from your on-premises SAP system to Azure Logic Apps. It also stores the data sent from SAP in your Azure Storage Account. To create a new Azure Logic Apps workflow, follow these steps:

1. Deploy an instance of Azure Logic Apps in the same region you picked during deployment of this reference solution via the Azure portal. Select the consumption-based version.
1. From the Azure Logic App Designer, select the trigger template `When a HTTP request is received`.
1. Select `+ New step`, select `Azure File Storage`, and select `Create file`. Give the connection a name and select the storage account name of the Azure Storage Account. For `Folder path`, enter `sap`, for `File name` enter `IDoc.xml` and for `File content` select `Body` from the dynamic content. In the Azure portal, navigate to your storage account, select `Storage browser`, select `File shares` > `Add file share`. Enter `sap` for the name and select `Create`.
1. Hover over the arrow between your trigger and your create file action, select the `+` button, then select `Add a parallel branch`. Select `Azure Data Explorer` and add the action `Run KQL query` from the list of Azure Data Explorer (ADX) actions available. Specify the ADX instance (Cluster URL) name and database name of your Azure Data Explorer service instance. In the query field, enter `.create table SAP (name:string, label:string)`.
1. Save your workflow.
1. Select `Run Trigger` and wait for the run to complete. Verify that there are green check marks on all three components of your workflow. If you see any red exclamation marks, select the component for more information regarding the error.

Copy the `HTTP GET URL` from your HTTP trigger in your workflow. You'll need it when configuring SAP in the next step.

### Configure an on-premises SAP system to send data to Azure Logic Apps

1.	Sign in to the SAP Windows Virtual Machine
2.	Once at the Virtual Machine desktop, select on `SAP Logon` 
3.	Select `Log On` in the top left corner of the app

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/log-on.png" alt-text="Screenshot that shows an SAP sign-in form." lightbox="media/howto-connect-on-premises-sap-to-azure/log-on.png" border="false" :::

4.	Sign in with the `BPINST` user name, and `Welcome1` password
5.	In the top right corner, search for `SM59`. This should bring up the `Configuration of RFC Connections` screen. 

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/sm95-search.png" alt-text="Screenshot that shows configuration of RFC connections and search for SM95." lightbox="media/howto-connect-on-premises-sap-to-azure/sm95-search.png" border="false" :::

6.	Select on `Edit` and `Create` at the top of the app. 
7.	Enter `LOGICAPP` in the `Destination` field
8.	From the `Connection Type` dropdown, select `HTTP Connection to external server`
9.	Select The green check at the bottom of the window. 

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/connection-logic-app.png" alt-text="Screenshot that shows the details of a connection logic app." lightbox="media/howto-connect-on-premises-sap-to-azure/connection-logic-app.png" border="false" :::

10.	In the `Description 1` box, put `LOGICAPP`
11.	Select the `Technical Settings` tab and fill in the `Host` field with the `HTTP GET URL` from the logic app you copied (for example prod-51.northeurope.logic.azure.com). In `Port` put `443`. And in `Path Prefix` enter the rest of the `HTTP GET URL` starting with `/workflows/...`

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/add-get-url.png" alt-text="Screenshot that shows how to add a get url." lightbox="media/howto-connect-on-premises-sap-to-azure/add-get-url.png" border="false" :::

12.	Select the `Login & Security` tab. 
13.	Scroll down to `Security Options`  and set `SSL` to `Active`
14.	Select `Save`
15.	In the main app from step 5, search for `WE21`. This brings up the `Ports in IDoc processing`.
16.	Select the `XML HTTP` folder and select `Create`. 
17.	In the `Port` field, input `LOGICAPP`
18.	In the `RFC destination`, select `LOGICAPP`. 
19.	Select `Green Check` to `Save`

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/port-select-logic-app.png" alt-text="Screenshot that shows port selection for a Logic App." lightbox="media/howto-connect-on-premises-sap-to-azure/port-select-logic-app.png" border="false" :::

20. Create a partner profile for your Azure Logic App in your SAP system by entering `WE20` from the SAP system's search box, which will bring up the `Partner profiles` screen. 
21. Expand the `Partner Profiles` folder and select the `Partner Type LS` (Logical System) folder. 
21. Select on the `S4HCLNT100` partner profile. 
23. Select on the `Create Outbound Parameter` button below the `Outbound` table. 

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/outbound.png" alt-text="Screenshot that shows creation of an outbound parameter." lightbox="media/howto-connect-on-premises-sap-to-azure/outbound.png" border="false":::

24. In the `Partner Profiles: Outbound Parameters` dialog, enter `INTERNAL_ORDER` for `Message Type`. In the `Outbound Options` tab, enter `LOGICAPP` for `Receiver port`. Select the `Pass IDoc Immediately` radio button. For `Basic type` enter `INTERNAL_ORDER01`. Select the `Save` button.

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/outbound-parameters.png" alt-text="Screenshot that shows outbound parameters." lightbox="media/howto-connect-on-premises-sap-to-azure/outbound-parameters.png" border="false" :::

### Testing your SAP to Azure Logic App Workflow

To try out your SAP to Azure Logic App workflow, follow these steps:

1.	In the main app, search for `WE19`. This should bring up the `Test Tool for IDoc Processing` screen.  
2.	Select `Using message type` and enter `INTERNAL_ORDER` 
3.	Select `Create` at the top left corner of the screen. 
4.	Select the `EDICC` field. 
5.	A `Edit Control Record Fields`  screen should open up. 
6.	In the `Receiver` section: `PORT` enter `LOGICAPP`, `Partner No.` enter `S4HCLNT100`, `Part. Type` enter `LS`
7.	In the `Sender` section: `PORT` enter `SAPS4H`, `Partner No.` enter `S4HCLNT100`, `Part. Type` enter `LS`
8.	Select the green check at the bottom of the window. 

    :::image type="content" source="media/howto-connect-on-premises-sap-to-azure/test-tool-idoc-processing.png" alt-text="Screenshot that shows the test tool for IDoc processing." lightbox="media/howto-connect-on-premises-sap-to-azure/test-tool-idoc-processing.png" border="false" :::

9.	Select `Standard Outbound Processing` tab at the top of the screen. 
10.	In the `Outbound Processing of IDoc` dialog, select the green check button to start the IDoc message processing.
11. Open the Storage browser of your Azure Storage Account, select Files shares and check that a new `IDoc.xml` file was created in the `sap` folder.

    > [!NOTE]
    > To check for IDoc message processing errors, entering `WE09` from the SAP system's search box, select a time range and select the `execute` button. This brings up the `IDoc Search for Business Content` screen and you can select each IDoc for processing errors in the table displayed.

### Microsoft on-premises Data Gateway

Microsoft provides an on-premises data gateway for sending data **to** on-premises SAP systems from Azure Logic Apps.

> [!NOTE]
> To receive data **from** on-premises SAP systems to Azure Logic Apps in the cloud, the SAP connector and on-premises data gateway are **not** required.

To install the on-premises data gateway, complete the following steps:

1. Download and install the on-premises data gateway from [here](https://aka.ms/on-premises-data-gateway-installer). Pay special attention to the [prerequisites](/azure/logic-apps/logic-apps-gateway-install#prerequisites)! For example, if your Azure account has access to more than one Azure subscription, you need to use a different Azure account to install the gateway and to create the accompanying on-premises data gateway Azure resource. If so, create a new user in your Azure Active Directory.
1. If not already installed, download and install the Visual Studio 2010 (Visual C++ 10.0) redistributable files from [here](https://download.microsoft.com/download/1/6/5/165255E7-1014-4D0A-B094-B6A430A6BFFC/vcredist_x64.exe).
1. Download and install the SAP Connector for Microsoft .NET 3.0 for Windows x64 from [here](https://support.sap.com/en/product/connectors/msnet.html?anchorId=section_512604546). SAP download access for the SAP portal is required. Contact SAP support if you don't have this.
1. Copy the four libraries libicudecnumber.dll, rscp4n.dll, sapnco.dll, and sapnco_utils.dll from the SAP Connector's installation location (by default this is `C:\Program Files\SAP\SAP_DotNetConnector3_Net40_x64`) to the installation location of the data gateway (by default this is `C:\Program Files\On-premises data gateway`).
1. Restart the data gateway through the `On-premises data gateway` configuration tool that came with the on-premises data gateway installer package installed earlier.
1. Create the on-premises data gateway Azure resource in the same Azure region as selected during the data gateway installation in the previous step and select the name of your data gateway under `Installation Name`.

    You can access more details about the configuration steps [here](/azure/logic-apps/logic-apps-using-sap-connector?tabs=consumption).

    > [!NOTE]
    > If you run into errors with the Data Gateway or the SAP Connector, you can enable debug tracing by following [these steps](/archive/blogs/david_burgs_blog/enable-sap-nco-library-loggingtracing-for-azure-on-premises-data-gateway-and-the-sap-connector).
