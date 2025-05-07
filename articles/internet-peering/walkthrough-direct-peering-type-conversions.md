---
title: Request a direct peering type conversion
titleSuffix: Internet peering
description: Learn how to request a type conversion for a direct peering in Azure Peering Service.
author: halkazwini
ms.author: halkazwini 
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/23/2024
---

# Create a direct peering type conversion request

In this article, you learn how to use the Azure portal to request a type conversion for a direct peering in Azure Peering Service.

## Prerequisites

A direct peering type conversion for a peering connection can be requested only if the following prerequisites apply:

- The peering must have at least two connections.
- The redundant connections must be of equal bandwidth.
- All connections in the peering must be fully provisioned (with the property `ConnectionState` = `Active`). That is, none of the connections can be undergoing provisioning, decommission, or an internal device migration.
- The peering must be represented as an Azure resource with a valid subscription. To onboard your peering as a resource, see [Convert a legacy direct peering to an Azure resource by using the Azure portal](howto-legacy-direct-portal.md).
- Bandwidth updates can't be requested to other connections in the peering during the conversion.
- No adding or removing of connections can occur during the conversion.
- Type conversions run during the business hours of the Pacific time zone.
- For voice peering conversions, the connection session addresses are provided by Microsoft and enabled with Bidirectional Forwarding Detection (BFD). It's expected that the partners set up their configurations accordingly.

## Change the type of a direct peering

To convert a direct peering to a new type, complete the steps described in the following sections.

### Convert from PNI to voice interconnect

A peering with standard Private Network Interconnect (PNI) or PNI enabled for Azure Peering Service can be converted to voice PNI. This conversion must be made at the peering level, which means that all the connections within the peering are converted.

1. Go to the **Configuration** pane of your peering.

1. Select the **AS8075 (with Voice)** option, and then select **Save**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/conversion-selection.png" alt-text="Screenshot shows how to change Microsoft network in the Conversions pane of the peering in the Azure portal." lightbox="./media/walkthrough-direct-peering-type-conversions/conversion-selection.png":::

### Enable Peering Service on a connection

A standard PNI within a peering can be enabled for Peering Service. One standard PNI can be requested per connection.

You need to be a Peering Service partner to enable Peering Service on a connection. See the [partner requirements pane](prerequisites.md) and make sure you sign the agreement with Microsoft. For questions, contact the [Azure Peering group](mailto:peeringservice@microsoft.com).

1. Go to the **Connection** pane of your peering.

1. Select the ellipsis (`...`) next to the connection that you want to edit and select **Edit connection**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/view-connection.png" alt-text="Screenshot shows how to select a connection to edit in the Connections pane of a peering in the Azure portal." lightbox="./media/walkthrough-direct-peering-type-conversions/view-connection.png":::

1. On the **Direct Peering Connection** pane, for **Use for Peering Service**, select **Enabled**, and then select **Save**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/edit-connection.png" alt-text="Screenshot shows how to edit a connection." lightbox="./media/walkthrough-direct-peering-type-conversions/edit-connection.png":::

When the request is received, the connection state on each of the connections changes to **TypeChangeRequested**.

## Conversion approval

Your request is reviewed and approved by someone from the internal team.

Connections remain in the **TypeChangeRequested** state until they're approved. After approval, the connections convert one at a time to ensure that the redundant connections are always up and carrying traffic. The connection state changes to **TypeChangeInProgress**. This state is shown on the Connections pane.

## Monitor the conversion

When your connection enters the conversion process, its state is **TypeChangeInProgress**.

You're kept up to date through emails at the following changes in status for the connection:

- Request received
- Request approved
- Session address changes (if any)
- Conversion complete
- Peering Azure resource removal (if any)
- Request rejected
- Action required from peering partner

Email notifications are sent to the peer email contact that you provide during *peer autonomous system number (ASN)* resource creation. If you have questions, you can either reply to the emails or contact the [Azure Peering group](mailto:peeringservice@microsoft.com).

