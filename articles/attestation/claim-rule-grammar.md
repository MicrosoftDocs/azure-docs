---
title: Azure Attestation claim rule grammar
description: Details on Azure Attestation policy claims and claim rules.
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 11/14/2022
ms.author: mbaldwin


---
# Claim and claim rules

To understand the grammar of claim rules, you must first understand attestation policy claims.

## Claim

A claim is a set of properties grouped together to provide relevant information. For Azure Attestation, a claim contains the following properties:

- **type**: A string value that represents type of the claim.
- **value**: A Boolean, integer, or string value that represents value of the claim.
- **valueType**: The data type of  the information stored in the value property. Supported types are String, Integer, and Boolean. If not defined, the default value will be "String".
- **issuer**: Information regarding the issuer of the claim. The issuer will be one of the following types:
  - **AttestationService**: Certain claims are made available to the policy author by Azure Attestation, which can be used by the attestation policy author to craft the appropriate policy.
  - **AttestationPolicy**: The policy (as defined by the administrator) itself can add claims to the incoming evidence during processing. The issuer in this case is set to "AttestationPolicy".
  - **CustomClaim**: The attestor (client) can also add additional claims to the attestation evidence. The issuer in this case is set to "CustomClaim".

If not defined. the default value will be "CustomClaim".

## Claim Rule

The incoming claim set is used by the policy engine to compute the attestation result. A claim rule is a set of conditions used to validate the incoming claims and take the defined action.

```
Conditions list => Action (Claim)
```

Azure Attestation evaluation of a claim rule involves following steps:

- If conditions list is not present, execute the action with specified claim 
- Otherwise, evaluate the conditions from the conditions list.
- If the conditions list evaluates to false, stop. Otherwise, proceed.

The conditions in a claim rule are used to determine whether the action needs to be executed. Conditions list is a sequence of conditions that are separated by "&&" operator.

The conditions list is structured as:

```
Condition && Condition && ...
```

The condition is structured as:

```
Identifier:[ClaimPropertyCondition, ClaimPropertyCondition,…]
```

The conditions list is composed of individual conditions on various properties of a claim. A condition can have an optional identifier, which can be used to refer the claim/s that satisfy the condition. This reference can be used in the other conditions or the action of the same rule.

For example

```
F1:[type=="OSName" , issuer=="CustomClaim"] && 
[type=="OSName" , issuer=="AttestationService", value== F1.value ] 
=> issueproperty(type="report_validity_in_minutes", value=1440);

F1:[type=="OSName" , issuer=="CustomClaim"] && 
C2:[type=="OSName" , issuer=="AttestationService", value== F1.value ] 
=> issue(claim = C2);
```

The following are the operators that can be used to check conditions:

| Valuetype | Operations Supported |
|--|--|
| Integer | == (equals), \!= (not equal), <= (less than or equal), < (less than), >= (greater than or equal), > (greater than) |
| String | == (equals), \!= (not equal) |
| Boolean | == (equals), \!= (not equal) |

Evaluation of conditions list:

- The presence of "&&" operator implies that a conditions list is evaluated as true only if all the conditions from the list are evaluated to true.
- A condition represents filtering criteria on the set of claims. The condition itself is said to evaluate to true if there is at least one claim is found that satisfies the condition.
- A claim is said to satisfy the filtering criterion represented by the condition if each of its properties satisfies the corresponding claim property conditions present in the condition.  

The set of actions that are allowed in a policy are described below.

| Action Verb | Description | Policy sections to which these apply |
|--|--|--|
| permit() | The incoming claim set can be used to compute **issuancerules**. Does not take any claim as a parameter | **authorizationrules** |
| deny() | The incoming claim set should not be used to compute **issuancerules** Does not take any claim as a parameter | **authorizationrules** |
| add(claim) | Adds the claim to the incoming claims set. Any claim added to the incoming claims set will be available for the subsequent claim rules. |**authorizationrules**, **issuancerules** |
| issue(claim) | Adds the claim to the incoming and outgoing claims set | **issuancerules** |
| issueproperty(claim) | Adds the claim to the incoming and property claims set | **issuancerules**

## Next steps

- [How to author and sign an attestation policy](author-sign-policy.md)
- [Set up Azure Attestation using PowerShell](quickstart-powershell.md)