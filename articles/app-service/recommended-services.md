---
title: Recommended services
description: This feature suggests a set of services that are commonly deployed together for your specific app type.
ms.topic: article
ms.date: 03/04/2024
author: btardif
ms.author: byvinyal
---

# Recommended services (preview)

This feature suggests a set of services that are commonly deployed together for your specific app type. It offers guidance on structuring your app effectively using proven patterns. 

The upcoming version of this feature will provide better smart defaults and greater customization tailored to your app, drawing from successful patterns used by other Azure developers, architects, and DevOps engineers. 

**Your app will be deployed as**

- Secure-by-default 
- On a new App Service plan

**Requirements to use this feature**

The following Basic tab items must be filled out:  

1. Subscription 
1. Resource group 
1. Runtime stack 
1. New app service plan 

## Database 

The database picked for you in this list is Runtime-aware and generate a default name that can be customized. [Learn more about database types on Azure.]( https://azure.microsoft.com/products/category/databases) 

**Inputs:**

- `Name`: a default name is generated and can be customized 
- `Database Type`: the database default matches community preferences for each Runtime 

## Azure Cache for Redis 

Redis improves the performance and scalability of an app that uses backend data stores heavily. [Learn more about Azure Cache for Redis.](../azure-cache-for-redis/cache-overview.md)

**Inputs:**  

- `Name`: a default name is generated and can be customized 
- `SKU`: Dev/Test, Production, or Free