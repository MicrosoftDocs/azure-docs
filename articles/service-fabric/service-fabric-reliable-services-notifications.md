<properties
   pageTitle="Reliable Service Notifications | Microsoft Azure"
   description="Conceptual documentation for Service Fabric Reliable Service Notifications"
   services="service-fabric"
   documentationCenter=".net"
   authors="mcoskun"
   manager="timlt"
   editor="masnider,vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/24/2016"
   ms.author="mcoskun"/>

# Reliable Service Notifications

Notifications allow clients to track the changes that are being made in to the object they are interested in.
There are two type of object that support notification: **Reliable State Manager** and **Reliable Dictionary**.

Common reasons for using Notifications are

- Building materialized views such as secondary indices or aggregated filtered views of the replica's state. For example a sorted index of all keys in a Reliable Dictionary.
- Sending monitoring data such as number of users added in the last hour.

Notifications are fired as part of applying operations.
Since they are part of the apply of the operation, it is important to note handling of notifications should complete as fast as possible and no expensive operation should be done in synchronous events.

## Reliable State Manager Notifications

Reliable State Manager provides notifications for the following events

- Transaction
    - Commit
- State Manager
    - Rebuild
    - Addition of a Reliable State
    - Removal of a Reliable State

Reliable State Manager tracks the current inflight transactions.
The only transaction state change that will cause a notification to be fired is a transaction being committed.

Reliable State Manager maintains a collection of Reliable State's like Reliable Dictionary and Reliable Queue.
Reliable State Manager fires notifications when this collection changes: a Reliable State is added, removed or the entire collection has been rebuilt.
Reliable State Manager's collection gets rebuilt in three cases

- Recovery: When a replica starts up, it will recover its previous state from the disk. At the end of recovery, it fire an event with **NotifyStateManagerChangedEventArgs** that contains the set of recovered **IReliableState**.
- Full Copy: Before a replica can join the configuration set, it first has to be built. Sometimes, this might require a full copy of Reliable State Manager's state from the Primary replica to be applied to the idle secondary replica. Reliable State Manager on the secondary will fire an event with **NotifyStateManagerChangedEventArgs** that contains the set of **IReliableState** it acquired from the Primary.
- Restore: In disaster recovery scenarios, replica's state can be restored from a backup using **RestoreAsync**. In such cases, Reliable State Manager on the primary will fire an event with **NotifyStateManagerChangedEventArgs** that contains the set of **IReliableState** it restored from the backup.

### How to use Reliable State Manager Notifications
To register for transaction notifications and/or state manager notifications, user needs to register with the **TransactionChanged** or **StateManagerChanged** events on the Reliable State Manager respectively.
Common place to register with these event handlers is the constructor of your StatefulService.
This because by registering on the constructor, client ensures that it will not miss any notification that is caused by a changed during the life time of the **IReliableStateManager**.

```C#
public MyService(StatefulServiceContext context)
    : base(MyService.EndpointName, context, CreateReliableStateManager(context))
{
    this.StateManager.TransactionChanged += this.OnTransactionChangedHandler;
    this.StateManager.StateManagerChanged += this.OnStateManagerChangedHandler;
}
```

**TransactionChanged** EventHandler uses **NotifyTransactionChangedEventArgs** to provide details about the event.
It contains the Action property (e.g. **NotifyTransactionChangedAction.Commit**) that specifies the type of change and Transaction property that provides a reference to the Transaction that changed.

>[AZURE.NOTE] Today TransactionChanged events are only raised if the Transaction is committed hence Action will be equal to NotifyTransactionChangedAction.Commit.
However, more Actions may be added in future updates. Hence, we recommend checking the Action and only processing the event if it is one that you expect.

Following is an example **TransactionChanged** event handler

