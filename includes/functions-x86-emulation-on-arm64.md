---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/05/2022
ms.author: glenga
---

## x86 emulation on ARM64

Functions doesn't currently support Python function development on ARM64 devices. Use the following steps to develop Python functions on a Mac with an M1 chip by running in an emulated x86 environment. 

### Enable Rosetta in Terminal

1. In your Mac, open Finder and navigate to **Applications**. 

1. Find Terminal, right-click and select 'Get Info'. You can also create a separate parallel environment by duplicating the Terminal and re-naming it.

    ![Right-Click](./media/arm-64-python/arm-64-python-1.png)

1. Select 'Open using Rosetta'.

    ![Rosetta](./media/arm-64-python/arm-64-python-2.png)

1. Open Terminal with Rosetta enabled, and type the following command to validate.

    ```cmd
    $ arch
    i386
    ```

1. Make sure that you are using `zsh`.

### Install required packages 
 
Next, install all needed packages in this environment. 

* Install [homebrew](https://brew.sh/) to the path `/usr/local/bin/brew`.
* Install Python 
* Install the [Core Tools package](/functions-run-local.md#install-the-azure-functions-core-tools)

### Set aliases (optional)

You can optionally set aliases to make it easy to reference the right versions in Rosetta. 

Following is an example of terminal set up.


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

Run the following to ensure the aliases are applied.

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