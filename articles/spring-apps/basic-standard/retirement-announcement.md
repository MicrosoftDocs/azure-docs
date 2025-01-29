---
title: Azure Spring Apps Retirement Announcement
description: Announces the retirement of the Azure Spring Apps service.
author: KarlErickson
ms.author: taoxu
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 09/30/2024
ms.custom: devx-track-java, engagement-fy23, references_regions
---

# Azure Spring Apps retirement announcement

Azure Spring Apps is a fully managed service for running Java Spring applications, jointly built by Microsoft and VMware by Broadcom. After careful consideration and analysis, Microsoft and Broadcom have made the difficult decision to retire the Azure Spring Apps service. We recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps. Azure Container Apps is a strong and enterprise ready platform that provides fully managed, serverless container service for polyglot apps and enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale.

We're committed to supporting you with a long-term platform with migration tools, expert resources, and technical support through the end of the service.

## Timeline

Azure Spring Apps, including the Standard consumption and dedicated (currently in Public Preview only), Basic, Standard, and Enterprise plans, will be retired through a two-phased retirement plan:

- On September 30, 2024, the Standard consumption and dedicated plan (preview) will enter a six-month retirement period and will be retired on March 31, 2025.
- In mid-March 2025, all other Azure Spring Apps plans, including Basic, Standard, and Enterprise plans, will enter a three-year retirement period and will be retired on March 31, 2028.

:::image type="content" source="media/retirement-announcement/retirement-period.png" alt-text="Diagram showing the Azure Spring Apps retirement period.":::

## Migration recommendation

To ensure that you maintain high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps. If you're using the Azure Spring Apps Enterprise plan, Azure Container Apps remains the most recommended destination. However, if you prefer to continue using Tanzu, AKS is a better choice, enabling you to host Tanzu components yourself with full control and capability over them.

Azure Container Apps is a fully managed, serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale.

Key Features of Azure Container Apps:

- Fully managed, serverless container platform
- Scale to zero capability
- Open-source foundation and add-ons
- [Enhanced Java support](../../container-apps/java-overview.md)
  - Managed Spring components support (Eureka Server, Config Server, Spring Boot Admin)
  - Built-in JVM metrics
  - Diagnostics for Java apps

For more information about Azure Container Apps, see [Azure Container Apps overview](../../container-apps/overview.md).

## Migration guidance and tooling for the Azure Spring Apps Standard consumption and dedicated plan

For the Azure Spring Apps Standard consumption and dedicated plan (preview), new customers will no longer be able to sign up for the service after September 30, 2024, while existing customers will remain operational until this plan is retired on March 31, 2025.

Migration guidance and tooling will offer customers a smooth transition from Azure Spring Apps to Azure Container Apps. For more information, see [Migrate Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps](../consumption-dedicated/overview-migration.md).

## Migration guidance and tooling for the Azure Spring Apps Basic, Standard, and Enterprise plans

For the Azure Spring Apps Basic, Standard, and Enterprise plans, new customers will no longer be able to sign up for the service after March 31, 2025, while existing customers will remain operational until the plans are phased out on March 31, 2028.

We encourage you to start testing out Azure Container Apps for your Java Spring workloads and get prepared for the migration when the retirement for the Basic, Standard, and Enterprise plans starts in mid-March 2025.

Migration guidance will be ready by the end of December 2024 and the migration tool assisting with Azure Container Apps environment setup will be available by mid-March 2025 before the retirement starts.

## What is the impact for customers using Tanzu Components with Azure Spring Apps Enterprise?

If you have interest in obtaining or continuing Spring commercial support and using Tanzu components, the recommended migration destination is Azure Kubernetes Service (AKS). Work with your Broadcom sales representative to explore how to purchase and run Tanzu on AKS.

## FAQ

### What are the migration destinations?

We recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps. Azure Container Apps is a fully managed serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale. If you're using the Azure Spring Apps Enterprise plan, Azure Container Apps remains the most recommended destination. However, if you prefer to continue using Tanzu, AKS is a better choice, enabling you to host Tanzu components yourself with full control and capability over them.

Migration guidance and tooling will offer customers a smooth transition from Azure Spring Apps to Azure Container Apps. For more information, see [Migrate Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps](../consumption-dedicated/overview-migration.md).

We're working on the migration guidance and tooling from the Azure Spring Apps Basic, Standard, and Enterprise plans to Azure Container Apps. This guidance and tooling will be available by March 2025.

You might also consider the following alternative solutions:

- PaaS solution: Azure App Service is a fully managed platform for building, deploying, and scaling web apps, mobile app backends, and RESTful APIs. It supports multiple programming languages (such as Java and .NET), integrates with various development tools, and provides features like autoscaling, load balancing, and security for applications. Learn more: [App Service Overview](../../app-service/overview.md).
- Containerized solution: Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features like automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. Learn more: [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks).
- If you're currently using Spring commercial support or Tanzu components as part of Azure Spring Apps Enterprise, you need to switch to using Tanzu Platform Spring Essentials on Azure Container Apps. Learn more: [VMware Tanzu Spring](https://tanzu.vmware.com/spring).

### What is the migration timeline?

Existing customers are required to migrate their Azure Spring Apps Standard consumption and dedicated workloads to Azure Container Apps by March 31, 2025. Customers on Basic, Standard, and Enterprise plans are required to complete this transition by March 31, 2028. Azure Spring Apps will be entirely retired by March 31, 2028.

### Will Azure Spring Apps still allow new customer sign-ups?

For Azure Spring Apps Standard consumption and dedicated plan (preview), new customers will no longer be able to sign up for the service after September 30, 2024, while existing customers will remain operational until these plans are retired on March 31, 2025.

