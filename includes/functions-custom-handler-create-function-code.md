---
ms.topic: include
author: ggailey777
ms.service: azure-functions
ms.date: 11/14/2025
ms.author: glenga
---
## Create and build your function

The *function.json* file in the *HttpExample* folder declares an HTTP trigger function. You complete the function by adding a handler and compiling it into an executable.

### [Go](#tab/go)

1. Press <kbd>Ctrl + N</kbd> (<kbd>Cmd + N</kbd> on macOS) to create a new file. Save it as *handler.go* in the function app root (in the same folder as *host.json*).

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
        message := "This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response.\n"
        name := r.URL.Query().Get("name")
        if name != "" {
            message = fmt.Sprintf("Hello, %s. This HTTP triggered function executed successfully.\n", name)
        }
        fmt.Fprint(w, message)
    }
    
    func main() {
        listenAddr := ":8080"
        if val, ok := os.LookupEnv("FUNCTIONS_CUSTOMHANDLER_PORT"); ok {
            listenAddr = ":" + val
        }
        http.HandleFunc("/api/HttpExample", helloHandler)
        log.Printf("About to listen on %s. Go to https://127.0.0.1%s/", listenAddr, listenAddr)
        log.Fatal(http.ListenAndServe(listenAddr, nil))
    }
    ```

1. Press <kbd>Ctrl + Shift + `</kbd> or select *New Terminal* from the *Terminal* menu to open a new integrated terminal in VS Code.

1. Compile your custom handler using the following command. An executable file named `handler` (`handler.exe` on Windows) is output in the function app root folder.

    ```bash
    go build handler.go
    ```

# [Rust](#tab/rust)

1. Press <kbd>Ctrl + Shift + `</kbd> or select *New Terminal* from the *Terminal* menu to open a new integrated terminal in VS Code.

1. In the function app root (the same folder as *host.json*), initialize a Rust project named `handler`.

    ```bash
    cargo init --name handler
    ```

1. In *Cargo.toml*, add the following dependencies necessary to complete this quickstart. The example uses the [warp](https://docs.rs/warp/) web server framework.

    ```toml
    [dependencies]
    warp = "0.3"
    tokio = { version = "1", features = ["rt", "macros", "rt-multi-thread"] }
    ```

1. In *src/main.rs*, add the following code and save the file. This is your Rust custom handler.

    ```rust
    use std::collections::HashMap;
    use std::env;
    use std::net::Ipv4Addr;
    use warp::{http::Response, Filter};

    #[tokio::main]
    async fn main() {
        let example1 = warp::get()
            .and(warp::path("api"))
            .and(warp::path("HttpExample"))
            .and(warp::query::<HashMap<String, String>>())
            .map(|p: HashMap<String, String>| match p.get("name") {
                Some(name) => Response::builder().body(format!("Hello, {}. This HTTP triggered function executed successfully.", name)),
                None => Response::builder().body(String::from("This HTTP triggered function executed successfully. Pass a name in the query string for a personalized response.")),
            });

        let port_key = "FUNCTIONS_CUSTOMHANDLER_PORT";
        let port: u16 = match env::var(port_key) {
            Ok(val) => val.parse().expect("Custom Handler port is not a number!"),
            Err(_) => 3000,
        };

        warp::serve(example1).run((Ipv4Addr::LOCALHOST, port)).await
    }
    ```

1. Compile a binary for your custom handler. An executable file named `handler` (`handler.exe` on Windows) is output in the function app root folder.

    ```bash
    cargo build --release
    cp target/release/handler .
    ```

---

## Configure your function app

The function host needs to be configured to run your custom handler binary when it starts.

1. Open *host.json*.

1. In the `customHandler.description` section, set the value of `defaultExecutablePath` to `handler` (on Windows, set it to `handler.exe`).

1. In the `customHandler` section, add a property named `enableForwardingHttpRequest` and set its value to `true`. For functions consisting of only an HTTP trigger, this setting simplifies programming by allow you to work with a typical HTTP request instead of the custom handler [request payload](../articles/azure-functions/functions-custom-handlers.md#request-payload).

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
