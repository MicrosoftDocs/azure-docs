---
title: Deploy Azure Virtual Desktop workload in Azure Enclave
description: Deploy Azure Virtual Desktop with session hosts, host pools, and FSLogix storage in Azure Enclave using the service catalog.
author: aserfass-msft
ms.author: aserfass
ms.topic: tutorial
ms.date: 06/30/2026
---

# Tutorial 2-3: Deploy Azure Virtual Desktop workload in Azure Enclave

This tutorial guides you through deploying Azure Virtual Desktop in Azure Enclave. You create Azure Virtual Desktop infrastructure including host pools, session hosts, application groups, and FSLogix storage, all secured within your enclave boundary.

In this tutorial, you learn how to:
  - Deploy Azure Virtual Desktop community endpoint for external connectivity
  - Deploy Azure Virtual Desktop enclave infrastructure
  - Deploy Azure Virtual Desktop workload with session hosts and control plane
  - Configure identity and encryption
  - Access Azure Virtual Desktop via encrypted connections
  - Validate the deployment

## Prerequisites

- Completion of [Tutorial 2-2: Create Azure Enclave Environment](./2-2-create-azure-enclave-environment.md)
- Azure Virtual Desktop enclave with management and session hosts subnets
- Common dependencies (Key Vault, managed identity, disk encryption set) from Tutorial 2-2
- Private DNS zones for Azure Virtual Desktop deployed
- **Virtual Machine Contributor** role on the Azure Virtual Desktop workload resource group
- Active Directory or Microsoft Entra ID configured for user authentication

## Before you begin

### Identity solution requirements

Azure Virtual Desktop requires an identity solution for user authentication. You have two options:

| Solution | Requirements | Best For |
|----------|--------------|----------|
| **Microsoft Entra ID** | - Microsoft Entra tenant<br>- Users synced or cloud-only<br>- Microsoft Entra joined VMs | Cloud-native organizations |
| **Active Directory Domain Services (AD DS)** | - Domain controller accessible from enclave<br>- Domain join for VMs<br>- Can be hybrid with Microsoft Entra Connect | Existing AD infrastructure |

This tutorial supports both options. Choose the appropriate parameters during deployment.

### Resource naming conventions

This tutorial uses example names. Use your organization's naming convention:
- Enclave: `avd-enclave`
- Workload: `avd-workload`
- Resource group prefix: `rg-avd-`
- Host pool: `hp-prod-01`

## Deploy Azure Virtual Desktop community endpoint

The Azure Virtual Desktop community endpoint enables session hosts to communicate with Azure Virtual Desktop control plane services.

> [!NOTE]
> If you created the Azure Virtual Desktop community endpoint in Tutorial 2-2, you can skip this section.

### Use service catalog template

1. In the Azure portal, navigate to your **Azure Virtual Desktop workload** in the Azure Virtual Desktop enclave.
1. Select **+ Add an Azure Service**.
1. Search for and select **Azure Virtual Desktop Community Endpoint**.
1. Configure the deployment:
   - **Resource group**: Select your workload resource group (for example, `rg-avd-workload`)
   - **Community Resource Name**: Select your community (for example, `fabrikam`)
   - **Community Endpoint Name**: `ce-avd-services`
   - **Include Azure Virtual Desktop URLs**: Check all required URLs:
     - `*.wvd.microsoft.com`
     - `login.microsoftonline.com`
     - `management.azure.com`
     - `*.prod.warm.ingest.monitor.core.windows.net`
1. Select **Review + Add** and then **Create**.
1. Wait for deployment to complete (~5-10 minutes).

## Deploy Azure Virtual Desktop enclave infrastructure

The Azure Virtual Desktop enclave template prepares your enclave with required subnets and network security groups.

### Use service catalog template

