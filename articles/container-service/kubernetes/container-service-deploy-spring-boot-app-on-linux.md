---

title: Deploy a Spring Boot Web App on Linux in Azure Container Service | Microsoft Docs
description: This tutorial walks you through the steps to deploy a Spring Boot application as a Linux web app on Microsoft Azure.
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

# Deploy a Spring Boot application on Linux in Azure Container Service

The **[Spring Framework]** is an open-source solution that helps Java developers create enterprise-level applications. One of the more-popular projects that's built on top of Java is [Spring Boot], which provides a simplified approach for creating standalone Java applications.

**[Docker]** is an open-source solution that helps developers automate the deployment, scaling, and management of applications that are running in containers.

This tutorial walks you through how to use Docker to develop and deploy a Spring Boot application to a Linux host in the [Azure Container Service].

## Prerequisites

To complete the steps in this tutorial, you need the following:

* An Azure subscription. If you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure command-line interface (CLI)].
* An up-to-date [Java Developer Kit (JDK)].
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Because of the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine. Instead you must use a physical computer with virtualization features enabled.
>

## Create the Spring Boot on the Docker Getting Started web app

The following steps help you create a simple Spring Boot web application and test it locally.

1. Open a command prompt. Then create a local directory to hold your application and change to that directory; for example:
   ```
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

2. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you created; for example:
   ```
   git clone https://github.com/spring-guides/gs-spring-boot-docker.git
   ```

3. Change directory to the completed project; for example:
   ```
   cd gs-spring-boot-docker/complete
   ```

4. **Optional step**: If you want to run the embedded Tomcat server on port 80 instead of default 8080 (for example, if you're going to be testing your Spring Boot project locally), configure the port by using the following steps:

   a. Change directory to the resources directory; for example:
   ```
   cd src/main/resources
   ```

   b. Open the **application.yml** file in a text editor.

   c. Modify the **server:** setting so that the server runs on port 80; for example:
   ```
   server:
      port: 80
   ```

   d. Save and close the **application.yml** file.

   e. Change directory back to the root folder for the completed project; for example:
   ```
   cd ../../..
   ```

5. Build the JAR file by using Maven; for example:
   ```
   mvn package
   ```

6. After the web app has been created, go to the `target` directory where the JAR file is located, and then start the web app; for example:
   ```
   cd target
   java -jar gs-spring-boot-docker-0.1.0.jar
   ```

7. Test the web app by browsing to it locally with a web browser. For example, you can use the following command if curl is available and you've configured the Tomcat server to run on port 80:
   ```
   curl http://localhost
   ```

8. You should see the following message displayed: **Hello Docker World!**

   ![Browse sample app locally][SB01]

## Create an Azure container registry to use as a Private Docker registry

The following steps walk you through how to use the Azure portal to create an Azure container registry.

> [!NOTE]
> If you want to use the Azure CLI instead of the Azure portal, follow the steps in [Create a private Docker container registry using the Azure CLI 2.0][1].

1. Sign in to the [Azure portal].

    After you have signed into your account on the Azure portal, follow the steps in the [Create a private Docker container registry using the Azure portal]. The steps from that article are summarized here:

2. Select the menu icon for **+ New**.

3. Select **Containers**, and then select **Azure Container Registry**.

   ![Create a new Azure container registry][AR01]

4. When the information page for the Azure  container registry template is displayed, click **Create**.

   ![Create a new Azure container registry][AR02]

5. When the **Create container registry** blade is displayed:
    a. Enter your **Registry name** and **Resource group**.  
    b. Select **Enable** for the **Admin user**.
    c. Select **Create**.

   ![Configure Azure container registry settings][AR03]

6. After your container registry has been created, go to it in the Azure portal. Then select **Access Keys**. Take note of the user name and password for the next steps.

   ![Azure container registry access keys][AR04]

## Configure Maven to use your Azure Container Registry access keys

1. Go to the configuration directory for your Maven installation. Then open the **settings.xml** file with a text editor.

2. Add your Azure Container Registry access settings from the previous section of this tutorial to the `<servers>` collection in the **settings.xml** file; for example:

   ```xml
   <servers>
      <server>
         <id>wingtiptoysregistry</id>
         <username>wingtiptoysregistry</username>
         <password>AbCdEfGhIjKlMnOpQrStUvWxYz</password>
      </server>
   </servers>
   ```

3. Go to the completed project directory for your Spring Boot application (for example, **C:\SpringBoot\gs-spring-boot-docker\complete** or **/users/robert/SpringBoot/gs-spring-boot-docker/complete**). Then open the **pom.xml** file with a text editor.

1. Update the `<properties>` collection in the **pom.xml** file. Use the login server value for your Azure container registry from the previous section of this tutorial; for example:

   ```xml
   <properties>
      <docker.image.prefix>wingtiptoysregistry.azurecr.io</docker.image.prefix>
      <java.version>1.8</java.version>
   </properties>
   ```

1. Update the `<plugins>` collection in the **pom.xml** file so that the `<plugin>` contains the login server address and registry name for your Azure  container registry from the previous section of this tutorial. For example:

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

1. Go to the completed project directory for your Spring Boot application. Then run the following command to rebuild the application and push the container to your Azure container registry:

   ```
   mvn package docker:build -DpushImage
   ```

> [!NOTE]
>
> When you are pushing your Docker container to Azure, you might receive an error message that is similar to one of the following, even though you created your Docker container successfully:
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: no basic auth credentials`
>
> * `[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.11:build (default-cli) on project gs-spring-boot-docker: Exception caught: Incomplete Docker registry authorization credentials. Please provide all of username, password, and email or none.`
>
> If this happens, you might need to sign in to Azure from the Docker command line; for example:
>
> `docker login -u wingtiptoysregistry -p "AbCdEfGhIjKlMnOpQrStUvWxYz" wingtiptoysregistry.azurecr.io`
>
> You can then push your container from the command line; for example:
>
> `docker push wingtiptoysregistry.azurecr.io/gs-spring-boot-docker`
>

