---
title: "Quickstart - Deploy your first application to Azure Spring Apps"
description: In this quickstart, we deploy an application to Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 10/18/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-azurecli, mode-other, event-tier1-build-2022
---

# Quickstart: Deploy your first application to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This quickstart explains how to deploy a small application to run on Azure Spring Apps.

The application code used in this tutorial is a simple app. When you've completed this example, the application will be accessible online and can be managed via the Azure portal.

This quickstart explains how to:

> [!div class="checklist"]
> - Generate a basic Spring project
> - Provision a service instance
> - Build and deploy the app with a public endpoint
> - Clean up the resources

At the end, you'll have a working spring app running on Azure Spring Apps.

:::image type="content" source="media/quickstart/access-app-browser.png" alt-text="Screenshot of app in browser window." lightbox="media/quickstart/access-app-browser.png":::

## [CLI](#tab/Azure-CLI)

### Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Provision an instance of Azure Spring Apps

1. Select **try it** and sign-in to your Azure account in [Azure Cloud Shell](/azure/cloud-shell/overview).

   ```azurecli-interactive
   az account show
   ```

1. Create an [Azure Storage](/azure/storage/common/storage-introduction) by your subscription.

   :::image type="content" source="media/quickstart/Azure-storage-subscription-new.png" alt-text="Screenshot of Azure Storage subscription." lightbox="media/quickstart/Azure-storage-subscription-new.png":::

1. After login successfully, copying the command to list all the subscription you have.

   ```azurecli-interactive
   az account list -o table
   ```

1. Choose and link to your subscription.

   ```azurecli-interactive
   az account set --subscription <ID of a subscription from last step>
   ```

1. Create a Resource Group.

   ```azurecli-interactive
   az group create --name <Name of Resource Group> --location eastus
   ```

1. Create an Azure Spring Apps service intance.

   ```azurecli-interactive
   az spring create -n <Name of service instance> -g <Name of Resource Group>
   ```

   And choose **Y** to install the Azure Spring Apps extension and run.

### Create the app in your instance

```azurecli-interactive
az spring app create -n hellospring -s <service instance name> -g <Name of Resource Group> --assign-endpoint true
```

### Clone the Spring Boot sample project

