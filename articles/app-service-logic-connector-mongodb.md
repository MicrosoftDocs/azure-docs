<properties 
   pageTitle="MongoDB Connector" 
   description="How to use the MongoDB Connector" 
   services="app-service-logic" 
   documentationCenter=".net,nodejs,java" 
   authors="dwrede" 
   manager="dwrede" 
   editor=""/>

<tags
   ms.service="app-service-logic"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="03/20/2015"
   ms.author="sutalasi"/>


# MongoDB Connector #

Connectors can be used in Logic apps to fetch, process or push data as a part of a flow. There are scenarios where you may need to work with MongoDB database on Azure MongoDB or MongoDB Server (which is installed on-premise and behind the firewall). By leveraging the MongoDB Connector in your flow you can achieve a variety of scenarios. A few examples:  

1.	Expose a section of the data residing in your MongoDB database via a web or mobile user front end.
2.	Insert data to your MongoDB database table for storage (Example: Employee Records, Sales Orders etc.)
3.	Extract data from MongoDB for use in a business process

For these scenarios, the following needs to be done: 

1. Create an instance of the MongoDB Connector API App
2. Establish hybrid connectivity for the API App to communicate with the on-premise SAP. This step is optional and required only for on-premises MongoDB server and not for MongoDB Azure.
3. Use the created API App in a logic app to achieve the desired business process

###Basic Triggers and Actions
		
- New Document (Trigger)
- Add Document
- Update Document
- Get Documents
- Upsert Document
- Delete Document


## Create an instance of the MongoDB Connector API App ##

To use the MongoDB Connector, you need to create an instance of the MongoDB Connector' API App. The can be done as follows:

1. Open the Azure Marketplace using the '+ NEW' option at the bottom left of the Azure Portal
2. Browse to “Web and Mobile > API apps” and search for “MongoDB Connector”
3. Provide the generic details such as Name, App service plan, and so on in the first blade
4. As part of Package settings, provide

    - the Mongo server Credentials
    - an Azure Service Bus connection string (in case of on-premises MongoDB server) and set the value of On-Premises to "true". This will be used to establish hybrid connectivity with your on-premise SAP. 

## Hybrid Configuration (Optional) ##

Note: This step is required only if you are using MongoDB Server on-premises behind firewall.

Browse to the just created API App via Browse -> API Apps -> <Name of the API App just created> and you will see the following behavior. The setup is incomplete as the hybrid connection is not yet established.


To establish hybrid connectivity do the following:

1. Copy the primary connection string
2. Click on the 'Download and Configure' link
3. Follow the install process which gets initiated and provide the primary connection string when asked for
4. Once the setup process is complete then a dialog similar to this would show up



Now when you browse to the created API App again then you will observe the hybrid connection status as Connected. 


Note: in case you wish to switch to the secondary connection string then just re-do the hybrid setup and provide the secondary connection string in place of the primary connection string  

## Usage in a Logic App ##

MongoDB Connector can be used as an trigger/action in a logic app. The trigger and all the actions support both JSON and XML data format. For every table that is provided as part of package settings, there will be a set of JSON actions and a set of XML actions. If you are using XML trigger/action, you can use Transform API App to convert data into another XML data format. 

Let us take a simple logic app which gets triggered when a new document is added to the specified collection in MongoDB, copies the same document to another collection and updates the same document.



-  When creating/editing a logic app, choose the MongoDB Connector API App created as the trigger and it will list the only trigger available - New Document.



- Select the trigger, specify the frequency and click on the ✓.





- The trigger will now appear as configured in the logic app. The output(s) of the trigger will be shown and can be used inputs in a subsequent actions. 


- Select the same MongoDB connector from gallery as an action. Select 'Add Document' action.




- Provide the inputs for the document to be added click on ✓. 





- Select the same MongoDB connector from gallery as an action. Select the 'Update document' action.





- Provide the inputs for the update action and click on ✓. 


You can test the Logic App by adding a new document to the collection specified in the trigger.

<!--Image references-->



