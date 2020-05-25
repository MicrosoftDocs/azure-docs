---
author: baanders
description: include file for Azure Digital Twins tutorials - full setup for the sample project
ms.service: digital-twins
ms.topic: include
ms.date: 5/25/2020
ms.author: baanders
---

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Also before you start, install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/) version 16.5 or later on your development machine. If you have an older version installed already, you can open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.

The tutorial is driven by a sample project written in C#. Get the sample project on your machine by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip).

[!INCLUDE [Azure Digital Twins tutorials: instance prereq](digital-twins-tutorial-instance-prereq.md)]

## Configure the sample project

Next, set up a sample client application that will interact with your Azure Digital Twins instance. If you haven't already downloaded the sample project, get it now by [downloading the Azure Digital Twins samples repository as a ZIP file](https://github.com/Azure-Samples/digital-twins-samples/archive/master.zip). 

Navigate to the downloaded file on your machine and unzip it.

Once inside the unzipped folder, navigate into _digital-twins-samples-master/AdtSampleApp/_. Open _**AdtE2ESample.sln**_ in Visual Studio 2019. 

In Visual Studio, use the *Solution Explorer* pane to create a copy of the _SampleClientApp > **serviceConfig.json.TEMPLATE**_ file (you can use the right-select menus to copy and paste). Rename the copy *serviceConfig.json*. This will serve as a pre-set JSON file with the necessary configuration variables to run the project.

Select the new file to open it in the editing window. Change the `tenantId` to your *Directory ID*, `clientId` to your *Application ID*, and `instanceUrl` to your Azure Digital Twins instance *hostName* URL (with *https://* in front of it as shown below).

```json
{
  "tenantId": "<your-directory-ID>",
  "clientId": "<your-application-ID>",
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-hostName>"
}
```

Next, configure the *serviceConfig.json* file to be copied to the output directory when you build the *SampleClientApp*. Right-select the *serviceConfig.json* file, and choose *Properties.* In the *Properties* inspector, change the value of the *Copy to Output Directory* property to *Copy if newer*.

:::image type="content" source="../articles/digital-twins-v2/media/include-setup/copy-config.png" alt-text="Excerpt from Visual Studio window showing the Solution Explorer pane with serviceConfig.json highlighted, and the Properties pane with 'Copy to Output Directory' property set to 'Copy if newer'" border="false":::

Save and close the file. Keep the _**AdtE2ESample**_ project open in Visual Studio to continue using it in the tutorial.

