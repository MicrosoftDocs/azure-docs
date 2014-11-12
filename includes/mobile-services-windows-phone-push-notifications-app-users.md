
Next, you must change the way that push notifications are registered to make sure that the user is authenticated before registration is attempted. 

1. In Visual Studio in Solution Explorer, open the app.xaml.cs project file and in the **Application_Launching** event handler comment-out or delete the call to the **AcquirePushChannel** method. 
 
2. Change the accessibility of the **AcquirePushChannel** method from `private` to `public` and add the `static` modifier. 

3. Open the MainPage.xaml.cs project file and replace the **OnNavigatedTo** method override with the following:

	    protected override async void OnNavigatedTo(NavigationEventArgs e)
        {
            await AuthenticateAsync();            
            App.AcquirePushChannel();
            RefreshTodoItems();
        }