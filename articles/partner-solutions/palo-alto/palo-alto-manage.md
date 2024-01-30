---
title: Manage Cloud NGFW by Palo Alto Networks resource through the Azure portal
description: This article describes management functions for Cloud NGFW (Next-Generation Firewall) by Palo Alto Networks on the Azure portal. 

ms.topic: conceptual
ms.date: 07/17/2023

---

# Manage your Cloud NGFW by Palo Alto Networks through the portal

Once your Cloud NGFW by Palo Alto Networks resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your Palo Alto resource.

- [Networking and NAT](#networking-and-nat)
- [Rulestack](#rulestack)
- [Log settings](#log-settings)
- [DNS Proxy](#dns-proxy)
- [Rules](#rules)
- [Delete a Cloud NGFW by Palo Alto Networks resource](#delete-a-cloud-ngfw-by-palo-alto-networks-resource)

From the Resource menu, select your Cloud NGFW by Palo Alto Networks deployment. Use the Resource menu to move through the settings for your Cloud NGFW by Palo Alto Networks.

:::image type="content" source="media/palo-alto-manage/palo-alto-overview-essentials.png" alt-text="Screenshot shows the Resource menu in a red box for a Palo Alto Networks resource.":::

## Networking and NAT

1. Select **Networking & NAT** in the Resource menu.

1. Select the **Type** by checking the **Virtual Network** or **Virtual WAN** options.

1. You can see the  **Virtual Network** , **Private Subnet** and **Public Subnet** details.

1. From **Source Network Address Translation (SNAT)**, you can select the **Enable Source NAT**.

1. From **Destination Network Address Translation (DNAT)**, you can search in the table for the settings that you want.

## Rulestack

1. Select **Rulestack** in the Resource menu.

1. For the **Managed by**, select either **Azure Portal** or **"Palo Alto Networks Panorama** to determine the mechanism for managing Rulestack. You must have Palo Alto Networks Panorama set up in order to select it.

1. For the **Local Rulestack**, select an existing Rulestack from the dropdown.

## Log settings

1. Select **Log Settings** in the Resource menu.

1. Select **edit** to enable **Log Settings**.

1. Select the **Enable Log Settings** checkbox.

1. Select **Log Setting** from the dropdown list.

## DNS Proxy

1. Select **DNS Proxy** in the Resource menu.

1. Select either **Enable** or **Disable**.

1. Select **Save** to enable DNS Proxy.

## Rules

Search for  the Local rules under the **Search** option.

## Delete a Cloud NGFW by Palo Alto Networks resource

To delete a Cloud NGFW by Palo Alto Networks resource

1. Select **Overview** in the Resource menu.

1. Select **Delete**.

1. Confirm that you want to delete the Cloud NGFW by Palo Alto Networks resource.

1. Select **Delete**.

After the account is deleted, logs are no longer sent to Cloud NGFW by Palo Alto Networks. Also, all billing stops for Cloud NGFW by Palo Alto Networks through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## Next steps

- For help with troubleshooting, see [Troubleshooting Palo Alto integration with Azure](palo-alto-troubleshoot.md).

- Get Started with Cloud Next-Generation Firewall by Palo Alto Networks - an Azure Native ISV Service on

  > [!div class="nextstepaction"]
  > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/PaloAltoNetworks.Cloudngfw%2Ffirewalls)

  > [!div class="nextstepaction"]
  > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/paloaltonetworks.pan_swfw_cloud_ngfw?tab=Overview)
