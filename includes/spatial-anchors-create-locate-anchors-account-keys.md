---
author: pamistel
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 11/20/2020
ms.author: pamistel
---
## Set up authentication

To access the service, you need to provide an account key, access token, or Microsoft Entra auth token. You can also read more about this in the [Authentication concept page](../articles/spatial-anchors/concepts/authentication.md).

### Account Keys

Account Keys are a credential that allows your application to authenticate with the Azure Spatial Anchors service. The intended purpose of Account Keys is to help you get started quickly. Especially during the development phase of your application's integration with Azure Spatial Anchors. As such, you can use Account Keys by embedding them in your client applications during development. As you progress beyond development, it's highly recommended to move to an authentication mechanism that is production-level, supported by Access Tokens, or Microsoft Entra user authentication. To get an Account Key for development, visit your Azure Spatial Anchors account, and navigate to the "Keys" tab.
