---
title: Stop cluster upgrades on API breaking changes in Azure Kubernetes Service (AKS) (preview)
description: Learn how to stop minor version change Azure Kubernetes Service (AKS) cluster upgrades on API breaking changes.
ms.topic: article
ms.author: schaffererin
author: schaffererin
ms.date: 03/24/2023
---

# Stop cluster upgrades on API breaking changes in Azure Kubernetes Service (AKS)

To stay within a supported Kubernetes version, you usually have to upgrade your version at least once per year and prepare for all possible disruptions. These disruptions include ones caused by API breaking changes and deprecations and dependencies such as Helm and CSI. It can be difficult to anticipate these disruptions and migrate critical workloads without experiencing any downtime.

Azure Kubernetes Service (AKS) now supports fail fast on minor version change cluster upgrades. This feature alerts you with an error message if it detects usage on deprecated APIs in the goal version.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

## Fail fast on control plane minor version manual upgrades in AKS (preview)

AKS will fail fast on minor version change cluster manual upgrades if it detects usage on deprecated APIs in the goal version. This will only happen if the following criteria are true:

- It's a minor version change for the cluster control plane.
- Your Kubernetes goal version is >= 1.26.0.
- The PUT MC request uses a preview API version of >= 2023-01-02-preview.
- The usage is performed within the last 1-12 hours. We record usage hourly, so usage within the last hour isn't guaranteed to appear in the detection.

If the previous criteria are true and you attempt an upgrade, you'll receive an error message similar to the following example error message:

```
Bad Request({

  "code": "ValidationError",

  "message": "Control Plane upgrade is blocked due to recent usage of a Kubernetes API deprecated in the specified version. Please refer to https://kubernetes.io/docs/reference/using-api/deprecation-guide to migrate the usage. To bypass this error, set IgnoreKubernetesDeprecations in upgradeSettings.overrideSettings. Bypassing this error without migrating usage will result in the deprecated Kubernetes API calls failing. Usage details: 1 error occurred:\n\t* usage has been detected on API flowcontrol.apiserver.k8s.io.prioritylevelconfigurations.v1beta1, and was recently seen at: 2023-03-23 20:57:18 +0000 UTC, which will be removed in 1.26\n\n",

  "subcode": "UpgradeBlockedOnDeprecatedAPIUsage"

})
```

After receiving the error message, you have two options:

- Remove usage on your end and wait 12 hours for the current record to expire.
- Bypass the validation to ignore API changes.

### Remove usage on API breaking changes

Remove usage on API breaking changes using the following steps:

1. Remove the deprecated API, which is listed in the error message.
2. Wait 12 hours for the current record to expire.
3. Retry your cluster upgrade.

### Bypass validation to ignore API changes

To bypass validation to ignore API breaking changes, update the `"properties":` block of `Microsoft.ContainerService/ManagedClusters` `PUT` operation with the following settings:

> [!NOTE]
> The date and time you specify for `"until"` has to be in the future. `Z` stands for timezone. The following example is in GMT. For more information, see [Combined date and time representations](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations).

```
{
    "properties": {
        "upgradeSettings": {
            "overrideSettings": {
                "controlPlaneOverrides": [
                    "IgnoreKubernetesDeprecations"
                ],
                "until": "2023-04-01T13:00:00Z"
            }
        }
    }
}
```

## Next steps

In this article, you learned how AKS detects deprecated APIs before an update is triggered and fails the upgrade operation upfront. To learn more about AKS cluster upgrades, see:

- [Upgrade an AKS cluster][upgrade-cluster]
- [Use Planned Maintenance to schedule and control upgrades for your AKS clusters (preview)][planned-maintenance-aks]

<!-- INTERNAL LINKS -->
[upgrade-cluster]: upgrade-cluster.md
[planned-maintenance-aks]: planned-maintenance.md
