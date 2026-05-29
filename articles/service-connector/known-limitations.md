---
title: Service Connector limitations
description: Learn about current limitations when you use Service Connector to connect apps and cloud services in Azure.
titleSuffix: Service Connector
ms.service: service-connector
ms.topic: troubleshooting
ms.date: 04/06/2026
ms.author: malev
author: maud-lv
#customer intent: As a Service Connector user, I need to understand the known limitations of Service Connector so I can mitigate these limitations when I use Service Connector to connect my Azure apps and services.
---
# Known Service Connector limitations

This article describes known Service Connector limitations and ways to mitigate them.

## Limitations

Service Connector is designed as an extension resource provider, so it can bring easy, secure, and consistent backing service connections to as many Azure services as possible. This infrastructure-as-code (IaC) support imposes some limitations, because Service Connector modifies existing infrastructure on the user's behalf.

If you use Bicep, Terraform, Azure Resource Manager (ARM), or other IaC templates to create resources, and afterwards use Service Connector to set up resource connections, Service Connector modifies the resource configurations on your behalf. If you later rerun your IaC templates, the modifications Service Connector made disappear, because they weren't included in the original IaC templates.

For example, Azure Container Apps resources deployed with ARM templates usually disable managed identity authentication by default. When Service Connector then sets up connections, it enables managed identity on your behalf. If you trigger the same ARM templates without updating the managed identity settings, managed identity is disabled again in the redeployed Azure Container Apps resources.

## Solutions

To mitigate the limitations, try the following solutions:

- See [Create connections with IaC tools](how-to-build-connections-with-iac-tools.md) to build your infrastructure or translate your existing infrastructure to IaC templates.
- If your continuous integration/continuous delivery (CI/CD) pipeline source contains compute or backing service templates, add a liveness check or smoke tests when you reapply the templates. This flow adds a verification step to make sure the application is up and running before allowing live traffic to the application.
- When you automate Azure Container App code deployments with Service Connector, use [multiple revision mode](/azure/container-apps/revisions#revision-modes). This mode avoids routing traffic to a temporarily nonfunctional app before Service Connector can reapply connections.
- The order of automation operations matters. Ensure your connection endpoints exist before the connection itself is created. Ideally, create the backing service, then create the compute service, and then create the connection between the two services. Service Connector can then configure both the compute service and the backing service appropriately.
- If you run into issues when using Service Connector, [file an issue](https://github.com/Azure/ServiceConnector/issues/new).

## Related content

- [Service Connector troubleshooting guidance](how-to-troubleshoot-front-end-error.md)
- [Create connections with IaC tools](how-to-build-connections-with-iac-tools.md)
