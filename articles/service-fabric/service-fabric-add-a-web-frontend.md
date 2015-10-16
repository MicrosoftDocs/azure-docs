<properties
   pageTitle="Create a web front-end for your application | Microsoft Azure"
   description="Expose your Service Fabric application to the web using an ASP.NET 5 WebAPI project and inter-service communication via ServiceProxy."
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="coreysa"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="10/15/2015"
   ms.author="seanmck"/>

# Build a web service front-end for your Application

By default, Service Fabric services do not provide a public interface to the web. To expose your application's functionality to HTTP clients, you will need to create a web project to act as entry point and then communicate from there to your individual services.

In this tutorial, we will walk through adding an ASP.NET 5 WebAPI front-end to an application which already includes a stateful service. If you have not already done so, consider walking through [Creating your first application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md) before starting this tutorial.

## Add an ASP.NET 5 service to your application

ASP.NET 5 is a lightweight, cross-platform web development framework, enabling the creation of modern Web UI and Web APIs. Let's add an ASP.NET WebAPI project to our existing application.

1. In Solution Explorer, right-click on the application project and choose **New Fabric Service**.

	![Adding a new service to an existing application][vs-add-new-service]

2. In the new service dialog, choose ASP.NET 5 Web Service and give it a name.

	![Choosing ASP.NET Web Service in the new service dialog][vs-new-service-dialog]

3. The next dialog provides a set of ASP.NET 5 project templates. Note that these are the same templates you would see if you created an ASP.NET 5 project outside of a Service Fabric application. For this tutorial, we will choose Web API but you can apply the same concepts to building a full web application.

	![Choosing ASP.NET project type][vs-new-aspnet-project-dialog]



## Next steps


<!-- Image References -->

[vs-add-new-service]: ./media/service-fabric-add-a-web-frontend/vs-add-new-service.png
[vs-new-service-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-service-dialog.png
[vs-new-aspnet-project-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-aspnet-project-dialog.png
