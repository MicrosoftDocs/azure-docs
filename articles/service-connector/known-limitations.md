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

## Limitations to IaC

Service Connector has been designed to bring the benefits of easy, secure, and consistent backing service connections to as many Azure services as possible. To do so, Service Connector has been developed as an extension resource provider.

Unfortunately, there's some limitations in IaC(Infra as Code) where an Azure Resource Manager (ARM), Bicep or Terraform template defines these resources explicitly. When creating service connection, Service Connector modifies resources on a user’s behalf, such as adding Azure App Service's AppSettings, adding Azure SQL database's firewall rules. When reapplying ARM templates or other IaC codes, which are used to provision source compute or target backing services at first place, these configurations on these resources added by Service Connector is cleared up. If an application is already running on these resources, then the application is down between reapplying the resource provisioning IaC codes and connection setup. For example, by default, Azure Container App has managed identity (MI) disabled. User provisions an Azure Container App through an ARM template with MI disabled. Whereas Service Connector enables it if the user chooses MI as an authentication method when creating a connection. Later, user reruns the ARM template, the MI is disabled again.

If you run into issues that you believe are bugs that fall outside of the scenario described here, [file an issue with us](https://github.com/Azure/ServiceConnector/issues/new). 

## Solutions
We suggest the following solutions: 

- Use Service Connector in Azure portal or Azure CLI to setup connections between compute and backing services, export ARM template from these existing resources via Azure portal or Azure CLI. Then use the exported ARM template as basis to craft automation ARM templates. This way, the exported ARM templates contain configurations added by Service Connector, reapplying the ARM templates doesn't affect existing application.

- If CI/CD pipelines contain ARM templates of source compute or backing services, suggested flow is: reapplying the ARM templates, adding sanity check or smoke tests to make sure the application is up and running, then allowing live traffic to the application. The flow adds verification step before allowing live traffic.

- When automating an Azure Container App application using Service Connector, we recommend the use of the [multiple revision mode](../container-apps/revisions.md#revision-modes), to avoid sending traffic to a temporarily nonfunctional app, before Service Connector setup connections for the new app revision. 

- The order in which automation operations are performed matters greatly. Ensure your connection endpoints are there before the connection itself is created. Ideally, create the backing service, then the compute service, and then the connection between the two. So Service Connector can configure both the compute service and the backing service appropriately. 


## Next steps

> [!div class="nextstepaction"]
> [Service Connector troubleshooting guidance](./how-to-troubleshoot-front-end-error.md)
