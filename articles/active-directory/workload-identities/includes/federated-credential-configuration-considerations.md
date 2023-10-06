---
title: Workload identity federation for app considerations
description: Important considerations and restrictions for creating a federated identity credential on an app. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: include
ms.date: 09/26/2022
ms.author: ryanwi
ms.reviewer: shkhalid, udayh, vakarand
ms.custom: aaddev
---

A maximum of 20 federated identity credentials can be added to an application or user-assigned managed identity.

When you configure a federated identity credential, there are several important pieces of information to provide:

- *issuer* and *subject* are the key pieces of information needed to set up the trust relationship. The combination of `issuer` and `subject` must be unique on the app.  When the external software workload requests Microsoft identity platform to exchange the external token for an access token, the *issuer* and *subject* values of the federated identity credential are checked against the `issuer` and `subject` claims provided in the external token. If that validation check passes, Microsoft identity platform issues an access token to the external software workload.

- *issuer* is the URL of the external identity provider and must match the `issuer` claim of the external token being exchanged. Required. If the `issuer` claim has leading or trailing whitespace in the value, the token exchange is blocked. This field has a character limit of 600 characters.
    
- *subject* is the identifier of the external software workload and must match the `sub` (`subject`) claim of the external token being exchanged. *subject* has no fixed format, as each IdP uses their own - sometimes a GUID, sometimes a colon delimited identifier, sometimes arbitrary strings. This field has a character limit of 600 characters.
    
    > [!IMPORTANT]
    > The *subject* setting values must exactly match the configuration on the GitHub workflow configuration.  Otherwise, Microsoft identity platform will look at the incoming external token and reject the exchange for an access token.  You won't get an error, the exchange fails without error.
    
    > [!IMPORTANT]
    > If you accidentally add the incorrect external workload information in the *subject* setting the federated identity credential is created successfully without error.  The error does not become apparent until the token exchange fails.

- *audiences* lists the audiences that can appear in the external token.  Required. You must add a single audience value, which has a limit of 600 characters. The recommended value is "api://AzureADTokenExchange". It says what Microsoft identity platform must accept in the `aud` claim in the incoming token.  

- *name* is the unique identifier for the federated identity credential. Required.  This field has a character limit of 3-120 characters and must be URL friendly. Alphanumeric, dash, or underscore characters are supported, the first character must be alphanumeric only.  It's immutable once created.

- *description* is the user-provided description of the federated identity credential.  Optional. The description isn't validated or checked by Microsoft Entra ID. This field has a limit of 600 characters.

Wildcard characters aren't supported in any federated identity credential property value.
