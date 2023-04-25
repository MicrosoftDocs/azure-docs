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

Add a new User Assigned Managed Identity.

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks deployment.

1. From **Settings** in the Resource menu, select **Identity**.

1. To add a User Assigned identity, select **Add** in the working pane. You see a new pane for adding **User assigned managed identities** on the right that are part of the subscription. Select an identity. Then, select **Add**.

## Configure Rulestack

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks resource.

1. Select Rulestack in the Resource menu.

1. To upload an existing **Palo Alto config package**, type the appropriate `.conf file` in **File path** in the working pane and select the **+** button and for config package.

1. You see the contents of the file in the working pane. Select **Confirm** if correct.

1. To edit the config file within the Editor, select the pencil icon. When you're done editing, select **Submit**.

## Enable Log settings

You can add a certificate by uploading it to Azure Key vault, and then associating the certificate with your deployment.

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks resource.

1. Select **Palo Alto certificates** in **Settings** in the Resource menu.

1. Select **Add certificate**. You see an **Add certificate** in the working pane. Add the appropriate information

1. When you've added the needed information, select **Save**.

## Enable DNS Proxy

1. From the Resource menu, select your Cloud NGFW by Palo Alto Networks.

1. Select either **Enable** or **Disable**.

## Delete an Cloud NGFW by Palo Alto Networks

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
