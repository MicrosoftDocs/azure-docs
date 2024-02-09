---
title: Reference table for all security recommendations for GCP resources
description: This article lists all Microsoft Defender for Cloud security recommendations that help you harden and protect your Google Cloud Platform (GCP) resources.
ms.topic: reference
ms.date: 06/27/2023
ms.custom: generated
---

# Security recommendations for Google Cloud Platform (GCP) resources

This article lists all the recommendations you might see in Microsoft Defender for Cloud if you connect a Google Cloud Platform (GCP) account by using the **Environment settings** page. The recommendations that appear in your environment are based on the resources that you're protecting and on your customized configuration.

To learn about actions that you can take in response to these recommendations, see [Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you've completed. To decide which recommendations to resolve first, look at the severity of each recommendation and its potential impact on your secure score.

## <a name='recs-gcp-compute'></a>GCP Compute recommendations

[!INCLUDE [asc-recs-gcp-compute](../../includes/mdfc/mdfc-recs-gcp-compute.md)]

## <a name='recs-gcp-container'></a>GCP Container recommendations

[!INCLUDE [asc-recs-gcp-container](../../includes/mdfc/mdfc-recs-gcp-container.md)]

### Data plane recommendations

All the [Kubernetes data plane security recommendations](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported for GCP after you [enable Azure Policy for Kubernetes](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening).

## <a name='recs-gcp-data'></a>GCP Data recommendations

[!INCLUDE [asc-recs-gcp-data](../../includes/mdfc/mdfc-recs-gcp-data.md)]

## <a name='recs-gcp-identityandaccess'></a>GCP IdentityAndAccess recommendations

[!INCLUDE [asc-recs-gcp-identityandaccess](../../includes/mdfc/mdfc-recs-gcp-identityandaccess.md)]

## <a name='recs-gcp-networking'></a> GCP Networking recommendations

[!INCLUDE [asc-recs-gcp-networking](../../includes/mdfc/mdfc-recs-gcp-networking.md)]

## Related content

- [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
