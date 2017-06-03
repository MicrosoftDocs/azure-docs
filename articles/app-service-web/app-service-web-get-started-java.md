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

This quickstart helps you a deploy a Java web app to [Azure App Service](../app-service/app-service-value-prop-what-is.md) using the Eclipse IDE for Java EE Devlopers. When you are finished with this tutorial, you'll have a basic Java-based web app running in Azure.

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-1.png)

## Prerequisites

* Install the free [Eclipse IDE for Java EE Devlopers](http://www.eclipse.org/)
* Install the [Azure Toolkit for Eclipse](/azure/azure-toolkit-for-eclipse).See [Installing the Azure Toolkit for Eclipse](/azure/azure-toolkit-for-eclipse-installation).

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Create a Dynamic Web Project in Eclipse

In Eclipse, select **File > New > Dynamic Web Project**.

In the **New Dynamic Web Project** dialog, name the project **MyFirstJavaOnAzureWebApp** and select **Finish**.
   
![Dynamic Web Project dialog](./media/app-service-web-get-started-java/new-dynamic-web-project-dialog-box.png)

### Add a new JSP page

* Expand the **MyFirstJavaOnAzureWebApp** project in the Project Explorer.
* Right-click **WebContent**, and then select ** > New > JSP File**.

![New JSP File Menu](./media/app-service-web-get-started-java/new-jsp-file-menu.png)

* In the **New JSP File** dialog:

  * Name the file **index.jsp**  ( Keep the default name).
  * keep the parent folder as **MyFirstJavaOnAzureWebApp/WebContent**
  * Select **Next**. ---  **Finish**.

![New JSP File dialog](./media/app-service-web-get-started-java/new-jsp-file-dialog-box-page-1.png)

On the second page of the New JSP File dialog, keep the default **New JSP File (html)** template, and then click **Finish**.

![New JSP File dialog](./media/app-service-web-get-started-java/new-jsp-file-dialog-box-page-2.png)

In the *NewFIle.jsp* file, replace the `<body></body>` section with the following code:

```jsp
<body>
<h1><% out.println("Hello Azure!"); %></h1>
</body>
```

Save your changes.

## Publish your web app to Azure

* Right-click your project in the Eclipse **Project Explorer > Azure* > Publish as Azure Web App**.

   ![Publish as Azure Web App Context Menu](./media/app-service-web-get-started-java/publish-as-azure-web-app-context-menu.png)

* In the **Azure Sign In** dialog, keep the **Interactive** option, and then select **Sign in**.
* Follow the sign in instructions.

### The **Deploy Web App** dialog

Once you have been signed into your Azure account, the **Deploy Web App** dialog is displayed.

Click **Create**.

![Deploy Web App dialog](./media/app-service-web-get-started-java/deploy-web-app-dialog-box.png)

### The **Create App Service** dialog

The The **Create App Service** dialog is diplayed with default values. The number **170602185241** shown in the following image will be different in your dialog.

![Create App Service dialog](./media/app-service-web-get-started-java/cas1.png)

In the **Create App Service** dialog:

* Keep the generated name for the web app. This name must be unique across Azure. The name is part of the DNS address for your web app; for example: Entering **MyJavaWebApp**, the DNS is *myjavawebapp.azurewebsites.net*.
* Keep the default web container your web app will use.
* Select an Azure subscription.
* In the **App service plan** tab:

  * Keep the default for **Create new**. This is the name of the App Service Plan.
  * Location: Select **West Europe** or a location near you.
  * Pricing tier: Select free. 

   ![Create App Service dialog](./media/app-service-web-get-started-java/create-app-service-dialog-box.png)

### The Resource group tab

Click the **Resource group** tab. Keep the default generated value for the resource group.

![Create App Service Plan](./media/app-service-web-get-started-java/create-app-service-resource-group.png)

### The JDK tab

Click the **JDK** tab. Keep the default, and then click **Create**.

![Create App Service Plan](./media/app-service-web-get-started-java/create-app-service-specify-jdk.png)

The Azure Toolkit creates your new app service and displays a progress dialog box.

![Create App Service Progress Bar](./media/app-service-web-get-started-java/create-app-service-progress-bar.png)

### The Deploy Web App dialog

In the Deploy Web App dialog, check **Deploy to root*. If you have an app service at *wingtiptoys.azurewebsites.net* and you do not deploy to the root, your web app named **MyFirstJavaOnAzureWebApp** will be deployed to *wingtiptoys.azurewebsites.net/MyFirstJavaOnAzureWebApp*.

![Deploy Web App to Root](./media/app-service-web-get-started-java/deploy-web-app-to-root.png)

The dialog shows the Azure, JDK and Web container selections you have made.

Click **Deploy** to publish your web app to Azure.

When the publishing completes, click the **Published** link in the **Azure Activity Log**:

![Deploy Web App to Azure](./media/app-service-web-get-started-java/deploy-web-app-to-azure.png)

![Azure Activity Log](./media/app-service-web-get-started-java/aal.png)

Congratulations! You have successfully deployed your web app to Azure! You can now view your web app on the Azure website:

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-1.png)

