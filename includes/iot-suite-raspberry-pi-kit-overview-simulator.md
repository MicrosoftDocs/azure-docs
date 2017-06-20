## Overview

In this tutorial, you complete the following steps:

- Deploy an instance of the remote monitoring preconfigured solution to your Azure subscription. This step automatically deploys and configures multiple Azure services.
- Set up your device to communicate with your computer and the remote monitoring solution.
- Update the sample device code to connect to the remote monitoring solution, and send simulated telemetry that you can view on the solution dashboard.

## Prerequisites

To complete this tutorial, you need an active Azure subscription.

> [!NOTE]
> If you don’t have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial][lnk-free-trial].

### Required software

You need SSH client on your desktop machine to enable you to remotely access the command line on the Raspberry Pi.

- Windows does not include an SSH client. We recommend using [PuTTY](http://www.putty.org/).
- Most Linux distributions and Mac OS include the command-line SSH utility. For more information, see [SSH Using Linux or Mac OS](https://www.raspberrypi.org/documentation/remote-access/ssh/unix.md).

### Required hardware

A desktop computer to enable you to connect remotely to the command line on the Raspberry Pi.

[Microsoft IoT Starter Kit for Raspberry Pi 3][lnk-starter-kits] or equivalent components. This tutorial uses the following items from the kit:

- Raspberry Pi 3
- MicroSD Card (with NOOBS)
- A USB Mini cable
- An Ethernet cable

[lnk-starter-kits]: https://azure.microsoft.com/develop/iot/starter-kits/
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/