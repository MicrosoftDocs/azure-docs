## <a name="what-queues"> </a>What are Service Bus Queues

<span>Service Bus Queues support a **brokered messaging communication**
model. When using queues, components of a distributed application do not
communicate directly with each other, they instead exchange messages via
a queue, which acts as an intermediary. A message producer (sender)
hands off a message to the queue and then continues its processing.
Asynchronously, a message consumer (receiver) pulls the message from the
queue and processes it. The producer does not have to wait for a reply
from the consumer in order to continue to process and send further
messages. Queues offer **First In, First Out (FIFO)** message delivery
to one or more competing consumers. That is, messages are typically
received and processed by the receivers in the order in which they were
added to the queue, and each message is received and processed by only
one message consumer.</span>

![Queue Concepts][]

Service Bus queues are a general-purpose technology that can be used for
a wide variety of scenarios:

-   Communication between web and worker roles in a multi-tier Windows
    Azure application
-   Communication between on-premises apps and Windows Azure hosted apps
    in a hybrid solution
-   Communication between components of a distributed application
    running on-premises in different organizations or departments of an
    organization

Using queues can enable you to scale out your applications better, and
enable more resiliency to your architecture.

 [Queue Concepts]: ../../../DevCenter/dotNet/Media/sb-queues-08.png