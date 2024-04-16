---
title: Examples of an Azure TPM Attestation policy
description: Examples of Azure Attestation policy for TPM endpoint.
services: attestation
author: prsriva
ms.service: attestation
ms.topic: overview
ms.date: 10/12/2022
ms.author: prsriva


---
# Examples of an attestation policy for TPM endpoint

Attestation policy is used to process the attestation evidence and determine whether Azure Attestation will issue an attestation token. Attestation token generation can be controlled with custom policies. 

## Sample policy for TPM using Policy version 1.0

```
version=1.0;

authorizationrules { 
    => permit();
};

issuancerules
{
[type=="aikValidated", value==true]&& 
[type=="secureBootEnabled", value==true] &&
[type=="bootDebuggingDisabled", value==true] && 
[type=="vbsEnabled", value==true] && 
[type=="notWinPE", value==true] && 
[type=="notSafeMode", value==true] => issue(type="PlatformAttested", value=true);
};
```

A simple TPM attestation policy that can be used to verify minimal aspects of the boot.

## Sample policy for TPM using Policy version 1.2

The policy uses the TPM version to restrict attestation calls. The issuancerules looks at various properties measured during boot.

```
version=1.2;

configurationrules{
};

authorizationrules { 
	=> permit();
};

issuancerules{

c:[type == "aikValidated", issuer=="AttestationService"] =>issue(type="aikValidated", value=c.value);

// SecureBoot enabled 
c:[type == "events", issuer=="AttestationService"] => add(type = "efiConfigVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_DRIVER_CONFIG' && ProcessedData.VariableGuid == '8BE4DF61-93CA-11D2-AA0D-00E098032B8C']"));
c:[type == "efiConfigVariables", issuer=="AttestationPolicy"]=> issue(type = "SecureBootEnabled", value = JsonToClaimValue(JmesPath(c.value, "[?ProcessedData.UnicodeName == 'SecureBoot'] | length(@) == `1` && @[0].ProcessedData.VariableData == 'AQ'")));
![type=="SecureBootEnabled", issuer=="AttestationPolicy"] => issue(type="SecureBootEnabled", value=false);

// Retrieve bool properties Code integrity
c:[type=="events", issuer=="AttestationService"] => add(type="boolProperties", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == `12` || PcrIndex == `13` || PcrIndex == `19` || PcrIndex == `20`)].ProcessedData.EVENT_TRUSTBOUNDARY"));
c:[type=="boolProperties", issuer=="AttestationPolicy"] => add(type="codeIntegrityEnabledSet", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_CODEINTEGRITY")));
c:[type=="codeIntegrityEnabledSet", issuer=="AttestationPolicy"] => issue(type="CodeIntegrityEnabled", value=ContainsOnlyValue(c.value, true));
![type=="CodeIntegrityEnabled", issuer=="AttestationPolicy"] => issue(type="CodeIntegrityEnabled", value=false);

// Bitlocker Boot Status, The first non zero measurement or zero.
c:[type=="events", issuer=="AttestationService"] => add(type="srtmDrtmEventPcr", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == `12` || PcrIndex == `19`)].ProcessedData.EVENT_TRUSTBOUNDARY"));
c:[type=="srtmDrtmEventPcr", issuer=="AttestationPolicy"] => add(type="BitlockerStatus", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_BITLOCKER_UNLOCK | @[? Value != `0`].Value | @[0]")));
[type=="BitlockerStatus", issuer=="AttestationPolicy"] => issue(type="BitlockerStatus", value=true);
![type=="BitlockerStatus", issuer=="AttestationPolicy"] => issue(type="BitlockerStatus", value=false);

// Elam Driver (windows defender) Loaded
c:[type=="boolProperties", issuer=="AttestationPolicy"] => add(type="elamDriverLoaded", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_LOADEDMODULE_AGGREGATION[] | [? EVENT_IMAGEVALIDATED == `true` && (equals_ignore_case(EVENT_FILEPATH, '\\windows\\system32\\drivers\\wdboot.sys') || equals_ignore_case(EVENT_FILEPATH, '\\windows\\system32\\drivers\\wd\\wdboot.sys'))] | @ != `null`")));
[type=="elamDriverLoaded", issuer=="AttestationPolicy"] => issue(type="ELAMDriverLoaded", value=true);
![type=="elamDriverLoaded", issuer=="AttestationPolicy"] => issue(type="ELAMDriverLoaded", value=false);

};

```
### Attestation policy to authorize only those TPMs that match known PCR hashes.

