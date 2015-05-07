<properties 
	pageTitle="Get started with custom authentication | Mobile Dev Center" 
	description="Learn how to authenticate users with a username and password." 
	documentationCenter="Mobile" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="05/02/2015" 
	ms.author="mahender"/>

# Get started with custom authentication

## Overview
This topic shows you how to authenticate users in the Azure Mobile Services .NET backend by issuing your own Mobile Services authentication token. In this tutorial, you add authentication to the quickstart project using a custom username and password for your app.

>[AZURE.NOTE] This tutorial demonstrates an advanced method of authenticating your Mobile Services with custom credentials. Many apps will be best suited to instead use the built-in social identity providers, allowing users to log in via Facebook, Twitter, Google, Microsoft Account, and Azure Active Directory. If this is your first experience with authentication in Mobile Services, please see the [Add authentication to your app] tutorial.

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

>[AZURE.IMPORTANT] The purpose of this tutorial is to show you how to issue an authentication token for Mobile Services. This is not to be taken as security guidance. In developing your app, you need to be aware of the security implications of password storage, and you need to have a strategy for managing brute-force attacks.

## Set up the accounts table

Because you are using custom authentication and not relying on another identity provider, you will need to store your users' sign-in information. In this section, you will create a table for your accounts and set up the basic security mechanisms. The accounts table will contain the usernames and the salted and hashed passwords, and you can also include additional user information if needed.

1. In the **DataObjects** folder of your backend project, add a new entity called `Account`.

2. Add the following `using` statement:

		using Microsoft.WindowsAzure.Mobile.Service;  

3. Replace the class definition with the following code:

	    public class Account : EntityData
	    {
	        public string Username { get; set; }
	        public byte[] Salt { get; set; }
	        public byte[] SaltedAndHashedPassword { get; set; }
	    }
    
    This represents a row in a new Account table, which contains the username, that user's salt, and the securly stored password.

2. Under the **Models** folder, you will find a **DbContext** derived class named after your mobile service. Open your context and add the accounts table to your data model by including the following:

        public DbSet<Account> Accounts { get; set; }

	>[AZURE.NOTE]The code snippets in this tutorial use `todoContext` as the context name. You must update the code snippets for your project's context. 

	Next, you will set up the security functions for working with this data. 
 
5. Create a class called `CustomLoginProviderUtils` and add the following `using` statement:

		using System.Security.Cryptography;

6. Add the following code methods to the new class:


        public static byte[] hash(string plaintext, byte[] salt)
        {
            SHA512Cng hashFunc = new SHA512Cng();
            byte[] plainBytes = System.Text.Encoding.ASCII.GetBytes(plaintext);
            byte[] toHash = new byte[plainBytes.Length + salt.Length];
            plainBytes.CopyTo(toHash,0);
            salt.CopyTo(toHash, plainBytes.Length);
            return hashFunc.ComputeHash(toHash);
        }

        public static byte[] generateSalt()
        {
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] salt = new byte[256];
            rng.GetBytes(salt);
            return salt;
        }

        public static bool slowEquals(byte[] a, byte[] b)
        {
            int diff = a.Length ^ b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
            {
                diff |= a[i] ^ b[i];
            }
            return diff == 0;
        }

	This lets you generate a new long salt, adds the ability to hash a salted password, and provides a secure way of comparing two hashes. 

## Create the registration endpoint

At this point, you have everything you need to begin creating user accounts. In this section, you will set up a registration endpoint to handle new registration requests. This is where you will enforce new username and password policies and ensure that the username is not taken. Then you will safely store the user information in your database.

1. Create the following new class to represent an incoming registration attempt:

        public class RegistrationRequest
        {
            public String username { get; set; }
            public String password { get; set; }
        }

    If you need to collect and store other information during registration, you should do it here.

2. In your mobile service backend project, right-click **Controllers**, click **Add** and **Controller**, create a new **Microsoft Azure Mobile Services Custom Controller** named `CustomRegistrationController`, then add the following `using` statements:

		using Microsoft.WindowsAzure.Mobile.Service.Security;
		using System.Text.RegularExpressions;
		using <my_project_namespace>.DataObjects;
		using <my_project_namespace>.Models;

	In the above code, replace the placeholder with your project's namespace.
 
