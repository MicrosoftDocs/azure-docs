---
title: Peering registered prefix requirements
description: Technical requirements to register your prefixes for Peering Service.
services: internet-peering
author: jsaraco
ms.service: internet-peering
ms.topic: conceptual
ms.date: 06/13/2023
ms.author: jsaraco
ms.custom: template-concept, engagement-fy23
---

# Peering registered prefix requirements

Ensure the prerequisites below are met before you activate your prefixes for Peering Service.

## Technical requirements

For a registered prefix to be validated after creation, the following checks must pass:

* The prefix cannot be in a private range
* All sessions on the parent peering must advertise routes for the prefix
* Routes must be advertised with the MAPS community string 8075:8007
* AS paths in your routes cannot exceed a path length of 3, and cannot contain private ASNs

## Troubleshooting

The validation state of a peering service prefix can be seen in the Azure Portal.

    :::image type="content" source="media/peering-registered-prefix-validation-failed.png" alt-text="Peering registered prefixes displayed with validation failure messages" :::

Prefixes can only be registered when all validation steps have passed. Listed below are possible validation errors, with troubleshooting steps to solve them.

### Prefix not received from IP

To validate a prefix during registration, the prefix must be advertised on every session belonging to the prefix's parent peering. This message indicates that Microsoft is not receiving prefix advertisement from one or more of the sessions. All IPs listed in this message are missing advertisement. Contact your networking team, and confirm that the prefixes are being advertised on all sessions.

If you're advertising your prefix on all sessions and you're still seeing this validation failure message, please contact mapschamps@microsoft.com with your Azure subscription, and prefix and we will assist you.

### Advertisement missing MAPS community

A requirement for registered prefix validation is that prefixes are advertised with the MAPS community string "8075:8007". This message indicates that Microsoft is receiving prefix advertisement, but the MAPS community string is missing. Please add the MAPS community string to the community when advertising routes for MAPS prefixes. After that, the community requirements will be satisfied and validation will continue.

If you have any issues or questions, please contact mapschamps@microsoft.com with your Azure subscription, and prefix and we will assist you.

### AS path is not correct

For registered prefix validation, the AS path of the advertised routes must satisfy technical requirements. Namely, the AS path of the routes must not exceed a path length of 3, and the AS path cannot contain any private ASNs. This message indicates that Microsoft is receiving routes for the prefix, but the AS path violates one of those two requirements. Please adjust the prefix advertisement on all sessions, and ensure that the AS path length does not exceed 3, and there are no private ASNs in the path. After that, the AS path requirements will be satisfied and validation will continue.

### Internal server error

Please contact mapschamps@microsoft.com with your Azure subscription, and prefix and we will assist you.

## Next steps

* [Azure Internet peering for Peering Service walkthrough](walkthrough-peering-service-all.md).
* [Azure Internet peering for Communications Services walkthrough](walkthrough-communications-services-partner.md)
* [Peering Service customer walkthrough](walkthrough-peering-services-customer.md)