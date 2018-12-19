---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: DrEsteban
ms.author: stevenry
ms.date: "12/17/2018"
ms.topic: "include"
manager: yuvalm
---
# Team Development with Azure Dev Spaces

In this tutorial, you'll learn how to use multiple dev spaces to work simultaneously in different development environments, keeping separate work in separate dev spaces in the same cluster.

## Learn about team development
So far you've been running your application's code as if you were the only developer working on the app. In this section, you'll learn how Azure Dev Spaces streamlines team development:
* Enable a team of developers to work in the same environment, by working in a shared dev space or in distinct dev spaces as needed..
* Supports each developer iterating on their code in isolation and without fear of breaking others.
* Test code end-to-end, prior to code commit, without having to create mocks or simulate dependencies.

### Challenges with developing microservices
Your sample application isn't very complex at the moment. But in real-world development, challenges soon emerge as you add more services and the development team grows.

Picture yourself working on a service that interacts with dozens of other services.

- It can become unrealistic to run everything locally for development. Your dev machine may not have enough resources to run the entire app. Or, perhaps your app has endpoints that need to be publicly reachable (for example, your app responds to a webhook from a SaaS app).

- You can try to only run the services that you depend on, but this means you'd need know the full closure of dependencies (for example, dependencies of dependencies). Or, it's a matter of not easily knowing how to build and run your dependencies because you didn't work on them.
- Some developers resort to simulating, or mocking up, many of their service dependencies. This approach can help sometimes, but managing those mocks can soon take on its own development effort. Plus, this approach leads to your dev space looking very different to production, and subtle bugs can creep in.
- It follows that doing any type of end-to-end testing becomes difficult. Integration testing can only realistically happen post-commit, which means you see problems later in the development cycle.

![](../articles/dev-spaces/media/common/microservices-challenges.png)


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

> [!Note]
> Before you proceed, close all VS Code windows for both services. (This is a Preview limitation.)

For the purposes of this tutorial there are 2 ways to establish your baseline:
1. **Most robust:** Deploy a CI/CD (continuous integration/continuous deployment) pipeline for the sample app
    1. We've written a how-to guide so you can deploy a fully automated CI/CD system on Azure DevOps Project which will automatically update your baseline up-to-date based on what's been checked-in. You can follow that guide by going [here](../articles/dev-spaces/how-to/setup-cicd.md).
2. **Quickest:** Manually deploy the services using the `azds` CLI before proceeding
```
            > azds space select --name dev
   /mywebapi> azds up -d
/webfrontend> azds up -d
```

At this point your baseline should be running. Run the `azds list-up` command, and you'll see output similar to the following:

```
Name                          DevSpace  Type     Updated  Status
----------------------------  --------  -------  -------  -------
mywebapi                      dev       Service  3m ago   Running
mywebapi-56c8f45d9-zs4mw      dev       Pod      3m ago   Running
webfrontend                   dev       Service  1m ago   Running
webfrontend-6b6ddbb98f-fgvnc  dev       Pod      1m ago   Running
```

The DevSpace column shows that both services are running in a space named `dev`. Anyone who opens the public URL and navigates to the web app will invoke the checked-in code path that runs through both services. Now suppose you want to continue developing `mywebapi`. How can you make code changes and test them and not interrupt other developers who are using the dev environment? To do that, you'll set up your own space.

> [!Note]
> To support our [CI/CD example](../articles/dev-spaces/how-to/setup-cicd.md), note that we've prefixed 'dev' on the public hostname for *webfrontend*. So your baseline service can be accessed with a URL like: `http://dev.webfrontend.<hash>.<region>.aksapp.io`.

### Create a dev space
To run your own version of `mywebapi` in a space other than `dev`, you can create your own space by using the following command:

```
azds space select --name scott
```

When prompted, select `dev` as the **parent dev space**. This means our new space, `dev/scott`, will derive from the space `dev`. We'll shortly see how this will help us with testing.

Keeping with our introductory hypothetical, we've used the name 'scott' for the new space so peers can identify who is working in it. But it can be called anything you like, and be flexible about what it means, like 'sprint4' or 'demo'.

Run the `azds space list` command to see a list of all the spaces in the dev environment. An asterisk (*) appears next to the currently selected space. In your case, the space named 'dev/scott' was automatically selected when it was created. (You can select another space at any time with the `azds space select` command.)

Let's see it in action.