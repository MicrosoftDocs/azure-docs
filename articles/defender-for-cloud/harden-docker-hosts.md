---
title: Review Docker host hardening recommendations
description: How-to protect your Docker hosts and verify they're compliant with the CIS Docker benchmark
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 06/29/2023
---
# Review Docker host hardening recommendations

Microsoft Defender for Cloud identifies unmanaged containers hosted on IaaS Linux VMs, or other Linux machines running Docker containers. Defender for Cloud continuously assesses the configurations of these containers. It then compares them with the [Center for Internet Security (CIS) Docker Benchmark](https://www.cisecurity.org/benchmark/docker/).

Defender for Cloud includes the entire ruleset of the CIS Docker Benchmark and alerts you if your containers don't satisfy any of the controls. When it finds misconfigurations, Defender for Cloud generates security recommendations. Use Defender for Cloud's **recommendations page** to view recommendations and remediate issues.

When vulnerabilities are found, they're grouped inside a single recommendation.

>[!NOTE]
> These CIS benchmark checks will not run on AKS-managed instances or Databricks-managed VMs.

## Availability

|Aspect|Details|
|----|:----|
|Release state:|General availability (GA)|
|Pricing:|Requires [Microsoft Defender for Servers Plan 2](plan-defender-for-servers-select-plan.md#plan-features)|
|Required roles and permissions:|**Reader** on the workspace to which the host connects|
|Clouds:|:::image type="icon" source="./media/icons/yes-icon.png"::: Commercial clouds<br>:::image type="icon" source="./media/icons/yes-icon.png"::: National (Azure Government, Microsoft Azure operated by 21Vianet)<br>:::image type="icon" source="./media/icons/yes-icon.png"::: Connected AWS accounts|


## Identify and remediate security vulnerabilities in your Docker configuration

1. From Defender for Cloud's menu, open the **Recommendations** page.

1. Filter to the recommendation **Vulnerabilities in container security configurations should be remediated** and select the recommendation.

    The recommendation page shows the affected resources (Docker hosts). 

    :::image type="content" source="./media/monitor-container-security/docker-host-vulnerabilities-found.png" alt-text="Recommendation to remediate vulnerabilities in container security configurations.":::

    > [!NOTE]
    > Machines that aren't running Docker will be shown in the **Not applicable resources** tab. They'll appear in Azure Policy as Compliant. 

1. To view and remediate the CIS controls that a specific host failed, select the host you want to investigate. 

    > [!TIP]
    > If you started at the asset inventory page and reached this recommendation from there, select the **Take action** button on the recommendation page.
    >
    > :::image type="content" source="./media/monitor-container-security/host-security-take-action-button.png" alt-text="Take action button to launch Log Analytics.":::

    Log Analytics opens with a custom operation ready to run. The default custom query includes a list of all failed rules that were assessed, along with guidelines to help you resolve the issues.

    :::image type="content" source="./media/monitor-container-security/docker-host-vulnerabilities-in-query.png" alt-text="Log Analytics page with the query showing all failed CIS controls.":::

1. Tweak the query parameters if necessary.

1. When you're sure the command is appropriate and ready for your host, select **Run**.


## Next steps

Docker hardening is just one aspect of Defender for Cloud's container security features. 

Learn more [Container security in Defender for Cloud](defender-for-containers-introduction.md).
