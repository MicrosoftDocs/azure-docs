<properties
	pageTitle="Build an app with a mobile and web client"
	description="Build a multi-channel app with both a website and mobile client"
	services="app-service-mobile"
	authors="lindydonna"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm=""
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="2/20/2015"
	ms.author="donnam"/>

# Build an app with a mobile and web client

This topic shows you how to create an app with both a mobile and web client. You will create a Mobile App and a Web App and use the same underlying database for both.

## Create a TodoList mobile app

1. In the Azure Portal, create a new Mobile App. 
	
	- Choose a new Resource Group that will be used to host all three of your services--WebApp, SQL Database, and Mobile App.
	- Create a new SQL Database server in the same Resource Group.

2. In the Mobile App blade, select Quickstart. Download a mobile quickstart with your choice of client (Windows, iOS, Xamarin, Android). 

3. Open the mobile backend part of the project in Visual Studio. After building the project, right click and select Publish. 
After publishing succeeds, you will see a confirmation page that the Mobile App is up and running in Azure.

## Create a TodoList website

In this section, you will create a new Web App using a sample application. You will modify the sample to use the same database schema name and the same connection string as the Mobile App.

1. In the Azure Portal, create a new Web App. 

2. Download the sample project [MultiChannelToDo] and open in Visual Studio. 

3. Edit MultiChannelToDoContext.cs. In `OnModelCreating`, update the schema name to be the same as your Mobile App name:

		modelBuilder.HasDefaultSchema("YourMobileApp"); // prefix of your service name (YourMobileApp.azure-mobile.net)

4. Next we will get the Mobile App connection string from the Azure Portal:

	- Select your Mobile App in the portal and click the part labeled **User Code**. 

	- In the blade that opens, select **All Settings**, then **Application Settings**. 
	
	- Under **Connection Strings** click **Show Connection Strings**. Copy the value for the setting **MS_TableConnectionString**. This is the connection string used by your Mobile App to connect to the SQL Database.

5. In Visual Studio, right click the Web App and select publish. Select Azure Websites as the publish target, and select the Web App you created above. Click **Next** until you get to the **Settings** section of the Publish Web wizard.

6. In the **Databases** section, paste the Mobile App connection string as the value for **MultiChannelToDoContext**. Select just the checkbox **Use this connection string at runtime**.

7. Once your Web App has been successfully published, you will see a confirmation page.

## Test the mobile app and website

The mobile client app and website are now connecting to the same underlying database. Try it out by adding data to either the mobile app or the website, and refreshing the other app.

## Next Steps

In this sample we showed how to use the same underlying database for an app that has both a website and a mobile client. Here, we did not have any business logic in the backend that we wanted to reuse across the two clients, so it was sufficient to simply share the same database. In the next tutorial, you will learn how to add business logic to your website backend (using ASP.NET Web API) and reuse that logic in your mobile backend.

