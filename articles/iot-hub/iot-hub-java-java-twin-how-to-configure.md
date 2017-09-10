---
title: Use Azure IoT Hub device twin properties (Java) | Microsoft Docs
description: How to use Azure IoT Hub device twins to configure devices. You use the Azure IoT device SDK for Java to implement a simulated device app and the Azure IoT service SDK for Java to implement a service app that modifies a device configuration using a device twin.
services: iot-hub
documentationcenter: java
author: dominicbetts
manager: timlt
editor: ''

ms.service: iot-hub
ms.devlang: java
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/31/2017
ms.author: dobett

---
# Use desired properties to configure devices

[!INCLUDE [iot-hub-selector-twin-how-to-configure](../../includes/iot-hub-selector-twin-how-to-configure.md)]

At the end of this tutorial, you have two Java console apps:

* **simulated-device**, a simulated device app that waits for a desired configuration update and reports the status of a simulated configuration update process.
* **set-configuration**, a back-end app, which sets the desired configuration on a device and queries the configuration update process.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both device and back-end apps.
> 
> 

To complete this tutorial you need the following:

* The latest [Java SE Development Kit 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
* [Maven 3](https://maven.apache.org/install.html) 
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

If you followed the [Get started with device twins][lnk-twin-tutorial] tutorial, you already have an IoT hub and a device identity called **myDeviceId**. In that case, you can skip to the [Create the simulated device app][lnk-how-to-configure-createapp] section.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity](../../includes/iot-hub-get-started-create-device-identity-portal.md)]

<a id="#create-the-simulated-device-app"></a>
## Create the simulated device app
In this section, you create a Java console app that connects to your hub as **myDeviceId**, waits for a desired configuration update and then reports updates on the simulated configuration update process.

1. Create an empty folder called dt-get-started.

1. In the dt-get-started folder, create a Maven project called **simulated-device** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=simulated-device -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the simulated-device folder.

1. Using a text editor, open the pom.xml file in the simulated-device folder and add the following dependency to the **dependencies** node. This dependency enables you to use the iot-service-client package in your app to communicate with your IoT hub:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-device-client</artifactId>
      <version>1.3.30</version>
    </dependency>
    ```

    > [!NOTE]
    > You can check for the latest version of **iot-device-client** using [Maven search][lnk-maven-device-search].

1. Add the following **build** node after the **dependencies** node. This configuration instructs Maven to use Java 1.8 to build the app:

    ```xml
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.3</version>
          <configuration>
            <source>1.8</source>
            <target>1.8</target>
          </configuration>
        </plugin>
      </plugins>
    </build>
    ```

1. Save and close the pom.xml file.

1. Using a text editor, open the simulated-device\src\main\java\com\mycompany\app\App.java source file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.device.*;
    import com.microsoft.azure.sdk.iot.device.DeviceTwin.*;

    import java.io.IOException;
    import java.net.URISyntaxException;
    import java.util.Scanner;
    ```

1. Add the following class-level variables to the **App** class. Replace **{yourdeviceconnectionstring}** with the device connection string you noted in the *Create a device identity* section:

    ```java
	private static String deviceId = "myDeviceId";
    private static IotHubClientProtocol protocol = IotHubClientProtocol.MQTT;
    private static String connString = "{yourdeviceconnectionstring}";
    private static DeviceClient client;
	private static TelemetryConfig telemetryConfig;
    ```

1. To implement a callback handler for device twin status events, add the following nested class to the **App** class:

    ```java
    protected static class DeviceTwinStatusCallBack implements IotHubEventCallback 
	{
		public void execute(IotHubStatusCode status, Object context) 
		{
			System.out.println("IoT Hub responded to device twin operation with status " + status.name());
		}
	}
    ```

