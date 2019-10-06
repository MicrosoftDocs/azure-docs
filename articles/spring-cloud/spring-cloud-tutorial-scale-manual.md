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

This tutorial will show you how to use the scaling functionality for any microservice application in your Azure Spring Cloud dashboard on the Azure portal. You can modify the number of virtual CPUs (vCPUs) and the amount of memory, also known as scaling up and down. You can also modify the number of instances of an application, also known as scaling out and in. When you are finished, you will be able to make quick manual adjustments as needed for each application in your service. Scaling takes effect in seconds, and does not require any code changes or redeployment.

## Prerequisites

To complete this tutorial, you need:
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* A deployed Azure Spring Cloud in Azure instance
* At least one application already created in that service instance


## Navigate to the Scale page in the Azure portal

1. Log in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Spring Cloud **Overview** page.

1. Go to the **Apps**  tab under the **Settings** heading in the menu on the left side.

1. Select the application you want to scale. In this example, we will be scaling the application named "account-service". This should take you to the application's **Overview** page.

1. Go to the **Scale** tab under the **Settings** heading in the menu on the left side. Now you should see a form with lines for each of the scaling attributes we mentioned earlier, like the screenshot below.

## Scale your application

Now you can modify the scaling attributes. Keep the following notes in mind.

- **CPUs**: The maximum number of CPUs allowed is 4. This value per application instance, so the total number of CPUs for an application will be the value set here multiplied by the number of application instances.

- **Memory/GB**: The maximum amount of memory allowed is 8GB. This value per application instance, so the total amount of memory for an application will be the value set here multiplied by the number of application instances.

- **Instance count**: You can scale out up to 20 instances in the Standard tier. This value changes the number of separate running instances of the microservice application.

Be sure to click the **Save** button apply your scaling settings.

After a few seconds, the changes you made will be displayed in the **Overview** page, with more details available in the **Application instances** tab. Scaling does not require any code changes or redeployment.