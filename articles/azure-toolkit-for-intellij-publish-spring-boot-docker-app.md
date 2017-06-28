---
title: Publish a Spring Boot app as a Docker container using the Azure Toolkit for IntelliJ | Microsoft Docs
description: Learn how to publish a web app to Microsoft Azure as a Docker container by using the Azure Toolkit for IntelliJ.
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

# Publish a Spring Boot app as a Docker container using the Azure Toolkit for IntelliJ

The **[Spring Framework]** is an open-source solution which helps Java developers create enterprise-level applications. One of the more-popular projects which is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications.

**[Docker]** is an open-source solution which helps developers automate the deployment, scaling, and management of their applications which are running in containers.

This tutorial walks you through the steps to deploy a Spring Boot application as a Docker container to Microsoft Azure using the Azure Toolkit for IntelliJ.

[!INCLUDE [azure-toolkit-for-intellij-prerequisites](../includes/azure-toolkit-for-intellij-prerequisites.md)]

## Cloning the default Spring Boot Docker App repo

The following steps walk you through cloning the Spring Boot Docker repo using IntelliJ. If you want to use a command line, see [Deploy a Spring Boot Application on Linux in the Azure Container Service][Deploy Spring Boot on Linux in ACS].

1. Open IntelliJ.

1. On the welcome screen, choose the **GitHub** option in the **Check out from version control** drop-down menu.

   ![Check out from version control][CL01]

1. Enter your credentials if you are prompted to log in.

   * If you are using a username/password to log into GitHub:

      ![Enter GitHub credentials dialog box][CL02a]

   * If you are using a token to log into GitHub:

      ![Enter GitHub credentials dialog box][CL02b]

1. Enter `https://github.com/spring-guides/gs-spring-boot-docker.git` for the repo URL, specify your local path and folder information, and then click **Clone**.

   ![Clone repository dialog box][CL03]

1. Choose **No** when prompted to create an IntelliJ project.

   ![Create an IntelliJ project][CL04]

1. On the welcome screen, click **Import Project**.

   ![Import Project][CL05]

1. Locate the path where you cloned the Spring Boot repo, highlight the **complete** folder under the root, and then click **OK**.

   ![Import Project][CL06]

1. When prompted, choose **Create project from existing sources**.

   ![Create project from existing sources][CL07]

1. Specify your project name or accept the default, verify the correct path to the **complete**, and then click **Next**.

   ![Specify the project name][CL08]

1. Customize any directories for importing, and then click **Next**.

   ![Choose directories][CL09]

1. Review the libraries to import, and then click **Next**.

   ![Review project libraries][CL10]

1. Review the module structure, and then click **Next**.

   ![Review module structure][CL11]

1. Specify your JDK, and then click **Next**.

   ![Specify JDK][CL12]

1. Click **Finish**.

   ![Finish][CL13]

1. IntelliJ will import the Spring Boot app as a project and display the structure when the import has completed.

   ![Spring Boot app in IntelliJ][CL14]

## Building your Spring Boot App

### Build the app using the Maven POM

1. Open the Maven Tool Window if it is not already opened; to do so, click **View**, then **Tool Windows**, and then **Maven Projects**.

   ![View Maven Tool Window][BU01]

1. In the Maven Tool Window, right-click **package** and choose **Run Maven Build**. (If your Maven project does not show up automatically, you may need to click the **Reimport** icon on the Maven toolbar.)

   ![Run Maven Build][BU02]

1. IntelliJ should display a BUILD SUCCESS message when your Spring Boot app has been successfully created.

   ![Build Success][BU03]

### Create a deployment-ready artifact

In order to publish your Spring Boot App, you will need to create a deployment-ready artifact. To do so, use the following steps:

1. Open your web app project in IntelliJ.

1. Click **File**, and then click **Project Structure**.

   ![Project Structure Menu][ART01]

1. Click the green plus ("**+**") symbol to add an artifact, click **JAR**, and then click **Empty**.

   ![Add Artifact][ART02]

1. Name your artifact while making sure not to add the ".jar" extension, and then specify the target folder for the Maven output.

   ![Specify Artifact Properties][ART03]

1. OPTIONAL: Create a manifest for your artifact:

   a. Click **Create Manifest**.

      ![Specify Artifact Path][ART04a]

   b. Choose the default path for the artifact, and then click **OK**.

      ![Specify Artifact Path][ART04b]

   c. Click the ellipsis **...** to specify the main class.

      ![Locate Main Class][ART04c]

   d. Choose your main class, and then click **OK**.

      ![Specify Main Class][ART04d]

1. Click **OK**.

   ![Close Artifact Properties Dialog Box][ART05]