1. Add the following method to the **App** class:

    ```java
    private static class TelemetryConfig extends Device 
	{
		private Boolean configIdChanged = false;
		private Boolean frequencyChanged = false;

		private Property configId = new Property("configId", "0");
		private Property sendFrequency = new Property("sendFrequency", "24h");
		private Property pending_status = new Property("pending_status", null);
		private Property pending_configId = new Property("pending_configId", null);
		private Property pending_sendFrequency = new Property("pending_sendFrequency", null);

		public void InitTelemetry() throws IOException 
		{
			System.out.println("Report initial telemetry configuration:");
			this.setReportedProp(this.configId);
			this.setReportedProp(this.sendFrequency);
			this.setReportedProp(this.pending_status);
			this.setReportedProp(this.pending_configId);
			this.setReportedProp(this.pending_sendFrequency);
			System.out.println("Sending initial config");
			System.out.println(this.getReportedProp());
			client.sendReportedProperties(this.getReportedProp());
		}

		private void UpdateReportedConfiguration() 
		{
      // Need a thread to ensure there's no conflict with receiving desired properties?
			new Thread(() -> {
				try {
					System.out.println("Sending pending config");
					pending_status.setValue("Pending");
					System.out.println(this.getReportedProp());

					System.out.println("Simulating device reset...");
					Thread.sleep(10000);
					configId.setValue(pending_configId.getValue());
					sendFrequency.setValue(pending_sendFrequency.getValue());
					pending_status.setValue("Success");
					pending_configId.setValue(null);
					pending_sendFrequency.setValue(null);
					System.out.println("Sending final config");
					System.out.println(this.getReportedProp());
					client.sendReportedProperties(this.getReportedProp());
				}
				catch (Exception e) {
					System.out.println("Exception \n" + " Cause: " + e.getCause() + " \n" + e.getMessage());
				}
			}).start();
		}
    
		@Override
		public void PropertyCall(String propertyKey, Object propertyValue, Object context) 
		{
			System.out.println(propertyKey + " changed to " + propertyValue);

			String current_configId = (String)configId.getValue();
			if (propertyKey.equals("configId") && !current_configId.equals((String)propertyValue)) {
				configIdChanged = true;
				pending_configId.setValue(propertyValue);
			};
			if (propertyKey.equals("sendFrequency")) {
				frequencyChanged = true;
				pending_sendFrequency.setValue(propertyValue);
			};
			if (configIdChanged && frequencyChanged) {
				configIdChanged = false;
				frequencyChanged = false;
				UpdateReportedConfiguration();
			}
		}
	}
    ```

1. Modify the signature of the **main** method to throw the following exceptions:

    ```java
    public static void main(String[] args) throws IOException, URISyntaxException
    ```

1. Add the following code to the **main** method to instantiate a **DeviceClient**:

    ```java
    // Create a device client
    client = new DeviceClient(connString, protocol);

    // Create a Device object to store the device twin properties
    telemetryConfig = new TelemetryConfig();
    ```

1. Add the following code to the **main** method to start device twin services:

    ```java
    try {
      // Open the DeviceClient and start the device twin services.
      client.open();
      client.startDeviceTwin(new DeviceTwinStatusCallBack(), null, telemetryConfig, null);
      telemetryConfig.InitTelemetry();

      // Is this needed?
      client.subscribeToDesiredProperties(telemetryConfig.getDesiredProp());
    }
    catch (Exception e) {
      System.out.println("On exception, shutting down \n" + " Cause: " + e.getCause() + " \n" + e.getMessage());
      telemetryConfig.clean();
      client.close();
      System.out.println("Shutting down...");
    }
    ```

1. Add the following code to the **main** method to shut down the device simulator:

    ```java
    System.out.println("Press any key to exit...");

    Scanner scanner = new Scanner(System.in);
    scanner.nextLine();

    telemetryConfig.clean();
    client.close();
    ```

1. Save and close the simulated-device\src\main\java\com\mycompany\app\App.java file.

1. Build the **simulated-device** back-end app and correct any errors. At your command prompt, navigate to the simulated-device folder and run the following command:

    `mvn clean package -DskipTests`

   > [!NOTE]
   > This tutorial does not simulate any behavior for concurrent configuration updates. Some configuration update processes might be able to accommodate changes of target configuration while the update is running, some might have to queue them, and some could reject them with an error condition. Make sure to consider the desired behavior for your specific configuration process, and add the appropriate logic before initiating the configuration change.
   > 
   > 

## Create the service app
In this section, you will create a Java console app that updates the *desired properties* on the device twin associated with **myDeviceId** with a new telemetry configuration object. It then queries the device twins stored in the IoT hub and shows the difference between the desired and reported configurations of the device.

