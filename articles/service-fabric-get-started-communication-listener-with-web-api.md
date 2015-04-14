<properties 
   pageTitle="commuication-listener-with-web-api"
   description="This tutorial goes into details on how to create a Microsoft Azure Service Fabric ICommunicationListener using Web API"
   services="service-fabric" 
   documentationCenter=".net" 
   authors="zbrad" 
   manager="mike.andrews" 
   editor="vturcek" />

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="multiple" 
   ms.date="04/13/15"
   ms.author="brad.merrill"/>

# Implement a Communication Listener using Web API

This tutorial walks you through the steps of creating an implementation of the ICommunicationListener interface using Web API for communication, enabling the creation of Web API Controllers with Service Fabric state information.
 
**Service Fabric** provides support for all communication protocols via the _ICommunicationListener_ interface. For this tutorial we are implementing the interface with self-hosted OWIN Web API web services.  

We are creating the listener expecting to create created with an interface named _IReliableObjectStateManager_.  This listener layer does not know the contents of this interface, but will pass the instance to any controllers defined that require it in their constructors.

The methods to be implemented for _ICommunicationListener_ are:
- **Initialize:** Called with initialization parameter data of the service
- **OpenAsync:** Called when the listener should start listening
- **CloseAsync: ** Called when the listener should stop listening
- **Abort:** Called when listener should abort all processing

1. Add a new public class named **WebApiListener** that implements _ICommunicationListener_
```c#
        public class WebApiListener : ICommunicationListener
```

1.  Replace the default namespaces with:
```c#
        using System;
        using System.Collections.Generic;
        using System.Fabric;
        using System.Fabric.Data;
        using System.Fabric.Description;
        using System.Fabric.Services;
        using System.Threading;
        using System.Threading.Tasks;
        using System.Web.Http;
        using System.Web.Http.Dependencies;
        using Microsoft.Owin.Hosting;
        using Owin;
```

1. Create some properties for later use:
```c#
        /// <summary>
        /// address provided to Service Fabric for endpoint resolution
        /// </summary>
        public string Address { get; private set; }

        /// <summary>
        /// prefix provided to Web Api listener for local endpoint
        /// </summary>
        public string Prefix { get; private set; }

		/// <summary>
		/// the <c>State</c> needed by Controllers
		/// </summary>
		public IReliableObjectStateManager StateManager { get; private set; }
```
1. Define a custom constructor that takes an **IReliableObjectStateManager** instance as parameter:
```c#
		public WebApiListener(IReliableObjectStateManager manager)
		{
			this.StateManager = manager;
		}
```
  Later on, our controllers can use this reference of StateManager to get access to reliable collections to save states.
1. Implement a couple of private helper methods:
```c#
        static EndpointResourceDescription GetInputEndpoint(ServiceInitializationParameters sip)
        {
            foreach (var erd in sip.CodePackageActivationContext.GetEndpoints())
            {
                if (erd.EndpointType == EndpointType.Input)
                    return erd;
            }
            ServiceEventSource.Current.Error("No input endpoint found");
            throw new ApplicationException("No input endpoint found");
        }
        static long GetId(ServiceInitializationParameters sip)
        {
            if (sip is StatefulServiceInitializationParameters)
                return ((StatefulServiceInitializationParameters)sip).ReplicaId;
            return ((StatelessServiceInitializationParameters)sip).InstanceId;
        }
```
1. Implement an initialization method:
```c#
        static readonly string LocalNode = FabricRuntime.GetNodeContext().IPAddressOrFQDN;
        public void Initialize(ServiceInitializationParameters sip)
        {
            var erd = GetInputEndpoint(sip);
            var id = GetId(sip);
            this.Address = erd.Protocol + "://" + LocalNode + ":" + erd.Port + "/"
                + id + "/" + sip.PartitionId + "/";
        }
```
What this method does is the following:
  1. Get the input endpoint (see _GetInputEndpoint_ helper) defined for the service.
  1. Get the id (see _GetId_ helper) of the service.
  1. Combine the two parts to create this service's endpoint address. This is the address that will be provided to clients when they resolve the service replicas.
