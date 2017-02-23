---
title: Connect to an on-premises SAP system in Azure logic apps | Microsoft Docs
description: Use the on-premises data gateway to connect to an on-premises SAP system in your logic app workflow 
services: logic-apps
documentationcenter: 
author: padmavc
manager: anneta


ms.service: logic-apps
ms.devlang: wdl
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/01/2017
ms.author: padmavc

---
# Use the SAP connector in your logic app 

The on-premises data gateway enables you to manage data, and securely access resources that are on-premises. Use this topic to connect to an on-premises SAP system to request an IDOC over HTTP, and send the response back.    

 > [!NOTE]
> Current limitations:
 > - Logic Apps times out if there is a request that exceeds 90 seconds. In this scenario, requests may be blocked. 
 > - The file picker does not display all the available fields. In this scenario, you can manually add paths.

## Prerequisites
- Install and configure the latest [on-premises data gateway](https://www.microsoft.com/download/details.aspx?id=53127) version 1.15.6150.1 or newer. [How to connect to the on-premises data gateway in a logic app](http://aka.ms/logicapps-gateway) lists the steps. The gateway must be installed on an on-premises machine before you can proceed.

- Download and install the latest SAP client library on the same machine where you installed the data gateway. Use any of the following SAP versions: 
	- SAP Server
		- SAP ECC 6.0 Unicode
		- SAP ECC 6.0 Unicode with EHP 4.0
		- SAP ECC 6.0 with EHP 7.0 and all EHP previous versions
 
	- SAP Client
		- SAP RFC SDK 7.20 UNICODE
		- SAP .NET Connector (NCo) 3.0

## Add the SAP connector

The SAP connector has Actions. It does not have any Triggers. As a result, use another trigger at the start of your workflow. 

1. Add the Request/Response trigger, and then select **New step**.
2. Select **Add an action**, and then select the SAP connector by typing `SAP` in the search field:    
 ![Select SAP Application Server or SAP Message Server](media/logic-apps-using-sap-connector/picture1.png)

3. Select **SAP** [application server](https://wiki.scn.sap.com/wiki/display/ABAP/ABAP+Application+Server) or [message server](http://help.sap.com/saphelp_nw70/helpdata/en/40/c235c15ab7468bb31599cc759179ef/frameset.htm), depending on your SAP setup. If you don't have an existing connection, you are prompted to create one: 
	1. Select **Connect via on-premises data gateway**, and enter the details for your SAP system:   
 ![Add connection string to SAP](media/logic-apps-using-sap-connector/picture2.png)  
	2. Select an existing **Gateway**. Or, select **Install Gateway** to install a new gateway:    
 ![Install a new gateway](media/logic-apps-using-sap-connector/install-gateway.png)
  
	3. After you enter all the details, select **Create**. Logic Apps configures and tests the connection to make sure it's working properly.

4. Enter a name for your SAP connection.

5. The different SAP options are now available. Use the file picker to find your IDOC category. Or manually type in the path, and select the HTTP response in the **body** field:     
 ![SAP ACTION](media/logic-apps-using-sap-connector/picture3.png)

6. Create an HTTP Response by adding a new action. The response message should be from the SAP output.

7. Save your logic app. Test it by sending an IDOC through the HTTP trigger URL. Once the IDOC is sent, wait for the response from the logic app:   

  > [!TIP]
  > Check out how to [monitor your Logic Apps](../logic-apps/logic-apps-monitor-your-logic-apps.md).

Now that the SAP connector is added to your logic app, start exploring other functionalities:

  - BAPI
  - RFC

## Next steps
- Learn how to validate, transform, and other BizTalk-like functions in the [Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md). 
- Create an [on-premises connection](../logic-apps/logic-apps-gateway-connection.md) to Logic Apps.
