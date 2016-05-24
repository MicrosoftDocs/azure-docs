<properties
   pageTitle="Create AD application with PowerShell | Microsoft Azure"
   description="Describes how to create an Active Directory application and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="multiple"
   ms.workload="na"
   ms.date="05/24/2016"
   ms.author="tomfitz"/>

# Creating and authenticating an Active Directory application with Azure Resource Manager

This topic shows you how to use Azure PowerShell to create an Active Directory (AD) application, such as an automated process, application, or service, that can access other resources in your subscription. With Azure Resource Manager, you can use role-based access control to grant permitted actions to the application.

If you do not have Azure PowerShell installed, see [How to install and configure Azure PowerShell](powershell-install-configure.md). 

In this article, you will create two objects - the AD application and the service principal. The AD application resides in the tenant where the app is registered, and defines the process to run. From the AD application, you can create many service principals. The service principal contains the identity of the AD application and is used for assigning permissions. For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

You have 2 options for authenticating your application:

 - password - suitable when a user wants to interactively log in during execution
 - certificate - suitable for unattended scripts that must authenticate without user interaction

## Create AD application with password

In this section, you will perform the steps to create the AD application with a password.

1. Sign in to your account.

        Add-AzureRmAccount

1. Create a new Active Directory application by running the **New-AzureRmADApplication** command. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -Password "<Your_Password>"

     Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring the access token.

        PS C:\> $azureAdApplication

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 8bc80782-a916-47c8-a47e-4d76ed755275
        ApplicationObjectId     : c95e67a3-403c-40ac-9377-115fa48f8f39
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}


### Create service principal and assign to role

Your AD application is ready. Now, you must create the service principal for that application and assign it to a role.

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

### Manually provide credentials through PowerShell

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the application to perform operations. You can manually provide the credentials for the application when executing on-demand script or commands.

1. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command.

        $creds = Get-Credential

2. You will be prompted you to enter your credentials. For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

     ![enter credentials](./media/resource-group-authenticate-service-principal/arm-get-credential.png)

3. Retrieve the subscription in which the role assignment was created. This subscription will be used to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

     If you created the role assignment in a subscription other than the currently selected subscription, you can specify the **SubscriptoinId** or **SubscriptionName** parameters to retrieve a different subscription.

4. Login as the service principal by using **Login-AzureRmAccount** cmdlet, but provide the credentials object and specify that this account is a service principal.

        Add-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription.TenantId
        
     If your account is linked to more than one subscription, you need to pass just the subscription you wish to use, such as:
     
        Add-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription[0].TenantId
        
     You are now authenticated as the service principal for the Active Directory application that you created.

5. To use the current access token in a later session, you can save the profile.

        Save-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
     You can open the profile and examine its contents. Notice that it contains an access token. 
        
6. Instead of logging in again the next time you wish to execute code as the service principal, simply load the profile.

        Select-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
> [AZURE.NOTE] The access token will expire, so using a saved profile only works for as long as the token is valid. To permanently run unattended scripts, use a certificate.
        
## Create AD application with certificate

In this section, you will perform the steps to create an AD application with a certificate. 

1. Sign in to your account.

        Add-AzureRmAccount

2. Create a self-signed certificate.

       New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "exampleapp"
       
     You will receive information about the certificate, including the thumbprint.
     
       Directory: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

       Thumbprint                                Subject
       ----------                                -------
       724213129BD2B950BB3F64FAB0C877E9348B16E9  CN=exampleapp

1. Create an object from your certificate and retrieve the key value. Use the path to your certificate and the password for that certificate.

        $cert = (Get-ChildItem -Path cert:\CurrentUser\My\724213129BD2B950BB3F64FAB0C877E9348B16E9)
        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

3. Create an application in the directory.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -KeyValue $keyValue -KeyType AsymmetricX509Cert -EndDate $cert.NotAfter -StartDate $cert.NotBefore      
        
    Examine the new application object. The **ApplicationId** property is needed for creating service principals, role assignments and acquiring access tokens.

        $azureAdApplication

    Which returns output similar to:

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 1975a4fd-1528-4086-a992-787dbd23c46b
        ApplicationObjectId     : 9665e5f3-84b7-4344-92e2-8cc20ad16a8b
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}    


### Create service principal and assign to role

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

     You have now created a service principal in the directory, but the service does not have any permissions or scope assigned. You will need to explicitly grant the service principal permissions to perform operations at some scope.

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal. Three options are shown in this topic:

### Provide certificate through automated PowerShell script

1. Get your Active Directory application. You will need the application id when logging in

        $azureAdApplication = Get-AzureRmADApplication -IdentifierUri "https://www.contoso.org/example"
        
2. Retrieve the subscription in which the role assignment was created. This subscription will be used later to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

3. Get the certificate you will use for authentication.

        $cert = (Get-ChildItem -Path cert:\CurrentUser\My\724213129BD2B950BB3F64FAB0C877E9348B16E9)

4. To authenticate in PowerShell, provide the certificate thumbprint, the application id, and tenant id.

        Add-AzureRmAccount -CertificateThumbprint $cert.Thumbprint -ApplicationId $azureAdApplication.ApplicationId -ServicePrincipal -TenantId $subscription.TenantId

     If your account is linked to more than one subscription, you need to pass just the subscription you wish to use, such as:
     
        Add-AzureRmAccount -CertificateThumbprint $cert.Thumbprint -ApplicationId $azureAdApplication.ApplicationId -ServicePrincipal -TenantId $subscription[0].TenantId

You are now authenticated as the service principal for the Active Directory application that you created.



## Next Steps
  
- To learn about using the portal with service principals, see [Create a new Azure Service Principal using the Azure portal](resource-group-create-service-principal-portal.md)  
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md)

