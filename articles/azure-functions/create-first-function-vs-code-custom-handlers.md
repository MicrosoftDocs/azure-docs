---
title: Create a function in Go or Rust using Visual Studio Code - Azure Functions
description: Learn how to create a Go function as an Azure Functions custom handler, then publish the local project to serverless hosting in Azure Functions using the Azure Functions extension in Visual Studio Code.  
ms.topic: quickstart
ms.date: 11/22/2020
---

# Quickstart: Create a Go or Rust function in Azure using Visual Studio Code

[!INCLUDE [functions-language-selector-quickstart-vs-code](../../includes/functions-language-selector-quickstart-vs-code.md)]

In this article, you use Visual Studio Code to create a [custom handler](functions-custom-handlers.md) function in Go or Rust that responds to HTTP requests. After testing the code locally, you deploy it to the serverless environment of Azure Functions.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

There's also a [CLI-based version](create-first-function-cli-node.md) of this article.

## Configure your environment

Before you get started, make sure you have the following requirements in place:

+ An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

+ [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

+ The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code.

+ The [Azure Functions Core Tools](./functions-run-local.md#v2) version 3.x. Use the `func --version` command to check that it is correctly installed.

# [Go](#tab/go)

[Go](https://golang.org/doc/install), latest version recommended. Use the `go version` command to check your version.

# [Rust](#tab/rust)

Rust toolchain using [rustup](https://www.rust-lang.org/tools/install). Use the `rustc --version` command to check your version.

---

## <a name="create-an-azure-functions-project"></a>Create your local project

In this section, you use Visual Studio Code to create a local Azure Functions custom handlers project. Later in this article, you'll publish your function code to Azure.

1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, select the **Create new project...** icon.

    ![Choose Create a new project](./media/functions-create-first-function-vs-code/create-new-project.png)

1. Choose a directory location for your project workspace and choose **Select**.

    > [!NOTE]
    > These steps were designed to be completed outside of a workspace. In this case, do not select a project folder that is part of a workspace.

1. Provide the following information at the prompts:

    + **Select a language for your function project**: Choose `Custom`.

    + **Select a template for your project's first function**: Choose `HTTP trigger`.

    + **Provide a function name**: Type `HttpExample`.

    + **Authorization level**: Choose `Anonymous`, which enables anyone to call your function endpoint. To learn about authorization level, see [Authorization keys](functions-bindings-http-webhook-trigger.md#authorization-keys).

    + **Select how you would like to open your project**: Choose `Add to workspace`.

1. Using this information, Visual Studio Code generates an Azure Functions project with an HTTP trigger function. You can view the local project files in the Explorer. To learn more about files that are created, see [Generated project files](functions-develop-vs-code.md#generated-project-files). 

## Create and build your function

The *function.json* file in the *HttpExample* folder declares an HTTP trigger function. You complete the function by adding a handler and compiling it into an executable.

# [Go](#tab/go)

1. Press <kbd>Ctrl + N</kbd> (<kbd>Cmd + N</kbd> on macOS) to create a new file. Save it as *handler.go* in the function app root (same folder as *host.json*).

1. In *handler.go*, add the following code and save the file. This is your Go custom handler.

    ```go
    package main

    import (
        "fmt"
        "log"
        "net/http"
        "os"
    )

    func helloHandler(w http.ResponseWriter, r *http.Request) {
        name := r.URL.Query().Get("name")
        if name == "" {
            w.Write([]byte("This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response."))
        } else {
            w.Write([]byte("Hello, " + name + ". This HTTP triggered function executed successfully."))
        }
    }

    func main() {
        customHandlerPort, exists := os.LookupEnv("FUNCTIONS_CUSTOMHANDLER_PORT")
        if !exists {
            customHandlerPort = "8080"
        }
        mux := http.NewServeMux()
        mux.HandleFunc("/api/HttpExample", helloHandler)
        fmt.Println("Go server Listening on: ", customHandlerPort)
        log.Fatal(http.ListenAndServe(":"+customHandlerPort, mux))
    }
    ```

1. Press <kbd>Ctrl + Shift + `</kbd> or select *New Terminal* from the *Terminal* menu to open a new integrated terminal in VS Code.

1. Compile your custom handler using the following command. An executable file named `handler` (`handler.exe` on Windows) is output in the function app root folder.

    ```bash
    go build handler.go
    ```

    ![VS Code - Build Go custom handler](./media/functions-create-first-function-vs-code/functions-vscode-go.png)

# [Rust](#tab/rust)

1. Press <kbd>Ctrl + Shift + `</kbd> or select *New Terminal* from the *Terminal* menu to open a new integrated terminal in VS Code.

1. In the function app root (same folder as *host.json*), initialize a Rust project named `handler`.

    ```bash
    cargo init --name handler
    ```

1. In *Cargo.toml*, add the following dependencies necessary to complete this quickstart.

    ```toml
    [dependencies]
    actix-web = "3"
    serde = "1"
    serde_derive = "1"
    ```

1. In *src/main.rs*, add the following code and save the file. This is your Rust custom handler.

    ```rust
    #[macro_use] extern crate serde_derive;
    use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
    use std::env;

    #[derive(Deserialize)]
    pub struct HelloParams {
        name: Option<String>,
    }

    #[get("/api/HttpExample")]
    async fn hello(params: web::Query<HelloParams>) -> impl Responder {
        let greeting = match &params.name {
            None => String::from("This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response."),
            Some(x) => format_args!("Hello, {}. This HTTP triggered function executed successfully.", x).to_string(),
        };
        HttpResponse::Ok().body(greeting)
    }

    #[actix_web::main]
    async fn main() -> std::io::Result<()> {
        let port_key = "FUNCTIONS_CUSTOMHANDLER_PORT";
        let port = match env::var(port_key) {
            Ok(val) => val,
            Err(_) => String::from("8080"),
        };

        HttpServer::new(|| {
            App::new()
                .service(hello)
        })
        .bind(format_args!("127.0.0.1:{}", port).to_string())?
        .run()
        .await
    }
    ```

1. In the integrated terminal, set the project to use the nightly channel of Cargo and compile your custom handler. An executable file named `handler` (`handler.exe` on Windows) is output in the function app root folder.

    ```bash
    rustup override set nightly
    cargo build --release -Z unstable-options --out-dir .
    ```

    ![VS Code - Build Go custom handler](./media/functions-create-first-function-vs-code/functions-vscode-rust.png)

---

## Configure your function app

The function host needs to be configured to run your custom handler binary when it starts.

1. Open *host.json*.

1. In the `customHandler.description` section, set the value of `defaultExecutablePath` to `handler` (on Windows, set it to `handler.exe`).

1. In the `customHandler` section, add a property named `enableForwardingHttpRequest` and set its value to `true`. For functions consisting of only an HTTP trigger, this setting simplifies programming by allow you to work with a typical HTTP request instead of the custom handler [request payload](functions-custom-handlers.md#request-payload).

1. Confirm the `customHandler` section looks like this example. Save the file.

    ```
    "customHandler": {
      "description": {
        "defaultExecutablePath": "handler",
        "workingDirectory": "",
        "arguments": []
      },
      "enableForwardingHttpRequest": true
    }
    ```

The function app is configured to start your custom handler executable.

## Run the function locally

You can run this project on your local development computer before you publish to Azure.

1. In the integrated terminal, start the function app using Azure Functions Core Tools.

    ```bash
    func start
    ```

1. With Core Tools running, navigate to the following URL to execute a GET request, which includes `?name=Functions` query string.

    `http://localhost:7071/api/HttpExample?name=Functions`

1. A response is returned, which looks like the following in a browser:

    ![Browser - localhost example output](../../includes/media/functions-run-function-test-local-vs-code/functions-test-local-browser.png)

1. Information about the request is shown in **Terminal** panel.

    ![Task host start - VS Code terminal output](../../includes/media/functions-run-function-test-local-vs-code/function-execution-terminal.png)

1. Press <kbd>Ctrl + C</kbd> to stop Core Tools.

After you've verified that the function runs correctly on your local computer, it's time to use Visual Studio Code to publish the project directly to Azure.

[!INCLUDE [functions-sign-in-vs-code](../../includes/functions-sign-in-vs-code.md)]

## Compile the custom handler for Azure

This quickstart will deploy your application to an Azure Functions Linux Consumption app. Unless you are developing locally on Linux/x64 architecture, you must recompile your binary and adjust your configuration to match the target platform before publishing it to Azure.

# [Go](#tab/go)

1. In the integrated terminal, compile the handler to Linux/x64. A binary named `handler` is created in the function app root.

    **macOS or Linux**

    ```bash
    GOOS=linux GOARCH=amd64 go build handler.go
    ```

    **Windows**

    ```cmd
    set GOOS=linux
    set GOARCH=amd64
    go build hello.go
    ```

1. If you are using Windows, change the `defaultExecutablePath` in *host.json* from `handler.exe` to `handler`. This instructs the function app to run the linux binary.

# [Rust](#tab/rust)

Needs content.

1. In the integrated terminal, compile the handler to Linux/x64. A binary named `handler` is created in the function app root.

    **Needs content**

1. If you are using Windows, change the `defaultExecutablePath` in *host.json* from `handler.exe` to `handler`. This instructs the function app to run the linux binary.

1. To avoid publishing the contents of the *target* folder, add a line with the word `target` to the *.funcignore* file.

---

## Publish the project to Azure

In this section, you create a function app and related resources in your Azure subscription and then deploy your code. 

> [!IMPORTANT]
> Publishing to an existing function app overwrites the content of that app in Azure. 


1. Choose the Azure icon in the Activity bar, then in the **Azure: Functions** area, choose the **Deploy to function app...** button.

    ![Publish your project to Azure](./media/functions-create-first-function-vs-code/function-app-publish-project.png)

1. Provide the following information at the prompts:

    + **Select folder**: Choose a folder from your workspace or browse to one that contains your function app. You won't see this if you already have a valid function app opened.

    + **Select subscription**: Choose the subscription to use. You won't see this if you only have one subscription.

    + **Select Function App in Azure**: Choose `+ Create new Function App (advanced)`. **Important**: The `advanced` option is required to ensure you select the correct operating system.

    + **Enter a globally unique name for the function app**: Type a name that is valid in a URL path. The name you type is validated to make sure that it's unique in Azure Functions.

    + **Select a runtime stack**: Choose `Custom Handler`.

    + **Select an OS**: Choose `Linux`.

    + **Select a hosting plan**: Choose `Consumption`.

    + **Select a resource group**: Choose `+ Create new resource group`. Enter a name for the resource group. This name must be unique within your Azure subscription. You can use the name suggested in the prompt.

    + **Select a storage account**: Choose `+ Create new storage account`. This name must be globally unique within Azure. You can use the name suggested in the prompt.

    + **Select an Application Insight resource**: Choose `+ Create Application Insight resource`. This name must be globally unique within Azure. You can use the name suggested in the prompt.

    + **Select a location for new resources**:  For better performance, choose a [region](https://azure.microsoft.com/regions/) near you. 

1. When completed, the following Azure resources are created in your subscription, using names based on your function app name:

    + A resource group, which is a logical container for related resources.
    + A standard Azure Storage account, which maintains state and other information about your projects.
    + A consumption plan, which defines the underlying host for your serverless function app. 
    + A function app, which provides the environment for executing your function code. A function app lets you group functions as a logical unit for easier management, deployment, and sharing of resources within the same hosting plan.
    + An Application Insights instance connected to the function app, which tracks usage of your serverless function.

    A notification is displayed after your function app is created and the deployment package is applied. 

1. Select **View Output** in this notification to view the creation and deployment results, including the Azure resources that you created. If you miss the notification, select the bell icon in the lower right corner to see it again.

    ![Create complete notification](./media/functions-create-first-function-vs-code/function-create-notifications.png)

[!INCLUDE [functions-vs-code-run-remote](../../includes/functions-vs-code-run-remote.md)]

[!INCLUDE [functions-cleanup-resources-vs-code.md](../../includes/functions-cleanup-resources-vs-code.md)]

## Next steps

You have used Visual Studio Code to create a function app with a simple HTTP-triggered function. In the next article, you expand that function by adding an output binding. This binding writes the string from the HTTP request to a message in an Azure Queue Storage queue. 

> [!div class="nextstepaction"]
> [Learn about Azure Functions custom handlers](functions-custom-handlers.md)
