---
title: Roll out features to targeted audiences in a Go Gin web app
titleSuffix: Azure App Configuration
description: Learn how to enable staged rollout of features for targeted audiences in a Go Gin web application.
services: azure-app-configuration
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.custom: devx-track-go, mode-other
ms.topic: how-to
ms.date: 07/23/2025
ms.author: linglingye
#Customer intent: As a Go developer, I want to use targeting filters to control feature rollout to specific users and groups in my Gin web application.
---

# Roll out features to targeted audiences in a Go Gin web application

In this guide, you'll use the targeting filter to roll out a feature to targeted audiences for your Go Gin web application. For more information about the targeting filter, see [Roll out features to targeted audiences](./howto-targetingfilter.md).

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An App Configuration store, as shown in the [tutorial for creating a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- A feature flag with targeting filter. [Create the feature flag](./howto-targetingfilter.md).
- Go 1.21 or later. For information on installing Go, see the [Go downloads page](https://golang.org/dl/).
- [Azure App Configuration Go provider](https://pkg.go.dev/github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration) v1.1.0 or later.

## Create a web application with a feature flag

In this section, you create a web application that allows users to sign in and use the *Beta* feature flag you created before.

1. Create a new directory for your Go project and navigate into it:

    ```console
    mkdir gin-targeting-quickstart
    cd gin-targeting-quickstart
    ```

1. Initialize a new Go module:

    ```console
    go mod init gin-targeting-quickstart
    ```

1. Install the required Go packages:

    ```console
    go get github.com/gin-gonic/gin
    go get github.com/gin-contrib/sessions
    go get github.com/gin-contrib/sessions/cookie
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement
    go get github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig
    ```

1. Create a templates directory for your HTML templates and add the required HTML files:

    ```bash
    mkdir templates
    ```

    Add the following HTML template files from the [GitHub repo](https://github.com/microsoft/FeatureManagement-Go/tree/main/example/quickstart/gin-targeting-quickstart/templates) and place them in the `templates` directory:
    
    - [`index.html`](https://github.com/microsoft/FeatureManagement-Go/blob/main/example/quickstart/gin-targeting-quickstart/templates/index.html) - The home page template
    - [`beta.html`](https://github.com/microsoft/FeatureManagement-Go/blob/main/example/quickstart/gin-targeting-quickstart/templates/beta.html) - The beta page template
    - [`login.html`](https://github.com/microsoft/FeatureManagement-Go/blob/main/example/quickstart/gin-targeting-quickstart/templates/login.html) - The login page template

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

## Use targeting with feature flags 

1. Create a file named `main.go` with the following content.

    ```golang
    package main

    import (
        "context"
        "fmt"
        "log"
        "net/http"
        "strings"

        "github.com/gin-contrib/sessions"
        "github.com/gin-contrib/sessions/cookie"
        "github.com/gin-gonic/gin"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
    )

    type WebApp struct {
        featureManager *featuremanagement.FeatureManager
        appConfig      *azureappconfiguration.AzureAppConfiguration
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

        // Create web app
        app := &WebApp{
            featureManager: featureManager,
            appConfig:      appConfig,
        }

        // Setup Gin with default middleware (Logger and Recovery)
        r := gin.Default()

        // Start server
        if err := r.Run(":8080"); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }

        fmt.Println("Starting server on http://localhost:8080")
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

    func (app *WebApp) featureMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            // Get current user from session
            session := sessions.Default(c)
            username := session.Get("username")

            var betaEnabled bool
            var targetingContext featuremanagement.TargetingContext
            if username != nil {
                // Evaluate Beta feature with targeting context
                var err error
                targetingContext = createTargetingContext(username.(string))
                betaEnabled, err = app.featureManager.IsEnabledWithAppContext("Beta", targetingContext)
                if err != nil {
                    log.Printf("Error checking Beta feature with targeting: %v", err)
                }
            }

            c.Set("betaEnabled", betaEnabled)
            c.Set("user", username)
            c.Set("targetingContext", targetingContext)
            c.Next()
        }
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
                targetingContext.Groups = append(targetingContext.Groups, parts[1]) // Add domain as group
            }
        }

        return targetingContext
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
        r.Use(app.featureMiddleware())

        // Load HTML templates
        r.LoadHTMLGlob("templates/*.html")

        // Routes
        r.GET("/", app.homeHandler)
        r.GET("/beta", app.betaHandler)
        r.GET("/login", app.loginPageHandler)
        r.POST("/login", app.loginHandler)
        r.GET("/logout", app.logoutHandler)
    }

    // Home page handler
    func (app *WebApp) homeHandler(c *gin.Context) {
        betaEnabled := c.GetBool("betaEnabled")
        user := c.GetString("user")

        c.HTML(http.StatusOK, "index.html", gin.H{
            "title":       "TestFeatureFlags",
            "betaEnabled": betaEnabled,
            "user":        user,
        })
    }

    // Beta page handler
    func (app *WebApp) betaHandler(c *gin.Context) {
        betaEnabled := c.GetBool("betaEnabled")
        if !betaEnabled {
            return
        }

        c.HTML(http.StatusOK, "beta.html", gin.H{
            "title": "Beta Page",
        })
    }

    func (app *WebApp) loginPageHandler(c *gin.Context) {
        c.HTML(http.StatusOK, "login.html", gin.H{
            "title": "Login",
        })
    }

    func (app *WebApp) loginHandler(c *gin.Context) {
        username := c.PostForm("username")

        // Basic validation - ensure username is not empty
        if strings.TrimSpace(username) == "" {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login",
                "error": "Username cannot be empty",
            })
            return
        }

        // Store username in session - any valid username is accepted
        session := sessions.Default(c)
        session.Set("username", username)
        session.Save()
        c.Redirect(http.StatusFound, "/")
    }

    func (app *WebApp) logoutHandler(c *gin.Context) {
        session := sessions.Default(c)
        session.Clear()
        session.Save()
        c.Redirect(http.StatusFound, "/")
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
        "strings"

        "github.com/gin-contrib/sessions"
        "github.com/gin-contrib/sessions/cookie"
        "github.com/gin-gonic/gin"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement"
        "github.com/microsoft/Featuremanagement-Go/featuremanagement/providers/azappconfig"
    )

    type WebApp struct {
        featureManager *featuremanagement.FeatureManager
        appConfig      *azureappconfiguration.AzureAppConfiguration
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

    func (app *WebApp) featureMiddleware() gin.HandlerFunc {
        return func(c *gin.Context) {
            // Get current user from session
            session := sessions.Default(c)
            username := session.Get("username")

            var betaEnabled bool
            var targetingContext featuremanagement.TargetingContext
            if username != nil {
                // Evaluate Beta feature with targeting context
                var err error
                targetingContext = createTargetingContext(username.(string))
                betaEnabled, err = app.featureManager.IsEnabledWithAppContext("Beta", targetingContext)
                if err != nil {
                    log.Printf("Error checking Beta feature with targeting: %v", err)
                }
            }

            c.Set("betaEnabled", betaEnabled)
            c.Set("user", username)
            c.Set("targetingContext", targetingContext)
            c.Next()
        }
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
                targetingContext.Groups = append(targetingContext.Groups, parts[1]) // Add domain as group
            }
        }

        return targetingContext
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
        r.Use(app.featureMiddleware())

        // Load HTML templates
        r.LoadHTMLGlob("templates/*.html")

        // Routes
        r.GET("/", app.homeHandler)
        r.GET("/beta", app.betaHandler)
        r.GET("/login", app.loginPageHandler)
        r.POST("/login", app.loginHandler)
        r.GET("/logout", app.logoutHandler)
    }

    // Home page handler
    func (app *WebApp) homeHandler(c *gin.Context) {
        betaEnabled := c.GetBool("betaEnabled")
        user := c.GetString("user")

        c.HTML(http.StatusOK, "index.html", gin.H{
            "title":       "TestFeatureFlags",
            "betaEnabled": betaEnabled,
            "user":        user,
        })
    }

    // Beta page handler
    func (app *WebApp) betaHandler(c *gin.Context) {
        betaEnabled := c.GetBool("betaEnabled")
        if !betaEnabled {
            return
        }

        c.HTML(http.StatusOK, "beta.html", gin.H{
            "title": "Beta Page",
        })
    }

    func (app *WebApp) loginPageHandler(c *gin.Context) {
        c.HTML(http.StatusOK, "login.html", gin.H{
            "title": "Login",
        })
    }

    func (app *WebApp) loginHandler(c *gin.Context) {
        username := c.PostForm("username")

        // Basic validation - ensure username is not empty
        if strings.TrimSpace(username) == "" {
            c.HTML(http.StatusOK, "login.html", gin.H{
                "title": "Login",
                "error": "Username cannot be empty",
            })
            return
        }

        // Store username in session - any valid username is accepted
        session := sessions.Default(c)
        session.Set("username", username)
        session.Save()
        c.Redirect(http.StatusFound, "/")
    }

    func (app *WebApp) logoutHandler(c *gin.Context) {
        session := sessions.Default(c)
        session.Clear()
        session.Save()
        c.Redirect(http.StatusFound, "/")
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

        // Create web app
        app := &WebApp{
            featureManager: featureManager,
            appConfig:      appConfig,
        }

        // Setup Gin with default middleware (Logger and Recovery)
        r := gin.Default()

        // Setup routes
        app.setupRoutes(r)

        // Start server
        if err := r.Run(":8080"); err != nil {
            log.Fatalf("Failed to start server: %v", err)
        }

        fmt.Println("Starting server on http://localhost:8080")
        fmt.Println("Open http://localhost:8080 in your browser")
        fmt.Println()
    }
    ```

## Targeting filter in action

1. [Set the environment variable for authentication](./quickstart-go-web-app.md#run-the-web-application) and run the application:

    ```console
    go mod tidy
    go run .
    ```

1. Open a browser window, and go to `http://localhost:8080`. Initially, the **Beta** item doesn't appear on the toolbar, because the *Default percentage* option is set to 0.

    :::image type="content" source="./media/feature-filters/beta-not-targeted-by-default-go.png" alt-text="Screenshot of Gin web app before user login showing no beta access.":::

1. Click the **Login** link in the upper right corner. Try logging in with `test@contoso.com`.

1. After logging in as `test@contoso.com`, the **Beta** item now appears on the toolbar, because `test@contoso.com` is specified as a targeted user.

    :::image type="content" source="./media/feature-filters/beta-targeted-by-user-go.png" alt-text="Screenshot of Gin web app after targeted user login showing beta access.":::

1. Now logout and login as `testuser@contoso.com`. The **Beta** item doesn't appear on the toolbar, because `testuser@contoso.com` is specified as an excluded user.

## Next steps

To learn more about the feature filters, continue to the following documents.

> [!div class="nextstepaction"]
> [Enable conditional features with feature filters](./howto-feature-filters.md)

> [!div class="nextstepaction"]
> [Enable features on a schedule](./howto-timewindow-filter-aspnet-core.md)

For more information about the Go Feature Management library, continue to the following document:

> [!div class="nextstepaction"]
> [Go Feature Management reference](https://pkg.go.dev/github.com/microsoft/Featuremanagement-Go/featuremanagement)
