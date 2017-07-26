> [!div class="op_single_selector"]
> * [Linux](../articles/iot-hub/iot-hub-linux-iot-edge-get-started.md)
> * [Windows](../articles/iot-hub/iot-hub-windows-iot-edge-get-started.md)
> 
> 

This article provides a detailed walkthrough of the [Hello World sample code][lnk-helloworld-sample] to illustrate the fundamental components of the [Azure IoT Edge][lnk-iot-edge] architecture. The sample uses the Azure IoT Edge to build a simple gateway that logs a "hello world" message to a file every five seconds.

This walkthrough covers:

* **Hello World sample architecture**: Describes how [Azure IoT Edge architectural concepts][lnk-edge-concepts] apply to the Hello World sample and how the components fit together.
* **How to build the sample**: The steps required to build the sample.
* **How to run the sample**: The steps required to run the sample. 
* **Typical output**: An example of the output to expect when you run the sample.
* **Code snippets**: A collection of code snippets to show how the Hello World sample implements key IoT Edge gateway components.


## Hello World sample architecture
The Hello World sample illustrates the concepts described in the previous section. The Hello World sample implements a IoT Edge gateway that has a pipeline made up of two IoT Edge modules:

* The *hello world* module creates a message every five seconds and passes it to the logger module.
* The *logger* module writes the messages it receives to a file.

![Architecture of Hello World sample built with Azure IoT Edge][4]

As described in the previous section, the Hello World module does not pass messages directly to the logger module every five seconds. Instead, it publishes a message to the broker every five seconds.

The logger module receives the message from the broker and acts upon it, writing the contents of the message to a file.

The logger module only consumes messages from the broker, it never publishes new messages to the broker.

![How the broker routes messages between modules in Azure IoT Edge][5]

The figure above shows the architecture of the Hello World sample and the relative paths to the source files that implement different portions of the sample in the [repository][lnk-iot-edge]. Explore the code on your own, or use the code snippets below as a guide.

<!-- Images -->
[4]: media/iot-hub-iot-edge-getstarted-selector/high_level_architecture.png
[5]: media/iot-hub-iot-edge-getstarted-selector/detailed_architecture.png

<!-- Links -->
[lnk-helloworld-sample]: https://github.com/Azure/iot-edge/tree/master/samples/hello_world
[lnk-iot-edge]: https://github.com/Azure/iot-edge
[lnk-edge-concepts]: ../articles/iot-hub/iot-hub-iot-edge-overview.md