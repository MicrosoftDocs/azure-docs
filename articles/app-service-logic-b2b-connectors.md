<properties 
	pageTitle="Business-to-Business Connectors and API Apps in Microsoft Azure App Service | Azure" 
	description="Learn how to create EDI, EDIFACT, AS2, and TPM connectors and add the API App to your App; microservices" 
	services="app-service-logic" 
	documentationCenter="" 
	authors="MandiOhlinger" 
	manager="dwrede" 
	editor="cgronlun"/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/20/2015" 
	ms.author="mandia"/>

# Business-to-Business Connectors and API Apps in Microsoft Azure App Service


## What is a Business-to-Business Connector or API App
Business-to-Business (B2B) functionality includes existing, pre-built API Apps that allow different companies, divisions, applications, and so on to communicate using AS2, EDI, and EDIFACT. The B2B API Apps include: 

Connector or API App | Description
--- | ---
AS2 Connector | A connector that receives and sends messages using the AS2 transport. The connector transports data securely and reliably over the Internet.
BizTalk EDIFACT | An API App that receives and sends messages using EDIFACT. EDIFACT is also commonly referred to as UN/EDIFACT (United Nations/Electronic Data Interchange For Administration, Commerce and Transport) and is widely used across industries.
BizTalk X12 | An API App that receives and sends messages using the X12 protocol. X12 is also commonly referred to as ASC X12 (Accredited Standards Committee X12) and is widely used across industries.
BizTalk Trading Partner Management | An API App that creates business-to-business (B2B) relationships using partners and agreements. These relationships utilize the AS2, EDIFACT, and X12 protocol.


Using these API Apps, you can complete different EDI messaging tasks. For example, using the AS2 connector, you can securely receive and send different types of messages (EDI, XML, Flat-File, and so on) to a customer, a division within your company like Human Resources, or anyone that uses AS2. 

You can create as many API Apps as you want and create them easily. You can also reuse a single API App within multiple scenarios or workflows.

You can do this without writing any code. Let's get started. 


## Requirements to Get Started
When you create a B2B API App, there are some required resources. These items must be created by you before they can be used within the API App. These requirements include: 

Requirement | Description
--- | ---
Azure SQL Database | Stores B2B items including partner data, schemas, certificates, and agreeements. <br/><br/>[Create an Azure SQL Database](sql-database-create-configure.md)
Azure Storage container | Stores message properties when AS2 archiving is enabled. If you don't need AS2 message archiving, a Storage container is not needed.<br/><br/>[About Azure Storage Accounts](storage-create-storage-account.md)
Service Bus Namespace and its Key values | Stores X12 and EDIFACT batching data. If you don't need batching, a Service Bus namespace is not needed.<br/><br/>[Create a Service Bus Namespace](http://msdn.microsoft.com/library/azure/hh690931.aspx)


## Create an API App

A B2B API App can be created using the Azure portal or using REST APIs. 

### Create an API App using REST APIs
**INSERT LINK**


### Create a B2B API App in the Azure Portal

In the Azure portal, you can create a B2B API App when creating a Logic App, Web App, or Mobile App. Or, you can create one using its own blade. Both ways are easy so it depends on your needs or preferences. Some users prefer to create all the B2B API Apps with their specific properties first. Then, create the Logic App/Web App/Mobile App, and add the B2B API Apps you created.  

The following steps create a B2B API App using the API Apps blade:

1. In the Azure portal Startboard (the Home page), select **Marketplace**. **Web + mobile** lists all the existing API Apps and connectors. You can also **Search** for a specific B2B API App.
2. Select the API App. In the new blade, select **Create**. 
3. Enter the properties: 

	Property | Description
