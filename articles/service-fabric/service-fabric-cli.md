---
title: Get started with Azure Service Fabric CLI (sfctl)
description: Learn how to use the Azure Service Fabric CLI. Learn how to connect to a cluster, and how to manage applications.
services: service-fabric
author: samedder
manager: timlt

ms.service: service-fabric
ms.topic: get-started-article
ms.date: 08/22/2017
ms.author: edwardsa

---
# Azure Service Fabric command line

The Azure Service Fabric CLI (sfctl) is a command-line utility for interacting and managing Azure Service
Fabric entities. Sfctl can be used with either Windows or Linux clusters. Sfctl runs on any platform where
python is supported.

## Prerequisites

Prior to installation, make sure your environment has both python and pip installed. For more information,
take a look at the [pip quickstart documentation](https://pip.pypa.io/en/latest/quickstart/), and official
[python install documentation](https://wiki.python.org/moin/BeginnersGuide/Download).

While both python 2.7 and 3.6 are supported, it is recommended to use python 3.6. The following section goes
over how to install all the prerequisites and the CLI.

## Install pip, python, and sfctl

While there are many ways to install both pip and python on your platform, here are some steps to get set up quickly
with python 3.6 and pip for major OSes:

### Windows

For Windows 10, Server 2016, and Server 2012R2 you can use the standard official install instructions. The python
installer also installs pip by default.

- Navigate to the official [python downloads page](https://www.python.org/downloads/) and download the latest
release of python 3.6
- Launch the installer
- Select the option at the bottom of the prompt to `Add Python 3.6 to PATH`
- Select `Install Now`
- Complete the install

You should now be able to open a new command window and get the version of both python and pip:

```bat
python --version
pip --version
```

Then run the following to install the Service Fabric CLI

```
pip install sfctl
sfctl -h
```

### Ubuntu

For Ubuntu 16.04 Desktop, you can install python 3.6 using a third-party PPA:

From the terminal run the following commands:

```bash
sudo add-apt-repository ppa:jonathonf/python-3.6
sudo apt-get update
sudo apt-get install python3.6
sudo apt-get install python3-pip
```

Then, to install sfctl for just your installation of python 3.6 run the following command:

```bash
python3.6 -m pip install sfctl
sfctl -h
```

These steps do not affect the system installed python 3.5 and 2.7. Do not attempt to modify these installations,
unless you are familiar with Ubuntu.

### MacOS

For MacOS, it is recommended to use the [HomeBrew package manager](https://brew.sh). Install HomeBrew if it is not
already installed, by running the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Then from the terminal install python 3.6, pip and sfctl

```bash
brew install python3
pip3 install sfctl
sfctl -h
```

These steps do not modify the system installation of python 2.7.

## CLI syntax

Commands are prefixed always with `sfctl`. For general information about all commands you can use, use `sfctl -h`. For
help with a single command, use `sfctl <command> -h`.

Commands follow a repeatable structure, with the target of the command preceding the verb or action:

```azurecli
sfctl <object> <action>
```

In this example, `<object>` is the target for `<action>`.

## Select a cluster

Before you perform any operations, you must select a cluster to connect to. For example, run the following to select
and connect to the cluster with the name `testcluster.com`.

> [!WARNING]
> Do not use unsecured Service Fabric clusters in a production environment.

```azurecli
sfctl cluster select --endpoint http://testcluster.com:19080
```

The cluster endpoint must be prefixed by `http` or `https`. It must include the port for the HTTP gateway. The port and
address are the same as the Service Fabric Explorer URL.

For clusters that are secured with a certificate, you can specify a PEM encoded certificate. The certificate can be
specified as a single file or cert and key pair.

```azurecli
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem
```

For more information, see
[Connect to a secure Azure Service Fabric cluster](service-fabric-connect-to-secure-cluster.md).

## Basic operations

Cluster connection information persists across multiple sfctl sessions. After you select a Service Fabric cluster,
you can run any Service Fabric command on the cluster.

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

Some suggestions and tips for solving common issues.

### Convert a certificate from PFX to PEM format

The Service Fabric CLI supports client-side certificates as PEM (.pem extension) files. If you use PFX files from
Windows, you must convert those certificates to PEM format. To convert a PFX file to a PEM file, use the
following command:

```bash
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

For more information, see the [OpenSSL documentation](https://www.openssl.org/docs/).

### Connection issues

Some operations might generate the following message:

`Failed to establish a new connection: [Errno 8] nodename nor servname provided, or not known`

Verify that the specified cluster endpoint is available and listening. Also, verify that the Service Fabric Explorer
UI is available at that host and port. To update the endpoint, use `sfctl cluster select`.

### Detailed logs

Detailed logs often are helpful when you debug or report an issue. There is a global `--debug` flag that
increases the verbosity of log files.

### Command help and syntax

For help with a specific command or a group of commands, use the `-h` flag:

```azurecli
sfctl application -h
```

Another example:

```azurecli
sfctl application create -h
```

## Next steps

* [Deploy an application with the Azure Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md)
* [Get started with Service Fabric on Linux](service-fabric-get-started-linux.md)
