---
title:  Authorize SFTP access to blobs using Microsoft Entra ID
titleSuffix: Azure Storage
description: Learn how to authorize SSH File Transfer Protocol (SFTP) access to blobs by using Microsoft Entra ID.
author: jeevanbalanmanoj
ms.date: 02/24/2026
ms.topic: how-to
ms.service: azure-blob-storage
ms.author: normesta
---

# Authorize SSH File Transfer Protocol (SFTP) access to blobs using Microsoft Entra ID

Azure Blob Storage SFTP supports Microsoft Entra ID-based access. Previously, Azure Blob Storage SFTP supported only local user-based access, requiring either a password or an SSH private key for authentication. By using this feature, users can apply their Microsoft Entra ID to connect to Azure storage accounts through SFTP without needing to create and maintain local users.

Microsoft Entra ID-based access brings many benefits to Azure Blob Storage SFTP, including role-based access control (RBAC), multifactor authentication (MFA), and Microsoft Entra ID Access Control Lists (ACLs).

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

### Generate OpenSSH certificate

#### [Azure CLI](#tab/azurecli)

Generate the OpenSSH certificate with the Azure CLI [az sftp](/cli/azure/sftp) command as shown in the following example.

```azurecli
az login
az sftp cert --file ~/.ssh/my_cert.pub
``` 
For security reasons, the certificate is valid for only 65 minutes. After it expires, you need to rerun the command to get a new certificate.

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
az sftp cert --public-key-file ~/.ssh/id_rsa.pub --file ~/.ssh/my_cert.pub
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
az sftp cert --public-key-file ~/.ssh/id_rsa.pub --file ~/.ssh/my_cert.pub
```

#### [Azure PowerShell](#tab/azurepowershell)

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

Generate the OpenSSH certificate by using [PowerShell Az.Sftp](https://www.powershellgallery.com/packages/Az.Sftp/0.1.0) as shown in the following example:

```powershell
New-AzSftpCertificate -CertificatePath "$HOME\.ssh\my_cert.pub"
```

Optionally, use the following command to generate the OpenSSH certificate by using your SSH keys:

```powershell
New-AzSftpCertificate -PublicKeyFile "$HOME\.ssh\id_rsa.pub" -CertificatePath "$HOME\.ssh\my_cert.pub"
```

Learn more about the PowerShell module [here](/powershell/module/az.sftp/).

#### [Azure portal](#tab/portal)

You can also use the Azure portal to generate OpenSSH certificates and keys. To do so, complete the following steps:

1. In the Azure portal, navigate to your storage account and select **SFTP** under **Settings**.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/sftp-settings-pane.png" alt-text="Screenshot of the SFTP tab under storage account settings.":::

1. Select **Generate SSH Certificate**.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/generate-ssh-button.png" alt-text="Screenshot of the Generate SSH Certificate button.":::

1. In the pane that appears, choose one of the following three methods to generate a certificate:

    1. **Generate new key pair** - Generates both the certificate and a new SSH key pair.

       :::image type="content" source="./media/secure-file-transfer-protocol-support/generate-new-key-pair.png" alt-text="Screenshot of the generate new key pair option.":::

    1. **Use existing public key** - Uses a public key that you provide.

       :::image type="content" source="./media/secure-file-transfer-protocol-support/generate-using-existing-keys.png" alt-text="Screenshot of the use existing public key option.":::

    1. **Use Azure Key Vault** - Uses a public key stored in Azure Key Vault.

       :::image type="content" source="./media/secure-file-transfer-protocol-support/generate-from-key-vault.png" alt-text="Screenshot of the use Azure Key Vault key option.":::

1. After the certificate is generated, download the OpenSSH certificate and private key from the dialog.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/download-cert-button.png" alt-text="Screenshot of the download OpenSSH certificate dialog.":::

   :::image type="content" source="./media/secure-file-transfer-protocol-support/download-private-key.png" alt-text="Screenshot of the download private key dialog.":::

> [!NOTE]
> The Azure portal supports generating certificates for user principals only. Service principal certificates are not supported in the portal. To generate certificates for service principals, use Azure CLI or Azure PowerShell instead.


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

`ssh-keygen -L -f ~/.ssh/my_cert.pub`

In the output, the _Principals_ section contains the username.

:::image type="content" source="./media/secure-file-transfer-protocol-support/verify-certificate.png" alt-text="Screenshot of the principals section in the certificate output.":::

For security reasons, the OpenSSH certificate is valid for 65 minutes. After this period, you need to request a new certificate to initiate any further transactions.

### Connect to the Storage Account by using OpenSSH

#### Connect by using an SFTP command

```bash
sftp -o PubkeyAcceptedKeyTypes="rsa-sha2-256-cert-v01@openssh.com,rsa-sha2-256" -o IdentityFile="~/.ssh/id_rsa" -o CertificateFile="~/.ssh/my_cert.pub" <storageaccountname>.<username>@<storageaccountname>.blob.core.windows.net
```

If the principal uses the format [username@domain.com](mailto:username@domain.com), make sure to exclude the domain section in the command and use only the username portion.

Both [User and service principals](/entra/identity-platform/app-objects-and-service-principals) are supported. For Service principals, use the service principal ID in place of the username in the connection string.

> [!NOTE]
> Adding the container name directly to the connection string or setting it up via Home directory isn't supported.

Once connected, use the following command to upload a file to Azure Storage via SFTP:

```bash
put <local-file-path>
```

If you receive a permission denied error, ensure that you have the necessary Azure roles such as Storage Blob Data Contributor or Storage Blob Data Owner.

#### Connect by using an SFTP desktop client

SFTP clients such as WinSCP and PuTTY support OpenSSH-based authentication. The following steps show how to connect by using WinSCP:

1. WinSCP: Support for OpenSSH certificates for user authentication was implemented in version 6.0 (<https://winscp.net/tracker/1873>)
1. Obtain the OpenSSH certificate from the previous step (Generate OpenSSH certificate)
1. In WinSCP, enter the Host name and Username, and then select **Advanced**

   :::image type="content" source="./media/secure-file-transfer-protocol-support/login-dialog.png" alt-text="Screenshot of the WinSCP login window with the Advanced option.":::

1. In the SSH tab, go to the Authentication section. Attach the private key and certificate files obtained from the previous sections, and then select **OK**.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/advanced-settings.png" alt-text="Screenshot of the authentication settings with private key and certificate fields.":::

1. Select **Login** to sign in by using the Microsoft Entra ID account and OpenSSH certificate.

   :::image type="content" source="./media/secure-file-transfer-protocol-support/login-button.png" alt-text="Screenshot of the WinSCP login button.":::

##### [Azure CLI](#tab/connect-azurecli)

Use the following command to connect by using the OpenSSH certificate obtained in the previous steps:

```azurecli
az sftp connect --storage-account <account_name> --certificate-file ~/.ssh/my_cert.pub
```

Additionally, you can get the OpenSSH certificate and connect to SFTP by using a single command as follows:

```azurecli
az sftp connect
az sftp connect --storage-account <account_name>
```

For more information about the commands, see [here](/cli/azure/sftp).

##### [Azure PowerShell](#tab/connect-azurepowershell)

Use the following command to connect by using the OpenSSH certificate obtained in the previous steps:

```powershell
Connect-AzSftp -StorageAccount "<account_name>" -CertificateFile "$HOME\.ssh\my_cert.pub"
```

Additionally, you can get the OpenSSH certificate and connect to SFTP by using a single command as follows:

```powershell
Connect-AzAccount
Connect-AzSftp -StorageAccount "<account_name>"
```

For more information about the commands, see [here](/powershell/module/az.sftp/connect-azsftp).

##### [.NET](#tab/connect-dotnet)

Not applicable.

---

## Microsoft Entra ID based access control model in Azure Blob Storage SFTP

| **Mechanism**                               | **Status**                                                                              | **Tutorial**                                                                                                                                           |
|---------------------------------------------|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| Role-based access control (Azure RBAC)      | Supported                                                                               | [Access control model for Azure Data Lake Storage - Azure Storage &#124; Microsoft Learn](/azure/storage/blobs/data-lake-storage-access-control-model) |
| Access control lists (ACLs)                 | Supported                                                                               | [Access control model for Azure Data Lake Storage - Azure Storage &#124; Microsoft Learn](/azure/storage/blobs/data-lake-storage-access-control-model) |
| Attribute-based access control (Azure ABAC) | Supported                                                                               | [Access control model for Azure Data Lake Storage - Azure Storage &#124; Microsoft Learn](/azure/storage/blobs/data-lake-storage-access-control-model) |

## How permissions are evaluated

SFTP mirrors Azure Blob Storage's access control model. For more information, see [Access control model in Azure Data Lake Storage](data-lake-storage-access-control-model.md).

## Sharing access to users outside of the home Microsoft Entra ID tenant

Organizations often need to share Azure Blob Storage SFTP access with external partners and customers. Microsoft Entra External Identities can address this requirement by enabling Azure Blob Storage SFTP to provide secure access to external collaborators. This feature enables efficient and secure connections and interactions with storage resources. By using Microsoft Entra ID External Identity capabilities, organizations can maintain strong access control and security measures while enabling collaboration with external entities. Learn more about [adding guest users](/entra/external-id/b2b-quickstart-add-guest-users-portal).

## Known issues and limitations

- Managed identity authorization is not supported for SFTP with Microsoft Entra ID.

- Microsoft Entra ID support is limited to SSH certificates and public key authentication.

- Only RSA certificates are supported. ECDSA isn't supported.

- Setting a home directory isn't supported.

- The connection string can't include the container name. The user connects to the root of the storage account and then navigates to the destination container and directories by using 'change directory' (cd) commands.

- `chown` and `chgrp` require either manage ownership or superuser permissions.

- `chmod` requires either modify permissions or superuser permissions.

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
