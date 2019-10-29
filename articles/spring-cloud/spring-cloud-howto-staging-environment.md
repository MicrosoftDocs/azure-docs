---
title: Set up a staging environment in Azure Spring Cloud | Microsoft Docs
description: Learn how to use blue-green deployment with Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: gwallace
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/07/2019
ms.author: v-vasuke

---

# How to set up a staging environment

This article will show you how to leverage a staging deployment using the blue-green deployment pattern in Azure Spring Cloud. It will also show you how to put that staging deployment into production without changing the production deployment directly.

## Prerequisites

This article assumes that you have already deployed the PiggyMetrics application from our [tutorial on launching an application](spring-cloud-quickstart-launch-app-portal.md). PiggyMetrics comprises three applications: "gateway", "account-service", and "auth-service".  

If you have a different application that you'd like to use for this example, you'll need to make a simple change in a public facing portion of the application.  This change differentiates your staging deployment from production.

>[!NOTE]
> Before beginning this quickstart, ensure that your Azure subscription has access to Azure Spring Cloud.  As a preview service, we ask that you reach out to us so that we can add your subscription to our allow-list.  If you would like to explore the capabilities of Azure Spring Cloud, please reach out to us by email: azure-spring-cloud@service.microsoft.com.

>[!TIP]
> The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article.  It has common Azure tools preinstalled, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you are logged in to your Azure subscription, launch your [Azure Cloud Shell](https://shell.azure.com) from shell.azure.com.  You can learn more about Azure Cloud Shell by [reading our documentation](../cloud-shell/overview.md)

To complete this article:

1. [Install Git](https://git-scm.com/)
1. [Install JDK 8](https://docs.microsoft.com/java/azure/jdk/?view=azure-java-stable)
1. [Install Maven 3.0 or above](https://maven.apache.org/download.cgi)
1. [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
1. [Sign up for an Azure subscription](https://azure.microsoft.com/free/)

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI using the following command

```azurecli
az extension add -y --source https://azureclitemp.blob.core.windows.net/spring-cloud/spring_cloud-0.1.0-py2.py3-none-any.whl
```
	
## View all deployments

Go to your service instance in the Azure portal and select **Deployment management** to view all deployments. You can select each deployment for more details.

## Create a staging deployment

1. In your local development environment, make a small modification to the Piggy Metric's gateway application. For instance, change the color in `gateway/src/main/resources/static/css/launch.css`. This will allow you to easily differentiate the two deployments. Run the following command to build the jar package: 

    ```azurecli
    mvn clean package
    ```

1. Create a new deployment with Azure CLI, giving it the staging deployment name "green".

    ```azurecli
    az spring-cloud app deployment create -g <resource-group-name> -s <service-instance-name> --app gateway -n green --jar-path gateway/target/gateway.jar
    ```

1. Once the deployment completes successfully, access the gateway page from the **Application Dashboard** and see all your instances in **App Instances** tab on the left.
  
> [!NOTE]
> The discovery status is "OUT_OF_SERVICE" so that traffic will not be routed to this deployment before verification is complete.

## Verify the staging deployment

1.Return to the **Deployment management** page and select your new deployment. The deployment status should show **Running**. The "Assign/Unassign domain" button will be disabled since it is a staging environment.

1. In the **Overview** page, you should see a **Test Endpoint**. Copy and paste it into a new browser page, and you should see the new Piggy Metrics page.

>[!TIP]
> * Confirm that your test endpoint ends with "/" to ensure the CSS loads correctly.  
> * If your browser requires you to enter login credentials to view the page, use [URL decode](https://www.urldecoder.org/) to decode your test endpoint. URL decode returns a URL in the form "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green".  Use this to access your endpoint.

>[!NOTE]    
> Config server settings apply to your staging environment as well as production. For example, if you set the context path (`server.servlet.context-path`) for your app gateway in config server as *somepath*, the path to your green deployment changes: "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green/somepath/..."
 
 If you visit your public facing app gateway at this point, you should see the old page without your new change.
    
## Set the green as production deployment

1. Having verified your change in your staging environment, you can push it to production. Return to **Deployment management** and select the checkbox before "gateway" application.
2. Select "Set deployment".
3. Select "Green" from the "PRODUCTION DEPLOYMENT" menu and select **Apply**
4. Go to your gateway application **Overview** page. If you have already assigned a domain for your gateway application, the URL will appear on the **Overview** page. Visit the URL and you will see the modified Piggy Metrics page.

>[!NOTE]
> Once the green deployment is set to production environment, the previous deployment becomes the staging deployment.

## Modify the staging deployment

If you are not satisfied with your change, you can modify your application code, build a new jar package, and upload it to your green deployment using the Azure CLI.

```azurecli
az spring-cloud app deploy  -g <resource-group-name> -s <service-instance-name> -n gateway -d green --jar-path gateway.jar
```

## Delete a staging deployment

Delete your staging deployment from the Azure port by navigating to your staging deployment page and selecting the **Delete** button.

Alternatively, delete your staging deployment from the Azure CLI with the following command:

```azurecli
az spring-cloud app deployment delete -n <staging-deployment-name> -g <resource-group-name> -s <service-instance-name> --app gateway
```
