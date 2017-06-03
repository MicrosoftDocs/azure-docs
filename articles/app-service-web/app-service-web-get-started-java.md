---
title: Create your first Java web app in Azure in five minutes | Microsoft Docs
description: Learn how easy it is to run web apps in App Service by deploying a simple Java application. 
services: app-service\web
documentationcenter: ''
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 8bacfe3e-7f0b-4394-959a-a88618cb31e1
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: hero-article
ms.date: 6/7/2017
ms.author: cephalin;robmcm
ms.custom: mvc
---
# Create your first Java web app in Azure in five minutes

[!INCLUDE [app-service-web-selector-get-started](../../includes/app-service-web-selector-get-started.md)] 

This quickstart helps you deploy a Java web app to [Azure App Service](../app-service/app-service-value-prop-what-is.md) using the Eclipse IDE for Java EE Developers. When you are finished with this tutorial, you have a basic Java-based web app running in Azure.

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-1.png)

## Prerequisites

* Install the free [Eclipse IDE for Java EE Developers](http://www.eclipse.org/)
* Install the [Azure Toolkit for Eclipse](/azure/azure-toolkit-for-eclipse). See [Installing the Azure Toolkit for Eclipse](/azure/azure-toolkit-for-eclipse-installation).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a Dynamic Web Project in Eclipse

In Eclipse, select **File > New > Dynamic Web Project**.

In the **New Dynamic Web Project** dialog, name the project **MyFirstJavaOnAzureWebApp** and select **Finish**.
   
![Dynamic Web Project dialog](./media/app-service-web-get-started-java/new-dynamic-web-project-dialog-box.png)

### Add a JSP page

If **Project Explorer** is not displayed, restore it.

![workspace - Java EE ](./media/app-service-web-get-started-java/pe.png)

* Expand the **MyFirstJavaOnAzureWebApp** project in the Project Explorer.
* Right-click **WebContent**, and then select **New > JSP File**.

![New JSP File Menu](./media/app-service-web-get-started-java/new-jsp-file-menu.png)

In the **New JSP File** dialog:

* Name the file **index.jsp**
* Select **Finish**.

![New JSP File dialog](./media/app-service-web-get-started-java/new-jsp-file-dialog-box-page-1.png)

In the *NewFIle.jsp* file, replace the `<body></body>` element with the following markup:

```jsp
<body>
<h1><% out.println("Hello Azure!"); %></h1>
</body>
```

Save your changes.

## Publish your web app to Azure

* In **Project Explorer**, right-click your project, and then select **Azure > Publish as Azure Web App**.

   ![Publish as Azure Web App Context Menu](./media/app-service-web-get-started-java/publish-as-azure-web-app-context-menu.png)

* In the **Azure Sign In** dialog, keep the **Interactive** option, and then select **Sign in**.
* Follow the sign-in instructions.

### The **Deploy Web App** dialog

Once you have been signed into your Azure account, the **Deploy Web App** dialog is displayed.

Click **Create**.

![Deploy Web App dialog](./media/app-service-web-get-started-java/deploy-web-app-dialog-box.png)

### The **Create App Service** dialog

The The **Create App Service** dialog is displayed with default values. The number **170602185241** shown in the following image is different in your dialog.

![Create App Service dialog](./media/app-service-web-get-started-java/cas1.png)

In the **Create App Service** dialog:

* Keep the generated name for the web app. This name must be unique across Azure. The name is part of the DNS address for your web app; for example: Entering **MyJavaWebApp**, the DNS is *myjavawebapp.azurewebsites.net*.
* Keep the default web container your web app uses.
* Select an Azure subscription.
* In the **App service plan** tab:

  * Keep the default for **Create new**, which is the name of the App Service Plan.
  * Location: Select **West Europe** or a location near you.
  * Pricing tier: Select free. 

   ![Create App Service dialog](./media/app-service-web-get-started-java/create-app-service-dialog-box.png)

[!INCLUDE [app-service-plan](../../includes/app-service-plan.md)]

### The Resource group tab

Click the **Resource group** tab. Keep the default generated value for the resource group.

![Create App Service Plan](./media/app-service-web-get-started-java/create-app-service-resource-group.png)

[!INCLUDE [resource-group](../../includes/resource-group.md)]

### The JDK tab

Click the **JDK** tab. Keep the default, and then click **Create**.

![Create App Service Plan](./media/app-service-web-get-started-java/create-app-service-specify-jdk.png)

The Azure Toolkit creates your app service and displays a progress dialog box.

![Create App Service Progress Bar](./media/app-service-web-get-started-java/create-app-service-progress-bar.png)

### The Deploy Web App dialog

In the Deploy Web App dialog, check **Deploy to root**. If you have an app service at *wingtiptoys.azurewebsites.net* and you do not deploy to the root, your web app named **MyFirstJavaOnAzureWebApp** is deployed to *wingtiptoys.azurewebsites.net/MyFirstJavaOnAzureWebApp*.

![Deploy Web App to Root](./media/app-service-web-get-started-java/deploy-web-app-to-root.png)

The dialog shows the Azure, JDK, and Web container selections you have made.

Click **Deploy** to publish your web app to Azure.

When the publishing completes, click the **Published** link in the **Azure Activity Log**:

![Azure Activity Log](./media/app-service-web-get-started-java/aal.png)

Congratulations! You have successfully deployed your web app to Azure! 

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-1.png)