If a conversion to voice peering is requested and the connections already have IP addresses provided by Microsoft, set up BFD on your sessions as early as possible to avoid any downtime. The conversion process for voice peering waits for both the BGP and BFD sessions to be running before allowing any traffic on the sessions.

If a conversion to voice peering is requested and the connections have IP addresses provided by the peering partner, wait for the email notification that has the new Microsoft provided IP addresses. When you receive the email, configure the IP addresses and BFD on your end. When the BGP and BFD sessions with the new IP addresses are active, traffic is allowed on this session, and the session that uses the old IP addresses is shut down. In this scenario, no downtime occurs.

When the conversion is completed, its state returns to **Active**.

## FAQ

Get answers to frequently asked questions.

**Q.** Will there be an interruption to my connection?

**A.** We do our absolute best and take various steps to prevent any interruption to service. These steps include:

- Guaranteeing that a redundant connection with equivalent bandwidth is active at the time of conversion.
- Performing any conversions one connection at a time.
- Taking old connections offline only if it's necessary (in the case of a type conversion in which the IP address stays the same).
- Completing conversions only when engineers are online and capable of helping to resolve any unlikely issues.  

**Q.** Why was my request to convert the type of direct peering rejected?

**A.** Verify that the peering satisfies all the requirements that are listed in the [Prerequisites](#prerequisites) section.

**Q.** Why was my request to enable Peering Service on a connection rejected?

**A.** To enable Peering Service on a connection, see the [partner requirements](prerequisites.md). Ensure that you signed the agreement with Microsoft. For questions, contact the [Azure Peering group](mailto:peeringservice@microsoft.com). Verify that the peering satisfies all the requirements that are listed in the [Prerequisites](#prerequisites) section.

**Q.** How long does it take for the conversion to complete?

**A.** For conversions that don't involve any IP address changes, if the expected setup is done by the peering partner, the conversion can be completed within two business days. For conversions that involve IP addresses change, an extra delay might result from reserving new addresses internally. Also, considering a possible delay in the peering partner completing their end of the configuration, expect the process to take up to five business days.

**Q.** Is there an impact on traffic for the overall conversion?

**A.** The conversion process involves several stages. Not all the stages affect traffic. Tapering the traffic, configuring new policies for the type of peering, and allowing the traffic back when BGP and BFD are online happen serially. Combined these steps usually take approximately two hours if the peering partner completes their end of the configurations promptly.

For voice interconnect conversions, ensure that the BFD setup is done on time to ensure minimal downtime. For conversions that involve a change in IP addresses, there's almost zero downtime because the traffic is seamlessly shifted to the session that has the new addresses. Then, the session that has the old IP addresses is shut down.

**Q.** How do I know on which connection to configure the new Microsoft-provided IP addresses?

**A.** The email notification that we send to you lists the connection details, including both the old peer-provided IP addresses and the corresponding new Microsoft-provided IP addresses.

**Q.** Why is the connection state for my peering stuck at **TypeChangeInProgress** or **ProvisioningFailed**?

**A.** This state might be either due to a configuration error or internal error, or the process might be waiting for the peering partner side to complete configurations. We monitor and catch these issues promptly, and we send you an email notification. If you have more questions, contact the [Azure Peering group](mailto:peeringservice@microsoft.com).

**Q.** I have two different peerings, Peering A with standard PNI connections and peering B with voice connections. I would like to convert the standard PNI peering connections to voice. What happens to the peering resources in this case?

**A.** When Peering A is converted from PNI to voice, the connections for Peering A are moved to Peering B, and then Peering A is deleted. For example: If Peering A has two PNI connections and they're converted to voice, and Peering B already has two connections, the process results with Peering B (the voice peering) now having four connections, and the Peering A resource is removed. This result is by design so that we maintain only one peering for a given peering provider and type of direct peering at a given location.

**Q.** I have more questions. What is the best way to contact you?

**A.** Contact the [Azure Peering group](mailto:peeringservice@microsoft.com).