4. Replace the class definition with the following code:

	    [AuthorizeLevel(AuthorizationLevel.Anonymous)]
	    public class CustomRegistrationController : ApiController
	    {
	        public ApiServices Services { get; set; }
	
	        // POST api/CustomRegistration
	        public HttpResponseMessage Post(RegistrationRequest registrationRequest)
	        {
	            if (!Regex.IsMatch(registrationRequest.username, "^[a-zA-Z0-9]{4,}$"))
	            {
	                return this.Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid username (at least 4 chars, alphanumeric only)");
	            }
	            else if (registrationRequest.password.Length < 8)
	            {
	                return this.Request.CreateResponse(HttpStatusCode.BadRequest, "Invalid password (at least 8 chars required)");
	            }
	
	            todoContext context = new todoContext();
	            Account account = context.Accounts.Where(a => a.Username == registrationRequest.username).SingleOrDefault();
	            if (account != null)
	            {
	                return this.Request.CreateResponse(HttpStatusCode.BadRequest, "That username already exists.");
	            }
	            else
	            {
	                byte[] salt = CustomLoginProviderUtils.generateSalt();
	                Account newAccount = new Account
	                {
	                    Id = Guid.NewGuid().ToString(),
	                    Username = registrationRequest.username,
	                    Salt = salt,
	                    SaltedAndHashedPassword = CustomLoginProviderUtils.hash(registrationRequest.password, salt)
	                };
	                context.Accounts.Add(newAccount);
	                context.SaveChanges();
	                return this.Request.CreateResponse(HttpStatusCode.Created);
	            }
	        }
	    }   

    Remember to replace the *todoContext* variable with the name of your project's **DbContext**. Note that this controller uses the following attribute to allow all traffic to this endpoint:

        [AuthorizeLevel(AuthorizationLevel.Anonymous)]

>[AZURE.IMPORTANT]This registration endpoint can be accessed by any client via HTTP. Before you publish this 

## Create the LoginProvider

One of the fundamental constructs in the Mobile Services authentication pipeline is the **LoginProvider**. In this section, you will create your own `CustomLoginProvider`. It will not be plugged into the pipeline like the built-in providers, but it will provide you with some convenient functionality.

1. Create a new class, `CustomLoginProvider`, which derives from **LoginProvider**, and add the following `using` statements:

	    using Microsoft.WindowsAzure.Mobile.Service;
		using Microsoft.WindowsAzure.Mobile.Service.Security;
		using Newtonsoft.Json.Linq;
		using Owin;
		using System.Security.Claims;
 
3. replace the **CustomLoginProvider** class definition with the following code:

        public class CustomLoginProvider : LoginProvider
        {
            public const string ProviderName = "custom";

            public override string Name
            {
                get { return ProviderName; }
            }

            public CustomLoginProvider(IServiceTokenHandler tokenHandler)
                : base(tokenHandler)
            {
                this.TokenLifetime = new TimeSpan(30, 0, 0, 0);
            }

        }

       If you try to build the project now it will fail. `LoginProvider` has three abstract methods that you need to implement, which you will do later.

2. Create a new class named `CustomLoginProviderCredentials` in the same code file. 

        public class CustomLoginProviderCredentials : ProviderCredentials
        {
            public CustomLoginProviderCredentials()
                : base(CustomLoginProvider.ProviderName)
            {
            }
        }

	This represents information about your user and will be made available to you on the backend via [GetIdentitiesAsync](https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.security.serviceuser.getidentitiesasync.aspx). If you are adding custom claims, make sure that they are captured in this object.

3. Add the following implementation of the abstract method `ConfigureMiddleware` to **CustomLoginProvider**. 

        public override void ConfigureMiddleware(IAppBuilder appBuilder, ServiceSettingsDictionary settings)
        {
            // Not Applicable - used for federated identity flows
            return;
        }

	This method is a no-op here since **CustomLoginProvider** is not integrating with the authentication pipeline.

4. Add the following implementation of the abstract method `ParseCredentials` to **CustomLoginProvider**. 
        public override ProviderCredentials ParseCredentials(JObject serialized)
        {
            if (serialized == null)
            {
                throw new ArgumentNullException("serialized");
            }

            return serialized.ToObject<CustomLoginProviderCredentials>();
        }

	This method will allow the backend to deserialize user information from an incoming authentication token.

5. Add the following implementation of the abstract method `CreateCredentials` to **CustomLoginProvider**. 

        public override ProviderCredentials CreateCredentials(ClaimsIdentity claimsIdentity)
        {
            if (claimsIdentity == null)
            {
                throw new ArgumentNullException("claimsIdentity");
            }

            string username = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier).Value;
            CustomLoginProviderCredentials credentials = new CustomLoginProviderCredentials
            {
                UserId = this.TokenHandler.CreateUserId(this.Name, username)
            };

            return credentials;
        }

	This method translates a [ClaimsIdentity] into a [ProviderCredentials] object that is used in the authentication token issuance phase. You will again want to capture any additional claims in this method.

