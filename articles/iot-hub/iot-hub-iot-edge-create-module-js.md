---
title: Creating Azure IoT Edge Module with NODEJS | Microsoft Docs
description: This tutorial showcases how to write a BLE data converter module using the latest Azure IoT Edge NPM packages and Yeoman generator.
services: iot-hub
author: sushi
manager: xiaozha

ms.service: iot-hub
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: js
ms.topic: article
ms.date: 06/28/2017
ms.author: sushi
---
# Creating Azure IoT Edge Module with NODEJS

## Overview

This tutorial showcases how to create a module for Azure IoT Edge in JS.

In this tutorial, we walk through environment setup and how to write a [BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) data converter module using the latest Azure IoT Edge NPM packages.

## Prerequisites

In this section, you set up your environment for IoT Edge module development. It applies to both *64-bit Windows* and *64-bit Linux (Ubuntu 14+)* operating systems.

The following software is required:
1. [Git Client](https://git-scm.com/downloads).
2. [Node LTS](https://nodejs.org).
3. `npm install -g yo`.
4. `npm install -g generator-az-iot-gw-module`

## Architecture

The Azure IoT Edge platform heavily adopts the [Von Neumann architecture](https://en.wikipedia.org/wiki/Von_Neumann_architecture). Which means that the entire Azure IoT Edge architecture is a system that processes input and produces output; and that each individual module is also a tiny input-output subsystem. In this tutorial, we introduce the following two modules:

1. A module that receives a simulated [BLE](https://en.wikipedia.org/wiki/Bluetooth_Low_Energy) signal and converts it into a formatted [JSON](https://en.wikipedia.org/wiki/JSON) message.
2. A module that prints the received [JSON](https://en.wikipedia.org/wiki/JSON) message.

The following image displays the typical end to end dataflow for this project:

![Dataflow between three modules](media/iot-hub-iot-edge-create-module/dataflow.png "Input: Simulated BLE Module; Processor: Converter Module; Output: Printer Module")

## Step-by-step
Below we show you how to quickly set up environment to start to write your first BLE converter module with JS.

### Create module project
1. Open a command-line window, run `yo az-iot-gw-module`.
2. Follow the steps on the screen to finish the initialization of your module project.

### Project structure
A JS module project consists of the following components:

`modules` - The customized JS module source files. Replace the default `sensor.js` and `printer.js` with your own module files.

`app.js` - The entry file to start the Edge instance.

`gw.config.json` - The configuration file to customize the modules to be loaded by Edge.

`package.json` - The metadata information for module project.

`README.md` - The basic documentation for module project.


### Package File

This `package.json` declares all the metadata information needed by a module project that includes the name, version, entry, scripts, runtime, and development dependencies.

Following code snippet shows how to configure for BLE converter sample project.
```json
{
  "name": "converter",
  "version": "1.0.0",
  "description": "BLE data converter sample for Azure IoT Edge.",
  "repository": {
    "type": "git",
    "url": "https://github.com/Azure-Samples/iot-edge-samples"
  },
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "author": "Microsoft Corporation",
  "license": "MIT",
  "dependencies": {
  },
  "devDependencies": {
    "azure-iot-gateway": "~1.1.3"
  }
}
```


### Entry File
The `app.js` defines the way to initialize the edge instance. Here we don't need to make any change.

```javascript
(function() {
  'use strict';

  const Gateway = require('azure-iot-gateway');
  let config_path = './gw.config.json';

  // node app.js
  if (process.argv.length < 2) {
    throw 'Calling pattern should be node app.js.';
  }

  const gw = new Gateway(config_path);
  gw.run();
})();
```

### Interface of Module
You can treat an Azure IoT Edge module as a data processor whose job is to: receive input, process it, and produce output.

The input might be data from hardware (like a motion detector), a message from other modules, or anything else (like a random number generated periodically by a timer).

The output is similar to the input, it could trigger hardware behavior (like the blinking LED), a message to other modules, or anything else (like printing to the console).

Modules communicate with each other using `message` object. The **content** of a `message` is a byte array that is capable of representing any kind of data you like. **properties** are also available in the `message` and are simply a string-to-string mapping. You may think of **properties** as the headers in an HTTP request, or the metadata of a file.

In order to develop an Azure IoT Edge module in JS, you need to create a new module object that implements the required methods `receive()`. At this point, you may also choose to implement the optional `create()` or `start()`, or `destroy()` methods as well. The following code snippet shows you the scaffolding of JS module object.

```javascript
'use strict';

module.exports = {
  broker: null,
  configuration: null,

  create: function (broker, configuration) {
    // Default implementation.
    this.broker = broker;
    this.configuration = configuration;

    return true;
  },

  start: function () {
    // Produce
  },

  receive: function (message) {
    // Consume
  },

  destroy: function () {
  }
};
```

### Converter Module
| Input                    | Processor                              | Output                 | Source File            |
| ------------------------ | -------------------------------------- | ---------------------- | ---------------------- |
| Temperature data message | Parse and construct a new JSON message | Structure JSON message | `converter.js` |

This module is a typical Azure IoT Edge module. It accepts temperature messages from other modules (a hardware module, or in this case our simulated BLE module); and then normalizes the temperature message in to a structured JSON message (including appending the message ID, setting the property of whether we need to trigger the temperature alert, and so on).

```javascript
receive: function (message) {
  // Initialize the messageCount in global object at first time.
  if (!global.messageCount) {
    global.messageCount = 0;
  }

  // Read the content and properties objects from message.
  let rawContent = JSON.parse(Buffer.from(message.content).toString('utf8'));
  let rawProperties = message.properties;

  // Generate new properties object.
  let newProperties = {
    source: rawProperties.source,
    macAddress: rawProperties.macAddress,
    temperatureAlert: rawContent.temperature > 30 ? 'true' : 'false'
  };

  // Generate new content object.
  let newContent = {
    deviceId: 'Intel NUC Gateway',
    messageId: ++global.messageCount,
    temperature: rawContent.temperature
  };

  // Publish the new message to broker.
  this.broker.publish(
    {
      properties: newProperties,
      content: new Uint8Array(Buffer.from(JSON.stringify(newContent), 'utf8'))
    }
  );
},
```

### Printer Module
| Input                          | Processor | Output                     | Source File          |
| ------------------------------ | --------- | -------------------------- | -------------------- |
| Any message from other modules | N/A       | Log the message to console | `printer.js` |

This module is simple, self-explanatory, which outputs the received messages(property, content) to the terminal window.

```javascript
receive: function (message) {
  let properties = JSON.stringify(message.properties);
  let content = Buffer.from(message.content).toString('utf8');

  console.log(`printer.receive.properties - ${properties}`);
  console.log(`printer.receive.content - ${content}\n`);
}
```

### Configuration
The final step before running the modules is to configure the Azure IoT Edge and to establish the connections between modules.

First we need to declare our `node` loader (since Azure IoT Edge supports loaders of different languages) which could be referenced by its `name` in the sections afterward.

```json
"loaders": [
  {
    "type": "node",
    "name": "node"
  }
]
```

Once we have declared our loaders, we also need to declare our modules as well. Similar to declaring the loaders, they can also be referenced by their `name` attribute. When declaring a module, we need to specify the loader it should use (which should be the one we defined before) and the entry-point (should be the normalized class name of our module) for each module. The `simulated_device` module is a native module that is included in the Azure IoT Edge core runtime package. Include `args` in the JSON file even if it is `null`.

```json
"modules": [
  {
    "name": "simulated_device",
    "loader": {
      "name": "native",
      "entrypoint": {
        "module.path": "simulated_device"
      }
    },
    "args": {
      "macAddress": "01:02:03:03:02:01",
      "messagePeriod": 500
    }
  },
  {
    "name": "converter",
    "loader": {
      "name": "node",
      "entrypoint": {
        "main.path": "modules/converter.js"
      }
    },
    "args": null
  },
  {
    "name": "printer",
    "loader": {
      "name": "node",
      "entrypoint": {
        "main.path": "modules/printer.js"
      }
    },
    "args": null
  }
]
```

At the end of the configuration, we establish the connections. Each connection is expressed by `source` and `sink`. They should both reference a pre-defined module. The output message of `source` module is forwarded to the input of `sink` module.

```json
"links": [
  {
    "source": "simulated_device",
    "sink": "converter"
  },
  {
    "source": "converter",
    "sink": "printer"
  }
]
```

## Running the Modules
1. `npm install`
2. `npm start`

If you want to terminate the application, press `<Enter>` key.

> ⚠ It is not recommended to use Ctrl + C to terminate the IoT Edge application. As this way may cause the process to terminate abnormally.
