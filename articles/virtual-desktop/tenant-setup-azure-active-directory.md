---
title: Create a tenant in Windows Virtual Desktop Preview - Azure
description: Describes how to set up Windows Virtual Desktop Preview tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 03/21/2019
ms.author: helohr
---
# Tutorial: Create a tenant in Windows Virtual Desktop Preview

Creating a tenant in Windows Virtual Desktop Preview is the first step toward building your desktop virtualization solution. A tenant is a group of one or more host pools. Each host pool consists of multiple session hosts, running as virtual machines in Azure and registered to the Windows Virtual Desktop service. Each host pool also consists of one or more app groups that are used to publish remote desktop and remote application resources to users. With a tenant, you can build host pools, create app groups, assign users, and make connections through the service.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Grant Azure Active Directory permissions to the Windows Virtual Desktop service.
> * Assign the TenantCreator application role to a user in your Azure Active Directory tenant.
> * Create a Windows Virtual Desktop tenant.

Here's what you need to set up your Windows Virtual Desktop tenant:

* The [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) tenant ID for Windows Virtual Desktop users.
* A global administrator account within the Azure Active Directory tenant.
   * This also applies to Cloud Solution Provider (CSP) organizations that are creating a Windows Virtual Desktop tenant for their customers. If you're in a CSP organization, you must be able to sign in as global administrator of the customer's Azure Active Directory instance.
   * The administrator account must be sourced from the Azure Active Directory tenant in which you're trying to create the Windows Virtual Desktop tenant. This process doesn't support Azure Active Directory B2B (guest) accounts.
   * The administrator account must be a work or school account.
* An Azure subscription.

## Grant Azure Active Directory permissions to the Windows Virtual Desktop Preview service

If you have already granted permissions to Windows Virtual Desktop for this Azure Active Directory instance, skip this section.

Granting permissions to the Windows Virtual Desktop service lets it query Azure Active Directory for administrative and end-user tasks.

To grant the service permissions:

