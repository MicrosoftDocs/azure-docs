<a id="what-are-service-bus-queues"></a>
<h2>What are Service Bus Queues?</h2>

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

<a id="create-a-service-namespace"></a>
<h2>Create a Service Namespace</h2>

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].

2.  In the left navigation pane of the Management Portal, click
    **Service Bus**.

3.  In the lower pane of the Management Portal, click **Create**.   
    ![][0]

4.  In the **Add a new namespace** dialog, enter a namespace name.
    The system immediately checks to see if the name is available.   
    ![][1]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources).

    IMPORTANT: Pick the **same region** that you intend to choose for
    deploying your application. This will give you the best performance.

6. 	Click the check mark. The system now creates your service
    namespace and enables it. You might have to wait several minutes as
    the system provisions resources for your account.

	![][5]

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
continuing.

<a id="obtain-default-credentials"></a>
<h2>Obtain the Default Management Credentials for the Namespace</h2>

In order to perform management operations, such as creating a queue, on
the new namespace, you must obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:   
    ![][6]

2.  Select the namespace you just created from the list shown:   
    ![][2]

3.  Click **Connection Information**.   
    ![][3]

4.  In the **Access connection information** dialog, find the **Default Issuer** and **Default Key** entries. Make a note of these values, as you will use this information below to perform operations with the namespace.

 [Windows Azure Management Portal]: http://manage.windowsazure.com
  [Queue Concepts]: ../../../DevCenter/dotNet/Media/sb-queues-08.png
  [Windows Azure Management Portal]: http://manage.windowsazure.com
  [0]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [1]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-09.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [5]: ../../../DevCenter/dotNet/Media/getting-started-multi-tier-27.png
  [6]: ../../../DevCenter/dotNet/Media/sb-queues-13.png