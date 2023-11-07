---
title: Managed identities for Azure Stream Analytics
description: This article describes managed identities for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 10/27/2022
---

# Managed identities for Azure Stream Analytics

Azure Stream Analytics currently allows you to authenticate to other Azure resources using managed identities.
A common challenge when building cloud applications is credential management in your code to authenticate cloud services. Keeping the credentials secure is an important task. The credentials shouldn't be stored in developer workstations or checked into source control. 

The Microsoft Entra managed identities for Azure resources feature solves this problem. The feature provides Azure services with an automatically managed identity in Microsoft Entra ID. This allows you to assign an identity to your Stream Analytics job which can then authenticate to any input or outputs that supports Microsoft Entra authentication, without any credentials. See [managed identities for Azure resources overview page](../active-directory/managed-identities-azure-resources/overview.md) for more information about this service.

## Managed identity types

Stream Analytics supports two types of managed identities:

*	System-assigned identity: When you enable a system-assigned managed identity for your job, you create an identity in Microsoft Entra ID that is tied to the lifecycle of that job. So when you delete the resource, Azure automatically deletes the identity for you. 
*	User-assigned identity: You may also create a managed identity as a standalone Azure resource and assign it to your Stream Analytics job. In the case of user-assigned managed identities, the identity is managed separately from the resources that use it.




> [!IMPORTANT] 
> Regardless of the type of identity chosen, a managed identity is a service principal of a special type that may only be used with Azure resources. The corresponding service principal is automatically removed when the managed identity is deleted.

## Connecting your job to other Azure resources using managed identity

Below is a table that shows Azure Stream Analytics inputs and outputs that support system-assigned managed identity or user-assigned managed identity:

| Type            |  Adapter                      | User-assigned managed identity                                         | System-assigned managed identity       |
|-----------------|-------------------------------|------------------------------------------------------------------------|------------------------------------------|
| Storage Account | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
| Inputs          | Event Hubs                    | Yes                                                                    | Yes                                      |
|                 | IoT Hubs                      | No (available with a workaround: users can route events to Event Hubs) | No                                       |
|                 | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
| Reference Data  | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
|                 | SQL                           | Yes                                                                    | Yes                                      |
| Outputs         | Event Hubs                    | Yes                                                                    | Yes                                      |
|                 | SQL Database                  | Yes                                                                    | Yes                                      |
|                 | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
|                 | Table Storage                 | No                                                                     | No                                       |
|                 | Service Bus Topic             | Yes                                                                    | Yes                                      |
|                 | Service Bus Queue             | Yes                                                                    | Yes                                      |
|                 | Azure Cosmos DB                     | Yes                                                                    | Yes                                      |
|                 | Power BI                      | No                                                                     | Yes                                      |
|                 | Data Lake Storage Gen1        | Yes                                                                    | Yes                                      |
|                 | Azure Functions               | No                                                                     | No                                       |
|                 | Azure Database for PostgreSQL | No                                                                     | No                                       |
|                 | Azure Data Explorer           | Yes                                                                    | Yes                                      |
|                 | Azure Synapse Analytics       | Yes                                                                    | Yes                                      |



## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
