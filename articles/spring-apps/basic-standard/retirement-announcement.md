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

Azure Spring Apps is a fully managed service for running Java Spring applications, jointly built by Microsoft and VMware by Broadcom. After careful consideration and analysis, Microsoft and Broadcom have made the difficult decision to retire the Azure Spring Apps service. We recommend Azure Container Apps and Azure Kubernetes Service as the replacement services for your migration of workloads running on Azure Spring Apps.

We're committed to supporting you with a long-term platform with migration tools, expert resources, and technical support through the end of the service.

## Timeline

Azure Spring Apps, including the Standard consumption and dedicated (currently in Public Preview only), Basic, Standard, and Enterprise plans, will be retired through a two-phased retirement plan:

- On September 30, 2024, the Standard consumption and dedicated plan (preview) will enter a six-month retirement period and will be retired on March 31, 2025.
- On March 17, 2025, all other Azure Spring Apps plans, including Basic, Standard, and Enterprise plans, will enter a three-year retirement period and will be retired on March 31, 2028.

:::image type="content" source="media/retirement-announcement/retirement-period.png" alt-text="Diagram showing the Azure Spring Apps retirement period.":::

## Migration recommendation

To ensure that you maintain high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps and Azure Kubernetes Service as the replacement services for your migration of workloads running on Azure Spring Apps.

Azure Container Apps is a fully managed, serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale. For more information about Azure Container Apps, see [Azure Container Apps overview](../../container-apps/overview.md).
Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features like automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. Learn more: [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks).

## Migration guidance and tooling for the Azure Spring Apps Standard consumption and dedicated plan

For the Azure Spring Apps Standard consumption and dedicated plan (preview), new customers will no longer be able to sign up for the service after September 30, 2024, while existing customers will remain operational until this plan is retired on March 31, 2025.

Migration guidance and tooling will offer customers a smooth transition from Azure Spring Apps to Azure Container Apps. For more information, see [Migrate Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps](../consumption-dedicated/overview-migration.md).

## Migration guidance and tooling for the Azure Spring Apps Basic and Standard plans

New customers will no longer be able to sign up for the service after March 17, 2025, while existing customers will remain operational until the plans are phased out on March 31, 2028.

