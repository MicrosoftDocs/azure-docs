---
title: Install the Azure File Sync Agent on Arc-enabled Windows Servers
description: Learn how to install the Azure File Sync agent for Windows on Azure Arc-enabled Windows servers.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 06/20/2025
ms.author: kendownie
---

# Install and manage the Azure File Sync agent extension on Azure Arc-enabled Windows servers

This article describes how to install, validate, and uninstall the Azure File Sync agent extension on Azure Arc-enabled Windows servers. The **Azure File Sync Agent for Windows** extension deploys the **Azure File Sync Agent** on a Windows server connected through Azure Arc, allowing the server to sync files with an Azure file share. The extension is published by Microsoft and can be managed using the Azure portal, Azure PowerShell, or Azure CLI.

## Prerequisites

* **Azure Arc-enabled server (Windows only):** The target machine must be connected to Azure Arc (Azure Connected Machine agent installed and onboarding completed) and running a supported Windows Server OS. Azure File Sync is supported on Windows Server 2012 R2 or later (see [Azure File Sync system requirements and interoperability](file-sync-planning.md#windows-file-server-considerations) for details on supported versions).

  > [!IMPORTANT]
  > The Azure File Sync agent extension is **only supported on Windows**. Linux Arc-enabled servers aren't supported for Azure File Sync.

* **Arc-enabled server** must have the Microsoft Root Certificate (Microsoft Root Certificate Authority 2011) installed. For more details, refer to this [document](https://www.microsoft.com/pkiops/docs/repository.htm?msockid=3c29821248c46e53259f971249716f32).

* **Azure resources:** An **Azure Storage Sync Service** should exist in your Azure subscription to register your server after installing the agent. (You don't need to have the server registered *before* installation, but you'll register it to a Storage Sync Service to begin syncing. This is covered in [Next steps](#next-steps).)

* **Azure PowerShell or Azure CLI environment:**

  * For **Azure PowerShell**, install the Azure PowerShell module (Az module) with the **Az.ConnectedMachine** module. Ensure you have the latest Az PowerShell installed and run `Connect-AzAccount` to sign in to Azure.
  * For **Azure CLI**, install the Azure CLI and sign in (`az login`). Ensure the Azure CLI has the Connected Machine extension installed by running:

    ```azurecli
    az extension add --name connectedmachine
    ```

    *The Connected Machine extension provides the `az connectedmachine` commands that you'll need.*

* **Network connectivity:** The server must have network access to Azure endpoints required by Azure Arc and Azure File Sync (for example, to download the extension and to reach Azure File Sync service endpoints). Ensure firewall or proxy settings allow the necessary Azure service URLs. See [Azure File Sync proxy and firewall settings](file-sync-firewall-and-proxy.md) for more information.

## Install the agent extension

You can install the **Azure File Sync Agent for Windows** extension on an Arc-enabled Windows server using the Azure portal, Azure PowerShell, or Azure CLI.

# [Azure portal](#tab/azure-portal)

1. **Open the Arc-enabled server resource:** In the Azure portal, navigate to **Azure Arc > Machines** and select the Arc-enabled Windows server on which you want to install the extension.

2. **Add extension:** Under the server's **Extensions** section, select **+ Add**. In the list of available extensions, find and select the **Azure File Sync Agent for Windows** extension (published by *Microsoft*), and then select **Next**.

:::image type="content" source="media/file-sync-extension/file-sync-extension-install.png" alt-text="Screenshot showing how to install the Azure File Sync agent extension for Windows":::

3. **Configure settings:** Configure the settings for the Azure File Sync agent that will be installed on the Arc machine. See the **Available settings** section for the full list of settings and their meaning.

:::image type="content" source="media/file-sync-extension/file-sync-extension-settings.png" alt-text="Screenshot showing how to configure the Azure File Sync agent extension for Windows":::

4. **Install:** Select **Review + create** to deploy the extension. Azure will initiate the installation of the extension which installs the latest version of Azure File Sync agent on the server. Within a few minutes, the extension should be installed. You can monitor the deployment progress in the Azure portal. Once finished, the extension will appear with status **Provisioning succeeded** in the Extensions list.

# [Azure PowerShell](#tab/azure-powershell)

Use the `New-AzConnectedMachineExtension` cmdlet to install the extension on an Arc-enabled Windows server. The following example installs the extension on a specified machine. Replace the placeholders with your resource names. See [Available settings](#available-settings) for the full list of settings that you can add to the settings parameter.

**Installing Azure File Sync extension without proxy settings**

```powershell
$Settings = @{
  EnableAgentAutoUpdate = "true"
  AutoUpdateScheduledDayOfWeek = "Monday"
  AutoUpdateScheduledHourOfDay = 05
  EnableServerDiagnostics = "true"
  AgentInstallDir = "C:\Custom Path\AFS"
  EnrollInMicrosoftUpdate = "true"
}

New-AzConnectedMachineExtension `
  -ResourceGroupName <resource-group-name> `
  -MachineName <machine-name> `
  -Name AzureFileSyncExtension `
  -SubscriptionId <subscriptionId> `
  -Location <region> `
  -TypeHandlerVersion <version> `
  -Publisher Microsoft.StorageSync `
  -ExtensionType AzureFileSyncExtension `
  -Settings $settings
```

**Installing Azure File Sync extension with proxy settings**

```powershell
$Settings = @{
  EnableAgentAutoUpdate = "true"
  AutoUpdateScheduledDayOfWeek = "Monday"
  AutoUpdateScheduledHourOfDay = 05
  EnableServerDiagnostics = "true"
  AgentInstallDir = "C:\Custom Path\AFS"
  EnrollInMicrosoftUpdate = "true"
  UseCustomProxy = "true"
  ProxyAddress = "http://proxy.contoso.com"
  ProxyPort = 1009
  ProxyAuthRequired = "true"
  ProxyUsername = "myuser"
}

$protectedSettings =@{
  ProxyPassword = "your_proxy_password"
}

New-AzConnectedMachineExtension `
  -ResourceGroupName <resource-group-name> `
  -MachineName <machine-name> `
  -Name AzureFileSyncExtension `
  -SubscriptionId <subscriptionId> `
  -Location <region> `
  -TypeHandlerVersion <version> `
  -Publisher Microsoft.StorageSync `
  -ExtensionType AzureFileSyncExtension `
  -Settings $settings `
  -ProtectedSetting $protectedSettings
```

# [Azure CLI](#tab/azure-cli)

Use the `az connectedmachine extension create` command to install the extension via Azure CLI. The following example deploys the extension to the specified Arc-enabled server. Replace placeholders with your information and modify the values as you prefer. See [Available settings](#available-settings) for the full list of settings.

Create a JSON file (`afs_settings.json`) with the settings for the agent:

```json
{
  "EnableAgentAutoUpdate": "true",
  "AutoUpdateScheduledDayOfWeek": "Monday",
  "AutoUpdateScheduledHourOfDay": 5,
  "EnableServerDiagnostics": "true",
  "AgentInstallDir": "C:\\Custom Path\\AFS",
  "EnrollInMicrosoftUpdate": "true",
  "UseCustomProxy": "true",
  "ProxyAddress": "http://proxy.contoso.com",
  "ProxyPort": 1009,
  "ProxyAuthRequired": "true",
  "ProxyUsername": "your_username"
}
```

Create another file (`afs_pwd.json`) with protected settings (e.g., proxy password).

```json
{
  "ProxyPassword": "your_proxy_password"
}
```

Run the following command:

```bash
az connectedmachine extension create \
  --name AzureFileSyncAgentExtension \
  --machine-name <machine> \
  --resource-group <machine rg> \
  --publisher Microsoft.StorageSync \
  --type AzureFileSyncAgentExtension \
  --settings "afs_settings.json" \
  --protected-settings "afs_pwd.json"
```
---

## Install using ARM template

You can also deploy the Azure File Sync agent extension to an Arc-enabled Windows server using an Azure Resource Manager (ARM) template. This method is useful for automation or large-scale deployments.

### 1. Prepare the parameters file

Create a `parameters.json` file with your customization details, including the VM name and extension settings:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "AgentInstallDir": { "value": "C:\\Program Files\\Azure\\StorageSyncAgent\\" },
    "UseCustomProxy": { "value": true },
    "ProxyAddress": { "value": "http://proxy.contoso.com" },
    "ProxyPort": { "value": "80" },
    "ProxyAuthRequired": { "value": true },
    "ProxyUserName": { "value": "ProxyUserName" },
    "ProxyPassword": { "value": "ProxyPassword" },
    "EnrollInMicrosoftUpdate": { "value": true },
    "EnableAgentAutoUpdate": { "value": true },
    "AutoUpdateScheduledDayOfWeek": { "value": "Monday" },
    "AutoUpdateScheduledHourOfDay": { "value": "23" },
    "EnableServerDiagnostics": { "value": true },
    "vmName": { "value": "ArcVM1" },
    "location": { "value": "eastus2euap" }
  }
}
```

### 2. Prepare the template file

Create a `template.json` file as shown here. This template defines the extension resource and maps parameters to extension settings:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "0.43.0.0",
  "parameters": {
    "vmName": { "type": "string" },
    "location": { "type": "string" },
    "agentInstallDir": { "type": "string", "defaultValue": "C:\\Program Files\\Azure\\StorageSyncAgent\\" },
    "useCustomProxy": { "type": "bool", "defaultValue": false },
    "proxyAddress": { "type": "string", "defaultValue": "" },
    "proxyPort": { "type": "string", "defaultValue": "0" },
    "proxyAuthRequired": { "type": "bool", "defaultValue": false },
    "proxyUsername": { "type": "string", "defaultValue": "" },
    "proxyPassword": { "type": "securestring", "defaultValue": "" },
    "enrollInMicrosoftUpdate": { "type": "bool", "defaultValue": true },
    "enableAgentAutoUpdate": { "type": "bool", "defaultValue": false },
    "autoUpdateScheduledDayOfWeek": { "type": "string", "defaultValue": "Tuesday" },
    "autoUpdateScheduledHourOfDay": { "type": "string", "defaultValue": "18" },
    "enableServerDiagnostics": { "type": "bool", "defaultValue": true }
  },
  "variables": {
    "AgentInstallDir": "[parameters('agentInstallDir')]",
    "UseCustomProxy": "[parameters('useCustomProxy')]",
    "ProxyAddress": "[parameters('proxyAddress')]",
    "ProxyPort": "[int(parameters('proxyPort'))]",
    "ProxyAuthRequired": "[parameters('proxyAuthRequired')]",
    "ProxyUserName": "[parameters('proxyUserName')]",
    "ProxyPassword": "[parameters('proxyPassword')]",
    "EnrollInMicrosoftUpdate": "[parameters('enrollInMicrosoftUpdate')]",
    "EnableAgentAutoUpdate": "[parameters('enableAgentAutoUpdate')]",
    "AutoUpdateScheduledDayOfWeek": "[parameters('autoUpdateScheduledDayOfWeek')]",
    "AutoUpdateScheduledHourOfDay": "[parameters('autoUpdateScheduledHourOfDay')]",
    "EnableServerDiagnostics": "[parameters('enableServerDiagnostics')]"
  },
  "resources": [
    {
      "name": "[concat(parameters('vmName'),'/AzureFileSyncAgentExtension')]",
      "type": "Microsoft.HybridCompute/machines/extensions",
      "location": "[parameters('location')]",
      "apiVersion": "2021-05-20",
      "properties": {
        "publisher": "Microsoft.StorageSync",
        "type": "AzureFileSyncAgentExtension",
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true,
        "settings": {
          "agentInstallDir": "[variables('AgentInstallDir')]",
          "useCustomProxy": "[variables('UseCustomProxy')]",
          "proxyAddress": "[variables('ProxyAddress')]",
          "proxyPort": "[variables('ProxyPort')]",
          "proxyAuthRequired": "[variables('ProxyAuthRequired')]",
          "proxyUsername": "[variables('ProxyUserName')]",
          "enrollInMicrosoftUpdate": "[variables('EnrollInMicrosoftUpdate')]",
          "enableAgentAutoUpdate": "[variables('EnableAgentAutoUpdate')]",
          "autoUpdateScheduledDayOfWeek": "[variables('AutoUpdateScheduledDayOfWeek')]",
          "autoUpdateScheduledHourOfDay": "[variables('AutoUpdateScheduledHourOfDay')]",
          "enableServerDiagnostics": "[variables('EnableServerDiagnostics')]"
        },
        "protectedSettings": {
          "proxyPassword": "[parameters('proxyPassword')]"
        }
      }
    }
  ]
}
```

### 3. Deploy the template

Use the following PowerShell command to deploy the template to your resource group:

```powershell
New-AzResourceGroupDeployment -ResourceGroupName "<ResourceGroupName>" -TemplateFile "template.json" -TemplateParameterFile "parameters.json"
```

Replace `<ResourceGroupName>` with the name of the resource group containing your Arc-enabled machine. This will deploy the Azure File Sync agent extension with your specified settings to the target Arc-enabled Windows server.

## Available settings

You can configure the following settings during installation of the Azure File Sync agent extension:

| Name                           | Purpose                                        | Value Type / Options         | Default                                               |
| ------------------------------ | ---------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| `AgentInstallDir`              | Directory to install the Azure File Sync agent | File path                    | `C:\Program Files\Azure\StorageSyncAgent\`            |
| `EnableAgentAutoUpdate`        | Automatically install latest agent updates     | `true` / `false`             | `false`                                               |
| `AutoUpdateScheduledDayOfWeek` | Day of the week to schedule auto-update        | `Sunday` to `Saturday`       | `Tuesday`                                             |
| `AutoUpdateScheduledHourOfDay` | Hour of the day for scheduled auto-update      | `0` to `23` (24-hour format) | `18` (6 PM)                                           |
| `EnableServerDiagnostics`      | Enable or disable agent diagnostic logging     | `true` / `false`             | `true`                                               |
| `EnrollInMicrosoftUpdate`      | Enroll in Microsoft Update service   | `true` / `false`             | `true`                                               |
| `UseCustomProxy`               | Use a custom proxy server for connectivity     | `true` / `false`             | `false`                                               |
| `ProxyAddress`                 | Address of custom proxy server                 | URL or IP address (e.g., http://proxy.example.com or https://192.168.1.1)           | *(Required if **`UseCustomProxy`** is **`true`**)*    |
| `ProxyPort`                    | Port for proxy server communication            | Port number (e.g., `8080`)   | *(Required if **`UseCustomProxy`** is **`true`**)*    |
| `ProxyAuthRequired`            | Indicates if proxy requires authentication     | `true` / `false`             | `false`                                               |
| `ProxyUserName`                | Username for proxy authentication              | Username string              | *(Required if **`ProxyAuthRequired`** is **`true`**)* |
| `ProxyPassword`                | Password for proxy authentication              | Password string              | *(Required if **`ProxyAuthRequired`** is **`true`**)* |

---

If the Azure Arc machine already has an Azure File Sync agent installed, the extension will install successfully and won't modify the existing Azure File Sync agent installed on the machine.

## Validate installation

After installation, verify that the Azure File Sync agent extension was deployed successfully and that the agent is running on your server.

# [Azure portal](#tab/azure-portal)

In the Azure portal, navigate to the Arc-enabled server resource and open the **Extensions** blade. Ensure the Azure File Sync agent extension is listed and its **Status** shows **Succeeded**. You can click on the extension to view more details like the version number and status message. Additionally, on the server itself, you can confirm that the **Azure File Sync Agent** is installed (for example, check **Programs and Features** or ensure the **FileSyncSvc** service is running).

# [Azure PowerShell](#tab/azure-powershell)

You can use Azure PowerShell to confirm that the extension is installed and in a succeeded state.

Use `Get-AzConnectedMachineExtension` to list or retrieve the extension on the machine:

```powershell
Get-AzConnectedMachineExtension `
  -ResourceGroupName <resource-group-name> `
  -MachineName <machine-name> `
  -Name <EXTENSION_NAME>
```

# [Azure CLI](#tab/azure-cli)

You can use Azure CLI to confirm that the extension is installed and in a succeeded state.

Use `az connectedmachine extension show` to get details of the installed extension:

```azurecli
az connectedmachine extension show \
  --resource-group "<resource-group-name>" \
  --machine-name "<machine-name>" \
  --name "<EXTENSION_NAME>"
```

---

The output will include information about the extension, such as its **provisioningState** (which should be *Succeeded* if the agent installed correctly), the **Type** (extension type name), and the **typeHandlerVersion** (which indicates the version of the Azure File Sync agent that was installed). Verify that the provisioning state is successful and that the reported version matches the expected agent version. If the extension isn't listed or the status isn't successful, review error details in the output or in the Azure portal for troubleshooting.

### Next steps

After installing the extension, the Azure File Sync agent should be installed in the Arc machine. However, to enable Azure File Sync on the machines, you need to complete the following steps.

* **Register the server with Azure File Sync:** Installing the agent is only the first step. To start syncing files, you must **register your Windows Server** with an Azure **Storage Sync Service** to establish trust between the server and Azure File Sync. Follow the steps in [Manage registered servers with Azure File Sync (Register/unregister a server)](file-sync-server-registration.md) to register your server if you haven't done so already.

* **Create sync groups and cloud endpoints:** After registration, create a **sync group** in your Storage Sync Service. A sync group links an Azure file share (cloud endpoint) and a folder on your registered server (server endpoint). See [How to deploy Azure File Sync](file-sync-deployment-guide.md) for an end-to-end guide on setting up the Storage Sync Service, creating sync groups, and adding server endpoints.

* **Learn more and troubleshoot:** For additional information, consult [Planning for an Azure File Sync deployment](file-sync-planning.md) to understand requirements and best practices. If you encounter issues during installation or server registration, refer to [Troubleshoot Azure File Sync agent installation and registration](/troubleshoot/azure/azure-storage/files/file-sync/file-sync-troubleshoot-installation) for common problems and solutions.

## Uninstall the agent extension

If you no longer require the Azure File Sync agent extension on a particular Arc-enabled server, you can uninstall the extension using the Azure portal, Azure PowerShell, or Azure CLI. Uninstalling the extension will **not** remove the Azure File Sync agent from the server.

 **Removing the Azure File Sync agent will stop any cloud sync on that server.** If the server is currently registered to a Storage Sync Service and participating in sync groups, uninstalling the agent will break the sync connection and the file sync topology. If you decide to remove the agent on the Arc machine, make sure to see **[deprovision or delete your Azure File Sync server endpoint](file-sync-server-endpoint-delete.md)** for detailed instructions on uninstalling the Azure File Sync agent.

# [Azure portal](#tab/azure-portal)

To uninstall the Azure File Sync agent extension using the Azure portal:

1. In the Azure portal, navigate to your Arc-enabled server and open the **Extensions + applications** section.
1. Find the Azure File Sync agent extension in the list of installed extensions. Select the extension to open its details.
1. Select **Uninstall** (or **Delete** extension) and confirm the prompt to remove the extension. Azure will uninstall the extension from the machine.
1. Wait for the extension to be removed. The extension entry will disappear from the Extensions list once uninstall is complete. On the Windows server, the Azure File Sync agent software will be uninstalled automatically as part of this process.

# [Azure PowerShell](#tab/azure-powershell)

Use the `Remove-AzConnectedMachineExtension` cmdlet to uninstall the extension from the Arc-enabled server:

```powershell
Remove-AzConnectedMachineExtension `
  -MachineName <machine-name> `
  -ResourceGroupName <resource-group-name> `
  -Name <EXTENSION_NAME>
```

# [Azure CLI](#tab/azure-cli)

Use `az connectedmachine extension delete` to remove the extension from the Arc-enabled server:

```azurecli
az connectedmachine extension delete \
  --machine-name "<machine-name>" \
  --resource-group "<resource-group-name>" \
  --name "<EXTENSION_NAME>"
```

---

These commands will initiate the removal of the Azure File Sync agent extension. Upon success, the extension is unregistered in Azure and you can no longer manage the Azure File Sync agent via the extension. You can verify removal by checking the **Extensions** list in the Azure portal (the extension should no longer appear), or by running the validation commands above (which should no longer find the extension). If the extension fails to uninstall, check the Azure Activity Log or the extension instance view for error details.
