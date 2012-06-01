# How to Integrate Windows Azure SQL Reporting into Applications #

Windows Azure SQL Reporting offers comprehensive functionality for processing, formatting, and rendering data in a variety of traditional and interactive reporting formats. Applications can take advantage of SQL Reporting functionality in many ways, from accessing an existing report within an application or portal page, to embedding report processing and design capabilities within a stand-alone application.

SQL Reporting is designed to be programmable and extensible. Report definitions use a published, extensible XML-format called Report Definition Language (RDL), and SQL Reporting offers a Simple Object Access Protocol (SOAP) Web service for managing and accessing reports. This topic provides a summary of the many different integration points with Windows Azure SQL Reporting.


This topic provides information about deploying a report server project to Windows Azure SQL Reporting report server, and getting started information for application developers who integrate reports hosted by Windows Azure SQL Reporting in their applications, as well as develop management tools against SQL Azure Reporting report servers.

To get started with Windows Azure SQL Reporting, you must have a Windows Azure subscription. You can use an existing subscription, a new subscription, or the free trial subscription. For more information, see  [http://www.windowsazure.com/en-us/](http://www.windowsazure.com/en-us/).


##Table of Contents##
1.	[Before you begin][]
2.	[How To: Deploy a Report Project][]
3.	[How To: Access SQL Reporting Reports in ReportViewer Controls][]
4.	[How To: Programmatically access Reports using SOAP Management Endpoint][]
5.	[Next Steps][]

<h2 id="Before_you_begin">Before you begin</h2>
This topic assumes that you have some prior experience developing custom applications using SQL Server Reporting Services. For more information, see [Developer's Guide (Reporting Services)][]. The guide also assumes that you have some knowledge on usage of ReportViewer controls. For an overview of ReportViewer controls, see [ReportViewer Controls (Visual Studio)][].


<h2 id="Deploy_ReportServer_Project">How To: Deploy a Report Project</h2>
From Business Intelligence Development Studio(BIDS) of SQL Server, you can deploy all the reports and shared data sources in a Report Server project to a Windows Azure SQL Reporting report server. You can deploy the entire project, or individual reports or data sources. Before you deploy reports or data sources, you need to set the project properties of the Report Server project in Business Intelligence Development Studio.

**To set deployment properties**

1.	Open an already existing report server project. In **Solution Explorer**, right-click the report server project and click **Properties**. (_If the Solution Explorer window is not visible, from the View menu, click Solution Explorer._)

	_For more information about creating a report server project, see [Creating a Report Server Project][]. For other tutorials, see [Tutorials (SSRS)][]._ 

2.	In the Configuration list, select the deployment configuration that you want to use. 

	![ReportServerProperties][]

3.	In **OverwriteDataSources** and **OverwriteDatasets**, select True to overwrite them on the server each time they are deployed or select False to keep the existing versions on the server.
4.	In the **TargetServerVersion** list, verify that the value is set to SQL Server 2008 R2.

5.	In **TargetDataSourceFolder** and **TargetReportFolder**, type the name of folder on the report server in which to deploy the report item. 

	If you leave the value of **TargetDataSourceFolder** blank, the data sources will be published to the location specified in **TargetReportFolder**. If **TargetReportFolder** is blank, reports and data sources are deployed to the root folder of the server.

	Datasets and report parts cannot be managed directly on the SQL Reporting report server and you need not provide values for **TargetDatasets** and **TargetReportPartFolder**.
6.	In the **TargetServerURL** box, type the URL of the target SQL Reporting report server. The syntax of the URL is `https://<ServerName>.reporting.windows.net/ReportServer`.


**To deploy all reports in a project**

In **Solution Explorer**, right-click the report project and click **Deploy**. You will be prompted for credentials for the SQL Reporting login.

![LoginDialog][]

_When you deploy a Report Server project, the shared data sources in the report project are also deployed._ 

**To deploy a single report**

In **Solution Explorer**, right-click the report and click **Deploy**. You can view the status of the publishing process in the Output window.

*When you publish a single report, you must also deploy the shared data sources that the report uses.*

**To deploy a single data source**

In **Solution Explorer**, right-click the data source and click **Deploy**. You can view the status of the publishing process in the Output window.


<h2 id="Access_Reports_In_ReportViewer">How To: Access SQL Reporting Reports in ReportViewer Controls</h2>

Similar to reports deployed to on-premise SQL Server Reporting Services (SSRS) report servers, reports deployed to Windows Azure SQL Reporting report servers can be displayed in ASP.NET applications using the Visual Studio ReportViewer control. 

ReportViewer controls are shipped with Visual Studio 2010, Standard Edition or higher editions. If you are using the Web Developer Express Edition, you must install the [Microsoft Report Viewer 2010 Redistributable Package][] to use the ReportViewer runtime features.

To integrate ReportViewer into your Windows Azure application, you need to pay attention to the following: 

* Include the needed assemblies in the deployment package.
* Configure authentication and authorization appropriately.

For more information, see [How to: Use ReportViewer in a Web Site Hosted in Windows Azure][].

For more information about the use of ReportViewer in a Windows Azure website that uses more than one web role instance, see [Using the ReportViewer ASP.NET Control in Windows Azure][].


**Creating the Windows Azure Project with ReportViewer control**

1.	Use administrator privileges to launch either Microsoft Visual Studio 2010 or Microsoft Visual Web Developer Express 2010. 

	To do this, in **Start** | **All Programs** | **Microsoft Visual Studio 2010**, right-click the **Microsoft Visual Studio 2010** (or Microsoft Visual Web Developer Express 2010) and choose Run as Administrator. If the User Account Control dialog appears, click **Continue**.

	_The Windows Azure compute emulator requires that Visual Studio be launched with administrator privileges. For more information about Windows Azure Compute Emulator and other SDK tools, see [Overview of the Windows Azure SDK Tools][]._

	In Visual Studio, on the **File** menu, click **New**, and then click **Project**. 

	![VSNewProject][]

2. From Installed Templates, under Visual C#, click **Cloud** and then click **Windows Azure Project**. Name the application and click **OK**.

	![NewProjectDialog][]

3.	In the **New Windows Azure Project** dialog, inside the **.NET Framework 4 roles** panel, expand the tab for the language of your choice (Visual C# or Visual Basic), select ASP.NET Web Role from the list of available roles and click the arrow (>) to add an instance of this role to the solution. Before closing the dialog, select the new role in the right panel, click the pencil icon and rename the role. Click **OK** to create the cloud service solution.

	![NewAzureProjectDialog][]

4.	In **Solution Explorer**, review the structure of the created solution. If **Solution Explorer** is not already visible, click **Solution Explorer** on the **View** menu. 

	![SolutionExplorer][]

5.	On the designer mode of Default.aspx, drag the ReportViewer control from the Reporting group of the **Toolbox** to the Web form. To open the **Toolbox**, click **Toolbox** on the **View** menu. You can dock the **Toolbox**, and you can pin it open or set it to Auto Hide. 

	![Toolbox][]

6.	Set the [ProcessingMode][] of the ReportViewer control to **Remote**. ReportViewer configured in **Local** processing mode is not supported in Windows Azure. Set the other properties on the ReportViewer control to determine the visibility and availability of viewing areas. Use the reference documentation to learn about each property. For more information, see [ReportViewer Properties][].

	_To use the **ReportViewer** control in a Web form, you must also add a [ScriptManager][] control to your page. From the **Toolbox** window, in the **AJAX Extensions** group, drag a **ScriptManager** control to the design surface above the **ReportViewer** control._

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
		

<h2 id="Programmatically_Access">How To: Programmatically access Reports using SOAP Management Endpoint</h2>

The SQL Reporting SOAP API provides several Web service endpoints for developing custom reporting solutions.The management functionality is exposed through the [ReportService2005][] and [ReportService2010][] endpoints. For the list of unsupported SOAP APIs in SQL Reporting, see [Guidelines and Limitations for Windows Azure SQL Reporting][].

When accessing the SOAP management endpoint, you use the endpoint’s LogonUser() method to authenticate with the endpoint. You then need to save the authentication cookie returned by the HTTP response and include it in each subsequent operation request. The easiest way to do this is to create a new instance of CookieContainer and assign that to the CookieContainer property of the proxy class before calling LogonUser().

**To generate the proxy class**

1.	In the browser, go to the path for your endpoint. For example: `https://<INSTANCE_NAME>.report.int.mscds.com/ReportServer/reportservice2010.asmx`
2.	If prompted for credentials, type your SQL Reporting username and password and click Sign In. A WSDL file will be displayed in the browser.
3.	Open the Visual Studio Command Prompt and run the wsdl.exe command to generate the proxy class. For example: wsdl /language:CS /n:"ReportServices2010"&lt;WSDL\_FILE\_PATH&gt; 

	You can also specify the file (or directory) to save the generated proxy code by specifying the parameter as `/o[ut]:filename or directoryname`. Else, the proxy file gets created under the default directory from where you are calling the wsdl.exe.

	![CmdPrompt][]

	To open **Visual Studio Command Prompt (2010)** window, Click **Start**, point to **All Programs**, point to **Microsoft Visual Studio 2010**, point to **Visual Studio Tools**, and then right-click **Visual Studio Command Prompt (2010)** and choose Run as Administrator. If the User Account Control dialog appears, click **Continue**.

	For more information and syntax for WSDL.exe tool, see [Web Services Description Language Tool (Wsdl.exe)][].

4.	In Visual Studio, add the generated .cs file to your project.


**To authenticate and authorize with the management endpoint**

The following code shows how to authenticate and authorize with the ReportingServices2010 management endpoint and perform the ReportingService2010.ListChildren() operation. Note that the CookieContainer property is set to a new instance of the CookieContainer class before the LogonUser() method runs. This ensures that the authentication cookie that is returned by the Web response of LogonUser() is saved and used in later Web service calls.
	 
		
		ReportingService2010 rs = new ReportingService2010();
		rs.Url = String.Format("https://{0}:443/ReportServer/ReportService2010.asmx", ConfigurationManager.AppSettings["SERVER_NAME"]);
		rs.CookieContainer = new CookieContainer();
		rs.LogonUser(ConfigurationManager.AppSettings["USERNAME"], ConfigurationManager.AppSettings["PASSWORD"], ConfigurationManager.AppSettings["SERVER_NAME"]);
		CatalogItem[] items = rs.ListChildren("/", true);

Then, in the Web.config or App.config file, specify the application settings in the `<appSettings>` element. The following example shows how the `<appSettings>` element might look like. (Consider specifying the values as per your SQL Reporting report server.)
	 
		
		<appSettings>
		  <add key="SERVER_NAME" value="<INSTANCE_NAME>.report.int.mscds.com" />
		  <add key="USERNAME" value="<USERNAME>"/>
		  <add key="PASSWORD" value="<PASSWORD>"/>
		</appSettings>


<h2 id="NextSteps">Next steps</h2>

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

[Before you begin]: #Before_you_begin
[How To: Deploy a Report Project]: #Deploy_ReportServer_Project
[How To: Access SQL Reporting Reports in ReportViewer Controls]: #Access_Reports_In_ReportViewer
[How To: Programmatically access Reports using SOAP Management Endpoint]: #Programmatically_Access
[Next Steps]: #NextSteps


[ReportServerProperties]: ../media/ReportProject_PropertiesDialog.png
[LoginDialog]: ../media/ReportProject_LoginDialog.png
[VSNewProject]: ../media/VS_NewProject.png
[NewProjectDialog]: ../media/VS_NewProjectDialog.png
[NewAzureProjectDialog]: ../media/VS_NewAzureProjectDialog.png
[SolutionExplorer]: ../media/SolutionExplorer.png
[Toolbox]: ../media/Toolbox.png
[CmdPrompt]: ../media/VS_CMDPrompt.png