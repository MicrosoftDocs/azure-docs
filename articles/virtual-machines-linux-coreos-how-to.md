<properties 
	pageTitle="How to Use CoreOS on Azure" 
	description="Describes CoreOS, how to create a CoreOS virtual machine on Azure, and its basic usage." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="squillace" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.tgt_pltfrm="vm-linux" 
	ms.workload="infrastructure-services" 
	ms.date="03/16/2015" 
	ms.author="rasquill"/>


<!--The next line, with one pound sign at the beginning, is the page title--> 
# How to Use CoreOS on Azure

This topic describes [CoreOS] and shows how to create a cluster of three CoreOS virtual machines on Azure as a quick start to understanding CoreOS. It uses the very basic elements of CoreOS deployments and examples from [CoreOS with Azure], [Tim Park's CoreOS Tutorial], and [Patrick Chanezon's CoreOS Tutorial] to demonstrate the absolute minimum requirements to both understand the basic structure of a CoreOS deployment and get a cluster of three virtual machines running successfully. 

## <a id='intro'>CoreOS, Clusters, and Linux Containers</a>

CoreOS is a lightweight version of Linux designed to support rapid creation of potentially very large clusters of VMs that use Linux containers as the only packaging mechanism, including [Docker] containers. CoreOS is intended to support:

+ a very high level of automation
+ easier and more consistent application deployment
+ scalability at the application level and system level

At a high level, the CoreOS features that support these goals are:

