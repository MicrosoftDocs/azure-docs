---
title: Quickstart - Deploy Your First Spring Batch Application to Azure Spring Apps
description: Describes how to deploy a Spring batch application to Azure Spring Apps.
author: KarlErickson
ms.author: v-muyaofeng
ms.service: azure-spring-apps
ms.topic: quickstart
ms.date: 05/21/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, engagement-fy23, references_regions, devx-track-extended-azdevcli
---

# Quickstart: Deploy your first Spring Batch application to Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

This quickstart shows how to deploy a Spring Batch ephemeral application to Azure Spring Apps. The sample project is derived from the Spring Batch sample [Football Job](https://github.com/spring-projects/spring-batch/blob/main/spring-batch-samples/src/main/java/org/springframework/batch/samples/football/README.md). It's a statistics loading job. In the original sample, a unit test triggers the job. In the adapted sample, the `main` method of `FootballJobApplication` initiates the job.

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-spring-batch-app/architecture.png" alt-text="Diagram that shows the sample app architecture." border="false" lightbox="media/quickstart-deploy-spring-batch-app/architecture.png":::

This article provides the following options for deploying to Azure Spring Apps:

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure CLI** option uses a powerful command line tool to manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services.

## 1. Prerequisites

### [Azure portal](#tab/Azure-portal-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

### [Azure CLI](#tab/Azure-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.55.0 or higher. Use the following commands to install the Azure Spring Apps extension: `az extension add --name spring`.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

---

## 2. Prepare the Spring project

Use the following command to clone the sample project from GitHub:

```bash
git clone https://github.com/Azure-Samples/azure-spring-apps-samples.git
```

## 3. Prepare the cloud environment

The main resource required to run this sample is an Azure Spring Apps instance. This section provides the steps to create this resource.

### [Azure portal](#tab/Azure-portal-ent)

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-enterprise-azure-spring-apps](includes/quickstart-deploy-restful-api-app/provision-enterprise-azure-spring-apps.md)]

### 3.3. Enable service registry

Go to the Azure Spring Apps instance you created, expand **Managed components** in the navigation pane, and then select **Service Registry**. Then, on the Overview page, select **Manage** to open the **Manage** page, select **Enable Service Registry**, and then select **Apply**.

:::image type="content" source="media/quickstart-deploy-spring-batch-app/enable-service-registry.png" alt-text="Screenshot of the Azure portal that shows the Service Registry page with the Manage pane open and the Enable Service Registry option highlighted." lightbox="media/quickstart-deploy-spring-batch-app/enable-service-registry.png":::

### 3.4. Set up a log analytics workspace

For information on querying the data in logs, see [Quickstart: Set up a Log Analytics workspace](../basic-standard/quickstart-setup-log-analytics.md).

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export LOCATION=<location>
export RESOURCE_GROUP=<resource-group-name>
export AZURE_SPRING_APPS_INSTANCE=<Azure-Spring-Apps-instance-name>
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

### 3.3. Create an Azure Spring Apps instance

Azure Spring Apps is used to host the Spring web app. Use the following steps to create an Azure Spring Apps instance and an application inside it:

1. Use the following command to create an Azure Spring Apps service instance and enable the service registry:

   ```azurecli
   az spring create \
       --name ${AZURE_SPRING_APPS_INSTANCE} \
       --sku enterprise \
       --enable-sr
   ```

1. Use the following command to verify that the Azure Spring Apps Enterprise plan service instance was created successfully:

   ```azurecli
   az spring show --name ${AZURE_SPRING_APPS_INSTANCE}
   ```

---

## 4. Deploy the football-billboard app to Azure Spring Apps

### [Azure portal](#tab/Azure-portal-ent)

Use the following steps to deploy the app:

1. Go to the Azure Spring Apps instance you created, expand **Settings** in the navigation pane, and then select **Apps**.

1. On the **Apps** pane, select **Create App** to open the **Create App** page.
1. Set **App name** to *football-billboard*, select **Service Registry** on the **Bind** column, and then select **Create**.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/create-app.png" alt-text="Screenshot of the Azure portal that shows the Create App page with the App name and Bind fields highlighted." lightbox="media/quickstart-deploy-spring-batch-app/create-app.png":::

