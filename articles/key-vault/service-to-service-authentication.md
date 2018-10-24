---
title: Service-to-service authentication to Azure Key Vault using .NET
description: Use the Microsoft.Azure.Services.AppAuthentication library to authenticate to Azure Key Vault using .NET.
keywords: azure key-vault authentication local credentials
author: bryanla
manager: mbaldwin
services: key-vault

ms.author: bryanla
ms.date: 09/05/2018
ms.topic: conceptual
ms.prod:
ms.service: key-vault
ms.technology:
ms.assetid: 4be434c4-0c99-4800-b775-c9713c973ee9

---

# Service-to-service authentication to Azure Key Vault using .NET

To authenticate to Azure Key Vault, you need an Azure Active Directory (AD) credential, either a shared secret or a certificate. Managing such credentials can be difficult and it's tempting to bundle credentials into an app by including them in source or configuration files.

The `Microsoft.Azure.Services.AppAuthentication` for .NET library simplifies this problem. It uses the developer's credentials to authenticate during local development. When the solution is later deployed to Azure, the library automatically switches to application credentials.  

Using developer credentials during local development is more secure because you do not need to create Azure AD credentials or share credentials between developers.

The `Microsoft.Azure.Services.AppAuthentication` library manages authentication automatically, which in turn allows you to focus on your solution, rather than your credentials.

The `Microsoft.Azure.Services.AppAuthentication` library supports local development with Microsoft Visual Studio, Azure CLI, or Azure AD Integrated Authentication. When deployed to Azure App Services or an Azure Virtual Machine (VM), the library automatically uses [managed identities for Azure services](/azure/active-directory/msi-overview). No code or configuration changes are required. The library also supports direct use of Azure AD [client credentials](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authenticate-service-principal) when a managed identity is not available, or when the developer's security context cannot be determined during local development.

<a name="asal"></a>
## Using the library

For .NET applications, the simplest way to work with a managed identity is through the `Microsoft.Azure.Services.AppAuthentication` package. Here's how to get started:

1. Add a reference to the [Microsoft.Azure.Services.AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) NuGet package to your application.

2. Add the following code:

    ``` csharp
    using Microsoft.Azure.Services.AppAuthentication;
    using Microsoft.Azure.KeyVault;

    // ...

    var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(
    azureServiceTokenProvider.KeyVaultTokenCallback));

    // or

    var azureServiceTokenProvider = new AzureServiceTokenProvider();
    string accessToken = await azureServiceTokenProvider.GetAccessTokenAsync(
       "https://management.azure.com/").ConfigureAwait(false);
    ```

The `AzureServiceTokenProvider` class caches the token in memory and retrieves it from Azure AD just before expiration. Consequently, you no longer have to check the expiration before calling the `GetAccessTokenAsync` method. Just call the method when you want to use the token. 

