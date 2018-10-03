---
title: FQDN tags overview for Azure Firewall
description: Learn about the FQDN tags in Azure Firewall
services: firewall
author: vhorne
ms.service: firewall
ms.topic: article
ms.date: 9/24/2018
ms.author: victorh
---

# FQDN tags overview

A FQDN tag represents a group of fully qualified domain names (FQDNs) associated with well known Microsoft services. You can use a FQDN tag in application rules to allow the required outbound network traffic through your firewall.

For example, to manually allow Windows Update network traffic through your firewall, you need to create multiple application rules per the Microsoft documentation. Using FQDN tags, you can create an application rule, include the **Windows Updates** tag, and now network traffic to Microsoft Windows Update endpoints can flow through your firewall.

You can't create your own FQDN tags, nor can you specify which FQDNs are included within a tag. Microsoft manages the FQDNs encompassed by the FQDN tag, and updates the tag as FQDNs change. 

<!--- screenshot of application rule with a FQDN tag.-->

The following table shows the current FQDN tags you can use. Microsoft maintains these tags and you can expect additional tags to be added periodically.

|FQDN tag  |Description  |
|---------|---------|
|Windows Update     |Allow outbound access to Microsoft Update as described in [How to Configure a Firewall for Software Updates](https://technet.microsoft.com/library/bb693717.aspx).|
|Windows Diagnostics|Allow outbound access to all [Windows Diagnostics endpoints](https://docs.microsoft.com/windows/privacy/configure-windows-diagnostic-data-in-your-organization#endpoints).|
|Microsoft Active Protection Service (MAPS)|Allow outbound access to [MAPS](https://cloudblogs.microsoft.com/enterprisemobility/2016/05/31/important-changes-to-microsoft-active-protection-service-maps-endpoint/).|
|App Service Environment (ASE)|Allows outbound access to ASE platform traffic. This tag doesn’t cover customer-specific Storage and SQL endpoints created by ASE. These should be enabled via [Service Endpoints](../virtual-network/tutorial-restrict-network-access-to-resources.md) or added manually.|
|Azure Backup|Allows outbound access to the Azure Backup services.

> [!NOTE]
> When selecting FQDN Tag in an application rule, the protocol:port field must be set to **https**.

## Next steps

To learn how to deploy an Azure Firewall, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md).