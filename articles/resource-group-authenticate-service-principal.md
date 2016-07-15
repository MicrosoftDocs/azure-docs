<properties
   pageTitle="Create Azure service principal with PowerShell | Microsoft Azure"
   description="Describes how to use Azure PowerShell to create an Active Directory application and service principal, and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate."
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
   ms.date="07/15/2016"
   ms.author="tomfitz"/>

# Use Azure PowerShell to create a service principal to access resources

> [AZURE.SELECTOR]
- [PowerShell](resource-group-authenticate-service-principal.md)
- [Azure CLI](resource-group-authenticate-service-principal-cli.md)
- [Portal](resource-group-create-service-principal-portal.md)

When you have an application or script that needs to access resources, you most likely do not want to run this process under a user's credentials. That user may have different permissions that you would like to assign to the process, and the user's job responsibilities could change. Instead, you can create an identity for the application that includes authentication credentials and role assignments. Your application logs in as this identity every time it runs. This topic shows you how to use [Azure PowerShell](powershell-install-configure.md) to set up everything you need for an application to run under its own credentials and identity.

In this article, you will create two objects - the Active Directory (AD) application and the service principal. The AD application contains the credentials (an application id and either a password or certificate). The service principal contains the role assignment. From the AD application, you can create many service principals. This topic focuses on a single-tenant application where the application is intended to run within only one organization. You typically use single-tenant applications for line-of-business applications that run within your organization. You can also create multi-tenant applications when your application needs to run in many organizations. You typically use multi-tenant applications for software-as-a-service (SaaS) applications. To set up a multi-tenant application, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).

There are many concepts to understand when working with Active Directory. For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

With PowerShell, you have 2 options for authenticating your AD application:

 - password
 - certificate

