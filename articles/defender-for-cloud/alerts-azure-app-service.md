---
title: Alerts for Azure App Service
description: This article lists the security alerts for Azure App Service visible in Microsoft Defender for Cloud.
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/03/2024
ai-usage: ai-assisted
---

# Alerts for Azure App Service

This article lists the security alerts you might get for Azure App Service from Microsoft Defender for Cloud and any Microsoft Defender plans you enabled. The alerts shown in your environment depend on the resources and services you're protecting, and your customized configuration.  

> [!NOTE]
> Some of the recently added alerts powered by Microsoft Defender Threat Intelligence and Microsoft Defender for Endpoint might be undocumented.

[Learn how to respond to these alerts](managing-and-responding-alerts.yml).

[Learn how to export alerts](continuous-export.md).

> [!NOTE]
> Alerts from different sources might take different amounts of time to appear. For example, alerts that require analysis of network traffic might take longer to appear than alerts related to suspicious processes running on virtual machines.

## Azure App Service alerts

[Further details and notes](defender-for-app-service-introduction.md)

### **An attempt to run Linux commands on a Windows App Service**

(AppServices_LinuxCommandOnWindows)

**Description**: Analysis of App Service processes detected an attempt to run a Linux command on a Windows App Service. This action was running by the web application. This behavior is often seen during campaigns that exploit a vulnerability in a common web application.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **An IP that connected to your Azure App Service FTP Interface was found in Threat Intelligence**

(AppServices_IncomingTiClientIpFtp)

**Description**: Azure App Service FTP log indicates a connection from a source address that was found in the threat intelligence feed. During this connection, a user accessed the pages listed.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Medium

### **Attempt to run high privilege command detected**

(AppServices_HighPrivilegeCommand)

**Description**: Analysis of App Service processes detected an attempt to run a command that requires high privileges.
The command ran in the web application context. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Medium

### **Communication with suspicious domain identified by threat intelligence**

(AzureDNS_ThreatIntelSuspectDomain)

**Description**: Communication with suspicious domain was detected by analyzing DNS transactions from your resource and comparing against known malicious domains identified by threat intelligence feeds. Communication to malicious domains is frequently performed by attackers and could imply that your resource is compromised.

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access, Persistence, Execution, Command And Control, Exploitation

**Severity**: Medium

### **Connection to web page from anomalous IP address detected**

(AppServices_AnomalousPageAccess)

**Description**: Azure App Service activity log indicates an anomalous connection to a sensitive web page from the listed source IP address. This might indicate that someone is attempting a brute force attack into your web app administration pages. It might also be the result of a new IP address being used by a legitimate user. If the source IP address is trusted, you can safely suppress this alert for this resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Low

### **Dangling DNS record for an App Service resource detected**

(AppServices_DanglingDomain)

**Description**: A DNS record that points to a recently deleted App Service resource (also known as "dangling DNS" entry) has been detected. This leaves you susceptible to a subdomain takeover. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization's domain to a site performing malicious activity.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **Detected encoded executable in command line data**

(AppServices_Base64EncodedExecutableInCommandLineParams)

**Description**: Analysis of host data on {Compromised host} detected a base-64 encoded executable. This has previously been associated with attackers attempting to construct executables on-the-fly through a sequence of commands, and attempting to evade intrusion detection systems by ensuring that no individual command would trigger an alert. This could be legitimate activity, or an indication of a compromised host.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Detected file download from a known malicious source**

(AppServices_SuspectDownload)

**Description**: Analysis of host data has detected the download of a file from a known malware source on your host.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Privilege Escalation, Execution, Exfiltration, Command and Control

**Severity**: Medium

### **Detected suspicious file download**

(AppServices_SuspectDownloadArtifacts)

**Description**: Analysis of host data has detected suspicious download of remote file.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence

**Severity**: Medium

### **Digital currency mining related behavior detected**

(AppServices_DigitalCurrencyMining)

**Description**: Analysis of host data on Inn-Flow-WebJobs detected the execution of a process or command normally associated with digital currency mining.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Executable decoded using certutil**

(AppServices_ExecutableDecodedUsingCertutil)

**Description**: Analysis of host data on [Compromised entity] detected that certutil.exe, a built-in administrator utility, was being used to decode an executable instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using a tool such as certutil.exe to decode a malicious executable that will then be subsequently executed.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Fileless attack behavior detected**

(AppServices_FilelessAttackBehaviorDetection)

**Description**: The memory of the process specified below contains behaviors commonly used by fileless attacks.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Fileless attack technique detected**

(AppServices_FilelessAttackTechniqueDetection)

