---
title: Set up a staging environment in Azure Spring Apps
description: Learn how to use blue-green deployment with Azure Spring Apps
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 01/14/2021
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli, event-tier1-build-2022
---

# Set up a staging environment in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ❌ Basic ✔️ Standard ✔️ Enterprise

This article explains how to set up a staging deployment by using the blue-green deployment pattern in Azure Spring Apps. Blue-green deployment is an Azure DevOps continuous delivery pattern that relies on keeping an existing (blue) version live while a new (green) one is deployed. This article shows you how to put that staging deployment into production without changing the production deployment.

## Prerequisites

- An existing Azure Spring Apps instance on the Standard plan.
- [Azure CLI](/cli/azure/install-azure-cli).

This article uses an application built from Spring Initializr. If you want to use a different application for this example, make a change in a public-facing portion of the application to differentiate your staging deployment from the production deployment.

> [!TIP]
> [Azure Cloud Shell](https://shell.azure.com) is a free interactive shell that you can use to run the instructions in this article.  It has common, preinstalled Azure tools, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you're signed in to your Azure subscription, start your Cloud Shell instance. To learn more, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md).

To set up blue-green deployment in Azure Spring Apps, follow the instructions in the next sections.

## Install the Azure CLI extension

Install the [Azure Spring Apps extension](/cli/azure/azure-cli-extensions-overview) for the Azure CLI by using the following command:

```azurecli
az extension add --name spring
```

## Prepare the app and deployments

To build the application, follow these steps:

1. Generate the code for the sample app by using Spring Initializr with [this configuration](https://start.spring.io/#!type=maven-project&language=java&packaging=jar&groupId=com.example&artifactId=hellospring&name=hellospring&description=Demo%20project%20for%20Spring%20Boot&packageName=com.example.hellospring&dependencies=web,cloud-eureka,actuator,cloud-config-client).

1. Download the code.
1. Add the following *HelloController.java* source file to the folder *\src\main\java\com\example\hellospring\*:

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

1. Build the *.jar* file:

   ```azurecli
   mvn clean package -DskipTests
   ```

1. Create the app in your Azure Spring Apps instance:

   ```azurecli
   az spring app create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name demo \
       --runtime-version Java_17 \
       --assign-endpoint
   ```

1. Deploy the app to Azure Spring Apps:

   ```azurecli
   az spring app deploy \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --name demo \
       --artifact-path target\hellospring-0.0.1-SNAPSHOT.jar
   ```

1. Modify the code for your staging deployment:

   ```java
   package com.example.hellospring;
   import org.springframework.web.bind.annotation.RestController;
   import org.springframework.web.bind.annotation.RequestMapping;

   @RestController

   public class HelloController {

   @RequestMapping("/")

     public String index() {
         return "Greetings from Azure Spring Apps! THIS IS THE GREEN DEPLOYMENT";
     }

   }
   ```

1. Rebuild the *.jar* file:

   ```azurecli
   mvn clean package -DskipTests
   ```

1. Create the green deployment:

   ```azurecli
   az spring app deployment create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-instance-name> \
       --app demo \
       --name green \
       --runtime-version Java_17 \
       --artifact-path target\hellospring-0.0.1-SNAPSHOT.jar
   ```

## View apps and deployments

Use the following steps to view deployed apps.

1. Go to your Azure Spring Apps instance in the Azure portal.

1. From the navigation pane, open the **Apps** pane to view apps for your service instance.

   :::image type="content" source="media/how-to-staging-environment/app-dashboard.png" lightbox="media/how-to-staging-environment/app-dashboard.png" alt-text="Screenshot of the Apps pane showing apps for your service instance.":::

1. Select an app to view details.

   :::image type="content" source="media/how-to-staging-environment/app-overview.png" lightbox="media/how-to-staging-environment/app-overview.png" alt-text="Screenshot of details for an app.":::

1. Open **Deployments** to see all deployments of the app. The grid shows both production and staging deployments.

   :::image type="content" source="media/how-to-staging-environment/deployments-dashboard.png" lightbox="media/how-to-staging-environment/deployments-dashboard.png" alt-text="Screenshot that shows listed app deployments.":::

1. Select the URL to open the currently deployed application.

   :::image type="content" source="media/how-to-staging-environment/running-blue-app.png" lightbox="media/how-to-staging-environment/running-blue-app.png" alt-text="Screenshot that shows the URL of the deployed application.":::

1. Select **Production** in the **State** column to see the default app.

   :::image type="content" source="media/how-to-staging-environment/running-default-app.png" lightbox="media/how-to-staging-environment/running-default-app.png" alt-text="Screenshot that shows the URL of the default app.":::

1. Select **Staging** in the **State** column to see the staging app.

   :::image type="content" source="media/how-to-staging-environment/running-staging-app.png" lightbox="media/how-to-staging-environment/running-staging-app.png" alt-text="Screenshot that shows the URL of the staging app.":::

>[!TIP]
> Confirm that your test endpoint ends with a slash (/) to ensure that the CSS file is loaded correctly. If your browser requires you to enter login credentials to view the page, use [URL decode](https://www.urldecoder.org/) to decode your test endpoint. URL decode returns a URL in the format `https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/demo/green`. Use this format to access your endpoint.

>[!NOTE]
> Configuration server settings apply to both your staging environment and your production environment. For example, if you set the context path (*server.servlet.context-path*) for your app demo in the configuration server as *somepath*, the path to your green deployment changes to `https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/demo/green/somepath/...`.

If you visit your public-facing app demo at this point, you should see the old page without your new change.

## Set the green deployment as the production environment

1. After you've verified your change in your staging environment, you can push it to production. On the **Apps** > **Deployments** page, select the application currently in **Production**.

1. Select the ellipsis after **Registration status** of the green deployment, and then select **Set as production**.

   :::image type="content" source="media/how-to-staging-environment/set-staging-deployment.png" lightbox="media/how-to-staging-environment/set-staging-deployment.png" alt-text="Screenshot that shows selections for setting the staging build to production.":::

1. Confirm that the URL of the app displays your changes.

   :::image type="content" source="media/how-to-staging-environment/new-production-deployment.png" lightbox="media/how-to-staging-environment/new-production-deployment.png" alt-text="Screenshot that shows the URL of the app now in production.":::

>[!NOTE]
> After you've set the green deployment as the production environment, the previous deployment becomes the staging deployment.

## Modify the staging deployment

If you're not satisfied with your change, you can modify your application code, build a new .jar package, and upload it to your green deployment by using the Azure CLI:

```azurecli
az spring app deploy \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name demo \
    --deployment green \
    --artifact-path demo.jar
```

## Delete the staging deployment

To delete your staging deployment from the Azure portal, go to the page for your staging deployment and select the **Delete** button.

Alternatively, delete your staging deployment from the Azure CLI by running the following command:

```azurecli
az spring app deployment delete \
    --resource-group <resource-group-name> \
    --service <service-instance-name> \
    --name <staging-deployment-name> \
    --app demo
```

## Next steps

- [CI/CD for Azure Spring Apps](./how-to-cicd.md?pivots=programming-language-java)
