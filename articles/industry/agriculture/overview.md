---
title: Overview of Azure FarmBeats
description: Provides an overview of Azure FarmBeats
author: uhabiba04
ms.topic: overview
ms.date: 11/04/2019
ms.author: v-umha
---


# Overview of Azure FarmBeats

Azure FarmBeats is a collection of Azure services and capabilities, designed to help you rapidly build intelligent data-driven solutions in agriculture. Azure FarmBeats is an Azure marketplace offering that allows you to acquire, aggregate, and process agriculture-related data from various sources such as sensors, drones, cameras, satellite, without investing in deep data engineering resources.

> [!NOTE]
> Azure FarmBeats is currently in public preview. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Azure FarmBeats is provided without a service level agreement. Use the [Azure FarmBeats Forum](https://aka.ms/FarmBeatsMSDN ) for support.

Using Azure FarmBeats you will be able to get data from various sources like sensors, satellite, drones, all in the context of a farm (a geographical area of interest).

You will be able to:

- Aggregate agricultural datasets from various providers
- Rapidly build Artificial Intelligence/ Machine Language (AI/ML) models by fusing different datasets

Azure FarmBeats provides you with a robust and easy way to do the following:

- Create a map for the farm by using GeoJSON file.
- Assess farm health using vegetation index and water index based on satellite imagery.
- Get recommendations on how many sensors to use and where to place them.
- Track farm condition by visualizing ground data collected by sensors from various sensor vendors.
- Get soil moisture map based on the fusion of satellite and sensor data.
- Gain actionable insights by building AI/ML models on top of aggregated datasets.
- Build or augment your digital agriculture solution by providing farm health advisories.

Azure FarmBeat components are discussed in the following sections of this article.

## Data hub

An API layer, which enables aggregation, normalization, and contextualization of various agriculture datasets across providers. As of this preview, you can leverage two sensor providers [Davis Instruments](https://www.davisinstruments.com/product/enviromonitor-gateway/), [Teralytic](https://teralytic.com/), one satellite imagery provider [Sentinel-2](https://sentinel.esa.int/web/sentinel/home), and two drone imagery providers [senseFly](https://www.sensefly.com/) , [SlantRange](https://slantrange.com/). Data hub is designed as an API platform and we are working with many more providers to integrate with Azure FarmBeats, so you have more choice while building your solution.

## Accelerator

A sample solution, built on top of Data hub, that jumpstarts your user interface and model development. This web application leverages APIs to demonstrate visualization of ingested sensor data as charts and visualization of model output as maps. For example, you can use the accelerator to quickly create a farm and easily get a vegetation index map or a sensor placement map for that farm.

## Resources

Visit FarmBeats [blog](https://aka.ms/AzureFarmBeats) and [forums](https://aka.ms/FarmBeatsMSDN).

## Next steps

To get started with Azure FarmBeats, visit [Azure marketplace](https://aka.ms/FarmBeatsMarketplace) to deploy.
