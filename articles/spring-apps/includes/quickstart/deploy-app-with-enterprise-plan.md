---
author: karlerickson
ms.author: v-shilichen
ms.service: spring-apps
ms.custom: event-tier1-build-2022
ms.topic: include
ms.date: 08/09/2023
---

<!--
For clarity of structure, a separate markdown file is used to describe how to deploy to Azure Spring Apps with Enterprise plan.

[!INCLUDE [deploy-event-driven-app-with-enterprise-plan](includes/quickstart/deploy-app-with-enterprise-plan.md)]

-->

## 2. Prepare the Spring project

### [Azure portal](#tab/Azure-portal-ent)

This section isn't required to prepare the JAR package for deployment. The **Deploy to azure** button process downloads the JAR package from [GitHub release](https://github.com/Azure/spring-cloud-azure-tools/releases).

### [Azure CLI](#tab/Azure-CLI)

[!INCLUDE [prepare-spring-project](prepare-spring-project.md)]

### [IntelliJ](#tab/IntelliJ)

[!INCLUDE [generate-spring-project](generate-spring-project.md)]

### [Visual Studio Code](#tab/visual-studio-code)

To prepare the Spring project, follow the steps in the [Before you begin](https://code.visualstudio.com/docs/java/java-spring-apps#_before-you-begin) section of [Java on Azure Spring Apps](https://code.visualstudio.com/docs/java/java-spring-apps).

---

## 3. Prepare the cloud environment

Use the following steps to create an Azure Spring Apps service instance.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [hello-prepare-cloud-environment-consumption-on-azure-portal](hello-prepare-cloud-env-enterprise-azure-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export LOCATION="<region>"
export RESOURCE_GROUP="<resource-group-name>"
export SERVICE_NAME="<Azure-Spring-Apps-instance-name>"
export APP_NAME="demo"
```

### 3.2. Create a new resource group

Use the following steps to create a new resource group:

1. Use the following command to sign in to the Azure CLI:

   ```azurecli
   az login
   ```

1. Use the following command to set the default location:

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use:

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group:

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group:

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.3. Install extension and register namespace

Use the following commands to install the Azure Spring Apps extension for the Azure CLI and register the namespace: `Microsoft.SaaS`:

```azurecli
az extension add --name spring --upgrade
az provider register --namespace Microsoft.SaaS
```

### 3.4. Create an Azure Spring Apps instance

Use the following steps to create the service instance:

1. Use the following command to accept the legal terms and privacy statements for the Enterprise plan:

   > [!NOTE]
   > This step is necessary only if your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps.

   ```azurecli
   az term accept \
      --publisher vmware-inc \
      --product azure-spring-cloud-vmware-tanzu-2 \
      --plan asa-ent-hr-mtr
   ```

1. Use the following command to create an Azure Spring Apps service instance:

   ```azurecli
   az spring create \
       --name ${SERVICE_NAME} \
       --sku Enterprise
   ```

### 3.5. Create an app in your Azure Spring Apps instance

An *App* is an abstraction of one business app. For more information, see [App and deployment in Azure Spring Apps](../../concept-understand-app-and-deployment.md). Apps run in an Azure Spring Apps service instance, as shown in the following diagram.

:::image type="content" source="../../media/spring-cloud-app-and-deployment/app-deployment-rev.png" alt-text="Diagram that shows the relationship between apps and an Azure Spring Apps service instance." border="false":::

Use the following command to create the app on Azure Spring Apps:

```azurecli
az spring app create \
    --service ${SERVICE_NAME} \
    --name ${APP_NAME} \
    --assign-endpoint true
```

### [IntelliJ](#tab/IntelliJ)

### 3.1. Sign in to the Azure portal

Open your web browser and go to the [Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-spring-apps](provision-enterprise-azure-spring-apps.md)]

### [Visual Studio Code](#tab/visual-studio-code)

To create an Azure Spring Apps instance, follow the steps in the [Create an app on Azure Spring Apps](https://code.visualstudio.com/docs/java/java-spring-apps#_create-an-app-on-azure-spring-apps) section of [Java on Azure Spring Apps](https://code.visualstudio.com/docs/java/java-spring-apps).

---

## 4. Deploy the app to Azure Spring Apps

This section provides the steps to deploy your application to Azure Spring Apps.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [deploy-hello-app-on-azure-portal](deploy-hello-app-azure-portal.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to deploy the *.jar* file for the app:

```azurecli
az spring app deploy \
    --service ${SERVICE_NAME} \
    --name ${APP_NAME} \
    --artifact-path target/demo-0.0.2-SNAPSHOT.jar
```

Deploying the application can take a few minutes.

### [IntelliJ](#tab/IntelliJ)

### 4.1. Import the project

Use the following steps to import the project:

1. Open IntelliJ IDEA and select **Open**.

1. In the **Open File or Project** dialog box, select the *demo* folder.

   :::image type="content" source="../../media/quickstart/intellij-new-project.png" alt-text="Screenshot of IntelliJ IDEA that shows the Open File or Project dialog box." lightbox="../../media/quickstart/intellij-new-project.png":::

### 4.2. Build and deploy your app

Use the following steps to build and deploy your app:

1. If you haven't already installed the Azure Toolkit for IntelliJ, follow the steps in [Install the Azure Toolkit for IntelliJ](/azure/developer/java/toolkit-for-intellij/install-toolkit).

   > [!NOTE]
   > Azure Toolkit for IntelliJ provides four ways to log in to Azure, and the deployment can only start after logging in.

1. Right-click your project in the IntelliJ Project window and then select **Azure** -> **Deploy to Azure Spring Apps**.

   :::image type="content" source="../../media/quickstart/intellij-deploy-azure.png" alt-text="Screenshot of the IntelliJ IDEA menu that shows the Deploy to Azure Spring Apps option." lightbox="../../media/quickstart/intellij-deploy-azure.png":::

1. Accept the name for the app in the **Name** field. **Name** refers to the configuration, not the app name. You don't usually need to change it.

1. In the **Artifact** textbox, select **Maven:demo(Java 17)**.

1. In the **Subscription** textbox, verify that your subscription is correct.

1. In the **Spring Apps** textbox, select the instance of Azure Spring Apps that you created.

1. In the **App** textbox, select the plus sign (**+**) to create a new app.

   :::image type="content" source="../../media/quickstart/intellij-create-new-app.png" alt-text="Screenshot of the IntelliJ IDEA that shows the Deploy Azure Spring Apps dialog box." lightbox="../../media/quickstart/intellij-create-new-app.png":::

1. In the **App name:** textbox under **App Basics**, enter *demo*, and then select **More settings**.

1. Select the **Enable** button next to **Public endpoint**. The button changes to **Disable \<to be enabled\>**. Then, select **OK**.

   :::image type="content" source="../../media/quickstart/intellij-more-settings.png" alt-text="Screenshot of IntelliJ IDEA Create app dialog box with public endpoint Disable button highlighted." lightbox="../../media/quickstart/intellij-more-settings.png":::

1. Under **Before launch**, select **Run Maven Goal 'demo:package'**, and then select the pencil icon to edit the command line.

   :::image type="content" source="../../media/quickstart/intellij-edit-maven-goal.png" alt-text="Screenshot of IntelliJ IDEA Create Azure Spring Apps dialog box with Maven Goal edit button highlighted." lightbox="../../media/quickstart/intellij-edit-maven-goal.png":::

1. In the **Command line** textbox, enter *-DskipTests* after *package*, and then select **OK**.

   :::image type="content" source="../../media/quickstart/intellij-maven-goal-command-line.png" alt-text="Screenshot of IntelliJ IDEA Select Maven Goal dialog box with Command Line value highlighted." lightbox="../../media/quickstart/intellij-maven-goal-command-line.png":::

1. To start the deployment, select the **Run** button at the bottom of the **Deploy to Azure** dialog box. The plug-in runs the Maven command `package -DskipTests` on the `demo` app and deploys the *.jar* file generated by the `package` command.

Deploying the application can take a few minutes. You can see the public URL of the application in the output console log.

### [Visual Studio Code](#tab/visual-studio-code)

To deploy the app to Azure Spring Apps, follow the steps in the [Build and deploy the app](https://code.visualstudio.com/docs/java/java-spring-apps#_build-and-deploy-the-app) section of [Java on Azure Spring Apps](https://code.visualstudio.com/docs/java/java-spring-apps).

---
