---
title: Reliable Collection object serialization
description: Learn about Azure Service Fabric Reliable Collections object serialization, including the default strategy and how to define custom serialization.'
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Reliable Collection object serialization in Azure Service Fabric
Reliable Collections' replicate and persist their items to make sure they are durable across machine failures and power outages.
Both to replicate and to persist items, Reliable Collections' need to serialize them.

Reliable Collections' get the appropriate serializer for a given type from Reliable State Manager.
Reliable State Manager contains built-in serializers and allows custom serializers to be registered for a given type.

## Built-in Serializers

Reliable State Manager includes built-in serializer for some common types, so that they can be serialized efficiently by default. 
For other types, Reliable State Manager falls back to use the [DataContractSerializer](/dotnet/api/system.runtime.serialization.datacontractserializer).
Built-in serializers are more efficient since they know their types cannot change and they do not need to include information about the type like its type name.

Reliable State Manager has built-in serializer for following types: 
- Guid
- bool
- byte
- sbyte
- byte[]
- char
- string
- decimal
- double
- float
- int
- uint
- long
- ulong
- short
- ushort

## Custom Serialization

Custom serializers are commonly used to increase performance or to encrypt the data over the wire and on disk. 
Among other reasons, custom serializers are commonly more efficient than generic serializer since they don't need to serialize information about the type. 

[IReliableStateManager.TryAddStateSerializer\<T>](/dotnet/api/microsoft.servicefabric.data.ireliablestatemanager.tryaddstateserializer) is used to register a custom serializer for the given type T.
This registration should happen in the construction of the StatefulServiceBase to ensure that before recovery starts, all Reliable Collections have access to the relevant serializer to read their persisted data.

```csharp
public StatefulBackendService(StatefulServiceContext context)
  : base(context)
  {
    if (!this.StateManager.TryAddStateSerializer(new OrderKeySerializer()))
    {
      throw new InvalidOperationException("Failed to set OrderKey custom serializer");
    }
  }
```

> [!NOTE]
> Custom serializers are given precedence over built-in serializers. 
> For example, when a custom serializer for int is registered, it is used to serialize integers instead of the built-in serializer for int.

### How to implement a custom serializer

A custom serializer needs to implement the [IStateSerializer\<T>](/dotnet/api/microsoft.servicefabric.data.istateserializer-1) interface.

> [!NOTE]
> IStateSerializer\<T> includes an overload for Write and Read that takes in an additional T called base value. 
> This API is for differential serialization. 
> Currently differential serialization feature is not exposed. 
> Hence, these two overloads are not called until differential serialization is exposed and enabled.

Following is an example custom type called OrderKey that contains four properties

```csharp
public class OrderKey : IComparable<OrderKey>, IEquatable<OrderKey>
{
    public byte Warehouse { get; set; }

    public short District { get; set; }

    public int Customer { get; set; }

    public long Order { get; set; }

    #region Object Overrides for GetHashCode, CompareTo and Equals
    #endregion
}
```

Following is an example implementation of IStateSerializer\<OrderKey>.
Note that Read and Write overloads that take in baseValue, call their respective overload for forwards compatibility.

```csharp
public class OrderKeySerializer : IStateSerializer<OrderKey>
{
  OrderKey IStateSerializer<OrderKey>.Read(BinaryReader reader)
  {
      var value = new OrderKey();
      value.Warehouse = reader.ReadByte();
      value.District = reader.ReadInt16();
      value.Customer = reader.ReadInt32();
      value.Order = reader.ReadInt64();

      return value;
  }

  void IStateSerializer<OrderKey>.Write(OrderKey value, BinaryWriter writer)
  {
      writer.Write(value.Warehouse);
      writer.Write(value.District);
      writer.Write(value.Customer);
      writer.Write(value.Order);
  }
  
  // Read overload for differential de-serialization
  OrderKey IStateSerializer<OrderKey>.Read(OrderKey baseValue, BinaryReader reader)
  {
      return ((IStateSerializer<OrderKey>)this).Read(reader);
  }

  // Write overload for differential serialization
  void IStateSerializer<OrderKey>.Write(OrderKey baseValue, OrderKey newValue, BinaryWriter writer)
  {
      ((IStateSerializer<OrderKey>)this).Write(newValue, writer);
  }
}
```

## Upgradability
In a [rolling application upgrade](service-fabric-application-upgrade.md), the upgrade is applied to a subset of nodes, one upgrade domain at a time. 
During this process, some upgrade domains will be on the newer version of your application, and some upgrade domains will be on the older version of your application. 
During the rollout, the new version of your application must be able to read the old version of your data, and the old version of your application must be able to read the new version of your data. 
If the data format is not forward and backward compatible, the upgrade may fail, or worse, data may be lost or corrupted.

If you are using  built-in serializer, you do not have to worry about compatibility.
However, if you are using a custom serializer or the DataContractSerializer, the data have to be infinitely backwards and forwards compatible.
In other words, each version of serializer needs to be able to serialize and de-serialize any version of the type.

Data Contract users should follow the well-defined versioning rules for adding, removing, and changing fields. 
Data Contract also has support for dealing with unknown fields, hooking into the serialization and deserialization process, and dealing with class inheritance. 
For more information, see [Using Data Contract](/dotnet/framework/wcf/feature-details/using-data-contracts).

Custom serializer users should adhere to the guidelines of the serializer they are using to make sure it is backwards and forwards compatible.
Common way of supporting all versions is adding size information at the beginning and only adding optional properties.
This way each version can read as much it can and jump over the remaining part of the stream.

## Next steps
  * [Serialization and upgrade](service-fabric-application-upgrade-data-serialization.md)
  * [Developer reference for Reliable Collections](/dotnet/api/microsoft.servicefabric.data.collections#microsoft_servicefabric_data_collections)
  * [Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.
  * [Upgrading your Application Using PowerShell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.
  * Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).
  * Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).
  * Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).
