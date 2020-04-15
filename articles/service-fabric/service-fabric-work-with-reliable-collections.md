---
title: Working with Reliable Collections 
description: Learn the best practices for working with Reliable Collections within an Azure Service Fabric application.

ms.topic: conceptual
ms.date: 03/10/2020
---

# Working with Reliable Collections
Service Fabric offers a stateful programming model available to .NET developers via Reliable Collections. Specifically, Service Fabric provides reliable dictionary and reliable queue classes. When you use these classes, your state is partitioned (for scalability), replicated (for availability), and transacted within a partition (for ACID semantics). Let's look at a typical usage of a reliable dictionary object and see what it's actually doing.

```csharp
try
{
   // Create a new Transaction object for this partition
   using (ITransaction tx = base.StateManager.CreateTransaction())
   {
      // AddAsync takes key's write lock; if >4 secs, TimeoutException
      // Key & value put in temp dictionary (read your own writes),
      // serialized, redo/undo record is logged & sent to secondary replicas
      await m_dic.AddAsync(tx, key, value, cancellationToken);

      // CommitAsync sends Commit record to log & secondary replicas
      // After quorum responds, all locks released
      await tx.CommitAsync();
   }
   // If CommitAsync isn't called, Dispose sends Abort
   // record to log & all locks released
}
catch (TimeoutException)
{
   // choose how to handle the situation where you couldn't get a lock on the file because it was 
   // already in use. You might delay and retry the operation
}
```

All operations on reliable dictionary objects (except for ClearAsync, which is not undoable), require an ITransaction object. This object has associated with it any and all changes you're attempting to make to any reliable dictionary and/or reliable queue objects within a single partition. You acquire an ITransaction object by calling the partition's StateManager's CreateTransaction method.

In the code above, the ITransaction object is passed to a reliable dictionary's AddAsync method. Internally, dictionary methods that accept a key take a reader/writer lock associated with the key. If the method modifies the key's value, the method takes a write lock on the key and if the method only reads from the key's value, then a read lock is taken on the key. Since AddAsync modifies the key's value to the new, passed-in value, the key's write lock is taken. So, if 2 (or more) threads attempt to add values with the same key at the same time, one thread will acquire the write lock, and the other threads will block. By default, methods block for up to 4 seconds to acquire the lock; after 4 seconds, the methods throw a TimeoutException. Method overloads exist allowing you to pass an explicit timeout value if you'd prefer.

Usually, you write your code to react to a TimeoutException by catching it and retrying the entire operation (as shown in the code above). In my simple code, I'm just calling Task.Delay passing 100 milliseconds each time. But, in reality, you might be better off using some kind of exponential back-off delay instead.

Once the lock is acquired, AddAsync adds the key and value object references to an internal temporary dictionary associated with the ITransaction object. This is done to provide you with read-your-own-writes semantics. That is, after you call AddAsync, a later call to TryGetValueAsync (using the same ITransaction object) will return the value even if you have not yet committed the transaction. Next, AddAsync serializes your key and value objects to byte arrays and appends these byte arrays to a log file on the local node. Finally, AddAsync sends the byte arrays to all the secondary replicas so they have the same key/value information. Even though the key/value information has been written to a log file, the information is not considered part of the dictionary until the transaction that they are associated with has been committed.

In the code above, the call to CommitAsync commits all of the transaction's operations. Specifically, it appends commit information to the log file on the local node and also sends the commit record to all the secondary replicas. Once a quorum (majority) of the replicas has replied, all data changes are considered permanent and any locks associated with keys that were manipulated via the ITransaction object are released so other threads/transactions can manipulate the same keys and their values.

If CommitAsync is not called (usually due to an exception being thrown), then the ITransaction object gets disposed. When disposing an uncommitted ITransaction object, Service Fabric appends abort information to the local node's log file and nothing needs to be sent to any of the secondary replicas. And then, any locks associated with keys that were manipulated via the transaction are released.

## Volatile Reliable Collections 
In some workloads, like a replicated cache for example, occasional data loss can be tolerated. Avoiding persistence of the data to disk can allow for better latencies and throughputs when writing to Reliable Dictionaries. The tradeoff for a lack of persistence is that if quorum loss occurs, full data loss will occur. Since quorum loss is a rare occurrence, the increased performance may be worth the rare possibility of data loss for those workloads.

