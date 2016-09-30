<properties
   pageTitle="Create service principal in portal | Microsoft Azure"
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
   ms.date="09/07/2016"
   ms.author="tomfitz"/>

# Use portal to create Active Directory application and service principal that can access resources

> [AZURE.SELECTOR]
- [PowerShell](resource-group-authenticate-service-principal.md)
- [Azure CLI](resource-group-authenticate-service-principal-cli.md)
- [Portal](resource-group-create-service-principal-portal.md)


When you have an application that needs to access or modify resources, you must set up an Active Directory (AD) application and assign the required permissions to it. This topic shows you how to perform those steps through the portal. Currently, you must use the classic portal to create a new Active Directory application, and then switch to the Azure portal to assign a role to the application. 

> [AZURE.NOTE] You may find it easier to set up your AD application and service principal through [PowerShell](resource-group-authenticate-service-principal.md) or [Azure CLI](resource-group-authenticate-service-principal-cli.md), especially if you want to use a certificate for authentication. This topic does not show how to use a certificate.
>
> The steps in this topic only apply when using the classic portal to create the AD application. If you use the Azure portal for creating the AD application, these steps will not succeed.

For an explanation of Active Directory concepts, see [Application Objects and Service Principal Objects](./active-directory/active-directory-application-objects.md). 
For more information about Active Directory authentication, see [Authentication Scenarios for Azure AD](./active-directory/active-directory-authentication-scenarios.md).

