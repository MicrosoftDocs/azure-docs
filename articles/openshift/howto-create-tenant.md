---
title: Create an Azure AD tenant for Azure Red Hat OpenShift | Microsoft Docs
description: Here's how to create an Azure Active Directory (Azure AD) tenant to host your Microsoft Azure Red Hat OpenShift cluster.
author: jimzim
ms.author: jzim
ms.service: container-service
manager: jeconnoc
ms.topic: conceptual
ms.date: 05/13/2019
---

# Create an Azure AD tenant for Azure Red Hat OpenShift

Microsoft Azure Red Hat OpenShift requires an [Azure Active Directory (Azure AD)](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) tenant in which to create your cluster. A *tenant* is a dedicated instance of Azure AD that an organization or app developer receives when they create a relationship with Microsoft by signing up for Azure, Microsoft Intune, or Microsoft 365. Each Azure AD tenant is distinct and separate from other Azure AD tenants and has its own work and school identities and app registrations.

If you don't already have an Azure AD tenant, follow these instructions to create one.

## Create a new Azure AD tenant

To create a tenant:

1. Sign in to the [Azure portal](https://portal.azure.com/) using the account you wish to associate with your Azure Red Hat OpenShift cluster.
2. Open the [Azure Active Directory blade](https://portal.azure.com/#create/Microsoft.AzureActiveDirectory) to create a new tenant (also known as a new *Azure Active Directory*).
3. Provide an **Organization name**.
4. Provide an **Initial domain name**. This will have *onmicrosoft.com* appended to it. You can reuse the value for *Organization name* here.
5. Choose a country or region where the tenant will be created.
6. Click **Create**.
7. After your Azure AD tenant is created, select the **Click here to manage your new directory** link. Your new tenant name should be displayed in the upper-right of the Azure portal:  

    ![Screenshot of the portal showing the tenant name in the upper-right][tenantcallout]  

8. Make note of the *tenant ID* so you can later specify where to create your Azure Red Hat OpenShift cluster. In the portal, you should now see the Azure Active Directory overview blade for your new tenant. Select **Properties** and copy the value for your **Directory ID**. We will refer to this value as `TENANT` in the [Create an Azure Red Hat OpenShift cluster](tutorial-create-cluster.md) tutorial.

[tenantcallout]: ./media/howto-create-tenant/tenant-callout.png

## Resources

Check out [Azure Active Directory documentation](https://docs.microsoft.com/azure/active-directory/) for more info on [Azure AD tenants](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant).

## Next steps

Learn how to create a service principal, generate a client secret and authentication callback URL, and create a new Active Directory user for testing apps on your Azure Red Hat OpenShift cluster.

[Create an Azure AD app object and user](howto-aad-app-configuration.md)