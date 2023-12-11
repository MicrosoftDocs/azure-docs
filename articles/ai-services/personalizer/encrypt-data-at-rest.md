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

[!INCLUDE [cognitive-services-cmk](../includes/configure-customer-managed-keys.md)]

## Next steps

* [Learn more about Azure Key Vault](../../key-vault/general/overview.md)
