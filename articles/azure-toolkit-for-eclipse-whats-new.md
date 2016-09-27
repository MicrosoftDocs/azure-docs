<properties
	pageTitle="What's New in the Azure Toolkit for Eclipse"
	description="Learn about the latest features in the Azure Toolkit for Eclipse."
	services=""
	documentationCenter="java"
	authors="rmcmurray"
	manager="wpickett"
	editor=""/>

<tags
	ms.service="multiple"
	ms.workload="na"
	ms.tgt_pltfrm="multiple"
	ms.devlang="Java"
	ms.topic="article"
	ms.date="07/07/2016" 
	ms.author="robmcm;asirveda"/>

<!-- Legacy MSDN URL = https://msdn.microsoft.com/library/azure/hh694270.aspx -->

# What's New in the Azure Toolkit for Eclipse

## Azure Toolkit for Eclipse Releases

This article contains information on the various releases and latest updates to the Azure Toolkit for Eclipse.

> [AZURE.NOTE] There is also an Azure Toolkit for the IntelliJ IDE. For more information, see [Azure Toolkit for IntelliJ].

### June 29, 2016

The Azure Toolkit for Eclipse - June 2016 release includes the following enhancements:

* **Java 8 Requirement**. The Azure Toolkit for Eclipse now requires Java 8, although this requirement is only for the toolkit - your applications can continue to use all versions of Java that are supported by Azure.
* **Support for the latest Java JDKs**. The latest versions of the Java JDKs are now supported by the Azure Toolkit for Eclipse.
* **Support for Azure SDK v2.9.1**. The latest version of the Azure SDK is now the minimum pre-requisite for the Azure Toolkit for Eclipse.
* **Integrated Samples**. The Azure Toolkit for Eclipse now features several sample applications to help developers get started.
* **HDInsight Tool Integration**. Azure's HDInsight Tools are now bundled with the Azure Toolkit for Eclipse. For more information, see [HDInsight Tools Plugin for Eclipse].
* **Remote Debugging of Java Web Apps**. The Azure Toolkit for Eclipse now supports remote debugging of Java web apps on Azure App Service.
* **Support for the Eclipse Luna release.** The new minimum required Eclipse IDE version is Luna.

### April 12, 2016

The Azure Toolkit for Eclipse - April 2016 release includes the following enhancements:

* **Support for Azure SDK v2.9.0**. The latest version of the Azure SDK is now the minimum pre-requisite for the Azure Toolkit for Eclipse.
* **Miscellaneous usability, responsiveness and performance improvements related to Azure Web App support**. A number of performance optimizations in how the Toolkit communicates with Azure result in a more responsive UI.
* **Ability to delete an existing Web Application container in Azure from within Eclipse**. The Azure Toolkit for Eclipse now allows you to delete an existing Azure Web container without leaving Eclipse.

### March 7, 2016

The Azure Toolkit for Eclipse - March 2016 release includes the following enhancements:

* **Support for quick deployment of lightweight Java applications**. The Azure Toolkit for Eclipse now supports the rapid deployment of lightweight Java applications into Azure Web App Containers, so deploying Java applications now takes seconds instead of minutes.
* **Support for Web App management using the Azure Explorer view**. The Azure Explorer view in the toolkit now supports for listing, starting and stopping Azure Web Apps.
* **Updated Tomcat, Jetty, and Zulu OpenJDK distributions**. The Azure Toolkit for Eclipse provides support for updated versions of Tomcat, Jetty and Zulu OpenJDK for Java deployments into Azure cloud services.

### January 4, 2016

The Azure Toolkit for Eclipse - January 2016 release includes the following enhancements:

* **Support for the Zulu OpenJDK updates**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Updated Tomcat and Jetty distributions**. The Jetty and Tomcat distributions which are available on Microsoft Azure for use with the Azure Toolkit for Eclipse have been updated.
* **Feature Parity between Eclipse and IntelliJ Toolkits for Azure**. The Azure Toolkit for Eclipse and the [Azure Toolkit for IntelliJ] now support the same set of features.

### September 1, 2015

The Azure Toolkit for Eclipse - September 2015 release includes the following enhancements:

