<properties linkid="develop-media-services-how-to-guides-set-up-computer" urlDisplayName="Set up computer for Media Services" pageTitle="Set up computer for Media Services - Windows Azure" metaKeywords="" metaDescription="Learn about the prerequisites for Media Services using the Media Services SDK for .NET." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="migree" />

<div chunk="../chunks/article-left-menu.md" />

<h1><a name="setup-dev"> </a><span class="short header">Setting up your computer for Media Services development</span></h1> 

This section contains general prerequisites for Media Services development using the Media Services SDK for .NET. It also shows developers how to create a Visual Studio application for Media Services SDK development. 

###Prerequisites

-   A Media Services account in a new or existing Windows Azure subscription. See the topic [How to Create a Media Services Account](http://www.windowsazure.com/en-us/manage/services/media-services/how-to-create-a-media-services-account/).
-   Operating Systems: Windows 7, Windows 2008 R2, or Windows 8.
-   .NET Framework 4.5 or .NET Framework 4.
-   Visual Studio 2012 or Visual Studio 2010 SP1 (Professional, Premium, Ultimate, or Express). 
-   Use the [windowsazure.mediaservices Nuget](http://nuget.org/packages/windowsazure.mediaservices) package to install Windows Azure SDK for .NET. The following section shows how to use **Nuget** to install the Windows Azure SDK.
  
<h2><a name="setup-account"></a><span class="short header">Setting up a Windows Azure account for Media Services</span></h2>

To set up your Media Services account, use the Windows Azure Management Portal (recommended). See the topic [How to Create a Media Services Account][]. After creating your account in the Management Portal, you are ready to set up your computer for Media Services development. 

###Creating an Application in Visual Studio

This section shows you how to create a project in Visual Studio and set it up for Media Services development.  In this case the project is a C# Windows console application, but the same setup steps shown here apply to other types of projects you can create for Media Services applications (for example, a Windows Forms application or an ASP.NET Web application).

   1. Create a new C# **Console Application** in Visual Studio 2012 or Visual Studio 2010 SP1. Enter the **Name**, **Location**, and **Solution name**, and then click **OK**.
   2. Add a reference to **System.Configuration** assembly. To add a reference to **System.Configuration**, in **Solution Explorer**, right-click the **References** node and select **Add Reference…**. In the **Manage References** dialog, select **System.Configuration** and click **OK**.
   3. Add references to **Windows Azure SDK for .NET.** (Microsoft.WindowsAzure.StorageClient.dll), **Windows Azure Media Services SDK for .NET** (Microsoft.WindowsAzure.MediaServices.Client.dll), and **WCF Data Services 5.0 for OData V3** (Microsoft.Data.OData.dll) libraries using the [windowsazure.mediaservices Nuget](http://nuget.org/packages/windowsazure.mediaservices) package. 

	To add references using Nuget, do the following. In Visual Studio **Main Menu**, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. In the console window type **Install-Package windowsazure.mediaservices** and press **Enter**.
   4. Overwrite the existing using statements at the beginning of the Program.cs file with the following code.

   		using System;
		using System.Linq;
		using System.Configuration;
		using System.IO;
		using System.Text;
		using System.Threading;
		using System.Threading.Tasks;
		using System.Collections.Generic;
		using Microsoft.WindowsAzure;
		using Microsoft.WindowsAzure.MediaServices.Client;

At this point, you are ready to start developing a Media Services application.    
   
<h2><a name="connect"> </a><span class="short header">Connect to Media Services</span></h2> 

Nearly everything you do in Media Services programming requires a reference to the server context object. The server context gives you programmatic access to all Media Services programming objects.

To get a reference to the server context, return a new instance of the context type as in the following code example. Pass your Media Services account name and account key (which you obtained during the account setup process) to the constructor. 

	static CloudMediaContext GetContext()
	{
	    // Gets the service context. 
	    return new CloudMediaContext(_accountName, _accountKey);
	} 

It is often useful to define a module-level variable of type **CloudMediaContext** to hold a reference to the server context returned by a method such as **GetContext**. The rest of the code examples in this topic use a variable called **_context** to refer to the server context. 

<h2>Next Steps</h2>
Now that you have set up your computer and created a Visual Studio solution for programming Media Services, go to the [How to Create an Encrypted Asset and Upload to Storage][] topic.
[How to Create a Media Services Account]: http://go.microsoft.com/fwlink/?linkid=256662
[How to Create an Encrypted Asset and Upload to Storage]:http://go.microsoft.com/fwlink/?LinkID=301733&clcid=0x409
