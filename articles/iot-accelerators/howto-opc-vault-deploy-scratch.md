---
title: How to deploy OPC Vault module from scratch - Azure | Microsoft Docs
description: How to deploy OPC Vault from scratch.
author: dominicbetts
ms.author: dobett
ms.date: 11/26/2018
ms.topic: conceptual
ms.service: industrial-iot
services: iot-industrialiot
manager: philmea
---

# Deploy OPC Vault from scratch

OPC Vault is a microservice that can configure, register, and manage certificate lifecycle for OPC UA server and client applications in the cloud. This article shows you how to deploy OPC Vault from scratch.

## Configuration and environment variables

The service configuration is stored using ASP.NET Core configuration
adapters, in appsettings.ini. The INI
format allows to store values in a readable format, with comments.
The application also supports inserting environment variables, such as
credentials and networking details. (This section is originally titled TODO Configuration and Environment variables).

The configuration file in the repository references some environment
variables that need to created at least once. Depending on your OS and
the IDE, there are several ways to manage environment variables:

- For Windows users, the env-vars-setup.cmd script needs to be prepared and executed just once. When executed, the settings will persist across terminal sessions and reboots.

- For Linux and OSX environments, the env-vars-setup script needs to be executed every time a new console is opened. Depending on the OS and terminal, there are ways to persist values globally, for more information these pages should help:

  - https://stackoverflow.com/questions/13046624/how-to-permanently-export-a-variable-in-linux
  
  - https://stackoverflow.com/questions/135688/setting-environment-variables-in-os-x
  
  - https://help.ubuntu.com/community/EnvironmentVariables
  

- Visual Studio: Environment variables can be set also from Visual Studio, under Project Properties, in the left pane select "Configuration Properties" and "Environment" to get to a section where you can add multiple variables.

- IntelliJ Rider: Environment variables can be set in each Run Configuration, similarly to IntelliJ IDEA https://www.jetbrains.com/help/idea/run-debug-configuration-application.html

## Run and debug with Visual Studio

Visual Studio lets you quickly open the application without using a command
prompt, without configuring anything outside of the IDE.

To run and debug the application using Visual Studio:

1. Open the solution using the `iot-opc-gds-service.sln` file.

1. When the solution is loaded, right-click on the `WebService` project, select, and go to the `Debug` section.

1. In the same section, define the environment variables required.

1. Press **F5**, or the **Run** icon. Visual Studio should open your browser showing the service status in JSON format.

## Run and debug with IntelliJ Rider

1. Open the solution using the `iot-opc-gds-service.sln` file.

1. When the solution is loaded, go to `Run > Edit Configurations` and create a new `.NET Project` configuration.

1. In the configuration, select the WebService project.

1. Save the settings and run the configuration that's created from the IDE
   toolbar.

1. You should see the service bootstrap messages in IntelliJ Run window with details such as the URL where the web service is running plus the service logs.

## Build and run from the command line

The scripts folder contains some scripts for the frequent tasks:

- `build`: Compile all the projects and run the tests.

- `compile`: Compile all the projects.

- `run`: Compile the projects and run the service, which prompts for elevated privileges in Windows to run the web service.

The scripts check for the environment variables setup. You can set the environment variables globally in your OS, or use the "env-vars-setup" script in the scripts folder.

### Sandbox

The scripts assume that you configured your development environment with .NET Core and Docker. You can avoid installing .NET Core, and install only Docker and use the command-line parameter `--in-sandbox` (or the short form `-s`), for example:

- `build --in-sandbox`: Executes the build task inside of a Docker
    container (short form `build -s`).

- `compile --in-sandbox`: Executes the compilation task inside of a Docker container (short form `compile -s`).

- `run --in-sandbox`: Starts the service inside of a Docker container (short form `run -s`).

The Docker images used for the sandbox are hosted on Docker Hub
[here](https://hub.docker.com/r/azureiotpcs/code-builder-dotnet).

## Package the application to a Docker image

The `scripts` folder includes a docker subfolder with the
files required to package the service into a Docker image:

- `Dockerfile`: Docker images specifications.
- `build`: Build a Docker container and store the image in the local registry.
- `run`: Run the Docker container from the image stored in the local registry.
- `content`: A folder with files copied into the image, including the entry
  point script.

## Azure IoT Hub setup

To use the microservice, set up your Azure IoT Hub for development and integration tests.

The project includes some Bash scripts to help you with this setup:

- Create new IoT Hub: `./scripts/iothub/create-hub.sh`

- List existing hubs: `./scripts/iothub/list-hubs.sh`

- Show IoT Hub details (for example, keys): `./scripts/iothub/show-hub.sh`

And in case you had multiple Azure subscriptions:

- Show subscriptions list: `./scripts/iothub/list-subscriptions.sh`

- Change current subscription: `./scripts/iothub/select-subscription.sh`

## Development setup

### .NET setup

The project workflow is managed via [.NET Core](https://dotnet.github.io)
1.x, which you need to install in your environment, so that you can run
all the scripts and ensure that your IDE works as expected.

We also provide a [Java version](https://github.com/Azure/iot-opc-gds-service-dotnet)
of this project and other Azure IoT PCS components.

### IDE

Here are some of the IDEs that you can use to work on Azure IoT PCS:

- [Visual Studio](https://www.visualstudio.com)
- [Visual Studio for Mac](https://www.visualstudio.com/vs/visual-studio-mac)
- [IntelliJ Rider](https://www.jetbrains.com/rider)
- [Visual Studio Code](https://code.visualstudio.com)

### Git setup

The project includes a Git hook, to automate some checks before accepting a code change. You can run the tests manually, or let the CI platform to run the tests. We use the following Git hook to automatically run all the tests before sending code changes to GitHub and speed up the development workflow.

If at any point you want to remove the hook, simply delete the file installed under `.git/hooks`. You can also bypass the pre-commit hook using the `--no-verify` option.

#### Pre-commit hook with sandbox

To set up the included hooks, open a Windows/Linux/MacOS console and execute:

```
cd PROJECT-FOLDER
cd scripts/git
setup --with-sandbox
```

With this configuration, when checking in files, Git verifies that the application passes all the tests, run the build and the tests inside of a Docker container that is configured with all the development requirements.

#### Pre-commit hook without sandbox

> [!NOTE] 
> The hook without sandbox requires [.NET Core](https://dotnet.github.io) in the system PATH.

To set up the included hooks, open a Windows/Linux/MacOS console and execute:

```
cd PROJECT-FOLDER
cd scripts/git
setup --no-sandbox
```
With this configuration, when checking in files, Git verifies that the application passes all the tests, run the build and the tests in your workstation using the tools installed in your OS.

Guidance on the project code style:

- Where reasonable, lines length is limited to 80 chars max to help code reviews and command-line editors.

- Code blocks indentation with four spaces. The tab char should be avoided.

- Text files use Unix end of line format (LF).

- Dependency Injection is managed with [Autofac](https://autofac.org).

- Web service APIs fields are CamelCased except for metadata.

## Next steps

Now that you have learned how to deploy OPC Vault from scratch, here is the suggested next step:

> [!div class="nextstepaction"]
> [Deploy OPC Twin from scratch](howto-opc-twin-deploy-modules.md)