---
title: Enable the Azure Firewall public preview
description: Use Azure PowerShell to enable the Azure Firewall public preview
author: vhorne
ms.service: firewall
services: firewall
ms.topic: article
ms.date: 7/11/2018
ms.author: victorh
---

# Enable the Azure Firewall public preview

[!INCLUDE [firewall-preview-notice](../../includes/firewall-preview-notice.md)]

## Enable using Azure PowerShell

To enable the Azure Firewall public preview, use the following Azure PowerShell commands:

```PowerShell
Register-AzureRmProviderFeature -FeatureName AllowRegionalGatewayManagerForSecureGateway -ProviderNamespace Microsoft.Network

Register-AzureRmProviderFeature -FeatureName AllowAzureFirewall -ProviderNamespace Microsoft.Network
```

It takes up to 30 minutes for feature registration to complete. You can check your registration status by running the following Azure PowerShell commands:

```PowerShell

Get-AzureRmProviderFeature -FeatureName AllowRegionalGatewayManagerForSecureGateway -ProviderNamespace Microsoft.Network

Get-AzureRmProviderFeature -FeatureName AllowAzureFirewall -ProviderNamespace Microsoft.Network
```
After the registration is complete, run the following command:

```PowerShell
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
```

## Next steps

- [Tutorial: Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal.md)

