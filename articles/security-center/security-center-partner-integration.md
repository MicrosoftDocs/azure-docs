---
title: Integrate security solutions in Azure Security Center | Microsoft Docs
description: Learn about how Azure Security Center integrates with partners to enhance the overall security of your Azure resources.
services: security-center
documentationcenter: na
author: TerryLanfear
manager: mbaldwin
editor: ''

ms.assetid: 6af354da-f27a-467a-8b7e-6cbcf70fdbcb
ms.service: security-center
ms.topic: conceptual
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/20/2018
ms.author: terrylan

---
# Integrate security solutions in Azure Security Center
This document helps you to manage security solutions already connected to Azure Security Center and add new ones.

## Integrated Azure security solutions
Security Center makes it easy to enable integrated security solutions in Azure. Benefits include:

- **Simplified deployment**: Security Center offers streamlined provisioning of integrated partner solutions. For solutions like antimalware and vulnerability assessment, Security Center can provision the needed agent on your virtual machines, and for firewall appliances, Security Center can take care of much of the network configuration required.
- **Integrated detections**: Security events from partner solutions are automatically collected, aggregated, and displayed as part of Security Center alerts and incidents. These events also are fused with detections from other sources to provide advanced threat-detection capabilities.
- **Unified health monitoring and management**: Customers can use integrated health events to monitor all partner solutions at a glance. Basic management is available, with easy access to advanced setup by using the partner solution.

Currently, integrated security solutions include:

- Endpoint protection ([Trend Micro](https://help.deepsecurity.trendmicro.com/azure-marketplace-getting-started-with-deep-security.html), [Symantec](https://www.symantec.com/products), [McAfee](https://www.mcafee.com/us/products.aspx), [Windows Defender](https://www.microsoft.com/windows/comprehensive-security), and [System Center Endpoint Protection](https://docs.microsoft.com/sccm/protect/deploy-use/endpoint-protection))
- Web application firewall ([Barracuda](https://www.barracuda.com/products/webapplicationfirewall), [F5](https://support.f5.com/kb/en-us/products/big-ip_asm/manuals/product/bigip-ve-web-application-firewall-microsoft-azure-12-0-0.html), [Imperva](https://www.imperva.com/Products/WebApplicationFirewall-WAF), [Fortinet](https://www.fortinet.com/products.html), and [Azure Application Gateway](https://azure.microsoft.com/blog/azure-web-application-firewall-waf-generally-available/))
- Next-generation firewall ([Check Point](https://www.checkpoint.com/products/vsec-microsoft-azure/), [Barracuda](https://campus.barracuda.com/product/nextgenfirewallf/article/NGF/AzureDeployment/), [Fortinet](http://docs.fortinet.com/d/fortigate-fortios-handbook-the-complete-guide-to-fortios-5.2), [Cisco](http://www.cisco.com/c/en/us/td/docs/security/firepower/quick_start/azure/ftdv-azure-qsg.html), and [Palo Alto Networks](https://www.paloaltonetworks.com/products))
- Vulnerability assessment ([Qualys](https://www.qualys.com/public-clouds/microsoft-azure/) and [Rapid7](https://www.rapid7.com/products/insightvm/))

> [!NOTE]
> Security Center does not install the Microsoft Monitoring Agent on partner virtual appliances because most security vendors prohibit external agents running on their appliance.
>
>


| Endpoint Protection               | Platforms                             | Security Center Installation | Security Center Discovery |
|-----------------------------------|---------------------------------------|------------------------------|---------------------------|
| Windows Defender (Microsoft Antimalware)                  | Windows Server 2016                   | No, Built in to OS           | Yes                       |
| System Center Endpoint Protection (Microsoft Antimalware) | Windows Server 2012 R2, 2012, 2008 R2 | Via Extension                | Yes                       |
| Trend Micro – All version         | Windows Server Family                 | No                           | Yes                       |
| Symantec v12.1.1100+              | Windows Server Family                 | No                           | Yes                       |
| McAfee v10+                       | Windows Server Family                 | No                           | Yes                       |
| Kaspersky                         | Windows Server Family                 | No                           | No                        |
| Sophos                            | Windows Server Family                 | No                           | No                        |



## How security solutions are integrated
Azure security solutions that are deployed from Security Center are automatically connected. You can also connect other security data sources, including:

- Azure AD Identity Protection
- Computers running on-premises or in other clouds
- Security solution that supports the Common Event Format (CEF)
- Microsoft Advanced Threat Analytics

![Partner solutions integration](./media/security-center-partner-integration/security-center-partner-integration-fig8.png)

## Manage integrated Azure security solutions and other data sources

1. Sign in to the [Azure portal](https://azure.microsoft.com/features/azure-portal/).

2. On the **Microsoft Azure menu**, select **Security Center**. **Security Center - Overview** opens.

3. Under the Security Center menu, select **Security solutions**.

  ![Security Center Overview](./media/security-center-partner-integration/overview.png)

Under **Security solutions**, you can view information about the health of integrated Azure security solutions and perform basic management tasks. You can also connect other types of security data sources, such as Azure Active Directory Identity Protection alerts and firewall logs in Common Event Format (CEF).

### Connected solutions

The **Connected solutions** section includes security solutions that are currently connected to Security Center and information about the health status of each solution.  

![Connected solutions](./media/security-center-partner-integration/security-center-partner-integration-fig4.png)

See [Managing connected partner solutions](security-center-partner-solutions.md) to learn more.

### Discovered solutions

Security Center automatically discovers security solutions running in Azure but are not connected to Security Center and displays the solutions in the **Discovered solutions** section. This includes Azure solutions, such as [Azure AD Identity Protection](https://docs.microsoft.com/azure/active-directory/active-directory-identityprotection), as well as partner solutions.

> [!NOTE]
> The Standard tier of Security Center is required at the subscription level for the discovered solutions feature. See [Pricing](security-center-pricing.md) to learn more about Security's pricing tiers.
>
>

Select **CONNECT** under a solution to integrate with Security Center and be notified on security alerts.

![Discovered solutions](./media/security-center-partner-integration/security-center-partner-integration-fig5.png)

Security Center also discovers solutions deployed in the subscription that are able to forward Common Event Format (CEF) logs. Learn how to [connect a security solution](quick-security-solutions.md) that uses CEF logs to Security Center.

### Add data sources

The **Add data sources** section includes other available data sources that can be connected. For instructions on adding data from any of these sources, click **ADD**.

![Data sources](./media/security-center-partner-integration/security-center-partner-integration-fig7.png)


## Next steps

In this article, you learned how to integrate partner solutions in Security Center. To learn more about Security Center, see the following articles:

* [Connecting Microsoft Advanced Threat Analytics to Azure Security Center](security-center-ata-integration.md)
* [Connecting Azure Active Directory Identity Protection to Azure Security Center](security-center-aadip-integration.md)
* [Security health monitoring in Security Center](security-center-monitoring.md). Learn how to monitor the health of your Azure resources.
* [Monitor partner solutions with Security Center](security-center-partner-solutions.md). Learn how to monitor the health status of your partner solutions.
* [Azure Security Center FAQs](security-center-faq.md). Get answers to frequently asked questions about using Security Center.
* [Azure Security blog](http://blogs.msdn.com/b/azuresecurity/). Find blog posts about Azure security and compliance.
