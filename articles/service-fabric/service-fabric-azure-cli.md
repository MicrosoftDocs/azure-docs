<properties
   pageTitle="Interacting with Service Fabric clusters using CLI | Microsoft Azure"
   description="How to use Azure CLI to interact with a Service Fabric cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="mani-ramaswamy"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/24/2016"
   ms.author="subramar"/>


# Using the Azure CLI to interact with a Service Fabric Cluster

You can interact with Service Fabric cluster from Linux machines using the Azure CLI on Linux.

The first step is get the latest version of the CLI from the git rep and set it up in your path using the commands below:

```
$ git clone https://github.com/Azure/azure-xplat-cli.git
$ cd azure-xplat-cli
$ npm install
$ sudo ln -s \$(pwd)/bin/azure /usr/bin/azure
$ azure servicefabric
```

For each command, it supports, you can type the name of the command to obtain the help for that command. Auto-completion is supported for the commands. For example, the following command will give you help for all the application related commands. 
```
$ azure servicefabric application 
```

You can further filter the help to a specific command, as the following example shows:
```
$ azure servicefabric application  create

To enable auto-completion in the CLI, please run the commands below:

```
$ azure --completion >> ~/azure.completion.sh
$ echo 'source ~/azure.completion.sh' >> ~/.bash\_profile
$ source ~/azure.completion.sh
```

The following commands connect to the cluster and show you the nodes in the cluster:
```
$ azure servicefabric cluster connect http://localhost:19080
$ azure servicefabric node show
```

To use named parameters, and find what they are, you can type --help after a command. For example:
```
$ azure servicefabric node show --help
$ azure servicefabric application create --help
```

If you are connecting to a multi-machine cluster created in Azure (using ARM or the portal), and want to connect to it from a machine **that is not part of the cluster**, use the following command
(replacing the PublicIPorFQDN tag with the real IP or FQDN):
```
$ azure servicefabric cluster connect http://PublicIPorFQDN:19080
```
If you were connecting to a multi-machine cluster created in Azure (using ARM or the portal), and want to connect to it from a machine **that is part of the cluster**, use the following command:
```
$ azure servicefabric cluster connect --connection-endpoint http://localhost:19080 --client-connection-endpoint PublicIPorFQDN:19000
```

You can use PowerShell or CLI to interact with your Linux Service Fabric Cluster created through the Azure portal. 

**Caution:** These clusters aren’t secure clusters, thus, you may be opening up your one-box if you put in the IP address in the cluster manifest.



## Using the Azure CLI to connect to a Service Fabric Cluster

The following Azure CLI commands describe how to connect to a secure cluster. The certificate details must match a certificate on the cluster nodes.

```
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert
```
 
If you certificate has Certificate Authorities (CAs), you will need to add the --ca-cert-path parameter like the example below. You could use comma as delimiter if you have multiple CAs. 

```
 azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --ca-cert-path /tmp/ca1,/tmp/ca2 
```

 
If your Common Name in the certificate does not match the connection endpoint, you could use the parameter --strict-ssl to bypass the verification. 
```
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --strict-ssl false 
```
 
If you would like to skip the CA verification, you could add the --reject-unauthorized parameter, like below. 
```
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --reject-unauthorized false 
```
 
After you connect, you should be able to run other CLI commands to interact with the cluster. 

## Deploying your Service Fabric application

Execute the following commands to copy, register and start the service fabric application:

```
azure servicefabric application package copy [applicationPackagePath] [imageStoreConnectionString] [applicationPathInImageStore]
azure servicefabric application type register [applicationPathinImageStore]
azure servicefabric application create [applicationName] [applicationTypeName] [applicationTypeVersion]
```


## Upgrading your application

The process is very similar to the [process in Windows](https://azure.microsoft.com/en-us/documentation/articles/service-fabric-application-upgrade-tutorial-powershell/)).

Build, copy, register and create your application from project root directory. If your application instance is named fabric:/MySFApp, and the type is MySFApp, the commands would be as follows:

```
$ azure servicefabric cluster connect http://localhost:19080
$ azure servicefabric application package copy MySFApp fabric:ImageStore
$ azure servicefabric application type register MySFApp
$ azure servicefabric application create fabric:/MySFApp MySFApp 1.0
```

Make the change to your application and re-build the modified service.  Update the modified service’s manifest file (ServiceManifest.xml) with the updated versions for the Service (and Code or Config or Data as appropriate). Also modify the application’s manifest (ApplicationManifest.xml) with the updated version number for the application, and the modified service.  Now, copy and register your updated application using the following commands:.

```
$ azure servicefabric cluster connect http://localhost:19080>
$ azure servicefabric application package copy MySFApp fabric:ImageStore
$ azure servicefabric application type register MySFApp
```

Now, you can start the application upgrade with the following command:

```
$ azure servicefabric application upgrade start -–application-name fabric:/MySFApp -–application-type-version 2.0  --upgrade-mode UnmonitoredAuto
```

You can now monitor the application upgrade using SFX. In a few minutes, the application would’ve been updated.  You can also try an updated app with an error and check the auto rollback functionality in service fabric.

## Troubleshooting

### Copying of the application package gets stuck or errors out 

Please check if openssh is installed. By default, Ubuntu Desktop doesn't have it installed. Install it using the following command:

```
$ sudo apt-get install openssh-server openssh-client**
```

If the problem persists, try disabling PAM for ssh by executing the following:

```
$ sudo vi /etc/ssh/sshd_config
$#Change the line with UsePAM to the following: UsePAM no
$ sudo service sshd reload
```

If the problem still persists, try increasing the number of ssh sessions by executing the following commands:


```
$ sudo vi /etc/ssh/sshd\_config
$# Add the following to lines:
$# MaxSessions 500
$# MaxStartups 300:30:500
$ sudo service sshd reload
```
Using keys for ssh authentication (as opposed to passwords) isn't yet supported (since the platform uses ssh to copy packages), so please use password based authentication.


## Next steps

Set up the development environment and deploy a Service Fabric application to a Linux cluster.
