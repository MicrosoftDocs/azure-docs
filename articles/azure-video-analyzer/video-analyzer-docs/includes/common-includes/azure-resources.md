---
author: naiteeks
ms.topic: include
ms.service: azure-video-analyzer
ms.date: 04/20/2021
ms.author: juliako
---

The deployment process will take about **20 minutes**. Upon completion, you will have certain Azure resources deployed in the Azure subscription, including:

1. **Video Analyzer account** - This [cloud service](../../overview.md) is used to register the Video Analyzer edge module, and for playing back recorded video and video analytics.
1. **Storage account** - For storing recorded video and video analytics.
1. **Managed Identity** - This is the user assigned [managed identity](../../../../active-directory/managed-identities-azure-resources/overview.md) used to manage access to the above storage account.
1. **Virtual machine** - This is a virtual machine that will serve as your simulated edge device.
1. **IoT Hub** - This acts as a central message hub for bi-directional communication between your IoT application, IoT Edge modules and the devices it manages.

In addition to the resources mentioned above, following items are also created in the 'deployment-output' file share in your storage account, for use in quickstarts and tutorials:

- **_appsettings.json_** - This file contains the **device connection string** and other properties needed to run the sample application in Visual Studio Code.
- **_env.txt_** - This file contains the environment variables that you will need to generate deployment manifests using Visual Studio Code.
- **_deployment.json_** - This is the deployment manifest used by the template to deploy edge modules to the simulated edge device.

<!-- TODO: provide a link to the readme.md in github.com/azure-video-analyzer/setup/readme.md where we can list out all resources like virtual network etc. -->

> [!TIP]
> If you run into issues creating all of the required Azure resources, please use the manual steps in this [quickstart](../../get-started-detect-motion-emit-events-portal.md).
