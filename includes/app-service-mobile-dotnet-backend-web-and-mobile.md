# Create an app with a mobile and web client in Azure App Service

This topic shows you how to create an app with both a mobile and web client. You will create a mobile app and a web app and use the same underlying database for both.

First you will create both a new mobile app backend and a simple *To do list* app that stores app data in the new mobile app backend. The mobile app backend uses the supported .NET languages for server-side business logic. The client app can use any client platform supported by Mobile Apps, including iOS, Windows, Xamarin iOS, and Xamarin Android.

Then, you will create a web app, using the same database as your mobile app. At the end of the tutorial, you will have a web client and a mobile client that work with the same data.

To complete this tutorial, you need the following:

* An active Azure account. If you don't have an account, you can sign up for an Azure trial and get up to 10 free mobile apps that you can keep using even after your trial ends. For details, see [Azure Free Trial](http://azure.microsoft.com/pricing/free-trial/).
* <a href="https://go.microsoft.com/fwLink/p/?LinkID=257546" target="_blank">Visual Studio Professional 2013</a>.

## Create a new mobile app backend and client

Follow the steps in the tutorial [Create a mobile app] to create both a mobile app backend and a client. You can use any client platform supported by Mobile Apps, including iOS, Windows, Xamarin iOS, and Xamarin Android.

## Create a TodoList web app

In this section, you will create a new web app using a sample application. You will modify the sample to use the same database schema name and the same connection string as the mobile app.

1. In the Azure Portal, create a new web app, using the same Resource Group and Hosting Plan as your mobile app.

2. Download the sample project [MultiChannelToDo] and open in Visual Studio. 

3. Edit MultiChannelToDoContext.cs. In `OnModelCreating`, update the schema name to be the same as your mobile app name:

        modelBuilder.HasDefaultSchema("your_mobile_app"); // your service name, replacing dashes with underscore

4. Next we will get the mobile app connection string from the Azure Portal:

    - Select your mobile app in the portal and click the part labeled **User Code**. 

    - In the blade that opens, select **All Settings**, then **Application Settings**. 
    
    - Under **Connection Strings** click **Show Connection Strings**. Copy the value for the setting **MS_TableConnectionString**. This is the connection string used by your mobile app to connect to the SQL Database.

5. In Visual Studio, right click the web app and select publish. Select Azure web apps as the publish target, and select the web app you created above. Click **Next** until you get to the **Settings** section of the Publish Web wizard.

6. In the **Databases** section, paste the mobile app connection string as the value for **MultiChannelToDoContext**. Select just the checkbox **Use this connection string at runtime**.

7. Once your web app has been successfully published, you will see a confirmation page.


## Test the mobile app against the hosted mobile app backend 

Run the mobile app that you created in the Create a mobile app tutorial.

## Test the web app against the backend

Open a web browser and connect to your web app backend. You can change todo items and you will see the same items reflected in the mobile app.

## Next Steps

In this sample we showed how to use the same underlying database for an app that has both a website and a mobile client. Here, we did not have any business logic in the backend that we wanted to reuse across the two clients, so it was sufficient to simply share the same database. In the next tutorial, you will learn how to add business logic to your website backend (using ASP.NET Web API) and reuse that logic in your mobile backend.


<!-- Links -->

[MultiChannelToDo]: https://github.com/Azure/mobile-services-samples/tree/web-mobile/MultiChannelToDo
[Create a mobile app]: app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview.md
