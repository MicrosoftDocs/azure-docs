
1. In **Project Explorer** in Android Studio, open the ToDoActivity.java file and add the following import statements.

		import java.util.concurrent.ExecutionException;
		import java.util.concurrent.atomic.AtomicBoolean;

		import android.content.Context;
		import android.content.SharedPreferences;
		import android.content.SharedPreferences.Editor;

		import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider;
		import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceUser;

2. Add the following method to the **ToDoActivity** class: 
	
		private void authenticate() {
		    // Login using the Google provider.
		    
			ListenableFuture<MobileServiceUser> mLogin = mClient.login(MobileServiceAuthenticationProvider.Google);
	
	    	Futures.addCallback(mLogin, new FutureCallback<MobileServiceUser>() {
	    		@Override
	    		public void onFailure(Throwable exc) {
	    			createAndShowDialog((Exception) exc, "Error");
	    		}   		
	    		@Override
	    		public void onSuccess(MobileServiceUser user) {
	    			createAndShowDialog(String.format(
	                        "You are now logged in - %1$2s",
	                        user.getUserId()), "Success");
	    			createTable();	
	    		}
	    	});   	
		}


	This creates a new method to handle the authentication process. The user is authenticated by using a Google login. A dialog is displayed which displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    > [AZURE.NOTE] If you are using an identity provider other than Google, change the value passed to the **login** method above to one of the following: _MicrosoftAccount_, _Facebook_, _Twitter_, or _windowsazureactivedirectory_.

3. In the **onCreate** method, add the following line of code after the code that instantiates the `MobileServiceClient` object.

		authenticate();

	This call starts the authentication process.

4. Move the remaining code after `authenticate();` in the **onCreate** method to a new **createTable** method, which looks like this:

		private void createTable() {
	
			// Get the Mobile Service Table instance to use
			mToDoTable = mClient.getTable(ToDoItem.class);
	
			mTextNewToDo = (EditText) findViewById(R.id.textNewToDo);
	
			// Create an adapter to bind the items with the view
			mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);
			ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
			listViewToDo.setAdapter(mAdapter);
	
			// Load the items from the Mobile Service
			refreshItemsFromTable();
		}

9. From the **Run** menu, then click **Run app** to start the app and sign in with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.