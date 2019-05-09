---
title: Create an Azure AD app registration and user for Azure Red Hat OpenShift | Microsoft Docs
description:  Learn how to create a service principal, generate a client secret and authentication callback URL, and create a new Active Directory user for testing apps on your Microsoft Azure Red Hat OpenShift cluster.
author: tylermsft
ms.author: twhitney
ms.service: openshift
manager: jeconnoc
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/06/2019
---

# Create an Azure AD app registration and user for Azure Red Hat OpenShift

Microsoft Azure Red Hat OpenShift needs permissions to perform tasks on behalf of your cluster. If your organization doesn't already have an Azure Active Directory (Azure AD) app registration to use as the service principal, follow these instructions to create one.

This topic concludes with instructions for creating a new Azure AD user that you'll need to access apps running on your Azure Red Hat OpenShift cluster.

If you haven't already created an Azure AD tenant, follow the directions in [Create an Azure AD tenant for Azure Red Hat OpenShift](howto-create-tenant.md) before continuing with these instructions.

## Create a new app registration

An application that wants to use the capabilities of Azure AD must first be registered in an Azure AD tenant. This registration process involves giving Azure AD details about your application such as the URL where the app is  located, the URL to send replies after a user is authenticated, the URI that identifies the app, and so on.

1. In the [Azure portal](https://portal.azure.com), ensure that your tenant appears under your user name in the top right of the portal:

    ![Screenshot of portal with tenant listed in top right][tenantcallout]
    If the wrong tenant is displayed, click on your user name in the top right, then click **Switch Directory**, and select the correct tenant from the **All Directories** list.

2. Open the [App registrations blade](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and click **New application registration**.
3. In the **Create** pane, enter a friendly name for your application object.
4. Ensure that **Application type** is set to *Web app/API*.
5. Create a **Sign-on URL** using the following pattern:

    ```
    https://<cluster-name>.<azure-region>.cloudapp.azure.com
    ```

    . . . where `<cluster-name>` is the intended name of your Azure Red Hat OpenShift cluster and `<azure-region>` is the [Azure region hosting your Azure Red Hat OpenShift cluster](supported-resources.md#azure-regions). For example, if your cluster name is to be `contoso`, and you will be creating it in the `eastus` region, the fully qualified domain name (FQDN) that you'll enter for the **Sign-on URL** would be `https://contoso.eastus.cloudapp.azure.com`

    > [!IMPORTANT]
    > The cluster name must be all lowercase, and the FQDN URL must be unique.
    > Ensure you choose a sufficiently distinct name for your cluster.

    Make note of your cluster name and sign-on URL—you'll need them later to access apps running on your cluster. We will refer to the cluster name as `CLUSTER_NAME`, and this sign-on URL as `FQDN` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

6. Ensure your **Sign-on URL** value validates with a green check. (Press the Tab key to focus out of the *Sign-on URL* field and run the validation check.)
7. Click the **Create** button to create the Azure AD application object.
8. On the **Registered App** page that appears, copy down the **Application ID**. We will refer to this value as `APPID` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

    ![Screenshot of the application ID textbox][appidimage]
    
For more info on Azure Application Objects, see [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals).

For details on creating a new Azure AD application, see [Register an app with the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app).

### Create a client secret

Now you're ready to generate a client secret for authenticating your app to Azure Active Directory.

1. From the **Registered App** page, click on **Settings** to open the settings for your registered app.
2. On the **Settings** pane that appears, click **Keys**.  The **Keys** pane appears.
![Screenshot of the create key page in the portal][createkeyimage]
3. Provide a key **Description**.
4. Set a value for **Expires**, for example *In 2 Years*.
5. Click **Save** and the key value will appear.
6. Copy down the key value. We will refer to this value as `SECRET` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

### Create a Reply URL

Azure AD uses the app object *Reply URL* to specify the callback to use when authorizing the app. In the case of a web API or web application, the Reply URL is the location where Azure AD will send the authentication response, including a token if the authentication was successful.

Even the smallest mismatch (trailing slash missing, different casing) will cause the token-issuance operation to fail and you won't be able to sign in.

1. Go back to the **Settings** pane (you can click **Settings** in the breadcrumb at the top of the portal), and click **Reply URLs** on the right.  The **Reply URLs** pane appears.
2. The first reply URL in the list will be the `FQDN` value from step 6 in [Create a new app registration](#create-a-new-app-registration). Edit it and append `/oauth2callback/Azure%20AD`.  For example, your reply URL should now look something like `https://mycluster.eastus.cloudapp.azure.com/oauth2callback/Azure%20AD`
3. Click **Save** to save the Reply URL.

## Create a new Active Directory user

Create a new user in Active Directory to use to sign in to the app running on your Azure Red Hat OpenShift cluster.

1. Go to the [Users - All users](https://portal.azure.com/#blade/Microsoft_AAD_IAM/UsersManagementMenuBlade/AllUsers) blade.
2. Click **+ New user**. The **User** pane appears.
3. Enter a **Name** that you'd like for this user.
4. Create a **User name** based on the name of the tenant you created with  `.onmicrosoft.com` appended at the end. For example, `yourUserName@yourTenantName.onmicrosoft.com`. Write down this user name. You'll need it to sign in to use the app on your cluster.
5. Click **Directory role** and select **Global administrator** and then click **Ok** at the bottom of the pane.
6. In the middle of the **User** pane, click **Show Password** and record the temporary password. After you sign in the first time, you'll be prompted to reset it.
7. At the bottom of the pane, click **Create** to create the user.

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
