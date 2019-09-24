---
title: Cognitive Services offline containers
titleSuffix: Azure Cognitive Services
description: Learn about Azure Cognitive Services offline container availability and eligibility.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 09/24/2019
ms.author: dapine
---

# Azure Cognitive Services offline containers

We're thrilled to offer Azure Cognitive Services "offline containers", available now in limited preview to customers with an *Enterprise Agreement*. Offline containers enable customers can run Cognitive Services in fully disconnected environments. You can use the same rich APIs that are available in Azure, with finite control of deployment and hosting. Cognitive Services containers offer many [features and benefits](../cognitive-services-container-support.md#features-and-benefits), such as:

* Control of your data.
* Low-latency execution of artificial intelligence (AI) models near application logic.
* Disconnected scenarios on the [intelligent edge](https://azure.microsoft.com/overview/future-of-cloud).

[!INCLUDE [Cognitive Services offline containers](includes/cognitive-services-offline-containers.md)]

> [!IMPORTANT]
> Offline containers are in limited preview, and eligibility criteria is in place to help guide customers. [Sign up here][sign-up] for early access.

## Use cases

There are many use cases for offline Cognitive Services containers, here are some of the more common use cases we've experienced. As general guidance, any scenario that requires being temporarily or indefinitely disconnected from the cloud could benefit from offline containers. The only question you need to ask yourself is, "do I want to build intelligence into my apps?".

### Transport services

Various transport services, such as luxury cruise lines *do not always* have connectivity to the cloud. Cognitive Services containers offer a huge opportunity to track sentiment of passengers, identify lost items, and even help with answering questions for customers. All these operations can run locally in real time, without being connected to the cloud.

### Retail intelligence

Offline containers support several retail scenarios, including helping to build a fluid checkout experience, developing product recommendation, and target advertising. Retailers can execute AI on-premises close to their data. Containers enable the possibility of running these operations by deploying them on-premises, for higher-level decision making in real time.

### IT automation

Offline containers can be used as recommendation engines for handling tickets and assigning them to the correct team. They could be used to detect sentiment within customer tickets and prioritize which scenarios need to get addressed first. Likewise, you could automate the resolution of tickets by troubleshooting and determining resolution without manual intervention.

## Customer eligibility

> [!NOTE]
> During preview, offline containers are limited to customers with an [Enterprise Agreement](https://www.microsoft.com/licensing/licensing-programs/enterprise) from Microsoft.

An approval process and decision will be made after validating business use cases for fully disconnected environments. Customers without an Enterprise Agreement, but who are still interested in offline containers should refer to the [FAQs](container-faq.md) to learn more.

## Frequently asked questions (FAQs)

### Eligibility and approval process

**Q:  What customer should do to get EA with Microsoft?**

**A:** Contact your Microsoft account management team to understand the process for acquiring an Enterprise Agreement with Microsoft. 

**Q: How long does it take to approve an application?**

**A:** Given the demand from different customer segments, we are trying to expedite approval process, however we cannot promise a timeline. Once a decision is made, the Microsoft team will contact you and your account management team for the next steps. We appreciate your understanding and patience.

**Q: What is the pricing of offline containers?**

**A:** Offline containers are currently in limited preview and handled on a case-by-case basis. With that being said, the pricing structure is non-standard. Pricing is determined after application have been reviewed.

### Product availability

**Q: What services are available in offline containers?**

**A:** Most of the Cognitive Services containers that are available, are also available as "offline containers". We would like to make more Cognitive Services available as container offerings. Contact to your local Microsoft account manager to get updates on new container releases and other Cognitive Services announcements.

### Technical questions

**Q: How should I run the Cognitive Services containers on-premises?**

**A:** Cognitive Services containers are just like any other Docker container, and are compatible to run on Linux. As such, all containers are flexible and can operate within orchestration engines such as Kubernetes, and DC/OS.

**Q: Do Cognitive Services containers work with IoT devices?**

**A:** Yes, Cognitive Services containers work with IoT devices. There are many reasons to consider IoT devices integrating with Cognitive Services containers:

* If you don’t have a reliable internet connection
* You want to save on bandwidth cost
* You have low-latency requirements
* You are dealing with sensitive data that needs to be analyzed on-site

For more information see [Azure IoT Edge with Cognitive Services containers](https://azure.microsoft.com/en-us/blog/running-cognitive-services-on-iot-edge/).

**Q: What compliance certifications do containers have?**

**A:** Cognitive Services containers do not have any compliance certifications.

## Next steps

If you still have questions, see [FAQs](container-faq.md) for potential answers.

> [!div class="nextstepaction"]
> [Sign up for offline containers][sign-up]

[sign-up]: https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u

[ad-containers]: ../anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: ../computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ../face/face-how-to-install-containers.md
[fr-containers]: ../form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ../luis/luis-container-howto.md
[sp-containers]: ../speech-service/speech-container-howto.md
[ta-containers]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md
<!-- [tt-containers]: ../translator/how-to-install-containers.md -->