
## Create an application (Express)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Register your application via the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app?appType=serverSideWebApp&appTech=aspNetWebAppOwin&step=configure)
2.	Enter a name for your application and your email
3.	Make sure the option for Guided Setup is checked
4.	Follow the instructions to add a Redirect URL to your application

## Add your application registration information to your solution (Advanced)
Now you need to register your application in the *Microsoft Application Registration Portal*:
1. Go to the [Microsoft Application Registration Portal](https://apps.dev.microsoft.com/portal/register-app) to register an application
2. Enter a name for your application and your email 
3.	Make sure the option for Guided Setup is unchecked
4.	Click `Add Platform`, then select `Web`
5.	Go back to Visual Studio and, in Solution Explorer, select the project and look at the Properties window (if you don’t see a Properties window, press F4)
6.	Change SSL Enabled to `True`
7.	Copy the SSL URL and add this URL to the list of Redirect URLs in the Registration Portal’s list of Redirect URLs:<br/><br/>![Project properties](media/active-directory-develop-guidedsetup-aspnetwebapp-configure/vsprojectproperties.png)<br />
8.	Add the following in `web.config` located in the root folder under the section `configuration\appSettings`:

```xml
<add key="ClientId" value="Enter_the_Application_Id_here" />
<add key="redirectUri" value="Enter_the_Redirect_URL_here" />
<add key="Tenant" value="common" />
<add key="Authority" value="https://login.microsoftonline.com/{0}/v2.0" /> 
```
<!-- Workaround for Docs conversion bug -->
<ol start="9">
<li>
Replace `ClientId` with the Application Id you just registered
</li>
<li>
Replace `redirectUri` with the SSL URL of your project 
</li>
</ol>
<!-- End Docs -->
