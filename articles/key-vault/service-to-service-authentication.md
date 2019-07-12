---
title: Service-to-service authentication to Azure Key Vault using .NET
description: Use the Microsoft.Azure.Services.AppAuthentication library to authenticate to Azure Key Vault using .NET.
keywords: azure key-vault authentication local credentials
author: msmbaldwin
manager: barbkess
services: key-vault

ms.author: mbaldwin
ms.date: 07/06/2019
ms.topic: conceptual
ms.service: key-vault

---

# Service-to-service authentication to Azure Key Vault using .NET

To authenticate to Azure Key Vault you need an Azure Active Directory (AD) credential, either a shared secret or a certificate. 

Managing such credentials can be difficult and it's tempting to bundle credentials into an app by including them in source or configuration files.  The `Microsoft.Azure.Services.AppAuthentication` for .NET library simplifies this problem. It uses the developer's credentials to authenticate during local development. When the solution is later deployed to Azure, the library automatically switches to application credentials.    Using developer credentials during local development is more secure because you do not need to create Azure AD credentials or share credentials between developers.

The `Microsoft.Azure.Services.AppAuthentication` library manages authentication automatically, which in turn allows you to focus on your solution, rather than your credentials.  It supports local development with Microsoft Visual Studio, Azure CLI, or Azure AD Integrated Authentication. When deployed to an Azure resource that supports a managed identity, the library automatically uses [managed identities for Azure resources](../active-directory/msi-overview.md). No code or configuration changes are required. The library also supports direct use of Azure AD [client credentials](../azure-resource-manager/resource-group-authenticate-service-principal.md) when a managed identity is not available, or when the developer's security context cannot be determined during local development.

## Using the library

For .NET applications, the simplest way to work with a managed identity is through the `Microsoft.Azure.Services.AppAuthentication` package. Here's how to get started:

1. Add references to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) and [Microsoft.Azure.KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault) NuGet packages to your application. 

2. Add the following code:

    ``` csharp
    using Microsoft.Azure.Services.AppAuthentication;
    using Microsoft.Azure.KeyVault;

    // Instantiate a new KeyVaultClient object, with an access token to Key Vault
    var azureServiceTokenProvider1 = new AzureServiceTokenProvider();
    var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider1.KeyVaultTokenCallback));

    // Optional: Request an access token to other Azure services
    var azureServiceTokenProvider2 = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider2.GetAccessTokenAsync("https://management.azure.com/").ConfigureAwait(false);
    ```

The `AzureServiceTokenProvider` class caches the token in memory and retrieves it from Azure AD just before expiration. Consequently, you no longer have to check the expiration before calling the `GetAccessTokenAsync` method. Just call the method when you want to use the token. 

The `GetAccessTokenAsync` method requires a resource identifier. To learn more, see [which Azure services support managed identities for Azure resources](../active-directory/msi-overview.md).

## Local development authentication

