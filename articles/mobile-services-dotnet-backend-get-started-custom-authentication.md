<properties 
	pageTitle="Get started with custom authentication | Mobile Dev Center" 
	description="Learn how to authenticate users with a username and password." 
	documentationCenter="windows" 
	authors="mattchenderson" 
	manager="dwrede" 
	editor="" 
	services=""/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-multiple" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="11/21/2014" 
	ms.author="mahender"/>

# Get started with custom authentication

This topic shows you how to authenticate users in the Azure Mobile Services .NET backend by issuing your own Mobile Services authentication token. In this tutorial, you add authentication to the quickstart project using a custom username and password for your app.

>[AZURE.NOTE] This tutorial demonstrates an advanced method of authenticating your Mobile Services with custom credentials. Many apps will be best suited to instead use the built-in social identity providers, allowing users to log in via Facebook, Twitter, Google, Microsoft Account, and Azure Active Directory. If this is your first experience with authentication in Mobile Services, please see the [Get Started with Users] tutorial.

This tutorial walks you through these basic steps to enable authentication in your app:

1. [Set up the accounts table]
2. [Create the registration endpoint]
3. [Create the LoginProvider]
4. [Create the login endpoint]
5. [Configure the mobile service to require authentication]
6. [Test the login flow using the test client]

This tutorial is based on the Mobile Services quickstart. You must also first complete the tutorial [Get started with Mobile Services]. 

>[AZURE.NOTE] The purpose of this tutorial is to show you how to issue an authentication token for Mobile Services. This is not to be taken as security guidance. In developing your app, you need to be aware of the security implications of password storage, and you need to have a strategy for managing brute-force attacks.


## <a name="table-setup"></a>Set up the accounts table

Because you are using custom authentication and not relying on another identity provider, you will need to store your users' login information. In this section, you will create a table for your accounts and set up the basic security mechanisms. The accounts table will contain the usernames and the salted and hashed passwords, and you can also include additional user information if needed.

1. In the `DataObjects` folder of your backend project, create a new entity called `Account`:

            public class Account : EntityData
            {
                public string Username { get; set; }
                public byte[] Salt { get; set; }
                public byte[] SaltedAndHashedPassword { get; set; }
            }
    
    This will represent a row in our new table, and it will contain the user name, that user's salt, and the securly stored password.

2. Under the `Models` folder, you will find a `DbContext` class named after your Mobile Service. The rest of this tutorial will use `todoContext` as an example, and you will need to update code snippets accordingly. Open your context and add the accounts table to your data model by including the following:

        public DbSet<Account> Accounts { get; set; }

3. Next, you will set up the security functions for working with this data. You will need a means to generate a new long salt, the ability to hash a salted password, and a secure way of comparing two hashes. Create a class called `CustomLoginProviderUtils` and add the following methods to it:


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


## <a name="register-endpoint"></a>Create the registration endpoint

At this point, you have everything you need to begin creating user accounts. In this section, you will set up a registration endpoint to handle new registration requests. This is where you will enforce new username and password policies and ensure that the username is not taken. Then you will safely store the user information in your database.

1. Create an object to represent an incoming registration attempt:

        public class RegistrationRequest
        {
            public String username { get; set; }
            public String password { get; set; }
        }

    If you wish to collect other information at registration time, you can include it here.

1. In your Mobile Services backend project, add a new custom controller named CustomRegistrationController and paste in the following:

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
                    return this.Request.CreateResponse(HttpStatusCode.BadRequest, "Username already exists");
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

    Be sure that you allow all traffic to this endpoint by decorating the controller with:

        [AuthorizeLevel(AuthorizationLevel.Anonymous)]

## <a name="login-provider"></a>Create the LoginProvider

One of the fundamental constructs in the Mobile Services authentication pipeline is the `LoginProvider`. In this section, you will create your own `CustomLoginProvider`. It will not be plugged into the pipeline like the built-in providers, but it will provide you with some convenient functionality.

1. Create a new class, `CustomLoginProvider`, which derives from `LoginProvider`:

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

       `LoginProvider` has three other abstract methods which you will implement later.

2. Create a new class named `CustomLoginProviderCredentials`. This represents information about your user and will be made available to you on the backend via `ServiceUser.getIdentitiesAsync()`. If you are adding custom claims, make sure that they are captured in this object.

        public class CustomLoginProviderCredentials : ProviderCredentials
        {
            public CustomLoginProviderCredentials()
                : base(CustomLoginProvider.ProviderName)
            {
            }
        }

3. Add the following implementation of the abstract method `ConfigureMiddleware` to `CustomLoginProvider`. This method is a no-op here since `CustomLoginProvider` is not integrating with the authentication pipeline.

        public override void ConfigureMiddleware(IAppBuilder appBuilder, ServiceSettingsDictionary settings)
        {
            // Not Applicable - used for federated identity flows
            return;
        }

