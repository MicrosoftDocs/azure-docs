<properties 
	pageTitle="Business-to-Business Connectors and API Apps in Microsoft Azure App Service | Azure" 
	description="Learn how to create and configure EDI, EDIFACT, AS2, and TPM connectors; microservices architecture" 
	services="app-service\logic" 
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
	ms.date="03/31/2015" 
	ms.author="mandia"/>

# Business-to-Business Connectors and API Apps in Microsoft Azure App Service
Microsoft Azure App Service (or App Service for short) includes many BizTalk API Apps that are vital to integration environments. These API Apps are based on concepts and tools used within BizTalk Server, but are now available as part of Azure App Service. 

One category of these API Apps are the Business-to-Business (B2B) API Apps. Using these B2B API Apps, you can easily add partners, create agreements, and do everything as you would on-premises using EDI, AS2, and EDIFACT.  

These B2B API Apps offer "Trigger" and "Action" capabilities. A Trigger starts a new instance based on a specific event, like the arrival of an X12 message from a partner. An Action is the result, like after receiving an X12 message, then send the message using AS2.


## What is a Business-to-Business Connector or API Apps
The Business-to-Business (B2B) feature includes existing, pre-built API Apps that allow different companies, divisions, applications, and so on to communicate using AS2, EDI, and EDIFACT. 

The B2B API Apps include: 

Connector or API Apps | Description
--- | ---
BizTalk Trading Partner Management | An API App that creates business-to-business (B2B) relationships using partners and agreements. These relationships utilize the AS2, EDIFACT, and X12 protocol.<br/><br/>The TPM API App is the base requirement of the AS2 connector, and the X12 or EDIFACT API Apps. 
AS2 Connector | A connector that receives and sends messages using the AS2 transport. The connector transports data securely and reliably over the Internet.
BizTalk EDIFACT | An API App that receives and sends messages using EDIFACT. EDIFACT is also commonly referred to as UN/EDIFACT (United Nations/Electronic Data Interchange For Administration, Commerce and Transport) and is widely used across industries.
BizTalk X12 | An API App that receives and sends messages using the X12 protocol. X12 is also commonly referred to as ASC X12 (Accredited Standards Committee X12) and is widely used across industries. 


Using these API Apps, you can complete different EDI messaging tasks. For example, using the AS2 connector, you can securely receive and send different types of messages (EDI, XML, Flat-File, and so on) to a customer, a division within your company like Human Resources, or anyone that uses AS2. 

You can create as many API Apps as you want and create them easily. You can also reuse a single API App within multiple scenarios or workflows.

You can do this without writing any code. Let's get started. 


## Requirements to Get Started
When you create B2B API Apps, there are some required resources. These items must be created by you before they can be used within other API Apps. These requirements include: 

Requirement | Description
--- | ---
Azure SQL Database | Stores B2B items including partners, schemas, certificates, and agreeements. Each of the B2B API Apps requires its own Azure SQL Database. <br/><br/>**Note** Copy the connection string to this database.<br/><br/>[Create an Azure SQL Database](sql-database-create-configure.md)
Azure Blob Storage container | Stores message properties when AS2 archiving is enabled. If you don't need AS2 message archiving, a Storage container is not needed. <br/><br/>**Note** If you are enabling archiving, copy the connection string to this Blob Storage.<br/><br/>[About Azure Storage Accounts](storage-create-storage-account.md)
Service Bus Namespace and its Key values | Stores X12 and EDIFACT batching data. If you don't need batching, a Service Bus namespace is not needed.<br/><br/>**Note** If you are enabling batching, copy these values.<br/><br/>[Create a Service Bus Namespace](http://msdn.microsoft.com/library/azure/hh690931.aspx)
TPM Instance | A BizTalk Trading Partner Management (TPM) instance is required to create an AS2 connector and X12 or EDIFACT API App. When you create the TPM API App, you are creating the TPM Instance. <br/><br/>**Note** Know the name of your TPM API App. 


## Create the API Apps
B2B API Apps can be created using the Azure portal or using REST APIs. 


