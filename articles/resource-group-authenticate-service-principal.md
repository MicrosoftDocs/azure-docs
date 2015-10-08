<properties
   pageTitle="Authenticating a Service Principal with Azure Resource Manager"
   description="Describes how to grant access to a Service Principal through role-based access control and authenticate it. Shows how to perform these tasks with PowerShell and Azure CLI."
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
   ms.date="08/25/2015"
   ms.author="tomfitz"/>

# Authenticating a service principal with Azure Resource Manager

This topic shows you how to permit a service principal (such as an automated process, application, or service) to access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to a service principal, and authenticate that service principal. This topic shows you how to use PowerShell and Azure CLI to assign a role to service prinicpal and authenticate the serivce principal.

It shows how to authenticate with either a user name and password or a certificate.

You can use either Azure PowerShell or Azure CLI for Mac, Linux and Windows. If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](./powershell-install-configure.md). If you do not have Azure CLI installed, see [Install and Configure the Azure CLI](xplat-cli-install.md).

## Concepts
1. Azure Active Directory (AAD) - an identity and access management service for the cloud. For more information, see [What is Azure active Directory](active-directory/active-directory-whatis.md)
2. Service Principal - An instance of an application in a directory that needs to access other resources.
3. AD Application - Directory record that identifies an application to AAD. For more information, see [Basics of Authentication in Azure AD](https://msdn.microsoft.com/library/azure/874839d9-6de6-43aa-9a5c-613b0c93247e#BKMK_Auth).

## Authenticate service principal with password - PowerShell

In this section, you will perform the steps to create a service principal for an Azure Active Directory application, assign a role to the service principal, and authenticate as the service principal by providing the application identifier and password.

1. Switch to Azure Resource Manager mode and sign in to your account.

        PS C:\> Switch-AzureMode AzureResourceManager
        PS C:\> Add-AzureAccount

1. Create a new AAD Application by running the **New-AzureADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        PS C:\> $azureAdApplication = New-AzureADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -Password "<Your_Password>"

     Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring JWT tokens.

        PS C:\> $azureAdApplication

        Type                    : Application
        ApplicationId           : a41acfda-d588-47c9-8166-d659a335a865
        ApplicationObjectId     : a26aaa48-bd52-4a7f-b29f-1bebf74c91e3
        AvailableToOtherTenants : False
        AppPermissions          : {{
                            "claimValue": "user_impersonation",
                            "description": "Allow the application to access <Your Application Display Name> on behalf of the signed-in user.",
                            "directAccessGrantTypes": [],
                            "displayName": "Access <Your Application Display Name>",
                            "impersonationAccessGrantTypes": [
                              {
                                "impersonated": "User",
                                "impersonator": "Application"
                              }
                            ],
                            "isDisabled": false,
                            "origin": "Application",
                            "permissionId": "b866ef28-9abb-4698-8c8f-eb4328533831",
                            "resourceScopeType": "Personal",
                            "userConsentDescription": "Allow the application to access <Your Application Display Name> on your behalf.",
                            "userConsentDisplayName": "Access <Your Application Display Name>",
                            "lang": null
                          }}


2. Create a service principal for your application.

        PS C:\> New-AzureADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

3. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provie either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Managing and Auditing Access to Resources](azure-portal/resource-group-rbac.md)

        PS C:\> New-AzureRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

4. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        PS C:\> $subscription = Get-AzureSubscription | where { $_.IsCurrent }

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrive a different subscription.

5. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        PS C:\> $creds = Get-Credential

     You will be prompted you to enter your credentials.

     ![][1]

     For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

6. Use the credentials that you entered as an input to the **Add-AzureAccount** cmdlet, which will sign the service principal in:

        PS C:\> Add-AzureAccount -Credential $creds -ServicePrincipal -Tenant $subscription.TenantId

     You should now be authenticated as the service principal for the AAD application that you created.

7. To authenticate from an application, include the following .NET code. After retrieving the token, you can access resources in the subscription.

        public static string GetAToken()
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

1. Switch to Azure Resource Manager mode and sign in to your account.

        PS C:\> Switch-AzureMode AzureResourceManager
        PS C:\> Add-AzureAccount