* **Support for the Zulu OpenJDK updates**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Updated Tomcat and Jetty distributions**. The Jetty and Tomcat distributions which are available on Microsoft Azure for use with the Azure Toolkit for Eclipse have been updated. (These distributions allows developers to create quick development and test projects with the Azure Toolkit for Eclipse.
* **Support for automatically updated Tomcat and Jetty references**. In addition to the specific versions of Tomcat and Jetty which are available on Azure, developers can now reference a distribution referred to as the "Latest (auto-updated)", which will automatically update to the latest distribution of each major version of Jetty or Tomcat the next time your role instances are recycled. (Recycling occurs automatically, but developers can manually trigger a recycle through the Azure portal.) This new feature means that developers do not have to redeploy their application to be able to have their server software updated. (
*  This functionality is currently intended only for development and test purposes or non-mission-critical applications, and is not recommended for production.)
* **Azure Explorer view for blobs, queues and tables in Azure storage**. This allows developers to perform a set of common tasks with their storage artifacts directly from the Eclipse IDE. For example: deleting, uploading or downloading blobs.

### August 1, 2015

The Azure Toolkit for Eclipse - August 2015 release includes the following enhancements:

* **Application Insights Instrumentation Key Management**. This update allows you to acquire, create and manage your Application Insights instrumentation keys directly from the Eclipse IDE.
* **Microsoft JDBC Driver 4.1 for SQL Server**. This update includes support for the latest JDBC driver for Microsoft SQL Server.
* **Version 2.7 of the Azure SDK**. This most recent update to the Azure SDK is the new pre-requisite for the Toolkit when installed on Windows. (Note this is not needed on non-Windows operating systems.)
* **Support for the Zulu OpenJDK v7 update**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].

### May 1, 2015

The Azure Toolkit for Eclipse - May 2015 release includes the following enhancements:

* **Improved Server Selection UI**. This release simplifies the use of the toolkit on non-Windows operating systems.
* **Support for Maven Projects**. This release supports Maven Projects as applications, which the toolkit can deploy to Azure and configure Application Insights.
* **Version 2.6 of the Azure SDK**. This most recent update to the Azure SDK is the new pre-requisite for the Toolkit when installed on Windows. (Note this is not needed on non-Windows operating systems.)
* **Deployment Upgrade Instead of Republish**. If you are republishing a deployment project when the previous version is already live, the toolkit now uses Azure's deployment upgrade functionality instead of shutting down the previous deployment and republishing from scratch as it did in the past. This enables your cloud service to run without interruption whenever possible, helping achieve high availability even during an update, and speeds up the re-publishing process.
* **Support for the latest Zulu OpenJDK v8 - update 40**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].

### March 9, 2015

The Azure Toolkit for Eclipse - March 2015 release includes the following enhancements:

* **Support for Mac, Ubuntu and additional Linux flavors**. This release of the Azure Toolkit for Eclipse adds support for Mac OS and several Unix platforms, so developers can install the toolkit to create, configure and publish Java projects to Azure Cloud Services (PaaS) from Eclipse running on operating systems other than Windows.

>[AZURE.NOTE] This capability is in preview, and it is not recommended for use in production environments. There is no customer support Service Level Agreement (SLA), but all feedback is appreciated and encouraged.

* **New Application Insights plugin**. Developers are now able to configure automatic server telemetry using Application Insights on Azure.
* **Ant-based command line deployment automation**. This feature enables developers to automate the publishing for newer versions of their deployments using Ant outside of Eclipse. A pre-generated script is automatically configured for a project after the first time it is deployed from Eclipse, and subsequent deployments can use the script to fully automate deployments via the command line only.
* **Tomcat and Jetty availability on Azure for simpler, faster deployment**. Developers can now reference various Tomcat and Jetty versions that are available on Azure directly instead of having to upload a Java server to their accounts (or via the Toolkit), so there is no need to upload a Java server for quick, getting-started scenarios.
* **Shortcut method for publishing Java web apps to Azure cloud services**. To reduce the learning curve for simple development and test scenarios, developers can now publish Java applications more directly to Azure. Instead of having to go through the process of creating and configuring an Azure deployment project, applications will be deployed with a default instance of Tomcat v8 and Zulu JVM (OpenJDK).

### January 30, 2015

The Azure Toolkit for Eclipse - January 2015 release includes the following enhancements:

* **Support for IBM® WebSphere® Application Server Liberty Core**. This release adds the IBM WebSphere Application Server Liberty Core to the list of supported application servers from which the toolkit is able to deploy to Azure. This latest addition expands the current list of application servers that are supported &quot;out-of-the-box&quot; by the Toolkit, which already included various versions of Tomcat, Jetty, JBoss and GlassFish.
* **Inclusion of Application Insights SDK**. This newly-released client API library (v0.9.0) is now part of the Package for Azure Libraries for Java.
* **Updated Package for Azure Libraries for Java**. This update includes Azure Libraries for Java v0.7.0 and Storage Client API v2.0.0, as well as the newly-released Application Insights SDK v0.9.0.

