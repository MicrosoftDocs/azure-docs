<properties linkid="develop-mobile-tutorials-call-custom-api-android" urlDisplayName="call custom api android" pageTitle="Call a custom API from an Android app | Mobile Services" metaKeywords="call custom api android mobile services" description="Learn how to define a custom API and then call it from an Android app that use Windows Azure Mobile Services." metaCanonical="" services="" documentationCenter="Mobile" title="Troubleshooting Windows Azure Web Sites in Visual Studio" authors=""  solutions="" writer="tdykstra" manager="wpickett" editor="mollybos"  />



# Troubleshooting Windows Azure Web Sites in Visual Studio

During development and testing of a web application, you can troubleshoot by [running in debug mode](http://msdn.microsoft.com/library/vstudio/sc65sadd.aspx) or by using [IntelliTrace](http://msdn.microsoft.com/library/vstudio/dd264915.aspx). You can run in debug mode locally in IIS Express or remotely in a Windows Azure Web Site. But for errors that occur only in production, the best way to debug might be by reviewing logs that application code or the web server creates. This tutorial shows how to use Visual Studio tools that help debug an application while it runs in a Windows Azure Web Site, by running in debug mode remotely or by viewing application and web server logs.

You'll learn:

* Which Windows Azure site management functions are available in Visual Studio.
* How to run debug mode remotely while a project is running in a Windows Azure Web Site.
* How to create application trace logs and view them while the application is creating them.
* How to view web server logs, including detailed error messages and failed request tracing.
* How to send diagnostic logs to a Windows Azure Storage account and view them there.


### Tutorial segments

1. [Prerequisites](#prerequisites)
2. [Site configuration and management](#sitemanagement)
5. [Remote debugging](#remotedebug)
3. [Diagnostic logs overview](#logsoverview)
4. [Create and view application trace logs](#apptracelogs)
5. [View web server logs](#webserverlogs)
5. [View detailed error message logs](#detailederrorlogs)
5. [Download file system logs](#downloadlogs)
5. [View storage logs](#storagelogs)
5. [View failed request logs](#failedrequestlogs)
5. [Next steps](#nextsteps)

<h2><a name="prerequisites"></a><span class="short-header">Prerequisites</span></h2>

This tutorial works with the development environment, web project, and Windows Azure Web Site that you set up in [Getting started with Windows Azure and ASP.NET][GetStarted].

Remote debugging requires Visual Studio 2013 or Visual Studio 2012. The other features shown in the tutorial also work in Visual Studio 2013 Express for Web, and Visual Studio 2012 Express for Web. 

The streaming logs feature only works for applications that target .NET Framework 4 or later.

<h2><a name="sitemanagement"></a><span class="short-header">Site management</span>Site configuration and management</h2>

Visual Studio provides access to a subset of the site management functions and configuration settings available in the management portal. In this section you'll see what's available.

1. Use one of the following methods to enable Visual Studio to connect to your Windows Azure account.


    * Sign in to the Windows Azure account by entering your credentials.

      This method is quicker and easier, but if you use this method you won't be able to see Windows Azure SQL Database or Mobile Services in the **Server Explorer** window.

      In **Server Explorer**, click the **Connect to Windows Azure** button. An alternative is to right-click the **Windows Azure** node, and then click **Connect to Windows Azure** in the context menu.

    * Install a management certificate that enables access to your account.

      In **Server Explorer**, right-click the **Windows Azure** node, and then click **Manage Subscriptions** in the context menu. In the **Manage Windows Azure Subscriptions** dialog box, click the **Certificates** tab, and then click **Import**. Follow the directions to download and then import a subscription file (also called a *.publishsettings* file) for your Windows Azure account.

      <div class="dev-callout"><strong>Security Note:</strong>
      <p>Download the subscription file to a folder outside your source code directories (for example, in the Downloads folder), and then delete it once the import has completed. A malicious user who gains access to the subscription file can edit, create, and delete your Windows Azure services.</p></div>

    For more information, see [Manage Accounts, Subscriptions, and Administrative Roles](http://go.microsoft.com/fwlink/?LinkId=324796#BKMK_AccountVCert).

2. In **Server Explorer**, expand **Windows Azure**, and then expand **Web Sites**.

3. Right-click the node for the web site that you created in [Getting started with Windows Azure and ASP.NET][GetStarted], and then click **View Settings**.

	![View Settings in Server Explorer](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-viewsettings.png)

	The **Azure Web Site** tab appears, and you can see there the site management and configuration tasks that are available in Visual Studio.

	![Azure Web Site window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-configtab.png)

	In this tutorial you'll be using the logging and tracing drop-downs. 
   
	For information about the App Settings and Connection Strings boxes in this window, see [Windows Azure Web Sites: How Application Strings and Connection Strings Work](http://blogs.msdn.com/b/windowsazure/archive/2013/07/17/windows-azure-web-sites-how-application-strings-and-connection-strings-work.aspx).

	If you want to perform a site management task that can't be done this window, you can click **Full Web Site Settings** to open a browser window to the management portal. For more information, see [How to Configure Web Sites](/en-us/manage/services/web-sites/how-to-configure-websites/#howtochangeconfig).

<h2><a name="remotedebug"></a><span class="short-header">Remote debugging</span>Remote Debugging</h2>

Sometimes you might find that your application runs correctly when you run it locally under IIS Express but it has a problem when you deploy it to a Windows Azure Web Site. In this scenario one way to troubleshoot is to run in debug mode remotely.

In this section, you'll debug locally first, and then you'll see how to debug remotely. 

<div class="dev-callout"><strong>Note</strong><p>Remote debugging is a preview feature.</p></div>

### Debug locally

1. Open the web project that you created in [Getting started with Windows Azure and ASP.NET][GetStarted].

1. Open *Controllers\HomeController.cs*.

2. Delete the `About()` method and insert the following code in its place.

        public ActionResult About()
        {
            string currentTime = DateTime.Now.ToLongTimeString();
            ViewBag.Message = "The current time is " + currentTime;
            return View();
        }

2. In the `About` method, right-click the line that sets `ViewBag.Message`, and then in the context menu click **Breakpoint** - **Insert Breakpoint**. (You can also set a breakpoint by pressing F9 while the cursor is in a line.)

	![Set a breakpoint](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-setbreakpoint.png)

3. Press F5 to run in debug mode, and then click the **About** link in the menu bar (you might have to expand the menu by clicking the symbol at the upper right corner of the page).

	Visual Studio stops on the statement that sets `ViewBag.Message`. You can now examine or change variable values, step through code one line at a time, change statement execution order, etc.

4. Hover the mouse pointer over `currentTime` to see the value of the variable.

	![View variable in debug mode](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debugview.png)

5. Click inside the displayed time value and change the time to a different value, such as "Changed in debug mode", and then press Enter.

	![Change variable in debug mode](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debugchange.png)

6. Press F5 to continue running the application.

	The About page displays the new value that you entered for the time.

	![About page](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-afterdebugchange.png)

7. Close the browser

### Debug remotely

1. In **Solution Explorer**, right-click the project, and click **Publish**.

2. In the **Profile** drop-down list, select the same profile that you used in [Getting started with Windows Azure and ASP.NET][GetStarted].

3. Click the **Settings** tab, and change **Configuration** to **Debug**, and then click **Publish**.

	![Publish in debug mode](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-publishdebug.png)

4. After deployment finishes and your browser opens to the Windows Azure URL of your site, close the browser.

5. Make sure that the breakpoint you set earlier is still set.

5. For Visual Studio 2013 only: In **Server Explorer** expand **Windows Azure**, expand **Web Sites**, right-click your web site, and click **Attach Debugger**. 

	![Attach debugger](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-attachdebugger.png)

	The browser automatically opens to your home page running in Windows Azure. You might have to wait 20 seconds or so while Windows Azure sets up the server for debugging. This delay only happens the first time you run in debug mode on a web site. Subsequent times within the next 48 hours when you start debugging again there won't be a delay.

6. For Visual Studio 2012 only:

	* In the Windows Azure Management Portal, go to the **Configure** tab for your web site, and then scroll down to the **Site Diagnostics** section.

	* Set **Remote Debugging** to **On**, and set **Remote Debugging Visual Studio Version** to **2012**.

	![Set remote debugging in management portal](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debuginportal.png)
   
	* In the Visual Studio **Debug** menu, click **Attach to Process**.

	* In the **Qualifier** box, enter the URL for your web site, without the `http://` prefix. 

	* Select **Show processes from all users**.

	* When you're prompted for credentials, enter the user name and password that has permissions to publish the web site. To get these credentials, go to the Dashboard tab for your web site in the management portal and click **Download the publish profile**. Open the file in a text editor, and you'll find the user name and password after the first occurrences of **userName=** and **userPWD=**. 

	* When the processes appear in the **Available Processes** table, select **w3wp.exe**, and then click **Attach**.

	* Open a browser to your site URL.

	You might have to wait 20 seconds or so while Windows Azure sets up the server for debugging. This delay only happens the first time you run in debug mode on a web site. Subsequent times within the next 48 hours when you start debugging again there won't be a delay.

6. Click **About** in the menu again.

	Visual Studio stops on the breakpoint as it did before, except now the project code is running in Windows Azure, not on your local computer.

7. Hover over the `currentTime` variable to see the time value.

	![View variable in debug mode running in Windows Azure](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debugviewinwa.png)

	The time you see is now the Windows Azure server time, which may be in a different time zone than your local computer.

8. Enter a new value for the `currentTime` variable, such as "Now running in Windows Azure".

5. Press F5 to continue running.

	The About page running in Windows Azure displays the new value that you entered into the currentTime variable.

	![About page with new value](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debugchangeinwa.png)

### Notes

* Avoid long stops at breakpoints when remote debugging. Windows Azure treats a process that is stopped for longer than a few minutes as an unresponsive process, and shuts it down.

* While you're debugging, the server is sending data to Visual Studio, which could affect bandwidth charges. For information about bandwidth rates, see [Windows Azure Pricing](/en-us/pricing/calculator/).

* Make sure that the `debug` attribute of the `compilation` element in the *Web.config* file is set to true. It is set to true by default when you publish a debug build configuration.

        <system.web>
          <compilation debug="true" targetFramework="4.5" />
          <httpRuntime targetFramework="4.5" />
        </system.web>

* If you find that the debugger won't step into code that you want to debug, you might have to change the Just My Code setting.  For more information, see [Restrict stepping to Just My Code](http://msdn.microsoft.com/en-us/library/vstudio/y740d9d3.aspx#BKMK_Restrict_stepping_to_Just_My_Code).


### Debugging in production

Running in debug mode in production is not recommended. If your production site is not scaled out to multiple server instances, debugging will tie up traffic to your only web server instance. If you do have multiple web server instances, when you attach to the debugger you'll get a random instance, and you have no way to ensure that your browser requests will go to that instance. Also, you typically don't deploy a debug build to production, and compiler optimizations for release builds might make it impossible to show what is happening line by line in your source code. For troubleshooting production problems, your best resource is application tracing and web server logs.

<h2><a name="logsoverview"></a><span class="short-header">Logs overview</span>Diagnostic logs overview</h2>

An ASP.NET application that runs in a Windows Azure Web Site can create the following kinds of logs:

* **Application tracing logs**<br/>
  The application creates these logs by calling methods of the [System.Diagnostics.Trace](http://msdn.microsoft.com/en-us/library/system.diagnostics.trace.aspx) class.
* **Web server logs**<br/>
  The web server creates a log entry for every HTTP request to the site.
* **Detailed error message logs**<br/>
  The web server creates an HTML page with some additional information for failed HTTP requests (those that result in status code 400 or greater). 
* **Failed request tracing logs**<br/>
  The web server creates an XML file with detailed tracing information for failed HTTP requests. The web server also provides an XSL file to format the XML in a browser.
  
Logging affects site performance, so Windows Azure gives you the ability to enable or disable each type of log as needed. For application logs, you can specify that only logs above a certain severity level should be written. When you create a new web site, by default all logging is disabled.

Logs are written to files in a *LogFiles* folder in the file system of your web site. Web server logs and application logs can also be written to a Windows Azure Storage account. You can retain a greater volume of logs in a storage account than is possible in the file system. You're limited to a maximum of 100 megabytes of logs when you use the file system. (Windows Azure deletes old log files to make room for new ones after the limit is reached.)  

<h2><a name="apptracelogs"></a><span class="short-header">Application logs</span>Create and view application trace logs</h2>

In this section you'll do the following tasks:

* Add tracing statements to the web project that you created in [the earlier tutorial][GetStarted].
* View the logs when you run the project locally.
* View the logs as they are generated by the application running in Windows Azure. 

### Add tracing statements to the application

1. Open *Controllers\HomeController.cs*, and replace the file contents with the following code in order to add `Trace` statements and a `using` statement for `System.Diagnostics`:

		using System;
		using System.Collections.Generic;
		using System.Configuration;
		using System.Diagnostics;
		using System.Linq;
		using System.Web;
		using System.Web.Configuration;
		using System.Web.Mvc;
		namespace MyExample.Controllers
		{
		    public class HomeController : Controller
		    {
		        public ActionResult Index()
		        {
		            Trace.WriteLine("Entering Index method");
		            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
		            Trace.TraceInformation("Displaying the Index page at " + DateTime.Now.ToLongTimeString());
		            Trace.WriteLine("Leaving Index method");
		            return View();
		        }
		
		        public ActionResult About()
		        {
		            Trace.WriteLine("Entering About method");
		            ViewBag.Message = "Your app description page.";
		            Trace.TraceWarning("Transient error on the About page at " + DateTime.Now.ToShortTimeString());
		            Trace.WriteLine("Leaving About method");
		            return View();
		        }
		
		        public ActionResult Contact()
		        {
		            Trace.WriteLine("Entering Contact method");
		            ViewBag.Message = "Your contact page.";
		            Trace.TraceError("Fatal error on the Contact page at " + DateTime.Now.ToLongTimeString());
		            Trace.WriteLine("Leaving Contact method");
		            return View();
		        }
		    }
		}
		
				
### View the tracing output locally

3. Press F5 to run the application in debug mode.

	The default trace listener writes all trace output to the **Output** window, along with other Debug output. The following illustration shows the output from the trace statements that you added to the `Index` method.

	![Tracing in Debug window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-debugtracing.png)

	The following steps show how to view trace output in a web page, without compiling in debug mode.

2. Open the application Web.config file (the one located in the project folder) and add a `<system.diagnostics>` element at the end of the file just before the closing `</configuration>` element:

  		<system.diagnostics>
		    <trace>
		      <listeners>
		        <add name="WebPageTraceListener"
                    type="System.Web.WebPageTraceListener, 
                    System.Web, 
                    Version=4.0.0.0, 
                    Culture=neutral,
                    PublicKeyToken=b03f5f7f11d50a3a" />
		      </listeners>
		    </trace>
		  </system.diagnostics>

	The `WebPageTraceListener` lets you view trace output by browsing to `/trace.axd`.

3. Add a [trace element](http://msdn.microsoft.com/en-us/library/vstudio/6915t83k(v=vs.100).aspx) under `<system.web>` in the Web.config file, such as the following example:

		<trace enabled="true" writeToDiagnosticsTrace="true" mostRecent="true" pageOutput="false" />

3. Press CTRL+F5 to run the application.

4. In the address bar of the browser window, add *trace.axd* to the URL, and then press Enter (the URL will be similar to http://localhost:53370/trace.axd).

5. On the **Application Trace** page, click **View Details**.

	![trace.axd](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-traceaxd1.png)

	The **Request Details** page appears, and in the **Trace Information** section you see the output from the trace statements that you added to the `Index` method.

	![trace.axd](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-traceaxd2.png)

	By default, `trace.axd` is only available locally. If you wanted to make it available from a remote site, you could add `localOnly="false"` to the `trace` element in the *Web.config* file, as shown in the following example:

		<trace enabled="true" writeToDiagnosticsTrace="true" localOnly="false" mostRecent="true" pageOutput="false" />

	However, enabling `trace.axd` in a production site is generally not recommended for security reasons, and in the following sections you'll see an easier way to read tracing logs in a Windows Azure Web Site.

### View the tracing output in Windows Azure

1. In **Solution Explorer**, right-click the web project and click **Publish**.

2. In the **Publish Web** dialog box, click **Publish**.

	After Visual Studio publishes your update, it opens a browser window to your home page (assuming you didn't clear **Destination URL** on the **Connection** tab).

3. In **Server Explorer**, right-click your web site and select **View Streaming Logs in Output Window**. 

	![View Streaming Logs in context menu](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-viewlogsmenu.png)

	The **Output** window shows that you are connected to the log-streaming service, and adds a notification line each minute that goes by without a log to display.

	![View Streaming Logs in context menu](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-nologsyet.png)

4. In the browser window that shows your application home page, click **Contact**.

	Within a few seconds the output from the error-level trace you added to the `Contact` method appears in the **Output** window.

	![Error trace in Output window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-errortrace.png)

	Visual Studio is only showing error-level traces because that is the default setting when you enable the log monitoring service. When you create a new Windows Azure Web Site, all logging is disabled by default, as you saw when you opened the site settings page earlier:

	![Application Logging off](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-apploggingoff.png)


	However, when you selected **View Streaming Logs in Output Window**, Visual Studio automatically changed **Application Logging(File System)** to **Error**, which means error-level logs get reported. In order to see all of your tracing logs, you can change this setting to **Verbose**. When you select a severity level lower than error, all logs for higher severity levels are also reported. So when you select verbose, you also see information, warning, and error logs.  

4. In **Server Explorer**, right-click the web site, and then click **View Settings** as you did earlier.

5. Change **Application Logging (File System)** to **Verbose**, and then click **Save**.
 
	![Setting trace level to Verbose](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-applogverbose.png)

6. In the browser window that is now showing your **Contact** page, click **Home**, then click **About**, and then click **Contact**.

	Within a few seconds, the **Output** window shows all of your tracing output.

	![Verbose trace output](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-verbosetraces.png)

	In this section you enabled and disabled logging by using Windows Azure Web Site settings. You can also enable and disable trace listeners by modifying the Web.config file. However, modifying the Web.config file causes the app domain to recycle, while enabling logging via the web site doesn't do that. If the problem takes a long time to reproduce, or is intermittent, recycling the app domain might "fix" it and force you to wait until it happens again. Enabling diagnostics in Windows Azure doesn't do this, so you can start capturing error information immediately.

### Output window features

The **Windows Azure Logs** tab of the **Output** Window has several buttons and a text box:

![Logs tab buttons](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-icons.png)

These perform the following functions:

* Clear the **Output** window.
* Enable or disable word wrap.
* Start or stop monitoring logs.
* Specify which logs to monitor.
* Download logs.
* Filter logs based on a search string or a regular expression.
* Close the **Output** window.

If you enter a search string or regular expression, Visual Studio filters logging information at the client. That means you can enter the criteria after the logs are displayed in the **Output** window and you can change filtering criteria without having to regenerate the logs.

<h2><a name="webserverlogs"></a><span class="short-header">Web server logs</span>View web server logs</h2>

Web server logs record all HTTP activity on the site. In order to see them in the **Output** window you have to enable them on the site and tell Visual Studio that you want to monitor them. 

1. In the **Azure Web Site Configuration** tab that you opened from **Server Explorer**, change Web Server Logging to **On**, and then click **Save**.

	![Enable web server logging](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-webserverloggingon.png)

2. In the **Output** Window, click the **Specify which Windows Azure logs to monitor** button.
	
	![Specify which Windows Azure logs to monitor](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-specifylogs.png)

3. In the **Windows Azure Logging Options** dialog box, select **Web server logs**, and then click **OK**.

	![Monitor web server logs](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-monitorwslogson.png)

4. In the browser window that shows the web site, click **Home**, then click **About**, and then click **Contact**.

	The application logs generally appear first, followed by the web server logs. You might have to wait a while for the logs to appear. 

	![Web server logs in Output window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-wslogs.png)


By default, when you first enable web server logs by using Visual Studio, Windows Azure writes the logs to the file system. As an alternative, you can use the management portal to specify that web server logs should be written to a blob container in a storage account. For more information, see the **site diagnostics** section in [How to Configure Web Sites](/en-us/manage/services/web-sites/how-to-configure-websites/#howtochangeconfig). 

If you use the management portal to enable web server logging to a Windows Azure storage account, and then disable logging in Visual Studio, when you re-enable logging in Visual Studio your storage account settings are restored. 

<h2><a name="detailederrorlogs"></a><span class="short-header">Error logs</span>View detailed error message logs</h2>

Detailed error logs provide some additional information about HTTP requests that result in error response codes (400 or above). In order to see them in the **Output** window, you have to enable them on the site and tell Visual Studio that you want to monitor them.

1. In the **Azure Web Site Configuration** tab that you opened from **Server Explorer**, change **Detailed Error Messages** to **On**, and then click **Save**.

	![Enable detailed error messages](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-detailedlogson.png)

2. In the **Output** Window, click the **Specify which Windows Azure logs to monitor** button.

3. In the **Windows Azure Logging Options** dialog box, click **All logs**, and then click **OK**.

	![Monitor all logs](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-monitorall.png)

4. In the address bar of the browser window, add an extra character to the URL to cause a 404 error (for example, `http://localhost:53370/Home/Contactx`), and press Enter.

	After several seconds the detailed error log appears in the Visual Studio **Output** window. The log output is long, and the following image only shows part of it.

	![Detailed error log in Output window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-detailederrorlog.png)

	If you copy the HTML of the log output and open it in a browser, you see the following page:

	![Detailed error log in browser window](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-detailederrorloginbrowser.png)

<h2><a name="downloadlogs"></a><span class="short-header">Download logs</span>Download file system logs</h2>

Any logs that you can monitor in the **Output** window can also be downloaded as a *.zip* file. 

1. In the **Output** window, click **Download Streaming Logs**.

	![Logs tab buttons](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-downloadicon.png)

	File Explorer opens to your *Downloads* folder with the downloaded file selected.

	![Downloaded file](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-downloadedfile.png)

2. Extract the *.zip* file, and you see the following folder structure:

	![Downloaded file](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-logfilefolders.png)

	* Application tracing logs are in *.txt* files in the *LogFiles\Application* folder.
	* Web server logs are in *.log* files in the *LogFiles\http\RawLogs* folder. You can use a tool such as [Log Parser](http://www.microsoft.com/en-us/download/details.aspx?displaylang=en&id=24659) to view and manipulate these files.
	* Detailed error message logs are in *.html* files in the *LogFiles\DetailedErrors* folder.

	(The *deployments* folder is for files created by source control publishing; it doesn't have anything related to Visual Studio publishing. The *Git* folder is for traces related to source control publishing and the log file streaming service.)  

<h2><a name="storagelogs"></a><span class="short-header">Storage logs</span>View storage logs</h2>

Application tracing logs can also be sent to a Windows Azure storage account, and you can view them in Visual Studio. To do that you'll create a storage account, enable storage logs in the management portal, and view them in the **Logs** tab of the **Azure Web Site** window.

You can send logs to both the file system and a storage account, and you can specify a different severity level for each. You currently have file system logs set to verbose level; you'll set storage logs to information level. Information level means all logs created by calling `Trace.TraceInformation`, `Trace.TraceWarning`, and `Trace.TraceError` will be displayed, but not logs created by calling `Trace.WriteLine`.

One advantage of sending application tracing logs to storage is that you get some additional information with each log that you don't get from file system logs.

1. In **Server Explorer**, right-click the web site, and then click **Open in Management Portal**.

2. In the management portal, click the **Storage** tab, and then click **Create a Storage Account**.

	![Create a storage account](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-createstorage.png)

2. Enter a unique URL to use for the storage account, and then click **Create Storage Account**.

	![Enter a URL](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-storageurl.png)

1. In the Visual Studio **Azure Web Site** window, click the **Logs** tab, and then click **Configure Logging**.

	![Downloaded file](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-configlogging.png)

	This opens the **Configure** tab in the management portal for your web site. Another way to get here is to click the **Web Sites** tab, click your web site, and then click the **Configure** tab.

2. In the management portal **Configure** tab, scroll down to the application diagnostics section, and then change **Application Logging (Storage)** to **On**.

3. Change **Logging Level** to **Information**.

4. Click **Manage Connection**.

	![Click Manage Connection](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-stgsettingsmgmtportal.png)

	In the **Manage diagnostic storage** box, you can choose your storage account if you have more than one. The **Storage Account Key** field defaults to the primary key value of the selected storage account.

	![Click Manage Connection](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-choosestorageacct.png)

6. In the **Manage diagnostic storage** box click the check mark to close the box.

6. In the management portal **Configure** tab, click **Save**.

7. In the browser window that displays the application web site, click **Home**, then click **About**, and then click **Contact**.

	The logging information produced by browsing these web pages will be written to the storage account.

8. In the **Logs** tab of the **Azure Web Site** window in Visual Studio, click **Refresh** under **Diagnostic Summary**.

	![Click Refresh](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-refreshstorage.png)

	The **Diagnostic Summary** section shows logs for the last 15 minutes by default. You can change the period to see more logs. 

	(If you get a "table not found" error for the WAWSAppLogTable, verify that you browsed to the pages that do the tracing after you enabled **Application Logging (Storage)** and after you clicked **Save**.)

	![Storage logs](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-storagelogs.png)

	Notice that in this view you see **Process ID** and **Thread ID** for each log, which you don't get in the file system logs. You can see additional fields by viewing the Windows Azure storage table directly.

8. Click **View all application logs**.

	The trace log table appears in the Windows Azure storage table viewer.
   
	(If you get a "sequence contains no elements" error, open **Server Explorer**, expand the node for your storage account under the **Windows Azure** node, and then right-click **Tables** and click **Refresh**.)

	![Trace table in Server Explorer](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-tracetableinse.png)

	![Storage logs in table view](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-tracelogtableview.png)

	This view shows additional fields you don't see in any other views. This view also enables you to filter logs by using special Query Builder UI for constructing a query. For more information, see Working with Table Resources - Filtering Entities in [Browsing Storage Resources with Server Explorer](http://msdn.microsoft.com/en-us/library/windowsazure/ff683677.aspx).

7. To look at the details for a single row, right-click one of the rows, and then click **Edit**.

	![Trace table in Server Explorer](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-tracetablerow.png)

<h2><a name="failedrequestlogs"></a><span class="short-header">Failed request logs</span>View failed request tracing logs</h2>

Failed request tracing logs are useful when you need to understand the details of how IIS is handling an HTTP request, in scenarios such as URL rewriting or authentication problems. 

Windows Azure Web Sites use the same failed request tracing functionality that has been available with IIS 7.0 and later. You don't have access to the IIS settings that configure which errors get logged, however. When you enable failed request tracing, all errors are captured. 

You can enable failed request tracing by using Visual Studio, but you can't view them in Visual Studio. These logs are XML files. The streaming log service only monitors files that are deemed readable in plain text mode:  *.txt*, *.html*, and *.log* files.

You can view failed request tracing logs in a browser directly via FTP or locally after using an FTP tool to download them to your local computer. In this section you'll view them in a browser directly.

1. In the **Configuration** tab of the **Azure Web Site** window that you opened from **Server Explorer**, change **Failed Request Tracing** to **On**, and then click **Save**.

	![Enable failed request tracing](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-failedrequeston.png)

4. In the address bar of the browser window that shows the web site, add an extra character to the URL and click Enter to cause a 404 error.

	This causes a failed request tracing log to be created, and the following steps show how to view or download the log.

2. In Visual Studio, in the **Configuration** tab of the **Azure Web Site** window, click **Open in Management Portal**.

3. In the management portal, click **Dashboard**, and then click **Reset your deployment credentials** in the **Quick Glance** section.

	![Reset FTP credentials link in Dashboard](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-resetftpcredentials.png)

4. Enter a new user name and password.

	![New FTP user name and password](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-enterftpcredentials.png)

5. In the management portal **Dashboard** tab press F5 to refresh the page, and then scroll down to where you see **Deployment / FTP User**. Notice that the user name has the site name prefixed to it. **When you log in, you have to use this full user name with the site name prefixed to it as shown here.**

5. In a new browser window, go to the URL that is shown under **FTP Host Name** in the **Dashboard** tab of the management portal page for your web site. **FTP Host Name** is located near **Deployment / FTP User** in the **Quick Glance** section.

6. Log in using the FTP credentials that you created earlier (including the site name prefix for the user name).

	The browser shows the root folder of the site.

6. Open the *LogFiles* folder.

	![Open LogFiles folder](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-logfilesfolder.png)

7. Open the folder that is named W3SVC plus a numeric value.

	![Open W3SVC folder](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-w3svcfolder.png)

	The folder contains XML files for any errors that have been logged after you enabled failed request tracing, and an XSL file that a browser can use to format the XML.

	![W3SVC folder](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-w3svcfoldercontents.png)

8. Click the XML file for the failed request that you want to see tracing information for.

	The following illustration shows part of the tracing information for a sample error.

	![Failed request tracing in browser](./media/web-sites-dotnet-troubleshoot-visual-studio/tws-failedrequestinbrowser.png)


<h2><a name="nextsteps"></a><span class="short-header">Next Steps</span>Next Steps</h2>

You've seen how Visual Studio makes it easy to view logs created by a Windows Azure Web Site. You might want to learn more about troubleshooting Windows Azure Web Sites, tracing in ASP.NET applications, and analyzing web server logs.

### Windows Azure Web Site troubleshooting

For more information about troubleshooting Windows Azure Web Sites (WAWS), see the following resources:

* [Troubleshooting in Windows Azure](/en-us/develop/net/best-practices/troubleshooting/)<br/>
  A basic introductory white paper that includes a short section on WAWS.
* [Troubleshooting a Web Site](/en-us/develop/net/best-practices/troubleshooting-web-sites/)<br/>
  An introduction that focuses on WAWS.
* [Enable diagnostic logging for Windows Azure Web Sites](/en-us/develop/net/common-tasks/diagnostics-logging-and-instrumentation/)<br/>
  Covers much of the same information provided by this tutorial but focuses on how to get diagnostic logs without using Visual Studio. 
* [How to Monitor Web Sites](/en-us/manage/services/web-sites/how-to-monitor-websites/)<br/>
  The [configure diagnostics and download logs](/en-us/manage/services/web-sites/how-to-monitor-websites/#howtoconfigdiagnostics) section has valuable information not included in the troubleshooting documents.

For help with a specific troubleshooting question, start a thread in one of the following forums:

* [The Windows Azure forum on the ASP.NET site](http://forums.asp.net/1247.aspx/1?Azure+and+ASP+NET).
* [The Windows Azure forum on MSDN](http://social.msdn.microsoft.com/Forums/windowsazure/).
* [StackOverflow.com](http://www.stackoverflow.com).

### Debugging in Visual Studio 

For information about how to use debug mode in Visual Studio, see the [Debugging in Visual Studio](http://msdn.microsoft.com/en-us/library/vstudio/sc65sadd.aspx) MSDN topic.

### Tracing in ASP.NET applications

There are no thorough and up-to-date introductions to ASP.NET tracing available on the Internet. The best you can do is get started with old introductory materials written for Web Forms because MVC didn't exist yet, and supplement that with newer blog posts that focus on specific issues. Some good places to start are the following resources:

* [ASP.NET Tracing](http://msdn.microsoft.com/en-us/library/ms972204.aspx)<br/>
  Old but still a good resource for a basic introduction to the subject.
* [Trace Listeners](http://msdn.microsoft.com/en-us/library/4y5y10s7.aspx)<br/>
  Information about trace listeners but doesn't mention the [WebPageTraceListener](http://msdn.microsoft.com/en-us/library/system.web.webpagetracelistener.aspx).
* [Walkthrough: Integrating ASP.NET Tracing with System.Diagnostics Tracing](http://msdn.microsoft.com/en-us/library/b0ectfxd.aspx)<br/>
  This too is old, but includes some additional information that the introductory article doesn't cover.
* [Tracing in ASP.NET MVC Razor Views](http://blogs.msdn.com/b/webdev/archive/2013/07/16/tracing-in-asp-net-mvc-razor-views.aspx)<br/>
  Besides tracing in Razor views, the post also explains how to create an error filter in order to log all unhandled exceptions in an MVC application. For information about how to log all unhandled exceptions in a Web Forms application, see the Global.asax example in [Complete Example for Error Handlers](http://msdn.microsoft.com/en-us/library/bb397417.aspx) on MSDN. In either MVC or Web Forms, if you want to log certain exceptions but let the default framework handling take effect for them, you can catch and rethrow as in the following example:

        try
        {
           // Your code that might cause an exception to be thrown.
        }
        catch (Exception ex)
        {
            Trace.TraceError("Exception: " + ex.ToString());
            throw;
        } 

* [Scott Guthrie: Building Real World Cloud Apps with Windows Azure - Part 2](http://vimeo.com/68215602)<br/>
  See 47:00-55:36 in this video for up-to-date recommendations for tracing in Windows Azure cloud applications.
* [Streaming Diagnostics Trace Logging from the Azure Command Line (plus Glimpse!)](http://www.hanselman.com/blog/StreamingDiagnosticsTraceLoggingFromTheAzureCommandLinePlusGlimpse.aspx)<br/>
  How to use the command line to do what this tutorial shows how to do in Visual Studio. [Glimpse](http://www.hanselman.com/blog/IfYoureNotUsingGlimpseWithASPNETForDebuggingAndProfilingYoureMissingOut.aspx) is a tool for debugging ASP.NET applications. 

For error logging, an alternative to writing your own tracing code is to use an open-source logging framework such as [ELMAH](http://nuget.org/packages/elmah/). For more information, see [Scott Hanselman's blog posts about ELMAH](http://www.hanselman.com/blog/NuGetPackageOfTheWeek7ELMAHErrorLoggingModulesAndHandlersWithSQLServerCompact.aspx).

Also, note that you don't have to use ASP.NET or System.Diagnostics tracing if you want to get streaming logs from Windows Azure. The Windows Azure Web Site streaming log service will stream any *.txt*, *.html*, or *.log* file that it finds in the *LogFiles* folder. Therefore, you could create your own logging system that writes to the file system of the web site, and your file will be automatically streamed and downloaded. All you have to do is write application code that creates files in the *d:\home\logfiles* folder. 

### Analyzing web server logs

For more information about analyzing web server logs, see the following resources:

* [LogParser](http://www.microsoft.com/en-us/download/details.aspx?id=24659)<br/>
  A tool for viewing data in web server logs (*.log* files).
* [Troubleshooting IIS Performance Issues or Application Errors using LogParser ](http://www.iis.net/learn/troubleshoot/performance-issues/troubleshooting-iis-performance-issues-or-application-errors-using-logparser)<br/>
  An introduction to the Log Parser tool that you can use to analyze web server logs.
* [Blog posts by Robert McMurray on using LogParser](http://blogs.msdn.com/b/robert_mcmurray/archive/tags/logparser/)<br/>
* [The HTTP status code in IIS 7.0, IIS 7.5, and IIS 8.0](http://support.microsoft.com/kb/943891)

### Analyzing failed request tracing logs

The Microsoft TechNet web site includes a [Using Failed Request Tracing](http://www.iis.net/learn/troubleshoot/using-failed-request-tracing) section which may be helpful for understanding how to use these logs. However, this documentation focuses mainly on configuring failed request tracing in IIS, which you can't do in Windows Azure Web Sites.




[GetStarted]: /en-us/develop/net/tutorials/get-started/