```
version=1.2;

authorizationrules
{    
    c:[type == "pcrs", issuer=="AttestationService"] =>  add(type="pcr0Validated", value=JsonToClaimValue(JmesPath(c.value, "PCRs[? Index == `0`].Digests.SHA256 | @[0] =='4c833b1c361fceffd8dc0f81eec76081b71e1a0eb2193caed0b6e1c7735ec33e' ")));
    c:[type == "pcrs", issuer=="AttestationService"] =>  add(type="pcr1Validated", value=JsonToClaimValue(JmesPath(c.value, "PCRs[? Index == `1`].Digests.SHA256 | @[0] =='8c25e3be6ad6f5bd33c9ae40d5d5461e88c1a7366df0c9ee5c7e5ff40d3d1d0e' ")));
    c:[type == "pcrs", issuer=="AttestationService"] =>  add(type="pcr2Validated", value=JsonToClaimValue(JmesPath(c.value, "PCRs[? Index == `2`].Digests.SHA256 | @[0] =='3d458cfe55cc03ea1f443f1562beec8df51c75e14a9fcf9a7234a13f198e7969' ")));
    c:[type == "pcrs", issuer=="AttestationService"] =>  add(type="pcr3Validated", value=JsonToClaimValue(JmesPath(c.value, "PCRs[? Index == `3`].Digests.SHA256 | @[0] =='3d458cfe55cc03ea1f443f1562beec8df51c75e14a9fcf9a7234a13f198e7969' ")));
    
    [type=="pcr0Validated", value==true] &&
    [type=="pcr1Validated", value==true] &&
    [type=="pcr2Validated", value==true] &&
    [type=="pcr3Validated", value==true] => permit();
};

issuancerules
{
};
```

### Attestation policy to validate System Guard is enabled as expected and has been validated for its state.

```
version = 1.2;

authorizationrules
{
    => permit();
};

issuancerules
{
    // Extract the DRTM state auth event
    // The rule attempts to find the valid DRTM state auth event by applying following conditions:
    // 1. There is only one DRTM state auth event in the events log
    // 2. The EVENT_DRTM_STATE_AUTH.SignatureValid field in the DRTM state auth event is set to true
    c:[type=="events", issuer=="AttestationService"] => add(type="validDrtmStateAuthEvent", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && PcrIndex == `20` && ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_DRTM_STATE_AUTH.SignatureValid != `null`] | length(@) == `1` && @[0] | @.{EventSeq:EventSeq, SignatureValid:ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_DRTM_STATE_AUTH.SignatureValid}"));

    // Check if Signature is valid in extracted state auth events
    c:[type=="validDrtmStateAuthEvent", issuer=="AttestationPolicy"] => issue(type="drtmMleValid", value=JsonToClaimValue(JmesPath(c.value, "SignatureValid")));
    ![type=="drtmMleValid", issuer=="AttestationPolicy"] => issue(type="drtmMleValid", value=false);

    // Get the sequence number of the DRTM state auth event.
    // The sequence number is used to ensure that the SMM event appears before the last DRTM state auth event.
    [type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] &&
    c:[type=="validDrtmStateAuthEvent", issuer=="AttestationPolicy"] => add(type="validDrtmStateAuthEventSeq", value=JmesPath(c.value, "EventSeq"));

    // Create query for SMM event
    // The query is constructed to find the SMM level from the SMM level event that appears exactly once before the valid DRTM state auth event in the event log
    [type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] &&
    c:[type=="validDrtmStateAuthEventSeq", issuer=="AttestationPolicy"] => add(type="smmQuery", value=AppendString(AppendString("Events[? EventTypeString == 'EV_EVENT_TAG' && PcrIndex == `20` && EventSeq < `", c.value), "`].ProcessedData.EVENT_DRTM_SMM | length(@) == `1` && @[0] | @.Value"));

    // Extract SMM value
    [type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] &&
    c1:[type=="smmQuery", issuer=="AttestationPolicy"] &&
    c2:[type=="events", issuer=="AttestationService"] => issue(type="smmLevel", value=JsonToClaimValue(JmesPath(c2.value, c1.value)));
};
```


### Attestation policy to validate VBS enclave for its validity and identity.

