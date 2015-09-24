<properties
	pageTitle="Create a Java web app in Azure App Service | Microsoft Azure"
	description="This tutorial shows you how to deploy a Java web app to Azure App Service."
	services="app-service\web"
	documentationCenter="java"
	authors="rmcmurray"
	manager="wpickett"
	editor="jimbe"/>
<tags
	ms.service="app-service-web"
	ms.workload="web"
	ms.tgt_pltfrm="na"
	ms.devlang="Java"
	ms.topic="hero-article"
	ms.date="08/31/2015"
	ms.author="robmcm"/>

# Create a Java web app in Azure App Service

> [AZURE.SELECTOR]
- [.Net](web-sites-dotnet-get-started.md)
- [Node.js](web-sites-nodejs-develop-deploy-mac.md)
- [Java](web-sites-java-get-started.md)
- [PHP - Git](web-sites-php-mysql-deploy-use-git.md)
- [PHP - FTP](web-sites-php-mysql-deploy-use-ftp.md)
- [Python](web-sites-python-ptvs-django-mysql.md)

This tutorial shows how to create a web app on Microsoft Azure by using Java, through either the Azure Marketplace or the configuration UI in the [Web Apps feature in Azure App Service][].

If you don't want to use either of those techniques—for example, if you want to customize your application container—see [Upload a custom Java web app to Azure](web-sites-java-custom-upload.md).

> [AZURE.NOTE] To complete this tutorial, you need a Microsoft Azure account. If you don't have an account, you can [activate your MSDN subscriber benefits][] or [sign up for a free trial][].

If you want to get started with Azure App Service before you sign up for an Azure account, go to [Try App Service][]. There, you can immediately create a short-lived starter web app in App Service—no credit card required, and no commitments.

## Create a Java web app by using the Azure Marketplace

This information shows how to use the Azure Marketplace to select a Java application container, either Apache Tomcat or Jetty, for your web app.

The following shows how a web app that's built via Tomcat from the Azure Marketplace would appear:

<!--todo:![Web app using Apache Tomcat](./media/web-sites-java-get-started/tomcat.png)-->

The following shows how a web app that's built via Jetty from the Azure Marketplace would appear:

<!--todo:![Web app using Jetty](./media/web-sites-java-get-started/jetty.png)-->

1. Sign in to the [Azure portal](http://go.microsoft.com/fwlink/?LinkId=529715).
2. Click **New** in the bottom left of the page.
3. Click the **Web + Mobile** blade.
4. Click **Azure Marketplace** at the bottom of the **Web + Mobile** blade.
5. Click **Web**.
6. The top of the **Web** page contains a search text box. In this text box, type the desired Java application server, such as **Apache Tomcat** or **Jetty**.
4. Click the desired Java application server.
5. Click **Create**.
6. Specify the URL name.
6. Select a region. For example, select **West US**.
7. Click **Create**.

Within a few moments, your web app will be created. To view the web app, within the Azure portal, in the **Web Apps** blade, click the web app, and then click the URL for it.

Now that you've created the web app with an app container, see the **Next steps** section for information about uploading your application to the web app.

## Create a Java web app by using the Azure configuration UI

This information shows how to use the Azure configuration UI to select a Java application container, either Apache Tomcat or Jetty, for your web app.

1. Sign in to the Azure portal.
2. Click **New** in the bottom left of the page.
3. Click the **Web + Mobile** blade.
4. Click **Azure Marketplace** at the bottom of the **Web + Mobile** blade.
5. Click **Web**.
6. Click **Web App**.
7. Click **Create**.
8. Specify the URL name.
9. Select a region. For example, select **West US**.
10. Click **Create**.
11. When the web app has been created, click **All settings**.
12. Click **Application settings**.
13. Click the desired Java version.
14. The options for the web container are displayed, for example, Tomcat and Jetty. Select the desired **Web container**.
15. Click **Save**.

Within a few moments, your web app will become Java-based. To confirm that it is Java-based, click its URL. Note that the page will provide text stating that the new web app is a Java-based web app.

Now that you've created the web app with an app container, see the **Next steps** section for information about uploading your application to the web app.

## Next steps

At this point, you have a Java application server running as your Java web app on Azure. To add in your own application or webpage, see [Add an application or webpage to your Java web app](web-sites-java-add-app.md).

For more information, see the [Java Developer Center](/develop/java/).

## What's changed

* For a guide to the change from Websites to App Service, see [Azure App Service and existing Azure services][].
* For a guide to the change from the old portal to the new portal, see [Reference for navigating the Azure portal][].

<!-- External Links -->
[activate your MSDN subscriber benefits]: http://go.microsoft.com/fwlink/?LinkId=623901
[sign up for a free trial]: http://go.microsoft.com/fwlink/?LinkId=623901
[Web Apps feature in Azure App Service]: http://go.microsoft.com/fwlink/?LinkId=529714
[Try App Service]: http://go.microsoft.com/fwlink/?LinkId=523751
[Azure App Service and existing Azure services]: http://go.microsoft.com/fwlink/?LinkId=529714
[Reference for navigating the Azure portal]: http://go.microsoft.com/fwlink/?LinkId=529715