**Description**: The memory of the process specified below contains evidence of a fileless attack technique. Fileless attacks are used by attackers to execute code while evading detection by security software.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Fileless attack toolkit detected**

(AppServices_FilelessAttackToolkitDetection)

**Description**: The memory of the process specified below contains a fileless attack toolkit: {ToolKitName}. Fileless attack toolkits typically do not have a presence on the filesystem, making detection by traditional anti-virus software difficult.
Specific behaviors include: {list of observed behaviors}
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Microsoft Defender for Cloud test alert for App Service (not a threat)**

(AppServices_EICAR)

**Description**: This is a test alert generated by Microsoft Defender for Cloud. No further action is needed.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: High

### **NMap scanning detected**

(AppServices_Nmap)

**Description**: Azure App Service activity log indicates a possible web fingerprinting activity on your App Service resource.
The suspicious activity detected is associated with NMAP. Attackers often use this tool for probing the web application to find vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Informational

### **Phishing content hosted on Azure Webapps**

(AppServices_PhishingContent)

**Description**: URL used for phishing attack found on the Azure AppServices website. This URL was part of a phishing attack sent to Microsoft 365 customers. The content typically lures visitors into entering their corporate credentials or financial information into a legitimate looking website.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: High

### **PHP file in upload folder**

(AppServices_PhpInUploadFolder)

**Description**: Azure App Service activity log indicates an access to a suspicious PHP page located in the upload folder.
This type of folder doesn't usually contain PHP files. The existence of this type of file might indicate an exploitation taking advantage of arbitrary file upload vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Possible Cryptocoinminer download detected**

(AppServices_CryptoCoinMinerDownload)

**Description**: Analysis of host data has detected the download of a file normally associated with digital currency mining.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Command and Control, Exploitation

**Severity**: Medium

### **Possible data exfiltration detected**

(AppServices_DataEgressArtifacts)

**Description**: Analysis of host/device data detected a possible data egress condition. Attackers will often egress data from machines they have compromised.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection, Exfiltration

**Severity**: Medium

### **Potential dangling DNS record for an App Service resource detected**

(AppServices_PotentialDanglingDomain)

**Description**: A DNS record that points to a recently deleted App Service resource (also known as "dangling DNS" entry) has been detected. This might leave you susceptible to a subdomain takeover. Subdomain takeovers enable malicious actors to redirect traffic intended for an organization's domain to a site performing malicious activity. In this case, a text record with the Domain Verification ID was found. Such text records prevent subdomain takeover but we still recommend removing the dangling domain. If you leave the DNS record pointing at the subdomain you're at risk if anyone in your organization deletes the TXT file or record in the future.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Potential reverse shell detected**

(AppServices_ReverseShell)

**Description**: Analysis of host data  detected a potential reverse shell. These are used to get a compromised machine to call back into a machine an attacker owns.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration, Exploitation

**Severity**: Medium

### **Raw data download detected**

(AppServices_DownloadCodeFromWebsite)

**Description**: Analysis of App Service processes detected an attempt to download code from raw-data websites such as Pastebin. This action was run by a PHP process. This behavior is associated with attempts to download web shells or other malicious components to the App Service.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Saving curl output to disk detected**

(AppServices_CurlToDisk)

**Description**: Analysis of App Service processes detected the running of a curl command in which the output was saved to the disk. While this behavior can be legitimate, in web applications this behavior is also observed in malicious activities such as attempts to infect websites with web shells.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Spam folder referrer detected**

(AppServices_SpamReferrer)

**Description**: Azure App Service activity log indicates web activity that was identified as originating from a web site associated with spam activity. This can occur if your website is compromised and used for spam activity.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspicious access to possibly vulnerable web page detected**

(AppServices_ScanSensitivePage)

**Description**: Azure App Service activity log indicates a web page that seems to be sensitive was accessed. This suspicious activity originated from a source IP address whose access pattern resembles that of a web scanner.
This activity is often associated with an attempt by an attacker to scan your network to try to gain access to sensitive or vulnerable web pages.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: -

**Severity**: Low

### **Suspicious domain name reference**

(AppServices_CommandlineSuspectDomain)

