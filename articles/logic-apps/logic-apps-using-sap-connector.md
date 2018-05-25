---
# required metadata
title: Connect to SAP - Azure Logic Apps | Microsoft Docs
description: Manage data and resources in SAP by automating workflows with Azure Logic Apps
author: divyaswarnkar
manager: cfowler
ms.author: divswa
ms.date: 05/27/2018
ms.topic: article
ms.service: logic-apps
services: logic-apps

# optional metadata
ms.reviewer: klam, daviburg, LADocs
ms.suite: integration
tags: connectors
---

# Manage data and resources in SAP by creating automated workflows in Azure Logic Apps

This article shows how you can access and work with 
data and resources in on-premises SAP systems from 
inside a logic app with the connectors for 
SAP Application Server and SAP Message Server. 
That way, you can create logic apps that automate tasks and 
workflows for managing data and resources in your SAP systems. 

This example connects to an SAP server from a logic app, 
requests an Intermediate Document (IDOC) over HTTP, 
and returns a response. The SAP connectors have actions, but not triggers. 
So, this example uses a non-SAP trigger as the first step in the workflow. 

If you don't have an Azure subscription yet, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>. 
If you're new to logic apps, review 
[What is Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and [Quickstart: Create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).
For connector-specific technical information, see these articles: 

* <a href="https://docs.microsoft.com/connectors/sapapplicationserver/" target="blank">SAP Application Server connector reference</a>
* <a href="https://docs.microsoft.com/connectors/sapmessageserver/" target="blank">SAP Message Server connector reference</a>

## Prerequisites

* The logic app where you want to access your SAP system 

* Your <a href="https://www.sap.com/products/application-server.html">SAP Application Server</a> 
or <a href="https://www.sap.com/products/application-server.html">SAP Message Server</a> 

* Download and install the latest [on-premises data gateway](https://www.microsoft.com/download/details.aspx?id=53127) 
on any on-premises computer. The gateway helps you 
securely access data and resources are on premises. 
You must install this gateway before you can continue. 
For more information, see [Install on-premises data gateway for Azure Logic Apps](../logic-apps/logic-apps/logic-apps-gateway-install.md).

* Download the latest SAP client library, which is currently 
<a href="https://softwaredownloads.sap.com/file/0020000000086282018" target="_blank">SAP Connector (NCo) 3.0.20.0 for Microsoft .NET Framework 4.0 and Windows 64bit (x64)</a>. 
Install this SAP NCo on the same computer 
where you install the on-premises data gateway. 

  * Make sure you install at least SAP NCo 3.0.20.0. 
  Earlier SAP NCo versions become deadlocked when two 
  or more IDoc messages are sent at the same time. 
  This condition blocks all later messages that are sent 
  to the SAP destination, causing the messages to time out.

  * Make sure you select SAP NCo for Windows 64-bit 
  because the data gateway runs only on 64-bit systems. 
  Otherwise, you get an "bad image" error because the data 
  gateway host service doesn't support 32-bit assemblies.

  * Make sure you select SAP NCo for .NET Framework 4.0 
  because both the data gateway host service and 
  Microsoft SAP adapter use .NET Framework 4.5. 
  
    The SAP NCo for .NET Framework 4.0 works with processes 
    that use the .NET runtime 4.0 to 4.7.1, while the SAP NCo 
    for .NET Framework 2.0 works with processes that use 
    the .NET runtime 2.0 to 3.5 and no longer works with 
    the latest on-premises data gateway.

<a name="add-action"></a>

## Add SAP actions

triggers and actions for connecting to your SAP system

1. Add the Request/Response trigger, and then select **New step**.

2. Select **Add an action**, and then select the SAP connector by typing `SAP` in the search field:    

     ![Select SAP Application Server or SAP Message Server](media/logic-apps-using-sap-connector/sap-action.png)

3. Select [**SAP Application Server**](https://wiki.scn.sap.com/wiki/display/ABAP/ABAP+Application+Server) 
or [**SAP Message Server**](http://help.sap.com/saphelp_nw70/helpdata/en/40/c235c15ab7468bb31599cc759179ef/frameset.htm), 
based on your SAP setup. If you don't have an existing connection, you are prompted to create one.

   1. Select **Connect via on-premises data gateway**, and enter the details for your SAP system:   

       ![Add connection string to SAP](media/logic-apps-using-sap-connector/picture2.png)  

   2. Under **Gateway**, select an existing gateway, or to install a new gateway, select **Install Gateway**.

        ![Install a new gateway](media/logic-apps-using-sap-connector/install-gateway.png)
  
   3. After you enter all the details, select **Create**. 
   Logic Apps configures and tests the connection, making sure that the connection works properly.

4. Enter a name for your SAP connection.

5. The different SAP options are now available. To find your IDOC category, select from the list. 
Or manually type in the path, and select the HTTP response in the **body** field:

     ![SAP action](media/logic-apps-using-sap-connector/picture3.png)

6. Add the action for creating an **HTTP Response**. 
The response message should be from the SAP output.

7. Save your logic app. Test it by sending an IDOC through the HTTP trigger URL. 
After the IDOC is sent, wait for the response from the logic app:   

     > [!TIP]
     > Check out how to [monitor your Logic Apps](../logic-apps/logic-apps-monitor-your-logic-apps.md).

Now that the SAP connector is added to your logic app, start exploring other functionalities:

- BAPI
- RFC

> [!NOTE]
> Current limitations: 
> - Your logic app times out if all steps required for the response don't finish within the 
> [request timeout limit](./logic-apps-limits-and-config.md). In this scenario, requests might get blocked. 
> - The file picker does not display all the available fields. In this scenario, you can manually add paths.

## Connector reference

For technical details, such as triggers, actions, and limits, 
as described by the connectors' Swagger files, 
see these reference pages for these connectors: 

* [SAP Application Server](/connectors/sapapplicationserver/)
* [SAP Message Server](/connectors/sapmessageserver/)

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

- Learn how to validate, transform, and other BizTalk-like functions in the [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md). 
- 

## Next steps

* [Connect to on-premises systems](../logic-apps/logic-apps-gateway-connection.md) from logic apps
* Learn about other [Logic Apps connectors](../connectors/apis-list.md)
