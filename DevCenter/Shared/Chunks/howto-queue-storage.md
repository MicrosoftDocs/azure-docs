## <a name="what-is"> </a>What is Queue Storage

Windows Azure Queue storage is a service for storing large numbers of
messages that can be accessed from anywhere in the world via
authenticated calls using HTTP or HTTPS. A single queue message can be
up to 64KB in size, a queue can contain millions of messages, up to the
100TB total capacity limit of a storage account. Common uses of Queue
storage include:

-   <span>Creating a backlog of work to process asynchronously</span>
-   Passing messages from a Windows Azure Web role to a Windows Azure
    Worker role

## <a name="concepts"> </a>Concepts

The Queue service contains the following components:

![Queue1][]

-   **URL format:** Queues are addressable using the following URL
    format:   
    http://<storage account\>.queue.core.windows.net/<queue\>  
      
    The following URL addresses one of the queues in the diagram:  
    http://myaccount.queue.core.windows.net/imagesToDownload

-   **Storage Account:** All access to Windows Azure Storage is done
    through a storage account. A storage account is the highest level of
    the namespace for accessing queues. The total size of blob, table,
    and queue contents in a storage account cannot exceed 100TB.

-   **Queue:** A queue contains a set of messages. All messages must be
    in a queue.

-   **Message:** A message, in any format, of up to 64KB.

[Queue1]: ../../../DevCenter/dotNet/Media/queue1.png
