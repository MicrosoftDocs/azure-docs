---
author: tachou
ms.service: confidential-ledger
ms.topic: include
ms.date: 1/24/2023
ms.author: tachou

# Sign in to Azure from the CLI or PowerShell
---

## Sign in to Azure

[!INCLUDE [Sign in to Azure](../../../includes/confidential-ledger-sign-in-azure.md)]

Get the confidential ledger's name and the identity service URI from the Azure portal as it is needed to create a client to manage the users. This image shows the appropriate properties in the Azure portal.

:::image type="content" source="../media/ledger-properties.png" alt-text="A screenshot showing ledger properties in the Azure portal.":::

Replace instances of `contoso` and  `https://contoso.confidential-ledger.azure.com` in the following code snippets with the respective values from the Azure portal.