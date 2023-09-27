---
title: Edge Secured-core Certification Requirements
description: Edge Secured-core Certification program requirements
author: cbroad
ms.author: cbroad
ms.topic: conceptual 
ms.date: 06/21/2021
ms.custom: Edge Secured-core Certification Requirements
ms.service: certification
zone_pivot_groups: app-service-platform-windows-linux-sphere-rtos
---

# Azure Certified Device - Edge Secured-core #

## Edge Secured-Core certification requirements ##

### Program purpose ###
Edge Secured-core is an incremental certification in the Azure Certified Device program for IoT devices running a full operating system, such as Linux, Windows 10 IoT or Azure Sphere OS. This program enables device partners to differentiate their devices by meeting an additional set of security criteria. Devices meeting this criteria enable these promises:

1. Hardware-based device identity 
2. Capable of enforcing system integrity 
3. Stays up to date and is remotely manageable
4. Provides data at-rest protection
5. Provides data in-transit protection
6. Built in security agent and hardening


::: zone pivot="platform-windows"

## Windows IoT OS Support
Edge Secured-core for Windows IoT requires Windows 10 IoT Enterprise version 1903 or greater
* [Windows 10 IoT Enterprise Lifecycle](/lifecycle/products/windows-10-iot-enterprise)
> [!Note]
> The Windows secured-core tests require you to download and run the following package (https://aka.ms/Scforwiniot) from an Administrator Command Prompt on the IoT device being validated.

## Windows IoT Hardware/Firmware Requirements
> [!Note]
> Hardware must support and have the following enabled:
> * Intel or AMD virtualization extensions
> * Trusted Platform Module (TPM) 2.0
> * <b>For Intel systems:</b> Intel Virtualization Technology for Directed I/O (VT-d), Intel Trusted Execution Technology (TXT), and SINIT ACM driver package must be included in the Windows system image (for DRTM)
> * <b>For AMD systems:</b> AMD IOMMU and AMD-V virtualization, and SKINIT package must be integrated in the Windows system image (for DRTM)
> * Kernel DMA Protection (also known as Memory Access Protection)

---
</br>

|Name|SecuredCore.Hardware.Identity|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to validate the device identity is rooted in hardware and can be the primary authentication method with Azure IoT Hub Device Provisioning Service (DPS).|
|Requirements dependency|TPM v2.0 device|
|Validation Type|Manual/Tools|
|Validation|Devices are enrolled to DPS using the TPM authentication mechanism during testing.|
|Resources|Azure IoT Hub Device Provisioning Service: <ul><li>[Quickstart - Provision a simulated TPM device to Microsoft Azure IoT Hub](../iot-dps/quick-create-simulated-device-tpm.md) </li><li>[TPM Attestation Concepts](../iot-dps/concepts-tpm-attestation.md)</li></ul>|

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to validate that DMA isn't enabled on externally accessible ports.|
|Requirements dependency|Only if DMA capable ports exist|
|Validation Type|Manual/Tools|
|Validation|If DMA capable external ports exist on the device, toolset to validate that the IOMMU, or SMMU is enabled and configured for those ports.|


---
</br>

|Name|SecuredCore.Firmware.Protection|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to ensure that device has adequate mitigations from Firmware security threats.|
|Requirements dependency|DRTM + UEFI|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through [Edge Secured-core Agent](https://aka.ms/Scforwiniot) toolset to confirm it's protected from firmware security threats through one of the following approaches: <ul><li>DRTM + UEFI Management Mode mitigations</li><li>DRTM + UEFI Management Mode hardening</li></ul> |
|Resources| <ul><li>https://trustedcomputinggroup.org/</li><li>[Intel's DRTM based computing whitepaper](https://www.intel.com/content/dam/www/central-libraries/us/en/documents/drtm-based-computing-whitepaper.pdf)</li><li>[AMD Security whitepaper](https://www.amd.com/system/files/documents/amd-security-white-paper.pdf)</li></ul> |

---
</br>

|Name|SecuredCore.Firmware.SecureBoot|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to validate the boot integrity of the device.|
|Requirements dependency|UEFI|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through [Edge Secured-core Agent](https://aka.ms/Scforwiniot) toolset to ensure that firmware and kernel signatures are validated every time the device boots. <ul><li>UEFI: Secure boot is enabled</li></ul>|


---
</br>

|Name|SecuredCore.Firmware.Attestation|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to ensure the device can remotely attest to the Microsoft Azure Attestation service.|
|Requirements dependency|Azure Attestation Service|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that platform boot logs and measurements of boot activity can be collected and remotely attested to the Microsoft Azure Attestation service.|
|Resources| [Microsoft Azure Attestation](../attestation/index.yml) |

---

## Windows IoT configuration requirements
---
</br>

|Name|SecuredCore.Encryption.Storage|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement to validate that sensitive data can be encrypted on nonvolatile storage.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through [Edge Secured-core Agent](https://aka.ms/Scforwiniot) toolset to ensure Secure-boot and BitLocker is enabled and bound to PCR7.|


---
</br>

|Name|SecuredCore.Encryption.TLS|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to validate support for required TLS versions and cipher suites.|
|Requirements dependency|Windows 10 IoT Enterprise Version 1903 or greater. Note: other requirements may require greater versions for other services. |
|Validation Type|Manual/Tools|
Validation|Device to be validated through toolset to ensure the device supports a minimum TLS version of 1.2 and supports the following required TLS cipher suites.<ul><li>TLS_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_RSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</li></ul>|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> [TLS Cipher suites in Windows 10](/windows/win32/secauthn/tls-cipher-suites-in-windows-10-v1903) |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of this requirement is to validate that code integrity is available on this device.|
|Requirements dependency|HVCI is enabled on the device.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through [Edge Secured-core Agent](https://aka.ms/Scforwiniot) toolset to ensure that HVCI is enabled on the device.|
|Resources| [Hypervisor-protected Code Integrity enablement](/windows-hardware/design/device-experiences/oem-hvci-enablement) |

---
</br>

|Name|SecuredCore.Protection.NetworkServices|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2024|
|Description|The purpose of the requirement is to validate that services listening for input from the network aren't running with elevated privileges.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through [Edge Secured-core Agent](https://aka.ms/Scforwiniot) toolset to ensure that third party services accepting network connections aren't running with elevated LocalSystem and LocalService privileges. <ol><li>Exceptions may apply</li></ol>|


---

## Windows IoT Software/Service Requirements
---
</br>

|Name|SecuredCore.Built-in.Security|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|Future|Future|
|Description|The purpose of the requirement is to make sure devices can report security information and events by sending data to Azure Defender for IoT. <br>Note: Download and deploy security agent from GitHub|
|Target Availability|2022|
|Validation Type|Manual/Tools|
|Validation	|Device must generate security logs and alerts. Device logs and alerts messages to Azure Security Center.<ol><li>Device must have the Azure Defender microagent running</li><li>Configuration_Certification_Check must report TRUE in the module twin</li><li>Validate alert messages from Azure Defender for IoT.</li></ol>|
|Resources|[Azure Docs IoT Defender for IoT](../defender-for-iot/how-to-configure-agent-based-solution.md)|

---
</br>

|Name|SecuredCore.Protection.Baselines|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|Future|Future|
|Description|The purpose of the requirement is to validate that the system conforms to a baseline security configuration.|
|Target Availability|2022|
|Requirements dependency|Azure Defender for IoT|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that Defender IOT system configurations benchmarks have been run.|
|Resources| https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines <br> https://www.cisecurity.org/cis-benchmarks/ |

## Windows IoT Policy Requirements
---
Some requirements of this program are based on a business agreement between your company and Microsoft. The following requirements aren't validated through our test harness, but are required by your company in certifying the device.

---
</br>

|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that debug functionality on the device is disabled.|
|Requirements dependency||
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that debug functionality requires authorization to enable.|


---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate the device against two use cases: a) Ability to perform a reset (remove user data, remove user configs), b) Restore device to last known good in the case of an update causing issues.|
|Requirements dependency||
|Validation Type|Manual/Tools|
|Validation|Device to be validated through a combination of toolset and submitted documentation that the device supports this functionality. The device manufacturer can determine whether to implement these capabilities to support remote reset or only local reset.|


---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that the device remains secure.|
|Validation Type|Manual|
|Validation|Commitment from submission that devices certified can be kept up to date for 60 months from date of submission. Specifications available to the purchaser and devices itself in some manner should indicate the duration for which their software will be updated.|


---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product.|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|


---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|


---
</br>

::: zone-end
::: zone pivot="platform-linux"

## Linux OS Support
OS Support is determined through underlying requirements of Azure services and our ability to validate scenarios.

The Edge Secured-core program for Linux is enabled through the IoT Edge runtime, which is supported based on [Tier 1 and Tier 2 operating systems](../iot-edge/support.md).

## IoT Edge
Edge Secured-core validation on Linux based devices is executed through a container run on the IoT Edge runtime. For this reason, all devices that are certifying Edge Secured-core must have the IoT Edge runtime installed.

## Linux Hardware/Firmware Requirements
>[!Note]
> * Hardware must support TPM v2.0, SRTM, Secure-boot or UBoot.
> * Firmware will be submitted to Microsoft for vulnerability and configuration evaluation.


---
|Name|SecuredCore.Hardware.Identity|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate the device identify is rooted in hardware.|||
|Requirements dependency||TPM v2.0 device|TPM v2.0 </br><sup>or *other supported method</sup>|
|Validation Type|Manual/Tools|||
|Validation|Device to be validated through toolset to ensure that the device has a HWRoT present and that it can be provisioned through DPS using TPM or SE.|||
|Resources|[Setup auto provisioning with DPS](../iot-dps/quick-setup-auto-provision.md)|||

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate ensure that memory integrity helps protect the device from vulnerable peripherals.|
|Validation Type|Manual/Tools|
|Validation|memory regions for peripherals must be gated with hardware/firmware such as memory region domain controllers or SMMU (System memory management Unit).|


</br>

---
|Name|SecuredCore.Firmware.Protection|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to ensure that device has adequate mitigations from Firmware security threats.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to confirm it's protected from firmware security threats through one of the following approaches: <ul><li>Approved FW that does SRTM + runtime firmware hardening</li><li>Firmware scanning and evaluation by approved Microsoft third party</li></ul> |
|Resources| https://trustedcomputinggroup.org/ |

---
</br>

|Name|SecuredCore.Firmware.SecureBoot|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate the boot integrity of the device.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that firmware and kernel signatures are validated every time the device boots. <ul><li>UEFI: Secure boot is enabled</li><li>Uboot: Verified boot is enabled</li></ul>|


---
</br>

|Name|SecuredCore.Firmware.Attestation|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to ensure the device can remotely attest to the Microsoft Azure Attestation service.|
|Dependency||TPM 2.0|TPM 2.0 </br><sup>or *supported OP-TEE based application chained to a HWRoT (Secure Element or Secure Enclave)</sup>|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that platform boot logs and applicable runtime measurements can be collected and remotely attested to the Microsoft Azure Attestation service.|
|Resources| [Microsoft Azure Attestation](../attestation/index.yml) </br> Certification portal test includes an attestation client that when combined with the TPM 2.0 can validate the Microsoft Azure Attestation service.|

---
</br>

|Name|SecuredCore.Hardware.SecureEnclave|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|Future|Future|
|Description|The purpose of the requirement to validate the existence of a secure enclave and that the enclave can be used for security functions.|
|Validation Type|Manual/Tools|
|Validation||


## Linux Configuration Requirements

---
|Name|SecuredCore.Encryption.Storage|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement to validate that sensitive data can be encrypted on nonvolatile storage.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure storage encryption is enabled and default algorithm is XTS-AES, with key length 128 bits or higher.|


---
</br>

|Name|SecuredCore.Encryption.TLS|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate support for required TLS versions and cipher suites.|
|Validation Type|Manual/Tools|
Validation|Device to be validated through toolset to ensure the device supports a minimum TLS version of 1.2 and supports the following required TLS cipher suites.<ul><li>TLS_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_RSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</li></ul>|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of this requirement is to validate that authorized code runs with least privilege.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that code integrity is enabled by validating dm-verity and IMA|


---
</br>

|Name|SecuredCore.Protection.NetworkServices|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|<sup>*</sup>Required|2023|2023|
|Description|The purpose of the requirement is to validate that applications accepting input from the network aren't running with elevated privileges.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that services accepting network connections aren't running with SYSTEM or root privileges.|



## Linux Software/Service Requirements
---
|Name|SecuredCore.Built-in.Security|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to make sure devices can report security information and events by sending data to Microsoft Defender for IoT.|
|Validation Type|Manual/Tools|
|Validation	|<ol><li>Device must generate security logs and alerts.</li><li>Device logs and alerts messages to Azure Security Center.</li><li>Device must have the Azure Defender for IoT microagent running</li><li>Configuration_Certification_Check must report TRUE in the module twin</li><li>Validate alert messages from Azure Defender for IoT.</li></ol>|
|Resources|[Azure Docs IoT Defender for IoT](../defender-for-iot/how-to-configure-agent-based-solution.md)|

---
</br>

|Name|SecuredCore.Manageability.Configuration|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate that device supports auditing and setting of system configuration (and certain management actions such as reboot) through Azure.|
|Dependency|azure-osconfig|
|Validation Type|Manual/Tools|
|Validation|<ol><li>Device must report, via IoT Hub, its firewall state, firewall fingerprint, ip addresses, network adapter state, host name, hosts file, TPM (absence, or presence with version) and package manager sources (see What can I manage) </li><li>Device must accept the creation, via IoT Hub, of a default firewall policy (accept vs drop), and at least one firewall rule, with positive remote acknowledgment (see configurationStatus)</li><li>Device must accept the replacement of /etc/hosts file contents via IoT Hub, with positive remote acknowledgment (see https://learn.microsoft.com/en-us/azure/osconfig/howto-hosts?tabs=portal#the-object-model )</li><li>Device must accept and implement, via IoT Hub, remote reboot</li></ol> Note: Use of other system management toolchains (for example, Ansible, etc.) by operators are not prohibited, but the device must include the azure-osconfig agent such that it's ready to be managed from Azure.|


---
</br>

|Name|SecuredCore.Update|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Audit|2023|2023|
|Description|The purpose of the requirement is to validate the device can receive and update its firmware and software.|
|Validation Type|Manual/Tools|
|Validation|Partner confirmation that they were able to send an update to the device through Azure Device update and other approved services.|
|Resources|[Device Update for IoT Hub](../iot-hub-device-update/index.yml)|

---
</br>

|Name|SecuredCore.Protection.Baselines|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate the extent to which the device implements the Azure Security Baseline|
|Dependency|azure-osconfig|
|Validation Type|Manual/Tools|
|Validation|OSConfig is present on the device and reporting to what extent it implements the Azure Security Baseline.|
|Resources| <ul><li>https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines </li><li> https://www.cisecurity.org/cis-benchmarks/ </li><li>https://learn.microsoft.com/en-us/azure/governance/policy/samples/guest-configuration-baseline-linux|</li></ul>

---
</br>

|Name|SecuredCore.Protection.SignedUpdates|x86/AMD64|Arm64|
|:---|:---|:---|:---|
|Status|Required|2023|2023|
|Description|The purpose of the requirement is to validate that updates must be signed.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that updates to the operating system, drivers, application software, libraries, packages and firmware won't be applied unless properly signed and validated.




## Linux Policy Requirements
---
|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that debug functionality on the device is disabled.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through toolset to ensure that debug functionality requires authorization to enable.|


---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate the device against two use cases: a) Ability to perform a reset (remove user data, remove user configs), b) Restore device to last known good if an update causing issues.|
|Validation Type|Manual/Tools|
|Validation|Device to be validated through a combination of toolset and submitted documentation that the device supports this functionality. The device manufacturer can determine whether to implement these capabilities to support remote reset or only local reset.|


---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that the device remains secure.|
|Validation Type|Manual|
|Validation|Commitment from submission that devices certified will be required to keep devices up to date for 60 months from date of submission. Specifications available to the purchaser and devices itself in some manner should indicate the duration for which their software will be updated.|


---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product.|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|


---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|
|Validation Type|Manual|
|Validation|Documentation on the process for submitting and receiving vulnerability reports for the certified devices will be reviewed.|


</br>
::: zone-end
<!---------------------------------------------->
<!---------------------------------------------->
<!---------------------------------------------->
::: zone pivot="platform-sphere"

## Azure Sphere platform Support
The Mediatek MT3620AN must be included in your design. Additional guidance for building secured Azure Sphere applications can be within the [Azure Sphere application notes](/azure-sphere/app-notes/app-notes-overview).


## Azure Sphere Hardware/Firmware Requirements

---
|Name|SecuredCore.Hardware.Identity|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate the device identity is rooted in hardware.||
|Validation Type|Prevalidated, no additional validation is required||
|Validation|Provided by Microsoft||

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to ensure that memory integrity helps protect the device from vulnerable peripherals.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


</br>

---
|Name|SecuredCore.Firmware.Protection|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to ensure that device has adequate mitigations from Firmware security threats.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Firmware.SecureBoot|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate the boot integrity of the device.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Firmware.Attestation|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to ensure the device can remotely attest to a Microsoft Azure Attestation service.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Hardware.SecureEnclave|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to validate hardware security that is accessible from a secure operating system.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

## Azure Sphere OS Configuration Requirements

---
|Name|SecuredCore.Encryption.Storage|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to validate that sensitive data can be encrypted on nonvolatile storage.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|
|Resources|[Data at rest protection on Azure Sphere](/azure-sphere/app-notes/app-notes-overview)|

---
</br>

|Name|SecuredCore.Encryption.TLS|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate support for required TLS versions and cipher suites.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to validate that authorized code runs with least privilege.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

---
</br>

|Name|SecuredCore.Protection.NetworkServices|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate that applications accepting input from the network aren't running with elevated privileges.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

---
</br>

|Name|SecuredCore.Protection.NetworkFirewall|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to validate that applications can't connect to endpoints that haven't been authorized.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


## Azure Sphere Software/Service Requirements
---
|Name|SecuredCore.Built-in.Security|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to make sure devices can report security information and events by sending data to a Microsoft telemetry service.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|
|Resources|[Collect and interpret error data - Azure Sphere](/azure-sphere/deployment/interpret-error-data?tabs=cliv2beta)</br>[Configure crash dumps - Azure Sphere](/azure-sphere/deployment/configure-crash-dumps)|

---
</br>

|Name|SecuredCore.Manageability.Configuration|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of this requirement is to validate the device supports remote administration via service-based configuration control.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

---
</br>

|Name|SecuredCore.Update|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate the device can receive and update its firmware and software.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

---
</br>

|Name|SecuredCore.Protection.Baselines|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate that the system conforms to a baseline security configuration|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|

---
</br>

|Name|SecuredCore.Protection.SignedUpdates|Azure Sphere|
|:---|:---|:---|
|Status|Required|2023|
|Description|The purpose of the requirement is to validate that updates must be signed.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|



## Azure Sphere Policy Requirements
---
|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the policy requires that debug functionality on the device is disabled.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The policy requires that the device can execute two use cases: a) Ability to perform a reset (remove user data, remove user configurations), b) Restore device to last known good in the case of an update causing issues.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that the device remains secure.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Azure Sphere vulnerabilities are collected by Microsoft through MSRC and are published to customers through the Tech Community Blog, Azure Sphere “What’s New” page, and through Mitre’s CVE database.|
|Resources|<ul><li>[Report an issue and submission guidelines](https://www.microsoft.com/msrc/faqs-report-an-issue)</li><li>[What's new - Azure Sphere](/azure-sphere/product-overview/whats-new)</li><li>[Azure Sphere CVEs](/azure-sphere/deployment/azure-sphere-cves)</li></ul>|

---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|
|Validation Type|Prevalidated, no additional validation is required|
|Validation|Provided by Microsoft|


</br>
::: zone-end