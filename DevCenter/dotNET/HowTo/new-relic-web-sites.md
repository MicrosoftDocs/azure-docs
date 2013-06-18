<properties umbraconavihide="0" pagetitle="New Relic - Windows Azure Web Sites" metakeywords="Windows Azure new relic web sites, windows azure new relic, new relic web sites, windows azure web sites performance, windows azure web sites monitoring" metadescription="Learn how to use New Relic to monitor performance for Windows Azure Web Sites" linkid="dev-net-how-to-new-relic-web-sites" urldisplayname="New Relic- Windows Azure Web Sites" headerexpose="" footerexpose="" disquscomments="1" writer="larryfr"></properties>

New Relic Application Performance Management on Windows Azure Web Sites
==

This guide describes how to add New Relic's world-class performance
monitoring to your Windows Azure Web Site. We'll cover the fast and simple
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

New Relic special pricing through the Windows Azure Store
--

New Relic Standard is free to Windows Azure users.
New Relic Pro is offered in multiple packages based on which web site mode you are using, and the instance size if you are using reserved mode.

<table border="1">
  <thead>
    <tr>
      <td>Web Site Mode</td>
      <td>Instance Size</td>
      <td>Price</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Shared</td>
      <td>NA</td>
      <td>$8.00</td>
    </tr>
    <tr>
      <td>Standard</td>
      <td>Small</td>
      <td>$40.00</td>
    </tr>
    <tr>
      <td>Standard</td>
      <td>Medium</td>
      <td>$75.00</td>
    </tr>
    <tr>
      <td>Standard</td>
      <td>Large</td>
      <td>$140.00</td>
    </tr>
  </tbody>
</table>

For hosts counts greater than 10 please contact New Relic (sales@newrelic.com) for volume pricing.

Windows Azure customers receive a 2 week trial subscription of New Relic Pro when they deploy the New Relic agent.

Sign up for New Relic using the Windows Azure Store
--

New Relic integrates seamlessly with Windows Azure Web Roles, Worker roles and Web Sites.

To sign up for New Relic directly from the Windows Azure Store, follow these four easy steps.

### Step 1. Sign up through the Windows Azure Store

