<properties
	pageTitle="Release notes for Visual Studio Extension for Developer Analytics"
	description="The latest updates for Visual Studio tools for Developer Analytics."
	services="application-insights"
    documentationCenter=""
	authors="acearun"
	manager="douge"/>
<tags
	ms.service="application-insights"
	ms.workload="tbd"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/09/2016"
	ms.author="acearun"/>

# Release Notes - Developer Analytics Tools
##### Application Insights and HockeyApp analytics in Visual Studio
## Version 7.0
###Application Insights Trends
Application Insights Trends is a new tool in Visual Studio for analyzing how your app behaves over time. To get started, choose "Explore Telemetry Trends" from the Application Insights toolbar button or Application Insights Search window; or choose "Application Insights Trends" from View - Other Windows. Choose one of five common queries to get started. You can analyze different datasets based on telemetry types, time ranges, and other properties. To find anomalies in your data, choose one of the anomaly options under the "View Type" dropdown. The filtering options at the bottom of the window make it easy to hone in on specific subsets of your telemetry.

![Application Insights Trends](./media/app-insights-release-notes-vsix/Trends.PNG)

###Exceptions in CodeLens
Exception telemetry is now displayed in CodeLens. If you've connected your project to the Application Insights service, you'll see the number of exceptions that have occurred in each method in production in the past 24 hours. From CodeLens, you can jump to Search or Trends to investigate the exceptions in more detail.

![Exceptions in CodeLens](./media/app-insights-release-notes-vsix/ExceptionsCodeLens.png)

###ASP.NET Core Support
Application Insights now supports ASP.NET Core RC2 projects in Visual Studio. You can add Application Insights to new ASP.NET Core RC2 projects from the New Project dialog, or to an existing project by right-clicking the project in the Solution Explorer and choosing "Add Application Insights Telemetry..."

![.NET Core Support](./media/app-insights-release-notes-vsix/NetCoreSupport.PNG)

ASP.NET 5 RC1 and ASP.NET Core RC2 projects also have new support in the Diagnostic Tools window. You'll see Application Insights events like requests and exceptions from your ASP.NET app while debugging locally on your PC. From each event, you can drill down for more information by clicking "Search."

![Diagnostic Tools support](./media/app-insights-release-notes-vsix/DiagnosticTools.PNG)

###HockeyApp for Universal Windows apps
In addition to beta distribution and user feedback, HockeyApp provides symbolicated crash reporting for your Universal Windows apps. We've made it even easier to add the HockeyApp SDK: right-click on your Universal Windows project, and choose Hockey App - Enable Crash Analytics... This will install the SDK, set up crash collection, and provision a HockeyApp resource in the cloud, without uploading your app to the HockeyApp service.

Other new features:

* We've made the Application Insights Search experience faster and more intuitive by automatically applying time ranges and detail filters as you select them
* In Application Insights Search, there's now an option to Go to Code from request telemetry
* We've made improvements to the HockeyApp sign-in experience.
* In Diagnostic Tools, there's now production telemetry information displayed for exceptions.

## Version 5.2
We are happy to announce the introduction of HockeyApp scenarios in Visual Studio. The first integration we have enabled is beta distribution of Universal Windows and Windows Forms apps within VS.

Beta distribution allows you to upload early versions of your apps to HockeyApp for distribution to a chosen subset of customers or testers. Beta distribution, combined with HockeyApp crash collection and user feedback features, can provide valuable information about your app before a broad release. You can use this information to address issues with your app before it becomes a big deal (low ratings, poor feedback, etc.).

Check out how simple it is to upload builds for beta distribution from within VS…
### Universal Windows apps
The context menu for an UWP project node now includes an option to upload your build to HockeyApp.

![Project context menu for Universal Apps](./media/app-insights-release-notes-vsix/UniversalContextMenu.png)

Choose the item and see the HockeyApp upload dialog. You will need a HockeyApp account to upload your build. Don't worry if you are a new user - creating an account is a simple process.

Once you are connected, you will see the upload form in the dialog.

![Upload Dialog for Universal apps](./media/app-insights-release-notes-vsix/UniversalUploadDialog.png)

Select the content to upload (appxbundle or appx) and choose release options in the wizard. You can optionally add release notes on the next page. Choose ‘Finish’ to begin upload.

When the upload is complete, you will see a HockeyApp toast with confirmation and a link to the app in the HockeyApp portal.

![Upload complete toast](./media/app-insights-release-notes-vsix/UploadComplete.png)

That’s it - you just uploaded a build for Beta distribution with a few clicks.

The HockeyApp portal allows you to manage your application in various ways (invite users, view crash reports and feedback, change details, etc.).

![HockeyApp portal](./media/app-insights-release-notes-vsix/HockeyAppPortal.png)

More details on app management is available at the [Hockey App Knowledge Base](http://support.hockeyapp.net/kb/app-management-2).

### Windows Forms apps
The context menu for a Windows Form project node includes an option to upload your build to HockeyApp.

![Project context menu for Windows Forms apps](./media/app-insights-release-notes-vsix/WinFormContextMenu.png)

This brings up the HockeyApp upload dialog similar to the one for Universal apps.

![Upload Dialog for Windows Form apps](./media/app-insights-release-notes-vsix/WinFormsUploadDialog.png)

Notice an extra field in this wizard – for specifying the version of the app. For Universal apps, the information is populated from the manifest – Win Forms unfortunately don’t have an equivalent and hence need to be manually specified.

The rest of the flow is similar to Universal apps – pick build, release options, add release notes, upload, and manage in the HockeyApp portal.

It’s as simple as that. Give it a try and let us know what you think.
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
