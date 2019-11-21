---
title: IP Groups in Azure Firewall 
description: IP groups allow you to group and manage IP addresses for Azure Firewall rules.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: victorh
---

# IP Groups (preview) in Azure Firewall

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

IP Groups allow you to group and manage IP addresses for Azure Firewall rules in the following ways:

- As a source address in DNAT rules
- As a source or destination address in network rules
- As a source address in application rules


An IP Group can have a single IP address, a group of IP addresses, or one or more IP address ranges.

## Create an IP Group

An IP Group can be created using the Azure portal . For more information, see [Create an IP Group (preview)](create-ip-group.md).

## Using an IP Group

When you create an Azure Firewall rule, you can now select **IP Group** as a **Source type** for the IP address.

-- screen shot --

## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).