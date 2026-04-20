---
author: cshoe
ms.topic: include
ms.date: 07/18/2025
ms.author: craigshoemaker
---

## Container option comparisons

### Azure Container Apps

[Azure Container Apps](/azure/container-apps/overview) enables you to build serverless microservices and jobs based on containers. Distinctive features of Container Apps include:

- Optimized to run general purpose containers, especially for applications that span many microservices deployed in containers.
- Powered by Kubernetes and open-source technologies like [Dapr](https://dapr.io/), [KEDA](https://keda.sh/), and [envoy](https://www.envoyproxy.io/).
- Supports Kubernetes-style apps and microservices with features like [service discovery](/azure/container-apps/connect-apps) and [traffic splitting](/azure/container-apps/revisions).
- Enables event-driven application architectures by supporting scale based on traffic and pulling from [event sources like queues](/azure/container-apps/scale-app), including [scale to zero](/azure/container-apps/scale-app).
- Supports running on demand, scheduled, and event-driven [jobs](/azure/container-apps/jobs).
- Enables running [Azure Functions](/azure/container-apps/functions-overview) for [event-driven scenarios](/azure/azure-functions/functions-scenarios) using triggers, bindings and automatic scaling.

Azure Container Apps doesn't provide direct access to the underlying Kubernetes APIs. If you require access to the Kubernetes APIs and control plane, you should use [Azure Kubernetes Service](/azure/aks/what-is-aks). However, if you would like to build Kubernetes-style applications and don't require direct access to all the native Kubernetes APIs and cluster management, Container Apps provides a fully managed experience based on best-practices. For these reasons, many teams prefer to start building container microservices with Azure Container Apps.

You can get started building your first container app [using the quickstarts](/azure/container-apps/get-started).

### Azure App Service

[Azure App Service](/azure/app-service/overview) provides fully managed hosting for web applications including websites and web APIs. You can deploy these web applications using code or containers. Azure App Service is optimized for web applications. Azure App Service is integrated with other Azure services including Azure Container Apps or Azure Functions. When building web apps, Azure App Service is an ideal option.

### Azure Container Instances

[Azure Container Instances (ACI)](/azure/container-instances/) provides a single pod of Hyper-V isolated containers on demand. It can be thought of as a lower-level "building block" option compared to Container Apps. Concepts like scale, load balancing, and certificates aren't provided with ACI containers. For example, to scale to five container instances, you create five distinct container instances. Azure Container Apps provide many application-specific concepts on top of containers, including certificates, revisions, scale, and environments. Users often interact with Azure Container Instances through other services. For example, Azure Kubernetes Service can layer orchestration and scale on top of ACI through [virtual nodes](/azure/aks/virtual-nodes). If you need a less "opinionated" building block that doesn't align with the scenarios Azure Container Apps is optimizing for, Azure Container Instances is an ideal option.

### Azure Kubernetes Service

[Azure Kubernetes Service (AKS)](/azure/aks/what-is-aks) provides a fully managed Kubernetes option in Azure. It supports direct access to the Kubernetes API and runs any Kubernetes workload. The full cluster resides in your subscription, with the cluster configurations and operations within your control and responsibility. Teams looking for a fully managed version of Kubernetes in Azure, Azure Kubernetes Service is an ideal option.

### Azure Functions

[Azure Functions](/azure/azure-functions/functions-overview) is a serverless Functions-as-a-Service (FaaS) solution. It's optimized for running event-driven applications using the functions programming model. It shares many characteristics with Azure Container Apps around scale and integration with events, but optimized for ephemeral functions deployed as either code or containers. The Azure Functions programming model provides productivity benefits for teams looking to trigger the execution of your functions on events and bind to other data sources. When building FaaS-style functions, Azure Functions is the ideal option. The Azure Functions programming model is available as a base container image, making it portable to other container based compute platforms allowing teams to reuse code as environment requirements change. 

### Azure Red Hat OpenShift

[Azure Red Hat OpenShift](/azure/openshift/intro-openshift) is an integrated product with Red Hat and Microsoft jointly engineered, operated, and supported. This collaboration provides an integrated product and support experience for running Kubernetes-powered OpenShift. With Azure Red Hat OpenShift, teams can choose their own registry, networking, storage, and CI/CD solutions. Alternatively, they can use the built-in solutions for automated source code management, container and application builds, deployments, scaling, health management, and more from OpenShift. If your team or organization is using OpenShift, Azure Red Hat OpenShift is an ideal option.
