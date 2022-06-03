---
title: TPM attestation overview for Azure
description: TPM Attestation overview
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 04/05/2022
ms.author: prsriva
ms.custom: TPM Attestation overview complete 
---

# Trusted Platform Module (TPM) Attestation

Devices with a TPM, can rely on attestation to prove that boot integrity isn't compromised along with using the measured boot to detect early boot feature states. A growing number of device types, bootloaders and boot stack attacks require an attestation solution to evolve accordingly. An attested state of a device is driven by the attestation policy used to verify the contents on the platform evidence. This document provides an overview of TPM attestation and capabilities supported by MAA.

## Overview

TPM attestation starts from validating the TPM itself all the way up to the point where a relying party can validate the boot flow.

In general, TPM attestation is based on the following pillars:

### Validate TPM authenticity

Validate the TPM authenticity by validating the TPM.

- Every TPM ships with a unique asymmetric key, called the Endorsement Key (EK), burned by the manufacturer. We refer to the public portion of this key as EKPub and the associated private key as EKPriv. Some TPM chips also have an EK certificate that is issued by the manufacturer for the EKPub. We refer to this cert as EKCert.
- A CA establishes trust in the TPM either via EKPub or EKCert.
- A device proves to the CA that the key for which the certificate is being requested is cryptographically bound to the EKPub and that the TPM owns the EKpriv.
- The CA issues a certificate with a special issuance policy to denote that the key is now attested to be protected by a TPM.

### Validate the measurements made during the boot

Validate the measurements made during the boot using the Azure Attestation service.

- As part of Trusted and Measured boot, every step of the boot is validated and measured into the TPM. Different events are measured for different platforms. More information about the measured boot process in Windows can be found [here](/windows/security/information-protection/secure-the-windows-10-boot-process).
- At boot, an Attestation Identity Key is generated which is used to provide a cryptographic proof to the attestation service that the TPM in use has been issued a cert after EK validation was performed.
- Relying parties can perform an attestation against the Azure Attestation service, which can be used to validate measurements made during the boot process.
- A relying party can then rely on the attestation statement to gate access to resources or other actions.

![Conceptual device attestation flow](./media/device-tpm-attestation-flow.png)

Conceptually, TPM attestation can be visualized as above, where the relying party applies Azure Attestation service to verify the platform(s) integrity and any violation of promises, providing the confidence to run workloads or provide access to resources.

## Protection from malicious boot attacks

Mature attacks techniques aim to infect the boot chain, as it can provide the attacker access to system resources while allowing it the capability of hiding from anti-malware software. Trusted boot acts as the first order of defense and extending the capability to be used by relying parties is trusted boot and attestation. Most attackers attempt to bypass secureboot or load an unwanted binary in the boot process.

Remote Attestation lets the relying parties verify the whole boot chain for any violation of promises. Consider the Secure Boot evaluation by the attestation service that validates the values of the secure variables measured by UEFI.

Measured boot instrumentation ensures the cryptographically bound measurements can't be changed once they are made and also only a trusted component can make the measurement. Hence, validating the secure variables is sufficient to ensure the enablement.

Azure Attestation additionally signs the report to ensure the integrity of the attestation is also maintained protecting against Man in the Middle type of attacks.

A simple policy can be used as below.

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

Sometimes it's not sufficient to only verify one single component in the boot but verifying complimenting features like Code Integrity(or HVCI), System Guard Secure Launch, also add to the protection profile of a device. More so the ability the peer into the boot to evaluate any violations is also needed to ensure confidence can be gained on a platform.

Consider one such policy that takes advantage of the policy version 1.2 to verify details about secureboot, HVCI, System Guard Secure Launch and also verifying that an unwanted(malicious.sys) driver isn't loaded during the boot.

```
version=1.2;

authorizationrules { 
    => permit();
};


issuancerules
{

// Verify if secureboot is enabled
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
- [Learn more about the Claim Rule Grammar](claim-rule-grammar.md)
- [Attestation policy claim rule functions](claim-rule-functions.md)