### November 12, 2014

The Azure Toolkit for Eclipse - November 2014 release includes the following enhancements:

* **Support for Azure SDK 2.5**. This most recent update to the Azure SDK is the new pre-requisite for the Toolkit.
* **Support for updated version of the Zulu OpenJDK v1.8, v1.7 and v1.6 packages**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Support for the new Standard D sizes for cloud services**, which offer increased performance and additional memory resources. For more information, see [Virtual Machine and Cloud Service Sizes for Azure].

### October 17, 2014

The Azure Toolkit for Eclipse - October 2014 release includes the following enhancements:

* **Performance improvements in the Publish to Cloud scenarios**. Loading of subscription information is much faster when users have multiple subscriptions and storage accounts.
* **Support for updated version of the Zulu OpenJDK v1.8 package**. For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Support for deprecating older versions of 3rd party JDKs**. Deprecated JDK packages will no longer show up in the dropdown menu for new deployment projects. Existing projects referencing deprecated JDK packages will continue being able to do so for the time being, but it is recommended to upgrade such projects to rely on the latest.
* **Updated version of the Package for Azure Libraries for Java client API library**. For more information, see the [Microsoft Azure Client API].
* **Bug Fixes.** This release contains a number of miscellaneous bug fixes which were based on user reports and testing.

### August 5, 2014

The Azure Toolkit for Eclipse - August 2014 release includes the following enhancements

* **Support for Azure SDK 2.4.** Older versions of the Eclipse Toolkit will not work with this newly released SDK.
* **Updated versions of the Zulu OpenJDK v1.6, 1.7 and v1.8 packages.** For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Updated version of the Package for Azure Libraries for Java client API library.** For more information, see the [Microsoft Azure Client API].
* **Support for Latest Publish Settings File Format.** Support was added for version 2.0 of the Publish Settings file format.
* **Architectural changes behind the Publish to Cloud feature.** The Toolkit is now using the newly released Microsoft Azure Client API for Java for its publish-to-cloud support.
* **Bug Fixes.** This release contains a number of user-requested bug fixes.

### June 12, 2014

The Azure Toolkit for Eclipse - June 2014 release is a minor servicing update which provides the following enhancements:

* **Support for the Zulu OpenJDK package v1.8.** For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Updated versions of the Zulu OpenJDK v1.6 and 1.7 packages.** For more information, see the [Azul Systems web page for the Zulu OpenJDK].
* **Updated version of the Package for Azure Libraries for Java client API library.** For more information, see the [Microsoft Azure Client API].
* **Bug Fixes.** This release contains a number of user-requested bug fixes.

### April 4, 2014

The Azure Plugin for Eclipse - April 2014 release has released. This is an update accompanying the release of the Azure SDK 2.3, which is a pre-requisite and will be downloaded automatically when you install the plugin. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the February 2014 Preview:

* **Support for the Azure SDK 2.3 release.** The Azure Plugin for Eclipse - April 2014 release requires Azure SDK 2.3. When using the new plugin, if you do not already have Azure SDK 2.3, you will be prompted to allow its installation. Do not use Azure SDK 2.3 with earlier versions of the plugin.
* **Upgrading of applications without complete package deployment.** When deploying Java applications that are part of your project, the plugin now automatically uploads them into your selected storage account so that you can update it and recycle the role instances to deploy the latest application bits without having to rebuild and redeploy the entire package.
* **Tomcat 8 now is a recognized application server.** If you select a Tomcat 8 installation directory on your machine in the **Server** tab of the **Azure Deployment Project** dialog, the plugin will now automatically detect it and be able to deploy Tomcat 8 in an automated fashion, similar to the older versions of Tomcat already in the list.
* **Azul Zulu OpenJDK package updates: v1.7 update 51 and v1.6 update 47.** Effective with this release, Azul System's Zulu Open JDK v7 package update 51 is available. Also, Zulu Open JDK v6 packages start being available, beginning with update 47. These updates are in addition to the previously available Zulu Open JDK v7 package update 45, update 40 and update 25.
* **Support for A8 and A9 Microsoft Azure Virtual Machine size.** You can now deploy a cloud service to the high memory A8 and A9 Virtual Machine sizes. For more information about these VM sizes, see [Virtual Machine and Cloud Service Sizes for Azure].
* **Automatic redirection from HTTP to HTTPS for SSL-enabled roles.** When your cloud service contains only HTTPS role(s), if the user request specifies HTTP, it will automatically redirect to HTTPS. There is no need to create a separate role to handle the HTTP requests.
* **Express Emulator used for local emulation.** The Azure Express Emulator is now used as the emulator when debugging your applications locally.
* **Azure has been rebranded as Microsoft Azure.** UI screens now reflect that Azure has been rebranded and no longer called Azure.

