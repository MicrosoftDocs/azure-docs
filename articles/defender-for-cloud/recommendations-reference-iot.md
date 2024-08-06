---
title: Reference table for all IoT security recommendations in Microsoft Defender for Cloud
description: This article lists all Microsoft Defender for Cloud IoT security recommendations that help you harden and protect your resources.
author: dcurwin
ms.service: defender-for-cloud
ms.topic: reference
ms.date: 03/13/2024
ms.author: dacurwin
ms.custom: generated
ai-usage: ai-assisted
---

# IoT security recommendations

This article lists all the IoT security recommendations you might see in Microsoft Defender for Cloud. 

The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.


To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).


> [!TIP]
> If a recommendation description says *No related policy*, usually it's because that recommendation is dependent on a different recommendation.
>
> For example, the recommendation *Endpoint protection health failures should be remediated* relies on the recommendation that checks whether an endpoint protection solution is installed (*Endpoint protection solution should be installed*). The underlying recommendation *does* have a policy.
> Limiting policies to only foundational recommendations simplifies policy management.



## Azure IoT recommendations

### [Default IP Filter Policy should be Deny](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/5a3d6cdd-8eb3-46d2-ba11-d24a0d47fe65)

**Description**: IP Filter Configuration should have rules defined for allowed traffic and should deny all other traffic by default
(No related policy).

**Severity**: Medium

### [Diagnostic logs in IoT Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/77785808-ce86-4e40-b45f-19110a547397)

**Description**: Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised.
(Related policy: [Diagnostic logs in IoT Hub should be enabled](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f383856f8-de7f-44a2-81fc-e5135b5c2aa4)).

**Severity**: Low

### [Identical Authentication Credentials](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/9d07b7e6-2986-4964-a76c-b2689604e212)

**Description**: Identical authentication credentials to the IoT Hub used by multiple devices. This could indicate an illegitimate device impersonating a legitimate device. It also exposes the risk of device impersonation by an attacker
(No related policy).

**Severity**: High

### [IP Filter rule large IP range](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/d8326952-60bb-40fb-b33f-51e662708a88)

**Description**: An Allow IP Filter rule's source IP range is too large. Overly permissive rules might expose your IoT hub to malicious intenders
(No related policy).

**Severity**: Medium



## Related content

- [Learn about security recommendations](security-policy-concept.md)
- [Review security recommendations](review-security-recommendations.md)