1. Clone the [Spring Boot sample project](https://github.com/spring-guides/gs-spring-boot.git) from github.

   ```azurecli-interactive
   git clone https://github.com/spring-guides/gs-spring-boot.git
   ```

1. Change into the project folder.

   ```azurecli-interactive
   cd gs-spring-boot/complete
   ```

### Build the local app

Using [Maven](https://maven.apache.org/what-is-maven.html) to build the project.

```azurecli-interactive
mvn clean package -DskipTests
```

### Deploy the local app on Azure Spring Apps

Deploy the Jar file for the app(`target/spring-boot-complete-0.0.1-SNAPSHOT.jar` on Windows):

```azurecli-interactive
az spring app deploy -n hellospring -s <service instance name> -g <Name of Resource Group> --artifact-path target/spring-boot-complete-0.0.1-SNAPSHOT.jar
```

It takes a few minutes to finish deploying the application.

## [IntelliJ](#tab/IntelliJ)

### Prerequisites

To complete this quickstart:

- [Sign up for an Azure subscription](https://azure.microsoft.com/free/)
- [Install IntelliJ IDEA](https://www.jetbrains.com/idea/)

### Generate a Spring project

Start with [Spring Initializr](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.9&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client) to generate a sample project with recommended dependencies for Azure Spring Apps. This link uses the following URL to provide default settings for you. 

```url
https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.9&packaging=jar&jvmVersion=1.8&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client
```

The following image shows the recommended Initializr set up for this sample project. 

This example uses Java version 8.  If you want to use Java version 11 or 17, change the option under **Project Metadata**. 

:::image type="content" source="media/quickstart/initializr-page-new.jpg" alt-text="Screenshot of Spring Initializr page.":::

1. Select **Generate** when all the dependencies are set.
1. Download and unpack the package, then create a web controller for a simple web application by adding the file *src/main/java/com/example/hellospring/HelloController.java* with the following contents:

   ```java
   package com.example.hellospring;

   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.bind.annotation.RequestMapping;

   @RestController
   public class HelloController {

       @RequestMapping("/")
   ```

### Provision an instance of Azure Spring Apps

The following procedure creates an instance of Azure Spring Apps using the Azure portal.

1. In a new tab, open the [Azure portal](https://portal.azure.com/).

1. From the top search box, search for **Azure Spring Apps**.

1. Select **Azure Spring Apps** from the results.

   :::image type="content" source="media/quickstart/spring-apps-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps service in search results." lightbox="media/quickstart/spring-apps-start.png":::

1. On the Azure Spring Apps page, select **Create**.

   :::image type="content" source="media/quickstart/spring-apps-create.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps resource with Create button highlighted." lightbox="media/quickstart/spring-apps-create.png":::

1. Fill out the form on the Azure Spring Apps **Create** page.  Consider the following guidelines:

   - **Subscription**: Select the subscription you want to be billed for this resource.
   - **Resource group**: Creating new resource groups for new resources is a best practice. You will use this resource group in later steps as **\<resource group name\>**.
   - **Service Details/Name**: Specify the **\<service instance name\>**.  The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens.  The first character of the service name must be a letter and the last character must be either a letter or a number.
   - **Location**: Select the region for your service instance.

   :::image type="content" source="media/quickstart/portal-start.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Create page." lightbox="media/quickstart/portal-start.png":::

1. Select **Review and create**.

### Import project

1. Open the IntelliJ **Welcome** dialog, then select **Open** to open the import wizard.
1. Select the **hellospring** folder.

   :::image type="content" source="media/quickstart/intellij-new-project.png" alt-text="Screenshot of IntelliJ IDEA showing Open File or Project dialog box." lightbox="media/quickstart/intellij-new-project.png":::

### Installation and sign-in

1. Before you want to start the quickstarts by IntelliJ, you should [install Azure Toolkit for IntelliJ from the Marketplace](https://docs.microsoft.com/en-us/azure/developer/java/toolkit-for-intellij/install-toolkit#install-azure-toolkit-for-intellij-from-the-marketplace).

1. After that, [sign-in to your Azure accout](https://docs.microsoft.com/en-us/azure/developer/java/toolkit-for-intellij/create-hello-world-web-app#install-and-sign-in) in IntelliJ.

### Bulid and deploy the app

> [!NOTE]
> If you want to run the project locally, please add **spring.config.import=configserver:** to the **application.propertities** file.

1. Right-click your project in IntelliJ project explorer, then select **Azure** -> **Deploy to Azure Spring Apps**.

   :::image type="content" source="media/quickstart/intellij-deploy-azure-1.png" alt-text="Screenshot of IntelliJ IDEA menu showing Deploy to Azure Spring Apps option." lightbox="media/quickstart/intellij-deploy-azure-1.png":::

1. Accept the name for the app in the **Name** field. **Name** refers to the configuration, not the app name. Users don't usually need to change it.
1. In the **Artifact** textbox, select **Maven:com.example:hellospring-0.0.1-SNAPSHOT**.
1. In the **Subscription** textbox, verify your subscription is correct.
1. In the **Service** textbox, select the instance of Azure Spring Apps that you created in [Provision an instance of Azure Spring Apps](./quickstart-provision-service-instance.md).
1. In the **App** textbox, select **+** to create a new app.

   :::image type="content" source="media/quickstart/intellij-create-new-app.png" alt-text="Screenshot of IntelliJ IDEA showing Deploy Azure Spring Apps dialog box.":::

1. In the **App name:** textbox, enter *hellospring*, then check the **More settings** check box.
1. Select the **Enable** button next to **Public endpoint**. The button will change to *Disable \<to be enabled\>*.
1. If you used Java 11, select **Java 11** in **Runtime**.
1. Select **OK**.

   :::image type="content" source="media/quickstart/intellij-create-new-app-2.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with public endpoint Disable button highlighted.":::

1. Under **Before launch**, select the **Run Maven Goal 'hellospring:package'** line, then select the pencil to edit the command line.

   :::image type="content" source="media/quickstart/intellij-edit-maven-goal.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with Maven Goal edit button highlighted.":::

1. In the **Command line** textbox, enter *-DskipTests* after *package*, then select **OK**.

   :::image type="content" source="media/quickstart/intellij-maven-goal-command-line.png" alt-text="Screenshot of IntelliJ IDEA Select Maven Goal dialog box with Command Line value highlighted.":::

1. Start the deployment by selecting the **Run** button at the bottom of the **Deploy Azure Spring Apps app** dialog. The plug-in will run the command `mvn package -DskipTests` on the `hellospring` app and deploy the jar generated by the `package` command.

## [Visual Studio Code](#tab/VS-Code)

To deploy a simple Spring Boot web app to Azure Spring Apps, follow the steps in [Build and Deploy Java Spring Boot Apps to Azure Spring Apps with Visual Studio Code](https://code.visualstudio.com/docs/java/java-spring-cloud#_download-and-test-the-spring-boot-app).

---

Once deployment has completed, you can access the app at `https://<service instance name>-hellospring.azuremicroservices.io/`.

:::image type="content" source="media/quickstart/access-app-browser.png" alt-text="Screenshot of app in browser window." lightbox="media/quickstart/access-app-browser.png":::

## (Optional) Streaming logs in real time

#### [CLI](#tab/Azure-CLI)

Use the following command to get real-time logs from the App.

```azurecli
az spring app logs -n hellospring -s <service instance name> -g <resource group name> --lines 100 -f
```

Logs appear in the results:

:::image type="content" source="media/spring-cloud-quickstart-java/streaming-logs.png" alt-text="Screenshot of streaming logs in a console window." lightbox="media/spring-cloud-quickstart-java/streaming-logs.png":::

>[!TIP]
> Use `az spring app logs -h` to explore more parameters and log stream functionalities.

#### [IntelliJ](#tab/IntelliJ)

1. Select **Azure Explorer**, then **Spring Cloud**.
1. Right-click the running app.
1. Select **Streaming Logs** from the drop-down list.
1. Select instance.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-get-streaming-logs.png" alt-text="Screenshot of IntelliJ IDEA showing Select instance dialog box." lightbox="media/spring-cloud-quickstart-java/intellij-get-streaming-logs.png":::

1. The streaming log will be visible in the output window.

    :::image type="content" source="media/spring-cloud-quickstart-java/intellij-streaming-logs-output.png" alt-text="Screenshot of IntelliJ IDEA showing streaming log output." lightbox="media/spring-cloud-quickstart-java/intellij-streaming-logs-output.png":::

#### [Visual Studio Code](#tab/VS-Code)

To get real-time application logs with Visual Studio Code, follow the steps in [Stream your application logs](https://code.visualstudio.com/docs/java/java-spring-cloud#_stream-your-application-logs).

---

For advanced logs analytics features, visit the **Logs** tab in the menu on the [Azure portal](https://portal.azure.com/). Logs here have a latency of a few minutes.

:::image type="content" source="media/spring-cloud-quickstart-java/logs-analytics.png" alt-text="Screenshot of Azure portal showing Azure Spring Apps Logs query." lightbox="media/spring-cloud-quickstart-java/logs-analytics.png":::

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> - Generate a basic Spring project
> - Provision a service instance
> - Build and deploy the app with a public endpoint

To learn how to use more Azure Spring capabilities, advance to the quickstart series that deploys a sample application to Azure Spring Apps:

> [!div class="nextstepaction"]
> [Introduction to the sample app](./quickstart-sample-app-introduction.md)

More samples are available on GitHub: [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
