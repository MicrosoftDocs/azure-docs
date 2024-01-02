---
author: eric-urban
ms.service: azure-ai-speech
ms.topic: include
ms.date: 09/05/2023
ms.author: eur
---

[!INCLUDE [Header](../../common/csharp.md)]

This guide shows how to install the [Speech SDK](~/articles/ai-services/speech-service/speech-sdk.md) for C#.

Code samples in the documentation are written in C# 8 and run on .NET standard 2.0.

## Platform requirements

[!INCLUDE [Requirements](csharp-requirements.md)]

## Install the Speech SDK for C#

The Speech SDK for C# is available as a NuGet package and implements .NET Standard 2.0. For more information, see [Microsoft.CognitiveServices.Speech](https://www.nuget.org/packages/Microsoft.CognitiveServices.Speech).

# [Terminal](#tab/dotnetcli)

The Speech SDK for C# can be installed from the .NET CLI by using the following `dotnet add` command:

```dotnetcli
dotnet add package Microsoft.CognitiveServices.Speech
```

# [PowerShell](#tab/powershell)

The Speech SDK for C# can be installed by using the following `Install-Package` command:

```powershell
Install-Package Microsoft.CognitiveServices.Speech
```

---

You can follow these guides for more options.

# [.NET](#tab/dotnet)

[!INCLUDE [dotnet](csharp-dotnet-windows.md)]

# [.NET Core](#tab/dotnetcore)

[!INCLUDE [dotnetcore](csharp-dotnetcore-windows.md)]

# [Unity](#tab/unity)

[!INCLUDE [unity](csharp-unity.md)]

# [UWP](#tab/uwp)

[!INCLUDE [uwp](csharp-uwp.md)]

# [Xamarin](#tab/xamarin)

[!INCLUDE [xamarin](csharp-xamarin.md)]

---
