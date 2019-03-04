---
author: diberry
ms.author: diberry
ms.service: cognitive-services
ms.topic: include
ms.date: 01/24/2019
---

You must first complete and submit the [Cognitive Services Vision Containers Request form](https://aka.ms/VisionContainersPreview) to request access to the container. The form requests information about you, your company, and the user scenario for which you'll use the container. Once submitted, the Azure Cognitive Services team reviews the form to ensure that you meet the criteria for access to the private container registry.

> [!IMPORTANT]
> You must use an email address associated with either a Microsoft Account (MSA) or Azure Active Directory (Azure AD) account in the form.

If your request is approved, you then receive an email with instructions describing how to obtain your credentials and access the private container registry.

## Log in to the private container registry

There are several ways to authenticate with the private container registry for Cognitive Services Containers, but the recommended method from the command line is by using the [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/).

Use the [docker login](https://docs.docker.com/engine/reference/commandline/login/) command, as shown in the following example, to log into `containerpreview.azurecr.io`, the private container registry for Cognitive Services Containers. Replace *\<username\>* with the user name and *\<password\>* with the password provided in the credentials you received from the Azure Cognitive Services team.

```
docker login containerpreview.azurecr.io -u <username> -p <password>
```

If you have secured your credentials in a text file, you can concatenate the contents of that text file, using the `cat` command, to the `docker login` command as shown in the following example. Replace *\<passwordFile\>* with the path and name of the text file containing the password and *\<username\>* with the user name provided in your credentials.

```
cat <passwordFile> | docker login containerpreview.azurecr.io -u <username> --password-stdin
```

