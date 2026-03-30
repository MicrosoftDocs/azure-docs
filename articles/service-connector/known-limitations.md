---
title: Service Connector limitations
description: Learn about current limitations in Service Connector used to connect apps and Cloud services in Azure.
titleSuffix: Service Connector
ms.service: service-connector
ms.topic: troubleshooting
ms.date: 10/22/2024
ms.author: malev
author: maud-lv
---
# Known limitations of Service Connector

In this article, learn about Service Connector's existing limitations and how to mitigate them.

## Limitations to Infrastructure as Code (IaC)

Service Connector is designed to bring the benefits of easy, secure, and consistent backing service connections to as many Azure services as possible. To do so, Service Connector is developed as an extension resource provider.

IaC support comes with some limitations, as Service Connector modifies the infrastructure on the users' behalf. In this scenario, users begin by using Azure Resource Manager (ARM), Bicep, Terraform, or other IaC templates to create resources. Afterwards, they use Service Connector to set up resource connections. During this step, Service Connector modifies resource configurations on behalf of the user. If the user reruns their IaC template at a later time, modifications made by Service Connector disappear as they weren't reflected in the original IaC templates. As an example of this behavior, Azure Container Apps resources deployed with ARM templates usually have the managed identity authentication disabled by default. Service Connector enables the managed identity when setting up connections on the users' behalf. If users trigger the same ARM templates without updating the managed identity settings, the managed identity will be disabled once again in the redeployed Azure Container Apps resource.

If you run into any issues when using Service Connector, [file an issue with us](https://github.com/Azure/ServiceConnector/issues/new).

## Solutions

We suggest the following solutions:

- Reference [how to build connections with IaC tools](how-to-build-connections-with-iac-tools.md) to build your infrastructure or translate your existing infrastructure to IaC templates.
- If your CI/CD pipelines contain templates of source compute or backing services, we suggested reapplying the templates, adding a sanity check or smoke tests to make sure the application is up and running, then allowing live traffic to the application. The flow adds a verification step before allowing live traffic.
- When automating Azure Container App code deployments with Service Connector, we recommend the use of [multiple revision mode](../container-apps/revisions.md#revision-modes) to avoid routing traffic to a temporarily nonfunctional app before Service connector can reapply connections.
- The order in which automation operations are performed matters. Ensure your connection endpoints are there before the connection itself is created. Ideally, create the backing service, then the compute service, and then the connection between the two. This way, Service Connector can configure both the compute service and the backing service appropriately.

## Next steps

> [!div class="nextstepaction"]
> [Service Connector troubleshooting guidance](./how-to-troubleshoot-front-end-error.md)
