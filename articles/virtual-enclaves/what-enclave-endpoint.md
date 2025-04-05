---
title: What is an Enclave endpoint?
description: What is an Enclave endpoint?
author: jadean-msft
ms.author: jadean
# ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# What is an Enclave endpoint?

Enclave Endpoints define how workloads can be accessed from outside of an Enclave boundary. When an Enclave Connection is created from Enclave-A to an Endpoint in Enclave-B, the Endpoint determines the destination, ports, and protocols for the connection. The Enclave Connection resource determines authorized source IP coming from Enclave-A that is authorized to connect to Enclave-B.

## Architecture of an enclave endpoint

![Graphic showing enclave resource connections and access from another enclave and from an external resource.](./media/community-two-enclaves-connections-externally.png)

## Enclave Endpoint Rules
Enclave endpoint rules have the following three components:
- Destination IP Address: IP/CIDR range of an IP space within the Enclave boundary
- Ports: Ports though which network traffic is allowed to flow to the destination IP
- Protocols: Protocols through which network traffic is allowed to flow to the destination IP

## Connection Types

Enclave Endpoints support two types of connections:
- Inbound from another Enclave in the Community
- Inbound from a Transit Hub

## Template
See [template documentation](./ave-templates.md#endpoints-template)
