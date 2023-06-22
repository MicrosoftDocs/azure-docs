---
title: Manage connections in Azure Automation
description: This article tells how to manage Azure Automation connections to external services or applications and how to work with them in runbooks.
services: automation
ms.subservice: shared-capabilities
ms.date: 04/12/2023
ms.topic: conceptual
ms.custom: devx-track-azurepowershell, devx-track-python
---

# Manage connections in Azure Automation

An Azure Automation connection asset contains the information listed below. This information is required for connection to an external service or application from a runbook or DSC configuration. 

* Information needed for authentication, such as user name and password
* Connection information, such as URL or port

The connection asset keeps together all properties for connecting to a particular application, making it unnecessary to create multiple variables. You can edit the values for a connection in one place, and you can pass the name of a connection to a runbook or DSC configuration in a single parameter. The runbook or configuration accesses the properties for a connection using the internal `Get-AutomationConnection` cmdlet.

When you create a connection, you must specify a connection type. The connection type is a template that defines a set of properties. You can add a connection type to Azure Automation using an integration module with a metadata file. It's also possible to create a connection type using the [Azure Automation API](/previous-versions/azure/reference/mt163818(v=azure.100)) if the integration module includes a connection type and is imported into your Automation account. 

>[!NOTE]
>Secure assets in Azure Automation include credentials, certificates, connections, and encrypted variables. These assets are encrypted and stored in Azure Automation using a unique key that is generated for each Automation account. Azure Automation stores the key in the system-managed Key Vault. Before storing a secure asset, Automation loads the key from Key Vault and then uses it to encrypt the asset. 

## Connection types

Azure Automation makes the following built-in connection types available:

* `Azure` - Represents a connection used to manage classic resources.
* `AzureServicePrincipal` - Represents a connection used to manage resources in Azure using a service principal.
* `AzureClassicCertificate` - This connection type is used to manage resources in Azure that were created using the classic deployment model that doesn't support Service Principal authentication.

## PowerShell cmdlets to access connections

The cmdlets in the following table create and manage Automation connections with PowerShell. They ship as part of the Az modules.

|Cmdlet|Description|
|---|---|
|[Get-AzAutomationConnection](/powershell/module/az.automation/get-azautomationconnection)|Retrieves information about a connection.|
|[New-AzAutomationConnection](/powershell/module/az.automation/new-azautomationconnection)|Creates a new connection.|
|[Remove-AzAutomationConnection](/powershell/module/Az.Automation/Remove-AzAutomationConnection)|Removes an existing connection.|
|[Set-AzAutomationConnectionFieldValue](/powershell/module/Az.Automation/Set-AzAutomationConnectionFieldValue)|Sets the value of a particular field for an existing connection.|

## Internal cmdlets to access connections