### February 6, 2014

The Azure Plugin for Eclipse - February 2014 Preview has released. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the October 2013 Preview:

* **Support for SSL offloading.** Secure Sockets Layer (SSL) offloading has been added as a feature, allowing you to easily enable Hypertext Transfer Protocol Secure (HTTPS) support in your Java deployment on Azure, without requiring you to configure SSL in your Java application server. This is particularly relevant in Session Affinity and/or authenticated communication scenarios. For example, when using the Access Control Service (ACS) Filter, which is already supported by the toolkit. For more information, see [SSL Offloading] and [How to Use SSL Offloading].
* **GlassFish 4 now is a recognized application server.** If you select a GlassFish 4 installation directory on your machine in the **Server** tab of the **Azure Deployment Project** dialog, the plugin will now automatically detect it and be able to deploy GlassFish OSE 4 in an automated fashion, similar to the GlassFish OSE 3 version already in the list.
* **Azul Zulu OpenJDK package update 45.** Effective with this release, Azul System's Zulu (Open JDK v7 package) update 45 is now available; this is in addition to the previously available update 40 and update 25.
* **Support for 'auto' for private endpoint ports.** You can set a private port to automatic for input endpoints and internal endpoints to let Azure assign a port to that endpoint automatically. Previously you could only assign a specific port number.
* **Support for customizing the certificate name (CN) in the self-signed certificate creation UI.** Previously, the same hard-coded name was used for all new certificates; now you can specify your own certificate name to help distinguish among multiple certificates in the Azure portal used for different purposes.
* **Azure toolbar:** The Azure toolbar has an updated with the following changes: 
    * ![][ic710876] This icon was added for the **New Azure Deployment Project**.
    * ![][ic710877] This icon was added as a shortcut to the self-signed certificate creation dialog.
* **Support for A5 Azure Virtual Machine size.** You can now deploy a cloud service to the high memory A5 Virtual Machine size. For more information about this VM size, see [Virtual Machine and Cloud Service Sizes for Azure].
* **Support for Microsoft Windows Server 2012 R2.** You can now select Windows Server 2012 R2 as the cloud operating system.

### October 22, 2013

The Azure Plugin for Eclipse - October 2013 Preview has released. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the September 2013 Preview:

* **Support for the Azure SDK 2.2 release.** The Azure Plugin for Eclipse - October 2013 Preview supports Azure SDK 2.2. The plugin will still work with Azure SDK 2.1, and will automatically install Azure SDK 2.2 if you do not already have at least Azure SDK 2.1 installed.
* **Azul Zulu OpenJDK package update 40.** As announced for the September 2013 Preview, the plugin now enables using a third party-provided JDK directly on Azure, without requiring you to upload your own JDK. In the October 2013 release, Azul System's Zulu (Open JDK v7 package) update 40 is now available; this is in addition to the originally published update 25.
* **Cloud deployment link in the Activity Log.** Within the Azure Activity Log, when your deployment has a status of **Published**, you can click **Published** since it is now a link to your deployment; your deployment will then be opened in your browser. (The status of **Published** was previously labeled **Running**.)
* **Target OS selection available at publish time.** The **Publish to Azure** dialog contains a new field, **Target OS**, which provides a more discoverable way for you to set your target operating system.
* **Auto-overwrite previous deployment.** The **Publish to Azure** dialog contains a new checkbox, **Overwrite previous deployment**. If this option is checked, when your new deployment is published it will automatically overwrite the previous deployment; you would not experience &quot;409 conflict&quot; issues when publishing to the same location without first unpublishing the previous deployment.
* **Jetty 9 now is a recognized application server.** If you select a Jetty 9 installation directory on your machine in the **Server** tab of the **Azure Deployment Project** dialog, the plugin will now automatically detect it and be able to deploy Jetty 9 in an automated fashion, similar to the older versions of Jetty already in the list.
* **Add a role from the Project context menu.** The **Azure** project context menu now contains a new menu item, **Add Role**, which provides a quicker and more discoverable way for you to add a new role to your Azure project.
* **An update to the Package for the Azure Libraries for Java library.** This is based on version 0.4.6 of the [Microsoft Azure Client API].

