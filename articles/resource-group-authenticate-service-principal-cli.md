<properties
   pageTitle="Create service principal with Azure CLI | Microsoft Azure"
   description="Describes how to use Azure CLI to create an Active Directory application and service principal, and grant it access to resources through role-based access control. It shows how to authenticate application with a password or certificate."
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
   ms.date="09/07/2016"
   ms.author="tomfitz"/>

# Use Azure CLI to create a service principal to access resources

> [AZURE.SELECTOR]
- [PowerShell](resource-group-authenticate-service-principal.md)
- [Azure CLI](resource-group-authenticate-service-principal-cli.md)
- [Portal](resource-group-create-service-principal-portal.md)


When you have an application or script that needs to access resources, you most likely do not want to run this process under your own credentials. You may have different permissions that you want for the application, and you do not want the application to continue using your credentials if your responsibilities change. Instead, you create an identity for the application that includes authentication credentials and role assignments. Every time the app runs, it authenticates itself with these credentials. This topic shows you how to use [Azure CLI for Mac, Linux and Windows](xplat-cli-install.md) to set up an application to run under its own credentials and identity.

With Azure CLI, you have two options for authenticating your AD application:

 - password
 - certificate

This topic shows how to use both options in Azure CLI. If you intend to log in to Azure from a programming framework (such Python, Ruby, or Node.js), password authentication might be your best option. Before deciding whether to use a password or certificate, see the [Sample applications](#sample-applications) section for examples of authenticating in the different frameworks.

## Active Directory concepts

In this article, you create two objects - the Active Directory (AD) application and the service principal. The AD application is the global representation of your application. It contains the credentials (an application id and either a password or certificate). The service principal is the local representation of your application in an Active Directory. It contains the role assignment. This topic focuses on a single-tenant application where the application is intended to run within only one organization. You typically use single-tenant applications for line-of-business applications that run within your organization. In a single-tenant application, you have one AD app and one service principal.

You may be wondering - why do I need both objects? This approach makes more sense when you consider multi-tenant applications. You typically use multi-tenant applications for software-as-a-service (SaaS) applications, where your application runs in many different subscriptions. For multi-tenant applications, you have one AD app and multiple service principals (one in each Active Directory that grants access to the app). To set up a multi-tenant application, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).

## Required permissions

To complete this topic, you must have sufficient permissions in both your Azure Active Directory and your Azure subscription. Specifically, you must be able to create an app in the Active Directory, and assign the service principal to a role. 

In your Active Directory, your account must be an administrator (such as **Global Admin** or **User Admin**). If your account is assigned to the **User** role, you need to have an administrator elevate your permissions.

