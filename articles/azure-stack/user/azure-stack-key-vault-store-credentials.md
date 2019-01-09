---
title: Azure Stack store service principal credentials in Key Vault | Microsoft Docs
description: Learn how Key Vault stores service principal credentials on Azure Stack
services: azure-stack
documentationcenter: ''
author: sethmanheim
manager: femila
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/10/2019
ms.author: sethm

---

# Store service principal credentials in Key Vault

Developing applications on Azure Stack typically requires creating a service principal and using those credentials to authenticate before deploying. However, often the stored credentials for the service principal are misplaced. This article describes how to create a service principal and store the values in Azure Key Vault for later retrieval.

For more information about Key Vault, see [this article](azure-stack-key-vault-intro.md).

## Prerequisites

- A subscription to an offer that includes the Azure Key Vault service.
- PowerShell is configured for use with Azure Stack.

## Key Vault in Azure Stack

Key Vault in Azure Stack helps to safeguard cryptographic keys and secrets that cloud applications and services use. By using Key Vault, you can encrypt keys and secrets.

To create a key vault, follow these steps:

1. Sign in to the Azure Stack portal.

2. From the dashboard, select **+ Create a resource**, then **Security + Identity**, then select **Key Vault.**

   ![Create key vault](media/azure-stack-key-vault-store-credentials/create-key-vault.png)

3. In the **Create Key Vault** pane, assign a **Name** for your vault. Vault names can contain only alphanumeric characters and the hyphen (-) character. They should not start with a number.

4. Choose a subscription from the list of available subscriptions.

5. Select an existing resource group or create a new one.

6. Select the pricing tier.

7. Choose one of the existing access policies or create a new one. An access policy enables you to grant permissions for a user, application, or a security group to perform operations with this vault.

8. Optionally, choose an advanced access policy to enable access to features.

9. After you configure the settings, select **OK**, and then select **Create**. The key vault deployment begins.

## Create a service principal

1. Sign in to your Azure account through the Azure portal.

2. Select **Azure Active Directory**, then **App registrations**, then **Add**.

3. Provide a name and URL for the application. Select either **Web app / API** or **Native** for the type of application you want to create. After setting the values, select **Create**.

4. Select **Active Directory**, then **App Registrations**, and select your application.

5. Copy the **Application ID** and store it in your application code. The applications in the sample applications use **client ID** when referring to the **Application ID**.

6. To generate an authentication key, select **Keys**.

7. Provide a description for the key, and a duration.

8. Select **Save**.

9. Copy the **key** that becomes available after you clicked **Save**.

## Store the service principal inside Key Vault

1. Sign in to the user portal for Azure Stack, then select the key vault that you created earlier, and then select the **Secret** tile.

2. In the **Secret** pane, select **Generate/Import**.

3. In the **Create a secret** pane, from the list of options select **Manual**.

4. Enter **the Application ID** copied from the service principal as the name for your key. The key name can contain only alphanumeric characters and the hyphen (-) character.

5. Paste the value of your key from the service principal into the **Value** tab.

6. Select **Service Principal** for the **Content type**.

7. Set the **activation date** and **expiration date** values for your key.

8. Select **Create** to start the deployment.

After the secret is successfully created, the service principal information will be stored there. You can select it at any time under **Secrets**, and view or modify its properties. The properties section contains the secret identifier, which is a Uniform Resource Identifier (URI) that external applications use to access this secret.

## Next steps

- [Use service principals](azure-stack-create-service-principals.md)
- [Manage Key Vault in Azure Stack by the portal](azure-stack-key-vault-manage-portal.md)  
- [Manage Key Vault in Azure Stack by using PowerShell](azure-stack-key-vault-manage-powershell.md)