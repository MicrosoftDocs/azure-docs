## Typical output

The following example shows the output written to the log file by the Hello World sample. The output is formatted for legibility:

```json
[{
    "time": "Mon Apr 11 13:48:07 2016",
    "content": "Log started"
}, {
    "time": "Mon Apr 11 13:48:48 2016",
    "properties": {
        "helloWorld": "from Azure IoT Gateway SDK simple sample!"
    },
    "content": "aGVsbG8gd29ybGQ="
}, {
    "time": "Mon Apr 11 13:48:55 2016",
    "properties": {
        "helloWorld": "from Azure IoT Gateway SDK simple sample!"
    },
    "content": "aGVsbG8gd29ybGQ="
}, {
    "time": "Mon Apr 11 13:49:01 2016",
    "properties": {
        "helloWorld": "from Azure IoT Gateway SDK simple sample!"
    },
    "content": "aGVsbG8gd29ybGQ="
}, {
    "time": "Mon Apr 11 13:49:04 2016",
    "content": "Log stopped"
}]
```

## Code snippets

This section discusses some key sections of the code in the hello\_world sample.

### IoT Edge gateway creation

You must implement a *gateway process*. This program creates the internal infrastructure (the broker), loads the IoT Edge modules, and configures the gateway process. IoT Edge provides the **Gateway\_Create\_From\_JSON** function to enable you to bootstrap a gateway from a JSON file. To use the **Gateway\_Create\_From\_JSON** function, pass it the path to a JSON file that specifies the IoT Edge modules to load.

You can find the code for the gateway process in the *Hello World* sample in the [main.c][lnk-main-c] file. For legibility, the following snippet shows an abbreviated version of the gateway process code. This example program creates a gateway and then waits for the user to press the **ENTER** key before it tears down the gateway.

```c
int main(int argc, char** argv)
{
    GATEWAY_HANDLE gateway;
    if ((gateway = Gateway_Create_From_JSON(argv[1])) == NULL)
    {
        printf("failed to create the gateway from JSON\n");
    }
    else
    {
        printf("gateway successfully created from JSON\n");
        printf("gateway shall run until ENTER is pressed\n");
        (void)getchar();
        Gateway_LL_Destroy(gateway);
    }
    return 0;
}
```

The JSON settings file contains a list of IoT Edge modules to load and the links between the modules. Each IoT Edge module must specify a:

* **name**: a unique name for the module.
* **loader**: a loader that knows how to load the desired module. Loaders are an extension point for loading different types of modules. IoT Edge provides loaders for use with modules written in native C, Node.js, Java, and .NET. The Hello World sample only uses the native C loader because all the modules in this sample are dynamic libraries written in C. For more information about how to use IoT Edge modules written in different languages, see the [Node.js](https://github.com/Azure/iot-edge/blob/master/samples/nodejs_simple_sample/), [Java](https://github.com/Azure/iot-edge/tree/master/samples/java_sample), or [.NET](https://github.com/Azure/iot-edge/tree/master/samples/dotnet_binding_sample) samples.
    * **name**: the name of the loader used to load the module.
    * **entrypoint**: the path to the library containing the module. On Linux this library is a .so file, on Windows this library is a .dll file. The entry point is specific to the type of loader being used. The Node.js loader entry point is a .js file. The Java loader entry point is a classpath and a class name. The .NET loader entry point is an assembly name and a class name.

* **args**: any configuration information the module needs.

The following code shows the JSON used to declare all the IoT Edge modules for the Hello World sample on Linux. Whether a module requires any arguments depends on the design of the module. In this example, the logger module takes an argument that is the path to the output file and the hello\_world module has no arguments.

```json
"modules" :
[
    {
        "name" : "logger",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "./modules/logger/liblogger.so"
        }
        },
        "args" : {"filename":"log.txt"}
    },
    {
        "name" : "hello_world",
        "loader": {
          "name": "native",
          "entrypoint": {
            "module.path": "./modules/hello_world/libhello_world.so"
        }
        },
        "args" : null
    }
]
```

The JSON file also contains the links between the modules that are passed to the broker. A link has two properties:

* **source**: a module name from the `modules` section, or `\*`.
* **sink**: a module name from the `modules` section.

Each link defines a message route and direction. Messages from the **source** module are delivered to the **sink** module. You can set the **source** module to `\*`, which indicates that the **sink** module receives messages from any module.

The following code shows the JSON used to configure links between the modules used in the hello\_world sample on Linux. Every message produced by the `hello_world` module is consumed by the `logger` module.

```json
"links":
[
    {
        "source": "hello_world",
        "sink": "logger"
    }
]
```

### Hello\_world module message publishing

You can find the code used by the hello\_world module to publish messages in the ['hello_world.c'][lnk-helloworld-c] file. The following snippet shows an amended version of the code with comments added and some error handling code removed for legibility:

```c
int helloWorldThread(void *param)
{
    // create data structures used in function.
    HELLOWORLD_HANDLE_DATA* handleData = param;
    MESSAGE_CONFIG msgConfig;
    MAP_HANDLE propertiesMap = Map_Create(NULL);

    // add a property named "helloWorld" with a value of "from Azure IoT
    // Gateway SDK simple sample!" to a set of message properties that
    // will be appended to the message before publishing it. 
    Map_AddOrUpdate(propertiesMap, "helloWorld", "from Azure IoT Gateway SDK simple sample!")

    // set the content for the message
    msgConfig.size = strlen(HELLOWORLD_MESSAGE);
    msgConfig.source = HELLOWORLD_MESSAGE;

    // set the properties for the message
    msgConfig.sourceProperties = propertiesMap;

    // create a message based on the msgConfig structure
    MESSAGE_HANDLE helloWorldMessage = Message_Create(&msgConfig);

    while (1)
    {
        if (handleData->stopThread)
        {
            (void)Unlock(handleData->lockHandle);
            break; /*gets out of the thread*/
        }
        else
        {
            // publish the message to the broker
            (void)Broker_Publish(handleData->brokerHandle, helloWorldMessage);
            (void)Unlock(handleData->lockHandle);
        }

        (void)ThreadAPI_Sleep(5000); /*every 5 seconds*/
    }

    Message_Destroy(helloWorldMessage);

    return 0;
}
```

### Hello\_world module message processing

The hello\_world module never processes messages that other IoT Edge modules publish to the broker. Therefore, the implementation of the message callback in the hello\_world module is a no-op function.

```c
static void HelloWorld_Receive(MODULE_HANDLE moduleHandle, MESSAGE_HANDLE messageHandle)
{
    /* No action, HelloWorld is not interested in any messages. */
}
```

### Logger module message publishing and processing

The logger module receives messages from the broker and writes them to a file. It never publishes any messages. Therefore, the code of the logger module never calls the **Broker_Publish** function.

The **Logger_Receive** function in the [logger.c][lnk-logger-c] file is the callback the broker invokes to deliver messages to the logger module. The following snippet shows an amended version with comments added and some error handling code removed for legibility:

```c
static void Logger_Receive(MODULE_HANDLE moduleHandle, MESSAGE_HANDLE messageHandle)
{

    time_t temp = time(NULL);
    struct tm* t = localtime(&temp);
    char timetemp[80] = { 0 };

    // Get the message properties from the message
    CONSTMAP_HANDLE originalProperties = Message_GetProperties(messageHandle); 
    MAP_HANDLE propertiesAsMap = ConstMap_CloneWriteable(originalProperties);

    // Convert the collection of properties into a JSON string
    STRING_HANDLE jsonProperties = Map_ToJSON(propertiesAsMap);

    //  base64 encode the message content
    const CONSTBUFFER * content = Message_GetContent(messageHandle);
    STRING_HANDLE contentAsJSON = Base64_Encode_Bytes(content->buffer, content->size);

    // Start the construction of the final string to be logged by adding
    // the timestamp
    STRING_HANDLE jsonToBeAppended = STRING_construct(",{\"time\":\"");
    STRING_concat(jsonToBeAppended, timetemp);

    // Add the message properties
    STRING_concat(jsonToBeAppended, "\",\"properties\":"); 
    STRING_concat_with_STRING(jsonToBeAppended, jsonProperties);

    // Add the content
    STRING_concat(jsonToBeAppended, ",\"content\":\"");
    STRING_concat_with_STRING(jsonToBeAppended, contentAsJSON);
    STRING_concat(jsonToBeAppended, "\"}]");

    // Write the formatted string
    LOGGER_HANDLE_DATA *handleData = (LOGGER_HANDLE_DATA *)moduleHandle;
    addJSONString(handleData->fout, STRING_c_str(jsonToBeAppended);
}
```

## Next steps

In this article, you ran a simple IoT Edge gateway that writes messages to a log file. To run a sample that sends messages to IoT Hub, see [IoT Edge – send device-to-cloud messages with a simulated device using Linux][lnk-gateway-simulated-linux] or [IoT Edge – send device-to-cloud messages with a simulated device using Windows][lnk-gateway-simulated-windows].


<!-- Links -->
[lnk-main-c]: https://github.com/Azure/iot-edge/blob/master/samples/hello_world/src/main.c
[lnk-helloworld-c]: https://github.com/Azure/iot-edge/blob/master/modules/hello_world/src/hello_world.c
[lnk-logger-c]: https://github.com/Azure/iot-edge/blob/master/modules/logger/src/logger.c
[lnk-iot-edge]: https://github.com/Azure/iot-edge/
[lnk-gateway-simulated-linux]: ../articles/iot-hub/iot-hub-linux-iot-edge-simulated-device.md
[lnk-gateway-simulated-windows]: ../articles/iot-hub/iot-hub-windows-iot-edge-simulated-device.md