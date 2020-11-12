---
title: Tutorial of IoT Connected logistics | Microsoft Docs
description: A tutorial of Connected logistics application template for IoT Central
author: KishorIoT
ms.author: nandab
ms.service: iot-central
ms.subservice: iot-central-retail
ms.topic: tutorial
ms.date: 10/20/2019

---

# Tutorial: Deploy and walk through a connected logistics application template

This tutorial shows you how to get started with the IoT Central *connected logistics* application template. You'll learn how to deploy and use the template.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a connected logistics application.
> * Use the key features in the application.
> * Use Dashboard to show the critical logistics device operations activity.
> * Use Device Template
> * Follow Rules
> * Use Jobs

## Prerequisites

* There are no specific prerequisites required to deploy this app.
* You can use the free pricing plan or use an Azure subscription.

## Create connected logistics application

Create the application using following steps:

1. Navigate to the [Azure IoT Central Build](https://aka.ms/iotcentral) site. Then sign in with a Microsoft personal, work, or school account. Select **Build** from the left-hand navigation bar and then select the **Retail** tab:

    :::image type="content" source="media/tutorial-iot-central-connected-logistics/iotc-retail-homepage.png" alt-text="Connected logistics template":::

2. Select **Create app** under **Connected Logistics Application**.

3. **Create app** opens the **New application** form. Enter the following details:


    * **Application name**: you can use default suggested name or enter your friendly application name.
    * **URL**: you can use suggested default URL or enter your friendly unique memorable URL. Next, the default setting is recommended if you already have an Azure Subscription. You can start with 7-day free trial pricing plan and choose to convert to a standard pricing plan at any time before the free trail expires.
    * **Billing Info**: The directory, Azure subscription, and region details are required to provision the resources.
    * **Create**: Select create at the bottom of the page to deploy your application.

    :::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-app-create.png" alt-text="Connected logistics app template":::

    :::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-app-create-billinginfo.png" alt-text="Connected logistics billing info":::

## Walk through the application

Below is the screenshot showing how to select the connected logistics application template.

> [!div class="mx-imgBorder"]
> ![Screenshot showing how to select the connected logistics application template](./media/tutorial-iot-central-connected-logistics/iotc-retail-homepage.png)

The following sections walk you through the key features of the application.

### Dashboard

After deploying the application template, your default dashboard is a connected logistics operator focused portal. Northwind Trader is a fictitious logistics provider managing a cargo fleet at sea and on land. In this dashboard, you see two different gateways providing telemetry from shipments, along with associated commands, jobs, and actions.

> [!div class="mx-imgBorder"]
> ![Screenshot showing how to create an app from the connected logistics application template](./media/tutorial-iot-central-connected-logistics/connected-logistics-app-create.png)

> [!div class="mx-imgBorder"]
> ![Screenshot showing the billing options when you create the application](./media/tutorial-iot-central-connected-logistics/connected-logistics-app-create-billinginfo.png)

This dashboard is pre-configured to show the critical logistics device operations activity.

The dashboard enables two different gateway device management operations:

* View the logistics routes for truck shipments and the location details of ocean shipments.
* View the gateway status and other relevant information.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-dashboard1.png" alt-text="Connected logistics dashboard":::

* You can track the total number of gateways, active, and unknown tags.
* You can do device management operations such as: update firmware, disable and enable sensors, update a sensor threshold, update telemetry intervals, and update device service contracts.
* View device battery consumption.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-dashboard2.png" alt-text="Connected logistics dashboard status":::

#### Device Template

Select **Device templates** to see the gateway capability model. A capability model is structured around the **Gateway Telemetry & Property** and **Gateway Commands** interfaces.

**Gateway Telemetry & Property** - This interface defines all the telemetry related to sensors, location, and device information. The interface also defines device twin property capabilities such as sensor thresholds and update intervals.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-devicetemplate1.png" alt-text="Telemetry and property interface":::

**Gateway Commands** - This interface organizes all the gateway command capabilities:

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-devicetemplate2.png" alt-text="Gateway commands interface":::

### Rules

Select the **Rules** tab to the rules in this application template. These rules are configured to email notifications to the operators for further investigations:

**Gateway theft alert**: This rule triggers when there's unexpected light detection by the sensors during the journey. Operators must be notified immediately to investigate potential theft.

**Unresponsive Gateway**: This rule triggers if the gateway doesn't report to the cloud for a prolonged period. The gateway could be unresponsive because of low battery, loss of connectivity, or device damage.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-rules.png" alt-text="Rule definitions":::

### Jobs

Select the **Jobs** tab to see the jobs in this application:

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-jobs.png" alt-text="Jobs to run":::

You can use jobs to do application-wide operations. The jobs in this application use device commands and twin capabilities to do tasks such as disabling specific sensors across all the gateways or modifying the sensor threshold depending on the shipment mode and route:

* It's a standard operation to disable shock sensors during ocean shipment to conserve battery or lower temperature threshold during cold chain transportation.

* Jobs enable you to do system-wide operations such as updating firmware on the gateways or updating service contract to stay current on maintenance activities.

## Clean up resources

If you're not going to continue to use this application, delete the application template by visiting **Administration** > **Application settings** and select **Delete**.

:::image type="content" source="media/tutorial-iot-central-connected-logistics/connected-logistics-cleanup.png" alt-text="Template cleanup":::

## Next steps
* Learn more about 
> [!div class="nextstepaction"]
> [Connected logistics concept](./architecture-connected-logistics.md)
* Learn more about other 
[IoT Central retail templates](./overview-iot-central-retail.md)
* Learn more about 
[IoT Central overview](../core/overview-iot-central.md)