1. In your **Azure Virtual Desktop workload**, select **+ Add an Azure Service**.
1. Search for and select **Azure Virtual Desktop Enclave**.
1. Configure the deployment:
   
   **Basic settings:**
   - **Resource group**: `rg-avd-infrastructure`
   - **Enclave Resource Name**: Select `avd-enclave`
   - **Location**: Same as enclave region
   
   **Network configuration:**
   - **Virtual Network Name**: Leave default (uses enclave virtual network)
   - **Management Subnet Name**: `AzureVirtualDesktopManagementSubnet`
   - **Session Hosts Subnet Name**: `AzureVirtualDesktopSessionHostsSubnet`
   - **Create NSGs**: **Yes** (if not already created)
   
   **Private DNS:**
   - **Create Private DNS Zones**: **No** (already created in Tutorial 2-2)
   - **Link to VNet**: **Yes**
   
1. Select **Review + Add** and then **Create**.
1. Wait for deployment to complete (~10-15 minutes).

## Deploy Azure Virtual Desktop workload

Now deploy the Azure Virtual Desktop workload with host pool, session hosts, and supporting infrastructure.

### Select the Azure Virtual Desktop workload template

1. In your **Azure Virtual Desktop workload**, select **+ Add an Azure Service**.
1. Search for and select **Azure Virtual Desktop Workload**.
1. Configure the deployment using the following parameters:

