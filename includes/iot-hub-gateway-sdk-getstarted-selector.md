> [AZURE.SELECTOR]
- [Linux](../articles/iot-hub/iot-hub-linux-gateway-sdk-get-started.md)
- [Windows](../articles/iot-hub/iot-hub-windows-gateway-sdk-get-started.md)

This article provides a detailed walkthrough of the [Hello World sample code][lnk-helloworld-sample] to illustrate the fundamental components of the [Azure IoT Gateway SDK][lnk-gateway-sdk] architecture. The sample uses the Gateway SDK to build a simple gateway that logs a "hello world" message to a file every five seconds.

This walkthrough covers:

- **Concepts**: A conceptual overview of the components that compose any gateway you create with the Gateway SDK.  
- **Hello World sample architecture**: Describes how the concepts apply to the Hello World sample and how the components fit together.
- **How to build the sample**: The steps required to build the sample.
- **How to run the sample**: The steps required to run the sample. 
- **Typical output**: An example of the output to expect when you run the sample.
- **Code snippets**: A collection of code snippets to show how the Hello World sample implements key gateway components.

## Gateway SDK concepts

Before you examine the sample code or create your own field gateway using the Gateway SDK, you should understand the key concepts that underpin the architecture of the SDK.

### Modules

You build a gateway with the Azure IoT Gateway SDK by creating and assembling *modules*. Modules use *messages* to exchange data with each other. A module receives a message, performs some action on it, optionally transforms it into a new message, and then publishes it for other modules to process. Some modules might only produce new messages and never process incoming messages. A chain of modules creates a data processing pipeline with each module performing a transformation on the data at one point in that pipeline.

![][1]
 
The SDK contains the following:

- Pre-written modules which perform common gateway functions.
- The interfaces a developer can use to write custom modules.
- The infrastructure necessary to deploy and run a set of modules.

The SDK provides an abstraction layer that enables you to build gateways to run on a variety of operating systems and platforms.

![][2]

### Messages

Although thinking about modules passing messages to each other is a convenient way to conceptualize how a gateway functions, it does not accurately reflect what happens. Modules use a message bus to communicate with each other, they publish messages to the bus, and the bus broadcasts the messages to all the modules connected to the bus.

A module uses the **MessageBus_Publish** function to publish a message to the message bus. The message bus delivers messages to a module by invoking a callback function. A message consists of a set of key/value properties and content passed as a block of memory.

![][3]

Each module is responsible for filtering the messages because the message bus uses a broadcast mechanism to deliver each message to every module connected to it. A module should only act on messages that are intended for it. The message filtering effectively creates the message pipeline. A module typically filters the messages it receives using the message properties to identify messages it should process.

## Hello World sample architecture

The Hello World sample illustrates the concepts described in the previous section. The Hello World sample implements a gateway that has a pipeline made up of two modules:

-	The *hello world* module creates a message every five seconds and passes it to the logger module.
-	The *logger* module writes the messages it receives to a file.

![][4]

As described in the previous section, the Hello World module does not pass messages directly to the logger module every five seconds. Instead, it publishes a message to the message bus every five seconds.

The logger module receives the message from the message bus and inspects its properties in a filter. If the logger module determines that it should process the message, it writes the contents of the message to a file.

The logger module only consumes messages from the message bus, it never publishes new messages to the bus.

![][5]

The figure above shows the architecture of the Hello World sample and the relative paths to the source files that implement different portions of the sample in the [repository][lnk-gateway-sdk]. Explore the code on your own, or use the code snippets below as a guide.

<!-- Images -->
[1]: media/iot-hub-gateway-sdk-getstarted-selector/modules.png
[2]: media/iot-hub-gateway-sdk-getstarted-selector/modules_2.png
[3]: media/iot-hub-gateway-sdk-getstarted-selector/messages_1.png
[4]: media/iot-hub-gateway-sdk-getstarted-selector/high_level_architecture.png
[5]: media/iot-hub-gateway-sdk-getstarted-selector/detailed_architecture.png

<!-- Links -->
[lnk-helloworld-sample]: https://github.com/Azure/azure-iot-gateway-sdk/tree/master/samples/hello_world
[lnk-gateway-sdk]: https://github.com/Azure/azure-iot-gateway-sdk