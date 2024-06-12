---
title: How to use managed identities for Azure percept
description: Step-by-step instructions for creating managed identities for Azure percept
services: azure-percept
documentationcenter: ''
editor: ''

ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/20/2022
ms.collection: M365-identity-device-management
---

# How to use managed identities for Azure Percept

This article shows you how to create a managed identity for Azure percept and how to use it to access other resources.


A managed identity from Azure Active Directory (Azure AD) allows your percept account to easily access other Azure AD-protected resources such as Azure Key Vault. The identity is managed by the Azure platform and does not require you to provision or rotate any secrets. For more about managed identities in Azure AD, see Managed identities for Azure resources.

Your percept accoount can be granted two types of identities:

 1. A system-assigned identity is tied to your percept account and is deleted if your account is deleted. An account can only have one system-assigned identity.
 2. A user-assigned identity is a standalone Azure resource that can be assigned to your percept account. An account can have multiple user-assigned identities.

## Add a system-assigned identity

# [Azure portal](#tab/portal)

1. Navigate to the subscriptions page and search for your subscriptionp.

1. Select your subscription.

1. Search for the identity you created earlier and select it.

1. Within the **System assigned** tab, select **Status** **On**. Click **Save**.

    ![image](./media/systemidentity.png)




## Add a user-assigned identity

Creating a percept account with a user-assigned identity requires that you create the identity and then add its resource identifier to your percept account's config.

# [Azure portal](#tab/portal)

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

1. Navigate to the subscriptions page and search for your subscription.

1. Select your subscription.

1. Search for the identity you created earlier and select it.

1. Click **Add**.

    ![image](./media/user-identity.png)
    



## Configure target resource

You may need to configure the target resource to allow access from your percept account. For example, if you [request a token](#connect-to-azure-services-in-app-code) to access IOT Hub, you must also add an access policy that includes the managed identity of your percept account. Otherwise, your calls to IOT Hub will be rejected, even if you use a valid token. The same is true for Cognitive Service.

> [!IMPORTANT]
> The back-end services for managed identities maintain a cache per resource URI for around 24 hours. If you update the access policy of a particular target resource and immediately retrieve a token for that resource, you may continue to get a cached token with outdated permissions until that token expires. There's currently no way to force a token refresh.


## <a name="remove"></a>Remove an identity

When you remove a system-assigned identity, it's deleted from Azure Active Directory. System-assigned identities are also automatically removed from Azure Active Directory when you delete the percept account resource itself.

# [Azure portal](#tab/portal)

1. Navigate to the subscriptions page and search for your subscription.

1. SSearch for the identity you created earlier and select it. Then follow the steps based on the identity type:

    - **System-assigned identity**: Within the **System assigned** tab, select **Status** **Off**. Click **Save**.
    - **User-assigned identity**: Click the **User assigned** tab, select the checkbox for the identity, and click **Remove**. Click **Yes** to confirm.



