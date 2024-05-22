---
author: v-vprasannak
ms.service: azure-communication-services
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 04/29/2024
ms.author: v-vprasannak
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/dotnet/).
- Install the [Azure Az PowerShell Module](/powershell/azure/)
- An Azure Communication Services Email Resource created and ready to add the domains. See [Get started with Creating Email Communication Resource](../../../quickstarts/email/create-email-communication-resource.md).
- A custom domain with higher than default sending limits provisioned and ready. See [Quickstart: How to add custom verified email domains](../../../quickstarts/email/add-custom-verified-domains.md).

## Create a Sender Username resource

To create a Sender Username resource, Sign into your Azure account by using the ```Connect-AzAccount``` using the following command and provide your credentials.

```PowerShell
PS C:\> Connect-AzAccount
```

First, make sure to install the Azure Communication Services module ```Az.Communication``` using the following command.

```PowerShell
PS C:\> Install-Module Az.Communication
```

Run the following command to create Sender user name for Custom domain:

```PowerShell
PS C:\> New-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test -Username test
```

If you would like to select a specific subscription you can also specify the --subscription flag and provide the subscription ID.

```PowerShell
PS C:\> New-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test -Username test -SubscriptionId SubscriptionID
```

You can configure your Domain resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-powershell.md)
* The name of the Email Communication Services resource.
* The name of the Domain resource.
* The name of the Sender Username.
* The name of the Username.

> [!NOTE]
> The Sender Username and Username should be the same.

## Manage your Sender username resource

To add or update display name to your Sender Username resource, run the following commands. You can target a specific subscription as well.

```PowerShell
PS C:\> Update-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test -Username test -DisplayName testdisplayname

PS C:\> Update-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test -Username test -DisplayName testdisplayname -SubscriptionId SubscriptionID
```

To list all of your Sender Username resources in a given Domain, use the following command:

```PowerShell
PS C:\> Get-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com
```

To list all the information on a given resource, use the following command:

```PowerShell
PS C:\> Get-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test
```

## Clean up a Sender Username resource

If you want to clean up and remove a Sender Username resource, You can delete your Sender Username resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailServiceSenderUsername -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -DomainName contoso.com -SenderUsername test
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.