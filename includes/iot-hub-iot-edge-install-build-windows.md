## Install the prerequisites

1. Install [Visual Studio 2015 or 2017](https://www.visualstudio.com). You can use the free Community Edition if you meet the licensing requirements. Be sure to include Visual C++ and NuGet Package Manager.

1. Install [git](http://www.git-scm.com) and make sure you can run git.exe from the command line.

1. Install [CMake](https://cmake.org/download/) and make sure you can run cmake.exe from the command line. CMake version 3.7.2 or later is recommended. The **.msi** installer is the easiest option on Windows. Add CMake to the PATH for at least the current user when the installer prompts you.

1. Install [Python 2.7](https://www.python.org/downloads/release/python-27). Make sure you add Python to your `PATH` environment variable in **Control Panel -> System -> Advanced system settings -> Environment Variables**.

1. At a command prompt, run the following command to clone the Azure IoT Edge GitHub repository to your local machine:

    ```cmd
    git clone https://github.com/Azure/iot-edge.git
    ```

## How to build the sample

You can now build the IoT Edge runtime and samples on your local machine:

1. Open a **Developer Command Prompt for VS 2015** or **Developer Command Prompt for VS 2017** command prompt.

1. Navigate to the root folder in your local copy of the **iot-edge** repository.

1. Run the build script as follows:

    ```cmd
    tools\build.cmd --disable-native-remote-modules
    ```

This script creates a Visual Studio solution file and builds the solution. You can find the Visual Studio solution in the **build** folder in your local copy of the **iot-edge** repository. If you want to build and run the unit tests, add the `--run-unittests` parameter. If you want to build and run the end to end tests, add the `--run-e2e-tests`.

> [!NOTE]
> Every time you run the **build.cmd** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **iot-edge** repository.