The `GetAccessTokenAsync` method requires a resource identifier. To learn more, see [which Azure services support managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/msi-overview#which-azure-services-support-managed-service-identity).


<a name="samples"></a>
## Samples

The following samples show the `Microsoft.Azure.Services.AppAuthentication` library in action:

1. [Use a managed identity to retrieve a secret from Azure Key Vault at runtime](https://github.com/Azure-Samples/app-service-msi-keyvault-dotnet)

2. [Programmatically deploy an Azure Resource Manager template from an Azure VM with a managed identity](https://github.com/Azure-Samples/windowsvm-msi-arm-dotnet).

3. [Use .NET Core sample and a managed identity to call Azure services from an Azure Linux VM](https://github.com/Azure-Samples/linuxvm-msi-keyvault-arm-dotnet/).


<a name="local"></a>
## Local development authentication

For local development, there are two primary authentication scenarios:

- [Authenticating to Azure services](#authenticating-to-azure-services)
- [Authenticating to custom services](#authenticating-to-custom-services)

Here, you learn the requirements for each scenario and supported tools.


### Authenticating to Azure Services

Local machines do not support managed identities for Azure resources.  As a result, the `Microsoft.Azure.Services.AppAuthentication` library uses your developer credentials to run in your local development environment. When the solution is deployed to Azure, the library uses a managed identity to switch to an OAuth 2.0 client credential grant flow.  This means you can test the same code locally and remotely without worry.

For local development, `AzureServiceTokenProvider` fetches tokens using **Visual Studio**, **Azure command-line interface** (CLI), or **Azure AD Integrated Authentication**. Each option is tried sequentially and the library uses the first option that succeeds. If no option works, an `AzureServiceTokenProviderException` exception is thrown with detailed information.

### Authenticating with Visual Studio

To use Visual Studio, verify:

1. You've installed [Visual Studio 2017 v15.5](https://blogs.msdn.microsoft.com/visualstudio/2017/10/11/visual-studio-2017-version-15-5-preview/) or later.

2. The [App Authentication extension for Visual Studio](https://go.microsoft.com/fwlink/?linkid=862354) is installed.
 
3. You signed in to Visual Studio and have selected an account to use for local development. Use **Tools**&nbsp;>&nbsp;**Options**&nbsp;>&nbsp;**Azure Service Authentication** to choose a local development account. 

If you run into problems using Visual Studio, such as errors regarding the token provider file, carefully review these steps. 

It may also be necessary to reauthenticate your developer token.  To do so, go to **Tools**&nbsp;>&nbsp;**Options**>**Azure&nbsp;Service&nbsp;Authentication** and look for a **Re-authenticate** link under the selected account.  Select it to authenticate. 

### Authenticating with Azure CLI

To use Azure CLI for local development:

1. Install [Azure CLI v2.0.12](/cli/azure/install-azure-cli) or later. Upgrade earlier versions. 

2. Use **az login** to sign in to Azure.

Use `az account get-access-token` to verify access.  If you receive an error, verify that Step 1 completed successfully. 

If Azure CLI is not installed to the default directory, you may receive an error reporting that `AzureServiceTokenProvider` cannot find the path for Azure CLI.  Use the **AzureCLIPath**environment variable to define the Azure CLI installation folder. `AzureServiceTokenProvider` adds the directory specified in the **AzureCLIPath** environment variable to the **Path** environment variable when necessary.

If you are signed in to Azure CLI using multiple accounts or your account has access to multiple subscriptions, you need to specify the specific subscription to be used.  To do so, use:

```
az account set --subscription <subscription-id>
```

This command generates output only on failure.  To verify the current account settings, use:

```
az account list
```

### Authenticating with Azure AD Integrate authentication

To use Azure AD authentication, verify that:

- Your on-premises active directory [syncs to Azure AD](/azure/active-directory/connect/active-directory-aadconnect).

- Your code is running on a domain-joined machine.


### Authenticating to custom services

When a service calls Azure services, the previous steps work because Azure services allow access to both users and applications.  

When creating a service that calls a custom service, use Azure AD client credentials for local development authentication.  There are two options: 

1.  Use a service principal to sign into Azure:

    1.  [Create a service principal](/cli/azure/create-an-azure-service-principal-azure-cli).

    2.  Use Azure CLI to sign in:

        ```
        az login --service-principal -u <principal-id> --password <password>
           --tenant <tenant-id> --allow-no-subscriptions
        ```

        Because the service principal may not have access to a subscription, use the `--allow-no-subscriptions` argument.

2.  Use environment variables to specify service principal details.  For details, see [Running the application using a service principal](#running-the-application-using-a-service-principal).

Once you've signed in to Azure, `AzureServiceTokenProvider` uses the service principal to retrieve a token for local development.

This applies only to local development. When your solution is deployed to Azure, the library switches to a managed identity for authentication.

<a name="msi"></a>
## Running the application using managed identity 

When you run your code on an Azure App Service or an Azure VM with a managed identity enabled, the library automatically uses the managed identity. No code changes are required. 


<a name="sp"></a>
## Running the application using a Service Principal 

It may be necessary to create an Azure AD Client credential to authenticate. Common examples include:

1. Your code runs on a local development environment, but not under the developer's identity.  Service Fabric, for example, uses the [NetworkService account](/azure/service-fabric/service-fabric-application-secret-management) for local development.
 
2. Your code runs on a local development environment and you authenticate to a custom service, so you can't use your developer identity. 
 
3. Your code is running on an Azure compute resource that does not yet support managed identities for Azure resources, such as Azure Batch.

To use a certificate to sign into Azure AD:

1. Create a [service principal certificate](/azure/azure-resource-manager/resource-group-authenticate-service-principal). 

2. Deploy the certificate to either the _LocalMachine_ or _CurrentUser_ store. 

3. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint={Thumbprint};
          CertificateStoreLocation={LocalMachine or CurrentUser}
    ```
 
    Replace _{AppId}_, _{TenantId}_, and _{Thumbprint}_ with values generated in Step 1.

    **CertificateStoreLocation** must be either _CurrentUser_ or _LocalMachine_, based on your deployment plan.

4. Run the application. 

To sign in using an Azure AD shared secret credential:

1. Create a [service principal with a password](/azure/azure-resource-manager/resource-group-authenticate-service-principal) and grant it access to the Key Vault. 

2. Set an environment variable named **AzureServicesAuthConnectionString** to:

    ```
    RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret} 
    ```

    Replace _{AppId}_, _{TenantId}_, and _{ClientSecret}_ with values generated in Step 1.

3. Run the application. 

Once everything's set up correctly, no further code changes are necessary.  `AzureServiceTokenProvider` uses the environment variable and the certificate to authenticate to Azure AD. 

<a name="connectionstrings"></a>
## Connection String Support

By default, `AzureServiceTokenProvider` uses multiple methods to retrieve a token. 

To control the process, use a connection string passed to the `AzureServiceTokenProvider` constructor or specified in the *AzureServicesAuthConnectionString* environment variable. 

The following options are supported:

| Connection&nbsp;string&nbsp;option | Scenario | Comments|
|:--------------------------------|:------------------------|:----------------------------|
| `RunAs=Developer; DeveloperTool=AzureCli`	| Local development | AzureServiceTokenProvider uses AzureCli to get token. |
| `RunAs=Developer; DeveloperTool=VisualStudio`	| Local development | AzureServiceTokenProvider uses Visual Studio to get token. |
| `RunAs=CurrentUser;` | Local development | AzureServiceTokenProvider uses Azure AD Integrated Authentication to get token. |
| `RunAs=App;` | managed identities for Azure resources | AzureServiceTokenProvider uses a managed identity to get token. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};CertificateThumbprint`<br>`   ={Thumbprint};CertificateStoreLocation={LocalMachine or CurrentUser}`	| Service principal	| `AzureServiceTokenProvider` uses certificate to get token from Azure AD. |
| `RunAs=App;AppId={AppId};TenantId={TenantId};`<br>`   CertificateSubjectName={Subject};CertificateStoreLocation=`<br>`   {LocalMachine or CurrentUser}` | Service principal | `AzureServiceTokenProvider` uses certificate to get token from Azure AD|
| `RunAs=App;AppId={AppId};TenantId={TenantId};AppKey={ClientSecret}` | Service principal |`AzureServiceTokenProvider` uses secret to get token from Azure AD. |


## Next steps

- Learn more about [managed identities for Azure resources](/azure/app-service/app-service-managed-service-identity).

- Learn different ways to [authenticate and authorize apps](/azure/app-service/app-service-authentication-overview).

- Learn more about Azure AD [authentication scenarios](/azure/active-directory/develop/active-directory-authentication-scenarios#web-browser-to-web-application).
