---
title: Reference table for deprecated security alerts
description: This article lists deprecated security alerts in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Deprecated security alerts

This article lists deprecated security alerts in Microsoft Defender for Cloud.

## Deprecated Defender for Containers alerts

The following lists include the Defender for Containers security alerts which were deprecated.

### **Manipulation of host firewall detected**

(K8S.NODE_FirewallDisabled)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a possible manipulation of the on-host firewall. Attackers will often disable this to exfiltrate data.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion, Exfiltration

**Severity**: Medium

### **Suspicious use of DNS over HTTPS**

(K8S.NODE_SuspiciousDNSOverHttps)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected the use of a DNS call over HTTPS in an uncommon fashion. This technique is used by attackers to hide calls out to suspect or malicious sites.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: DefenseEvasion, Exfiltration

**Severity**: Medium

### **A possible connection to malicious location has been detected**

(K8S.NODE_ThreatIntelCommandLineSuspectDomain)

**Description**: Analysis of processes running within a container or directly on a Kubernetes node, has detected a connection to a location that has been reported to be malicious or unusual. This is an indicator that a compromise might have occurred.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: InitialAccess

**Severity**: Medium

### **Digital currency mining activity**

(K8S.NODE_CurrencyMining)

**Description**: Analysis of DNS transactions detected digital currency mining activity. Such activity, while possibly legitimate user behavior, is frequently performed by attackers following compromise of resources. Typical related attacker activity is likely to include the download and execution of common mining tools.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

## Deprecated Defender for Servers Linux alerts

### VM_AbnormalDaemonTermination

**Alert Display Name**: Abnormal Termination

**Severity**: Low

### VM_BinaryGeneratedFromCommandLine

**Alert Display Name**: Suspicious binary detected

**Severity**: Medium

### VM_CommandlineSuspectDomain  Suspicious

**Alert Display Name**: domain name reference

**Severity**: Low

### VM_CommonBot

**Alert Display Name**: Behavior similar to common Linux bots detected

**Severity**: Medium

### VM_CompCommonBots

**Alert Display Name**: Commands similar to common Linux bots detected

**Severity**: Medium

### VM_CompSuspiciousScript

**Alert Display Name**: Shell Script Detected

**Severity**: Medium

### VM_CompTestRule

**Alert Display Name**: Composite Analytic Test Alert

**Severity**: Low

### VM_CronJobAccess

**Alert Display Name**: Manipulation of scheduled tasks detected

**Severity**: Informational

### VM_CryptoCoinMinerArtifacts

**Alert Display Name**: Process associated with digital currency mining detected

**Severity**: Medium

### VM_CryptoCoinMinerDownload

**Alert Display Name**: Possible Cryptocoinminer download detected

**Severity**: Medium

### VM_CryptoCoinMinerExecution

**Alert Display Name**: Potential crypto coin miner started

**Severity**: Medium

### VM_DataEgressArtifacts

**Alert Display Name**: Possible data exfiltration detected

**Severity**: Medium

### VM_DigitalCurrencyMining

**Alert Display Name**: Digital currency mining related behavior detected

**Severity**: High

### VM_DownloadAndRunCombo

**Alert Display Name**: Suspicious Download Then Run Activity

**Severity**: Medium

### VM_EICAR

**Alert Display Name**: Microsoft Defender for Cloud test alert (not a threat)

**Severity**: High

### VM_ExecuteHiddenFile

**Alert Display Name**: Execution of hidden file

**Severity**: Informational

### VM_ExploitAttempt

**Alert Display Name**: Possible command line exploitation attempt

**Severity**: Medium

### VM_ExposedDocker

**Alert Display Name**: Exposed Docker daemon on TCP socket

**Severity**: Medium

### VM_FairwareMalware

**Alert Display Name**: Behavior similar to Fairware ransomware detected

**Severity**: Medium

### VM_FirewallDisabled

**Alert Display Name**: Manipulation of host firewall detected

**Severity**: Medium

### VM_HadoopYarnExploit

**Alert Display Name**: Possible exploitation of Hadoop Yarn

**Severity**: Medium

### VM_HistoryFileCleared

**Alert Display Name**: A history file has been cleared

**Severity**: Medium

### VM_KnownLinuxAttackTool

**Alert Display Name**: Possible attack tool detected

**Severity**: Medium

### VM_KnownLinuxCredentialAccessTool

**Alert Display Name**: Possible credential access tool detected

**Severity**: Medium

### VM_KnownLinuxDDoSToolkit

**Alert Display Name**: Indicators associated with DDOS toolkit detected

**Severity**: Medium

### VM_KnownLinuxScreenshotTool

**Alert Display Name**: Screenshot taken on host

**Severity**: Low

