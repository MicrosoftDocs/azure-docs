---
title: Disable local (access key) authentication with Azure Web PubSub
description: Learn how to disable access key authentication and use only Microsoft Entra authorization with Azure Web PubSub.
author: terencefan

ms.author: tefa
ms.date: 03/31/2023
ms.service: azure-web-pubsub
ms.custom: devx-track-arm-template
ms.topic: conceptual
---

# Disable local (access key) authentication with Azure Web PubSub

Azure Web PubSub resources can authenticate requests in two ways: via a Microsoft Entra ID or via an access key. Microsoft Entra ID provides superior security and ease of use over an access key. If you use Microsoft Entra ID, you don't need to store the tokens in your code and risk potential security vulnerabilities. We recommend that you use Microsoft Entra ID with your Web PubSub resources when possible.

> [!IMPORTANT]
> Disabling local authentication might have the following results:
>
> - The current set of access keys is permanently deleted.
> - Tokens that are signed by using the current set of access keys become unavailable.
> - A signature will *not* be attached in the upstream request header. Learn how to [validate an access token](./howto-use-managed-identity.md#validate-access-tokens) .

## Use the Azure portal

To disable local authentication by using the Azure portal:

1. In the [Azure portal](https://portal.azure.com), go to your Web PubSub resource.

2. On the left menu under **Settings**, select **Keys**.

3. For local authentication, select **Disabled**.

4. Select **Save**.

![Screenshot that shows disabling local authentication.](./media/howto-disable-local-auth/disable-local-auth.png)

## Use an Azure Resource Manager template

You can disable local authentication by setting `disableLocalAuth` property to `true` as shown in the following Azure Resource Manager template:

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
      "type": "Microsoft.SignalRService/WebPubSub",
      "apiVersion": "2022-08-01-preview",
      "name": "[parameters('resource_name')]",
      "location": "eastus",
      "sku": {
        "name": "Premium_P1",
        "tier": "Premium",
        "size": "P1",
        "capacity": 1
      },
      "properties": {
        "tls": {
          "clientCertEnabled": false
        },
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

## Use Azure Policy

You can assign the policy [Azure Web PubSub Service should have local authentication methods disabled](https://ms.portal.azure.com/#view/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fb66ab71c-582d-4330-adfd-ac162e78691e) in Azure Policy to an Azure subscription or to a resource group to enforce disabling local authentication for all Web PubSub resources in the subscription or resource group.

![Screenshot that shows disabling local authentication policy.](./media/howto-disable-local-auth/disable-local-auth-policy.png)

## Related content

- [Overview of Microsoft Entra ID for Web PubSub](concept-azure-ad-authorization.md)
- [Authenticate with Azure applications](./howto-authorize-from-application.md)
- [Authenticate with managed identities](./howto-authorize-from-managed-identity.md)
