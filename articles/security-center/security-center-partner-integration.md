---
title: Integrate security solutions in Azure Security Center | Microsoft Docs
description: Learn about how Azure Security Center integrates with partners to enhance the overall security of your Azure resources.
services: security-center
documentationcenter: na
author: YuriDio
manager: mbaldwin
editor: ''

ms.assetid: 6af354da-f27a-467a-8b7e-6cbcf70fdbcb
ms.service: security-center
ms.topic: hero-article
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/13/2017
ms.author: yurid

---
# Integrate security solutions in Azure Security Center
This document helps you to manage security solutions already connected to Azure Security Center and add new ones. 

## How security solutions are integrated
Azure security solutions that are deployed from Security Center are automatically connected. You can also connect other security data sources, including:

- Azure AD Identity Protection
- Computers running on-premises or in other clouds
- Security solution that supports the Common Event Format (CEF)
- Microsoft Advanced Threat Analytics

![Partner solutions integration](./media/security-center-partner-integration/security-center-partner-integration-fig8.png)

### Connected solutions

The **Connected solutions** section includes security solutions that are currently connected to Security Center and information about the health status of each solution.  

![Connected solutions](./media/security-center-partner-integration/security-center-partner-integration-fig4.png)

### Discovered solutions

The **Discovered solutions** section shows all the solutions that were added via Azure. It also shows all the solutions that Security Center suggests should connect to it.

![Discovered solutions](./media/security-center-partner-integration/security-center-partner-integration-fig5.png)

Security Center automatically discovers other security solutions running in Azure. This includes Azure solutions, such as [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection), as well as partner solutions that are running in Azure. To integrate these solutions with Security Center, select **CONNECT**. 

### Add data sources

The **Add data sources** section includes other available data sources that can be connected. For instructions on adding data from any of these sources, click **ADD**. 

![Data sources](./media/security-center-partner-integration/security-center-partner-integration-fig7.png)


## Next steps

In this article, you learned how to integrate partner solutions in Security Center. To learn more about Security Center, see the following articles:

* [Security Center planning and operations guide](security-center-planning-and-operations-guide.md)
* [Connecting Microsoft Advanced Threat Analytics to Azure Security Center](security-center-ata-integration.md)
* [Connecting Azure Active Directory Identity Protection to Azure Security Center](security-center-aadip-integration.md)
* [Security health monitoring in Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Monitor partner solutions with Security Center](security-center-partner-solutions.md). Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQs](security-center-faq.md). Get answers to frequently asked questions about using Security Center.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