### September 25, 2013

The Azure Plugin for Eclipse - September 2013 Preview has released. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the August 2013 Preview:

* **Ability to deploy the Azul Zulu OpenJDK package available on Azure.** A new option has been added when specifying the JDK to use with your Azure deployment. Using this option, you can deploy a third party JDK package directly on the Azure cloud, without having to upload your own. Azul Systems is providing the first such package called Zulu, based on the OpenJDK, which can now be deployed using this option.
* **An update to the Package for the Azure Libraries for Java library.** This is based on version 0.4.5 of the [Microsoft Azure Client API].

### August 1, 2013

The Azure Plugin for Eclipse - August 2013 Preview has released. This is an update accompanying the release of the Azure SDK 2.1, which is a pre-requisite and will be downloaded automatically when you install the plugin. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the July 2013 Preview:

* **Removal of options to include the local JDK and local application server as part of the deployment package.** Downloading the JDK and application server from cloud storage during the deployment is preferable to embedding these components in the package, since downloading the items results in smaller deployment package size, faster deployment times, and easier maintenance. As a result, the options to include the JDK and application server in the deployment package have been removed. Existing projects that were configured to include the local JDK and local application server as part of the deployment package will automatically be converted to auto-upload the JDK and application server to cloud storage.
* **Support for the Azure SDK 2.1 release.** The Azure Plugin for Eclipse - August 2013 Preview requires Azure SDK 2.1. Do not use the August 2013 preview with earlier versions of the Azure SDK, and do not use Azure SDK 2.1 with earlier versions of the Azure Plugin for Eclipse.
* **Support for the Eclipse Kepler release.** Related to this, the new minimum required Eclipse IDE version is Indigo. The Azure Plugin for Eclipse is no longer officially tested on Helios.

### July 3, 2013

The Azure Plugin for Eclipse - July 2013 Preview has released. This update includes new features, bug fixes, and some feedback-driven usability enhancements since the May 2013 Preview:

* **Ability to create a new storage account.** A **New** button has been added to the **Add Storage Account** dialog. This allows you to create a storage account within the Eclipse plugin, without requiring you to log in to the Azure Management Portal. (You must already have an Azure subscription to use this feature.) For more information about creating a new storage account, see [To create a new storage account].
* **New &quot;(auto)&quot; option for storage account used for automatic deployment of JDK and server, and for caching.** When using the **Automatically upload** option for the JDK and application server, you can now specify **(auto)** for the URL and storage account to use when uploading the JDK and application server, or when using Azure Caching. Then, these features will automatically use the same storage account as the one that you select in the **Publish to Azure** dialog. The [Creating a Hello World Application for Azure in Eclipse] tutorial has been updated to use the new **(auto)** option.
* **Ability to set your Azure service endpoints.** Specify the service endpoints that determine whether your application is deployed to and managed by the global Azure platform, Azure operated by 21Vianet in China, or a private Azure platform. For more information, see [Azure Service Endpoints].
* **Large deployments can specify a local storage resource.** In the event that your deployment is too large to be contained in the default approot folder, you can now specify a local storage resource as the deployment destination for your JDK and application server. For more information, see [Deploying Large Deployments].
* **Support for A6 and A7 Azure Virtual Machine sizes.** You can now deploy a cloud service to the high memory A6 and A7 Virtual Machine sizes. For more information about these sizes, see [Virtual Machine and Cloud Service Sizes for Azure].
* **An update to the Package for the Azure Libraries for Java library.** This is based on version 0.4.4 of the [Microsoft Azure Client API].

### May 1, 2013

The Azure Plugin for Eclipse - May 2013 Preview has released. This is a major update accompanying the release of the Azure SDK 2.0, which is a pre-requisite and will be downloaded automatically when you install the plugin. This release includes new features, bug fixes, and some feedback-driven usability enhancements since the February 2013 Preview:

