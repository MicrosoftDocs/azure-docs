---
title: TPM attestation overview for Azure
description: This article provides an overview of Trusted Platform Module (TPM) attestation and capabilities supported by Azure Attestation.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: TPM Attestation overview complete 
---

# Trusted Platform Module attestation

Devices with a Trusted Platform Module (TPM) can rely on attestation to prove that boot integrity isn't compromised along with using the Measured Boot process to detect early boot feature states.

A growing number of device types, bootloaders, and boot stack attacks require an attestation solution to evolve accordingly. An attested state of a device is driven by the attestation policy used to verify the contents on the platform evidence.

This article provides an overview of TPM attestation and capabilities supported by Azure Attestation.

## Overview

TPM attestation starts from validating the TPM itself all the way up to the point where a relying party can validate the boot flow.

In general, TPM attestation is based on the following pillars.

### Validate TPM authenticity

Validate the TPM authenticity by validating the TPM:

- Every TPM ships with a unique asymmetric key called the endorsement key (EK). This key is burned by the manufacturer. The public portion of this key is known as EKPub. The associated private key is known as EKPriv. Some TPM chips also have an EK certificate that's issued by the manufacturer for the EKPub. This certificate is known as EKCert.
- A certification authority (CA) establishes trust in the TPM either via EKPub or EKCert.
- A device proves to the CA that the key for which the certificate is being requested is cryptographically bound to the EKPub and that the TPM owns the EKPriv.
- The CA issues a certificate with a special issuance policy to denote that the key is now attested as protected by a TPM.

### Validate the measurements made during the boot

Validate the measurements made during the boot by using Azure Attestation:

- As part of Trusted Boot and Measured Boot, every step is validated and measured into the TPM. Different events are measured for different platforms. For more information about the Measured Boot process in Windows, see [Secure the Windows boot process](/windows/security/information-protection/secure-the-windows-10-boot-process).
- At boot, an attestation identity key is generated. It's used to provide cryptographic proof to the attestation service that the TPM in use was issued a certificate after EK validation was performed.
- Relying parties can perform an attestation against Azure Attestation, which can be used to validate measurements made during the boot process.
- A relying party can then rely on the attestation statement to gate access to resources or other actions.

![Diagram that shows the conceptual device attestation flow.](./media/device-tpm-attestation-flow.png)

Conceptually, TPM attestation can be visualized as shown in the preceding diagram. The relying party applies Azure Attestation to verify the integrity of the platform and any violation of promises. The verification process gives you the confidence to run workloads or provide access to resources.

## Protection from malicious boot attacks

Mature attack techniques aim to infect the boot chain. A boot attack can provide the attacker with access to system resources and allow the attacker to hide from antimalware software. Trusted Boot acts as the first order of defense. Use of Trusted Boot and attestation extends the capability to relying parties. Most attackers attempt to bypass secure boot or load an unwanted binary in the boot process.

Remote attestation allows the relying parties to verify the whole boot chain for any violation of promises. For example, the secure boot evaluation by the attestation service validates the values of the secure variables measured by UEFI.

Measured Boot instrumentation ensures cryptographically bound measurements can't be changed after they're made and that only a trusted component can make the measurement. For this reason, validating the secure variables is sufficient to ensure the enablement.

Azure Attestation signs the report to ensure the integrity of the attestation is also maintained to protect against man-in-the-middle attacks.

A simple policy can be used:

```
version=1.0;

authorizationrules { 
    => permit();
};


issuancerules
{
[type=="aikValidated", value==true]&& 
[type=="secureBootEnabled", value==true] => issue(type="PlatformAttested", value=true);
}

```

Sometimes it isn't sufficient to verify only one component in the boot. Verifying complementary features like code integrity or hypervisor-protected code integrity (HVCI) and System Guard Secure Launch adds to the protection profile of a device. You also need the ability to peer into the boot so that you can evaluate any violations and be confident about the platform.

The following example takes advantage of policy version 1.2 to verify details about secure boot, HVCI, and System Guard Secure Launch. It also verifies that an unwanted (malicious.sys) driver isn't loaded during the boot:

```
version=1.2;

authorizationrules { 
    => permit();
};


issuancerules
{

// Verify if secure boot is enabled
c:[type == "events", issuer=="AttestationService"] => add(type = "efiConfigVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_DRIVER_CONFIG' && ProcessedData.VariableGuid == '8BE4DF61-93CA-11D2-AA0D-00E098032B8C']"));
c:[type=="efiConfigVariables", issuer="AttestationPolicy"]=> add(type = "secureBootEnabled", value = JsonToClaimValue(JmesPath(c.value, "[?ProcessedData.UnicodeName == 'SecureBoot'] | length(@) == `1` && @[0].ProcessedData.VariableData == 'AQ'")));
![type=="secureBootEnabled", issuer=="AttestationPolicy"] => add(type="secureBootEnabled", value=false);

// HVCI
c:[type=="events", issuer=="AttestationService"] => add(type="srtmDrtmEventPcr", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == 12 || PcrIndex == 19)].ProcessedData.EVENT_TRUSTBOUNDARY"));
c:[type=="srtmDrtmEventPcr", issuer=="AttestationPolicy"] => add(type="hvciEnabledSet", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_VBS_HVCI_POLICY | @[?String == 'HypervisorEnforcedCodeIntegrityEnable'].Value")));
c:[type=="hvciEnabledSet", issuer=="AttestationPolicy"] => issue(type="hvciEnabled", value=ContainsOnlyValue(c.value, 1));
![type=="hvciEnabled", issuer=="AttestationPolicy"] => issue(type="hvciEnabled", value=false);

// System Guard Secure Launch

// Validating unwanted(malicious.sys) driver is not loaded
c:[type=="events", issuer=="AttestationService"] => add(type="boolProperties", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == 12 || PcrIndex == 13 || PcrIndex == 19 || PcrIndex == 20)].ProcessedData.EVENT_TRUSTBOUNDARY"));
c:[type=="boolProperties", issuer=="AttestationPolicy"] => issue(type="MaliciousDriverLoaded", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_LOADEDMODULE_AGGREGATION[] | [? EVENT_IMAGEVALIDATED == true && (equals_ignore_case(EVENT_FILEPATH, '\windows\system32\drivers\malicious.sys') || equals_ignore_case(EVENT_FILEPATH, '\windows\system32\drivers\wd\malicious.sys'))] | @ != null")));
![type=="MaliciousDriverLoaded", issuer=="AttestationPolicy"] => issue(type="MaliciousDriverLoaded", value=false);

};
```

## Next steps

- [Device Health Attestation on Windows and interacting with Azure Attestation](/windows/client-management/mdm/healthattestation-csp#windows-11-device-health-attestation)
- [Learn more about claim rule grammar](claim-rule-grammar.md)
- [Attestation policy claim rule functions](claim-rule-functions.md)