--- | ---
Name | Enter any name for your B2B API App. For example, you can name it *AS2Connector*,  or *EDI850APIApp*.
Package Settings | Enter the settings specific to that API App, like Service Bus namespace. You can do this now or enter these settings when you add the B2B API App to your App. <br/><br/>See [Add the API App](#AddAPIApp) in this topic for the API App-specific properties. 
App Service Plan | Lists your payment plan. You can change it if you need more or less resources.
Pricing Tier | Read-only property that lists the pricing category within your Azure subscription. 
Resource Group | Create a new one or use an existing group. [Using resource groups](../azure-preview-portal-using-resource-groups) explains this property. 
Subscription | Read-only property that lists your current subscription.
Location | The Geographic location that hosts your Azure service. 
Add to Startboard | Select this to add the B2B API App to your Starboard (the home page).


## <a name="AddAPIApp"></a>Add the API App to your application 
Microsoft Azure App Service (or App Service for short) exposes different application types that can use these B2B API Apps. You can create a new or add your existing B2B API Apps to a Logic App, Mobile App, or a Web App. 

Within your App, simply selecting your B2B API App from the Gallery automatically adds it to your App. Add the properties, and its ready to be used.

The following steps add a B2B API App to a Logic App, Mobile App, or Web App: 

1. In the Azure portal Startboard (home page), go to the **Marketplace**, and search for your  Logic, Mobile, or Web App. 

	If you are creating a new App, search for Logic App, Mobile App, or Web App. Select the App and in the new blade, select **Create**. [Create a Logic App](app-service-logic-create-a-logic-app.md) lists the steps. 

2. Open your App and select **Triggers and Actions**. 

3. From the **Gallery**, select the **BizTalk Trading Partner Management** API App, which automatically adds it to your App. 

	> [AZURE.IMPORTANT] The AS2 connector and X12, EDIFACT API Apps require a TPM Instance. So, create it first. 

	Enter the following property: 

	Property | Description
--- | --- 
Database Connection String | Enter the connection string to the Azure SQL Database you created. When you create B2B agreements and add partners, this information is stored in this Azure SQL Database.

4. Now, add your AS2 connector, the X12 API App, or the EDIFACT API App: 

	**AS2 connector properties**

	Property | Description
--- | --- 
Database Connection String | Enter the connection string to the Azure SQL Database you created. When you create B2B agreements and add partners, this information is stored in this Azure SQL Database.
Enable Archiving for incoming messages | Optional. Enable this property to store the message properties of an incoming AS2 message received from a partner. 
Azure Blob Storage Connection String  | Enter the connection string to the Azure Blob Storage container you created. When Archiving is enabled, the encoded and decoded messages are stored in this Storage container.
TPM Instance Name | Enter the name of the **BizTalk Trading Partner Management** API App you previously created. When you create the AS2 connector, this connector executes only the AS2 agreements within this specific TPM instance.

	**X12 and EDIFACT API Apps properties**  

	Property | Description
--- | --- 
Database Connection String | Enter the connection string to the Azure SQL Database you created. When you create B2B agreements and add partners, this information is stored in this Azure SQL Database.
Service Bus Namespace | Enter the Service Bus namespace you created. Required only when batching is enabled. 
Service Bus Namespace Shared Access Key name | Enter the Service Bus namespace Access Key you created. Required only when batching is enabled. 
Service Bus Namespace Shared Access Key value | Enter the Service Bus namespace Access Key value you created. Required only when batching is enabled. 
TPM Instance Name | Enter the name of the **BizTalk Trading Partner Management** API App you previously created. When you create the X12 or EDIFACT API App, this API App executes only the X12/EDFIACT agreements within this specific TPM instance.

5. Select **OK** to save your changes. 


## More B2B resources

[Creating a B2B process](app-service-logic-create-a-b2b-process.md)
[Creating a Trading Partner Agreement](app-service-logic-create-a-trading-partner-agreement.md)
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)


## Read about Logic Apps and Web Apps
[What are Logic Apps?](app-service-logic-what-are-logic-apps.md) 
[Websites and Web Apps in Azure App Service](app-service-web-app-azure-portal.md)


## More Connectors

[BizTalk Integration connectors](app-service-logic-integration-connectors.md)
[Enterprise connectors](app-service-logic-enterprise-connectors.md)
[Social connectors](app-service-logic-social-connectors.md)
[Protocol connectors](app-service-logic-protocol-connectors.md)
[App and Data Services connectors](app-service-logic-data-connectors)
[Connectors and API Apps List](app-service-logic-connectors-list.md)