**Description**: Analysis of host data detected reference to suspicious domain name. Such activity, while possibly legitimate user behavior, is frequently an indication of the download or execution of malicious software. Typical related attacker activity is likely to include the download and execution of further malicious software or remote administration tools.
(Applies to: App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Exfiltration

**Severity**: Low

### **Suspicious download using Certutil detected**

(AppServices_DownloadUsingCertutil)

**Description**: Analysis of host data on {NAME} detected the use of certutil.exe, a built-in administrator utility, for the download of a binary instead of its mainstream purpose that relates to manipulating certificates and certificate data. Attackers are known to abuse functionality of legitimate administrator tools to perform malicious actions, for example using certutil.exe to download and decode a malicious executable that will then be subsequently executed.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious PHP execution detected**

(AppServices_SuspectPhp)

**Description**: Machine logs indicate that a suspicious PHP process is running. The action included an attempt to run operating system commands or PHP code from the command line, by using the PHP process. While this behavior can be legitimate, in web applications this behavior might indicate malicious activities, such as attempts to infect websites with web shells.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious PowerShell cmdlets executed**

(AppServices_PowerShellPowerSploitScriptExecution)

**Description**: Analysis of host data indicates execution of known malicious PowerShell PowerSploit cmdlets.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: Medium

### **Suspicious process executed**

(AppServices_KnownCredential AccessTools)

**Description**: Machine logs indicate that the suspicious process: '%{process path}' was running on the machine, often associated with attacker attempts to access credentials.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Credential Access

**Severity**: High

### **Suspicious process name detected**

(AppServices_ProcessWithKnownSuspiciousExtension)

**Description**: Analysis of host data on {NAME} detected a process whose name is suspicious, for example corresponding to a known attacker tool or named in a way that is suggestive of attacker tools that try to hide in plain sight. This process could be legitimate activity, or an indication that one of your machines has been compromised.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Persistence, Defense Evasion

**Severity**: Medium

### **Suspicious SVCHOST process executed**

(AppServices_SVCHostFromInvalidPath)

**Description**: The system process SVCHOST was observed running in an abnormal context. Malware often uses SVCHOST to mask its malicious activity.
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Defense Evasion, Execution

**Severity**: High

### **Suspicious User Agent detected**

(AppServices_UserAgentInjection)

**Description**: Azure App Service activity log indicates requests with suspicious user agent. This behavior can indicate on attempts to exploit a vulnerability in your App Service application.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Initial Access

**Severity**: Informational

### **Suspicious WordPress theme invocation detected**

(AppServices_WpThemeInjection)

**Description**: Azure App Service activity log indicates a possible code injection activity on your App Service resource.
The suspicious activity detected resembles that of a manipulation of WordPress theme to support server side execution of code, followed by a direct web request to invoke the manipulated theme file.
This type of activity was seen in the past as part of an attack campaign over WordPress.
If your App Service resource isn't hosting a WordPress site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Execution

**Severity**: High

### **Vulnerability scanner detected**

(AppServices_DrupalScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting a content management system (CMS).
If your App Service resource isn't hosting a Drupal site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Vulnerability scanner detected (Joomla)**

(AppServices_JoomlaScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting Joomla applications.
If your App Service resource isn't hosting a Joomla site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Vulnerability scanner detected (WordPress)**

(AppServices_WpScanner)

**Description**: Azure App Service activity log indicates that a possible vulnerability scanner was used on your App Service resource.
The suspicious activity detected resembles that of tools targeting WordPress applications.
If your App Service resource isn't hosting a WordPress site, it isn't vulnerable to this specific code injection exploit and you can safely suppress this alert for the resource. To learn how to suppress security alerts, see [Suppress alerts from Microsoft Defender for Cloud](alerts-suppression-rules.md).
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Low

### **Web fingerprinting detected**

(AppServices_WebFingerprinting)

**Description**: Azure App Service activity log indicates a possible web fingerprinting activity on your App Service resource.
The suspicious activity detected is associated with a tool called Blind Elephant. The tool fingerprint web servers and tries to detect the installed applications and version.
Attackers often use this tool for probing the web application to find vulnerabilities.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: PreAttack

**Severity**: Medium

### **Website is tagged as malicious in threat intelligence feed**

(AppServices_SmartScreen)

**Description**: Your website as described below is marked as a malicious site by Windows SmartScreen. If you think this is a false positive, contact Windows SmartScreen via report feedback link provided.
(Applies to: App Service on Windows and App Service on Linux)

**[MITRE tactics](alerts-reference.md#mitre-attck-tactics)**: Collection

**Severity**: Medium

> [!NOTE]
> For alerts that are in preview: [!INCLUDE [Legalese](../../includes/defender-for-cloud-preview-legal-text.md)]

## Next steps

- [Security alerts in Microsoft Defender for Cloud](alerts-overview.md)
- [Manage and respond to security alerts in Microsoft Defender for Cloud](managing-and-responding-alerts.yml)
- [Continuously export Defender for Cloud data](continuous-export.md)
