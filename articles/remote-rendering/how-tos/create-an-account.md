---
title: Create an Azure Remote Rendering account
description: Describes the steps to create an account for Azure Remote Rendering
author: florianborn71
ms.author: flborn
ms.date: 02/11/2020
ms.topic: how-to
---

# Create an Azure Remote Rendering account

This chapter guides you through the steps to create an account for the **Azure Remote Rendering** service. A valid account is mandatory for completing any of the quickstarts or tutorials.

## Create an account

The following steps are needed to create an account for the Azure Remote Rendering service:

1. Go to the [Mixed Reality Preview page](https://aka.ms/MixedRealityPrivatePreview)
1. Click the 'Create a resource' button
1. In the search field ("Search the marketplace"), type in "Remote Rendering" and hit 'enter'.
1. In the result list, click on the "Remote Rendering" tile
1. In the next screen, click the "Create" button. A form opens to create a new Remote Rendering account:
    1. Set 'Resource Name' to the name of the account
    1. Update 'Subscription' if needed
    1. Set 'Resource group' to a resource group of your choice
    1. Select a region from the 'Location' dropdown where this resource should be created in. See remarks on [account regions](create-an-account.md#account-regions) below.
1. Once the account is created, navigate to it and:
    1. In the *Overview* tab, note the 'Account ID'
    1. In the *Settings > Access Keys* tab, note the 'Primary key' - this is the account's secret account key
    1. Make sure, that in the *Settings > Identity* tab, the option *System assigned > Status* is turned on.

:::image type="content" source="./media/azure-identity-add.png" alt-text="Screenshot of Remote Rendering Account Page in sub menu settings, identity, with the option System assigned status turned on.":::

### Account regions
The location that is specified during account creation time of an account determines which region the account resource is assigned to. This cannot be changed after creation. However, the account can be used to connect to a Remote Rendering session in any [supported region](./../reference/regions.md), regardless of the account's location.

### Retrieve the account information

The samples and tutorials require that you provide the account ID and a key. For instance in the **arrconfig.json** file that is used for the PowerShell sample scripts:

```json
"accountSettings": {
    "arrAccountId": "<fill in the account ID from the Azure portal>",
    "arrAccountKey": "<fill in the account key from the Azure portal>",
    "region": "<select from available regions>"
},
```

See the [list of available regions](../reference/regions.md) for filling out the *region* option.

The values for **`arrAccountId`** and **`arrAccountKey`** can be found in the portal as described in the following steps:

* Go to the [Azure portal](https://www.portal.azure.com)
* Find your **"Remote Rendering Account"** - it should be in the **"Recent Resources"** list. You can also search for it in the search bar at the top. In that case, make sure that the subscription you want to use is selected in the Default subscription filter (filter icon next to search bar):

:::image type="content" source="./media/azure-subscription-filter.png" alt-text="Screenshot of the Azure Portal Subscription filter list.":::

Clicking on your account brings you to this screen, which shows the **Account ID** right away:

:::image type="content" source="./media/azure-account-id.png" alt-text="Screenshot of the Remote Rendering Account in the Overview sub menu.":::

For the key, select **Access Keys** in the panel on the left. The next page shows a primary and a secondary key:

:::image type="content" source="./media/azure-account-primary-key.png" alt-text="Screenshot of the Remote Rendering Account in the Access Keys sub menu.":::

The value for **`arrAccountKey`** can either be primary or secondary key.

## Link storage accounts

This paragraph explains how to link storage accounts to your Remote Rendering account. When a storage account is linked it is not necessary to generate a SAS URI every time you want to interact with the data in your account, for instance when loading a model. Instead, you can use the storage account names directly as described in the [loading a model section](../concepts/models.md#loading-models).

The steps in this paragraph have to be performed for each storage account that should use this access method. If you haven't created storage accounts yet, you can walk through the respective step in the [convert a model for rendering quickstart](../quickstarts/convert-model.md#storage-account-creation).

Now it is assumed you have a storage account. Navigate to the storage account in the portal and go to the **Access Control (IAM)** tab for that storage account:

:::image type="content" source="./media/azure-storage-account.png" alt-text="Screenshot of the Storage Account in the Access control (IAM) sub menu.":::

Ensure you have owner permissions over this storage account to ensure that you can add role assignments. If you don't have access, the **Add a role assignment** option will be disabled.

Click on the **Add** button in the "Add a role assignment" tile to add the role.

:::image type="content" source="./media/azure-add-role-assignment-choose-role.png" alt-text="Screenshot of the Storage Account Add role assignment sub page in the tab Role.":::

Search for the role **Storage Blob Data Contributor** in the list or by typing it in the search field. Select the role by clicking on the item in the list and click **Next**.

:::image type="content" source="./media/azure-add-role-assignment-choose-member.png" alt-text="Screenshot of the Storage Account Add role assignment sub page in the tab Members.":::

Now select the new member for this role assignment:

1. Click **+ Select members**.
2. Search for the account name of your **Remote Rendering Account** in the *Select members* panel and click on the item corresponding to your **Remote Rendering Account** in the list.
3. Confirm your selection with a click on **Select**.
4. Click on **Next** until you are in the **Review + assign** tab.

:::image type="content" source="./media/azure-add-role-assignment-finish-up.png" alt-text="Screenshot of the Storage Account Add role assignment sub page in the tab Review + assign.":::

Finally check that the correct member is listed under *Members > Name* and then finish up the assignment by clicking **Review + assign**.

> [!WARNING]
> In case your Remote Rendering account is not listed, refer to this [troubleshoot section](../resources/troubleshoot.md#cant-link-storage-account-to-arr-account).

> [!IMPORTANT]
> Azure role assignments are cached by Azure Storage, so there may be a delay of up to 30 minutes between when you grant access to your remote rendering account and when it can be used to access your storage account. See the [Azure role-based access control (Azure RBAC) documentation](../../role-based-access-control/troubleshooting.md#role-assignment-changes-are-not-being-detected) for details.

## Next steps

* [Authentication](authentication.md)
* [Using the Azure Frontend APIs for authentication](frontend-apis.md)
* [Example PowerShell scripts](../samples/powershell-example-scripts.md)