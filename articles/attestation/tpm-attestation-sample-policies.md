---
title: Examples of an Azure TPM Attestation policy
description: Examples of Azure Attestation policy.
services: attestation
author: prsrive
ms.service: attestation
ms.topic: overview
ms.date: 10/12/2022
ms.author: prsriva


---
# Examples of an attestation policy

Attestation policy is used to process the attestation evidence and determine whether Azure Attestation will issue an attestation token. Attestation token generation can be controlled with custom policies. Below are some examples of an attestation policy. 

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
	=> premit();
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

