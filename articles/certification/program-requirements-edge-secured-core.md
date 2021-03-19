---
title: Edge Secured-core Certification Requirements
description: Edge Secured-core Certification program requirements
author: cbroad
ms.author: cbroad
ms.topic: overview 
ms.date: 03/15/2021
ms.custom: Edge Secured-core Certification Requirements
ms.service: iot-pnp
---

# Azure Certified Device - Edge Secured-core (Preview) #

## Edge Secured-Core Certification Requirements ##

This document outlines the device specific capabilities and requirements that will be met in order to complete certification and list a device in the Azure IoT Device catalog with the Edge Secured-core label.

### Program Purpose ###
Edge Secured-core is an incremental certification in the Azure Certified Device program for IoT devices running a full operating system, such as Linux or Windows 10 IoT.This program enables device partners to differentiate their devices by meeting an additional set of security criteria. Devices meeting this criteria enable these promises:
1. Hardware-based device identity 
2. Capable of enforcing system integrity 
3. Stays up to date and is remotely manageable
4. Provides data at-rest protection
5. Provides data in-transit protection
6. Built in security agent and hardening
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
|Validation	|Device must generate security logs and alerts. Device logs and alerts messages to Azure Security Center.<ol><li>Download and deploy security agent from Github</li><li>Validate alert message from Azure Defender for IoT.</li></ol>|
|Resources|[Azure Docs IoT Defender for IoT](../defender-for-iot/how-to-configure-agent-based-solution.md)|

---
|Name|SecuredCore.Encryption.Storage|
|:---|:---|
|Status|Required|
|Description|The purpose of the test to validate that sensitive data can be encrypted on non-volitile storage.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure storage encryption is enabled and default algorithm is XTS-AES, with key length 128 bits or higher.|
|Resources||

---
|Name|SecuredCore.Hardware.SecureEnclave|
|:---|:---|
|Status|Optional|
|Description|The purpose of the test to validate the existence of a secure enclave and that the enclave is accessible from a secure agent.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure the Azure Security Agent can communicate with the secure enclave|
|Resources|https://github.com/openenclave/openenclave/blob/master/samples/BuildSamplesLinux.md|

---
|Name|SecuredCore.Hardware.Identity|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate the device identify is rooted in hardware.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that the device has a TPM present and that it can be provisioned through IoT Hub using TPM endorsement key.|
|Resources|[Setup auto provisioning with DPS](../iot-dps/quick-setup-auto-provision)|

---
|Name|SecuredCore.Update|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate the device can receive and update its firmware and software.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Partner confirmation that they were able to send an update to the device through Microsoft update, Azure Device update, or other approved services.|
|Resources|[Device Update for IoT Hub](../iot-hub-device-update.md)|

---
|Name|SecuredCore.Manageability.Configuration|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate the devices support remote security management.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure the device supports the ability to be remotely manageable and specifically security configurations. And the status is reported back to IoT Hub/Azure Defender for IoT.|
|Resources||

---
|Name|SecuredCore.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The purpose of this test is to validate the device against two use cases: a) Ability to perform a reset (remove user data, remove user configs), b) Restore device to last known good in the case of an update causing issues.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through a combination of toolset and submitted documentation that the device supports this functionality. The device manufacturer can determine whether to implement these capabilities to support remote reset or only local reset.|
|Resources||

---
|Name|SecuredCore.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that the device remains secure.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual|
|Validation|Commitment from submission that devices certified will be required to keep devices up to date for 60 months from date of submission. Specifications available to the purchaser and devices itself in some manner should indicate the duration for which their software will be updated.|
|Resources||

---
|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there is a mechanism for collecting and distributing reports of vulnerabilities in the product.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|
|Resources||

---
|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|
|Resources||


---
|Name|SecuredCore.Encryption.TLS|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate support for required TLS versions and cipher suites.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
Validation|Device to be validated through toolset to ensure the device supports a minimum TLS version of 1.2 and supports the following required TLS cipher suites.<ul><li>TLS_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_RSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</li></ul>|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> [TLS Cipher suites in Windows 10](../../windows/win32/secauthn/tls-cipher-suites-in-windows-10-v1903) |

---
|Name|SecuredCore.Protection.SignedUpdates|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate that updates must be signed.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that updates to the operating system, drivers, application software, libraries, packages and firmware will not be applied unless properly signed and validated.
|Resources||

---
|Name|SecuredCore.Firmware.SecureBoot|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate the boot integrity of the device.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that firmware and kernel signatures are validated every time the device boots. <ul><li>UEFI: Secure boot is enabled</li><li>Uboot: Verified boot is enabled</li></ul>|
|Resources||

---
|Name|SecuredCore.Protection.CodeIntegrity|
|:---|:---|
|Status|Required|
|Description|The purpose of this test is to validate that code integrity is available on this device.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that code integrity is enabled. </br> Windows: HVCI </br> Linux: dm-verity and IMA|
|Resources||

---
|Name|SecuredCore.Protection.NetworkServices|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate that applications accepting input from the network are not running with elevated privledges.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that services accepting network connections are not running with SYSTEM or root privileges.|
|Resources||

---
|Name|SecuredCore.Protection.Baselines|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate that the system conforms to a baseline security configuration.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that Defender IOT system configurations benchmarks have been run.|
|Resources| https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines <br> https://www.cisecurity.org/cis-benchmarks/ |

---
|Name|SecuredCore.Firmware.Protection|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to ensure that device has adequate mitigations from Firmware security threats.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to confirm it is protected from firmware security threats through one of the following approaches: <ul><li>DRTM + UEFI Management Mode mitigations</li><li>DRTM + UEFI Management Mode hardening</li><li>Approved FW that does SRTM + runtime firmware hardening</li></ul> |
|Resources| https://trustedcomputinggroup.org/ |

---
|Name|SecuredCore.Firmware.Attestation|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to ensure the device can remotely attest to the Microsoft Azure Attestation service.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that platform boot logs and measurements of boot activity can be collected and remotely attested to the Microsoft Azure Attestation service.|
|Resources| [Microsoft Azure Attestation](../attestation.md) |

---
|Name|SecuredCore.Hardware.MemoryProtection|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate that DMA is not enabled on externally accessible ports.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|If DMA capable external ports exist on the device, toolset to validate that the IOMMU or SMMU is enabled and configured for those ports.|
|Resources||

---
|Name|SecuredCore.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the test is to validate that debug functionality on the device is disabled.|
|Target Availability|2021|
|Applies To|Any device|
|OS|Agnostic|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that debug functionality requires authorization to enable.|
|Resources||