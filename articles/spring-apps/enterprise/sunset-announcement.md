---
title: Azure Spring Apps Sunset announcement
description: Azure Spring Apps Sunset announcement.
author: karlerickson
ms.author: taoxu
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 09/23/2024
ms.custom: devx-track-java, engagement-fy23, references_regions
---

# Azure Spring Apps Sunset announcement
         
Azure Spring Apps is a fully managed service for running Java Spring applications, jointly built by Microsoft and VMware by Broadcom. After careful consideration and analysis, Microsoft and Broadcom have made the difficult decision to retire the Azure Spring Apps service. We recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps. Azure Container Apps is a strong and enterprise ready platform that provides fully managed serverless container service for polyglot apps and enhanced Java features to help you manage, monitor and troubleshoot Java apps at scale.
We are committed to supporting you with a long-term platform with migration tools, expert resources, and technical support through the end of the service. 
## Timeline
Azure Spring Apps, including Standard consumption and dedicated, Basic, Standard and Enterprise plans, will be retired through a two-phased retirement plan:
- On September 30, 2024, Standard consumption and dedicated plan (preview) will enter a 6-month sunset period and will be retired on March 31, 2025. 
- In mid-March 2025, all other Azure Spring Apps plans including Basic, Standard and Enterprise plans will enter a 3-year sunset period and will be retired on March 31, 2028.
![image](https://github.com/user-attachments/assets/25e6548b-b6f8-437f-b8f5-7da3b674b4ae)

 

## Migration Recommendation: 
To ensure you maintain a high performance and achieve scalability, flexibility, and cost-efficiency for your business, we recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps.
Azure Container Apps is a fully managed serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor and troubleshoot Java apps at scale.
Key Features of Azure Container Apps:
•	Fully managed serverless container platform
•	Scale to zero capability
•	Open-source foundation & add-ons
•	Enhanced Java support
o	Managed Spring components support (Eureka Server, Config Server, Spring Boot Admin)
o	Built-in JVM metrics
o	Diagnostics for Java apps
Learn more about Azure Container Apps at Azure Container Apps overview | Microsoft Learn.

## Migration Support for Azure Spring Apps Standard consumption and dedicated Plan
For Azure Spring Apps Standard consumption and dedicated plan, new customers will no longer be able to sign up for the service after Sep 30, 2024, while existing customers will remain operational until these plans are retired on March 31, 2025. 
A one-click migration experience will be enabled for Azure Spring Apps Standard consumption and dedicated plan by mid-October, providing customers with a seamless transition from Azure Spring Apps to Azure Container Apps. Read this doc (https://aka.ms/DeprecatedASAConsunptionPlanFAQ) for more details.
## Migration Support for Azure Spring Apps Basic, Standard and Enterprise Plan
For Azure Spring Apps Basic, Standard, and Enterprise plans, new customers will no longer be able to sign up for the service after March 31st, 2025; existing customers will remain operational until the plans are phased out on March 31st, 2028.
We encourage you to start testing out Azure Container Apps for your Java Spring workloads and get prepared for the migration when the retirement for Basic, Standard, and Enterprise plans starts in mid-March 2025. 
Step-by-step migration guidance will be ready by the end of December 2024 and the migration tool will be available by mid-March 2025 before the retirement starts.

## What is the impact for customers using Tanzu Components with Azure Spring Apps Enterprise?
If customers are interested in obtaining or continuing Spring commercial support and leveraging Tanzu Components while migrating to Azure Container Apps, the components can download and run as Jar files on top of Azure Container Apps. Please work with Broadcom sellers to learn more. 

## FAQ 

### What are the migration destinations?
We recommend Azure Container Apps as the primary service for your migration of workloads running on Azure Spring Apps.
Azure Container Apps is a fully managed serverless container service for polyglot apps and offers enhanced Java features to help you manage, monitor and troubleshoot Java apps at scale.
A one-click migration experience will be enabled for Azure Spring Apps Standard consumption and dedicated plan by mid-October, providing customers with a seamless transition from Azure Spring Apps to Azure Container Apps. Read this doc (https://aka.ms/DeprecatedASAConsunptionPlanFAQ) for more details.
We’re working on the migration experience from Azure Spring Apps Basic, Standard and Enterprise plans to Azure Container Apps, and the migration guidance will be available by March 2025.
Alternative solutions for your consideration:
-	PaaS solution: Azure App Service is a fully managed platform for building, deploying, and scaling web apps, mobile app backends, and RESTful APIs. It supports multiple programming languages (such as Java and .NET), integrates with various development tools, and provides features like auto-scaling, load balancing, and security for applications. Learn more: Overview - Azure App Service | Microsoft Learn.
-	Containerized solution: Azure Kubernetes Service (AKS) is a managed container orchestration service that simplifies the deployment, management, and scaling of containerized applications using Kubernetes. It offers features like automated updates, monitoring, and scaling, enabling developers to focus on application development rather than infrastructure management. Learn more: What is Azure Kubernetes Service (AKS)? - Azure Kubernetes Service | Microsoft Learn
-	If you are currently leveraging Spring Commercial support or Tanzu component as part of Azure Spring Apps Enterprise, you will need to switch to leveraging Tanzu Platform Spring Essentials on Azure Container Apps.  Learn more: VMware Tanzu Spring | VMware Tanzu

### What is the migration timeline? 
Existing customers are required to migrate their Azure Spring Apps Standard consumption and dedicated workloads to Azure Container Apps by March 31, 2025. Those on Basic, Standard, and Enterprise plans are required to complete this transition by March 31, 2028. Azure Spring Apps will be entirely retired by March 31, 2028.

Will Azure Spring Apps still allow new customer sign-ups?
For Azure Spring Apps Standard consumption and dedicated plan, new customers will no longer be able to sign up for the service after Sep 30th, 2024, while existing customers will remain operational until these plans are retired on March 31st, 2025. 
For Azure Spring Apps Basic, Standard, and Enterprise plans, new customers will no longer be able to sign up for the service after March 31st, 2025; existing customers will remain operational until the plans are phased out on March 31st, 2028.

### Will Microsoft continue to support my current workload?
Yes, support will continue for your workloads on Azure Spring Apps until the retirement date. You'll continue to receive SLA assurance, infrastructure updates/maintenance (VM and AKS), management of OSS/Tanzu components, and updates for container images of your apps including base OS, runtime (JDK, dotnet runtime, etc.), and APM agents. You can still raise support tickets as usual for prompt assistance through the end of the service.

### Will Azure Spring Apps provide any new features during the sunset period?
No, we will not take up any feature requests from customers and will not be building any features in the Azure Spring Apps service. Instead, new features enhancement will be prioritized on Azure Container Apps.  

### What will happen after retirement date?
After March 31, 2025, Azure Spring Apps Standard consumption and dedicated plan will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services.
After March 31, 2028, Azure Spring Apps Basic, Standard and Enterprise plans will be completely discontinued. As a result, you will no longer receive support and access to your workloads and Azure Spring Apps services. We strongly suggest you migrate your workloads to Azure Container Apps by March 31, 2028.

### Does Microsoft Container Apps offer feature parity with Azure Spring Apps?
Most Java features work the same on Azure Container Apps, with some experiential differences. Features such as auto-patching and terraform support are not available on Azure Container Apps yet, and we are working on enabling the features by the end of December. 
If you have interest in obtaining or continuing Spring commercial support and leveraging Tanzu Components, the components can be downloaded and run as Jar files on top of Azure Container Apps.  Please work with your Broadcom sales to explore running Tanzu Platform Spring Essentials on top of Azure Container Apps. 

### Will Microsoft Azure Container Apps be available in the same Azure regions as Azure Spring Apps?
For Standard consumption and dedicated plan, Azure Container Apps and Azure Spring Apps are available in the same regions. 
Azure Container Apps will be available in the same Azure regions as Azure Spring Apps for customers under Basic, Standard and Enterprise plans before the migration starts in March 2025.

### Are there pricing differences across Microsoft solutions?
Azure Spring Apps operates on a consumption-based model with a basic unit where you only pay for vCPU and memory for your apps. 
Azure Container Apps offers two pricing models: 1) a consumption model, billed based on per-second resource allocation (on VCPU and memory) and requests. 2) dedicated model with a single tenancy guarantee, access to specialized hardware, and more predictable pricing. Billing for the dedicated plan is based on the number of vCPU seconds and gibibyte (GiB) seconds allocated across Azure Container App instances  . Azure Container Apps also provides savings plan. 
The costs for Microsoft solutions will vary based on their pricing model and optimizations that can be enabled. We recommend using the Azure Pricing Calculator, which provides details on meters, usage prices, and available savings plans to accurately assess anticipated costs.

### What is the impact for customers using Tanzu Components within Azure Spring Apps Enterprise?
If you are interested in obtaining or continuing Spring commercial support and leveraging Tanzu Components while migrating to Azure Container Apps, the components can be downloaded and run as Jar files on top of Azure Container Apps. Please work with your Broadcom sales contact to learn more.

### How can I stay up to date with Azure Spring Apps retirement guidance? 
Below table tells the overall release timeline for whole Azure Spring Apps sunset period. We will keep it updated when the corresponding doc/tool is ready for release.
| **Item**                                                                                | **Target plans**                        | **Release date** |
| --------------------------------------------------------------------------------------- | --------------------------------------- | ---------------- |
| **Official sunset start date**                                                          | Standard consumption and dedicated plan | Sep 30, 2024     |
| **Block new service instance creation for all customers**                               | Standard consumption and dedicated plan | Sep 30, 2024     |
| **One-click migration experience to Azure Container Apps**                              | Standard consumption and dedicated plan | Oct 2024         |
| **Guidance doc for helping switch from Tanzu components to alternative solutions**      | Enterprise plan                         | Oct 2024         |
| **Guidance doc for migrating to Azure Container Apps (without migration tool support)** | Basic, Standard and enterprise plans    | Dec 2024         |
| **Official retirement date after a half year sunset period**                            | Standard consumption and dedicated plan | Mar 31, 2025     |
| **Official sunset start date**                                                          | Basic, Standard and enterprise plans    | Mid-Mar 2025     |
| **Guidance doc for migrating to Azure Container Apps with migration tool support**      | Basic, Standard and enterprise plans    | Mid-Mar 2025     |
| **Block new customer sign-ups**                                                         | Basic, Standard and enterprise plans    | April 2025       |
| **Official retirement date after a 3-year sunset period**                               | Basic, Standard and enterprise plans    | Mar 31 2028      |

### How can I get transition help and support during migration?
If you have any questions, you can open a support ticket through the Azure portal for technical help: create a Azure Support Request. 