### VM_LinuxBackdoorArtifact

**Alert Display Name**: Possible backdoor detected

**Severity**: Medium

### VM_LinuxReconnaissance

**Alert Display Name**: Local host reconnaissance detected

**Severity**: Medium

### VM_MismatchedScriptFeatures

**Alert Display Name**: Script extension mismatch detected

**Severity**: Medium

### VM_MitreCalderaTools

**Alert Display Name**: MITRE Caldera agent detected

**Severity**: Medium

### VM_NewSingleUserModeStartupScript

**Alert Display Name**: Detected Persistence Attempt

**Severity**: Medium

### VM_NewSudoerAccount

**Alert Display Name**: Account added to sudo group

**Severity**: Low

### VM_OverridingCommonFiles

**Alert Display Name**: Potential overriding of common files

**Severity**: Medium

### VM_PrivilegedContainerArtifacts

**Alert Display Name**: Container running in privileged mode

**Severity**: Low

### VM_PrivilegedExecutionInContainer

**Alert Display Name**: Command within a container running with high privileges

**Severity**: Low

### VM_ReadingHistoryFile

**Alert Display Name**: Unusual access to bash history file

**Severity**: Informational

### VM_ReverseShell

**Alert Display Name**: Potential reverse shell detected

**Severity**: Medium

### VM_SshKeyAccess

**Alert Display Name**: Process seen accessing the SSH authorized keys file in an unusual way

**Severity**: Low

### VM_SshKeyAddition

**Alert Display Name**: New SSH key added

**Severity**: Low

### VM_SuspectCompilation

**Alert Display Name**: Suspicious compilation detected

**Severity**: Medium

### VM_SuspectConnection

**Alert Display Name**: An uncommon connection attempt detected

**Severity**: Medium

### VM_SuspectDownload

**Alert Display Name**: Detected file download from a known malicious source

**Severity**: Medium

### VM_SuspectDownloadArtifacts

**Alert Display Name**: Detected suspicious file download

**Severity**: Low

### VM_SuspectExecutablePath

**Alert Display Name**: Executable found running from a suspicious location

**Severity**: Medium

### VM_SuspectHtaccessFileAccess

**Alert Display Name**: Access of htaccess file detected

**Severity**: Medium

### VM_SuspectInitialShellCommand

**Alert Display Name**: Suspicious first command in shell

**Severity**: Low

### VM_SuspectMixedCaseText

**Alert Display Name**: Detected anomalous mix of uppercase and lowercase characters in command line

**Severity**: Medium

### VM_SuspectNetworkConnection

**Alert Display Name**: Suspicious network connection

**Severity**: Informational

### VM_SuspectNohup

**Alert Display Name**: Detected suspicious use of the nohup command

**Severity**: Medium

### VM_SuspectPasswordChange

**Alert Display Name**: Possible password change using crypt-method detected

**Severity**: Medium

### VM_SuspectPasswordFileAccess

**Alert Display Name**: Suspicious password access

**Severity**: Informational

### VM_SuspectPhp

**Alert Display Name**: Suspicious PHP execution detected

**Severity**: Medium

### VM_SuspectPortForwarding

**Alert Display Name**: Potential port forwarding to external IP address

**Severity**: Medium

### VM_SuspectProcessAccountPrivilegeCombo

**Alert Display Name**: Process running in a service account became root unexpectedly

**Severity**: Medium

### VM_SuspectProcessTermination

**Alert Display Name**: Security-related process termination detected

**Severity**: Low

### VM_SuspectUserAddition

**Alert Display Name**: Detected suspicious use of the useradd command

**Severity**: Medium

### VM_SuspiciousCommandLineExecution

**Alert Display Name**: Suspicious command execution

**Severity**: High

### VM_SuspiciousDNSOverHttps

**Alert Display Name**: Suspicious use of DNS over HTTPS

**Severity**: Medium

### VM_SystemLogRemoval

**Alert Display Name**: Possible Log Tampering Activity Detected

**Severity**: Medium

### VM_ThreatIntelCommandLineSuspectDomain

**Alert Display Name**: A possible connection to malicious location has been detected

**Severity**: Medium

### VM_ThreatIntelSuspectLogon

**Alert Display Name**: A logon from a malicious IP has been detected

**Severity**: High

### VM_TimerServiceDisabled

**Alert Display Name**: Attempt to stop apt-daily-upgrade.timer service detected

**Severity**: Informational

### VM_TimestampTampering

**Alert Display Name**: Suspicious file timestamp modification

**Severity**: Low

### VM_Webshell

**Alert Display Name**: Possible malicious web shell detected

**Severity**: Medium

## Deprecated Defender for Servers Windows alerts

### SCUBA_MULTIPLEACCOUNTCREATE

