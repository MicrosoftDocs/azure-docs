---
title:  Authorize SFTP access to blobs using Microsoft Entra ID (preview)
titleSuffix: Azure Storage
description: Learn how to authorize SSH File Transfer Protocol (SFTP) access to blobs by using Microsoft Entra ID.
author: jeevanbalanmanoj
ms.date: 02/24/2026
ms.topic: how-to
ms.service: azure-blob-storage
ms.author: normesta
---

# Authorize SSH File Transfer Protocol (SFTP) access to blobs using Microsoft Entra ID (preview)

Azure Blob Storage SFTP now supports Microsoft Entra ID-based access in public preview. Previously, Azure Blob Storage SFTP supported only local user-based access, requiring either a password or an SSH private key for authentication. By using this new feature, users can apply their Microsoft Entra ID or Entra External Identities to connect to Azure storage accounts through SFTP without needing to create and maintain local users.

Microsoft Entra ID-based access brings many benefits to Azure Blob Storage SFTP, including role-based access control (RBAC), multifactor authentication (MFA), and Microsoft Entra ID Access Control Lists (ACLs).

> [!IMPORTANT]
> Microsoft Entra ID-based access for Azure Blob Storage SFTP is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability. Once enabled, this feature applies to all storage accounts within the entire subscription.

## Key benefits

> [!div class="checklist"]
>
> - **Eliminate Local User Management** - By using Microsoft Entra ID-based access, you don't need to create, rotate, or maintain local SFTP users for each storage account. Microsoft Entra ID handles authentication, which significantly reduces operational overhead and configuration complexity.
>
> - **Enterprise grade identity and security** - SFTP access uses Microsoft Entra ID, which enables:
>   - Centralized identity lifecycle management
>   - Strong authentication, including MFA through Microsoft Entra ID
>   - Consistent security posture aligned with enterprise IAM standards
>   - This approach improves security compared to static, long-lived local credentials.
>
> - **Native Azure RBAC, ABAC and ACL Integration** - Authorization for SFTP matches Azure Blob Storage's existing access control model:
>   - Role-based Access Control (RBAC)
>   - Attribute-based Access Control (ABAC)
>   - POSIX-style Access Control Lists (ACLs)
>   - Users can apply the same roles and permissions used for REST, SDK, and Portal access to SFTP.
>
> - **Faster SFTP Onboarding** - Because Microsoft Entra ID accounts are ubiquitous, users can:
>   - Reuse existing users, groups, and service principals
>   - Avoid time-consuming local user creation and key distribution
>   - Get SFTP up and running faster with fewer setup steps
>   - Significantly shorten time-to-value for SFTP-based workflows
>
> - **Secure External Collaboration** - By using Microsoft Entra ID External Identities, customers can securely grant SFTP access to partners and vendors without managing separate identity systems, while maintaining full control and auditability.

## Overview

The following high-level overview describes the key steps involved in this process. You first authenticate by using Microsoft Entra ID, then obtain an OpenSSH certificate, and finally connect to Azure Blob Storage SFTP by using a compatible client or SDK. The following sections outline each of these steps in more detail.

1. Authenticate with Microsoft Entra ID via Azure CLI, PowerShell, SDK, and more.
1. Get an OpenSSH certificate from Microsoft Entra ID by passing a public key.
1. Use any SFTP client or SDK that supports OpenSSH certificates to connect to Azure Storage with the OpenSSH certificate and the public key from step 2.

    > [!NOTE]
    > Password-based authentication isn't supported because no SFTP clients have native Microsoft Entra ID integration to provide a Microsoft Entra ID user experience for password entry.

## Connecting to Azure Blob Storage with Microsoft Entra IDs

### Register the feature

Register the `SFTP Entra ID Support` preview feature on your Azure subscription. For information about how to register a preview feature, see the [preview features guide](../../azure-resource-manager/management/preview-features.md).

### Generate OpenSSH certificate

#### [Azure CLI](#tab/azurecli)

Generate the OpenSSH certificate with the Azure CLI [az sftp](/cli/azure/sftp) command as shown in the following example.

```azurecli
az login
az sftp cert --file /my_cert.pub
``` 
For security reasons, the certificate is valid for only 65 minutes. After it expires, you need to rerun the command to get a new certificate.

