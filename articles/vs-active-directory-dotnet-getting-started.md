<properties title="Getting Started with Active Directory Authentication" pageTitle="" metaKeywords="Azure, Getting Started, Active Directory" description="" services="active-directory" documentationCenter="" authors="ghogen, kempb" />
  
<tags ms.service="active-directory" ms.workload="web" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="10/8/2014" ms.author="ghogen, kempb" />

## Getting Started with Azure Active Directory (.NET Projects)

See details on what happened to your project [here](#whathappened).

Here is what you can do with the code that was added.
 
#####Requiring authentication to access controllers 

All controllers in your project were adorned with the **Authorize** attribute. This attribute will require the user to be authenticated before accessing these controllers. To allow the controller to be accessed anonymously, remove this attribute from the controller. If you want to set the permissions at a more granular level, apply the attribute to each method that requires authorization instead of applying it to the controller class.
 
#####Adding SignIn / SignOut Controls 

To add a the SignIn/SignOut controls to your view, you can use the **_LoginPartial.cshtml** partial view to add the functionality to one of your views. Here is an example of the functionality added to the standard **_Layout.cshtml** view. (Note the last element in the div with class navbar-collapse):

<PRE class="prettyprint">
    &lt;!DOCTYPE html&gt; 
     &lt;html&gt; 
     &lt;head&gt; 
         &lt;meta charset="utf-8" /&gt; 
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt; 
        &lt;title&gt;@ViewBag.Title - My ASP.NET Application&lt;/title&gt; 
        @Styles.Render("~/Content/css") 
        @Scripts.Render("~/bundles/modernizr") 
    &lt;/head&gt; 
    &lt;body&gt; 
        &lt;div class="navbar navbar-inverse navbar-fixed-top"&gt; 
            &lt;div class="container"&gt; 
                &lt;div class="navbar-header"&gt; 
                    &lt;button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"&gt; 
                        &lt;span class="icon-bar"&gt;&lt;/span&gt; 
                        &lt;span class="icon-bar"&gt;&lt;/span&gt; 
                        &lt;span class="icon-bar"&gt;&lt;/span&gt; 
                    &lt;/button&gt; 
                    @Html.ActionLink("Application name", "Index", "Home", new { area = "" }, new { @class = "navbar-brand" }) 
                &lt;/div&gt; 
                &lt;div class="navbar-collapse collapse"&gt; 
                    &lt;ul class="nav navbar-nav"&gt; 
                        &lt;li&gt;@Html.ActionLink("Home", "Index", "Home")&lt;/li&gt; 
                        &lt;li&gt;@Html.ActionLink("About", "About", "Home")&lt;/li&gt; 
                        &lt;li&gt;@Html.ActionLink("Contact", "Contact", "Home")&lt;/li&gt; 
                    &lt;/ul&gt; 
                    <span style="background-color:yellow">@Html.Partial("_LoginPartial")</span> 
                &lt;/div&gt; 
            &lt;/div&gt; 
        &lt;/div&gt; 
        &lt;div class="container body-content"&gt; 
            @RenderBody() 
            &lt;hr /&gt; 
            &lt;footer&gt; 
                &lt;p&gt;&amp;copy; @DateTime.Now.Year - My ASP.NET Application&lt;/p&gt; 
            &lt;/footer&gt; 
        &lt;/div&gt; 
        @Scripts.Render("~/bundles/jquery") 
        @Scripts.Render("~/bundles/bootstrap") 
        @RenderSection("scripts", required: false) 
    &lt;/body&gt; 
    &lt;/html&gt;
</PRE>

###<span id="whathappened">What happened to my project?</span>
 
References have been added.

#####NuGet package references

`Microsoft.IdentityModel.Protocol.Extensions`, `Microsoft.Owin`, `Microsoft.Owin.Host.SystemWeb`, `Microsoft.Owin.Security`, `Microsoft.Owin.Security.Cookies`, `Microsoft.Owin.Security.OpenIdConnect`, `Owin`, `System.IdentityModel.Tokens.Jwt`

#####.NET references

`Microsoft.IdentityModel.Protocol.Extensions`, `Microsoft.Owin`, `Microsoft.Owin.Host.SystemWeb`, `Microsoft.Owin.Security`, `Microsoft.Owin.Security.Cookies`, `Microsoft.Owin.Security.OpenIdConnect`, `Owin`, `System`, `System.Data`, `System.Drawing`, `System.IdentityModel`, `System.IdentityModel.Tokens.Jwt`, `System.Runtime.Serialization`

#####Code files were added to your project 

An authentication startup class, `App_Start/Startup.Auth.cs` was added to your project containing startup logic for Azure AD authentication. Also, a controller class, Controllers/AccountController.cs was added which contains `SignIn()` and `SignOut()` methods. Finally, a partial view, `Views/Shared/_LoginPartial.cshtml` was added containing an action link for SignIn/SignOut. 

#####Startup code was added to your project
 
If you already had a Startup class in your project, the **Configuration** method was updated to include a call to `ConfigureAuth(app)` was added to that method. Otherwise, a Startup class was added to your project. 

#####Your app.config or web.config has new configuration values 

The following configuration entries have been added. 
	<pre>
	`<appSettings>
	    <add key="ida:ClientId" value="ClientId from the new Azure AD App" /> 
	    <add key="ida:Tenant" value="Your selected Azure AD Tenant" /> 
	    <add key="ida:AADInstance" value="https://login.windows.net/{0}" /> 
	    <add key="Ida:PostLogoutRedirectURI" value="Your project start page" /> 
	</appSettings>` </pre>

#####An Azure Active Directory (AD) App was created 
An Azure AD Application was created in the directory that you selected in the wizard. 


[Learn more about Azure Active Directory](http://azure.microsoft.com/services/active-directory/)