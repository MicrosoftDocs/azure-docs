---
title: Quickstart - Deploy your first Java Native Image application to Azure Spring Apps
description: Describes how to deploy a Java Native Image application to Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: quickstart
ms.date: 08/03/2023
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, mode-other, event-tier1-build-2022, engagement-fy23, references_regions
ms.author: yili7
---

# Quickstart: Deploy your first Java Native Image application to Azure Spring Apps

> [!NOTE]
> The first 50 vCPU hours and 100 GB hours of memory are free each month. For more information, see [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058) on the [Apps on Azure Blog](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/bg-p/AppsonAzureBlog).

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

[Native Image](https://www.graalvm.org/latest/reference-manual/native-image/) capability allows you to compile Java applications to standalone executables, known as native images. These executables can provide significant benefits, including faster startup times and lower runtime memory overhead compared to a traditional JVM (Java Virtual Machine). 

This quickstart shows how to deploy a Spring Boot application to Azure Spring Apps as native image. The sample project is the Spring Petclinic application. The following screenshot shows the application:

:::image type="content" source="./media/quickstart-deploy-java-native-image-app/spring-petclnic-app.png" alt-text="Screenshot of a Spring Petclinic application in Azure Spring Apps." lightbox="./media/quickstart-deploy-java-native-image-app/spring-petclnic-app.png":::

## 1. Prerequisites

- An Azure subscription. If you don't have a subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
- [Git](https://git-scm.com/downloads).
- [Java Development Kit (JDK)](/java/azure/jdk/), version 17.
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`

- If you're deploying an Azure Spring Apps Enterprise plan instance for the first time in the target subscription, see the [Requirements](./how-to-enterprise-marketplace-offer.md#requirements) section of [View Azure Spring Apps Enterprise tier offering in Azure Marketplace](./how-to-enterprise-marketplace-offer.md).

[!INCLUDE [deploy-to-azure-spring-apps-enterprise-plan](includes/quickstart-deploy-java-native-image-app/deploy-enterprise-plan.md)]

## 5. Validate Native Image App

Now you can access the deployed native image app to see whether it works. Use the following steps to validate:

1. After the deployment has completed, you can run the following command to get the app URL: 

   ```azurecli
   az spring app show \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${NATIVE_APP_NAME} \
        -o table
   ```
   
   You can access the app with the URL from `Public Url`. The page should appear as you saw in localhost.
   
1. Use the following command to check the app's log to investigate any deployment issue:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${NATIVE_APP_NAME}
   ```

## 6. Compare performance for Jar and Native Image

### Server startup time
1. Use the following command to check the app's log `Started PetClinicApplication in XXX seconds` to get server startup time for jar app:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${JAR_APP_NAME}
   ```

   Server startup time is around 25 s for jar app.
   
1. Use the following command to check the app's log to get server startup time for Native Image app:

   ```azurecli
   az spring app logs \
       --service ${AZURE_SPRING_APPS_NAME} \
       --name ${NATIVE_APP_NAME}
   ```

   Server startup time is less than 0.5 s for Native Image app, it's much faster than the jar app.
   
### Memory usage

Use the following command to scale down memory size to `512Mi` for Native Image app:

```azurecli
az spring app scale \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${NATIVE_APP_NAME} \
    --memory 512Mi
```
Native image app started successfully.

Use the following command to scale down memory size to `512Mi` for jar app:

```azurecli
az spring app scale \
    --service ${AZURE_SPRING_APPS_NAME} \
    --name ${JAR_APP_NAME} \
    --memory 512Mi
```

Jar app failed to start due to insufficient memory: `Terminating due to java.lang.OutOfMemoryError: Java heap space`.

In Figure below, it shows the optimized memory usage of a native image deployment – which is about 1/5th of the memory consumed by its equivalent JAR deployment - for a constant workload of 400 requests per second into the monolithic version of the Petclinic application.
:::image type="content" source="./media/quickstart-deploy-java-native-image-app/optimized-memory-usage-native-vs-jar-app.jpg" alt-text="Screenshot of the optimized memory usage of a native image deployment in Azure Spring Apps." lightbox="./media/quickstart-deploy-java-native-image-app/optimized-memory-usage-native-vs-jar-app.jpg":::

Native images offer quicker startup times and reduced runtime memory overhead when compared to the conventional Java Virtual Machine (JVM).

## 7. Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, delete them by deleting the resource group. Use the following command to delete the resource group:

```azurecli
az group delete --name ${RESOURCE_GROUP}
```

## 8. Next steps

> [!div class="nextstepaction"]
> [How to deploy Java Native Image apps in the Azure Spring Apps Enterprise plan](./how-to-enterprise-deploy-polyglot-apps.md#deploy-java-native-image-applications-preview)

> [!div class="nextstepaction"]
> [Structured application log for Azure Spring Apps](./structured-app-log.md)

> [!div class="nextstepaction"]
> [Map an existing custom domain to Azure Spring Apps](./tutorial-custom-domain.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with GitHub Actions](./how-to-github-actions.md)

> [!div class="nextstepaction"]
> [Set up Azure Spring Apps CI/CD with Azure DevOps](./how-to-cicd.md)

> [!div class="nextstepaction"]
> [Use managed identities for applications in Azure Spring Apps](./how-to-use-managed-identities.md)

> [!div class="nextstepaction"]
> [Create a service connection in Azure Spring Apps with the Azure CLI](../service-connector/quickstart-cli-spring-cloud-connection.md)

> [!div class="nextstepaction"]
> [Run the polyglot ACME fitness store apps on Azure Spring Apps](./quickstart-sample-app-acme-fitness-store-introduction.md)

For more information, see the following articles:

- [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples).
- [Spring on Azure](/azure/developer/java/spring/)
- [Spring Cloud Azure](/azure/developer/java/spring-framework/)
