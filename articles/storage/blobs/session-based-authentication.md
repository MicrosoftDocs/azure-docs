---
title: Session-based authentication (preview)
titleSuffix: Azure Storage
description: Learn how session-based authentication reduces per-request authentication and authorization time for applications and AI agents that read data from Azure Blob Storage and Azure Data Lake Storage.
author: jeffpatt24
ms.author: jeffpatt
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 11/13/2026
ms.custom: preview
---

# Session-based authentication (preview)

Session-based authentication reduces the per-request authentication and authorization time for AI agents and applications while preserving the security controls organizations already rely on. With session-based authentication, an agent or application authenticates once with Microsoft Entra ID, establishes a short-lived session for a container, and uses that session for subsequent reads.

Session-based authentication is well suited for read-heavy, latency-sensitive workloads that make many requests to the same container by using the same identity, such as AI agents, AI training and inference, analytics, and high-performance computing.

> [!IMPORTANT]
> Session-based authentication is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for terms that apply to Azure features that are in preview.

## Benefits

- **Improved performance.** Identity and permissions are verified once when the session is created. Subsequent read requests to the container use that session, which reduces per-request authentication and authorization latency.
- **The same least-privileged access, now short-lived.** Sessions use your organization's existing permission model for least-privileged access, Azure RBAC and Azure ABAC. Each session is also scoped to one container, expires after five minutes, is bound to the client that created it, and requires every request to be signed.
- **Full traceability.** Azure Storage diagnostic logs currently record the Microsoft Entra ID identity behind each request, and the same is true with sessions. With sessions, every request remains tied to the Microsoft Entra ID identity that created the session, so security teams keep visibility into which identity, human or agent, accessed what data, and when.
- **No changes to application logic.** By using the Azure Storage client libraries, you enable session-based authentication with a single client configuration option.

## How session-based authentication works

When a client calls the [Create Session](/rest/api/storageservices/create-session) operation, Azure Storage verifies the client's Microsoft Entra ID identity, evaluates Azure RBAC role assignments and Azure ABAC conditions for the container, starts a five-minute session, and returns session credentials. The session credentials consist of two parts:

- **Session token:** identifies the session.
- **Session key:** used by the client to sign each request made within the session.

For subsequent [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) requests to the same container, the client sends the session token together with a signature computed with the session key, instead of a Microsoft Entra ID access token. Because the identity and permissions were verified when the session was created, per-request authentication and authorization time is reduced.

The session flow has these steps:

1. The client obtains a Microsoft Entra ID access token for Azure Storage.
2. The client calls the [Create Session](/rest/api/storageservices/create-session) operation for the target container. Azure Storage authorizes the request by using the Microsoft Entra ID access token.
3. Azure Storage returns the session credentials and the session expiration time.
4. The client uses the session credentials to authorize [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) requests for blobs in the same container.
5. To continue reading data, the client creates a new session before the current session expires.

> [!NOTE]
> When you use the [Azure Storage SDK](../common/storage-srp-overview.md), the client library manages the full session lifecycle automatically.

Sessions are designed with the following security boundaries:

- **Scoped to a single container.** A session can authorize requests only for blobs in the container for which it was created.
- **Tied to the originating identity.** A session never grants permissions beyond those assigned to the Microsoft Entra ID security principal that created it. All requests made through the session are attributed to that identity.
- **Short-lived.** A session expires after five minutes. Session credentials can't be extended or refreshed; the client must create a new session to continue.
- **Bound to the client's network context.** A session is bound to the client IP address that created it, which helps prevent captured session credentials from being replayed by another client. The same session can be used across multiple connections from the same client IP address.
- **Signed requests.** Each request made within a session is signed with the session key.
- **Auditing.** Requests made within a session are logged in the Azure Storage diagnostic logs.

## When to use session-based authentication

Consider session-based authentication when all the following conditions are true:

- The application uses Microsoft Entra ID for authentication and Azure RBAC for authorization.
- The application performs repeated [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) requests against blobs in the same container.
- The application can securely manage temporary session credentials and recreate sessions as needed. The Azure Storage SDK handles this automatically.

Don't use session-based authentication when any of the following conditions are true:

- The agent or application uses user delegation SAS, service SAS, account SAS, or Shared Key for authentication and authorization.
- The agent or application needs to perform an operation other than Get Blob. These operations must use a Microsoft Entra ID access token for authentication and authorization. The Azure Storage SDK handles this automatically.
- The application makes only an occasional or single [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) request and doesn't benefit from an additional session-creation request.

## Billing

Creating a session is billed as a standard write transaction for your storage account. [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) requests made with a session are billed at the standard transaction rates for your storage account type. To learn more, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/).

## Get started

