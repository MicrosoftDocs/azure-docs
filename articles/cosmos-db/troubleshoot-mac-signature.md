---
title: Troubleshoot Cosmos DB unauthorized exception
description: How to diagnose and fix unauthorized exception
author: j82w
ms.service: cosmos-db
ms.date: 07/13/2020
ms.author: jawilley
ms.topic: troubleshooting
ms.reviewer: sngun
---

## CosmosUnauthorized

| Http Status Code | Name | Category |
|---|---|---|
|401|CosmosUnauthorized|Service|

## Description
HTTP 401: The MAC signature found in the HTTP request is not the same as the computed signature
If you received the following 401 error message: "The MAC signature found in the HTTP request is not the same as the computed signature." it can be caused by the following scenarios.

Older SDKs this might appear as an invalid json exception. Newer SDKs properly handle this scenario and give a valid error message.

## Troubleshooting steps

### 1. Key was not properly rotated.
401 MAC signature is seen shortly after a key rotation and eventually stops without any changes. 

#### Solution:
The key was rotated and did not follow the [best practices](secure-access-to-data.md#key-rotation). This is usually the case. Cosmos DB account key rotation can take anywhere from a few seconds to possibly days depending on the Cosmos DB account size.

### 2. The key is misconfigured
401 MAC signature issue will be consistent and happens for all calls using that key

#### Solution:
The key is misconfigured on the application so the key does not match the account or entire key was not copied.

### 3. Race condition with create container
401 MAC signature issue is seen shortly after a container creation, and only occur until the container creation is completed.

#### Solution:
 There is a race condition with container creation. An application instance is trying to access the container before container creation is complete. The most common scenario for this if the application is running, and the container is deleted and recreated with the same name while the application is running. The SDK will attempt to use the new container, but the container creation is still in progress so it does not have the keys.