| Configuration Section | Parameters |
|----------------------|------------|
| **Basics tab** | - **Resource group**: `rg-avd-workload`<br>- **Location**: Same as enclave region<br>- **Workload Name**: `avd-prod` |
| **Host Pool Configuration** | - **Host Pool Name**: `hp-prod-01`<br>- **Host Pool Type**: `Pooled`<br>- **Load Balancer Type**: `BreadthFirst`<br>- **Max Session Limit**: `10` (for pooled, sessions per host)<br>- **Validation Environment**: `No` (unless testing) |
| **Session Host Configuration** | - **Session Host Name Prefix**: `avd-sh-`<br>- **Virtual Machine Size**: `Standard_D4s_v5` (4 vCPU, 16 GB of RAM minimum)<br>- **Number of Session Hosts**: `2` (start small, scale later)<br>- **OS Disk Type**: `Premium_LRS`<br>- **Image Reference**:<br>&nbsp;&nbsp;- **Publisher**: `MicrosoftWindowsDesktop`<br>&nbsp;&nbsp;- **Offer**: `Windows-11`<br>&nbsp;&nbsp;- **SKU**: `win11-23h2-avd`<br>&nbsp;&nbsp;- **Version**: `latest` |
| **Network Configuration** | - **Virtual Network Resource Group**: `avd-enclave-HostedResources-<guid>` (enclave MRG)<br>- **Virtual Network Name**: Enclave virtual network name<br>- **Subnet Name**: `AzureVirtualDesktopSessionHostsSubnet` |
| **Identity and Domain** | **For Microsoft Entra ID:**<br>- **Identity Type**: `AzureADJoin`<br>- **Entra Tenant ID**: Your Microsoft Entra tenant ID<br>- **Intune Enrollment**: `Yes` (recommended)<br><br>**For Active Directory Domain Services:**<br>- **Identity Type**: `DomainJoin`<br>- **Domain FQDN**: `contoso.com`<br>- **OU Path**: `OU=AVD,DC=contoso,DC=com` (optional)<br>- **Domain Join Account UPN**: `avd-join@contoso.com`<br>- **Domain Join Password**: (secure password) |
| **Workspace Configuration** | - **Workspace Name**: `ws-avd-prod`<br>- **Workspace Friendly Name**: `Production Azure Virtual Desktop Workspace`<br>- **Application Group Name**: `ag-desktop-prod`<br>- **Application Group Type**: `Desktop` (or `RemoteApp`) |
| **Storage Configuration (FSLogix)** | - **Storage Account Name**: `stavdfslogix<uniqueid>`<br>- **Storage Account Type**: `Premium_LRS` (for best performance)<br>- **File Share Name**: `profiles`<br>- **File Share Quota (GB)**: `1024` (1 TB)<br>- **Enable Azure Files Private Endpoint**: `Yes`<br>- **Private Endpoint Subnet**: `AzureVirtualDesktopManagementSubnet` |
| **Encryption Configuration** | - **Enable CMK Encryption**: `Yes`<br>- **Disk Encryption Set Resource ID**: Resource ID from Tutorial 2-2 [common dependencies](./2-2-create-azure-enclave-environment.md#set-up-common-dependencies)<br>- **User Assigned Identity Resource ID**: Resource ID from Tutorial 2-2 [common dependencies](./2-2-create-azure-enclave-environment.md#set-up-common-dependencies) |
| **Monitoring** | - **Enable Diagnostic Settings**: `Yes`<br>- **Log Analytics Workspace**: Select workspace from shared services or create new<br>- **Enable Azure Virtual Desktop Insights**: `Yes` (recommended) |

1. Select `Review + Create`.
1. Review all settings carefully.
1. Select `Create`.

> [!NOTE]
> Deployment takes 30-60 minutes depending on the number of session hosts.

## Configure enclave endpoints for management

Create enclave endpoints to allow management traffic from admin resources.

1. Navigate to your **Azure Virtual Desktop enclave**.
1. Select `Enclave endpoints` then select `+ Create`.
1. Configure the endpoint:
   - **Name**: `ee-avd-management`
   - **Description**: `Allow management access to Azure Virtual Desktop resources`
1. Add rules:
   
   **Rule 1: RDP to Session Hosts**
   - **Name**: `rdp-to-hosts`
   - **Protocol**: `TCP`
   - **Port**: `3389`
   - **Source**: Admin subnet CIDR or bastion subnet
   
   **Rule 2: PowerShell Remoting**
   - **Name**: `winrm`
   - **Protocol**: `TCP`
   - **Port**: `5985,5986`
   - **Source**: Admin subnet CIDR
   
1. Select `Review + create` and then `Create`.

## Configure enclave connection for FSLogix

If your FSLogix storage is in a different enclave, create an enclave connection.

1. Navigate to your **Azure Virtual Desktop enclave**.
1. Select `Enclave connections` then select `+ Create`.
1. Configure the connection:
   - **Name**: `conn-avd-to-storage`
   - **Source enclave**: `avd-enclave`
   - **Destination enclave endpoint**: Select endpoint in shared services enclave
1. Select `Review + create` and then `Create`.

## Assign users to application group

Users need to be assigned to the application group to access Azure Virtual Desktop.

### Using Azure portal

1. Navigate to your **Application Group** (for example, `ag-desktop-prod`).
1. Select `Assignments` then select `+ Add`.
1. Search for and select users or groups.
1. Select `Select`.

### Using Azure PowerShell

```powershell
# Variables
$resourceGroup = "rg-avd-workload"
$appGroupName = "ag-desktop-prod"
$userPrincipalName = "user@contoso.com"

# Get the application group
$appGroup = Get-AzWvdApplicationGroup -ResourceGroupName $resourceGroup -Name $appGroupName

# Get the user object ID
$user = Get-AzADUser -UserPrincipalName $userPrincipalName

# Assign user to application group
New-AzRoleAssignment -ObjectId $user.Id `
    -RoleDefinitionName "Desktop Virtualization User" `
    -ResourceName $appGroupName `
    -ResourceGroupName $resourceGroup `
    -ResourceType 'Microsoft.DesktopVirtualization/applicationGroups'
```

## Access Azure Virtual Desktop from client

Users can access Azure Virtual Desktop through various clients.

### Web client

1. Navigate to [https://client.wvd.microsoft.com/arm/webclient](https://client.wvd.microsoft.com/arm/webclient)
1. Sign in with Microsoft Entra credentials
1. Select the published desktop or application
1. Session connects through enclave connectivity

### Windows App

1. Download the [Windows App](https://aka.ms/windowsapp) from the Microsoft Store or direct download
1. Install and launch Windows App
1. Select `Add account` or `+` to add a workspace
1. Sign in with your Microsoft Entra credentials
1. Your Azure Virtual Desktop resources automatically appear
1. Select a desktop or application to connect

> [!NOTE]
> Windows App replaces the legacy Remote Desktop client and provides a modern experience for accessing Azure Virtual Desktop, Azure Virtual Desktop, and other remote resources.

## Validate the deployment

Perform these validation steps to ensure proper deployment:

### Check session host status

1. Navigate to your **Host Pool** (for example, `hp-prod-01`)
1. Select `Session hosts`
1. Verify all hosts show status: `Available`
1. Check **Agent version** is current
1. Verify **Domain joined** status

### Test user session

1. Sign in as a test user
1. Launch a desktop or application
1. Verify connectivity and performance
1. Check FSLogix profile loads correctly
1. Test application functionality

### Verify encryption

1. Navigate to a session host VM
1. Select `Disks`
1. Select the OS disk
1. Verify `Encryption type`: `Encryption at rest with a customer-managed key`
1. Check encryption set is applied

### Check diagnostic logs

1. Navigate to the **Host Pool**
1. Select `Diagnostic settings`
1. Verify logs are flowing to Log Analytics
1. Query logs for connection events:

```kusto
WVDConnections
| where TimeGenerated > ago(1h)
| where State == "Connected"
| project TimeGenerated, UserName, ClientOS, ClientType
```

### Validate network connectivity

1. Connect to a session host via bastion or admin VM
1. Test connectivity to required endpoints:

```powershell
# Test Azure Virtual Desktop control plane
Test-NetConnection -ComputerName rdweb.wvd.microsoft.com -Port 443

# Test Azure Storage (FSLogix)
Test-NetConnection -ComputerName $storageAccountName.file.core.windows.net -Port 445

# Test Microsoft Entra ID
Test-NetConnection -ComputerName login.microsoftonline.com -Port 443
```

## Monitor Azure Virtual Desktop Insights

Enable and configure Azure Virtual Desktop Insights for comprehensive monitoring.

1. Navigate to your **Host Pool**
1. Select `Insights`
1. Select `Open Insights workbook`
1. Review metrics:
   - Connection success rate
   - Active sessions
   - Session host performance
   - User input delays
   - Resource utilization

## Troubleshooting common issues

### Session hosts not joining domain

**Symptom**: Session hosts show "Domain Join Error"

**Solutions**:
- Verify domain join credentials are correct
- Check enclave connectivity to domain controllers
- Ensure DNS resolution works for domain FQDN
- Verify OU path is correct (if specified)

### Users can't connect

**Symptom**: Connection fails during authentication

**Solutions**:
- Verify users are assigned to application group
- Check RDP properties allow connections
- Verify community endpoints are created
- Check network security group rules

### FSLogix profiles not loading

**Symptom**: Users get temporary profile

**Solutions**:
- Verify storage account private endpoint is created
- Check SMB connectivity on port 445
- Verify users have RBAC permissions on file share
- Check virtual network link for private DNS zone

### Poor performance

**Symptom**: Slow response sessions

**Solutions**:
- Check session host VM size is adequate
- Verify Premium SSD disks are used
- Review host pool load balancing settings
- Check max sessions per host configuration
- Monitor network latency in Azure Virtual Desktop Insights

## Clean up resources

To avoid ongoing charges, delete resources when no longer needed:

### Delete in order

1. Remove user assignments from application groups
1. Delete application groups
1. Delete workspace
1. Delete host pool (stops/deletes session hosts)
1. Delete storage account
1. Delete disk encryption set
1. Delete Key Vault key
1. Delete managed identity
1. Delete workload resource groups

### Using Azure CLI

```azurecli
# Delete resource group (deletes all contained resources)
az group delete --name rg-avd-workload --yes --no-wait
az group delete --name rg-avd-infrastructure --yes --no-wait
```

> [!WARNING]
> Deleting resources is permanent and can't be undone.

## Next steps

With Azure Virtual Desktop deployed, you can now deploy Azure Kubernetes Service workloads.

> [Tutorial 2-4: Deploy Azure Kubernetes Service workload](./2-4-deploy-kubernetes-workload.md)

## Related content

- [Azure Virtual Desktop documentation](/azure/virtual-desktop/)
- [FSLogix documentation](/fslogix/)
- [Azure Virtual Desktop Insights workbook](/azure/virtual-desktop/insights)
- [Manage session hosts with Azure portal](/azure/virtual-desktop/management)
- [Set up MSIX app attach](/azure/virtual-desktop/app-attach-overview)
- [Configure user profile containers](/azure/virtual-desktop/create-profile-container-azure-ad)
