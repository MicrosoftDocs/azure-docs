---
title: Walkthrough Request Direct Peering Type Conversion
description: How to request a type conversion for a Direct Peering
services: internet-peering
author: hugobaldner
ms.service: internet-peering
ms.topic: how-to
ms.date: 07/30/2023
ms.author: hugobaldner 
ms.custom: template-how-to, engagement-fy23
---

# Direct Peering Type Conversion Request Walkthrough

In this article, you learn how to use the Azure portal to request a type conversion on a direct peering


## Before you begin

A direct peering type conversion for a peering connection can only be requested if the following prerequisites apply:
-  The peering must have at least two connections.
-  The redundant connections must be of equal bandwidth 
-  All connections in the peering must be fully provisioned (with the property 'ConnectionState' = Active) that is, none of the connections must be undergoing provisioning or decommission or an internal device migration.
-  The peering must be represented as an Azure resource with a valid subscription. To onboard your peering as a resource, refer to: [Convert a legacy Direct peering to an Azure resource using the Azure portal](howto-legacy-direct-portal.md)
-  Bandwidth updates can't be requested to other connections in the peering during the conversion
-  No adding or removing of connections can occur during the conversion
-  The type conversion will run during the business hours of Pacific Daylight Time.
-  For Voice conversions, the connection session addresses will be provided by Microsoft and enabled with BFD (Bidirectional Forwarding Detection). It is expected that the partners set up their configurations accordingly.

## 1. Configure the new Type on a Direct Peering
### Converting from PNI to Voice
A peering with standard PNI(s) or PNI(s) enabled for MAPS can be converted to Voice PNI(s); this request must be made at the peering level, which means all the connections within the peering are converted.

Go to the "Configuration" Page under the Settings section of your Peering's Page

Select the "AS8075 (with Voice) option and click Save
:::image type="content" source="./media/walkthrough-type-conversion/conversionselection.png" alt-text="Screenshot shows how to select within the Conversions tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/conversionselection.png":::

### Enabling Peering Service on a Connection
A standard PNI within a peering can be enabled for Peering Service and can be requested per connection.

You need to be a Peering Service partner to be able to do this. Please see the [partner requirements page](prerequisites.md) and make sure you have signed the agreement with Microsoft. For questions, reach out to peeringservice@microsoft.com.

Navigate to the Connection tab under settings and click edit on a connection.
:::image type="content" source="./media/walkthrough-type-conversion/viewconnection.png" alt-text="Screenshot shows how to select within the Connections tab in the Azure portal." lightbox="./media/walkthrough-type-conversion/viewconnection.png":::

Then edit the "Use for Peering Service" section to enabled and click Save.
:::image type="content" source="./media/walkthrough-type-conversion/editconnection.png" alt-text="Screenshot shows how to edit a connection." lightbox="./media/walkthrough-type-conversion/editconnection.png":::

Once the request is received, the 'Connection State' on each of the connections change to 'TypeChangeRequested'.

## 2. Conversion approval
Your request is reviewed and approved by someone from the internal team.

Connections go through the TypeChangeRequested state until the type change is approved. 

After approval, the connections will be converted one at a time to ensure that the redundant connection(s) are always up and carrying traffic.

Now, the 'Connection State' on the connection(s) change to 'TypeChangeInProgress'.
You can see this state in the Connection tab in the same location where you selected to edit the connection.

## 3. Monitoring the conversion
While your connection is undergoing conversion its state will be labeled as TypeChangeInProgress.

You are kept up to date through emails at the following steps:
-  Request Received
-  Request Approved
-  Session Address Changes (if any)
-  Conversion complete
-  Peering Azure Resource removal (if any)

In the case of a request rejection or any action needed by you from our team you'll also receive an email

The peer email contact provided during the 'Peer Asn' resource creation will also receive a notification for each of the above steps. If there are any questions, contact peering@microsoft.com

