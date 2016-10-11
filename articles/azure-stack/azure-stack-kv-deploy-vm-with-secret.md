<properties
	pageTitle="Deploy a VM using a password stored in Azure Stack Key Vault | Microsoft Azure"
	description="Learn how to deploy a VM using a password stored in Azure Stack Key Vault"
	services="azure-stack"
	documentationCenter=""
	authors="rlfmendes"
	manager="natmack"
	editor=""/>

<tags
	ms.service="azure-stack"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/26/2016"
	ms.author="ricardom"/>

# Deploy a VM by retrieving the password stored in Key Vault

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Stack key vault and reference the value in other Azure Resource Manager templates. You include only a reference to the secret in your template so the secret is never exposed. You do not need to manually enter
the value for the secret each time you deploy the resources. You specify which users or service principals can access the secret.

## Reference a secret with static ID

You reference the secret from within a parameters file, which passes values to your template. You reference the secret by passing the resource identifier of the key vault and the name of the secret. In this example, the key vault secret must already exist. You use a static value for its resource ID.

    "parameters": {
    "adminPassword": {
    "reference": {
    "keyVault": {
    "id": "/subscriptions/{guid}/resourceGroups/{group-name}/providers/Microsoft.KeyVault/vaults/{vault-name}"
    },
    "secretName": "sqlAdminPassword"


>[AZURE.NOTE]The parameter that accepts the secret should be a *securestring*.

## Next Steps
[Deploy a sample app with Key Vault](azure-stack-kv-sample-app.md)

[Deploy a VM with a Key Vault certificate](azure-stack-kv-push-secret-into-vm.md)

