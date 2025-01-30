---
title: Migrate Azure Spring Apps to Azure Kubernetes Service
description: Provides an overview of migrating from Azure Spring Apps to Azure Kubernetes Service.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Azure Spring Apps to Azure Kubernetes Service

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article provides an overview of migrating from Azure Spring Apps to Azure Kubernetes Service (AKS).

Azure Spring Apps is a platform-as-a-service (PaaS) solution designed specifically for Spring Boot applications. It makes deploying, running, and managing these applications easier. Azure Spring Apps takes care of infrastructure, scaling, and monitoring, so developers can focus on their code.

AKS is an infrastructure-as-a-service (IaaS) offering that provides a fully managed Kubernetes environment. AKS gives you more control over how your applications are deployed and managed. It supports a wide range of containerized applications and enables customization to meet specific needs.

Migrating applications from Azure Spring Apps to AKS means moving from a managed environment to one that gives you more flexibility. This process requires adopting new tools and practices to achieve the same outcomes on AKS as you had with Azure Spring Apps.

## Concept mapping

Because Azure Spring Apps and AKS are different types of cloud service offerings, it isn't entirely accurate to map Azure Spring Apps concepts directly to AKS. Also, Azure Spring Apps depends on many internal components when used in production environments, which aren't listed here. The following diagram and table provide a simple mapping of concepts from Azure Spring Apps to AKS to help you understand the basics. In a real production environment, you should consider more secure and reliable solutions.

:::image type="content" source="media/migrate-to-aks-overview/concept-mapping.png" alt-text="Diagram of the concept mapping between Azure Spring Apps and Azure Kubernetes Service.":::

| Azure Spring Apps service                                                                                              | Azure Kubernetes Service                                                                                                                                                                                                                                                                                                                                                                           |
|------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| A *Service instance* hosts and secures a boundary for apps and other resources, and supports a custom virtual network. | A *Cluster* is the basic unit of deployment. Within a cluster, a *Namespace* is a virtual subdivision used to organize and isolate resources. It shares the same underlying network infrastructure defined by cluster's virtual network. Choosing between a dedicated cluster or a shared cluster with namespaces depends on your business needs.                                                  |
| An *App* is one business app that serves as a child resource within a service instance.                                | A business *App* is a virtual concept in Azure Spring Apps and is made up of multiple resources in AKS. *Ingress* controls external access to services and sets rules for routing traffic to different services. A *Service* abstracts access to a set of pods. You can perform a blue-green deployment switch by updating a service to point to a different version of a deployment using labels. |
| A *Deployment* is the version of an app. An app can have one production deployment and one staging deployment.         | A *Deployment* manages the rollout and lifecycle of a specific application or service. It also enables rolling updates and rollbacks, enabling controlled, seamless application changes without downtime.                                                                                                                                                                                          |
| An *Application instance* is the minimum runtime unit managed by the service.                                          | A *Pod* represents one or more tightly coupled containers and hosts a single instance of a running application or workload.                                                                                                                                                                                                                                                                        |

## Network considerations

Before provisioning an AKS cluster, it's important to carefully consider the network settings. These decisions can significantly affect the performance, scalability, and security of your applications.

AKS relies on Container Networking Interface (CNI) plugins to manage networking within its clusters. These plugins handle critical tasks like assigning IP addresses to pods, routing traffic between them, and enabling communication through Kubernetes Services. AKS supports multiple CNI plugins tailored to different networking needs, providing flexibility in cluster design.

AKS offers two primary networking models: overlay networks and flat networks. Overlay networks assign private IP addresses to pods, separate from the Azure Virtual Network subnet of the AKS nodes. This model is scalable and conserves virtual network IP addresses but uses Network Address Translation (NAT) for traffic leaving the cluster. In contrast, flat networks assign pod IP addresses directly from the same Azure Virtual Network subnet as the nodes, enabling external services to access pods without NAT. While flat networks enable direct pod communication, they require more extensive virtual network IP address space.

Proper IP planning is essential for a smooth AKS operation. It's important to ensure subnets have enough IP addresses for all resources, avoid overlapping ranges, and leave room for future growth to prevent connectivity issues and disruptions. For more information, see [Azure Kubernetes Service CNI networking overview](/azure/aks/concepts-network-cni-overview).

To handle incoming traffic in AKS, you can use load balancers or ingress controllers. Load balancers operate at Layer 4, distributing traffic based on protocols and ports, while ingress controllers work at Layer 7, offering advanced features like URL-based routing and TLS/SSL termination. Ingress controllers reduce the need for multiple public IPs by managing traffic to multiple applications through a single IP. For web applications, ingress controllers are preferred as they provide better traffic management and integration with Kubernetes resources. For more information, see [Managed NGINX ingress with the application routing add-on](/azure/aks/app-routing).

To secure network traffic in AKS, use Web Application Firewalls (WAF) like Azure Application Gateway to protect against attacks such as cross-site scripting and cookie poisoning, while managing traffic routing and TLS/SSL termination. Additionally, implement network policies to control pod-to-pod communication by defining rules in YAML manifests, based on labels, namespaces, or ports. These policies, which are available only for Linux-based nodes, ensure better traffic control and security within the cluster. For more information, see [Secure traffic between pods by using network policies in AKS](/azure/aks/use-network-policies).

## Provision

