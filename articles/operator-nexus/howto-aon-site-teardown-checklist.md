---
title: "Azure Operator Nexus: How to teardown Azure Operator Nexus instance"
description: Checklist for all major steps to be executed for successful site teardown in Azure Operator Nexus
author: Tony Yam
ms.author: tonyyam
ms.service: azure-operator-nexus
ms.custom: azure-operator-nexus, devx-track-azurecli
ms.topic: how-to
ms.date: 12/03/2024
# ms.custom: template-include
---

# Check list for Azure Operator Nexus instance teardown
This how-to guide provide an outline of the checklist of all essential steps required for a site teardown in Azure Operator Nexus.

## High-Level cleanup check list
Note: Please follow the order of this checklist to properly cleanup all resources of the Azure Operator Instance

1) Perform Tenant cleanup HAKS/NAKS/Networks
2) Delete all Cluster networks (CSN, DCN, Internal, External, Trunked) resources
3) Delete all L3 Internal/External networks
4) Disable/Delete L3 ISD resources
5) Delete Keysets resources
6) Delete Cluster resource
7) Delete Cluster Manager resource
8) Disable/Delete L2 ISD resources
9) Reset all IDRAC creds to default  (Optional)
10) Deprovision Fabric
11) Delete NNI resources
12) Delete AON Fabric resource
13) Put devices into ZTP/Disable DHCP
14) Reset TS credentials to default (Optional)
15) Delete Jumpbox/NFC Cluster Vnet/IP (Optional)
16) Delete Network Fabric Controller (NFC) resource


## Support and questions
For further technical questions or assistance, please [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade). For more information about Support plans, see [Azure Support plans](https://azure.microsoft.com/support/plans/response/).