---
title: Getting started with Azure Service Fabric XPlat CLI
description: Getting started with Azure Service Fabric XPlat CLI
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: timlt
editor: ''

ms.assetid: c3ec8ff3-3b78-420c-a7ea-0c5e443fb10e
ms.service: service-fabric
ms.devlang: dotNet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/29/2017
ms.author: subramar
---

# Using the XPlat CLI to interact with a Service Fabric cluster

You can interact with Service Fabric cluster from Linux machines using the XPlat CLI on Linux.

The first step is get the latest version of the CLI from the git rep and set it up in your path using the following 
commands:

```sh
 git clone https://github.com/Azure/azure-xplat-cli.git
 cd azure-xplat-cli
 npm install
 sudo ln -s \$(pwd)/bin/azure /usr/bin/azure
 azure servicefabric
```

For each command, it supports, you can type the name of the command to obtain the help for that command.
Auto-completion is supported for the commands. For example, the following command gives you help for all the 
application commands. 

```sh
 azure servicefabric application 
```

You can further filter the help to a specific command, as the following example shows:

```sh
 azure servicefabric application  create
```

To enable auto-completion in the CLI, run the following commands:

```sh
azure --completion >> ~/azure.completion.sh
echo 'source ~/azure.completion.sh' >> ~/.sh\_profile
source ~/azure.completion.sh
```

The following commands connect to the cluster and show you the nodes in the cluster:

```sh
 azure servicefabric cluster connect http://localhost:19080
 azure servicefabric node show
```

To use named parameters, and find what they are, you can type --help after a command. For example:

```sh
 azure servicefabric node show --help
 azure servicefabric application create --help
```

When connecting to a multi-machine cluster from a machine **that is not part of the cluster**, use the following 
command:

```sh
 azure servicefabric cluster connect http://PublicIPorFQDN:19080
```

Replace the PublicIPorFQDN tag with the real IP or FQDN as appropriate. When connecting to a multi-machine cluster 
from a machine **that is part of the cluster**, use the following command:

```sh
 azure servicefabric cluster connect --connection-endpoint http://localhost:19080 --client-connection-endpoint PublicIPorFQDN:19000
```

You can use PowerShell or CLI to interact with your Linux Service Fabric Cluster created through the Azure portal.

> [!WARNING]
> These clusters aren’t secure, thus, you may be opening up your one-box by adding the public IP address in the cluster manifest.

## Using the XPlat CLI to connect to a Service Fabric cluster

The following Azure CLI commands describe how to connect to a secure cluster. The certificate details must match a
certificate on the cluster nodes.

```sh
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert
```

If your certificate has Certificate Authorities (CAs), you need to add the --ca-cert-path parameter like the following
example: 

```sh
 azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --ca-cert-path /tmp/ca1,/tmp/ca2 
```

If you have multiple CAs, use a comma as the delimiter.

If your Common Name in the certificate does not match the connection endpoint, you could use the parameter
`--strict-ssl-false` to bypass the verification as shown in the following command:

```sh
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --strict-ssl-false 
```

If you would like to skip the CA verification, you could add the --reject-unauthorized-false parameter as shown in the 
following command: 

```sh
azure servicefabric cluster connect --connection-endpoint http://ip:19080 --client-key-path /tmp/key --client-cert-path /tmp/cert --reject-unauthorized-false 
```

After you connect, you should be able to run other CLI commands to interact with the cluster.

## Deploying your Service Fabric application

Execute the following commands to copy, register, and start the service fabric application:

```sh
azure servicefabric application package copy [applicationPackagePath] [imageStoreConnectionString] [applicationPathInImageStore]
azure servicefabric application type register [applicationPathinImageStore]
azure servicefabric application create [applicationName] [applicationTypeName] [applicationTypeVersion]
```

## Upgrading your application

The process is similar to the [process in Windows](service-fabric-application-upgrade-tutorial-powershell.md)).

Build, copy, register, and create your application from project root directory. If your application instance is named
`fabric:/MySFApp`, and the type is MySFApp, the commands would be as follows:

```sh
 azure servicefabric cluster connect http://localhost:19080
 azure servicefabric application package copy MySFApp fabric:ImageStore
 azure servicefabric application type register MySFApp
 azure servicefabric application create fabric:/MySFApp MySFApp 1.0
```

Make the change to your application and rebuild the modified service.  Update the modified service’s manifest file
(ServiceManifest.xml) with the updated versions for the Service (and Code or Config or Data as appropriate). Also
modify the application’s manifest (ApplicationManifest.xml) with the updated version number for the application,
and the modified service.  Now, copy and register your updated application using the following commands:

```sh
 azure servicefabric cluster connect http://localhost:19080>
 azure servicefabric application package copy MySFApp fabric:ImageStore
 azure servicefabric application type register MySFApp
```

Now, you can start the application upgrade with the following command:

```sh
 azure servicefabric application upgrade start -–application-name fabric:/MySFApp -–target-application-type-version 2.0 --rolling-upgrade-mode UnmonitoredAuto
```

You can now monitor the application upgrade using SFX. In a few minutes, the application would have been updated. You
can also try an updated app with an error and check the auto rollback functionality in service fabric.

## Converting from PFX to PEM and vice versa

You might need to install a certificate in your local machine (with Windows or Linux) to access secure clusters that
may be in a different environment. For example, while accessing a secured Linux cluster from a Windows machine and
vice versa you may need to convert your certificate from PFX to PEM and vice versa. 

To convert from a PEM file to a PFX file, use the following command:

```bash
openssl pkcs12 -export -out certificate.pfx -inkey mycert.pem -in mycert.pem -certfile mycert.pem
```

To convert from a PFX file to a PEM file, use the following command:

```bash
openssl pkcs12 -in certificate.pfx -out mycert.pem -nodes
```

Refer to [OpenSSL documentation](https://www.openssl.org/docs/man1.0.1/apps/pkcs12.html) for details.

<a id="troubleshooting"></a>

## Troubleshooting

### Copying of the application package does not succeed

Check if `openssh` is installed. By default, Ubuntu Desktop doesn't have it installed. Install it using the 
following command:

```sh
sudo apt-get install openssh-server openssh-client**
```

If the problem persists, try disabling PAM for ssh by changing the `sshd_config` file using the following commands:

```sh
sudo vi /etc/ssh/sshd_config
#Change the line with UsePAM to the following: UsePAM no
sudo service sshd reload
```

If the problem still persists, try increasing the number of ssh sessions by executing the following commands:

```sh
sudo vi /etc/ssh/sshd\_config
# Add the following to lines:
# MaxSessions 500
# MaxStartups 300:30:500
sudo service sshd reload
```

Using keys for ssh authentication (as opposed to passwords) isn't yet supported (since the platform uses ssh to copy
packages), so use password authentication instead.

## Next steps

Set up the development environment and deploy a Service Fabric application to a Linux cluster.

## Related articles

* [Getting started with Service Fabric and Azure CLI 2.0](service-fabric-azure-cli-2-0.md)