## Updating your web app

Change the sample JSP code to a different message.

```jsp
<body>
<h1><% out.println("Hello again Azure!"); %></h1>
</body>
```

Save your changes.

Right-click the project, and then select **Project Explorer > Azure > Publish as Azure Web App**.

The **Deploy Web App** dialog is displayed showing the app service you previously created. 

> [!NOTE]
>
> Check **Deploy to root** each time you publish your changes.
>

Select your app service and click **Deploy**, which publishes your changes.

When the **Publishing** link appears, click it to browse to your web app and see the changes.

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-2.png)

## Manage your Azure web app

Sign in to Azure portal with the following link: [https://portal.azure.com](https://portal.azure.com).

From the left menu, select **Resource Groups**.
![Portal navigation to Resource Groups](media/app-service-web-get-started-java/rg.png)

Select your resource group. The page shows the resources you created in this tutorial.

![Resource Group myResourceGroup](media/app-service-web-get-started-java/rg2.png)

Select your App Service (**webapp-170602193915** in the preceding image).

The **Overview** page is displayed. This page gives you a view of how your app is doing. Here, you can  perform basic management tasks like browse, stop, start, restart, and delete. The tabs on the left side of the page show the different configurations you can open. 

![App Service blade in Azure portal](media/app-service-web-get-started-java/web-app-blade.png)

The tabs expose the features you can add to your web app, such as:

- Map a custom DNS name
- Bind a custom SSL certificate
- Configure continuous deployment
- Scale up and out
- Add user authentication

### Clean up Resources
 
* From the left menu, select **Resource Groups**, and then select your resource group.
* Select **Delete**, which deletes all the resources you created in the tutorial.

## Next Steps

For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse (This Article)](../azure-toolkit-for-eclipse.md)
  * [What's New in the Azure Toolkit for Eclipse](../azure-toolkit-for-eclipse-whats-new.md)
  * [Installing the Azure Toolkit for Eclipse](../azure-toolkit-for-eclipse-installation.md)
  * [Sign In Instructions for the Azure Toolkit for Eclipse](https://go.microsoft.com/fwlink/?linkid=846174)
* [Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij.md)
  * [What's New in the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-whats-new.md)
  * [Installing the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-installation.md)
  * [Sign In Instructions for the Azure Toolkit for IntelliJ](https://go.microsoft.com/fwlink/?linkid=846179)

Detailed instructions about **Interactive** and **Automated** sign-ins are available in the [Azure Sign In Instructions for the Azure Toolkit for Eclipse](https://go.microsoft.com/fwlink/?linkid=846174) article.

For more information about using Azure with Java, see the [Azure Java Developer Center](https://azure.microsoft.com/develop/java/) and the [Java Tools for Visual Studio Team Services](https://java.visualstudio.com/).
