---
title: "Quickstart: Create a Kubernetes development environment in Azure - .NET Core | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/22/2018"
ms.topic: "quickstart"
ms.technology: "vsce-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Get Started on Connected Environment with .NET Core

[!INCLUDE[](includes/learning-objectives.md)]

[!INCLUDE[](includes/see-troubleshooting.md)]

[!INCLUDE[](includes/install-cli-and-vscode.md)]

We're now ready to create a Kubernetes-based development environment in Azure.

## Create a connected environment

[!INCLUDE[](includes/sign-into-azure.md)]

[!INCLUDE[](includes/create-env-cli.md)]

While we're waiting for the environment to be create, let's start developing code.

## Create an ASP.NET Core Web App
If you have [.NET Core](https://www.microsoft.com/net) installed, you can quickly create an ASP.NET Core Web App in a folder named `webfrontend`.
```cmd
dotnet new mvc --name webfrontend
```

Alternatively, **download sample code from GitHub** by navigating to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository to your local environment. The code for this guide is in `vsce/samples/dotnetcore/getting-started/webfrontend`.

[!INCLUDE[](includes/vsce-init.md)]

[!INCLUDE[](includes/ensure-env-created.md)]

[!INCLUDE[](includes/build-and-run-in-k8s-cli.md)]

## Update a content file
Connected Environment isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. Locate the file `./Views/Home/Index.cshtml` and make an edit to the HTML. For example, change line 70 that reads `<h2>Application uses</h2>` to something like: `<h2>Hello k8s in Azure!</h2>`
1. Save the file. Moments later, in the Terminal window you'll see a message saying a file in the running container was updated.
1. Go to your browser and refresh the page. You should see the web page display the updated HTML.

What happened? Edits to content files, like HTML and CSS, don't require re-compilation in a .NET Core web app, so an active `vsce up` command will automatically sync any modified content files into the running container in Azure, thereby providing a fast way to see your content edits.

## Update a code file
Updating code files requires a little more work, because a .NET Core app needs to rebuild and produce updated application binaries.

1. In the terminal window, press `Ctrl+C` (to stop `vsce up`).
1. Open the code file named `Controllers/HomeController.cs`, and edit the message that the About page will display: `ViewData["Message"] = "Your application description page.";`
1. Save the file.
1. Run  `vsce up` in the terminal window. 

This rebuilds the container image and redeploys the Helm chart. To see your code changes take effect in the running application, go to the About menu in the web app.


But there is an even *faster method* for developing code, which we'll explore in the next section. 

## Debug your web application

[!INCLUDE[](includes/debug-intro.md)]

[!INCLUDE[](includes/init-debug-assets-vscode.md)]


## Select the VSCE debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **.NET Core Launch (VSCE)** as the active debug configuration.

![](media/debug-configuration.png)

> [!Note]
> If you don't see any Connected Environment commands in the Command Palette, ensure you have [installed the VS Code extension for Connected Environment](get-started-netcore-01.md#get-kubernetes-debugging-for-vs-code).


## Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes.

As with the `up` command, code is synced to the development environment, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

[!INCLUDE[](includes/tip-vscode-status-bar-url.md)]

Set a breakpoint in a server-side code file, for example within the `Index()` function in the `Controllers/HomeController.cs` source file. Refreshing the browser page causes the breakpoint to hit.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

## Edit code and refresh
With the debugger active, make a code edit. For example, modify the About page's message in `Controllers/HomeController.cs`. 

```csharp
public IActionResult About()
{
    ViewData["Message"] = "My custom message in the About page.";
    return View();
}
```

Save the file, and in the **Debug actions pane**, click the **Refresh** button. 

![](media/debug-action-refresh.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Connected Environment will incrementally recompile code within the existing container to provide a faster edit/debug loop.

Refresh the web app in the browser, and go to the About page. You should see your custom message appear in the UI.

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, we'll see how we can create and call a second container.

## Call another container

In this section we're going to create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. We'll then debug across both containers.

![](media/multi-container.png)

## Download sample code for *mywebapi*
For the sake of time, let's download sample code from a GitHub repository. Go to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository. The code for this section is in `vsce/samples/dotnetcore/getting-started/mywebapi`.


## Run *mywebapi*
1. Open the folder `mywebapi` in a *separate VS Code window*.
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when the VS Code debug bar appears.
1. Take note of the endpoint URL, it will look something like http://localhost:\<portnumber\>. **Tip: The VS Code status bar will display a clickable URL.** It may seem like the container is running locally, but actually it is running in our development environment in Azure. The reason for the localhost address is because `mywebapi` has not defined any public endpoints and can only be accessed from within the Kubernetes instance. For your convenience, and to facilitate interacting with the private service from your local machine, Connected Environment creates a temporary SSH tunnel to the container running in Azure.
1. When `mywebapi` is ready, open your browser to the localhost address. Append `/api/values` to the URL to invoke the default GET API for the `ValuesController`. 
1. If all the steps were successful, you should be able to see a response from the `mywebapi` service.


## Make a request from *webfrontend* to *mywebapi*
Let's now write code in `webfrontend` that makes a request to `mywebapi`.
1. Switch to the VS Code window for `webfrontend`.
1. *Replace* the code for the About method:

```csharp
public async Task<IActionResult> About()
{
    ViewData["Message"] = "Hello from webfrontend";
    
    // Use HeaderPropagatingHttpClient instead of HttpClient so we can propagate
    // headers in the incoming request to any outgoing requests
    using (var client = new HeaderPropagatingHttpClient(this.Request))
    {
        // Call *mywebapi*, and display its response in the page
        var response = await client.GetAsync("http://mywebapi/api/values/1");
        ViewData["Message"] += " and " + await response.Content.ReadAsStringAsync();
    }

    return View();
}
```

Note how Kubernetes' DNS service discovery is employed to refer to the service as `http://mywebapi`. **Code in our development environment is running the same way it will run in production**.

The code example above also makes use of a `HeaderPropagatingHttpClient` class. This helper class was added to your code folder at the time you ran `vsce init`. `HeaderPropagatingHttpClient` is dervied from the well-known `HttpClient` class, and it adds functionality to propagate specific headers from an existing ASP .NET HttpRequest object into an outgoing HttpRequestMessage object. We'll see later how this facilitates a more productive development experience in team scenarios.


## Debug across multiple services
1. At this point, `mywebapi` should still be running with the debugger attached. If it is not, hit F5 in the `mywebapi` project.
1. Set a breakpoint in the `Get(int id)` method that handles `api/values/{id}` GET requests.
1. In the `webfrontend` project, set a breakpoint just before it sends a GET request to `mywebapi/api/values`.
1. Hit F5 in the `webfrontend` project.
1. Invoke the web app, and step through code in both services.
1. In the web app, the About page will display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi".


Well done! You now have a multi-container application where each container can be developed and deployed separately.

## Learn about team development

[!INCLUDE[](includes/team-development-1.md)]

Let's see it in action:
1. Go to the VS Code window for `mywebapi` and make a code edit to the `string Get(int id)` method, for example:

```csharp
[HttpGet("{id}")]
public string Get(int id)
{
    return "mywebapi now says something new";
}
```

[!INCLUDE[](includes/team-development-2.md)]

## Summary

[!INCLUDE[](includes/well-done.md)]

[!INCLUDE[](includes/take-survey.md)]

[!INCLUDE[](includes/clean-up.md)]


## Next steps

Continue with the tutorial []()