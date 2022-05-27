---
title: Enabling Data Contract serialization for Remoting exceptions in Service Fabric
description: Enabling Data Contract serialization for Remoting exceptions in Service Fabric
ms.topic: conceptual
ms.date: 03/30/2022
ms.custom: devx-track-csharp
---
# Remoting Exception Serialization Overview
BinaryFormatter based serialization is not secure and Microsoft strongly recommends not to use BinaryFormatter for data processing. More details on the security implications can be found [here](/dotnet/standard/serialization/binaryformatter-security-guide).
Service Fabric had been using BinaryFormatter for serializing Exceptions. Starting ServiceFabric v9.0, [Data Contract based serialization](/dotnet/api/system.runtime.serialization.datacontractserializer?view=net-6.0) for remoting exceptions is made available as an opt-in feature. It is strongly recommended to opt for DataContract remoting exception serialization by following the below mentioned steps.

Support for BinaryFormatter based remoting exception serialization will be deprecated in the future.

## Steps to enable Data Contract Serialization for Remoting Exceptions

>[!NOTE]
>Data Contract Serialization for Remoting Exceptions is only available for Remoting V2/V2_1 services.

You can enable Data Contract Serialization for Remoting Exceptions using the below steps

1. Enable DataContract remoting exception serialization on the **Service** side by using `FabricTransportRemotingListenerSettings.ExceptionSerializationTechnique` while creating the remoting listener.

  - StatelessService
```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new[]
    {
        new ServiceInstanceListener(serviceContext =>
            new FabricTransportServiceRemotingListener(
                serviceContext,
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                }),
             "ServiceEndpointV2")
    };
}
```
  - StatefulService
```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new[]
    {
        new ServiceReplicaListener(serviceContext =>
            new FabricTransportServiceRemotingListener(
                serviceContext,
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                }),
            "ServiceEndpointV2")
    };
}
```

  - ActorService  
To enable DataContract remoting exception serialization on the ActorService, override `CreateServiceReplicaListeners()` by extending `ActorService`
```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new List<ServiceReplicaListener>
    {
        new ServiceReplicaListener(_ =>
        {
            return new FabricTransportActorServiceRemotingListener(
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                });
        },
        "MyActorServiceEndpointV2")
    };
}
```

If the original exception has multiple levels of inner exceptions, then you can control the number of levels of inner exceptions to be serialized by setting `FabricTransportRemotingListenerSettings.RemotingExceptionDepth`.

2. Enable DataContract remoting exception serialization on the **Client** by using `FabricTransportRemotingSettings.ExceptionDeserializationTechnique` while creating the Client Factory
  - ServiceProxyFactory creation
```csharp
var serviceProxyFactory = new ServiceProxyFactory(
(callbackClient) =>
{
    return new FabricTransportServiceRemotingClientFactory(
        new FabricTransportRemotingSettings
        {
            ExceptionDeserializationTechnique = FabricTransportRemotingSettings.ExceptionDeserialization.Default,
        },
        callbackClient);
});
```
  - ActorProxyFactory
```csharp
var actorProxyFactory = new ActorProxyFactory(
(callbackClient) =>
{
    return new FabricTransportActorRemotingClientFactory(
        new FabricTransportRemotingSettings
        {
            ExceptionDeserializationTechnique = FabricTransportRemotingSettings.ExceptionDeserialization.Default,
        },
        callbackClient);
});
```

