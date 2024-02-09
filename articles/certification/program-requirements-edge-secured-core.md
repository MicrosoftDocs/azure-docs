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

::: zone pivot="platform-windows"

## Windows IoT OS Support
Edge Secured-core requires a version of Windows IoT that has at least 5 years of support from Microsoft remaining in its support lifecycle, at time of certification such as:
* [Windows 10 IoT Enterprise Lifecycle](/lifecycle/products/windows-10-iot-enterprise)
* [Windows 10 IoT Enterprise LTSC 2021 Lifecycle](/lifecycle/products/windows-10-iot-enterprise-ltsc-2021)
* [Windows 11 IoT Enterprise Lifecycle](/lifecycle/products/windows-11-iot-enterprise)

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

|Name|SecuredCore.Hardware.Identity|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the device identity is rooted in hardware. |
|Requirements dependency|TPM v2.0 device|

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that DMA isn't enabled on externally accessible ports. If DMA capable external ports exist, IOMMU or SMMU must be enabled and configured for those ports. |
|Requirements dependency|Only if DMA capable ports exist|

---
</br>

|Name|SecuredCore.Firmware.Protection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that device has adequate mitigations from Firmware security threats through DRTM + UEFI Management mode.|
|Requirements dependency|DRTM + UEFI|
|Resources| <ul><li>https://trustedcomputinggroup.org/</li><li>[Intel's DRTM based computing whitepaper](https://www.intel.com/content/dam/www/central-libraries/us/en/documents/drtm-based-computing-whitepaper.pdf)</li><li>[AMD Security whitepaper](https://www.amd.com/system/files/documents/amd-security-white-paper.pdf)</li></ul> |

---
</br>

|Name|SecuredCore.Firmware.SecureBoot|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the boot integrity of the device. UEFI Secure boot must be enabled to validate the firmware and kernel signatures every time the device boots.|
|Requirements dependency|UEFI|

---
</br>

|Name|SecuredCore.Firmware.Attestation|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that the device can remotely attest to Microsoft Azure Attestation Service with collected platform boot logs and measurements of boot activity.|
|Requirements dependency|Azure Attestation Service|
|Resources| [Microsoft Azure Attestation](../attestation/index.yml) |

---

## Windows IoT configuration requirements
---
</br>

|Name|SecuredCore.Encryption.Storage|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that sensitive data can be encrypted on nonvolatile storage.|

---
</br>

|Name|SecuredCore.Encryption.TLS|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate support for a minimum TLS version of 1.2 and supports the following required TLS cipher suites.<ul><li>TLS_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_RSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</li></ul>|
|Requirements dependency|Windows 10 IoT Enterprise Version 1903 or greater. Note: other requirements might require greater versions for other services. |
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> [TLS Cipher suites in Windows 10](/windows/win32/secauthn/tls-cipher-suites-in-windows-10-v1903) |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate that code integrity is available on this device.|
|Requirements dependency|HVCI is enabled on the device.|
|Resources| [Hypervisor-protected Code Integrity enablement](/windows-hardware/design/device-experiences/oem-hvci-enablement) |

---
</br>

|Name|SecuredCore.Protection.NetworkServices|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that services listening for input from the network aren't running with elevated privileges. Exceptions may apply for security-related services.|

---

## Windows IoT Software/Service Requirements
---
</br>

