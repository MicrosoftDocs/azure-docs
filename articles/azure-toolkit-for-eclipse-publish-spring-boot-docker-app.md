---
title: Publish a Spring Boot app as a Docker container by using the Azure Toolkit for Eclipse | Microsoft Docs
description: Learn how to publish a web app to Microsoft Azure as a Docker container by using the Azure Toolkit for Eclipse.
services: ''
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
ms.date: 06/21/2017
ms.author: robmcm

---

# Publish a Spring Boot app as a Docker container by using the Azure Toolkit for Eclipse

The [Spring Framework] is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that is built on top of that platform is [Spring Boot], which provides a simplified approach for creating standalone Java applications.

[Docker] is an open-source solution that helps developers automate the deployment, scaling, and management of their applications that are running in containers.

This tutorial walks you through the steps to deploy a Spring Boot application as a Docker container to Microsoft Azure by using the Azure Toolkit for Eclipse.

[!INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

## Clone the default Spring Boot Docker repository

### Import the public repository

The following steps walk you through cloning the Spring Boot Docker repository to your local computer by using IntelliJ. If you want to use a command line, see [Deploy a Spring Boot application on Linux in Azure Container Service][Deploy Spring Boot on Linux in ACS].

1. Open Eclipse.

1. Click **File** > **Import**.

   ![File Import menu][CL01]

1. When the **Import** dialog box opens:

   a. Expand **Git**.

   b. Select **Projects from Git**.
   
   c. Click **Next**.

   ![Import dialog box][CL02]

1. On the **Select Repository Source** page:

   a. Select **Clone URI**.
   
   b. Click **Next**.

   ![Select Repository Source page][CL03]

1. On the **Source Git Repository** page:

   a. For **URI**, enter `https://github.com/spring-guides/gs-spring-boot-docker.git`. This step should automatically populate the **Host** and **Repository path** fields with the correct values.
   
   b. The Spring Boot repository is public, so you should not have to enter your Git username and password.
   
   c. Click **Next**.

   ![Source Git Repository page][CL04]

1. On the **Branch Selection** page, click **Next**.

   ![Branch Selection page][CL05]

1. On the **Local Destination** page:

   a. Specify the local folder where you want your local repo.
   
   b. Click **Next**.

   ![Local Destination page][CL06]

1. On the **Select a wizard to use for importing projects** page:

   a. Select **Import as a general project**.
   
   b. Click **Next**.

   !["Select a wizard to use for importing projects" page][CL07]

1. On the **Import Projects** page:

   a. Specify your project name.
   
   b. Click **Finish**.

   ![Import Projects page][CL08]

1. When the repository is cloned successfully, you see all the files listed in Eclipse.

   ![Local repository][CL09]

### Create a Maven project from your local repository

The Spring Boot Docker repository contains a completed Maven project, which you will use for this tutorial. 

1. Click **File** > **Import**.

   ![Import command on the File menu][CL01]

1. When the **Import** dialog box opens:

   a. Expand **Maven**.
   
   b. Select **Existing Maven Projects**.
   
   c. Click **Next**.

   ![Import dialog box][MV01]

1. On the **Maven Projects** page:

   a. For **Root Directory**, specify the **complete** folder in your local repository.
   
   b. Expand the **Advanced** section, and enter a custom name for **Name template**.
   
   c. Select the box for the **pom.xml** file in the project.
   
   d. Click **Finish**.

   ![Maven Projects page][MV02]

1. When the Maven project is opened successfully, you see a second project listed in Eclipse.

   ![Local Maven project][MV03]

## Build your Spring Boot app by using Maven

1. In the Eclipse Project Explorer, select the Maven project.

1. Click **Run** > **Run As** > **Maven build**.

   ![Commands to run as Maven build][BU01]

1. When your application is successfully built, the console window shows the status.

   ![Successful Maven build][BU02]

## Publish your web app to Azure by using a Docker container

1. In the Eclipse Project Explorer, select the Maven project.

1. Click the Azure **Publish** menu, and then click **Publish as Docker Container**.

   ![Publish as Docker Container command][PU01]

1. When the **Deploying Docker Container on Azure** dialog box appears:

   a. Enter a custom Docker image name.
   
   b. For **Artifact to deploy**, specify the path to the **gs-spring-boot-docker-0.1.0.jar** file you just built.

   ![Specify Docker options][PU02]

   Any existing Docker hosts are displayed. 

1. If you choose to deploy to an existing host, you can skip to step 5. Otherwise, use the following steps to create a host:

   a. Click **Add**.

      ![Add a new Docker host][PU03]

   b. When the **Create Docker Host** dialog box appears, you can choose to accept the defaults, or you can specify any custom settings for your new Docker host. (For detailed descriptions of the various settings, see [Publish a web app as a Docker container by using the Azure Toolkit for IntelliJ][Publish Container with Azure Toolkit].) Click **Next** when you have specified which settings to use.

      ![Specify Docker host options][PU04]

   c. You can choose to use existing login credentials from an Azure key vault, or you can choose to enter new Docker login credentials. Click **Finish** when you have specified your options.

      ![Specify Docker host credentials][PU05]

1. Select your Docker host, and then click **Next**.

   ![Select Docker host to use][PU06]

1. On the last page of the **Deploying Docker Container on Azure** dialog box, specify the following options:

   a. You can choose to specify a custom name for the container that will host your Docker container, or you can accept the default.

   b. Enter the TCP ports for your docker host by using the following syntax: *[external port]*:*[internal port]*. For example, **80:8080** specifies an external port of 80 and the default internal Spring Boot port of 8080.
   
      If you have customized your internal port (for example, by editing the application.yml file), you need to specify the port number for the correct routing to occur in Azure.

   c. After you configure these options, click **Finish**.

   ![Deploy a Docker container on Azure][PU07]

1. When the Azure Toolkit has finished publishing, the Azure Activity Log displays **Published** for the status.

   ![Successfully deployed Docker host][PU08]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

<!-- URL List -->

[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Deploy Spring Boot on Linux in ACS]:container-service/kubernetes/container-service-deploy-spring-boot-app-on-linux.md
[Docker]: https://www.docker.com/
[Publish Container with Azure Toolkit]: ./azure-toolkit-for-intellij-publish-as-docker-container.md
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[CL01]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL01.png
[CL02]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL02.png
[CL03]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL03.png
[CL04]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL04.png
[CL05]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL05.png
[CL06]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL06.png
[CL07]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL07.png
[CL08]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL08.png
[CL09]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/CL09.png

[MV01]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/MV01.png
[MV02]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/MV02.png
[MV03]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/MV03.png

[BU01]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/BU01.png
[BU02]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/BU02.png

[PU01]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU01.png
[PU02]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU02.png
[PU03]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU03.png
[PU04]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU04.png
[PU05]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU05.png
[PU06]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU06.png
[PU07]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU07.png
[PU08]: ./media/azure-toolkit-for-eclipse-publish-spring-boot-docker-app/PU08.png