For local development, there are two primary authentication scenarios: [authenticating to Azure services](#authenticating-to-azure-services), and [authenticating to custom services](#authenticating-to-custom-services).

### Authenticating to Azure Services

Local machines do not support managed identities for Azure resources.  As a result, the `Microsoft.Azure.Services.AppAuthentication` library uses your developer credentials to run in your local development environment. When the solution is deployed to Azure, the library uses a managed identity to switch to an OAuth 2.0 client credential grant flow.  This means you can test the same code locally and remotely without worry.

For local development, `AzureServiceTokenProvider` fetches tokens using **Visual Studio**, **Azure command-line interface** (CLI), or **Azure AD Integrated Authentication**. Each option is tried sequentially and the library uses the first option that succeeds. If no option works, an `AzureServiceTokenProviderException` exception is thrown with detailed information.

### Authenticating with Visual Studio

Authenticating with Visual Studio has the following prerequisites:

1. [Visual Studio 2017 v15.5](https://blogs.msdn.microsoft.com/visualstudio/2017/10/11/visual-studio-2017-version-15-5-preview/) or later.

2. The [App Authentication extension for Visual Studio](https://go.microsoft.com/fwlink/?linkid=862354), available as a separate extension for Visual Studio 2017 Update 5 and bundled with the product in Update 6 and later. With Update 6 or later, you can verify the installation of the App Authentication extension by selecting Azure Development tools from within the Visual Studio installer.
 
Sign in to Visual Studio and use **Tools**&nbsp;>&nbsp;**Options**&nbsp;>&nbsp;**Azure Service Authentication** to select an account for local development. 

If you run into problems using Visual Studio, such as errors regarding the token provider file, carefully review these steps. 

It may also be necessary to reauthenticate your developer token. To do so, go to **Tools**&nbsp;>&nbsp;**Options**>**Azure&nbsp;Service&nbsp;Authentication** and look for a **Re-authenticate** link under the selected account.  Select it to authenticate. 

### Authenticating with Azure CLI

To use Azure CLI for local development:

1. Install [Azure CLI v2.0.12](/cli/azure/install-azure-cli) or later. Upgrade earlier versions. 

2. Use **az login** to sign in to Azure.

Use `az account get-access-token` to verify access.  If you receive an error, verify that Step 1 completed successfully. 

If Azure CLI is not installed to the default directory, you may receive an error reporting that `AzureServiceTokenProvider` cannot find the path for Azure CLI.  Use the **AzureCLIPath** environment variable to define the Azure CLI installation folder. `AzureServiceTokenProvider` adds the directory specified in the **AzureCLIPath** environment variable to the **Path** environment variable when necessary.

If you are signed in to Azure CLI using multiple accounts or your account has access to multiple subscriptions, you need to specify the specific subscription to be used.  To do so, use:

```
az account set --subscription <subscription-id>
```

This command generates output only on failure.  To verify the current account settings, use:

```
az account list
```

### Authenticating with Azure AD authentication

To use Azure AD authentication, verify that:

- Your on-premises active directory [syncs to Azure AD](../active-directory/connect/active-directory-aadconnect.md).

- Your code is running on a domain-joined machine.


### Authenticating to custom services

When a service calls Azure services, the previous steps work because Azure services allow access to both users and applications.  

When creating a service that calls a custom service, use Azure AD client credentials for local development authentication.  There are two options: 

1.  Use a service principal to sign into Azure:

    1.  [Create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

    2.  Use Azure CLI to sign in:

        ```azurecli
        az login --service-principal -u <principal-id> --password <password> --tenant <tenant-id> --allow-no-subscriptions
        ```

        Because the service principal may not have access to a subscription, use the `--allow-no-subscriptions` argument.

2.  Use environment variables to specify service principal details.  For details, see [Running the application using a service principal](#running-the-application-using-a-service-principal).

Once you've signed in to Azure, `AzureServiceTokenProvider` uses the service principal to retrieve a token for local development.

This applies only to local development. When your solution is deployed to Azure, the library switches to a managed identity for authentication.

## Running the application using managed identity or user-assigned identity 

When you run your code on an Azure App Service or an Azure VM with a managed identity enabled, the library automatically uses the managed identity. 

Alternatively, you may authenticate with a user-assigned identity. For more information on user-assigned identities, see [About Managed Identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md#how-does-the-managed-identities-for-azure-resources-work). To authenticate with a user-assigned identity, you need to specify the Client ID of the user-assigned identity in the connection string. The connection string is specified in the [Connection String Support](#connection-string-support) section below.

## Running the application using a Service Principal 

It may be necessary to create an Azure AD Client credential to authenticate. Common examples include:

- Your code runs on a local development environment, but not under the developer's identity.  Service Fabric, for example, uses the [NetworkService account](../service-fabric/service-fabric-application-secret-management.md) for local development.
 
- Your code runs on a local development environment and you authenticate to a custom service, so you can't use your developer identity. 
 
- Your code is running on an Azure compute resource that does not yet support managed identities for Azure resources, such as Azure Batch.

There are three primary methods of using a Service Principal to run your application. To use any of them, you must first [create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

### Use a certificate in local keystore to sign into Azure AD

1. Create a service principal certificate using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command. 

    ```azurecli
    az ad sp create-for-rbac --create-cert
    ```

    This will create a .pem file (private key) that will be stored in your home directory. Deploy this certificate to either the *LocalMachine* or *CurrentUser* store. 

    > [!Important]
    > The CLI command generates a .pem file, but Windows only provides native support for PFX certificates. To generate a PFX certificate instead, use the PowerShell commands shown here: [Create service principal with self-signed certificate](../active-directory/develop/howto-authenticate-service-principal-powershell.md#create-service-principal-with-self-signed-certificate). These commands automatically deploy the certificate as well.

1. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};
          CertificateStoreLocation={CertificateStore}
    ```
 
    Replace *{AppId}*, *{TenantId}*, and *{Thumbprint}* with values generated in Step 1. Replace *{CertificateStore}* with either `LocalMachine` or `CurrentUser`, based on your deployment plan.

1. Run the application. 

### Use a shared secret credential to sign into Azure AD

1. Create a service principal certificate with a password using [az ad sp create-for-rbac --password](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac). 

2. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret} 
    ```

    Replace _{AppId}_, _{TenantId}_, and _{ClientSecret}_ with values generated in Step 1.

3. Run the application. 

Once everything's set up correctly, no further code changes are necessary.  `AzureServiceTokenProvider` uses the environment variable and the certificate to authenticate to Azure AD. 

### Use a certificate in Key Vault to sign into Azure AD

This option allows you to store a service principal's client certificate in Key Vault and use it for service principal authentication. You may use this for the following scenarios:

* Local authentication, where you want to authenticate using an explicit service principal, and want to keep the service principal credential securely in a key vault. Developer account must have access to the key vault. 
* Authentication from Azure where you want to use explicit credential (e.g. for cross-tenant scenarios), and want to keep the service principal credential securely in a key vault. Managed identity must have access to key vault. 

The managed identity or your developer identity must have permission to retrieve the client certificate from the Key Vault. The AppAuthentication library uses the retrieved certificate as the service principal's client credential.

To use a client certificate for service principal authentication

1. Create a service principal certificate and automatically store it in your keyvault using the Azure CLI [az ad sp create-for-rbac --keyvault <keyvaultname> --cert <certificatename> --create-cert --skip-assignment](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

    ```azurecli
    az ad sp create-for-rbac --keyvault <keyvaultname> --cert <certificatename> --create-cert --skip-assignment
    ```
    
    The certificate identifier will be a URL in the format `https://<keyvaultname>.vault.azure.net/secrets/<certificatename>`

1. Replace `{KeyVaultCertificateSecretIdentifier}` in this connection string with the certificate identifier:

    ```
    RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier={KeyVaultCertificateSecretIdentifier}
    ```

    If, for instance your key vault was called "myKeyVault" and you created a certificate called 'myCert', the certificate identifier would be:

    ```
    RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier=https://myKeyVault.vault.azure.net/secrets/myCert
    ```


## Connection String Support

By default, `AzureServiceTokenProvider` uses multiple methods to retrieve a token. 

To control the process, use a connection string passed to the `AzureServiceTokenProvider` constructor or specified in the *AzureServicesAuthConnectionString* environment variable. 

The following options are supported:

| Connection string option | Scenario | Comments|
|:--------------------------------|:------------------------|:----------------------------|
| `RunAs=Developer; DeveloperTool=AzureCli` | Local development | AzureServiceTokenProvider uses AzureCli to get token. |
| `RunAs=Developer; DeveloperTool=VisualStudio` | Local development | AzureServiceTokenProvider uses Visual Studio to get token. |
| `RunAs=CurrentUser` | Local development | AzureServiceTokenProvider uses Azure AD Integrated Authentication to get token. |
| `RunAs=App` | [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/index.yml) | AzureServiceTokenProvider uses a managed identity to get token. |
| `RunAs=App;AppId={ClientId of user-assigned identity}` | [User-assigned identity for Azure resources](../active-directory/managed-identities-azure-resources/overview.md#how-does-the-managed-identities-for-azure-resources-work) | AzureServiceTokenProvider uses a user-assigned identity to get token. |
| `RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier={KeyVaultCertificateSecretIdentifier}` | Custom services authentication | KeyVaultCertificateSecretIdentifier = the certificate's secret identifier. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};CertificateStoreLocation={LocalMachine or CurrentUser}`| Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateSubjectName={Subject};CertificateStoreLocation={LocalMachine or CurrentUser}` | Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD|
| `RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}` | Service principal |`AzureServiceTokenProvider` uses secret to get token from Azure AD. |

## Samples

To see the `Microsoft.Azure.Services.AppAuthentication` library in action, please refer to the following code samples.

1. [Use a managed identity to retrieve a secret from Azure Key Vault at runtime](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet)

2. [Programmatically deploy an Azure Resource Manager template from an Azure VM with a managed identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet).

3. [Use .NET Core sample and a managed identity to call Azure services from an Azure Linux VM](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/).

## Next steps

- Learn more about [managed identities for Azure resources](../active-directory/managed-identities-azure-resources/index.yml).
- Learn more about [Azure AD authentication scenarios](../active-directory/develop/active-directory-authentication-scenarios.md).