1. Implement a private **Start** method:
```c#
        SemaphoreSlim webEvent = new SemaphoreSlim(1);
        bool webIsRunning = false;
        Task webTask = null;
        async Task Start()
        {
            Uri u = new Uri(this.Address);
            this.Prefix = u.Scheme + "://+:" + u.Port + u.LocalPath;
            await this.webEvent.WaitAsync();
        
            webTask = Task.Run(async () =>
            {
                using (WebApp.Start(this.Prefix, appBuilder => Configuration(appBuilder)))
                {
                    webIsRunning = true;
                    await webEvent.WaitAsync();
                }
        
                webIsRunning = false;
            });
        }
```
  We utilize the _Address_ created during initialize, to create a an Http _Prefix_ address.  We then start a new _webTask_ which starts our web app, and calls our local _Configuration_ method (see below).

1. Implement the **OpenAsync** method, which is called to start listening for requests:
```c#
        public async Task<string> OpenAsync(CancellationToken cancellationToken)
        {
            try
            {
                // start the web server and the web socket listener
                await Start();
                ServiceEventSource.Current.Info("Service is now listening on: " + this.Address);
                return this.Address;
            }
            catch (Exception ex)
            {
                ServiceEventSource.Current.Warn("Open failed: " + ex.StackTrace);
                Stop();
                return null;
            }
        }
```
  This calls a private _Start_ method to start our listener task.  After starting we return the address that was created during initialize as this services' endpoint.

1. The _webTask_ will block until the _webEvent_ is released (via _Stop_) as in _CloseAsync_ or _Abort_:
```c#
        public Task CloseAsync(CancellationToken cancellationToken)
        {
            Stop();
            return Task.FromResult<bool>(true);
        }
        public void Abort()
        {
            Stop();
        }
        void Stop()
        {
            if (webIsRunning)
                webEvent.Release();
        }
```
1. And finally we have our private _Configuration_ method for Web API:
```c#
        void Configuration(IAppBuilder appBuilder)
        {
            var config = new HttpConfiguration();
            config.DependencyResolver = new StateResolver(this.StateManager);

            config.MapHttpAttributeRoutes();
            appBuilder.UseWebApi(config);
        }
```
  Note that we are providing the _State_ to a new instance of _DependencyResolver_.  This resolver is what will create our Controllers passing in the instance of _IReliableObjectStateManager_.  For more background on how this works, see [Web API Dependency Resolver](http://www.asp.net/web-api/overview/advanced/dependency-injection).

1. create a private class named **StateResolver** that implements the _IDependencyResolver_ interface:
```c#
    class StateResolver : IDependencyResolver
    {
        // define empty list
        static readonly object[] EmptyList = new object[0];

        // create matching type signature
		Type[] istates = new Type[] { typeof(IReliableObjectStateManager) };
        
        // create argument container
        object[] args = new object[1];
        
		public StateResolver(IReliableObjectStateManager manager)
		{
			// store the instance for future controller creation
			this.args[0] = manager;
		}
        
        public object GetService(Type t)
        {
            if (t.IsSubclassOf(typeof(ApiController)))
            {
                var c = t.GetConstructor(istates);
                if (c != null)
                    return c.Invoke(args);
            }
            return null;
        }

        IDependencyScope IDependencyResolver.BeginScope() { return this; }

        IEnumerable<object> IDependencyScope.GetServices(Type serviceType) { return EmptyList; }

        void IDisposable.Dispose() { }
    }
```

  The basic idea here is that Web API will call our resolver, and we determine if the provided type in _GetService_ has a constructor that matches the type _IReliableObjectStateManager_. If so, we create a new instance of that type, passing in the specified depedency object (in our case this is the value of the _StateManager_ property from _WebApiListener_).
