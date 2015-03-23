<properties 
   pageTitle="Creating a B2B process in Microsoft Azure App Service" 
   description="Overview to create a Business-to-Business Process" 
   services="app-service\logic" 
   documentationCenter=".net,nodejs,java" 
   authors="harishkragarwal" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/22/2015"
   ms.author="hariag"/>


# Creating a B2B process


## Business Scenario 
Contoso and Northwind are two business partners. Contoso (the retailer) sends purchase orders to Northwind (the supplier) over an industry level transport such as AS2. Northwind stores all incoming orders in its Cloud storage. The purchase orders are XML messages between these two partners. Once the message is stored in Northwind's cloud storage then Northwind's internal processes handle the order from that point on.
 
The objective of this tutorial is to establish how Northwind can establish a business process via which it can receive messages (purchase orders in XML) from its partner Contoso over AS2 and then persist it in its Cloud storage.


## Capabilities demonstrated 
This tutorial helps showcase the following capabilities: 

- **Message transportation**: The retailer and supplier can be on different platforms but they can still achieve communication between the two. In this tutorial they are communicating over AS2 (Applicability Statement 2). AS2 is a popular way to transport data between trading partners in business-to-business communications.
- **Data persistence**: Once the message has been received over AS2 then Northwind wants to persist it before further processing. It can use a connector to persist messages in its Cloud storage. In this tutorial Azure Blobs is being leveraged as the cloud storage for Northwind.
- **Creating a business process**: In a flow, multiple API apps can be stitched together to achieve a business outcome as demonstrated here.


## Before you begin
This tutorial assumes that you have a basic understanding of Azure App Services, know how to create API apps and stitch a flow together.


## Steps to achieve the business scenario
**Create and configure the required API apps**

1. Create an instance of the **Azure Storage Blob Connector**. This requires the credentials to an Azure Storage account. Ensure that it is ready before you start creating this.
2. Create an instance of the **BizTalk Trading Partner Management**. This requires a blank SQL Database to function. Make sure that it is ready before you start creating this.
3. Create an instance of the **AS2 Connector**. This also requires a blank SQL Database to function. Make sure that it is ready before you start creating this. Additionally, if you want to archive messages as part of AS2 processing, you may provide credentials to an Azure Blob during its creation.
4. Configure the TPM (Trading Partner Management) service that is created:
	1. Browse to the instance of the TPM service created as part of the above steps.
	2. Use the **Partners** option under *Components* to **Add** a new partner named **Contoso** and in its profile add the required AS2 identity.
	3. Use the **Partners** option under *Components* to **Add** a new partner named **Northwind** and in its profile add the required AS2 identity.
	4. Use the **Agreements** option under *Components* to **Add** a new AS2 agreement between Northwind and Contoso. Northwind will be the hosted partner here, and Contoso will be the guest partner. As appropriate configure signing, encryption, compression, and acknowledgements during this agreement creation. In case certificates need to be used, they can be uploaded via the **Certificates** option when browsing the TPM service that is created.


## Create a flow / business process
1. Create a new flow in which the first step is AS2. Drag and drop the **AS2 Connector** and choose the instance already created. Choose trigger as the functionality

![][1]

2. Next drag and drop **Azure Storage Blob Connector** and choose the instance already created. Choose action as the functionality and within that select Upload Blob as the desired functionality. Configure as appropriate

3. Now create/deploy the flow


## Message Processing & Troubleshooting
1. It is time to test out the flow we have deployed. Send XML messages wrapped in AS2 (as per the AS2 agreement created above) to the AS2 endpoint surfaced by the AS2Connector instance that was created. You may need to configure the authentication for the endpoint so that it is publicly accessible.
2. Execution information about the flow is surfaced by browsing to the flow and then stepping into the flow instance which got executed
3. For AS2 processing information, browse to the AS2Connector instance involved, and then follow by stepping into the Tracking part. You can use the filters involved to restrict the view to the information that is desired.

![][2]

<!--Image references-->
[1]: ./media/app-service-logic-create-a-b2b-process/Flow.jpg
[2]: ./media/app-service-logic-create-a-b2b-process/Tracking.jpg
