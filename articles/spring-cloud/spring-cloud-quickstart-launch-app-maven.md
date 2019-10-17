---
title: "Quickstart: Launch an application by using Maven - Azure Spring Cloud"
description: Launch a sample application by using Maven
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/05/2019
ms.author: v-vasuke

---

# Quickstart: Launch an Azure Spring Cloud app using the Maven plug-in

Azure Spring Cloud's Maven plug-in allows you to easily create and update your Azure Spring Cloud service applications. By pre-defining a configuration, you can deploy applications to your existing Azure Spring Cloud service. In this article, we use a sample application called PiggyMetrics to demonstrate this feature.

>[!Note]
> Before beginning this quickstart, ensure that your Azure subscription has access to Azure Spring Cloud.  As a  preview service, we ask customers to reach out to us so that we can add your subscription to our allow-list.  If you would like to explore the capabilities of Azure Spring Cloud, please [fill out this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR-LA2geqX-ZLhi-Ado1LD3tUNDk2VFpGUzYwVEJNVkhLRlcwNkZFUFZEUS4u
).

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article.  It has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

To complete this quickstart:

1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
4. [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
5. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI using the following command

```Azure CLI
az extension add -y --source https://azureclitemp.blob.core.windows.net/spring-cloud/spring_cloud-0.1.0-py2.py3-none-any.whl
```

## Provision a service instance on the Azure portal

1. In a web browser, open the [Azure portal](https://portal.azure.com), and sign into your account.

1. Search for the **Azure Spring Cloud** and select it to go to the overview page. Select the **Create** button to get started.

1. Fill out the form, considering the following guidelines:
    - Service Name: Specify the name of your service instance.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
    - Subscription: Select the subscription you want to be billed for this resource.  Ensure that this subscription has been added to our allow-list for Azure Spring Cloud.
    - Resource group: Creating new resource groups for new resources is a best practice.
    - Location: Select the location for your service instance. Currently supported locations include East US, West US 2, West Europe, and Southeast Asia.
    
It takes about 5 minutes for the service to deploy.  Once it is deployed, the **Overview** page for the service instance will appear.

## Set up your configuration server

1. Go to the service **Overview** page and select **Config Server**.
1. In the **Default repository** section, set **URI** to "https://github.com/Azure-Samples/piggymetrics", set **LABEL** to "config", and select **Apply** to save your changes.

## Clone and build the sample application repository

1. Clone git repository by running the following command.

    ```azurecli
    git clone https://github.com/Azure-Samples/PiggyMetrics
    ```
  
1. Change directory and build the project by running the following command.

    ```azurecli
    cd PiggyMetrics
    mvn clean package -DskipTests
    ```

## Generate and deploy the Azure Spring Cloud configuration

1. Add the following to your `pom.xml` or `settings.xml` to enable Maven to work with Azure Spring Cloud.

    ```xml
    <pluginRepositories>
      <pluginRepository>
        <id>maven.snapshots</id>
        <name>Maven Central Snapshot Repository</name>
        <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
        <releases>
          <enabled>false</enabled>
        </releases>
        <snapshots>
          <enabled>true</enabled>
        </snapshots>
      </pluginRepository>
    </pluginRepositories>
    ```

1. Generate a configuration by running the following command.

    ```azurecli
    mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:config
    ```

    1. Select the modules `gateway`,`auth-service`, and `account-service`.

    1. Select your subscription and Azure Spring Cloud service cluster.

    1. From the list of projects provided, enter the number that corresponds with `gateway` to give it public access.
    
    1. Confirm the configuration.

1. Deploy the apps by using the following command:

   ```azurecli
   mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:deploy
   ```

1. You can access PiggyMetrics using the URL provided in the output from the previous command.

## Next Steps

In this quickstart, you've deployed a Spring Cloud application from a Maven repository.  To learn more about Azure Spring Cloud, continue to the tutorial on preparing your app for deployment.

> [!div class="nextstepaction"]
> [Prepare your Azure Spring Cloud application for deployment](spring-cloud-tutorial-prepare-app-deployment.md)
