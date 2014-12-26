
The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the mobile service every time that the app starts. Not only is this method inefficient, you can run into usage-relates issues should many customers try to start you app at the same time. A better approach is to cache the authorization token returned by Mobile Services and try to use this first before using a provider-based sign-in. 

>[AZURE.NOTE]You can cache the token issued by Mobile Services regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.

1. In the MainPage.xaml.cs project file, add the following **using** statements:

		using System.Linq;		
		using Windows.Security.Credentials;

2. Replace the **AuthenticateAsync** method with the following code:

        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            string message;
            // This sample uses the Facebook provider.
            var provider = "Facebook";
              
            // Use the PasswordVault to securely store and access credentials.
            PasswordVault vault = new PasswordVault();
            PasswordCredential credential = null;

            while (credential == null)
            {
                try
                {
                    // Try to get an existing credential from the vault.
                    credential = vault.FindAllByResource(provider).FirstOrDefault();
                }
                catch (Exception)
                {
                    // When there is no matching resource an error occurs, which we ignore.
                }

                if (credential != null)
                {
                    // Create a user from the stored credentials.
                    user = new MobileServiceUser(credential.UserName);
                    credential.RetrievePassword();
                    user.MobileServiceAuthenticationToken = credential.Password;
                    
                    // Set the user from the stored credentials.
                    App.MobileService.CurrentUser = user;

                    try
                    {
                        // Try to return an item now to determine if the cached credential has expired.
                        await App.MobileService.GetTable<TodoItem>().Take(1).ToListAsync();
                    }
                    catch (MobileServiceInvalidOperationException ex)
                    {                        
                        if (ex.Response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                        {
                            // Remove the credential with the expired token.
                            vault.Remove(credential);
                            credential = null;
                            continue;
                        }
                    }
                }
                else
                {
                    try
                    {
                        // Login with the identity provider.
                        user = await App.MobileService
                            .LoginAsync(provider);                        

                        // Create and store the user credentials.
                        credential = new PasswordCredential(provider,
                            user.UserId, user.MobileServiceAuthenticationToken);
                        vault.Add(credential);
                    }
                    catch (MobileServiceInvalidOperationException ex)
                    {
                        message = "You must log in. Login Required";
                    }
                }
                message = string.Format("You are now logged in - {0}", user.UserId);
                var dialog = new MessageDialog(message);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
        }

	In this version of **AuthenticateAsync**, the app tries to use credentials stored in the **PasswordVault** to access the mobile service. A simple query is sent to verify that the stored token is not expired. When a 401 is returned, a regular provider-based sign-in is attempted. A regular sign-in is also performed when there is no stored credential.

	>[AZURE.NOTE]This app tests for expired tokens during login, but token expiration can occur after authentication when the app is in use. For a solution to handling authorization errors related to expiring tokens, see the post [Caching and handling expired tokens in Azure Mobile Services managed SDK](http://blogs.msdn.com/b/carlosfigueira/archive/2014/03/13/caching-and-handling-expired-tokens-in-azure-mobile-services-managed-sdk.aspx). 

3. Restart the app twice.

	Notice that on the first start-up, sign-in with the provider is again required. However, on the second restart the cached credentials are used and sign-in is bypassed. 