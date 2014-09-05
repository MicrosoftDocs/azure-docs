

The instructions below apply to updating a Windows Store client app but, you can test this on any of the other platforms supported by Azure Mobile Services. 


1. In Visual Studio, open MainPage.xaml.cs and add the following `using` statement to the top of the file.
 
        using System.Net.Http;

2. In MainPage.xaml.cs, add the following class definition to the namespace to help serialize the user information.

        public class UserInfo
        {
            public String displayName { get; set; }
            public String streetAddress { get; set; }
            public String city { get; set; }
            public String state { get; set; }
            public String postalCode { get; set; }
        }


3. In MainPage.xaml.cs, update the `AuthenticateAsync` method to call the custom API to return additional information about the user from the AAD. 

        private async System.Threading.Tasks.Task AuthenticateAsync()
        {
            while (user == null)
            {
                string message;
                try
                {
                    user = await App.MobileService
                        .LoginAsync(MobileServiceAuthenticationProvider.WindowsAzureActiveDirectory);
                    UserInfo userInfo = await App.MobileService.InvokeApiAsync<UserInfo>("getuserinfo", 
                        HttpMethod.Get, null);
                    message = string.Format("{0}, you are now logged in.\n\nYour address is...\n\n{1}\n{2}, {3} {4}", 
                        userInfo.displayName, userInfo.streetAddress, userInfo.city, userInfo.state, 
                        userInfo.postalCode);
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


4. Save your changes and build the the service to verify no syntax errors.  
