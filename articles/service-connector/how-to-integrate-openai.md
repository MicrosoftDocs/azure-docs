---
title: Connect Azure OpenAI in Foundry Models to Other Azure Services
titleSuffix: Service Connector
description: Use these code samples to integrate Azure OpenAI into your application with Service Connector.
author: wchigit
ms.author: wchi
ms.service: service-connector
ms.topic: how-to
ms.date: 09/30/2025
ms.update-cycle: 180-days
ms.collection: ce-skilling-ai-copilot
#customer intent: As a cloud developer, I want to connect my compute services toAzure OpenAI in Foundry Models using Service Connector.
---

# Connect to Azure OpenAI in Foundry Models using Service Connector

This page provides information about supported authentication methods and clients. It provides sample code you can use to connect compute services to Azure OpenAI in Foundry Models using Service Connector. This page also lists default environment variable names and values obtained when creating service connections.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure OpenAI:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

This table shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure OpenAI using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it isn't supported.


| Client type | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|-------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET        |                Yes               |               Yes              |            Yes           |        Yes        |
| Java        |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js     |                Yes               |               Yes              |            Yes           |        Yes        |
| Python      |                Yes               |               Yes              |            Yes           |        Yes        |
| None        |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure OpenAI using Service Connector.

## Default environment variable names or application properties and sample code

Use the following connection details to connect compute services to Azure OpenAI. For more information, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

| Default environment variable name | Description                  | Sample value                                     |
| --------------------------------- | ---------------------------- | ------------------------------------------------ |
| AZURE_OPENAI_BASE   | Azure OpenAI endpoint | `https://<Azure-OpenAI-name>.openai.azure.com/` |

#### Sample code

To connect to Azure OpenAI using a system-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for app config](./includes/code-openai-microsoft-entra-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                    |
| --------------------------------- | -------------------------- | ----------------------------------------------- |
| AZURE_OPENAI_BASE   | Azure OpenAI Endpoint | `https://<Azure-OpenAI-name>.openai.azure.com/` |
| AZURE_OPENAI_CLIENTID   | Your client ID             | `<client-ID>`                                 |

#### Sample code

To connect to Azure OpenAI using a user-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for Azure OpenAI](./includes/code-openai-microsoft-entra-id.md)]

### Connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_OPENAI_BASE   | Azure OpenAI Endpoint | `https://<Azure-OpenAI-name>.openai.azure.com/` |
> | AZURE_OPENAI_KEY | Azure OpenAI API key | `<api-key>` |

#### Sample Code 

To connect to Azure OpenAI using a connection string, refer to the following steps and code.
[!INCLUDE [code sample for Azure OpenAI](./includes/code-openai-secret.md)]


### Service principal

| Default environment variable name   | Description                | Sample value                                   |
| ----------------------------------- | -------------------------- | ---------------------------------------------- |
| AZURE_OPENAI_BASE     | Azure OpenAI Endpoint | `https://<Azure-OpenAI-name>.openai.azure.com/` |
| AZURE_OPENAI_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_OPENAI_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_OPENAI_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

#### Sample code

To connect to Azure OpenAI using a service principal, refer to the following steps and code.
[!INCLUDE [code sample for Azure OpenAI](./includes/code-openai-microsoft-entra-id.md)]

### Related content

- [Connect to Azure OpenAI in AKS using Workload Identity](./tutorial-python-aks-openai-workload-identity.md)
- [Connect to an Azure AI multi-service resource](./how-to-integrate-cognitive-services.md)
- [Connect to Azure AI services](./how-to-integrate-ai-services.md)
