* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) if you don't already have one.
  > [!NOTE]
  > You will need an Azure subscription with permissions for creating service principals (**owner role** provides this). If you do not have the right permissions, please reach out to your account administrator to grant you the right permissions. 
* [Visual Studio Code](https://code.visualstudio.com/), with the following extensions:
    * [Azure IoT Tools](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-tools)
        > [!TIP]
        > When installing Azure IoT Tools, you might be prompted to install Docker. Feel free to ignore the prompt.
    * [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
* [.NET Core 3.1 SDK](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* If you haven't completed the [Detect motion and emit events](../../../detect-motion-emit-events-quickstart.md) quickstart, then follow these steps:
     1. [Set up Azure resources](../../../detect-motion-emit-events-quickstart.md#set-up-azure-resources)
     1. [Set up your development environment](../../../detect-motion-emit-events-quickstart.md#set-up-your-development-environment)
     1. [Generate and deploy the IoT Edge deployment manifest](../../../detect-motion-emit-events-quickstart.md#generate-and-deploy-the-deployment-manifest)
     1. [Prepare to monitor events](../../../detect-motion-emit-events-quickstart.md#prepare-to-monitor-events)

> [!TIP]
> If you run into issues with Azure resources that get created, please view our **[troubleshooting guide](../../../troubleshoot-how-to.md#common-error-resolutions)** to resolve some commonly encountered issues.