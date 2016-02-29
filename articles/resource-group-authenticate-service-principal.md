<properties
   pageTitle="Authenticate a service principal with Azure Resource Manager | Microsoft Azure"
   description="Describes how to grant access to a service principal through role-based access control and authenticate it. Shows how to perform these tasks with PowerShell and Azure CLI."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="02/29/2016"
   ms.author="tomfitz"/>

# Authenticating a service principal with Azure Resource Manager

This topic shows you how to permit a service principal (such as an automated process, application, or service) to access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to a service principal, and authenticate that service principal. This topic shows you how to use PowerShell and Azure CLI to assign a role to service principal and authenticate the service principal.

It shows how to authenticate with either a user name and password or a certificate.

You can use either Azure PowerShell or Azure CLI for Mac, Linux and Windows. If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](./powershell-install-configure.md). If you do not have Azure CLI installed, see [Install and Configure the Azure CLI](xplat-cli-install.md). For information about using the portal to perform these steps, see [Create Active Directory application and service principal using portal](resource-group-create-service-principal-portal.md)

## Concepts
1. Azure Active Directory (AAD) - an identity and access management service for the cloud. For more information, see [What is Azure Active Directory](active-directory/active-directory-whatis.md)
2. Service Principal - An instance of an application in a directory that needs to access other resources.
3. AD Application - Directory record that identifies an application to AAD.

For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](active-directory/active-directory-authentication-scenarios.md).

## Authenticate service principal with password - PowerShell

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing the application identifier and password.

1. Sign in to your account.

        PS C:\> Login-AzureRmAccount

1. Create a new AAD Application by running the **New-AzureRmADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        PS C:\> $azureAdApplication = New-AzureRmADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -Password "<Your_Password>"

     Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring JWT tokens.

        PS C:\> $azureAdApplication

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 8bc80782-a916-47c8-a47e-4d76ed755275
        ApplicationObjectId     : c95e67a3-403c-40ac-9377-115fa48f8f39
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}

2. Create a service principal for your application.

        PS C:\> New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

3. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        PS C:\> New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

4. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrive a different subscription.

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Three options are shown in this topic:

