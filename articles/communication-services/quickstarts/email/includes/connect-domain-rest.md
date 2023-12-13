---
title: include file
description: include file
author: yogeshmo
manager: koagbakp
services: azure-communication-services
ms.author: yogeshmo
ms.date: 05/24/2023
ms.topic: include
ms.service: azure-communication-services
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free.](https://azure.microsoft.com/free/dotnet/).
- An Azure Email Communication Services Resource ready to provision domains. [Get started creating an Email Communication Resource](../create-email-communication-resource.md).
- An [Azure Managed Domain](../add-azure-managed-domains.md) or [Custom Domain](../add-custom-verified-domains.md) provisioned and ready to send emails. This domain must be fully verified before attempting to link it to the Communication Service resource.
- An Azure Communication Services Resource. [Create a Communication Services Resources.](../../create-communication-resource.md)

## Connect an email domain to a Communication Service Resource

Replace the `{subscription-id}`, `{resource-group-name}`, `{communication-services-resource-name}`, and `{linked-domain-resource-id}` in the sample request.

The linked domain resource ID should be in the following format. 

```
/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Communication/emailServices/{email-service-name}/domains/{domain-name}
```

If you are using an Azure Managed Domain, the `domain-name` is "AzureManagedDomain". The `email-service-name` should be the same email service that you used to provision the domain.

Once these values are populated make a PATCH request to the using the following Request URL and Body. 

```
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Communication/CommunicationServices/{communication-services-resource-name}?api-version=2023-03-31
```

```
{
    "properties": {
        "linkedDomains": ["{linked-domain-resource-id}"]
    }
}
```

## Disconnect an email domain from the Communication Service Resource

Replace the `{subscription-id}`, `{resource-group-name}`, and `{communication-services-resource-name}` in the sample request.

Once these values are populated, make a PATCH request to the using the following Request URL and Body. 

```
https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.Communication/CommunicationServices/{communication-services-resource-name}?api-version=2023-03-31
```

```
{
    "properties": {
        "linkedDomains": []
    }
}
```