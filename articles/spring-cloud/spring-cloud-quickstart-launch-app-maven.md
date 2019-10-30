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

# Quickstart: Launch an Azure Spring Cloud app by using the Maven plug-in

With the Azure Spring Cloud Maven plug-in, you can easily create and update your Azure Spring Cloud service applications. By predefining a configuration, you can deploy applications to your existing Azure Spring Cloud service. In this article, you use a sample application called PiggyMetrics to demonstrate this feature.

>[!Note]
> Before you begin this quickstart, ensure that your Azure subscription has access to Azure Spring Cloud. As a preview service, we invite you to reach out to us so that we can add your subscription to our allow list. If you want to explore the capabilities of Azure Spring Cloud, fill out and submit the [Azure Spring Cloud (Private Preview) - Interest Form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR-LA2geqX-ZLhi-Ado1LD3tUNDk2VFpGUzYwVEJNVkhLRlcwNkZFUFZEUS4u).

>[!TIP]
> Azure Cloud Shell is a free interactive shell that you can use to run the commands in this article. It has common Azure tools preinstalled, including the latest versions of Git, the Java Development Kit (JDK), Maven, and the Azure CLI. If you're signed in to your Azure subscription, launch [Azure Cloud Shell](https://shell.azure.com). For more information, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md).

To complete this quickstart:

1. [Install Git](https://git-scm.com/).
2. [Install JDK 8](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable).
3. [Install Maven 3.0 or later](https://maven.apache.org/download.cgi).
4. [Install the Azure CLI version 2.0.67 or higher](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).
5. [Sign up for a free Azure subscription](https://azure.microsoft.com/free/).

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI by using the following command:

```Azure CLI
az extension add -y --source https://azureclitemp.blob.core.windows.net/spring-cloud/spring_cloud-0.1.0-py2.py3-none-any.whl
```

## Provision a service instance on the Azure portal

1. In a web browser, open the [Azure portal](https://portal.azure.com), and sign in to your account.

1. Search for and then select **Azure Spring Cloud**. 
1. On the overview page, select **Create**, and then do the following:  

    a. In the **Service Name** box, specify the name of your service instance. The name must be from 4 to 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter, and the last character must be either a letter or a number.  

    b. In the **Subscription** drop-down list, select the subscription you want to be billed for this resource. Ensure that this subscription has been added to our allow list for Azure Spring Cloud.  

    c. In the **Resource group** box, create a new resource group. Creating resource groups for new resources is a best practice.  

    d. In the **Location** drop-down list, select the location for your service instance. Currently supported locations include East US, West US 2, West Europe, and Southeast Asia.
    
It takes about 5 minutes for the service to be deployed. After the service is deployed, the **Overview** page for the service instance appears.

## Set up your configuration server

1. On the service **Overview** page, select **Config Server**.
1. In the **Default repository** section, set **URI** to **https://github.com/Azure-Samples/piggymetrics**, set **Label** to **config**, and then select **Apply** to save your changes.

## Clone and build the sample application repository

1. Clone the Git repository by running the following command:

    ```azurecli
    git clone https://github.com/Azure-Samples/PiggyMetrics
    ```
  
1. Change directory and build the project by running the following command:

    ```azurecli
    cd PiggyMetrics
    mvn clean package -DskipTests
    ```

## Generate and deploy the Azure Spring Cloud configuration

1. To enable Maven to work with Azure Spring Cloud, add the following code to your *pom.xml* or *settings.xml* file.

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

1. Generate a configuration by running the following command:

    ```azurecli
    mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:config
    ```

    a. Select the modules `gateway`,`auth-service`, and `account-service`.

    b. Select your subscription and Azure Spring Cloud service cluster.

    c. In the list of provided projects, enter the number that corresponds with `gateway` to give it public access.
    
    d. Confirm the configuration.

1. Deploy the apps by using the following command:

   ```azurecli
   mvn com.microsoft.azure:azure-spring-cloud-maven-plugin:0.1.0-SNAPSHOT:deploy
   ```

1. You can access PiggyMetrics by using the URL that's provided in the output from the preceding command.

## Next steps

In this quickstart, you've deployed a Spring Cloud application from a Maven repository. To learn more about Azure Spring Cloud, continue to the tutorial about preparing your app for deployment.

> [!div class="nextstepaction"]
> [Prepare your Azure Spring Cloud application for deployment](spring-cloud-tutorial-prepare-app-deployment.md)
