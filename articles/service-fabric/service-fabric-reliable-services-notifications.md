---
title: Reliable Services notifications 
description: Conceptual documentation for Service Fabric Reliable Services notifications for Reliable State Manager and Reliable Dictionary
author: mcoskun

ms.topic: conceptual
ms.date: 6/29/2017
ms.author: mcoskun
---
# Reliable Services notifications
Notifications allow clients to track the changes that are being made to an object that they're interested in. 
Two types of objects support notifications: *Reliable State Manager* and *Reliable Dictionary*.

Common reasons for using notifications are:

* Building materialized views, such as secondary indexes or aggregated filtered views of the replica's state. An example is a sorted index of all keys in Reliable Dictionary.
* Sending monitoring data, such as the number of users added in the last hour.

Notifications are fired as part of applying operations. 
Because of that, notifications should be handled as fast as possible, and synchronous events shouldn't include any expensive operations.

## Reliable State Manager notifications
Reliable State Manager provides notifications for the following events:

* Transaction
  * Commit
* State manager
  * Rebuild
  * Addition of a reliable state
  * Removal of a reliable state

Reliable State Manager tracks the current inflight transactions. 
The only change in transaction state that causes a notification to be fired is a transaction being committed.

Reliable State Manager maintains a collection of reliable states like Reliable Dictionary and Reliable Queue. 
Reliable State Manager fires notifications when this collection changes: a reliable state is added or removed, or the entire collection is rebuilt.
The Reliable State Manager collection is rebuilt in three cases:

* Recovery: When a replica starts, it recovers its previous state from the disk. At the end of recovery, it uses **NotifyStateManagerChangedEventArgs** to fire an event that contains the set of recovered reliable states.
* Full copy: Before a replica can join the configuration set, it has to be built. Sometimes, this requires a full copy of Reliable State Manager's state from the primary replica to be applied to the idle secondary replica. Reliable State Manager on the secondary replica uses **NotifyStateManagerChangedEventArgs** to fire an event that contains the set of reliable states that it acquired from the primary replica.
* Restore: In disaster recovery scenarios, the replica's state can be restored from a backup via **RestoreAsync**. In such cases, Reliable State Manager on the primary replica uses **NotifyStateManagerChangedEventArgs** to fire an event that contains the set of reliable states that it restored from the backup.

To register for transaction notifications and/or state manager notifications, you need to register with the **TransactionChanged** or **StateManagerChanged** events on Reliable State Manager. 
A common place to register with these event handlers is the constructor of your stateful service. 
When you register on the constructor, you won't miss any notification that's caused by a change during the lifetime of **IReliableStateManager**.

```csharp
public MyService(StatefulServiceContext context)
    : base(MyService.EndpointName, context, CreateReliableStateManager(context))
{
    this.StateManager.TransactionChanged += this.OnTransactionChangedHandler;
    this.StateManager.StateManagerChanged += this.OnStateManagerChangedHandler;
}
```

The **TransactionChanged** event handler uses **NotifyTransactionChangedEventArgs** to provide details about the event. 
It contains the action property (for example, **NotifyTransactionChangedAction.Commit**) that specifies the type of change. 
It also contains the transaction property that provides a reference to the transaction that changed.

> [!NOTE]
> Today, **TransactionChanged** events are raised only if the transaction is committed. The action is then equal to **NotifyTransactionChangedAction.Commit**. But in the future, events might be raised for other types of transaction state changes. We recommend checking the action and processing the event only if it's one that you expect.
> 
> 

Following is an example **TransactionChanged** event handler.

```csharp
private void OnTransactionChangedHandler(object sender, NotifyTransactionChangedEventArgs e)
{
    if (e.Action == NotifyTransactionChangedAction.Commit)
    {
        this.lastCommitLsn = e.Transaction.CommitSequenceNumber;
        this.lastTransactionId = e.Transaction.TransactionId;

        this.lastCommittedTransactionList.Add(e.Transaction.TransactionId);
    }
}
```

The **StateManagerChanged** event handler uses **NotifyStateManagerChangedEventArgs** to provide details about the event.
**NotifyStateManagerChangedEventArgs** has two subclasses: **NotifyStateManagerRebuildEventArgs** and **NotifyStateManagerSingleEntityChangedEventArgs**.
You use the action property in **NotifyStateManagerChangedEventArgs** to cast **NotifyStateManagerChangedEventArgs** to the correct subclass:

* **NotifyStateManagerChangedAction.Rebuild**: **NotifyStateManagerRebuildEventArgs**
* **NotifyStateManagerChangedAction.Add** and **NotifyStateManagerChangedAction.Remove**: **NotifyStateManagerSingleEntityChangedEventArgs**

Following is an example **StateManagerChanged** notification handler.

```csharp
public void OnStateManagerChangedHandler(object sender, NotifyStateManagerChangedEventArgs e)
{
    if (e.Action == NotifyStateManagerChangedAction.Rebuild)
    {
        this.ProcessStateManagerRebuildNotification(e);

        return;
    }

    this.ProcessStateManagerSingleEntityNotification(e);
}
```

## Reliable Dictionary notifications
Reliable Dictionary provides notifications for the following events:

* Rebuild: Called when **ReliableDictionary** has recovered its state from a recovered or copied local state or backup.
* Clear: Called when the state of **ReliableDictionary** has been cleared through the **ClearAsync** method.
* Add: Called when an item has been added to **ReliableDictionary**.
* Update: Called when an item in **IReliableDictionary** has been updated.
* Remove: Called when an item in **IReliableDictionary** has been deleted.

