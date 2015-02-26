<properties 
   pageTitle="Getting Started using Docker with Swarm on Azure" 
   description="Describes how to create a group of VMs with the Docker VM Extension and use swarm to create a Docker cluster." 
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
   ms.date="02/24/2015"
   ms.author="rasquill"/>

# How to use Docker with Swarm 

This topic shows a very simple way to use [docker](https://www.docker.com/) with [swarm](https://github.com/docker/swarm) to create a swarm-managed cluster on Azure. 

## azure vm docker create 

four vms (but you can use any number more than one vm) call the following with *&lt;password&gt;* replaced by the password you have chosen.

    azure vm docker create swarm-master -l "East US" -e 22 $imagename ops <password>
    azure vm docker create swarm-node-1 -l "East US" -e 22 $imagename ops <password>
    azure vm docker create swarm-node-2 -l "East US" -e 22 $imagename ops <password>
    azure vm docker create swarm-node-3 -l "East US" -e 22 $imagename ops <password>

When you're done you have:

    $ azure vm list | grep "swarm-[mn]"
    data:    swarm-master     ReadyRole           East US       swarm-master.cloudapp.net                               100.78.186.65 
    data:    swarm-node-1     ReadyRole           East US       swarm-node-1.cloudapp.net                               100.66.72.126 
    data:    swarm-node-2     ReadyRole           East US       swarm-node-2.cloudapp.net                               100.72.18.47  
    data:    swarm-node-3     ReadyRole           East US       swarm-node-3.cloudapp.net                               100.78.24.68  
    

## Installing Swarm on Swarm Master VM

We use the [container model of installation from the docker swarm documentation](https://github.com/docker/swarm#1---docker-image). In this model, **swarm** is downloaded as a container running swarm. We can just invoke that remotely from our laptop by using docker to connect to the **swarm-master** VM and telling it to use the cluster id creation command, **create**.

    $ docker --tls -H tcp://swarm-master.cloudapp.net:4243 run --rm swarm create
    Unable to find image 'swarm:latest' locally
    511136ea3c5a: Pull complete 
    a8bbe4db330c: Pull complete 
    9dfb95669acc: Pull complete 
    0b3950daf974: Pull complete 
    633f3d9a9685: Pull complete 
    bba5f98a0414: Pull complete 
    defbc1ab4462: Pull complete 
    92d78d321ff2: Pull complete 
    swarm:latest: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
    Status: Downloaded newer image for swarm:latest
    36731c17189fd8f450c395db8437befd
    
we need to capture the cluster id we just created to use it again when we join the node VMs to the swarm master to create the "swarm". Ours is **36731c17189fd8f450c395db8437befd**.

> [AZURE.NOTE] Just to be clear, we are using our local docker installation to connect to the **swarm-master** VM in Azure and instruction **swarm-master** to download, install, and run the **create** command, which returns our cluster id that we use for discovery purposes later.
<b />
> To confirm this, run `docker -H tcp://`*&lt;hostname&gt;* ` images` to list the container processes on the **swarm-master** machine and on another node for comparison:

[rasquill note: using 'ps -a' did not list that swarm had ever run. Very strange]

        $ docker --tls -H tcp://swarm-master.cloudapp.net:4243 images
        REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
        swarm               latest              92d78d321ff2        11 days ago         7.19 MB
        $ docker --tls -H tcp://swarm-node-1.cloudapp.net:4243 images
        REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
        $ 
<b />
> The other nodes have no entries; no images have been downloaded and run yet.

## Join the Node VMs to our Docker Cluster

For each node, list the endpoint information using the xplat-cli:

    $ azure vm endpoint list swarm-node-1
    info:    Executing command vm endpoint list
    + Getting virtual machines                                                     
    data:    Name    Protocol  Public Port  Private Port  Virtual IP      EnableDirectServerReturn  Load Balanced
    data:    ------  --------  -----------  ------------  --------------  ------------------------  -------------
    data:    docker  tcp       4243         4243          138.91.112.194  false                     No           
    data:    ssh     tcp       22           22            138.91.112.194  false                     No           
    info:    vm endpoint list command OK
    
 
and join that to the swarm you are creating by passing the cluster id and the node's docker port:

    $ docker --tls -H tcp://swarm-node-1.cloudapp.net:4243 run -d swarm join --addr=138.91.112.194:4243 token://36731c17189fd8f450c395db8437befd
    Unable to find image 'swarm:latest' locally
    511136ea3c5a: Pull complete 
    a8bbe4db330c: Pull complete 
    9dfb95669acc: Pull complete 
    0b3950daf974: Pull complete 
    633f3d9a9685: Pull complete 
    bba5f98a0414: Pull complete 
    defbc1ab4462: Pull complete 
    92d78d321ff2: Pull complete 
    swarm:latest: The image you are pulling has been verified. Important: image verification is a tech preview feature and should not be relied on to provide security.
    Status: Downloaded newer image for swarm:latest
    bbf88f61300bf876c6202d4cf886874b363cd7e2899345ac34dc8ab10c7ae924

and to confirm that swarm is running on **swarm-node-1** we type:

    $ docker --tls -H tcp://swarm-node-1.cloudapp.net:4243 ps -a
        CONTAINER ID        IMAGE               COMMAND                CREATED             STATUS              PORTS               NAMES
        bbf88f61300b        swarm:latest        "/swarm join --addr=   13 seconds ago      Up 12 seconds       2375/tcp            angry_mclean        

Repeat for all the other nodes in the cluster. In our case, we do that for **swarm-node-2** and **swarm-node-3**. 

## Begin Managing the Swarm Cluster

    $ docker --tls -H tcp://swarm-master.cloudapp.net:4243 run -d -p 2375:2375 swarm manage token://36731c17189fd8f450c395db8437befd
    d7e87c2c147ade438cb4b663bda0ee20981d4818770958f5d317d6aebdcaedd5

and then you can list out your nodes in your cluster:

    ralph@local:~$ docker --tls -H tcp://swarm-master.cloudapp.net:4243 run --rm swarm list token://73f8bc512e94195210fad6e9cd58986f
    54.149.104.203:2375
    54.187.164.89:2375
    92.222.76.190:2375
    
## Run Things on Your Swarm

To run things, you should just run something. 



<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam ultricies, ipsum vitae volutpat hendrerit, purus diam pretium eros, vitae tincidunt nulla lorem sed turpis: [Link 3 to another azure.microsoft.com documentation topic]. 

<!--Image references-->
[5]: ./media/markdown-template-for-new-articles/octocats.png
[6]: ./media/markdown-template-for-new-articles/pretty49.png
[7]: ./media/markdown-template-for-new-articles/channel-9.png
[8]: ./media/markdown-template-for-new-articles/copytemplate.png

<!--Link references--In actual articles, you only need a single period before the slash.>
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
