## Install the prerequisites

The steps in this tutorial assume you are running Ubuntu Linux.

Open a shell and run the following commands to install the prerequisite packages:

```bash
sudo apt-get update
sudo apt-get install curl build-essential libcurl4-openssl-dev git cmake libssl-dev uuid-dev valgrind libglib2.0-dev libtool autoconf
```

In the shell, run the following command to clone the Azure IoT Edge GitHub repository to your local machine:

```bash
git clone https://github.com/Azure/iot-edge.git
```

## How to build the sample

You can now build the IoT Edge runtime and samples on your local machine:

1. Open a shell.

1. Navigate to the root folder in your local copy of the **iot-edge** repository.

1. Run the build script as follows:

    ```sh
    tools/build.sh --disable-native-remote-modules
    ```

This script uses the **cmake** utility to create a folder called **build** in the root folder of your local copy of the **iot-edge** repository and generate a makefile. The script then builds the solution, skipping unit tests and end to end tests. If you want to build and run the unit tests, add the `--run-unittests` parameter. If you want to build and run the end to end tests, add the `--run-e2e-tests`.

> [!NOTE]
> Every time you run the **build.sh** script, it deletes and then recreates the **build** folder in the root folder of your local copy of the **iot-edge** repository.