---
title: Archive tier troubleshoots
description: Learn to troubleshoot Archive Tier errors for Azure Backup.
ms.topic: troubleshooting
ms.date: 10/23/2021
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshooting recovery point archive using Archive Tier

This article provides troubleshooting details to for error codes that appears when a recovery point can't be moved to archive.

## RecoveryPointTypeNotEligibleForArchive

**Error message**: Recovery-Point Type is not eligible for Archive Move

**Description**: This error code is shown when the selected recovery point type isn't eligible to be moved to archive.

**Recommended action**: Check eligibility of the recovery point. See [Supported workloads](archive-tier-support.md#supported-workloads).

## RecoveryPointHaveActiveDependencies

**Error message**: Recovery-Point having active dependencies for restore is not eligible for Archive Move

**Description**: The selected recovery point has active dependencies and so can’t be moved to archive.

**Recommended action**" Check eligibility of the recovery point. See [Supported workloads](archive-tier-support.md#supported-workloads).

## MinLifeSpanInStandardRequiredForArchive

**Error message**: Recovery-Point is not eligible for Archive Move as lifespan spent in Vault-Standard-Tier is lesser than the required minimum

**Description**: The recovery point has to stay in Standard tier for a minimum of three months for Azure virtual machines, and 45 days for SQL Server in Azure virtual machines

**Recommended action**: Check eligibility of the recovery point. See [Supported workloads](archive-tier-support.md#supported-workloads).

## MinRemainingLifeSpanInArchiveRequired

**Error message**: Recovery-Point remaining lifespan is lesser than the required minimum.

**Description**: The minimum lifespan required for a recovery point for archive move eligibility is six months.

**Recommended action**: Check eligibility of the recovery point. See [Supported workloads](archive-tier-support.md#supported-workloads).

## UserErrorRecoveryPointAlreadyInArchiveTier

**Error message**: Recovery-Point is not eligible for archive move as it has already been moved to archive tier

**Description**: The selected recovery point is already in archive. So it’s not eligible to be moved to archive.

## UserErrorDatasourceTypeIsNotSupportedForRecommendationApi

**Error message**: Datasource Type is not eligible for Recommendation API.

**Description**: Recommendation API is only applicable for Azure virtual machines. It’s not applicable for the selected datasource type.

## UserErrorRecoveryPointAlreadyRehydrated

**Error message**: Recovery Point is already rehydrated. Rehydration is not allowed on this RP.

**Description**: The selected recovery point is already rehydrated.

## UserErrorRecoveryPointIsNotEligibleForArchiveMove

**Error message**: Recovery-Point is not eligible for Archive Move.

**Description**: The selected recovery point isn't eligible for archive move.

## UserErrorRecoveryPointNotRehydrated

**Error message**: Archive Recovery Point is not rehydrated. Retry Restore after rehydration completed on Archive RP.

**Description**: The recovery point isn't rehydrated. Try restore after rehydrating the recovery point.

## UserErrorRecoveryPointRehydrationNotAllowed

**Error message**: Rehydration is only supported for Archive Recovery Points- Rehydration is only supported for Archive Recovery Points

**Description**: Rehydration isn’t allowed for the selected recovery point.

## UserErrorRecoveryPointRehydrationAlreadyInProgress

**Error message**: Rehydration is already In-Progress for Archive Recovery Point.

**Description**: The rehydration for the selected recovery point is already in progress.

## RPMoveNotSupportedDueToInsufficientRetention

**Error message** - Recovery point cannot be moved to Archive tier due to insufficient retention duration specified in policy

**Recommended action**: Update policy on the protected item with appropriate retention setting, and try again.

## RPMoveReadinessToBeDetermined

**Error message**: We're still determining if this Recovery Point can be moved.

**Description**: The move readiness of the recovery point is yet to be determined.

**Recommended action**: Check again after waiting for some time.
