---
title: Azure Active Directory integration for Azure Red Hat OpenShift | Microsoft Docs
description:  Learn how to create an Azure AD security group and user for testing apps on your Microsoft Azure Red Hat OpenShift cluster.
author: tylermsft
ms.author: twhitney
ms.service: openshift
manager: jeconnoc
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/07/2019
---

# Azure Active Directory integration for Azure Red Hat OpenShift

If you haven't already created an Azure Active Directory (Azure AD) tenant, follow the directions in [Create an Azure AD tenant for Azure Red Hat OpenShift](howto-create-tenant.md) before continuing with these instructions.

Microsoft Azure Red Hat OpenShift needs permissions to perform tasks on behalf of your cluster. This topic contains instructions for creating a new Azure AD security group, and user, that you'll need to access apps running on your Azure Red Hat OpenShift cluster.

If your organization doesn't already have an Azure AD user that you'll use to access your cluster, or an Azure AD app registration to use as the service principal, follow these instructions to create them.

## Create a new Active Directory user

In the [Azure portal](https://portal.azure.com), ensure that your tenant appears under your user name in the top right of the portal:

    ![Screenshot of portal with tenant listed in top right][tenantcallout]
    If the wrong tenant is displayed, click on your user name in the top right, then click **Switch Directory**, and select the correct tenant from the **All Directories** list.

Create a new user in Active Directory to use to sign in to your Azure Red Hat OpenShift cluster.

1. Go to the [Users - All users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) blade.
2. Click **+New user**. The **User** pane appears.
3. Enter a **Name** that you'd like for this user.
4. Create a **User name** based on the name of the tenant you created with  `.onmicrosoft.com` appended at the end. For example, `yourUserName@yourTenantName.onmicrosoft.com`. Write down this user name. You'll need it to sign in to your cluster.
5. Click **Directory role** to open the directory role pane, and select **Global administrator** and then click **Ok** at the bottom of the pane.
6. In the middle of the **User** pane, click **Show Password** and record the temporary password. After you sign in the first time, you'll be prompted to reset it.
7. At the bottom of the pane, click **Create** to create the user.

## Create an Azure AD security group

Microsoft Azure Red Hat OpenShift needs permissions to perform tasks on behalf of your cluster. Follow these instructions to create an Azure AD security group.

## Create an Azure AD app registration

If your organization doesn't already have an Azure Active Directory (Azure AD) app registration to use as the service principal, follow these instructions to create one.

1. Open the [App registrations blade](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredAppsPreview) and click **+New  registration**.
2. In the **Register an application** pane, enter a user-facing display name for your application object.
3. For **Supported account types**, click **Accounts in this organizational directory only** to choose the most secure type.
4. Ensure that **Redirect URI (optional)** dropdown is set to *Web*.
5. Create a **Redirect URI** using the following pattern:

    ```
    https://openshift.<cluster-name>.<azure-region>.azmosa.io/oauth2callback/Azure%20AD
    ```

    . . . where `<cluster-name>` is the intended name of your Azure Red Hat OpenShift cluster (or any unique, lower-case string) and `<azure-region>` is the [Azure region hosting your Azure Red Hat OpenShift cluster](supported-resources.md#azure-regions). For example, if your cluster name is to be `contoso`, and you will be creating it in the `eastus` region, the fully qualified domain name (FQDN) that you'll enter for the **Redirect URI** would be `https://contoso.eastus.azmosa.io/oath2callback/Azure%20AD`

    > [!IMPORTANT]
    > The cluster name must be all lowercase and be unique.
    
    Make note of your cluster name. We will refer to the cluster name as `CLUSTER_NAME` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

6. Ensure your **Redirect URI (optional)** value validates with a green check.
7. Click the **Register** button to create the Azure AD application object.
8. On the page that appears, copy down the **Application (client) ID**. We will refer to this value as `APPID` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

### Create a client secret

Now you're ready to generate a client secret for authenticating your app to Azure Active Directory.

1. From the registered app page for the app registration you just made, click on **Certificates & secrets**.
2. On the **Certificates & secrets** pane that appears, click **+New client secret**.  The **Add a client secret** pane appears.
3. Provide a key **Description**.
4. Set **Expires** to the duration you prefer, for example *In 2 Years*.
5. Click **Add** and the key value will appear in the **Client secrets** section of the page.
6. Copy down the key value. We will refer to this value as `SECRET` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

For more info on Azure Application Objects, see [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals).

For details on creating a new Azure AD application, see [Register an app with the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app).

## Resources

* [Applications and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)  
* [Quickstart: Register an app with the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app)  

[appidimage]: ./media/howto-create-tenant/get-app-id.png
[createkeyimage]: ./media/howto-create-tenant/create-key.png
[tenantcallout]: ./media/howto-create-tenant/tenant-callout.png

## Next steps

If you've met all the [Azure Red Hat OpenShift prerequisites](howto-setup-environment.md), you're ready to create your first cluster!

Try the tutorial:
> [!div class="nextstepaction"]
> [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md)