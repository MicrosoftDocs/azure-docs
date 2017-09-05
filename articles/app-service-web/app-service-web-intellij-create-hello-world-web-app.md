---
title: Create a basic Azure web app in IntelliJ
description: This tutorial shows you how to use the Azure Toolkit for IntelliJ to create a Hello World Web App for Azure.
services: app-service\web
documentationcenter: java
author: selvasingh
manager: routlaw
editor: ''

ms.assetid: 75ce7b36-e3ae-491d-8305-4b42ce37db4e
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: Java
ms.topic: article
ms.date: 08/20/2017
ms.author: robmcm;asirveda

---
# Create a basic Azure web app in IntelliJ

This tutorial shows how to create and deploy a basic Hello World application to Azure as a web app by using the [Azure Toolkit for IntelliJ].

> [!NOTE]
> 
> The Azure Toolkit for IntelliJ was updated in August 2017, with a different workflow. With that in mind, this article contains two different sections:
>
> * The first section illustrates creating a Hello World web app by using the August 2017 (or later) version of the Azure Toolkit for IntelliJ.
>
> * The second section of this article demonstrates creating a Hello World web app by using the April 2017 (or earlier) version of the toolkit.
> 

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../../includes/azure-toolkit-for-intellij-prerequisites.md)]

## Create a Hello World web app by using the version 3.0.7 or later toolkit

### Create a new web app project

1. Start IntelliJ and sign-in to your Azure account using the steps in the [Sign In Instructions for the Azure Toolkit for IntelliJ] article.

1. Click the **File** menu, then click **New**, and then click **Project**.
   
   ![Create New Project][file-new-project]

1. In the **New Project** dialog box, select **Maven**, then **maven-archetype-webapp**, and then click **Next**.
   
   ![Choose Maven archetype webapp][maven-archetype-webapp]
   
1. Specify the **GroupId** and **ArtifactId** for your web app, and then click **Next**.
   
   ![Specify GroupId and ArtifactId][groupid-and-artifactid]

1. Customize any Maven settings or accept the defaults, and then click **Next**.
   
   ![Specify Maven settings][maven-options]

1. Specify your project name and location, and then click **Finish**.
   
   ![Specify project name][project-name]

1. Within IntelliJ's Project Explorer view, expand **src**, then **main**, then **webapp**, and then double-click **index.jsp**.
   
   ![Open index page][open-index-page]

1. When your index.jsp file opens in IntelliJ, add in text to dynamically display **Hello World!** within the existing `<body>` element. Your updated `<body>` content should resemble the following example:
   
   ```java
   <body><b><% out.println("Hello World!"); %></b></body>
   ``` 

   ![Edit index page][edit-index-page]

1. Save index.jsp.

### Deploy your web app to Azure

1. Within IntelliJ's Project Explorer view, right-click your project, choose **Azure**, and then choose **Run on Web App**.
   
   ![Run on web app menu][run-on-web-app-menu]

1. In the Run on Web App dialog box, you can choose one of the following options:

   * Choose an existing web app (if one exists), and then click **Run**.

      ![Run on Web App dialog box][run-on-web-app-dialog]

   * Click **Create New Web App**. If you choose to create a new web app, specify the requisite information for your web app, and then click **Run**.

      ![Create new web app][create-new-web-app-dialog]

1. The toolkit will display a status message when it has successfully deployed your web app, which will also display the URL of your deployed web app.

   ![Successful deployment][successfully-deployed]

1. You can browse to your web app using the link provided in the status message.

   ![Browsing your web app][browse-web-app]

1. After you have published your web app, your settings will be saved as the default, and you can run your application on Azure by clicking the green arrow icon on the toolbar. You can modify your settings by clicking the drop-down menu for your web app and click **Edit Configurations**.

   ![Edit configuration menu][edit-configuration-menu]

1. When the **Run/Debug Configurations** dialog box is displayed, you can modify any of the default settings, and then click **OK**.

   ![Edit configuration dialog box][edit-configuration-dialog]

<hr />

## Create a Hello World web app by using the version 3.0.6 or earlier toolkit

### Create a new web app project

1. Start IntelliJ and click the **File** menu, then click **New**, and then click **Project**.
   
   ![File New Project][02]

2. In the **New Project** dialog box, select **Java**, then **Web Application**, and then click **New** to add a Project SDK.
   
   ![New Project Dialog][03a]
   
3. In the Select Home Directory for JDK dialog box, select the folder where your JDK is installed, and then click **OK**. Click **Next** in the New Project dialog box to continue.
   
   ![Specify JDK Home Directory][03b]

4. For purposes of this tutorial, name the project **Java-Web-App-On-Azure**, and then click **Finish**.
   
   ![New Project Dialog][04]

