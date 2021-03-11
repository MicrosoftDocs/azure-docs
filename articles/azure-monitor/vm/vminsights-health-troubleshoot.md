---
title: Troubleshoot VM insights guest health (preview)
description: Describes troubleshooting steps that you can take when you have issues with VM insights health.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/08/2020

---

# Troubleshoot VM insights guest health (preview)
This article describes troubleshooting steps that you can take when you have issues with VM insights health.

## Error message that no data is available 

![No data](media/vminsights-health-troubleshoot/no-data.png)


### Verify that the virtual machine meets configuration requirements

1. Verify that the virtual machine is an Azure virtual machine. Azure Arc for servers is not currently supported.
2. Verify that the virtual machine is running a [supported operating system](vminsights-health-enable.md?current-limitations.md).
3. Verify that the virtual machine is installed in a [supported region](vminsights-health-enable.md?current-limitations.md).
4. Verify that the Log Analytics workspace is installed in a [supported region](vminsights-health-enable.md?current-limitations.md).

### Verify that the VM is properly onboarded
Verify that the Azure Monitor agent extension and Guest VM Health agent are successfully provisioned on the virtual machine. Select **Extensions** from the virtual machine's menu in the Azure portal and make sure that the two agents are listed.

![VM extensions](media/vminsights-health-troubleshoot/extensions.png)

### Verify the system assigned identity is enabled on the virtual machine
Verify that the system assigned identity is enabled on the virtual machine. Select **Identity** from the virtual machine's menu in the Azure portal. If user managed identity is enabled, regardless of the status of the system managed identity, Azure Monitor agent will not be able to communicate with the configuration service, and the guest health extension will not work.

![System assigned identity](media/vminsights-health-troubleshoot/system-identity.png)

### Verify data collection rule
Verify that the data collection rule specifying health extension as a data source is associated with the virtual machine.

## Error message for bad request due to insufficient permissions
This error indicates that the **Microsoft.WorkloadMonitor** resource provider wasn’t registered in the subscription. See [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md#register-resource-provider) for details on registering this resource provider. 

![Bad request](media/vminsights-health-troubleshoot/bad-request.png)

## Next steps

- [Get an overview of the guest health feature of VM insights](vminsights-health-overview.md)