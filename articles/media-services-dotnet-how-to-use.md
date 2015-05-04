<properties 
	pageTitle="How to Set Up Computer for Media Services Development with .NET" 
	description="Learn about the prerequisites for Media Services using the Media Services SDK for .NET. Also learn how to create a Visual Studio app." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/02/2015" 
	ms.author="juliako"/>

#Media Services development with .NET 

This topic discusses how to start developing Media Services applications using .NET. 

The **Azure Media Services .NET SDK** library enables you to program against Media Services using .NET. To make it even easier to develop with .NET, the **Azure Media Services .NET SDK Extensions** library is provided. This library contains a set of extension methods and helper functions that will simplify your .NET code. Both libraries are available through **NuGet** and **GitHub**.
 

##Prerequisites

-   A Media Services account in a new or existing Azure subscription. See the topic [How to Create a Media Services Account](media-services-create-account.md).
-   Operating Systems: Windows 7, Windows 2008 R2, or Windows 8.
-   .NET Framework 4.5.
-   Visual Studio 2013, Visual Studio 2012, or Visual Studio 2010 SP1 (Professional, Premium, Ultimate, or Express). 
  

##Create and configure a Visual Studio project 

This section shows you how to create a project in Visual Studio and set it up for Media Services development.  In this case the project is a C# Windows console application, but the same setup steps shown here apply to other types of projects you can create for Media Services applications (for example, a Windows Forms application or an ASP.NET Web application).

This section shows how to use **NuGet** to add Media Services .NET SDK and other dependent libraries. 

Alternatively, you can get the latest Media Services .NET SDK bits from GitHub ([github.com/Azure/azure-sdk-for-media-services](https://github.com/Azure/azure-sdk-for-media-services) and [github.com/Azure/azure-sdk-for-media-services-extensions](https://github.com/Azure/azure-sdk-for-media-services-extensions)), build the solution, and add the references to the client project. Note that all the necessary dependencies get downloaded and extracted automatically.   

1. Create a new C# Console Application in Visual Studio 2013, Visual Studio 2012 or Visual Studio 2010 SP1. Enter the **Name**, **Location**, and **Solution name**, and then click OK. 

2. Build the solution.

2. Use **NuGet** to install and add **Azure Media Services .NET SDK Extensions**. Installing this package, also installs **Media Services .NET SDK** and adds all other required dependencies.
	1. Ensure that you have the newest version of NuGet installed. For more information and installation instructions, see [NuGet](http://nuget.codeplex.com/).
	
	2. In Solution Explorer, right-click the name of the project and choose Manage NuGet packages ….
	
		The Manage NuGet Packages dialog box appears.

	3. In the Online gallery, search for Azure MediaServices Extensions, choose Azure Media Services .NET SDK Extensions, and then click the Install button.
 
		The project is modified and references to the Media Services .NET SDK Extensions,  Media Services .NET SDK, and other dependent assemblies are added.

	4. To promote a cleaner development environment, consider enabling NuGet Package Restore. For more information, see [NuGet Package Restore"](http://docs.nuget.org/consume/package-restore).

3. Add a reference to **System.Configuratio**n assembly. This assembly contains the System.Configuration.**ConfigurationManager** class that is used to access configuration files (for example, App.config). 

	To add references using the Manage References dialog, do the following: 

	1. In Solution Explorer, right-click the project name. Then, select Add and References.

		The Manage References dialog appears.

	2. Under .NET framework assemblies, find and select the System.Configuration assembly.
	3. Press OK.


4. Open the App.config file (add the file to your project if it was not added by default) and add an *appSettings* section to the file. Set the values for your Azure Media Services account name and account key, as shown in the following example. 
	
	To obtain the **account name** and **account key** information, open the **Azure Management Portal**, select your media services account and click the **MANAGE KEYS** button.


	<pre><code>
	&lt;configuration&gt;
        &lt;appSettings&gt;
    	&lt;add key="MediaServicesAccountName" value="Media-Services-Account-Name" /&gt;
        	&lt;add key="MediaServicesAccountKey" value="Media-Services-Account-Key" /&gt;
  	    &lt;/appSettings&gt;
	&lt;/configuration&gt;
	</code></pre>


5. Overwrite the existing using statements at the beginning of the Program.cs file with the following code.

		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Text;
		using System.Threading.Tasks;
		using System.Configuration;
		using System.Threading;
		using System.IO;
		using Microsoft.WindowsAzure.MediaServices.Client;

At this point, you are ready to start developing a Media Services application.    
