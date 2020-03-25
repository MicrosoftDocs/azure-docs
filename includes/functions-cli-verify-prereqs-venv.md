---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/25/2020
ms.author: glenga
---
### Prerequisite check

+ In a terminal or command window, run `func --version` to check that the Azure Functions Core Tools are version 2.7.1846 or later.

+ Run `az --version` to check that the Azure CLI version is 2.0.76 or later.

+ Run `az login` to sign in to Azure and verify an active subscription.

+ Run `docker login` to sign in to Docker. This command fails if Docker is not running, in which case start docker and retry the command.
::: zone pivot="programming-language-python"  
+ Run `python --version` (Linux/MacOS) or `py --version` (Windows) to check your Python version reports 3.8.x, 3.7.x or 3.6.x.

## <a name="create-venv"></a>Create and activate a virtual environment

In a suitable folder, run the following commands to create and activate a virtual environment named `.venv`. Be sure to use Python 3.8, 3.7 or 3.6, which are supported by Azure Functions.

# [bash](#tab/bash)

```bash
python -m venv .venv
```

```bash
source .venv/bin/activate
```

If Python didn't install the venv package on your Linux distribution, run the following command:

```bash
sudo apt-get install python3-venv
```

# [PowerShell](#tab/powershell)

```powershell
py -m venv .venv
```

```powershell
.venv\scripts\activate
```

# [Cmd](#tab/cmd)

```cmd
py -m venv .venv
```

```cmd
.venv\scripts\activate
```

---

You run all subsequent commands in this activated virtual environment. (To exit the virtual environment, run `deactivate`.)

::: zone-end