5. Within IntelliJ's Project Explorer view, expand **Java-Web-App-On-Azure**, then expand **web**, and then double-click **index.jsp**.
   
   ![Open Index Page][05c]

6. When your index.jsp file opens in IntelliJ, add in text to dynamically display **Hello World!** within the existing `<body>` element. Your updated `<body>` content should resemble the following example:
   
   ```java
   <body><b><% out.println("Hello World!"); %></b></body>
   ```

7. Save index.jsp.

### Deploy your web app to Azure
There are several ways by which you can deploy a Java web app to Azure. This tutorial describes one of the simplest: your application will be deployed to an Azure Web App Container - no special project type nor additional tools are needed. The JDK and the web container software will be provided for you by Azure, so there is no need to upload your own; all you need is your Java Web App. As a result, the publishing process for your application will take seconds, not minutes.

Before you publish your application, you first need to configure your module settings. To do so, use the following steps:

1. In IntelliJ's Project Explorer, right-click the **Java-Web-App-On-Azure** project. When the context menu appears, click **Open Module Settings**.

   ![Open Module Settings][05a]

2. When the Project Structure dialog box appears:

   a. Click **Artifacts** in the list of **Project Settings**.

   b. Change the artifact name in the **Name** box so that it doesn't contain whitespace or special characters; this is necessary since the name will be used in the Uniform Resource Identifier (URI).

   c. Change the **Type** to **Web Application: Archive**.

   d. Click **OK** to close the Project Structure dialog box.

   ![Open Module Settings][05b]

When you have configured your module settings, you can publish your application to Azure by using the following steps:

1. In IntelliJ's Project Explorer, right-click the **Java-Web-App-On-Azure** project. When the context menu appears, select **Azure**, and then click **Publish as Azure Web App...**
   
   ![Azure Publish Context Menu][06]

2. If you have not already signed in to Azure from IntelliJ, you will be prompted to sign in to your Azure account. (If you have multiple Azure accounts, some of the prompts during the sign-in process may be shown more than once, even if they appear to be the same. When this happens, continue to follow the sign-in instructions.)
   
   ![Azure Log In Dialog][07]

