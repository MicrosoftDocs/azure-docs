# Lesson 5: Create your first gateway module and add it to the hello_world sample app

## What you will do

- Compile and run the hello_world sample app on Intel NUC.
- Create a module and compile it on Intel NUC.
- Add the new module to the hello_world sample app and then run the sample on Intel NUC. The new module prints out "hello_world" messages with a timestamp.

## What you will learn

- How to compile and run a sample app on Intel NUC.
- How to create a module.
- How to add module to a sample app.

## What you need

The Azure IoT Gateway SDK that has been installed on your host computer.

## Folder structure

In the Lesson 5 subfolder of the sample code which you cloned in lesson 1, there is a `module` folder and a `sample` folder.

![my_module](../articles/iot-hub/media/iot-hub-gateway-kit-lessons/lesson5/my_module.png)

- The `module/my_module` folder contains the source code and script to build the module.
- The `sample` folder contains the source code and script to build the sample app.

## Compile and run the hello_world sample app on Intel NUC

The `hello_world` sample creates a gateway based on the `hello_world.json` file which specifies the two predefined modules associated with the app. The gateway logs a "hello world" message to a file every 5 seconds. In this section, you compile and run the `hello_world` app with its default module.

To compile and run the `hello_world` app, follow these steps on your host computer:

1. Initialize the configuration files by running the following commands:

   ```bash
   cd iot-hub-c-intel-nuc-gateway-getting-started
   cd Lesson5
   npm install
   gulp init
   ```