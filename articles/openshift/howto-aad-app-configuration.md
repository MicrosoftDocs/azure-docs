---
title: Create an Azure Application for your Azure Red Hat OpenShift cluster | Microsoft Docs
description: Shows you how to create an Azure application object so that you can use OpenShift on Azure
documentationcenter: .net
author: tylermsft
ms.author: twhitney
ms.service: openshift
manager: jeconnoc
editor: ''
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 05/06/2019
---

# How to create a new app registration and new Azure Active Directory user

Microsoft Azure Red Hat OpenShift needs permissions to perform tasks on behalf of your cluster in Azure. If your organization doesn't already have an Azure Active Directory (Azure AD) app registration that you can use as the service principal in Azure Active Directory, follow these instructions to create one.

This topic concludes with instructions for creating a new Azure AD user that you'll need to access apps running on your Azure Red Hat OpenShift cluster.

If you haven't already created a tenant, follow the directions in [Create a tenant for your Azure OpenShift cluster](howto-create-tenant.md) before continuing with these instructions.

## Create a new app registration

An application that wants to use the capabilities of Azure AD must first be registered in an Azure AD tenant. This registration process involves giving Azure AD details about your application such as the URL where the app is  located, the URL to send replies after a user is authenticated, the URI that identifies the app, and so on.

1. In the [Azure portal](https://portal.azure.com), ensure that your tenant appears under your user name in the top right of the portal:
![Screenshot of portal with tenant listed in top right][tenantcallout]
If the wrong tenant is displayed, click on your user name in the top right, then click **Switch Directory**, and select the correct tenant from the **All Directories** list.
2. Go to the [App registrations blade](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
3. The **App registrations** blade appears. Click **+New application registration**.
4. In the **Create** pane, enter a friendly name for your application object.
5. Ensure that **Application type** is set to **Web app/API**.
6. Create a **Sign-on URL** comprised of the name you'll use when you create your cluster, the location of the cluster, and append `.cloudapp.azure.com` For example, if your cluster name is going to be `mycluster` (the cluster name must be all lowercase), and you will be creating it in the `eastus` region, the fully-qualified domain name (FQDN) that you'll enter for the **Sign-on URL** would be `https://mycluster.eastus.cloudapp.azure.com`

> [!IMPORTANT]
> The cluster name must be all lowercase

> [!IMPORTANT]
> This FQDN URL needs to be unique. Choose a unique cluster name because that is the part of the FQDN that you have most control over.

Remember the cluster name and this URL because you'll need it to access the app running on your cluster.
We will refer to the cluster name as `CLUSTER_NAME`, and this sign-on URL as `FQDN` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial. Write these two values down so you can provide them in the tutorial.

7. Press Tab to move focus out of the **Sign-on URL** field to validate the URL. A green check should appear in the right of the Sign-on URL checkbox.
8. At the bottom of the Create pane, click **Create** to create the Azure AD application object.
9. On the **Registered App** page that appears, copy the **Application ID** and save it where you can refer to it later. We will refer to this value as `APPID` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.
![Screenshot of the application id textbox][appidimage]

For more information about Azure Application Objects, see [Application and service principal objects in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals).
Refer to [Register an app with the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app) if you want more detailed instructions about creating a new Azure AD application.

### Create a client secret

1. While still on the **Registered App** page from the previous step, click on **Settings** to open the settings for your registered app.
2. On the **Settings** pane that appears, click **Keys**.  The **Keys** pane appears.
![Screenshot of the create key page in the portal][createkeyimage]
3. Provide a **Key description**.
4. Set the expiration duration to **In 2 years**
5. Click **Save** and the key value will appear.
6. Make a copy of the key value. We will refer to this value as `SECRET` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

### Create a Reply URL

Azure AD uses the app object reply URL to specify the callback to use when authorizing the app. In the case of a web API or web application, the Reply URL is the location to which Azure AD will send the authentication response, including a token if the authentication was successful.

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

[Applications and service principals](https://docs.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals)  
[Register an app with the Azure Active Directory v1.0 endpoint](https://docs.microsoft.com/azure/active-directory/develop/quickstart-v1-add-azure-ad-app)  

[appidimage]: ./media/howto-create-tenant/get-app-id.png
[createkeyimage]: ./media/howto-create-tenant/create-key.png
[tenantcallout]: ./media/howto-create-tenant/tenant-callout.png

## Next steps

Try the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.