**Alert Display Name**: Suspicious creation of accounts on multiple hosts

**Severity**: Medium

### SCUBA_PSINSIGHT_CONTEXT

**Alert Display Name**: Suspicious use of PowerShell detected

**Severity**: Informational

### SCUBA_RULE_AddGuestToAdministrators

**Alert Display Name**: Addition of Guest account to Local Administrators group

**Severity**: Medium

### SCUBA_RULE_Apache_Tomcat_executing_suspicious_commands

**Alert Display Name**: Apache_Tomcat_executing_suspicious_commands

**Severity**: Medium

### SCUBA_RULE_KnownBruteForcingTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownCollectionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownDefenseEvasionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownExecutionTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownPassTheHashTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_KnownSpammingTools

**Alert Display Name**: Suspicious process executed

**Severity**: Medium

### SCUBA_RULE_Lowering_Security_Settings

**Alert Display Name**: Detected the disabling of critical services

**Severity**: Medium

### SCUBA_RULE_OtherKnownHackerTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### SCUBA_RULE_RDP_session_hijacking_via_tscon

**Alert Display Name**: Suspect integrity level indicative of RDP hijacking

**Severity**: Medium

### SCUBA_RULE_RDP_session_hijacking_via_tscon_service

**Alert Display Name**: Suspect service installation

**Severity**: Medium

### SCUBA_RULE_Suppress_pesky_unauthorized_use_prohibited_notices

**Alert Display Name**: Detected suppression of legal notice displayed to users at logon

**Severity**: Low

### SCUBA_RULE_WDigest_Enabling

**Alert Display Name**: Detected enabling of the WDigest UseLogonCredential registry key

**Severity**: Medium

### VM.Windows_ApplockerBypass

**Alert Display Name**: Potential attempt to bypass AppLocker detected

**Severity**: High

### VM.Windows_BariumKnownSuspiciousProcessExecution

**Alert Display Name**: Detected suspicious file creation

**Severity**: High

### VM.Windows_Base64EncodedExecutableInCommandLineParams

**Alert Display Name**: Detected encoded executable in command line data

**Severity**: High

### VM.Windows_CalcsCommandLineUse

**Alert Display Name**: Detected suspicious use of Cacls to lower the security state of the system

**Severity**: Medium

### VM.Windows_CommandLineStartingAllExe

**Alert Display Name**: Detected suspicious command line used to start all executables in a directory

**Severity**: Medium

### VM.Windows_DisablingAndDeletingIISLogFiles

**Alert Display Name**: Detected actions indicative of disabling and deleting IIS log files

**Severity**: Medium

### VM.Windows_DownloadUsingCertutil

**Alert Display Name**: Suspicious download using Certutil detected

**Severity**: Medium

### VM.Windows_EchoOverPipeOnLocalhost

**Alert Display Name**: Detected suspicious named pipe communications

**Severity**: High

### VM.Windows_EchoToConstructPowerShellScript

**Alert Display Name**: Dynamic PowerShell script construction

**Severity**: Medium

### VM.Windows_ExecutableDecodedUsingCertutil

**Alert Display Name**: Detected decoding of an executable using built-in certutil.exe tool

**Severity**: Medium

### VM.Windows_FileDeletionIsSospisiousLocation

**Alert Display Name**: Suspicious file deletion detected

**Severity**: Medium

### VM.Windows_KerberosGoldenTicketAttack

**Alert Display Name**: Suspected Kerberos Golden Ticket attack parameters observed

**Severity**: Medium

### VM.Windows_KeygenToolKnownProcessName

**Alert Display Name**: Detected possible execution of keygen executable Suspicious process executed

**Severity**: Medium

### VM.Windows_KnownCredentialAccessTools

**Alert Display Name**: Suspicious process executed

**Severity**: High

### VM.Windows_KnownSuspiciousPowerShellScript

**Alert Display Name**: Suspicious use of PowerShell detected

**Severity**: High

### VM.Windows_KnownSuspiciousSoftwareInstallation

**Alert Display Name**: High risk software detected

**Severity**: Medium

### VM.Windows_MsHtaAndPowerShellCombination

**Alert Display Name**: Detected suspicious combination of HTA and PowerShell

**Severity**: Medium

### VM.Windows_MultipleAccountsQuery

**Alert Display Name**: Multiple Domain Accounts Queried

**Severity**: Medium

### VM.Windows_NewAccountCreation

**Alert Display Name**: Account creation detected

**Severity**: Informational

### VM.Windows_ObfuscatedCommandLine

**Alert Display Name**: Detected obfuscated command line.

**Severity**: High

### VM.Windows_PcaluaUseToLaunchExecutable

