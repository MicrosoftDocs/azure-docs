---
title: Deploy a Spring Boot Web App on Linux in Azure Container Service | Microsoft Docs
description: This tutorial walks you though the steps to deploy a Spring Boot application as a Linux web app on Microsoft Azure.
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
ms.author: asirveda;robmcm

---

# Deploy a Spring Boot application on Linux in the Azure Container Service

The **[Spring Framework]** is an open-source solution which helps Java developers create enterprise-level applications. One of the more-popular projects which is built on top of that platform is [Spring Boot], which provides a simplified approach for creating stand-alone Java applications.

**[Docker]** is open-source solutions which helps developers automate the deployment, scaling, and management of their applications which are running in containers.

This tutorial walks you through using Docker to develop and deploy a Spring Boot application to a Linux host in the [Azure Container Service (ACS)].

## Prerequisites

In order to complete the steps in this tutorial, you need to have the following:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* An up-to-date [Java Developer Kit (JDK)].
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.
>

## Create the Spring Boot on Docker Getting Started web app

The following steps walk you through the steps that are required to create a simple Spring Boot web application and test it locally.

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

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you created; for example:
   ```
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

1. Change directory to the completed project; for example:
   ```
   cd gs-spring-boot-docker/complete
   ```

1. Optional Step: If you want to run the embedded Tomcat server to run on port 80 instead of the default port of 8080, (for example if you are going to be testing your Spring Boot project locally), you can configure the port by using the following steps:

   a. Change directory to the resources directory; for example:
   ```
   cd src/main/resources
   ```

   b. Open the *application.yml* file in a text editor.

   c. Modify the **server:** setting so that the server will run on port 80; for example:
   ```
   server:
      port: 80
   ```

   d. Save and close the *application.yml* file.

   e. Change directory back to the root folder for the completed project; for example:
   ```
   cd ../../..
   ```

1. Build the JAR file using Maven; for example:
   ```
   mvn package
   ```

1. Once the web app has been created, change directory to the `target` directory where the JAR file is located and start the web app; for example:
   ```
   cd target
   java -jar gs-spring-boot-docker-0.1.0.jar
   ```

1. Test the web app by browsing to it locally using a web browser. For example, if you have curl available and you configured the Tomcat server to run on port 80:
   ```
   curl http://localhost
   ```

1. You should see the following message displayed: **Hello Docker World!**

   ![Browse Sample App Locally][SB01]

## Create an Azure Container Registry to use as a Private Docker Registry

The following steps walk you through using the Azure portal to create an Azure Container Registry.

> [!NOTE]
>
> If you want to use the Azure CLI instead of the Azure portal, follow the steps in [Create a private Docker container registry using the Azure CLI 2.0](../container-registry/container-registry-get-started-azure-cli.md).
>

1. Browse to the [Azure portal] and log in.

   Once you have logged into your account on the Azure portal, you can follow the steps in the [Create a private Docker container registry using the Azure portal] article, which are paraphrased in the following steps for the sake of expediency.

1. Click the menu icon for **+ New**, then click **Containers**, and then click **Azure Container Registry**.
   
   ![Create a new Azure Container Registry][AR01]

1. When the information page for the Azure Container Registry template is displayed, click **Create**. 

   ![Create a new Azure Container Registry][AR02]

1. When the **Create container registry** blade is displayed, enter your **Registry name** and **Resource group**, choose **Enable** for the **Admin user**, and then click **Create**.

   ![Configure Azure Container Registry settings][AR03]

1. Once your container registry has been created, navigate to your container registry in the Azure portal, and then click **Access Keys**. Take note of the username and password for the next steps.

   ![Azure Container Registry access keys][AR04]

## Configure Maven to use your Azure Container Registry access keys

1. Navigate to the configuration directory for your Maven installation and open the *settings.xml* file with a text editor.

1. Add your Azure Container Registry access settings from the previous section of this tutorial to the `<servers>` collection in the *settings.xml* file; for example:

   ```xml
   <servers>
      <server>
         <id>wingtiptoysregistry</id>
         <username>wingtiptoysregistry</username>
         <password>AbCdEfGhIjKlMnOpQrStUvWxYz</password>
      </server>
   </servers>
   ```

1. Navigate to the completed project directory for your Spring Boot application, (e.g. "*C:\SpringBoot\gs-spring-boot-docker\complete*" or "*/users/robert/SpringBoot/gs-spring-boot-docker/complete*"), and open the *pom.xml* file with a text editor.

1. Update the `<properties>` collection in the *pom.xml* file with the login server value for your Azure Container Registry from the previous section of this tutorial; for example:

   ```xml
   <properties>
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the *pom.xml* file so that the `<plugin>` contains the login server address and registry name for your Azure Container Registry from the previous section of this tutorial. For example:

   ```xml
   <plugin>
      <groupId>com.spotify</groupId>
      <artifactId>docker-maven-plugin</artifactId>
      <version>0.4.11</version>
      <configuration>
         <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
         <dockerDirectory>src/main/docker</dockerDirectory>
         <resources>
            <resource>
               <targetPath>/</targetPath>
               <directory>${project.build.directory}</directory>
               <include>${project.build.finalName}.jar</include>
            </resource>
         </resources>
         <serverId>wingtiptoysregistry</serverId>
         <registryUrl>https://wingtiptoysregistry.azurecr.io</registryUrl>
      </configuration>
   </plugin>
   ```

