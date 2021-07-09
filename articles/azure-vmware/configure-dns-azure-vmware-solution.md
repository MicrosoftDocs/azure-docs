---
title: Configure DNS for Azure VMware Solution
description: Learn how to configure DNS in either NSX-T Manager or the Azure portal. 
ms.topic: how-to
ms.custom: contperf-fy22q1
ms.date: 07/20/2021

# Customer intent: As an Azure service administrator, I want to configure 

---

# Configure a DNS forwarder in the Azure portal


<!-- 2. Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->

you'll configure a DNS forwarder where specific DNS requests get forwarded to a designated DNS server for resolution.  A DNS forwarder is associate with a **default DNS zone** and up to three **FQDN zones**.

When a DNS query is received, a DNS forwarder compares the domain name with the domain names in the FQDN DNS zone. The query gets forwarded to the DNS servers specified in the FQDN DNS zone if a match is found.  Otherwise, the query gets forwarded to the DNS servers specified in the default DNS zone. 

>[!NOTE]
>To send DNS queries to the upstream server, a default DNS zone must be defined before configuring an FQDN zone.

>[!TIP]
>You can also use the [NSX-T Manager console to configure a DNS forwarder](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/2.5/administration/GUID-A0172881-BB25-4992-A499-14F9BE3BE7F2.html).

## Prerequisites
Virtual machines (VMs) created or migrated to the Azure VMware Solution private cloud should be attached to a network segment.


1. In your Azure VMware Solution private cloud, under **Workload Networking**, select **DNS** > **DNS zones** > **Add**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-dns-zones.png" alt-text="Screenshot showing how to add DNS zones to an Azure VMware Solution private cloud.":::

1. Select **Default DNS zone** and provide a name and up to three DNS server IP addresses in the format of **8.8.8.8**. 

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-zones.png" alt-text="Screenshot showing the required information needed to add a default DNS zone.":::

1. Select **FQDN zone** and provide a name, the FQDN zone, and up to three DNS server IP addresses in the format of **8.8.8.8**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-fqdn-zone.png" alt-text="Screenshot showing the required information needed to add an FQDN zone.":::

1. Select **OK** to finish adding the default DNS zone and DNS service.

1. Select the **DNS service** tab, select **Add**. Provide the details and select **OK**.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-service.png" alt-text="Screenshot showing the information required for the DNS service.":::

   >[!TIP]
   >**Tier-1 Gateway** is selected by default and reflects the gateway created when deploying Azure VMware Solution.

   The DNS service was added successfully.

   :::image type="content" source="media/configure-nsx-network-components-azure-portal/nsxt-workload-networking-configure-dns-service-success.png" alt-text="Screenshot showing the DNS service added successfully.":::
