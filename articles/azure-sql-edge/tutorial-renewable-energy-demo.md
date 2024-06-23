---
title: Deploying Azure SQL Edge on turbines in a Contoso wind farm
description: This tutorial shows you how to use Azure SQL Edge for wake-detection on the turbines in a Contoso wind farm.
author: kendalvandyke
ms.author: kendalv
ms.reviewer: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: tutorial
---
# Use Azure SQL Edge to build smarter renewable resources

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

The [Wind Turbine Demo](https://github.com/microsoft/sql-server-samples/tree/master/samples/demos/azure-sql-edge-demos/Wind%20Turbine%20Demo) for Azure SQL Edge is based on Contoso Renewable Energy, a wind turbine farm that uses SQL Edge for data processing onboard the generator.

This demo walks you through resolving an alert being raised because of wind turbulence being detected at the device. You'll train a model and deploy it to SQL Edge, which corrects the detected wind wake and ultimately optimizes power output.

Azure SQL Edge - renewable Energy demo video on Channel 9:

<br />

> [!VIDEO https://learn.microsoft.com/shows/Data-Exposed/Azure-SQL-Edge-Demo-Renewable-Energy/player]

## Set up the demo on your local computer

Git is used to copy all files from the demo to your local computer.

1. Install [Git](https://git-scm.com/download).
1. Open a command prompt and navigate to a folder where the repo should be downloaded.
1. Issue the command `git clone https://github.com/microsoft/sql-server-samples.git`.
1. Navigate to `sql-server-samples\samples\demos\azure-sql-edge-demos\Wind Turbine Demo` in the location where the repository is cloned.
1. Follow the instructions in `README.md` to set up the demo environment and execute the demo.
