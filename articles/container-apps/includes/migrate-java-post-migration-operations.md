---
author: deepganguly
ms.author: deepganguly
ms.service: azure-container-apps
ms.topic: include
ms.date: 03/11/2026
---

- **CI/CD pipelines**: Add a deployment pipeline for automatic, consistent deployments. Instructions are available for [Azure Pipelines](../azure-pipelines.md) and [GitHub Actions](../github-actions.md).
- **Blue-green deployment**: Use container app revisions, revision labels, and ingress traffic weights to test code changes in production before making them available to end users. For more information, see [Blue-Green Deployment in Azure Container Apps](../blue-green-deployment.md).
- **Service bindings**: Add service bindings to connect your application to supported Azure databases. Service bindings eliminate the need to provide connection information, including credentials, to your Spring Boot applications.
- **JVM metrics**: Enable the Java development stack to collect JVM core metrics. For more information, see [Java metrics for Java apps in Azure Container Apps](../java-metrics.md).
- **Alerts**: Add Azure Monitor alert rules and action groups to quickly detect and address aberrant conditions. For more information, see [Set up alerts in Azure Container Apps](../alerts.md).
- **Zone redundancy**: Replicate your app across availability zones by enabling zone redundancy. Traffic is load balanced and automatically routed to replicas if a zone outage occurs. For more information, see [Reliability in Azure Container Apps](/azure/reliability/reliability-azure-container-apps).
- **Web Application Firewall**: Protect your container app from common exploits and vulnerabilities by using Web Application Firewall on Application Gateway. For more information, see [Protect Azure Container Apps with Web Application Firewall on Application Gateway](../waf-app-gateway.md).
