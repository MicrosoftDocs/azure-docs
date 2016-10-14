<properties
	pageTitle="Manage a DocumentDB account via the Azure Portal | Microsoft Azure"
	description="Learn how to manage your DocumentDB account via the Azure Portal. Find a guide on using the Azure Portal to view, copy, delete and access accounts."
	keywords="Azure Portal, documentdb, azure, Microsoft azure"
	services="documentdb"
	documentationCenter=""
	authors="kirillg"
	manager="jhubbard"
	editor="cgronlun"/>

<tags
	ms.service="documentdb"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/14/2016"
	ms.author="kirillg"/>

# How to manage a DocumentDB account

Learn how to set global consistency, work with keys, and delete a DocumentDB account in the Azure portal.

## <a id="consistency"></a>Manage DocumentDB consistency settings

Selecting the right consistency level depends on the semantics of your application. You should familiarize yourself with the available consistency levels in DocumentDB by reading [Using consistency levels to maximize availability and performance in DocumentDB] [consistency]. DocumentDB provides consistency, availability, and performance guarantees, at every consistency level available for your database account. Configuring your database account with a consistency level of Strong requires that your data is confined to a single Azure region and not globally available. On the other hand, the relaxed consistency levels - bounded staleness, session or eventual enable you to associate any number of Azure regions with your database account. The following simple steps show you how to select the default consistency level for your database account. 

### To specify the default consistency for a DocumentDB account

1. In the [Azure portal](https://portal.azure.com/), access your DocumentDB account.
2. In the account blade, click **Default consistency**.
3. In the **Default Consistency** blade, select the new consistency level and click **Save**.
    ![Default consistency session][5]

## <a id="keys"></a>View, copy, and regenerate access keys
When you create a DocumentDB account, the service generates two master access keys that can be used for authentication when the DocumentDB account is accessed. By providing two access keys, DocumentDB enables you to regenerate the keys with no interruption to your DocumentDB account. 

In the [Azure portal](https://portal.azure.com/), access the **Keys** blade from the resource menu on the **DocumentDB account** blade to view, copy, and regenerate the access keys that are used to access your DocumentDB account.

![Azure Portal screenshot, Keys blade](./media/documentdb-manage-account/keys.png)

> [AZURE.NOTE] The **Keys** blade also includes primary and secondary connection strings that can be used to connect to your account from the [Data Migration Tool](documentdb-import-data.md).

Read-only keys are also available on this blade. Reads and queries are read-only operations, while creates, deletes, and replaces are not.

### Copy an access key in the Azure Portal

On the **Keys** blade, click the **Copy** button to the right of the key you wish to copy.

![View and copy an access key in the Azure Portal, Keys blade](./media/documentdb-manage-account/copykeys.png)

### Regenerate access keys

You should change the access keys to your DocumentDB account periodically to help keep your connections more secure. Two access keys are assigned to enable you to maintain connections to the DocumentDB account using one access key while you regenerate the other access key.

> [AZURE.WARNING] Regenerating your access keys affects any applications that are dependent on the current key. All clients that use the access key to access the DocumentDB account must be updated to use the new key.

If you have applications or cloud services using the DocumentDB account, you will lose the connections if you regenerate keys, unless you roll your keys. The following steps outline the process involved in rolling your keys.

1. Update the access key in your application code to reference the secondary access key of the DocumentDB account.
2. Regenerate the primary access key for your DocumentDB account. In the [Azure Portal](https://portal.azure.com/),
access your DocumentDB account.
3. In the **DocumentDB Account** blade, click **Keys**.
4. On the **Keys** blade, click the regenerate button, then click **Ok** to confirm that you want to generate a new key.
    ![Regenerate access keys](./media/documentdb-manage-account/regenerate-keys.png)

5. Once you have verified that the new key is available for use (approximately 5 minutes after regeneration), update the access key in your application code to reference the new primary access key.
6. Regenerate the secondary access key.

    ![Regenerate access keys](./media/documentdb-manage-account/regenerate-secondary-key.png)


> [AZURE.NOTE] It can take several minutes before a newly generated key can be used to access your DocumentDB account.

## Get the  connection string

To retrieve your connection string, do the following: 

1. In the [Azure portal](https://portal.azure.com), access your DocumentDB account.
2. In the resource menu, click **Keys**.
3. Click the **Copy** button next to the **Primary Connection String** or **Secondary Connection String** box. 

If you are using the connection string in the [DocumentDB Database Migration Tool](documentdb-import-data.md), append the database name to the end of the connection string. `AccountEndpoint=< >;AccountKey=< >;Database=< >`.

## <a id="delete"></a> Delete a DocumentDB account
To remove a DocumentDB account from the Azure Portal that you are no longer using, use the **Delete Account** command on the **DocumentDB account** blade.

![How to delete a DocumentDB account in the Azure Portal](./media/documentdb-manage-account/deleteaccount.png)


1. In the [Azure portal](https://portal.azure.com/), access the DocumentDB account you wish to delete.
2. On the **DocumentDB account** blade, click **More**, and then click **Delete Account**. Or, right-click the name of the database, and click **Delete Account**.
3. On the resulting confirmation blade, type the DocumentDB account name to confirm that you want to delete the account.
4. Click the **Delete** button.

![How to delete a DocumentDB account in the Azure Portal](./media/documentdb-manage-account/delete-account-confirm.png)

## <a id="next"></a>Next steps

Learn how to [get started with your DocumentDB account](http://go.microsoft.com/fwlink/p/?LinkId=402364).

To learn more about DocumentDB, see the Azure DocumentDB documentation on [azure.com](http://go.microsoft.com/fwlink/?LinkID=402319&clcid=0x409).


<!--Image references-->
[1]: ./media/documentdb-manage-account/documentdb_add_region-1.png
[2]: ./media/documentdb-manage-account/documentdb_add_region-2.png
[3]: ./media/documentdb-manage-account/documentdb_change_write_region-1.png
[4]: ./media/documentdb-manage-account/documentdb_change_write_region-2.png
[5]: ./media/documentdb-manage-account/documentdb_change_consistency-1.png
[6]: ./media/documentdb-manage-account/chooseandsaveconsistency.png

<!--Reference style links - using these makes the source content way more readable than using inline links-->
[bcdr]: https://azure.microsoft.com/documentation/articles/best-practices-availability-paired-regions/
[consistency]: https://azure.microsoft.com/documentation/articles/documentdb-consistency-levels/
[azureregions]: https://azure.microsoft.com/en-us/regions/#services
[offers]: https://azure.microsoft.com/en-us/pricing/details/documentdb/
