<properties 
   pageTitle="BizTalk XML Services - Validate, Encode, Transform" 
   description="This topic covers the features of BizTalk XML services and details the Validate, Encode and Transform features." 
   services="biztalk-services" 
   documentationCenter=".net,nodejs,java" 
   authors="rajeshramabathiran" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="biztalk-services"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/05/2015"
   ms.author="rajram"/>

##XML services
###Mediating data between two data sources
Most Enterprise Application Integration (EAI) scenarios include mediating data between different sources. For example, most enterprises have a need to sync the data between their CRM system (e.g. salesforce) and ERP system (e.g. SAP).
There is a common set of needs for these mediation scenarios. Some of them include


- Ensure the data obtained from the different systems are in the right format


- Have the ability to handle structured data stored in excel, or a text file


- Have the ability to handle data returned by third party SaaS services


- Look up on some aspect of the incoming data and make decisions based on it


- Have the ability to convert data from one format to another format (for example, CRM systems might store the data in one format, and ERP might store the same data in some other format)

There are API Apps in the marketplace which helps the user handle these requirements. These include


- XML Validator

- Flat File Encoder


- JSON Encoder


- XPath Extractor


- Transform Service

###XML Validator

BizTalk XML Validator API App checks data against a specific set of schemas. Users will be able to upload one or more schemas, generate schemas from known sources such as flat file instances, JSON instances, etc.
####Create a new XML Validator API App
To create a new XML Validator API App, follow the instructions given below.


- Navigate to Azure Portal


- Click on New -> Everything -> API Apps


- Select “*BizTalk XML Validator*” from the list of API Apps.

		Note: You can use the search box to filter down the list of apps


- In the next blade, click “Create”


- New API App blade opens up. In this blade, please provide info about


	- Name – the name of the API App instance


	- Web hosting plan – create a new one, or select an existing one


	- Pricing tier – select a pricing tier from free until the top tier


	- Resource group – create a new one, or select an existing one


	- Subscription – Azure subscription in which the API App will be created


	- Location – Datacenter location
	
			Note: Select “East US” as the location


- Click on “Create”

After going through the steps listed above, a *BizTalk XML Validator* API App will be created based on the inputs provided.

####Configure BizTalk XML Validator
Configuration of BizTalk XML Validator involves specifying the schema(s) against which the incoming data will be validated.

Users can browse to the API App created either through


- Navigate to Azure portal -> Browse -> API App -> click on the name of the API App created using previous section, or


- Navigate to Azure portal -> Browse -> Resource Group -> Name of the resource group created using previous section -> click on the name of the API App created using previous section

Once the browse pane of the API App opens up, note that there is a part called schemas. Since by default no schemas are uploaded, schema count is 0.


- Click on the schemas part to launch the schemas blade


- Schemas blade lists down the schemas that are configured for the API app, as well as providing the ability to add new schemas
Add new schemas


- Clicking on Add schema provides three options,


	- Upload from file


	- Generate schema from flat file instance


	- Generate schema from JSON instance


- Once a schema has been added, it will be listed in the schemas blade. 

####Use XML Validator in a flow


- Users can create a new flow using New -> Flow, or select an existing flow.


- In the flow designer surface, users can select the *BizTalk XML Validator API* App, drag drop it, select the action (in this case, there is only one – Validate) and then configure its inputs. 
	- InputXml 
- Please note that output is populated automatically
	- Result
	- SchemaName
	- RootNode

- Output can be used in the subsequent actions in the flow

###Flat file Encoder
Flat file encoder API App allows the user to decode flat file content into XML data format, or encode the xml content into flat file.

Creation and configuration of Flat File Encoder API App is very similar to the one listed for BizTalk XML Validator API App. However, here are a few things to note


- Users can only upload flat file schemas

####Use Flat file Encoder in a flow


- Users can create a new flow using New -> Flow, or select an existing flow.


