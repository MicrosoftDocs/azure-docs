---
title: Azure Operator Nexus Access Control Lists Overview
description: Get an overview of Access Control Lists for Azure Operator Nexus.
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 02/09/2024
ms.custom: template-concept
---

# Access Control List in Azure Operator Nexus Network Fabric

Access Control Lists (ACLs) are a set of rules that regulate inbound and outbound packet flow within a network. Azure's Nexus Network Fabric service offers an API-based mechanism to configure ACLs for network-to-network interconnects and layer 3 isolation domain external networks. These APIs enable the specification of traffic classes and performance actions based on defined rules and actions within the ACLs. ACL rules define the data against which packet contents are compared for filtering purposes.

## Objective

The primary objective of ACLs is to secure and regulate incoming and outgoing tenant traffic flowing through the Nexus Network Fabric via network-to-network interconnects (NNIs) or layer 3 isolation domain external networks. ACL APIs empower administrators to control data rates for specific traffic classes and take action when traffic exceeds configured thresholds. This safeguards tenants from network threats by applying ingress ACLs and protects the network from tenant activities through egress ACLs. ACL implementation simplifies network management by securing networks and facilitating the configuration of bulk rules and actions via APIs.

## Functionality

ACLs utilize match criteria and actions tailored for different types of network resources, such as NNIs and external networks. ACLs can be applied in two primary forms:

- **Ingress ACL**: Controls inbound packet flow.
- **Egress ACL**: Regulates outbound packet flow.

Both types of ACLs can be applied to NNIs or external network resources to filter and manipulate traffic based on various match criteria and actions.

### Supported network resources:

| Resource Name                  | Supported | SKU         |
|--------------------------------|-----------|-------------|
| NNI                            | Yes       | All         |
| Isolation Domain External Network | Yes on External Network with option A | All         |

## Match configuration

Match criteria are conditions used to match packets based on attributes such as IP address, protocol, port, VLAN, DSCP, ethertype, fragment, TTL, etc. Each match criterion has a name, a sequence number, an IP address type, and a list of match conditions. Match conditions are evaluated using the logical AND operator.

- **dot1q**: Matches packets based on VLAN ID in the 802.1Q tag.
- **Fragment**: Matches packets based on whether they are IP fragments or not.
- **IP**: Matches packets based on IP header fields such as source/destination IP address, protocol, and DSCP.
- **Protocol**: Matches packets based on the protocol type.
- **Source/Destination**: Matches packets based on port number or range.
- **TTL**: Matches packets based on the Time-To-Live (TTL) value in the IP header.
- **DSCP**: Matches packets based on the Differentiated Services Code Point (DSCP) value in the IP header.

## Action property of Access Control List

The action property of an ACL statement can have one of the following types:

- **Permit**: Allows packets that match specified conditions.
- **Drop**: Discards packets that match specified conditions.
- **Count**: Counts the number of packets that match specified conditions.

## Control plane traffic policy (CP-TP)

Additionally to add an additional layer of control plane protection for enhancing network security, users can also configure and modify control plane traffic policies on supported devices via APIs. 

•	A Traffic Policy (TP) solution for securing the Fabric device Control Plane (packets destined to or originating from the Fabric device) of the supported devices in AON.

•	The device control plane (which includes Policing/Rate Limiting) can be implemented as Traffic Policies based on source/destination IP, source/destination ports, and protocols.
•	API supports create, update, and delete the TP entries/rules/Policing/Rate Limiting.

To implement the functionality for Control Plane ACL - Traffic Policy: 

•	For existing deployments, users must create a CPTP ACL resource, associate it with the Network Fabric (NF), and perform a patch operation.

•	For new deployments, users should create the CPTP ACL resource either during Fabric creation or after the Fabric has been provisioned, followed by patching it to the NF resource. Since the CPTP ACL resource is not created by default, users must manually create it before attaching it to the NF.

## Next steps:

[Creating Access Control List (ACL) management for NNI and layer 3 isolation domain external networks](howto-create-access-control-list-for-network-to-network-interconnects.md)
