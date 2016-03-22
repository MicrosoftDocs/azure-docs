<properties 
	pageTitle="Release notes for Visual Studio Extension for Application Insights" 
	description="The latest updates for Visual Studio tools for Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="aruna" 
	manager="douge"/>
<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/26/2016" 
	ms.author="acearun"/>
 
# Release Notes for Application Insights Tools for Visual Studio

## Version 4.3
### Search telemetry from local debug sessions
With this release, we are introducing the ability to search for Application Insights telemetry generated in the Visual Studio debug session. Search was previously only possible if you had registered your app with Application Insights. With this release, your app only needs the Application Insights SDK installed to search for local telemetry.

#### If you have an ASP.NET application with the Application Insights SDK

- Debug your application.
- Open Application Insights Search using one of these ways
	- View Menu -> Other Windows -> Application Insights Search
	- Click on the Application Insights Toolbar button
	- In Solution Explorer, expand ApplicationInsights.config -> Search debug session telemetry
- If you haven't signed up with Application Insights, the Search window will open up in 'Debug session telemetry' mode.
- Click the search icon to see your local telemetry.

![Upload complete](./media/app-insights-release-notes-vsix/LocalSearch.png)



##Version 4.2
In this release we've added features to make searching data easier in context of events, the ability to jump to code from more data events and an effortless experience to send your logging data to Application Insights. This extension is updated monthly, if you have feedback or feature reuests send it to aidevtools@microsoft.com
###- 0-click logging experience
If you're already using NLog, Log4Net or System.Diagnostics tracing then you don't have to worry about moving all your traces to AI, now we're integrating the Application Insights Logging adapters with the normal configuration experience. 
If you already have one of these logging frameworks configured here's how you get it:
####If you already have Application Insights added
- Right-click on the Project Node->Application Insights->Configure Application Insights. Make sure you see the the option to add the right adapter in the configuration window. 
- Or when you build the solution, notice the pop-up that appears on the top right of your screen and click on configure.
![Loggin Toast](./media/app-insights-release-notes-vsix/LoggingToast.png)

Once you have the Logging adapter installed, you can run your application and make sure you see the data in the diagnostic tools tab as the following: 
![Traces](./media/app-insights-release-notes-vsix/Traces.png)
###- User can jump/find to the code where the telemetry event property is emitted
With the new release user can click on any value in the event detail and this will search for a matching string in the current open solution. Results will show up in Visual Studio "Find Results" list as shown below:
![Find Match](./media/app-insights-release-notes-vsix/FindMatch.png)
###- New screen for not-signed in user in Search Window
We've improved the look of our Search window to guide users to searching their data in production.
![Search Window](./media/app-insights-release-notes-vsix/SearchWindow.png)
###- User can see all telemetry events associated with the event
A new tab next to event details has been added that contains a pre-defined queries to view all related data to the telemetry event the user is looking at. For example: Request has a field called operation ID and every event associated to this Request will have the same operation ID, so if an exception occured while processing the request it will get the same operation ID as the request to make it easier to find it, and so on. So user looking at a request now, can click on "All telemetry for this operation" this will open a new tab with the new search results.
![Related Items](./media/app-insights-release-notes-vsix/RelatedItems.png)
### - Add Forward/Back history in Search
User can now go back and forth between search results.
![Go Back](./media/app-insights-release-notes-vsix/GoBAck.png)

##Version 4.1
This release comes with a number of new features and improvements to our existing ones. In order to get this release you need to have Update 1 installed on your machine.

### Jump from an exception to method in source code
Now users viewing Exceptions from their Production apps in Application Insights Search window can jump to the method in their code where the Exception is happening. You just need to have the right project loaded and we'll take care of the rest! (To learn more about Search window look at 4.0 release notes below)

#### How does it work?

When a solution is not open, AI Search can be used without opening a solution.  In that case, the stack trace area will show an info message, and many of the items in the stack trace will appear grayed out.


If file information was available, some items may be links, but the solution info item will still be visible.

Clicking on the hyperlink will take you to the where the selected method is in your code, there might be a difference in the version number, but that feature will come in later releases: jump to the right version of code.

![Clicking on Exception](./media/app-insights-release-notes-vsix/jumptocode.png)

###New entry points to the Search Experience in Solution Explorer 

![Entry Point in Solution Explorer](./media/app-insights-release-notes-vsix/searchentry.png)


###Pop-up a toast when publish is complete
A pop-up will appear once the project is published online, so you can view your Application Insights data in production.

![Popup](./media/app-insights-release-notes-vsix/publishtoast.png)

## Version 4.0

###Search Application Insights data inside Visual Studio
Just like Search in the Application Insights portal, you can filter and search on event types, property values and text, and inspect individual events.

![Search window](./media/app-insights-release-notes-vsix/search.png)

###See data coming from your local-box in the Diagnostics Tools window

Your telemetry will also appear along with other debugging data in the Visual Studio Diagnostic Hub. This is only supports ASP.NET 4.5. Support for ASP.NEt 5 is coming in upcoming releases.

![Diagnostics hub window](./media/app-insights-release-notes-vsix/diagtools.png)

###Add the SDK to your project without having to be signed in to Azure

You no longer have to sign in to Azure in order to add Application Insights packages to your project, either in the new project dialog or in the project context menu. If you do sign in, the SDK will be installed and configured to send telemetry to the portal, as before.  If you don’t sign in, the SDK will be added to your project and will generate telemetry for the diagnostic hub, and you’ll be able to configure it later if you want.

![New Project Dialog](./media/app-insights-release-notes-vsix/newproject.png)

###Devices support

At *Connect();* 2015 we [announced](https://azure.microsoft.com/blog/deep-diagnostics-for-web-apps-with-application-insights/) that our Mobile DevOps experience for devices is HockeyApp. HockeyApp helps you to distribute beta builds to your testers, collect and analyze all crashes from your app, and collect feedback directly from your customers. 
HockeyApp supports you on whatever platform you are building your mobile application, be it iOS, Android, or Windows or a cross-platform solution like Xamarin, Cordova, or Unity.

In future releases of the Application Insights extension we’ll be introducing new functionalities to enable a more integrated experience between HockeyApp and Visual Studio. For now you can start with HockeyApp by simply adding the NuGet reference: see the [documentation](http://support.hockeyapp.net/kb/client-integration-windows-and-windows-phone) for more information. 

 