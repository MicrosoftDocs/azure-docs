---
title: Connections in Azure AI Studio
titleSuffix: Azure AI services
description: This article introduces connections in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: eur
---

# Connections in Azure AI Studio

In this article, you learn about connections in Azure AI Studio.

Connections are a way to authenticate and consume both Microsoft and third-party resources within your Azure AI projects. Connections can be used for prompt flow, training, and deployments (link to connections in MIR).  

Connectors allow you to securely store credentials, authenticate access, and consume data and information. Connections can be set up as shared with all projects in the same Azure AI resource, or created exclusively for one project (link to manage connections). Secrets associated with connections are securely persisted in the corresponding Azure Key Vault, adhering to robust security and compliance standards. As an administrator, you can audit both shared and project-scoped connections on an Azure AI resource level (link to connection rbac). 

Azure connections serve as key vault proxies, and interactions with connections are direct interactions with an Azure key vault. Azure AI Studio connections store API keys securely, as secrets, in a key vault. The key vault [Azure role-based access control (Azure RBAC)](#role-based-access-control-in-azure-ai-studio) controls access to these connection resources. A connection references the credentials from the key vault storage location for further use. You won't need to directly deal with the credentials after they are stored in the Azure AI resource's key vault. You have the option to store the credentials in the YAML file. A CLI command or SDK can override them. We recommend that you avoid credential storage in a YAML file, because a security breach could lead to a credential leak.  

There are two connections you can use to access third party Generative AI APIs. 
- The [API key](../how-to/connections-add.md?tabs=api-key#service-connection-types) allows you to access a single API. We recommend in most scenarios for you to use Api Key as it allows you to individually manage access per API. API Key connections also include authentication, allowing you to use your Key to authenticate to your desired Target.
- The second is Custom Connections that allows you to store multiple api keys and their targets. For some scenarios, ex: LangChain support, you may need to include multiple secret keys in a single connection, this is where Custom Connections is advantageous. Custom Connections do not authenticate for you, you will have to manage authenticate on your own. Custom Connections allow you to securely store and access keys while storing related properties, such as targets and versions, all in one “connection”. 

> [!NOTE]
> You can create connections via multiple workflows in Azure AI Studio. In this article, we will focus on creating connections from the project **Settings** page. You can also create a connection from the **Manage** page. When you create a connection from the **Manage** page, the connection is always created at the Azure AI resource level and shared accross all associated projects. 

## Connections for datastores

An AI Studio Connection can be created as a *reference* to an *existing* Azure storage account or other *existing* Microsoft services.
We support Connection to data from following Azure storage account types: Microsoft OneLake, Azure Blob, Azure Data Lake Gen2.
A data connection offers these benefits:

- A common, easy-to-use API that interacts with different storage types (OneLake/Blob/ADLS gen2).
- Easier discovery of useful connections in team operations.
- For credential-based access (service principal/SAS/key), AI Studio connection secures credential information. This way, you won't need to place that information in your scripts.

When you create a connection with an existing Azure storage account, you can choose between two different authentication methods:

- **Credential-based** - authenticate data access with a service principal, shared access signature (SAS) token, or account key. Users with *Reader* workspace access can access the credentials.
- **Identity-based** - use your Azure Active Directory identity or managed identity to authenticate data access.

The following table summarizes the Azure cloud-based storage services that an Azure Machine Learning datastore can create. Additionally, the table summarizes the authentication types that can access those services:

Supported storage service | Credential-based authentication | Identity-based authentication
|---|:----:|:---:|
Azure Blob Container| ✓ | ✓|
Microsoft OneLake| ✓ | ✓|
Azure Data Lake Gen2| ✓ | ✓|


## Next steps

- [How to create a connection in Azure AI Studio](../how-to/connections-add.md)