* **Automatic upload of the JDK and application server to, and deployment from, Azure storage.** A new option which automatically uploads the selected JDK and application server, when needed, to a specified Azure storage account and deploys these components from there, instead of embedding in the deployment package or having the user upload then manually. This commonly requested feature can greatly enhance the ease of deploying the JDK and server components, especially for novice users. For a walk-through that uses these options, see [Creating a Hello World Application for Azure in Eclipse].
* **Centralized storage account tracking and ability to reference storage accounts more easily (via a dropdown control).** This applies to multiple features that rely on storage, such as JDK and server component deployment, and caching. For more information, see [Azure Storage Account List].
* **Simplified Remote Access setup in the Publish to Cloud wizard.** All you need to do is type in a user name and password to enable remote access, or leave it blank to keep remote access disabled.
* **An update to the Package for the Azure Libraries for Java library.** This is based on version 0.4.2 of the [Microsoft Azure Client API].
* **Support for sticky sessions on Windows Server 2012.** Previously, sticky sessions worked only on Windows Server 2008 R2, now both cloud operating system targets support session affinity.
* **Package upload performance improvements.** Even when the JDK and application server are embedded in the deployment package, the upload portion of the deployment process can be approximately twice as fast as compared to previous versions.

### February 8, 2013

The Azure Plugin for Eclipse - February 2013 Preview has released. This is a minor update which includes bug fixes, feedback-driven usability enhancements and some new features since the November 2012 Preview:

* Support for deploying JDKs, application servers, and arbitrary other components from public or private Azure blob storage downloads instead of including them in the deployment package when deploying to the cloud.
* Ability to change the order in which user-defined components of a role are processed, through the addition of **Move Up** and **Move Down** buttons in the **Components** section of the **Azure Role Properties**.
* An update to the **Package for the Azure Libraries for Java** library, based on version 0.4.0 of the [Microsoft Azure Client API].

### November 5, 2012

The Azure Plugin for Eclipse - November 2012 Preview has released. This is a major update which includes a number of new features, as well as additional bug fixes and feedback-driven usability enhancements since the September 2012 Preview:

* Support for Microsoft Windows Server 2012 as the cloud operating system.
* Support for Azure co-located caching support for memcached clients.
* Inclusion of the Apache Qpid JMS client libraries for taking advantage of Azure AMQP-based messaging.
* An improved **New Project** wizard, with a new page at the end that provides users with the ability to quickly enable several common key features in their project: sticky sessions, caching and remote debugging.
* Automatic reduction of role instances to 1 when running in the compute emulator, to avoid port binding conflicts between server instances.

### September 28, 2012

The Azure Plugin for Eclipse - September 2012 Preview has released. This service update includes a number of additional bug fixes since the August 2012 Preview, as well as some feedback-driven usability enhancements in existing features:

* Support for Microsoft Windows 8 and Microsoft Windows Server 2012 as the development operating system, resolving issues that previously prevented the plugin from working properly on those operating systems.
* Improved support for specifying endpoint port ranges.
* Bug fixes related to file paths containing spaces.
* Role context menu improvements for faster access to role-specific configuration settings.
* Minor refinements in the **Publish to cloud** wizard and a number of additional bug fixes.

### August 28, 2012

The Azure Plugin for Eclipse - August 2012 Preview has released. This service update includes additional bug fixes since the July 2012 Preview, as well as several feedback-driven usability enhancements for existing features:

* Within the Azure Access Control Services Filter dialog:
    * **Option to embed the signing certificate** in your application's WAR file, to simplify cloud deployment.
    * **Option to create a self-signed certificate** within the ACS filter UI. For additional information about the Azure Access Control Services Filter, see [How to Authenticate Web Users with Azure Access Control Service Using Eclipse].
