---
title: Publish a Spring Boot app as a Docker container using the Azure Toolkit for Eclipse | Microsoft Docs
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

# Publish a Spring Boot app as a Docker container using the Azure Toolkit for Eclipse

The **[Spring Framework]** is an open-source solution which helps Java developers create enterprise-level applications. One of the more-popular projects which is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications.

**[Docker]** is an open-source solution which helps developers automate the deployment, scaling, and management of their applications which are running in containers.

This tutorial will walk you through the steps to deploy a Spring Boot application as a Docker container to Microsoft Azure using the Azure Toolkit for Eclipse.

[!INCLUDE [azure-toolkit-for-eclipse-prerequisites](../includes/azure-toolkit-for-eclipse-prerequisites.md)]

## Cloning the default Spring Boot Docker App repository

### Importing the public repository

The following steps will walk you through cloning the Spring Boot Docker repository to your local computer using IntelliJ. If you want to use a command line, see [Deploy a Spring Boot Application on Linux in the Azure Container Service][Deploy Spring Boot on Linux in ACS].

1. Open Eclipse.

1. Click **File**, then **Import**.

   ![File Import menu][CL01]

1. When the **Import** dialog box opens:

   a. Expand **Git**.

   b. Highlight **Projects from Git**.
   
   c. Click **Next**.

   ![Import dialog box][CL02]

1. On the **Select Repository Source** page:

   a. Highlight **Clone URI**.
   
   b. Click **Next**.

   ![Select Repository Source][CL03]

1. On the **Source Git Repository** page:

   a. Enter `https://github.com/spring-guides/gs-spring-boot-docker.git` for the repo **URI**; this should automatically populate the **Host** and **Repository path** fields with the correct values.
   
   b. The Spring Boot repository is public, so you should not have to enter your Git username and password.
   
   c. Click **Next**.

   ![Source Git Repository][CL04]

1. On the **Branch** page, click **Next**.

   ![Branch][CL05]

1. On the **Local Destination** page:

   a. Specify the local folder where you want your local repo.
   
   b. Click **Next**.

   ![Local Destination][CL06]

1. On the **Select a wizard to use for importing projects** page:

   a. Select **Import as a general project**.
   
   b. Click **Next**.

   ![Local Destination][CL07]

1. On the **Import Projects** page:

   a. Specify your **Project name**.
   
   b. Click **Finish**.

   ![Import Projects][CL08]

1. When the repository has been cloned successfully, you will see all of the files listed in Eclipse.

   ![Local repository][CL09]

### Creating a Maven project from your local repository

The Spring Boot Docker repository contains a completed Maven project which you will use for this tutorial. 

1. Click **File**, then **Import**.

   ![File Import menu][CL01]

1. When the **Import** dialog box opens:

   a. Expand **Maven**.
   
   b. Highlight **Existing Maven Projects**.
   
   c. Click **Next**.

   ![Import dialog box][MV01]

1. On the **Maven Projects** page:

   a. Specify the `complete` folder within your local repository for the **Root Directory**.
   
   b. Expand the **Advanced** section, and enter a custom name for the **Name template**.
   
   c. Check the box for the `pom.xml` file within the project.
   
   d. Click **Finish**.

   ![Maven Projects][MV02]

1. When the Maven project has been opened successfully, you will see a second project listed in Eclipse.

   ![Local Maven project][MV03]

## Building your Spring Boot App with Maven

1. In the Eclipse Project Explorer, highlight the Maven project.

1. Click **Run**, then **Run As**, and then **Maven build**.

   ![Run as Maven build][BU01]

1. When your application has been successfully built, the console window will list the status.

   ![Successful Maven build][BU02]

## Publishing your web app to Azure using a Docker Container

1. In the Eclipse Project Explorer, highlight the Maven project.

1. Click the Azure **Publish** menu, then click **Publish as Docker container**.

   ![Publish as Docker container][PU01]

1. When the **Deploy Docker Container on Azure** dialog box is displayed:

   a. Enter a custom **Docker image name**.
   
   b. For the **Artifact to deploy**, specify the path to the `gs-spring-boot-docker-0.1.0.jar` file you just built.

   ![Specify Docker options][PU02]

   Any existing Docker hosts will be displayed. If you choose to deploy to an existing host, you can skip to step 4. Otherwise, you will need to use the following steps to create a new host:

   a. Click **Add**.

      ![Add new Docker host][PU03]

   b. When the **Create Docker Host** dialog box is displayed, you can choose to accept the defaults, or you can specify any custom settings for your new Docker host. (Detailed descriptions of the various settings are available in the [Publish a web app as a Docker container by using the Azure Toolkit for IntelliJ][Publish Container with Azure Toolkit] article.) Click **Next** when you have specified which settings to use.

      ![Specify Docker host options][PU04]

   c. You can choose to use existing log in credentials from an Azure Key Valut, or you can choose to enter new Docker log in credentials. Click **Finish** when you have specified your options.

      ![Specify Docker host credentials][PU05]

1. Hightlight your Docker host, and then click **Next**.

   ![Select Docker host to use][PU06]

1. On the last page of the **Deploy Docker Container on Azure** dialog box, you will need to specify the following options:

   a. You can choose to specify a custom name for the container which will host your Docker container, or you can accept the default.

   b. You need to enter the TCP ports for your docker host using the following syntax: "*[external port]*:*[internal port]*. For example, "80:8080" will specify an external port of "80" and the default internal Spring Boot port of "8080".
   
      If you have customized your internal port, (e.g. by editing the *application.yml* file), you will need to specify the port number for the correct routing to occur in Azure.

   c. Once you have configured these options, click **Finish**.

   ![Deploy Docker Container on Azure][PU07]

1. When the Azure Toolkit has finished publishing, the Azure Activity Log will display **Published** for the status.

   ![Successfully deployed Docker host][PU08]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

<!-- URL List -->

[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Deploy Spring Boot on Linux in ACS]: ./container-service-deploy-spring-boot-app-on-linux.md
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