1. Open a browser and connect to the [Windows Virtual Desktop consent page](https://rdweb.wvd.microsoft.com).
2. For **Consent Option** > **Server App**, enter the Azure Active Directory tenant name or Directory ID, and then select **Submit**.
        
   For Cloud Solution Provider customers, the ID is the customer's Microsoft ID from the Partner Portal. For Enterprise customers, the ID is located under **Azure Active Directory** > **Properties** > **Directory ID**.
3. Sign in to the Windows Virtual Desktop consent page with a global administrator account. For example, if you were with the Contoso organization, your account might be admin@contoso.com or admin@contoso.onmicrosoft.com.  
4. Select **Accept**.
5. Wait for one minute.
6. Go back to the [Windows Virtual Desktop consent page](https://rdweb.wvd.microsoft.com).
7. Go to **Consent Option** > **Client App**, enter the same Azure Active Directory tenant name or Directory ID, and then select **Submit**.
8. Sign in to the Windows Virtual Desktop consent page as global administrator, as you did in step 3.
9. Select **Accept**.

## Assign the TenantCreator application role to a user in your Azure Active Directory tenant

Assigning an Azure Active Directory user the TenantCreator application role allows that user to create a Windows Virtual Desktop tenant associated with the Azure Active Directory instance. You'll need to use your global administrator account to assign the TenantCreator role.

To assign the TenantCreator application role:

1. Open a browser and connect to the [Azure portal](https://portal.azure.com) with your global administrator account.
   
   If you're working with multiple Azure Active Directory tenants, it's a best practice to open a private browser session and copy and paste the URLs into the address bar.
2. In the search bar within the Azure portal, search for **Enterprise applications** and select the entry that appears under the **Services** category.
3. Within **Enterprise applications**, search for **Windows Virtual Desktop**. You'll see the two applications that you provided consent for in the previous section. Of these two apps, select **Windows Virtual Desktop**.
   ![A screenshot of the search results when searching for "Windows Virtual Desktop" in "Enterprise applications." The app named "Windows Virtual Desktop" is highlighted.](media/tenant-enterprise-app.png)
4. Select **Users and groups**. You might see that the administrator who granted consent to the application is already listed with the **Default Access** role assigned. This is not enough to create a Windows Virtual Desktop tenant. Continue following these instructions to add the **TenantCreator** role to a user.
   ![A screenshot of the users and groups assigned to manage the "Windows Virtual Desktop" enterprise application. The screenshot shows only one assignment, which is for "Default Access."](media/tenant-default-access.png)
5. Select **Add user**, and then select **Users and groups** in the **Add Assignment** blade.
6. Search for a user account that will create your Windows Virtual Desktop tenant. For simplicity, this can be the global administrator account.

   ![A screenshot of selecting a user to add as "TenantCreator."](media/tenant-assign-user.png)

   > [!NOTE]
   > You must select a user (or a group that contains a user) that's sourced from this Azure Active Directory instance. You can't choose a guest (B2B) user or a service principal.

7. Select the user account, choose the **Select** button, and then select **Assign**.
8. On the **Windows Virtual Desktop - Users and groups** page, verify that you see a new entry with the **TenantCreator** role assigned to the user who will create the Windows Virtual Desktop tenant.
   ![A screenshot of the users and groups assigned to manage the "Windows Virtual Desktop" enterprise application. The screenshot now includes a second entry of a user assigned to the "TenantCreator" role.](media/tenant-tenant-creator-added.png)

Before you continue on to create your Windows Virtual Desktop tenant, you need two pieces of information:
- Your Azure Active Directory tenant ID (or **Directory ID**)
- Your Azure subscription ID

To find your Azure Active Directory tenant ID (or **Directory ID**):
1. In the same Azure portal session, search for **Azure Active Directory** in the search bar and select the entry that appears under the **Services** category.
   ![A screenshot of the search results for "Azure Active Directory" in the Azure portal. The search result under "Services" is highlighted.](media/tenant-search-azure-active-directory.png)
2. Scroll down until you find **Properties**, and then select it.
3. Look for **Directory ID**, and then select the clipboard icon. Paste it in a handy location so you can use it later as the **AadTenantId** value.
   ![A screenshot of the Azure Active Directory properties. The mouse is hovering over the clipboard icon for "Directory ID" to copy and paste.](media/tenant-directory-id.png)

To find your Azure subscription ID:
1. In the same Azure portal session, search for **Subscriptions** in the search bar and select the entry that appears under the **Services** category.
   ![A screenshot of the search results for "Azure Active Directory" in the Azure portal. The search result under "Services" is highlighted.](media/tenant-search-subscription.png)
2. Select the Azure subscription you want to use to receive Windows Virtual Desktop service notifications.
3. Look for **Subscription ID**, and then hover over the value until a clipboard icon appears. Select the clipboard icon and paste it in a handy location so you can use it later as the **AzureSubscriptionId** value.
   ![A screenshot of the Azure subscription properties. The mouse is hovering over the clipboard icon for "Subscription ID" to copy and paste.](media/tenant-subscription-id.png)

## Create a Windows Virtual Desktop Preview tenant

Now that you've granted the Windows Virtual Desktop service permissions to query Azure Active Directory and assigned the TenantCreator role to a user account, you can create a Windows Virtual Desktop tenant.

First, [download and import the Windows Virtual Desktop module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

Sign in to Windows Virtual Desktop by using the TenantCreator user account with this cmdlet:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

After that, create a new Windows Virtual Desktop tenant associated with the Azure Active Directory tenant:

```powershell
New-RdsTenant -Name <TenantName> -AadTenantId <DirectoryID> -AzureSubscriptionId <SubscriptionID>
```

Replace the bracketed values with values relevant to your organization and tenant. The name you choose for your new Windows Virtual Desktop tenant should be globally unique. For example, let's say you're the Windows Virtual Desktop TenantCreator for the Contoso organization. The cmdlet you'd run would look like this:

```powershell
New-RdsTenant -Name Contoso -AadTenantId 00000000-1111-2222-3333-444444444444 -AzureSubscriptionId 55555555-6666-7777-8888-999999999999
```

## Next steps

After you've created your tenant, you'll need to create a service principal in Azure Active Directory and assign it a role within Windows Virtual Desktop. The service principal will allow you to successfully deploy the Windows Virtual Desktop Azure Marketplace offering to create a host pool. To learn more about host pools, continue to the tutorial for creating a host pool in Windows Virtual Desktop.

> [!div class="nextstepaction"]
> [Create service principals and role assignments with PowerShell](./create-service-principal-role-powershell.md)
