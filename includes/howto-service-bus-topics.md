<h2><a name="what-are-service-bus-topics"></a>What are Service Bus Topics and Subscriptions</h2>

Service Bus topics and subscriptions support a **publish/subscribe
messaging communication** model. When using topics and subscriptions,
components of a distributed application do not communicate directly with
each other, they instead exchange messages via a topic, which acts as an
intermediary.

![TopicConcepts](./media/howto-service-bus-topics/sb-topics-01.png)

In contrast to Service Bus queues, where each message is processed by a
single consumer, topics and subscriptions provide a **one-to-many** form
of communication, using a publish/subscribe pattern. It is possible to
register multiple subscriptions to a topic. When a message is sent to a
topic, it is then made available to each subscription to handle/process
independently.

A topic subscription resembles a virtual queue that receives copies of
the messages that were sent to the topic. You can optionally register
filter rules for a topic on a per-subscription basis, which allows you
to filter/restrict which messages to a topic are received by which topic
subscriptions.

Service Bus topics and subscriptions enable you to scale to process a
very large number of messages across a very large number of users and
applications.

<h2><a name="create-a-service-namespace"></a>Create a Service Namespace</h2>

To begin using Service Bus topics and subscriptions in Azure,
you must first create a service namespace. A service namespace provides
a scoping container for addressing Service Bus resources within your
application.

To create a service namespace:

1.  Log on to the [Azure Management Portal][].

2.  In the left navigation pane of the Management Portal, click
    **Service Bus**.

3.  In the lower pane of the Management Portal, click **Create**.   
    ![][0]

4.  In the **Add a new namespace** dialog, enter a namespace name.
    The system immediately checks to see if the name is available.   
    ![][2]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources).

	IMPORTANT: Pick the **same region** that you intend to choose for
    deploying your application. This will give you the best performance.

6. 	Click the check mark. The system now creates your service
    namespace and enables it. You might have to wait several minutes as
    the system provisions resources for your account.

	![][6]


<h2><a name="obtain-default-credentials"></a>Obtain the Default Management Credentials for the Namespace</h2>

In order to perform management operations, such as creating a topic or
subscription on the new namespace, you must obtain the management
credentials for the namespace. You can obtain these credentials from either the Management Portal, or from the Visual Studio Server Explorer.

###To obtain management credentials from the portal

1.  In the left navigation pane, click the **Service Bus** node to
    display the list of available namespaces:   
    ![][0]

2.  Select the namespace you just created from the list shown:   
    ![][3]

3.  Click **Connection Information**.   
    ![][4]

4.  In the **Access connection information** dialog, find the **Default Issuer** and **Default Key** entries. Make a note of these values, as you will use this information below to perform operations with the namespace. 

###To obtain management credentials from Server Explorer

To obtain connection information using Visual Studio instead of the Management Portal, follow the procedure described [here](http://http://msdn.microsoft.com/en-us/library/windowsazure/ff687127.aspx), in the section titled **To connect to Azure from Visual Studio**. When you sign in to Azure, the **Service Bus** node under the **Microsoft Azure** tree in Server Explorer is automatically populated with any namespaces you've already created. Right-click any namespace, and then click **Properties** to see the connection string and other metadata associated with this namespace displayed in the Visual Studio **Properties** pane. 

Make a note of the **SharedAccessKey** value, or copy it to the clipboard:

![][34]

 
  [Azure Management Portal]: http://manage.windowsazure.com
  [0]: ./media/howto-service-bus-topics/sb-queues-13.png
  [2]: ./media/howto-service-bus-topics/sb-queues-04.png
  [3]: ./media/howto-service-bus-topics/sb-queues-09.png
  [4]: ./media/howto-service-bus-topics/sb-queues-06.png
  
  [6]: ./media/howto-service-bus-topics/getting-started-multi-tier-27.png
  [34]: ./media/howto-service-bus-topics/VSProperties.png