> [!NOTE]
> Currently, only [Azure CLI](/cli/azure/ssh) and Azure PowerShell support retrieving SSH certificates. Azure portal support for downloading SSH certificates isn't yet available.

Optionally, you can generate your own SSH key pair and use it when downloading the certificate.

Generate SSH key pair: You must use RSA keys, as Microsoft Entra ID supports only RSA certificates. 

```bash
ssh-keygen -t rsa
```

The following key files will be generated:

| **File Name**  | **Key Type** |
|----------------|--------------|
| **id_rsa**     | Private key  |
| **id_rsa.pub** | Public key   |

Use the following command to generate the SSH certificate with the generated keys:

```azurecli
az login
az sftp cert --public-key-file /id_rsa.pub --file /my_cert.pub
```

If you're using a service principal, you can sign in by using either a client secret or a certificate:

To sign in by using a certificate, use the following command:

```azurecli
az login --service-principal -u <application_id_or_client_id> --tenant <tenant_id> --certificate <path_to_certificate>
```

To sign in by using a client secret, use the following command:

```azurecli
az login --service-principal -u <application_id_or_client_id> -p <secret_value> --tenant <tenant_id>
```

After authentication, run the same command to download the certificate:

```azurecli
az sftp cert --public-key-file /id_rsa.pub --file /my_cert.pub
```

#### [Azure PowerShell](#tab/azurepowershell)

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions. Service principals and managed identity authorization is not yet supported for generating a certificate.

```powershell
Connect-AzAccount
```

