---
title: Debug PowerShell Azure Functions locally
description: Understand how to develop functions by using PowerShell.
author: tylerleonhardt
ms.topic: conceptual
ms.date: 04/22/2019
ms.author: tyleonha
ms.reviewer: glenga
# Customer intent: As a PowerShell developer, I want to learn how to debug my functions on my local computer so that I can publish higher quality code to Azure.
---

# Debug PowerShell Azure Functions locally

Azure Functions lets you develop your functions as PowerShell scripts.

You can debug your PowerShell functions locally as you would any PowerShell scripts using the following standard development tools:

* [Visual Studio Code](https://code.visualstudio.com/): Microsoft's free, lightweight, and open-source text editor with the PowerShell extension that offers a full PowerShell development experience.
* A PowerShell console: Debug using the same commands you would use to debug any other PowerShell process.

[Azure Functions Core Tools](functions-run-local.md) supports local debugging of Azure Functions, including PowerShell functions.

## Example function app

The function app used in this article has a single HTTP triggered function and has the following files:

```
PSFunctionApp
 | - HttpTriggerFunction
 | | - run.ps1
 | | - function.json
 | - local.settings.json
 | - host.json
 | - profile.ps1
```

This function app is similar to the one you get when you complete the [PowerShell quickstart](functions-create-first-function-powershell.md).

The function code in `run.ps1` looks like the following script:

```powershell
param($Request)

$name = $Request.Query.Name

if($name) {
    $status = 200
    $body = "Hello $name"
}
else {
    $status = 400
    $body = "Please pass a name on the query string or in the request body."
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = $status
    Body = $body
})
```

## Set the attach point

To debug any PowerShell function, the function needs to stop for the debugger to be attached. The `Wait-Debugger` cmdlet stops execution and waits for the debugger.

All you need to do is add a call to the `Wait-Debugger` cmdlet just above the `if` statement, as follows:

```powershell
param($Request)

$name = $Request.Query.Name

# This is where we will wait for the debugger to attach
Wait-Debugger

if($name) {
    $status = 200
    $body = "Hello $name"
}
# ...
```

Debugging starts at the `if` statement. 

With `Wait-Debugger` in place, you can now debug the functions using either Visual Studio Code or a PowerShell console.

## Debug in Visual Studio Code

To debug your PowerShell functions in Visual Studio Code, you must have the following installed:

* [PowerShell extension for Visual Studio Code](/powershell/scripting/components/vscode/using-vscode)
* [Azure Functions extension for Visual Studio Code](functions-create-first-function-vs-code.md)
* [PowerShell Core 6.2 or higher](/powershell/scripting/install/installing-powershell-core-on-windows)

After installing these dependencies, load an existing PowerShell Functions project, or [create your first PowerShell Functions project](functions-create-first-function-powershell.md).

>[!NOTE]
> Should your project not have the needed configuration files, you are prompted to add them.

### Set the PowerShell version

PowerShell Core installs side by side with Windows PowerShell. Set PowerShell Core as the PowerShell version to use with the PowerShell extension for Visual Studio Code.

1. Press F1 to display the command pallet, then search for `Session`.

1. Choose **PowerShell: Show Session Menu**.

1. If your **Current session** isn't **PowerShell Core 6**, choose **Switch to: PowerShell Core 6**.

When you have a PowerShell file open, you see the version displayed in green at the bottom right of the window. Selecting this text also displays the session menu. To learn more, see the [Choosing a version of PowerShell to use with the extension](/powershell/scripting/components/vscode/using-vscode#choosing-a-version-of-powershell-to-use-with-the-extension).

### Start the function app

Verify that `Wait-Debugger` is set in the function where you want to attach the debugger.  With `Wait-Debugger` added, you can debug your function app using Visual Studio Code.

Choose the **Debug** pane and then **Attach to PowerShell function**.

![debugger](https://user-images.githubusercontent.com/2644648/56166073-8a7b3780-5f89-11e9-85ce-36ed38e221a2.png)

You can also press the F5 key to start debugging.

The start debugging operation does the following tasks:

* Runs `func extensions install` in the terminal to install any Azure Functions extensions required by your function app.
* Runs `func host start` in the terminal to start the function app in the Functions host.
* Attach the PowerShell debugger to the PowerShell runspace within the Functions runtime.

>[!NOTE]
> You need to ensure PSWorkerInProcConcurrencyUpperBound is set to 1 to ensure correct debugging experience in Visual Studio Code. This is the default.

With your function app running, you need a separate PowerShell console to call the HTTP triggered function.

In this case, the PowerShell console is the client. The `Invoke-RestMethod` is used to trigger the function.

In a PowerShell console, run the following command:

```powershell
Invoke-RestMethod "http://localhost:7071/api/HttpTrigger?Name=Functions"
```

You'll notice that a response isn't immediately returned. That's because `Wait-Debugger` has attached the debugger and PowerShell execution went into break mode as soon as it could. This is because of the [BreakAll concept](#breakall-might-cause-your-debugger-to-break-in-an-unexpected-place), which is explained later. After you press the `continue` button, the debugger now breaks on the line right after `Wait-Debugger`.

At this point, the debugger is attached and you can do all the normal debugger operations. For more information on using the debugger in Visual Studio Code, see [the official documentation](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).

After you continue and fully invoke your script, you'll notice that:

* The PowerShell console that did the `Invoke-RestMethod` has returned a result
* The PowerShell Integrated Console in Visual Studio Code is waiting for a script to be executed

Later when you invoke the same function, the debugger in PowerShell extension breaks right after the `Wait-Debugger`.

## Debugging in a PowerShell Console

>[!NOTE]
> This section assumes you have read the [Azure Functions Core Tools docs](functions-run-local.md) and know how to use the `func host start` command to start your function app.

Open up a console, `cd` into the directory of your function app, and run the following command:

```sh
func host start
```

With the function app running and the `Wait-Debugger` in place, you can attach to the process. You do need two more PowerShell consoles.

One of the consoles acts as the client. From this, you call `Invoke-RestMethod` to trigger the function. For example, you can run the following command:

```powershell
Invoke-RestMethod "http://localhost:7071/api/HttpTrigger?Name=Functions"
```

You'll notice that it doesn't return a response, which is a result of the `Wait-Debugger`. The PowerShell runspace is now waiting for a debugger to be attached. Let's get that attached.

In the other PowerShell console, run the following command:

```powershell
Get-PSHostProcessInfo
```

This cmdlet returns a table that looks like the following output:

```output
ProcessName ProcessId AppDomainName
----------- --------- -------------
dotnet          49988 None
pwsh            43796 None
pwsh            49970 None
pwsh             3533 None
pwsh            79544 None
pwsh            34881 None
pwsh            32071 None
pwsh            88785 None
```

Make note of the `ProcessId` for the item in the table with the `ProcessName` as `dotnet`. This process is your function app.

Next, run the following snippet:

```powershell
# This enters into the Azure Functions PowerShell process.
# Put your value of `ProcessId` here.
Enter-PSHostProcess -Id $ProcessId

# This triggers the debugger.
Debug-Runspace 1
```

Once started, the debugger breaks and shows something like the following output:

```
Debugging Runspace: Runspace1

To end the debugging session type the 'Detach' command at the debugger prompt, or type 'Ctrl+C' otherwise.

At /Path/To/PSFunctionApp/HttpTriggerFunction/run.ps1:13 char:1
+ if($name) { ...
+ ~~~~~~~~~~~
[DBG]: [Process:49988]: [Runspace1]: PS /Path/To/PSFunctionApp>>
```

At this point, you're stopped at a breakpoint in the [PowerShell debugger](/powershell/module/microsoft.powershell.core/about/about_debuggers). From here, you can do all of the usual debug operations,  step over, step into, continue, quit, and others. To see the complete set of debug commands available in the console, run the `h` or `?` commands.

You can also set breakpoints at this level with the `Set-PSBreakpoint` cmdlet.

Once you continue and fully invoke your script, you'll notice that:

* The PowerShell console where you executed `Invoke-RestMethod` has now returned a result.
* The PowerShell console where you executed `Debug-Runspace` is waiting for a script to be executed.

You can invoke the same function again (using `Invoke-RestMethod` for example) and the debugger breaks in right after the `Wait-Debugger` command.

## Considerations for debugging

Keep in mind the following issues when debugging your Functions code.

### `BreakAll` might cause your debugger to break in an unexpected place

The PowerShell extension uses `Debug-Runspace`, which in turn relies on PowerShell's `BreakAll` feature. This feature tells PowerShell to stop at the first command that is executed. This behavior gives you the opportunity to set breakpoints within the debugged runspace.

The Azure Functions runtime runs a few commands before actually invoking your `run.ps1` script, so it's possible that the debugger ends up breaking within the `Microsoft.Azure.Functions.PowerShellWorker.psm1` or `Microsoft.Azure.Functions.PowerShellWorker.psd1`.

Should this break happen,  run the `continue` or `c` command to skip over this breakpoint. You then stop at the expected breakpoint.

## Next steps

To learn more about developing Functions using PowerShell, see [Azure Functions PowerShell developer guide](functions-reference-powershell.md).
