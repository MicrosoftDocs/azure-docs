<properties
   pageTitle="Install the DC/OS CLI | Microsoft Azure"
   description="Install the DC/OS CLI."
   services="container-service"
   documentationCenter=""
   authors="rgardler"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Containers, Micro-services, DC/OS, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/10/2016"
   ms.author="rogardle"/>

>[AZURE.NOTE] This is for working with DC/OS-based ACS clusters. There is no need to do this for Swarm-based ACS clusters.

First, [connect to your DC/OS-based ACS cluster](../articles/container-service/container-service-connect.md). Once you have done this, you can install the DC/OS CLI on your client machine with the commands below:

```bash
sudo pip install virtualenv
mkdir dcos && cd dcos
wget https://raw.githubusercontent.com/mesosphere/dcos-cli/master/bin/install/install-optout-dcos-cli.sh
chmod +x install-optout-dcos-cli.sh
./install-optout-dcos-cli.sh . http://localhost --add-path yes
```

If you are using an old version of Python, you may notice some "InsecurePlatformWarnings". You can safely ignore these.

In order to get started without restarting your shell, run:

```bash
source ~/.bashrc
```

This step will not be necessary when you start new shells.

Now you can confirm that the CLI is installed:

```bash
dcos --help
```