3. After you have successfully signed in to your Azure account, the **Manage Subscriptions** dialog box will display a list of subscriptions that are associated with your credentials. (If there are multiple subscriptions listed and you want to work with only a specific subset of them, you may optionally uncheck the subscriptions you don't want to use.) When you have selected your subscriptions, click **Close**.
   
   ![Manage Subscriptions][08]

4. When the **Deploy to Azure Web App Container** dialog box appears, it will display any Web App containers that you have previously created; if you have not created any containers, the list will be empty.
   
   ![App Containers][09]

5. If you have not created an Azure Web App Container before, or if you would like to publish your application to a new container, use the following steps. Otherwise, select an existing Web App Container and skip to step 6 below.
   
   a. Click the **+** sign.
      
      ![Add App Container][10]

   b. The **New Web App Container** dialog box will be displayed, which will be used for the next several steps.
      
      ![New App Container][11a]
   
   c. Enter a **DNS Label** for your Web App Container; this will form the leaf DNS label of the host URL for your web application in Azure. Note that the name must be available and conform to Azure Web App naming requirements.

   d. In the **Web Container** drop-down menu, select the appropriate software for your application.
      
      Currently, you can choose from Tomcat 8, Tomcat 7 or Jetty 9. A recent distribution of the selected software will be provided by Azure, and it will run on a recent distribution of JDK 8 created by Oracle and provided by Azure.

   e. In the **Subscription** drop-down menu, select the subscription you want to use for this deployment.

   f. In the **Resource Group** drop-down menu, select the Resource Group with which you want to associate your Web App. (Azure Resource Groups allow you to group related resources together so that, for example, they can be deleted together.)
      
      You can select an existing Resource Group (if you have any) and skip to step g below, or use the following steps to create a new Resource Group:
      
      * Select **&lt;&lt; Create new Resource Group &gt;&gt;** in the **Resource Group** drop-down menu.
      * The **New Resource Group** dialog box will be displayed:
        
         ![New Resource Group][12]

      * In the **Name** textbox, specify a name for your new Resource Group.
      * In the **Region** drop-down menu, select the appropriate Azure data center location for your Resource Group.
      * Click **OK**.

   g. The **App Service Plan** drop-down menu lists the app service plans that are associated with the Resource Group that you selected. (An App Service Plan specifies information such as the location of your Web App, the pricing tier and the compute instance size. A single App Service Plan can be used for multiple Web Apps, which is why it is maintained separately from a specific Web App deployment.)
      
      You can select an existing App Service Plan (if you have any) and skip to step h below, or use the following steps to create a new App Service Plan:
      
      * Select **&lt;&lt; Create new App Service Plan &gt;&gt;** in the **App Service Plan** drop-down menu.
      * The **New App Service Plan** dialog box will be displayed:
        
         ![New App Service Plan][13]

      * In the **Name** textbox, specify a name for your new App Service Plan.
      * In the **Location** drop-down menu, select the appropriate Azure data center location for the plan.
      * In the **Pricing Tier** drop-down menu, select the appropriate pricing for the plan. For testing purposes you can choose **Free**.
      * In the **Instance Size** drop-down menu, select the appropriate instance size for the plan. For testing purposes you can choose **Small**.
      * Click **OK**.

   h. (Optional) By default, a recent distribution of Java 8 will be automatically deployed as your JVM by Azure to your web app container. However, you can select a different version and distribution of the JVM. To do so, use the following steps:
      
      * Click the **JDK** tab in the **New Web App Container** dialog box.
      * You can choose from one of the following options:
        
         * Deploy the default JDK which is offered by Azure
         * Deploy a 3rd party JDK from a drop-down list of additional JDKs which are available on Azure
         * Deploy a custom JDK, which must be packaged as a ZIP file and either publicly available or in your Azure storage account
        
      ![New App Container JDK Tab][11b]

   i. Once you have completed all of the above steps, the New Web App Container dialog box should resemble the following illustration:
      
      ![New App Container][14]
   
   j. Click **OK** to complete the creation of your new Web App container.
       
      Wait a few seconds for the list of the Web App containers to be refreshed, and your newly-created web app container should now be selected in the list.

6. You are now ready to complete the initial deployment of your Web App to Azure; click **OK** to deploy your Java application to the selected Web App container. By default, your application will be deployed as a subdirectory of the application server. If you want it to be deployed as the root application, check the **Deploy to root** checkbox before clicking **OK**.
   
   ![Deploy To Azure][15]

7. Next, you should see the **Azure Activity Log** view, which will indicate the deployment status of your Web App.
   
   ![Progress Indicator][16]
   
   The process of deploying your Web App to Azure should take only a few seconds to complete. When your application is ready, you will see a link named **Published** in the **Status** column. When you click the link, it will take you to your deployed Web App's home page, or you can use the steps in the following section to browse to your web app.

### Browsing to your Web App on Azure
To browse to your Web App on Azure, you can use the **Azure Explorer** view.

If the **Azure Explorer** view is not already open, you can open it by clicking then **View** menu in IntelliJ, then click **Tool Windows**, and then click **Service Explorer**. If you have not previously logged in, it will prompt you to do so.

When the **Azure Explorer** view is displayed, follow these steps to browse to your Web App: 

1. Expand the **Azure** node.
2. Expand the **Web Apps** node. 
3. Right-click the desired Web App.
4. When the context menu appears, click **Open in Browser**.
   
   ![Browse Web App][17]

### Updating your web app
Updating an existing running Azure Web App is a quick and easy process, and you have two options for updating:

* You can update the deployment of an existing Java Web App.
* You can publish an additional Java application to the same Web App Container.

In either case, the process is identical and takes only a few seconds:

1. In the IntelliJ project explorer, right-click the Java application you want to update or add to an existing Web App Container.
2. When the context menu appears, select **Azure** and then **Publish as Azure Web App...**
3. Since you have already logged in previously, you will see a list of your existing Web App containers. Select the one you want to publish or re-publish your Java application to and click **OK**.

A few seconds later, the **Azure Activity Log** view will show your updated deployment as **Published** and you will be able to verify your updated application in a web browser.

### Starting, stopping, or restarting an existing web app
To start or stop an existing Azure Web App container, (including all the deployed Java applications in it), you can use the **Azure Explorer** view.

If the **Azure Explorer** view is not already open, you can open it by clicking then **View** menu in IntelliJ, then click **Tool Windows**, and then click **Service Explorer**. If you have not previously logged in, it will prompt you to do so.

When the **Azure Explorer** view is displayed, follow these steps to start or stop your Web App: 

1. Expand the **Azure** node.
2. Expand the **Web Apps** node. 
3. Right-click the desired Web App.
4. When the context menu appears, click **Start**, **Stop**, or **Restart**. Note that the menu choices are context-aware, so you can only stop a running web app or start a web app which is not currently running.
   
   ![Stop Web App][18]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../../includes/azure-toolkit-additional-resources.md)]

For additional information about creating Azure Web Apps, see the [Web Apps Overview].

[!INCLUDE [app-service-web-try-app-service](../../includes/app-service-web-try-app-service.md)]

<!-- URL List -->

