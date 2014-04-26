

1. In the Management Portal, click the **Data** tab and then click the **Registrations** table. 

	![](./media/mobile-services-update-registrations-script/mobile-portal-data-tables-registrations.png)

2. In **Registrations**, click the **Script** tab and select **Insert**.
   
	![](./media/mobile-services-update-registrations-script/mobile-insert-script-registrations.png)

	This displays the function that is invoked when an insert occurs in the **Registrations** table.

3. Replace the insert function with the following code, and then click **Save**:

		function insert(item, user, request) {
			var registrationTable = tables.getTable('Registrations');
			registrationTable
				.where({ handle: item.handle })
				.read({ success: insertChannelIfNotFound });
	        function insertChannelIfNotFound(existingRegistrations) {
        	    if (existingRegistrations.length > 0) {
            	    request.respond(200, existingRegistrations[0]);
        	    } else {
            	    request.execute();
        	    }
    	    }
	    }

   This registers a new insert script, which stores the registration information in the new table.

