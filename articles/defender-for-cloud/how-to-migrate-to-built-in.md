---
title: Migration from Qualys to Microsoft Defender Vulnerability Management
description: Learn how to migrate to the built-in Microsoft Defender Vulnerability Management solution in Microsoft Defender for Cloud
services: defender-for-cloud
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 11/27/2023
---

# Migration from Qualys to Microsoft Defender Vulnerability Management

> [!IMPORTANT]
> Microsoft Defender for Cloud made a strategic decision to unify all vulnerability assessment solutions to use an in-house vulnerability scanner, Microsoft Defender Vulnerability Management (MDVM). MDVM provides consistent integration across all cloud native use cases, including workload types, multicloud, on-premises, agentless and agent offering and throughout the software development lifecycle. For more information about [the strategic decision to invest in Microsoft Defender Vulnerability Management](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-cloud-unified-vulnerability-assessment-powered-by/ba-p/3990112).
>
> As part of this change, the built-in vulnerability assessments offering powered by Qualys is set to be retired. This allows Defender for Cloud to focus on the new unified vulnerability assessments offering, and ensure the best customer value.
>
> The Defender for Cloud Servers Vulnerability Assessment powered by Qualys is now on a retirement path starting on November 27th and completed on **May 1st, 2024**.
>
> Customers that use the built-in Qualys on at least one machine within a tenant with Defender for Servers prior to **December 15th, 2023** will be able to continue to use Servers Vulnerability Assessment powered by Qualys until **May 1st, 2024**.
>
> We encourage our customers that are currently using the built vulnerability assessment solution powered by Qualys to start planning for the upcoming deprecations by following the steps on this page.
>
> Defender for Servers supports Bring Your Own License (BYOL) VA solutions powered by either Qualys or Rapid7 and will continue to support them. This allows customers to continue to use these vendors.

There are three recommended methods to enable the built-in Microsoft Defender Vulnerability Management (MDVM) solution within Defender for Cloud:

## Azure policy (for Azure VMs) 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Policy** > **Definitions**.

1. Search for `Setup subscriptions to transition to an alternative vulnerability assessment solution`. 

1. Select **Assign**.

1. Select a scope and enter an assignment name.

1. Select **Review + create**.

1. Review the information you entered and select **Create**.
 
This policy ensures that all Virtual Machines (VM) within a selected subscription are safeguarded by the built-in MDVM solution. 

## Defender for Cloud’s portal 

In the Defender for Cloud portal, you have the ability to change the Vulnerability Assessment (VA) solution to the built-in MDVM solution. 

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Microsoft Defender for Cloud** > **Environment settings** 

1. Select the relevant subscription.

1. Locate the Defender for Servers plan and select **Settings**.

    :::image type="content" source="media/how-to-migrate-to-built-in/settings-server.png" alt-text="Screenshot of the Defender for Cloud plan page that shows where to locate and select the settings button under the servers plan." lightbox="media/how-to-migrate-to-built-in/settings-server.png":::

1. Toggle `Vulnerability assessment for machines` to **On**.

    If `Vulnerability assessment for machines` was already set to on, select **Edit configuration**

    :::image type="content" source="media/how-to-migrate-to-built-in/edit-configuration.png" alt-text="Screenshot of the servers plan that shows where the edit configuration button is located." lightbox="media/how-to-migrate-to-built-in/edit-configuration.png":::

1. Select **Microsoft Defender Vulnerability Management**.

1. Select **Apply**. 

1. Ensure that `Endpoint protection` or `Agentless scanning for machines` are toggled to **On**.

    :::image type="content" source="media/how-to-migrate-to-built-in/two-to-on.png" alt-text="Screenshot that shows where to turn on endpoint protection and agentless scanning for machines is located." lightbox="media/how-to-migrate-to-built-in/two-to-on.png":::

1. Select **Continue**.

1. Select **Save**.

After migrating to the built-in MDVM solution in Defender for Cloud, offboard each VM from the current VA solution. There are three ways to offboard a VM:

- [Delete the VM extension](/powershell/module/az.compute/remove-azvmextension?view=azps-11.0.0).
- [REST API DELETE request](/rest/api/compute/virtual-machine-extensions/delete?view=rest-compute-2023-07-01&tabs=HTTP).
- Delete custom policy at scale.

## Migrate with REST API

### REST API for Azure VMs

Using this REST API, you can easily migrate your subscription, at scale, from any VA solution to Microsoft Defender Vulnerability Management.

`PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/serverVulnerabilityAssessmentsSettings/AzureServersSetting?api-version=2022-01-01-preview`

```json
{
   "kind": "AzureServersSetting",
   "properties": {
    "selectedProvider": "MdeTvm"
   }
 }
```

After migrating to the built-in MDVM solution in Defender for Cloud, offboard each VM from the current VA solution. There are three ways to offboard a VM:

- [Delete the VM extension](/powershell/module/az.compute/remove-azvmextension?view=azps-11.0.0).
- [REST API DELETE request](/rest/api/compute/virtual-machine-extensions/delete?view=rest-compute-2023-07-01&tabs=HTTP).
- Delete custom policy at scale.

### REST API for multicloud VMs

Using this REST API, you can easily migrate your subscription, at scale, from any VA solution to Microsoft Defender Vulnerability Management.

`PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Security/securityconnectors/{connectorName}?api-version=2022-08-01-preview`

```json
{
  "properties": {
   "hierarchyIdentifier": "{GcpProjectNumber}",
   "environmentName": "GCP",
   "offerings": [
​    {
​     "offeringType": "CspmMonitorGcp",
​     "nativeCloudConnection": {
​      "workloadIdentityProviderId": "{cspm}",
​      "serviceAccountEmailAddress": "{emailAddressRemainsAsIs}"
​     }
​    },
​    {
​     "offeringType": "DefenderCspmGcp"
​    },
​    {
​     "offeringType": "DefenderForServersGcp",
​     "defenderForServers": {
​      "workloadIdentityProviderId": "{defender-for-servers}",
​      "serviceAccountEmailAddress": "{emailAddressRemainsAsIs}"
​     },
​     "arcAutoProvisioning": {
​      "enabled": true,
​      "configuration": {}
​     },
​     "mdeAutoProvisioning": {
​      "enabled": true,
​      "configuration": {}
​     },
​     "vaAutoProvisioning": {
​      "enabled": true,
​      "configuration": {
​       "type": "TVM"
​      }
​     },
​     "subPlan": "{P1/P2}"
​    }
   ],
   "environmentData": {
​    "environmentType": "GcpProject",
​    "projectDetails": {
​     "projectId": "{GcpProjectId}",
​     "projectNumber": "{GcpProjectNumber}",
​     "workloadIdentityPoolId": "{identityPoolIdRemainsTheSame}"
​    }
   }
  },
  "location": "{connectorRegion}"
}
```

After migrating to the built-in MDVM solution in Defender for Cloud, offboard each VM from the current VA solution. There are three ways to offboard a VM:

- [Delete the VM extension](/powershell/module/az.compute/remove-azvmextension?view=azps-11.0.0).
- [REST API DELETE request](/rest/api/compute/virtual-machine-extensions/delete?view=rest-compute-2023-07-01&tabs=HTTP).
- Delete custom policy at scale.

## Next steps

[Common questions about vulnerability scanning questions](faq-scanner-detection.yml)
