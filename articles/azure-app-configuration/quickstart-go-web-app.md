---
title: Quickstart for using Azure App Configuration with Go web applications
description: In this quickstart, create a Go web application with Azure App Configuration to centralize storage and management of application settings separate from your code.
services: azure-app-configuration
author: linglingye
ms.service: azure-app-configuration
ms.devlang: golang
ms.topic: quickstart
ms.custom:
  - quickstart
  - mode-other
  - devx-track-go
  - build-2025
ms.date: 03/31/2025
ms.author: linglingye
#Customer intent: As a Go web developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Go web app with Azure App Configuration

In this quickstart, you use Azure App Configuration to centralize storage and management of application settings for a Go web application using the [Gin framework](https://gin-gonic.com/) and the [Azure App Configuration Go provider](https://github.com/Azure/AppConfiguration-GoProvider).

The App Configuration provider for Go simplifies the effort of applying key-values from Azure App Configuration to Go application. It enables binding settings to Go struct. It offers features like configuration composition from multiple labels, key prefix trimming, automatic resolution of Key Vault references, and many more.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Go 1.18 or later. [Install Go](https://golang.org/doc/install).

## Add key-values

Add the following key-values to the App Configuration store and leave **Label** and **Content Type** with their default values. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                  | Value                               |
|----------------------|-------------------------------------|
| Config.Message       | Hello from Azure App Configuration  |
| Config.App.Name      | Gin Sample App                      |
| Config.App.DebugMode | true                                |

## Create a Go web application

1. Create a new directory for your web application.

    ```bash
    mkdir app-configuration-web
    cd app-configuration-web
    ```

2. Initialize a new Go module.

    ```bash
    go mod init app-configuration-web
    ```

3. Add the required dependencies.

    ```bash
    go get github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration
    go get github.com/gin-gonic/gin
    ```

4. Create a templates directory for your HTML templates.

    ```bash
    mkdir templates
    ```

5. Create an HTML template for the home page. Add the following content to `templates/index.html`:

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{.Title}}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
            .container {
                margin: 50px auto;
                max-width: 800px;
                text-align: center;
                background-color: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #666;
                font-size: 18px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>{{.Message}}</h1>
            <p>{{.App}}</p>
        </div>
    </body>
    </html>
    ```

## Connect to an App Configuration store

Now you'll create a Go web application using the Gin framework that loads its configuration from Azure App Configuration.

### Create a web application with Gin

Create a file named `main.go` with the following content:

### [Microsoft Entra ID (recommended)](#tab/entra-id)

```go
package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
	"github.com/gin-gonic/gin"
)

// Config defines the application configuration structure
type Config struct {
	App     App
	Message string
}

// App contains application-specific configuration
type App struct {
	Name      string
	DebugMode bool
}

// loadConfiguration handles loading the configuration from Azure App Configuration
func loadConfiguration() (Config, error) {
	// Get endpoint from environment variable
	endpoint := os.Getenv("AZURE_APPCONFIG_ENDPOINT")
	if endpoint == "" {
		log.Fatal("AZURE_APPCONFIG_ENDPOINT environment variable is not set")
	}

	// Create a credential using DefaultAzureCredential
	credential, err := azidentity.NewDefaultAzureCredential(nil)
	if err != nil {
		log.Fatalf("Failed to create credential: %v", err)
	}

	// Set up authentication options
	authOptions := azureappconfiguration.AuthenticationOptions{
		Endpoint:   endpoint,
		Credential: credential,
	}

	// Configuration setup
	options := &azureappconfiguration.Options{
		Selectors: []azureappconfiguration.Selector{
			{
				KeyFilter:   "Config.*",
				LabelFilter: "",
			},
		},
		// Remove the prefix when mapping to struct fields
		TrimKeyPrefixes: []string{"Config."},
	}

	// Create configuration provider with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	appCfgProvider, err := azureappconfiguration.Load(ctx, authOptions, options)
	if err != nil {
		return Config{}, err
	}

	// Parse configuration into struct
	var config Config
	err = appCfgProvider.Unmarshal(&config, nil)
	if err != nil {
		return Config{}, err
	}

	return config, nil
}

func main() {
	// Load configuration
	config, err := loadConfiguration()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Configure Gin based on app settings
	if config.App.DebugMode {
		// Set Gin to debug mode for development
		gin.SetMode(gin.DebugMode)
		log.Println("Running in DEBUG mode")
	} else {
		// Set Gin to release mode for production
		gin.SetMode(gin.ReleaseMode)
		log.Println("Running in RELEASE mode")
	}

	// Initialize Gin router
	r := gin.Default()

	// Load HTML templates
	r.LoadHTMLGlob("templates/*")

	// Define a route for the homepage
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{
			"Title":   "Home",
			"Message": config.Message,
			"App":     config.App.Name,
		})
	})

	// Start the server on port 8080
	log.Printf("Starting %s on http://localhost:8080", config.App.Name)
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
```

### [Connection string](#tab/connection-string)

```go
package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
	"github.com/gin-gonic/gin"
)

