---
title: Edge Secured-core Certification Requirements
description: Edge Secured-core Certification program requirements
author: cbroad
ms.author: cbroad
ms.topic: conceptual 
ms.date: 05/15/2021
ms.custom: Edge Secured-core Certification Requirements
ms.service: certification
---


### Requirements ###

---
|Name|SecuredCore.Built-in.Security|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to make sure devices can report security information and events by sending data to Azure Defender for IoT.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation	|Device must generate security logs and alerts. Device logs and alerts messages to Azure Security Center.<ol><li>Download and deploy security agent from GitHub</li><li>Validate alert message from Azure Defender for IoT.</li></ol>|
|Resources|[Azure Docs IoT Defender for IoT](../defender-for-iot/how-to-configure-agent-based-solution.md)|

---
|Name|SecuredCore.Encryption.Storage|
|:---|:---|
|Status|Required|
|Description|The purpose of the test to validate that sensitive data can be encrypted on non-volatile storage.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure storage encryption is enabled and default algorithm is XTS-AES, with key length 128 bits or higher.|
|Resources||
