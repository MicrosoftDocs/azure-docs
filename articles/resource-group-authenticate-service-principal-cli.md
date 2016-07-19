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
   ms.date="07/19/2016"
   ms.author="tomfitz"/>

# Use Azure CLI to create a service principal to access resources

> [AZURE.SELECTOR]
- [PowerShell](resource-group-authenticate-service-principal.md)
- [Azure CLI](resource-group-authenticate-service-principal-cli.md)
- [Portal](resource-group-create-service-principal-portal.md)

When you have an application or script that needs to access resources, you most likely do not want to run this process under a user's credentials. That user may have different permissions that you would like to assign to the process, and the user's job responsibilities could change. Instead, you can create an identity for the application that includes authentication credentials and role assignments. Your application logs in as this identity every time it runs. This topic shows you how to use [Azure CLI for Mac, Linux and Windows](xplat-cli-install.md) to set up everything you need for an application to run under its own credentials and identity.

In this article, you will create two objects - the Active Directory (AD) application and the service principal. The AD application contains the credentials (an application id and either a password or certificate). The service principal contains the role assignment. From the AD application, you can create many service principals. This topic focuses on a single-tenant application where the application is intended to run within only one organization. You typically use single-tenant applications for line-of-business applications that run within your organization. You can also create multi-tenant applications when your application needs to run in many organizations. You typically use multi-tenant applications for software-as-a-service (SaaS) applications. To set up a multi-tenant application, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).

There are many concepts to understand when working with Active Directory. For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

With Azure CLI, you have 2 options for authenticating your AD application:

 - password
 - certificate

If, after setting up your AD application, you intend to log in to Azure from another programming framework (such Python, Ruby, or Node.js), password authentication might be your best option. Before deciding whether to use a password or certificate, see the [Sample applications](#sample-applications) section for examples of authenticating in the different frameworks.

## Get tenant ID

Whenever you sign in as a service principal, you need to provide the tenant id of the directory for your AD app. A tenant is an instance of Active Directory. Because you will need that value for either password or certificate authentication, let's get that value now. 

1. Sign in to your account.

        azure config mode arm
        azure login

1. If you are retrieving the tenant id for your currently authenticated subscription, you do not need to provide the subscription id as a parameter. The **-r** switch retrieves the value without the quotation marks.

        tenantId=$(azure account show -s <subscriptionId> --json | jq -r '.[0].tenantId')

Now, proceed to a section below for either [password](#create-service-principal-with-password) or [certificate](#create-service-principal-with-certificate) authentication.


## Create service principal with password

In this section, you will perform the steps to create a service principal with a password, and assign it to a role.

1. Create a service principal for your application. Provide a display name for your application, the URI to a page that describes your application (the link is not verified), the URIs that identify your application, and the password for your application identity. This command creates both the AD application and the service principal.

        azure ad sp create -n exampleapp --home-page http://www.contoso.org --identifier-uris https://www.contoso.org/example -p <Your_Password>
        
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

2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId ff863613-e5e2-4a6b-af07-fff6f2de3f4e -o Reader -c /subscriptions/{subscriptionId}/

That's it! Your AD application and service principal are set up. The next section shows you how to log in with the credential through Azure CLI; however, if you want to use the credential in your code application, you do not need to continue with this topic. You can jump to the [Sample applications](#sample-applications) for examples of logging in with your application id and password. 

### Provide credentials through Azure CLI

1. For the user name, use the service principal name that was returned when you created the service principal. If you need to retrieve the application id, use the following command. Provide the name of the Active Directory application in the **search** parameter.

        appId=$(azure ad app show --search exampleapp --json | jq -r '.[0].appId')

3. Login as the service principal.

        azure login -u 7132aca4-1bdb-4238-ad81-996ff91d8db4 --service-principal --tenant "$tenantId"

    You will be prompted for the password. Provide the password you specified when creating the AD application.

        info:    Executing command login
        Password: ********

You are now authenticated as the service principal for the service principal that you created.

## Create service principal with certificate

In this section, you will perform the steps to create a service principal for a service principal that uses a certificate for authentication. 
To complete these steps, you must have [OpenSSL](http://www.openssl.org/) installed.

1. Create a self-signed certificate.

        openssl req -x509 -days 3650 -newkey rsa:2048 -out cert.pem -nodes -subj '/CN=exampleapp'

2. Combine the public and private keys.

        cat privkey.pem cert.pem > examplecert.pem

3. Open the **examplecert.pem** file and copy the certificate data. Look for the long sequence of characters between **-----BEGIN CERTIFICATE-----** and **-----END CERTIFICATE-----**.

1. Create a service principal for your application. Provide the application id that was returned in the previous step.

        azure ad sp create -n "exampleapp" --home-page "https://www.contoso.org" -i "https://www.contoso.org/example" --key-value <certificate data>
        
    The new service principal is returned. The Object Id is needed when granting permissions.
    
        info:    Executing command ad sp create
        - Creating service principal for application 4fd39843-c338-417d-b549-a545f584a74+
        data:    Object Id:        7dbc8265-51ed-4038-8e13-31948c7f4ce7
        data:    Display Name:     exampleapp
        data:    Service Principal Names:
        data:                      4fd39843-c338-417d-b549-a545f584a745
        data:                      https://www.contoso.org/example
        info:    ad sp create command OK
        
2. Grant the service principal permissions on your subscription. In this sample you will grant the service principal the permission to Read all resources in the subscription. For more information on role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

        azure role assignment create --objectId 7dbc8265-51ed-4038-8e13-31948c7f4ce7 -o Reader -c /subscriptions/{subscriptionId}/

### Provide certificate through automated Azure CLI script

To authenticate with Azure CLI, provide the certificate thumbprint, certificate file, the application id, and tenant id.

    azure login --service-principal --tenant 00000 -u 000000 --certificate-file C:\certificates\examplecert.pem --thumbprint 000000

You are now authenticated as the service principal for the Active Directory application that you created.

If you need to retrieve the certificate thumbprint and remove unneeded characters, use:

    openssl x509 -in "C:\certificates\examplecert.pem" -fingerprint -noout | sed 's/SHA1 Fingerprint=//g'  | sed 's/://g'
    
Which returns a thumbprint value similar to:

    30996D9CE48A0B6E0CD49DBB9A48059BF9355851

If you need to retrieve the application id, use:

    azure ad app show --search exampleapp --json | jq -r '.[0].appId'

If you need to retrieve the tenant id later, see [Get tenant ID](#get-tenant-id).


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
- To get more information about using certificates and Azure CLI, see [Certificate-based auth with Azure Service Principals from Linux command line](http://blogs.msdn.com/b/arsen/archive/2015/09/18/certificate-based-auth-with-azure-service-principals-from-linux-command-line.aspx). 