1. After creating the app, select **Deploy App** and copy the Azure CLI command for deploying the app. Then, open a Bash window and paste the command onto the command line, replacing the artifact path with the correct value for your system. Then, run the command. Wait several minutes until the build and deployment succeed. The command and output should look similar to the following example:

   ```output
   $ az spring app deploy -s job-demo -g job-demo -n football-billboard --artifact-path target/spring-batch-football-billboard-0.0.1-SNAPSHOT.jar
   This command usually takes minutes to run. Add '--verbose' parameter if needed.
   [1/5] Requesting for upload URL.
   [2/5] Uploading package to blob.
   [3/5] Creating or Updating build 'football-billboard'.
   [4/5] Waiting for building container image to finish. This may take a few minutes.
   ```

1. After deployment, go back to the **Apps** pane and select the `football-billboard` app. Then, go to the overview page and select **Assign endpoint** to expose the public endpoint for the app.

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to deploy the app:

1. Use the following command to navigate to the sample project folder from the root folder of the repository:

   ```azurecli
   cd azure-spring-apps-samples/job-samples/football-billboard
   ```

1. Use the following command to create an application in the Azure Spring Apps instance and bind the service registry:

   ```azurecli
   az spring app create \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football-billboard \
       --assign-endpoint true \
       --bind-sr
   ```

1. Use the following command to deploy the app:

   ```azurecli
   az spring app deploy \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football-billboard \
       --source-path . \
       --build-env BP_JVM_VERSION=17
   ```

---

## 5. Deploy the job sample to Azure Spring Apps

This section provides the steps to deploy the sample.

### [Azure portal](#tab/Azure-portal-ent)

### 5.1. Create and execute the job

Use the following steps to create and execute the job:

1. Navigate to **Jobs** pane then select **Create Job**. Fill in the job name as `football`. Configure the job parameters, such as parallelism, retry limit, and timeout. Add environment variables and secret environment variables as needed. After confirmation, select **Create**.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/create-job.png" alt-text="Screenshot of the Azure portal that shows the Jobs (preview) page with the Create Job pane open." lightbox="media/quickstart-deploy-spring-batch-app/create-job.png":::

1. After creating the job, expand **Managed components** in the navigation pane and select **Service Registry**. Then, select **Job binding**, select **Bind job** to select the football job, and then select **Apply** to bind.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/bind-job.png" alt-text="Screenshot of the Azure portal that shows the Service Registry page with the Bind job dialog box open." lightbox="media/quickstart-deploy-spring-batch-app/bind-job.png":::

1. Go back to the **Jobs** pane after binding the job, select **Deploy Job**, and then copy the Azure CLI command for deploying the job. Then, open a Bash window and paste the command onto the command line, replacing the artifact path with the correct value for your system. Then, run the command. Wait several minutes until the build and deployment succeed. The command and output should look similar to the following example:

   ```output
   $ az spring job deploy -s job-demo -g job-demo -n football --artifact-path target/spring-batch-football-0.0.1-SNAPSHOT-jar-with-dependencies.jar --build-env BP_JVM_VERSION=17
   This command is in preview and under development. Reference and support levels: https://aka.ms/CLI_refstatus
   This command usually takes minutes to run. Add '--verbose' parameter if needed.
   [1/5] Requesting for upload URL.
   [2/5] Uploading package to blob.
   [3/5] Creating or Updating build 'football'.
   [4/5] Waiting for building container image to finish. This may take a few minutes.
   ```

1. After deployment, open the overview page of the `football` job by selecting the job name. Select **Run** to initiate the task execution. You can customize each execution of the job with different parameters, such as environment variables, or just select **Run** to trigger the execution. A message indicates that the job is running.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/start-job.png" alt-text="Screenshot of the Azure portal that shows the Jobs (preview) Overview page with the Run Job pane open." lightbox="media/quickstart-deploy-spring-batch-app/start-job.png":::

### [Azure CLI](#tab/Azure-CLI)

### 5.1. Create and execute the job

Use the following steps to create and execute the job:

1. Use the following command navigate to the sample project folder from the *football-billboard* folder where you left off previously:

   ```azurecli
   cd ..
   cd football
   ```

1. Use the following command to create a job in the Azure Spring Apps instance and bind the service registry:

   ```azurecli
   az spring job create \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football \
       --bind-sr
   ```

1. Use the following command to deploy the `football` sample project to the job. This command uploads and compiles the source code on Azure and makes it ready to start.

   ```azurecli
   az spring job deploy \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football \
       --source-path . \
       --build-env BP_JVM_VERSION=17
   ```

