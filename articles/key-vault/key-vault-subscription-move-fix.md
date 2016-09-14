<properties
	pageTitle="Changing key vault tenant ID after subscription move | Microsoft Azure"
	description="Learn how to switch tenant ID for a key vault after a subscription is moved to different tenant"
	services="key-vault"
	documentationCenter=""
	authors="amitbapat"
	manager="mbaldwin"
	tags="azure-resource-manager"/>

<tags
	ms.service="key-vault"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="09/13/2016"
	ms.author="ambapat"/>

# Changing key vault tenant ID after subscription move
### Q: My subscription was moved from tenant A to tenant B. How do I change the tenant ID for my existing key vault and set correct ACLs for principals in tenant B?

When you create a new key vault in a subscription, it is automatically tied to the default Azure Active Directory tenant ID for that subscription. All access policy entries are also tied to this tenant ID. When you move your Azure subscription from tenant A to tenant B, your existing key vaults are inaccessible by the principals (users and applications) in tenant B. To fix this issue, you need to 

- change the tenant ID associated with all existing key vaults in this subscription to tenant B
- remove all existing access policy entries
- add new access policy entries that are associated with tenant B.

For example, if you have key vault 'myvault' in a subscription that has been moved from tenant A to tenant B, here's how to change the tenant ID for this key vault and remove old access policies.

<pre>
$vaultResourceId = (Get-AzureRmKeyVault -VaultName myvault).ResourceId
$vault = Get-AzureRmResource –ResourceId $vaultResourceId -ExpandProperties
$vault.Properties.TenantId = (Get-AzureRmContext).Tenant.TenantId
$vault.Properties.AccessPolicies = @()
Set-AzureRmResource -ResourceId $vaultResourceId -Properties $vault.Properties
</pre>

Since this vault was in tenant A before move original value of **$vault.Properties.TenantId** is tenant A, while **(Get-AzureRmContext).Tenant.TenantId** is tenant B.

Now that your vault is associated with the correct tenant Id and old access policy entries are removed, set new access policy entries with [Set-AzureRmKeyVaultAccessPolicy](https://msdn.microsoft.com/library/mt603625.aspx).
