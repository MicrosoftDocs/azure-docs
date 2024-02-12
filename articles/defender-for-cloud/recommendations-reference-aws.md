---
title: Reference table for all security recommendations for AWS resources
description: This article lists all Microsoft Defender for Cloud security recommendations that help you harden and protect your Amazon Web Services (AWS) resources.
ms.topic: reference
ms.date: 06/27/2023
ms.custom: generated
---

# Security recommendations for Amazon Web Services (AWS) resources

This article lists all the recommendations you might see in Microsoft Defender for Cloud if you connect an Amazon Web Services (AWS) account by using the **Environment settings** page. The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you've completed. To decide which recommendations to resolve first, look at the severity of each recommendation and its potential impact on your secure score.

## <a name='recs-aws-compute'></a>AWS Compute recommendations

[!INCLUDE [asc-recs-aws-compute](../../includes/mdfc/mdfc-recs-aws-compute.md)]

## <a name='recs-aws-container'></a>AWS Container recommendations

[!INCLUDE [asc-recs-aws-container](../../includes/mdfc/mdfc-recs-aws-container.md)]

### Data plane recommendations

All the [Kubernetes data plane security recommendations](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported for AWS after you [enable Azure Policy for Kubernetes](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening).

## <a name='recs-aws-data'></a>AWS Data recommendations

[!INCLUDE [asc-recs-aws-data](../../includes/mdfc/mdfc-recs-aws-data.md)]

## <a name='recs-aws-identityandaccess'></a>AWS IdentityAndAccess recommendations

[!INCLUDE [asc-recs-aws-identityandaccess](../../includes/mdfc/mdfc-recs-aws-identityandaccess.md)]

## <a name='recs-aws-networking'></a>AWS Networking recommendations

[!INCLUDE [asc-recs-aws-networking](../../includes/mdfc/mdfc-recs-aws-networking.md)]

## Related content

- [Connect your AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
