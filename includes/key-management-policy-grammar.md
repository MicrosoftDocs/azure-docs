---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2023
ms.author: mbaldwin
---

This article documents a simplified EBNF grammar for secure key release policy, which itself is modeled on [Azure Policy](../articles/governance/policy/index.yml). For a complete example of a secure key release policy, see the [confidential VM key release policy](https://raw.githubusercontent.com/Azure/confidential-computing-cvm/main/cvm_deployment/key/skr-policy.json).

```json
(* string and number from JSON *)
value =
  string |
  number |
  "true" |
  "false";

(* The operators supported for claim value comparison *)
operator =
  "equals:" |
  "notEquals:" |
  "less:" |
  "lessOrEquals:" |
  "greater:" |
  "greaterOrEquals:" |
  "exists:";

(* A JSON condition that evaluates the value of a claim *)
claim_condition =
  "{" "claim:", string "," operator, ":", value "}";

(* A JSON condition requiring any of the listed conditions to be true *)
anyof_condition =
  "{" "anyof:", condition_array "}";

(* A JSON condition requiring all of the listed conditions to be true *)
allof_condition =
  "{" "allof:", condition_array "}";

(* A condition is any of the allowed condition types *)
condition =
  claim_condition |
  anyof_condition |
  allof_condition;

(* A list of conditions, one is required *)
condition_list =
  condition { "," condition };

(* An JSON array of conditions *)
condition_array =
  "[" condition_list "]";

(* A JSON authority with its conditions *)
authority =
  "{" "authority:", string "," ( anyof_condition | allof_condition );

(* A list of authorities, one is required *)
authority_list =
  authority { "," authority_list };

(* A policy is an anyOf selector of authorities *)
policy = 
  "{" "version: \"1.0.0\"", "anyOf:", "[" authority_list "]" "}";
```

## Claim condition

A Claim Condition is a JSON object that identifies a claim name, a condition for matching, and a value, for example:

```json
{ 
  "claim": "<claim name>", 
  "equals": <value to match>
} 
```

In the first iteration, the only allowed condition is "equals" but future iterations may allow for other operators [similar to Azure Policy](../articles/governance/policy/concepts/definition-structure.md) (see the section on Conditions). If a specified claim isn't present, its condition is considered to haven't been met.

Claim names allow "dot notation" to enable JSON object navigation, for example:

```json
{ 
  "claim": "object.object.claim", 
  "equals": <value to match>
}
```

Array specifications aren't presently supported. Per the grammar, objects aren't allowed as values for matching.

## AnyOf, AllOf conditions

AnOf and AllOf condition objects allow for the modeling of OR and AND. For AnyOf, if any of the conditions provided are true, the condition is met. For AllOf, all of the conditions must be true. 

Examples are shown below. In the first, allOf requires all conditions to be met:

```json
{
  "allOf":
  [
    { 
      "claim": "<claim_1>", 
      "equals": <value_1>
    },
    { 
      "claim": "<claim_2>", 
      "equals": <value_2>
    }
  ]
}
```

Meaning (claim_1 == value_1) && (claim_2 == value_2).

In this example, anyOf requires that any condition match:

```json
{
  "anyOf":
  [
    { 
      "claim": "<claim_1>", 
      "equals": <value_1>
    },
    { 
      "claim": "<claim_2>", 
      "equals": <value_2>
    }
  ]
}
```

Meaning (claim_1 == value_2) || (claim_2 == value_2)

The anyOf and allOf condition objects may be nested:

```json
  "allOf":
  [
    { 
      "claim": "<claim_1>", 
      "equals": <value_1>
    },
    {
      "anyOf":
      [
        { 
          "claim": "<claim_2>", 
          "equals": <value_2>
        },
        { 
          "claim": "<claim_3>", 
          "equals": <value_3>
        }
      ]
    }
  ]
```

Or:

```json
{
  "allOf":
  [
    { 
      "claim": "<claim_1>", 
      "equals": <value_1>
    },
    {
      "anyOf":
      [
        { 
          "claim": "<claim_2>", 
          "equals": <value_2>
        },
        {
          "allOf":
          [
            { 
              "claim": "<claim_3>", 
              "equals": <value_3>
            },
            { 
              "claim": "<claim_4>", 
              "equals": <value_4>
            }
          ]
        }
      ]
    }
  ]
}
```

## Key release authority

Conditions are collected into Authority statements and combined:

```json
{
  "authority": "<issuer>",
  "allOf":
  [
    { 
      "claim": "<claim_1>", 
      "equals": <value_1>
    }
  ]
}
```

Where:

- **authority**: An identifier for the authority making the claims. This identifier functions in the same fashion as the iss claim in a JSON Web Token. It indirectly references a key that signs the Environment Assertion.
- **allOf**: One or more claim conditions that identify claims and values that must be satisfied in the environment assertion for the release policy to succeed. anyOf is also allowed. However, both aren't allowed together. 

## Key Release Policy

Release policy is an anyOf condition containing an array of key authorities:

```json
{
  "anyOf":
  [
    {
      "authority": "my.attestation.com",
      "allOf":
      [
        { 
          "claim": "mr-signer", 
          "equals": "0123456789"
        }
      ]
    }
  ]
}
```

## Encoding key release policy

Since key release policy is a JSON document, it's encoded when carried in requests and response to AKV to avoid the need to describe the complete language in Swagger definitions. 

The encoding is as follows:

```json
{
  "contentType": "application/json; charset=utf-8",
  "data": "<BASE64URL(JSON serialization of policy)>"
}
```

## Environment Assertion

An Environment Assertion is a signed assertion, in JSON Web Token form, from a trusted authority. An Environment Asserting contains at least a key encryption key and one or more claims about the target environment (for example, TEE type, publisher, version) that are matched against the Key Release Policy. The key encryption key is a public RSA key owned and protected by the target execution environment that is used for key export. It must appear in the TEE keys claim (x-ms-runtime/keys). This claim is a JSON object representing a JSON Web Key Set. Within the JWKS, one of the keys must meet the requirements for use as an encryption key (key_use is "enc", or key_ops contains "encrypt"). The first suitable key is chosen.

## Key Vault and Managed HSM Attestation Token Requirements
Azure Key Vault Premium and Managed HSM Secure Key Release were designed alongside [Microsoft Azure Attestation Service](../articles/attestation/overview.md) but may work with any attestation server’s tokens if it conforms to the expected token structure, supports OpenID connect, and has the expected claims. DigiCert is presently the only public CA that Azure Key Vault Premium and Managed HSM trust for attestation token signing certificates. 

 

The full set of requirements are: 

- **iss** claim that identifies the issuer is required and is matched against the SKR policy on the key being requested. 

  - Issuer must support OpenID Connect Metadata using a certificate rooted in DigiCert CA. 

  - In the OpenID Connect Metadata the **jwks_uri** claim is required and must resolve to a JSON Web Key Set (JWKS), where each JWK in the set must contain kid, kty, and a X5c array of signing certs. 

- **x-ms-runtime** claim is required as a JSON object containing: 

  - An array of JSON Web Keys named keys that represent the keys held by the attested environment. The keys must be plain JWK format or x5c array (first key is taken as the signing key and its kid must match a signing key in OpenId Connect metadata). 

  - Kid is required. 

  - One of those keys must be an RSA. 

  - Marked with **key_use** of encryption or a **key_ops** array containing the Encrypt operation. 

For a sample token see [Examples of an Azure Attestation token](../articles/attestation/attestation-token-examples.md#sample-jwt-generated-for-sev-snp-attestation).
