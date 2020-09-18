---
title: 'How To: Use secrets from key vault in calling web endpoints'
titleSuffix: Azure Cognitive Services
description: In this article, we explain how to use secrets from your key vault in calling web endpoints.
services: cognitive-services
author: nateko
manager: yetian
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/15/2020
ms.author: sausin
---


# Reference key vault stored secrets in calling web endpoints

Web endpoints often require sensitive data such as api-key passed in to execute. In this article, you will learn how to include such sensitive data in calling web endpoints in a custom commands application by referencing secrets stored in your key vault. Presuming you have secrets already stored in Azure key vault, this can be achieved in two simple steps.

 - Create system-assigned [managed identity](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) for your speech resource and allow access to your key vault.
 - Configure and reference secrets in the key vault in web endpoints in a custom commands application.

## Prerequisites

You must have completed the steps in the following articles:

> [!div class="checklist"]
> * [How To: Set up web endpoints](./how-to-custom-commands-setup-web-endpoints.md)

The following articles provide background on azure key vault and managed identity, a feature of Azure AD:

> * [About Azure Key Vault](https://docs.microsoft.com/azure/key-vault/general/overview)
> * [What are managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview)

## Enable system-assigned managed identity for your speech resource and allow access to your key vault.

1. In Azure portal, find the speech resource you used to create the custom command application. Then, go to **Identity** tab.

  > [!div class="mx-imgBorder"]
  > ![Enable managed identity](media/custom-commands/how-to-custom-commands-integrate-key-vault-enable-managed-identity.png?)

  If the Status is **Off**, switch to **On** and **Save**. You will be presented with an Object ID for the created identity as below.

  > [!div class="mx-imgBorder"]
  > ![Enabled managed identity](media/custom-commands/how-to-custom-commands-integrate-key-vault-enabled-managed-identity.png?)

2. To give the managed identity an access to your key vault. Locate the key vault in azure portal. Then, go to **Access Policies** tab.

  > [!div class="mx-imgBorder"]
  > ![Key vault access policies](media/custom-commands/how-to-custom-commands-integrate-key-vault-access-policies.png?)

  Click on **+ Add Access Policy**. Select **Get** operation under **Secret permissions**. Click on **Select principal** and locate the managed identity for the speech resource via Object ID or its name.

  > [!div class="mx-imgBorder"]
  > ![Add an access policy](media/custom-commands/how-to-custom-commands-integrate-key-vault-acccess-policy.png?)

## Referencing secrets in the key vault in calling web endpoints.

1. In Speech portal, go to Key vault configuration under **Settings > Key vault**. Enter the name of the key vault where secrets will be referenced from. Please also give the key vault a name, an alphanumeric string including dash, to reference in the application.

  > [!div class="mx-imgBorder"]
  > ![Custom Commands key vault setting](media/custom-commands/how-to-custom-commands-integrate-key-vault-settings.png?)

2. Finally, go to settings for the web endpoint. Click on **Add a header** or **Add a query parameter** depending on how you want to pass the secret to the endpoint. You can reference the key vault secret in this format `{Nickname.SecretName}`. In the example below, we are referencing a secret **PrimaryApiKey** stored in the key vault **Secrets** configured above. The secret is resolved at runtime and its value is set for the query parameter **ApiKey** for the endpoint.

  > [!div class="mx-imgBorder"]
  > ![Custom Commands referencing a key vault secret](media/custom-commands/how-to-custom-commands-integrate-key-vault-reference-secrets.png?)

  > [!NOTE]
  > - You can reference key vault secrets only in query or header parameters or in a part of the url of the web endpoints.

## Next steps

> [!div class="nextstepaction"]
> [Enable a CI/CD process for your Custom Commands application](./how-to-custom-commands-deploy-cicd.md)
