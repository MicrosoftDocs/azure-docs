---
title: Roadmap for Azure DevTest Labs
description: Learn about features in development and coming soon for Azure DevTest Labs.
ms.service: azure-devtest-labs
ms.topic: concept-article
author: anishtrakru
ms.author: anishtrakru
ms.date: 09/30/2024

#customer intent: As a customer, I want to understand upcoming features and enhancements in Azure DevTest Labs so that I can plan and optimize development and deployment strategies.

---
# Azure DevTest Labs roadmap 

This roadmap presents a set of planned feature releases that underscores Microsoft's commitment to empowering enterprise development and testing teams. DevTest Labs enables development teams to self-serve customized, ready-to-test machines in the cloud, all while maintaining adherence to organizational governance policies. This feature list offers a glimpse into our plans for the next six months, highlighting key features we're developing. It isn't exhaustive but shows major investments. Some features might release as previews and evolve based on your feedback before becoming generally available. We always listen to your input, so the timing, design, and delivery of some features might change. 

Key DevTest Labs deliverables can be grouped under the following themes: 

- [Ready-to-test virtual machines](#ready-to-test-virtual-machines)
- [Enterprise management](#enterprise-management) 
- [Performance and reliability](#performance-and-reliability) 

## Ready-to-test virtual machines

The fundamental goal of DevTest Labs is to provide a seamless, intuitive experience that empowers development and testing teams. DevTest Labs enables you to swiftly access ready-to-test machines for deploying and validating the latest versions or features of any version of your application. We're dedicated to advancing this vision by continuously investing in innovative technologies to enhance machine customization and optimize testing efficiency.  

- **Hibernate VM:** Hibernating a machine preserves its exact state upon resumption, allowing developers to effortlessly troubleshoot issues identified during testing. 
- **Lab-level Secrets:** Platform engineers and dev managers will be able to set up centralized secrets accessible to the entire team, streamlining virtual machine creation and management. 
- **Generation 2 VMs:** Generation 2 VMs will improve virtual machine boot and installation times and enable secure boot by default.  

## Enterprise management 

DevTest Labs delivers a streamlined and optimized experience for end-users while also offering robust enterprise capabilities to enforce organizational governance, covering security, cost management, and monitoring. We're committed to enhancing these capabilities with upcoming features that will fortify the machines and help reduce costs. 

- **Managed Identity and GitHub Apps:** To ensure secure connections to source control repositories and storage accounts, we'll introduce the ability to: 
    - Attach Azure Repos repositories via managed identities 
    - Attach GitHub repositories through GitHub Apps 
    - Access lab storage accounts via managed identities 
- **Trusted Launch:** Trusted launch will enhance protection for lab machines against advanced and persistent attacks by enabling features like secure boot, vTPM, virtualization-based security, and integration with Microsoft Defender for Cloud. 
- **Spot VMs:** Spot VMs will lower test machine costs for workloads that can handle interruptions. 
- **Standard Load Balancer:** Standard Load Balancer provides significant improvements over basic such as high performance, ultra-low latency, superior resilient load-balancing, and increased security by default. 

## Performance and Reliability 

DevTest Labs aims to provide a seamless testing experience that is as responsive as a local machine, and we're consistently enhancing the reliability, speed, and performance of DevTest Labs through platform optimization. 

**API and Portal Reliability:** We're continuing to invest in our API performance and aiming to attain higher reliability. 

This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to share your thoughts and suggest other capabilities you would like to see. Your insights help us refine our focus and deliver even greater value. 


## Related content

- [What is DevTest Labs?](./devtest-lab-overview.md)