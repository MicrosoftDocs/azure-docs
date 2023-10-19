---
title: Create connections with IaC tools
description: Learn how to translate your infrastructure to IaC template
author: houk-ms
ms.service: service-connector
ms.topic: how-to
ms.date: 10/20/2023
ms.author: honc
---
# How to translate your infrastrure to IaC template

Service Connector helps users connect their compute services to the target backing services by only a few clicks or commands. That convenient experience reflects that it's more designed for getting-started users. However, as the transition from getting-started to production stage, users also need the transition from manual configurations to IaC templates in the CI/CD pipelines. In this guide, we show how to translate your Azure services with connections to infrastructure as code (IaC) templates.

## Prerequisites

- This guide assumes that you know [Service Connector ](./known-limitations.md)[IaC limitations](./known-limitations.md).

## Solution overview

Translating the infrastructure to IaC templates usually involves two major parts: the logics to provision source and target services, and the logics to build connections. To implement the logics to provision source and target services, there are two ways:

* Authoring the template from scratch.
* Export the resource from Azure and polish them.

To implement the logics to build connections, there are also two ways:

* Use Service Connector in the template.
* Use template logics to configure source and target services directly.

Combinations between these different options can produce different solutions. Due to the [Service Connector ](./known-limitations.md)[IaC limitations](./known-limitations.md), we recommend the following solutions in order. While all of the solutions need your understanding on the IaC tools and the template authoring grammars.

| Solution | Provision source and target |   Build connection   |      Applicable scenario      | Pros                                                                                           | Cons                                                                                                                                   |
| :------: | :-------------------------: | :-------------------: | :---------------------------: | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
|    1    |   Authoring from scratch   | Use Service Connector | IaC limitation doesn't matter | - Template is simple and readable<br />- Service Connector brings extra values             | - Resources may be not exactly same as on the cloud                                                                                   |
|    2    |   Authoring from scratch   |  Use template logics  |    IaC limitation matters    | - Template is simple and readable                                                              | - Resources may be not exactly same as on the cloud<br />- Service Connector features aren't available                               |
|    3    |      Export and polish      | Use Service Connector | IaC limitation doesn't matter | - Resources are exactly same as on the cloud<br />- Service Connector brings extra values | - Support only ARM template<br />- Efforts to understand and polish the template                                                      |
|    4    |      Export and polish      |  Use template logics  |    IaC limitation matters    | - Resources are exactly same as on the cloud                                                  | - Support only ARM template<br />- Efforts to understand and polish the template<br />- Service Connector features aren't available |

## Authoring templates

The following sections introduce how to create a web app and a storage account and connect them with system assigned identity using bicep. It shows ways both using Service Connector and using template logics directly.

### Provision source and target services

**Authoring from scratch**

Authoring the template from scratch is the preferred and recommended way to provision source and target services, as it's easy to get started and makes the template simple and readable. Following is an example, using the minimal set of parameters to create a webapp and a storage account.

```bicep
// The template creates a webapp and a storage account.
// In order to make it more readable, we use only the mininal set of parameters to create the resources.

param location string = resourceGroup().location
// App service plan parameters
param planName string = 'plan_${uniqueString(resourceGroup().id)}'
param kind string = 'linux'
param reserved bool = true
param sku string = 'B1'
// Webapp parameters
param webAppName string = 'webapp-${uniqueString(resourceGroup().id)}'
param linuxFxVersion string = 'PYTHON|3.8'
param identityType string = 'SystemAssigned'
param appSettings array = []
// Storage account parameters
param storageAccountName string = 'account${uniqueString(resourceGroup().id)}'


// Create an app service plan 
resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: planName
  location: location
  kind: kind
  sku: {
    name: sku
  }
  properties: {
    reserved: reserved
  }
}


// Create a web app
resource appService 'Microsoft.Web/sites@2022-09-01' = {
  name: webAppName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: linuxFxVersion
      appSettings: appSettings
    }
  }
  identity: {
    type: identityType
  }
}


// Create a storage account
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageAccountName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
}
```

**Export and polish**

For the case when you need the resources to be provisioned are exactly same as on the cloud, exporting the template from Azure may be another option. The two premises of this approach are: the resources are existing on Azure and you're using ARM template as the IaC tool. The `Export template` button is usually at the bottom of the sidebar on Azure portal. The exported ARM template reflects the resource's current states, including the settings configured by Service Connector, you usually need knowledge on the resource properties to polish the exported template.

