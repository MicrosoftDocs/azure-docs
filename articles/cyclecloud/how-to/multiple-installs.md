---
title: Run Multiple Installs on the Same Machine
description: How to install multiple instances of Azure CycleCloud on the same machine.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---

# Installing multiple instances of CycleCloud on the same machine

You can run multiple instances of CycleCloud on the same machine. To set up multiple instances, you need to modify some configuration files before starting CycleCloud for the first time. During the installation, use the `--nostart` flag to prevent the server from starting, and use the `--installdir` flag to specify a different installation directory. For example:

``` script
/install.sh --nostart --installdir /mnt/second_cycle_server
```

After the installation completes, edit `$CS_HOME/config/cycle_server.properties` and change the following port numbers to unused ports. Usually, incrementing each default port number by one works well:

``` properties
commandPort=6400
webServerPort=8080
webServerSslPort=8443
tomcat.shutdownPort=8007
brokerPort=5672
brokerJmxPort=9099
url=jdbc:derby://localhost:1527/cycle_server
```

Next, edit `$CS_HOME/data/derby.properties` and change `derby.drda.portNumber` to match the port number in the `url=` line of `cycle_server.properties`.

Finally, copy _/etc/init.d/cycle_server_ to a new file and edit the _CS_HOME_ path
to point to the new CycleServer installation. Then, start CycleServer using the new init script.
