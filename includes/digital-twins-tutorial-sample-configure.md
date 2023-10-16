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

Navigate on your machine to the folder you downloaded earlier from [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples) (and unzip it if you haven't already).

Once inside the folder, navigate into *digital-twins-samples-main\AdtSampleApp\SampleClientApp* and open the *appsettings.json* file. This JSON file contains a configuration variable that's necessary to run the project.

In the file body, change the `instanceUrl` to your Azure Digital Twins instance host name URL (by adding *https://* in front of the host name, as shown below).

```json
{
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-host-name>"
}
```

Save and close the file. 

[!INCLUDE [Azure Digital Twins: local credentials prereq (outer)](digital-twins-local-credentials-outer.md)]
