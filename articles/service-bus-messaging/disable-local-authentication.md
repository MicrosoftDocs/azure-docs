---
title: Disable local authentication with Azure Service Bus
description: This article explains how to disable local or Shared Access Signature key authentication for a Service Bus namespace. 
ms.topic: how-to
ms.date: 02/01/2022 
---

# Disable local or shared access key authentication with Azure Service Bus
There are two ways to authenticate to Azure Service Bus resources: Azure Active Directory (Azure AD) and Shared Access Signatures (SAS). Azure AD provides superior security and ease of use over shared access signatures (SAS). With Azure AD, there’s no need to store the tokens in your code and risk potential security vulnerabilities. We recommend that you use Azure AD with your Azure Service Bus applications when possible.

This article explains how to disable SAS key authentication and use only Azure AD for authentication. 

## Use portal to disable local auth
In this section, you learn how to use the Azure portal to disable local authentication. 

1. Navigate to your Service Bus namespace in the [Azure portal](https://portal.azure.com).
1. In the **Essentials** section of the **Overview** page, select **Enabled**, for **Local Authentication**. 

    :::image type="content" source="./media/disable-local-authentication/portal-overview-enabled.png" alt-text="Image showing the Overview page of a Service Bus namespace with Local Authentication set to Enabled.":::
1. On the **Local Authentication** page, select **Disabled**, and select **OK**. 

      :::image type="content" source="./media/disable-local-authentication/select-disabled.png" alt-text="Disable location.":::

## Use Resource Manager template to disable local auth
You can disable local authentication for a Service Bus namespace by setting `disableLocalAuth` property to `true` as shown in the following Azure Resource Manager template.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespace_name": {
            "defaultValue": "spcontososbusns",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.ServiceBus/namespaces",
            "apiVersion": "2021-06-01-preview",
            "name": "[parameters('namespace_name')]",
            "location": "East US",
            "sku": {
                "name": "Standard",
                "tier": "Standard"
            },
            "properties": {
                "disableLocalAuth": true,
                "zoneRedundant": false
            }
        }
    ]
}
``` 

### Parameters.json

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namespace_name": {
            "value": null
        }
    }
}
```

## Azure policy
You can assign the [disable local auth](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fcfb11c26-f069-4c14-8e36-56c394dae5af)  Azure policy to an Azure subscription or a resource group to enforce disabling of local authentication for all Service Bus namespaces in the subscription or the resource group.

:::image type="content" source="./media/disable-local-authentication/azure-policy.png" alt-text="Azure policy to disable location authentication.":::

## Next steps
See the following to learn about Azure AD and SAS authentication. 

- [Authentication with SAS](service-bus-sas.md) 
- Authentication with Azure AD
    - [Authenticate with managed identities](service-bus-managed-service-identity.md)
    - [Authenticate from an application](authenticate-application.md)