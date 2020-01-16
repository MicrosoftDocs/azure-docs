---
title: Request time zone data
description: Learn how to request fresh time zone data using Azure Maps
author: farah-alyasari
ms.author: v-faalya
ms.date: 01/16/2020
ms.topic: How-to-guides
ms.service: azure-maps
services: azure-maps
manager: philmea
---

# Request time zone data using Time Zone APIs in Azure Maps

This guide shows you how to use the Time Zone APIs in Azure Maps to request time zone data. Although time zone data changes frequently, the Time Zone APIs give you fresh data. You can also use the APIs to map between the IANA and the Windows time zone.

Let's learn, how to:

* Request Time Zone by coordinates
* 

## Prerequisites

To make calls to any service in Azure Maps, you need a Maps account and a subscription key. You need to [Create an account](quick-demo-map-app.md#create-an-account-with-azure-maps) and [get primary key](quick-demo-map-app.md#get-the-primary-key-for-your-account) to follow the next steps. For more details on authentication in Azure Maps, see [manage authentication in Azure Maps](./how-to-manage-authentication.md).

This article uses the [Postman app](https://www.getpostman.com/apps) to make REST calls, but you can use any API development environment.

## Request Time Zone by coordinates

You can request time zone using longitude and latitude values.

1. Open the Postman app. Click **New**. Under **Create New**, select **Request** Give the **request** a name, and create a collection to store the requests. Select **New**. In the **Create New** window, select **Collection**. Name the collection and select the **Create** button.

