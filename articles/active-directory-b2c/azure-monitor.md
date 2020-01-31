---
title: Monitor Azure AD B2C with Azure Monitor
titleSuffix: Azure AD B2C
description: Learn how to log Azure AD B2C events with Azure Monitor by using delegated resource management.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.author: marsma
ms.subservice: B2C
ms.date: 02/01/2020
---

# Monitor Azure AD B2C with Azure Monitor

With Azure Active Directory B2C (Azure AD B2C) monitoring, you can route your Azure AD B2C activity logs to different monitoring solutions. You can either retain them for long-term use or integrate with third-party security information and event management (SIEM) tools to gain insights into your environment.

You can route logs to:

- An Azure storage account.
- An Azure event hub (and integrate with your Splunk and Sumologic instances).
- Azure Log Analytics workspace (to analyze data, create dashboards and alert on specific events).

![Azure Monitor](./media/azure-monitor/azure-monitor-flow.png)

## Prerequisites

To complete the steps in this article, you deploy an Azure Resource Manager template by using the Azure PowerShell module.

* [Azure PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps) version 6.13.1 or higher

You can also use the [Azure Cloud Shell](https://shell.azure.com) which includes the latest version of the Azure PowerShell module.

## Delegated resource management

Azure AD B2C leverages [Azure Active Directory monitoring](../active-directory/reports-monitoring/overview-monitoring.md). To enable *Diagnostic settings* in Azure Active Directory within your Azure AD B2C tenant, you use [delegated resource management](../lighthouse/concepts/azure-delegated-resource-management.md).

In this case, the **Customer** is your Azure AD tenant, while the **Service Provider** is your Azure AD B2C tenant.

## Create a resource group

In the Azure AD tenant that contains your subscription (not the directory that contains your Azure AD B2C tenant), [create a resource group](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups). Use the following values:

- **Subscription**: Select your Azure subscription.
- **Resource group**: Enter name for the resource group. For example, *azure-ad-b2c-monitor*.
- **Region**: Select an Azure location. For example, *Central US*.

## Delegate resource management

Start by gathering the following information.

**Directory ID** of your Azure AD B2C directory.

* To get the directory ID, sign in to the [Azure portal](https://portal.azure.com/) as a user with the *User administrator* role (or higher), and then use the **Directory + Subscription** filter to switch to the directory that contains your Azure AD B2C tenant. Select **Azure Active Directory**, select **Properties**, and then record the **Directory ID**.

**Object ID** of Azure AD B2C user or group that you want to give contributor permission to the subscription.

* With **Azure Active Directory** still selected in the Azure portal, select **Users**, and then select a user. Record the users's **Object ID**.

  You authorize the user in your Azure AD B2C directory to configure the Azure Monitor instance within the tenant that contains your Azure Subscription. To create the authorization, you deploy an [Azure Resource Manager](../azure-resource-manager/index.yml) template to your Azure AD tenant] for the subscription.

### Create an Azure Resource Manager template

To onboard your Azure AD tenant, create an [Azure Resource Manager template](../lighthouse/how-to/onboard-customer.md) for your offer with the following information. The `mspOfferName` and `mspOfferDescription` values are visible when you view offer details in the [Service providers page](../lighthouse/how-to/view-manage-service-providers.md) of the Azure portal.

|Field  |Definition  |
|---------|---------|
| `mspOfferName`     |A name describing this definition. This value is displayed to the customer as the title of the offer.         |
| `mspOfferDescription`     |A brief description of your offer (for example, "Contoso Azure AD subscription")      |
| `rgName`| The name of the resource group you create earlier in your Azure AD tenant `azure-ad-b2c-monitor` |
| `managedByTenantId`     |Your Azure AD B2C tenant ID         |
| `authorizations.value.principalId`     |The Azure AD B2C user or group Object Id which will have access to resources within this Azure Subscription.     |

Download the Azure resource manager template and parameter files:

- [rgDelegatedResourceManagement.json](https://raw.githubusercontent.com/Azure/Azure-Lighthouse-samples/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.json)
- [rgDelegatedResourceManagement.parameters.json](https://raw.githubusercontent.com/Azure/Azure-Lighthouse-samples/master/Azure-Delegated-Resource-Management/templates/rg-delegated-resource-management/rgDelegatedResourceManagement.parameters.json)

Next, update the parameters file with the values you recorded earlier. The following JSON snippet shows an example of an Azure Resource Manager template parameters file. For the `authorizations.value.roleDefinitionId` use the [built-in role](../role-based-access-control/built-in-roles.md) value for the *Contributor role*, `b24988ac-6180-42a0-ab88-20f7382dd24c`.

```JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "mspOfferName": {
            "value": "Azure AD B2C Managed Services"
        },
        "mspOfferDescription": {
            "value": "Azure AD B2C Managed Services"
        },
        "rgName": {
            "value": "azure-ad-b2c-monitor"
        },
        "managedByTenantId": {
            "value": "<Replace with your B2C tenant Id>"
        },
        "authorizations": {
            "value": [
                {
                    "principalId": "<Replace with the group or user object id>",
                    "principalIdDisplayName": "Azure AD B2C tenant administrator",
                    "roleDefinitionId": "b24988ac-6180-42a0-ab88-20f7382dd24c"
                }
            ]
        }
    }
}
```

### Deploy the Azure Resource Manager templates

Once you've updated your parameters file, deploy the Azure Resource Manager template into the Azure tenant as a subscription-level deployment. A separate deployment is needed for each subscription that you want to onboard to Azure delegated resource management (or for each subscription that contains resource groups that you want to onboard).

Because this is a subscription-level deployment, it cannot be initiated in the Azure portal. The deployment may be done by using Azure PowerShell or the Azure CLI. The Azure PowerShell method is shown below.

Sign in to the directory containing your subscription by using [Connect-AzAccount](https://docs.microsoft.com/powershell/azure/authenticate-azureps?view=azps-3.1.0). Use the `-tenant` flag to force authentication to the correct directory.

```PowerShell
Connect-AzAccount -tenant contoso.onmicrosoft.com
```

Use the [Get-AzSubscription](https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.1.0) cmdlet to list the subscriptions that the current account can access under the Azure AD tenant. Copy the ID of the subscription you want to project into Azure AD B2C tenant.

```PowerShell
Get-AzSubscription
```

Then, switch to the subscription you want to project to Azure AD B2C tenant:

``` PowerShell
Select-AzSubscription <subscription ID>
```

Finally, deploy the Azure Resource Manager template template and parameter files you downloaded and updated earlier. Replace the `Location`, `TemplateFile`, and `TemplateParameterFile` values accordingly.

```PowerShell
New-AzDeployment -Name "AzureADB2C" `
                 -Location "centralus" `
                 -TemplateFile "C:\Users\azureuser\Documents\rgDelegatedResourceManagement.json" `
                 -TemplateParameterFile "C:\Users\azureuser\Documents\rgDelegatedResourceManagement.parameters.json" `
                 -Verbose
```

### Confirm successful onboarding (optional)

When a customer subscription (Azure AD) has successfully been onboarded to Azure delegated resource management, users in the service provider's (Azure AD B2C) tenant will be able to see the subscription and its resources (if they have been granted access to it through the process above, either individually or as a member of an Azure AD group with the appropriate permissions). To confirm this, check to make sure the subscription appears in one of the following ways.

In the Azure AD B2C tenant:

1. Navigate to the [My customers page](../lighthouse/how-to/view-manage-customers.md).
2. Select **Customers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

    In order to see the delegated subscription in [My customers](../lighthouse/how-to/view-manage-customers.md), users in the service provider's tenant must have been granted the [Reader](../role-based-access-control/built-in-roles.md#reader) role (or another built-in role which includes Reader access) when the subscription was onboarded for Azure delegated resource management.

In the Azure AD tenant:

1. Navigate to the [Service providers page](../lighthouse/how-to/view-manage-service-providers.md).
2. Select **Service provider offers**.
3. Confirm that you can see the subscription(s) with the offer name you provided in the Resource Manager template.

It might take several minutes after your deployment is complete before the updates are reflected in the Azure portal.

## Select your subscription

To associate an existing subscription to your Azure AD directory, follow these steps:

1. Sign in to the Azure portal with your Azure AD B2C administrative account.
1. Select the Directory + Subscription icon in the portal toolbar

    ![Switch directory menu](./media/azure-monitor/switch-directory-menu.png)

1. select the directory that contains your Azure AD B2C tenant.

    ![Switch directory](./media/azure-monitor/switch-directory.png)

## Configure diagnostic settings

After you delegate permissions to your Azure AD B2C user or group, you can [Create diagnostic settings in Azure portal](../active-directory/reports-monitoring/overview-monitoring.md).

To configure monitoring settings for Azure AD B2C activity logs, first sign-in to the [Azure portal](https://portal.azure.com), then select **Azure Active Directory**. From here, you can access the **Diagnostic settings** configuration page in two ways:

- Select **Diagnostic settings** from the **Monitoring** section.

    ![Diagnostics settings](https://docs.microsoft.com/azure/active-directory/reports-monitoring/media/overview-monitoring/diagnostic-settings.png)

- Select **+Add diagnostic setting**.

## Next steps

TODO