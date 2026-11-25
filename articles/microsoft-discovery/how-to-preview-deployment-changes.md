---
title: Preview Microsoft Discovery onboarding changes offline
description: Preview the intended actions of Discovery onboarding Stages 2-5 without Azure calls, and distinguish PLAN results from live readiness evidence.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: how-to
ms.date: 10/24/2026
# Customer intent: As a platform administrator, I want to inspect intended onboarding actions offline so that I can review scope before live execution.
---

# Preview Microsoft Discovery onboarding changes offline

Use `-DryRun` to describe a stage's intended actions from `config.json` without making Azure calls or changing resources. This parameter prevents VM creation and model inference. This task creates local output only when requested. It doesn't evaluate existing Azure state.

## Prerequisites

- PowerShell 7 or later and the [complete tool checkout](how-to-set-up-deployment-tool.md#obtain-the-complete-tool).
- A usable [Stage 1 configuration](how-to-create-deployment-configuration.md).
- A PowerShell prompt in `utilities\onboarding-tool\scripts`.

The preview doesn't require Azure CLI, authentication, or Azure permissions. Obtaining a configuration with verified live checks has separate requirements.

## Preview landing zone preparation

Run Stage 2 with `-DryRun` and an optional report path:

```powershell
.\stage2-landing-zone\stage2_prepare.ps1 `
  -ConfigPath .\config.json -DryRun -JsonPath .\out\stage2-plan.json
```

Review the proposed registration, access, network, and storage work. This output doesn't prove the runner is authorized to perform it or that the target virtual network is safe to change.

## Preview readiness checks

Select the profile you want to inspect:

```powershell
.\stage3-validation\stage3_validate.ps1 `
  -ConfigPath .\config.json -Profile workspace -DryRun `
  -JsonPath .\out\stage3-plan.json
```

`-Profile` supports `supercomputer`, `workspace`, and `bookshelf`. Adding `-WithVm -DryRun` only describes a VM lifecycle; it doesn't create a probe or perform network tests. The live probe option has [release limitations](how-to-validate-deployment-readiness.md#understand-the-optional-vm-probe).

## Preview deployment and scenario verification

Run the remaining previews:

```powershell
.\stage4-deployment\stage4_deploy.ps1 `
  -ConfigPath .\config.json -DryRun -JsonPath .\out\stage4-plan.json

.\stage5-scenario-enablement\stage5_enable.ps1 `
  -ConfigPath .\config.json -DryRun -JsonPath .\out\stage5-plan.json
```

The plan includes stage options, such as Stage 4 `-Recovery` and supported Stage 5 target overrides. A recovery preview isn't authorization to perform a live re-PUT.

For programmatic inspection, use `-PassThru`:

```powershell
$plan = .\stage2-landing-zone\stage2_prepare.ps1 `
  -ConfigPath .\config.json -DryRun -PassThru
$plan | Format-Table
```

In dry-run mode, `-PassThru` returns result objects without printing or writing the plan reports. It takes precedence over `-JsonPath`.

## Interpret the plan

Confirm these results:

- The verdict is **`PLAN`**, not `GO`.
- Checks are marked **Skip** because the tool didn't execute them.
- Exit `0` means the tool successfully generated the plan, not that the environment is ready.
- With `-JsonPath`, the tool writes the JSON plan and its Markdown companion. Without it, there are no plan report files.

Missing or invalid required configuration causes the preview to fail. Passing required-field and RBAC-mode validation doesn't establish that every deployment prerequisite is satisfied.

This preview isn't Azure what-if. It doesn't evaluate permissions, quota, capacity, policy, live configuration, DNS, or connectivity. A Stage 3 `PLAN` can't satisfy Stage 4's readiness-report gate. Stage 1 already performs planning and doesn't accept `-DryRun`.

When you're ready for live execution, review the stage's prerequisites and remove `-DryRun`. Don't remove it merely to obtain a different verdict.

## Next step

> [!div class="nextstepaction"]
> [Prepare the landing zone](how-to-prepare-landing-zone.md)
