---
title: Remove the Basic SKU public IP Reference from a Basic SKU VPN gateway - Azure portal
description: Learn how to remove the Basic SKU public IP address resource reference from an existing Basic SKU VPN gateway using the Azure portal.
author: cherylmc
ms.author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/24/2026
---

# Remove the Basic SKU public IP address reference from a Basic SKU VPN gateway - Azure portal

Basic SKU public IP addresses are being retired in Azure. The steps in this article help you remove the Basic SKU public IP address resource reference from an existing Basic SKU VPN gateway. This change doesn't update the gateway's public IP address and doesn't interrupt connectivity.

These steps apply only to Basic SKU VPN gateways that have a Basic SKU public IP address resource reference. If your gateway doesn't have a Basic SKU public IP address reference, see [About migrating a Basic SKU public IP address to a Standard SKU public IP address](basic-public-ip-migrate-about.md) for information about public IP addresses and VPN Gateway.

> [!NOTE]
> * Your gateway's public IP address remains the same.
> * There's no network interruption when you make this change.

## Remove the Basic SKU public IP address reference

Use the following steps to remove the Basic SKU public IP address resource reference from a Basic SKU VPN gateway in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), go to your **Virtual network gateway** resource.
1. On the left menu, under **Settings**, select **Configuration**.
1. On the Configuration page, verify that in the Validation section, all of the resources are showing as **Succeeded**.

   :::image type="content" source="media/basic-sku-public-ip-remove/delete-reference.png" alt-text="Screenshot that shows the Configuration page with the Delete Basic public iP Reference option.":::

1. If the resources are showing as **Succeeded**, you can delete the Basic SKU public IP reference. Select **Delete Basic Public Ip Reference**.

## FAQ

###  What does “Delete Basic Public IP Reference” actually do?

This action removes the association between your Basic SKU public IP address resource and the Basic SKU VPN gateway. It's not a migration operation. The public IP address itself is already moved internally by Azure to a Standard SKU public IP address resource used by the VPN gateway.

### Does this operation migrate my VPN gateway or change its SKU?

No. This operation doesn't change the VPN Gateway SKU and doesn't migrate the gateway. It only removes the reference to the Basic SKU public IP address resource from the gateway configuration.

### What happens to my public IP address after I run this?

The IP address value itself doesn't change and continues to be used by the VPN gateway. However, after removing the reference:

- The customer-visible Basic SKU public IP address resource is no longer linked to the gateway.
- The IP address is now associated with an internal Standard SKU public IP address resource that isn't visible in your subscription.
  
### Why does the public IP show as Basic or appear as empty / null in the Azure portal?

This is a known portal/UI issue. The VPN gateway is using a Standard SKU public IP address internally, but the portal might still display:

- The old Basic SKU public IP address resource name
- A null or non-hyperlinked IP value

This is a cosmetic issue only and doesn't impact gateway functionality. In the meantime, use the JSON properties to view your IP.

### Will my VPN gateway continue to work after I remove the reference?

Yes. There's no functional impact to the VPN gateway from removing the Basic SKU public IP address reference. Existing connectivity (S2S / P2S) continues to work.

### Do I need to delete the old Basic SKU public IP address resource?

After the reference is removed, the Basic SKU public IP address resource remains in your subscription. We recommend you delete it. Azure doesn't delete customer-owned resources automatically.

### Should I upgrade the Basic SKU public IP address resource to Standard myself?

No. You shouldn't attempt to upgrade the old Basic public IP resource after removing the reference. Attempts to manually upgrade that resource have caused it to enter a Failed provisioning state.

### What happens if I don’t delete the Basic SKU public IP address reference on my VPN gateway by June 30?

If you don’t take action, your VPN gateway will continue running in an unsupported state.

- The VPN Gateway Basic SKU doesn't include SLA guarantees and isn't intended for production use.
- Microsoft won't automatically modify or clean up resources in your subscription.
- Your gateway might continue to function, but reliability, availability, and support aren't guaranteed.
	
### Will Microsoft take action on my behalf if I don’t do anything beyond June 30?

No.

- Microsoft doesn't automatically delete or clean up the Basic SKU public IP address reference for customers.
- Customers are expected to take action themselves to move out of the unsupported configuration.
	
### Is my VPN gateway considered production-ready if I don’t delete the reference?

No.

- The VPN Gateway Basic SKU is a developer SKU.
- Continuing without deleting the Basic IP reference means you're explicitly accepting an unsupported configuration with no SLA.
	
### Why don’t I have access to the Standard SKU public IP address resource Azure created?

The Standard SKU public IP address that's used by the VPN gateway after this process is an internal Azure-managed resource. It isn't customer-visible or customer-manageable.

### Will there be any billing changes after I remove the Basic public IP reference from my VPN gateway?

No. Dis-associating the Basic public IP reference from your VPN gateway doesn't introduce any new charges and doesn't result in additional billing. At this point, the Basic public IP is no longer needed. Our recommendation is that you delete it. Once you delete it, billing for that Basic public IP resource stops. After this cleanup:

- Your VPN gateway continues to use an internally managed Standard SKU public IP address provided by Azure.
- This internal Standard SKU public IP address isn't customer-visible and isn't billed separately.
- You aren't charged for the internal IP replacement as part of this process.
 
### Why did Microsoft perform an internal migration from Basic SKU public IP to Standard SKU public IP for the Basic SKU VPN gateway, but not for VPN Gateway SKUs 1–5?

Microsoft internally migrated Basic SKU VPN gateways off of **Basic SKU public IPs**. The Basic SKU VPN gateway is a developer offering with no SLA guarantees and no change in gateway SKU or availability model, resulting in a much more rigid design and feature set. For **VPN Gateway SKUs 1–5**, these SKUs offer an SLA guarantee, allow migration between SKUs, and other enterprise features that require a Standard SKU public IP address in the customer subscription.

## Next steps

[Learn about VPN Gateway settings](vpn-gateway-about-vpn-gateway-settings.md)
