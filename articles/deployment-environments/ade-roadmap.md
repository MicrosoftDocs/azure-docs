---
title: Roadmap for Azure Deployment Environments
description: Learn about features coming soon and in development for Azure Deployment Environments.
ms.service: azure-deployment-environments
ms.topic: concept-article
author: sagarlankala
ms.author: salankal
ms.date: 08/26/2024

#customer intent: As a customer, I want to understand upcoming features and enhancements in Azure Deployment Environments so that I can plan and optimize development and deployment strategies.

---

# Azure Deployment Environments Roadmap

This roadmap presents a set of planned feature releases that underscores Microsoft’s commitment to revolutionizing the way enterprise developers provision application infrastructure, offering a seamless and intuitive experience that also ensures robust centralized management and governance. This feature list offers a glimpse into our plans for the next six months, highlighting key features we're developing. It's not exhaustive but shows major investments. Some features might release as previews and evolve based on your feedback before becoming generally available. We always listen to your input, so the timing, design, and delivery of some features might change.

The key deliverables focus on the following themes:

- Self-serve app infrastructure
- Standardized deployments and customized templates
- Enterprise management 

## Self-serve app infrastructure

Navigating complex dependencies, opaque configurations, and compatibility issues, alongside managing security risks, has long made deploying app infrastructure a challenging endeavor. Azure Deployment Environments aims to eliminate these obstacles and supercharge enterprise developer agility. By enabling developers to swiftly and effortlessly self-serve the infrastructure needed to deploy, test, and run cloud-based applications, we're transforming the development landscape. Our ongoing investment in this area underscores our commitment to optimizing and enhancing the end-to-end developer experience, empowering teams to innovate without barriers.  

- Enhanced integration with Azure Developer CLI (azd) will support ADE’s extensibility model, enabling deployments using any preferred IaC framework. The extensibility model allows enterprise development teams to deploy their code onto newly provisioned or existing environments with simple commands like `azd up` and `azd deploy`. By facilitating real-time testing, rapid issue identification, and swift resolution, developers can deliver higher-quality applications faster than ever before. 
- Ability to track and manage environment operations, logs, and the deployment outputs directly in the developer portal will make it easier for dev teams to troubleshoot any potential issues and fix their deployments. 

## Standardized deployments and customized templates 

Azure Deployment Environments empowers platform engineers and dev leads to securely provide curated, project-specific IaC templates directly from source control repositories. With the support for an extensibility model, organizations can now use their preferred IaC frameworks, including popular third-party options like Pulumi and Terraform, to execute deployments seamlessly.  

While the extensibility model already allows for customized deployments, we're committed to making it exceptionally easy for platform engineers and dev leads to tailor their deployments, ensuring they can securely meet the unique needs of their organization or development team.  

- Configuring pre- and post-deployment scripts as part of environment definitions will unlock the power to integrate more logic, validations, and custom actions into deployments, leveraging internal APIs and systems for more customized and efficient workflows. 
- Support for private registries will allow platform engineers to store custom container images in a private Azure Container Registry (ACR), ensuring controlled and secure access. 

## Enterprise management 

Balancing developer productivity with security, compliance, and cost management is crucial for organizations. Deployment Environments boosts productivity while upholding organizational security and compliance standards by centralizing environment management and governance for platform engineers.  

We're committed to further investing in capabilities that strengthen both security and cost controls, ensuring a secure and efficient development ecosystem. 

- Ability to configure a private virtual network for the runner executing the template deployments puts enterprises in control while accessing confidential data and resources from internal systems. 
- Default autodeletion eliminates orphaned cloud resources, safeguarding enterprises from unnecessary costs and ensuring budget efficiency.  

This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to [share your thoughts and suggest more capabilities you would like to see](https://developercommunity.microsoft.com/deploymentenvironments/suggest). Your insights help us refine our focus and deliver even greater value. 

## Related content

- [What is Azure Deployment Environments?](overview-what-is-azure-deployment-environments.md)