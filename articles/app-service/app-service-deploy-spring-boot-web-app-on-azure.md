---
title: Deploy a Spring Boot Application to the Azure App Service | Microsoft Docs
description: This tutorial will guide developers through the steps to deploy the Spring Boot Getting Started web app to Azure App Service.
services: app-service\web
documentationcenter: java
author: rmcmurray
manager: erikre
editor: ''

ms.assetid: 
ms.service: multiple
ms.workload: na
ms.tgt_pltfrm: multiple
ms.devlang: Java
ms.topic: article
ms.date: 05/20/2017
ms.author: asirveda;robmcm

---

# Deploy a Spring Boot Application to the Azure App Service

The **[Spring Framework]** is an open-source solution which helps Java developers create enterprise-level applications, and one of the more-popular projects which is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications.

This tutorial will walk you though creating the sample Spring Boot Getting Started web app and deploying it to [Azure App Service].

### Prerequisites

In order to complete the steps in this tutorial, you need to have the following:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* An up-to-date [Java Developer Kit (JDK)].
* Apache's [Maven] build tool (Version 3).
* A [Git] client.

## Create the Spring Boot Getting Started web app

The following steps will walk you through the steps that are required to create a simple Spring Boot web application and test it locally.

1. Open a command-prompt and create a local directory to hold your application, and change to that directory; for example:
   ```
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot Getting Started] sample project into the directory you just created; for example:
   ```
   git clone https://github.com/spring-guides/gs-spring-boot.git
   ```

1. Change directory to the completed project; for example:
   ```
   cd gs-spring-boot
   cd complete
   ```

1. Build the JAR file using Maven; for example:
   ```
   mvn package
   ```

1. Once the web app has been created, change directory to the JAR file and start the web app; for example:
   ```
   cd target
   java -jar gs-spring-boot-0.1.0.jar
   ```

1. Test the web app by browsing to http://localhost:8080 using a web browser, or use the syntax like the following example if you have curl available:
   ```
   curl http://localhost:8080
   ```

1. You should see the following message displayed: **Greetings from Spring Boot!**

   ![Browse Sample App][SB01]

## Create an Azure web app for use with Java

The following steps will walk you through the steps to create an Azure Web App, configure the required settings for Java, and configure your FTP credentials.

1. Browse to the [Azure portal] and log in.

1. Once you have logged into your account on the Azure portal, click the menu icon for **App Services**:
   
   ![Azure portal][AZ01]

1. When the **App Services** page is displayed, click **+ Add** to create a new App Service.

   ![Create App Service][AZ02]

1. When the list of web app templates is displayed, click the link for the basic Microsoft Web App.

   ![Web App Templates][AZ03]

1. When the information page for the Web App template is displayed, click **Create**.

   ![Create Web App][AZ04]

1. Provide a unique name for your web app and specify any additional settings, and then **Create**.

   ![Create Web App Settings][AZ05]

1. Once your web app has been created, click the menu icon for **App Services**, and then click your newly-created web app:

   ![List Web Apps][AZ06]

1. When your web app is displayed, specify the Java version by using the following steps:

   a. Click the **Application Settings** menu item.

   b. Choose **Java 8** for the Java version.

   c. Choose **Newest** for the minor Java version.

   d. Choose **Newest Tomcat 8.5** for the web container. (This container will not actually be used; Azure will use the container from your Spring Boot application.)

   e. Click **Save**.

   ![Application Settings][AZ07]

1. Specify your FTP deployment credentials by using the following steps:

   a. Click the **Deployment Credentials** menu item.

   b. Specify your username and password.

   c. Click **Save**.

   ![Specify Deployment Credentials][AZ08]

1. Retrieve your FTP connection information by using the following steps:

   a. Click the **Deployment Credentials** menu item.

   b. Copy your full FTP username and URL and save them for the next section of this tutorial.

   ![FTP URL and Credentials][AZ09]

## Deploy your Spring Boot web app to Azure

The following steps will walk you through the steps to deploy your Spring Boot web app to Azure.

1. Open a text editor such as Windows Notepad and paste the following text into a new document, then save the file as *web.config*:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <configuration>
     <system.webServer>
       <handlers>
         <add name="httpPlatformHandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified" />
       </handlers>
       <httpPlatform processPath="%JAVA_HOME%\bin\java.exe"
           arguments="-Djava.net.preferIPv4Stack=true -Dserver.port=%HTTP_PLATFORM_PORT% -jar &quot;%HOME%\site\wwwroot\gs-spring-boot-0.1.0.jar&quot;">
       </httpPlatform>
     </system.webServer>
   </configuration>
   ```

1. After you have saved the *web.config* file to your system, connect to your web app via FTP using the URL, username, and password from the preceding section of this tutorial. For example:
   ```
   ftp
   open waws-prod-sn0-000.ftp.azurewebsites.windows.net
   user wingtiptoys-springboot\wingtiptoysuser
   pass ********
   ```

1. Change the remote directory to the root folder of your web app, (which is at */site/wwwroot*), then copy the JAR file from your Spring Boot application and the *web.config* from earlier. For example:
   ```
   cd site/wwwroot
   put gs-spring-boot-0.1.0.jar
   put web.config
   ```

1. After you have deployed your JAR and *web.config* files to your web app, you need to restart your web app using the Azure portal:

   ![][AZ10]

1. Test the web app by browsing to your web app's URL using a web browser, or use the syntax like the following example if you have curl available:
   ```
   curl http://wingtiptoys-springboot.azurewebsites.net/
   ```

1. You should see the following message displayed: **Greetings from Spring Boot!**

   ![Browse Sample App][SB02]

## Next Steps

For more information about using Spring Boot applications on Azure, see the following articles:

* [Running a Spring Boot Application on Linux in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-linux.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-kubernetes.md)

## Additional Resources

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For additional information about depoying web apps to Azure using FTP, see [Deploy your app to Azure App Service using FTP/S].

For further details about the Spring Boot sample project, see [Spring Boot Getting Started].

For help with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.

For more information about configuring additional settings for your web app, see [Configure web apps in Azure App Service].

<!-- URL List -->

[Azure App Service]: https://azure.microsoft.com/services/app-service/
[Azure Container Service]: https://azure.microsoft.com/services/container-service/
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[Configure web apps in Azure App Service]: /azure/app-service-web/web-sites-configure
[Deploy your app to Azure App Service using FTP/S]: https://docs.microsoft.com/azure/app-service-web/app-service-deploy-ftp
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot Getting Started]: https://github.com/spring-guides/gs-spring-boot
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[SB01]: ./media/app-service-deploy-spring-boot-web-app-on-azure/SB01.png
[SB02]: ./media/app-service-deploy-spring-boot-web-app-on-azure/SB02.png

[AZ01]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ01.png
[AZ02]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ02.png
[AZ03]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ03.png
[AZ04]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ04.png
[AZ05]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ05.png
[AZ06]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ06.png
[AZ07]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ07.png
[AZ08]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ08.png
[AZ09]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ09.png
[AZ10]: ./media/app-service-deploy-spring-boot-web-app-on-azure/AZ10.png
