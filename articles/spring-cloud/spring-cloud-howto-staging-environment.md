---
title: Set up a staging environment in Azure Spring Cloud | Microsoft Docs
description: Learn how to use blue-green deployment with Azure Spring Cloud
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 02/03/2020
ms.author: brendm

---

# Set up a staging environment in Azure Spring Cloud

This article discusses how to set up a staging deployment by using the blue-green deployment pattern in Azure Spring Cloud. Blue/green deployment is an Azure DevOps Continuous Delivery pattern that relies on keeping an existing (blue) version live, while a new (green) one is deployed. This article shows you how to put that staging deployment into production without changing the production deployment directly.

## Prerequisites

This article assumes that you've already deployed the PiggyMetrics application from our [tutorial about launching an Azure Spring Cloud application](spring-cloud-quickstart-launch-app-portal.md). PiggyMetrics comprises three applications: "gateway," "account-service," and "auth-service."  

If you want to use a different application for this example, you need to make a simple change in a public-facing portion of the application.  This change differentiates your staging deployment from production.

>[!TIP]
> Azure Cloud Shell is a free interactive shell that you can use to run the instructions in this article.  It has common, preinstalled Azure tools, including the latest versions of Git, JDK, Maven, and the Azure CLI. If you're signed in to your Azure subscription, start your [Azure Cloud Shell](https://shell.azure.com).  To learn more, see [Overview of Azure Cloud Shell](../cloud-shell/overview.md).

To set up a staging environment in Azure Spring Cloud, follow the instructions in the next sections.

## Install the Azure CLI extension

Install the Azure Spring Cloud extension for the Azure CLI by using the following command:

```azurecli
az extension add --name spring-cloud
```
    
## View all deployments

Go to your service instance in the Azure portal, and select **Deployment management** to view all deployments. To view more details, you can select each deployment.

## Create a staging deployment

1. In your local development environment, make a small modification to the PiggyMetrics gateway application. For instance, change the color in the *gateway/src/main/resources/static/css/launch.css* file. Doing so lets you easily differentiate the two deployments. To build the jar package, run the following command: 

    ```console
    mvn clean package
    ```

1. In the Azure CLI, create a new deployment, and give it the staging deployment name "green."

    ```azurecli
    az spring-cloud app deployment create -g <resource-group-name> -s <service-instance-name> --app gateway -n green --jar-path gateway/target/gateway.jar
    ```

1. After the deployment finishes successfully, access the gateway page from the **Application Dashboard**, and view all your instances in the **App Instances** tab on the left.
  
> [!NOTE]
> The discovery status is *OUT_OF_SERVICE* so that traffic won't be routed to this deployment before verification is complete.

## Verify the staging deployment

1. Return to the **Deployment management** page, and select your new deployment. The deployment status should show *Running*. The **Assign/Unassign domain** button should appear grayed, because the environment is a staging environment.

1. In the **Overview** pane, you should see a **Test Endpoint**. Copy and paste it into a new browser window, and the new PiggyMetrics page should be displayed.

>[!TIP]
> * Confirm that your test endpoint ends with a slash (/) to ensure that the CSS file is loaded correctly.  
> * If your browser requires you to enter login credentials to view the page, use [URL decode](https://www.urldecoder.org/) to decode your test endpoint. URL decode returns a URL in the form "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green".  Use this form to access your endpoint.

>[!NOTE]    
> Config server settings apply to both your staging environment and production. For example, if you set the context path (`server.servlet.context-path`) for your app gateway in config server as *somepath*, the path to your green deployment changes to "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green/somepath/...".
 
 If you visit your public-facing app gateway at this point, you should see the old page without your new change.
    
## Set the green deployment as the production environment

1. After you've verified your change in your staging environment, you can push it to production. Return to **Deployment management**, and select the **gateway** application check box.

2. Select **Set deployment**.
3. In the **Production Deployment** list, select **Green**, and then select **Apply**.
4. Go to your gateway application **Overview** page. If you've already assigned a domain for your gateway application, the URL will appear in the **Overview** pane. To view the modified PiggyMetrics page, select the URL, and go to the site.

>[!NOTE]
> After you've set the green deployment as the production environment, the previous deployment becomes the staging deployment.

## Modify the staging deployment

If you're not satisfied with your change, you can modify your application code, build a new jar package, and upload it to your green deployment by using the Azure CLI.

```azurecli
az spring-cloud app deploy  -g <resource-group-name> -s <service-instance-name> -n gateway -d green --jar-path gateway.jar
```

## Delete the staging deployment

To delete your staging deployment from the Azure port, go to your staging deployment page, and then select the **Delete** button.

Alternatively, delete your staging deployment from the Azure CLI by running the following command:

```azurecli
az spring-cloud app deployment delete -n <staging-deployment-name> -g <resource-group-name> -s <service-instance-name> --app gateway
```
