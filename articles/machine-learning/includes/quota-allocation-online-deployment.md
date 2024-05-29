---
services: machine-learning
author: msakande
ms.service: machine-learning
ms.author: mopeakande
ms.topic: "include"
ms.date: 12/07/2023
---

For managed online endpoints, Azure Machine Learning reserves 20% of your compute resources for performing upgrades on some VM SKUs. If you request a given number of instances for those VM SKUs in a deployment, you must have a quota for `ceil(1.2 * number of instances requested for deployment) * number of cores for the VM SKU` available to avoid getting an error. For example, if you request 10 instances of a [Standard_DS3_v2](../../virtual-machines/dv2-dsv2-series.md) VM (that comes with four cores) in a deployment, you should have a quota for 48 cores (`12 instances * 4 cores`) available. This extra quota is reserved for system-initiated operations such as OS upgrades and VM recovery, and it won't incur cost unless such operations run.

There are certain VM SKUs that are exempted from extra quota reservation. To view the full list, see [Managed online endpoints SKU list](../reference-managed-online-endpoints-vm-sku-list.md).

To view your usage and request quota increases, see [View your usage and quotas in the Azure portal](../how-to-manage-quotas.md#view-your-usage-and-quotas-in-the-azure-portal). To view your cost of running a managed online endpoint, see [View costs for a managed online endpoint](../how-to-view-online-endpoints-costs.md).
