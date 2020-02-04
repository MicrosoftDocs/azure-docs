---
title: Connect hybrid machines to Azure at scale
description: In this article, you learn how to connect machines to Azure using Azure Arc for servers (preview) using a service principal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 02/04/2020
ms.custom: mvc
ms.topic: quickstart
---
# Connect hybrid machines to Azure at scale

You can enable Azure Arc for servers (preview) for multiple Windows or Linux machines in your environment by performing a set of steps manually. Or you can use an automated method by running a template script that we provide. This script automates the download and installation of the Connected Machine agent for both operating systems. To connect the machines to Azure Arc for servers, you can use an Azure Active Directory [service principal](../../active-directory/develop/app-objects-and-service-principals.md). A service principal is a special limited management identity that is granted only the minimum permission necessary to connect machines to Azure. This is safer than using a higher privileged account like a Tenant Administrator. The service principal is used only during onboarding, it is not used for any other purpose.  

The installation methods to install and configure the Connected Machine agent requires that you have administrator permissions on the machines. On Linux, by using the root account and on Windows, you are a member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](overview.md#prerequisites) and verify that your subscription and resources meet the requirements.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a Service Principal for onboarding at scale

In the article [Connect hybrid machines to Azure from the Azure portal](quickstart-onboard-portal.md), to connect the machine to Azure Arc your identity needs to have privileged permissions in Azure to successfully connect the machine to Azure Arc using the `azcmagent` command. Following our access control security best practices, we recommend creating a service principal to automate the machine connnetion to Azure Arc for servers. 

You can use [Azure PowerShell](/powershell/azure/install-az-ps) to create a service principal with the [New-AzADServicePrincipal](/powershell/module/Az.Resources/New-AzADServicePrincipal) cmdlet. Or you can follow the steps listed under [Create a Service Principal using the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md) to complete this task.

> [!NOTE]
> When you create a service principal, your account must be an Owner or User Access Administrator on the subscription that you want to use for onboarding. If you don't have sufficient permissions to create role assignments, the service principal might be created, but it won't be able to onboard machines.
>

The **Azure Connected Machine Onboarding** role contains only the permissions required to onboard a machine. You can assign the service principal permission to allow its scope to include a resource group or a subscription.

You must store the output of the [`New-AzADServicePrincipal`](/powershell/module/az.resources/new-azadserviceprincipal) cmdlet, or you will not be able to retrieve the password to use in a step below.

```azurepowershell-interactive
$sp = New-AzADServicePrincipal -DisplayName "Arc-for-servers" -Role "Azure Connected Machine Onboarding"
$sp
```

```output
Secret                : System.Security.SecureString
ServicePrincipalNames : {ad9bcd79-be9c-45ab-abd8-80ca1654a7d1, https://Arc-for-servers}
ApplicationId         : ad9bcd79-be9c-45ab-abd8-80ca1654a7d1
ObjectType            : ServicePrincipal
DisplayName           : Hybrid-RP
Id                    : 5be92c87-01c4-42f5-bade-c1c10af87758
Type                  :
```

> [!NOTE] 
> It may take several minutes to get the service principal permissions properly populated. Running the following PowerShell cmdlet to modify role assignment sets the permission quicker.  
> ``` PowerShell
> New-AzRoleAssignment -RoleDefinitionName "Azure Connected Machine Onboarding" -ServicePrincipalName $sp.ApplicationId
> ```

Now, retrieve the password using PowerShell.

```azurepowershell-interactive
$credential = New-Object pscredential -ArgumentList "temp", $sp.Secret
$credential.GetNetworkCredential().password
```

From the output, copy the **password** and **ApplicationId** (from the previous step) and store them for later in a safe place, such as the secret store for your server configuration tool. If you forget or lose your SPN password, you can reset it using the [`New-AzADSpCredential`](/powershell/module/azurerm.resources/new-azurermadspcredential) cmdlet.

In the install agent onboarding script:

* The **ApplicationId** property is used for the `--service-principal-id` parameter used to connect the agent
* The **password** property is used for the  `--service-principal-secret` parameter used to connect the agent.

> [!NOTE]
> Make sure to use the Service Principal **ApplicationId** property, not the **Id** property. The **Id** will not work.

## Manually install the agent and connect to Azure

The following guide allows you to connect a machine to Azure by logging into the machine and performing the steps. You can also connect machines to Azure [From the Portal](quickstart-onboard-portal.md).

### Connecting to Azure

Once installed, you can manage and configure the agent using a command-line tool called `azcmagent.exe`. The agent is located under `/opt/azcmagent/bin` on Linux and `$env:programfiles\AzureConnectedMachineAgent` on Windows.

On Windows, open PowerShell as administrator on a target node and run:

```powershell
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect `
  --service-principal-id "{your-spn-appid}" `
  --service-principal-secret "{your-spn-password}" `
  --resource-group "{your-resource-group-name}" `
  --tenant-id "{your-tenant-id}" `
  --location "{desired-location}" `
  --subscription-id "{your-subscription-id}"
```

On Linux, open a shell and run

<!-- Same command for linux?-->
```bash
azcmagent connect \
  --service-principal-id "{your-spn-appid}" \
  --service-principal-secret "{your-spn-password}" \
  --resource-group "{your-resource-group-name}" \
  --tenant-id "{your-tenant-id}" \
  --location "{location-of-your-resource-group}" \
  --subscription-id "{your-subscription-id}"
```

Parameters:

* `tenant-id` : The Tenant GUID. You can find it in Azure portal by selecting **Azure Active directory** -> **properties** -> **Directory ID**.
* `subscription-id` : The GUID of the subscription, in Azure, where you want to connect your machine.
* `resource-group` : The resource group where you want your machine connected.
* `location` : See [Azure regions and locations](https://azure.microsoft.com/global-infrastructure/regions/). This location can be the same, or different, as the resource group's location. For public preview, the service is supported in **WestUS2**, **SouthEast Asia**, and **West Europe**.
* `resource-name` :  (*Optional*) Used for the Azure resource representation of your on-premises machine. If you do not specify this value, the machine hostname will be used.

You can learn more about the `azcmagent' command line tool by reviewing the [Azcmagent Reference](azcmagent-reference.md).

After you install the agent and configure it to connect to Azure Arc for servers (preview), go to the Azure portal to verify that the server has been successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](./media/quickstart-onboard/arc-for-servers-successful-onboard.png)

## Next steps

> [!div class="nextstepaction"]
> [Assign a Policy to Connected Machines](../../governance/policy/assign-policy-portal.md)
