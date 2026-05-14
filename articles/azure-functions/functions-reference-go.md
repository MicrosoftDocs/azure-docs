---
title: Go developer reference for Azure Functions
description: Understand how to develop Go function apps for Azure Functions using the Go worker SDK.
ms.topic: article
ms.date: 05/05/2026
ms.devlang: golang
ms.custom:
  - devx-track-go
  - build-2025
#customer intent: As a Go developer, I want to understand the Go programming model for Azure Functions so that I can build and deploy Go serverless apps.
---

# Azure Functions Go developer reference

> [!IMPORTANT]
> Go support for Azure Functions is currently in public preview.
> During preview, Go function apps are supported only on the Flex Consumption plan.

Azure Functions is a serverless compute service that lets you run event-driven code without provisioning or managing infrastructure. The Go worker enables you to write Azure Functions natively in Go, with deep integration into the Azure Functions trigger and binding ecosystem.

This guide helps you:
- Understand the Go programming model
- Create and structure your function app
- Work with triggers and bindings
- Deploy and run your app locally and in Azure

> Looking for a conceptual overview? See the [Azure Functions developer reference](functions-reference.md).

## Getting started

Choose the environment that fits your workflow and get started with Azure Functions for Go:

- [Command line quickstart](how-to-create-function-azure-cli.md?pivots=programming-language-go)

## Prerequisites

