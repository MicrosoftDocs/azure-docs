---
title: Data, privacy, and security for AI Content Safety
titleSuffix: Azure Cognitive Services
description: This document details issues for data, privacy, and security for Azure AI Content Safety.
author: PatrickFarley
ms.author: pafarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.date: 05/15/2023
ms.topic: article
---


# Data, privacy, and security for Azure AI Content Safety

This article provides details regarding how data provided by you to Azure AI Content Safety is processed, used, and stored. Azure AI Content Safety stores and processes data to provide the service and to monitor for uses that violate the applicable product terms. Please also see the [Microsoft Products and Services Data Protection Addendum](https://aka.ms/DPA), which governs data processing by Azure AI Content Safety except as otherwise provided in the applicable preview terms.

Azure AI Content Safety was designed with privacy and security in mind; however, the customer is responsible for its use and the implementation of this technology.

## Data provided to us to improve your use of the service

You may (but are not required to) provide us with real examples of your content with which you're using the Azure AI Content Safety and/or examples of content and associated predictive severity levels ("Sample Content"). If you choose to provide us with this data, we may manually review it to (1) improve your experience with Azure AI Content Safety and (2) improve the quality of Azure AI Content Safety.

### If you provide Sample Content to us:

- You agree that you will not include any personal, confidential, or commercially sensitive information in the Sample Content you send us.
- You consent to permit authorized engineers, data scientists, and project teams (collectively, "Reviewers") from Microsoft to manually review the Sample Content to build, improve, and validate the machine learning models for Azure AI Content Safety ("Improvements"). We will review the Sample Content to improve the customer experience with better machine learning implementations. Manual review of the Sample Content is needed to achieve that outcome. You may revoke your consent to our human review of your Sample Content at any time by giving the project manager working with you written notice, and we will delete the Sample Content from our systems promptly upon receipt of such notice. Deletion of Sample Content will not impact prior Improvements, which may not be deleted.
- The project manager working with you will provide instructions for sending any Sample Content you choose to provide to us. Only Reviewers with permissions will be able to access and view your sample content, solely for the purposes described here, and such Reviewers will only use secure workstations to do so.
- As between you and Microsoft: (a) all Sample Content remains yours and (b) all Improvements, and any work product or developments (such as coding or documentation) resulting from Microsoft's use of Sample Content, will be owned by Microsoft. In addition, all Sample Content will remain your Confidential Information and all Improvements will remain Microsoft's Confidential Information.

## How is data retained and what customer controls are available?

Azure AI Content Safety works to filter harmful content. This system works by running the input through an ensemble of classification models. Once your Azure AI Content Safety resource is created, you can submit text and images to the model through the REST API, client libraries, or the Azure AI Content Safety Studio; the model generates outputs that are returned through the API.

No input texts or images are stored in the model during detection (except for customer-supplied blocklists, as discussed below), and user inputs are not used to train, retrain, or improve the Azure AI Content Safety models.

- **Blocklist data**. The Blocklist API allows customers to upload their block items for the purpose of supplementing the Azure AI Content Safety model.  **Block Item data is stored in Azure Storage, encrypted at rest by Microsoft Managed keys, within the same region as the resource and logically isolated with the customer's Azure subscription and API Credentials**. Uploaded items can be deleted by the user via the DELETE API operation. Block Items are not used to improve the Azure AI Content Safety models.

To learn more about Microsoft's privacy and security commitments visit the [Microsoft Trust Center](https://www.microsoft.com/TrustCenter/CloudServices/Azure/default.aspx).

## Is customer data processed by Azure Content Safety transmitted outside of the**  **Azure AI Content Safety service or the selected region?

No. Microsoft hosts the Azure AI Content Safety models within our Azure infrastructure. All customer data sent to Azure AI Content Safety remains within Azure AI Content Safety and in the region you chose and will not be transmitted to other regions.

## Is customer data used to train the Azure Content Safety models?

No. We do not use customer data to train, retrain or improve the models in Azure AI Content Safety.

## Feedback and Reporting**

If you have feedback on Azure AI Content Safety; suspect that Azure AI Content Safety is being used in a manner that is abusive or illegal, infringes on your rights or the rights of other people, or violates these policies; or if the system fails to block harmful content that you believe should have been filtered, please report it to this [email](mailto:acm-team@microsoft.com).