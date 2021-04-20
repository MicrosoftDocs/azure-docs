---
title: Reference table for all Azure Security Center recommendations 
description: This article lists Azure Security Center's security recommendations that help you harden and protect your resources.
author: memildin
ms.service: security-center
ms.topic: reference
ms.date: 04/06/2021
ms.author: memildin
ms.custom: generated
---
# Security recommendations - a reference guide

This article lists the recommendations you might see in Azure Security Center. The recommendations
shown in your environment depend on the resources you're protecting and your customized
configuration.

Security Center's recommendations are based on the [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction).
Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security 
and compliance best practices based on common compliance frameworks. This widely respected benchmark 
builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) 
and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on 
cloud-centric security.

To learn about how to respond to these recommendations, see
[Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

Your secure score is based on the number of Security Center recommendations you've completed. To
decide which recommendations to resolve first, look at the severity of each one and its potential
impact on your secure score.

> [!TIP]
> If a recommendation's description says "No related policy", it's usually because that
> recommendation is dependent on a different recommendation and _its_ policy. For example, the
> recommendation "Endpoint protection health failures should be remediated...", relies on the
> recommendation that checks whether an endpoint protection solution is even _installed_ ("Endpoint
> protection solution should be installed..."). The underlying recommendation _does_ have a policy.
> Limiting the policies to only the foundational recommendation simplifies policy management.

## <a name='recs-appservices'></a>AppServices recommendations

[!INCLUDE [asc-recs-appservices](../../includes/asc-recs-appservices.md)]

## <a name='recs-compute'></a>Compute recommendations

[!INCLUDE [asc-recs-compute](../../includes/asc-recs-compute.md)]

## <a name='recs-container'></a>Container recommendations

[!INCLUDE [asc-recs-container](../../includes/asc-recs-container.md)]

## <a name='recs-data'></a>Data recommendations

[!INCLUDE [asc-recs-data](../../includes/asc-recs-data.md)]

## <a name='recs-identityandaccess'></a>IdentityAndAccess recommendations

[!INCLUDE [asc-recs-identityandaccess](../../includes/asc-recs-identityandaccess.md)]

## <a name='recs-iot'></a>IoT recommendations

[!INCLUDE [asc-recs-iot](../../includes/asc-recs-iot.md)]

## <a name='recs-networking'></a>Networking recommendations

[!INCLUDE [asc-recs-networking](../../includes/asc-recs-networking.md)]

## Deprecated recommendations

|Recommendation|Description & related policy|Severity|
|----|----|----|
|Access to App Services should be restricted|Restrict access to your App Services by changing the networking configuration, to deny inbound traffic from ranges that are too broad.<br>(Related policy: [Preview]: Access to App Services should be restricted)|High|
|The rules for web applications on IaaS NSGs should be hardened|Harden the network security group (NSG) of your virtual machines that are running web applications, with NSG rules that are overly permissive with regard to web application ports.<br>(Related policy: The NSGs rules for web applications on IaaS should be hardened)|High|
|Pod Security Policies should be defined to reduce the attack vector by removing unnecessary application privileges (Preview)|Define Pod Security Policies to reduce the attack vector by removing unnecessary application privileges. It is recommended to configure pod security policies so pods can only access resources which they are allowed to access.<br>(Related policy: [Preview]: Pod Security Policies should be defined on Kubernetes Services)|Medium|
|Install Azure Security Center for IoT security module to get more visibility into your IoT devices|Install Azure Security Center for IoT security module to get more visibility into your IoT devices.|Low|
|Your machines should be restarted to apply system updates|Restart your machines to apply the system updates and secure the machine from vulnerabilities. (Related policy: System updates should be installed on your machines)|Medium|
|Monitoring agent should be installed on your machines|This action installs a monitoring agent on the selected virtual machines. Select a workspace for the agent to report to. (No related policy)|High|
||||

## Next steps

To learn more about recommendations, see the following:

- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](security-center-recommendations.md)
