---
title: "Azure Operator Nexus: Telco Input Template"
description: Representing a Nexus instance in a Telco Input template.
author: bartpinto
ms.author: bpinto
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 04/28/2025
ms.custom: template-concept
---

# Telco input template

This concept article describes how to represent a Nexus instance in a Telco Input template. 

## Overview

The Telco Input template contains all the parameters and values that are required to create and deploy a Nexus instance. 

It can be used for reference in creating deployment payloads for Azure CLI, ARM, or Bicep deployments.

## Definitions

Terms and Acronyms for the Telco Input Template:
- Build of Material (BOM) - List of certified hardware, models, equipment to build a Nexus instance.
- Express Route (XRT) - Network connection between Azure and the on-premises network.
- Management (MGMT) - Refers to internal platform infrastructure and networking that is to manage the Nexus instance.
- Tenant (TNT) - Refers to customer infrastructure and networking available for running custom workloads in the Nexus instance.
- User Access Managed Identity (UAMI) - Azure Managed identities used for service to service access between resource providers.
- KeyVault (KV) - Azure KeyVault Resource.
- Network-to-Network Interface (NNI) - Fabric network-to-nework interface defines L2/L3 network configurations on the Fabric.
- Access Control List (ACL) - Define controls on which source networks and protocols can access target networks and protocols.
- Autonomous System Number (ASN) - Identifier assigned to a collection of networks and routers having same routing policy.
- Terminal Server (TS) - Device that connects devices with a serial port to a local network.
- Preboot eXecution Environment (PXE) - Network boot protocol used for automating provisioning of servers.
- Hardware (HW) - Generic shorthand for different types of physical equipment.
- Stock Keeping Unit (SKU) - Product purchasable unit ID.
- Integrated Dell Remote Access Controller (iDRAC) - Local and remote server management controller.
- Internet Small Computer System Interface (iSCSI) - Transport layer protocol for block-level data between an iSCSI initiator on a server and an iSCSI target on a storage device.
- Compute Rack (CR) - Nexus Rack for top-of-rack network, management network, management servers, and compute servers.
- Aggregate Rack (AGGR) - Nexus Rack for edge network, management network, network packet brokers, and storage arrays.

## Table view of Telco Input Template

### [`PreReqs`](#tab/prereqs)

   | LABEL                        | VALUE                   |
   | ---------------------------- | ----------------------- |
   | `Azure Subscription`         | `SUBSCRIPTION_NAME`     |
   | `Azure Subscription ID`      | `SUBSCRIPTION_ID`       |
   | `Azure Tenant`               | `TENANT_ID`             |
   | `Azure Region (location)`    | `REGION`                |
   | `BOM Version`                | `BOM_VERSION`           |
   | `Credentials KV Resource ID` | `CUSTOMER_KV_RID`       |

### [Network Fabric Controller](#tab/nework-fabric-controller)

   | LABEL                    | VALUE                    | PROPERTY                        |
   | ------------------------ | ------------------------ | ------------------------------- |
   | `Name`                   | `NFC_NAME`               | `name`                          |
   | `Resource Group`         | `NFC_RG`                 | `resourceGroupName`             |
   | `Managed Resource Group` | `NFC_MRG`                | `managedResourceGroupName`      |
   | `MGMT XRT 1`             | `MGMT_ER1_RID`           | `expressRouteCircuitId1`        |
   | `MGMT XRT 1 Auth`        | `MGMT_ER1_AUTH`          | `expressRouteAuthorizationKey1` |
   | `MGMT XRT 2`             | `MGMT_ER2_RID`           | `expressRouteAuthorizationKey2` |
   | `MGMT XRT 2 Auth`        | `MGMT_ER2_AUTH`          | `expressRouteAuthorizationKey2` |
   | `TNT XRT 1`              | `TNT_ER1_RID`            | `expressRouteAuthorizationKey1` |
   | `TNT XRT 1 Auth`         | `TNT_ER1_AUTH`           | `expressRouteAuthorizationKey1` |
   | `TNT XRT 2`              | `TNT_ER2_RID`            | `expressRouteAuthorizationKey2` |
   | `TNT XRT 2 Auth`         | `TNT_ER2_AUTH`           | `expressRouteAuthorizationKey2` |
   | `IPV4`                   | `NFC_IPV4/NFC_IPV4_CIDR` | `ipv4AddressSpaces`             |
   | `IPV6`                   | `NFC_IPV6/NFC_IPV6_CIDR` | `ipV6AddressSpaces`             |

### [Cluster Manager](#tab/cluster-manager)

   | LABEL                    | VALUE      | PROPERTY                          |
   | ------------------------ | ---------- | --------------------------------- |
   | `Cluster Manager Name`   | `CM_NAME`  | `Cluster Manager Name`            |
   | `Resource Group`         | `CM_GROUP` | `resourceGroupName`               |
   | `Managed Resource Group` | `CM_MRG`   | `managedResourceGroupName`        |
   | `UAMI`                   | `UAMI_RID` | `identity/userAssignedIdentities` |

### [Network Fabric](#tab/network-fabric)

   | LABEL                                   | VALUE                            | PROPERTY                                                                                              |
   | --------------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------- |
   | `Fabric Name`                           | `NF_NAME`                        | `name`                                                                                                |
   | `Fabric Version`                        | `NF_VER`                         | `fabricVersion`                                                                                       |
   | `Resource Group`                        | `NF_RG`                          | `resourceGroup`                                                                                       |
   | `Fabric SKU`                            | `NF_SKU`                         | `networkFabricSku`                                                                                    |
   | `Fabric ASN`                            | `NF_ASN`                         | `fabricAsn`                                                                                           |
   | `Comp Rack Count`                       | `RACK_COUNT`                     | `rackCount`                                                                                           |
   | `Comp Servers per rack`                 | `SERVERS_PER_RACK`               | `serverCountPerRack`                                                                                  |
   | `MGMT IPV4 Prefix`                      | `MGMT_IPV4/MGMT_IPV4_CIDR`       | `ipv4Prefix`                                                                                          |
   | `MGMT IPV6 Prefix`                      | `MGMT_IPV6/MGMT_IPV6_CIDR`       | `ipv6Prefix`                                                                                          |
   | `TS Hostname`                           | `TS_HOSTNAME`                    | `terminalServerConfiguration/hostname`                                                                |
   | `TS Username`                           | `TS_USER_SECRET`                 | `terminalServerConfiguration/userName`                                                                |
   | `TS Password`                           | `TS_PWD_SECRET`                  | `terminalServerConfiguration/password`                                                                |
   | `TS Serial Number`                      | `TS_SERIAL`                      | `terminalServerConfiguration/serialNumber`                                                            |
   | `TS IPV4`                               | `TS_IPV4_1/TS1_IPV4_1_CIDR`      | `terminalServerConfiguration/primaryIPv4Prefix`                                                       |
   | `TS Secondary IPV4`                     | `TS_IPV4_2/TS1_IPV4_2_CIDR`      | `terminalServerConfiguration/secondaryIPv4Prefix`                                                     |
   | `TS IPV6`                               | `TS_IPV6_1/TS1_IPV6_1_CIDR`      | `terminalServerConfiguration/primaryIPv6Prefix`                                                       |
   | `TS Secondary IPV6`                     | `TS_IPV6_2/TS1_IPV6_2_CIDR`      | `terminalServerConfiguration/secondaryIPv6Prefix`                                                     |
   | `Mgmt Peering Option`                   | `MGMT_PEERING_OPTION`            | `managementNetworkConfiguration/infrastructureVpnConfiguration/peeringOption`                         |
   | `Mgmt Option B Import RT`               | `MGMT_OPB_IMPORT_RT`             | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionBProperties/importRouteTargets`  |
   | `Mgmt Option B Export RT`               | `MGMT_OPB_EXPORT_RT`             | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionBProperties/exportRouteTargets`  |
   | `Mgmt Option A MTU`                     | `MGMT_OPA_MTU`                   | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/mtu`                 |
   | `Mgmt Option A VLAN ID`                 | `MGMT_OPA_VLANID`                | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/vlanId`              |
   | `Mgmt Option A Peer ASN`                | `MGMT_OPA_PEERASN`               | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/peerAsn`             |
   | `Mgmt Option A Primary IPV4 Prefix`     | `MGMT_OPA_PRIMARYIPV4PREFIX`     | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/primaryIpv4Prefix`   |
   | `Mgmt Option A Primary IPV6 Prefix`     | `MGMT_OPA_PRIMARYIPV6PREFIX`     | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/primaryIpv6Prefix`   |
   | `Mgmt Option A Secondary IPV4 Prefix`   | `MGMT_OPA_SECONDARYIPV4PREFIX`   | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/secondaryIpv4Prefix` |
   | `Mgmt Option A Secondary IPV6 Prefix`   | `MGMT_OPA_SECONDARYIPV6PREFIX`   | `managementNetworkConfiguration/infrastructureVpnConfiguration/optionAProperties/secondaryIpv6Prefix` |
   | `Tenant Peering Option`                 | `TENANT_PEERING_OPTION`          | `managementNetworkConfiguration/workloadVpnConfiguration/peeringOption`                               |
   | `Tenant Option B Import RT`             | `TENANT_OPB_IMPORT_RT`           | `managementNetworkConfiguration/workloadVpnConfiguration/optionBProperties/importRouteTargets`        |
   | `Tenant Option B Export RT`             | `TENANT_OPB_EXPORT_RT`           | `managementNetworkConfiguration/workloadVpnConfiguration/optionBProperties/exportRouteTargets`        |
   | `Tenant Option A MTU`                   | `TENANT_OPA_MTU`                 | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/mtu`                       |
   | `Tenant Option A VLAN ID`               | `TENANT_OPA_VLANID`              | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/vlanId`                    |
   | `Tenant Option A Peer ASN`              | `TENANT_OPA_PEERASN`             | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/peerAsn`                   |
   | `Tenant Option A Primary IPV4 Prefix`   | `TENANT_OPA_PRIMARYIPV4PREFIX`   | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/primaryIpv4Prefix`         |
   | `Tenant Option A Primary IPV6 Prefix`   | `TENANT_OPA_PRIMARYIPV6PREFIX`   | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/primaryIpv6Prefix`         |
   | `Tenant Option A Secondary IPV4 Prefix` | `TENANT_OPA_SECONDARYIPV4PREFIX` | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/secondaryIpv4Prefix`       |
   | `Tenant Option A Secondary IPV6 Prefix` | `TENANT_OPA_SECONDARYIPV6PREFIX` | `managementNetworkConfiguration/workloadVpnConfiguration/optionAProperties/secondaryIpv6Prefix`       |

