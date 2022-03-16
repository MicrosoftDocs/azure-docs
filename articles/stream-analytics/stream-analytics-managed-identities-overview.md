---
title: Managed Identities for Azure Stream Analytics
description: This article describes managed identities for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 03/02/2022
---

# Managed Identities for Azure Stream Analytics

Azure Stream Analytics currently allows you to use managed identities for Azure resources.
A common challenge when building cloud applications is credential management in your code to authenticate cloud services. Keeping the credentials secure is an important task. The credentials shouldn't be stored in developer workstations or checked into source control. Azure Key Vault provides a way to store credentials, secrets securely, and other keys, but your code must authenticate to Key Vault to retrieve them. 

The Azure Active Directory (Azure AD) managed identities for Azure resources feature solves this problem. The feature provides Azure services with an automatically managed identity in Azure AD. You can use the identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without any credentials in your code. See [managed identities for Azure resources overview page](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) for more information about this service.

Here are some of the benefits of using Managed identities:
*	You don't need to manage credentials. Credentials are not even accessible to you.


## Managed Identity types

Stream Analytics supports two types of managed identities:

*	System-assigned Identity: When you enable a system-assigned managed identity for your job, you create an identity in Azure AD that is tied to the lifecycle of that job. So when you delete the resource, Azure automatically deletes the identity for you. 
*	User-assigned Identity: You may also create a managed identity as a standalone Azure resource and assign it to your Stream Analytics job. In the case of user-assigned managed identities, the identity is managed separately from the resources that use it.

To learn more about managed identities, see [What are managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).



> [!IMPORTANT] 
> Regardless of the type of identity chosen, a managed identity is a service principal of a special type that may only be used with Azure resources. The corresponding service principal is automatically removed when the managed identity is deleted.

## Connecting your job to other Azure resources using Managed Identity

Below is a table that shows Azure Stream Analytics inputs and outputs that support System Assigned Managed Identity or User Assigned Managed Identity:

| Type            |  Adapter                      | User-Assigned Managed Identity Support                                 | System Assigned Managed Identity Support |
|-----------------|-------------------------------|------------------------------------------------------------------------|------------------------------------------|
| Storage Account | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
| Inputs          | Event Hubs                    | Yes                                                                    | Yes                                      |
|                 | IoT Hubs                      | No (available with a workaround: users can route events to Event Hubs) | No                                       |
|                 | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
| Reference Data  | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
|                 | SQL                           | Yes (preview)                                                          | Yes                                      |
| Outputs         | Event Hubs                    | Yes                                                                    | Yes                                      |
|                 | SQL Database                  | Yes                                                                    | Yes                                      |
|                 | Blob/ADLS Gen 2               | Yes                                                                    | Yes                                      |
|                 | Table Storage                 | No                                                                     | No                                       |
|                 | Service Bus Topic             | No                                                                     | No                                       |
|                 | Service Bus Queue             | No                                                                     | No                                       |
|                 | Cosmos DB                     | No                                                                     | No                                       |
|                 | Power BI                      | Yes                                                                    | No                                       |
|                 | Data Lake Storage Gen1        | Yes                                                                    | Yes                                      |
|                 | Azure Functions               | No                                                                     | No                                       |
|                 | Azure Database for PostgreSQL | No                                                                     | No                                       |
|                 | Azure Data Explorer           | Yes                                                                    | Yes                                      |
|                 | Azure Synapse Analytics       | Yes                                                                    | Yes                                      |



## Next steps

* [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)
