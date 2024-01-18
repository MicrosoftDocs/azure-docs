---
title: Integrations overview in Azure Cosmos DB for MongoDB
description: Learn how to integrate Azure Cosmos DB for MongoDB account with other Azure services.
author: seesharprun
ms.service: cosmos-db
ms.custom: ignite-2022
ms.topic: how-to
ms.date: 07/25/2022
ms.author: sidandrews
ms.subservice: mongodb
---

# Integrate Azure Cosmos DB for MongoDB with Azure services
[!INCLUDE[MongoDB](../includes/appliesto-mongodb.md)]

Azure Cosmos DB for MongoDB is a cloud-native offering and can be integrated seamlessly with other Azure services to build enterprise-grade modern applications. 

## Compute services to run your application

Hosting options and deployment scenarios include several services and tools for Azure. Azure has many options for hosting and many tools to help you move your app from a local or cloud repository to Azure.

### Azure App Service
Azure App Service allows you to fully configure and manage the web server without needing to manage the underlying environment.

Samples to get started: 
* [Quickstart: ToDo Application with a Node.js API and Azure Cosmos DB for MongoDB on Azure App Service](https://github.com/azure-samples/todo-nodejs-mongo) to get started. \
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Node.js for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.

* [Quickstart: ToDo Application with a C# API and Azure Cosmos DB for MongoDB on Azure App Service](https://github.com/Azure-Samples/todo-csharp-cosmos-sql) \
This sample demonstrates how to build an Azure solution using C#, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.

* [Quickstart: ToDo Application with a Python API and Azure Cosmos DB for MongoDB on Azure App Service](https://github.com/Azure-Samples/todo-python-mongo) \
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Python (FastAPI) for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.


### Azure Functions & Static Web Apps

Azure Functions hosts serverless API endpoints or microservices for event-driven scenarios. Static Web Apps are used to host static websites and single-page applications that can be enhanced with the serverless Azure Functions.

Samples to get started: 

* [Quickstart: ToDo Application with a Node.js API and Azure Cosmos DB for MongoDB on Static Web Apps and Functions](https://github.com/Azure-Samples/todo-nodejs-mongo-swa-func) \
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Node.js for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.

* [Quickstart: ToDo Application with a Python API and Azure Cosmos DB for MongoDB on Azure App Service](https://github.com/Azure-Samples/todo-python-mongo-swa-func) \
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Python (FastAPI) for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.


### Azure Container Apps

Azure Container Apps provide a fully managed serverless container service for building and deploying modern apps at scale.

Samples to get started: 

* [Quickstart: ToDo Application with a Node.js API and Azure Cosmos DB for MongoDB on Azure Container Apps](https://github.com/Azure-Samples/todo-nodejs-mongo-aca)\
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Node.js for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.

* [Quickstart: ToDo Application with a Python API and Azure Cosmos DB for MongoDB on Azure Container Apps](https://github.com/Azure-Samples/todo-python-mongo-aca) \
This sample includes everything you need to build, deploy, and monitor an Azure solution using React.js for the Web application, Python (FastAPI) for the API, Azure Cosmos DB for MongoDB for storage, and Azure Monitor for monitoring and logging.

### Azure Virtual Machines
Azure Virtual Machines allow you to have full control on the compute environment running the application. You may also choose to scale from one to thousands of VM instances in minutes with Azure Virtual Machine Scale Sets.

### Azure Kubernetes Service (AKS)
Azure Kubernetes Service is a managed Kubernetes service for running containerized applications. You can build and run modern, portable, microservices-based applications, using Kubernetes to orchestrate and manage the availability of the application components.


Read more about [how to choose the right compute service on Azure](/azure/architecture/guide/technology-choices/compute-decision-tree)

## Enhance functionalities in the application

### Azure AI Search
Azure AI Search is fully managed cloud search service that provides auto-complete, geospatial search, filtering and faceting capabilities for a rich user experience.
Here's how you can [index data from the Azure Cosmos DB for MongoDB account](../../search/search-howto-index-cosmosdb-mongodb.md) to use with Azure AI Search.

## Improve database security

### Azure Networking

Azure Networking features allow you to connect and deliver your hybrid and cloud-native applications with low-latency, Zero Trust based networking services -
* [Configure the Azure Cosmos DB for MongoDB account to allow access only from a specific subnet of virtual network (VNet)](../how-to-configure-vnet-service-endpoint.md)
* [Configure IP-based access controls for inbound firewall.](../how-to-configure-firewall.md)
* [Configure connectivity to the account via a private endpoint.](../how-to-configure-private-endpoints.md)

### Azure Key Vault
Azure Key Vault helps you to securely store and manage application secrets.
You can use Azure Key Vault to -
* [Secure Azure Cosmos DB for MongoDB account credentials.](../store-credentials-key-vault.md)
* [Configure customer-managed keys for your account.](../how-to-setup-cmk.md)

<a name='azure-ad'></a>

### Microsoft Entra ID

Microsoft Entra managed identities eliminate the need for developers to manage credentials. Here's how you can [create a managed identity for Azure Cosmos DB accounts](../how-to-setup-managed-identity.md).

## Next steps

Learn about other key integrations:
* [Monitor Azure Cosmos DB with Azure Monitor.](/azure/cosmos-db/monitor-cosmos-db?tabs=azure-diagnostics.md)
* [Set up analytics with Azure Synapse Link.](../configure-synapse-link.md)
