---
title: Azure Attestation EAT profile for TDX
description: Azure Attestation EAT profile for TDX
services: attestation
author: mbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 10/18/2023
ms.author: mbaldwin 
ms.custom:
---

# Azure Attestation EAT profile for Intel® Trust Domain Extensions (TDX)

This profile outlines claims for an [Intel® Trust Domain Extensions (TDX)](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html) attestation result generated as an Entity Attestation Token (EAT) by Azure Attestation.

The profile includes claims from the IETF [JWT](https://datatracker.ietf.org/doc/html/rfc7519) specification, the [EAT](https://datatracker.ietf.org/doc/html/draft-ietf-rats-eat-21)) specification,  Intel's TDX specification and Microsoft specific claims.

## JWT claims

The complete definitions of the following claims are available in the JWT specification. 

**iat** - The "iat" (issued at) claim identifies the time at which the JWT was issued.

**exp** - The "exp" (expiration time) claim identifies the expiration time on or after which the JWT MUST NOT be accepted for processing.

**iss** - The "iss" (issuer) claim identifies the principal that issued the JWT.

**jti** - The "jti" (JWT ID) claim provides a unique identifier for the JWT.

**nbf** - The "nbf" (not before) claim identifies the time before which the JWT MUST NOT be accepted for processing.

## EAT claims

The complete definitions of the following claims are available in the EAT specification.

**eat_profile** - The "eat_profile" claim identifies an EAT profile by either a URL or an OID.

**dbgstat** - The "dbgstat" claim applies to entity-wide or submodule-wide debug facilities of the entity like [JTAG] and diagnostic hardware built into chips.

**intuse** - The "intuse" claim provides an indication to an EAT consumer about the intended usage of the token.

## TDX claims

The complete definitions of the claims are available in the section A.3.2 TD Quote Body of [Intel® TDX DCAP Quoting Library API](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/Intel_TDX_DCAP_Quoting_Library_API.pdf) specification.

**tdx_mrsignerseam** - A 96-character hexadecimal string that represents a byte array of length 48 containing the measurement of the TDX module signer.

**tdx_mrseam** - A 96-character hexadecimal string that represents a byte array of length 48 containing the measurement of the Intel TDX module.

**tdx_mrtd** - A 96-character hexadecimal string that represents a byte array of length 48 containing the measurement of the initial contents of the TDX.

**tdx_rtmr0** - A 96-character hexadecimal string that represents a byte array of length 48 containing the runtime extendable measurement register.

**tdx_rtmr1** - A 96-character hexadecimal string that represents a byte array of length 48 containing the runtime extendable measurement register.

**tdx_rtmr2** - A 96-character hexadecimal string that represents a byte array of length 48 containing the runtime extendable measurement register.

**tdx_rtmr3** - A 96-character hexadecimal string that represents a byte array of length 48 containing the runtime extendable measurement register.

**tdx_mrconfigid** - A 96-character hexadecimal string that represents a byte array of length 48 containing the software-defined ID for non-owner-defined configuration of the TDX, e.g., runtime or Operating System (OS) configuration.

**tdx_mrowner** - A 96-character hexadecimal string that represents a byte array of length 48 containing the software-defined ID for the TDX's owner.

**tdx_mrownerconfig** - A 96-character hexadecimal string that represents a byte array of length 48 containing the software-defined ID for owner-defined configuration of the TDX, e.g., specific to the workload rather than the runtime or OS.

**tdx_report_data** - A 128-character hexadecimal string that represents a byte array of length 64.  In this context, the TDX has the flexibility to include 64 bytes of custom data in a TDX Report.  For instance, this space can be used to hold a nonce, a public key, or a hash of a larger block of data.

**tdx_seam_attributes** - A 16 character hexadecimal string that represents a byte array of length 8 containing additional configuration of the TDX module.

**tdx_tee_tcb_svn** - A 32 character hexadecimal string that represents a byte array of length 16 describing the Trusted Computing Base (TCB) Security Version Numbers (SVNs) of TDX.

**tdx_xfam** - A 16 character hexadecimal string that represents a byte array of length 8 containing a mask of CPU extended features that the TDX is allowed to use.

**tdx_seamsvn** - A number that represents the Intel TDX module SVN.  The complete definition of the claim is available in section 3.1 SEAM_SIGSTRUCT: INTEL® TDX MODULE SIGNATURE STRUCTURE of [Intel® TDX Loader Interface Specification](https://cdrdv2.intel.com/v1/dl/getContent/733584)

**tdx_td_attributes** - A 16 character hexadecimal string that represents a byte array of length 8.  These are the attributes associated with the Trust Domain (TD).  The complete definitions of the claims mentioned below are available in the section A.3.4.  TD Attributes of  [Intel® TDX DCAP Quoting Library API](https://download.01.org/intel-sgx/latest/dcap-latest/linux/docs/Intel_TDX_DCAP_Quoting_Library_API.pdf) specification.

**tdx_td_attributes_debug** - A boolean value that indicates whether the TD runs in TD debug mode (set to 1) or not (set to 0).  In TD debug mode, the CPU state and private memory are accessible by the host VMM.

**tdx_td_attributes_key_locker** - A boolean value that indicates whether the TD is allowed to use Key Locker.

**tdx_td_attributes_perfmon** - A boolean value that indicates whether the TD is allowed to use Perfmon and PERF_METRICS capabilities.

**tdx_td_attributes_protection_keys** - A boolean value that indicates whether the TD is allowed to use Supervisor Protection Keys.

**tdx_td_attributes_septve_disable** - A boolean value that determines whether to disable EPT violation conversion to #VE on TD access of PENDING pages.

## Attester claims

**attester_tcb_status** - A string value that represents the TCB level status of the platform being evaluated.  See tcbStatus in [Intel® Trusted Services API Management Developer Portal](https://api.portal.trustedservices.intel.com/documentation).

## Microsoft specific claims

**x-ms-attestation-type** - A string value that represents the attestation type.

**x-ms-policy-hash** - Hash of Azure Attestation evaluation policy computed as BASE64URL(SHA256(UTF8(BASE64URL(UTF8(policy text))))).

**x-ms-runtime** - JSON object containing "claims" that are defined and generated within the attested environment. This is a specialization of the “enclave held data” concept, where the “enclave held data” is specifically formatted as a UTF-8 encoding of well formed JSON.

**x-ms-ver** - JWT schema version (expected to be "1.0")
} 
