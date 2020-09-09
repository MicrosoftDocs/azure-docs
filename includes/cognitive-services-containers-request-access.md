---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 05/18/2020
---

The form requests information about you, your company, and the user scenario for which you'll use the container. After you submit the form, the Azure Cognitive Services team reviews it to make sure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> You must use an email address associated with either a Microsoft Account (MSA) or an Azure Active Directory (Azure AD) account in the form.

If your request is approved, you receive an email with instructions that describe how to obtain your credentials and access the private container registry.

## Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services containers. We recommend that you use the command-line method by using the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).

Use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, as shown in the following example, to log in to `containerpreview.azurecr.io`, which is the private container registry for Cognitive Services containers. Replace *\<username\>* with the user name and *\<password\>* with the password provided in the credentials you received from the Azure Cognitive Services team.

```
docker login containerpreview.azurecr.io -u <username> -p <password>
```

If you secured your credentials in a text file, you can concatenate the contents of that text file to the `docker login` command. Use the `cat` command, as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file that contains the password. Replace *\<username\>* with the user name provided in your credentials.

```
cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
```

