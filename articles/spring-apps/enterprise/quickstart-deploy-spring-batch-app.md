---
title: Quickstart - Deploy your first spring batch application to Azure Spring Apps
description: Describes how to deploy a spring batch application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 05/06/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, engagement-fy23, references_regions, devx-track-extended-azdevcli
ms.author: v-muyaofeng
---

# Quickstart: Deploy your first Spring Batch application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

This quickstart shows how to deploy a Spring Batch ephemeral application to Azure Spring Apps. The sample project is derived from Spring Batch sample [Football Job](https://github.com/spring-projects/spring-batch/blob/main/spring-batch-samples/src/main/java/org/springframework/batch/samples/football/README.md). It is a statistics loading job. Instead of triggering by unit test in original sample, it is initiated by the main method of FootballJobApplication.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

The following diagram shows the architecture of the system:

:::image type="content" source="media/quickstart-deploy-spring-batch-app/architecture.png" alt-text="Diagram that shows the architecture." border="false" lightbox="media/quickstart-deploy-spring-batch-app/architecture.png":::

This article provides the following options for deploying to Azure Spring Apps:

- The **Azure portal** option is the easiest and the fastest way to create resources and deploy applications with a single click. This option is suitable for Spring developers who want to quickly deploy applications to Azure cloud services.
- The **Azure CLI** option is a powerful command line tool to manage Azure resources. This option is suitable for Spring developers who are familiar with Azure cloud services.

## 1. Prerequisites

### [Azure portal](#tab/Azure-portal-ent)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).

### [Azure CLI](#tab/Azure-CLI)

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.55.0 or higher. Use the following commands to install the Azure Spring Apps extension: `az extension add --name spring`.
- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [Enterprise plan in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

---

## 2. Prepare the Spring project

1. Use the following command to clone the sample project from GitHub:

   ```bash
   git clone https://github.com/Azure-Samples/azure-spring-apps-samples.git
   ```

## 3. Prepare the cloud environment

The main resources required to run this sample are an Azure Spring Apps instance. This section provides the steps to create these resources.

### [Azure portal](#tab/Azure-portal-ent)

### 3.1. Sign in to the Azure portal

Go to the [Azure portal](https://portal.azure.com/) and enter your credentials to sign in to the portal. The default view is your service dashboard.

### 3.2. Create an Azure Spring Apps instance

[!INCLUDE [provision-enterprise-azure-spring-apps](includes/quickstart-deploy-restful-api-app/provision-enterprise-azure-spring-apps.md)]

### 3.3. Set up a log analytics workspace

See [set up a log analytics workspace](../basic-standard/quickstart-setup-log-analytics.md?tabs=Azure-Portal#prerequisites) to query data in logs.

### [Azure CLI](#tab/Azure-CLI)

### 3.1. Provide names for each resource

Create variables to hold the resource names by using the following commands. Be sure to replace the placeholders with your own values.

```azurecli
export LOCATION=<location>
export RESOURCE_GROUP=<resource-group-name>
export SPRING_APPS_SERVICE=<Azure-Spring-Apps-instance-name>
```

### 3.2. Create a new resource group

Use the following steps to create a new resource group.

1. Use the following command to sign in to the Azure CLI.

   ```azurecli
   az login
   ```

1. Use the following command to set the default location.

   ```azurecli
   az configure --defaults location=${LOCATION}
   ```

1. Use the following command to list all available subscriptions to determine the subscription ID to use.

   ```azurecli
   az account list --output table
   ```

1. Use the following command to set the default subscription:

   ```azurecli
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to create a resource group.

   ```azurecli
   az group create --resource-group ${RESOURCE_GROUP}
   ```

1. Use the following command to set the newly created resource group as the default resource group.

   ```azurecli
   az configure --defaults group=${RESOURCE_GROUP}
   ```

### 3.3. Create an Azure Spring Apps instance

Azure Spring Apps is used to host the Spring web app. Create an Azure Spring Apps instance and an application inside it.

1. Use the following command to create an Azure Spring Apps service instance.

   ```azurecli
   az spring create --name ${SPRING_APPS_SERVICE} --sku enterprise
   ```

1. Use the following command to verify an Azure Spring Apps Enterprise plan service instance is created successfully.

   ```azurecli
   az spring show --name ${SPRING_APPS_SERVICE}
   ```

---

## 4. Deploy the job sample to Azure Spring Apps

### [Azure portal](#tab/Azure-portal-ent)

### 4.1. Create and execute job

1. Navigate to jobs blade then click **Create Job** button to create a new job. In this panel, fill in the job name as `football`.Configure job parameters such as parallelism, retry limit and timeout. Add environment variables and secret environment variables as wanted. After confirmation, click **Create** button to finish creation.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/create-job.png" alt-text="Diagram that shows create a job." border="false" lightbox="media/quickstart-deploy-spring-batch-app/create-job.png":::

1. After creating the job, click **Deploy Job** and copy the Azure Cli command of deploying the job. Then open the command line and replace with the correct artifact path and run the command. Wait several minutes until the build and deploy succeed.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/deploy-job.png" alt-text="Diagram that shows deploy a job." border="false" lightbox="media/quickstart-deploy-spring-batch-app/deploy-job.png":::

1. After deployment, open the overview page of the Job “football” by clicking the Job name. Click Run button on top to initiate the task execution. You can customize each execution of the Job with different parameters like environment variables, Or just click **Run** button to trigger the execution. The message notifies that the Job is now started successfully.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/start-job.png" alt-text="Diagram that shows start a job." border="false" lightbox="media/quickstart-deploy-spring-batch-app/start-job.png":::

### [Azure CLI](#tab/Azure-CLI)

### 4.1. Create and execute Job

1. Navigate to the root folder of this Java sample project from the root of git repo.

    ```azurecli
    cd azure-spring-apps-samples/job-samples/football
    ```

1. Use the following command to create a job in the Azure Spring Apps instance.

    ```azurecli
    az spring job create \
        --service ${SPRING_APPS_SERVICE} \
        --name football
    ```

1. Use the following command to deploy this football sample project to job. It uploads and compiles the source code on Azure
   and makes it ready to start.

   ```azurecli
   az spring job deploy \
       --service ${SPRING_APPS_SERVICE} \
       --name football \
       --source-path . \
       --build-env BP_JVM_VERSION=17
   ```

1. Use the following command to start job and set execution name to the variable **EXECUTION_NAME**.

    ```azurecli
    export EXECUTION_NAME=$(az spring job start \
        --service ${SPRING_APPS_SERVICE} \
        --name football --query name -o tsv)
    ```

---

## 5. Validate the Spring Batch app

Now you can access the deployed job to see whether it works.

### [Azure portal](#tab/Azure-portal-ent)

Use the following steps to validate:

1. In the “Executions” blade, check the job execution result.  Wait a few seconds and refresh to see the status turns to **Completed**. It means the job execution finishes successfully.

1. Then click “View logs” to query the logs of the Job execution.

   :::image type="content" source="media/quickstart-deploy-spring-batch-app/view-logs.png" alt-text="Diagram that view the logs." border="false" lightbox="media/quickstart-deploy-spring-batch-app/view-logs.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to validate:

1. Query execution result according to job name and its execution name.

    ```azurecli
    az spring job logs \
        --service ${SPRING_APPS_SERVICE} \
        --name football \
        --execution ${EXECUTION_NAME} \
        --all-instances
    ```

1. Then you will see the job log streaming of the job execution like below.

    ```bash
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

---

## 6. Clean up resources

Be sure to delete the resources you created in this article when you no longer need them. You can delete the Azure resource group, which includes all the resources in the resource group.

### [Azure portal](#tab/Azure-portal-ent)

[!INCLUDE [clean-up-resources-via-resource-group](includes/quickstart-deploy-web-app/clean-up-resources-via-resource-group.md)]

### [Azure CLI](#tab/Azure-CLI)

Use the following command to delete the entire resource group, including the newly created service instance:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

---

## 7. Next steps

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./how-to-custom-domain.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Automate application deployments to Azure Spring Apps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Quickstart: Create a service connection in Azure Spring Apps with the Azure CLI](../../service-connector/quickstart-cli-spring-cloud-connection.md)

> [!div class="nextstepaction"]
> [Introduction to the Fitness Store sample app](./quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/azure-spring-apps-samples).
- [Azure for Spring developers](/azure/developer/java/spring/)
- [Spring Cloud Azure documentation](/azure/developer/java/spring-framework/)
