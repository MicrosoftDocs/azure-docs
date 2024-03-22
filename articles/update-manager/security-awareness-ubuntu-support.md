---
title: Security awareness and Ubuntu Pro support in Azure Update Manager
description: Guidance on security awareness and Ubuntu Pro support in Azure Update Manager.
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: sudhirsneha
---

# Guidance on security awareness and Ubuntu Pro support

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.


This article provides the details on security vulnerabilities and Ubuntu Pro support in Azure Update Manager.

If you are using Ubuntu 18.04 LTS, you must take the necessary steps against security vulnerabilities as the Ubuntu 18.04 image has reached the end of its [standard security maintenance](https://ubuntu.com/blog/18-04-end-of-standard-support) in May 2023. As Canonical has stopped publishing new security or critical updates after May 2023, the risk of systems and data to potential security threats is high. Without software updates, you may experience performance issues or compatibility issues whenever a new hardware or software is released.

You can either upgrade to [Ubuntu Pro](https://ubuntu.com/azure/pro) or migrate to a newer version of LTS to avoid any future disruption to the patching mechanisms. When you [upgrade to Ubuntu Pro](https://ubuntu.com/blog/enhancing-the-ubuntu-experience-on-azure-introducing-ubuntu-pro-updates-awareness), you can avoid any security or performance issues. 


## Ubuntu Pro on Azure Update Manager
 
Azure Update Manager assesses both Azure and Arc-enabled VMs to indicate any action. AUM helps to identify Ubuntu instances that don't have the available security updates and allows an upgrade to Ubuntu Pro from the Azure portal. For example, an Ubuntu server 18.04 LTS instance on Azure Update Manager has information about upgrading to Ubuntu Pro.

:::image type="content" source="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-inline.png" alt-text="Screenshot of recommendation to subscribe to Ubuntu Pro in Azure Update Manager." lightbox="./media/security-awareness-ubuntu-support/ubuntu-pro-subscription-expanded.png":::

You can continue to use the Azure Update Manager [capabilities](updates-maintenance-schedules.md) to remain secure after migrating to a supported model from Canonical.

> [!NOTE]
> - [Ubuntu Pro](https://ubuntu.com/azure/pro) will provide the support on 18.04 LTS from Canonical until 2028 through Expanded Security Maintenance (ESM). You can also [upgrade to Ubuntu Pro from Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.0001-com-ubuntu-pro-bionic?tab=Overview) as well.
> - Ubuntu offers 20.04 LTS and 22.04 LTS as a migration from 18.04 LTS. [Learn more](https://ubuntu.com/18-04/azure).

 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [View updates for single machine](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