If a conversion to Voice is requested and the connections already have IP addresses provided by Microsoft, please set up BFD on your sessions as early as possible to avoid any downtime. The conversion process for Voice waits for both the BGP and BFD sessions to come up before allowing any traffic on the sessions.

If a conversion to Voice is requested and the connections have IP addresses provided by the peering partner, wait for the email notification with the new Microsoft provided IPs addresses and configure them on your end along with BFD. Once the BGP and BFD sessions with the new IP addresses come up, traffic will be allowed on this session and the session with the old IP addresses will be shut down. There is no downtime in this case.

Once the connection is completed its state returns to Active.

## FAQ

**Q.** Will there be an interruption to my connection?

**A.** We do our absolute best and take various steps to prevent any interruption to service. These steps include:
-  Guaranteeing a redundant connection with equivalent bandwidth is up at the time of conversion.
-  Performing any conversions one connection at a time.
-  Only bringing down old connections if:
    -  it's necessary (for example in the case of an IP Address change).
    -  the new connection has been established.
    -  the traffic has completely drained and moved to the redundant connection.
-  Only performing conversions at times where engineers are online and capable of helping remedy any unlikely issues.  

**Q.** Why has my request to convert the type of direct peering been rejected?

**A.** Verify if the peering satisfies all the requirements from the [“Before you begin” section](#before-you-begin)

**Q.** Why has my request to enable peering service on a connection been rejected? 

**A.** For enabling peering service on a connection, refer to the [partner requirements page](prerequisites.md) and make sure you have signed the agreement with Microsoft. For questions, reach out to peeringservice@microsoft.com. Also, verify if the peering satisfies all the requirements from the [“Before you begin” section](#before-you-begin).

**Q.** How long does it take for the conversion to complete?

**A.** For conversions that do not involve any IP address changes, if the expected setup is done by the peering partner, the conversion should be completed in ~two business days. For conversions involving IP addresses change, there is an extra delay in reserving new addresses internally and considering the delay in peering partner finishing their end of the configuration, expect the process to take ~five business days.

**Q.** Is there an impact on traffic for the whole-time conversion happens?

**A.** Conversion process involves several stages and not all stages have traffic impact. Draining the traffic, configuring new policies pertaining to the type of peering, and allowing the traffic back once BGP and BFD come up are done serially. Combined these steps usually take ~2 hrs given the peering partner complete their end of the configurations. For Voice conversions, ensure that the BFD setup is done on time to ensure minimal downtime. For conversions that involve a change in IP addresses, there is almost zero downtime, since the traffic is seamlessly shifted to the session with the new addresses from the old session after which the old session is shut down.

**Q.** How do I know which connection to configure the new Microsoft provided IP addresses?

**A.** The email notification lists the connection details with both the old peer provided IP addresses and the corresponding new Microsoft provided IP addresses.

**Q.** Why is my peering stuck with ConnectionState as “TypeChangeInProgress” or “ProvisioningFailed” for a long time?

**A.** This state could be either due to a configuration or an internal error or the process could be waiting for the peering partner side of configurations. We monitor and catch these issues and give you an email notification promptly. If you have further questions, contact peeringservice@microsoft.com for resolution.

**Q.** I have two different peerings, Peering A with standard PNI(s) connections and peering B with Voice connections. I would like to convert the standard PNI peering connections to Voice. What happens to the peering resources in this case?

**A.** Once Peering A is converted from PNIs to Voice, the connections from Peering A are moved to Peering B, and Peering A is deleted. For example: If Peering A with two PNI connections are converted to Voice, and Peering B already has two connections, the process will result in Peering B (the Voice peering) having four connections now and the Peering A resource will be removed. This is by design so that a resource provider maintains only one peering for a given provider and type of direct peering at a given location.

**Q.** I have more questions what is a good place to contact you at?

**A.** The best contact email is: [Microsoft Azure Peering](mailto:peeringservice@microsoft.com).
