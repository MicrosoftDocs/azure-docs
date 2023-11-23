---
title: Data, privacy, and security for Azure AI Health Insights
titleSuffix: Azure AI Health Insights
description: details regarding how Azure AI Health Insights processes your data.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# Data, privacy, and security for Azure AI Health Insights

This article provides high level details regarding how Azure AI Health Insights processes data provided by customers. As an important reminder, you're responsible for the implementation of your use case and are required to obtain all necessary permissions or other proprietary rights required to process the data you send to the system. It's your responsibility to comply with all applicable laws and regulations in your jurisdiction.


## What data does it process and how?  

Azure AI Health Insights:
- processes text from the patient's clinical documents that are sent by the customer to the system for the purpose of inferring cancer attributes. 
- uses aggregate telemetry such as which APIs are used and the number of calls from each subscription and resource for service monitoring purposes. 
- doesn't store or process customer data outside the region where the customer deploys the service instance.
- encrypts all content, including patient data, at rest.


## How is data retained?

- The input data sent to Azure AI Health Insights is temporarily stored for up to 24 hours and is purged thereafter.
- Azure AI Health Insights response data is temporarily stored for 24 hours and is purged thereafter.
- During requests' and responses, the data is encrypted and only accessible to authorized on-call engineers for service support, if there's a catastrophic failure. Should on-call engineers access this data, internal audit logs track these operations. 
- There are no customer controls available at this time.

To learn more about Microsoft's privacy and security commitments, visit the [Microsoft Trust Center](https://www.microsoft.com/trust-center).
