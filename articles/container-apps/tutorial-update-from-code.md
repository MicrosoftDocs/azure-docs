---
title: "Tutorial: Update a container app deployed from source code"
description: Update and deploy your source code to Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: tutorial
ms.date: 02/05/2025
ms.author: cshoe
---

# Tutorial: Update a container app deployed from source code

This article demonstrates how to update the container app you created in the previous article, [Build and deploy your source code to Azure Container Apps](tutorial-deploy-from-code.md).

If you haven't completed the steps in the previous article, stop here and return to this article once all steps are done.

In this tutorial you:

> [!div class="checklist"]
> * Make a code change to your application.
> * Push your changes to the container registry with a new tag.
> * View the updated app in a browser.
> * Query the log stream to view logged messages.

## Prerequisites

To complete this project, you need the tools, resources, and container app created in the previous tutorial, [Build and deploy from source code to Azure Container Apps](tutorial-deploy-from-code.md).

## Setup

1. If necessary, sign in to Azure from the CLI.

    ```azurecli
    az login
    ```

1. Create environment variables. If your environment variables from the last tutorial still exist in your terminal, you can skip this step.

    If you need to recreate the environment variables, you first need to query for the container registry name you created in the last article.

    Run the following command to query for the container registry you created in the last tutorial.

    ```azurecli
    az acr list --query "[].{Name:name}" --output table
    ```

    Once you have your container registry name, replace `<REGISTRY_NAME>` with your registry name and run the following command.

    ```azurecli
    RESOURCE_GROUP="my-demo-group"
    CONTAINER_APP_NAME="my-demo-app"
    REGISTRY_NAME="<REGISTRY_NAME>"
    ```

1. Update and run your source code.

    # [C#](#tab/csharp)

    Replace the contents of `Startup.cs` with the following code.

    ```csharp  
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }
    
        public void Configure(IApplicationBuilder app, ILogger<Startup> logger)
        {
            app.UseRouting();
    
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    logger.LogInformation("Hello Logger!");
                    await context.Response.WriteAsync("Hello Logger!");
                });
            });
        }
    }
    ```

    This version of the code registers a logger to write information out to the console and the Container Apps log stream.

    Build your project in Release configuration.

    ```command
    dotnet build -c Release
    ```

    Next, run your application to verify your code is implemented correctly.

    ```command
    dotnet run --configuration Release
    ```

    # [Java](#tab/java)

    Replace the contents of `MyAcaDemoController.java` with the following code.

    ```java
    package com.example.MyAcaDemo;
    
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;
    
    import java.util.logging.Logger;
    import java.util.logging.Level;
    
    @RestController
    public class MyAcaDemoController {
        private static final Logger logger = Logger.getLogger(MyAcaDemoController.class.getName());
    
        @GetMapping("/")
        public String hello() {
            logger.log(Level.INFO, "Hello, Logger!");
            return "Hello, Logger!";
        }
    }
    ```

    This version of the code registers a logger to write information out to the console and the Container Apps log stream.

    Run the following command to verify your project builds without errors.

    ```bash
    mvn clean package -DskipTests
    ```

    Once you have a successful build, run the following command to ensure the application runs correctly on your machine.

    ```bash
    mvn spring-boot:run
    ```

    # [JavaScript](#tab/javascript)

    Replace the contents of `index.js` with the following code.

    ```javascript
    const http = require('http');
    
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<html>Hello Logger!</html>');
    });
    
    server.listen(8080, () => {
        console.log('Server running at http://localhost:8080/');
        console.log('Hello Logger!');
    });
    ```

    This version of the code registers a logger to write information out to the console and the Container Apps log stream.

    Now you can run the following command to ensure the application runs correctly on your machine.

    ```bash
    node index.js
    ```

    # [Python](#tab/python)

    Replace the contents of `app.py` with the following code.

    ```python
    from flask import Flask
    import logging
    import sys
    
    app = Flask(__name__)
    
    # Configure logging to stdout
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)
    formatter = logging.Formatter('%(asctime)s %(name)s: %(levelname)s %(message)s')
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)
    
    @app.route('/')
    def hello_world():
        app.logger.info('Hello Logger!')
        return '<html>Hello Logger!</html>'
    
    if __name__ == '__main__':
        app.run()
    ```

    This version of the code registers a logger to write information out to the console and the Container Apps log stream.

    Run the following command to verify the application is working correctly.

    ```bash
    python3 app.py
    ```

    ---

