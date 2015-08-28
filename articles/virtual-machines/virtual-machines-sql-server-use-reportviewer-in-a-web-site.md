<properties 
	pageTitle="Use ReportViewer in a Web Site Hosted in Azure"
	description="This topic describes how to build a Microsoft Azure Web site with the Visual Studio ReportViewer control that displays a report stored on an Microsoft Azure Virtual Machine."
	services="virtual-machines"
	documentationCenter="na"
	authors="rothja"
	manager="jeffreyg"
	editor="monicar" />
<tags 
	ms.service="virtual-machines"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.workload="infrastructure-services"
	ms.date="08/19/2015"
	ms.author="jroth" />

# Use ReportViewer in a Web Site Hosted in Azure

You can build a Microsoft Azure Web site with the Visual Studio ReportViewer control that displays a report stored on an Microsoft Azure Virtual Machine. The ReportViewer control is in a Web application that you build using the ASP.NET Web application template.

>[AZURE.IMPORTANT] The ASP.NET MVC Web Application templates do not support the ReportViewer control.

To incorporate ReportViewer into your Microsoft Azure Web site, you need to complete the following tasks.

- **Add** Assemblies to the Deployment Package

- **Configure** Authentication and Authorization

- **Publish** the ASP.NET Web application to Azure

## Prerequisites

Review the “General recommendation and best practices” section in [SQL Server Business Intelligence in Azure Virtual Machines](virtual-machines-sql-server-business-intelligence.md).

>[AZURE.NOTE] ReportViewer controls are shipped with Visual Studio, Standard Edition or above. If you are using the Web Developer Express Edition, you must install the [MICROSOFT REPORT VIEWER 2012 RUNTIME](https://www.microsoft.com/download/details.aspx?id=35747) to use the ReportViewer runtime features.
>
>ReportViewer configured in local processing mode is not supported in Microsoft Azure.

Review the white paper [Reporting Services report viewer control and Microsoft Azure virtual machine based report servers](http://download.microsoft.com/download/2/2/0/220DE2F1-8AB3-474D-8F8B-C998F7C56B5D/Reporting%20Services%20report%20viewer%20control%20and%20Azure%20VM%20based%20report%20servers.docx).

## Adding Assemblies to the Deployment Package

When you host your ASP.NET application on-premise, the ReportViewer assemblies are usually installed directly in the global assembly cache (GAC) of the IIS server during Visual Studio installation, and can be accessed directly by the application. However, when you host your ASP.NET application in the cloud, Microsoft Azure does not allow anything to be installed into the GAC, so you must make sure the ReportViewer assemblies are available locally for your application. You can do this by adding references to them in your project and configure them to be copied locally.

In remote processing mode, the ReportViewer control uses the following assemblies:

- **Microsoft.ReportViewer.WebForms.dll**: Contains the ReportViewer code, which you need to use ReportViewer in your page. A reference for this assembly is added to your project when you drop a ReportViewer control onto an ASP.NET page in your project.

- **Microsoft.ReportViewer.Common.dll**: Contains classes used by the ReportViewer control at run time. It is not automatically added to your project.

### To add a reference to Microsoft.ReportViewer.Common

- Right-click your project’s **References** node and select **Add Reference**, select the assembly in the .NET tab, and click **OK**.

### To make the assemblies locally accessible by your ASP.NET application

1. In the **References** folder, click the Microsoft.ReportViewer.Common assembly so that its properties appear in the Properties pane.

1. In the Properties pane, set **Copy Local** to True.

1. Repeat steps 1 and 2 for Microsoft.ReportViewer.WebForms.

### To get ReportViewer Language Pack

1. Install the appropriate Microsoft Report Viewer 2012 Runtime redistributable package from [Microsoft Download Center](http://go.microsoft.com/fwlink/?LinkId=317386).

1. Select the language from the dropdown list and the page gets redirected to the corresponding download center page.

1. Click **Download** to start the download of ReportViewerLP.exe.

1. After you download ReportViewerLP.exe, click **Run** to install immediately, or click **Save** to save it to your computer. If you click **Save**, remember the name of the folder where you save the file.

1. Locate the folder where you saved the file. Right-click ReportViewerLP.exe, click **Run as administrator**, and then click **Yes**.

1. After running ReportViewerLP.exe, you will see the c:\windows\assembly has the resource files **Microsoft.ReportViewer.Webforms.Resources** and **Microsoft.ReportViewer.Common.Resources**.

### To configure for localized ReportViewer control

1. Download and install the Microsoft Report Viewer 2012 Runtime redistributable package by following the above specified instructions.

1. Create <language> folder in the project and copy the associated resource assembly files there. The resource assembly files to be copied are: **Microsoft.ReportViewer.Webforms.Resources.dll** and **Microsoft.ReportViewer.Common.Resources.dll**.Select the resource assembly files, and in the Properties pane, set **Copy to Output Directory** to “**Copy always**”.

1. Set the Culture & UICulture for the web project. For more information about how to set the Culture and UI Culture for an ASP.NET Web page, see [How to: Set the Culture and UI Culture for ASP.NET Web Page Globalization](http://go.microsoft.com/fwlink/?LinkId=237461).

## Configuring Authentication and Authorization

The ReportViewer needs to use proper credentials to authenticate with the report server, and the credentials must be authorized by the report server to access the reports you want. For information on authentication, see the white paper [Reporting Services report viewer control and Microsoft Azure virtual machine based report servers](https://msdn.microsoft.com/library/azure/dn753698.aspx).

## Publish the ASP.NET Web application to Azure

For instructions on publishing an ASP.NET Web application to Azure, see [How to: Migrate and Publish a Web Application to Azure from Visual Studio](https://msdn.microsoft.com/library/azure/hh420322.aspx) and [Get started with Web Apps and ASP.NET](../app-service-web/web-sites-dotnet-get-started.md).

>[AZURE.IMPORTANT] If the Add Azure Deployment Project or Add Azure Cloud Service Project command does not appear in the shortcut menu in Solution Explorer, you may need to change the Target framework for the project to .NET Framework 4.
>
>The two commands provide essentially the same functionality. One or the other command will appear in the shortcut menu depending on which version of the Microsoft Azure SDK you have installed.

## Resources

[Microsoft Reports](http://go.microsoft.com/fwlink/?LinkId=205399)

[SQL Server Business Intelligence in Azure Virtual Machines](virtual-machines-sql-server-business-intelligence.md)

[Use PowerShell to Create an Azure VM With a Native Mode Report Server](virtual-machines-sql-server-create-native-mode-report-server-powershell.md)

[Reporting Services report viewer control and Microsoft Azure virtual machine based report servers](http://download.microsoft.com/download/2/2/0/220DE2F1-8AB3-474D-8F8B-C998F7C56B5D/Reporting%20Services%20report%20viewer%20control%20and%20Azure%20VM%20based%20report%20servers.docx)
