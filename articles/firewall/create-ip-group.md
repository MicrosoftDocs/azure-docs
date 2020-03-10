---
title: Create IP Groups in Azure Firewall 
description: IP Groups allow you to group and manage IP addresses for Azure Firewall rules.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 02/18/2020
ms.author: victorh
---

# Create IP Groups (preview)

> [!IMPORTANT]
> This public preview is provided without a service level agreement and should not be used for production workloads. Certain features may not be supported, may have constrained capabilities, or may not be available in all Azure locations. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for details.

IP Groups allow you to group and manage IP addresses for Azure Firewall rules. They can have a single IP address, multiple IP addresses, or one or more IP address ranges.

## Create an IP Group

1. From the Azure portal home page, select **Create a resource**.
2. Type **IP Groups** in the search text box, then select **IP Groups**.
3. Select **Create**.
4. Select your subscription.
5. Select a resource group or create a new one.
6. Type a unique name for you IP Group, and then select a region.

6. Select **Next: IP addresses**.
7. Type an IP address, multiple IP addresses, or IP address ranges.

   There are two ways to enter IP addresses:
   - You can manually enter them
   - You can import them from a file

   To import from a file, select **Import from a file**. You may either drag your file to the box or select **Browse for files**. If necessary, you can review and edit your uploaded IP addresses.

   When you type an IP address, the portal validates it to check for overlapping, duplicates, and formatting issues.

5. When finished, select **Review + Create**.
6. Select **Create**.


## Next steps

- [Learn more about IP Groups](ip-groups.md)