---
title: View authentication details for Microsoft Azure Maps
description: Use the Azure portal to view authentication details for Azure Maps.
author: anastasia-ms
ms.author: v-stharr
ms.date: 06/17/2020
ms.topic: include
ms.service: azure-maps
services: azure-maps
manager: philmea
---


To view Azure Maps account authentication details in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Navigate to the Azure portal menu. Select **All resources**, and then select your Azure Maps account.

      :::image type="content" border="true" source="../media/how-to-manage-authentication/select-all-resources.png" alt-text="Select Azure Maps account.":::

3. Select **Authentication** in the **Settings** menu.

      :::image type="content" border="true" source="../media/how-to-manage-authentication/view-authentication-keys.png" alt-text="Authentication details.":::

Once an Azure Maps account is created, the Azure Maps `x-ms-client-id` value is present in the Azure portal authentication details page. This value represents the account that will be used for REST API requests. This `x-ms-client-id` value should be stored in application configuration, and should be retrieved prior to making Azure Maps HTTP requests with Azure AD authentication.
