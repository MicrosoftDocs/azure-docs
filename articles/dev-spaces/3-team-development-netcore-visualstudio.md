---
title: "Team development with Azure Dev Spaces using .NET Core and Visual Studio | Microsoft Docs"
titleSuffix: Azure Dev Spaces
services: azure-dev-spaces
ms.service: azure-dev-spaces
ms.component: azds-kubernetes
author: DrEsteban
ms.author: stevenry
ms.date: "12/09/2018"
ms.topic: "tutorial"
description: "Rapid Kubernetes development with containers and microservices on Azure"
keywords: "Docker, Kubernetes, Azure, AKS, Azure Kubernetes Service, containers"
---

# Team Development with Azure Dev Spaces

In this tutorial, you'll learn how to use multiple dev spaces to work simultaneously in different development environments, keeping separate work in separate dev spaces in the same cluster.

## Learn about team development

So far you've run your application's code as if you were the only developer working on the app. In this section, you'll learn how Azure Dev Spaces streamlines team development:
* Enable a team of developers to work in the same environment, by working in a shared dev space or in distinct dev spaces as needed..
* Supports each developer iterating on their code in isolation and without fear of breaking others.
* Test code end-to-end, prior to code commit, without having to create mocks or simulate dependencies.

### Challenges with developing microservices
Your sample application isn't very complex at the moment. But in real-world development, challenges soon emerge as you add more services and the development team grows.

Picture yourself working on a service that interacts with dozens of other services.

- It can become unrealistic to run everything locally for development. Your dev machine may not have enough resources to run the entire app. Or, perhaps your app has endpoints that need to be publicly reachable (for example, your app responds to a webhook from a SaaS app).
- You can try to only run the services that you depend on, but this means you'd need know the full closure of dependencies (for example, dependencies of dependencies). Or, it's a matter of not easily knowing how to build and run your dependencies because you didn't work on them.
- Some developers resort to simulating, or mocking up, many of their service dependencies. This can help sometimes, but managing those mocks can soon take on its own development effort. Plus, this leads to your dev environment looking different from production, and subtle bugs can creep in.
- It follows that doing any type of end-to-end testing becomes difficult. Integration testing can only realistically happen after a commit, which means you see problems later in the development cycle.

    ![](media/common/microservices-challenges.png)

### Work in a shared dev space
With Azure Dev Spaces, you can set up a *shared* dev space in Azure. Each developer can focus on just their part of the application, and can iteratively develop *pre-commit code* in a dev space that already contains all the other services and cloud resources that their scenarios depend on. Dependencies are always up-to-date, and developers are working in a way that mirrors production.

### Work in your own space
As you develop code for your service, and before you're ready to check it in, code often won't be in a good state. You're still iteratively shaping it, testing it, and experimenting with solutions. Azure Dev Spaces provides the concept of a **space**, which allows you to work in isolation, and without the fear of breaking your team members.

## Hands on with spaces
Let's demonstrate these ideas with a concrete example using our *webfrontend* -> *mywebapi* sample application. We'll imagine a scenario where a developer, Scott, needs to make a change to the *mywebapi* service, and *only* that service. The *webfrontend* won't need to change as part of Scott's feature/bugfix.

