---
title: Frequently asked questions on Priority-based execution in Azure Cosmos DB
titleSuffix: Azure Cosmos DB
description: Frequently asked questions on Priority-based execution in Azure Cosmos DB
author: richagaur
ms.author: richagaur
ms.service: cosmos-db
ms.custom: ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
---

# Frequently asked questions on Priority-based execution in Azure Cosmos DB

[!INCLUDE[NoSQL](includes/appliesto-nosql.md)]

Priority based execution allows users to specify priority of requests sent to Azure Cosmos DB. In cases where the number of requests exceeds the capacity that can be processed within the configured Request Units per second (RU/s), then Azure Cosmos DB will throttle low priority requests to prioritize the execution of high priority requests.

sections:
  - name: General
    questions:
      - question: |
          How many priority levels are supported by priority-based execution?
        answer: |
          There are only 2 priority levels supported, Low and High.        
      - question: |
          What is the default priority of a request?
        answer: |
          All requests are of **High** priority by default.
      - question: |
          Can I change default priority level of requests in Azure Cosmos DB account?
        answer: |
          Yes, you can change the default priority level of requests for an Azure Cosmos DB account by raising a support request to Microsoft support.
      - question: |
          How can I monitor behaviour of low and high priority requests?
        answer: |
          [Azure Monitor metrics](monitor.md#analyzing-metrics), built-in to Azure Cosmos DB, can filter by the dimension **Priority level** on the **TotalRequests (preview)** and **TotalRequestUnits (preview)** metrics. **Priority level** for high priority requests would be equal to **1** and for low priority requests equal to **2**.
      - question: |
          Does enabling priority based execution means reserving a fraction of RU/s for high priority requests?
        answer: |
          No, there is no reservation of RU/s. The users can use all their provisioned RU/s irrespective of the priority of requests. 
      - question: |
          What are the pricing changes associated with this feature?
        answer: |
          There is no cost associated with this feature, its free of charge.
     
additionalContent: |

  ## Next steps

  * Learn more about [Priority-based execution](priority-based-execution.md)
