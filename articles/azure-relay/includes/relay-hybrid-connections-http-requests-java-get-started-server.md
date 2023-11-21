---
title: include file
description: include file
services: service-bus-relay
author: clemensv
ms.service: service-bus-relay
ms.topic: include
ms.date: 11/21/2023
ms.author: samurp
ms.custom: include file

---

### Create a Java application

If you have disabled the "Requires Client Authorization" option when creating the Relay,
you can send requests to the Hybrid Connections URL with any browser. For accessing
protected endpoints, you need to create and pass a token in the `ServiceBusAuthorization`
header, which is shown here.

Here's a simple Maven project structure and a Java class that demonstrates sending requests to 
a Hybrid Connections URL with client authorization utilizing the Azure Relay library. 

### Add the Relay MVN package

Modify your pom.xml file in your maven application package to include the following: 
  ```bash
   	    <dependency>
		    <groupId>com.microsoft.azure</groupId>
		    <artifactId>azure-relay</artifactId>
		    <version>0.0.6</version>
	          </dependency>
   ```
Run `mvn dependency:copy-dependencies -DoutputDirectory=lib` in your mvn project to add the 
dependency jar file in the lib directory of your project. This will also import all dependencies
of the `azure-relay` mvn package. This package provides functions to construct Relay URIs and tokens.

### Write some code to send messages

1. Add the dependency jar files to the ClassPath of your `Sender.java` file.

    ```bash
	javac -cp lib/* src/main/java/com/example/sender/Sender.Java
	```
2. Import the dependencies into your `Sender.java` class.
    ```java
	import java.io.BufferedReader;
	import java.io.IOException;
	import java.io.InputStream;
	import java.io.InputStreamReader;
	import java.io.OutputStreamWriter;
	import java.net.HttpURLConnection;
	import java.net.MalformedURLException;
	import java.net.URL;
	import java.time.Duration;
	import java.util.Scanner;
	import com.microsoft.azure.relay.RelayConnectionStringBuilder;
	import com.microsoft.azure.relay.TokenProvider;
	```

4. Add the following `constants` to the top of the `Sender.java` file to a `createConnectionString` 
   java function for the hybrid connection details.

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
    1. `namespace` - The Relay namespace. Be sure to use the fully qualified namespace name; for example, `{namespace}.servicebus.windows.net`.
    2. `path` - The name of the hybrid connection.
    3. `keyrule` - The name of the SAS key.
    4. `key` - The SAS key value.