// Config defines the application configuration structure
type Config struct {
	App     App
	Message string
}

// App contains application-specific configuration
type App struct {
	Name      string
	DebugMode bool
}

// loadConfiguration handles loading the configuration from Azure App Configuration
func loadConfiguration() (Config, error) {
	// Get connection string from environment variable
	connectionString := os.Getenv("AZURE_APPCONFIG_CONNECTION_STRING")
	if connectionString == "" {
		log.Fatal("AZURE_APPCONFIG_CONNECTION_STRING environment variable is not set")
	}

	// Set up authentication options
	authOptions := azureappconfiguration.AuthenticationOptions{
		ConnectionString: connectionString,
	}

	// Configuration setup
	options := &azureappconfiguration.Options{
		Selectors: []azureappconfiguration.Selector{
			{
				KeyFilter:   "Config.*",
				LabelFilter: "",
			},
		},
		// Remove the prefix when mapping to struct fields
		TrimKeyPrefixes: []string{"Config."},
	}

	// Create configuration provider with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	appCfgProvider, err := azureappconfiguration.Load(ctx, authOptions, options)
	if err != nil {
		return Config{}, err
	}

	// Parse configuration into struct
	var config Config
	err = appCfgProvider.Unmarshal(&config, nil)
	if err != nil {
		return Config{}, err
	}

	return config, nil
}

func main() {
	// Load configuration
	config, err := loadConfiguration()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Configure Gin based on app settings
	if config.App.DebugMode {
		// Set Gin to debug mode for development
		gin.SetMode(gin.DebugMode)
		log.Println("Running in DEBUG mode")
	} else {
		// Set Gin to release mode for production
		gin.SetMode(gin.ReleaseMode)
		log.Println("Running in RELEASE mode")
	}

	// Initialize Gin router
	r := gin.Default()

	// Load HTML templates
	r.LoadHTMLGlob("templates/*")

	// Define a route for the homepage
	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", gin.H{
			"Title":   "Home",
			"Message": config.Message,
			"App":     config.App.Name,
		})
	})

	// Start the server on port 8080
	log.Printf("Starting %s on http://localhost:8080", config.App.Name)
	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
```

---

## Run the web application

1. Set the environment variable for authentication.

    ### [Microsoft Entra ID (recommended)](#tab/entra-id)
    Set the environment variable named **AZURE_APPCONFIG_ENDPOINT** to the endpoint of your App Configuration store found under the *Overview* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_ENDPOINT "<endpoint-of-your-app-configuration-store>"
    ```

    If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_ENDPOINT = "<endpoint-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_ENDPOINT='<endpoint-of-your-app-configuration-store>'
    ```

    Additionally, make sure you have logged in with the Azure CLI or use environment variables for Azure authentication:

    ```bash
    az login
    ```

    ### [Connection string](#tab/connection-string)
    Set the environment variable named **AZURE_APPCONFIG_CONNECTION_STRING** to the read-only connection string of your App Configuration store found under *Access settings* of your store in the Azure portal.

    If you use the Windows command prompt, run the following command and restart the command prompt to allow the change to take effect:

    ```cmd
    setx AZURE_APPCONFIG_CONNECTION_STRING "<connection-string-of-your-app-configuration-store>"
    ```

   If you use PowerShell, run the following command:

    ```powershell
    $Env:AZURE_APPCONFIG_CONNECTION_STRING = "<connection-string-of-your-app-configuration-store>"
    ```

    If you use macOS or Linux, run the following command:

    ```bash
    export AZURE_APPCONFIG_CONNECTION_STRING='<connection-string-of-your-app-configuration-store>'
    ```
    
    ---

2. Run the application. 

    ```bash
    go run main.go
    ```

    You should see output similar to this:

    ```output
    Running in DEBUG mode
    Starting Gin Web App on http://localhost:8080
    [GIN-debug] [WARNING] Creating an Engine instance with the Logger and Recovery middleware already attached.
    [GIN-debug] [WARNING] Running in "debug" mode. Switch to "release" mode in production.
    - using env:	export GIN_MODE=release
    - using code:	gin.SetMode(gin.ReleaseMode)
    [GIN-debug] Loading templates from ./templates/*
    [GIN-debug] GET    /                         --> main.main.func1 (3 handlers)
    [GIN-debug] [WARNING] You trusted all proxies, this is NOT safe. We recommend you to set a value.
    Please check https://pkg.go.dev/github.com/gin-gonic/gin#readme-don-t-trust-all-proxies for details.
    [GIN-debug] Listening and serving HTTP on :8080
    ```

3. Open a web browser and navigate to `http://localhost:8080`. The web page looks like this:

    :::image type="content" source="./media/quickstarts/gin-sample-app-home.jpg" alt-text="Screenshot of the browser.Launching quickstart app locally.":::

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a Go web application with Azure App Configuration. You learned how to:

- Load configuration from Azure App Configuration in a web application
- Use strongly typed configuration with Unmarshal
- Configure your web application based on centrally stored settings

To learn more about Azure App Configuration Go Provider, see [reference doc](https://pkg.go.dev/github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration).

