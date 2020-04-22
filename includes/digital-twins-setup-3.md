---
author: baanders
description: include file with Azure Digital Twins setup steps (3, client app configuration)
ms.service: digital-twins
ms.topic: include
ms.date: 4/22/2020
ms.author: baanders
---

## Configure the sample project

Next, set up a sample client application that will interact with your Azure Digital Twins instance. If you haven't downloaded the sample project yet, get it now by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip). 

Navigate to the downloaded folder on your machine and unzip it. Inside the unzipped folder, the samples for this project are located in _**digital-twins-samples-master\buildingScenario**_. 

>[!IMPORTANT]
> For the rest of this article, paths to specific sample files will be given relative to this starting point.

From here, open _DigitalTwinsMetadata/DigitalTwinsSample/**Program.cs**_ in an editor of your choice. Change `AdtInstanceUrl` to your Azure Digital Twins instance *hostName*, `ClientId` to your *Application ID*, and `TenantId` to your *Directory ID*.

```csharp
private const string ClientId = "<your-application-ID>";
private const string TenantId = "<your-directory-ID>";
//...
const string AdtInstanceUrl = "https://<your-Azure-Digital-Twins-instance-hostName>"
```

Save the file.