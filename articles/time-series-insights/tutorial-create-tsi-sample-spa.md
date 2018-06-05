---
title: Create an Azure Time Series Insights single-page web app
description: Learn how to create an single-page web application that queries and renders data from a TSI environment.
author: BryanLa
ms.service: time-series-insights
ms.topic: tutorial
ms.date: 06/10/2018
ms.author: bryanla
# Customer intent: As a developer, I want learn how to create my own Time Series Insights single-page web application (SPA), so I can apply the principles to building my own SPA.
---

# Tutorial: Create an Azure Time Series Insights single-page web app

This tutorial will guide you through the process of creating a single-page web app (SPA), modeled after the [Time Series Insights (TSI) sample application](https://insights.timeseries.azure.com/clientsample). In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * X 
> * Y
> * Z 

## Prerequisites

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/) before you begin. 

If you haven't established your own TSI environment, complete the [Create an Azure Time Series Insights environment](tutorial-create-populate-tsi-environment.md) first, before starting this one.

## Overview

As mentioned, the TSI sample application provides the basis for the design and code of this tutorial. The TSI sample application is an SPA, which uses the TSI Client JavaScript library to query and render data from a TSI environment. Both the library source and SPA page source are available in the [tslclient GitHub repository](https://github.com/Microsoft/tsiclient).

The TSI Client JavaScript library provides an abstraction for two important categories:
- **Wrapper methods for calling the TSI Query APIs**: REST APIs that allow you to query for TSI data by using aggregate expressions. The methods are organized under the `TsiClient.Server` namespace of the library.
- **Methods for creating and populating several types of charting controls**: Methods that are used for rendering the TSI aggregate data in a web page. The methods are organized under the `TsiClient.UX` namespace of the library.

For an overview of the structure of the TSI sample app, and how it uses the TSI Client library, please refer to the [Explore the Azure Time Series Insights JavaScript client library](tutorial-explore-js-client-lib.md) tutorial.


## Download the TSI sample application source code


## Register the application with Azure AD 

First, xxxx:

1. Sign in to the [Azure portal](https://portal.azure.com) using your Azure subscription account.  
2. Select **+ Create a resource** in the upper left.  
3. Select the **Internet of Things** category, then select **Time Series Insights**.  
   
   [![Select the Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi.png)](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi.png#lightbox)

4. On the **Time Series Insights environment** page, fill in the required parameters:
   
   Parameter|Description
   ---|---
   **Environment name** | Choose a unique name for the TSI environment. The name is used by TSI Explorer and the Query API.
   **Subscription** | Subscriptions are containers for Azure resources. Choose the subscription where you want to create the TSI environment.
   **Resource group** | A resource group is a container for Azure resources. Choose an existing resource group, or create a new one, for the TSI environment resource.
   **Location** | Choose a data center region for your TSI environment. To avoid added bandwidth costs and latency, it's best to keep the TSI environment in the same region as other IoT resources.
   **Pricing SKU** | Choose the throughput needed. For lowest cost and starter capacity, select S1.
   **Capacity** | Capacity is the multiplier applied to the ingress rate, storage capacity, and cost associated with the selected SKU.  You can change capacity of an environment after creation. For lowest cost, select a capacity of 1. 

   When finished, click **Create** to begin the provisioning process.

   ![Create a Time Series Insights environment resource](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-params.png)

5. You can check the **Notifications** panel to monitor deployment completion, which should take less than a minute:  

   ![Time Series Insights environment deployment succeeded](media/tutorial-create-populate-tsi-environment/ap-create-resource-tsi-deployment-succeeded.png)

## Section 2

Next, xxxx


## Section 3 


## Clean up resources

This tutorial creates several running Azure services, to support the SPA web application. If you wish to abandon and/or delay completion of this tutorial series, we recommend deleting all resources to avoid incurring unnecessary costs. 

From the left-hand menu in the Azure portal:

1. Click the **Resource groups** icon, then select the resource group you created for the TSI Environment. At the top of the page, click **Delete resource group**, enter the name of the resource group, then click **Delete**. 
2. Click the **Resource groups** icon, then select the resource group that was created by the device simulation solution accelerator. At the top of the page, click **Delete resource group**, enter the name of the resource group, then click **Delete**. 

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a TSI environment 

Now that you know how to create your own TSI SPA web application, learn more about XXXX, by advancing to the following article:

> [!div class="nextstepaction"]
> [XXXX](xxx.md)


