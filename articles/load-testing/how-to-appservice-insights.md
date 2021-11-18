---
title: Get more insights when testing AppService Workloads
titleSuffix: Azure Load Testing
description: Get more insights when testing AppService workloads using App Service Diagnostics
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 11/09/2021
ms.topic: how-to

---

# Get more insights when testing AppService workloads  

In this article, you'll learn how to gain more insights when testing AppService workloads using App Service Diagnostics in **Azure portal**.  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing Resource already created. If you need to create a Load Test Resource, see the quickstart [Create and run a load test](./quickstart-create-and-run-load-test.md).  
- An app service workload you're running your load test against and that you've added to the resources to monitor for the test.  

## Get more insights when testing an App Service Workload  

1. Add the App Service resources in the list of resources to monitor.  
2. Once the test executes successfully, you'll see a section with the text: "Get more detailed insights about your app service resource by clicking here."  
3. The link opens the diagnostics page for your App Service resource. The page shows extra analysis of your test data.  

    > [!IMPORTANT]
    > Please note that it may take up to 45 minutes from test completion for the analysis to be complete.  

    > [!TIP]
    > You can learn more about App Service diagnostics at [Azure App Service diagnostics overview](/app-service/overview-diagnostics/).  
