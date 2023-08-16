---
title: Service Connector limitations
description: Learn about current limitations in Service Connector.
titleSuffix: Service Connector
ms.service: service-connector
ms.topic: troubleshooting
ms.date: 03/02/2023
ms.author: mcleans
author: mcleanbyron
---

# Known limitations of Service Connector

In this article, learn about Service Connector's existing limitations and how to mitigate them.

## Limitations to automation

Service Connector has been designed to bring the benefits of easy, secure, and consistent backing service connections to as many Azure services as possible. To do so, Service Connector has been developed as a plugin-resource provider. This allows Service Connector to be integrated into other services. 

Unfortunately, this also has some limitations. These mainly impact automation scenarios where an Azure Resource Manager (ARM), Bicep or Terraform template defines these resources explicitly. Since Service Connector often modifies resources on a user’s behalf, this behavior can cause conflicts between the way a compute service instance, such as Azure Container Apps, and a Service Connector connection are created. For example, by default, the container application has managed identity (MI) disabled, whereas Service Connector enables it if the user chooses MI as an authentication method. If you run into issues which you believe are bugs that fall outside of the scenario described here, please [file an issue with us](https://github.com/microsoft/azure-container-apps/issues/new/choose). 

We’re working on improving this experience over the next releases. Until then, we suggest the following: 

- When automating an Azure Container App application using Service Connector, we recommend the use of the [multiple revision mode](../container-apps/revisions.md#revision-modes) to avoid sending traffic to a temporarily non-functional app because the Service Connector resource hasn’t been created yet and the application therefore won’t be able to rely on it. 

- The order in which automation operations are performed matters greatly. Ensure your connection endpoints are there before the connection itself is created. Ideally, create the backing service, then the compute service, and then the connection between the two. This ensures that Service Connector has the ability to interact with both ends of the connection in order to configure them appropriately. 

- Prior to crafting your automation templates, check to see if there’s been any configuration drift, and whether a resource might have been changed. A good way of doing this would be to use the portal to create and configure your resources as desired and then utilize the available ARM export functionality to pull the latest configuration in the form of an ARM template format as your basis for your automation template.

## Limitations to Azure App Service deployment slots

If you’re using App Service and have [more than one deployment slot](../app-service/deploy-staging-slots.md), Service Connector won't work. If deployment slots are critical to your way of working, we recommend [using app settings](../app-service/configure-common.md). 

## Next steps

> [!div class="nextstepaction"]
> [Service Connector troubleshooting guidance](./how-to-troubleshoot-front-end-error.md)
