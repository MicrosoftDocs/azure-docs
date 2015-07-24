<properties 
	pageTitle="Using New Relic with Azure - Azure feature guides" 
	description="Learn how to use the New Relic service to manage and monitor your Azure application." 
	services="" 
	documentationCenter=".net" 
	authors="stepsic-microsoft-com" 
	manager="carolz" 
	editor=""/>

<tags 
	ms.service="cloud-services" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="03/16/2015" 
	ms.author="stepsic"/>



#New Relic Application Performance Management on Azure

This guide describes how to add New Relic's world-class performance
monitoring to your Azure hosted applications. We'll cover the fast and simple
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

New Relic Standard is free to Azure users
New Relic Pro is offered based on instance size for Azure Cloud Services

For pricing information see the [New Relic page in the Azure Store](http://azure.microsoft.com/marketplace/partners/newrelic/newrelic).

> [AZURE.NOTE] Pricing is only listed for up to 10 compute instances. For counts greater than 10 please contact New Relic (sales@newrelic.com) for volume pricing.

Azure customers receive a 2 week trial subscription of New Relic Pro when they deploy the New Relic agent.

Sign up for New Relic using the Azure Store
--

New Relic integrates seamlessly with Azure Web Roles and Worker roles.

To sign up for New Relic directly from the Azure Store, follow these three easy steps.

### Step 1. Sign up through the Azure Store

1. Log in to the [Azure Management Portal](https://manage.windowsazure.com).
2. In the lower pane of the management portal, click **New**.
3. Click **Store**.
4. In the **Choose an Add-on** dialog, select **New Relic** and click **Next**.
5. In the **Personalize Add-on** dialog, select the New Relic plan that you want.
6. Enter a promotion code, if applicable.
7. Enter a name for how the New Relic service will appear in your Azure
   settings, or use the default value **NewRelic**. This name must be unique in
   your list of subscribed Azure Store items.
8. Choose a value for the region; for example, **West US**.
9. Click **Next**.
10. In the **Review Purchase** dialog, review the plan and pricing information,
    and review the legal terms. If you agree to the terms, click **Purchase**.
11. After you click **Purchase**, your New Relic account will begin the creation process. You can monitor the status in the Azure management portal.
12. To retrieve your New Relic license key, click **Output Values**. 
13. Copy the license key that appears. You will need to enter it when you install the New Relic Nuget package.

### Step 2. Install the Nuget package

1. Open your Visual Studio solution, or create a new one by selecting
   **File > New > Project**.

	![Visual Studio](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget01.png)

2. If you don't already have an Azure Cloud Service Project in your
   solution, add one by right-clicking your app in the Solution Explorer and
   selecting **Add Azure Cloud Service Project**.

	![Create cloud service](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget02.png)

3. Open the Package Manager console by selecting **Tools > Library Package Manager > 
   Package Manager Console**. Set your project to be the Default Project at the
   top of the Package Manager Console window.

	![Package manager console](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget04.png)

4. On the Package Manager command prompt, type `Install-Package
   NewRelicWindowsAzure` and press **Enter**.

	![install in package manager](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget06.png)

5. At the license key prompt, enter the license key you received from the Azure Store.

	![enter license key](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget07.png)

6. Optional: At the application name prompt, enter your app's name as it will
   appear in New Relic's dashboard. Or, use your solution name as the default.

	![enter application name](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget08.png)

7. From the Solution Explorer, right-click your Azure Cloud Service Project, and select **Publish**.

	![public the cloud project](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget09.png)


**Note:** If this is your first time deploying this app to Azure, you will be prompted to enter your 
Azure credentials. For more information, see <a href="/develop/net/tutorials/get-started/">Deploying an ASP.NET Web Application to an Azure Website</a>.

![publish settings](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelicAzureNuget10.png)

### Step 3. Check out your application's performance in New Relic.

To view your New Relic dashboard:

1. From the Azure portal, click the **Manage** button.
2. Sign in with your New Relic account email and password.
3. From the New Relic menu bar, select **Applications > (application's name)**.

	The **Monitoring > Overview** dashboard automatically appears.

	![New Relic monitoring dashboard](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelic_app.png)

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
       <td>From the Overview&#39;s <b>Browser</b> view, point anywhere on the Global Apdex map.<br /><b>Tip:</b> To go directly to the selected app&#39;s <a href="https://docs.newrelic.com/docs/new-relic-browser/geography-dashboard" target="_blank">Geography</a>dashboard, click the <b>Global Apdex</b> title, or click anywhere on the Global Apdex map.</td>
    </tr>
    <tr>
       <td>View the <a href="https://newrelic.com/docs/applications-dashboards/web-transactions" target="_blank">Web Transactions</a> dashboard</td>
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

![Package manager console](./media/store-new-relic-cloud-services-dotnet-application-performce-management/NewRelic_app_browser.png)

## Next steps

Check out these additional resources for more information:

 * [Installing the .NET Agent on Azure](https://newrelic.com/docs/dotnet/installing-the-net-agent-on-azure): New Relic .NET Agent installation procedures 
 * [The New Relic User Interface](https://newrelic.com/docs/site/the-new-relic-ui): 
Overview of the New Relic UI, setting user rights and profiles, using standard functions and dashboard drill-down details
 * [Applications Overview](https://newrelic.com/docs/site/applications-overview): Features and functions when using New Relic's Applications Overview dashboard
 * [Apdex](https://newrelic.com/docs/site/apdex): Overview of how Apdex measures end users' satisfaction with your application
 * [Real User Monitoring](https://newrelic.com/docs/features/real-user-monitoring): Overview of how RUM details the time it takes for your users' 
browsers to load your webpages, where they come from, and what browsers they use
 * [Finding Help](https://newrelic.com/docs/site/finding-help): Resources available through New Relic's online Help Center
