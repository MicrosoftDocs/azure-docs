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

# Troubleshoot TWMP (UDP) not working

TWAMP (Two-Way Active Measurement Protocol) over UDP does not work if NAT (network address translation) occurs between the Session-Sender and the Session-Reflector and/or Control-CLient and Server.  Typically the Sesion-Sender and Control-Client will reside in one network and the Session-Reflector and Server will reside in a second network. 

Examples where NAT can occur include any meeting between two LANs with independent addressing such as a connection to/from a vLAN.

TWAMP over TCP can work through a NAT providing the Session-Reflector and Server have IP addresses outside the address range of the subnet in which the Session-Sender and Control-Client reside and the Session-Reflector and Server IP addresses are unique along the entire path.

## Diagnosis

TWAMP (UDP) is configured but does not work.  Network traffic analysis shows traffic leaving the Control-Client and/or Session-Sender but not returning from the Server and/or Session-Reflector.

## Mitigation steps

None are possible.  Two-way UDP protocols cannot traverse networks where address translation occurs without additional logic elements such as an ALG (Application-level Gateway).

Two-Way TCP protocols can traverse a NAT providing that the TCP connection is esablished from inside the NAT to outside.  This is possible because a long-live connection is established through the NAT and reaffic in the return direction flows long this connection.  UDP traffic does not establish a long-live connection so there is no defined path back through the NAT for return traffic to follow.

## Related content

- [A Two-Way Active Measurement Protocol (TWAMP)](https://datatracker.ietf.org/doc/html/rfc5357)
- If you still have questions, contact [Azure support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- For more information about support plans, see [Azure support plans](https://azure.microsoft.com/support/plans/response/).
