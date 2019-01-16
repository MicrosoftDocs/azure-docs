---
title: "include file"
description: "include file"
ms.custom: "include file"
services: azure-dev-spaces
ms.service: "azure-dev-spaces"
ms.component: "azds-kubernetes"
author: ghogen
ms.author: ghogen
ms.date: "05/11/2018"
ms.topic: "include"
manager: douge
---
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

> [!Note]
> Before you proceed, close all VS Code windows for both services, and then run `azds up -d` in each of the service's root folders. (This is a Preview limitation.)

Let's take a closer look at where the services are currently running. Run the `azds list-up` command, and you'll see output similar to the following:

```
Name                          DevSpace  Type     Updated  Status
----------------------------  --------  -------  -------  -------
mywebapi                      default   Service  3m ago   Running
mywebapi-56c8f45d9-zs4mw      default   Pod      3m ago   Running
webfrontend                   default   Service  1m ago   Running
webfrontend-6b6ddbb98f-fgvnc  default   Pod      1m ago   Running
```

The DevSpace column shows that both services are running in a space named `default`. Anyone who opens the public URL and navigates to the web app will invoke the code path you previously wrote that runs through both services. Now suppose you want to continue developing `mywebapi`. How can you make code changes and test them and not interrupt other developers who are using the dev environment? To do that, you'll set up your own space.

### Create a dev space
To run your own version of `mywebapi` in a space other than `default`, you can create your own space by using the following command:

``` 
azds space select --name scott
```

When prompted, select `default` as the **parent dev space**. This means our new space, `default/scott`, will derive from the space `default`. We'll shortly see how this will help us with testing. 

In the example above, I've used my name for the new space so that it is identifiable to my peers that it's the space I'm working in, but you can call it anything you like and be flexible about what it means, like 'sprint4' or 'demo.'

Run the `azds space list` command to see a list of all the spaces in the dev environment. An asterisk (*) appears next to the currently selected space. In your case, the space named 'default/scott' was automatically selected when it was created. You can select another space at any time with the `azds space select` command.