## Create a web app on Linux on Azure App Service by using your container image

1. Sign in to the [Azure portal].

1. Click the menu icon for **+ New**, then click **Web + Mobile**.

2.  Click **Web App on Linux**.

   ![Create a new web app in the Azure portal][LX01]

3. When the **Web App on Linux** blade is displayed, take the following steps:

   a. Enter a unique name for the **App name**; for example: *wingtiptoyslinux*.

   b. Choose your **Subscription** from the drop-down list.

   c. To create a new resource group, choose an existing **Resource Group**, or specify a name.

   d. Click **Configure container**, and then enter the following information:

      * Choose **Private registry**.

      * **Image and optional tag**: Specify your container name from earlier; for example: "*wingtiptoysregistry.azurecr.io/gs-spring-boot-docker:latest*.

      * **Server URL**: Specify your registry URL from earlier; for example: *https://wingtiptoysregistry.azurecr.io*.

      * **Login username** and **Password**: Specify your sign-in credentials from your **Access Keys**, which you used in previous steps.

   e. After you've entered all of the previous information, select **OK**.

   ![Configure web app settings][LX02]

1. Click **Create**.

> [!NOTE]
> Azure automatically maps Internet requests to the embedded Tomcat server that's  running on  standard ports 80 or 8080. However, if you configured your embedded Tomcat server to run on a custom port, you need to add an environment variable to your web app that defines the port for your embedded Tomcat server. To do so, take the following steps:
>
>1. Sign into the [Azure portal].

>2. Select the icon for **App Services**. (See item #1 in the following image.)

>3. Select your web app from the list. (See item #2 in the following image.)

>4. Click **Application Settings**. (See item #3 in the following image.)

>5. In the **App settings** section, add a new environment variable named **PORT**. Then enter your custom port number for the value. (See item #4 in the following image.)

>6. Select **Save**. (See item #5 in the following image.)

> ![Saving a custom port number in the Azure portal][LX03]
>

## Next steps

For more information about using Spring Boot applications on Azure, see the following articles:

- [Deploy a Spring Boot Application to Azure App Service][2]


- [Running a Spring Boot Application on a Kubernetes Cluster in Azure Container Service](container-service-deploy-spring-boot-app-on-kubernetes.md)

## Additional resources

For more information about using Azure with Java, see the [Azure Java Developer Center] and the [Java Tools for Visual Studio Team Services].

For more information about the Spring Boot on Docker sample project, see [Spring Boot on Docker getting started].

For help with getting started with your own Spring Boot applications, see the [Spring Initializr](https://start.spring.io/).

For more information about getting started with creating a simple Spring Boot application, see the [Spring Initializr](https://start.spring.io/).

For additional examples that show how to use custom Docker images with Azure, see [Using a custom Docker image for Azure Web App on Linux].

<!-- URL List -->

[Azure command-line interface (CLI)]: /cli/azure/overview
[Azure Container Service]: https://azure.microsoft.com/services/container-service/
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

<!--Reference links in article-->
[1]: https://docs.microsoft.com/azure/container-registry/container-registry-get-started-azure-cli/
[2]: https://docs.microsoft.com/azure/app-service/app-service-deploy-spring-boot-web-app-on-azure/


---
