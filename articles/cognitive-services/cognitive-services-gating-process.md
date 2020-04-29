---
title: Cognitive Services gating process
titleSuffix: Azure Cognitive Services
description: Learn how to apply for early access to new Cognitive Services containers and APIs.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 04/24/2020
ms.author: aahi
---

# Gating process for Azure Cognitive Services

> [!NOTE]
> After a service offering completes a gated preview, it goes into an "ungated" public preview which does not require an application for access. After the preview process, it's released as Generally Available(GA).

As new Azure Cognitive Services offerings are introduced, they go through a gated preview where customers have to request access through an application. This gating process helps identify opportunities for improvements to service offerings before they're widely available. 

This article will guide you through the application process for gated Cognitive Services offerings.

## Eligibility and Approval process

The gating process is in place to help gauge interest and better understand customer needs. The Microsoft team accepts [applications](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u) from Microsoft commercial customers with a valid Azure subscription and a valid business scenario. Customers will potentially have their applications denied when:

 - They're not associated with any organization
 - They do not have a valid Azure subscription
 - The application was submitted through personal email (@hotmail.com, @gmail.com, @yahoo.com)
 - There was no proper justification or business scenario provided

Given the demand from different customer segments, we're attempting to expedite approval process. However, we cannot commit to a timeline. Once a decision is made, the Microsoft team will contact you and your account management team for the next steps. We appreciate your understanding and patience.

If the application is approved, the Microsoft team will send an email with details, documentation, and guidance. Cognitive Services pricing details available [here](https://azure.microsoft.com/pricing/details/cognitive-services/).


Currently, the services below are offered through the gating process:

## Gated web APIs

|Service  |
|---------|
|Anomaly Detector v2     | 

## Gated Online Containers

| Service                             | Container(s)                                                                  |
|-------------------------------------|-------------------------------------------------------------------------------|
| [Anomaly Detector][ad-containers]    | Anomaly Detector                                                             |
| [Computer Vision][cv-containers]    | Read                                                                          |
| [Face][fa-containers]               | Face                                                                          |
| [Form Recognizer][fr-containers]    | Form Recognizer                                                               |
| [Speech Service API][sp-containers] | Speech-to-text (Custom and Standard) and Text-to-speech (Custom and Standard) |
| [Translator Text][tt-containers]    | Translator Text                                                               |

> [!IMPORTANT]
> If a service or containerized offering is not listed, it's either not gated, or unavailable.

## Next steps

If you have questions, email the Microsoft team at <a href="mailto:cognitivegate@microsoft.com">cognitivegate@microsoft.com</a>.

> [!div class="nextstepaction"]
> [Sign up for gated services](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u)

[ad-containers]: ./anomaly-detector/anomaly-detector-container-howto.md
[cv-containers]: ./computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ./face/face-how-to-install-containers.md
[fr-containers]: ./form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ./luis/luis-container-howto.md
[sp-containers]: ./speech-service/speech-container-howto.md
[ta-containers]: ./text-analytics/how-tos/text-analytics-how-to-install-containers.md
[tt-containers]: ./translator/how-to-install-containers.md
