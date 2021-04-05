---
title: Deploying Azure SQL Edge on turbines in a Contoso wind farm
description: In this tutorial, you'll use Azure SQL Edge for wake-detection on the turbines in a Contoso wind farm.
keywords: 
services: sql-edge
ms.service: sql-edge
ms.topic: tutorial
author: VasiyaKrishnan
ms.author: vakrishn
ms.reviewer: sstein
ms.date: 12/18/2020
---
# Using Azure SQL Edge to build smarter renewable resources

This Azure SQL Edge demo is based on a Contoso Renewable Energy, a wind turbine farm that uses SQL DB edge for data processing onboard the generator. 

This demo will walk you through resolving an alert being raised because of wind turbulence being detected at the device. You will train a model and deploy it to SQL DB Edge that will correct the detected wind wake and ultimately optimize power output.

Azure SQL Edge - renewable Energy demo video on Channel 9:
> [!VIDEO https://channel9.msdn.com/Shows/Data-Exposed/Azure-SQL-Edge-Demo-Renewable-Energy/player]

## Setting up the demo on your local computer
Git will be used to copy all files from the demo to your local computer. 

1. Install git from [here](https://git-scm.com/download).
2. Open a command prompt and navigate to a folder where the repo should be downloaded. 
3. Issue the command https://github.com/microsoft/sql-server-samples.git.
4. Navigate to **'sql-server-samples\samples\demos\azure-sql-edge-demos\Wind Turbine Demo'** in the location where the repository is cloned.
5. Follow the instructions in README.md to set up the demo environment and execute the demo.