In your subscription, your account must have `Microsoft.Authorization/*/Write` access, which is granted through the [Owner](./active-directory/role-based-access-built-in-roles.md#owner) role or [User Access Administrator](./active-directory/role-based-access-built-in-roles.md#user-access-administrator) role. If your account is assigned to the **Contributor** role, you receive an error when attempting to assign the service principal to a role. Again, your subscription administrator must grant you sufficient access.

Now, proceed to a section for either [password](#create-service-principal-with-password) or [certificate](#create-service-principal-with-certificate) authentication.

## Create service principal with password

In this section, you perform the steps to:

- create the AD application with a password, and the service principal
- assign the Reader role to the service principal

To quickly perform these steps, use the following commands. 

    azure ad sp create -n exampleapp --home-page http://www.contoso.org --identifier-uris https://www.contoso.org/example -p <Your_Password>
    azure role assignment create --objectId ff863613-e5e2-4a6b-af07-fff6f2de3f4e -o Reader -c /subscriptions/{subscriptionId}/

Let's go through these steps more carefully to make sure you understand the process.

1. Sign in to your account.

        azure config mode arm
        azure login

1. Create a service principal for your application. Provide a display name, the URI to a page that describes your application, the URIs that identify your application, and the password for your application identity. This command creates both the AD application and the service principal.

        azure ad sp create -n exampleapp --home-page http://www.contoso.org --identifier-uris https://www.contoso.org/example -p {your-password}
        
     For single-tenant applications, the URIs are not validated.
     
     If your account does not have the [required permissions](#required-permissions) on the Active Directory, you see an error message indicating "Authentication_Unauthorized" or "No subscription found in the context".
    
     The new service principal is returned. The Object Id is needed when granting permissions. The service principal name is needed when logging in.
    
        info:    Executing command ad sp create
        + Creating application exampleapp
        / Creating service principal for application 7132aca4-1bdb-4238-ad81-996ff91d8db+
        data:    Object Id:               ff863613-e5e2-4a6b-af07-fff6f2de3f4e
        data:    Display Name:            exampleapp
        data:    Service Principal Names:
        data:                             7132aca4-1bdb-4238-ad81-996ff91d8db4
        data:                             https://www.contoso.org/example
        info:    ad sp create command OK

2. Grant the service principal permissions on your subscription. In this example, you add the service principal to the **Reader** role, which grants permission to read all resources in the subscription. For other roles, see [RBAC: Built-in roles](./active-directory/role-based-access-built-in-roles.md). For the **ServicePrincipalName** parameter, provide the **ObjectId** that you used when creating the application. 

        azure role assignment create --objectId ff863613-e5e2-4a6b-af07-fff6f2de3f4e -o Reader -c /subscriptions/{subscriptionId}/

     If your account does not have sufficient permissions to assign a role, you see an error message. The message states your account **does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{guid}'**. 

That's it! Your AD application and service principal are set up. The next section shows you how to log in with the credential through Azure CLI. If you want to use the credential in your code application, you do not need to continue with this topic. You can jump to the [Sample applications](#sample-applications) for examples of logging in with your application id and password. 

### Provide credentials through Azure CLI

Now, you need to log in as the application to perform operations.

1. Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Active Directory. To retrieve the tenant id for your currently authenticated subscription, use:

        azure account show

     Which returns:

        info:    Executing command account show
        data:    Name                        : Windows Azure MSDN - Visual Studio Ultimate
        data:    ID                          : {guid}
        data:    State                       : Enabled
        data:    Tenant ID                   : {guid}
        data:    Is Default                  : true
        ...

     If you need to get the tenant id of another subscription, use the following command:

        azure account show -s {subscription-id}

3. Log in as the service principal.

        azure login -u https://www.contoso.org/example --service-principal --tenant {tenant-id}

    You are prompted for the password. Provide the password you specified when creating the AD application.

        info:    Executing command login
        Password: ********

You are now authenticated as the service principal for the service principal that you created.

## Create service principal with certificate

In this section, you perform the steps to:

- create a self-signed certificate
- create the AD application with the certificate, and the service principal
- assign the Reader role to the service principal

To complete these steps, you must have [OpenSSL](http://www.openssl.org/) installed.

1. Create a self-signed certificate.

        openssl req -x509 -days 3650 -newkey rsa:2048 -out cert.pem -nodes -subj '/CN=exampleapp'

2. Combine the public and private keys.

        cat privkey.pem cert.pem > examplecert.pem

3. Open the **examplecert.pem** file and look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**. Copy the certificate data. You pass this data as a parameter when creating the service principal.

1. Sign in to your account.

        azure config mode arm
        azure login

1. Create a service principal for your application. Provide a display name, the URI to a page that describes your application, the URIs that identify your application, and the certificate data you copied. This command creates both the AD application and the service principal.

        azure ad sp create -n "exampleapp" --home-page "https://www.contoso.org" -i "https://www.contoso.org/example" --key-value <certificate data>
        
     For single-tenant applications, the URIs are not validated.
     
     If your account does not have the [required permissions](#required-permissions) on the Active Directory, you see an error message indicating "Authentication_Unauthorized" or "No subscription found in the context".
    
     The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK
        
2. Grant the service principal permissions on your subscription. In this example, you add the service principal to the **Reader** role, which grants permission to read all resources in the subscription. For other roles, see [RBAC: Built-in roles](./active-directory/role-based-access-built-in-roles.md). For the **ServicePrincipalName** parameter, provide the **ObjectId** that you used when creating the application. 

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

     If your account does not have sufficient permissions to assign a role, you see an error message. The message states your account **does not have authorization to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{guid}'**. 

### Provide certificate through automated Azure CLI script

Now, you need to log in as the application to perform operations.

1. Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Active Directory. To retrieve the tenant id for your currently authenticated subscription, use:

        azure account show

     Which returns:

        info:    Executing command account show
        data:    Name                        : Windows Azure MSDN - Visual Studio Ultimate
        data:    ID                          : {guid}
        data:    State                       : Enabled
        data:    Tenant ID                   : {guid}
        data:    Is Default                  : true
        ...

     If you need to get the tenant id of another subscription, use the following command:

        azure account show -s {subscription-id}

1. To retrieve the certificate thumbprint and remove unneeded characters, use:

        openssl x509 -in "C:\certificates\examplecert.pem" -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g'
    
     Which returns a thumbprint value similar to:

        30996D9CE48A0B6E0CD49DBB9A48059BF9355851

1. Log in as the service principal.

        azure login --service-principal --tenant {tenant-id} -u https://www.contoso.org/example --certificate-file C:\certificates\examplecert.pem --thumbprint {thumbprint}

You are now authenticated as the service principal for the Active Directory application that you created.

## Sample applications

The following sample applications show how to log in as the service principal.

**.NET**

- [Deploy an SSH Enabled VM with a Template with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-template-deployment/)
- [Manage Azure resources and resource groups with .NET](https://azure.microsoft.com/documentation/samples/resource-manager-dotnet-resources-and-groups/)

**Java**

- [Getting Started with Resources - Deploy Using Azure Resource Manager Template - in Java](https://azure.microsoft.com/documentation/samples/resources-java-deploy-using-arm-template/)
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
- To get more information about using certificates and Azure CLI, see [Certificate-based authentication with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx). 
