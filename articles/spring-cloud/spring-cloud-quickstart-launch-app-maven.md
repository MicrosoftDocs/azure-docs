---
title: "Quickstart: Launch an application using Maven - Azure Spring Cloud"
description: Launch a sample application using Maven
services: spring-cloud
author: jpconnock
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/30/2019
ms.author: jeconnoc

---

# Quickstart: Launch an Azure Spring Cloud app using the Maven plug-in

Using the Azure Spring Cloud Maven plug-in, you can easily create and update your Azure Spring Cloud applications. By predefining a configuration, you can deploy applications to your existing Azure Spring Cloud service. In this article, you use a sample application called PiggyMetrics to demonstrate this feature.

Following this quickstart, you will learn how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set up a configuration server for an instance
> * Clone and build microservices application locally
> * Deploy each microservice
> * Assign a public endpoint for your application

>[!Note]
> Before you begin this quickstart, ensure that your Azure subscription has access to Azure Spring Cloud. As a preview service, we invite you to reach out to us so that we can add your subscription to our allow list. If you want to explore the capabilities of Azure Spring Cloud, fill out and submit the [Azure Spring Cloud (Private Preview) - Interest Form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR-LA2geqX-ZLhi-Ado1LD3tUNDk2VFpGUzYwVEJNVkhLRlcwNkZFUFZEUS4u). While Azure Spring Cloud is in preview, Microsoft offers limited support without an SLA.  For more information about support during previews, please refer to this [Support FAQ](https://azure.microsoft.com/support/faq/).

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

1. In a web browser, open [this link to Azure Spring Cloud in the Azure portal](https://ms.portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=AppPlatformExtension#blade/Microsoft_Azure_Marketplace/MarketplaceOffersBlade/selectedMenuItemId/home/searchQuery/Azure%20Spring%20Cloud).

    ![Search for and select Azure Spring Cloud](media/spring-cloud-quickstart-launch-app-portal/goto-portal.png)

1. Select **Create** on the **Overview** page to open the creation dialog.

1. Provide the **Project Details** for the sample application as follows:

    1. Select the **Subscription** with which the application will be associated.
    1. Select or create a resource group for the application. We recommend creating a new resource group.  The example below shows a new resource group called `myspringservice`.
    1. Provide a name for the new Azure Spring Cloud service.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.  The service in the example below has the name `contosospringcloud`.
    1. Select a location for your application from the options provided.  In this example, we select `East US`.
    1. Select **Review + create** to review a summary of your new service.  If everything looks correct, select **Create**.

    > [!div class="mx-imgBorder"]
    > ![Select Review + create](media/maven-qs-review-create.jpg)

It takes about 5 minutes for the service to be deployed. After the service is deployed, select **Go to resource** and the **Overview** page for the service instance appears.

## Set up your configuration server

1. On the service **Overview** page, select **Config Server**.
1. In the **Default repository** section, set **URI** to **https://github.com/Azure-Samples/piggymetrics**, set **Label** to **config**, and then select **Apply** to save your changes.

    > [!div class="mx-imgBorder"]
    > ![Define and apply config settings](media/maven-qs-apply-config.jpg)

## Clone and build the sample application repository

1. Launch the [Azure Cloud Shell](https://shell.azure.com).

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

1. Return to the [Azure Cloud Shell](https://shell.azure.com) and generate a configuration by running the following command:

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
