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

From here, navigate into _AdtSampleApp/SampleClientApp_. Copy the contents of *serviceConfig.json.TEMPLATE* into a new file, called *serviceConfig.json*. Within that new file, use an editor of your choice to change the `tenantId` to your *Directory ID*, `clientId` to your *Application ID*, and instanceUrl to your Azure Digital Twins instance *hostName* URL.

```json
{
  "tenantId": "<your-directory-ID>",
  "clientId": "<your-application-ID>",
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-hostName>"
}
```

Save the file.