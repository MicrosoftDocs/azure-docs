---
title: Roadmap for Azure Deployment Environments
description: Learn about planned features coming soon and features in development for Azure Deployment Environments.
ms.service: azure-deployment-environments
ms.topic: concept-article
author: sagarlankala
ms.author: salankal
ms.date: 09/06/2024

#customer intent: As a customer, I want to understand upcoming features and enhancements in Azure Deployment Environments so that I can plan and optimize development and deployment strategies.

---

# Azure Deployment Environments Roadmap

This roadmap presents a set of planned feature releases aimed at improving how enterprise developers set up application infrastructure. It focuses on making the process easier and ensuring strong centralized management and governance. This list highlights key features planned for the next six months. It isn't exhaustive but shows major areas of investment. Some features might release as previews and evolve based on your feedback before becoming generally available. We always listen to your input, so the timing, design, and delivery of some features might change.

The key deliverables focus on the following themes:

- Self-serve app infrastructure
- Standardized deployments and customized templates
- Enterprise management 

## Self-serve app infrastructure

Deploying app infrastructure has been challenging due to complex dependencies, unclear configurations, compatibility issues, and managing security risks. Azure Deployment Environments (ADE) aims to remove these obstacles and make developers more agile. By allowing developers to quickly and easily set up the infrastructure needed to deploy, test, and run cloud-based applications, we're changing the development process. Our ongoing investment in this area shows our commitment to improving the end-to-end developer experience and helping teams innovate without barriers.
- Enhanced Integration with Azure Developer CLI (azd):
    - Supports ADE's extensibility model.
    - Enables deployments using any preferred Infrastructure as Code (IaC) framework.
    - Allows simple commands like `azd up` and `azd deploy` for deploying code.
    - Facilitates real-time testing, rapid issue identification, and quick resolution.
- Tracking and Managing Environment Operations:
    - Logs and deployment outputs can be managed directly in the developer portal.
    - Makes it easier for dev teams to troubleshoot and fix deployments.

## Standardized deployments and customized templates 

Azure Deployment Environments allows platform engineers and dev leads to securely provide curated, project-specific IaC templates directly from source control repositories. With support for an extensibility model, organizations can use their preferred IaC frameworks, including third-party options like Pulumi and Terraform, for seamless deployments.
Customized deployments make it easy for platform engineers and dev leads to tailor deployments and ensure they can securely meet the unique needs of their organization or development team.
- Pre- and Post-Deployment Scripts:
    - Configure as part of environment definitions.
    - Allow integration of more logic, validations, and custom actions into deployments.
    - Leverage internal APIs and systems for more customized and efficient workflows.
- Support for Private Registries:
    - Allow platform engineers to store custom container images in a private Azure Container Registry (ACR).
    - Ensure controlled and secure access.

## Enterprise management 

Balancing developer productivity with security, compliance, and cost management is crucial for organizations. Deployment Environments boosts productivity while upholding organizational security and compliance standards by centralizing environment management and governance for platform engineers.  

- Private virtual network configuration for the runner executing the template deployments:
    - Allows enterprises to control access to confidential data and resources from internal systems.
- Default Autodeletion:
    - Eliminates orphaned cloud resources.
    - Ensures budget efficiency by avoiding unnecessary costs.

This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to [share your thoughts and suggest more capabilities you would like to see](https://developercommunity.microsoft.com/deploymentenvironments/suggest). Your insights help us refine our focus and deliver even greater value. 

## Related content

- [What is Azure Deployment Environments?](overview-what-is-azure-deployment-environments.md)