1. One package system: CoreOS runs only Linux container images that run in Linux containers for speed, uniformity, and ease of deployment
2. Operating system updates that are performed atomically so that operating systems are updated as a single entity and can be easily rolled back to a known state
3. Built-in [etcd](https://github.com/coreos/etcd) and [fleet](https://github.com/coreos/fleet) daemons (services) for dynamic VM and cluster communication and management

This is a very general description of CoreOS and its features. For more complete information about CoreOS, see the [CoreOS Overview].

## <a id='security'>Security Considerations</a>
Currently, CoreOS assumes that those who can SSH into the cluster have permission to manage it. The result is that without modification, CoreOS clusters are outstanding for test and development environments, but you should apply further security measures in any production environment. 

## <a id='usingcoreos'>How to use CoreOS on Azure</a>

This section describes how to create an Azure Cloud Service with three CoreOS virtual machines in it using the [Azure Cross-Platform Interface (xplat-cli)]. The basic steps are as follows:

1. Create the SSH certificates and keys to secure communication with the CoreOS virtual machine
2. Obtain your cluster's etcd id for intercommunication
3. Create a cloud-config file in [YAML] format
4. Use the xplat-cli to create a new Azure Cloud Service and three CoreOS VMs
5. Test your CoreOS cluster from an Azure VM
6. Test your CoreOS cluster from localhost 

### Create Public and Private Keys For Communication
 
Use the instructions in [How to Use SSH with Linux on Azure](virtual-machines-linux-use-ssh-key.md) to create a public and private key for SSH. (The basic steps are in the instructions below.) You are going to use these keys to connect to VMs in the cluster to verify that they are working and can communicate with each other.

> [AZURE.NOTE] This topic assumes that you do not have these keys, and requires you to create `myPrivateKey.pem` and `myCert.pem` files for clarity. If you already have a public and private key pair saved to `~/.ssh/id_rsa`, you can just type `openssl req -x509 -key ~/.ssh/id_rsa -nodes -days 365 -newkey rsa:2048 -out myCert.pem` to obtain the .pem file that you need to upload to Azure.

1. In a working directory, type `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout myPrivateKey.key -out myCert.pem` to create the private key and an the X.509 certificate associated with it. 

2. To assert that the private key's owner can read or write the file, type `chmod 600 myPrivateKey.key`. 

You should now have both a `myPrivateKey.key` and a `myCert.pem` file in your working directory. 


### Obtain your cluster's etcd id

CoreOS's `etcd` daemon requires a discovery id to query for all nodes in the cluster automatically. To retrieve your discovery id and save it to an `etcdid` file, type

```
curl https://discovery.etcd.io/new | grep ^http.* > etcdid
```

### Create a Create a cloud-config file

Still in the same working directory, create a file with your favorite text editor with the following text and save it as `cloud-config.yaml`. (You can save it as any file name you want, but when you create your VMs in the next step, you'll need to reference this file's name in your **--custom-data** option for the **azure create vm** command.)

> [AZURE.NOTE] Remember to type `cat etcdid` to retrieve the etcd discovery id from the `etcdid` file you created above and replace `<token>` in the following `cloud-config.yaml` file with the generated number from your `etcdid` file. If you are unable to validate your cluster at the end, this may be one of the steps you overlooked!

```
#cloud-config

coreos:
  etcd:
    # generate a new token for each unique cluster from https://discovery.etcd.io/new
    discovery: https://discovery.etcd.io/<token>
    # deployments across multiple cloud services will need to use $public_ipv4
    addr: $private_ipv4:4001
    peer-addr: $private_ipv4:7001
  units:
    - name: etcd.service
      command: start
    - name: fleet.service
      command: start
```

(For more complete information about the cloud-config file, see [Using Cloud-Config](https://coreos.com/docs/cluster-management/setup/cloudinit-cloud-config/) in the CoreOS documentation.)

### Use the xplat-cli to create a new CoreOS VM
<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->

1. Install the [Azure Cross-Platform Interface (xplat-cli)] if you have not already done so, and either login using a work or school ID, or download a .publishsettings file and import that into your account.
2. Locate your CoreOS image. To locate the images available at any time, type `azure vm image list | grep CoreOS` and you should see a list of results similar to:

	data:    2b171e93f07c4903bcad35bda10acf22__CoreOS-Stable-522.6.0              Public    Linux

3. Create a Cloud Service for your basic cluster by typing
`azure service create <cloud-service-name>` where *<cloud-service-name>* is the name for your CoreOS cloud service. This sample uses the name **`coreos-cluster`**; you will need to reuse the name that you choose to create your CoreOS VM instances inside the Cloud Service. 

One note: If you observe your work so far in the [portal](https://portal.azure.com), you'll find your Cloud Service name is both a resource group and domain, as the following image shows:

![][CloudServiceInNewPortal]  
4. Connect to your cloud service and create a new CoreOS vm inside by using the **azure vm create** command. You will pass the location of your X.509 certificate in the **--ssh-cert** option. Create your first VM image by typing the following, remembering to replace **coreos-cluster** with the cloud service name that you created:

```
azure vm create --custom-data=cloud-config.yaml --ssh=22 --ssh-cert=./myCert.pem --no-ssh-password --vm-name=node-1 --connect=coreos-cluster --location="West US" 2b171e93f07c4903bcad35bda10acf22__CoreOS-Stable-522.6.0 core
```

5. Create the second node by repeating the command in step 4, replacing the **--vm-name** value with **node-2** and the **--ssh** port value with 2022. 
 
6. Create the third node by repeating the command in step 4, replacing the **--vm-name** value with **node-3** and the **--ssh** port value with 3022. 
 
You can see from the shot below how the CoreOS cluster appears in the new portal.

![][EmptyCoreOSCluster]

### Test your CoreOS Cluster from an Azure VM

To test your cluster, make sure you are in your working directory and then connect to **node-1** using **ssh**, passing the private key by typing:

	ssh core@coreos-cluster.cloudapp.net -p 22 -i ./myPrivateKey.key

Once connected, type `sudo fleetctl list-machines` to see whether the cluster has already identified all VMs in the cluster. You should receive a response similar to the following:


	core@node-1 ~ $ sudo fleetctl list-machines
	MACHINE		IP		METADATA
	442e6cfb...	100.71.168.115	-
	a05e2d7c...	100.71.168.87	-
	f7de6717...	100.71.188.96	-


### Test your CoreOS Cluster from localhost

Finally, let's test your CoreOS cluster from your local Linux client by installing **fleet**. **fleet** requires **golang**, so you may need to install that first by typing:

`sudo apt-get install golang` 

Then clone the **fleet** repository from github by typing:

`git clone https://github.com/coreos/fleet.git`

Build **fleet** by changing to the `fleet` directory and typing

`./build`

And finally place **fleet** for easy use (depending upon your configuration you may or may not need to **sudo**):

`cp bin/fleetctl /usr/local/bin`

Make sure **fleet** has access to your `myPrivateKey.key` in the working directory by typing:

`ssh-add ./myPrivateKey.key`

> [AZURE.NOTE] If you are already using the **`~/.ssh/id_rsa`** key, then add that with `ssh-add ~/.ssh/id_rsa`.

Now you are ready to test remotely using the same **fleetctl** command you used from **node-1**, but passing some remote arguments:

`fleetctl --tunnel coreos-cluster.cloudapp.net:22 list-machines`

The results should be exactly the same:


	MACHINE		IP		METADATA
	442e6cfb...	100.71.168.115	-
	a05e2d7c...	100.71.168.87	-
	f7de6717...	100.71.188.96	-

## Next steps

You should now have a running three-node CoreOS cluster on Azure. From here, you can explore how to create more complex clusters and use Docker and create more interesting applications. To try a couple of quick examples, see [Get Started with Fleet on CoreOS on Azure].

<!--Anchors-->
[CoreOS, Clusters, and Linux Containers]: #intro
[Security Considerations]: #security
[How to use CoreOS on Azure]: #usingcoreos
[Subheading 3]: #subheading-3
[Next steps]: #next-steps

<!--Image references-->
[CloudServiceInNewPortal]: ./media/virtual-machines-linux-coreos-how-to/cloudservicefromnewportal.png
[EmptyCoreOSCluster]: ./media/virtual-machines-linux-coreos-how-to/endresultemptycluster.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png


<!--Link references-->
[Azure Cross-Platform Interface (xplat-cli)]: xplat-cli.md
[CoreOS]: https://coreos.com/
[CoreOS Overview]: https://coreos.com/using-coreos/
[CoreOS with Azure]: https://coreos.com/docs/running-coreos/cloud-providers/azure/
[Tim Park's CoreOS Tutorial]: https://github.com/timfpark/coreos-azure
[Patrick Chanezon's CoreOS Tutorial]: https://github.com/chanezon/azure-linux/tree/master/coreos/cloud-init
[Docker]: http://docker.io
[YAML]: http://yaml.org/
[Get Started with Fleet on CoreOS on Azure]: virtual-machines-linux-coreos-fleet-get-started.md