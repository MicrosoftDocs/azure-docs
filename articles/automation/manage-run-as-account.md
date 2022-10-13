---
title: Manage an Azure Automation Run As account
description: This article tells how to manage your Azure Automation Run As account with PowerShell or from the Azure portal.
services: automation
ms.subservice:
ms.date: 08/02/2021
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Manage an Azure Automation Run As account

> [!IMPORTANT]
> Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities. Before that date, you'll need to start migrating your runbooks to use [managed identities](automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](https://learn.microsoft.com/azure/automation/migrate-run-as-accounts-managed-identity?tabs=run-as-account#sample-scripts) to start migrating the runbooks from Run As account to managed identities before 30 September 2023.



Run As accounts in Azure Automation provide authentication for managing resources on the Azure Resource Manager or Azure Classic deployment model using Automation runbooks and other Automation features. 

In this article we cover how to manage a Run as or Classic Run As account, including:

   * How to renew a self-signed certificate
   * How to renew a certificate from an enterprise or third-party certificate authority (CA)
   * Manage permissions for the Run As account

To learn more about Azure Automation account authentication, permissions required to manage the Run as account, and guidance related to process automation scenarios, see [Automation Account authentication overview](automation-security-overview.md).

## <a name="cert-renewal"></a>Renew a self-signed certificate

The self-signed certificate that you have created for the Run As account expires one year from the date of creation. At some point before your Run As account expires, you must renew the certificate. You can renew it any time before it expires.

When you renew the self-signed certificate, the current valid certificate is retained to ensure that any runbooks that are queued up or actively running, and that authenticate with the Run As account, aren't negatively affected. The certificate remains valid until its expiration date.

>[!NOTE]
>If you think that the Run As account has been compromised, you can delete and re-create the self-signed certificate.

