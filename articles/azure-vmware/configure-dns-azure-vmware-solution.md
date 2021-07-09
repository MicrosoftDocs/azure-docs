---
title: Configure DNS forwarder for Azure VMware Solution
description: Learn how to configure DNS forwarder for Azure VMware Solution using the Azure portal. 
ms.topic: how-to
ms.custom: contperf-fy22q1
ms.date: 07/20/2021

#Customer intent: As an Azure service administrator, I want to <define conditional forwarding rules for a desired domain name to a desired set of private DNS servers via the NSX-T DNS Service.> and <why?>  

---

# Configure a DNS forwarder in the Azure portal

By default, Azure VMware Solution management components such as vCenter can only resolve name records available via Public DNS. Certain hybrid use cases require Azure VMware Solution management components to resolve name records from privately hosted DNS to properly function, including customer-managed systems such as vCenter and Active Directory. 

Private DNS for Azure VMware Solution management components provides the capability for an Azure VMware Solution administrator to define conditional forwarding rules for a desired domain name to a desired set of private DNS servers via the NSX-T DNS Service.



---


you'll configure a DNS forwarder where specific DNS requests get forwarded to a designated DNS server for resolution.  A DNS forwarder is associate with a **default DNS zone** and up to three **FQDN zones**.

When a DNS query is received, a DNS forwarder compares the domain name with the domain names in the FQDN DNS zone. The query gets forwarded to the DNS servers specified in the FQDN DNS zone if a match is found.  Otherwise, the query gets forwarded to the DNS servers specified in the default DNS zone. 

## Prerequisites
Virtual machines (VMs) created or migrated to the Azure VMware Solution private cloud should be attached to a network segment.


## Configure DNS forwarder



1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DNS** > **DNS zones** > **Add**.

   >[!NOTE]
   >The default DNS zone is created for you during the private cloud creation.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-dns-zones.png" alt-text="Screenshot showing how to add DNS zones to an Azure VMware Solution private cloud.":::

1. Select **FQDN zone** and provide a name, the FQDN zone, and up to three DNS server IP addresses in the format of **8.8.8.8**. Then select **OK**.

   It takes several minutes to complete and you can follow the progress from **Notifications**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-fqdn-zone.png" alt-text="Screenshot showing the required information needed to add an FQDN zone.":::

   >[!IMPORTANT]
   >While NSX-T allows spaces and other non-alphanumeric characters in a DNS zone name, certain NSX resources such as a DNS Zone are mapped to an Azure resource whose names don’t permit certain characters. 
   >
   >As a result, DNS zone names that would otherwise be valid in NSX-T may need adjustment to adhere to the [Azure resource naming conventions](../azure-resource-manager/management/resource-name-rules.md#microsoftresources).

   You’ll see a message in the Notifications when the DNS zone has been created.

1. Ignore the message about a default DNS zone. One is created for you as part of your private cloud

1. Select the **DNS service** tab, select **Edit**.

   >[!IMPORTANT]
   >While certain operations in your private cloud may be performed from NSX-T Manager, you must edit the DNS service from the Simplified Networking experience in the Azure portal. 

   [new image]

1. From the FQDN zones drop-down, select the newly created FQDN and then select OK.

   It takes several minutes to complete and once finished you’ll see the Completed message from Notifications.

   [new image]

   At this point, management coponents in your private cloud should be able to resolve DNS entries from the FQND zone provided to the NSX-T DNS Service. 

1. Repeat the above steps for additional FQDN zones, including any applicable reverse lookup zones.


## Verify name resolution operations

After you’ve configured the DNS forwarder, you’ll have a few options available to verify name resolution operations. 

### NSX-T Manager


### PowerCLI
