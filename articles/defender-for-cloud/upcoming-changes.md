---
title: Important changes coming to Microsoft Defender for Cloud
description: Upcoming changes to Microsoft Defender for Cloud that you might need to be aware of and for which you might need to plan 
ms.topic: overview
ms.date: 11/07/2022
---

# Important upcoming changes to Microsoft Defender for Cloud

> [!IMPORTANT]
> The information on this page relates to pre-release products or features, which may be substantially modified before they are commercially released, if ever. Microsoft makes no commitments or warranties, express or implied, with respect to the information provided here.

On this page, you'll learn about changes that are planned for Defender for Cloud. It describes planned modifications to the product that might impact things like your secure score or workflows.

If you're looking for the latest release notes, you'll find them in the [What's new in Microsoft Defender for Cloud](release-notes.md).

## Planned changes

| Planned change | Estimated date for change |
|--|--|
| [Recommendation to configure dead-letter queues for Lambda functions to be deprecated](#recommendation-to-configure-dead-letter-queues-for-lambda-functions-to-be-deprecated) | November 2022 |
| [Recommendation to enable diagnostic logs for Virtual Machine Scale Sets to be deprecated](#recommendation-to-enable-diagnostic-logs-for-virtual-machine-scale-sets-to-be-deprecated) | December 2022 |

### Recommendation to configure dead-letter queues for Lambda functions to be deprecated

**Estimated date for change: November 2022**

The recommendation [`Lambda functions should have a dead-letter queue configured`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/AwsRecommendationDetailsBlade/assessmentKey/dcf10b98-798f-4734-9afd-800916bf1e65/showSecurityCenterCommandBar~/false) is set to be deprecated.

| Recommendation | Description | Severity |
|--|--|--|
| Lambda functions should have a dead-letter queue configured | This control checks whether a Lambda function is configured with a dead-letter queue. The control fails if the Lambda function is not configured with a dead-letter queue. As an alternative to an on-failure destination, you can configure your function with a dead-letter queue to save discarded events for further processing. A dead-letter queue acts the same as an on-failure destination. It is used when an event fails all processing attempts or expires without being processed. A dead-letter queue allows you to look back at errors or failed requests to your Lambda function to debug or identify unusual behavior. From a security perspective, it is important to understand why your function failed and to ensure that your function does not drop data or compromise data security as a result. For example, if your function cannot communicate to an underlying resource, that could be a symptom of a denial of service (DoS) attack elsewhere in the network. | Medium |

### Recommendation to enable diagnostic logs for Virtual Machine Scale Sets to be deprecated

**Estimated date for change: December 2022**

The recommendation [`Diagnostic logs in Virtual Machine Scale Sets should be enabled`](https://ms.portal.azure.com/#view/Microsoft_Azure_Security/GenericRecommendationDetailsBlade/assessmentKey/961eb649-3ea9-f8c2-6595-88e9a3aeedeb/showSecurityCenterCommandBar~/false) is set to be deprecated. 

The related [policy definition](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F7c1b1214-f927-48bf-8882-84f0af6588b1) will also be deprecated from any standards displayed in the regulatory compliance dashboard. 

| Recommendation | Description | Severity |
|--|--|--|
| Diagnostic logs in Virtual Machine Scale Sets should be enabled | Enable logs and retain them for up to a year. This enables you to recreate activity trails for investigation purposes when a security incident occurs or your network is compromised. | Low |

## Next steps

For all recent changes to Defender for Cloud, see [What's new in Microsoft Defender for Cloud?](release-notes.md).
