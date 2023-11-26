---
title: Migrate to the built-in MDVM solution in Defender for Cloud
description: Learn how to migrate to the built-in Microsoft Defender Vulnerability Management solution in Microsoft Defender for Cloud
services: defender-for-cloud
ms.service: defender-for-cloud
ms.topic: how-to
ms.date: 11/26/2023
---

# Migrate to the built-in MDVM solution in Defender for Cloud

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

1. Toggle `Vulnerability assessment for machines` to **On**.

1. Select **Edit configuration**.

1. Select **Microsoft Defender Vulnerability Management**.

1. Select **Apply**. 

1. Ensure that `Endpoint protection` or `Agentless scanning for machines` are toggled to **On**.

You will also need to offboard each VM from the current VA solution by deleting the VM extension, or via REST API DELETE request or with delete custom policy at scale.

3. **REST API for Azure VMs:**

a.   Using this REST API, you can easily migrate your subscription, at scale, from any VA solution to Microsoft Defender Vulnerability Management. 

PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Security/serverVulnerabilityAssessmentsSettings/AzureServersSetting?api-version=2022-01-01-preview

{
   "kind": "AzureServersSetting",
   "properties": {
    "selectedProvider": "MdeTvm"
   }
 }

4. **REST API for multi-cloud VMs**:

a.   PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.Security/securityconnectors/{connectorName}?api-version=2022-08-01-preview

```bash
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

5. Offboard each VM from the current VA solution either by deleting the VM extension or via REST API DELETE request or with delete custom policy at scale