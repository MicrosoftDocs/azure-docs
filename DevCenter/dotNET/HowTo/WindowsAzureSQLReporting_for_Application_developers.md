<properties linkid="develop-dotnet-sql-reporting" urlDisplayName="SQL Reporting" pageTitle="How to use SQL Reporting (.NET) - Windows Azure feature guide" metaKeywords="" metaDescription="Learn how to use SQL Reporting programmatically in Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu.md" />

# Windows Azure SQL Reporting for Application developers

This topic provides information about deploying a report server project to Windows Azure SQL Reporting report server, and getting started information for application developers who integrate reports hosted by Windows Azure SQL Reporting in their applications, as well as develop management tools against SQL Reporting report servers.

To get started with Windows Azure SQL Reporting, you must have a Windows Azure subscription. You can use an existing subscription, a new subscription, or the free trial subscription. For more information, see  [http://www.windowsazure.com/en-us/](http://www.windowsazure.com/en-us/).

This guide assumes that you have some prior experience developing custom applications using SQL Server Reporting Services. For more information, see [Developer's Guide (Reporting Services)][]. The guide also assumes that you have some knowledge on usage of ReportViewer controls. For an overview of ReportViewer controls, see [ReportViewer Controls (Visual Studio)][].

## Objectives ##
In this tutorial you will learn how to:

- Deploy a report server project to a SQL Reporting report server.
- Render reports in ReportViewer Controls.
- Programmatically access SQL Reporting using SOAP Management Endpoint


##Tutorials Segments##
1.	[Deploy a Report Project](#Deploy_ReportServer_Project)
2.	[Access SQL Reporting Reports in ReportViewer Controls](#Access_Reports_In_ReportViewer)
3.	[Programmatically access Reports using SOAP Management Endpoint](#Programmatically_Access)
4.	[Next Steps](#NextSteps)

<h2><a name="Deploy_ReportServer_Project"></a>Deploy a Report Project</h2>
From Business Intelligence Development Studio(BIDS) of SQL Server, you can deploy all the reports and shared data sources in a Report Server project to a Windows Azure SQL Reporting report server. You can deploy the entire project, or individual reports or data sources. Before you deploy reports or data sources, you need to set the project properties of the Report Server project in Business Intelligence Development Studio.

<strong>To set deployment properties</strong>

1.	Open an already existing report server project. In <strong>Solution Explorer</strong>, right-click the report server project and click <strong>Properties</strong>. (_If the Solution Explorer window is not visible, from the View menu, click Solution Explorer._)

	_For more information about creating a report server project, see [Creating a Report Server Project][]. For other tutorials, see [Tutorials (SSRS)][]._ 

2.	In the Configuration list, select the deployment configuration that you want to use. 

	![ReportServerProperties][]

3.	In <strong>OverwriteDataSources</strong> and <strong>OverwriteDatasets</strong>, select True to overwrite them on the server each time they are deployed or select False to keep the existing versions on the server.
4.	In the <strong>TargetServerVersion</strong> list, verify that the value is set to SQL Server 2008 R2.

5.	In <strong>TargetDataSourceFolder</strong> and <strong>TargetReportFolder</strong>, type the name of folder on the report server in which to deploy the report item. 

	If you leave the value of <strong>TargetDataSourceFolder</strong> blank, the data sources will be published to the location specified in <strong>TargetReportFolder</strong>. If <strong>TargetReportFolder</strong> is blank, reports and data sources are deployed to the root folder of the server.

	Datasets and report parts cannot be managed directly on the SQL Reporting report server and you need not provide values for <strong>TargetDatasets</strong> and <strong>TargetReportPartFolder</strong>.
6.	In the <strong>TargetServerURL</strong> box, type the URL of the target SQL Reporting report server. The syntax of the URL is `https://<ServerName>.reporting.windows.net/ReportServer`.


<strong>To deploy all reports in a project</strong>

In <strong>Solution Explorer</strong>, right-click the report project and click <strong>Deploy</strong>. You will be prompted for credentials for the SQL Reporting login.

![LoginDialog][]

_When you deploy a Report Server project, the shared data sources in the report project are also deployed._ 

<strong>To deploy a single report</strong>

In <strong>Solution Explorer</strong>, right-click the report and click <strong>Deploy</strong>. You can view the status of the publishing process in the Output window.

*When you publish a single report, you must also deploy the shared data sources that the report uses.*

<strong>To deploy a single data source</strong>

In <strong>Solution Explorer</strong>, right-click the data source and click <strong>Deploy</strong>. You can view the status of the publishing process in the Output window.


<h2><a name="Access_Reports_In_ReportViewer"></a>Access SQL Reporting Reports in ReportViewer Controls</h2>

Similar to reports deployed to on-premise SQL Server Reporting Services (SSRS) report servers, reports deployed to Windows Azure SQL Reporting report servers can be displayed in ASP.NET applications using the Visual Studio ReportViewer control. 

ReportViewer controls are shipped with Visual Studio 2010, Standard Edition or higher editions. If you are using the Web Developer Express Edition, you must install the [Microsoft Report Viewer 2010 Redistributable Package][] to use the ReportViewer runtime features.

To integrate ReportViewer into your Windows Azure application, you need to pay attention to the following: 

* Include the needed assemblies in the deployment package.
* Configure authentication and authorization appropriately.

For more information, see [How to: Use ReportViewer in a Web Site Hosted in Windows Azure][].

For more information about the use of ReportViewer in a Windows Azure web site that uses more than one web role instance, see [Using the ReportViewer ASP.NET Control in Windows Azure][].


<strong>Creating the Windows Azure Project with ReportViewer control</strong>

1.	Use administrator privileges to launch either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. 

	To do this, in <strong>Start</strong> | <strong>All Programs</strong> | <strong>Microsoft Visual Studio 2010</strong>, right-click the <strong>Microsoft Visual Studio 2010</strong> (or Microsoft Visual Web Developer Express 2010) and choose Run as Administrator. If the User Account Control dialog appears, click <strong>Continue</strong>.

	_The Windows Azure compute emulator requires that Visual Studio be launched with administrator privileges. For more information about Windows Azure Compute Emulator and other SDK tools, see [Overview of the Windows Azure SDK Tools][]._

	In Visual Studio, on the <strong>File</strong> menu, click <strong>New</strong>, and then click <strong>Project</strong>. 

	![VSNewProject][]

2. From Installed Templates, under Visual C#, click <strong>Cloud</strong> and then click <strong>Windows Azure Project</strong>. Name the application and click <strong>OK</strong>.

	![NewProjectDialog][]

3.	In the <strong>New Windows Azure Project</strong> dialog, inside the <strong>.NET Framework 4 roles</strong> panel, expand the tab for the language of your choice (Visual C# or Visual Basic), select ASP.NET Web Role from the list of available roles and click the arrow (>) to add an instance of this role to the solution. Before closing the dialog, select the new role in the right panel, click the pencil icon and rename the role. Click <strong>OK</strong> to create the cloud service solution.

	![NewAzureProjectDialog][]

4.	In <strong>Solution Explorer</strong>, review the structure of the created solution. If <strong>Solution Explorer</strong> is not already visible, click <strong>Solution Explorer</strong> on the <strong>View</strong> menu. 

	![SolutionExplorer][]

5.	On the designer mode of Default.aspx, drag the ReportViewer control from the Reporting group of the <strong>Toolbox</strong> to the Web form. To open the <strong>Toolbox</strong>, click <strong>Toolbox</strong> on the <strong>View</strong> menu. You can dock the <strong>Toolbox</strong>, and you can pin it open or set it to Auto Hide. 

	![Toolbox][]

6.	Set the [ProcessingMode][] of the ReportViewer control to <strong>Remote</strong>. ReportViewer configured in <strong>Local</strong> processing mode is not supported in Windows Azure. Set the other properties on the ReportViewer control to determine the visibility and availability of viewing areas. Use the reference documentation to learn about each property. For more information, see [ReportViewer Properties][].

	_To use the <strong>ReportViewer</strong> control in a Web form, you must also add a [ScriptManager][] control to your page. From the <strong>Toolbox</strong> window, in the <strong>AJAX Extensions</strong> group, drag a <strong>ScriptManager</strong> control to the design surface above the <strong>ReportViewer</strong> control._

7.	The ReportViewer control manages the authentication cookie, making your tasks easier. To display reports deployed to a SQL Reporting report server in the ReportViewer control, you supply the report server URL and the report path as you would for any server report. Then implement the IReportServerCredentials interface and use it in ServerReport.ReportServerCredentials. 

	The following example shows how to implement the IReportServerCredentials:

		
		/// <summary>
		/// Implementation of IReportServerCredentials to supply forms credentials to SQL Reporting using GetFormsCredentials() 
		/// </summary>
		using Microsoft.Reporting.WebForms;
		using System.Security.Principal;
		using System.Configuration;
		using System.Net;
		public class ReportServerCredentials : IReportServerCredentials
		{
	    	public ReportServerCredentials()
		    {
		    }	
	    	public WindowsIdentity ImpersonationUser
		    {
		        get
		        {
		            return null;
		        }
		    }	
	    	public ICredentials NetworkCredentials
		    {
		        get
		        {
		            return null;
		        }
		    }	
	    	public bool GetFormsCredentials(out Cookie authCookie, out string user, out string password, out string authority)
		    {
		        authCookie = null;
		        user = ConfigurationManager.AppSettings["USERNAME"];
		        password = ConfigurationManager.AppSettings["PASSWORD"];
		        authority = ConfigurationManager.AppSettings["SERVER_NAME"];
		        return true;
		    }
		}

	In the Web.config or App.config file, specify the application settings in the `<appSettings>` element under `<configuration>`. The following example shows how the `<appSettings>` element might look like. (Consider specifying the values as per your SQL Reporting report server.)
	
		<appSettings>
		  <add key="SERVER_NAME" value="<INSTANCE_NAME>.report.int.mscds.com" />
		  <add key="USERNAME" value="<USERNAME>"/>
		  <add key="PASSWORD" value="<PASSWORD>"/>
		  <add key="REPORT_PATH" value="<REPORT_PATH>"/>
		</appSettings>		
	
				

8. The following example shows how to use the IReportServerCredentials to access SQL Reporting reports:
		
		using System;
		using System.Configuration;
		public partial class Default : System.Web.UI.Page
		{
		    protected void Page_Init(object sender, EventArgs e)
		    {
		         ReportViewer1.ServerReport.ReportServerUrl = new Uri(String.Format("https://{0}/reportserver", ConfigurationManager.AppSettings["SERVER_NAME"]));
		         ReportViewer1.ServerReport.ReportPath = ConfigurationManager.AppSettings["REPORT_PATH"];
		         ReportViewer1.ServerReport.ReportServerCredentials = new ReportServerCredentials();
		    }
		}
		

<h2><a name="Programmatically_Access"></a>Programmatically access Reports using SOAP Management Endpoint</h2>

The SQL Reporting SOAP API provides several Web service endpoints for developing custom reporting solutions.The management functionality is exposed through the [ReportService2005][] and [ReportService2010][] endpoints. For the list of unsupported SOAP APIs in SQL Reporting, see [Guidelines and Limitations for Windows Azure SQL Reporting][].

When accessing the SOAP management endpoint, you use the endpoint’s LogonUser() method to authenticate with the endpoint. You then need to save the authentication cookie returned by the HTTP response and include it in each subsequent operation request. The easiest way to do this is to create a new instance of CookieContainer and assign that to the CookieContainer property of the proxy class before calling LogonUser().

<strong>To generate the proxy class</strong>

1.	In the browser, go to the path for your endpoint. For example: `https://<INSTANCE_NAME>.report.int.mscds.com/ReportServer/reportservice2010.asmx`
2.	If prompted for credentials, type your SQL Reporting username and password and click Sign In. A WSDL file will be displayed in the browser.
3.	Open the Visual Studio Command Prompt and run the wsdl.exe command to generate the proxy class. For example: wsdl /language:CS /n:"ReportServices2010"&lt;WSDL\_FILE\_PATH&gt; 

	You can also specify the file (or directory) to save the generated proxy code by specifying the parameter as `/o[ut]:filename or directoryname`. Else, the proxy file gets created under the default directory from where you are calling the wsdl.exe.

	![CmdPrompt][]

	To open <strong>Visual Studio Command Prompt (2010)</strong> window, Click <strong>Start</strong>, point to <strong>All Programs</strong>, point to <strong>Microsoft Visual Studio 2010</strong>, point to <strong>Visual Studio Tools</strong>, and then right-click <strong>Visual Studio Command Prompt (2010)</strong> and choose Run as Administrator. If the User Account Control dialog appears, click <strong>Continue</strong>.

	For more information and syntax for WSDL.exe tool, see [Web Services Description Language Tool (Wsdl.exe)][].

4.	In Visual Studio, add the generated .cs file to your project.


<strong>To authenticate and authorize with the management endpoint</strong>

The following code shows how to authenticate and authorize with the ReportingServices2010 management endpoint and perform the ReportingService2010.ListChildren() operation. Note that the CookieContainer property is set to a new instance of the CookieContainer class before the LogonUser() method runs. This ensures that the authentication cookie that is returned by the Web response of LogonUser() is saved and used in later Web service calls.
	 
	ReportingService2010 rs = new ReportingService2010();
	rs.Url = String.Format("https://{0}:443/ReportServer/	ReportService2010.asmx", ConfigurationManager.AppSettings["SERVER_NAME"]);
	rs.CookieContainer = new CookieContainer();
	rs.LogonUser(ConfigurationManager.AppSettings["USERNAME"], ConfigurationManager.AppSettings["PASSWORD"], ConfigurationManager.AppSettings["SERVER_NAME"]);
	CatalogItem[] items = rs.ListChildren("/", true);

Then, in the Web.config or App.config file, specify the application settings in the `<appSettings>` element. The following example shows how the `<appSettings>` element might look like. (Consider specifying the values as per your SQL Reporting report server.)
	 
		<appSettings>
		  <add key="SERVER_NAME" value="<INSTANCE_NAME>.report.int.mscds.com" />
		  <add key="USERNAME" value="<USERNAME>"/>
		  <add key="PASSWORD" value="<PASSWORD>"/>
		</appSettings>


<h2><a name="NextSteps"></a>Next steps</h2>

Now you are familiar with SQL Reporting and how to integrate reports hosted by SQL Reporting in your applications, as well as develop management tools against SQL Reporting report servers. Now you can move to the next step by learning more about the available SOAP APIs in SQL Reporting. Refer the following topics:

- [Getting Started Guide for Application Developers (Windows Azure SQL Reporting)][]
- [Using the SOAP API in a Windows Application][]
- [Using the SOAP API in a Web Application][]
 



[ReportViewer Controls (Visual Studio)]: http://msdn.microsoft.com/en-us/library/ms251671.aspx

[Developer's Guide (Reporting Services)]: http://technet.microsoft.com/en-us/library/bb522713.aspx

[How to: Use ReportViewer in a Web Site Hosted in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/gg430128.aspx

[Using the ReportViewer ASP.NET Control in Windows Azure]: http://msdn.microsoft.com/en-us/library/windowsazure/hh825825(v=vs.103).aspx

[Microsoft Report Viewer 2010 Redistributable Package]: http://go.microsoft.com/fwlink/?LinkId=208805

[Overview of the Windows Azure SDK Tools]: http://msdn.microsoft.com/en-us/library/windowsazure/gg432968.aspx

[ProcessingMode]: http://msdn.microsoft.com/en-us/library/microsoft.reporting.webforms.reportviewer.processingmode.aspx

[ReportViewer Properties]: http://msdn.microsoft.com/en-us/library/microsoft.reporting.webforms.reportviewer_properties.aspx

[ScriptManager]: http://msdn.microsoft.com/en-us/library/system.web.ui.scriptmanager.aspx

[ReportService2005]: http://technet.microsoft.com/en-us/library/reportservice2005.aspx

[ReportService2010]: http://technet.microsoft.com/en-us/library/reportservice2010.aspx

[Guidelines and Limitations for Windows Azure SQL Reporting]: http://msdn.microsoft.com/en-us/library/windowsazure/gg430132#UnsupportedAPIs

[Web Services Description Language Tool (Wsdl.exe)]: http://msdn.microsoft.com/en-us/library/7h3ystb6.aspx

[Using the SOAP API in a Windows Application]: http://technet.microsoft.com/en-us/library/ms155131.aspx

[Using the SOAP API in a Web Application]: http://technet.microsoft.com/en-us/library/ms155376.aspx

[Getting Started Guide for Application Developers (Windows Azure SQL Reporting)]: http://msdn.microsoft.com/en-us/library/windowsazure/gg552871

[Creating a Report Server Project]: http://msdn.microsoft.com/en-us/library/ms167559(v=sql.105).aspx

[Tutorials (SSRS)]: http://msdn.microsoft.com/en-us/library/bb522859(v=sql.105)


[ReportServerProperties]: ../media/ReportProject_PropertiesDialog.png
[LoginDialog]: ../media/ReportProject_LoginDialog.png
[VSNewProject]: ../media/VS_NewProject.png
[NewProjectDialog]: ../media/VS_NewProjectDialog.png
[NewAzureProjectDialog]: ../media/VS_NewAzureProjectDialog.png
[SolutionExplorer]: ../media/SolutionExplorer.png
[Toolbox]: ../media/Toolbox.png
[CmdPrompt]: ../media/VS_CMDPrompt.png
