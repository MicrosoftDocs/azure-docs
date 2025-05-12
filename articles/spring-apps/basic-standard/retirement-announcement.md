---
title: Azure Spring Apps Retirement Announcement
description: Announces the retirement of the Azure Spring Apps service.
author: KarlErickson
ms.author: karler
ms.reviewer: taoxu
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 02/21/2025
ms.custom: devx-track-java, devx-track-extended-java, engagement-fy23, references_regions
---

# Azure Spring Apps retirement announcement

Azure Spring Apps is a fully managed service for running Java Spring applications, jointly built by Microsoft and VMware by Broadcom. After careful consideration and analysis, Microsoft and Broadcom made the difficult decision to retire the Azure Spring Apps service. We recommend Azure Container Apps and Azure Kubernetes Service (AKS) as the replacement services for your migration of workloads running on Azure Spring Apps. We're committed to supporting you with a long-term platform with migration tools, expert resources, and technical support through the end of the service.

## Timeline

Azure Spring Apps, including the Standard consumption and dedicated (currently in Public Preview only), Basic, Standard, and Enterprise plans, will be retired through the following two-phased retirement plan:

- On September 30, 2024, the Standard consumption and dedicated plan (preview) entered a six-month retirement period, and will be retired on March 31, 2025.
- On March 17, 2025, all other Azure Spring Apps plans, including Basic, Standard, and Enterprise plans, will enter a three-year retirement period, and will be retired on March 31, 2028.

:::image type="content" source="media/retirement-announcement/retirement-period.png" alt-text="Diagram showing the Azure Spring Apps retirement period.":::

## Migration recommendation

To ensure that you maintain high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps and AKS as the replacement services for your migration of workloads running on Azure Spring Apps.

Azure Container Apps is a fully managed, serverless container service for polyglot apps. It offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale. For more information, see [Azure Container Apps overview](../../container-apps/overview.md).

AKS is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features such as automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. For more information, see [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks)

## Migration guidance and tooling for the Azure Spring Apps Standard consumption and dedicated plan

The Azure Spring Apps Standard consumption and dedicated plan (preview) no longer accepts new customers. Existing customers will remain operational until this plan is retired on March 31, 2025.

Migration guidance and tooling will offer customers a smooth transition from Azure Spring Apps to Azure Container Apps. For more information, see [Migrate Azure Spring Apps Standard consumption and dedicated plan to Azure Container Apps](../consumption-dedicated/overview-migration.md).

## Migration guidance and tooling for the Azure Spring Apps Basic and Standard plans

The Azure Spring Apps Basic and Standard plans won't accept new customers after March 17, 2025. Existing customers will remain operational until the plans are phased out on March 31, 2028. Even though the service will generally remain operational until March 31, 2028, we strongly recommend that existing customers migrate their applications off of Azure Spring Apps as soon as possible. This helps minimize disruption to your business operations.

The migration tool assisting with an Azure Container Apps environment setup will be available on March 17, 2025. For migration guidance, see [Migrate off Azure Spring Apps documentation](../migration/index.yml).

## Migration guidance and tooling for the Azure Spring Apps Enterprise plans

The Azure Spring Apps Enterprise plan won't accept new customers after March 17, 2025. Existing customers will remain operational until the plan is phased out on March 31, 2028. Even though the service will generally remain operational until March 31, 2028, we strongly recommend that existing customers migrate their applications off of Azure Spring Apps Enterprise as soon as possible. This helps minimize disruption to your business operations.

