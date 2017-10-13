---
title: How to use the Maven Plugin for Azure Web Apps to deploy a containerized Spring Boot app to Azure
description: Learn how to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app to Azure.
services: app-service\web
documentationcenter: java
author: rmcmurray
manager: cfowler
editor: ''

ms.assetid:
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: java
ms.topic: article
ms.date: 08/07/2017
ms.author: robmcm;kevinzha
---

# How to use the Maven Plugin for Azure Web Apps to deploy a containerized Spring Boot app to Azure

The [Maven Plugin for Azure Web Apps](https://github.com/Microsoft/azure-maven-plugins/tree/master/azure-webapp-maven-plugin) for [Apache Maven](http://maven.apache.org/) provides seamless integration of Azure App Service  into Maven projects, and streamlines the process for developers to deploy web apps to Azure App Service .

This article demonstrates using the Maven Plugin for Azure Web Apps to deploy a sample Spring Boot application in a Docker container to Azure App Services.

> [!NOTE]
>
> The Maven Plugin for Azure Web Apps is currently available as a preview. For now, only FTP publishing is supported, although additional features are planned for the future.
>

## Prerequisites

In order to complete the steps in this tutorial, you need to have the following prerequisites:

* An Azure subscription; if you don't already have an Azure subscription, you can activate your [MSDN subscriber benefits] or sign up for a [free Azure account].
* The [Azure Command-Line Interface (CLI)].
* An up-to-date [Java Development Kit (JDK)], version 1.7 or later.
* Apache's [Maven] build tool (Version 3).
* A [Git] client.
* A [Docker] client.

> [!NOTE]
>
> Due to the virtualization requirements of this tutorial, you cannot follow the steps in this article on a virtual machine; you must use a physical computer with virtualization features enabled.
>

## Clone the sample Spring Boot on Docker web app

In this section, you clone a containerized Spring Boot application and test it locally.

1. Open a command prompt or terminal window and create a local directory to hold your Spring Boot application, and change to that directory; for example:
   ```shell
   md C:\SpringBoot
   cd C:\SpringBoot
   ```
   -- or --
   ```shell
   md /users/robert/SpringBoot
   cd /users/robert/SpringBoot
   ```

1. Clone the [Spring Boot on Docker Getting Started] sample project into the directory you created; for example:
   ```shell
   git clone https://github.com/microsoft/gs-spring-boot-docker
   ```

1. Change directory to the completed project; for example:
   ```shell
   cd gs-spring-boot-docker/complete
   ```

1. Build the JAR file using Maven; for example:
   ```shell
   mvn clean package
   ```

1. When the web app has been created, start the web app using Maven; for example:
   ```shell
   mvn spring-boot:run
   ```

1. Test the web app by browsing to it locally using a web browser. For example, you could use the following command if you have curl available:
   ```shell
   curl http://localhost:8080
   ```

1. You should see the following message displayed: **Hello Docker World**

## Create an Azure service principal

In this section, you create an Azure service principal that the Maven plugin uses when deploying your container to Azure.

1. Open a command prompt.

1. Sign into your Azure account by using the Azure CLI:
   ```shell
   az login
   ```
   Follow the instructions to complete the sign-in process.

1. Create an Azure service principal:
   ```shell
   az ad sp create-for-rbac --name "uuuuuuuu" --password "pppppppp"
   ```
   Where `uuuuuuuu` is the user name and `pppppppp` is the password for the service principal.

1. Azure responds with JSON that resembles the following example:
   ```json
   {
      "appId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "displayName": "uuuuuuuu",
      "name": "http://uuuuuuuu",
      "password": "pppppppp",
      "tenant": "tttttttt-tttt-tttt-tttt-tttttttttttt"
   }
   ```

   > [!NOTE]
   >
   > You will use the values from this JSON response when you configure the Maven plugin to deploy your container to Azure. The `aaaaaaaa`, `uuuuuuuu`, `pppppppp`, and `tttttttt` are placeholder values, which are used in this example to make it easier to map these values to their respective elements when you configure your Maven `settings.xml` file in the next section.
   >
   >

## Configure Maven to use your Azure service principal

In this section, you use the values from your Azure service principal to configure the authentication that Maven will use when deploying your container to Azure.

1. Open your Maven `settings.xml` file in a text editor; this file might be in a path like the following examples:
   * `/etc/maven/settings.xml`
   * `%ProgramFiles%\apache-maven\3.5.0\conf\settings.xml`
   * `$HOME/.m2/settings.xml`

1. Add your Azure service principal settings from the previous section of this tutorial to the `<servers>` collection in the *settings.xml* file; for example:

   ```xml
   <servers>
      <server>
        <id>azure-auth</id>
         <configuration>
            <client>aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa</client>
            <tenant>tttttttt-tttt-tttt-tttt-tttttttttttt</tenant>
            <key>pppppppp</key>
            <environment>AZURE</environment>
         </configuration>
      </server>
   </servers>
   ```
   Where:
   Element | Description
   ---|---|---
   `<id>` | Specifies a unique name which Maven uses to look up your security settings when you deploy your web app to Azure.
   `<client>` | Contains the `appId` value from your service principal.
   `<tenant>` | Contains the `tenant` value from your service principal.
   `<key>` | Contains the `password` value from your service principal.
   `<environment>` | Defines the target Azure cloud environment, which is `AZURE` in this example. (A full list of environments is available in the [Maven Plugin for Azure Web Apps] documentation)

1. Save and close the *settings.xml* file.

## OPTIONAL: Deploy your local Docker file to Docker Hub

If you have a Docker account, you can build your Docker container image locally and push it to Docker Hub. To do so, use the following steps.

1. Open the `pom.xml` file for your Spring Boot application in a text editor.

1. Locate the `<imageName>` child element of the `<containerSettings>` element.

1. Update the `${docker.image.prefix}` value with your Docker account name:
   ```xml
   <containerSettings>
      <imageName>mydockeraccountname/${project.artifactId}</imageName>
   </containerSettings>
   ```

1. Choose one of the following deployment methods:

   * Build your container image locally with Maven, and then use Docker to push your container to Docker Hub:
      ```shell
      mvn clean package docker:build
      docker push
      ```
   
   * If you have the [Docker plugin for Maven] installed, you can automatically build and your container image to Docker Hub by using the `-DpushImage` parameter:
      ```shell
      mvn clean package docker:build -DpushImage
      ```

## OPTIONAL: Customize your pom.xml before deploying your container to Azure

Open the `pom.xml` file for your Spring Boot application in a text editor, and then locate the `<plugin>` element for `azure-webapp-maven-plugin`. This element should resemble the following example:

   ```xml
   <plugin>
      <groupId>com.microsoft.azure</groupId>
      <artifactId>azure-webapp-maven-plugin</artifactId>
      <version>0.1.3</version>
      <configuration>
         <authentication>
            <serverId>azure-auth</serverId>
         </authentication>
         <resourceGroup>maven-plugin</resourceGroup>
         <appName>maven-linux-app-${maven.build.timestamp}</appName>
         <region>westus</region>
         <containerSettings>
            <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
         </containerSettings>
         <appSettings>
            <property>
               <name>PORT</name>
               <value>8080</value>
            </property>
         </appSettings>
      </configuration>
   </plugin>
   ```

There are several values that you can modify for the Maven plugin, and a detailed description for each of these elements is available in the [Maven Plugin for Azure Web Apps] documentation. That being said, there are several values that are worth highlighting in this article:

Element | Description
---|---|---
`<version>` | Specifies the version of the [Maven Plugin for Azure Web Apps]. You should check the version listed in the [Maven Central Respository](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-webapp-maven-plugin%22) to ensure that you are using the latest version.
`<authentication>` | Specifies the authentication information for Azure, which in this example contains a `<serverId>` element that contains `azure-auth`; Maven uses that value to look up the Azure service principal values in your Maven *settings.xml* file, which you defined in an earlier section of this article.
`<resourceGroup>` | Specifies the target resource group, which is `maven-plugin` in this example. The resource group will be created during deployment if it does not already exist.
`<appName>` | Specifies the target name for your web app. In this example, the target name is `maven-linux-app-${maven.build.timestamp}`, where the `${maven.build.timestamp}` suffix is appended in this example to avoid conflict. (The timestamp is optional; you can specify any unique string for the app name.)
`<region>` | Specifies the target region, which in this example is `westus`. (A full list is in the [Maven Plugin for Azure Web Apps] documentation.)
`<appSettings>` | Specifies any unique settings for Maven to use when deploying your web app to Azure. In this example, a `<property>` element contains a name/value pair of child elements that specify the port for your app.

> [!NOTE]
>
> The settings to change the port number in this example are only necessary when you are changing the port from the default.
>

## Build and deploy your container to Azure

Once you have configured all of the settings in the preceding sections of this article, you are ready to deploy your container to Azure. To do so, use the following steps:

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the *pom.xml* file; for example:
   ```shell
   mvn clean package
   ```

1. Deploy your web app to Azure by using Maven; for example:
   ```shell
   mvn azure-webapp:deploy
   ```

Maven will deploy your web app to Azure; if the web app does not already exist, it will be created.

> [!NOTE]
>
> If the region which you specify in the `<region>` element of your *pom.xml* file does not have enough servers available when you start your deployment, you might see an error similar to the following example:
>
> ```
> [INFO] Start deploying to Web App maven-linux-app-20170804...
> [INFO] ------------------------------------------------------------------------
> [INFO] BUILD FAILURE
> [INFO] ------------------------------------------------------------------------
> [INFO] Total time: 31.059 s
> [INFO] Finished at: 2017-08-04T12:15:47-07:00
> [INFO] Final Memory: 51M/279M
> [INFO] ------------------------------------------------------------------------
> [ERROR] Failed to execute goal com.microsoft.azure:azure-webapp-maven-plugin:0.1.3:deploy (default-cli) on project gs-spring-boot-docker: null: MojoExecutionException: CloudException: OnError while emitting onNext value: retrofit2.Response.class
> ```
>
> If this happens, you can specify another region and re-run the Maven command to deploy your application.
>
>

When your web has been deployed, you will be able to manage it by using the [Azure portal].

* Your web app will be listed in **App Services**:

   ![Web app listed in Azure portal App Services][AP01]

* And the URL for your web app will be listed in the **Overview** for your web app:

   ![Determining the URL for your web app][AP02]

<!--
##  OPTIONAL: Configure the embedded Tomcat server to run on a different port

The embedded Tomcat server in the sample Spring Boot application is configured to run on port 8080 by default. However, if you want to run the embedded Tomcat server to run on a different port, such as port 80 for local testing, you can configure the port by using the following steps.

1. Go to the *resources* directory (or create the directory if it does not exist); for example:
   ```shell
   cd src/main/resources
   ```

1. Open the *application.yml* file in a text editor if it exists, or create a new YAML file if it does not exist.

1. Modify the **server** setting so that the server runs on port 80; for example:
   ```yaml
   server:
      port: 80
   ```

1. Save and close the *application.yml* file.
-->

## Next steps

For more information about the various technologies discussed in this article, see the following articles:

* [Maven Plugin for Azure Web Apps]

* [Log in to Azure from the Azure CLI](/azure/xplat-cli-connect)

* [How to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app to Azure App Service ](../app-service-web-deploy-spring-boot-app-with-maven-plugin.md)

* [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli)

* [Maven Settings Reference](https://maven.apache.org/settings.html)

* [Docker plugin for Maven]

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[Docker]: https://www.docker.com/
[Docker plugin for Maven]: https://github.com/spotify/docker-maven-plugin
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot on Docker Getting Started]: https://github.com/spring-guides/gs-spring-boot-docker
[Spring Framework]: https://spring.io/
[Maven Plugin for Azure Web Apps]: https://github.com/Microsoft/azure-maven-plugins/tree/master/azure-webapp-maven-plugin

<!-- IMG List -->

[AP01]: ./media/app-service-web-deploy-containerized-spring-boot-app-with-maven-plugin/AP01.png
[AP02]: ./media/app-service-web-deploy-containerized-spring-boot-app-with-maven-plugin/AP02.png
