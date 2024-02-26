---
title: Peering registered prefix requirements
titleSuffix: Internet Peering
description: Learn about the technical requirements to register your prefixes for Azure Peering Service.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: overview
ms.date: 07/23/2023
---

# Peering registered prefix requirements

Ensure the prerequisites in this document are met before you activate your prefixes for Azure Peering Service.

## Technical requirements

For a registered prefix to be validated after creation, the following checks must pass:

* The prefix can't be in a private range
* The origin ASN must be registered in a major routing registry
* The prefix must be announced from all peering sessions
* Routes must be advertised with the Peering Service community string **8075:8007**
* AS paths in your routes can't exceed a path length of 3, and can't contain private ASNs or AS prepending

## Troubleshooting

The validation state of a peering registered prefix can be seen in the Azure portal.

:::image type="content" source="./media/peering-registered-prefix-requirements/prefix-validation-failed.png" alt-text="Peering registered prefixes displayed with validation failure messages." lightbox="./media/peering-registered-prefix-requirements/prefix-validation-failed.png":::

Prefixes can only be registered when all validation steps have passed. Listed in this document are possible validation errors, with troubleshooting steps to solve them.

### Prefix not received from IP

To validate a prefix during registration, the prefix must be advertised on every session belonging to the prefix's parent peering. This message indicates that Microsoft isn't receiving prefix advertisement from one or more of the sessions. All IPs listed in this message are missing advertisement. Contact your networking team, and confirm that the prefixes are being advertised on all sessions.

If you're advertising your prefix on all sessions and you're still seeing this validation failure message, contact peeringservice@microsoft.com with your Azure subscription and prefix to get help.

### Advertisement missing MAPS community

A requirement for registered prefix validation is that prefixes are advertised with the Peering Service community string **8075:8007**. This message indicates that Microsoft is receiving prefix advertisement, but the Peering Service community string is missing. Add the Peering Service community string to the community when advertising routes for Peering Service prefixes. After that, the community requirements will be satisfied and validation will continue.

If you have any issues or questions, contact peeringservice@microsoft.com with your Azure subscription and prefix to get help.

### AS path isn't correct

For registered prefix validation, the AS path of the advertised routes must satisfy technical requirements. Namely, the AS path of the routes must not exceed a path length of 3, and the AS path can't contain any private ASNs. This message indicates that Microsoft is receiving routes for the prefix, but the AS path violates one of those two requirements. Adjust the prefix advertisement on all sessions, and ensure that the AS path length doesn't exceed 3, and there are no private ASNs in the path. After that, the AS path requirements will be satisfied and validation will continue.

### Internal server error

Contact peeringservice@microsoft.com with your Azure subscription and prefix to get help.

## Next steps

* [Internet peering for Peering Service walkthrough](walkthrough-peering-service-all.md).
* [Internet peering for voice services walkthrough](walkthrough-communications-services-partner.md)
* [Peering Service customer walkthrough](../peering-service/customer-walkthrough.md)