3. DataContract remoting exception serialization converts Exception to Data Transfer Object(DTO) on the service side and the DTO is converted back to Exception on the client side. Users need to register `ExceptionConvertor` for converting desired exceptions to DTO objects and vice versa.
Framework implements Convertors for the below list of the exceptions. If user service code depends on exceptions outside the below list for retry implementation, exception handling, etc., then user needs to implement and register convertors for such exceptions.

  * All service fabric exceptions(derived from `System.Fabric.FabricException`)
  * SystemExceptions(derived from `System.SystemException`)
    * System.AccessViolationException
    * System.AppDomainUnloadedException
    * System.ArgumentException
    * System.ArithmeticException
    * System.ArrayTypeMismatchException
    * System.BadImageFormatException
    * System.CannotUnloadAppDomainException
    * System.Collections.Generic.KeyNotFoundException
    * System.ContextMarshalException
    * System.DataMisalignedException
    * System.ExecutionEngineException
    * System.FormatException
    * System.IndexOutOfRangeException
    * System.InsufficientExecutionStackException
    * System.InvalidCastException
    * System.InvalidOperationException
    * System.InvalidProgramException
    * System.IO.InternalBufferOverflowException
    * System.IO.InvalidDataException
    * System.IO.IOException
    * System.MemberAccessException
    * System.MulticastNotSupportedException
    * System.NotImplementedException
    * System.NotSupportedException
    * System.NullReferenceException
    * System.OperationCanceledException
    * System.OutOfMemoryException
    * System.RankException
    * System.Reflection.AmbiguousMatchException
    * System.Reflection.ReflectionTypeLoadException
    * System.Resources.MissingManifestResourceException
    * System.Resources.MissingSatelliteAssemblyException
    * System.Runtime.InteropServices.ExternalException
    * System.Runtime.InteropServices.InvalidComObjectException
    * System.Runtime.InteropServices.InvalidOleVariantTypeException
    * System.Runtime.InteropServices.MarshalDirectiveException
    * System.Runtime.InteropServices.SafeArrayRankMismatchException
    * System.Runtime.InteropServices.SafeArrayTypeMismatchException
    * System.Runtime.Serialization.SerializationException
    * System.StackOverflowException
    * System.Threading.AbandonedMutexException
    * System.Threading.SemaphoreFullException
    * System.Threading.SynchronizationLockException
    * System.Threading.ThreadInterruptedException
    * System.Threading.ThreadStateException
    * System.TimeoutException
    * System.TypeInitializationException
    * System.TypeLoadException
    * System.TypeUnloadedException
    * System.UnauthorizedAccessException
    * System.ArgumentNullException
    * System.IO.FileNotFoundException
    * System.IO.DirectoryNotFoundException
    * System.ObjectDisposedException
    * System.AggregateException

## Sample implementation of service side convertor for a custom exception

Below is reference `IExceptionConvertor` implementation on the **Service** and **Client** side for a well known exception type `CustomException`.

- CustomException
```csharp
class CustomException : Exception
{
    public CustomException(string message, string field1, string field2)
        : base(message)
    {
        this.Field1 = field1;
        this.Field2 = field2;
    }

    public CustomException(string message, Exception innerEx, string field1, string field2)
        : base(message, innerEx)
    {
        this.Field1 = field1;
        this.Field2 = field2;
    }

    public string Field1 { get; set; }

    public string Field2 { get; set; }
}
```

- `IExceptionConvertor` implementation on **Service** side.
```csharp
class CustomConvertorService : Microsoft.ServiceFabric.Services.Remoting.V2.Runtime.IExceptionConvertor
{
    public Exception[] GetInnerExceptions(Exception originalException)
    {
        return originalException.InnerException == null ? null : new Exception[] { originalException.InnerException };
    }

    public bool TryConvertToServiceException(Exception originalException, out ServiceException serviceException)
    {
        serviceException = null;
        if (originalException is CustomException customEx)
        {
            serviceException = new ServiceException(customEx.GetType().FullName, customEx.Message);
            serviceException.ActualExceptionStackTrace = originalException.StackTrace;
            serviceException.ActualExceptionData = new Dictionary<string, string>()
                {
                    { "Field1", customEx.Field1 },
                    { "Field2", customEx.Field2 },
                };

            return true;
        }

        return false;
    }
}
```
Actual exception observed during the execution of the remoting call is passed as input to `TryConvertToServiceException`. If the type of the exception is a well known one, then `TryConvertToServiceException` should convert the original exception to `ServiceException`
 and return it as an out parameter. A true value should be returned if the original exception type is well known one and original exception is successfully converted to the `ServiceException`, false otherwise.

 A list of inner exceptions at the current level should be returned by `GetInnerExceptions()`.

- `IExceptionConvertor` implementation on **Client** side.
```csharp
class CustomConvertorClient : Microsoft.ServiceFabric.Services.Remoting.V2.Client.IExceptionConvertor
{
    public bool TryConvertFromServiceException(ServiceException serviceException, out Exception actualException)
    {
        return this.TryConvertFromServiceException(serviceException, (Exception)null, out actualException);
    }

    public bool TryConvertFromServiceException(ServiceException serviceException, Exception innerException, out Exception actualException)
    {
        actualException = null;
        if (serviceException.ActualExceptionType == typeof(CustomException).FullName)
        {
            actualException = new CustomException(
                serviceException.Message,
                innerException,
                serviceException.ActualExceptionData["Field1"],
                serviceException.ActualExceptionData["Field2"]);

            return true;
        }

        return false;
    }

    public bool TryConvertFromServiceException(ServiceException serviceException, Exception[] innerExceptions, out Exception actualException)
    {
        throw new NotImplementedException();
    }
}
```
`ServiceException` is passed as a parameter to `TryConvertFromServiceException` along with converted `innerException[s]`. If the actual exception type(`ServiceException.ActualExceptionType`) is a known one, then the convertor should create an actual exception object from the `ServiceException` and `innerException[s]`.

