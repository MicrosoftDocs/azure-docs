<properties
   pageTitle="Create AD application and service principal in portal | Microsoft Azure"
   description="Describes how to create a new Active Directory application and service principal that can be used with the role-based access control in Azure Resource Manager to manage access to resources."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor="tysonn"/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/18/2016"
   ms.author="tomfitz"/>

# Create Active Directory application and service principal using portal

## Overview
When you have an automated process or application that needs to access or modify resources, you can use the classic portal to create an Active Directory application. You can execute the application either under its own identity or under the identity of the 
signed-in user of your application. These two methods of authenticating the applications are referred to as interactive (user signs in) and non-interactive (app provides its own credentials). In the non-interactive mode, 
you must assign a role with the correct permission to the identity for the application. If your app runs unattended, such as a backend process, you must use non-interactive authentication.

This topic shows you how to create a new application using the classic portal. Currently, you must use the classic portal to create a new Active Directory application. You can use the portal to assign the application to a role. 

You can also perform these steps through Azure PowerShell or Azure CLI. For more information about using PowerShell or CLI with 
the service principal, see [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).

## Concepts
1. Azure Active Directory (AAD) - an identity and access management service build for the cloud. For more details see: [What is Azure Active Directory](active-directory/active-directory-whatis.md)
2. AD Application - a directory record in Active Directory that identifies an application. 
3. Service Principal - an instance of the application to which you can apply access control roles.

For a more detailed explanation of applications and service principals, see [Application Objects and Service Principal Objects](active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](active-directory/active-directory-authentication-scenarios.md).


## Create application

For interactive and non-interactive applications, you must create and configure your Active Directory application.

