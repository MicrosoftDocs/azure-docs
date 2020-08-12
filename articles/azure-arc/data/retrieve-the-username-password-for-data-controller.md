---
title: Retrieve the user name and password to connect to the Arc Data Controller
description: Retrieve the user name and password to connect to the Arc Data Controller
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data
author: twright-msft
ms.author: twright
ms.reviewer: mikeray
ms.date: 08/04/2020
ms.topic: how-to
---

# Scenario: Retrieve the user name and password to connect to the Arc Data Controller

You may be in a situation where you need to retrieve the user name and password you need to connect to the Arc Data Controller. These are the credentials you need when you run the command

```console
azdata login
```

If you are implementing the scenarios described in this Private Preview, you are administrator of the Kubernetes cluster. As such you have the privileges to run commands to retrieve from the Kubernetes secret stores the information that Azure Arc persists there.

> [!NOTE]
>  If you used a different name for the namespace where the data controller was deployed, be sure to change the `-n arc` parameter in the commands below to use the name of the namespace that you deployed the data controller to.

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

Try out other [scenarios](https://github.com/microsoft/Azure-data-services-on-Azure-Arc/tree/master/scenarios)
