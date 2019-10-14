---
title: "Tutorial: Scale an application in Azure Spring Cloud | Microsoft Docs"
description: In this tutorial, you learn how to scale an application in Azure Spring Cloud on the Azure portal
services: spring-cloud
ms.service: spring-cloud
ms.topic: tutorial
ms.reviewer: jeconnoc
ms.author: v-vasuke
author: v-vasuke
ms.date: 10/06/2019
---

# Tutorial: Scale an application in Azure Spring Cloud

This tutorial demonstrates how to scale any microservice application using the Azure Spring Cloud dashboard in the Azure portal. Scale your application up and down by modifying the number of virtual CPUs (vCPUs) and the amount of memory. Scale your application in and out by modifying the number of instances of the application. When you are finished, you will know how to make quick manual adjustments to each application in your service. Scaling takes effect in seconds and does not require any code changes or redeployment.

## Prerequisites

To complete this tutorial, you need:
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* A deployed Azure Spring Cloud service instance.  Follow our [quickstart](spring-cloud-quickstart-launch-app-cli.md) to get started.
* At least one application already created in that service instance.


## Navigate to the Scale page in the Azure portal

1. Log in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Spring Cloud **Overview** page.

1. Go to the **Apps**  tab under the **Settings** heading in the menu on the left side.

1. Select the application you want to scale. In this example, we will be scaling the application named "account-service". This should take you to the application's **Overview** page.

1. Go to the **Scale** tab under the **Settings** heading in the menu on the left side. You should see a form with lines for each of the scaling attributes we mentioned earlier.

## Scale your application

You can modify the scaling attributes. Keep the following notes in mind.

* **CPUs**: The maximum number of CPUs allowed is 4 per application instance. The total number of CPUs for an application will be the value set here multiplied by the number of application instances.

* **Memory/GB**: The maximum amount of memory allowed is 8GB per application instance.  The total amount of memory for an application will be the value set here multiplied by the number of application instances.

* **Instance count**: You can scale out up to 20 instances in the Standard tier. This value changes the number of separate running instances of the microservice application.

Be sure to click the **Save** button apply your scaling settings.

After a few seconds, the changes you made will be displayed in the **Overview** page, with more details available in the **Application instances** tab. Scaling does not require any code changes or redeployment.

## Next steps

In this tutorial, you learned how to manually scale your Azure Spring Cloud applications.  To learn how to monitor your application, continue to the next tutorial.

> [!div class="nextstepaction"]
> [Learn how to monitor your application](spring-cloud-tutorial-distributed-tracing.md)