### [Network Fabric NNI](#tab/network-fabric-nni)

   | NNI NAME          | LABEL                   | VALUE                                | PROPERTY                                  |
   | ----------------- | ----------------------- | ------------------------------------ | ----------------------------------------- |
   | `nni_1_name`      | `NNI L2 MTU`            | `NNI1_L2_MTU`                        | `layer2Configuration/mtu`                 |
   | `nni_1_name`      | `NNI Peer ASN`          | `NNI1_PEER_ASN`                      | `layer3Configuration/peerASN`             |
   | `nni_1_name`      | `NNI L3 Primary IPV4`   | `NNI1_L3_IPV4_1/NNI1_L3_IPV4_1_CIDR` | `layer3Configuration/primaryIPv4Prefix`   |
   | `nni_1_name`      | `NNI L3 Primary IPV6`   | `NNI1_L3_IPV6_1/NNI1_L3_IPV6_1_CIDR` | `layer3Configuration/primaryIPv6Prefix`   |
   | `nni_1_name`      | `NNI L3 Secondary IPV4` | `NNI1_L3_IPV4_2/NNI1_L3_IPV4_2_CIDR` | `layer3Configuration/secondaryIPv4Prefix` |
   | `nni_1_name`      | `NNI L3 Secondary IPV6` | `NNI1_L3_IPV6_2/NNI1_L3_IPV6_2_CIDR` | `layer3Configuration/secondaryIPv6Prefix` |
   | `nni_1_name`      | `NNI L3 VLAN ID`        | `NNI1_L3_VLAN_ID`                    | `layer3Configuration/vlanId`              |
   | `nni_1_name`      | `NNI Egress ACL`        | `nni_1_egress-1-acl-name`            | `egressAclId`                             |
   | `nni_1_name`      | `NNI Ingress ACL`       | `nni_1_ingress-1-acl-name`           | `ingressAclId`                            |
   | `nni_1_name`      | `NNI L2 CE1 Interface1` | `NNI1_L2_CE1_INT_1`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface1` | `NNI1_L2_CE2_INT_1`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface2` | `NNI1_L2_CE1_INT_2`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface2` | `NNI1_L2_CE2_INT_2`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface3` | `NNI1_L2_CE1_INT_3`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface3` | `NNI1_L2_CE2_INT_3`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface4` | `NNI1_L2_CE1_INT_4`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface4` | `NNI1_L2_CE2_INT_4`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface5` | `NNI1_L2_CE1_INT_5`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface5` | `NNI1_L2_CE2_INT_5`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface6` | `NNI1_L2_CE1_INT_6`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface6` | `NNI1_L2_CE2_INT_6`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE1 Interface7` | `NNI1_L2_CE1_INT_7`                  | `layer2Configuration/Interfaces`          |
   | `nni_1_name`      | `NNI L2 CE2 Interface7` | `NNI1_L2_CE2_INT_7`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 MTU`            | `NNI2_L2_MTU`                        | `layer2Configuration/mtu`                 |
   | `nni_2_name`      | `NNI Peer ASN`          | `NNI2_PEER_ASN`                      | `layer3Configuration/peerASN`             |
   | `nni_2_name`      | `NNI L3 Primary IPV4`   | `NNI2_L3_IPV4_1/NNI2_L3_IPV4_1_CIDR` | `layer3Configuration/primaryIPv4Prefix`   |
   | `nni_2_name`      | `NNI L3 Primary IPV6`   | `NNI2_L3_IPV6_1/NNI2_L3_IPV6_1_CIDR` | `layer3Configuration/primaryIPv6Prefix`   |
   | `nni_2_name`      | `NNI L3 Secondary IPV4` | `NNI2_L3_IPV4_2/NNI2_L3_IPV4_2_CIDR` | `layer3Configuration/secondaryIPv4Prefix` |
   | `nni_2_name`      | `NNI L3 Secondary IPV6` | `NNI2_L3_IPV6_2/NNI2_L3_IPV6_2_CIDR` | `layer3Configuration/secondaryIPv6Prefix` |
   | `nni_2_name`      | `NNI L3 VLAN ID`        | `NNI2_L3_VLAN_ID`                    | `layer3Configuration/vlanId`              |
   | `nni_2_name`      | `NNI Egress ACL`        | `nni_1_egress-1-acl-name`            | `egressAclId`                             |
   | `nni_2_name`      | `NNI Ingress ACL`       | `nni_1_ingress-1-acl-name`           | `ingressAclId`                            |
   | `nni_2_name`      | `NNI L2 CE1 Interface1` | `NNI2_L2_CE1_INT_1`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface1` | `NNI2_L2_CE2_INT_1`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface2` | `NNI2_L2_CE1_INT_2`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface2` | `NNI2_L2_CE2_INT_2`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface3` | `NNI2_L2_CE1_INT_3`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface3` | `NNI2_L2_CE2_INT_3`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface4` | `NNI2_L2_CE1_INT_4`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface4` | `NNI2_L2_CE2_INT_4`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface5` | `NNI2_L2_CE1_INT_5`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface5` | `NNI2_L2_CE2_INT_5`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface6` | `NNI2_L2_CE1_INT_6`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface6` | `NNI2_L2_CE2_INT_6`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE1 Interface7` | `NNI2_L2_CE1_INT_7`                  | `layer2Configuration/Interfaces`          |
   | `nni_2_name`      | `NNI L2 CE2 Interface7` | `NNI2_L2_CE2_INT_7`                  | `layer2Configuration/Interfaces`          |

### [NNI Ingress ACL](#tab/nni-ingress-acl)

   | ACL NAME                  | INGRESS OR EGRESS  | SEQUENCENUMBER      | MATCHCONFIGURATIONNAME          | IPADDRESSTYPE             | ACTIONS                    | SOURCEIPS                                                                                                 | DESTINATIONIPS                                                                                    | PROTOCOLTYPES                                               | PROTOCOL                 | DESTINATIONPORTS                                    | SOURCEPORTS                                            |
   | -------------------------- | ------------------- | ------------------- | --------------------------------- | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
   | `nni_1_ingress-1-acl-name` | `Ingress`           | `NNI1_ACL1_SEQ1_NO` | `NNI1_ACL1_SEQ1_MATCHCONFIG_NAME` | `NNI1_ACL1_SEQ1_ADDR_TYPE` | `NNI1_ACL1_SEQ1_ACTIONS`    | `NNI1_ACL1_SEQ1_SOURCE_IP1/NNI1_ACL1_SEQ1_SOURCE_CIDR1,NNI1_ACL1_SEQ1_SOURCE_IP2/NNI1_ACL1_SEQ1_SOURCE_CIDR2` | `NNI1_ACL1_SEQ1_DEST_IP1/NNI1_ACL1_SEQ1_DEST_CIDR1,NNI1_ACL1_SEQ1_DEST_IP2/NNI1_ACL1_SEQ1_DEST_CIDR2` | `NNI1_ACL1_SEQ1_PROTOCOL_TYPE1,NNI1_ACL1_SEQ1_PROTOCOL_TYPE2` | `NNI1_ACL1_SEQ1_PROTOCOL` | `NNI1_ACL1_SEQ1_DEST_PORT1,NNI1_ACL1_SEQ1_DEST_PORT2` | `NNI1_ACL1_SEQ1_SOURCE_PORT1,NNI1_ACL1_SEQ1_SOURCE_PORT2` |
   | `nni_1_ingress-1-acl-name` | `Ingress`           | `default`           |                                 |                          | `NNI1_ACL1_DEFAULT_ACTIONS` |                                                                                                             |                                                                                                     |                                                             |                         |                                                     |                                                         |
   | `nni_2_ingress-1-acl-name` | `Ingress`           | `NNI2_ACL1_SEQ1_NO` | `NNI2_ACL1_SEQ1_MATCHCONFIG_NAME` | `NNI2_ACL1_SEQ1_ADDR_TYPE` | `NNI2_ACL1_SEQ1_ACTIONS`    | `NNI2_ACL1_SEQ1_SOURCE_IP1/NNI2_ACL1_SEQ1_SOURCE_CIDR1,NNI2_ACL1_SEQ1_SOURCE_IP2/NNI2_ACL1_SEQ1_SOURCE_CIDR2` | `NNI2_ACL1_SEQ1_DEST_IP1/NNI2_ACL1_SEQ1_DEST_CIDR1,NNI2_ACL1_SEQ1_DEST_IP2/NNI2_ACL1_SEQ1_DEST_CIDR2` | `NNI2_ACL1_SEQ1_PROTOCOL_TYPE1,NNI2_ACL1_SEQ1_PROTOCOL_TYPE2` | `NNI2_ACL1_SEQ1_PROTOCOL` | `NNI2_ACL1_SEQ1_DEST_PORT1,NNI2_ACL1_SEQ1_DEST_PORT2` | `NNI2_ACL1_SEQ1_SOURCE_PORT1,NNI2_ACL1_SEQ1_SOURCE_PORT2` |
   | `nni_2_ingress-1-acl-name` | `Ingress`           | `default`           |                                 |                          | `NNI2_ACL1_DEFAULT_ACTIONS` |                                                                                                             |                                                                                                     |                                                             |                         |                                                     |                                                         |

### [NNI Egress ACL](#tab/nni-egress-acl)

   | ACL NAME                  | INGRESS OR EGRESS   | SEQUENCENUMBER      | MATCHCONFIGURATIONNAME            | IPADDRESSTYPE              | ACTIONS                     | SOURCEIPS                                                                                                     | DESTINATIONIPS                                                                                        | PROTOCOLTYPES                                                 | PROTOCOL                  | DESTINATIONPORTS                                      | SOURCEPORTS                                               |
   | ------------------------- | ------------------- | --------------------- | ------------------------------- | -------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------- | ----------------------------------------------------- | --------------------------------------------------------- |
   | `nni_1_egress-1-acl-name` | `Egress`            | `NNI1_ACL1_SEQ1_NO` | `NNI1_ACL1_SEQ1_MATCHCONFIG_NAME` | `NNI1_ACL1_SEQ1_ADDR_TYPE` | `NNI1_ACL1_SEQ1_ACTIONS`    | `NNI1_ACL1_SEQ1_SOURCE_IP1/NNI1_ACL1_SEQ1_SOURCE_CIDR1,NNI1_ACL1_SEQ1_SOURCE_IP2/NNI1_ACL1_SEQ1_SOURCE_CIDR2` | `NNI1_ACL1_SEQ1_DEST_IP1/NNI1_ACL1_SEQ1_DEST_CIDR1,NNI1_ACL1_SEQ1_DEST_IP2/NNI1_ACL1_SEQ1_DEST_CIDR2` | `NNI1_ACL1_SEQ1_PROTOCOL_TYPE1,NNI1_ACL1_SEQ1_PROTOCOL_TYPE2` | `NNI1_ACL1_SEQ1_PROTOCOL` | `NNI1_ACL1_SEQ1_DEST_PORT1,NNI1_ACL1_SEQ1_DEST_PORT2` | `NNI1_ACL1_SEQ1_SOURCE_PORT1,NNI1_ACL1_SEQ1_SOURCE_PORT2` |
   | `nni_1_egress-1-acl-name` | `Egress`            | `default`           |                                 |                          | `NNI1_ACL1_DEFAULT_ACTIONS` |                                                                                                             |                                                                                                     |                                                             |                         |                                                     |                                                         |
   | `nni_2_egress-1-acl-name` | `Egress`            | `NNI2_ACL1_SEQ1_NO` | `NNI2_ACL1_SEQ1_MATCHCONFIG_NAME` | `NNI2_ACL1_SEQ1_ADDR_TYPE` | `NNI2_ACL1_SEQ1_ACTIONS`    | `NNI2_ACL1_SEQ1_SOURCE_IP1/NNI2_ACL1_SEQ1_SOURCE_CIDR1,NNI2_ACL1_SEQ1_SOURCE_IP2/NNI2_ACL1_SEQ1_SOURCE_CIDR2` | `NNI2_ACL1_SEQ1_DEST_IP1/NNI2_ACL1_SEQ1_DEST_CIDR1,NNI2_ACL1_SEQ1_DEST_IP2/NNI2_ACL1_SEQ1_DEST_CIDR2` | `NNI2_ACL1_SEQ1_PROTOCOL_TYPE1,NNI2_ACL1_SEQ1_PROTOCOL_TYPE2` | `NNI2_ACL1_SEQ1_PROTOCOL` | `NNI2_ACL1_SEQ1_DEST_PORT1,NNI2_ACL1_SEQ1_DEST_PORT2` | `NNI2_ACL1_SEQ1_SOURCE_PORT1,NNI2_ACL1_SEQ1_SOURCE_PORT2` |
   | `nni_2_egress-1-acl-name` | `Egress`            | `default`           |                                 |                          | `NNI2_ACL1_DEFAULT_ACTIONS` |                                                                                                             |                                                                                                     |                                                             |                         |                                                     |                                                         |

### [Cluster](#tab/cluster)

   | LABEL                         | VALUE              | PROPERTY                     |
   | ----------------------------- | ------------------ | ---------------------------- |
   | `Cluster Name`                | `CLUSTER_NAME`     | `clusterName`                |
   | `Cluster Version`             | `CLUSTER_VER`      | `clusterVersion`             |
   | `Cluster Location`            | `CLUSTER_LOC`      | `clusterLocation`            |
   | `Resource Group Name`         | `CLUSTER_RG`       | `resourceGroupName`          |
   | `Managed Resource Group Name` | `CLUSTER_MRG`      | `managedResourceGroupName`   |
   | `Username`                    | `BMC_USER_SECRET`  | `username`                   |
   | `Password`                    | `BMC_PWD_SECRET`   | `password`                   |
   | `LAW`                         | `CLUSTER_LAW_NAME` | `analyticsWorkspaceId`       |
   | `Compute Rack SKU`            | `CR_SKU`           | `computeRackSku`             |
   | `Aggregate Rack SKU`          | `AGGR_SKU`         | `aggregateRackSku`           |
   | `Rotation KV Resource ID`     | `CLUSTER_KV_RID`   | `keyVaultId`                 |

### [Compute Devices](#tab/compute-devices)

   | RACK NAME         | RACK LOCATION   | HOSTNAME          | SERIAL NUMBER   | RACK SLOT   | PXE MAC ADDRESS   | IDRAC MAC ADDRESS   | FUNCTION      | DEVICE IDRAC IP     | MACHINE DETAILS   | DEVICE IDRAC IPV6   |
   | ----------------- | --------------- | ----------------- | --------------- | ----------- | ----------------- | ------------------- | ------------- | ------------------- | ----------------- | ------------------- |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C1_HOSTNAME`  | `CR1C1_SN`      | `1`         | `CR1C1_PXE_MAC`   | `CR1C1_IDRAC_MAC`   | `compute`     | `CR1C1_IDRAC_IPV4`  | `CR1C1_MODEL`     | `CR1C1_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C2_HOSTNAME`  | `CR1C2_SN`      | `2`         | `CR1C2_PXE_MAC`   | `CR1C2_IDRAC_MAC`   | `compute`     | `CR1C2_IDRAC_IPV4`  | `CR1C2_MODEL`     | `CR1C2_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C3_HOSTNAME`  | `CR1C3_SN`      | `3`         | `CR1C3_PXE_MAC`   | `CR1C3_IDRAC_MAC`   | `compute`     | `CR1C3_IDRAC_IPV4`  | `CR1C3_MODEL`     | `CR1C3_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C4_HOSTNAME`  | `CR1C4_SN`      | `4`         | `CR1C4_PXE_MAC`   | `CR1C4_IDRAC_MAC`   | `compute`     | `CR1C4_IDRAC_IPV4`  | `CR1C4_MODEL`     | `CR1C4_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C5_HOSTNAME`  | `CR1C5_SN`      | `5`         | `CR1C5_PXE_MAC`   | `CR1C5_IDRAC_MAC`   | `compute`     | `CR1C5_IDRAC_IPV4`  | `CR1C5_MODEL`     | `CR1C5_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C6_HOSTNAME`  | `CR1C6_SN`      | `6`         | `CR1C6_PXE_MAC`   | `CR1C6_IDRAC_MAC`   | `compute`     | `CR1C6_IDRAC_IPV4`  | `CR1C6_MODEL`     | `CR1C6_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C7_HOSTNAME`  | `CR1C7_SN`      | `7`         | `CR1C7_PXE_MAC`   | `CR1C7_IDRAC_MAC`   | `compute`     | `CR1C7_IDRAC_IPV4`  | `CR1C7_MODEL`     | `CR1C7_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C8_HOSTNAME`  | `CR1C8_SN`      | `8`         | `CR1C8_PXE_MAC`   | `CR1C8_IDRAC_MAC`   | `compute`     | `CR1C8_IDRAC_IPV4`  | `CR1C8_MODEL`     | `CR1C8_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C9_HOSTNAME`  | `CR1C9_SN`      | `9`         | `CR1C9_PXE_MAC`   | `CR1C9_IDRAC_MAC`   | `compute`     | `CR1C9_IDRAC_IPV4`  | `CR1C9_MODEL`     | `CR1C9_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C10_HOSTNAME` | `CR1C10_SN`     | `10`        | `CR1C10_PXE_MAC`  | `CR1C10_IDRAC_MAC`  | `compute`     | `CR1C10_IDRAC_IPV4` | `CR1C10_MODEL`    | `CR1C10_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C11_HOSTNAME` | `CR1C11_SN`     | `11`        | `CR1C11_PXE_MAC`  | `CR1C11_IDRAC_MAC`  | `compute`     | `CR1C11_IDRAC_IPV4` | `CR1C11_MODEL`    | `CR1C11_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C12_HOSTNAME` | `CR1C12_SN`     | `12`        | `CR1C12_PXE_MAC`  | `CR1C12_IDRAC_MAC`  | `compute`     | `CR1C12_IDRAC_IPV4` | `CR1C12_MODEL`    | `CR1C12_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C13_HOSTNAME` | `CR1C13_SN`     | `13`        | `CR1C13_PXE_MAC`  | `CR1C13_IDRAC_MAC`  | `compute`     | `CR1C13_IDRAC_IPV4` | `CR1C13_MODEL`    | `CR1C13_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C14_HOSTNAME` | `CR1C14_SN`     | `14`        | `CR1C14_PXE_MAC`  | `CR1C14_IDRAC_MAC`  | `compute`     | `CR1C14_IDRAC_IPV4` | `CR1C14_MODEL`    | `CR1C14_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C15_HOSTNAME` | `CR1C15_SN`     | `15`        | `CR1C15_PXE_MAC`  | `CR1C15_IDRAC_MAC`  | `compute`     | `CR1C15_IDRAC_IPV4` | `CR1C15_MODEL`    | `CR1C15_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1C16_HOSTNAME` | `CR1C16_SN`     | `16`        | `CR1C16_PXE_MAC`  | `CR1C16_IDRAC_MAC`  | `compute`     | `CR1C16_IDRAC_IPV4` | `CR1C16_MODEL`    | `CR1C16_IDRAC_IPV6` |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1M1_HOSTNAME`  | `CR1M1_SN`      | `17`        | `CR1M1_PXE_MAC`   | `CR1M1_IDRAC_MAC`   | `mgmt server` | `CR1M1_IDRAC_IPV4`  | `CR1M1_MODEL`     | `CR1M1_IDRAC_IPV6`  |
   | `CR1_NAME`        | `CR1_LOCATION`  | `CR1M2_HOSTNAME`  | `CR1M2_SN`      | `18`        | `CR1M2_PXE_MAC`   | `CR1M2_IDRAC_MAC`   | `mgmt server` | `CR1M2_IDRAC_IPV4`  | `CR1M2_MODEL`     | `CR1M2_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C1_HOSTNAME`  | `CR2C1_SN`      | `1`         | `CR2C1_PXE_MAC`   | `CR2C1_IDRAC_MAC`   | `compute`     | `CR2C1_IDRAC_IPV4`  | `CR2C1_MODEL`     | `CR2C1_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C2_HOSTNAME`  | `CR2C2_SN`      | `2`         | `CR2C2_PXE_MAC`   | `CR2C2_IDRAC_MAC`   | `compute`     | `CR2C2_IDRAC_IPV4`  | `CR2C2_MODEL`     | `CR2C2_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C3_HOSTNAME`  | `CR2C3_SN`      | `3`         | `CR2C3_PXE_MAC`   | `CR2C3_IDRAC_MAC`   | `compute`     | `CR2C3_IDRAC_IPV4`  | `CR2C3_MODEL`     | `CR2C3_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C4_HOSTNAME`  | `CR2C4_SN`      | `4`         | `CR2C4_PXE_MAC`   | `CR2C4_IDRAC_MAC`   | `compute`     | `CR2C4_IDRAC_IPV4`  | `CR2C4_MODEL`     | `CR2C4_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C5_HOSTNAME`  | `CR2C5_SN`      | `5`         | `CR2C5_PXE_MAC`   | `CR2C5_IDRAC_MAC`   | `compute`     | `CR2C5_IDRAC_IPV4`  | `CR2C5_MODEL`     | `CR2C5_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C6_HOSTNAME`  | `CR2C6_SN`      | `6`         | `CR2C6_PXE_MAC`   | `CR2C6_IDRAC_MAC`   | `compute`     | `CR2C6_IDRAC_IPV4`  | `CR2C6_MODEL`     | `CR2C6_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C7_HOSTNAME`  | `CR2C7_SN`      | `7`         | `CR2C7_PXE_MAC`   | `CR2C7_IDRAC_MAC`   | `compute`     | `CR2C7_IDRAC_IPV4`  | `CR2C7_MODEL`     | `CR2C7_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C8_HOSTNAME`  | `CR2C8_SN`      | `8`         | `CR2C8_PXE_MAC`   | `CR2C8_IDRAC_MAC`   | `compute`     | `CR2C8_IDRAC_IPV4`  | `CR2C8_MODEL`     | `CR2C8_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C9_HOSTNAME`  | `CR2C9_SN`      | `9`         | `CR2C9_PXE_MAC`   | `CR2C9_IDRAC_MAC`   | `compute`     | `CR2C9_IDRAC_IPV4`  | `CR2C9_MODEL`     | `CR2C9_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C10_HOSTNAME` | `CR2C10_SN`     | `10`        | `CR2C10_PXE_MAC`  | `CR2C10_IDRAC_MAC`  | `compute`     | `CR2C10_IDRAC_IPV4` | `CR2C10_MODEL`    | `CR2C10_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C11_HOSTNAME` | `CR2C11_SN`     | `11`        | `CR2C11_PXE_MAC`  | `CR2C11_IDRAC_MAC`  | `compute`     | `CR2C11_IDRAC_IPV4` | `CR2C11_MODEL`    | `CR2C11_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C12_HOSTNAME` | `CR2C12_SN`     | `12`        | `CR2C12_PXE_MAC`  | `CR2C12_IDRAC_MAC`  | `compute`     | `CR2C12_IDRAC_IPV4` | `CR2C12_MODEL`    | `CR2C12_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C13_HOSTNAME` | `CR2C13_SN`     | `13`        | `CR2C13_PXE_MAC`  | `CR2C13_IDRAC_MAC`  | `compute`     | `CR2C13_IDRAC_IPV4` | `CR2C13_MODEL`    | `CR2C13_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C14_HOSTNAME` | `CR2C14_SN`     | `14`        | `CR2C14_PXE_MAC`  | `CR2C14_IDRAC_MAC`  | `compute`     | `CR2C14_IDRAC_IPV4` | `CR2C14_MODEL`    | `CR2C14_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C15_HOSTNAME` | `CR2C15_SN`     | `15`        | `CR2C15_PXE_MAC`  | `CR2C15_IDRAC_MAC`  | `compute`     | `CR2C15_IDRAC_IPV4` | `CR2C15_MODEL`    | `CR2C15_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2C16_HOSTNAME` | `CR2C16_SN`     | `16`        | `CR2C16_PXE_MAC`  | `CR2C16_IDRAC_MAC`  | `compute`     | `CR2C16_IDRAC_IPV4` | `CR2C16_MODEL`    | `CR2C16_IDRAC_IPV6` |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2M1_HOSTNAME`  | `CR2M1_SN`      | `17`        | `CR2M1_PXE_MAC`   | `CR2M1_IDRAC_MAC`   | `mgmt server` | `CR2M1_IDRAC_IPV4`  | `CR2M1_MODEL`     | `CR2M1_IDRAC_IPV6`  |
   | `CR2_NAME`        | `CR2_LOCATION`  | `CR2M2_HOSTNAME`  | `CR2M2_SN`      | `18`        | `CR2M2_PXE_MAC`   | `CR2M2_IDRAC_MAC`   | `mgmt server` | `CR2M2_IDRAC_IPV4`  | `CR2M2_MODEL`     | `CR2M2_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C1_HOSTNAME`  | `CR3C1_SN`      | `1`         | `CR3C1_PXE_MAC`   | `CR3C1_IDRAC_MAC`   | `compute`     | `CR3C1_IDRAC_IPV4`  | `CR3C1_MODEL`     | `CR3C1_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C2_HOSTNAME`  | `CR3C2_SN`      | `2`         | `CR3C2_PXE_MAC`   | `CR3C2_IDRAC_MAC`   | `compute`     | `CR3C2_IDRAC_IPV4`  | `CR3C2_MODEL`     | `CR3C2_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C3_HOSTNAME`  | `CR3C3_SN`      | `3`         | `CR3C3_PXE_MAC`   | `CR3C3_IDRAC_MAC`   | `compute`     | `CR3C3_IDRAC_IPV4`  | `CR3C3_MODEL`     | `CR3C3_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C4_HOSTNAME`  | `CR3C4_SN`      | `4`         | `CR3C4_PXE_MAC`   | `CR3C4_IDRAC_MAC`   | `compute`     | `CR3C4_IDRAC_IPV4`  | `CR3C4_MODEL`     | `CR3C4_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C5_HOSTNAME`  | `CR3C5_SN`      | `5`         | `CR3C5_PXE_MAC`   | `CR3C5_IDRAC_MAC`   | `compute`     | `CR3C5_IDRAC_IPV4`  | `CR3C5_MODEL`     | `CR3C5_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C6_HOSTNAME`  | `CR3C6_SN`      | `6`         | `CR3C6_PXE_MAC`   | `CR3C6_IDRAC_MAC`   | `compute`     | `CR3C6_IDRAC_IPV4`  | `CR3C6_MODEL`     | `CR3C6_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C7_HOSTNAME`  | `CR3C7_SN`      | `7`         | `CR3C7_PXE_MAC`   | `CR3C7_IDRAC_MAC`   | `compute`     | `CR3C7_IDRAC_IPV4`  | `CR3C7_MODEL`     | `CR3C7_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C8_HOSTNAME`  | `CR3C8_SN`      | `8`         | `CR3C8_PXE_MAC`   | `CR3C8_IDRAC_MAC`   | `compute`     | `CR3C8_IDRAC_IPV4`  | `CR3C8_MODEL`     | `CR3C8_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C9_HOSTNAME`  | `CR3C9_SN`      | `9`         | `CR3C9_PXE_MAC`   | `CR3C9_IDRAC_MAC`   | `compute`     | `CR3C9_IDRAC_IPV4`  | `CR3C9_MODEL`     | `CR3C9_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C10_HOSTNAME` | `CR3C10_SN`     | `10`        | `CR3C10_PXE_MAC`  | `CR3C10_IDRAC_MAC`  | `compute`     | `CR3C10_IDRAC_IPV4` | `CR3C10_MODEL`    | `CR3C10_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C11_HOSTNAME` | `CR3C11_SN`     | `11`        | `CR3C11_PXE_MAC`  | `CR3C11_IDRAC_MAC`  | `compute`     | `CR3C11_IDRAC_IPV4` | `CR3C11_MODEL`    | `CR3C11_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C12_HOSTNAME` | `CR3C12_SN`     | `12`        | `CR3C12_PXE_MAC`  | `CR3C12_IDRAC_MAC`  | `compute`     | `CR3C12_IDRAC_IPV4` | `CR3C12_MODEL`    | `CR3C12_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C13_HOSTNAME` | `CR3C13_SN`     | `13`        | `CR3C13_PXE_MAC`  | `CR3C13_IDRAC_MAC`  | `compute`     | `CR3C13_IDRAC_IPV4` | `CR3C13_MODEL`    | `CR3C13_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C14_HOSTNAME` | `CR3C14_SN`     | `14`        | `CR3C14_PXE_MAC`  | `CR3C14_IDRAC_MAC`  | `compute`     | `CR3C14_IDRAC_IPV4` | `CR3C14_MODEL`    | `CR3C14_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C15_HOSTNAME` | `CR3C15_SN`     | `15`        | `CR3C15_PXE_MAC`  | `CR3C15_IDRAC_MAC`  | `compute`     | `CR3C15_IDRAC_IPV4` | `CR3C15_MODEL`    | `CR3C15_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3C16_HOSTNAME` | `CR3C16_SN`     | `16`        | `CR3C16_PXE_MAC`  | `CR3C16_IDRAC_MAC`  | `compute`     | `CR3C16_IDRAC_IPV4` | `CR3C16_MODEL`    | `CR3C16_IDRAC_IPV6` |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3M1_HOSTNAME`  | `CR3M1_SN`      | `17`        | `CR3M1_PXE_MAC`   | `CR3M1_IDRAC_MAC`   | `mgmt server` | `CR3M1_IDRAC_IPV4`  | `CR3M1_MODEL`     | `CR3M1_IDRAC_IPV6`  |
   | `CR3_NAME`        | `CR3_LOCATION`  | `CR3M2_HOSTNAME`  | `CR3M2_SN`      | `18`        | `CR3M2_PXE_MAC`   | `CR3M2_IDRAC_MAC`   | `mgmt server` | `CR3M2_IDRAC_IPV4`  | `CR3M2_MODEL`     | `CR3M2_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C1_HOSTNAME`  | `CR4C1_SN`      | `1`         | `CR4C1_PXE_MAC`   | `CR4C1_IDRAC_MAC`   | `compute`     | `CR4C1_IDRAC_IPV4`  | `CR4C1_MODEL`     | `CR4C1_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C2_HOSTNAME`  | `CR4C2_SN`      | `2`         | `CR4C2_PXE_MAC`   | `CR4C2_IDRAC_MAC`   | `compute`     | `CR4C2_IDRAC_IPV4`  | `CR4C2_MODEL`     | `CR4C2_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C3_HOSTNAME`  | `CR4C3_SN`      | `3`         | `CR4C3_PXE_MAC`   | `CR4C3_IDRAC_MAC`   | `compute`     | `CR4C3_IDRAC_IPV4`  | `CR4C3_MODEL`     | `CR4C3_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C4_HOSTNAME`  | `CR4C4_SN`      | `4`         | `CR4C4_PXE_MAC`   | `CR4C4_IDRAC_MAC`   | `compute`     | `CR4C4_IDRAC_IPV4`  | `CR4C4_MODEL`     | `CR4C4_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C5_HOSTNAME`  | `CR4C5_SN`      | `5`         | `CR4C5_PXE_MAC`   | `CR4C5_IDRAC_MAC`   | `compute`     | `CR4C5_IDRAC_IPV4`  | `CR4C5_MODEL`     | `CR4C5_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C6_HOSTNAME`  | `CR4C6_SN`      | `6`         | `CR4C6_PXE_MAC`   | `CR4C6_IDRAC_MAC`   | `compute`     | `CR4C6_IDRAC_IPV4`  | `CR4C6_MODEL`     | `CR4C6_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C7_HOSTNAME`  | `CR4C7_SN`      | `7`         | `CR4C7_PXE_MAC`   | `CR4C7_IDRAC_MAC`   | `compute`     | `CR4C7_IDRAC_IPV4`  | `CR4C7_MODEL`     | `CR4C7_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C8_HOSTNAME`  | `CR4C8_SN`      | `8`         | `CR4C8_PXE_MAC`   | `CR4C8_IDRAC_MAC`   | `compute`     | `CR4C8_IDRAC_IPV4`  | `CR4C8_MODEL`     | `CR4C8_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C9_HOSTNAME`  | `CR4C9_SN`      | `9`         | `CR4C9_PXE_MAC`   | `CR4C9_IDRAC_MAC`   | `compute`     | `CR4C9_IDRAC_IPV4`  | `CR4C9_MODEL`     | `CR4C9_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C10_HOSTNAME` | `CR4C10_SN`     | `10`        | `CR4C10_PXE_MAC`  | `CR4C10_IDRAC_MAC`  | `compute`     | `CR4C10_IDRAC_IPV4` | `CR4C10_MODEL`    | `CR4C10_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C11_HOSTNAME` | `CR4C11_SN`     | `11`        | `CR4C11_PXE_MAC`  | `CR4C11_IDRAC_MAC`  | `compute`     | `CR4C11_IDRAC_IPV4` | `CR4C11_MODEL`    | `CR4C11_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C12_HOSTNAME` | `CR4C12_SN`     | `12`        | `CR4C12_PXE_MAC`  | `CR4C12_IDRAC_MAC`  | `compute`     | `CR4C12_IDRAC_IPV4` | `CR4C12_MODEL`    | `CR4C12_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C13_HOSTNAME` | `CR4C13_SN`     | `13`        | `CR4C13_PXE_MAC`  | `CR4C13_IDRAC_MAC`  | `compute`     | `CR4C13_IDRAC_IPV4` | `CR4C13_MODEL`    | `CR4C13_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C14_HOSTNAME` | `CR4C14_SN`     | `14`        | `CR4C14_PXE_MAC`  | `CR4C14_IDRAC_MAC`  | `compute`     | `CR4C14_IDRAC_IPV4` | `CR4C14_MODEL`    | `CR4C14_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C15_HOSTNAME` | `CR4C15_SN`     | `15`        | `CR4C15_PXE_MAC`  | `CR4C15_IDRAC_MAC`  | `compute`     | `CR4C15_IDRAC_IPV4` | `CR4C15_MODEL`    | `CR4C15_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4C16_HOSTNAME` | `CR4C16_SN`     | `16`        | `CR4C16_PXE_MAC`  | `CR4C16_IDRAC_MAC`  | `compute`     | `CR4C16_IDRAC_IPV4` | `CR4C16_MODEL`    | `CR4C16_IDRAC_IPV6` |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4M1_HOSTNAME`  | `CR4M1_SN`      | `17`        | `CR4M1_PXE_MAC`   | `CR4M1_IDRAC_MAC`   | `mgmt server` | `CR4M1_IDRAC_IPV4`  | `CR4M1_MODEL`     | `CR4M1_IDRAC_IPV6`  |
   | `CR4_NAME`        | `CR4_LOCATION`  | `CR4M2_HOSTNAME`  | `CR4M2_SN`      | `18`        | `CR4M2_PXE_MAC`   | `CR4M2_IDRAC_MAC`   | `mgmt server` | `CR4M2_IDRAC_IPV4`  | `CR4M2_MODEL`     | `CR4M2_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C1_HOSTNAME`  | `CR5C1_SN`      | `1`         | `CR5C1_PXE_MAC`   | `CR5C1_IDRAC_MAC`   | `compute`     | `CR5C1_IDRAC_IPV4`  | `CR5C1_MODEL`     | `CR5C1_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C2_HOSTNAME`  | `CR5C2_SN`      | `2`         | `CR5C2_PXE_MAC`   | `CR5C2_IDRAC_MAC`   | `compute`     | `CR5C2_IDRAC_IPV4`  | `CR5C2_MODEL`     | `CR5C2_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C3_HOSTNAME`  | `CR5C3_SN`      | `3`         | `CR5C3_PXE_MAC`   | `CR5C3_IDRAC_MAC`   | `compute`     | `CR5C3_IDRAC_IPV4`  | `CR5C3_MODEL`     | `CR5C3_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C4_HOSTNAME`  | `CR5C4_SN`      | `4`         | `CR5C4_PXE_MAC`   | `CR5C4_IDRAC_MAC`   | `compute`     | `CR5C4_IDRAC_IPV4`  | `CR5C4_MODEL`     | `CR5C4_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C5_HOSTNAME`  | `CR5C5_SN`      | `5`         | `CR5C5_PXE_MAC`   | `CR5C5_IDRAC_MAC`   | `compute`     | `CR5C5_IDRAC_IPV4`  | `CR5C5_MODEL`     | `CR5C5_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C6_HOSTNAME`  | `CR5C6_SN`      | `6`         | `CR5C6_PXE_MAC`   | `CR5C6_IDRAC_MAC`   | `compute`     | `CR5C6_IDRAC_IPV4`  | `CR5C6_MODEL`     | `CR5C6_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C7_HOSTNAME`  | `CR5C7_SN`      | `7`         | `CR5C7_PXE_MAC`   | `CR5C7_IDRAC_MAC`   | `compute`     | `CR5C7_IDRAC_IPV4`  | `CR5C7_MODEL`     | `CR5C7_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C8_HOSTNAME`  | `CR5C8_SN`      | `8`         | `CR5C8_PXE_MAC`   | `CR5C8_IDRAC_MAC`   | `compute`     | `CR5C8_IDRAC_IPV4`  | `CR5C8_MODEL`     | `CR5C8_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C9_HOSTNAME`  | `CR5C9_SN`      | `9`         | `CR5C9_PXE_MAC`   | `CR5C9_IDRAC_MAC`   | `compute`     | `CR5C9_IDRAC_IPV4`  | `CR5C9_MODEL`     | `CR5C9_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C10_HOSTNAME` | `CR5C10_SN`     | `10`        | `CR5C10_PXE_MAC`  | `CR5C10_IDRAC_MAC`  | `compute`     | `CR5C10_IDRAC_IPV4` | `CR5C10_MODEL`    | `CR5C10_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C11_HOSTNAME` | `CR5C11_SN`     | `11`        | `CR5C11_PXE_MAC`  | `CR5C11_IDRAC_MAC`  | `compute`     | `CR5C11_IDRAC_IPV4` | `CR5C11_MODEL`    | `CR5C11_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C12_HOSTNAME` | `CR5C12_SN`     | `12`        | `CR5C12_PXE_MAC`  | `CR5C12_IDRAC_MAC`  | `compute`     | `CR5C12_IDRAC_IPV4` | `CR5C12_MODEL`    | `CR5C12_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C13_HOSTNAME` | `CR5C13_SN`     | `13`        | `CR5C13_PXE_MAC`  | `CR5C13_IDRAC_MAC`  | `compute`     | `CR5C13_IDRAC_IPV4` | `CR5C13_MODEL`    | `CR5C13_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C14_HOSTNAME` | `CR5C14_SN`     | `14`        | `CR5C14_PXE_MAC`  | `CR5C14_IDRAC_MAC`  | `compute`     | `CR5C14_IDRAC_IPV4` | `CR5C14_MODEL`    | `CR5C14_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C15_HOSTNAME` | `CR5C15_SN`     | `15`        | `CR5C15_PXE_MAC`  | `CR5C15_IDRAC_MAC`  | `compute`     | `CR5C15_IDRAC_IPV4` | `CR5C15_MODEL`    | `CR5C15_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5C16_HOSTNAME` | `CR5C16_SN`     | `16`        | `CR5C16_PXE_MAC`  | `CR5C16_IDRAC_MAC`  | `compute`     | `CR5C16_IDRAC_IPV4` | `CR5C16_MODEL`    | `CR5C16_IDRAC_IPV6` |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5M1_HOSTNAME`  | `CR5M1_SN`      | `17`        | `CR5M1_PXE_MAC`   | `CR5M1_IDRAC_MAC`   | `mgmt server` | `CR5M1_IDRAC_IPV4`  | `CR5M1_MODEL`     | `CR5M1_IDRAC_IPV6`  |
   | `CR5_NAME`        | `CR5_LOCATION`  | `CR5M2_HOSTNAME`  | `CR5M2_SN`      | `18`        | `CR5M2_PXE_MAC`   | `CR5M2_IDRAC_MAC`   | `mgmt server` | `CR5M2_IDRAC_IPV4`  | `CR5M2_MODEL`     | `CR5M2_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C1_HOSTNAME`  | `CR6C1_SN`      | `1`         | `CR6C1_PXE_MAC`   | `CR6C1_IDRAC_MAC`   | `compute`     | `CR6C1_IDRAC_IPV4`  | `CR6C1_MODEL`     | `CR6C1_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C2_HOSTNAME`  | `CR6C2_SN`      | `2`         | `CR6C2_PXE_MAC`   | `CR6C2_IDRAC_MAC`   | `compute`     | `CR6C2_IDRAC_IPV4`  | `CR6C2_MODEL`     | `CR6C2_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C3_HOSTNAME`  | `CR6C3_SN`      | `3`         | `CR6C3_PXE_MAC`   | `CR6C3_IDRAC_MAC`   | `compute`     | `CR6C3_IDRAC_IPV4`  | `CR6C3_MODEL`     | `CR6C3_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C4_HOSTNAME`  | `CR6C4_SN`      | `4`         | `CR6C4_PXE_MAC`   | `CR6C4_IDRAC_MAC`   | `compute`     | `CR6C4_IDRAC_IPV4`  | `CR6C4_MODEL`     | `CR6C4_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C5_HOSTNAME`  | `CR6C5_SN`      | `5`         | `CR6C5_PXE_MAC`   | `CR6C5_IDRAC_MAC`   | `compute`     | `CR6C5_IDRAC_IPV4`  | `CR6C5_MODEL`     | `CR6C5_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C6_HOSTNAME`  | `CR6C6_SN`      | `6`         | `CR6C6_PXE_MAC`   | `CR6C6_IDRAC_MAC`   | `compute`     | `CR6C6_IDRAC_IPV4`  | `CR6C6_MODEL`     | `CR6C6_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C7_HOSTNAME`  | `CR6C7_SN`      | `7`         | `CR6C7_PXE_MAC`   | `CR6C7_IDRAC_MAC`   | `compute`     | `CR6C7_IDRAC_IPV4`  | `CR6C7_MODEL`     | `CR6C7_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C8_HOSTNAME`  | `CR6C8_SN`      | `8`         | `CR6C8_PXE_MAC`   | `CR6C8_IDRAC_MAC`   | `compute`     | `CR6C8_IDRAC_IPV4`  | `CR6C8_MODEL`     | `CR6C8_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C9_HOSTNAME`  | `CR6C9_SN`      | `9`         | `CR6C9_PXE_MAC`   | `CR6C9_IDRAC_MAC`   | `compute`     | `CR6C9_IDRAC_IPV4`  | `CR6C9_MODEL`     | `CR6C9_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C10_HOSTNAME` | `CR6C10_SN`     | `10`        | `CR6C10_PXE_MAC`  | `CR6C10_IDRAC_MAC`  | `compute`     | `CR6C10_IDRAC_IPV4` | `CR6C10_MODEL`    | `CR6C10_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C11_HOSTNAME` | `CR6C11_SN`     | `11`        | `CR6C11_PXE_MAC`  | `CR6C11_IDRAC_MAC`  | `compute`     | `CR6C11_IDRAC_IPV4` | `CR6C11_MODEL`    | `CR6C11_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C12_HOSTNAME` | `CR6C12_SN`     | `12`        | `CR6C12_PXE_MAC`  | `CR6C12_IDRAC_MAC`  | `compute`     | `CR6C12_IDRAC_IPV4` | `CR6C12_MODEL`    | `CR6C12_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C13_HOSTNAME` | `CR6C13_SN`     | `13`        | `CR6C13_PXE_MAC`  | `CR6C13_IDRAC_MAC`  | `compute`     | `CR6C13_IDRAC_IPV4` | `CR6C13_MODEL`    | `CR6C13_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C14_HOSTNAME` | `CR6C14_SN`     | `14`        | `CR6C14_PXE_MAC`  | `CR6C14_IDRAC_MAC`  | `compute`     | `CR6C14_IDRAC_IPV4` | `CR6C14_MODEL`    | `CR6C14_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C15_HOSTNAME` | `CR6C15_SN`     | `15`        | `CR6C15_PXE_MAC`  | `CR6C15_IDRAC_MAC`  | `compute`     | `CR6C15_IDRAC_IPV4` | `CR6C15_MODEL`    | `CR6C15_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6C16_HOSTNAME` | `CR6C16_SN`     | `16`        | `CR6C16_PXE_MAC`  | `CR6C16_IDRAC_MAC`  | `compute`     | `CR6C16_IDRAC_IPV4` | `CR6C16_MODEL`    | `CR6C16_IDRAC_IPV6` |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6M1_HOSTNAME`  | `CR6M1_SN`      | `17`        | `CR6M1_PXE_MAC`   | `CR6M1_IDRAC_MAC`   | `mgmt server` | `CR6M1_IDRAC_IPV4`  | `CR6M1_MODEL`     | `CR6M1_IDRAC_IPV6`  |
   | `CR6_NAME`        | `CR6_LOCATION`  | `CR6M2_HOSTNAME`  | `CR6M2_SN`      | `18`        | `CR6M2_PXE_MAC`   | `CR6M2_IDRAC_MAC`   | `mgmt server` | `CR6M2_IDRAC_IPV4`  | `CR6M2_MODEL`     | `CR6M2_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C1_HOSTNAME`  | `CR7C1_SN`      | `1`         | `CR7C1_PXE_MAC`   | `CR7C1_IDRAC_MAC`   | `compute`     | `CR7C1_IDRAC_IPV4`  | `CR7C1_MODEL`     | `CR7C1_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C2_HOSTNAME`  | `CR7C2_SN`      | `2`         | `CR7C2_PXE_MAC`   | `CR7C2_IDRAC_MAC`   | `compute`     | `CR7C2_IDRAC_IPV4`  | `CR7C2_MODEL`     | `CR7C2_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C3_HOSTNAME`  | `CR7C3_SN`      | `3`         | `CR7C3_PXE_MAC`   | `CR7C3_IDRAC_MAC`   | `compute`     | `CR7C3_IDRAC_IPV4`  | `CR7C3_MODEL`     | `CR7C3_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C4_HOSTNAME`  | `CR7C4_SN`      | `4`         | `CR7C4_PXE_MAC`   | `CR7C4_IDRAC_MAC`   | `compute`     | `CR7C4_IDRAC_IPV4`  | `CR7C4_MODEL`     | `CR7C4_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C5_HOSTNAME`  | `CR7C5_SN`      | `5`         | `CR7C5_PXE_MAC`   | `CR7C5_IDRAC_MAC`   | `compute`     | `CR7C5_IDRAC_IPV4`  | `CR7C5_MODEL`     | `CR7C5_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C6_HOSTNAME`  | `CR7C6_SN`      | `6`         | `CR7C6_PXE_MAC`   | `CR7C6_IDRAC_MAC`   | `compute`     | `CR7C6_IDRAC_IPV4`  | `CR7C6_MODEL`     | `CR7C6_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C7_HOSTNAME`  | `CR7C7_SN`      | `7`         | `CR7C7_PXE_MAC`   | `CR7C7_IDRAC_MAC`   | `compute`     | `CR7C7_IDRAC_IPV4`  | `CR7C7_MODEL`     | `CR7C7_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C8_HOSTNAME`  | `CR7C8_SN`      | `8`         | `CR7C8_PXE_MAC`   | `CR7C8_IDRAC_MAC`   | `compute`     | `CR7C8_IDRAC_IPV4`  | `CR7C8_MODEL`     | `CR7C8_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C9_HOSTNAME`  | `CR7C9_SN`      | `9`         | `CR7C9_PXE_MAC`   | `CR7C9_IDRAC_MAC`   | `compute`     | `CR7C9_IDRAC_IPV4`  | `CR7C9_MODEL`     | `CR7C9_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C10_HOSTNAME` | `CR7C10_SN`     | `10`        | `CR7C10_PXE_MAC`  | `CR7C10_IDRAC_MAC`  | `compute`     | `CR7C10_IDRAC_IPV4` | `CR7C10_MODEL`    | `CR7C10_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C11_HOSTNAME` | `CR7C11_SN`     | `11`        | `CR7C11_PXE_MAC`  | `CR7C11_IDRAC_MAC`  | `compute`     | `CR7C11_IDRAC_IPV4` | `CR7C11_MODEL`    | `CR7C11_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C12_HOSTNAME` | `CR7C12_SN`     | `12`        | `CR7C12_PXE_MAC`  | `CR7C12_IDRAC_MAC`  | `compute`     | `CR7C12_IDRAC_IPV4` | `CR7C12_MODEL`    | `CR7C12_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C13_HOSTNAME` | `CR7C13_SN`     | `13`        | `CR7C13_PXE_MAC`  | `CR7C13_IDRAC_MAC`  | `compute`     | `CR7C13_IDRAC_IPV4` | `CR7C13_MODEL`    | `CR7C13_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C14_HOSTNAME` | `CR7C14_SN`     | `14`        | `CR7C14_PXE_MAC`  | `CR7C14_IDRAC_MAC`  | `compute`     | `CR7C14_IDRAC_IPV4` | `CR7C14_MODEL`    | `CR7C14_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C15_HOSTNAME` | `CR7C15_SN`     | `15`        | `CR7C15_PXE_MAC`  | `CR7C15_IDRAC_MAC`  | `compute`     | `CR7C15_IDRAC_IPV4` | `CR7C15_MODEL`    | `CR7C15_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7C16_HOSTNAME` | `CR7C16_SN`     | `16`        | `CR7C16_PXE_MAC`  | `CR7C16_IDRAC_MAC`  | `compute`     | `CR7C16_IDRAC_IPV4` | `CR7C16_MODEL`    | `CR7C16_IDRAC_IPV6` |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7M1_HOSTNAME`  | `CR7M1_SN`      | `17`        | `CR7M1_PXE_MAC`   | `CR7M1_IDRAC_MAC`   | `mgmt server` | `CR7M1_IDRAC_IPV4`  | `CR7M1_MODEL`     | `CR7M1_IDRAC_IPV6`  |
   | `CR7_NAME`        | `CR7_LOCATION`  | `CR7M2_HOSTNAME`  | `CR7M2_SN`      | `18`        | `CR7M2_PXE_MAC`   | `CR7M2_IDRAC_MAC`   | `mgmt server` | `CR7M2_IDRAC_IPV4`  | `CR7M2_MODEL`     | `CR7M2_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C1_HOSTNAME`  | `CR8C1_SN`      | `1`         | `CR8C1_PXE_MAC`   | `CR8C1_IDRAC_MAC`   | `compute`     | `CR8C1_IDRAC_IPV4`  | `CR8C1_MODEL`     | `CR8C1_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C2_HOSTNAME`  | `CR8C2_SN`      | `2`         | `CR8C2_PXE_MAC`   | `CR8C2_IDRAC_MAC`   | `compute`     | `CR8C2_IDRAC_IPV4`  | `CR8C2_MODEL`     | `CR8C2_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C3_HOSTNAME`  | `CR8C3_SN`      | `3`         | `CR8C3_PXE_MAC`   | `CR8C3_IDRAC_MAC`   | `compute`     | `CR8C3_IDRAC_IPV4`  | `CR8C3_MODEL`     | `CR8C3_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C4_HOSTNAME`  | `CR8C4_SN`      | `4`         | `CR8C4_PXE_MAC`   | `CR8C4_IDRAC_MAC`   | `compute`     | `CR8C4_IDRAC_IPV4`  | `CR8C4_MODEL`     | `CR8C4_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C5_HOSTNAME`  | `CR8C5_SN`      | `5`         | `CR8C5_PXE_MAC`   | `CR8C5_IDRAC_MAC`   | `compute`     | `CR8C5_IDRAC_IPV4`  | `CR8C5_MODEL`     | `CR8C5_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C6_HOSTNAME`  | `CR8C6_SN`      | `6`         | `CR8C6_PXE_MAC`   | `CR8C6_IDRAC_MAC`   | `compute`     | `CR8C6_IDRAC_IPV4`  | `CR8C6_MODEL`     | `CR8C6_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C7_HOSTNAME`  | `CR8C7_SN`      | `7`         | `CR8C7_PXE_MAC`   | `CR8C7_IDRAC_MAC`   | `compute`     | `CR8C7_IDRAC_IPV4`  | `CR8C7_MODEL`     | `CR8C7_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C8_HOSTNAME`  | `CR8C8_SN`      | `8`         | `CR8C8_PXE_MAC`   | `CR8C8_IDRAC_MAC`   | `compute`     | `CR8C8_IDRAC_IPV4`  | `CR8C8_MODEL`     | `CR8C8_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C9_HOSTNAME`  | `CR8C9_SN`      | `9`         | `CR8C9_PXE_MAC`   | `CR8C9_IDRAC_MAC`   | `compute`     | `CR8C9_IDRAC_IPV4`  | `CR8C9_MODEL`     | `CR8C9_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C10_HOSTNAME` | `CR8C10_SN`     | `10`        | `CR8C10_PXE_MAC`  | `CR8C10_IDRAC_MAC`  | `compute`     | `CR8C10_IDRAC_IPV4` | `CR8C10_MODEL`    | `CR8C10_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C11_HOSTNAME` | `CR8C11_SN`     | `11`        | `CR8C11_PXE_MAC`  | `CR8C11_IDRAC_MAC`  | `compute`     | `CR8C11_IDRAC_IPV4` | `CR8C11_MODEL`    | `CR8C11_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C12_HOSTNAME` | `CR8C12_SN`     | `12`        | `CR8C12_PXE_MAC`  | `CR8C12_IDRAC_MAC`  | `compute`     | `CR8C12_IDRAC_IPV4` | `CR8C12_MODEL`    | `CR8C12_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C13_HOSTNAME` | `CR8C13_SN`     | `13`        | `CR8C13_PXE_MAC`  | `CR8C13_IDRAC_MAC`  | `compute`     | `CR8C13_IDRAC_IPV4` | `CR8C13_MODEL`    | `CR8C13_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C14_HOSTNAME` | `CR8C14_SN`     | `14`        | `CR8C14_PXE_MAC`  | `CR8C14_IDRAC_MAC`  | `compute`     | `CR8C14_IDRAC_IPV4` | `CR8C14_MODEL`    | `CR8C14_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C15_HOSTNAME` | `CR8C15_SN`     | `15`        | `CR8C15_PXE_MAC`  | `CR8C15_IDRAC_MAC`  | `compute`     | `CR8C15_IDRAC_IPV4` | `CR8C15_MODEL`    | `CR8C15_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8C16_HOSTNAME` | `CR8C16_SN`     | `16`        | `CR8C16_PXE_MAC`  | `CR8C16_IDRAC_MAC`  | `compute`     | `CR8C16_IDRAC_IPV4` | `CR8C16_MODEL`    | `CR8C16_IDRAC_IPV6` |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8M1_HOSTNAME`  | `CR8M1_SN`      | `17`        | `CR8M1_PXE_MAC`   | `CR8M1_IDRAC_MAC`   | `mgmt server` | `CR8M1_IDRAC_IPV4`  | `CR8M1_MODEL`     | `CR8M1_IDRAC_IPV6`  |
   | `CR8_NAME`        | `CR8_LOCATION`  | `CR8M2_HOSTNAME`  | `CR8M2_SN`      | `18`        | `CR8M2_PXE_MAC`   | `CR8M2_IDRAC_MAC`   | `mgmt server` | `CR8M2_IDRAC_IPV4`  | `CR8M2_MODEL`     | `CR8M2_IDRAC_IPV6`  |