To get started, register for the preview by using Azure PowerShell or Azure CLI.

### [PowerShell](#tab/powershell)

Run the following commands to register for the preview:

```azurepowershell
Connect-AzAccount -SubscriptionId <subscription-id>
Register-AzProviderFeature -FeatureName SessionRequest -ProviderNamespace Microsoft.Storage
```

To check your registration state, run the following commands:

```azurepowershell
Connect-AzAccount -SubscriptionId <subscription-id>
Get-AzProviderFeature -FeatureName SessionRequest -ProviderNamespace Microsoft.Storage
```

### [Azure CLI](#tab/azure-cli)

Run the following commands to register for the preview:

```azurecli
az account set --subscription <subscription-id>
az feature register --namespace Microsoft.Storage --name SessionRequest
```

To check your registration state, run the following commands:

```azurecli
az account set --subscription <subscription-id>
az feature show --namespace Microsoft.Storage --name SessionRequest
```

---

> [!NOTE]
> It might take a few days for your registration to be approved. After your registration is approved, the registration state shows as **Registered**.

## Use sessions with the Azure Storage SDK

The [Azure Storage SDK](../common/storage-srp-overview.md) offers the simplest way to use session-based authentication. Enable session-based authentication when you initialize your Blob client; the rest of your application logic stays the same.

When session-based authentication is enabled, the SDK manages the full session lifecycle automatically:

- Creates a session and caches its credentials.
- Automatically signs every request with the session key.
- Uses the session token for [Get Blob](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id) operations and a Microsoft Entra ID access token for other operations.
- Renews the session before expiration without affecting data access, so your app never needs to track session lifetimes.

Your existing code continues to read blobs by using the same methods, Microsoft Entra ID credentials, and RBAC role assignments, while benefiting from lower-latency reads.

> [!NOTE]
> To use session-based authentication with the Azure Storage SDK, install the latest [Azure Blob client library package](../common/storage-srp-overview.md?tabs=dotnet) for data access. For example, for Python, install package version 12.31.1 or later. For .NET, install package version 12.31.0-beta.1 or later.

The following SDK examples read a blob by using a session.

### [.NET](#tab/dotnet)

```csharp
using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

string accountName = "<storage-account-name>";
string containerName = "<container-name>";
string blobName = "<blob-name>";

var options = new BlobClientOptions
{
    SessionOptions = new SessionOptions
    {
        SessionMode = SessionMode.Enabled
    }
};

var serviceClient = new BlobServiceClient(
    new Uri($"https://{accountName}.blob.core.windows.net"),
    new DefaultAzureCredential(),
    options);

BlobContainerClient containerClient =
    serviceClient.GetBlobContainerClient(containerName);
BlobClient blobClient = containerClient.GetBlobClient(blobName);

var response = await blobClient.DownloadStreamingAsync();
using Stream content = response.Value.Content;
using var reader = new StreamReader(content);
string text = await reader.ReadToEndAsync();
Console.WriteLine(text);
```

### [Python](#tab/python)

```python
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient

account_url = "https://<storage-account>.blob.core.windows.net"
container_name = "<container-name>"
blob_name = "<blob-name>"

with DefaultAzureCredential() as credential:
    with BlobServiceClient(
        account_url=account_url,
        credential=credential,
        use_session=True,
    ) as service:
        container = service.get_container_client(container_name)
        content = container.download_blob(blob_name).readall()
        print(f"Downloaded {len(content)} bytes.")
```

### [Java](#tab/java)

```java
import com.azure.core.util.BinaryData;
import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.SessionContext;
import com.azure.storage.blob.SessionContext.SessionMode;

public class JavaSessionExample {
    public static void main(String[] args) {
        String accountName = "<storage-account-name>";
        String containerName = "<container-name>";
        String blobName = "<blob-name>";

        SessionContext sessionContext = new SessionContext()
            .setSessionMode(SessionMode.ENABLED)
            .setAccountName(accountName);

        BlobServiceClient serviceClient = new BlobServiceClientBuilder()
            .endpoint("https://" + accountName + ".blob.core.windows.net")
            .credential(new DefaultAzureCredentialBuilder().build())
            .sessionContext(sessionContext)
            .buildClient();

        BlobContainerClient containerClient =
            serviceClient.getBlobContainerClient(containerName);

        BinaryData content = containerClient.getBlobClient(blobName).downloadContent();
        System.out.println(content.toString());
    }
}
```

### [Rust](#tab/rust)