For Azure Spring Apps Basic, Standard, and Enterprise plans, new customers will no longer be able to sign up for the service after March 31, 2025, while existing customers who already use Azure Spring Apps will remain operational until the plans are phased out on March 31, 2028.

### Will Microsoft continue to support my current workload?

Yes, support will continue for your workloads on Azure Spring Apps until the retirement date. You'll continue to receive SLA assurance, infrastructure updates/maintenance (VM and AKS), management of OSS/Tanzu components, and updates for container images of your apps including base OS, runtime (JDK, dotnet runtime, and so on), and APM agents. You can still raise support tickets as usual for prompt assistance through the end of the service.

### Will Azure Spring Apps provide any new features during the retirement period?

No, we won't take up any feature requests from customers and won't be building any features in the Azure Spring Apps service. Instead, we'll prioritize new features and enhancements on Azure Container Apps.

### What will happen after retirement date?

After March 31, 2025, the Azure Spring Apps Standard consumption and dedicated plan (preview) will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services.

After March 31, 2028, Azure Spring Apps Basic, Standard and Enterprise plans will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services. We strongly suggest you migrate your workloads to Azure Container Apps by March 31, 2028.

### Does Microsoft Container Apps offer feature parity with Azure Spring Apps?

Customers should be able to achieve most of the desired capabilities to host their Spring applications on Azure Container Apps. Managed Spring components, Java metrics, and diagnostics support are available for you to use on Azure Container Apps. For more information, see [Java on Azure Container Apps overview](../../container-apps/java-overview.md). If you have any questions, open a support ticket from the Azure portal or open an issue in the [azure-container-apps](https://github.com/microsoft/azure-container-apps/issues) repository on GitHub.

### Will Microsoft Azure Container Apps be available in the same Azure regions as Azure Spring Apps?

For the Standard consumption and dedicated plan (preview), Azure Container Apps and Azure Spring Apps are available in the same regions.

Azure Container Apps will be available in the same Azure regions as Azure Spring Apps for customers under the Basic, Standard, and Enterprise plans before the migration starts in March 2025.

### Are there pricing differences across Microsoft solutions?

Azure Spring Apps operates on a consumption-based model with a basic unit where you only pay for vCPU and memory for your apps.

[Azure Container Apps](https://azure.microsoft.com/pricing/details/container-apps/) offers the following two pricing models:

- A consumption model billed based on per-second resource allocation (on VCPU and memory) and requests.
- A dedicated model with a single tenancy guarantee, access to specialized hardware, and more predictable pricing.

Billing for the dedicated plan is based on the number of vCPU seconds and gibibyte (GiB) seconds allocated across Azure Container App instances. Azure Container Apps also provides savings plan.

The costs for Microsoft solutions will vary based on their pricing model and optimizations that can be enabled. We recommend using the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?ef_id=_k_8d2e1450f88b14d2046272e613f0ee0b_k_&OCID=AIDcmm5edswduu_SEM__k_8d2e1450f88b14d2046272e613f0ee0b_k_&msclkid=8d2e1450f88b14d2046272e613f0ee0b), which provides details on meters, usage prices, and available savings plans to accurately assess anticipated costs.

### What is the impact for customers using Tanzu Components with Azure Spring Apps Enterprise?

If you have interest in obtaining or continuing Spring commercial support and using Tanzu components, the recommended migration destination is AKS. Work with your Broadcom sales representative to explore how to purchase and run Tanzu on AKS.

### How can I stay up to date with Azure Spring Apps retirement guidance?

The following table indicates the overall release timeline for whole Azure Spring Apps retirement period. We'll keep it updated when the corresponding guidance and tooling is ready for release.

| Item                                                                                                         | Target plans                            | Release date       |
|--------------------------------------------------------------------------------------------------------------|-----------------------------------------|--------------------|
| Official retirement start date                                                                               | Standard consumption and dedicated plan | September 30, 2024 |
| Block new service instance creation for all customers                                                        | Standard consumption and dedicated plan | September 30, 2024 |
| [Guidance and tooling for migration to Azure Container Apps](../consumption-dedicated/overview-migration.md) | Standard consumption and dedicated plan | October 2024       |
| Guidance for migrating to Azure Container Apps (without migration tooling support)                           | Basic, Standard, and Enterprise plans   | Jan 2025           |
| Guidance for migrating to AKS                                                                                | Basic, Standard, and Enterprise plans   | Jan 2025           |
| Official retirement date after a half year retirement period                                                 | Standard consumption and dedicated plan | March 31, 2025     |
| Official retirement start date                                                                               | Basic, Standard, and Enterprise plans   | Mid-March 2025     |
| Guidance for migrating to Azure Container Apps with migration tooling support                                | Basic, Standard, and Enterprise plans   | Mid-March 2025     |
| Guidance for helping switch from Tanzu components to alternative solutions                                   | Enterprise plans                        | Mid-March 2025     |
| Block new customer sign-ups                                                                                  | Basic, Standard, and Enterprise plans   | April 2025         |
| Official retirement date after a three-year retirement period                                                | Basic, Standard, and Enterprise plans   | March 31 2028      |

### How can I get transition help and support during migration?

If you have any questions, you can open a support ticket through the Azure portal for technical help: create an [Azure Support Request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

### What's the impact of retiring Azure Spring Apps on the overall Java on Azure investment?

We want to reassure you that the decision to retire Azure Spring Apps is focused solely on that specific product and doesn't affect Microsoft's overall commitment to Java on Azure. In fact, we're increasing our investment in Azure Container Apps and enhancing our Java tooling to provide even better support for running Java applications on Azure.
