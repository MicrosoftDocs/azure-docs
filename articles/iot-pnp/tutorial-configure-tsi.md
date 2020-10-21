---
title: Use Time Series Insights to store and analyze your IoT Plug and Play device telemetry  | Microsoft Docs
description: Set up a Time Series Insights environment and connect your IoT Hub to view and analyze telemetry from your IoT Plug and Play devices.
author: lyrana
ms.author: lyhughes
ms.date: 10/14/2020
ms.topic: tutorial
ms.service: iot-pnp
services: iot-pnp

# As a IoT solution builder, I want to see historize and analyze data from my IoT Plug and Play certified device by setting up and routing to Time Series Insights.
---

# Tutorial: Create and Connect to Time Series Insights Gen2 to store, visualize, and analyze IoT Plug and Play device telemetry

In this tutorial, you'll learn how to create and correclty configure an [Azure Time Series Insights Gen2](https://docs.microsoft.com/azure/time-series-insights/overview-what-is-tsi) (TSI) environment to integrate with your IoT Plug and Play solution. With TSI, you can collect, process, store, query and visualize time series data at Internet of Things (IoT) scale.

First you'll provision a TSI environment and connecting your IoT Hub as a streaming event source, then you'll work through model synchronization between to map your models and interfaces already defined using the [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl) to your TSI environment's Time Series Model.