---
author: baanders
description: include file with Azure Digital Twins setup steps (3, client app configuration)
ms.service: digital-twins
ms.topic: include
ms.date: 4/22/2020
ms.author: baanders
---

## Configure the sample project

Next, set up a sample client application that will interact with your Azure Digital Twins instance. If you haven't already downloaded the sample project, get it now by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip). 

Navigate to the downloaded folder on your machine and unzip it. Inside the unzipped folder, the samples for this project are located in _**digital-twins-samples-master\buildingScenario**_. Navigate here.

>[!IMPORTANT]
> For the rest of this article, paths to specific sample files will be given relative to this starting point.

From here, navigate into _AdtSampleApp/SampleClientApp_. Copy the contents of *serviceConfig.json.TEMPLATE* into a new file, and name the new file *serviceConfig.json*. Within the new file, use an editor of your choice to change the `tenantId` to your *Directory ID*, `clientId` to your *Application ID*, and instanceUrl to your Azure Digital Twins instance *hostName* URL.

```json
{
  "tenantId": "<your-directory-ID>",
  "clientId": "<your-application-ID>",
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-hostName>"
}
```

Save and close the file.

Next, open a command prompt or other console window on your machine, and copy these same values into environment variables using the commands below.

```cmd/sh
SET AZURE_TENANT_ID = <your-directory-ID>
SET AZURE_CLIENT_ID = <your-application-ID>
SET ADT_SERVICE_URL = https://<your-Azure-Digital-Twins-instance-hostName>
```

Files within the sample project that need these values to reach your Azure Digital Twins instance will pull them from these environment variables.

>[!TIP]
> You can check that these environment variables were set correctly by printing out their values with the `ECHO` command, like this:
> ```cmd/sh
> ECHO %AZURE_TENANT_ID%
> ECHO %AZURE_CLIENT_ID%
> ECHO %ADT_SERVICE_URL%
> ```