## Create the sign-in endpoint

Next, you create an endpoint for your users to sign-in. The username and password that you receive is checked against the database by first applying the user's salt, hashing the password, and making sure that the incoming value matches that of the database. If it does, then you can create a [ClaimsIdentity] and pass it to the **CustomLoginProvider**. The client app receives a user ID and an authentication token for further access to your mobile service.

1. In your mobile service backend project, create the following new `LoginRequest` class:

        public class LoginRequest
        {
            public String username { get; set; }
            public String password { get; set; }
        }

	This class represents an incoming sign-in attempt.

2. Create the following new `CustomLoginResult` class:

	    public class CustomLoginResult
	    {
	        public string UserId { get; set; }
	        public string MobileServiceAuthenticationToken { get; set; }
	
	    }

	This class represents a successfully login with the user ID and the authentication token. Note that this class has the same shape as the MobileServiceUser class on the client, which makes it easier to hand the login response on a strongly-typed client.

2. Right-click **Controllers**, click **Add** and **Controller**, create a new **Microsoft Azure Mobile Services Custom Controller** named `CustomLoginController`, then add the following `using` statements:

		using Microsoft.WindowsAzure.Mobile.Service.Security;
		using System.Security.Claims;
		using <my_project_namespace>.DataObjects;
		using <my_project_namespace>.Models;

3. Replace the **CustomLoginController** class definition with following code:
 
	    [AuthorizeLevel(AuthorizationLevel.Anonymous)]
	    public class CustomLoginController : ApiController
	    {
	        public ApiServices Services { get; set; }
	        public IServiceTokenHandler handler { get; set; }
	
	        // POST api/CustomLogin
	        public HttpResponseMessage Post(LoginRequest loginRequest)
	        {
	            todoContext context = new todoContext();
	            Account account = context.Accounts
	                .Where(a => a.Username == loginRequest.username).SingleOrDefault();
	            if (account != null)
	            {
	                byte[] incoming = CustomLoginProviderUtils
	                    .hash(loginRequest.password, account.Salt);
	
	                if (CustomLoginProviderUtils.slowEquals(incoming, account.SaltedAndHashedPassword))
	                {
	                    ClaimsIdentity claimsIdentity = new ClaimsIdentity();
	                    claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, loginRequest.username));
	                    LoginResult loginResult = new CustomLoginProvider(handler)
	                        .CreateLoginResult(claimsIdentity, Services.Settings.MasterKey);
	                    var customLoginResult = new CustomLoginResult()
	                    {
	                        UserId = loginResult.User.UserId,
	                        MobileServiceAuthenticationToken = loginResult.AuthenticationToken
	                    };
	                    return this.Request.CreateResponse(HttpStatusCode.OK, customLoginResult);
	                }
	            }
	            return this.Request.CreateResponse(HttpStatusCode.Unauthorized,
	                "Invalid username or password");
	        }
	    }

       Remember to replace the *todoContext* variable with the name of your project's **DbContext**. Note that this controller uses the following attribute to allow all traffic to this endpoint:

        [AuthorizeLevel(AuthorizationLevel.Anonymous)]

>[AZURE.IMPORTANT] Your `CustomLoginController` for production use should also contain a brute-force detection strategy. Otherwise your sign-in solution may be vulnerable to attack. 

## Configure the mobile service to require authentication

[AZURE.INCLUDE [mobile-services-restrict-permissions-dotnet-backend](../includes/mobile-services-restrict-permissions-dotnet-backend.md)]


## Test the sign-in flow using the test client

In your client app, you must develop a custom sign-in screen which takes usernames and passwords and sends them as a JSON payload to your registration and sign-in endpoints. To complete this tutorial, you will instead just use the built-in test client for the Mobile Services .NET backend.

1. In Visual Studio, right-click the mobile service project, then click **Debug** and **Start New Instance**.  

	This starts a new debugging instance of your mobile service backend project. After the service starts successfully, you will see a start page that says **This mobile service is up and running**.

2. On the service start page, click **Try it out**, then type the password that you set for the **MS_ApplicationKey** app setting in the web.config file with a blank username into the authentication dialog.