The internal cmdlet in the following table is used to access connections in your runbooks and DSC configurations. This cmdlet comes with the global module `Orchestrator.AssetManagement.Cmdlets`. For more information, see [Internal cmdlets](shared-resources/modules.md#internal-cmdlets).

|Internal Cmdlet|Description|
|---|---|
|`Get-AutomationConnection` | Retrieves the values of the different fields in the connection and returns them as a [hashtable](/powershell/module/microsoft.powershell.core/about/about_hash_tables). You can then use this hashtable with the appropriate commands in the runbook or DSC configuration.|

>[!NOTE]
>Avoid using variables with the `Name` parameter of `Get-AutomationConnection`. Use of variables in this case can complicate discovery of dependencies between runbooks or DSC configurations and connection assets at design time.

## Python functions to access connections

The function in the following table is used to access connections in a Python 2 and 3 runbook. Python 3 runbooks are currently in preview.

| Function | Description |
|:---|:---|
| `automationassets.get_automation_connection` | Retrieves a connection. Returns a dictionary with the properties of the connection. |

> [!NOTE]
> You must import the `automationassets` module at the top of your Python runbook to access the asset functions.

## Create a new connection

### Create a new connection with the Azure portal

To create a new connection in the Azure portal:

1. From your Automation account, click **Connections** under **Shared Resources**.
2. Click **+ Add a connection** on the Connections page.
4. In the **Type** field on the New Connection pane, select the type of connection to create. Your choices are `Azure`, `AzureServicePrincipal`, and `AzureClassicCertificate`. 
5. The form presents properties for the connection type that you've chosen. Complete the form and click **Create** to save the new connection.

### Create a new connection with Windows PowerShell

Create a new connection with Windows PowerShell using the `New-AzAutomationConnection` cmdlet. This cmdlet has a `ConnectionFieldValues` parameter that expects a hashtable defining values for each of the properties defined by the connection type.

You can use the following example commands to create a connection that can be used for authentication using Azure Service Principal.

```powershell
$ConnectionAssetName = "AzureConnection"
$ConnectionFieldValues = @{"ApplicationId" = $Application.ApplicationId; "TenantId" = $TenantID.TenantId; "CertificateThumbprint" = $Cert.Thumbprint; "SubscriptionId" = $SubscriptionId}
New-AzAutomationConnection -ResourceGroupName $ResourceGroup -AutomationAccountName $AutomationAccountName -Name $ConnectionAssetName -ConnectionTypeName AzureServicePrincipal -ConnectionFieldValues $ConnectionFieldValues
```

If you try to create a new connection asset to connect to a service or application with a different authentication method, the operation fails because the connection type is not already defined in your Automation account. For more information on creating your own connection type for a custom module, see [Add a connection type](#add-a-connection-type).

## Add a connection type

If your runbook or DSC configuration connects to an external service, you must define a connection type in a [custom module](shared-resources/modules.md#custom-modules) called an integration module. This module includes a metadata file that specifies connection type properties and is named **&lt;ModuleName&gt;-Automation.json**, located in the module folder of your compressed **.zip** file. This file contains the fields of a connection that are required to connect to the system or service that the module represents. Using this file, you can set the field names, data types, encryption status, and optional status for the connection type. Multiple connection types are not supported in this file. 

The following example is a template in the **.json** file format that defines user name and password properties for a custom connection type called `MyModuleConnection`:

```json
{
   "ConnectionFields": [
   {
      "IsEncrypted":  false,
      "IsOptional":  true,
      "Name":  "Username",
      "TypeName":  "System.String"
   },
   {
      "IsEncrypted":  true,
      "IsOptional":  false,
      "Name":  "Password",
      "TypeName":  "System.String"
   }
   ],
   "ConnectionTypeName":  "MyModuleConnection",
   "IntegrationModuleName":  "MyModule"
}
```

## Get a connection in a runbook or DSC configuration

Retrieve a connection in a runbook or DSC configuration with the internal `Get-AutomationConnection` cmdlet. This cmdlet is preferred over the `Get-AzAutomationConnection` cmdlet, as it retrieves the connection values instead of information about the connection.

# [PowerShell](#tab/azure-powershell)

The following example shows how to use a connection to authenticate with Azure Resource Manager resources in your runbook. It uses a connection asset, which references the certificate-based service principal.

```powershell
$Conn = Get-AutomationConnection -Name AzureConnection
Connect-AzAccount -ServicePrincipal -Tenant $Conn.TenantID -ApplicationId $Conn.ApplicationID -CertificateThumbprint $Conn.CertificateThumbprint
```

# [Python](#tab/python2)

The following example shows how to authenticate using connection in a Python 2 and 3 runbook.

```python
""" Tutorial to show how to authenticate against Azure resource manager resources """
import azure.mgmt.resource
import automationassets

def get_automation_credential(azure_connection):
    """ Returns credentials to authenticate against Azure resource manager """
    from OpenSSL import crypto
    from msrestazure import azure_active_directory
    import adal

    # Get the Azure Automation service principal certificate
    cert = automationassets.get_automation_certificate("MyCertificate")
    pks12_cert = crypto.load_pkcs12(cert)
    pem_pkey = crypto.dump_privatekey(
        crypto.FILETYPE_PEM, pks12_cert.get_privatekey())

    # Get information for the Azure Automation service principal
    application_id = my_connection["ApplicationId"]
    thumbprint = my_connection["CertificateThumbprint"]
    tenant_id = my_connection["TenantId"]

    # Authenticate with service principal certificate
    resource = "https://management.core.windows.net/"
    authority_url = ("https://login.microsoftonline.com/" + tenant_id)
    context = adal.AuthenticationContext(authority_url)
    return azure_active_directory.AdalAuthentication(
        lambda: context.acquire_token_with_client_certificate(
            resource,
            application_id,
            pem_pkey,
            thumbprint)
    )


# Authenticate to Azure using the Azure Automation service principal
azure_connection = automationassets.get_automation_connection(
    "AzureConnection")
azure_credential = get_automation_credential(azure_connection)
```

---

### Graphical runbook examples

You can add an activity for the internal `Get-AutomationConnection` cmdlet to a graphical runbook. Right-click the connection in the Library pane of the graphical editor and select **Add to canvas**.

![add to canvas](media/automation-connections/connection-add-canvas.png)

The following image shows an example of using a connection object in a graphical runbook. 

![get connections](media/automation-connections/automation-get-connection-object.png)

## Next steps

* To learn more about the cmdlets used to access connections, see [Manage modules in Azure Automation](shared-resources/modules.md).
* For general information about runbooks, see [Runbook execution in Azure Automation](automation-runbook-execution.md).
* For details of DSC configurations, see [State Configuration overview](automation-dsc-overview.md).
