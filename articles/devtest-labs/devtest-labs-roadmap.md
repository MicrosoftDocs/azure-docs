---
title: Roadmap for Azure DevTest Labs
description: Learn about features in development and coming soon for Azure DevTest Labs.
ms.service: azure-devtest-labs
ms.topic: concept-article
author: tanmayeekamath
ms.author: takamath
ms.update-cycle: 30-days
ms.date: 12/2/2025

#customer intent: As a customer, I want to understand upcoming features and enhancements in Azure DevTest Labs so that I can plan and optimize development and deployment strategies.

---
# Azure DevTest Labs roadmap

This article outlines Microsoft's planned feature releases to support enterprise development and testing teams with Azure DevTest Labs. DevTest Labs lets teams self-serve customized test machines in the cloud while following governance policies. This list highlights the key features we're developing in the next six months. Some features might be previews and can change based on feedback before general release. We value your input, so timing and priorities might change. The DevTest Labs team continues to focus on maintaining service quality and supporting common DevTest Labs usage patterns.

- **Multiple Shared Image Gallery (SIG) support:** This feature lets lab owners attach more than one shared image gallery (SIG) to a DevTest Lab. Platform engineering teams can better organize images by team, product, or use case. This approach improves governance, simplifies image maintenance, and gives teams more flexibility in managing and accessing the right VM images for their workflows.
- **Modify VM expiration date in the Azure portal:** This feature allows users to update the expiration date of their virtual machines directly from the Azure portal. While already supported via API, this enhancement brings a user-friendly interface to manage VM lifecycles more intuitively, helping teams reduce costs and clean up unused resources without needing manual API calls.
- **SDK Modernization:** An upcoming upgrade to the DevTest Labs SDK will improve telemetry, enhance integration with Azure-native services, and lay the groundwork for future extensibility. 
- **API Refresh:** We're preparing to upgrade the DevTest Labs Rest APIs to the latest version, which will enable new capabilities in the portal and improve long-term maintainability.
- **Security, Compliance, and Reliability updates:** Ongoing platform-level fixes and dependency updates to align with Azure security, monitoring, and compliance standards.

The following capabilities and improvements have recently been released to support customers using DevTest Labs at scale:
- [Enhancing Security and streamlining Configuration with Lab Secrets](https://devblogs.microsoft.com/develop-from-the-cloud/%f0%9f%8e%89enhancing-security-and-streamlining-configuration-with-lab-secrets-in-azure-devtest-labs/)
- [Virtual Machine Management with Multi-Select, Sorting, Grouping, and Tags](https://devblogs.microsoft.com/develop-from-the-cloud/elevate-your-virtual-machine-management-with-multi-select-sorting-grouping-and-tags-in-azure-devtest-labs/)
- [Improved Security of Generation2 Virtual Machines via Trusted Launch](https://devblogs.microsoft.com/develop-from-the-cloud/improve-the-security-of-generation-2-vms-via-trusted-launch-in-azure-devtest-labs/)
- [Improved Performance and Security with Standard Load Balancer and Standard SKU Public IP Addresses](https://devblogs.microsoft.com/develop-from-the-cloud/improve-performance-and-security-using-standard-load-balancer-and-standard-sku-public-ip-addresses-in-azure-devtest-labs/)
- [Support for Generation 2 VMs](https://devblogs.microsoft.com/develop-from-the-cloud/unlock-key-capabilities-via-generation-2-vms-in-azure-devtest-labs/)
- [Reduce costs with hibernation support](https://devblogs.microsoft.com/develop-from-the-cloud/reduce-costs-with-hibernation-in-azure-devtest-labs/)


This roadmap outlines our current priorities, and we remain flexible to adapt based on customer feedback. We invite you to share your thoughts and suggest other capabilities you would like to see. Your insights help us refine our focus and deliver even greater value. Please share your feedback or report issues through the [DevTest Labs Community Forum](https://aka.ms/dtl/developer-community-forum).

## Related content

- [What is DevTest Labs?](./devtest-lab-overview.md)
