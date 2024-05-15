---
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 01/04/2024
ms.author: samurp
---

### Create a Java application

If you disabled the "Requires Client Authorization" option when creating the Relay,
you can send requests to the Hybrid Connections URL with any browser. For accessing
protected endpoints, you need to create and pass a token in the `ServiceBusAuthorization`
header, which is shown here.

Here's a simple Maven project structure and a Java class that demonstrates sending requests to 
a Hybrid Connections URL with client authorization utilizing the Azure Relay library. 

### Add the Relay package

Modify your pom.xml file in your maven application package to include the Azure Relay package.

```xml
<dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>azure-relay</artifactId>
    <version>0.0.6</version>
</dependency>
```

Run `mvn dependency:copy-dependencies -DoutputDirectory=lib` in your mvn project to add the dependency jar file in the lib directory of your project. It imports all dependencies of the `azure-relay` mvn package. This package provides functions to construct Relay uniform resource identifiers (URIs) and tokens.

### Write some code to send messages

1. Add the dependency jar files to the ClassPath of your `Listener.java` file.

    ```bash
    javac -cp lib/* src/main/java/com/example/listener/Listener.Java
    ```

2. Import the dependencies into your `Listener.java` class.

    ```java
    import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.net.URI;
    import java.net.URISyntaxException;
    import java.util.Scanner;
    import com.microsoft.azure.relay.HybridConnectionListener;
    import com.microsoft.azure.relay.RelayConnectionStringBuilder;
    import com.microsoft.azure.relay.RelayedHttpListenerResponse;
    import com.microsoft.azure.relay.TokenProvider;
    ```

3. Add the following `constants` to the top of the `Listener.java` file to a `createConnectionString` java function for the hybrid connection details.

    ```java
    public static String createConnectionString(){
        StringBuilder connectionString = new StringBuilder();
        connectionString.append("Endpoint=sb://");
        connectionString.append("{namespace}");
        connectionString.append(".servicebus.windows.net/;SharedAccessKeyName=");
        connectionString.append("{keyrule}");
        connectionString.append(";SharedAccessKey=");
        connectionString.append("{key}");
        connectionString.append(";EntityPath=");
        connectionString.append("{path}");
        return connectionString.toString();
    }
    ```

    Replace the placeholders in brackets with the values you obtained when you created the hybrid connection.

    - `namespace` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
    - `path` - The name of the hybrid connection.
    - `keyrule` - Name of your Shared Access Policies key, which is `RootManageSharedAccessKey` by default.
    - `nst key` -   The primary key of the namespace you saved earlier.

4. Add the following code to the `Listener.java` file. The main function should look like the following code:

    ```java
    public static void main( String[] args ) throws URISyntaxException
    {
        String CONNECTION_STRING_ENV_VARIABLE_NAME = createConnectionString();
        RelayConnectionStringBuilder connectionParams = new RelayConnectionStringBuilder(CONNECTION_STRING_ENV_VARIABLE_NAME);
        TokenProvider tokenProvider = TokenProvider.createSharedAccessSignatureTokenProvider(
                    connectionParams.getSharedAccessKeyName(),
                    connectionParams.getSharedAccessKey());
        HybridConnectionListener listener = new HybridConnectionListener(new URI(connectionParams.getEndpoint().toString() + connectionParams.getEntityPath()), tokenProvider);

        // The "context" object encapsulates both the incoming request and the outgoing response
        listener.setRequestHandler((context) -> {
            String receivedText = "";
            if (context.getRequest().getInputStream() != null) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(context.getRequest().getInputStream(), "UTF8"))) {
                    StringBuilder builder = new StringBuilder();
                    String inputLine;
                    while ((inputLine = reader.readLine()) != null) {
                        builder.append(inputLine);
                    }
                    receivedText = builder.toString();
                } catch (IOException e) {
                    System.out.println(e.getMessage());
                }
            }
            System.out.println("requestHandler received " + receivedText);

            RelayedHttpListenerResponse response = context.getResponse();
            response.setStatusCode(202);
            response.setStatusDescription("OK");

            try {
                response.getOutputStream().write(("Echo: " + receivedText).getBytes());
            } catch (IOException e) {
                e.printStackTrace();
            }

            // The context MUST be closed for the message to be sent
            response.close();
        });

        listener.openAsync().join();

        Scanner in = new Scanner(System.in);
        System.out.println("Press ENTER to terminate this program.");
        in.nextLine();

        listener.close();
        in.close();
    }

    ```
    Here's what your `Listener.java` file should look like:

    ```java
    package com.example.listener;
    import java.io.BufferedReader;
    import java.io.IOException;
    import java.io.InputStreamReader;
    import java.net.URI;
    import java.net.URISyntaxException;
    import java.util.Scanner;
    import com.microsoft.azure.relay.HybridConnectionListener;
    import com.microsoft.azure.relay.RelayConnectionStringBuilder;
    import com.microsoft.azure.relay.RelayedHttpListenerResponse;
    import com.microsoft.azure.relay.TokenProvider;
    
     public class Listener
     {
        public static String createConnectionString(){
            StringBuilder connectionString = new StringBuilder();
            connectionString.append("Endpoint=sb://");
            connectionString.append("{namespace}");
            connectionString.append(".servicebus.windows.net/;SharedAccessKeyName=");
            connectionString.append("{keyrule}");
            connectionString.append(";SharedAccessKey=");
            connectionString.append("{key}");
            connectionString.append(";EntityPath=");
            connectionString.append("{path}");
            return connectionString.toString();
        }
    
        public static void main( String[] args ) throws URISyntaxException
        {
            String CONNECTION_STRING_ENV_VARIABLE_NAME = createConnectionString();
            RelayConnectionStringBuilder connectionParams = new RelayConnectionStringBuilder(CONNECTION_STRING_ENV_VARIABLE_NAME);
            TokenProvider tokenProvider = TokenProvider.createSharedAccessSignatureTokenProvider(
                        connectionParams.getSharedAccessKeyName(),
                        connectionParams.getSharedAccessKey());
            HybridConnectionListener listener = new HybridConnectionListener(new URI(connectionParams.getEndpoint().toString() + connectionParams.getEntityPath()), tokenProvider);
    
            // The "context" object encapsulates both the incoming request and the outgoing response
            listener.setRequestHandler((context) -> {
                String receivedText = "";
                if (context.getRequest().getInputStream() != null) {
                    try (BufferedReader reader = new BufferedReader(new InputStreamReader(context.getRequest().getInputStream(), "UTF8"))) {
                        StringBuilder builder = new StringBuilder();
                        String inputLine;
                        while ((inputLine = reader.readLine()) != null) {
                            builder.append(inputLine);
                        }
                        receivedText = builder.toString();
                    } catch (IOException e) {
                        System.out.println(e.getMessage());
                    }
                }
                System.out.println("requestHandler received " + receivedText);
    
                RelayedHttpListenerResponse response = context.getResponse();
                response.setStatusCode(202);
                response.setStatusDescription("OK");
    
                try {
                    response.getOutputStream().write(("Echo: " + receivedText).getBytes());
                } catch (IOException e) {
                    e.printStackTrace();
                }
    
                // The context MUST be closed for the message to be sent
                response.close();
            });
    
            listener.openAsync().join();
    
            Scanner in = new Scanner(System.in);
            System.out.println("Press ENTER to terminate this program.");
            in.nextLine();
    
            listener.close();
            in.close();
        }
    }
    ```