```
version=1.2;

authorizationrules { 
    [type=="vsmReportPresent", value==true] &&
    [type=="enclaveAuthorId", value=="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"] &&
    [type=="enclaveImageId", value=="AQEAAAAAAAAAAAAAAAAAAA"] &&
    [type=="enclaveSvn", value>=0] =>  permit();
};

issuancerules
{
};
```

### Attestation policy to issue all incoming claims produced by the service.

```
version = 1.2;

configurationrules
{
};

authorizationrules
{
    => permit();
};

issuancerules
{
   c:[type=="bootEvents", issuer=="AttestationService"] => issue(type="outputBootEvents", value=c.value);
   c:[type=="events", issuer=="AttestationService"] => issue(type="outputEvents", value=c.value);
};
```

### Attestation policy to produce some critical security evaluation claims for Windows.

```
version=1.2;

authorizationrules { 
	=> permit();
};

issuancerules{

// SecureBoot enabled
c:[type == "events", issuer=="AttestationService"] => add(type = "efiConfigVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_DRIVER_CONFIG' && ProcessedData.VariableGuid == '8BE4DF61-93CA-11D2-AA0D-00E098032B8C']")); c:[type == "efiConfigVariables", issuer=="AttestationPolicy"]=> issue(type = "secureBootEnabled", value = JsonToClaimValue(JmesPath(c.value, "[?ProcessedData.UnicodeName == 'SecureBoot'] | length(@) == `1` && @[0].ProcessedData.VariableData == 'AQ'"))); ![type=="secureBootEnabled", issuer=="AttestationPolicy"] => issue(type="secureBootEnabled", value=false); 

// Boot debugging 
c:[type=="boolProperties", issuer=="AttestationPolicy"] => add(type="bootDebuggingEnabledSet", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_BOOTDEBUGGING"))); c:[type=="bootDebuggingEnabledSet", issuer=="AttestationPolicy"] => issue(type="bootDebuggingDisabled", value=ContainsOnlyValue(c.value, false)); ![type=="bootDebuggingDisabled", issuer=="AttestationPolicy"] => issue(type="bootDebuggingDisabled", value=false); 

// Virtualization Based Security enabled 
c:[type=="events", issuer=="AttestationService"] => add(type="srtmDrtmEventPcr", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == `12` || PcrIndex == `19`)].ProcessedData.EVENT_TRUSTBOUNDARY")); c:[type=="srtmDrtmEventPcr", issuer=="AttestationPolicy"] => add(type="vbsEnabledSet", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_VBS_VSM_REQUIRED"))); c:[type=="srtmDrtmEventPcr", issuer=="AttestationPolicy"] => add(type="vbsEnabledSet", value=JsonToClaimValue(JmesPath(c.value, "[*].EVENT_VBS_MANDATORY_ENFORCEMENT"))); c:[type=="vbsEnabledSet", issuer=="AttestationPolicy"] => issue(type="vbsEnabled", value=ContainsOnlyValue(c.value, true)); ![type=="vbsEnabled", issuer=="AttestationPolicy"] => issue(type="vbsEnabled", value=false); c:[type=="vbsEnabled", issuer=="AttestationPolicy"] => issue(type="vbsEnabled", value=c.value);

// System Guard and SMM value
c:[type=="events", issuer=="AttestationService"] => add(type="validDrtmStateAuthEvent", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' && PcrIndex == '20' && ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_DRTM_STATE_AUTH.SignatureValid !=null] | length(@) == '1' && @[0] | @.{EventSeq:EventSeq, SignatureValid:ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_DRTM_STATE_AUTH.SignatureValid}"));

// Check if Signature is valid in extracted state auth events
c:[type=="validDrtmStateAuthEvent", issuer=="AttestationPolicy"] => issue(type="drtmMleValid", value=JsonToClaimValue(JmesPath(c.value, "SignatureValid")));
![type=="drtmMleValid", issuer=="AttestationPolicy"] => issue(type="drtmMleValid", value=false);

// Get the sequence number of the DRTM state auth event.
// The sequence number is used to ensure that the SMM event appears before the last DRTM state auth event.
[type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] && c:[type=="validDrtmStateAuthEvent", issuer=="AttestationPolicy"] => add(type="validDrtmStateAuthEventSeq", value=JmesPath(c.value, "EventSeq"));

// Create query for SMM event
// The query is constructed to find the SMM level from the SMM level event that appears exactly once before the valid DRTM state auth event in the event log
[type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] && c:[type=="validDrtmStateAuthEventSeq", issuer=="AttestationPolicy"] => add(type="smmQuery", value=AppendString(AppendString("Events[? EventTypeString == 'EV_EVENT_TAG' && PcrIndex == 20 && EventSeq <", c.value), "].ProcessedData.EVENT_DRTM_SMM | length(@) == 1 && @[0] | @.Value"));

// Extract SMM value
[type=="drtmMleValid", value==true, issuer=="AttestationPolicy"] &&
c1:[type=="smmQuery", issuer=="AttestationPolicy"] &&
c2:[type=="events", issuer=="AttestationService"] => issue(type="smmLevel", value=JsonToClaimValue(JmesPath(c2.value, c1.value)));

};
```

