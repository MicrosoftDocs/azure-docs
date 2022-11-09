---
title: "Quickstart - Deploy your first application to Azure Spring Apps"
description: Describes how to deploy an application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 08/22/2022
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23
---

# Quickstart: Deploy your first application to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This quickstart explains how to deploy a small application to run on Azure Spring Apps.

The application code used in this tutorial is a simple app. When you've completed this example, the application will be accessible online, and you can manage it through the Azure portal.

This quickstart explains how to:

> [!div class="checklist"]
> - Generate a basic Spring project.
> - Provision a service instance.
> - Build and deploy an app with a public endpoint.
> - Clean up the resources.

At the end of this quickstart, you'll have a working spring app running on Azure Spring Apps.

## [Azure CLI](#tab/Azure-CLI)

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Azure CLI](/cli/azure/install-azure-cli). Install the Azure Spring Apps extension with the following command: `az extension add --name spring`

## Provision an instance of Azure Spring Apps

Use the following steps to provision a service instance.

1. Select **Try It** and sign in to your Azure account in [Azure Cloud Shell](../cloud-shell/overview.md).

   ```azurecli-interactive
   az account show
   ```

1. Azure Cloud Shell workspaces are temporary. On initial start, the shell prompts you to associate an [Azure Storage](../storage/common/storage-introduction.md) instance with your subscription to persist files across sessions.

   :::image type="content" source="media/quickstart/azure-storage-subscription.png" alt-text="Screenshot of Azure Storage subscription." lightbox="media/quickstart/azure-storage-subscription.png":::

1. After you sign in successfully, use the following command to display a list of your subscriptions.

   ```azurecli-interactive
   az account list --output table
   ```

1. Use the following command to choose and link to your subscription.

   ```azurecli-interactive
   az account set --subscription <subscription-id>
   ```

1. Use the following command to create a resource group.

   ```azurecli-interactive
   az group create \
       --resource-group <name-of-resource-group> \
       --location eastus
   ```

1. Use the following command to create an Azure Spring Apps service instance.

   ```azurecli-interactive
   az spring create \
       --resource-group <name-of-resource-group> \
       --name <service-instance-name>
   ```

1. Choose **Y** to install the Azure Spring Apps extension and run it.

## Create an app in your Azure Spring Apps instance

Use the following command to specify the app name on Azure Spring Apps as *hellospring*.

```azurecli-interactive
az spring app create \
    --resource-group <name-of-resource-group> \
    --service <service-instance-name> \
    --name hellospring \
    --assign-endpoint true
```

## Clone and build the Spring Boot sample project

Use the following steps to clone the Spring Boot sample project.

