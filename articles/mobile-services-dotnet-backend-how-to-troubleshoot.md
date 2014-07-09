<properties linkid="mobile-services-dotnet-backend-how-to-troubleshoot" urlDisplayName="Troubleshoot the Mobile Services .NET Backend" pageTitle="Troubleshoot the Mobile Services .NET Backend - Azure Mobile Services" metaKeywords="" description="Learn how to diagnose and fix issues with your mobile services using the .NET backend" metaCanonical="" services="" documentationCenter="Mobile" title="Troubleshoot the Mobile Services .NET Backend" authors="yavorg" solutions="" manager="" editor="mollybos" />
# Troubleshoot the Mobile Services .NET Backend

Developing with Mobile Services is usually easy and painless, but even then things can sometimes go wrong. This tutorial covers some techniques that let you troubleshoot common problems that can arise with the Mobile Services .NET backend. 

1. [HTTP Debugging](#HttpDebugging)
2. [Runtime Debugging](#RuntimeDebugging)
3. [Analyzing Diagnostic Logs](#Logs)
4. [Debugging Cloud Assembly Resolution](#AssemblyResolution)
5. [Troubleshooting Entity Framework Migrations](#EFMigrations)

<a name="HttpDebugging"></a>
## HTTP Debugging

When developing apps with Mobile Services, you usually take advantage of the Mobile Services client SDK for the platform you are using (Windows Store, iOS, Android, etc). However some times it is helpful to drop down to the HTTP level and observe the raw calls as they happen on the network. This approach is particularly useful when debugging connectivity and serialization issues. With the Mobile Services .NET backend you can use this approach in combination with Visual Studio local and remote debugging (more on that in the next section) to get a complete idea of the the path a HTTP call makes before it invokes your service code.  

You can use any HTTP debugger to send and inspect HTTP traffic. [Fiddler](http://www.telerik.com/fiddler) is a popular tool commonly used by developers for this purpose. To make developers' lives easier, Mobile Services bundles a web-based HTTP debugger (also referred to as the "test client) right with your mobile service, reducing the need for external tooling. When hosting your mobile service locally, it will be available at a URI similar to [http://localhost:59233](http://localhost:59233) and when hosting in the cloud, the URI will be of the form [http://todo-list.azure-mobile.net](http://todo-list.azure-mobile.net). The following steps work the same way regardless of where the service is hosted:

1. Start with a Mobile Services server project open in **Visual Studio 2013 Update 2** or later. If you don't have one handy, you can create one by selecting **File**, **New**, **Project**, then selecting the **Cloud** node and then the **Windows Azure Mobile Services** template.
2. Hit **F5**, which will build and run the project. On the start page, select **try it out**. 

    > [WACOM.NOTE] 
    > If the service is hosted locally, clicking the link will direct you to the next page. However, if hosting in the cloud, you will be prompted for a set of credentials. This is to ensure that unauthenticated users don't have access to information about your API and payloads. In order to see the page, you need to log in with a **blank username** and your **application key** as the password. Your application key is available in the **Azure Management Portal** by navigating to the **Dashboard** tab for your mobile service and selecting **Manage keys**.
    > ![Authentication prompt to access help page][HelpPageAuth]
    > FIX ME  

3. The page you see (referred to as the "help page") shows a list of all HTTP APIs that your mobile service is making available. Select one of the APIs (if you started using the Mobile Services project template in Visual Studio, you should see **GET tables/TodoItem**).

    ![Help page][HelpPage]

4. The  resulting page shows any documentation and JSON examples of the request and response that the API expects. Select the **try this out** button.

    ![Test page for an API][HelpPageApi]

5. This is the "test client", which lets you send a HTTP request to try out your API. Select **send**.

    ![Test client][TestClient]

6. You will see the HTTP response coming back from your mobile service right in the browser window. 

    ![Test client with HTTP response][TestClientResponse]

Now you are ready to explore the different HTTP APIs exposed by your mobile service in the convenience of your web browser.

<a name="RuntimeDebugging"></a>
## Runtime Debugging

One of the key features of the .NET backend is the ability to debug the service code locally, but also to debug the code running live in the cloud environment. Follow these steps:

1. Open the mobile service project you would like do debug in **Visual Studio 2013 Update 2** or later.
2. Configure symbol loading. Navigate to the **Debug** menu and select **Options and Settings**. Ensure that **Enable Just My Code** is unchecked and that **Enable source server support** is checked.

    ![Configure symbol loading][SymbolLoading]

3. Select the **Symbols** node on the left and add a reference to the (SymbolSource)[http://symbolsource.org] server using the URI [http://srv.symbolsource.org/pdb/Public](http://srv.symbolsource.org/pdb/Public). Symbols for the Mobile Services .NET backend are made available there with every new release.
 
    ![Configure symbol server][SymbolServer]

4. Set a breakpoint in the piece of code you would like to debug. For example set a breakpoint in the **GetAllTodoItems()** method of the **TodoItemController** that comes with the Mobile Services project template in Visual Studio.
5. Debug the service locally by pressing **F5**. The first load may be slow as Visual Studio is downloading symbols for the Mobile Services .NET backend.
6. As described in the previous section on HTTP debugging, use the test client to send a HTTP request to the method where you set the breakpoint. For example you can send a request to the **GetAllTodoItems()** method by selecting **GET tables/TodoItem** on the help page, then selecting **try this out** and then **send**. 
7. Visual Studio should break at the breakpoint you set, and a full stack trace with source code should be available in the **Call Stack** window in Visual Studio. 

    ![Hitting a breakpoint][Breakpoint]

8. You can now publish the service to Azure, and we will be able to use debugging just like we did above. Publish the project by right-clicking it in **Solution Explorer** and selecting **Publish**.
9. On the **Settings** tab of the Publish wizard, select the **Debug** configuration. This ensures that the relevant debugging symbols are published with your code.

    ![Publish debug][PublishDebug]

10. Once the service has published successfully, open **Server Explorer** and expand the **Windows Azure** and **Mobile Services** nodes. Sign in if necessary.
11. Right click the mobile service you just published to and select **Attach Debugger**.

    ![Attach debugger][AttachDebugger]

12. Just as you did in step 6, send a HTTP request to invoke the method where you set the breakpoint. This time use the help page and test client for the Azure-hosted mobile service.
13. Visual Studio will break at the breakpoint.

You now have access the the full power of the Visual Studio debugger when developing locally and against your live mobile service in Azure.

<a name="Logs"></a>
## Analyzing Diagnostic Logs

<a name="AssemblyResolution"></a>
## Debugging Cloud Assembly Resolution

<a name="EFMigrations"></a>
## Troubleshooting Entity Framework Migrations

##Debugging database connectivity issues

The best debugging is to put yourself in the service's shoes, using it's connection string (Which is different that the one you used to setup the service)

###Get the service's connection string
1. Open the SCM endpoint for your service. If your service is https://yourServiceName.azure-mobile.net/, go to https://yourServiceName.scm.azure-mobile.net/. If you are already logged into the Azure portal with an account that has access to the service, then your will be auto-logged into the SCM endpoint. Otherwise, you will need to enter your source control credentials.
2. Go to the *Environment* tab, then click on the *Connection Strings* link.
3. Copy the value of `MS_TableConnectionString`.

###Option 1: Use SQL Azure Portal

**Note:** for this to work you need to know the tables in your DB; the restricted access user cannot list the tables in the portal):
4. Go to the Mobile Service portal for your app.
5. Click on the Configure tab, then click on the link for the SQL Database.
6. On the portal page for your SQL database, click "Set up Windows Azure firewall rules for this IP address".
7. Click the Manage button at the bottom of the page.
8. In the Windows Azure login page, enter the username and password from the connection string. (Note: The password usually ends with "$$"; the semicolon is not part of the password.)
9. Click "New Query", and go nuts with your queries.

###Option 2: Use SQL Server Management Studio

SSMS is the highest-fidelity way to view what is happening in your database.
4. Enter the value of the "Data Source" part of the connection string as the "Server Name"
5. Choose SQL Server Login
6. Enter the value of the "User Id" part of the connection string as the "Login"
7. Enter the value of the "Password" part of the connection string as the "Password".  (Note: The password usually ends with "$$"; the semicolon is not part of the password.)
8. Click the Options button.
9. In the Connect to Database dropdown, enter the value of the "Initial Catalog" part of the connection string.
10. Click connect.
11. Click "New Query", and go nuts with your queries.

<!-- IMAGES -->

[HelpPageAuth]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/6.png
[HelpPage]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/7.png
[HelpPageApi]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/8.png
[TestClient]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/9.png
[TestClientResponse]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/10.png
[SymbolLoading]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/1.png
[SymbolServer]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/2.png
[Breakpoint]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/3.png
[PublishDebug]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/4.png
[AttachDebugger]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/5.png