3. In the help page, click the **CustomRegistration** endpoint, then click **Try this out**.

    ![][2]

4. In the body, replace the sample strings with a username and password, which meet the criteria you specified before, then click **Send**. 

    ![][3]

	The response should be **201/Created**.

5. Click the browser's back button and repeat steps 2 and 3 for the **CustomLogin** endpoint, using the same username and password that you registered in the previous step. 

    ![][4]

	You should receive response message with a body that contains a **user** JSON object that has both the *userId* and an *authenticationToken*, which is the Mobile Services authentication token generated by your custom authentication. This token is sufficient to grant the client app access to the TodoItem endpoint.

	Make a copy of the *authenticationToken* value. You will use this to access the restricted TodoItem endpoint.

6. Click the browser's back button, then in the API documentation page, click **GetTables**, click **Try this out**.

7. In the GET request dialog, click the plus sign next to **Headers**, type the value `X-ZUMO-AUTH` in the left box, paste the copied *authenticationToken* value in the right box, then click **Send**.

 	![](./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-access-endpoint.png) 

	The mobile service should grant access to the endpoint and return a **200/OK** status along with a list of TodoItems in the table.

 	![](./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-access-success.png) 

>[AZURE.IMPORTANT] If you choose to also publish this mobile service project to Azure for testing, remember that your sign-in and authentication providers will be vulnerable to attack. Make sure that they are either hardened appropriately or that the test data being protected is not important to you. Take great caution before using a custom authentication scheme to secure a production service.

## Sign in using custom authentication from the client

This section describes the steps needed to access the custom authentication endpoints from the client to obtain the authentication token needed to access the mobile service. Because the specific client code you need depends on your client, the guidance provided here is platform agnostic.

>[AZURE.NOTE] The Mobile Services client libraries communicate with the service over HTTPS. Because this solution requires you to send passwords as plaintext, you must make sure that you use HTTPS when you call these endpoint using direct REST requests.

1. Create the required UI elements in your client app to allow users to enter a username and password.

2. Use the appropriate **invokeApi** method on the **MobileServiceClient** in the client library to call the **CustomRegistration** endpoint, passing the runtime-supplied username and password in the message body. 

	You only need to call the **CustomRegistration** endpoint once to create an account for a given user, as long as you keep the user login information in the Accounts table. For examples of how to call a custom API on the various supported client platforms, see the article [Custom API in Azure Mobile Services – client SDKs](http://blogs.msdn.com/b/carlosfigueira/archive/2013/06/19/custom-api-in-azure-mobile-services-client-sdks.aspx).
	 
	> [AZURE.IMPORTANT] Because this user provisioning step occurs only once, you should consider creating the user account in some out-of-band fashion. For a public registration endpoint, you should also consider implementing an SMS-based or email-based verification process, or some other safeguard to prevent the generation of fruadulent accounts. You can use Twilio to send SMS messages from Mobile services. For more information, see [How to: Send an SMS message](partner-twilio-mobile-services-how-to-use-voice-sms.md#howto_send_sms). You can also use SendGrid to send emails from Mobile Services. For more inforation, see [Send email from Mobile Services with SendGrid](store-sendgrid-mobile-services-send-email-scripts.md). 
	
3. Use the appropriate **invokeApi** method again, this time to call the **CustomLogin** endpoint, passing the runtime-supplied username and password in the message body. 

	This time, you must capture the *userId* and *authenticationToken* values returned in the response object after a successful login. 
	
4. Use the returned *userId* and *authenticationToken* values to create a new **MobileServiceUser** object and set it as the current user for your **MobileServiceClient** instance, as shown in the topic [Add authentication to existing app](mobile-services-dotnet-backend-ios-get-started-users.md). Because the CustomLogin result is the same shape as the **MobileServiceUser** object, you should be able to make a direct cast of the result. 

This completes this tutorial. 


<!-- Anchors. -->


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-debug-start.png
[1]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-try-out.png
[2]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-test-client.png
[3]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-send-register.png
[4]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-login-result.png


<!-- URLs. -->
[Add authentication to your app]: mobile-services-dotnet-backend-windows-store-dotnet-get-started-users.md
[Get started with Mobile Services]: mobile-services-dotnet-backend-windows-store-dotnet-get-started.md

[ClaimsIdentity]: https://msdn.microsoft.com/library/system.security.claims.claimsidentity(v=vs.110).aspx
[ProviderCredentials]: https://msdn.microsoft.com/library/azure/microsoft.windowsazure.mobile.service.security.providercredentials.aspx