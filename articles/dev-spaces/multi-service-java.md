---
title: "Running multiple dependent services using Java and VS Code"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
author: zr-msft
ms.author: zarhoads
ms.date: 11/21/2018
ms.topic: tutorial
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
---
# Multi-service development with Azure Dev Spaces

In this tutorial, you'll learn how to develop multi-service applications using Azure Dev Spaces, along with some of the added benefits that Dev Spaces provides.

## Call a service running in a separate container

In this section, you create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. You'll then debug across both containers.

![Multiple containers](media/common/multi-container.png)

### Download sample code for *mywebapi*
For the sake of time, let's download sample code from a GitHub repository. Go to https://github.com/Azure/dev-spaces and select **Clone or Download** to download the GitHub repository. The code for this section is in `samples/java/getting-started/mywebapi`.

### Run *mywebapi*
1. Open the folder `mywebapi` in a *separate VS Code window*.
1. Open the **Command Palette** (using the **View | Command Palette** menu), and use auto-complete to type and select this command: `Azure Dev Spaces: Prepare configuration files for Azure Dev Spaces`.
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when a message similar to the below appears in the debug console:

    ```cmd
    2019-03-11 17:02:35.935  INFO 216 --- [           main] com.ms.sample.mywebapi.Application       : Started Application in 8.164 seconds (JVM running for 9.272)
    ```

1. The endpoint URL will look something like `http://localhost:<portnumber>`. **Tip: The VS Code status bar will turn orange and display a clickable URL.** It might seem like the container is running locally, but actually it is running in our dev space in Azure. The reason for the localhost address is because `mywebapi` has not defined any public endpoints and can only be accessed from within the Kubernetes instance. For your convenience, and to facilitate interacting with the private service from your local machine, Azure Dev Spaces creates a temporary SSH tunnel to the container running in Azure.
1. When `mywebapi` is ready, open your browser to the localhost address.
1. If all the steps were successful, you should be able to see a response from the `mywebapi` service.

### Make a request from *webfrontend* to *mywebapi*
Let's now write code in `webfrontend` that makes a request to `mywebapi`.
1. Switch to the VS Code window for `webfrontend`.
1. *Add* the following `import` statements under the `package` statement:

   ```java
   import java.io.*;
   import java.net.*;
   ```
1. *Replace* the code for the greeting method:

    ```java
    @RequestMapping(value = "/greeting", produces = "text/plain")
    public String greeting(@RequestHeader(value = "azds-route-as", required = false) String azdsRouteAs) throws Exception {
        URLConnection conn = new URL("http://mywebapi/").openConnection();
        conn.setRequestProperty("azds-route-as", azdsRouteAs); // propagate dev space routing header
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream())))
        {
            return "Hello from webfrontend and " + reader.lines().reduce("\n", String::concat);
        }
    }
    ```

The preceding code example forwards the `azds-route-as` header from the incoming request to the outgoing request. You'll see later how this helps teams with collaborative development.

### Debug across multiple services
1. At this point, `mywebapi` should still be running with the debugger attached. If it is not, hit F5 in the `mywebapi` project.
1. Set a breakpoint in the `index()` method of the `mywebapi` project, on [line 19 of `Application.java`](https://github.com/Azure/dev-spaces/blob/master/samples/java/getting-started/mywebapi/src/main/java/com/ms/sample/mywebapi/Application.java#L19)
1. In the `webfrontend` project, set a breakpoint just before it sends a GET request to `mywebapi`, on the line starting with `try`.
1. Hit F5 in the `webfrontend` project (or restart the debugger if currently running).
1. Invoke the web app, and step through code in both services.
1. In the web app, the About page will display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi."

### Well done!
You now have a multi-container application where each container can be developed and deployed separately.


## Next steps

> [!div class="nextstepaction"]
> [Learn about team development in Dev Spaces](team-development-java.md)
