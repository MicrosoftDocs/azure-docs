---
title: Peering service prefix requirements
description: Technical requirements to optimize your prefixes using Peering Service.
services: peering-service
author: jsaraco
ms.service: peering-service
ms.topic: conceptual
ms.date: 06/13/2023
ms.author: jsaraco
ms.custom: template-concept, engagement-fy23
---

# Peering service prefix requirements

Ensure the prerequisites in this document are met before you activate your prefixes for Peering Service.

## Technical requirements

For a registered prefix to be validated after creation, the following checks must pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* The peering service prefix key in the peering service prefix must match the prefix key received during registration
* The prefix must be announced from all primary and backup peering sessions
* Routes must be advertised with the MAPS community string 8075:8007
`* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending`

## Troubleshooting

The validation state of a peering service prefix can be seen in the Azure portal.

:::image type="content" source="media/peering-service-prefix-validation-failed.png" alt-text="Peering service prefixes failing validation" :::

Prefixes can only be activated when all validation steps have passed. Listed further in this document are possible validation errors, with troubleshooting steps to solve them.

### Provider has fewer than two sessions in its primary location

MAPS requires the primary peering location to have local redundancy. This is achieved by having two MAPS sessions configured on two different routers. If you're seeing this validation failure message, you have chosen a primary peering location that has fewer than two MAPS sessions. If provisioning is still in progress for your second MAPS connection, allow time for provisioning to complete. After that, the primary redundancy requirement will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Provider has no sessions in its backup location

MAPS requires the backup peering location, if you've chosen one, to have one MAPS session. If you're seeing this validation failure message, you have chosen a backup peering location that doesn't have a MAPS session. If provisioning is still in progress for your MAPS connection in the backup location, allow time for provisioning to complete. After that, the backup requirement will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Peering service prefix is invalid

If you're seeing this validation failure message, the prefix string that you've given isn't a valid IPv4 prefix. Delete and re-create this peering service prefix with a valid IPv4 address.

### Not receiving prefix advertisement from IP for prefix

MAPS requires the provider to advertise routes for their peering service prefix. If you're seeing this validation failure message, it means the provider isn't advertising routes for the prefix that's being validated. Refer to this document and review the [MAPS technical requirements](./walkthrough-peering-service-all.md#technical-requirements) regarding route advertisement. Contact your networking team and confirm that they're advertising routes for the prefix being validated. Also confirm the advertisement adheres to MAPS requirements, such as advertising using the MAPS community string 8075:8007, and that the AS path of the route doesn't contain private ASNs. Use the IP address in the message to identify the MAPS connection that isn't advertising the prefix. All MAPS connections must advertise routes.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, you're advertising routes for your prefix and you're still seeing this validation failure, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Received route for prefix should have the MAPS community 8075:8007

For MAPS, prefix routes must be advertised with the MAPS community string 8075:8007. This validation error message indicates that Microsoft is receiving routes, but they are not being advertised with the MAPS community string 8075:8007. Add the MAPS community string to the community when advertising routes for MAPS prefixes. After that, the community requirement for MAPS will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### AS path length for prefix should be <=3 for prefix

For MAPS, prefix routes can't exceed an AS path length of 3. This message indicates that Microsoft is receiving routes, but the AS path of the received routes is greater than 3. Advertise routes with a new AS path that doesn't exceed a path length of 3. The AS path length requirement for MAPS will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### AS path for prefix shouldn't have any private ASN

For MAPS, prefix routes can't be advertised with an AS path that contains private ASNs. This message indicates that Microsoft is receiving routes, but the AS path of the received routes contains a private ASN. Advertise routes with a new AS path that doesn't contain a private ASN. The private AS requirement for MAPS will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### Peering service provider not found

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Internal server error

If you're a Peering Service customer, contact your Peering Service provider about this issue. Contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

## Frequently asked questions (FAQ):

**Q.**   I am advertising a prefix from a different origin ASN than the ASN of the peering. Can this work with MAPS?

**A.**   To make this work with MAPS, you must create a peer ASN in the same subscription as the peering service resource, and give it the same name as the peer ASN associated with the peering: [[Associate peer ASN to Azure subscription using the Azure portal](./howto-subscription-association-portal.md)]. 

## Next steps

* [Azure Internet peering for Peering Service walkthrough](walkthrough-peering-service-all.md).
* [Azure Internet peering for Communications Services walkthrough](walkthrough-communications-services-partner.md)
* [Azure Internet peering for Exchage with Route Server walkthrough](walkthrough-exchange-route-server-partner.md)
* [Peering Service customer walkthrough](../peering-service/walkthrough-peering-service-customer.md)