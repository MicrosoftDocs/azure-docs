---
title: How to access custom machine configuration package artifacts
description: Learn how to provide access to a machine configuration package file in Azure blob storage .
ms.date: 08/28/2024
ms.topic: how-to
ms.custom: devx-track-azurepowershell
---

# How to provide secure access to custom machine configuration packages

This page provides a guide on how to provide access to Machine Configuration packages stored in
Azure storage by using the resource ID of a user-assigned managed identity or a Shared Access
Signature (SAS) token.

## Prerequisites

- Azure subscription
- Azure Storage account with the Machine Configuration package

## Steps to provide access to the package

The following steps prepare your resources for more secure operations. The code snippets for the
steps include values in angle brackets, like `<storage-account-container-name>`, which you must
replace with a valid value when following the steps. If you just copy and paste the code, the
commands may raise errors due to invalid values.

### Using a User Assigned Identity 

> [!IMPORTANT]
> Please note that, unlike Azure VMs, Arc-connected machines currently do not support User-Assigned
> Managed Identities.

You can grant private access to a machine configuration package in an Azure Storage blob by
assigning a [User-Assigned Identity][01] to a scope of Azure VMs. For this to work, you need to
grant the managed identity read access to the Azure storage blob. This involves assigning the
"Storage Blob Data Reader" role to the identity at the scope of the blob container. This setup
ensures that your Azure VMs can securely read from the specified blob container using the
user-assigned managed identity. To learn how you can assign a User Assigned Identity at scale, see
[Use Azure Policy to assign managed identities][02].

### Using a SAS Token

Optionally, you can add a shared access signature (SAS) token in the URL to ensure secure access to
the package. The below example generates a blob SAS token with read access and returns the full
blob URI with the shared access signature token. In this example, the token has a time limit of
three years.

```powershell
$startTime = Get-Date
$endTime   = $startTime.AddYears(3)

$tokenParams = @{
    StartTime  = $startTime
    ExpiryTime = $endTime
    Container  = '<storage-account-container-name>'
    Blob       = '<configuration-blob-name>'
    Permission = 'r'
    Context    = '<storage-account-context>'
    FullUri    = $true
}

$contentUri = New-AzStorageBlobSASToken @tokenParams
```

## Summary

By using the resource ID of a user-assigned managed identity or SAS token, you can securely provide
access to Machine Configuration packages stored in Azure storage. The additional parameters ensure
that the package is retrieved using the managed identity and that Azure Arc machines aren't
included in the policy scope.

## Next Steps
- After creating the policy definition, you can assign it to the appropriate scope, like management
  group, subscription, or resource group, within your Azure environment.
- Remember to monitor the policy compliance status and make any necessary adjustments to your
  Machine Configuration package or policy assignment to meet your organizational requirements.

> [!div class="nextstepaction"]
> [Sign a custom machine configuration package](./6-sign-package.md)

<!-- Reference link definitions -->
[01]: /entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations#using-user-assigned-identities-to-reduce-administration
[02]: /entra/identity/managed-identities-azure-resources/how-to-assign-managed-identity-via-azure-policy
