---
author: aahill
ms.service: azure-ai-services
ms.topic: include
ms.date: 06/24/2019
ms.author: aahi
---

## Configure an environment variable for authentication

Your application must be authenticated to access Azure AI services resources. To set the environment variable for your resource key, open a console window, and follow the instructions for your operating system and development environment. To set the `COGNITIVE_SERVICE_KEY` environment variable, replace `your-key` with one of the keys for your resource.

For production, use a secure way of storing and accessing your credentials, such as a password-protected secret vault. For test, writing to an environment variable is standard practice, but keep in mind that environment variables are stored in clear text on the local machine.

> [!TIP]
> Don't include the key directly in your code, and never post it publicly. See the Azure AI services [security](../../security-features.md) article for more authentication options like [Azure Key Vault](../../use-key-vault.md). 



#### [Windows](#tab/windows)

PowerShell includes an extensible solution,
[Secret Management](/powershell/module/microsoft.powershell.secretmanagement),
for storing secure strings in platforms such as [Secret Store](/powershell/module/microsoft.powershell.secretstore) or [Azure KeyVault](/powershell/utility-modules/secretmanagement/how-to/using-azure-keyvault).

To set up a secret store to host secure strings, see the article
[Getting started using secret store](/powershell/utility-modules/secretmanagement/get-started/using-secretstore). Then use the following examples to store your api keys.

```powershell
Set-Secret -Name COGNITIVE_SERVICE_KEY -value your-key
```

For test environments, you can either use PowerShell's `$Env:` syntax to set an environment variable for only the current session, or the `setx` command to retain the variable across sessions. Remember that these values are stored in clear text in Windows registry keys.

```powershell
$Env:COGNITIVE_SERVICE_KEY = your-key
```

```console
setx COGNITIVE_SERVICE_KEY your-key
```

After you add the environment variable using `setx`, you may need to restart any running consoles or other programs that will need to read the environment variable. For example, if you are using Visual Studio as your editor, restart Visual Studio before running the example. 

#### [Linux](#tab/linux)

```bash
export COGNITIVE_SERVICE_KEY=your-key
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/macos)

##### Bash

Edit your .bash_profile, and add the environment variable:

```bash
export COGNITIVE_SERVICE_KEY=your-key
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective.

##### Xcode

For iOS and macOS development, you set the environment variables in Xcode. For example, follow these steps to set the environment variable in Xcode 13.4.1.

1. Select **Product** > **Scheme** > **Edit scheme**
1. Select **Arguments** on the **Run** (Debug Run) page
1. Under **Environment Variables** select the plus (+) sign to add a new environment variable. 
1. Enter `COGNITIVE_SERVICE_KEY` for the **Name** and enter your resource key for the **Value**.

For more configuration options, see the [Xcode documentation](https://help.apple.com/xcode/#/dev745c5c974).
***

To set the environment variable for your Speech resource region, follow the same steps. Set `COGNITIVE_SERVICE_REGION` to the region of your resource. For example, `westus`.