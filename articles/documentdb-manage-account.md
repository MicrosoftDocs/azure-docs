<properties pageTitle="Manage a DocumentDB account | Azure" description="Learn how to manage your DocumentDB account." services="documentdb" documentationCenter="" authors="docdbadmin" manager="jhubbard" editor="cgronlun"/>

<tags ms.service="documentdb" ms.workload="data-services" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/13/2015" ms.author="hawong"/>

#How to manage a DocumentDB account


Learn how to work with keys, consistency settings, and capacity settings, and learn how to delete an account.

In this article
-----------------

-   [How to: View, copy, and regenerate DocumentDB access keys](#keys)
-   [How to: Manage DocumentDB consistency settings](#consistency)
-   [How to: Manage DocumentDB capacity settings](#capacity)
-   [How to: Delete a DocumentDB account](#delete)
-   [Next steps](#next)

## <a id="keys"></a> How to: View, copy, and regenerate access keys
When you create a DocumentDB account, the service generates two master access keys that 
can be used for authentication when the DocumentDB
account is accessed. By providing two access keys, DocumentDB enables
you to regenerate the keys with no interruption to your DocumentDB
account.

In the [Azure management preview
portal](https://portal.azure.com/),
access the **Keys** part from your **DocumentDB Account** blade to view,
copy, and regenerate the access keys that are used to access your
DocumentDB account.

![](./media/documentdb-manage-account/image002.jpg)

### View and copy an access key

1.      In the [Azure Preview
portal](https://portal.azure.com/), access your DocumentDB account. 

2.      In the **Summary** lens, click **Keys**.

3.      On the **Keys** blade, click the **Copy** button to the right of the
key you wish to copy.

  ![](./media/documentdb-manage-account/image004.jpg)

### Regenerate access keys

You should change the access keys to your DocumentDB account
periodically to help keep your connections more secure. Two access keys
are assigned to enable you to maintain connections to the DocumentDB
account using one access key while you regenerate the other access key.

> [AZURE.WARNING] Regenerating your access keys affects any applications that are
dependent on the current key. All clients that use the access key to
access the DocumentDB account must be updated to use the new key.

If you have applications or cloud services using the DocumentDB account,
you will lose the connections if you regenerate keys, unless you roll
your keys. The following steps outline the process involved in rolling your keys.

1.      Update the access key in your application code to reference the
secondary access key of the DocumentDB account.

2.      Regenerate the primary access key for your DocumentDB account.
In the  [Azure management preview portal](https://portal.azure.com/),
access your DocumentDB account.

3.      In the Summary lens, click **Keys**.

4.      On the **Keys** blade, click the **Regenerate Primary** command, then
click **Ok** to confirm that you want to generate a new key.

5.      Once you have verified that the new key is available for use
(approximately 5 minutes after regeneration), update the access key in
your application code to reference the new primary access key.

6.      Regenerate the secondary access key.

*Note that it can take several minutes before a newly generated key can
be used to access your DocumentDB account.*

## <a id="consistency"></a> How to: Manage DocumentDB Consistency Settings
DocumentDB supports four well-defined user-configurable data consistency
levels to allow developers to make predictable
consistency-availability-latency trade-offs.

- **Strong** consistency guarantees that read operations always
return the value that was last written.

- **Bounded Staleness** consistency guarantees that reads are
not too out-of-date. It specifically guarantees that the reads are no
more than K versions older than the last written version. 

- **Session** consistency guarantees monotonic reads (you never
read old data, then new, then old again), monotonic writes (writes are
ordered), and that you read the most recent writes within any single
client’s viewpoint.

- **Eventual** consistency guarantees that read operations
always read a valid subset of writes and will eventually converge.

*Note that by default, DocumentDB accounts are provisioned with Session
level consistency.  For additional information on DocumentDB consistency
settings, see the [Consistency
Level](http://go.microsoft.com/fwlink/p/?LinkId=402365) section.*

### To specify the default consistency for a DocumentDB Account

1.      In the [Azure management preview
portal](https://portal.azure.com/), access your DocumentDB account. 

2.      In the **Configuration** lens, click **Default Consistency**.

3.      On the **Default Consistency** blade, select the default consistency
level you want for your DocumentDB account.

![](./media/documentdb-manage-account/image005.png)

![](./media/documentdb-manage-account/image006.png)

4.      Click **Save**.

5.      The progress of the operation may be monitored via the Azure
management preview portal Notifications hub.

*Note that it can take several minutes before a change to the default
consistency setting takes affect across your DocumentDB account.*

## <a id="capacity"></a> How to: Manage DocumentDB capacity settings
Microsoft Azure DocumentDB allows you to scale elastically as the
demands of your application change throughout its lifecycle. Scaling
DocumentDB is accomplished by increasing the capacity of your DocumentDB
database account through the Azure management preview portal.

When you create a database account, it is provisioned with database
storage and reserved throughput. At any time you can change the
provisioned database storage and throughput for your account by adding
or removing capacity units through the Azure management preview portal. 

### To add or remove capacity units

1.      In the [Azure management preview
portal](https://portal.azure.com/), access your DocumentDB account. 

2.      In the **Usage** lens, click **Scale**.

3.      On the **Scale** blade, specify the number of capacity units you
want for your DocumentDB account.


![](./media/documentdb-manage-account/image007.png)

4.      Click **Save** (note that it can take several minutes for the
scaling operation to complete, you can monitor the progress via the
Azure management preview portal Notifications hub).

 *Note that the DocumentDB Preview supports a maximum of 5 capacity
units per DocumentDB account.*
 

## <a id="delete"></a> How to: Delete a DocumentDB account
To remove a DocumentDB account that you are no longer using, use the
**Delete** command on the **DocumentDB Account** blade.

> [AZURE.WARNING] In the preview release, there is no way to restore the content from a
deleted DocumentDB account.  Deleting a DocumentDB account will delete
all of the account’s resources, including databases, collections,
documents and attachments.*

![](./media/documentdb-manage-account/image009.png)

1.      In the [Azure management preview
portal](https://portal.azure.com/), access the DocumentDB Account you
wish to delete. 

2.      On the **DocumentDB Account** blade, click the **Delete** command.

3.      On the resulting confirmation blade, type the DocumentDB Account
name to confirm that you want to delete the account.

4.      Click the **Delete** button on the confirmation blade.

## <a id="next"></a>Next steps

Learn how to [get started with your DocumentDB
    account](http://go.microsoft.com/fwlink/p/?LinkId=402364).

To learn more about DocumentDB, see the Azure DocumentDB
    documentation on
    [azure.com](http://go.microsoft.com/fwlink/?LinkID=402319&clcid=0x409).

 
