---
 title: include file
 description: include file
 services: iot-central
 author: dominicbetts
 ms.service: iot-central
 ms.topic: include
 ms.date: 04/09/2019
 ms.author: dobett
 ms.custom: include file
---
1. Use the `dps-keygen` command-line utility to generate a connection string:

    To install the [key generator utility](https://github.com/Azure/dps-keygen), run the following command:

    ```cmd/sh
    npm i -g dps-keygen
    ```

1. To generate a connection string, run the following command using the connection details you noted previously:

    ```cmd/sh
    dps-keygen -di:<Device ID> -dk:<Primary or Secondary Key> -si:<Scope ID>
    ```

1. Copy the connection string from the `dps-keygen` output to use in your device code.