To provision an AKS cluster, you can use the Azure portal, the Azure CLI, or ARM templates. The process typically involves selecting the desired region, defining the node pool size and type, and choosing the network model - either Azure CNI or Kubenet. You must also configure authentication options, such as Microsoft Entra ID integration for user access control. For monitoring and scaling, you can enable Azure Monitor and configure autoscaling based on resource usage. After provisioning, you can manage the cluster using kubectl or the Azure CLI. For detailed instructions on provisioning AKS, visit [Create an AKS cluster](/azure/aks/tutorial-kubernetes-deploy-cluster).

## Access and identity

AKS offers several ways to manage authentication, authorization, and access control for Kubernetes clusters. You can use Kubernetes role-based access control (RBAC) to give users, groups, and service accounts access only to the resources they need. For more information, see [Using RBAC authorization](https://kubernetes.io/docs/reference/access-authn-authz/rbac/). AKS also supports Microsoft Entra ID and Azure RBAC to improve security and control, enabling you to assign and manage permissions in a more streamlined way.

For the best security, we recommend integrating AKS with Microsoft Entra ID. This integration uses OpenID Connect and OAuth 2.0 protocols for authentication. Users authenticate using Microsoft Entra credentials when interacting with the AKS cluster, with their access permissions governed by the cluster administrator. For more information, see [Enable Azure managed identity authentication for Kubernetes clusters with kubelogin](/azure/aks/enable-authentication-microsoft-entra-id)

Microsoft Entra Workload ID integrates Kubernetes' native features with external identity providers through OpenID Connect (OIDC) federation. It uses [Service Account Token Volume Projection](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#serviceaccount-token-volume-projection) to assign Kubernetes identities to pods via annotated service accounts. With these tokens, Kubernetes applications can authenticate and access Azure resources securely using Microsoft Entra ID. This setup works seamlessly with libraries like Azure Identity client libraries (`Azure.Identity`) or the Microsoft Authentication Library (MSAL) to streamline authentication for your workloads. To learn how to set up a cluster and configure your application pod with workloads identify, see [Deploy and configure workload identity](/azure/aks/workload-identity-deploy-cluster).

## Containerize applications

Containerizing applications into container images is essential for deployment on AKS. It ensures deployments are consistent, portable, and scalable. Using container images provides flexibility in managing different versions of applications. It makes updates and rollbacks easier and improves resource efficiency by enabling multiple containers to run on a single host.

Azure Spring Apps helps users create container images and deploy applications in different ways. You can deploy from source code, from built artifacts like JAR or WAR files, or directly from a container image. To learn how to deploy from a JAR or WAR file, see [Build a container image from a JAR or WAR](./migrate-to-azure-container-apps-build-artifacts.md). To learn how to deploy from source code, see [Containerize an application by using Paketo Buildpacks](./migrate-to-azure-container-apps-build-buildpacks.md).

To monitor the performance of applications deployed on AKS, you can integrate the Application Performance Monitoring (APM) agent during the containerization process. For more information, see [Integrate application performance monitoring into container images](./migrate-to-azure-container-apps-build-application-performance-monitoring.md).

## Deploy applications and Spring Cloud components

To deploy applications to AKS, you can use [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/), which is used by Azure Spring Apps, or [StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/), depending on the needs of your application. For stateless applications, such as microservices, you would typically use a Deployment, which manages replicas of your application and ensures they're running smoothly. This type is used by Azure Spring Apps. On the other hand, StatefulSets are ideal for applications requiring persistent storage or stable identities, such as databases or services with stateful needs.

Alongside the application deployment, you also need to define a [Service](https://kubernetes.io/docs/concepts/services-networking/service/) to expose your backend pods. A Service is an abstraction that enables you to define a logical set of pods and enables network access to them. This capability is crucial for load balancing and communication between pods.

When deploying Spring Cloud components, such as Spring Cloud Config or Spring Cloud Gateway, you would generally use Deployments for stateless services. For backend services that need stable storage or state, you might choose StatefulSets.

The following links provide reference examples of container images and manifest files for Spring Cloud Components:

- [Eureka Server](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/docs/02-create-eureka-server.md)
- [Config Server](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/docs/03-create-config-server.md)
- [Spring Cloud Gateway](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/docs/05-create-application-gateway.md)
- [Spring Boot Admin](https://github.com/Azure-Samples/acme-fitness-store/blob/Azure/azure-kubernetes-service/docs/04-create-spring-boot-admin.md)

## Monitor

Monitoring is a crucial part of managing applications deployed on AKS. AKS provides a range of tools to track and analyze the status of your cluster and workloads, including integrated solutions like Azure Monitor, Azure Log Analytics, and Prometheus. For more information, see the following articles:

- [Managed Prometheus](/azure/azure-monitor/essentials/prometheus-metrics-overview) for metric collection.
- [Container insights](/azure/azure-monitor/containers/container-insights-overview) for log collection
- [Azure Managed Grafana](../../managed-grafana/overview.md) for visualization.

In addition to Azure Monitor and Prometheus, you can also use other monitoring solutions like Datadog, New Relic, or Elastic Stack (ELK). You can integrate these tools into AKS to collect logs, metrics, and traces, offering various insights into cluster performance.

## Tutorial

We provide a tutorial to demonstrate the end-to-end experience of running the ACME Fitness store application on AKS. For more information, see [acme-fitness-store/azure-kubernetes-service](https://github.com/Azure-Samples/acme-fitness-store/tree/Azure/azure-kubernetes-service). This tutorial provides practical guidance and is meant for reference. AKS is highly flexible, so you need to choose configurations and customizations based on your specific requirements.
