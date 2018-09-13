1. Start Visual Studio 2017.
 
1. Make sure the **.NET desktop environment** workload is available. Choose **Tools** \> **Get Tools and Features** from the Visual Studio menu bar to open the Visual Studio installer. If this workload is already enabled, close the dialog. 

    Otherwise, mark the checkbox next to **.NET desktop development,** then click the **Modify** button at the lower right corner of the dialog. Installation of the new feature will take a moment.

    ![Enable .NET desktop development](media/sdk/vs-enable-net-desktop-workload.png)

1. Create a new Visual C# Console App. In the **New Project** dialog box, from the left pane, expand **Installed** \> **Visual C#** \> **Windows Desktop** and then choose **Console App (.NET Framework)**. For the project name, enter *helloworld*.

    ![Create Visual C# Console App (.NET Framework)](media/sdk/qs-csharp-dotnet-windows-01-new-console-app.png "Create Visual C# Console App (.NET Framework)")

1. Install and reference the [Speech SDK NuGet package](https://aka.ms/csspeech/nuget). In the Solution Explorer, right-click the solution and select **Manage NuGet Packages for Solution**.

    ![Right-click Manage NuGet Packages for Solution](media/sdk/qs-csharp-dotnet-windows-02-manage-nuget-packages.png "Manage NuGet Packages for Solution")

1. In the upper-right corner, in the **Package Source** field, select **Nuget.org**. Search for the `Microsoft.CognitiveServices.Speech` package and install it into the **helloworld** project.

    ![Install Microsoft.CognitiveServices.Speech NuGet Package](media/sdk/qs-csharp-dotnet-windows-03-nuget-install-0.5.0.png "Install Nuget package")

1. Accept the displayed license to begin installation of the NuGet package.

    ![Accept the license](media/sdk/qs-csharp-dotnet-windows-04-nuget-license.png "Accept the license")

    After the package is installed, a confirmation appears in the Package Manager console.

1. Create a platform configuration matching your PC architecture via the Configuration Manager. Select **Build** > **Configuration Manager**.

    ![Launch the configuration manager](media/sdk/qs-csharp-dotnet-windows-05-cfg-manager-click.png "Launch the configuration manager")

1. In the **Configuration Manager** dialog box, add a new platform. From the **Active solution platform** drop-down list, select **New**.

    ![Add a new platform under the configuration manager window](media/sdk/qs-csharp-dotnet-windows-06-cfg-manager-new.png "Add a new platform under the configuration manager window")

1. If you are running 64-bit Windows, create a new platform configuration named `x64`. If you are running 32-bit Windows, create a new platform configuration named `x86`.

    ![On 64-bit Windows, add a new platform named "x64"](media/sdk/qs-csharp-dotnet-windows-07-cfg-manager-add-x64.png "Add x64 platform")


