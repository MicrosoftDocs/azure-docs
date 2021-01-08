---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/25/2019
 ms.author: cynthn
 ms.custom: include file
---


But, if you want to share images outside of your Azure tenant, at scale, you should create an app registration to facilitate sharing.  Using an app registration can enable more complex sharing scenarios, like: 

* Managing shared images when one company acquires another, and the Azure infrastructure is spread across separate tenants. 
* Azure Partners manage Azure infrastructure on behalf of their customers. Customization of images is done within the partners tenant, but the infrastructure deployments will happen in the customer's tenant. 


## Create the app registration

Create an application registration that will be used by both tenants to share the image gallery resources.
1. Open the [App registrations (preview) in the Azure portal](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade/quickStartType//sourceType/).    
1. Select **New registration** from the menu at the top of the page.
1. In **Name**, type *myGalleryApp*.
1. In **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
1. In **Redirect URI**, type *https://www.microsoft.com* and then select **Register**. After the app registration has been created, the overview page will open.
1. On the overview page, copy the **Application (client) ID** and save for use later.   
1. Select **Certificates & secrets**, and then select **New client secret**.
1. In **Description**, type *Shared image gallery cross-tenant app secret*.
1. In **Expires**, leave the default of **In 1 year** and then select **Add**.
1. Copy the value of the secret and save it to a safe place. You cannot retrieve it after you leave the page.


Give the app registration permission to use the shared image gallery.
1. In the Azure portal, select the Shared Image Gallery that you want to share with another tenant.
1. Select **select Access control (IAM)**, and under **Add role assignment** select *Add*. 
1. Under **Role**, select **Reader**.
1. Under **Assign access to:**, leave this as **Azure AD user, group, or service principal**.
1. Under **Select**, type *myGalleryApp* and select it when it shows up in the list. When you are done, select **Save**.


## Give Tenant 2 access

Give Tenant 2 access to the application by requesting a sign-in using a browser. Replace *\<Tenant2 ID>* with the tenant ID for the tenant that you would like to share your image gallery with. Replace *\<Application (client) ID>* with the application ID of the app registration you created. When done making the replacements, paste the URL into a browser and follow the sign-in prompts to sign into Tenant 2.

```
https://login.microsoftonline.com/<Tenant 2 ID>/oauth2/authorize?client_id=<Application (client) ID>&response_type=code&redirect_uri=https%3A%2F%2Fwww.microsoft.com%2F 
```

In the [Azure portal](https://portal.azure.com) sign in as Tenant 2 and give the app registration access to the resource group where you want to create the VM.

1. Select the resource group and then select **Access control (IAM)**. Under **Add role assignment** select **Add**. 
1. Under **Role**, type **Contributor**.
1. Under **Assign access to:**, leave this as **Azure AD user, group, or service principal**.
1. Under **Select** type *myGalleryApp* then select it when it shows up in the list. When you are done, select **Save**.

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.