1. Navigate to the completed project directory for your Spring Boot application and run the following command to rebuild the application and push the container to your Azure Container Registry:

   ```
   mvn package docker:build -DpushImage 
   ```

> [!NOTE]
>
> When you are pushing your Docker container to Azure, you may receive an error message that is similar to one of the following even though your Docker container was created successfully:
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: no basic auth credentials`
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: Incomplete Docker registry authorization credentials. Please provide all of username, password, and email or none.`
>
> If this happens, you may need to log into Azure from the Docker command line; for example:
>
> `docker login -u wingtiptoysregistry -p "AbCdEfGhIjKlMnOpQrStUvWxYz" wingtiptoysregistry.azurecr.io`
>
> You can then push your container from the command line; for example:
>
> `docker push wingtiptoysregistry.azurecr.io/gs-spring-boot-docker`
>

## Create a web app on Linux on Azure App Service using your container image

1. Browse to the [Azure portal] and log in.

1. Click the menu icon for **+ New**, then click **Web + Mobile**, and then click **Web App on Linux**.
   
   ![Create a new web app in the Azure portal][LX01]

1. When the **Web App on Linux** blade is displayed, enter the following information:

   a. Enter a unique name for the **App name**; for example: "*wingtiptoyslinux*."

   b. Choose your **Subscription** from the drop-down list.

   c. Choose an existing **Resource Group**, or specify a name to create a new resource group.

   d. Click **Configure container** and enter the following information:

      * Choose **Private registry**.

      * **Image and optional tag**: Specify your container name from earlier; for example: "*wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest*"

      * **Server URL**: Specify your registry URL from earlier; for example: "*https://wingtiptoysregistry.azurecr.io*"

      * **Login username** and **Password**: Specify your login credentials from your **Access Keys** which you used in previous steps.
   
   e. Once you have entered all of the above information, click **OK**.

   ![Configure web app settings][LX02]

1. Click **Create**.

> [!NOTE]
>
> Azure will automatically map Internet requests to embedded Tomcat server which is running on the standard ports of 80 or 8080. However, if you configured your embedded Tomcat server to run on a custom port, you will need to add an environment variable to your web app which defines the port for your embedded Tomcat server. To do so, use the following steps:
>
> 1. Browse to the [Azure portal] and log in.
> 
> 2. Click the icon for **App Services**. (See item #1 in the image below.)
>
> 3. Select your web app from the list. (Item #2 in the image below.)
>
> 4. Click **Application Settings**. (Item #3 in the image below.)
>
> 5. In the **App settings** section, add a new environment variable named **PORT** and enter your custom port number for the value. (Item #4 in the image below.)
>
> 6. Click **Save**. (Item #5 in the image below.)
>
> ![Saving a custom port number in the Azure portal][LX03]
>

## Next steps

For more information about using Spring Boot applications on Azure, see the following articles:

* [Deploy a Spring Boot Application to the Azure App Service](../app-service/app-service-deploy-spring-boot-web-app-on-azure.md)

* [Running a Spring Boot Application on a Kubernetes Cluster in the Azure Container Service](../container-service/container-service-deploy-spring-boot-app-on-kubernetes.md)

## Additional resources

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For further details about the Spring Boot on Docker sample project, see [Spring Boot on Docker Getting Started].

For help with getting started with your own Spring Boot applications, see the **Spring Initializr** at https://start.spring.io/.

For more information about getting started with creating a simple Spring Boot application, see the Spring Initializr at https://start.spring.io/.

For additional examples for how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Container Service (ACS)]: https://azure.microsoft.com/services/container-service/
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[Create a private Docker container registry using the Azure portal]: /azure/container-registry/container-registry-get-started-portal
[Using a custom Docker image for Azure Web App on Linux]: /azure/app-service-web/app-service-linux-using-custom-docker-image
[Docker]: https://www.docker.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/

<!-- IMG List -->

[SB01]: ./media/container-service-deploy-spring-boot-app-on-linux/SB01.png
[SB02]: ./media/container-service-deploy-spring-boot-app-on-linux/SB02.png

[AR01]: ./media/container-service-deploy-spring-boot-app-on-linux/AR01.png
[AR02]: ./media/container-service-deploy-spring-boot-app-on-linux/AR02.png
[AR03]: ./media/container-service-deploy-spring-boot-app-on-linux/AR03.png
[AR04]: ./media/container-service-deploy-spring-boot-app-on-linux/AR04.png

[LX01]: ./media/container-service-deploy-spring-boot-app-on-linux/LX01.png
[LX02]: ./media/container-service-deploy-spring-boot-app-on-linux/LX02.png
[LX03]: ./media/container-service-deploy-spring-boot-app-on-linux/LX03.png
