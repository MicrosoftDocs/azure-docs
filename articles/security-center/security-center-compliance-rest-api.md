---
title: Azure Security Center compliance monitoring using the REST API | Microsoft Docs
description: Review results of automated compliance scans using the Azure Security Center REST API.
services: security-center
documentationcenter: na
author: rloutlaw
manager: angerobe
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/23/2018
ms.author: rloutlaw

---

# Review Security Center compliance results using the Azure REST APIs

In this article, you learn to retrieve the security compliance information for a list of subscriptions using the Azure REST APIs.

## Review compliance for each subscription

The below example gets security assessement information for a given compliance and subscription using the [Get Compliances](/rest/api/securitycenter/compliances/get) operation.

```http
GET https://management.azure.com/subscriptions/{subscription-id}/providers/Microsoft.Security/compliances/{complianceName}?api-version=2017-08-01-preview
```

The `{complianceName}` parameter is required and should contain the name of the assessed compliance for `{subscription-id}`. Output will contain the assessment results, such as:

```json
{
...
  "properties": {
    "assessmentResult": [
      {
        "segmentType": "Compliant",
        "percentage": 77.777777777777786
      }
    ],
    "resourceCount": 18,
    "assessmentTimestampUtcDate": "2018-01-01T00:00:00Z"
  }
}
```

## Review compliance for multiple subscriptions

To get data for multiple subscriptions, make the call below to first get a list of subscriptions using the [List Subscriptions](/rest/api/resources/subscriptions/list) operation. The invoke the above [Get Compliances](/rest/api/securitycenter/compliances/get) for each of the returned subscription IDs.

The API call is:

```http
GET https://management.azure.com/subscriptions?api-version=2016-06-01
```

Which returns an array of with values such as the following. Use the subscriptionId values in the above call to review the compliance information for all subscriptions.

```json
"value": [
    {
      "id": "/subscriptions/{subscription-id}",
      "subscriptionId": "{subscription-id}",
      "displayName": "Demo subscription",
      ...
    }
```






