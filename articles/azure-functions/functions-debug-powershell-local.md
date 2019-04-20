# Debugging PowerShell functions locally

Using the [Azure Functions Core Tools](functions-run-local) and the following tools, you can achieve the same rich debugging experience as you would expect when debugging regular PowerShell scripts:

* *Visual Studio Code* - Microsoft's free, lightweight, and open source text editor with the PowerShell extension that offers a first-class PowerShell experience
* *A PowerShell Console* - using the same commands you would use to debug any other PowerShell process

## Setup

For this guide, we'll work with the following simple function app:

```
PSFunctionApp
 | - MyHttpTriggerFunction
 | | - run.ps1
 | | - function.json
 | - local.settings.json
 | - host.json
 | - profile.ps1
```

Inside the `run.ps1` has:

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

To debug the Function, we first need set a place for the Function can stop. `Wait-Debugger` is the key.

Let's place a `Wait-Debugger` right above the `if` statement so our code looks like the following:

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

With a `Wait-Debugger` in place, you are ready to debug functions in your function app using either Visual Studio Code or a PowerShell console.

## Debug PowerShell functions using Visual Studio Code

With Visual Studio Code, you can debug local PowerShell functions right from the file editor. To do this you need the following two Visual Studio Code extensions:

* [PowerShell](/powershell/scripting/components/vscode/using-vscode)
* [Azure Functions](functions-create-first-function-vs-code.md)

With the PowerShell and Azure Functions extensions installed in Visual Studio Code, open load an existing function app project. You can also [create a Functions project](functions-create-first-function-vs-code.md).

>[!NOTE]
> If your project doesn't have the needed configuration files, you are prompted to add them.

Review the functions that you want to debug to make sure that `Wait-Debugger` is set where you want to attache the debugger.

### Start the function app

With our `Wait-Debugger` in place, you can now debug your function app using Visual Studio Code. 

Choose the **Debug** pane and then **Attach to PowerShell function**.

![debugger](https://user-images.githubusercontent.com/2644648/56166073-8a7b3780-5f89-11e9-85ce-36ed38e221a2.png)

You can also press the F5 keys.

That action will:

* Run `func extensions install` to install any Azure Functions extensions you may have
* Run `func host start` in the background which will start the function app
* Attach the PowerShell debugger to the PowerShell runspace within the Functions runtime

With our function app now running, all we need is one more PowerShell console.

The PowerShell console will be our client. We'll use `Invoke-RestMethod` (or `irm` for short) to invoke our Function. Let's do that now. In one of the PowerShell console's run:

```powershell
irm "http://localhost:7071/api/MyHttpTrigger?Name=Functions"
```

You'll notice that it doesn't return a response, that's because of our `Wait-Debugger`! Since the debugger is attached, it will break as soon as PowerShell can break. This is because of the [BreakAll concept](#breakall-might-cause-your-debugger-to-break-in-an-unexpected-place) which is explained below. Once you hit the `continue` button, the debugger will break on the line right after our `Wait-Debugger`.

From here, we can do all the normal debugger operations. For more information on using the debugger in VSCode, take a look at the [VSCode official documentation](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).

Once you continue and fully invoke your script, you'll notice that:

1. The PowerShell Console that did the `Invoke-RestMethod` has returned a result
1. The PowerShell Integrated Console in VSCode is waiting for a script to be executed

You can invoke the same function again (using `irm` for example) and the debugger in PowerShell extension will pick up and drop you right after the `Wait-Debugger` is. This approach is a great way to continually test your Functions!

## Debugging a PowerShell function app with a PowerShell Console

>[!NOTE]
> This guide assumes you have read the [Azure Functions Core Tools docs](functions-run-local.md) and know how to use the `func host start` command to start your function app.

Open up a console, `cd` into the directory of your function app, and run:

```sh
func host start
```

With the function app running and our `Wait-Debugger` in place, we're ready to attach to the process. All we need is two more PowerShell consoles.

One of them, will be our client. We'll use `Invoke-RestMethod` (or `irm` for short) to invoke our Function. Let's do that now. In one of the PowerShell console's, run:

```powershell
irm "http://localhost:7071/api/MyHttpTrigger?Name=Functions"
```

You'll notice that it doesn't return a response, that's because of our `Wait-Debugger`! The PowerShell runspace is now waiting for a debugger to be attached. Let's get that attached.

In the other PowerShell console, run:

```powershell
Get-PSHostProcessInfo
```

This cmdlet will give you a table that looks like this output:

```
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
# This will enter into the the Azure Functions PowerShell process
# Put your value of `ProcessId` here
Enter-PSHostProcess -Id $ProcessId

# This will trigger the debugger
Debug-Runspace 1
```

Once run, the debugger will break and show something like the following output:

```
Debugging Runspace: Runspace1

To end the debugging session type the 'Detach' command at the debugger prompt, or type 'Ctrl+C' otherwise.

At /Path/To/PSFunctionApp/MyHttpTriggerFunction/run.ps1:13 char:1
+ if($name) { ...
+ ~~~~~~~~~~~
[DBG]: [Process:49988]: [Runspace1]: PS /Path/To/PSFunctionApp>>
```

At this point, we're stopped at a breakpoint in the debugger. From here, you can run the `h` or `?` commands to see what commands are available to do:

```
[DBG]: [Process:49988]: [Runspace1]: PS /Path/To/PSFunctionApp>> h

 s, stepInto         Single step (step into functions, scripts, etc.)
 v, stepOver         Step to next statement (step over functions, scripts, etc.)
 o, stepOut          Step out of the current function, script, etc.

 c, continue         Continue operation
 q, quit             Stop operation and exit the debugger
 d, detach           Continue operation and detach the debugger.

 k, Get-PSCallStack Display call stack

 l, list             List source code for the current script.
                     Use "list" to start from the current line, "list <m>"
                     to start from line <m>, and "list <m> <n>" to list <n>
                     lines starting from line <m>

 <enter>             Repeat last command if it was stepInto, stepOver or list

 ?, h                displays this help message.


For instructions about how to customize your debugger prompt, type "help about_prompt".
```

You can also set breakpoints at this level with the `Set-PSBreakpoint` cmdlet.

Once you continue and fully invoke your script, you'll notice that:

1. The PowerShell Console that did the `Invoke-RestMethod` has returned a result
1. The PowerShell Console that ran `Debug-Runspace` is waiting for a script to be executed

You can invoke the same function again (using `irm` for example) and the debugger will pick up and drop you right after the `Wait-Debugger` is. This approach is a great way to continually test your Functions!

## Considerations for debugging

### `BreakAll` might cause your debugger to break in an unexpected place

When using `Debug-Runspace` (which is what the PowerShell extension also uses under the hood), PowerShell's `BreakAll` feature kicks in. This feature tells PowerShell to stop at the first command that is executed.

The Azure Functions runtime runs a few commands before actually invoking your `run.ps1` script so it's possible that the debugger ends up breaking within the `Microsoft.Azure.Functions.PowerShellWorker.psm1` or `Microsoft.Azure.Functions.PowerShellWorker.psd1`.

If this break happens, don't be afraid! All you have to do is run the `continue` or `c` command to skip over this breakpoint and get you to where you expected to break.
