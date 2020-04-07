---
title: "Create a Kubernetes dev space: Visual Studio Code & .NET Core"
services: azure-dev-spaces
ms.date: 09/26/2018
ms.topic: tutorial
description: "This tutorial shows you how to use Azure Dev Spaces and Visual Studio Code to debug and rapidly iterate a .NET Core application on Azure Kubernetes Service"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers, Helm, service mesh, service mesh routing, kubectl, k8s"
---
# Create a Kubernetes dev space: Visual Studio Code and .NET Core with Azure Dev Spaces

In this guide, you will learn how to:

- Create a Kubernetes-based environment in Azure that is optimized for development - a _dev space_.
- Iteratively develop code in containers using VS Code and the command line.
- Productively develop and test your code in a team environment.

> [!Note]
> **If you get stuck** at any time, see the [Troubleshooting](troubleshooting.md) section.

## Install the Azure CLI
Azure Dev Spaces requires minimal local machine setup. Most of your dev space's configuration gets stored in the cloud, and is shareable with other users. Start by downloading and running the [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest).

### Sign in to Azure CLI
Sign in to Azure. Type the following command in a terminal window:

```azurecli
az login
```

> [!Note]
> If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).

#### If you have multiple Azure subscriptions...
You can view your subscriptions by running: 

```azurecli
az account list --output table
```

Locate the subscription which has *True* for *IsDefault*.
If this isn't the subscription you want to use, you can change the default subscription:

```azurecli
az account set --subscription <subscription ID>
```

## Create a Kubernetes cluster enabled for Azure Dev Spaces

At the command prompt, create the resource group in a [region that supports Azure Dev Spaces][supported-regions].

```azurecli
az group create --name MyResourceGroup --location <region>
```

Create a Kubernetes cluster with the following command:

```azurecli
az aks create -g MyResourceGroup -n MyAKS --location <region> --generate-ssh-keys
```

It takes a few minutes to create the cluster.

### Configure your AKS cluster to use Azure Dev Spaces

Enter the following Azure CLI command, using the resource group that contains your AKS cluster, and your AKS cluster name. The command configures your cluster with support for Azure Dev Spaces.

   ```azurecli
   az aks use-dev-spaces -g MyResourceGroup -n MyAKS
   ```
   
> [!IMPORTANT]
> The Azure Dev Spaces configuration process will remove the `azds` namespace in the cluster, if it exists.

## Get Kubernetes debugging for VS Code
Rich features like Kubernetes debugging are available for .NET Core and Node.js developers using VS Code.