**Alert Display Name**: Detected suspicious use of Pcalua.exe to launch executable code

**Severity**: Medium

### VM.Windows_PetyaRansomware

**Alert Display Name**: Detected Petya ransomware indicators

**Severity**: High

### VM.Windows_PowerShellPowerSploitScriptExecution

**Alert Display Name**: Suspicious PowerShell cmdlets executed

**Severity**: Medium

### VM.Windows_RansomwareIndication

**Alert Display Name**: Ransomware indicators detected

**Severity**: High

### VM.Windows_SqlDumperUsedSuspiciously

**Alert Display Name**: Possible credential dumping detected [seen multiple times]

**Severity**: Medium

### VM.Windows_StopCriticalServices

**Alert Display Name**: Detected the disabling of critical services

**Severity**: Medium

### VM.Windows_SubvertingAccessibilityBinary

**Alert Display Name**: Sticky keys attack detected
 Suspicious account creation detected  Medium

### VM.Windows_SuspiciousAccountCreation

**Alert Display Name**: Suspicious Account Creation Detected

**Severity**: Medium

### VM.Windows_SuspiciousFirewallRuleAdded

**Alert Display Name**: Detected suspicious new firewall rule

**Severity**: Medium

### VM.Windows_SuspiciousFTPSSwitchUsage

**Alert Display Name**: Detected suspicious use of FTP -s switch

**Severity**: Medium

### VM.Windows_SuspiciousSQLActivity

**Alert Display Name**: Suspicious SQL activity

**Severity**: Medium

### VM.Windows_SVCHostFromInvalidPath

**Alert Display Name**: Suspicious process executed

**Severity**: High

### VM.Windows_SystemEventLogCleared

**Alert Display Name**: The Windows Security log was cleared

**Severity**: Informational

### VM.Windows_TelegramInstallation

**Alert Display Name**: Detected potentially suspicious use of Telegram tool

**Severity**: Medium

### VM.Windows_UndercoverProcess

**Alert Display Name**: Suspiciously named process detected

**Severity**: High

### VM.Windows_UserAccountControlBypass

**Alert Display Name**: Detected change to a registry key that can be abused to bypass UAC

**Severity**: Medium

### VM.Windows_VBScriptEncoding

**Alert Display Name**: Detected suspicious execution of VBScript.Encode command

**Severity**: Medium

### VM.Windows_WindowPositionRegisteryChange

**Alert Display Name**: Suspicious WindowPosition registry value detected

**Severity**: Low

### VM.Windows_ZincPortOpenningUsingFirewallRule

**Alert Display Name**: Malicious firewall rule created by ZINC server implant

**Severity**: High

### VM_DigitalCurrencyMining

**Alert Display Name**: Digital currency mining related behavior detected

**Severity**: High

### VM_MaliciousSQLActivity

**Alert Display Name**: Malicious SQL activity

**Severity**: High

### VM_ProcessWithDoubleExtensionExecution

**Alert Display Name**: Suspicious double extension file executed

**Severity**: High

### VM_RegistryPersistencyKey

**Alert Display Name**: Windows registry persistence method detected

**Severity**: Low

### VM_ShadowCopyDeletion

**Alert Display Name**: Suspicious Volume Shadow Copy Activity
 Executable found running from a suspicious location

**Severity**: High

### VM_SuspectExecutablePath

**Alert Display Name**: Executable found running from a suspicious location
 Detected anomalous mix of uppercase and lowercase characters in command line

**Severity**: Informational
  
 Medium

### VM_SuspectPhp

**Alert Display Name**: Suspicious PHP execution detected

**Severity**: Medium

### VM_SuspiciousCommandLineExecution

**Alert Display Name**: Suspicious command execution

**Severity**: High

### VM_SuspiciousScreenSaverExecution

**Alert Display Name**: Suspicious Screensaver process executed

**Severity**: Medium

### VM_SvcHostRunInRareServiceGroup

**Alert Display Name**: Rare SVCHOST service group executed

**Severity**: Informational

### VM_SystemProcessInAbnormalContext

**Alert Display Name**: Suspicious system process executed

**Severity**: Medium

### VM_ThreatIntelCommandLineSuspectDomain

**Alert Display Name**: A possible connection to malicious location has been detected

**Severity**: Medium

### VM_ThreatIntelSuspectLogon

**Alert Display Name**: A logon from a malicious IP has been detected

**Severity**: High

### VM_VbScriptHttpObjectAllocation

**Alert Display Name**: VBScript HTTP object allocation detected

**Severity**: High

### VM_TaskkillBurst

**Alert Display Name**: Suspicious process termination burst

**Severity**: Low

### VM_RunByPsExec

**Alert Display Name**: PsExec execution detected

**Severity**: Informational

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
