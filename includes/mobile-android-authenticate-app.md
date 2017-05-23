
1. In **Project Explorer** in Android Studio, open the ToDoActivity.java file and add the following import statements.

        import java.util.concurrent.ExecutionException;
        import java.util.concurrent.atomic.AtomicBoolean;

        import android.content.Context;
        import android.content.SharedPreferences;
        import android.content.SharedPreferences.Editor;

        import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceAuthenticationProvider;
        import com.microsoft.windowsazure.mobileservices.authentication.MobileServiceUser;
2. Add the following method to the **ToDoActivity** class:

        // You can choose any unique number here to differentiate auth providers from each other. Note this is the same code at login() and onActivityResult().
        public static final int GOOGLE_LOGIN_REQUEST_CODE = 1;
 
        private void authenticate() {
            // Login using the Google provider.
            mClient.login("Google", "{url_scheme_of_your_app}", GOOGLE_LOGIN_REQUEST_CODE);
        }
         
        @Override
        protected void onActivityResult(int requestCode, int resultCode, Intent data) {
            // When request completes
            if (resultCode == RESULT_OK) {
                // Check the request code matches the one we send in the login request
                if (requestCode == GOOGLE_LOGIN_REQUEST_CODE) {
                    MobileServiceActivityResult result = mClient.onActivityResult(data);
                    if (result.isLoggedIn()) {
                        // login succeeded
                        createAndShowDialog(String.format("You are now logged in - %1$2s", mClient.getCurrentUser().getUserId()), "Success");
                        createTable();
                    } else {
                        // login failed, check the error message
                        String errorMessage = result.getErrorMessage();
                        createAndShowDialog(errorMessage, "Error");
                    }
                }
            }
        }

    This creates a new method to handle the authentication process. The user is authenticated by using a Google sign-in. A dialog displays the ID of the authenticated user. You cannot proceed without a positive authentication.

    > [!NOTE]
    > If you are using an identity provider other than Google, change the value passed to the **login** method above to one of the following: _MicrosoftAccount_, _Facebook_, _Twitter_, or _windowsazureactivedirectory_.

3. In the **onCreate** method, add the following line of code after the code that instantiates the `MobileServiceClient` object.

        authenticate();

    This call starts the authentication process.
4. Move the remaining code after `authenticate();` in the **onCreate** method to a new **createTable** method. This looks like the following:

        private void createTable() {

            // Get the table instance to use.
            mToDoTable = mClient.getTable(ToDoItem.class);

            mTextNewToDo = (EditText) findViewById(R.id.textNewToDo);

            // Create an adapter to bind the items with the view.
            mAdapter = new ToDoItemAdapter(this, R.layout.row_list_to_do);
            ListView listViewToDo = (ListView) findViewById(R.id.listViewToDo);
            listViewToDo.setAdapter(mAdapter);

            // Load the items from Azure.
            refreshItemsFromTable();
        }

5. Add the following snippet of _RedirectUrlActivity_ to _AndroidManifest.xml_ to ensure redirect works.
 
        <activity android:name="com.microsoft.windowsazure.mobileservices.authentication.RedirectUrlActivity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="{url_scheme_of_your_app}"
                    android:host="easyauth.callback"/>
            </intent-filter>
        </activity>

6.  Add redirectUriScheme to _build.gradle_ of your Android application.
 
        android {
            buildTypes {
                release {
                    // … …
                    manifestPlaceholders = ['redirectUriScheme': '{url_scheme_of_your_app}://easyauth.callback']
                }
                debug {
                    // … …
                    manifestPlaceholders = ['redirectUriScheme': '{url_scheme_of_your_app}://easyauth.callback']
                }
            }
        }

7. Add com.android.support:customtabs:23.0.1 to the dependencies in your build.gradle:

      dependencies {
          // ...
          compile 'com.android.support:customtabs:23.0.1'
      }

8. From the **Run** menu, click **Run app** to start the app and sign in with your chosen identity provider.

When you are successfully signed in, the app should run without errors, and you should be able to query the back-end service and make updates to data.