## Updating your web app

Once you have successfully published your web app to Azure, updating your web app is a much simpler process, and the following steps will walk you through the process of publishing changes to your web app.

First, change the sample JSP code from earlier so that the title is replaced by today's date:

```jsp
<%@ page
    language="java"
    contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"
    import="java.text.SimpleDateFormat"
    import="java.util.Date" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<% SimpleDateFormat date = new SimpleDateFormat("yyyy/MM/dd"); %>
<title><% out.println(date.format(new Date())); %></title>
</head>
<body>
<h1><% out.println("Hello Azure!"); %></h1>
</body>
</html>
```

After you have saved your changes, right-click your project in the Eclipse **Project Explorer**, then click **Azure**, and then click **Publish as Azure Web App**.

![Publish Updated Web App](./media/app-service-web-get-started-java/publish-updated-web-app-context-menu.png)

When the **Deploy Web App** dialog is displayed, your app service from earlier will be listed. To update your web app, all that you need to do is highlight your app service and click **Deploy** to publish your changes.

![Deploy Web App to Azure](./media/app-service-web-get-started-java/deploy-web-app-to-azure.png)

> [!NOTE]
>
> If you are deploying your web app to the root of your app service, you will need to recheck **Deploy to root** each time that you publish your changes.
>

After you have published your changes, you will notice that the page title has changed to today's date in your browser.

![Browse to Web App](./media/app-service-web-get-started-java/browse-web-app-2.png)

## Clean up resources

To delete the web app, use the **Azure Explorer** included with the Azure Toolkit. If the **Azure Explorer** view is not already visible in Eclipse, use the following steps to display it:

1. Click **Window**, then click **Show View**, and then click **Other**.

   ![Show View Menu](./media/app-service-web-get-started-java/show-azure-explorer-view-1.png)

2. When the **Show View** dialog appears, select **Azure Explorer** and click **OK**.

   ![Show View dialog](./media/app-service-web-get-started-java/show-azure-explorer-view-2.png)

To delete your web app from the Azure Explorer, you need expand the **Web Apps** node, then right-click your web app and select **Delete**.

![Delete Web App](./media/app-service-web-get-started-java/delete-web-app-context-menu.png)

When prompted to delete your web app, click **OK**.

## Next Steps

Detailed instructions about **Interactive** and **Automated** sign-ins are available in the [Azure Sign In Instructions for the Azure Toolkit for Eclipse](https://go.microsoft.com/fwlink/?linkid=846174) article.

For more information about the Azure Toolkits for Java IDEs, see the following links:

* [Azure Toolkit for Eclipse (This Article)](../azure-toolkit-for-eclipse.md)
  * [What's New in the Azure Toolkit for Eclipse](../azure-toolkit-for-eclipse-whats-new.md)
  * [Installing the Azure Toolkit for Eclipse](../azure-toolkit-for-eclipse-installation.md)
  * [Sign In Instructions for the Azure Toolkit for Eclipse](https://go.microsoft.com/fwlink/?linkid=846174)
* [Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij.md)
  * [What's New in the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-whats-new.md)
  * [Installing the Azure Toolkit for IntelliJ](../azure-toolkit-for-intellij-installation.md)
  * [Sign In Instructions for the Azure Toolkit for IntelliJ](https://go.microsoft.com/fwlink/?linkid=846179)

For more information about using Azure with Java, see the [Azure Java Developer Center](https://azure.microsoft.com/develop/java/) and the [Java Tools for Visual Studio Team Services](https://java.visualstudio.com/).
