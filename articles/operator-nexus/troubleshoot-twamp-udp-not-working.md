---
title: "Azure Operator Nexus: TWAMP (UDP) not working"
description: Learn how to troubleshoot TWAMP (UDP) issues.
author: papadeltasierra
ms.author: pauldsmith
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus
ms.topic: troubleshooting
ms.date: 12/10/2024
# ms.custom: template-include
---

# Troubleshoot TWAMP (UDP) not working

TWAMP (Two-Way Active Measurement Protocol) over UDP (User Datagram Protocol) doesn't work if NAT (Network Address Translation) occurs between the Session-Sender and the Session-Reflector and/or Control-Client and Server. Typically the Session-Sender and Control-Client reside in one network and the Session-Reflector and Server reside in a second network. 

Examples where NAT can occur include any meeting between two LANs (Local Area Networks) with independent addressing such as a connection to/from a VLAN (Virtual LAN).

TWAMP over TCP (Transmission Control Protocol) can work through a NAT providing the Session-Reflector and Server have IP addresses outside the address range of the subnet in which the Session-Sender and Control-Client reside. The IP addresses of the Session-Reflector and Server IP addresses must also be unique along the entire path.

## Diagnosis

TWAMP (UDP) is configured but doesn't work. Network traffic analysis shows traffic leaving the Control-Client and/or Session-Sender but not returning from the Server and/or Session-Reflector.

## Mitigation steps

No mitigation is possible. Two-way UDP protocols can't traverse networks where address translation occurs without extra logic elements such as an ALG (Application-level Gateway).

Two-Way TCP protocols can traverse a NAT providing that the TCP connection is established from inside the NAT to outside. This traversal is possible because a long-lived connection is established through the NAT and traffic in the return direction flows along this connection. UDP traffic doesn't establish a long-lived connection so there's no defined path back through the NAT for return traffic to follow.



## Related content

- The TWAMP protocol is described in [A Two-Way Active Measurement Protocol (TWAMP)](https://datatracker.ietf.org/doc/html/rfc5357).
- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