1. Log in to the [Windows Azure Management Portal](https://manage.windowsazure.com).
2. In the lower pane of the management portal, click **New**.
3. Click **Store**.
4. In the **Choose an Add-on** dialog, select **New Relic** and click **Next**.
5. In the **Personalize Add-on** dialog, select the New Relic plan that you want.
7. Enter a name for how the New Relic service will appear in your Windows Azure
   settings, or use the default value **NewRelic**. This name must be unique in
   your list of subscribed Windows Azure Store items.
8. Choose a value for the region; for example, **West US**.
9. Click **Next**.
10. In the **Review Purchase** dialog, review the plan and pricing information,
    and review the legal terms. If you agree to the terms, click **Purchase**.
11. After you click **Purchase**, your New Relic account will begin the creation process. You can monitor the status in the Windows Azure management portal.
12. To retrieve your New Relic license key, click the Add-On you just created and then click **Connection Info**. 
13. Copy the license key that appears. You will need to enter it when you install the New Relic Nuget package.

### Step 2. Install the New Relic package

The New Relic Web Sites Agent is distributed as a NuGet package, which can be added to your Web Site using either Visual Studio or WebMatrix. If you are unfamiliar with using Visual Studio or WebMatrix with a Windows Azure Web Site, see [Deploying an ASP.NET Web Application to a Windows Azure Web Site using Visual Studio][vswebsite] or [Develop and deploy a web site with Microsoft WebMatrix][webmatrixwebsite].

Perform the following steps for the specific development environment you are using:

**Visual Studio**

1. Open your Visual Studio Web Site solution.

2. Open the Package Manager console by selecting **Tools > Library Package Manager > 
   Package Manager Console**. Set your project to be the Default Project at the
   top of the Package Manager Console window.

	![Package manager console](../media/NewRelicAzureNuget04.png)

3. On the Package Manager command prompt, use the following command to install the package:

		Install-Package NewRelic.Azure.WebSites

4. At the license key prompt, enter the license key you received from the Windows Azure Store.

	![enter license key][vslicensekey]

<!--5. Optional: At the application name prompt, enter your app's name as it will
   appear in New Relic's dashboard. Or, use your solution name as the default.

	![enter application name](../media/NewRelicAzureNuget08.png)-->

**WebMatrix**

1. Open your Web Site using WebMatrix.

2. On the **Home** tab of the ribbon, select **NuGet**.

	![nuget buton on home tab][wmnugetbutton]

3. In the NuGet Gallery, set the source to **NuGet Official Package Source** and then search for NewRelic.Azure.WebSites.

	![nuget gallery searching for NewRelic.Azure.WebSites][wmnugetgallery]

4. Select the **New Relic for Windows Azure Web Sites** entry, and then click **Install**.

5. After installing the package, your site will now contain a folder named **newrelic**. Expand this folder and open the **newrelic.config** file. In this file, replace the value **REPLACE\_WITH\_LICENSE_KEY** with the license key you received from the Windows Azure Store.

	![newrelic folder expanded with newrelic.conf selected][newrelicconf]

	After adding the license key information, save the changes to the **newrelic.config** file.

### Step 3. Configure the Web Site and publish the application.

The New Relic package added to your application in the previous step is configured by **App Settings** added to your Windows Azure Web Site. Perform the following steps to add these settings.

1. Sign in to the [Windows Azure management portal](https://manage.windowsazure.com) and navigate to your Web Site.

2. From your Web Site, select **Configure** and then add the following values to the **App Settings** section of the page:

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
	</tbody>
	</table><br/>

3.	After entering these values, click **Save**.

	![app settings values for New Relic][appsettings]

	<div class="dev-callout"> 
	<strong>Note</strong> 
	<p>It may take up to 30 seconds for the new <strong>App Settings</strong> to take effect. To force the settings to take effect immediately, restart the web site.</p> 
	</div>


4. Using Visual Studio or WebMatrix, publish your application.

### Step 4. Check out your application's performance in New Relic.

To view your New Relic dashboard:

1. From the Windows Azure portal, click the **Manage** button.
2. Sign in with your New Relic account email and password.
3. From the New Relic menu bar, select **Applications > (application's name)**.

	The **Monitoring > Overview** dashboard automatically appears.

	![New Relic monitoring dashboard](../media/NewRelic_app.png)

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
       <td>View the <a href="https://newrelic.com/docs/site/web-transactions" target="_blank">Web Transactions</a> dashboard</td>
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

![Package manager console](../media/NewRelic_app_browser.png)

## Next steps

Check out these additional resources for more information:

 * [Installing the .NET Agent for Windows Azure Web Sites](https://newrelic.com/docs/dotnet/azure-web-sites-beta#manual_install): New Relic .NET Agent installation procedures 
 * [The New Relic User Interface](https://newrelic.com/docs/site/the-new-relic-ui): 
Overview of the New Relic UI, setting user rights and profiles, using standard functions and dashboard drill-down details
 * [Applications Overview](https://newrelic.com/docs/site/applications-overview): Features and functions when using New Relic's Applications Overview dashboard
 * [Apdex](https://newrelic.com/docs/site/apdex): Overview of how Apdex measures end users' satisfaction with your application
 * [Real User Monitoring](https://newrelic.com/docs/features/real-user-monitoring): Overview of how RUM details the time it takes for your users' 
browsers to load your webpages, where they come from, and what browsers they use
 * [Finding Help](https://newrelic.com/docs/site/finding-help): Resources available through New Relic's online Help Center

[managementportal]: https:manage.windowsazure.com
[webmatrixwebsite]: http://www.windowsazure.com/en-us/develop/net/tutorials/website-with-webmatrix/
[vswebsite]: http://www.windowsazure.com/en-us/develop/net/tutorials/get-started/

[wmnugetbutton]: ../media/nrwmnugetbutton.png
[wmnugetgallery]: ../media/nrwmnugetgallery.png
[appsettings]: ../media/nrappsettings.png
[newrelicconf]: ../media/nrwmlicensekey.png
[vslicensekey]: ../media/nrvslicensekey.png