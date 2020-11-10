---
title: Quickstart - Create and manage access tokens
titleSuffix: An Azure Communication Services quickstart
description: Learn how to manage identities and access tokens using the Azure Communication Services Administration client library.
author: tomaschladek
manager: nmurav
services: azure-communication-services
ms.author: tchladek
ms.date: 08/20/2020
ms.topic: quickstart
ms.service: azure-communication-services
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Create and manage access tokens

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

Get started with Azure Communication Services by using the Communication Services Administration client library to create identities and manage your access tokens. Identity is representing entity of your application in the Azure Communication Service (e.g. user or device). Access tokens let your Chat and Calling client libraries authenticate directly against Azure Communication Services. These access tokens are recommended to be generated on a server-side service that you implement. They're then used to initialize the Communication Services client libraries on client devices.

Note that any prices seen in images throughout this tutorial are for example purposes only.

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

Created an identity: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

Issued a access token with 'voip' scope for identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502:
<token signature here>

Successfully deleted the identity with ID: 8:acs:4ccc92c8-9815-4422-bddc-ceea181dc774_00000006-19e0-2727-80f5-8b3a0d003502

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
> * Use the Communication Services Administration client library


> [!div class="nextstepaction"]
> [Add voice calling to your app](./voice-video-calling/getting-started-with-calling.md)

You may also want to:

 - [Learn about authentication](../concepts/authentication.md)
 - [Add chat to your app](./chat/get-started.md)
 - [Learn about client and server architecture](../concepts/client-and-server-architecture.md)
 