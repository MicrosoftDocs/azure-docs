---
ms.topic: include
ms.date: 07/07/2022
author: PatAltimore
ms.author: patricka
ms.service: iot-edge
services: iot-edge
---

1. Select **Start Debugging** or press **F5** to start the debug session.

1. In the Visual Studio Code integrated terminal, run the following command to send a **Hello World** message to your module. This is the command shown in previous steps when you set up IoT Edge simulator.

    ```bash
    curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
    ```

   > [!NOTE]
   > If you are using Windows, making sure the shell of your Visual Studio Code integrated terminal is **Git Bash** or **WSL Bash**. You cannot run the `curl` command from a PowerShell or command prompt.
   > [!TIP]
   > You can also use [PostMan](https://www.getpostman.com/) or other API tools to send messages through instead of `curl`.

1. In the Visual Studio Code Debug view, you'll see the variables in the left panel.

1. To stop your debugging session, select the Stop button or press **Shift + F5**, and then run **Azure IoT Edge: Stop IoT Edge Simulator** in the command palette to stop the simulator and clean up.
