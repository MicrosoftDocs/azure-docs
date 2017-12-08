
## Create an application (Express)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=mobileAndDesktopApp&appTech=windowsDesktop&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to obtain the application ID and paste it into your code

### Add your application registration information to your solution (Advanced)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3. Make sure the option for Guided Setup is unchecked
4. Click `Add Platform`, then select `Native Application` and hit Save
5. Copy the GUID in Application ID, go back to Visual Studio, open `App.xaml.cs` and replace `your_client_id_here` with the Application ID you just registered:

```csharp
private static string ClientId = "your_application_id_here";
```
