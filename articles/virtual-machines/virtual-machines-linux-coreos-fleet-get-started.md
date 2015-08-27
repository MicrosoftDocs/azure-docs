<properties
	pageTitle="Get Started with Fleet on CoreOS on Azure"
	description="Provides basic examples of using Fleet and Docker on a CoreOS Linux virtual machine on Azure."
	services="virtual-machines"
	documentationCenter=""
	authors="dlepow"
	manager="timlt"
	editor=""
	tags="azure-service-management"/>

<tags
	ms.service="virtual-machines"
	ms.devlang="multiple"
	ms.topic="article"
	ms.tgt_pltfrm="vm-linux"
	ms.workload="infrastructure-services"
	ms.date="08/03/2015"
	ms.author="danlep"/>

# Get Started with Fleet on CoreOS on Azure

This article gives you two quick examples of using [fleet](https://github.com/coreos/fleet) and [Docker](https://www.docker.com/) to run applications on a cluster of [CoreOS] virtual machines.

To use these examples, first set up a three-node CoreOS cluster as described in [How to Use CoreOS on Azure]. Having done that, you'll understand the very basic elements of CoreOS deployments and have a working cluster and client computer. We'll use exactly the same cluster name in these examples. Also, these examples assume you're using your local Linux host to run your **fleetctl** commands.




## <a id='simple'>Example 1: Hello World with Docker</a>

Here is a simple "Hello World" application that runs in a single Docker container. This uses the [busybox Docker Hub image].

On your Linux client computer, use your favorite text editor to create the following **systemd** unit file and name it `helloworld.service`. (For details about the syntax, see [Unit Files].)

```
[Unit]
Description=HelloWorld
After=docker.service
Requires=docker.service

[Service]

TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker kill busybox1
ExecStartPre=-/usr/bin/docker rm busybox1
ExecStartPre=/usr/bin/docker pull busybox
ExecStart=/usr/bin/docker run --name busybox1 busybox /bin/sh -c "while true; do echo Hello World; sleep 1; done"
ExecStop=/usr/bin/docker stop busybox1

```

Now connect to the CoreOS cluster and start the unit by running the following **fleetctl** command. The output shows that the unit is started and where it's located.


```
fleetctl --tunnel coreos-cluster.cloudapp.net:22 start helloworld.service


Unit helloworld.service launched on 62f0f66e.../100.79.86.62
```

>[AZURE.NOTE] To run your remote **fleetctl** commands without the **--tunnel** parameter, optionally set the FLEETCTL_TUNNEL environment variable to tunnel the requests. For example: `export FLEETCTL_TUNNEL=coreos-cluster.cloudapp.net:22`.


You can connect to the container to see the output of the service:

```
fleetctl --tunnel coreos-cloudapp.cluster.net:22 journal helloworld.service

Mar 04 21:29:26 node-1 docker[57876]: Hello World
Mar 04 21:29:27 node-1 docker[57876]: Hello World
Mar 04 21:29:28 node-1 docker[57876]: Hello World
Mar 04 21:29:29 node-1 docker[57876]: Hello World
Mar 04 21:29:30 node-1 docker[57876]: Hello World
Mar 04 21:29:31 node-1 docker[57876]: Hello World
Mar 04 21:29:32 node-1 docker[57876]: Hello World
Mar 04 21:29:33 node-1 docker[57876]: Hello World
Mar 04 21:29:34 node-1 docker[57876]: Hello World
Mar 04 21:29:35 node-1 docker[57876]: Hello World
```

To clean up, stop and unload the unit.

```
fleetctl --tunnel coreos-cluster.cloudapp.net:22 stop helloworld.service
fleetctl --tunnel coreos-cluster.cloudapp.net:22 unload helloworld.service
```


## <a id='highavail'>Example 2: Highly available Apache server</a>

One advantage of using CoreOS, Docker, and **fleet** is that it's easy to run services in a highly available manner. In this example you'll deploy a service that consists of three identical containers running the Apache web server. The containers will run on the three VMs in the cluster. This example is similar to one in [Launching containers with fleet] and uses the [CoreOS Apache Docker Hub image].

>[AZURE.IMPORTANT] To run the highly available Apache server, you'll need to configure a load-balanced HTTP endpoint on the virtual machines (public port 80, private port 80). You can do this after creating the CoreOS cluster, using the Azure portal or **azure vm endpoint** command. See [Configure a load-balanced set] for more information.

On your client computer, use your favorite text editor to create a **systemd** template unit file, named apache@.service. You'll use that template to launch three separate instances, named apache@1.service, apache@2.service, and apache@3.service:

```
[Unit]
Description=High Availability Apache
After=docker.service
Requires=docker.service

[Service]
TimeoutStartSec=0
ExecStartPre=-/usr/bin/docker kill apache1
ExecStartPre=-/usr/bin/docker rm apache1
ExecStartPre=/usr/bin/docker pull coreos/apache
ExecStart=/usr/bin/docker run -rm --name apache1 -p 80:80 coreos/apache /usr/sbin/apache2ctl -D FOREGROUND
ExecStop=/usr/bin/docker stop apache1

[X-Fleet]
X-Conflicts=apache@*.service
```

>[AZURE.NOTE] The `X-Conflicts` attribute tells CoreOS that only one instance of this container can be run on a given CoreOS host. For details see [Unit Files].

Now start the unit instances on the CoreOS cluster. You should see that they're running on three different machines:

```
fleetctl --tunnel coreos-cluster.cloudapp.net:22 start apache@{1,2,3}.service

unit apache@3.service launched on 00c927e4.../100.79.62.16
unit apache@1.\service launched on 62f0f66e.../100.79.86.62
unit apache@2.service launched on df85f2d1.../100.78.126.15

```
To reach the Apache server running on one of the units, send a simple request to the cloud service hosting the CoreOS cluster.

`curl http://coreos-cluster.cloudapp.net`

You'll see default text returned from the Apache server similar to:

```
\<html>\<body\>\<h1\>It works!\</h1\>
\<p\>This is the default web page for this server.\</p\>
\<p\>The web server software is running but no content has been added, yet.\</p\>
\</body\>\</html\>
```

You can try shutting down one or more virtual machines in your cluster to verify that the Apache service continues to run.

When done, stop and unload units.

```
fleetctl --tunnel coreos-cluster.cloudapp.net:22 stop apache@{1,2,3}.service
fleetctl --tunnel coreos-cluster.cloudapp.net:22 unload apache@{1,2,3}.service

```

## Next steps

* You can try doing more with your three-node CoreOS cluster on Azure. Explore how to create more complex clusters and use Docker and create more interesting applications by reading [Tim Park's CoreOS Tutorial], [Patrick Chanezon's CoreOS Tutorial], [Docker] documentation, and the [CoreOS Overview].

* To get started with Fleet and CoreOS in Azure Resource Manager, try this [quickstart template](https://azure.microsoft.com/documentation/templates/coreos-with-fleet-multivm/).

* See [Linux and Open-Source Computing on Azure] for more on using open-source environments on Linux VMs in Azure.

<!--Link references-->
[Azure Command-Line Interface (Azure)]: ../xplat-cli.md
[CoreOS]: https://coreos.com/
[CoreOS Overview]: https://coreos.com/using-coreos/
[CoreOS with Azure]: https://coreos.com/docs/running-coreos/cloud-providers/azure/
[Tim Park's CoreOS Tutorial]: https://github.com/timfpark/coreos-azure
[Patrick Chanezon's CoreOS Tutorial]: https://github.com/chanezon/azure-linux/tree/master/coreos/cloud-init
[Docker]: http://docker.io
[YAML]: http://yaml.org/
[How to Use CoreOS on Azure]: virtual-machines-linux-coreos-how-to.md
[Configure a load-balanced set]: ../load-balancer/load-balancer-internet-getstarted.md
[Launching containers with fleet]: https://coreos.com/docs/launching-containers/launching/launching-containers-fleet/
[Unit Files]: https://coreos.com/docs/launching-containers/launching/fleet-unit-files/
[busybox Docker Hub image]: https://registry.hub.docker.com/_/busybox/
[CoreOS Apache Docker Hub image]: https://registry.hub.docker.com/u/coreos/apache/
[Linux and Open-Source Computing on Azure]: virtual-machines-linux-opensource.md
