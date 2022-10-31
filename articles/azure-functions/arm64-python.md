---
title: Azure Functions with ARM 64
description: If you are using ARM 64 and Azure Functions in Python, leverage this workaround to continue to use Azure Functions with using Rosetta.
ms.topic: how-to
ms.date: 10/31/2022
---
# Azure Functions with ARM 64

Currently, Azure Functions in Python does not support ARM 64. The recommended workaround is to simulate an x86 environment. If you are using an M1 Mac, leverage the following steps to run Azure Functions.

1. Enable Rosetta in Terminal

Open Finder, and navigate to Applications. Find Terminal, right click and select 'Get Info'. Optionally, duplicate Terminal and re-name it to create a separate parallel environment.

![Right-Click](../media/arm-64-python/arm-64-python-1.png)

Next, select 'Open using Rosetta'.

![Rosetta](../media/arm-64-python/arm-64-python-2.png)

Open Terminal with Rosetta enabled, and type the following command to validate.

```cmd
$ arch
i386
```

Additionally, check that you are using zsh.

2. Next, install all needed packages in this environment. You can start by installing homebrew using this command. 

Next, install you Python and Core Tools.

3. Optionally, set aliases so it is easy to reference the right versions in Rosetta. Following is an example of terminal set up.


```c
# file: .zshrc
# rosetta terminal setup
if [ $(arch) = "i386" ]; then
    alias python="/usr/local/bin/python3"
    alias brew86='/usr/local/bin/brew'
    alias pyenv86="arch -x86_64 pyenv"
    alias func="/usr/local/Cellar/azure-functions-core-tools@4/4.0.4785/func"
fi
```

Type the following to ensure the aliases are applied.

```cmd
$ source .zshrc
```

You can also validate the correct versions are being referenced by using the 'which' command.

```cmd
$ which python
python: aliased to /usr/local/bin/python3
```

```cmd
$ which func
func: aliased to /usr/local/Cellar/azure-functions-core-tools@4/4.0.4785/func
```

Now, you are set up to use Azure Functions in the x86 environment with command prompt.

4. If you are using VS Code, and would like to use the incorporated Terminal and simulate the x86 environment, do the following:

* Open Command Palette by pressing Cmd+Shift+P.
![open-settings](../media/arm-64-python/open-settings.png)

* Select "Preferences: Open Settings (JSON)" and add the following:

```json
"terminal.integrated.profiles.osx": {
       "rosetta": {
         "path": "arch",
         "args": ["-x86_64", "zsh", "-l"],
         "overrideName": true
       }
     }
```
* Open a new Terminal in VS Code using Rosetta.

![vsc-rosetta](../media/arm-64-python/vsc-rosetta.png)