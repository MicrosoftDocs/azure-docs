<properties
	pageTitle="Troubleshoot the Mobile Services .NET Backend | Microsoft Azure"
	description="Learn how to diagnose and fix issues with your mobile services using the .NET backend"
	services="mobile-services"
	documentationCenter=""
	authors="wesmc7777"
	manager="erikre"
	editor="mollybos"/>

<tags
	ms.service="mobile-services"
	ms.workload="mobile"
	ms.tgt_pltfrm="multiple"
	ms.devlang="multiple"
	ms.topic="article"
	ms.date="07/13/2016" 
	ms.author="wesmc;ricksal"/>

# Troubleshoot the Mobile Services .NET Backend

[AZURE.INCLUDE [mobile-service-note-mobile-apps](../../includes/mobile-services-note-mobile-apps.md)]

&nbsp;


Developing with Mobile Services is usually easy and painless, but even then things can sometimes go wrong. This tutorial covers some techniques that let you troubleshoot common problems that can arise with the Mobile Services .NET backend.

1. [HTTP Debugging](#HttpDebugging)
2. [Runtime Debugging](#RuntimeDebugging)
3. [Analyzing Diagnostic Logs](#Logs)
4. [Debugging Cloud Assembly Resolution](#AssemblyResolution)
5. [Troubleshooting Entity Framework Migrations](#EFMigrations)

<a name="HttpDebugging"></a>
## HTTP Debugging

When developing apps with Mobile Services, you usually take advantage of the Mobile Services client SDK for the platform you are using (Windows Store, iOS, Android, etc). However some times it is helpful to drop down to the HTTP level and observe the raw calls as they happen on the network. This approach is particularly useful when debugging connectivity and serialization issues. With the Mobile Services .NET backend you can use this approach in combination with Visual Studio local and remote debugging (more on that in the next section) to get a complete idea of the the path a HTTP call makes before it invokes your service code.

You can use any HTTP debugger to send and inspect HTTP traffic. [Fiddler](http://www.telerik.com/fiddler) is a popular tool commonly used by developers for this purpose. To make developers' lives easier, Mobile Services bundles a web-based HTTP debugger (also referred to as the "test client) right with your mobile service, reducing the need for external tooling. When hosting your mobile service locally, it will be available at a URI similar to `http://localhost:59233` and when hosting in the cloud, the URI will be of the form `http://todo-list.azure-mobile.net`. The following steps work the same way regardless of where the service is hosted:

1. Start with a Mobile Services server project open in **Visual Studio 2013 Update 2** or later. If you don't have one handy, you can create one by selecting **File**, **New**, **Project**, then selecting the **Cloud** node and then the **Microsoft Azure Mobile Services** template.
2. Hit **F5**, which will build and run the project. On the start page, select **try it out**.

    >[AZURE.NOTE]
    > If the service is hosted locally, clicking the link will direct you to the next page. However, if hosting in the cloud, you will be prompted for a set of credentials. This is to ensure that unauthenticated users don't have access to information about your API and payloads. In order to see the page, you need to log in with a **blank username** and your **application key** as the password. Your application key is available in the Azure classic portal by navigating to the **Dashboard** tab for your mobile service and selecting **Manage keys**.
    >
    > ![Authentication prompt to access help page][HelpPageAuth]

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

1. Open the mobile service project you would like to debug in **Visual Studio 2013 Update 2** or later.
2. Configure symbol loading. Navigate to the **Debug** menu and select **Options and Settings**. Ensure that **Enable Just My Code** is unchecked and that **Enable source server support** is checked.

    ![Configure symbol loading][SymbolLoading]

3. Select the **Symbols** node on the left and add a reference to the [SymbolSource] server using the URI `http://srv.symbolsource.org/pdb/Public`. Symbols for the Mobile Services .NET backend are made available there with every new release.

    ![Configure symbol server][SymbolServer]

4. Set a breakpoint in the piece of code you would like to debug. For example set a breakpoint in the **GetAllTodoItems()** method of the **TodoItemController** that comes with the Mobile Services project template in Visual Studio.
5. Debug the service locally by pressing **F5**. The first load may be slow as Visual Studio is downloading symbols for the Mobile Services .NET backend.
6. As described in the previous section on HTTP debugging, use the test client to send a HTTP request to the method where you set the breakpoint. For example you can send a request to the **GetAllTodoItems()** method by selecting **GET tables/TodoItem** on the help page, then selecting **try this out** and then **send**.
7. Visual Studio should break at the breakpoint you set, and a full stack trace with source code should be available in the **Call Stack** window in Visual Studio.

    ![Hitting a breakpoint][Breakpoint]

8. You can now publish the service to Azure, and we will be able to use debugging just like we did above. Publish the project by right-clicking it in **Solution Explorer** and selecting **Publish**.
9. On the **Settings** tab of the Publish wizard, select the **Debug** configuration. This ensures that the relevant debugging symbols are published with your code.

    ![Publish debug][PublishDebug]

10. Once the service has published successfully, open **Server Explorer** and expand the **Azure** and **Mobile Services** nodes. Sign in if necessary.
11. Right click the mobile service you just published to and select **Attach Debugger**.

    ![Attach debugger][AttachDebugger]

12. Just as you did in step 6, send a HTTP request to invoke the method where you set the breakpoint. This time use the help page and test client for the Azure-hosted mobile service.
13. Visual Studio will break at the breakpoint.

You now have access the the full power of the Visual Studio debugger when developing locally and against your live mobile service in Azure.

<a name="Logs"></a>
## Analyzing Diagnostic Logs

As your mobile service handles requests from your customers, it generates a variety of useful diagnostic information, and also captures any exceptions encountered. In addition to that, you can instrument your controller code with additional logs by taking advantage of the [**Log**](http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.apiservices.log.aspx) property available on the [**Services**](http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.tables.tablecontroller.services.aspx) property of every [**TableController**](http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.tables.tablecontroller.aspx).

When debugging locally, the logs will appear in the Visual Studio **Output** window.

![Logs in Visual Studio Output window][LogsOutputWindow]

After you publish your service to Azure, the logs for the service instance running in the cloud are available by right-clicking the mobile service in Visual Studio's **Server Explorer** and then selecting **View Logs**.

![Logs in Visual Studio Server Explorer][LogsServerExplorer]

The same logs are also available in the Azure classic portal on the **Logs** tab for your mobile service.

![Logs in Azure classic portal][LogsPortal]

<a name="AssemblyResolution"></a>
## Debugging Cloud Assembly Resolution

When you publish your mobile service to Azure, it gets loaded by the Mobile Services hosting environment, which ensures seamless upgrades and patches to the HTTP pipeline hosting your controller code. This includes all assemblies referenced by the [.NET backend NuGet packages](http://www.nuget.org/packages?q=%22mobile+services+.net+backend%22): the team constantly updates the service to use the latest versions of those assemblies.

It is sometimes possible to introduce versioning conflicts by referencing *different major versions* of required assemblies (different *minor* versions are allowed). Frequently this happens when NuGet prompts you to upgrade to the latest version of one of the packages used by the Mobile Services .NET backend.

>[AZURE.NOTE] Mobile Services is currently compatible only with ASP.NET 5.1; ASP.NET 5.2 is not presently supported. Upgrading your ASP.NET NuGet packages to 5.2.* may result in an error after deployment.

If you do upgrade any such packages, when you publish the updated service to Azure, you will see a warning page indicating the conflict:

![Help page indicating assembly loading conflict][HelpConflict]

This will be accompanied by an exception message similar to the following being recored in your service logs:

    Found conflicts between different versions of the same dependent assembly 'Microsoft.ServiceBus': 2.2.0.0, 2.3.0.0. Please change your project to use version '2.2.0.0' which is the one currently supported by the hosting environment.

This problem is easy to correct: simply revert to a supported version of the required assembly and republish your service.

<a name="EFMigrations"></a>
## Troubleshooting Entity Framework Migrations

When using the Mobile Services .NET backend with a SQL Database, Entity Framework (EF) is used as the data access technology that enables you to query the database and persist objects into it. One important aspect that EF handles on behalf of the developer is how the database columns (also known as *schema*) change as the model classes specified in code change. This process is known as [Code First Migrations](http://msdn.microsoft.com/data/jj591621).

Migrations can be complex and require that the database state be kept in sync with the EF model in order to succeed. For instructions on how to handle migrations with you mobile service and errors that can arise, see [How to make data model changes to a .NET backend mobile service](mobile-services-dotnet-backend-how-to-use-code-first-migrations.md).

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
[LogsOutputWindow]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/11.png
[LogsServerExplorer]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/12.png
[LogsPortal]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/13.png
[HelpConflict]: ./media/mobile-services-dotnet-backend-how-to-troubleshoot/14.png


<!-- Links -->
[SymbolSource]:http://www.symbolsource.org/Public