1. Login to your Azure Account through the [classic portal](https://manage.windowsazure.com/).

2. Select **Active Directory** from the left pane.

     ![select Active Directory][1]
     
3. Select the directory that you want to use for creating the new application. For resources in your subscription, you can only assign access to service principals in the same directory as your subscription. Typically, you want to create the application in the directory where your subscription resides. 

     ![choose directory][2]
     
    If you need to find the directory for your subscription, select **Settings** and look for the directory name.
   
     ![find default directory](./media/resource-group-create-service-principal-portal/show-default-directory.png)

3. To view the applications in your directory, click on **Applications**.

     ![view applications][11]

4. If you haven't created an application in that directory before you should see something similar to following image. Click on **ADD AN APPLICATION**

     ![add application][6]

     Or, click **Add** in the bottom pane.

     ![add][12]

5. Select the type of application you would like to create. For this tutorial, we will not use an application from the gallery.

     ![new application][10]

6. Fill in name of the application and select the type of application you want to use. Select the type of application you are creating. For this tutorial, we will elect to create a **WEB APPLICATION AND/OR WEB API** and click the next button.

     ![name application][9]

7. Fill in the properties for your app. For **SIGN-ON URL**, provide the URI to a web-site that describes your application. The existence of the web-site is not validated. 
For **APP ID URI**, provide the URI that identifies your application. The uniqueness or existence of the endpoint is not validated. If you had selected **Native Client Application** for the application type, you will 
provide a **Redirect URI** value. Click the **Complete** to create your AAD Application.

     ![application properties][4]

You have created your application.

## Get client id and tenant id

When programmatically accessing your application, you will need the id for your application. Select the **Configure** tab and copy the **CLIENT ID**.
  
   ![client id][5]

In some cases, you need to pass the tenant id with your authentication request. For Web Apps and Web API Apps, you can retrieve the tenant id by selecting **View endpoints** at the bottom of the screen and retrieving the id as shown below.  

   ![tenant id](./media/resource-group-create-service-principal-portal/save-tenant.png)

Endpoints are not available for Native Client Applications. Instead, you can retrieve the tenant id through PowerShell:

    Get-AzureRmSubscription

Or, Azure CLI:

    azure account show --json

## Create an authentication key

If your application will run with its own credentials, you must create a key for the application.

1. Click on the **Configure** tab to configure your application's password.

     ![configure application][3]

2. Scroll down to the **Keys** section and select how long you would like your password to be valid.

     ![keys][7]

3. Select **Save** to create your key.

     ![save][13]

     The saved key is displayed and you can copy it. You will not be able to retrieve the key later so you will want to copy it now.

     ![saved key][8]

Your application is now ready and the service principal created on your tenant. When signing in as a service principal be sure to use:

* **CLIENT ID** - as your user name.
* **KEY** - as your password.

## Set delegated permissions

If your application accesses resources on behalf of a signed-in user, you must grant your application the delegated permission to access other applications. You do this in the **permissions to other applications** section of the 
**Configure** tab. By default, a delegated permission is already enabled for the Azure Active Directory. Leave this delegated permission unchanged.

1. Select **Add application**.

2. From the list, select the **Azure Service Management API**.

      ![select app](./media/resource-group-create-service-principal-portal/select-app.png)

3. Add the **Access Azure Service Management (preview)** delegated permission to the service management API.

       ![select permission](./media/resource-group-create-service-principal-portal/select-permissions.png)

4. Save the change.

## Configure multi-tenant application

If users from other Azure Active Directories can consent to the application and sign in to it, you must enable multi-tenancy. In the **Configure** tab, set **Application is multi-tenant** to **Yes**.

![multi-tenant](./media/resource-group-create-service-principal-portal/multi-tenant.png)

## Assign application to role

If your application is not running under the identity of a signed-in user, you must assign the application to a role to grant it permissions for performing actions. To assign the application to a role, switch from the classic portal to the [Azure portal](https://portal.azure.com). 
You must decide which role to add the application to, and at what scope. To learn about the available roles, see [RBAC: Built in Roles](./active-directory/role-based-access-built-in-roles.md). You can set the scope 
at the level of the subscription, resource group, or resource. The permissions are inherited to lower levels of scope (for example, adding an application to the Reader role for a resource group means it can read the 
resource group and any resources it contains).

1. In the portal, navigate to the level of scope you wish to assign the application to. For this topic, you can navigate to a resource group, and from the resource group blade, select the **Access** icon.

     ![select users](./media/resource-group-create-service-principal-portal/select-users.png)

2. Select **Add**.

     ![select add](./media/resource-group-create-service-principal-portal/select-add.png)

3. Select the **Reader** role (or whatever role you wish to assign the application to).

     ![select role](./media/resource-group-create-service-principal-portal/select-role.png)

4. When you first see the list of users you can add to the role, you will not see applications. You will only see group and users.

     ![show users](./media/resource-group-create-service-principal-portal/show-users.png)

5. To find your application, you must search for it. Start typing the name of your application, and the list of available options will change. Select your application when you see it in the list.

     ![assign to role](./media/resource-group-create-service-principal-portal/assign-to-role.png)

6. Select **Okay** to finish assigning the role. You should now see your application in the list of uses assigned to a role for the resource group.

     ![show](./media/resource-group-create-service-principal-portal/show-app.png)

For more information about assigning users and applications to roles through the portal, see [Manage access using the Azure Management Portal](../role-based-access-control-configure/#manage-access-using-the-azure-management-portal).

## Get access token in code

If you are using .NET, you can retrieve the access token for your application with the following code.

First, you must install the Active Directory Authentication Library into your Visual Studio project. The easiest way to do this is to use the NuGet package. Open the Package Manager Console, and type the following commands.

    PM> Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Version 2.19.208020213
    PM> Update-Package Microsoft.IdentityModel.Clients.ActiveDirectory -Safe

To sign in with your client id and secret, use the following method to retrieve the token.

    public static string GetAccessToken()
    {
        var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenantId or tenant name}");  
        var credential = new ClientCredential(clientId: "{client id}", clientSecret: "{application password}");
        var result = authenticationContext.AcquireToken(resource: "https://management.core.windows.net/", clientCredential:credential);

        if (result == null) {
            throw new InvalidOperationException("Failed to obtain the JWT token");
        }

        string token = result.AccessToken;

        return token;
    }

To sign in on behalf of the user, use the following method to retrieve the token.

    public static string GetAcessToken()
    {
        var authenticationContext = new AuthenticationContext("https://login.windows.net/{tenant id}");
        var result = authenticationContext.AcquireToken(resource: "https://management.core.windows.net/", {client id}, new Uri({redirect uri});

        if (result == null) {
            throw new InvalidOperationException("Failed to obtain the JWT token");
        }

        string token = result.AccessToken;

        return token;
    }

You can pass the token in the request header with the following code:

    string token = GetAcessToken();
    request.Headers.Add(HttpRequestHeader.Authorization, "Bearer " + token);


## Next Steps

- To learn about specifying security policies, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).  
- For a video demonstration of these steps, see [Enabling Programmatic Management of an Azure Resource with Azure Active Directory](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Enabling-Programmatic-Management-of-an-Azure-Resource-with-Azure-Active-Directory).
- To learn about using Azure PowerShell or Azure CLI to work with Active Directory applications and service principals, including how to use a certificate for authentication, see [Authenticating a Service Principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).
- For guidance on implementing security with Azure Resource Manager, see [Security considerations for Azure Resource Manager](best-practices-resource-manager-security.md).


<!-- Images. -->
[1]: ./media/resource-group-create-service-principal-portal/active-directory.png
[2]: ./media/resource-group-create-service-principal-portal/active-directory-details.png
[3]: ./media/resource-group-create-service-principal-portal/application-configure.png
[4]: ./media/resource-group-create-service-principal-portal/app-properties.png
[5]: ./media/resource-group-create-service-principal-portal/client-id.png
[6]: ./media/resource-group-create-service-principal-portal/create-application.png
[7]: ./media/resource-group-create-service-principal-portal/create-key.png
[8]: ./media/resource-group-create-service-principal-portal/save-key.png
[9]: ./media/resource-group-create-service-principal-portal/tell-us-about-your-application.png
[10]: ./media/resource-group-create-service-principal-portal/what-do-you-want-to-do.png
[11]: ./media/resource-group-create-service-principal-portal/view-applications.png
[12]: ./media/resource-group-create-service-principal-portal/add-icon.png
[13]: ./media/resource-group-create-service-principal-portal/save-icon.png
