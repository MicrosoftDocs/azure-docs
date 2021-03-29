---
author: baanders
description: include file for Azure Digital Twins tutorials - prerequisites for the sample project
ms.service: digital-twins
ms.topic: include
ms.date: 1/20/2021
ms.author: baanders
---

## Prerequisites

To complete the steps in this tutorial, you'll need to first complete the following prerequisites. 

If you don't have an Azure subscription, **create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)** before you begin.

### Get required resources

To complete this tutorial, **install [Visual Studio 2019](https://visualstudio.microsoft.com/downloads/), version 16.5 or later** on your development machine. If you have an older version installed already, you can open the *Visual Studio Installer* app on your machine and follow the prompts to update your installation.

>[!NOTE]
> Ensure your installation of Visual Studio 2019 includes the **[Azure Development Workload](/dotnet/azure/configure-visual-studio)**. This workload enables an application to publish Azure functions and perform other Azure development tasks.

The tutorial is driven by a sample project written in C#. The sample is located here: [Azure Digital Twins end-to-end samples](/samples/azure-samples/digital-twins-samples/digital-twins-samples). **Get the sample project** on your machine by navigating to the sample link, and selecting the *Browse code* button underneath the title. This will take you to the GitHub repo for the samples, which you can download as a *.ZIP* by selecting the *Code* button and *Download ZIP*.

:::image type="content" source="../articles/digital-twins/media/includes/download-repo-zip.png" alt-text="View of the digital-twins-samples repo on GitHub. The Code button is selected, producing a small dialog box where the Download ZIP button is highlighted." lightbox="../articles/digital-twins/media/includes/download-repo-zip.png":::

This will download a *.ZIP* folder to your machine as **digital-twins-samples-master.zip**. Unzip the folder and extract the files.

### Prepare an Azure Digital Twins instance

[!INCLUDE [Azure Digital Twins: instance prereq](digital-twins-prereq-instance.md)]
