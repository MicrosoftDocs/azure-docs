## Build IoT Edge

This tutorial uses custom IoT Edge modules to communicate with the remote monitoring preconfigured solution. Therefore, you need to build the IoT Edge modules from custom source code. The following sections describe how to install IoT Edge and build the custom IoT Edge module.

### Install IoT Edge

The following steps describe how to install the pre-compiled IoT Edge software on the Intel NUC:

1. Configure the required smart package repositories by running the following commands on the Intel NUC:

    ```bash
    smart channel --add IoT_Cloud type=rpm-md name="IoT_Cloud" baseurl=http://iotdk.intel.com/repos/iot-cloud/wrlinux7/rcpl13/ -y
    smart channel --add WR_Repo type=rpm-md baseurl=https://distro.windriver.com/release/idp-3-xt/public_feeds/WR-IDP-3-XT-Intel-Baytrail-public-repo/RCPL13/corei7_64/
    ```

    Enter `y` when the command prompts you to **Include this channel?**.

1. Update the smart package manager by running the following command:

    ```bash
    smart update
    ```

1. Install the Azure IoT Edge package by running the following command:

    ```bash
    smart config --set rpm-check-signatures=false
    smart install packagegroup-cloud-azure -y
    ```

1. Verify the installation by running the "Hello world" sample. This sample writes a hello world message to the log.txT file every five seconds. The following commands run the "Hello world" sample:

    ```bash
    cd /usr/share/azureiotgatewaysdk/samples/hello_world/
    ./hello_world hello_world.json
    ```

    Ignore any **invalid argument** messages when you stop the sample.

    Use the following command to view the contents of the log file:

    ```bash
    cat log.txt | more
    ```

### Troubleshooting

If you receive the error "No package provides util-linux-dev", try rebooting the Intel NUC.
