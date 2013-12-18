## <a name="what-is"> </a>What is Queue Storage?

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64 KB in size, and a queue can contain millions of messages, up to the
total capacity limit of a storage account. For storage accounts created after June 8th, 2012, total capacity is 200TB; for storage accounts created prior to that date, total capacity is 100TB. See [Windows Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx) for details about storage account capacity.

Common uses of Queue storage include:

-   <span>Creating a backlog of work to process asynchronously</span>
-   Passing messages from a Windows Azure Web role to a Windows Azure
    Worker role

## <a name="concepts"> </a>Concepts

The Queue service contains the following components:

![Queue1][]

-   **URL format:** Queues are addressable using the following URL
    format:   
    http://`<storage account>`.queue.core.windows.net/`<queue>` 
      
    The following URL addresses one of the queues in the diagram:  
    http://myaccount.queue.core.windows.net/imagesToDownload

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. See [Windows Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx) for details about storage account capacity.

-   **Queue:** A queue contains a set of messages. All messages must be
    in a queue.

-   **Message:** A message, in any format, of up to 64KB.

[Queue1]: ./media/howto-queue-storage/queue1.png