* Within the Azure Deployment Project wizard (also applies to the role's Server Configuration property page):
    * **Automatic discovery of the JDK location** on your computer (which you can override if desired).
    * **Automatic detection of the server type** when you select the application server installation directory.

### July 15, 2012

The Azure Plugin for Eclipse - July 2012 Preview, which addresses a number of the highest priority bugs found and/or reported by users after the June 2012 release, has released. This is a service update only, no new features are contained.

### June 7, 2012

Azure Plugin for Eclipse - June 2012 CTP has released. New features include:

* **New Azure Deployment Project wizard:** Enables you to select your JDK, Java application server, and Java applications directly in the improved wizard UI. Included in the list of out-of-the-box server configurations to choose from are Tomcat 6, Tomcat 7, GlassFish OSE 3, Jetty 7, Jetty 8, JBoss 6, and JBoss 7 (stand-alone). Additionally, you can customize the list of server configurations. This UI improvement is an alternative to dragging and dropping compressed files and copying over startup scripts, which was previously the main approach. That method still works fine, but will likely be used only for more advanced scenarios.
* **Server Configuration role property page:** Enables you to easily switch the JDKs, Java application servers and applications associated with your deployment after you have created the project. For more information, see [Server configuration properties].
* **&quot;Publish to cloud&quot; wizard:** Provides an easy way to deploy your project to Azure directly from Eclipse, automating the previously manual heavy-lifting of fetching credentials, signing in to the Azure Management Portal, uploading a package, etc. For an example of how to directly deploy your project to Azure, see [Creating a Hello World Application for Azure in Eclipse].
* **Azure toolbar:** An Azure toolbar is now available in Eclipse which contains buttons that invoke the following features:
    * ![][ic710879] **Run in Azure Emulator**: Runs your project in the emulator.
    * ![][ic710880] **Reset Azure Emulator**: Resets the emulator.
    * ![][ic710881] **Build Cloud Package for Azure**: Compiles your package for deployment.
    * ![][ic710876] **New Azure Deployment Project**: Creates a new Azure deployment project.
    * ![][ic710882] **Publish to Azure Cloud**: Publishes your project to Azure.
    * ![][ic710883] **Unpublish**: Deletes your deployment.
    * Many of these Azure toolbar buttons are used in [Creating a Hello World Application for Azure in Eclipse].
* **Azure Libraries for Java:** Now available as part of the single Package for Azure Libraries for Java library in Eclipse, accompanying the plugin installation and containing all of the necessary dependencies as well. Just add one reference to the library in your Java project and you don't need to download anything separately. For more information, see [Installing the Azure Toolkit for Eclipse].
* **Microsoft JDBC Driver 4.0 for SQL Server available during plugin installation:** During installation of the new plugin, the newest version of the Microsoft JDBC Driver for SQL Server can be installed.
* **Azure Access Control Service Filter available during plugin installation:** This new component, included as an Eclipse library in the toolkit, enables your Java web application to seamlessly take advantage of Azure Access Control Service (ACS) authentication using various identity providers, such as Google, Live.com, and Yahoo!. You won't need to write authentication logic yourself, just configure a few options and let the filter do the heavy lifting of enabling users to sign in using ACS. You can just focus on writing the code that gives users access to resources based on their identity, as returned to your application by the filter inside the Request object. For a tutorial on using the ACS filter, see [How to Authenticate Web Users with Azure Access Control Service Using Eclipse].
* **Automatic detection of the Azure SDK 1.7 prerequisite:** When you create a new Azure Deployment Project, Azure SDK 1.7 will be automatically downloaded if it is not already installed.
* **Instance endpoints:** Allows direct port endpoint access for communication with load balanced role instances. Instance endpoints can be added through the endpoints UI, available through the [Endpoints properties] page. This helps enable remote debugging and JMX diagnostics for specific compute instances running in the cloud in scenarios with multi -instance deployments. 
* **Components UI:** Makes it easier for advanced users to set up project dependencies between individual Azure roles in the project and other external resources such as Java application projects; also makes it easy to describe their deployment logic. For more information, see [Components properties].
* **Automatic upgrade of previous versions of projects:** When you open a workspace that has Azure project created with a previous version of the plugin, the old projects will be shown in Eclipse as closed, because previous versions of projects are not compatible with the new release. If you attempt to open one of these old projects, an upgrade wizard will start. If you agree to the upgrade, a new project, with **_Upgraded** appended to the name, will be created and automatically updated to work with the new release. You can rename the new project as needed. As part of the upgrade, your original project will not be modified (and will remain closed).

### December 10, 2011

Azure Plugin for Eclipse - December 2011 CTP has released. New features include:

* **Session affinity (&quot;sticky sessions&quot;) support:** Helping enable stateful, clustered Java applications with just a single checkbox. For more information, see [Session Affinity].
* **Pre-made startup script samples:** For the most popular Java servers (Tomcat, Jetty, JBoss, GlassFish), that you can just copy/paste from your project's samples directory into your startup script.
* **Emulator startup output in real time:** You can now watch the execution of all the steps from your startup script in a dedicated console window, showing you the progress and failures in your script as it is executed by Azure.
* **Automatic, light-weight java.exe monitoring:** That will force a role recycle when java.exe stops running, using a lightweight, pre-made script automatically included in your deployment.
* **Remote Java app debugging configuration UI:** Allows you to easily enable Eclipse's remote debugger to access your Java app running in the Emulator or the Azure cloud, so you can step through and debug your Java code in real time. For more information, see [Debugging Azure Applications in Eclipse].
* **Local storage resource configuration UI:** So you no longer have to configure local resources by manipulating the XML directly. This feature also enables you to access to the effective file path of your local resource after it's deployed via an environment variable you can reference directly from your startup script. For more information, see [Local storage properties].
* **Environment variable configuration UI:** So you no longer have to set environment variables via manual editing of the configuration XML. For more information, see [Environment variables properties].
* **JDBC driver for SQL Azure:** Gets installed via the plugin as a seamlessly integrated Eclipse library, enabling easier programming against SQL Azure. 
* **Quick context-menu access to role configuration UI**: Just right-click on the role folder, and click **Properties**.
* **Custom Azure project and role folder icons:** For better visibility and easier navigation within your workspace and project.

## See Also ##

For more information about the Azure Toolkits for Java IDEs, see the following links:

- [Azure Toolkit for Eclipse]
  - [Installing the Azure Toolkit for Eclipse]
  - [Create a Hello World Web App for Azure in Eclipse]
  - *What's New in the Azure Toolkit for Eclipse (This Article)*
- [Azure Toolkit for IntelliJ]
  - [Installing the Azure Toolkit for IntelliJ]
  - [Create a Hello World Web App for Azure in IntelliJ]
  - [What's New in the Azure Toolkit for IntelliJ]

For more information about using Azure with Java, see the [Azure Java Developer Center].

<!-- URL List -->

[Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web/app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web/app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-installation.md
[What's New in the Azure Toolkit for Eclipse]: ./azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ./azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: http://go.microsoft.com/fwlink/?LinkID=699547

[Azul Systems web page for the Zulu OpenJDK]: http://go.microsoft.com/fwlink/?LinkId=402457
[Azure Service Endpoints]: http://go.microsoft.com/fwlink/?LinkID=699526
[Azure Storage Account List]: http://go.microsoft.com/fwlink/?LinkID=699528
[Components properties]: http://go.microsoft.com/fwlink/?LinkID=699525#components_properties
[Creating a Hello World Application for Azure in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699533
[Debugging Azure Applications in Eclipse]: http://go.microsoft.com/fwlink/?LinkID=699535
[Deploying Large Deployments]: http://go.microsoft.com/fwlink/?LinkID=699536
[Endpoints properties]: http://go.microsoft.com/fwlink/?LinkID=699525#endpoints_properties
[Environment variables properties]: http://go.microsoft.com/fwlink/?LinkID=699525#environment_variables_properties
[HDInsight Tools Plugin for Eclipse]: ./hdinsight/hdinsight-apache-spark-eclipse-tool-plugin.md
[How to Authenticate Web Users with Azure Access Control Service Using Eclipse]: http://go.microsoft.com/fwlink/?LinkID=264703
[How to Use SSL Offloading]: http://go.microsoft.com/fwlink/?LinkID=699545
[Installing the Azure Toolkit for Eclipse]: http://go.microsoft.com/fwlink/?LinkId=699546
[Local storage properties]: http://go.microsoft.com/fwlink/?LinkID=699525#local_storage_properties
[Microsoft Azure Client API]: http://go.microsoft.com/fwlink/?LinkId=280397
[Server configuration properties]: http://go.microsoft.com/fwlink/?LinkID=699525#server_configuration_properties
[Session Affinity]: http://go.microsoft.com/fwlink/?LinkID=699548
[SSL Offloading]: http://go.microsoft.com/fwlink/?LinkID=699549
[To create a new storage account]: http://go.microsoft.com/fwlink/?LinkID=699528#create_new
[Virtual Machine and Cloud Service Sizes for Azure]: http://go.microsoft.com/fwlink/?LinkId=466520

<!-- IMG List -->

[ic710876]: ./media/azure-toolkit-for-eclipse-whats-new/ic710876.png
[ic710877]: ./media/azure-toolkit-for-eclipse-whats-new/ic710877.png
[ic710879]: ./media/azure-toolkit-for-eclipse-whats-new/ic710879.png
[ic710880]: ./media/azure-toolkit-for-eclipse-whats-new/ic710880.png
[ic710881]: ./media/azure-toolkit-for-eclipse-whats-new/ic710881.png
[ic710876]: ./media/azure-toolkit-for-eclipse-whats-new/ic710876.png
[ic710882]: ./media/azure-toolkit-for-eclipse-whats-new/ic710882.png
[ic710883]: ./media/azure-toolkit-for-eclipse-whats-new/ic710883.png
