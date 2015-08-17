
1. Open the shared project file MainPage.cs and add the following code snippet to the MainPage class:
	
		// Define a member variable for storing the signed-in user. 
        private MobileServiceUser user;

		// Define a method that performs the authentication process
		// using a Facebook sign-in. 
        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            while (user == null)
            {
                string message;
                try
                {
					// Change 'MobileService' to the name of your MobileServiceClient instance.
					// Sign-in using Facebook authentication.
                    user = await App.MobileService
                        .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                    message = 
                        string.Format("You are now signed in - {0}", user.UserId);
                }
                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }
                        
                var dialog = new MessageDialog(message);
                dialog.Commands.Add(new UICommand("OK"));
                await dialog.ShowAsync();
            }
        }

    This code authenticates the user with a Facebook login. If you are using an identity provider other than Facebook, change the value of **MobileServiceAuthenticationProvider** above to the value for your provider.

3. Comment-out or delete the call to the **RefreshTodoItems** method in the existing **OnNavigatedTo** method override.

	This prevents the data from being loaded before the user is authenticated. Next, you will add a **Sign in** button to the app that triggers authentication.

4. Add the following code snippet to the MainPage class:

        private async void ButtonLogin_Click(object sender, RoutedEventArgs e)
        {
            // Login the user and then load data from the mobile app.
            await AuthenticateAsync();

            // Hide the login button and load items from the mobile app.
            this.ButtonLogin.Visibility = Windows.UI.Xaml.Visibility.Collapsed;
            await RefreshTodoItems();
        }
		
5. In the Windows Store app project, open the MainPage.xaml project file and add the following **Button** element just before the element that defines the **Save** button:

		<Button Name="ButtonLogin" Click="ButtonLogin_Click" 
                        Visibility="Visible">Sign in</Button>

6. In the Windows Phone Store app project, add the following **Button** element in the **ContentPanel**, after the **TextBox** element:

        <Button Grid.Row ="1" Grid.Column="1" Name="ButtonLogin" Click="ButtonLogin_Click" 
        	Margin="10, 0, 0, 0" Visibility="Visible">Sign in</Button>

8. Open the shared App.xaml.cs project file and add the following code:

        protected override void OnActivated(IActivatedEventArgs args)
        {
			// Windows Phone 8.1 requires you to handle the respose from the WebAuthenticationBroker.
            #if WINDOWS_PHONE_APP
            if (args.Kind == ActivationKind.WebAuthenticationBrokerContinuation)
            {
				// Completes the sign-in process started by LoginAsync.
				// Change 'MobileService' to the name of your MobileServiceClient instance. 
                App.MobileService.LoginComplete(args as WebAuthenticationBrokerContinuationEventArgs);
            }
            #endif

            base.OnActivated(args);
        }

	If the **OnActivated** method already exists, just add the `#if...#endif` code block.

9. Press the F5 key to run the Windows Store app, click the **Sign in** button, and sign into the app with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query your Mobile App and make updates to data.

10. Right-click the Windows Phone Store app project, click **Set as StartUp Project**, then repeat the previous step to verify that the Windows Phone Store app also runs correctly.  
