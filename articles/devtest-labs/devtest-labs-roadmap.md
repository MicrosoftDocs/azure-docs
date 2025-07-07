---
title: Roadmap for Azure DevTest Labs
description: Learn about features in development and coming soon for Azure DevTest Labs.
ms.service: azure-devtest-labs
ms.topic: concept-article
author: tanmayeekamath
ms.author: takamath
ms.date: 06/24/2025

#customer intent: As a customer, I want to understand upcoming features and enhancements in Azure DevTest Labs so that I can plan and optimize development and deployment strategies.

---
# Azure DevTest Labs roadmap

This article outlines Microsoft's planned feature releases to support enterprise development and testing teams with Azure DevTest Labs. DevTest Labs lets teams self-serve customized test machines in the cloud while following governance policies. This list highlights the key features we're developing in the next six months. Some features might be previews and can change based on feedback before general release. We value your input, so timing and priorities might change.

Key DevTest Labs deliverables group under these themes:

- [Ready-to-test virtual machines](#ready-to-test-virtual-machines)
- [Enterprise management](#enterprise-management)
- [Performance and reliability](#performance-and-reliability) 

## Ready-to-test virtual machines

The fundamental goal of DevTest Labs is to provide a seamless, intuitive experience that empowers development and testing teams. DevTest Labs enables you to swiftly access ready-to-test machines for deploying and validating the latest versions or features of any version of your application. We're dedicated to advancing this vision by continuously listening to our customers and investing in innovative technologies to enhance machine customization and optimize testing efficiency. 

- **Lab-level Secrets:** This feature lets platform engineers securely store and centrally manage sensitive information, like admin passwords or API keys, at the lab level. Teams can share secrets across VMs without hardcoding them, which simplifies automation and improves security and governance in multi-user labs. 

- **Multiple Shared Image Galleries:** This feature lets lab owners attach more than one shared image gallery (SIG) to a DevTest Lab. Platform engineering teams can better organize images by team, product, or use case. This approach improves governance, simplifies image maintenance, and gives teams more flexibility in managing and accessing the right VM images for their workflows. 

- **Modify VM expiration date in the Azure portal:** This feature will allow users to easily update the expiration date of their virtual machines directly from the Azure portal. While already supported via API, this enhancement brings a user-friendly interface to manage VM lifecycles more intuitively, helping teams reduce costs and clean up unused resources without needing manual API calls. 

- **VM snapshots:** This feature will enable teams to preserve the exact state of a VM before critical changes or test runs, enabling faster recovery, easier rollback, and more efficient troubleshooting. 

## Enterprise management 

DevTest Labs delivers a streamlined and optimized experience for end-users while also offering robust enterprise capabilities to enforce organizational governance, covering security, cost management, and monitoring. We're committed to enhancing these capabilities with upcoming features that will fortify the machines and help reduce costs. 

- **Resource view for Lab owners:** A centralized dashboard for lab owners to view all virtual machines in their lab, including usage status (running, stopped, claimed), owner details, and activity. This feature will enhance visibility and governance, making it easier to identify idle or orphaned VMs and optimize resource management across the lab. 

- **Custom roles:** This feature will allow platform engineering teams to define custom role definitions for lab virtual machines, beyond the current contributor or reader roles. This will enable more granular access control—such as restricting VM creation or deletion—tailored to specific team needs, improving governance and flexibility in multi-user lab environments. 

## Performance and Reliability 

DevTest Labs aims to provide a seamless testing experience that is as responsive as a local machine, and we're consistently enhancing the reliability, speed, and performance of DevTest Labs through platform optimization. 

- **SDK Modernization:** An upcoming upgrade to the DevTest Labs SDK will improve telemetry, enhance integration with Azure-native services, and lay the groundwork for future extensibility. 

- **API Refresh:** We're preparing to upgrade the DevTest Labs Rest APIs to the latest version, which will enable new capabilities in the portal and improve long-term maintainability. 

This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to share your thoughts and suggest other capabilities you would like to see. Your insights help us refine our focus and deliver even greater value. 

## Related content

- [What is DevTest Labs?](./devtest-lab-overview.md)