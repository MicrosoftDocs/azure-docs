#How to Create a MongoDB Database in Azure

This article will show you how to use [MongoLab] to create a MongoDB database from the [Azure Store]. [MongoLab] is a MongoDB-as-a-service provider that allows you to run and manage MongoDB databases in Azure datacenters and connect to them from any application.  

To create a MongoDB database from the [Azure Store], do the following:

1. Log in to the [Azure Management Portal][portal].
2. Click **+NEW** at the bottom of the page, then select **STORE**.

	![Select add-on from store](./media/create-mongolab-mongodb/select-store.png)

3. Select **MongoLab**, then click the arrow at the bottom of the frame.

	![Select MongoLab](./media/create-mongolab-mongodb/select-mongo-db.png)

4. Enter a database name, and select a region, then click the arrow at the bottom of the frame.

	![Purchase MongoLab database from store](./media/create-mongolab-mongodb/purchase-mongodb.png)

5. Click the checkmark to complete your purchase.

	![Review and complete your purchase](./media/create-mongolab-mongodb/complete-mongolab-purchase.png)

6. After your database has been created, you can manage it from the **ADD-ONS** tab in the management portal.

	![Manage MongoLab database in Azure portal](./media/create-mongolab-mongodb/manage-mongolab-add-on.png)

7. You can get the database connection information by clicking on **CONNECTION INFO** at the bottom of the page (shown above).

	![MongoLab connection information](./media/create-mongolab-mongodb/mongolab-conn-info.png) 

[MongoLab]: https://mongolab.com/home
[waws]: /manage/services/web-sites/
[Azure Store]: ../articles/overview.md
[portal]: http://windows.azure.com/
