---
title: Manage an Azure Automation Run As account
description: This article tells how to manage your Run As account with PowerShell or from the Azure portal.
services: automation
ms.subservice: shared-capabilities
ms.date: 06/26/2020
ms.topic: conceptual
---

# Manage an Azure Automation Run As account

Run As accounts in Azure Automation provide authentication for managing resources in Azure using the Azure cmdlets. When you create a Run As account, it creates a new service principal user in Azure Active Directory (AD) and assigns the Contributor role to this user at the subscription level.

## Types of Run As accounts

Azure Automation uses two types of Run As accounts:

* Azure Run As account
* Azure Classic Run As account

>[!NOTE]
>Azure Cloud Solution Provider (CSP) subscriptions support only the Azure Resource Manager model. Non-Azure Resource Manager services are not available in the program. When you are using a CSP subscription, the Azure Classic Run As account is not created, but the Azure Run As account is created. To learn more about CSP subscriptions, see [Available services in CSP subscriptions](https://docs.microsoft.com/azure/cloud-solution-provider/overview/azure-csp-available-services).

The service principal for a Run as Account does not have permissions to read Azure AD by default. If you want to add permissions to read or manage Azure AD, you'll need to grant the permissions on the service principal under **API permissions**. To learn more, see [Add permissions to access web APIs](../active-directory/develop/quickstart-configure-app-access-web-apis.md#add-permissions-to-access-web-apis).

### Run As account

The Run As account manages [Resource Manager deployment model](../azure-resource-manager/management/deployment-models.md) resources. It does the following tasks.

* Creates an Azure AD application with a self-signed certificate, creates a service principal account for the application in Azure AD, and assigns the Contributor role for the account in your current subscription. You can change the certificate setting to Owner or any other role. For more information, see [Role-based access control in Azure Automation](automation-role-based-access-control.md).
  
* Creates an Automation certificate asset named `AzureRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key that the Azure AD application uses.
  
* Creates an Automation connection asset named `AzureRunAsConnection` in the specified Automation account. The connection asset holds the application ID, tenant ID, subscription ID, and certificate thumbprint.

### Azure Classic Run As Account

The Azure Classic Run As account manages [Classic deployment model](../azure-resource-manager/management/deployment-models.md) resources. You must be a co-administrator on the subscription to create or renew this type of account.

The Azure Classic Run As account performs the following tasks.

  * Creates a management certificate in the subscription.

  * Creates an Automation certificate asset named `AzureClassicRunAsCertificate` in the specified Automation account. The certificate asset holds the certificate private key used by the management certificate.

  * Creates an Automation connection asset named `AzureClassicRunAsConnection` in the specified Automation account. The connection asset holds the subscription name, subscription ID, and certificate asset name.

>[!NOTE]
>Azure Classic Run As account is not created by default at the same time when you create an Automation account. This account is created individually following the steps described later in this article.

## <a name="permissions"></a>Obtain Run As account permissions

This section defines permissions for both regular Run As accounts and Classic Run As accounts.

### Get permissions to configure Run As accounts

To create or update a Run As account, you must have specific privileges and permissions. An Application administrator in Azure Active Directory and an Owner in a subscription can complete all the tasks. In a situation where you have separation of duties, the following table shows a listing of the tasks, the equivalent cmdlet, and permissions needed:

|Task|Cmdlet  |Minimum Permissions  |Where you set the permissions|
|---|---------|---------|---|
|Create Azure AD Application|[New-AzADApplication](https://docs.microsoft.com/powershell/module/az.resources/new-azadapplication)     | Application Developer role<sup>1</sup>        |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations |
|Add a credential to the application.|[New-AzADAppCredential](https://docs.microsoft.com/powershell/module/az.resources/new-azadappcredential)     | Application Administrator or Global Administrator<sup>1</sup>         |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations|
|Create and get an Azure AD service principal|[New-AzADServicePrincipal](https://docs.microsoft.com/powershell/module/az.resources/new-azadserviceprincipal)</br>[Get-AzADServicePrincipal](https://docs.microsoft.com/powershell/module/az.resources/get-azadserviceprincipal)     | Application Administrator or Global Administrator<sup>1</sup>        |[Azure AD](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app)</br>Home > Azure AD > App Registrations|
|Assign or get the RBAC role for the specified principal|[New-AzRoleAssignment](https://docs.microsoft.com/powershell/module/az.resources/new-azroleassignment)</br>[Get-AzRoleAssignment](https://docs.microsoft.com/powershell/module/Az.Resources/Get-AzRoleAssignment)      | User Access Administrator or Owner, or have the following permissions:</br></br><code>Microsoft.Authorization/Operations/read</br>Microsoft.Authorization/permissions/read</br>Microsoft.Authorization/roleDefinitions/read</br>Microsoft.Authorization/roleAssignments/write</br>Microsoft.Authorization/roleAssignments/read</br>Microsoft.Authorization/roleAssignments/delete</code></br></br> | [Subscription](../role-based-access-control/role-assignments-portal.md)</br>Home > Subscriptions > \<subscription name\> - Access Control (IAM)|
|Create or remove an Automation certificate|[New-AzAutomationCertificate](https://docs.microsoft.com/powershell/module/Az.Automation/New-AzAutomationCertificate)</br>[Remove-AzAutomationCertificate](https://docs.microsoft.com/powershell/module/az.automation/remove-azautomationcertificate)     | Contributor on resource group         |Automation account resource group|
|Create or remove an Automation connection|[New-AzAutomationConnection](https://docs.microsoft.com/powershell/module/az.automation/new-azautomationconnection)</br>[Remove-AzAutomationConnection](https://docs.microsoft.com/powershell/module/az.automation/remove-azautomationconnection)|Contributor on resource group |Automation account resource group|

<sup>1</sup> Non-administrator users in your Azure AD tenant can [register AD applications](../active-directory/develop/howto-create-service-principal-portal.md#permissions-required-for-registering-an-app) if the Azure AD tenant's **Users can register applications** option on the User settings page is set to **Yes**. If the application registration setting is **No**, the user performing this action must be as defined in this table.

If you aren't a member of the subscription's Active Directory instance before you're added to the Global Administrator role of the subscription, you're added as a guest. In this situation, you receive a `You do not have permissions to create…` warning on the **Add Automation Account** page.

If you are a member of the subscription's Active Directory instance when the Global Administrator role is assigned, you can also receive a `You do not have permissions to create…` warning on the **Add Automation Account** page. In this case, you can request removal from the subscription's Active Directory instance and then request to be re-added, so that you become a full user in Active Directory.

To verify that the situation producing the error message has been remedied:

1. From the Azure Active Directory pane in the Azure portal, select **Users and groups**.
2. Select **All users**.
3. Choose your name, then select **Profile**. 
4. Ensure that the value of the **User type** attribute under your user's profile is not set to **Guest**.

### <a name="permissions-classic"></a>Get permissions to configure Classic Run As accounts

To configure or renew Classic Run As accounts, you must have the Co-administrator role at the subscription level. To learn more about classic subscription permissions, see [Azure classic subscription administrators](../role-based-access-control/classic-administrators.md#add-a-co-administrator).

## Create a Run As account in Azure portal

Perform the following steps to update your Azure Automation account in the Azure portal. Create the Run As and Classic Run As accounts individually. If you don't need to manage classic resources, you can just create the Azure Run As account.

1. Log in to the Azure portal with an account that is a member of the Subscription Admins role and co-administrator of the subscription.

2. Search for and select **Automation Accounts**.

3. On the Automation Accounts page, select your Automation account from the list.

4. In the left pane, select **Run As Accounts** in the account settings section.

5. Depending on which account you require, select either **Azure Run As Account** or **Azure Classic Run As Account**. 

6. Depending on the account of interest, use the **Add Azure Run As** or **Add Azure Classic Run As Account** pane. After reviewing the overview information, click **Create**.

7. While Azure creates the Run As account, you can track the progress under **Notifications** from the menu. A banner is also displayed stating that the account is being created. The process can take a few minutes to complete.

## Delete a Run As or Classic Run As account

This section describes how to delete a Run As or Classic Run As account. When you perform this action, the Automation account is retained. After you delete the account, you can re-create it in the Azure portal.

1. In the Azure portal, open the Automation account.

2. In the left pane, select **Run As Accounts** in the account settings section.

3. On the Run As Accounts properties page, select either the Run As account or Classic Run As account that you want to delete. 

4. On the Properties pane for the selected account, click **Delete**.

   ![Delete Run As account](media/manage-runas-account/automation-account-delete-runas.png)

5. While the account is being deleted, you can track the progress under **Notifications** from the menu.

6. After the account has been deleted, you can re-create it on the Run As Accounts properties page by selecting the create option **Azure Run As Account**.

   ![Re-create the Automation Run As account](media/manage-runas-account/automation-account-create-runas.png)

## <a name="cert-renewal"></a>Renew a self-signed certificate

The self-signed certificate that you have created for the Run As account expires one year from the date of creation. At some point before your Run As account expires, you must renew the certificate. You can renew it any time before it expires. 

When you renew the self-signed certificate, the current valid certificate is retained to ensure that any runbooks that are queued up or actively running, and that authenticate with the Run As account, aren't negatively affected. The certificate remains valid until its expiration date.

>[!NOTE]
>If you think that the Run As account has been compromised, you can delete and re-create the self-signed certificate.

>[!NOTE]
>If you have configured your Run As account to use a certificate issued by your enterprise certificate authority and you use the option to renew a self-signed certificate option, the enterprise certificate is replaced by a self-signed certificate.

Use the following steps to renew the self-signed certificate.

1. In the Azure portal, open the Automation account.

1. Select **Run As Accounts** in the account settings section.

    ![Automation account properties pane](media/manage-runas-account/automation-account-properties-pane.png)

1. On the Run As Accounts properties page, select either the Run As account or the Classic Run As account for which to renew the certificate.

1. On the properties pane for the selected account, click **Renew certificate**.

    ![Renew certificate for Run As account](media/manage-runas-account/automation-account-renew-runas-certificate.png)

1. While the certificate is being renewed, you can track the progress under **Notifications** from the menu.

## Limit Run As account permissions

To control the targeting of Automation against resources in Azure, you can run the [Update-AutomationRunAsAccountRoleAssignments.ps1](https://aka.ms/AA5hug8) script. This script changes your existing Run As account service principal to create and use a custom role definition. The role has permissions for all resources except [Key Vault](https://docs.microsoft.com/azure/key-vault/).

>[!IMPORTANT]
>After you run the **Update-AutomationRunAsAccountRoleAssignments.ps1** script, runbooks that access Key Vault through the use of Run As accounts no longer work. Before running the script, you should review runbooks in your account for calls to Azure Key Vault. To enable access to Key Vault from Azure Automation runbooks, you must [add the Run As account to Key Vault's permissions](#add-permissions-to-key-vault).

If you need to restrict,  further what the Run As service principal can do, you can add other resource types to the `NotActions` element of the custom role definition. The following example restricts access to `Microsoft.Compute/*`. If you add this resource type to `NotActions` for the role definition, the role will not be able to access any Compute resource. To learn more about role definitions, see [Understand role definitions for Azure resources](../role-based-access-control/role-definitions.md).

```powershell
$roleDefinition = Get-AzRoleDefinition -Name 'Automation RunAs Contributor'
$roleDefinition.NotActions.Add("Microsoft.Compute/*")
$roleDefinition | Set-AzRoleDefinition
```

You can determine if the service principal used by your Run As account is in the Contributor role definition or a custom one. 

1. Go to your Automation account and select **Run As Accounts** in the account settings section.
2. Select **Azure Run As Account**. 
3. Select **Role** to locate the role definition that is being used.

[![](media/manage-runas-account/verify-role.png "Verify the Run As Account role")](media/manage-runas-account/verify-role-expanded.png#lightbox)

You can also determine the role definition used by the Run As accounts for multiple subscriptions or Automation accounts. Do this by using the [Check-AutomationRunAsAccountRoleAssignments.ps1](https://aka.ms/AA5hug5) script in the PowerShell Gallery.

### Add permissions to Key Vault

You can allow Azure Automation to verify if Key Vault and your Run As account service principal are using a custom role definition. You must:

* Grant permissions to Key Vault.
* Set the access policy.

You can use the [Extend-AutomationRunAsAccountRoleAssignmentToKeyVault.ps1](https://aka.ms/AA5hugb) script in the PowerShell Gallery to give your Run As account permissions to Key Vault. See [Grant applications access to a key vault](../key-vault/general/group-permissions-for-apps.md) for more details on setting permissions on Key Vault.

## Resolve misconfiguration issues for Run As accounts

Some configuration items necessary for a Run As or Classic Run As account might have been deleted or created improperly during initial setup. Possible instances of misconfiguration include:

* Certificate asset
* Connection asset
* Run As account removed from the Contributor role
* Service principal or application in Azure AD

For such misconfiguration instances, the Automation account detects the changes and displays a status of *Incomplete* on the Run As Accounts properties pane for the account.

![Incomplete Run As account configuration status](media/manage-runas-account/automation-account-runas-incomplete-config.png)

When you select the Run As account, the account properties pane displays the following error message:

```text
The Run As account is incomplete. Either one of these was deleted or not created - Azure Active Directory Application, Service Principal, Role, Automation Certificate asset, Automation Connect asset - or the Thumbprint is not identical between Certificate and Connection. Please delete and then re-create the Run As Account.
```

You can quickly resolve these Run As account issues by deleting and re-creating the account.

## Next steps

* [Application Objects and Service Principal Objects](../active-directory/develop/app-objects-and-service-principals.md).
* [Certificates overview for Azure Cloud Services](../cloud-services/cloud-services-certs-create.md).
