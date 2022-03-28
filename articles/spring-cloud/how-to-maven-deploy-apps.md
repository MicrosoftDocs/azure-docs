---
title:  "Tutorial: Deploy Spring Boot applications using Maven"

description: Use Maven to deploy applications to Azure Spring Cloud.
author: Jialuogan
ms.author: Jialuogan
ms.service: spring-cloud
ms.topic: tutorial
ms.date: 28/03/2022
ms.custom: devx-track-java
---

# Deploy Spring Boot applications using Maven

**This article applies to:** ✔️ Java ❌ C#

The Azure Spring Cloud Maven plugin helps developer configure and deploy microservices applications to Azure Spring Cloud.

## Prerequisites
* [Install JDK 8 or JDK 11](/azure/developer/java/fundamentals/java-jdk-install)
* [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
* [Install Maven](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html). If you use the Azure Cloud Shell, this installation isn't needed.
* (Optional) [Install the Azure CLI version 2.0.67 or higher](/cli/azure/install-azure-cli) and install the Azure Spring Cloud extension with command: `az extension add --name spring-cloud`


## Tutorial procedures

The following procedures deploy a Spring applications to Azure Spring Cloud using Maven.

* Generate a Spring Cloud project
* Build the Spring applications locally
* Generate configurations and deploy to the Azure Spring Cloud
* Verify the services

## Generate a Spring Cloud project

Start with [Spring Initializr](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client) to generate a sample project with recommended dependencies for Azure Spring Cloud. This link uses the following URL to provide default settings for you. 

```url
https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client
```
The following image shows the recommended Initializr set up for this sample project. 

This example uses Java version 8.  If you want to use Java version 11, change the option under **Project Metadata**.

![Initializr page](media/spring-cloud-quickstart-java/initializr-page.png)

1. Select **Generate** when all the dependencies are set. 
1. Download and unpack the package, then create a web controller for a simple web application by adding the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

    ```java
    package com.example.hellospring;

    import org.springframework.web.bind.annotation.RestController;
    import org.springframework.web.bind.annotation.RequestMapping;

    @RestController
    public class HelloController {

        @RequestMapping("/")
        public String index() {
            return "Greetings from Azure Spring Cloud!";
        }

    }
    ```

## Build the Spring applications locally

1. Build the project using Maven:

   ```azurecli
   cd hellospring 
   mvn clean package -DskipTests -Denv=cloud
   ```

Compiling the project takes several minutes. Once completed, you should have individual JAR files for each service in their respective folders.


## Generate configurations and deploy to the Azure Spring Cloud

1. Generate configurations by running the following command in the root folder of Hello Spring containing the POM File. If you have already signed-in with Azure CLI, the command will automatically pick up the credentials. Otherwise, it will sign you in with prompt instructions. For more information, see our [wiki page](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication).

   ```azurecli
   mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:1.7.0:config
   ```

   You will be asked to select:

   * **Subscription Id:** This is your subscription used to create an Azure Spring Cloud instance.
   * **Service Instance:** This is the name of your Azure Spring Cloud instance.
   * **App name:** Provide the app name or accept default as artifactId.
   * **Public endpoint:** Provide whether or not to expose the public access to this app.

1. Verify the `appName` elements in the POM files are correct:

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>com.microsoft.azure</groupId>
               <artifactId>azure-spring-cloud-maven-plugin</artifactId>
               <version>1.7.0</version>
               <configuration>
                   <subscriptionId>xxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx</subscriptionId>
                   <clusterName>v-spr-cld</clusterName>
                   <appName>customers-service</appName>
   ```

   Please make sure `appName` texts match the following, remove any prefix if needed and save the file.

1. The POM now contains the plugin dependencies and configurations. Deploy the apps using the following command.

   ```azurecli
   mvn azure-spring-cloud:deploy
   ```

## Verify the services

Once deployment has completed, you can access the app at `https://<service instance name>-hellospring.azuremicroservices.io/`.

[![Access app from browser](media/spring-cloud-quickstart-java/access-app-browser.png)](media/spring-cloud-quickstart-java/access-app-browser.png#lightbox)

## Next steps

* [Prepare Spring application for Azure Spring Cloud](how-to-prepare-app-deployment.md)
* [Learn more about Azure Spring Cloud Maven Plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Cloud)
