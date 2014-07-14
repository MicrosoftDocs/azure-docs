
1. In the Package Explorer in Eclipse, open the ToDoActivity.java file and add the following import statements.

		import com.microsoft.windowsazure.mobileservices.MobileServiceUser;
		import com.microsoft.windowsazure.mobileservices.MobileServiceAuthenticationProvider;
		import com.microsoft.windowsazure.mobileservices.UserAuthenticationCallback;

2. Add the following method to the **ToDoActivity** class: 
	
		private void authenticate() {
		
			// Login using the Google provider.
			mClient.login(MobileServiceAuthenticationProvider.Google,
					new UserAuthenticationCallback() {
	
						@Override
						public void onCompleted(MobileServiceUser user,
								Exception exception, ServiceFilterResponse response) {
	
							if (exception == null) {
								createAndShowDialog(String.format(
												"You are now logged in - %1$2s",
												user.getUserId()), "Success");
								createTable();
							} else {
								createAndShowDialog("You must log in. Login Required", "Error");
							}
						}
					});
		}

    This creates a new method to handle the authentication process. The user is authenticated by using a Google login. A dialog is displayed which displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    <div class="dev-callout"><b>Note</b>
	<p>If you are using an identity provider other than Google, change the value passed to the <strong>login</strong> method above to one of the following: <em>MicrosoftAccount</em>, <em>Facebook</em>, <em>Twitter</em>, or <em>windowsazureactivedirectory</em>.</p>
    </div>

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

9. From the **Run** menu, then click **Run** to start the app and sign in with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.