- In the flow designer surface, users can select the *Flat file Encoder* App, drag drop it, select the action and then configure its inputs. There are two actions available
	- Flat File to XML - This action decodes the flat file to XML. Its inputs and outputs are described below
		- Input
			- FlatFile
			- SchemaName
			- RootName 
		- Output
			- OutputXml
	- XML to Flat File - This action encodes XML to flat file. Its inputs and outputs are described below
		- Input
			- InputXml
		- Output
			- FlatFile  

- Output can be used in the subsequent actions in the flow

####JSON Encoder
JSON Encoder API App allows the user to decode the JSON instance into XML data format, or encode the xml content into JSON data format. This is very useful when interacting with third party SaaS services that use JSON as primary data format.

Creation and configuration of JSON Encoder API App is very similar to the one listed for BizTalk XML Validator API App

####Use JSON Encoder in a flow


- Users can create a new flow using New -> Flow, or select an existing flow.


- In the flow designer surface, users can select the *JSON Encoder* App, drag drop it, select the action and then configure its inputs. There are two actions available
	- JSON to XML - This action decodes the JSON instance to XML. Its inputs and outputs are described below
		- Input
			- RootNode
			- Namespace
			- InputJSON
		- Output
			- OutputXml
	- XML to JSON - This action encodes XML to JSON instance. Its inputs and outputs are described below
		- Input
			- InputXml
			- RemoveOuterEnvelope
		- Output
			- OutputJSON  

- Output can be used in the subsequent actions in the flow

###XPath Evaluator
XPath Evaluator API App allows the user to look up a specific value inside the incoming data. Users can specify an XPath and it will be used to extract the data from within the incoming XML instance.

Creation of XPath Evaluator API App is very similar to the one listed for BizTalk XML Validator. There is no user configuration required for this API App.

####Use XPath Evaluator in a flow


- Users can create a new flow using New -> Flow, or select an existing flow.


- In the flow designer surface, users can select the *XPath Evaluator* App, drag drop it, select the action (in this case, there is only one – ExtractUsingXPath) and then configure its inputs. 
	- XPath
	- InputXml 
- Please note that output is populated automatically
	- Result

- Output can be used in the subsequent actions in the flow

### **BizTalk Transform Service Overview**

BizTalk Transform service converts data from one format to another format. You can create a transformation - a ‘Map’ between a 'Source Schema (XML Schema)' and a ‘Target Schema (XML Schema)' in web based designer. You can also upload an already existing map (.trfm file) created in Visual Studio using ‘BizTalk Services SDK’. You can view the graphical representation of the map showing all the mapping links between source and target schemas. As you define your map, you can test the map using ‘Test’ functionality by providing sample input XML content. You can use various inbuilt functions such as string manipulations, conditional assignment, arithmetic expressions, date time formatters and looping constructs while defining your map. 

#### **Create a Transform Service API App**

1.	Login to Azure Portal and go to homepage.

2.	Click on New -> API App. If the ‘API App’ entry does not show up, click on ‘Everything’ and select ‘API App’ from the available list. 

	   ![][1]
 
3.	Alternatively, you can click on ‘Marketplace’ on the homepage and select ‘API App’ from the available list.

	   ![][2]
 
4.	All the API Apps available in the marketplace are shown.

	   ![][3]
 
5.	Browse for ‘BizTalk Transform Service’ by typing Transform and select ‘BizTalk Transform Service’.

	   ![][4] 
 
6.	In the new blade that opens, click on ‘Create’

       ![][5]
 
7.	In the new blade that opens, enter the following information and click ‘Create’


	- Name – give a name for your Transform API App 
	- Web Hosting Plan – select or create a web hosting plan 
	- Pricing Tier – Choose the pricing tier you want this App to reside in 
	- Resource Group – Select or create Resource group where the App should reside in 
	- Location – Choose the geographic location where you would like the App to be deployed
	
	   ![][6]

8.	Click on Create. Within a few minutes your BizTalk Transform Service API App will be created. 

#### **Create a Map** 