|Name|SecuredCore.Built-in.Security|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to make sure devices can report security information and events by sending security logs and alerts to a cloud-native security monitoring solution such as Microsoft Defender for Endpoint. |
|Resources|[Azure Docs Defender for Endpoint]( https://learn.microsoft.com/microsoft-365/security/defender-endpoint/configure-endpoints-script)|

---
</br>

|Name|SecuredCore.Protection.Baselines|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that the system is able to apply a baseline security configuration.|

|Name|SecuredCore.Protection.Update Resiliency|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that the device can be restored to the last known good state in the case of an update causing issues.|
|Resources| https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines <br> https://www.cisecurity.org/cis-benchmarks/ |


## Windows IoT Policy Requirements

|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that debug functionality on the device is disabled.|

---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate the device against ability to perform a reset (remove user data, remove user configs).|

---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that software updates will be provided for at least 60 months from date of submission.|

---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product.|
|Resources| https://msrc.microsoft.com/report/vulnerability/new |

---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|

---
</br>

::: zone-end
::: zone pivot="platform-linux"

## Linux OS Support
>[!Note]
> Linux is not yet supported. The below represent expected requirements. Please fill out this [form](https://forms.office.com/r/HSAtk0Ghru) if you are interested in certifying a Linux device, including device HW and OS specs, and whether or not it meets each of the draft requirements below.

## Linux Hardware/Firmware Requirements

---
|Name|SecuredCore.Hardware.Identity|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the device identify is rooted in hardware.|
|Requirements dependency|TPM v2.0 </br><sup>or *other supported method</sup>|

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that memory integrity helps protect the device from vulnerable peripherals. Memory regions for peripherals must be gated with hardware/firmware such as memory region domain controllers or SMMU (System Memory Management Unit).|

---
</br>


|Name|SecuredCore.Firmware.Protection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that the device has adequate mitigations from Firmware security threats through one of the following approaches: <ul><li>Approved firmware that does SRTM + runtime firmware hardening</li><li>Firmware scanning and evaluation by approved Microsoft third party</li></ul>|
|Resources| [Trusted Computing Group](https://trustedcomputinggroup.org/) |

---
</br>

|Name|SecuredCore.Firmware.SecureBoot|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the boot integrity of the device. Firmware and kernel signatures need to be validated every time the device boots.<ul><li>UEFI: Secure boot is enabled</li><li>Uboot: Verified boot is enabled</li></ul>|

---
</br>

|Name|SecuredCore.Firmware.Attestation|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure the device can remotely attest to the Microsoft Azure Attestation service through collected platform boot logs and applicable runtime measurements.|
|Dependency|TPM 2.0 </br><sup>or *supported OP-TEE based application chained to a HWRoT (Secure Element or Secure Enclave)</sup>|
|Resources| [Microsoft Azure Attestation](../attestation/index.yml) </br> Certification portal test includes an attestation client that when combined with the TPM 2.0 can validate the Microsoft Azure Attestation service.|

---
</br>

|Name|SecuredCore.Hardware.SecureEnclave|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement to validate the existence of a secure enclave and that the enclave can be used for security functions.|

## Linux Configuration Requirements

---
|Name|SecuredCore.Encryption.Storage|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement to validate that sensitive data can be encrypted on nonvolatile storage. Storage encryption needs to be enabled and default algorithm is XTS-AES with key length 128 bits or higher.|

---
</br>

|Name|SecuredCore.Encryption.TLS|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate support for a minimum TLS version of 1.2 and the following required TLS cipher suites.<ul><li>TLS_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_RSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_DHE_RSA_WITH_AES_128_GCM_SHA256</li><li>TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256</li><li>TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256</li></ul>|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate that authorized code runs with least privilege. Code integrity is enabled by dm-verify and IMA.|

---
</br>

|Name|SecuredCore.Protection.NetworkServices|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that applications accepting input from the network aren't running with elevated privileges such as SYSTEM or root privileges.|

## Linux Software/Service Requirements
---
|Name|SecuredCore.Built-in.Security|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to make sure devices can report security information and events by sending security logs and alerts to a cloud-native security monitoring solution such as Microsoft Defender for Endpoint.|
|Resources|[Azure Docs Defender for Endpoint](../defender-for-iot/how-to-configure-agent-based-solution.md)|

---
</br>

|Name|SecuredCore.Manageability.Configuration|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that device supports auditing and setting of system configuration (and certain management actions such as reboot) through Azure. Note: Use of other system management toolchains (for example, Ansible, etc.) by operators are not prohibited, but the device must include the azure-osconfig agent such that it's ready to be managed from Azure.|
|Dependency|azure-osconfig|

---
</br>

|Name|SecuredCore.Update|
|:---|:---|
|Status|Audit|
|Description|The purpose of the requirement is to validate the device can receive and update its firmware and software through Azure Device Update or other approved services.|

---
</br>

|Name|SecuredCore.UpdateResiliency|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the device can be restored to the last known good state in the case of an update causing issues.|

---
</br>

|Name|SecuredCore.Protection.Baselines|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that the system is able to apply a baseline security configuration.|
|Dependency|azure-osconfig|
|Resources|<ul><li>https://techcommunity.microsoft.com/t5/microsoft-security-baselines/bg-p/Microsoft-Security-Baselines</li><li>https://www.cisecurity.org/cis-benchmarks/</li><li>https://learn.microsoft.com/en-us/azure/governance/policy/samples/guest-configuration-baseline-linux</li></ul>|

---
</br>

|Name|SecuredCore.Protection.SignedUpdates|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that updates to the operating system, drivers, application software, libraries, packages and firmware must be signed.|


## Linux Policy Requirements
---
|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that debug functionality on the device is disabled or requires authorization to enable.|

---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate the device against the ability to perform a reset (remove user data, remove user configs).|

---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that updates will be provided for at least 60 months from date of submission.|

---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product.|

---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available.|

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
|Name|SecuredCore.Hardware.Identity|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the device identity is rooted in hardware. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Hardware.MemoryProtection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that memory integrity helps protect the device from vulnerable peripherals. This requirement is met by Microsoft for Azure Sphere based products.|

</br>

---
|Name|SecuredCore.Firmware.Protection|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure that device has adequate mitigations from Firmware security threats. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Firmware.SecureBoot|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the boot integrity of the device. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Firmware.Attestation|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to ensure the device can remotely attest to a Microsoft Azure Attestation service. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Hardware.SecureEnclave|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate hardware security that is accessible from a secure operating system. This requirement is met by Microsoft for Azure Sphere based products.|

## Azure Sphere OS Configuration Requirements

---
|Name|SecuredCore.Encryption.Storage|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate that sensitive data can be encrypted on nonvolatile storage. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Encryption.TLS|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate support for required TLS versions and cipher suites. This requirement is met by Microsoft for Azure Sphere based products.|
|Resources| [TLS support in IoT Hub](../iot-hub/iot-hub-tls-support.md) <br /> |

---
</br>

|Name|SecuredCore.Protection.CodeIntegrity|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate that authorized code runs with least privilege. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Protection.NetworkServices|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that applications accepting input from the network aren't running with elevated privileges. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Protection.NetworkFirewall|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate that applications can't connect to endpoints that haven't been authorized. This requirement is met by Microsoft for Azure Sphere based products.|

## Azure Sphere Software/Service Requirements
---
|Name|SecuredCore.Built-in.Security|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to make sure devices can report security information and events by sending data to a Microsoft telemetry service. This requirement is met by Microsoft for Azure Sphere based products.|
|Resources|[Collect and interpret error data - Azure Sphere](/azure-sphere/deployment/interpret-error-data?tabs=cliv2beta)</br>[Configure crash dumps - Azure Sphere](/azure-sphere/deployment/configure-crash-dumps)|

---
</br>

|Name|SecuredCore.Manageability.Configuration|
|:---|:---|
|Status|Required|
|Description|The purpose of this requirement is to validate the device supports remote administration via service-based configuration control. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Update|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate the device can receive and update its firmware and software. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Protection.Baselines|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that the system conforms to a baseline security configuration. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Protection.SignedUpdates|
|:---|:---|
|Status|Required|
|Description|The purpose of the requirement is to validate that updates must be signed. This requirement is met by Microsoft for Azure Sphere based products.|

## Azure Sphere Policy Requirements
---
|Name|SecuredCore.Policy.Protection.Debug|
|:---|:---|
|Status|Required|
|Description|The purpose of the policy requires that debug functionality on the device is disabled. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Policy.Manageability.Reset|
|:---|:---|
|Status|Required|
|Description|The policy requires that the device can execute two use cases: a) Ability to perform a reset (remove user data, remove user configurations), b) Restore device to last known good in the case of an update causing issues. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Policy.Updates.Duration|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that the device remains secure. This requirement is met by Microsoft for Azure Sphere based products.|

---
</br>

|Name|SecuredCore.Policy.Vuln.Disclosure|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that there's a mechanism for collecting and distributing reports of vulnerabilities in the product. Azure Sphere vulnerabilities are collected by Microsoft through MSRC and are published to customers through the Tech Community Blog, Azure Sphere “What’s New” page, and through Mitre’s CVE database.|
|Resources|<ul><li>[Report an issue and submission guidelines](https://www.microsoft.com/msrc/faqs-report-an-issue)</li><li>[What's new - Azure Sphere](/azure-sphere/product-overview/whats-new)</li><li>[Azure Sphere CVEs](/azure-sphere/deployment/azure-sphere-cves)</li></ul>|

---
</br>

|Name|SecuredCore.Policy.Vuln.Fixes|
|:---|:---|
|Status|Required|
|Description|The purpose of this policy is to ensure that vulnerabilities that are high/critical (using CVSS 3.0) are addressed within 180 days of the fix being available. This requirement is met by Microsoft for Azure Sphere based products.|



</br>
::: zone-end
