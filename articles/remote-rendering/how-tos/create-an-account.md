---
title: Create an Azure Remote Rendering account
description: Describes the steps to create an account for Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: how-to
ms.custom: subject-rbac-steps
---

# Create an Azure Remote Rendering account

This chapter guides you through the steps to create an account for the **Azure Remote Rendering** service. A valid account is mandatory for completing any of the quickstarts or tutorials.

## Create an account

The following steps are needed to create an account for the Azure Remote Rendering service:

1. Go to the Azure portal [portal.azure.com](https://portal.azure.com/)
1. Click the 'Create a resource' button
1. In the search field ("Search the marketplace"), type in "Remote Rendering" and hit 'enter'.
1. In the result list, click on the "Remote Rendering" tile
1. In the next screen, click the "Create" button. A form opens to create a new Remote Rendering account:
    1. Set 'Resource Name' to the name of the account
    1. Update 'Subscription' if needed
    1. Set 'Resource group' to a resource group of your choice
    1. Select a region from the 'Location' dropdown where this resource should be created in. See remarks on [account regions](create-an-account.md#account-regions).
1. Once the account is created, navigate to it and:
    1. In the *Overview* tab, note the 'Account ID'
    1. In the *Settings > Access Keys* tab, note the 'Primary key' - this value is the account's secret account key
    1. Make sure, that in the *Settings > Identity* tab, the option *System assigned > Status* is turned on.

:::image type="content" source="./media/azure-identity-add.png" alt-text="Screenshot of Remote Rendering Account Page in sub menu settings, identity, with the option System assigned status turned on.":::

### Account regions
The location that is specified during account creation time of an account determines which region the account resource is assigned to. The location can't be changed after creation. However, the account can be used to connect to a Remote Rendering session in any [supported region](./../reference/regions.md), regardless of the account's location.

### Retrieve the account information

The samples and tutorials require that you provide the account ID and a key. For instance in the **arrconfig.json** file that is used for the PowerShell sample scripts:

```json
"accountSettings": {
    "arrAccountId": "<fill in the account ID from the Azure portal>",
    "arrAccountKey": "<fill in the account key from the Azure portal>",
    "arrAccountDomain": "<select from available regions: australiaeast, eastus, eastus2, japaneast, northeurope, southcentralus, southeastasia, uksouth, westeurope, westus2 or specify the full url>"
},
```

See the [list of available regions](../reference/regions.md) for filling out the *arrAccountDomain* option.

The values for **`arrAccountId`** and **`arrAccountKey`** can be found in the portal as described in the following steps:

* Go to the [Azure portal](https://www.portal.azure.com)
* Find your **"Remote Rendering Account"** - it should be in the **"Recent Resources"** list. You can also search for it in the search bar at the top. In that case, make sure that the subscription you want to use is selected in the Default subscription filter (filter icon next to search bar):

:::image type="content" source="./media/azure-subscription-filter.png" alt-text="Screenshot of the Azure portal Subscription filter list.":::

Clicking on your account brings you to this screen, which shows the **Account ID** right away:

:::image type="content" source="./media/azure-account-id.png" alt-text="Screenshot of the Remote Rendering Account in the Overview sub menu.":::

For the key, select **Access Keys** in the panel on the left. The next page shows a primary and a secondary key:

:::image type="content" source="./media/azure-account-primary-key.png" alt-text="Screenshot of the Remote Rendering Account in the Access Keys sub menu.":::

The value for **`arrAccountKey`** can either be primary or secondary key.

## Link storage accounts

This paragraph explains how to link storage accounts to your Remote Rendering account. With a linked account, it isn't necessary anymore to generate a SAS URI every time you want to interact with the data in your account. Instead, you can use the storage account names directly as described in the [loading a model section](../concepts/models.md#loading-models).

The steps in this paragraph have to be performed for each storage account that should use this access method. If you haven't created storage accounts yet, you can walk through the respective step in the [convert a model for rendering quickstart](../quickstarts/convert-model.md#storage-account-creation).

1. Navigate to your storage account in the Azure portal

2. Select **Access control (IAM)**.

3. Select **Add** > **Add role assignment** to open the **Add role assignment** page.

   If the **Add a role assignment** option is disabled, you probably don't have owner permissions to this storage account.

4. Assign the following role. For detailed steps, see [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
   1. Select the **Storage Blob Data Contributor** role and click **Next**.
   1. Choose to assign access to a **Managed Identity**.
   1. Select **Select members**, select your subscription, select **Remote Rendering Account**, select your remote rendering account, and then click **Select**.
   1. Select **Review + assign** and select **Review + assign** again.

    ![Screenshot showing Add role assignment page in Azure portal.](../../../includes/role-based-access-control/media/add-role-assignment-page.png)

> [!WARNING]
> If your Remote Rendering account is not listed, refer to this [troubleshoot section](../resources/troubleshoot.md#cant-link-storage-account-to-arr-account).

> [!IMPORTANT]
> Azure role assignments are cached by Azure Storage, so there may be a delay of up to 30 minutes between when you grant access to your remote rendering account and when it can be used to access your storage account. See the [Azure role-based access control (Azure RBAC) documentation](../../role-based-access-control/troubleshooting.md#symptom---role-assignment-changes-are-not-being-detected) for details.

## Next steps

* [Authentication](authentication.md)
* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)