[Azure Toolkit for Eclipse]: ../azure-toolkit-for-eclipse.md
[Azure Toolkit for IntelliJ]: ../azure-toolkit-for-intellij.md
[Create a Hello World Web App for Azure in Eclipse]: ./app-service-web-eclipse-create-hello-world-web-app.md
[Create a Hello World Web App for Azure in IntelliJ]: ./app-service-web-intellij-create-hello-world-web-app.md
[Installing the Azure Toolkit for Eclipse]: ../azure-toolkit-for-eclipse-installation.md
[Installing the Azure Toolkit for IntelliJ]: ../azure-toolkit-for-intellij-installation.md
[What's New in the Azure Toolkit for Eclipse]: ../azure-toolkit-for-eclipse-whats-new.md
[What's New in the Azure Toolkit for IntelliJ]: ../azure-toolkit-for-intellij-whats-new.md

[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Web Apps Overview]: ./app-service-web-overview.md
[Apache Tomcat]: http://tomcat.apache.org/
[Jetty]: http://www.eclipse.org/jetty/

<!-- IMG List -->

[01]: ./media/app-service-web-intellij-create-hello-world-web-app/01-Web-Page.png
[02]: ./media/app-service-web-intellij-create-hello-world-web-app/02-File-New-Project.png
[03a]: ./media/app-service-web-intellij-create-hello-world-web-app/03-New-Project-Dialog.png
[03b]: ./media/app-service-web-intellij-create-hello-world-web-app/03-New-Project-SDK-Dialog.png
[04]: ./media/app-service-web-intellij-create-hello-world-web-app/04-New-Project-Dialog.png
[05a]: ./media/app-service-web-intellij-create-hello-world-web-app/05-Open-Module-Settings.png
[05b]: ./media/app-service-web-intellij-create-hello-world-web-app/05-Project-Structure-Dialog.png
[05c]: ./media/app-service-web-intellij-create-hello-world-web-app/05-Open-Index-Page.png
[06]: ./media/app-service-web-intellij-create-hello-world-web-app/06-Azure-Publish-Context-Menu.png
[07]: ./media/app-service-web-intellij-create-hello-world-web-app/07-Azure-Log-In-Dialog.png
[08]: ./media/app-service-web-intellij-create-hello-world-web-app/08-Manage-Subscriptions.png
[09]: ./media/app-service-web-intellij-create-hello-world-web-app/09-App-Containers.png
[10]: ./media/app-service-web-intellij-create-hello-world-web-app/10-Add-App-Container.png
[11a]: ./media/app-service-web-intellij-create-hello-world-web-app/11-New-App-Container.png
[11b]: ./media/app-service-web-intellij-create-hello-world-web-app/11-New-App-Container-JDK-Tab.png
[12]: ./media/app-service-web-intellij-create-hello-world-web-app/12-New-Resource-Group.png
[13]: ./media/app-service-web-intellij-create-hello-world-web-app/13-New-App-Service-Plan.png
[14]: ./media/app-service-web-intellij-create-hello-world-web-app/14-New-App-Container.png
[15]: ./media/app-service-web-intellij-create-hello-world-web-app/15-Deploy-To-Azure.png
[16]: ./media/app-service-web-intellij-create-hello-world-web-app/16-Progress-Indicator.png
[17]: ./media/app-service-web-intellij-create-hello-world-web-app/17-Browse-Web-App.png
[18]: ./media/app-service-web-intellij-create-hello-world-web-app/18-Stop-Web-App.png

[file-new-project]: ./media/app-service-web-intellij-create-hello-world-web-app/file-new-project.png
[maven-archetype-webapp]: ./media/app-service-web-intellij-create-hello-world-web-app/maven-archetype-webapp.png
[groupid-and-artifactid]: ./media/app-service-web-intellij-create-hello-world-web-app/groupid-and-artifactid.png
[maven-options]: ./media/app-service-web-intellij-create-hello-world-web-app/maven-options.png
[project-name]: ./media/app-service-web-intellij-create-hello-world-web-app/project-name.png
[open-index-page]: ./media/app-service-web-intellij-create-hello-world-web-app/open-index-page.png
[edit-index-page]: ./media/app-service-web-intellij-create-hello-world-web-app/edit-index-page.png
[run-on-web-app-menu]: ./media/app-service-web-intellij-create-hello-world-web-app/run-on-web-app-menu.png
[run-on-web-app-dialog]: ./media/app-service-web-intellij-create-hello-world-web-app/run-on-web-app-dialog.png
[create-new-web-app-dialog]: ./media/app-service-web-intellij-create-hello-world-web-app/create-new-web-app-dialog.png
[successfully-deployed]: ./media/app-service-web-intellij-create-hello-world-web-app/successfully-deployed.png
[browse-web-app]: ./media/app-service-web-intellij-create-hello-world-web-app/browse-web-app.png
[edit-configuration-menu]: ./media/app-service-web-intellij-create-hello-world-web-app/edit-configuration-menu.png
[edit-configuration-dialog]: ./media/app-service-web-intellij-create-hello-world-web-app/edit-configuration-dialog.png
