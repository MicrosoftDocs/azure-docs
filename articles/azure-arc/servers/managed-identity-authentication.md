---
title: Authenticate against Azure resources with Azure Arc-enabled servers
description: This article describes Azure Instance Metadata Service support for Azure Arc-enabled servers and how you can authenticate against Azure resources and local using a secret.
ms.topic: conceptual
ms.date: 11/08/2021
---

# Authenticate against Azure resources with Azure Arc-enabled servers

Applications or processes running directly on an Azure Arc-enabled servers can use managed identities to access other Azure resources that support Azure Active Directory-based authentication. An application can obtain an [access token](../../active-directory/develop/developer-glossary.md#access-token) representing its identity, which is system-assigned for Azure Arc-enabled servers, and use it as a 'bearer' token to authenticate itself to another service.

Refer to the [managed identity overview](../../active-directory/managed-identities-azure-resources/overview.md) documentation for a detailed description of managed identities, and understand the distinction between system-assigned and user-assigned identities.

In this article, we show you how a server can use a system-assigned managed identity to access Azure [Key Vault](../../key-vault/general/overview.md). Serving as a bootstrap, Key Vault makes it possible for your client application to then use a secret to access resources not secured by Azure Active Directory (AD). For example, TLS/SSL certificates used by your IIS web servers can be stored in Azure Key Vault, and securely deploy the certificates to Windows or Linux servers outside of Azure.

## Security overview

While onboarding your server to Azure Arc-enabled servers, several actions are performed to configure using a managed identity, similar to what is performed for an Azure VM:

- Azure Resource Manager receives a request to enable the system-assigned managed identity on the Azure Arc-enabled server.

- Azure Resource Manager creates a service principal in Azure AD for the identity of the server. The service principal is created in the Azure AD tenant that's trusted by the subscription.

- Azure Resource Manager configures the identity on the server by updating the Azure Instance Metadata Service (IMDS) identity endpoint for [Windows](../../virtual-machines/windows/instance-metadata-service.md) or [Linux](../../virtual-machines/linux/instance-metadata-service.md) with the service principal client ID and certificate. The endpoint is a REST endpoint accessible only from within the server using a well-known, non-routable IP address. This service provides a subset of metadata information about the Azure Arc-enabled server to help manage and configure it.

The environment of a managed-identity-enabled server will be configured with the following variables on a Windows Azure Arc-enabled server:

- **IMDS_ENDPOINT**: The IMDS endpoint IP address `http://localhost:40342` for Azure Arc-enabled servers.

- **IDENTITY_ENDPOINT**: the localhost endpoint corresponding to service's managed identity `http://localhost:40342/metadata/identity/oauth2/token`.

Your code that's running on the server can request a token from the Azure Instance Metadata service endpoint, accessible only from within the server.

The system environment variable **IDENTITY_ENDPOINT** is used to discover the identity endpoint by applications. Applications should try to retrieve **IDENTITY_ENDPOINT** and **IMDS_ENDPOINT** values and use them. Applications with any access level are allowed to make requests to the endpoints. Metadata responses are handled as normal and given to any process on the machine. However, when a request is made that would expose a token, we require the client to provide a secret to attest that they are able to access data only available to higher-privileged users.

## Prerequisites

- An understanding of Managed identities.
- On Windows, you must be a member of the local **Administrators** group or the **Hybrid Agent Extension Applications** group.
- On Linux, you must be a member of the **himds** group.
- A server connected and registered with Azure Arc-enabled servers.
- You are a member of the [Owner group](../../role-based-access-control/built-in-roles.md#owner) in the subscription or resource group, in order to perform required resource creation and role management steps.
- An Azure Key Vault to store and retrieve your credential, and assign the Azure Arc identity access to the KeyVault.

    - If you don't have a Key Vault created, see [Create Key Vault](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md#create-a-key-vault-).
    - To configure access by the managed identity used by the server, see [Grant access for Linux](../../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-nonaad.md#grant-access) or [Grant access for Windows](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md#grant-access). For step number 5, you are going to enter the name of the Azure Arc-enabled server. To complete this using PowerShell, see [Assign an access policy using PowerShell](../../key-vault/general/assign-access-policy-powershell.md).

## Acquiring an access token using REST API

The method to obtain and use a system-assigned managed identity to authenticate with Azure resources is similar to how it is performed with an Azure VM.

For an Azure Arc-enabled Windows server, using PowerShell, you invoke the web request to get the token from the local host in the specific port. Specify the request using the IP address or the environmental variable **IDENTITY_ENDPOINT**.

```powershell
$apiVersion = "2020-06-01"
$resource = "https://management.azure.com/"
$endpoint = "{0}?resource={1}&api-version={2}" -f $env:IDENTITY_ENDPOINT,$resource,$apiVersion
$secretFile = ""
try
{
    Invoke-WebRequest -Method GET -Uri $endpoint -Headers @{Metadata='True'} -UseBasicParsing
}
catch
{
    $wwwAuthHeader = $_.Exception.Response.Headers["WWW-Authenticate"]
    if ($wwwAuthHeader -match "Basic realm=.+")
    {
        $secretFile = ($wwwAuthHeader -split "Basic realm=")[1]
    }
}
Write-Host "Secret file path: " $secretFile`n
$secret = cat -Raw $secretFile
$response = Invoke-WebRequest -Method GET -Uri $endpoint -Headers @{Metadata='True'; Authorization="Basic $secret"} -UseBasicParsing
if ($response)
{
    $token = (ConvertFrom-Json -InputObject $response.Content).access_token
    Write-Host "Access token: " $token
}
```

The following response is an example that is returned:

:::image type="content" source="media/managed-identity-authentication/powershell-token-output-example.png" alt-text="A successful retrieval of the access token using PowerShell.":::

For an Azure Arc-enabled Linux server, using Bash, you invoke the web request to get the token from the local host in the specific port. Specify the following request using the IP address or the environmental variable **IDENTITY_ENDPOINT**. To complete this step, you need an SSH client.

```bash
CHALLENGE_TOKEN_PATH=$(curl -s -D - -H Metadata:true "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com" | grep Www-Authenticate | cut -d "=" -f 2 | tr -d "[:cntrl:]")
CHALLENGE_TOKEN=$(cat $CHALLENGE_TOKEN_PATH)
if [ $? -ne 0 ]; then
    echo "Could not retrieve challenge token, double check that this command is run with root privileges."
else
    curl -s -H Metadata:true -H "Authorization: Basic $CHALLENGE_TOKEN" "http://127.0.0.1:40342/metadata/identity/oauth2/token?api-version=2019-11-01&resource=https%3A%2F%2Fmanagement.azure.com"
fi
```

The following response is an example that is returned:

:::image type="content" source="media/managed-identity-authentication/bash-token-output-example.png" alt-text="A successful retrieval of the access token using Bash.":::

The response includes the access token you need to access any resource in Azure. To complete the configuration to authenticate to Azure Key Vault, see [Access Key Vault with Windows](../../active-directory/managed-identities-azure-resources/tutorial-windows-vm-access-nonaad.md#access-data) or [Access Key Vault with Linux](../../active-directory/managed-identities-azure-resources/tutorial-linux-vm-access-nonaad.md#access-data).

## Next steps

- To learn more about Azure Key Vault, see [Key Vault overview](../../key-vault/general/overview.md).

- Learn how to assign a managed identity access to a resource [using PowerShell](../../active-directory/managed-identities-azure-resources/howto-assign-access-powershell.md) or using [the Azure CLI](../../active-directory/managed-identities-azure-resources/howto-assign-access-cli.md).