```rust
use azure_core::http::Url;
use azure_identity::DeveloperToolsCredential;
use azure_storage_blob::{
    BlobServiceClient, BlobServiceClientOptions, SessionMode, SessionOptions,
};
use std::{env, error::Error};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let account_name = env::var("AZURE_STORAGE_ACCOUNT_NAME")?;
    let container_name = env::var("AZURE_STORAGE_CONTAINER_NAME")?;
    let blob_name = env::var("AZURE_STORAGE_BLOB_NAME")?;

    let credential = DeveloperToolsCredential::new(None)?;

    let options = BlobServiceClientOptions {
        session_options: Some(SessionOptions {
            mode: SessionMode::Enabled,
            account_name: Some(account_name.clone()),
            ..Default::default()
        }),
        ..Default::default()
    };

    let service = BlobServiceClient::new(
        Url::parse(&format!("https://{account_name}.blob.core.windows.net/"))?,
        Some(credential),
        Some(options),
    )?;

    let container = service.blob_container_client(&container_name);
    let blob = container.blob_client(&blob_name);

    let response = blob.download(None).await?;
    let data = response.body.collect().await?;

    println!("Read {} bytes from {container_name}/{blob_name}.", data.len());
    Ok(())
}
```

### [C++](#tab/cpp)

```cpp
#include <azure/identity/default_azure_credential.hpp>
#include <azure/storage/blobs.hpp>
#include <cstdlib>
#include <exception>
#include <iostream>
#include <memory>
#include <string>

int main()
{
    using namespace Azure::Storage::Blobs;

    try
    {
        const std::string accountUrl = "https://<account>.blob.core.windows.net";
        const std::string containerName = "<container>";
        const std::string blobName = "<blob>";
        const std::string outputPath = "downloaded-blob.bin";

        auto credential = std::make_shared<Azure::Identity::DefaultAzureCredential>();

        BlobClientOptions options;
        options.Session.Mode = SessionMode::Enabled;

        BlobServiceClient serviceClient(accountUrl, credential, options);
        auto containerClient = serviceClient.GetBlobContainerClient(containerName);
        auto blobClient = containerClient.GetBlobClient(blobName);

        blobClient.DownloadTo(outputPath);

        std::cout << "Downloaded " << containerName << "/" << blobName
                  << " to " << outputPath << '\n';
        return EXIT_SUCCESS;
    }
    catch (const std::exception& error)
    {
        std::cerr << "Blob download failed: " << error.what() << '\n';
        return EXIT_FAILURE;
    }
}
```

---

## Use sessions with the REST API

If you call the REST APIs directly instead of using the [Azure Storage SDK](../common/storage-srp-overview.md), your application must create a session, sign requests, and create a replacement session before the current session expires.

1. **Create a session.** Call the Create Session operation on the container and authorize the request with a Microsoft Entra ID access token. A successful response returns the session token, the session key, and the session expiration time. Store the session credentials securely and associate them with the container for which they were created.

    **Sample request**

    ```http
    POST https://myaccount.blob.core.windows.net/mycontainer?restype=container&comp=session
    Authorization: Bearer {Entra access token}
    x-ms-date: {date}
    x-ms-version: {version}

    <?xml version="1.0" encoding="utf-8"?>
    <CreateSessionRequest>
      <AuthenticationType>HMAC</AuthenticationType>
    </CreateSessionRequest>
    ```

    Create Session is supported only in version 2026-02-06 or later. For more details, see the [Create Session REST API](/rest/api/storageservices/create-session) documentation.

1. **Read a blob by using the session.** Call the Get Blob operation. The Authorization header contains the session token and a signature computed with the session key. The session key itself is never sent.

    **Sample request**

    ```http
    GET https://myaccount.blob.core.windows.net/mycontainer/myblob
    Authorization: Session {SessionToken}:{Signature}
    x-ms-version: {version}
    ```

    For more details, see the [Create Session REST API](/rest/api/storageservices/create-session) documentation.

1. **Renew before expiration.** A session expires after five minutes and can't be extended. Requests made with an expired session fail. When uninterrupted access is required, create a replacement session before the current session expires.

## Considerations and limitations

