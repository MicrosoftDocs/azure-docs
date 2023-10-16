---
title: Get started with Azure Service Fabric CLI 
description: Learn how to use the Azure Service Fabric CLI. Learn how to connect to a cluster and how to manage applications.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-python
services: service-fabric
ms.date: 07/14/2022
---

# Azure Service Fabric CLI

The Azure Service Fabric command-line interface (CLI) is a command-line utility for interacting with and managing Service Fabric entities. The Service Fabric CLI can be used with either Windows or Linux clusters. The Service Fabric CLI runs on any platform where Python is supported.

[!INCLUDE [links to azure cli and service fabric cli](../../includes/service-fabric-sfctl.md)]

## Prerequisites

Prior to installation, make sure your environment has both Python and pip installed. For more information, see the [pip quickstart documentation](https://pip.pypa.io/en/latest/quickstart/) and the official [Python installation documentation](https://wiki.python.org/moin/BeginnersGuide/Download).

The CLI supports Python versions 2.7 and 3.6+, with Python 3.x recommended.

### Service Fabric target runtime

The Service Fabric CLI is meant to support the latest runtime version of the Service Fabric SDK. Use the following table to determine which version of CLI to install:

| CLI version   | supported runtime version |
|---------------|---------------------------|
| Latest (~=10) | Latest (~=7.1)            |
| 9.0.0         | 7.1                       |
| 8.0.0         | 6.5                       |
| 7.1.0         | 6.4                       |
| 6.0.0         | 6.3                       |
| 5.0.0         | 6.2                       |
| 4.0.0         | 6.1                       |
| 3.0.0         | 6.0                       |
| 1.1.0         | 5.6, 5.7                  |

You can optionally specify a target version of the CLI to install by suffixing the `pip install` command with `==<version>`. For example, for version 1.1.0 the syntax would be:

```shell
pip install -I sfctl==1.1.0
```

Replace the following `pip install` command with the previously mentioned command when necessary.

For more information on Service Fabric CLI releases, see the [GitHub documentation](https://github.com/Azure/service-fabric-cli/releases).

## Install pip, Python, and the Service Fabric CLI

There are many ways to install pip and Python on your platform. Here are some steps to get major operating systems set up quickly with Python 3 and pip.

### Windows

For Windows 10, Windows Server 2016, and Windows Server 2012 R2, use the standard official installation instructions. The Python installer also installs pip by default.

1. Go to the official [Python downloads page](https://www.python.org/downloads/), and download the latest release of Python 3.x.

2. Start the installer.

3. At the bottom of the prompt, select **Add Python 3.x to PATH**.

4. Select **Install Now**, and finish the installation.

Now you can open a new command window and get the version of both Python and pip.

```shell
python --version
pip --version
```

Then run the following command to install the Azure Service Fabric CLI (sfctl) and view the CLI help page:

```shell
pip install sfctl
sfctl -h
```

### Ubuntu and Windows subsystem for Linux

To install the Service Fabric CLI, run the following commands:

```bash
sudo apt-get install python3
sudo apt-get install python3-pip
pip3 install sfctl
```

Then you can test the installation with:

```bash
sfctl -h
```

If you receive a command not found error such as:

`sfctl: command not found`

Be sure that `~/.local/bin` is accessible from the `$PATH`:

```bash
export PATH=$PATH:~/.local/bin
echo "export PATH=$PATH:~/.local/bin" >> .shellrc
```

If the installation on Windows subsystem for Linux fails with incorrect folder permissions, it may be necessary to try again with elevated permissions:

```bash
sudo pip3 install sfctl
```

### Red Hat Enterprise Linux 7.4 (Service Fabric preview support)

To install Service Fabric CLI on Red Hat, run the following commands:

```bash
sudo yum install -y python38
sudo yum install python38-setuptools
sudo easy_install-3.4 pip
sudo pip3 install sfctl
```

For testing the installation, you can refer to the steps mentioned in **Ubuntu and Windows subsystem for Linux** section

<a name = "cli-mac"></a>
### MacOS

For MacOS, we recommend that you use the [HomeBrew package manager](https://brew.sh). If HomeBrew is not already installed, install it by running the following command:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Then from the terminal, install the latest Python 3.x, pip, and the Service Fabric CLI by running the following commands:

```bash
brew install python3
pip3 install sfctl
sfctl -h
```

## CLI syntax

Commands are always prefixed with `sfctl`. For general information about all the commands you can use, use `sfctl -h`. For help with a single command, use `sfctl <command> -h`.

Commands follow a repeatable structure, with the target of the command preceding the verb or the action.

```shell
sfctl <object> <action>
```

In this example, `<object>` is the target for `<action>`.

## Select a cluster

Before you perform any operations, you must select a cluster to connect to. For example, to select and connect to the cluster with the name `testcluster.com`, run the following command:

> [!WARNING]
> Do not use unsecured Service Fabric clusters in a production environment.

```shell
sfctl cluster select --endpoint http://testcluster.com:19080
```

The cluster endpoint must be prefixed by `http` or `https`. It must include the port for the HTTP gateway. The port and address are the same as the Service Fabric Explorer URL.

For clusters that are secured with a certificate, you can specify a PEM-encoded certificate. The certificate can be specified as a single file or as a cert and a key pair. If it is a self-signed certificate that is not CA signed, you can pass the `--no-verify` option to bypass CA verification.

```shell
sfctl cluster select --endpoint https://testsecurecluster.com:19080 --pem ./client.pem --no-verify
```

For more information, see
[Connect to a secure Azure Service Fabric cluster](service-fabric-connect-to-secure-cluster.md).

## Basic operations

Cluster connection information persists across multiple Service Fabric CLI sessions. After you select a Service Fabric cluster, you can run any Service Fabric command on the cluster.

For example, to get the Service Fabric cluster health state, use the following command:

```shell
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

```shell
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

Similarly, to convert from a PEM file to a PFX file, you can use the following command (no password is being provided here):

```shell
openssl  pkcs12 -export -out Certificates.pfx -inkey Certificates.pem -in Certificates.pem -passout pass:'' 
```

For more information, see the [OpenSSL documentation](https://www.openssl.org/docs/).

### Connection problems

Some operations might generate the following message:

`Failed to establish a new connection`

Verify that the specified cluster endpoint is available and listening. Also, verify that the Service Fabric Explorer UI is available at that host and port. To update the endpoint, use `sfctl cluster select`.

### Detailed logs

Detailed logs often are helpful when you debug or report a problem. The `--debug` flag increases the verbosity of the output.

### Command help and syntax

For help with a specific command or a group of commands, use the `-h` flag.

```shell
sfctl application -h
```

Here is another example:

```shell
sfctl application create -h
```

## Updating the Service Fabric CLI 

To update the Service Fabric CLI, run the following commands (replace `pip` with `pip3` depending on what you chose during your original install):

```shell
pip uninstall sfctl
pip install sfctl
```

## Next steps

* [Deploy an application with the Azure Service Fabric CLI](service-fabric-application-lifecycle-sfctl.md)
* [Get started with Service Fabric on Linux](service-fabric-get-started-linux.md)