While the service will generally remain operational until March 31, 2028, we strongly recommend that existing customers migrate their applications off Azure Spring Apps as soon as possible. This will help ensure as little disruption as possible to your business operations. Migration guidance can be found [here](https://learn.microsoft.com/en-us/azure/spring-apps/migration/), and the migration tool assisting with Azure Container Apps environment setup will be available on March 17, 2025.

## Migration guidance and tooling for the Azure Spring Apps Enterprise plans

Azure Spring Apps Enterprise Key Dates:
•	March 17, 2025: New customers will no longer be able to sign up for the service.
•	March 31, 2028: General operational end date for the service.
While the service will generally remain operational until March 31, 2028, we strongly recommend that existing customers migrate their applications off Azure Spring Apps Enterprise as soon as possible. This will help ensure as little disruption as possible to your business operations.

Microsoft and Broadcom are committed to providing continuous support for all Tanzu components throughout the retirement period.  However, three Tanzu components - App Live View, App Accelerator, and App Configuration Service - will be out of support after August 2025 due to Broadcom’s product lifecycle ending for these components in compliance with TAP 1.12’s lifecycle period (you can check that by logging in https://support.broadcom.com/group/ecx/productlifecycle).

Migration guidance can be found [here](https://learn.microsoft.com/en-us/azure/spring-apps/migration/), and the migration tool assisting with Azure Container Apps environment setup will be available on March 17, 2025.

## What is the impact for customers using Tanzu Components with Azure Spring Apps Enterprise?

If you have interest in obtaining or continuing Spring commercial support and using Tanzu components, the recommended migration destination is Azure Kubernetes Service (AKS). Work with your Broadcom sales representative to explore how to purchase and run Tanzu on AKS.

## FAQ

### What are the migration destinations?

To ensure that you maintain high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps and Azure Kubernetes Service as the replacement services for your migration of workloads running on Azure Spring Apps.

Azure Container Apps is a fully managed, serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale. For more information about Azure Container Apps, see [Azure Container Apps overview](../../container-apps/overview.md).
Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features like automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. Learn more: [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks).

You might also consider the following alternative solutions:

- PaaS solution: Azure App Service is a fully managed platform for building, deploying, and scaling web apps, mobile app backends, and RESTful APIs. It supports multiple programming languages (such as Java and .NET), integrates with various development tools, and provides features like autoscaling, load balancing, and security for applications. Learn more: [App Service Overview](../../app-service/overview.md).
- If you're currently using Spring commercial support or Tanzu components as part of Azure Spring Apps Enterprise, you need to switch to using Tanzu Platform Spring Essentials on Azure Container Apps. Learn more: [VMware Tanzu Spring](https://tanzu.vmware.com/spring).

### Will Azure Spring Apps still allow new customer sign-ups?

For Azure Spring Apps Standard consumption and dedicated plan (preview), new customers will no longer be able to sign up for the service after September 30, 2024, while existing customers will remain operational until these plans are retired on March 31, 2025.

For Azure Spring Apps Basic, Standard, and Enterprise plans, new customers will no longer be able to sign up for the service after March 17, 2025, while existing customers who already use Azure Spring Apps will remain operational until the plans are phased out on March 31, 2028.

### Will Microsoft continue to support my current workloads?

Yes, support will continue for your workloads on Azure Spring Apps until the retirement date. You'll continue to receive SLA assurance, infrastructure updates/maintenance (VM and AKS), management of OSS/Tanzu components, and updates for container images of your apps including base OS, runtime (JDK, dotnet runtime, and so on), and APM agents. You can still raise support tickets as usual for prompt assistance through the end of the service.

### Will Azure Spring Apps provide any new features during the retirement period?

No, we won't take up any feature requests from customers and won't be building any features in the Azure Spring Apps service. Instead, we'll prioritize new features and enhancements on Azure Container Apps.

### What will happen for customers who can't migrate off Azure Spring Apps Enterprise plan by Aug 2025?

If you still utilize any of the three unsupported Tanzu components - App Live View, App Accelerator, and App Configuration Service, please be aware that support for these components will be discontinued starting from September 2025. Moreover, Microsoft reserves the right to remove these unsupported components should a critical vulnerability be identified.

### What will happen after retirement date?

After March 31, 2025, the Azure Spring Apps Standard consumption and dedicated plan (preview) will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services.

After March 31, 2028, Azure Spring Apps Basic, Standard and Enterprise plans will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services. We strongly suggest you migrate your workloads to Azure Container Apps by March 31, 2028.

### How do you distinguish new and existing customers for Azure Spring Apps?

For Azure Spring Apps Consumption and dedicated plan, existing customers are who have created Azure Spring Apps serivce instances before Sep 30, 2024, and new customers are who have never created Azure Spring Apps service instances before that date.

For Azure Spring Apps basic, standard and enterprise plans, existing customers are who have created Azure Spring Apps serivce instances before March 17, 2025, and new customers are who have never created Azure Spring Apps service instances before that date.

### Does Microsoft Container Apps offer feature parity with Azure Spring Apps?

Customers should be able to achieve most of the desired capabilities to host their Spring applications on Azure Container Apps. Managed Spring components, Java metrics, and diagnostics support are available for you to use on Azure Container Apps. For more information, see [Java on Azure Container Apps overview](../../container-apps/java-overview.md). If you have any questions, open a support ticket from the Azure portal or open an issue in the [azure-container-apps](https://github.com/microsoft/azure-container-apps/issues) repository on GitHub.

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
| [Guidance for migrating to Azure Container Apps (without migration tooling support)](https://learn.microsoft.com/en-us/azure/spring-apps/migration/migrate-to-azure-container-apps-overview)                           | Basic, Standard, and Enterprise plans   | Jan 2025           |
| [Guidance for migrating to AKS](https://learn.microsoft.com/en-us/azure/spring-apps/migration/migrate-to-aks-overview)                                                                                | Basic, Standard, and Enterprise plans   | Jan 2025           |
| [Guidance for helping switch from Tanzu components to alternative solutions](https://learn.microsoft.com/en-us/azure/spring-apps/migration/migrate-off-deprecated-tanzu-components)                                   | Enterprise plans                        | Jan 2025     |
| Official retirement start date                                                                               | Basic, Standard, and Enterprise plans   | March 17, 2025     |
| [Guidance for migrating to Azure Container Apps with migration tooling support](https://learn.microsoft.com/en-us/azure/spring-apps/migration/migrate-to-azure-container-apps-overview)                                | Basic, Standard, and Enterprise plans   | March 17, 2025     |
| Block new customer sign-ups                                                                                  | Basic, Standard, and Enterprise plans   | March 17, 2025         |
| Official retirement date after a half year retirement period                                                 | Standard consumption and dedicated plan | March 31, 2025     |
| Official retirement date after a three-year retirement period                                                | Basic, Standard, and Enterprise plans   | March 31 2028      |

### How can I get transition help and support during migration?

If you have any questions, you can open a support ticket through the Azure portal for technical help: create an [Azure Support Request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

### What's the impact of retiring Azure Spring Apps on the overall Java on Azure investment?

We want to reassure you that the decision to retire Azure Spring Apps is focused solely on that specific product and doesn't affect Microsoft's overall commitment to Java on Azure. In fact, we're increasing our investment in Azure Container Apps and enhancing our Java tooling to provide even better support for running Java applications on Azure.
