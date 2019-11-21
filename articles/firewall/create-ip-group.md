---
title: Create IP Groups in Azure Firewall 
description: IP Groups allow you to group and manage IP addresses for Azure Firewall rules.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: victorh
---

# Create IP Groups (preview)

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

IP Groups allow you to group and manage IP addresses for Azure Firewall rules. They can have a single IP address, a group of IP addresses, or one or more IP address ranges.

## Create IP Groups

1. From the Azure portal home page, select **Create a resource**.
2. Type **IP Groups** in the search text box, then select **IP Groups**.
3. Select your subscription and your resource group.
4. Type a name for you IP Group, and then select a region.
5. Select **Next: IP addresses**.
3. When you add IP addresses, you have two main methods to enter them:
   - You can manually enter the IP addresses
   - You can bulk upload your IP addresses.

6. When entering your IP addresses, the portal validates them to check for overlapping, duplicates, and formatting issues.
4.	If necessary, you can review and edit your uploaded IP addresses.
5.	When finished, select **Review + Create**.


## Next steps

- [Learn more about IP Groups](ip-groups.md)