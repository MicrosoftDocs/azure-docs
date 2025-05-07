---
title: "Troubleshoot Azure Digital Twins: Error 404 (Sub-Domain not found)"
titleSuffix: Azure Digital Twins
description: Learn how to diagnose and resolve error 404 (Sub-Domain not found) failed service requests from Azure Digital Twins.
ms.service: azure-digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 4/21/2025
---

# Troubleshoot Azure Digital Twins failed service request: Error 404 (Sub-Domain not found)

This article describes causes and resolution steps for receiving a 404 error from service requests to Azure Digital Twins. This information is specific to the Azure Digital Twins service.

## Symptoms

This error might occur when accessing an Azure Digital Twins instance using a service principal or user account that belongs to a different [Microsoft Entra tenant](../active-directory/develop/quickstart-create-new-tenant.md) from the instance. The correct [roles](concepts-security.md) seem to be assigned to the identity, but API requests fail with an error status of `404 Sub-Domain not found`.

## Causes

### Cause #1

Azure Digital Twins requires that all authenticating users belong to the same Microsoft Entra tenant as the Azure Digital Twins instance.

[!INCLUDE [digital-twins-tenant-limitation](includes/digital-twins-tenant-limitation.md)]

## Solutions

### Solution #1

You can resolve this issue by having each federated identity from another tenant request a token from the Azure Digital Twins instance's "home" tenant. 

[!INCLUDE [digital-twins-tenant-solution-1](includes/digital-twins-tenant-solution-1.md)]

### Solution #2

If you're using the `DefaultAzureCredential` class in your code and you continue encountering this issue after getting a token, you can specify the home tenant in the `DefaultAzureCredential` options to clarify the tenant even when authentication defaults down to another type.

[!INCLUDE [digital-twins-tenant-solution-2](includes/digital-twins-tenant-solution-2.md)]

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [Secure Azure Digital Twins](concepts-security.md)
