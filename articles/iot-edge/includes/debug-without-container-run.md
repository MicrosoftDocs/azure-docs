---
ms.topic: include
ms.date: 08/20/2025
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-edge
services: iot-edge
---

1. Select **Start Debugging** or press **F5** to start the debug session.

1. In the Visual Studio Code integrated terminal, run the following command to send a **Hello World** message to your module. This command is shown in the previous steps when you set up the IoT Edge simulator.

    ```bash
    curl --header "Content-Type: application/json" --request POST --data '{"inputName": "input1","data":"hello world"}' http://localhost:53000/api/v1/messages
    ```

   > [!NOTE]
   > If you're using Windows, making sure the shell of your Visual Studio Code integrated terminal is **Git Bash** or **WSL Bash**. You can't run the `curl` command from a PowerShell or command prompt.

1. In the Visual Studio Code Debug view, you see the variables in the left panel.

1. To stop your debugging session, select the Stop button or press **Shift + F5**, and then run **Azure IoT Edge: Stop IoT Edge Simulator** in the command palette to stop the simulator and clean up.
