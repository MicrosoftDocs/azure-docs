---
title: Cognitive Services containers frequently asked questions (FAQ)
titleSuffix: Azure Cognitive Services
description: Frequently asked questions and answers.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Azure Cognitive Services containers frequently asked questions (FAQ)

## General questions

<details>
<summary>
<b>What is available?</b>
</summary>

**Answer:** [Container support in Azure Cognitive Services](../cognitive-services-container-support.md) allows developers to use the same intelligent APIs that are available in Azure, but with the [benefits](../cognitive-services-container-support.md#features-and-benefits) of containerization. Container support is currently available in preview for a subset of Azure Cognitive Services, including parts of:

> [!div class="checklist"]
> * [Anomaly Detector][ad-containers]
> * [Computer Vision][cv-containers]
> * [Face][fa-containers]
> * [Form Recognizer][fr-containers]
> * [Language Understanding (LUIS)][lu-containers]
> * [Speech Service API][sp-containers]
> * [Text Analytics][ta-containers]

</details>

<details>
<summary>
<b>Is there any difference between the Cognitive Services cloud and the containers?</b>
</summary>

**Answer:** Cognitive Services containers are an alternative to the Cognitive Services cloud. Containers offer the same capabilities as the corresponding cloud services. Customers can deploy the containers on-premises or in Azure. The core AI technology, pricing tiers, API keys, and API signature are the same between the container and the corresponding cloud services. Here are the [features and benefits](../cognitive-services-container-support.md#features-and-benefits) for choosing containers over their cloud service equivalent.

</details>

<details>
<summary>
<b>Will containers be available for all Cognitive Services and what are the next set of containers we should expect?</b>
</summary>

**Answer:** We would like to make more Cognitive Services available as container offerings. Contact to your local Microsoft account manager to get updates on new container releases and other Cognitive Services announcements.

</details>

<details>
<summary>
<b>What will the Service-Level Agreement (SLA) be for Cognitive Services containers?</b>
</summary>

**Answer:** No SLA exists for Cognitive Services containers.

Cognitive Services container configurations of resources are controlled by customers, as such Microsoft does not offer a SLA. Customers are free to deploy containers on-premises, ultimately they define the host environments.

> [!IMPORTANT]
> To learn more about Cognitive Services Service-Level Agreements, [visit our SLA page](https://azure.microsoft.com/support/legal/sla/cognitive-services/v1_1/).

</details>

<details>
<summary>
<b>Are these containers available in sovereign clouds?</b>
</summary>

**Answer:** Not everyone is familiar with the term "sovereign cloud", so let's begin with definition:

> The "sovereign cloud" consists of the [Azure Government](../../azure-government/documentation-government-welcome.md), [Azure Germany](../../germany/germany-welcome.md), and [Azure China 21Vianet](https://docs.microsoft.com/azure/china/overview-operations) clouds.

Unfortunately, the Cognitive Services containers are *not* natively supported in the sovereign clouds. The containers can be run in these clouds, but they will be pulled from the public cloud and need to send usage data to the public endpoint.

</details>

<details>
<summary>
<b>How are containers updated to the latest version?</b>
</summary>

**Answer:** Customers can choose when to update the containers they have deployed. Containers will be marked with standard [Docker tags](https://docs.docker.com/engine/reference/commandline/tag/) such as `latest` to indicate the most recent version. We encourage customers to pull the latest version of containers as they are released, checkout [Azure Container Registry webhooks](../../container-registry/container-registry-webhook.md) for details on how to get notified when an image is updated.

</details>

<details>
<summary>
<b>What versions will be supported?</b>
</summary>

**Answer:** The current and last major version of the container will be supported. However, we encourage customers to stay current to get the latest technology.

</details>

<details>
<summary>
<b>How are updates versioned?</b>
</summary>

**Answer:** Major version changes indicate that there is a breaking change to the API signature. We anticipate that updates will generally coincide with major version changes to the corresponding Cognitive Service cloud offering. Minor version changes indicate bug fixes, model updates, or new features that do not make a breaking change to the API signature.

</details>

## Technical questions

<details>
<summary>
<b>How should I run the Cognitive Services containers on IoT devices?</b>
</summary>

**Answer:** Whether you don't have a reliable internet connection, or want to save on bandwidth cost. Or if have low-latency requirements, or are dealing with sensitive data that needs to be analyzed on-site, [Azure IoT Edge with the Cognitive Services containers](https://azure.microsoft.com/blog/running-cognitive-services-on-iot-edge/) gives you consistency with the cloud.
</details>

<details>
<summary>
<b>How do I provide product feedback and feature recommendations?</b>
</summary>

**Answer:** Customers are encouraged to [voice their concerns](https://cognitive.uservoice.com/) publicly, and up-vote others who have done the same where potential issues overlap. The user voice tool can be used for both product feedback and feature recommendations.

</details>

<details>
<summary>
<b>Who do I contact for support?</b>
</summary>

**Answer:** Customer support channels are the same as the Cognitive Services cloud offering. All Cognitive Services containers include logging features that will help us and the community support customers. For additional support, see the following options.

### Customer support plan

Customers should refer to their [Azure support plan](https://azure.microsoft.com/support/plans/) to see who to contact for support.

### Azure knowledge center

Customers are free to explore the [Azure knowledge center](https://azure.microsoft.com/resources/knowledge-center/) to answer questions and support issues.

### Stack Overflow

> [Stack Overflow](https://en.wikipedia.org/wiki/Stack_Overflow) is a question and answer site for professional and enthusiast programmers.

Explore the following tags for potential questions and answers that align with your needs.

* [Azure Cognitive Services](https://stackoverflow.com/questions/tagged/azure-cognitive-services)
* [Microsoft Cognitive](https://stackoverflow.com/questions/tagged/microsoft-cognitive)

</details>

<details>
<summary>
<b>How does billing work?</b>
</summary>

**Answer:** Customers are charged based on consumption, similar to the Cognitive Services cloud. The containers send metering data to Azure, and transactions will be billed accordingly. Resources used across the hosted and on-premises services will add to single quota with tiered pricing, counting against both usages. For more detail, refer to pricing page of the corresponding offering.

* [Anomaly Detector][ad-containers-billing]
* [Computer Vision][cv-containers-billing]
* [Face][fa-containers-billing]
* [Form Recognizer][fr-containers-billing]
* [Language Understanding (LUIS)][lu-containers-billing]
* [Speech Service API][sp-containers-billing]
* [Text Analytics][ta-containers-billing]

> [!IMPORTANT]
> Cognitive Services containers are not licensed to run without being connected to Azure for metering. Customers need to enable the containers to communicate billing information with the metering service at all times. Cognitive Services containers do not send customer data to Microsoft.

</details>

<details>
<summary>
<b>What is the current support warranty for containers?</b>
</summary>

**Answer:** There is no warranty for previews. Microsoft's standard warranty for enterprise software will apply when containers are formally announced as general availability (GA).

</details>

<details>
<summary>
<b>What happens to Cognitive Services containers when internet connectivity is lost?</b>
</summary>

**Answer:** Cognitive Services containers are *not licensed* to run without being connected to Azure for metering. Customers need to enable the containers to communicate with the metering service at all times.

</details>

<details>
<summary>
<b>How long can the container operate without being connected to Azure?</b>
</summary>

**Answer:** Cognitive Services containers are *not licensed* to run without being connected to Azure for metering. Customers need to enable the containers to communicate with the metering service at all times.

</details>

<details>
<summary>
<b>What is current hardware required to run these containers?</b>
</summary>

**Answer:** Cognitive Services containers are x64 based containers that can run any compatible Linux node, VM, and edge device that supports x64 Linux Docker Containers. They all require CPU processors. The minimum and recommended configurations for each container offering are available below:

* [Anomaly Detector][ad-containers-recommendations]
* [Computer Vision][cv-containers-recommendations]
* [Face][fa-containers-recommendations]
* [Form Recognizer][fr-containers-recommendations]
* [Language Understanding (LUIS)][lu-containers-recommendations]
* [Speech Service API][sp-containers-recommendations]
* [Text Analytics][ta-containers-recommendations]

> [!NOTE]
> The above listed Cognitive Services container's are **not currently supported** on [ARM][arm], [FPGA][fpga], and [GPU][gpu] devices.

</details>

<details>
<summary>
<b>Are these containers currently supported on Windows?</b>
</summary>

**Answer:** The Cognitive Services containers are Linux containers, however there is some support for Linux containers on Windows. For more information about Linux containers on Windows, see [Docker documentation](https://blog.docker.com/2017/09/preview-linux-containers-on-windows/).

</details>

<details>
<summary>
<b>How do I discover the containers?</b>
</summary>

**Answer:** Cognitive Services containers are available in various locations, such as the Azure portal, Docker hub, and Azure container registries. For the most recent container locations, refer to [container repositories and images](../cognitive-services-container-support.md#container-repositories-and-images).

</details>

<details>
<summary>
<b>How does Cognitive Services containers compare to AWS and Google offerings?</b>
</summary>

**Answer:** Microsoft is first cloud provider to move their pre-trained AI models in containers with simple billing per transaction as though customers are using a cloud service. Microsoft believes a hybrid cloud gives customers more choice.

</details>

<details>
<summary>
<b>What compliance certifications do containers have?</b>
</summary>

**Answer:** Cognitive services containers do not have any compliance certifications

</details>

<details>
<summary>
<b>What regions are Cognitive Services containers available in?</b>
</summary>

**Answer:** Containers can be run anywhere in any region however they need a key and to call back to Azure for metering. All supported regions for the Cloud Service are supported for the containers metering call.

</details>

[!INCLUDE [Containers next steps](includes/containers-next-steps.md)]

[ad-containers]: ../anomaly-Detector/anomaly-detector-container-howto.md
[cv-containers]: ../computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ../face/face-how-to-install-containers.md
[fr-containers]: ../form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ../luis/luis-container-howto.md
[sp-containers]: ../speech-service/speech-container-howto.md
[ta-containers]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md

[ad-containers-billing]: ../anomaly-Detector/anomaly-detector-container-howto.md#billing
[cv-containers-billing]: ../computer-vision/computer-vision-how-to-install-containers.md#billing
[fa-containers-billing]: ../face/face-how-to-install-containers.md#billing
[fr-containers-billing]: ../form-recognizer/form-recognizer-container-howto.md#billing
[lu-containers-billing]: ../luis/luis-container-howto.md#billing
[sp-containers-billing]: ../speech-service/speech-container-howto.md#billing
[ta-containers-billing]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md#billing

[ad-containers-recommendations]: ../anomaly-Detector/anomaly-detector-container-howto.md#container-requirements-and-recommendations
[cv-containers-recommendations]: ../computer-vision/computer-vision-how-to-install-containers.md#container-requirements-and-recommendations
[fa-containers-recommendations]: ../face/face-how-to-install-containers.md#container-requirements-and-recommendations
[fr-containers-recommendations]: ../form-recognizer/form-recognizer-container-howto.md#container-requirements-and-recommendations
[lu-containers-recommendations]: ../luis/luis-container-howto.md#container-requirements-and-recommendations
[sp-containers-recommendations]: ../speech-service/speech-container-howto.md#container-requirements-and-recommendations
[ta-containers-recommendations]: ../text-analytics/how-tos/text-analytics-how-to-install-containers.md#container-requirements-and-recommendations

[gpu]: https://wikipedia.org/wiki/Graphics_processing_unit
[arm]: https://wikipedia.org/wiki/ARM_architecture
[fpga]: https://wikipedia.org/wiki/Field-programmable_gate_array