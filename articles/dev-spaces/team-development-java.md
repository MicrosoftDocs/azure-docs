---
title: "Team development with Azure Dev Spaces using Java and VS Code| Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: "stepro"
ms.author: "stephpr"
ms.date: "08/01/2018"
ms.topic: "tutorial"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
manager: "mmontwil"
---
# Team Development with Azure Dev Spaces

In this tutorial, you'll learn how to use multiple dev spaces to work simultaneously in different development environments, keeping separate work in separate dev spaces in the same cluster.

## Call a service running in a separate container

In this section, you create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. You'll then debug across both containers.

![Multiple containers](media/common/multi-container.png)

### Download sample code for *mywebapi*
For the sake of time, let's download sample code from a GitHub repository. Go to https://github.com/Azure/dev-spaces and select **Clone or Download** to download the GitHub repository. The code for this section is in `samples/java/getting-started/mywebapi`.

### Run *mywebapi*
1. Open the folder `mywebapi` in a *separate VS Code window*.
1. Open the **Command Palette** (using the **View | Command Palette** menu), and use auto-complete to type and select this command: `Azure Dev Spaces: Prepare configuration files for Azure Dev Spaces`.
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when the VS Code debug bar appears.
1. The endpoint URL will look something like http://localhost:\<portnumber\>. **Tip: The VS Code status bar will display a clickable URL.** It might seem like the container is running locally, but actually it is running in our dev space in Azure. The reason for the localhost address is because `mywebapi` has not defined any public endpoints and can only be accessed from within the Kubernetes instance. For your convenience, and to facilitate interacting with the private service from your local machine, Azure Dev Spaces creates a temporary SSH tunnel to the container running in Azure.
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
1. Set a breakpoint in the `index()` method of the `webapi` project.
1. In the `webfrontend` project, set a breakpoint just before it sends a GET request to `mywebapi`, on the line starting with `try`.
1. Hit F5 in the `webfrontend` project (or restart the debugger if currently running).
1. Invoke the web app, and step through code in both services.
1. In the web app, the About page will display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi."

Well done! You now have a multi-container application where each container can be developed and deployed separately.

## Learn about team development

[!INCLUDE [](../../includes/team-development-1.md)]

Let's see it in action. Go to the VS Code window for `mywebapi` and make a code edit to the `String index()` method, for example:

```java
@RequestMapping(value = "/", produces = "text/plain")
public String index() {
    return "Hello from mywebapi says something new";
}
```

[!INCLUDE [](../../includes/team-development-2.md)]

### Well done!
You've completed the getting started guide! You learned how to:

> [!div class="checklist"]
> * Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
> * Iteratively develop code in containers.
> * Independently develop two separate services, and used Kubernetes' DNS service discovery to make a call to another service.
> * Productively develop and test your code in a team environment.

Now that you've explored Azure Dev Spaces, [share your dev space with a team member](how-to/share-dev-spaces.md) and help them see how easy it is to collaborate together.

## Clean up
To completely delete an Azure Dev Spaces instance on a cluster, including all the dev spaces and running services within it, use the `az aks remove-dev-spaces` command. Bear in mind that this action is irreversible. You can add support for Azure Dev Spaces again on the cluster, but it will be as if you are starting again. Your old services and spaces won't be restored.

The following example lists the Azure Dev Spaces controllers in your active subscription, and then deletes the Azure Dev Spaces controller that is associated with AKS cluster 'myaks' in resource group 'myaks-rg'.

```cmd
    azds controller list
    az aks remove-dev-spaces --name myaks --resource-group myaks-rg
```