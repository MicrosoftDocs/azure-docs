---
author: PatrickFarley
ms.service: azure-ai-vision
ms.topic: include
ms.date: 08/01/2023
ms.author: pafarley
---

[Reference documentation](https://aka.ms/azsdk/image-analysis/ref-docs/csharp) | [Package (NuGet)](https://aka.ms/azsdk/image-analysis/package/nuget) | [Samples](https://aka.ms/azsdk/image-analysis/samples/csharp)

This guide shows how to install the Vision SDK for C#. 

## Platform requirements

[!INCLUDE [Requirements](csharp-requirements.md)]

## Install the Vision SDK for C#

The Vision SDK for C# is available as a NuGet package and implements .NET Standard 2.0. For more information, see <a href="https://www.nuget.org/packages/Azure.AI.Vision.ImageAnalysis" target="_blank">Azure.AI.Vision.ImageAnalysis</a>.


# [Terminal](#tab/dotnetcli)

The Vision SDK for C# can be installed from the [.NET CLI](https://dotnet.microsoft.com/download/dotnet/). To add a package reference in your project file, run this command in the folder where your `.csproj` file is located:

```dotnetcli
dotnet add package  Azure.AI.Vision.ImageAnalysis --prerelease
```

# [PowerShell](#tab/powershell)

The Vision SDK for C# can be installed from the [.NET CLI](https://dotnet.microsoft.com/download/dotnet/). To add a package reference in your project file, run this command in the folder where your `.csproj` file is located:

```powershell
Install-Package Azure.AI.Vision.ImageAnalysis --prerelease
```

# [Visual Studio](#tab/vs)

Open Visual Studio and create a new application project. Then install the client SDK by right-clicking on the project solution in the **Solution Explorer** and selecting **Manage NuGet Packages**. In the package manager that opens select **Browse**, check **Include prerelease**, and search for `Azure.AI.Vision.ImageAnalysis`. Select **Install**.



---
