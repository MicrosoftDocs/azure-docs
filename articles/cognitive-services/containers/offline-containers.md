---
title: Cognitive Services offline containers (limited preview)
titleSuffix: Azure Cognitive Services
description: Frequently asked questions and answers.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 09/23/2019
ms.author: dapine
---

# Azure Cognitive Services offline containers (limited preview)

We're thrilled to announce Azure Cognitive Services offline containers, available now in limited preview to customers with an *Enterprise Agreement*. Offline containers enable customers can run APIs in a fully disconnected environment. You can use the same rich APIs that are available in Azure, with the flexibility of where to deploy, and host the services that come with [Docker containers](https://www.docker.com/resources/what-container). Cognitive Services containers offer many [features and benefits](../cognitive-services-container-support.md#features-and-benefits), such as control of your data, choice of deployment and running artificial intelligence (AI) models next to your applications and system logic for low-latency execution.

> [!IMPORTANT]
> Offline containers are in limited preview, and eligibility criteria is in place to help guide customers. [Sign up here][sign-up] to learn more.

## Use Cases

There are many use cases for offline containers, here are some of the more common use cases we've experienced.

### Retail intelligence



Support retail scenarios helping to build a frictionless checkout experience, develop product recommendation, target advertisement etc., enabling retailers to run AI on-premises close to their data. Containers enable possibilities of running these operations by deploying them on-premises for higher-level decision making and in real time.

### IT automation



Use containers as a recommendation engine in handling tickets and assign to the right team on time. Detect sentiment entitles within customer tickets and prioritize which scenarios need to get addressed first, Automate the resolution of tickets by troubleshooting and determining resolution without manual intervention.

### Transport services

Various transport services, such as luxury cruise lines *do not always* have connectivity to the cloud. Cognitive Services containers offer a huge opportunity to track sentiment of passengers, identify lost items, and even help with answering questions for customers. All these operations can run locally in real time, without being connected to the cloud.

## Solution architecture

[ IMAGE ]

## Offline container eligibility

> [!NOTE]
> During preview, offline containers are limited to customers with an [Enterprise Agreement](https://www.microsoft.com/licensing/licensing-programs/enterprise) from Microsoft.

An approval process and decision will be made after validating business use cases for fully disconnected environments. Customers who do not have an Enterprise Agreement but are still interested in offline containers should refer to the [FAQs](container-faq.md) to learn more.

## Offline containers frequently asked questions (FAQs)

### Eligibility and approval process 

**Q:  What customer should do to get EA with Microsoft?**

**A:** Reach out to your Microsoft account management team to understand the process for acquiring an Enterprise Agreement with Microsoft. 

**Q: How long does it take to approve an application?**

**A:** Given the demand from different customer segments, we are trying to expedite approval process, however we cannot promise a timeline. Once a decision is made, the Microsoft team will reach out to you and your account management team for the next steps. We appreciate your understanding and patience.

**Q: What is the pricing of offline containers?**

**A:** Offline containers are currently in limited preview and handled on a case-by-case basis. With that being said, the pricing structure is non-standard. Pricing is determined after the application is we reviewed.

### Product availability

**Q: What services are available in offline containers?**

**A:** All of the Cognitive Services containers that are available, are also available as "offline containers". We would like to make more Cognitive Services available as container offerings. Contact to your local Microsoft account manager to get updates on new container releases and other Cognitive Services announcements.

### Technical Questions 

**Q: How should I run the Cognitive Services containers on-premises?**

Azure Cognitive Services containers are just like any other Docker container, and are compatible to run on Linux. As such, all containers are flexible and can operate within orchestration engines such as Kubernetes, and DC/OS.

**Q: How should I run the Cognitive Services containers on IoT devices?**

**A:** Whether you don’t have a reliable internet connection, or want to save on bandwidth cost. Or if have low-latency requirements, or are dealing with sensitive data that needs to be analyzed on-site, [Azure IoT Edge with the Cognitive Services containers](https://azure.microsoft.com/en-us/blog/running-cognitive-services-on-iot-edge/) gives you consistency with the cloud.

**Q: What compliance certifications do containers have?**

**A:** Cognitive Services containers do not have any compliance certifications.

## Next Steps

If you still have questions, see [FAQs](container-faq.md) for potential answers.

> [!div class="nextstepaction"]
> [Sign up for offline containers][sign-up]

[sign-up]: https://forms.office.com/Pages/DesignPage.aspx#FormId=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u

[ad-containers-billing]: ../anomaly-Detector/anomaly-detector-container-howto.md#billing
[cv-containers-billing]: ../computer-vision/computer-vision-how-to-install-containers.md#billing
[fa-containers-billing]: ../face/face-how-to-install-containers.md#billing
[fr-containers-billing]: ../form-recognizer/form-recognizer-container-howto.md#billing
[lu-containers-billing]: ../luis/luis-container-howto.md#billing
[sp-containers-billing]: ../speech-service/speech-container-howto.md#billing
[ta-containers-billing]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md#billing
<!-- [tt-containers-billing]: ../translator/how-to-install-containers.md#billing -->

[ad-containers-recommendations]: ../anomaly-Detector/anomaly-detector-container-howto.md#container-requirements-and-recommendations
[cv-containers-recommendations]: ../computer-vision/computer-vision-how-to-install-containers.md#container-requirements-and-recommendations
[fa-containers-recommendations]: ../face/face-how-to-install-containers.md#container-requirements-and-recommendations
[fr-containers-recommendations]: ../form-recognizer/form-recognizer-container-howto.md#container-requirements-and-recommendations
[lu-containers-recommendations]: ../luis/luis-container-howto.md#container-requirements-and-recommendations
[sp-containers-recommendations]: ../speech-service/speech-container-howto.md#container-requirements-and-recommendations
[ta-containers-recommendations]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md#container-requirements-and-recommendations
<!-- [tt-containers-recommendations]: ../translator/how-to-install-containers.md#container-requirements-and-recommendations -->
