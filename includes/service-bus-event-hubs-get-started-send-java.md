## Send messages to Event Hubs
In this section we will write a Java console app to send events to your event hub. We will make use of the JMS AMQP provider from the [Apache Qpid project](http://qpid.apache.org/). This is analogous to using Service Bus Queues and Topics with AMQP through Java as shown [here](../articles/service-bus-java-how-to-use-jms-api-amqp.md). For more information refer to [Qpid JMS documentation](http://qpid.apache.org/releases/qpid-0.30/programming/book/QpidJMS.html) and [Java Messaging Service](http://www.oracle.com/technetwork/java/jms/index.html).

1. In Eclipse, create a new Java project named **Sender**.

2. Download the latest release of the **Qpid JMS AMQP 1.0** library from [here](http://qpid.apache.org/components/qpid-jms/index.html).

3. Extract the files from the archive and copy the following jars from the archive `qpid-amqp-1-0-client-jms\<version>\lib` directory into your Eclipse **Sender** project.

4. In Eclipse Package Explorer, right-click the **Sender** project and select **Properties**. In the left pane of the dialog, click **Java Build Path**, then click the **Libraries** tab, and then the **Add JARs** button. Select all the jars previously copied, and then click **OK**.

	![][8]

5. Create a file named **servicebus.properties** in the root of the **Sender** project, with the following content. Remember to substitute the value for your Event Hub name and namespace name (the latter is usually `{event hub name}-ns`). You must also substitute a URL-encoded version of the key for the **SendRule** created earlier. You can URL-encode it [here](http://www.w3schools.com/tags/ref_urlencode.asp).

		# servicebus.properties - sample JNDI configuration

		# Register a ConnectionFactory in JNDI using the form:
		# connectionfactory.[jndi_name] = [ConnectionURL]
		connectionfactory.SBCF = amqps://SendRule:{Send Rule key}@{namespace name}.servicebus.windows.net/?sync-publish=false

		# Register some queues in JNDI using the form
		# queue.[jndi_name] = [physical_name]
		# topic.[jndi_name] = [physical_name]
		queue.EventHub = {event hub name}

5. Create a new class named **Sender**. Add the following `import` statements:

		import java.io.BufferedReader;
		import java.io.IOException;
		import java.io.InputStreamReader;
		import java.io.UnsupportedEncodingException;
		import java.util.Hashtable;
		
		import javax.jms.BytesMessage;
		import javax.jms.Connection;
		import javax.jms.ConnectionFactory;
		import javax.jms.Destination;
		import javax.jms.JMSException;
		import javax.jms.MessageProducer;
		import javax.jms.Session;
		import javax.naming.Context;
		import javax.naming.InitialContext;
		import javax.naming.NamingException; 

8. Then, add the following code to it:

		public static void main(String[] args) throws NamingException,
				JMSException, IOException, InterruptedException {
			// Configure JNDI environment
			Hashtable<String, String> env = new Hashtable<String, String>();
			env.put(Context.INITIAL_CONTEXT_FACTORY,
					"org.apache.qpid.amqp_1_0.jms.jndi.PropertiesFileInitialContextFactory");
			env.put(Context.PROVIDER_URL, "servicebus.properties");
			Context context = new InitialContext(env);
	
			ConnectionFactory cf = (ConnectionFactory) context.lookup("SBCF");
	
			Destination queue = (Destination) context.lookup("EventHub");
	
			// Create Connection
			Connection connection = cf.createConnection();
	
			// Create sender-side Session and MessageProducer
			Session sendSession = connection.createSession(false,
					Session.AUTO_ACKNOWLEDGE);
			MessageProducer sender = sendSession.createProducer(queue);
	
			System.out.println("Press Ctrl-C to stop the sender process");
			System.out.println("Press Enter to start now");
			BufferedReader commandLine = new java.io.BufferedReader(
					new InputStreamReader(System.in));
			commandLine.readLine();
	
			while (true) {
				sendBytesMessage(sendSession, sender);
				Thread.sleep(200);
			}
		}
		
		private static void sendBytesMessage(Session sendSession, MessageProducer sender) throws JMSException, UnsupportedEncodingException {
	        BytesMessage message = sendSession.createBytesMessage();
	        message.writeBytes("Test AMQP message from JMS".getBytes("UTF-8"));
	        sender.send(message);
	        System.out.println("Sent message");
	    }



<!-- Links -->
[Azure Management Portal]: https://manage.windowsazure.com/


<!-- Images -->
[8]: ./media/service-bus-event-hubs-getstarted/create-sender-java1.png