1. For both approaches, create an X509Certificate object from your certificate and retrieve the key value. Use the path to your certificate and the password for that certificate.

        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate("C:\certificates\examplecert.pfx", "yourpassword")
        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

2. If you are using key credentials, create the key credentials object and sets its value to the `$keyValue` from the previous step.

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

        $azureAdApplication = New-AzureADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -KeyValue $keyValue -KeyType AsymmetricX509Cert       
        
    Or, use the second example to assign key credentials.

         $azureAdApplication = New-AzureADApplication -DisplayName "<Your Application Display Name>" -HomePage "<https://YourApplicationHomePage>" -IdentifierUris "<https://YouApplicationUri>" -KeyCredentials $keyCredential

    Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring JWT tokens.

        PS C:\> $azureAdApplication

        Type                    : Application
        ApplicationId           : 76fa8d97-f07e-4b9a-b871-a57a7acd777a
        ApplicationObjectId     : c36b7b57-a949-4401-b381-18a5210aff10
        AvailableToOtherTenants : False
        AppPermissions          : {{
                            "claimValue": "user_impersonation",
                            "description": "Allow the application to access <Your Application Display Name> on behalf of the signed-in
                          user.",
                            "directAccessGrantTypes": [],
                            "displayName": "Access <Your Application Display Name>",
                            "impersonationAccessGrantTypes": [
                              {
                                "impersonated": "User",
                                "impersonator": "Application"
                              }
                            ],
                            "isDisabled": false,
                            "origin": "Application",
                            "permissionId": "9f13c6c6-35ba-43d6-b8b3-6a87aa641388",
                            "resourceScopeType": "Personal",
                            "userConsentDescription": "Allow the application to access <Your Application Display Name> on your behalf.",
                            "userConsentDisplayName": "Access <Your Application Display Name>",
                            "lang": null
                          }}

4. Create a service principal for your application.

        PS C:\> New-AzureADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

5. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provie either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Managing and Auditing Access to Resources](azure-portal/resource-group-rbac.md)

        PS C:\> New-AzureRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId

6. To authenticate from an application, include the following .NET code. After retrieving the client, you can access resources in the subscription.

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
        
    The Azure AD application is returned. The ApplicationId property is needed for creating service principals, role assignments and acquiring JWT tokens. 

        info:    Executing command ad app create
        + Creating application exampleapp                                                
        data:    Application Id:          b57dd71d-036c-4840-865e-23b71d8098ec
        data:    Application Object Id:   d5c519e2-6149-447e-b323-88d2c4ea27de
        data:    Application Permissions:  
        data:                             claimValue:  user_impersonation
        data:                             description:  Allow the application to access exampleapp on behalf of the signed-in user.
        ...
        info:    ad app create command OK

3. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create b57dd71d-036c-4840-865e-23b71d8098ec
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        + Creating service principal for application b57dd71d-036c-4840-865e-23b71d8098ec
        data:    Object Id:               47193a0a-63e4-46bd-9bee-6a9f6f9c03cb
        data:    Display Name:            exampleapp
        ...
        info:    ad sp create command OK

    You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

4. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provie either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Managing and Auditing Access to Resources](azure-portal/resource-group-rbac.md)

        azure role assignment create --objectId 47193a0a-63e4-46bd-9bee-6a9f6f9c03cb -o Reader -c /subscriptions/{subscriptionId}/

5. Determine the **TenantId** of the tenant that the service principal's role assignment resides by listing the accounts and looking for the **TenantId** property in the output.

        azure account list

6. Sign-in using the service principal as your identity. For the user name, use the **ApplicationId** that you used when creating the application. For the password, use the one you specified when creating the account.

        azure login -u "<ApplicationId>" -p "<password>" --service-principal --tenant "<TenantId>"

    You should now be authenticated as the service principal for the AAD application that you created.

## Next Steps
  
- For an overivew of role-based access control, see [Managing and Auditing Access to Resources](azure-portal/resource-group-rbac.md)  
- To learn about using the portal with service principals, see [Create a new Azure Service Principal using the Azure portal](./resource-group-create-service-principal-portal.md)  
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)


<!-- Images. -->
[1]: ./media/resource-group-authenticate-service-principal/arm-get-credential.png
