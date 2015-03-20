<properties 
	pageTitle="BizTalk Integration API Apps in Microsoft Azure App Service | Azure" 
	description="Learn how to create the BizTalk integration API App and add the API App to your App; microservices" 
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

# BizTalk Integration API Apps in Microsoft Azure App Service


## What is an Integration API App
BizTalk Integration API Apps are existing, pre-built API Apps that can do data processing and produce an output. For example, some of these API Apps allow different file formats to work together and some apply business logic or application logic. The Integration API Apps include: 

API App | Description
--- | ---
<ul><li>X12 API App</li><li>AS2 Connector</li><li>EDIFACT API App</li><li>Trading Partner Management API App</li> | These API Apps provide Business-to-Business abilities. [Business-to-Business Connectors](app-service-logic-b2b-connectors.md) provides more details on these API Apps.
BizTalk Flat File Encoder | Makes flat file data (like Excel, csv) and XML data work together (interoperability). It can convert a  flat file instance to XML and vice versa.
BizTalk JSON Encoder | Makes JSON and XML data work together (interoperability). It can convert a JSON instance to XML and vice versa.
BizTalk Rules | You can implement and apply business logic or "rules" to control a business operation. Rules are dynamic and can change any time. BizTalk Rules allows users to enable business logic without writing any code and can be easily updated without impacting applications.
BizTalk Transform | Converts data from one format to another format. You can use different built-in functions to manipulate strings, complete arithmetic expressions, format the date  and time, and so on. 
BizTalk XML Validator | Validates XML data against predefined XML schemas. You can use   schemas based on a flat file instances, JSON instances, or existing connectors. 
BizTalk XPath Extractor | Lookup and extract data from XML content based on a specific XPath.
Wait |  Delay execution for a duration that you enter or until a specific time. When added to a Logic App, it can be used to delay execution of the entire App.

> [AZURE.NOTE] If the input xml has a simple node with an attribute (like "<authorid= ”1”>abc</author>"), then the JSON output of the library is { “author”: { “@id” : “1”, “#text”: “abc”}}. To handle the “Id” attribute, a new “#text” key is added for the text content of the node. To handle this kind of node, add a constant key. This is by design in the Newtonsoft.Json library. When you insert this into SQL, use “JSONOutput.Author.#text”; do not use “JsonOutput.Author”.

Using these API Apps, you can complete different messaging or data tasks. For example, using the BizTalk Rules API App, you can receive an order, and apply a discount when a specific  quantity is ordered. Or, you can charge a specific tax rate depending on the zip code. 

You can create as many API Apps as you want and create them easily. You can also reuse a single API Apps within multiple scenarios or workflows.

For example, let's say you have a business policy that applies a 10% discount when a customer orders 100 items of your product. In your App, you can add the BizTalk Rules API App that checks the quantity ordered and if it's over 100, apply the 10% discount. 

You can also expand on that business policy. Let's say you have a goal to increase sales in North Carolina. In addition to the 10% discount on orders of 100 or more, you also offer free shipping if the order comes from North Carolina. You can easily add this North Carolina condition to your existing BizTalk Rule. 

You can do this using these API Apps and without writing any code. Let's get started. 


## Create an API App

An integration API App can be created using the Azure portal or using REST APIs. 

### Create an API App using REST APIs
**INSERT LINK**


### Create an Integration API App in the Azure Portal

In the Azure portal, you can create an Integration API App when creating a Logic App, Web App, or Mobile App. Or, you can create one using its own blade. Both ways are easy so it depends on your needs or preferences. Some users prefer to create all the Integration API Apps with their specific properties first. Then, create the Logic App/Web App/Mobile App, and add the integration API Apps you created.  

The following steps create an integration API App using the API Apps blade:

1. In the Azure portal Startboard (the Home page), select **Marketplace**. **Web + mobile** lists all the existing API Apps and connectors. You can also **Search** for a specific integration API App.
2. Select the API App. In the new blade, select **Create**. 
3. Enter the properties: 

	Property | Description
--- | ---
Name | Enter any name for your API App. For example, you can name it *RulesDiscountTaxCode* or *APIAppValidateXML*.
App Service Plan | Lists your payment plan. You can change it if you need more or less resources.
Pricing Tier | Read-only property that lists the pricing category within your Azure subscription. 
Resource Group | Create a new one or use an existing group. [Using resource groups](../azure-preview-portal-using-resource-groups) explains this property. 
Subscription | Read-only property that lists your current subscription.
Location | The Geographic location that hosts your Azure service. 
Add to Startboard | Select this to add the integration API App to your Starboard (the home page).


## <a name="AddAPIApp"></a>Add the API App to your application 
Microsoft Azure App Service (or App Service for short) exposes different application types that can use these integration API Apps. You can create a new or add your existing integration API Apps to a Logic App, Mobile App, or a Web App. 

Within your App, simply selecting your integration API App from the Gallery automatically adds it to your App.

The following steps add an integration API App to a Logic App, Mobile App, or Web App: 

1. In the Azure portal Startboard (home page), go to the **Marketplace**, and search for your  Logic, Mobile, or Web App. 

	If you are creating a new App, search for Logic App, Mobile App, or Web App. Select the App and in the new blade, select **Create**. [Create a Logic App](app-service-logic-create-a-logic-app.md) lists the steps. 

2. Open your App and select **Triggers and Actions**. 

3. From the **Gallery**, select the integration API App, which automatically adds it to your App. 

4. Configure the integration API App:

	API App | Tasks
--- | ---
BizTalk Flat File Encoder | Enter a flat file, like Excel or a csv file that you want converted to XML. Or, enter an XML file that you want converted to a flat file.
BizTalk JSON Encoder | Enter a JSON file that you want converted to XML. Or, enter an XML file that you want converted to JSON. 
BizTalk Rules | Add your vocabularies and create your If THEN rules. See [Use BizTalk Rules](app-service-logic-use-biztalk-rules.md). 
BizTalk Transform | Enter an input XML schema and an output XML schema. Use the built-in functions to manipulate the incoming message or data to match your output XML schema. See [Transform XML documents](app-service-logic-transform-xml-documents.md). 
BizTalk XML Validator | Enter the XML to validate against a predefined XML schema. You can use   schemas based on a flat file instances, JSON instances, or existing connectors. 
BizTalk XPath Extractor | Lookup and extract data from XML content based on a specific XPath.
Wait |  Enter a time duration or a specific time to execute the Web App, Mobile App, or Logic App.

5. Select **OK** to save your changes.


## More Integration API App resources

[Create an EAI Logic App using VETR](app-service-logic-create-EAI-logic-app-using-VETR.md)
[Transform XML documents](app-service-logic-transform-xml-documents.md)
[Use BizTalk Rules](app-service-logic-use-biztalk-rules.md)
[What are Connectors and BizTalk API Apps](app-service-logic-what-are-biztalk-api-apps.md)


## More Connectors

[Enterprise connectors](app-service-logic-enterprise-connectors.md)
[Business-to-Business connectors](app-service-logic-b2b-connectors.md)
[Social connectors](app-service-logic-social-connectors.md)
[Protocol connectors](app-service-logic-protocol-connectors.md)
[App and Data Services connectors](app-service-logic-data-connectors)
[Connectors and API Apps List](app-service-logic-connectors-list.md)