1. Use the following command to clone the [Spring Boot sample project](https://github.com/spring-guides/gs-spring-boot.git) from GitHub.

   ```azurecli-interactive
   git clone https://github.com/spring-guides/gs-spring-boot.git
   ```

1. Use the following command to move to the project folder.

   ```azurecli-interactive
   cd gs-spring-boot/complete
   ```

1. Use the following [Maven](https://maven.apache.org/what-is-maven.html) command to build the project.

   ```azurecli-interactive
   mvn clean package -DskipTests
   ```

## Deploy the local app to Azure Spring Apps

Use the following command to deploy the *.jar* file for the app (*target/spring-boot-complete-0.0.1-SNAPSHOT.jar* on Windows).

```azurecli-interactive
az spring app deploy \
    --resource-group <name-of-resource-group> \
    --service <service-instance-name> \
    --name hellospring \
    --artifact-path target/spring-boot-complete-0.0.1-SNAPSHOT.jar
```

Deploying the application can take a few minutes.

## [IntelliJ](#tab/IntelliJ)

## Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [IntelliJ IDEA](https://www.jetbrains.com/idea/).
- [Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/install-toolkit).

## Generate a Spring project

Use the following steps to create the project:

1. Use [Spring Initializr](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.10&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client) to generate a sample project with recommended dependencies for Azure Spring Apps. The following URL provides default settings for you. 

```url
https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.10&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client
```

The following image shows the recommended Initializr settings for the *hellospring* sample project. 

This example uses Java version 11.  To use a different Java version, change the Java version setting under **Project Metadata**. 

:::image type="content" source="media/quickstart/initializr-page.png" alt-text="Screenshot of Spring Initializr page." lightbox="media/quickstart/initializr-page.png":::

1. When all dependencies are set, select **Generate**.
1. Download and unpack the package, and then create a web controller for your web application by adding the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

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

## Provision an instance of Azure Spring Apps

Use the following steps to create an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for **Azure Spring Apps**.

1. Select **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/quickstart/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted." lightbox="media/quickstart/spring-apps-create.png":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice.
   - **Service Name**: Specify the service instance name. You'll use this name later in this article where the *\<service-instance-name\>* placeholder appears. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Region**: Select the region for your service instance.

   :::image type="content" source="media/quickstart/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page." lightbox="media/quickstart/portal-start.png":::

1. Select **Review and create**.

## Import the project

Use the following steps to import the project.

1. Open IntelliJ IDEA, and then select **Open**.
1. In the **Open File or Project** dialog box, select the *hellospring* folder.

   :::image type="content" source="media/quickstart/intellij-new-project.png" alt-text="Screenshot of IntelliJ IDEA showing Open File or Project dialog box." lightbox="media/quickstart/intellij-new-project.png":::

## Build and deploy your app

> [!NOTE]
> To run the project locally, add `spring.config.import=optional:configserver:` to the project's *application.properties* file.

Use the following steps to build and deploy your app.

1. If you haven't already installed the Azure Toolkit for IntelliJ, follow the steps in [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/install-toolkit).

1. Right-click your project in the IntelliJ Project window, and then select **Azure** -> **Deploy to Azure Spring Apps**.

   :::image type="content" source="media/quickstart/intellij-deploy-azure.png" alt-text="Screenshot of IntelliJ IDEA menu showing Deploy to Azure Spring Apps option." lightbox="media/quickstart/intellij-deploy-azure.png":::

1. Accept the name for the app in the **Name** field. **Name** refers to the configuration, not the app name. You don't usually need to change it.
1. In the **Artifact** textbox, select **Maven:com.example:hellospring-0.0.1-SNAPSHOT**.
1. In the **Subscription** textbox, verify that your subscription is correct.
1. In the **Service** textbox, select the instance of Azure Spring Apps that you created in [Provision an instance of Azure Spring Apps](#provision-an-instance-of-azure-spring-apps-1).
1. In the **App** textbox, select the plus sign (**+**) to create a new app.

   :::image type="content" source="media/quickstart/intellij-create-new-app.png" alt-text="Screenshot of IntelliJ IDEA showing Deploy Azure Spring Apps dialog box." lightbox="media/quickstart/intellij-create-new-app.png":::

1. In the **App name:** textbox under **App Basics**, enter *hellospring*, and then select the **More settings** check box.
1. Select the **Enable** button next to **Public endpoint**. The button changes to **Disable \<to be enabled\>**.
1. If you're using Java 11, select **Java 11** for the **Runtime** option.
1. Select **OK**.

   :::image type="content" source="media/quickstart/intellij-more-settings.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with public endpoint Disable button highlighted." lightbox="media/quickstart/intellij-more-settings.png":::

1. Under **Before launch**, select **Run Maven Goal 'hellospring:package'**, and then select the pencil icon to edit the command line.

   :::image type="content" source="media/quickstart/intellij-edit-maven-goal.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with Maven Goal edit button highlighted." lightbox="media/quickstart/intellij-edit-maven-goal.png":::

1. In the **Command line** textbox, enter *-DskipTests* after *package*, and then select **OK**.

   :::image type="content" source="media/quickstart/intellij-maven-goal-command-line.png" alt-text="Screenshot of IntelliJ IDEA Select Maven Goal dialog box with Command Line value highlighted." lightbox="media/quickstart/intellij-maven-goal-command-line.png":::

1. To start the deployment, select the **Run** button at the bottom of the **Deploy Azure Spring Apps app** dialog box. The plug-in runs the command `mvn package -DskipTests` on the `hellospring` app and deploys the *.jar* file generated by the `package` command.

## [Visual Studio Code](#tab/VS-Code)

## Deploy a Spring Boot web app to Azure Spring Apps with Visual Studio Code

To deploy a Spring Boot web app to Azure Spring Apps, follow the steps in [Java on Azure Spring Apps](https://code.visualstudio.com/docs/java/java-spring-apps).

---

Once deployment has completed, you can access the app at `https://<service instance name>-hellospring.azuremicroservices.io/`.

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, delete them by deleting the resource group. Use the following commands to delete the resource group:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you learned how to generate a basic Spring project, provision a service instance, build and deploy an app with a public endpoint, and clean up the resources.

You also have access to powerful logs, metrics, and distributed tracing capability from the Azure portal. For more information, see [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md).

To learn how to use more Azure Spring capabilities, advance to the quickstart series that deploys a sample application to Azure Spring Apps:

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

More samples are available on GitHub: [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).