### [Network Devices](#tab/nework-devices)

   | RACK NAME         | RACK LOCATION   | HOSTNAME             | SERIAL NUMBER   | FUNCTION          | DEVICE LABEL       | IP ADDRESS       | IPV6 ADDRESS     | HW VERSION         | HW VENDOR             | HW MODEL             | RACK TYPE   |
   | ----------------- | --------------- | -------------------- | --------------- | ----------------- | ------------------ | ---------------- | ---------------- | ------------------ | --------------------- | -------------------- | ------------- |
   | `AGGR_NAME`       | `AGGR_LOC`      | `CE1_HOSTNAME`       | `CE1_SN`        | `ce`              | `CE1`              | `CE1_IPV4`       | `CE1_IPV6`       | `CE1_HW_VER`       | `CE1_HW_VENDOR`       | `CE1_HW_MODEL`       | `AggrRack`  |
   | `AGGR_NAME`       | `AGGR_LOC`      | `CE2_HOSTNAME`       | `CE2_SN`        | `ce`              | `CE2`              | `CE2_IPV4`       | `CE2_IPV6`       | `CE2_HW_VER`       | `CE2_HW_VENDOR`       | `CE2_HW_MODEL`       | `AggrRack`  |
   | `AGGR_NAME`       | `AGGR_LOC`      | `AGG_MGMT1_HOSTNAME` | `AGG_MGMT1_SN`  | `oam-switch`      | `MGMT Switch1`     | `AGG_MGMT1_IPV4` | `AGG_MGMT1_IPV6` | `AGG_MGMT1_HW_VER` | `AGG_MGMT1_HW_VENDOR` | `AGG_MGMT1_HW_MODEL` | `AggrRack`  |
   | `AGGR_NAME`       | `AGGR_LOC`      | `AGG_MGMT2_HOSTNAME` | `AGG_MGMT2_SN`  | `oam-switch`      | `MGMT Switch2`     | `AGG_MGMT2_IPV4` | `AGG_MGMT2_IPV6` | `AGG_MGMT2_HW_VER` | `AGG_MGMT2_HW_VENDOR` | `AGG_MGMT2_HW_MODEL` | `AggrRack`  |
   | `AGGR_NAME`       | `AGGR_LOC`      | `TS_HOSTNAME`        | `TS_SN`         | `terminal server` | `Terminal Server1` | `TS_IPV4`        | `TS_IPV6`        | `TS_HW_VER`        | `TS_HW_VENDOR`        | `TS_HW_MODEL`        | `AggrRack`  |
   | `CR1_NAME`        | `CR1_LOC`       | `CR1_TOR1_HOSTNAME`  | `CR1_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR1_TOR1_IPV4`  | `CR1_TOR1_IPV6`  | `CR1_TOR1_HW_VER`  | `CR1_TOR1_HW_VENDOR`  | `CR1_TOR1_HW_MODEL`  | `CompRack1` |
   | `CR1_NAME`        | `CR1_LOC`       | `CR1_TOR2_HOSTNAME`  | `CR1_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR1_TOR2_IPV4`  | `CR1_TOR2_IPV6`  | `CR1_TOR2_HW_VER`  | `CR1_TOR2_HW_VENDOR`  | `CR1_TOR2_HW_MODEL`  | `CompRack1` |
   | `CR2_NAME`        | `CR2_LOC`       | `CR2_TOR1_HOSTNAME`  | `CR2_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR2_TOR1_IPV4`  | `CR2_TOR1_IPV6`  | `CR2_TOR1_HW_VER`  | `CR2_TOR1_HW_VENDOR`  | `CR2_TOR1_HW_MODEL`  | `CompRack2` |
   | `CR2_NAME`        | `CR2_LOC`       | `CR2_TOR2_HOSTNAME`  | `CR2_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR2_TOR2_IPV4`  | `CR2_TOR2_IPV6`  | `CR2_TOR2_HW_VER`  | `CR2_TOR2_HW_VENDOR`  | `CR2_TOR2_HW_MODEL`  | `CompRack2` |
   | `CR3_NAME`        | `CR3_LOC`       | `CR3_TOR1_HOSTNAME`  | `CR3_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR3_TOR1_IPV4`  | `CR3_TOR1_IPV6`  | `CR3_TOR1_HW_VER`  | `CR3_TOR1_HW_VENDOR`  | `CR3_TOR1_HW_MODEL`  | `CompRack3` |
   | `CR3_NAME`        | `CR3_LOC`       | `CR3_TOR2_HOSTNAME`  | `CR3_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR3_TOR2_IPV4`  | `CR3_TOR2_IPV6`  | `CR3_TOR2_HW_VER`  | `CR3_TOR2_HW_VENDOR`  | `CR3_TOR2_HW_MODEL`  | `CompRack3` |
   | `CR4_NAME`        | `CR4_LOC`       | `CR4_TOR1_HOSTNAME`  | `CR4_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR4_TOR1_IPV4`  | `CR4_TOR1_IPV6`  | `CR4_TOR1_HW_VER`  | `CR4_TOR1_HW_VENDOR`  | `CR4_TOR1_HW_MODEL`  | `CompRack4` |
   | `CR4_NAME`        | `CR4_LOC`       | `CR4_TOR2_HOSTNAME`  | `CR4_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR4_TOR2_IPV4`  | `CR4_TOR2_IPV6`  | `CR4_TOR2_HW_VER`  | `CR4_TOR2_HW_VENDOR`  | `CR4_TOR2_HW_MODEL`  | `CompRack4` |
   | `CR5_NAME`        | `CR5_LOC`       | `CR5_TOR1_HOSTNAME`  | `CR5_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR5_TOR1_IPV4`  | `CR5_TOR1_IPV6`  | `CR5_TOR1_HW_VER`  | `CR5_TOR1_HW_VENDOR`  | `CR5_TOR1_HW_MODEL`  | `CompRack5` |
   | `CR5_NAME`        | `CR5_LOC`       | `CR5_TOR2_HOSTNAME`  | `CR5_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR5_TOR2_IPV4`  | `CR5_TOR2_IPV6`  | `CR5_TOR2_HW_VER`  | `CR5_TOR2_HW_VENDOR`  | `CR5_TOR2_HW_MODEL`  | `CompRack5` |
   | `CR6_NAME`        | `CR6_LOC`       | `CR6_TOR1_HOSTNAME`  | `CR6_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR6_TOR1_IPV4`  | `CR6_TOR1_IPV6`  | `CR6_TOR1_HW_VER`  | `CR6_TOR1_HW_VENDOR`  | `CR6_TOR1_HW_MODEL`  | `CompRack6` |
   | `CR6_NAME`        | `CR6_LOC`       | `CR6_TOR2_HOSTNAME`  | `CR6_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR6_TOR2_IPV4`  | `CR6_TOR2_IPV6`  | `CR6_TOR2_HW_VER`  | `CR6_TOR2_HW_VENDOR`  | `CR6_TOR2_HW_MODEL`  | `CompRack6` |
   | `CR7_NAME`        | `CR7_LOC`       | `CR7_TOR1_HOSTNAME`  | `CR7_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR7_TOR1_IPV4`  | `CR7_TOR1_IPV6`  | `CR7_TOR1_HW_VER`  | `CR7_TOR1_HW_VENDOR`  | `CR7_TOR1_HW_MODEL`  | `CompRack2` |
   | `CR7_NAME`        | `CR7_LOC`       | `CR7_TOR2_HOSTNAME`  | `CR7_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR7_TOR2_IPV4`  | `CR7_TOR2_IPV6`  | `CR7_TOR2_HW_VER`  | `CR7_TOR2_HW_VENDOR`  | `CR7_TOR2_HW_MODEL`  | `CompRack2` |
   | `CR8_NAME`        | `CR8_LOC`       | `CR8_TOR1_HOSTNAME`  | `CR8_TOR1_SN`   | `cp-tor`          | `TOR1`             | `CR8_TOR1_IPV4`  | `CR8_TOR1_IPV6`  | `CR8_TOR1_HW_VER`  | `CR8_TOR1_HW_VENDOR`  | `CR8_TOR1_HW_MODEL`  | `CompRack2` |
   | `CR8_NAME`        | `CR8_LOC`       | `CR8_TOR2_HOSTNAME`  | `CR8_TOR2_SN`   | `cp-tor`          | `TOR2`             | `CR8_TOR2_IPV4`  | `CR8_TOR2_IPV6`  | `CR8_TOR2_HW_VER`  | `CR8_TOR2_HW_VENDOR`  | `CR8_TOR2_HW_MODEL`  | `CompRack2` |
   | `CR1_NAME`        | `CR1_LOC`       | `CR1_MGMT_HOSTNAME`  | `CR1_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR1_MGMT_IPV4`  | `CR1_MGMT_IPV6`  | `CR1_MGMT_HW_VER`  | `CR1_MGMT_HW_VENDOR`  | `CR1_MGMT_HW_MODEL`  | `CompRack1` |
   | `CR2_NAME`        | `CR2_LOC`       | `CR2_MGMT_HOSTNAME`  | `CR2_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR2_MGMT_IPV4`  | `CR2_MGMT_IPV6`  | `CR2_MGMT_HW_VER`  | `CR2_MGMT_HW_VENDOR`  | `CR2_MGMT_HW_MODEL`  | `CompRack2` |
   | `CR3_NAME`        | `CR3_LOC`       | `CR3_MGMT_HOSTNAME`  | `CR3_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR3_MGMT_IPV4`  | `CR3_MGMT_IPV6`  | `CR3_MGMT_HW_VER`  | `CR3_MGMT_HW_VENDOR`  | `CR3_MGMT_HW_MODEL`  | `CompRack3` |
   | `CR4_NAME`        | `CR4_LOC`       | `CR4_MGMT_HOSTNAME`  | `CR4_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR4_MGMT_IPV4`  | `CR4_MGMT_IPV6`  | `CR4_MGMT_HW_VER`  | `CR4_MGMT_HW_VENDOR`  | `CR4_MGMT_HW_MODEL`  | `CompRack4` |
   | `CR5_NAME`        | `CR5_LOC`       | `CR5_MGMT_HOSTNAME`  | `CR5_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR5_MGMT_IPV4`  | `CR5_MGMT_IPV6`  | `CR5_MGMT_HW_VER`  | `CR5_MGMT_HW_VENDOR`  | `CR5_MGMT_HW_MODEL`  | `CompRack5` |
   | `CR6_NAME`        | `CR6_LOC`       | `CR6_MGMT_HOSTNAME`  | `CR6_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR6_MGMT_IPV4`  | `CR6_MGMT_IPV6`  | `CR6_MGMT_HW_VER`  | `CR6_MGMT_HW_VENDOR`  | `CR6_MGMT_HW_MODEL`  | `CompRack6` |
   | `CR7_NAME`        | `CR7_LOC`       | `CR7_MGMT_HOSTNAME`  | `CR7_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR7_MGMT_IPV4`  | `CR7_MGMT_IPV6`  | `CR7_MGMT_HW_VER`  | `CR7_MGMT_HW_VENDOR`  | `CR7_MGMT_HW_MODEL`  | `CompRack7` |
   | `CR8_NAME`        | `CR8_LOC`       | `CR8_MGMT_HOSTNAME`  | `CR8_MGMT_SN`   | `oam-switch`      | `MGMT Switch`      | `CR8_MGMT_IPV4`  | `CR8_MGMT_IPV6`  | `CR8_MGMT_HW_VER`  | `CR8_MGMT_HW_VENDOR`  | `CR8_MGMT_HW_MODEL`  | `CompRack8` |
   | `AGGR_NAME`       | `AGGR_LOC`      | `NPB1_HOSTNAME`      | `NPB1_SN`       | `npb`             | `NPB1`             | `NPB1_IPV4`      | `NPB1_IPV6`      | `NPB1_HW_VER`      | `NPB1_HW_VENDOR`      | `NPB1_HW_MODEL`      | `AggrRack`  |
   | `AGGR_NAME`       | `AGGR_LOC`      | `NPB2_HOSTNAME`      | `NPB2_SN`       | `npb`             | `NPB2`             | `NPB2_IPV4`      | `NPB2_IPV6`      | `NPB2_HW_VER`      | `NPB2_HW_VENDOR`      | `NPB2_HW_MODEL`      | `AggrRack`  |

### [Storage Arrays](#tab/storage-arrays)

   | RACK NAME         | RACK LOCATION      | HOSTNAME                | SERIAL NUMBER     | FUNCTION                   | USERNAME              | PASSWORD             |
   | ----------------- | ------------------ | ----------------------- | ----------------- | -------------------------- | --------------------- | -------------------- |
   | `STORAGE_RACK`    | `STORAGE_RACK_LOC` | `STORAGE_RACK_HOSTNAME` | `STORAGE_RACK_SN` | `iscsi storage controller` | `STORAGE_USER_SECRET` | `STORAGE_PWD_SECRET` |
