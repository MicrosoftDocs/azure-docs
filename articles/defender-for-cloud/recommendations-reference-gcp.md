---
title: Reference table for all recommendations for GCP resources
description: This article lists Microsoft Defender for Cloud's security recommendations that help you harden and protect your GCP resources.
ms.topic: reference
ms.date: 06/27/2023
ms.custom: generated
---

# Security recommendations for GCP resources - a reference guide

This article lists the recommendations you might see in Microsoft Defender for Cloud if you've connected a  GCP project from the **Environment settings** page. The recommendations shown in your environment depend on the resources you're protecting and your customized configuration.

To learn about how to respond to these recommendations, see
[Remediate recommendations in Defender for Cloud](implement-security-recommendations.md).

Your secure score is based on the number of security recommendations you've completed. To
decide which recommendations to resolve first, look at the severity of each one and its potential
impact on your secure score.

## <a name='recs-gcp-compute'></a> GCP Compute recommendations

[!INCLUDE [asc-recs-gcp-compute](../../includes/mdfc/mdfc-recs-gcp-compute.md)]

## <a name='recs-gcp-container'></a> GCP Container recommendations

[!INCLUDE [asc-recs-gcp-container](../../includes/mdfc/mdfc-recs-gcp-container.md)]

### Data plane recommendations

All the data plane recommendations listed [here](kubernetes-workload-protections.md#view-and-configure-the-bundle-of-recommendations) are supported under GCP after [enabling Azure Policy for Kubernetes](kubernetes-workload-protections.md#enable-kubernetes-data-plane-hardening).

## <a name='recs-gcp-data'></a> GCP Data recommendations

[!INCLUDE [asc-recs-gcp-data](../../includes/mdfc/mdfc-recs-gcp-data.md)]

## <a name='recs-gcp-identityandaccess'></a> GCP IdentityAndAccess recommendations

[!INCLUDE [asc-recs-gcp-identityandaccess](../../includes/mdfc/mdfc-recs-gcp-identityandaccess.md)]

## <a name='recs-gcp-networking'></a> GCP Networking recommendations

[!INCLUDE [asc-recs-gcp-networking](../../includes/mdfc/mdfc-recs-gcp-networking.md)]

## Next steps

For related information, see the following:

- [Connect your GCP projects to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)
- [What are security policies, initiatives, and recommendations?](security-policy-concept.md)
- [Review your security recommendations](review-security-recommendations.md)
