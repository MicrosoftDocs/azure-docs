---
 title: include file for Invoke-WebReqest procedure
 description: include file
 services: iot-edge
 author: kgremban
 ms.service: iot-edge
 ms.topic: include
 ms.date: 11/05/2019
 ms.author: kgremban
 ms.custom: include file
---

1. Use the **Invoke-WebRequest** command to obtain a script that provides commands that access IoT Edge services. Provide a names for the script, such as `runtimes.ps1`.

    ```powershell
    Invoke-WebRequest -useb https://aka.ms/iotedge-win OutFile runtimes.ps1
    ```

1. Set the execution policy and run the script.

    ```powershell
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
    .\runtimes.ps1
    ```