### Attestation policy to validate boot related firmware and early boot driver signers on linux

```
version = 1.2;

configurationrules
{
};

authorizationrules
{
    [type == "aikValidated", value==true]
    => permit();
};

issuancerules {
    // Retrieve all EFI Boot variables with event = 'EV_EFI_VARIABLE_BOOT' 
    c:[type == "events", issuer=="AttestationService"] => add(type ="efiBootVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_BOOT']"));

    // Retrieve all EFI Driver Config variables with event = 'EV_EFI_VARIABLE_DRIVER_CONFIG' 
    c:[type == "events", issuer=="AttestationService"] => add(type ="efiConfigVariables", value = JmesPath(c.value, "Events[?EventTypeString == 'EV_EFI_VARIABLE_DRIVER_CONFIG']"));

   // Grab all IMA events
   c:[type=="events", issuer=="AttestationService"] => add(type="imaMeasurementEvents", value=JmesPath(c.value, "Events[?EventTypeString == 'IMA_MEASUREMENT_EVENT']"));

   // Look for "Boot Order" from EFI Boot Data
   c:[type == "efiBootVariables", issuer=="AttestationPolicy"] => add(type = "bootOrderFound", value = JmesPath(c.value, "[?ProcessedData.UnicodeName == 'BootOrder'] | length(@) == `1` && @[0].PcrIndex == `1` && @[0].ProcessedData.VariableData"));
   c:[type=="bootOrderFound", issuer=="AttestationPolicy"] => issue(type="bootOrder", value=JsonToClaimValue(c.value));
   ![type=="bootOrderFound", issuer=="AttestationPolicy"] => issue(type="bootOrder", value=0);

   // Look for "Secure Boot" from EFI Driver Configuration Data
   c:[type == "efiConfigVariables", issuer=="AttestationPolicy"] => issue(type = "secureBootEnabled", value = JsonToClaimValue(JmesPath(c.value, "[?ProcessedData.UnicodeName == 'SecureBoot'] | length(@) == `1` && @[0].PcrIndex == `7` && @[0].ProcessedData.VariableData == 'AQ'")));
   ![type=="secureBootEnabled", issuer=="AttestationPolicy"] => issue(type="secureBootEnabled", value=false);

   // Look for "Platform Key" from EFI Boot Data
   c:[type == "efiConfigVariables", issuer=="AttestationPolicy"] => add(type = "platformKeyFound", value = JmesPath(c.value, "[?ProcessedData.UnicodeName == 'PK'] | length(@) == `1` && @[0].PcrIndex == `7` && @[0].ProcessedData.VariableData"));
   c:[type=="platformKeyFound", issuer=="AttestationPolicy"] => issue(type="platformKey", value=JsonToClaimValue(c.value));
   ![type=="platformKeyFound", issuer=="AttestationPolicy"] => issue(type="platformKey", value=0);
  
   // Look for "Key Exchange Key" from EFI Driver Configuration Data
   c:[type == "efiConfigVariables", issuer=="AttestationPolicy"] => add(type = "keyExchangeKeyFound", value = JmesPath(c.value, "[?ProcessedData.UnicodeName == 'KEK'] | length(@) == `1` && @[0].PcrIndex == `7` && @[0].ProcessedData.VariableData"));
   c:[type=="keyExchangeKeyFound", issuer=="AttestationPolicy"] => issue(type="keyExchangeKey", value=JsonToClaimValue(c.value));
   ![type=="keyExchangeKeyFound", issuer=="AttestationPolicy"] => issue(type="keyExchangeKey", value=0);

   // Look for "Key Database" from EFI Driver Configuration Data
   c:[type == "efiConfigVariables", issuer=="AttestationPolicy"] => add(type = "keyDatabaseFound", value = JmesPath(c.value, "[?ProcessedData.UnicodeName == 'db'] | length(@) == `1` && @[0].PcrIndex == `7` && @[0].ProcessedData.VariableData"));
   c:[type=="keyDatabaseFound", issuer=="AttestationPolicy"] => issue(type="keyDatabase", value=JsonToClaimValue(c.value));
   ![type=="keyDatabaseFound", issuer=="AttestationPolicy"] => issue(type="keyDatabase", value=0);

   // Look for "Forbidden Signatures" from EFI Driver  Configuration Data
   c:[type == "efiConfigVariables", issuer=="AttestationPolicy"] => add(type = "forbiddenSignaturesFound", value = JmesPath(c.value, "[?ProcessedData.UnicodeName == 'dbx'] | length(@) == `1` && @[0].PcrIndex == `7` && @[0].ProcessedData.VariableData"));
   c:[type=="forbiddenSignaturesFound", issuer=="AttestationPolicy"] => issue(type="forbiddenSignatures", value=JsonToClaimValue(c.value));
   ![type=="forbiddenSignaturesFound", issuer=="AttestationPolicy"] => issue(type="forbiddenSignatures", value=0);

   // Look for "Kernel Version" in IMA Measurement events
   c:[type=="imaMeasurementEvents", issuer=="AttestationPolicy"] => add(type="kernelVersionsFound", value=JmesPath(c.value, "[].ProcessedData.KernelVersion"));
   c:[type=="kernelVersionsFound", issuer=="AttestationPolicy"] => issue(type="kernelVersions", value=JsonToClaimValue(c.value));
   ![type=="kernelVersionsFound", issuer=="AttestationPolicy"] => issue(type="kernelVersions", value=0);

   // Look for "Built-In Trusted Keys" in IMA Measurement events
   c:[type=="imaMeasurementEvents", issuer=="AttestationPolicy"] => add(type="builtintrustedkeysFound", value=JmesPath(c.value, "[? ProcessedData.Keyring == '.builtin_trusted_keys'].ProcessedData.CertificateSubject"));
   c:[type=="builtintrustedkeysFound", issuer=="AttestationPolicy"] => issue(type="builtintrustedkeys", value=JsonToClaimValue(c.value));
   ![type=="builtintrustedkeysFound", issuer=="AttestationPolicy"] => issue(type="builtintrustedkeys", value=0);
};

```
### Attestation policy to issue the list of drivers loaded during boot. 

