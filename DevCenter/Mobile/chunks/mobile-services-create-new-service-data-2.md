

To be able to store app data in the new mobile service, you must first create a new table in the associated SQL Database instance.

1. In the Management Portal, click **Mobile Services**, and then click the mobile service that you just created.

2. Click the **Data** tab, then click **+Create**.

   ![][1]

   This displays the **Create new table** dialog.

3. In **Table name** type _TodoItem_, then click the check button.

  ![][2]

  This creates a new storage table **TodoItem** with the default permissions set. This means that anyone with the application key, which is distributed with your app, can access and change data in the table. 

    <div class="dev-callout"> 
	<b>Note</b> 
	<p>The same table name is used in Mobile Services quickstart. However, each table is created in a schema that is specific to a given mobile service. This is to prevent data collisions when multiple mobile services use the same database.</p> 
	</div>

4. Click the new **TodoItem** table and verify that there are no data rows.

5. Click the **Columns** tab and verify that there is only a single **id** column, which is automatically created for you.

  This is the minimum requirement for a table in Mobile Services. 

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, new columns are created automatically when JSON objects are sent to the mobile service by an insert or update operation.</p>
    </div>

You are now ready to use the new mobile service as data storage for the app.

<!-- Anchors. -->
<!-- Images. -->
[1]: ../Media/mobile-data-tab-empty.png
[2]: ../Media/mobile-create-todoitem-table.png
<!-- URLs. -->
