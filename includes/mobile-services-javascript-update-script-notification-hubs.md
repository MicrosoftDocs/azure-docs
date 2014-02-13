

Finally, you must update the script registered to the insert operation on the TodoItem table to send notifications.

1. Click **TodoItem**, click **Script** and select **Insert**. 

   	![](./media/mobile-services-javascript-update-script-notification-hubs/mobile-insert-script-push2.png)

5. Replace the insert function with the following code, and then click **Save** <strong><em>CODE NOT VERIFIED OR CORRECT YET</em></strong>:

	    function insert(item, user, request) {
    	    request.execute({
        	    success: function() {
            	    request.respond();
	        	    push.wns.sendToastText04(registration.handle, {
	            	    text1: item.text
	        	    }, {
	            	    success: function(pushResponse) {
	                	    console.log("Sent push:", pushResponse);
	            	    }
	        	    });
        	    }
    	    });
	    }

    This insert script sends a push notification (with the text of the inserted item) to all registrations.
