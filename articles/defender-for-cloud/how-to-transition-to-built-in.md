---
title: Transition to Microsoft Defender Vulnerability Management for servers
description: Learn how to transition to the Microsoft Defender Vulnerability Management solution in Microsoft Defender for Cloud
services: defender-for-cloud
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 01/09/2024
---

# Transition to Microsoft Defender Vulnerability Management for servers

> [!IMPORTANT]
> Defender for Server's vulnerability assessment solution powered by Qualys, is on a retirement path that is set to complete on **May 1st, 2024**. If you are a currently using the built-in vulnerability assessment powered by Qualys, you should plan to transition to the Microsoft Defender Vulnerability Management vulnerability scanning using the steps on this page.
>
> For more information about our decision to unify our vulnerability assessment offering with Microsoft Defender Vulnerability Management, see [this blog post](https://techcommunity.microsoft.com/t5/microsoft-defender-for-cloud/defender-for-cloud-unified-vulnerability-assessment-powered-by/ba-p/3990112).
>
> Check out the [common questions](faq-scanner-detection.yml) regarding the transition to Microsoft Defender Vulnerability Management.
>
> Customers who want to continue using Qualys, can do so with the [Bring Your Own License (BYOL) method](deploy-vulnerability-assessment-byol-vm.md).

With the Defender for Servers plan in Microsoft Defender for Cloud, you can scan compute assets for vulnerabilities. If you're currently using a vulnerability assessment solution other than the Microsoft Defender Vulnerability Management vulnerability assessment solution, this article provides instructions on transitioning to the integrated Defender Vulnerability Management solution.

To transition to the integrated Defender Vulnerability Management solution, you can use the Azure portal, use an Azure policy definition (for Azure VMs), or use REST APIs.

- [Transition with Azure policy (for Azure VMs)](#transition-with-azure-policy-for-azure-vms)
- [Transition with Defender for Cloud’s portal](#transition-with-defender-for-clouds-portal)
- [Transition with REST API](#transition-with-rest-api)

## Transition with Azure policy (for Azure VMs)

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to **Policy** > **Definitions**.

1. Search for `Setup subscriptions to transition to an alternative vulnerability assessment solution`.

1. Select **Assign**.

1. Select a scope and enter an assignment name.

1. Select **Review + create**.

1. Review the information you entered and select **Create**.

This policy ensures that all Virtual Machines (VM) within a selected subscription are safeguarded with the built-in Defender Vulnerability Management solution.

Once you complete the transition to the Defender Vulnerability Management solution, you need to [Remove the old vulnerability assessment solution](#remove-the-old-vulnerability-assessment-solution)

## Transition with Defender for Cloud’s portal

In the Defender for Cloud portal, you have the ability to change the vulnerability assessment solution to the built-in Defender Vulnerability Management solution.

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

    :::image type="content" source="media/how-to-migrate-to-built-in/two-to-one.png" alt-text="Screenshot that shows where to turn on endpoint protection and agentless scanning for machines is located." lightbox="media/how-to-migrate-to-built-in/two-to-one.png":::

1. Select **Continue**.

1. Select **Save**.

Once you complete the transition to the Defender Vulnerability Management solution, you need to [Remove the old vulnerability assessment solution](#remove-the-old-vulnerability-assessment-solution)

## Transition with REST API

### REST API for Azure VMs

Using this REST API, you can easily migrate your subscription, at scale, from any vulnerability assessment solution to the Defender Vulnerability Management solution.

`PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/serverVulnerabilityAssessmentsSettings/AzureServersSetting?api-version=2022-01-01-preview`

```json
{
   "kind": "AzureServersSetting",
   "properties": {
    "selectedProvider": "MdeTvm"
   }
 }
```

Once you complete the transition to the Defender Vulnerability Management solution, you need to [Remove the old vulnerability assessment solution](#remove-the-old-vulnerability-assessment-solution)

### REST API for multicloud VMs

Using this REST API, you can easily migrate your subscription, at scale, from any vulnerability assessment solution to the Defender Vulnerability Management solution.

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

## Remove the old vulnerability assessment solution

After migrating to the built-in Defender Vulnerability Management solution in Defender for Cloud, you need to offboard each VM from their old vulnerability assessment solution using either of the following methods:

- [Delete the VM extension with PowerShell](/powershell/module/az.compute/remove-azvmextension).
- [REST API DELETE request](/rest/api/compute/virtual-machine-extensions/delete?tabs=HTTP).

## Next steps

[Common questions about vulnerability scanning questions](faq-scanner-detection.yml)
