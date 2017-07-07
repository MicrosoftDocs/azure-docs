## Prepare your Raspberry Pi

### Install Raspbian

If this is the first time you are using your Raspberry Pi, you need to install the Raspbian operating system using NOOBS on the SD card included in the kit. The [Raspberry Pi Software Guide][lnk-install-raspbian] describes how to install an operating system on your Raspberry Pi. This tutorial assumes you have installed the Raspbian operating system on your Raspberry Pi.

> [!NOTE]
> The SD card included in the [Microsoft Azure IoT Starter Kit for Raspberry Pi 3][lnk-starter-kits] already has NOOBS installed. You can boot the Raspberry Pi from this card and choose to install the Raspbian OS.

### Set up the hardware

This tutorial uses the BME280 sensor included in the [Microsoft Azure IoT Starter Kit for Raspberry Pi 3][lnk-starter-kits] to generate telemetry data. It uses an LED to indicate when the Raspberry Pi processes a method invocation from the solution dashboard.

The components on the bread board are:

- Red LED
- 220-Ohm resistor (red, red, brown)
- BME280 sensor

The following diagram shows how to connect your hardware:

![Hardware setup for Raspberry Pi][img-connection-diagram]

The following table summarizes the connections from the Raspberry Pi to the components on the breadboard:

| Raspberry Pi            | Breadboard             |Color         |
| ----------------------- | ---------------------- | ------------- |
| GND (Pin 14)            | LED -ve pin (18A)      | Purple          |
| GPCLK0 (Pin 7)          | Resistor (25A)         | Orange          |
| SPI_CE0 (Pin 24)        | CS (39A)               | Blue          |
| SPI_SCLK (Pin 23)       | SCK (36A)              | Yellow        |
| SPI_MISO (Pin 21)       | SDO (37A)              | White         |
| SPI_MOSI (Pin 19)       | SDI (38A)              | Green         |
| GND (Pin 6)             | GND (35A)              | Black         |
| 3.3 V (Pin 1)           | 3Vo (34A)              | Red           |

To complete the hardware setup, you need to:

- Connect your Raspberry Pi to the power supply included in the kit.
- Connect your Raspberry Pi to your network using the Ethernet cable included in your kit. Alternatively, you can set up [Wireless Connectivity][lnk-pi-wireless] for your Raspberry Pi.

You have now completed the hardware setup of your Raspberry Pi.

### Sign in and access the terminal

You have two options to access a terminal environment on your Raspberry Pi:

- If you have a keyboard and monitor connected to your Raspberry Pi, you can use the Raspbian GUI to access a terminal window.

- Access the command line on your Raspberry Pi using SSH from your desktop machine.

#### Use a terminal Window in the GUI

The default credentials for Raspbian are username **pi** and password **raspberry**. In the task bar in the GUI, you can launch the **Terminal** utility using the icon that looks like a monitor.

#### Sign in with SSH

You can use SSH for command-line access to your Raspberry Pi. The article [SSH (Secure Shell)][lnk-pi-ssh] describes how to configure SSH on your Raspberry Pi, and how to connect from [Windows][lnk-ssh-windows] or [Linux & Mac OS][lnk-ssh-linux].

Sign in with username **pi** and password **raspberry**.

#### Optional: Share a folder on your Raspberry Pi

Optionally, you may want to share a folder on your Raspberry Pi with your desktop environment. Sharing a folder enables you to use your preferred desktop text editor (such as [Visual Studio Code](https://code.visualstudio.com/) or [Sublime Text](http://www.sublimetext.com/)) to edit files on your Raspberry Pi instead of using `nano` or `vi`.

To share a folder with Windows, configure a Samba server on the Raspberry Pi. Alternatively, use the built-in [SFTP](https://www.raspberrypi.org/documentation/remote-access/) server with an SFTP client on your desktop.

### Enable SPI

Before you can run the sample application, you must enable the Serial Peripheral Interface (SPI) bus on the Raspberry Pi. The Raspberry Pi communicates with the BME280 sensor device over the SPI bus. Use the following command to edit the configuration file:

`sudo nano /boot/config.txt`

Find the line:

```
#dtparam=spi=on
```

- To uncomment the line, delete the `#` at the start.
- Save your changes (**Ctrl-O**, **Enter**) and exit the editor (**Ctrl-X**).
- To enable SPI, reboot the Raspberry Pi. Rebooting disconnects the terminal, you need to sign in again when the Raspberry Pi restarts:

  `sudo reboot`


[img-connection-diagram]: media/iot-suite-raspberry-pi-kit-prepare-pi/rpi2_remote_monitoring.png

[lnk-install-raspbian]: https://www.raspberrypi.org/learning/software-guide/quickstart/
[lnk-pi-wireless]: https://www.raspberrypi.org/documentation/configuration/wireless/README.md
[lnk-pi-ssh]: https://www.raspberrypi.org/documentation/remote-access/ssh/README.md
[lnk-ssh-windows]: https://www.raspberrypi.org/documentation/remote-access/ssh/windows.md
[lnk-ssh-linux]: https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md
[lnk-starter-kits]: https://azure.microsoft.com/develop/iot/starter-kits/