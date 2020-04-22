---
author: baanders
description: include file with Azure Digital Twins setup steps (3, client app configuration)
ms.service: digital-twins
ms.topic: include
ms.date: 4/22/2020
ms.author: baanders
---

## Configure the sample project

To get started with the sample project, navigate on your local machine to the project folder you downloaded from this repository.

Open _DigitalTwinsMetadata/DigitalTwinsSample/**Program.cs**_, and change `AdtInstanceUrl` to your Azure Digital Twins instance *hostName*, `ClientId` to your *Application ID*, and `TenantId` to your *Directory ID*.

```csharp
private const string ClientId = "<your-application-ID>";
private const string TenantId = "<your-directory-ID>";
//...
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

Save the file.