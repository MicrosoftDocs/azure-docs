---
author: baanders
description: include file for Azure Digital Twins tutorials - configuring the sample project
ms.service: digital-twins
ms.topic: include
ms.date: 5/25/2020
ms.author: baanders
---

## Configure the sample project

Next, set up a sample client application that will interact with your Azure Digital Twins instance.

Navigate on your machine to the file you downloaded earlier from [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples) (and unzip it if you haven't already).

Once inside the folder, navigate into _AdtSampleApp_. Open _**AdtE2ESample.sln**_ in Visual Studio 2019. 

In Visual Studio, select the _SampleClientApp > **appsettings.json**_ file to open it in the editing window. This will serve as a pre-set JSON file with the necessary configuration variables to run the project.

In the file body, change the `instanceUrl` to your Azure Digital Twins instance *host name URL* (by adding **_https://_** in front of the *host name*, as shown below).

```json
{
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-host-name>"
}
```

Save and close the file. 

Next, configure the *appsettings.json* file to be copied to the output directory when you build the *SampleClientApp*. To do this, right-select the *appsettings.json* file, and choose **Properties**. In the **Properties** inspector, look for the *Copy to Output Directory* property. Change the value to **Copy if newer** if it is not set to that already.

:::image type="content" source="../articles/digital-twins/media/includes/copy-config.png" alt-text="Screenshot of the the Solution Explorer in Visual Studio with appsettings.json and 'Copy to Output Directory' property highlighted in Properties." border="false" lightbox="../articles/digital-twins/media/includes/copy-config.png":::

Keep the _**AdtE2ESample**_ project open in Visual Studio to continue using it in the tutorial.

[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](digital-twins-local-credentials-outer.md)]
