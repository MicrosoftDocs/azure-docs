---
title: What is an enclave endpoint?
description: What is an enclave endpoint?
author: jadean-msft
ms.author: jadean
ms.topic: overview
ms.date: 04/08/2025
---

# What is an enclave endpoint?

Enclave Endpoints define how workloads can be accessed from outside of an Enclave boundary. When an enclave is created from Enclave-A to an Endpoint in Enclave-B, the Endpoint determines the destination, ports, and protocols for the connection. The enclave resource determines authorized source IP coming from Enclave-A that is authorized to connect to Enclave-B.

## Architecture of an enclave endpoint

![Diagram showing enclave resource connections and access from another enclave and from an external resource.](./media/community-two-enclaves-connections-externally.png)

## Enclave endpoint Rules
Enclave Endpoint rules have the following three components:
- Destination IP Address: IP/CIDR range of an IP space within the Enclave boundary
- Ports: Ports though which network traffic is allowed to flow to the destination IP
- Protocols: Protocols through which network traffic is allowed to flow to the destination IP

## Connection Types

Enclave Endpoints support two types of connections:
- Inbound from another Enclave in the community
- Inbound from a Transit Hub

## Template
See [template documentation](./virtual-enclaves-templates.md#endpoints-template)
