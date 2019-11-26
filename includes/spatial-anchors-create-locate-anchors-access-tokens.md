---
author: ramonarguelles
ms.service: azure-spatial-anchors
ms.topic: include
ms.date: 02/21/2019
ms.author: rgarcia
---
### Access Tokens

Access Tokens are a more robust method to authenticate with Azure Spatial Anchors. Especially as you prepare your application for a production deployment. The summary of this approach is to set up a back-end service that your client application can securely authenticate with. Your back-end service interfaces with AAD at runtime and with the Azure Spatial Anchors Secure Token Service to request an Access Token. This token is then delivered to the client application and used in the SDK to authenticate with Azure Spatial Anchors.
