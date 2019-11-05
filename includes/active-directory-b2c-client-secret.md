---
author: mmacy
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 10/16/2019
ms.author: marsma
# Typically used by articles that include app registration, API permission, or
# automated tool (e.g. script) configuration.
---
#### [Applications](#tab/applications/)

1. Under **API ACCESS**, select **Keys**.
1. Enter a description for the key in the **Key description** box. For example, *clientsecret1*.
1. Select a validity **Duration** and then select **Save**.
1. Record the key's **VALUE**. You use this value for configuration in a later step.

#### [App registrations (Preview)](#tab/app-reg-preview/)

1. Under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **VALUE**. You use this value for configuration in a later step.