---
title: Service Connector limitations
description: Learn about current limitations in Service Connector.
titleSuffix: Service Connector
ms.service: service-connector
ms.topic: troubleshooting
ms.date: 03/02/2023
ms.author: malev
author: maud-lv
---

# Known limitations of Service Connector

In this article, learn about Service Connector's existing limitations and how to mitigate them.

## Limitations to Infrastructure as Code (IaC)

Service Connector has been designed to bring the benefits of easy, secure, and consistent backing service connections to as many Azure services as possible. To do so, Service Connector has been developed as an extension resource provider.

Unfortunately, there are some limitations with IaC support as Service Connector modifies infrastructure on users' behalf. In this scenario, users would begin by using Azure Resource Manager (ARM), Bicep, Terraform, or other IaC templates to create resources. Afterwards, they would use Service Connector to set up resource connections. During this step, Service Connector modifies resource configurations on behalf of the user. If the user reruns their IaC template at a later time, modifications made by Service Connector would disappear as they were not reflected in the original IaC templates. An example of this behavior is Azure Container Apps deployed with ARM templates usually have Managed Identity (MI) disabled by default, Service Connector enables MI when setting up connections on users' behalf. If users trigger the same ARM templates without updating MI settings, the redeployed container apps will have MI disabled again.

If you run into any issues when using Service Connector, [file an issue with us](https://github.com/Azure/ServiceConnector/issues/new). 

## Solutions
We suggest the following solutions: 

- Use Service Connector in Azure portal or Azure CLI to set up connections between compute and backing services, export ARM template from these existing resources via Azure portal or Azure CLI. Then use the exported ARM template as basis to craft automation ARM templates. This way, the exported ARM templates contain configurations added by Service Connector, reapplying the ARM templates doesn't affect existing application.

- If CI/CD pipelines contain ARM templates of source compute or backing services, suggested flow is: reapplying the ARM templates, adding sanity check or smoke tests to make sure the application is up and running, then allowing live traffic to the application. The flow adds verification step before allowing live traffic.

- When automating Azure Container App code deployments with Service Connector, we recommend the use of [multiple revision mode](../container-apps/revisions.md#revision-modes) to avoid routing traffic to a temporarily nonfunctional app before Service connector can reapply connections.

- The order in which automation operations are performed matters greatly. Ensure your connection endpoints are there before the connection itself is created. Ideally, create the backing service, then the compute service, and then the connection between the two. So Service Connector can configure both the compute service and the backing service appropriately. 


## Next steps

> [!div class="nextstepaction"]
> [Service Connector troubleshooting guidance](./how-to-troubleshoot-front-end-error.md)
