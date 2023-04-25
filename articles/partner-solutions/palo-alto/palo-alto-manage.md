---
title: Manage Cloud NGFW by Palo Alto Networks resource through the Azure portal
description: This article describes management functions for Cloud NGFW by Palo Alto Networks on the Azure portal. 

ms.topic: conceptual
ms.date: 04/25/2023


---

# Manage your Cloud NGFW by Palo Alto Networks Preview through the portal

Once your Cloud NGFW by Palo Alto Networks Preview resource is created in the Azure portal, you might need to get information about it or change it. Here's list of ways to manage your Palo Alto resource.

- [Configure Networking and NAT](#configure-networking-NAT)
- [Configure Rulestack](#configure-the-Rulestack)
- [Enable Log settings](#enable-log-settings)
- [Enable DNS Proxy](#enable-dns-proxy)
- [Configure Rules](#configure-rules)
- [Delete an Palo Alto deployment](#delete-an-palo-alto-deployment)

## Configure Networking and NAT

Select the **Type** by checking the **Virtual Network** or **Virtual VWAN** options.

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks deployment.
1. Enter **Virtual Network** , **Private Subnet** and **Public Subnet** details.

 <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-SNAT.png" alt-text="Screenshot showing NEtworking section."::: -->

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity. Then, select **Add**.
1. From **Source Network Address Translation (SNAT)** select the **Enable Source NAT**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-identity.png" alt-text="Screenshot showing the Source NAT details."::: -->

1. From **Destination Network Address Translation (DNAT)** select the **Enable Source NAT**.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-dnat.png" alt-text="Screenshot showing the Destination NAT details."::: -->

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks resource.

1. Select Rulestack in the Resource menu.

1. To upload an existing **Palo Alto config package**, type the appropriate `.conf file` in **File path** in the working pane and select the **+** button and for config package.

## Rulestack

1. For the **Managed by** Select **Azure Portal** or **"Palo Alto Networks Panaroma** to determine the mechanism for managing Rulestack .

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-managedby.png" alt-text="Screenshot resources for Palo Alto Rulestack Management option."::: -->

1. For the **Local Rulestack** Select an existing Rulestack from the dropdown.

    <!-- :::image type="content" source="media/palo-alto-manage/palo-alto-localrulestacklist.png" alt-text="Screenshot resources for Palo Alto Rulestack list."::: -->

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

## Enable Log settings

## Log settings

Click on **edit** to enable **Log Settings**.

1. Check the **Enable Log Settings** checkbox.

1. Select **Log Setting** from the dropdown list.

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks resource.

1. Select **Palo Alto certificates** in **Settings** in the Resource menu.

1. Select **Add certificate**. You see an **Add certificate** in the working pane. Add the appropriate information

1. When you've added the needed information, select **Save**.

## Enable DNS Proxy

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks.

1. Select either **Enable** or **Disable**.

## Delete an Cloud NGFW by Palo Alto Networks
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

1. Confirm that you want to delete the Palo Alto resource.

1. Select **Delete**.

After the account is deleted, logs are no longer sent to Cloud NGFW by Palo Alto Networks, and all billing stops for Cloud NGFW by Palo Alto Networks through Azure Marketplace.

> [!NOTE]
> The delete button on the main account is only activated if all the sub-accounts mapped to the main account are already deleted. Refer to section for deleting sub-accounts here.

## Next steps

For help with troubleshooting, see [Troubleshooting Palo Alto integration with Azure](palo-alto-troubleshoot.md).
