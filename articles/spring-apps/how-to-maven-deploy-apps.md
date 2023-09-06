---
title:  "Tutorial: Deploy Spring Boot applications using Maven"
titleSuffix: Azure Spring Apps
description: Use Maven to deploy applications to Azure Spring Apps.
ms.author: jialuogan
author: KarlErickson
ms.service: spring-apps
ms.topic: tutorial
ms.date: 04/07/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022
---

# Deploy Spring Boot applications using Maven

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to use the Azure Spring Apps Maven plugin to configure and deploy applications to Azure Spring Apps.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An already provisioned Azure Spring Apps instance.
* [JDK 8 or JDK 11](/azure/developer/java/fundamentals/java-jdk-install)
* [Apache Maven](https://maven.apache.org/download.cgi)
* [Azure CLI version 2.45.0 or higher](/cli/azure/install-azure-cli) with the Azure Spring Apps extension. You can install the extension by using the following command: `az extension add --name spring`

## Generate a Spring project

To create a Spring project for use in this article, use the following steps:

1. Navigate to [Spring Initializr](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client) to generate a sample project with the recommended dependencies for Azure Spring Apps. This link uses the following URL to provide default settings for you.

   ```url
   https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.7&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client
   ```

   The following image shows the recommended Spring Initializr setup for this sample project.

   :::image type="content" source="media/how-to-maven-deploy-apps/initializr-page.png" alt-text="Screenshot of Spring Initializr.":::

   This example uses Java version 8. If you want to use Java version 11, change the option under **Project Metadata**.

1. Select **Generate** when all the dependencies are set.
1. Download and unpack the package, then create a web controller for a web application. Add the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

   ```java
   package com.example.hellospring;

   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.bind.annotation.RequestMapping;

   @RestController
   public class HelloController {

       @RequestMapping("/")
       public String index() {
           return "Greetings from Azure Spring Apps!";
       }

   }
   ```

## Build the Spring applications locally

To build the project by using Maven, run the following commands:

```azurecli
cd hellospring 
mvn clean package -DskipTests -Denv=cloud
```

Compiling the project takes several minutes. After it's completed, you should have individual JAR files for each service in their respective folders.

## Provision an instance of Azure Spring Apps

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for **Azure Spring Apps**.

1. Select **Azure Spring Apps** from the results.

    :::image type="content" source="media/how-to-maven-deploy-apps/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/how-to-maven-deploy-apps/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

    :::image type="content" source="media/how-to-maven-deploy-apps/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted." lightbox="media/how-to-maven-deploy-apps/spring-apps-start.png":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

    - **Subscription**: Select the subscription you want to be billed for this resource.
    - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this resource group in later steps as **\<resource group name\>**.
    - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - **Location**: Select the region for your service instance.

    :::image type="content" source="media/how-to-maven-deploy-apps/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page." lightbox="media/how-to-maven-deploy-apps/portal-start.png":::

1. Select **Review and create**.


## Generate configurations and deploy to the Azure Spring Apps

To generate configurations and deploy the app, follow these steps:

1. Run the following command from the *hellospring* root folder, which contains the POM file. If you've already signed-in with Azure CLI, the command will automatically pick up the credentials. Otherwise, the command will prompt you with sign-in instructions. For more information, see [Authentication](https://github.com/microsoft/azure-maven-plugins/wiki/Authentication) in the [azure-maven-plugins](https://github.com/microsoft/azure-maven-plugins) repository on GitHub.

   ```azurecli
   mvn com.microsoft.azure:azure-spring-apps-maven-plugin:1.10.0:config
   ```

   You'll be asked to select:

   * **Subscription ID** - the subscription you used to create an Azure Spring Apps instance.
   * **Service instance** - the name of your Azure Spring Apps instance.
   * **App name** - an app name of your choice, or use the default value `artifactId`.
   * **Public endpoint** - *true* to expose the app to public access; otherwise, *false*.

1. Verify that the `appName` element in the POM file has the correct value. The relevant portion of the POM file should look similar to the following example.

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>com.microsoft.azure</groupId>
               <artifactId>azure-spring-apps-maven-plugin</artifactId>
               <version>1.10.0</version>
               <configuration>
                   <subscriptionId>xxxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx</subscriptionId>
                   <clusterName>v-spr-cld</clusterName>
                   <appName>hellospring</appName>
   ```

   The POM file now contains the plugin dependencies and configurations.

1. Deploy the app using the following command.

   ```azurecli
   mvn azure-spring-apps:deploy
   ```

## Verify the services

After deployment has completed, you can access the app at `https://<service instance name>-hellospring.azuremicroservices.io/`.

:::image type="content" source="media/how-to-maven-deploy-apps/access-app-browser.png" alt-text="Screenshot of app in browser.":::

## Clean up resources

If you plan to continue working with the example application, you might want to leave the resources in place. When no longer needed, delete the resource group containing your Azure Spring Apps instance. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

* [Prepare Spring application for Azure Spring Apps](how-to-prepare-app-deployment.md)
* [Learn more about Azure Spring Apps Maven Plugin](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Spring-Cloud)