1. In the dt-get-started folder, create a Maven project called **set-configuration** using the following command at your command prompt. Note this is a single, long command:

    `mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=set-configuration -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false`

1. At your command prompt, navigate to the set-configuration folder.

1. Using a text editor, open the pom.xml file in the trigger-reboot folder and add the following dependency to the **dependencies** node. This dependency enables you to use the iot-service-client package in your app to communicate with your IoT hub:

    ```xml
    <dependency>
      <groupId>com.microsoft.azure.sdk.iot</groupId>
      <artifactId>iot-service-client</artifactId>
      <version>1.5.22</version>
      <type>jar</type>
    </dependency>
    ```

    > [!NOTE]
    > You can check for the latest version of **iot-service-client** using [Maven search][lnk-maven-service-search].

1. Add the following **build** node after the **dependencies** node. This configuration instructs Maven to use Java 1.8 to build the app:

    ```xml
    <build>
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.3</version>
          <configuration>
            <source>1.8</source>
            <target>1.8</target>
          </configuration>
        </plugin>
      </plugins>
    </build>
    ```

1. Save and close the pom.xml file.

1. Using a text editor, open the set-configuration\src\main\java\com\mycompany\app\App.java source file.

1. Add the following **import** statements to the file:

    ```java
    import com.microsoft.azure.sdk.iot.service.devicetwin.*;
	import com.microsoft.azure.sdk.iot.service.exceptions.IotHubException;

	import java.io.IOException;
	import java.util.HashSet;
	import java.util.Set;
    ```

1. Add the following class-level variables to the **App** class. Replace **{youriothubconnectionstring}** with your IoT hub connection string you noted in the *Create an IoT Hub* section:

    ```java
    public static final String iotHubConnectionString = "{youriothubconnectionstring}";
    public static final String deviceId = "myDeviceId";

    public static final String region = "US";
	public static final String plant = "Redmond43";
    ```

1. To query and update device twins on the simulated device, add the following code to the **main** method:

    ```java
    // Get the DeviceTwin and DeviceTwinDevice objects
    DeviceTwin twinClient = DeviceTwin.createFromConnectionString(iotHubConnectionString);
    DeviceTwinDevice device = new DeviceTwinDevice(deviceId);

    try {
		// Get the device twin from IoT Hub
		System.out.println("Device twin before update:");
		twinClient.getTwin(device);
		System.out.println(device);

		// Update device twin tags if they are different
		// from the existing values
		String currentTags = device.tagsToString();
		if ((!currentTags.contains("region=" + region) && !currentTags.contains("plant=" + plant))) {
			// Create the tags and attach them to the DeviceTwinDevice object
			Set<Pair> tags = new HashSet<Pair>();
			tags.add(new Pair("region", region));
			tags.add(new Pair("plant", plant));
			device.setTags(tags);

			// Update the device twin in IoT Hub
			System.out.println("Updating device twin");
			twinClient.updateTwin(device);
		}
		
		// Retrieve the device twin with the tag values from IoT Hub
		System.out.println("Device twin after update:");
		twinClient.getTwin(device);
		System.out.println(device);

		// Query the device twins in IoT Hub
		System.out.println("Devices in Redmond:");

		// Construct the query
		SqlQuery sqlQuery = SqlQuery.createSqlQuery("*", SqlQuery.FromType.DEVICES, "tags.plant='R*'", null);

		// Run the query, returning a maximum of 100 devices
		Query twinQuery = twinClient.queryTwin(sqlQuery.getQuery(), 100);
		while (twinClient.hasNextDeviceTwin(twinQuery)) {
			DeviceTwinDevice d = twinClient.getNextDeviceTwin(twinQuery);
			System.out.println(d.getDeviceId());
		}

		System.out.println("Devices in Redmond using a cellular network:");

		// Construct the query
		sqlQuery = SqlQuery.createSqlQuery("*", SqlQuery.FromType.DEVICES, "tags.plant='Redmond43' AND properties.reported.connectivityType = 'cellular'", null);

		// Run the query, returning a maximum of 100 devices
		twinQuery = twinClient.queryTwin(sqlQuery.getQuery(), 3);
		while (twinClient.hasNextDeviceTwin(twinQuery)) {
			DeviceTwinDevice d = twinClient.getNextDeviceTwin(twinQuery);
			System.out.println(d.getDeviceId());
		}
    } catch (IotHubException e) {
      System.out.println(e.getMessage());
    } catch (IOException e) {
      System.out.println(e.getMessage());
    }
    ```

