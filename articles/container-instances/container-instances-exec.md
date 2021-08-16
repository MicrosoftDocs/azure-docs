---
title: Execute commands in running container instance
description: Learn how execute a command in a container that's currently running in Azure Container Instances
ms.topic: article
ms.date: 03/30/2018
---

# Execute a command in a running Azure container instance

Azure Container Instances supports executing a command in a running container. Running a command in a container you've already started is especially helpful during application development and troubleshooting. The most common use of this feature is to launch an interactive shell so that you can debug issues in a running container.

## Run a command with Azure CLI

Execute a command in a running container with [az container exec][az-container-exec] in the [Azure CLI][azure-cli]:

```azurecli
az container exec --resource-group <group-name> --name <container-group-name> --exec-command "<command>"
```

For example, to launch a Bash shell in an Nginx container:

```azurecli
az container exec --resource-group myResourceGroup --name mynginx --exec-command "/bin/bash"
```

In the example output below, the Bash shell is launched in a running Linux container, providing a terminal in which `ls` is executed:

```output
root@caas-83e6c883014b427f9b277a2bba3b7b5f-708716530-2qv47:/# ls
bin   dev  home  lib64	mnt  proc  run	 srv  tmp  var
boot  etc  lib	 media	opt  root  sbin  sys  usr
root@caas-83e6c883014b427f9b277a2bba3b7b5f-708716530-2qv47:/# exit
exit
Bye.
```

In this example, Command Prompt is launched in a running Nanoserver container:

```azurecli
az container exec --resource-group myResourceGroup --name myiis --exec-command "cmd.exe"
```

```output
Microsoft Windows [Version 10.0.14393]
(c) 2016 Microsoft Corporation. All rights reserved.

C:\>dir
 Volume in drive C has no label.
 Volume Serial Number is 76E0-C852

 Directory of C:\

03/23/2018  09:13 PM    <DIR>          inetpub
11/20/2016  11:32 AM             1,894 License.txt
03/23/2018  09:13 PM    <DIR>          Program Files
07/16/2016  12:09 PM    <DIR>          Program Files (x86)
03/13/2018  08:50 PM           171,616 ServiceMonitor.exe
03/23/2018  09:13 PM    <DIR>          Users
03/23/2018  09:12 PM    <DIR>          var
03/23/2018  09:22 PM    <DIR>          Windows
               2 File(s)        173,510 bytes
               6 Dir(s)  21,171,609,600 bytes free

C:\>exit
Bye.
```

## Multi-container groups

If your [container group](container-instances-container-groups.md) has multiple containers, such as an application container and a logging sidecar, specify the name of the container in which to run the command with `--container-name`.

For example, in the container group *mynginx* are two containers, *nginx-app* and *logger*. To launch a shell on the *nginx-app* container:

```azurecli
az container exec --resource-group myResourceGroup --name mynginx --container-name nginx-app --exec-command "/bin/bash"
```

## Restrictions

Azure Container Instances currently supports launching a single process with [az container exec][az-container-exec], and you cannot pass command arguments. For example, you cannot chain commands like in `sh -c "echo FOO && echo BAR"`, or execute `echo FOO`.

## Next steps

Learn about other troubleshooting tools and common deployment issues in [Troubleshoot container and deployment issues in Azure Container Instances](container-instances-troubleshooting.md).

<!-- LINKS - internal -->
[az-container-create]: /cli/azure/container#az_container_create
[az-container-exec]: /cli/azure/container#az_container_exec
[azure-cli]: /cli/azure