```C#
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

**StateManagerChanged** EventHandler uses **NotifyStateManagerChangedEventArgs** to provide details about the event.
**NotifyStateManagerChangedEventArgs** has two subclasses: NotifyStateManagerRebuildEventArgs and NotifyStateManagerSingleEntityChangedEventArgs.
Action property in **NotifyStateManagerChangedEventArgs** should be used to cast the **NotifyStateManagerChangedEventArgs** to the correct subclass

- NotifyStateManagerChangedAction.Rebuild: NotifyStateManagerRebuildEventArgs
- NotifyStateManagerChangedAction.Add and Remove: NotifyStateManagerSingleEntityChangedEventArgs

Following is an example **StateManagerChanged** notification handler

```C#
public void OnStateManagerChangedHandler(object sender, NotifyStateManagerChangedEventArgs e)
{
    if (e.Action == NotifyStateManagerChangedAction.Rebuild)
    {
        this.ProcessStataManagerRebuildNotification(e);

        return;
    }

    this.ProcessStateManagerSingleEntityNotification(e);
}
```

## Reliable Dictionary Notifications

Reliable Dictionary provides notification for the following events

- Rebuild: Called when the **ReliableDictionary** has recovered its state from local disk, copy from Primary or backup.
- Clear: Called when the **ReliableDictionary**'s state has been cleared using **ClearAsync** method.
- Add: Called when an item has been added to **ReliableDictionary**.
- Update: Called when an item in **IReliableDictionary** has been updated.
- Remove: Called when an item in **IReliableDictionary** has been deleted.

### How to use Reliable Dictionary Notifications
To register for Reliable Dictionary notifications, user needs to register with the **DictionaryChanaged** event handler on the **IReliableDictionary**.
Common place to register with these event handlers is in the **ReliableStateManager.StateManagerChanged** add notification.
This is because, registering at the time of addition of **IReliableDictionary** to the **IReliableStateManager**, ensures that you will not miss any notifications.

```C#
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
}
```

>[AZURE.NOTE] ProcessStateManagerSingleEntityNotification is the sample method called by OnStateManagerChangedHandler example above.

Note that above code sets the IReliableNotificationAsyncCallback as well as the **DictionaryChanged**.
Since **NotifyDictionaryRebuildEventArgs** contains an **IAsyncEnumerable** which needs to be enumerated asynchronously, rebuild notifications are fired through **RebuildNotificationAsyncCallback** instead of **OnDictionaryChangedHandler**.

```C#
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

>[AZURE.NOTE] In the above code, as part of processing the rebuild notification, first the aggregated state maintained is cleared. This is because, since the Reliable Collection is being rebuild with new state, all previous notifications are irrelevant.

**DictionaryChanged** EventHandler uses **NotifyDictionaryChangedEventArgs** to provide details about the event.
**NotifyDictionaryChangedEventArgs** has five subclasses.
Action property in **NotifyDictionaryChangedEventArgs** should be used to cast the **NotifyDictionaryChangedEventArgs** to the correct subclass

- NotifyDictionaryChangedAction.Rebuild: NotifyDictionaryRebuildEventArgs
- NotifyDictionaryChangedAction.Clear: NotifyDictionaryClearEventArgs
- NotifyDictionaryChangedAction.Add and Remove: NotifyDictionaryItemAddedEventArgs
- NotifyDictionaryChangedAction.Update: NotifyDictionaryItemUpdatedEventArgs
- NotifyDictionaryChangedAction.Remove: NotifyDictionaryItemRemovedEventArgs

```C#
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

- DO complete notifications events as fast as possible.
- DO NOT execute any expensive operations (e.g IO operations) as part of synchronous events.
- DO check the Action type before processing the event. New Action types can be added in future.

Here are some things to keep in mind:
- Notifications are fired as part of the execution of an operation. For example, a restore notification, will be fired as the last step of restore and restore will not complete until the notification event is processed.
- Since notifications are fired as part of the applying operations, clients will only see notifications for locally committed operations. Note that since operations are guaranteed only to be locally committed (in other words logged), they may or may not be undone in the future.
- On the redo path, a single notification will be fired for each applied operation. This means, if a transaction T1 includes Create(X), Delete(X), Create(X), you will get one notification for creation of X, one for delete and one for create again in that order.
- For transactions that contain multiple operations, operations will be applied in order they were received on the Primary from user.
- As part of processing false progress, some operations might be undone. Notifications will be raised for such undo operations rolling the state of the replica back to stable point. One important difference of undo notifications, is that events of with duplicate keys will be aggregated. For example, if the above T1 is being undone, user will see a single notification to Delete(X).

## Next steps

- [Reliable Services quick start](service-fabric-reliable-services-quick-start.md)
- [Reliable Services backup and restore (disaster recovery)](service-fabric-reliable-services-backup-restore.md)
- [Developer reference for Reliable Collections](https://msdn.microsoft.com/library/azure/microsoft.servicefabric.data.collections.aspx)
