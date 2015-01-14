<properties urlDisplayName="New Relic App Performance Management" pageTitle="New Relic App Performance Management on Azure" metaKeywords="new relic Azure, performance azure" description="Learn how to use New Relic's performance monitoring on Azure." metaCanonical="" services="web-sites" documentationCenter=".net" title="" authors="stepsic-microsoft-com" solutions="" manager="carolz" editor=""/>

<tags ms.service="web-sites" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="11/25/2014" ms.author="stepsic" />



#New Relic Application Performance Management on Azure Websites

This guide describes how to add New Relic's world-class performance
monitoring to your Azure Website. We'll cover the fast and simple
process to add New Relic to your application and introduce you to some of
New Relic's features. For more information about using New Relic, see [Using New Relic](#using-new-relic).

What is New Relic?
--

New Relic is a developer focused tool that monitors your production applications
and provides deep insight into their performance and reliability. It is
designed to save you time when identifying and diagnosing performance issues, and
it puts the information you need to solve these issues at your fingertips.

New Relic tracks the load time and throughput for your web transaction, both from
the server and your users' browsers. It shows how much time you spend in the
database, analyzes slow queries and web requests, provides uptime monitoring and
alerting, tracks application exceptions, and a whole lot more.

New Relic special pricing through the Azure Store
--

New Relic Standard is free to Azure users.
New Relic Pro is offered in multiple packages based on which website mode you are using, and the instance size if you are using reserved mode.

