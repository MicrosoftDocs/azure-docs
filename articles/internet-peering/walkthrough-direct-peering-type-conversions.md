---
title: Direct peering type conversion request walkthrough
titleSuffix: Internet peering
description: Learn how to request a type conversion for a Direct Peering.
author: halkazwini
ms.author: halkazwini 
ms.service: internet-peering
ms.topic: how-to
ms.date: 08/11/2023
---

# Direct peering type conversion request walkthrough

In this article, you learn how to use the Azure portal to request a type conversion on a direct peering.

## Prerequisites

A direct peering type conversion for a peering connection can only be requested if the following prerequisites apply:
-  The peering must have at least two connections.
-  The redundant connections must be of equal bandwidth 
-  All connections in the peering must be fully provisioned (with the property 'ConnectionState' = 'Active') that is, none of the connections must be undergoing provisioning, decommission, or an internal device migration.
-  The peering must be represented as an Azure resource with a valid subscription. To onboard your peering as a resource, see [Convert a legacy Direct peering to an Azure resource using the Azure portal](howto-legacy-direct-portal.md).
-  Bandwidth updates can't be requested to other connections in the peering during the conversion.
-  No adding or removing of connections can occur during the conversion.
-  Type conversions run during the business hours of the Pacific Time zone.
-  For Voice conversions, the connection session addresses are provided by Microsoft and enabled with BFD (Bidirectional Forwarding Detection). It's expected that the partners set up their configurations accordingly.

## Configure the new type on a Direct Peering

### Convert from PNI to Voice
A peering with standard PNI(s) or PNI(s) enabled for Azure Peering Service can be converted to Voice PNI(s). This conversion must be made at the peering level, which means all the connections within the peering are converted.

1. Go to the **Configuration** page of your peering.

1. Select the **AS8075 (with Voice)** option and then select **Save**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/conversion-selection.png" alt-text="Screenshot shows how to change Microsoft network in the Conversions page of the peering in the Azure portal." lightbox="./media/walkthrough-direct-peering-type-conversions/conversion-selection.png":::

### Enable Peering Service on a connection

A standard PNI within a peering can be enabled for Peering Service and can be requested per connection.

You need to be a Peering Service partner to enable Peering Service on a connection. See the [partner requirements page](prerequisites.md) and make sure you have signed the agreement with Microsoft. For questions, reach out to [Azure Peering group](mailto:peeringservice@microsoft.com).

1. Go to the **Connection** page of your peering.

1. Select the ellipsis (...) next to the connection that you want to edit and select **Edit connection**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/view-connection.png" alt-text="Screenshot shows how to select a connection to edit in the Connections page of a peering in the Azure portal." lightbox="./media/walkthrough-direct-peering-type-conversions/view-connection.png":::

1. In the **Direct Peering Connection** page, select **Enabled** for **Use for Peering Service**, and then select **Save**.

    :::image type="content" source="./media/walkthrough-direct-peering-type-conversions/edit-connection.png" alt-text="Screenshot shows how to edit a connection." lightbox="./media/walkthrough-direct-peering-type-conversions/edit-connection.png":::

Once the request is received, the **Connection State** on each of the connections changes to **TypeChangeRequested**.

## Conversion approval

Your request is reviewed and approved by someone from the internal team.

Connections remain in the **TypeChangeRequested** state until they're approved. After approval, the connections converted one at a time to ensure that the redundant connection(s) are always up and carrying traffic. The **Connection State** on the connection(s) changes to **TypeChangeInProgress**.
You can see this state in the Connection page.

## Monitor the conversion

When your connection enters the conversion process, its state is labeled as **TypeChangeInProgress**.

You're kept up to date through emails at the following steps:

-  Request Received
-  Request Approved
-  Session Address Changes (if any)
-  Conversion complete
-  Peering Azure Resource removal (if any)
-  Request rejected
-  Action required from peering partner

