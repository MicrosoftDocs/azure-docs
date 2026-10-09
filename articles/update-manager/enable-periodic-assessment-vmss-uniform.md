# Enable periodic assessment for Azure Virtual Machine Scale Sets with Uniform orchestration (preview)

**Applies to:** : heavy_check_mark: Azure Virtual Machine Scale Sets with Uniform orchestration

This article provides steps to enable Periodic Assessment for Azure Virtual Machine Scale Sets Uniform (preview).

[Periodic assessment](/update-manager/assessment-options.md), also referred to as Auto Assessment (AA), reviews the update compliance status of Azure Virtual Machine Scale Sets.

Periodic assessment is now supported for virtual machine scale sets in Uniform orchestration mode (in preview). With this enhancement, you can enable periodic assessment in the Azure Update Manager portal for all VM and scale set types.

> [!IMPORTANT]
> Periodic assessment for scale sets with Uniform orchestration is currently in preview. Preview features don't have General Availability (GA) level SLAs.

## Scope of the preview

### Included

- Assessment workflows for scale sets with Uniform orchestration.
- Support for both Windows and Linux images.
- Enabling and viewing periodic assessments for VMs and scale sets in the Azure Update Manager portal.

### Not included

- GA-level SLAs.
- On-demand assessment.
- On-demand patching.
- Scheduled patching.

## How periodic assessment works

- Assessment runs on each virtual machine scale set (uniform) instance through the VM extension.
- Results are collected and forwarded to Azure Resource Graph (ARG). You can query ARG directly to [view assessment results](/update-manager/query-logs.md).
- Azure Update Manager consolidates the assessment state and [displays it in the Azure Update Manager portal](/update-manager/view-updates.md).
- Periodic assessments run automatically every 24 hours.

## Prerequisites

- Your subscription must be registered for the preview feature `Microsoft.Compute/InGuestAutoAssessmentVmssUniformPreview` (display name: **Enable Periodic Assessment on VMSS Uniform machines**). For more information, see [Set up preview features in Azure subscription](/azure/azure-resource-manager/management/preview-features).
- VMs or virtual machine scale sets must be onboarded to Azure Update Manager ([Periodic Assessment](/update-manager/periodic-assessment-at-scale.md)).
- Virtual machine scale set instances must run a [supported OS image (Windows or Linux)](/update-manager/support-matrix-updates.md).
- You must have access to Azure Update Manager ([Prerequisites for Azure Update Manager](/update-manager/prerequisites.md)).

## Enable periodic assessment in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
2. Select your scale set with **Uniform** orchestration.
3. Under **Manage**, select **Update settings**. For more information, see [Manage update configuration settings in Azure Update Manager](/update-manager/manage-update-settings.md).
4. Go to **Periodic assessment**.
5. Enable periodic assessment for the selected virtual machine scale set.

Assessment results appear in the [Azure Update Manager compliance dashboard](/update-manager/view-updates.md).

## Enable periodic assessment programmatically

You can also manage periodic assessment programmatically by setting `assessmentMode` to `AutomaticByPlatform`. For more information, see [Virtual Machine Scale Sets - Update - REST API (Azure Compute)](/rest/api/compute/virtual-machine-scale-sets/update).

### Request URL

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}?api-version=2024-11-01
```

### Request body for Windows

```json
{
    "properties": {
        "virtualMachineProfile": {
            "osProfile": {
                "windowsConfiguration": {
                    "patchSettings": {
                        "assessmentMode": "AutomaticByPlatform"
                    }
                }
            }
        }
    },
    "location": "<location name>"
}
```

### Request body for Linux

```json
{
    "properties": {
        "virtualMachineProfile": {
            "osProfile": {
                "linuxConfiguration": {
                    "patchSettings": {
                        "assessmentMode": "AutomaticByPlatform"
                    }
                }
            }
        }
    },
    "location": "<location name>"
}
```

## Limitations

- During the preview, the feature is enabled only in the Azure public cloud.
- Some regions might not be enabled until the full rollout.

## Troubleshooting

- Validate that instances are reachable by Azure update services.
- Confirm that virtual machine scale set resource sync isn't failing at the platform level.
- Use Azure Update Manager logs for per-instance assessment visibility.

## Next steps

- [Manage update configuration settings in Azure Update Manager]([](/update-manager/manage-update-settings.md))
- [About Azure Update Manager](/update-manager/overview.md)