> [!NOTE]
>
> For more information about creating artifacts in IntelliJ, see [Configuring Artifacts] on the JetBrains website.
>

### Build the artifact for deployment

1. Click **Build**, and then click **Artifacts**.

   ![Build Artifacts Menu][BU04]

1. When the **Build Artifact** context menu appears, click **Build**.

   ![Build Artifact Context Menu][BU05]

1. IntelliJ should display the completed artifact for your Spring Boot app in the Project Tool Window.

   ![Created Artifact][BU06]

## Publishing your web app to Azure using a Docker Container

1. If you have not logged into your Azure account, follow the steps in the [Sign-in instructions for the Azure Toolkit for IntelliJ][Azure Sign In for IntelliJ] article.

1. In the Project Explorer tool window, right-click the project, and then select **Azure** > **Publish as Docker Container**.

   ![Publish as Docker Container][PU01]

1. When the **Deploy Docker Container on Azure** dialog box is displayed, any existing Docker hosts will be displayed. If you choose to deploy to an existing host, you can skip to step 4. Otherwise, you will need to use the following steps to create a new host:

   a. Click the green plus ("**+**") symbol.

      ![Add new Docker host][PU02]

   b. When the **Create Docker Host** dialog box is displayed, you can choose to accept the defaults, or you can specify any custom settings for your new Docker host. (Detailed descriptions of the various settings are available in the [Publish a web app as a Docker container by using the Azure Toolkit for IntelliJ][Publish Container with Azure Toolkit] article.) Click **Next** when you have specified which settings to use.

      ![Specify Docker host options][PU03a]

   c. You can choose to use existing login credentials from an Azure Key Vault, or you can choose to enter new Docker login credentials. Click **Finish** when you have specified your options.

      ![Specify Docker host credentials][PU03b]

1. Highlight your Docker host, and then click **Next**.

   ![Select Docker host to use][PU04]

1. On the last page of the **Deploy Docker Container on Azure** dialog box, you will need to specify the following options:

   a. You can choose to specify a custom name for the container which will host your Docker container, or you can accept the default.

   b. You need to enter the TCP ports for your docker host using the following syntax: "*[external port]*:*[internal port]*. For example, "80:8080" specifies an external port of "80" and the default internal Spring Boot port of "8080".
   
      If you have customized your internal port, (e.g. by editing the *application.yml* file), you will need to specify the port number for the correct routing to occur in Azure.

   c. Once you have configured these options, click **Finish**.

   ![Deploy Docker Container on Azure][PU05]

1. When the Azure Toolkit has finished publishing, the Azure Activity Log will display **Published** for the status.

   ![Successfully deployed Docker host][PU06]

## Next steps

[!INCLUDE [azure-toolkit-additional-resources](../includes/azure-toolkit-additional-resources.md)]

See [Creating Spring Boot Projects](https://www.jetbrains.com/help/idea/creating-spring-boot-projects.html) on the JetBrains website to learn about additional methods for creating Spring Boot apps using IntelliJ.

<!-- URL List -->

[Azure Management Portal]: http://go.microsoft.com/fwlink/?LinkID=512959
[Azure Sign In for IntelliJ]: ./azure-toolkit-for-intellij-sign-in-instructions.md
[Configuring Artifacts]: https://www.jetbrains.com/help/idea/2016.1/configuring-artifacts.html
[Deploy Spring Boot on Linux in ACS]: ./container-service/container-service-deploy-spring-boot-app-on-linux.md
[Docker]: https://www.docker.com/
[Publish Container with Azure Toolkit]: ./azure-toolkit-for-intellij-publish-as-docker-container.md
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[CL01]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL01.png
[CL02a]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL02a.png
[CL02b]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL02b.png
[CL03]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL03.png
[CL04]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL04.png
[CL05]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL05.png
[CL06]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL06.png
[CL07]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL07.png
[CL08]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL08.png
[CL09]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL09.png
[CL10]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL10.png
[CL11]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL11.png
[CL12]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL12.png
[CL13]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL13.png
[CL14]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/CL14.png

[ART01]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART01.png
[ART02]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART02.png
[ART03]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART03.png
[ART04a]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART04a.png
[ART04b]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART04b.png
[ART04c]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART04c.png
[ART04d]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART04d.png
[ART05]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/ART05.png

[BU01]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU01.png
[BU02]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU02.png
[BU03]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU03.png
[BU04]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU04.png
[BU05]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU05.png
[BU06]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/BU06.png

[PU01]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU01.png
[PU02]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU02.png
[PU03a]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU03a.png
[PU03b]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU03b.png
[PU04]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU04.png
[PU05]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU05.png
[PU06]: ./media/azure-toolkit-for-intellij-publish-spring-boot-docker-app/PU06.png
