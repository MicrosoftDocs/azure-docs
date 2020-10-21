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

Navigate on your machine to file you downloaded earlier from [*Azure Digital Twins end-to-end samples*](/samples/azure-samples/digital-twins-samples/digital-twins-samples) (and unzip it if you haven't already).

Once inside the folder, navigate into _AdtSampleApp_. Open _**AdtE2ESample.sln**_ in Visual Studio 2019. 

In Visual Studio, use the *Solution Explorer* pane to create a copy of the _SampleClientApp > **serviceConfig.json.TEMPLATE**_ file (you can use the right-select menus to copy and paste). Rename the copy *serviceConfig.json*. This will serve as a pre-set JSON file with the necessary configuration variables to run the project.

Select the *serviceConfig.json* file to open it in the editing window. Change the `instanceUrl` to your Azure Digital Twins instance *hostName* URL (with *https://* in front of it as shown below).

```json
{
  "instanceUrl": "https://<your-Azure-Digital-Twins-instance-hostName>"
}
```



Save and close the file. 

Next, configure the *serviceConfig.json* file to be copied to the output directory when you build the *SampleClientApp*. To do this, right-select the *serviceConfig.json* file, and choose *Properties.* In the *Properties* inspector, change the value of the *Copy to Output Directory* property to *Copy if newer*.

:::image type="content" source="../articles/digital-twins/media/includes/copy-config.png" alt-text="Excerpt from Visual Studio window showing the Solution Explorer pane with serviceConfig.json highlighted, and the Properties pane with 'Copy to Output Directory' property set to 'Copy if newer'" border="false":::

Keep the _**AdtE2ESample**_ project open in Visual Studio to continue using it in the tutorial.

