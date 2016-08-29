<properties 
   pageTitle="Azure SDK for .NET 2.5.1 Release Notes" 
   description="Azure SDK for .NET 2.5.1 Release Notes" 
   services="app-service" 
   documentationCenter=".net,nodejs,java" 
   authors="Juliako" 
   manager="erikre" 
   editor=""/>

<tags
   ms.service="app-service"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration" 
   ms.date="07/18/2016"
   ms.author="juliako"/>


# Azure SDK for .NET 2.5.1 Release Notes

This document contains the release notes for the Azure SDK for .NET 2.5.1 release. 

##Azure SDK for .NET 2.5.1 release notes

The following are new features and updates in the Azure SDK for .NET 2.5.1.

- New features\scenarios related to **Web Tools Extensions**. 

	- Azure Websites was renamed to Azure App Service. For more information see, [Azure App Service and existing Azure Services](app-service-changes-existing-services.md).
	- Azure API Apps (Preview) support has been added so that customers can publish ASP.NET projects as API Apps, and then use the Add > Azure API App Client gesture in C# projects to generate code based on the structure of the deployed API App. 
	- The Websites node in Server Explorer has been deprecated in lieu of the Azure App Service node, which contains support for Resource Group-based grouping of Azure API Apps, Mobile Apps, and Web Apps.
	- Azure Mobile Apps (Preview) support has been added so that customers can create new Mobile Apps projects, add Mobile Apps controllers, publish the projects, and remotely debug applications.
	- Add > Azure API App Client gesture now supports local Swagger JSON files, so Web API developers can use third-party NuGets like Swashbuckle to generate Swagger or author it manually. This way, client developers can use the code-generation features to consume any Swagger endpoint in C# projects. 
	- Web App and API App publishing dialogs have been enhanced to support the Azure Portal concept of resource grouping, and selection/creation of Azure Resource Groups and App Service Plans are represented in the new Web App and API App provisioning dialog. 
	- Azure API App Server Explorer nodes provide links to the API Apps deep link in the Azure Portal, as well as other features like Log Streaming and Remote Debugging.

	For known issues and current limitations in Azure SDK .NET 2.5.1 [this](app-service-release-notes.md#known_issues_2_5_1) section below.


- New features\scenarios related to **HDInsight Tools** in Visual Studio are enabled in this release. 
	- Local validation of hive scripts. Click the Validate script button in the toolbar to see if there are any errors in your script. 
	- Improved debugging of Hive jobs. You can now debug Hive jobs by accessing Yarn logs in Visual Studio. If your application has performance issues, investigating YARN logs will provide useful information..
	- (Public Preview) Keyword auto-completion and IntelliSense support for Hive. To help you author Hive scripts, HDInsight Tools for Visual Studio added keyword auto-completion and IntelliSense support for Hive.
	- Storm support. You can now use HDInsight Tools for Visual Studio to develop Storm topologies/Spouts/Bolts in C#. You can then submit the developed topology to a Storm cluster and see the topology/bolt/spout status. You can use system logs and customer logs to troubleshoot your Storm topologies/Bolts/Spouts. You can also use existing JAVA assets in Storm on HDInsight.
	
	For more information, see [Get started using HDInsight Hadoop Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).



##<a id="known_issues_2_5_1"></a>Azure SDK for .NET 2.5.1 known issues and limitations

- Azure API Apps is visible as a deployment target for Mobile Apps. Web Apps should be the only destination for Mobile Apps until a subsequent release. 
- Azure API App provisioning can result in success but intermittently fail to update the progress in the Azure App Service Activity window. Workaround is to check status of the new Azure API App in the Azure Portal. 
- File > New Project > API App > F5 experience results in an HTTP error because there is no default/index.html. Workaround is to manually browse to the /api/values URL. 
- Intermittently, Server Explorer icons appear flattened. Restarting VS resolves this issue. 
- If an exception is thrown during Web App or API App provisioning (such as exceeded quota errors or duplicate Azure API App gateway name), the errors show some raw JSON text. 
- Intermittent project-creation issues when Application Insights is checked at project creation time.
- Occasionally, the generated Azure API App Client code is missing namespaces, they need to be manually included (or automatically imported via Visual Studio cues) for code to compile. 
- Mobile App projects should be published to web apps, but you must pick a site you created as a Mobile App in the Azure Portal since Mobile App projects require a database. 
- The start page for Mobile Apps uses the term "mobile service" instead of "mobile apps" 
- Mobile App project creation may take up to a minute to create. 
- During API App provisioning (in some cases) an error comes back from the Azure API reflecting that the permissions could not be set properly, while the API App has been properly provisioned and is ready for use. You can manually set permissions using the Azure Portal.
- Application Insights is not supported on API App templates and Mobile App templates.
- API App projects cannot be used in conjunction with Cloud Service projects.
- API App project templates are only available in C#.
- API App consumption via the "Add Azure API App Client" context menu is only supported in C#.

 
