---
title: Platforms supported by Azure Security Center | Microsoft Docs
description: This document provides a list of platforms supported by Azure Security Center.
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 70c076ef-3ad4-4000-a0c1-0ac0c9796ff1
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/29/2019
ms.author: memildin
---
# Supported platforms 

## Virtual machines / servers <a name="vm-server"></a>

Security Center supports virtual machines / servers on different types of hybrid environments:

* Only Azure
* Azure and on-premises
* Azure and other clouds
* Azure, other clouds, and on-premises

For an Azure environment activated on an Azure subscription, Azure Security Center will automatically discover IaaS resources that are deployed within the subscription.

> [!NOTE]
> To receive the full set of security features, you must have the [Log Analytics Agent](../azure-monitor/platform/agents-overview.md#log-analytics-agent), which is used by Azure Security Center, installed and [properly configured to send data to Azure Security Center](security-center-enable-data-collection.md#manual-agent).


The following sections list the supported server operating systems on which the [Log Analytics Agent](../azure-monitor/platform/agents-overview.md#log-analytics-agent), which is used by Azure Security Center, can run.

### Windows server operating systems <a name="os-windows"></a>

|OS|Supported by Azure Security Center|Support for integration with Microsoft Defender ATP|
|:---|:-:|:-:|
|Windows Server 2019|✔|X|
|Windows Server 2016|✔|✔|
|Windows Server 2012 R2|✔|✔|
|Windows Server 2008 R2|✔|✔|

To learn more about the supported features for the Windows operating systems, listed above, see [Virtual machine / server supported features](security-center-services.md#vm-server-features).

### Windows operating systems <a name="os-windows (non-server)"></a>

Azure Security Center integrates with Azure services to monitor and protect your Windows-based virtual machines.

### Linux operating systems <a name="os-linux"></a>

64-bit

* CentOS 6 and 7
* Amazon Linux 2017.09
* Oracle Linux 6 and Oracle Linux 7
* Red Hat Enterprise Linux Server 6 and 7
* Debian GNU/Linux 8 and 9
* Ubuntu Linux 14.04 LTS, 16.04 LTS, and 18.04 LTS
* SUSE Linux Enterprise Server 12

32-bit
* CentOS 6
* Oracle Linux 6
* Red Hat Enterprise Linux Server 6
* Debian GNU/Linux 8 and 9
* Ubuntu Linux 14.04 LTS, and 16.04 LTS

> [!NOTE]
> Since the list of supported Linux operating systems is constantly changing, if you prefer, click [here](https://github.com/microsoft/OMS-Agent-for-Linux#supported-linux-operating-systems) to view the most up-to-date list of supported versions, in case there have been changes since this topic was last published.

To learn more about the supported features for the Linux operating systems, listed above, see [Virtual machine / server supported features](security-center-services.md#vm-server-features).

### Managed virtual machine services <a name="virtual-machine"></a>

Virtual machines are also created in a customer subscription as part of some Azure managed services as well, such as Azure Kubernetes (AKS), Azure Databricks, and more. These virtual machines are also discovered by Azure Security Center, and the Log analytics agent can be installed and configured according the supported [Windows/Linux operating systems](#os-windows), listed above.

### Cloud Services <a name="cloud-services"></a>

Virtual machines that run in a cloud service are also supported. Only cloud services web and worker roles that run in production slots are monitored. To learn more about cloud services, see [Overview of Azure Cloud Services](../cloud-services/cloud-services-choose-me.md).

## PaaS Services <a name="paas-services"></a>

The following Azure PaaS resources are supported by Azure Security Center:

* SQL
* PostGreSQL
* MySQL
* CosmosDB
* Storage account
* App service
* Function
* Cloud Service
* VNet
* Subnet
* NIC
* NSG
* Batch account
* Service fabric account
* Automation account
* Load balancer
* Search
* Service bus namespace
* Stream analytics
* Event hub namespace
* Logic apps
* Redis
* Data Lake Analytics
* Data Lake Store
* Key vault

To learn more about the supported features for the above list of PaaS resources, see [PaaS services supported features](security-center-services.md#paas-services).

Protection for Virtual Machines residing in Azure Stack is also supported. For more information about Security Center’s integration with Azure Stack, see [Onboard your Azure Stack virtual machines to Security Center](https://docs.microsoft.com/azure/security-center/quick-onboard-azure-stack).

## Next steps

- Learn how [Security Center collects data and the Log Analytics Agent](security-center-enable-data-collection.md).
- Learn how [Security Center manages and safeguards data](security-center-data-security.md).
- Learn how to [plan and understand the design considerations to adopt Azure Security Center](security-center-planning-and-operations-guide.md).
- Learn about [features available for the different cloud environments](security-center-services.md).
- Learn more about [threat detection for VMs & servers in Azure Security Center](security-center-alerts-iaas.md).
- Find [frequently asked questions about using Azure Security Center](security-center-faq.md).
- Find [blog posts about Azure security and compliance](https://blogs.msdn.com/b/azuresecurity/).
