<properties 
   pageTitle="How to Use docker-machine with Azure" 
   description="Shows how to get up and running on Azure with Docker Machine on Ubuntu." 
   services="virtual-machines" 
   documentationCenter="virtual-machines" 
   authors="squillace" 
   manager="timlt" 
   editor="tysonn"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="n/a"
   ms.topic="article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure" 
   ms.date="02/20/2015"
   ms.author="rasquill"/>

# How to use docker-machine with Azure

This topic describes how to use [Docker](https://www.docker.com/) with [machine](https://github.com/docker/machine) and the [Azure xplat-cli](https://github.com/Azure/azure-xplat-cli) to create an Azure Virtual Machine to quickly and easily manage Linux containers from a computer running Ubuntu. To demonstrate, the tutorial shows how to deploy both the [busybox Docker Hub image](https://registry.hub.docker.com/_/busybox/) image and also the [nginx Docker Hub image](https://registry.hub.docker.com/_/nginx/) and configures the container to route web requests to the nginx container. (The Docker **machine** documentation describes how to modify these instructions for other platforms.)

There are some prerequisites for completing this tutorial. You will need to install the following:

1. [npm](https://docs.npmjs.com/) and [Node.js](http://nodejs.org/)
2. [The Azure xplat-cli](https://github.com/Azure/azure-xplat-cli)
3. A [Docker client](https://docs.docker.com/installation/)

If you install those items in that order, your Ubuntu computer will be ready for the tutorial. (This tutorial should be largely the same for any other dpkg-based distro such as Debian. Let us know in comments if you discover extra requirements or steps.)

## Get docker-machine -- or build it

The quickest way to get going with **docker-machine** is to download the appropriate release directly from the [release share](https://github.com/docker/machine/releases). The client computer in this tutorial was running Ubuntu on an x64 computer, so the **docker-machine_linux-amd64** image is the one used.

You can also build your **docker-machine** yourself by following the steps for [contributing to machine](https://github.com/docker/machine#contributing). You should be ready to download as much as 1 GB or more to perform the build, but by doing so you can customize your experience precisely the way you want.

> [AZURE.NOTE] You might well create a [symbolic link](http://en.wikipedia.org/wiki/Symbolic_link) to your platform version of it, but this tutorial uses the binary directly to demonstrate behavior very clearly. The result is that instead of commands such as `docker-machine env` as the **docker-machine** documentation shows, this tutorial  uses `docker-machine_linux-amd64 env` instead. Whether you create a symlink or just use the binary name directly is up to you, but if you change the name you are using, remember to modify the name in the instructions below.

<br />

>  Whichever method you choose, you must either call in the binary directly on the command line or place the binary the path such as **/usr/local/bin**. Remember to make sure it is marked as executable by typing `chmod +x` &lt;*`binaryName`*&gt; where &lt;*`binaryName`*&gt; is the name of your Docker machine executable. This tutorial uses **docker-machine_linux-amd64**.

## Create the certificate and key files for docker, machine, and Azure

Now you must create the certificate and key files that Azure needs to confirm your identity and permissions as well as those **docker-machine** needs to communicate with your Azure Virtual Machine to create and manage containers remotely. If you already have these files in a directory -- perhaps for use with docker -- you can reuse them. However, the best practice for testing **docker-machine** would be to create them in a separate directory and point docker-machine at them. 

> [AZURE.NOTE] If you end up trying **docker-machine** over and over again, be sure to either reuse the same certificate and key files. **docker-machine** creates a set of client certs as well -- everything it creates can be examined in `~/.docker/machine`. If you move those certs to another computer, you'll need to move the **docker-machine** certificate folders as well. This makes a difference if you're going to use **docker-machine** on another platform, for example, just to see how it all works.

If you have experience with Linux distributions, you may already have these files available to use on your computer in a specific place, and the [Docker HTTPS documentation explains these steps well](https://docs.docker.com/articles/https/). However, the following is the simplest form of this step.

1. Create a local folder and on the command-line, navigate to that folder and type:

		openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem
		openssl pkcs12 -export -out mycert.pfx -in mycert.pem -name "My Certificate"

	Be ready here to enter the export password for your certificate and capture it for future usage. Then type:

		openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer

2. Upload your certificate's .cer file to Azure. In the [Azure Portal](https://manage.windowsazure.com), click **Settings** in the bottom left of the service area (shown below)

	![][portalsettingsitem]

	and then click **Management Certificates**: 

	![][managementcertificatesitem]

	and then **Upload** (at the bottom of the page) ![][uploaditem] to upload the **mycert.cer** file you created in the previous step.

3. In the same **Settings** pane in the portal, click **Subscriptions** and capture the subscription ID to use when creating your VM, because you'll use it in the next step. (You can also locate the subscription id on the command line using the xplat-cli command `azure account list`, which displays the subscription id for each subscription you have in the account.) 

4. Create a docker host VM on Azure using the **docker-machine create** command. The command requires the subscription ID you just captured in the previous step and the path to the **.pem** file you created in step 1. This topic uses "machine-name" as the Azure Cloud Service (and your VM) name, but you should replace that with your own choice and remember to use your cloud service name in any other step that requires the vm name. (Remember that in this example, we are using the full binary name and not a **docker-machine** symlink.)

		docker-machine_linux-amd64 create \
	    -d azure \
	    --azure-subscription-id="<subscription ID acquired above>" \
	    --azure-subscription-cert="mycert.pem" \
	    machine-name

	As the first two steps require the creation of a new VM and the loading of the Linux Azure agent as well as the updating of the new VM, you should see something like the following. 
	
		INFO[0001] Creating Azure machine...                    
	    INFO[0049] Waiting for SSH...                           
	    modprobe: FATAL: Module aufs not found.
	    + sudo -E sh -c sleep 3; apt-get update
	    + sudo -E sh -c sleep 3; apt-get install -y -q linux-image-extra-3.13.0-36-generic
	    E: Unable to correct problems, you have held broken packages.
	    modprobe: FATAL: Module aufs not found.
	    Warning: tried to install linux-image-extra-3.13.0-36-generic (for AUFS)
	     but we still have no AUFS.  Docker may not work. Proceeding anyways!
	    + sleep 10
	    + [ https://get.docker.com/ = https://get.docker.com/ ]
	    + sudo -E sh -c apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
	    gpg: requesting key A88D21E9 from hkp server keyserver.ubuntu.com
	    gpg: key A88D21E9: public key "Docker Release Tool (releasedocker) <docker@dotcloud.com>" imported
	    gpg: Total number processed: 1
	    gpg:               imported: 1  (RSA: 1)
	    + sudo -E sh -c echo deb https://get.docker.com/ubuntu docker main > /etc/apt/sources.list.d/docker.list
	    + sudo -E sh -c sleep 3; apt-get update; apt-get install -y -q lxc-docker
	    + sudo -E sh -c docker version
	    INFO[0368] "machine-name" has been created and is now the active machine. 
	    INFO[0368] To point your Docker client at it, run this in your shell: $(docker-machine_linux-amd64 env machine-name) 

    > [AZURE.NOTE] Because a VM is being created, it may take a few minutes to be in a ready state. While you're waiting, you can check the state of your new Docker host by typing `azure vm list` using the xplat-cli until you see your VMs with the **ReadyRole** status. 

5. Set the docker and machine environment variables for the terminal session. The last line of feedback suggest that you immediately run the **env** command to export the environment variables necessary to use your docker client directly with a specific machine.

		$(docker-machine_linux-amd64 env machine-name)

	Once you do so, you do not need any special commands to use your local docker client to connect to the VM that Docker **machine** created.

	    $ docker info
	    Containers: 0
	    Images: 0
	    Storage Driver: devicemapper
	     Pool Name: docker-8:1-131736-pool
	     Pool Blocksize: 65.54 kB
	     Backing Filesystem: extfs
	     Data file: /dev/loop0
	     Metadata file: /dev/loop1
	     Data Space Used: 305.7 MB
	     Data Space Total: 107.4 GB
	     Metadata Space Used: 729.1 kB
	     Metadata Space Total: 2.147 GB
	     Udev Sync Supported: false
	     Data loop file: /var/lib/docker/devicemapper/devicemapper/data
	     Metadata loop file: /var/lib/docker/devicemapper/devicemapper/metadata
	     Library Version: 1.02.82-git (2013-10-04)
	    Execution Driver: native-0.2
	    Kernel Version: 3.13.0-36-generic
	    Operating System: Ubuntu 14.04.1 LTS
	    CPUs: 1
	    Total Memory: 1.639 GiB
	    Name: machine-name
	    ID: W3FZ:BCZW:UX24:GDSV:FR4N:N3JW:XOC2:RI56:IWQX:LRTZ:3G4P:6KJK
	    WARNING: No swap limit support

> [AZURE.NOTE] This tutorial shows **docker-machine** creating one VM. However, you can repeat the steps to create as many machines as you want. If you do so, the best way to switch between VMs with docker is to use the **env** command inline to set the **docker** environment variables for each individual command. For example, to use **docker info** with a different VM, you can type `docker $(docker-machine env <VM name>) info` and the **env** command fills in the docker connection information to use with that VM.

## We're done. Let's run some applications remotely using docker and images from the Docker Hub.

You can now use docker in the normal way to create an application in the container. The easiest to demonstrate is [busybox](https://registry.hub.docker.com/_/busybox/):
 
	    $  docker run busybox echo hello world
	    Unable to find image 'busybox:latest' locally
	    511136ea3c5a: Pull complete 
	    df7546f9f060: Pull complete 
	    ea13149945cb: Pull complete 
	    4986bf8c1536: Pull complete 
	    busybox:latest: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
	    Status: Downloaded newer image for busybox:latest
	    hello world

However, you may want to create an application that you can see immediately on the internet, such as the [nginx](https://registry.hub.docker.com/_/nginx/) from the [Docker Hub](https://registry.hub.docker.com/). 

> [AZURE.NOTE] Remember to use the **-P** option to have **docker** assign random ports to the image, and **-d** to ensure that the container runs in the background continuously. (If you forget, you'll start nginx and then it will immediately shut down. Don't forget!)

	$ docker run --name machinenginx -P -d nginx
    Unable to find image 'nginx:latest' locally
    30d39e59ffe2: Pull complete 
    c90d655b99b2: Pull complete 
    d9ee0b8eeda7: Pull complete 
    3225d58a895a: Pull complete 
    224fea58b6cc: Pull complete 
    ef9d79968cc6: Pull complete 
    f22d05624ebc: Pull complete 
    117696d1464e: Pull complete 
    2ebe3e67fb76: Pull complete 
    ad82b43d6595: Pull complete 
    e90c322c3a1c: Pull complete 
    4b5657a3d162: Pull complete 
    511136ea3c5a: Already exists 
    nginx:latest: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
    Status: Downloaded newer image for nginx:latest
    5883e2ff55a4ba0aa55c5c9179cebb590ad86539ea1d4d367d83dc98a4976848

To see it from the internet, create a public endpoint on port 80 for the Azure VM and map that port to the nginx container's port. First, use `docker ps -a` to locate the container and find which ports **docker** has assigned to the container's port 80. (Below the displayed information is edited to show only port information; you'll see more.)

	$ docker ps -a
    IMAGE               PORTS                                           
    nginx:latest        0.0.0.0:49153->80/tcp, 0.0.0.0:49154->443/tcp   
    busybox:latest                                                      
 
We can see that docker has assigned the container's port 80 to the VM's port 49153. We can now use the xplat-cli to map the external Cloud Service's public port 80 to port 49153 on the VM. Docker then ensures that inbound tcp traffic on VM port 49153 is routed to the nginx container. 

	$ azure vm endpoint create machine-name 80 49153
    info:    Executing command vm endpoint create
    + Getting virtual machines                                                     
    + Reading network configuration                                                
    + Updating network configuration                                               
    info:    vm endpoint create command OK

Open your favorite browser and have a look.

![][nginx]

<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps
Go to the [Docker user guide](https://docs.docker.com/userguide/) and create some applications on Microsoft Azure. Or, go play with [**docker** and [swarm](https://github.com/docker/swarm) on Azure](https:azure.microsoft.com/documentation/articles/virtual-machines-docker-swarm/) and see how swarm can be used with docker and Azure.

<!--Image references-->
[nginx]: ./media/virtual-machines-docker-machine/nginxondocker.png
[portalsettingsitem]: ./media/virtual-machines-docker-machine/portalsettingsitem.png
[managementcertificatesitem]: ./media/virtual-machines-docker-machine/managementcertificatesitem.png
[uploaditem]: ./media/virtual-machines-docker-machine/uploaditem.png

<!--Link references--In actual articles, you only need a single period before the slash.-->
[Link 1 to another azure.microsoft.com documentation topic]: virtual-machines-windows-tutorial.md
[Link 2 to another azure.microsoft.com documentation topic]: web-sites-custom-domain-name.md
[Link 3 to another azure.microsoft.com documentation topic]: storage-whatis-account.md