:::image type="content" source="./media/how-to/export-webapp-template.png" alt-text="Screenshot of the Azure portal, exporting arm template of a web app":::

### Build connection logics

**Using Service Connector**

Creating connections between the source and target service using Service Connector is the preferred and recommended way if [Service Connector ](./known-limitations.md)[IaC limitations](./known-limitations.md) doesn't matter for your scenario. Service Connector makes the template simpler and also provides more extra values, like validating the connection health, compared with building connections through template logics directly.

```bicep
// The template builds a connection between a webapp and a storage account 
// with system assigned identity by using Service Connector

param webAppName string = 'webapp-${uniqueString(resourceGroup().id)}'
param storageAccountName string = 'account${uniqueString(resourceGroup().id)}'
param connectorName string = 'connector_${uniqueString(resourceGroup().id)}'

// Get an existing webapp
resource webApp 'Microsoft.Web/sites@2022-09-01' existing = {
  name: webAppName
}

// Get an existig storage
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' existing = {
  name: storageAccountName
}

// Create a service connector resource on the webapp 
// to connect to a storage account using system identity
resource serviceConnector 'Microsoft.ServiceLinker/linkers@2022-05-01' = {
  name: connectorName
  scope: webApp
  properties: {
    clientType: 'python'
    targetService: {
      type: 'AzureResource'
      id: storageAccount.id
    }
    authInfo: {
      authType: 'systemAssignedIdentity'
    }
  }
}
```

For the formats of properties and values needed when creating a Service Connector resource, check [how to provide correct parameters](./how-to-provide-correct-parameters.md). You can also preview and download an ARM template for reference when creating a Service Connector resource on Azure portal.

:::image type="content" source="./media/how-to/export-sc-template.png" alt-text="Screenshot of the Azure portal, exporting arm template of a service connector resource":::

**Using template logics**

For the scenarios where the [Service Connector ](./known-limitations.md)[IaC limitation](./known-limitations.md) matters, consider building connections using the template logics directly. The following template is an example showing how to connect a storage account to a web app using system assigned identity.

```bicep
// The template builds a connection between a webapp and a storage account 
// with system assigned identity without using Service Connector

param webAppName string = 'webapp-${uniqueString(resourceGroup().id)}'
param storageAccountName string = 'account${uniqueString(resourceGroup().id)}'
param storageBlobDataContributorRole string  = 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'

// Get an existing webapp
resource webApp 'Microsoft.Web/sites@2022-09-01' existing = {
  name: webAppName
}

// Get an existig storage
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' existing = {
  name: storageAccountName
}

// Operation: Enable system assigned identity on the source service
// Nothing need to do as it is enabled when creating the webapp

// Operation: Configure the target service's endpoint on the source service's app settings
resource appSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  name: 'appsettings'
  parent: webApp
  properties: {
    AZURE_STORAGEBLOB_RESOURCEENDPOINT: storageAccount.properties.primaryEndpoints.blob
  }
}

// Operation: Configure firewall on the target service to allow the source service's outbound ips
// Nothing need to do as storage account allows all ips by default

// Operation: Create role assignment for the source service's identity on the target service
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(resourceGroup().id, storageBlobDataContributorRole)
  properties: {
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', storageBlobDataContributorRole)
    principalId: webApp.identity.principalId
  }
}
```

When building connections using template logics directly, it's crucial to understand what Service Connector does for each kind of authentication type, as the template logics are equivalent to the Service Connector backend operations. The following table shows the operation details that you need translate to template logics for each kind of authentication type.

| Auth type                  | Service Connector operations                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secret / Connection string | - Configure the target service's connection string on the source service's app settings<br />- Configure firewall on the target service to allow the source service's outbound ips                                                                                                                                                                         |
| System-assigned managed identity   | - Configure the target service's endpoint on the source service's app settings<br />- Configure firewall on the target service to allow the source service's outbound ips<br />- Enable system assigned identity on the source service<br />- Create role assignment for the source service's identity on the target service                              |
| User-assigned managed identity     | - Configure the target service's endpoint on the source service's app settings<br />- Configure firewall on the target service to allow the source service's outbound ips<br />- Bind user assigned identity to the source service<br />- Create role assignment for the user assigned identity on the target service                                     |
| Service principal          | - Configure the target service's endpoint on the source service's app settings<br />- Configure the service principal's appId and secret on the source service's app settings<br />- Configure firewall on the target service to allow the source service's outbound ips<br />- Create role assignment for the service principal on the target service |
