---
title: Microsoft Discovery onboarding reports and generated artifacts
description: Interpret onboarding verdicts and check statuses, locate per-stage reports and request artifacts, and understand readiness gates and evidence handling.
author: yousefi
ms.author: yousefi
ms.service: azure
ms.topic: reference
ms.date: 10/24/2026
# Customer intent: As an onboarding operator, I want to interpret reports and handoff artifacts so that I can distinguish completed checks from pending external work.
---

# Microsoft Discovery onboarding reports and generated artifacts

Onboarding reports record checks performed by a particular tool revision against its inputs. Request artifacts support team handoffs. Neither a report filename nor a generated request proves that all deployment prerequisites are satisfied.

## Verdicts and exit behavior

| Verdict | Meaning | Exit behavior |
| --- | --- | --- |
| `GO` | A live stage recorded no Fail checks. Warn, Skip, or Waived results can still be present. | Normal completed stage exits `0`. Review incomplete checks before advancing. |
| `NO-GO` | At least one check failed. | Normal completed stage exits nonzero. Read failure remediation and don't advance. |
| `PLAN` | Offline `-DryRun` described intended Stage 2-5 actions. | Successful plan generation exits `0`; invalid/missing required config fails. Not readiness or certification. |

Script termination or an unhandled error can fail before a complete report is written. `-PassThru` returns objects for programmatic use; don't assume the normal console/report/exit workflow when using it.

## Per-check statuses

| Status | Interpretation |
| --- | --- |
| Pass | The implemented check succeeded. |
| Fail | The check found a blocking issue; read its detail and remediation. |
| Warn | Review the gap or required action even if the stage continues. |
| Skip | The check wasn't performed; this isn't positive evidence. |
| Waived | A recorded waiver covers the tool check; it isn't an Azure Policy exemption or proof the underlying requirement is met. |

For Stage 3, static `GO` doesn't prove in-network connectivity. For Stage 5, the tool's `CERTIFIED`/`NOT CERTIFIED` label describes its bounded scenario checks, not a scientific or compliance judgment.

## Report format and location

Examples use a PowerShell prompt in `utilities\onboarding-tool\scripts`.

`-JsonPath .\out\stage1.json` writes the JSON report and a sibling `stage1.md`. A different basename changes both names. The tool creates parent output directories as needed. Reports aren't automatically written for every invocation: use `-JsonPath` explicitly for this series.

The shared JSON summary contains:

| Field | Purpose |
| --- | --- |
| `title`, `generated` | Report title and UTC generation timestamp. |
| `total`, `pass`, `fail`, `warn`, `skip`, `waived` | Check counts. |
| `verdict` | `GO`, `NO-GO`, or `PLAN`. |
| `results` | Check objects with identity, status, detail, remediation, and optional data. |
| `extra` | Optional stage-specific context, such as Stage 3 profile or Stage 5 output paths. |

Use the actual JSON for the checked-out revision as the contract. Don't fabricate a readiness report by editing a verdict or copying an old successful file.

For dry runs, `-PassThru` takes precedence over `-JsonPath` and returns plan result objects without writing reports. Live stage-specific artifacts can have separate behavior; in particular, Stage 5 can write state/response files even without a summary report path.

## Per-stage output inventory

| Stage | Files from the documented commands | Required review |
| --- | --- | --- |
| 1 | `out\stage1.json`, `out\stage1.md`; `config.json` at `-OutConfig`, outside `out` | Verify the current run generated the config; check inputs and any skipped live checks. Don't consume a stale config after failure. |
| 2 | `out\stage2.json`, `out\stage2.md`; applicable request/eligibility artifacts below | Confirm intended resources/access and complete customer-owned handoffs. |
| 3 | `out\stage3-supercomputer.json/.md`, `out\stage3-workspace.json/.md` | Review both profiles, actual checks, and separate connectivity evidence. Refresh after changes. |
| 4 | `out\stage4.json`, `out\stage4.md` | Inspect resource IDs/states, ARM failures/correlation details, and Foundry access warnings. Bookshelf isn't deployed. |
| 5 | `out\stage5.json`, `out\stage5.md`; timestamped state/response files | Review completed nonempty answer, check results, created objects, and cleanup responsibilities. |
| Preview | Selected `*-plan.json` and sibling Markdown, when `-JsonPath` is supplied without `-PassThru` | Verify scope only. `PLAN` can't substitute for a live report. |

Stage 5's `stage5-state-<timestamp>.json` records target identifiers and test progress. Its `stage5-response-<timestamp>.json` contains response data when the prompt step reaches that output. A failed early probe might leave no response file even when a planned response path is reported. Locate actual paths in the report and check existence.

## Stage 2 request artifacts

Artifacts are placed beside the selected `-JsonPath` when emitted. Names include the workspace.

| Filename family | Purpose | Action that remains outside file generation |
| --- | --- | --- |
| `firewall-request-<workspace>.md/.json` | Required outbound network changes | Network owner applies rules and verifies routing, SNAT, and connectivity. |
| `quota-increase-requests-<workspace>.md/.json` | Quota requirements/requests | Capacity owner obtains quota and verifies availability. |
| `policy-exemption-requests-<workspace>.md/.json` | Applicable exemption request instructions | Governance owner authorizes and applies an effective exemption or another approved resolution. |
| `human-pim-eligibility-<workspace>.md/.json` | User eligibility in JIT mode | IAM verifies eligibility; users activate access for required operations. |

## Stage 4 readiness-report handling

The [deployment procedure](how-to-deploy-platform.md) passes both Stage 3 JSON reports through `-ReadinessReport`.

- In the normal path, each supplied report must exist, parse, and have `verdict=GO`; otherwise deployment is blocked.
- Omitted reports produce a warning and the normal path can proceed.
- Missing supercomputer profile coverage can warn rather than block.
- The gate doesn't prove freshness, configuration identity, comprehensive profile coverage, or actual connectivity.
- Workspace `-Recovery` uses a separate path before this normal gate.

The operator must keep the configuration and evidence aligned. An offline plan, a modified verdict, or a successful report from another environment isn't acceptable evidence.

## Evidence handling and support

Retain the tool revision, reviewed configuration, reports, approvals, connectivity evidence, and deployed resource IDs according to customer policy. Report files can contain tenant/subscription and object IDs, network topology, approval justifications, and scientific text.

Don't commit generated customer files or attach raw prompts, tokens, or confidential reports to public issues. For support, provide a sanitized failure/check summary and correlation ID using the approved support channel.

## Related content

- [Onboarding permissions by stage](reference-deployment-permissions.md)
- [Validate readiness](how-to-validate-deployment-readiness.md)
- [Troubleshoot onboarding](troubleshoot-deployment-tool.md)
