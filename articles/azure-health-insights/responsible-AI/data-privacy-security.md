---
title: Data, privacy, and security for Azure Health Insights
titleSuffix: Azure Health Insights
description: details regarding how Azure Health Insights processes your data.
services: azure-health-insights
author: iBoonZ
manager: urieinav
ms.service: azure-health-insights
ms.topic: overview
ms.date: 01/26/2023
ms.author: behoorne
---


# Data, privacy, and security for Azure Health Insights

This article provides some high level details regarding how the Health Insights processes data provided by customers. As an important reminder, you are responsible for the implementation of your use case and are required to obtain all necessary permissions or other proprietary rights required to process the data you send to the system. It is your responsibility to comply with all applicable laws and regulations in your jurisdiction.


## What data does Azure Health Insights process and how does it process it?

The Azure Health Insights:
- processes text from the patient's clinical documents that are sent by the customer to the system for the purpose of inferring cancer attributes. 
- uses aggregate telemetry such as which APIs are used and the number of calls from each subscription and resource for service monitoring purposes. 
- doesn't store or process customer data outside the region where the customer deploys the service instance.
- encrypts all content, including customer data, at rest.


## How is data retained and what customer controls are available?

- The data sent to the Azure Health Insights is temporarily stored for up to 24 hours and is purged thereafter.
- The Azure Health Insights job response data is temporarily stored for 24 hours and is purged thereafter.
- During their transient existence, both request and response data are encrypted and are only accessible to authorized on-call engineers for service support in the event of a catastrophic failure. Should on-call engineers access this data, internal audit logs track such operations. 
- There are no customer controls available at this time.

To learn more about Microsoft's privacy and security commitments, visit the [Microsoft Trust Center](https://www.microsoft.com/trust-center).