4. Add the following implementation of the abstract method `ParseCredentials` to `CustomLoginProvider`. This method will allow the backend to deserialize user information from an incoming authentication token.

        public override ProviderCredentials ParseCredentials(JObject serialized)
        {
            if (serialized == null)
            {
                throw new ArgumentNullException("serialized");
            }

            return serialized.ToObject<CustomLoginProviderCredentials>();
        }


5. Add the following implementation of the abstract method `CreateCredentials` to `CustomLoginProvider`. This method translates a `ClaimsIdentity` into a `ProviderCredentials` object that is used in the authentication token issuance phase. You will again want to capture any additional claims here.

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

## <a name="login-endpoint"></a>Create the login endpoint

Next, you will create an endpoint for your users to log in. The username and password that you receive will be checked against the database by first applying the user's salt, hashing the password, and making sure that the incoming value matches that of the database. If it does, then you can create a `ClaimsIdentity` and pass it to the `CustomLoginProvider`. The client app will then receive a user ID and an authentication token for further access to your mobile service.

1. In your Mobile Services backend project, create an object to represent an incoming login attempt:

        public class LoginRequest
        {
            public String username { get; set; }
            public String password { get; set; }
        }

1. Add a new custom controller named `CustomLoginController` and paste in the following:

        [AuthorizeLevel(AuthorizationLevel.Anonymous)]
        public class CustomLoginController : ApiController
        {
            public ApiServices Services { get; set; }
            public IServiceTokenHandler handler { get; set; }

            // POST api/CustomLogin
            public HttpResponseMessage Post(LoginRequest loginRequest)
            {
                todoContext context = new todoContext();
                Account account = context.Accounts.Where(a => a.Username == loginRequest.username).SingleOrDefault();
                if (account != null)
                {
                    byte[] incoming = CustomLoginProviderUtils.hash(loginRequest.password, account.Salt);

                    if (CustomLoginProviderUtils.slowEquals(incoming, account.SaltedAndHashedPassword))
                    {
                        ClaimsIdentity claimsIdentity = new ClaimsIdentity();
                        claimsIdentity.AddClaim(new Claim(ClaimTypes.NameIdentifier, loginRequest.username));
                        LoginResult loginResult = new CustomLoginProvider(handler).CreateLoginResult(claimsIdentity, Services.Settings.MasterKey);
                        return this.Request.CreateResponse(HttpStatusCode.OK, loginResult);
                    }
                }
                return this.Request.CreateResponse(HttpStatusCode.Unauthorized, "Invalid username or password");
            }
        }

    Be sure that you allow all traffic to this endpoint by decorating the controller with:

        [AuthorizeLevel(AuthorizationLevel.Anonymous)]

>[AZURE.NOTE] Your `CustomLoginController` for production use should also contain a brute-force detection strategy. Otherwise your login solution may be vulnerable to attack.

## <a name="require-authentication"></a>Configure the mobile service to require authentication

[AZURE.INCLUDE [mobile-services-restrict-permissions-dotnet-backend](../includes/mobile-services-restrict-permissions-dotnet-backend.md)]


## <a name="test-login"></a>Test the login flow using the test client

In your client application, you will need to develop a custom login screen which takes usernames and passwords and sends them as a JSON payload to your registration and login endpoints. To complete this tutorial, you will instead just use the built-in test client for the Mobile Services .NET backend.

>[AZURE.NOTE] The Mobile Services SDKs will communicate with the service over HTTPS. If you plan to access this endpoint via a direct REST call, you must make sure that you use HTTPS to call your mobile service, as passwords are being sent as plaintext.

1. In Visual Studio, start a new debugging instance of your Mobile Services backend project by right-clicking on the project and selecting **Debug->Start New Instance**

    ![][0]

2. Click **Try it out**

    ![][1]

3. Select your registration endpoint. You can see some basic documentation for your API. Click **Try this out**.

    ![][2]

4. In the body, replace the sample strings with a username and password which meet the criteria you specified before. Then click **Send**. The response should be **201/Created**.

    ![][3]

5. Repeat this process for your login endpoint. After sending the same username and password that you registered before, you should receive your user's ID and an authentication token.

    ![][4]


<!-- Anchors. -->
[Set up the accounts table]: #table-setup
[Create the registration endpoint]: #register-endpoint
[Create the LoginProvider]: #login-provider
[Create the login endpoint]: #login-endpoint
[Configure the mobile service to require authentication]: #require-authentication
[Test the login flow using the test client]: #test-login


<!-- Images. -->
[0]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-debug-start.png
[1]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-try-out.png
[2]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-test-client.png
[3]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-send-register.png
[4]: ./media/mobile-services-dotnet-backend-get-started-custom-authentication/mobile-services-dotnet-backend-custom-auth-login-result.png


<!-- URLs. -->
[Get Started with Users]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-users
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started