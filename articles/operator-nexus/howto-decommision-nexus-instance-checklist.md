---
title: "Azure Operator Nexus: How to decommision Azure Operator Nexus instance checklist"
description: High-level checklist to cover all essential steps required for decommisioning Azure Operator Nexus instance
author: tonyyam23
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
# ms.custom: template-include
---

# Check list to decommission Azure Operator Nexus instance
This how-to guide provides a high-level checklist on the essential steps required to decommission an Azure Operator Nexus instance.

## High-Level site decommission check list
Note: Due to the underlying dependencies and references across these resources, follow the order of this checklist to ensure a smooth and efficient decommissioning of all Azure Operator Instance resources.

1) Perform Tenant clean up HAKS/NAKS/Networks
2) Delete all Cluster networks (CSN, DCN, Internal, External, Trunked) resources
3) Delete all L3 Internal/External networks
4) Disable/Delete L3 ISD resources
5) Delete Keysets resources
6) Delete Cluster resource
7) Delete Cluster Manager resource
8) Disable/Delete L2 ISD resources
9) Reset all iDRAC credential to default 
10) Deprovision Fabric
11) Delete NNI resources
12) Delete Fabric resource
13) Disable DHCP and put devices into ZTP mode
14) Reset Terminal Server (TS) credentials to default
15) Delete Jumpbox/NFC Cluster Vnet/IP
16) Delete Network Fabric Controller (NFC) resource


## Support and questions
For further technical questions or assistance, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).
