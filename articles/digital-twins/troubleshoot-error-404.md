---
title: "Azure Digital Twins request failed with Status: 404 Sub-Domain not found"
description: "Causes and resolutions for 'Service request failed. Status: 404 Sub-Domain not found' on Azure Digital Twins."
ms.service: digital-twins
author: baanders
ms.author: baanders
ms.topic: troubleshooting
ms.date: 4/13/2021
---

# Service request failed. Status: 404 Sub-Domain not found

This article describes causes and resolution steps for receiving a 404 error from service requests to Azure Digital Twins. 

## Symptoms

This error may occur when accessing an Azure Digital Twins instance using a service principal or user account that belongs to a different [Azure Active Directory (Azure AD) tenant](../active-directory/develop/quickstart-create-new-tenant.md) from the instance. The correct [roles](concepts-security.md) seem to be assigned to the identity, but API requests fail with an error status of `404 Sub-Domain not found`.

## Causes

### Cause #1

Azure Digital Twins requires that all authenticating users belong to the same Azure AD tenant as the Azure Digital Twins instance.

[!INCLUDE [digital-twins-tenant-limitation](../../includes/digital-twins-tenant-limitation.md)]

## Solutions

### Solution #1

You can resolve this issue by having each federated identity from another tenant request a **token** from the Azure Digital Twins instance's "home" tenant. 

[!INCLUDE [digital-twins-tenant-solution-1](../../includes/digital-twins-tenant-solution-1.md)]

### Solution #2

If you're using the `DefaultAzureCredential` class in your code and you continue encountering this issue after getting a token, you can specify the home tenant in the `DefaultAzureCredential` options to clarify the tenant even when authentication defaults down to another type.

[!INCLUDE [digital-twins-tenant-solution-2](../../includes/digital-twins-tenant-solution-2.md)]

## Next steps

Read more about security and permissions on Azure Digital Twins:
* [*Concepts: Security for Azure Digital Twins solutions*](concepts-security.md)