For pricing information see the [New Relic page in the Azure Store](http://www.windowsazure.com/en-us/gallery/store/new-relic/new-relic/).

> [AZURE.NOTE] Pricing is only listed for up to 10 compute instances. For counts greater than 10 please contact New Relic (sales@newrelic.com) for volume pricing.

Azure customers receive a 2 week trial subscription of New Relic Pro when they deploy the New Relic agent.

Sign up for New Relic using the Azure Store
--

New Relic integrates seamlessly with Azure Web Roles, Worker roles and Websites.

To sign up for New Relic directly from the Azure Store, follow these four easy steps.

### Step 1. Sign up through the Azure Store

1. Log in to the [Azure Management Portal](https://manage.windowsazure.com).
2. In the lower pane of the management portal, click **New**.
3. Click **Store**.
4. In the **Choose an Add-on** dialog, select **New Relic** and click **Next**.
5. In the **Personalize Add-on** dialog, select the New Relic plan that you want.
7. Enter a name for how the New Relic service will appear in your Azure
   settings, or use the default value **NewRelic**. This name must be unique in
   your list of subscribed Azure Store items.
8. Choose a value for the region; for example, **West US**.
9. Click **Next**.
10. In the **Review Purchase** dialog, review the plan and pricing information,
    and review the legal terms. If you agree to the terms, click **Purchase**.
11. After you click **Purchase**, your New Relic account will begin the creation process. You can monitor the status in the Azure management portal.
12. To retrieve your New Relic license key, click the Add-On you just created and then click **Connection Info**. 
13. Copy the license key that appears. You will need to enter it when you install the New Relic Nuget package.

### Step 2. Install the New Relic package

The New Relic Websites Agent is distributed as a NuGet package, which can be added to your Website using either Visual Studio or WebMatrix. If you are unfamiliar with using Visual Studio or WebMatrix with an Azure Website, see [Deploying an ASP.NET Web Application to an Azure Web Site using Visual Studio][vswebsite] or [Develop and deploy a web site with Microsoft WebMatrix][webmatrixwebsite].

Perform the following steps for the specific development environment you are using:

**Visual Studio**

1. Open your Visual Studio Website solution.

2. Open the Package Manager console by selecting **Tools > Library Package Manager > 
   Package Manager Console**. Set your project to be the Default Project at the
   top of the Package Manager Console window.

	![Package manager console](./media/store-new-relic-web-sites-dotnet-application-performce-management/NewRelicAzureNuget04.png)

3. On the Package Manager command prompt, use the following command to install the package:

		Install-Package NewRelic.Azure.WebSites

4. At the license key prompt, enter the license key you received from the Azure Store.

	![enter license key][vslicensekey]

<!--5. Optional: At the application name prompt, enter your app's name as it will
   appear in New Relic's dashboard. Or, use your solution name as the default.

	![enter application name](./media/store-new-relic-web-sites-dotnet-application-performce-management/NewRelicAzureNuget08.png)-->

**WebMatrix**

1. Open your Website using WebMatrix.

2. On the **Home** tab of the ribbon, select **NuGet**.

	![nuget buton on home tab][wmnugetbutton]

3. In the NuGet Gallery, set the source to **NuGet Official Package Source** and then search for NewRelic.Azure.WebSites.

	![nuget gallery searching for NewRelic.Azure.WebSites][wmnugetgallery]

4. Select the **New Relic for Azure Websites** entry, and then click **Install**.

5. After installing the package, your site will now contain a folder named **newrelic**. Expand this folder and open the **newrelic.config** file. In this file, replace the value **REPLACE\_WITH\_LICENSE_KEY** with the license key you received from the Azure Store.

	![newrelic folder expanded with newrelic.conf selected][newrelicconf]

	After adding the license key information, save the changes to the **newrelic.config** file.

### Step 3. Configure the Website and publish the application.

The New Relic package added to your application in the previous step is configured by **App Settings** added to your Azure Website. Perform the following steps to add these settings.

1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com) and navigate to your Website.

2. From your Website, select **Configure**. In the **Developer Analytics** section, select either **Add-on** or **Custom**. Either method produces the same output, but requires slightly different input. **Add-on** lists your current New-Relic licenses and allows you to select one, while **Custom** requires you to manually specify the license key.

	If you selected **Add-on**, use the **choose add-on** field to select your your New-Relic license.

	![Image of the add-on fields][add-on]

	If you selected **Custom**, use select New-Relic as the **Provider**, and then enter your license in the **Provider Key** field.

	![Image of the custom fields][custom]

3. After specifying license in **Developer Analytics**, click **Save**. Once the save operation has completed, the following values will have been added to the **App Settings** section of the page to support New-Relic:

	<table border="1">
	<thead>
	<tr>
	<td>Key</td>
	<td>Value</td>
	</tr>
	</thead>
	<tbody>
	<tr>
	<td>COR\_ENABLE\_PROFILING</td><td>1</td>
	</tr>
	<tr>
	<td>COR\_PROFILER</td><td>{71DA0A04-7777-4EC6-9643-7D28B46A8A41}</td>
	</tr>
	<tr>
	<td>COR\_PROFILER\_PATH</td><td>C:\Home\site\wwwroot\newrelic\NewRelic.Profiler.dll</td>
	</tr>
	<tr>
	<td>NEWRELIC\_HOME</td><td>C:\Home\site\wwwroot\newrelic</td>
	</tr>
	<tr>
	<td>NEWRELIC\_LICENSEKEY</td><td>Your license key</td>
	</tr>
	</tbody>
	</table><br/>

	> [AZURE.NOTE] It may take up to 30 seconds for the new <strong>App Settings</strong> to take effect. To force the settings to take effect immediately, restart the website.


4. Using Visual Studio or WebMatrix, publish your application.

### Step 4. Check out your application's performance in New Relic.

To view your New Relic dashboard:

1. From the Azure portal, click the **Manage** button.
2. Sign in with your New Relic account email and password.
3. From the New Relic menu bar, select **Applications > (application's name)**.

	The **Monitoring > Overview** dashboard automatically appears.

	![New Relic monitoring dashboard](./media/store-new-relic-web-sites-dotnet-application-performce-management/NewRelic_app.png)

	After you select an app from the list on your **Applications** menu, the **Overview** dashboard shows current app server and browser information.

### <a id="using-new-relic"></a>Using New Relic

After you select your app from the list on the Applications menu, the Overview dashboard shows current app server and browser information. To toggle between the two views, click the **App server** or **Browser** button.

In addition to the <a href="https://newrelic.com/docs/site/the-new-relic-ui#functions">standard New Relic UI</a> and <a href="https://newrelic.com/docs/site/the-new-relic-ui#drilldown">dashboard drill-down</a> functions, the Applications Overview dashboard has additional functions.

<table border="1">
  <thead>
    <tr>
      <th><b>If you want to...</b></th>
      <th><b>Do this...</b></th>
    </tr>
  </thead>
  <tbody>
    <tr>
       <td>Show dashboard information for the selected app&#39;s server or browser</td>
       <td>Click the <b>App Server</b> or <b>Browser</b> button.</td>
    </tr>
     <tr>
       <td>View threshold levels for your app&#39;s <a href="https://newrelic.com/docs/site/apdex" target="_blank">Apdex</a> score</td>
       <td>Point to the Apdex score <b>?<b> icon.</b></b></td>
    </tr>
    <tr>
       <td>View worldwide Apdex details</td>
       <td>From the Overview&#39;s <b>Browser</b> view, point anywhere on the Global Apdex map.<br /><b>Tip:</b> To go directly to the selected app&#39;s <a href="https://newrelic.com/docs/site/geography" target="_blank">Geography</a>dashboard, click the <b>Global Apdex</b> title, or click anywhere on the Global Apdex map.</td>
    </tr>
    <tr>
       <td>View the <a href="https://docs.newrelic.com/docs/applications-menu/transactions-dashboard" target="_blank">Web Transactions</a> dashboard</td>
       <td>Click the Web Transactions table on the Applications Overview dashboard. Or, to view details about a specific web transaction (including <a href="https://newrelic.com/docs/site/key-transactions" target="_blank">Key Transactions</a>), click its name.</td>
    </tr>
    <tr>
       <td>View the <a href="https://newrelic.com/docs/site/errors" target="_blank">Errors</a> dashboard</td>
       <td>Click the Error rate chart&#39;s title on the Applications Overview dashboard.<br /><b>Tip:</b> You can also view the Errors dashboard from <b>Applications</b> &gt; (your app) &gt; Events &gt; Errors.</td>
    </tr>
    <tr>
       <td>View the app&#39;s server details</td>
       <td><p>Do any of the following:<p>
        <ul>
          <li>Toggle between a table view of the hosts or breakout metric details of each host.</li>
          <li>Click an individual server&#39;s name.</li>
          <li>Point to an individual server&#39;s Apdex score.</li>
          <li>Click an individual server&#39;s CPU usage or Memory.</li>
        </ul>
       </p></p></td>
    </tr>
  </tbody>
</table>

Below is an example of the Applications Overview dashboard when you select the Browser view.

![Package manager console](./media/store-new-relic-web-sites-dotnet-application-performce-management/NewRelic_app_browser.png)

## Next steps

Check out these additional resources for more information:

 * [Installing the .NET Agent for Azure Web Sites](https://newrelic.com/docs/dotnet/azure-web-sites-beta#manual_install): New Relic .NET Agent installation procedures 
 * [The New Relic User Interface](https://newrelic.com/docs/site/the-new-relic-ui): 
Overview of the New Relic UI, setting user rights and profiles, using standard functions and dashboard drill-down details
 * [Applications Overview](https://newrelic.com/docs/site/applications-overview): Features and functions when using New Relic's Applications Overview dashboard
 * [Apdex](https://newrelic.com/docs/site/apdex): Overview of how Apdex measures end users' satisfaction with your application
 * [Real User Monitoring](https://newrelic.com/docs/features/real-user-monitoring): Overview of how RUM details the time it takes for your users' 
browsers to load your webpages, where they come from, and what browsers they use
 * [Finding Help](https://newrelic.com/docs/site/finding-help): Resources available through New Relic's online Help Center


[webmatrixwebsite]: http://www.windowsazure.com/en-us/develop/net/tutorials/website-with-webmatrix/
[vswebsite]: http://www.windowsazure.com/en-us/develop/net/tutorials/get-started/

[wmnugetbutton]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nrwmnugetbutton.png
[wmnugetgallery]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nrwmnugetgallery.png

[newrelicconf]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nrwmlicensekey.png
[vslicensekey]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nrvslicensekey.png
[add-on]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nraddon.png
[custom]: ./media/store-new-relic-web-sites-dotnet-application-performce-management/nrcustom.png
