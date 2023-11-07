---
title: Data-at-rest encryption in Personalizer
titleSuffix: Azure AI services
description: Learn about the keys that you use for data-at-rest encryption in Personalizer. See how to use Azure Key Vault to configure customer-managed keys.
author: jcodella
manager: venkyv
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 06/02/2022
ms.author: jacodel
ms.custom: kr2b-contr-experiment
#Customer intent: As a user of the Personalizer service, I want to learn how encryption at rest works.
---

# Encryption of data at rest in Personalizer

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Personalizer is a service in Azure AI services that uses a machine learning model to provide apps with user-tailored content. When Personalizer persists data to the cloud, it encrypts that data. This encryption protects your data and helps you meet organizational security and compliance commitments.

[!INCLUDE [cognitive-services-about-encryption](../includes/cognitive-services-about-encryption.md)]

> [!IMPORTANT]
> Customer-managed keys are only available with the E0 pricing tier. To request the ability to use customer-managed keys, fill out and submit the [Personalizer Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk). It takes approximately 3-5 business days to hear back about the status of your request. If demand is high, you might be placed in a queue and approved when space becomes available.
>
> After you're approved to use customer-managed keys with Personalizer, create a new Personalizer resource and select E0 as the pricing tier. After you've created that resource, you can use Azure Key Vault to set up your managed identity.

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* [Personalizer Service Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
* [Learn more about Azure Key Vault](../../key-vault/general/overview.md)
