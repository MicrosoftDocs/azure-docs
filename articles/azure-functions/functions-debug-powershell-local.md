# Debugging PowerShell functions locally

Using the [Azure Functions Core Tools](functions-run-local) and the following tools, you can achieve the same rich debugging experience as you would expect when debugging regular PowerShell scripts:

* *Visual Studio Code* - Microsoft's free, lightweight, and open source text editor with the PowerShell extension that offers a first-class PowerShell experience
* *A PowerShell Console* - using the same commands you would use to debug any other PowerShell process

>[!NOTE]
> This guide assumes you have read the [Azure Functions Core Tools docs](functions-run-local) and know how to use the `func host start` command to start your Function App.

## Setup

For this guide, we'll work with the following simple Function App:

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

With a `Wait-Debugger` in place, open up a console, `cd` into the directory of your Function App, and run:

```sh
func host start
```

> [!NOTE]
> If you're using Visual Studio Code to debug, make sure you run the function app in a different console than the PowerShell Integrated Console.

From here, we're ready to either use VSCode, or a PowerShell Console, to debug our Function.

## Debugging a PowerShell Function App with Visual Studio Code

With Visual Studio Code and the PowerShell extension, you can debug local PowerShell Azure Functions with ease - right from your text editor. For more information on how to install VSCode and the PowerShell extension, see the docs [here](/powershell/scripting/components/vscode/using-vscode).

> [!ATTENTION]
> Currently, PowerShell Function Apps are not integrated into the [Azure Functions extension for VSCode](functions-create-first-function-vs-code). You may still use it to manage your PowerShell Function Apps running in Azure, but the local create and debug experience is not available at this time.

### VSCode setup

Now that you have the PowerShell extension installed in VSCode, we need to add the debug configuration that will allow us to attach to processes.

First, open up your Function App in VSCode. You'll want to then navigate to the debugging pane:

![Debugging Pane](https://user-images.githubusercontent.com/2644648/52159135-e7d33e00-2654-11e9-8882-ba649274136d.png)

From here, if you don't already have the "PowerShell: Attach to Host Process", click the drop-down menu and select "Add Configuration...":

![Add configuration](https://user-images.githubusercontent.com/2644648/52159158-2cf77000-2655-11e9-9001-edc169da46f3.png)

The drop-down item will open the `launch.json` file and give you a menu of configurations you can add. Scroll down the list and find the "PowerShell: Attach to Host Process" config and click it:

![Attach to Host Process](https://user-images.githubusercontent.com/2644648/52159176-63cd8600-2655-11e9-8ae6-fdd67edaf8da.png)

Safe the file and you might notice and make sure that the configuration is selected in the configuration drop-down:

![added configuration](https://user-images.githubusercontent.com/2644648/52159200-96777e80-2655-11e9-81e5-5b4719f05351.png)

VSCode is now set up for debugging our Functions!

### Let's attach the debugger

With the Function App running, our `Wait-Debugger` in place, and VSCode setup, we are ready to attach to the process. All we need is one more PowerShell console.

The PowerShell console will be our client. We'll use `Invoke-RestMethod` (or `irm` for short) to invoke our Function. Let's do that now. In one of the PowerShell console's run:

```powershell
irm "http://localhost:7071/api/MyHttpTrigger?Name=Functions"
```

You'll notice that it doesn't return a response, that's because of our `Wait-Debugger`!

Now in VSCode, with "PowerShell: Attach to Host Process" selected in the dropdown, you can hit the green play button or hit <kbd>F5</kbd> to start the debugger. That action will give you a drop-down with a list of other PowerShell runspaces on your machine. You'll want to select the one that says `dotnet` as the Azure Functions Runtime is a .NET application that is hosting PowerShell:

![pick the dotnet process](https://user-images.githubusercontent.com/2644648/52159209-c888e080-2655-11e9-9e42-2e0d36724dba.png)

Once selected, the debugger will jump to the line right after the `Wait-Debugger` we put in our script.

![breakpoint hit](https://user-images.githubusercontent.com/2644648/52159234-11409980-2656-11e9-884d-19b761a660c1.png)

From here, we can do all the normal debugger operations. For more information on using the debugger in VSCode, take a look at the [VSCode official documentation](https://code.visualstudio.com/Docs/editor/debugging#_debug-actions).

Once you continue and fully invoke your script, you'll notice that:

1. The PowerShell Console that did the `Invoke-RestMethod` has returned a result
1. The PowerShell Integrated Console in VSCode is waiting for a script to be executed

You can invoke the same function again (using `irm` for example) and the debugger in PowerShell extension will pick up and drop you right after the `Wait-Debugger` is. This approach is a great way to continually test your Functions!

## Debugging a PowerShell Function App with a PowerShell Console

With the Function App running and our `Wait-Debugger` in place, we're ready to attach to the process. All we need is two more PowerShell consoles.

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

Make note of the `ProcessId` for the item in the table with the `ProcessName` as `dotnet`. This process is your Function App.

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
