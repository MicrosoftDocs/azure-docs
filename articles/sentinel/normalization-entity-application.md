---
title: The Advanced Security Information Model (ASIM) Application Entity reference
titleSuffix: Microsoft Sentinel
description: This article displays the Microsoft Sentinel Application Entity schema.
author: oshezaf
ms.topic: reference
ms.date: 12/29/2025
ms.author: ofshezaf

#Customer intent: As a security analyst, I want to understand the ASIM Application Entity so that I can accurately understand application information captured in normalized events, enabling consistent and comprehensive monitoring across security platforms and improving threat detection and response efforts.

---

# The Advanced Security Information Model (ASIM) Application Entity

## Prefixes

Different ASIM schemas prefix the entity fields by the following prefixes:
- `Src` is typically used to designate a client application.
- `Dst` or `Target` is commonly used to designate a remote application, typically on a server.

## Fields

| Field | Class | Type | Description |
|-------|-------|------|-------------|
| <a name="appname"></a>**AppName** | Optional | String | The name of the application.<br><br>Example: `Facebook` |
| <a name="appid"></a>**AppId** | Optional | String | The ID of the application, as reported by the reporting device. If [AppType](#apptype) is `Process`, `DstAppId` and `DstProcessId` should have the same value.<br><br>Example: `124` |
| <a name="apptype"></a>**AppType** | Optional | AppType | The type of the  application. Supported values include: `Process`, `Service`,  `Resource`, `URL`, `SaaS application`, `CSP`, and `Other`.<br><br>This field is mandatory if [DstAppName](#appname) or [DstAppId](#appid) are used. |
| <a name="processname"></a>**ProcessName**              | Optional     | String     |   The file name of the process used by the application.  <br><br>Example: `C:\Windows\explorer.exe`  |
| <a name="process"></a>**Process**        | Alias        |            | Alias to the [ProcessName](#processname) <br><br>Example: `C:\Windows\System32\rundll32.exe`|
| **ProcessId**| Optional    | String  | The process ID (PID) of the process the application is using.<br><br>Example:  `48610176` <br><br>**Note**: The type is defined as *string* to support varying systems, but on Windows and Linux this value must be numeric. <br><br>If you are using a Windows or Linux machine and used a different type, make sure to convert the values. For example, if you used a hexadecimal value, convert it to a decimal value.    |
| **ProcessGuid** | Optional     | String     |  A generated unique identifier (GUID) of the process used by the application.   <br><br> Example: `01234567-89AB-CDEF-0123-456789ABCDEF` |