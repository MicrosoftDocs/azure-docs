---
title: Reserved resource name errors
description: Describes how to resolve errors when providing a resource name that includes a reserved word.
ms.topic: troubleshooting
ms.date: 04/05/2023
---

# Resolve errors for reserved resource names

This article describes the error you get when deploying a resource that includes a reserved word in its name. Reserved words can't be used in resource names.

## Symptom

When deploying a resource, you may receive the following error:

```output
Code=ReservedResourceName;
Message=The resource name <resource-name> or a part of the name is a trademarked or reserved word.
```

## Cause

Resources with an accessible endpoint, such as a fully qualified domain name, can't use reserved words or trademarks in the name. The name is checked when the resource is created, even if the endpoint isn't currently enabled.

The following words are reserved:

- ACCESS
- APP_CODE
- APP_THEMES
- APP_DATA
- APP_GLOBALRESOURCES
- APP_LOCALRESOURCES
- APP_WEBREFERENCES
- APP_BROWSERS
- AZURE
- BING
- BIZSPARK
- BIZTALK
- CORTANA
- DIRECTX
- DOTNET
- DYNAMICS
- EXCEL
- EXCHANGE
- FOREFRONT
- GROOVE
- HOLOLENS
- HYPERV
- KINECT
- LYNC
- MSDN
- O365
- OFFICE
- OFFICE365
- ONEDRIVE
- ONENOTE
- OUTLOOK
- POWERPOINT
- SHAREPOINT
- SKYPE
- VISIO
- VISUALSTUDIO
- WEB.CONFIG
- XBOX

The following words can't be used as either a whole word or a substring in the name:

- MICROSOFT
- WINDOWS

The following word can't be used at the start of a resource name, but can be used later in the name:

- LOGIN

## Solution

Provide a name that doesn't use one of the reserved words.
