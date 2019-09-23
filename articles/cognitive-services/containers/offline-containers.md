---
title: Cognitive Services Offline containers (limited preview)
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

# Azure Cognitive Services Offline containers (limited preview)

We're thrilled to announce Azure Cognitive Services offline containers, available now in limited preview to customers with an *Enterprise Agreement*. Offline containers enable customers can run APIs in a fully disconnected environment. You can use the same rich APIs that are available in Azure, with the flexibility of where to deploy, and host the services that come with [Docker containers](https://www.docker.com/resources/what-container). Cognitive Services containers offer many [features and benefits](../cognitive-services-container-support.md#features-and-benefits), such as control of your data, choice of deployment and running AI models next to your applications and system logic for a low-latency execution.

> [!IMPORTANT]
> Since this offer is in preview, eligibility criteria is in place to help guide customers. [Sign up here][sign-up] to learn more.

## Use Cases

There are many use cases for offline containers, here are some of the more common use cases we've experienced.

### Retail intelligence

Support retail scenarios helping to build a frictionless checkout experience, develop product recommendation, target advertisement etc., enabling retailers to run AI on-premises close to their data. Containers enable possibilities of running these operations by deploying them on-premises for higher-level decision making and in real time.

### IT automation

Use Containers as recommendation engine in handling tickets and assign to the right team on time. Detect sentiment entitles within customer tickets and prioritize which scenarios need to get addressed first, Automate the resolution of tickets by troubleshooting and determining resolution without manual intervention.

### Transport services

Few of the transport vehicles like cruise lines don’t have connectivity to the cloud always, containers open huge possibilities to track sentiment from programs, identify lost items, help answering customers for their questions. All these operations can run locally without being connected and in real time. 

## Solution architecture

[ IMAGE ]

## Offline container eligibility

> [!NOTE]
> During preview, offline containers are limited to customers with an *Enterprise Agreement* from Microsoft.

An approval process and decision will be made after validating business use cases for fully disconnected environments. Customers who do not have an *Enterprise Agreement* but are still interested in offline containers should refer to the [FAQs](container-faq.md) to learn more.

## Offline containers frequently asked questions (FAQs)

### Product availability

**Q: What services are available in offline containers?**

Only below services are available today to run offline, we are planning to add few more as we made them available, please stay tuned. 

Anomaly Detector 

Computer Vision 

Face 

Form Recognizer 

Language Understanding (LUIS) 

Speech Service API 

Text Analytics 

Translator Text - coming soon 

 

Q: Will offline containers be available for all Cognitive Services and what are the next set of containers we should expect? 

We would like to make more Cognitive Services available as container offerings. Contact to your local Microsoft account manager to get updates on new container releases and other Cognitive Services announcements. 

 

Q: What will the Service-Level Agreement (SLA) be for Cognitive Services offline containers? 

Cognitive Services containers do not have an SLA. 

Cognitive Services container configurations of resources are controlled by customers, so Microsoft will not offer an SLA for general availability (GA). Customers are free to deploy containers on-premises; thus they define the host environments. 

To learn more about Cognitive Services Service-Level Agreements, visit our SLA page. 

Versioning 

Q: How are containers updated to the latest version? 

Customers can choose when to update the containers they have deployed. Containers will be marked with standard Docker tags such as latest to indicate the most recent version. We encourage customers to pull the latest version of containers as they are released, checkout Azure Container Registry webhooks for details on how to get notified when an image is updated. 

 

Q: What versions will be supported? 

The current and last major version of the container will be supported. However, we encourage customers to stay current to get the latest technology. 

 

Q: How are updates versioned? 

Major version changes indicate that there is a breaking change to the API signature. We anticipate that this will generally coincide with major version changes to the corresponding Cognitive Service cloud offering. Minor version changes indicate bug fixes, model updates, or new features that do not make a breaking change to the API signature. 

Eligibility and Approval process 

Q:  What customer should do to get EA with Microsoft? 

Reach out to your Microsoft Account Management team to understand the process in acquiring Enterprise Agreement with Microsoft. 

 

Q:  How much time will it take to approve an application? 

Given the demand from different customer segments we are trying to expedite approval process, however we don’t promise any timelines. Once a decision is made, Microsoft team will reach out to you and your Account management team for next steps.  

 

Q:  How much I will be paying for offline containers? 

After we review application 

 

Technical Questions 

Q: How should I run the Cognitive Services containers on premises? 

Azure Cognitive Services Containers are just like any other docker containers compatible to run on linux and windows machines. Also these containers are flexible to operate with orchestrator engine such as Kubernetes, DC/OS etc., 

 

Q: What is current hardware required to run these containers? 

Cognitive Services containers are x64 based containers that can run any compatible Linux node, VM, and edge device that supports x64 Linux Docker Containers. They all require CPU processors. The minimum and recommended configurations for each container offering are available at: 

Anomaly Detector 

Computer Vision 

Face 

Form Recognizer 

Language Understanding (LUIS) 

Speech Service API 

Text Analytics 

Translator Text - coming soon 


**Q: How should I run the Cognitive Services containers on IoT devices?**

**A:** Whether you don’t have a reliable internet connection, or want to save on bandwidth cost. Or if have low-latency requirements, or are dealing with sensitive data that needs to be analyzed on-site, Azure IoT Edge with the Cognitive Services containers gives you consistency with the cloud. 

**Q: What compliance certifications do containers have?**

**A:** Cognitive Services containers do not have any compliance certifications.

## Next Steps

> [!div class="nextstepaction"]
> [Sign up for offline containers][sign-up]

[sign-up]: https://forms.office.com/Pages/DesignPage.aspx#FormId=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u

[ad-containers]: ../anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: ../computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ../face/face-how-to-install-containers.md
[fr-containers]: ../form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ../luis/luis-container-howto.md
[sp-containers]: ../speech-service/speech-container-howto.md
[ta-containers]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md
<!-- [tt-containers]: ../translator/how-to-install-containers.md -->

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