## Build and push the image to a registry

Now that your code is updated, you can push the latest version as a new image to your container registry.

To ensure tag used for your registry is unique, use the following command to create a tag name.

```bash
IMAGE_TAG=$(date +%s)
```

Now you can build and push your new container image to the registry using the following command.

```azurecli
az acr build \
    -t $REGISTRY_NAME.azurecr.io/$CONTAINER_APP_NAME:$IMAGE_TAG \
    -r $REGISTRY_NAME .
```

## Create a new revision

You can create a new revision of your container app based on the new container image you pushed to your registry.

```azurecli
az containerapp revision copy \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image "$REGISTRY_NAME.azurecr.io/$CONTAINER_APP_NAME:$IMAGE_TAG" \
  --output none
```

The `revision copy` command creates a new revision of your container app with the specified container image from the registry.

## Verify deployment

Now that your application is deployed, you can query for the URL with this command.

```azurecli
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv
```

In a web browser, go to the app's URL. Once the container app is started, it outputs *Hello Logger!*.

## Query log stream

You just saw the output sent to the browser, so now you can use the following command to see the messages being logged in the log stream.

```azurecli
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow
```

The query returns a response similar to the following example:

# [C#](#tab/csharp)

```console
{"TimeStamp", "xxxx", "Log": "info: Microsoft.Hosting.Lifetime[0]"}
{"TimeStamp", "xxxx", "Log": "Hosting environment: Production"}
{"TimeStamp", "xxxx", "Log": "info: Microsoft.Hosting.Lifetime[0]"}
{"TimeStamp", "xxxx", "Log": "Content root path: /app"}
{"TimeStamp", "xxxx", "Log": "info: Startup[0]"}
{"TimeStamp", "xxxx", "Log": "Hello Logger!""}
```

# [Java](#tab/java)

```console
{"TimeStamp":"xxxx","Log":"INFO 1 : Initializing Servlet 'dispatcherServlet'"}
{"TimeStamp":"xxxx","Log":"INFO 1 : Completed initialization in 1 ms"}
{"TimeStamp":"xxxx","Log":"INFO 1 : Hello, Logger!"}
```

# [JavaScript](#tab/javascript)

```console
{"TimeStamp":"xxxx","Log":"Connecting to the container 'my-demo-app'..."}
{"TimeStamp":"xxxx","Log":"Server running at http://localhost:8080/"}
{"TimeStamp":"xxxx","Log":"Hello Logger!"}
```

# [Python](#tab/python)

```console
[xxx +0000] [1] [INFO] Starting gunicorn 23.0.0
[xxx +0000] [1] [INFO] Listening at: http://0.0.0.0:8080 (1)
[xxx +0000] [1] [INFO] Using worker: sync
[xxx +0000] [8] [INFO] Booting worker with pid: 8
[xxxx] INFO in app: Hello Logger!
xxxx app: INFO Hello Logger!
```

---

Notice how you can see the message of `Hello Logger!` in the stream.

To stop following the stream, you can enter <kbd>Cmd/Ctrl</kbd> + <kbd>C</kbd> to terminate the messages.

## Clean up resources

If you're not going to use the Azure resources created in this tutorial, you can remove them with the following command.

```azurecli
az group delete --name my-demo-group
```

> [!TIP]
> Having issues? Let us know on GitHub by opening an issue in the [Azure Container Apps repo](https://github.com/microsoft/azure-container-apps).

## Next steps

Continue on to learn how to connect to services in Azure Container Apps.

> [!div class="nextstepaction"]
> [Connect to services in Azure Container Apps (preview)](services.md)