- [Go 1.24](https://go.dev/dl/) or later
- [Azure Functions Core Tools](functions-run-local.md#install-the-azure-functions-core-tools) version 4.x from a release that includes Go support
- [Azure CLI](/cli/azure/install-azure-cli), when you deploy packages to Azure

## Programming model

The Go worker uses a **code-first** programming model. You define triggers and bindings directly in Go code using a fluent builder API. No `function.json` files are needed. The worker uses worker-driven function indexing to automatically discover and register your functions with the Azure Functions host.

### Entry point

Every Go function app starts with a `main()` function that creates a `FunctionApp`, registers functions, and starts the worker:

```go
package main

import (
    "fmt"
    "net/http"

    "github.com/azure/azure-functions-golang-worker/sdk"
    "github.com/azure/azure-functions-golang-worker/worker"
)

func main() {
    app := sdk.FunctionApp()

    app.HTTP("hello", hello,
        sdk.WithMethods("GET", "POST"),
        sdk.WithAuth("anonymous"),
    )

    worker.Start(app)
}

func hello(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
        name = "world"
    }
    fmt.Fprintf(w, "Hello, %s!", name)
}
```

### Function registration

Functions are registered using the fluent builder API with the functional options pattern. Each trigger type has a registration method on the `App` object:

```go
// HTTP trigger
app.HTTP("myHttpFunc", handler,
    sdk.WithMethods("GET", "POST"),
    sdk.WithAuth("anonymous"),
)

// Timer trigger
app.Timer("myTimerFunc", handler,
    sdk.WithSchedule("0 */5 * * * *"),
)

// Azure Cosmos DB trigger
app.CosmosDB("myCosmosFunc", handler,
    sdk.WithDatabase("mydb"),
    sdk.WithContainer("mycontainer"),
    sdk.WithConnection("CosmosDBConnection"),
)

// Azure Service Bus trigger
app.ServiceBusQueue("myServiceBusFunc", handler,
    sdk.WithQueueName("myqueue"),
    sdk.WithConnection("ServiceBusConnection"),
)

// Event Hubs trigger
app.EventHub("myEventHubFunc", handler,
    sdk.WithEventHubName("myeventhub"),
    sdk.WithConnection("EventHubConnection"),
)

// Event Grid trigger
app.EventGrid("myEventGridFunc", handler)

// Blob trigger (extension model)
app.Blob("myBlobFunc", handler,
    sdk.WithPath("mycontainer/{name}"),
    sdk.WithConnection("AzureWebJobsStorage"),
)
```

## Project structure

A Go function app is a standard Go module. The following files are generated when you run `func init --worker-runtime go`:

```
my-function-app/
├── host.json              # Host configuration
├── local.settings.json    # Local settings (connection strings, app settings)
├── go.mod                 # Go module file
├── go.sum                 # Go module checksums
└── main.go                # Entry point with function registrations
```

### host.json

The `host.json` file contains host-level configuration options. For more information, see the [host.json reference](functions-host-json.md).

### local.settings.json

The `local.settings.json` file stores app settings and connection strings used during local development. This file isn't published to Azure. For more information, see [Local settings file](functions-develop-local.md#local-settings-file).

## Triggers and bindings

The Go worker organizes triggers into two tiers based on their dependency requirements:

### Core triggers

Core triggers receive their payload inline via gRPC. The Azure Functions host serializes the trigger data into the gRPC message, and the worker deserializes it into typed Go structs. These triggers have:

- **Typed handler signatures** with compile-time safety
- **No external Azure SDK dependencies**: only `encoding/json` is needed
- **Bounded payloads**: change-feed documents, messages, and events are discrete, size-limited objects

Supported core triggers:

| Trigger | Handler signature | Registration method |
|---|---|---|
| HTTP | `func(http.ResponseWriter, *http.Request)` | `app.HTTP()` |
| Timer | `TimerHandler` | `app.Timer()` |
| Azure Cosmos DB | `func(context.Context, []bindings.CosmosDocument) error` | `app.CosmosDB()` |
| Azure Service Bus (Queue) | `ServiceBusHandler` | `app.ServiceBusQueue()` |
| Azure Service Bus (Topic) | `ServiceBusHandler` | `app.ServiceBusTopic()` |
| Event Hubs | `EventHubHandler` | `app.EventHub()` |
| Event Grid | `EventGridHandler` | `app.EventGrid()` |

### Extension triggers

Extension triggers provide an authenticated Azure SDK client instead of raw data. The host sends only metadata (such as container name and blob path), and the worker constructs a client scoped to the specific resource. These triggers have:

- **SDK client injection**: the handler receives a ready-to-use client
- **Isolated dependencies**: Azure SDK packages live in `triggers/<name>/`
- **Streaming support**: enables reading large payloads without buffering through gRPC

To use an extension trigger, add a blank import for the extension package:

```go
import _ "github.com/azure/azure-functions-golang-worker/triggers/blob"
```

| Trigger | Handler receives | Registration method |
|---|---|---|
| Blob Storage | `*blob.Client` | `app.Blob()` |

#### Blob trigger example

```go
package main

import (
    "context"
    "fmt"
    "io"
    "log"

    "github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob"
    "github.com/azure/azure-functions-golang-worker/sdk"
    _ "github.com/azure/azure-functions-golang-worker/triggers/blob"
    "github.com/azure/azure-functions-golang-worker/worker"
)

func main() {
    app := sdk.FunctionApp()
    app.Blob("processBlobTrigger", processBlob,
        sdk.WithPath("samples-workitems/{name}"),
        sdk.WithConnection("AzureWebJobsStorage"),
    )
    worker.Start(app)
}

func processBlob(ctx context.Context, client *blob.Client) error {
    get, err := client.DownloadStream(ctx, nil)
    if err != nil {
        return fmt.Errorf("download error: %w", err)
    }
    data, _ := io.ReadAll(get.Body)
    get.Body.Close()
    log.Printf("Blob size: %d bytes", len(data))
    return nil
}
```

## HTTP triggers

HTTP trigger handlers use standard Go `net/http` types, making them immediately familiar to Go developers:

```go
func myHandler(w http.ResponseWriter, r *http.Request) {
    name := r.URL.Query().Get("name")
    if name == "" {
        name = "world"
    }
    w.Header().Set("Content-Type", "application/json")
    fmt.Fprintf(w, `{"message": "Hello, %s!"}`, name)
}
```

Register HTTP functions with methods and authorization level:

```go
app.HTTP("myApi", myHandler,
    sdk.WithMethods("GET", "POST"),
    sdk.WithAuth("anonymous"),
)
```

### HTTP streaming

The Go worker supports HTTP streaming for scenarios like server-sent events or sending large response data:

```go
func streamHandler(w http.ResponseWriter, r *http.Request) {
    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "streaming not supported", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "text/event-stream")
    for i := 0; i < 10; i++ {
        fmt.Fprintf(w, "data: message %d\n\n", i)
        flusher.Flush()
    }
}
```

## Timer trigger

Timer triggers run on a schedule defined by a cron expression:

```go
app.Timer("myScheduledFunc", timerHandler,
    sdk.WithSchedule("0 */5 * * * *"),
)

func timerHandler(ctx context.Context, timer bindings.TimerInfo) error {
    log.Printf("Timer trigger executed at: %s", timer.ScheduleStatus.Next)
    return nil
}
```

## Dependency management

Go function apps use standard Go modules for dependency management:

```console
# Initialize a new module
go mod init myapp

# Add the Azure Functions Go worker SDK
go get github.com/azure/azure-functions-golang-worker

# For blob trigger support, the dependency is included automatically
# via the blank import of triggers/blob

# Tidy dependencies
go mod tidy
```

## Local development

### Running locally

Use Azure Functions Core Tools to run your function app locally:

```console
func start
```

Core Tools automatically:
1. Detects `FUNCTIONS_WORKER_RUNTIME = "native"` from `local.settings.json`.
2. Resolves the native worker runtime to Go when a `go.mod` file is present.
3. Runs `go build -o bin/app .` to compile your project for your local operating system.
4. Starts the Azure Functions host, which communicates with the compiled binary over gRPC.
5. Displays your function endpoints (for example, `http://localhost:7071/api/hello`).

### Environment variables

Use `local.settings.json` to configure environment variables for local development:

```json
{
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "native"
    }
}
```

The generated `AzureWebJobsStorage` value is empty for Go projects. Set it to a storage account connection string or `UseDevelopmentStorage=true` when you use triggers that require host storage during local development.

## Deployment

### Compilation and packaging

Core Tools handle Go builds for the common local and Azure deployment flows:

- `func start` builds your project as *bin/app* for your local operating system before starting the local Functions host.
- `func azure functionapp publish` builds, packages, and deploys your project to an existing function app in Azure.
- `func pack` builds your project as *bin/app* for Linux x64 and creates a deployable .zip package.

When packaging for Azure, the generated .zip file contains the files needed by the Linux Functions host. The compiled binary is stored as *bin/app* in your local project, but Core Tools places it at the root of the deployment package as *app*.

If you use `func pack --no-build`, you must build the Linux x64 binary before packaging:

```console
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/app .
```

### Deploy with Core Tools

Use `func azure functionapp publish` to deploy your Go project to an existing function app in Azure:

```console
func azure functionapp publish <APP_NAME>
```

Replace `<APP_NAME>` with the name of your function app.

### Deploy a zip package

Use `func pack` when you need to create a deployment package separately from publishing:

1. Create a deployable zip artifact:

    ```console
    func pack
    ```

1. Deploy the package by using the Azure CLI:

    ```azurecli
    az functionapp deployment source config-zip --resource-group <RESOURCE_GROUP> --name <APP_NAME> --src <ZIP_FILE_PATH>
    ```

The package produced by `func pack` is ready to run in Azure, so don't request a remote build when you deploy it.

## Docker support

You can run Go function apps in containers. Initialize a project with Docker support:

```console
func init --worker-runtime go --docker
```

The command generates a `Dockerfile` along with the standard project files.

## Telemetry and observability

The Azure Functions Go worker includes built-in observability features that integrate automatically with Azure Application Insights. Logs emitted via the standard `log` package are forwarded to the Functions host and appear in Application Insights.

## Known limitations (preview)

During the public preview, the following limitations apply:

- `func new` isn't supported. Add functions by editing `main.go` directly.
- Go function apps run on Linux only in Azure.
- Only the triggers listed in [Triggers and bindings](#triggers-and-bindings) are supported during the preview.
- Go packaging in Core Tools currently targets Linux x64 apps.

## Next steps

- [Create your first Go function](how-to-create-function-azure-cli.md?pivots=programming-language-go)
- [Azure Functions triggers and bindings](functions-triggers-bindings.md)
- [Azure Functions Go worker samples](https://github.com/Azure/azure-functions-golang-worker/tree/main/samples)
- [Azure Functions developer guide](functions-reference.md)
