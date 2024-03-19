---
title: Azure Linux AKS Container Host partner solutions
titleSuffix: Azure Linux AKS Container Host partner solutions
description: Discover partner-tested solutions that enable you to build, test, deploy, manage, and monitor your AKS environment using Azure Linux Container Host.
ms.author: schaffererin
author: schaffererin
ms.topic: article
ms.date: 02/16/2024
---

# Azure Linux AKS Container Host partner solutions

Microsoft collaborates with partners to ensure your build, test, deployment, configuration, and monitoring of your applications perform optimally with Azure Linux Container Host on AKS.

Our third party partners featured in this article have introduction guides to help you start using their solutions with your applications running on Azure Linux Container Host on AKS.

| Solutions          | Partners                                                                                       |
|--------------------|------------------------------------------------------------------------------------------------|
| DevOps             | [Advantech](#advantech) <br> [Hashicorp](#hashicorp) <br> [Akuity](#akuity) <br> [Kong](#kong) |
| Networking         | [Buoyant](#buoyant) <br> [Isovalent](#isovalent) <br> [Tetrate](#tetrate)                      |
| Observability      | [Buoyant](#buoyant) <br> [Isovalent](#isovalent) <br> [Dynatrace](#dynatrace)                  |
| Security           | [Buoyant](#buoyant) <br> [Isovalent](#isovalent) <br> [Kong](#kong) <br> [Tetrate](#tetrate)   |
| Storage            | [Catalogic](#catalogic) <br> [Veeam](#veeam)                                                   |
| Config Management  | [Corent](#corent)                                                                              |
| Migration          | [Catalogic](#catalogic)                                                                        |

## DevOps

DevOps streamlines the delivery process, improves collaboration across teams, and enhances software quality, ensuring swift, reliable, and continuous deployment of your applications.

### Advantech

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/advantech.png":::

| Solution | Categories |
|----------|------------|
| iFactoryEHS | DevOps |

The right EHS management system can strengthen organizations behind the scenes and enable them to continuously put their best foot forward. iFactoryEHS solution is designed to help manufacturers manage employee health, improve safety, and analyze environmental footprints while ensuring operational continuity.

For more information, see [Advantech & iFactoryEHS](https://page.advantech.com/en/global/solutions/ifactory/ifactory_ehs).

### Hashicorp

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/hashicorp.png":::

| Solution | Categories |
|----------|------------|
| Terraform | DevOps |

At HashiCorp, we believe infrastructure enables innovation, and we're helping organizations to operate that infrastructure in the cloud.

<details> <summary> See more </summary><br>

Our suite of multicloud infrastructure automation products, built on projects with source code freely available at their core, underpin the most important applications for the largest enterprises in the world. As part of the once-in-a-generation shift to the cloud, organizations of all sizes, from well-known brands to ambitious start-ups, rely on our solutions to provision, secure, connect, and run their business-critical applications so they can deliver essential services, communications tools, and entertainment platforms worldwide.

</details>

For more information, see [Hashicorp solutions](https://hashicorp.com/) and [Hasicorp on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/hashicorp-4665790.terraform-azure-saas?tab=overview).

### Akuity

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/akuity.png":::

| Solution | Categories |
|----------|------------|
| Akuity Platform | DevOps |

The Akuity Platform is a managed solution for Argo CD from the creators of Argo open source project.

<details> <summary> See more </summary><br>

Argo Project is a suite of open source tools for deploying and running applications and workloads on Kubernetes. It extends the Kubernetes APIs and unlocks new and powerful capabilities in application deployment, container orchestration, event automation, progressive delivery, and more.

Akuity is rooted in Argo, extending its capabilities and using the same familiar user interface. The platform solves real-life DevOps use cases using battle-tested patterns packaged into a product with the best possible developer experience.

</details>

For more information, see [Akuity Solutions](https://akuity.io/).

### Kong

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/kong.png":::

| Solution | Categories |
|----------|------------|
| Kong Connect | DevOps <br> Security |

Kong Konnect is the unified cloud-native API lifecycle platform to optimize any environment. It reduces operational complexity, promotes federated governance, and provides robust security by seamlessly managing Kong Gateway, Kong Ingress Controller and Kong Mesh with a single management console, delivering API configuration, portal, service catalog, and analytics capabilities.

<details> <summary> See more </summary><br>

A unified Konnect control plane empowers businesses to:

* Define a collection of API Data Plane Nodes that share the same configuration.
* Provide a single control plane to catalog, connect to, and monitor the status of all control planes and instances and manage group configuration.
* Browse APIs, reference documentation, test endpoints, and create applications using specific APIs through a customizable and unified API portal for developers.
* Create a single source of truth by cataloging all services with the Service Hub.
* Access key statistics, monitor vital signs, and spot patterns in real time to see how your APIs and gateways are performing.
* Deliver a fully Kubernetes-centric operational lifecycle model through the integration of DevOps-ready config-driven API management layer and KIC’s unrivaled runtime performance.

Kong’s extensive ecosystem of community and enterprise plugins delivers critical functionality, including authentication, authorization, rate limiting, request enforcement, and caching, without increasing API platform’s footprint.

</details>

For more information, see [Kong Solutions](https://konghq.com/) and [Kong on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/konginc1581527938760.kong-enterprise?tab=Overview).

## Networking

Ensure efficient traffic management, enhanced security, and optimal network performance.

### Buoyant

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/buoyant.png":::

| Solution | Categories |
|----------|------------|
| Managed Linkerd with Buoyant Cloud | Networking <br> Security <br> Observability |

Managed Linkerd with Buoyant Cloud automatically keeps your Linkerd control plane data plane up to date with latest versions, and handles installs, trust anchor rotation, and more.

For more information, see [Buoyant Solutions](https://buoyant.io/cloud) and [Buoyant on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/buoyantinc1658330371653.buoyant?tab=Overview).

### Isovalent

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/isovalent.png":::

| Solution | Categories |
|----------|------------|
| Isovalent Enterprise for Cilium | Networking <br> Security <br> Observability |

Isovalent Enterprise for Cilium provides advanced network policy capabilities, including DNS-aware policy, L7 policy, and deny policy, enabling fine-grained control over network traffic for micro-segmentation and improved security.

<details> <summary> See more </summary><br>

Isovalent also provides multi-cluster connectivity via Cluster Mesh, seamless networking and security across multiple clouds, including public cloud providers like AWS, Azure, and Google Cloud Platform, as well as on-premises environments. With free service-to-service communication and advanced load balancing, Isovalent makes it easy to deploy and manage complex microservices architectures.

The Hubble flow observability + User Interface feature provides real-time network traffic flow and policy visualization, as well as a powerful User Interface for easy troubleshooting and network management. Tetragon provides advanced security capabilities such as protocol enforcement, IP and port allowlists, and automatic application-aware policy generation to protect against the most sophisticated threats. Tetragon is built on eBPF, enabling scaling to meet the needs of the most demanding cloud-native environments with ease.

Isovalent provides enterprise-grade support from their experienced team of experts, ensuring that any issues are resolved in a timely and efficient manner. Additionally, professional services help organizations deploy and manage Cilium in production environments.

</details>

For more information, see [Isovalent Solutions](https://isovalent.com/blog/post/isovalent-azure-linux/) and [Isovalent on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/isovalentinc1662143158090.isovalent-cilium-enterprise?tab=overview).

## Observability

Observability provides deep insights into your systems, enabling rapid issue detection and resolution to enhance your application’s reliability and performance.

### Dynatrace

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/dynatrace.png":::

| Solution | Categories |
|----------|------------|
| Dynatrace Azure Monitoring | Observability |

Fully automated, AI-assisted observability across Azure environments Dynatrace is a single source of truth for your cloud platforms, allowing you to monitor the health of your entire Azure infrastructure.

For more information, see [Dynatrace Solutions](https://www.dynatrace.com/technologies/azure-monitoring/) and [Dynatrace on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/dynatrace.dynatrace_portal_integration?tab=Overview).

## Security

Ensure the integrity and confidentiality of applications and foster trust and compliance across your infrastructure.

### Tetrate

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/tetrate.png":::

| Solution | Categories |
|----------|------------|
| Tetrate Istio Distro (TID) | Security <br> Networking |

Tetrate Istio Distro (TID) is a simple, safe enterprise-grade Istio distro, providing the easiest way of installing, operating, and upgrading.

<details> <summary> See more </summary><br>

TID enforces fetching certified versions of Istio and enables only compatible versions of Istio installation. It includes a FIPS-compliant flavor, delivers platform-based Istio configuration validations by integrating validation libraries from multiple sources, uses various cloud provider certificate management systems to create Istio CA certs that are used for signing service mesh managed workloads, and provides multiple additional integration points with cloud providers.

</details>

For more information, see [Tetrate Solutions](https://istio.tetratelabs.io/download/) and [Tetrate on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/tetrate1598353087553.tetrateistio?tab=Overview).

## Storage

Storage enables standardized and seamless storage interactions, ensuring high application performance and data consistency.

### Veeam

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/veeam.png":::

| Solution | Categories |
|----------|------------|
| Kasten K10 by Veeam | Storage |

Kasten K10 by Veeam is the #1 Kubernetes data management product, providing an easy-to-use, scalable, and secure system for backup and restore, mobility, and DR.

For more information, see [Veeam Solutions](https://www.kasten.io/partner-microsoft) and [Veeam on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/veeam.kasten_k10_by_veeam_byol?tab=overview).

## Config management

Automate and standardize the system settings across your environments to enhance efficiency, reduce errors, and ensuring system stability and compliance.

### Corent

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/corent.png":::

| Solution | Categories |
|----------|------------|
| Corent MaaS | Config Management |

Corent MaaS provides scanning to identify workloads that can be containerized, and automatically containerizes on AKS.

For more information, see [Corent Solutions](https://www.corenttech.com/SurPaaS_MaaS_Product.html) and [Corent on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/corent-technology-pvt.surpaas_maas?tab=Overview).

## Migration

Migrate workloads to Azure Linux Container Host on AKS with confidence.

### Catalogic

:::image type="icon" source="./media/azure-linux-aks-partner-solutions/catalogic.png":::

| Solution | Categories |
|----------|------------|
| CloudCasa by Catalogic | Migration <br> Storage |

CloudCasa by Catalogic is a Kubernetes backup, recovery, and migration solution that is fully compatible with AKS, as well as all other major Kubernetes distributions and managed services.

<details> <summary> See more </summary><br>

Install the CloudCasa agent and let it do all the hard work of protecting and recovering your cluster resources and persistent data from human error, security breaches, and service failures, including providing the business continuity and compliance that your business requires.

From a single dashboard, CloudCasa makes cross-cluster, cross-tenant, cross-region, and cross-cloud recoveries easy. Recovery and migration from backups includes recovering an entire cluster along with your vNETs, add-ons, load balancers and more. During recovery, users can migrate to Azure Linux, and migrate storage resources from Azure Disk to Azure Container Storage.

CloudCasa can also centrally manage Azure Backup or Velero backup installations across multiple clusters and cloud providers, with migration of resources to different environments.

</details>

For more information, see [CloudCasa by Catalogic Solutions](https://cloudcasa.io/) and [CloudCasa by Catalogic on Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/catalogicsoftware1625626770507.cloudcasa-aks-app).

## Next steps

[Learn more about Azure Linux Container Host on AKS](../azure-linux/intro-azure-linux.md).