- [Manually provide credentials through PowerShell](#Manually-provide-credentials-through-PowerShell)
- [Provide credentials through automated PowerShell script](#Provide-credentials-through-automated-PowerShell-script)
- [Provide credentials through code in an application](#Provide-credentials-through-code-in-an-application)

### Manually provide credentials through PowerShell

To manually login as the serivce principal through PowerShell, create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

    PS C:\> $creds = Get-Credential

You will be prompted you to enter your credentials.

![enter credentials][1]

For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

Use the credentials that you entered as an input to the **Login-AzureRmAccount** cmdlet, which will sign the service principal in:

    PS C:\> Login-AzureRmAccount -Credential $creds -ServicePrincipal -Tenant $subscription.TenantId
    Environment           : AzureCloud
    Account               : {guid}
    Tenant                : {guid}
    Subscription          : {guid}
    CurrentStorageAccount :

You are now authenticated as the service principal for the Active Directory application that you created.

### Provide credentials through automated PowerShell script

This section shows how to login as the service principal without having to manually enter the credentials.

> [AZURE.NOTE] Including a password in your PowerShell script is not secure. Instead, use a service like Key Vault to store the password, and retrieve it when executing the script.

These steps assume you have set up a Key Vault and a secret that stores the password. To deploy a Key Vault and secret through a template, see [Key Vault template format](). To learn about Key Vault, see 
[Get started with Azure Key Vault](./key-vault/key-vault-get-started.md). For example below, the secret is named **appPassword**.

    PS C:\> $secret = Get-AzureKeyVaultSecret -VaultName examplevault -Name appPassword
    PS C:\> $creds = New-Object System.Management.Automation.PSCredential ($azureAdApplication.ApplicationId, $secret.SecretValue)
    PS C:\> Login-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription.TenantId

You are now authenticated as the service principal for the Active Directory application that you created.

### Provide credentials through code in an application

To authenticate from an application, include the following .NET code. After retrieving the token, you can access resources in the subscription.

    public static string GetAccessToken()
    {
      var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenantId or tenant name}");  
      var credential = new ClientCredential(clientId: "{application id}", clientSecret: "{application password}");
      var result = authenticationContext.AcquireToken(resource: "https://management.core.windows.net/", clientCredential:credential);

      if (result == null) {
        throw new InvalidOperationException("Failed to obtain the JWT token");
      }

      string token = result.AccessToken;

      return token;
    }


## Authenticate service principal with certificate - PowerShell

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by 
providing a certificate. This topic assumes you have been issued a certificate.

It shows two ways to work with certificates - key credentials and key values. You can use either approach.

First, you must set up some values in PowerShell that you will use later when creating the application.

1. Sign in to your account.

        PS C:\> Login-AzureRmAccount

1. For both approaches, create an X509Certificate2 object from your certificate and retrieve the key value. Use the path to your certificate and the password for that certificate.

        $cert = New-Object -TypeName System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @("C:\certificates\examplecert.pfx", "yourpassword")
        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

2. If you are using key credentials, create the key credentials object and sets its value to the `$keyValue` from the previous step.

        Add-Type -Path 'C:\Program Files (x86)\Microsoft SDKs\Azure\PowerShell\ResourceManager\AzureResourceManager\AzureRM.Resources\Microsoft.Azure.Commands.Resources.dll'
        $currentDate = Get-Date
        $endDate = $currentDate.AddYears(1)
        $keyId = [guid]::NewGuid()
        $keyCredential = New-Object  Microsoft.Azure.Commands.Resources.Models.ActiveDirectory.PSADKeyCredential
        $keyCredential.StartDate = $currentDate
        $keyCredential.EndDate= $endDate
        $keyCredential.KeyId = $keyId
        $keyCredential.Type = "AsymmetricX509Cert"
        $keyCredential.Usage = "Verify"
        $keyCredential.Value = $keyValue

3. Create an application in the directory. The first command shows how to use key values.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -KeyValue $keyValue -KeyType AsymmetricX509Cert       
        
    Or, use the second example to assign key credentials.

         $azureAdApplication = New-AzureRmADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -KeyCredentials $keyCredential

    Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring JWT tokens.

        PS C:\> $azureAdApplication

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 1975a4fd-1528-4086-a992-787dbd23c46b
        ApplicationObjectId     : 9665e5f3-84b7-4344-92e2-8cc20ad16a8b
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}       

4. Create a service principal for your application.

        PS C:\> New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

5. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        PS C:\> New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

6. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrive a different subscription.

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Two options are shown in this topic:

- [Provide certificate through automated PowerShell script](#Provide-certificate-through-automated-PowerShell-script)
- [Provide certificate through code in an application](#Provide-certificate-through-code-in-an-application)

### Provide certificate through automated PowerShell script

To authenticate in PowerShell, provide the certificate thumbprint, the application id, and tenant id.

    PS C:\> Login-AzureRmAccount -CertificateThumbprint $cert.Thumbprint -ApplicationId $azureAdApplication.ApplicationId -ServicePrincipal -TenantId $subscription.TenantId

You are now authenticated as the service principal for the Active Directory application that you created.

### Provide certificate through code in an application

To authenticate from an application, include the following .NET code. After retrieving the client, you can access resources in the subscription.

    string clientId = "<Application ID for your AAD app>"; 
    var subscriptionId = "<Your Azure SubscriptionId>"; 
    string tenant = "<Tenant id or tenant name>"; 

    var authContext = new AuthenticationContext(string.Format("https://login.windows.net/{0}", tenant)); 

    X509Certificate2 cert = null; 
    X509Store store = new X509Store(StoreName.My, StoreLocation.CurrentUser); 
    string certName = "examplecert"; 
    try 
    { 
      store.Open(OpenFlags.ReadOnly); 
      var certCollection = store.Certificates; 
      var certs = certCollection.Find(X509FindType.FindBySubjectName, certName, false); 
      cert = certs[0]; 
    } 
    finally 
    { 
      store.Close(); 
    }        

    var certCred = new ClientAssertionCertificate(clientId, cert); 
    var token = authContext.AcquireToken("https://management.core.windows.net/", certCred); 
    var creds = new TokenCloudCredentials(subscriptionId, token.AccessToken); 
    var client = new ResourceManagementClient(creds); 
        

## Authenticate service principal with password - Azure CLI

You will start by creating a service principal. To do this we must use create an application in the directory. This section will walk through creating a new application in the directory.

1. Switch to Azure Resource Manager mode and sign in to your account.

        azure config mode arm
        azure login

2. Create a new AAD Application by running the **azure ad app create** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        azure ad app create --name "<Your Application Display Name>" --home-page "<https://YourApplicationHomePage>" --identifier-uris "<https://YouApplicationUri>" --password <Your_Password>
        
    The Active Directory application is returned. The AppId property is needed for creating service principals, role assignments and acquiring JWT tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

3. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create 4fd39843-c338-417d-b549-a545f584a745
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

4. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

5. Determine the **TenantId** of the tenant that the service principal's role assignment resides by listing the accounts and looking for the **TenantId** property in the output.

        azure account list --json

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Three options are shown in this topic:

- [Manually provide credentials through Azure CLI](#Manually-provide-credentials-through-Azure-CLI)
- [Provide credentials through automated Azure CLI script](#Provide-credentials-through-automated-Azure-CLI-script)
- [Provide credentials through code in an application](#Provide-credentials-through-code-in-an-application) - You use the same code to authenticate whether you created the service principal through PowerShell or Azure CLI.

### Manually provide credentials through Azure CLI

If you want to manually sign in as the service principal, you can use the **azure login** command. For the user name, use the **AppId** that you used when creating the service principal. 
Directly including the password in a script is not secure because the password is stored in the file. See the next section for better 
option when executing an automated script.

    azure login -u "<AppId>" --service-principal --tenant "<TenantId>"

You prompted to enter the password. For the password, use the one you specified when creating the account.

    info:    Executing command login
    Password: ********

You are now authenticated as the service principal for the Active Directory application that you created.

### Provide credentials through automated Azure CLI script

This section shows how to login as the service principal without having to manually enter the credentials. 

> [AZURE.NOTE] Including a password in your Azure CLI script is not secure. Instead, use a service like Key Vault to store the password, and retrieve it when executing the script.

These steps assume you have set up a Key Vault and a secret that stores the password. To deploy a 
Key Vault and secret through a template, see [Key Vault template format](). To learn about Key Vault, see 
[Get started with Azure Key Vault](./key-vault/key-vault-get-started.md).

For example below, the secret is named **appPassword**. You must remove the starting and ending double quotes that are returned from the json output before passing it as 
the password parameter.

    secret=$(azure keyvault secret show --vault-name examplevault --secret-name appPassword --json | jq '.value')
    parsedSecret=$(sed -e 's/^"//' -e 's/"$//' <<< $s)
    azure login -u "<AppId>" -p "$parsedsecret" --service-principal --tenant "<TenantId>"
    
You are now authenticated as the service principal for the Active Directory application that you created.

## Authenticate service principal with certificate - Azure CLI

In this section, you will perform the steps to create a service principal for an Azure Active Directory application that uses a certificate for authentication. 
This topic assumes you have been issued a certificate and you have [OpenSSL](http://www.openssl.org/) installed.

1. Create a **.pem** file with:

        openssl pkcs12 -in examplecert.pfx -out examplecert.pem -nodes

2. Open the **.pem** file and copy the certificate data. Look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**.

3. Create a new Active Directory Application by running the **azure ad app create** command, and provide the certificate data that you copied in the previous step as the key value.

        azure ad app create -n "<your application name>" --home-page "<https://YourApplicationHomePage>" -i "<https://YouApplicationUri>" --key-value <certificate data>

    The Active Directory application is returned. The AppId property is needed for creating service principals, role assignments and acquiring JWT tokens. 

        data:    AppId:          4fd39843-c338-417d-b549-a545f584a745
        data:    ObjectId:       4f8ee977-216a-45c1-9fa3-d023089b2962
        data:    DisplayName:    exampleapp
        ...
        info:    ad app create command OK

4. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create 4fd39843-c338-417d-b549-a545f584a745
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK
        
5. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

6. Determine the **TenantId** of the tenant that the service principal's role assignment resides by listing the accounts and looking for the **TenantId** property in the output.

        azure account list --json

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the 
service principal. Two options are shown in this topic:

- [Provide certificate through automated Azure CLI script](#Provide-certificate-through-automated-Azure-CLI-script)
- [Provide certificate through code in an application](#Provide-certificate-through-code-in-an-application) - You use the same code to authenticate whether you created the service principal through PowerShell or Azure CLI.

### Provide certificate through automated Azure CLI script

You need to retrieve the certificate thumbprint and remove unneeded characters.

    openssl x509 -in examplecert.pem -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g'
    
Which returns a thumbpring value similar to:

    30996D9CE48A0B6E0CD49DBB9A48059BF9355851

To authenticate with Azure CLI, provide the certificate thumbprint, certificate file, the application id, and tenant id.

    azure login --service-principal --tenant <tenantId> -u <AppId> --certificate-file examplecert.pem --thumbprint 30996D9CE48A0B6E0CD49DBB9A48059BF9355851

You are now authenticated as the service principal for the Active Directory application that you created.


## Next Steps
  
- To get more information about using certificates and Azure CLI, see [Certificate-based auth with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx) 
- To learn about using the portal with service principals, see [Create a new Azure Service Principal using the Azure portal](./resource-group-create-service-principal-portal.md)  
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)


<!-- Images. -->
[1]: ./media/resource-group-authenticate-service-principal/arm-get-credential.png