Generate the OpenSSH certificate by using [PowerShell Az.Sftp](https://www.powershellgallery.com/packages/Az.Sftp/0.1.0) as shown in the following example:

```powershell
New-AzSftpCertificate -CertificatePath "\my_cert.cert"
```

Optionally, use the following command to generate the OpenSSH certificate by using your SSH keys:

```powershell
New-AzSftpCertificate -PublicKeyFile "\id_rsa.pub" -CertificatePath "\my_cert.cert"
```

Learn more about the PowerShell module [here](/powershell/module/az.sftp/).

#### [.NET](#tab/dotnet)

```csharp

using Microsoft.Identity.Client;
using Microsoft.Identity.Client.SSHCertificates;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;
public class Program
{
    private const string AZURE_CLI_CLIENT_ID = "<your-azure-cli-client-id>";
    private const string MY_TENANT_ID = "<your-tenant-id>";
    public static async Task Main(string[] args)
    {
        var options = new PublicClientApplicationOptions
        {
            ClientId = AZURE_CLI_CLIENT_ID,
        };
        var app = PublicClientApplicationBuilder.CreateWithApplicationOptions(options)
            .WithTenantId(MY_TENANT_ID)
            .WithDefaultRedirectUri()
            .Build();
        var scopes = new string[]
        {
            "`<https://pas.windows.net/CheckMyAccess/Linux/.default>`",
        };
        var keyId = new byte[32];
        Random.Shared.NextBytes(keyId);
        var rsa = RSA.Create();
        var key = rsa.ExportParameters(includePrivateParameters: true);
        if (key.Modulus == null || key.Exponent == null)
            throw new InvalidOperationException("RSA key generation failed: Modulus or Exponent is null.");
        var localKey = new
        {
            kty = "RSA",
            n = Convert.ToBase64String(key.Modulus).Replace("+", "-").Replace("/", "_"),
            e = Convert.ToBase64String(key.Exponent).Replace("+", "-").Replace("/", "_"),
            kid = BitConverter.ToString(keyId).Replace("-", string.Empty).ToLower(),
        };
        var localKeyJson = JsonConvert.SerializeObject(localKey);
        Console.WriteLine("RSA Key:");
        Console.WriteLine(localKeyJson);
        Console.WriteLine();

        // Get SSH certificate

        AuthenticationResult result = await app.AcquireTokenInteractive(scopes)
            .WithSSHCertificateAuthenticationScheme(localKeyJson, localKey.kid)
            .ExecuteAsync();

        // Define output directory and certificate path

        var sshDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), ".ssh", "entra");
        Directory.CreateDirectory(sshDir);
        var certPath = Path.Combine(sshDir, "id_rsa-cert.pub");

        // Remove read-only attribute if certificate already exists so it can be overwritten

        if (File.Exists(certPath))
        {
            File.SetAttributes(certPath, FileAttributes.Normal);
        }
        // Save the certificate
        var cert = `[$"ssh-rsa-cert-v01@openssh.com](mailto:$%22ssh-rsa-cert-v01@openssh.com)` {result.AccessToken}";
        await File.WriteAllTextAsync(certPath, cert);
        File.SetAttributes(certPath, FileAttributes.ReadOnly);
        // Dump certificate content to console
        Console.WriteLine("Cert");
        Console.WriteLine(cert);
        Console.WriteLine();
}
}
```

---

### Verify the contents of the OpenSSH certificate [Optional]

Use the following command to view the OpenSSH certificate:

`ssh-keygen -L -f my_cert.pub`

In the output, the _Principals_ section contains the username.

:::image type="content" source="./media/secure-file-transfer-protocol-support/verify-certificate.png" alt-text="Screenshot of the principals section in the command ouput.":::

For security reasons, the OpenSSH certificate is valid for 65 minutes. After this period, you need to request a new certificate to initiate any further transactions.

### Connect to the Storage Account by using OpenSSH

#### Connect by using an SFTP command

```bash
C:\Users\username> sftp -o PubkeyAcceptedKeyTypes="rsa-sha2-256-cert-v01@openssh.com,rsa-sha2-256" -o IdentityFile="C:\path\to\key\.ssh\id_rsa" -o CertificateFile="C:\path\to\cert\.ssh\my_cert.pub" storageaccountname.username@storageaccountname.blob.core.windows.net
Connected to storageaccountname.blob.core.windows.net.
sftp>
```

If the principal uses the format [username@domain.com](mailto:username@domain.com), make sure to exclude the domain section in the command and use only the username portion.

Both [User and service principals](/entra/identity-platform/app-objects-and-service-principals) are supported. For Service principals, use the service principal ID in place of the username in the connection string.

> [!NOTE]
> Adding the container name directly to the connection string or setting it up via Home directory isn't currently supported.

Once connected, use the following command to upload a file to Azure Storage via SFTP:

```bash
sftp> put 'C:\path\to\blob\blog.jpeg'
```

If you receive a permission denied error, ensure that you have the necessary Azure roles such as Storage Blob Data Contributor or Storage Blob Data Owner.

#### Connect by using an SFTP desktop client

SFTP clients such as WinSCP and PuTTY support OpenSSH-based authentication. The following steps show how to connect by using WinSCP:

1. WinSCP: Support for OpenSSH certificates for user authentication was implemented in version 6.0 (<https://winscp.net/tracker/1873>)
1. Obtain the OpenSSH certificate from the previous step (Generate OpenSSH certificate)
1. In WinSCP, enter the Host name and Username, and then select **Advanced**

   :::image type="content" source="./media/secure-file-transfer-protocol-support/login-dialog.png" alt-text="Screenshot of of the Login window and the Advanced option.":::

1. In the SSH tab, go to the Authentication section. Attach the private key and certificate files obtained from the previous sections, and then select **OK**.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/advanced-settings.png" alt-text="Screenshot of the Authentication settings in the Advanced Site Settings dialog box.":::

1. Select **Login** to sign in by using the Microsoft Entra ID account and OpenSSH certificate.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/login-button.png" alt-text="Screenshot Login dialog box.":::

##### [Azure CLI](#tab/azurecli)

Use the following command to connect by using the OpenSSH certificate obtained in the previous steps:

```azurecli
az sftp connect --storage-account <<account_name>> --certificate-file /my_cert.pub
```

Additionally, you can get the OpenSSH certificate and connect to SFTP by using a single command as follows:

```azurecli
az sftp connect
az sftp connect --storage-account <<account_name>>
```

For more information about the commands, see [here](/cli/azure/sftp).

##### [Azure PowerShell](#tab/azurepowershell)

Use the following command to connect by using the OpenSSH certificate obtained in the previous steps:

```powershell
Connect-AzSftp -StorageAccount "<<account_name>>" -CertificateFile "/my_cert.pub"
```

Additionally, you can get the OpenSSH certificate and connect to SFTP by using a single command as follows:

```powershell
Connect-AzAccount
Connect-AzSftp -StorageAccount "<<account_name>>"
```

For more information about the commands, see [here](/powershell/module/az.sftp/connect-azsftp).

##### [.NET](#tab/dotnet)

Not applicable.

---

## Microsoft Entra ID based access control model in Azure Blob Storage SFTP

| **Mechanism**                               | **Status**                                                                              | **Tutorial**                                                                                                                                           |
|---------------------------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Role-based access control (Azure RBAC)      | Supported                                                                               | [Access control model for Azure Data Lake Storage - Azure Storage &#124; Microsoft Learn](/azure/storage/blobs/data-lake-storage-access-control-model) |
| Access control lists (ACLs)                 | Supported                                                                               | [Access control model for Azure Data Lake Storage - Azure Storage &#124; Microsoft Learn](/azure/storage/blobs/data-lake-storage-access-control-model) |
| Attribute-based access control (Azure ABAC) | Not supported in public preview. If any ABAC rule exists, for SFTP it is ignored. |

## How permissions are evaluated

SFTP mirrors Azure Blob Storage's access control model. For more information, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md). However, during the public preview, ABAC support is partial. Learn more in the Known issues and limitations section.

## Sharing access to users outside of the home Microsoft Entra ID tenant

Organizations often need to share Azure Blob Storage SFTP access with external partners and customers. Microsoft Entra External Identities can address this requirement by enabling Azure Blob Storage SFTP to provide secure access to external collaborators. This feature enables efficient and secure connections and interactions with storage resources. By using Microsoft Entra ID External Identity capabilities, organizations can maintain strong access control and security measures while enabling collaboration with external entities. Learn more about [adding guest users](/entra/external-id/b2b-quickstart-add-guest-users-portal).

## Known issues and limitations

- Microsoft Entra ID support is limited to SSH certificates and public key authentication.

- Only RSA certificates are supported. ECDSA isn't supported.

- [ABAC](/azure/storage/blobs/storage-auth-abac-attributes) behavior is inconsistent when used with the Storage Blob Data Owner role and might lead to timeout errors. To use ABAC, choose the Storage Blob Data Contributor role, or use the Storage Blob Data Owner role without ABAC.

- ABAC [suboperations](/azure/storage/blobs/storage-auth-abac-attributes) are unsupported and behave incorrectly. Specific behaviors of the suboperations appear in the following list:

  - **List blobs (Blob.List):** Users can list blobs without any restrictions, and the ABAC condition expressions are ignored.

  - **Read a blob (NOT Blob.List):** Works as expected with the given ABAC condition expressions. However, for all other cases, the List blobs (`Blob.List`) action also inadvertently fails in addition to the expected failure of Read a blob (NOT `Blob.List`).

  - **_(Deprecated)_ Read content from a blob with tag conditions (Blob.Read.WithTagConditions):** The ABAC condition expressions are ignored.

  - **Set the access tier on a blob (Blob.Write.Tier):** The ABAC condition expressions are ignored.

  - **Write to a blob with blob index tag (Blob.Write.WithTagHeaders):** The ABAC condition expressions are ignored.

- Setting a home directory isn't supported.

- The connection string can't include the container name. The user connects to the root of the storage account and then navigates to the destination container and directories by using 'change directory' (cd) commands.

- Currently, `chown` and `chgrp` require either superuser and manage ownership permissions, or manage ownership, read, and write permissions. In the future, only manage ownership or superuser roles are required.

- For `chmod`, the current requirement is either superuser and modify permissions, or modify permissions, read, and write. In the future, only modify permissions or superuser is required.

## Troubleshooting

### Opening any container fails with "Access denied"

An `Access denied` error can happen even if you're able to connect to storage accounts through WinSCP, and you can see the list of containers after signing in.

This error can happen because WinSCP automatically tries to **canonicalize every directory** it enters. That means that for _every_ `cd` or directory listing, it sends one or more extra protocol requests to figure out the "true" absolute path.

- The **root directory** shows _containers_.
- Each container acts as **a virtual chroot**. Once you're inside it, you can't go above or outside it.
- Paths are **virtual**, not physical. Azure doesn't support `/`-based absolute traversal above containers.

Resolve this problem by using one of the following options:

- Disable **Resolve Symbolic Links**. Browse to **Advanced->Environment->Directories** and untick **Resolve Symbolic Links**.

- Set the remote directory. Browse to **Advanced->Environment->Directories**, and set **Remote Directory** to "\\\<container-name>". By setting this value, you directly enter the specified container after signing in.

## See also

- [SFTP support for Azure Blob Storage](secure-file-transfer-protocol-support.md)