- **To use this feature, you must be approved to join the preview.** For more information, see [Get started](#get-started).
- **Session-based authentication is limited to Get Blob operations.** Session tokens support only the Get Blob operation; all other operations require a Microsoft Entra ID access token. The Azure Storage SDKs handle this automatically by choosing which token to use based on the operation.
- **Session-based authentication reduces authentication and authorization time for high-frequency read workloads.** Rather than performing full OAuth token validation and authorization evaluation on every Get Blob request, Azure Storage establishes a temporary security context that can be reused across subsequent requests. This reduces per-request authentication and authorization time and helps deliver more predictable latency for throughput-intensive and latency-sensitive workloads.
- **The largest benefits are realized when many Get Blob requests are performed in a short period of time.** Session-based authentication is intended for applications performing repeated reads at large scale, where reducing authentication and authorization time across many requests can improve overall efficiency and latency consistency. There's no performance advantage to creating multiple sessions per container per user. As such, each user with access to the container should use only one session at a time.
- **Session-based authentication requires Microsoft Entra ID to create a session.** The client authenticates the Create Session request with a Microsoft Entra ID access token. Azure Storage returns temporary session credentials that can be used for subsequent Get Blob requests during the session lifetime. Permissions aren't elevated or expanded; the session inherits the permissions already granted to the Microsoft Entra ID identity through Azure RBAC and Azure ABAC. Session-based authentication doesn't support user-bound user delegation SAS, user delegation SAS, service SAS, account SAS, or Shared Key authorization.
- **Sessions are given authorization at the container level.** The container's Azure RBAC and Azure ABAC policies are evaluated at the container level upon session creation, and those permissions are used throughout the lifetime of the session. This means that Azure ABAC policies at a more granular level than the container aren't evaluated. Additionally, if a container-level Azure RBAC or Azure ABAC permission is changed within the five minutes of the session lifetime, it isn't applied until a new session token is created. Follow the principle of least privilege when you assign Azure roles. Grant read access only at the narrowest scope that the application requires. For more information, see [Assign an Azure role for access to blob data](assign-azure-role-data-access.md).
- **Sessions are designed with transparent security boundaries.** A session is scoped to a single container, tied to the identity that created it, and expires after five minutes. All requests made through the session are attributed to the original Microsoft Entra ID identity. Session credentials can't be reused indefinitely and must be recreated after expiration. Sessions are also bound to the originating client IP, helping prevent session credentials from being reused by another machine.
- **Not supported:**
    - Blob index tags for the Get Blob operation, which means you can't see any tags associated with the blob you're accessing while using a session token.
    - Get Blob reads on secondary accounts; you can call Get Blob with a session token as the authentication method only on the primary account.
    - Page blobs and Append blobs, only Block blobs are supported.
    - User-bound user delegation SAS, user delegation SAS, service SAS, account SAS, and Shared Key authorization, only Microsoft Entra ID is supported for authentication.
    - Microsoft Purview isn't supported with session tokens.

## Monitor session-based authentication

Azure Storage logs Create Session requests and requests made within a session in Azure Monitor resource logs. To collect these logs, configure a diagnostic setting for Blob Storage that sends **StorageRead** logs to a Log Analytics workspace, storage account, or event hub. For more information, see [Monitor Azure Blob Storage](monitor-blob-storage.md).

### Create Session requests

Create Session requests appear with the operation name **CreateSession** in the **StorageRead** category, with an authentication type of **OAuth**. Each entry includes:

- **Caller identity:** the Microsoft Entra ID security principal that created the session, including its object ID, tenant ID, user principal name, and client application ID.
- **Authorization decision:** the action evaluated, the Azure role assignment and role definition that granted access, and the result.
- **Session ID:** a unique identifier for the session.
- **Target container:** the storage account and container the session is scoped to.
- **Network and request details:** caller IP address, protocol, TLS version, status code, latency, client request ID, and user agent.

### Requests made within a session

Get Blob requests authorized by a session appear with the operation name **GetBlob** in the **StorageRead** category, with an authentication type of **Session**. Instead of the caller's identity and authorization details, each entry includes the **session ID** of the session used to authorize the request, together with the blob that was read, the caller IP address, and standard request details.

To find the Microsoft Entra ID identity behind a request made within a session, match the session ID in the **GetBlob** operation to the session ID in the corresponding **CreateSession** operation. The Create Session entry records the Microsoft Entra identity and the Azure role assignment that authorized the session.

## Troubleshooting

When a session request fails, check the response header for specific information about the failure.

| Symptom | Recommended action |
|---|---|
| Create Session request fails | Verify that the request uses a valid Microsoft Entra ID access token, targets the intended container, uses HTTPS, and that the security principal has the required permissions. |
| Get Blob request returns an authorization error | Verify that the session was created for the same container and that the Microsoft Entra ID security principal has read access to the requested blob. |
| The session has expired or isn't found | Create a new session and retry the Get Blob request with the new session credentials. |
| The session token is invalid | Discard the current session credentials, create a new session, and make sure that the credential values aren't modified. |
| A different operation fails with session authorization | Use session-based authentication only for the Get Blob operation. Use a Microsoft Entra ID access token for other operations. |

## Next steps

- [Authorize access to blobs by using Microsoft Entra ID](authorize-access-azure-active-directory.md)
- [Assign an Azure role for access to blob data](assign-azure-role-data-access.md)
- [Create Session REST API](/rest/api/storageservices/create-session)
- [Get Blob REST API](/rest/api/storageservices/get-blob?tabs=microsoft-entra-id)
