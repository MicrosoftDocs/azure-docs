---
title: How to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app to Azure
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

# How to use the Maven Plugin for Azure Web Apps to deploy a Spring Boot app to Azure

The [Maven Plugin for Azure Web Apps](https://github.com/Microsoft/azure-maven-plugins/tree/master/azure-webapp-maven-plugin) for [Apache Maven](http://maven.apache.org/) provides seamless integration of Azure App Service into Maven projects, and streamlines the process for developers to deploy web apps to Azure App Service.

This article demonstrates using the Maven Plugin for Azure Web Apps to deploy a sample Spring Boot application to Azure App Services.

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

## Clone the sample Spring Boot web app

In this section, you clone a completed Spring Boot application and test it locally.

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

1. Clone the [Spring Boot Getting Started] sample project into the directory you created; for example:
   ```shell
   git clone https://github.com/microsoft/gs-spring-boot
   ```

1. Change directory to the completed project; for example:
   ```shell
   cd gs-spring-boot/complete
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

1. You should see the following message displayed: **Greetings from Spring Boot!**

## Create an Azure service principal

In this section, you create an Azure service principal that the Maven plugin uses when deploying your web app to Azure.

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
   > You will use the values from this JSON response when you configure the Maven plugin to deploy your web app to Azure. The `aaaaaaaa`, `uuuuuuuu`, `pppppppp`, and `tttttttt` are placeholder values, which are used in this example to make it easier to map these values to their respective elements when you configure your Maven `settings.xml` file in the next section.
   >
   >

## Configure Maven to use your Azure service principal

In this section, you use the values from your Azure service principal to configure the authentication that Maven uses when deploying your web app to Azure.

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

## OPTIONAL: Customize your pom.xml before deploying your web app to Azure

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
         <appName>maven-web-app-${maven.build.timestamp}</appName>
         <region>westus</region>
         <javaVersion>1.8</javaVersion>
         <deploymentType>ftp</deploymentType>
         <resources>
            <resource>
               <directory>${project.basedir}/target</directory>
               <targetPath>/</targetPath>
               <includes>
                  <include>*.jar</include>
               </includes>
            </resource>
            <resource>
               <directory>${project.basedir}</directory>
               <targetPath>/</targetPath>
               <includes>
                  <include>web.config</include>
               </includes>
            </resource>
         </resources>
      </configuration>
   </plugin>
   ```

There are several values that you can modify for the Maven plugin, and a detailed description for each of these elements is available in the [Maven Plugin for Azure Web Apps] documentation. That being said, there are several values that are worth highlighting in this article:

Element | Description
---|---|---
`<version>` | Specifies the version of the [Maven Plugin for Azure Web Apps]. You should check the version listed in the [Maven Central Respository](http://search.maven.org/#search%7Cga%7C1%7Ca%3A%22azure-webapp-maven-plugin%22) to ensure that you are using the latest version.
`<authentication>` | Specifies the authentication information for Azure, which in this example contains a `<serverId>` element that contains `azure-auth`; Maven uses that value to look up the Azure service principal values in your Maven *settings.xml* file, which you defined in an earlier section of this article.
`<resourceGroup>` | Specifies the target resource group, which is `maven-plugin` in this example. The resource group is created during deployment if it does not already exist.
`<appName>` | Specifies the target name for your web app. In this example, the target name is `maven-web-app-${maven.build.timestamp}`, where the `${maven.build.timestamp}` suffix is appended in this example to avoid conflict. (The timestamp is optional; you can specify any unique string for the app name.)
`<region>` | Specifies the target region, which in this example is `westus`. (A full list is in the [Maven Plugin for Azure Web Apps] documentation.)
`<javaVersion>` | Specifies the Java runtime version for your web app. (A full list is in the [Maven Plugin for Azure Web Apps] documentation.)
`<deploymentType>` | Specifies deployment type for your web app. For now, only `ftp` is supported, although support for other deployment types is in development.
`<resources>` | Specifies resources and target destinations which Maven uses when deploying your web app to Azure. In this example, two `<resource>` elements specify that Maven will deploy the JAR file for your web app and the *web.config* file from the Spring Boot project.

## Build and deploy your web app to Azure

Once you have configured all of the settings in the preceding sections of this article, you are ready to deploy your web app to Azure. To do so, use the following steps:

1. From the command prompt or terminal window that you were using earlier, rebuild the JAR file using Maven if you made any changes to the *pom.xml* file; for example:
   ```shell
   mvn clean package
   ```

1. Deploy your web app to Azure by using Maven; for example:
   ```shell
   mvn azure-webapp:deploy
   ```

Maven will deploy your web app to Azure; if the web app does not already exist, it will be created.

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

* [How to use the Maven Plugin for Azure Web Apps to deploy a containerized Spring Boot app to Azure](app-service-web-deploy-containerized-spring-boot-app-with-maven-plugin.md)

* [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli)

* [Maven Settings Reference](https://maven.apache.org/settings.html)

<!-- URL List -->

[Azure Command-Line Interface (CLI)]: /cli/azure/overview
[Azure Java Developer Center]: https://azure.microsoft.com/develop/java/
[Azure portal]: https://portal.azure.com/
[free Azure account]: https://azure.microsoft.com/pricing/free-trial/
[Git]: https://github.com/
[Java Developer Kit (JDK)]: http://www.oracle.com/technetwork/java/javase/downloads/
[Java Tools for Visual Studio Team Services]: https://java.visualstudio.com/
[Maven]: http://maven.apache.org/
[MSDN subscriber benefits]: https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/
[Spring Boot]: http://projects.spring.io/spring-boot/
[Spring Boot Getting Started]: https://github.com/microsoft/gs-spring-boot
[Spring Framework]: https://spring.io/
[Maven Plugin for Azure Web Apps]: https://github.com/Microsoft/azure-maven-plugins/tree/master/azure-webapp-maven-plugin

<!-- IMG List -->

[AP01]: ./media/app-service-web-deploy-spring-boot-app-with-maven-plugin/AP01.png
[AP02]: ./media/app-service-web-deploy-spring-boot-app-with-maven-plugin/AP02.png
