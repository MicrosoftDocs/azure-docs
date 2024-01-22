---
title: Track changes to system files and registry keys
description: Learn about tracking changes to system files and registry keys with file integrity monitoring in Microsoft Defender for Cloud.
author: dcurwin
ms.author: dacurwin
ms.topic: how-to
ms.date: 11/14/2022
---
# File Integrity Monitoring in Microsoft Defender for Cloud

File Integrity Monitoring (FIM) examines operating system files, Windows registries, application software, and Linux system files for changes that might indicate an attack.  

FIM (file integrity monitoring) uses the Azure Change Tracking solution to track and identify changes in your environment. When FIM is enabled, you have a **Change Tracking** resource of type **Solution**. If you remove the **Change Tracking** resource, you'll also disable the File Integrity Monitoring feature in Defender for Cloud. FIM lets you take advantage of [Change Tracking](../automation/change-tracking/overview.md) directly in Defender for Cloud. For data collection frequency details, see [Change Tracking data collection details](../automation/change-tracking/overview.md#change-tracking-and-inventory-data-collection).

Defender for Cloud recommends entities to monitor with FIM, and you can also define your own FIM policies or entities to monitor. FIM informs you about suspicious activity such as:

- File and registry key creation or removal
- File modifications (changes in file size, access control lists, and hash of the content)
- Registry modifications (changes in size, access control lists, type, and content)

Many regulatory compliance standards require implementing FIM controls, such as PCI-DSS and ISO 17799.

## Which files should I monitor?

When choosing which files to monitor, consider the files that are critical for your system and applications. Monitor files that you don’t expect to change without planning. If you choose files that are frequently changed by applications or operating system (such as log files and text files) it will create noise, making it difficult to identify an attack.

Defender for Cloud provides the following list of recommended items to monitor based on known attack patterns.

|Linux files|Windows files|Windows registry keys (HKLM = HKEY_LOCAL_MACHINE)|
|:----|:----|:----|
|/bin/login|C:\autoexec.bat|HKLM\SOFTWARE\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{C689AAB8-8E78-11D0-8C47-00C04FC295EE}|
|/bin/passwd|C:\boot.ini|HKLM\SOFTWARE\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{603BCC1F-4B59-4E08-B724-D2C6297EF351}|
|/etc/*.conf|C:\config.sys|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\IniFileMapping\SYSTEM.ini\boot|
|/usr/bin|C:\Windows\system.ini|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows|
|/usr/sbin|C:\Windows\win.ini|HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon|
|/bin|C:\Windows\regedit.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders|
|/sbin|C:\Windows\System32\userinit.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders|
|/boot|C:\Windows\explorer.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run|
|/usr/local/bin|C:\Program Files\Microsoft Security Client\msseces.exe|HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce|
|/usr/local/sbin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnceEx|
|/opt/bin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunServices|
|/opt/sbin||HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\RunServicesOnce|
|/etc/crontab||HKLM\SOFTWARE\WOW6432Node\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{C689AAB8-8E78-11D0-8C47-00C04FC295EE}|
|/etc/init.d||HKLM\SOFTWARE\WOW6432Node\Microsoft\Cryptography\OID\EncodingType 0\CryptSIPDllRemoveSignedDataMsg\{603BCC1F-4B59-4E08-B724-D2C6297EF351}|
|/etc/cron.hourly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\IniFileMapping\system.ini\boot|
|/etc/cron.daily||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\Windows|
|/etc/cron.weekly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows NT\CurrentVersion\Winlogon|
|/etc/cron.monthly||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnce|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunOnceEx|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunServices|
|||HKLM\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\RunServicesOnce|
|||HKLM\SYSTEM\CurrentControlSet\Control\hivelist|
|||HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\KnownDLLs|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\DomainProfile|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\PublicProfile|
|||HKLM\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\StandardProfile|

## Next steps

In this article, you learned about File Integrity Monitoring (FIM) in Defender for Cloud. 

Next, you can:

- [Enable File Integrity Monitoring when using the Azure Monitor Agent](file-integrity-monitoring-enable-ama.md)
- [Enable File Integrity Monitoring when using the Log Analytics agent](file-integrity-monitoring-enable-log-analytics.md)