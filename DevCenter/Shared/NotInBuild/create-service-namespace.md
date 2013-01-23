## <a name="create-namespace"> </a>Create a Service Namespace

To begin using Service Bus queues in Windows Azure, you must first
create a service namespace. A service namespace provides a scoping
container for addressing Service Bus resources within your application.

To create a service namespace:

1.  Log on to the [Windows Azure Management Portal][].

2.  In the lower left navigation pane of the Management Portal, click
    **Service Bus, Access Control & Caching**.

3.  In the upper left pane of the Management Portal, click the **Service
    Bus** node, and then click the **New** button.   
    ![][0]

4.  In the **Create a new Service Namespace** dialog, enter a
    **Namespace**, and then to make sure that it is unique, click the
    **Check Availability** button.   
    ![][1]

5.  After making sure the namespace name is available, choose the
    country or region in which your namespace should be hosted (make
    sure you use the same country/region in which you are deploying your
    compute resources), and then click the **Create Namespace** button.

The namespace you created will then appear in the Management Portal and
takes a moment to activate. Wait until the status is **Active** before
moving on.

## <a name="obtain-creds"> </a>Obtain the Default Management Credentials for the Namespace

In order to perform management operations, such as creating a queue, on
the new namespace, you need to obtain the management credentials for the
namespace.

1.  In the left navigation pane, click the **Service Bus** node, to
    display the list of available namespaces:   
    ![][0]

2.  Select the namespace you just created from the list shown:   
    ![][2]

3.  The right-hand **Properties** pane will list the properties for the
    new namespace:   
    ![][3]

4.  The **Default Key** is hidden. Click the **View** button to display
    the security credentials:   
    ![][4]

5.  Make a note of the **Default Issuer** and the **Default Key** as you
    will use this information below to perform operations with the
    namespace.

[Windows Azure Management Portal]: http://manage.windowsazure.com
  [0]: ../../../DevCenter/dotNet/Media/sb-queues-03.png
  [1]: ../../../DevCenter/dotNet/Media/sb-queues-04.png
  [2]: ../../../DevCenter/dotNet/Media/sb-queues-05.png
  [3]: ../../../DevCenter/dotNet/Media/sb-queues-06.png
  [4]: ../../../DevCenter/dotNet/Media/sb-queues-07.png
