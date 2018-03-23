---
title: "Quickstart: Create a Kubernetes development environment in Azure - .NET Core - Visual Studio | Microsoft Docs"
author: "ghogen"
ms.author: "ghogen"
ms.date: "03/22/2018"
ms.topic: "quickstart"
ms.technology: "vsce-kubernetes"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Container Service, containers"
manager: "douge"
---
# Get Started on Connected Environment with .NET Core and Visual Studio

In this guide, you will learn how to:

1. Create a Kubernetes-based environment in Azure that is optimized for development.
1. Iteratively develop code in containers using Visual Studio.
1. Independently develop two separate services, and used Kubernetes' DNS service discovery to make a call to another service.
1. Productively develop and test your code in a team environment.

[!INCLUDE[](includes/see-troubleshooting.md)]

## Install the Connected Environment CLI
Connected Environment requires minimal local machine setup. Most of your development environment's configuration gets stored in the cloud, and is shareable with other users.

1. Install [Git for Windows](https://git-scm.com/downloads), select the default install options. 
1. Download **kubectl.exe** from [this link](https://storage.googleapis.com/kubernetes-release/release/v1.9.0/bin/windows/amd64/kubectl.exe) and **save** it to a location on your PATH.
1. Download and run the [Connected Environment CLI Installer](https://aka.ms/get-vsce-windows). 

## Get Kubernetes Debugging Tools
While you can use the Connected Environment CLI as a standalone tool, rich features like **Kubernetes debugging** are available for .NET Core developers using **VS Code** or **Visual Studio**.

### Visual Studio debugging 
1. Install the latest version of [Visual Studio 2017](https://www.visualstudio.com/vs/)
1. In the Visual Studio installer make sure the following Workload is selected:
    * ASP.NET and web development
1. Install the [Visual Studio extension for Connected Environment](https://aka.ms/get-vsce-visualstudio)

We're now ready to Create an ASP.NET web app with Visual Studio.

## Create an ASP.NET web app
From within Visual Studio 2017 create a new project, currently this must be an **ASP.NET Core Web Application**. Name the project '**webfrontend**'.

![](media/NewProjectDialog1.png)

Select the **Web Application (Model-View-Controller)** template and be sure you are targeting **.NET Core** and **ASP.NET Core 2.0** in the two dropdowns at the top of the dialog. Click **OK** to create the project.

![](media/NewProjectDialog2.png)


## Create a dev environment in Azure
With Connected Environment, you can create Kubernetes-based development environments that are fully managed by Azure and optimized for development. With the project we just created open, select **Connected Environment for AKS** from the launch settings dropdown as shown below.

![](media/LaunchSettings.png)

In the dialog that is displayed next make sure you are signed in with the appropriate account and then either select an existing development environment or select **<Create New Connected Environment for AKS…>** to create a new one.

![](media/ConnectedEnvDialog.png)

You can use the default values provided or adjust them as you like. Click **OK** when the values are set appropriately.

![](media/NewEnvDialog.png)

Back on the previous dialog leave the **Space** dropdown defaulted to `mainline` for now, we will discuss this later in more detail. Check the **Publicly Accessible** checkbox so the web app will be accessible via a public endpoint. This isn't required but it will be helpful to demonstrate some concepts later in this walkthrough. But don’t worry, in either case you will be able to debug your website using Visual Studio.

![](media/ConnectedEnvDialog2.png)

Click **OK** to select or create the development environment. A background task will be started to accomplish this, it will take a number of minutes to complete. You can see if it is still being created by hovering your cursor over the **Background tasks** icon in the bottom left corner of the status bar (see below).

![](media/BackgroundTasks.png)

> [!Note]
Until the development environment is successfully created you cannot debug your application.

## Look at the files added to project
While we wait for the development environment to be created, let’s look at the files that have been added to your project when you chose to use a development environment.

First, you can see a folder named `charts` has been added and within this a [Helm chart](https://docs.helm.sh) for your application has been scaffolded. These files are used to deploy your application into the development environment.

You will see a file named `Dockerfile` has been added. This file has information needed to package your application in the standard Docker format. A `HeaderPropagation.cs` file is also created, we will discuss this file later in the walkthrough. 

Lastly, you will see a file named `vsce.yaml` which contains configuration information that is needed by the development environment, such as whether the application should be accessible via a public endpoint.

![](media/ProjectFiles.png)

## Debug a container in Kubernetes
Once the development environment is successfully created you can debug the application. Set a breakpoint in the code, for example on line 20 in the file `HomeController.cs` where the `Message` variable is set. Click **F5** to start debugging. 

Visual Studio will communicate with the development environment to build and deploy the application and then open a browser with the web app running. It may seem like the container is running locally, but actually it is running in our development environment in Azure. The reason for the localhost address is because Connected Environment creates a temporary SSH tunnel to the container running in Azure.

Click on the “**About**” link at the top of the page to trigger the breakpoint. You have full access to debug information just like you would if the code was executing locally, such as the call stack, local variables, exception information, etc.


## Call another container
In this section we're going to create a second service, `mywebapi`, and have `webfrontend` call it. Each service will run in separate containers. We'll then debug across both containers.

![](media/multi-container.png)

## Download sample code for *mywebapi*
For the sake of time, let's download sample code from a GitHub repository. Go to https://github.com/Azure/vsce and select **Clone or Download** to download the GitHub repository. The code for this section is in `vsce/samples/dotnetcore/getting-started/mywebapi`.

## Run *mywebapi*
1. Open the project `mywebapi` in a *separate Visual Studio window*.
1. Select **Connected Environment for AKS** from the launch settings dropdown as you did previously for the `webfrontend` project. Rather than create a new development environment this time, select the same one you already created. As before, leave the Space defaulted to `mainline` and click **OK**. In the Output window you may notice Visual Studio starts to "warm up" this new service in your development environment in order to speed things up when you start debugging,
1. Hit F5, and wait for the service to build and deploy. You'll know it's ready when the Visual Studio status bar turns orange
1. Take note of the endpoint URL displayed in the **Connected Environment for AKS** pane in the **Output** window, it will look something like http://localhost:\<portnumber\>. It may seem like the container is running locally, but actually it is running in our development environment in Azure.
1. When `mywebapi` is ready, open your browser to the localhost address and append `/api/values` to the URL to invoke the default GET API for the `ValuesController`. 
1. If all the steps were successful, you should be able to see a response from the `mywebapi` service that looks like this.

    ![](media/WebAPIResponse.png)

## Make a request from *webfrontend* to *mywebapi*
Let's now write code in `webfrontend` that makes a request to `mywebapi`. Switch to the Visual Studio window which has the `webfrontend` project. In the `HomeController.cs` file *replace* the code for the About method with the following:

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

The code example above also makes use of a `HeaderPropagatingHttpClient` class. This helper class is the file `HeaderPropagation.cs` that was added to your project when you configured it to use Connected Environment. `HeaderPropagatingHttpClient` is dervied from the well-known `HttpClient` class, and it adds functionality to propagate specific headers from an existing ASP .NET HttpRequest object into an outgoing HttpRequestMessage object. We'll see later how this facilitates a more productive development experience in team scenarios.

## Debug across multiple services
1. At this point, `mywebapi` should still be running with the debugger attached. If it is not, hit F5 in the `mywebapi` project.
1. Set a breakpoint in the `Get(int id)` method in the `ValuesController.cs` file that handles `api/values/{id}` GET requests.
1. In the `webfrontend` project where we pasted the above code, set a breakpoint just before it sends a GET request to `mywebapi/api/values`.
1. Hit F5 in the `webfrontend` project. Visual Studio will again open a browser to the appropriate localhost port and the web app will be displayed.
1. Click on the “**About**” link at the top of the page to trigger the breakpoint in the `webfrontend` project. 
1. Hit F10 to proceed. The breakpoint in the `mywebapi` project will now be triggered.
1. Hit F5 to proceed and you will be back in the code in the `webfrontend` project.
1. Hitting F5 one more time will complete the request and return a page in the browser. In the web app, the About page will display a message concatenated by the two services: "Hello from webfrontend and Hello from mywebapi".

Well done! You now have a multi-container application where each container can be developed and deployed separately.


## Learn about team development

So far we've run our application's code as if we were the only developer working on the app. In this section, we'll learn how Connected Environment streamlines team development:
* Enable a team of developers to work in the same development environment.
* Supports each developer iterating on their code in isolation and without fear of breaking others.
* Test code end-to-end, prior to code commit, without having to create mocks or simulate dependencies.

## Challenges with developing microservices
Our sample application isn't very complex at the moment. But in real-world development, challenges soon emerge as more services are added and the development team grows.

Picture yourself working on a service that interacts with dozens of other services.

1. It can become unrealistic to run everything locally for development. Your dev machine may not have enough resources to run the entire app. Or, perhaps your app has endpoints that need to be publicly reachable (for example, your app responds to a webhook from a SaaS app).
1. You can try to only run the services that you depend on, but this means you'd need know the full closure of dependencies (for example, dependencies of dependencies). Or, it's a matter of not easily knowing how to build and run your dependencies because you didn't work on them.
1. Some developers resort to simulating, or mocking up, many of their service dependencies. This can help sometimes, but managing those mocks can soon take on its own development effort. Plus, this leads to your dev environment looking very different to production, and subtle bugs can creep in.
1. It follows that doing any type of end-to-end testing becomes difficult. Integration testing can only realistically happen post-commit, which means we see problems later in the development cycle.

    ![](media/microservices-challenges.png)

## Work in a shared development environment
With Connected Environment, you can set up a *shared* development environment in Azure. Each developer can focus on just their part of the application, and can iteratively develop *pre-commit code* in an environment that already contains all the other services and cloud resources that their scenarios depend on. Dependencies are always up to date, and developers are working in a way that mirrors production.

## Work in your own space
As you develop code for your service, and before you're ready to check it in, code often won't be in a good state. You're still iteratively shaping it, testing it, and experimenting with solutions. Connected Environment provides the concept of a **space**, which allows you to work in isolation, and without the fear of breaking your team members.

Do the following to make sure both our `webfrontend` and `mywebapi` services are running in our development environment **and in the `mainline` space**.
1. Close any F5/debug sessions for both services, but keep the projects open in their Visual Studio windows.
2. Switch to the Visual Studio window with the `mywebapi` project and press Ctrl+F5 to run the service without the debugger attached
3. Switch to the Visual Studio window with the `webfrontend` project and press Ctrl+F5 to run it as well.

> [!Note]
It is sometimes necessarry to refresh your browser after it the web page is initially displayed following a Ctrl+F5.

Anyone who opens the public URL and navigates to the web app will invoke the code path we have written which runs through both services using the default `mainline` space. Now suppose we want to continue developing `mywebapi` - how can we do this and not interrupt other developers who are using the development environment? To do that, we'll set up our own space.

### Create a New Space
From within Visual Studio you can create additional spaces which will be used when you F5 or Ctrl+F5 your service. You can call a space anything you'd like, and you can be flexible about what it means (ex. `sprint4` or `demo`).

Do the following to create a new space:
1. Switch to the Visual Studio window with the `mywebapi` project.
2. Right-click on the project in **Solution Explorer** and select **Properties**.
3. Select the **Debug** tab on the left to show the Connected Environment settings.
4. From here you can change or create the Connected Environment and/or space that will be used when you F5 or Ctrl+F5. *Make sure the Connected Environment you created earlier is selected*.
5. In the **Space** dropdown select **<Create New Space…>**.

    ![](media/Settings.png)

6. In the **Add Space** dialog type in a name for the space and click **OK**. I've used my name ("scott") for the new space so that it is identifiable to my peers what space I'm working in.

    ![](media/AddSpace.png)

7. You should now see your development environment and new Space selected on the project properties page.

    ![](media/Settings2.png)

### Update code for *mywebapi*

1. In the `mywebapi` project make a code change to the `string Get(int id)` method in file `ValuesController.cs` as follows:
 
    ```csharp
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "mywebapi now says something new";
    }
    ```

2. Set a breakpoint in this updated block of code (you may already have one set from before).
3. Hit F5 to start the `mywebapi` service. This will start the service in your development environment using the selected space, which in my case is `scott`.

Here is a diagram that will help you understand how the different spaces work. The blue path shows a request via the `mainline` space, which is the default path used if no space is prepended to the URL. The green path shows a request via the `scott` space.

![](media/Space-Routing.png)

This built-in capability of Connected Environment enables you to test code end-to-end in a shared evironment without requiring each developer  to re-create the full stack of services in their space. Note that this routing requires propagation headers to be forwarded in your app code, as illustrated in the previous step of this guide.

## Test Code Running in the `scott` Space
To test our new version of `mywebapi` in conjunction with `webfrontend`, open your browser to the public access point URL for `webfrontend` (ex. https://webfrontend-teamenv.vsce.io) and go to the About page. You should see the original message "Hello from webfrontend and Hello from mywebapi".

Now, add the "scott-" part to the URL so it reads something like https://scott-webfrontend-teamenv.vsce.io and refresh the browser. The breakpoint you set in your `mywebapi` project should get hit. Click F5 to proceed and in your browser you should now see the new message "Hello from webfrontend and mywebapi now says something new". This is because the path to your updated code in `mywebapi` is running in the `scott` space.


[!INCLUDE[](includes/well-done.md)]

[!INCLUDE[](includes/take-survey.md)]

[!INCLUDE[](includes/clean-up.md)]

## Next steps

TBD
