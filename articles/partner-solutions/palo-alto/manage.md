---
title: Manage a Cloud Next-Generation Firewall (NGFW) by Palo Alto Networks Resource by Using the Azure Portal
description: Manage your Cloud NGFW resource in the Azure portal, including networking, NAT, rulestack settings, logging, Domain Name System (DNS) proxy configuration, and billing plan changes.
ms.topic: how-to
ms.date: 06/26/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/09/2024
---

# Manage your Cloud NGFW by Palo Alto Networks resource by using the Azure portal

After you create your Cloud NGFW by Palo Alto Networks resource, you might need to get information about it or change it. You can manage your Cloud NGFW resource in the following ways:

- [Networking and NAT](#networking-and-nat)
- [Rulestack](#rulestack)
- [Log settings](#log-settings)
- [DNS Proxy](#dns-proxy)
- [Rules](#rules)
- [Delete a resource](#delete-a-resource)

## Resource overview 

[!INCLUDE [manage](../includes/manage.md)]

## Networking and NAT

1. Select **Networking & NAT** in the service menu.

1. Select the **Type** by checking the **Virtual Network** or **Virtual WAN** options.

1. You can see the  **Virtual Network**, **Private Subnet**, and **Public Subnet** details.

1. From **Source Network Address Translation (SNAT)**, you can select **Enable Source NAT**.

1. From **Destination Network Address Translation (DNAT)**, you can search in the table for the settings that you want.

## Rulestack

1. Select **Rulestack** in the service menu.

1. Under **Managed by**, select either **Azure Portal** or **Palo Alto Networks Panorama** to determine the mechanism for managing the rulestack. You must have Palo Alto Networks Panorama set up in order to select it.

1. In **Local Rulestack**, enter an existing rulestack.

## Log settings

1. Select **Log Settings** in the service menu.

1. Select **edit** to enable **Log Settings**.

1. Select the **Enable Log Settings** checkbox.

1. Select **Log Setting** in the list.

## DNS Proxy

1. Select **DNS Proxy** in the service menu.

1. Select either **Enable** or **Disable**.

1. Select **Save** to enable DNS Proxy.

## Rules

Search for  the Local rules under the **Search** option.

## Change plan

To change the Cloud NGFW's billing plan, go to **Overview** and select **Change Plan**.

## Delete a resource

[!INCLUDE [delete-resource](../includes/delete-resource.md)]

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## Next step

- For help with troubleshooting, see [Troubleshooting Palo Alto integration with Azure](troubleshoot.md).


