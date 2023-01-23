---
title: Rotate your Azure Communications Gateway secrets
description: Learn how to rotate your secrets to keep your Azure Communications Gateway secure.
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 01/12/2023
---

# Rotate your Azure Communications Gateway secrets

This article will guide you through how to rotate secrets for your Azure Communications Gateway. It's important to ensure that secrets are rotated regularly, and that you're aware and familiar with the mechanism for rotating them. Being familiar with this procedure is important because you may sometimes be required to perform an immediate rotation, for example, if the secret was leaked. Our recommendation is that these secrets are rotated at least **every 70 days**.

Azure Communication Gateway uses an App registration to manage access to the Operator Connect API. This App registration uses secrets stored and managed in your subscription. For more information, see [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md).

## Prerequisites

You must know the name of the App registration and the Key Vault you created in [Prepare to deploy Azure Communications Gateway](deploy.md). We recommended using **Azure Communications Gateway service** as the name of the App registration.

## 1. Rotate your secret for the App registration.

We store both the secret and its associated identity, but only the secret needs to be rotated. 

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as a **Storage Account Key Operator**, **Contributor** or **Owner**.
1. Navigate to **App registrations** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **App registrations**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. In the App registrations search box, type **Azure Communications Gateway service** (or the name of the App registration if you chose a different name).
1. Select the application.
1. In the left hand menu, select **Certificates and secrets**.
1. You should see the secret you created in [Prepare to deploy your Azure Communications Gateway](prepare-to-deploy.md).
    > [!NOTE]
    >If you need to immediately deactivate a secret and make it un-usable, select the bin icon to the right of the secret.
1. Select **New client secret**. 
1. Enter a name for the secret (we suggest that the name should include the date at which the secret is being created).
1. Enter an expiry date. The expiry date should sync with your rotation schedule.
1. Select **Add**. 
1. Copy or note down the value of the new secret (you won't be able to retrieve it later). If you navigate away from the page or refresh without collecting the value of the secret, you'll need to create a new one.

## 2. Update your Key Vault with the new secret value

Azure Key Vault is a cloud service for securely storing and accessing secrets. When you create a new secret for your App registration, you must add the value to your corresponding Key Vault. Add the value as a new version of the existing secret in the Key Vault. Azure Communications Gateway starts using the new value as soon as it makes a request for the value of the secret.

1. Sign in to the [Azure portal](https://ms.portal.azure.com/) as a **Storage Account Key Operator**, **Contributor** or **Owner**.
1. Navigate to **Key Vaults** in the Azure portal (select **Azure Active Directory** and then in the left-hand menu, select **Key Vaults**). Alternatively, you can search for it with the search bar: it will appear under the **Services** subheading.
1. Select the relevant Key Vault.
1. In the left hand menu, select **Secrets**.
1. Select the secret you're updating from the list.
1. In the top navigation menu, select **New version**.
1. In the **Secret value** textbox, enter the secret value you noted down in the previous procedure.
1. (Optional) Enter an expiry date for your secret. The expiry date should sync with your rotation schedule.
1. Select **Create**.


## Next steps

- Learn how [Azure Communications Gateway keeps your data secure](security.md).