1.	Click on ‘Browse’ on Azure Portal (left of the screen) and select ‘API Apps (Microservice)’. If the ‘API Apps’ entry does not show up, click on ‘Everything’ and select ‘API Apps’ from the available list.

	   ![][7]
 
2.	The list of all ‘API Apps’ created in your Azure subscription are shown.

	   ![][8]
 
3.	Select the ‘BizTalk Transform Service’ created in the previous section.

4.	The configuration blade for the API App shows up. You can see the ‘Maps’ and ‘Schemas’ in Components section. 

	   ![][9]
 
5.	Select ‘Maps’ and a new blade with the list of maps shows up.

	   ![][10]
 
6.	Click on ‘Add’ icon on the top and the ‘Map creation’ blade shows up.

	   ![][11]
 
7.	Provide ‘Name’ and ‘Description’ fields as appropriate.

	   ![][12]
 
8.	Click on ‘Select Source Schema’ and the list of schemas are shown.

9.	Click on ‘Upload New Schema’. Browse for a ‘XML Schema (.xsd)’ file from your local machine and click OK. The uploaded schema is shown in the list of schemas.

	   ![][13]
 
10.	Select the uploaded schema from the list. If there is more than one root node in the uploaded schema, select the appropriate root node.

	   ![][14]
 
11.	Click on ‘Select Target Schema’ and upload target schema in the same way source schema is uploaded.

	   ![][15]
 
12.	Click on OK and a new map is created. It is shown in the list of maps.

	   ![][16]


### **Map Editor** 

Select the map and the map editor screen shows up. The key components of the Map Editor are

1.	Source Schema Tree
2.	Target Schema Tree
3.	Mapping Equation Column
4.	Equation Editor
5.	Functions
6.	Test Map
7.	View Map and Edit Map
8.	Delete Map

	   ![][17]
 
#### Simple Assignment

1.	Select a node in the ‘Target Schema’ tree. This becomes the active node for which the ‘mapping’ is going to happen.

2.	Select the node in the ‘Source Schema’ tree and the simple assignment is done. The ‘path’ of the selected source node is shown in the ‘Equation Editor’.


3.	Alternatively, you can simply type the source node using ‘#’ as the qualifier for a source node. 

             #Company.Department.Employee.Name

#### Using Functions ###
All the functions that are available to author a ‘Map Equation’ are available on the top of the screen in the map editor. The below examples describe the usage of a few functions to author a map equation. The list of all the functions and their syntax is explained in detail here.

##### Concatenating ‘First Name’ and ‘Last Name’

1.	Select a node in the ‘Target Schema’ tree. This becomes the active node for which the ‘mapping’ is going to happen.

2.	Click on ‘String Concatenate’ function icon on the top. In the Equation Editor, Concatenate() gets added. 

3.	Put the cursor at appropriate place and select the node which will be the first parameter of Concatenate.

4.	Type ‘,’ and then type “ “ – a simple space character as the second parameter.

5.	Type ‘,’ and select the second parameter of Concatenate from the source schema tree.

