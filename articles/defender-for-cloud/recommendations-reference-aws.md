---
title: Reference table for all recommendations for AWS resources
description: This article lists Microsoft Defender for Cloud's security recommendations that help you harden and protect your AWS resources.
ms.topic: reference
ms.date: 06/27/2023
ms.custom: generated
---

# Security recommendations for AWS resources - a reference guide

This article lists the recommendations you might see in Microsoft Defender for Cloud if you've connected an AWS account from the **Environment settings** page. The recommendations shown in your environment depend on the resources you're protecting and your customized configuration.

To learn about how to respond to these recommendations, see
[Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you've completed. To
decide which recommendations to resolve first, look at the severity of each one and its potential
impact on your secure score.

## <a name='recs-aws-compute'></a> AWS Compute recommendations

[!INCLUDE [asc-recs-aws-compute](../../includes/mdfc/mdfc-recs-aws-compute.md)]

## <a name='recs-aws-container'></a> AWS Container recommendations

[!INCLUDE [asc-recs-aws-container](../../includes/mdfc/mdfc-recs-aws-container.md)]

### Data plane recommendations

All the data plane recommendations listed [here](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported under AWS after [enabling the Azure policy extension](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening). 

## <a name='recs-aws-data'></a> AWS Data recommendations

[!INCLUDE [asc-recs-aws-data](../../includes/mdfc/mdfc-recs-aws-data.md)]

## <a name='recs-aws-identityandaccess'></a> AWS IdentityAndAccess recommendations

[!INCLUDE [asc-recs-aws-identityandaccess](../../includes/mdfc/mdfc-recs-aws-identityandaccess.md)]

## <a name='recs-aws-networking'></a> AWS Networking recommendations

[!INCLUDE [asc-recs-aws-networking](../../includes/mdfc/mdfc-recs-aws-networking.md)]

## Next steps

For related information, see the following:

- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
