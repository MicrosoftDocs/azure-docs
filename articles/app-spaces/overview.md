---
title: About Azure App Spaces
description: Learn how Azure App Spaces helps you develop and host web applications.
ms.service: app-spaces
ms.topic: overview
author: chcomley
ms.author: chcomley
ms.date: 05/05/2023
---

# About Azure App Spaces

You can provision and manage your web application with Azure App Spaces, which uses native GitHub integrations. App Spaces is based on the Kubernetes container orchestration system, which provides developers with the flexibility and scalability of a containerized architecture. You can deploy your applications as containers, and App Spaces takes care of the underlying infrastructure, including load balancing, autoscaling, and failover.

Once the app is deployed, you have a simplified experience for configuring and developing only the elements pertinent to the actual development cycle.

<!--
Our focus is on JavaScript/Python developers primarily, with an emphasis on the breadth developer market.
-->

## Why use App Spaces?

...

NEED IMAGE?

### Security

One of the key benefits of App Spaces is its security features. Each space is fully isolated from the others, with its own network and security controls. You can configure access controls to ensure that only authorized users can access your applications. You can also configure logging and monitoring features to track usage and identify potential security issues.

### Monitoring

App Spaces provides built-in tools for monitoring and diagnosing issues with applications. You can view real-time performance metrics, set up alerts, and access detailed diagnostic logs to help identify and resolve issues quickly. You can also integrate with Azure Monitor to monitor your applications alongside other Azure services.

### Pricing

With App Spaces, you only pay for the Azure compute resources that you use. The compute resources you use get determined by the *App Spaces plan* that you run your apps on. App Spaces also offers a free tier, which is ideal for small-scale applications and testing purposes.

Besides App Spaces, Azure offers other services that you can use for hosting websites and web applications. For hosting HTTP-based web applications, REST APIs, and mobile back ends, consider [Azure App Service](../app-service/overview.md). For microservice architecture, consider [Azure Spring Apps](../spring-apps/index.yml) or [Service Fabric](../service-fabric/index.yml). If you need more control over the VMs on which your code runs, consider [Azure Virtual Machines](../virtual-machines/index.yml). For more information about how to choose between Azure services, see [Choose an Azure compute service](/azure/architecture/guide/technology-choices/compute-decision-tree).

## Next steps

> [!div class="nextstepaction"]
> [Deploy a web app with Azure App Spaces](quickstart-deploy-web-app.md)

## Related articles

- [Deploy an App Spaces template](deploy-app-spaces-template.md)