```
version = 1.2;

configurationrules
{
};

authorizationrules
{
    => permit();
};

issuancerules {

c:[type=="events", issuer=="AttestationService"] => issue(type="alldriverloads", value=JmesPath(c.value, "Events[? EventTypeString == 'EV_EVENT_TAG' ].ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_LOADEDMODULE_AGGREGATION[].EVENT_FILEPATH"));

c:[type=="events", issuer=="AttestationService"] => issue(type="DriverLoadPolicy", value=JmesPath(c.value, "events[? EventTypeString == 'EV_EVENT_TAG' && (PcrIndex == '13')].ProcessedData.EVENT_TRUSTBOUNDARY.EVENT_DRIVER_LOAD_POLICY.String"));

};

```

### Attestation policy for Key attestation, validating keys and properties of the key.

```
version=1.2;

authorizationrules
{
    // Key Attest Policy
    // -- Validating key types
	c:[type=="x-ms-tpm-request-key", issuer=="AttestationService"] => add(type="requestKeyType", value=JsonToClaimValue(JmesPath(c.value, "jwk.kty")));
    c:[type=="requestKeyType", issuer=="AttestationPolicy", value=="RSA"] => issue(type="requestKeyType", value="RSA");

    // -- Validating tpm_certify attributes
    c:[type=="x-ms-tpm-request-key", issuer=="AttestationService"] => add(type="requestKeyCertify", value=JmesPath(c.value, "info.tpm_certify"));
    c:[type=="requestKeyCertify", issuer=="AttestationPolicy"] => add(type="requestKeyCertifyObjAttr", value=JsonToClaimValue(JmesPath(c.value, "obj_attr")));
    c:[type=="requestKeyCertifyObjAttr", issuer=="AttestationPolicy", value==50] => issue(type="requestKeyCertifyObjAttrVerified", value=true);
    
    c:[type=="requestKeyCertifyObjAttrVerified", issuer=="AttestationPolicy" , value==true] => permit();

};

issuancerules
{
    
};
```