1. If you don't have it, install [VS Code](https://code.visualstudio.com/Download).
1. Download and install the [VS Azure Dev Spaces](https://marketplace.visualstudio.com/items?itemName=azuredevspaces.azds) and [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) extensions. For each extension, click install on the extension's Marketplace page, and again in VS Code.

## Create a web app running in a container

In this section, you'll create an ASP.NET Core web app and get it running in a container in Kubernetes.

### Create an ASP.NET Core web app
Clone or download the [Azure Dev Spaces sample application](https://github.com/Azure/dev-spaces). This article uses the code in the *samples/dotnetcore/getting-started/webfrontend* directory.

## Preparing code for Docker and Kubernetes development
So far, you have a basic web app that can run locally. You'll now containerize it by creating assets that define the app's container and how it will deploy to Kubernetes. This task is easy to do with Azure Dev Spaces: 

1. Launch VS Code and open the `webfrontend` folder. (You can ignore any default prompts to add debug assets or restore the project.)
1. Open the Integrated Terminal in VS Code (using the **View > Integrated Terminal** menu).
1. Run this command (be sure that **webfrontend** is your current folder):

    ```cmd
    azds prep --enable-ingress
    ```

The Azure CLI's `azds prep` command generates Docker and Kubernetes assets with default settings:
* `./Dockerfile` describes the app's container image, and how the source code is built and runs within the container.
* A [Helm chart](https://docs.helm.sh) under `./charts/webfrontend` describes how to deploy the container to Kubernetes.

> [!TIP]
> The [Dockerfile and Helm chart](how-dev-spaces-works-prep.md#prepare-your-code) for your project is used by Azure Dev Spaces to build and run your code, but you can modify these files if you want to change how the project is built and ran.

For now, it isn't necessary to understand the full content of these files. It's worth pointing out, however, that **the same Kubernetes and Docker configuration-as-code assets can be used from development through to production, thus providing better consistency across different environments.**
 
A file named `./azds.yaml` is also generated by the `prep` command, and it is the configuration file for Azure Dev Spaces. It complements the Docker and Kubernetes artifacts with additional configuration that enables an iterative development experience in Azure.

## Build and run code in Kubernetes
Let's run our code! In the terminal window, run this command from the **root code folder**, webfrontend:

```cmd
azds up
```

Keep an eye on the command's output, you'll notice several things as it progresses:
- Source code is synced to the dev space in Azure.
- A container image is built in Azure, as specified by the Docker assets in your code folder.
- Kubernetes objects are created that utilize the container image as specified by the Helm chart in your code folder.
- Information about the container's endpoint(s) is displayed. In our case, we're expecting a public HTTP URL.
- Assuming the above stages complete successfully, you should begin to see `stdout` (and `stderr`) output as the container starts up.

> [!Note]
> These steps will take longer the first time the `up` command is run, but subsequent runs should be quicker.

### Test the web app
Scan the console output for the *Application started* message, confirming that the `up` command has completed:

```
Service 'webfrontend' port 80 (TCP) is available at 'http://localhost:<port>'
Service 'webfrontend' port 'http' is available at http://webfrontend.1234567890abcdef1234.eus.azds.io/
Microsoft (R) Build Engine version 15.9.20+g88f5fadfbe for .NET Core
Copyright (C) Microsoft Corporation. All rights reserved.

  webfrontend -> /src/bin/Debug/netcoreapp2.2/webfrontend.dll
  webfrontend -> /src/bin/Debug/netcoreapp2.2/webfrontend.Views.dll

Build succeeded.
    0 Warning(s)
    0 Error(s)

Time Elapsed 00:00:00.94
[...]
webfrontend-5798f9dc44-99fsd: Now listening on: http://[::]:80
webfrontend-5798f9dc44-99fsd: Application started. Press Ctrl+C to shut down.
```

Identify the public URL for the service in the output from the `up` command. It ends in `.azds.io`. In the above example, the public URL is `http://webfrontend.1234567890abcdef1234.eus.azds.io/`.

To see your web app, open the public URL in a browser. Also, notice `stdout` and `stderr` output is streamed to the *azds trace* terminal window as you interact with your web app. You'll also see tracking information for HTTP requests as they go through the system. This makes it easier for you to track complex multi-service calls during development. The instrumentation added by Dev Spaces provides this request tracking.

![azds trace terminal window](media/get-started-netcore/azds-trace.png)


> [!Note]
> In addition to the public URL, you can use the alternative `http://localhost:<portnumber>` URL that is displayed in the console output. If you use the localhost URL, it may seem like the container is running locally, but actually it is running in AKS. Azure Dev Spaces uses Kubernetes *port-forward* functionality to map the localhost port to the container running in AKS. This facilitates interacting with the service from your local machine.

### Update a content file
Azure Dev Spaces isn't just about getting code running in Kubernetes - it's about enabling you to quickly and iteratively see your code changes take effect in a Kubernetes environment in the cloud.

1. Locate the file `./Views/Home/Index.cshtml` and make an edit to the HTML. For example, change [line 73 that reads `<h2>Application uses</h2>`](https://github.com/Azure/dev-spaces/blob/master/samples/dotnetcore/getting-started/webfrontend/Views/Home/Index.cshtml#L73) to something like: 

    ```html
    <h2>Hello k8s in Azure!</h2>
    ```

1. Save the file. Moments later, in the Terminal window you'll see a message saying a file in the running container was updated.
1. Go to your browser and refresh the page. You should see the web page display the updated HTML.

What happened? Edits to content files, like HTML and CSS, don't require recompilation in a .NET Core web app, so an active `azds up` command automatically syncs any modified content files into the running container in Azure, so you can see your content edits right away.

### Update a code file
Updating code files requires a little more work, because a .NET Core app needs to rebuild and produce updated application binaries.

1. In the terminal window, press `Ctrl+C` (to stop `azds up`).
1. Open the code file named `Controllers/HomeController.cs`, and edit the message that the About page will display: `ViewData["Message"] = "Your application description page.";`
1. Save the file.
1. Run  `azds up` in the terminal window. 

This command rebuilds the container image and redeploys the Helm chart. To see your code changes take effect in the running application, go to the About menu in the web app.

But there is an even *faster method* for developing code, which you'll explore in the next section. 

## Debug a container in Kubernetes

In this section, you'll use VS Code to directly debug our container running in Azure. You'll also learn how to get a faster edit-run-test loop.

![](media/common/edit-refresh-see.png)

> [!Note]
> **If you get stuck** at any time, see the [Troubleshooting](troubleshooting.md) section, or post a comment on this page.

### Initialize debug assets with the VS Code extension
You first need to configure your code project so VS Code will communicate with our dev space in Azure. The VS Code extension for Azure Dev Spaces provides a helper command to set up debug configuration. 

Open the **Command Palette** (using the **View | Command Palette** menu), and use auto-complete to type and select this command: `Azure Dev Spaces: Prepare configuration files for Azure Dev Spaces`. 

This adds debug configuration for Azure Dev Spaces under the `.vscode` folder. This command is not to be confused with the `azds prep` command, which configures the project for deployment.

![](media/common/command-palette.png)


### Select the AZDS debug configuration
1. To open the Debug view, click on the Debug icon in the **Activity Bar** on the side of VS Code.
1. Select **.NET Core Launch (AZDS)** as the active debug configuration.

![](media/get-started-netcore/debug-configuration.png)

> [!Note]
> If you don't see any Azure Dev Spaces commands in the Command Palette, ensure you have installed the VS Code extension for Azure Dev Spaces. Be sure the workspace you opened in VS Code is the folder that contains azds.yaml.


### Debug the container in Kubernetes
Hit **F5** to debug your code in Kubernetes.

As with the `up` command, code is synced to the dev space, and a container is built and deployed to Kubernetes. This time, of course, the debugger is attached to the remote container.

> [!Tip]
> The VS Code status bar will turn orange, indicating that the debugger is attached. It will also display a clickable URL, which you can use to open your site.

![](media/common/vscode-status-bar-url.png)

Set a breakpoint in a server-side code file, for example within the `About()` function in the `Controllers/HomeController.cs` source file. Refreshing the browser page causes the breakpoint to hit.

You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.

### Edit code and refresh
With the debugger active, make a code edit. For example, modify the About page's message in `Controllers/HomeController.cs`. 

```csharp
public IActionResult About()
{
    ViewData["Message"] = "My custom message in the About page.";
    return View();
}
```

Save the file, and in the **Debug actions pane**, click the **Restart** button. 

![](media/common/debug-action-refresh.png)

Instead of rebuilding and redeploying a new container image each time code edits are made, which will often take considerable time, Azure Dev Spaces will incrementally recompile code within the existing container to provide a faster edit/debug loop.

Refresh the web app in the browser, and go to the About page. You should see your custom message appear in the UI.

**Now you have a method for rapidly iterating on code and debugging directly in Kubernetes!** Next, you'll see how you can create and call a second container.

## Next steps

> [!div class="nextstepaction"]
> [Learn about multi-service development](multi-service-netcore.md)


[supported-regions]: https://azure.microsoft.com/global-infrastructure/services/?products=kubernetes-service
