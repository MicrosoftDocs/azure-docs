<properties
   pageTitle="Create a web front-end for your application | Microsoft Azure"
   description="Expose your Service Fabric application to the web using an ASP.NET 5 Web API project and inter-service communication via ServiceProxy."
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

In this tutorial, we will walk through adding an ASP.NET 5 Web API front-end to an application which already includes a stateful service. If you have not already done so, consider walking through [Creating your first application in Visual Studio](service-fabric-create-your-first-application-in-visual-studio.md) before starting this tutorial.

## Add an ASP.NET 5 service to your application

ASP.NET 5 is a lightweight, cross-platform web development framework, enabling the creation of modern Web UI and Web APIs. Let's add an ASP.NET Web API project to our existing application.

1. In Solution Explorer, right-click on the application project and choose **New Fabric Service**.

	![Adding a new service to an existing application][vs-add-new-service]

2. In the new service dialog, choose ASP.NET 5 Web Service and give it a name.

	![Choosing ASP.NET Web Service in the new service dialog][vs-new-service-dialog]

3. The next dialog provides a set of ASP.NET 5 project templates. Note that these are the same templates you would see if you created an ASP.NET 5 project outside of a Service Fabric application. For this tutorial, we will choose Web API but you can apply the same concepts to building a full web application.

	![Choosing ASP.NET project type][vs-new-aspnet-project-dialog]

  Once your Web API project is created, you will have two services in your application. As you continue to build your application, you will add more services in exactly the same way and each can be independently versioned and upgraded.

## Run the application

To get a sense of what we've done, let's deploy the new application and take a look at the default behavior provided by the ASP.NET 5 Web API template.

1. Hit F5 in Visual Studio to debug the app.

2. When deployment is complete, Visual Studio will launch the browser to the root of the ASP.NET Web API service, something like http://localhost:33003 (the port number is randomly assigned and may be different on your machine). The ASP.NET 5 Web API template doesn't provide default behavior for the root so you will get an error in the browser.

3. Add `/api/values` to the location in the browser. This will invoke the `Get` method on the ValuesController in the Web API template and return the default response provided by the template, a JSON array containing two strings:

  ![Default values returned from ASP.NET 5 Web API template][browser-aspnet-template-values]

  By the end of the tutorial, we will have replaced these default values with the most recent counter value from our stateful service.

## Connect the services

Service Fabric provides complete flexibility in how you communicate with reliable services. Within a single application, you might have services which are accessible via TCP, others via a HTTP REST API, and still others via web sockets. For background on the options available and the tradeoffs involved, see [Communicating with Services](service-fabric-connect-and-communicate-with-services.md). In this tutorial, we will follow one of the simpler approaches and use the `ServiceProxy`/`ServiceCommunicationListener` classes provided in the SDK.

In the `ServiceProxy` approach (modeled on remote procedure calls or RPC) you define an interface to act as the public contract for the service and then use that interface to generate a proxy class for interacting with the service.

### Create the interface

We will start by creating the interface to act as the contract between the stateful service and its clients, including the ASP.NET 5 project.

1. In Solution Explorer, right click the your solution and choose **Add > New Project**.

2. Choose the Visual C# entry in the left navigation pane and then select the **Class Library** template. Ensure that the .NET framework version is set to 4.5.1.

  ![Creating an interface project for your stateful service][vs-add-class-library-project]

3. In order for an interface to be usable by `ServiceProxy`, it must derive from the IService interface, which is included in one of the Service Fabric NuGet packages. To add the package, right-click your new class library project and choose **Manage NuGet Packages**.

4. Ensure that the **Include Prerelease** checkbox is selected, then search for **Microsoft.ServiceFabric.Services** package and install it.

  ![Adding the Services NuGet package][vs-services-nuget-package]

5. In the class library, create an interface with a single method, `GetCount`, and extend the interface from IService.

  ```c#
  namespace MyStatefulService.Interfaces
  {
      using Microsoft.ServiceFabric.Services;

      public interface ICounter: IService
      {
          int GetCount();
      }
  }
  ```

### Implement the interface in your stateful service

Now that we have defined the interface, we need to implement it in our stateful service.

1. In your stateful service, add a reference to the class library project containing the interface.

  ![Adding a reference to the class library project in the stateful service][vs-add-class-library-reference]

2. Locate the class which inherits from `StatefulService`, such as `MyStatefulService`, and extend it to implement the `ICounter` interface.



### Use the ServiceProxy to interact with the service

Our stateful service is now ready to receive traffic from other services so all that remains is adding the code to communicate with it from the ASP.NET web service.

## What about actors?

This tutorial focused on adding a web front-end that communicated with a stateful service, but you can follow a very similar model to talk to actors. In fact, it is somewhat simpler.

When you create an actor project, Visual Studio automatically generates an interface project for you. You can use that interface to generate an actor proxy in the web project to communicate with the actor. The communication channel is provided automatically so you do not need to do anything equivalent to establishing a communication listener as you did for the stateful service in this tutorial.

## Next steps



<!-- Image References -->

[vs-add-new-service]: ./media/service-fabric-add-a-web-frontend/vs-add-new-service.png
[vs-new-service-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-service-dialog.png
[vs-new-aspnet-project-dialog]: ./media/service-fabric-add-a-web-frontend/vs-new-aspnet-project-dialog.png
[browser-aspnet-template-values]: ./media/service-fabric-add-a-web-frontend/browser-aspnet-template-values.png
[vs-add-class-library-project]: ./media/service-fabric-add-a-web-frontend/vs-add-class-library-project.png
[vs-add-class-library-reference]: ./media/service-fabric-add-a-web-frontend/vs-add-class-library-reference.png
[vs-services-nuget-package]: ./media/service-fabric-add-a-web-frontend/vs-services-nuget-package.png
