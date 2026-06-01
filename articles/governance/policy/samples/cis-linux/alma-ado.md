---
title: Reference - CIS Security Benchmarks for AlmaLinux via Machine Configuration
description: Reference - CIS Security Benchmarks for AlmaLinux via Machine Configuration
ms.date: 11/07/2025
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---
# Release notes - AlmaLinux

This article provides detailed information about the CIS Security Benchmarks for AlmaLinux, including supported benchmarks, mismatched rules, and configurable parameters across all supported versions.

## Supported benchmarks

|AlmaLinux Version|Benchmark Title|
|---|---|
|AlmaLinux 8|[CIS AlmaLinux OS 8 Benchmark 3.0.0 Level 1 + Level 2 - Server](#cis-almalinux-os-8-benchmark-300-level-1--level-2---server)|
|AlmaLinux 9|[CIS AlmaLinux OS 9 Benchmark 2.0.0 Level 1 + Level 2 - Server](#cis-almalinux-os-9-benchmark-200-level-1--level-2---server)|

## CIS AlmaLinux OS 8 Benchmark 3.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- Ensure only one logging system is in use

### Not implemented rules

- Ensure access to the su command is restricted

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure dns server services are not in use|serviceName|named.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bind|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
||packageName|cron|
||alternativePackageName|cronie|
|Ensure permissions on /etc/cron.weekly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.monthly are configured|mask|0077|
||owner|root|
||group|root|
||alternativePackageName|cronie|
|Ensure permissions on /etc/cron.d are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/ssh/sshd_config are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/shadow- are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/gshadow are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/security/opasswd are configured|mask|0177|
||owner|root|
||group|root|

## CIS AlmaLinux OS 9 Benchmark 2.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- Ensure only one logging system is in use

### Not implemented rules

- Ensure access to the su command is restricted

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure dns server services are not in use|serviceName|named.service|
||expectedUnitFileState|enabled|
||expectedActiveState|active|
||packageName|bind|
|Ensure permissions on /etc/crontab are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
||packageName|cron|
||alternativePackageName|cronie|
|Ensure permissions on /etc/cron.weekly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.monthly are configured|mask|0077|
||owner|root|
||group|root|
||alternativePackageName|cronie|
|Ensure permissions on /etc/cron.d are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/ssh/sshd_config are configured|mask|0177|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/passwd- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/group- are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/shadow are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/shadow- are configured|mask|0137|
||owner|root|
||group|root\|shadow|
|Ensure permissions on /etc/gshadow are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/gshadow- are configured|mask|0137|
||owner|root|
||group|shadow\|root|
|Ensure permissions on /etc/shells are configured|mask|0133|
||owner|root|
||group|root|
|Ensure permissions on /etc/security/opasswd are configured|mask|0177|
||owner|root|
||group|root|