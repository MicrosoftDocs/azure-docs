---
title: 'Types of attacks Azure DDoS Protection mitigates'
description: Learn what types of attacks Azure DDoS Protection protects against.
services: ddos-protection
author: AbdullahBell
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 03/17/2025
ms.author: abell
---
# Types of attacks Azure DDoS Protection mitigate

Azure DDoS Protection can mitigate the following types of attacks:

- **Volumetric attacks**: These attacks flood the network layer with a substantial amount of seemingly legitimate traffic. They include UDP floods, amplification floods, and other spoofed-packet floods. DDoS Protection mitigates these potential multi-gigabyte attacks by absorbing and scrubbing them, with Azure's global network scale, automatically. Common attack types are listed in the following table.

    | **Attack Type**                | **Description**                                                                 |
    |--------------------------------|---------------------------------------------------------------------------------|
    | **ICMP Flood**                 | Overwhelms the target with ICMP Echo Request (ping) packets, causing disruption. |
    | **IP/ICMP Fragmentation**      | Exploits IP packet fragmentation to overwhelm the target with fragmented packets.|
    | **IPsec Flood**                | Floods the target with IPsec packets, overwhelming the processing capability.    |
    | **UDP Flood**                  | Sends a large number of UDP packets to random ports, causing resource exhaustion.|
    | **Reflection Amplification Attack** | Uses a third-party server to amplify the attack traffic towards the target.    |

- **Protocol attacks**: These attacks render a target inaccessible, by exploiting a weakness in the layer 3 and layer 4 protocol stack. They include SYN flood attacks, reflection attacks, and other protocol attacks. DDoS Protection mitigates these attacks, differentiating between malicious and legitimate traffic, by interacting with the client, and blocking malicious traffic. Common attack types are listed in the following table.

    | **Attack Type**                | **Description**                                                                 |
    |--------------------------------|---------------------------------------------------------------------------------|
    | **SYN Flood**                  | Exploits the TCP handshake process to overwhelm the target with connection requests. |
    | **Fragmented Packet Attack**   | Sends fragmented packets to the target, causing resource exhaustion during reassembly. |
    | **Ping of Death**              | Sends malformed or oversized packets to crash or destabilize the target system. |
    | **Smurf Attack**               | Uses ICMP echo requests to flood the target with traffic by exploiting network devices. |

- **Resource (application) layer attacks**: These attacks target web application packets, to disrupt the transmission of data between hosts. They include HTTP protocol violations, SQL injection, cross-site scripting, and other layer 7 attacks. Use a Web Application Firewall, such as the Azure [Application Gateway web application firewall](../web-application-firewall/ag/ag-overview.md?toc=%2fazure%2fvirtual-network%2ftoc.json), and DDoS Protection to provide defense against these attacks. There are also third-party web application firewall offerings available in the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps?page=1&search=web%20application%20firewall). Common attacks types are listed in the following table.


    | **Attack Type**                | **Description**                                                                 |
    |--------------------------------|---------------------------------------------------------------------------------|
    | **BGP Hijacking**              | Involves taking control of a group of IP addresses by corrupting Internet routing tables. |
    | **Slowloris**                  | Keeps many connections to the target web server open and holds them open as long as possible. |
    | **Slow Post**                  | Sends HTTP POST headers that are incomplete, causing the server to wait for the rest of the data. |
    | **Slow Read**                  | Reads responses from the server slowly, causing the server to keep the connection open. |
    | **HTTP(/s) Flooding**          | Floods the target with HTTP requests, overwhelming the server's ability to respond. |
    | **Low and Slow attack**        | Uses a few connections to slowly send or request data, evading detection. |
    | **Large Payload POST**         | Sends large payloads in HTTP POST requests to exhaust server resources. |


## Next steps

* [Components of a DDoS response strategy](ddos-response-strategy.md).
