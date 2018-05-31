---
title: Create and populate an Azure Time Series Insights environment
description: Learn how to create your own Time Series Insights environment, and populate it with data from simulated devices.
author: BryanLa
ms.service: time-series-insights
ms.topic: tutorial
ms.date: 06/04/2018
ms.author: bryanla
# Customer intent: As a data analyst or developer, I want learn how to create and populate a TSI environment, so I can use queries to understand the behavior of my devices.
---

# Tutorial: Create and populate an Azure Time Series Insights environment

This tutorial will guide you through the process of creating and populating your own Time Series Insight (TSI) environment. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a device simulation to generate sample data
> * Create a TSI environment 
> * Connect the TSI environment to the IoT hub event source
> * Stream the sample data into the IoT hub and TSI environment

## Prerequisites

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/) before you begin. 

Your Azure sign-in account also needs to be a member of the subscription's "Owner" role. For details, see [Add or change Azure subscription administrators](/azure/billing/billing-add-change-azure-subscription-administrator)

## Overview

The TSI environment is where device data is collected and stored. Once stored in the TSI environment, you can use the [TSI Explorer](time-series-quickstart.md) and [TSI Query API](time-series-insights-reference-queryapi.md) to query and analyze the data.

Like all devices, simulated or physical, IoT Hub is the connection point used by devices to securely connect and transmit data to the cloud. As discussed in the [TSI Overview](time-series-insights-overview.md), IoT Hub also provides an event source, for streaming data into the TSI environment. 

This tutorial will use an [IoT solution accelerator](/azure/iot-accelerators/), to generate and stream sample data to IoT Hub. IoT solution accelerators provide enterprise-grade preconfigured solutions, that enable you to accelerate the development of custom IoT solutions. 

### H3
<!--
   [![TSI Client Sample with DevTools](media/tutorial-explore-js-client-lib/tcs-devtools-callouts-head-body.png)](media/tutorial-explore-js-client-lib/tcs-devtools-callouts-head-body.png#lightbox)
-->

## Create a TSI environment

First, create a TSI environment in your Azure subscription:

1. Sign in to the [Azure portal](https://portal.azure.com) using your Azure subscription account. 
2. Select **+ Create a resource** in the upper left.
3. Select the **Internet of Things** category, then select **Time Series Insights**.
   
   ![Select the Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi.png)

4. On the **Time Series Insights environment** panel, fill in the required parameters. Then click **Create** to begin the provisioning process:
   
   Setting|Description
   ---|---
   Environment name | Choose a unique name for the TSI environment, used by TSI Explorer and the TSI Query API.
   Subscription | Choose a subscription to contain your TSI environment and IoT Hub.
   Resource group | A resource group is a collection of Azure resources used together. You can choose an existing resource group, create a new one.
   Location | Choose a data center region to contain your TSI environment and IoT Hub. To avoid added cross-region and cross-zone bandwidth costs and added latency, it's best to keep them in the same region.
   Pricing SKU | Choose the throughput needed. For lowest cost and starter capacity, select S1.
   Capacity | Capacity is the multiplier applied to the ingress rate, storage capacity, and cost associated with the selected SKU.  You can change capacity of an environment after creation. For lowest cost, select a capacity of 1. 

   ![Create a Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-params.png)

5. After the deployment succeeds, you'll have a new TSI environment resource, created in the new/existing resource group you specified:  

   ![Time Series Insights environment deployment succeeded](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-deployment-succeeded.png)

## Create a device simulation

Next, create the device simulation solution, which will generate test data to populate your TSI environment:

1. Go to https://www.azureiotsolutions.com, sign-in using your Azure subscription account, and select the "Device Simulation" accelerator:

   ![Run the Device Simulation accelerator](media/tutorial-create-populate-tsi-environment/sa-main.png)

2. x


Note: this creates a several resources in your subscription, including an IoT Hub instance, XX web app, etc.. The web app requires sign-in, and consent upon first use:


## Connect the TSI environment to the IoT hub event source



## Stream the sample data to IoT hub and into the TSI environment



## Clean up resources

If you plan to continue working through the next tutorial, do not clean up the resources created in this tutorial and proceed to [Next steps](#next-steps). If you do not plan to continue, use the following steps to delete all resources created by this Tutorial:  
- Close the device client sample output window on your machine.
- Close the TPM simulator window on your machine.
- From the left-hand menu in the Azure portal, click All resources and then select your Device Provisioning service. At the top of the All resources blade, click Delete. 
- From the left-hand menu in the Azure portal, click All resources and then select your IoT hub. At the top of the All resources blade, click Delete. 

-OR-

At this point, you might have the IoT Hub and TSI Environment services running in the portal. If you wish to abandon and/or delay completion of this tutorial series, we recommend shutting them down to avoid incurring unnecessary costs:

- From the left-hand menu in the Azure portal, click All resources and then select your Device Provisioning service. At the top of the All resources blade, click Delete. 
- From the left-hand menu in the Azure portal, click All resources and then select your IoT hub. At the top of the All resources blade, click Delete.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Sign in and explore the TSI Sample application and its source
> * Use APIs in the TSI JavaScript client library
> * Use JavaScript to create and populate chart controls with TSI data

Now that you know how to create your own TSI environment, learning more about the planning process by advancing to the following article:

> [!div class="nextstepaction"]
> [Plan your Azure Time Series Insights environment](time-series-insights-environment-planning.md)


