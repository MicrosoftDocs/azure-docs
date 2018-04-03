#Integrate into Power BI

##Overview: 
The purpose of this tutorial is to help customers plug in their RMV2 solution data from Cosmos into Power BI. Users can then create their own custom dashboards that are not provided on RMV2 online today. RMV2 provides some out of the box graphs today for users to measure their connected devices and the data they are emitting. However, customers have specifically asked for the data stream themselves to create their own specialized graphs. 

##Pre-requisites:
	1. Users must have an RMV2 solution currently running
	2. Users must have access to Azure Portal and their subscription on which the IoT Hub is running
	3. Users must have Power BI desktop, any version will do


##Information Needed from Azure Portal
	1. Navigate to https://ms.portal.azure.com and log in if needed
	2. Navigate to the Resource Group of which your Iot Solution is running on and click to be taken to that Resource Group's Overview page. 
	3. On that overview page, click the item which has type "Azure Cosmos DB Account", you will then be taken to the overview page of the Cosmos DB stream for that IoT Solution.
	4. On the panel to the left, click the "Keys" section and take note of the following values to be used in PowerBi: 
		a. URI 
		b. Primary Key

##Setting up the Stream in Power BI
	1. While using the Power BI desktop app, click "Get Data" from the top left corner. 
	2. When asked to enter data, choose to Search for "Azure Cosmos DB" and select this connector. This connector essentially pulls data straight from the cosmos database of your Azure IoT Solution
	3. Enter the information which you have recorded above: 
		a. URL
		b. Primary Key
	4. Select all the tables to be imported into Power BI. This will kick off the loading of the data. Note that the longer your solution has been running, the longer it can take for the data to load (up to a few hours). 
	5. Once the data has finished loading, click "Edit Queries" on the top row of Power BI and expand all the tables by clicking the arrows in the yellow bar for each table. This will essentially expand to show all the columns. You will notice how data for things such as humidity, speed time, etc. aren't set correctly. 
	
	Essentially the data coming into Power BI was changed into UNIX time when it came in through the connector. To adjust for this, users going forward can create a new column and use this equation to get it into date time format: 

	#datetime(1970, 1, 1, 0, 0, 0) + #duration(0, 0, 0, [Document.device.msg.created]/1000)
	
	Document.device.msg.created is just one of the columns with UNIX formatting and can be substituted with others that need conversion. 
	
	Other data points were converted to type String can should be changed into Doubles or Int where appropriated