Traditionally, Scott would have a few options at development time (none of which are ideal):
* Run ALL components locally (requires a more powerful development machine with Docker installed, and potentially MiniKube.)
* Run ALL components in an isolated namespace on the Kubernetes cluster (since *webfrontend* isn't changing, this is a waste of cluster resources)
* ONLY run *mywebapi*, and make manual REST calls to test (doesn't test the full E2E flow)
* Add development-focused code to *webfrontend* that allows the developer to send requests to a different instance of *mywebapi* (complicates the *webfrontend* service)

Admittedly, our 2-service sample application isn't a very resource-intensive example. But it's easy to see how it becomes a real challenge as a complex micro-service application matures. Luckily, **Dev Spaces can help with this!**

### Download sample code
For the sake of time, let's download sample code from a GitHub repository. Go to https://github.com/Azure/dev-spaces/tree/azds_updates and select **Clone or Download** to download the GitHub repository.

> [!Note]
> We specifically want the `azds_updates` branch for this step, *not* the `master` branch. The `azds_updates` branch contains updates we asked you to make manually in previous tutorial sections as well as some pre-configured Dev Spaces assets.

### Set up your "baseline"
First we'll need to deploy a "baseline" of our services. This deployment will represent the "last known good" so you can easily compare the behavior of your local code vs. the checked-in version. We'll then create a child space off based on this baseline space so we can test our changes to *mywebapi* within the context of the larger application.

For the purposes of this tutorial there are 2 ways to establish your baseline:
1. **Most robust:** Deploy a CI/CD (continuous integration/continuous deployment) pipeline for the sample app
    1. We've written a how-to guide so you can deploy a fully automated CI/CD system on Azure DevOps Project which will automatically update your baseline up-to-date based on what's been checked-in. You can follow that guide by going [here](../articles/dev-spaces/how-to/setup-cicd.md).
2. **Quickest:** Manually deploy the services before proceeding:
    1. Close any F5/debug sessions for both services, but keep the projects open in their Visual Studio windows.
    2. Switch to the Visual Studio window with the `mywebapi` project and press Ctrl+F5 to run the service without the debugger attached
    3. Switch to the Visual Studio window with the `webfrontend` project and press Ctrl+F5 to run it as well.

> [!Note]
> It is sometimes necessary to refresh your browser after the web page is initially displayed 
> following a Ctrl+F5.

Anyone who opens the public URL and navigates to the web app will invoke the code path you have written which runs through both services using the default `dev` space. Now suppose you want to continue developing `mywebapi` - how can you do this and not interrupt other developers who are using the dev space? To do that, you'll set up your own space.

> [!Note]
> To support our [CI/CD example](../articles/dev-spaces/how-to/setup-cicd.md), note that we've prefixed 'dev' on the public hostname for *webfrontend*. So your baseline service can be accessed with a URL like: `http://dev.webfrontend.<hash>.<region>.aksapp.io`.

### Create a new dev space
From within Visual Studio, you can create additional spaces that will be used when you F5 or Ctrl+F5 your service. You can call a space anything you'd like, and you can be flexible about what it means (ex. `sprint4` or `demo`).

Do the following to create a new space:
1. Switch to the Visual Studio window with the `mywebapi` project.
2. Right-click on the project in **Solution Explorer** and select **Properties**.
3. Select the **Debug** tab on the left to show the Azure Dev Spaces settings.
4. From here, you can change or create the cluster and/or space that will be used when you F5 or Ctrl+F5. *Make sure the Azure Dev Space you created earlier is selected*.
5. In the Space dropdown, select **<Create New Space…>**.

    ![](media/get-started-netcore-visualstudio/Settings.png)

6. In the **Add Space** dialog, set the parent space to **dev**, and enter a name for your new space. You can use your name (for example, "scott") for the new space so that it is identifiable to your peers what space you're working in. Click **OK**.

    ![](media/get-started-netcore-visualstudio/AddSpace.png)

7. You should now see your AKS cluster and new Space selected on the project properties page.

    ![](media/get-started-netcore-visualstudio/Settings2.png)

### Update code for *mywebapi*

1. In the `mywebapi` project make a code change to the `string Get(int id)` method in file `Controllers/ValuesController.cs` as follows:
 
    ```csharp
    [HttpGet("{id}")]
    public string Get(int id)
    {
        return "mywebapi now says something new";
    }
    ```

2. Set a breakpoint in this updated block of code (you may already have one set from before).
3. Hit F5 to start the `mywebapi` service. This will start the service in your cluster using the selected space, which in this case is `scott`.

Here is a diagram that will help you understand how the different spaces work. The purple path shows a request via the `dev` space, which is the default path used if no space is prepended to the URL. The pink path shows a request via the `dev/scott` space.

![](media/common/Space-Routing.png)

This built-in capability of Azure Dev Spaces enables you to test code end-to-end in a shared environment without requiring each developer to re-create the full stack of services in their space. This routing requires propagation headers to be forwarded in your app code, as illustrated in the previous step of this guide.

### Test code running in the `dev/scott` space
To test your new version of `mywebapi` in conjunction with `webfrontend`, open your browser to the public access point URL for `webfrontend` (for example, http://dev.webfrontend.123456abcdef.eastus.aksapp.io) and go to the About page. You should see the original message "Hello from webfrontend and Hello from mywebapi".

Now, add the "scott.s." part to the URL so it reads something like http://scott.s.dev.webfrontend.123456abcdef.eastus.aksapp.io and refresh the browser. The breakpoint you set in your `mywebapi` project should get hit. Click F5 to proceed and in your browser you should now see the new message "Hello from webfrontend and mywebapi now says something new." This is because the path to your updated code in `mywebapi` is running in the `dev/scott` space.

Once you have a 'dev' space which always contains your "latest" changes, and assuming your application is designed to take advantage of DevSpace's space-based routing as described in this tutorial section, hopefully it becomes easy to see how Dev Spaces can greatly assist in testing new features within the context of the larger application. Rather than having to deploy _all_ services to your private space, you can simply create a private space that derives from 'dev', and only "up" the services you're actually working on. The Dev Spaces routing infrastructure will handle the rest by utilizing as many services out of your private space as it can find, while defaulting back to the "latest" version running in the 'dev' space. And better still, _multiple_ developers can actively develop different services at the same time in their own space without disrupting each other.

### Well done!
You've completed the getting started guide! You learned how to:

> [!div class="checklist"]
> * Set up Azure Dev Spaces with a managed Kubernetes cluster in Azure.
> * Iteratively develop code in containers.
> * Independently develop two separate services, and used Kubernetes' DNS service discovery to make a call to another service.
> * Productively develop and test your code in a team environment.
> * Leverage CI/CD together with Dev Spaces to easily test isolated changes within the context of a larger microservice application

Now that you've explored Azure Dev Spaces, [share your dev space with a team member](how-to/share-dev-spaces.md) and help them see how easy it is to collaborate together.

## Clean up
To completely delete an Azure Dev Spaces instance on a cluster, including all the dev spaces and running services within it, use the `az aks remove-dev-spaces` command. Bear in mind that this action is irreversible. You can add support for Azure Dev Spaces again on the cluster, but it will be as if you are starting again. Your old services and spaces won't be restored.

The following example lists the Azure Dev Spaces controllers in your active subscription, and then deletes the Azure Dev Spaces controller that is associated with AKS cluster 'myaks' in resource group 'myaks-rg'.

```cmd
    azds controller list
    az aks remove-dev-spaces --name myaks --resource-group myaks-rg
```