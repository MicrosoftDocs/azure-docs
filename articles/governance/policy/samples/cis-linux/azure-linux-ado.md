---
title: Reference - CIS Security Benchmarks for AKS Optimized Azure Linux via Machine Configuration
description: Reference - CIS Security Benchmarks for AKS Optimized Azure Linux via Machine Configuration
ms.date: 06/18/2026
author: pallakatos
ms.author: pallakatos
ms.topic: reference
ms.custom: generated
---

# Release notes - AKS Optimized Azure Linux

This article provides detailed information about the CIS Security Benchmarks for AKS Optimized Azure Linux, including supported benchmarks, mismatched rules, and configurable parameters across all supported versions.

## Supported benchmarks

|AKS Optimized Azure Linux Version|Benchmark Title|
|---|---|
|AKS Optimized Azure Linux 3|[CIS AKS Optimized Azure Linux 3 Benchmark 1.0.0 Level 1 + Level 2 - Server](#cis-aks-optimized-azure-linux-3-benchmark-100-level-1--level-2---server)|

## CIS AKS Optimized Azure Linux 3 Benchmark 1.0.0 Level 1 + Level 2 - Server

### Mismatched rules

> [!NOTE]
> The mismatched rules are the ones that in some circumstances the assessment might differ from CIS-CAT® Pro Assessor; usually our implementation enforces stricter criteria.

- None

### Configurable parameters

|Rule|Parameter|Default Value|
|---|---|---|
|Ensure /tmp is a separate partition|mountPoint|/tmp|
|Ensure nodev option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /tmp partition|mountPoint|/tmp|
||requiredMountOptions|nosuid|
|Ensure /dev/shm is a separate partition|mountPoint|/dev/shm|
|Ensure nodev option set on /dev/shm partition|mountPoint|/dev/shm|
||requiredMountOptions|nodev|
|Ensure nosuid option set on /dev/shm partition|mountPoint|/dev/shm|
||requiredMountOptions|nosuid|
|Ensure core dump backtraces are disabled|processSizeMaxRegex|0|
|Ensure core dump storage is disabled|storageRegex|none|
|Ensure access to /etc/motd is configured|mask|0133|
||owner|root|
||group|root|
|Ensure access to /etc/issue is configured|filename|/etc/issue|
||mask|0133|
||owner|root|
||group|root|
|Ensure time synchronization is in use|packageName|chrony|
|Ensure telnet client is not installed|packageName|telnet|
|Ensure permissions on /etc/crontab are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.hourly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.daily are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.weekly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.monthly are configured|mask|0077|
||owner|root|
||group|root|
|Ensure permissions on /etc/cron.d are configured|mask|0077|
||owner|root|
||group|root|
|Ensure cron is restricted to authorized users|filenameEtcCronDeny|/etc/cron.deny|
||owner|root|
||group|root|
||mask|0137|
||filenameEtcCronAllow|/etc/cron.allow|
|Ensure at is restricted to authorized users|owner|root|
||group|root|
||mask|0177|
|Ensure access to /etc/ssh/sshd_config is configured|mask|0177|
||owner|root|
||group|root|
|Ensure sshd Ciphers are configured|ciphersDisallowedValues|3des-cbc,aes128-cbc,aes192-cbc,aes256-cbc,arcfour,arcfour128,arcfour256,blowfish-cbc,cast128-cbc,rijndael-cbc@lysator\.liu\.se|
|Ensure sshd KexAlgorithms is configured|kexalgorithmsDisallowedValues|diffie-hellman-group1-sha1,diffie-hellman-group14-sha1,diffie-hellman-group-exchange-sha1|
|Ensure sshd MACs are configured|macsDisallowedValues|hmac-md5,hmac-md5-96,hmac-ripemd160,hmac-sha1-96,umac-64@openssh\.com,hmac-md5-etm@openssh\.com,hmac-md5-96-etm@openssh\.com,hmac-ripemd160-etm@openssh\.com,hmac-sha1-96-etm@openssh\.com,umac-64-etm@openssh\.com|
|Ensure sshd access is configured|allowUsersValuePattern|[^ \t]+|
||allowGroupsValuePattern|[^ \t]+|
||denyUsersValuePattern|[^ \t]+|
||denyGroupsValuePattern|[^ \t]+|
|Ensure sshd Banner is configured|bannerExpectedValueT|\/[^ \t]+|
||bannerDisallowedValuesNone|none|
|Ensure sshd ClientAliveInterval and ClientAliveCountMax are configured|clientalivecountmaxThreshold|0|
||clientaliveintervalThreshold|0|
|Ensure sshd LoginGraceTime is configured|logingracetimeThresholdValue60|60|
||logingracetimeThresholdValue0|0|
|Ensure sshd LogLevel is configured|loglevelExpectedValue|verbose,info|
|Ensure sshd MaxAuthTries is configured|maxauthtriesThreshold|4|
|Ensure sshd MaxStartups is configured|maxstartupsExpectedValue|10:30:100|
|Ensure sshd MaxSessions is configured|maxsessionsThreshold|10|
|Ensure password expiration is 365 days or less|maxDays|365|
|Ensure minimum days between password changes is configured|minDays|1|
|Ensure password expiration warning days is 7 or more|warnDays|7|
|Ensure journald Storage is configured|storageValue|persistent|
|Ensure journald Compress is configured|compressValue|yes|
|Ensure access to /etc/security/opasswd is configured|mask|0177|
||owner|root|
||group|root|