5. Add the following code to the `Sender.java` file, below is the expected main function for your java class: 

    ```java
    public static void main(String[] args) throws IOException {
		String CONNECTION_STRING_ENV_VARIABLE_NAME = createConnectionString();
		if (CONNECTION_STRING_ENV_VARIABLE_NAME == null || CONNECTION_STRING_ENV_VARIABLE_NAME.isEmpty()){
			System.err.println("Connection string is null or empty. Please check your createConnectionString method.");
			return;
		}
		RelayConnectionStringBuilder connectionParams = new RelayConnectionStringBuilder(CONNECTION_STRING_ENV_VARIABLE_NAME);
		TokenProvider tokenProvider = TokenProvider.createSharedAccessSignatureTokenProvider(
				connectionParams.getSharedAccessKeyName(), 
				connectionParams.getSharedAccessKey());
		URL url = buildHttpConnectionURL(connectionParams.getEndpoint().toString(), connectionParams.getEntityPath());
		String tokenString = tokenProvider.getTokenAsync(url.toString(), Duration.ofHours(1)).join().getToken();
		Scanner in = new Scanner(System.in);
		while (true) {
			System.out.println("Press ENTER to terminate this program.");
			String message = in.nextLine();
			int value = System.in.read();
            if (value == '\n' || value == '\r') {
				System.out.println("Terminating the program...");
				break;}
			// Starting a HTTP connection to the listener
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			// Sending an HTTP request to the listener
			// To send a message body, use POST
			conn.setRequestMethod((message == null || message.length() == 0) ? "GET" : "POST");
			conn.setRequestProperty("ServiceBusAuthorization", tokenString);
			conn.setDoOutput(true);
			OutputStreamWriter out = new OutputStreamWriter(conn.getOutputStream());
			out.write(message, 0, message.length());
			out.flush();
			out.close();
			// Reading the HTTP response
			String inputLine;
			BufferedReader reader = null;
			StringBuilder responseBuilder = new StringBuilder();
			try {
				InputStream inputStream = conn.getInputStream();
				reader = new BufferedReader(new InputStreamReader(inputStream));
				System.out.println("status code: " + conn.getResponseCode());
				while ((inputLine = reader.readLine()) != null) {
					responseBuilder.append(inputLine);
				}
				System.out.println("received back " + responseBuilder.toString());
			} catch (IOException e) {
				System.out.println("The listener is offline or could not be reached.");
				break;
			} finally {
				if (reader != null) {
					reader.close();
				}
			}
		}
		in.close();
	}
	
	static URL buildHttpConnectionURL(String endpoint, String entity) throws MalformedURLException {
		StringBuilder urlBuilder = new StringBuilder(endpoint + entity);
		
		// For HTTP connections, the scheme must be https://
		int schemeIndex = urlBuilder.indexOf("://");
		if (schemeIndex < 0) {
			throw new IllegalArgumentException("Invalid scheme from the given endpoint.");
		}
		urlBuilder.replace(0, schemeIndex, "https");
		return new URL(urlBuilder.toString());
	}
   ```
    Here is what your `Sender.java` file should look like:
   
    ```java
	package com.example.sender;
	import java.io.BufferedReader;
	import java.io.IOException;
	import java.io.InputStream;
	import java.io.InputStreamReader;
	import java.io.OutputStreamWriter;
	import java.net.HttpURLConnection;
	import java.net.MalformedURLException;
	import java.net.URL;
	import java.time.Duration;
	import java.util.Scanner;
	import com.microsoft.azure.relay.RelayConnectionStringBuilder;
	import com.microsoft.azure.relay.TokenProvider;
	public class Sender
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
		public static void main(String[] args) throws IOException {
			String CONNECTION_STRING_ENV_VARIABLE_NAME = createConnectionString();
			if (CONNECTION_STRING_ENV_VARIABLE_NAME == null || CONNECTION_STRING_ENV_VARIABLE_NAME.isEmpty()){
				System.err.println("Connection string is null or empty. Please check your createConnectionString method.");
				return;
			}
			RelayConnectionStringBuilder connectionParams = new RelayConnectionStringBuilder(CONNECTION_STRING_ENV_VARIABLE_NAME);
			TokenProvider tokenProvider = TokenProvider.createSharedAccessSignatureTokenProvider(
					connectionParams.getSharedAccessKeyName(), 
					connectionParams.getSharedAccessKey());
			URL url = buildHttpConnectionURL(connectionParams.getEndpoint().toString(), connectionParams.getEntityPath());
			String tokenString = tokenProvider.getTokenAsync(url.toString(), Duration.ofHours(1)).join().getToken();
			Scanner in = new Scanner(System.in);
			while (true) {
				System.out.println("Press ENTER to terminate this program.");
				String message = in.nextLine();
				int value = System.in.read();
				if (value == '\n' || value == '\r') {
					System.out.println("Terminating the program...");
					break;}
				// Starting a HTTP connection to the listener
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				// Sending an HTTP request to the listener
				// To send a message body, use POST
				conn.setRequestMethod((message == null || message.length() == 0) ? "GET" : "POST");
				conn.setRequestProperty("ServiceBusAuthorization", tokenString);
				conn.setDoOutput(true);
				OutputStreamWriter out = new OutputStreamWriter(conn.getOutputStream());
				out.write(message, 0, message.length());
				out.flush();
				out.close();
				// Reading the HTTP response
				String inputLine;
				BufferedReader reader = null;
				StringBuilder responseBuilder = new StringBuilder();
				try {
					InputStream inputStream = conn.getInputStream();
					reader = new BufferedReader(new InputStreamReader(inputStream));
					System.out.println("status code: " + conn.getResponseCode());
					while ((inputLine = reader.readLine()) != null) {
						responseBuilder.append(inputLine);
					}
					System.out.println("received back " + responseBuilder.toString());
				} catch (IOException e) {
					System.out.println("The listener is offline or could not be reached.");
					break;
				} finally {
					if (reader != null) {
						reader.close();
					}
				}
			}
			in.close();
		}
	
		static URL buildHttpConnectionURL(String endpoint, String entity) throws MalformedURLException {
			StringBuilder urlBuilder = new StringBuilder(endpoint + entity);
		
			// For HTTP connections, the scheme must be https://
			int schemeIndex = urlBuilder.indexOf("://");
			if (schemeIndex < 0) {
				throw new IllegalArgumentException("Invalid scheme from the given endpoint.");
			}
			urlBuilder.replace(0, schemeIndex, "https");
			return new URL(urlBuilder.toString());
		}
	}
    ```