- `IExceptionConvertor` registration on the **Service** side.

 To register convertors, `CreateServiceInstanceListeners` has to be overridden and list of `IExceptionConvertor` has to be passed while creating RemotingListener instance.

  - *StatelessService*
```csharp
protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
{
    return new[]
    {
        new ServiceInstanceListener(serviceContext =>
            new FabricTransportServiceRemotingListener(
                serviceContext,
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                },
                exceptionConvertors: new[]
                {
                    new CustomConvertorService(),
                }),
             "ServiceEndpointV2")
    };
}
```

  - *StatefulService*
```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new[]
    {
        new ServiceReplicaListener(serviceContext =>
            new FabricTransportServiceRemotingListener(
                serviceContext,
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                },
                exceptionConvertors: new []
                {
                    new CustomConvertorService(),
                }),
            "ServiceEndpointV2")
    };
}
```

  - *ActorService*
```csharp
protected override IEnumerable<ServiceReplicaListener> CreateServiceReplicaListeners()
{
    return new List<ServiceReplicaListener>
    {
        new ServiceReplicaListener(_ =>
        {
            return new FabricTransportActorServiceRemotingListener(
                this,
                new FabricTransportRemotingListenerSettings
                {
                    ExceptionSerializationTechnique = FabricTransportRemotingListenerSettings.ExceptionSerialization.Default,
                },
                exceptionConvertors: new[]
                {
                    new CustomConvertorService(),
                });
        },
        "MyActorServiceEndpointV2")
    };
}
```
- `IExceptionConvertor` registration on the **Client** side.

 To register convertors, list of `IExceptionConvertor`s has to be passed while creating ClientFactory instance.

  - *ServiceProxyFactory creation*
```csharp
var serviceProxyFactory = new ServiceProxyFactory(
(callbackClient) =>
{
   return new FabricTransportServiceRemotingClientFactory(
       new FabricTransportRemotingSettings
       {
           ExceptionDeserializationTechnique = FabricTransportRemotingSettings.ExceptionDeserialization.Default,
       },
       callbackClient,
       exceptionConvertors: new[]
       {
           new CustomConvertorClient(),
       });
});
```

  - *ActorProxyFactory creation*
```csharp
var actorProxyFactory = new ActorProxyFactory(
(callbackClient) =>
{
    return new FabricTransportActorRemotingClientFactory(
        new FabricTransportRemotingSettings
        {
            ExceptionDeserializationTechnique = FabricTransportRemotingSettings.ExceptionDeserialization.Default,
        },
        callbackClient,
        exceptionConvertors: new[]
        {
            new CustomConvertorClient(),
        });
});
```
>[!NOTE]
>If the framework finds the convertor for the exception, then the converted(actual) exception is wrapped inside AggregateException and is thrown at the remoting API(proxy). If the framework fails to find the convertor, then ServiceException which contains all the details of the actual exception is wrapped inside AggregateException and is thrown.

### Step to upgrade an existing service to enable DataContract serialization for remoting exceptions
Existing services must follow the below order(*Service first*) to upgrade. Failure to follow the below order could result in misbehavior in retry logic, exception handling, etc.
1. Implement the **Service** side `ExceptionConvertor`s for the desired exceptions(if any). Update the remoting listener registration logic with `ExceptionSerializationTechnique` and list of `IExceptionConvertor`s. Upgrade the existing service to apply the exception serialization changes
2. Implement the **Client** side `ExceptionConvertor`s for the desired exceptions(if any). Update the ProxyFactory creation logic with `ExceptionSerializationTechnique` and list of `IExceptionConvertor`s. Upgrade the existing client to apply the exception serialization changes

## Next steps

* [Web API with OWIN in Reliable Services](./service-fabric-reliable-services-communication-aspnetcore.md)
* [Windows Communication Foundation communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)
* [Secure communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)