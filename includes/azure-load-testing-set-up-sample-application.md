---
title: "Include file"
description: "Include file"
services: load-testing
author: ntrogh
ms.service: load-testing
ms.author: nicktrog
ms.custom: "include file"
ms.topic: "include"
ms.date: 03/28/2022
---

1. Open a browser and go to the sample application's [source GitHub repository](https://github.com/Azure-Samples/nodejs-appsvc-cosmosdb-bottleneck.git).

    The sample application is a Node.js app that consists of an Azure App Service web component and an Azure Cosmos DB database.

1. Select **Fork** to fork the sample application's repository to your GitHub account.

    :::image type="content" source="./media/azure-load-testing-set-up-sample-application/fork-github-repo.png" alt-text="Screenshot that shows the button to fork the sample application's GitHub repo.":::

The sample application's repo contains an Apache JMeter script named *SampleApp.jmx*. The script tests the three APIs in the sample application:

* `add`: Performs an insert on Azure Cosmos DB to store the number of web app visitors.
* `get`: Performs a read operation on Azure Cosmos DB to retrieve the visitor count.
* `lasttimestamp`: Updates the in-memory time stamp of the last user visit.
