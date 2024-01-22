---
title: Disable local (access key) authentication with Azure SignalR Service
description: This article provides information about how to disable access key authentication and use only Microsoft Entra authorization with Azure SignalR Service.
author: terencefan

ms.author: tefa
ms.date: 03/31/2023
ms.service: signalr
ms.custom: devx-track-arm-template
ms.topic: conceptual
---

# Disable local (access key) authentication with Azure SignalR Service

There are two ways to authenticate to Azure SignalR Service resources: Microsoft Entra ID and access key. Microsoft Entra ID offers superior security and ease of use compared to the access key method.

With Microsoft Entra ID, you don't need to store tokens in your code, reducing the risk of potential security vulnerabilities. We highly recommend using Microsoft Entra ID for your Azure SignalR Service resources whenever possible.

> [!IMPORTANT]
> Disabling local authentication can have the following consequences:
>
> - The current set of access keys is permanently deleted.
> - Tokens signed with the current set of access keys become unavailable.

## Use the Azure portal

In this section, you learn how to use the Azure portal to disable local authentication.

1. In the [Azure portal](https://portal.azure.com), go to your Azure SignalR Service resource.

2. In the **Settings** section of the menu sidebar, select **Keys**.

3. For **Access Key**, select **Disable**.

4. Select the **Save** button.

![Screenshot of selections for disabling local authentication in the Azure portal.](./media/howto-disable-local-auth/disable-local-auth.png)

## Use an Azure Resource Manager template

You can disable local authentication by setting the `disableLocalAuth` property to `true`, as shown in the following Azure Resource Manager template:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resource_name": {
      "defaultValue": "test-for-disable-aad",
      "type": "String"
    }
  },
  "variables": {},
  "resources": [
    {
      "type": "Microsoft.SignalRService/SignalR",
      "apiVersion": "2022-08-01-preview",
      "name": "[parameters('resource_name')]",
      "location": "eastus",
      "sku": {
        "name": "Premium_P1",
        "tier": "Premium",
        "size": "P1",
        "capacity": 1
      },
      "kind": "SignalR",
      "properties": {
        "tls": {
          "clientCertEnabled": false
        },
        "features": [
          {
            "flag": "ServiceMode",
            "value": "Default",
            "properties": {}
          },
          {
            "flag": "EnableConnectivityLogs",
            "value": "True",
            "properties": {}
          }
        ],
        "cors": {
          "allowedOrigins": ["*"]
        },
        "serverless": {
          "connectionTimeoutInSeconds": 30
        },
        "upstream": {},
        "networkACLs": {
          "defaultAction": "Deny",
          "publicNetwork": {
            "allow": [
              "ServerConnection",
              "ClientConnection",
              "RESTAPI",
              "Trace"
            ]
          },
          "privateEndpoints": []
        },
        "publicNetworkAccess": "Enabled",
        "disableLocalAuth": true,
        "disableAadAuth": false
      }
    }
  ]
}
```

## Use an Azure policy

To enforce disabling of local authentication for all Azure SignalR Service resources in an Azure subscription or a resource group, you can assign the following Azure policy: [Azure SignalR Service should have local authentication methods disabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Ff70eecba-335d-4bbc-81d5-5b17b03d498f).

![Screenshot that shows disabling local authentication by using a policy.](./media/howto-disable-local-auth/disable-local-auth-policy.png)

## Next steps

See the following articles to learn about authentication methods:

- [Authorize access with Microsoft Entra ID for Azure SignalR Service](signalr-concept-authorize-azure-active-directory.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra applications](./signalr-howto-authorize-application.md)
- [Authorize requests to Azure SignalR Service resources with Microsoft Entra managed identities](./signalr-howto-authorize-managed-identity.md)