Microsoft and Broadcom are committed to providing continuous support for all Tanzu components throughout the retirement period. However, three Tanzu components - App Live View, App Accelerator, and App Configuration Service - will be out of support after August 2025 due to Broadcom's product lifecycle ending for these components, in compliance with the TAP 1.12 lifecycle period. For more information, see [Broadcom's product lifecycle information](https://support.broadcom.com/group/ecx/productlifecycle).

The migration tool assisting with an Azure Container Apps environment setup will be available on March 17, 2025. For migration guidance, see [Migrate off Azure Spring Apps documentation](../migration/index.yml).

## What is the impact for customers using Tanzu Components with Azure Spring Apps Enterprise?

If you want to obtain or continue using Spring commercial support and using Tanzu components, we recommend migrating to AKS. Work with your Broadcom sales representative to explore how to purchase and run Tanzu on AKS.

## FAQ

### What are the migration destinations?

To ensure that you maintain high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps and AKS as the replacement services for your workloads running on Azure Spring Apps.

Azure Container Apps is a fully managed, serverless container service for polyglot apps, and it offers enhanced Java features to help you manage, monitor, and troubleshoot Java apps at scale. For more information, see [Azure Container Apps overview](../../container-apps/overview.md).

Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features like automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. For more information, see [What is Azure Kubernetes Service (AKS)?](/azure/aks/what-is-aks)

You might also consider the following alternative solutions:

- PaaS solution: Azure App Service is a fully managed platform for building, deploying, and scaling web apps, mobile app backends, and RESTful APIs. It supports multiple programming languages - such as Java and .NET - integrates with various development tools, and provides features like autoscaling, load balancing, and security for applications. For more information, see [App Service Overview](../../app-service/overview.md).

- If you're currently using Spring commercial support or Tanzu components as part of Azure Spring Apps Enterprise, you need to switch to using Tanzu Platform Spring Essentials on Azure Container Apps. For more information, see [VMware Tanzu Spring](https://tanzu.vmware.com/spring).

### Will Azure Spring Apps allow new customers to sign up?

Azure Spring Apps Standard consumption and dedicated plan (preview) isn't accepting new customers. Existing customers will remain operational until these plans are retired on March 31, 2025.

Azure Spring Apps Basic, Standard, and Enterprise plans won't accept new customers after March 17, 2025. Existing customers can continue using the service, including creating, updating or deleting instances within the same tenant, until the plans are phased out on March 31, 2028.

### How do you distinguish between new and existing customers for Azure Spring Apps?

For the Azure Spring Apps Consumption and dedicated plan, if you created an Azure Spring Apps service instance before Sep 30, 2024, you're considered an existing customer. If you never created an Azure Spring Apps service instance before that date, you're considered a new customer.

For Azure Spring Apps Basic, Standard, and Enterprise plans, if you created an Azure Spring Apps service instance before March 17, 2025, you're considered an existing customer. If you never created an Azure Spring Apps service instance before that date or have not had an Azure Spring Apps service instance in the past 3 months, you're considered a new customer.

### Will Microsoft continue to support my current workloads?

Yes, support will continue for your workloads on Azure Spring Apps until the retirement date. You'll continue to receive our SLA assurance, infrastructure updates and maintenance of VM and AKS, and management of OSS/Tanzu components. You'll also continue to receive updates for container images of your apps, including base OS, the runtime - JDK, dotnet runtime, and so on - and APM agents. You can still raise support tickets as usual for prompt assistance through the end of the service.

### Will Azure Spring Apps provide any new features during the retirement period?

No, we won't take up any feature requests from customers, and we won't be building any features in the Azure Spring Apps service. Instead, we'll prioritize new features and enhancements on Azure Container Apps.

### What will happen to customers who can't migrate off the Azure Spring Apps Enterprise plan by Aug 2025?

If you still use any of the three unsupported Tanzu components - App Live View, App Accelerator, and App Configuration Service - be aware that support for these components will be discontinued starting from September 2025. Moreover, Microsoft reserves the right to remove these unsupported components should a critical vulnerability be identified.

### What will happen after the retirement date?

After March 31, 2025, the Azure Spring Apps Standard consumption and dedicated plan (preview) will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services.

After March 31, 2028, Azure Spring Apps Basic, Standard and Enterprise plans will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services. We strongly suggest you migrate your workloads to Azure Container Apps by March 31, 2028.

### Does Azure Container Apps offer feature parity with Azure Spring Apps?

Customers using Azure Container Apps should be able to achieve most of their hosting needs for Spring applications, including managed Spring components, Java metrics, and diagnostics support. For more information, see [Java on Azure Container Apps overview](../../container-apps/java-overview.md). If you have any questions, open a support ticket from the Azure portal or open an issue in the [Azure Container Apps](https://github.com/microsoft/azure-container-apps/issues) repository on GitHub.

### Are there pricing differences across Microsoft solutions?

Azure Spring Apps operates on a consumption-based model with a basic unit where you only pay for vCPU and memory for your apps.

[Azure Container Apps](https://azure.microsoft.com/pricing/details/container-apps/) offers the following two pricing models:

- A consumption model that's billed based on per-second resource allocation - on VCPU and memory - and requests.
- A dedicated model with a single tenancy guarantee, access to specialized hardware, and more predictable pricing.

Billing for the dedicated plan is based on the number of vCPU seconds and gibibyte (GiB) seconds allocated across Azure Container Apps instances. Azure Container Apps also provides a savings plan. The costs for Microsoft solutions vary based on the solution's pricing model and optimizations that can be enabled. We recommend using the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/?ef_id=_k_8d2e1450f88b14d2046272e613f0ee0b_k_&OCID=AIDcmm5edswduu_SEM__k_8d2e1450f88b14d2046272e613f0ee0b_k_&msclkid=8d2e1450f88b14d2046272e613f0ee0b), which provides details on meters, usage prices, and available savings plans to accurately assess anticipated costs.

### What is the impact for customers using Tanzu components with Azure Spring Apps Enterprise?

If you want to obtain or continue using Spring commercial support and Tanzu components, we recommend migrating to AKS. Work with your Broadcom sales representative to explore how to purchase and run Tanzu on AKS.

### How can I stay up to date with Azure Spring Apps retirement guidance?

The following table indicates the overall release timeline for the Azure Spring Apps retirement period. We update it when new tooling guidance is ready for release.

| Item                                                                                                                                           | Target plans                            | Release date       |
|------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------|--------------------|
| Official retirement start date                                                                                                                 | Standard consumption and dedicated plan | September 30, 2024 |
| Block new service instance creation for all customers                                                                                          | Standard consumption and dedicated plan | September 30, 2024 |
| [Guidance and tooling for migration to Azure Container Apps](../consumption-dedicated/overview-migration.md)                                   | Standard consumption and dedicated plan | October 2024       |
| [Guidance for migrating to Azure Container Apps (without migration tooling support)](../migration/migrate-to-azure-container-apps-overview.md) | Basic, Standard, and Enterprise plans   | January 2025       |
| [Guidance for migrating to AKS](../migration/migrate-to-aks-overview.md)                                                                       | Basic, Standard, and Enterprise plans   | January 2025       |
| [Guidance for switching from Tanzu components to alternative solutions](../migration/migrate-off-deprecated-tanzu-components.md)               | Enterprise plans                        | January 2025       |
| Official retirement start date                                                                                                                 | Basic, Standard, and Enterprise plans   | March 17, 2025     |
| [Guidance for migrating to Azure Container Apps with migration tooling support](../migration/migrate-to-azure-container-apps-overview.md)      | Basic, Standard, and Enterprise plans   | March 17, 2025     |
| Block new customer sign-ups                                                                                                                    | Basic, Standard, and Enterprise plans   | March 17, 2025     |
| Official retirement date after a half-year retirement period                                                                                   | Standard consumption and dedicated plan | March 31, 2025     |
| Official retirement date after a three-year retirement period                                                                                  | Basic, Standard, and Enterprise plans   | March 31 2028      |

### How can I get transition help and support during migration?

If you have any questions, you can open a support ticket through the Azure portal for technical help. For more information, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

### What's the impact of retiring Azure Spring Apps on the overall Java on Azure investment?

We want to reassure you that the decision to retire Azure Spring Apps is focused solely on that specific product and doesn't affect Microsoft's overall commitment to Java on Azure. In fact, we're increasing our investment in Azure Container Apps and enhancing our Java tooling to provide even better support for running Java applications on Azure.

### Is there any change on the pricing of Tanzu components in Azure Spring Apps Enterprise?

There's an important update regarding the VMware IP cost for running commercial Tanzu components in Azure Spring Apps Enterprise. With the conclusion of the free promotion period since May 2024 by Broadcom, billing of Tanzu components will be reinstated starting from April 21, 2025, remaining the same price as before the promotion started. The invoice content will be updated as Microsoft will now collect this portion of the payment from customers directly and then distribute it to Broadcom. This update is a change from the previous process where customers would directly distribute the payment to Broadcom via the [Azure Marketplace offer](https://aka.ms/ascmpoffer). For more information, see [Azure Spring Apps pricing](https://aka.ms/springcloudpricing).
