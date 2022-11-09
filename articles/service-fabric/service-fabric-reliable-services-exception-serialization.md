---
title: Enable data contract serialization for remoting exceptions in Service Fabric
description: Enable data contract serialization for remoting exceptions in Azure Service Fabric.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Remoting exception serialization overview

BinaryFormatter-based serialization isn't secure, so don't use BinaryFormatter for data processing. For more information on the security implications, see [Deserialization risks in the use of BinaryFormatter and related types](/dotnet/standard/serialization/binaryformatter-security-guide).

Azure Service Fabric used BinaryFormatter for serializing exceptions. Starting with ServiceFabric v9.0, [data contract-based serialization](/dotnet/api/system.runtime.serialization.datacontractserializer) for remoting exceptions is available as an opt-in feature. We recommend that you opt for DataContract remoting exception serialization by following the steps in this article.

Support for BinaryFormatter-based remoting exception serialization will be deprecated in the future.

## Enable data contract serialization for remoting exceptions

>[!NOTE]
>Data contract serialization for remoting exceptions is only available for remoting V2/V2_1 services.

To enable data contract serialization for remoting exceptions:

1. Enable DataContract remoting exception serialization on the **Service** side by using `FabricTransportRemotingListenerSettings.ExceptionSerializationTechnique` while you create the remoting listener.

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
To enable DataContract remoting exception serialization on the actor service, override `CreateServiceReplicaListeners()` by extending `ActorService`.

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

   If the original exception has multiple levels of inner exceptions, you can control the number of levels of inner exceptions to be serialized by setting `FabricTransportRemotingListenerSettings.RemotingExceptionDepth`.

1. Enable DataContract remoting exception serialization on the **Client** by using `FabricTransportRemotingSettings.ExceptionDeserializationTechnique` while you create the client factory.

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

1. DataContract remoting exception serialization converts an exception to the data transfer object (DTO) on the service side. The DTO is converted back to an exception on the client side. Users need to register `ExceptionConvertor` to convert the desired exceptions to DTO objects and vice versa.

    The framework implements convertors for the following list of exceptions. If user service code depends on exceptions outside the following list for retry implementation and exception handling, users need to implement and register convertors for such exceptions.

   * All Service Fabric exceptions derived from `System.Fabric.FabricException`
   * SystemExceptions derived from `System.SystemException`
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

## Sample implementation of a service-side convertor for a custom exception

The following example is reference `IExceptionConvertor` implementation on the **Service** and **Client** side for a well-known exception type, `CustomException`.

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

- `IExceptionConvertor` implementation on the **Service** side:

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

The actual exception observed during the execution of the remoting call is passed as input to `TryConvertToServiceException`. If the type of the exception is a well-known one, `TryConvertToServiceException` should convert the original exception to `ServiceException`
 and return it as an out parameter. A true value should be returned if the original exception type is a well-known one and the original exception is successfully converted to `ServiceException`. Otherwise, the value is false.

 A list of inner exceptions at the current level should be returned by `GetInnerExceptions()`.

- `IExceptionConvertor` implementation on the **Client** side:

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

`ServiceException` is passed as a parameter to `TryConvertFromServiceException` along with converted `innerException[s]`. If the actual exception type, `ServiceException.ActualExceptionType`, is a known one, the convertor should create an actual exception object from `ServiceException` and `innerException[s]`.

- `IExceptionConvertor` registration on the **Service** side:

     To register convertors, `CreateServiceInstanceListeners` must be overridden and the list of `IExceptionConvertor` classes must be passed while you create the `RemotingListener` instance.

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

- `IExceptionConvertor` registration on the **Client** side:

  To register convertors, the list of `IExceptionConvertor` classes must be passed while you create the `ClientFactory` instance.

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
>If the framework finds the convertor for the exception, the converted (actual) exception is wrapped inside `AggregateException` and is thrown at the remoting API (proxy). If the framework fails to find the convertor, then `ServiceException`, which contains all the details of the actual exception, is wrapped inside `AggregateException` and is thrown.

### Upgrade an existing service to enable data contract serialization for remoting exceptions

Existing services must follow the following order (*Service first*) to upgrade. Failure to follow this order could result in misbehavior in retry logic and exception handling.

1. Implement the **Service** side `ExceptionConvertor` classes for the desired exceptions, if any. Update the remoting listener registration logic with `ExceptionSerializationTechnique` and the list of `IExceptionConvertor`classes. Upgrade the existing service to apply the exception serialization changes.

1. Implement the **Client** side `ExceptionConvertor` classes for the desired exceptions, if any. Update the ProxyFactory creation logic with `ExceptionSerializationTechnique` and the list of `IExceptionConvertor` classes. Upgrade the existing client to apply the exception serialization changes.

## Next steps

* [Web API with OWIN in Reliable Services](./service-fabric-reliable-services-communication-aspnetcore.md)
* [Windows Communication Foundation communication with Reliable Services](service-fabric-reliable-services-communication-wcf.md)
* [Secure communication for Reliable Services](service-fabric-reliable-services-secure-communication.md)