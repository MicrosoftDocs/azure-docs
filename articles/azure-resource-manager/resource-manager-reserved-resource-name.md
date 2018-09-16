---
title: Azure reserved resource name errors | Microsoft Docs
description: Describes how to resolve errors when providing a resource name that includes a reserved word.
services: azure-resource-manager
documentationcenter: ''
author: tfitzmac
manager: timlt
editor: ''

ms.service: azure-resource-manager
ms.workload: multiple
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 11/08/2017
ms.author: tomfitz

---
# Resolve reserved resource name errors

This article describes the error you encounter when deploying a resource that includes a reserved word in its name.

## Symptom

When deploying a resource that is available through a public endpoint, you may receive the following error:

```
Code=ReservedResourceName;
Message=The resource name <resource-name> or a part of the name is a trademarked or reserved word.
```

## Cause

Resources that have a public endpoint cannot use reserved words or trademarks in the name.

The following words are reserved:

* ACCESS
* AZURE
* BING
* BIZSPARK
* BIZTALK
* CORTANA
* DIRECTX
* DOTNET
* DYNAMICS
* EXCEL
* EXCHANGE
* FOREFRONT
* GROOVE
* HOLOLENS
* HYPERV
* KINECT
* LYNC
* MSDN
* O365
* OFFICE
* OFFICE365
* ONEDRIVE
* ONENOTE
* OUTLOOK
* POWERPOINT
* SHAREPOINT
* SKYPE
* VISIO
* VISUALSTUDIO

The following words cannot be used as either a whole word or a substring in the name:

* LOGIN
* MICROSOFT
* WINDOWS
* XBOX

## Solution

Provide a name that does not use one of the reserved words.