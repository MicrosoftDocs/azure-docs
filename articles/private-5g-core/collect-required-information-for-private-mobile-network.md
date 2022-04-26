---
title: Collect information for your private mobile network
titleSuffix: Azure Private 5G Core Preview
description: This how-to guide shows how to collect the information you need to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 12/31/2021
ms.custom: template-how-to
---

# Collect the required information to deploy a private mobile network

This how-to guide takes you through the process of collecting the information you'll need to deploy a private mobile network through Azure Private 5G Core Preview using the Azure portal. You'll use this information to complete the steps in [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md).

## Prerequisites

You must have completed all of the steps in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).

## Collect Mobile Network resource values

Collect all of the following values for the Mobile Network resource that will represent your private mobile network.

   |Value  |Field name in Azure portal  |
   |---------|---------|
   |The Azure subscription to use to deploy the Mobile Network resource. You must use the same subscription for all resources in your private mobile network deployment. This is the subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md).                 |**Project details: Subscription**
   |The Azure resource group to use to deploy the Mobile Network resource. You should use a new resource group for this resource. It's useful to include the purpose of this resource group in its name for future identification (for example, *contoso-pmn-rg*).                |**Project details: Resource group**|
   |The name for the private mobile network.           |**Instance details: Mobile network name**|
   |The region in which you're deploying the private mobile network. We recommend you use the East US region.                         |**Instance details: Region**|
   |The mobile country code for the private mobile network.     |**Network configuration: Mobile country code (MCC)**|
   |The mobile network code for the private mobile network.     |**Network configuration: Mobile network code (MNC)**|

## Collect SIM values

Each SIM resource represents a physical SIM or eSIM that will be served by the private mobile network.

As part of creating your private mobile network, you can provision one or more SIMs that will use it. If you decide not to provision SIMs at this point, you can do so after deploying your private mobile network using the instructions in [Provision SIMs](provision-sims-azure-portal.md).

If you want to provision SIMs as part of deploying your private mobile network, you must choose one of the following provisioning methods:

- Manually entering values for each SIM into fields in the Azure portal. This option is best when provisioning a small number of SIMs.
- Importing a JSON file containing values for one or more SIM resources. This option is best when provisioning a large number of SIMs. The file format required for this JSON file is given in [Provision SIM resources through the Azure portal using a JSON file](#provision-sim-resources-through-the-azure-portal-using-a-json-file).

You must then collect each of the values given in the following table for each SIM resource you want to provision.

 |Value  |Field name in Azure portal  | JSON file parameter name |
   |---------|---------|---------|
   |The name for the SIM resource. This must only contain alphanumeric characters, dashes, and underscores. |**SIM name**|`simName`|
   |The Integrated Circuit Card Identification Number (ICCID). This identifies a specific physical SIM or eSIM, and includes information on the SIM's country and issuer. This is a unique numerical value between 19 and 20 digits in length, beginning with 89. |**ICCID**|`integratedCircuitCardIdentifier`|
   |The international mobile subscriber identity (IMSI). This is a unique number (usually 15 digits) identifying a device or user in a mobile network. |**IMSI**|`internationalMobileSubscriberIdentity`|
   |The Authentication Key (Ki). This is a unique 128-bit value assigned to the SIM by an operator, and is used in conjunction with the derived operator code (OPc) to authenticate a user. This must be a 32-character string, containing hexadecimal characters only. |**Ki**|`authenticationKey`|
   |The derived operator code (OPc). This is derived from the SIM's Ki and the network's operator code (OP), and is used by the packet core to authenticate a user using a standards-based algorithm. This must be a 32-character string, containing hexadecimal characters only. |**Opc**|`operatorKeyCode`|
   |The type of device that is using this SIM. This is an optional, free-form string. You can use it as required to easily identify device types that are using the enterprise's mobile networks. |**Device type**|`deviceType`|

### Provision SIM resources through the Azure portal using a JSON file

The following example shows the file format you'll need if you want to provision your SIM resources using a JSON file. It contains the parameters required to provision two SIMs (SIM1 and SIM2).

```json
[
 {
  "simName": "SIM1",
  "integratedCircuitCardIdentifier": "8912345678901234566",
  "internationalMobileSubscriberIdentity": "001019990010001",
  "authenticationKey": "00112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88737d",
  "deviceType": "Cellphone"
 },
 {
  "simName": "SIM2",
  "integratedCircuitCardIdentifier": "8922345678901234567",
  "internationalMobileSubscriberIdentity": "001019990010002",
  "authenticationKey": "11112233445566778899AABBCCDDEEFF",
  "operatorKeyCode": "63bfa50ee6523365ff14c1f45f88738d",
  "deviceType": "Sensor"
 }
]
```

## Next steps

You can now use the information you've collected to deploy your private mobile network.

- [Deploy a private mobile network - Azure portal](how-to-guide-deploy-a-private-mobile-network-azure-portal.md)
