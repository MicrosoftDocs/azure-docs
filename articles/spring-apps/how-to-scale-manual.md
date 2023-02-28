---
title: "Scale an application in Azure Spring Apps | Microsoft Docs"
description: Learn how to scale an application with Azure Spring Apps in the Azure portal
ms.service: spring-apps
ms.topic: how-to
ms.author: karler
author: karlerickson
ms.date: 10/06/2019
ms.custom: devx-track-java, event-tier1-build-2022
---

# Scale an application in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article demonstrates how to scale any Spring application using the Azure Spring Apps dashboard in the Azure portal.

Scale your application up and down by modifying its number of virtual CPUs (vCPUs) and amount of memory. Scale your application in and out by modifying the number of application instances.

After you finish, you'll know how to make quick manual changes to each application in your service. Scaling takes effect in seconds and doesn't require any code changes or redeployment.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* A deployed Azure Spring Apps service instance.  Follow the [quickstart on deploying an app via the Azure CLI](./quickstart.md) to get started.
* At least one application already created in your service instance.

## Navigate to the Scale page in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps instance.

1. Select **Apps** under **Settings** in the navigation pane.

1. Select the application you want to scale and then select **Scale up** in the navigation pane. The **Scale up** page provides options to scale the attributes of your application, as described in the following section.

## Scale your application

If you modify the scaling attributes, keep the following notes in mind:

* **CPUs**: The maximum number of CPUs per application instance is four. The total number of CPUs for an application is the value set here multiplied by the number of application instances.

* **Memory/GB**: The maximum amount of memory per application instance is 8 GB. The total amount of memory for an application is the value set here multiplied by the number of application instances.

* **App instance count**: In the Standard tier, you can scale out to a maximum of 20 instances. This value changes the number of separate running instances of the Spring application.

Be sure to select **Save** to apply your scaling settings.

:::image type="content" source="media/how-to-scale-manual/scale-up-out.png" alt-text="Screenshot of the Azure portal showing the Scale up page for an app in an Azure Spring Apps instance, with Scale up highlighted in the navigation pane." lightbox="media/how-to-scale-manual/scale-up-out.png":::

Select **App instance** in the navigation pane for details about the instance of the app. After a few seconds, the scaling changes you made are reflected on the **Overview** page of the app. Scaling doesn't require any code changes or redeployment.

## Upgrade to the Standard tier

If you are on the Basic tier and constrained by one or more of these [limits](./quotas.md), you can upgrade to the Standard tier. To do this go to the Pricing tier menu by first selecting the **Standard tier** column and then selecting the **Upgrade** button.

## Next steps

This example explained how to manually scale an application in Azure Spring Apps. To learn how to monitor an application by setting up alerts, see [Set-up autoscale](./how-to-setup-autoscale.md).

> [!div class="nextstepaction"]
> [Learn how to set up alerts](./tutorial-alerts-action-groups.md)
