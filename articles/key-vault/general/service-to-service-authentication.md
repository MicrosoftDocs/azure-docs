---
title: Service-to-service authentication to Azure Key Vault using .NET
description: Use the Microsoft.Azure.Services.AppAuthentication library to authenticate to Azure Key Vault using .NET.
keywords: azure key-vault authentication local credentials
author: msmbaldwin
manager: rkarlin
services: key-vault

ms.author: mbaldwin
ms.date: 08/28/2019
ms.topic: conceptual
ms.service: key-vault
ms.subservice: general

---

# Service-to-service authentication to Azure Key Vault using .NET

To authenticate to Azure Key Vault, you need an Azure Active Directory (Azure AD) credential, either a shared secret or a certificate.

Managing such credentials can be difficult. It's tempting to bundle credentials into an app by including them in source or configuration files. The `Microsoft.Azure.Services.AppAuthentication` for .NET library simplifies this problem. It uses the developer's credentials to authenticate during local development. When the solution is later deployed to Azure, the library automatically switches to application credentials. Using developer credentials during local development is more secure because you don't need to create Azure AD credentials or share credentials between developers.

The `Microsoft.Azure.Services.AppAuthentication` library manages authentication automatically, which in turn lets you focus on your solution, rather than your credentials. It supports local development with Microsoft Visual Studio, Azure CLI, or Azure AD Integrated Authentication. When deployed to an Azure resource that supports a managed identity, the library automatically uses [managed identities for Azure resources](../../active-directory/msi-overview.md). No code or configuration changes are required. The library also supports direct use of Azure AD [client credentials](../../azure-resource-manager/resource-group-authenticate-service-principal.md) when a managed identity isn't available, or when the developer's security context can't be determined during local development.

## Prerequisites

- [Visual Studio 2019](https://www.visualstudio.com/downloads/) or [Visual Studio 2017 v15.5](https://blogs.msdn.microsoft.com/visualstudio/2017/10/11/visual-studio-2017-version-15-5-preview/).

- The App Authentication extension for Visual Studio, available as a separate extension for Visual Studio 2017 Update 5 and bundled with the product in Update 6 and later. With Update 6 or later, you can verify the installation of the App Authentication extension by selecting Azure Development tools from within the Visual Studio installer.

## Using the library

For .NET applications, the simplest way to work with a managed identity is through the `Microsoft.Azure.Services.AppAuthentication` package. Here's how to get started:

1. Select **Tools** > **NuGet Package Manager** > **Manage NuGet Packages for Solution** to add references to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) and [Microsoft.Azure.KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault) NuGet packages to your project.

1. Add the following code:

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

The `AzureServiceTokenProvider` class caches the token in memory and retrieves it from Azure AD just before expiration. So, you no longer have to check the expiration before calling the `GetAccessTokenAsync` method. Just call the method when you want to use the token.

The `GetAccessTokenAsync` method requires a resource identifier. To learn more about Microsoft Azure services, see [What is managed identities for Azure resources](../../active-directory/msi-overview.md).

## Local development authentication

