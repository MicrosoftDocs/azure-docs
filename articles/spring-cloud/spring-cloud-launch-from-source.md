---
title:  "Quickstart: Launch your Spring Cloud application from source code"
description: Learn how to launch your Azure Spring Cloud application directly from your source code
author:  jpconnock

ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/30/2019
ms.author: jeconnoc
---

# Launch your Spring Cloud application from source code

Azure Spring Cloud enables you to easily run Spring Cloud based microservice applications on Azure.

Azure Spring Cloud allows you to launch your application directly from your java source code or from a pre-built JAR. This article walks you through required steps.

Following this quickstart, you will learn how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Assign public endpoint for your application

## Prerequisites

>[!Note]
> Before beginning this quickstart, ensure that your Azure subscription has access to Azure Spring Cloud.  As a preview service, we ask that you reach out to us so that we can add your subscription to our allow-list.  If you would like to explore the capabilities of Azure Spring Cloud, please [fill out this form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR-LA2geqX-ZLhi-Ado1LD3tUNDk2VFpGUzYwVEJNVkhLRlcwNkZFUFZEUS4u).  While Azure Spring Cloud is in preview, Microsoft offers limited support without an SLA.  For more information about support during previews, please refer to this [Support FAQ](https://azure.microsoft.com/support/faq/).

Before you begin, ensure that your Azure subscription has the required dependencies:

1. [Install Git](https://git-scm.com/)
2. [Install JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
3. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
4. [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
5. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

> [!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article.  It has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI with the following command

```Azure CLI
az extension add -y --source https://azureclitemp.blob.core.windows.net/spring-cloud/spring_cloud-0.1.0-py2.py3-none-any.whl
```

## Provision a service instance using the Azure CLI

Login to the Azure CLI and choose your active subscription. Be sure to choose the active subscription that is whitelisted for Azure Spring Cloud

```Azure CLI
az login
az account list -o table
az account set --subscription
```

Open an Azure CLI window and run the following commands to provision an instance of Azure Spring Cloud. Note that we also tell Azure Spring Cloud to assign a public domain here.

```azurecli
    az spring-cloud create -n <resource name> -g <resource group name> --is-public true
```

The service instance will take about five minutes to deploy.

Set your default resource group name and cluster name using the following commands:

```azurecli
az configure --defaults group=<service group name>
az configure --defaults spring-cloud=<service instance name>
```

## Create the Spring Cloud application

The following command creates a Spring Cloud application in your subscription.  This creates an empty Spring Cloud service to which we can upload our application.

```azurecli
az spring-cloud app create -n <app-name>
```

## Deploy your Spring Cloud application

You can deploy your application from a pre-built JAR or from a Gradle or Maven repository.  Find instructions for each case below.

### Deploy a built JAR

To deploy from a JAR built on your local machine, ensure that your build produces a [fat-JAR](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-build.html#howto-create-an-executable-jar-with-maven).

To deploy the fat-JAR to an active deployment

```azurecli
az spring-cloud app deploy -n <app-name> --jar-path <path-to-fat-JAR>
```

To deploy the fat-JAR to a specific deployment

```azurecli
az spring-cloud app deployment create --app <app-name> -n <deployment-name> --jar-path <path-to-built-jar>
```

### Deploy from source code

Azure Spring Cloud uses [kpack](https://github.com/pivotal/kpack) to build your project.  You can use Azure CLI to upload your source code, build your project using kpack, and deploy it to the target application.

> [!WARNING]
> The project must produce only one JAR file with a `main-class` entry in the `MANIFEST.MF` in `target` (for Maven deployments or `build/libs` (for Gradle deployments).  Multiple JAR files with `main-class` entries will cause the deployment to fail.

For single module Maven / Gradle projects:

```azurecli
cd <path-to-maven-or-gradle-source-root>
az spring-cloud app deploy -n <app-name>
```

For Maven / Gradle projects with multiple modules, repeat for each module:

```azurecli
cd <path-to-maven-or-gradle-source-root>
az spring-cloud app deploy -n <app-name> --target-module <relative-path-to-module>
```

### Show deployment logs

Review the kpack build logs using the following command:

```azurecli
az spring-cloud app show-deploy-log -n <app-name> [-d <deployment-name>]
```

> [!NOTE]
> The kpack logs will only show the latest deployment if that deployment was built from source using kpack.

## Assign a public endpoint to gateway

1. Open the **Application Dashboard** page.
2. Select the `gateway` application to show the **Application Details** page.
3. Select **Assign Domain** to assign a public endpoint to gateway. This can a few minutes. 
4. Enter the assigned public IP into your browser to view your running application.

## Next steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Provision a service instance
> * Set a configuration server for an instance
> * Build a microservices application locally
> * Deploy each microservice
> * Edit environment variables for applications
> * Assign public IP for your application gateway

> [!div class="nextstepaction"]
> [Prepare your Azure Spring Cloud application for deployment](spring-cloud-tutorial-prepare-app-deployment.md)
