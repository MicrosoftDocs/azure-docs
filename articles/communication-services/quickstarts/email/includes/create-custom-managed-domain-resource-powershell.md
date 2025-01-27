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
- Create an [Email Communication Service](/azure/communication-services/quickstarts/email/create-email-communication-resource).

## Provision a custom domain

To provision a custom domain, you need to:
    
* Verify the custom domain ownership by adding a TXT record in your Domain Name System (DNS).
* Configure the sender authentication by adding Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records.

## Create a Domain resource

To create a Domain resource, Sign into your Azure account by using the ```Connect-AzAccount``` using the following command and provide your credentials.

```PowerShell
PS C:\> Connect-AzAccount
```

First, make sure to install the Azure Communication Services module ```Az.Communication``` using the following command.

```PowerShell
PS C:\> Install-Module Az.Communication
```

Run the following command to create the Custom managed domain resource:

```PowerShell
PS C:\> New-AzEmailServiceDomain -ResourceGroupName ContosoResourceProvider1 -EmailServiceName ContosoEmailServiceResource1 -Name contoso.com -DomainManagement CustomerManaged
```

You can configure your Domain resource with the following options:

* The [resource group](../../../../azure-resource-manager/management/manage-resource-groups-powershell.md)
* The name of the Email Communication Services resource.
* The name of the Domain resource.
* The value of the Domain management property.
	* For Custom domains, the value should be 'CustomerManaged'.

In the next step, you can assign tags or update user engagement tracking to the domain resource. Tags can be used to organize your Domain resources. See the [resource tagging documentation](../../../../azure-resource-manager/management/tag-resources.md) for more information about tags.

## Manage your Domain resource

To add tags or update user engagement tracking to your Domain resource, run the following commands. You can target a specific subscription as well.

```PowerShell
PS C:\> Update-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"} -UserEngagementTracking 1

PS C:\> Update-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -Tag @{ExampleKey1="ExampleValue1"} -UserEngagementTracking 0 -SubscriptionId SubscriptionID
```

To list all of your Domain Resources in a given Email Communication Service, use the following command:

```PowerShell
PS C:\> Get-AzEmailServiceDomain -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1
```

To list all the information on a given domain resource, use the following command:

```PowerShell
PS C:\> Get-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1
```

## Verification operation for your Domain resource

To configure sender authentication for your domains, refer Configure sender authentication for custom domain section from the Azure portal tab.

### Initiate Verification

To Invoke domain verification, run the below command:

```PowerShell
PS C:\> Invoke-AzEmailServiceInitiateDomainVerification -DomainName contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -VerificationType Domain
```

### Cancel Verification

To Stop domain verification, run the below command:

```PowerShell
PS C:\> Stop-AzEmailServiceDomainVerification -DomainName contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1 -VerificationType Domain
```

## Clean up a Domain resource

If you want to clean up and remove a Domain resource, You can delete your Domain resource by running the following command:

```PowerShell
PS C:\> Remove-AzEmailServiceDomain -Name contoso.com -EmailServiceName ContosoEmailServiceResource1 -ResourceGroupName ContosoResourceProvider1
```

> [!NOTE]
> Resource deletion is **permanent** and no data, including event grid filters, phone numbers, or other data tied to your resource, can be recovered if you delete the resource.