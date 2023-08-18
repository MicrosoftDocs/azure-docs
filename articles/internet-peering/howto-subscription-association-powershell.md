---
title: Associate peer ASN to Azure subscription - PowerShell
description: Learn how to associate peer ASN to Azure subscription using PowerShell.
services: internet-peering
author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 05/26/2023
ms.author: halkazwini 
ms.custom: template-how-to, devx-track-azurepowershell, engagement-fy23
---

# Associate peer ASN to Azure subscription using PowerShell

> [!div class="op_single_selector"]
> - [Azure portal](howto-subscription-association-portal.md)
> - [PowerShell](howto-subscription-association-powershell.md)

Before you submit a peering request, you should first associate your ASN with Azure subscription using the steps in this article.

If you prefer, you can complete this guide using the [Azure portal](howto-subscription-association-portal.md).

### Working with Azure PowerShell
[!INCLUDE [CloudShell](./includes/cloudshell-powershell-about.md)]

## Create PeerASN to associate your ASN with Azure Subscription

### Sign in to your Azure account and select your subscription
[!INCLUDE [Account](./includes/account-powershell.md)]

### Register for peering resource provider
Register for peering resource provider in your subscription using [Register-AzResourceProvider](/powershell/module/az.resources/register-azresourceprovider). If you don't execute this, then Azure resources required to set up peering aren't accessible.

```powershell
Register-AzResourceProvider -ProviderNamespace Microsoft.Peering
```

You can check the registration status using [Get-AzResourceProvider](/powershell/module/az.resources/get-azresourceprovider):
```powershell
Get-AzResourceProvider -ProviderNamespace Microsoft.Peering
```

> [!IMPORTANT]
> Wait for *RegistrationState* to turn "Registered" before proceeding. It may take 5 to 30 minutes after you execute the command.

### Update the peer information associated with this subscription

Update the peer information associated with this subscription using New-AzPeerAsn:

```powershell
$contactDetails = New-AzPeerAsnContactDetail -Role Noc -Email "noc@contoso.com" -Phone "+1 (555) 555-5555"
New-AzPeerAsn -Name "Contoso_1234" -PeerName "Contoso" -PeerAsn 1234 -ContactDetail $contactDetails
```

> [!NOTE]
> -Name corresponds to resource name and can be anything you choose. However, -peerName corresponds to your company's name and needs to be as close as possible to your PeeringDB profile. Note that value for -peerName supports only characters a-z, A-Z, and space.

A subscription can have multiple ASNs. Update the peering information for each ASN. Ensure that "name" is unique for each ASN.

Peers are expected to have a complete and up-to-date profile on [PeeringDB](https://www.peeringdb.com). We use this information during registration to validate the peer's details such as NOC information, technical contact information, and their presence at the peering facilities etc.

In place of **{subscriptionId}** in the output, actual subscription ID is displayed.

## View status of a PeerASN

Check for ASN Validation state using Get-AzPeerAsn:

```powershell
Get-AzPeerAsn
```

Below is an example response:
```powershell
PeerContactInfo : Microsoft.Azure.PowerShell.Cmdlets.Peering.Models.PSContactInfo
PeerName        : Contoso
ValidationState : Approved
PeerAsnProperty : 1234
Name            : Contoso_1234
Id              : /subscriptions/{subscriptionId}/providers/Microsoft.Peering/peerAsns/Contoso_1234
Type            : Microsoft.Peering/peerAsns
```

> [!IMPORTANT]
> Wait for the ValidationState to turn "Approved" before submitting a peering request. It may take up to 12 hours for this approval.

## Modify PeerAsn
You may modify NOC contact information anytime using Set-AzPeerAsn:

```powershell
Set-AzPeerAsn -Name Contoso_1234 -Email "newemail@test.com" -Phone "1800-000-0000"
```

## Delete PeerAsn
Deleting a PeerASN isn't currently supported. If you need to delete PeerASN, contact [Microsoft peering](mailto:peering@microsoft.com).

## Next steps

- [Create or modify a Direct peering using Azure PowerShell](howto-direct-powershell.md).
- [Convert a legacy Direct peering to Azure resource using Azure PowerShell](howto-legacy-direct-powershell.md).
- [Create or modify Exchange peering using Azure PowerShell](howto-exchange-powershell.md).
- [Convert a legacy Exchange peering to Azure resource using Azure PowerShell](howto-legacy-exchange-powershell.md).
- [Internet peering frequently asked questions (FAQ)](faqs.md).