### Create the API Apps using REST APIs
[See the documentation on how to use the REST APIs.](http://go.microsoft.com/fwlink/p/?LinkId=529766)


### Create the B2B API Apps in the Azure Portal
In the Azure portal, you can create B2B API Apps when creating Logic Apps, Web Apps, or Mobile Apps. Or, you can create one using its own blade. Both ways are easy so it depends on your needs or preferences. Some users prefer to create all the B2B API Apps with their specific properties first. Then, create the Logic Apps/Web Apps/Mobile Apps, and add the B2B API Apps you created.  

The following steps create the B2B API Apps using the API Apps blade.


#### Create the BizTalk Trading Partner Management (TPM) API Apps

> [AZURE.NOTE] A BizTalk Trading Partner Management (TPM) instance is required to create an AS2 connector and X12 or EDIFACT API App. When you create the TPM API App, you are creating the TPM Instance.

The following steps create the TPM instance:

1. In the Azure portal Startboard (the Home page), select **Marketplace**. **API Apps** lists all the existing API Apps and connectors. You can also **Search** for the specific B2B API Apps.
2. Select **BizTalk Trading Partner Management**. In the new blade, select **Create**. 
3. Enter the properties: 

	Property | Description
--- | ---
Name | Enter any name for the TPM instance. For example, you can name it *AccountsPayableTPM*.
Package Settings | Enter the ADO.NET **Database Connection String** to the Azure SQL Database you created. <br/><br/>When you copy the connection string, the password is not added to the connection string. Be sure to enter the password in the connection string.
App Service Plan | Lists your payment plan. You can change it if you need more or less resources.
Pricing Tier | Read-only property that lists the pricing category within your Azure subscription. 
Resource Group | Create a new one or use an existing group. All API Apps and connectors for your Logic Apps, Web Apps, and Mobile Apps must be in the same Resource Group. <br/><br/>[Using resource groups](resource-group-overview.md) explains this property. 
Subscription | Read-only property that lists your current subscription.
Location | The Geographic location that hosts your Azure service. 
Add to Startboard | Select this to add the B2B API App to your Starboard (the home page).

4. Select **Create**. 

After the TPM API APP (TPM Instance) is created, you can then create the AS2 connector and/or the X12 or EDIFACT API Apps. 


#### Create the AS2 connector

1. In the Azure portal Startboard (the Home page), select **Marketplace**. **API Apps** lists all the existing API Apps and connectors. You can also **Search** for the specific B2B API Apps.
2. Select **AS2 Connector**. In the new blade, select **Create**. 
3. Enter the properties: 

	Property | Description
--- | ---
Name | Enter any name for the AS2 connector. For example, you can name it *AS2Connector*.
Package Settings | Enter the settings specific to that API App, like the TPM Instance name. <br/><br/>See [Add AS2 Package Settings](#AddAS2Conn) in this topic for the specific properties. 
App Service Plan | Lists your payment plan. You can change it if you need more or less resources.
Pricing Tier | Read-only property that lists the pricing category within your Azure subscription. 
Resource Group | Create a new one or use an existing group. [Using resource groups](resource-group-overview.md) explains this property. 
Subscription | Read-only property that lists your current subscription.
Location | The Geographic location that hosts your Azure service. 
Add to Startboard | Select this to add the B2B API App to your Starboard (the home page).

	**<a name="AddAS2Conn"></a>AS2 connector Package Settings**

	Property | Description
--- | --- 
Database Connection String | Enter the ADO.NET connection string to the Azure SQL Database you created. When you copy the connection string, the password is not added to the connection string. Be sure to enter the password in the connection string before you paste.
Enable Archiving for incoming messages | Optional. Enable this property to store the message properties of an incoming AS2 message received from a partner. 
Azure Blob Storage Connection String  | Enter the connection string to the Azure Blob Storage container you created. When Archiving is enabled, the encoded and decoded messages are stored in this Storage container.
TPM Instance Name | Enter the name of the **BizTalk Trading Partner Management** API App you previously created. When you create the AS2 connector, this connector executes only the AS2 agreements within this specific TPM instance.

4. Select **Create**. 


#### Create the X12 or EDIFACT API Apps

1. In the Azure portal Startboard (the Home page), select **Marketplace**. **API Apps** lists all the existing API Apps and connectors. You can also **Search** for the specific B2B API Apps.
2. Select **BizTalk X12** or **BizTalk EDIFACT**. In the new blade, select **Create**. 
3. Enter the properties: 

	Property | Description
--- | ---
Name | Enter any name for the B2B API App. For example, you can name it *EDI850APIApp*.
Package Settings | Enter the settings specific to that API App, like the TPM Instance name. <br/><br/>See [X12 or EDIFACT Package Settings](#AddX12) in this topic for the specific properties. 
App Service Plan | Lists your payment plan. You can change it if you need more or less resources.
Pricing Tier | Read-only property that lists the pricing category within your Azure subscription. 
Resource Group | Create a new one or use an existing group. [Using resource groups](resource-group-overview.md) explains this property. 
Subscription | Read-only property that lists your current subscription.
Location | The Geographic location that hosts your Azure service. 
Add to Startboard | Select this to add the B2B API App to your Starboard (the home page).

	**<a name="AddX12"></a>X12 and EDIFACT API Apps Package Settings**  

	Property | Description
--- | --- 
Database Connection String | Enter the ADO.NET connection string to the Azure SQL Database you created. When you copy the connection string, the password is not added to the connection string. Be sure to enter the password in the connection string before you paste.
Service Bus Namespace | Enter the Service Bus namespace you created. Required only when batching is enabled. 
Service Bus Namespace Shared Access Key name | Enter the Service Bus namespace Access Key you created. Required only when batching is enabled. 
Service Bus Namespace Shared Access Key value | Enter the Service Bus namespace Access Key value you created. Required only when batching is enabled. 
TPM Instance Name | Enter the name of the **BizTalk Trading Partner Management** API App you previously created. When you create the X12 or EDIFACT API Apps, this API App executes only the X12/EDFIACT agreements within this specific TPM instance.

4. Select **Create**. 


## Add your partners, agreements, certificates, and schemas 
In the Azure Management Portal, open your TPM API App. In the **Components** section, add your Partners, Agreements, Certificates, and Schemas. 

You can also add agreements to your AS2 connectors, X12 API Apps, and EDIFACT API Apps. 


## Monitor your API Apps
In the Azure Management Portal, open your TPM API App. In the **Operations** section, you can view different management operations. For example, you can:

- View Informational and Error events
- View memory usage and thread count of the worker process (w3wp)
- View the Application and web server logs

More at [Monitor your Logic Apps](app-service-logic-monitor-your-logic-apps.md).


## Add the API Apps to your application 
Microsoft Azure App Service exposes different application types that can use these B2B API Apps. You can create a new or add your existing B2B API Apps to Logic Apps, Mobile Apps, or a Web Apps. 

Within your App, simply selecting the B2B API Apps from the Gallery automatically adds it to your App.  

> [AZURE.IMPORTANT] To add connectors and API Apps you previously created, create the Logic Apps, Mobile Apps, or Web Apps in the same Resource Group. 

The following steps add the B2B API Apps to Logic Apps, Mobile Apps, or Web Apps: 

1. In the Azure portal Startboard (home page), go to the **Marketplace**, and search for your  Logic, Mobile, or Web Apps. 

	If you are creating a new App, search for Logic Apps, Mobile Apps, or Web Apps. Select the App and in the new blade, select **Create**. [Create a Logic App](app-service-logic-create-a-logic-app.md) lists the steps. 

2. Open your App and select **Triggers and Actions**. 

3. From the **Gallery**, select the B2B API App, which automatically adds it to your App. You can also create a new B2B API App.

	> [AZURE.IMPORTANT] The AS2 connector and X12, EDIFACT API Apps require a TPM Instance. So if you're creating new B2B API Apps, create the TPM API App first, and then create the AS2 connector, X12 API App, or EDIFACT API App. 

4. Select **OK** to save your changes. 


## More B2B resources

[Creating a B2B process](app-service-logic-create-a-b2b-process.md)<br/>
[Creating a Trading Partner Agreement](app-service-logic-create-a-trading-partner-agreement.md)<br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)


## Read about Logic Apps and Web Apps
[What are Logic Apps?](app-service-logic-what-are-logic-apps.md)<br/>
[Websites and Web Apps in Azure App Service](app-service-web-app-azure-portal.md)


## More Connectors
[BizTalk Integration connectors](app-service-logic-integration-connectors.md)<br/>
[Enterprise connectors](app-service-logic-enterprise-connectors.md)<br/>
[Social connectors](app-service-logic-social-connectors.md)<br/>
[Protocol connectors](app-service-logic-protocol-connectors.md)<br/>
[App + Data Services connectors](app-service-logic-data-connectors.md)<br/>
[Connectors and API Apps List](app-service-logic-connectors-list.md)<br/><br/>
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)