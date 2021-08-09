---
author: Juliako
ms.service: azure-video-analyzer
ms.topic: include
ms.date: 04/30/2021
ms.author: juliako
---

1. In Visual Studio Code, browse to src/edge. You'll see the .env file that you created along with a few deployment template files.

   The deployment template refers to the deployment manifest for the edge device with some placeholder values. The .env file has the values for those variables.
2. Next, browse to the src/cloud-to-device-console-app folder. Here you'll see the appsettings.json file that you created along with a few other files:

   - c2d-console-app.csproj: This is the project file for Visual Studio Code.
   - operations.json: This file lists the different operations that you want the program to run.
   - Program.cs: This sample program code:
     - Loads the app settings.
     - Invokes the Azure Video Analyzer module's direct methods to create topology, instantiate the pipeline and activate it.
     - Pauses for you to examine the pipeline output in the **TERMINAL** window and the events sent to the IoT hub in the **OUTPUT** window.
     - Deactivates the live pipeline, deletes the live pipeline, and deletes the topology.
