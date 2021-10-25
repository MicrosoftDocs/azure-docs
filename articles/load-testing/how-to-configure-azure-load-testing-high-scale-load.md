---
title: Configure Azure Load Testing Service for high scale load tests
titleSuffix: Azure Load Testing
description: Learn how to configure Azure Load Testing Service to run high scale load tests
services: load-testing
ms.service: load-testing
ms.author: jmartens
author: j-martens
ms.date: 10/20/2021
ms.topic: how-to

---

# Configure Azure Load Testing Service to run high scale load tests

In this article, you'll learn how to run high scale load tests using the Azure Load Testing Service on the **Azure Portal**.  

In this article you'll learn how to:  

> [!div class="checklist"]  

> - Understand the relationship between Virtual Users (VUs) and Requests/Second (RPS)  
> - Configuring your test plan and the load test resource for running a high scale test  

## Prerequisites  

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.  
- An Azure Load Testing Resource created. If you need to create a Load Test Resource, see [How to create the Load Test Resource](/cli/azure/install-azure-cli).  

## Understand the relationship between VUs and RPS  

- The maximum RPS that can be generated depends on the application's latency and the VUs. Think of it as RPS  = (# of VUs) * (1/Latency). For example, if application latency is 20 ms and you're generating a load of 2000VUs, the RPS achieved is around 100,000.  

## Configure your test plan and load test resource for running a high scale test  

Engine instances help define how you want to scale out for increased load generation for your application. We recommend:

- Set threads in the Apache JMeter test plan to a maximum of 250. This setting represents the number of threads executed by one engineInstance.  
- Set engineInstances accordingly to reach total desired threads. For example, set engineInstances = 4 to reach 1,000 total threads.  
