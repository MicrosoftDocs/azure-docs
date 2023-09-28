---
services: cognitive-services
manager: nitinme
author: travisw
ms.author: travisw
ms.service: azure-ai-openai
ms.topic: include
ms.date: 08/29/2023
---

### Create a new .NET Core application

In a console window (such as cmd, PowerShell, or Bash), use the `dotnet new` command to create a new console app with the name `azure-openai-quickstart`. This command creates a simple "Hello World" project with a single C# source file: *Program.cs*.

```dotnetcli
dotnet new console -n azure-openai-quickstart
```

Change your directory to the newly created app folder. You can build the application with:

```dotnetcli
dotnet build
```

The build output should contain no warnings or errors.

```output
...
Build succeeded.
 0 Warning(s)
 0 Error(s)
...
```

Install the OpenAI .NET client library with:

```console
dotnet add package Azure.AI.OpenAI --prerelease
```