6.	Alternatively, you can simply type the complete ‘Map Equation’ in equation editor.

		Concatenate(#Company.Department.Employee.FirstName,” “,#Company.Department.Employee.LastName)


##### Conditional Assignment

Consider the scenario where you want to assign ‘PostalCode’ in source schema to ‘ZipCode’ in target schema when country is ‘US’ and ‘PinCode’ in target schema when country is India.

1.	Select ‘ZipCode’ node in the ‘Target Schema’ tree. This becomes the active node for which the ‘mapping’ is going to happen.

2.	Click on ‘If’ function icon on the top. In the Equation Editor, If() gets added. 

3.	Click on ‘Country’ node in Source tree and the equation editor has the below text.

		If(#Company.Department.Employee.Address.Country)

4.	Complete the condition by typing == “US”,

		If(#Company.Department.Employee.Address.Country == “US”,)

5.	Click on ‘PostalCode’ node in Source tree to provide the second parameter of the ‘If’ function

		If(#Company.Department.Employee.Address.Country == “US”, #Company.Department.Employee.Address.PostalCode)

6..	Alternatively, you can simply type the complete map equation in equation editor.

#### Test Map ###
1.	Click on ‘Test’ icon on the top and a new blade for testing the map shows up.
2.	Provide the input XML content by typing it in ‘Input XML’ editor. Or, if you have a sample XML instance handy, you can simply copy the content and paste it.
3.	Click on ‘Run’ and the transformed output XML is shown in ‘Output XML’ editor.

#### View Graphical Map
1.	To view the graphical representation of the map, click on ‘View’ icon on the top.

2.	Select any node in ‘Target Schema’ tree and all the linked nodes from source schema along with the functions are highlighted.

3.	To go back to editing map, click on ‘Edit’ icon

Note: ‘View’ mode is a read-only mode and it is not possible to edit the map.

### Use a Map (.trfm) created in Visual Studio

You can upload an already existing map (.trfm file) created in Visual Studio (VS) using ‘BizTalk Services SDK’ to the ‘BizTalk Transform Service API App’. Currently, it is only possible to use a map created in VS. To make any changes to the map, you need to edit the map (.trfm) in VS.

1.	Click on ‘Browse’ on Azure Portal (left of the screen) and select ‘API Apps’.

2.	If the ‘API Apps’ entry does not show up, click on ‘Everything’ and select ‘API Apps’ from the available list.

2.	The list of all ‘API Apps’ created in your Azure subscription are shown.

3.	Select the ‘BizTalk Transform Service’ created in the previous section.

4.	The configuration blade for the API App shows up. You can see the ‘Maps’ and ‘Schemas’ in Components section. 

5.	Select ‘Maps’ and a new blade with the list of maps shows up.

6.	Click on ‘Upload VS Map’ icon on the top and the ‘Upload VS Map (.trfm)’ blade shows up.

7.	Click on the File icon and browse for a ‘.trfm’ file from your local machine.

8.	Click on OK and a new map is created. It is shown in the list of maps.

### Use a Transform APIApp in a Flow App

Once the map has been authored and tested, it is now ready for consumption. Users can create a new flow by doing New->Flow. 

1. Within the flow, BizTalk Transform should be available in the gallery to the right. This can now be dragged and dropped onto the designer surface. 

2. Once this is done, there will be an option to choose which Transform API App to target. 

3. Provide the below parameters to complete the 'Transform' action configuration.

	- Map Name
	- Input XML


4. The output of the action 'Output XML' can be used in subsequent actions in the Flow.

<!--Image references-->
[1]: ./media/biztalk-create-app-transform-data/Create_Everything.png
[2]: ./media/biztalk-create-app-transform-data/Create_Marketplace.png
[3]: ./media/biztalk-create-app-transform-data/Create_APIApp.png
[4]: ./media/biztalk-create-app-transform-data/Search_TransformAPIApp.png
[5]: ./media/biztalk-create-app-transform-data/Select_TransformAPIApp.png
[6]: ./media/biztalk-create-app-transform-data/New_TransformAPIApp_Blade.png
[7]: ./media/biztalk-create-app-transform-data/Browse_APIApps.png
[8]: ./media/biztalk-create-app-transform-data/Select_APIApp_List.png
[9]: ./media/biztalk-create-app-transform-data/Configure_Transform_APIApp.png
[10]: ./media/biztalk-create-app-transform-data/Maps_List_Blade.png
[11]: ./media/biztalk-create-app-transform-data/Add_Map.png
[12]: ./media/biztalk-create-app-transform-data/Map_Name_Description.png
[13]: ./media/biztalk-create-app-transform-data/Map_Created_Upload_Schema.png
[14]: ./media/biztalk-create-app-transform-data/Map_Create_Select_Schema.png
[15]: ./media/biztalk-create-app-transform-data/Create_Map_All_Parameters.png
[16]: ./media/biztalk-create-app-transform-data/New_Map_In_List.png
[17]: ./media/biztalk-create-app-transform-data/Map_Editor.png