1. Use the following command to start the job and set the `EXECUTION_NAME` variable to the job execution name:

   ```azurecli
   export EXECUTION_NAME=$(az spring job start \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football \
       --query name \
       --output tsv)
   ```

---

## 6. Check the job execution result and the billboard UI

You can now access the execution of the job and check its result.

### [Azure portal](#tab/Azure-portal-ent)

Use the following steps to validate:

1. On the **Executions** pane, check the job execution result. Wait a few seconds and refresh to see the status turn to **Completed**. This value means that the job execution finishes successfully.

1. Select **View logs** to query the logs of the job execution.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/view-logs.png" alt-text="Screenshot of the Azure portal that shows the Logs page." lightbox="media/quickstart-deploy-spring-batch-app/view-logs.png":::

1. Open the public endpoint of the app in a browser window to see the billboard UI. Leave the app open.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/billboard-ui.png" alt-text="Screenshot of the sample app billboard UI." lightbox="media/quickstart-deploy-spring-batch-app/billboard-ui.png":::

1. Go back to the overview page of the `football` job and select **Run** to trigger the execution again.

1. Go back to the endpoint page in the browser and select **Refresh** to see the UI changed, as shown in the following screenshot:

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/billboard-ui-changed.png" alt-text="Screenshot of the sample app billboard UI after it changes." lightbox="media/quickstart-deploy-spring-batch-app/billboard-ui-changed.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to validate:

1. Use the following command to query the execution result using the job name and its execution name:

   ```azurecli
   az spring job logs \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football \
       --execution ${EXECUTION_NAME} \
       --all-instances
   ```

   The job log streaming the job execution should look similar to the following example:

   ```output
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.launch.support.SimpleJobLauncher - No TaskExecutor has been set, defaulting to synchronous executor.
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO com.microsoft.sample.FootballJobApplication - There is {} player summary before job execution
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.launch.support.SimpleJobLauncher - Job: [SimpleJob: [name=footballJob]] launched with the following parameters: [{}]
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.job.SimpleStepHandler - Executing step: [playerLoad]
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.step.AbstractStep - Step: [playerLoad] executed in 200ms
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.job.SimpleStepHandler - Executing step: [gameLoad]
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.step.AbstractStep - Step: [gameLoad] executed in 290ms
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.job.SimpleStepHandler - Executing step: [summarizationStep]
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.step.AbstractStep - Step: [summarizationStep] executed in 7ms
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.batch.core.launch.support.SimpleJobLauncher - Job: [SimpleJob: [name=footballJob]] completed with the following parameters: [{}] and the following status: [COMPLETED] in 519ms
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO com.microsoft.sample.FootballJobApplication - There is 1 player summary after job execution
   [football-xxxxxxxxxxxxx-xxxxxx-x-xxxxx] [main] INFO org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseFactory - Shutting down embedded database: url='jdbc:hsqldb:mem:testdb'
   ...
   ```

1. Use the following command to retrieve the endpoint of the `football-billboard` app:

   ```azurecli
   az spring app show \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football-billboard \
       --query properties.url
   ```

1. Open the public endpoint of the app in a browser window to see the billboard UI. Leave the app open.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/billboard-ui.png" alt-text="Screenshot of the sample app billboard UI." lightbox="media/quickstart-deploy-spring-batch-app/billboard-ui.png":::

1. Use the following command to start job again:

   ```azurecli
   az spring job start \
       --service ${AZURE_SPRING_APPS_INSTANCE} \
       --name football
   ```

1. Go back to the endpoint page in the browser and select **Refresh** to see the UI changed, as shown in the following screenshot:

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/billboard-ui-changed.png" alt-text="Screenshot of the sample app billboard UI after it changes." lightbox="media/quickstart-deploy-spring-batch-app/billboard-ui-changed.png":::

---

## 7. Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. You can delete the Azure resource group, which includes all the resources in the resource group.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [clean-up-resources-via-resource-group](../basic-standard/includes/quickstart-deploy-web-app/clean-up-resources-via-resource-group.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the entire resource group, including the newly created service instance:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---

## 8. Next steps

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/azure-spring-apps-samples).
- [Azure for Spring developers](/azure/developer/java/spring/)
- [Spring Cloud Azure documentation](/azure/developer/java/spring-framework/)