The email notifications are sent to the peer email contact provided during the *Peer Asn* resource creation. You can either reply back to the emails or contact [Azure Peering group](mailto:peeringservice@microsoft.com) if you have questions.

If a conversion to Voice is requested and the connections already have IP addresses provided by Microsoft, set up BFD on your sessions as early as possible to avoid any downtime. The conversion process for Voice waits for both the BGP and BFD sessions to come up before allowing any traffic on the sessions.

If a conversion to Voice is requested and the connections have IP addresses provided by the peering partner, wait for the email notification with the new Microsoft provided IP addresses and configure them on your end along with BFD. Once the BGP and BFD sessions with the new IP addresses come up, traffic is allowed on this session and the session with the old IP addresses will be shut down. There's no downtime in this case.

Once the conversion is completed its state returns to **Active**.

## FAQ

**Q.** Will there be an interruption to my connection?

**A.** We do our absolute best and take various steps to prevent any interruption to service. These steps include:
-  Guaranteeing that a redundant connection with equivalent bandwidth is up at the time of conversion.
-  Performing any conversions one connection at a time.
-  Only bringing down old connections if it's necessary (in the case of a type conversion while the IP address stays the same).
-  Only performing conversions at times where engineers are online and capable of helping remedy any unlikely issues.  

**Q.** Why has my request to convert the type of direct peering been rejected?

**A.** Verify if the peering satisfies all the requirements from the [Prerequisites](#prerequisites) section.

**Q.** Why has my request to enable Peering Service on a connection been rejected? 

**A.** To enable Peering Service on a connection, see [partner requirements page](prerequisites.md) and make sure you have signed the agreement with Microsoft. For questions, reach out to the [Azure Peering group](mailto:peeringservice@microsoft.com). Verify if the peering satisfies all the requirements from the [Prerequisites](#prerequisites) section.

**Q.** How long does it take for the conversion to complete?

**A.** For conversions that don't involve any IP address changes, if the expected setup is done by the peering partner, the conversion should be completed within two business days. For conversions involving IP addresses change, there's an extra delay in reserving new addresses internally and considering the delay in peering partner finishing their end of the configuration, expect the process to take up to five business days.

**Q.** Is there an impact on traffic for the whole-time conversion happens?

**A.** Conversion process involves several stages and not all stages have traffic impact. Draining the traffic, configuring new policies pertaining to the type of peering, and allowing the traffic back once BGP and BFD come up are done serially. Combined these steps usually take ~2 hrs given the peering partner complete their end of the configurations. For Voice conversions, ensure that the BFD setup is done on time to ensure minimal downtime. For conversions that involve a change in IP addresses, there's almost zero downtime, since the traffic is seamlessly shifted to the session with the new addresses from the old session after which the old session is shut down.

**Q.** How do I know which connection to configure the new Microsoft provided IP addresses?

**A.** The email notification lists the connection details with both the old peer provided IP addresses and the corresponding new Microsoft provided IP addresses.

**Q.** Why is my peering stuck with ConnectionState as 'TypeChangeInProgress' or 'ProvisioningFailed' for a long time?

**A.** This state could be either due to a configuration or an internal error or the process could be waiting for the peering partner side of configurations. We monitor and catch these issues and give you an email notification promptly. If you have further questions, contact the [Azure Peering group](mailto:peeringservice@microsoft.com) for resolution.

**Q.** I have two different peerings, Peering A with standard PNI(s) connections and peering B with Voice connections. I would like to convert the standard PNI peering connections to Voice. What happens to the peering resources in this case?

**A.** Once Peering A is converted from PNIs to Voice, the connections from Peering A are moved to Peering B, and Peering A is deleted. For example: If Peering A with two PNI connections are converted to Voice, and Peering B already has two connections, the process results in Peering B (the Voice peering) having four connections now and the Peering A resource will be removed. This is by design so that we maintain only one peering for a given peering provider and type of direct peering at a given location.

**Q.** I have more questions, what is the best way to contact you?

**A.** Contact the [Azure Peering group](mailto:peeringservice@microsoft.com).
