---
title: "Scale an Application in Azure Spring Apps"
description: Learn how to scale an application with Azure Spring Apps in the Azure portal
ms.service: azure-spring-apps
ms.topic: how-to
ms.author: karler
author: KarlErickson
ms.date: 06/27/2024
ms.custom: devx-track-java
---

# Scale an application in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article demonstrates how to scale a Spring application using Azure Spring Apps in the Azure portal.

You can scale your app up and down by modifying its number of virtual CPUs (vCPUs) and amount of memory. Scale your app in and out by modifying the number of application instances.

After you finish, you'll know how to make quick manual changes to each application in your service. Scaling takes effect within seconds and doesn't require any code changes or redeployment.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A deployed Azure Spring Apps service instance. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md) to get started.
* At least one application already created in your service instance.

## Navigate to the Scale page in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps instance.

1. Select **Apps** under **Settings** in the navigation pane.

1. Select the app you want to scale and then select **Scale up** in the navigation pane. Specify the **vCPU** and **Memory** settings using the guidelines as described in the following section.

1. Select **Scale out** in the navigation pane. Specify the **instance  count** setting as described in the following section.

## Scale your application

As you modify the scaling attributes, keep the following notes in mind:

* **vCPU**: The total number of CPUs for an application is the value set here multiplied by the number of application instances.

* **Memory**: The total amount of memory for an application is the value set here multiplied by the number of application instances.

* **instance count**: This value changes the number of separate running instances of the Spring application.

Be sure to select **Save** to apply your scaling settings.

:::image type="content" source="media/how-to-scale-manual/scale-up-out.png" alt-text="Screenshot of the Azure portal that shows the Scale up page for an app with Scale up highlighted." lightbox="media/how-to-scale-manual/scale-up-out.png":::

After a few seconds, the scaling changes you make are reflected on the **Overview** page of the app. Select **App instance** in the navigation pane for details about the instance of the app.

> [!NOTE]
> For more information about the maximum number of CPUs, the amount of memory, and the instance count, see [Quotas and service plans for Azure Spring Apps](./quotas.md).

## Next steps

This example explained how to manually scale an application in Azure Spring Apps. To learn how to monitor an application by setting up alerts, see [Set-up autoscale](./how-to-setup-autoscale.md).

> [!div class="nextstepaction"]
> [Learn how to set up alerts](./tutorial-alerts-action-groups.md)