>[!NOTE]
>If you have configured your Run As account to use a certificate issued by your enterprise or third-party CA and you use the option to renew a self-signed certificate option, the enterprise certificate is replaced by a self-signed certificate. To renew your certificate in this case, see [Renew an enterprise or third-party certificate](#renew-an-enterprise-or-third-party-certificate).

Use the following steps to renew the self-signed certificate.

1. Sign-in to the [Azure portal](https://portal.azure.com).

1. Go to your Automation account and select **Run As Accounts** in the account settings section.

    :::image type="content" source="media/manage-run-as-account/automation-account-properties-pane.png" alt-text="Automation account properties pane.":::

1. On the **Run As Accounts** properties page, select either **Run As Account** or **Classic Run As Account** depending on which account you need to renew the certificate for.

1. On the **Properties** page for the selected account, select **Renew certificate**.

    :::image type="content" source="media/manage-run-as-account/automation-account-renew-run-as-certificate.png" alt-text="Renew certificate for Run As account.":::

1. While the certificate is being renewed, you can track the progress under **Notifications** from the menu.

## Renew an enterprise or third-party certificate

Every certificate has a built-in expiration date. If the certificate you assigned to the Run As account was issued by a certification authority (CA), you need to perform a different set of steps to configure the Run As account with the new certificate before it expires. You can renew it any time before it expires.

1. Import the renewed certificate following the steps for [Create a new certificate](./shared-resources/certificates.md#create-a-new-certificate). Automation requires the certificate to have the following configuration:

   * Specify the provider **Microsoft Enhanced RSA and AES Cryptographic Provider**
   * Marked as exportable
   * Configured to use the SHA256 algorithm
   * Saved in the `*.pfx` or `*.cer` format. 

   After you import the certificate, note or copy the certificate **Thumbprint** value. This value is used to update the Run As connection properties with the new certificate. 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Search for and select **Automation Accounts**.

1. On the Automation Accounts page, select your Automation account from the list.

1. In the left pane, select **Connections**.

1. On the **Connections** page, select **AzureRunAsConnection** and update the **Certificate Thumbprint** with the new certificate thumbprint.

1. Select **Save** to commit your changes.

## Grant Run As account permissions in other subscriptions

Azure Automation supports using a single Automation account from one subscription, and executing runbooks against Azure Resource Manager resources across multiple subscriptions. This configuration does not support the Azure Classic deployment model.

You assign the Run As account service principal the [Contributor](../role-based-access-control/built-in-roles.md#contributor) role in the other subscription, or more restrictive permissions. For more information, see [Role-based access control](automation-role-based-access-control.md) in Azure Automation. To assign the Run As account to the role in the other subscription, the user account performing this task needs to be a member of the **Owner** role in that subscription.

> [!NOTE]
> This configuration only supports multiple subscriptions of an organization using a common Azure AD tenant.

Before granting the Run As account permissions, you need to first note the display name of the service principal to assign.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From your Automation account, select **Run As Accounts** under **Account Settings**.
1. Select **Azure Run As Account**.
1. Copy or note the value for **Display Name** on the **Azure Run As Account** page.

For detailed steps for how to add role assignments, check out the following articles depending on the method you want to use.

* [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)
* [Assign Azure roles using Azure PowerShell](../role-based-access-control/role-assignments-powershell.md)
* [Assign Azure roles using the Azure CLI](../role-based-access-control/role-assignments-cli.md)
* [Assign Azure roles using the REST API](..//role-based-access-control/role-assignments-rest.md)

After assigning the Run As account to the role, in your runbook specify `Set-AzContext -SubscriptionId "xxxx-xxxx-xxxx-xxxx"` to set the subscription context to use. For more information, see [Set-AzContext](/powershell/module/az.accounts/set-azcontext).

## Check role assignment for Azure Automation Run As account

To check the role assigned to the Automation Run As account Azure AD, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Go to your Automation account and in **Account Settings**, select **Run as accounts**.
1. Select **Azure Run as Account** to view the **Application ID**.

    :::image type="content" source="media/manage-run-as-account/automation-run-as-app-id.png" alt-text="Screenshot that describes on how to copy application ID.":::

1. Go to Azure portal and search for **Azure Active Directory**.
1. On the **Active Directory Overview** page, **Overview** tab, in the search box, enter the Application ID.  

    :::image type="content" source="media/manage-run-as-account/active-directory-app-id-inline.png" alt-text="Screenshot that describes application ID copied in the Overview tab." lightbox="media/manage-run-as-account/active-directory-app-id-expanded.png":::

    In the **Enterprise applications** section, you will see the display name of your Run As Account.

1. Select the application ID and in the properties page of that ID, go to **Overview** blade, **Properties**, and copy the name of the Enterprise application.
1. Go to Azure portal and search for your **Subscription** and select your subscription.
1. Go to **Access Control (IAM)**, **Role Assignment** and paste the name of the Enterprise application in the search box to view the App along with the role and scope assigned to it. 
For example: in the screenshot below, the Run As Account Azure AD App has the Contributor access at the subscription level.

    :::image type="content" source="media/manage-run-as-account/check-role-assignments-inline.png" alt-text="Screenshot that describes how to view the role and scope assigned to the enterprise application."  lightbox="media/manage-run-as-account/check-role-assignments-expanded.png":::


## Limit Run As account permissions

To control the targeting of Automation against resources in Azure, you can run the [Update-AutomationRunAsAccountRoleAssignments.ps1](https://aka.ms/AA5hug8) script. This script changes your existing Run As account service principal to create and use a custom role definition. The role has permissions for all resources except [Key Vault](../key-vault/index.yml).

>[!IMPORTANT]
>After you run the **Update-AutomationRunAsAccountRoleAssignments.ps1** script, runbooks that access Key Vault through the use of Run As accounts no longer work. Before running the script, you should review runbooks in your account for calls to Azure Key Vault. To enable access to Key Vault from Azure Automation runbooks, you must [add the Run As account to Key Vault's permissions](#add-permissions-to-key-vault).

If you need to further restrict what the Run As service principal can do, you can add other resource types to the `NotActions` element of the custom role definition. The following example restricts access to `Microsoft.Compute/*`. If you add this resource type to `NotActions` for the role definition, the role will not be able to access any Compute resource. To learn more about role definitions, see [Understand role definitions for Azure resources](../role-based-access-control/role-definitions.md).

```powershell
$roleDefinition = Get-AzRoleDefinition -Name 'Automation RunAs Contributor'
$roleDefinition.NotActions.Add("Microsoft.Compute/*")
$roleDefinition | Set-AzRoleDefinition
```

You can determine if the service principal used by your Run As account assigned the **Contributor** role or a custom one.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your Automation account and select **Run As Accounts** in the account settings section.
1. Select **Azure Run As Account**.
1. Select **Role** to locate the role definition that is being used.

:::image type="content" source="media/manage-run-as-account/verify-role.png" alt-text="Verify the Run As Account role." lightbox="media/manage-run-as-account/verify-role-expanded.png":::

You can also determine the role definition used by the Run As accounts for multiple subscriptions or Automation accounts. Do this by using the [Check-AutomationRunAsAccountRoleAssignments.ps1](https://aka.ms/AA5hug5) script in the PowerShell Gallery.

### Add permissions to Key Vault

You can allow Azure Automation to verify if Key Vault and your Run As account service principal are using a custom role definition. You must:

* Grant permissions to Key Vault.
* Set the access policy.

You can use the [Extend-AutomationRunAsAccountRoleAssignmentToKeyVault.ps1](https://aka.ms/AA5hugb) script in the PowerShell Gallery to grant your Run As account permissions to Key Vault. See [Assign a Key Vault access policy](../key-vault/general/assign-access-policy-powershell.md) for more details on setting permissions on Key Vault.

## Resolve misconfiguration issues for Run As accounts

Some configuration items necessary for a Run As or Classic Run As account might have been deleted or created improperly during initial setup. Possible instances of misconfiguration include:

* Certificate asset
* Connection asset
* Run As account removed from the Contributor role
* Service principal or application in Azure AD

For such misconfiguration instances, the Automation account detects the changes and displays a status of *Incomplete* on the Run As Accounts properties pane for the account.

:::image type="content" source="media/manage-run-as-account/automation-account-run-as-config-incomplete.png" alt-text="Incomplete Run As account configuration.":::

When you select the Run As account, the account properties pane displays the following error message:

```text
The Run As account is incomplete. Either one of these was deleted or not created - Azure Active Directory Application, Service Principal, Role, Automation Certificate asset, Automation Connect asset - or the Thumbprint is not identical between Certificate and Connection. Please delete and then re-create the Run As Account.
```

You can quickly resolve these Run As account issues by [deleting](delete-run-as-account.md) and [re-creating](create-run-as-account.md) the Run As account.

## Next steps

* [Application Objects and Service Principal Objects](../active-directory/develop/app-objects-and-service-principals.md).
* [Certificates overview for Azure Cloud Services](../cloud-services/cloud-services-certs-create.md).
* To create or re-create a Run As account, see [Create a Run As account](create-run-as-account.md).
* If you no longer need to use a Run As account, see [Delete a Run As account](delete-run-as-account.md).