To get Reliable Dictionary notifications, you need to register with the **DictionaryChanged** event handler on **IReliableDictionary**. 
A common place to register with these event handlers is in the **ReliableStateManager.StateManagerChanged** add notification.
Registering when **IReliableDictionary** is added to **IReliableStateManager** ensures that you won't miss any notifications.

```csharp
private void ProcessStateManagerSingleEntityNotification(NotifyStateManagerChangedEventArgs e)
{
    var operation = e as NotifyStateManagerSingleEntityChangedEventArgs;

    if (operation.Action == NotifyStateManagerChangedAction.Add)
    {
        if (operation.ReliableState is IReliableDictionary<TKey, TValue>)
        {
            var dictionary = (IReliableDictionary<TKey, TValue>)operation.ReliableState;
            dictionary.RebuildNotificationAsyncCallback = this.OnDictionaryRebuildNotificationHandlerAsync;
            dictionary.DictionaryChanged += this.OnDictionaryChangedHandler;
        }
    }
}
```

> [!NOTE]
> **ProcessStateManagerSingleEntityNotification** is the sample method that the preceding **OnStateManagerChangedHandler** example calls.
> 
> 

The preceding code sets the **IReliableNotificationAsyncCallback** interface, along with **DictionaryChanged**. 
Because **NotifyDictionaryRebuildEventArgs** contains an **IAsyncEnumerable** interface--which needs to be enumerated asynchronously--rebuild notifications are fired through **RebuildNotificationAsyncCallback** instead of **OnDictionaryChangedHandler**.

```csharp
public async Task OnDictionaryRebuildNotificationHandlerAsync(
    IReliableDictionary<TKey, TValue> origin,
    NotifyDictionaryRebuildEventArgs<TKey, TValue> rebuildNotification)
{
    this.secondaryIndex.Clear();

    var enumerator = e.State.GetAsyncEnumerator();
    while (await enumerator.MoveNextAsync(CancellationToken.None))
    {
        this.secondaryIndex.Add(enumerator.Current.Key, enumerator.Current.Value);
    }
}
```

> [!NOTE]
> In the preceding code, as part of processing the rebuild notification, first the maintained aggregated state is cleared. Because the reliable collection is being rebuilt with a new state, all previous notifications are irrelevant.
> 
> 

The **DictionaryChanged** event handler uses **NotifyDictionaryChangedEventArgs** to provide details about the event.
**NotifyDictionaryChangedEventArgs** has five subclasses. 
Use the action property in **NotifyDictionaryChangedEventArgs** to cast **NotifyDictionaryChangedEventArgs** to the correct subclass:

* **NotifyDictionaryChangedAction.Rebuild**: **NotifyDictionaryRebuildEventArgs**
* **NotifyDictionaryChangedAction.Clear**: **NotifyDictionaryClearEventArgs**
* **NotifyDictionaryChangedAction.Add**: **NotifyDictionaryItemAddedEventArgs**
* **NotifyDictionaryChangedAction.Update**: **NotifyDictionaryItemUpdatedEventArgs**
* **NotifyDictionaryChangedAction.Remove**: **NotifyDictionaryItemRemovedEventArgs**

```csharp
public void OnDictionaryChangedHandler(object sender, NotifyDictionaryChangedEventArgs<TKey, TValue> e)
{
    switch (e.Action)
    {
        case NotifyDictionaryChangedAction.Clear:
            var clearEvent = e as NotifyDictionaryClearEventArgs<TKey, TValue>;
            this.ProcessClearNotification(clearEvent);
            return;

        case NotifyDictionaryChangedAction.Add:
            var addEvent = e as NotifyDictionaryItemAddedEventArgs<TKey, TValue>;
            this.ProcessAddNotification(addEvent);
            return;

        case NotifyDictionaryChangedAction.Update:
            var updateEvent = e as NotifyDictionaryItemUpdatedEventArgs<TKey, TValue>;
            this.ProcessUpdateNotification(updateEvent);
            return;

        case NotifyDictionaryChangedAction.Remove:
            var deleteEvent = e as NotifyDictionaryItemRemovedEventArgs<TKey, TValue>;
            this.ProcessRemoveNotification(deleteEvent);
            return;

        default:
            break;
    }
}
```

## Recommendations
* *Do* complete notification events as fast as possible.
* *Do not* execute any expensive operations (for example, I/O operations) as part of synchronous events.
* *Do* check the action type before you process the event. New action types might be added in the future.

Here are some things to keep in mind:

* Notifications are fired as part of the execution of an operation. For example, a restore notification is fired as the last step of a restore operation. A restore will not finish until the notification event is processed.
* Because notifications are fired as part of the applying operations, clients see only notifications for locally committed operations. And because operations are guaranteed only to be locally committed (in other words, logged), they might or might not be undone in the future.
* On the redo path, a single notification is fired for each applied operation. This means that if transaction T1 includes Create(X), Delete(X), and Create(X), you'll get one notification for the creation of X, one for the deletion, and one for the creation again, in that order.
* For transactions that contain multiple operations, operations are applied in the order in which they were received on the primary replica from the user.
* As part of processing false progress, some operations might be undone. Notifications are raised for such undo operations, rolling the state of the replica back to a stable point. One important difference of undo notifications is that events that have duplicate keys are aggregated. For example, if transaction T1 is being undone, you'll see a single notification to Delete(X).

## Next steps
* [Reliable Collections](service-fabric-work-with-reliable-collections.md)
* [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
* [Reliable Services backup and restore (disaster recovery)](service-fabric-reliable-services-backup-restore.md)
* [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)