For local development, there are two primary authentication scenarios: [authenticating to Azure services](#authenticating-to-azure-services), and [authenticating to custom services](#authenticating-to-custom-services).

### Authenticating to Azure Services

Local machines don't support managed identities for Azure resources. As a result, the `Microsoft.Azure.Services.AppAuthentication` library uses your developer credentials to run in your local development environment. When the solution is deployed to Azure, the library uses a managed identity to switch to an OAuth 2.0 client credential grant flow. This approach means you can test the same code locally and remotely without worry.

For local development, `AzureServiceTokenProvider` fetches tokens using **Visual Studio**, **Azure command-line interface** (CLI), or **Azure AD Integrated Authentication**. Each option is tried sequentially and the library uses the first option that succeeds. If no option works, an `AzureServiceTokenProviderException` exception is thrown with detailed information.

#### Authenticating with Visual Studio

To authenticate by using Visual Studio:

1. Sign in to Visual Studio and use **Tools**&nbsp;>&nbsp;**Options** to open **Options**.

1. Select **Azure Service Authentication**, choose an account for local development, and select **OK**.

If you run into problems using Visual Studio, such as errors that involve the token provider file, carefully review the preceding steps.

You may need to reauthenticate your developer token. To do so, select **Tools**&nbsp;>&nbsp;**Options**, and then select **Azure&nbsp;Service&nbsp;Authentication**. Look for a **Re-authenticate** link under the selected account. Select it to authenticate.

#### Authenticating with Azure CLI

To use Azure CLI for local development, be sure you have version [Azure CLI v2.0.12](/cli/azure/install-azure-cli) or later.

To use Azure CLI:

1. Search for Azure CLI in the Windows Taskbar to open the **Microsoft Azure Command Prompt**.

1. Sign in to the Azure portal: *az login* to sign in to Azure.

1. Verify access by entering *az account get-access-token --resource https:\//vault.azure.net*. If you receive an error, check that the right version of Azure CLI is correctly installed.

   If Azure CLI isn't installed to the default directory, you may receive an error reporting that `AzureServiceTokenProvider` can't find the path for Azure CLI. Use the **AzureCLIPath** environment variable to define the Azure CLI installation folder. `AzureServiceTokenProvider` adds the directory specified in the **AzureCLIPath** environment variable to the **Path** environment variable when necessary.

1. If you're signed in to Azure CLI using multiple accounts or your account has access to multiple subscriptions, you need to specify the subscription to use. Enter the command *az account set --subscription <subscription-id>*.

This command generates output only on failure. To verify the current account settings, enter the command `az account list`.

#### Authenticating with Azure AD authentication

To use Azure AD authentication, verify that:

- Your on-premises Active Directory syncs to Azure AD. For more information, see [What is hybrid identity with Azure Active Directory?](../../active-directory/connect/active-directory-aadconnect.md).

- Your code is running on a domain-joined computer.

### Authenticating to custom services

When a service calls Azure services, the previous steps work because Azure services allow access to both users and applications.

When creating a service that calls a custom service, use Azure AD client credentials for local development authentication. There are two options:

- Use a service principal to sign into Azure:

    1. Create a service principal. For more information, see [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

    1. Use Azure CLI to sign in with the following command:

        ```azurecli
        az login --service-principal -u <principal-id> --password <password> --tenant <tenant-id> --allow-no-subscriptions
        ```

        Because the service principal may not have access to a subscription, use the `--allow-no-subscriptions` argument.

- Use environment variables to specify service principal details. For more information, see [Running the application using a service principal](#running-the-application-using-a-service-principal).

After you've signed in to Azure, `AzureServiceTokenProvider` uses the service principal to retrieve a token for local development.

This approach applies only to local development. When your solution is deployed to Azure, the library switches to a managed identity for authentication.

## Running the application using managed identity or user-assigned identity

When you run your code on an Azure App Service or an Azure VM with a managed identity enabled, the library automatically uses the managed identity. No code changes are required, but the managed identity must have *get* permissions for the key vault. You can give the managed identity *get* permissions through the key vault's *Access Policies*.

Alternatively, you may authenticate with a user-assigned identity. For more information on user-assigned identities, see [About Managed Identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To authenticate with a user-assigned identity, you need to specify the Client ID of the user-assigned identity in the connection string. The connection string is specified in [Connection String Support](#connection-string-support).

## Running the application using a Service Principal

It may be necessary to create an Azure AD Client credential to authenticate. This situation may happen in the following examples:

- Your code runs on a local development environment, but not under the developer's identity. Service Fabric, for example, uses the [NetworkService account](../../service-fabric/service-fabric-application-secret-management.md) for local development.

- Your code runs on a local development environment and you authenticate to a custom service, so you can't use your developer identity.

- Your code is running on an Azure compute resource that doesn't yet support managed identities for Azure resources, such as Azure Batch.

There are three primary methods of using a Service Principal to run your application. To use any of them, you must first create a service principal. For more information, see [Create an Azure service principal with Azure CLI](/cli/azure/create-an-azure-service-principal-azure-cli).

### Use a certificate in local keystore to sign into Azure AD

1. Create a service principal certificate using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command.

    ```azurecli
    az ad sp create-for-rbac --create-cert
    ```

    This command creates a .pem file (private key) that's stored in your home directory. Deploy this certificate to either the *LocalMachine* or *CurrentUser* store.

    > [!Important]
    > The CLI command generates a .pem file, but Windows only provides native support for PFX certificates. To generate a PFX certificate instead, use the PowerShell commands shown here: [Create service principal with self-signed certificate](../../active-directory/develop/howto-authenticate-service-principal-powershell.md#create-service-principal-with-self-signed-certificate). These commands automatically deploy the certificate as well.

1. Set an environment variable named **AzureServicesAuthConnectionString** to the following value:

    ```azurecli
    RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};
          CertificateStoreLocation={CertificateStore}
    ```

    Replace *{AppId}*, *{TenantId}*, and *{Thumbprint}* with values generated in Step 1. Replace *{CertificateStore}* with either *LocalMachine*` or *CurrentUser*, based on your deployment plan.

1. Run the application.

### Use a shared secret credential to sign into Azure AD

1. Create a service principal certificate with a password using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command with the --sdk-auth parameter.

    ```azurecli
    az ad sp create-for-rbac --sdk-auth
    ```

1. Set an environment variable named **AzureServicesAuthConnectionString** to the following value:

    ```azurecli
    RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}
    ```

    Replace _{AppId}_, _{TenantId}_, and _{ClientSecret}_ with values generated in Step 1.

1. Run the application.

Once everything's set up correctly, no further code changes are necessary. `AzureServiceTokenProvider` uses the environment variable and the certificate to authenticate to Azure AD.

### Use a certificate in Key Vault to sign into Azure AD

This option lets you store a service principal's client certificate in Key Vault and use it for service principal authentication. You may use this option for the following scenarios:

- Local authentication, where you want to authenticate using an explicit service principal, and want to keep the service principal credential securely in a key vault. Developer account must have access to the key vault.

- Authentication from Azure where you want to use explicit credential and want to keep the service principal credential securely in a key vault. You might use this option for a cross-tenant scenario. Managed identity must have access to key vault.

The managed identity or your developer identity must have permission to retrieve the client certificate from the Key Vault. The AppAuthentication library uses the retrieved certificate as the service principal's client credential.

To use a client certificate for service principal authentication:

1. Create a service principal certificate and automatically store it in your Key Vault. Use the Azure CLI [az ad sp create-for-rbac --keyvault \<keyvaultname> --cert \<certificatename> --create-cert --skip-assignment](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

    ```azurecli
    az ad sp create-for-rbac --keyvault <keyvaultname> --cert <certificatename> --create-cert --skip-assignment
    ```

    The certificate identifier will be a URL in the format `https://<keyvaultname>.vault.azure.net/secrets/<certificatename>`

1. Replace `{KeyVaultCertificateSecretIdentifier}` in this connection string with the certificate identifier:

    ```azurecli
    RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier={KeyVaultCertificateSecretIdentifier}
    ```

    For instance, if your key vault was called *myKeyVault* and you created a certificate called *myCert*, the certificate identifier would be:

    ```azurecli
    RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier=https://myKeyVault.vault.azure.net/secrets/myCert
    ```

## Connection String Support

By default, `AzureServiceTokenProvider` uses multiple methods to retrieve a token.

To control the process, use a connection string passed to the `AzureServiceTokenProvider` constructor or specified in the *AzureServicesAuthConnectionString* environment variable.

The following options are supported:

| Connection string option | Scenario | Comments|
|:--------------------------------|:------------------------|:----------------------------|
| `RunAs=Developer; DeveloperTool=AzureCli` | Local development | `AzureServiceTokenProvider` uses AzureCli to get token. |
| `RunAs=Developer; DeveloperTool=VisualStudio` | Local development | `AzureServiceTokenProvider` uses Visual Studio to get token. |
| `RunAs=CurrentUser` | Local development | `AzureServiceTokenProvider` uses Azure AD Integrated Authentication to get token. |
| `RunAs=App` | [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/index.yml) | `AzureServiceTokenProvider` uses a managed identity to get token. |
| `RunAs=App;AppId={ClientId of user-assigned identity}` | [User-assigned identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) | `AzureServiceTokenProvider` uses a user-assigned identity to get token. |
| `RunAs=App;AppId={TestAppId};KeyVaultCertificateSecretIdentifier={KeyVaultCertificateSecretIdentifier}` | Custom services authentication | `KeyVaultCertificateSecretIdentifier` is the certificate's secret identifier. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};CertificateStoreLocation={LocalMachine or CurrentUser}`| Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateSubjectName={Subject};CertificateStoreLocation={LocalMachine or CurrentUser}` | Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD|
| `RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}` | Service principal |`AzureServiceTokenProvider` uses secret to get token from Azure AD. |

## Samples

To see the `Microsoft.Azure.Services.AppAuthentication` library in action, refer to the following code samples.

- [Use a managed identity to retrieve a secret from Azure Key Vault at runtime](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet)

- [Programmatically deploy an Azure Resource Manager template from an Azure VM with a managed identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet).

- [Use .NET Core sample and a managed identity to call Azure services from an Azure Linux VM](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/).

## AppAuthentication Troubleshooting

### Common issues during local development

#### Azure CLI is not installed, you're not logged in, or you don't have the latest version

Run *az account get-access-token* to see if Azure CLI shows a token for you. If it says **no such program found**, install the [latest version of the Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest). You may be prompted to sign in.

#### AzureServiceTokenProvider can't find the path for Azure CLI

AzureServiceTokenProvider looks for Azure CLI at its default install locations. If it can't find Azure CLI, set environment variable **AzureCLIPath** to the Azure CLI installation folder. AzureServiceTokenProvider will add the environment variable to the Path environment variable.

#### You're logged into Azure CLI using multiple accounts, the same account has access to subscriptions in multiple tenants, or you get an Access Denied error when trying to make calls during local development

Using Azure CLI, set the default subscription to one that has the account you want to use. The subscription must be in the same tenant as the resource you want to access: **az account set --subscription [subscription-id]**. If no output is seen, it succeeded. Verify the right account is now the default using **az account list**.

### Common issues across environments

#### Unauthorized access, access denied, forbidden, or similar error

The principal used doesn't have access to the resource it's trying to access. Grant either your user account or the App Service's MSI "Contributor" access to a resource. Which one depends on whether you're running the sample on your local computer or deployed in Azure to your App Service. Some resources, like key vaults, also have their own [access policies](https://docs.microsoft.com/azure/key-vault/general/secure-your-key-vault#data-plane-and-access-policies) that you use grant access to principals, such as users, apps, and groups.

### Common issues when deployed to Azure App Service

#### Managed identity isn't set up on the App Service

Check the environment variables MSI_ENDPOINT and MSI_SECRET exist using [Kudu debug console](https://azure.microsoft.com/resources/videos/super-secret-kudu-debug-console-for-azure-web-sites/). If these environment variables don't exist, Managed Identity isn't enabled on the App Service.

### Common issues when deployed locally with IIS

#### Can't retrieve tokens when debugging app in IIS

By default, AppAuth runs in a different user context in IIS. That's why it doesn't have access to use your developer identity to retrieve access tokens. You can configure IIS to run with your user context with the following two steps:
- Configure the Application Pool for the web app to run as your current user account. See more information [here](https://docs.microsoft.com/iis/manage/configuring-security/application-pool-identities#configuring-iis-application-pool-identities)
- Configure "setProfileEnvironment" to "True". See more information [here](https://docs.microsoft.com/iis/configuration/system.applicationhost/applicationpools/add/processmodel#configuration). 

    - Go to %windir%\System32\inetsrv\config\applicationHost.config
    - Search for "setProfileEnvironment". If it's set to "False", change it to "True". If it's not present, add it as an attribute to the processModel element (/configuration/system.applicationHost/applicationPools/applicationPoolDefaults/processModel/@setProfileEnvironment), and set it to "True".

- Learn more about [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/index.yml).
- Learn more about [Azure AD authentication scenarios](../../active-directory/develop/active-directory-authentication-scenarios.md).