Currently, volatile support is only available for Reliable Dictionaries and Reliable Queues, and not ReliableConcurrentQueues. Please see the list of [Caveats](service-fabric-reliable-services-reliable-collections-guidelines.md#volatile-reliable-collections) to inform your decision on whether to use volatile collections.

To enable volatile support in your service, set the ```HasPersistedState``` flag in service type declaration to ```false```, like so:
```xml
<StatefulServiceType ServiceTypeName="MyServiceType" HasPersistedState="false" />
```

>[!NOTE]
>Existing persisted services cannot be made volatile, and vice versa. If you wish to do so, you will need to delete the existing service and then deploy the service with the updated flag. This means that you must be willing to incur full data loss if you wish to change the ```HasPersistedState``` flag. 

## Common pitfalls and how to avoid them
Now that you understand how the reliable collections work internally, let's take a look at some common misuses of them. See the code below:

```csharp
using (ITransaction tx = StateManager.CreateTransaction())
{
   // AddAsync serializes the name/user, logs the bytes,
   // & sends the bytes to the secondary replicas.
   await m_dic.AddAsync(tx, name, user);

   // The line below updates the property's value in memory only; the
   // new value is NOT serialized, logged, & sent to secondary replicas.
   user.LastLogin = DateTime.UtcNow;  // Corruption!

   await tx.CommitAsync();
}
```

When working with a regular .NET dictionary, you can add a key/value to the dictionary and then change the value of a property (such as LastLogin). However, this code will not work correctly with a reliable dictionary. Remember from the earlier discussion, the call to AddAsync serializes the key/value objects to byte arrays and then saves the arrays to a local file and also sends them to the secondary replicas. If you later change a property, this changes the property's value in memory only; it does not impact the local file or the data sent to the replicas. If the process crashes, what's in memory is thrown away. When a new process starts or if another replica becomes primary, then the old property value is what is available.

I cannot stress enough how easy it is to make the kind of mistake shown above. And, you will only learn about the mistake if/when the process goes down. The correct way to write the code is simply to reverse the two lines:


```csharp
using (ITransaction tx = StateManager.CreateTransaction())
{
   user.LastLogin = DateTime.UtcNow;  // Do this BEFORE calling AddAsync
   await m_dic.AddAsync(tx, name, user);
   await tx.CommitAsync();
}
```

Here is another example showing a common mistake:

```csharp
using (ITransaction tx = StateManager.CreateTransaction())
{
   // Use the user's name to look up their data
   ConditionalValue<User> user = await m_dic.TryGetValueAsync(tx, name);

   // The user exists in the dictionary, update one of their properties.
   if (user.HasValue)
   {
      // The line below updates the property's value in memory only; the
      // new value is NOT serialized, logged, & sent to secondary replicas.
      user.Value.LastLogin = DateTime.UtcNow; // Corruption!
      await tx.CommitAsync();
   }
}
```

Again, with regular .NET dictionaries, the code above works fine and is a common pattern: the developer uses a key to look up a value. If the value exists, the developer changes a property's value. However, with reliable collections, this code exhibits the same problem as already discussed: **you MUST not modify an object once you have given it to a reliable collection.**

The correct way to update a value in a reliable collection, is to get a reference to the existing value and consider the object referred to by this reference immutable. Then, create a new object that is an exact copy of the original object. Now, you can modify the state of this new object and write the new object into the collection so that it gets serialized to byte arrays, appended to the local file and sent to the replicas. After committing the change(s), the in-memory objects, the local file, and all the replicas have the same exact state. All is good!

The code below shows the correct way to update a value in a reliable collection:

```csharp
using (ITransaction tx = StateManager.CreateTransaction())
{
   // Use the user's name to look up their data
   ConditionalValue<User> currentUser = await m_dic.TryGetValueAsync(tx, name);

   // The user exists in the dictionary, update one of their properties.
   if (currentUser.HasValue)
   {
      // Create new user object with the same state as the current user object.
      // NOTE: This must be a deep copy; not a shallow copy. Specifically, only
      // immutable state can be shared by currentUser & updatedUser object graphs.
      User updatedUser = new User(currentUser);

      // In the new object, modify any properties you desire
      updatedUser.LastLogin = DateTime.UtcNow;

      // Update the key's value to the updateUser info
      await m_dic.SetValue(tx, name, updatedUser);
      await tx.CommitAsync();
   }
}
```

## Define immutable data types to prevent programmer error
Ideally, we'd like the compiler to report errors when you accidentally produce code that mutates state of an object that you're supposed to consider immutable. But, the C# compiler does not have the ability to do this. So, to avoid potential programmer bugs, we highly recommend that you define the types you use with reliable collections to be immutable types. Specifically, this means that you stick to core value types (such as numbers [Int32, UInt64, etc.], DateTime, Guid, TimeSpan, and the like). You can also use String. It is best to avoid collection properties as serializing and deserializing them can frequently hurt performance. However, if you want to use collection properties, we highly recommend the use of .NET's immutable collections library ([System.Collections.Immutable](https://www.nuget.org/packages/System.Collections.Immutable/)). This library is available for download from https://nuget.org. We also recommend sealing your classes and making fields read-only whenever possible.

The UserInfo type below demonstrates how to define an immutable type taking advantage of aforementioned recommendations.

```csharp
[DataContract]
// If you don't seal, you must ensure that any derived classes are also immutable
public sealed class UserInfo
{
   private static readonly IEnumerable<ItemId> NoBids = ImmutableList<ItemId>.Empty;

   public UserInfo(String email, IEnumerable<ItemId> itemsBidding = null) 
   {
      Email = email;
      ItemsBidding = (itemsBidding == null) ? NoBids : itemsBidding.ToImmutableList();
   }

   [OnDeserialized]
   private void OnDeserialized(StreamingContext context)
   {
      // Convert the deserialized collection to an immutable collection
      ItemsBidding = ItemsBidding.ToImmutableList();
   }

   [DataMember]
   public readonly String Email;

   // Ideally, this would be a readonly field but it can't be because OnDeserialized
   // has to set it. So instead, the getter is public and the setter is private.
   [DataMember]
   public IEnumerable<ItemId> ItemsBidding { get; private set; }

   // Since each UserInfo object is immutable, we add a new ItemId to the ItemsBidding
   // collection by creating a new immutable UserInfo object with the added ItemId.
   public UserInfo AddItemBidding(ItemId itemId)
   {
      return new UserInfo(Email, ((ImmutableList<ItemId>)ItemsBidding).Add(itemId));
   }
}
```

The ItemId type is also an immutable type as shown here:

```csharp
[DataContract]
public struct ItemId
{
   [DataMember] public readonly String Seller;
   [DataMember] public readonly String ItemName;
   public ItemId(String seller, String itemName)
   {
      Seller = seller;
      ItemName = itemName;
   }
}
```

## Schema versioning (upgrades)
Internally, Reliable Collections serialize your objects using .NET's DataContractSerializer. The serialized objects are persisted to the primary replica's local disk and are also transmitted to the secondary replicas. As your service matures, it's likely you'll want to change the kind of data (schema) your service requires. Approach versioning of your data with great care. First and foremost, you must always be able to deserialize old data. Specifically, this means your deserialization code must be infinitely backward compatible: Version 333 of your service code must be able to operate on data placed in a reliable collection by version 1 of your service code 5 years ago.

Furthermore, service code is upgraded one upgrade domain at a time. So, during an upgrade, you have two different versions of your service code running simultaneously. You must avoid having the new version of your service code use the new schema as old versions of your service code might not be able to handle the new schema. When possible, you should design each version of your service to be forward compatible by one version. Specifically, this means that V1 of your service code should be able to ignore any schema elements it does not explicitly handle. However, it must be able to save any data it doesn't explicitly know about and write it back out when updating a dictionary key or value.

> [!WARNING]
> While you can modify the schema of a key, you must ensure that your key's hash code and equals algorithms are stable. If you change how either of these algorithms operate, you will not be able to look up the key within the reliable dictionary ever again.
> .NET Strings can be used as a key but use the string itself as the key--do not use the result of String.GetHashCode as the key.

Alternatively, you can perform what is typically referred to as a two upgrade. With a two-phase upgrade, you upgrade your service from V1 to V2: V2 contains the code that knows how to deal with the new schema change but this code doesn't execute. When the V2 code reads V1 data, it operates on it and writes V1 data. Then, after the upgrade is complete across all upgrade domains, you can somehow signal to the running V2 instances that the upgrade is complete. (One way to signal this is to roll out a configuration upgrade; this is what makes this a two-phase upgrade.) Now, the V2 instances can read V1 data, convert it to V2 data, operate on it, and write it out as V2 data. When other instances read V2 data, they do not need to convert it, they just operate on it, and write out V2 data.

## Next steps
To learn about creating forward compatible data contracts, see [Forward-Compatible Data Contracts](https://msdn.microsoft.com/library/ms731083.aspx)

To learn best practices on versioning data contracts, see [Data Contract Versioning](https://msdn.microsoft.com/library/ms731138.aspx)

To learn how to implement version tolerant data contracts, see [Version-Tolerant Serialization Callbacks](https://msdn.microsoft.com/library/ms733734.aspx)

To learn how to provide a data structure that can interoperate across multiple versions, see [IExtensibleDataObject](https://msdn.microsoft.com/library/system.runtime.serialization.iextensibledataobject.aspx)
