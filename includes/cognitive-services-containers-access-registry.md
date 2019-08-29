---
author: IEvangelist
ms.author: dapine
ms.date: 06/25/2019
ms.service: cognitive-services
ms.topic: include
---

## Use the Docker CLI to authenticate the private container registry

You can authenticate with the private container registry for Cognitive Services Containers in any of several ways, but the recommended method from the command line is to use the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).

Use the [`docker login` command](https://docs.docker.com/engine/reference/commandline/login/), as shown in the following example, to log in to `containerpreview.azurecr.io`, the private container registry for Cognitive Services Containers. Replace *\<username\>* with the user name and *\<password\>* with the password that's provided in the credentials you received from the Azure Cognitive Services team.

```
docker login containerpreview.azurecr.io -u <username> -p <password>
```

If you've secured your credentials in a text file, you can concatenate the contents of that text file, by using the `cat` command, to the `docker login` command, as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file that contains the password and *\<username\>* with the user name that's provided in your credentials.

```
cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
```
