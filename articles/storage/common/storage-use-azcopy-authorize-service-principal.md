---
title: Authorize access for AzCopy with a service principal
description: You can provide authorization credentials for AzCopy operations by using a service principal.
author: normesta
ms.service: azure-storage
ms.topic: how-to
ms.date: 01/08/2026
ms.author: normesta
ms.subservice: storage-common-concepts
ms.custom: devx-track-azurecli, devx-track-azurepowershell
# Customer intent: "As a DevOps engineer or developer, I want to authorize AzCopy operations using service principals, so that I can enable secure, non-interactive file transfers in CI/CD pipelines and automated scripts without embedding storage credentials."
---

# Authorize AzCopy access by using a service principal

Service principals provide a secure way to authorize [AzCopy](storage-use-azcopy-v10.md) operations for applications and automated scenarios that require non-interactive authentication. This authentication method is ideal for continuous integration and continuous deployment pipelines, scheduled tasks, and applications running outside of Azure where managed identities aren't available.

This article shows you how to authenticate AzCopy by using a service principal with a client secret or certificate. You learn how to configure authentication through environment variables, the AzCopy login command, or by leveraging existing Azure CLI or Azure PowerShell sessions.

> [!NOTE]
> While service principals offer flexibility for cross-platform scenarios, Microsoft recommends using managed identities when running on Azure resources for enhanced security and simplified credential management. To learn about other ways to authorize access to AzCopy, see [Authorize AzCopy](storage-use-azcopy-v10.md#authorize-azcopy).

## Verify role assignments

Ensure your service principal has the required Azure role for your intended operations:

For download operations, use [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader) (Blob Storage) or [Storage File Data Privileged Reader](../../role-based-access-control/built-in-roles.md#storage-file-data-privileged-reader) (Azure Files).

For upload operations, use [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) or [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) (Blob Storage) or [Storage File Data Privileged Contributor](../../role-based-access-control/built-in-roles.md#storage-file-data-privileged-contributor) (Azure Files).

For role assignment instructions, see [Assign an Azure role for access to blob data](../blobs/assign-azure-role-data-access.md) (Blob Storage) or [Choose how to authorize access to file data in the Azure portal](../files/authorize-data-operations-portal.md) (Azure Files).

> [!NOTE]
> Role assignments can take up to five minutes to propagate.

If you're transferring blobs in an account that has a hierarchical namespace, you don't need to assign one of these roles to your security principal if you add your security principal to the access control list (ACL) of the target container or directory. In the ACL, your security principal needs write permission on the target directory, and execute permission on container and each parent directory. To learn more, see [Access control model in Azure Data Lake Storage](../blobs/data-lake-storage-access-control-model.md).

## Authorize by using environment variables

To authorize access, set in-memory environment variables, and then run any AzCopy command. AzCopy retrieves the authentication token required to complete the operation. After the operation completes, the token disappears from memory.

AzCopy retrieves the OAuth token by using the credentials that you provide, or it can use the OAuth token from an active Azure CLI or Azure PowerShell session.

This option is ideal if you plan to use AzCopy inside a script that runs without user interaction, particularly when running on-premises. If you plan to run AzCopy on VMs that run in Azure, a managed service identity is easier to administer. For more information, see [Authorize access for AzCopy using a managed identity](storage-use-azcopy-authorize-managed-identity.md).

> [!CAUTION]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application and carries risks that aren't present in other flows. Use this flow only when other more secure flows, such as managed identities, aren't viable.

You can sign in to your account by using a client secret or by using the password of a certificate that is associated with your service principal's app registration.

For more information about creating a service principal, see [How to: Use the portal to create a Microsoft Entra application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md).

For more information about service principals, see [Application and service principal objects in Microsoft Entra ID](../../active-directory/develop/app-objects-and-service-principals.md).

### Authorize a service principal by using a client secret

Type the following command, and then press the ENTER key.

### [Linux](#tab/linux)

```bash
export AZCOPY_AUTO_LOGIN_TYPE=SPN
export AZCOPY_SPA_APPLICATION_ID=<application-id>
export AZCOPY_SPA_CLIENT_SECRET=<client-secret>
export AZCOPY_TENANT_ID=<tenant-id>
```

### [Windows](#tab/windows)

```powershell
$Env:AZCOPY_AUTO_LOGIN_TYPE="SPN"
$Env:AZCOPY_SPA_APPLICATION_ID="<application-id>"
$Env:AZCOPY_SPA_CLIENT_SECRET="<client-secret>"
$Env:AZCOPY_TENANT_ID="<tenant-id>"
```

---

Replace the `<application-id>` placeholder with the application ID of your service principal's app registration. Replace the `<tenant-id>` placeholder with the tenant ID of the organization to which the storage account belongs. To find the application ID and the tenant ID, see [Sign into the application](/entra/identity-platform/howto-create-service-principal-portal#sign-in-to-the-application).

Replace the `<client-secret>` placeholder with the client secret. To obtain a client secret, see [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret). Consider using a prompt to set the `AZCOPY_SPA_CLIENT_SECRET` variable as shown in the following example. That way, your password won't appear in your console's command history.

```azcopy
$env:AZCOPY_SPA_CLIENT_SECRET="$(Read-Host -prompt "Enter key")"
```

Then, run any AzCopy command (for example: `azcopy list https://contoso.blob.core.windows.net`).

### Authorize a service principal by using a certificate

If you prefer to use your own credentials for authorization, upload a certificate to your app registration, and then use that certificate to sign in. To learn how to upload your certificate, see [Set up authentication](/entra/identity-platform/howto-create-service-principal-portal#set-up-authentication).

In addition to uploading your certificate to your app registration, you also need to have a copy of the certificate saved to the machine or VM where AzCopy runs. This copy of the certificate should be in .PFX or .PEM format, and must include the private key. The private key should be password-protected. If you're using Windows, and your certificate exists only in a certificate store, make sure to export that certificate to a PFX file (including the private key). For guidance, see [Export-PfxCertificate](/powershell/module/pki/export-pfxcertificate).

Type the following command, and then press the ENTER key.

### [Linux](#tab/linux)

```bash
export AZCOPY_AUTO_LOGIN_TYPE=SPN
export AZCOPY_SPA_APPLICATION_ID=<application-id>
export AZCOPY_SPA_CERT_PATH=<path-to-certificate-file>
export AZCOPY_SPA_CERT_PASSWORD=<certificate-password>
export AZCOPY_TENANT_ID=<tenant-id>
```

### [Windows](#tab/windows)

```bash
$Env:AZCOPY_AUTO_LOGIN_TYPE="SPN"
$Env:AZCOPY_SPA_APPLICATION_ID="<application-id>"
$Env:AZCOPY_SPA_CERT_PATH="<path-to-certificate-file>"
$Env:AZCOPY_SPA_CERT_PASSWORD="<certificate-password>"
$Env:AZCOPY_TENANT_ID="<tenant-id>"
```

---

Replace the `<application-id>` placeholder with the application ID of your service principal's app registration. Replace the `<tenant-id>` placeholder with the tenant ID of the organization to which the storage account belongs. To find the application ID and the tenant ID, see [Sign into the application](/entra/identity-platform/howto-create-service-principal-portal#sign-in-to-the-application).

Replace the `<path-to-certificate-file>` placeholder with the relative or fully qualified path to the certificate file. AzCopy saves the path to this certificate but doesn't save a copy of the certificate, so make sure to keep that certificate in place. Replace the `<certificate-password>` placeholder with the password of the certificate. Consider using a prompt to set the `AZCOPY_SPA_CERT_PASSWORD` variable as shown in the following example. That way, your password won't appear in your console's command history.

```azcopy
$env:AZCOPY_SPA_CERT_PASSWORD="$(Read-Host -prompt "Enter key")"
```

Then, run any AzCopy command (for example: `azcopy list https://contoso.blob.core.windows.net`).

## Authorize with the AzCopy login command

As an alternative to using in-memory variables, you can authorize access by using the azcopy login command.

The azcopy login command retrieves an OAuth token and then places that token into a secret store on your system. If your operating system doesn't have a secret store such as a Linux keyring, the azcopy login command won't work because there's nowhere to place the token.

### Authorize a service principal

Before running a script, sign in interactively at least one time so that you can provide AzCopy with the credentials of your service principal.  AzCopy stores those credentials in a secured and encrypted file so that your script doesn't have to provide that sensitive information.

You can sign in to your account by using a client secret or by using the password of a certificate that is associated with your service principal's app registration.

To learn more about creating service principal, see [How to: Use the portal to create a Microsoft Entra application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md).

> [!CAUTION]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application and carries risks that aren't present in other flows. Use this flow only when other more secure flows, such as managed identities, aren't viable.

#### Authorize a service principal by using a client secret

Start by setting the `AZCOPY_SPA_CLIENT_SECRET` environment variable to the client secret of your service principal's app registration. To obtain a client secret, see [Create a new client secret](/entra/identity-platform/howto-create-service-principal-portal#option-3-create-a-new-client-secret).

> [!NOTE]
> Set this value from your command prompt, and not in the environment variable settings of your operating system. That way, the value is available only to the current session.

This example shows how you could do this in PowerShell. Consider using a prompt as shown in this example. That way, your password won't appear in your console's command history.

```azcopy
$env:AZCOPY_SPA_CLIENT_SECRET="$(Read-Host -prompt "Enter key")"
```

Next, type the following command, and then press the ENTER key.

```azcopy
azcopy login --service-principal  --application-id application-id --tenant-id=tenant-id
```

Replace the `application-id` placeholder with the application ID of your service principal's app registration. Replace the `<tenant-id>` placeholder with the tenant ID of the organization to which the storage account belongs. To find the application ID and the tenant ID, see [Sign into the application](/entra/identity-platform/howto-create-service-principal-portal#sign-in-to-the-application).

#### Authorize a service principal by using a certificate

If you prefer to use your own credentials for authorization, upload a certificate to your app registration, and then use that certificate to sign in. To learn how to upload your certificate, see [Set up authentication](/entra/identity-platform/howto-create-service-principal-portal#set-up-authentication).

In addition to uploading your certificate to your app registration, you also need to have a copy of the certificate saved to the machine or VM where AzCopy runs. This copy of the certificate should be in .PFX or .PEM format, and must include the private key. The private key should be password-protected. If you're using Windows, and your certificate exists only in a certificate store, make sure to export that certificate to a PFX file (including the private key). For guidance, see [Export-PfxCertificate](/powershell/module/pki/export-pfxcertificate).

Next, set the `AZCOPY_SPA_CERT_PASSWORD` environment variable to the certificate password.

> [!NOTE]
> Set this value from your command prompt, and not in the environment variable settings of your operating system. That way, the value is available only to the current session.

This example shows how you could do this task in PowerShell. Consider using a prompt as shown in this example. That way, your password doesn't appear in your console's command history.

```azcopy
$env:AZCOPY_SPA_CERT_PASSWORD="$(Read-Host -prompt "Enter key")"
```

Next, type the following command, and then press the ENTER key.

```azcopy
azcopy login --service-principal --application-id application-id --certificate-path <path-to-certificate-file> --tenant-id=<tenant-id>
```

Replace the `application-id` placeholder with the application ID of your service principal's app registration. Replace the `tenant-id` placeholder with the tenant ID of the organization to which the storage account belongs. To find the application ID and the tenant ID, see [Sign into the application](/entra/identity-platform/howto-create-service-principal-portal#sign-in-to-the-application).

Replace the `<path-to-certificate-file>` placeholder with the relative or fully qualified path to the certificate file. AzCopy saves the path to this certificate but it doesn't save a copy of the certificate, so make sure to keep that certificate in place.  

## Authorize by using Azure CLI

When you sign in by using Azure CLI, Azure CLI gets an OAuth token that AzCopy uses to authorize operations. 

To enable AzCopy to use that token, type the following command, and then press the ENTER key.

### [Linux](#tab/linux)

```bash
export AZCOPY_AUTO_LOGIN_TYPE=AZCLI
export AZCOPY_TENANT_ID=<tenant-id>
```

### [Windows](#tab/windows)

```powershell
$Env:AZCOPY_AUTO_LOGIN_TYPE="PSCRED"
$Env:AZCOPY_TENANT_ID="<tenant-id>"
```

---

For more information about how to sign in by using the Azure CLI, see [Sign into Azure with a service principal using the Azure CLI](/cli/azure/authenticate-azure-cli-service-principal).

## Authorize by using Azure PowerShell

When you sign in by using Azure PowerShell, Azure PowerShell gets an OAuth token that AzCopy uses to authorize operations.  

To enable AzCopy to use that token, type the following command, and then press the ENTER key.

```PowerShell
$Env:AZCOPY_AUTO_LOGIN_TYPE="PSCRED"
$Env:AZCOPY_TENANT_ID="<tenant-id>"

```

For more information about how to sign in by using Azure PowerShell, see [Login with a service principal](/powershell/azure/authenticate-noninteractive#login-with-a-service-principal).

## Next steps

- For more information about AzCopy, see [Get started with AzCopy](storage-use-azcopy-v10.md).

- If you have questions, encounter problems, or have general feedback, submit them [on GitHub](https://github.com/Azure/azure-storage-azcopy).
