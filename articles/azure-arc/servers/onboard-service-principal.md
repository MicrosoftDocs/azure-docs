---
title: Connect hybrid machines to Azure at scale
description: In this article, you learn how to connect machines to Azure using Azure Arc for servers (preview) using a service principal.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: mgoedtel
ms.author: magoedte
ms.date: 02/04/2020
ms.topic: conceptual
---
# Connect hybrid machines to Azure at scale

You can enable Azure Arc for servers (preview) for multiple Windows or Linux machines in your environment with several flexible options depending on your requirements. Using the template script we provide, you can automate every step of the installation, including establishing the connection to Azure Arc. However, you are required to interactively execute this script with an account that has elevated permissions on the target machine and in Azure. To connect the machines to Azure Arc for servers, you can use an Azure Active Directory [service principal](../../active-directory/develop/app-objects-and-service-principals.md) instead of using your privileged identity to [interactively connect the machine](onboard-portal.md). A service principal is a special limited management identity that is granted only the minimum permission necessary to connect machines to Azure using the `azcmagent` command. This is safer than using a higher privileged account like a Tenant Administrator, and follows our access control security best practices. The service principal is used only during onboarding, it is not used for any other purpose.  

The installation methods to install and configure the Connected Machine agent requires that the automated method you use has  administrator permissions on the machines. On Linux, by using the root account and on Windows, as a member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

At the end of this process, you will have successfully connected your hybrid machines to Azure Arc for servers.

## Create a Service Principal for onboarding at scale

You can use [Azure PowerShell](/powershell/azure/install-az-ps) to create a service principal with the [New-AzADServicePrincipal](/powershell/module/Az.Resources/New-AzADServicePrincipal) cmdlet. Or you can follow the steps listed under [Create a Service Principal using the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md) to complete this task.

> [!NOTE]
> When you create a service principal, your account must be an Owner or User Access Administrator in the subscription that you want to use for onboarding. If you don't have sufficient permissions to create role assignments, the service principal might be created, but it won't be able to onboard machines.
>

To create the service principal using PowerShell, perform the following.

1. Run the following command. You must store the output of the [`New-AzADServicePrincipal`](/powershell/module/az.resources/new-azadserviceprincipal) cmdlet in a variable, or you will not be able to retrieve the password needed in a later step.

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

2. To retrieve the password stored in the `$sp` variable, run the following command:

    ```azurepowershell-interactive
    $credential = New-Object pscredential -ArgumentList "temp", $sp.Secret
    $credential.GetNetworkCredential().password
    ```

3. In the output, find the password value under the field **password** and copy it. Also find the value under the field **ApplicationId** and copy it also. Save them for later in a secure place. If you forget or lose your service principal password, you can reset it using the [`New-AzADSpCredential`](/powershell/module/azurerm.resources/new-azurermadspcredential) cmdlet.

The values from the following properties are used with parameters passed to the `azcmagent`:

* The value from the **ApplicationId** property is used for the `--service-principal-id` parameter value
* The value from the **password** property is used for the  `--service-principal-secret` parameter used to connect the agent.

> [!NOTE]
> Make sure to use the service principal **ApplicationId** property, not the **Id** property.
>

The **Azure Connected Machine Onboarding** role contains only the permissions required to onboard a machine. You can assign the service principal permission to allow its scope to include a resource group or a subscription. To add role assignment, see [Add or remove role assignments using Azure RBAC and the Azure portal](../../role-based-access-control/role-assignments-portal.md) or [Add or remove role assignments using Azure RBAC and Azure CLI](../../role-based-access-control/role-assignments-cli.md).

## Install the agent and connect to Azure

The following steps install and configure the Connected Machine agent on your hybrid machines by using the script template, which performs similar steps described in the [Connect hybrid machines to Azure from the Azure portal](onboard-portal.md) article. The difference is in the final step where you establish the connection to Azure Arc using the `azcmagent` command using the service principal. 

The following are the settings that you configure the `azcmagent` command to use for the service principal.

* `tenant-id` : The unique identifier (GUID) that represents your dedicated instance of Azure AD.
* `subscription-id` : The subscription ID (GUID) of your Azure subscription that you want the machines in.
* `resource-group` : The resource group name where you want your connected machines to belong to.
* `location` : See [supported Azure regions](overview.md#supported-regions). This location can be the same or different, as the resource group's location.
* `resource-name` : (*Optional*) Used for the Azure resource representation of your on-premises machine. If you do not specify this value, the machine hostname is used.

You can learn more about the `azcmagent` command-line tool by reviewing the [Azcmagent Reference](azcmagent-reference.md).

### Windows installation script

The following is an example of the Connected Machine agent for Windows installation script that has been modified to use the service principal to support a fully automated, non-interactive installation of the agent.

```
 # Download the package
function download() {$ProgressPreference="SilentlyContinue"; Invoke-WebRequest -Uri https://aka.ms/AzureConnectedMachineAgent -OutFile AzureConnectedMachineAgent.msi}
download

# Install the package
msiexec /i AzureConnectedMachineAgent.msi /l*v installationlog.txt /qn | Out-String

# Run connect command
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect `
  --service-principal-id "{serviceprincipalAppID}" `
  --service-principal-secret "{serviceprincipalPassword}" `
  --resource-group "{ResourceGroupName}" `
  --tenant-id "{tenantID}" `
  --location "{resourceLocation}" `
  --subscription-id "{subscriptionID}"
```

### Linux installation script

The following is an example of the Connected Machine agent for Linux installation script that has been modified to use the service principal to support a fully automated, non-interactive installation of the agent.

```
# Download the installation package
wget https://aka.ms/azcmagent -O ~/install_linux_azcmagent.sh

# Install the hybrid agent
bash ~/install_linux_azcmagent.sh

# Run connect command
azcmagent connect \
  --service-principal-id "{serviceprincipalAppID}" \
  --service-principal-secret "{serviceprincipalPassword}" \
  --resource-group "{ResourceGroupName}" \
  --tenant-id "{tenantID}" \
  --location "{resourceLocation}" \
  --subscription-id "{subscriptionID}"
```

After you install the agent and configure it to connect to Azure Arc for servers (preview), go to the Azure portal to verify that the server has been successfully connected. View your machines in the [Azure portal](https://aka.ms/hybridmachineportal).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

- Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-at-scale-policy.md), and much more.

- Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to proactively monitor the OS and workloads running on the machine, manage it using Automation runbooks or solutions like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-intro.md).
