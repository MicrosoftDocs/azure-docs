1. Open the project file mainpage.xaml.cs and add the following code snippet to the MainPage class:
	
        private MobileServiceUser user;
        private async System.Threading.Tasks.Task Authenticate()
        {
            while (user == null)
            {
                string message;
                try
                {
                    user = await App.MobileService
                        .LoginAsync(MobileServiceAuthenticationProvider.Facebook);
                    message =
                        string.Format("You are now logged in - {0}", user.UserId);
                }
                catch (InvalidOperationException)
                {
                    message = "You must log in. Login Required";
                }

                MessageBox.Show(message);
            }
        }

    This creates a member variable for storing the current user and a method to handle the authentication process. The user is authenticated by using a Facebook login.

    >[AZURE.NOTE]If you are using an identity provider other than Facebook, change the value of <strong>MobileServiceAuthenticationProvider</strong> above to the value for your provider.</p>
    </div>

2. Delete or comment-out the existing **OnNavigatedTo** method override and replace it with the following method that handles the **Loaded** event for the page. 

        async void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            await Authenticate();
            RefreshTodoItems();
        }

   	This method calls the new **Authenticate** method. 

3. Replace the MainPage constructor with the following code:

        // Constructor
        public MainPage()
        {
            InitializeComponent();
            this.Loaded += MainPage_Loaded;
        }

   	This constructor also registers the handler for the Loaded event.
		
4. Press the F5 key to run the app and sign into the app with your chosen identity provider. 

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.