If, after setting up your AD application, you intend to log in to Azure from another programming framework (such Python, Ruby, or Node.js), password authentication might be your only option. Before deciding whether to use a password or certificate, see the [Sample applications](#sample-applications) section for examples of authenticating in the different frameworks.

## Create AD application with password

In this section, you will perform the steps to create the AD application with a password.

1. Sign in to your account.

        Add-AzureRmAccount

1. Create a new Active Directory application by providing a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -Password "<Your_Password>"

     Examine the new application object. 

        $azureAdApplication
        
     Note in particular the **ApplicationId** property which is needed for creating service principals, role assignments and acquiring the access token.

        DisplayName             : exampleapp
        Type                    : Application
        ApplicationId           : 8bc80782-a916-47c8-a47e-4d76ed755275
        ApplicationObjectId     : c95e67a3-403c-40ac-9377-115fa48f8f39
        AvailableToOtherTenants : False
        AppPermissions          : {}
        IdentifierUris          : {https://www.contoso.org/example}
        ReplyUrls               : {}


### Create service principal and assign to role

From your AD application, you must create a service principal and assign a role to it.

1. Create a service principal for your application by passing in the application id of the Active Directory application.

        New-AzureRmADServicePrincipal -ApplicationId $azureAdApplication.ApplicationId

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

That's it! Your AD application and service principal are set up. The next section shows you how to log in with the credential through PowerShell; however, if you want to use the credential in your code application, you do not need to continue with this topic. You can jump to the [Sample applications](#sample-applications) for examples of logging in with your application id and password. 

### Provide credentials through PowerShell

Now, you need to login as the application to perform operations.

1. Create a new **PSCredential** object which contains your credentials by running the **Get-Credential** command. You will need the **ApplicationId** or **IdentifierUris** prior to running this command so make sure you have that available to paste.

        $creds = Get-Credential

2. You will be prompted you to enter your credentials. For the user name, use the **ApplicationId** or **IdentifierUris** that you used when creating the application. For the password, use the one you specified when creating the account.

     ![enter credentials](./media/resource-group-authenticate-service-principal/arm-get-credential.png)

3. Retrieve the subscription in which the role assignment was created. This subscription will be used to get the **TenantId** of the tenant that the service principal's role assignment resides in.

        $subscription = Get-AzureRmSubscription

     If your account is linked to more than one subscription, provide a subscription name or id to get the subscription you wish to work with.
     
        $subscription = Get-AzureRmSubscription -SubscriptionName "Azure MSDN - Visual Studio Ultimate"

4. Login as the service principal by specifying that this account is a service principal and by providing the credentials object.

        Add-AzureRmAccount -Credential $creds -ServicePrincipal -TenantId $subscription.TenantId
        
     You are now authenticated as the service principal for the Active Directory application that you created.

5. To use the current access token in a later session, you can save the profile.

        Save-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
     You can open the profile and examine its contents. Notice that it contains an access token. 
        
6. Instead of manually logging in again the next time you wish to execute code as the service principal, simply load the profile.

        Select-AzureRmProfile -Path c:\Users\exampleuser\profile\exampleSP.json
        
> [AZURE.NOTE] The access token will expire, so using a saved profile only works for as long as the token is valid.
        
## Create AD application with certificate

In this section, you will perform the steps to create an AD application with a certificate. 

1. Create a self-signed certificate. If you are have **Windows 10 or Windows Server 2016 Technical Preview**, run the following command: 

        $cert = New-SelfSignedCertificate -CertStoreLocation "cert:\CurrentUser\My" -Subject "CN=exampleapp" -KeySpec KeyExchange
       
     You variable contains information about the certificate, including the thumbprint.
     
        Directory: Microsoft.PowerShell.Security\Certificate::CurrentUser\My

        Thumbprint                                Subject
        ----------                                -------
        724213129BD2B950BB3F64FAB0C877E9348B16E9  CN=exampleapp

     If you **do not** have Windows 10 or Windows Server 2016 Technical Preview, you will not have the **New-SelfSignedCertificate** cmdlet. Instead, download the [Self-signed certificate generator](https://gallery.technet.microsoft.com/scriptcenter/Self-signed-certificate-5920a7c6) PowerShell script, and run the following commands to generate a certificate. This step is not necessary if you already created the certificate in the previous example.
     
        # Only run if you could not use New-SelfSignedCertificate
        Import-Module -Name c:\New-SelfSignedCertificateEx.ps1
        New-SelfSignedCertificateEx -Subject "CN=exampleapp" -KeySpec "Exchange" -FriendlyName "exampleapp"
        $cert = Get-ChildItem -Path cert:\CurrentUser\My\* -DnsName exampleapp

2. Retrieve the key value from the certificate.

        $keyValue = [System.Convert]::ToBase64String($cert.GetRawCertData())

3. Sign in to your Azure account.

        Add-AzureRmAccount

4. Create an application in the directory.

        $azureAdApplication = New-AzureRmADApplication -DisplayName "exampleapp" -HomePage "https://www.contoso.org" -IdentifierUris "https://www.contoso.org/example" -KeyValue $keyValue -KeyType AsymmetricX509Cert -EndDate $cert.NotAfter -StartDate $cert.NotBefore      
        
    Examine the new application object. 

        $azureAdApplication

    Notice the **ApplicationId** property which is needed for creating service principals, role assignments and acquiring access tokens.

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

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For the **ServicePrincipalName** parameter, provide either the **ApplicationId** or the **IdentifierUris** that you used when creating the application. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        New-AzureRmRoleAssignment -RoleDefinitionName Reader -ServicePrincipalName $azureAdApplication.ApplicationId.Guid

That's it! Your AD application and service principal are set up. The next section shows you how to log in with certificate through PowerShell.

### Prepare values for your script

In your script you will pass in three values that are needed to log in as the service principal. You will need:

- application id
- tenant id 
- certificate thumbprint

You can store these as environment variables and retrieve them during execution, or you can include them in your script.

1. To retrieve the tenant id, use:

        (Get-AzureRmSubscription).TenantId 

    Or, if you have more than one subscription, provide the name of the subscription:

        (Get-AzureRmSubscription -SubscriptionName "Azure MSDN - Visual Studio Ultimate").TenantId
        
2. You already have the application id from the previous steps ($azureAdApplication.ApplicationId), but if you need to retrieve it again, use:

        (Get-AzureRmADApplication -IdentifierUri "https://www.contoso.org/example").ApplicationId
        
3. You already have the certificate thumbprint from the previous steps ($cert.Thumbprint), but if you need to retrieve it again, use:

        (Get-ChildItem -Path cert:\CurrentUser\My\* -DnsName exampleapp).Thumbprint

### Provide certificate through automated PowerShell script

You have created an Active Directory application and a service principal for that application. You have assigned the service principal to a role. Now, you need to login as the service principal to perform operations as the service principal.

To authenticate in your script, specify the account is a service principal and provide the certificate thumbprint, the application id, and tenant id.

    Add-AzureRmAccount -ServicePrincipal -CertificateThumbprint {thumbprint} -ApplicationId {applicationId} -TenantId {tenantid}

You are now authenticated as the service principal for the Active Directory application that you created.

## Sample applications

The following sample applications show how to log in as the service principal.

**.NET**

- [Deploy an SSH Enabled VM with a Template with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
- [Manage Azure resources and resource groups with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)

**Java**

- [Getting Started with Resources - Deploy Using ARM Template - in Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
- [Getting Started with Resources - Manage Resource Group - in Java](https://azure.microsoft.com/documentation/samples/resources-java-manage-resource-group//)

**Python**

- [Deploy an SSH Enabled VM with a Template in Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-template-deployment/)
- [Managing Azure Resource and Resource Groups with Python](https://azure.microsoft.com/documentation/samples/resource-manager-python-resources-and-groups/)

**Node.js**

- [Deploy an SSH Enabled VM with a Template in Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-template-deployment/)
- [Manage Azure resources and resource groups with Node.js](https://azure.microsoft.com/documentation/samples/resource-manager-node-resources-and-groups/)

**Ruby**

- [Deploy an SSH Enabled VM with a Template in Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-template-deployment/)
- [Managing Azure Resource and Resource Groups with Ruby](https://azure.microsoft.com/documentation/samples/resource-manager-ruby-resources-and-groups/)

## Next Steps
  
- For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).


