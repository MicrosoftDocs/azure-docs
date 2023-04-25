---
title: Manage an Palo Alto resource through the Azure portal
description: This article describes management functions for Palo Alto on the Azure portal. 

ms.topic: conceptual
ms.date: 01/18/2023


---

# Manage your Palo Alto integration through the portal

Once your Palo Alto resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your Palo Alto resource.

- [Configure Networking and NAT](#configure-networking-NAT)
- [Configure Rulestack](#configure-the-Rulestack)
- [Enable Log settings](#enable-log-settings)
- [Enable DNS Proxy](#enable-dns-proxy)
- [Configure Rules](#configure-rules)
- [Delete an Palo Alto deployment](#delete-an-palo-alto-deployment)


## Configure Networking and NAT

Select the **Type** by checking the **Virtual Network** or **Virtual VWAN** options.

1. Enter **Virtual Network** , **Private Subnet** and **Public Subnet** details.

 <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-SNAT.png" alt-text="Screenshot showing NEtworking section."::: -->

1. From **Source Network Address Translation (SNAT)** select the **Enable Source NAT**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-identity.png" alt-text="Screenshot showing the Source NAT details."::: -->

1. From **Destination Network Address Translation (DNAT)** select the **Enable Source NAT**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-dnat.png" alt-text="Screenshot showing the Destination NAT details."::: -->


## Rulestack

1. For the **Managed by** Select **Azure Portal** or **"Palo Alto Networks Panaroma** to determine the mechanism for managing Rulestack .

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-managedby.png" alt-text="Screenshot resources for Palo Alto Rulestack Management option."::: -->

1. For the **Local Rulestack** Select an existing Rulestack from the dropdown.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-localrulestacklist.png" alt-text="Screenshot resources for Palo Alto Rulestack list."::: -->


## Log settings

Click on **edit** to enable **Log Settings**.

1. Check the **Enable Log Settings** checkbox.

1. Select **Log Setting** from the dropdown list.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-logsettings.png" alt-text="Screenshot of Palo Alto Log Settings List."::: -->


## Enable DNS Proxy


1. Select **Disabled** or **Enabled** checkbox under the **DNS Proxy** .

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-dnsproxy.png" alt-text="Screenshot of Palo Alto DNS Proxy setting ."::: -->

1. Select **Save** to enable DNS Proxy.

    

## Rules


1. Search for  the Local rules under the **Search** option.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-localruleslist.png" alt-text="Screenshot of Palo Alto Local rules list."::: -->


## Delete an Palo Alto deployment

To delete a deployment of Palo Alto:

1. From the Resource menu, select your Palo Alto deployment.

1. Select **Overview** in the Resource menu.

1. Select **Delete**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-delete-deployment.png" alt-text="Screenshot showing how to delete an Palo Alto resource."::: -->

1. Confirm that you want to delete the Palo Alto resource.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-confirm-delete.png" alt-text="Screenshot showing the final confirmation of delete for Palo Alto resource."::: -->

1. Select **Delete**.

After the account is deleted, logs are no longer sent to Palo Alto, and all billing stops for Palo Alto through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.


## Next steps

For help with troubleshooting, see [Troubleshooting Palo Alto integration with Azure](palo-alto-troubleshoot.md).
