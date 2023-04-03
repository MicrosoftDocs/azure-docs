---
title: dTPM access for Azure IoT Edge for Linux on Windows | Microsoft Docs
description: Learn about how to configure access the dTPM on your  Azure IoT Edge for Linux on Windows virtual machine.
author: fcabrera
manager: patricka
ms.author: patricka
ms.date: 8/1/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# dTPM access for Azure IoT Edge for Linux on Windows

[!INCLUDE [iot-edge-version-1.4](includes/iot-edge-version-1.4.md)]

A Trusted platform module (TPM) chip is a secure crypto-processor that is designed to carry out cryptographic operations. This technology is designed to provide hardware-based, security-related functions. The Azure IoT Edge for Linux on Windows (EFLOW) virtual machine doesn't have a virtual TPMs attached to the VM. However, the user can enable or disable the TPM passthrough feature, that allows the EFLOW virtual machine to use the Windows host OS TPM. The TPM passthrough feature enables two main scenarios:

- Use TPM technology for IoT Edge device provisioning using Device Provisioning Service (DPS)
- Read-only access to cryptographic keys stored inside the TPM. 

This article describes how to develop a sample code in C# to read cryptographic keys stored inside the device TPM. 

> [!IMPORTANT]
> The access to the TPM keys is limited to read-only. If you want to write keys to the TPM, you need to do it from the Windows host OS. 

## Prerequisites

- A Windows host OS with a TPM or vTPM (ig using Windows host OS virtual machine).
- EFLOW virtual machine with TPM passthrough enabled. Using an elevated PowerShell session, use `Set-EflowVmFeature -feature "DpsTpm" -enable` to enable TPM passthrough. For more information, see [Set-EflowVmFeature to enable TPM passthrough](./reference-iot-edge-for-linux-on-windows-functions.md#set-eflowvmfeature).
- Ensure that the NV index (default index=3001) is initialized with 8 bytes of data. The default AuthValue used by the sample is {1,2,3,4,5,6,7,8} which corresponds to the NV (Windows) Sample in the TSS.MSR libraries when writing to the TPM. All index initialization must take place on the Windows Host before reading from the EFLOW VM. For more information about TPM samples, see [TSS.MSR](https://github.com/microsoft/TSS.MSR).

    > [!WARNING]
    > Enabling TPM passthrough to the virtual machine may increase security risks.
    
## Create the dTPM executable

The following steps show you how to create a sample executable to access a TPM index from the EFLOW VM. For more information about EFLOW TPM passthrough, see [Azure IoT Edge for Linux on Windows Security](./iot-edge-for-linux-on-windows-security.md).

1. Open Visual Studio 2019 or 2022.

1. Select **Create a new project**.

1. Choose **Console App** in the list of templates then select **Next**. 

    ![Visual Studio create new solution](./media/how-to-access-dtpm/vs-new-solution.png)

1. Fill in the **Project Name**, **Location** and **Solution Name** fields then select **Next**.

1. Choose a target framework. The latest .NET 6.0 LTS version is preferred. After choosing a target framework, select **Create**. Visual Studio creates a new console app solution.

1. In **Solution Explorer**, right-click the project name and select **Manage NuGet Packages**.

1. Select **Browse** and then search for `Microsoft.TSS`. For more information about this package, see [Microsoft.TSS](https://www.nuget.org/packages/Microsoft.TSS).

1. Choose the **Microsoft.TSS** package from the list then select **Install**.

   :::image type="content" source="./media/how-to-access-dtpm/vs-nuget-microsoft-tss.png" alt-text="Screenshot that shows Visual Studio add NuGet packages .":::

1. Edit the *Program.cs* file and replace the contents with the [EFLOW TPM sample code - Program.cs](https://raw.githubusercontent.com/Azure/iotedge-eflow/main/samples/tpm-read-nv/Program.cs).

1. Select **Build** > **Build solution** to build the project.  Verify the build is successful.

1. In **Solution Explorer**, right-click the project then select **Publish**.

1. In the **Publish** wizard, choose **Folder** > **Folder**. Select **Browse** and choose an output location for the executable file to be generated.  Select **Finish**. After the publish profile is created, select **Close**.

1. On the **Publish** tab, select **Show all settings** link. Change the following configurations then select **Save**. 
    - Target Runtime:  **linux-x64**.
    - Deployment mode: **Self-contained**.
    
   :::image type="content" source="./media/how-to-access-dtpm/sample-publish-options.png" alt-text="Screenshot that shows publish options .":::
 
1. Select **Publish** then wait for the executable to be created. 

If publish succeeds, you should see the new files created in your output folder.

## Copy and run the executable
Once the executable file and dependency files are created, you need to copy the folder to the EFLOW virtual machine. The following steps show you how to copy all the necessary files and how to run the executable inside the EFLOW virtual machine.

1. Start an elevated *PowerShell* session using **Run as Administrator**.

1. Change directory to the parent folder that contains the published files. 
    For example, if your published files are under the folder *TPM* in the directory `C:\Users\User`.  You can use the following command to change to the parent folder.
    ```powershell
    cd "C:\Users\User"
    ```

1. Create a *tar* file with all the files created in previous steps. For more information about PowerShell *tar* support, see [Tar and Curl Come to Windows](/virtualization/community/team-blog/2017/20171219-tar-and-curl-come-to-windows).
    For example, if you have all your files under the folder _TPM_, you can use the following command to create the _TPM.tar_ file.
    ```powershell
     tar -cvzf TPM.tar ".\TPM"
    ```

1. Once the *TPM.tar* file is created successfully, use the `Copy-EflowVmFile` cmdlet to copy the *tar* file created to the EFLOW VM.
    For example, if you have the _tar_ file name _TPM.tar_ in the directory `C:\Users\User`. you can use the following command to copy to the EFLOW VM.
    ```powershell
    Copy-EflowVmFile -fromFile "C:\Users\User\TPM.tar" -toFile "/home/iotedge-user/" -pushFile
    ```

1. Connect to the EFLOW virtual machine.
     ```powershell
    Connect-EflowVm
    ```

1. Change directory to the folder where you copied the *tar* file and check the file is available. If you used the example above, when connected to the EFLOW VM, you'll already be at the *iotedge-user* root folder. Run the `ls` command to list the files and folders.

1. Run the following command to extract all the content from the _tar_ file.
    ```bash
    tar -xvzf TPM.tar
    ```

1. After extraction, you should see a new folder with all the TPM files. 
1. Change directory to the *TPM* folder.
    ```bash
    cd TPM
    ```

1. Add executable permission to the main executable file. For example, if your project name was *TPMRead*, your main executable is named *TPMRead*. Run the following command to make it executable.
    ```bash
    chmod +x TPMRead
    ```

1. To solve an [ICU globalization issue](https://github.com/dotnet/core/issues/2186#issuecomment-472629489), run the following command. For example, if your project name is *TPMTest* run:
    ```bash
     sed -i '/"configProperties": /a \\t"System.Globalization.Invariant\": true,' TPMTest.runtimeconfig.json
    ```

1. The last step is to run the executable file. For example, if your project name is *TPMTest*, run the following command:
    ```bash
    ./TPMTest
    ```
    You should see an output similar to the following.

   :::image type="content" source="./media/how-to-access-dtpm/tpm-read-output.png" alt-text="Screenshot that shows EFLOW dTPM output.":::

## Next steps

* Learn [How to develop IoT Edge modules with Linux containers using IoT Edge for Linux on Windows](./tutorial-develop-for-linux-on-windows.md). 