For detailed steps on integrating an application into Azure for managing resources, see [Developer's guide to authorization with the Azure Resource Manager API](resource-manager-api-authentication.md).

## Create an Active Directory application

1. Log in to your Azure Account through the [classic portal](https://manage.windowsazure.com/). 

2. Make sure you know the default Active Directory for your subscription. You can only grant access for applications in the same directory as your subscription. Select **Settings** and look for the directory name associated with your subscription.  For more information, see [How Azure subscriptions are associated with Azure Active Directory](./active-directory/active-directory-how-subscriptions-associated-directory.md).
   
     ![find default directory](./media/resource-group-create-service-principal-portal/show-default-directory.png)

2. Select **Active Directory** from the left pane.

     ![select Active Directory](./media/resource-group-create-service-principal-portal/active-directory.png)
     
3. Select the Active Directory that you want to use for creating the application. If you have more than one Active Directory, create the application in the default directory for your subscription.   

     ![choose directory](./media/resource-group-create-service-principal-portal/active-directory-details.png)
     
3. To view the applications in your directory, select **Applications**.

     ![view applications](./media/resource-group-create-service-principal-portal/view-applications.png)

4. If you haven't created an application in that directory before, you should see something similar to following image. Select **ADD AN APPLICATION**

     ![add application](./media/resource-group-create-service-principal-portal/create-application.png)

     Or, click **Add** in the bottom pane.

     ![add](./media/resource-group-create-service-principal-portal/add-icon.png)

5. Select the type of application you would like to create. For this tutorial, select **Add an application my organization is developing**. 

     ![new application](./media/resource-group-create-service-principal-portal/what-do-you-want-to-do.png)

6. Provide a name for the application and select the type of application you want to create. For this tutorial, create a **WEB APPLICATION AND/OR WEB API** and click the next button. If you select **NATIVE CLIENT APPLICATION**, the remaining steps of this article will not match your experience.

     ![name application](./media/resource-group-create-service-principal-portal/tell-us-about-your-application.png)

7. Fill in the properties for your app. For **SIGN-ON URL**, provide the URI to a web site that describes your application. The existence of the web site is not validated. 
For **APP ID URI**, provide the URI that identifies your application.

     ![application properties](./media/resource-group-create-service-principal-portal/app-properties.png)

You have created your application.

## Get client id and authentication key

When programmatically logging in, you need the id for your application. If the application runs under its own credentials, you also need an authentication key.

1. Select the **Configure** tab to configure your application's password.

     ![configure application](./media/resource-group-create-service-principal-portal/application-configure.png)

2. Copy the **CLIENT ID**.
  
     ![client id](./media/resource-group-create-service-principal-portal/client-id.png)

3. If the application runs under its own credentials, scroll down to the **Keys** section and select how long you would like your password to be valid.

     ![keys](./media/resource-group-create-service-principal-portal/create-key.png)

4. Select **Save** to create your key.

     ![save](./media/resource-group-create-service-principal-portal/save-icon.png)

     The saved key is displayed and you can copy it. You are not able to retrieve the key later so copy it now.

     ![saved key](./media/resource-group-create-service-principal-portal/save-key.png)

## Get tenant id

When programmatically logging in, you need to pass the tenant id with your authentication request. For Web Apps and Web API Apps, you can retrieve the tenant id by selecting **View endpoints** at the bottom of the screen and retrieving the id as shown in the following image.  

   ![tenant id](./media/resource-group-create-service-principal-portal/save-tenant.png)

You can also retrieve the tenant id through PowerShell:

    Get-AzureRmSubscription

Or, Azure CLI:

    azure account show --json

## Set delegated permissions

If your application accesses resources on behalf of a signed-in user, you must grant your application the delegated permission to access other applications. You grant this access in the **permissions to other applications** section of the **Configure** tab. By default, a delegated permission is already enabled for the Azure Active Directory. Leave this delegated permission unchanged.

1. Select **Add application**.

2. From the list, select the **Windows Azure Service Management API**. Then, select the complete icon.

      ![select app](./media/resource-group-create-service-principal-portal/select-app.png)

3. In the dropdown list for delegated permissions, select **Access Azure Service Management as organization**.

      ![select permission](./media/resource-group-create-service-principal-portal/select-permissions.png)

4. Save the change.

## Assign application to role

If your application is running under its own credentials, you must assign the application to a role. Decide which role represents the right permissions for the application. To learn about the available roles, see [RBAC: Built in Roles](./active-directory/role-based-access-built-in-roles.md). 

To assign a role to an application, you must have the correct permissions. Specifically, you must have `Microsoft.Authorization/*/Write` access that is granted through the [Owner](./active-directory/role-based-access-built-in-roles.md#owner) role or [User Access Administrator](./active-directory/role-based-access-built-in-roles.md#user-access-administrator) role. The Contributor role does not have the correct access.

You can set the scope at the level of the subscription, resource group, or resource. Permissions are inherited to lower levels of scope. For example, adding an application to the Reader role for a resource group means it can read the resource group and any resources it contains.

1. To assign the application to a role, switch from the classic portal to the [Azure portal](https://portal.azure.com).

1. Check your permissions to make sure you can assign the service principal to a role. Select **My permissions** for your account.

    ![select my permissions](./media/resource-group-create-service-principal-portal/my-permissions.png)

1. View the assigned permissions for your account. As noted previously, you must belong to the Owner or User Access Administrator roles, or have a customized role that grants write access for Microsoft.Authorization. The following image shows an account that is assigned to the Contributor role for the subscription, which is not adequate permissions to assign an application to a role.

    ![show my permissions](./media/resource-group-create-service-principal-portal/show-permissions.png)

     If you do not have the correct permissions to grant access to an application, you must either request that your subscription administrator adds you to the User Access Administrator role, or request that an administrator grants access to the application.

1. Navigate to the level of scope you wish to assign the application to. To assign a role at the subscription scope, select **Subscriptions**.

     ![select subscription](./media/resource-group-create-service-principal-portal/select-subscription.png)

     Select the particular subscription to assign the application to.

     ![select subscription for assignment](./media/resource-group-create-service-principal-portal/select-one-subscription.png)

     Select the **Access** icon in the upper-right corner.

     ![select access](./media/resource-group-create-service-principal-portal/select-access.png)
     
     Or, to assign a role at resource group scope, navigate to a resource group. From the resource group blade, select **Access control**.

     ![select users](./media/resource-group-create-service-principal-portal/select-users.png)

     The following steps are the same for any scope.

2. Select **Add**.

     ![select add](./media/resource-group-create-service-principal-portal/select-add.png)

3. Select the **Reader** role (or whatever role you wish to assign the application to).

     ![select role](./media/resource-group-create-service-principal-portal/select-role.png)

4. When you first see the list of users you can add to the role, you will not see applications. You will only see group and users.

     ![show users](./media/resource-group-create-service-principal-portal/show-users.png)

5. To find your application, you must search for it. Start typing the name of your application, and the list of available options will change. Select your application when you see it in the list.

     ![assign to role](./media/resource-group-create-service-principal-portal/assign-to-role.png)

6. Select **Okay** to finish assigning the role. You should now see your application in the list of uses assigned to a role for the resource group.


For more information about assigning users and applications to roles through the portal, see [Use role assignments to manage access to your Azure subscription resources](role-based-access-control-configure.md#manage-access-using-the-azure-management-portal).

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

- To learn about specifying security policies, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).  
- For a video demonstration of these steps, see [Enabling Programmatic Management of an Azure Resource with Azure Active Directory](https://channel9.msdn.com/Series/Azure-Active-Directory-Videos-Demos/Enabling-Programmatic-Management-of-an-Azure-Resource-with-Azure-Active-Directory).

