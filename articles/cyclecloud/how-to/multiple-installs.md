---
title: Run Multiple Installs on the Same Machine
description: How to install multiple instances of Azure CycleCloud on the same machine.
author: adriankjohnson
ms.date: 02/29/2020
ms.author: adjohnso
---

# Installing Multiple Instances of CycleCloud on the Same Machine

Running multiple instances of CycleCloud on the same machine is supported, but requires some slight
modifications to the configuration files before starting CycleCloud for the first time.
During the install step, make sure to use the `--nostart` flag to keep the server from starting,
and the `--installdir` flag to specify an alternate install directory. For example:

``` script
/install.sh --nostart --installdir /mnt/second_cycle_server
```

After the installer finishes, edit `$CS_HOME/config/cycle_server.properties` and change the
following port numbers to an unused port (incrementing each default port number by one usually works well):

``` properties
commandPort=6400
webServerPort=8080
webServerSslPort=8443
tomcat.shutdownPort=8007
brokerPort=5672
brokerJmxPort=9099
url=jdbc:derby://localhost:1527/cycle_server
```

Next, edit `$CS_HOME/data/derby.properties` and modify `derby.drda.portNumber`
so that it matches the port specified in the `url=` line of cycle_server.properties.

Finally, copy _/etc/init.d/cycle_server_ to a new file and edit the _CS_HOME_ path
to point to the new CycleServer install, then start CycleServer using the new init script.
