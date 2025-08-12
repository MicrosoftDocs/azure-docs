---
title: Use variant feature flags in a Go Gin web application
titleSuffix: Azure App Configuration
description: In this tutorial, you learn how to use variant feature flags in a Go Gin web application to manage experiences for different user segments.
services: azure-app-configuration
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.custom: devx-track-go, mode-other
ms.topic: tutorial
ms.date: 08/12/2025
ms.author: linglingye
#Customer intent: As a Go developer, I want to use variant feature flags to provide different experiences to different user segments in my Gin web application.
---

# Tutorial: Use variant feature flags in a Go Gin web application

In this tutorial, you use a variant feature flag to manage experiences for different user segments in an example application, *Quote of the Day*. You utilize the variant feature flag created in [Use variant feature flags](./howto-variant-feature-flags.md). Before proceeding, ensure you create the variant feature flag named *Greeting* in your App Configuration store.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store, as shown in the [tutorial for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Go 1.21 or later. For information on installing Go, see the [Go downloads page](https://golang.org/dl/).
- [Azure App Configuration Go provider](https://pkg.go.dev/github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration) v1.1.0 or later.
- [Feature Management Go library](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement) v1.1.0 or later.
- Follow the [Use variant feature flags](./howto-variant-feature-flags.md) tutorial and create the variant feature flag named *Greeting*.

## Set up a Go Gin web application

If you already have a Go Gin web application, you can skip to the [Use the variant feature flag](#use-the-variant-feature-flag) section.

1. Create a new directory for your Go project and navigate into it:

    ```console
    mkdir quote-of-the-day
    cd quote-of-the-day
    ```

1. Initialize a new Go module:

    ```console
    go mod init quote-of-the-day
    ```

1. Install the required Go packages:

    ```console
    go get github.com/gin-gonic/gin
    go get github.com/gin-contrib/sessions
    go get github.com/gin-contrib/sessions/cookie
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig
    ```

1. Create a templates directory for your HTML templates:

    ```console
    mkdir templates
    ```

## Create a Go Gin web app

1. Create an HTML template for the home page. Add the following content to `templates/index.html`:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{.title}}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
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
                background-color: #ffffff;
                border-color: #ffffff;
                color: #333
            }

            .vote-container .btn:focus {
                outline: none;
                box-shadow: none;
            }

            .vote-container .btn:hover {
                background-color: #F0F0F0;
            }

            .greeting-content {
                font-family: 'Georgia', serif;
            }

            .quote-content p.quote {
                font-size: 2em;
                font-family: 'Georgia', serif;
                font-style: italic;
                color: #4EC2F7;
            }

            .navbar-brand {
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div class="container">
                <a class="navbar-brand" href="/">Quote of the Day</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="/">Home</a>
                        </li>
                    </ul>                <ul class="navbar-nav">
                        {{if .user}}
                        <li class="nav-item">
                            <span class="navbar-text me-3">Welcome, {{.user}}!</span>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="/logout">Logout</a>
                        </li>
                        {{else}}
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="/login">Login</a>
                        </li>
                        {{end}}
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">        {{if .user}}
            <div class="quote-container">
                <div class="quote-content">
                    {{if .greetingMessage}}
                    <h3 class="greeting-content">{{.greetingMessage}}</h3>
                    <br />
                    {{end}}
                    {{if .quote}}
                    <p class="quote">"{{.quote.Message}}"</p>
                    <p>- <b>{{.quote.Author}}</b></p>
                    {{else}}
                    <p class="quote">"Quote not found"</p>
                    <p>- <b>Unknown</b></p>
                    {{end}}
                </div>

                <div class="vote-container">
                    <button class="btn btn-primary" onclick="heartClicked(this)">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            {{else}}
            <div class="quote-container">
                <div class="quote-content">
                    {{if .quote}}
                    <p class="quote">"{{.quote.Message}}"</p>
                    <p>- <b>{{.quote.Author}}</b></p>
                    {{else}}
                    <p class="quote">"Quote not found"</p>
                    <p>- <b>Unknown</b></p>
                    {{end}}
                </div>

                <div class="vote-container">
                    <button class="btn btn-primary" onclick="heartClicked(this)">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
            {{end}}
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            function heartClicked(button) {
                var icon = button.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        </script>
    </body>
    </html>
    ```

1. Create an HTML template for the login page. Add the following content to `templates/login.html`:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{.title}}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div class="container">
                <a class="navbar-brand" href="/">Quote of the Day</a>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="/">Home</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="text-center">Login</h3>
                        </div>
                        <div class="card-body">
                            {{if .error}}
                            <div class="alert alert-danger" role="alert">
                                {{.error}}
                            </div>
                            {{end}}

                            <form method="post" action="/login">
                                <div class="mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input type="email" class="form-control" id="email" name="email" required 
                                        placeholder="Enter your email address">
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    ```

1. Create a file named `appconfig.go` with the following content. You can connect to your App Configuration store using Microsoft Entra ID (recommended) or a connection string.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

```golang
package main

import (
    "context"
    "log"
    "os"

    "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
    "github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
    // Get the endpoint from environment variable
    endpoint := os.Getenv("AZURE_APPCONFIG_ENDPOINT")
    if endpoint == "" {
        log.Fatal("AZURE_APPCONFIG_ENDPOINT environment variable is not set")
    }

    // Create a credential using DefaultAzureCredential
    credential, err := azidentity.NewDefaultAzureCredential(nil)
    if err != nil {
        log.Fatalf("Failed to create credential: %v", err)
    }

    // Set up authentication options with endpoint and credential
    authOptions := azureappconfiguration.AuthenticationOptions{
        Endpoint:   endpoint,
        Credential: credential,
    }

    // Set up options to enable feature flags
    options := &azureappconfiguration.Options{
        FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
            Enabled: true,
            RefreshOptions: azureappconfiguration.RefreshOptions{
                Enabled: true,
            },
        },
    }

    // Load configuration from Azure App Configuration
    appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
    if err != nil {
        log.Fatalf("Failed to load configuration: %v", err)
    }

    return appConfig, nil
}
```

### [Connection string](#tab/connection-string)

```golang
package main

import (
    "context"
    "log"
    "os"

    "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
)

func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.AzureAppConfiguration, error) {
    // Get the connection string from environment variable
    connectionString := os.Getenv("AZURE_APPCONFIG_CONNECTION_STRING")
    if connectionString == "" {
        log.Fatal("AZURE_APPCONFIG_CONNECTION_STRING environment variable is not set")
    }

    // Set up authentication options with connection string
    authOptions := azureappconfiguration.AuthenticationOptions{
        ConnectionString: connectionString,
    }

    // Set up options to enable feature flags
    options := &azureappconfiguration.Options{
        FeatureFlagOptions: azureappconfiguration.FeatureFlagOptions{
            Enabled: true,
            RefreshOptions: azureappconfiguration.RefreshOptions{
                Enabled: true,
            },
        },
    }

    // Load configuration from Azure App Configuration
    appConfig, err := azureappconfiguration.Load(ctx, authOptions, options)
    if err != nil {
        log.Fatalf("Failed to load configuration: %v", err)
    }

    return appConfig, nil
}
```

---

## Use the variant feature flag

1. Create a file named `main.go` with the following content:

    ```golang
    package main

    import (
        "context"
        "fmt"
        "log"
        "net/http"
        "strings"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
        "github.com/gin-contrib/sessions"
        "github.com/gin-contrib/sessions/cookie"
        "github.com/gin-gonic/gin"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
    )

    type Quote struct {
        Message string `json:"message"`
        Author  string `json:"author"`
    }

    type WebApp struct {
        featureManager *featuremanagement.FeatureManager
        appConfig      *azureappconfiguration.AzureAppConfiguration
        quotes         []Quote
    }

    func main() {
        // Load Azure App Configuration
        appConfig, err := loadAzureAppConfiguration(context.Background())
        if err != nil {
            log.Fatalf("Error loading Azure App Configuration: %v", err)
        }

        // Create feature flag provider
        featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
        if err != nil {
            log.Fatalf("Error creating feature flag provider: %v", err)
        }

        // Create feature manager
        featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
        if err != nil {
            log.Fatalf("Error creating feature manager: %v", err)
        }

        // Initialize quotes
        quotes := []Quote{
            {
                Message: "You cannot change what you are, only what you do.",
                Author:  "Philip Pullman",
            },
        }

        // Create web app
        app := &WebApp{
            featureManager: featureManager,
            appConfig:      appConfig,
            quotes:         quotes,
        }

        // Setup Gin with default middleware (Logger and Recovery)
        r := gin.Default()

        // Start server
        if err := r.Run(":8080"); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }

        fmt.Println("Starting Quote of the Day server on http://localhost:8080")
        fmt.Println("Open http://localhost:8080 in your browser")
        fmt.Println()
    }
    ```

1. Enable configuration and feature flag refresh from Azure App Configuration with the middleware.

    ```golang
    // Existing code
    // ... ...

    func (app *WebApp) refreshMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            go func() {
                if err := app.appConfig.Refresh(context.Background()); err != nil {
                    log.Printf("Error refreshing configuration: %v", err)
                }
            }()
            c.Next()
        }
    }
    // The rest of existing code
    //... ...
    ```

1. Set up the routes with the following content:

    ```golang
    // Existing code
    // ... ...

    func (app *WebApp) setupRoutes(r *gin.Engine) {
        // Setup sessions
        store := cookie.NewStore([]byte("secret-key-change-in-production"))
        store.Options(sessions.Options{
            MaxAge:   3600, // 1 hour
            HttpOnly: true,
            Secure:   false, // Set to true in production with HTTPS
        })
        r.Use(sessions.Sessions("session", store))

        r.Use(app.refreshMiddleware())

        // Load HTML templates
        r.LoadHTMLGlob("templates/*.html")
        // Routes
        r.GET("/", app.homeHandler)
        r.GET("/login", app.loginPageHandler)
        r.POST("/login", app.loginHandler)
        r.GET("/logout", app.logoutHandler)
    }

    // Home page handler
    func (app *WebApp) homeHandler(c *gin.Context) {
        session := sessions.Default(c)
        username := session.Get("username")
        quote := app.quotes[0]

        var greetingMessage string
        var targetingContext featuremanagement.TargetingContext
        if username != nil {
            // Create targeting context for the user
            targetingContext = createTargetingContext(username.(string))

            // Get the Greeting variant for the current user
            if variant, err := app.featureManager.GetVariant("Greeting", targetingContext); err != nil {
                log.Printf("Error getting Greeting variant: %v", err)
            } else if variant.ConfigurationValue != nil {
                // Extract the greeting message from the variant configuration
                if configValue, ok := variant.ConfigurationValue.(string); ok {
                    greetingMessage = configValue
                }
            }
        }

        c.HTML(http.StatusOK, "index.html", gin.H{
            "title":           "Quote of the Day",
            "user":            username,
            "greetingMessage": greetingMessage,
            "quote":           quote,
        })
    }

    func (app *WebApp) loginPageHandler(c *gin.Context) {
        c.HTML(http.StatusOK, "login.html", gin.H{
            "title": "Login - Quote of the Day",
        })
    }

    func (app *WebApp) loginHandler(c *gin.Context) {
        email := strings.TrimSpace(c.PostForm("email"))

        // Basic validation
        if email == "" {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login - Quote of the Day",
                "error": "Email cannot be empty",
            })
            return
        }

        if !strings.Contains(email, "@") {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login - Quote of the Day",
                "error": "Please enter a valid email address",
            })
            return
        }

        // Store email in session
        session := sessions.Default(c)
        session.Set("username", email)
        if err := session.Save(); err != nil {
            log.Printf("Error saving session: %v", err)
        }

        c.Redirect(http.StatusFound, "/")
    }

    func (app *WebApp) logoutHandler(c *gin.Context) {
        session := sessions.Default(c)
        session.Clear()
        if err := session.Save(); err != nil {
            log.Printf("Error saving session: %v", err)
        }
        c.Redirect(http.StatusFound, "/")
    }

    // Helper function to create TargetingContext
    func createTargetingContext(userID string) featuremanagement.TargetingContext {
        targetingContext := featuremanagement.TargetingContext{
            UserID: userID,
            Groups: []string{},
        }

        if strings.Contains(userID, "@") {
            parts := strings.Split(userID, "@")
            if len(parts) == 2 {
                domain := parts[1]
                targetingContext.Groups = append(targetingContext.Groups, domain) // Add domain as group
            }
        }

        return targetingContext
    }
    // The rest of existing code
    //... ...
    ```

1. Update the `main.go` with the following content:

    ```golang
    // Existing code
    // ... ...
	r := gin.Default()

	// Setup routes
	app.setupRoutes(r)

	// Start server
	if err := r.Run(":8080"); err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
    // The rest of existing code
    // ... ...
    ```
1. After completing the previous steps, your `main.go` file should now contain the complete implementation as shown below:

    ```golang
    package main

    import (
        "context"
        "fmt"
        "log"
        "net/http"
        "os"
        "strings"

        "github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
        "github.com/gin-contrib/sessions"
        "github.com/gin-contrib/sessions/cookie"
        "github.com/gin-gonic/gin"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
    )

    type Quote struct {
        Message string `json:"message"`
        Author  string `json:"author"`
    }

    type WebApp struct {
        featureManager *featuremanagement.FeatureManager
        appConfig      *azureappconfiguration.AzureAppConfiguration
        quotes         []Quote
    }

    func main() {
        // Load Azure App Configuration
        appConfig, err := loadAzureAppConfiguration(context.Background())
        if err != nil {
            log.Fatalf("Error loading Azure App Configuration: %v", err)
        }

        // Create feature flag provider
        featureFlagProvider, err := azappconfig.NewFeatureFlagProvider(appConfig)
        if err != nil {
            log.Fatalf("Error creating feature flag provider: %v", err)
        }

        // Create feature manager
        featureManager, err := featuremanagement.NewFeatureManager(featureFlagProvider, nil)
        if err != nil {
            log.Fatalf("Error creating feature manager: %v", err)
        }

        // Initialize quotes
        quotes := []Quote{
            {
                Message: "You cannot change what you are, only what you do.",
                Author:  "Philip Pullman",
            },
        }

        // Create web app
        app := &WebApp{
            featureManager: featureManager,
            appConfig:      appConfig,
            quotes:         quotes,
        }

        // Setup Gin with default middleware (Logger and Recovery)
        r := gin.Default()

        // Setup routes
        app.setupRoutes(r)

        // Start server
        if err := r.Run(":8080"); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }

        fmt.Println("Starting Quote of the Day server on http://localhost:8080")
        fmt.Println("Open http://localhost:8080 in your browser")
        fmt.Println()

    }

    func (app *WebApp) refreshMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            go func() {
                if err := app.appConfig.Refresh(context.Background()); err != nil {
                    log.Printf("Error refreshing configuration: %v", err)
                }
            }()
            c.Next()
        }
    }

    func (app *WebApp) setupRoutes(r *gin.Engine) {
        // Setup sessions
        store := cookie.NewStore([]byte("secret-key-change-in-production"))
        store.Options(sessions.Options{
            MaxAge:   3600, // 1 hour
            HttpOnly: true,
            Secure:   false, // Set to true in production with HTTPS
        })
        r.Use(sessions.Sessions("session", store))

        r.Use(app.refreshMiddleware())

        // Load HTML templates
        r.LoadHTMLGlob("templates/*.html")
        // Routes
        r.GET("/", app.homeHandler)
        r.GET("/login", app.loginPageHandler)
        r.POST("/login", app.loginHandler)
        r.GET("/logout", app.logoutHandler)
    }

    // Home page handler
    func (app *WebApp) homeHandler(c *gin.Context) {
        session := sessions.Default(c)
        username := session.Get("username")
        quote := app.quotes[0]

        var greetingMessage string
        var targetingContext featuremanagement.TargetingContext
        if username != nil {
            // Create targeting context for the user
            targetingContext = createTargetingContext(username.(string))

            // Get the Greeting variant for the current user
            if variant, err := app.featureManager.GetVariant("Greeting", targetingContext); err != nil {
                log.Printf("Error getting Greeting variant: %v", err)
            } else if variant.ConfigurationValue != nil {
                // Extract the greeting message from the variant configuration
                if configValue, ok := variant.ConfigurationValue.(string); ok {
                    greetingMessage = configValue
                }
            }
        }

        c.HTML(http.StatusOK, "index.html", gin.H{
            "title":           "Quote of the Day",
            "user":            username,
            "greetingMessage": greetingMessage,
            "quote":           quote,
        })
    }

    func (app *WebApp) loginPageHandler(c *gin.Context) {
        c.HTML(http.StatusOK, "login.html", gin.H{
            "title": "Login - Quote of the Day",
        })
    }

    func (app *WebApp) loginHandler(c *gin.Context) {
        email := strings.TrimSpace(c.PostForm("email"))

        // Basic validation
        if email == "" {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login - Quote of the Day",
                "error": "Email cannot be empty",
            })
            return
        }

        if !strings.Contains(email, "@") {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login - Quote of the Day",
                "error": "Please enter a valid email address",
            })
            return
        }

        // Store email in session
        session := sessions.Default(c)
        session.Set("username", email)
        if err := session.Save(); err != nil {
            log.Printf("Error saving session: %v", err)
        }

        c.Redirect(http.StatusFound, "/")
    }

    func (app *WebApp) logoutHandler(c *gin.Context) {
        session := sessions.Default(c)
        session.Clear()
        if err := session.Save(); err != nil {
            log.Printf("Error saving session: %v", err)
        }
        c.Redirect(http.StatusFound, "/")
    }

    // Helper function to create TargetingContext
    func createTargetingContext(userID string) featuremanagement.TargetingContext {
        targetingContext := featuremanagement.TargetingContext{
            UserID: userID,
            Groups: []string{},
        }

        if strings.Contains(userID, "@") {
            parts := strings.Split(userID, "@")
            if len(parts) == 2 {
                domain := parts[1]
                targetingContext.Groups = append(targetingContext.Groups, domain) // Add domain as group
            }
        }

        return targetingContext
    }
    ```

## Build and run the app

1. [Set the environment variable for authentication](./quickstart-go-web-app.md#run-the-web-application) and run the application:

    ```console
    go mod tidy
    go run .
    ```

1. Open your browser and navigate to `http://localhost:8080`. Select **Login** at the top right to sign in as **usera@contoso.com**.

    :::image type="content" source="./media/feature-filters/variant-home-go.png" alt-text="Screenshot of Gin web app before user login.":::

1. Once logged in, you see a long greeting message for **usera@contoso.com**.

    :::image type="content" source="./media/feature-filters/variant-long-go.jpg" alt-text="Screenshot of Gin web app, showing a long message for the user.":::

1. Click *Logout* and login as **userb@contoso.com**, you see the simple greeting message.

    :::image type="content" source="./media/feature-filters/variant-simple-go.jpg" alt-text="Screenshot of Gin web app, showing a simple message for the user.":::

    > [!NOTE]
    > It's important for the purpose of this tutorial to use these names exactly. As long as the feature has been configured as expected, the two users should see different variants.

## Next steps

To learn more about feature management in Go, continue to the following documents:

> [!div class="nextstepaction"]
> [Go Feature Management reference](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement)

> [!div class="nextstepaction"]
> [Roll out features to targeted audiences](./howto-targetingfilter-go.md)

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters-go.md)