1. Save and close the set-desired-configuration\src\main\java\com\mycompany\app\App.java file.

1. Build the **set-configuration** back-end app and correct any errors. At your command prompt, navigate to the set-configuration folder and run the following command:

    `mvn clean package -DskipTests`
   
    The **Registry** object exposes all the methods required to interact with device twins from the service. This code initializes the **Registry** object, retrieves the device twin for **myDeviceId**, and then updates its desired properties with a new telemetry configuration object.
    After that, it queries the device twins stored in the IoT hub every 10 seconds, and prints the desired and reported telemetry configurations. Refer to the [IoT Hub query language][lnk-query] to learn how to generate rich reports across all your devices.
   
   > [!IMPORTANT]
   > This application queries IoT Hub every 10 seconds for illustrative purposes. Use queries to generate user-facing reports across many devices, and not to detect changes. If your solution requires real-time notifications of device events, use [twin notifications][lnk-twin-notifications].
   > 

 ![Device configured successfully][img-deviceconfigured]
   
   > [!IMPORTANT]
   > There is a delay of up to a minute between the device report operation and the query result. This is to enable the query infrastructure to work at very high scale. To retrieve consistent views of a single device twin use the **getDeviceTwin** method in the **Registry** class.
   > 
   > 

## Run the apps

You are now ready to run the apps.

1. At a command prompt in the simulated-device folder, run the following command to begin listening for reboot method calls from your IoT hub:

    `mvn exec:java -Dexec.mainClass="com.mycompany.app.App"`

    ![Java IoT Hub simulated device app to listen for reboot direct method calls][1]

1. At a command prompt in the set-configuration folder, run the following command to query and update the device twins on your simulated device from your IoT hub:

    `mvn exec:java -Dexec.mainClass="com.mycompany.app.App"`

    ![Java IoT Hub service app to call the reboot direct method][2]

1. The simulated device responds to the reboot direct method call:

    ![Java IoT Hub simulated device app responds to the direct method call][3]

## Next steps
In this tutorial, you set a desired configuration as *desired properties* from the solution back end, and wrote a device app to detect that change and simulate a multi-step update process reporting its status through the reported properties.

Use the following resources to learn how to:

* send telemetry from devices with the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial,
* schedule or perform operations on large sets of devices see the [Schedule and broadcast jobs][lnk-schedule-jobs] tutorial.
* control devices interactively (such as turning on a fan from a user-controlled app), with the [Use direct methods][lnk-methods-tutorial] tutorial.

<!-- images -->
[img-servicenuget]: media/iot-hub-csharp-csharp-twin-how-to-configure/servicesdknuget.png
[img-createapp]: media/iot-hub-csharp-csharp-twin-how-to-configure/createnetapp.png
[img-deviceconfigured]: media/iot-hub-csharp-csharp-twin-how-to-configure/deviceconfigured.png
[img-createdeviceapp]: media/iot-hub-csharp-csharp-twin-how-to-configure/createdeviceapp.png
[img-clientnuget]: media/iot-hub-csharp-csharp-twin-how-to-configure/devicesdknuget.png
[img-deviceconfigured]: media/iot-hub-csharp-csharp-twin-how-to-configure/deviceconfigured.png


<!-- links -->
[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[lnk-nuget-client-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices.Client/
[lnk-nuget-service-sdk]: https://www.nuget.org/packages/Microsoft.Azure.Devices/1.1.0/

[lnk-query]: iot-hub-devguide-query-language.md
[lnk-twin-notifications]: iot-hub-devguide-device-twins.md#back-end-operations
[lnk-twin-tutorial]: iot-hub-csharp-csharp-twin-getstarted.md
[lnk-schedule-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-iothub-getstarted]: iot-hub-csharp-csharp-getstarted.md
[lnk-methods-tutorial]: iot-hub-node-node-direct-methods.md
[lnk-how-to-configure-createapp]: iot-hub-csharp-csharp-twin-how-to-configure.md#create-the-simulated-device-app
