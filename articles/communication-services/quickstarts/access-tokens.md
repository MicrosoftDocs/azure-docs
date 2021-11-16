---
title: Quickstart - Create and manage access tokens
titleSuffix: An Azure Communication Services quickstart
description: Learn how to manage identities and access tokens using the Azure Communication Services Identity SDK.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: identity
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Create and manage access tokens

Access tokens let ACS SDKs [authenticate](../concepts/authentication.md) directly against Azure Communication Services as a particular identity. You'll need to create some if you want your users to join a call or chat thread within your application. 

You can also use the ACS SDKs to create identities and manage your access tokens and in this quickstart we'll be learning how to do this. For production use cases we recommend generating access tokens on a [server-side service](../concepts/client-and-server-architecture.md).

Any prices seen in images throughout this tutorial are for demonstration purposes only.

::: zone pivot="programming-language-csharp"
[!INCLUDE [.NET](./includes/user-access-token-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [JavaScript](./includes/user-access-token-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Python](./includes/user-access-token-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Java](./includes/user-access-token-java.md)]
::: zone-end

The output of the app describes each action that is completed:
<!---cSpell:disable --->
```console
Azure Communication Services - Access Tokens Quickstart

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Issued an access token with 'voip' scope that expires at 30/03/21 08:09 09 AM:
<token signature here>

Created an identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-1ce9-31b4-54b7-a43a0d006a52

Issued an access token with 'voip' scope that expires at 30/03/21 08:09 09 AM:
<token signature here>

Successfully revoked all access tokens for identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Deleted the identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502
```
<!---cSpell:enable --->

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](./create-communication-resource.md#clean-up-resources).

## Next Steps

In this quickstart, you learned how to:

> [!div class="checklist"]
> * Manage identities
> * Issue access tokens
> * Use the Communication Services Identity SDK


> [!div class="nextstepaction"]
> [Add voice calling to your app](./voice-video-calling/getting-started-with-calling.md)

You may also want to:

 - [Learn about authentication](../concepts/authentication.md)
 - [Add chat to your app](./chat/get-started.md)
 - [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
