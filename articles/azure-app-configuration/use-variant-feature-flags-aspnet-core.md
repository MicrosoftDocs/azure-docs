---
title: 'Tutorial: Use variant feature flags from Azure App Configuration in an ASP.NET application'
titleSuffix: Azure App configuration
description: In this tutorial, you learn how to use variant feature flags in an ASP.NET application
#customerintent: As a user of Azure App Configuration, I want to learn how I can use variants and variant feature flags in my ASP.NET application.
author: rossgrambo
ms.author: rossgrambo
ms.service: azure-app-configuration
ms.devlang: csharp
ms.topic: tutorial
ms.date: 10/10/2024
---

# Tutorial: Use variant feature flags from Azure App Configuration in an ASP.NET application

In this tutorial, you:

> [!div class="checklist"]
> * Create a variant feature flag
> * Set up an app to consume variant feature flags

## Prerequisites

* An Azure subscription. If you don’t have one, [create one for free](https://azure.microsoft.com/free/).
* An [App Configuration store](./quickstart-azure-app-configuration-create.md).

## Create a variant feature flag

Create a variant feature flag called *Greeting* with no label and three variants, *None*, *Simple*, and *Long*. Creating variant flags is described in the [Feature Flag quickstart](./manage-feature-flags.md#create-a-variant-feature-flag).

| Variant Name | Variant Configuration Value | Allocation| 
|---|---|---|
| None *(Default)* | null | 50% |
| Simple | "Hello!" | 25% |
| Long | "I hope this makes your day!" | 25% | 

## Set up an app to use the variants

In this example, you create an ASP.NET web app named _Quote of the Day_. When the app is loaded, it displays a quote. Users can interact with the heart button to like it. To improve user engagement, you want to explore whether a personalized greeting message will increase the number of users who like the quote. Users who receive the _None_ variant will see no greeting. Users who receive the _Simple_ variant will get a simple greeting message. Users who receive the _Long_ variant will get a slightly longer greeting. 

### Create an app and add user secrets

1. Open a command prompt and run the following code. This creates a new Razor Pages application in ASP.NET Core, using Individual account auth, and places it in an output folder named *QuoteOfTheDay*.

    ```dotnetcli
    dotnet new razor --auth Individual -o QuoteOfTheDay
    ```

1. In the command prompt, navigate to the *QuoteOfTheDay* folder and run the following command to create a [user secret](/aspnet/core/security/app-secrets) for the application. This secret holds the connection string for App Configuration.

    ```dotnetcli
    dotnet user-secrets set ConnectionStrings:AppConfiguration "<App Configuration Connection string>"
    ```

### Update the application code

1. In *QuoteOfTheDay.csproj*, add the latest versions of the Feature Management and App Configuration SDKs as required packages.

    ```csharp
    <PackageReference Include="Microsoft.Azure.AppConfiguration.AspNetCore" Version="8.0.0" />
    <PackageReference Include="Microsoft.FeatureManagement.AspNetCore" Version="4.0.0" />
    ```

1. In *Program.cs*, under the line `var builder = WebApplication.CreateBuilder(args);`, add the App Configuration provider, which pulls down the configuration from Azure when the application starts. By default, the UseFeatureFlags method includes all feature flags with no label.

    ```csharp
    builder.Configuration
        .AddAzureAppConfiguration(options =>
        {
            options.Connect(builder.Configuration.GetConnectionString("AppConfiguration"));
    
            options.UseFeatureFlags();
        });
    ```

1. In *Program.cs*, add the following using statements.

    ```csharp
    using Microsoft.FeatureManagement;
    ```

1. Set up Feature Management and enable Feature Management Targeting.

    ```csharp
    // Add Azure App Configuration and feature management services to the container.
    builder.Services.AddAzureAppConfiguration()
        .AddFeatureManagement()
        .WithTargeting();
    ```

1. Under the line `var app = builder.Build();`, add a middleware that triggers App Configuration refresh when appropriate.

    ```csharp
    // Use Azure App Configuration middleware for dynamic configuration refresh.
    app.UseAzureAppConfiguration();
    ```

1. In *QuoteOfTheDay* > *Pages* > *Shared* > *_Layout.cshtml*, under where `QuoteOfTheDay.styles.css` is added, add the following line to add the css for version 5.15.3 of `font-awesome`.

    ```css
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    ```

1. Open *QuoteOfTheDay* > *Pages* > *Index.cshtml.cs* and overwrite the content to the quote app.

    ```csharp
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.RazorPages;
    using Microsoft.FeatureManagement;
    
    namespace QuoteOfTheDay.Pages;
    
    public class Quote
    {
        public string Message { get; set; }
    
        public string Author { get; set; }
    }
    
    public class IndexModel(IVariantFeatureManagerSnapshot featureManager) : PageModel
    {
        private readonly IVariantFeatureManagerSnapshot _featureManager = featureManager;
    
        private Quote[] _quotes = [
            new Quote()
            {
                Message = "You cannot change what you are, only what you do.",
                Author = "Philip Pullman"
            }];
    
        public Quote? Quote { get; set; }
    
        public string Greeting { get; set; }
    
        public async void OnGet()
        {
            Quote = _quotes[new Random().Next(_quotes.Length)];
    
            Variant variant = await _featureManager.GetVariantAsync("Greeting", HttpContext.RequestAborted);

            if (variant != null)
            {
                Greeting = variant.Configuration?.Get<string>() ?? "";
            }
            else
            {
                _logger.LogWarning("Greeting variant not found. Please define a variant feature flag in Azure App Configuration named 'Greeting'.");
            }
        }
    
        public IActionResult OnPostHeartQuoteAsync()
        {
            string? userId = User.Identity?.Name;
    
            if (!string.IsNullOrEmpty(userId))
            {
                return new JsonResult(new { success = true });
            }
            else
            {
                return new JsonResult(new { success = false, error = "User not authenticated" });
            }
        }
    }
    ```

    This `PageModel` picks a random quote, uses `GetVariantAsync` to get the variant for the current user, and sets a variable called "Greeting" to the variant's value. The `PageModel` also handles likes, which are sent as post requests. 

1. Open *index.cshtml* and overwrite the content for the quote app.

    ```cshtml
    @page
    @model IndexModel
    @{
        ViewData["Title"] = "Home page";
        ViewData["Username"] = User.Identity.Name;
    }
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
    
        .quote-container {
            background-color: #fff;
            margin: 2em auto;
            padding: 2em;
            border-radius: 8px;
            max-width: 750px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: start;
            position: relative;
        }
    
        .vote-container {
            position: absolute;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 0em;
        }
    
        .vote-container .btn {
            background-color: #ffffff; /* White background */
            border-color: #ffffff; /* Light blue border */
            color: #333
        }
    
        .vote-container .btn:focus {
            outline: none;
            box-shadow: none;
        }
    
        .vote-container .btn:hover {
            background-color: #F0F0F0; /* Light gray background */
        }
    
        .greeting-content {
            font-family: 'Georgia', serif; /* More artistic font */
        }
    
        .quote-content p.quote {
            font-size: 2em; /* Bigger font size */
            font-family: 'Georgia', serif; /* More artistic font */
            font-style: italic; /* Italic font */
            color: #4EC2F7; /* Medium-light blue color */
        }
    </style>
    
    <div class="quote-container">
        <div class="quote-content">
            @if (Model.ShowGreeting)
            {
                <h3 class="greeting-content">Hi <b>@User.Identity.Name</b>, hope this makes your day!</h3>
            }
            else
            {
                <h3 class="greeting-content">Quote of the day</h3>
            }
            <br />
            <p class="quote">“@Model.Quote.Message”</p>
            <p>- <b>@Model.Quote.Author</b></p>
        </div>
    
        <div class="vote-container">
            <button class="btn btn-primary" onclick="heartClicked(this)">
                <i class="far fa-heart"></i> <!-- Heart icon -->
            </button>
        </div>
    
        <form action="/" method="post">
            @Html.AntiForgeryToken()
        </form>
    </div>
    
    <script>
        function heartClicked(button) {
            var icon = button.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
    
            // If the quote is hearted
            if (icon.classList.contains('fas')) {
                // Send a request to the server to save the vote
                fetch('/Index?handler=HeartQuote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]').value
                    }
                });
            }
        }
    </script>
    ```

    This code corresponds to the UI to show the QuoteOfTheDay and handle using the heart action on a quote. It uses the previously mentioned `Model.ShowGreeting` value to show different things to different users, depending on their variant.

### Build and run the app

1. In the command prompt, in the *QuoteOfTheDay* folder, run: `dotnet build`.
1. Run: `dotnet run --launch-profile https`.
1. Look for a message in the format `Now listening on: https://localhost:{port}` in the output of the application. Navigate to the included link in your browser.
1. Once viewing the running application, select **Register** at the top right to register a new user.

    :::image type="content" source="media/use-variant-feature-flags-aspnet-core/register.png" alt-text="Screenshot of the Quote of the day app, showing Register.":::

1. Register a new user named *usera@contoso.com*. The password must have at least six characters and contain a number and a special character.

1. Select the link **Click here to validate email** after entering user information.

    :::image type="content" source="media/use-variant-feature-flags-aspnet-core/click-to-confirm.png" alt-text="Screenshot of the Quote of the day app, showing click to confirm.":::

1. Register a second user named *userb@contoso.com*, enter another password, and validate this second email.

    > [!NOTE]
    > It's important for the purpose of this tutorial to use these names exactly. As long as the feature has been configured as expected, the two users should see different variants.

1. Select **Login** at the top right to sign in as userb (userb@contoso.com).

    :::image type="content" source="media/use-variant-feature-flags-aspnet-core/login.png" alt-text="Screenshot of the Quote of the day app, showing **Login**.":::

1. Once logged in, you should see that usera@contoso.com sees the long message when viewing the app, and userb@contoso.com sees the simple message.

    :::image type="content" source="media/use-variant-feature-flags-aspnet-core/special-message.png" alt-text="Screenshot of the Quote of the day app, showing a special message for the user.":::

    *usera@contoso.com* sees the long message.

## Next steps

To learn more about the experimentation concepts, refer to the following document.

> [!div class="nextstepaction"]
> [Experimentation](./concept-experimentation.md)

For the full feature rundown of the .NET feature management library, refer to the following document.

> [!div class="nextstepaction"]
> [.NET Feature Management](./feature-management-dotnet-reference.md)
