---
title: How to set up a staging environment in Azure Spring Cloud | Microsoft Docs
description: In this how-to, learn how to use blue-green deployment with Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---
# How to set up a staging environment

This article will show you how to create a staging (blue-green) deployment in Azure Spring Cloud. It will also show you how to put that staging deployment into production, avoiding changing the production deployment directly.

## Prerequisites

* An Azure Spring Cloud service instance that is already deployed and running. In this article, we use "PiggyMetrics" from our [tutorial on launching an application](spring-cloud-quickstart-launch-app-portal.md). It is composed of three applications: "gateway", "account-service", and "auth-service".
* [Azure Spring Cloud extension for Azure CLI](spring-cloud-quickstart-launch-app-cli.md) installed.
	

## View all deployments

Go to your service instance in the Azure portal and click **Deployment management** to view all deployments. You can click each deployment for more details.


## Create a staging deployment

1. In your local development environment, make a small modification to the Piggy Metric's gateway application. For instance, change the color in `gateway/src/main/resources/static/css/launch.css`. This will allow you to easily differentiate the two deployments in this example. Then, build the jar package by running the following command: 
    ```
    mvn clean package
    ```
1. Create a new deployment with Azure CLI, giving it the staging deployment name "green".
    ```Azure CLI
    az spring-cloud app deployment create -g <resource-group-name> -s <service-instance-name> --app gateway -n green --jar-path gateway/target/gateway.jar
    ```

1. Once deployment is successfully created, you can go to the gateway page from the **Application Dashboard** and see all your instances in **App Instances** tab on the left.
  
> [!NOTE]
> The discovery status is "OUT_OF_SERVICE" so that traffic will not be routed to this deployment before verification is done.


## Verify the staging deployment

1. Back in the **Deployment management** page, click your new deployment. You should see the deployment status is **Running**. The "Assign/Unassign domain" button will be disabled since it is a staging environment.

1. In the **Overview** page, you should see a **Test Endpoint**. Copy and paste it into a new browser page, and you should see the new Piggy Metrics page.
>[!TIP]
> * You should confirm test endpoint is end with "/" to ensure CSS loading.  
> * If your browser requires you to enter login credentials to view the page, you should use [URL decode](https://www.urldecoder.org/) to decode your test endpoint, you can get a "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green" URL to use instead of the Azure portal supplied URL.

>[!NOTE]    
> If you have config server settings, they will apply to your staging envrionment. For example, if you set `server.servlet.context-path` for your app gateway in config server as "/somepath", you should visit your api "/actuator" of green deployment at "https://\<username>:\<password>@\<cluster-name>.test.azureapps.io/gateway/green/somepath/actuator/"
 

 If you visit the public domain of app gateway currently, you should see the old page without your new change.
    
## Set the green as production deployment
1. Now you have verified your change on gateway application in your staging environment, you can put it into production for the end user. Go back to **Deployment management** and click the checkbox before "gateway" application.
1. Click "Set deployment" button.
1. Choose the "PRODUCTION DEPLOYMENT" drop down as "green", click **Apply**
1. Go to your gateway application **Overview** page. If you already had assigned a domain for your gateway application, that same URL will be on the **Overview** page. Visit the URL, and you will see the modified Piggy Metrics page.

>[!NOTE]
> Once the green deployment is set to production environment, the previous one becomes staging deployment.

## Modify the staging deployment
If you are not satisfied with your change, you can modify your application code, build a new jar package, and upload it to your green deployment by Azure CLI.
```
az spring-cloud app deploy  -g <resource-group-name> -s <service-instance-name> -n gateway -d green --jar-path gateway.jar
```

## Delete staging deployment
You can go to your staging deployment page to click the **Delete** button, or calling Azure CLI command:
```
az spring-cloud app deployment delete -n <staging-deployment-name> -g <resource-group-name> -s <service-instance-name> --app gateway
```

