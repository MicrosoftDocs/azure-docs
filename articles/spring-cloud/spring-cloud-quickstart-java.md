---
title: "Quickstart - Deploy your first Azure Spring Cloud application"
description: In this quickstart, we deploy a Spring Cloud helloworld application to the Azure Spring Cloud.
author: bmitchell287
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 08/05/2020
ms.author: brendm
ms.custom: devx-track-java, devx-track-azurecli
---

# Quickstart: Deploy your first Azure Spring Cloud application

This quickstart shows you how to deploy an Spring Cloud helloworld application to Azure. Azure Spring Cloud enables you to easily run Spring Cloud based microservice applications on Azure. 

You can find the sample application code used in this tutorial in our [GitHub samples repository](https://github.com/Azure-Samples/PiggyMetrics). When you're finished, the provided sample application will be accessible online and ready to be managed via the Azure portal.

Following this quickstart, you will learn how to:

> [!div class="checklist"]
> * Generate a basic Spring Cloud project
> * Provision a service instance
> * Build and deploy the app with public endpoint
> * Streaming logs in real time

## Prerequisites

>[!Note]
> Azure Spring Cloud is currently offered as a public preview. Public preview offerings allow customers to experiment with new features prior to their official release.  Public preview features and services are not meant for production use.  For more information about support during previews, please review our [FAQ](https://azure.microsoft.com/support/faq/) or file a [Support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request) to learn more.

To complete this quickstart:

1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
4. [Install the Azure CLI version 2.0.67 or higher](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
5. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

## Generate a Spring Cloud helloworld project
>[!TIP]
> To skip the spring boot basics in this section, you can clone our sample repo `git clone https://github.com/yucwan/azure-spring-cloud-helloworld.git` and jump ahead to [Provision a service instance](#provision-a-service-instance) section.

Start with [Spring Initializr](https://start.spring.io/), we generate a sample project with recommended dependencies for Azure Spring Cloud. The following image shows the Initializr set up for this sample project:

  ![Initializr page](media/spring-cloud-quickstart-java/initializr-page.png)

1. Click Generate when all the dependencies are added. Download and unpack the package, then add the following dependency to the application `pom.xml` file.

    ```xml
        <dependency>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>spring-cloud-starter-azure-spring-cloud-client</artifactId>
            <version>2.3.0</version>
        </dependency>
    ```

1. Create a web controller for a simple web application by adding `src/main/java/com/example/springboot/HelloController.java` as following:

    ```java
    package com.example.demo;
    
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
## Provision a service instance

1. Login to the Azure CLI and choose your active subscription. Be sure to choose the active subscription that is whitelisted for Azure Spring Cloud

    ```azurecli
        az login
        az account list -o table
        az account set --subscription <Name or ID of subscription from the last step>
    ```

2. Prepare a name for your Azure Spring Cloud service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.

3. Create a resource group to contain your Azure Spring Cloud service.

    ```azurecli
        az group create --location eastus --name <resource group name>
    ```

    Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).

4. Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud.

    ```azurecli
        az spring-cloud create -n <service instance name> -g <resource group name>
    ```

    The service instance will take around five minutes to deploy.

5. Set your default resource group name and cluster name using the following commands:

    ```azurecli
        az configure --defaults group=<resource group name>
        az configure --defaults spring-cloud=<service instance name>
    ```

## Build and deploy the application
Make sure you are executing the following command at the root of the project.
1. Build the project using Maven for example

    ```console
    mvn clean package -DskipTests
    ```

1. Install the Azure Spring Cloud extension for the Azure CLI using the following command

    ```azurecli
    az extension add --name spring-cloud
    ```
1. Create app with public endpoint assigned

    ```azurecli
    az spring-cloud app create -n demo -s <service instance name> -g <resource group name> --is-public
    ```

1. Deploy the Jar file to the app created  

    ```azurecli
    az spring-cloud app deploy -n demo -s <service instance name> -g <resource group name> --jar-path target\demo-0.0.1-SNAPSHOT.jar
    ```
1. It takes a few minutes to finish deploying the applications. To confirm that they have deployed, go to the **Apps** blade in the Azure portal. You should see status of the application.

## Streaming logs in real time

1. You can use the following command to get real time logs from the App.

    ```azurecli
    az spring-cloud app logs -n demo -s <service instance name> -g <resource group name> -f
    ```
2. For advanced logs analytics features, visit "Logs" tab in the menu on [Azure Portal](https://portal.azure.com/). Be aware that logs here have a latency around a few minutes.

  ![Logs Analytics](media/spring-cloud-quickstart-java/logs-analytics.png)

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Provision a service instance
> * Deploy app

> [!div class="nextstepaction"]
> [Prepare your Azure Spring Cloud application for deployment](spring-cloud-tutorial-prepare-app-deployment.md)

More samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/service-binding-cosmosdb-sql).
