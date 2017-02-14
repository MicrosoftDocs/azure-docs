
The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the back-end Azure service every time the app starts. This method is inefficient, and you can have usage-related issues if many customers try to start your app simultaneously. A better approach is to cache the authorization token returned by the Azure service, and try to use this first before using a provider-based sign-in.

> [!NOTE]
> You can cache the token issued by the back-end Azure service regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.
>
>

1. Open the ToDoActivity.java file and add the following import statements:

        import android.content.Context;
        import android.content.SharedPreferences;
        import android.content.SharedPreferences.Editor;
2. Add the following members to the `ToDoActivity` class.

        public static final String SHAREDPREFFILE = "temp";    
        public static final String USERIDPREF = "uid";    
        public static final String TOKENPREF = "tkn";    
3. In the ToDoActivity.java file, add the following definition for the `cacheUserToken` method.

        private void cacheUserToken(MobileServiceUser user)
        {
            SharedPreferences prefs = getSharedPreferences(SHAREDPREFFILE, Context.MODE_PRIVATE);
            Editor editor = prefs.edit();
            editor.putString(USERIDPREF, user.getUserId());
            editor.putString(TOKENPREF, user.getAuthenticationToken());
            editor.commit();
        }    

    This method stores the user ID and token in a preference file that is marked private. This should protect access to the cache so that other apps on the device do not have access to the token. The preference is sandboxed for the app. However, if someone gains access to the device, it is possible that they may gain access to the token cache through other means.

   > [!NOTE]
   > You can further protect the token with encryption, if token access to your data is considered highly sensitive and someone may gain access to the device. A completely secure solution is beyond the scope of this tutorial, however, and depends on your security requirements.
   >
   >
4. In the ToDoActivity.java file, add the following definition for the `loadUserTokenCache` method.

        private boolean loadUserTokenCache(MobileServiceClient client)
        {
            SharedPreferences prefs = getSharedPreferences(SHAREDPREFFILE, Context.MODE_PRIVATE);
            String userId = prefs.getString(USERIDPREF, null);
            if (userId == null)
                return false;
            String token = prefs.getString(TOKENPREF, null);
            if (token == null)
                return false;

            MobileServiceUser user = new MobileServiceUser(userId);
            user.setAuthenticationToken(token);
            client.setCurrentUser(user);

            return true;
        }
5. In the *ToDoActivity.java* file, replace the `authenticate` method with the following method, which uses a token cache. Change the login provider if you want to use an account other than Google.

        private void authenticate() {
            // We first try to load a token cache if one exists.
            if (loadUserTokenCache(mClient))
            {
                createTable();
            }
            // If we failed to load a token cache, login and create a token cache
            else
            {
                // Login using the Google provider.    
                ListenableFuture<MobileServiceUser> mLogin = mClient.login(MobileServiceAuthenticationProvider.Google);

                Futures.addCallback(mLogin, new FutureCallback<MobileServiceUser>() {
                    @Override
                    public void onFailure(Throwable exc) {
                        createAndShowDialog("You must log in. Login Required", "Error");
                    }           
                    @Override
                    public void onSuccess(MobileServiceUser user) {
                        createAndShowDialog(String.format(
                                "You are now logged in - %1$2s",
                                user.getUserId()), "Success");
                        cacheUserToken(mClient.getCurrentUser());
                        createTable();    
                    }
                });
            }
        }
6. Build the app and test authentication using a valid account. Run it at least twice. During the first run, you should receive a prompt to sign in and create the token cache. After that, each run attempts to load the token cache for authentication. You should not be required to sign in.
