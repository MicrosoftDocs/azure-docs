---
title: Get started with Azure Service Fabric CLI 
description: Learn how to use the Azure Service Fabric CLI. Learn how to connect to a cluster and how to manage applications.
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: get-started-article
ms.date: 08/22/2017
ms.author: edwardsa

---
# Azure Service Fabric command line

The Azure Service Fabric command-line interface (CLI) is a command-line utility for interacting with and managing Service Fabric entities. The Service Fabric CLI can be used with either Windows or Linux clusters. The Service Fabric CLI runs on any platform where Python is supported.

## Prerequisites

Prior to installation, make sure your environment has both Python and pip installed. For more information, see the [pip quickstart documentation](https://pip.pypa.io/en/latest/quickstart/) and the official [Python installation documentation](https://wiki.python.org/moin/BeginnersGuide/Download).

Although both Python 2.7 and 3.6 are supported, we recommend that you use Python 3.6. The following section shows you how to install all the prerequisites and the CLI.

## Install pip, Python, and the Service Fabric CLI

 There are many ways to install pip and Python on your platform. Here are some steps to get major operating systems set up quickly with Python 3.6 and pip.

### Windows

For Windows 10, Windows Server 2016, and Windows Server 2012 R2, use the standard official installation instructions. The Python installer also installs pip by default.

1. Go to the official [Python downloads page](https://www.python.org/downloads/), and download the latest release of Python 3.6.

2. Start the installer.

3. At the bottom of the prompt, select **Add Python 3.6 to PATH**.

4. Select **Install Now**, and finish the installation.

Now you can open a new command window and get the version of both Python and pip.

```bat
python --version
pip --version
```

Then run the following command to install the Service Fabric CLI:

```
pip install sfctl
sfctl -h
```

### Ubuntu

For Ubuntu 16.04 Desktop, you can install Python 3.6 by using a third-party personal package archive (PPA).

From the terminal, run the following commands:

```bash
sudo add-apt-repository ppa:jonathonf/python-3.6
sudo apt-get update
sudo apt-get install python3.6
sudo apt-get install python3-pip
```

Then, to install the Service Fabric CLI for just your installation of Python 3.6, run the following command:
PP
```bash
python3.6 -m pip install sfctl
sfctl -h
```

These steps do not affect the system installation of Python 3.5 and 2.7. Don't attempt to modify these installations, unless you're familiar with Ubuntu.

### MacOS

For MacOS, we recommend that you use the [HomeBrew package manager](https://brew.sh). If HomeBrew is not already installed, install it by running the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Then from the terminal, install Python 3.6, pip, and the Service Fabric CLI by running the following commands:

```bash
brew install python3
pip3 install sfctl
sfctl -h
```

These steps do not modify the system installation of Python 2.7.

## CLI syntax

Commands are prefixed always with `sfctl`. For general information about all the commands you can use, use `sfctl -h`. For help with a single command, use `sfctl <command> -h`.

Commands follow a repeatable structure, with the target of the command preceding the verb or the action.

```azurecli
sfctl <object> <action>
```

In this example, `<object>` is the target for `<action>`.

## Select a cluster

Before you perform any operations, you must select a cluster to connect to. For example, to select and connect to the cluster with the name `testcluster.com`, run the following command:

> [!WARNING]
> Do not use unsecured Service Fabric clusters in a production environment.

```azurecli
sfctl cluster select --endpoint http://testcluster.com:19080
```

The cluster endpoint must be prefixed by `http` or `https`. It must include the port for the HTTP gateway. The port and address are the same as the Service Fabric Explorer URL.

For clusters that are secured with a certificate, you can specify a PEM-encoded certificate. The certificate can be specified as a single file or as a cert and a key pair.

```azurecli
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem
```

For more information, see
[Connect to a secure Azure Service Fabric cluster](service-fabric-connect-to-secure-cluster.md).

## Basic operations

Cluster connection information persists across multiple Service Fabric CLI sessions. After you select a Service Fabric cluster, you can run any Service Fabric command on the cluster.

For example, to get the Service Fabric cluster health state, use the following command:

```azurecli
sfctl cluster health
```

The command results in the following output:

```json
{
  "aggregatedHealthState": "Ok",
  "applicationHealthStates": [
    {
      "aggregatedHealthState": "Ok",
      "name": "fabric:/System"
    }
  ],
  "healthEvents": [],
  "nodeHealthStates": [
    {
      "aggregatedHealthState": "Ok",
      "id": {
        "id": "66aa824a642124089ee474b398d06a57"
      },
      "name": "_Test_0"
    }
  ],
  "unhealthyEvaluations": []
}
```

## Tips and troubleshooting

Here are some suggestions and tips for solving common problems.

### Convert a certificate from PFX to PEM format

The Service Fabric CLI supports client-side certificates as PEM (.pem extension) files. If you use PFX files from Windows, you must convert those certificates to PEM format. To convert a PFX file to a PEM file, use the following command:

```bash
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

For more information, see the [OpenSSL documentation](https://www.openssl.org/docs/).

### Connection problems

Some operations might generate the following message:

`Failed to establish a new connection: [Errno 8] nodename nor servname provided, or not known`

Verify that the specified cluster endpoint is available and listening. Also, verify that the Service Fabric Explorer UI is available at that host and port. To update the endpoint, use `sfctl cluster select`.

### Detailed logs

Detailed logs often are helpful when you debug or report a problem. A global `--debug` flag increases the verbosity of log files.

### Command help and syntax

For help with a specific command or a group of commands, use the `-h` flag.

```azurecli
sfctl application -h
```

Here's another example:

```azurecli
sfctl application create -h
```

## Next steps

* [Deploy an application with the Azure Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md)
* [Get started with Service Fabric on Linux](service-fabric-get-started-linux.md)
