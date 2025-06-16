---
title: Quickstart for using Azure App Configuration with Go applications
description: In this quickstart, create a Go application with Azure App Configuration to centralize storage and management of application settings separate from your code.
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
#Customer intent: As a Go developer, I want to manage all my app settings in one place.
---
# Quickstart: Create a Go console app with Azure App Configuration

In this quickstart, you use Azure App Configuration to centralize storage and management of application settings using the [Azure App Configuration Go provider client library](https://github.com/Azure/AppConfiguration-GoProvider).

The App Configuration provider for Go simplifies the effort of applying key-values from Azure App Configuration to Go application. It enables binding settings to Go struct. It offers features like configuration composition from multiple labels, key prefix trimming, automatic resolution of Key Vault references, and many more.

## Prerequisites

- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).
- An App Configuration store. [Create a store](./quickstart-azure-app-configuration-create.md#create-an-app-configuration-store).
- Go 1.18 or later. [Install Go](https://golang.org/doc/install).

## Add key-values

Add the following key-values to the App Configuration store. For more information about how to add key-values to a store using the Azure portal or the CLI, go to [Create a key-value](./quickstart-azure-app-configuration-create.md#create-a-key-value).

| Key                    | Value                                  | Content type       |
|------------------------|----------------------------------------|--------------------|
| *Config.Message*       | *Hello World!*                         | Leave empty        |
| *Config.App.Name*      | *Go Console App*                       | Leave empty        |
| *Config.App.Debug*     | *true*                                 | Leave empty        |
| *Config.App.Settings*  | *{"timeout": 30, "retryCount": 3}*     | *application/json* |

## Connect to App Configuration

1. Create a new directory for the project.

    ```bash
    mkdir app-configuration-quickstart
    cd app-configuration-quickstart
    ```

2. Initialize a new Go module.

    ```bash
    go mod init app-configuration-quickstart
    ```

3. Add the Azure App Configuration provider as a dependency.

    ```bash
    go get github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration
    ```

4. Create a file named `appconfig.go` with the following content. You can connect to your App Configuration store using Microsoft Entra ID (recommended) or a connection string.

### [Microsoft Entra ID (recommended)](#tab/entra-id)

```golang
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
	"github.com/Azure/azure-sdk-for-go/sdk/azidentity"
)

func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.Azureappconfiguration, error) {
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

	// Configure which keys to load and trimming options
	options := &azureappconfiguration.Options{
		Selectors: []azureappconfiguration.Selector{
			{
				KeyFilter:   "Config.*",
				LabelFilter: "",
			},
		},
		TrimKeyPrefixes: []string{"Config."},
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
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration"
)

func loadAzureAppConfiguration(ctx context.Context) (*azureappconfiguration.Azureappconfiguration, error) {
	// Get the connection string from environment variable
	connectionString := os.Getenv("AZURE_APPCONFIG_CONNECTION_STRING")
	if connectionString == "" {
		log.Fatal("AZURE_APPCONFIG_CONNECTION_STRING environment variable is not set")
	}

	// Set up authentication options with connection string
	authOptions := azureappconfiguration.AuthenticationOptions{
		ConnectionString: connectionString,
	}

	// Configure which keys to load and trimming options
	options := &azureappconfiguration.Options{
		Selectors: []azureappconfiguration.Selector{
			{
				KeyFilter:   "Config.*",
				LabelFilter: "",
			},
		},
		TrimKeyPrefixes: []string{"Config."},
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

## Unmarshal

The `Unmarshal` method provides a type-safe way to load configuration values into Go structs. This approach prevents runtime errors from mistyped configuration keys and makes your code more maintainable. `Unmarshal` is particularly valuable for complex configurations with nested structures, different data types, or when working with microservices that require clear configuration contracts across components.

Create a file named `unmarshal_sample.go` with the following content:

```golang
package main

import (
	"context"
	"fmt"
	"log"
	"time"
)

// Configuration structure that matches your key-values in App Configuration
type Config struct {
	Message string
	App     struct {
		Name     string
		Debug    bool
		Settings struct {
			Timeout     int
			RetryCount  int
		}
	}
}

func main() {
	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Load configuration
	provider, err := loadAzureAppConfiguration(ctx)
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Create a configuration object and unmarshal the loaded key-values into it
	var config Config
	if err := provider.Unmarshal(&config, nil); err != nil {
		log.Fatalf("Failed to unmarshal configuration: %v", err)
	}

	// Display the configuration values
	fmt.Println("\nConfiguration Values:")
	fmt.Println("---------------------")
	fmt.Printf("Message: %s\n", config.Message)
	fmt.Printf("App Name: %s\n", config.App.Name)
	fmt.Printf("Debug Mode: %t\n", config.App.Debug)
	fmt.Printf("Timeout: %d seconds\n", config.App.Settings.Timeout)
	fmt.Printf("Retry Count: %d\n", config.App.Settings.RetryCount)
}
```

## JSON bytes

The `GetBytes` method retrieves your configuration as raw JSON data, offering a flexible alternative to struct binding. This approach seamlessly integrates with existing JSON processing libraries like the standard `encoding/json` package or configuration frameworks such as [`viper`](https://github.com/spf13/viper). It's particularly useful when working with dynamic configurations, when you need to store configuration temporarily, or when integrating with existing systems that expect JSON input. Using GetBytes gives you direct access to your configuration in a universally compatible format while still benefiting from Azure App Configuration's centralized management capabilities.

Create a file named `getbytes_sample.go` with the following content:

```golang
package main

import (
	"context"
	"fmt"
	"log"
	"time"
	
	"github.com/spf13/viper"
)

func main() {
	// Create a context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Load configuration using the common function
	provider, err := loadAzureAppConfiguration(ctx)
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Get configuration as JSON bytes
	jsonBytes, err := provider.GetBytes(nil)
	if err != nil {
		log.Fatalf("Failed to get configuration as bytes: %v", err)
	}

	fmt.Println("\nRaw JSON Configuration:")
	fmt.Println("------------------------")
	fmt.Println(string(jsonBytes))
	
	// Initialize a new Viper instance
	v := viper.New()
	v.SetConfigType("json") // Set the config format to JSON
	
	// Load the JSON bytes into Viper
	if err := v.ReadConfig(bytes.NewBuffer(jsonBytes)); err != nil {
		log.Fatalf("Failed to read config into viper: %v", err)
	}

	// Use viper to access your configuration
	// ...
}
```

## Run the application

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

2. After the environment variable is properly set, run the following command to run the *Unmarshal* example:

    ```bash
    go run unmarshal_sample.go
    ```

    You should see output similar to the following:

    ```Output
    Configuration Values:
    ---------------------
    Message: Hello World!
    App Name: Go Console App
    Debug Mode: true
    Timeout: 30 seconds
    Retry Count: 3
    ```

3. Run the *GetBytes* example:

    ```bash
    go run getbytes_sample.go
    ```

    You should see output similar to the following:

    ```Output
    Raw JSON Configuration:
    ------------------------
    {"App":{"Debug":true,"Name":"Go Console App","Settings":{"retryCount":3,"timeout":30}},"Message":"Hello World!"}
    ```

## Clean up resources

[!INCLUDE [azure-app-configuration-cleanup](../../includes/azure-app-configuration-cleanup.md)]

## Next steps

In this quickstart, you created a new App Configuration store and learned how to access key-values using the Azure App Configuration Go provider in a console application. 

To learn more about Azure App Configuration Go Provider, see [reference doc](https://pkg.go.dev/github.com/Azure/AppConfiguration-GoProvider/azureappconfiguration).
