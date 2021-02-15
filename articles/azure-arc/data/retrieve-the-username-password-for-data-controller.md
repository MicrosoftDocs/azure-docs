---
title: Retrieve the user name and password to connect to the Arc Data Controller
description: Retrieve the user name and password to connect to the Arc Data Controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 09/22/2020
ms.topic: how-to
---

# Retrieve the user name and password to connect to the Arc Data Controller

You may be in a situation where you need to retrieve the user name and password for the Data controller. These are the commands you need when you run. 

```console
azdata login
```

If you are the Kubernetes administrator for the cluster. As such you have the privileges to run commands to retrieve from the Kubernetes secret stores the information that Azure Arc persists there.

> [!NOTE]
>  If you used a different name for the namespace where the data controller was created, be sure to change the `-n arc` parameter in the commands below to use the name of the namespace that you created the data controller to.

[!INCLUDE [azure-arc-data-preview](../../../includes/azure-arc-data-preview.md)]

## Linux

Run the following command to retrieve the user name:

```console
kubectl -n arc get secret controller-login-secret -o=jsonpath="{.data['username']}" | base64 -d
```

Run the following command to retrieve the password:

```console
kubectl -n arc get secret controller-login-secret -o=jsonpath="{.data['password']}" | base64 -d
```

## PowerShell

Run the following command to retrieve the user name:

```console
[Text.Encoding]::Utf8.GetString([Convert]::FromBase64String((kubectl -n arc get secret controller-login-secret -o=jsonpath="{.data['username']}")))
```

Run the following command to retrieve the password:

```console
[Text.Encoding]::Utf8.GetString([Convert]::FromBase64String((kubectl -n arc get secret controller-login-secret -o=jsonpath="{.data['password']}")))
```

## Next steps

Try out other [scenarios](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory-domain-services/scenarios.md)
