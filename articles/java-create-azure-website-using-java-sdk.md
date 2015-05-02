<properties 
	pageTitle="Create a Web App in Azure App Service using the Azure SDK for Java" 
	description="Learn how to create a Web App on Azure App Service programmatically using the Azure SDK for Java." 
	tags="azure-classic-portal"
	services="app-service\web" 
	documentationCenter="Java" 
	authors="donntrenton" 
	manager="wpickett" 
	editor="jimbe"/>

<tags 
	ms.service="multiple" 
	ms.workload="na" 
	ms.tgt_pltfrm="na" 
	ms.devlang="Java" 
	ms.topic="article" 
	ms.date="04/24/2015" 
	ms.author="v-donntr"/>


# Create a Web App in Azure App Service using the Azure SDK for Java

<!-- Azure Active Directory workflow is not yet available on the Azure Portal -->

## Overview

This walkthrough shows you how to create an Azure SDK for Java application that creates a Web App in [Azure App Service](http://go.microsoft.com/fwlink/?LinkId=529714), then deploy an application to it. It consists of two parts:

- Part 1 demonstrates how to build a Java application that creates a web app.
- Part 2 demonstrates how to create a simple JSP "Hello World" application, then use an FTP client to deploy code to App Service.


## Prerequisites

### Software Installations

The AzureWebDemo application code in this article was written using Azure Java SDK 0.7.0, which you can install using the [Web Platform Installer (WebPI)](http://go.microsoft.com/fwlink/?LinkID=252838). In addition, make sure to use the latest version of the [Azure Toolkit for Eclipse](https://msdn.microsoft.com/library/azure/hh690946.aspx). After you install the SDK, update the dependencies in your Eclipse project by running **Update Index** in **Maven Repositories**, then re-add the latest version of each package in the **Dependencies** window. You can verify the version of your installed software in Eclipse by clicking **Help > Installation Details**; you should have at least the following versions:

- Package for Microsoft Azure Libraries for Java 0.7.0.20150309
- Eclipse IDE for Java EE Developers 4.4.2.20150219


### Create and Configure Cloud Resources in Azure

Before you begin this procedure, you need to have an active Azure subscription and set up a default Active Directory (AD) on Azure.


### Create an Active Directory (AD) in Azure

If you do not already have an Active Directory (AD) on your Azure subscription, log into the [Azure classic portal](https://manage.windowsazure.com) with your Microsoft account. If you have multiple subscriptions, click **Subscriptions** and select the default directory for the subscription you want to use for this project. Then click **Apply** to switch to that subscription view.

1. Select **Active Directory** from the menu at left. **Click New > Directory > Custom Create**.

2. In **Add Directory**, select **Create New Directory**.

3. In **Name**, enter a directory name.

4. In **Domain**, enter a domain name. This is a basic domain name that is included by default with your directory; it has the form `<domain_name>.onmicrosoft.com`. You can name it based on the directory name or another domain name that you own. Later, you can add another domain name that your organization already uses.

5. In **Country or region**, select your locale.

For more information on AD, see [What is an Azure AD directory?](http://technet.microsoft.com/library/jj573650.aspx).


### Create a Management Certificate for Azure

The Azure SDK for Java uses management certificates to authenticate with Azure subscriptions. These are X.509 v3 certificates you use to authenticate a client application that uses the Service Management API to act on behalf of the subscription owner to manage subscription resources.

The code in this procedure uses a self-signed certificate to authenticate with Azure. For this procedure, you need to create a certificate and upload it to the [Azure classic portal](https://manage.windowsazure.com) beforehand. This involves the following steps:

- Generate a PFX file representing your client certificate and save it locally.
- Generate a management certificate (CER file) from the PFX file.
- Upload the CER file to your Azure subscription.
- Convert the PFX file into JKS, because Java uses that format to authenticate using certificates.
- Write the application's authentication code, which refers to the local JKS file.

When you complete this procedure, the CER certificate will reside in your Azure subscription and the JKS certificate will reside on your local drive. For more information on management certificates, see [Create and Upload a Management Certificate for Azure](http://msdn.microsoft.com/library/azure/gg551722.aspx).


#### Create a certificate

To create your own self-signed certificate, open a command console on your operating system and run the following commands.

> **Note:**  The computer on which you run this command must have the JDK installed. Also, the path to the keytool depends on the location in which you install the JDK. For more information, see [Key and Certificate Management Tool (keytool)](http://docs.oracle.com/javase/6/docs/technotes/tools/windows/keytool.html) in the Java online docs.

To create the .pfx file:

    <java-install-dir>/bin/keytool -genkey -alias <keystore-id>
     -keystore <cert-store-dir>/<cert-file-name>.pfx -storepass <password>
     -validity 3650 -keyalg RSA -keysize 2048 -storetype pkcs12
     -dname "CN=Self Signed Certificate 20141118170652"

To create the .cer file:

    <java-install-dir>/bin/keytool -export -alias <keystore-id>
     -storetype pkcs12 -keystore <cert-store-dir>/<cert-file-name>.pfx
     -storepass <password> -rfc -file <cert-store-dir>/<cert-file-name>.cer

where:

- `<java-install-dir>` is the path to the directory in which you installed Java.
- `<keystore-id>` is the keystore entry identifier (for example, `AzureRemoteAccess`).
- `<cert-store-dir>` is the path to the directory in which you want to store certificates (for example `C:/Certificates`).
- `<cert-file-name>` is the name of the certificate file (for example `AzureWebDemoCert`).
- `<password>` is the password you choose to protect the certificate; it must be at least 6 characters long. You can enter no password, although this is not recommended.
- `<dname>` is the X.500 Distinguished Name to be associated with alias, and is used as the issuer and subject fields in the self-signed certificate.

For more information, see [Create and Upload a Management Certificate for Azure](http://msdn.microsoft.com/library/azure/gg551722.aspx).


#### Upload the certificate

To upload a self-signed certificate to Azure, go to the **Settings** page in the classic portal, then click the **Management Certificates** tab. Click **Upload** at the bottom of the page and navigate to the location of the CER file you created.


#### Convert the PFX file into JKS

In the Windows Command Prompt (running as admin), cd to the directory containing the certificates and run the following command, where `<java-install-dir>` is the directory in which you installed Java on your computer:

    <java-install-dir>/bin/keytool.exe -importkeystore
     -srckeystore <cert-store-dir>/<cert-file-name>.pfx
     -destkeystore <cert-store-dir>/<cert-file-name>.jks
     -srcstoretype pkcs12 -deststoretype JKS

1. When prompted, enter the destination keystore password; this will be the password for the JKS file.

2. When prompted, enter the source keystore password; this is the password you specified for the PFX file.

The two passwords do not have to be the same. You can enter no password, although this is not recommended.


## Build a Web App creation application

### Create the Eclipse Workspace and Maven Project

In this section you create a workspace and a Maven project for the web app creation application, named AzureWebDemo.

1. Create a new Maven project. Click **File > New > Maven Project**. In **New Maven Project**, select **Create a simple project** and **Use default workspace location**.

2. On the second page of **New Maven Project**, specify the following:

    - Group ID: `com.<username>.azure.webdemo`
    - Artifact ID: AzureWebDemo
    - Version: 0.0.1-SNAPSHOT
    - Packaging: jar
    - Name: AzureWebDemo

    Click **Finish**.

3. Open the new project's pom.xml file in Project Explorer. Select the **Dependencies** tab. As this is a new project, no packages are listed yet.

4. Open the Maven Repositories view. **Click Window > Show View > Other > Maven > Maven Repositories** and click **OK**. The **Maven Repositories** view will appear at the bottom of the IDE.

5. Open **Global Repositories**, right-click the **central** repository, and select **Rebuild Index**.

    ![][1]
    
    This step can take several minutes depending on the speed of your connection. When the index rebuilds, you should see the Microsoft Azure packages in the **central** Maven repository.

6. In **Dependencies**, click **Add**. In **Enter Group ID...** enter `azure-management`. Select the packages for base management and App Service Web Apps management:

        com.microsoft.azure  azure-management
        com.microsoft.azure  azure-management-websites

    > **Note:** If you are updating the dependencies after a new version
    > release, you need to re-add each of the dependencies in this list.
    > After you click **Add** and select each dependency, it appears
    > with the new version number in the **Dependencies** list.

Click **OK**. The Azure packages then appear in the **Dependencies** list.


### Writing Java Code to Create a Web App by Calling the Azure SDK

Next, write the code that calls APIs in the Azure SDK for Java to create the App Service web app.

1. Create a Java class to contain the main entry point code. In Project Explorer, right-click on the project node and select **New > Class**.

2. In **New Java Class**, name the class `WebCreator` and check the **public static void main** checkbox. The selections should appear as follows:

    ![][2]

3. Click **Finish**. The WebCreator.java file appears in Project Explorer.


### Calling the Azure API to Create an App Service Web App


#### Add necessary imports

In WebCreator.java, add the following imports; these imports provide access to classes in the management libraries for consuming Azure APIs:

    // General imports
    import java.net.URI;
    import java.util.ArrayList;
    
    // Imports for Exceptions
    import java.io.IOException;
    import java.net.URISyntaxException;
    import javax.xml.parsers.ParserConfigurationException;
    import com.microsoft.windowsazure.exception.ServiceException;
    import org.xml.sax.SAXException;
    
    // Imports for Azure App Service management configuration
    import com.microsoft.windowsazure.Configuration;
    import com.microsoft.windowsazure.management.configuration.ManagementConfiguration;
    
    // Service management imports for App Service Web Apps creation
    import com.microsoft.windowsazure.management.websites.*;
    import com.microsoft.windowsazure.management.websites.models.*;
    
    // Imports for authentication
    import com.microsoft.windowsazure.core.utils.KeyStoreType;


#### Define the main entry point class

Because the purpose of the AzureWebDemo application is to create an App Service Web App, name the main class for this application `WebAppCreator`. This class provides the main entry point code that calls the Azure Service Management API to create the web app.

Add the following parameter definitions for the web app and webspace. You will need to provide your own Azure subscription ID and certificate information.

    public class WebAppCreator {
    
        // Parameter definitions used for authentication.
        private static String uri = "https://management.core.windows.net/";
        private static String subscriptionId = "<subscription-id>";
        private static String keyStoreLocation = "<certificate-store-path>";
        private static String keyStorePassword = "<certificate-password>";
    
        // Define web app parameter values.
        private static String webAppName = "WebDemoWebApp";
        private static String domainName = ".azurewebsites.net";
        private static String webSpaceName = WebSpaceNames.WESTUSWEBSPACE;
        private static String appServicePlanName = "WebDemoAppServicePlan";

where:

- `<subscription-id>` is the Azure subscription ID in which you want to create the resource.
- `<certificate-store-path>` is the path and filename to the JKS file in your local certificate store directory. For example, `C:/Certificates/CertificateName.jks` for Linux and `C:\Certificates\CertificateName.jks` for Windows.
- `<certificate-password>` is the password you specified when you created your JKS certificate.
- `webAppName` can be any name you choose; this procedure uses the name `WebDemoWebApp`. The full domain name is the `webAppName` with the `domainName` appended, so in this case the full domain is `webdemowebapp.azurewebsites.net`.
- `domainName` should be specified as shown above.
- `webSpaceName` should be one of the values defined in the [WebSpaceNames](http://dl.windowsazure.com/javadoc/com/microsoft/windowsazure/management/websites/models/WebSpaceNames.html) class.
- `appServicePlanName` should be specified as shown above.

> **Note:** Each time you run this application, you need to change the value 
> of `webAppName` and `appServicePlanName` (or delete the web app on the Azure 
> Portal) before running the application again. Otherwise, execution will 
> fail because the same resource already exists on Azure.


#### Define the web creation method

Next, define a method to create the web app. This method, `createWebApp`, specifies the parameters of the web app and the webspace. It also creates and configures the App Service Web Apps management client, which is defined by the [WebSiteManagementClient](http://dl.windowsazure.com/javadoc/com/microsoft/windowsazure/management/websites/WebSiteManagementClient.html) object. The management client is key to creating Web Apps. It provides RESTful web services that allow applications to manage web apps (performing operations such as create, update, and delete) by calling the service management API.

    private static void createWebApp() throws Exception {

        // Specify configuration settings for the App Service management client.
        Configuration config = ManagementConfiguration.configure(
            new URI(uri),
            subscriptionId,
            keyStoreLocation,  // Path to the JKS file
            keyStorePassword,  // Password for the JKS file
            KeyStoreType.jks   // Flag that you are using a JKS keystore
        );

        // Create the App Service Web Apps management client to call Azure APIs
        // and pass it the App Service management configuration object.
        WebSiteManagementClient webAppManagementClient = WebSiteManagementService.create(config);

        // Create an App Service plan for the web app with the specified parameters.
        WebHostingPlanCreateParameters appServicePlanParams = new WebHostingPlanCreateParameters();
        appServicePlanParams.setName(appServicePlanName);
        appServicePlanParams.setSKU(SkuOptions.Free);
        webAppManagementClient.getWebHostingPlansOperations().create(webSpaceName, appServicePlanParams);

        // Set webspace parameters.
        WebSiteCreateParameters.WebSpaceDetails webSpaceDetails = new WebSiteCreateParameters.WebSpaceDetails();
        webSpaceDetails.setGeoRegion(GeoRegionNames.WESTUS);
        webSpaceDetails.setPlan(WebSpacePlanNames.VIRTUALDEDICATEDPLAN);
        webSpaceDetails.setName(webSpaceName);

        // Set web app parameters.
        // Note that the server farm name takes the Azure App Service plan name.
        WebSiteCreateParameters webAppCreateParameters = new WebSiteCreateParameters();
        webAppCreateParameters.setName(webAppName);
        webAppCreateParameters.setServerFarm(appServicePlanName);
        webAppCreateParameters.setWebSpace(webSpaceDetails);

        // Set usage metrics attributes.
        WebSiteGetUsageMetricsResponse.UsageMetric usageMetric = new WebSiteGetUsageMetricsResponse.UsageMetric();
        usageMetric.setSiteMode(WebSiteMode.Basic);
        usageMetric.setComputeMode(WebSiteComputeMode.Shared);

        // Define the web app object.
        ArrayList<String> fullWebAppName = new ArrayList<String>();
        fullWebAppName.add(webAppName + domainName);
        WebSite webApp = new WebSite();
        webApp.setHostNames(fullWebAppName);

        // Create the web app.
        WebSiteCreateResponse webAppCreateResponse = webAppManagementClient.getWebSitesOperations().create(webSpaceName, webAppCreateParameters);

        // Output the HTTP status code of the response; 200 indicates the request succeeded; 4xx indicates failure.
        System.out.println("----------");
        System.out.println("Web app created - HTTP response " + webAppCreateResponse.getStatusCode() + "\n");

        // Output the name of the web app that this application created.
        String shinyNewWebAppName = webAppCreateResponse.getWebSite().getName();
        System.out.println("----------\n");
        System.out.println("Name of web app created: " + shinyNewWebAppName + "\n");
        System.out.println("----------\n");
    }

The code will output the HTTP status of the response indicating success or failure, and if successful, will output the name of the created web app.


#### Define the main() method

Provide the main() method code that calls createWebApp() to create the web app.

Finally, call `createWebApp` from `main`:

        public static void main(String[] args)
            throws IOException, URISyntaxException, ServiceException,
            ParserConfigurationException, SAXException, Exception {

            // Create web app
            createWebApp();

        }  // end of main()

    }  // end of WebAppCreator class


#### Run the application and verify web app creation

To verify that your application runs, click **Run > Run**. When the application completes running, you should see the following output in the Eclipse console:

    ----------
    Web app created - HTTP response 200
    
    ----------
    
    Name of web app created: WebDemoWebApp
    
    ----------

Log into the Azure classic portal and click **Web Apps**. The new web app should appear in the Web Apps list within a few minutes.


## Deploying an Application to the Web App

After you have run AzureWebDemo and created the new web app, log into the classic portal, click **Web Apps**, and select **WebDemoWebApp** in the **Web Apps** list. In the web app's dashboard page, click **Browse** (or click the URL, `webdemowebapp.azurewebsites.net`) to navigate to it. You will see a blank placeholder page, because no content has been published to the web app yet.

Next you will create a "Hello World" application and deploy it to the web app.


### Create a JSP Hello World application

#### Create the application

In order to demonstrate how to deploy an application to the web, the following procedure shows you how to create a simple "Hello World" Java application and upload it to the App Service Web App that your application created.

1. Click **File > New > Dynamic Web Project**. Name it `JSPHello`. You do not need to change any other settings in this dialog. Click **Finish**.

    ![][3]

2. In Project Explorer, expand the **JSPHello** project, right-click **WebContent**, then click **New > JSP File**. In the New JSP File dialog, name the new file `index.jsp`. Click **Next**.

3. In the **Select JSP Template** dialog, select **New JSP File (html)** and click **Finish**.

4. In index.jsp, add the following code in the `<head>` and `<body>` tag sections:

        <head>
          ...
          java.util.Date date = new java.util.Date();
        </head>
    
        <body>
          Hello, the time is <%= date %> 
        </body>


#### Run the Hello World application in localhost

Before you run this application, you need to configure a few properties.

1. Right-click the **JSPHello** project and select **Properties**.

2. In the **Properties** dialog: select **Java Build Path**, select the **Order and Export** tab, check **JRE System Library**, then click **Up** to move it to the top of the list.

    ![][4]

3. Also in the **Properties** dialog: select **Targeted Runtimes** and click **New**.

4. In the **New Server Runtime Environment** dialog, select a server such as **Apache Tomcat v7.0** and click **Next**. In the **Tomcat Server** dialog, set **Name** to `Apache Tomcat v7.0`, and set **Tomcat Installation Directory** to the directory in which you installed the version of Tomcat server you want to use.

    ![][5]

    Click **Finish**.

5. You then return to the **Targeted Runtimes** page of the **Properties** dialog. Select **Apache Tomcat v7.0**, then click **OK**.

    ![][6]

6. In the Eclipse **Run** menu, click **Run**. In the **Run As** dialog, select **Run on Server**. In the **Run on Server** dialog, select **Tomcat v7.0 Server**:

    ![][7]

    Click **Finish**.

7. When the application runs, you should see the **JSPHello** page appear in a localhost window in Eclipse (`http://localhost:8080/JSPHello/`), displaying the following message:

    `Hello World, the time is Tue Mar 24 23:21:10 GMT 2015`


#### Export the application as a WAR

Export the web project files as a web archive (WAR) file so that you can deploy it to the web app. The following web project files reside in the WebContent folder:

    META-INF
    WEB-INF
    index.jsp

1. Right-click the WebContent folder and select **Export**.

2. In the **Export Select** dialog, click **Web > WAR** file, then click **Next**.

3. In the **WAR Export** dialog, select the src directory in the current project, and include the name of the WAR file at the end. For example:

    `<project-path>/JSPHello/src/JSPHello.war`

For more information on deploying WAR files, see [Add a Java application to Azure App Service Web Apps](web-sites-java-add-app.md).


### Deploying the Hello World Application Using FTP

Select a third-party FTP client to publish the application. This procedure describes two options: the Kudu console built into Azure; and FileZilla, a popular tool with a convenient, graphical UI.

> **Note:** The Azure Plugin for Eclipse with Java 2.4 supports deployment to storage accounts and cloud services, but does not currently support deployment to web apps. You can deploy to storage accounts and cloud services using an Azure Deployment Project as described in [Creating a Hello World Application for Azure in Eclipse](http://msdn.microsoft.com/library/azure/hh690944.aspx), but not to web apps. Use other methods such as FTP or GitHub to transfer files to your web app.

> **Note:** We do not recommend using FTP from the Windows command prompt (the command-line FTP.EXE utility that ships with Windows). FTP clients that use active FTP, such as FTP.EXE, often fail to work over firewalls. Active FTP specifies an internal LAN-based address, to which an FTP server will likely fail to connect.

For more information on deployment to an App Service web app using FTP, see the following topics:

- [Manage web apps using the Azure Portal: Deployment](web-sites-manage.md/#deployment)
- [Deploy using an FTP utility](web-sites-deploy.md)


#### Set up deployment credentials

Make sure you have run the **AzureWebDemo** application to create a web app. You will transfer files to this location.

1. Log into the classic portal and click **Web Apps**. Make sure **WebDemoWebApp** appears in the list of web apps, and make sure that it is running. Click **WebDemoWebApp** to open its **Dashboard** page.

2. On the **Dashboard** page, under **Quick Glance**, click **Set up your deployment credentials** (if you already have deployment credentials, this reads **Reset your deployment credentials**).

    Deployment credentials are associated with a Microsoft account. You need to specify a username and password that you can use to deploy using Git and FTP. You can use these credentials to deploy to any web app in all Azure subscriptions associated with your Microsoft account. Provide Git and FTP deployment credentials in the dialog, and record the username and password for future use.


#### Get FTP connection information

To use FTP to deploy application files to the newly created web app, you need to obtain connection information. There are two ways to obtain connection information. One way is to visit the web app's **Dashboard** page; the other way is to download the web app's publish profile. The publish profile is an XML file that provides information such as FTP host name and logon credentials for your web apps in Azure App Service. You can use this username and password to deploy to any web app in all subscriptions associated with the Azure account, not only this one.

To obtain FTP connection information from the web app's blade in the [Azure Portal](https://portal.azure.com):

1. Under **Essentials**, find and copy the **FTP hostname**. This is a URI similar to `ftp://waws-prod-bay-NNN.ftp.azurewebsites.windows.net`.

2. Under **Essentials**, find and copy **FTP/Deployment username**. This will have the form *webappname\deployment-username*; for example `WebDemoWebApp\deployer77`.

To obtain FTP connection information from the publish profile:

1. In the web app's blade, click **Get publish profile**. This will download a .publishsettings file to your local drive.

2. Open the .publishsettings file in an XML editor or text editor and find the `<publishProfile>` element containing `publishMethod="FTP"`. It should look like the following:

        <publishProfile
            profileName="WebDemoWebApp - FTP"
            publishMethod="FTP"
            publishUrl="ftp://waws-prod-bay-NNN.ftp.azurewebsites.windows.net/site/wwwroot"
            ftpPassiveMode="True"
            userName="WebDemoWebApp\$WebDemoWebApp"
            userPWD="<deployment-password>"
            ...
        </publishProfile>

3. Note that the web app's `publishProfile` settings map to the FileZilla Site Manager settings as follows:

- `publishUrl` is the same as **FTP host name**, the value you set in **Host**.
- `publishMethod="FTP"` means that you set **Protocol** to **FTP - File Transfer Protocol**, and **Encryption** to **Use plain FTP**.
- `userName` and `userPWD` are keys for the actual username and password values you specified when you reset the deployment credentials. `userName` is the same as **Deployment / FTP user**. They map to **User** and **Password** in FileZilla.
- `ftpPassiveMode="True"` means that the FTP site uses passive FTP transfer; select **Passive** on the **Transfer Settings** tab.


#### Configure the Web App to host a Java application

Before you publish the application, you need to change a few configuration settings so that the web app can host a Java application.

1. In the classic portal, go to the web app's **Dashboard** page and click **Configure**. On the **Configure** page, specify the following settings.

2. In **Java version** the default is **Off**; select the Java version your application targets; for example 1.7.0_51. After you do this, also make sure that **Web container** is set to a version of Tomcat Server.

3. In **Default Documents**, add index.jsp and move it up to the top of the list. (The default file for web apps is hostingstart.html.)

4. Click **Save**.


#### Publish your application using Kudu

One way to publish the application is to use the Kudu debug console built into Azure. Kudu is known to be stable and consistent with App Service Web Apps and Tomcat Server. You access the console for the web app by browsing to a URL of the following form:

`https://<webappname>.scm.azurewebsites.net/DebugConsole`

1. For this procedure, the Kudu console is located at the following URL; browse to this location:

    `https://webdemowebapp.scm.azurewebsites.net/DebugConsole`

2. From the top menu, select **Debug Console > CMD**.

3. In the console command line, navigate to `/site/wwwroot` (or click `site`, then `wwwroot` in the directory view at the top of the page):

    `cd /site/wwwroot`

4. After you specify **Java version**, Tomcat server should create a webapps directory. In the console command line, navigate to the webapps directory:

    `mkdir webapps`

    `cd webapps`

5. Drag JSPHello.war from `<project-path>/JSPHello/src/` and drop it into the Kudu directory view under `/site/wwwroot/webapps`. Do not drag it to the "Drag here to upload and zip" area, because Tomcat will unzip it.

  ![][8]

At first JSPHello.war appears in the directory area by itself:

  ![][9]

In a short time (probably less than 5 minutes) Tomcat Server will unzip the WAR file into an unpacked JSPHello directory. Click the ROOT directory to see whether index.jsp has been unzipped and copied there. If so, navigate back to the webapps directory to see whether the unpacked JSPHello directory has been created. If you do not see these items, wait and repeat.

  ![][10]


#### Publish your application using FileZilla (optional)

Another tool you can use to publish the application is FileZilla, a popular third-party FTP client with a convenient, graphical UI. You can download and install FileZilla from [http://filezilla-project.org/](http://filezilla-project.org/) if you do not already have it. For more information on using the client, see the [FileZilla documentation](https://wiki.filezilla-project.org/Documentation) and this blog entry on [FTP Clients - Part 4: FileZilla](http://blogs.msdn.com/b/robert_mcmurray/archive/2008/12/17/ftp-clients-part-4-filezilla.aspx).

1. In FileZilla, click **File > Site Manager**.
2. In the **Site Manager** dialog, click **New Site**. A new blank FTP site will appear in **Select Entry** prompting you to provide a name. For this procedure, name it `AzureWebDemo-FTP`.

    On the **General** tab, specify the following settings:
    - **Host:** Enter the **FTP Host Name** that you copied from the dashboard.
    - **Port:** (Leave this blank, as this is a passive transfer and the server will determine the port to use.)
    - **Protocol:** FTP File Transfer Protocol
    - **Encryption:** Use plain FTP
    - **Logon Type:** Normal
    - **User:** Enter the Deployment / FTP user that you copied from the dashboard. This is the full FTP username, which has the form *webappname\username*.
    - **Password:** Enter the password that you specified when you set the deployment credentials.

    On the **Transfer Settings** tab, select **Passive**.

3. Click **Connect**. If successful, FileZilla's console will display a `Status: Connected` message and issue a `LIST` command to list the directory contents.

4. In the **Local** site panel, select the source directory in which the JSPHello.war file resides; the path will be similar to the following:

    `<project-path>/JSPHello/src/`

5. In the **Remote** site panel, select the destination folder. You will deploy the WAR file to the `webapps` directory under the web app's root. Navigate to `/site/wwwroot`, right-click on `wwwroot`, and select **Create directory**. Name the directory `webapps` and enter that directory.

6. Transfer JSPHello.war to `/site/wwwroot/webapps`. Select JSPHello.war in the **Local** file list, right-click on it and select **Upload**. You should see it appear in `/site/wwwroot/webapps`.

7. After you copy JSPHello.war to the webapps directory, Tomcat Server will automatically unpack (unzip) the files in the WAR file. Although Tomcat Server begins unpacking almost immediately, it might take a long time (possibly hours) for the files to appear in the FTP client.


#### Run the Hello World application on the Web App

1. After you have uploaded the WAR file and verified that Tomcat server has created an unpacked `JSPHello` directory, browse to `http://webdemowebapp.azurewebsites.net/JSPHello` to run the application.

    > **Note:** If you click **Browse** from the classic portal, you might
    get the default webpage, saying "This Java based web application has
    been successfully created." You might have to refresh the webpage in
    order to view the application output instead of the default webpage.

2. When the application runs, you should see a web page with the following output:

    `Hello World, the time is Tue Mar 24 23:21:10 GMT 2015`


#### Clean up Azure resources

This procedure creates an App Service web app. You will be billed for the resource as long as it exists. Unless you plan to continue using the web app for testing or development, you should consider stopping or deleting it. A web app that has been stopped will still incur a small charge, but you can restart it at any time. Deleting a web app erases all data you have uploaded to it.

[AZURE.INCLUDE [app-service-web-whats-changed](../includes/app-service-web-whats-changed.md)]

[AZURE.INCLUDE [app-service-web-try-app-service](../includes/app-service-web-try-app-service.md)]

  [1]: ./media/java-create-azure-website-using-java-sdk/eclipse-maven-repositories-rebuild-index.png
  [2]: ./media/java-create-azure-website-using-java-sdk/eclipse-new-java-class.png
  [3]: ./media/java-create-azure-website-using-java-sdk/eclipse-new-dynamic-web-project.png
  [4]: ./media/java-create-azure-website-using-java-sdk/eclipse-java-build-path.png
  [5]: ./media/java-create-azure-website-using-java-sdk/eclipse-targeted-runtimes-tomcat-server.png
  [6]: ./media/java-create-azure-website-using-java-sdk/eclipse-targeted-runtimes-properties-page.png
  [7]: ./media/java-create-azure-website-using-java-sdk/eclipse-run-on-server.png
  [8]: ./media/java-create-azure-website-using-java-sdk/kudu-console-drag-drop.png
  [9]: ./media/java-create-azure-website-using-java-sdk/kudu-console-jsphello-war-1.png
  [10]: ./media/java-create-azure-website-using-java-sdk/kudu-console-jsphello-war-2.png
