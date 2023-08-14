---
title: Azure Peering Service prefix requirements
description: Learn the technical requirements to optimize your prefixes using Azure Peering Service.
author: halkazwini
ms.author: halkazwini
ms.service: peering-service
ms.topic: concept-article
ms.date: 07/23/2023
---

# Azure Peering Service prefix requirements

Ensure the prerequisites in this document are met before you activate your prefixes for Peering Service.

## Technical requirements

For a registered prefix to be validated after creation, the following checks must pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* The peering service prefix key in the peering service prefix must match the prefix key received during registration
* The prefix must be announced from all primary and backup peering sessions
* Routes must be advertised with the Peering Service community string 8075:8007
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending

## Troubleshooting

The validation state of a Peering Service prefix can be seen in the Azure portal.

:::image type="content" source="./media/peering-service-prefix-requirements/prefix-validation-failed.png" alt-text="Screenshot of Peering Service prefixes with failed validation state.":::

Prefixes can only be activated when all validation steps have passed. See the following possible validation errors and the troubleshooting steps to solve them.

### Provider has fewer than two sessions in its primary location

Peering Service requires the primary peering location to have local redundancy. This requirement is achieved by having two Peering Service sessions configured on two different routers. If you're seeing this validation failure message, you have chosen a primary peering location that has fewer than two Peering Service sessions. If provisioning is still in progress for your second Peering Service connection, allow time for provisioning to complete. After that, the primary redundancy requirement will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Provider has no sessions in its backup location

Peering Service requires the backup peering location, if you've chosen one, to have one Peering Service session. If you're seeing this validation failure message, you have chosen a backup peering location that doesn't have a Peering Service session. If provisioning is still in progress for your Peering Service connection in the backup location, allow time for provisioning to complete. After that, the backup requirement will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Peering service prefix is invalid

If you're seeing this validation failure message, the prefix string that you've given isn't a valid IPv4 prefix. Delete and re-create this peering service prefix with a valid IPv4 address.

### Not receiving prefix advertisement from IP for prefix

Peering Service requires the provider to advertise routes for their peering service prefix. If you're seeing this validation failure message, it means the provider isn't advertising routes for the prefix that's being validated. Refer to this document and review the [Peering Service technical requirements](../internet-peering/walkthrough-peering-service-all.md#technical-requirements) regarding route advertisement. Contact your networking team and confirm that they're advertising routes for the prefix being validated. Also confirm the advertisement adheres to Peering Service requirements, such as advertising using the Peering Service community string 8075:8007, and that the AS path of the route doesn't contain private ASNs. Use the IP address in the message to identify the Peering Service connection that isn't advertising the prefix. All Peering Service connections must advertise routes.

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, you're advertising routes for your prefix and you're still seeing this validation failure, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Received route for prefix should have the Peering Service community 8075:8007

For Peering Service, prefix routes must be advertised with the Peering Service community string 8075:8007. This validation error message indicates that Microsoft is receiving routes, but they aren't being advertised with the Peering Service community string 8075:8007. Add the Peering Service community string to the community when advertising routes for Peering Service prefixes. After that, the community requirement for Peering Service will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### AS path length for prefix should be <=3 for prefix

For Peering Service, prefix routes can't exceed an AS path length of 3. This message indicates that Microsoft is receiving routes, but the AS path of the received routes is greater than 3. Advertise routes with a new AS path that doesn't exceed a path length of 3. The AS path length requirement for Peering Service will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### AS path for prefix shouldn't have any private ASN

For Peering Service, prefix routes can't be advertised with an AS path that contains private ASNs. This message indicates that Microsoft is receiving routes, but the AS path of the received routes contains a private ASN. Advertise routes with a new AS path that doesn't contain a private ASN. The private AS requirement for Peering Service will be satisfied and validation will continue.

If you're a Peering Service customer, contact your Peering Service provider about this issue.

### Peering service provider not found

If you're a Peering Service customer, contact your Peering Service provider about this issue. If you're a Peering Service partner, contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

### Internal server error

If you're a Peering Service customer, contact your Peering Service provider about this issue. Contact peeringservice@microsoft.com with your Azure subscription and prefix so we can assist you.

## Frequently asked questions (FAQ):

**Q.**   I'm advertising a prefix from a different origin ASN than the ASN of my peering. Can this work with Peering Service?

**A.**   To make this work with Peering Service, you must create a peer ASN in the same subscription as the peering service resource, and give it the same name as the peer ASN associated with the peering: [[Associate peer ASN to Azure subscription using the Azure portal](../internet-peering/howto-subscription-association-portal.md)]. 

## Next steps

[Peering Service customer walkthrough](customer-walkthrough.md)